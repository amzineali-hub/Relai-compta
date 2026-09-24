import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Config Web Firebase — safe à exposer côté client (même modèle que les clés API Firebase
// habituelles : la vraie protection est côté serveur, via la vérification du jeton).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Défensif : tant que les VITE_FIREBASE_* ne sont pas renseignées (avant la configuration
// Firebase Console), `auth` reste `null` plutôt que de faire planter tout le site — seules les
// pages /login et /cabinet en dépendent, l'espace client (dépôt de documents) doit continuer à
// fonctionner sans interruption pendant que la connexion cabinet se met en place.
let auth = null;
try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (err) {
  console.warn("Firebase Auth non configuré (VITE_FIREBASE_* manquantes) — l'espace cabinet est inaccessible tant que ce n'est pas fait.", err);
}

export { auth };
