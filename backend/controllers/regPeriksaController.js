import db from "../config/db.js";

export const getAllRegPeriksa = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1000;
  const offset = (page - 1) * limit;

  const { tanggal, poli, no_rawat } = req.query;

  let filters = [];
  let params = [];

  // filter by no_rawat
  if (no_rawat) {
    filters.push("r.no_rawat = ?");
    params.push(no_rawat);
  }

  // filter by tanggal (gunakan DATE untuk aman)
// filter by tanggal (langsung bandingkan DATE)
if (tanggal) {
  filters.push("r.tgl_registrasi = ?");
  params.push(tanggal);
}


  // filter by poli (bisa multiple, pisah koma)
  if (poli) {
    const poliList = poli.split(",");
    const placeholders = poliList.map(() => "?").join(",");
    filters.push(`poli.nm_poli IN (${placeholders})`);
    params.push(...poliList);
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
      r.status_panggil
    FROM reg_periksa r
    LEFT JOIN pasien p ON r.no_rkm_medis = p.no_rkm_medis
    LEFT JOIN dokter d ON r.kd_dokter = d.kd_dokter
    LEFT JOIN poliklinik poli ON r.kd_poli = poli.kd_poli
    ${whereClause}
    ORDER BY r.tgl_registrasi DESC, r.jam_reg DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [...params, limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // count query (pakai filter yang sama, tapi tanpa limit offset)
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
