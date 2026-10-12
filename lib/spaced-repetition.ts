import type { Question } from './content';

export interface QuestionReviewState {
  questionId: string;
  lastAnsweredAt: number;
  lastCorrectAt: number | null;
  lastIncorrectAt: number | null;
  consecutiveCorrect: number;
  totalCorrect: number;
  totalIncorrect: number;
  nextReviewAt: number; // timestamp in ms
  reviewPriority: number; // calculated score for priority queue
  lapseCount: number; // times forgotten after previously knowing
  intervalDays: number;
}

/**
 * Spaced Repetition Schedule Rules:
 * - First correct: 3 days
 * - 2 consecutive correct: 7 days
 * - 3 consecutive correct: 14 days
 * - 4+ consecutive correct: 30 days
 * - Incorrect: 1 day (tomorrow)
 */
export const INTERVAL_SCHEDULE_DAYS = [3, 7, 14, 30] as const;

export function getIntervalForConsecutiveCorrect(consecutiveCorrect: number): number {
  if (consecutiveCorrect <= 0) return 1;
  const idx = Math.min(consecutiveCorrect - 1, INTERVAL_SCHEDULE_DAYS.length - 1);
  return INTERVAL_SCHEDULE_DAYS[idx];
}

export function getReviewSchedule(consecutiveCorrect: number, isMistake = false): { intervalDays: number } {
  if (isMistake) return { intervalDays: 1 };
  return { intervalDays: getIntervalForConsecutiveCorrect(consecutiveCorrect) };
}

/**
 * Calculate the next review schedule when answering a question
 */
export function calculateNextReview(
  existingState: QuestionReviewState | undefined,
  questionId: string,
  isCorrect: boolean,
  now = Date.now()
): QuestionReviewState {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  if (!existingState) {
    // First time answering this question
    const consecutiveCorrect = isCorrect ? 1 : 0;
    const intervalDays = isCorrect ? getIntervalForConsecutiveCorrect(1) : 1;
    const nextReviewAt = now + intervalDays * ONE_DAY_MS;

    return {
      questionId,
      lastAnsweredAt: now,
      lastCorrectAt: isCorrect ? now : null,
      lastIncorrectAt: isCorrect ? null : now,
      consecutiveCorrect,
      totalCorrect: isCorrect ? 1 : 0,
      totalIncorrect: isCorrect ? 0 : 1,
      nextReviewAt,
      reviewPriority: isCorrect ? 1.0 : 3.0, // wrong answers immediately prioritized
      lapseCount: 0,
      intervalDays,
    };
  }

  const consecutiveCorrect = isCorrect ? existingState.consecutiveCorrect + 1 : 0;
  // If previously knew it (was correct at least once) and now got it wrong, that is a lapse
  const isLapse = !isCorrect && existingState.totalCorrect > 0;
  const lapseCount = existingState.lapseCount + (isLapse ? 1 : 0);

  const intervalDays = isCorrect ? getIntervalForConsecutiveCorrect(consecutiveCorrect) : 1;
  const nextReviewAt = now + intervalDays * ONE_DAY_MS;

  // Review Priority:
  // Base 1.0. Higher if lapsed, wrong recently, or due.
  let reviewPriority = 1.0;
  if (!isCorrect) {
    reviewPriority += 2.0;
  }
  if (lapseCount > 0) {
    reviewPriority += 0.5 * Math.min(lapseCount, 4);
  }

  return {
    questionId,
    lastAnsweredAt: now,
    lastCorrectAt: isCorrect ? now : existingState.lastCorrectAt,
    lastIncorrectAt: isCorrect ? existingState.lastIncorrectAt : now,
    consecutiveCorrect,
    totalCorrect: existingState.totalCorrect + (isCorrect ? 1 : 0),
    totalIncorrect: existingState.totalIncorrect + (isCorrect ? 0 : 1),
    nextReviewAt,
    reviewPriority,
    lapseCount,
    intervalDays,
  };
}

/**
 * Check if a question is currently due for review
 */
export function isDueForReview(state: QuestionReviewState, now = Date.now()): boolean {
  return now >= state.nextReviewAt;
}

/**
 * Calculate dynamic review priority for sorting candidates
 * Higher score = should be reviewed first
 * Order:
 * 1. nextReviewAt passed (overdue amount)
 * 2. Past lapses (lapseCount > 0)
 * 3. Difficulty 3 (advanced)
 * 4. Lower objective mastery
 */
export function calculateDynamicPriority(
  state: QuestionReviewState,
  question: Question,
  objectiveMastery = 50,
  now = Date.now()
): number {
  let score = 10.0;

  // 1. Overdue weight (overdue by days adds significant weight)
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  if (now >= state.nextReviewAt) {
    const daysOverdue = Math.max(0, (now - state.nextReviewAt) / ONE_DAY_MS);
    score += 50.0 + Math.min(daysOverdue * 10, 50.0);
  } else {
    // Not due yet, heavily penalized unless practicing explicitly
    score -= 30.0;
  }

  // 2. Past mistakes and lapses
  if (state.totalIncorrect > 0) score += 15.0;
  if (state.lapseCount > 0) score += 10.0 * Math.min(state.lapseCount, 3);

  // 3. Difficulty 3 (Exam / advanced) bonus
  if (question.difficulty === 'advanced') score += 8.0;
  else if (question.difficulty === 'intermediate') score += 4.0;

  // 4. Low objective mastery bonus (0 - 100)
  score += (100 - Math.min(100, Math.max(0, objectiveMastery))) * 0.15;

  return Math.max(1.0, score);
}
