// Structure des classes du Code Général de Normalisation Comptable (CGNC) marocain — le plan
// comptable de référence défini par le Conseil National de la Comptabilité (CNC), en cours de
// convergence vers les normes IAS/IFRS (voir finances.gov.ma, Direction des Études et des
// Prévisions Financières — Normalisation comptable).
//
// Volontairement limité à la structure des classes (stable depuis des décennies) et pas aux
// taux ou seuils fiscaux (TVA, IR, IS...), qui changent chaque Loi de Finances et ne doivent pas
// être codés en dur sans une source officielle datée et vérifiée.
export const CGNC_CLASSES = {
  1: "Comptes de financement permanent",
  2: "Comptes d'actif immobilisé",
  3: "Comptes d'actif circulant (hors trésorerie)",
  4: "Comptes de passif circulant (hors trésorerie)",
  5: "Comptes de trésorerie",
  6: "Comptes de charges",
  7: "Comptes de produits",
  8: "Comptes de résultats",
};

// Extrait les codes de compte (3 à 5 chiffres) d'un texte libre ("6125 — Fournitures" ou
// "6171 / 4441 / 4432") et renvoie les classes CGNC concernées, sans doublon.
export function describeAccountClasses(text) {
  const codes = String(text).match(/\b\d{3,5}\b/g) || [];
  const classNames = codes
    .map((code) => CGNC_CLASSES[code[0]])
    .filter(Boolean);
  return [...new Set(classNames)].join(" · ");
}
