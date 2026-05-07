import type { Category } from "../../../types/category";

/**
 * Interface listant toutes les props de filtrage.
 * On utilise le pattern "Lifting State Up" : les états sont gérés par le parent
 * et modifiés via des fonctions de callback (onSearchChange, etc.).
 */
interface TransactionFiltersProps {
  // Filtre textuel
  search: string;
  onSearchChange: (val: string) => void;
  
  // Filtre par type (Tout, Revenu, Dépense)
  filterType: "ALL" | "INCOME" | "EXPENSE";
  onFilterTypeChange: (val: "ALL" | "INCOME" | "EXPENSE") => void;
  
  // Filtres par dates
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  
  // Filtres par catégories (Multi-sélection)
  categories: Category[];
  selectedCategoryIds: number[];
  onToggleCategory: (id: number) => void;
  onClearCategories: () => void;
}

/**
 * Composant TransactionFilters : Regroupe tous les outils de filtrage de la liste.
 * Conçu pour être interactif avec des retours visuels immédiats.
 */
export function TransactionFilters({
  search,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  categories,
  selectedCategoryIds,
  onToggleCategory,
  onClearCategories
}: TransactionFiltersProps) {
  return (
    <div className="p-6 border-b border-white/20 bg-white/10 space-y-6">
      
      {/* 1ère Ligne : Titre et Filtres principaux */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-black italic uppercase">Détails des opérations</h3>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Barre de recherche libre */}
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="px-5 py-2.5 rounded-full bg-white/50 border border-white/20 text-sm font-bold focus:outline-none focus:bg-white/80 transition-all w-48 shadow-sm"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          
          {/* Menu déroulant pour le type de flux */}
          <select 
            className="px-5 py-2.5 rounded-full bg-white/50 border border-white/20 text-sm font-bold focus:outline-none focus:bg-white/80 transition-all shadow-sm"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value as any)}
          >
            <option value="ALL">Tous les types</option>
            <option value="INCOME">Revenus</option>
            <option value="EXPENSE">Dépenses</option>
          </select>

          {/* Sélecteur de période (Date début -> Date fin) */}
          <div className="flex items-center gap-2 bg-white/30 px-5 py-2.5 rounded-full border border-white/20 shadow-sm">
            <span className="text-xs font-black uppercase opacity-60">Du</span>
            <input type="date" className="bg-transparent text-xs font-bold outline-none cursor-pointer" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
            <span className="text-xs font-black uppercase opacity-60">Au</span>
            <input type="date" className="bg-transparent text-xs font-bold outline-none cursor-pointer" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
          </div>
        </div>
      </div>

      {/* 2ème Ligne : Puces de catégories (Multi-sélection) */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-black uppercase tracking-widest opacity-50 text-center md:text-left">Filtrer par catégories :</p>
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          
          {/* Bouton pour réinitialiser la sélection de catégories */}
          <button
            onClick={onClearCategories}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all border ${
              selectedCategoryIds.length === 0 
              ? "bg-[#002b49] text-white border-[#002b49] shadow-md scale-105" 
              : "bg-white/20 text-[#002b49] border-white/30 hover:bg-white/40"
            }`}
          >
            Toutes
          </button>

          {/* Boucle sur les catégories disponibles (filtrées selon INCOME/EXPENSE si besoin) */}
          {categories
            .filter(c => filterType === "ALL" || c.type === filterType)
            .map(cat => (
              <button
                key={cat.id}
                onClick={() => onToggleCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all border flex items-center gap-2 ${
                  selectedCategoryIds.includes(cat.id)
                  ? "bg-white text-[#002b49] border-white shadow-lg scale-105" 
                  : "bg-white/20 text-[#002b49] border-white/30 hover:bg-white/40"
                }`}
              >
                {/* Petit indicateur de couleur de la catégorie */}
                {cat.color && (
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                )}
                {cat.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
