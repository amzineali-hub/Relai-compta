import admin from "../firebase.js";

// Vérifie le jeton Firebase envoyé par le client cabinet (Authorization: Bearer <idToken>).
// Ne protège que les routes réservées au cabinet (liste/création de clients) — le dépôt de
// documents par lien reste accessible sans compte, c'est le modèle prévu pour les clients externes.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Authentification requise" });

  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: "Session invalide ou expirée, reconnectez-vous" });
  }
}
