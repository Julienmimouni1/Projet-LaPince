import type { Transaction } from "../../../services/transactionApi";

/**
 * Interface pour la liste des transactions filtrées à afficher.
 */
interface TransactionTableProps {
  transactions: Transaction[];
}

/**
 * Composant TransactionTable : Rendu pur des données sous forme de tableau.
 * Gère également l'état vide (Empty State).
 */
export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        {/* En-tête du tableau avec style spécifique "La Pince" */}
        <thead className="bg-[#002b49]/10 text-[#002b49] text-xs md:text-sm font-black uppercase italic tracking-widest">
          <tr>
            <th className="px-6 md:px-10 py-5 md:py-6">Date</th>
            <th className="px-6 md:px-10 py-5 md:py-6">Libellé</th>
            <th className="px-6 md:px-10 py-5 md:py-6">Catégorie</th>
            <th className="px-6 md:px-10 py-5 md:py-6 text-right">Montant</th>
          </tr>
        </thead>

        {/* Corps du tableau */}
        <tbody className="divide-y divide-white/10">
          {transactions.length > 0 ? (
            transactions.map(t => (
              <tr
                key={t.id}
                className="hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <td className="px-6 md:px-10 py-4 md:py-6 text-xs md:text-base font-bold whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                </td>

                <td className="px-6 md:px-10 py-4 md:py-6 text-xs md:text-base font-black italic uppercase max-w-[120px] md:max-w-none truncate">
                  {t.description || 'Transaction'}
                </td>

                <td className="px-6 md:px-10 py-4 md:py-6">
                  <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/30 text-xs md:text-sm font-black uppercase border border-white/20 whitespace-nowrap">
                    {t.category.name}
                  </span>
                </td>

                <td className={`px-6 md:px-10 py-4 md:py-6 text-sm md:text-xl text-right font-black whitespace-nowrap ${t.category.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.category.type === 'INCOME' ? '+' : '-'}{Number(t.amount).toFixed(2)}€
                </td>
              </tr>
            ))
          ) : (
            // Si aucun résultat
            <tr>
              <td colSpan={4} className="px-8 py-16 text-center opacity-40 italic font-bold text-xl">
                Aucun résultat pour ces filtres
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
