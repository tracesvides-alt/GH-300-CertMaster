import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const bankPath = 'content/gh300/2026-08-07/questions/seed.json';
const reportDir = new URL('../reports/', import.meta.url);
const bank = JSON.parse(fs.readFileSync(new URL(`../${bankPath}`, import.meta.url), 'utf8'));
const changed = new Set(['q-d2-a07', 'q-d2-a20', 'q-d2-e02', 'q-d2-e07', 'q-sc03-1', 'q-sc07-1', 'q-d3-a05', 'q-d3-a10']);

// These are editorial screening findings from reading the four options in isolation.
// They are warnings pending a separate reviewer, not measured learner performance.
const obvious = new Set(`q-d2-a07 q-d2-a20 q-d2-e02 q-d2-e07 q-sc03-1 q-sc07-1 q-d3-a05 q-d3-a10
q-d2-a05 q-d2-a06 q-d2-a09 q-d2-a11 q-d2-a15 q-d2-a16 q-d2-a21 q-d2-e01 q-d2-e03 q-d2-e04 q-d2-e05 q-d2-e08 q-d2-e10 q-d2-e11 q-d2-e12 q-d2-e13 q-d2-e14 q-d2-e15 q-d2-e16 q-d2-e18 q-d2-e19
q-d3-a04 q-d3-a06 q-d3-a07 q-d3-a08 q-d3-a11 q-d3-e01 q-d3-e04 q-d3-e05
q-d4-a02 q-d4-a04 q-d4-a05 q-d4-a06 q-d4-a09 q-d4-a10 q-d4-a11 q-d4-e01 q-d4-e02 q-d4-e03 q-d4-e04 q-d4-e05
q-d5-a05 q-d5-a06 q-d5-a09 q-d5-a10 q-d5-e03 q-d5-e04 q-d5-e05
q-d6-a01 q-d6-a03 q-d6-a05 q-d6-a08 q-d6-a09 q-d6-a10 q-d6-e02 q-d6-e05
q-sc01-1 q-sc01-2 q-sc03-3 q-sc04-1 q-sc04-2 q-sc05-1 q-sc05-2 q-sc06-1 q-sc06-2 q-sc07-2 q-sc07-3 q-sc08-1 q-sc08-2 q-sc08-3 q-sc09-2 q-sc10-3`.split(/\s+/).filter(Boolean));
const unrelated = new Set(`q-d3-a05:B q-d3-a05:C q-d3-a05:D q-d3-a10:B q-d3-a10:C q-d3-a10:D
q-d4-a06:B q-d4-a06:C q-d4-a06:D q-d6-a05:B q-d6-a05:C q-d6-a05:D
q-d5-e03:C q-d5-e03:D q-sc07-3:B q-sc07-3:C q-sc07-3:D`.split(/\s+/).filter(Boolean));
const sampleIds = {
  intermediate: `q01 q-d1-a02 q-d1-a09 q-d2-a07 q-d2-a20 q-d3-a05 q-d3-a10 q-d4-a07 q-d5-a01 q-d6-a03`.split(' '),
  advanced: `q-d1-e01 q-d1-e03 q-d1-e05 q-d1-e07 q-d1-e08 q-sc03-1 q-sc07-1 q-d2-e02 q-d2-e07 q-d2-e04 q-d2-e06 q-d2-e11 q-d3-e04 q-d4-e01 q-d4-e04 q-d5-e01 q-d5-e03 q-d6-e01 q-sc09-1 q-sc10-2`.split(' '),
};
const categoryMap = {
  'partial-match': 'PARTIAL_MATCH', 'wrong-scope': 'PARTIAL_MATCH',
  'common-confusion': 'COMMON_CONFUSION', 'wrong-mechanism': 'COMMON_CONFUSION',
  'wrong-use-case': 'SAME_DOMAIN_WEAK',
};
const average = values => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
const pct = (n, d) => d ? +(n / d * 100).toFixed(1) : 0;

