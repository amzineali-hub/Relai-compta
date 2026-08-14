import { Router } from "express";
import { db } from "../firebase.js";

const router = Router();

// Liste les documents envoyés par un client d'un cabinet
router.get("/:cabinetId/:clientId", async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { cabinetId, clientId } = req.params;
  const snap = await db
    .collection("cabinets").doc(cabinetId)
    .collection("clients").doc(clientId)
    .collection("documents").orderBy("uploadedAt", "desc").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Enregistre un document déposé (métadonnées ; le fichier lui-même part vers un stockage à part, ex. Firebase Storage)
router.post("/:cabinetId/:clientId", async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { cabinetId, clientId } = req.params;
  const { fileName, docType } = req.body;
  if (!fileName) return res.status(400).json({ error: "fileName requis" });

  const ref = await db
    .collection("cabinets").doc(cabinetId)
    .collection("clients").doc(clientId)
    .collection("documents").add({
      fileName, docType: docType || "inconnu",
      status: "reçu", // reçu → en_lecture → classé
      extractedData: null,
      uploadedAt: new Date().toISOString(),
    });

  res.status(201).json({ id: ref.id });
});

export default router;
