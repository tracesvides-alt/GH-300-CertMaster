import {describe,expect,it} from 'vitest';
import {allQuestions,questions,buildKnowledgeBase,questionSchema} from '../lib/content';
import {isQuestionActive,withoutDeletedSessionQuestions} from '../lib/question-availability';
import {selectQuestions,selectMockQuestions,defaultSelectionOptions} from '../lib/selection';
import removals from '../content/gh300/2026-08-07/questions/removals.json';
import record from '../reports/applied-six-deletion-review.json';
import foundation from '../content/gh300/2026-08-07/questions/foundation-priority-review.json';

const expected=['q-d2-a15','q-d3-a11','q-d3-a12','q-d3-a18','q-d5-a02','q-d5-a05'];
describe('six explicitly deleted Applied questions',()=>{
 it('removes exactly the approved six assets and all live knowledge references',()=>{
  expect(removals.questions.map(q=>q.id).sort()).toEqual([...expected].sort());
  expect(allQuestions).toHaveLength(foundation.baseline.stored+foundation.questions.length);expect(questions).toHaveLength(254);
  expect(questions.filter(q=>q.difficulty==='intermediate')).toHaveLength(48);
  const kb=buildKnowledgeBase();
  for(const id of expected){expect(allQuestions.some(q=>q.id===id)).toBe(false);expect(kb.questionIds).not.toContain(id);expect(isQuestionActive({id})).toBe(false);}
 });
 it('cannot restore deleted snapshots through bookmarks, incorrect answers or mock selection',()=>{
  const deleted=record.questions.map(q=>questionSchema.parse(q.before)),pool=[...allQuestions,...deleted];
  const attempts=deleted.map((q,index)=>({id:'deleted-'+index,questionId:q.id,objectiveId:q.objectiveId,domainId:q.domainId,at:index,answer:q.answer,correct:false,status:'verified' as const}));
  const context={attempts,bookmarkIds:expected,rng:()=>0.5};
  for(const scope of ['bookmarked','incorrect'] as const)expect(selectQuestions(pool,{...defaultSelectionOptions,scope},context).actualCount).toBe(0);
  expect(selectMockQuestions(pool,50,context).questions.every(isQuestionActive)).toBe(true);
 });
 it('removes deleted pending mock items and remaps progress without mutating the snapshot',()=>{
  const removed=record.questions[0].before,active=questions[0];
  const original={questions:[removed,active,removed],index:1,completed:false,answers:{[removed.id]:['A'],[active.id]:['A']}};
  const result=withoutDeletedSessionQuestions(original);
  expect(result.questions).toEqual([active]);expect(result.index).toBe(0);expect(result.answers).toEqual({[active.id]:['A']});
  expect(original.questions).toHaveLength(3);
  const completed={...original,completed:true};expect(withoutDeletedSessionQuestions(completed)).toBe(completed);
  expect(withoutDeletedSessionQuestions({...original,questions:[removed],index:0}).questions).toEqual([]);
 });
});
