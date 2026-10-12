import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLearningAudit } from './audit-learning-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'content', 'gh300', '2026-08-07');
const read = (name) => JSON.parse(fs.readFileSync(path.join(base, name), 'utf8'));
const requirements = {
  d1o1: { subtopics: ['Generative AI risks and limitations', 'Ethical and responsible use', 'Potential harms and mitigation'], conceptIds: ['g-generative-ai', 'g-hallucination', 'g-responsible-ai', 'g-ai-bias', 'g-ip-copyright'] },
  d1o2: { subtopics: ['Validate AI output', 'Operate Copilot responsibly'], conceptIds: ['g-verification-validation', 'g-code-accountability', 'g-critical-evaluation', 'g-peer-review-ai'] },
  d2o1: { subtopics: ['Enable Copilot in IDE', 'Inline suggestions and Chat', 'Agent mode in IDE', 'Content exclusion awareness'], conceptIds: ['g-inline-suggestions', 'g-copilot-chat', 'g-agent-mode', 'g-content-exclusion'] },
  d2o2: { subtopics: ['Define and install CLI', 'Commands and interactive use', 'Sessions', 'Scripts and file management'], conceptIds: ['g-copilot-cli', 'g-cli-execution-confirm', 'g-agent-sessions'] },
  d2o3: { subtopics: ['Agent Mode, Copilot Edits, MCP', 'Agent Sessions and Sub-Agents', 'Code review, Spaces, Spark and PR summaries', 'Instructions and prompt files'], conceptIds: ['g-agent-mode', 'g-copilot-edits', 'g-mcp', 'g-agent-sessions', 'g-sub-agents', 'g-copilot-code-review', 'g-spaces', 'g-spark', 'g-pr-summaries', 'g-custom-instructions', 'g-prompt-files'] },
  d2o4: { subtopics: ['Organization policy and Code Review policy', 'Audit log events', 'Subscription REST API'], conceptIds: ['g-org-policies', 'g-code-review-policies', 'g-audit-logs', 'g-usage-metrics-api'] },
  d3o1: { subtopics: ['Data usage and flow', 'Input and prompt building', 'Proxy filtering and post-processing'], conceptIds: ['g-data-flow', 'g-context-gathering', 'g-prompt-construction', 'g-post-processing'] },
  d3o2: { subtopics: ['Suggestion lifecycle', 'LLM and Copilot limitations'], conceptIds: ['g-suggestion-lifecycle', 'g-context-window', 'g-knowledge-cutoff'] },
  d4o1: { subtopics: ['Prompt structure and context', 'Context determination', 'Zero-shot and few-shot'], conceptIds: ['g-prompt-anatomy', 'g-context-gathering', 'g-zero-shot', 'g-few-shot'] },
  d4o2: { subtopics: ['Prompt engineering process', 'Conversation history and refinement'], conceptIds: ['g-prompt-engineering', 'g-iterative-refinement', 'g-thread-reset', 'g-task-decomposition'] },
  d5o1: { subtopics: ['Generation, refactoring, documentation', 'Learning and context switching', 'Sample data and legacy modernization'], conceptIds: ['g-code-generation', 'g-code-refactoring', 'g-doc-generation', 'g-legacy-modernization'] },
  d5o2: { subtopics: ['Unit and integration tests', 'Edge cases and assertions', 'Security and performance improvement'], conceptIds: ['g-unit-test-generation', 'g-integration-test-generation', 'g-edge-case-discovery', 'g-vulnerability-remediation'] },
  d6o1: { subtopics: ['Content exclusion and editor settings', 'Output ownership and limitations'], conceptIds: ['g-content-exclusion', 'g-repo-content-exclusion', 'g-output-ownership', 'g-enterprise-data-privacy'] },
  d6o2: { subtopics: ['Suggestions matching public code', 'Troubleshoot suggestions and exclusions'], conceptIds: ['g-public-code-matching', 'g-exclusion-propagation', 'g-exclusion-limitations'] },
};

