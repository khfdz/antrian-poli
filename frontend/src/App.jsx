import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Lorong1Page from "./pages/Lorong1Page";
import Lorong2Page from "./pages/Lorong2Page";
import PoliList from "./pages/PoliList";
import PoliDetail from "./pages/PoliDetail";
import LorongAnakPage from "./pages/LorongAnakPage";
import LorongAnakView from "./pages/LorongAnakView";

function App() {
  return (
    <Router>
      <div>
        <h1>Sistem Antrian</h1>
        <nav>
          <ul>
            <li>
              <Link to="/lorong1">Lorong 1</Link>
            </li>
            <li>
              <Link to="/lorong2">Lorong 2</Link>
            </li>
            <li>
                            <Link to="/loronganak">Lorong Anak</Link>
            </li>
            <li>
                            <Link to="/loronganak/view">Lorong Anak View</Link>
            </li>
            <li></li>
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
