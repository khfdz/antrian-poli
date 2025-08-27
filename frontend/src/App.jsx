import { useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Lorong1Page from "./pages/Lorong1Page";
import Lorong2Page from "./pages/Lorong2Page";
import PoliList from "./pages/PoliList";
import PoliDetail from "./pages/PoliDetail";
import LorongAnakPage from "./pages/LorongAnakPage";
import LorongAnakView from "./pages/LorongAnakView";

// buat koneksi socket global
const socket = io("http://localhost:1414"); // ganti sesuai URL backend

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket.io server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket.io server");
    });

    // listen event updateAntrian dari backend
    socket.on("updateAntrian", (data) => {
      console.log("📢 Event updateAntrian diterima:", data);
      // TODO: di sini kamu bisa trigger fetch ulang API atau update state global
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("updateAntrian");
    };
  }, []);

  return (
    <Router>
      <div>
        <h1>Sistem Antrian</h1>
        <nav>
          <ul>
            <li><Link to="/lorong1">Lorong 1</Link></li>
            <li><Link to="/lorong2">Lorong 2</Link></li>
            <li><Link to="/loronganak">Lorong Anak</Link></li>
            <li><Link to="/loronganak/view">Lorong Anak View</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/lorong1" element={<Lorong1Page />} />
          <Route path="/lorong2" element={<Lorong2Page />} />
          <Route path="/" element={<PoliList />} />
          <Route path="/poli/:poliName" element={<PoliDetail />} />
          <Route path="/loronganak" element={<LorongAnakPage />} />
          <Route path="/loronganak/view" element={<LorongAnakView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
