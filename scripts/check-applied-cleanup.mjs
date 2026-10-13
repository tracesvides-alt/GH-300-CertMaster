import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {loadQuestionAdditions} from './question-additions.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const bank=read('content/gh300/2026-08-07/questions/seed.json');
const exclusions=read('content/gh300/2026-08-07/questions/selection-exclusions.json');
const report=read('reports/d4-d5-applied-cleanup-review.json');
const hash=q=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
const retired=new Set(exclusions.questions.map(q=>q.id));
const active=bank.filter(q=>!retired.has(q.id));
const addedIds=new Set(loadQuestionAdditions()?.questions.map(q=>q.id)??[]);
const cleanupSnapshot=active.filter(q=>!addedIds.has(q.id));
const errors=[];
if(retired.size!==exclusions.questions.length)errors.push('Duplicate excluded ID');
for(const e of exclusions.questions){
 const q=bank.find(q=>q.id===e.id);
 if(!q||hash(q)!==e.fingerprint||q.difficulty!=='intermediate')errors.push('Stale excluded asset '+e.id);
 if(!e.reason||!e.replacementIds.length||e.replacementIds.some(id=>!active.some(q=>q.id===id&&q.difficulty==='intermediate')))errors.push('Missing active replacement '+e.id);
}
const targets=bank.filter(q=>q.difficulty==='intermediate'&&['d4','d5'].includes(q.domainId));
if(report.questions.length!==targets.length||new Set(report.questions.map(q=>q.id)).size!==targets.length)errors.push('Incomplete cleanup review');
for(const row of report.questions){
 const q=bank.find(q=>q.id===row.id);
 if(!q||hash(q)!==row.fingerprint||hash(row.after)!==row.fingerprint)errors.push('Stale cleanup review '+row.id);
 if(JSON.stringify(row.before.answer)!==JSON.stringify(q?.answer))errors.push('Answer identity changed '+row.id);
 if((row.decision==='RETIRED')!==retired.has(row.id))errors.push('Selection state mismatch '+row.id);
 if(row.decision!=='RETIRED'&&(row.blindReview.verdict!=='PASS_EDITORIAL'||row.difficultyReview.verdict!=='APPLIED'))errors.push('Unresolved editorial review '+row.id);
 if(row.decision==='REWRITTEN'&&(row.reasoningSteps.length<2||row.counterfactuals.length<2||row.counterfactuals.some(c=>!q.choices.some(v=>v.id===c.choiceId&&!q.answer.includes(v.id)))))errors.push('Missing application comparison '+row.id);
 if(row.wrongChoiceAnalysis.some(c=>q?.choiceExplanations[c.id]!==c.whyWrong))errors.push('Stale distractor analysis '+row.id);
}
if(cleanupSnapshot.length!==report.summary.after.total||cleanupSnapshot.filter(q=>q.difficulty==='intermediate').length!==report.summary.after.applied)errors.push('Stale cleanup snapshot counts');
if(errors.length)throw Error(errors.join('\n'));
console.log(JSON.stringify({status:'PASS',reviewed:targets.length,stored:bank.length,active:active.length,retired:retired.size,semantics:'editorial; not learner-measured'}));
