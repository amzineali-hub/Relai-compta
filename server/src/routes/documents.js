import { Router } from "express";
import multer from "multer";
import { db, bucket } from "../firebase.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

// Mémoire uniquement — pas de disque persistant en serverless. 4 Mo de marge sous la limite de
// taille de requête généralement appliquée aux fonctions Vercel (~4.5 Mo sur le plan Hobby).
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 } });

// Liste les documents envoyés par un client d'un cabinet, avec une URL de téléchargement signée
// et temporaire par document (le bucket reste privé — pas de fichier client exposé publiquement).
router.get("/:cabinetId/:clientId", asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  const { cabinetId, clientId } = req.params;
  const snap = await db
    .collection("cabinets").doc(cabinetId)
    .collection("clients").doc(clientId)
    .collection("documents").orderBy("uploadedAt", "desc").get();

  const docs = await Promise.all(snap.docs.map(async (d) => {
    const data = d.data();
    let downloadUrl = null;
    if (data.storagePath && bucket) {
      try {
        const [url] = await bucket.file(data.storagePath).getSignedUrl({
          action: "read",
          expires: Date.now() + 60 * 60 * 1000, // 1h — régénérée à chaque appel de cette route
        });
        downloadUrl = url;
      } catch (err) {
        console.warn("URL signée impossible pour", data.storagePath, err.message);
      }
    }
    return { id: d.id, ...data, downloadUrl };
  }));

  res.json(docs);
}));

// Dépose un document réel (fichier + métadonnées) : le fichier part sur Firebase Storage, seules
// les métadonnées (nom, type, chemin de stockage) sont écrites dans Firestore.
router.post("/:cabinetId/:clientId", upload.single("file"), asyncHandler(async (req, res) => {
  if (!db) return res.status(503).json({ error: "Base de données non configurée" });
  if (!bucket) return res.status(503).json({ error: "Stockage de fichiers non configuré" });
  const { cabinetId, clientId } = req.params;
  const { docType } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Fichier requis" });

  const storagePath = `cabinets/${cabinetId}/clients/${clientId}/${Date.now()}_${file.originalname}`;
  await bucket.file(storagePath).save(file.buffer, { contentType: file.mimetype });

  const ref = await db
    .collection("cabinets").doc(cabinetId)
    .collection("clients").doc(clientId)
    .collection("documents").add({
      fileName: file.originalname,
      docType: docType || "inconnu",
      status: "reçu", // reçu → en_lecture → classé
      extractedData: null,
      storagePath,
      uploadedAt: new Date().toISOString(),
    });

  res.status(201).json({ id: ref.id });
}));

export default router;
