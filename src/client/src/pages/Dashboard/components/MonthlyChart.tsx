import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

/**
 * Interface pour les données du graphique mensuel.
 * Attend un tableau d'objets avec : nom du mois, total revenus, total dépenses.
 */
interface MonthlyChartProps {
  data: {
    month: string;
    income: number;
    expenses: number;
  }[];
}

/**
 * Composant MonthlyChart : Visualisation graphique des flux financiers.
 * Utilise la bibliothèque Recharts pour un rendu responsive et interactif.
 */
export function MonthlyChart({ data }: MonthlyChartProps) {

  // "2026-01" → "janv." via l'API Intl du navigateur
  function formatMonth(val: string) {
    const [year, month] = val.split("-");
    return new Date(Number(year), Number(month) - 1)
      .toLocaleString("fr-FR", { month: "short" });
  }

  return (
    <section className="bg-white/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/50">
      <header className="mb-10 text-center md:text-left">
        <h3 className="text-2xl font-black italic uppercase tracking-tight">Analyse Mensuelle</h3>
        <p className="text-sm font-bold opacity-60">Visualisation des Revenus vs Dépenses par mois</p>
      </header>

      <div className="h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,43,73,0.1)" />

            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#002b49", fontWeight: "bold", fontSize: 14 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#002b49", fontWeight: "bold", fontSize: 14 }}
              dx={-10}
            />

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.2)" }}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: "20px",
                border: "none",
                fontWeight: "black",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              }}
            />

            <ReferenceLine y={0} stroke="#002b49" strokeOpacity={0.2} />

            {/* name= sert à l'infobulle : sans ça, elle afficherait "income" et "expenses" en anglais */}
            <Bar dataKey="income"   name="Revenus"  fill="#10b981" radius={[8, 8, 0, 0]} barSize={35} />
            <Bar dataKey="expenses" name="Dépenses" fill="#ef4444" radius={[0, 0, 8, 8]} barSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}