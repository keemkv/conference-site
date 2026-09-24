import { useState } from 'react'

const NAV_LINKS = [
  { href: '#program', label: 'Программа' },
  { href: '#speakers', label: 'Спикеры' },
  { href: '#payment', label: 'Оплата' },
  { href: '#contacts', label: 'Адрес' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <a href="#top" className="font-display text-2xl text-chalk-green">
          Педагогическая мастерская
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-ink/80 hover:text-chalk-green transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#register"
          className="hidden md:inline-block bg-chalk-green text-paper px-5 py-2.5 rounded-sm hover:bg-chalk-green-light transition-colors"
        >
          Зарегистрироваться
        </a>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Открыть меню"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="w-6 h-0.5 bg-ink" />
          <span className="w-6 h-0.5 bg-ink" />
          <span className="w-6 h-0.5 bg-ink" />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-paper px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-ink/80"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#register"
            onClick={() => setOpen(false)}
            className="bg-chalk-green text-paper text-center px-5 py-2.5 rounded-sm"
          >
            Зарегистрироваться
          </a>
        </div>
      )}
    </header>
  )
}
