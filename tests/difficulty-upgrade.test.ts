import { describe, expect, it } from 'vitest';
import { questions, domains, scenarioSets, type Question } from '../lib/content';
import {
  selectQuestions,
  selectMockQuestions,
  defaultSelectionOptions,
} from '../lib/selection';
import { mastery, type Attempt } from '../lib/learning';
import { practiceResult } from '../lib/practice-session';

describe('Question Bank Difficulty Distribution', () => {
  it('has approximately 200 questions and matches difficulty targets', () => {
    expect(questions.length).toBeGreaterThanOrEqual(195);
    expect(questions.length).toBeLessThanOrEqual(205);

    const counts = {
      beginner: questions.filter((q) => q.difficulty === 'beginner').length,
      intermediate: questions.filter((q) => q.difficulty === 'intermediate').length,
      advanced: questions.filter((q) => q.difficulty === 'advanced').length,
    };

    const total = questions.length;
    const pBeginner = (counts.beginner / total) * 100;
    const pIntermediate = (counts.intermediate / total) * 100;
    const pAdvanced = (counts.advanced / total) * 100;

    // Targets: Foundation ~20% (15-25%), Applied ~40% (35-45%), Exam ~40% (35-45%)
    expect(pBeginner).toBeGreaterThanOrEqual(18);
    expect(pBeginner).toBeLessThanOrEqual(25);
    expect(pIntermediate).toBeGreaterThanOrEqual(35);
    expect(pIntermediate).toBeLessThanOrEqual(45);
    expect(pAdvanced).toBeGreaterThanOrEqual(35);
    expect(pAdvanced).toBeLessThanOrEqual(45);
  });

  it('covers all 6 domains with Exam-level (advanced) questions', () => {
    for (const domain of domains) {
      const advancedInDomain = questions.filter(
        (q) => q.domainId === domain.id && q.difficulty === 'advanced',
      );
      expect(advancedInDomain.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('ensures no duplicate question IDs, question texts, or duplicate choices', () => {
    const idSet = new Set<string>();
    const textSet = new Set<string>();

    for (const q of questions) {
      // Unique ID
      expect(idSet.has(q.id)).toBe(false);
      idSet.add(q.id);

      // Unique Question Text
      expect(textSet.has(q.question)).toBe(false);
      textSet.add(q.question);

      // Unique Choices within question
      const choiceTexts = q.choices.map((c) => c.text);
      expect(new Set(choiceTexts).size).toBe(q.choices.length);
      expect(q.choices.length).toBe(4);
    }
  });
});

describe('Scenario Sets Integration', () => {
  it('has 10 scenario sets with 2 to 4 questions each', () => {
    expect(scenarioSets.length).toBe(10);

    for (const set of scenarioSets) {
      expect(set.questionIds.length).toBeGreaterThanOrEqual(2);
      expect(set.questionIds.length).toBeLessThanOrEqual(4);
      expect(set.scenario.length).toBeGreaterThanOrEqual(50);
      expect(set.domainIds.length).toBeGreaterThanOrEqual(1);
      expect(set.sourceIds.length).toBeGreaterThanOrEqual(1);

      // All questionIds must exist in questions bank
      for (const qId of set.questionIds) {
        const found = questions.find((q) => q.id === qId);
        expect(found).toBeDefined();
        expect(found?.scenarioSetId).toBe(set.id);
        expect(found?.difficulty).toBe('advanced');
        expect(found?.examLike).toBe(true);
      }
    }
  });
});

describe('Exam Question Quality and Metadata Validation', () => {
  it('ensures all examLike questions have cognitiveLevel, sources, full choice explanations, and clues', () => {
    const examQuestions = questions.filter((q) => q.examLike || q.difficulty === 'advanced');
    expect(examQuestions.length).toBeGreaterThanOrEqual(75);

    for (const q of examQuestions) {
      // Must be apply or analyze
      expect(['apply', 'analyze']).toContain(q.cognitiveLevel);

      // Must have valid sources
      expect(q.sourceIds.length).toBeGreaterThanOrEqual(1);

      // Must have detailed overall explanation
      expect(q.explanation.length).toBeGreaterThanOrEqual(20);

      // Must have detailed explanation for ALL 4 choices
      expect(Object.keys(q.choiceExplanations)).toEqual(
        expect.arrayContaining(['A', 'B', 'C', 'D']),
      );
      for (const choiceId of ['A', 'B', 'C', 'D']) {
        expect(q.choiceExplanations[choiceId].length).toBeGreaterThanOrEqual(10);
      }

      // If exam-level, clues should exist for post-answer highlighting
      expect(q.clues).toBeDefined();
      expect(q.clues!.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('Practice Difficulty Mode Selection', () => {
  const dummyContext = { attempts: [], rng: () => 0.5 };

  it('selects predominantly foundation questions in foundation mode', () => {
    let beginnerCount = 0;
    const runs = 20;
    for (let i = 0; i < runs; i++) {
      const seed = (i + 1) * 17;
      let s = seed;
      const rng = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      const res = selectQuestions(
        questions,
        { ...defaultSelectionOptions, count: 20, difficultyMode: 'foundation' },
        { attempts: [], rng },
      );
      beginnerCount += res.questions.filter((q) => q.difficulty === 'beginner').length;
    }
    const avgBeginner = beginnerCount / runs;
    // Foundation mode should select significantly more beginner questions than balanced (~4/20)
    expect(avgBeginner).toBeGreaterThanOrEqual(8);
  });

  it('selects predominantly exam questions in exam mode', () => {
    let advancedCount = 0;
    const runs = 20;
    for (let i = 0; i < runs; i++) {
      const seed = (i + 1) * 31;
      let s = seed;
      const rng = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      const res = selectQuestions(
        questions,
        { ...defaultSelectionOptions, count: 20, difficultyMode: 'exam' },
        { attempts: [], rng },
      );
      advancedCount += res.questions.filter((q) => q.difficulty === 'advanced').length;
    }
    const avgAdvanced = advancedCount / runs;
    // Exam mode should select predominantly advanced questions (~12+/20)
    expect(avgAdvanced).toBeGreaterThanOrEqual(11);
  });
});

describe('Mock Exam Difficulty Distribution', () => {
  it('ensures Mock Exam focuses on Difficulty 2 & 3 with verified-only questions', () => {
    const res = selectMockQuestions(questions, 50, {
      attempts: [],
      rng: () => 0.5,
    });

    expect(res.questions.length).toBe(50);
    // Verified only
    expect(res.questions.every((q) => q.status === 'verified')).toBe(true);

    const counts = {
      beginner: res.questions.filter((q) => q.difficulty === 'beginner').length,
      intermediate: res.questions.filter((q) => q.difficulty === 'intermediate').length,
      advanced: res.questions.filter((q) => q.difficulty === 'advanced').length,
    };

    // Foundation should be minimal (<= 5 questions / <= 10%)
    expect(counts.beginner).toBeLessThanOrEqual(5);

    // Intermediate + Advanced should be >= 90% (>= 45 questions)
    expect(counts.intermediate + counts.advanced).toBeGreaterThanOrEqual(45);

    // Advanced should be prominent (>= 25 questions)
    expect(counts.advanced).toBeGreaterThanOrEqual(25);
  });
});

describe('Difficulty-Weighted Mastery & Result Analytics', () => {
  it('gives higher mastery contribution to advanced questions than beginner questions', () => {
    const d1Bank = questions.filter((q) => q.domainId === 'd1');
    const begQ = d1Bank.find((q) => q.difficulty === 'beginner')!;
    const advQ = d1Bank.find((q) => q.difficulty === 'advanced')!;

    const attemptBeg: Attempt = {
      id: 'a1',
      questionId: begQ.id,
      objectiveId: begQ.objectiveId,
      domainId: begQ.domainId,
      answer: begQ.answer,
      correct: true,
      at: 1000,
      status: 'verified',
    };

    const attemptAdv: Attempt = {
      id: 'a2',
      questionId: advQ.id,
      objectiveId: advQ.objectiveId,
      domainId: advQ.domainId,
      answer: advQ.answer,
      correct: true,
      at: 1000,
      status: 'verified',
    };

    // Both attempt arrays have 1 correct answer, but advQ has higher difficulty weight (1.4 vs 1.0)
    const mBeg = mastery([attemptBeg]);
    const mAdv = mastery([attemptAdv]);

    expect(mAdv.readiness).toBeGreaterThan(mBeg.readiness);
  });

  it('computes difficulty breakdown correctly in practiceResult', () => {
    const selected = questions.slice(0, 10);
    const answers: Attempt[] = selected.map((q, i) => ({
      id: `att-${i}`,
      questionId: q.id,
      objectiveId: q.objectiveId,
      domainId: q.domainId,
      answer: i % 2 === 0 ? q.answer : ['X'],
      correct: i % 2 === 0,
      at: Date.now(),
      status: q.status,
    }));

    const res = practiceResult({
      id: 'run-1',
      questions: selected,
      options: defaultSelectionOptions,
      beforeStats: {},
      answers,
      startedAt: Date.now() - 60000,
      completedAt: Date.now(),
    });

    expect(res.byDifficulty).toBeDefined();
    expect(res.byDifficulty.length).toBeGreaterThanOrEqual(1);

    const totalFromDiff = res.byDifficulty.reduce((s, d) => s + d.total, 0);
    const correctFromDiff = res.byDifficulty.reduce((s, d) => s + d.correct, 0);

    expect(totalFromDiff).toBe(selected.length);
    expect(correctFromDiff).toBe(answers.filter((a) => a.correct).length);
  });
});
