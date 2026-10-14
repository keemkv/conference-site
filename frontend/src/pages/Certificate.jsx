import { useState } from "react";
import api from "../api";

export default function Certificate() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFullName("");
    setLoading(true);
    try {
      const res = await api.post("/registrations/certificate", { email });
      setFullName(res.data.full_name);
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось проверить данные");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 print:p-0 print:max-w-none">
      {/* форма скрывается при печати */}
      <div className="print:hidden">
        <h1 className="font-display text-4xl text-ink mb-3">
          Получить сертификат
        </h1>
        <p className="text-ink/70 mb-8 max-w-lg">
          Введите email, который вы указывали при регистрации. Сертификат
          доступен участникам, у которых подтверждена оплата и отмечено
          присутствие на конференции.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-lg"
        >
          <input
            required
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border border-line bg-paper px-4 py-2.5 rounded-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-chalk-green text-paper px-6 py-2.5 rounded-sm hover:bg-chalk-green-light transition-colors disabled:opacity-50"
          >
            {loading ? "Проверка..." : "Показать"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>

      {fullName && (
        <div className="mt-10 print:mt-0">
          <div className="aspect-[297/210] w-full border-[10px] border-double border-chalk-green bg-white flex flex-col items-center justify-center text-center px-8 print:w-screen print:h-screen print:aspect-auto print:border-[14px]">
            <p className="font-display text-4xl md:text-5xl text-chalk-green tracking-widest">
              СЕРТИФИКАТ
            </p>
            <p className="mt-6 text-ink/70">настоящим подтверждает участие</p>
            <p className="mt-6 font-display text-3xl md:text-4xl text-gold">
              {fullName}
            </p>
            <p className="mt-6 text-ink/70">в педагогической конференции</p>
            <p className="mt-2 text-ink/50 text-sm">Ташкент</p>
          </div>

          <button
            onClick={() => window.print()}
            className="print:hidden mt-6 bg-chalk-green text-paper px-6 py-3 rounded-sm hover:bg-chalk-green-light transition-colors"
          >
            Сохранить как PDF
          </button>
        </div>
      )}
    </div>
  );
}
