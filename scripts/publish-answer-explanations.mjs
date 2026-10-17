import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { explanations } from './answer-explanation-texts-2026-10-17.mjs';
import { sourceChecks } from './answer-explanation-source-review.mjs';

const directory = 'content/gh300/2026-08-07/questions/';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const write = (path, value) => fs.writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
const seed = read(directory + 'seed.json');
const excluded = new Set([...read(directory + 'selection-exclusions.json').questions,
  ...read(directory + 'removals.json').questions].map(q => q.id));
const eligible = seed.filter(q => !excluded.has(q.id) && q.status === 'verified');
const reportPath = 'reports/answer-explanation-review-2026-10-17.json';
const previous = fs.existsSync(reportPath) ? read(reportPath) : null;
if (eligible.length !== 253 || Object.keys(explanations).length !== 253 ||
  eligible.some(q => !explanations[q.id]) || Object.keys(explanations).some(id => !eligible.some(q => q.id === id))) {
  throw Error('Explanation scope does not match the 253 reviewed questions');
}
if (previous && previous.baselineSeedFingerprint !== hash(seed)) throw Error('Question bank changed since explanation review');
const pilotIds = ['q02', 'q-d2-a17-ms-20261017', 'q-d3-a19-feature-20261016',
  'q-d3-a17-ms-20261017', 'q-d2-e02-feature-20261016', 'q-d2-e21-ms-20261017'];
// Match semantics as well as identity, so saved sessions with other wording do not get an unrelated explanation.
const contract = q => JSON.stringify({ question: q.question, choices: q.choices, answer: q.answer,
  difficulty: q.difficulty, sourceIds: q.sourceIds, status: q.status });
const rows = eligible.map(q => {
  const text = explanations[q.id];
  if (text === q.explanation || !text.endsWith('。')) throw Error('Unfinished explanation: ' + q.id);
  const sentences = text.match(/[^。]+。/g) ?? [];
  const paragraphs = sentences.length >= 4 ? [sentences.slice(0, 2).join(''), sentences.slice(2).join('')] : [text];
  return { id: q.id, contract: contract(q), text: paragraphs.join('\n\n') };
});
const sources = read('content/gh300/2026-08-07/sources.json');
const report = {
  reviewedAt: '2026-10-17', revision: 'answer-explanations-2026-10-17', baselineSeedFingerprint: hash(seed),
  scope: { total: eligible.length, beginner: 162, intermediate: 48, advanced: 43, multiSelect: eligible.filter(q => q.answer.length === 2).length },
  method: '編集者が各問の本文・正答・選択肢解説を照合し、機能の意味、条件への当てはめ、結論を個別に執筆。文字数や定型句の自動追加による品質認定ではない。仕様依存事項を公式Docsで確認。学習者による理解度の実測は未実施。',
  pilotIds,
  sourceReviewScope: '詳細化で使う仕様依存事項の主な照合記録。登録された全URLの到達性・更新日を独立監査する処理ではなく、全253問の事実認定でもない。既存のsourceIdsや最終検証日は変更しない。',
  sourceChecks: sourceChecks.map(row=>({ ...row, checkedAt: '2026-10-17', urls: row.sourceIds.map(id=>sources.find(s=>s.id===id).url) })),
  implementation: '過去の採点・品質台帳を保持するため、詳細解説を別の版付き教材として保存。画面のWhy this is correctだけで利用し、設問内容と選択肢が一致する場合に適用する。旧スナップショットへ異なる設問の解説を付けない。',
  unchanged: ['問題文', '選択肢本文・表示順', '正解ID', '選択肢ごとの短い解説', '難易度', 'Domain・Objective', '出題数', '過去の回答履歴', '過去の品質・難易度台帳'],
  issues: [{ id: 'q-d5-e08-feature-20261016-ms-20261017', status: 'QUESTION_REVISION_REQUIRED',
    finding: '現行公式Docsでは、PRで過去に使用したreview effortがrepo既定値より優先する。またDeepという深度名は現行の設定と一致しない。既存の正答と現行仕様に不整合がある。',
    disposition: '問題文・正解は今回の範囲外として変更せず、詳細解説には不整合と現行の優先規則を明記。問題自体の修正が必要。全253問を仕様検証済みとは認定しない。',
    urls: [sources.find(s => s.id === 'code-review').url, sources.find(s => s.id === 'feature-refresh-review-config').url] }],
  questions: eligible.map(q => ({ id: q.id, difficulty: q.difficulty, question: q.question,
    choices: q.choices, answer: q.answer, choiceExplanations: q.choiceExplanations,
    before: q.explanation, after: rows.find(row => row.id === q.id).text, baselineFingerprint: hash(q),
    sourceUrls: q.sourceIds.map(id => sources.find(s => s.id === id).url),
    editorialStatus: q.id === 'q-d5-e08-feature-20261016-ms-20261017' ? 'QUESTION_REVISION_REQUIRED' : 'EDITORIAL_REVIEWED',
  })),
};
write(directory + 'answer-explanations.json', { revision: report.revision, questions: rows });
write(reportPath, report);
const labels = { beginner: '基礎', intermediate: '応用', advanced: '高難度' };
const median = values => values.slice().sort((a,b) => a-b)[Math.floor(values.length/2)];
const lines = ['# 正解解説253問の詳細化', '', `確認日：${report.reviewedAt}`, '', report.method, '',
  '## 対象と変更', '', '基礎162問・応用48問・高難度43問。先行6問は各難易度の単一選択・複数選択から選定。', '',
  'Why this is correctは、機能の仕組み、今回の条件の意味、結論を説明する。選択肢別の短い解説は維持し、Key Cluesは復活させない。', '',
  '## 文字数の変化', '', '| 難易度 | 問題数 | 修正前の中央値 | 修正後の中央値 |', '|---|---:|---:|---:|'];
