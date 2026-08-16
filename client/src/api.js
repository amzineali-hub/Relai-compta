const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
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
  addDocument: (cabinetId, clientId, data) =>
    request(`/documents/${cabinetId}/${clientId}`, { method: "POST", body: JSON.stringify(data) }),
  submitQuestionnaire: (data) => request("/questionnaire", { method: "POST", body: JSON.stringify(data) }),
  getQuestionnaireResponses: () => request("/questionnaire"),
};
