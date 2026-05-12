import { useEffect, useState } from "react";
// Importation du service API pour récupérer les budgets
import { fetchBudgets } from "../../services/budgetApi";
// Importation du type Budget pour le typage TypeScript
import type { Budget } from "../../types/budget";

/**
 * Composant BudgetHistory
 * Affiche la liste des budgets créés par l'utilisateur sous forme d'historique.
 */
export default function BudgetHistory() {
  // État pour stocker la liste des budgets
  const [budgets, setBudgets] = useState<Budget[]>([]);
  // État pour gérer le chargement (affiche un indicateur pendant l'appel API)
  const [loading, setLoading] = useState(true);
  // État pour stocker un éventuel message d'erreur
  const [error, setError] = useState<string | null>(null);

  // useEffect s'exécute une seule fois au montage du composant
  useEffect(() => {
    async function load() {
      try {
        // 1. Appel à l'API pour récupérer tous les budgets de l'utilisateur
        const data = await fetchBudgets();
        
        // 2. Tri des budgets par date de création (createdAt)
        // On place les plus récents en haut de la liste (ordre décroissant)
        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        
        // 3. Mise à jour de l'état avec les données triées
        setBudgets(sorted);
      } catch (err) {
        // Gestion de l'erreur si l'appel API échoue
        setError("Erreur lors du chargement de l'historique.");
        console.error(err);
      } finally {
        // Arrêt de l'indicateur de chargement, peu importe l'issue
        setLoading(false);
      }
    }
    load();
  }, []);

  // Affichage pendant le chargement des données
  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#002b49] font-bold animate-pulse">Chargement de l'historique des budgets...</p>
      </div>
    );
  }

  // Affichage en cas d'erreur de récupération
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  // Affichage si la liste est vide (aucun budget créé)
  if (budgets.length === 0) {
    return (
      <section className="bg-white/20 backdrop-blur-md rounded-[2.5rem] p-8 text-center border border-white/30">
        <h3 className="text-xl font-black uppercase tracking-tight mb-2">Historique des budgets</h3>
        <p className="opacity-60 italic text-sm">Aucun budget enregistré pour le moment.</p>
      </section>
    );
  }

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
              <tr className="bg-white/30 text-[#002b49]/60 font-bold text-[10px] uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4 text-right">Limite</th>
                <th className="px-6 py-4">Période</th>
                <th className="px-6 py-4 text-right">Créé le</th>
              </tr>
            </thead>
            {/* Corps du tableau : on boucle sur chaque budget */}
            <tbody className="divide-y divide-white/20">
              {budgets.map((budget) => (
                <tr key={budget.id} className="hover:bg-white/20 transition-colors group">
                  {/* Colonne Nom de la catégorie */}
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#002b49] group-hover:text-black">
                      {budget.category.name}
                    </span>
                  </td>
                  {/* Colonne Montant limite formaté en euros */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-lg text-[#002b49]">
                      {budget.limit_amount.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </td>
                  {/* Colonne Période (affichage lisible du type) */}
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold uppercase bg-white/40 px-3 py-1 rounded-full text-[#002b49]/80">
                      {budget.period === "monthly" ? "Mensuel" : budget.period === "weekly" ? "Hebdo" : "Perso"}
                    </span>
                  </td>
                  {/* Colonne Date de création formatée */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs opacity-60 font-medium">
                      {new Date(budget.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
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
