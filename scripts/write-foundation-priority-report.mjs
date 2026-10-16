import fs from 'node:fs';
import {loadFoundationPriority,validateFoundationPriority} from './foundation-priority-review.mjs';
const dir='content/gh300/2026-08-07/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const ledger=loadFoundationPriority(),bank=read(dir+'questions/seed.json'),exclusions=read(dir+'questions/selection-exclusions.json');
const errors=validateFoundationPriority(bank,exclusions,ledger);if(errors.length)throw Error(errors.join('\n'));
const retired=new Set(exclusions.questions.map(q=>q.id)),active=bank.filter(q=>!retired.has(q.id)),basic=active.filter(q=>q.difficulty==='beginner');
const verificationPath='reports/foundation-priority-verification-2026-10-17.json';
const verification=fs.existsSync(verificationPath)?read(verificationPath):null;
const pos=(q,id)=>'ABCD'[q.choices.findIndex(c=>c.id===id)];
const lines=['# 優先概念を補うオリジナル基礎問題の反映（2026-10-17）','',
 '比較レポートで優先した7概念群を、10問のオリジナル基礎問題で補った。CLIは導入・認証・生成と保存の3問、IDEは対応確認・サインインの2問に分けた。残りは購読管理API、cloud agent、Plan、NES、Mobileである。外部サイトの問題文・選択肢は使用していない。','',
 '**重複した基礎10問を新規演習から外し、新IDの10問へ置き換えた。演習対象の基礎162問、応用48問、本番相当43問、各Domainの出題在庫数は維持した。** 旧IDの問題文・正答・分類を上書きせず、履歴は旧概念として残す。用語集のbasicQuestionIdを持つ問題は置き換えていない。','',
 '## 反映内容','',
 '| 新問題ID | テーマ | 置き換えた旧ID | Objective |','| --- | --- | --- | --- |',
 ...ledger.questions.map(r=>`| ${r.id} | ${r.title} | ${r.oldId} | ${r.after.objectiveId} |`),'',
 '高優先のCLI・購読管理・cloud agentと、中優先のPlan・NES・対応環境、低優先のMobileまで今回の対象に含めた。サンプルデータ生成、責任あるAI原則の補足、/fix等の追加改稿、要レビューq11の承認は今回の優先項目への反映と分け、変更していない。','',
 '## 問題数と履歴','',
 '| 項目 | 変更前 | 変更後 |','| --- | ---: | ---: |',
 `| 保存問題数（旧問題を含む） | ${ledger.baseline.stored} | ${bank.length} |`,
 `| 新規演習用資産（要レビューを含む） | ${ledger.baseline.nonRetired} | ${active.length} |`,
 `| 実際の演習対象（verified） | ${ledger.baseline.eligible} | ${active.filter(q=>q.status==='verified').length} |`,
 `| 基礎資産（要レビューを含む） | ${ledger.baseline.byLevel.beginner} | ${basic.length} |`,
 `| 実際の基礎演習対象 | ${ledger.baseline.eligibleFoundation} | ${basic.filter(q=>q.status==='verified').length} |`,
 `| 退役保存資産 | ${exclusions.questions.length-10} | ${exclusions.questions.length} |`,'',
 '保存数が増えるのは旧10問を履歴用に残したためで、出題対象の純増ではない。既存395問の指紋はすべて一致する。q11はneeds-reviewのため、新規演習には引き続き出さない。','',
 '| Domain | 変更前の現行資産 | 変更後 |','| --- | ---: | ---: |',
 ...Object.entries(ledger.baseline.byDomain).map(([d,n])=>`| ${d.toUpperCase()} | ${n} | ${active.filter(q=>q.domainId===d).length} |`),'',
 'D2内でのObjective配分は、重複したPrompt Files・局所編集・IDE Agentの識別から、未充足だったCLI・購読管理等へ移った。Domain全体の配分は変えていない。','',
 '## 品質レビューの意味','',
 '- サイトと同じ学習段階の、単一機能・操作・用途を識別する基礎にした。応用の多段階切り分けは要求しない。',
 '- 選択肢は現行の機能・操作・資料を中心にそろえ、無関係な課金・GPU等を誤答に置かない。正答だけを長文・安全・包括的にする構成を避けた。',
 '- 各誤答の不適合理由と、同じ選択肢で別の答えになる条件変更を再読して記録した。Askでも計画を相談できる点、コード補完が使えても他のIDE機能まで同じではない点を明記した。',
 '- 正答の表示位置は置換前の各問題と一致させ、基礎全体の位置分布を維持した。10問だけを切り出した表示位置はA3・B1・C4・D2で、これを均等分布の保証とは呼ばない。',
 '- これは同じ著者による編集レビュー。本文を隠した受験者による実験、正答率での難度校正、実試験との等価性検証はしていない。名称の識別問題は、機能を既に知る人なら短時間で解けることが基礎として適切である。','',
 '## 公式情報の照合','',
 'GitHub Docs、VS Code公式Docsを2026-10-17に確認した。問題ごとのSource IDとURLは下記へ併記した。旧gh-copilotの導入を現行の正答にしない。Mobile Docsに残る旧Extensionsの段落は根拠に使わない。PlanやNES、Mobileという固有名詞が必ず実試験へ出るとは断定しない。','',
 '## 全10問の個別レビュー',''];
