import { useState } from "react";
import CategorySelect from "./CategorySelect";

const CATEGORIES = ["Mensuel", "Hebdomadaire", "Annuel", "Ponctuel"];

export default function BudgetCard() {
  const [categorie, setCategorie] = useState("");
  const [montant, setMontant] = useState("");
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");

  return (
    <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-[#E06B56] flex flex-col items-center justify-center gap-1 md:gap-2 shadow-xl shrink-0">
      {/* Badge Catégorie */}
      <div className="absolute top-2 right-2 md:hidden">
        <CategorySelect categories={CATEGORIES} value={categorie} onChange={setCategorie} small />
      </div>
      <div className="absolute top-4 right-6 hidden md:block">
        <CategorySelect categories={CATEGORIES} value={categorie} onChange={setCategorie} />
      </div>

      {/* Titre */}
      <p className="text-[#002341] font-semibold text-sm md:text-xl tracking-tight mb-1 bg-white px-3 md:px-4 py-0.5 md:py-1 rounded-full flex items-center gap-1 md:gap-2">
        <img src="/WEBP/Icones/Lapince-budget.webp" className="w-4 h-4 md:w-5 md:h-5 object-contain" alt="" />
        Budget
      </p>

      {/* Formulaire */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Budget:", { categorie, montant, du, au });
        }}
        className="flex flex-col items-center gap-1 w-full px-5 md:px-10"
      >
        <input
          type="number"
          placeholder="Montant"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          className="w-full h-5 md:h-6 rounded-full bg-white/70 text-[9px] md:text-[10px] px-3 outline-none placeholder:text-gray-500"
        />
        <div className="w-full flex items-center gap-1">
          <span className="text-[#002341] text-[8px] md:text-[9px] font-medium shrink-0">Du :</span>
          <input
            type="date"
            value={du}
            onChange={(e) => setDu(e.target.value)}
            className="flex-1 h-5 md:h-6 rounded-full bg-white/70 text-[9px] md:text-[10px] px-3 outline-none text-gray-500"
          />
        </div>
        <div className="w-full flex items-center gap-1">
          <span className="text-[#002341] text-[8px] md:text-[9px] font-medium shrink-0">Au :</span>
          <input
            type="date"
            value={au}
            onChange={(e) => setAu(e.target.value)}
            className="flex-1 h-5 md:h-6 rounded-full bg-white/70 text-[9px] md:text-[10px] px-3 outline-none text-gray-500"
          />
        </div>
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
