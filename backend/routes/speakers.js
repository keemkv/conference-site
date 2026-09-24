import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/speakers — все спикеры с названием секции (для сайта)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT speakers.id, speakers.full_name, speakers.photo_url, speakers.bio,
              speakers.topic, speakers.time_slot, speakers.room, speakers.sort_order,
              sections.name AS section_name, sections.slug AS section_slug
       FROM speakers
       JOIN sections ON speakers.section_id = sections.id
       ORDER BY sections.sort_order, speakers.sort_order`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось получить спикеров" });
  }
});

// PUT /api/speakers/:id — спикер редактирует свою инфу (нужен только логин, не обязательно админ)
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { bio, topic, photo_url } = req.body;

  // спикер может редактировать только свою запись, админ — любую
  if (req.user.role !== "admin") {
    const check = await pool.query(
      `SELECT user_id FROM speakers WHERE id = $1`,
      [id],
    );
    if (check.rows[0]?.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Можно редактировать только свой профиль" });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE speakers SET bio = $1, topic = $2, photo_url = $3
       WHERE id = $4
       RETURNING id, full_name, bio, topic, photo_url`,
      [bio, topic, photo_url, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось обновить профиль" });
  }
});

export default router;
