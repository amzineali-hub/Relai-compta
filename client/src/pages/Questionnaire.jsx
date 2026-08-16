import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const SOFTWARE_OPTIONS = ["Sage", "Odoo", "Cegid", "EBP", "Khabir", "Autre"];
const DOSSIER_RANGES = ["1–15", "16–50", "50+"];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [cabinetName, setCabinetName] = useState("");
  const [city, setCity] = useState("");
  const [softwareUsed, setSoftwareUsed] = useState([]);
  const [dossiersRange, setDossiersRange] = useState("");
  const [interestScore, setInterestScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function toggleSoftware(name) {
    setSoftwareUsed((prev) => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cabinetName.trim() || !city.trim()) return;
    setSubmitting(true);
    try {
      await api.submitQuestionnaire({ cabinetName, city, softwareUsed, dossiersRange, interestScore });
      navigate("/merci");
    } catch (err) {
      setErrorMsg(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="eyebrow">2 minutes</div>
      <h2 className="section-title">Votre avis de terrain</h2>
      <p className="section-sub">Vos réponses nous aident à construire un outil qui répond vraiment à vos besoins.</p>

      {errorMsg && (
        <div className="export-note">
          ↳ {errorMsg.includes("non configurée") ? "Base de données pas encore connectée côté serveur." : errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="form-label">Nom du cabinet *</label>
        <input type="text" value={cabinetName} onChange={(e) => setCabinetName(e.target.value)}
          placeholder="Ex. Cabinet Alaoui & Associés" style={{ marginBottom: 16 }} />

        <label className="form-label">Ville *</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
          placeholder="Ex. Casablanca" style={{ marginBottom: 16 }} />

        <label className="form-label">Logiciel comptable utilisé (plusieurs choix possibles)</label>
        <div className="chip-group">
          {SOFTWARE_OPTIONS.map((s) => (
            <span key={s} className={`chip ${softwareUsed.includes(s) ? "checked" : ""}`} onClick={() => toggleSoftware(s)}>{s}</span>
          ))}
        </div>

        <label className="form-label">Nombre de dossiers clients gérés</label>
        <div className="chip-group">
          {DOSSIER_RANGES.map((r) => (
            <span key={r} className={`chip ${dossiersRange === r ? "checked" : ""}`} onClick={() => setDossiersRange(r)}>{r}</span>
          ))}
        </div>

        <label className="form-label">Intérêt pour cet outil</label>
        <div className="chip-group">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`chip ${interestScore === n ? "checked" : ""}`} onClick={() => setInterestScore(n)}>{n}</span>
          ))}
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Envoi…" : "Envoyer mes réponses"}
        </button>
      </form>
    </div>
  );
}
