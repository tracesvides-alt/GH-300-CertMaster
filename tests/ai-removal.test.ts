import {describe,it,expect} from 'vitest';
import {questions,questionSchema} from '../lib/content';
import {withoutDeletedSessionQuestions} from '../lib/question-availability';
import {defaultSelectionOptions,selectionOptionsSchema,selectQuestions} from '../lib/selection';
const fixed=questions.find(q=>q.status==='verified')!;
const legacy={...fixed,id:'legacy-ai',status:'ai-generated' as const,lastVerifiedAt:null};
describe('fixed-content learning after AI removal',()=>{
 it('drops old AI preferences without losing practice settings',()=>{
  const value=selectionOptionsSchema.parse({...defaultSelectionOptions,count:30,mode:'Weak Points',includeAI:true,verifiedOnly:false});
  expect(value).toMatchObject({count:30,mode:'Weak Points'});
  expect(value).not.toHaveProperty('includeAI');expect(value).not.toHaveProperty('verifiedOnly');
  expect(selectQuestions([legacy,fixed],value,{attempts:[]}).questions.map(q=>q.id)).toEqual([fixed.id]);
 });
 it('keeps legacy generated snapshots readable for existing history',()=>{
  expect(questionSchema.parse(legacy).id).toBe('legacy-ai');
 });
 it('removes generated questions from resumable mocks, adjusting position and answers',()=>{
  const session={id:'old-session',questions:[legacy,fixed],index:1,completed:false,answers:{[legacy.id]:legacy.answer,[fixed.id]:fixed.answer}};
  const adjusted=withoutDeletedSessionQuestions(session);
  expect(adjusted.questions).toEqual([fixed]);expect(adjusted.index).toBe(0);expect(adjusted.answers).toEqual({[fixed.id]:fixed.answer});
  expect(session.questions).toHaveLength(2);
  expect(withoutDeletedSessionQuestions({...session,completed:true})).toEqual({...session,completed:true});
 });
 it('leaves an all-generated unfinished mock empty instead of offering AI practice',()=>{
  const adjusted=withoutDeletedSessionQuestions({questions:[legacy],index:0,completed:false,answers:{[legacy.id]:legacy.answer}});
  expect(adjusted.questions).toEqual([]);expect(adjusted.answers).toEqual({});
 });
});
