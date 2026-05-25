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
    <div className="p-4 md:p-6 border-b border-white/20 bg-white/10 space-y-4">
      {/* Header : Titre */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h3 className="text-lg md:text-xl font-black italic uppercase tracking-tight">
          Détails des opérations
        </h3>

        {/* Grille de contrôles responsive */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full lg:w-auto justify-start md:justify-end">
          
          {/* Recherche libre : Pleine largeur sur petit mobile, fixe ensuite */}
          <div className="w-full sm:w-48 order-1 sm:order-none">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full sm:w-48 px-5 py-2.5 rounded-full bg-white/50 border border-white/20 text-sm font-bold focus:outline-none focus:bg-white/80 transition-all shadow-sm"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Filtre par type : Groupe de boutons compact */}
          <div className="flex bg-white/20 p-1 rounded-full border border-white/10">
            {types.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onFilterTypeChange(value)}
                className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase transition-all ${
                  filterType === value
                    ? "bg-[#002b49] text-white shadow-md"
                    : "text-[#002b49] hover:bg-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bouton catégories : Menu déroulant - FIX: flex-none ajouté */}
          <div className="relative flex-none">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`px-4 py-2 rounded-full border text-xs md:text-sm font-bold transition-all shadow-sm min-w-[120px] ${
                selectedCategories.length > 0 
                ? "bg-[#002b49] text-white border-[#002b49]" 
                : "bg-white/50 border-white/20 text-[#002b49]"
              }`}
            >
              Catégories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </button>

            {isMenuOpen && (
              
              <div 
                onClick={(e) => e.stopPropagation()} // Empêche le clic de remonter jusqu'à window
                className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 shadow-2xl rounded-2xl p-2 z-[999] pointer-events-auto"
                style={{ 
                  position: 'absolute',
                  left: 'auto',
                  margin: 0,
                 }}>
                <div className="flex justify-between items-center p-2 border-b border-gray-100 mb-2">
                  <span className="text-[10px] font-black uppercase opacity-50">Filtrer par catégorie</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche la fermeture accidentelle
                      onResetCategories();
                    }}
                    className="text-[10px] text-red-500 font-bold uppercase hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto scrollbar-hide">
                  {availableCategories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => onCategoryToggle(cat.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#002b49] focus:ring-[#002b49]"
                      />
                      <span className="text-sm font-medium text-[#002b49]">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Période : S'adapte en colonne sur très petit écran, ligne sinon */}
          <div className="flex items-center gap-2 bg-white/30 px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/20 shadow-sm w-full sm:w-auto justify-center">
            <span className="text-[10px] font-black uppercase opacity-40">Du</span>
            <input
              type="date"
              className="bg-transparent text-[10px] md:text-xs font-bold outline-none cursor-pointer text-[#002b49]"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
            <span className="text-[10px] font-black uppercase opacity-40">Au</span>
            <input
              type="date"
              className="bg-transparent text-[10px] md:text-xs font-bold outline-none cursor-pointer text-[#002b49]"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}