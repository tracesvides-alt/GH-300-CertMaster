import { allocateQuestionsByDomain } from './selection';
import { domains, objectives, questions, type Question } from './content';
export type Attempt = {
  id: string;
  questionId: string;
  objectiveId: string;
  domainId: string;
  answer: string[];
  correct: boolean;
  at: number;
  status: Question['status'];
  sessionId?: string;
};
export const score = (q: Question, answer: string[]) =>
  answer.length === q.answer.length &&
  new Set(answer).size === answer.length &&
  answer.every((a) => q.answer.includes(a));
export function mastery(attempts: Attempt[]) {
  const official = attempts.filter((a) => a.status === 'verified');
  const latest = new Map<string, Attempt>();
  for (const a of [...official].sort((a, b) => a.at - b.at)) latest.set(a.questionId, a);
  const byObjective = Object.fromEntries(
    objectives.map((o) => {
      const bank = questions.filter((q) => q.objectiveId === o.id);
      const correct = bank.filter((q) => latest.get(q.id)?.correct).length;
      return [o.id, bank.length ? (correct / bank.length) * 100 : 0];
    }),
  );
  const byDomain = Object.fromEntries(
    domains.map((d) => [
      d.id,
      d.objectives.reduce((s, o) => s + byObjective[o.id], 0) / d.objectives.length,
    ]),
  );
  const weight = domains.reduce((s, d) => s + (d.min + d.max) / 2, 0);
  return {
    byObjective,
    byDomain,
    readiness: domains.reduce((s, d) => s + (byDomain[d.id] * (d.min + d.max)) / 2, 0) / weight,
  };
}
// Compatibility export; all allocation is owned by the selection engine.
export function allocate(total: number) {
  return allocateQuestionsByDomain(total);
}
export function streak(attempts: Attempt[], now = new Date()) {
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const dates = new Set(attempts.map((a) => key(new Date(a.at))));
  const day = new Date(now);
  if (!dates.has(key(day))) day.setDate(day.getDate() - 1);
  let n = 0;
  while (dates.has(key(day))) {
    n++;
    day.setDate(day.getDate() - 1);
  }
  return n;
}
