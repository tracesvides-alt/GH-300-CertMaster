import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import ledger from '../reports/copilot-feature-quality-repairs-2026-10-16.json';
import {reviewedQuestionSnapshot,validateQuestionRepairs} from '../scripts/question-repair-history.mjs';
const hash=(q:unknown)=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
describe('reviewed content amendments and earlier evidence',()=>{
 it('rejects changes after the recorded review without changing identity or classification',()=>{
  expect(validateQuestionRepairs(seed,ledger)).toEqual([]);
  const changed=structuredClone(seed),q=changed.find(q=>q.id===ledger.questions[0].id)!;
  q.choices[0].text+=' unreviewed';
  expect(validateQuestionRepairs(changed,ledger)).toContain('Stale repair: '+q.id);
  expect(ledger.inventoryAfter).toEqual(ledger.inventoryBefore);
  expect(ledger.scope).toEqual({reviewed:91,contentChanged:76,retainedContent:15});
 });
 it('uses an earlier snapshot only when both sides of the reviewed amendment match',()=>{
  const row=ledger.questions.find(r=>r.id==='q-d3-a17')!,q=seed.find(q=>q.id===row.id)!;
  expect(reviewedQuestionSnapshot(q,hash(row.before),ledger)).toEqual(row.before);
  const edited={...q,question:'unreviewed text'};
  expect(reviewedQuestionSnapshot(edited,hash(row.before),ledger)).toEqual(edited);
  const forged=structuredClone(ledger);forged.questions.find(r=>r.id===q.id)!.after.question+=' changed';
  expect(reviewedQuestionSnapshot(q,hash(row.before),forged)).toEqual(q);
 });
 it('makes automated personal sync an explicit requirement instead of accepting manual distribution',()=>{
  const q=seed.find(q=>q.id==='q-sc03-3-feature-20261016')!;
  expect(q.question).toContain('変更を自動同期');
  expect(q.question).toContain('手動配布は行いません');
  expect(q.choices.find(c=>q.answer.includes(c.id))!.text).toContain('Prompts and Instructions');
 });
 it('separates actual CLI tool names from shell permission kinds',()=>{
  const row=ledger.questions.find(r=>r.id==='q-d5-e07-feature-20261016')!,q=row.after;
  expect(q.question).toContain('--available-tools=view,grep');
  expect(q.question).not.toContain('--available-tools=read,search');
  expect(q.choices.find(c=>q.answer.includes(c.id))!.text).toBe('grepは候補に残るが、bashは候補に入らない');
  expect(row.review.counterfactual.question).toContain('--available-tools=view,grep,bash');
  expect(q.choices.find(c=>c.id===row.review.counterfactual.answerId)!.text).toBe('grepは候補に残り、bashも候補に入る');
 });
});
