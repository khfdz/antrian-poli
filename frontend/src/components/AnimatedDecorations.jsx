import React from "react";

export default function AnimatedDecorations() {
  return (
    <>
      <div className="fixed top-16 right-8 w-4 h-4 bg-blue-200 rounded-full animate-bounce opacity-20"></div>
      <div className="fixed top-32 right-24 w-3 h-3 bg-green-200 rounded-full animate-pulse opacity-20"></div>
      <div className="fixed bottom-16 left-8 w-5 h-5 bg-purple-100 rounded-full animate-ping opacity-10"></div>
    </>
  );
}