import React, { useEffect, useState } from "react";

export default function Lorong1Page() {
  const [antrian, setAntrian] = useState([]);

  useEffect(() => {
  fetch("http://localhost:1414/api/reg-periksa")
    .then((res) => res.json())
    .then((result) => {
      // cek apakah result langsung array atau ada di result.data
      const records = Array.isArray(result) ? result : result.data;
      
      const filtered = records.filter((item) =>
        ["POLIKLINIK OBSGYN/KANDUNGAN I",
         "POLIKLINIK OBSGYN/KANDUNGAN II",
         "POLIKLINIK ORTHOPEDY"].includes(item.nm_poli)
      );
      setAntrian(filtered);
    })
    .catch((err) => console.error(err));
}, []);


  const panggilPasien = (pasien) => {
    if (!pasien) return;
    const text = `Nomor antrian ${pasien.no_reg}, atas nama ${pasien.nm_pasien}, silakan menuju ${pasien.nm_poli}`;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <h1>Lorong 1 - Daftar Antrian</h1>
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
