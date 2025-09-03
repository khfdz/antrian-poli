// App.jsx
import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LorongAnakPage from "./pages/LorongAnakPage";
import LorongAnakView from "./pages/LorongAnakView";
import LorongUmumView from "./pages/LorongUmumView"
import PoliDetail from "./pages/PoliDetail";
import HomePage from "./pages/HomePage";
import "./index.css";

const socket = io("http://localhost:1414", { // Ganti ke "wss://localhost:1414" jika HTTPS
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function App() {
  useEffect(() => {
    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("connect_error", (error) => console.error("❌ Socket connect error:", error.message));
    socket.on("disconnect", () => console.log("❌ Disconnected"));
    socket.on("updateAntrian", (data) => console.log("📢 Event updateAntrian diterima:", data));

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("updateAntrian");
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loronganak" element={<LorongAnakPage />} />
        <Route path="/loronganak/view" element={<LorongAnakView socket={socket} />} />
        <Route path="/lorongumum/view" element={<LorongUmumView socket={socket} />} />
        <Route path="/poli/:poliCode/:date" element={<PoliDetail socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;