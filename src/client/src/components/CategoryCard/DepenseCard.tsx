import { useState } from "react";
import CategorySelect from "./CategorySelect";

const CATEGORIES = [
  "Alimentation",
  "Transport",
  "Logement",
  "Santé",
  "Loisirs",
  "Vêtements",
  "Autres",
];

export default function DepenseCard() {
  const [categorie, setCategorie] = useState("");
  const [transaction, setTransaction] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-[#BC8787] flex flex-col items-center justify-center gap-1 md:gap-2 shadow-xl shrink-0">
      {/* Badge Catégorie */}
      <div className="absolute top-2 right-2 md:hidden">
        <CategorySelect categories={CATEGORIES} value={categorie} onChange={setCategorie} small />
      </div>
      <div className="absolute top-4 right-6 hidden md:block">
        <CategorySelect categories={CATEGORIES} value={categorie} onChange={setCategorie} />
      </div>

      {/* Titre */}
      <p className="text-[#002341] font-semibold text-sm md:text-xl tracking-tight mb-1 bg-white px-3 md:px-4 py-0.5 md:py-1 rounded-full">
        <span className="font-black">—</span> Dépense
      </p>

      {/* Formulaire */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Dépense:", { categorie, transaction, montant, date });
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
        <input
          type="number"
          placeholder="Montant"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          className="w-full h-5 md:h-6 rounded-full bg-white/70 text-[9px] md:text-[10px] px-3 outline-none placeholder:text-gray-500"
        />
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
