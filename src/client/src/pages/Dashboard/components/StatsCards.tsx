/**
 * Interface définissant les données attendues par le composant StatsCards.
 * Regroupe les totaux calculés dans la page parente.
 */
interface StatsCardsProps {
  stats: { 
    income: number;   // Somme totale des revenus
    expense: number;  // Somme totale des dépenses
    balance: number;  // Différence entre revenus et dépenses
  };
}

/**
 * Composant StatsCards : Affiche le résumé financier sous forme de 3 cartes distinctes.
 * Utilise le flou (backdrop-blur) et la transparence pour l'esthétique "Glassmorphism".
 */
export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Carte des Revenus */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/40">
        <p className="text-xs font-black uppercase italic opacity-70 mb-1">Total Revenus</p>
        <p className="text-2xl font-black text-green-600">
          {/* Formatage local du nombre (ex: 1 250,50 €) */}
          +{stats.income.toLocaleString()} €
        </p>
      </div>

      {/* Carte des Dépenses */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/40">
        <p className="text-xs font-black uppercase italic opacity-70 mb-1">Total Dépenses</p>
        <p className="text-2xl font-black text-red-600">
          -{stats.expense.toLocaleString()} €
        </p>
      </div>

      {/* Carte de la Balance Nette (Calcul final) */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/40">
        <p className="text-xs font-black uppercase italic opacity-70 mb-1">Balance Nette</p>
        {/* Couleur dynamique : Rouge si négatif, Bleu foncé si positif ou nul */}
        <p className={`text-2xl font-black ${stats.balance >= 0 ? 'text-[#002b49]' : 'text-red-600'}`}>
          {stats.balance.toLocaleString()} €
        </p>
      </div>

    </div>
  );
}
