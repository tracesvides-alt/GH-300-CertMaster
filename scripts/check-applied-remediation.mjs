import fs from 'node:fs';
import {reviewMultiSelectLayer} from './multi-select-review.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadFeatureRefresh} from './question-additions.mjs';
import {reviewedQuestionSnapshot} from './question-repair-history.mjs';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Binds an explicit editorial decision to its answer content, not just an ID.
export function validateAppliedRemediation(bank, report, retiredIds = new Set(), refresh = loadFeatureRefresh()) {
  const layer=reviewMultiSelectLayer(bank);bank=layer.bank;
  const errors=[...layer.errors], rows=new Map(report.questions.map(r=>[r.id,r]));
  const activeApplied=bank.filter(q=>q.difficulty==='intermediate'&&!retiredIds.has(q.id));
  const replacements=new Map((refresh?.questions??[]).map(r=>[r.id,r]));
  if(rows.size!==report.questions.length||report.questions.length!==report.scope.activeApplied+report.scope.additionalFoundation)errors.push('Incomplete remediation scope');
  for(const q of activeApplied){
    if(rows.has(q.id))continue;
    const r=replacements.get(q.id);
    if(!r||r.fingerprint!==hash(q)||hash(r.after)!==r.fingerprint||r.review?.status!=='EDITORIAL_SECOND_READ')errors.push('Unreviewed Applied asset: '+q.id);
  }
  for(const r of report.questions){
    const q=reviewedQuestionSnapshot(bank.find(q=>q.id===r.id),r.fingerprint);
    if(!q||hash(q)!==r.fingerprint||hash(r.after)!==r.fingerprint){errors.push('Stale remediation decision: '+r.id);continue;}
    if(r.review.status!=='PASS_EDITORIAL'||q.status!=='verified'||!r.review.secondReadNotes?.trim())errors.push('Unsigned remediation decision: '+r.id);
    if(JSON.stringify(q.answer)!==JSON.stringify(r.approvedAnswerIds)||hash(q.choices.find(c=>q.answer.includes(c.id))?.text)!==r.approvedAnswerContentHash||q.choiceExplanations[q.answer[0]]!==q.explanation)errors.push('Answer content does not match editorial decision: '+r.id);
    if(JSON.stringify(q.answer)!==JSON.stringify(r.before.answer)||q.domainId!==r.before.domainId||q.objectiveId!==r.before.objectiveId||q.difficulty!==r.before.difficulty||q.choices.map(c=>c.id).join()!==r.before.choices.map(c=>c.id).join())errors.push('Changed identity or classification: '+r.id);
    if(q.difficulty==='intermediate'&&(!r.review.counterfactual?.trim()||r.review.reasoningSteps.length<2||r.review.decisiveClues.some(c=>!q.question.includes(c))))errors.push('Missing application evidence: '+r.id);
  }
  return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
  const errors=validateAppliedRemediation(read('content/gh300/2026-08-07/questions/seed.json'),read('reports/applied-remediation-review.json'),new Set(read('content/gh300/2026-08-07/questions/selection-exclusions.json').questions.map(q=>q.id)));
  if(errors.length)throw Error(errors.join('\n'));
  const report=read('reports/applied-remediation-review.json');
  console.log(JSON.stringify({status:'PASS',applied:report.scope.activeApplied,additionalFoundation:report.scope.additionalFoundation,semantics:'editorial evidence; not learner-measured'}));
}
