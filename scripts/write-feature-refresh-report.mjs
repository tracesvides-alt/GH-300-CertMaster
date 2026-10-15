import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const r=read('reports/copilot-feature-refresh-2026-10-16.json');
const bank=read('content/gh300/2026-08-07/questions/seed.json');
const excluded=new Set(read('content/gh300/2026-08-07/questions/selection-exclusions.json').questions.map(q=>q.id));
const active=bank.filter(q=>!excluded.has(q.id));
const syllabus=read('content/gh300/2026-08-07/syllabus.json');
const sourceRegistry=read('content/gh300/2026-08-07/sources.json');
const previous=read('reports/copilot-feature-only-review-2026-10-15.json');
const levels=['beginner','intermediate','advanced'],names={beginner:'基礎',intermediate:'応用',advanced:'本番相当'};
const esc=s=>String(s).replaceAll('|','／').replaceAll('\n',' ');
const label=(q,id)=>'ABCD'[q.choices.findIndex(c=>c.id===id)];
const pct=(n,total)=>(100*n/total).toFixed(1)+'%';
const unit=fs.readFileSync('artifacts/feature-refresh-vitest.log','utf8');
const browser=fs.readFileSync('artifacts/feature-refresh-e2e.log','utf8');
const sample=JSON.parse(unit.match(/FEATURE_REFRESH_MOCK_SAMPLE (\{[^\r\n]+\})/)[1]);
const sources=read('reports/feature-refresh-source-verification-2026-10-16.json');
if(/(?:Test Files|Tests)\s+\d+ failed/.test(unit)||!/\n\s*50 passed \(/.test(browser)||/\n\s*\d+ failed\s*(?:\r?\n|$)/.test(browser)||sources.results.some(s=>s.errors.length))throw Error('Verification incomplete; refusing to publish a successful report');
const verification={date:r.date,unitTestsPassed:Number(unit.match(/Tests\s+(\d+) passed/)[1]),e2eTestsPassed:Number(browser.match(/\n\s*(\d+) passed \(/)[1]),mockSample:sample,sourcesChecked:sources.results.length,sourceFailures:sources.results.filter(s=>s.errors.length).map(s=>({id:s.id,errors:s.errors})),build:'Next.js production build using Webpack, isolated .next-e2e. Default Turbopack failed to start a PostCSS worker in the sandbox.',semantics:'Automated tests verify structure and behavior. Blind solvability and difficulty remain editorial judgments, without independent reviewers or learner measurements.'};
fs.writeFileSync('reports/feature-refresh-verification-2026-10-16.json',JSON.stringify(verification,null,2)+'\n');
const out=['# Copilot機能限定への問題見直し（2026年10月16日）','',
 '## 実施結果','',
 '**対象121問は72問を全面改稿し、49問を統合・新規出題から除外した。** 別管理のCLI除外の前提誤り1問も全面改稿したため、新IDで採用した問題は73問。維持候補25問も再読し、抽象的な一般論・重複・基礎寄りだった7問を追加統合した。残る維持候補18問は文面を保持した。','',
 '一般のテストデータ選択、計算、品質管理だけで解ける旧問題を、新しい演習へ戻さない。旧問題322件の内容は変更せず、除外台帳と新IDによって履歴を分離した。旧問題の記録は保存済み模試と回答履歴のために残す。','',
 '**計画との差分：121枠を同数の新問で埋める目標は達成していない。** 49案は独立した応用・本番相当としての難度や重複解消が不十分であり、採用しなかった。統合先は近い学習判断への案内であり、破棄した全論点を完全に試験できるという主張ではない。数合わせの追加や、比率を守るための無理な分類はしていない。','',
 '## 問題数・分類の変化','',
 '| 区分 | 変更前の出題在庫 | 変更後の出題在庫 |','| --- | ---: | ---: |',
 ...levels.map(l=>`| ${names[l]} | ${r.inventoryBefore.levels[l]} | ${r.inventoryAfter.levels[l]} |`),
 `| 合計 | ${r.inventoryBefore.active} | ${r.inventoryAfter.active} |`,'',
 `保存総数${r.inventoryAfter.stored}問、旧問として除外${r.inventoryAfter.retired}問。現行${r.inventoryAfter.active}問のうち、以前から要レビューの基礎q11を除く${r.inventoryAfter.eligible}問が通常のVerified演習に利用できる。`,'',
 '| Domain | 変更前 | 変更後 | 変更後の割合 | 基礎 | 応用 | 本番相当 | シラバス範囲 |','| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |',
 ...syllabus.domains.map(d=>`| ${d.id.toUpperCase()} | ${r.inventoryBefore.domains[d.id]} | ${r.inventoryAfter.domains[d.id]} | ${pct(r.inventoryAfter.domains[d.id],active.length)} | ${levels.map(l=>r.inventoryAfter.byLevelAndDomain[l][d.id]).join(' | ')} | ${d.min}–${d.max}% |`),'',
 '**在庫比率はシラバスに合っていない。D1が少なく、D2が多い。** 「機能の操作を問う」という制約によってD2等へ分類が寄るためであり、在庫が均等・適切になったとは評価しない。シラバスの範囲は[Microsoft Learn GH-300 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)を参照。','',
 '一方、模試の抽選は在庫比率とは別にシラバス配分で行う。現行在庫で50問模試を100シード検証し、全回で50問・重複なし・Verifiedのみ・ドメイン範囲内となった。出題重みを調整し、基礎の混入を減らした。','',
 `平均は基礎${sample.meanByLevel.beginner}問、応用${sample.meanByLevel.intermediate}問、本番相当${sample.meanByLevel.advanced}問。Domainごとの最小～最大は${sample.domainMin.map((n,i)=>`D${i+1}: ${n}～${sample.domainMax[i]}問`).join('、')}。これは100回の検証結果であり、難度別の固定割当保証ではない。少ない在庫のDomainは再出題されやすい。`,'',
 '## 現行Objectiveの在庫','',
 '| Objective | 基礎 | 応用 | 本番相当 |','| --- | ---: | ---: | ---: |',
 ...syllabus.domains.flatMap(d=>d.objectives).map(o=>`| ${o.id}: ${esc(o.title)} | ${levels.map(l=>active.filter(q=>q.objectiveId===o.id&&q.difficulty===l&&q.status==='verified').length).join(' | ')} |`),'',
 '0件の層があるObjectiveも残る。Domain配分の抽選成功は、各Objective・機能・難易度の網羅性を保証しない。','',
 '## レビュー方法と評価の範囲','',
 '122案（121候補＋前提修正1案）を作成し、本文と正答キーを外した選択肢一覧を別に読んだ。その後、条件依存性・正答の一意性・誤答の機能範囲・日本語・基礎との重複を再読した。再読で落とした49案の本文と理由はJSONのrejectedDraftsに保存している。採用73問についても、常に安全そうな案だけが目立つ誤答、架空の設定効果、本文が答えを先に述べる表現を修正した。','',
 '本番相当は機能の適用範囲、設定元、入力経路、実行状態等の複数条件を照合する設計。応用は具体的な状態と機能操作を結び付ける設計。下記の各問へ推論と条件変更の検証を記した。設問の長さや推論欄の行数だけで難度を認定したものではない。','',
 '**評価は著者による編集レビュー。独立した評価者のブラインド試験、学習者の正答率・識別力測定、実試験との難度等価性の検証は行っていない。** PASSやplausibility値は編集上の判断であり、自動テストが本文なし推測の不可能性を証明したという意味ではない。応用・本番相当にはそれぞれ入口～中程度を含み、全問が同じ難度ではない。','',
 '文字長はUnicode文字数で、従来台帳との整合のため「正答／誤答3件の中央値」を記録した。以下には「正答／4選択肢の中央値」も併記する。文字長を揃えること自体は品質保証にしない。','',
 '## 履歴・画面・検証','',
 '- 全面改稿した問題は新IDを使用。旧正答は新版の習熟に加算せず、旧誤答は現在の弱点統計や新規の誤答復習へ使わない。混同ペアは現行問題の誤答記録から再集計し、旧版の回数や回復状態を引き継がない。保存済みの旧記録自体は消さない。旧ブックマークを黙って新版へ付け替えない。',
 '- 旧問題の回答・解説は履歴で閲覧でき、「旧版・新規出題の対象外」の表示と、関連する現行問題を解くボタンを付けた。保存済み模試は旧問のスナップショットと正答で再開・終了できる。',
 '- 長い選択肢でラジオボタンの幅が縮み、スマートフォンで選択できなくなる不具合を修正。入力の幅を保ち、長い単語を折り返し、固定ヘッダーと下部ナビに配慮したスクロール余白を設定した。',
 `- 単体テスト${verification.unitTestsPassed}件、PC・スマートフォン相当の画面テスト${verification.e2eTestsPassed}件が通過。新73問すべてを各端末で出題・採点し、誤答も含む回答をIndexedDBへ保存・再読した。`,
 `- 採用問題が使う公式ソース${verification.sourcesChecked}件をHTTP・タイトル・転送先で確認。確認結果はfeature-refresh-source-verification-2026-10-16.json。リンク確認は内容の正誤判定を代替しない。`,
 '- TypeScript、品質台帳、難易度台帳、分類、応用・本番相当レビュー、旧台帳との整合を検証。基礎の正解位置には以前からの警告3件が残る。本番相当D2のD位置4/13（30.8%）も、整数配分による警告として残る。',
 '- 検証用の独立した.next-e2eでNext.jsの本番ビルドを実施。Turbopackはサンドボックス内のPostCSSワーカー起動に失敗したため、公式のWebpack選択肢でビルドと画面テストを完了。標準のnpm run build（Turbopack）の成功とは扱わない。',
 '- この変更はローカルへの反映。commit・push・公開デプロイは行っていない。','',
 '## 対象121問の採否','',
 '| 旧ID | 判断 | 現行の参照先ID | 理由・独立性 |','| --- | --- | --- | --- |',
 ...r.decisions.map(d=>`| ${d.oldId} | ${d.decision==='REPLACED'?'全面改稿':'統合・除外'} | ${d.destinationId} | ${esc(d.reason)} |`),'',
 '## 維持候補25問と別管理1問','',
 '| ID | 判断 | 理由・現在の機能判断 |','| --- | --- | --- |',
 ...r.keptConsolidations.map(d=>`| ${d.oldId} | 統合 → ${d.destinationId} | ${esc(d.reason)} |`),
 ...previous.questions.filter(q=>q.decision==='K'&&!excluded.has(q.id)).map(q=>`| ${q.id} | 維持 | ${esc(q.reason)} |`),
 '| q-d6-e07 | 全面改稿 → q-d6-e07-feature-20261016 | CLIがContent Exclusionに対応するという前提を撤回し、CLIのローカル読取とMCPの両方のツール供給範囲を問う。 |','',
 '## 採用73問の個別レビュー',''];
for(const row of r.questions){
 const q=row.after,v=row.review,cf=v.counterfactual;
 const lengths=q.choices.map(c=>Array.from(c.text).length).sort((a,b)=>a-b),median=(lengths[1]+lengths[2])/2;
 out.push(`### ${q.id}: ${q.testedConcepts[0]}`,'',
 `- **区分・分類**: ${names[q.difficulty]}／${q.domainId.toUpperCase()}／${q.objectiveId}。旧ID: ${row.oldId}`,`- **出題形式**: ${v.format}`,`- **問題文**: ${q.question}`,'',
 '| 表示位置 | 選択肢 | 正誤・根拠 |','| --- | --- | --- |',
 ...q.choices.map((c,i)=>`| ${'ABCD'[i]} | ${esc(c.text)} | ${q.answer.includes(c.id)?'正解':'誤答'}：${esc(q.choiceExplanations[c.id])} |`),'',
 `- **① ブラインドチェック**: 編集レビューで採用。${v.blindRationale}`,
 `- **② 多段階推論**: 分析: ${v.reasoningSteps[0]} 照合: ${v.reasoningSteps[1]} 結論: ${v.reasoningSteps[2]}`,
 `- **③ 条件変更**: 「${cf.from}」を「${cf.to}」へ変更すると、正解は表示位置${label(q,cf.answerId)}へ変わる。${cf.rationale}`,
 `- **④ 根拠フレーズ**: ${v.clues.map(c=>'「'+c+'」').join('、')}`,
 '- **⑤ 誤答分析**: 上表の誤答3件に、範囲・時点・機能の取り違えを記載。',
 `- **⑥ 文字長・位置**: 正答${v.lengths.correct}文字／誤答中央値${v.lengths.medianWrong}文字＝${v.lengths.ratio.toFixed(2)}倍。4選択肢中央値${median}文字との比は${(v.lengths.correct/median).toFixed(2)}倍。正答の表示位置${v.lengths.position}。`,
 `- **難易度・重複判定**: ${v.difficultyAssessment} ${v.distinction}`,
 `- **公式根拠（2026-10-16確認）**: ${v.sourceEvidence.map(s=>`[${sourceRegistry.find(x=>x.id===s.sourceId)?.title??s.sourceId}](${s.url})`).join('、')}`,'');
}
fs.writeFileSync('reports/copilot-feature-refresh-2026-10-16.md',out.join('\n').trimEnd()+'\n');
console.log(JSON.stringify({sections:r.questions.length,verification,retainedCandidateRows:previous.questions.filter(q=>q.decision==='K'&&!excluded.has(q.id)).length}));
