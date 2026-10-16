import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {questionRemovals,removedQuestionIds} from './question-removals.mjs';
import {reviewedQuestionSnapshot} from './question-repair-history.mjs';
import {loadFoundationPriority} from './foundation-priority-review.mjs';
export const questionFingerprint=q=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
export function loadFeatureRefresh(root=new URL('../',import.meta.url)){
 const file=new URL('content/gh300/2026-08-07/questions/feature-refresh-review.json',root);
 return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
}
const editorial=q=>JSON.stringify({question:q.question,choices:q.choices,explanation:q.explanation,choiceExplanations:q.choiceExplanations});
export function loadQuestionAdditions(root=new URL('../',import.meta.url)){
 const file=new URL('content/gh300/2026-08-07/questions/additions-review.json',root);
 return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
}
export function validateQuestionAdditions(bank,ledger){
 if(!ledger)return [];
 const errors=[],rows=ledger.questions??[],ids=new Set(rows.map(r=>r.id));
 const removed=ledger.removedAdditions??[];
 if(rows.length+removed.length!==12||ids.size!==rows.length||new Set(removed.map(r=>r.id)).size!==removed.length||removed.some(r=>!questionRemovals.questions.some(q=>q.id===r.id&&q.domainId===r.domainId&&q.fingerprint===r.fingerprint)||bank.some(q=>q.id===r.id))||ledger.scope.maximumAdditions!==12||ledger.scope.furtherExpansion!==false)errors.push('Invalid final addition scope');
 if(rows.filter(r=>r.after?.domainId==='d1').length+removed.filter(r=>r.domainId==='d1').length!==8||rows.filter(r=>r.after?.domainId==='d3').length+removed.filter(r=>r.domainId==='d3').length!==4)errors.push('Invalid addition domains');
 if(ledger.status!=='EDITORIALLY_REVIEWED')errors.push('Unsigned addition ledger');
 for(const r of rows){
  const q=reviewedQuestionSnapshot(bank.find(q=>q.id===r.id),r.fingerprint);
  if(!q||questionFingerprint(q)!==r.fingerprint||questionFingerprint(r.after)!==r.fingerprint)errors.push('Stale added question: '+r.id);
  if(!r.initial||r.initial.status!=='needs-review'||r.initial.lastVerifiedAt!==null||r.initial.id!==r.id)errors.push('Missing draft provenance: '+r.id);
  if(JSON.stringify(r.initial.answer)!==JSON.stringify(q?.answer))errors.push('Changed added answer identity: '+r.id);
  if(q?.difficulty!=='intermediate'||q?.cognitiveLevel!=='apply'||q?.examLike!==false||q?.status!=='verified')errors.push('Invalid Applied addition: '+r.id);
  const v=r.review;
  if(v?.status!=='PASS_EDITORIAL'||!v.secondReadNotes?.trim()||!v.optionOnlyEvidence?.trim()||!v.distinction?.trim()||!v.difficultyEvidence?.trim())errors.push('Missing addition editorial evidence: '+r.id);
  if(!v?.nearestAppliedIds?.length||v.nearestAppliedIds.some(id=>!bank.some(q=>q.id===id&&q.difficulty==='intermediate')))errors.push('Invalid overlap comparison: '+r.id);
  if(new Set(v?.reasoningSteps??[]).size<2||v?.counterfactuals?.length<2||new Set(v?.counterfactuals?.map(c=>c.choiceId)??[]).size<2||v?.counterfactuals?.some(c=>!c.condition?.trim()||!q?.choices.some(v=>v.id===c.choiceId&&!q.answer.includes(v.id))))errors.push('Missing counterfactuals: '+r.id);
  if(!v?.decisiveClues?.length||v.decisiveClues.some(c=>!q?.question.includes(c)))errors.push('Missing decisive clues: '+r.id);
 }
 return errors;
}
/** Historical snapshots stay immutable; new drafts have their own explicit origin. */
export function combinedChoiceBaseline(historical,ledger){
 const questions=Object.fromEntries(Object.entries(historical.questions).filter(([id])=>!removedQuestionIds.has(id)));
 for(const r of ledger?.questions??[]){
  if(questions[r.id])throw Error('Addition also appears in historical baseline: '+r.id);
  questions[r.id]={contentHash:createHash('sha256').update(editorial(r.initial)).digest('hex'),
   distractorHashes:Object.fromEntries(r.initial.choices.filter(c=>!r.initial.answer.includes(c.id)).map(c=>[c.id,createHash('sha256').update(c.text).digest('hex')])),added:true,origin:'additions-review.json'};
 }
 for(const row of loadFeatureRefresh()?.questions??[]){
  if(questions[row.id])throw Error('Replacement also appears in historical baseline: '+row.id);
  questions[row.id]={contentHash:createHash('sha256').update(editorial(row.initial)).digest('hex'),
   distractorHashes:Object.fromEntries(row.initial.choices.filter(c=>!row.initial.answer.includes(c.id)).map(c=>[c.id,createHash('sha256').update(c.text).digest('hex')])),added:true,origin:'feature-refresh-review.json'};
 }
 for(const row of loadFoundationPriority()?.questions??[]){
  if(questions[row.id])throw Error('Foundation replacement also appears in historical baseline: '+row.id);
  questions[row.id]={contentHash:createHash('sha256').update(editorial(row.initial)).digest('hex'),
   distractorHashes:Object.fromEntries(row.initial.choices.filter(c=>!row.initial.answer.includes(c.id)).map(c=>[c.id,createHash('sha256').update(c.text).digest('hex')])),added:true,origin:'foundation-priority-review.json'};
 }
 return {...historical,questions};
}
export function combinedDifficultyBaseline(historical,ledger){
 const questions=historical.questions.filter(q=>!removedQuestionIds.has(q.id));
 for(const r of ledger?.questions??[]){
  if(questions.some(q=>q.id===r.id))throw Error('Addition also appears in historical difficulty baseline: '+r.id);
  questions.push(r.initial);
 }
 for(const row of loadFeatureRefresh()?.questions??[]){
  if(questions.some(q=>q.id===row.id))throw Error('Replacement also appears in historical difficulty baseline: '+row.id);
  questions.push(row.initial);
 }
 for(const row of loadFoundationPriority()?.questions??[]){
  if(questions.some(q=>q.id===row.id))throw Error('Foundation replacement also appears in historical difficulty baseline: '+row.id);
  questions.push(row.initial);
 }
 return {...historical,questions};
}
