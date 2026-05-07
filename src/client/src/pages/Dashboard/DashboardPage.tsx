import { useEffect, useRef, useState, useMemo } from "react";
import { fetchTransactions, type Transaction } from "../../services/transactionApi";
import { fetchCategories } from "../../services/categoryApi";
import type { Category } from "../../types/category";

import Footer from "../../components/Footer/footer";
import AlertPopup from "../../components/Alert/AlertPopup";
import type { Alert } from "../../types/alert";
import { fetchAlerts, markAlertAsRead } from "../../services/alertApi";

/**
 * IMPORT DES SOUS-COMPOSANTS (Refactorisation)
 * Chaque composant gère une zone précise du Dashboard.
 */
import { StatsCards } from "./components/StatsCards";
import { MonthlyChart } from "./components/MonthlyChart";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";

/**
 * Données de secours (Mock) pour le graphique si aucune donnée n'est présente en base.
 */
const MOCK_DATA = [
  { name: 'Jan', income: 4000, expense: -2400 },
  { name: 'Fév', income: 3000, expense: -1398 },
  { name: 'Mar', income: 2000, expense: -9800 },
  { name: 'Avr', income: 2780, expense: -3908 },
  { name: 'Mai', income: 1890, expense: -4800 },
  { name: 'Juin', income: 2390, expense: -3800 },
  { name: 'Juil', income: 3490, expense: -4300 },
];

