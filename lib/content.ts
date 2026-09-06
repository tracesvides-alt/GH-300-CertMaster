import { z } from 'zod';
import syllabus from '@/content/gh300/2026-08-07/syllabus.json';
import sourcesData from '@/content/gh300/2026-08-07/sources.json';
import lessonsData from '@/content/gh300/2026-08-07/lessons/seed.json';
import glossaryData from '@/content/gh300/2026-08-07/glossary/terms.json';
import comparisonsData from '@/content/gh300/2026-08-07/comparisons/guides.json';
import seeds from '@/content/gh300/2026-08-07/questions/seed.json';
import {
  type Lesson,
  type GlossaryTerm,
  type ComparisonGuide,
  type OfficialSource,
  type KnowledgeBase,
  validateKnowledgeBase,
  searchGlossary,
  globalSearch,
  type GlossaryFilter,
  type SearchResult,
} from './knowledge';

export { searchGlossary, globalSearch };
export type { GlossaryFilter, SearchResult, GlossaryTerm, ComparisonGuide, Lesson as KBLesson, OfficialSource };

export const domains = syllabus.domains,
  version = syllabus.version;
export const objectives = domains.flatMap((d) =>
  d.objectives.map((o) => ({ ...o, domainId: d.id })),
);

// ────────────────────────────────────────────
// Sources — backward compatible (accept legacy and extended)
// ────────────────────────────────────────────
export const sources = sourcesData as Array<{
  id: string;
  title: string;
  url: string;
  publisher: string;
  lastCheckedAt: string;
  syllabusVersion: string;
  relatedObjectiveIds: string[];
  sourceType?: string;
  relatedDomainIds?: string[];
  relatedLessonIds?: string[];
  relatedGlossaryIds?: string[];
  relatedComparisonIds?: string[];
  status?: string;
}>;

// ────────────────────────────────────────────
// Lessons — extended format with backward compat
// ────────────────────────────────────────────
type LessonRaw = (typeof lessonsData)[number];

export type LegacyLesson = {
  id: string;
  domainId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  commonMistakes: string[];
  examTips: string[];
  relatedObjectives: string[];
  officialSources: string[];
  lastVerifiedAt: string;
  syllabusVersion: string;
  // Extended fields
  slug?: string;
  objectiveIds?: string[];
  estimatedMinutes?: number;
  difficulty?: string;
  sections?: Array<{ heading: string; content: string }>;
  glossaryIds?: string[];
  comparisonIds?: string[];
  questionIds?: string[];
  sourceIds?: string[];
  status?: string;
};

// Map new format to include legacy aliases for backward compatibility
export const lessons: LegacyLesson[] = (lessonsData as LessonRaw[]).map((l) => ({
  ...l,
  // Legacy compat aliases
  relatedObjectives: (l as Record<string, unknown>).objectiveIds as string[] ?? [],
  officialSources: (l as Record<string, unknown>).sourceIds as string[] ?? [],
}));

// ────────────────────────────────────────────
// Glossary Terms
// ────────────────────────────────────────────
export const glossaryTerms = glossaryData as GlossaryTerm[];

// ────────────────────────────────────────────
// Comparison Guides
// ────────────────────────────────────────────
export const comparisonGuides = comparisonsData as ComparisonGuide[];

