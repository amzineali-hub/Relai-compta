// Express 4 ne rattrape pas les rejets de promesse dans un handler async — une erreur Firestore
// (ou autre) non catchée laisse la requête sans réponse, indéfiniment, plutôt que de remonter à
// un middleware d'erreur. Ce wrapper évite d'avoir à répéter un try/catch dans chaque route.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
