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
3. Active aussi **Storage** (menu "Bases de données et stockage") — nécessaire pour le vrai dépôt
   de fichiers. Note le nom exact du bucket affiché (ex. `relai-compa.firebasestorage.app`) pour
   `FIREBASE_STORAGE_BUCKET` ci-dessous.
4. Paramètres du projet → **Comptes de service** → "Générer une nouvelle clé privée" → télécharge le JSON
5. Place ce fichier dans `server/serviceAccountKey.json` (déjà exclu du dépôt via `.gitignore`)

## Déployer l'API (Vercel)
Le dossier `server/` est un projet Vercel à part entière (Root Directory = `server` dans les
réglages du projet) — l'app Express est adaptée en fonction serverless via `server/api/index.js`
et `server/vercel.json`. Variables d'environnement à définir sur ce projet Vercel :
- `FIREBASE_SERVICE_ACCOUNT_JSON` : le contenu complet du JSON de la clé de service Firebase
  (voir ci-dessus), collé tel quel — pas de fichier possible sur Vercel.
- `FIREBASE_STORAGE_BUCKET` : le nom du bucket Storage (ex. `relai-compa.firebasestorage.app`),
  sans quoi le dépôt de fichiers répond `503`.

Tu obtiens une URL publique type `https://relai-compta-api-xxxx.vercel.app`.

## Déployer le frontend (Vercel)
Le dossier `client/` est lui aussi un projet Vercel à part (Root Directory = `client`).
```bash
cd client
npm run build
```
Avant de déployer, définis `VITE_API_URL` (variable d'environnement du projet Vercel du
frontend) sur l'URL de l'API déployée ci-dessus, suivie de `/api` — ex.
`https://relai-compta-api-xxxx.vercel.app/api`.

## État actuel
- Backend testé et fonctionnel (démarre, répond sur `/api/health`), déployé sur Vercel
- Frontend testé et fonctionnel, déployé sur Vercel
- Vue client : dépôt de fichier réel (Firebase Storage, 4 Mo max) + liste des documents envoyés
  avec lien de téléchargement (URL signée, 1h), branchés sur l'API
- Vue cabinet : liste des documents reçus avec lien de téléchargement (version simplifiée, pas
  encore le détail par type de document de la maquette)
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

Le déploiement du client se fait sur Vercel — voir la section "Déployer le frontend (Vercel)"
plus haut.

