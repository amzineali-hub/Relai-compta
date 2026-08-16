import { useState } from "react";
import { Link } from "react-router-dom";

export default function ClientView() {
  const [tab, setTab] = useState("docs");

  return (
    <div className="screen">
      <div className="eyebrow" style={{ marginBottom: 6 }}>Côté client</div>
      <h2 className="section-title">Côté Client</h2>
      <p className="section-sub">Espace simple sur smartphone ou pc pour l'envoi de pièces et le suivi.</p>

      <div className="cta-group tab-buttons" style={{ flexDirection: "row", marginBottom: 20 }}>
        <button className={tab === "docs" ? "btn-primary" : "btn-secondary"} style={{ flex: 1, padding: "12px 8px", fontSize: 13 }} onClick={() => setTab("docs")}>📤 Envois documents</button>
        <button className={tab === "suivi" ? "btn-primary" : "btn-secondary"} style={{ flex: 1, padding: "12px 8px", fontSize: 13 }} onClick={() => setTab("suivi")}>📊 Mes états comptables</button>
      </div>

      <div className="client-grid">
        <div className={`client-panel${tab === "docs" ? "" : " panel-hidden"}`}>
          <h2 className="section-title panel-heading" style={{ fontSize: 15 }}>📤 Envois documents</h2>
          <div className="extract-table" style={{ border: "1px dashed var(--zellige)", background: "var(--zellige-dim)", borderRadius: 4, padding: 20, textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📤</div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>Glissez un fichier ou prenez une photo</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>PDF, JPG, PNG acceptés</div>
          </div>
          <h2 className="section-title" style={{ fontSize: 14 }}>Documents déjà envoyés</h2>
          <div className="extract-table">
            <div className="extract-row"><span className="label">Facture Electro Plus</span><span className="tag">Classée ✓</span></div>
            <div className="extract-row"><span className="label">Ticket Papeterie Al Amal</span><span className="tag warn">En lecture…</span></div>
            <div className="extract-row"><span className="label">Relevé Attijari — juillet</span><span className="tag">Reçu ✓</span></div>
          </div>
          <div className="export-note">↳ Le client suit l'avancement sans jamais contacter le cabinet — moins de relances, moins d'oublis</div>
        </div>

        <div className={`client-panel${tab === "suivi" ? "" : " panel-hidden"}`}>
          <h2 className="section-title panel-heading" style={{ fontSize: 15 }}>📊 Mes états comptables</h2>
          <h2 className="section-title" style={{ fontSize: 14 }}>Pièces demandées — en attente</h2>
          <div className="extract-table">
            <div className="extract-row"><span className="label">Relevé bancaire — août</span><span className="tag warn">À envoyer</span></div>
            <div className="extract-row"><span className="label">Bulletin de paie — juillet</span><span className="tag warn">À envoyer</span></div>
          </div>
          <h2 className="section-title" style={{ fontSize: 14, marginTop: 18 }}>Honoraires</h2>
          <div className="extract-table">
            <div className="extract-row"><span className="label">Facture d'honoraires — août 2026</span><span className="value">3 000,00 MAD</span></div>
            <div className="extract-row"><span className="label">Échéance</span><span className="value">31/08/2026</span></div>
            <div className="extract-row"><span className="label">Statut</span><span className="tag">En attente de paiement</span></div>
          </div>
          <h2 className="section-title" style={{ fontSize: 14, marginTop: 18 }}>Mes états et déclarations</h2>
          <div className="extract-table">
            <div className="extract-row" style={{ alignItems: "center" }}>
              <span className="label">📊 État comptable — juillet 2026</span>
              <Link to="/client/etat"><button className="btn-primary" style={{ padding: "8px 16px", fontSize: 12 }}>Consulter →</button></Link>
            </div>
            <div className="extract-row" style={{ alignItems: "center" }}>
              <span className="label">🧾 Déclaration TVA — juillet 2026</span>
              <Link to="/client/tva"><button className="btn-primary" style={{ padding: "8px 16px", fontSize: 12 }}>Consulter →</button></Link>
            </div>
          </div>
          <div className="export-note">↳ Le client voit ce que le cabinet produit pour lui, sans avoir à le demander</div>
        </div>
      </div>

      <Link to="/cabinet"><button className="btn-primary" style={{ marginTop: 20, width: "100%" }}>Interface cabinet</button></Link>
    </div>
  );
}
