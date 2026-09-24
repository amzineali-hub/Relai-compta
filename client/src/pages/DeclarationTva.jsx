import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Contenu illustratif (chiffres fictifs) — reprend la maquette relaicompta-demo.html à l'identique.
// Aucune logique fiscale réelle derrière : pas de calcul, pas de dépôt sur simpl-TVA.
export default function DeclarationTva() {
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="page">
      <button className="back-link no-print" onClick={() => navigate("/client")}>← Retour à mon suivi</button>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Cabinet Alaoui &amp; Associés</div>
      <h2 className="section-title">Déclaration TVA — juillet 2026</h2>
      <p className="section-sub">Régime mensuel — échéance le 20 du mois suivant</p>
      <div className="extract-table">
        <div className="extract-row"><span className="label">TVA collectée</span><span className="value">17 280,00 MAD</span></div>
        <div className="extract-row"><span className="label">TVA déductible</span><span className="value">10 420,00 MAD</span></div>
        <div className="extract-row"><span className="label">TVA due</span><span className="value tag">6 860,00 MAD</span></div>
        <div className="extract-row"><span className="label">Date limite de dépôt</span><span className="value">20/08/2026</span></div>
        <div className="extract-row"><span className="label">Statut</span><span className="status-chip status-attente">En attente de dépôt</span></div>
      </div>
      <div className="export-note">↳ Déclaration préparée par le cabinet, en attente de dépôt sur simpl-IR/simpl-TVA</div>

      <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="btn-primary" onClick={() => window.print()}>Télécharger le justificatif</button>
        <button className="btn-secondary" onClick={() => setShowDetail((v) => !v)}>
          {showDetail ? "Masquer le détail des lignes" : "Voir le détail des lignes"}
        </button>
      </div>

      {showDetail && (
        <div style={{ marginTop: 14 }}>
          <h2 className="section-title" style={{ fontSize: 14 }}>Détail par taux (exemple)</h2>
          <div className="extract-table">
            <div className="extract-row"><span className="label">Ventes soumises 20%</span><span className="value">86 400,00 MAD</span></div>
            <div className="extract-row"><span className="label">Achats déductibles 20%</span><span className="value">52 100,00 MAD</span></div>
          </div>
          <div className="export-note">↳ Répartition indicative par taux — le détail ligne à ligne réel dépendra des documents classés</div>
        </div>
      )}
    </div>
  );
}
