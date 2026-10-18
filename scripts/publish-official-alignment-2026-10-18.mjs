import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {edits,newSources} from './official-alignment-content-2026-10-18.mjs';
import {evidence,findings} from './official-alignment-findings-2026-10-18.mjs';

const root='content/gh300/2026-08-07/';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const seed=read(root+'questions/seed.json'),details=read(root+'questions/answer-explanations.json');
const audit=read('reports/official-alignment-audit-2026-10-18.json');
assert.equal(hash(seed),audit.fingerprints.seed,'Baseline changed: repeat content review');
assert.equal(hash(details),audit.fingerprints.details,'Baseline explanations changed');
const revision='official-alignment-2026-10-18';
const contract=q=>JSON.stringify({id:q.id,question:q.question,choices:q.choices,answer:q.answer,difficulty:q.difficulty,type:q.type,status:q.status,domainId:q.domainId,objectiveId:q.objectiveId,explanation:q.explanation,choiceExplanations:q.choiceExplanations,sourceIds:q.sourceIds,contentRevision:q.contentRevision});
const previousDetail=q=>details.questions.find(row=>row.id===q.id)?.text??q.explanation;
const sourceRegistry=read(root+'sources.json');
const exclusionIds=new Set([...read(root+'questions/selection-exclusions.json').questions,...read(root+'questions/removals.json').questions].map(q=>q.id));
assert.equal(edits.length,10);
assert.equal(new Set(edits.map(q=>q.id)).size,10);
const rows=edits.map(edit=>{
  const before=seed.find(q=>q.id===edit.id);
  assert(before&&!exclusionIds.has(before.id)&&before.status==='verified');
  const after=structuredClone(before);
  after.question=edit.question??before.question;
  after.choices=before.choices.map(c=>({...c,text:edit.choices?.[c.id]??c.text}));
  after.answer=edit.answer??before.answer;
  if(after.correctChoiceIds)after.correctChoiceIds=[...after.answer];
  after.explanation=edit.explanation??before.explanation;
  after.choiceExplanations=edit.choiceExplanations??before.choiceExplanations;
  after.sourceIds=[...new Set([...before.sourceIds,...(edit.additionalSourceIds??[])])];
  after.lastVerifiedAt='2026-10-18';after.contentRevision=revision;
  after.clues=edit.clues??before.clues.filter(clue=>after.question.includes(clue));
  after.trustedSourceFacts=Object.values(after.choiceExplanations);
  after.choiceQuality=Object.fromEntries(after.choices.map(c=>[c.id,{
    plausibility:before.choiceQuality?.[c.id]?.plausibility??3,
    distractorType:after.answer.includes(c.id)?'correct':edit.answer?'common-confusion':before.choiceQuality[c.id].distractorType,
    sourceIds:after.sourceIds,rationale:after.choiceExplanations[c.id],
  }]));
  after.requirementMapping=(edit.requirements??[after.question]).map(requirement=>({requirement,correctReason:after.explanation,distractorFailures:Object.fromEntries(after.choices.filter(c=>!after.answer.includes(c.id)).map(c=>[c.id,after.choiceExplanations[c.id]]))}));
  const displayedExplanation=edit.displayedExplanation??(previousDetail(before)+(edit.appendExplanation?'\n\n'+edit.appendExplanation:''));
  assert.equal(after.difficulty,before.difficulty);assert.equal(after.domainId,before.domainId);assert.equal(after.objectiveId,before.objectiveId);
  const lengths=after.choices.map(c=>c.text.length).sort((a,b)=>a-b);
  const median=(lengths[1]+lengths[2])/2;
  return {id:edit.id,revision,findingId:edit.findingId,beforeContract:contract(before),afterContract:contract(after),beforeFingerprint:hash(before),afterFingerprint:hash(after),
    invalidatePreviousSnapshots:edit.invalidatePreviousSnapshots??false,after,displayedExplanation,
    review:{...edit.review,choiceLengths:after.choices.map((c,i)=>({id:c.id,displayPosition:'ABCD'[i],characters:c.text.length,medianRatio:Number((c.text.length/median).toFixed(3)),correct:after.answer.includes(c.id)}))},
    officialEvidence:findings.find(f=>f.id===edit.findingId).evidenceIds.map(id=>evidence[id])};
});
for(const source of newSources){
  const related=rows.filter(row=>row.after.sourceIds.includes(source.id));
  const existing=sourceRegistry.find(row=>row.id===source.id);
  if(existing){assert.equal(existing.url,source.url);Object.assign(existing,source);continue;}
  sourceRegistry.push({...source,syllabusVersion:'2026-08-07',lastCheckedAt:'2026-10-18',lastVerifiedAt:'2026-10-18',status:'verified',
    relatedDomainIds:[...new Set(related.map(q=>q.after.domainId))],relatedObjectiveIds:[...new Set(related.map(q=>q.after.objectiveId))],relatedQuestionIds:related.map(q=>q.id),relatedLessonIds:[],relatedGlossaryIds:[],relatedComparisonIds:[]});
}
for(const row of rows)assert(row.after.sourceIds.every(id=>sourceRegistry.some(s=>s.id===id)));
const active=seed.filter(q=>!exclusionIds.has(q.id));
const revised=active.map(q=>rows.find(r=>r.id===q.id)?.after??q);
const tally=(questions,key)=>questions.reduce((out,q)=>(out[q[key]]=(out[q[key]]??0)+1,out),{});
for(const key of ['domainId','objectiveId','difficulty','type','status'])assert.deepEqual(tally(revised,key),tally(active,key));
const artifact={revision,quarantinedQuestionIds:[],questions:rows};
const report={reviewedAt:'2026-10-18',revision,scope:{contentCorrections:8,datedNotes:2,eligible:253,needsReview:1},baselineSeedFingerprint:hash(seed),baselineDetailsFingerprint:hash(details),
  currentCounts:{byDifficulty:tally(revised.filter(q=>q.status==='verified'),'difficulty'),byDomain:tally(revised.filter(q=>q.status==='verified'),'domainId')},
  method:'10問を個別に編集して公式根拠と照合。8問の内容訂正と2問の時点注記。元データ・過去監査・旧版の解説を保存し、改訂内容への完全一致で現在の出題と詳細解説へ適用する。',
  limitations:['現在の仕様と8月7日の固定版を同一視しない。','全254問の歴史的な全仕様の確定や、実試験と同一の難度の証明ではない。','未変更の問題の品質を今回の修正だけで再認定しない。'],
  questions:rows.map(row=>({...row,before:seed.find(q=>q.id===row.id),previousDisplayedExplanation:previousDetail(seed.find(q=>q.id===row.id))}))};
