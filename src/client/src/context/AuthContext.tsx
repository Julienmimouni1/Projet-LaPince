// Ce fichier contient le contexte global d'authentification de l'application. Il gère l'état de l'utilisateur connecté, les fonctions de connexion et de déconnexion, 
// ainsi que la vérification de session au démarrage de l'application.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthResponse } from '../services/authApi';
import { fetchCurrentUser, fetchLogout } from '../services/authApi';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  login: (data: AuthResponse['user']) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isInitializing: boolean; // Ajout d'un état de chargement initial
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  // Empêche l'affichage de l'app tant qu'on ne sait pas si l'utilisateur est connecté
  const [isInitializing, setIsInitializing] = useState(true); 

  useEffect(() => {
    // Au démarrage de l'app (F5), on interroge le back-end avec le cookie caché
    const checkSession = async () => {
      try {
        // On demande au back-end "Qui est cet utilisateur ?"
        const currentUser = await fetchCurrentUser();
         // Le serveur a répondu OK, on met à jour le state avec les infos de l'utilisateur
        setUser(currentUser); 
      
      } catch (error) {
        setUser(null);
      } finally {
        setIsInitializing(false); // Fini de charger, on peut afficher l'app
      }
    };

    checkSession();
  }, []);

  const login = (userData: AuthResponse['user']) => {
    // Le token est dans le cookie, on sauvegarde juste l'utilisateur dans l'état React
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Il faut appeler la route de déconnexion du back-end pour qu'il détruise le cookie
      await fetchLogout(); 
    } finally {
        // Quoi qu'il arrive, on vide l'état React pour mettre à jour l'affichage
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isInitializing }}>
      {/* On n'affiche les enfants que si l'initialisation est terminée */}
      {!isInitializing && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext); // Permet de consommer le contexte dans les composants enfants
  if (context === undefined) { // Si le contexte n'est pas défini, cela signifie que le hook est utilisé en dehors d'un AuthProvider
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider"); // Sécurité pour s'assurer que le hook est utilisé correctement, sinon on jette une erreur explicite.
  }
  return context;
}

