import type { AuthUser } from "../types/auth";

/**
 * ------------------------------------------------------------
 * fetchUserProfile()
 *
 * Récupère le profil de l'utilisateur connecté via /users/me.
 * Le cookie (token) est automatiquement envoyé grâce à
 * `credentials: "include"`.
 *
 * Retourne : AuthUser
 * ------------------------------------------------------------
 */
export async function fetchUserProfile(): Promise<AuthUser> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/me`,
    {
      method: "GET",
      credentials: "include", // envoie automatiquement les cookies
    },
  );

  // Si la réponse n'est pas OK → erreur
  if (!response.ok) {
    throw new Error("Impossible de charger le profil utilisateur");
  }

  // Lecture du JSON renvoyé par le backend
  const data = await response.json();

  // Le backend renvoie { user: {...} }
  return data.user;
}

/**
 * ------------------------------------------------------------
 * updateUserProfile()
 *
 * Envoie une requête PATCH pour modifier :
 *  - first_name
 *  - last_name
 *  - email
 *  - password
 *  - photo (optionnel)
 *
 * ⚠ IMPORTANT :
 * On lit le JSON UNE SEULE FOIS.
 * Si on lit deux fois, la réponse est consommée et provoque une erreur.
 *
 * Retourne : user mis à jour
 * ------------------------------------------------------------
 */
export async function updateUserProfile(payload: {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  photo?: string | null;
}) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/me`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  // Lecture du JSON (une seule fois)
  const data = await response.json();

  // Si erreur → on renvoie message + field pour affichage sous le champ
  if (!response.ok) {
    throw {
      message: data.message || "Erreur lors de la mise à jour",
      field: data.field,
    };
  }

  // Retourne l'utilisateur mis à jour
  return data.user;
}

/**
 * ------------------------------------------------------------
 * deleteUserAccount()
 *
 * Supprime définitivement le compte utilisateur via DELETE /users/me.
 * Le backend supprime l'utilisateur et invalide le token.
 *
 * Retourne : void
 * ------------------------------------------------------------
 */
export async function deleteUserAccount(): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/me`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du compte");
  }
}
