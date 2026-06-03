import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  fetchTransactions,
  type Transaction,
} from "../../services/transactionApi";
import { fetchBudgets, updateBudget as apiUpdateBudget, deleteBudget as apiDeleteBudget } from "../../services/budgetApi";
import type { Budget } from "../../types/budget";
import { useAlerts } from "../../hooks/useAlerts";

import Footer from "../../components/Footer/footer";
import { AnimatedOrbBackground } from "../../components/AnimatedOrbBackground/AnimatedOrbBackground";
import AlertPopup from "../../components/Alert/AlertPopup";

import { StatsCards } from "./components/StatsCards";
import { MonthlyChart } from "./components/MonthlyChart";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";
import BudgetHistory from "../../components/Budget/BudgetHistory";
import { useStats } from "../../hooks/useStats";
import type { MonthlyEntry } from "../../types/stats";

export default function DashboardPage() {
  const { currentAlert, handleCloseAlert, loadAlerts } = useAlerts();
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // --- AJOUT : les statistiques globales viennent désormais du hook useStats ---
  const { overview, monthly, loadStats } = useStats();

  // --- Données venant de l'API ---
  // --- AJOUT : seules les transactions restent gérées localement ici ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // --- États pour la modification/suppression de budget ---
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [confirmBudgetData, setConfirmBudgetData] = useState<{
    action: "delete" | "update";
    payload: any;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- États des filtres ---
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">(
    "ALL",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // --- Etats de chargement et gestion des erreurs ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Logique de filtrage des transactions ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType =
        filterType === "ALL" || t.category.type === filterType;
      const matchesSearch =
        !search.trim() ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category.name.toLowerCase().includes(search.toLowerCase());
      const transactionDate = new Date(t.date).getTime();
      const matchesStart =
        !startDate || transactionDate >= new Date(startDate).getTime();
      const matchesEnd =
        !endDate || transactionDate <= new Date(endDate).getTime();
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(t.category.id);
      return (
        matchesType &&
        matchesSearch &&
        matchesStart &&
        matchesEnd &&
        matchesCategory
      );
    });
  }, [
    transactions,
    search,
    filterType,
    startDate,
    endDate,
    selectedCategories,
  ]);

  // --- 2. Calcul du Graphique (C'est ici qu'on répare les barres) ---
  const displayMonthlyData = useMemo(() => {
    // Si aucun filtre n'est activé, on utilise les données parfaites de l'API (monthly)
    if (
      !search &&
      filterType === "ALL" &&
      !startDate &&
      !endDate &&
      selectedCategories.length === 0
    ) {
      return monthly;
    }

    // Sinon, on recalcule les barres à la volée selon les filtres
    const monthlyMap: Record<string, MonthlyEntry> = {};

    // On trie pour avoir les mois dans l'ordre
    const sorted = [...filteredTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    sorted.forEach((t) => {
      const monthName = new Date(t.date).toLocaleString("fr-FR", {
        month: "short",
      });
      if (!monthlyMap[monthName]) {
        monthlyMap[monthName] = { month: monthName, income: 0, expenses: 0 };
      }
      const amount = Math.abs(Number(t.amount || 0));
      if (t.category.type === "INCOME") monthlyMap[monthName].income += amount;
      else monthlyMap[monthName].expenses += amount;
    });

    return Object.values(monthlyMap);
  }, [
    filteredTransactions,
    monthly,
    search,
    filterType,
    startDate,
    endDate,
    selectedCategories,
  ]);

  // --- 3. Calcul des Stats (Overview) ---
  const displayOverview = useMemo(() => {
    if (
      !search &&
      filterType === "ALL" &&
      !startDate &&
      !endDate &&
      selectedCategories.length === 0
    ) {
      return overview;
    }
    const income = filteredTransactions
      .filter((t) => t.category.type === "INCOME")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const expenses = filteredTransactions
      .filter((t) => t.category.type === "EXPENSE")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    return { income, expenses, balance: income - expenses };
  }, [
    filteredTransactions,
    overview,
    search,
    filterType,
    startDate,
    endDate,
    selectedCategories,
  ]);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  // --- AJOUT : loadData utilise désormais loadStats (hook) au lieu de fetch direct ---
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [trans, budg] = await Promise.all([fetchTransactions(), fetchBudgets()]);
      setTransactions(trans.data);
      setBudgets(budg);
      await loadStats();
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  useEffect(() => {
    (async () => {
      await loadData();
    })();
    window.addEventListener("transaction:created", loadData);
    return () => window.removeEventListener("transaction:created", loadData);
  }, [loadData]);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading)
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#cbd5e1]">
        <p className="text-[#002b49] font-black text-xl animate-pulse">
          Chargement…
        </p>
      </main>
    );
  if (error)
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#cbd5e1]">
        <p className="text-red-600 font-bold text-lg">{error}</p>
      </main>
    );

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden font-sans text-[#002b49]">
      <AnimatedOrbBackground />

      {/* Arrière-plan */}
      <img
        src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
        className="absolute bottom-0 left-0 w-[60vw] opacity-20 object-contain origin-bottom-left z-0 pointer-events-none select-none"
        aria-hidden="true"
        alt=""
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-white/30 z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Logos */}
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

      {/* Contenu principal */}
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

        <div className="max-w-screen-2xl mx-auto w-full px-6 space-y-12">
          {displayOverview && <StatsCards stats={displayOverview} />}
          {displayMonthlyData.length > 0 && (
            <MonthlyChart data={displayMonthlyData} />
          )}

          {/* Aligné sur MonthlyChart : on n'affiche l'historique que s'il y a des budgets. */}
          {budgets.length > 0 && (
            <BudgetHistory
              budgets={budgets}
              onUpdateRequest={(b) => setEditingBudget(b)}
              onDeleteRequest={(id) => setConfirmBudgetData({ action: "delete", payload: id })}
            />
          )}

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
            <TransactionTable transactions={filteredTransactions} />
          </section>
        </div>
      </div>

      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-full font-black shadow-2xl animate-in fade-in slide-in-from-top-4">
          {successMessage}
        </div>
      )}

      {/* Modal de Confirmation (Update/Delete Budget) */}
      {confirmBudgetData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-[90%] max-w-[400px] text-center shadow-2xl border border-white/20">
            <p className="font-black text-2xl text-[#002b49] mb-2 uppercase tracking-tighter">Confirmation</p>
            <p className="text-sm font-medium opacity-60 mb-8">
              {confirmBudgetData.action === "delete"
                ? "Voulez-vous vraiment supprimer ce budget ? Cette action est irréversible."
                : `Voulez-vous enregistrer les modifications pour ce budget ?`}
            </p>

            <div className="flex justify-between gap-4">
              <button
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-[#002b49] font-black uppercase text-sm hover:bg-gray-200 transition-colors"
                onClick={() => setConfirmBudgetData(null)}
              >
                Annuler
              </button>
              <button
                className={`flex-1 py-3 rounded-2xl text-white font-black uppercase text-sm transition-colors ${
                  confirmBudgetData.action === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-[#002b49] hover:bg-black"
                }`}
                onClick={async () => {
                  try {
                    if (confirmBudgetData.action === "delete") {
                      await apiDeleteBudget(confirmBudgetData.payload);
                      setSuccessMessage("✓ Budget supprimé");
                    } else if (confirmBudgetData.action === "update") {
                      const res = await apiUpdateBudget(confirmBudgetData.payload.id, confirmBudgetData.payload.data);
                      if (res.alreadyExceeded) {
                        setSuccessMessage(`✓ Modifié !\n⚠ Dépassé (${res.currentTotal}€)`);
                      } else {
                        setSuccessMessage("✓ Budget mis à jour");
                      }
                    }
                    await loadData();
                    await loadAlerts();
                    setTimeout(() => setSuccessMessage(null), 5000);
                  } catch (err) {
                    console.error(err);
                  }
                  setConfirmBudgetData(null);
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'Édition de Budget */}
      {editingBudget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm">
          <div className="bg-white text-[#002b49] p-8 rounded-[2.5rem] w-[95%] max-w-[400px] shadow-2xl border border-white/20">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Modifier le budget</h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const amount = Number(formData.get("amount"));
                const period = formData.get("period") as any;
                const moisRaw = formData.get("mois") as string;

                const payload: any = { limit_amount: amount, period };
                if (moisRaw) {
                  const [year, month] = moisRaw.split("-");
                  payload.year = parseInt(year);
                  payload.month = parseInt(month);
                }

                setConfirmBudgetData({
                  action: "update",
                  payload: { id: editingBudget.id, data: payload },
                });
                setEditingBudget(null);
              }}
            >
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Montant (€)</label>
                <input
                  type="number"
                  name="amount"
                  defaultValue={editingBudget.limit_amount}
                  required
                  step="0.01"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#002b49]/20"
                  placeholder="Montant"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Mois / Année</label>
                <input
                  type="month"
                  name="mois"
                  defaultValue={editingBudget.year && editingBudget.month ? `${editingBudget.year}-${String(editingBudget.month).padStart(2, '0')}` : ""}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#002b49]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Période</label>
                <select
                  name="period"
                  defaultValue={editingBudget.period}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#002b49]/20 appearance-none"
                >
                  <option value="monthly">Mensuel</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-[#002b49] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
                  className="w-full bg-gray-100 text-[#002b49] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentAlert && (
        <AlertPopup
          key={currentAlert.id}
          alert={currentAlert}
          onClose={handleCloseAlert}
        />
      )}

      <footer
        ref={footerRef}
        className="absolute bottom-0 left-0 w-full z-[60]"
      >
        <Footer showIcons activeIds={["transactions", "params"]} />
      </footer>
    </main>
  );
}
