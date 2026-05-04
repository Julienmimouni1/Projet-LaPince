import { useState } from "react";
import { loginUser, fetchCurrentUser, type LoginCredentials } from "../../../services/authApi";
import LoginForm from "../../../components/auth/LoginForm";
import Footer from "../../../components/Footer/footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

/**
 * Page de Connexion - Isolation Totale Desktop/Mobile
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginUser(credentials);
      const user = await fetchCurrentUser();
      login(user);
      navigate("/accueil");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
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
      {/* 1. SECTION DESKTOP (MD+)                                     */}
      {/* ------------------------------------------------------------ */}
      <div className="hidden md:block">
        <img
          src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
          className="absolute bottom-0 left-0 w-[55vw] opacity-60 object-contain z-0 pointer-events-none"
          alt=""
        />
        <div className="absolute bottom-0 right-[5%] z-40 pointer-events-none hidden lg:block">
          <img
            src="/WEBP/Desktop/Lapince-Hand-Desktop.webp"
            className="w-[24vw] h-auto"
            alt=""
          />
        </div>
        <img
          src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
          className="absolute top-10 left-15 w-24 lg:w-60 z-50 transition-all"
          alt="Logo"
        />

        {/* Texte contextuel — même style que la landing page */}
        <div className="absolute z-50 left-0 w-full md:pl-14 lg:pl-16 pointer-events-none pt-20">
          <header className="max-w-[700px] md:mt-56 shrink-0 text-left md:pl-28">
            <h2 className="text-[50px] lg:text-[65px] font-medium leading-[0.9] tracking-tighter text-[#002b49]">
              Content de
              <br />
              vous revoir.
            </h2>
            <p className="text-[17px] lg:text-[21px] font-normal text-[#002b49] opacity-90 mt-6 max-w-[450px] leading-snug">
              <span className="font-bold">La Pince,</span> vos finances vous attendaient.
              <br />
              Reprenez là où vous en étiez.
            </p>
          </header>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 2. SECTION MOBILE (< MD)                                    */}
      {/* ------------------------------------------------------------ */}
      <div className="block md:hidden">
        <img
          src="/WEBP/Mobile/Lapince-Hero-Background-Mobile.webp"
          className="absolute bottom-0 left-0 w-full opacity-70 z-0 pointer-events-none"
          alt=""
        />
        <img
          src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
          className="absolute top-6 left-6 w-28 z-50"
          alt="Logo Mobile"
        />
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 3. ZONE DE CONTENU (FORMULAIRE & TEXTES)                     */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute inset-0 bg-white/40 z-20 pointer-events-none"></div>

      {/* --- A. CONTENU MOBILE (Réglages indépendants) --- */}
      <div className="md:hidden absolute inset-0 z-40 overflow-y-auto flex flex-col items-center px-4 scrollbar-hide">
        {/* Ajustez le mt-X pour monter/descendre tout le bloc en mobile */}
        <div className="flex flex-col items-center mt-50 w-full">
          <header className="text-center mb-6">
            <h1 className="text-[35px] font-black italic uppercase leading-none">
              Connexion
            </h1>
          </header>

          <section className="w-full max-w-[360px] bg-white/25 backdrop-blur-3xl rounded-[2rem] p-6 shadow-2xl border border-white/40 mb-6">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          </section>

        </div>
      </div>

      {/* --- B. CONTENU DESKTOP (Réglages indépendants) --- */}
      <div className="hidden md:flex absolute inset-0 z-40 flex-col items-center justify-center scrollbar-hide">
        <header className="text-center mb-12">
          <h1 className="text-[50px] lg:text-[60px] font-black uppercase leading-none tracking-tighter">
            Connexion
          </h1>
        </header>

        <section className="w-full max-w-[440px] bg-white/25 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-2xl border border-white/40 mb-10">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
        </section>

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
