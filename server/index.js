import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeWithGemma } from './services/gemmaService.js';
import { buildPrompt } from './services/promptBuilder.js';
import { validateRequest, validateAnalysis } from './utils/validation.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_req, res) => {
  res.json({
    status: 'ok',
    service: 'RepoSathi AI',
    model: process.env.GEMMA_MODEL || 'gemma3:4b',
    note: 'This confirms the API is running; Ollama availability is checked when you analyse input.'
  });
});

app.post('/api/analyze', async (req, res) => {
  const validation = validateRequest(req.body);
  if (!validation.ok) return res.status(400).json({ error: validation.error });

  try {
    const prompt = buildPrompt(validation.data);
    const raw = await analyzeWithGemma(prompt);
    const analysis = validateAnalysis(raw);
    return res.json({ analysis });
  } catch (error) {
    console.error('[analyze]', error.message);
    console.error(error.stack);
    const status = error.status || 502;
    return res.status(status).json({ error: error.publicMessage || 'Could not analyse this input. Check that Ollama is running and the configured model is installed.' });
  }
});

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Input is too large. Please keep it under 20,000 characters.' });
  console.error('[server]', err.message);
  return res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`RepoSathi AI backend running at http://localhost:${PORT}`);
  console.log(`Allowed frontend origin: ${allowedOrigin}`);
  console.log(`Configured Ollama model: ${process.env.GEMMA_MODEL || 'gemma3:4b'}`);
});
