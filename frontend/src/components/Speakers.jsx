import { useEffect, useState } from "react";
import api from "../api";

function SpeakerCard({ speaker }) {
  return (
    <div className="flex flex-col">
      <div className="aspect-square bg-chalk-green/10 border border-line rounded-sm flex items-center justify-center text-ink/30 text-sm mb-3">
        {speaker.photo_url ? (
          <img
            src={speaker.photo_url}
            alt={speaker.full_name}
            className="w-full h-full object-cover rounded-sm"
          />
        ) : (
          "фото"
        )}
      </div>
      <p className="font-medium text-ink">{speaker.full_name}</p>
      <p className="text-sm text-ink/50">
        {speaker.topic || "Тема пока не указана"}
      </p>
    </div>
  );
}

export default function Speakers() {
  const [speakers, setSpeakers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/speakers")
      .then((res) => {
        setSpeakers(res.data);
        setStatus("success");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, []);

  // группируем плоский список спикеров по секции
  const sections = speakers.reduce((acc, speaker) => {
    const key = speaker.section_slug;
    if (!acc[key]) acc[key] = { name: speaker.section_name, speakers: [] };
    acc[key].speakers.push(speaker);
    return acc;
  }, {});

  return (
    <section
      id="speakers"
      className="max-w-6xl mx-auto px-6 py-24 border-t border-line"
    >
      <h2 className="font-display text-4xl text-ink mb-14">Секции и спикеры</h2>

      {status === "loading" && <p className="text-ink/50">Загрузка...</p>}
      {status === "error" && (
        <p className="text-red-600">Не удалось загрузить спикеров.</p>
      )}
      {status === "success" && Object.keys(sections).length === 0 && (
        <p className="text-ink/50">Спикеры пока не добавлены.</p>
      )}

      <div className="flex flex-col gap-16">
        {Object.values(sections).map((section) => (
          <div key={section.name}>
            <h3 className="font-display text-2xl text-chalk-green mb-6">
              {section.name}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {section.speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
