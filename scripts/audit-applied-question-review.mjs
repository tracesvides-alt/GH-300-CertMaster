import fs from 'node:fs';
import {reviewMultiSelectLayer} from './multi-select-review.mjs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = new URL('../', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, root), 'utf8'));
const fingerprint = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Verifies the scope and freshness of a human/editorial decision, not semantics.
// Any new Applied question or text change needs another actual editorial review.
export function validateAppliedReview(bank, report) {
  const layer=reviewMultiSelectLayer(bank);bank=layer.bank;
  const errors = [...layer.errors];
  const reviewed = new Map(report.questions.map(row => [row.id, row]));
  if (reviewed.size !== report.questions.length) errors.push('Duplicate review ID');
  for (const q of bank.filter(q => q.difficulty === 'intermediate')) {
    if (!reviewed.has(q.id)) errors.push(`Unreviewed Applied question: ${q.id}`);
  }
  for (const row of report.questions) {
    const q = bank.find(q => q.id === row.id);
    if (!q || row.fingerprint !== fingerprint(q) || fingerprint(row.after) !== row.fingerprint) {
      errors.push(`Stale Applied review: ${row.id}`);
      continue;
    }
    const fromExam = row.before.difficulty === 'advanced' && row.reviewType === 'reclassified-from-exam' &&
      row.classificationChange?.from === 'advanced' && row.classificationChange?.to === 'intermediate' &&
      row.classificationChange?.reason?.trim() && q.difficulty === 'intermediate' &&
      q.cognitiveLevel === 'apply' && q.examLike === false;
    if ((row.before.difficulty !== 'intermediate' && !fromExam) || row.before.id !== row.id) errors.push(`Invalid baseline: ${row.id}`);
    if (JSON.stringify(row.before.answer) !== JSON.stringify(q.answer)) errors.push(`Changed answer identity: ${row.id}`);
    if (q.difficulty !== row.difficulty || q.status !== 'verified') errors.push(`Unresolved classification: ${row.id}`);
    if (!row.decisiveCondition || !row.assessment || !row.optionOnlyReview) errors.push(`Missing editorial decision: ${row.id}`);
    if (q.difficulty === 'intermediate' && (!['apply','analyze'].includes(q.cognitiveLevel) ||
        new Set(row.reasoningSteps).size < 2 || !row.counterfactual)) errors.push(`Missing application analysis: ${row.id}`);
    const wrong = q.choices.filter(c => !q.answer.includes(c.id));
    if (wrong.length !== row.wrongChoiceAnalysis.length || wrong.some(c =>
      !row.wrongChoiceAnalysis.some(r => r.id === c.id && r.text === c.text && r.whyWrong === q.choiceExplanations[c.id]))) {
      errors.push(`Incomplete choice analysis: ${row.id}`);
    }
  }
  return errors;
}

