import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import TextToSpeech from "../components/TextToSpeech";

const socket = io("http://localhost:1414");

export default function LorongAnakView() {
  const [latestQueue, setLatestQueue] = useState(null);
  const [standbyQueues, setStandbyQueues] = useState({
    "POLIKLINIK ANAK I": null,
    "POLIKLINIK ANAK II": null,
    "POLIKLINIK ANAK III": null,
  });
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const date = "2025-08-13";

  const poliList = [
    { kode: "002", nama: "POLIKLINIK ANAK I" },
    { kode: "032", nama: "POLIKLINIK ANAK II" },
    { kode: "049", nama: "POLIKLINIK ANAK III" },
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async (triggerFromSocket = false) => {
    try {
      const poliCodes = poliList.map((p) => p.kode).join(",");

      const queryParams = new URLSearchParams();
      queryParams.append("tanggal", date);
      queryParams.append("poli", poliCodes);
      queryParams.append("status_panggil", 1);

      const response = await fetch(
        `http://localhost:1414/api/reg-periksa?${queryParams.toString()}`
      );
      const result = await response.json();
      const records = Array.isArray(result) ? result : result.data || [];

      console.log("📥 Data dari API:", records);

      const groupedData = poliList.reduce((acc, poli) => {
        acc[poli.nama] = records.filter((r) => r.nm_poli === poli.nama);
        return acc;
      }, {});
      console.log("🔀 Grouped data:", groupedData);

      let latest = null;
      Object.keys(groupedData).forEach((poli) => {
        groupedData[poli]
          .filter((r) => r.status_panggil === 1)
          .forEach((r) => {
            const ts = new Date(r.panggil_timestamp);
            if (isNaN(ts)) return;

            const latestTS = latest?.panggil_timestamp
              ? new Date(latest.panggil_timestamp)
              : new Date(0);
            if (!latest || ts > latestTS) {
              latest = { ...r, nm_poli: poli };
            }
          });
      });
      console.log("📢 Sedang dipanggil (latest):", latest);

      const standbyData = {};
      poliList.forEach((poli) => {
        const standby = groupedData[poli.nama]
          .filter((r) => r.status_panggil === 1)
          .sort(
            (a, b) => new Date(b.panggil_timestamp) - new Date(a.panggil_timestamp)
          )[0];
        standbyData[poli.nama] = standby || null;
      });
      console.log("⏳ Standby queues:", standbyData);

      setLatestQueue(latest);
      setStandbyQueues(standbyData);

      if (triggerFromSocket && latest) {
        setShouldSpeak(true);
      }
    } catch (err) {
      console.error("❌ Error fetchData:", err);
    }
  };

  useEffect(() => {
    fetchData(false);

    socket.on("updateAntrian", (data) => {
      console.log("📢 updateAntrian:", data);
      fetchData(true);
    });

    return () => {
      socket.off("updateAntrian");
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Header Section */}
      <div className="bg-white shadow-xl border-b-4 border-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5"></div>
        <div className="relative z-10 px-8 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
           
           
          </div>
        </div>
      </div>

      {/* TTS Component */}
      {shouldSpeak && latestQueue && (
        <TextToSpeech
          queue={latestQueue}
          onEnd={() => setShouldSpeak(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Call Section */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-2xl border-t-8 border-gradient-to-r from-blue-500 to-green-500 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 px-8 py-4">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-4 animate-pulse"></div>
                SEDANG DIPANGGIL
              </h2>
            </div>
            
            {latestQueue ? (
              <div className="p-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mb-6 shadow-inner">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      {latestQueue.no_reg}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    NOMOR REGISTRASI
                  </h3>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center border-2 border-blue-200">
                  <p className="text-3xl font-bold text-gray-800 mb-4">
                    Silakan menuju ke
                  </p>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent animate-pulse">
                    {latestQueue.nm_poli}
                  </div>
                  {latestQueue.nm_dokter && (
                    <p className="text-xl text-gray-600 mt-4">
                      Dokter: <span className="font-semibold">{latestQueue.nm_dokter}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-2xl text-gray-500 font-medium">
                  Menunggu Panggilan Berikutnya...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Standby Queues Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            ANTRIAN STANDBY
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.entries(standbyQueues).map(([poli, queue], index) => (
              <div
                key={poli}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border-t-4"
                style={{ 
                  borderTopColor: index === 0 ? '#048cd6' : index === 1 ? '#07a75e' : '#048cd6',
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div 
                  className="px-6 py-4 text-white font-bold text-xl text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${index === 0 ? '#048cd6' : index === 1 ? '#07a75e' : '#048cd6'}, ${index === 0 ? '#0066cc' : index === 1 ? '#059652' : '#0066cc'})` 
                  }}
                >
                  {poli}
                </div>
                
                <div className="p-8">
                  {queue ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div 
                          className="inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold mb-4 shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${index === 0 ? '#048cd6' : index === 1 ? '#07a75e' : '#048cd6'}, ${index === 0 ? '#0066cc' : index === 1 ? '#059652' : '#0066cc'})` 
                          }}
                        >
                          {queue.no_reg}
                        </div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                          Nomor Registrasi
                        </p>
                      </div>
                      
                      {queue.nm_dokter && (
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                            Dokter
                          </p>
                          <p className="font-semibold text-gray-800">
                            {queue.nm_dokter}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2 animate-pulse"
                          style={{ backgroundColor: index === 0 ? '#048cd6' : index === 1 ? '#07a75e' : '#048cd6' }}
                        ></div>
                        <span className="text-sm text-gray-600 font-medium">
                          Siap Dipanggil
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      </div>
                      <p className="text-gray-500 font-medium">
                        Tidak ada antrian standby
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Footer */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-green-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-800">
                Sistem Antrian Aktif
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Terakhir diperbarui: {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed top-20 right-10 w-6 h-6 bg-blue-200 rounded-full animate-bounce opacity-20"></div>
      <div className="fixed top-40 right-32 w-4 h-4 bg-green-200 rounded-full animate-pulse opacity-20"></div>
      <div className="fixed bottom-20 left-10 w-8 h-8 bg-blue-100 rounded-full animate-ping opacity-10"></div>
    </div>
  );
}