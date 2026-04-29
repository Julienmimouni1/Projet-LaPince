import RegisterForm from "../../components/auth/RegisterForm";
import { useState } from "react";
import { registerUser } from "../../services/authApi";
import type { RegisterFormData, ApiError } from "../../types/auth";
import Footer from "../../components/Footer/footer";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerUser(data);
      alert("Inscription réussie !");
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="fixed inset-0 w-full h-full bg-[#b9c6d1] overflow-hidden font-sans text-[#002b49]"
      role="main"
    >
      {/* ------------------------------------------------------------ */}
      {/* 1. BLOC DESKTOP (MD+)                                        */}
      {/* ------------------------------------------------------------ */}
      <div className="hidden md:block">
        <img
          src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
          className="absolute bottom-0 left-0 w-[55vw] opacity-60 z-0 pointer-events-none select-none"
          alt=""
        />
        <div className="absolute bottom-0 right-[5%] z-10 pointer-events-none hidden lg:block">
          <img
            src="/WEBP/Desktop/Lapince-Hand-Desktop.webp"
            className="w-[24vw] h-auto object-contain"
            alt=""
          />
        </div>
        <div className="hidden 2xl:block absolute top-[55%] left-[5%] -translate-y-1/2 z-30 pointer-events-none max-w-[400px]">
          <p className="text-[35px] font-black leading-tight uppercase italic opacity-80">
            Créez votre compte Gratuit,
            <br />
            sans connexion bancaire,
            <br />
            sans prise de tête.
          </p>
        </div>
        <img
          src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
          className="absolute top-10 left-20 w-24 md:w-36 lg:w-60 z-50 transition-all"
          alt="Logo"
        />
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 2. BLOC MOBILE (< MD)                                       */}
      {/* ------------------------------------------------------------ */}
      <div className="block md:hidden">
        <img
          src="/WEBP/Mobile/Lapince-Hero-Background-Mobile.webp"
          className="absolute bottom-0 left-0 w-full opacity-70 z-0 pointer-events-none select-none"
          alt=""
        />
        <img
          src="/WEBP/Mobile/Lapince-Hand-Mobile.webp"
          className="absolute bottom-0 right-0 w-[45%] z-10 opacity-90 pointer-events-none"
          alt=""
        />
        <img
          src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
          className="absolute top-6 left-6 w-28 z-50"
          alt="Logo"
        />
      </div>

      {/* Overlay global (Z-20) */}
      <div
        className="absolute inset-0 bg-white/40 z-20 pointer-events-none"
        aria-hidden="true"
      ></div>

      {/* ------------------------------------------------------------ */}
      {/* 3. ZONE DE CONTENU (L'essentiel - Z-40)                      */}
      {/* ------------------------------------------------------------ */}
      {/* C'est ici que le scroll se passe, exactement comme sur LandingPage */}
      <div className="absolute inset-0 z-40 overflow-y-auto flex flex-col items-center pt-2 pb-5 px-4 scrollbar-hide">
        {/* Titre Inscription */}
        <header className="text-center mt-12 mb-8 shrink-0 ">
          <h1 className="text-[26px] translate-x-[60px] md:translate-x-[0px] md:text-[50px] font-black italic uppercase leading-none tracking-tighter">
            Inscription
          </h1>
        </header>

        {/* SECTION PHOTO (Avatar) */}
        <div className="relative mb-6 shrink-0">
          <label htmlFor="av-reg" className="cursor-pointer block">
            <input
              type="file"
              id="av-reg"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPhoto(file);
              }}
            />
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/50 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-2xl overflow-hidden group-hover:border-[#002b49] transition-all">
              <img
                src={
                  photo
                    ? URL.createObjectURL(photo)
                    : "/WEBP/Desktop/Lapince-Profil-Picture-Desktop.webp"
                }
                className="w-full h-full object-cover"
                alt="Aperçu"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-[#002b49] text-white p-2 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="4"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </label>
        </div>

        {/* Cadre du Formulaire */}
        <section className="w-full max-w-[440px] bg-white/20 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-white/30 mb-8 shrink-0 relative">
          <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </section>

        {/* Lien de redirection */}
        <p className="text-sm font-bold shrink-0 mb-10">
          Déjà un compte ?{" "}
          <a href="/login" className="underline ml-1">
            Se connecter
          </a>
        </p>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 4. FOOTER                                                    */}
      {/* ------------------------------------------------------------ */}
      <footer className="absolute bottom-0 left-0 w-full z-50">
        <Footer showIcons={true} />
      </footer>
    </main>
  );
}
