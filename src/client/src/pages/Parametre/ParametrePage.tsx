import { useState, useEffect } from "react";
import { fetchUserProfile } from "../../services/user";
import ParametreForm from "../../components/auth/ParametreForm";
import Footer from "../../components/Footer/footer";

/**
 * Page de Paramètres - Isolation Totale Desktop/Mobile
 */
export default function ParametrePage() {
  // --- NOUVEAU : Gestion des avatars (remplace l’upload de photo) ---
  const [avatarSeeds] = useState<string[]>(() =>
    Array.from({ length: 8 }, () => Math.random().toString(36).slice(2, 10)),
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);

  // --- CHARGEMENT DE L’AVATAR DEPUIS LE BACKEND ---
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchUserProfile();
        setSelectedAvatar(
          user.photo || `https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarSeeds[0]}`
        );
      } catch (err) {
        console.error("Erreur chargement avatar :", err);
        setSelectedAvatar(`https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarSeeds[0]}`);
      }
    }

    loadUser();
  }, []);

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
          className="absolute bottom-0 left-0 w-[55vw] opacity-60 z-0 pointer-events-none"
          alt=""
        />

        <div className="absolute bottom-0 right-[5%] z-10 pointer-events-none">
          <img
            src="/WEBP/Desktop/Lapince-Hand-Desktop.webp"
            className="w-[24vw] h-auto object-contain"
            alt=""
          />
        </div>

        <img
          src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
          className="absolute top-10 left-10 w-36 lg:w-55 z-50"
          alt="Logo Desktop"
        />
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 2. SECTION MOBILE (< MD)                                     */}
      {/* ------------------------------------------------------------ */}
      <div className="block md:hidden">
        <img
          src="/WEBP/Mobile/Lapince-Hero-Background-Mobile.webp"
          className="absolute bottom-0 left-0 w-screen opacity-70 z-0 pointer-events-none"
          alt=""
        />

        <img
          src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
          className="absolute top-6 left-6 w-28 z-50"
          alt="Logo Mobile"
        />
      </div>

      {/* Overlay d'éclaircissement global */}
      <div
        className="absolute inset-0 bg-white/40 z-20 pointer-events-none"
        aria-hidden="true"
      ></div>

      {/* ------------------------------------------------------------ */}
      {/* 3. ZONE DE CONTENU (SCROLLABLE COMME LANDING PAGE)           */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute inset-0 z-40 overflow-y-auto scrollbar-hide flex flex-col items-center">
        {/* --- A. CONTENU MOBILE UNIQUEMENT --- */}
        <div className="flex md:hidden flex-col items-center w-full pt-24 pb-32 px-4 shrink-0">
          <header className="text-center mb-8 relative left-0">
            <h1 className="text-[20px] translate-x-[100px] font-black italic uppercase leading-none tracking-tighter">
              Paramètres
            </h1>
            <p className="text-[10px] translate-x-[100px] font-bold opacity-90 mt-2 text-[#002b49]">
              Personnalisez votre espace.
            </p>
          </header>

          {/* --- AVATAR PICKER MOBILE --- */}
          <div className="relative mb-8 shrink-0">
            <div className="w-28 h-28 rounded-full bg-white/50 border-2 border-white flex items-center justify-center shadow-xl overflow-hidden backdrop-blur-md">
              <img
                src={
                  selectedAvatar ||
                  `https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarSeeds[0]}`
                }
                className="w-full h-full object-cover"
                alt="avatar"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="absolute bottom-0 right-0 bg-[#002b49] text-white p-2 rounded-full border-2 border-white shadow-lg"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="4"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {showPicker && (
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 z-50">
                <div className="flex flex-wrap justify-center gap-3 w-64">
                  {avatarSeeds.map((seed) => {
                    const url = `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}`;
                    return (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(url);
                          setShowPicker(false);
                        }}
                        className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all hover:scale-110 ${
                          selectedAvatar === url
                            ? "border-[#002b49]"
                            : "border-transparent"
                        }`}
                      >
                        <img src={url} alt={seed} className="w-full h-full" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <section className="w-full max-w-[400px] bg-white/20 backdrop-blur-3xl rounded-[2.5rem] p-7 shadow-2xl border border-white/30">
            <ParametreForm selectedAvatar={selectedAvatar} />
          </section>
        </div>

        {/* --- B. CONTENU DESKTOP UNIQUEMENT --- */}
        <div className="hidden md:flex flex-col items-center w-full min-h-full justify-center pt-10 pb-28 px-4 shrink-0">
          <header className="text-center mb-10 shrink-0">
            <h1 className="text-[50px] font-black italic uppercase leading-none tracking-tighter">
              Paramètres
            </h1>
            <p className="text-[18px] font-bold opacity-90 mt-2">
              Personnalisez votre espace sans prise de tête.
            </p>
          </header>

          {/* --- AVATAR PICKER DESKTOP --- */}
          <div className="relative mb-10 shrink-0 group">
            <div className="w-36 h-36 rounded-full bg-white/50 border-2 border-white flex items-center justify-center shadow-2xl overflow-hidden backdrop-blur-md">
              <img
                src={
                  selectedAvatar ||
                  `https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarSeeds[0]}`
                }
                className="w-full h-full object-cover"
                alt="avatar"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="absolute bottom-1 right-1 bg-[#002b49] text-white p-2 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="4"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {showPicker && (
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 z-50">
                <div className="flex flex-wrap justify-center gap-3 w-64">
                  {avatarSeeds.map((seed) => {
                    const url = `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}`;
                    return (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(url);
                          setShowPicker(false);
                        }}
                        className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all hover:scale-110 ${
                          selectedAvatar === url
                            ? "border-[#002b49]"
                            : "border-transparent"
                        }`}
                      >
                        <img src={url} alt={seed} className="w-full h-full" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <section className="w-full max-w-[450px] bg-white/20 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-2xl border border-white/30">
            <ParametreForm selectedAvatar={selectedAvatar} />
          </section>
        </div>
      </div>

      {/* 4. FOOTER (FIXÉ EN BAS) */}
      <footer className="absolute bottom-0 left-0 w-full z-50">
        <Footer showIcons={true} activeIds={["landingpage", "transactions"]} />
      </footer>
    </main>
  );
}
