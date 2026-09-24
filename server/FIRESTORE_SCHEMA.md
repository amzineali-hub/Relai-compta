# Modèle de données Firestore — RelaiCompta

```
cabinets/{cabinetId}
  name, city, softwareUsed[], sizeRange, slug, createdAt

cabinets/{cabinetId}/clients/{clientId}
  name, createdAt

cabinets/{cabinetId}/clients/{clientId}/documents/{documentId}
  fileName, docType, status (reçu | en_lecture | classé), extractedData,
  storagePath (chemin Firebase Storage du fichier réel), uploadedAt

cabinets/{cabinetId}/messages/{messageId}
  text, createdAt

questionnaireResponses/{responseId}
  cabinetName, city, softwareUsed[], dossiersRange, interestScore, submittedAt
```

Storage : `cabinets/{cabinetId}/clients/{clientId}/{timestamp}_{nomFichier}` — bucket privé,
URL de téléchargement générée à la demande (signée, 1h) par `GET /api/documents/:cabinetId/:clientId`,
jamais stockée telle quelle dans Firestore.

## Accès V0 (MVP terrain) — toujours vrai, à durcir avant tout vrai client
Pas d'authentification : l'app entière tourne sur un cabinet fixe (`cabinetId = "demo-cabinet"`
en dur côté client). `POST /api/cabinets` existe pour créer d'autres cabinets en base, mais
aucune route ou page de connexion ne les relie encore au reste de l'app — pas un vrai
multi-cabinet fonctionnel pour l'instant. Quiconque connaît un `cabinetId`/`clientId` peut lire
ses documents ou agir en son nom (créer un client, envoyer un message). Suffisant pour la phase
de test/démo actuelle, mais à corriger avant d'onboarder un vrai cabinet avec de vrais documents :
une vraie authentification (email + mot de passe ou lien magique Firebase Auth) reste à construire.

## Plan comptable (CGNC)
Les comptes proposés dans la démo de lecture automatique (`client/src/pages/CabinetView.jsx`)
suivent la structure du Code Général de Normalisation Comptable marocain (classes 1 à 8, voir
`client/src/lib/cgnc.js`) — structurellement stable, indépendante des taux/barèmes fiscaux qui
changent chaque Loi de Finances. Ces derniers ne sont pas codés en dur tant qu'aucune source
officielle datée n'a été fournie.

## Prochaine étape naturelle
Le dépôt de fichiers réel existe déjà (Firebase Storage). Il reste à brancher un vrai pipeline
de lecture (OCR / modèle vision) sur ces fichiers pour remplir `status` et `extractedData` à
partir du contenu réel, au lieu des six exemples fixes actuellement affichés à titre de démo.
