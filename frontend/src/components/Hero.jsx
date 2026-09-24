export default function Hero() {
  return (
    <section id="top" className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-[1.3fr_1fr] gap-12 items-end">
      <div>
        <p className="text-chalk-green font-medium mb-3">11 октября · Ташкент</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-ink">
          Название конференции —{' '}
          <span className="text-chalk-green">рабочее название</span>
        </h1>
        <p className="mt-6 text-lg text-ink/70 max-w-lg">
          Здесь будет короткий абзац о конференции: для кого она, чем полезна
          и что участники получат за день. Текст временный — заменим на
          настоящий, когда пришлёте формулировку.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#register"
            className="bg-chalk-green text-paper px-6 py-3 rounded-sm hover:bg-chalk-green-light transition-colors"
          >
            Зарегистрироваться
          </a>
          <a
            href="#program"
            className="border border-chalk-green text-chalk-green px-6 py-3 rounded-sm hover:bg-chalk-green/5 transition-colors"
          >
            Смотреть программу
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 self-start md:self-end">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-chalk-green/10 border border-line rounded-sm flex items-center justify-center text-ink/30 text-sm"
          >
            фото
          </div>
        ))}
      </div>
    </section>
  )
}
