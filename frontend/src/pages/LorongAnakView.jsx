import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:1414"); // backend kamu

export default function LorongAnakView() {
  const [latestQueue, setLatestQueue] = useState(null);
  const [standbyQueues, setStandbyQueues] = useState({
    "POLIKLINIK ANAK I": null,
    "POLIKLINIK ANAK II": null,
    "POLIKLINIK ANAK III": null,
  });

  const date = "2025-08-20";
  const poliNames = [
    "POLIKLINIK ANAK I",
    "POLIKLINIK ANAK II",
    "POLIKLINIK ANAK III",
  ];

  const fetchData = async () => {
    try {
      // Build query string dengan poli[]=...
      const queryParams = new URLSearchParams();
      queryParams.append("tanggal", date);
      poliNames.forEach(poli => queryParams.append("poli[]", poli));
      queryParams.append("status_panggil", 1);

      const response = await fetch(
        `http://localhost:1414/api/reg-periksa?${queryParams.toString()}`
      );
      const result = await response.json();
      const records = Array.isArray(result) ? result : result.data || [];

      console.log("📥 Data dari API:", records);

      // Group data by poli
      const groupedData = poliNames.reduce((acc, poli) => {
        acc[poli] = records.filter(r => r.nm_poli === poli);
        return acc;
      }, {});
      console.log("🔀 Grouped data:", groupedData);

      // Cari latest (status_panggil === 1 dengan panggil_timestamp paling baru)
      let latest = null;
      Object.keys(groupedData).forEach((poli) => {
        groupedData[poli]
          .filter(r => r.status_panggil === 1)
          .forEach(r => {
            const ts = new Date(r.panggil_timestamp);
            if (isNaN(ts)) return;

            const latestTS = latest?.panggil_timestamp ? new Date(latest.panggil_timestamp) : new Date(0);
            if (!latest || ts > latestTS) {
              latest = { ...r, nm_poli: poli };
            }
          });
      });
      console.log("📢 Sedang dipanggil (latest):", latest);

      // Cari standby (status_panggil === 1 dengan panggil_timestamp paling baru per poli)
      const standbyData = {};
      poliNames.forEach(poli => {
        const standby = groupedData[poli]
          .filter(r => r.status_panggil === 1)
          .sort((a, b) => new Date(b.panggil_timestamp) - new Date(a.panggil_timestamp))[0];
        standbyData[poli] = standby || null;
      });
      console.log("⏳ Standby queues:", standbyData);

      setLatestQueue(latest);
      setStandbyQueues(standbyData);
    } catch (err) {
      console.error("❌ Error fetchData:", err);
    }
  };

  useEffect(() => {
    // Pertama kali load
    fetchData();

    // Listen event updateAntrian dari backend
    socket.on("updateAntrian", (data) => {
      console.log("📢 updateAntrian:", data);
      fetchData(); // Refresh data terbaru tiap ada update
    });

    return () => {
      socket.off("updateAntrian");
    };
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Antrian Poliklinik Anak</h1>

      {latestQueue ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sedang Dipanggil</h2>
          <p className="text-lg text-gray-600 mb-2">
            <span className="font-medium">No. Registrasi:</span> {latestQueue.no_reg}
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <span className="font-medium">Poliklinik:</span> {latestQueue.nm_poli}
          </p>
          <p className="text-lg text-gray-600 mb-4">
            <span className="font-medium">Dokter:</span> {latestQueue.nm_dokter}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            Silahkan menuju ke {latestQueue.nm_poli}
          </p>
        </div>
      ) : (
        <p className="text-lg text-gray-500 mb-6">Tidak ada antrian yang sedang dipanggil.</p>
      )}

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Antrian Standby</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(standbyQueues).map(poli => (
            <div key={poli} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">{poli}</h3>
              {standbyQueues[poli] ? (
                <>
                  <p className="text-base text-gray-600 mb-2">
                    <span className="font-medium">No. Registrasi:</span> {standbyQueues[poli].no_reg}
                  </p>
                  <p className="text-base text-gray-600 mb-2">
                    <span className="font-medium">Dokter:</span> {standbyQueues[poli].nm_dokter}
                  </p>
                  <p className="text-base font-semibold text-gray-600">
                    Harap bersiap menuju {poli}
                  </p>
                </>
              ) : (
                <p className="text-base text-gray-500">Tidak ada antrian standby.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline text-lg">
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}