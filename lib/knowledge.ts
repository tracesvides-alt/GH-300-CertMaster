import { z } from 'zod';

// ────────────────────────────────────────────
// Shared primitives
// ────────────────────────────────────────────
const nonempty = z.string().trim().min(1);
const syllabusVersionLiteral = z.literal('2026-08-07');

export const contentStatus = z.enum(['draft', 'verified', 'needs-review']);
export type ContentStatus = z.infer<typeof contentStatus>;

export const importanceLevel = z.enum(['essential', 'important', 'supplementary']);
export type ImportanceLevel = z.infer<typeof importanceLevel>;

export const difficulty = z.enum(['beginner', 'intermediate', 'advanced']);
export type Difficulty = z.infer<typeof difficulty>;

export const publisherEnum = z.enum(['Microsoft Learn', 'GitHub Docs']);

// ────────────────────────────────────────────
// Domain
// ────────────────────────────────────────────
export const domainSchema = z.object({
  id: nonempty,
  title: nonempty,
  description: nonempty,
  weightMin: z.number().int().min(0).max(100),
  weightMax: z.number().int().min(0).max(100),
  order: z.number().int().min(1),
  syllabusVersion: syllabusVersionLiteral,
  // Legacy compat fields from existing syllabus.json
  name: nonempty.optional(),
  min: z.number().int().min(0).max(100).optional(),
  max: z.number().int().min(0).max(100).optional(),
  topics: z.array(nonempty).optional(),
});
export type Domain = z.infer<typeof domainSchema>;

// ────────────────────────────────────────────
// Objective
// ────────────────────────────────────────────
export const objectiveSchema = z.object({
  id: nonempty,
  domainId: nonempty,
  title: nonempty,
  description: nonempty,
  syllabusVersion: syllabusVersionLiteral,
  order: z.number().int().min(1),
  relatedLessonIds: z.array(nonempty).default([]),
  relatedGlossaryIds: z.array(nonempty).default([]),
  relatedComparisonIds: z.array(nonempty).default([]),
  relatedQuestionIds: z.array(nonempty).default([]),
  sourceIds: z.array(nonempty).default([]),
});
export type Objective = z.infer<typeof objectiveSchema>;

// ────────────────────────────────────────────
// Lesson Section
// ────────────────────────────────────────────
export const lessonSectionSchema = z.object({
  heading: nonempty,
  content: nonempty,
});
export type LessonSection = z.infer<typeof lessonSectionSchema>;

// ────────────────────────────────────────────
// Lesson
// ────────────────────────────────────────────
export const lessonSchema = z.object({
  id: nonempty,
  title: nonempty,
  slug: nonempty,
  domainId: nonempty,
  objectiveIds: z.array(nonempty).min(1),
  syllabusVersion: syllabusVersionLiteral,
  summary: nonempty,
  estimatedMinutes: z.number().int().min(1).max(60),
  difficulty,
  sections: z.array(lessonSectionSchema).default([]),
  keyPoints: z.array(nonempty).min(1),
  commonMistakes: z.array(nonempty).default([]),
  examTips: z.array(nonempty).default([]),
  glossaryIds: z.array(nonempty).default([]),
  comparisonIds: z.array(nonempty).default([]),
  questionIds: z.array(nonempty).default([]),
  sourceIds: z.array(nonempty).min(1),
  lastVerifiedAt: nonempty,
  status: contentStatus,
});
export type Lesson = z.infer<typeof lessonSchema>;

// ────────────────────────────────────────────
// GlossaryTerm
// ────────────────────────────────────────────
export const glossaryTermSchema = z.object({
  id: nonempty,
  term: nonempty,
  fullName: nonempty,
  aliases: z.array(nonempty).default([]),
  shortDefinition: nonempty,
  detailedDefinition: nonempty,
  category: nonempty,
  importance: importanceLevel,
  domainIds: z.array(nonempty).min(1),
  objectiveIds: z.array(nonempty).min(1),
  whyItMatters: nonempty,
  useCases: z.array(nonempty).default([]),
  examPoints: z.array(nonempty).default([]),
  commonConfusions: z.array(nonempty).default([]),
  relatedTermIds: z.array(nonempty).default([]),
  lessonIds: z.array(nonempty).default([]),
  comparisonIds: z.array(nonempty).default([]),
  questionIds: z.array(nonempty).default([]),
  sourceIds: z.array(nonempty).min(1),
  syllabusVersion: syllabusVersionLiteral,
  lastVerifiedAt: nonempty,
  status: contentStatus,
});
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;

