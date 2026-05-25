import type { Budget } from "../../types/budget";

/**
 * Composant BudgetHistory
 * Affiche la liste des budgets créés par l'utilisateur sous forme d'historique.
 * Reçoit la liste des budgets en props pour s'aligner sur la logique du Dashboard.
 */
interface BudgetHistoryProps {
  budgets: Budget[];
  onUpdateRequest: (b: Budget) => void;
  onDeleteRequest: (id: number) => void;
}

export default function BudgetHistory({ budgets, onUpdateRequest, onDeleteRequest }: BudgetHistoryProps) {
  // Tri des budgets par date de création (createdAt)
  // On place les plus récents en haut de la liste (ordre décroissant)
  const sorted = [...budgets].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Rendu principal de la liste des budgets
  return (
    <section className="space-y-4">
      {/* En-tête de la section avec icône et titre */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-[#E06B56] flex items-center justify-center shadow-lg">
          <img src="/WEBP/Icones/Lapince-budget.webp" className="w-6 h-6 object-contain" alt="Icône Budget" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Historique des budgets</h3>
      </div>

      {/* Conteneur du tableau avec effet de flou et d'ombre */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* En-tête du tableau */}
            <thead>
              <tr className="bg-white/30 text-[#002b49]/60 font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Catégorie</th>
                <th className="px-8 py-6 text-right">Limite</th>
                <th className="px-8 py-6 text-center">Période</th>
                <th className="px-8 py-6 text-right">Créé le</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            {/* Corps du tableau : on boucle sur chaque budget */}
            <tbody className="divide-y divide-white/20">
              {sorted.map((budget) => (
                <tr key={budget.id} className="hover:bg-white/20 transition-colors group">
                  {/* Colonne Nom de la catégorie */}
                  <td className="px-8 py-6">
                    <span className="font-black text-base md:text-lg text-[#002b49] group-hover:text-black">
                      {budget.category.name}
                    </span>
                  </td>
                  {/* Colonne Montant limite formaté en euros */}
                  <td className="px-8 py-6 text-right">
                    <span className="font-black text-xl md:text-2xl text-[#002b49]">
                      {budget.limit_amount.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </td>
                  {/* Colonne Période (affichage lisible du type) */}
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs md:text-sm font-black uppercase bg-white/40 px-5 py-2 rounded-full text-[#002b49]/80">
                      {budget.period === "monthly" ? "Mensuel" : budget.period === "weekly" ? "Hebdo" : "Perso"}
                    </span>
                  </td>
                  {/* Colonne Date de création formatée */}
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm md:text-base opacity-60 font-bold">
                      {new Date(budget.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  {/* Colonne Actions */}
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onUpdateRequest(budget)}
                        className="text-xs md:text-sm font-black uppercase tracking-tighter bg-[#002b49] text-white px-5 py-2 rounded-full hover:bg-black transition-all shadow-md hover:scale-105"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => onDeleteRequest(budget.id)}
                        className="text-xs md:text-sm font-black uppercase tracking-tighter bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all shadow-md hover:scale-105"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
