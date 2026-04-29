import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ParametreForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Logique de mise à jour API
    setTimeout(() => setIsLoading(false), 1000);
  };

  const inputStyle =
    "w-full px-4 py-2 rounded-full bg-white/80 border-none text-[12px] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-[#002b49]";
  const labelStyle =
    "block text-[11px] font-black ml-4 mb-0.5 italic uppercase text-[#002b49]";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className={labelStyle}>Nom Prénom</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Nom prénom"
        />
      </div>

      <div>
        <label className={labelStyle}>e-mail</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={inputStyle}
          placeholder="e-mail"
        />
      </div>

      <div>
        <label className={labelStyle}>mot de passe</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className={inputStyle}
          placeholder="mot de passe"
        />
      </div>

      <div>
        <label className={labelStyle}>Changer de mot de passe</label>
        <input
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          className={inputStyle}
          placeholder="mot de passe"
        />
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-fit px-10 py-2 bg-[#002b49] text-white rounded-full font-bold text-sm shadow-lg hover:bg-[#003b63] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Soumettre"
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="text-[11px] text-[#002b49] font-bold underline italic opacity-80"
        >
          Se désinscrire
        </button>
      </div>
    </form>
  );
}
