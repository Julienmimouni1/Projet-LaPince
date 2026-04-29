import Footer from "../../components/Footer/footer";

/**
 * LandingPage - Version Intégrale
 * Alignement centré pour le contenu et correction des visuels.
 */
export default function LandingPage() {
  // Style du bouton blanc "S'inscrire"
  const mainButtonStyle =
    "w-fit px-12 py-3 bg-white text-[#002b49] rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0";

  return (
    <main
      className="fixed inset-0 w-full h-full bg-[#cbd5e1] overflow-hidden font-sans text-[#002b49]"
      role="main"
      aria-label="Page d'accueil de La Pince"
    >
      {/* ------------------------------------------------------------ */}
      {/* 1. BLOC DESKTOP (MD+)                                        */}
      {/* ------------------------------------------------------------ */}
      <div className="hidden md:block">
        {/* Arrière-plan Billets */}
        <img
          src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
          className="absolute bottom-0 left-0 w-[60vw] opacity-50 object-contain origin-bottom-left z-0 pointer-events-none select-none"
          aria-hidden="true"
          alt=""
        />

        {/* Illustration Femme (ou Main) - Ajustée à droite */}
        <div className="absolute bottom-0 right-40 z-30 pointer-events-none select-none h-[95vh]">
          <img
            src="/WEBP/Desktop/Lapince-Hero-Woman-Desktop.webp"
            className="h-full w-auto object-contain object-bottom"
            alt="Illustration La Pince"
          />
        </div>

        {/* Logo Haut Gauche */}
        <img
          src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
          className="absolute top-10 left-15 w-24 md:w-36 lg:w-60 z-50 transition-all"
          alt="Logo"
        />

        {/* Bouton Connexion Haut Droite */}
        <div className="absolute top-12 right-25 z-50 pointer-events-auto">
          <a
            href="/login"
            className="px-8 py-2 bg-[#002b49] text-white rounded-full font-bold text-xs shadow-lg hover:bg-[#003b63] transition-colors"
          >
            Connexion
          </a>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 2. BLOC MOBILE (< MD)                                       */}
      {/* ------------------------------------------------------------ */}
      <div className="block md:hidden">
        <img
          src="/WEBP/Mobile/Lapince-Hero-Background-Mobile.webp"
          className="absolute bottom-0 right-30 w-screen opacity-40 z-0 pointer-events-none select-none"
          aria-hidden="true"
          alt=""
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-20 z-10 pointer-events-none select-none w-screen h-[45vh]">
          <img
            src="/WEBP/Mobile/Lapince-Hero-Woman-Mobile.webp"
            className="w-full h-full object-contain object-bottom"
            alt="Illustration Mobile"
          />
        </div>
        <img
          src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
          className="absolute top-6 left-6 w-28 z-50 pointer-events-auto"
          alt="Logo Round"
        />
        {/* Fake Inputs Visuels */}
        <div className="absolute top-6 right-6 z-50 space-y-1.5 w-32 opacity-80">
          <div className="w-full h-5 bg-white/70 rounded-full text-[9px] text-gray-400 flex items-center px-3">
            Login
          </div>
          <div className="w-full h-5 bg-white/70 rounded-full text-[9px] text-gray-400 flex items-center px-3">
            Mot de passe
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 3. ZONE DE CONTENU (L'essentiel)                             */}
      {/* ------------------------------------------------------------ */}

      {/* Overlay global */}
      <div
        className="absolute inset-0 bg-white/30 z-20 pointer-events-none"
        aria-hidden="true"
      ></div>

      <div className="absolute inset-0 z-40 overflow-y-auto flex flex-col pt-20 pb-20 px-6 md:pl-[18%] lg:pl-[22%] scrollbar-hide">
        {/* Titres */}
        <header className="max-w-[700px] mt-10 md:mt-20 shrink-0 text-center md:text-left">
          <h1 className="text-[30px] translate-y-30 md:translate-y-0  md:text-[32px] md:text-[50px] lg:text-[65px] font-black italic uppercase leading-[0.9] tracking-tighter text-[#002b49]">
            Votre budget
            <br />
            sans prise de tête.
          </h1>
          <p className="text-[14px] translate-y-30 md:translate-y-0 md:text-[12px] md:text-[15px] lg:text-[19px] font-bold text-[#002b49] opacity-90 mt-6 max-w-[450px] leading-snug">
            La Pince, l’app qui vous aide à garder la main sur votre budget.
          </p>
        </header>

        {/* Liste des bulles de texte (Features) */}
        <section className="hidden lg:block mt-10 space-y-1 w-fit shrink-0 relative z-30 md:ml-12 lg:ml-20">
          {[
            "Tout ce qu'il vous faut. Rien de superflu.<br/>Notez vos denses à la volée.",
            "Aussi rapide que d'envoyer un message.<br/>Visualisez où va votre argent",
            "Des graphiques clairs.<br/>On vous prévient avant que ça dérape",
            "Des alertes intelligentes sur vos budgets.<br/>Fixez des budgets par catégorie",
            "Et tenez-les, on vous aide.",
          ].map((item, index) => (
            <div
              key={index}
              className="px-8 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/20 text-[#002b49] text-[11px] text-left shadow-sm"
            >
              <p
                className="font-black leading-tight"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </div>
          ))}
        </section>

        {/* Bouton d'action */}
        <div className="flex justify-center translate-y-30 md:translate-y-0 md:justify-start mt-10 md:mt-14 pb-16 shrink-0 relative z-30">
          <a href="/register" className={mainButtonStyle}>
            S'inscrire
          </a>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 4. FOOTER                                                    */}
      {/* ------------------------------------------------------------ */}
      <footer className="absolute bottom-0 left-0 w-full z-50">
        <Footer showIcons={false} />
      </footer>
    </main>
  );
}
