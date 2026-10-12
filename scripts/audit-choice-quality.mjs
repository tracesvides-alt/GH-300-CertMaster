import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const bankPath = 'content/gh300/2026-08-07/questions/seed.json';
const read = path => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8'));
const bank = read(bankPath);
const editorial = read('content/gh300/2026-08-07/questions/quality-review.json');
const baseline = read('reports/question-choice-baseline.json');
const previous = JSON.parse(execFileSync('git', ['show', `HEAD:${bankPath}`], { encoding: 'utf8' }));
const previousById = new Map(previous.map(q => [q.id, q]));
const unchangedReasons = {
  q10: 'モック・スタブ・実環境・画面検証の目的が異なり、通信と引数確認の条件が必要。',
  'q-d2-a08': '四つの設定キーはいずれもMCP関連の語で、VS Code設定という条件が必要。',
  'q-d2-a12': '候補の全体採用・部分採用・閉じる操作の組合せは設問の要求が必要。',
  'q-d2-a13': '候補切替・全体採用・閉じる・単語採用の区別に設問が必要。',
  'q-d2-a14': '説明・編集・Agent・レビューの目的が異なり、変更しない条件が必要。',
  'q-d2-a17': 'MCPのResource/Tool/Promptの組合せは提供対象の種類を読まないと決まらない。',
  'q-d6-a02': '参照表示・ブロック・Secret Scanning・入力除外の各動作は設問の設定が必要。',
  'q-sc09-1': '満足度・デリバリー・受容・座席の指標はそれぞれ有用で、測りたい側面が必要。',
  'q-sc10-2': '参照先・依存ライセンス・CodeQL・今後のBlockは目的が異なり、今回の通知が必要。',
};
const samples = {
  intermediate: 'q01 q-d1-a02 q-d1-a09 q-d2-a07 q-d2-a20 q-d3-a05 q-d3-a10 q-d4-a07 q-d5-a01 q-d6-a03'.split(' '),
  advanced: 'q-d1-e01 q-d1-e03 q-d1-e05 q-d1-e07 q-d1-e08 q-sc03-1 q-sc07-1 q-d2-e02 q-d2-e07 q-d2-e04 q-d2-e06 q-d2-e11 q-d3-e04 q-d4-e01 q-d4-e04 q-d5-e01 q-d5-e03 q-d6-e01 q-sc09-1 q-sc10-2'.split(' '),
};
const sampleClues = {
  q01: '月末だけ失敗', 'q-d1-a02': 'SQL文字列の連結', 'q-d1-a09': '型・業務回帰・セキュリティの三領域',
  'q-d2-a07': '現在のスキーマ、利用者別権限、任意SQL禁止', 'q-d2-a20': '最新、利用者権限、更新不要',
  'q-d3-a05': '社内プロキシ経由だけ失敗、原因未特定', 'q-d3-a10': '旧会話と添付の版が双方疑わしい',
  'q-d4-a07': '一致例と拒否例の両方', 'q-d5-a01': '外部課金なしで成功・残高不足を検証',
  'q-d6-a03': 'Chat送信前とGit Push時の二経路',
  'q-d1-e01': '存在しない依存パッケージ', 'q-d1-e03': '高負荷時だけデッドロック',
  'q-d1-e05': 'キーボードと読み上げが双方欠落', 'q-d1-e07': 'ピーク負荷とノード停止が未確認',
  'q-d1-e08': '全社品質と開発者負担をともに評価', 'q-sc03-1': 'Issueは担当別、メトリクスは読取のみ',
  'q-sc07-1': '担当製品別の閲覧と更新禁止', 'q-d2-e02': '現在値、担当者別残高、送金禁止',
  'q-d2-e07': '状態と直近ログのみ、任意操作禁止', 'q-d2-e04': '外部API実行ではなく資料共有',
  'q-d2-e06': '危険操作の実行前承認', 'q-d2-e11': '文書ごとに利用者の閲覧権限が違う',
  'q-d3-e04': 'Agent/Editでの除外対応範囲', 'q-d4-e01': '七段階の結合と例外処理漏れ',
  'q-d4-e04': '検索ノイズがあるが依存ファイルは必要', 'q-d5-e01': '実時間待機がCIで不安定',
  'q-d5-e03': '多様な入出金列の不変条件', 'q-d6-e01': '別リポジトリ経由、利用モードの対応制約',
  'q-sc09-1': '活動指標では疲労と集中が測れない', 'q-sc10-2': '今回の一致通知を判断し、今後の設定は別',
};
const category = {
  'partial-match': 'PARTIAL_MATCH', 'wrong-scope': 'PARTIAL_MATCH',
  'common-confusion': 'COMMON_CONFUSION', 'wrong-mechanism': 'SAME_DOMAIN_WEAK',
  'wrong-use-case': 'SAME_DOMAIN_WEAK',
};
const avg = values => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
const pct = (a, b) => b ? +(a * 100 / b).toFixed(1) : 0;
const editorialContent = q => JSON.stringify({ question: q.question, choices: q.choices, explanation: q.explanation, choiceExplanations: q.choiceExplanations });
const changed = new Set(bank.filter(q => editorialContent(q) !== editorialContent(previousById.get(q.id))).map(q => q.id));
const distractorsReplaced = bank.reduce((total, q) => {
  const original = previousById.get(q.id);
  return total + q.choices.filter(c => !q.answer.includes(c.id) && c.text !== original.choices.find(old => old.id === c.id)?.text).length;
}, 0);

