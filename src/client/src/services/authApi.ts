// fichier qui permet de faire les appels à l'API d'authentification
import type { RegisterFormData, AuthUser, ApiError } from "../types/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  // Le serveur renvoie désormais un objet accessToken contenant le token et sa durée
  accessToken: {
    token: string;
    expiresIn: number;
  };
 // Et un objet refreshToken contenant lui aussi le token et sa durée
  refreshToken: {
    token: string;
    expiresIn: number;
  };
 // Note : le serveur ne renvoie plus l'utilisateur dans la réponse de connexion, car les infos de l'utilisateur sont désormais récupérées via la route GET /users/me grâce au cookie d'authentification. Cela simplifie la gestion des tokens côté client et améliore la sécurité.
 //  Si besoin, on peut toujours récupérer les infos de l'utilisateur connecté en appelant fetchCurrentUser() après une connexion réussie.
}

// creation d'une fonction registerUser qui a pour rôle d'envoyer les données du formulaire à POST /auth/register et de retourner la réponse du serveur, qui peut être soit un AuthUser en cas de succès, soit un ApiError en cas d'erreur.
export async function registerUser(formData: RegisterFormData): Promise<AuthUser> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    })
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const error: ApiError = await response.json();
        throw error;
      }
      throw new Error("Une erreur est survenue, réessaie.");
    }
    const data = await response.json();
    return data.user;
  }

  export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Email ou mot de passe incorrect.");
    }
    return response.json();
  }

  export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Non authentifié ou session expirée");
  }

  const data = await response.json();
  return data.user;
}

export async function fetchLogout(): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    console.error("Erreur lors de la déconnexion côté serveur");
  }
}

export async function refreshSession(): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Refresh token invalide ou expiré");
  }
}
