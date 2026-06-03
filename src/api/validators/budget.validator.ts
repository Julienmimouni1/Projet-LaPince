import { z } from "zod";

// Schéma pour POST /budgets
export const createBudgetSchema = z.object({
  limit_amount: z.number().positive(),
  period: z.enum(["weekly", "monthly", "custom"]),
  id_category: z.number().int().positive(),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
});

// Schéma pour PATCH /budgets/:id
export const updateBudgetSchema = z.object({
  limit_amount: z
    .number()
    .positive("Le montant doit être positif")
    .optional(),

  period: z
    .enum(["weekly", "monthly", "custom"], {
      message: "La période doit être 'weekly', 'monthly' ou 'custom'",
    })
    .optional(),

  id_category: z
    .number()
    .int("L'identifiant doit être un entier")
    .positive("Catégorie invalide")
    .optional(),

  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
});
