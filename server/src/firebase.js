import admin from "firebase-admin";
import { readFileSync } from "fs";

// Le fichier de clé de service Firebase n'est jamais commité (voir .gitignore).
// Récupère-le depuis Firebase Console > Paramètres du projet > Comptes de service.
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";

let app;
try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.warn(
    "⚠️  Clé de service Firebase introuvable — lance en mode démo local sans base de données réelle.\n" +
    "   Place ton fichier serviceAccountKey.json dans /server ou configure FIREBASE_SERVICE_ACCOUNT_PATH."
  );
}

export const db = app ? admin.firestore() : null;
export default admin;