// ────────────────────────────────────────────
// ComparisonAxis
// ────────────────────────────────────────────
export const comparisonAxisSchema = z.object({
  axis: nonempty,
  values: z.array(nonempty).min(2),
});
export type ComparisonAxis = z.infer<typeof comparisonAxisSchema>;

// ────────────────────────────────────────────
// ComparisonGuide
// ────────────────────────────────────────────
export const comparisonGuideSchema = z.object({
  id: nonempty,
  title: nonempty,
  slug: nonempty,
  summary: nonempty,
  comparedTermIds: z.array(nonempty).min(2),
  domainIds: z.array(nonempty).min(1),
  objectiveIds: z.array(nonempty).min(1),
  comparisonAxes: z.array(comparisonAxisSchema).min(1),
  decisionGuide: z.array(nonempty).min(1),
  commonTraps: z.array(nonempty).default([]),
  examTips: z.array(nonempty).default([]),
  lessonIds: z.array(nonempty).default([]),
  questionIds: z.array(nonempty).default([]),
  sourceIds: z.array(nonempty).min(1),
  syllabusVersion: syllabusVersionLiteral,
  lastVerifiedAt: nonempty,
  status: contentStatus,
});
export type ComparisonGuide = z.infer<typeof comparisonGuideSchema>;

// ────────────────────────────────────────────
// OfficialSource
// ────────────────────────────────────────────
export const officialSourceSchema = z.object({
  id: nonempty,
  title: nonempty,
  url: z.string().url(),
  publisher: publisherEnum,
  sourceType: z.enum(['study-guide', 'documentation', 'tutorial', 'reference']).default('documentation'),
  syllabusVersion: syllabusVersionLiteral,
  relatedDomainIds: z.array(nonempty).default([]),
  relatedObjectiveIds: z.array(nonempty).default([]),
  relatedLessonIds: z.array(nonempty).default([]),
  relatedGlossaryIds: z.array(nonempty).default([]),
  relatedComparisonIds: z.array(nonempty).default([]),
  lastCheckedAt: nonempty,
  status: contentStatus.default('verified'),
});
export type OfficialSource = z.infer<typeof officialSourceSchema>;

// ────────────────────────────────────────────
// ScenarioSet (Multi-question scenario context)
// ────────────────────────────────────────────
export const cognitiveLevelEnum = z.enum(['recall', 'understand', 'apply', 'analyze']);
export type CognitiveLevel = z.infer<typeof cognitiveLevelEnum>;

export const scenarioSetSchema = z.object({
  id: nonempty,
  title: nonempty,
  scenario: nonempty,
  domainIds: z.array(nonempty).min(1),
  objectiveIds: z.array(nonempty).min(1),
  difficulty: difficulty,
  questionIds: z.array(nonempty).min(2),
  sourceIds: z.array(nonempty).min(1),
  syllabusVersion: syllabusVersionLiteral,
  lastVerifiedAt: nonempty,
  status: contentStatus.default('verified'),
});
export type ScenarioSet = z.infer<typeof scenarioSetSchema>;

// ────────────────────────────────────────────
// Knowledge Base container
// ────────────────────────────────────────────
export type KnowledgeBase = {
  domains: Domain[];
  objectives: Objective[];
  lessons: Lesson[];
  glossaryTerms: GlossaryTerm[];
  comparisonGuides: ComparisonGuide[];
  sources: OfficialSource[];
  scenarioSets?: ScenarioSet[];
  questionIds: string[];
  version: string;
};

// ────────────────────────────────────────────
// Cross-reference validation
// ────────────────────────────────────────────
export type ValidationError = {
  entity: string;
  id: string;
  field: string;
  message: string;
};

