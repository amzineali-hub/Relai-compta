# Modèle de données Firestore — RelaiCompta

```
cabinets/{cabinetId}
  name, city, softwareUsed[], sizeRange, slug, createdAt

cabinets/{cabinetId}/clients/{clientId}
  name, contactEmail, createdAt

cabinets/{cabinetId}/clients/{clientId}/documents/{documentId}
  fileName, docType, status (reçu | en_lecture | classé), extractedData, uploadedAt

cabinets/{cabinetId}/clients/{clientId}/invoices/{invoiceId}
  label, amount, dueDate, status (en_attente | payée)

questionnaireResponses/{responseId}
  cabinetName, city, softwareUsed[], dossiersRange, interestScore, submittedAt
```

## Accès V0 (MVP terrain)
Pas de mot de passe : chaque cabinet reçoit un lien unique (`/c/{slug}`) généré à la création.
Quiconque a le lien peut agir comme ce cabinet. Suffisant pour une phase de validation
contrôlée (envoi manuel du lien par Ali), à durcir en V1 avec une vraie authentification
(email + mot de passe ou lien magique Firebase Auth) avant tout lancement public.

## Prochaine étape naturelle
Le dépôt réel de fichiers (factures, relevés...) doit passer par Firebase Storage,
avec l'URL du fichier stockée dans `documents/{documentId}.fileUrl`. Le pipeline de
lecture IA (OCR / modèle vision) se déclenche alors sur ce fichier et met à jour
`status` et `extractedData`.
