import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchTransactions,
  type Transaction,
} from "../../services/transactionApi";
import { fetchOverview } from "../../services/statsApi";
import type { Overview } from "../../types/stats";

import Footer from "../../components/Footer/footer";
import { AnimatedOrbBackground } from "../../components/AnimatedOrbBackground/AnimatedOrbBackground";
import DepenseCard from "../../components/CategoryCard/DepenseCard";
import RevenuCard from "../../components/CategoryCard/RevenuCard";
import BudgetCard from "../../components/CategoryCard/BudgetCard";
import TransactionSheet from "../../components/TransactionList/TransactionSheet";
import AlertPopup from "../../components/Alert/AlertPopup";
import { useAlerts } from "../../hooks/useAlerts";

export default function TransactionPage() {
  const { currentAlert, handleCloseAlert, loadAlerts } = useAlerts();
  const footerRef = useRef<HTMLElement>(null);
const [footerHeight, setFooterHeight] = useState(0);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trans, ov] = await Promise.all([
        fetchTransactions(),
        fetchOverview(),
        loadAlerts(),
      ]);
      setTransactions(trans.data);
      setOverview(ov);
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, [loadAlerts]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const transactionsSorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  
  if (loading) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#c8dce8]">
        <p className="text-[#002b49] font-black text-xl animate-pulse">
          Chargement…
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#c8dce8]">
        <p className="text-red-600 font-bold text-lg">{error}</p>
      </main>
    );
  }
  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden font-sans text-[#002b49]">
      <AnimatedOrbBackground />
      {/* Arrière-plan billets */}
      <img
        src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
        className="absolute bottom-0 left-0 w-[70vw] opacity-30 object-contain origin-bottom-left z-0 pointer-events-none select-none"
        aria-hidden="true"
        alt=""
      />

      {/* Logo La Pince — classes identiques à la page login */}
      <img
        src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
        className="absolute top-6 left-6 w-28 z-[11] md:hidden"
        alt="Logo Mobile"
      />
      <img
        src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
        className="absolute top-10 left-15 w-24 lg:w-60 z-[11] transition-all hidden md:block"
        alt="Logo"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-white/30 z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Contenu */}
      <div
        className="relative z-20 flex flex-col h-full overflow-y-auto scrollbar-hide pb-40 [mask-image:linear-gradient(to_bottom,transparent_0px,transparent_145px,black_162px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0px,transparent_145px,black_162px)] md:[mask-image:none] md:[-webkit-mask-image:none]"
      >
        {/* En-tête Solde */}
        <header className="flex flex-col items-center pt-44 md:pt-10 pb-4 shrink-0">
          <h1 className="text-[35px] md:text-[50px] lg:text-[60px] font-black uppercase leading-none tracking-tighter">
            Accueil
          </h1>
          <p className="text-base font-bold mt-1">Mon compte</p>
          <p className="text-sm opacity-60 mt-0.5 capitalize">
            {new Date().toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mt-4 leading-none">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 align-bottom">
              Solde *&nbsp;
            </span>
            <span className="text-4xl font-black tracking-tight">
              {" "}
              {overview
                ? overview.balance.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })
                : "…"}
            </span>
          </p>
        </header>

        {/* Cartes — layout en bulles */}
        <section className="relative md:flex-1 flex items-center justify-center">
          {/* Desktop : bulles bien espacées */}
          <div className="hidden md:block relative w-full max-w-4xl h-96">
            <div className="absolute bottom-60 right-12">
              <RevenuCard onSuccess={load} />
            </div>
            <div className="absolute bottom-60 left-12">
              <DepenseCard onSuccess={load} />
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <BudgetCard />
            </div>
          </div>

          {/* Mobile : 2 en haut côte à côte + Budget centré en bas */}
          <div className="flex md:hidden flex-col items-center gap-2 w-full px-2">
            <div className="flex flex-col min-[450px]:flex-row gap-2 justify-center items-center w-full">
              <DepenseCard onSuccess={load} />
              <RevenuCard onSuccess={load} />
            </div>
            <BudgetCard />
          </div>
        </section>
      </div>
      {currentAlert && (
        <AlertPopup
          key={currentAlert.id}
          // key change quand l'alerte change → React démonte/remonte AlertPopup
          // → l'animation d'entrée rejoue pour chaque alerte. Sans key,
          // React réutiliserait le même composant → pas d'animation.
          alert={currentAlert}
          onClose={handleCloseAlert}
        />
      )}
      <TransactionSheet
        transactions={transactionsSorted}
        footerHeight={footerHeight}
      />
      <footer
        ref={footerRef}
        className="absolute bottom-0 left-0 w-full z-[60]"
      >
        <Footer showIcons activeIds={["dashboard", "params"]} />
      </footer>
    </main>
  );
}
