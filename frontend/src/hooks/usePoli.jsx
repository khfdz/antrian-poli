// src/hooks/usePoli.jsx
import { useState, useEffect } from "react";
import { socket } from "../utils/socketUtils"; // Import socket from socketUtils

export const usePoli = (poliCode, date) => {
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
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Gagal panggil pasien: ${response.status} ${response.statusText}`);
      }

      console.log(`✅ Berhasil panggil pasien ${pasien.no_rkm_medis}`);
      setAntrian((prev) => prev.filter((p) => p.no_rawat !== pasien.no_rawat));
      setDipanggil((prev) => [...prev, { ...pasien, status: "Dipanggil" }]);
    } catch (err) {
      console.error("❌ Error panggil pasien:", err);
    }
  };

  const lewatkanAntrian = async (pasien) => {
    try {
      const response = await fetch(
        `http://localhost:1414/api/reg-periksa/terlewat?no_rawat=${encodeURIComponent(pasien.no_rawat)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Gagal lewatkan antrian: ${response.status} ${response.statusText}`);
      }

      console.log(`✅ Berhasil lewatkan pasien ${pasien.no_rkm_medis}`);
      setAntrian((prev) => prev.filter((p) => p.no_rawat !== pasien.no_rawat));
      setTerlewat((prev) => [...prev, { ...pasien, status: "Terlewat" }]);
    } catch (err) {
      console.error("❌ Error lewatkan antrian:", err);
    }
  };

  const selesaiPanggil = (pasien) => {
    setDipanggil((prev) => prev.filter((p) => p.no_rawat !== pasien.no_rawat));
  };

  return {
    antrian,
    dipanggil,
    terlewat,
    panggilPasien,
    lewatkanAntrian,
    selesaiPanggil,
  };
};