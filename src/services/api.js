const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) throw new Error('Backend health check failed.');
  return response.json();
}

export async function analyzeInput({ inputType, text, experienceLevel }) {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputType, text, experienceLevel })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Analysis failed. Please try again.');
  return payload.analysis;
}
