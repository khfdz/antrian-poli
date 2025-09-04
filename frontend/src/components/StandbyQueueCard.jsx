import React from "react";

export default function StandbyQueueCard({ poliName, queue, color, styleType }) {
    // Define Style A (original style)
    const styleA = {
        container: "bg-white h-[330px] rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 flex flex-col",
        header: {
            className: "px-2 py-2 text-white font-bold text-center relative",
            background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
        },
        overlay: "absolute inset-0 bg-white/10 animate-pulse",
        title: "relative z-10 text-2xl leading-tight",
        doctorSection: {
            className: "px-2 py-4 text-center border-b-2",
            backgroundColor: color.light,
            borderBottomColor: `${color.primary}20`,
        },
        doctorText: "font-bold text-gray-800 text-xl leading-tight",
        noDoctorText: "text-md font-bold text-gray-500 italic",
        queueSection: "py-8 flex justify-center",
        queueNumber: {
            className: "inline-flex items-center justify-center w-35 h-35 rounded-full text-white text-6xl font-bold shadow-lg transform hover:scale-110 transition-all duration-300",
            background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
        },
        noQueueContainer: "text-center mt-8",
        noQueueCircleOuter: {
            className: "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
            backgroundColor: color.light,
        },
        noQueueCircleInner: {
            className: "w-6 h-6 rounded-full opacity-50",
            backgroundColor: color.primary,
        },
        noQueueText: "text-gray-500 font-medium text-xl",
    };

    // Define Style B (initially a copy of Style A, customizable)
    const styleB = {
        container: "bg-white h-[200px] rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 flex flex-col", // Customize container style here
        header: {
            className: "px-2 py-2 text-white font-bold text-center relative",
            background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`, // Customize header gradient or colors
        },
        overlay: "absolute inset-0 bg-white/10 animate-pulse", // Customize overlay opacity or animation
        title: "relative z-10 text-xl leading-tight", // Customize title font size or style
        doctorSection: {
            className: "px-1 py-1 text-center border-b-2",
            backgroundColor: color.light, // Customize background color
            borderBottomColor: `${color.primary}20`, // Customize border color
        },
        doctorText: "font-bold text-gray-800 text-xl leading-tight", // Customize doctor text style
        noDoctorText: "text-md font-bold text-gray-500 italic", // Customize no-doctor text style
        queueSection: "py-6 flex justify-center", // Customize queue section padding
        queueNumber: {
            className: "inline-flex items-center justify-center text-gray-700 rounded-full text-6xl font-bold transform hover:scale-110 transition-all duration-300",
             // Customize queue number gradient
        },
        noQueueContainer: "text-center mt-2", // Customize no-queue container margin
        noQueueCircleOuter: {
            className: "w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-3",
            backgroundColor: color.light, // Customize outer circle color
        },
        noQueueCircleInner: {
            className: "w-3 h-3 rounded-full opacity-50",
            backgroundColor: color.primary, // Customize inner circle color
        },
        noQueueText: "text-gray-500 font-medium text-xl", // Customize no-queue text style
    };

    // Select style based on styleType prop
    const selectedStyle = styleType === "B" ? styleB : styleA;

    return (
        <div className={selectedStyle.container}>
            <div
                className={selectedStyle.header.className}
                style={{ background: selectedStyle.header.background }}
            >
                <div className={selectedStyle.overlay}></div>
                <div className={selectedStyle.title}>{poliName}</div>
            </div>
            <div
                className={selectedStyle.doctorSection.className}
                style={{
                    backgroundColor: selectedStyle.doctorSection.backgroundColor,
                    borderBottomColor: selectedStyle.doctorSection.borderBottomColor,
                }}
            >
                {queue?.nm_dokter ? (
                    <p className={selectedStyle.doctorText}>{queue.nm_dokter}</p>
                ) : (
                    <p className={selectedStyle.noDoctorText}>---</p>
                )}
            </div>
            <div className={selectedStyle.queueSection}>
                {queue ? (
                    <div className="text-center">
                        <div
                            className={selectedStyle.queueNumber.className}
                            style={{ background: selectedStyle.queueNumber.background }}
                        >
                            {queue.no_reg}
                        </div>
                    </div>
                ) : (
                    <div className={selectedStyle.noQueueContainer}>
                        <div
                            className={selectedStyle.noQueueCircleOuter.className}
                            style={{ backgroundColor: selectedStyle.noQueueCircleOuter.backgroundColor }}
                        >
                            <div
                                className={selectedStyle.noQueueCircleInner.className}
                                style={{ backgroundColor: selectedStyle.noQueueCircleInner.backgroundColor }}
                            ></div>
                        </div>
                        <p className={selectedStyle.noQueueText}>Tidak ada antrian</p>
                    </div>
                )}
            </div>
        </div>
    );
}