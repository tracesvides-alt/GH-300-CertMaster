import { describe, expect, it } from 'vitest';
import { questions, allQuestions, domains, scenarioSets, type Question } from '../lib/content';
import {
  selectQuestions,
  selectMockQuestions,
  defaultSelectionOptions,
} from '../lib/selection';
import { mastery, type Attempt } from '../lib/learning';
import { practiceResult } from '../lib/practice-session';
import difficultyReview from '../content/gh300/2026-08-07/questions/difficulty-review.json';
import rawQuestions from '../content/gh300/2026-08-07/questions/seed.json';
import { createHash } from 'node:crypto';

describe('Question Bank Difficulty Distribution', () => {
  it('classifies every question using a current editorial review rather than a target ratio', () => {
    expect(questions.length).toBeGreaterThanOrEqual(195);
    // Glossary coverage adds one Foundation question per term that lacked one (see scripts/glossary-question-drafts).
    expect(questions.length).toBeLessThanOrEqual(330);

    const counts = {
      beginner: questions.filter((q) => q.difficulty === 'beginner').length,
      intermediate: questions.filter((q) => q.difficulty === 'intermediate').length,
      advanced: questions.filter((q) => q.difficulty === 'advanced').length,
    };

    // Difficulty follows cognitive demand. Quotas must not promote recall items.
    expect(counts.advanced).toBeGreaterThanOrEqual(25); // Capacity for a 50-question mock.
    expect(counts.intermediate + counts.advanced).toBeGreaterThanOrEqual(50);
    expect(difficultyReview.status).toBe('reviewed');
    expect(Object.keys(difficultyReview.questions)).toHaveLength(allQuestions.length);
    for (const q of questions) {
      const row = difficultyReview.questions[q.id as keyof typeof difficultyReview.questions];
      expect(row.difficulty).toBe(q.difficulty);
      expect(row.assessment.trim()).toBeTruthy();
      const raw = rawQuestions.find(raw => raw.id === q.id)!;
      expect(row.fingerprint).toBe(createHash('sha256').update(JSON.stringify(raw)).digest('hex'));
      if (q.difficulty === 'advanced') {
        expect(q.cognitiveLevel).toBe('analyze');
        expect(row.reasoningSteps.length).toBeGreaterThanOrEqual(2);
        expect(row.counterfactual?.trim()).toBeTruthy();
      }
    }
  });

  it('covers all 6 domains with Exam-level (advanced) questions', () => {
    for (const domain of domains) {
      const advancedInDomain = questions.filter(
        (q) => q.domainId === domain.id && q.difficulty === 'advanced',
      );
      // Inventory follows reviewed demand; D3 currently has four independent Exam items.
      expect(advancedInDomain.length).toBeGreaterThanOrEqual(domain.id === 'd3' ? 4 : 5);
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
        const found = allQuestions.find((q) => q.id === qId);
        expect(found).toBeDefined();
        expect(found?.scenarioSetId).toBe(set.id);
        // A shared scenario does not by itself make a question Exam difficulty.
        expect(found?.examLike).toBe(found?.difficulty === 'advanced');
        expect(set.objectiveIds).toContain(found?.objectiveId);
      }
    }
  });
});

describe('Exam Question Quality and Metadata Validation', () => {
  it('ensures all examLike questions have cognitiveLevel, sources, full choice explanations, and clues', () => {
    const examQuestions = questions.filter((q) => q.examLike || q.difficulty === 'advanced');
    expect(examQuestions.length).toBeGreaterThanOrEqual(25);

    for (const q of examQuestions) {
      expect(q.cognitiveLevel).toBe('analyze');

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
      expect(q.clues!.every(clue => q.question.includes(clue))).toBe(true);
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
    // Selection uses weights, not hard difficulty quotas. A constant random
    // value repeatedly picks the same percentile and is not a distribution test.
    const runs = 100;
    const totals = { beginner: 0, intermediate: 0, advanced: 0 };
    const domainMin=Array(6).fill(Infinity),domainMax=Array(6).fill(0);
    for (let seed = 1; seed <= runs; seed++) {
      let state = seed;
      const rng = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
      const res = selectMockQuestions(questions, 50, { attempts: [], rng });
      expect(res.questions).toHaveLength(50);
      expect(new Set(res.questions.map(q => q.id)).size).toBe(50);
      expect(res.questions.every(q => q.status === 'verified')).toBe(true);
      expect(res.meetsRanges).toBe(true);
      res.counts.forEach((n,i)=>{domainMin[i]=Math.min(domainMin[i],n);domainMax[i]=Math.max(domainMax[i],n);});
      for (const q of res.questions) totals[q.difficulty]++;
    }
    expect(totals.beginner / runs).toBeLessThanOrEqual(5);
    expect((totals.intermediate + totals.advanced) / runs).toBeGreaterThanOrEqual(45);
    expect(totals.advanced / runs).toBeGreaterThanOrEqual(25);
    console.info('FEATURE_REFRESH_MOCK_SAMPLE '+JSON.stringify({runs,meanByLevel:Object.fromEntries(Object.entries(totals).map(([k,n])=>[k,n/runs])),domainMin,domainMax}));
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
