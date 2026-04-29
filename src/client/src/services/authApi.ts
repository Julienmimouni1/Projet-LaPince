// fichier qui permet de faire les appels à l'API d'authentification
import type { RegisterFormData, AuthUser, ApiError } from "../types/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token : string; // Le token d'authentification (JWT) que le serveur renvoie en cas de connexion réussie. Ce token doit être stocké côté client (dans un cookie httpOnly) et envoyé avec les requêtes suivantes pour prouver que l'utilisateur est authentifié.
  user : AuthUser; // L'utilisateur connecté, avec ses infos (id, prénom, nom, email) mais jamais le mot de passe. C'est ce que le serveur renvoie quand la connexion réussit.
}



// creation d'une fonction registerUser qui a pour rôle d'envoyer les données du formulaire à POST /auth/register et de retourner la réponse du serveur, qui peut être soit un AuthUser en cas de succès, soit un ApiError en cas d'erreur.
export async function registerUser(formData: RegisterFormData): Promise<AuthUser | ApiError> {
    // On utilise fetch pour envoyer une requête POST à l'endpoint /auth/register avec les données du formulaire.
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, { // en production on utilise la variable d'environnement VITE_API_BASE_URL pour construire l'URL de l'API, ce qui permet de facilement changer l'URL de l'API sans avoir à modifier le code.
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // On convertit l'objet formData en JSON pour l'envoyer au serveur.
      credentials: "include", // Permet d'inclure les cookies dans la requête, ce qui est important pour l'authentification avec des JWT stockés en cookie.
    })
    // Si le serveur répond avec une erreur (status code 400 ou supérieur), on essaie de lire le message d'erreur dans la réponse et de le retourner sous forme d'ApiError.
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw error
    }
    // Si tout va bien, on retourne l'utilisateur crée par le serveur, qui est de type AuthUser.
    const user: AuthUser = await response.json();
    return user;
  }


  // Création d'une fonction loginUser qui a pour rôle d'envoyer les données du formulaire de connexion à POST /auth/login et de retourner la réponse du serveur, 
  // qui peut être soit un AuthResponse en cas de succès, soit un ApiError en cas d'erreur.
  export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),// On convertit l'objet credentials en JSON pour l'envoyer au serveur.
      credentials: "include", // Permet d'inclure les cookies dans la requête, ce qui est important pour l'authentification avec des JWT stockés en cookie.
    })
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw error
    }
    const authResponse: AuthResponse = await response.json();
    return authResponse;
  }


  export async function fetchCurrentUser(): Promise<AuthResponse['user']> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
    method: "GET",
    // INDISPENSABLE : c'est ce qui dit au navigateur d'envoyer le cookie caché au back-end
    credentials: "include", 
  });

  if (!response.ok) {
    throw new Error("Non authentifié ou session expirée");
  }

  // Le serveur renvoie juste l'objet utilisateur (plus de token !)
  return response.json(); 
}

export async function fetchLogout(): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // Indispensable pour envoyer le cookie à détruire
  });

  if (!response.ok) {
    console.error("Erreur lors de la déconnexion côté serveur");
    // On ne jette pas d'erreur avec 'throw' ici, car on veut forcer 
    // la déconnexion côté Front quoi qu'il arrive.
  }
}