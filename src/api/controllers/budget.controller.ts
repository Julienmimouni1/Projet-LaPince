// Contrôleur de gestion des budgets : création, lecture, mise à jour, suppression et statut
// -------------------------------------------------------------------------

import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

import {
  createBudgetSchema,
  updateBudgetSchema,
} from "../validators/budget.validator.js";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../lib/error.ts";

// -----------------------------------------------------------------------------
// GET /budgets
// Récupère tous les budgets appartenant à l'utilisateur connecté
// -----------------------------------------------------------------------------
export async function getBudgets(req: Request, res: Response) {
  // Extraction sécurisée de l'identité utilisateur depuis le JWT
  const user = req.user as { id: number; userId?: number; email: string };
  const userId = user.userId ?? user.id;

  // Recherche de tous les budgets liés à cet utilisateur
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { category: true },
  });

  res.json(budgets);
}

// -----------------------------------------------------------------------------
// GET /budgets/:id
// Récupère un budget spécifique appartenant à l'utilisateur connecté
// -----------------------------------------------------------------------------
export async function getBudgetById(req: Request, res: Response) {
  const id = Number(req.params.id);

  // Extraction de l'utilisateur connecté
  const user = req.user as { id: number; userId?: number; email: string };
  const userId = user.userId ?? user.id;

  // Vérification de la validité de l'identifiant
  if (isNaN(id)) throw new BadRequestError("Identifiant invalide");

  // Recherche du budget
  const budget = await prisma.budget.findUnique({
    where: { id },
    include: { category: true },
  });

  // Gestion des erreurs
  if (!budget) throw new NotFoundError("Budget introuvable");
  if (budget.userId !== userId)
    throw new UnauthorizedError("Accès refusé à ce budget");

  res.json(budget);
}

// -----------------------------------------------------------------------------
// POST /budgets
// Crée un nouveau budget pour l'utilisateur connecté
// -----------------------------------------------------------------------------
export async function createBudget(req: Request, res: Response) {
  // Extraction de l'utilisateur connecté
  const user = req.user as { id: number; userId?: number; email: string };
  const userId = user.userId ?? user.id;

  // Validation des données via Zod
  const result = createBudgetSchema.safeParse(req.body);
  if (!result.success) {
    const issue = result.error.issues?.[0];
    throw new BadRequestError(issue?.message ?? "Erreur de validation");
  }

  const { limit_amount, period, id_category } = result.data;

  // Création du budget
  const budget = await prisma.budget.create({
    data: {
      limit_amount,
      period,
      id_category,
      userId,
    },
  });

  res.status(201).json(budget);
}

// -----------------------------------------------------------------------------
// PATCH /budgets/:id
// Met à jour partiellement un budget existant
// -----------------------------------------------------------------------------
export async function updateBudget(req: Request, res: Response) {
  const id = Number(req.params.id);

  // Extraction de l'utilisateur connecté
  const user = req.user as { id: number; userId?: number; email: string };
  const userId = user.userId ?? user.id;

  // Vérification de l'identifiant
  if (isNaN(id)) throw new BadRequestError("Identifiant invalide");

  // Validation des données via Zod
  const result = updateBudgetSchema.safeParse(req.body);
  if (!result.success) {
    const issue = result.error.issues?.[0];
    throw new BadRequestError(issue?.message ?? "Erreur de validation");
  }

  // Vérification de l'existence du budget
  const existing = await prisma.budget.findUnique({
    where: { id },
  });

  if (!existing) throw new NotFoundError("Budget introuvable");
  if (existing.userId !== userId)
    throw new UnauthorizedError("Accès refusé");

  // Mise à jour du budget
  const updated = await prisma.budget.update({
    where: { id },
    data: result.data,
  });

  res.json(updated);
}

// -----------------------------------------------------------------------------
// DELETE /budgets/:id
// Supprime un budget appartenant à l'utilisateur connecté
// -----------------------------------------------------------------------------
export async function deleteBudget(req: Request, res: Response) {
  const id = Number(req.params.id);

  // Extraction de l'utilisateur connecté
  const user = req.user as { id: number; userId?: number; email: string };
  const userId = user.userId ?? user.id;

  // Vérification de l'identifiant
  if (isNaN(id)) throw new BadRequestError("Identifiant invalide");

  // Vérification de l'existence du budget
  const existing = await prisma.budget.findUnique({
    where: { id },
  });

  if (!existing) throw new NotFoundError("Budget introuvable");
  if (existing.userId !== userId)
    throw new UnauthorizedError("Accès refusé");

  // Suppression du budget
  await prisma.budget.delete({
    where: { id },
  });

  res.status(204).send();
}

// -----------------------------------------------------------------------------
// GET /budgets/:id/status
// Calcule le statut du budget : dépensé, restant, pourcentage utilisé
// -----------------------------------------------------------------------------
export async function getBudgetStatus(req: Request, res: Response) {
  const id = Number(req.params.id);

  // Extraction de l'utilisateur connecté
  const user = req.user as { id: number; userId?: number; email: string };
  const userId = user.userId ?? user.id;

  // Vérification de l'identifiant
  if (isNaN(id)) throw new BadRequestError("Identifiant invalide");

  // Récupération du budget
  const budget = await prisma.budget.findUnique({
    where: { id },
  });

  if (!budget) throw new NotFoundError("Budget introuvable");
  if (budget.userId !== userId)
    throw new UnauthorizedError("Accès refusé");

  // Calcul de la période temporelle
  const { start, end } = computePeriodRange(budget.period);

  // Calcul du total dépensé dans la période
  const spent = await prisma.transaction.aggregate({
    where: {
      id_category: budget.id_category,
      date: { gte: start, lte: end },
    },
    _sum: { amount: true },
  });

  const totalSpent = spent._sum.amount ?? 0;
  const remaining = budget.limit_amount - totalSpent;
  const percent = (totalSpent / budget.limit_amount) * 100;

  res.json({
    spent: totalSpent,
    remaining,
    percent,
    start,
    end,
  });
}

// -----------------------------------------------------------------------------
// Fonction utilitaire : calcule la période temporelle selon le type de budget
// -----------------------------------------------------------------------------
function computePeriodRange(period: string) {
  const now = new Date();

  if (period === "monthly") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    };
  }

  if (period === "weekly") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now.setDate(diff));
    const end = new Date(now.setDate(start.getDate() + 6));
    return { start, end };
  }

  throw new BadRequestError("Période non supportée");
}