export default function DashboardPage() {
  // --- ÉTATS STRUCTURELS ---
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0); // Ajuste le padding bottom de la page

  // --- ÉTATS DES DONNÉES ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState<number | null>(null);

  // --- ÉTATS DES FILTRES ---
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  /**
   * Chargement initial des données depuis l'API.
   * Utilise Promise.all pour charger Transactions, Alertes et Catégories en parallèle.
   */
  const loadData = async () => {
    try {
      const [transData, alertData, catData] = await Promise.all([
        fetchTransactions(),
        fetchAlerts(),
        fetchCategories()
      ]);

      setTransactions(transData);
      setCategories(catData);

      // Gestion de l'affichage séquentiel des alertes non lues
      const unread = alertData.filter((a) => !a.isRead);
      if (unread.length > 0) {
        setAlerts(unread);
        setCurrentAlertIndex(0);
      }
    } catch (error) {
      console.error("Erreur chargement des données :", error);
    }
  };

  // Chargement au montage du composant
  useEffect(() => { loadData(); }, []);

  // Mesure dynamique de la hauteur du footer pour éviter que le contenu ne passe dessous
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // --- LOGIQUE DE FILTRAGE (Mémorisée pour la performance) ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filterType === "ALL" || t.category.type === filterType;
      const matchesSearch = t.description?.toLowerCase().includes(search.toLowerCase());

      const tDate = new Date(t.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      const matchesDate = tDate >= start && tDate <= end;

      const matchesCategory = selectedCategoryIds.length === 0 || selectedCategoryIds.includes(t.category.id);

      return matchesType && matchesSearch && matchesDate && matchesCategory;
    });
  }, [transactions, filterType, search, startDate, endDate, selectedCategoryIds]);

  /**
   * Gère l'ajout/suppression d'une catégorie dans la multi-sélection.
   */
  const toggleCategory = (id: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  // --- LOGIQUE DE CALCUL DU GRAPHIQUE (Mémorisée) ---
  const chartData = useMemo(() => {
    if (transactions.length === 0) return MOCK_DATA;
    const monthlyMap: Record<string, { name: string, income: number, expense: number }> = {};

    // Tri chronologique avant de grouper par mois
    [...transactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(t => {
        const month = new Date(t.date).toLocaleString('fr-FR', { month: 'short' });
        if (!monthlyMap[month]) monthlyMap[month] = { name: month, income: 0, expense: 0 };

        const amount = Number(t.amount);
        if (t.category.type === 'INCOME') monthlyMap[month].income += amount;
        else monthlyMap[month].expense -= amount; // On affiche les dépenses en négatif
      });

    return Object.values(monthlyMap);
  }, [transactions]);

  // --- CALCUL DES STATISTIQUES GLOBALES ---
  const stats = useMemo(() => {
    if (transactions.length === 0) return { income: 4500.50, expense: 2300.20, balance: 2200.30 };

    const income = transactions.reduce((acc, t) =>
      t.category.type === 'INCOME' ? acc + Number(t.amount) : acc, 0
    );
    const expense = transactions.reduce((acc, t) =>
      t.category.type === 'EXPENSE' ? acc + Number(t.amount) : acc, 0
    );

    return { income, expense, balance: income - expense };
  }, [transactions]);

  /**
   * Ferme l'alerte actuelle, la marque comme lue en base,
   * et passe à l'alerte suivante si elle existe.
   */
  function handleCloseAlert() {
    if (currentAlertIndex === null) return;
    markAlertAsRead(alerts[currentAlertIndex].id).catch(console.error);
    const next = currentAlertIndex + 1;
    setCurrentAlertIndex(next < alerts.length ? next : null);
  }

  const currentAlert = currentAlertIndex !== null ? alerts[currentAlertIndex] : null;

  return (
    <main className="fixed inset-0 w-full h-full bg-[#cbd5e1] overflow-hidden font-sans text-[#002b49]">

      {/* Background avec images décoratives floutées */}
      <img
        src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
        className="absolute bottom-0 left-0 w-[60vw] opacity-20 object-contain origin-bottom-left z-0 pointer-events-none select-none"
        aria-hidden="true"
        alt=""
      />
      <div className="absolute inset-0 bg-white/30 z-10 pointer-events-none" aria-hidden="true" />

      {/* Logos Adaptatifs (Mobile / Desktop) */}
      <img src="/WEBP/Mobile/Lapince-Logo-Mobile.webp" className="absolute top-6 left-6 w-28 z-50 md:hidden" alt="Logo" />
      <img src="/WEBP/Desktop/Lapince-Logo-Desktop.webp" className="absolute top-10 left-15 w-24 lg:w-60 z-50 transition-all hidden md:block" alt="Logo" />

      {/* Contenu principal défilable */}
      <div
        className="relative z-20 flex flex-col h-full overflow-y-auto scrollbar-hide"
        style={{ paddingBottom: footerHeight + 40 }}
      >
        {/* Titre de la page */}
        <header className="flex flex-col items-center pt-10 pb-8 shrink-0">
          <h1 className="text-[35px] md:text-[50px] lg:text-[60px] font-black uppercase leading-none tracking-tighter italic">
            Tableau de bord
          </h1>
          <p className="text-base font-bold mt-1 opacity-80">Analyse de vos flux financiers</p>
        </header>

        <div className="max-w-6xl mx-auto w-full px-6 space-y-8">

          {/* Rendu des 3 cartes de totaux */}
          <StatsCards stats={stats} />

          {/* Rendu du graphique Recharts */}
          <MonthlyChart data={chartData} />

          {/* Section Liste des transactions avec ses propres filtres */}
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
              categories={categories}
              selectedCategoryIds={selectedCategoryIds}
              onToggleCategory={toggleCategory}
              onClearCategories={() => setSelectedCategoryIds([])}
            />

            <TransactionTable transactions={filteredTransactions} />
          </section>
        </div>
      </div>

      {/* Popups d'alertes (BNPL, dépassements, etc.) */}
      {currentAlert && <AlertPopup key={currentAlert.id} alert={currentAlert} onClose={handleCloseAlert} />}

      {/* Footer fixe en bas */}
      <footer ref={footerRef} className="absolute bottom-0 left-0 w-full z-[60]">
        <Footer showIcons activeIds={["landingpage", "params", "transactions"]} />
      </footer>
    </main>
  );
}
