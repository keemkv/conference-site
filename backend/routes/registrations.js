import express from "express";
import pkg from "pg";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const router = express.Router();

// POST /api/registrations — создать регистрацию участника
router.post("/", async (req, res) => {
  const { full_name, email, phone } = req.body;

  if (!full_name || !phone || !email) {
    return res
      .status(400)
      .json({ error: "full_name, phone и email обязательны" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO registrations (full_name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, phone, payment_status, created_at`,
      [full_name, email || null, phone],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось создать регистрацию" });
  }
});

// GET /api/registrations — список всех регистраций (пока без защиты — добавим после логина)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, payment_status, created_at
       FROM registrations ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось получить список" });
  }
});

// PATCH /api/registrations/:id/payment-status — админ меняет статус оплаты
router.patch(
  "/:id/payment-status",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { payment_status } = req.body;

    const validStatuses = ["pending", "confirmed", "rejected"];
    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({
        error: "payment_status должен быть pending, confirmed или rejected",
      });
    }

    try {
      const result = await pool.query(
        `UPDATE registrations SET payment_status = $1
       WHERE id = $2
       RETURNING id, full_name, email, phone, payment_status, created_at`,
        [payment_status, id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Регистрация не найдена" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Не удалось обновить статус" });
    }
  },
);
// PATCH /api/registrations/:id/attendance: админ отмечает, был ли участник на конференции
router.patch("/:id/attendance", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { attended } = req.body;

  if (typeof attended !== "boolean") {
    return res
      .status(400)
      .json({ error: "attended должен быть true или false" });
  }

  try {
    const result = await pool.query(
      `UPDATE registrations SET attended = $1
       WHERE id = $2
       RETURNING id, full_name, email, phone, payment_status, attended, created_at`,
      [attended, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Регистрация не найдена" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось обновить отметку об участии" });
  }
});

// POST /api/registrations/certificate: участник скачивает свой сертификат по email
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

export default router;
