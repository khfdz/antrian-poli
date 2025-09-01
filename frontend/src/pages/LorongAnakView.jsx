import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import TextToSpeech from "../components/TextToSpeech";
import Navbar from "../components/Navbar";

// Initialize socket outside the component
const socket = io("http://localhost:1414", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

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

  // Log latestQueue changes for debugging
  useEffect(() => {
    console.log("🔄 latestQueue updated:", latestQueue);
  }, [latestQueue]);

  const fetchData = async (triggerFromSocket = false) => {
    try {
      const poliCodes = poliList.map((p) => p.kode).join(",");

      const queryParams = new URLSearchParams();
      queryParams.append("tanggal", date);
      queryParams.append("poli", poliCodes);
      queryParams.append("status_panggil", 1);
      queryParams.append("t", Date.now()); // Cache-busting

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
        standbyData[poli.nama] = standby ? { ...standby } : null;
      });
      console.log("⏳ Standby queues:", standbyData);

      setLatestQueue((prev) => (latest ? { ...latest } : null));
      setStandbyQueues((prev) => ({ ...standbyData }));

      if (triggerFromSocket && latest) {
        setShouldSpeak(true);
      }
    } catch (err) {
      console.error("❌ Error fetchData:", err);
    }
  };

  const debouncedFetchData = debounce(fetchData, 300);

  useEffect(() => {
    fetchData(false);

    const handleUpdateAntrian = (data) => {
      console.log("📢 updateAntrian:", data);
      debouncedFetchData(true);
    };

    socket.on("updateAntrian", handleUpdateAntrian);

    return () => {
      socket.off("updateAntrian", handleUpdateAntrian);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPoliColor = (index) => {
    const colors = [
      { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" }, // Blue
      { primary: "#10B981", secondary: "#059669", light: "#ECFDF5" }, // Green
      { primary: "#8B5CF6", secondary: "#7C3AED", light: "#F3E8FF" }, // Purple
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 overflow-hidden flex flex-col">
      {shouldSpeak && latestQueue && (
        <TextToSpeech
          queue={latestQueue}
          onEnd={() => {
            console.log("🔇 TextToSpeech ended");
            setShouldSpeak(false);
          }}
        />
      )}

      <div className="flex-1 ml-2 mr-2 mx-auto px-4 py-6 flex flex-col">
        <Navbar />
        <div className="mb-6">
          <div
            className="rounded-2xl shadow-xl overflow-hidden"
            style={{ borderColor: "#3B82F6", backgroundColor: "#EBF4FF" }}
          >
            <div
              className="px-6 py-3 relative overflow-hidden"
              style={{
                background: "linear-gradient(to right, #3B82F6, #1D4ED8)",
              }}
            >
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background:
                    "linear-gradient(to right, rgba(59,130,246,0.2), rgba(29,78,216,0.2))",
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
                      className="inline-flex items-center justify-center w-40 h-40 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 mt-4"
                      style={{
                        background: "linear-gradient(to right, #3B82F6, #1D4ED8)",
                      }}
                    >
                      <div className="text-6xl font-bold text-white">
                        {latestQueue.no_reg}
                      </div>
                    </div>
                    <p className="text-4xl text-gray-700 mt-4 mb-2 font-semibold">
                      NOMOR ANTRIAN
                    </p>
                  </div>
                  <div className="text-4xl text-gray-400 animate-bounce">→</div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-6 py-4 border-2 border-blue-200 shadow-inner">
                      <p className="text-4xl text-gray-600 font-semibold">
                        Menuju ke:
                      </p>
                      <div className="text-4xl text-gray-600 mt-4 mb-2 font-semibold">
                        {latestQueue.nm_poli}
                      </div>
                      {latestQueue.nm_dokter && (
                        <p className="text-3xl text-black mt-2">
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
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4 h-[340px]">
            {Object.entries(standbyQueues).map(([poli, queue], index) => {
              const color = getPoliColor(index);

              return (
                <div
                  key={poli}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 flex flex-col"
                >
                  <div
                    className="px-2 py-2 text-white font-bold text-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    <div className="relative z-10 text-3xl leading-tight">
                      {poli}
                    </div>
                  </div>
                  <div
                    className="px-2 py-4 text-center border-b-2"
                    style={{
                      backgroundColor: color.light,
                      borderBottomColor: color.primary + "20",
                    }}
                  >
                    {queue?.nm_dokter ? (
                      <div>
                        <p className="font-bold text-gray-800 text-xl leading-tight">
                          {queue.nm_dokter}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Tidak ada dokter
                      </p>
                    )}
                  </div>
                  <div className="py-8 justify-center">
                    {queue ? (
                      <div className="text-center">
                        <div
                          className="inline-flex items-center justify-center w-40 h-40 rounded-full text-white text-7xl font-bold shadow-lg transform hover:scale-110 transition-all duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
                          }}
                        >
                          {queue.no_reg}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: color.light }}
                        >
                          <div
                            className="w-6 h-6 rounded-full opacity-50"
                            style={{ backgroundColor: color.primary }}
                          ></div>
                        </div>
                        <p className="text-gray-500 font-medium text-sm">
                          Tidak ada antrian
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed top-16 right-8 w-4 h-4 bg-blue-200 rounded-full animate-bounce opacity-20"></div>
      <div className="fixed top-32 right-24 w-3 h-3 bg-green-200 rounded-full animate-pulse opacity-20"></div>
      <div className="fixed bottom-16 left-8 w-5 h-5 bg-purple-100 rounded-full animate-ping opacity-10"></div>
    </div>
  );
}