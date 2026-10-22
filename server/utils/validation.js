const INPUT_TYPES = new Set(['readme', 'issue', 'code']);
const EXPERIENCE_LEVELS = new Set(['beginner', 'intermediate', 'advanced']);

export function validateRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Send a JSON object with inputType, text, and experienceLevel.' };
  }
  const { inputType, text, experienceLevel } = body;
  if (!INPUT_TYPES.has(inputType)) return { ok: false, error: 'inputType must be readme, issue, or code.' };
  if (typeof text !== 'string' || !text.trim()) return { ok: false, error: 'Please paste some project context first.' };
  if (text.length > 20000) return { ok: false, error: 'Please keep your input under 20,000 characters.' };
  if (!EXPERIENCE_LEVELS.has(experienceLevel)) return { ok: false, error: 'Choose beginner, intermediate, or advanced experience level.' };
  return { ok: true, data: { inputType, text: text.trim(), experienceLevel } };
}

export function validateAnalysis(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Analysis output must be an object.');
  }
  const required = ['summary', 'contributionIdea', 'whereToLook', 'steps', 'testing', 'prDraft', 'cautions'];
  for (const key of required) {
    if (!(key in value)) throw new Error(`Analysis output is missing ${key}.`);
  }
  if (typeof value.summary !== 'string' || typeof value.contributionIdea !== 'string') {
    throw new Error('Analysis output has invalid text fields.');
  }
  for (const key of ['whereToLook', 'steps', 'testing', 'cautions']) {
    if (!Array.isArray(value[key])) throw new Error(`Analysis output field ${key} must be a list.`);
    value[key] = value[key].filter((item) => typeof item === 'string').slice(0, 8);
  }
  if (!value.prDraft || typeof value.prDraft !== 'object' ||
      typeof value.prDraft.title !== 'string' || typeof value.prDraft.description !== 'string') {
    throw new Error('Analysis output has an invalid PR draft.');
  }
  return {
    summary: value.summary.slice(0, 3000),
    contributionIdea: value.contributionIdea.slice(0, 3000),
    whereToLook: value.whereToLook,
    steps: value.steps,
    testing: value.testing,
    prDraft: { title: value.prDraft.title.slice(0, 300), description: value.prDraft.description.slice(0, 2000) },
    cautions: value.cautions
  };
}
