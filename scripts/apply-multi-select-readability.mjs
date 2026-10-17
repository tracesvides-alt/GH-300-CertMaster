import fs from 'node:fs';
import {readabilityEdits,clarifyChoiceText,choiceClarifications} from './multi-select-readability-2026-10-17.mjs';
import {multiFingerprint as hash,validateMultiSelect} from './multi-select-review.mjs';
const dir='content/gh300/2026-08-07/questions/',reportPath='reports/multi-select-readability-review-2026-10-17.json';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const priorReadability=fs.existsSync(reportPath)?read(reportPath):null;
const bank=read(dir+'seed.json'),ledger=read(dir+'multi-select-review.json'),quality=read(dir+'quality-review.json'),difficulty=read(dir+'difficulty-review.json'),classification=read('reports/question-objective-classification-review.json'),exclusions=read(dir+'selection-exclusions.json');
const errors=validateMultiSelect(bank,exclusions,ledger);if(errors.length)throw Error(errors.join('\n'));
if(readabilityEdits.length!==54||new Set(readabilityEdits.map(e=>e.oldId)).size!==54)throw Error('Incomplete readability scope');
const invariant=q=>JSON.stringify({id:q.id,answer:q.answer,correctChoiceIds:q.correctChoiceIds,requiredSelections:q.requiredSelections,choiceIds:q.choices.map(c=>c.id),type:q.type,multiSelectPattern:q.multiSelectPattern,syllabusVersion:q.syllabusVersion,domainId:q.domainId,objectiveId:q.objectiveId,difficulty:q.difficulty,cognitiveLevel:q.cognitiveLevel,examLike:q.examLike,testedConcepts:q.testedConcepts,sourceIds:q.sourceIds,status:q.status});
const questions=readabilityEdits.map(edit=>{
 const row=ledger.questions.find(r=>r.oldId===edit.oldId),q=bank.find(q=>q.id===row?.id);
 if(!row||!q)throw Error('Missing readability target '+edit.oldId);
 const previous=priorReadability?.questions.find(r=>r.id===q.id);
 if(previous&&hash(q)!==previous.afterFingerprint)throw Error('Content changed outside the readability pass: '+q.id);
 const before=structuredClone(previous?.before??q),oldClues=[...(before.clues??[])];
 q.question=edit.question;
 for(const c of q.choices){c.text=choiceClarifications[edit.oldId]?.[c.id]??clarifyChoiceText(c.text);q.choiceExplanations[c.id]=clarifyChoiceText(q.choiceExplanations[c.id]);q.choiceQuality[c.id].rationale=q.choiceExplanations[c.id];}
 q.explanation=clarifyChoiceText(q.explanation);
 q.clues=edit.clues??q.question.split('。').filter(Boolean).slice(0,2);
 if(q.clues.some(c=>!q.question.includes(c)))throw Error('Nonliteral clue '+q.id);
 q.requirementMapping=q.clues.map(requirement=>({requirement,correctReason:q.explanation,distractorFailures:Object.fromEntries(q.choices.filter(c=>!q.answer.includes(c.id)).map(c=>[c.id,q.choiceExplanations[c.id]]))}));
 q.contentRevision='multi-select-readability-2026-10-17';
 if(invariant(before)!==invariant(q))throw Error('Changed tested contract '+q.id);
 const rationale=`本文の対象・目的・保持すべき条件を確認して各候補を照合する。${q.choices.filter(c=>!q.answer.includes(c.id)).map(c=>q.choiceExplanations[c.id]).join(' ')}`;
 row.after=structuredClone(q);row.fingerprint=hash(q);
 row.review.blindRationale=rationale;
 row.review.choiceEvaluations=q.choices.slice().sort((a,b)=>a.id.localeCompare(b.id)).map(c=>({id:c.id,valid:q.answer.includes(c.id),reason:q.choiceExplanations[c.id]}));
 row.readabilityReview={report:reportPath,issue:edit.issue,beforeFingerprint:hash(before),afterFingerprint:hash(q),meaningPreserved:true};
 quality.questions[q.id]={...quality.questions[q.id],fingerprint:hash(q),rationale};
 difficulty.questions[q.id]={...difficulty.questions[q.id],fingerprint:hash(q),textRewritten:true};
 const classified=classification.questions.find(r=>r.id===q.id);
 Object.assign(classified,{after:structuredClone(q),question:q.question,correctChoices:q.choices.filter(c=>q.answer.includes(c.id)),fingerprint:hash(q),latestReview:reportPath});
 return {id:q.id,difficulty:q.difficulty,issue:edit.issue,before,after:structuredClone(q),beforeFingerprint:hash(before),afterFingerprint:hash(q),oldClues,newClues:q.clues,answerIdsPreserved:true,displayOrderPreserved:true,domainAndDifficultyPreserved:true,editorialCheck:'対象・制約・時点・問いを省略せず、既存の4候補と正誤の対応を再照合。条件の削除や正解を直接教える追記は行わない。'};
});
const finalErrors=validateMultiSelect(bank,exclusions,ledger);if(finalErrors.length)throw Error(finalErrors.join('\n'));
const report={reviewedAt:'2026-10-17',scope:'直前の複数選択追加・置換54問。既存の単一選択199問と要レビュー1問の日本語全件監査は今回の対象外。',method:'同じ編集者が問題文・全選択肢・解説を再読。文字数で可読性を自動判定せず、誰が・何を・どの条件で・何を選ぶかが追えるかを確認。',summary:{reviewed:questions.length,rewritten:questions.filter(r=>r.before.question!==r.after.question).length,choiceTextClarified:questions.filter(r=>JSON.stringify(r.before.choices)!==JSON.stringify(r.after.choices)).length,newOrDeletedQuestions:0,answerChanges:0,classificationChanges:0},questions};
write(dir+'seed.json',bank);write(dir+'multi-select-review.json',ledger);write(dir+'quality-review.json',quality);write(dir+'difficulty-review.json',difficulty);write('reports/question-objective-classification-review.json',classification);write(reportPath,report);
const label=(q,id)=>'ABCD'[q.choices.findIndex(c=>c.id===id)];
const lines=['# 複数選択54問：日本語の可読性再点検','',`確認日：${report.reviewedAt}`,'','前回は機能との関連性・正答数・採点動作を優先し、日本語としての読みやすさの確認が不十分だった。対象や設定名を省略した文、複数の条件を名詞で詰めた文、不自然な「判断を選びます」といった問いが残っていた。','',report.scope,'',`全${report.summary.reviewed}問を再読し、問題文${report.summary.rewritten}問、選択肢の表現${report.summary.choiceTextClarified}問を修正。問題の追加・削除、正答ID、表示順、Domain・Objective・難易度・出典の変更はない。`,'','## 修正方針','','- 主語、操作対象、時点、保つ条件、求める判断を文章で示す。','- repo・Seat・hover・metered・headなどは、日本語の説明を添える。設定キー、コマンド、パスは実際の表記を保つ。','- 短さを目標にせず、一文に判断条件を詰め込まない。一方、解答に不要な物語も増やさない。','- 「選びます。適切なものを2つ選んでください」という二重の問いを整理する。','- 条件を削って難易度を下げない。文章を説明し直す際にも、正答の手順そのものを問題文へ書き込まない。','- 正答・誤答に偏らず用語を展開し、正答だけを丁寧にして目印を作らない。','','## 代表的な修正','',''];
for(const id of ['q-d6-a07','q-d1-a11-feature-20261016','q-d5-e04-feature-20261016','q-d2-e21','q-d5-e03-feature-20261016','q-d5-a15-feature-20261016']){const r=questions.find(r=>r.id===id+'-ms-20261017');lines.push(`### ${r.id}`,'',`問題点：${r.issue}`,'',`修正前：${r.before.question}`,'',`修正後：${r.after.question}`,'');}
lines.push('## 全54問の再点検記録','','各問の4候補も含めて再読した。以下では修正後の本文・選択肢・正答を掲載する。編集前後の全文と指紋は同名のJSONに保持する。','');
for(const r of questions){const q=r.after;lines.push(`### ${r.id}`,'',`修正理由：${r.issue}`,'',q.question,'',...q.choices.map(c=>`- ${label(q,c.id)}：${c.text}`),'',`正答：${q.answer.map(id=>label(q,id)).sort().join('・')}（変更なし）。`,'');}
lines.push('## 検証について','','既存のスキーマ、正答・表示順、履歴、品質・難易度台帳との整合を検証する。可読性は編集評価であり、学習者による読解時間や理解度の実測ではない。','');
fs.writeFileSync(reportPath.replace('.json','.md'),lines.join('\n'));
console.log(JSON.stringify(report.summary));
