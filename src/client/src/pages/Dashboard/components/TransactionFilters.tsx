import type { Category } from "../../../types/category";

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
}

export function TransactionFilters({
  search, onSearchChange,
  filterType, onFilterTypeChange,
  startDate, onStartDateChange,
  endDate, onEndDateChange,
}: TransactionFiltersProps) {

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