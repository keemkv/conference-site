export default function Payment() {
  return (
    <section id="payment" className="max-w-6xl mx-auto px-6 py-24 border-t border-line grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="font-display text-4xl text-ink mb-4">Оплата участия</h2>
        <p className="text-ink/70 max-w-md">
          Отсканируйте QR-код для оплаты. Текст и сумма — временные, заменим
          на реальные реквизиты позже.
        </p>
        <p className="mt-6 font-display text-2xl text-chalk-green">
          000 000 сум
        </p>
      </div>

      <div className="w-48 h-48 bg-chalk-green/10 border border-line rounded-sm flex items-center justify-center text-ink/30 text-sm justify-self-start md:justify-self-end">
        QR-код
      </div>
    </section>
  )
}