const inventory = bank.map(q => {
  const review = editorial.questions[q.id];
  if (!review || review.fingerprint !== createHash('sha256').update(JSON.stringify(q)).digest('hex')) throw Error(`Stage 2 review is absent or stale: ${q.id}`);
  if (review.answerWithoutReading || review.multipleAnswerRisk) throw Error(`Unresolved semantic review: ${q.id}`);
  const answer = q.answer[0];
  const options = q.choices.map(c => {
    const correct = c.id === answer;
    const quality = q.choiceQuality?.[c.id];
    return {
      id: c.id, text: c.text, correct,
      plausibility: correct ? 4 : quality?.plausibility ?? 0,
      category: correct ? 'CORRECT' : category[quality?.distractorType] ?? 'SAME_DOMAIN_WEAK',
      explanation: q.choiceExplanations?.[c.id] ?? '', sourceIds: quality?.sourceIds ?? q.sourceIds,
    };
  });
  const wrong = options.filter(o => !o.correct);
  const medianWrongLength = wrong.map(o => o.text.length).sort((a, b) => a - b)[1];
  const answerLength = options.find(o => o.correct).text.length;
  const lengthBias = answerLength > Math.max(30, medianWrongLength * 1.5) || answerLength < medianWrongLength * .5;
  const missingExplanation = options.some(o => !o.explanation.trim());
  const relevance = Math.round(25 * avg(wrong.map(o => o.category === 'PARTIAL_MATCH' || o.category === 'COMMON_CONFUSION' ? 1 : .7)));
  const plausibility = Math.round(25 * avg(wrong.map(o => o.plausibility / 3)));
  const uniqueness = review.multipleAnswerRisk === false ? 20 : 0;
  const symmetry = lengthBias ? 3 : 10;
  const scenario = review.answerWithoutReading === false ? 10 : 0;
  const explanations = missingExplanation ? 0 : 10;
  const score = relevance + plausibility + uniqueness + symmetry + scenario + explanations;
  return {
    questionId: q.id, domainId: q.domainId, objectiveId: q.objectiveId, difficulty: q.difficulty,
    examLike: q.examLike ?? false, cognitiveLevel: q.cognitiveLevel ?? null,
    question: q.question, options, choices: q.choices, correctAnswer: q.answer,
    choiceExplanations: q.choiceExplanations, testedConcepts: q.testedConcepts ?? [],
    answer, sourceIds: q.sourceIds, status: q.status,
    modified: changed.has(q.id), optionOnly: 'PASS',
    optionOnlyReason: changed.has(q.id) ? '同じ作業領域の選択肢に改稿し、設問条件で区別する。' : unchangedReasons[q.id],
    multipleAnswerRisk: false, lengthBias, missingExplanation, score,
    scoreBreakdown: { relevance, plausibility, uniqueness, symmetry, scenario, explanations },
    requirementMapping: q.requirementMapping ?? [],
  };
});
if (inventory.some(q => !q.optionOnlyReason)) throw Error('An unchanged question lacks an explicit option-only assessment.');

