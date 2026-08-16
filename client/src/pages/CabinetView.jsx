import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DOCS } from "../data";

export default function CabinetView() {
  const [selected, setSelected] = useState(null);
  const [tested, setTested] = useState(new Set());
  const navigate = useNavigate();

  function pick(key) {
    setSelected(key);
    setTested((prev) => new Set(prev).add(key));
  }

  const anyTested = tested.size > 0;
  const allDone = Object.keys(DOCS).every((k) => tested.has(k));

  return (
    <div className="screen" style={{ padding: 0 }}>
      <div className="dashboard-shell">
        <div className="dash-sidebar">
          <div className="dash-brand">Relai<span>Compta</span></div>
          <button className="nav-item on">📥 Documents</button>
          <button className="nav-item" onClick={() => pick("releve_bancaire")}>🏦 Rapprochement</button>
          <button className="nav-item">📤 Export</button>
          <button className="nav-item" onClick={() => navigate("/questionnaire")}>📋 Questionnaire</button>
          <button className="nav-item" style={{ marginTop: "auto" }} onClick={() => navigate("/client")}>← Espace client</button>
        </div>

        <div className="dash-main" style={{ padding: "28px 24px" }}>
          <div className="kpi-row">
            <div className="kpi-card green"><div className="kpi-num">24</div><div className="kpi-label">DOCUMENTS TRAITÉS CE MOIS</div></div>
            <div className="kpi-card orange"><div className="kpi-num">2</div><div className="kpi-label">EN ATTENTE DE VALIDATION</div></div>
            <div className="kpi-card red"><div className="kpi-num">1</div><div className="kpi-label">ALERTE QUALITÉ DE LECTURE</div></div>
            <div className="kpi-card blue"><div className="kpi-num">Sage 100</div><div className="kpi-label">CONNECTÉ AU LOGICIEL</div></div>
          </div>

          {!selected && (
            <>
              <h2 className="section-title">Choisissez un document à tester</h2>
              <p className="section-sub">Chaque type de pièce est lu et classé différemment</p>
              <div className="doc-grid">
                {Object.entries(DOCS).map(([key, d]) => (
                  <button key={key} className={`doc-btn${tested.has(key) ? " tested" : ""}`} onClick={() => pick(key)}>
                    {tested.has(key) && <span style={{ position: "absolute", top: 8, right: 8, color: "var(--zellige)", fontWeight: 700, fontSize: 10 }}>✓ testé</span>}
                    <span className="icon">{d.icon}</span>
                    <span className="name">{d.name}</span>
                    <span className="hint">{d.sub}</span>
                  </button>
                ))}
              </div>
              {anyTested && (
                <div style={{ marginTop: 18 }}>
                  <div className="export-note">
                    ↳ {allDone ? "Tous les documents ont été testés" : `${tested.size} document${tested.size > 1 ? "s" : ""} testé${tested.size > 1 ? "s" : ""} — vous pouvez continuer ou en tester d'autres`}
                  </div>
                  <Link to="/questionnaire"><button className="btn-primary">Terminé — passer au questionnaire</button></Link>
                </div>
              )}
            </>
          )}

          {selected && (() => {
            const d = DOCS[selected];
            return (
              <>
                <button className="btn-secondary" style={{ marginBottom: 14 }} onClick={() => setSelected(null)}>← Retour aux documents</button>
                <h2 className="section-title">{d.name}</h2>
                <p className="section-sub">{d.sub}</p>
                <div className="extract-table" style={{ border: "1px dashed var(--zellige)", background: "var(--zellige-dim)", borderRadius: 4, padding: 20, textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 28 }}>{d.icon}</div>
                  <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>{d.file}</div>
                </div>
                <h2 className="section-title" style={{ fontSize: 16 }}>Ce que le système a lu</h2>
                <div className="extract-table">
                  {d.rows.map(([label, value, isTag], i) => (
                    <div className="extract-row" key={i}><span className="label">{label}</span><span className={isTag ? "tag" : "value"}>{value}</span></div>
                  ))}
                </div>
                {d.recon && (
                  <>
                    <h2 className="section-title" style={{ fontSize: 14 }}>Rapprochement bancaire</h2>
                    <div className="extract-table">
                      {d.recon.map(([label, amount, status, warn], i) => (
                        <div className="extract-row" key={i}>
                          <span className="label">{label} <span style={{ color: "var(--text-dim)" }}>({amount})</span></span>
                          <span className={warn ? "tag warn" : "tag"}>{status}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div className={`export-note${d.warn ? " warn" : ""}`} style={d.warn ? { background: "#FBF0EA", borderColor: "#C0713E", color: "#8A4B22" } : {}}>{d.note}</div>
                <button className="btn-primary" onClick={() => setSelected(null)}>← Retour aux documents</button>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
