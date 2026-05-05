import type { Transaction } from "../../types/transaction.js";


// --- Fonctions utilitaires ---
// On les sort du composant parce qu'elles n'ont pas besoin du state React.
// C'est plus facile à lire et à tester

// Reçoit: "2024-04-12T00:00.000Z", renvoie "12/04"
// padStart(2, "0") -> transforme "4" en "04" (pour les mois à un chiffre)

function formatDate(iso: string): string {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth()+1).padStart(2, "0")

    return `${day}/${month}`
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

type Props =  { transaction: Transaction };


export default function TransactionLine({ transaction }: Props) {
    // On calcule isRevenu une seule fois et on l'utilise pour les deux classes CSS.
    // On évite de répeter "transaction.amount >= 0" deux fois dans le jsx

    const isRevenu = transaction.category.type === "INCOME";

    return(
        <div className="flex items-center gap-3 py-2 px-4 border-b border-white/10">
            {/* Pastille colorée - bleue pour revenu, rose pour dépense.
                Les couleurs reprennnent eaxctement celles des cartes RevenuCard et DepenseCard. */}

            <span 
                className={`w-3 h-3 rounded-full shrink-0 ${
                isRevenu ? "bg-[#74BAC2]" : "bg-[#BC8787]"
                }`}
            />
            {/* Libellé : on affiche description si elle existe, sinon le nom de la catégorie.
                L'opérateur ?? renvoie le coté droit uniquement si le gauche est null ou undefined. Différent de || qui renvoie le droit si le gauche est falsy.
                "truncate" coupe le texte avec "..." si le nom est trop long sur mobile. */}
            <p className="flex-1 text-sm font-medium truncat min-w-0">
                {transaction.description ?? transaction.category.name}
            </p>

            {/* Date à droite.
                "shrink-0" empeche cet element de rétércir si le libellé est long.
                Sans ça, flebox comprimerait la date pour faire de la place au texte. */}
            <span className="text-xs text-white/60 shrink-0">
                {formatDate(transaction.date)}
            </span>

            {/* Montant tout à droite, même couleur que la pastille pour la cohérence visuelle. */}
            <span className={`text-sm font-bold shrink-0 ${isRevenu ? "text-[#74BAC2]" : "text-[#BC8787]"}`}>
                {formatAmount(transaction.amount, transaction.category.type)}
            </span>


        </div>
    );
}