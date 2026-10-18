import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import report from '../reports/cli-admin-reference-expansion-2026-10-18.json';
import foundation from '../reports/cli-admin-foundation-revision-2026-10-18.json';
import {buildKnowledgeBase,globalSearch,lessons,questions} from '../lib/content';
import {lessonSchema,referenceTableSchema,validateKnowledgeBase} from '../lib/knowledge';

const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
describe('structured CLI and administrator references',()=>{
 it('publishes eight valid tables, with four cells, row-specific sources and stable IDs',()=>{
  const kb=buildKnowledgeBase();expect(validateKnowledgeBase(kb)).toEqual([]);
  const tables=kb.lessons.flatMap(l=>l.sections.flatMap(s=>s.table?[s.table]:[]));
  expect(tables).toHaveLength(8);expect(tables.reduce((n,t)=>n+t.rows.length,0)).toBe(39);
  expect(new Set(tables.map(t=>t.id)).size).toBe(8);
  for(const table of tables)expect(referenceTableSchema.safeParse(table).success).toBe(true);
  for(const lesson of kb.lessons)expect(lessonSchema.safeParse(lesson).success).toBe(true);
 });
 it('rejects broken columns, duplicate rows and missing source references',()=>{
  const kb=buildKnowledgeBase(),lesson=kb.lessons.find(l=>l.id==='lesson-d2-cli')!;
  const table=lesson.sections[0].table!;
  expect(referenceTableSchema.safeParse({...table,rows:[{...table.rows[0],cells:['missing']}]}).success).toBe(false);
  expect(referenceTableSchema.safeParse({...table,rows:[table.rows[0],table.rows[0]]}).success).toBe(false);
  const invalid=structuredClone(kb);invalid.lessons.find(l=>l.id===lesson.id)!.sections[0].table!.rows[0].sourceIds=['unknown-source'];
  expect(validateKnowledgeBase(invalid).some(e=>e.field==='table.sourceIds')).toBe(true);
  const missing=structuredClone(kb);missing.lessons.find(l=>l.id===lesson.id)!.sourceIds=[];
  expect(validateKnowledgeBase(missing).some(e=>e.field==='table.sourceIds')).toBe(true);
 });
 it('finds commands and permissions written only in table cells, with old lesson searching intact',()=>{
  const kb=buildKnowledgeBase();
  for(const keyword of ['--resume=SESSION-ID','/permissions show','--excluded-tools=grep'])
   expect(globalSearch(kb,keyword).some(r=>r.id==='lesson-d2-cli')).toBe(true);
  for(const keyword of ['billing manager','Read enterprise audit logs','Student'])
   expect(globalSearch(kb,keyword).some(r=>r.id==='lesson-d2-org-governance')).toBe(true);
  expect(globalSearch(kb,'ハルシネーション').some(r=>r.type==='Lesson')).toBe(true);
 });
 it('preserves every question asset and unrelated learning item',()=>{
  for(const [file,fingerprint] of Object.entries(report.questionFingerprints))
   expect(hash(JSON.parse(readFileSync('content/gh300/2026-08-07/questions/'+file,'utf8')))).toBe(fingerprint);
  const paths={lessons:'lessons/seed.json',glossary:'glossary/terms.json',comparisons:'comparisons/guides.json',sources:'sources.json'};
  for(const [kind,path] of Object.entries(paths)){
   const rows=JSON.parse(readFileSync('content/gh300/2026-08-07/'+path,'utf8')) as Array<{id:string}>;
   const before=report.beforeFingerprints[kind as keyof typeof report.beforeFingerprints] as Record<string,string>;
   for(const current of rows){
    const later=foundation.changes.find(c=>c.kind===kind&&c.id===current.id);
    if(later)expect(current).toEqual(later.after);
    const row=later?.before??current;
    const change=report.changes.find(c=>c.kind===kind&&c.id===row.id);
    if(change)expect(row).toEqual(change.after);else expect(hash(row)).toBe(before[row.id]);
   }
   for(const id of Object.keys(before))expect(rows.some(row=>row.id===id)).toBe(true);
  }
  const current=questions.filter(q=>q.status==='verified');expect(current).toHaveLength(253);
  for(const [field,expected] of [['difficulty',report.counts.byDifficulty],['domainId',report.counts.byDomain]] as const)
   expect(current.reduce((a,q)=>(a[q[field]]=(a[q[field]]??0)+1,a),{} as Record<string,number>)).toEqual(expected);
  expect(lessons.find(l=>l.id==='lesson-d2-cli')!.status).toBe('needs-review');
 });
 it('distinguishes direct answer coverage from scenarios, distractors and missing questions',()=>{
  expect(report.coverage).toHaveLength(39);
  expect(report.coverage.find(r=>r.rowId==='cli-model')?.classification).toBe('DISTRACTOR_ONLY');
  expect(report.coverage.find(r=>r.rowId==='cli-context-usage')?.classification).toBe('SCENARIO_ONLY');
  expect(report.coverage.find(r=>r.rowId==='cli-permissions')?.classification).toBe('NOT_TESTED');
  expect(report.coverage.find(r=>r.rowId==='cli-login-interactive')?.classification).toBe('CORRECT_CHOICE');
  for(const row of report.coverage){
   for(const id of [...row.correctChoiceQuestionIds,...row.scenarioQuestionIds,...row.distractorOnlyQuestionIds])
    expect(questions.find(q=>q.id===id)?.status).toBe('verified');
  }
  for(const candidate of report.nextCandidates)expect(questions.find(q=>q.id===candidate.id)?.difficulty).toBe('beginner');
 });
});
