import { Router } from "express";
import { db } from "../firebase.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Crée un cabinet et son lien d'accès unique (V0 : pas de mot de passe, accès par lien)
router.post("/", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { name, city, softwareUsed = [], sizeRange } = req.body;
  if (!name) return res.status(400).json({ error: "Le nom du cabinet est requis" });

  const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
  const doc = await db.collection("cabinets").add({
    name, city, softwareUsed, sizeRange, slug,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    id: doc.id,
    slug,
    cabinetLink: `/c/${slug}`,
    clientLink: `/c/${slug}/client`,
  });
}));

// Récupère un cabinet par son slug (lien d'accès)
router.get("/:slug", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const snap = await db.collection("cabinets").where("slug", "==", req.params.slug).limit(1).get();
  if (snap.empty) return res.status(404).json({ error: "Cabinet introuvable" });
  const doc = snap.docs[0];
  res.json({ id: doc.id, ...doc.data() });
}));

// Liste les clients d'un cabinet (documents groupés par client côté cabinet — sans ça, tous les
// clients se retrouvaient mélangés dans une seule case "demo-client" fixe).
router.get("/:cabinetId/clients", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const snap = await db
    .collection("cabinets").doc(req.params.cabinetId)
    .collection("clients").orderBy("createdAt", "desc").get();
  res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}));

// Enregistre un nouveau client pour ce cabinet — son lien d'envoi de documents est
// /c/{cabinetId}/{clientId}, à transmettre directement au client.
router.post("/:cabinetId/clients", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Le nom du client est requis" });

  const ref = await db
    .collection("cabinets").doc(req.params.cabinetId)
    .collection("clients").add({ name, createdAt: new Date().toISOString() });

  res.status(201).json({ id: ref.id, name });
}));

export default router;
