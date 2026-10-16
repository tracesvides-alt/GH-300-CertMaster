import fs from 'node:fs';
import {foundationPriorityItems} from './foundation-priority-content-2026-10-17.mjs';
import {foundationFingerprint as hash,validateFoundationPriority} from './foundation-priority-review.mjs';
const dir='content/gh300/2026-08-07/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
if(!process.argv.includes('--apply-reviewed-content'))throw Error('Explicit reviewed-content application required');
const bank=read(dir+'questions/seed.json'),exclusions=read(dir+'questions/selection-exclusions.json');
if(hash(bank)!=='a6837e39b66af2327736cfe8ad49f5452e9ebbbf76ebe71b20fc5b6ac1099261')throw Error('The reviewed baseline changed; review the new assets before applying.');
const byId=new Map(bank.map(q=>[q.id,q])),terms=read(dir+'glossary/terms.json');
const retired=new Set(exclusions.questions.map(q=>q.id)),oldIds=new Set(foundationPriorityItems.map(q=>q.oldId));
const active=bank.filter(q=>!retired.has(q.id));
const sources=read(dir+'sources.json');
const definitions=[
 ['foundation-cloud-task','Kick off a task with Copilot agents on GitHub','https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task'],
 ['foundation-vscode-plan','Plan work with agents in VS Code','https://code.visualstudio.com/docs/agents/run/planning'],
 ['foundation-vscode-setup','Set up GitHub Copilot in VS Code','https://code.visualstudio.com/docs/setup/copilot'],
 ['foundation-mobile-chat','Asking GitHub Copilot questions in GitHub Mobile','https://docs.github.com/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile'],
 ['foundation-vscode-cli','Visual Studio Code command line interface','https://code.visualstudio.com/docs/configure/command-line'],
 ['foundation-model-comparison','AI model comparison','https://docs.github.com/en/copilot/reference/ai-models/model-comparison'],
];
for(const [id,title,url] of definitions){
 if(sources.some(s=>s.id===id))throw Error('Source already exists: '+id);
 sources.push({id,title,url,publisher:url.includes('visualstudio.com')?'VS Code Docs':'GitHub Docs',sourceType:'documentation',syllabusVersion:'2026-08-07',relatedDomainIds:['d2'],relatedObjectiveIds:[],relatedLessonIds:[],relatedGlossaryIds:[],relatedComparisonIds:[],relatedQuestionIds:[],lastCheckedAt:'2026-10-17',lastVerifiedAt:'2026-10-17',status:'verified'});
}
const rows=foundationPriorityItems.map(item=>{
 const old=byId.get(item.oldId);
 if(!old||old.difficulty!=='beginner'||retired.has(old.id)||terms.some(t=>t.basicQuestionId===old.id)||old.scenarioSetId)throw Error('Unsafe replacement: '+item.oldId);
 if(item.retainedIds.some(id=>oldIds.has(id)||!byId.has(id)||retired.has(id)))throw Error('Invalid retained concept: '+item.id);
 const position=old.choices.findIndex(c=>old.answer.includes(c.id));
 const options=item.choices.map((text,i)=>({id:'ABCD'[i],text}));
 const choices=[...options.slice(1,position+1),options[0],...options.slice(position+1)];
 const explanation=item.reasons[0];
 const choiceExplanations=Object.fromEntries(item.reasons.map((r,i)=>['ABCD'[i],r]));
 const q={id:item.id,syllabusVersion:'2026-08-07',domainId:'d2',objectiveId:item.objectiveId,difficulty:'beginner',type:'single-select',status:'verified',question:item.question,choices,answer:['A'],explanation,choiceExplanations,sourceIds:item.sourceIds,trustedSourceFacts:[explanation],createdAt:'2026-10-17',lastVerifiedAt:'2026-10-17',cognitiveLevel:'understand',examLike:false,distractorQuality:'scenario-contrast',
  choiceQuality:Object.fromEntries(options.map((c,i)=>[c.id,{plausibility:i===0?3:2,distractorType:i===0?'correct':i===1?'common-confusion':'wrong-use-case',sourceIds:item.sourceIds,rationale:item.reasons[i]}])),
  requirementMapping:[{requirement:item.clue,correctReason:explanation,distractorFailures:Object.fromEntries(options.slice(1).map(c=>[c.id,choiceExplanations[c.id]]))}],
  contentRevision:'foundation-priority-2026-10-17',clues:[item.clue],testedConcepts:[item.objectiveId,item.topic],scenarioType:'feature-identification'};
 const initial={...structuredClone(q),status:'needs-review',lastVerifiedAt:null};
 for(const id of item.sourceIds){
  const source=sources.find(s=>s.id===id);if(!source)throw Error('Unknown source '+id);
  source.relatedQuestionIds=[...new Set([...(source.relatedQuestionIds??[]),q.id])];
  source.relatedObjectiveIds=[...new Set([...(source.relatedObjectiveIds??[]),q.objectiveId])];
  source.relatedDomainIds=[...new Set([...(source.relatedDomainIds??[]),'d2'])];
  if(definitions.some(d=>d[0]===id)||['cli','copilot-seat-api','cli-install','cli-usage','cli-tool-permissions','feature-matrix','feature-refresh-inline','feature-refresh-cli-reference'].includes(id)){
   source.lastCheckedAt='2026-10-17';source.lastVerifiedAt='2026-10-17';
  }
 }
 const lengths=q.choices.filter(c=>c.id!=='A').map(c=>c.text.length).sort((a,b)=>a-b),correct=q.choices.find(c=>c.id==='A').text.length;
 return {id:q.id,oldId:old.id,oldFingerprint:hash(old),title:item.title,retainedIds:item.retainedIds,retirementReason:item.retirementReason,initial,after:q,fingerprint:hash(q),review:{status:'EDITORIAL_SECOND_READ',blindRationale:item.blind,difficultyEvidence:item.difficulty,uniqueness:item.reasons.slice(1).join(' '),reasoningSteps:[item.difficulty],clues:[item.clue],counterfactual:item.counterfactual,lengths:{correct,medianWrong:lengths[1],ratio:+(correct/lengths[1]).toFixed(3),position:'ABCD'[position]},sourceEvidence:item.sourceIds.map(id=>({sourceId:id,url:sources.find(s=>s.id===id).url,checkedAt:'2026-10-17'}))}};
});
const baseline={stored:bank.length,nonRetired:active.length,eligible:active.filter(q=>q.status==='verified').length,eligibleFoundation:active.filter(q=>q.difficulty==='beginner'&&q.status==='verified').length,
 byDomain:Object.fromEntries(['d1','d2','d3','d4','d5','d6'].map(d=>[d,active.filter(q=>q.domainId===d).length])),
 byLevel:Object.fromEntries(['beginner','intermediate','advanced'].map(d=>[d,active.filter(q=>q.difficulty===d).length])),
 questionFingerprints:Object.fromEntries(bank.map(q=>[q.id,hash(q)])),bankFingerprint:hash(bank)};
