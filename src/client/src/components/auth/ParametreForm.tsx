import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../../services/user";

/**
 * ------------------------------------------------------------
 * Composant ParametreForm
 *
 * Gère :
 *  - L'affichage des informations utilisateur
 *  - La modification du nom, email et mot de passe
 *  - L'affichage des erreurs backend
 *  - La suppression du compte
 *
 * Ce composant est totalement indépendant de ParametrePage.
 * ------------------------------------------------------------
 */
export default function ParametreForm({
  selectedAvatar,
}: {
  selectedAvatar: string;
}) {
  /**
   * ------------------------------------------------------------
   * State du formulaire
   * ------------------------------------------------------------
   */
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm: "",
  });

  /**
   * ------------------------------------------------------------
   * State pour afficher les erreurs renvoyées par le backend
   * ------------------------------------------------------------
   */
  const [apiError, setApiError] = useState<{
    field?: string;
    message: string;
  } | null>(null);

  /**
   * ------------------------------------------------------------
   * Indique si une requête API est en cours
   * ------------------------------------------------------------
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * ------------------------------------------------------------
   * handleChange
   * Met à jour les champs du formulaire
   * ------------------------------------------------------------
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Efface l’erreur dès que l’utilisateur modifie un champ
    setApiError(null);
  };

  /**
   * ------------------------------------------------------------
   * Chargement automatique du profil utilisateur
   * via GET /users/me
   *
   * On combine first_name + last_name dans un seul champ "name"
   * ------------------------------------------------------------
   */
  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await fetchUserProfile();

        setForm({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: "",
          confirm: "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      }
    }

    loadProfile();
  }, []);

  /**
   * ------------------------------------------------------------
   * handleSubmit
   * Étapes :
   *  1. Confirmation utilisateur
   *  2. Séparation Nom/Prénom
   *  3. Vérification du mot de passe
   *  4. Envoi au backend
   *  5. Redirection vers /login
   * ------------------------------------------------------------
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1) Confirmation
    const confirmed = confirm(
      "Êtes-vous sûr de vouloir modifier vos informations ?",
    );
    if (!confirmed) return;

    setIsLoading(true);
    setApiError(null);

    try {
      // 2) Vérification du mot de passe
      if (form.password && form.password !== form.confirm) {
        setApiError({
          field: "confirm",
          message: "Les mots de passe ne correspondent pas.",
        });
        setIsLoading(false);
        return;
      }

      // 4) Envoi au backend (UNE SEULE FOIS)
      await updateUserProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password || undefined,
        photo: selectedAvatar || undefined,
      });

      alert("Vos informations ont été mises à jour avec succès !");

      // 5) Redirection vers login
      setTimeout(() => {
        window.location.href = "/login";
      }, 50);
    } catch (err) {
      const error = err as { message: string; field?: string };

      setApiError({
        field: error.field,
        message: error.message || "Erreur inconnue",
      });
    }

    setIsLoading(false);
  };

  /**
   * ------------------------------------------------------------
   * handleDelete
   * Supprime définitivement le compte utilisateur
   * ------------------------------------------------------------
   */
  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer votre compte ?")) return;

    try {
      await deleteUserAccount();
      alert("Compte supprimé");
      window.location.href = "/login";
    } catch (err) {
      alert("Erreur lors de la suppression : " + err);
    }
  };

  /**
   * ------------------------------------------------------------
   * Styles utilitaires
   * ------------------------------------------------------------
   */
  const inputStyle =
    "w-full px-4 py-2 rounded-full bg-white/80 border-none text-[12px] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-[#002b49]";
  const labelStyle =
    "block text-[11px] font-black ml-4 mb-0.5 italic uppercase text-[#002b49]";

  /**
   * ------------------------------------------------------------
   * Rendu du formulaire
   * ------------------------------------------------------------
   */
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Champ Prénom */}
      <div>
        <label className={labelStyle}>Prénom</label>
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Prénom"
        />
        {apiError?.field === "first_name" && (
          <p className="text-red-500 text-xs ml-4">{apiError.message}</p>
        )}
      </div>

      {/* Champ Nom */}
      <div>
        <label className={labelStyle}>Nom</label>
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Nom de famille"
        />
        {apiError?.field === "last_name" && (
          <p className="text-red-500 text-xs ml-4">{apiError.message}</p>
        )}
      </div>

      {/* Champ Email */}
      <div>
        <label className={labelStyle}>e-mail</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={inputStyle}
          placeholder="e-mail"
        />

        {apiError?.field === "email" && (
          <p className="text-red-500 text-xs ml-4">{apiError.message}</p>
        )}
      </div>

      {/* Nouveau mot de passe */}
      <div>
        <label className={labelStyle}>Nouveau mot de passe</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className={inputStyle}
          placeholder="mot de passe"
        />

        {apiError?.field === "password" && (
          <p className="text-red-500 text-xs ml-4">{apiError.message}</p>
        )}
      </div>

      {/* Confirmation du mot de passe */}
      <div>
        <label className={labelStyle}>Confirmer le mot de passe</label>
        <input
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          className={inputStyle}
          placeholder="mot de passe"
        />

        {apiError?.field === "confirm" && (
          <p className="text-red-500 text-xs ml-4">{apiError.message}</p>
        )}
      </div>

      {/* Bouton Soumettre */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-fit px-10 py-2 bg-[#002b49] text-white rounded-full font-bold text-sm shadow-lg hover:bg-[#003b63] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Soumettre"
          )}
        </button>
      </div>

      {/* Bouton Supprimer le compte */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={handleDelete}
          className="text-[11px] text-red-600 font-bold underline italic opacity-80"
        >
          Se désinscrire
        </button>
      </div>
    </form>
  );
}
