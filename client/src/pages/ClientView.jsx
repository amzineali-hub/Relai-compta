import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const STATUS_LABEL = { "reçu": "Reçu ✓", "en_lecture": "En lecture…", "classé": "Classée ✓" };
const STATUS_CLASS = { "reçu": "status-recu", "en_lecture": "status-attente", "classé": "status-recu" };

export default function ClientView() {
  const { cabinetId = "demo-cabinet", clientId = "demo-client" } = useParams();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [fileName, setFileName] = useState("");
  const [docType, setDocType] = useState("facture_fournisseur");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");

  async function loadDocs() {
    setStatus("loading");
    try {
      const data = await api.getDocuments(cabinetId, clientId);
      setDocs(data);
      setStatus("idle");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  useEffect(() => { loadDocs(); }, [cabinetId, clientId]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!fileName.trim()) return;
    try {
      await api.addDocument(cabinetId, clientId, { fileName, docType });
      setFileName("");
      loadDocs();
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="page">
      <div className="eyebrow">Côté client</div>
      <h2 className="section-title">Côté Client</h2>
      <p className="section-sub">Espace simple sur smartphone ou pc pour l'envoi de pièces et le suivi.</p>

      {status === "error" && (
        <div className="export-note">
          ↳ {errorMsg.includes("non configurée")
            ? "Base de données pas encore connectée — configure Firebase côté serveur pour activer le vrai dépôt de documents."
            : errorMsg}
        </div>
      )}

      <form onSubmit={handleUpload} style={{ marginBottom: 20 }}>
        <label className="form-label">Nom du fichier</label>
        <input
          type="text"
          placeholder="Ex. facture_electro_plus.pdf"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <div className="chip-group">
          {["facture_fournisseur", "facture_client", "releve_bancaire", "bulletin_paie", "note_frais", "ticket_caisse"].map((t) => (
            <span key={t} className={`chip ${docType === t ? "checked" : ""}`} onClick={() => setDocType(t)}>
              {t.replace(/_/g, " ")}
            </span>
          ))}
        </div>
        <button type="submit" className="btn-primary">📤 Envoyer le document</button>
      </form>

      <h2 className="section-title" style={{ fontSize: 15 }}>Documents envoyés</h2>
      <div className="extract-table">
        {status === "loading" && <div className="extract-row"><span className="label">Chargement…</span></div>}
        {status !== "loading" && docs.length === 0 && (
          <div className="extract-row"><span className="label">Aucun document envoyé pour l'instant</span></div>
        )}
        {docs.map((d) => (
          <div className="extract-row" key={d.id}>
            <span className="label">{d.fileName}</span>
            <span className={`status-chip ${STATUS_CLASS[d.status] || "status-attente"}`}>
              {STATUS_LABEL[d.status] || d.status}
            </span>
          </div>
        ))}
      </div>

      <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => navigate("/cabinet")}>
        Interface cabinet
      </button>
    </div>
  );
}
