import fs from 'node:fs';
import { createHash } from 'node:crypto';
import {loadQuestionAdditions,validateQuestionAdditions,combinedDifficultyBaseline,loadFeatureRefresh} from './question-additions.mjs';
import {loadFoundationPriority} from './foundation-priority-review.mjs';
const root = new URL('../', import.meta.url);
const read = path => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8'));
const bank = read('content/gh300/2026-08-07/questions/seed.json');
const retiredIds = new Set(read('content/gh300/2026-08-07/questions/selection-exclusions.json').questions.map(q => q.id));
const review = read('content/gh300/2026-08-07/questions/difficulty-review.json');
const additions = loadQuestionAdditions(root);
const additionErrors = validateQuestionAdditions(bank, additions);
if (additionErrors.length) throw Error(additionErrors.join('\n'));
const baseline = combinedDifficultyBaseline(read('reports/question-difficulty-baseline.json'), additions);
const additionIds = new Set([...(additions?.questions.map(r => r.id) ?? []),...(loadFeatureRefresh()?.questions.map(r=>r.id)??[]),...(loadFoundationPriority()?.questions.map(r=>r.id)??[])]);
const names = { beginner: 'Foundation', intermediate: 'Applied', advanced: 'Exam' };
const fingerprint = q => createHash('sha256').update(JSON.stringify(q)).digest('hex');
// Display-order changes do not count as editorial rewrites in this audit.
const textContent = q => JSON.stringify({ question: q.question,
  choices: [...q.choices].sort((a,b) => a.id.localeCompare(b.id)),
  explanation: q.explanation, choiceExplanations: q.choiceExplanations });
if (review.status !== 'reviewed') throw Error('Difficulty review has not been signed off.');
if (Object.keys(review.questions).length !== bank.length || baseline.questions.length !== bank.length) throw Error('Incomplete inventory.');
const rows = bank.map(q => {
  const r = review.questions[q.id];
  const before = baseline.questions.find(b => b.id === q.id);
  if (!r || !before || r.fingerprint !== fingerprint(q) || r.difficulty !== q.difficulty) throw Error(`Stale difficulty review: ${q.id}`);
  if (!r.assessment || !r.reasoningSteps?.length) throw Error(`Missing reasoning: ${q.id}`);
  if (q.difficulty === 'advanced' && (q.cognitiveLevel !== 'analyze' || r.reasoningSteps.length < 2 || !r.counterfactual)) throw Error(`Missing Exam analysis: ${q.id}`);
  if (q.examLike !== (q.difficulty === 'advanced')) throw Error(`Incorrect difficulty badge: ${q.id}`);
  if (q.examLike && (!q.clues?.length || q.clues.some(c => !q.question.includes(c)))) throw Error(`Stale clue: ${q.id}`);
  const rewritten = textContent(before) !== textContent(q);
  if (rewritten !== r.textRewritten) throw Error(`Unrecorded rewrite: ${q.id}`);
  if (before.difficulty !== r.beforeDifficulty) throw Error(`Baseline label mismatch: ${q.id}`);
  if (JSON.stringify(before.answer) !== JSON.stringify(q.answer)) throw Error(`Answer ID changed: ${q.id}`);
  return { id: q.id, domainId: q.domainId, objectiveId: q.objectiveId,
    origin: additionIds.has(q.id) ? 'new-addition' : 'historical',
    beforeDifficulty: additionIds.has(q.id) ? null : before.difficulty, difficulty: q.difficulty, rewritten,
    reclassified: !additionIds.has(q.id) && before.difficulty !== q.difficulty, assessment: r.assessment,
    reasoningSteps: r.reasoningSteps, counterfactual: r.counterfactual,
    beforeQuestion: before.question, question: q.question, fingerprint: r.fingerprint };
});
const count = (items, key) => Object.fromEntries(Object.keys(names).map(d => [d, items.filter(r => r[key] === d).length]));
const summary = { total: rows.length, added: additionIds.size, historicalTotal: rows.length - additionIds.size, rewritten: rows.filter(r => r.rewritten).length,
  reclassified: rows.filter(r => r.reclassified).length,
  before: count(rows, 'beforeDifficulty'), after: count(rows, 'difficulty'),
  rewritesByOriginalDifficulty: count(rows.filter(r => r.rewritten), 'beforeDifficulty'),
  transitions: Object.fromEntries(Object.keys(names).map(d => [d, count(rows.filter(r => r.beforeDifficulty === d), 'difficulty')])) };
