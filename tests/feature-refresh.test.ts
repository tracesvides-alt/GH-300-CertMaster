import {describe,it,expect} from 'vitest';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import ledger from '../reports/copilot-feature-refresh-2026-10-16.json';
import exclusions from '../content/gh300/2026-08-07/questions/selection-exclusions.json';
import plan from '../reports/copilot-feature-replacement-plan-2026-10-15.json';
import {validateFeatureRefresh} from '../scripts/check-feature-refresh.mjs';
import {allQuestions,questionSchema} from '../lib/content';
import {mastery,score,type Attempt} from '../lib/learning';
import {calculateObjectiveStats,selectQuestions,defaultSelectionOptions} from '../lib/selection';
import {analyzeMistake,currentConfusionPairs} from '../lib/adaptive-learning';

describe('feature replacement publication and history boundary',()=>{
 it('binds all approved and rejected decisions to current assets',()=>{
  expect(validateFeatureRefresh(seed,ledger,exclusions,plan)).toEqual([]);
  for(const row of ledger.questions)expect(questionSchema.safeParse(row.after).success).toBe(true);
  const changed=structuredClone(seed);changed.find(q=>q.id===ledger.questions[0].id)!.choices[0].text+=' altered';
  expect(validateFeatureRefresh(changed,ledger,exclusions,plan)).toContain('Stale reviewed asset: '+ledger.questions[0].id);
  const revived=structuredClone(exclusions);revived.questions=revived.questions.filter(q=>q.id!==ledger.questions[0].oldId);
  expect(validateFeatureRefresh(seed,ledger,revived,plan)).toContain('Invalid history boundary: '+ledger.questions[0].id);
  const unreviewed=structuredClone(ledger);unreviewed.questions[0].review.clues=['absent clue'];
  expect(validateFeatureRefresh(seed,unreviewed,exclusions,plan)).toContain('Missing literal clues: '+ledger.questions[0].id);
 });
 it('keeps old successes out of current mastery, weakness stats and incorrect review',()=>{
  const attempts:Attempt[]=ledger.questions.map((r,i)=>{const q=r.after;return {id:'old-'+i,questionId:r.oldId,domainId:q.domainId,objectiveId:q.objectiveId,answer:['A'],correct:true,status:'verified',at:i};});
  expect(mastery(attempts).readiness).toBe(0);
  expect(Object.values(calculateObjectiveStats(attempts)).reduce((n,s)=>n+s.attempts,0)).toBe(0);
  const q=allQuestions.find(q=>q.id===ledger.questions[0].id)!;
  const fresh:Attempt={...attempts[0],id:'new',questionId:q.id,answer:q.answer,correct:true};
  expect(mastery([...attempts,fresh]).readiness).toBeGreaterThan(0);
  expect(calculateObjectiveStats([...attempts,fresh])[q.objectiveId].attempts).toBe(1);
  const result=selectQuestions(allQuestions,{...defaultSelectionOptions,scope:'incorrect'},{attempts:attempts.map(a=>({...a,correct:false}))});
  expect(result.actualCount).toBe(0);
 });
 it('scores saved archived snapshots with their original answer content',()=>{
  const old=allQuestions.find(q=>q.id===ledger.questions[0].oldId)!;
  expect(score(questionSchema.parse(old),old.answer)).toBe(true);
  expect(score(old,old.choices.filter(c=>!old.answer.includes(c.id)).slice(0,1).map(c=>c.id))).toBe(false);
 });
 it('rebuilds concept counts from current records while preserving mixed archived records',()=>{
  const old=allQuestions.find(q=>q.id===ledger.questions[0].oldId)!,fresh=allQuestions.find(q=>q.id===ledger.questions[0].id)!;
  const records=[old,old,old,fresh].map((q,i)=>({...analyzeMistake(q,[],i),id:'record-'+i,confusionPairIds:['g-mcp__g-prompt-files']}));
  const before=JSON.stringify(records);
  const pairs=currentConfusionPairs(records,[]);
  expect(pairs).toHaveLength(1);
  expect(pairs[0].mistakeCount).toBe(1);
  expect(pairs[0].severity).toBe('Low');
  expect(pairs[0].relatedQuestionIds).toEqual([fresh.id]);
  expect(JSON.stringify(records)).toBe(before);
  expect(currentConfusionPairs(records.slice(0,3),[])).toEqual([]);
 });
});
