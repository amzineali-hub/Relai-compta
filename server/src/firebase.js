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
let bucket = null;
if (app) {
  db = admin.firestore();
  // Le SDK Admin utilise gRPC par défaut, qui reste bloqué en silence (ni erreur, ni réponse,
  // juste un hang indéfini) dans les runtimes serverless comme celui de Vercel — pas de
  // connexions longues persistantes possibles là-bas. Le basculer sur REST évite ce blocage.
  db.settings({ preferRest: true });

  // Nom exact du bucket Storage (ex. relai-compa.firebasestorage.app) — visible dans Firebase
  // Console une fois Storage activé. Pas de valeur par défaut devinée : les nouveaux projets
  // Firebase utilisent depuis fin 2024 un nom de bucket différent de l'ancien <project-id>.appspot.com,
  // mieux vaut une variable explicite qu'une supposition qui échoue silencieusement.
  if (process.env.FIREBASE_STORAGE_BUCKET) {
    bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
  }
}
export { db, bucket };
export default admin;
