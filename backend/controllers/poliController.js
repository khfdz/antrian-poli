import db from "../config/db.js";

export const getAllPoli = (req, res) => {
  db.query("SELECT * FROM poliklinik", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};