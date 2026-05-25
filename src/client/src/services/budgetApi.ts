import type { Budget, CreateBudgetPayload, BudgetStatus } from "../types/budget";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/budgets`;

// GET /budgets — tous les budgets de l'utilisateur connecté
export async function fetchBudgets(): Promise<Budget[]>{
    const response = await fetch(API_URL,{
        method: "GET",
        credentials:"include",
        cache:"no-store",
    });
    if (!response.ok) {
        throw new Error(`Erreur ${response.status} en chargeant les budgets`)
    }
    return response.json();
}

// POST /budgets — créer un budget

export async function createBudget(payload: CreateBudgetPayload): Promise<Budget> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        throw new Error(`Erreur ${response.status} en créant le budget`)
    }
    return response.json() as Promise<Budget>
}

// PATCH /budgets/:id — modifier un budget

export async function updateBudget(
    id: number,
    data :Partial<CreateBudgetPayload>
    ): Promise<Budget[]> {
        const response = await fetch(`${API_URL}/${id}`, {
            method:"PATCH",
            headers: {  "Content-type" : "application/json"},
            credentials: "include",
            body: JSON.stringify(data)            
            });
        if (!response.ok) {
            throw new Error(`Erreur ${response.status} en modifiant le budget`)
        }
        return response.json()
}

// DELETE /budgets/:id — supprimer un budget

export async function deleteBudget(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
    if (!response.ok) {
        throw new Error(`Erreur ${response.status} en supprimant le budget`)
    }
    return response.json()

}

// GET /budgets/:id/status — dépensé / restant / pourcentage

export async function fetchBudgetStatus(id: number): Promise<BudgetStatus[]>{
    const response = await fetch(`${API_URL}/${id}/status`,{
        method: "GET",
        credentials:"include",
        cache:"no-store",
    });
    if (!response.ok) {
        throw new Error(`Erreur ${response.status} en chargeant le statut du budget`)
    }
    return response.json();
}
