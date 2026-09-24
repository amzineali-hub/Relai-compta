import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";

// Contenu illustratif (données fictives) — reprend la maquette relaicompta-demo.html à
// l'identique. Sert à montrer à un cabinet prospect à quoi ressemblerait la lecture automatique ;
// aucune vraie extraction/OCR derrière.
const DOCS = {
  facture_fournisseur: {
    icon: "🧾", name: "Facture fournisseur", hint: "Achat, TVA, charge",
    file: "facture_electro_plus_0847.pdf", sub: "Exemple : facture fournisseur avec TVA 20%",
    rows: [
      ["Tiers", "Electro Plus SARL"],
      ["Date", "12/08/2026"],
      ["Montant HT", "4 250,00 MAD"],
      ["TVA (20%)", "850,00 MAD"],
      ["Montant TTC", "5 100,00 MAD"],
      ["Compte proposé", "6125 — Fournitures", true],
    ],
    note: "↳ Fichier d'import prêt pour Sage 100 — aperçu simulé pour cette démo",
  },
  facture_client: {
    icon: "📄", name: "Facture client", hint: "Vente, produit",
    file: "facture_vente_client_0212.pdf", sub: "Exemple : facture de vente émise par le cabinet client",
    rows: [
      ["Client", "Riad Textile SARL"],
      ["Date", "10/08/2026"],
      ["Montant HT", "12 000,00 MAD"],
      ["TVA (20%)", "2 400,00 MAD"],
      ["Montant TTC", "14 400,00 MAD"],
      ["Compte proposé", "7121 — Ventes de biens", true],
    ],
    note: "↳ Fichier d'import prêt pour Sage 100 — aperçu simulé pour cette démo",
  },
  releve_bancaire: {
    icon: "🏦", name: "Relevé bancaire", hint: "Plusieurs mouvements",
    file: "releve_attijari_juillet2026.pdf", sub: "Exemple : relevé avec plusieurs mouvements sur la période",
    rows: [
      ["Banque", "Attijariwafa Bank"],
      ["Période", "01/07/2026 – 31/07/2026"],
      ["Mouvements détectés", "23 lignes"],
      ["Total débits", "48 320,00 MAD"],
      ["Total crédits", "61 500,00 MAD"],
      ["Compte proposé", "5141 — Banque", true],
    ],
    note: "↳ Rapprochement bancaire pré-rempli — aperçu simulé pour cette démo",
    recon: [
      ["Virement client Riad Textile", "+14 400,00 MAD", "Rapproché ✓", false],
      ["Prélèvement Electro Plus", "-5 100,00 MAD", "Rapproché ✓", false],
      ["Frais bancaires", "-45,00 MAD", "Non rapproché", true],
    ],
  },
  bulletin_paie: {
    icon: "👤", name: "Bulletin de paie", hint: "Brut, CNSS, IR, net",
    file: "paie_khadija_b_aout2026.pdf", sub: "Exemple : bulletin de paie mensuel",
    rows: [
      ["Employé", "Khadija B."],
      ["Période", "Août 2026"],
      ["Salaire brut", "8 500,00 MAD"],
      ["Cotisations CNSS", "374,00 MAD"],
      ["IR retenu", "612,00 MAD"],
      ["Net à payer", "7 514,00 MAD"],
      ["Comptes proposés", "6171 / 4441 / 4432", true],
    ],
    note: "↳ Écriture de paie prête pour import — aperçu simulé pour cette démo",
  },
  note_frais: {
    icon: "📸", name: "Note de frais", hint: "Photo, qualité variable",
    file: "photo_note_frais_taxi.jpg", sub: "Exemple : photo prise au téléphone par un collaborateur",
    rows: [
      ["Employé", "Yassine M."],
      ["Date", "09/08/2026"],
      ["Nature", "Déplacement — taxi"],
      ["Montant TTC", "85,00 MAD"],
      ["Justificatif", "Photo jointe"],
      ["Compte proposé", "6251 — Déplacements", true],
    ],
    note: "↳ Lecture par IA vision (photo) — qualité correcte, aucune vérification requise",
  },
  ticket_caisse: {
    icon: "🧻", name: "Ticket de caisse", hint: "Petit montant, non structuré",
    file: "ticket_papeterie_scan.jpg", sub: "Exemple : petit ticket, format peu structuré",
    rows: [
      ["Commerçant", "Papeterie Al Amal"],
      ["Date", "11/08/2026"],
      ["Montant TTC", "42,00 MAD"],
      ["Compte proposé", "6064 — Fournitures bureau", true],
    ],
    note: "⚠ Lecture partielle — qualité image faible, vérification conseillée",
    warn: true,
  },
};

