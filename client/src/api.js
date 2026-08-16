const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur API (${res.status})`);
  }
  return res.json();
}

export const api = {
  createCabinet: (data) => request("/cabinets", { method: "POST", body: JSON.stringify(data) }),
  getCabinet: (slug) => request(`/cabinets/${slug}`),
  submitQuestionnaire: (data) => request("/questionnaire", { method: "POST", body: JSON.stringify(data) }),
  listQuestionnaire: () => request("/questionnaire"),
  listDocuments: (cabinetId, clientId) => request(`/documents/${cabinetId}/${clientId}`),
  addDocument: (cabinetId, clientId, data) =>
    request(`/documents/${cabinetId}/${clientId}`, { method: "POST", body: JSON.stringify(data) }),
};
