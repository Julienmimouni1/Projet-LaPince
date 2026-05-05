export type Transaction = {
  id: number;
  amount: number;
  date: string;
  description: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
    type: "EXPENSE" | "INCOME";
  };
};