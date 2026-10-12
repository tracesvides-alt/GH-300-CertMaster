import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import sources from '../content/gh300/2026-08-07/sources.json';
import audit from '../reports/question-choice-quality-audit.json';
import baseline from '../reports/question-choice-content-baseline.json';

describe('choice-quality inventory', () => {
  it('tracks every question and option without dropping or relabeling an answer', () => {
    const entries = Object.values(audit.inventoryByDifficulty).flat();
    expect(entries).toHaveLength(seed.length);
    expect(new Set(entries.map(q => q.questionId)).size).toBe(seed.length);
    const byId = new Map(seed.map(q => [q.id, q]));
    const sourceIds = new Set(sources.map(source => source.id));
    for (const row of entries) {
      const original = byId.get(row.questionId);
      expect(original).toBeDefined();
      expect(row.question).toBe(original!.question);
      expect(row.correctAnswer).toEqual(original!.answer);
      expect(row.options).toHaveLength(4);
      for (const choice of row.options) {
        expect(original!.choices.find(c => c.id === choice.id)?.text).toBe(choice.text);
        expect(choice.correct).toBe(original!.answer.includes(choice.id));
        expect(choice.explanation?.trim()).toBeTruthy();
        expect(choice.plausibility).toBeGreaterThanOrEqual(0);
        expect(choice.plausibility).toBeLessThanOrEqual(4);
        expect(choice.sourceIds.every(id => sourceIds.has(id))).toBe(true);
      }
    }
  });

  it('records an option-only assessment and two plausible distractors for all 200 questions', () => {
    const entries = Object.values(audit.inventoryByDifficulty).flat();
    expect(audit.modifiedQuestionIds.length).toBeGreaterThan(0);
    expect(audit.warnings).toEqual([]);
    for (const row of entries) {
      expect(row.optionOnly).toBe('PASS');
      expect(row.optionOnlyReason).toBeTruthy();
      expect(row.multipleAnswerRisk).toBe(false);
      expect(row.lengthBias).toBe(false);
      expect(row.options.filter(c => !c.correct && c.plausibility >= 2).length).toBeGreaterThanOrEqual(2);
      if (row.difficulty === 'advanced') {
        expect(row.options.filter(c => !c.correct && c.plausibility >= 3).length).toBeGreaterThanOrEqual(2);
      }
      expect(row.requirementMapping[0].correctReason).toBeTruthy();
      expect(Object.keys(row.requirementMapping[0].distractorFailures)).toHaveLength(3);
    }
  });

  it('keeps the change count anchored to the fixed pre-review question snapshot', () => {
    expect(Object.keys(baseline.questions)).toHaveLength(seed.length);
    for (const q of seed) {
      const content = JSON.stringify({
        question: q.question,
        choices: q.choices,
        explanation: q.explanation,
        choiceExplanations: q.choiceExplanations,
      });
      const current = createHash('sha256').update(content).digest('hex');
      expect(audit.modifiedQuestionIds.includes(q.id)).toBe(
        current !== baseline.questions[q.id as keyof typeof baseline.questions].contentHash,
      );
    }
  });
});
