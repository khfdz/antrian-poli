import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

// Koneksi socket global
const socket = io("http://localhost:1414"); // ganti sesuai backend

export default function PoliDetail() {
  const { poliCode, date } = useParams(); // URL: /poli/002/2025-08-13
  const [antrian, setAntrian] = useState([]);
  const [dipanggil, setDipanggil] = useState([]);
  const [terlewat, setTerlewat] = useState([]);

  const fetchData = async () => {
    if (!poliCode || !date) return;

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("tanggal", date);
      queryParams.append("poli", poliCode);
      queryParams.append("status_panggil", 0);

      const response = await fetch(
        `http://localhost:1414/api/reg-periksa?${queryParams.toString()}`
      );

      if (!response.ok) {
        console.error("❌ Fetch gagal:", response.status, response.statusText);
        return;
      }

      const result = await response.json();
      setAntrian(result.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on("updateAntrian", (data) => {
      console.log("📢 updateAntrian:", data);
      fetchData();
    });

    return () => socket.off("updateAntrian");
  }, [poliCode, date]);

const panggilPasien = async (pasien) => {
  try {
    const response = await fetch(
      `http://localhost:1414/api/reg-periksa/panggil?no_rawat=${encodeURIComponent(pasien.no_rawat)}`,
      {
        method: "PUT", // ✅ wajib PUT
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gagal panggil pasien: ${response.status} ${response.statusText}`);
    }

    console.log(`✅ Berhasil panggil pasien ${pasien.no_rkm_medis}`);
  } catch (err) {
    console.error("❌ Error panggil pasien:", err);
  }
};


  const lewatkanAntrian = (pasien) => {
    setAntrian((prev) => prev.filter((p) => p.no_rawat !== pasien.no_rawat));
    setTerlewat((prev) => [...prev, { ...pasien, status: "Terlewat" }]);
  };

  const selesaiPanggil = (pasien) => {
    setDipanggil((prev) => prev.filter((p) => p.no_rawat !== pasien.no_rawat));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Detail Poli: {poliCode} - {date}
      </h1>

      <h2 className="text-xl font-semibold mt-4">Antrian Standby</h2>
      <ul className="mb-4">
        {antrian.length > 0 ? (
          antrian.map((p) => (
            <li key={`${p.no_reg}-${p.no_rawat}`}>
              {p.no_reg} - {p.no_rawat} - {p.nm_pasien || "Pasien Tidak Diketahui"} -{" "}
              {p.nm_poli} - {p.status_panggil}
              <button onClick={() => panggilPasien(p)}>Panggil</button>
              <button onClick={() => lewatkanAntrian(p)}>Lewatkan</button>
            </li>
          ))
        ) : (
          <li>Tidak ada antrian standby.</li>
        )}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Sedang Dipanggil</h2>
      <ul className="mb-4">
        {dipanggil.length > 0 ? (
          dipanggil.map((p) => (
            <li key={`${p.no_reg}-${p.no_rawat}`}>
              {p.no_reg} - {p.nm_pasien || "Pasien Tidak Diketahui"} - {p.status}
              <button onClick={() => selesaiPanggil(p)}>Selesai</button>
            </li>
          ))
        ) : (
          <li>Tidak ada pasien sedang dipanggil.</li>
        )}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Antrian Terlewat</h2>
      <ul className="mb-4">
        {terlewat.length > 0 ? (
          terlewat.map((p) => (
            <li key={`${p.no_reg}-${p.no_rawat}`}>
              {p.no_reg} - {p.nm_pasien || "Pasien Tidak Diketahui"} - {p.status}
            </li>
          ))
        ) : (
          <li>Tidak ada antrian terlewat.</li>
        )}
      </ul>
    </div>
  );
}
