import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest, validateAnalysis } from '../server/utils/validation.js';

test('accepts a valid analysis request', () => {
  const result = validateRequest({ inputType: 'readme', text: '# Demo', experienceLevel: 'beginner' });
  assert.equal(result.ok, true);
  assert.equal(result.data.text, '# Demo');
});

test('rejects unsupported input type', () => {
  const result = validateRequest({ inputType: 'repository-url', text: 'hello', experienceLevel: 'beginner' });
  assert.equal(result.ok, false);
});

test('rejects empty text', () => {
  assert.equal(validateRequest({ inputType: 'code', text: '  ', experienceLevel: 'beginner' }).ok, false);
});

test('validates a well-formed model response', () => {
  const result = validateAnalysis({
    summary: 'Demo app',
    contributionIdea: 'Add a small documentation example.',
    whereToLook: ['README'],
    steps: ['Read the contribution guide'],
    testing: ['Review the rendered page'],
    prDraft: { title: 'docs: add example', description: 'Adds an example.' },
    cautions: ['Verify project conventions']
  });
  assert.equal(result.prDraft.title, 'docs: add example');
});