const ledger={reviewedAt:'2026-10-17',status:'EDITORIALLY_REVIEWED',method:'公式情報を照合して新規作成し、選択肢単体・唯一正答・基礎難度・条件変更を再読した編集判断。独立した被験者のブラインド検証・正答率校正ではない。',origin:'Original authored questions covering the priority concepts from the 2026-10-16 comparison report; no external question text reused.',baseline,questions:rows};
const nextBank=[...bank,...rows.map(r=>r.after)];
for(const row of rows)exclusions.questions.push({id:row.oldId,replacementIds:[row.id],reason:row.retirementReason,retiredAt:'2026-10-17',fingerprint:row.oldFingerprint});
exclusions.reviewedAt='2026-10-17';
exclusions.purpose='レビュー済みの問題置換・重複整理に伴う新規演習からの除外。旧問題資産と保存済み履歴は保持する。';
const errors=validateFoundationPriority(nextBank,exclusions,ledger);if(errors.length)throw Error(errors.join('\n'));
const quality=read(dir+'questions/quality-review.json'),difficulty=read(dir+'questions/difficulty-review.json'),classification=read('reports/question-objective-classification-review.json');
for(const row of rows){
 const q=row.after,v=row.review;
 quality.questions[q.id]={fingerprint:row.fingerprint,multipleAnswerRisk:false,answerWithoutReading:false,difficultyConsistent:true,requirementCoverage:true,rationale:v.blindRationale+' '+v.uniqueness};
 difficulty.questions[q.id]={fingerprint:row.fingerprint,beforeDifficulty:'beginner',difficulty:'beginner',textRewritten:false,reclassified:false,assessment:v.difficultyEvidence,reasoningSteps:v.reasoningSteps,counterfactual:null,evidence:q.sourceIds};
 classification.questions.push({id:q.id,changed:false,before:{domainId:q.domainId,objectiveId:q.objectiveId},after:q,difficulty:q.difficulty,status:q.status,question:q.question,correctChoices:q.choices.filter(c=>q.answer.includes(c.id)),rationale:v.difficultyEvidence,guideCriterion:classification.guideCriteria[q.objectiveId],fingerprint:row.fingerprint,latestReview:'content/gh300/2026-08-07/questions/foundation-priority-review.json'});
}
const followUp={reviewedAt:'2026-10-17',questionIds:rows.map(r=>r.id),report:'reports/foundation-priority-2026-10-17.json'};
for(const r of [quality,difficulty,classification]){r.lastUpdated='2026-10-17';r.followUpReviews=[...(r.followUpReviews??[]),followUp];}
for(const row of classification.coverage)for(const level of ['beginner','intermediate','advanced'])row[level]=nextBank.filter(q=>q.objectiveId===row.id&&q.difficulty===level&&q.status==='verified').length;
classification.priorFoundationReplacementSummary=classification.summary;
classification.summary={...classification.summary,reviewed:nextBank.length,activeReviewed:baseline.nonRetired,archived:exclusions.questions.length,afterDomains:Object.fromEntries(['d1','d2','d3','d4','d5','d6'].map(d=>[d,nextBank.filter(q=>q.domainId===d).length])),activeDomains:baseline.byDomain,foundationReplacementCount:rows.length};
classification.selectionSummary={stored:nextBank.length,active:baseline.nonRetired,eligible:baseline.eligible,retired:exclusions.questions.length,domains:baseline.byDomain};
// Link the new concepts to their existing relevant lessons; old question links
// remain valid historical references and are not repurposed as different topics.
const lessons=read(dir+'lessons/seed.json');
for(const row of rows){
 const lessonId=row.after.objectiveId==='d2o2'?'lesson-d2-cli':row.after.objectiveId==='d2o4'?'lesson-d2-org-governance':row.id.includes('mobile')?'lesson-d2-chat-essentials':row.after.objectiveId==='d2o1'?'lesson-d2-inline-suggestions':'lesson-d2-agent-edits';
 const lesson=lessons.find(l=>l.id===lessonId);
 if(!lesson)throw Error('Missing related lesson: '+lessonId);
 lesson.questionIds=[...new Set([...(lesson.questionIds??[]),row.id])];
 for(const id of row.after.sourceIds){
  const source=sources.find(s=>s.id===id);
  source.relatedLessonIds=[...new Set([...(source.relatedLessonIds??[]),lessonId])];
 }
}
write(dir+'questions/seed.json',nextBank);write(dir+'questions/selection-exclusions.json',exclusions);write(dir+'questions/foundation-priority-review.json',ledger);
write(dir+'questions/quality-review.json',quality);write(dir+'questions/difficulty-review.json',difficulty);write('reports/question-objective-classification-review.json',classification);write(dir+'sources.json',sources);write(dir+'lessons/seed.json',lessons);
write('reports/foundation-priority-2026-10-17.json',ledger);
console.log('Applied 10 original Foundation replacements; active domain/level counts and all previous question texts preserved.');
