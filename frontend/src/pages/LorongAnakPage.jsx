import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function LorongAnakPage() {
  const [poliAnakData, setPoliAnakData] = useState({});

  const date = "2025-07-13"; // tanggal yang sama untuk link
  const poliList = [
    { code: "002", name: "POLIKLINIK ANAK I" },
    { code: "032", name: "POLIKLINIK ANAK II" },
    { code: "049", name: "POLIKLINIK ANAK III" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = poliList.map(({ code, name }) =>
          fetch(
            `http://localhost:1414/api/reg-periksa?tanggal=${date}&poli=${code}`
          )
            .then((res) => res.json())
            .then((result) => {
              const records = Array.isArray(result)
                ? result
                : result.data || [];
              return { [name]: records };
            })
        );

        const results = await Promise.all(promises);
        const groupedData = results.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );

        setPoliAnakData(groupedData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []); // hanya dijalankan sekali

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lorong Poliklinik Anak</h1>
      <ul className="space-y-2">
        {Object.keys(poliAnakData).map((poli) => (
          <li
            key={poli}
            className="bg-gray-100 p-3 rounded hover:bg-gray-200"
          >
            <Link
              to={`/poli/${poliList.find(p => p.name === poli).code}/${date}`}
              className="text-blue-600 hover:underline"
            >
              {poli} - Jumlah Antrian: {poliAnakData[poli].length}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
