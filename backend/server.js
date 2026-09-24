import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import authRouter from "./routes/auth.js";
import registrationsRouter from "./routes/registrations.js";
import sectionsRouter from "./routes/sections.js";
import speakersRouter from "./routes/speakers.js";
import scheduleRouter from "./routes/schedule.js";

const app = express();
app.use(cors());
app.use(express.json());

// тестовый роут — проверить, что сервер и база живы
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", db_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});
app.use("/api/auth", authRouter);
app.use("/api/registrations", registrationsRouter);
app.use("/api/sections", sectionsRouter);
app.use("/api/speakers", speakersRouter);
app.use("/api/schedule", scheduleRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
