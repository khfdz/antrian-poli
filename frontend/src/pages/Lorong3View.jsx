import React, { useEffect, useState } from 'react';
import TextToSpeech from '../components/TextToSpeech';
import Navbar from '../components/Navbar';
import QueueDisplay from '../components/QueueDisplay';
import StandbyQueueCard from '../components/StandbyQueueCard';
import { useQueueData } from '../hooks/useQueueData';

export default function Lorong3View() {
    const [currentTime, setCurrentTime] = useState(new Date());

    const date = "2025-01-02";

    const poliList = [
        { kode: "008", nama: "POLIKLINIK MATA" },
        { kode: "069", nama: "POLIKLINIK TEST" },
        { kode: "010", nama: "POLIKLINIK KULIT & KELAMIN" },
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
        ];
        return colors[index % colors.length];
    };

    // Karena cuma 3 poli, otomatis styleType = "A"
    const styleType = poliList.length > 3 ? "B" : "A";

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
                    <div className='grid grid-cols-3 gap-x-8 gap-y-4 h-[340px] ml-12 mr-12'>
                        {Object.entries(standbyQueues).map(([poli, queue], index) => {
                            const poliData = poliList.find(p => p.kode === poli);
                            return (
                                <StandbyQueueCard
                                    key={poli}
                                    poliName={poliData ? poliData.nama : poli}
                                    queue={queue}
                                    color={getPoliColor(index)}
                                    styleType={styleType}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
