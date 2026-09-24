import { Router } from "express";
import { db } from "../firebase.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth } from "../lib/requireAuth.js";

const router = Router();

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Crée un cabinet. Multi-cabinet en base (chaque cabinet a un id Firestore + un slug unique),
// mais le reste de l'app route encore tout sur le cabinet fixe "demo-cabinet" — cette route existe
// pour la base de données, pas encore pour un vrai flux d'auto-inscription (pas de route React
// pour /c/{slug} ni de page de connexion cabinet ; à construire avant d'exposer ceci publiquement).
router.post("/", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { name, city, softwareUsed = [], sizeRange } = req.body;
  if (!name) return res.status(400).json({ error: "Le nom du cabinet est requis" });

  const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
  const doc = await db.collection("cabinets").add({
    name, city, softwareUsed, sizeRange, slug,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ id: doc.id, slug });
}));

// Récupère un cabinet par son slug (lien d'accès)
router.get("/:slug", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const snap = await db.collection("cabinets").where("slug", "==", req.params.slug).limit(1).get();
  if (snap.empty) return res.status(404).json({ error: "Cabinet introuvable" });
  const doc = snap.docs[0];
  res.json({ id: doc.id, ...doc.data() });
}));

// Liste les clients d'un cabinet, avec leur nombre de documents reçus (comme les outils de
// gestion de cabinet classiques — Dext, Pennylane... — qui montrent l'activité en un coup d'œil
// plutôt qu'une simple liste de noms). Réservé au cabinet connecté : avant l'authentification,
// n'importe qui connaissant le cabinetId (public, utilisé dans toutes les URLs) pouvait voir
// la liste complète de ses clients.
router.get("/:cabinetId/clients", requireAuth, asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const snap = await db
    .collection("cabinets").doc(req.params.cabinetId)
    .collection("clients").orderBy("createdAt", "desc").get();

  const clients = await Promise.all(snap.docs.map(async (d) => {
    const docsCollection = db
      .collection("cabinets").doc(req.params.cabinetId)
      .collection("clients").doc(d.id)
      .collection("documents");
    const countSnap = await docsCollection.count().get();
    return { id: d.id, ...d.data(), documentCount: countSnap.data().count };
  }));

  res.json(clients);
}));

// Enregistre un nouveau client pour ce cabinet — son lien d'envoi de documents est
// /c/{cabinetId}/{clientId}, à transmettre directement au client. Réservé au cabinet connecté.
router.post("/:cabinetId/clients", requireAuth, asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Le nom du client est requis" });

  const ref = await db
    .collection("cabinets").doc(req.params.cabinetId)
    .collection("clients").add({ name, createdAt: new Date().toISOString() });

  res.status(201).json({ id: ref.id, name });
}));

// Enregistre une question envoyée par un client depuis son espace de suivi (ex. depuis la page
// État comptable). `from` est libre (le client tape son nom) : ces pages ne sont pas encore
// reliées à un clientId précis, donc pas d'identification automatique possible pour l'instant.
router.post("/:cabinetId/messages", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { text, from } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Le message est vide" });

  const ref = await db
    .collection("cabinets").doc(req.params.cabinetId)
    .collection("messages").add({
      text: text.trim(),
      from: (from || "").trim() || null,
      read: false,
      createdAt: new Date().toISOString(),
    });

  res.status(201).json({ id: ref.id });
}));

// Liste les questions reçues — jusqu'ici enregistrées mais jamais consultables nulle part côté
// cabinet, un vrai cul-de-sac pour un client qui pose une question. Réservé au cabinet connecté.
router.get("/:cabinetId/messages", requireAuth, asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const snap = await db
    .collection("cabinets").doc(req.params.cabinetId)
    .collection("messages").orderBy("createdAt", "desc").get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}));

// Marque une question comme lue. Réservé au cabinet connecté.
router.patch("/:cabinetId/messages/:messageId", requireAuth, asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  await db
    .collection("cabinets").doc(req.params.cabinetId)
    .collection("messages").doc(req.params.messageId)
    .update({ read: true });
  res.json({ ok: true });
}));

export default router;
