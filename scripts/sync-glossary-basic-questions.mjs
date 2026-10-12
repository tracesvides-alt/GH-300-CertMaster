// Registers the Foundation (beginner) question that directly tests each glossary term.
//  1. scripts/glossary-basic-map.json: term -> existing question (link only, no question text is changed)
//  2. scripts/glossary-question-drafts/*.json: new questions, appended to the bank with every ledger entry
// Idempotent: existing question IDs are skipped. Run `npm run glossary:coverage` afterwards.
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const bankDir = 'content/gh300/2026-08-07/';
const files = {
  seed: bankDir + 'questions/seed.json',
  terms: bankDir + 'glossary/terms.json',
  difficulty: bankDir + 'questions/difficulty-review.json',
  quality: bankDir + 'questions/quality-review.json',
  difficultyBaseline: 'reports/question-difficulty-baseline.json',
  choiceBaseline: 'reports/question-choice-content-baseline.json',
};
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, root), 'utf8'));
const hash = (v) => createHash('sha256').update(v).digest('hex');
const today = '2026-10-12';

const seed = read(files.seed);
const termsRaw = fs.readFileSync(new URL(files.terms, root), 'utf8');
const terms = JSON.parse(termsRaw);
const difficulty = read(files.difficulty);
const quality = read(files.quality);
const difficultyBaseline = read(files.difficultyBaseline);
const choiceBaseline = read(files.choiceBaseline);
const objectives = read(bankDir + 'syllabus.json').domains.flatMap((d) => d.objectives.map((o) => ({ id: o.id, domainId: d.id })));
const sourceIds = new Set(read(bankDir + 'sources.json').map((s) => s.id));

const termById = new Map(terms.map((t) => [t.id, t]));
const questionById = new Map(seed.map((q) => [q.id, q]));
const fail = (m) => { throw new Error(m); };
function link(termId, questionId) {
  const term = termById.get(termId) ?? fail(`Unknown term: ${termId}`);
  const q = questionById.get(questionId) ?? fail(`Unknown question: ${questionId}`);
  if (q.difficulty !== 'beginner') fail(`${questionId} is not a Foundation question`);
  term.basicQuestionId = questionId;
  if (!term.questionIds.includes(questionId)) term.questionIds.push(questionId);
}

// 1. Existing questions
const map = read('scripts/glossary-basic-map.json').existing;
const used = new Map();
for (const [termId, questionId] of Object.entries(map)) {
  if (used.has(questionId)) fail(`${questionId} is assigned to both ${used.get(questionId)} and ${termId}`);
  used.set(questionId, termId);
  link(termId, questionId);
}

const draftDir = new URL('scripts/glossary-question-drafts/', root);
const drafts = fs.existsSync(draftDir) ? fs.readdirSync(draftDir).filter((f) => f.endsWith('.json')).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(new URL(f, draftDir), 'utf8')).questions) : [];

// Existing questions may have completed editorial reviews. Never overwrite them
// or stamp newly generated drafts as reviewed; changes need a separate review.
const draftIds = new Set(drafts.map((d) => d.id));

const positionCounts = [0, 0, 0, 0];
const countPosition = (q) => { if (q.difficulty === 'beginner' && q.type === 'single-select') q.choices.forEach((c, i) => { if (q.answer.includes(c.id)) positionCounts[i]++; }); };
seed.forEach(countPosition);
let added = 0;
for (const d of drafts) {
  if (used.has(d.id)) fail(`${d.id} duplicates an existing mapping`);
  if (questionById.has(d.id)) { link(d.termId, d.id); continue; }
  const term = termById.get(d.termId) ?? fail(`Unknown term: ${d.termId}`);
  if (term.basicQuestionId && !questionById.has(d.id)) fail(`${d.termId} already has ${term.basicQuestionId}`);
  const objective = objectives.find((o) => o.id === d.objectiveId) ?? fail(`Unknown objective: ${d.objectiveId}`);
  if (d.distractors.length !== 3) fail(`${d.id} needs exactly three distractors`);
  if (d.sourceIds.some((s) => !sourceIds.has(s))) fail(`${d.id} has an unknown source`);
  const position = positionCounts.indexOf(Math.min(...positionCounts));
  const texts = [...d.distractors];
  texts.splice(position, 0, { correct: true, ...d.correct });
  const letters = 'ABCD';
  const choices = texts.map((t, i) => ({ id: letters[i], text: t.text }));
  const answerId = letters[position];
  const choiceExplanations = Object.fromEntries(texts.map((t, i) => [letters[i], t.explanation]));
  const q = {
    id: d.id, syllabusVersion: '2026-08-07', domainId: objective.domainId, objectiveId: d.objectiveId,
    difficulty: 'beginner', type: 'single-select', status: 'needs-review', cognitiveLevel: 'understand', examLike: false,
    question: d.question, choices, answer: [answerId], explanation: d.correct.explanation, choiceExplanations,
    sourceIds: d.sourceIds, createdAt: today, lastVerifiedAt: today,
    trustedSourceFacts: Object.values(choiceExplanations),
    choiceQuality: Object.fromEntries(texts.map((t, i) => [letters[i], {
      plausibility: t.correct ? 3 : t.plausibility, distractorType: t.correct ? 'correct' : t.type,
      sourceIds: d.sourceIds, rationale: t.explanation,
    }])),
    requirementMapping: [{
      requirement: d.question, correctReason: d.correct.explanation,
      distractorFailures: Object.fromEntries(texts.flatMap((t, i) => (t.correct ? [] : [[letters[i], t.explanation]]))),
    }],
    contentRevision: 'glossary-coverage-2026-10-12', clues: [],
  };
  seed.push(q); questionById.set(q.id, q); countPosition(q); added++;
  link(d.termId, q.id);

  const assessment = `${term.term}の名称と定義を対応付ける基礎。`;
  difficulty.questions[q.id] = {
    fingerprint: hash(JSON.stringify(q)), beforeDifficulty: 'beginner', difficulty: 'beginner',
    textRewritten: false, reclassified: false, assessment, reasoningSteps: [assessment], counterfactual: null, evidence: [],
  };
  // quality-review.json is written only by a completed editorial review.
  difficultyBaseline.questions.push({
    id: q.id, difficulty: q.difficulty, question: q.question, choices: q.choices, answer: q.answer,
    explanation: q.explanation, choiceExplanations: q.choiceExplanations,
  });
  choiceBaseline.questions[q.id] = {
    contentHash: hash(JSON.stringify({ question: q.question, choices: q.choices, explanation: q.explanation, choiceExplanations: q.choiceExplanations })),
    distractorHashes: Object.fromEntries(q.choices.filter((c) => !q.answer.includes(c.id)).map((c) => [c.id, hash(c.text)])),
    added: true,
  };
}

const write = (f, v, crlf = false) => {
  const text = JSON.stringify(v, null, 2) + '\n';
  fs.writeFileSync(new URL(f, root), crlf ? text.replace(/\n/g, '\r\n') : text);
};
write(files.seed, seed);
write(files.terms, terms, termsRaw.includes('\r\n'));
write(files.difficulty, difficulty);
write(files.quality, quality);
write(files.difficultyBaseline, difficultyBaseline);
write(files.choiceBaseline, choiceBaseline);
console.log(`Linked ${Object.keys(map).length} existing questions; added ${added} new questions (${seed.length} total).`);
