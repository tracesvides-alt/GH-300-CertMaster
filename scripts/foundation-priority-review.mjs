import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {rewindMultiSelect} from './multi-select-review.mjs';
export const foundationFingerprint=q=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
export function loadFoundationPriority(root=new URL('../',import.meta.url)){
 const path=new URL('content/gh300/2026-08-07/questions/foundation-priority-review.json',root);
 return fs.existsSync(path)?JSON.parse(fs.readFileSync(path,'utf8')):null;
}
export function validateFoundationPriority(bank,exclusions,ledger){
 if(!ledger)return [];
 const rewound=rewindMultiSelect(bank,exclusions);bank=rewound.bank;exclusions=rewound.exclusions;
 const errors=[...rewound.errors],byId=new Map(bank.map(q=>[q.id,q])),retired=new Map(exclusions.questions.map(q=>[q.id,q]));
 const ids=new Set(ledger.questions.map(q=>q.id)),oldIds=new Set(ledger.questions.map(q=>q.oldId));
 if(ledger.status!=='EDITORIALLY_REVIEWED'||ledger.questions.length!==10||ids.size!==10||oldIds.size!==10)errors.push('Invalid Foundation replacement scope');
 if(bank.length!==ledger.baseline.stored+ids.size||bank.filter(q=>!retired.has(q.id)).length!==ledger.baseline.nonRetired)errors.push('Changed replacement inventory');
 for(const [id,expected] of Object.entries(ledger.baseline.questionFingerprints))if(!byId.has(id)||foundationFingerprint(byId.get(id))!==expected)errors.push('Changed historical question: '+id);
 for(const row of ledger.questions){
  const q=byId.get(row.id),old=byId.get(row.oldId),retirement=retired.get(row.oldId),v=row.review;
  if(!q||foundationFingerprint(q)!==row.fingerprint||foundationFingerprint(row.after)!==row.fingerprint)errors.push('Stale Foundation question: '+row.id);
  if(!old||foundationFingerprint(old)!==row.oldFingerprint||retired.has(row.id)||!retirement||!retirement.replacementIds.includes(row.id))errors.push('Invalid Foundation history: '+row.id);
  if(q?.difficulty!=='beginner'||q?.domainId!=='d2'||q?.status!=='verified'||q?.examLike!==false||q?.cognitiveLevel!=='understand')errors.push('Invalid Foundation classification: '+row.id);
  if(row.initial.status!=='needs-review'||row.initial.lastVerifiedAt!==null||row.initial.id!==row.id)errors.push('Missing draft provenance: '+row.id);
  if(v?.status!=='EDITORIAL_SECOND_READ'||!v.blindRationale||!v.difficultyEvidence||!v.uniqueness||!v.sourceEvidence?.length||!v.counterfactual?.condition||!v.counterfactual.reason||q?.answer.includes(v.counterfactual.answerId)||!q?.choices.some(c=>c.id===v.counterfactual.answerId))errors.push('Missing Foundation editorial evidence: '+row.id);
  if(!v?.clues?.length||v.clues.some(c=>!q?.question.includes(c)))errors.push('Missing Foundation clues: '+row.id);
  if(!row.retainedIds?.length||row.retainedIds.some(id=>!byId.has(id)||retired.has(id)||byId.get(id).difficulty!=='beginner'))errors.push('Lost original concept: '+row.id);
 }
 const current=bank.filter(q=>!retired.has(q.id)),eligible=current.filter(q=>q.status==='verified');
 for(const d of ['d1','d2','d3','d4','d5','d6'])if(current.filter(q=>q.domainId===d).length!==ledger.baseline.byDomain[d])errors.push('Changed active domain count: '+d);
 for(const level of ['beginner','intermediate','advanced'])if(current.filter(q=>q.difficulty===level).length!==ledger.baseline.byLevel[level])errors.push('Changed active level count: '+level);
 if(eligible.length!==ledger.baseline.eligible||eligible.filter(q=>q.difficulty==='beginner').length!==ledger.baseline.eligibleFoundation)errors.push('Changed eligible inventory');
 return errors;
}