export function validateKnowledgeBase(kb: KnowledgeBase): ValidationError[] {
  const errors: ValidationError[] = [];
  const ids = {
    domains: new Set(kb.domains.map((d) => d.id)),
    objectives: new Set(kb.objectives.map((o) => o.id)),
    lessons: new Set(kb.lessons.map((l) => l.id)),
    glossary: new Set(kb.glossaryTerms.map((g) => g.id)),
    comparisons: new Set(kb.comparisonGuides.map((c) => c.id)),
    sources: new Set(kb.sources.map((s) => s.id)),
    questions: new Set(kb.questionIds),
  };

  function checkRefs(
    entity: string,
    id: string,
    field: string,
    refs: string[],
    validSet: Set<string>,
    targetName: string,
  ) {
    for (const ref of refs) {
      if (!validSet.has(ref)) {
        errors.push({ entity, id, field, message: `${targetName} "${ref}" not found` });
      }
    }
  }

  // Objective validation
  for (const o of kb.objectives) {
    checkRefs('Objective', o.id, 'domainId', [o.domainId], ids.domains, 'Domain');
    checkRefs('Objective', o.id, 'relatedLessonIds', o.relatedLessonIds, ids.lessons, 'Lesson');
    checkRefs('Objective', o.id, 'relatedGlossaryIds', o.relatedGlossaryIds, ids.glossary, 'GlossaryTerm');
    checkRefs('Objective', o.id, 'relatedComparisonIds', o.relatedComparisonIds, ids.comparisons, 'ComparisonGuide');
    checkRefs('Objective', o.id, 'relatedQuestionIds', o.relatedQuestionIds, ids.questions, 'Question');
    checkRefs('Objective', o.id, 'sourceIds', o.sourceIds, ids.sources, 'Source');
    if (o.syllabusVersion !== kb.version) {
      errors.push({ entity: 'Objective', id: o.id, field: 'syllabusVersion', message: `Expected "${kb.version}", got "${o.syllabusVersion}"` });
    }
  }

  // Lesson validation
  for (const l of kb.lessons) {
    checkRefs('Lesson', l.id, 'domainId', [l.domainId], ids.domains, 'Domain');
    checkRefs('Lesson', l.id, 'objectiveIds', l.objectiveIds, ids.objectives, 'Objective');
    checkRefs('Lesson', l.id, 'glossaryIds', l.glossaryIds, ids.glossary, 'GlossaryTerm');
    checkRefs('Lesson', l.id, 'comparisonIds', l.comparisonIds, ids.comparisons, 'ComparisonGuide');
    checkRefs('Lesson', l.id, 'questionIds', l.questionIds, ids.questions, 'Question');
    checkRefs('Lesson', l.id, 'sourceIds', l.sourceIds, ids.sources, 'Source');
    if (l.syllabusVersion !== kb.version) {
      errors.push({ entity: 'Lesson', id: l.id, field: 'syllabusVersion', message: `Expected "${kb.version}", got "${l.syllabusVersion}"` });
    }
  }

  // Glossary validation
  for (const g of kb.glossaryTerms) {
    checkRefs('GlossaryTerm', g.id, 'domainIds', g.domainIds, ids.domains, 'Domain');
    checkRefs('GlossaryTerm', g.id, 'objectiveIds', g.objectiveIds, ids.objectives, 'Objective');
    checkRefs('GlossaryTerm', g.id, 'relatedTermIds', g.relatedTermIds, ids.glossary, 'GlossaryTerm');
    checkRefs('GlossaryTerm', g.id, 'lessonIds', g.lessonIds, ids.lessons, 'Lesson');
    checkRefs('GlossaryTerm', g.id, 'comparisonIds', g.comparisonIds, ids.comparisons, 'ComparisonGuide');
    checkRefs('GlossaryTerm', g.id, 'questionIds', g.questionIds, ids.questions, 'Question');
    checkRefs('GlossaryTerm', g.id, 'sourceIds', g.sourceIds, ids.sources, 'Source');
    if (g.syllabusVersion !== kb.version) {
      errors.push({ entity: 'GlossaryTerm', id: g.id, field: 'syllabusVersion', message: `Expected "${kb.version}", got "${g.syllabusVersion}"` });
    }
  }

  // Comparison validation
  for (const c of kb.comparisonGuides) {
    checkRefs('ComparisonGuide', c.id, 'comparedTermIds', c.comparedTermIds, ids.glossary, 'GlossaryTerm');
    checkRefs('ComparisonGuide', c.id, 'domainIds', c.domainIds, ids.domains, 'Domain');
    checkRefs('ComparisonGuide', c.id, 'objectiveIds', c.objectiveIds, ids.objectives, 'Objective');
    checkRefs('ComparisonGuide', c.id, 'lessonIds', c.lessonIds, ids.lessons, 'Lesson');
    checkRefs('ComparisonGuide', c.id, 'questionIds', c.questionIds, ids.questions, 'Question');
    checkRefs('ComparisonGuide', c.id, 'sourceIds', c.sourceIds, ids.sources, 'Source');
    if (c.syllabusVersion !== kb.version) {
      errors.push({ entity: 'ComparisonGuide', id: c.id, field: 'syllabusVersion', message: `Expected "${kb.version}", got "${c.syllabusVersion}"` });
    }
  }

  // Source validation
  for (const s of kb.sources) {
    checkRefs('OfficialSource', s.id, 'relatedDomainIds', s.relatedDomainIds, ids.domains, 'Domain');
    checkRefs('OfficialSource', s.id, 'relatedObjectiveIds', s.relatedObjectiveIds, ids.objectives, 'Objective');
    checkRefs('OfficialSource', s.id, 'relatedLessonIds', s.relatedLessonIds, ids.lessons, 'Lesson');
    checkRefs('OfficialSource', s.id, 'relatedGlossaryIds', s.relatedGlossaryIds, ids.glossary, 'GlossaryTerm');
    checkRefs('OfficialSource', s.id, 'relatedComparisonIds', s.relatedComparisonIds, ids.comparisons, 'ComparisonGuide');
    if (s.syllabusVersion !== kb.version) {
      errors.push({ entity: 'OfficialSource', id: s.id, field: 'syllabusVersion', message: `Expected "${kb.version}", got "${s.syllabusVersion}"` });
    }
  }

  return errors;
}

