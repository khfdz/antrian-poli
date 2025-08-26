// src/components/PoliList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Asumsi menggunakan react-router-dom untuk navigasi

export default function PoliList() {
  const [poliData, setPoliData] = useState({}); // Objek untuk menyimpan antrian per poli

  useEffect(() => {
    fetch("http://localhost:1414/api/reg-periksa")
      .then((res) => res.json())
      .then((result) => {
        const records = Array.isArray(result) ? result : result.data;

        // Kelompokkan data berdasarkan nm_poli
        const grouped = records.reduce((acc, item) => {
          const poli = item.nm_poli;
          if (!acc[poli]) {
            acc[poli] = [];
          }
          acc[poli].push(item);
          return acc;
        }, {});

        setPoliData(grouped);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Daftar Poli dan Antrian</h1>
      <ul>
        {Object.keys(poliData).map((poli) => (
          <li key={poli}>
            <Link to={`/poli/${encodeURIComponent(poli)}`}>
              {poli} - Jumlah Antrian: {poliData[poli].length}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}