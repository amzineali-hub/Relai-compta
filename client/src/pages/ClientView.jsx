import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";

const STATUS_LABEL = { "reçu": "Reçu ✓", "en_lecture": "En lecture…", "classé": "Classée ✓" };
const STATUS_CLASS = { "reçu": "status-recu", "en_lecture": "status-attente", "classé": "status-recu" };

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/heic"];

export default function ClientView() {
  const { cabinetId = "demo-cabinet", clientId = "demo-client" } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("docs"); // docs | suivi (onglets mobile — les deux colonnes sont visibles ensemble à partir de 900px)
  const [docs, setDocs] = useState([]);
  const [docType, setDocType] = useState("facture_fournisseur");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

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

  async function uploadFile(file) {
    if (!file || uploading) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg("Format non accepté — seuls les PDF, JPG et PNG sont acceptés.");
      setStatus("error");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);
      await api.addDocument(cabinetId, clientId, formData);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadDocs();
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    uploadFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="page">
      <div className="eyebrow">Côté client</div>
      <h2 className="section-title">Côté Client</h2>
      <p className="section-sub">Espace simple sur smartphone ou pc pour l'envoi de pièces et le suivi.</p>

      {status === "error" && (
        <div className="export-note">
          ↳ {errorMsg.includes("non configurée")
            ? "Base de données ou stockage pas encore connecté — configure Firebase côté serveur pour activer le vrai dépôt de documents."
            : errorMsg}
        </div>
      )}

      <div className="tab-buttons">
        <button className={tab === "docs" ? "btn-primary" : "btn-secondary"} onClick={() => setTab("docs")}>
          📤 Envois documents
        </button>
        <button className={tab === "suivi" ? "btn-primary" : "btn-secondary"} onClick={() => setTab("suivi")}>
          📊 Mes états comptables
        </button>
      </div>

      <div className="client-grid">
        <div className={tab === "docs" ? "" : "panel-hidden"}>
          <h2 className="section-title panel-heading" style={{ fontSize: 15 }}>📤 Envois documents</h2>

          <div
            className="doc-card"
            style={{ cursor: "pointer", borderStyle: dragOver ? "dashed" : "solid" }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="doc-icon">📤</div>
            <div className="doc-name" style={{ marginBottom: 2 }}>
              {uploading ? "Envoi en cours…" : "Glissez un fichier ou prenez une photo"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>PDF, JPG, PNG acceptés</div>
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.heic"
            ref={fileInputRef}
            onChange={(e) => uploadFile(e.target.files?.[0])}
            style={{ display: "none" }}
          />

          <div className="chip-group">
            {["facture_fournisseur", "facture_client", "releve_bancaire", "bulletin_paie", "note_frais", "ticket_caisse"].map((t) => (
              <span key={t} className={`chip ${docType === t ? "checked" : ""}`} onClick={() => setDocType(t)}>
                {t.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          <h2 className="section-title" style={{ fontSize: 14 }}>Documents déjà envoyés</h2>
          <div className="extract-table">
            {status === "loading" && <div className="extract-row"><span className="label">Chargement…</span></div>}
            {status !== "loading" && docs.length === 0 && (
              <div className="extract-row"><span className="label">Aucun document envoyé pour l'instant</span></div>
            )}
            {docs.map((d) => (
              <div className="extract-row" key={d.id}>
                <span className="label">
                  {d.downloadUrl
                    ? <a href={d.downloadUrl} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>{d.fileName}</a>
                    : d.fileName}
                </span>
                <span className={`status-chip ${STATUS_CLASS[d.status] || "status-attente"}`}>
                  {STATUS_LABEL[d.status] || d.status}
                </span>
              </div>
            ))}
          </div>
          <div className="export-note">↳ Le client suit l'avancement sans jamais contacter le cabinet — moins de relances, moins d'oublis</div>
        </div>

        <div className={tab === "suivi" ? "" : "panel-hidden"}>
          <h2 className="section-title panel-heading" style={{ fontSize: 15 }}>📊 Mes états comptables</h2>

          <h2 className="section-title" style={{ fontSize: 14 }}>Pièces demandées — en attente</h2>
          <div className="extract-table">
            <div className="extract-row"><span className="label">Relevé bancaire — août</span><span className="status-chip status-attente">À envoyer</span></div>
            <div className="extract-row"><span className="label">Bulletin de paie — juillet</span><span className="status-chip status-attente">À envoyer</span></div>
          </div>

          <h2 className="section-title" style={{ fontSize: 14, marginTop: 18 }}>Honoraires</h2>
          <div className="extract-table">
            <div className="extract-row"><span className="label">Facture d'honoraires — août 2026</span><span className="value">3 000,00 MAD</span></div>
            <div className="extract-row"><span className="label">Échéance</span><span className="value">31/08/2026</span></div>
            <div className="extract-row"><span className="label">Statut</span><span className="value tag">En attente de paiement</span></div>
          </div>

          <h2 className="section-title" style={{ fontSize: 14, marginTop: 18 }}>Mes états et déclarations</h2>
          <div className="extract-table">
            <div className="extract-row" style={{ alignItems: "center" }}>
              <span className="label">📊 État comptable — juillet 2026</span>
              <Link to="/client/etat" className="btn-primary" style={{ width: "auto", padding: "8px 16px", fontSize: 12 }}>Consulter →</Link>
            </div>
            <div className="extract-row" style={{ alignItems: "center" }}>
              <span className="label">🧾 Déclaration TVA — juillet 2026</span>
              <Link to="/client/tva" className="btn-primary" style={{ width: "auto", padding: "8px 16px", fontSize: 12 }}>Consulter →</Link>
            </div>
          </div>
          <div className="export-note">↳ Le client voit ce que le cabinet produit pour lui, sans avoir à le demander</div>
        </div>
      </div>

      <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => navigate("/cabinet")}>
        Interface cabinet
      </button>
    </div>
  );
}
