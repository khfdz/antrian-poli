import React from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LorongAnakPage from "./pages/LorongAnakPage";
import LorongAnakView from "./pages/LorongAnakView";
import PoliDetail from "./pages/PoliDetail";
import HomePage from "./pages/HomePage";
import "./index.css";

const socket = io("http://localhost:1414"); // backend kamu

function App() {
  useEffect(() => {
    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected"));
    socket.on("updateAntrian", () => console.log("📢 Event updateAntrian diterima"));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("updateAntrian");
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loronganak" element={<LorongAnakPage />} />
        <Route path="/loronganak/view" element={<LorongAnakView />} />
        <Route path="/poli/:poliCode/:date" element={<PoliDetail />} />
      </Routes>
    </Router>
  );
}

export default App;