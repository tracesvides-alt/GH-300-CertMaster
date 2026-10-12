import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { questionIssues } from '../lib/question-quality.ts';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const dir = 'content/gh300/2026-08-07/';
const bank=read(dir+'questions/seed.json');
const terms=read(dir+'glossary/terms.json');
const ledger=read(dir+'questions/quality-review.json').questions;
const qs=bank.filter(q=>q.difficulty==='beginner');
const failures=[];
const inventory=qs.map(q=>{
  const review=ledger[q.id];
  const fingerprint=createHash('sha256').update(JSON.stringify(q)).digest('hex');
  if(!review||review.fingerprint!==fingerprint)failures.push(q.id+': missing/stale review');
  failures.push(...questionIssues(q,review).filter(i=>i.severity==='failure').map(i=>q.id+': '+i.rule));
  return {questionId:q.id,termIds:terms.filter(t=>t.basicQuestionId===q.id).map(t=>t.id),
    status:q.status,question:q.question,choices:q.choices,answer:q.answer,
    revised:q.contentRevision==='foundation-review-2026-10-12',
    discriminator:q.explanation,distractorReasons:q.choiceExplanations,review};
});
const coverage=terms.map(t=>({termId:t.id,term:t.term,questionId:t.basicQuestionId,
  status:bank.find(q=>q.id===t.basicQuestionId)?.status??'missing'}));
for(const t of coverage)if(t.status==='missing')failures.push(t.termId+': no question');
const report={reviewedAt:'2026-10-12',method:'基礎全問の本文・全選択肢・解説を再読して記録した編集レビューを、指紋と対応関係で検証する。生成時の採点から合否を推論しない。',
  summary:{terms:terms.length,foundationQuestions:qs.length,revised:inventory.filter(q=>q.revised).length,
    missingTerms:coverage.filter(t=>t.status==='missing').length,needsReviewTerms:coverage.filter(t=>t.status==='needs-review').map(t=>t.termId),failures},coverage,inventory};
fs.writeFileSync('reports/foundation-glossary-quality-review.json',JSON.stringify(report,null,2)+'\n');
const esc=s=>s.replaceAll('|','／').replaceAll('\n',' ');
const lines=['# 用語集と基礎問題の全件品質レビュー','','## 結果','',
  `用語 ${terms.length} 件すべてに異なる基礎問題が対応。基礎 ${qs.length} 問を全件レビューし、${report.summary.revised} 問を改稿。未対応用語 ${report.summary.missingTerms} 件。`,
  '基礎問題として、名称・役割・単一条件の識別は残しています。選択肢だけを見て正答の長さ、良い行動、旧機能ラベル、無関係な誤答から選べる構図は修正しました。',
  '同義の別解、MCP Clientとの間接的な対応、旧CLIの現行誤認、一律ゼロ保持、完全な決定性、ローカル限定という断定も修正しました。','',
  '## 留保','',
  'g-exclusion-limitations → q11はneeds-reviewを維持。IDE Agentでの除外対応の確認を問う内容として整えましたが、教材の関連する利用面の公式資料間の相違を未解決のままverifiedへ変更していません。',
  '本文なし判別・唯一正解性は編集判断です。受験者へ問題文を隠して回答させる実測や正答率による難易度校正は行っていません。','',
  '## 用語と基礎問題の対応（全件）','','| 用語ID | 用語 | 基礎問題 | 状態 |','| --- | --- | --- | --- |',
  ...coverage.map(t=>`| ${t.termId} | ${esc(t.term)} | ${t.questionId} | ${t.status} |`),'',
  '## 問題レビュー（全件）','','| 問題 | 対応用語 | 改稿 | 本文で必要な判断 |','| --- | --- | --- | --- |',
  ...inventory.map(q=>`| ${q.questionId} | ${q.termIds.join(', ')||'補助問題'} | ${q.revised?'修正':'維持'} | ${esc(q.discriminator)} |`),'',
  '各選択肢の誤りの理由とレビュー根拠は同名JSONに記載しています。','',
  '## 再検査','',
  '`npm run glossary:coverage:strict`、`node scripts/audit-foundation-glossary.mjs`、`npm run quality:check` で対応、レビュー指紋、選択肢根拠を検査します。基礎問題も品質ゲートの対象へ追加しました。同期スクリプトは既存のレビュー済み問題を保持し、新規生成はneeds-reviewのまま登録します。','',
  '## 公式情報の確認','',
  '- [旧gh-copilot終了告知](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)と[現行CLI](https://docs.github.com/en/copilot/get-started/cli-quickstart)を分けて確認。旧コマンドは歴史問題として明示。',
  '- [ツール許可](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)と[モデルホスティング](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)から、実行承認・保持条件の無条件断定を修正。',''];
fs.writeFileSync('reports/foundation-glossary-quality-review.md',lines.join('\n').trimEnd()+'\n');
console.log(JSON.stringify(report.summary));
if(failures.length)process.exitCode=1;
