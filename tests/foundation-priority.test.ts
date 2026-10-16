import {describe,it,expect} from 'vitest';
import rawBank from '../content/gh300/2026-08-07/questions/seed.json';
import exclusions from '../content/gh300/2026-08-07/questions/selection-exclusions.json';
import ledger from '../content/gh300/2026-08-07/questions/foundation-priority-review.json';
import {validateFoundationPriority} from '../scripts/foundation-priority-review.mjs';
import {allQuestions} from '../lib/content';
import {defaultSelectionOptions,selectQuestions} from '../lib/selection';
import {calculateObjectiveStats} from '../lib/selection';

describe('original Foundation replacements and saved history',()=>{
 it('keeps the complete previous bank unchanged and rejects unreviewed edits or lost archives',()=>{
  expect(validateFoundationPriority(rawBank,exclusions,ledger)).toEqual([]);
  const edit=structuredClone(rawBank);edit.find(q=>q.id===ledger.questions[0].id)!.choices[0].text+=' changed';
  expect(validateFoundationPriority(edit,exclusions,ledger)).toContain('Stale Foundation question: '+ledger.questions[0].id);
  const archive=structuredClone(rawBank);archive.find(q=>q.id===ledger.questions[0].oldId)!.question+=' changed';
  expect(validateFoundationPriority(archive,exclusions,ledger)).toContain('Changed historical question: '+ledger.questions[0].oldId);
  const missing=structuredClone(exclusions);missing.questions=missing.questions.filter(q=>q.id!==ledger.questions[0].oldId);
  expect(validateFoundationPriority(rawBank,missing,ledger)).toContain('Invalid Foundation history: '+ledger.questions[0].id);
 });
 it('selects all replacements, excludes their retired bookmarks, and does not transfer old failures to the new concepts',()=>{
  const ids=ledger.questions.map(r=>r.id),oldIds=ledger.questions.map(r=>r.oldId);
  const old=allQuestions.find(q=>q.id===oldIds[0])!;
  const attempt={id:'old-attempt',questionId:old.id,domainId:old.domainId,objectiveId:old.objectiveId,answer:old.answer,correct:false,at:1,status:'verified' as const};
  const result=selectQuestions(allQuestions,{...defaultSelectionOptions,count:10,scope:'bookmarked'},
   {attempts:[attempt],bookmarkIds:[...oldIds,...ids],rng:()=>0.5});
  expect(result.questions.map(q=>q.id).sort()).toEqual([...ids].sort());
  expect(result.questions.every(q=>q.difficulty==='beginner'&&q.status==='verified')).toBe(true);
  expect(calculateObjectiveStats([attempt],['d2o2']).d2o2.attempts).toBe(0);
  expect(allQuestions.find(q=>q.id===old.id)!.answer).toEqual(old.answer);
 });
 it('rejects editorial evidence that no longer has an alternative answer or retained concept',()=>{
  const invalid=structuredClone(ledger);invalid.questions[0].review.counterfactual.answerId='A';
  expect(validateFoundationPriority(rawBank,exclusions,invalid)).toContain('Missing Foundation editorial evidence: '+invalid.questions[0].id);
  const lost=structuredClone(ledger);lost.questions[0].retainedIds=[lost.questions[1].oldId];
  expect(validateFoundationPriority(rawBank,exclusions,lost)).toContain('Lost original concept: '+lost.questions[0].id);
 });
});
