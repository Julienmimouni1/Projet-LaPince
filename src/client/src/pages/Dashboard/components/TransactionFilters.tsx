import {useState, useMemo} from "react";
import { type Transaction } from "../../../services/transactionApi";
/**
 * Interface listant toutes les props de filtrage.
 * On utilise le pattern "Lifting State Up" : les états sont gérés par le parent
 * et modifiés via des fonctions de callback (onSearchChange, etc.).
 */
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
  transactions: Transaction[]; // Nécessaire pour afficher la liste des catégories disponibles
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

  const [ isMenuOpen, setIsMenuOpen ] = useState(false);

  const availableCategories = useMemo(() => {
    if(!transactions) return [];
    const cats = new Map<number, any>();
    transactions.forEach(t => cats.set(t.category.id, t.category));
    return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  // "as const" verrouille les types en littéraux ("ALL", "INCOME", "EXPENSE")
  // sans ça, TypeScript infère string et refuse le passage à onFilterTypeChange
  const types = [
    { value: "ALL",     label: "Tous" },
    { value: "INCOME",  label: "Revenus" },
    { value: "EXPENSE", label: "Dépenses" },
  ] as const;

  return (
    <div className="p-6 border-b border-white/20 bg-white/10 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-black italic uppercase">Détails des opérations</h3>

        <div className="flex flex-wrap items-center justify-center gap-3">

          {/* Recherche libre */}
          <input
            type="text"
            placeholder="Rechercher..."
            className="px-5 py-2.5 rounded-full bg-white/50 border border-white/20 text-sm font-bold focus:outline-none focus:bg-white/80 transition-all w-48 shadow-sm"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {/* Filtre par type — pills actif/inactif */}
          <div className="flex gap-2">
            {types.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onFilterTypeChange(value)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all border ${
                  filterType === value
                    ? "bg-[#002b49] text-white border-[#002b49] shadow-md"
                    : "bg-white/20 text-[#002b49] border-white/30 hover:bg-white/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

    
            {/* Bouton catégories */}
            <div className="relative">
              <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
            selectedCategories.length > 0 ? "bg-[#002b49] text-white" : "bg-white/50 border-gray-300"
          }`}
        >
          Catégories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </button>

        {isMenuOpen && (
          <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-2xl z-50 p-2">
            <div className="flex justify-between p-2 border-b mb-2">
              <span className="text-xs font-bold opacity-50">FILTRER</span>
              <button onClick={onResetCategories} className="text-xs text-red-500 font-bold">Reset</button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {availableCategories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => onCategoryToggle(cat.id)}
                    className="accent-[#002b49]"
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
        </div>
        )}
      </div>
      {/* Période */}
          <div className="flex items-center gap-2 bg-white/30 px-5 py-2.5 rounded-full border border-white/20 shadow-sm">
            <span className="text-xs font-black uppercase opacity-60">Du</span>
            <input
              type="date"
              className="bg-transparent text-xs font-bold outline-none cursor-pointer"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
            <span className="text-xs font-black uppercase opacity-60">Au</span>
            <input
              type="date"
              className="bg-transparent text-xs font-bold outline-none cursor-pointer"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
    </div>
    </div>
    </div>
  );
}