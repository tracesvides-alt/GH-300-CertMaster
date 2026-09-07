import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { questionIssues, distributionIssues, positionDistribution } from '../lib/question-quality.ts';
const root = new URL('../content/gh300/2026-08-07/', import.meta.url);
const read = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'));
const questions = read('questions/seed.json'), sources = read('sources.json');
const syllabus = read('syllabus.json'), sets = read('scenario-sets/seed.json');
const reviewFile = new URL('questions/quality-review.json', root);
const reviews = fs.existsSync(reviewFile) ? JSON.parse(fs.readFileSync(reviewFile, 'utf8')).questions : {};
const fingerprint = q => createHash('sha256').update(JSON.stringify(q)).digest('hex');
const issues = [...distributionIssues(questions)];
const add = (id, rule, detail) => issues.push({ id, severity: 'failure', rule, detail });
for (const q of questions) {
  if (!syllabus.domains.some(d => d.id === q.domainId && d.objectives.some(o => o.id === q.objectiveId))) add(q.id, 'objective', 'Unknown domain/objective');
  if (q.sourceIds.some(id => !sources.some(s => s.id === id))) add(q.id, 'source', 'Unknown source');
  if (q.difficulty === 'beginner') continue;
  const review = reviews[q.id];
  issues.push(...questionIssues(q, review));
  if (!review || review.fingerprint !== fingerprint(q)) add(q.id, 'stage-2', 'Missing or stale editorial review');
}
for (const set of sets) for (const id of set.questionIds) {
  if (!questions.some(q => q.id === id && q.scenarioSetId === set.id)) add(set.id, 'scenario-link', id);
}
for (const d of syllabus.domains) for (const o of d.objectives) {
  if (!questions.some(q => q.objectiveId === o.id && q.difficulty === 'advanced')) add(o.id, 'coverage', 'Exam question missing');
}
const groups = {};
for (const difficulty of ['beginner', 'intermediate', 'advanced']) {
  const qs = questions.filter(q => q.difficulty === difficulty);
  const qi = issues.filter(i => qs.some(q => q.id === i.id));
  const strongCount = qs.filter(q => q.choices.filter(c => !q.answer.includes(c.id) && (q.choiceQuality?.[c.id]?.plausibility ?? 0) >= 2).length >= 2).length;
  groups[difficulty] = { total: qs.length, ...positionDistribution(qs),
    byDomain: Object.fromEntries(syllabus.domains.map(d => [d.id, positionDistribution(qs.filter(q => q.domainId === d.id))])),
    weakDistractorQuestions: qi.filter(i => i.rule === 'distractors').length,
    potentialMultipleAnswer: qi.filter(i => i.rule === 'multiple-answer').length,
    choiceLengthBias: qi.filter(i => i.rule === 'length-bias').length,
    questionsWithTwoStrongDistractors: strongCount,
    twoStrongDistractorPercentage: qs.length ? strongCount / qs.length * 100 : 0,
    missingOrStaleReviews: qi.filter(i => i.rule === 'stage-2').length };
}
const report = { rubricVersion: 1, total: questions.length, groups, issues,
  passed: !issues.some(i => i.severity === 'failure'),
  note: 'Plausibility is an editorial score, not measured learner difficulty. Multiple-select is reported separately with correct occurrences as denominator.' };
const lines = ['# Applied / Exam Question Quality Report', '', `Total: ${questions.length}. Stage 2: separate editorial rubric review, content-fingerprint bound.`, '',
  '位置はUIの表示順で集計。保存用choice IDとは別です。複数選択は正解出現数を分母として別集計します。', '',
  'もっともらしさ・別解・本文なし推測は編集レビューの判断であり、実受験者による難易度測定ではありません。', ''];
for (const [difficulty, group] of Object.entries(groups)) {
  lines.push(`## ${difficulty === 'intermediate' ? 'Applied' : difficulty === 'advanced' ? 'Exam' : 'Foundation'} Questions`, '', `Total: ${group.total}`, '',
    '| Position | Count | Share |', '| --- | ---: | ---: |',
    ...group.single.counts.map((n, i) => `| ${'ABCD'[i]} | ${n} | ${group.single.percentages[i].toFixed(1)}% |`), '',
    `Multiple-select questions: ${group.multiple.questions}`, '',
    `Weak Distractor Questions: ${group.weakDistractorQuestions}`, '',
    `Potential Multiple Answer: ${group.potentialMultipleAnswer}`, '',
    `Choice Length Bias: ${group.choiceLengthBias}`, '',
    `Questions with >= 2 strong distractors: ${group.twoStrongDistractorPercentage.toFixed(1)}%`, '',
    `Missing/stale Stage 2 review: ${group.missingOrStaleReviews}`, '',
    '| Domain | Single-select N | A | B | C | D |', '| --- | ---: | ---: | ---: | ---: | ---: |',
    ...Object.entries(group.byDomain).map(([d, v]) => `| ${d} | ${v.single.questions} | ${v.single.counts.join(' | ')} |`), '');
}
lines.push('## Findings', '', ...issues.map(i => `- ${i.severity.toUpperCase()} ${i.id}: ${i.rule} — ${i.detail}`), '',
  'Domain × Difficultyは単一選択8問以上でしきい値を適用。13問を4位置に分けた4/13 = 30.8%は整数制約によるWarningとして残します。', '',
  '30%超はWarning、35%超はApplied/ExamのFailure。解説不足、弱いdistractor、未解消の別解、本文なし推測、未レビューまたは変更後の古いレビューもCIで検出します。', '',
  `Result: ${report.passed ? 'PASS' : 'FAIL'}`, '');
if (!process.argv.includes('--check')) {
  const output = new URL('../reports/', import.meta.url);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(new URL('question-quality.json', output), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(new URL('question-quality.md', output), lines.join('\n'));
}
console.log(lines.join('\n'));
if (!report.passed) process.exitCode = 1;
