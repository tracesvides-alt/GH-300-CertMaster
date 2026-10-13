import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
// Checks that an editorial decision still refers to the reviewed assets.
// It does not infer blind solvability or difficulty from text length or hashes.
export function validateAppliedFocus(bank,report,plan){
 const errors=[],ids=new Set(report.questions.map(r=>r.id));
 if(ids.size!==23||report.questions.length!==23||plan.targets.length!==23||plan.targets.some(r=>!ids.has(r.id)))errors.push('Incomplete focus review');
 for(const r of report.questions){
  const q=bank.find(q=>q.id===r.id);
  if(!q||hash(q)!==r.fingerprint||hash(r.after)!==r.fingerprint){errors.push('Stale focus decision: '+r.id);continue;}
  if(hash(r.before)!==plan.targets.find(t=>t.id===r.id)?.beforeFingerprint)errors.push('Changed baseline: '+r.id);
  if(q.difficulty!=='intermediate'||q.cognitiveLevel!=='apply'||q.examLike||q.status!=='verified')errors.push('Invalid Applied classification: '+r.id);
  if(q.domainId!==r.before.domainId||q.objectiveId!==r.before.objectiveId||JSON.stringify(q.answer)!==JSON.stringify(r.before.answer)||q.choices.map(c=>c.id).join()!==r.before.choices.map(c=>c.id).join())errors.push('Changed identity: '+r.id);
  if(JSON.stringify(q.answer)!==JSON.stringify(r.approvedAnswerIds)||hash(q.choices.find(c=>q.answer.includes(c.id))?.text)!==r.approvedAnswerContentHash||q.choiceExplanations[q.answer[0]]!==q.explanation)errors.push('Answer content mismatch: '+r.id);
  const v=r.review,wrong=q.choices.filter(c=>!q.answer.includes(c.id));
  if(v.status!=='PASS_EDITORIAL'||!v.secondReadNotes?.trim()||!v.optionOnlyEvidence?.trim()||!v.distinction?.trim()||v.reasoningSteps.length<2||v.counterfactuals.length!==3||new Set(v.counterfactuals.map(c=>c.choiceId)).size!==3||v.counterfactuals.some(c=>!c.condition?.trim()||!wrong.some(w=>w.id===c.choiceId))||v.decisiveClues.some(c=>!q.question.includes(c)))errors.push('Missing application evidence: '+r.id);
  if(wrong.some(c=>!v.wrongChoiceAnalysis.some(w=>w.id===c.id&&w.text===c.text&&w.whyWrong===q.choiceExplanations[c.id]&&w.whenValid)))errors.push('Stale distractor analysis: '+r.id);
 }
 return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
 const errors=validateAppliedFocus(read('content/gh300/2026-08-07/questions/seed.json'),read('reports/applied-23-focus-improvement-review.json'),read('reports/applied-23-focus-improvement-plan.json'));
 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify({status:'PASS',reviewed:23,counterfactuals:69,semantics:'editorial evidence; not a learner experiment'}));
}
