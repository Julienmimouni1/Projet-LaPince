import type { Budget } from "../types/bugdet"

// Plafonds intentionnellement bas pour déclencher les alertes
// avec les MOCK_TRANSACTIONS (Alimentation 45.50€ > 40€, Loisirs 19.90€ > 10€)
export const MOCK_BUDGETS: Budget[] = [
  {
    id: 1,
    limit_amount: 40,
    period: "monthly",
    id_category: 2,
    userId: 1,
    createdAt: "2024-04-01T00:00:00.000Z",
    updatedAt: "2024-04-01T00:00:00.000Z",
    category: { id: 2, name: "Alimentation", type: "EXPENSE" },
  },
  {
    id: 2,
    limit_amount: 10,
    period: "monthly",
    id_category: 3,
    userId: 1,
    createdAt: "2024-04-01T00:00:00.000Z",
    updatedAt: "2024-04-01T00:00:00.000Z",
    category: { id: 3, name: "Loisirs", type: "EXPENSE" },
  },
  {
    id: 3,
    limit_amount: 50,
    period: "monthly",
    id_category: 4,
    userId: 1,
    createdAt: "2024-04-01T00:00:00.000Z",
    updatedAt: "2024-04-01T00:00:00.000Z",
    category: { id: 4, name: "Transport", type: "EXPENSE" },
  },
];
