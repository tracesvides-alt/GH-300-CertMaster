import exclusions from '@/content/gh300/2026-08-07/questions/selection-exclusions.json';
import removals from '@/content/gh300/2026-08-07/questions/removals.json';

const retiredIds = new Set(exclusions.questions.map(row => row.id));
const removedIds = new Set(removals.questions.map(row => row.id));

/** Retain archived assets for history, but do not start a new exercise with them. */
export function isQuestionActive(question: { id: string }): boolean {
  return !retiredIds.has(question.id) && !removedIds.has(question.id);
}

/** Strip deleted items from unfinished snapshots without erasing completed history. */
export function withoutDeletedSessionQuestions<T extends {
  questions: Array<{ id: string }>;
  answers: Record<string, string[]>;
  index: number;
  completed: boolean;
}>(session: T): T {
  if (session.completed || !session.questions.some(q => removedIds.has(q.id))) return session;
  const questions = session.questions.filter(q => !removedIds.has(q.id));
  const preceding = session.questions.slice(0, session.index).filter(q => !removedIds.has(q.id)).length;
  return {
    ...session,
    questions,
    index: Math.max(0, Math.min(preceding, questions.length - 1)),
    answers: Object.fromEntries(Object.entries(session.answers).filter(([id]) => !removedIds.has(id))),
  };
}