export function buildGapInventory() {
  const syllabus = read('syllabus.json');
  const lessons = read('lessons/seed.json');
  const glossary = read('glossary/terms.json');
  const comparisons = read('comparisons/guides.json');
  const sources = read('sources.json');
  const questions = read('questions/seed.json');
  const verifiedQuestions = questions.filter((item) => item.status === 'verified');
  const glossaryIds = new Set(glossary.map((item) => item.id));
  const lessonIds = new Set(lessons.map((item) => item.id));
  const sourceIds = new Set(sources.map((item) => item.id));
  const verifiedSourceIds = new Set(sources.filter((item) => item.status === 'verified').map((item) => item.id));
  const verifiedQuestionIds = new Set(verifiedQuestions.map((item) => item.id));
  const objectiveMap = syllabus.domains.flatMap((domain) => domain.objectives.map((objective) => {
    const required = requirements[objective.id];
    if (!required) throw new Error(`Requirement map missing ${objective.id}`);
    const missingConceptIds = required.conceptIds.filter((id) => !glossaryIds.has(id));
    return {
      domainId: domain.id, domain: domain.name, objectiveId: objective.id, objective: objective.title,
      subtopics: required.subtopics, requiredConceptIds: required.conceptIds, missingConceptIds,
      lessonIds: lessons.filter((item) => item.objectiveIds.includes(objective.id)).map((item) => item.id),
      glossaryIds: glossary.filter((item) => item.objectiveIds.includes(objective.id)).map((item) => item.id),
      comparisonIds: comparisons.filter((item) => item.objectiveIds.includes(objective.id)).map((item) => item.id),
      verifiedQuestionIds: verifiedQuestions.filter((item) => item.objectiveId === objective.id).map((item) => item.id),
    };
  }));
  const previousAudit = buildLearningAudit();
  return {
    auditedAt: '2026-10-12', syllabusVersion: syllabus.version,
    domains: syllabus.domains.map((item) => ({ id: item.id, title: item.title, weight: `${item.min}–${item.max}%`, objectiveIds: item.objectives.map((objective) => objective.id) })),
    objectiveMap,
    essentialChecklist: glossary.filter((item) => item.importance === 'essential').map((item) => ({
      glossaryId: item.id,
      term: item.term,
      lessonExists: item.lessonIds.some((id) => lessonIds.has(id)),
      glossaryExists: glossaryIds.has(item.id),
      officialSourceExists: item.sourceIds.some((id) => sourceIds.has(id)),
      verifiedOfficialSourceExists: item.sourceIds.some((id) => verifiedSourceIds.has(id)),
      directlyLinkedVerifiedQuestionExists: item.questionIds.some((id) => verifiedQuestionIds.has(id)),
    })),
    lessons: lessons.map(({ id, title, domainId, objectiveIds, glossaryIds, comparisonIds, questionIds, sourceIds, estimatedMinutes, status, lastVerifiedAt }) => ({ id, title, domainId, objectiveIds, glossaryIds, comparisonIds, questionIds, sourceIds, estimatedMinutes, status, lastVerifiedAt })),
    glossary: glossary.map(({ id, term, importance, domainIds, objectiveIds, relatedTermIds, lessonIds, comparisonIds, questionIds, sourceIds, status, lastVerifiedAt }) => ({ id, term, importance, domainIds, objectiveIds, relatedTermIds, lessonIds, comparisonIds, questionIds, sourceIds, status, lastVerifiedAt })),
    comparisons: comparisons.map(({ id, title, domainIds, objectiveIds, comparedTermIds, lessonIds, questionIds, sourceIds, status, lastVerifiedAt }) => ({ id, title, domainIds, objectiveIds, comparedTermIds, lessonIds, questionIds, sourceIds, status, lastVerifiedAt })),
    officialSources: sources.map(({ id, title, url, publisher, relatedObjectiveIds, relatedLessonIds, relatedGlossaryIds, relatedComparisonIds, status, lastCheckedAt, lastVerifiedAt }) => ({ id, title, url, publisher, relatedObjectiveIds, relatedLessonIds, relatedGlossaryIds, relatedComparisonIds, status, lastCheckedAt, lastVerifiedAt })),
    verifiedQuestions: verifiedQuestions.map(({ id, objectiveId, domainId, difficulty, question, sourceIds, lastVerifiedAt }) => ({ id, objectiveId, domainId, difficulty, question, sourceIds, lastVerifiedAt })),
    integrity: { brokenReferences: previousAudit.brokenReferences, verifiedWithoutOfficialSource: previousAudit.verifiedWithoutOfficialSource, activeVersionMismatch: previousAudit.activeVersionMismatch },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = buildGapInventory();
  fs.writeFileSync(path.join(root, 'reports', 'gh300-content-gap-inventory.json'), JSON.stringify(result, null, 2) + '\n');
  const missing = result.objectiveMap.flatMap((item) => item.missingConceptIds);
  const essentialWithoutLessonOrSource = result.essentialChecklist.filter((item) => !item.lessonExists || !item.officialSourceExists);
  console.log(JSON.stringify({ objectives: result.objectiveMap.length, lessons: result.lessons.length, glossary: result.glossary.length, comparisons: result.comparisons.length, sources: result.officialSources.length, verifiedQuestions: result.verifiedQuestions.length, missingConcepts: missing.length, essentialWithoutLessonOrSource: essentialWithoutLessonOrSource.length, essentialWithoutDirectQuestion: result.essentialChecklist.filter((item) => !item.directlyLinkedVerifiedQuestionExists).length, brokenReferences: result.integrity.brokenReferences.length }, null, 2));
  if (missing.length || essentialWithoutLessonOrSource.length || result.integrity.brokenReferences.length || result.integrity.activeVersionMismatch.length || result.integrity.verifiedWithoutOfficialSource.length) process.exitCode = 1;
}
