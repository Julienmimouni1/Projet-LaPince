import type { Transaction } from "../types/transaction.js";

// Le type Transaction qu'on a défini à l'étape 1 est notre contrat.
// Si ces données compilent correctement, c'est que notre type est bon.
// TypeScript nous protège déjà ici — si Julien change la shape de l'API
// et qu'on met à jour le type, les mocks cassent à la compilation → on le voit tout de suite.
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    amount: 1250,                          // positif → revenu
    date: "2024-04-11T00:00:00.000Z",
    description: "Virement Salaire",
    categoryId: 1,
    category: { id: 1, name: "Salaire" },
  },
  {
    id: 2,
    amount: -45.5,                         // négatif → dépense
    date: "2024-04-12T00:00:00.000Z",
    description: "Supermarché U",
    categoryId: 2,
    category: { id: 2, name: "Alimentation" },
  },
  {
    id: 3,
    amount: -19.9,
    date: "2024-04-05T00:00:00.000Z",
    description: "Abonnement Ciné",
    categoryId: 3,
    category: { id: 3, name: "Loisirs" },
  },
  {
    id: 4,
    amount: 2.9,
    date: "2024-04-03T00:00:00.000Z",
    description: "Télépéage",
    categoryId: 4,
    category: { id: 4, name: "Transport" },
  },
  {
    id: 5,
    amount: 150,
    date: "2024-04-01T00:00:00.000Z",
    description: "Anniversaire",
    categoryId: 5,
    category: { id: 5, name: "Cadeau" },
  },
  // Pour tester que le scroll fonctionne, duplique ces entrées
  // jusqu'à avoir ~15-20 lignes. Le scroll n'est visible que si le contenu dépasse.
];