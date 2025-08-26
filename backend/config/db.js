import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // <--- ini wajib biar .env kebaca

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // langsung stop server biar ketahuan error
  }
  console.log("✅ MySQL Connected...");
});

export default db;
