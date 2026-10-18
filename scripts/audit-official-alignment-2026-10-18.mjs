import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { sourceChecks } from './answer-explanation-source-review.mjs';
import { auditDate, evidence, findings, datedFeatureChecks, historicalUnresolved, supplementarySourceChecks } from './official-alignment-findings-2026-10-18.mjs';

// Bind this editorial review to the exact assets that were read. Never turn a
// later question revision into a semantic PASS by simply re-running this file.
const expected = {
  seed: '0659961ba6d09bdefbd7f1f5ddcbfc6218ffac5f652a082a1d580e81b6facf7b',
  details: '60b3502bf394e4bf11fe1ad50ce35a4aca90f28a06e2b343efb9c64390d2a865',
  scope: 'c3ba78edffc525612800781d8b31f91a8bc4a7c7704ed28d6b2b5fe9617a7386',
};
const root = 'content/gh300/2026-08-07/';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const sha = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const seed = read(root+'questions/seed.json');
const details = read(root+'questions/answer-explanations.json');
assert.equal(sha(seed), expected.seed, 'Question bank changed: repeat editorial review');
assert.equal(sha(details), expected.details, 'Displayed explanations changed: repeat editorial review');
const exclusions = read(root+'questions/selection-exclusions.json').questions;
const removals = read(root+'questions/removals.json').questions;
const excluded = new Set([...exclusions,...removals].map(x=>x.id));
const active = seed.filter(q=>!excluded.has(q.id));
const eligible = active.filter(q=>q.status==='verified');
const sourceRegistry = read(root+'sources.json');
const syllabus = read(root+'syllabus.json');
const overlayById = new Map(details.questions.map(x=>[x.id,x]));
const sourceById = new Map(sourceRegistry.map(x=>[x.id,x]));
const contract = q => JSON.stringify({ question:q.question, choices:q.choices, answer:q.answer, difficulty:q.difficulty, sourceIds:q.sourceIds, status:q.status });
const displayed = q => {
  const row = overlayById.get(q.id);
  return row?.contract===contract(q) ? row.text : q.explanation;
};
const scope = active.map(q=>({...q,displayExplanation:displayed(q),sourceUrls:q.sourceIds.map(id=>sourceById.get(id)?.url)}));
assert.equal(sha(scope), expected.scope, 'Audit scope/source bindings changed');
assert.equal(active.length,254);
assert.equal(eligible.length,253);
assert.equal(seed.length-active.length,205);
assert.equal(new Set(active.map(q=>q.id)).size,active.length);

