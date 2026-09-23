import admin from "firebase-admin";
import { readFileSync } from "fs";

// Le fichier de clé de service Firebase n'est jamais commité (voir .gitignore).
// En local : Firebase Console > Paramètres du projet > Comptes de service > télécharger le JSON.
// Sur Vercel (pas de disque persistant) : colle le contenu de ce même JSON tel quel dans la
// variable d'environnement FIREBASE_SERVICE_ACCOUNT_JSON du projet.
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";

let app;
try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.warn(
    "⚠️  Clé de service Firebase introuvable — lance en mode démo local sans base de données réelle.\n" +
    "   Place ton fichier serviceAccountKey.json dans /server ou configure FIREBASE_SERVICE_ACCOUNT_PATH."
  );
}

let db = null;
if (app) {
  db = admin.firestore();
  // Le SDK Admin utilise gRPC par défaut, qui reste bloqué en silence (ni erreur, ni réponse,
  // juste un hang indéfini) dans les runtimes serverless comme celui de Vercel — pas de
  // connexions longues persistantes possibles là-bas. Le basculer sur REST évite ce blocage.
  db.settings({ preferRest: true });
}
export { db };
export default admin;
