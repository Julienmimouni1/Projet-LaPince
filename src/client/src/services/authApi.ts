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
    // Si tout va bien, on retourne l'utilisateur crée par le serveur, qui est dans data.user.
    const data = await response.json();
    return data.user;
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

// export async function fetchCurrentUser(): Promise<AuthUser> {
//   // MOCK TEMPORAIRE : On simule la réponse du serveur pour ne pas être bloqué
//   // À retirer quand l'équipe back-end aura fini la route GET /users
//   console.log("Mock activé : Simulation de l'utilisateur connecté");
//   return {
//     id: 2,
//     email: "juliennn@youpi.com",
//     first_name: "Julien",
//     last_name: "Front",
//     photo: null,
//     createdAt: "2023-01-01T00:00:00.000Z",
//     updatedAt: "2023-01-01T00:00:00.000Z"
//   };}



  // CODE ORIGINAL COMMENTE EN ATTEND LE BACK-END POUR LA VERIFICATION DE SESSION (GET /users/me)
  export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
    method: "GET",
    // INDISPENSABLE : c'est ce qui dit au navigateur d'envoyer le cookie caché au back-end
    credentials: "include", 
  });

  if (!response.ok) {
    throw new Error("Non authentifié ou session expirée");
  }

  // Le serveur nous renvoie { user: { ... } }
  const data = await response.json();
  return data.user; 
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