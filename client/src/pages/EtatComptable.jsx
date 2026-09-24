import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api";

// Contenu illustratif (chiffres fictifs) — reprend la maquette relaicompta-demo.html à l'identique.
// Aucune logique comptable réelle derrière : pas de calcul, pas de lecture de document. Les deux
// actions (PDF, question) sont en revanche réelles : impression navigateur et message sauvegardé.
export default function EtatComptable() {
  const navigate = useNavigate();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [fromName, setFromName] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSendQuestion(e) {
    e.preventDefault();
    if (!question.trim() || sending) return;
    setSending(true);
    setErrorMsg("");
    try {
      await api.sendMessage("demo-cabinet", question.trim(), fromName.trim());
      setSent(true);
      setQuestion("");
      setShowQuestionForm(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page">
      <button className="back-link no-print" onClick={() => navigate("/client")}>← Retour à mon suivi</button>
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

      <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="btn-primary" onClick={() => window.print()}>Télécharger le PDF</button>
        <button className="btn-secondary" onClick={() => setShowQuestionForm((v) => !v)}>Poser une question au cabinet</button>
      </div>

      {showQuestionForm && (
        <form onSubmit={handleSendQuestion} className="no-print" style={{ marginTop: 14 }}>
          <label className="form-label">Votre nom</label>
          <input
            type="text"
            placeholder="Pour que le cabinet sache qui demande"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <label className="form-label">Votre question</label>
          <input
            type="text"
            placeholder="Ex. D'où vient la baisse de trésorerie ce mois-ci ?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          {errorMsg && <div className="export-note">↳ {errorMsg}</div>}
          <button type="submit" className="btn-primary" disabled={!question.trim() || sending}>
            {sending ? "Envoi…" : "Envoyer au cabinet"}
          </button>
        </form>
      )}

      {sent && (
        <div className="export-note no-print" style={{ marginTop: 14 }}>
          ↳ Question envoyée au cabinet — vous recevrez une réponse directement de leur part.
        </div>
      )}
    </div>
  );
}
