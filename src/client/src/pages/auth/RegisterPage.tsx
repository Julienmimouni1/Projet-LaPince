import RegisterForm from "../../components/auth/RegisterForm";
import { useState } from "react";
import { registerUser } from "../../services/authApi";
import type { RegisterFormData, ApiError } from "../../types/auth";

export default function RegisterPage() {
  /**
   * isLoading : indique si une requête API est en cours.
   * Permet d'afficher un indicateur de chargement ou de désactiver le formulaire.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * error : contient l'erreur retournée par l'API.
   * null signifie qu'aucune erreur n'est présente.
   */
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * pour choisir de la photo
   */
  const [photo, setPhoto] = useState<File | null>(null);

  /**
   * handleSubmit : gère l'envoi des données du formulaire vers l'API.
   */
  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(data);
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen w-full bg-[#b9c6d1] overflow-hidden font-sans text-[#002b49]"
      role="main"
      aria-label="Page d'inscription"
    >
      {/* ------------------------------ */}
      {/*   Arrière-plan billets (Mobile) */}
      {/* ------------------------------ */}
      <img
        src="/WEBP/Mobile/Lapince-Hero-Background-Mobile.webp"
        className="block md:hidden absolute top-[90%] left-[-5%] w-[45%] scale-200 z-10"
        alt="Illustration de billets - version mobile"
      />

      {/* ------------------------------ */}
      {/*   Arrière-plan billets (Desktop) */}
      {/* ------------------------------ */}
      <img
        src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
        className="hidden md:block absolute top-[50%] left-[20%] w-[25%] scale-280 z-10"
        alt="Illustration de billets - version desktop"
      />

      {/* ------------------------------ */}
      {/*   Couches de couleur (Mobile)   */}
      {/* ------------------------------ */}
      <div
        className="absolute inset-0 bg-[#002b49]/10 z-20 md:hidden"
        aria-hidden="true"
      ></div>
      <div
        className="absolute inset-0 bg-white/30 z-20 md:hidden"
        aria-hidden="true"
      ></div>

      {/* ------------------------------ */}
      {/*   Couches de couleur (Desktop)  */}
      {/* ------------------------------ */}
      <div
        className="absolute inset-0 bg-[#002b49]/5 md:bg-[#002b49]/20 z-20"
        aria-hidden="true"
      ></div>
      <div
        className="absolute inset-0 bg-white/10 md:bg-white/70 z-20"
        aria-hidden="true"
      ></div>

      {/* ------------------------------ */}
      {/*   Illustration main             */}
      {/* ------------------------------ */}
      <img
        src="/WEBP/Mobile/Lapince-Hand-Mobile.webp"
        className="block md:hidden absolute bottom-0 right-[15%] w-[40%] scale-140 z-20 pointer-events-none"
        alt="Main tenant un billet - version mobile"
      />

      <img
        src="/WEBP/Desktop/Lapince-Hand-Desktop.webp"
        className="hidden md:block absolute bottom-0 right-25 w-[22%] h-auto z-50 pointer-events-none"
        alt="Main tenant un billet - version desktop"
      />

      {/* ------------------------------ */}
      {/*   Logo                         */}
      {/* ------------------------------ */}
      <img
        src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
        className="block md:hidden absolute top-6 left-6 w-24 z-50"
        alt="Logo Lapince - version mobile"
      />

      <img
        src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
        className="hidden md:block absolute top-10 left-20 w-40 z-50"
        alt="Logo Lapince - version desktop"
      />

      {/* ------------------------------ */}
      {/*   Titre principal              */}
      {/* ------------------------------ */}
      <h1
        className="
    absolute 
    left-[50px] md:left-[-10px]
    w-full 
    text-center 
    text-[20px] md:text-[45px]
    !text-[#002b49]
    font-black 
    italic 
    tracking-tighter 
    z-40
    top-[30px] md:top-[-10px]
  "
      >
        Inscription
      </h1>

      {/* ------------------------------ */}
      {/*   Texte latéral (Desktop)      */}
      {/* ------------------------------ */}
      <div
        className="hidden md:block absolute top-[50%] left-[5%] z-40"
        aria-hidden="false"
      >
        <p className="text-[25px] font-bold leading-tight">
          Créez votre compte Gratuit,
          <br />
          sans connexion bancaire,
          <br />
          sans prise de tête.
        </p>
      </div>

      {/* ------------------------------ */}
      {/*   Texte latéral (Mobile)       */}
      {/* ------------------------------ */}
      <div className="block md:hidden absolute top-[18%] left-1/2 -translate-x-1/2 w-[90%] text-center z-40">
        <p className="text-[18px] font-bold italic leading-tight">
          Créez votre compte Gratuit,
          <br />
          sans connexion bancaire,
          <br />
          sans prise de tête.
        </p>
      </div>

      {/* ------------------------------ */}
      {/*   Formulaire + Photo profil    */}
      {/* ------------------------------ */}
      <div
        className="
          absolute 
          left-1/2 
          -translate-x-1/2 
          flex flex-col items-center 
          z-40 
          w-full 
          max-w-[450px]
          top-[22%] md:top-[3%]
          scale-85 md:scale-80
        "
      >
        {/* Photo profil (Desktop) */}
        <div className="hidden md:block relative mb-4">
          {/* Input caché pour téléverser la photo */}
          <input
            type="file"
            accept="image/*"
            id="upload-photo-desktop"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPhoto(file);
            }}
          />

          {/* Cercle de photo */}
          <div
            className="w-24 h-24 rounded-full border-2 border-white bg-white/30 backdrop-blur-md flex items-center justify-center shadow-xl overflow-hidden"
            role="img"
            aria-label="Photo de profil"
          >
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                alt="aperçu de la photo"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-[10px] text-center font-black px-2 uppercase">
                Ajouter une photo de profil
              </span>
            )}
          </div>

          {/* Bouton + pour ouvrir le sélecteur de fichiers */}
          <button
            aria-label="Téléverser une photo"
            onClick={() =>
              document.getElementById("upload-photo-desktop")?.click()
            }
            className="absolute bottom-0 right-0 bg-[#002b49] text-white p-1.5 rounded-full border-2 border-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="4"
              aria-hidden="true"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Photo profil (Mobile) */}
        <div className="block md:hidden relative mb-4">
          {/* input hidden */}
          <input
            type="file"
            accept="image/*"
            id="upload-photo-mobile"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPhoto(file);
            }}
          />

          {/* cecle photo*/}
          <div className="w-26 h-26 rounded-full border-2 border-white bg-white/30 backdrop-blur-md flex items-center justify-center shadow-xl">
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                alt="aperçu de la photo"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-[9px] text-center font-black px-2 uppercase">
                Photo de profil
              </span>
            )}
          </div>

          {/* button + */}
          <button
            aria-label="Téléverser une photo"
            onClick={() =>
              document.getElementById("upload-photo-mobile")?.click()
            }
            className="absolute bottom-0 right-0 bg-[#002b49] text-white p-1 rounded-full border-2 border-white shadow-lg"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="4"
              aria-hidden="true"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Formulaire */}
        <div
          className="
            w-full 
            bg-white/5 md:bg-white/20 
            backdrop-blur-[1px] md:backdrop-blur-2xl 
            rounded-[2.5rem] 
            p-4 
            shadow-2xl 
            border border-white/10 md:border-white/30
            z-40
          "
        >
          <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <p className="mt-3 text-xs font-bold">
          Déjà un compte ?{" "}
          <a
            href="/login"
            className="underline ml-1 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Se connecter
          </a>
        </p>
      </div>

      {/* ------------------------------ */}
      {/*   Pied de page (Mobile)        */}
      {/* ------------------------------ */}
      <footer
        className="
          block md:hidden absolute bottom-0 left-0 w-full h-[22px] bg-white flex items-center justify-center z-50
        "
        role="contentinfo"
      >
        <p className="text-[9px] font-bold text-[#002b49] opacity-70">
          Mentions légales
        </p>
      </footer>

      {/* ------------------------------ */}
      {/*   Pied de page (Desktop)       */}
      {/* ------------------------------ */}
      <footer
        className="
          hidden md:flex absolute bottom-0 left-0 w-full h-[25px] bg-white items-center justify-center z-50
        "
        role="contentinfo"
      >
        <p className="text-[10px] font-bold text-[#002b49] opacity-70">
          Mentions légales
        </p>
      </footer>
    </main>
  );
}
