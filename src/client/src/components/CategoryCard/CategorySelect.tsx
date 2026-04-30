import { useState, useRef, useEffect } from "react";

interface CategorySelectProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  small?: boolean;
}

export default function CategorySelect({ categories, value, onChange, small = false }: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative z-20 ${small ? "w-20" : "w-24"}`}>
      <div
        className={`bg-[#FF7F00] shadow-md overflow-hidden transition-[border-radius] duration-100 transition-[max-height] duration-300 ${
          open ? "rounded-md" : "rounded-full"
        }`}
      >
        {/* Bouton principal */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-1 px-2 py-1 focus:outline-none"
        >
          <span className={`flex-1 text-center text-[#002341] font-medium truncate ${small ? "text-[9px]" : "text-[10px]"}`}>
            {value || "Catégorie"}
          </span>
          <span
            className={`text-white text-[10px] transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* Liste animée */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            open ? "max-h-40" : "max-h-0"
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { onChange(cat); setOpen(false); }}
              className="w-full text-left px-3 py-1 text-[#002341] text-[10px] hover:bg-orange-400 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
