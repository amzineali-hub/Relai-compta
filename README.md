# RelaiCompta — Plateforme MVP

Backend Express + Firestore pour la plateforme réelle (au-delà de la maquette statique
`relaicompta-demo.html`). Objectif : un vrai lien partageable, des données qui persistent,
des cabinets et leurs clients réels.

## Structure
```
server/   → API Express + Firebase Admin (Firestore)
client/   → (à venir) interface React reprenant le design de la maquette
```

## Mise en route locale
```bash
cd server
npm install
cp .env.example .env
# place ton fichier serviceAccountKey.json ici (voir ci-dessous)
npm run dev
```

```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Le frontend tourne sur `http://localhost:5173`, l'API sur `http://localhost:4000`.

## Configurer Firebase (5 minutes)
1. Va sur [console.firebase.google.com](https://console.firebase.google.com) → "Ajouter un projet" → nomme-le `relaicompta`
2. Active **Firestore Database** (mode production, région `eur3` ou `europe-west` pour la latence Maroc)
3. Paramètres du projet → **Comptes de service** → "Générer une nouvelle clé privée" → télécharge le JSON
4. Place ce fichier dans `server/serviceAccountKey.json` (déjà exclu du dépôt via `.gitignore`)

## Déployer l'API (Cloud Run, comme pour Madrasati)
```bash
cd server
gcloud run deploy relaicompta-api --source . --region europe-west1 --allow-unauthenticated
```
Tu obtiens une URL publique type `https://relaicompta-api-xxxx.run.app`.

## Déployer le frontend (Firebase Hosting ou Vercel)
```bash
cd client
npm run build
firebase deploy --only hosting   # ou : vercel --prod
```
Pense à définir `VITE_API_URL` sur l'URL réelle de ton API déployée avant de builder.

## État actuel
- Backend testé et fonctionnel (démarre, répond sur `/api/health`)
- Frontend testé et fonctionnel (build de production passe sans erreur)
- Vue client : dépôt de document réel + liste des documents envoyés, branchés sur l'API
- Vue cabinet : liste des documents reçus (version simplifiée, pas encore le détail par type de document de la maquette)
- Questionnaire : écrit réellement en base Firestore
- Accès toujours par lien simple (pas de mot de passe) — Firebase Auth à ajouter en V1


## Client React — mise en route
```bash
cd client
npm install
npm run dev   # http://localhost:5173, proxy /api vers le serveur local (port 4000)
```
Le parcours complet est présent : accueil, espace client (documents + suivi côte à
côte sur desktop), interface cabinet (dashboard avec barre latérale, 6 types de
documents testables, rapprochement bancaire), questionnaire — **réellement envoyé
à l'API** (`POST /api/questionnaire`) une fois Firebase configuré côté serveur.

## Déployer le client (Firebase Hosting, cohérent avec le reste du projet)
```bash
cd client
npm run build
firebase init hosting   # pointer sur le dossier dist/
firebase deploy --only hosting
```
Tu obtiens un lien public type `https://relaicompta.web.app` à envoyer directement
aux cabinets — plus besoin de visite terrain pour recueillir leurs retours, même si
les visites restent utiles pour échanger de vive voix.

