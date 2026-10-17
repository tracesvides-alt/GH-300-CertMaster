import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadFoundationPriority,validateFoundationPriority} from './foundation-priority-review.mjs';
import {rewindMultiSelect} from './multi-select-review.mjs';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');

// Evidence integrity only. This does not independently measure question quality.
export function validateFeatureRefresh(bank, ledger, exclusions, plan) {
 const rewound=rewindMultiSelect(bank,exclusions);bank=rewound.bank;exclusions=rewound.exclusions;
 // This ledger describes the earlier refresh. Replay its exact inventory only
 // after validating the later Foundation replacement's history and evidence.
 const foundation=loadFoundationPriority();
 let foundationErrors=[];
 if(foundation&&foundation.questions.some(r=>bank.some(q=>q.id===r.id))){
  foundationErrors=validateFoundationPriority(bank,exclusions,foundation);
  const newIds=new Set(foundation.questions.map(r=>r.id)),oldIds=new Set(foundation.questions.map(r=>r.oldId));
  bank=bank.filter(q=>!newIds.has(q.id));
  exclusions={...exclusions,questions:exclusions.questions.filter(r=>!oldIds.has(r.id))};
 }
 const errors=[...rewound.errors,...foundationErrors],byId=new Map(bank.map(q=>[q.id,q])),retired=new Set(exclusions.questions.map(r=>r.id));
 const candidates=new Set(plan.blueprints.map(r=>r.id));
 if(ledger.decisions.length!==121||new Set(ledger.decisions.map(r=>r.oldId)).size!==121||ledger.decisions.some(r=>!candidates.has(r.oldId)))errors.push('Incomplete candidate decisions');
 if(ledger.questions.length!==73||ledger.decisions.filter(r=>r.decision==='REPLACED').length!==72||ledger.decisions.filter(r=>r.decision==='CONSOLIDATED').length!==49)errors.push('Unexpected disposition counts');
 if(new Set(bank.map(q=>q.id)).size!==bank.length)errors.push('Duplicate question ID');
 for(const row of ledger.questions){
  const q=byId.get(row.id),v=row.review;
  if(!q||hash(q)!==row.fingerprint||hash(row.after)!==row.fingerprint)errors.push('Stale reviewed asset: '+row.id);
  if(row.id===row.oldId||!retired.has(row.oldId)||retired.has(row.id)||hash(byId.get(row.oldId))!==row.oldFingerprint)errors.push('Invalid history boundary: '+row.id);
  if(v?.status!=='EDITORIAL_SECOND_READ'||!v.blindRationale||!Array.isArray(v.reasoningSteps)||v.reasoningSteps.length<(q?.difficulty==='advanced'?3:2)||!v.distinction||!v.sourceEvidence?.length)errors.push('Missing editorial evidence: '+row.id);
  if(!v.clues?.length||v.clues.some(c=>!q?.question.includes(c)))errors.push('Missing literal clues: '+row.id);
  const cf=v.counterfactual;
  if(!cf?.from||!cf.to||!cf.rationale||q?.question.split(cf.from).length!==2||q?.question.replace(cf.from,cf.to)!==cf.question||q?.answer.includes(cf.answerId)||!q?.choices.some(c=>c.id===cf.answerId))errors.push('Invalid counterfactual: '+row.id);
 }
 for(const d of [...ledger.decisions,...ledger.keptConsolidations])if(!retired.has(d.oldId)||!byId.has(d.destinationId)||retired.has(d.destinationId))errors.push('Invalid active destination: '+d.oldId);
 for(const r of exclusions.questions)if(hash(byId.get(r.id))!==r.fingerprint)errors.push('Changed archived asset: '+r.id);
 if(bank.filter(q=>!retired.has(q.id)).length!==ledger.inventoryAfter.active||bank.length!==ledger.inventoryAfter.stored)errors.push('Stale inventory');
 return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
 const errors=validateFeatureRefresh(read('content/gh300/2026-08-07/questions/seed.json'),read('reports/copilot-feature-refresh-2026-10-16.json'),read('content/gh300/2026-08-07/questions/selection-exclusions.json'),read('reports/copilot-feature-replacement-plan-2026-10-15.json'));
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: 121 dispositions, 73 versioned questions, archived assets and review evidence intact; editorial, not empirical.');
}
