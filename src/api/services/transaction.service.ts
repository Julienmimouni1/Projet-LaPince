// Ce service contient la logique métier liée aux transactions, comme la création d'une transaction, la validation des données, etc.
// Il interagit avec la base de données via Prisma pour effectuer les opérations nécessaires.
// Par exemple, la fonction createTransaction pourrait recevoir les données d'une nouvelle transaction, vérifier que l'utilisateur a suffisamment de fonds, créer la transaction en base, mettre à jour le solde de l'utilisateur, etc.
// En séparant la logique métier dans un service, on garde les contrôleurs propres et centrés sur la gestion des requêtes/réponses, ce qui facilite la maintenance et les tests.

import { prisma } from "../lib/prisma.js";

// --- 1. Récupérer toutes les transactions avec les filtres ---
export const getAllTransactions = async (iduser: number, filters: any) => {
  // On reçoit l'id de l'utilisateur et les filtres (idcategory, startDate, endDate) depuis le contrôleur
  return prisma.transaction.findMany({
    where: {
      userId: iduser,
      ...(filters.idcategory && { categoryId: filters.idcategory }),
      ...(filters.startDate && { date: { gte: new Date(filters.startDate) } }),
      ...(filters.endDate && { date: { lte: new Date(filters.endDate) } }),
    },
    orderBy: { date: "desc" }, // On trie les transactions par date décroissante pour afficher les plus récentes en premier
    include: { category: true }, // On inclut la catégorie pour avoir le type (income/expense) côté front
  });
};

// --- 2. Créer une transaction ---
export const createTransaction = async (iduser: number, data: any) => {
  // A. Vérification de la catégorie
  const category = await prisma.category.findUnique({
    where: { id: data.idcategory },
  });

  if (!category) {
    throw new Error("Catégorie introuvable");
  }

  // La catégorie doit être "par défaut" OU appartenir à l'utilisateur
  if (category.is_default && category.id_user !== iduser) {
    throw new Error("Action non autorisée sur cette catégorie");
  }

  // B. Création de la transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId: iduser,
      amount: String(data.amount),
      date: new Date(data.date),
      categoryId: Number(data.idcategory),
      description: data.description ?? null,
      budgetId: data.budgetId ? Number(data.budgetId) : null,
    },
    include: { category: true }, // On inclut la catégorie pour avoir le type (income/expense) côté front
  });

  // C. TODO pour plus tard : Vérifier le budget et générer une alerte
  // await checkBudgetAndCreateAlert(iduser, data.idcategory);

  return transaction;
};

// --- 3. Récupérer une transaction par son ID ---
export const getTransactionById = async (id: number, iduser: number) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: iduser }, // On s'assure que la transaction appartient bien à l'utilisateur connecté pour éviter les accès non autorisés
    include: { category: true },
  });
  if (!transaction) {
    throw new Error("Transaction introuvable");
  }
  return transaction;
};

// --- 4. Mettre à jour une transaction ---
export const updateTransaction = async (
  idtransaction: number,
  iduser: number,
  data: any,
) => {
  // On passe la date en objet Date si elle a été modifiée
  const updateData = { ...data };
  if (data.date) updateData.date = new Date(data.date);

  return prisma.transaction.update({
    where: { id: idtransaction }, // On identifie la transaction à mettre à jour par son ID
    data: updateData,
  });
};

// --- 5. Supprimer une transaction
export const deleteTransaction = async (id: number, iduser: number) => {
  await prisma.transaction.deleteMany({ where: { id, iduser } });
};
