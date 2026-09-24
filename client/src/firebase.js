import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Config Web Firebase — safe à exposer côté client (même modèle que les clés API Firebase
// habituelles : la vraie protection est côté serveur, via la vérification du jeton).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
