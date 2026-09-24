import { useState } from "react";
import api from "../api";

export default function Contacts() {
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/registrations", form);
      setStatus("success");
      setForm({ full_name: "", phone: "", email: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section
      id="contacts"
      className="max-w-6xl mx-auto px-6 py-24 border-t border-line grid md:grid-cols-2 gap-12"
    >
      <div>
        <h2 className="font-display text-4xl text-ink mb-4">Адрес</h2>
        <p className="text-ink/70">Ташкент, ул. Примерная, 00</p>
        <p className="text-ink/70 mt-2">+998 90 000 00 00</p>
      </div>

      <form
        id="register"
        onSubmit={handleSubmit}
        className="bg-chalk-green/5 border border-line rounded-sm p-6 flex flex-col gap-4"
      >
        <h3 className="font-display text-xl text-ink">Регистрация</h3>

        <input
          required
          placeholder="ФИО"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="border border-line bg-paper px-4 py-2.5 rounded-sm"
        />
        <input
          required
          placeholder="Телефон"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border border-line bg-paper px-4 py-2.5 rounded-sm"
        />
        <input
          type="email"
          placeholder="Email (необязательно)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-line bg-paper px-4 py-2.5 rounded-sm"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-chalk-green text-paper px-6 py-3 rounded-sm hover:bg-chalk-green-light transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Отправка..." : "Зарегистрироваться"}
        </button>

        {status === "success" && (
          <p className="text-chalk-green text-sm">
            Готово! Вы зарегистрированы.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm">Ошибка. Попробуйте ещё раз.</p>
        )}
      </form>
    </section>
  );
}
