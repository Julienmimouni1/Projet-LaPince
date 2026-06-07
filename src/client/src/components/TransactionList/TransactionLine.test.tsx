import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TransactionLine from "./TransactionLine";
import type { Transaction } from "../../types/transaction";

describe("Composant TransactionLine", () => {
  // 1. ARRANGE : On prépare des fausses données de transaction (Mock Data)
  
  // Fausse donnée pour une DÉPENSE
  const mockExpense: Transaction = {
    id: 1,
    amount: 50.5,
    date: "2024-04-12T10:00:00.000Z",
    description: "Courses Leclerc",
    categoryId: 2,
    userId: 1,
    budgetId: null,
    category: {
      id: 2,
      name: "Alimentation",
      type: "EXPENSE",
      icon: "ShoppingCart",
    },
  };

  // Fausse donnée pour un REVENU
  const mockIncome: Transaction = {
    id: 2,
    amount: 1500,
    date: "2024-04-01T10:00:00.000Z",
    description: "Salaire",
    categoryId: 1,
    userId: 1,
    budgetId: null,
    category: {
      id: 1,
      name: "Salaire",
      type: "INCOME",
      icon: "Banknote",
    },
  };

  // On prépare nos "espions" (fonctions factices) pour écouter les clics
  const mockOnUpdateRequest = vi.fn();
  const mockOnDeleteRequest = vi.fn();

  // Avant chaque test, on remet les compteurs des espions à zéro
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- TESTS DE FORMATAGE VISUEL ---

  it("doit formater correctement une dépense (date, montant, description)", () => {
    // ACT : On rend le composant avec les données de dépense
    render(
      <TransactionLine 
        transaction={mockExpense} 
        onUpdateRequest={mockOnUpdateRequest} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    );

    // ASSERT : On vérifie ce que voit l'utilisateur à l'écran
    
    // 1. La description "Courses Leclerc" doit être affichée
    expect(screen.getByText("Courses Leclerc")).toBeInTheDocument();
    
    // 2. La date "2024-04-12..." doit être formatée en "12/04"
    expect(screen.getByText("12/04")).toBeInTheDocument();
    
    // 3. Le montant 50.5 doit devenir "-50,50€" pour une dépense
    expect(screen.getByText("-50,50€")).toBeInTheDocument();
  });

  it("doit formater correctement un revenu (signe +)", () => {
    // ACT : On rend le composant avec les données de revenu
    render(
      <TransactionLine 
        transaction={mockIncome} 
        onUpdateRequest={mockOnUpdateRequest} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    );

    // ASSERT : Le montant 1500 doit devenir "+1500,00€"
    expect(screen.getByText("+1500,00€")).toBeInTheDocument();
  });

  it("doit afficher le nom de la catégorie si aucune description n'est fournie", () => {
    // ARRANGE : On crée une transaction sans description
    const noDescTransaction = { ...mockExpense, description: null };
    
    // ACT
    render(
      <TransactionLine 
        transaction={noDescTransaction} 
        onUpdateRequest={mockOnUpdateRequest} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    );

    // ASSERT : Le nom de la catégorie "Alimentation" doit remplacer la description
    expect(screen.getByText("Alimentation")).toBeInTheDocument();
  });

  // --- TESTS D'INTERACTION ---

  it("doit appeler onDeleteRequest avec l'ID correct lors d'un clic sur 'Supprimer'", () => {
    render(
      <TransactionLine 
        transaction={mockExpense} 
        onUpdateRequest={mockOnUpdateRequest} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    );

    // ACT : On simule un clic utilisateur sur le bouton "Supprimer"
    const deleteBtn = screen.getByRole("button", { name: /supprimer/i });
    fireEvent.click(deleteBtn);

    // ASSERT : La fonction parent a bien été appelée avec l'ID de la transaction (1)
    expect(mockOnDeleteRequest).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteRequest).toHaveBeenCalledWith(1);
  });

  it("doit appeler onUpdateRequest avec la transaction complète lors d'un clic sur 'Modifier'", () => {
    render(
      <TransactionLine 
        transaction={mockExpense} 
        onUpdateRequest={mockOnUpdateRequest} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    );

    // ACT : On simule un clic utilisateur sur le bouton "Modifier"
    const updateBtn = screen.getByRole("button", { name: /modifier/i });
    fireEvent.click(updateBtn);

    // ASSERT : La fonction parent a bien été appelée avec l'objet transaction entier
    expect(mockOnUpdateRequest).toHaveBeenCalledTimes(1);
    expect(mockOnUpdateRequest).toHaveBeenCalledWith(mockExpense);
  });
});
