import db from "../config/db.js";

export const getAllRegPeriksa = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1000;
  const offset = (page - 1) * limit;

  const { tanggal, poli, no_rawat, status_panggil } = req.query;

  console.log("req.query:", req.query);

  // =====================
  // Flexible parsing poli
  // =====================
  let poliList = [];
  if (poli) {
    if (Array.isArray(poli)) {
      poliList = poli.map(p => p.trim()).filter(Boolean);
    } else if (typeof poli === "string") {
      // Bisa menerima format "002,032,049" atau "002"
      poliList = poli.split(",").map(p => p.trim()).filter(Boolean);
    }
  }
  console.log("Parsed poliList:", poliList);

  // =====================
  // Build filters
  // =====================
  let filters = [];
  let params = [];

  if (no_rawat) {
    filters.push("r.no_rawat = ?");
    params.push(no_rawat);
  }

  if (tanggal) {
    filters.push("DATE(r.tgl_registrasi) = ?");
    params.push(tanggal);
  }

  if (poliList.length > 0) {
    filters.push(`TRIM(poli.kd_poli) IN (${poliList.map(() => "?").join(",")})`);
    params.push(...poliList);
  }

  if (status_panggil !== undefined) {
    filters.push("r.status_panggil = ?");
    params.push(Number(status_panggil));
  }

  const whereClause = filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";
  console.log("WHERE clause:", whereClause);
  console.log("SQL params before limit/offset:", params);

  // =====================
  // Main SQL query
  // =====================
  const sql = `
    SELECT r.no_reg, r.no_rawat, r.tgl_registrasi, r.jam_reg,
           r.kd_dokter, d.nm_dokter, r.no_rkm_medis, p.nm_pasien,
           p.alamat, poli.kd_poli, poli.nm_poli,
           r.status_bayar, r.status_poli, r.status_panggil,
           r.panggil_timestamp, r.reg_timestamp
    FROM reg_periksa r
    LEFT JOIN pasien p ON r.no_rkm_medis = p.no_rkm_medis
    LEFT JOIN dokter d ON r.kd_dokter = d.kd_dokter
    LEFT JOIN poliklinik poli ON r.kd_poli = poli.kd_poli
    ${whereClause}
    ORDER BY COALESCE(
      r.panggil_timestamp, 
      r.reg_timestamp,
      STR_TO_DATE(CONCAT(r.tgl_registrasi, ' ', r.jam_reg), '%Y-%m-%d %H:%i:%s')
    ) DESC
    LIMIT ? OFFSET ?
  `;
  console.log("Final SQL query:", sql);
  console.log("Final params:", [...params, limit, offset]);

  db.query(sql, [...params, limit, offset], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    // =====================
    // Count total rows
    // =====================
    const countSql = `
      SELECT COUNT(*) as total
      FROM reg_periksa r
      LEFT JOIN poliklinik poli ON r.kd_poli = poli.kd_poli
      ${whereClause}
    `;
    console.log("Count SQL query:", countSql);
    console.log("Count params:", params);

    db.query(countSql, params, (err2, countResult) => {
      if (err2) {
        console.error("Count query error:", err2);
        return res.status(500).json({ message: "Database error", error: err2.message });
      }

      res.json({
        data: results,
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit),
      });
    });
  });
};




export const panggilAntrian = (req, res) => {
  const { no_rawat } = req.query;

  if (!no_rawat) {
    return res.status(400).json({ message: "no_rawat is required" });
  }

  const sqlUpdate = `
    UPDATE reg_periksa 
    SET status_panggil = 1,
        panggil_timestamp = NOW()
    WHERE no_rawat = ?
  `;

  db.query(sqlUpdate, [no_rawat], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Ambil no_reg + panggil_timestamp setelah update
    const sqlSelect = `
      SELECT no_reg, panggil_timestamp
      FROM reg_periksa
      WHERE no_rawat = ?
      LIMIT 1
    `;

    db.query(sqlSelect, [no_rawat], (err2, rows) => {
      if (err2) {
        console.error("Error fetching no_reg:", err2);
        return res.status(500).json({ message: "Database error" });
      }

      const no_reg = rows[0]?.no_reg || null;
      const panggil_timestamp = rows[0]?.panggil_timestamp || null;

      const io = req.app.get("io");
      io.emit("updateAntrian", { no_rawat, no_reg, status_panggil: 1, panggil_timestamp });

      res.json({
        message: "Antrian berhasil dipanggil (status_panggil = 1)",
        no_rawat,
        no_reg,
        status_panggil: 1,
        panggil_timestamp,
      });
    });
  });
};




// Sudah dipanggil 3x (status_panggil = 2)
export const sudahDipanggil3x = (req, res) => {
  const { no_rawat } = req.query;

  if (!no_rawat) {
    return res.status(400).json({ message: "no_rawat is required" });
  }

  const sql = `
    UPDATE reg_periksa 
    SET status_panggil = 2
    WHERE no_rawat = ?
  `;

  db.query(sql, [no_rawat], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json({
      message: "Pasien sudah dipanggil 3x (status_panggil = 2)",
      no_rawat,
      status_panggil: 2,
    });
  });
};