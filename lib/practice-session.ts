import { type Question, domains, objectives, lessons } from './content';
import { type Attempt } from './learning';
import { calculateObjectiveStats, type ObjectiveStats, type SelectionOptions } from './selection';
export type PracticeRun = {
  id: string;
  questions: Question[];
  options: SelectionOptions;
  beforeStats: Record<string, ObjectiveStats>;
  answers: Attempt[];
  startedAt: number;
  completedAt: number | null;
};
export function practiceResult(run: PracticeRun) {
  const correct = run.answers.filter((a) => a.correct).length;
  const wrongObjectiveIds = [
    ...new Set(run.answers.filter((a) => !a.correct).map((a) => a.objectiveId)),
  ];
  return {
    correct,
    total: run.questions.length,
    accuracy: run.questions.length ? (100 * correct) / run.questions.length : 0,
    byDomain: domains
      .map((d) => ({
        id: d.id,
        title: d.name,
        total: run.questions.filter((q) => q.domainId === d.id).length,
        correct: run.answers.filter((a) => a.domainId === d.id && a.correct).length,
      }))
      .filter((d) => d.total),
    byDifficulty: [
      {
        difficulty: 'beginner' as const,
        label: 'Foundation（基礎）',
        total: run.questions.filter((q) => q.difficulty === 'beginner').length,
        correct: run.answers.filter((a) => {
          const q = run.questions.find((x) => x.id === a.questionId);
          return q?.difficulty === 'beginner' && a.correct;
        }).length,
      },
      {
        difficulty: 'intermediate' as const,
        label: 'Applied（標準応用）',
        total: run.questions.filter((q) => q.difficulty === 'intermediate').length,
        correct: run.answers.filter((a) => {
          const q = run.questions.find((x) => x.id === a.questionId);
          return q?.difficulty === 'intermediate' && a.correct;
        }).length,
      },
      {
        difficulty: 'advanced' as const,
        label: 'Exam（本番レベル）',
        total: run.questions.filter((q) => q.difficulty === 'advanced').length,
        correct: run.answers.filter((a) => {
          const q = run.questions.find((x) => x.id === a.questionId);
          return q?.difficulty === 'advanced' && a.correct;
        }).length,
      },
    ].filter((d) => d.total > 0),
    wrongObjectiveIds,
    recommendedLessons: lessons.filter((l) =>
      l.relatedObjectives.some((id) => wrongObjectiveIds.includes(id)),
    ),
  };
}
export function improvedObjectives(run: PracticeRun, allAttempts: Attempt[]) {
  const ids = [
    ...new Set(run.answers.filter((a) => a.status === 'verified').map((a) => a.objectiveId)),
  ];
  // End-time filtering makes the comparison stable when revisiting a stored result later.
  const after = calculateObjectiveStats(
    allAttempts.filter((a) => a.at <= (run.completedAt ?? Infinity)),
    ids,
  );
  return ids
    .map((id) => ({
      id,
      title: objectives.find((o) => o.id === id)?.title ?? id,
      before: run.beforeStats[id]?.masteryScore ?? 50,
      after: after[id]?.masteryScore ?? 50,
    }))
    .filter((o) => o.after > o.before + 0.01);
}
