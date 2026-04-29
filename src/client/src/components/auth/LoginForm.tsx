// Ce composant ne fait aucune logique métier, il ne fait qu'afficher le formulaire et remonter les événements au parent.
// Il attend 3 props : la fonction onSubmit, l'état isLoading et l'état error.
// C'est le composant enfant de LoginPage, il reçoit la fonction à appeler lors de la soumission du formulaire, ainsi que les états d'erreur et de chargement.
import { useState, type FormEvent } from "react"; // Ajout de 'type' pour verbatimModuleSyntax
import type { LoginCredentials } from "../../services/authApi";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void; // La fonction à appeler quand le formulaire est soumis, avec les données du formulaire
  isLoading: boolean;
  error: string | null;
}

export default function LoginForm({
  onSubmit,
  isLoading,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState(""); // On crée un état local pour chaque champ du formulaire, pour pouvoir les contrôler et les envoyer au parent lors de la soumission.
  const [password, setPassword] = useState(""); // Même chose pour le mot de passe

  /**
   * Utilisation de FormEvent avec le type générique HTMLFormElement
   * pour éviter la dépréciation et assurer le typage correct.
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // On remonte les données au parent
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Affichage de l'erreur globale renvoyée par le parent */}
      {error && (
        <p className="text-red-600 text-[11px] text-center font-bold italic bg-red-100/50 py-1 rounded-full">
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-[14px] font-black ml-4 mb-0.5 italic uppercase text-[#002b49]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e-mail"
          className="w-full px-4 py-2.5 rounded-full bg-white/80 border-none text-[13px] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-[#002b49]"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[14px] font-black ml-4 mb-0.5 italic uppercase text-[#002b49]"
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="mot de passe"
          className="w-full px-4 py-2.5 rounded-full bg-white/80 border-none text-[13px] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-[#002b49]"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-fit px-8 py-2 bg-[#002b49] text-white rounded-full font-bold text-sm shadow-lg hover:bg-[#003b63] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Se connecter"
          )}
        </button>
      </div>

      <p className="text-center text-[11px] font-bold mt-4 text-[#002b49]">
        Pas encore de compte ?
        <a
          href="/register"
          className="underline ml-1 hover:text-blue-700 transition-colors"
        >
          Créer un compte
        </a>
      </p>
    </form>
  );
}
