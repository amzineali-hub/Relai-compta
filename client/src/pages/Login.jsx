import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await login(email, password);
      navigate(location.state?.from || "/cabinet", { replace: true });
    } catch (err) {
      setErrorMsg("Email ou mot de passe incorrect.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="eyebrow">Espace cabinet</div>
      <h2 className="section-title">Connexion</h2>
      <p className="section-sub">Réservé aux cabinets — vos clients accèdent à leur espace par leur lien personnel, sans compte.</p>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Email</label>
        <input
          type="text" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@cabinet.ma" style={{ marginBottom: 16 }} autoComplete="username"
        />
        <label className="form-label">Mot de passe</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" style={{ marginBottom: 16 }} autoComplete="current-password"
        />
        {errorMsg && <div className="export-note">↳ {errorMsg}</div>}
        <button type="submit" className="btn-primary" disabled={submitting || !email || !password}>
          {submitting ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
