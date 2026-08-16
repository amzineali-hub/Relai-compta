import { Link } from "react-router-dom";

export default function EtatComptable() {
  return (
    <div className="screen">
      <Link to="/client">
        <button className="btn-secondary" style={{ marginBottom: 14 }}>← Retour à mon suivi</button>
      </Link>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Cabinet Alaoui & Associés</div>
      <h2 className="section-title">État comptable — juillet 2026</h2>
      <p className="section-sub">Synthèse simplifiée de votre activité du mois</p>
      <div className="extract-table">
        <div className="extract-row"><span className="label">Chiffre d'affaires</span><span className="value">86 400,00 MAD</span></div>
        <div className="extract-row"><span className="label">Charges du mois</span><span className="value">52 100,00 MAD</span></div>
        <div className="extract-row"><span className="label">Résultat net estimé</span><span className="tag">+34 300,00 MAD</span></div>
        <div className="extract-row"><span className="label">Trésorerie disponible</span><span className="value">128 750,00 MAD</span></div>
        <div className="extract-row"><span className="label">Statut de clôture</span><span className="value">Provisoire — non clôturé</span></div>
      </div>
      <div className="export-note">↳ Chiffres indicatifs, sous réserve de validation finale par votre expert-comptable</div>
      <div className="cta-group">
        <button className="btn-primary">Télécharger le PDF</button>
        <button className="btn-secondary">Poser une question au cabinet</button>
      </div>
    </div>
  );
}
