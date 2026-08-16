export const DOCS = {
  facture_fournisseur: {
    icon: "🧾", name: "Facture fournisseur", file: "facture_electro_plus_0847.pdf",
    sub: "Achat, TVA, charge",
    rows: [
      ["Tiers", "Electro Plus SARL"], ["Date", "12/08/2026"],
      ["Montant HT", "4 250,00 MAD"], ["TVA (20%)", "850,00 MAD"],
      ["Montant TTC", "5 100,00 MAD"], ["Compte proposé", "6125 — Fournitures", true],
    ],
    note: "↳ Fichier d'import prêt pour Sage 100 — aperçu simulé",
  },
  facture_client: {
    icon: "📄", name: "Facture client", file: "facture_vente_client_0212.pdf",
    sub: "Vente, produit",
    rows: [
      ["Client", "Riad Textile SARL"], ["Date", "10/08/2026"],
      ["Montant HT", "12 000,00 MAD"], ["TVA (20%)", "2 400,00 MAD"],
      ["Montant TTC", "14 400,00 MAD"], ["Compte proposé", "7121 — Ventes de biens", true],
    ],
    note: "↳ Fichier d'import prêt pour Sage 100 — aperçu simulé",
  },
  releve_bancaire: {
    icon: "🏦", name: "Relevé bancaire", file: "releve_attijari_juillet2026.pdf",
    sub: "Plusieurs mouvements",
    rows: [
      ["Banque", "Attijariwafa Bank"], ["Période", "01/07/2026 – 31/07/2026"],
      ["Mouvements détectés", "23 lignes"], ["Total débits", "48 320,00 MAD"],
      ["Total crédits", "61 500,00 MAD"], ["Compte proposé", "5141 — Banque", true],
    ],
    note: "↳ Rapprochement bancaire pré-rempli — aperçu simulé",
    recon: [
      ["Virement client Riad Textile", "+14 400,00 MAD", "Rapproché ✓", false],
      ["Prélèvement Electro Plus", "-5 100,00 MAD", "Rapproché ✓", false],
      ["Frais bancaires", "-45,00 MAD", "Non rapproché", true],
    ],
  },
  bulletin_paie: {
    icon: "👤", name: "Bulletin de paie", file: "paie_khadija_b_aout2026.pdf",
    sub: "Brut, CNSS, IR, net",
    rows: [
      ["Employé", "Khadija B."], ["Période", "Août 2026"],
      ["Salaire brut", "8 500,00 MAD"], ["Cotisations CNSS", "374,00 MAD"],
      ["IR retenu", "612,00 MAD"], ["Net à payer", "7 514,00 MAD"],
      ["Comptes proposés", "6171 / 4441 / 4432", true],
    ],
    note: "↳ Écriture de paie prête pour import — aperçu simulé",
  },
  note_frais: {
    icon: "📸", name: "Note de frais", file: "photo_note_frais_taxi.jpg",
    sub: "Photo, qualité variable",
    rows: [
      ["Employé", "Yassine M."], ["Date", "09/08/2026"],
      ["Nature", "Déplacement — taxi"], ["Montant TTC", "85,00 MAD"],
      ["Justificatif", "Photo jointe"], ["Compte proposé", "6251 — Déplacements", true],
    ],
    note: "↳ Lecture par IA vision (photo) — qualité correcte",
  },
  ticket_caisse: {
    icon: "🧻", name: "Ticket de caisse", file: "ticket_papeterie_scan.jpg",
    sub: "Petit montant, non structuré",
    rows: [
      ["Commerçant", "Papeterie Al Amal"], ["Date", "11/08/2026"],
      ["Montant TTC", "42,00 MAD"], ["Compte proposé", "6064 — Fournitures bureau", true],
    ],
    note: "⚠ Lecture partielle — qualité image faible, vérification conseillée",
    warn: true,
  },
};
