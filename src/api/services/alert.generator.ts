// -----------------------------------------------------------------------------
// generateBudgetAlert
// -----------------------------------------------------------------------------
// Cette fonction est responsable de vérifier si un budget a été dépassé et,
// si c’est le cas, de créer une alerte pour l’utilisateur. Elle est appelée
// immédiatement après la création d’une transaction, car chaque nouvelle
// dépense peut potentiellement faire dépasser un budget.
//
// Étapes :
// 1. Récupérer le budget concerné avec toutes ses transactions et sa catégorie.
// 2. Calculer le total dépensé dans ce budget.
// 3. Vérifier si le budget est dépassé. Si non → aucune action.
// 4. Calculer le montant dépassé (exceededAmount).
// 5. Vérifier si une alerte existe déjà pour cette catégorie afin d’éviter
//    la création de doublons.
// 6. Si aucune alerte n’existe → créer une nouvelle alerte.
// 7. Retourner l’alerte créée ou existante.
//
// Cette logique garantit :
// - qu’une seule alerte est créée par catégorie,
// - qu’elle est générée au bon moment (après une transaction),
// - qu’elle contient les informations nécessaires pour l’interface utilisateur.
// -----------------------------------------------------------------------------

import { prisma } from "../lib/prisma.js";

export const generateBudgetAlert = async (budgetId: number, userId: number) => {
  // 1. Récupérer le budget avec ses transactions et sa catégorie
  const budget = await prisma.budget.findFirst({
    where: { id: budgetId, userId },
    include: {
      transactions: true,
      category: true,
    },
  });

  // Si le budget n'existe pas → rien à faire
  if (!budget) return null;

  // 2. Calcul du total dépensé
  const spent = budget.transactions.reduce(
    (sum: number, t: { amount: any }) => sum + Number(t.amount),
    0
  );

  // 3. Si le budget n'est pas dépassé → aucune alerte
  if (spent <= budget.limit_amount) return null;

  // 4. Calcul du montant dépassé
  const exceededAmount = spent - budget.limit_amount;

  // 5. Vérifier si une alerte existe déjà pour cette catégorie
  const existingAlert = await prisma.alert.findFirst({
    where: {
      userId,
      categoryName: budget.category.name,
    },
  });

  // Si une alerte existe déjà → ne pas en créer une nouvelle
  if (existingAlert) return existingAlert;

  // 6. Créer une nouvelle alerte
  const alert = await prisma.alert.create({
    data: {
      userId,
      categoryName: budget.category.name,
      exceededAmount,
    },
  });

  // 7. Retourner l’alerte créée
  return alert;
};
