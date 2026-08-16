import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function CabinetView() {
  const { cabinetId = "demo-cabinet", clientId = "demo-client" } = useParams();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    api.getDocuments(cabinetId, clientId)
      .then(setDocs)
      .catch((err) => setErrorMsg(err.message));
  }, [cabinetId, clientId]);

  return (
    <div className="page">
      <div className="eyebrow">Vue cabinet</div>
      <h2 className="section-title">Documents reçus</h2>
      <p className="section-sub">Ce que vos clients ont envoyé, prêt à être lu et classé</p>

      {errorMsg && (
        <div className="export-note">
          ↳ {errorMsg.includes("non configurée")
            ? "Base de données pas encore connectée côté serveur."
            : errorMsg}
        </div>
      )}

      <div className="extract-table">
        {docs.length === 0 && !errorMsg && <div className="extract-row"><span className="label">Aucun document pour l'instant</span></div>}
        {docs.map((d) => (
          <div className="extract-row" key={d.id}>
            <span className="label">{d.fileName} <span style={{ color: "var(--text-dim)" }}>({d.docType.replace(/_/g, " ")})</span></span>
            <span className="status-chip status-attente">{d.status}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/questionnaire")}>
        Passer au questionnaire
      </button>
    </div>
  );
}
