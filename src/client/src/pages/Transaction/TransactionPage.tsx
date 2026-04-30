import Footer from "../../components/Footer/footer";
import DepenseCard from "../../components/CategoryCard/DepenseCard";
import RevenuCard from "../../components/CategoryCard/RevenuCard";
import BudgetCard from "../../components/CategoryCard/BudgetCard";

// Page placeholder — sera remplacée par la version de Marie
export default function TransactionPage() {
  return (
    <main className="fixed inset-0 w-full h-full bg-[#cbd5e1] overflow-hidden font-sans text-[#002b49]">
      {/* Arrière-plan billets */}
      <img
        src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
        className="absolute bottom-0 left-0 w-[70vw] opacity-30 object-contain origin-bottom-left z-0 pointer-events-none select-none"
        aria-hidden="true"
        alt=""
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/30 z-10 pointer-events-none" aria-hidden="true" />

      {/* Contenu */}
      <div className="relative z-20 flex flex-col h-full pb-10">
        {/* En-tête Solde */}
        <header className="flex flex-col items-center pt-10 pb-4 shrink-0">
          <img
            src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
            className="w-14 mb-3"
            alt="Logo La Pince"
          />
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">Solde</p>
          <p className="text-4xl font-black tracking-tight">000,00 €</p>
        </header>

        {/* Cartes — layout en bulles */}
        <section className="relative flex-1 flex items-center justify-center">

          {/* Desktop : bulles bien espacées */}
          <div className="hidden md:block relative w-full max-w-4xl h-96">
            <div className="absolute top-0 right-12">
              <RevenuCard />
            </div>
            <div className="absolute top-16 left-12">
              <DepenseCard />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <BudgetCard />
            </div>
          </div>

          {/* Mobile : 2 en haut côte à côte + Budget centré en bas */}
          <div className="flex md:hidden flex-col items-center gap-6 w-full px-2">
            <div className="flex gap-6 justify-center w-full">
              <DepenseCard />
              <RevenuCard />
            </div>
            <BudgetCard />
          </div>

        </section>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full z-30">
        <Footer showIcons activeIds={["home", "transactions"]} />
      </footer>
    </main>
  );
}
