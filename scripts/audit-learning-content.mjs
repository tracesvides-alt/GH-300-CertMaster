import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(projectRoot, 'content', 'gh300', '2026-08-07');
const read = (relativePath) => JSON.parse(fs.readFileSync(path.join(base, relativePath), 'utf8'));
const lessonClassifications = {
  'lesson-d1-principles': 'MINOR_UPDATE',
  'lesson-d2-cli': 'MAJOR_UPDATE',
  'lesson-d2-mcp': 'MAJOR_UPDATE',
  'lesson-d3-data-flow': 'MAJOR_UPDATE',
  'lesson-d6-troubleshooting-limits': 'MAJOR_UPDATE',
};
const changedTerms = new Set(['g-cli-execution-confirm', 'g-cli-context-limits', 'g-copilot-extensions', 'g-copilot-cli', 'g-mcp', 'g-exclusion-limitations']);
const changedComparisons = new Set(['cmp-mcp-vs-extensions', 'cmp-exclusion-vs-publicmatch']);

export function buildLearningAudit(asOf = '2026-10-12') {
  const syllabus = read('syllabus.json');
  const lessons = read('lessons/seed.json');
  const glossary = read('glossary/terms.json');
  const comparisons = read('comparisons/guides.json');
  const sources = read('sources.json');
  const questions = read('questions/seed.json');
  const objectives = syllabus.domains.flatMap((domain) => domain.objectives.map((objective) => ({ ...objective, domainId: domain.id })));
  const daysSince = (date) => Math.floor((Date.parse(`${asOf}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / 86400000);
  const inventory = {
    lessons: lessons.map((entry) => ({ id: entry.id, title: entry.title, domainId: entry.domainId, objectiveIds: entry.objectiveIds, sourceIds: entry.sourceIds, syllabusVersion: entry.syllabusVersion, lastCheckedAt: asOf, lastVerifiedAt: entry.lastVerifiedAt, status: entry.status, classification: lessonClassifications[entry.id] ?? (entry.status === 'needs-review' ? 'NEEDS_REVIEW' : 'CURRENT'), staleCandidate: daysSince(entry.lastVerifiedAt) >= 90 })),
    glossary: glossary.map((entry) => ({ id: entry.id, title: entry.term, domainIds: entry.domainIds, objectiveIds: entry.objectiveIds, sourceIds: entry.sourceIds, syllabusVersion: entry.syllabusVersion, lastCheckedAt: asOf, lastVerifiedAt: entry.lastVerifiedAt, status: entry.status, classification: changedTerms.has(entry.id) ? 'UPDATED' : (entry.status === 'needs-review' ? 'NEEDS_REVIEW' : 'CURRENT'), staleCandidate: daysSince(entry.lastVerifiedAt) >= 90 })),
    comparisons: comparisons.map((entry) => ({ id: entry.id, title: entry.title, domainIds: entry.domainIds, objectiveIds: entry.objectiveIds, sourceIds: entry.sourceIds, syllabusVersion: entry.syllabusVersion, lastCheckedAt: asOf, lastVerifiedAt: entry.lastVerifiedAt, status: entry.status, classification: changedComparisons.has(entry.id) ? 'UPDATED' : (entry.status === 'needs-review' ? 'NEEDS_REVIEW' : 'CURRENT'), staleCandidate: daysSince(entry.lastVerifiedAt) >= 90 })),
    sources: sources.map((entry) => ({ id: entry.id, title: entry.title, url: entry.url, publisher: entry.publisher, domainIds: entry.relatedDomainIds, objectiveIds: entry.relatedObjectiveIds, syllabusVersion: entry.syllabusVersion, lastCheckedAt: entry.lastCheckedAt, lastVerifiedAt: entry.lastVerifiedAt, status: entry.status })),
  };
  const coverage = objectives.map((objective) => ({
    domainId: objective.domainId,
    objectiveId: objective.id,
    title: objective.title,
    lessonIds: lessons.filter((entry) => entry.objectiveIds.includes(objective.id)).map((entry) => entry.id),
    glossaryIds: glossary.filter((entry) => entry.objectiveIds.includes(objective.id)).map((entry) => entry.id),
    comparisonIds: comparisons.filter((entry) => entry.objectiveIds.includes(objective.id)).map((entry) => entry.id),
  }));
  const ids = {
    lesson: new Set(lessons.map((entry) => entry.id)),
    glossary: new Set(glossary.map((entry) => entry.id)),
    comparison: new Set(comparisons.map((entry) => entry.id)),
    source: new Set(sources.map((entry) => entry.id)),
    question: new Set(questions.map((entry) => entry.id)),
    objective: new Set(objectives.map((entry) => entry.id)),
  };
  const brokenReferences = [];
  const check = (from, target, values) => {
    for (const id of values ?? []) if (!ids[target].has(id)) brokenReferences.push({ from, target, id });
  };
  for (const entry of lessons) {
    for (const [target, field] of [['glossary', 'glossaryIds'], ['comparison', 'comparisonIds'], ['question', 'questionIds'], ['source', 'sourceIds'], ['objective', 'objectiveIds']]) check(entry.id, target, entry[field]);
  }
  for (const entry of glossary) {
    for (const [target, field] of [['lesson', 'lessonIds'], ['comparison', 'comparisonIds'], ['question', 'questionIds'], ['source', 'sourceIds'], ['objective', 'objectiveIds']]) check(entry.id, target, entry[field]);
  }
  for (const entry of comparisons) {
    for (const [target, field] of [['glossary', 'comparedTermIds'], ['lesson', 'lessonIds'], ['question', 'questionIds'], ['source', 'sourceIds'], ['objective', 'objectiveIds']]) check(entry.id, target, entry[field]);
  }
  for (const entry of sources) {
    for (const [target, field] of [['lesson', 'relatedLessonIds'], ['glossary', 'relatedGlossaryIds'], ['comparison', 'relatedComparisonIds'], ['question', 'relatedQuestionIds'], ['objective', 'relatedObjectiveIds']]) check(entry.id, target, entry[field]);
  }
  const items = [...lessons, ...glossary, ...comparisons];
  const officialPublishers = new Set(['Microsoft Learn', 'GitHub Docs', 'GitHub Blog', 'GitHub Terms', 'VS Code Docs']);
  const sourcesById = new Map(sources.map((entry) => [entry.id, entry]));
  const verifiedWithoutOfficialSource = items.filter((entry) => entry.status === 'verified' && !entry.sourceIds.some((id) => officialPublishers.has(sourcesById.get(id)?.publisher))).map((entry) => entry.id);
  const activeVersionMismatch = items.filter((entry) => entry.syllabusVersion !== syllabus.version).map((entry) => entry.id);
  const needsReview = items.filter((entry) => entry.status === 'needs-review').map((entry) => entry.id);
  const staleCandidates = Object.values(inventory).flat().filter((entry) => entry.staleCandidate).map((entry) => entry.id);
  const dashboard = {
    currentSyllabusVersion: syllabus.version,
    lastFullContentAudit: asOf,
    domainsCovered: new Set(coverage.filter((entry) => entry.lessonIds.length).map((entry) => entry.domainId)).size,
    domainCount: syllabus.domains.length,
    objectivesWithLessons: coverage.filter((entry) => entry.lessonIds.length).length,
    objectivesWithGlossary: coverage.filter((entry) => entry.glossaryIds.length).length,
    objectivesWithComparisons: coverage.filter((entry) => entry.comparisonIds.length).length,
    objectiveCount: coverage.length,
    lessonsVerified: lessons.filter((entry) => entry.status === 'verified').length,
    glossaryVerified: glossary.filter((entry) => entry.status === 'verified').length,
    comparisonsVerified: comparisons.filter((entry) => entry.status === 'verified').length,
    needsReview: needsReview.length,
    staleContent: staleCandidates.length,
  };
  return { auditDate: asOf, currentBlueprint: syllabus.version, dashboard, coverage, inventory, needsReview, staleCandidates, brokenReferences, verifiedWithoutOfficialSource, activeVersionMismatch, questionImpact: questions.filter((entry) => entry.status === 'needs-review').map((entry) => entry.id) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const audit = buildLearningAudit(process.argv[2] ?? '2026-10-12');
  fs.writeFileSync(path.join(projectRoot, 'reports', 'gh300-learning-content-audit.json'), JSON.stringify(audit, null, 2) + '\n');
  console.log(JSON.stringify(audit.dashboard, null, 2));
  if (audit.brokenReferences.length || audit.verifiedWithoutOfficialSource.length || audit.activeVersionMismatch.length) process.exitCode = 1;
}
