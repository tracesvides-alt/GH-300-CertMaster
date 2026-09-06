import { describe, it, expect } from 'vitest';
import { questions, questionSchema, validateAI, domains, objectives } from '../lib/content';
import { score, mastery, allocate, streak, type Attempt } from '../lib/learning';
import { LearningDB } from '../lib/db';
import { runTutor } from '../lib/ai';
const q = questions[0];
const attempt = (question = q, correct = true, at = Date.now()): Attempt => ({
  id: crypto.randomUUID(),
  questionId: question.id,
  objectiveId: question.objectiveId,
  domainId: question.domainId,
  answer: question.answer,
  correct,
  at,
  status: 'verified',
});
describe('content integrity', () => {
  it('validates every seed and six domain coverage', () => {
    expect(questions.every((q) => questionSchema.safeParse(q).success)).toBe(true);
    expect(new Set(questions.map((q) => q.domainId)).size).toBe(6);
  });
  it.each([
    { sourceIds: [] },
    { sourceIds: ['fake'] },
    { objectiveId: 'missing' },
    { answer: ['Z'] },
    { choiceExplanations: {} },
    { domainId: 'd9' },
    { choices: [q.choices[0], q.choices[0], q.choices[2], q.choices[3]] },
  ])('rejects malformed questions %j', (patch) =>
    expect(questionSchema.safeParse({ ...q, ...patch }).success).toBe(false),
  );
  it('supports multiple select and exact-set scoring', () => {
    const multi = questionSchema.parse({ ...q, type: 'multiple-select', answer: ['A', 'B'] });
    expect(score(multi, ['B', 'A'])).toBe(true);
    expect(score(multi, ['A'])).toBe(false);
    expect(score(multi, ['A', 'A'])).toBe(false);
  });
  it('scores single select', () => {
    expect(score(q, q.answer)).toBe(true);
    expect(score(q, [])).toBe(false);
    expect(score(q, ['Z'])).toBe(false);
  });
});
describe('learning calculations', () => {
  it('starts at zero, latest distinct answer wins and AI does not inflate mastery', () => {
    expect(mastery([]).readiness).toBe(0);
    expect(mastery([attempt(q, true, 1), attempt(q, false, 2)]).readiness).toBe(0);
    expect(mastery([{ ...attempt(), status: 'ai-generated' }]).readiness).toBe(0);
    expect(mastery([attempt(), attempt()]).readiness).toBe(mastery([attempt()]).readiness);
  });
  it('uses normalized midpoint weights and objective coverage', () => {
    const all = questions.map((q) => attempt(q));
    const result = mastery(all);
    const weight = domains.reduce((s, d) => s + (d.min + d.max) / 2, 0);
    const expected =
      domains.reduce(
        (s, d) =>
          s +
          ((d.objectives.filter((o) => questions.some((q) => q.objectiveId === o.id)).length /
            d.objectives.length) *
            100 *
            (d.min + d.max)) /
            2,
        0,
      ) / weight;
    expect(result.readiness).toBeCloseTo(expected);
    expect(result.readiness).toBeLessThanOrEqual(100);
  });
  it('allocates exact totals and satisfies feasible constraints for 1..200', () => {
    for (let n = 1; n <= 200; n++) {
      const { counts, feasible } = allocate(n);
      expect(counts.reduce((a, b) => a + b)).toBe(n);
      expect(counts.every(Number.isInteger)).toBe(true);
      if (feasible)
        counts.forEach((v, i) => {
          expect(v).toBeGreaterThanOrEqual(Math.ceil((n * domains[i].min) / 100));
          expect(v).toBeLessThanOrEqual(Math.floor((n * domains[i].max) / 100));
        });
    }
    expect(allocate(50).feasible).toBe(true);
    expect(allocate(6).feasible).toBe(false);
  });
  it('rejects invalid mock sizes', () => {
    for (const n of [0, -1, 1.5, 201, NaN]) expect(() => allocate(n)).toThrow();
  });
  it('counts local calendar streak across yesterday and today', () => {
    const today = new Date(2026, 8, 6, 12);
    const yesterday = new Date(2026, 8, 5, 12);
    expect(streak([attempt(q, true, +today), attempt(q, true, +yesterday)], today)).toBe(2);
  });
});
describe('IndexedDB', () => {
  it('persists attempts, bookmarks, generated questions and resumable mock after reopen', async () => {
    const name = 'test-' + crypto.randomUUID();
    const db = new LearningDB(name);
    await db.attempts.add(attempt());
    await db.bookmarks.put({ id: q.id });
    await db.generated.put({ ...q, id: 'ai-test', status: 'ai-generated', lastVerifiedAt: null });
    await db.sessions.put({
      id: 'mock',
      questions: [q],
      answers: { [q.id]: q.answer },
      index: 0,
      deadline: 123,
      completed: false,
    });
    db.close();
    const reopened = new LearningDB(name);
    expect(await reopened.attempts.count()).toBe(1);
    expect(await reopened.bookmarks.get(q.id)).toBeDefined();
    expect(await reopened.generated.count()).toBe(1);
    expect((await reopened.sessions.get('mock'))?.answers[q.id]).toEqual(q.answer);
    await reopened.delete();
  });
});
describe('AI provenance', () => {
  const generated = { ...q, status: 'ai-generated', lastVerifiedAt: null };
  it('rejects false verified status and irrelevant sources', () => {
    expect(() => validateAI(q, q.objectiveId, q.sourceIds)).toThrow();
    expect(() =>
      validateAI({ ...generated, sourceIds: ['prompt'] }, q.objectiveId, q.sourceIds),
    ).toThrow();
    expect(validateAI(generated, q.objectiveId, q.sourceIds).status).toBe('ai-generated');
  });
  it('validates and stamps generated output', async () => {
    const response = await runTutor(
      { action: 'similar', objectiveId: q.objectiveId },
      {
        complete: async (system, input) => {
          expect(input).toContain('trustedSourceFacts');
          expect(system).toContain('ai-generated');
          return JSON.stringify({ question: generated });
        },
      },
    );
    expect('question' in response && response.question?.id.startsWith('ai-')).toBe(true);
  });
  it('rejects empty-source output', async () => {
    await expect(
      runTutor(
        { action: 'generate', objectiveId: q.objectiveId },
        { complete: async () => JSON.stringify({ question: { ...generated, sourceIds: [] } }) },
      ),
    ).rejects.toThrow();
  });
  it('rejects uncovered objectives', async () => {
    const missing = objectives.find((o) => !questions.some((q) => q.objectiveId === o.id));
    if (missing) {
      await expect(
        runTutor({ action: 'generate', objectiveId: missing.id }, { complete: async () => '' }),
      ).rejects.toThrow('未収録');
    } else {
      expect(objectives.every((o) => questions.some((q) => q.objectiveId === o.id))).toBe(true);
      await expect(
        runTutor({ action: 'generate', objectiveId: 'd9o9' }, { complete: async () => '' }),
      ).rejects.toThrow('Objectiveが見つかりません');
    }
  });
});

