import { describe, expect, it } from 'vitest';
import { glossaryTerms, questions } from '../lib/content';

describe('glossary ⇄ Foundation question coverage', () => {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const linked = glossaryTerms.filter((t) => (t as { basicQuestionId?: string }).basicQuestionId);
  const basicId = (t: unknown) => (t as { basicQuestionId: string }).basicQuestionId;

  it('points every basicQuestionId at an existing single-select Foundation question listed in questionIds', () => {
    expect(linked.length).toBe(glossaryTerms.length);
    for (const term of linked) {
      const q = byId.get(basicId(term));
      expect(q, `${term.id} -> ${basicId(term)}`).toBeDefined();
      expect(q!.difficulty).toBe('beginner');
      expect(q!.type).toBe('single-select');
      expect(term.questionIds).toContain(basicId(term));
    }
  });

  it('never uses one Foundation question as the basic question of two terms', () => {
    const ids = linked.map(basicId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps newly added glossary questions verified, single-answer and source-grounded', () => {
    const added = questions.filter((q) => q.contentRevision === 'glossary-coverage-2026-10-12');
    for (const q of added) {
      expect(q.status).toBe('verified');
      expect(q.answer).toHaveLength(1);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(glossaryTerms.some((t) => basicId(t) === q.id)).toBe(true);
    }
  });
});
