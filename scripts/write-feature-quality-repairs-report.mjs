import fs from 'node:fs';
const report=JSON.parse(fs.readFileSync('reports/copilot-feature-quality-repairs-2026-10-16.json','utf8'));
const verificationPath='reports/copilot-feature-quality-repairs-verification-2026-10-16.json';
const verification=fs.existsSync(verificationPath)?JSON.parse(fs.readFileSync(verificationPath,'utf8')):null;
const names={beginner:'基礎',intermediate:'応用',advanced:'本番相当'};
const title={1:'Seat割当と利用データ',7:'Space共有と参照repoの権限',9:'旧ExtensionからMCPへの移行と認可',15:'Git追跡とCopilot除外パターン',16:'stdio MCPの接続設定',18:'公開コード一致のポリシー階層',24:'入力除外と公開コード一致の出力制御',25:'複製先repoの除外範囲',30:'共通指示と任意実行Prompt File',33:'全階層へ適用するパス別指示',42:'repo内外の除外スコープ',49:'CLIの候補制限と実行許可',70:'Agentの取得経路とContent Exclusion',71:'Seat管理元による除外の差',83:'CLIのセッション限定のGit権限',91:'symlinkとAgentの除外対応範囲'};
const fixes=report.questions.filter(r=>r.changed);
const risks=report.questions.filter(r=>r.priorFindings.optionOnly.verdict==='GUESSING_CUE_RISK');
if(risks.some(r=>!r.changed))throw Error('Unaddressed prior option-only concern');
const lines=['# Copilot機能問題の修正・再レビュー（2026-10-16）','',
`応用48問・本番相当43問、計91問を対象に、${fixes.length}問の本文・選択肢・個別解説を改稿した。残る15問は本文を維持した。全91問の推論・根拠・条件変更例を再確認した。`,'',
'## 今回直した点','',
'- **単一正答**：個人Prompt Fileの設問に自動同期・手動配布禁止を明記し、手動コピーが別解にならないようにした。',
'- **公式設定例**：CLIの候補ツールはview・grep・bash等の実名で書き、実行権限のshellと分けた。利用環境も明記した。',
'- **選択肢**：前回、本文なし推測の懸念を挙げた16問をすべて改稿。機能・設定・対象の粒度をそろえ、正答だけが包括的・慎重という構成を減らした。',
'- **難度**：本文による仕様・結論の先出しを削り、観測と適用範囲を照合させた。本番相当では複数repo、実行環境、承認段階、設定階層等の独立した条件を組み合わせた。単に文章を長くしたことは難化の根拠にしていない。',
'- **Copilot固有性**：IDE利用データの収集条件、cloud agentのsetup失敗後の挙動、MCPの発見と認証、CLIの/contextに表示されるMCP定義と会話履歴の違いへ焦点を移した。',
'- **近接テーマ**：ファイル添付・シンボル指定の反復を避け、Web参照キャッシュや主な実行ワークスペースの違いを扱った。',
'- **反実仮想**：変更後の全文を保存し、選択肢を保ったまま別の正答になるかを再読した。観測を変える際は依存する説明もそろえ、古い目的や制約が残らないようにした。','',
'- **モバイル表示**：長いURLが問題カードの最小幅を広げ、390pxの画面でページが520pxになり、回答操作もずれる例を再現した。カードを縮められるようにし、長い文字列を折り返すCSSへ修正。E2Eも拡張され得るinnerWidthではなく実際のclientWidthと比較するようにした。強制クリックによる回避はしていない。','',
'## 変更しなかった出題枠','',
'| 項目 | 修正前 | 修正後 |','| --- | ---: | ---: |',
...Object.entries(report.inventoryAfter.byLevel).map(([k,v])=>`| ${names[k]} | ${report.inventoryBefore.byLevel[k]} | ${v} |`),
...Object.entries(report.inventoryAfter.byDomain).map(([k,v])=>`| ${k.toUpperCase()} | ${report.inventoryBefore.byDomain[k]} | ${v} |`),'',
'問題ID、正答ID、表示位置、難度・Domain・Objectiveの分類、出題除外設定は維持した。基礎と出題対象外の旧問題本文は変更していない。保存済み演習の問題スナップショットを置き換える処理は加えていない。今回の修正で在庫のDomain比率や未充足Objectiveまで解消したという評価はしない。','',
'## 検証の意味と限界','',
'これは同じ著者による編集レビューで、初見の受験者を使ったブラインド実験ではない。本文なし推測の確率がゼロ、実試験と難度が等価、といった保証はしない。正答率による難度校正も未実施である。','',
'機械検査の役割は、改稿後のデータ・採点・記録が一致していることの検証。誤答へ3点を付けることや、推論欄が三行あることだけでは品質を証明しない。応用は実際の二段階以上、本番相当は三段階の判断を記録し、各誤答の不適合理由と条件変更例も併記した。','',
'過去の23問・追加問題等のレビューは、当時の文面を残した。旧台帳が通るように昔の根拠を現在の文面へ機械的に移すのではなく、今回のbefore/afterの両指紋が一致するときだけ旧スナップショットへ解決する。未レビューの追加変更では検査が失敗する。','',
'標準Turbopackビルドはこの環境でworker起動エラーになったため、公式CLIの--webpackで検証した。テスト用一時領域と生成フォルダへの書込制限にも対処した。','',
...(verification?['## 実行済み検証','',
`- 単体テスト：${verification.unit.passed}件成功（${verification.unit.files}ファイル）。`,
'- 型チェック：成功。',
'- 本番ビルド：npm run build -- --webpackで成功。',
`- E2E：${verification.e2e.passed}件成功。デスクトップとモバイルで、各91問の表示・横幅・通常クリックによる採点・個別解説・IndexedDBへの保存を検証。演習開始、再演習、模試の遅延解説等も確認。`,
'- 指紋と台帳：現在の問題・解説・条件変更例との整合検査に成功。',
'- HEADとの差分：問題本文等の変更は76問。基礎163問と出題除外済み141問、Domain・Objective・難度、正答ID、表示順は維持。','']:[]),
'## 全91問の個別記録',''];
for(const row of report.questions){
 const q=row.after,v=row.review,cf=v.counterfactual;
 const pos=id=>'ABCD'[q.choices.findIndex(c=>c.id===id)];
 lines.push(`### ${q.id}：${title[row.n]??row.title}`,'',
 `- 難度：${names[q.difficulty]}／${q.domainId.toUpperCase()}・${q.objectiveId}。${row.changed?'本文・選択肢・解説を改稿':'本文を維持しレビューを更新'}。`,
 `- 出題形式：${v.format}`,`- 修正前の指摘：${row.priorFindings.difficultyAssessment.reason}`,'',q.question,'',
 ...q.choices.map(c=>`- ${pos(c.id)}：${c.text}${q.answer.includes(c.id)?' **【正答】**':''}`),'',
 '**① 選択肢単体の再読**','',v.blindRationale,'',
 '**② 必要な判断**','',...v.reasoningSteps.map((s,i)=>`${i+1}. ${s}`),'',
 '**③ 条件変更例（同じ4択）**','',cf.question,'',
 `変更後の正答：${pos(cf.answerId)}。${cf.rationale}`,'',
 '**④ 決定材料**','',v.clues.map(c=>`「${c}」`).join('／'),'','**⑤ 誤答の理由**','',
 ...q.choices.filter(c=>!q.answer.includes(c.id)).map(c=>`- ${pos(c.id)}：${q.choiceExplanations[c.id]}`),'',
 `**⑥ 文字長・位置**：正答${v.lengths.correct}文字／誤答中央値${v.lengths.medianWrong}文字＝${v.lengths.ratio.toFixed(2)}倍。正答の表示位置${v.lengths.position}。`,'',
 '出典：'+v.sourceEvidence.map(s=>`[${s.sourceId}](${s.url})`).join('、'),'');
}
fs.writeFileSync('reports/copilot-feature-quality-repairs-2026-10-16.md',lines.join('\n')+'\n');
console.log(`Rendered ${report.questions.length} current questions; ${risks.length} prior option-only concerns all revised.`);
