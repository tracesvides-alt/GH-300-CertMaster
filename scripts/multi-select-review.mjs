import fs from 'node:fs';
import {createHash} from 'node:crypto';
export const multiFingerprint=q=>createHash('sha256').update(JSON.stringify(q)??'undefined').digest('hex');
export function loadMultiSelect(root=new URL('../',import.meta.url)){
 const p=new URL('content/gh300/2026-08-07/questions/multi-select-review.json',root);
 return fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):null;
}
export function validateMultiSelect(bank,exclusions,ledger=loadMultiSelect()){
 if(!ledger)return [];
 const errors=[],byId=new Map(bank.map(q=>[q.id,q])),retired=new Map(exclusions.questions.map(r=>[r.id,r]));
 if(bank.length!==ledger.baseline.stored+ledger.questions.length)errors.push('Changed multi-select inventory');
 for(const [id,h] of Object.entries(ledger.baseline.questionFingerprints))if(multiFingerprint(byId.get(id))!==h)errors.push('Changed pre-multi historical asset: '+id);
 for(const r of ledger.questions){
  const q=byId.get(r.id),old=byId.get(r.oldId);
  if(!q||multiFingerprint(q)!==r.fingerprint||multiFingerprint(r.after)!==r.fingerprint)errors.push('Stale multi-select asset: '+r.id);
  if(!retired.get(r.oldId)?.replacementIds.includes(r.id)||retired.has(r.id)||q?.domainId!==old?.domainId||q?.difficulty!==old?.difficulty)errors.push('Invalid multi-select replacement: '+r.id);
  if(q?.type!=='multi_select'||q.answer.length!==2||q.requiredSelections!==2||q.choices.length!==4||r.review.choiceEvaluations.filter(v=>v.valid).length!==2||r.review.choiceEvaluations.some(v=>q.answer.includes(v.id)!==v.valid||!v.reason))errors.push('Invalid independent truth table: '+r.id);
 }
 const current=bank.filter(q=>!retired.has(q.id));
 if(current.length!==ledger.baseline.active)errors.push('Changed active multi-select inventory');
 for(const [d,n] of Object.entries(ledger.baseline.byDomain))if(current.filter(q=>q.domainId===d).length!==n)errors.push('Changed multi-select domain: '+d);
 for(const [d,n] of Object.entries(ledger.baseline.byLevel))if(current.filter(q=>q.difficulty===d).length!==n)errors.push('Changed multi-select level: '+d);
 return errors;
}
// Reconstruct an earlier inventory without modifying either generation.
export function rewindMultiSelect(bank,exclusions){
 const ledger=loadMultiSelect();
 if(!ledger||!ledger.questions.some(r=>bank.some(q=>q.id===r.id)))return {bank,exclusions,errors:[]};
 const errors=validateMultiSelect(bank,exclusions,ledger),ids=new Set(ledger.questions.map(r=>r.id)),old=new Set(ledger.questions.map(r=>r.oldId));
 return {errors,bank:bank.filter(q=>!ids.has(q.id)),exclusions:{...exclusions,questions:exclusions.questions.filter(r=>!old.has(r.id))}};
}
export function reviewMultiSelectLayer(bank){
 const ledger=loadMultiSelect();if(!ledger)return {bank,errors:[]};
 const ids=new Set(ledger.questions.map(r=>r.id)),errors=[];
 for(const r of ledger.questions){const q=bank.find(q=>q.id===r.id);if(!q||multiFingerprint(q)!==r.fingerprint||multiFingerprint(r.after)!==r.fingerprint||r.review.choiceEvaluations.length!==4||r.review.choiceEvaluations.filter(v=>v.valid).length!==2)errors.push('Stale multi-select review: '+r.id);}
 return {bank:bank.filter(q=>!ids.has(q.id)),errors};
}
