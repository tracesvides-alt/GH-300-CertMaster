import { describe, expect, it } from 'vitest';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import sources from '../content/gh300/2026-08-07/sources.json';
import audit from '../reports/question-choice-quality-audit.json';

describe('choice-quality inventory', () => {
  it('tracks every question and option without dropping or relabeling an answer', () => {
    const entries = Object.values(audit.byDifficulty).flat();
    expect(entries).toHaveLength(seed.length);
    expect(new Set(entries.map(q => q.questionId)).size).toBe(seed.length);
    const byId = new Map(seed.map(q => [q.id, q]));
    const sourceIds = new Set(sources.map(source => source.id));
    for (const row of entries) {
      const original = byId.get(row.questionId);
      expect(original).toBeDefined();
      expect(row.question).toBe(original!.question);
      expect(row.correctAnswer).toEqual(original!.answer);
      expect(row.choices).toHaveLength(4);
      for (const choice of row.choices) {
        expect(original!.choices.find(c => c.id === choice.id)?.text).toBe(choice.text);
        expect(choice.correct).toBe(original!.answer.includes(choice.id));
        expect(choice.explanation?.trim()).toBeTruthy();
        expect(choice.plausibility).toBeGreaterThanOrEqual(0);
        expect(choice.plausibility).toBeLessThanOrEqual(4);
        expect(choice.sourceIds.every(id => sourceIds.has(id))).toBe(true);
      }
    }
  });

  it('keeps the eight rewrites scenario-dependent and marks other semantic scores provisional', () => {
    const entries = Object.values(audit.byDifficulty).flat();
    expect(audit.modifiedQuestionIds).toHaveLength(8);
    for (const row of entries) {
      if (audit.modifiedQuestionIds.includes(row.questionId)) {
        expect(row.assessment).toBe('editorial-reviewed');
        expect(row.answerWithoutReading).toBe('PASS');
        expect(row.choices.filter(c => !c.correct && c.plausibility >= 3)).toHaveLength(2);
        expect(row.requirementMapping[0].correctReason).toBeTruthy();
        expect(Object.keys(row.requirementMapping[0].distractorFailures)).toHaveLength(3);
      } else {
        expect(row.assessment).toBe('screening-provisional');
      }
    }
  });
});
