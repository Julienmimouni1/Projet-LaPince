import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import * as transactionService from "../services/transaction.service.ts"; // On importe les fonctions du service de transaction pour les utiliser dans les contrôleurs. Cela permet de séparer la logique métier (dans le service) de la gestion des requêtes/réponses (dans le contrôleur), ce qui rend le code plus propre et plus facile à maintenir.
import { generateBudgetAlert } from "../services/alert.generator.js";

import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from "../validators/transaction.validator.js"; // Import des schémas de validation Zod pour les transactions. Ces schémas permettent de valider les données entrantes (body, query params) de manière structurée et de fournir des messages d'erreur clairs en cas de données invalides.

// --- 1. GET /transactions ---
export const getAll = async (req: Request, res: Response) => {
  try {
    // On rassure TypeScript : si pas de user, on bloque.
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    // Validation des filtres (query params)
    const filters = transactionQuerySchema.safeParse(req.query || {});
    if (!filters.success) {
      return res.status(400).json({ erreurs: filters.error.format() });
    }

    // Appel au service (req.user est injecté par le middleware d'auth)
    const transactions = await transactionService.getAllTransactions(
      req.user.id,
      filters.data,
    );

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des transactions",
    });
  }
};

// --- 2. POST /transactions ---
export const create = async (req: Request, res: Response) => {
  try {
    // On rassure TypeScript : si pas de user, on bloque.
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    // Validation stricte du body avec Zod
    const body = createTransactionSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ erreurs: body.error.format() });
    }

    // Appel au service pour la création
    const transaction = await transactionService.createTransaction(
      req.user.id,
      body.data,
    );

    // -------------------------------------------------------------
    // Générer une alerte si le budget est dépassé
    // (Appel au générateur d'alertes, logique métier séparée)
    // -------------------------------------------------------------
    const budget = await prisma.budget.findFirst({
      where: { userId: req.user.id, id_category: transaction.categoryId },
    });
    if (budget) {
      await generateBudgetAlert(budget.id, req.user.id);
    }

    return res.status(201).json(transaction);
  } catch (error: any) {
    // Si le service lève une erreur (ex: "Catégorie introuvable") on l'attrape ici
    if (
      error.message === "Catégorie introuvable" ||
      error.message === "Action non autorisée sur cette catégorie"
    ) {
      return res.status(403).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la création" });
  }
};

// --- 3. GET /transactions/:id ---
export const getOne = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string); // On parse l'ID depuis les paramètres de l'URL. parseInt peut retourner NaN si l'ID n'est pas un nombre valide, d'où la vérification suivante.
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    // On rassure TypeScript : si pas de user, on bloque.
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const transaction = await transactionService.getTransactionById(
      id,
      req.user.id,
    );
    if (!transaction)
      return res.status(404).json({ message: "Transaction introuvable" });

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- 4. PATCH /transactions/:id ---
export const update = async (req: Request, res: Response) => {
  try {
    // On rassure TypeScript : si pas de user, on bloque.
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    // On rassure TypeScript : si pas de user, on bloque.
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Validation Zod partielle
    const body = updateTransactionSchema.safeParse(req.body);
    if (!body.success)
      return res.status(400).json({ erreurs: body.error.format() });

    // Vérification de sécurité passive (existe ET m'appartient)
    const existingTransaction = await transactionService.getTransactionById(
      id,
      req.user.id,
    );
    if (!existingTransaction)
      return res
        .status(404)
        .json({ message: "Transaction introuvable ou non autorisée" });

    const updatedTransaction = await transactionService.updateTransaction(
      id,
      req.user.id,
      body.data,
    );

    // -------------------------------------------------------------
    // ==>>> Générer une alerte si le budget est dépassé
    // -------------------------------------------------------------

    // Trouver le budget lié à cette catégorie
    const budget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        id_category: updatedTransaction.categoryId,
      },
    });

    // Générer l’alerte
    if (budget) {
      await generateBudgetAlert(budget.id, req.user.id);
    }

    return res.status(200).json(updatedTransaction);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- 5. DELETE /transactions/:id ---
export const remove = async (req: Request, res: Response) => {
  try {
    // On rassure TypeScript : si pas de user, on bloque.
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    // Vérification de sécurité passive
    const existingTransaction = await transactionService.getTransactionById(
      id,
      req.user.id,
    );
    if (!existingTransaction)
      return res
        .status(404)
        .json({ message: "Transaction introuvable ou non autorisée" });

    await transactionService.deleteTransaction(id, req.user.id);
    return res.status(204).send(); // 204 = No Content
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