const http = read('artifacts/official-audit-20261017/http-results.json');
const usedSources = [...new Set(active.flatMap(q=>q.sourceIds))];
assert.equal(usedSources.length,83);
const checks = [...sourceChecks,...supplementarySourceChecks].map((row,i)=>({id:'S'+String(i+1).padStart(2,'0'),...row}));
for(const id of usedSources) {
  assert(sourceById.has(id),'Missing source '+id);
  assert(http.some(row=>row.id===id&&row.status===200),'Missing fetched source '+id);
  assert(checks.some(row=>row.sourceIds.includes(id)),'Missing editorial source note '+id);
}
const activeIds = new Set(active.map(q=>q.id));
for(const f of findings) {
  assert(f.questionIds.length>0);
  for(const id of f.questionIds) assert(activeIds.has(id),'Finding outside reviewed scope '+id);
  for(const id of f.evidenceIds) assert(evidence[id],'Missing evidence '+id);
}
for(const row of [...datedFeatureChecks,...historicalUnresolved]) for(const id of row.questionIds) assert(activeIds.has(id));
const objectives = new Map(syllabus.domains.flatMap(d=>d.objectives.map(o=>[o.id,{...o,domainId:d.id}])));
for(const q of active) {
  assert.equal(objectives.get(q.objectiveId)?.domainId,q.domainId);
  assert.equal(q.choices.length,4);
  assert(q.answer.every(id=>q.choices.some(c=>c.id===id)));
  assert(q.choices.every(c=>q.choiceExplanations[c.id]?.trim()));
  assert(displayed(q).trim());
}
const tally = (rows,key) => rows.reduce((counts,row)=>(counts[row[key]]=(counts[row[key]]||0)+1,counts),{});
const concernPriority = ['CONFIRMED_ANSWER_ERROR','CONFIRMED_EXPLANATION_ERROR','POST_BASELINE_EXTENSION','CLARIFICATION_NEEDED','EXISTING_REVIEW_STATUS'];
const supportIds = new Set(['q02','q-d5-f05','q-d5-g05','q-d5-g10','q-d5-g13','q-d5-g14','q-d5-g15','q-d5-g16','q-d5-g17','q-d5-g18']);
const legacyIds = new Set(['q-d2-g05','q-d2-g06','q-d2-g07','q-d2-g16','q-d2-g17','q-d2-g22']);
const questions = active.map(q=> {
  const linked = findings.filter(f=>f.questionIds.includes(q.id));
  const primary = concernPriority.find(cat=>linked.some(f=>f.category===cat)) || 'NO_ADDITIONAL_DISCREPANCY_IDENTIFIED';
  const dated = datedFeatureChecks.filter(row=>row.questionIds.includes(q.id));
  return {
    id:q.id, difficulty:q.difficulty, type:q.type, status:q.status, eligibleForNewExercise:q.status==='verified',
    domainId:q.domainId, objectiveId:q.objectiveId, objectiveTitle:objectives.get(q.objectiveId).title,
    question:q.question, choices:q.choices, answerIds:q.answer, storedExplanation:q.explanation,
    displayedExplanation:displayed(q), choiceExplanations:q.choiceExplanations,
    reviewedFields:['question','all-four-choices','answer','stored-explanation','runtime-displayed-explanation','all-four-choice-explanations','status','sourceIds','objectiveId'],
    fingerprint:sha(q), displayedExplanationFingerprint:sha(displayed(q)),
    findingIds:linked.map(f=>f.id), assessment:primary,
    assessmentMeaning:primary==='NO_ADDITIONAL_DISCREPANCY_IDENTIFIED' ? '今回の問題文・正解・解説の照合で追加の不整合を特定せず。全主張の8月7日時点の証明済みを意味しない。' : linked.map(f=>f.title).join('／'),
    syllabusRelation:supportIds.has(q.id)?'SUPPORTING_DEVELOPMENT_CONCEPT':legacyIds.has(q.id)?'LEGACY_OR_MIGRATION_NOTE':'RELATED_TO_SYLLABUS_OBJECTIVE',
    sourceIds:q.sourceIds, sourceCheckIds:checks.filter(row=>row.sourceIds.some(id=>q.sourceIds.includes(id))).map(row=>row.id),
    historicalAssessment:linked.some(f=>f.category==='POST_BASELINE_EXTENSION')?'POST_AUG7_FEATURE_CONFIRMED':dated.length?'FEATURE_EXISTED_BY_AUG7_DETAILS_NOT_FROZEN':'AUG7_EXACT_FEATURE_SNAPSHOT_NOT_PROVEN',
    datedFeatureChecks:dated, historicalOpenItems:historicalUnresolved.filter(row=>row.questionIds.includes(q.id)),
  };
});
const result = {
  auditDate, baseline:'Skills measured as of August 7, 2026', scope:'現在の問題バンク全件のライフサイクル確認と、現行対象254問の問題・選択肢・正解・全解説の内容照合',
  method:'人手で問題の主張と公式資料を照合し、日付付きChangelogも確認。スクリプトは対象の完全性・バインド・集計を検証するだけで、意味上の正しさを自動判定しない。',
  limitations:[
    '8月7日はシラバス適用日であり、公式Docsのすべての機能詳細をその日に固定した版ではない。',
    '日付付き証拠を付けた機能以外の8月7日時点の全仕様は復元していない。未証明を合格と扱わない。',
    '通常出題253問と既存needs-review 1問を内容照合。除外・削除済み205問は新規出題対象外であることの確認のみで、本文の再監査は対象外。保存済み履歴のスナップショットはこの点検とは別。',
    '教材本文・用語集全体の改訂、難易度・ブラインドチェックの再評価、実試験と同一であることの証明は行っていない。',
    '83件のHTTP 200は取得できたことだけを意味する。元の広い出典が個々の主張をすべて直接証明するという意味ではない。',
    '追加された現行機能を、8月7日以降というだけで実試験の範囲外・出題されないと断言しない。',
  ],
  fingerprints:{...expected,sourceRegistry:sha(sourceRegistry),exclusions:sha(exclusions),removals:sha(removals)},
  counts:{stored:seed.length,archived:seed.length-active.length,active:active.length,eligible:eligible.length,existingNeedsReview:active.filter(q=>q.status==='needs-review').length,
    activeByDifficulty:tally(active,'difficulty'),eligibleByDifficulty:tally(eligible,'difficulty'),byAssessment:tally(questions,'assessment'),byHistoricalAssessment:tally(questions,'historicalAssessment'),sourceUrls:usedSources.length},
  domainCoverage:syllabus.domains.map(d=>({id:d.id,title:d.title,officialWeightRange:[d.min,d.max],eligible:eligible.filter(q=>q.domainId===d.id).length,eligibleSharePct:Number((100*eligible.filter(q=>q.domainId===d.id).length/eligible.length).toFixed(2)),objectives:d.objectives.map(o=>({...o,eligible:eligible.filter(q=>q.objectiveId===o.id).length}))})),
  evidence, findings, datedFeatureChecks, historicalUnresolved, sourceChecks:checks,
  sources:usedSources.map(id=>{
    const s=sourceById.get(id),request=http.find(row=>row.id===id);
    return {id,title:s.title,url:s.url,fetch:{...request,meaning:'取得の証跡。内容・時点の正しさは別途判断。'}, editorialCheckIds:checks.filter(row=>row.sourceIds.includes(id)).map(row=>row.id)};
  }),
  excludedAssets:seed.filter(q=>excluded.has(q.id)).map(q=>({id:q.id,disposition:removals.some(row=>row.id===q.id)?'REMOVED_FROM_NEW_EXERCISES':'RETIRED_FROM_NEW_EXERCISES',contentAssessment:'NOT_REAUDITED_ARCHIVE_ONLY'})),
  questions,
};
assert.equal(questions.length,254);
assert.equal(questions.reduce((n,q)=>n+q.choices.length,0),1016);
assert.equal(questions.filter(q=>q.eligibleForNewExercise).length,253);
assert.equal(questions.filter(q=>q.assessment==='CONFIRMED_ANSWER_ERROR').length,1);
assert.equal(questions.filter(q=>q.assessment==='CONFIRMED_EXPLANATION_ERROR').length,1);
assert.equal(questions.filter(q=>q.assessment==='CLARIFICATION_NEEDED').length,6);
assert.equal(questions.filter(q=>q.assessment==='POST_BASELINE_EXTENSION').length,2);
assert.equal(questions.filter(q=>q.assessment==='NO_ADDITIONAL_DISCREPANCY_IDENTIFIED').length,243);
const label = {CONFIRMED_ANSWER_ERROR:'正解・採点の不整合',CONFIRMED_EXPLANATION_ERROR:'解説の誤記',POST_BASELINE_EXTENSION:'8月7日以降の機能',CLARIFICATION_NEEDED:'表現・条件の明確化',EXISTING_REVIEW_STATUS:'既存要レビュー',NO_ADDITIONAL_DISCREPANCY_IDENTIFIED:'追加不整合を特定せず'};
const level = {beginner:'基礎',intermediate:'応用',advanced:'高難度'};
const links = ids=>ids.map(id=>`[${evidence[id].title}](${evidence[id].url})`).join('、');
const md = [
  '# GH-300 問題・解説と公式資料の整合性総点検', '',
  `点検日：${auditDate}（日本時間）／対象シラバス：2026年8月7日適用`, '',
  '正解・採点を見直すべき問題が1問、選択肢別解説の誤記が1問あります。加えて、8月7日以降に追加された機能を扱う2問と、条件・断定表現を整える6問を確認しました。これらは重複しない10問です。別に既存の要レビュー1問を確認しました。残る243問では今回の照合で追加の不整合を特定していませんが、8月7日時点の全詳細仕様が証明済みという意味ではありません。', '',
  '今回は監査のみです。問題文・正解・解説・status・出題比率・アプリ表示は変更していません。コミット・push・デプロイも行っていません。', '',
  '## 基準と対象', '',
  `基準は${links(['guide'])}です。「8月7日版のシラバスへの関連性」「現在の機能仕様との整合」「8月7日以前に存在したことの日時付き根拠」を別々に扱いました。現在のDocsを当日の固定版とみなしていません。`, '',
  '| 対象 | 件数 | 扱い |','|---|---:|---|',
  '| 保存されている問題 | 459 | 全IDの現行／除外状態を確認 |',
  '| 通常の新規演習対象 | 253 | 基礎162・応用48・高難度43を内容照合 |',
  '| 現行だが既存の要レビュー | 1 | q11。通常出題から除外済み |',
  '| 除外・削除済み | 205 | 状態確認のみ。本文の再監査はしていない |', '',
  '現行254問の問題文、選択肢1016件、正解、保存されている短い解説、画面で使う詳細解説、全選択肢の短い正誤解説、statusと出典を確認しました。詳細解説は別ファイルの上書きを含み、元のseed.jsonだけを読んだ評価ではありません。', '',
  '## 判定内訳', '', '| 判定 | 件数 |','|---|---:|',
  ...Object.entries(result.counts.byAssessment).sort(([a],[b])=>concernPriority.indexOf(a)-concernPriority.indexOf(b)).map(([k,v])=>`| ${label[k]} | ${v} |`), '',
  ...findings.flatMap(f=>[
    `## ${f.id}：${f.title}`, '',
    `- 分類：${label[f.category]}／優先度：${f.priority}`,
    `- 対象：${f.questionIds.map(id=>`\`${id}\``).join('、')}`,
    `- 対象箇所：${f.fields.map(x=>`\`${x}\``).join('、')}`, '',
    f.observation, '', `推奨対応：${f.recommendation}`, '',
    ...(f.baselineCaveat?[`時点の注意：${f.baselineCaveat}`,'']:[]),
    `根拠：${links(f.evidenceIds)}`, '',
  ]),
  '## 時点を取り違えていないかの追加確認', '',
  ...datedFeatureChecks.map(row=>`- ${row.questionIds.map(id=>`\`${id}\``).join('、')}：${row.conclusion} ${links(row.evidenceIds)}`), '',
  `レビューの組み込み既定値は9月28日に変更されています。現在のBalancedを8月7日の既定値として説明しないよう注意が必要です。ただし、問題で明示されたrepo設定のBalancedまで誤りになるわけではありません。${links(['reviewDefault'])}`, '',
  '次の2問は現行Docsと整合しますが、細かな挙動を8月7日以前の資料で確定できていません。誤りと断定した件数には含めません。ほかの設問についても、日付付き根拠のない詳細を当日仕様として保証していません。', '',
  ...historicalUnresolved.map(row=>`- ${row.questionIds.map(id=>`\`${id}\``).join('、')}：${row.note}`), '',
  '## 旧機能についての確認', '',
  'Knowledge Bases、旧gh-copilot、GitHub App型Copilot Extensions、Sparkを扱う現行6問は、旧機能・終了・移行の注記として出題されています。旧機能を現在の標準操作として復活させる必要はありません。Knowledge BasesはSpacesへの移行として維持します。Sparkはシラバスに名前が残っていても、終了告知を無視して現行の新規作成機能として説明しません。', '',
  ...[...legacyIds].map(id=>{const q=active.find(q=>q.id===id);return `- \`${id}\`：${q.sourceIds.map(id=>sourceById.get(id)).filter(s=>/sunset|spark/.test(s.id)).map(s=>`[${s.title}](${s.url})`).join('、')}`;}), '',
  '## シラバスとの関係と問題の配分', '',
  '6ドメイン・14学習目標すべてに現行の出題があります。ただし、目標IDがあることは各小項目の十分な出題や実試験と同じ構成を証明しません。問題バンクの比率はD1が少なくD2が多い状態です。重み付き出題で調整する構成と、バンク自体の配分は分けて評価します。今回、増問・削除・分類変更は行っていません。', '',
  '| ドメイン | 通常出題対象 | バンク内の割合 | 公式の目安 |', '|---|---:|---:|---:|',
  ...result.domainCoverage.map(d=>`| ${d.id.toUpperCase()} ${d.title} | ${d.eligible} | ${d.eligibleSharePct}% | ${d.officialWeightRange.join('〜')}% |`), '',
  '一般のテスト・品質・実装用語を尋ねる問題も残っています。以下10問は関連する補助知識として整理しました。公式ガイドの開発生産性・テスト・品質等には関係しますが、Copilot固有機能の理解を直接測る度合いは低めです。「公式仕様に反する問題」の件数とは分けています。Copilot機能だけを問う方針を厳格に適用するなら、次の編集対象です。', '',
  ...[...supportIds].map(id=>{const q=active.find(q=>q.id===id);return `- \`${id}\`：${q.question}`;}), '',
  '## 出典と検証の限界', '',
  ...result.limitations.map(s=>`- ${s}`), '',
  '既存の83出典は取得できました。取得時のURL・HTTP結果・HTMLハッシュをJSONに記録し、出典ごとの内容確認メモも紐づけています。個別の指摘には追加の直接資料と日付付き告知を付けています。HTTP取得の成功を、全設問の内容や歴史的正確性の自動合格に置き換えてはいません。', '',
  '## 修正の順番', '',
  '1. F01を通常出題から外し、正解と設問から見直す。詳細解説だけの警告では誤採点が残る。',
  '2. F02の150文字の誤記を直す。',
  '3. F05〜F10の6問で、問題文・短い解説・詳細解説の断定の強さをそろえる。',
  '4. F03・F04は、8月7日時点のみの教材にするか、現行追加機能も含む教材にするかに応じて分離・時点注記する。誤答として反転しない。',
  '5. 修正後に変更された全項目の根拠、採点、通常出題可否、画面表示を再確認する。', '',
  '## 現行254問の点検台帳', '',
  '以下の「追加不整合を特定せず」は、今回の内容照合で新しい問題を見つけなかったという結果です。8月7日時点の詳細仕様をすべて復元できたという合格表示ではありません。全選択肢・各解説・ハッシュ・出典別メモ・日時付き根拠の有無は同名JSONに保存しています。', '',
  '| 問題ID | 難易度 | 登録目標 | 判定／指摘 |', '|---|---|---|---|',
  ...questions.map(q=>`| ${q.id} | ${level[q.difficulty]} | ${q.objectiveId} | ${label[q.assessment]}${q.findingIds.length?'（'+q.findingIds.join('・')+'）':''} |`), '',
].join('\n');
const reportBase='reports/official-alignment-audit-2026-10-18';
const json=JSON.stringify(result,null,2)+'\n';
if(process.argv.includes('--check')) {
  assert.equal(fs.readFileSync(reportBase+'.json','utf8'),json,'JSON report is stale');
  assert.equal(fs.readFileSync(reportBase+'.md','utf8'),md,'Markdown report is stale');
} else {
  fs.writeFileSync(reportBase+'.json',json);
  fs.writeFileSync(reportBase+'.md',md);
}
console.log(JSON.stringify({report:reportBase,counts:result.counts,checks:'254 unique current IDs, 1016 choices and choice explanations, 253 exact runtime explanation bindings, 83 sources with editorial notes; content unchanged. Structural verification only.'},null,2));
