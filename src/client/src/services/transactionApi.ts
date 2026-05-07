import type { Transaction } from "../types/transaction";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/transactions`;

export type { Transaction };

export interface TransactionPayload {
    amount: number;
    date: string;
    description: string;
    idcategory: number;
}

// GET transactions - toutes les transactions de l'utilisateur connecté

export async function fetchTransactions():Promise<Transaction[]> {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });
    if(!response.ok) {
        throw new Error(`Erreur${response.status} : Impossible de récuperer les transactions`);
    }
    return response.json();
}

// POST transactions - créer une transactions

export async function createTransaction(data: TransactionPayload): Promise<Transaction> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials:"include",
        body: JSON.stringify(data),
    });
    if(!response.ok) {
        throw new Error(`Erreur ${response.status} : Impossible de créer la transaction.`);
    }
    return response.json()

}