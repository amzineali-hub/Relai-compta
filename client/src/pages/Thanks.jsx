import { useNavigate } from "react-router-dom";

export default function Thanks() {
  const navigate = useNavigate();
  return (
    <div className="page" style={{ textAlign: "center", paddingTop: 60 }}>
      <div style={{ fontSize: 34, color: "var(--zellige)", fontFamily: "'Fraunces', serif" }}>✓</div>
      <h1 className="hero" style={{ fontSize: 24 }}>Merci pour votre temps</h1>
      <p className="section-sub">Vos réponses sont enregistrées. Nous revenons vers vous dès les prochaines étapes du projet.</p>
      <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => navigate("/")}>← Revenir à l'accueil</button>
    </div>
  );
}
