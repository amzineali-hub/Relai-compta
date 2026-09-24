import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import ClientView from "./pages/ClientView";
import CabinetView from "./pages/CabinetView";
import EtatComptable from "./pages/EtatComptable";
import DeclarationTva from "./pages/DeclarationTva";
import Questionnaire from "./pages/Questionnaire";
import Thanks from "./pages/Thanks";
import Login from "./pages/Login";
import "./styles/global.css";

// La vue cabinet donne accès à tous les clients d'un cabinet (liste, création) — le dépôt de
// documents par lien reste, lui, accessible sans compte, c'est le modèle prévu pour les clients.
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page">Chargement…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <div className="topbar">
            <Link to="/" className="mark" style={{ textDecoration: "none" }}>Relai<span>Compta</span></Link>
            <div className="eyebrow">MVP</div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client" element={<ClientView />} />
            <Route path="/c/:cabinetId/:clientId" element={<ClientView />} />
            <Route path="/client/etat" element={<EtatComptable />} />
            <Route path="/client/tva" element={<DeclarationTva />} />
            <Route path="/cabinet" element={<RequireAuth><CabinetView /></RequireAuth>} />
            <Route path="/cabinet/:cabinetId/:clientId" element={<RequireAuth><CabinetView /></RequireAuth>} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/merci" element={<Thanks />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
