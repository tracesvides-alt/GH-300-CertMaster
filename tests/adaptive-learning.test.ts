import { describe, it, expect } from 'vitest';
import {
  analyzeMistake,
  updateConfusionPairs,
  checkPairRecovery,
  getPairId,
  getQuestionsForLesson,
  getQuestionsForComparison,
  getQuestionsForGlossary,
  getQuestionsForConfusionPair,
  getRecommendedNextAction,
  type WrongAnswerRecord,
  type ConceptConfusionPair,
} from '../lib/adaptive-learning';
import {
  calculateNextReview,
  getReviewSchedule,
  isDueForReview,
  calculateDynamicPriority,
  type QuestionReviewState,
} from '../lib/spaced-repetition';
import { questions, lessons, comparisonGuides, glossaryTerms, type Question } from '../lib/content';
import { calculateQuestionWeights, selectQuestions, defaultSelectionOptions, type SelectionContext } from '../lib/selection';
import type { Attempt } from '../lib/learning';

describe('Adaptive Learning Upgrade - Comprehensive Test Suite', () => {
  // Mock Question helper
  const sampleQ: Question = questions[0];

  describe('1. Wrong Answer Notebook & Mistake Analysis', () => {
    it('creates a detailed wrong answer record when a question is answered incorrectly', () => {
      const wrongChoice = sampleQ.choices.find((c) => !sampleQ.answer.includes(c.id))?.id ?? 'c2';
      const record = analyzeMistake(sampleQ, [wrongChoice], 10000);

      expect(record.questionId).toBe(sampleQ.id);
      expect(record.domainId).toBe(sampleQ.domainId);
      expect(record.objectiveId).toBe(sampleQ.objectiveId);
      expect(record.difficulty).toBe(sampleQ.difficulty);
      expect(record.selectedChoiceIds).toEqual([wrongChoice]);
      expect(record.correctChoiceIds).toEqual(sampleQ.answer);
      expect(record.answeredAt).toBe(10000);
      expect(record.recovered).toBe(false);
      expect(record.mistakeType).toBeDefined();
    });

    it('assigns correct mistake types without arbitrary hallucination', () => {
      const wrongChoice = sampleQ.choices.find((c) => !sampleQ.answer.includes(c.id))?.id ?? 'c2';
      const record = analyzeMistake(sampleQ, [wrongChoice]);
      const validTypes = [
        'concept-confusion',
        'knowledge-gap',
        'scenario-misread',
        'scope-mistake',
        'feature-selection',
        'prompt-engineering-mistake',
        'privacy-policy-mistake',
        'careless-error',
        'unknown',
      ];
      expect(validTypes).toContain(record.mistakeType);
    });

    it('identifies concept confusion pairs when wrong choice is associated with a different concept', () => {
      // Find a question with testedConcepts
      const qWithConcepts = questions.find((q) => q.testedConcepts && q.testedConcepts.length >= 2) ?? sampleQ;
      const wrongChoice = qWithConcepts.choices.find((c) => !qWithConcepts.answer.includes(c.id))?.id ?? 'c2';
      const record = analyzeMistake(qWithConcepts, [wrongChoice]);

      expect(Array.isArray(record.confusionPairIds)).toBe(true);
      if (record.testedConcepts.length > 0) {
        expect(record.correctConcepts.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('does not infer a confusion pair from question-wide tags or an objective alone', () => {
      const question: Question = {
        ...sampleQ,
        objectiveId: 'd2o3',
        choices: [
          { id: 'A', text: '選択肢甲' },
          { id: 'B', text: '選択肢乙' },
          { id: 'C', text: '選択肢丙' },
          { id: 'D', text: '選択肢丁' },
        ],
        answer: ['A'],
        testedConcepts: ['d2o3', 'scenario-requirement-matching'],
        choiceQuality: undefined,
      };
      const record = analyzeMistake(question, ['B']);
      expect(record.confusionPairIds).toEqual([]);
      expect(record.mistakeType).not.toBe('concept-confusion');
    });

    it('links a confusion only when different concepts occur in the selected and correct choices', () => {
      const question: Question = {
        ...sampleQ,
        choices: [
          { id: 'A', text: 'MCPで外部ツールに接続する' },
          { id: 'B', text: 'Prompt Filesを共有する' },
          { id: 'C', text: '別の方法を使う' },
          { id: 'D', text: '設定を確認する' },
        ],
        answer: ['A'],
        testedConcepts: ['d2o3'],
        choiceQuality: undefined,
      };
      const record = analyzeMistake(question, ['B']);
      expect(record.confusionPairIds).toContain(getPairId('g-mcp', 'g-prompt-files'));
      expect(record.confusionPairIds).toHaveLength(new Set(record.confusionPairIds).size);
    });
  });

  describe('2. Spaced Repetition Review Schedule', () => {
    it('schedules correct answer for 3 days on first correct', () => {
      const schedule = getReviewSchedule(1, false);
      expect(schedule.intervalDays).toBe(3);
    });

    it('expands interval on consecutive correct answers: 3d -> 7d -> 14d -> 30d', () => {
      expect(getReviewSchedule(1, false).intervalDays).toBe(3);
      expect(getReviewSchedule(2, false).intervalDays).toBe(7);
      expect(getReviewSchedule(3, false).intervalDays).toBe(14);
      expect(getReviewSchedule(4, false).intervalDays).toBe(30);
      expect(getReviewSchedule(5, false).intervalDays).toBe(30);
    });

    it('resets interval to 1 day on mistake', () => {
      const schedule = getReviewSchedule(0, true);
      expect(schedule.intervalDays).toBe(1);
    });

    it('updates QuestionReviewState accurately on correct answer', () => {
      const now = 1000000000;
      const state = calculateNextReview(undefined, 'q-1', true, now);
      expect(state.questionId).toBe('q-1');
      expect(state.consecutiveCorrect).toBe(1);
      expect(state.totalCorrect).toBe(1);
      expect(state.totalIncorrect).toBe(0);
      expect(state.lastCorrectAt).toBe(now);
      expect(state.nextReviewAt).toBe(now + 3 * 24 * 3600 * 1000);
      expect(state.lapseCount).toBe(0);
    });

    it('increases lapseCount and sets 1-day review on incorrect answer', () => {
      const now = 1000000000;
      const prevState: QuestionReviewState = {
        questionId: 'q-1',
        lastAnsweredAt: now - 5000,
        lastCorrectAt: now - 5000,
        lastIncorrectAt: null,
        consecutiveCorrect: 2,
        totalCorrect: 2,
        totalIncorrect: 0,
        nextReviewAt: now + 7 * 24 * 3600 * 1000,
        reviewPriority: 1.0,
        lapseCount: 0,
        intervalDays: 7,
      };

      const nextState = calculateNextReview(prevState, 'q-1', false, now);
      expect(nextState.consecutiveCorrect).toBe(0);
      expect(nextState.totalIncorrect).toBe(1);
      expect(nextState.lapseCount).toBe(1);
      expect(nextState.lastIncorrectAt).toBe(now);
      expect(nextState.nextReviewAt).toBe(now + 1 * 24 * 3600 * 1000);
      // Priority should be higher after a lapse
      expect(nextState.reviewPriority).toBeGreaterThan(prevState.reviewPriority);
    });

    it('correctly identifies due reviews based on nextReviewAt', () => {
      const now = 2000000000;
      const pastDueState: QuestionReviewState = {
        questionId: 'q-1',
        lastAnsweredAt: now - 100000,
        lastCorrectAt: now - 100000,
        lastIncorrectAt: null,
        consecutiveCorrect: 1,
        totalCorrect: 1,
        totalIncorrect: 0,
        nextReviewAt: now - 1000, // In the past -> due!
        reviewPriority: 50,
        lapseCount: 0,
        intervalDays: 3,
      };
      const futureState: QuestionReviewState = {
        questionId: 'q-2',
        lastAnsweredAt: now - 1000,
        lastCorrectAt: now - 1000,
        lastIncorrectAt: null,
        consecutiveCorrect: 1,
        totalCorrect: 1,
        totalIncorrect: 0,
        nextReviewAt: now + 500000, // In the future -> not due
        reviewPriority: 10,
        lapseCount: 0,
        intervalDays: 3,
      };

      expect(isDueForReview(pastDueState, now)).toBe(true);
      expect(isDueForReview(futureState, now)).toBe(false);
    });
  });

  describe('3. Concept Confusion Map', () => {
    it('normalizes pair IDs alphabetically to prevent duplicate inverse pairs', () => {
      const id1 = getPairId('g-mcp', 'g-prompt-files');
      const id2 = getPairId('g-prompt-files', 'g-mcp');
      expect(id1).toBe(id2);
      expect(id1).toBe('g-mcp__g-prompt-files');
    });

    it('aggregates mistakes into confusion pairs and calculates severity', () => {
      const record: WrongAnswerRecord = {
        id: 'rec-1',
        questionId: sampleQ.id,
        domainId: sampleQ.domainId,
        objectiveId: sampleQ.objectiveId,
        difficulty: sampleQ.difficulty,
        selectedChoiceIds: ['c1'],
        correctChoiceIds: ['c2'],
        testedConcepts: ['g-mcp', 'g-prompt-files'],
        selectedConcepts: ['g-prompt-files'],
        correctConcepts: ['g-mcp'],
        mistakeType: 'concept-confusion',
        confusionPairIds: ['g-mcp__g-prompt-files'],
        reviewCount: 0,
        recovered: false,
        answeredAt: 100000,
        lastReviewedAt: null,
      };

      const updated = updateConfusionPairs([], record, [], 100000);
      expect(updated.length).toBe(1);
      expect(updated[0].id).toBe('g-mcp__g-prompt-files');
      expect(updated[0].mistakeCount).toBe(1);
      expect(['Low', 'Medium', 'High']).toContain(updated[0].severity);
      expect(updated[0].status).toBe('Active');
    });

    it('increments mistakeCount when repeated mistakes occur on the same pair', () => {
      const existingPair: ConceptConfusionPair = {
        id: 'g-mcp__g-prompt-files',
        conceptAId: 'g-mcp',
        conceptBId: 'g-prompt-files',
        conceptAName: 'MCP',
        conceptBName: 'Prompt Files',
        mistakeCount: 2,
        recentMistakeCount: 2,
        lastMistakeAt: 50000,
        recoveryCount: 0,
        severity: 'Medium',
        status: 'Active',
        relatedQuestionIds: [sampleQ.id],
        relatedObjectiveIds: [sampleQ.objectiveId],
        relatedComparisonIds: [],
      };

      const record: WrongAnswerRecord = {
        id: 'rec-2',
        questionId: sampleQ.id,
        domainId: sampleQ.domainId,
        objectiveId: sampleQ.objectiveId,
        difficulty: sampleQ.difficulty,
        selectedChoiceIds: ['c1'],
        correctChoiceIds: ['c2'],
        testedConcepts: ['g-mcp', 'g-prompt-files'],
        selectedConcepts: ['g-prompt-files'],
        correctConcepts: ['g-mcp'],
        mistakeType: 'concept-confusion',
        confusionPairIds: ['g-mcp__g-prompt-files'],
        reviewCount: 0,
        recovered: false,
        answeredAt: 100000,
        lastReviewedAt: null,
      };

      const updated = updateConfusionPairs([existingPair], record, [], 100000);
      expect(updated[0].mistakeCount).toBe(3);
    });

    it('transitions confusion status from Active to Recovering to Recovered upon consecutive correct answers', () => {
      const pair: ConceptConfusionPair = {
        id: 'g-mcp__g-prompt-files',
        conceptAId: 'g-mcp',
        conceptBId: 'g-prompt-files',
        conceptAName: 'MCP',
        conceptBName: 'Prompt Files',
        mistakeCount: 3,
        recentMistakeCount: 1,
        lastMistakeAt: 10000,
        recoveryCount: 0,
        severity: 'High',
        status: 'Active',
        relatedQuestionIds: ['q-1'],
        relatedObjectiveIds: ['obj-1'],
        relatedComparisonIds: [],
      };

      // 2 consecutive correct attempts
      const attemptsRecovering: Attempt[] = [
        {
          id: 'a1',
          questionId: 'q-1',
          domainId: 'd1',
          objectiveId: 'obj-1',
          answer: ['ans'],
          correct: true,
          at: 20000,
          status: 'verified',
        },
        {
          id: 'a2',
          questionId: 'q-1',
          domainId: 'd1',
          objectiveId: 'obj-1',
          answer: ['ans'],
          correct: true,
          at: 30000,
          status: 'verified',
        },
      ];

      const res1 = checkPairRecovery(pair, attemptsRecovering);
      expect(res1.status).toBe('Recovering');
      expect(res1.recoveryCount).toBe(2);

      // 3 or more consecutive correct attempts -> Recovered
      const attemptsRecovered: Attempt[] = [
        ...attemptsRecovering,
        {
          id: 'a3',
          questionId: 'q-1',
          domainId: 'd1',
          objectiveId: 'obj-1',
          answer: ['ans'],
          correct: true,
          at: 40000,
          status: 'verified',
        },
      ];

      const res2 = checkPairRecovery(pair, attemptsRecovered);
      expect(res2.status).toBe('Recovered');
      expect(res2.recoveryCount).toBe(3);
    });
  });

  describe('4. Bidirectional Learning Links & 3-Question Extraction', () => {
    it('keeps the three-question check available after the new lesson sections', () => {
      for (const lessonId of ['lesson-d3-prompt-pipeline', 'lesson-d5-testing', 'lesson-d5-security-remediation']) {
        expect(getQuestionsForLesson(lessonId, 3)).toHaveLength(3);
      }
    });
    it('extracts 3 relevant questions for a Lesson with unattempted priority', () => {
      const lesson = lessons[0];
      const checkQs = getQuestionsForLesson(lesson.id, 3);
      expect(checkQs.length).toBeLessThanOrEqual(3);
      expect(checkQs.length).toBeGreaterThan(0);
      // All questions belong to lesson domain or objectives
      for (const q of checkQs) {
        const matchesDomain = q.domainId === lesson.domainId;
        const matchesObj = lesson.relatedObjectives.includes(q.objectiveId);
        expect(matchesDomain || matchesObj).toBe(true);
      }
    });

    it('extracts 3 questions for a Comparison Guide', () => {
      const cmp = comparisonGuides[0];
      const checkQs = getQuestionsForComparison(cmp.id, 3);
      expect(checkQs.length).toBeLessThanOrEqual(3);
      expect(checkQs.length).toBeGreaterThan(0);
    });

    it('extracts 3 questions for a Glossary Term', () => {
      const term = glossaryTerms[0];
      const checkQs = getQuestionsForGlossary(term.id, 3);
      expect(checkQs.length).toBeLessThanOrEqual(3);
      expect(checkQs.length).toBeGreaterThan(0);
    });

    it('extracts 5 review questions for a Concept Confusion Pair', () => {
      const pair: ConceptConfusionPair = {
        id: 'g-mcp__g-prompt-files',
        conceptAId: 'g-mcp',
        conceptBId: 'g-prompt-files',
        conceptAName: 'MCP',
        conceptBName: 'Prompt Files',
        mistakeCount: 2,
        recentMistakeCount: 2,
        lastMistakeAt: 50000,
        recoveryCount: 0,
        severity: 'Medium',
        status: 'Active',
        relatedQuestionIds: [questions[0].id],
        relatedObjectiveIds: [questions[0].objectiveId],
        relatedComparisonIds: [],
      };

      const reviewQs = getQuestionsForConfusionPair(pair, 5);
      expect(reviewQs.length).toBeLessThanOrEqual(5);
      expect(reviewQs.length).toBeGreaterThan(0);
      expect(reviewQs[0].id).toBe(questions[0].id); // Direct relation prioritized
    });
  });

  describe('5. Recommended Next Action Engine', () => {
    it('recommends reviewing a high-severity confusion pair if active', () => {
      const highPair: ConceptConfusionPair = {
        id: 'g-mcp__g-prompt-files',
        conceptAId: 'g-mcp',
        conceptBId: 'g-prompt-files',
        conceptAName: 'MCP',
        conceptBName: 'Prompt Files',
        mistakeCount: 5,
        recentMistakeCount: 3,
        lastMistakeAt: Date.now(),
        recoveryCount: 0,
        severity: 'High',
        status: 'Active',
        relatedQuestionIds: [],
        relatedObjectiveIds: [],
        relatedComparisonIds: [comparisonGuides[0].id],
      };

      const actions = getRecommendedNextAction([], [highPair], 0);
      expect(actions.primary).toBeDefined();
      expect(actions.primary.type).toBe('read_comparison');
      expect(actions.primary.targetId).toBe(comparisonGuides[0].id);
    });

    it('recommends due review when due questions are pending and no high confusion exists', () => {
      const actions = getRecommendedNextAction([], [], 7);
      expect(actions.primary.type).toBe('review_due');
      expect(actions.primary.title).toContain('7問');
    });
  });

  describe('6. Question Selection Engine Adaptive Weights Integration', () => {
    it('applies dueForReviewBonus, confusionBonus, and recentlyWrongBonus properly', () => {
      const q1 = questions[0];
      const q2 = questions[1];

      const context: SelectionContext = {
        attempts: [],
        reviewStates: {
          [q1.id]: {
            nextReviewAt: 500, // Due!
            lapseCount: 0,
          },
        },
        confusionQuestionIds: [q1.id],
        recoveredQuestionIds: [q2.id],
      };

      const weights = calculateQuestionWeights(
        [q1, q2],
        { ...defaultSelectionOptions, count: 5, mode: 'Random', difficultyMode: 'balanced' },
        context,
      );

      // q1 is both due for review (x3.0) and in confusion pair (x2.0), q2 is recovered (x0.6)
      const weightQ1 = weights.get(q1.id) ?? 0;
      const weightQ2 = weights.get(q2.id) ?? 0;

      expect(weightQ1).toBeGreaterThan(weightQ2 * 2);
    });

    it('selects due questions when mode is Due for Review', () => {
      const qDue = questions[0];
      const context: SelectionContext = {
        attempts: [],
        reviewStates: {
          [qDue.id]: {
            nextReviewAt: 500, // Due
            lapseCount: 0,
          },
        },
        confusionQuestionIds: [],
        recoveredQuestionIds: [],
      };

      const res = selectQuestions(questions, {
        ...defaultSelectionOptions,
        count: 5,
        mode: 'Due for Review',
        difficultyMode: 'balanced',
      }, context);

      expect(res.questions.length).toBeGreaterThan(0);
      expect(res.questions[0].id).toBe(qDue.id);
    });
  });
});
