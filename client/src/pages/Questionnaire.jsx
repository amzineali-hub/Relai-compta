import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const SOFTWARES = ["Sage", "Odoo", "Cegid", "EBP", "Khabir", "Autre"];
const DOSSIERS = ["1–15", "16–50", "50+"];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [cabinetName, setCabinetName] = useState("");
  const [city, setCity] = useState("");
  const [softwareUsed, setSoftwareUsed] = useState(["Sage"]);
  const [dossiersRange, setDossiersRange] = useState("16–50");
  const [interestScore, setInterestScore] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function toggleSoftware(s) {
    setSoftwareUsed((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function handleSubmit() {
    if (!cabinetName || !city) {
      setError("Le nom du cabinet et la ville sont requis.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.submitQuestionnaire({ cabinetName, city, softwareUsed, dossiersRange, interestScore });
      navigate("/merci");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <div className="eyebrow" style={{ marginBottom: 6 }}>2 minutes</div>
      <h2 className="section-title">Votre avis de terrain</h2>
      <p className="section-sub">Vos réponses nous aident à construire un outil qui répond vraiment à vos besoins.</p>

      <div style={{ marginBottom: 20 }}>
        <label className="form-label">Nom du cabinet <span style={{ color: "var(--ocre)" }}>*</span></label>
        <input type="text" placeholder="Ex. Cabinet Alaoui & Associés" value={cabinetName} onChange={(e) => setCabinetName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label className="form-label">Ville <span style={{ color: "var(--ocre)" }}>*</span></label>
        <input type="text" placeholder="Ex. Casablanca" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label className="form-label">Logiciel comptable utilisé <span style={{ fontWeight: 400, color: "var(--text-dim)", fontSize: 11 }}>(plusieurs choix possibles)</span></label>
        <div className="chip-group">
          {SOFTWARES.map((s) => (
            <span key={s} className={`chip${softwareUsed.includes(s) ? " checked" : ""}`} onClick={() => toggleSoftware(s)}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label className="form-label">Nombre de dossiers clients gérés</label>
        <div className="chip-group">
          {DOSSIERS.map((d) => (
            <span key={d} className={`chip${dossiersRange === d ? " checked" : ""}`} onClick={() => setDossiersRange(d)}>{d}</span>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label className="form-label">Intérêt pour cet outil</label>
        <div className="chip-group">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`chip${interestScore === n ? " checked" : ""}`} style={{ borderRadius: 3, textAlign: "center", minWidth: 36 }} onClick={() => setInterestScore(n)}>{n}</span>
          ))}
        </div>
      </div>

      {error && <div className="export-note" style={{ background: "#FBF0EA", borderColor: "#C0713E", color: "#8A4B22" }}>{error}</div>}

      <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Envoi…" : "Envoyer mes réponses"}
      </button>
    </div>
  );
}