export function auditQuestion(q, isBefore = false) {
  const edited = changed.has(q.id) && !isBefore;
  const flagged = obvious.has(q.id) && !edited;
  const answer = q.answer[0];
  const wrong = q.choices.filter(c => !q.answer.includes(c.id));
  const indexed = q.choices.map(c => {
    const correct = q.answer.includes(c.id);
    const stored = q.choiceQuality?.[c.id];
    let category = correct ? 'CORRECT' : categoryMap[stored?.distractorType] ?? 'SAME_DOMAIN_WEAK';
    let plausibility = correct ? 4 : stored?.plausibility ?? 1;
    const explicitUnrelated = unrelated.has(`${q.id}:${c.id}`) && !edited;
    if (explicitUnrelated) { category = 'UNRELATED'; plausibility = 0; }
    else if (!correct && flagged && plausibility > 1) {
      // The old rubric assigned every wrong answer >=2. In an answer-only
      // failure, cap the uncorroborated score until a new editorial pass.
      category = 'SAME_DOMAIN_WEAK'; plausibility = 1;
    }
    else if (!correct && edited && plausibility === 3) category = 'STRONG_RELEVANT';
    return {
      id: c.id, text: c.text, correct, category, plausibility,
      explanation: q.choiceExplanations?.[c.id] ?? null,
      testedConcepts: q.testedConcepts ?? [],
      sourceIds: stored?.sourceIds ?? q.sourceIds,
      requirementFailure: q.requirementMapping?.map(m => m.distractorFailures?.[c.id]).filter(Boolean) ?? [],
      assessment: edited ? 'editorial-reviewed' : 'screening-provisional',
    };
  });
  const distractors = indexed.filter(c => !c.correct);
  const correctChoice = indexed.find(c => c.correct);
  const medianLength = wrong.map(c => c.text.length).sort((a, b) => a - b)[1] || 1;
  const lengthBias = correctChoice.text.length > Math.max(30, medianLength * 1.5) || correctChoice.text.length < medianLength * 0.5;
  const missingExplanation = indexed.some(c => !c.explanation?.trim());
  const requirementMapping = q.requirementMapping ?? [];
  const explanationQuality = missingExplanation ? 0 : indexed.every(c => c.explanation.length >= 20) ? 10 : 5;
  const relevance = Math.round(25 * average(distractors.map(c => ({ UNRELATED: 0, SAME_DOMAIN_WEAK: .3, PARTIAL_MATCH: .75, COMMON_CONFUSION: .75, STRONG_RELEVANT: 1 })[c.category] ?? .3)));
  const plausibility = Math.round(25 * average(distractors.map(c => c.plausibility / 3)));
  const unique = q.status === 'verified' && q.answer.length === 1 ? (edited ? 20 : 10) : 0;
  const symmetry = lengthBias ? 3 : 10;
  const scenario = q.difficulty === 'beginner' ? 0 : edited ? 10 : flagged ? 0 : requirementMapping.length ? 5 : 0;
  const score = relevance + plausibility + unique + symmetry + scenario + explanationQuality;
  const answerWithoutReading = q.difficulty === 'beginner' ? 'REVIEW' : edited ? 'PASS' : flagged ? 'FAIL' : 'REVIEW';
  const priority = answerWithoutReading === 'FAIL' || distractors.filter(c => c.category === 'UNRELATED').length >= 2 ? 'P0' : lengthBias || distractors.filter(c => c.plausibility >= 2).length < 2 ? 'P1' : 'P2';
  return {
    questionId: q.id, domainId: q.domainId, objectiveId: q.objectiveId,
    difficulty: q.difficulty, examLike: q.examLike ?? false, cognitiveLevel: q.cognitiveLevel ?? null,
    status: q.status, question: q.question, choices: indexed, correctAnswer: q.answer,
    choiceExplanations: q.choiceExplanations ?? {}, testedConcepts: q.testedConcepts ?? [], sourceIds: q.sourceIds,
    requirementMapping, answerWithoutReading, potentialMultipleAnswer: edited ? false : 'not-confirmed',
    lengthBias, missingExplanation, qualityScore: score,
    scoreBreakdown: { relevance, plausibility, unique, symmetry, scenario, explanationQuality },
    priority, assessment: edited ? 'editorial-reviewed' : 'screening-provisional',
  };
}

function summarize(items) {
  const result = {};
  for (const difficulty of ['beginner', 'intermediate', 'advanced']) {
    const group = items.filter(q => q.difficulty === difficulty);
    const wrong = group.flatMap(q => q.choices.filter(c => !c.correct));
    result[difficulty] = {
      count: group.length,
      averagePlausibleDistractors: +average(group.map(q => q.choices.filter(c => !c.correct && c.plausibility >= 2).length)).toFixed(2),
      unrelatedDistractorRate: pct(wrong.filter(c => c.category === 'UNRELATED').length, wrong.length),
      answerWithoutReadingFailureRate: pct(group.filter(q => q.answerWithoutReading === 'FAIL').length, group.length),
      answerWithoutReadingUnreviewedRate: pct(group.filter(q => q.answerWithoutReading === 'REVIEW').length, group.length),
      strongDistractorRate: pct(wrong.filter(c => c.category === 'STRONG_RELEVANT' || c.plausibility === 3).length, wrong.length),
      questionsWithAtLeastTwoStrong: pct(group.filter(q => q.choices.filter(c => !c.correct && c.plausibility === 3).length >= 2).length, group.length),
      potentialMultipleAnswerRate: 'unmeasured (only edited questions rechecked)',
      averageScore: +average(group.map(q => q.qualityScore)).toFixed(1),
      belowTarget: group.filter(q => q.qualityScore < (difficulty === 'advanced' ? 85 : 80)).length,
    };
  }
  return result;
}