const summarize = group => {
  const wrong = group.flatMap(q => q.options.filter(o => !o.correct));
  return {
    count: group.length,
    modified: group.filter(q => q.modified).length,
    optionOnlyFailures: group.filter(q => q.optionOnly !== 'PASS').length,
    unreviewed: group.filter(q => !q.optionOnlyReason).length,
    multipleAnswerRisks: group.filter(q => q.multipleAnswerRisk).length,
    lengthBiases: group.filter(q => q.lengthBias).length,
    missingExplanations: group.filter(q => q.missingExplanation).length,
    averagePlausibleDistractors: +avg(group.map(q => q.options.filter(o => !o.correct && o.plausibility >= 2).length)).toFixed(2),
    strongDistractorRate: pct(wrong.filter(o => o.plausibility >= 3).length, wrong.length),
    unrelatedDistractorRate: pct(wrong.filter(o => o.category === 'UNRELATED').length, wrong.length),
    atLeastTwoStrong: pct(group.filter(q => q.options.filter(o => !o.correct && o.plausibility >= 3).length >= 2).length, group.length),
    averageEditorialScore: +avg(group.map(q => q.score)).toFixed(1),
  };
};
const byDifficulty = Object.fromEntries(['beginner', 'intermediate', 'advanced'].map(d => [d, summarize(inventory.filter(q => q.difficulty === d))]));
const warnings = inventory.filter(q => q.lengthBias || q.missingExplanation || q.options.filter(o => !o.correct && o.plausibility >= 2).length < 2).map(q => q.questionId);
const report = {
  version: 2, generatedAt: '2026-10-12', methodology: '全200問を選択肢のみの観点から編集レビューし、191問を個別改稿。スコアは編集者のルーブリック評価で、受験者の実測正答率ではない。',
  baseline: baseline.summary, after: byDifficulty, modifiedQuestionIds: [...changed], distractorsReplaced, unchangedReasons,
  warnings, inventoryByDifficulty: Object.fromEntries(['beginner', 'intermediate', 'advanced'].map(d => [d, inventory.filter(q => q.difficulty === d)])),
};
fs.writeFileSync(new URL('reports/question-choice-quality-audit.json', root), JSON.stringify(report, null, 2) + '\n');

