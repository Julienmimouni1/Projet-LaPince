import { useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import type { Transaction } from "../../types/transaction.js";
import TransactionLine from "./TransactionLine.js";


// La hauteur visible quand le panneau esy "fermé"
// Si modification ajuster cette constante

const HANDLE_HEIGHT = 56;

type Props = {
    transactions: Transaction[];
    footerHeight: number;
}

export default function TransactionSheet({ transactions, footerHeight }: Props) {
    const COLLAPSED_HEIGHT = footerHeight + HANDLE_HEIGHT;

    // Un seul state : ouvert ou fermé
    // Pas besoin de stocker la position exacte du drag dans le state
    // Le rendu n'a pas besoin de suirve le doigt pixel par pixel
    // juste de réagir à la fin du geste
    const [ isOpen, setIsOpen ] = useState(false);

    // useRef et non useState pour les valeurs de drag.
    // Pourquoi ? Parceque un ref ne déclenche pas de re-render.
    //  Si on utilisait useState ici, React re-rendraity le composant
    // A cahque Pixel de déplacement du doigt ---> freeze garanti.

    const dragStartY =  useRef<number | null>(null);
    const isDragging = useRef(false); // distingue un tap d'un vrai glisseur

    // --- Les 3 fonctions de drag ---
    // On les garde séparées pour pourvoir les brancher sur souris ET touch snas dupliquer la logique

    function onDragStart(clientY: number) {
        dragStartY.current = clientY;
        isDragging.current = false; // réinitialise à chaque nouveau geste        
    }

    function onDragMove(clientY:number) {
        if ( dragStartY.current === null ) return; // sécurité : move sans start ne dois rien faire

        const delta = dragStartY.current - clientY; // positif si on monte, negatif si on descends

        // On considere qu'on "drag" à parti de 5 px de déplacement
        // En dessous, c'est un tap (micro-tremblement du doigt sur l'écran).

        if (Math.abs(delta) > 5) {
            isDragging.current = true;
        }
    }
    
    function onDragEnd(clientY :number) {
        if ( dragStartY.current === null ) return;
        
        const delta = dragStartY.current - clientY;

        if(!isDragging.current) {
            // pas de mouvement détécté -> c'est un tap -> on toggle simplement
            setIsOpen((prev) => !prev);
        }else if (delta > 40) {
            // Tiré vers le haut de plus de 40 px -> l'intention d'ouvrir
            setIsOpen(true)
        }else if (delta < -40) {
            // Tiré vers le bas de plus de 40 px -> l'intention de fermer
            setIsOpen(false)
        }
        // Si delta est entre -40 et 40 geste hésistant, on ne change rien.
        // Le panneau revient à sa position précédente grâce à la transition CSS.
        
        // Nettoyage -- important pour que le prochain geste parte sur une ardoise propre
        dragStartY.current = null ;
        isDragging.current = false

        }

        return (
            <div
                style={{
                    height: "85vh",
                    // On ne boucge pas la hauteur, on translate le div vers le bas.
                    // Quand isOpen=false on décale vers le bas de (875vh -56px)
                    // Donc seuls les 56 px du haut restent visibles à l'ecran
                    transform: isOpen ? "translateY(0)" : `translateY(calc(85vh - ${COLLAPSED_HEIGHT}px))`,
                }}
                className="fixed bottom-0 left-0 w-full bg-[#1e3a5f] text-white rounded-t-2xl shadow-2xl flex flex-col z-[55] transition-transform duration-300 ease-in-out"
                    // Note : "transition-transform" dans TailWind correspond à "transition-property:  transform" en CSS.
                    // Sans ça, le panneau se téléporterait d'une psoition à l'autre sans animation. 
                
            >

                {/* ----- Zone de poignée (drag handle)-----
                    C'est la seule zone où on écoute les événements de drag.
                    On n'écoute pas sur tout le panneau pour ne pas bloquer 
                    le scroll de la liste quand le panneau est ouvert. 
                
                */}

                <div
                    className="flex flex-col items-center pt-3 pb-2 shrink-0 cursor-pointer select-none group hover:bg-white/5 transition-colors rounded-t-2xl"
                    onMouseDown={(e) => onDragStart(e.clientY)}
                    onMouseMove={(e) => {
                        if (e.buttons === 1) onDragMove(e.clientY);
                    }}
                    onMouseUp={(e) => onDragEnd(e.clientY)}
                    onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
                    onTouchMove={(e)=> onDragMove(e.touches[0].clientY)}
                    onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientY)}
                >
                    <div className="w-10 h-1 bg-white/40 rounded-full mb-2" />
                    <div className="flex items-center gap-1.5">
                        <ChevronUp
                            size={14}
                            className={`text-white/70 transition-transform duration-300 group-hover:text-white ${isOpen ? "rotate-180" : ""}`}
                        />
                        <p className="text-xs font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                            Toutes mes transactions
                        </p>
                        <ChevronUp
                            size={14}
                            className={`text-white/70 transition-transform duration-300 group-hover:text-white ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>
                </div>

                {/** ----Liste scrollable ---- 
                    flex-1 :  prend tout l'espace restant sous la poignée
                    overflow-y-auto : scrolle vertical si le contenu dépasse
                    overscroll-contain : empeche le scroll de fuiter vers la page parente quand on atteint le haut ou le bas de la liste
                
                */}

                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {transactions.length === 0 ? (
                        // Etat vide pour ne pas avoir une selection blanche si le tableau est vide par erreur.
                        <p className="text-center text-white/50 mt-8 text-sm">
                            Aucune transaction pour le moment.
                        </p>
                    ) : (
                        // key={t.id} est obligatoire sur les list React.
                        // React l'utilise pour identifier les elements et optimiser les re-renders.
                        transactions.map((t) => <TransactionLine key={t.id} transaction={t}/>)
                    )}
                </div>
            </div>
        );
    }