function auditBank(input, before) { return input.map(q => auditQuestion(q, before)); }

fs.mkdirSync(reportDir, { recursive: true });
const baselinePath = new URL('question-choice-baseline.json', reportDir);
if (process.argv.includes('--capture-baseline')) {
  if (fs.existsSync(baselinePath)) throw Error('The before snapshot already exists; keep the original comparison baseline.');
  const prior = JSON.parse(execFileSync('git', ['show', `HEAD:${bankPath}`], { encoding: 'utf8' }));
  const baseline = { capturedAt: '2026-10-12', basis: 'HEAD before distractor edits', summary: summarize(auditBank(prior, true)) };
  fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2) + '\n');
  console.log(`Baseline captured from HEAD: ${prior.length} questions`);
  process.exit(0);
}
if (!fs.existsSync(baselinePath)) throw Error('Run --capture-baseline before generating the report.');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const inventory = auditBank(bank, false);
const after = summarize(inventory);
const warnings = [];
for (const q of inventory) {
  if (q.difficulty !== 'beginner' && q.choices.some(c => !c.correct && c.category === 'UNRELATED')) warnings.push(`${q.questionId}: unrelated distractor`);
  if (q.difficulty === 'advanced' && q.choices.filter(c => !c.correct && c.plausibility >= 3).length < 2) warnings.push(`${q.questionId}: fewer than two independently strong distractors`);
  if (q.missingExplanation) warnings.push(`${q.questionId}: missing choice explanation`);
  if (q.lengthBias) warnings.push(`${q.questionId}: length asymmetry`);
  if (q.answerWithoutReading === 'FAIL') warnings.push(`${q.questionId}: answer-only failure`);
  if (q.assessment !== 'editorial-reviewed' && q.difficulty !== 'beginner') warnings.push(`${q.questionId}: semantic uniqueness and category need independent review`);
}
const output = {
  version: 1, generatedAt: '2026-10-12', rubric: { relevance: 25, plausibility: 25, unique: 20, symmetry: 10, scenario: 10, explanationQuality: 10 },
  methodology: 'Full inventory and rule-based screening; eight rewritten questions received a new editorial pass. Provisional categories and scores must not be interpreted as learner difficulty or verified semantic correctness.',
  baseline: baseline.summary, after, modifiedQuestionIds: [...changed], warnings,
  byDifficulty: Object.fromEntries(['beginner', 'intermediate', 'advanced'].map(d => [d, inventory.filter(q => q.difficulty === d)])),
};
fs.writeFileSync(new URL('question-choice-quality-audit.json', reportDir), JSON.stringify(output, null, 2) + '\n');

