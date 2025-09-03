// src/components/PoliDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { usePoli } from "../hooks/usePoli";

export default function PoliDetail() {
  const { poliCode, date } = useParams();
  const { antrian, dipanggil, terlewat, panggilPasien, lewatkanAntrian, selesaiPanggil } =
    usePoli(poliCode, date);

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