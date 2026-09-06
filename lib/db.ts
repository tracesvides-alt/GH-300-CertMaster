import Dexie, { type EntityTable } from 'dexie';
import { type Question, questionSchema } from './content';
import { type Attempt } from './learning';
import type { SelectionOptions } from './selection';
import type { PracticeRun } from './practice-session';
export class LearningDB extends Dexie {
  attempts!: EntityTable<Attempt, 'id'>;
  bookmarks!: EntityTable<{ id: string }, 'id'>;
  generated!: EntityTable<Question, 'id'>;
  settings!: EntityTable<{ id: string; value: SelectionOptions }, 'id'>;
  practiceRuns!: EntityTable<PracticeRun, 'id'>;
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
  }
}
export const db = new LearningDB();
export async function saveGenerated(value: unknown) {
  const q = questionSchema.parse(value);
  if (q.status !== 'ai-generated') throw Error('AI status required');
  await db.generated.put(q);
  return q;
}
