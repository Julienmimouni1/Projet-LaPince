import { useState, useMemo, useEffect } from "react";
import { type Transaction } from "../../../services/transactionApi";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  filterType: "ALL" | "INCOME" | "EXPENSE";
  onFilterTypeChange: (val: "ALL" | "INCOME" | "EXPENSE") => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  selectedCategories: number[];
  onCategoryToggle: (id: number) => void;
  onResetCategories: () => void;
  transactions: Transaction[];
}

export function TransactionFilters({
  search, onSearchChange,
  filterType, onFilterTypeChange,
  startDate, onStartDateChange,
  endDate, onEndDateChange,
  selectedCategories,
  onCategoryToggle,
  onResetCategories,
  transactions
}: TransactionFiltersProps) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const availableCategories = useMemo(() => {
    if (!transactions) return [];
    const cats = new Map<number, any>();
    transactions.forEach(t => cats.set(t.category.id, t.category));
    return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  const types = [
    { value: "ALL", label: "Tous" },
    { value: "INCOME", label: "Revenus" },
    { value: "EXPENSE", label: "Dépenses" },
  ] as const;

  // Ferme le menu si on clique en dehors
  useEffect(() => { 
    if (!isMenuOpen) return;
    const hanfleClickOutside = () => {
      setIsMenuOpen(false);
    }

    // On utilise un timeout pour éviter de fermer immédiatement après l'ouverture
    const timer = setTimeout(() => {
      document.addEventListener("click", hanfleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", hanfleClickOutside);
    }
  }, [isMenuOpen]);

  return (
    <div className="p-6 md:p-10 border-b border-white/20 bg-white/10 space-y-6">
      {/* Header : Titre */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tight">
          Détails des opérations
        </h3>

        {/* Grille de contrôles responsive */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full lg:w-auto justify-start md:justify-end">
          
          {/* Recherche libre */}
          <div className="w-full sm:w-64 order-1 sm:order-none">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full sm:w-64 px-6 py-3.5 rounded-full bg-white/50 border border-white/20 text-base font-bold focus:outline-none focus:bg-white/80 transition-all shadow-sm"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Filtre par type */}
          <div className="flex bg-white/20 p-1.5 rounded-full border border-white/10">
            {types.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onFilterTypeChange(value)}
                className={`px-5 md:px-6 py-2 rounded-full text-xs md:text-sm font-black uppercase transition-all ${
                  filterType === value
                    ? "bg-[#002b49] text-white shadow-md"
                    : "text-[#002b49] hover:bg-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bouton catégories */}
          <div className="relative flex-none">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`px-6 py-3 rounded-full border text-sm md:text-base font-bold transition-all shadow-sm min-w-[150px] ${
                selectedCategories.length > 0 
                ? "bg-[#002b49] text-white border-[#002b49]" 
                : "bg-white/50 border-white/20 text-[#002b49]"
              }`}
            >
              Catégories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </button>

            {isMenuOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 shadow-2xl rounded-[2rem] p-4 z-[999] pointer-events-auto"
              >
                <div className="flex justify-between items-center p-3 border-b border-gray-100 mb-2">
                  <span className="text-xs font-black uppercase opacity-50">Filtrer par catégorie</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetCategories();
                    }}
                    className="text-xs text-red-500 font-bold uppercase hover:underline"
                  >
                    Réinitialiser
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-hide space-y-1">
                  {availableCategories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => onCategoryToggle(cat.id)}
                        className="w-5 h-5 rounded border-gray-300 text-[#002b49] focus:ring-[#002b49]"
                      />
                      <span className="text-base font-medium text-[#002b49]">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Période */}
          <div className="flex items-center gap-4 bg-white/30 px-6 py-3 rounded-full border border-white/20 shadow-sm w-full sm:w-auto justify-center">
            <span className="text-xs font-black uppercase opacity-40">Du</span>
            <input
              type="date"
              className="bg-transparent text-sm font-bold outline-none cursor-pointer text-[#002b49]"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
            <span className="text-xs font-black uppercase opacity-40">Au</span>
            <input
              type="date"
              className="bg-transparent text-sm font-bold outline-none cursor-pointer text-[#002b49]"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}