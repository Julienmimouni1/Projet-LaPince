import { describe, it, expect, vi, beforeEach } from "vitest";
import * as transactionService from "./transaction.service";
import { prisma } from "../lib/prisma";

// Simulation (Mock) du client Prisma pour éviter de toucher à la vraie base de données
vi.mock("../lib/prisma", () => ({
  prisma: {
    category: {
      findUnique: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
  },
}));

describe("Transaction Service - Unit Tests", () => {
  const mockUserId = 1;
  const mockTransactionData = {
    amount: 50.5,
    date: "2024-03-20T10:00:00.000Z",
    idcategory: 5,
    description: "Courses hebdomadaires",
  };

  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test pour éviter les interférences
    vi.clearAllMocks();
  });

  it("doit créer une transaction avec succès quand la catégorie existe", async () => {
    // ARRANGE : On simule une catégorie existante et une création réussie
    (prisma.category.findUnique as any).mockResolvedValue({ id: 5, name: "Alimentation" });
    (prisma.transaction.create as any).mockResolvedValue({
      id: 100,
      ...mockTransactionData,
      userId: mockUserId,
      categoryId: 5
    });

    // ACT : On appelle le service
    const result = await transactionService.createTransaction(mockUserId, mockTransactionData);

    // ASSERT : Vérifications
    expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(prisma.transaction.create).toHaveBeenCalled();
    expect(result.id).toBe(100);
    expect(result.amount).toBe(50.5);
  });

  it("doit lever une erreur si la catégorie n'existe pas", async () => {
    // ARRANGE : On simule qu'aucune catégorie n'est trouvée
    (prisma.category.findUnique as any).mockResolvedValue(null);

    // ACT & ASSERT : On vérifie que la promesse est rejetée avec le bon message
    await expect(
      transactionService.createTransaction(mockUserId, mockTransactionData)
    ).rejects.toThrow("Catégorie introuvable");

    // Sécurité supplémentaire : On vérifie que la transaction n'a pas été créée
    expect(prisma.transaction.create).not.toHaveBeenCalled();
  });
});
