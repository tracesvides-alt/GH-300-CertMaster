import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import sources from '../content/gh300/2026-08-07/sources.json';
import audit from '../reports/question-choice-quality-audit.json';
import baseline from '../reports/question-choice-content-baseline.json';
import exclusions from '../content/gh300/2026-08-07/questions/selection-exclusions.json';
import additions from '../content/gh300/2026-08-07/questions/additions-review.json';
import repairs from '../reports/copilot-feature-quality-repairs-2026-10-16.json';
import {combinedChoiceBaseline} from '../scripts/question-additions.mjs';

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

  it('records quality decisions for all active questions without presenting archived items as passed', () => {
    const entries = Object.values(audit.inventoryByDifficulty).flat();
    expect(audit.modifiedQuestionIds.length).toBeGreaterThan(0);
    expect(audit.warnings).toEqual([]);
    for (const row of entries) {
      if (exclusions.questions.some(q => q.id === row.questionId)) {
        expect(row.optionOnly).toBe('EXCLUDED');
        continue;
      }
      expect(row.optionOnly).toBe('PASS');
      expect(row.optionOnlyReason).toBeTruthy();
      expect(row.multipleAnswerRisk).toBe(false);
      expect(row.lengthBias).toBe(false);
      expect(row.options.filter(c => !c.correct && c.plausibility >= 2).length).toBeGreaterThanOrEqual(2);
      if (row.difficulty === 'advanced') {
        // An assigned score of 3 is not evidence that a distractor is difficult.
        // Bind each current Exam item to its actual explanation and alternate case.
        const record = repairs.questions.find(r => r.id === row.questionId)!;
        expect(record).toBeDefined();
        expect(record.review.reasoningSteps).toHaveLength(3);
        expect(row.correctAnswer).not.toContain(record.review.counterfactual.answerId);
        expect(row.options.some(c => c.id === record.review.counterfactual.answerId)).toBe(true);
        for (const c of row.options.filter(c => !c.correct)) {
          expect(c.explanation).toBe(Object.entries(record.after.choiceExplanations).find(([id]) => id === c.id)?.[1]);
          expect(c.explanation.trim()).toBeTruthy();
        }
      }
      expect(row.requirementMapping[0].correctReason).toBeTruthy();
      expect(Object.keys(row.requirementMapping[0].distractorFailures)).toHaveLength(3);
    }
  });

  it('keeps the change count anchored to the fixed pre-review question snapshot', () => {
    const combined = combinedChoiceBaseline(baseline, additions);
    expect(Object.keys(combined.questions)).toHaveLength(seed.length);
    expect(Object.keys(baseline.questions)).toHaveLength(additions.baseline.stored);
    for (const q of seed) {
      const content = JSON.stringify({
        question: q.question,
        choices: q.choices,
        explanation: q.explanation,
        choiceExplanations: q.choiceExplanations,
      });
      const current = createHash('sha256').update(content).digest('hex');
      expect(audit.modifiedQuestionIds.includes(q.id)).toBe(
        current !== combined.questions[q.id].contentHash,
      );
    }
  });
});
