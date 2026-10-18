import { allocateQuestionsByDomain } from './selection';
import { domains, objectives, questions, type Question } from './content';
import {answerDetails,questionType,multiSelectKind,validSelection,type MultiSelectPattern,type QuestionType} from './question-format';
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
  questionType?:QuestionType;
  questionRevision?:string;
  multiSelectPattern?:MultiSelectPattern;
  selectedChoiceIds?:string[];
  correctChoiceIds?:string[];
  missingCorrectChoiceIds?:string[];
  selectedWrongChoiceIds?:string[];
  partialMatch?:number;
};
export const difficultyMasteryWeights = {
  beginner: 1.0,
  intermediate: 1.2,
  advanced: 1.4,
} as const;

export const score = (q: Question, answer: string[]) =>
  validSelection(q,answer) &&
  answer.length === q.answer.length &&
  new Set(answer).size === answer.length &&
  answer.every((a) => q.answer.includes(a));
export function attemptFormat(q:Question,selected:string[]) {
 return {...answerDetails(q.answer,selected),questionType:questionType(q),multiSelectPattern:q.multiSelectPattern,questionRevision:q.contentRevision};
}
export function formatAccuracy(attempts:Attempt[],bank:Question[]) {
 const byId=new Map(bank.map(q=>[q.id,q]));
 const rows=attempts.map(a=>{const q=byId.get(a.questionId);return {a,type:a.questionType??(q?questionType(q):undefined),pattern:a.multiSelectPattern??q?.multiSelectPattern};});
 const groups=[['single','単一選択',rows.filter(r=>r.type==='single_select')],['multi','複数選択',rows.filter(r=>r.type==='multi_select')],
  ['knowledge','知識型・複数選択',rows.filter(r=>r.type==='multi_select'&&r.pattern&&multiSelectKind(r.pattern)==='knowledge')],
  ['scenario','シナリオ型・複数選択',rows.filter(r=>r.type==='multi_select'&&r.pattern&&multiSelectKind(r.pattern)==='scenario')],
  ...(['benefits','characteristics','best_practices','scenario_judgment','scenario_actions'] as const).map(p=>[p,p,rows.filter(r=>r.type==='multi_select'&&r.pattern===p)])] as [string,string,typeof rows][];
 return groups.map(([id,label,items])=>({id,label,total:items.length,correct:items.filter(r=>r.a.correct).length,accuracy:items.length?items.filter(r=>r.a.correct).length/items.length*100:null}));
}
export function mastery(attempts: Attempt[]) {
  const official = attempts.filter((a) => a.status === 'verified');
  const latest = new Map<string, Attempt>();
  for (const a of [...official].sort((a, b) => a.at - b.at)) latest.set(a.questionId, a);
  const byObjective = Object.fromEntries(
    objectives.map((o) => {
      const bank = questions.filter((q) => q.objectiveId === o.id);
      if (!bank.length) return [o.id, 0];
      const totalWeight = bank.reduce(
        (sum, q) => sum + (difficultyMasteryWeights[q.difficulty] ?? 1.0),
        0,
      );
      const earnedWeight = bank
        .filter((q) => latest.get(q.id)?.correct)
        .reduce((sum, q) => sum + (difficultyMasteryWeights[q.difficulty] ?? 1.0), 0);
      return [o.id, totalWeight ? (earnedWeight / totalWeight) * 100 : 0];
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
