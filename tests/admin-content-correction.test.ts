import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import report from '../reports/admin-content-correction-2026-10-18.json';
import revisions from '../content/gh300/2026-08-07/questions/admin-content-revisions.json';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import details from '../content/gh300/2026-08-07/questions/answer-explanations.json';
import official from '../content/gh300/2026-08-07/questions/official-alignment-revisions.json';
import expansion from '../reports/cli-admin-reference-expansion-2026-10-18.json';
import foundation from '../reports/cli-admin-foundation-revision-2026-10-18.json';
import {allQuestions,questions,questionSchema,buildKnowledgeBase,globalSearch,lessons,glossaryTerms} from '../lib/content';
import {applyQuestionRevision,questionRevisionContract} from '../lib/question-revision';
import {answerExplanation} from '../lib/answer-explanation';
import {score} from '../lib/learning';
import {questionIssues} from '../lib/question-quality';

const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const base='content/gh300/2026-08-07/';
const paths={lessons:'lessons/seed.json',glossary:'glossary/terms.json',comparisons:'comparisons/guides.json',sources:'sources.json'};

describe('management content corrections',()=>{
 it('changes only recorded learning assets and sources, preserving all unrelated content',()=>{
  expect(report.changes.filter(c=>c.kind==='lessons')).toHaveLength(3);
  expect(report.changes.filter(c=>c.kind==='glossary')).toHaveLength(11);
  expect(report.changes.filter(c=>c.kind==='comparisons')).toHaveLength(2);
  for(const [kind,path] of Object.entries(paths)){
   const rows=JSON.parse(readFileSync(base+path,'utf8')) as Array<{id:string}>;
   const before=report.beforeFingerprints[kind as keyof typeof report.beforeFingerprints] as Record<string,string>;
   expect(new Set(rows.map(r=>r.id)).size).toBe(rows.length);
   for(const current of rows){
    const later=foundation.changes.find(c=>c.kind===kind&&c.id===current.id);
    if(later)expect(current).toEqual(later.after);
    const row=later?.before??current;
    const next=expansion.changes.find(c=>c.kind===kind&&c.id===row.id);
    if(next)expect(row).toEqual(next.after);
    if(next&&!next.before)continue;
    const edition=next?.before??row;
    const change=report.changes.find(c=>c.kind===kind&&c.id===row.id);
    if(change){expect(edition).toEqual(change.after);expect(change.evidenceIds.length).toBeGreaterThan(0);}
    else expect(hash(edition)).toBe(before[row.id]);
   }
   for(const id of Object.keys(before))expect(rows.some(r=>r.id===id)).toBe(true);
  }
 });

 it('preserves historical question assets, keys and selection distribution',()=>{
  expect(hash(seed)).toBe(report.baselineSeedFingerprint);
  expect(hash(details)).toBe(report.baselineDetailsFingerprint);
  expect(hash(official)).toBe(report.baselineOfficialRevisionFingerprint);
  const eligible=questions.filter(q=>q.status==='verified');
  expect(eligible).toHaveLength(253);
  for(const [field,expected] of [['difficulty',report.counts.byDifficulty],['domainId',report.counts.byDomain]] as const){
   const counts=eligible.reduce((a,q)=>(a[q[field]]=(a[q[field]]??0)+1,a),{} as Record<string,number>);
   expect(counts).toEqual(expected);
  }
  expect(revisions.questions.map(q=>q.id).sort()).toEqual(['q-d2-g18','q-d2-g21','q-d6-a05','q-d6-g01'].sort());
  for(const row of report.questions){
   const current=allQuestions.find(q=>q.id===row.id)!;
   expect(current).toEqual(questionSchema.parse(row.after));
   for(const key of ['choices','answer','difficulty','type','status','domainId','objectiveId'] as const)expect(row.after[key]).toEqual(row.before[key]);
   expect(questionIssues(current)).toEqual([]);
   for(const c of current.choices)expect(score(current,[c.id])).toBe(current.answer.includes(c.id));
  }
 });

 it('binds current explanations to exact editions without changing saved old questions',()=>{
  for(const row of report.questions){
   const old=questionSchema.parse(row.before),current=allQuestions.find(q=>q.id===row.id)!;
   expect(questionRevisionContract(current)).toBe(row.afterContract);
   expect(answerExplanation(current)).toBe(row.displayedExplanation);
   expect(answerExplanation(old)).toBe(row.previousDisplayedExplanation);
   expect(applyQuestionRevision({...old,question:old.question+'未確認の別条件'}).question).not.toBe(current.question);
   expect(row.invalidatePreviousSnapshots).toBe(false);
  }
 });

 it('does not keep obsolete API examples or universal seat and trigger claims in corrected teaching material',()=>{
  const changed=JSON.stringify(report.changes.filter(c=>c.kind!=='sources').map(c=>c.after));
  expect(changed).not.toMatch(/copilot\/usage|シートを持つユーザーのみ|シートを持たないユーザーは利用不可|copilot\.cf_update|組織ポリシーで新規PR作成時に自動実行可能/);
  const lesson=lessons.find(l=>l.id==='lesson-d2-org-governance')!;
  const text=JSON.stringify(lesson.sections);
  expect(text).toContain('/copilot/billing/seats');expect(text).toContain('download_links');
  expect(text).toContain('View Organization Copilot Metrics');
  expect(text).toContain('Read enterprise audit logs');
  expect(text).toContain('個人向けFree');
 });

 it('keeps search and related links usable after renaming the policy term',()=>{
  const kb=buildKnowledgeBase();
  const result=globalSearch(kb,'Policy Inheritance');
  expect(result.some(r=>r.id==='g-policy-inheritance')).toBe(true);
  const term=glossaryTerms.find(t=>t.id==='g-policy-inheritance')!;
  expect(term.term).toBe('Copilot Policy Enforcement and Delegation');
  for(const row of report.changes.filter(c=>c.kind==='glossary')){
   const term=glossaryTerms.find(t=>t.id===row.id)!;
   for(const id of term.lessonIds)expect(lessons.some(l=>l.id===id)).toBe(true);
  }
 });
});
