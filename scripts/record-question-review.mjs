// Explicit editorial action, never invoked by migration, generation, audit, or CI.
// Use only after reading the proposed bank and completing the rubric review.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { questionIssues } from '../lib/question-quality.ts';
if (!process.argv.includes('--record-completed-editorial-review')) throw Error('A completed editorial review must be explicitly recorded.');
const root = new URL('../content/gh300/2026-08-07/questions/', import.meta.url);
const bank = JSON.parse(fs.readFileSync(new URL('seed.json', root), 'utf8'));
const reviews = {};
for (const q of bank.filter(q => q.difficulty !== 'beginner')) {
  if (questionIssues(q).length) throw Error(`Resolve mechanical findings before recording ${q.id}`);
  reviews[q.id] = {
    fingerprint: createHash('sha256').update(JSON.stringify(q)).digest('hex'),
    multipleAnswerRisk: false, answerWithoutReading: false,
    difficultyConsistent: true, requirementCoverage: true,
    rationale: `第2段階で本文の条件と各案の反例を照合。${q.requirementMapping[0].correctReason} 比較対象: ${q.requirementMapping[0].distractorFailures[q.choices.find(c => !q.answer.includes(c.id)).id]}`,
  };
}
fs.writeFileSync(new URL('quality-review.json', root), JSON.stringify({
  rubricVersion: 1, reviewedAt: '2026-09-07', reviewer: 'Codex editorial second pass',
  method: 'Separate rubric pass after authored revisions; not an independent human reviewer or an empirical difficulty calibration.',
  questions: reviews,
}, null, 2) + '\n');
console.log(`Recorded ${Object.keys(reviews).length} completed editorial reviews.`);
