import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClientView from "./pages/ClientView";
import CabinetView from "./pages/CabinetView";
import Questionnaire from "./pages/Questionnaire";
import Thanks from "./pages/Thanks";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="topbar">
          <div className="mark">Relai<span>Compta</span></div>
          <div className="eyebrow">MVP</div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/client" element={<ClientView />} />
          <Route path="/c/:cabinetId/:clientId" element={<ClientView />} />
          <Route path="/cabinet" element={<CabinetView />} />
          <Route path="/cabinet/:cabinetId/:clientId" element={<CabinetView />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/merci" element={<Thanks />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
