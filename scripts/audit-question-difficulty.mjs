import fs from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const read = path => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8'));
const bank = read('content/gh300/2026-08-07/questions/seed.json');
const review = read('content/gh300/2026-08-07/questions/difficulty-review.json');
const baseline = read('reports/question-difficulty-baseline.json');
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
    beforeDifficulty: before.difficulty, difficulty: q.difficulty, rewritten,
    reclassified: before.difficulty !== q.difficulty, assessment: r.assessment,
    reasoningSteps: r.reasoningSteps, counterfactual: r.counterfactual,
    beforeQuestion: before.question, question: q.question, fingerprint: r.fingerprint };
});
const count = (items, key) => Object.fromEntries(Object.keys(names).map(d => [d, items.filter(r => r[key] === d).length]));
const summary = { total: rows.length, rewritten: rows.filter(r => r.rewritten).length,
  reclassified: rows.filter(r => r.reclassified).length,
  before: count(rows, 'beforeDifficulty'), after: count(rows, 'difficulty'),
  rewritesByOriginalDifficulty: count(rows.filter(r => r.rewritten), 'beforeDifficulty'),
  transitions: Object.fromEntries(Object.keys(names).map(d => [d, count(rows.filter(r => r.beforeDifficulty === d), 'difficulty')])) };
const result = { generatedAt: review.reviewedAt, baselineCommit: baseline.commit, summary,
  methodology: review.method, secondPass: review.secondPass,
  measuredLearnerDifficulty: false, independentReviewer: false, realExamEquivalenceValidated: false, questions: rows };
if (!process.argv.includes('--check')) {
  fs.writeFileSync(new URL('reports/question-difficulty-audit.json', root), JSON.stringify(result, null, 2) + '\n');
  const lines = ['# GH-300 全200問の難易度再評価', '',
    '## 結論', '',
    '従来の難易度は適切とは言えなかった。Foundationの基本知識確認は維持できる一方、Appliedには操作の記憶問題、Examには長い状況説明を付けただけの機能名識別が含まれていた。選択肢のもっともらしさと、解答に必要な思考の深さは別に評価する必要がある。', '',
    `全${summary.total}問の本文・4選択肢・解説を参照し、${summary.rewritten}問を実質改稿、${summary.reclassified}問を下位へ再分類した。総数と正答IDは維持。表示順だけの変更は改稿数に含めない。`, '',
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
  lines.push('## 全200問の評価台帳', '',
    '| ID | 元の難易度 | 現在 | 文面 | 評価理由・必要な判断 |', '| --- | --- | --- | --- | --- |',
    ...rows.map(r => `| ${r.id} | ${names[r.beforeDifficulty]} | ${names[r.difficulty]} | ${r.rewritten ? '改稿' : '維持'} | ${r.assessment.replaceAll('|', '／')} |`), '',
    '## 検証方法と限界', '',
    '全200問の初回の難易度評価に続き、改稿90問の本文・全選択肢を別パスで再読した。単位の誤記、計測指標の分母、明らかに無関係な通信対策の選択肢などを追加修正した。同じ編集者のレビューであり、独立した別人による評価ではない。', '',
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
