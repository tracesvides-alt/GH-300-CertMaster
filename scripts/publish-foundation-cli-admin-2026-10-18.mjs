import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {edits} from './foundation-cli-admin-content-2026-10-18.mjs';
const root='content/gh300/2026-08-07/',path='reports/cli-admin-foundation-revision-2026-10-18.json';
const revision='cli-admin-foundation-2026-10-18',date='2026-10-18';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const unique=v=>[...new Set(v)];
const contract=q=>JSON.stringify({id:q.id,question:q.question,choices:q.choices,answer:q.answer,difficulty:q.difficulty,type:q.type,status:q.status,domainId:q.domainId,objectiveId:q.objectiveId,explanation:q.explanation,choiceExplanations:q.choiceExplanations,sourceIds:q.sourceIds,contentRevision:q.contentRevision});
const paths={lessons:root+'lessons/seed.json',glossary:root+'glossary/terms.json',comparisons:root+'comparisons/guides.json',sources:root+'sources.json'};
const assets=Object.fromEntries(Object.entries(paths).map(([kind,p])=>[kind,read(p)]));
const previous=fs.existsSync(path)?read(path):null;
if(previous)for(const row of previous.changes){
 const list=assets[row.kind],i=list.findIndex(x=>x.id===row.id);assert(i>=0);assert.deepEqual(list[i],row.after,'Unreviewed learning edits '+row.id);list[i]=row.before;
}
const originals=structuredClone(assets),changes=[];
const oldFiles=['seed.json','answer-explanations.json','official-alignment-revisions.json','admin-content-revisions.json','selection-exclusions.json','removals.json'];
const questionFingerprints=Object.fromEntries(oldFiles.map(f=>[f,hash(read(root+'questions/'+f))]));
const seeds=read(root+'questions/seed.json'),oldDetails=read(root+'questions/answer-explanations.json');
const priorRows=['official-alignment-revisions.json','admin-content-revisions.json'].flatMap(f=>read(root+'questions/'+f).questions);
assert(edits.every(e=>!priorRows.some(r=>r.id===e.id)),'Do not overwrite an earlier revision');
const excluded=new Set(['selection-exclusions.json','removals.json'].flatMap(f=>read(root+'questions/'+f).questions).map(q=>q.id));
const beforeBank=seeds.map(q=>priorRows.find(r=>r.id===q.id)?.after??q);
const beforeQuestionFingerprints=Object.fromEntries(beforeBank.map(q=>[q.id,hash(q)]));
const rows=edits.map(edit=>{
 const before=beforeBank.find(q=>q.id===edit.id);assert(before&&!excluded.has(before.id));assert.equal(before.status,'verified');assert.equal(before.difficulty,'beginner');assert.equal(before.domainId,'d2');
 const term=assets.glossary.find(t=>t.id===edit.termId);assert.equal(term.basicQuestionId,before.id);assert(term.questionIds.includes(before.id));
 const after={...structuredClone(before),question:edit.question,choices:edit.choices.map(([id,text])=>({id,text})),answer:edit.answer,
  explanation:edit.rationales[edit.answer[0]],choiceExplanations:edit.rationales,sourceIds:edit.sources,
  testedConcepts:[edit.termId],trustedSourceFacts:[edit.review.concept],clues:[],lastVerifiedAt:date,contentRevision:revision,cognitiveLevel:'understand'};
 if(before.correctChoiceIds)after.correctChoiceIds=edit.answer;
 after.choiceQuality=Object.fromEntries(after.choices.map(c=>[c.id,{plausibility:3,distractorType:after.answer.includes(c.id)?'correct':'common-confusion',sourceIds:edit.sources,rationale:edit.rationales[c.id]}]));
 after.requirementMapping=[{requirement:edit.question,correctReason:after.explanation,distractorFailures:Object.fromEntries(after.choices.filter(c=>!after.answer.includes(c.id)).map(c=>[c.id,edit.rationales[c.id]]))}];
 const lengths=after.choices.map((c,index)=>({id:c.id,position:'ABCD'[index],length:[...c.text].length}));
 const sorted=lengths.map(c=>c.length).sort((a,b)=>a-b),median=(sorted[1]+sorted[2])/2;
 const wrong=lengths.filter(c=>!after.answer.includes(c.id)).map(c=>c.length).sort((a,b)=>a-b);
 return {id:edit.id,title:edit.title,termId:edit.termId,revision,before,after,beforeContract:contract(before),afterContract:contract(after),beforeFingerprint:hash(before),afterFingerprint:hash(after),
  invalidatePreviousSnapshots:true,requiresAttemptRevision:true,previousDisplayedExplanation:oldDetails.questions.find(q=>q.id===before.id)?.text??before.explanation,displayedExplanation:edit.why,
  evidence:edit.sources.map(id=>{const s=assets.sources.find(s=>s.id===id);assert(s,id);return {id,title:s.title,url:s.url,checkedAt:date};}),
  review:{...edit.review,choiceLengths:lengths.map(c=>({...c,medianRatio:Number((c.length/median).toFixed(3))})),correctPosition:lengths.find(c=>after.answer.includes(c.id)).position,correctToWrongMedian:Number((lengths.find(c=>after.answer.includes(c.id)).length/wrong[1]).toFixed(3))},
 };
});
function editLearning(kind,id,patch,reason){const item=assets[kind].find(x=>x.id===id);assert(item);const before=structuredClone(item);Object.assign(item,patch);changes.push({kind,id,before,after:structuredClone(item),reason});}
const cli=assets.lessons.find(l=>l.id==='lesson-d2-cli');
const sections=structuredClone(cli.sections);
sections[6].content+='\n書き込みを事前に許可する例は、copilot --allow-tool="write(docs/guide.md)"です。ツールが利用可能で、対象ファイルへのアクセスがあり、競合する拒否がない条件で、その書き込みを許可します。\nprojectとsharedが隣り合う配置でprojectから起動する場合、copilot --add-dir=../sharedでsharedへのアクセスを追加できます。対話中なら/add-dir ../sharedを使います。追加先の.github/skillsと.github/agentsも信頼する設定として読み込まれるため、内容を確認してください。フォルダーの追加は、全ファイルの読み込みや回答への利用を保証しません。';
editLearning('lessons',cli.id,{sections,questionIds:unique([...cli.questionIds,...edits.slice(0,3).map(e=>e.id)])},'具体的な書き込み許可と追加ディレクトリの入力例を補足。8表39項目と要レビュー状態は維持。');
const admin=assets.lessons.find(l=>l.id==='lesson-d2-org-governance');
const adminSections=structuredClone(admin.sections);
adminSections[1].content+=' 個人契約だけを利用する場合は、本人向けのCopilot設定を管理します。例えば公開コードに一致する提案の扱いを設定できますが、組織からシートを得る場合には継承されて個人で変更できない設定もあります。';
editLearning('lessons',admin.id,{sections:adminSections,questionIds:unique([...admin.questionIds,...edits.slice(3).map(e=>e.id)]),sourceIds:unique([...admin.sourceIds,'privacy-training'])},'個人契約の設定範囲と組織提供時の継承の違いを補足。');
for(const source of assets.sources){
 const related=rows.filter(r=>r.after.sourceIds.includes(source.id));const learning=changes.filter(c=>c.kind==='lessons'&&c.after.sourceIds.includes(source.id));if(!related.length&&!learning.length)continue;
 const before=structuredClone(source);
 source.relatedQuestionIds=unique([...(source.relatedQuestionIds??[]),...related.map(r=>r.id)]);
 source.relatedLessonIds=unique([...(source.relatedLessonIds??[]),...learning.map(c=>c.id)]);
 source.relatedDomainIds=unique([...(source.relatedDomainIds??[]),...related.map(r=>r.after.domainId)]);
 source.relatedObjectiveIds=unique([...(source.relatedObjectiveIds??[]),...related.map(r=>r.after.objectiveId)]);
 // A source is re-dated only when used in this stage, not merely inherited by a lesson.
 if(related.length){source.lastCheckedAt=date;source.lastVerifiedAt=date;}
 if(JSON.stringify(before)!==JSON.stringify(source))changes.push({kind:'sources',id:source.id,before,after:structuredClone(source),reason:'改訂問題と補足教材の出典対応を追加。'});
}
const expansion=read('reports/cli-admin-reference-expansion-2026-10-18.json');
const coverage=structuredClone(expansion.coverage);
const mappings={
 'cli-allow':{correctChoiceQuestionIds:['q-d2-g08']},
 'cli-resume-id':{distractorOnlyQuestionIds:['q-d2-g09']},
 'cli-available':{distractorOnlyQuestionIds:['q-d2-g09']},
 'plan-pro':{correctChoiceQuestionIds:['q-d2-g20']},
 'admin-seat':{distractorOnlyQuestionIds:['q-d2-g20','q-d6-f04','q-d6-f05']},
 'admin-policy':{distractorOnlyQuestionIds:['q-d2-g20']},
 'admin-org-metrics':{correctChoiceQuestionIds:['q-d6-f05'],distractorOnlyQuestionIds:['q-d6-f04']},
 'admin-enterprise-metrics':{distractorOnlyQuestionIds:['q-d6-f04','q-d6-f05']},
 'admin-audit-read':{correctChoiceQuestionIds:['q-d6-f04'],distractorOnlyQuestionIds:['q-d6-f05']},
};
for(const item of coverage){
 item.beforeClassification=item.classification;
 for(const [key,ids] of Object.entries(mappings[item.rowId]??{}))item[key]=unique([...item[key],...ids]);
 item.classification=item.correctChoiceQuestionIds.length?'CORRECT_CHOICE':item.scenarioQuestionIds.length?'SCENARIO_ONLY':item.distractorOnlyQuestionIds.length?'DISTRACTOR_ONLY':'NOT_TESTED';
 if(item.classification==='CORRECT_CHOICE')delete item.note;
}
const afterBank=beforeBank.map(q=>rows.find(r=>r.id===q.id)?.after??q),eligible=afterBank.filter(q=>q.status==='verified'&&!excluded.has(q.id));
const tally=key=>eligible.reduce((a,q)=>(a[q[key]]=(a[q[key]]??0)+1,a),{});
const counts={eligible:eligible.length,byDifficulty:tally('difficulty'),byDomain:tally('domainId')};assert.deepEqual(counts,expansion.counts);
const beforeFingerprints=Object.fromEntries(Object.entries(originals).map(([kind,list])=>[kind,Object.fromEntries(list.map(x=>[x.id,hash(x)]))]));
if(previous){assert.deepEqual(beforeFingerprints,previous.beforeFingerprints);assert.deepEqual(beforeQuestionFingerprints,previous.beforeQuestionFingerprints);assert.deepEqual(questionFingerprints,previous.questionFingerprints);}
const report={reviewedAt:date,revision,questionFingerprints,beforeQuestionFingerprints,beforeFingerprints,counts,changes,questions:rows,coverage,
 supplementalCoverage:[{topic:'起動時の追加ディレクトリ指定',lessonId:cli.id,classification:'CORRECT_CHOICE',questionIds:['q-d2-g09'],note:'既存の39行の表へ行を増やさず、補足で扱う。'}],
 limitations:['39項目の表全体を網羅したわけではない。','個人Proの管理範囲から他の全プランを確認済みとしない。','企業の利用レポート閲覧は誤答のみで、組織の閲覧問題と区別する。','CLIのContent Exclusionの説明差は残る。'],
};
write(path,report);
write(root+'questions/foundation-cli-admin-revisions.json',{revision,questions:rows.map(({before,previousDisplayedExplanation,review,evidence,title,termId,...r})=>r)});
for(const [kind,p] of Object.entries(paths))if(changes.some(c=>c.kind===kind))write(p,assets[kind]);
console.log(`Published ${rows.length} reviewed Foundation editions; ${eligible.length} eligible questions, counts unchanged.`);
