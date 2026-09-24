const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  // Un FormData (dépôt de fichier) doit fixer lui-même son Content-Type multipart avec la bonne
  // boundary — la forcer manuellement en JSON casse l'envoi. Seules les requêtes JSON en ont besoin.
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: isFormData ? options.headers : { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erreur API (${res.status})`);
  }
  return res.json();
}

export const api = {
  getCabinet: (slug) => request(`/cabinets/${slug}`),
  createCabinet: (data) => request("/cabinets", { method: "POST", body: JSON.stringify(data) }),
  getDocuments: (cabinetId, clientId) => request(`/documents/${cabinetId}/${clientId}`),
  addDocument: (cabinetId, clientId, formData) =>
    request(`/documents/${cabinetId}/${clientId}`, { method: "POST", body: formData }),
  submitQuestionnaire: (data) => request("/questionnaire", { method: "POST", body: JSON.stringify(data) }),
  getQuestionnaireResponses: () => request("/questionnaire"),
};