for(const row of ledger.questions){
 const q=row.after,v=row.review;
 lines.push(`### ${row.title}（${row.id}）`,'',q.question,'',...q.choices.map(c=>`- ${pos(q,c.id)}：${c.text}${q.answer.includes(c.id)?' **【正答】**':''}`),'',
 '**選択肢単体**：'+v.blindRationale,'','**難度**：'+v.difficultyEvidence,'',
 '**決定条件**：'+v.clues.map(c=>`「${c}」`).join('、'),'','**誤答の分析**：','',
 ...q.choices.filter(c=>!q.answer.includes(c.id)).map(c=>`- ${pos(q,c.id)}：${q.choiceExplanations[c.id]}`),'',
 `**条件変更**：${v.counterfactual.condition}は${pos(q,v.counterfactual.answerId)}へ変わる。${v.counterfactual.reason}`,'',
 `**文字長**：正答${v.lengths.correct}文字／誤答中央値${v.lengths.medianWrong}文字＝${v.lengths.ratio.toFixed(2)}倍。正答表示位置${v.lengths.position}。`,'',
 `**重複整理**：${row.retirementReason} 維持した基礎：${row.retainedIds.join('、')}。`,'',
 '出典：'+v.sourceEvidence.map(s=>`[${s.sourceId}](${s.url})`).join('、'),'');
}
lines.push('## 検証','',
 '過去のベースラインを今回の完成品で上書きせず、新規の初期状態とレビュー台帳を追加した。旧台帳の検査は新しい履歴境界の整合性を検証したうえで、当時の在庫へ戻して行う。未レビューの改変や旧問題の書き換えでは失敗する。','',
 ...(verification?[
 `- 単体テスト：${verification.unit.passed}件（${verification.unit.files}ファイル）成功。`,
 '- 型チェック：成功。',
 `- 本番ビルド：${verification.build.command}で成功。`,
 `- E2E：${verification.e2e.passed}件成功。デスクトップ・モバイルの各環境で10問すべてを通常クリックで回答し、誤答を含む採点、個別解説、再読込後の保存、横幅、旧問題のブックマーク除外を確認。既存の演習・模試フローも確認。`,
 '- 台帳・用語対応・分類・品質の整合検査に成功。',
 `- 問題バンクの正規化SHA-256：\`${verification.bankFingerprint}\`。`]:['検証結果は確認後に同名verification JSONへ記録する。']),
 '', '今回の変更はローカルへの反映。Gitへのcommit・pushやデプロイは行っていない。','');
fs.writeFileSync('reports/foundation-priority-2026-10-17.md',lines.join('\n').trimEnd()+'\n');
console.log('Wrote Foundation priority report for 10 reviewed replacements.');
