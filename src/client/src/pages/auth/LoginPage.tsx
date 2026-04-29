// Ce composant gère l'appel API, le contexte global d'authentification et la redirection.
// C'est le composant parent de LoginForm, il lui passe la fonction à appeler lors de la soumission du formulaire, ainsi que les états d'erreur et de chargement.

import { useState } from 'react'; // Permet de gérer l'état local du formulaire, notamment pour afficher les erreurs
import { loginUser } from '../../services/authApi'; // La fonction qui envoie les données de connexion au serveur
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Permet de rediriger l'utilisateur après une connexion réussie
import LoginForm from '../../components/auth/LoginForm';
import type { LoginCredentials } from '../../services/authApi';


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false); // Permet d'afficher un état de chargement pendant que la requête est en cours
  const [error, setError] = useState<string | null>(null); // Permet d'afficher une erreur globale si la connexion échoue, par exemple "Email ou mot de passe incorrect"


// On récupère la fonction login depuis notre contexte global
  const { login } = useAuth(); 
  // Hook de React Router pour rediriger l'utilisateur après le succès
  const navigate = useNavigate();

const handleLoginSubmit = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. On appelle l'API via notre service
      const response = await loginUser(credentials);
      
      // 2. On met à jour l'état global de l'application (le user est maintenant connecté)
      login(response.user); // Le token est dans le cookie, on sauvegarde juste l'utilisateur dans l'état React

      // 3. On redirige vers la page d'accueil ou le dashboard
      navigate('/dashboard'); 
    } catch (err : any) {
         // On attrape l'erreur jetée par le throw dans authApi.ts et on affiche le message d'erreur à l'utilisateur
      setError(err.message || 'Email ou mot de passe incorrect');
    } finally {
        // Quoi qu'il arrive, on arrête le loader pour permettre à l'utilisateur de réessayer ou de voir le résultat
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Connexion à La Pince</h1>
      
      {/* On passe la logique à l'enfant via les props */}
      <LoginForm 
        onSubmit={handleLoginSubmit} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