const table = (title, summary) => [title, '', '| 難易度 | 問題数 | 平均もっともらしい誤答 | 無関係な誤答 | 本文なしで正解 | 未判定 | 強い誤答率 | 強い誤答2つ以上 | 平均点 |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...[['beginner', 'Foundation'], ['intermediate', 'Applied'], ['advanced', 'Exam']].map(([d, label]) => { const s = summary[d]; return `| ${label} | ${s.count} | ${s.averagePlausibleDistractors} | ${s.unrelatedDistractorRate}% | ${s.answerWithoutReadingFailureRate}% | ${s.answerWithoutReadingUnreviewedRate}% | ${s.strongDistractorRate}% | ${s.questionsWithAtLeastTwoStrong}% | ${s.averageScore} |`; }), ''];
const lines = ['# GH-300 Choice Quality Audit', '',
  '## 判定範囲', '',
  '全200問の問題文・4選択肢・解説・出典・既存の要件対応を機械的に一覧化した。応用79問、本番相当77問は選択肢だけでも正解が目立つ箇所を一次選別し、8問を公式資料と照合して改稿した。残る148問の意味的な唯一正解性・誤答の強さは独立レビュー未了である。', '',
  '数値は既存の編集者評価と今回の一次選別に基づく。受験者の実測正答率ではない。従来の監査は応用・本番相当の全問を「強い誤答2つ以上」としたが、全誤答に一律2点を付けた自己評価のため、独立した品質保証には使えない。今回の provisional スコアも最終認定値ではない。', '',
  ...table('## Before', baseline.summary),
  '## 主な問題', '',
  `- 本文なしで解ける疑い: 改稿前${Math.round(baseline.summary.intermediate.answerWithoutReadingFailureRate * baseline.summary.intermediate.count / 100)}問（Applied）、${Math.round(baseline.summary.advanced.answerWithoutReadingFailureRate * baseline.summary.advanced.count / 100)}問（Exam）。`,
  '- MCP接続問題で、正解だけが「接続手段」で他の3択が資料・指示文という構成が複数回使われていた。',
  '- ネットワーク障害や文脈の版ずれを問う問題で、他領域の利用統計・セキュリティ設定を混ぜていた。',
  '- 既存の選択肢別評価がほぼ一律2点で、強い誤答率を過大評価していた。',
  '- 複数正解リスクは改稿8問のみ再照合済み。残りは「0件」と認定しない。', '',
  '## 改善', '',
  '- 全200問を棚卸しし、応用・本番相当156問を一次選別。',
  '- 8問を改稿し、24個の誤答選択肢と全32個の選択肢解説を更新。正答IDとObjectiveは保持。',
  '- 外部連携では鮮度・利用者権限・読取専用の3条件を比較させ、ネットワークと文脈の問題では誤答も同じ診断領域へ寄せた。',
  '- 出典は[GitHub MCP概説](https://docs.github.com/en/copilot/concepts/context/mcp)、[MCP Tools仕様](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)、[GitHubネットワーク診断](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)、[GitHubのプロンプト設計](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)を照合。', '',
  ...table('## After', after),
  '### 採点と自動検出', '',
  '100点は関連性25・もっともらしさ25・唯一正解20・文体対称性10・シナリオ依存10・解説10。未改稿問では唯一正解とシナリオ依存の満点を与えず、暫定値としている。長さの極端な差、説明欠落、無関係な誤答、強い誤答不足、本文なし推測を警告として列挙する。カテゴリ不一致と複数正解は自動で確定できないためCIを失敗させない。', '',
  '## 人間レビューが必要', '',
  `- Applied ${inventory.filter(q => q.difficulty === 'intermediate' && q.assessment !== 'editorial-reviewed').length}問、Exam ${inventory.filter(q => q.difficulty === 'advanced' && q.assessment !== 'editorial-reviewed').length}問で、各選択肢の強さと唯一正解性を再確認する。`,
  `- 本文なし正解のFAILは改稿後もApplied ${inventory.filter(q => q.difficulty === 'intermediate' && q.answerWithoutReading === 'FAIL').length}問、Exam ${inventory.filter(q => q.difficulty === 'advanced' && q.answerWithoutReading === 'FAIL').length}問。これらを次のP0改稿対象とする。`,
  '- Concept Confusion Mapの実学習履歴は各利用者のローカルIndexedDBにあり、このリポジトリからは取得できない。頻出ペアを捏造せず、実際の誤答履歴を見られるときに優先度へ反映する。', '',
  '### 代表的なレビューセット（Applied 10問、Exam 20問）', ''];
for (const [difficulty, ids] of Object.entries(sampleIds)) {
  lines.push(`#### ${difficulty === 'intermediate' ? 'Applied' : 'Exam'}`, '');
  for (const id of ids) {
    const q = inventory.find(item => item.questionId === id);
    if (!q || q.difficulty !== difficulty) throw Error(`Sample ID mismatch: ${id}`);
    const correct = q.choices.find(c => c.correct);
    const alternative = q.choices.filter(c => !c.correct).sort((a, b) => b.plausibility - a.plausibility)[0];
    lines.push(`- **${id}** (${q.domainId}/${q.objectiveId}, ${q.assessment}、${q.qualityScore}点): 正解「${correct.text}」。比較候補「${alternative.text}」。迷う理由: ${alternative.explanation ?? '要確認'} 決め手: ${q.requirementMapping[0]?.correctReason ?? q.question}`);
  }
  lines.push('');
}
lines.push('## 詳細データ', '', '`reports/question-choice-quality-audit.json` に難易度別の全200問・全800選択肢、暫定カテゴリ（STRONG_RELEVANT / PARTIAL_MATCH / COMMON_CONFUSION / SAME_DOMAIN_WEAK / UNRELATED）、0–4点、要件対応、個別点数、優先度を保存した。元の問題データを改稿した8問以外は、選択肢への新たな意味的な承認を与えていない。', '',
  `警告件数: ${warnings.length}（同じ問題に複数の警告を含む）。`, '');
fs.writeFileSync(new URL('question-choice-quality-audit.md', reportDir), lines.join('\n'));
console.log(`Choice audit: ${inventory.length} questions, ${changed.size} editorial rewrites, ${warnings.length} warnings`);
