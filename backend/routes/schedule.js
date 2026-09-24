import express from "express";
import { pool } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/schedule — вся программа (публичный роут, для сайта)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, time_start, time_end, title, period, sort_order
       FROM schedule_items
       ORDER BY sort_order`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось получить программу" });
  }
});

// POST /api/schedule — добавить пункт программы (только админ)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { time_start, time_end, title, period, sort_order } = req.body;

  if (!time_start || !title || !period) {
    return res
      .status(400)
      .json({ error: "time_start, title и period обязательны" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO schedule_items (time_start, time_end, title, period, sort_order)
       VALUES ($1, $2, $3, $4, COALESCE($5, 0))
       RETURNING *`,
      [time_start, time_end || null, title, period, sort_order],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось добавить пункт программы" });
  }
});

export default router;
