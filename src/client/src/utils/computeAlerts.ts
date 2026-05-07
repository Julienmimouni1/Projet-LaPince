import type { Transaction } from "../types/transaction";
import type { Alert } from "../types/alert.js";
import type { Budget } from "../types/bugdet.js";

export function computeAlerts(
    transactions: Transaction[],
    budgets : Budget[]
): Alert[] {

    // Etape A : aditionner les depenses par categorie --
    // Map plutot qu'un objet simple pour eviter les collisions avec des noms de propriete JS reservés ("constructor", "toString", etc.)

    const spendingByCategory = new Map<string, number>();

    for (const t of transactions) {
        // On ingore les revnbeus -seules les depênses consomment le budget.
        if (t.amount >= 0) continue;

        const current = spendingByCategory.get(t.category.name) ?? 0;
        // Math.abs car t.amount est négatif (-45.5 -> 45.5)

        spendingByCategory.set(t.category.name, current +  Math.abs(t.amount));


    }

    // --- Etape B : comparer avec les plafonds et construire les alertes ---
    const alerts: Alert[] = []

    for (const budget of budgets) {
        // on utilisebudget.categoryName (champ de commodité mock) pour retrouver les dépenses. En producition, ce serait JSON SQL coté back.

        const spent = spendingByCategory.get(budget.category.name) ?? 0;

        if (spent <= budget.limit_amount) continue; // pas de dépassement

        //parseFloat  + toFixed évite les imprecisions flottantes
        //Ex : 45.5 - 40 = 5.499999 -> toFixed(2) -> "5.50" parseFloat -> 5.5
        const exceededAmount = parseFloat((spent - budget.limit_amount).toFixed(2));

        alerts.push({
            id: budget.id,
            categoryName: budget.category.name,
            exceededAmount,
            isRead: false,
            userId: budget.userId,
            createdAt: new Date().toISOString(),
        });


    }

    return alerts;
}