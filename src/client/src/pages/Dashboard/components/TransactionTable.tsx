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
        <thead className="bg-[#002b49]/10 text-[#002b49] text-[10px] font-black uppercase italic tracking-widest">
          <tr>
            <th className="px-8 py-4">Date</th>
            <th className="px-8 py-4">Libellé</th>
            <th className="px-8 py-4">Catégorie</th>
            <th className="px-8 py-4 text-right">Montant</th>
          </tr>
        </thead>
        
        {/* Corps du tableau */}
        <tbody className="divide-y divide-white/10">
          {transactions.length > 0 ? (
            // Si on a des résultats, on boucle dessus
            transactions.map(t => (
              <tr 
                key={t.id} 
                className="hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {/* Date formatée */}
                <td className="px-8 py-4 text-sm font-bold">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                
                {/* Libellé en majuscules italiques */}
                <td className="px-8 py-4 text-sm font-black italic uppercase">
                  {t.description || 'Transaction'}
                </td>
                
                {/* Badge de catégorie */}
                <td className="px-8 py-4">
                   <span className="px-2 py-1 rounded-full bg-white/30 text-[10px] font-black uppercase border border-white/20">
                    {t.category.name}
                   </span>
                </td>
                
                {/* Montant avec couleur dynamique (Vert pour + / Rouge pour -) */}
                <td className={`px-8 py-4 text-sm text-right font-black ${t.category.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.category.type === 'INCOME' ? '+' : '-'} {Number(t.amount).toFixed(2)} €
                </td>
              </tr>
            ))
          ) : (
            // Si aucun résultat (filtres trop restrictifs), on affiche un message
            <tr>
              <td colSpan={4} className="px-8 py-10 text-center opacity-40 italic font-bold">
                Aucun résultat pour ces filtres
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
