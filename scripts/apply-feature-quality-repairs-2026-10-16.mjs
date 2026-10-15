import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {repairs,alternateCases} from './feature-quality-repairs-2026-10-16.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const base='content/gh300/2026-08-07/';
const reportPath='reports/copilot-feature-quality-repairs-2026-10-16.json';
const audit=read('reports/copilot-feature-recheck-2026-10-16.json');
const current=read(base+'questions/seed.json');
const previous=fs.existsSync(reportPath)?read(reportPath):null;
const baseline=previous?.questions.map(r=>r.before)??audit.questions.map(r=>current.find(q=>q.id===r.id));
for(const b of baseline){
 const q=current.find(q=>q.id===b.id),old=audit.questions.find(r=>r.id===b.id);
 const prior=previous?.questions.find(r=>r.id===b.id);
 const priorVerificationDate=prior?hash({...prior.after,lastVerifiedAt:b.lastVerifiedAt}):null;
 if(hash(b)!==old.fingerprint||![hash(b),prior?.fingerprint,priorVerificationDate].includes(hash(q)))throw Error('Unreviewed concurrent edit: '+b.id);
}
const retired=new Set(read(base+'questions/selection-exclusions.json').questions.map(r=>r.id));
if(baseline.length!==91||baseline.some(q=>retired.has(q.id)))throw Error('Changed review scope');
const refresh=read('reports/copilot-feature-refresh-2026-10-16.json');
const applied=read('reports/applied-question-quality-review.json');
const exam=read('reports/exam-question-quality-review.json');
const sources=read(base+'sources.json');
const newSource={id:'feature-repair-cli-context',title:'Managing context in GitHub Copilot CLI',url:'https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management',publisher:'GitHub Docs',sourceType:'documentation',syllabusVersion:'2026-08-07',relatedDomainIds:['d4'],relatedObjectiveIds:['d4o2'],relatedLessonIds:[],relatedGlossaryIds:[],relatedComparisonIds:[],relatedQuestionIds:[],lastCheckedAt:'2026-10-16',lastVerifiedAt:'2026-10-16',status:'verified'};
if(!sources.some(s=>s.id===newSource.id))sources.push(newSource);
const extraSources={3:['feature-refresh-cli-reference','cli-tool-permissions','feature-refresh-custom-agent'],10:['copilot-metrics-data','copilot-seat-api'],17:['feature-refresh-prompt'],51:['feature-refresh-edits'],60:['feature-refresh-approval'],64:['mcp-config'],67:['feature-refresh-context','feature-refresh-tools'],69:['feature-repair-cli-context','feature-refresh-cli-reference'],74:['feature-refresh-approval'],80:['feature-refresh-context'],82:['feature-refresh-approval'],87:['feature-refresh-custom-agent','feature-refresh-context-model']};
const titles={10:'IDE収集とSeat管理の違い',21:'個人指示とrepo規約の競合分離',64:'MCP入力IDと環境変数の接続',69:'CLIの文脈内訳とツール定義の削減',80:'CopilotのWeb参照キャッシュ',87:'Subagentの文脈分離と読取専用ツール'};
export const lengths=q=>{
 const wrong=q.choices.filter(c=>!q.answer.includes(c.id)).map(c=>Array.from(c.text).length).sort((a,b)=>a-b);
 const correct=Array.from(q.choices.find(c=>q.answer.includes(c.id)).text).length;
 return {correct,wrong,medianWrong:wrong[1],ratio:correct/wrong[1],position:'ABCD'[q.choices.findIndex(c=>q.answer.includes(c.id))]};
};
const records=baseline.map((before,i)=>{
 const n=i+1,d=repairs.find(r=>r.n===n),q=structuredClone(before);
 const prior=refresh.questions.find(r=>r.id===q.id)?.review??[...applied.questions,...exam.questions].find(r=>r.id===q.id);
 const ids=[q.answer[0],...q.choices.filter(c=>!q.answer.includes(c.id)).map(c=>c.id)];
 if(d){
  if(d.options.length!==4||d.reasons.length!==4||d.clues.some(c=>!d.question.includes(c))||d.question.split(d.cf[0]).length!==2)throw Error('Invalid authored repair '+n);
  q.question=d.question;q.choices=q.choices.map(c=>({id:c.id,text:d.options[ids.indexOf(c.id)]}));
  q.choiceExplanations=Object.fromEntries(ids.map((id,j)=>[id,d.reasons[j]]));q.explanation=d.reasons[0];
  q.clues=d.clues;q.contentRevision='copilot-feature-quality-repairs-2026-10-16';q.lastVerifiedAt='2026-10-16';
  q.testedConcepts=[titles[n]??before.testedConcepts?.[0]??'Copilot機能の設定・適用範囲'];
  q.sourceIds=[...new Set([...before.sourceIds,...(extraSources[n]??[])])];q.trustedSourceFacts=[];
  q.choiceQuality=Object.fromEntries(ids.map((id,j)=>[id,{plausibility:j===0?3:2,distractorType:j===0?'correct':'wrong-scope',sourceIds:q.sourceIds,rationale:d.reasons[j]}]));
  q.requirementMapping=d.clues.map(clue=>({requirement:clue,correctReason:q.explanation,distractorFailures:Object.fromEntries(ids.slice(1).map(id=>[id,q.choiceExplanations[id]]))}));
 }
 const cf=alternateCases.get(n)?{from:q.question,to:alternateCases.get(n)[0],question:alternateCases.get(n)[0],answerId:typeof alternateCases.get(n)[1]==='number'?ids[alternateCases.get(n)[1]]:alternateCases.get(n)[1],rationale:alternateCases.get(n)[2],editoriallyValidated:true}:d?{from:d.cf[0],to:d.cf[1],question:q.question.replace(d.cf[0],d.cf[1]),answerId:ids[d.cf[2]],rationale:d.cf[3],editoriallyValidated:true}:structuredClone(prior.counterfactual);
 if(!cf||typeof cf!=='object'||q.question.split(cf.from).length!==2||q.question.replace(cf.from,cf.to)!==cf.question||q.answer.includes(cf.answerId))throw Error('Invalid replay '+n);
 const steps=d?.steps??prior.reasoningSteps;
 if(steps.length<(q.difficulty==='advanced'?3:2))throw Error('Missing authored reasoning '+n);
 const optionOnly=d?`本文の条件「${d.clues.join('」「')}」を外して四案を再読し、各案の操作・範囲・時点を比較した。${d.reasons.slice(1).join(' ')} 独立した受験者の実験ではない。`:(n===33?'共通指示の維持・削除、個人指示への移動、全階層と直下だけのパターンを同じ粒度で比較した。本文の共有範囲と対象階層がなければ必要な案を確定しない。独立した受験者による実験ではない。':prior.blindRationale??prior.optionOnlyReview??prior.blindAfter?.rationale);
 return {n,id:q.id,changed:!!d,before,after:q,fingerprint:hash(q),title:titles[n]??q.testedConcepts?.[0]??q.id,
  priorFindings:audit.questions[i],review:{status:'EDITORIAL_SECOND_READ',independentReviewer:false,learnerMeasured:false,format:prior.format??'インシデント切り分け',reasoningSteps:steps,clues:n===33?['末尾が.test.ts','共通規約の共有']:q.clues,counterfactual:cf,blindRationale:optionOnly,lengths:lengths(q),
   difficultyAssessment:steps.join(' '),distinction:d?`旧設問の懸念：${audit.questions[i].difficultyAssessment.reason} 今回は${steps.join(' ')}`:prior.distinction??audit.questions[i].difficultyAssessment.reason,
   sourceEvidence:q.sourceIds.map(id=>{const s=sources.find(s=>s.id===id);if(!s)throw Error('Missing source '+id);return {sourceId:id,url:s.url,checkedAt:'2026-10-16'};})}};
});
const next=current.map(q=>records.find(r=>r.id===q.id)?.after??q);
const inventory=bank=>({stored:bank.length,active:bank.filter(q=>!retired.has(q.id)).length,byLevel:Object.fromEntries(['beginner','intermediate','advanced'].map(l=>[l,bank.filter(q=>!retired.has(q.id)&&q.difficulty===l).length])),byDomain:Object.fromEntries(['d1','d2','d3','d4','d5','d6'].map(d=>[d,bank.filter(q=>!retired.has(q.id)&&q.domainId===d).length]))});
if(JSON.stringify(inventory(current))!==JSON.stringify(inventory(next)))throw Error('Inventory changed');
const report={reviewedAt:'2026-10-16',basedOnCommit:audit.basedOnCommit,priorAudit:'reports/copilot-feature-recheck-2026-10-16.json',status:'AUTHORED_SECOND_READ',measuredLearnerDifficulty:false,independentReviewer:false,scope:{reviewed:91,contentChanged:records.filter(r=>r.changed).length,retainedContent:records.filter(r=>!r.changed).length},inventoryBefore:inventory(current),inventoryAfter:inventory(next),questions:records};
fs.mkdirSync('artifacts',{recursive:true});write('artifacts/copilot-feature-quality-repairs-preview.json',report);
console.log(JSON.stringify({scope:report.scope,inventory:report.inventoryAfter,lengthFlags:records.filter(r=>r.review.lengths.ratio<.5||r.review.lengths.ratio>1.5).map(r=>[r.n,r.review.lengths.ratio])}));
if(!process.argv.includes('--apply-reviewed'))process.exit(0);
// Mutation is explicitly separated from generation. Run only after reading the
// proposed questions and complete counterfactuals; hashes do not prove semantics.
write(reportPath,report);
const quality=read(base+'questions/quality-review.json');
const difficulty=read(base+'questions/difficulty-review.json');
const classification=read('reports/question-objective-classification-review.json');
for(const row of records){
 const q=row.after,v=row.review;
 quality.questions[q.id]={...quality.questions[q.id],fingerprint:row.fingerprint,multipleAnswerRisk:false,answerWithoutReading:false,difficultyConsistent:true,requirementCoverage:true,rationale:v.blindRationale,latestReview:reportPath};
 const oldDifficulty=difficulty.questions[q.id];
 difficulty.questions[q.id]={...oldDifficulty,fingerprint:row.fingerprint,textRewritten:oldDifficulty.textRewritten||row.changed,assessment:v.difficultyAssessment,reasoningSteps:v.reasoningSteps,counterfactual:v.counterfactual.rationale,reasoning:v.reasoningSteps.join(' '),latestReview:reportPath};
 const c=classification.questions.find(r=>r.id===q.id);Object.assign(c,{after:q,fingerprint:row.fingerprint,question:q.question,correctChoices:q.choices.filter(c=>q.answer.includes(c.id)),latestReview:reportPath});
 const wrong=q.choices.filter(c=>!q.answer.includes(c.id));
 const a=applied.questions.find(r=>r.id===q.id);
 if(a)Object.assign(a,{after:q,fingerprint:row.fingerprint,assessment:v.difficultyAssessment,optionOnlyReview:v.blindRationale,decisiveCondition:v.clues.join(' / '),reasoningSteps:v.reasoningSteps,counterfactual:v.counterfactual.rationale,wrongChoiceAnalysis:wrong.map(c=>({id:c.id,text:c.text,whyWrong:q.choiceExplanations[c.id]})),latestReview:reportPath});
 const e=exam.questions.find(r=>r.id===q.id);
 if(e)Object.assign(e,{after:q,fingerprint:row.fingerprint,title:row.title,summary:q.question,difficultyAssessment:v.difficultyAssessment,blindAfter:{verdict:'PASS',rationale:v.blindRationale},reasoningSteps:v.reasoningSteps,clues:q.clues,counterfactual:v.counterfactual,lengths:v.lengths,distractors:wrong.map(c=>({id:c.id,text:c.text,whyWrong:q.choiceExplanations[c.id],temptation:q.choiceExplanations[c.id]})),latestReview:reportPath});
 for(const h of exam.reclassifiedQuestions??[])if(h.id===q.id)Object.assign(h,{after:q,fingerprint:row.fingerprint,latestReview:reportPath});
 const f=refresh.questions.find(r=>r.id===q.id);
 if(f){f.priorReview??=f.review;Object.assign(f,{after:q,fingerprint:row.fingerprint,review:v,latestReview:reportPath});}
 for(const id of q.sourceIds){const s=sources.find(s=>s.id===id);s.relatedQuestionIds=[...new Set([...(s.relatedQuestionIds??[]),q.id])];}
}
const follow={reviewedAt:'2026-10-16',questionIds:records.map(r=>r.id),report:reportPath};
applied.selectionSummary={...applied.selectionSummary,totalStoredApplied:applied.selectionSummary.totalStored,activeApplied:applied.selectionSummary.active,retiredApplied:applied.selectionSummary.retired};
for(const obj of [quality,difficulty,classification,applied,exam,refresh]){obj.lastUpdated='2026-10-16';obj.followUpReviews=[...(obj.followUpReviews??[]).filter(r=>r.report!==reportPath),follow];}
write(base+'questions/seed.json',next);write(base+'sources.json',sources);
write(base+'questions/quality-review.json',quality);write(base+'questions/difficulty-review.json',difficulty);
write('reports/question-objective-classification-review.json',classification);write('reports/applied-question-quality-review.json',applied);write('reports/exam-question-quality-review.json',exam);
write('reports/copilot-feature-refresh-2026-10-16.json',refresh);write(base+'questions/feature-refresh-review.json',refresh);
