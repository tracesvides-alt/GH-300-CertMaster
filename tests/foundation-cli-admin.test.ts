import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import report from '../reports/cli-admin-foundation-revision-2026-10-18.json';
import revisions from '../content/gh300/2026-08-07/questions/foundation-cli-admin-revisions.json';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import official from '../content/gh300/2026-08-07/questions/official-alignment-revisions.json';
import admin from '../content/gh300/2026-08-07/questions/admin-content-revisions.json';
import {allQuestions,questions,questionSchema,questionForHistoricalAttempt,buildKnowledgeBase,glossaryTerms,lessons,directQuestionStudyLinks} from '../lib/content';
import {applyQuestionRevision,questionRevisionContract,isQuestionRevisionUnavailable} from '../lib/question-revision';
import {answerExplanation} from '../lib/answer-explanation';
import {score,attemptFormat} from '../lib/learning';
import {questionIssues} from '../lib/question-quality';
import {withoutDeletedSessionQuestions} from '../lib/question-availability';
import {validateKnowledgeBase} from '../lib/knowledge';
import {db,recordAttemptAdaptive} from '../lib/db';

const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const root='content/gh300/2026-08-07/';
describe('CLI and administrator Foundation editions',()=>{
 it('publishes six reviewed single-select questions with one correct answer each',()=>{
  expect(revisions.questions).toHaveLength(6);
  expect(report.questions.map(r=>r.id).sort()).toEqual(['q-d2-g07','q-d2-g08','q-d2-g09','q-d2-g20','q-d6-f04','q-d6-f05']);
  for(const row of report.questions){
   const q=allQuestions.find(q=>q.id===row.id)!;
   expect(q).toEqual(questionSchema.parse(row.after));expect(questionIssues(q)).toEqual([]);
   for(const field of ['id','domainId','objectiveId','difficulty','type','status'] as const)expect(q[field]).toBe(row.before[field]);
   expect(q.answer).toEqual(row.before.answer);
   for(const c of q.choices)expect(score(q,[c.id])).toBe(q.answer.includes(c.id));
   expect(score(q,[])).toBe(false);expect(score(q,q.choices.slice(0,2).map(c=>c.id))).toBe(false);
  }
 });
 it('keeps original assets, every other effective question and all counts intact',()=>{
  for(const [file,value] of Object.entries(report.questionFingerprints))expect(hash(JSON.parse(readFileSync(root+'questions/'+file,'utf8')))).toBe(value);
  const prior=[...official.questions,...admin.questions];
  for(const raw of seed){
   const before=prior.find(r=>r.id===raw.id)?.after??raw;
   expect(hash(before)).toBe(report.beforeQuestionFingerprints[raw.id as keyof typeof report.beforeQuestionFingerprints]);
   if(!report.questions.some(r=>r.id===raw.id))expect(allQuestions.find(q=>q.id===raw.id)).toEqual(questionSchema.parse(before));
  }
  const eligible=questions.filter(q=>q.status==='verified');expect(eligible).toHaveLength(253);
  for(const [field,expected] of [['difficulty',report.counts.byDifficulty],['domainId',report.counts.byDomain]] as const)
   expect(eligible.reduce((a,q)=>(a[q[field]]=(a[q[field]]??0)+1,a),{} as Record<string,number>)).toEqual(expected);
 });
 it('retains all unrelated teaching assets and checks every published before/after edition',()=>{
  for(const [kind,path] of Object.entries({lessons:'lessons/seed.json',glossary:'glossary/terms.json',comparisons:'comparisons/guides.json',sources:'sources.json'})){
   const items=JSON.parse(readFileSync(root+path,'utf8')) as Array<{id:string}>;
   const before=report.beforeFingerprints[kind as keyof typeof report.beforeFingerprints] as Record<string,string>;
   expect(items.map(x=>x.id).sort()).toEqual(Object.keys(before).sort());
   for(const item of items){const edit=report.changes.find(c=>c.kind===kind&&c.id===item.id);
    if(edit){expect(item).toEqual(edit.after);expect(hash(edit.before)).toBe(before[item.id]);}
    else expect(hash(item)).toBe(before[item.id]);
   }
  }
  expect(validateKnowledgeBase(buildKnowledgeBase())).toEqual([]);
  for(const row of report.questions){const term=glossaryTerms.find(t=>t.id===row.termId)!;expect(term.basicQuestionId).toBe(row.id);expect(term.questionIds).toContain(row.id);}
  for(const row of report.questions){const links=directQuestionStudyLinks(questions.find(q=>q.id===row.id)!)!;
   expect(links.terms.map(t=>t.id)).toEqual([row.termId]);
   expect(links.lesson?.id).toBe(row.id.startsWith('q-d2-g0')?'lesson-d2-cli':'lesson-d2-org-governance');
  }
  expect(directQuestionStudyLinks(questions.find(q=>q.id==='q02')!)).toBeUndefined();
  expect(lessons.find(l=>l.id==='lesson-d2-cli')!.status).toBe('needs-review');
 });
 it('binds new explanations to their exact edition while retaining historical explanations',()=>{
  for(const row of report.questions){
   const current=questions.find(q=>q.id===row.id)!;
   expect(answerExplanation(current)).toBe(row.displayedExplanation);
   expect(answerExplanation(questionSchema.parse(row.before))).toBe(row.previousDisplayedExplanation);
   expect(questionRevisionContract(current)).toBe(row.afterContract);
   expect(applyQuestionRevision(row.before)).toEqual(row.after);
   const unknown={...row.before,question:row.before.question+'別の版'};
   expect(applyQuestionRevision(unknown)).toEqual(unknown);
   expect(answerExplanation({...current,question:current.question+'別の条件'})).toBe(current.explanation);
  }
 });
 it('resolves history by edition even though the old and new answer IDs are the same',()=>{
  for(const row of report.questions){
   const current=questions.find(q=>q.id===row.id)!;
   expect(questionForHistoricalAttempt(current,{correctChoiceIds:current.answer}).question).toBe(row.before.question);
   expect(questionForHistoricalAttempt(current,{...attemptFormat(current,current.answer)})).toBe(current);
   expect(questionForHistoricalAttempt(current,{...attemptFormat(questionSchema.parse(row.before),row.before.answer)}).question).toBe(row.before.question);
   expect(questionForHistoricalAttempt(current,{questionRevision:'unknown-edition',correctChoiceIds:current.answer}).question).toBe(row.before.question);
  }
 });
 it('strips obsolete unfinished snapshots without rewriting completed sessions',()=>{
  const row=report.questions[1],current=questions.find(q=>q.id===row.id)!,other=questions.find(q=>q.id==='q02')!;
  expect(isQuestionRevisionUnavailable(row.before)).toBe(true);expect(isQuestionRevisionUnavailable(current)).toBe(false);
  const saved={questions:[row.before,other],answers:{[row.id]:row.before.answer,q02:other.answer},index:1,completed:false};
  const result=withoutDeletedSessionQuestions(saved);
  expect(result.questions.map(q=>q.id)).toEqual(['q02']);expect(result.answers).not.toHaveProperty(row.id);expect(result.index).toBe(0);
  const done={...saved,completed:true};expect(withoutDeletedSessionQuestions(done)).toBe(done);expect(saved.questions).toHaveLength(2);
 });
 it('persists the edition marker for new responses without rewriting old attempts',async()=>{
  const row=report.questions[1],q=questions.find(q=>q.id===row.id)!,oldId='before-foundation-edition';
  const old={id:oldId,questionId:q.id,domainId:q.domainId,objectiveId:q.objectiveId,answer:['A'],correct:false,at:1,status:q.status,correctChoiceIds:q.answer};
  await db.attempts.put(old);
  const saved=await recordAttemptAdaptive(q,q.answer,true,undefined,2);
  expect(saved.questionRevision).toBe(q.contentRevision);expect(await db.attempts.get(oldId)).toEqual(old);
  expect(questionForHistoricalAttempt(q,(await db.attempts.get(saved.id))!)).toBe(q);
  expect(questionForHistoricalAttempt(q,(await db.attempts.get(oldId))!).question).toBe(row.before.question);
  await db.delete();
 });
 it('records coverage gains without marking untested plans or enterprise metrics as covered',()=>{
  expect(report.coverage).toHaveLength(39);
  const counts=report.coverage.reduce((a,r)=>(a[r.classification]=(a[r.classification]??0)+1,a),{} as Record<string,number>);
  expect(counts).toEqual({CORRECT_CHOICE:15,NOT_TESTED:11,DISTRACTOR_ONLY:9,SCENARIO_ONLY:4});
  expect(report.coverage.find(r=>r.rowId==='plan-pro')?.correctChoiceQuestionIds).toContain('q-d2-g20');
  expect(report.coverage.find(r=>r.rowId==='plan-business')?.classification).toBe('NOT_TESTED');
  expect(report.coverage.find(r=>r.rowId==='admin-enterprise-metrics')?.classification).toBe('DISTRACTOR_ONLY');
  for(const row of report.questions){expect(row.review.counterfactuals).toHaveLength(3);expect(row.review.blindCheck).toMatch(/^合格/);expect(row.evidence.length).toBeGreaterThan(0);}
 });
});
