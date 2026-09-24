import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/sections — список секций
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, slug, sort_order FROM sections ORDER BY sort_order`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось получить секции" });
  }
});

export default router;
