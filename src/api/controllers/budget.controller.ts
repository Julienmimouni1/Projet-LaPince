import type { Request, Response } from "express";
import * as budgetService from "../services/budget.service.ts";
import { createBudgetSchema, updateBudgetSchema } from "../validators/budget.validator.js";

// --- 1. GET /budgets ---
export const getBudgets = async (req: Request, res: Response) => {
  try {
    // Vérifie que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Récupère tous les budgets de l'utilisateur
    const budgets = await budgetService.getAllBudgets(req.user.id);

    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur lors de la récupération des budgets" });
  }
};

// --- 2. POST /budgets ---
export const createBudget = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Validation du body avec Zod
    const body = createBudgetSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ erreurs: body.error.format() });
    }

    // Création du budget
    const budget = await budgetService.createBudget(req.user.id, body.data);

    // Vérification rétroactive des dépenses
    const retroactiveStatus = await budgetService.checkAndCreateRetroactiveAlert(req.user.id, budget);

    return res.status(201).json({
      ...budget,
      alreadyExceeded: retroactiveStatus.alreadyExceeded,
      currentTotal: retroactiveStatus.total,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur lors de la création du budget" });
  }
};

// --- 3. GET /budgets/:id ---
export const getBudgetById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    const budget = await budgetService.getBudgetById(id, req.user.id);
    if (!budget) return res.status(404).json({ message: "Budget introuvable" });

    return res.status(200).json(budget);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- 4. PATCH /budgets/:id ---
export const updateBudget = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    // 1. Vérifier que le budget appartient bien à l'utilisateur connecté
    const existing = await budgetService.getBudgetById(id, req.user.id);
    if (!existing) return res.status(404).json({ message: "Budget introuvable" });

    // Validation du body avec Zod
    const body = updateBudgetSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ erreurs: body.error.format() });
    }

    // 2. Mettre à jour le budget
    const updated = await budgetService.updateBudget(id, req.user.id, body.data);

    // 3. Supprimer les alertes obsolètes liées à ce budget
    await budgetService.deleteAlertsByBudget(updated.id);

    // 4. Recalcul rétroactif
    const retroactiveStatus = await budgetService.checkAndCreateRetroactiveAlert(req.user.id, updated);

    return res.status(200).json({
      ...updated,
      alreadyExceeded: retroactiveStatus.alreadyExceeded,
      currentTotal: retroactiveStatus.total,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
};

// --- 5. DELETE /budgets/:id ---
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    await budgetService.deleteBudget(id, req.user.id);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
};

// --- 6. GET /budgets/:id/status ---

export const getBudgetStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    const status = await budgetService.getBudgetStatus(id, req.user.id);
    if (!status) return res.status(404).json({ message: "Budget introuvable" });

    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur lors du calcul du statut" });
  }
};
