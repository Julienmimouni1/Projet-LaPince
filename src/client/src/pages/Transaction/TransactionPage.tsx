import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchTransactions,
  type Transaction,
} from "../../services/transactionApi"; //Imports Transactions

import Footer from "../../components/Footer/footer";
import { AnimatedOrbBackground } from "../../components/AnimatedOrbBackground/AnimatedOrbBackground";
import DepenseCard from "../../components/CategoryCard/DepenseCard";
import RevenuCard from "../../components/CategoryCard/RevenuCard";
import BudgetCard from "../../components/CategoryCard/BudgetCard";
import TransactionSheet from "../../components/TransactionList/TransactionSheet";
import AlertPopup from "../../components/Alert/AlertPopup";
import { useAlerts } from "../../hooks/useAlerts";
import { fetchOverview } from "../../services/statsApi";
import type { Overview } from "../../types/stats";
import { useTransactions } from "../../hooks/useTransactions";

export default function TransactionPage() {
  const { currentAlert, handleCloseAlert, loadAlerts } = useAlerts();
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const { remove, update } = useTransactions();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type ConfirmData =
    | { action: "delete"; payload: number }
    | { action: "update"; payload: Transaction }
    | null;

  const [confirmData, setConfirmData] = useState<ConfirmData>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trans, ov] = await Promise.all([
        fetchTransactions(),
        fetchOverview(),
        loadAlerts(),
      ]);
      setTransactions(trans.data);
      setOverview(ov);
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, [loadAlerts]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const transactionsSorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (loading) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#c8dce8]">
        <p className="text-[#002b49] font-black text-xl animate-pulse">
          Chargement…
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#c8dce8]">
        <p className="text-red-600 font-bold text-lg">{error}</p>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden font-sans text-[#002b49]">
      <AnimatedOrbBackground />
      {/* Arrière-plan billets */}
      <img
        src="/WEBP/Desktop/Lapince-Hero-Background-Desktop.webp"
        className="absolute bottom-0 left-0 w-[70vw] opacity-30 object-contain origin-bottom-left z-0 pointer-events-none select-none"
        aria-hidden="true"
        alt=""
      />

      {/* Logo La Pince — classes identiques à la page login */}
      <img
        src="/WEBP/Mobile/Lapince-Logo-Mobile.webp"
        className="absolute top-6 left-6 w-28 z-[11] md:hidden"
        alt="Logo Mobile"
      />
      <img
        src="/WEBP/Desktop/Lapince-Logo-Desktop.webp"
        className="absolute top-10 left-15 w-24 lg:w-60 z-[11] transition-all hidden md:block"
        alt="Logo"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-white/30 z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Contenu */}
      <div className="relative z-20 flex flex-col h-full overflow-y-auto scrollbar-hide pb-40 [mask-image:linear-gradient(to_bottom,transparent_0px,transparent_145px,black_162px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0px,transparent_145px,black_162px)] md:[mask-image:none] md:[-webkit-mask-image:none]">
        {/* En-tête Solde */}
        <header className="flex flex-col items-center pt-44 md:pt-10 pb-4 shrink-0">
          <h1 className="text-[35px] md:text-[50px] lg:text-[60px] font-black uppercase leading-none tracking-tighter">
            Accueil
          </h1>
          <p className="text-base font-bold mt-1">Mon compte</p>
          <p className="text-sm opacity-60 mt-0.5 capitalize">
            {new Date().toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mt-4 leading-none">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 align-bottom">
              Solde =&nbsp;
            </span>
            <span className="text-4xl font-black tracking-tight">
              {" "}
              {overview
                ? overview.balance.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })
                : "…"}
            </span>
          </p>
        </header>

        {/* Cartes — layout en bulles */}
        <section className="relative md:flex-1 flex items-center justify-center">
          {/* Desktop : bulles bien espacées */}
          <div className="hidden md:block relative w-full max-w-4xl h-96">
            <div className="absolute bottom-60 right-12">
              <RevenuCard onSuccess={load} />
            </div>
            <div className="absolute bottom-60 left-12">
              <DepenseCard onSuccess={load} />
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <BudgetCard />
            </div>
          </div>

          {/* Mobile : 2 en haut côte à côte + Budget centré en bas */}
          <div className="flex md:hidden flex-col items-center gap-2 w-full px-2">
            <div className="flex flex-col min-[450px]:flex-row gap-2 justify-center items-center w-full">
              <DepenseCard onSuccess={load} />
              <RevenuCard onSuccess={load} />
            </div>
            <BudgetCard />
          </div>
        </section>
      </div>
      {currentAlert && (
        <AlertPopup
          key={currentAlert.id}
          // key change quand l'alerte change → React démonte/remonte AlertPopup
          // → l'animation d'entrée rejoue pour chaque alerte. Sans key,
          // React réutiliserait le même composant → pas d'animation.
          alert={currentAlert}
          onClose={handleCloseAlert}
        />
      )}

      <TransactionSheet
        transactions={transactionsSorted}
        footerHeight={footerHeight}
        onDeleteRequest={(id) =>
          setConfirmData({ action: "delete", payload: id })
        }
        onUpdateRequest={(t) => setEditingTransaction(t)}
      />

      {confirmData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-xl">
            <p className="font-bold text-lg mb-4">Êtes-vous sûr ?</p>

            <p className="text-sm opacity-70 mb-6">
              {confirmData.action === "delete"
                ? "Voulez-vous vraiment supprimer cette transaction ?"
                : "Voulez-vous enregistrer les modifications ?"}
            </p>

            <div className="flex justify-between gap-3">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-300 font-bold"
                onClick={() => setConfirmData(null)}
              >
                Annuler
              </button>

              <button
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold"
                onClick={async () => {
                  if (confirmData.action === "delete") {
                    await remove(confirmData.payload);
                  } else if (confirmData.action === "update") {
                    await update(confirmData.payload);
                  }

                  await load();
                  await loadAlerts();

                  setConfirmData(null);
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {editingTransaction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white text-[#002b49] p-6 rounded-2xl w-[90%] max-w-[350px] shadow-xl">
            <h2 className="text-lg font-bold mb-4">Modifier la transaction</h2>

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmData({
                  action: "update",
                  payload: editingTransaction,
                });
                setEditingTransaction(null);
              }}
            >
              {/* Champ Description */}
              <input
                type="text"
                defaultValue={editingTransaction.description ?? ""}
                onChange={(e) =>
                  setEditingTransaction((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev,
                  )
                }
                className="w-full px-3 py-2 rounded bg-gray-100"
                placeholder="Description"
              />

              {/* Champ Montant */}
              <input
                type="number"
                defaultValue={editingTransaction.amount}
                onChange={(e) =>
                  setEditingTransaction((prev) =>
                    prev ? { ...prev, amount: Number(e.target.value) } : prev,
                  )
                }
                className="w-full px-3 py-2 rounded bg-gray-100"
                placeholder="Montant"
              />

              {/* Bouton Enregistrer */}
              <button
                type="button"
                onClick={() => {
                  setConfirmData({
                    action: "update",
                    payload: editingTransaction,
                  });
                  setEditingTransaction(null);
                }}
                className="w-full bg-[#002b49] text-white py-2 rounded font-bold"
              >
                Enregistrer
              </button>

              {/* Bouton Annuler */}
              <button
                type="button"
                onClick={() => setEditingTransaction(null)}
                className="w-full bg-gray-300 text-[#002b49] py-2 rounded font-bold mt-2"
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}

      <footer
        ref={footerRef}
        className="absolute bottom-0 left-0 w-full z-[60]"
      >
        <Footer showIcons activeIds={["dashboard", "params"]} />
      </footer>
    </main>
  );
}
