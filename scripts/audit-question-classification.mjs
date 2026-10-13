import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const hash=q=>createHash('sha256').update(JSON.stringify(q)).digest('hex');

// Checks that an editorial mapping still describes the current bank. It does
// not infer the semantic objective from keywords or automatically approve it.
export function validateQuestionClassification(bank, syllabus, report) {
  const errors=[], rows=new Map(report.questions.map(r=>[r.id,r]));
  if(rows.size!==report.questions.length||rows.size!==bank.length)errors.push('Incomplete or duplicate classification inventory');
  for(const q of bank){
    const row=rows.get(q.id);
    if(!syllabus.domains.some(d=>d.id===q.domainId&&d.objectives.some(o=>o.id===q.objectiveId)))errors.push('Invalid objective/domain: '+q.id);
    if(!row||row.fingerprint!==hash(q)||row.after.domainId!==q.domainId||row.after.objectiveId!==q.objectiveId)errors.push('Stale classification: '+q.id);
    if(!row?.rationale?.trim()||!row?.guideCriterion?.trim())errors.push('Missing classification evidence: '+q.id);
  }
  for(const c of report.coverage??[])for(const level of ['beginner','intermediate','advanced']){
    if(c[level]!==bank.filter(q=>q.objectiveId===c.id&&q.difficulty===level&&q.status==='verified').length)errors.push('Stale coverage: '+c.id+'/'+level);
  }
  return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
 const report=read('reports/question-objective-classification-review.json');
 const errors=validateQuestionClassification(read('content/gh300/2026-08-07/questions/seed.json'),read('content/gh300/2026-08-07/syllabus.json'),report);
 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify({status:'PASS',...report.summary,unfilledDifficultyLayers:report.coverage.filter(r=>!r.beginner||!r.intermediate||!r.advanced)}));
}
