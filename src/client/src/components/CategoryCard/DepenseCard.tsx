import { useState, useEffect } from "react"; // 1. Ajout de useEffect
import CategorySelect from "./CategorySelect";
// 2. Importation du service et du type
import { fetchCategories } from "../../services/categoryApi.js"; 
import type { Category } from "../../types/category.js";

import { createTransaction } from "../../services/transactionApi.js";

export default function DepenseCard() {
  // 3. Remplacement du state par un tableau d'objets Category
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorie, setCategorie] = useState("");
  const [transaction, setTransaction] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");

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





  return (
    <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-[#BC8787] flex flex-col items-center justify-center gap-1 md:gap-2 shadow-xl shrink-0">
      {/* Titre */}
      <p className="text-[#002341] font-semibold text-sm md:text-xl tracking-tight bg-white px-3 md:px-4 py-0.5 md:py-1 rounded-full">
        <span className="font-black">—</span> Dépense
      </p>

      {/* Badge Catégorie : On passe maintenant le tableau dynamique */}
      <div className="absolute top-2 right-2 md:hidden">
        <CategorySelect
          categories={categories}
          value={categorie}
          onChange={setCategorie}
          small
        />
      </div>
      <div className="absolute top-1 right-6 hidden md:block">
        <CategorySelect
          categories={categories}
          value={categorie}
          onChange={setCategorie}
        />
      </div>

      {/* Formulaire */}
      <form
        onSubmit={async (e)=> {
          e.preventDefault();
          try {
            await createTransaction({
              amount: Math.abs(Number(montant)), // négatif = dépense
              date: new Date(date).toISOString(),
              description: transaction,
              idcategory : Number(categorie),
            });

            // Réinitialisation du formulaire
            setTransaction("");
            setMontant("");
            setDate("")
            setCategorie("");
            
          } catch(error) {
            console.error("Erreur création dépense:", error)
          }
        }}
        className="flex flex-col items-center gap-1 w-full px-5 md:px-10"
      >
        <input
          type="text"
          placeholder="Transaction"
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          className="w-full h-5 md:h-6 rounded-full bg-white/70 text-[9px] md:text-[10px] px-3 outline-none placeholder:text-gray-500"
        />
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
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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