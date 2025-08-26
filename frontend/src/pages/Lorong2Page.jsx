import React, { useEffect, useState } from "react";

export default function Lorong2Page() {
  const [antrian, setAntrian] = useState([]);

useEffect(() => {
  fetch("http://localhost:1414/api/reg-periksa")
    .then((res) => res.json())
    .then((result) => {
      console.log("API Response:", result); // 👈 cek isi API

      const records = Array.isArray(result) ? result : result.data;

      const filtered = records.filter((item) =>
        ["POLIKLINIK ANAK II", "POLIKLINIK SYARAF"].includes(item.nm_poli)
      );
      setAntrian(filtered);
    })
    .catch((err) => console.error(err));
}, []);



const panggilPasien = (pasien) => {
  if (!pasien) return;
  const text = `Nomor antrian ${pasien.no_reg}, atas nama ${pasien.nm_pasien}, silakan menuju ${pasien.nm_poli}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";   // 👈 TTS bahasa Indonesia
  utterance.rate = 0.9;       // sedikit diperlambat biar jelas
  utterance.pitch = 1.0;      // normal pitch
  speechSynthesis.speak(utterance);
};


  return (
    <div>
      <h1>Lorong 2 - Daftar Antrian</h1>
      <ul>
        {antrian.map((p, idx) => (
          <li key={idx}>
            {p.no_reg} - {p.nm_pasien || "Pasien Tidak Diketahui"} - {p.nm_poli}
            <button onClick={() => panggilPasien(p)}>Panggil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
