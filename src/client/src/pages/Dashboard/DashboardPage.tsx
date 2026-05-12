import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  fetchTransactions,
  type Transaction,
} from "../../services/transactionApi";
import { fetchOverview, fetchMonthlyStats } from "../../services/statsApi";
import type { Overview, MonthlyEntry } from "../../types/stats";
import { useAlerts } from "../../hooks/useAlerts";

import Footer from "../../components/Footer/footer";
import { AnimatedOrbBackground } from "../../components/AnimatedOrbBackground/AnimatedOrbBackground";
import AlertPopup from "../../components/Alert/AlertPopup";

import { StatsCards } from "./components/StatsCards";
import { MonthlyChart } from "./components/MonthlyChart";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";
import TransactionSheet from "../../components/TransactionList/TransactionSheet";

export default function DashboardPage() {
  const { currentAlert, handleCloseAlert, loadAlerts } = useAlerts();
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // --- Données venant de l'API ---
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyEntry[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // --- États des filtres (gérés en local, pas besoin d'API) ---
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">(
    "ALL",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- Etats de chargement et gestion des erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Sélection de catégories pour affichage avancé des transactions
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const toggleCategory = (id: number) => {
  setSelectedCategories(prev =>
    prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
  );
};

  // --- Logique de filtrage des transactions pour le tableau et la sheet. 
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Filtre par type
      const matchesType = filterType === "ALL" || t.category.type === filterType;
      // Filtre par recherche texte
      const matchesSearch = !search.trim() || 
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category.name.toLowerCase().includes(search.toLowerCase());
      // Filtre par date
      const transactionDate = new Date(t.date).getTime();
      const matchesStart = !startDate || transactionDate >= new Date(startDate).getTime();
      const matchesEnd = !endDate || transactionDate <= new Date(endDate).getTime();
      // Filtre par catégorie sélectionnée
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(t.category.id);
      return matchesType && matchesSearch && matchesStart && matchesEnd && matchesCategory;
    });
  }, [transactions, search, filterType, startDate, endDate, selectedCategories]);
      
  

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trans, ov, mo] = await Promise.all([
        fetchTransactions(),
        fetchOverview(),
        fetchMonthlyStats(),
        loadAlerts(),
      ]);
      setTransactions(trans.data);
      setOverview(ov);
      setMonthly(mo);
    } catch {
      setError("Impossible de charger les données. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  }, [loadAlerts]);

  useEffect(() => {
    loadData();
    window.addEventListener("transaction:created", loadData);
    return () => window.removeEventListener("transaction:created", loadData);
  }, [loadData]);

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
  if (search && !t.description?.toLowerCase().includes(search.toLowerCase()))
   return false;
  const d = new Date(t.date).getTime();
  if (startDate && d < new Date(startDate).getTime()) return false;
  if (endDate && d > new Date(endDate).getTime()) return false;
  return true;
  });

  

if (loading) {
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-[#cbd5e1]">
      <p className="text-[#002b49] font-black text-xl animate-pulse">Chargement…</p>
    </main>
  );
}

if (error) {
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-[#cbd5e1]">
      <p className="text-red-600 font-bold text-lg">{error}</p>
    </main>
  );
}


  return (
    
    <main className="fixed inset-0 w-full h-full overflow-hidden font-sans text-[#002b49]">
      <AnimatedOrbBackground />
      <img
        src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
        className="absolute bottom-0 left-0 w-[60vw] opacity-20 object-contain origin-bottom-left z-0 pointer-events-none select-none"
        aria-hidden="true"
        alt=""
      />
      <div
        className="absolute inset-0 bg-white/30 z-10 pointer-events-none"
        aria-hidden="true"
      />

      <img
        src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
        className="absolute top-6 left-6 w-28 z-[11] md:hidden"
        alt="Logo"
      />
      <img
        src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
        className="absolute top-10 left-15 w-24 lg:w-60 z-[11] transition-all hidden md:block"
        alt="Logo"
      />

      <div
        className="relative z-20 flex flex-col h-full overflow-y-auto scrollbar-hide"
        style={{ paddingBottom: footerHeight + 40 }}
      >
        <header className="flex flex-col items-center pt-40 md:pt-10 pb-8 shrink-0">
          <h1 className="text-[35px] md:text-[50px] lg:text-[60px] font-black uppercase leading-none tracking-tighter">
            Tableau de bord
          </h1>
          <p className="text-base font-bold mt-1 opacity-80">
            Analyse de vos flux financiers
          </p>
        </header>

        <div className="max-w-6xl mx-auto w-full px-6 space-y-8">
          {/* Rendu conditionnel : overview est null tant que l'API n'a pas répondu.
              Sans cette garde, toLocaleString() crasherait sur undefined. */}
          {overview && <StatsCards stats={overview} />}

          {/* Même logique : on n'affiche le graphique que si on a des données. */}
          {monthly.length > 0 && <MonthlyChart data={monthly} />}

          <section className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40 mb-10">
            <TransactionFilters
              search={search}
              onSearchChange={setSearch}
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              selectedCategories={selectedCategories}
              onCategoryToggle={toggleCategory}
              onResetCategories={() => setSelectedCategories([])}
              transactions={transactions}
            />
            <TransactionTable transactions={filtered} />
            
          </section>
        </div>
      </div>

      {currentAlert && (
        <AlertPopup
          key={currentAlert.id}
          alert={currentAlert}
          onClose={handleCloseAlert}
        />
      )}

      <TransactionSheet 
        transactions={filteredTransactions} 
        footerHeight={footerHeight} 
      />

      

      <footer
        ref={footerRef}
        className="absolute bottom-0 left-0 w-full z-[60]"
      >
        <Footer
          showIcons
          activeIds={["transactions", "params"]}
        />
      </footer>
    </main>
  );
}
