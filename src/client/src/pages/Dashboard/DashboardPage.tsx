import { useEffect, useRef, useState } from "react";
import { fetchTransactions, type Transaction } from "../../services/transactionApi";
import { fetchOverview, fetchMonthlyStats } from "../../services/statsApi";
import type { Overview, MonthlyEntry } from "../../types/stats";

import Footer from "../../components/Footer/footer";
import AlertPopup from "../../components/Alert/AlertPopup";
import type { Alert } from "../../types/alert";
import { fetchAlerts, markAlertAsRead } from "../../services/alertApi";

import { StatsCards }         from "./components/StatsCards";
import { MonthlyChart }       from "./components/MonthlyChart";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable }   from "./components/TransactionTable";

export default function DashboardPage() {
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // --- Données venant de l'API ---
  const [overview,     setOverview]     = useState<Overview | null>(null);
  const [monthly,      setMonthly]      = useState<MonthlyEntry[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts,       setAlerts]       = useState<Alert[]>([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState<number | null>(null);

  // --- États des filtres (gérés en local, pas besoin d'API) ---
  const [search,     setSearch]     = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");

  // Promise.all lance les 4 requêtes en parallèle.
  // Si on les faisait l'une après l'autre (await + await + await),
  // le chargement serait 3x plus long sans raison.
  const loadData = async () => {
    try {
      const [trans, ov, mo, alertData] = await Promise.all([
        fetchTransactions(),
        fetchOverview(),
        fetchMonthlyStats(),
        fetchAlerts(),
      ]);

      setTransactions(trans);
      setOverview(ov);
      setMonthly(mo);

      const unread = alertData.filter((a) => !a.isRead);
      if (unread.length > 0) {
        setAlerts(unread);
        setCurrentAlertIndex(0);
      }
    } catch (err) {
      console.error("Erreur chargement dashboard :", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ResizeObserver sur le footer : ajuste le padding-bottom du scroll
  // pour que le dernier bloc ne passe pas derrière le footer fixe.
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filtrage des transactions pour le tableau.
  // Simple .filter() inline — pas besoin de useMemo pour ce volume de données.
  const filtered = transactions.filter((t) => {
    if (filterType !== "ALL" && t.category.type !== filterType) return false;
    if (search && !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
    const d = new Date(t.date).getTime();
    if (startDate && d < new Date(startDate).getTime()) return false;
    if (endDate   && d > new Date(endDate).getTime())   return false;
    return true;
  });

  function handleCloseAlert() {
    if (currentAlertIndex === null) return;
    markAlertAsRead(alerts[currentAlertIndex].id).catch(console.error);
    const next = currentAlertIndex + 1;
    setCurrentAlertIndex(next < alerts.length ? next : null);
  }

  const currentAlert = currentAlertIndex !== null ? alerts[currentAlertIndex] : null;

  return (
    <main className="fixed inset-0 w-full h-full bg-[#cbd5e1] overflow-hidden font-sans text-[#002b49]">
      <img
        src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
        className="absolute bottom-0 left-0 w-[60vw] opacity-20 object-contain origin-bottom-left z-0 pointer-events-none select-none"
        aria-hidden="true" alt=""
      />
      <div className="absolute inset-0 bg-white/30 z-10 pointer-events-none" aria-hidden="true" />

      <img src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"  className="absolute top-6 left-6 w-28 z-50 md:hidden" alt="Logo" />
      <img src="/WEBP/Desktop/Lapince-Logo-Desktop.webp" className="absolute top-10 left-15 w-24 lg:w-60 z-50 transition-all hidden md:block" alt="Logo" />

      <div
        className="relative z-20 flex flex-col h-full overflow-y-auto scrollbar-hide"
        style={{ paddingBottom: footerHeight + 40 }}
      >
        <header className="flex flex-col items-center pt-10 pb-8 shrink-0">
          <h1 className="text-[35px] md:text-[50px] lg:text-[60px] font-black uppercase leading-none tracking-tighter">
            Tableau de bord
          </h1>
          <p className="text-base font-bold mt-1 opacity-80">Analyse de vos flux financiers</p>
        </header>

        <div className="max-w-6xl mx-auto w-full px-6 space-y-8">

          {/* Rendu conditionnel : overview est null tant que l'API n'a pas répondu.
              Sans cette garde, toLocaleString() crasherait sur undefined. */}
          {overview && <StatsCards stats={overview} />}

          {/* Même logique : on n'affiche le graphique que si on a des données. */}
          {monthly.length > 0 && <MonthlyChart data={monthly} />}

          <section className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40 mb-10">
            <TransactionFilters
              search={search}           onSearchChange={setSearch}
              filterType={filterType}   onFilterTypeChange={setFilterType}
              startDate={startDate}     onStartDateChange={setStartDate}
              endDate={endDate}         onEndDateChange={setEndDate}
            />
            <TransactionTable transactions={filtered} />
          </section>

        </div>
      </div>

      {currentAlert && (
        <AlertPopup key={currentAlert.id} alert={currentAlert} onClose={handleCloseAlert} />
      )}

      <footer ref={footerRef} className="absolute bottom-0 left-0 w-full z-[60]">
        <Footer showIcons activeIds={["landingpage", "params", "transactions"]} />
      </footer>
    </main>
  );
}