const activeRows = rows.filter(q => !retiredIds.has(q.id));
const result = { generatedAt: review.lastUpdated ?? review.reviewedAt, baselineCommit: baseline.commit, summary,
  selectionSummary: { active: activeRows.length, retired: retiredIds.size, after: count(activeRows, 'difficulty') },
  followUpReviews: review.followUpReviews ?? [],
  methodology: review.method, secondPass: review.secondPass,
  measuredLearnerDifficulty: false, independentReviewer: false, realExamEquivalenceValidated: false, questions: rows };
if (!process.argv.includes('--check')) {
  fs.writeFileSync(new URL('reports/question-difficulty-audit.json', root), JSON.stringify(result, null, 2) + '\n');
  const lines = [`# GH-300 全${summary.total}問の難易度台帳`, '',
    `保存資産${summary.total}問の台帳。新規出題は${activeRows.length}問で、${retiredIds.size}問を対象外とする。以下の過去比較は保存資産の累計で、対象外を現行の合格問題として数えない。`, '',
    `新規${additionIds.size}問は独立した追加台帳から読み込み、変更前の件数と難易度遷移には含めない。固定された過去のベースラインファイルは維持する。`, '',
    '## 結論', '',
    '従来の難易度は適切とは言えなかった。Foundationの基本知識確認は維持できる一方、Appliedには操作の記憶問題、Examには長い状況説明を付けただけの機能名識別が含まれていた。選択肢のもっともらしさと、解答に必要な思考の深さは別に評価する必要がある。', '',
    `各レビューの累計で、全${summary.total}問の台帳に${summary.rewritten}問の実質改稿、${summary.reclassified}問の下位への再分類を記録した。総数と正答IDは維持。表示順だけの変更は改稿数に含めない。`, '',
    ...(review.followUpReviews?.length ? ['## 追加レビューの履歴', '', ...review.followUpReviews.map(r => `- ${r.reviewedAt}：${r.questionIds.join('、')}。[記録](${r.report.split('/').pop().replace(/\.json$/,'.md')})。`), '', '履歴の各対象を追加評価しており、現在の全問を毎回新たに意味的再評価したという主張ではない。', ''] : []),
    '| 難易度 | 変更前 | 変更後 | 判断基準 |', '| --- | ---: | ---: | --- |',
    `| Foundation | ${summary.before.beginner} | ${summary.after.beginner} | 用語・機能・原則・操作の識別 |`,
    `| Applied | ${summary.before.intermediate} | ${summary.after.intermediate} | 具体的な入力・不具合・用途へ知識を適用 |`,
    `| Exam | ${summary.before.advanced} | ${summary.after.advanced} | 証拠や処理段階を比較し、原因・未検証条件・最小変更を導く |`, '',
    '## 何を難しくしたか', '',
    '- 文の長さ、専門用語の多さ、選択肢へ付けた点数を難易度の根拠にしない。',
    '- Appliedでは具体的な期待値、モックの境界、移行時の互換性などを選ばせる。',
    '- Examではログ・設定・契約・検証結果の関係を読み取る。各問に二段階以上の判断と、条件を変えたとき別の判断になる反例を記録した。',
    '- 共有シナリオに属するという理由だけでExamにしない。用途識別の問題はFoundationへ戻した。',
    '- 元の20/40/40という問題数の比率は維持しない。低難度問題を比率合わせのために昇格させない。', '',
    '## 再分類の内訳', '',
    '| 変更前 → 変更後 | Foundation | Applied | Exam |', '| --- | ---: | ---: | ---: |',
    ...Object.entries(summary.transitions).map(([d,v]) => `| ${names[d]} | ${v.beginner} | ${v.intermediate} | ${v.advanced} |`), '',
    '## 代表例の変更前後', ''];
  for (const id of ['q-d2-a08','q-d2-e04','q-d4-e02','q01','q-d5-a01','q-d5-a08','q-d1-e01','q-d2-e06','q-d3-e02','q-d5-e01','q-d6-e05','q-sc09-1']) {
    const r = rows.find(q => q.id === id);
    lines.push(`### ${id}: ${names[r.beforeDifficulty]} → ${names[r.difficulty]}`, '',
      `変更前: ${r.beforeQuestion}`, '', `変更後: ${r.question}`, '',
      `評価: ${r.assessment}`, '', ...(r.counterfactual ? [`条件を変えた場合: ${r.counterfactual}`, ''] : []));
  }
  lines.push(`## 全${summary.total}問の評価台帳`, '',
    '| ID | 元の難易度 | 現在 | 文面 | 評価理由・必要な判断 |', '| --- | --- | --- | --- | --- |',
    ...rows.map(r => `| ${r.id} | ${r.origin==='new-addition'?'新規':names[r.beforeDifficulty]} | ${names[r.difficulty]} | ${r.origin==='new-addition'?'新規追加':r.rewritten ? '改稿' : '維持'} | ${r.assessment.replaceAll('|', '／')} |`), '',
    '## 検証方法と限界', '',
    '初回の難易度評価と、その後の対象別の追加レビューを累積した台帳。同じ編集者の判断であり、独立した別人による評価ではない。現在の内容指紋と分類の一致は検証するが、その検査だけで意味的品質を証明しない。', '',
    'この評価は問題が要求する認知操作の分類である。実際の学習者の正答率・解答時間・識別力は未測定で、実試験と同じ難しさだとは断定できない。Foundationは正しく理解した学習者には易しくてよい。Examも全問を難問にするのではなく、基礎知識だけの問題と区別する。', '',
    '自動検査は内容指紋、分類、根拠、回答ID、回答後のヒント、全件網羅を確認する。根拠欄の存在やテスト成功だけで設問の意味的品質を証明するものではない。問題を変更したら再読して台帳を更新する。', '',
    '共通シナリオの文脈・問題IDと保存済み解答との対応は維持した。ただし、文面を改稿した問題の過去の正答率は改稿前の成績であり、新問の実測難易度として解釈しない。', '',
    '## 参照した公式資料', '',
    '- [責任ある補完の利用](https://docs.github.com/en/copilot/responsible-use/inline-suggestions): 生成出力の限界と検証の原則。',
    '- [CLIのツール権限](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools): 利用可能ツールと実行許可、拒否の優先。',
    '- [ネットワークエラーの調査](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors): プロキシと証明書の診断。',
    '- [Content Exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion): モード・シンボリックリンクなどの適用限界。',
    '- [MCP Tools仕様](https://modelcontextprotocol.io/specification/2025-11-25/server/tools): 入力検証、認可、実行エラーとプロトコルエラー。',
    '- [生成テストの作成](https://docs.github.com/en/copilot/tutorials/write-tests)、[Vitestタイマー](https://vitest.dev/guide/mocking/timers)、[fast-check](https://fast-check.dev/docs/introduction/): テストの設計と制御。',
    '- [モデルのホスティング](https://docs.github.com/en/enterprise-cloud%40latest/copilot/reference/ai-models/model-hosting): Business/Enterpriseの学習利用の扱い。', '',
    '数値・ログ・コード片・社内基準は学習用に作成した架空事例であり、公式資料からの引用や実際のGitHub試験問題ではない。各問の出典は原則・機能の根拠であり、架空事例そのものの出典ではない。', '');
  fs.writeFileSync(new URL('reports/question-difficulty-audit.md', root), lines.join('\n'));
}
console.log(JSON.stringify(summary));
