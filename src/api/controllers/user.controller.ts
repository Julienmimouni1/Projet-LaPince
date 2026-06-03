import type { Request, Response } from "express";
import argon2 from "argon2";
import { prisma } from "../lib/prisma.js";
import { updateUserSchema } from "../validators/user.validator.js"

//GET /users/me
// Retourne le profil de l'utilisateur connecté (sans le mot de passe)
export async function getMe(req: Request, res : Response) {
    const id = req.user!.id;

    const user = await prisma.user.findUnique({
        where: { id },
        select: { //On utilise select pour ne pas exposer le password
            id:         true,
            first_name: true,
            last_name:  true,
            email:      true,
            photo:      true,
            createdAt:  true,
        },

    });

    if (!user) {
        res.status(404).json({ message: "Utilsateur introuvable" });
        return;
    }

    res.status(200).json({ user })
}

// PATCH /users/me
// Met à Jour les informations du profil
export async function updateMe(req: Request, res: Response) {
    const id = req.user!.id;

    // Validation des données entrantes avec Zod (même pattern que auth.controller)
    const result = updateUserSchema.safeParse(req.body) 
    
    if (!result.success) {
    const firstIssue = result.error.issues[0]
    res.status(400).json({
        message: firstIssue?.message ?? "Données invalides",
        field:   firstIssue?.path[0] as string |  undefined
    });

    return;
    }

    const {first_name, last_name, email, password, photo } = result.data;

    //Si l'utilisateur veut change l'email, on verifie qu'il n'est déjà pris

    if(email) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing && existing.id !==id) {
            res.status(409).json({ message: "Cet email est deja utilisé",  field: "email" });
            return;
        }
    }

    // Si l'utilisateur veut changer de mot de passe, on le hache avant de le stocker
    const hashedPassword = password ? await argon2.hash(password) : undefined;

    const user = await prisma.user.update({
        where: { id },
        data: {
            ...(first_name && { first_name }),
            ...(last_name && { last_name }),
            ...(email     && { email }),
            ...(photo     !== undefined && { photo }),
            ...(hashedPassword && { password: hashedPassword }),
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            photo: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    res.status(200).json({ message: "Profil mis à jour", user });
}


// DELETE /users/me
// Supprime le compte utilisateur

export async function deleteMe(req: Request, res: Response) {
    const id = req.user!.id;

    const existing = await prisma.user.findUnique({where: { id } });
    if (!existing) {
        res.status(404).json({ message : "Utilisateur introuvable"})
        return;
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({ message: "Compte supprimé avec succés" })

}