const write=(path,value)=>fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');
write(root+'questions/official-alignment-revisions.json',artifact);
write(root+'sources.json',sourceRegistry);
write('reports/official-alignment-remediation-2026-10-18.json',report);
const text=['# GH-300 公式整合性の修正記録','','修正日：2026-10-18（日本時間）','',report.method,'',
  '通常出題253問（基礎162・応用48・高難度43）、ドメイン・Objective・出題形式の件数を維持。q11は要レビューとして通常出題から除外したまま。旧監査レポートは修正前の記録として保持する。','',
  '## 改訂内容','','F01はC・Dへ採点を訂正し、Lite/Balancedのみで再設計。旧版F01は未完了模試・新規出題から外す。完了済み履歴の設問や点数は変更しない。新しい詳細解説は改訂版の問題と完全一致した場合だけ表示する。','',
  '## 個別レビュー','',...report.questions.flatMap(row=>[
    `### ${row.id}（${row.findingId}）`,'',row.after.question,'',
    ...row.after.choices.map((c,i)=>`- ${'ABCD'[i]} / ID ${c.id}${row.after.answer.includes(c.id)?'［正解］':''}：${c.text} — ${row.after.choiceExplanations[c.id]}`),'',
    row.displayedExplanation,'',`選択肢単体の確認：${row.review.blindCheck}`,`難易度：${row.review.difficulty}`,
    ...(row.review.reasoningSteps??[]).map((s,i)=>`推論${i+1}：${s}`),
    ...(row.review.counterfactuals??[]).map(r=>`条件変更：${r.condition} → 正解ID ${r.newCorrectIds.join('・')}。${r.reason}`),
    `文字長：${row.review.choiceLengths.map(c=>`${c.displayPosition}=${c.characters}字（中央値比${c.medianRatio}）`).join('、')}`,'',
    ...row.officialEvidence.map(s=>`- [${s.title}](${s.url})`),'',
  ]),
  '## 検証記録','','自動テスト・画面確認の実行結果は [検証記録](official-alignment-verification-2026-10-18.md) を参照。文字数と指紋の一致だけでは、内容・難易度の正しさを認定しない。','',
].join('\n');
fs.writeFileSync('reports/official-alignment-remediation-2026-10-18.md',text);
console.log(JSON.stringify({revision,updatedIds:rows.map(q=>q.id),rawSeedUnchanged:hash(read(root+'questions/seed.json'))===report.baselineSeedFingerprint,currentCounts:report.currentCounts},null,2));
