import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="page home-page">
      <div>
        <div className="eyebrow">Cabinet d'expertise comptable</div>
        <h1 className="hero">Vos documents, lus et classés avant même d'arriver sur votre bureau.</h1>
        <p className="section-sub" style={{ fontSize: 15, lineHeight: 1.55 }}>
          Une démonstration : d'abord le point de vue de votre client, puis ce qui se passe côté cabinet une fois le document envoyé.
        </p>
      </div>
      <button className="btn-primary" onClick={() => navigate("/client")}>Découvrir la démo</button>
    </div>
  );
}
