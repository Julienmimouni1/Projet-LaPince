import * as Icons from "lucide-react";

import type { Transaction } from "../../types/transaction.js";

// --- Fonctions utilitaires ---
// On les sort du composant parce qu'elles n'ont pas besoin du state React.
// C'est plus facile à lire et à tester

// Reçoit: "2024-04-12T00:00.000Z", renvoie "12/04"
// padStart(2, "0") -> transforme "4" en "04" (pour les mois à un chiffre)

function CategoryIcon({ name }: { name: string | null }) {
  if (!name) return null;
  const Icon = (
    Icons as unknown as Record<string, React.FC<{ size?: number }>>
  )[name];
  if (!Icon) return null;
  return <Icon size={14} />;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

// Recoit -45.5, renvois "-45,50€"
// Recoit 1250, renvoie "+1250,00€"
// toFixed(2) -> force deux décimales :1250 devient "1250.00"
// replace("." , ",") -> conventuion française

function formatAmount(amount: number, type: "EXPENSE" | "INCOME"): string {
  const formatted = Math.abs(amount).toFixed(2).replace(".", ",");
  return type === "INCOME" ? `+${formatted}€` : `-${formatted}€`;
}

// Props minimaliste: juste la transaction. Pas besoin de callbacks ici.
// --- AJOUT : onUpdateRequest et onDeleteRequest pour permettre les actions sur chaque ligne ---
type Props = {
  transaction: Transaction;
  onUpdateRequest: (t: Transaction) => void; // ← Nouveau : demande d’ouverture du formulaire d’édition (géré par le parent)
  onDeleteRequest: (id: number) => void; // ← Nouveau : demande de suppression (confirmée ensuite par le parent)
};

export default function TransactionLine({
  transaction,
  onUpdateRequest,
  onDeleteRequest,
}: Props) {
  // On calcule isRevenu une seule fois et on l'utilise pour les deux classes CSS.
  // On évite de répeter "transaction.amount >= 0" deux fois dans le jsx

  const isRevenu = transaction.category.type === "INCOME";

  return (
    <div className="flex items-center gap-3 py-2 px-4 border-b border-white/10">
      {/* Pastille colorée - bleue pour revenu, rose pour dépense.
          Les couleurs reprennnent exactement celles des cartes RevenuCard et DepenseCard.
          Modifié : plus grand (w-6 h-6) avec icône de catégorie */}
      <div
        className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white ${
          isRevenu ? "bg-[#74BAC2]" : "bg-[#BC8787]"
        }`}
      >
        <CategoryIcon name={transaction.category.icon} />
      </div>

      {/* Libellé : on affiche description si elle existe, sinon le nom de la catégorie.
          L'opérateur ?? renvoie le côté droit uniquement si le gauche est null ou undefined.
          "truncate" coupe le texte avec "..." si le nom est trop long sur mobile. */}
      <p className="flex-1 text-sm font-medium truncate min-w-0">
        {transaction.description ?? transaction.category.name}
      </p>

      {/* Date à droite, alignée comme dans un tableau.
          "w-12 text-right" assure que toutes les dates font la même largeur et sont calées à droite. */}
      <span className="text-xs text-white/60 shrink-0 w-12 text-right">
        {formatDate(transaction.date)}
      </span>

      {/* Montant tout à droite, aligné comme dans un tableau.
          "w-24 text-right" garantit l'alignement vertical des chiffres et du symbole €. */}
      <span
        className={`text-sm font-bold shrink-0 w-24 text-right ${
          isRevenu ? "text-[#74BAC2]" : "text-[#BC8787]"
        }`}
      >
        {formatAmount(transaction.amount, transaction.category.type)}
      </span>

      {/* ------------------------------------------------------------------ */}
      {/* AJOUT : Boutons Modifier / Supprimer pour chaque transaction       */}
      {/* Ces boutons n'altèrent pas le design existant, ils s'ajoutent à la */}
      {/* fin de la ligne sans toucher aux éléments déjà présents.          */}
      {/* Désormais, ils n'exécutent plus directement l'action :            */}
      {/* → ils envoient une *demande* au parent, qui affichera un modal    */}
      {/*    de confirmation avant d'appliquer la modification réelle.      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-2 ml-2 shrink-0">
        {/* Bouton Modifier */}
        <button
          onClick={() => onUpdateRequest(transaction)}
          className="text-[10px] px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Modifier
        </button>

        {/* Bouton Supprimer */}
        <button
          onClick={() => onDeleteRequest(transaction.id)}
          className="text-[10px] px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
