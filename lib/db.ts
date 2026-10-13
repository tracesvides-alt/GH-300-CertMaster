import Dexie, { type EntityTable } from 'dexie';
import { type Question, questionSchema, questions } from './content';
import { type Attempt } from './learning';
import { withCurrentQuestionClassification } from './question-classification';
import type { SelectionOptions } from './selection';
import type { PracticeRun } from './practice-session';
import {
  type WrongAnswerRecord,
  type ConceptConfusionPair,
  analyzeMistake,
  updateConfusionPairs,
  checkPairRecovery,
} from './adaptive-learning';
import {
  type QuestionReviewState,
  calculateNextReview,
  calculateDynamicPriority,
  isDueForReview,
} from './spaced-repetition';

export interface LessonCompletion {
  id: string; // lessonId
  completedAt: string;
}

export class LearningDB extends Dexie {
  attempts!: EntityTable<Attempt, 'id'>;
  bookmarks!: EntityTable<{ id: string }, 'id'>;
  generated!: EntityTable<Question, 'id'>;
  settings!: EntityTable<{ id: string; value: SelectionOptions }, 'id'>;
  practiceRuns!: EntityTable<PracticeRun, 'id'>;
  lessonCompletions!: EntityTable<LessonCompletion, 'id'>;
  wrongAnswers!: EntityTable<WrongAnswerRecord, 'id'>;
  questionReviews!: EntityTable<QuestionReviewState, 'questionId'>;
  confusionPairs!: EntityTable<ConceptConfusionPair, 'id'>;
  sessions!: EntityTable<
    {
      id: string;
      questions: Question[];
      answers: Record<string, string[]>;
      index: number;
      deadline: number;
      completed: boolean;
      requestedCount?: number;
      notices?: string[];
    },
    'id'
  >;
  constructor(name = 'gh300-certmaster') {
    super(name);
    this.version(1).stores({
      attempts: 'id, questionId, objectiveId, at, sessionId',
      bookmarks: 'id',
      generated: 'id, objectiveId',
      sessions: 'id',
    });
    this.version(2).stores({ settings: 'id', practiceRuns: 'id, startedAt, completedAt' });
    this.version(3).stores({ lessonCompletions: 'id, completedAt' });
    this.version(4).stores({
      wrongAnswers: 'id, questionId, objectiveId, domainId, answeredAt, recovered',
      questionReviews: 'questionId, nextReviewAt, reviewPriority, lapseCount',
      confusionPairs: 'id, severity, status, lastMistakeAt',
    });
  }
}
export const db = new LearningDB();

export async function markLessonCompleted(id: string) {
  await db.lessonCompletions.put({ id, completedAt: new Date().toISOString() });
}

export async function toggleLessonCompleted(id: string): Promise<boolean> {
  const existing = await db.lessonCompletions.get(id);
  if (existing) {
    await db.lessonCompletions.delete(id);
    return false;
  } else {
    await db.lessonCompletions.put({ id, completedAt: new Date().toISOString() });
    return true;
  }
}

export async function getCompletedLessonIds(): Promise<string[]> {
  const all = await db.lessonCompletions.toArray();
  return all.map((c) => c.id);
}

/**
 * Record an attempt with Adaptive Learning intelligence:
 * updates attempts, wrong answer notebook, spaced repetition, and confusion map
 */
export async function recordAttemptAdaptive(
  q: Question,
  selected: string[],
  correct: boolean,
  sessionId?: string,
  now = Date.now()
): Promise<Attempt> {
  q = withCurrentQuestionClassification(q);
  const att: Attempt = {
    id: crypto.randomUUID(),
    questionId: q.id,
    objectiveId: q.objectiveId,
    domainId: q.domainId,
    answer: selected,
    correct,
    at: now,
    status: q.status,
    sessionId,
  };

  // 1. Put attempt in standard attempts table
  await db.attempts.put(att);

  // 2. Update Spaced Repetition Review State
  const existingReview = await db.questionReviews.get(q.id);
  const updatedReview = calculateNextReview(existingReview, q.id, correct, now);
  await db.questionReviews.put(updatedReview);

  // 3. Handle Mistakes and Confusions
  const allAttempts = await db.attempts.toArray();
  const existingPairs = await db.confusionPairs.toArray();

  if (!correct) {
    // Generate Wrong Answer Record
    const record = analyzeMistake(q, selected, now);
    await db.wrongAnswers.put(record);

    // Update or create Confusion Pairs
    const updatedPairs = updateConfusionPairs(existingPairs, record, allAttempts, now);
    for (const p of updatedPairs) {
      await db.confusionPairs.put(p);
    }
  } else {
    // On correct answer, check if any active confusion pairs can advance recovery
    for (const p of existingPairs) {
      if (p.relatedQuestionIds.includes(q.id)) {
        const recovery = checkPairRecovery(p, allAttempts);
        if (recovery.status !== p.status || recovery.recoveryCount !== p.recoveryCount) {
          await db.confusionPairs.put({
            ...p,
            status: recovery.status,
            recoveryCount: recovery.recoveryCount,
          });
        }
      }
    }
  }

  return att;
}

/**
 * Get all questions currently due for review, sorted by dynamic priority
 */
export async function getDueReviewQuestions(now = Date.now()): Promise<Question[]> {
  const reviews = await db.questionReviews.toArray();
  const dueReviews = reviews.filter((r) => isDueForReview(r, now));

  // Map to Question objects and sort by dynamic priority
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const scored: { q: Question; score: number }[] = [];

  for (const r of dueReviews) {
    const q = questionMap.get(r.questionId);
    if (q) {
      const score = calculateDynamicPriority(r, q, 50, now);
      scored.push({ q, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.q);
}

export async function saveGenerated(value: unknown) {
  const q = questionSchema.parse(value);
  if (q.status !== 'ai-generated') throw Error('AI status required');
  await db.generated.put(q);
  return q;
}

