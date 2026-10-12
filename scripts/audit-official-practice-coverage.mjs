import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'content', 'gh300', '2026-08-07');
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));

export function buildPracticeCoverageAudit() {
  const questions = read('reports/official-practice-question-inventory.json');
  const lessons = read('content/gh300/2026-08-07/lessons/seed.json');
  const glossary = read('content/gh300/2026-08-07/glossary/terms.json');
  const comparisons = read('content/gh300/2026-08-07/comparisons/guides.json');
  const sources = read('content/gh300/2026-08-07/sources.json');
  const syllabus = read('content/gh300/2026-08-07/syllabus.json');
  const ids = {
    lesson: new Set(lessons.map((item) => item.id)),
    glossary: new Set(glossary.map((item) => item.id)),
    comparison: new Set(comparisons.map((item) => item.id)),
    source: new Set(sources.map((item) => item.id)),
    objective: new Set(syllabus.domains.flatMap((domain) => domain.objectives.map((item) => item.id))),
  };
  const errors = [];
  if (questions.length !== 50) errors.push(`Expected 50 questions, found ${questions.length}`);
  for (const [index, item] of questions.entries()) {
    if (item.practiceQuestionId !== `PRACTICE-${String(index + 1).padStart(3, '0')}`) errors.push(`Question order/ID: ${index + 1}`);
    if (!ids.objective.has(item.objectiveId)) errors.push(`${item.practiceQuestionId}: unknown objective ${item.objectiveId}`);
    for (const [field, target] of [['lessonIds', 'lesson'], ['glossaryIds', 'glossary'], ['comparisonIds', 'comparison']]) {
      for (const id of item[field]) if (!ids[target].has(id)) errors.push(`${item.practiceQuestionId}: unknown ${target} ${id}`);
    }
    if (item.practiceStatus === 'CURRENT_PRACTICE' && !['COVERED', 'PARTIAL', 'MISSING'].includes(item.coverage))
      errors.push(`${item.practiceQuestionId}: invalid current coverage ${item.coverage}`);
    if (item.practiceStatus !== 'CURRENT_PRACTICE' && item.coverage !== item.practiceStatus)
      errors.push(`${item.practiceQuestionId}: obsolete/uncertain item counted as current`);
    if (!item.questionAnchor || !item.answerAnchor || !item.officialExplanation)
      errors.push(`${item.practiceQuestionId}: workbook evidence missing`);
  }
  for (const item of [...lessons, ...glossary, ...comparisons]) {
    if (!item.sourceIds?.some((id) => ids.source.has(id))) errors.push(`${item.id}: no official source`);
  }
  const baseline = Object.fromEntries(['COVERED', 'PARTIAL', 'MISSING', 'UNCERTAIN'].map((status) =>
    [status, questions.filter((item) => item.baselineCoverage === status).length]));
  const practiceIssues = Object.fromEntries(['PRACTICE_OUTDATED', 'PRACTICE_INCORRECT', 'NEEDS_REVIEW'].map((status) =>
    [status, questions.filter((item) => item.practiceStatus === status).map((item) => item.practiceQuestionId)]));
  const current = questions.filter((item) => item.practiceStatus === 'CURRENT_PRACTICE');
  const currentCoverage = Object.fromEntries(['COVERED', 'PARTIAL', 'MISSING'].map((status) =>
    [status, current.filter((item) => item.coverage === status).length]));
  return {
    auditedAt: '2026-10-12',
    source: 'GH300問題.xlsx; reports/official-practice-question-inventory.json',
    baseline, practiceIssues, currentPracticeCount: current.length, currentCoverage,
    currentOfficialKnowledgeCoveragePercent: current.length ? Math.round(1000 * currentCoverage.COVERED / current.length) / 10 : 0,
    currentAverageEditorialScore: current.length ? Math.round(10 * current.reduce((sum, item) => sum + item.coverageScore, 0) / current.length) / 10 : 0,
    errors,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const audit = buildPracticeCoverageAudit();
  fs.writeFileSync(path.join(root, 'reports', 'official-practice-remediation-audit.json'), JSON.stringify(audit, null, 2) + '\n');
  console.log(JSON.stringify(audit, null, 2));
  if (audit.errors.length) process.exitCode = 1;
}
