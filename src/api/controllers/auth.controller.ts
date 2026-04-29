import type { Request, Response } from "express";
import argon2 from "argon2";
import { config } from "../config.ts";
import type { Token, User } from "../models/index.ts";
import { prisma } from "../lib/prisma.js";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../lib/error.ts"
import { generateAuthTokens } from "../lib/tokens.ts";
import { registerSchema, loginSchema } from "../validators/auth.validator.js"; // import de registerSchema ZOD

// Contrôleur appelé par POST /auth/register
// Il reçoit les données du formulaire d'inscription et crée un nouvel utilisateur en base
export async function register(req: Request, res: Response) {

  // On valide le body avec le schéma Zod
  // safeParse ne lève pas d'erreur, il retourne { success, data } ou { success, error }
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    // On récupère le premier problème de validation (ex: mot de passe trop court)
    // et on renvoie un message lisible au front avec le nom du champ concerné
    const firstIssue = result.error.issues[0];
    res.status(400).json({
      message: firstIssue?.message ?? "Données invalides",
      field: firstIssue?.path[0] as string | undefined,
    });
    return;
  }

  // Si la validation passe, on extrait les champs depuis result.data (typé et sûr)
  const { first_name, last_name, email, password, photo } = result.data;

  // On vérifie que l'email n'est pas déjà utilisé dans la base
  // findUnique retourne null si aucun utilisateur n'a cet email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "Cet email est déjà utilisé", field: "email" });
    return;
  }

  // On ne stocke jamais un mot de passe en clair
  // argon2 est un algorithme de hachage sécurisé, conçu pour être lent et résistant aux attaques
  const hashedPassword = await argon2.hash(password);

  // On crée l'utilisateur en base via Prisma
  // Le champ select permet de choisir exactement ce qu'on retourne — le hash du mot de passe est volontairement exclu
  const user = await prisma.user.create({
    data: { first_name, last_name, email, password: hashedPassword, photo: photo ?? null },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      photo: true,
      createdAt: true,
    },
  });

  // Tout s'est bien passé : on retourne un 201 (ressource créée) avec les infos du nouvel utilisateur
  res.status(201).json({ message: "Inscription réussie", user });
}

export async function login(req: Request, res: Response) {
  // On lance la validation du body de la requete avec le schéma Zod (safeParseAsync ne plante pas en cas d'erreur)
  const result = await loginSchema.safeParseAsync(req.body);
  // Bouncer : si la validation échoue, on renvoie une 400 avec un message d'erreur clair (ex: mot de passe trop court) et le champ concerné
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    res.status(400).json({
      message: firstIssue?.message ?? "Données invalides",
      field: firstIssue?.path[0] as string | undefined,
    });
    return;
  }
  
  // Si le bouncer a laissé passer la requete, on valide le payload (nature des valeurs)
  const { email, password } = result.data;



  // Récupérer l'utilisateur dans la BDD
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw new UnauthorizedError(
      "Le login et le mot de passe ne correspondent pas",
    );
  }
  // Vérifier que le mot de passe et le hash correspondent
  const isMatching = await argon2.verify(user.password, password);
  if (!isMatching) {
    throw new UnauthorizedError(
      "Le login et le mot de passe ne correspondent pas",
    );
  }

  // Générer les 2 tokens (access/refresh)
  const { accessToken, refreshToken } = generateAuthTokens(user);

  // Stocker le refresh token en BDD
await replaceRefreshTokenInDatabase(refreshToken, user);

setAccessTokenCookie(res, accessToken);
setRefreshTokenCookie(res, refreshToken);

// Renvoyer les token vers l'utilisateur
res.json({
  accessToken,
  refreshToken,
});
}


async function replaceRefreshTokenInDatabase(refreshToken: Token, user: User) {
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken.token,
      userId: user.id,
      createdAt: new Date(),
      expiresAt: new Date(new Date().getTime() + refreshToken.expiresIn),
    },
  });
}

function setAccessTokenCookie(res: Response, accessToken: Token) {
  res.cookie("accessToken", accessToken.token, {
    httpOnly: true,
    secure: config.isProd, // HTTPS uniquement en production
    sameSite: config.isProd ? "none" : "lax", // pareil que pour le refresh token, en local on peut se permettre "lax" pour que ça fonctionne en HTTP
    maxAge: accessToken.expiresIn,
  });
}

function setRefreshTokenCookie(res: Response, refreshToken: Token) {
  res.cookie("refreshToken", refreshToken.token, {
    httpOnly: true, // Le cookie n'est pas accessible via JavaScript, ce qui protège contre les attaques XSS
    // En production (sur Vercel/Heroku/etc. en HTTPS), secure doit être true.
    // En développement local (sur http://localhost), secure doit être false, 
    // sinon le navigateur refusera purement et simplement le cookie.
    secure: config.isProd, 
    // Si sameSite est sur "none" (requis pour des requêtes cross-domain en prod), les navigateurs EXIGENT que secure soit true.
    // Comme en local secure est false, sameSite="none" faisait crasher le cookie. Solution : En local, on utilise "lax" (qui accepte le HTTP), et en prod "none".
    sameSite: config.isProd ? "none" : "lax",
    maxAge: refreshToken.expiresIn,
    path: "/auth/refresh",
  });
}

export async function refresh(req: Request, res: Response) {
  // Vérification d'abord dans les cookies, sinon dans le body (au cas où le client ne gère pas les cookies, en dev par exemple)
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken; 

  if (!refreshToken) {
    throw new BadRequestError("Refresh token manquant");
  }

  //Vérifier que le refresh token existe en BDD et n'est pas expiré
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token invalide ou expiré");
  }

  const user = storedToken.user;

  //Générer de nouveaux tokens
  const newTokens = generateAuthTokens(user);

  //Mettre à jour le refresh token en BDD (ancien token supprimé, nouveau token créé)
  await replaceRefreshTokenInDatabase(newTokens.refreshToken, user);

  //Mettre à jour les cookies
  setAccessTokenCookie(res, newTokens.accessToken);
  setRefreshTokenCookie(res, newTokens.refreshToken);

  //Renvoyer les nouveaux tokens, le refresh token est dans le cookie, c'est plus sécurisé
  res.json({ accessToken: newTokens.accessToken.token });
}
