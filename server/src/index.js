import "dotenv/config";
import express from "express";
import cors from "cors";

import cabinetsRouter from "./routes/cabinets.js";
import documentsRouter from "./routes/documents.js";
import questionnaireRouter from "./routes/questionnaire.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "relaicompta-server" }));

app.use("/api/cabinets", cabinetsRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/questionnaire", questionnaireRouter);

export default app;

// Sur Vercel, cette fonction n'est jamais exécutée telle quelle : la plateforme importe `app`
// (voir api/index.js) et gère elle-même l'écoute réseau — un app.listen() ici entrerait en
// conflit avec le runtime serverless. La variable VERCEL est posée automatiquement en prod.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`RelaiCompta API en écoute sur le port ${PORT}`));
}
