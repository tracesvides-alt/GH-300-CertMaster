import Dexie, { type EntityTable } from 'dexie';
import { type Question, questionSchema } from './content';
import { type Attempt } from './learning';
import type { SelectionOptions } from './selection';
import type { PracticeRun } from './practice-session';
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

export async function saveGenerated(value: unknown) {
  const q = questionSchema.parse(value);
  if (q.status !== 'ai-generated') throw Error('AI status required');
  await db.generated.put(q);
  return q;
}

