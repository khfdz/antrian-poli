import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }) + ' WIB';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Jakarta'
    });
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-4xl relative overflow-hidden rounded-xl mb-4">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-8 right-24 w-24 h-24 bg-white/10 rounded-full blur-lg animate-ping"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="flex justify-between items-center">
          {/* Left Side - Hospital Info */}
          <div className="flex items-center space-x-4">
            {/* Hospital Icon */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/30">
              <div className="text-3xl">🏥</div>
            </div>
            
            {/* Hospital Name */}
            <div>
              <h1 className="text-2xl font-black text-white leading-tight tracking-wide drop-shadow-lg">
                ANTRIAN POLIKLINIK
              </h1>
              <div className="text-lg font-bold text-blue-100 leading-tight">
                RS PERMATA KELUARGA KARAWANG
              </div>
            </div>
          </div>

          {/* Right Side - Date & Time */}
          <div className="text-center">
            {/* Time Display */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl py-1 shadow-xl border border-white/20 mb-2 transform hover:scale-105 transition-all duration-300">
              <div className="text-xl font-black text-white mb-1 drop-shadow-md">
                {formatTime(currentTime)}
              </div>
        
            </div>
            
            {/* Date Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20">
              <div className="text-lg font-bold text-white capitalize drop-shadow-md">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
      <div className="absolute top-8 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-4 right-1/4 w-2 h-2 bg-white/25 rounded-full animate-pulse"></div>
    </nav>
  );
};

export default Navbar;