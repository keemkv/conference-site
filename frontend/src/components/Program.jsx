import { useEffect, useState } from "react";
import api from "../api";

function ScheduleList({ items }) {
  return (
    <ol className="flex flex-col">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-[120px_1fr] gap-6 py-5 border-b border-line last:border-b-0"
        >
          <span className="font-display text-lg text-chalk-green">
            {item.time_start.slice(0, 5)}
            {item.time_end ? `–${item.time_end.slice(0, 5)}` : ""}
          </span>
          <span className="text-ink/80">{item.title}</span>
        </li>
      ))}
    </ol>
  );
}

export default function Program() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    api
      .get("/schedule")
      .then((res) => {
        setItems(res.data);
        setStatus("success");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, []);

  // "morning" и "general" — общая программа дня; "after_lunch" — отдельным блоком
  const mainItems = items.filter((item) => item.period !== "after_lunch");
  const afterLunchItems = items.filter((item) => item.period === "after_lunch");

  return (
    <section
      id="program"
      className="max-w-6xl mx-auto px-6 py-24 border-t border-line"
    >
      {status === "loading" && <p className="text-ink/50">Загрузка...</p>}
      {status === "error" && (
        <p className="text-red-600">Не удалось загрузить программу.</p>
      )}

      {status === "success" && (
        <>
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-display text-4xl text-ink">Программа дня</h2>
            <span className="text-ink/50">кратко</span>
          </div>

          {mainItems.length === 0 ? (
            <p className="text-ink/50 mb-16">Программа пока не заполнена.</p>
          ) : (
            <div className="mb-16">
              <ScheduleList items={mainItems} />
            </div>
          )}

          <h3 className="font-display text-2xl text-chalk-green mb-8">
            Программа после обеда
          </h3>

          {afterLunchItems.length === 0 ? (
            <p className="text-ink/50">
              Программа после обеда пока не заполнена.
            </p>
          ) : (
            <ScheduleList items={afterLunchItems} />
          )}
        </>
      )}
    </section>
  );
}
