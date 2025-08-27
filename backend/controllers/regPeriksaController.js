import db from "../config/db.js";

export const getAllRegPeriksa = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1000;
  const offset = (page - 1) * limit;

  const { tanggal, poli, no_rawat, status_panggil } = req.query;

  let filters = [];
  let params = [];

  // filter by no_rawat
  if (no_rawat) {
    filters.push("r.no_rawat = ?");
    params.push(no_rawat);
  }

  // filter by tanggal (pastikan DATE)
  if (tanggal) {
    filters.push("DATE(r.tgl_registrasi) = ?");
    params.push(tanggal);
  }

  // filter by poli (pakai TRIM biar aman spasi depan/belakang)
  if (poli) {
    const poliList = poli.split(",");
    const placeholders = poliList.map(() => "TRIM(poli.nm_poli) = ?").join(" OR ");
    filters.push(`(${placeholders})`);
    params.push(...poliList.map((p) => p.trim())); // trim juga dari sisi JS
  }

  // filter by status_panggil (CAST ke CHAR biar bisa cocok angka/string)
if (status_panggil !== undefined) {
  filters.push("r.status_panggil = ?");
  params.push(Number(status_panggil));
}

  // gabung semua filter
  const whereClause = filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

const sql = `
  SELECT 
    r.no_reg,
    r.no_rawat,
    r.tgl_registrasi,
    r.jam_reg,
    r.kd_dokter,
    d.nm_dokter,
    r.no_rkm_medis,
    p.nm_pasien,
    p.alamat,
    poli.nm_poli,           
    r.status_bayar,
    r.status_poli,
    r.status_panggil,
    r.panggil_timestamp,
    r.reg_timestamp
  FROM reg_periksa r
  LEFT JOIN pasien p ON r.no_rkm_medis = p.no_rkm_medis
  LEFT JOIN dokter d ON r.kd_dokter = d.kd_dokter
  LEFT JOIN poliklinik poli ON r.kd_poli = poli.kd_poli
  ${whereClause}
  ORDER BY 
    COALESCE(r.panggil_timestamp, r.reg_timestamp, STR_TO_DATE(CONCAT(r.tgl_registrasi, ' ', r.jam_reg), '%Y-%m-%d %H:%i:%s')) DESC
  LIMIT ? OFFSET ?
`;


  db.query(sql, [...params, limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // count query
    const countSql = `
      SELECT COUNT(*) as total
      FROM reg_periksa r
      LEFT JOIN poliklinik poli ON r.kd_poli = poli.kd_poli
      ${whereClause}
    `;

    db.query(countSql, params, (err2, countResult) => {
      if (err2) {
        console.error("Error counting data:", err2);
        return res.status(500).json({ message: "Database error" });
      }

      const total = countResult[0].total;
      res.json({
        data: results,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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