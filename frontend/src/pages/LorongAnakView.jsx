import React, { useEffect, useState } from "react";
import TextToSpeech from "../components/TextToSpeech";
import Navbar from "../components/Navbar";
import QueueDisplay from "../components/QueueDisplay";
import StandbyQueueCard from "../components/StandbyQueueCard";
import { useQueueData } from "../hooks/useQueueData";

export default function LorongAnakView() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const date = "2025-07-13";

  const poliList = [
    { kode: "002", nama: "POLIKLINIK ANAK I" },
    { kode: "032", nama: "POLIKLINIK ANAK II" },
    { kode: "049", nama: "POLIKLINIK ANAK III" },
  ];

  const { latestQueue, missedQueues, standbyQueues, shouldSpeak, setShouldSpeak } =
    useQueueData(poliList, date);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPoliColor = (index) => {
    const colors = [
      { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" }, // Blue
      { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" },
      // { primary: "#10B981", secondary: "#059669", light: "#ECFDF5" }, // Green
      { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" }, // Purple
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
      <div className="flex-1 flex flex-col">
        <Navbar />
        <QueueDisplay latestQueue={latestQueue} missedQueues={missedQueues}/>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-3 h-[340px] ml-6 mr-6 ">
            {Object.entries(standbyQueues).map(([poli, queue], index) => (
              <StandbyQueueCard
                key={poli}
                poli={poli}
                queue={queue}
                color={getPoliColor(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}