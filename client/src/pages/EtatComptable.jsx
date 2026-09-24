import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Contenu illustratif (chiffres fictifs) — reprend la maquette relaicompta-demo.html à l'identique.
// Aucune logique comptable réelle derrière : pas de calcul, pas de lecture de document.
export default function EtatComptable() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState(false);

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate("/client")}>← Retour à mon suivi</button>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Cabinet Alaoui &amp; Associés</div>
      <h2 className="section-title">État comptable — juillet 2026</h2>
      <p className="section-sub">Synthèse simplifiée de votre activité du mois</p>
      <div className="extract-table">
        <div className="extract-row"><span className="label">Chiffre d'affaires</span><span className="value">86 400,00 MAD</span></div>
        <div className="extract-row"><span className="label">Charges du mois</span><span className="value">52 100,00 MAD</span></div>
        <div className="extract-row"><span className="label">Résultat net estimé</span><span className="value tag">+34 300,00 MAD</span></div>
        <div className="extract-row"><span className="label">Trésorerie disponible</span><span className="value">128 750,00 MAD</span></div>
        <div className="extract-row"><span className="label">Statut de clôture</span><span className="value">Provisoire — non clôturé</span></div>
      </div>
      <div className="export-note">↳ Chiffres indicatifs, sous réserve de validation finale par votre expert-comptable</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="btn-primary" onClick={() => setNotice(true)}>Télécharger le PDF</button>
        <button className="btn-secondary" onClick={() => setNotice(true)}>Poser une question au cabinet</button>
      </div>
      {notice && <div className="export-note" style={{ marginTop: 14 }}>↳ Fonctionnalité de démonstration — disponible dans une prochaine version.</div>}
    </div>
  );
}