const names = { beginner: 'Foundation', intermediate: 'Applied', advanced: 'Exam' };
const lines = [
  '# GH-300 選択肢品質の全件監査', '',
  '## 判定方法', '',
  '全200問について問題文を伏せた4択、問題文を戻した唯一正解性、選択肢別解説と出典を編集レビューした。191問の選択肢・解説を個別に改稿し、残る9問も本文なしでは対象条件を特定できないことを確認した。受験者の正答率を実測したものではない。', '',
  'Foundationの機能名称問題では、名称が正答をそのまま言い換える選択肢を実際のCopilot機能・操作の対比へ改めた。Applied/Examでは、他の3択が一律に無関係または危険な行動となる構図を避け、同じ作業の一部は満たすが設問の条件を満たさない選択肢へ変更した。', '',
  '## Before', '',
  '| 難易度 | 全問 | もっともらしい誤答の平均 | 無関係な誤答 | 本文なし正解の疑い | 未判定 |',
  '| --- | ---: | ---: | ---: | ---: | ---: |',
  ...Object.entries(baseline.summary).map(([d, s]) => `| ${names[d]} | ${s.count} | ${s.averagePlausibleDistractors} | ${s.unrelatedDistractorRate}% | ${s.answerWithoutReadingFailureRate}% | ${s.answerWithoutReadingUnreviewedRate}% |`), '',
  '改稿前の一次選別は本文なし正解の疑いをApplied 33問、Exam 47問で検出した。Foundation 44問を含む残りは未判定であり、改稿前の「0件」という意味ではない。', '',
  '## Key Problems', '',
  '- Foundationに、正答だけ実在機能・常識的対応で他が無関係な選択肢が多数あった。',
  '- Applied/Examに、正答だけ複数の望ましい対策を組み合わせ、誤答が明白な手抜きや危険行為という構図があった。',
  '- 旧Knowledge Basesと旧CLI拡張を現行機能として扱う設問が残っていた。', '',
  '## Improvements', '',
  `- 全200問をレビューし、191問の本文・選択肢・解説を改稿した。誤答の文面は${distractorsReplaced}件を変更した。`,
  '- 正答IDとObjectiveは維持し、条件を一つ落とした部分解、適用範囲の違い、混同しやすいCopilot機能を優先した。',
  '- 全選択肢の解説と出典を再確認し、改稿後の内容に結び付くレビュー指紋を更新した。', '',
  '## After', '',
  '| 難易度 | 全問 | 改稿 | 本文なしで判別可能 | 未判定 | 別解懸念 | 長さ偏り | 強い誤答2つ以上 | 編集スコア平均 |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...Object.entries(byDifficulty).map(([d, s]) => `| ${names[d]} | ${s.count} | ${s.modified} | ${s.optionOnlyFailures} | ${s.unreviewed} | ${s.multipleAnswerRisks} | ${s.lengthBiases} | ${s.atLeastTwoStrong}% | ${s.averageEditorialScore} |`), '',
  '| 難易度 | もっともらしい誤答の平均 | 強い誤答率 | 無関係な誤答 |',
  '| --- | ---: | ---: | ---: |',
  ...Object.entries(byDifficulty).map(([d, s]) => `| ${names[d]} | ${s.averagePlausibleDistractors} | ${s.strongDistractorRate}% | ${s.unrelatedDistractorRate}% |`), '',
  '今回の全件判定は編集上の判断であり、学習者に問題文を隠して解かせた実測結果ではない。前後の編集スコアは判定範囲が異なるため、成績の改善幅として直接比較しない。', '',
  '100点の内訳は選択肢の関連性25、誤答のもっともらしさ25、唯一正解性20、長さの対称性10、本文依存10、解説10。各選択肢の根拠と点数はJSONに収録した。', '',
  '## 改稿しなかった9問', '',
  ...Object.entries(unchangedReasons).map(([id, reason]) => `- ${id}: ${reason}`), '',
  '## 代表レビュー（Applied 10問、Exam 20問）', '',
];
for (const [difficulty, ids] of Object.entries(samples)) {
  lines.push(`### ${names[difficulty]}`, '');
  for (const id of ids) {
    const q = inventory.find(item => item.questionId === id);
    const correct = q.options.find(o => o.correct);
    const strong = q.options.filter(o => !o.correct).sort((a, b) => b.plausibility - a.plausibility)[0];
    lines.push(`- ${id}（${q.score}点）: 正答${correct.id}「${correct.text}」。強い誤答${strong.id}「${strong.text}」は${strong.explanation} 決め手は「${sampleClues[id]}」。`);
  }
  lines.push('');
}
lines.push('## Human Review Required', '',
  '編集レビューで未解決とした問題は0問。実際の学習者へ問題文を伏せて解かせるブラインド試験と、受験者別の正答率による難易度校正は未実施。Concept Confusion Mapの個別学習履歴は利用者側のIndexedDBに保存されるため、このリポジトリでは実測の混同ペアを抽出できない。', '',
  '## 出典確認と限界', '',
  '改稿に伴い、終了した旧Copilot Knowledge BasesをCopilot Spacesへ、終了した旧`gh-copilot`拡張を現行Copilot CLIへ更新した。',
  '- [Copilot Spaces](https://docs.github.com/en/copilot/concepts/context/spaces)',
  '- [Knowledge Bases終了告知](https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/)',
  '- [旧CLI拡張の終了告知](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)',
  '- [現行Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli)',
  '- [IDE Chatのコマンドと変数](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/chat-with-copilot/get-started-with-chat-in-your-ide)', '',
  '出典の全リンクに対する自動疎通検査は実行環境のネットワーク制限によって確認できない場合がある。実際の受験者を使うブラインドテストと実測正答率は未実施。');
fs.writeFileSync(new URL('reports/question-choice-quality-audit.md', root), lines.join('\n') + '\n');
console.log(`Audited ${inventory.length}; revised ${changed.size}; warnings ${warnings.length}.`);