export default function CabinetView() {
  const { cabinetId = "demo-cabinet", clientId = "demo-client" } = useParams();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedKey, setSelectedKey] = useState(null);
  const [tested, setTested] = useState(new Set());

  useEffect(() => {
    api.getDocuments(cabinetId, clientId)
      .then(setDocs)
      .catch((err) => setErrorMsg(err.message));
  }, [cabinetId, clientId]);

  function showDoc(key) {
    setSelectedKey(key);
    setTested((prev) => new Set(prev).add(key));
  }

  const current = selectedKey ? DOCS[selectedKey] : null;
  const anyTested = tested.size > 0;
  const allDone = Object.keys(DOCS).every((k) => tested.has(k));

  return (
    <div className="page-dashboard">
      <div className="dash-sidebar">
        <div className="dash-brand">Relai<span>Compta</span></div>
        <button className="nav-item on" onClick={() => setSelectedKey(null)}>📥 Documents</button>
        <button className="nav-item" onClick={() => showDoc("releve_bancaire")}>🏦 Rapprochement</button>
        <button className="nav-item">📤 Export</button>
        <Link className="nav-item" to="/questionnaire">📋 Questionnaire</Link>
        <Link className="nav-item" to="/client" style={{ marginTop: "auto" }}>← Espace client</Link>
      </div>

      <div className="dash-main">
        <div className="kpi-row">
          <div className="kpi-card green"><div className="kpi-num">24</div><div className="kpi-label">DOCUMENTS TRAITÉS CE MOIS</div></div>
          <div className="kpi-card orange"><div className="kpi-num">2</div><div className="kpi-label">EN ATTENTE DE VALIDATION</div></div>
          <div className="kpi-card red"><div className="kpi-num">1</div><div className="kpi-label">ALERTE QUALITÉ DE LECTURE</div></div>
          <div className="kpi-card blue"><div className="kpi-num">Sage 100</div><div className="kpi-label">CONNECTÉ AU LOGICIEL</div></div>
        </div>

        <div className="steps">
          <div className="step on">01 · Dépôt</div>
          <div className="step on">02 · Lecture</div>
          <div className="step on">03 · Classement</div>
          <div className="step">04 · Export</div>
        </div>

        {!current && (
          <>
            <h2 className="section-title" style={{ fontSize: 16 }}>Documents reçus</h2>
            {errorMsg && (
              <div className="export-note">
                ↳ {errorMsg.includes("non configurée") ? "Base de données pas encore connectée côté serveur." : errorMsg}
              </div>
            )}
            <div className="extract-table" style={{ marginBottom: 24 }}>
              {docs.length === 0 && !errorMsg && (
                <div className="extract-row"><span className="label">Aucun document reçu pour l'instant</span></div>
              )}
              {docs.map((d) => (
                <div className="extract-row" key={d.id}>
                  <span className="label">
                    {d.downloadUrl
                      ? <a href={d.downloadUrl} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>{d.fileName}</a>
                      : d.fileName}
                    {" "}<span style={{ color: "var(--text-dim)" }}>({d.docType.replace(/_/g, " ")})</span>
                  </span>
                  <span className="status-chip status-attente">{d.status}</span>
                </div>
              ))}
            </div>

            <h2 className="section-title">Choisissez un document à tester</h2>
            <p className="section-sub">Chaque type de pièce est lu et classé différemment</p>
            <div className="doc-grid">
              {Object.entries(DOCS).map(([key, d]) => (
                <button key={key} className={`doc-btn ${tested.has(key) ? "tested" : ""}`} onClick={() => showDoc(key)}>
                  <span className="icon">{d.icon}</span>
                  <span className="name">{d.name}</span>
                  <span className="hint">{d.hint}</span>
                  {tested.has(key) && <span className="done-mark">✓ testé</span>}
                </button>
              ))}
            </div>
            {anyTested && (
              <div style={{ marginTop: 18 }}>
                <div className="export-note">
                  ↳ {allDone
                    ? "Tous les documents ont été testés"
                    : `${tested.size} document${tested.size > 1 ? "s" : ""} testé${tested.size > 1 ? "s" : ""} — vous pouvez continuer ou en tester d'autres`}
                </div>
                <button className="btn-primary" onClick={() => navigate("/questionnaire")}>Terminé — passer au questionnaire</button>
              </div>
            )}
          </>
        )}

        {current && (
          <>
            <button className="back-link" onClick={() => setSelectedKey(null)}>← Choisir un autre document</button>
            <h2 className="section-title">{current.name}</h2>
            <p className="section-sub">{current.sub}</p>
            <div className="doc-card">
              <div className="doc-icon">{current.icon}</div>
              <div className="doc-name">{current.file}</div>
            </div>
            <h2 className="section-title" style={{ fontSize: 16 }}>Ce que le système a lu</h2>
            <div className="extract-table" style={{ marginBottom: current.recon ? 14 : 20 }}>
              {current.rows.map(([label, value, tag], i) => (
                <div className="extract-row" key={i}>
                  <span className="label">{label}</span>
                  <span className={`value${tag ? " tag" : ""}`}>{value}</span>
                </div>
              ))}
            </div>
            {current.recon && (
              <div style={{ marginBottom: 14 }}>
                <h2 className="section-title" style={{ fontSize: 14 }}>Rapprochement bancaire</h2>
                <div className="extract-table">
                  {current.recon.map(([label, amount, statusLabel, warn], i) => (
                    <div className="extract-row" key={i}>
                      <span className="label">{label} <span style={{ color: "var(--text-dim)" }}>({amount})</span></span>
                      <span
                        className="value"
                        style={{ background: warn ? "#C0713E" : "var(--zellige)", color: "#fff", padding: "2px 8px", borderRadius: 3, fontSize: 11 }}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={`export-note${current.warn ? " quality-warn" : ""}`}>{current.note}</div>
            <button className="btn-primary" onClick={() => setSelectedKey(null)}>← Retour aux documents</button>
          </>
        )}
      </div>
    </div>
  );
}
