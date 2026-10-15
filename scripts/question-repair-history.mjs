import fs from 'node:fs';
import {createHash} from 'node:crypto';
const hash=q=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
const file=new URL('../reports/copilot-feature-quality-repairs-2026-10-16.json',import.meta.url);
// Earlier reviews remain historical evidence, rather than receiving a fabricated
// new semantic sign-off. A later, separately reviewed revision binds both texts.
export function reviewedQuestionSnapshot(current,expectedFingerprint,ledger){
 if(!current||hash(current)===expectedFingerprint)return current;
 const revisions=ledger??(fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null);
 const row=revisions?.questions.find(r=>r.id===current.id);
 if(row&&hash(current)===row.fingerprint&&hash(row.after)===row.fingerprint&&hash(row.before)===expectedFingerprint)return row.before;
 return current;
}
export function validateQuestionRepairs(bank,ledger){
 const errors=[];
 if(ledger.questions.length!==91||new Set(ledger.questions.map(r=>r.id)).size!==91)errors.push('Incomplete repair scope');
 for(const row of ledger.questions){
  const q=bank.find(q=>q.id===row.id),v=row.review;
  if(!q||hash(q)!==row.fingerprint||hash(row.after)!==row.fingerprint)errors.push('Stale repair: '+row.id);
  if(!q)continue;
  for(const key of ['id','difficulty','domainId','objectiveId','answer'])if(JSON.stringify(q[key])!==JSON.stringify(row.before[key]))errors.push('Changed identity: '+row.id+'/'+key);
  if(q.choices.map(c=>c.id).join()!==row.before.choices.map(c=>c.id).join())errors.push('Changed display order: '+row.id);
  const cf=v.counterfactual;
  if(v.clues.some(c=>!q.question.includes(c))||v.reasoningSteps.length<(q.difficulty==='advanced'?3:2))errors.push('Missing repair evidence: '+row.id);
  if(q.question.split(cf.from).length!==2||q.question.replace(cf.from,cf.to)!==cf.question||q.answer.includes(cf.answerId)||!q.choices.some(c=>c.id===cf.answerId))errors.push('Invalid repair replay: '+row.id);
 }
 return errors;
}
