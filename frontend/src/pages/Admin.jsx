import { useState } from "react";
import api from "../api";
import RegistrationsTable from "../components/RegistrationsTable";
export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);

      if (res.data.user.role !== "admin") {
        setError("У этого аккаунта нет прав администратора");
        return;
      }

      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось войти");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setForm({ email: "", password: "" });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-chalk-green/5 border border-line rounded-sm p-6 flex flex-col gap-4"
        >
          <h1 className="font-display text-2xl text-ink">
            Вход для администратора
          </h1>

          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-line bg-paper px-4 py-2.5 rounded-sm"
          />
          <input
            required
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-line bg-paper px-4 py-2.5 rounded-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-chalk-green text-paper px-6 py-3 rounded-sm hover:bg-chalk-green-light transition-colors disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink">Админ-панель</h1>
        <button
          onClick={handleLogout}
          className="border border-chalk-green text-chalk-green px-5 py-2 rounded-sm hover:bg-chalk-green/5 transition-colors"
        >
          Выйти
        </button>
      </div>
      <RegistrationsTable onUnauthorized={handleLogout} />
    </div>
  );
}
