// src/components/PoliDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PoliDetail() {
  const { poliName } = useParams();
  const [antrian, setAntrian] = useState([]);
  const [dipanggil, setDipanggil] = useState([]); // Antrian yang sedang dipanggil
  const [terlewat, setTerlewat] = useState([]); // Antrian yang terlewat

  useEffect(() => {
    fetch("http://localhost:1414/api/reg-periksa")
      .then((res) => res.json())
      .then((result) => {
        const records = Array.isArray(result) ? result : result.data;
        const filtered = records.filter((item) => item.nm_poli === decodeURIComponent(poliName));
        setAntrian(filtered);
      })
      .catch((err) => console.error(err));
  }, [poliName]);

 const panggilPasien = (pasien) => {
  if (!pasien) return;
  const text = `Nomor antrian ${pasien.no_reg}, atas nama ${pasien.nm_pasien}, silakan menuju ${pasien.nm_poli}`;
  const utterance = new SpeechSynthesisUtterance(text);

  // Set ke bahasa Indonesia
  utterance.lang = "id-ID";

  speechSynthesis.speak(utterance);

  // Pindahkan ke sedang dipanggil
  setAntrian((prev) => prev.filter((p) => p.no_reg !== pasien.no_reg));
  setDipanggil((prev) => [...prev, { ...pasien, status: "Sedang Dipanggil" }]);
};


  const lewatkanAntrian = (pasien) => {
    // Pindahkan ke terlewat
    setAntrian((prev) => prev.filter((p) => p.no_reg !== pasien.no_reg));
    setTerlewat((prev) => [...prev, { ...pasien, status: "Terlewat" }]);
  };

  const selesaiPanggil = (pasien) => {
    // Hapus dari sedang dipanggil (asumsi selesai)
    setDipanggil((prev) => prev.filter((p) => p.no_reg !== pasien.no_reg));
  };

  return (
    <div>
      <h1>Detail Poli: {decodeURIComponent(poliName)}</h1>

      <h2>Daftar Antrian</h2>
      <ul>
        {antrian.map((p, idx) => (
          <li key={idx}>
             {p.no_rawat} - {p.no_reg} - {p.nm_pasien || "Pasien Tidak Diketahui"} - {p.nm_poli}
            <button onClick={() => panggilPasien(p)}>Panggil</button>
            <button onClick={() => lewatkanAntrian(p)}>Lewatkan</button>
          </li>
        ))}
      </ul>

      <h2>Sedang Dipanggil</h2>
      <ul>
        {dipanggil.map((p, idx) => (
          <li key={idx}>
            {p.no_reg} - {p.nm_pasien || "Pasien Tidak Diketahui"} - {p.status}
            <button onClick={() => selesaiPanggil(p)}>Selesai</button>
          </li>
        ))}
      </ul>

      <h2>Antrian Terlewat</h2>
      <ul>
        {terlewat.map((p, idx) => (
          <li key={idx}>
            {p.no_reg} - {p.nm_pasien || "Pasien Tidak Diketahui"} - {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
}