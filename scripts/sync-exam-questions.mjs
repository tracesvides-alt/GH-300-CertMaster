// Registers new Exam (advanced) questions from scripts/exam-question-drafts/*.json
// Reviewed IDs are preserved. Importing a draft is not an editorial sign-off.
import fs from 'node:fs';
import { createHash } from 'node:crypto';

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
const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

const seed = read(files.seed);
const difficulty = read(files.difficulty);
const quality = read(files.quality);
const difficultyBaseline = read(files.difficultyBaseline);
const choiceBaseline = read(files.choiceBaseline);
const objectives = read(bankDir + 'syllabus.json').domains.flatMap((d) => d.objectives.map((o) => ({ id: o.id, domainId: d.id })));
const sourceIds = new Set(read(bankDir + 'sources.json').map((s) => s.id));

const questionById = new Map(seed.map((q) => [q.id, q]));
const fail = (m) => { throw new Error(m); };

const draftDir = new URL('scripts/exam-question-drafts/', root);
const drafts = fs.existsSync(draftDir) ? fs.readdirSync(draftDir).filter((f) => f.endsWith('.json')).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(new URL(f, draftDir), 'utf8')).questions) : [];

// Track position counts for advanced questions to balance A/B/C/D
const positionCounts = [0, 0, 0, 0];
const countPosition = (q) => {
  if (q.difficulty === 'advanced' && q.type === 'single-select') {
    q.choices.forEach((c, i) => { if (q.answer.includes(c.id)) positionCounts[i]++; });
  }
};
seed.forEach(countPosition);

let added = 0;
for (const d of drafts) {
  if (questionById.has(d.id)) continue;
  const objective = objectives.find((o) => o.id === d.objectiveId) ?? fail(`Unknown objective: ${d.objectiveId}`);
  if (d.distractors.length !== 3) fail(`${d.id} needs exactly three distractors`);
  if (d.sourceIds.some((s) => !sourceIds.has(s))) fail(`${d.id} has an unknown source: ${d.sourceIds}`);
  if (!d.clues || d.clues.length === 0) fail(`${d.id} needs at least one clue`);
  if (!d.clues.every((c) => d.question.includes(c))) fail(`${d.id} clue must appear in question text`);
  if (!d.reasoningSteps || d.reasoningSteps.length < 2) fail(`${d.id} needs at least two reasoning steps`);
  if (!d.counterfactual || !d.counterfactual.trim()) fail(`${d.id} needs a counterfactual`);

  // Position balancing: prioritize domain-level balance first to avoid Domain x Difficulty failures (>35%), then global balance
  let position;
  if (d.preferredPosition !== undefined) {
    position = typeof d.preferredPosition === 'number' ? d.preferredPosition : 'ABCD'.indexOf(d.preferredPosition);
    if (!Number.isInteger(position) || position < 0 || position > 3) fail(`${d.id} has an invalid preferredPosition`);
  } else {
    const domainCounts = [0, 0, 0, 0];
    seed.filter((q) => q.difficulty === 'advanced' && q.domainId === objective.domainId && q.type === 'single-select')
      .forEach((q) => {
        q.choices.forEach((c, i) => { if (q.answer.includes(c.id)) domainCounts[i]++; });
      });
    const minDomain = Math.min(...domainCounts);
    const candidatePositions = [0, 1, 2, 3].filter((i) => domainCounts[i] === minDomain);
    position = candidatePositions.reduce((best, cur) => positionCounts[cur] < positionCounts[best] ? cur : best, candidatePositions[0]);
  }

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
    difficulty: 'advanced',
    type: 'single-select',
    status: 'needs-review',
    scenarioType: d.scenarioType ?? 'team',
    cognitiveLevel: 'analyze',
    examLike: true,
    testedConcepts: [d.objectiveId, 'evidence-based-analysis'],
    clues: d.clues,
    question: d.question,
    choices,
    answer: [answerId],
    explanation: d.correct.explanation,
    choiceExplanations,
    sourceIds: d.sourceIds,
    createdAt: today,
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
      distractorFailures: Object.fromEntries(texts.filter((t) => !t.correct).map((t, i) => {
        const letter = choices.find((c) => c.text === t.text).id;
        return [letter, t.explanation];
      })),
    }],
    contentRevision: 'exam-expansion-2026-10-12',
  };

  seed.push(q);
  positionCounts[position]++;
  questionById.set(q.id, q);

  const rawFingerprint = hash(JSON.stringify(q));
  difficulty.questions[q.id] = {
    fingerprint: rawFingerprint,
    beforeDifficulty: 'advanced',
    difficulty: 'advanced',
    textRewritten: false,
    reclassified: false,
    assessment: '未編集レビューの仮分類。本文・全選択肢・反実仮想の確認が必要。',
    reasoningSteps: [],
    counterfactual: null,
    evidence: [],
    reviewRequired: true,
  };
  // No automatically generated PASS, verification date, or reviewer evidence.

  choiceBaseline.questions[q.id] = {
    contentHash: hash(JSON.stringify({ question: q.question, choices: q.choices, explanation: q.explanation, choiceExplanations: q.choiceExplanations })),
    distractorHashes: Object.fromEntries(q.choices.filter((c) => !q.answer.includes(c.id)).map((c) => [c.id, hash(c.text)])),
    added: true,
  };

  difficultyBaseline.questions.push({
    id: q.id,
    difficulty: q.difficulty,
    question: q.question,
    choices: q.choices,
    answer: q.answer,
    explanation: q.explanation,
    choiceExplanations: q.choiceExplanations,
  });

  added++;
}

difficulty.lastUpdated = today;
quality.lastUpdated = today;

fs.writeFileSync(new URL(files.seed, root), JSON.stringify(seed, null, 2) + '\n');
fs.writeFileSync(new URL(files.difficulty, root), JSON.stringify(difficulty, null, 2) + '\n');
fs.writeFileSync(new URL(files.quality, root), JSON.stringify(quality, null, 2) + '\n');
fs.writeFileSync(new URL(files.difficultyBaseline, root), JSON.stringify(difficultyBaseline, null, 2) + '\n');
fs.writeFileSync(new URL(files.choiceBaseline, root), JSON.stringify(choiceBaseline, null, 2) + '\n');

console.log(`Added ${added} new exam questions (${seed.length} total).`);
