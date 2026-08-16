import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="screen">
      <div>
        <div className="eyebrow">Cabinet d'expertise comptable</div>
        <h1 className="hero-title">Vos documents, lus et classés avant même d'arriver sur votre bureau.</h1>
        <p className="section-sub" style={{ fontSize: 15, lineHeight: 1.55 }}>
          Une démonstration de 3 minutes : d'abord le point de vue de votre client, puis ce qui se passe côté cabinet une fois le document envoyé.
        </p>
      </div>
      <div style={{ marginTop: 28 }}>
        <div className="cta-group">
          <Link to="/client"><button className="btn-primary" style={{ width: "100%" }}>Découvrir la démo</button></Link>
        </div>
      </div>
    </div>
  );
}
