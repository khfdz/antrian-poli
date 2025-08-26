import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function LorongAnakView() {
  const [latestQueue, setLatestQueue] = useState(null);

  useEffect(() => {
    const date = "2025-09-18";
    const poliNames = [
      "POLIKLINIK ANAK I",
      "POLIKLINIK ANAK II",
      "POLIKLINIK ANAK III",
    ];

    const fetchData = async () => {
      try {
        const promises = poliNames.map(poli =>
          fetch(`http://localhost:1414/api/reg-periksa?poli=${encodeURIComponent(poli)}&tgl=${date}`)
            .then(res => res.json())
            .then(result => {
              const records = Array.isArray(result) ? result : result.data;
              return { [poli]: records };
            })
        );

        const results = await Promise.all(promises);
        const groupedData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        // Find the latest record with status_panggil: 1
        let latest = null;
        Object.keys(groupedData).forEach(poli => {
          const records = groupedData[poli];
          const calledRecord = records
            .filter(record => record.status_panggil === 1)
            .sort((a, b) => new Date(b.tgl_registrasi + "T" + b.jam_reg) - new Date(a.tgl_registrasi + "T" + a.jam_reg))[0];
          if (calledRecord) {
            latest = calledRecord;
          }
        });

        setLatestQueue(latest);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Antrian Poliklinik Anak</h1>
      {latestQueue ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-200">
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
        <p className="text-lg text-gray-500">Tidak ada antrian yang sedang dipanggil.</p>
      )}
      <div className="mt-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-lg"
        >
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}