import { Alert } from "../types/alert.js";

export async function fetchAlerts(): Promise<Alert[]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/alerts`, {
    method: "GET",
    // INDISPENSABLE : sans credentials: "include", le cookie accessToken
    // n'est pas envoyé → le middleware d'auth renvoie 401.
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur `${response.status}` en chargeant les alertes");
  }

  return response.json();
  // Le JSON renvoyé a exactement la même shape que notre type Alert :
  // { id, categoryName, exceededAmount, isRead, userId, createdAt
}

// Marque une alerte comme lue — PATCH /alerts/:id/read
export async function markAlertAsRead(id: number): Promise<void> {
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/alerts/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  // Fire-and-forget : on n'attend pas la réponse pour fermer la popup.
}

// Marque toutes les alertes comme lues — PATCH /alerts/read-all
export async function markAllAlertsAsRead(): Promise<void> {
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/alerts/read-all`, {
    method: "PATCH",
    credentials: "include",
  });
}