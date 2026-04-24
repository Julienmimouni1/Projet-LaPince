import type { Request, Response } from "express";
import argon2 from "argon2";
import { prisma } from "../lib/prisma.js";
import { registerSchema } from "../validators/auth.validator.js"; // import de registerSchema ZOD

export async function register(req: Request, res: Response) {


  // 1. Valider les données du body
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const { first_name, last_name, email, password, photo } = result.data;


  // 2. Vérifier que l'email n'existe pas déjà

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "Cet email est déjà utilisé" });
    return;
  }

  // 3. Hacher le mot de passe (jamais stocker en clair)
  const hashedPassword = await argon2.hash(password);  //Utilisation de argon2 pour le hash

  // 4. Créer l'utilisateur en base

  const user = await prisma.user.create({
    data: { first_name, last_name, email, password: hashedPassword, photo },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      photo: true,
      createdAt: true,
      // password: false  ← on n'expose pas le hash dans la réponse
    },
  });

  res.status(201).json({ message: "Inscription réussie", user });
}