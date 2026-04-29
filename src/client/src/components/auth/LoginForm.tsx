// Ce composant ne fait aucune logique métier, il ne fait qu'afficher le formulaire et remonter les événements au parent. 
// Il attend 3 props : la fonction onSubmit, l'état isLoading et l'état error.
// C'est le composant enfant de LoginPage, il reçoit la fonction à appeler lors de la soumission du formulaire, ainsi que les états d'erreur et de chargement.
import { FormEvent, useState } from 'react';
import type { LoginCredentials } from '../../services/authApi';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void; // La fonction à appeler quand le formulaire est soumis, avec les données du formulaire
  isLoading: boolean;
  error: string | null;
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState(''); // On crée un état local pour chaque champ du formulaire, pour pouvoir les contrôler et les envoyer au parent lors de la soumission.
  const [password, setPassword] = useState(''); // Même chose pour le mot de passe

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // On remonte les données au parent
    onSubmit({ email, password });
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-8">
      {/* Affichage de l'erreur globale renvoyée par le parent */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Mot de passe</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
          disabled={isLoading}
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </button>
    </form>
  );
}