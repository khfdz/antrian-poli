import React, { useEffect, useState } from 'react';
import TextToSpeech from '../components/TextToSpeech';
import Navbar from '../components/Navbar';
import QueueDisplay from '../components/QueueDisplay';
import StandbyQueueCard from '../components/StandbyQueueCard';
import { useQueueData } from '../hooks/useQueueData';

export default function LorongUmumView() {
    const [currentTime, setCurrentTime] = useState(new Date());

    const date = "2025-08-13";

    const poliList = [
    { kode: "001", nama: "POLIKLINIK OBSGYN/KANDUNGAN I" },
    { kode: "044", nama: "POLIKLINIK OBSGYN/KANDUNGAN II" },
    { kode: "004", nama: "POLIKLINIK UMUM" },
    { kode: "009", nama: "POLIKLINIK THT" },
    { kode: "012", nama: "POLIKLINIK GIGI I" },
    { kode: "041", nama: "POLIKLINIK GIGI II" },
];

    const { latestQueue, missedQueues, standbyQueues, shouldSpeak, setShouldSpeak } =
        useQueueData(poliList, date);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

   const getPoliColor = (index) => {
    const colors = [
        { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" },
        { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" },
        { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" },
        { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" },
        { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" },
        { primary: "#3B82F6", secondary: "#1D4ED8", light: "#EBF4FF" },
    ];
    return colors[index % colors.length];
};

    return (
        <div className='h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 overflow-hidden flex flex-col'>
            {shouldSpeak && latestQueue && (
                <TextToSpeech
                    queue={latestQueue}
                    onEnd={() => {
                        console.log("🔇 TextToSpeech ended");
                        setShouldSpeak(false);
                    }}
                />
            )}
            <div className='flex-1 flex flex-col'>
                <Navbar />
                <QueueDisplay latestQueue={latestQueue} missedQueues={missedQueues} />
                <div className='flex-1'>
                    <div className='grid grid-cols-3 gap-3 h-[340px] ml-6 mr-6'>
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
    )
}