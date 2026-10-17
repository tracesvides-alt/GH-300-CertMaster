import {describe,it,expect} from 'vitest';
import Dexie from 'dexie';
import {questions,allQuestions,questionSchema,type Question} from '../lib/content';
import {answerDetails,isMultiSelect,toggleSelection,validSelection,multiSelectPatterns} from '../lib/question-format';
import {score,attemptFormat,formatAccuracy,type Attempt} from '../lib/learning';
import {analyzeMistake} from '../lib/adaptive-learning';
import {db,LearningDB,recordAttemptAdaptive} from '../lib/db';
import {selectMockQuestions,selectQuestions,defaultSelectionOptions} from '../lib/selection';
import {validateMultiSelect} from '../scripts/multi-select-review.mjs';
import bank from '../content/gh300/2026-08-07/questions/seed.json';
import exclusions from '../content/gh300/2026-08-07/questions/selection-exclusions.json';
const multi=questions.filter(isMultiSelect),q=multi[0];
const rngFor=(seed:number)=>()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
describe('multi-select contract and publication',()=>{
 it('validates all 54 replacements and detects stale choices and invalid history',()=>{
  expect(multi).toHaveLength(54);expect(validateMultiSelect(bank,exclusions)).toEqual([]);
  for(const p of multiSelectPatterns)expect(multi.filter(q=>q.multiSelectPattern===p).length).toBeGreaterThanOrEqual(2);
  const changed=structuredClone(bank);changed.find(v=>v.id===q.id)!.choices[0].text+='changed';
  expect(validateMultiSelect(changed,exclusions)).toContain('Stale multi-select asset: '+q.id);
 });
 it('accepts aliases and rejects a third correct candidate or invalid pattern',()=>{
  const {answer,...alias}=q;expect(questionSchema.parse(alias).answer).toEqual(answer);
  for(const invalid of [{...q,answer:['A','B','C'],correctChoiceIds:['A','B','C']},{...q,correctChoiceIds:['A','C']},{...q,requiredSelections:1},{...q,multiSelectPattern:'scenario_actions'},{...q,answer:['A','A'],correctChoiceIds:['A','A']}])expect(questionSchema.safeParse(invalid).success).toBe(false);
  expect(questionSchema.safeParse({...q,type:'multiple-select'}).success).toBe(true);
 });
 it('caps selection, allows deselection and rejects unknown IDs',()=>{
  let selected=toggleSelection(q,[],'A');expect(validSelection(q,selected)).toBe(false);
  selected=toggleSelection(q,selected,'C');expect(validSelection(q,selected)).toBe(true);
  expect(toggleSelection(q,selected,'D')).toEqual(['A','C']);
  expect(toggleSelection(q,selected,'C')).toEqual(['A']);
  expect(toggleSelection(q,selected,'unknown')).toEqual(selected);
 });
 it('scores all six pairs by exact match, never partial credit',()=>{
  for(const pair of [['A','B'],['A','C'],['A','D'],['B','C'],['B','D'],['C','D']])expect(score(q,pair)).toBe(pair.join()==='A,B');
  expect(score(q,['B','A'])).toBe(true);
  for(const a of [[],['A'],['A','A'],['A','B','C'],['A','unknown']])expect(score(q,a)).toBe(false);
  expect(answerDetails(q.answer,['A','C'])).toMatchObject({missingCorrectChoiceIds:['B'],selectedWrongChoiceIds:['C'],partialMatch:.5});
 });
 it('pairs only mistaken and missed concepts, excluding the correctly selected concept',()=>{
  const mapped:Question={...q,choiceConceptIds:{A:['g-mcp'],B:['g-prompt-files'],C:['g-custom-instructions'],D:[]}};
  const r=analyzeMistake(mapped,['A','C'],1000);
  expect(r.missingCorrectChoiceIds).toEqual(['B']);expect(r.selectedWrongChoiceIds).toEqual(['C']);
  expect(r.partialMatch).toBe(.5);
  expect(r.selectedConcepts).toEqual(['g-custom-instructions']);
  expect(r.correctConcepts).toEqual(['g-prompt-files']);
  expect(r.confusionPairIds).toEqual(['g-custom-instructions__g-prompt-files']);
 });
 it('keeps historical singles separate and computes pattern accuracy with no partial points',()=>{
  const a:Attempt={id:'a',questionId:q.id,objectiveId:q.objectiveId,domainId:q.domainId,status:'verified',answer:['A','C'],correct:false,at:1,...attemptFormat(q,['A','C'])};
  const old=allQuestions.find(v=>v.type==='single-select')!;
  const rows=formatAccuracy([a,{...a,id:'b',questionId:old.id,questionType:undefined,multiSelectPattern:undefined,correct:true}],allQuestions);
  expect(rows.find(r=>r.id==='multi')).toMatchObject({total:1,correct:0,accuracy:0});
  expect(rows.find(r=>r.id==='single')).toMatchObject({total:1,correct:1,accuracy:100});
 });
});
describe('multi-select storage and review',()=>{
 it('persists partial mistakes, updates lapse, then recovers on exact match after reload',async()=>{
  await db.delete();await db.open();
  await recordAttemptAdaptive(q,['A','C'],true,'multi-session',100000);
  const a=(await db.attempts.toArray())[0];expect(a).toMatchObject({correct:false,partialMatch:.5,missingCorrectChoiceIds:['B'],selectedWrongChoiceIds:['C'],questionType:'multi_select'});
  expect((await db.wrongAnswers.toArray())[0]).toMatchObject({partialMatch:.5,missingCorrectChoiceIds:['B']});
  expect(await db.questionReviews.get(q.id)).toMatchObject({totalIncorrect:1,intervalDays:1,totalCorrect:0});
  db.close();await db.open();expect((await db.attempts.get(a.id))?.correctChoiceIds).toEqual(['A','B']);
  await recordAttemptAdaptive(q,['B','A'],false,'multi-session',200000);
  expect((await db.attempts.toArray()).find(v=>v.at===200000)?.correct).toBe(true);
  expect((await db.wrongAnswers.toArray())[0].recovered).toBe(true);
  await db.delete();
 });
 it('migrates a v4 record without changing the original single answer or points',async()=>{
  const name='multi-migration-'+crypto.randomUUID(),old=new Dexie(name);
  old.version(4).stores({attempts:'id, questionId, objectiveId, at, sessionId',bookmarks:'id',generated:'id, objectiveId',sessions:'id',settings:'id',practiceRuns:'id, startedAt, completedAt',lessonCompletions:'id, completedAt',wrongAnswers:'id, questionId, objectiveId, domainId, answeredAt, recovered',questionReviews:'questionId, nextReviewAt, reviewPriority, lapseCount',confusionPairs:'id, severity, status, lastMistakeAt'});
  await old.open();await old.table('wrongAnswers').put({id:'old',correctChoiceIds:['A'],selectedChoiceIds:['B'],recovered:false});old.close();
  const current=new LearningDB(name);await current.open();expect(await current.wrongAnswers.get('old')).toMatchObject({correctChoiceIds:['A'],selectedChoiceIds:['B'],missingCorrectChoiceIds:['A'],selectedWrongChoiceIds:['B'],partialMatch:0});await current.delete();
 });
});
describe('selection compatibility',()=>{
 it('mixes formats in 100 mock sessions without changing ranges or admitting archived questions',()=>{
  const counts=[];
  for(let i=1;i<=100;i++){
   const r=selectMockQuestions(allQuestions,50,{attempts:[],rng:rngFor(i)});
   expect(r.meetsRanges).toBe(true);expect(r.questions).toHaveLength(50);
   expect(new Set(r.questions.map(q=>q.id)).size).toBe(50);
   expect(r.questions.every(q=>q.status==='verified'&&questions.some(v=>v.id===q.id))).toBe(true);
   const n=r.questions.filter(isMultiSelect).length;expect(n).toBeGreaterThanOrEqual(10);expect(n).toBeLessThanOrEqual(15);counts.push(n);
  }
  console.log('MULTI_MOCK_SAMPLE',JSON.stringify({runs:100,min:Math.min(...counts),max:Math.max(...counts)}));
 });
 it('respects scoped pools and does not inject formats into single-only or due-priority selection',()=>{
  const singles=questions.filter(q=>!isMultiSelect(q));
  expect(selectQuestions(singles,defaultSelectionOptions,{attempts:[]}).questions.every(q=>!isMultiSelect(q))).toBe(true);
  const r=selectQuestions(questions,{...defaultSelectionOptions,domainId:q.domainId,difficultyMode:'foundation'},{attempts:[],rng:rngFor(1)});
  expect(r.questions.every(v=>v.domainId===q.domainId&&v.difficulty==='beginner')).toBe(true);
 });
});
