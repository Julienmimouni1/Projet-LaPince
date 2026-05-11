import { useRef, useState, useMemo } from "react";
import { ChevronUp, Search } from "lucide-react";
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

    // --- ÉTATS (States) ---
    // Gère l'ouverture du panneau (vrai = ouvert, faux = réduit)
    const [ isOpen, setIsOpen ] = useState(false);
    
    // Valeur tapée dans la barre de recherche
    const [ searchTerm, setSearchTerm ] = useState("");
    
    // Type sélectionné : ALL (Tout), INCOME (Revenus), EXPENSE (Dépenses)
    const [ filterType, setFilterType ] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
    
    // Tableau des IDs des catégories sélectionnées pour le filtre multi-sélection
    const [ selectedCategories, setSelectedCategories ] = useState<number[]>([]);
    
    // Gère l'affichage du petit menu déroulant des catégories
    const [ isCategoryMenuOpen, setIsCategoryMenuOpen ] = useState(false);

    // useRef : On utilise des refs pour le drag-and-drop car changer un state 
    // à chaque pixel déplacé ferait ramer l'application (trop de re-renders).
    const dragStartY =  useRef<number | null>(null);
    const isDragging = useRef(false); // Distingue un simple clic d'un glissement réel

    // --- LOGIQUE DE FILTRAGE ---

    /**
     * 1. On calcule la liste des catégories DISPONIBLES.
     * On ne veut afficher que les catégories qui existent dans les transactions actuelles.
     * Si l'utilisateur filtre par "Dépenses", on ne montre que les catégories de dépenses.
     */
    const availableCategories = useMemo(() => {
        const cats = new Map<number, { id: number, name: string, type: string }>();
        transactions.forEach(t => {
            // On garde la catégorie si elle correspond au type sélectionné (ou si "Tout" est coché)
            if (filterType === "ALL" || t.category.type === filterType) {
                cats.set(t.category.id, t.category);
            }
        });
        // On transforme la Map en tableau trié par nom pour l'affichage
        return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [transactions, filterType]);

    /**
     * 2. On calcule les transactions FILTRÉES.
     * C'est le cœur du composant. On combine les 3 filtres :
     * - Recherche textuelle (description ou nom de catégorie)
     * - Type (Revenu ou Dépense)
     * - Catégories (multi-sélection)
     */
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Filtre Recherche : Vrai si vide ou si le texte correspond
            const matchesSearch = !searchTerm.trim() || 
                (t.description?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                (t.category.name.toLowerCase().includes(searchTerm.toLowerCase()));
            
            // Filtre Type : Vrai si "ALL" ou si le type correspond exactement
            const matchesType = filterType === "ALL" || t.category.type === filterType;

            // Filtre Catégorie : Vrai si aucune sélection (on montre tout) ou si l'ID est dans le tableau
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(t.category.id);

            // La transaction n'est gardée que si elle remplit les 3 conditions
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [transactions, searchTerm, filterType, selectedCategories]);

    /**
     * 3. Gestion de la sélection d'une catégorie.
     * Ajoute l'ID si absent, le retire s'il était déjà présent (toggle).
     */
    const toggleCategory = (id: number) => {
        setSelectedCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    /**
     * 4. Nettoyage automatique.
     * Si l'utilisateur a sélectionné des catégories de "Dépenses" puis change le type en "Revenus",
     * on doit décocher les catégories qui ne correspondent plus.
     */
    useMemo(() => {
        if (filterType === "ALL") return;
        setSelectedCategories(prev => prev.filter(id => {
            const cat = transactions.find(t => t.category.id === id)?.category;
            return cat ? cat.type === filterType : false;
        }));
    }, [filterType, transactions]);

    // --- GESTION DU GLISSEMENT (DRAG) ---
    // Ces fonctions calculent si le doigt/souris monte ou descend pour ouvrir/fermer le panneau.

    function onDragStart(clientY: number) {
        dragStartY.current = clientY;
        isDragging.current = false;
    }

    function onDragMove(clientY:number) {
        if ( dragStartY.current === null ) return;
        const delta = dragStartY.current - clientY;
        if (Math.abs(delta) > 5) isDragging.current = true;
    }
    
    function onDragEnd(clientY :number) {
        if ( dragStartY.current === null ) return;
        const delta = dragStartY.current - clientY;

        if(!isDragging.current) {
            // Si pas de mouvement, c'est un clic -> on inverse l'état ouvert/fermé
            setIsOpen((prev) => !prev);
        } else if (delta > 40) {
            setIsOpen(true); // Tiré vers le haut
        } else if (delta < -40) {
            setIsOpen(false); // Tiré vers le bas
        }
        dragStartY.current = null ;
        isDragging.current = false
    }

    return (
        <div
            style={{
                height: "85vh",
                // On déplace le panneau vers le bas de (85vh - hauteur visible) quand il est fermé
                transform: isOpen ? "translateY(0)" : `translateY(calc(85vh - ${COLLAPSED_HEIGHT}px))`,
            }}
            className="fixed bottom-0 left-0 w-full bg-[#1e3a5f] text-white rounded-t-2xl shadow-2xl flex flex-col z-[55] transition-transform duration-300 ease-in-out"
        >

            {/* --- ENTÊTE / POIGNÉE DE DRAG --- */}
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
                {/* Petite barre horizontale visuelle */}
                <div className="w-10 h-1 bg-white/40 rounded-full mb-2" />
                
                <div className="flex items-center gap-1.5">
                    {/* Flèche qui tourne selon l'état */}
                    <ChevronUp
                        size={14}
                        className={`text-white/70 transition-transform duration-300 group-hover:text-white ${isOpen ? "rotate-180" : ""}`}
                    />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                        Transactions
                    </p>

                    {/* BARRE DE RECHERCHE 
                        stopPropagation : Crucial ! Empêche le clic dans l'input d'être 
                        interprété comme un début de drag par le parent. */}
                    <div 
                        className="relative flex items-center bg-white/10 rounded-full px-3 py-1 border border-white/20 focus-within:bg-white/20 transition-all max-w-[120px] ml-2"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Search size={12} className="text-white/50 mr-2" />
                        <input
                            type="text"
                            placeholder="Filtrer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-wider placeholder:text-white/30 w-full"
                        />
                    </div>

                    {/* SÉLECTEUR DE TYPE (Revenu / Dépense) */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/10 border border-white/20 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider outline-none focus:bg-white/20 transition-all cursor-pointer ml-1"
                    >
                        <option value="ALL" className="bg-[#1e3a5f]">Tout</option>
                        <option value="INCOME" className="bg-[#1e3a5f]">Revenus</option>
                        <option value="EXPENSE" className="bg-[#1e3a5f]">Dépenses</option>
                    </select>

                    {/* MULTI-SÉLECT DE CATÉGORIES */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsCategoryMenuOpen(!isCategoryMenuOpen);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            // Change de couleur si des filtres sont actifs
                            className={`bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider outline-none hover:bg-white/20 transition-all cursor-pointer ml-1 whitespace-nowrap ${selectedCategories.length > 0 ? "border-[#74BAC2] text-[#74BAC2]" : ""}`}
                        >
                            Catégories {selectedCategories.length > 0 ? `(${selectedCategories.length})` : ""}
                        </button>

                        {/* Menu contextuel (Overlay) */}
                        {isCategoryMenuOpen && (
                            <div 
                                className="absolute bottom-full mb-2 right-0 w-48 bg-[#1e3a5f] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-[60]"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-2 border-b border-white/10 flex justify-between items-center bg-white/5">
                                    <span className="text-[10px] font-black uppercase opacity-60">Filtrer</span>
                                    {selectedCategories.length > 0 && (
                                        <button 
                                            onClick={() => setSelectedCategories([])}
                                            className="text-[9px] font-black uppercase text-[#BC8787] hover:brightness-125"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-48 overflow-y-auto p-1 scrollbar-hide">
                                    {availableCategories.length === 0 ? (
                                        <p className="text-[10px] text-center py-4 opacity-40 italic">Aucune catégorie</p>
                                    ) : (
                                        availableCategories.map(cat => (
                                            <label 
                                                key={cat.id}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat.id)}
                                                    onChange={() => toggleCategory(cat.id)}
                                                    className="w-3 h-3 rounded border-white/20 bg-transparent accent-[#74BAC2]"
                                                />
                                                <span className="text-[10px] font-bold uppercase truncate">{cat.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <ChevronUp
                        size={14}
                        className={`text-white/70 transition-transform duration-300 group-hover:text-white ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            {/* --- LISTE DES TRANSACTIONS --- */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
                {filteredTransactions.length === 0 ? (
                    <p className="text-center text-white/50 mt-8 text-sm italic">
                        {searchTerm || selectedCategories.length > 0 || filterType !== "ALL" 
                            ? "Aucune transaction ne correspond à vos filtres." 
                            : "Aucune transaction pour le moment."}
                    </p>
                ) : (
                    filteredTransactions.map((t) => <TransactionLine key={t.id} transaction={t}/>)
                )}
            </div>
        </div>
    );
}