import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {drafts} from './feature-refresh-drafts.mjs';
import {adoptedIds,consolidated,keptConsolidations,separateFactFixIds} from './feature-refresh-decisions.mjs';
const base='content/gh300/2026-08-07/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const hash=q=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
const snapshot=read('reports/feature-refresh-baseline-2026-10-16.json');
const before=snapshot['questions/seed.json'];
const plan=read('reports/copilot-feature-replacement-plan-2026-10-15.json');
if(hash(before)!==plan.bankFingerprint)throw Error('Unexpected original bank');
const current=read(base+'questions/seed.json');
if(current.some(q=>before.some(b=>b.id===q.id&&hash(b)!==hash(q))))throw Error('Original asset modified');
const targets=new Set(plan.blueprints.map(q=>q.id));
if(targets.size!==121||adoptedIds.length!==72||Object.keys(consolidated).length!==49||new Set([...adoptedIds,...Object.keys(consolidated)]).size!==121||[...targets].some(id=>!adoptedIds.includes(id)&&!consolidated[id]))throw Error('Incomplete decisions');
const accepted=new Set([...adoptedIds,...separateFactFixIds]);
const originalById=new Map(before.map(q=>[q.id,q]));
const idFor=id=>accepted.has(id)?id+'-feature-20261016':id;
const draftById=new Map(drafts.map(q=>[q.oldId,q]));
if(draftById.size!==122)throw Error('Draft inventory mismatch');
for(const d of drafts){
 if(!originalById.has(d.oldId)||!d.question||d.options.length!==4||d.reasons.length!==4||d.reasons.some(x=>!x)||d.clues.some(c=>!d.question.includes(c)))throw Error('Invalid draft '+d.oldId);
 if(d.question.split(d.counterfactual.from).length!==2||d.counterfactual.answerIndex<1||d.counterfactual.answerIndex>3)throw Error('Invalid counterfactual '+d.oldId);
}
const refs=Object.fromEntries(plan.sources.map(s=>[s.id,s]));
Object.assign(refs,{
 'vscode-instructions':{title:'Use custom instructions in VS Code',url:'https://code.visualstudio.com/docs/agent-customization/custom-instructions'},
 'context-model':{title:'Understand context in AI agents',url:'https://code.visualstudio.com/docs/agents/concepts/context'},
 'inline':{title:'Inline suggestions from GitHub Copilot in VS Code',url:'https://code.visualstudio.com/docs/editing/ai-powered-suggestions'},
 'mcp-config':{title:'MCP configuration reference',url:'https://code.visualstudio.com/docs/agents/reference/mcp-configuration'},
 'env-secrets':{title:'Configure secrets and variables for Copilot cloud agent',url:'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/configure-secrets-and-variables'},
});
// Canonical pages checked against the official live documents, not search snippets.
Object.assign(refs,{
 'review-howto':{title:'Using GitHub Copilot code review',url:'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review'},
 instructions:{title:'Adding repository custom instructions for GitHub Copilot',url:'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions'},
 logs:{title:'Viewing logs for GitHub Copilot in your environment',url:'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/view-logs'},
 reference:{title:'Finding public code that matches GitHub Copilot suggestions',url:'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code'},
 firewall:{title:'Customizing or disabling the firewall for GitHub Copilot',url:'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall'},
 autopilot:{title:'Using Autopilot mode in GitHub Copilot CLI',url:'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/use-autopilot-mode'},
 risk:{title:'Risks and mitigations for GitHub Copilot cloud agent',url:'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations'},
 'cli-reference':{title:'GitHub Copilot CLI command reference',url:'https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference'},
 ide:{title:'GitHub Copilot in IDEs',url:'https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides'},
 policies:{title:'Managing policies and features for GitHub Copilot in your enterprise',url:'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies'},
 setup:{title:'Configure the development environment',url:'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment'},
 'cli-compare':{title:'Comparing GitHub Copilot CLI customization features',url:'https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features'},
});
const sourceRegistry=structuredClone(snapshot['sources.json']);
const reviewConcept=sourceRegistry.find(s=>s.id==='code-review');
reviewConcept.url='https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review';
reviewConcept.title='GitHub Copilot code review';
reviewConcept.lastCheckedAt='2026-10-16';reviewConcept.lastVerifiedAt='2026-10-16';
refs.review={title:reviewConcept.title,url:reviewConcept.url};
const sourceId=ref=>{
 const s=refs[ref];if(!s)throw Error('Unknown source '+ref);
 const existing=sourceRegistry.find(x=>x.url===s.url);
 if(existing)return existing.id;
 const id='feature-refresh-'+ref;
 sourceRegistry.push({id,title:s.title,url:s.url,publisher:new URL(s.url).hostname==='code.visualstudio.com'?'VS Code Docs':'GitHub Docs',sourceType:'documentation',syllabusVersion:'2026-08-07',relatedDomainIds:[],relatedObjectiveIds:[],relatedLessonIds:[],relatedGlossaryIds:[],relatedComparisonIds:[],relatedQuestionIds:[],lastCheckedAt:'2026-10-16',lastVerifiedAt:'2026-10-16',status:'verified'});
 return id;
};
const activeOld=before.filter(q=>!snapshot['questions/selection-exclusions.json'].questions.some(r=>r.id===q.id));
const retiredNew=new Set([...targets,...separateFactFixIds,...Object.keys(keptConsolidations)]);
const unchangedActive=activeOld.filter(q=>!retiredNew.has(q.id));
// Balance display positions within actual domain/level groups, without changing answer identity.
const counts={};
const levelCounts={};
for(const q of unchangedActive.filter(q=>q.type==='single-select')){
 const k=q.difficulty+'/'+q.domainId;counts[k]??=[0,0,0,0];counts[k][q.choices.findIndex(c=>q.answer.includes(c.id))]++;
 levelCounts[q.difficulty]??=[0,0,0,0];levelCounts[q.difficulty][q.choices.findIndex(c=>q.answer.includes(c.id))]++;
}
const newQuestions=drafts.filter(d=>accepted.has(d.oldId)).map(d=>{
 const old=originalById.get(d.oldId),domainId=d.objectiveId.slice(0,2);
 const k=old.difficulty+'/'+domainId;counts[k]??=[0,0,0,0];
 levelCounts[old.difficulty]??=[0,0,0,0];
 const lowest=Math.min(...counts[k]);const pos=[0,1,2,3].filter(i=>counts[k][i]===lowest).sort((a,b)=>levelCounts[old.difficulty][a]-levelCounts[old.difficulty][b])[0];counts[k][pos]++;levelCounts[old.difficulty][pos]++;
 const choices=d.options.map((text,i)=>({id:'ABCD'[i],text}));
 choices.splice(0,1);choices.splice(pos,0,{id:'A',text:d.options[0]});
 const sourceIds=[...new Set(d.refs.map(sourceId))];
 const explanation=d.reasons[0];
 return {id:idFor(d.oldId),syllabusVersion:'2026-08-07',domainId,objectiveId:d.objectiveId,difficulty:old.difficulty,type:'single-select',status:'verified',question:d.question,
 choices,answer:['A'],explanation,choiceExplanations:Object.fromEntries(d.reasons.map((r,i)=>['ABCD'[i],r])),sourceIds,trustedSourceFacts:[],createdAt:'2026-10-16',lastVerifiedAt:'2026-10-16',
 cognitiveLevel:old.difficulty==='advanced'?'analyze':'apply',scenarioType:old.difficulty==='advanced'?'feature-scope-diagnosis':'feature-configuration-application',testedConcepts:[d.title],estimatedAnswerSeconds:old.difficulty==='advanced'?100:65,examLike:old.difficulty==='advanced',scenarioSetId:null,clues:d.clues,contentRevision:'copilot-feature-refresh-2026-10-16',distractorQuality:'conditional-feature-controls',
 choiceQuality:Object.fromEntries(d.reasons.map((r,i)=>['ABCD'[i],{plausibility:i===0?3:(old.difficulty==='advanced'&&i<3?3:2),distractorType:i===0?'correct':'wrong-scope',sourceIds,rationale:r}])),
 requirementMapping:d.clues.map(clue=>({requirement:clue,correctReason:explanation,distractorFailures:Object.fromEntries(d.reasons.slice(1).map((r,i)=>['BCD'[i],r]))})),
 };
});
const newByOld=new Map(newQuestions.map(q=>[q.id.replace(/-feature-20261016$/,''),q]));
const dest={...Object.fromEntries([...accepted].map(id=>[id,[idFor(id),'機能判断へ全面改稿し、履歴を新IDで分離。']])),...consolidated,...keptConsolidations};
const resolve=(id,seen=new Set())=>{
 if(accepted.has(id))return idFor(id);
 if(!dest[id])return id;
 if(seen.has(id))throw Error('Replacement cycle '+id);
 seen.add(id);return resolve(dest[id][0],seen);
};
const bank=[...before,...newQuestions];
const exclusions=structuredClone(snapshot['questions/selection-exclusions.json']);
for(const row of exclusions.questions){row.priorReplacementIds??=row.replacementIds;row.replacementIds=[...new Set(row.replacementIds.map(id=>resolve(id)))];}
for(const id of retiredNew){const old=originalById.get(id);exclusions.questions.push({id,replacementIds:[resolve(id)],reason:accepted.has(id)?'Copilotの機能を判断する新問へ置換。旧問の履歴・保存済みセッションを維持するため新IDを使用。':dest[id][1],retiredAt:'2026-10-16',fingerprint:hash(old),review:'reports/copilot-feature-refresh-2026-10-16.json'});}
exclusions.reviewedAt='2026-10-16';
const retired=new Set(exclusions.questions.map(q=>q.id));
const active=bank.filter(q=>!retired.has(q.id));
for(const row of exclusions.questions)if(row.replacementIds.some(id=>!active.some(q=>q.id===id)))throw Error('Inactive destination '+row.id);
const sets=structuredClone(snapshot['scenario-sets/seed.json']);
// Preserve archived scenario snapshots, but live scenario links refer only to current questions.
for(const set of sets){
 set.questionIds=[...new Set(set.questionIds.map(id=>resolve(id)))];
 set.questionIds=set.questionIds.filter(id=>active.some(q=>q.id===id));
 set.domainIds=[...new Set(set.questionIds.map(id=>bank.find(q=>q.id===id).domainId))];
 set.objectiveIds=[...new Set(set.questionIds.map(id=>bank.find(q=>q.id===id).objectiveId))];
 // A consolidated destination may belong to another set; keep the original set's remaining members.
 set.questionIds=set.questionIds.filter(id=>{const q=bank.find(q=>q.id===id);return !q.scenarioSetId||q.scenarioSetId===set.id;});
 for(const id of set.questionIds){const q=newQuestions.find(q=>q.id===id);if(q)q.scenarioSetId=set.id;}
}
// Do not change pre-existing assets to force a scenario backlink.
for(const set of sets)set.questionIds=set.questionIds.filter(id=>bank.find(q=>q.id===id)?.scenarioSetId===set.id);
const organizationSet=sets.find(s=>s.id==='sc09');
const organizationReview=newByOld.get('q-d6-e02');
if(organizationSet.questionIds.length===1&&organizationReview){organizationReview.scenarioSetId='sc09';organizationSet.questionIds.push(organizationReview.id);}
for(const set of sets){
 const members=set.questionIds.map(id=>bank.find(q=>q.id===id));
 set.domainIds=[...new Set(members.map(q=>q.domainId))];
 set.objectiveIds=[...new Set(members.map(q=>q.objectiveId))];
 if(set.id==='sc09'){
  set.title='組織のCopilot利用状況とレビューの利用条件';
  set.scenario='組織でGitHub Copilotを運用しています。利用状況の評価と、誰がどの経路でコードレビューを依頼できるかを確認します。集計された活動と、ライセンス・管理ポリシーによる実際の機能利用条件を分けて判断してください。';
 }
}
const lessons=structuredClone(snapshot['lessons/seed.json']);
const glossary=structuredClone(snapshot['glossary/terms.json']);
for(const q of newQuestions){
 for(const l of lessons.filter(l=>(l.objectiveIds??l.relatedObjectives??[]).includes(q.objectiveId))){l.questionIds=[...new Set([...(l.questionIds??[]),q.id])];}
 for(const id of q.sourceIds){const s=sourceRegistry.find(s=>s.id===id);for(const [field,value] of [['relatedDomainIds',q.domainId],['relatedObjectiveIds',q.objectiveId],['relatedQuestionIds',q.id]])s[field]=[...new Set([...(s[field]??[]),value])];}
}
const quality=structuredClone(snapshot['questions/quality-review.json']);
const difficulty=structuredClone(snapshot['questions/difficulty-review.json']);
const classification=read('reports/question-objective-classification-review.json');
classification.questions=classification.questions.filter(r=>!newQuestions.some(q=>q.id===r.id));
const applied=read('reports/applied-question-quality-review.json');
applied.questions=applied.questions.filter(r=>!newQuestions.some(q=>q.id===r.id));
const exam=read('reports/exam-question-quality-review.json');
exam.questions=exam.questions.filter(r=>!newQuestions.some(q=>q.id===r.id));
const measure=q=>{const lengths=q.choices.filter(c=>!q.answer.includes(c.id)).map(c=>Array.from(c.text).length).sort((a,b)=>a-b);const correct=Array.from(q.choices.find(c=>q.answer.includes(c.id)).text).length;return {correct,wrong:lengths,medianWrong:lengths[1],ratio:correct/lengths[1],position:'ABCD'[q.choices.findIndex(c=>q.answer.includes(c.id))]};};
const adoptedRecords=[];
const experimental=new Set(['q-d1-e02','q-d3-e07','q-sc08-2','q-d6-e03','q-d3-e08']);
const tradeoffs=new Set(['q-d2-e11','q-d4-e04','q-d1-e01','q-d1-e07','q-d1-e08','q-d2-e19','q-d6-e02','q-d4-e05','q-d4-e06','q-d4-e07','q-d4-e08','q-d2-e01','q-d2-e07','q-d1-e04','q-d6-e04','q-d5-e06','q-d5-e07','q-d5-e08','q-sc10-3','q-d6-e07']);
for(const q of newQuestions){
 const oldId=q.id.replace(/-feature-20261016$/,''),d=draftById.get(oldId),original=originalById.get(oldId),fingerprint=hash(q);
 const initial={...structuredClone(q),status:'needs-review',lastVerifiedAt:null};
 const cf={from:d.counterfactual.from,to:d.counterfactual.to,question:q.question.replace(d.counterfactual.from,d.counterfactual.to),answerId:'ABCD'[d.counterfactual.answerIndex],rationale:d.counterfactual.rationale,editoriallyValidated:true};
 const wrong=q.choices.filter(c=>!q.answer.includes(c.id));
 const steps=d.steps.length===3?d.steps:[d.steps[0],d.steps[1],q.explanation];
 const blind=`四案の判断対象を比較し、本文の「${d.clues.join('」「')}」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。${d.distinction}`;
 const assessment=q.difficulty==='advanced'?'本番相当の入口〜中程度。クライアント・設定・適用範囲の複数条件を照合する。実試験との難度等価性は未測定。':'応用の入口〜中程度。観測された状態と設定範囲を結び、次の機能操作を判断する。実測正答率は未取得。';
 const format=experimental.has(oldId)?'実験対照比較':tradeoffs.has(oldId)?'複合制約トレードオフ':'インシデント切り分け';
 const review={status:'EDITORIAL_SECOND_READ',independentReviewer:false,format,blindRationale:blind,reasoningSteps:steps,counterfactual:cf,clues:q.clues,lengths:measure(q),distinction:d.distinction,sourceEvidence:d.refs.map(ref=>({sourceId:sourceId(ref),url:refs[ref].url,checkedAt:'2026-10-16',clientQualification:q.question.includes('Local harness')?'VS Code Local harness':null})),difficultyAssessment:assessment};
 adoptedRecords.push({id:q.id,oldId,oldFingerprint:hash(original),initial,after:q,fingerprint,review});
 quality.questions[q.id]={fingerprint,multipleAnswerRisk:false,answerWithoutReading:false,difficultyConsistent:true,requirementCoverage:true,rationale:blind,latestReview:'reports/copilot-feature-refresh-2026-10-16.json'};
 difficulty.questions[q.id]={fingerprint,beforeDifficulty:q.difficulty,difficulty:q.difficulty,textRewritten:false,reclassified:false,assessment,reasoningSteps:steps,counterfactual:cf.rationale,evidence:q.sourceIds,reasoning:steps.join(' '),reviewRequired:false,latestReview:'reports/copilot-feature-refresh-2026-10-16.json'};
 classification.questions.push({id:q.id,changed:true,before:{domainId:original.domainId,objectiveId:original.objectiveId},after:q,difficulty:q.difficulty,status:q.status,question:q.question,correctChoices:q.choices.filter(c=>q.answer.includes(c.id)),rationale:`${d.distinction} 主たる判断は「${d.title}」。`,guideCriterion:plan.classificationPolicy,fingerprint,latestReview:'reports/copilot-feature-refresh-2026-10-16.json'});
 if(q.difficulty==='intermediate')applied.questions.push({id:q.id,before:initial,after:q,fingerprint,difficulty:q.difficulty,reviewType:'feature-replacement',decisiveCondition:q.clues.join(' / '),assessment,optionOnlyReview:blind,reasoningSteps:steps,counterfactual:cf.rationale,wrongChoiceAnalysis:wrong.map(c=>({id:c.id,text:c.text,whyWrong:q.choiceExplanations[c.id]}))});
 else exam.questions.push({id:q.id,before:initial,after:q,fingerprint,format,title:d.title,summary:q.question,difficultyAssessment:assessment,blindBefore:{verdict:'DRAFT',rationale:'全面改稿の初稿。既存問題のPASSを引き継がず再読した。'},blindAfter:{verdict:'PASS',rationale:blind},reasoningSteps:steps,clues:q.clues,counterfactual:cf,distractors:wrong.map(c=>({id:c.id,text:c.text,whyWrong:q.choiceExplanations[c.id],temptation:'別の対象・時点・適用範囲との混同。'+q.choiceExplanations[c.id]})),lengths:measure(q)});
}
const count=(qs,field,values)=>Object.fromEntries(values.map(v=>[v,qs.filter(q=>q[field]===v).length]));
const levels=['beginner','intermediate','advanced'],domains=['d1','d2','d3','d4','d5','d6'];
const inventory={stored:bank.length,active:active.length,eligible:active.filter(q=>q.status==='verified').length,retired:retired.size,levels:count(active,'difficulty',levels),domains:count(active,'domainId',domains),byLevelAndDomain:Object.fromEntries(levels.map(level=>[level,count(active.filter(q=>q.difficulty===level),'domainId',domains)]))};
const follow={reviewedAt:'2026-10-16',questionIds:newQuestions.map(q=>q.id),report:'reports/copilot-feature-refresh-2026-10-16.json'};
for(const obj of [quality,difficulty,classification,applied,exam]){obj.lastUpdated='2026-10-16';obj.followUpReviews=[...(obj.followUpReviews??[]).filter(r=>r.report!==follow.report),follow];}
classification.coverage=classification.coverage.map(row=>({...row,...Object.fromEntries(levels.map(l=>[l,bank.filter(q=>q.objectiveId===row.id&&q.difficulty===l&&q.status==='verified').length]))}));
classification.priorRefreshSummary??=classification.summary;
classification.summary={reviewed:bank.length,activeReviewed:active.length,archived:retired.size,changed:classification.questions.filter(r=>r.changed).length,afterDomains:count(bank,'domainId',domains),activeDomains:inventory.domains,featureReplacementCount:newQuestions.length};
for(const [obj,level] of [[applied,'intermediate'],[exam,'advanced']])obj.selectionSummary={totalStored:bank.filter(q=>q.difficulty===level).length,active:active.filter(q=>q.difficulty===level).length,retired:bank.filter(q=>q.difficulty===level&&retired.has(q.id)).length};
const ledger={date:'2026-10-16',status:'EDITORIALLY_REVIEWED',plan:'reports/copilot-feature-replacement-plan-2026-10-15.json',originalBankFingerprint:hash(before),scope:{reviewedCandidates:121,replacements:72,consolidated:49,separateFactFix:1,additionalKeptConsolidated:Object.keys(keptConsolidations).length},inventoryBefore:{stored:before.length,active:activeOld.length,levels:count(activeOld,'difficulty',levels),domains:count(activeOld,'domainId',domains)},inventoryAfter:inventory,questions:adoptedRecords,
 decisions:[...targets].map(oldId=>({oldId,decision:accepted.has(oldId)?'REPLACED':'CONSOLIDATED',destinationId:resolve(oldId),reason:accepted.has(oldId)?draftById.get(oldId).distinction:consolidated[oldId][1]})),keptConsolidations:Object.entries(keptConsolidations).map(([oldId,[target,reason]])=>({oldId,destinationId:resolve(target),reason})),
 rejectedDrafts:drafts.filter(d=>!accepted.has(d.oldId)).map(d=>({...d,status:'REJECTED_NOT_PUBLISHED',reason:consolidated[d.oldId][1]})),independentReviewer:false,measuredLearnerDifficulty:false,realExamEquivalenceValidated:false,
 planDeviation:'121枠を同数で満たすと機能名の暗記・重複・難度不足が残るため、72案を採用、49案を統合。維持候補のうち7問も抽象的な一般論・重複・基礎寄りとして統合。問題数維持の目標は未達で、シラバスの在庫比率にも不均衡が残る。数合わせの追加や無理なドメイン変更は行わない。'};
write(base+'questions/seed.json',bank);write(base+'questions/selection-exclusions.json',exclusions);write(base+'sources.json',sourceRegistry);write(base+'scenario-sets/seed.json',sets);write(base+'lessons/seed.json',lessons);write(base+'glossary/terms.json',glossary);
write(base+'questions/quality-review.json',quality);write(base+'questions/difficulty-review.json',difficulty);write('reports/question-objective-classification-review.json',classification);write('reports/applied-question-quality-review.json',applied);write('reports/exam-question-quality-review.json',exam);write(base+'questions/feature-refresh-review.json',ledger);write('reports/copilot-feature-refresh-2026-10-16.json',ledger);
console.log(JSON.stringify({scope:ledger.scope,inventory,scenarioSizes:sets.map(s=>({id:s.id,size:s.questionIds.length})),lengthWarnings:adoptedRecords.filter(r=>r.review.lengths.ratio>1.5||r.review.lengths.ratio<.5).map(r=>({id:r.id,ratio:r.review.lengths.ratio})),originalAssetsUnchanged:before.every(q=>hash(q)===hash(bank.find(b=>b.id===q.id)))}));