// ────────────────────────────────────────────
// Knowledge Base
// ────────────────────────────────────────────
export function buildKnowledgeBase(): KnowledgeBase {
  const ver = version as '2026-08-07';
  return {
    domains: domains.map((d, i) => ({
      id: d.id,
      title: d.title ?? d.name,
      description: d.name,
      weightMin: d.min,
      weightMax: d.max,
      order: i + 1,
      syllabusVersion: ver,
      name: d.name,
      min: d.min,
      max: d.max,
      topics: d.topics,
    })),
    objectives: objectives.map((o, i) => ({
      id: o.id,
      domainId: o.domainId,
      title: o.title,
      description: o.title,
      syllabusVersion: ver,
      order: i + 1,
      relatedLessonIds: lessons.filter((l) => l.relatedObjectives.includes(o.id)).map((l) => l.id),
      relatedGlossaryIds: glossaryTerms.filter((g) => g.objectiveIds.includes(o.id)).map((g) => g.id),
      relatedComparisonIds: comparisonGuides.filter((c) => c.objectiveIds.includes(o.id)).map((c) => c.id),
      relatedQuestionIds: questions.filter((q) => q.objectiveId === o.id).map((q) => q.id),
      sourceIds: sources.filter((s) => s.relatedObjectiveIds.includes(o.id)).map((s) => s.id),
    })),
    lessons: lessons.map((l) => ({
      id: l.id,
      title: l.title,
      slug: l.slug ?? l.id,
      domainId: l.domainId,
      objectiveIds: l.objectiveIds ?? l.relatedObjectives,
      syllabusVersion: l.syllabusVersion as '2026-08-07',
      summary: l.summary,
      estimatedMinutes: l.estimatedMinutes ?? 5,
      difficulty: (l.difficulty as 'beginner' | 'intermediate' | 'advanced') ?? 'beginner',
      sections: l.sections ?? [],
      keyPoints: l.keyPoints,
      commonMistakes: l.commonMistakes,
      examTips: l.examTips,
      glossaryIds: l.glossaryIds ?? [],
      comparisonIds: l.comparisonIds ?? [],
      questionIds: l.questionIds ?? [],
      sourceIds: l.sourceIds ?? l.officialSources,
      lastVerifiedAt: l.lastVerifiedAt,
      status: (l.status as 'draft' | 'verified' | 'needs-review') ?? 'verified',
    })),
    glossaryTerms,
    comparisonGuides,
    sources: sources.map((s) => ({
      id: s.id,
      title: s.title,
      url: s.url,
      publisher: s.publisher as 'Microsoft Learn' | 'GitHub Docs',
      sourceType: (s.sourceType as 'study-guide' | 'documentation' | 'tutorial' | 'reference') ?? 'documentation',
      syllabusVersion: s.syllabusVersion as '2026-08-07',
      relatedDomainIds: s.relatedDomainIds ?? [],
      relatedObjectiveIds: s.relatedObjectiveIds,
      relatedLessonIds: s.relatedLessonIds ?? [],
      relatedGlossaryIds: s.relatedGlossaryIds ?? [],
      relatedComparisonIds: s.relatedComparisonIds ?? [],
      lastCheckedAt: s.lastCheckedAt,
      status: (s.status as 'draft' | 'verified' | 'needs-review') ?? 'verified',
    })),
    questionIds: questions.map((q) => q.id),
    version,
  };
}

// ────────────────────────────────────────────
// Question schema (unchanged from original)
// ────────────────────────────────────────────
const nonempty = z.string().trim().min(1);
export const questionSchema = z
  .object({
    id: nonempty,
    syllabusVersion: z.literal('2026-08-07'),
    domainId: nonempty,
    objectiveId: nonempty,
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    type: z.enum(['single-select', 'multiple-select']),
    status: z.enum(['verified', 'ai-generated']),
    question: nonempty,
    choices: z.array(z.object({ id: nonempty, text: nonempty })).length(4),
    answer: z.array(nonempty).min(1),
    explanation: nonempty,
    choiceExplanations: z.record(z.string(), nonempty),
    sourceIds: z.array(nonempty).min(1),
    trustedSourceFacts: z.array(nonempty).optional(),
    createdAt: nonempty,
    lastVerifiedAt: z.string().nullable(),
  })
  .superRefine((q, c) => {
    const fail = (message: string) => c.addIssue({ code: 'custom', message });
    if (!objectives.some((o) => o.id === q.objectiveId && o.domainId === q.domainId))
      fail('Unknown objective/domain');
    if (
      new Set(q.choices.map((x) => x.id)).size !== 4 ||
      new Set(q.choices.map((x) => x.text)).size !== 4
    )
      fail('Duplicate choices');
    if (
      new Set(q.answer).size !== q.answer.length ||
      q.answer.some((a) => !q.choices.some((x) => x.id === a))
    )
      fail('Invalid answer');
    if (q.type === 'single-select' && q.answer.length !== 1) fail('Single answer required');
    if (q.choices.some((x) => !q.choiceExplanations[x.id])) fail('Every choice needs explanation');
    if (q.sourceIds.some((id) => !sources.some((s) => s.id === id))) fail('Unknown source');
    if (q.status === 'verified' && !q.lastVerifiedAt) fail('Verification date required');
  });
export type Question = z.infer<typeof questionSchema>;
export const questions = seeds.map((q) => questionSchema.parse(q));
export function validateAI(value: unknown, objectiveId: string, allowedSources: string[]) {
  const q = questionSchema.parse(value);
  if (
    q.status !== 'ai-generated' ||
    q.lastVerifiedAt !== null ||
    q.objectiveId !== objectiveId ||
    q.sourceIds.some((id) => !allowedSources.includes(id))
  )
    throw Error('AI provenance mismatch');
  return q;
}
