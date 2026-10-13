// Registers new Applied (intermediate) questions from scripts/applied-question-drafts/*.json
// Existing IDs retain their edited text and review ledgers. New drafts require
// an editorial review; importing a scenario does not establish Applied quality.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { removedQuestionIds } from './question-removals.mjs';

const root = new URL('../', import.meta.url);
const bankDir = 'content/gh300/2026-08-07/';
const files = {
  seed: bankDir + 'questions/seed.json',
  difficulty: bankDir + 'questions/difficulty-review.json',
  quality: bankDir + 'questions/quality-review.json',
  difficultyBaseline: 'reports/question-difficulty-baseline.json',
  choiceBaseline: 'reports/question-choice-content-baseline.json',
};
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, root), 'utf8'));
const hash = (v) => createHash('sha256').update(v).digest('hex');
const today = '2026-10-12';

const seed = read(files.seed);
const difficulty = read(files.difficulty);
const quality = read(files.quality);
const difficultyBaseline = read(files.difficultyBaseline);
const choiceBaseline = read(files.choiceBaseline);
const objectives = read(bankDir + 'syllabus.json').domains.flatMap((d) => d.objectives.map((o) => ({ id: o.id, domainId: d.id })));
const sourceIds = new Set(read(bankDir + 'sources.json').map((s) => s.id));

const questionById = new Map(seed.map((q) => [q.id, q]));
const fail = (m) => { throw new Error(m); };

const draftDir = new URL('scripts/applied-question-drafts/', root);
const drafts = fs.existsSync(draftDir) ? fs.readdirSync(draftDir).filter((f) => f.endsWith('.json')).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(new URL(f, draftDir), 'utf8')).questions) : [];

// Track position counts for intermediate questions to balance A/B/C/D
const positionCounts = [0, 0, 0, 0];
const countPosition = (q) => {
  if (q.difficulty === 'intermediate' && q.type === 'single-select') {
    q.choices.forEach((c, i) => { if (q.answer.includes(c.id)) positionCounts[i]++; });
  }
};
seed.forEach(countPosition);

let added = 0;
for (const d of drafts) {
  if (questionById.has(d.id) || removedQuestionIds.has(d.id)) continue;
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
    id: d.id,
    syllabusVersion: '2026-08-07',
    domainId: objective.domainId,
    objectiveId: d.objectiveId,
    difficulty: 'intermediate',
    type: 'single-select',
    status: 'needs-review',
    cognitiveLevel: 'apply',
    examLike: false,
    question: d.question,
    choices,
    answer: [answerId],
    explanation: d.correct.explanation,
    choiceExplanations,
    sourceIds: d.sourceIds,
    createdAt: today,
    lastVerifiedAt: today,
    trustedSourceFacts: [],
    distractorQuality: 'scenario-contrast',
    choiceQuality: Object.fromEntries(texts.map((t, i) => [letters[i], {
      plausibility: t.correct ? 3 : t.plausibility,
      distractorType: t.correct ? 'correct' : t.type,
      sourceIds: d.sourceIds,
      rationale: t.explanation,
    }])),
    requirementMapping: [{
      requirement: d.requirement ?? d.question,
      correctReason: d.correct.explanation,
      distractorFailures: Object.fromEntries(texts.flatMap((t, i) => (t.correct ? [] : [[letters[i], t.explanation]]))),
    }],
    contentRevision: 'applied-coverage-2026-10-12',
    clues: [],
    testedConcepts: [d.objectiveId, 'scenario-application'],
  };

  seed.push(q);
  questionById.set(q.id, q);
  countPosition(q);
  added++;

  const assessment = d.assessment ?? `${q.question.slice(0, 30)}に関する実務応用判断。`;
  difficulty.questions[q.id] = {
    fingerprint: hash(JSON.stringify(q)),
    beforeDifficulty: 'intermediate',
    difficulty: 'intermediate',
    textRewritten: false,
    reclassified: false,
    assessment,
    reasoningSteps: [],
    counterfactual: null,
    evidence: [],
  };
  // No fabricated PASS or signed-off difficulty record for unreviewed drafts.
  difficulty.questions[q.id].reviewRequired = true;
  difficultyBaseline.questions.push({
    id: q.id,
    difficulty: q.difficulty,
    question: q.question,
    choices: q.choices,
    answer: q.answer,
    explanation: q.explanation,
    choiceExplanations: q.choiceExplanations,
  });
  choiceBaseline.questions[q.id] = {
    contentHash: hash(JSON.stringify({ question: q.question, choices: q.choices, explanation: q.explanation, choiceExplanations: q.choiceExplanations })),
    distractorHashes: Object.fromEntries(q.choices.filter((c) => !q.answer.includes(c.id)).map((c) => [c.id, hash(c.text)])),
    added: true,
  };
}

const write = (f, v) => {
  fs.writeFileSync(new URL(f, root), JSON.stringify(v, null, 2) + '\n');
};
write(files.seed, seed);
write(files.difficulty, difficulty);
write(files.quality, quality);
write(files.difficultyBaseline, difficultyBaseline);
write(files.choiceBaseline, choiceBaseline);
console.log(`Added ${added} new applied questions (${seed.length} total).`);
