// Service Budget
// -------------------------------------------------------------
// Ce fichier contient toute la logique métier liée aux budgets.
// Le contrôleur appelle ces fonctions pour interagir avec la base
// de données via Prisma. Cela permet de séparer la logique métier
// de la gestion des requêtes HTTP, rendant le code plus propre
// et plus facile à maintenir.

import { prisma } from "../lib/prisma.js";

// -------------------------------------------------------------
// 1. Récupérer tous les budgets d'un utilisateur
// -------------------------------------------------------------
export const getAllBudgets = async (userId: number) => {
  return prisma.budget.findMany({
    where: { userId },
    include: {
      category: true,       // Inclure la catégorie associée
      transactions: true,   // Inclure les transactions liées
    },
  });
};

// -------------------------------------------------------------
// 2. Créer un nouveau budget
// -------------------------------------------------------------
export const createBudget = async (userId: number, data: any) => {
  return prisma.budget.create({
    data: {
      userId,
      id_category: data.id_category,
      limit_amount: data.limit_amount,
      period: data.period,
      month: data.month,
      year: data.year,
    },
  });
};

// -------------------------------------------------------------
// 3. Vérifier rétroactivement les dépenses pour un nouveau budget
// -------------------------------------------------------------
export const checkAndCreateRetroactiveAlert = async (userId: number, budget: any) => {
  // Si le budget n'a pas de mois/année, on ne peut pas faire de check rétroactif précis
  if (!budget.month || !budget.year) return { alreadyExceeded: false, total: 0 };

  // Calculer la période
  const startDate = new Date(budget.year, budget.month - 1, 1);
  const endDate = new Date(budget.year, budget.month, 1);

  // Récupérer la somme des dépenses existantes pour cette catégorie/période
  const existingTotal = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId: userId,
      categoryId: budget.id_category,
      category: {
        type: 'EXPENSE'
      },
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  const total = Number(existingTotal._sum.amount ?? 0);
  const isExceeded = total >= budget.limit_amount;

  if (isExceeded) {
    // Vérifier si une alerte existe déjà pour cette catégorie/utilisateur
    const existingAlert = await prisma.alert.findFirst({
      where: {
        userId,
        categoryId: budget.id_category,
      },
    });

    const exceededAmount = total - budget.limit_amount;

    if (existingAlert) {
      await prisma.alert.update({
        where: { id: existingAlert.id },
        data: { isRead: false, exceededAmount },
      });
    } else {
      await prisma.alert.create({
        data: {
          userId,
          categoryId: budget.id_category,
          exceededAmount,
          isRead: false,
        },
      });
    }
  }

  return { alreadyExceeded: isExceeded, total };
};

// -------------------------------------------------------------
// 4. Récupérer un budget spécifique par ID
// -------------------------------------------------------------
export const getBudgetById = async (id: number, userId: number) => {
  return prisma.budget.findFirst({
    where: { id, userId },
    include: {
      category: true,
      transactions: true,
    },
  });
};

// -------------------------------------------------------------
// 4. Mettre à jour un budget existant
// -------------------------------------------------------------
export const updateBudget = async (id: number, userId: number, data: any) => {
  return prisma.budget.update({
    where: { id },
    data,
  });
};

// -------------------------------------------------------------
// 5. Supprimer un budget
// -------------------------------------------------------------
export const deleteBudget = async (id: number, userId: number) => {
  return prisma.budget.delete({
    where: { id },
  });
};

// -------------------------------------------------------------
// 6. Calculer le statut d'un budget
//    (dépensé, restant, pourcentage consommé)
// -------------------------------------------------------------

// Cette fonction calcule le statut complet d’un budget donné pour un utilisateur.
// Elle récupère d’abord le budget correspondant dans la base de données, ainsi que
// toutes les transactions associées et la catégorie liée. Si aucun budget n’est trouvé
// (soit parce qu’il n’existe pas, soit parce qu’il n’appartient pas à l’utilisateur),
// la fonction renvoie null.
//
// Une fois le budget récupéré, la fonction calcule :
//
// 1. Le montant total dépensé (“spent”) :
//    - en additionnant toutes les transactions liées au budget.
//    - chaque transaction possède un montant (“amount”), converti en nombre.
//
// 2. Le montant restant (“remaining”) :
//    - en soustrayant le total dépensé du montant limite du budget.
//
// 3. Le pourcentage consommé (“percent”) :
//    - en divisant le total dépensé par la limite du budget, puis en multipliant par 100.
//
// Enfin, la fonction renvoie un objet contenant toutes les informations utiles pour
// l’interface utilisateur :
//    - l’identifiant du budget,
//    - le nom de la catégorie,
//    - la limite définie,
//    - le total dépensé,
//    - le montant restant,
//    - et le pourcentage consommé.
//
// Ces données permettent d’afficher un suivi clair et visuel de l’état du budget,
// par exemple sous forme de barre de progression ou de graphique.


export const getBudgetStatus = async (budgetId: number, userId: number) => {
  // Récupérer le budget avec ses transactions
  const budget = await prisma.budget.findFirst({
    where: { id: budgetId, userId },
    include: {
      transactions: true,
      category: true,
    },
  });

  if (!budget) return null;

  // Calcul du total dépensé
  const spent = budget.transactions.reduce(
    (sum: number, t: { amount: any }) => sum + Number(t.amount),
    0
  );

  // Montant restant
  const remaining = budget.limit_amount - spent;

  // Pourcentage consommé
  const percent = (spent / budget.limit_amount) * 100;

  return {
    budgetId: budget.id,
    category: budget.category.name,
    limit: budget.limit_amount,
    spent,
    remaining,
    percent,
  };
};
