import { Link } from "react-router-dom";

export default function DeclarationTVA() {
  return (
    <div className="screen">
      <Link to="/client"><button className="btn-secondary" style={{ marginBottom: 14 }}>← Retour à mon suivi</button></Link>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Cabinet Alaoui & Associés</div>
      <h2 className="section-title">Déclaration TVA — juillet 2026</h2>
      <p className="section-sub">Régime mensuel — échéance le 20 du mois suivant</p>
      <div className="extract-table">
        <div className="extract-row"><span className="label">TVA collectée</span><span className="value">17 280,00 MAD</span></div>
        <div className="extract-row"><span className="label">TVA déductible</span><span className="value">10 420,00 MAD</span></div>
        <div className="extract-row"><span className="label">TVA due</span><span className="tag">6 860,00 MAD</span></div>
        <div className="extract-row"><span className="label">Date limite de dépôt</span><span className="value">20/08/2026</span></div>
        <div className="extract-row"><span className="label">Statut</span><span className="tag warn">En attente de dépôt</span></div>
      </div>
      <div className="export-note">↳ Déclaration préparée par le cabinet, en attente de dépôt sur simpl-IR/simpl-TVA</div>
      <div className="cta-group">
        <button className="btn-primary">Télécharger le justificatif</button>
        <button className="btn-secondary">Voir le détail des lignes</button>
      </div>
    </div>
  );
}
