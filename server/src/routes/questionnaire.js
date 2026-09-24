import { Router } from "express";
import { db } from "../firebase.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

// Enregistre une réponse au questionnaire terrain
router.post("/", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { cabinetName, city, softwareUsed = [], dossiersRange, interestScore } = req.body;
  if (!cabinetName || !city) {
    return res.status(400).json({ error: "cabinetName et city sont requis" });
  }
  const ref = await db.collection("questionnaireResponses").add({
    cabinetName, city, softwareUsed, dossiersRange, interestScore,
    submittedAt: new Date().toISOString(),
  });
  res.status(201).json({ id: ref.id });
}));

// Vue admin : liste toutes les réponses reçues (à protéger avec une vraie authentification en V1)
router.get("/", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const snap = await db.collection("questionnaireResponses").orderBy("submittedAt", "desc").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}));

export default router;
