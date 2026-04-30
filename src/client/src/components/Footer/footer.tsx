/**
 * Interface pour la structure d'un élément de navigation
 */
interface NavItem {
  id: string;
  label: string;
  href: string;
  src: string;
}

/**
 * Interface pour les propriétés du Footer
 * @param showIcons - Active ou désactive l'affichage du bloc d'icônes
 * @param activeIds - Liste des IDs des icônes à afficher spécifiquement sur cette page
 */
interface FooterProps {
  showIcons?: boolean;
  activeIds?: string[];
}

export default function Footer({
  showIcons = false,
  activeIds = [],
}: FooterProps) {
  /**
   * Inventaire centralisé de toutes les icônes disponibles dans le projet.
   * Vous pouvez ajouter ici de nouveaux éléments sans affecter toutes les pages.
   */
  const allAvailableItems: NavItem[] = [
    {
      id: "home",
      label: "Accueil",
      href: "/",
      src: "/WEBP/Icones/Lapince-home-icon.webp",
    },
    {
      id: "params",
      label: "Parameters",
      href: "/parameters",
      src: "/WEBP/Icones/Lapince-dashboard-icon.webp",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      src: "/WEBP/Icones/Lapince-dashboard-icon.webp",
    },
    {
      id: "transactions",
      label: "Transactions",
      href: "/transactions",
      src: "/WEBP/Icones/Lapince-transactions-icon.webp",
    },
  ];

  /**
   * Filtrage des éléments : on ne garde que ceux dont l'ID est présent dans activeIds
   */
  const visibleItems = allAvailableItems.filter((item) =>
    activeIds.includes(item.id),
  );

  return (
    <>
      {/* ------------------------------------------------------------ */}
      {/* 1. FOOTER MOBILE (< MD)                                      */}
      {/* ------------------------------------------------------------ */}
      <footer className="md:hidden w-full h-[35px] bg-white flex items-center px-4 relative border-t border-gray-100">
        {/* Affichage des Mentions Légales si aucune icône n'est active */}
        {!showIcons || visibleItems.length === 0 ? (
          <p className="w-full text-center text-[9px] font-bold text-[#002b49] opacity-70 uppercase">
            Mentions légales
          </p>
        ) : (
          /* Affichage dynamique des icônes sélectionnées */
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-15">
            {visibleItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center gap-1.5 shrink-0"
              >
                <img src={item.src} className="w-4 h-4 object-contain" alt="" />
                <span className="text-[9px] font-black uppercase text-[#002b49]">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        )}
      </footer>

      {/* ------------------------------------------------------------ */}
      {/* 2. FOOTER DESKTOP (MD+)                                      */}
      {/* ------------------------------------------------------------ */}
      <footer className="hidden md:flex w-full h-[50px] bg-white items-center px-10 relative border-t border-gray-100">
        {/* Texte aligné à gauche si icônes présentes, sinon centré */}
        <p
          className={`text-[11px] font-bold text-[#002b49] opacity-70 uppercase ${
            showIcons && visibleItems.length > 0
              ? "text-left"
              : "w-full text-center"
          }`}
        >
          Mentions légales
        </p>

        {/* Bloc central des icônes sélectionnées */}
        {showIcons && visibleItems.length > 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-50">
            {visibleItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center gap-2.5 hover:scale-105 transition-all group shrink-0"
              >
                <img src={item.src} className="w-5 h-5 object-contain" alt="" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#002b49]">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        )}
      </footer>
    </>
  );
}