for (const difficulty of Object.keys(labels)) {
  const qs = report.questions.filter(q => q.difficulty === difficulty);
  lines.push(`| ${labels[difficulty]} | ${qs.length} | ${median(qs.map(q=>q.before.length))} | ${median(qs.map(q=>q.after.replaceAll('\n','').length))} |`);
}
lines.push('', '文字数は結果の記録であり、品質の合否基準ではない。', '', '## 問題自体の見直しが必要な項目', '');
for (const issue of report.issues) lines.push(`- **${issue.id}**：${issue.finding} ${issue.disposition}`, ...issue.urls.map(url=>`  - [公式資料](${url})`));
lines.push('', '## 保存・適用方法', '', report.implementation, '', '## 公式資料での照合', '', report.sourceReviewScope, '');
for (const row of report.sourceChecks) lines.push(`- ${row.finding}`, ...[...row.urls,...(row.supplementaryUrls??[])].map(url=>`  - [公式資料](${url})`));
lines.push('', '## 検証結果', '', '[検証記録](answer-explanation-verification-2026-10-17.json)に単体・画面テストと型チェックの結果を記録。自動チェックは表示・採点・データ不変条件の検証であり、解説内容の正確性を自動認定するものではない。', '', '## 全件の確認記録', '',
  '各問の修正前後・全選択肢・正解・元データの指紋は同名JSONにも保存。以下は個別に執筆した修正後の解説。', '');
for (const q of report.questions) lines.push(`### ${q.id}（${labels[q.difficulty]}）`, '', q.question, '',
  `正解：${q.answer.map(id => 'ABCD'[q.choices.findIndex(c => c.id === id)]).sort().join('・')}`, '', q.after, '',
  ...q.sourceUrls.map(url => `- [登録されている公式資料](${url})`), '');
fs.writeFileSync(reportPath.replace('.json','.md'), lines.join('\n'));
console.log(JSON.stringify({ ...report.scope, issues: report.issues.length, rawSeedUnchanged: true }));
