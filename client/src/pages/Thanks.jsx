import { Link } from "react-router-dom";

export default function Thanks() {
  return (
    <div className="screen" style={{ alignItems: "center", textAlign: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 34, color: "var(--zellige)", fontFamily: "Fraunces, serif" }}>✓</div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: "var(--ink)", margin: 0, fontWeight: 700 }}>Merci pour votre temps</h1>
      <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
        Vos réponses sont enregistrées. Nous revenons vers vous dès les prochaines étapes du projet.
      </p>
      <Link to="/"><button className="btn-secondary" style={{ marginTop: 8, padding: "15px 28px", fontSize: 15 }}>← Revenir à l'accueil</button></Link>
    </div>
  );
}
