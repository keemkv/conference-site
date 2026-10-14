// POST /api/registrations/certificate: проверяет право на сертификат и отдаёт имя
router.post("/certificate", async (req, res) => {
  const email = (req.body.email || "").trim();

  if (!email) {
    return res.status(400).json({ error: "Укажите email" });
  }

  try {
    const result = await pool.query(
      `SELECT full_name, payment_status, attended
       FROM registrations
       WHERE lower(email) = lower($1)
       ORDER BY created_at DESC
       LIMIT 1`,
      [email],
    );

    const person = result.rows[0];

    if (!person) {
      return res
        .status(404)
        .json({ error: "Регистрация с таким email не найдена" });
    }
    if (person.payment_status !== "confirmed") {
      return res.status(403).json({ error: "Оплата ещё не подтверждена" });
    }
    if (!person.attended) {
      return res
        .status(403)
        .json({ error: "Участие в конференции не отмечено" });
    }

    res.json({ full_name: person.full_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось проверить данные" });
  }
});
