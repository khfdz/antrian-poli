import React from "react";

export default function QueueDisplay({ latestQueue, missedQueues }) {
  return (
    <div className="mb-10 mt-6  ml-6 mr-6 flex space-x-6">
      {/* Sedang Dipanggil Section */}
      <div className="flex-2 rounded-2xl shadow-xl overflow-hidden" style={{ borderColor: "#3B82F6", backgroundColor: "#EBF4FF" }}>
        <div
          className="px-6 py-3 relative overflow-hidden"
          style={{
            background: "linear-gradient(to right, #3B82F6, #1D4ED8)",
          }}
        >
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: "linear-gradient(to right, rgba(59,130,246,0.2), rgba(29,78,216,0.2))",
            }}
          ></div>
          <h2 className="text-2xl font-bold text-white text-center relative z-10 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full mr-3 animate-ping"></div>
            🔊 SEDANG DIPANGGIL
          </h2>
        </div>

        {latestQueue ? (
          <div className="p-2">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-35 h-35 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 mt-4"
                  style={{
                    background: "linear-gradient(to right, #3B82F6, #1D4ED8)",
                  }}
                >
                  <div className="text-5xl font-bold text-white">
                    {latestQueue.no_reg}
                  </div>
                </div>
                <p className="text-3xl text-gray-700 mt-4 mb-2 font-semibold">
                  NOMOR ANTRIAN
                </p>
              </div>
              <div className="text-5xl text-gray-700 animate-bounce">→</div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-6 py-4 border-2 border-blue-200 shadow-inner">
                  <div className="text-3xl text-gray-600 mb-2 font-semibold">
                    {latestQueue.nm_poli}
                  </div>
                  {latestQueue.nm_dokter && (
                    <p className="text-3xl text-gray-700 mt-2">
                      <span className="font-semibold">
                        {latestQueue.nm_dokter}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-xl text-gray-500 font-medium">
              Menunggu Panggilan Berikutnya...
            </p>
          </div>
        )}
      </div>

      {/* Antrian Terlewat Section */}
      <div className="flex-1 rounded-2xl shadow-xl overflow-hidden" style={{ borderColor: "#EF4444", backgroundColor: "#FEF2F2" }}>
        <div
          className="px-6 py-3 relative overflow-hidden"
          style={{
            background: "linear-gradient(to right, #EF4444, #B91C1C)",
          }}
        >
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: "linear-gradient(to right, rgba(239,68,68,0.2), rgba(185,28,28,0.2))",
            }}
          ></div>
          <h2 className="text-2xl font-bold text-white text-center relative z-10 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full mr-3 animate-ping"></div>
            ❗ ANTRIAN TERLEWAT
          </h2>
        </div>

        <div className="p-4">
          {missedQueues && typeof missedQueues === 'object' && Object.keys(missedQueues).length > 0 && Object.values(missedQueues).some(queue => Array.isArray(queue) && queue.length > 0) ? (
            <div className="space-y-4">
              {Object.entries(missedQueues).map(([poli, queues]) =>
                Array.isArray(queues) && queues.length > 0 ? (
                  <div key={poli} className="">
                  
                    <div className="flex flex-wrap gap-2 mt-2">
                      {queues.map((queue, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center justify-center w-23 h-23 rounded-full shadow-md text-white text-4xl font-bold"
                          style={{
              background: "linear-gradient(to right, #EF4444, #B91C1C)",
            }}
                        >
                          {queue.no_reg}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-xl text-gray-500 font-medium">
                Tidak Ada Antrian Terlewat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}