// ────────────────────────────────────────────
// Knowledge Base tests (Phase 1)
// ────────────────────────────────────────────
import {
  lessonSchema,
  glossaryTermSchema,
  comparisonGuideSchema,
  officialSourceSchema,
  validateKnowledgeBase,
  searchGlossary,
  globalSearch,
  type KnowledgeBase,
} from '../lib/knowledge';
import {
  glossaryTerms,
  comparisonGuides,
  lessons,
  sources,
  buildKnowledgeBase,
} from '../lib/content';

describe('Knowledge Base schemas', () => {
  it('validates all lesson seed data', () => {
    for (const l of lessons) {
      const data = {
        id: l.id,
        title: l.title,
        slug: l.slug ?? l.id,
        domainId: l.domainId,
        objectiveIds: l.objectiveIds ?? l.relatedObjectives,
        syllabusVersion: l.syllabusVersion,
        summary: l.summary,
        estimatedMinutes: l.estimatedMinutes ?? 5,
        difficulty: l.difficulty ?? 'beginner',
        sections: l.sections ?? [],
        keyPoints: l.keyPoints,
        commonMistakes: l.commonMistakes,
        examTips: l.examTips,
        glossaryIds: l.glossaryIds ?? [],
        comparisonIds: l.comparisonIds ?? [],
        questionIds: l.questionIds ?? [],
        sourceIds: l.sourceIds ?? l.officialSources,
        lastVerifiedAt: l.lastVerifiedAt,
        status: l.status ?? 'verified',
      };
      expect(lessonSchema.safeParse(data).success).toBe(true);
    }
  });

  it('validates all glossary term seed data', () => {
    for (const g of glossaryTerms) {
      expect(glossaryTermSchema.safeParse(g).success).toBe(true);
    }
  });

  it('validates all comparison guide seed data', () => {
    for (const c of comparisonGuides) {
      expect(comparisonGuideSchema.safeParse(c).success).toBe(true);
    }
  });

  it('has at least 25 lessons, 100 glossary terms, and 10-15 comparison guides (Phase 4 targets)', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(25);
    expect(lessons.length).toBeLessThanOrEqual(35);
    expect(glossaryTerms.length).toBeGreaterThanOrEqual(100);
    expect(comparisonGuides.length).toBeGreaterThanOrEqual(10);
    expect(comparisonGuides.length).toBeLessThanOrEqual(15);
  });

  it('ensures each comparison guide has comprehensive axes, decision guide, and exam tips', () => {
    for (const guide of comparisonGuides) {
      expect(guide.comparedTermIds.length).toBeGreaterThanOrEqual(2);
      expect(guide.comparisonAxes.length).toBeGreaterThanOrEqual(2);
      expect(guide.decisionGuide.length).toBeGreaterThanOrEqual(2);
      expect(guide.commonTraps.length).toBeGreaterThanOrEqual(1);
      expect(guide.examTips.length).toBeGreaterThanOrEqual(1);
      expect(guide.sourceIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('covers 100% of all syllabus objectives with lessons', () => {
    const kb = buildKnowledgeBase();
    const allObjectiveIds = kb.objectives.map((o) => o.id);
    expect(allObjectiveIds.length).toBe(14);

    const coveredObjectiveIds = new Set<string>();
    for (const lesson of kb.lessons) {
      for (const oid of lesson.objectiveIds) {
        coveredObjectiveIds.add(oid);
      }
    }

    for (const oid of allObjectiveIds) {
      expect(coveredObjectiveIds.has(oid)).toBe(true);
    }
  });

  it('ensures each lesson has comprehensive sections, keyPoints, examTips, and sources', () => {
    for (const lesson of lessons) {
      expect((lesson.sections ?? []).length).toBeGreaterThanOrEqual(3);
      expect(lesson.keyPoints.length).toBeGreaterThanOrEqual(2);
      expect(lesson.examTips.length).toBeGreaterThanOrEqual(1);
      expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(1);
      expect((lesson.sourceIds ?? lesson.officialSources ?? []).length).toBeGreaterThanOrEqual(1);
      expect(lesson.estimatedMinutes).toBeGreaterThanOrEqual(5);
    }
  });

  it('covers 100% of all syllabus objectives with glossary terms', () => {
    const kb = buildKnowledgeBase();
    const allObjectiveIds = kb.objectives.map((o) => o.id);
    expect(allObjectiveIds.length).toBe(14);

    const coveredObjectiveIds = new Set<string>();
    for (const term of kb.glossaryTerms) {
      for (const oid of term.objectiveIds) {
        coveredObjectiveIds.add(oid);
      }
    }

    for (const oid of allObjectiveIds) {
      expect(coveredObjectiveIds.has(oid)).toBe(true);
    }
  });

  it('ensures each glossary term has valid examPoints, useCases, whyItMatters and sources', () => {
    for (const term of glossaryTerms) {
      expect(term.whyItMatters.trim().length).toBeGreaterThan(10);
      expect(term.useCases.length).toBeGreaterThanOrEqual(1);
      expect(term.examPoints.length).toBeGreaterThanOrEqual(1);
      expect(term.commonConfusions.length).toBeGreaterThanOrEqual(1);
      expect(term.sourceIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('rejects malformed lesson data', () => {
    expect(lessonSchema.safeParse({ id: 'x' }).success).toBe(false);
    expect(lessonSchema.safeParse({ ...lessons[0], sourceIds: [] }).success).toBe(false);
  });

  it('rejects malformed glossary term data', () => {
    expect(glossaryTermSchema.safeParse({ id: 'x' }).success).toBe(false);
  });
});

describe('Knowledge Base cross-reference validation', () => {
  it('validates the full KB without errors', () => {
    const kb = buildKnowledgeBase();
    const errors = validateKnowledgeBase(kb);
    expect(errors).toEqual([]);
  });

  it('detects broken glossary references', () => {
    const kb = buildKnowledgeBase();
    kb.glossaryTerms = [
      ...kb.glossaryTerms,
      {
        ...kb.glossaryTerms[0],
        id: 'g-broken',
        relatedTermIds: ['g-nonexistent'],
        lessonIds: ['lesson-fake'],
      },
    ];
    const errors = validateKnowledgeBase(kb);
    expect(errors.length).toBeGreaterThanOrEqual(2);
    expect(errors.some((e) => e.message.includes('g-nonexistent'))).toBe(true);
    expect(errors.some((e) => e.message.includes('lesson-fake'))).toBe(true);
  });

  it('detects broken lesson source references', () => {
    const kb = buildKnowledgeBase();
    kb.lessons = [
      ...kb.lessons,
      {
        ...kb.lessons[0],
        id: 'lesson-broken',
        sourceIds: ['src-does-not-exist'],
      },
    ];
    const errors = validateKnowledgeBase(kb);
    expect(errors.some((e) => e.id === 'lesson-broken' && e.field === 'sourceIds')).toBe(true);
  });

  it('detects syllabusVersion mismatch', () => {
    const kb = buildKnowledgeBase();
    kb.lessons = [
      ...kb.lessons,
      {
        ...kb.lessons[0],
        id: 'lesson-wrong-ver',
        syllabusVersion: '2025-01-01' as '2026-08-07',
      },
    ];
    const errors = validateKnowledgeBase(kb);
    expect(errors.some((e) => e.id === 'lesson-wrong-ver' && e.field === 'syllabusVersion')).toBe(true);
  });
});

describe('Glossary search', () => {
  it('filters by keyword', () => {
    const results = searchGlossary(glossaryTerms, { keyword: 'hallucination' });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((t) => t.id === 'g-hallucination')).toBe(true);
  });

  it('filters by domain', () => {
    const results = searchGlossary(glossaryTerms, { domainId: 'd6' });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.every((t) => t.domainIds.includes('d6'))).toBe(true);
  });

  it('filters by importance', () => {
    const results = searchGlossary(glossaryTerms, { importance: 'essential' });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.every((t) => t.importance === 'essential')).toBe(true);
  });

  it('returns all with empty filter', () => {
    expect(searchGlossary(glossaryTerms, {}).length).toBe(glossaryTerms.length);
  });

  it('combines filters', () => {
    const results = searchGlossary(glossaryTerms, { domainId: 'd4', importance: 'essential' });
    expect(results.every((t) => t.domainIds.includes('d4') && t.importance === 'essential')).toBe(true);
  });
});

describe('Global search', () => {
  const kb = buildKnowledgeBase();

  it('finds lessons by title', () => {
    const results = globalSearch(kb, '責任');
    expect(results.some((r) => r.type === 'Lesson')).toBe(true);
  });

  it('finds glossary terms by term name', () => {
    const results = globalSearch(kb, 'Hallucination');
    expect(results.some((r) => r.type === 'Glossary')).toBe(true);
  });

  it('finds comparison guides', () => {
    const results = globalSearch(kb, 'Agent Mode');
    expect(results.some((r) => r.type === 'Comparison')).toBe(true);
  });

  it('returns empty for empty query', () => {
    expect(globalSearch(kb, '').length).toBe(0);
    expect(globalSearch(kb, '  ').length).toBe(0);
  });

  it('returns empty for no matches', () => {
    expect(globalSearch(kb, 'xyznonexistent12345').length).toBe(0);
  });
});
