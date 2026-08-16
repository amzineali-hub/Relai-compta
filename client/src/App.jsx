import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ClientView from "./pages/ClientView";
import CabinetView from "./pages/CabinetView";
import EtatComptable from "./pages/EtatComptable";
import DeclarationTVA from "./pages/DeclarationTVA";
import Questionnaire from "./pages/Questionnaire";
import Thanks from "./pages/Thanks";

const LABELS = {
  "/": "Démo",
  "/client": "Vue client",
  "/cabinet": "Vue cabinet",
  "/client/etat": "État comptable",
  "/client/tva": "Déclaration TVA",
  "/questionnaire": "Étape finale",
  "/merci": "Terminé",
};

function TopBar() {
  const { pathname } = useLocation();
  return (
    <div className="topbar">
      <div className="mark">Relai<span>Compta</span></div>
      <div className="eyebrow">{LABELS[pathname] || "Démo"}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/client" element={<ClientView />} />
          <Route path="/client/etat" element={<EtatComptable />} />
          <Route path="/client/tva" element={<DeclarationTVA />} />
          <Route path="/cabinet" element={<CabinetView />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/merci" element={<Thanks />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
