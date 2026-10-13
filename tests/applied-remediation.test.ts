import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import raw from '../content/gh300/2026-08-07/questions/seed.json';
import report from '../reports/applied-remediation-review.json';
import exclusions from '../content/gh300/2026-08-07/questions/selection-exclusions.json';
import {allQuestions} from '../lib/content';
import {score} from '../lib/learning';
import {validateAppliedRemediation} from '../scripts/check-applied-remediation.mjs';
import {assertLegacyRewriteScope} from '../scripts/question-rewrite-safety.mjs';
import {remediationDecisions} from './fixtures/applied-remediation-decisions';

// Locate the semantically correct action, independently of the stored answer ID.
describe('Applied answer content remediation',()=>{
 it.each(remediationDecisions)('%s scores the action supported by its scenario as correct',(id,action)=>{
  const q=allQuestions.find(q=>q.id===id)!;
  const candidates=q.choices.filter(c=>action.test(c.text));
  expect(candidates).toHaveLength(1);
  expect(score(q,[candidates[0].id])).toBe(true);
  for(const c of q.choices.filter(c=>c.id!==candidates[0].id))expect(score(q,[c.id])).toBe(false);
  expect(q.choiceExplanations[candidates[0].id]).toBe(q.explanation);
 });
 it('keeps every current Applied decision bound to approved answer content',()=>{
  expect(validateAppliedRemediation(raw,report,new Set(exclusions.questions.map(r=>r.id)))).toEqual([]);
  const changed=structuredClone(raw),q=changed.find(q=>q.id==='q-d3-a19')!;
  const a=q.choices.find(c=>c.id==='A')!,c=q.choices.find(c=>c.id==='B')!;
  [a.text,c.text]=[c.text,a.text];
  // Even if another updater refreshes ordinary fingerprints, the independent
  // editorial answer content still rejects the old ID/content inversion.
  const refreshed=structuredClone(report),r=refreshed.questions.find(r=>r.id===q.id)!;
  r.after.choices=q.choices;r.fingerprint=createHash('sha256').update(JSON.stringify(q)).digest('hex');
  expect(validateAppliedRemediation(changed,refreshed,new Set())).toContain('Answer content does not match editorial decision: '+q.id);
 });
 it('blocks legacy direct rewrites of reviewed questions before any write',()=>{
  expect(()=>assertLegacyRewriteScope(raw,{'q-d3-a18':{choices:{A:'別の回答'}}})).toThrow('削除済み問題');
  expect(()=>assertLegacyRewriteScope(raw,{'q-d3-a19':{choices:{A:'別の回答'}}})).toThrow('レビュー済み問題');
  expect(()=>assertLegacyRewriteScope([],{draft:{choices:{A:'回答'}}})).toThrow('正しい選択肢のID');
  expect(()=>assertLegacyRewriteScope([{id:'draft',status:'needs-review',answer:['B']}],{draft:{correctChoiceId:'A',choices:{A:'回答'},explanation:'根拠',choiceExplanations:{A:'根拠'}}})).toThrow('正答ID・本文・解説');
 });
});