// ────────────────────────────────────────────
// Glossary search
// ────────────────────────────────────────────
export type GlossaryFilter = {
  keyword?: string;
  domainId?: string;
  importance?: ImportanceLevel;
  category?: string;
};

export function searchGlossary(
  terms: GlossaryTerm[],
  filter: GlossaryFilter,
): GlossaryTerm[] {
  let result = [...terms];
  if (filter.domainId && filter.domainId !== 'all') {
    result = result.filter((t) => t.domainIds.includes(filter.domainId!));
  }
  if (filter.importance) {
    result = result.filter((t) => t.importance === filter.importance);
  }
  if (filter.category && filter.category !== 'all') {
    result = result.filter((t) => t.category === filter.category);
  }
  if (filter.keyword) {
    const kw = filter.keyword.toLowerCase();
    result = result.filter(
      (t) =>
        t.term.toLowerCase().includes(kw) ||
        t.fullName.toLowerCase().includes(kw) ||
        t.aliases.some((a) => a.toLowerCase().includes(kw)) ||
        t.shortDefinition.toLowerCase().includes(kw),
    );
  }
  return result;
}

// ────────────────────────────────────────────
// Global search
// ────────────────────────────────────────────
export type SearchResult = {
  type: 'Lesson' | 'Glossary' | 'Comparison';
  id: string;
  title: string;
  detail: string;
};

export function globalSearch(
  kb: KnowledgeBase,
  query: string,
): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const l of kb.lessons) {
    if (
      l.title.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.sections.some((s) => s.content.toLowerCase().includes(q))
    ) {
      results.push({ type: 'Lesson', id: l.id, title: l.title, detail: l.summary });
    }
  }

  for (const g of kb.glossaryTerms) {
    if (
      g.term.toLowerCase().includes(q) ||
      g.fullName.toLowerCase().includes(q) ||
      g.aliases.some((a) => a.toLowerCase().includes(q)) ||
      g.shortDefinition.toLowerCase().includes(q)
    ) {
      results.push({ type: 'Glossary', id: g.id, title: g.term, detail: g.shortDefinition });
    }
  }

  for (const c of kb.comparisonGuides) {
    if (c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)) {
      results.push({ type: 'Comparison', id: c.id, title: c.title, detail: c.summary });
    }
  }

  return results;
}