function render(report) {
  const s = report.summary;
  const lines = ['# 応用編 全件レビューと難易度判定', '', `初回レビュー日：${report.reviewedAt}。最新更新：${report.lastUpdated ?? report.reviewedAt}`, '',
    ...(report.selectionSummary ? [`保存済み応用は${report.selectionSummary.totalStoredApplied}問、新規出題の応用は${report.selectionSummary.activeApplied}問。${report.selectionSummary.retiredApplied}問を出題対象外として保持している。以下の累計台帳は保存資産の記録であり、対象外を現在の合格数に含めない。`, ''] : []),
    ...(report.followUpReviews?.length ? ['## 追加の見直し', '',
      ...report.followUpReviews.map(r => `- ${r.reviewedAt}：${r.questionIds.join('、')}を追加レビュー。詳細：[レビュー記録](${r.report.split('/').pop().replace(/\.json$/,'.md')})。`), '',
      '以下の改稿数は初回レビューと追加改稿の累計。追加レビューは記載した対象だけであり、全問題の意味的な品質が独立検証済みであることは意味しない。', ''] : []),
    `台帳の対象は${s.reviewed}問（既存${s.existing}問・追加${s.added}問）。${s.reclassifiedFromExam ? `当初の応用102問に、難易度を見直して本番相当から移管した${s.reclassifiedFromExam}問を含む。` : ''}本文・四つの選択肢・正答・個別解説を各レビュー時点で参照した。`, '',
    `初回判定の内訳は、応用として${s.rewritten}問を改稿、${s.retained}問を維持、${s.reclassified}問を基礎へ再分類。初回比較の文面修正は${s.textRewritten}問。以後の改稿・再評価は上記の追加レビューに記録し、この初回内訳を現在の改稿総数とは扱わない。保存済み応用は${s.appliedAfter}問、新規出題の応用は${report.selectionSummary?.activeApplied ?? s.appliedAfter}問。`, '',
    '## 難易度の判定', '',
    '変更前のままで全問を応用と呼ぶのは適切ではなかった。特に追加問題には、正答だけが安全・丁寧で、他の選択肢が隠蔽・無検証・無関係な操作になっているものがあった。長い事例や専門語だけでは応用に分類しない。', '',
    '| 分類 | 必要な判断 |', '| --- | --- |',
    '| 基礎 | 定義・原則・機能・操作の識別 |',
    '| 応用 | 具体的な失敗・入力・ログ・契約に知識を当てはめ、対策や期待値を選ぶ |',
    '| 試験相当の分析問題 | 複数の証拠、処理段階、未検証条件を比較して原因や最小変更を導く |', '',
    `現在の出題対象${report.selectionSummary?.activeApplied ?? s.appliedAfter}問は応用の入口から中程度を狙っている。基礎知識を理解した人が短時間で解ける問題も含む。本文の対象・時点・契約で選択肢を区別することを設計目標とするが、編集評価だけで全問の本文なし推測を排除したとは断定しない。`, '',
    '## 修正した問題の作り方', '',
    '- 既知の失敗入力、型・APIの契約、待受ポート、レート制限応答など、判断に必要な条件を本文へ置いた。',
    '- 誤答は別の状況では候補になる対策や、境界値・対象範囲・時点を取り違えた案に置き換えた。',
    '- 正答だけが長い問題を再調整し、本文の期待値を写すだけの設問も境界判定や仕様からの計算へ変更した。',
    '- 類似していた削除確認・除外反映の設問は、dry-runの再検証と重なる除外ルールの設定元判定へ分けた。',
    '- 未公開のデバウンス実装、固定の文脈順位、温度設定をCopilot全体の確定仕様として説明しない。待機時間や文脈予算は設問で与えた架空の条件として扱う。', '',
    '再分類後にD3の正答表示が一位置へ偏ったため、q-d3-a08の表示順を調整した。正答IDは維持し、表示順だけの変更は文面修正数に含めない。', '',
    '## 公式情報との照合', '',
    '- [パスごとの指示](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)：全階層のテストには `**/*.test.ts` の対象指定を使い、共通指示との重複も解消する。',
    '- [個人指示](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-personal-instructions)：GitHub.com上の個人指示の例と、リポジトリ別の方針を区別する。IDEの個人指示と同一視しない。',
    '- [GitHub REST APIの再試行](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)：Retry-Afterがある場合の待機指示を適用する。任意のCopilot API全体へ一律の再試行仕様を断定しない。',
    '- [契約の更新履歴](https://github.com/customer-terms/updates)、[Generative AI Services Terms](https://github.com/customer-terms/github-generative-ai-services-terms)：古いBlock設定だけで補償を判定する問題を、対象機能・適用契約・現行のRequired Mitigationsを照合する問題へ変更。実際の補償成立をこの設問だけで保証しない。', '',
    `## 基礎へ戻した${s.reclassified}問`, '',
    ...report.questions.filter(r => r.difficulty === 'beginner').map(r => `- ${r.id}：${r.assessment}`), '',
    `## 全${report.questions.length}問の判定一覧`, '',
    '| ID | 区分 | 判定 | 現在の難易度 | 判定理由 |', '| --- | --- | --- | --- | --- |',
    ...report.questions.map(r => `| ${r.id} | ${r.added?'追加':'既存'} | ${r.selectionState==='retired'?'出題対象外':r.decision} | ${r.difficulty==='intermediate'?'応用':'基礎'} | ${r.assessment.replaceAll('|','／')} |`), '',
    '## 全問の本文・選択肢・誤答の根拠', '',
    '以下は改稿後を含む二回目の読み直しの記録。問題ごとの変更前の全文は対応するJSONレポートのbeforeに保存している。', ''];
  for (const row of report.questions) {
    const q = row.after;
    lines.push(`### ${row.id} — ${row.decision}`, '', q.question, '',
      ...q.choices.map(c => `- ${c.id}：${c.text}`), '',
      `正答：${q.answer.join(', ')}。${q.explanation}`, '',
      ...row.wrongChoiceAnalysis.map(r => `- ${r.id}が不適合な理由：${r.whyWrong}`), '',
      ...row.reasoningSteps.map((r,i) => `${i+1}. ${r}`), '',
      ...(row.counterfactual ? [`条件を変えた場合：${row.counterfactual}`, ''] : []));
  }
  lines.push('## 検証と限界', '',
    ...(report.verification ? [`検証結果：テスト${report.verification.testsPassed}件成功、型チェック・ビルド・応用網羅検査・全体の品質／難易度監査・選択肢監査が成功。追加した公式出典${report.verification.sourcesChecked}件はHTTP 200で題名または文書見出しも一致した。`, '',
      '模試配分テストは固定値0.5を返し続ける乱数から、100個の再現可能な乱数系列での重み付き抽選の検査へ修正した。問題数・重複なし・Verified限定・Domain配分を各回確認し、難易度の比率は100回平均で確認する。抽選の重みは毎回の難易度比率を保証する固定枠ではない。', ''] : []),
    '問題IDと正答IDは維持した。保存済みの履歴との対応は残るが、改稿前の正答率を新しい文面の難易度の実測値と解釈しない。架空の数値・ログ・契約は公式試験の引用ではない。', '',
    '同じ編集者が全問を再読した編集評価である。学習者の正答率、回答時間、識別力、実試験との等価性は未測定。自動チェックは網羅・変更後の指紋・参照・解説・記録の整合性を確認するもので、欄が埋まっていることや点数だけで内容の意味的品質を証明しない。', '',
    '今後の追加・変更は新規レビューが必要。applied:syncは既存のレビュー済み問題を上書きせず、新規インポートはneeds-reviewとして扱い、品質確認のPASSを自動付与しない。', '');
  return lines.join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bank = read('content/gh300/2026-08-07/questions/seed.json');
  const report = read('reports/applied-question-quality-review.json');
  const errors = validateAppliedReview(bank, report);
  if (errors.length) throw Error(errors.join('\n'));
  if (!process.argv.includes('--check')) fs.writeFileSync(new URL('reports/applied-question-quality-review.md',root), render(report));
  console.log(JSON.stringify({historicalInitialReview:report.summary,currentSelection:report.selectionSummary,reviewedAssets:report.questions.length}));
}
