import type { Overview } from "../../../types/stats";

interface StatsCardsProps {
  stats: Overview;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/40 transition-transform hover:scale-[1.02]">
        <p className="text-sm font-black uppercase italic opacity-70 mb-2 tracking-widest">Total Revenus</p>
        <p className="text-4xl lg:text-5xl font-black text-green-600 tracking-tighter">
          +{stats.income.toLocaleString()} €
        </p>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/40 transition-transform hover:scale-[1.02]">
        <p className="text-sm font-black uppercase italic opacity-70 mb-2 tracking-widest">Total Dépenses</p>
        <p className="text-4xl lg:text-5xl font-black text-red-600 tracking-tighter">
          -{stats.expenses.toLocaleString()} €
        </p>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/40 transition-transform hover:scale-[1.02]">
        <p className="text-sm font-black uppercase italic opacity-70 mb-2 tracking-widest">Balance Nette</p>
        <p className={`text-4xl lg:text-5xl font-black tracking-tighter ${stats.balance >= 0 ? "text-[#002b49]" : "text-red-600"}`}>
          {stats.balance.toLocaleString()} €
        </p>
      </div>

    </div>
  );
}
