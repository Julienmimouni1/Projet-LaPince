import { useEffect, useRef, useState } from "react";
import {
  fetchTransactions,
  type Transaction,
} from "../../services/transactionApi"; //Imports Transactions

import Footer from "../../components/Footer/footer";
import DepenseCard from "../../components/CategoryCard/DepenseCard";
import RevenuCard from "../../components/CategoryCard/RevenuCard";
import BudgetCard from "../../components/CategoryCard/BudgetCard";
import TransactionSheet from "../../components/TransactionList/TransactionSheet";
import { MOCK_TRANSACTIONS } from "../../mocks/transactions.mock";

import AlertPopup from "../../components/Alert/AlertPopup";
import { MOCK_BUDGETS } from "../../mocks/budgets.mock";
import { computeAlerts } from "../../utils/computeAlerts";
import type { Alert } from "../../types/alert";

// Page placeholder — sera remplacée par la version de Marie
export default function TransactionPage() {
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(() =>
    window.innerWidth >= 768 ? 50 : 35,
  );

  // --- Logique alertes ---
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // null = aucune popup visible. Un nombre = index de l'alerte affichée.
  const [currentAlertIndex, setCurrentAlertIndex] = useState<number | null>(
    null,
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  //Transactions
  const load = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erreur chargement transactions :", error);
    }
  };

  const solde = transactions.reduce((sum, t) => {
    return t.category.type === "INCOME"
      ? sum + Number(t.amount)
      : sum - Number(t.amount);
  }, 0);

  // transactions update

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const computed = computeAlerts(MOCK_TRANSACTIONS, MOCK_BUDGETS);
    if (computed.length > 0) {
      setAlerts(computed);
      setCurrentAlertIndex(0); // affiche la première alerte dès le montage
    }
  }, []); // [] = une seule fois au montage du composant

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

const transactionsSorted = [...transactions].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

  function handleCloseAlert() {
    if (currentAlertIndex === null) return;

    const nextIndex = currentAlertIndex + 1;

    if (nextIndex < alerts.length) {
      setCurrentAlertIndex(nextIndex); // alerte suivante
    } else {
      setCurrentAlertIndex(null); // plus d'alertes → popup disparaît
    }
  }

  const currentAlert =
    currentAlertIndex !== null ? alerts[currentAlertIndex] : null;

  return (
    <main className="fixed inset-0 w-full h-full bg-[#cbd5e1] overflow-hidden font-sans text-[#002b49]">
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
        className="absolute top-6 left-6 w-28 z-50 md:hidden"
        alt="Logo Mobile"
      />
      <img
        src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
        className="absolute top-10 left-15 w-24 lg:w-60 z-50 transition-all hidden md:block"
        alt="Logo"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-white/30 z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Contenu */}
      <div className="relative z-20 flex flex-col h-full pb-10">
        {/* En-tête Solde */}
        <header className="flex flex-col items-center pt-10 pb-4 shrink-0">
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
              {solde.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
          </p>
        </header>

        {/* Cartes — layout en bulles */}
        <section className="relative flex-1 flex items-center justify-center">
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
          <div className="flex md:hidden flex-col items-center gap-6 w-full px-2">
            <div className="flex gap-6 justify-center w-full">
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
      <footer ref={footerRef} className="absolute bottom-0 left-0 w-full z-[60]">
        <Footer showIcons activeIds={["landingpage", "params"]} />
      </footer>
    </main>
  );
}
