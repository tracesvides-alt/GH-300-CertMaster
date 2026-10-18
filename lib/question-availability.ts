import exclusions from '@/content/gh300/2026-08-07/questions/selection-exclusions.json';
import removals from '@/content/gh300/2026-08-07/questions/removals.json';
import { isQuestionRevisionUnavailable } from './question-revision';

const retiredIds = new Set(exclusions.questions.map(row => row.id));
const removedIds = new Set(removals.questions.map(row => row.id));
const retirementById = new Map(exclusions.questions.map(row=>[row.id,row]));

export function getQuestionRetirement(id?:string) {
  const row=id?retirementById.get(id):undefined;
  if(!row)return undefined;
  const destinations=(next:string,seen:Set<string>):string[]=>{
    if(seen.has(next))return [];
    const retired=retirementById.get(next);
    return retired?retired.replacementIds.flatMap(id=>destinations(id,new Set([...seen,next]))):removedIds.has(next)?[]:[next];
  };
  return {...row,replacementIds:[...new Set(row.replacementIds.flatMap(id=>destinations(id,new Set([row.id]))))]};
}

/** Retain archived assets for history, but do not start a new exercise with them. */
export function isQuestionActive(question: { id: string }): boolean {
  return !retiredIds.has(question.id) && !removedIds.has(question.id) && !isQuestionRevisionUnavailable(question);
}

/** Strip deleted/formerly generated items from unfinished sessions; keep completed history. */
export function withoutDeletedSessionQuestions<T extends {
  questions: Array<{ id: string; status?:string }>;
  answers: Record<string, string[]>;
  index: number;
  completed: boolean;
}>(session: T): T {
  const unavailable=(q:{id:string;status?:string})=>removedIds.has(q.id)||q.status==='ai-generated'||isQuestionRevisionUnavailable(q);
  if (session.completed || !session.questions.some(unavailable)) return session;
  const unavailableIds=new Set(session.questions.filter(unavailable).map(q=>q.id));
  const questions = session.questions.filter(q => !unavailable(q));
  const preceding = session.questions.slice(0, session.index).filter(q => !unavailable(q)).length;
  return {
    ...session,
    questions,
    index: Math.max(0, Math.min(preceding, questions.length - 1)),
    answers: Object.fromEntries(Object.entries(session.answers).filter(([id]) => !unavailableIds.has(id)&&questions.some(q=>q.id===id))),
  };
}
