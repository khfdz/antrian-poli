import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function LorongAnakPage() {
  const [poliAnakData, setPoliAnakData] = useState({});

  useEffect(() => {
    const date = "2025-09-18";
    const poliNames = [
      "POLIKLINIK ANAK I",
      "POLIKLINIK ANAK II",
      "POLIKLINIK ANAK III"
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
        setPoliAnakData(groupedData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lorong Poliklinik Anak</h1>
      <ul className="space-y-2">
        {Object.keys(poliAnakData).map((poli) => (
          <li key={poli} className="bg-gray-100 p-3 rounded hover:bg-gray-200">
            <Link to={`/poli/${encodeURIComponent(poli)}`} className="text-blue-600 hover:underline">
              {poli} - Jumlah Antrian: {poliAnakData[poli].length}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}