const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
const model = process.env.GEMMA_MODEL || 'gemma3:4b';
const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS || 120000);

export async function analyzeWithGemma(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response;
    try {
      response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          format: 'json',
          options: { temperature: 0.25 }
        }),
        signal: controller.signal
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Ollama took too long to respond.');
        timeoutError.status = 504;
        timeoutError.publicMessage = 'The model took too long to respond. Try a smaller input or increase OLLAMA_TIMEOUT_MS in your .env file.';
        throw timeoutError;
      }
      const connectionError = new Error('Could not connect to Ollama.');
      connectionError.status = 503;
      connectionError.publicMessage = 'Could not connect to Ollama. Start Ollama, check its local API, and make sure your model is installed.';
      throw connectionError;
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload.error || `Ollama returned HTTP ${response.status}`;
      const modelError = new Error(message);
      modelError.status = response.status === 404 ? 503 : 502;
      modelError.publicMessage = response.status === 404
        ? `Model "${model}" may not be installed. Run "ollama list" and set GEMMA_MODEL in your .env to an exact installed model tag.`
        : 'Ollama returned an error. Check the model name and Ollama status.';
      throw modelError;
    }

    if (typeof payload.response !== 'string' || !payload.response.trim()) {
      const emptyError = new Error('Ollama returned an empty response.');
      emptyError.publicMessage = 'The model returned an empty response. Please try again.';
      throw emptyError;
    }

    try {
      return JSON.parse(payload.response);
    } catch {
      const parseError = new Error('Model response was not valid JSON.');
      parseError.publicMessage = 'The model response could not be read. Please try again, or use a shorter input.';
      throw parseError;
    }
  } finally {
    clearTimeout(timeout);
  }
}
