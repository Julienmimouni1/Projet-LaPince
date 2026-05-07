
// 1. Ajout de useEffect
import { useState, useEffect } from "react"; 

import CategorySelect from "./CategorySelect";
// 2. Importation du service et du type
import { fetchCategories } from "../../services/categoryApi.js"; 
import type { Category } from "../../types/category.js";

import { createBudget } from "../../services/budgetApi.js";

export default function BudgetCard() {
  // 3. Remplacement du state par un tableau d'objets Category
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorie, setCategorie] = useState("");
  const [montant, setMontant] = useState("");
  const [mois, setMois] = useState("");


  //Budget

  const [_isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

    // 4. Chargement des données au montage du composant
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        const expenseCategories = data.filter((cat) => cat.type === "EXPENSE");
        setCategories(expenseCategories);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    }
    loadCategories();
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null)

    const categoryId = parseInt(categorie);
    const amount = parseFloat(montant);

    if (!categoryId || isNaN(amount) || amount <=0) {
      setError("Veuillez remplir tous les champs correctement.");
      return;
    }

  setIsLoading(true);
  try {
    await createBudget({
      limit_amount: amount,
      period: "monthly",   // correspond au sélecteur mois du formulaire
      id_category: categoryId,
    });
    // Réinitialiser le formulaire
    setMontant("");
    setMois("");
    setCategorie("");
    // Si la page parent doit rafraîchir sa liste :
    // onBudgetCreated?.();
  } catch (err) {
    setError("Impossible de créer le budget. Réessaie.");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-[#E06B56] flex flex-col items-center justify-center gap-1 md:gap-2 shadow-xl shrink-0">
      {/* Badge Catégorie */}
      <div className="absolute top-2 right-2 md:hidden">
        <CategorySelect
          categories={categories}
          value={categorie}
          onChange={setCategorie}
          small
        />
      </div>
      <div className="absolute top-4 right-6 hidden md:block">
        <CategorySelect
          categories={categories}
          value={categorie}
          onChange={setCategorie}
        />
      </div>

      {/* Titre */}
      <p className="text-[#002341] font-semibold text-sm md:text-xl tracking-tight mb-1 bg-white px-3 md:px-4 py-0.5 md:py-1 rounded-full flex items-center gap-1 md:gap-2">
        <img src="/WEBP/Icones/Lapince-budget.webp" className="w-4 h-4 md:w-5 md:h-5 object-contain" alt="" />
        Budget
      </p>

      {/* Formulaire */}
      <form onSubmit={handleSubmit}
        className="flex flex-col items-center gap-1 w-full px-5 md:px-10"
      >
        <div className="w-full flex items-center h-5 md:h-6 rounded-full bg-white/70 px-3 gap-1">
          <input
            type="number"
            placeholder="Montant"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="flex-1 bg-transparent text-[9px] md:text-[10px] outline-none placeholder:text-gray-500 min-w-0"
          />
          <span className="text-[9px] md:text-[10px] text-gray-500 shrink-0">€</span>
        </div>
        <input
          type="month"
          value={mois}
          onChange={(e) => setMois(e.target.value)}
          className="w-full h-5 md:h-6 rounded-full bg-white/70 text-[9px] md:text-[10px] px-3 outline-none text-gray-500"
        />
        <button
          type="submit"
          className="mt-0.5 px-4 py-0.5 bg-white/50 hover:bg-white/80 text-[#002b49] text-[8px] md:text-[9px] font-black uppercase rounded-full transition-all"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
