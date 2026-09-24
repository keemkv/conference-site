import bcrypt from "bcrypt";
import { pool } from "../db.js";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.log("Использование: node scripts/createAdmin.js email пароль");
  process.exit(1);
}

const password_hash = await bcrypt.hash(password, 10);

const result = await pool.query(
  `INSERT INTO users (email, password_hash, role)
   VALUES ($1, $2, 'admin')
   RETURNING id, email, role, created_at`,
  [email, password_hash],
);

console.log("Админ создан:", result.rows[0]);
process.exit(0);
