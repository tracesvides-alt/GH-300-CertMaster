import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {validateQuestionAdditions,combinedChoiceBaseline,combinedDifficultyBaseline} from '../scripts/question-additions.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const dir='content/gh300/2026-08-07/';
const ledger=read(dir+'questions/additions-review.json'),bank=read(dir+'questions/seed.json');
describe('final D1 / D3 additions',()=>{
 it('registers only the twelve reviewed Applied items and preserves historical snapshots',()=>{
  expect(validateQuestionAdditions(bank,ledger)).toEqual([]);
  expect(ledger.questions.length+(ledger.removedAdditions?.length??0)).toBe(12);
  for(const [path,fingerprint] of Object.entries(ledger.baseline.historicalBaselineFingerprints)){
   const bytes=fs.readFileSync(new URL('../'+path,import.meta.url));
   expect(createHash('sha256').update(bytes).digest('hex')).toBe(fingerprint);
  }
  const choice=read('reports/question-choice-content-baseline.json'),difficulty=read('reports/question-difficulty-baseline.json');
  expect(Object.keys(choice.questions)).toHaveLength(316);
  expect(difficulty.questions).toHaveLength(316);
  expect(Object.keys(combinedChoiceBaseline(choice,ledger).questions)).toHaveLength(bank.length);
  expect(combinedDifficultyBaseline(difficulty,ledger).questions).toHaveLength(bank.length);
 });
 it('rejects stale added text, unsigned reviews, and incomplete counterfactual evidence',()=>{
  const changed=structuredClone(bank);changed.find(q=>q.id===ledger.questions[0].id).question+='未評価の変更';
  expect(validateQuestionAdditions(changed,ledger)).toContain('Stale added question: '+ledger.questions[0].id);
  const unsigned=structuredClone(ledger);unsigned.questions[0].review.status='PENDING_SECOND_READ';
  expect(validateQuestionAdditions(bank,unsigned)).toContain('Missing addition editorial evidence: '+unsigned.questions[0].id);
  const incomplete=structuredClone(ledger);incomplete.questions[0].review.counterfactuals.pop();
  expect(validateQuestionAdditions(bank,incomplete)).toContain('Missing counterfactuals: '+incomplete.questions[0].id);
 });
 it('cannot recast an added question as part of an immutable historical baseline',()=>{
  const base=read('reports/question-choice-content-baseline.json');
  base.questions[ledger.questions[0].id]={};
  expect(()=>combinedChoiceBaseline(base,ledger)).toThrow('Addition also appears in historical baseline');
 });
 it('links the new items to existing lessons, glossary terms, and source reverse references',()=>{
  const lessons=read(dir+'lessons/seed.json'),terms=read(dir+'glossary/terms.json'),sources=read(dir+'sources.json');
  for(const row of ledger.questions){
   for(const id of row.review.lessonIds)expect(lessons.find(l=>l.id===id).questionIds).toContain(row.id);
   for(const id of row.review.glossaryIds)expect(terms.find(t=>t.id===id).questionIds).toContain(row.id);
   for(const id of row.after.sourceIds)expect(sources.find(s=>s.id===id).relatedQuestionIds).toContain(row.id);
  }
 });
});
