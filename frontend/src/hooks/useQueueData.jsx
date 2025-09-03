import { useState, useEffect } from "react";
import { socket, debounce } from "../utils/socketUtils";

export const useQueueData = (poliList, date) => {
  const [latestQueue, setLatestQueue] = useState(null);
  const [standbyQueues, setStandbyQueues] = useState(
    poliList.reduce((acc, poli) => {
      acc[poli.kode] = null; // Use kode instead of nama
      return acc;
    }, {})
  );
  const [missedQueues, setMissedQueues] = useState(
    poliList.reduce((acc, poli) => {
      acc[poli.kode] = []; // Use kode instead of nama
      return acc;
    }, {})
  );
  const [shouldSpeak, setShouldSpeak] = useState(false);

  const fetchData = async (triggerFromSocket = false) => {
    try {
      const poliCodes = poliList.map((p) => p.kode).join(",");

      const queryParams = new URLSearchParams();
      queryParams.append("tanggal", date);
      queryParams.append("poli", poliCodes);
      queryParams.append("t", Date.now()); // Cache-busting

      const response = await fetch(
        `http://localhost:1414/api/reg-periksa?${queryParams.toString()}`
      );
      const result = await response.json();
      const records = Array.isArray(result) ? result : result.data || [];

      console.log("📥 Data dari API:", records);

      // Group data by kode instead of nm_poli
      const groupedData = poliList.reduce((acc, poli) => {
        acc[poli.kode] = records.filter((r) => r.kd_poli === poli.kode); // Filter by kd_poli
        return acc;
      }, {});
      console.log("🔀 Grouped data:", groupedData);

      // Find latest with status_panggil = 1
      let latest = null;
      Object.keys(groupedData).forEach((kode) => {
        groupedData[kode]
          .filter((r) => r.status_panggil === 1)
          .forEach((r) => {
            const ts = new Date(r.panggil_timestamp);
            if (isNaN(ts)) return;

            const latestTS = latest?.panggil_timestamp
              ? new Date(latest.panggil_timestamp)
              : new Date(0);
            if (!latest || ts > latestTS) {
              latest = { ...r, kd_poli: kode }; // Use kd_poli instead of nm_poli
            }
          });
      });
      console.log("📢 Sedang dipanggil (latest):", latest);

      // Standby: get active queue with status_panggil = 1
      const standbyData = {};
      poliList.forEach((poli) => {
        const standby = groupedData[poli.kode]
          .filter((r) => r.status_panggil === 1)
          .sort(
            (a, b) => new Date(b.panggil_timestamp) - new Date(a.panggil_timestamp)
          )[0];
        standbyData[poli.kode] = standby ? { ...standby } : null; // Use kode
      });
      console.log("⏳ Standby queues:", standbyData);

      // Missed: status_panggil = 3
      const missedData = {};
      poliList.forEach((poli) => {
        missedData[poli.kode] = groupedData[poli.kode].filter(
          (r) => r.status_panggil === 3
        ); // Use kode
      });
      console.log("❌ Panggilan terlewat:", missedData);

      setLatestQueue(latest ? { ...latest } : null);
      setStandbyQueues({ ...standbyData });
      setMissedQueues({ ...missedData });

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

  return { latestQueue, standbyQueues, missedQueues, shouldSpeak, setShouldSpeak };
};