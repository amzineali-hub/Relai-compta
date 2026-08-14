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

## Prochaine étape
Construire `client/` en React, en reprenant fidèlement le design de `relaicompta-demo.html`
(mêmes couleurs, mêmes composants), mais branché sur cette vraie API au lieu de données figées.
