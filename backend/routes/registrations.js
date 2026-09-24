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

  if (!full_name || !phone) {
    return res.status(400).json({ error: "full_name и phone обязательны" });
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
      return res
        .status(400)
        .json({
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

export default router;
