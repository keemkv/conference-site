import { useEffect, useState } from "react";
import api from "../api";

export default function RegistrationsTable({ onUnauthorized }) {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/registrations")
      .then((res) => {
        setRows(res.data);
        setStatus("success");
      })
      .catch((err) => {
        console.error(err);
        // токен истёк или недействителен: возвращаем на форму входа
        if (err.response?.status === 401 || err.response?.status === 403) {
          onUnauthorized();
        } else {
          setStatus("error");
        }
      });
  }, [onUnauthorized]);

  // обновляет одну строку в таблице данными, которые вернул сервер
  const updateRow = (id, data) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const togglePaid = async (row) => {
    const next = row.payment_status === "confirmed" ? "pending" : "confirmed";
    try {
      const res = await api.patch(`/registrations/${row.id}/payment-status`, {
        payment_status: next,
      });
      updateRow(row.id, res.data);
    } catch (err) {
      console.error(err);
      alert("Не удалось обновить оплату");
    }
  };

  const toggleAttended = async (row) => {
    try {
      const res = await api.patch(`/registrations/${row.id}/attendance`, {
        attended: !row.attended,
      });
      updateRow(row.id, res.data);
    } catch (err) {
      console.error(err);
      alert("Не удалось обновить отметку об участии");
    }
  };

  const query = search.trim().toLowerCase();
  const visibleRows = rows.filter(
    (r) =>
      !query ||
      r.full_name.toLowerCase().includes(query) ||
      (r.email || "").toLowerCase().includes(query) ||
      r.phone.includes(query),
  );

  const paidCount = rows.filter((r) => r.payment_status === "confirmed").length;
  const attendedCount = rows.filter((r) => r.attended).length;
  const eligibleCount = rows.filter(
    (r) => r.payment_status === "confirmed" && r.attended,
  ).length;

  if (status === "loading")
    return <p className="mt-8 text-ink/50">Загрузка...</p>;
  if (status === "error")
    return (
      <p className="mt-8 text-red-600">Не удалось загрузить регистрации.</p>
    );

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-ink/70">
          Всего: <b>{rows.length}</b> · Оплатили: <b>{paidCount}</b> · Были:{" "}
          <b>{attendedCount}</b> · Получат сертификат: <b>{eligibleCount}</b>
        </p>
        <input
          placeholder="Поиск по имени, телефону, email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-line bg-paper px-4 py-2 rounded-sm w-full md:w-72"
        />
      </div>

      {visibleRows.length === 0 ? (
        <p className="text-ink/50">
          {rows.length === 0 ? "Регистраций пока нет." : "Никого не найдено."}
        </p>
      ) : (
        <div className="overflow-x-auto border border-line rounded-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-chalk-green/10 text-ink/70">
              <tr>
                <th className="px-4 py-3 font-medium">ФИО</th>
                <th className="px-4 py-3 font-medium">Телефон</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium text-center">Оплатил</th>
                <th className="px-4 py-3 font-medium text-center">Был</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink">{row.full_name}</td>
                  <td className="px-4 py-3 text-ink/80">{row.phone}</td>
                  <td className="px-4 py-3 text-ink/80">{row.email || "—"}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.payment_status === "confirmed"}
                      onChange={() => togglePaid(row)}
                      className="w-5 h-5 accent-[#1F3A34] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!row.attended}
                      onChange={() => toggleAttended(row)}
                      className="w-5 h-5 accent-[#1F3A34] cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
