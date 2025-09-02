import React from "react";

export default function StandbyQueueCard({ poli, queue, color }) {
  return (
    <div className="bg-white h-[330px] rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 flex flex-col">
      <div
        className="px-2 py-2 text-white font-bold text-center relative"
        style={{
          background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
        }}
      >
        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        <div className="relative z-10 text-2xl leading-tight">{poli}</div>
      </div>
      <div
        className="px-2 py-4 text-center border-b-2"
        style={{
          backgroundColor: color.light,
          borderBottomColor: `${color.primary}20`,
        }}
      >
        {queue?.nm_dokter ? (
          <p className="font-bold text-gray-800 text-xl leading-tight">
            {queue.nm_dokter}
          </p>
        ) : (
          <p className="text-md font-bold text-gray-500 italic">Tidak ada dokter</p>
        )}
      </div>
      <div className="py-8 flex justify-center ">
        {queue ? (
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-35 h-35 rounded-full text-white text-6xl font-bold shadow-lg transform hover:scale-110 transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
              }}
            >
              {queue.no_reg}
            </div>
          </div>
        ) : (
          <div className="text-center mt-8">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: color.light }}
            >
              <div
                className="w-6 h-6 rounded-full opacity-50"
                style={{ backgroundColor: color.primary }}
              ></div>
            </div>
            <p className="text-gray-500 font-medium text-xl ">
              Tidak ada antrian
            </p>
          </div>
        )}
      </div>
    </div>
  );
}