import fs from 'node:fs';
import {reviewMultiSelectLayer} from './multi-select-review.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, root), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const formats = ['実験対照比較', 'インシデント切り分け', '複合制約トレードオフ'];
const countChars = text => Array.from(text).length;
const label = (q, id) => 'ABCD'[q.choices.findIndex(c => c.id === id)];

export function examLengths(q) {
  const correct = q.choices.find(c => q.answer.includes(c.id));
  const wrong = q.choices.filter(c => !q.answer.includes(c.id)).map(c => countChars(c.text)).sort((a,b) => a-b);
  return { correct: countChars(correct.text), wrong, medianWrong: wrong[1], ratio: countChars(correct.text)/wrong[1], position: label(q,correct.id) };
}

// These checks bind the editorial decision to its data and counterfactual replay.
// They cannot establish semantic correctness or measured learner difficulty.
export function validateExamReview(bank, report) {
  const layer=reviewMultiSelectLayer(bank);bank=layer.bank;
  const errors = [...layer.errors];
  const reviewed = new Map(report.questions.map(row => [row.id, row]));
  if (reviewed.size !== report.questions.length) errors.push('Duplicate review ID');
  const archived = report.reclassifiedQuestions ?? [];
  const archiveIds = new Set(archived.map(r => r.id));
  if (archiveIds.size !== archived.length || archived.some(r => reviewed.has(r.id))) errors.push('Duplicate archived review ID');
  for (const id of report.initialReviewQuestionIds ?? []) {
    if (!reviewed.has(id) && !archiveIds.has(id)) errors.push(`Lost historical Exam review: ${id}`);
  }
  for (const row of archived) {
    const q = bank.find(q => q.id === row.id);
    if (!q || row.fingerprint !== hash(q) || hash(row.after) !== row.fingerprint) {
      errors.push(`Stale reclassified Exam review: ${row.id}`);
      continue;
    }
    if (q.difficulty !== 'intermediate' || q.cognitiveLevel !== 'apply' || q.examLike !== false ||
        q.status !== 'verified' || row.before.id !== row.id || row.before.difficulty !== 'advanced' ||
        row.classificationChange?.from !== 'advanced' || row.classificationChange?.to !== 'intermediate' ||
        !row.classificationChange?.reason?.trim() ||
        JSON.stringify(row.before.answer) !== JSON.stringify(q.answer)) errors.push(`Invalid Exam reclassification: ${row.id}`);
  }
  for (const q of bank.filter(q => q.difficulty === 'advanced')) {
    if (!reviewed.has(q.id)) errors.push(`Unreviewed Exam question: ${q.id}`);
  }
  for (const row of report.questions) {
    const q = bank.find(q => q.id === row.id);
    if (!q || row.fingerprint !== hash(q) || hash(row.after) !== row.fingerprint) {
      errors.push(`Stale Exam review: ${row.id}`);
      continue;
    }
    if (q.status !== 'verified' || q.cognitiveLevel !== 'analyze' || !q.examLike || q.difficulty !== 'advanced') errors.push(`Unresolved Exam classification: ${q.id}`);
    if (row.before.id !== row.id || JSON.stringify(row.before.answer) !== JSON.stringify(q.answer)) errors.push(`Changed answer identity: ${q.id}`);
    if (!formats.includes(row.format) || !row.title || !row.summary || !row.difficultyAssessment) errors.push(`Incomplete editorial assessment: ${q.id}`);
    if (row.blindAfter?.verdict !== 'PASS' || !row.blindAfter.rationale || !row.blindBefore?.rationale) errors.push(`Unresolved blind review: ${q.id}`);
    if (row.reasoningSteps?.length !== 3 || new Set(row.reasoningSteps).size !== 3 || row.reasoningSteps.some(s => !s.trim())) errors.push(`Missing three-stage reasoning: ${q.id}`);
    if (row.clues?.length < 2 || JSON.stringify(row.clues) !== JSON.stringify(q.clues) || row.clues.some(c => !q.question.includes(c))) errors.push(`Non-literal or stale clues: ${q.id}`);
    const cf = row.counterfactual;
    if (!cf?.from || !cf.to || cf.from === cf.to || q.question.split(cf.from).length !== 2 ||
        q.question.replace(cf.from,cf.to) !== cf.question || cf.question === q.question ||
        q.answer.includes(cf.answerId) || !q.choices.some(c => c.id === cf.answerId) || !cf.rationale || !cf.editoriallyValidated) {
      errors.push(`Invalid counterfactual replay: ${q.id}`);
    }
    const wrong = q.choices.filter(c => !q.answer.includes(c.id));
    if (row.distractors?.length !== 3 || wrong.some(c => !row.distractors.some(r => r.id === c.id && r.text === c.text &&
        r.whyWrong === q.choiceExplanations[c.id] && r.temptation.trim()))) errors.push(`Incomplete distractor analysis: ${q.id}`);
    const measured = examLengths(q);
    if (JSON.stringify(row.lengths) !== JSON.stringify(measured)) errors.push(`Stale length/position: ${q.id}`);
    if (measured.ratio > 1.5 || measured.ratio < .5) errors.push(`Choice length bias: ${q.id}`);
  }
  return errors;
}

const overlap = [
 ['q-d1-e09','q-d1-e08','代理変数の公平性の対照実験。既存は研修効果と案件差の交絡。'],
 ['q-d2-e20','q-d1-e02','開始前のユーザー差分とAgent差分の帰属。既存はコミット別の検証・承認。'],
 ['q-d2-e21','q-sc07-2','Space共有と参照repoの二利用者の拒否境界。既存は検索と直接取得の認可。'],
 ['q-d2-e22','q-d2-e06','隔離の書込・実行・成果物の三制約。既存は利用可能ツールとallow/denyの二層。'],
 ['q-d2-e23','q-sc06-2','型検査成功とパス・公開APIの例外条件。既存はResult規約と固定参照の二原因。'],
 ['q-d2-e24','q-sc01-3','廃止したChat連携と存続する通常Appのログ。既存は強制・委任の実効設定。'],
 ['q-d3-e06','q-d3-e02','CAを読むプロセスを一変数実験で同定。既存は二PCのTLS/407の停止段階。'],
 ['q-d3-e07','q-sc08-2','モデルと参照版を分ける実験設計。既存は引用コミットと明示添付の診断。'],
 ['q-d3-e08','q-d3-e03','早期returnと変換による一入力だけの偽の成功。既存は単位と変更可能な境界。'],
 ['q-d4-e06','q-d4-e03','会話状態と添付版を分ける対照。既存はloggerの成功を保つ追加例実験。'],
 ['q-d4-e07','q-d4-e03','モデル差が混ざる漏洩比較と有限試行の限界。既存は実装例の一変数追加。'],
 ['q-d4-e08','q-sc06-2','自然言語指示の整合とruntime互換・更新禁止。既存は規約と参照先の再利用。'],
 ['q-d4-e09','q-sc02-3','入力予算・旧名・結合方式の識別例。既存は丸め方式を区別する中間点。'],
 ['q-d5-e06','q-d2-e07','SQLの値・列名の構文境界とAutofix検証。既存はMCPのツール名・認可とシェル引数の解釈。'],
 ['q-d5-e07','q-d2-e01','外部スキーマは成功、内部parse失敗、モックで欠落。既存は実行済みunitと未実行integration。'],
 ['q-d5-e08','q-sc09-1','二つの分母の計算と三基準・最多条件の候補選定。既存は集計の正確な報告と因果の留保。'],
 ['q-d6-e06','q-sc01-3','上位強制・Org保存値・未反映の社内承認。既存は例外実現に必要な上位/下位変更。'],
 ['q-d6-e07','q-sc10-3','CLIで保護済みの取得とMCP応答の別入力経路。既存は追加した送信先の承認範囲。'],
];

function render(report, sources) {
  const s = report.summary;
  const before = report.comparison.before, after = report.comparison.after;
  const positions = Object.fromEntries('ABCD'.split('').map(p => [p,report.questions.filter(r => r.lengths.position === p).length]));
  const lines = ['# 本番相当問題 全件6観点レビュー', '', `初回レビュー：${report.reviewStartedAt}〜${report.reviewedAt}／最新更新：${report.lastUpdated ?? report.reviewedAt}`, '',
    ...(report.followUpReviews?.length ? ['## 追加の見直し', '',
      ...report.followUpReviews.map(r => `- ${r.reviewedAt}：${r.questionIds.join('、')}を追加改稿。詳細：[追加レビュー](${r.report.split('/').pop().replace(/\.json$/,'.md')})。`), '',
      '追加レビューは上記の対象だけ。全件の整合性監査と、全件の意味的な再評価は別であり、初回のPASSを独立した本文なし検証の結果として扱わない。', ''] : []),
    `現在の本番相当台帳は既存${s.existing}問と追加${s.added}問、全${s.reviewed}問。現在の層に残る${s.textRewritten}問を各レビュー時点で実質改稿した。${report.reclassifiedQuestions?.length ?? 0}問は応用として再評価し、下記の履歴を残して応用台帳へ移管した。正答IDと表示順は維持。`, '',
    ...(report.reclassifiedQuestions?.length ? ['## 応用へ移管した問題', '',
      ...report.reclassifiedQuestions.map(r => `- ${r.id}：${r.classificationChange.reason}`), '',
      '移管前の全文と現在の指紋はJSONのreclassifiedQuestionsへ保存。移管後の適用・選択肢レビューは応用台帳と追加レビューレポートで確認する。', ''] : []),
    '## 判定基準とレビュー方法', '',
    '本番相当は、文が長いことや専門語の多さでは判定しない。観測を段階・対象・版へ分け、複数の制約または独立した証拠へ照合し、採用案・不足検査・最小変更を結論として選ぶことを求める。どの条件を落とすと誤答を選ぶかも記録した。', '',
    `以前の選択肢だけの編集評価では、変更前${s.beforeBlindFailures}問をFAIL（正答が安全・慎重・全部入りという手掛かり）とし、当時の台帳をPASSと判断した。その後の再評価で推測しやすい候補が見つかったため、追加レビューと再分類を追記した。現在の全問で推測リスクが解消済みという保証ではない。`, '',
    '**これは同じ編集者による疑似ブラインド評価で、初見の独立した受験者による盲検実験ではない。PASSは正答を推測する確率がゼロという意味ではなく、設問条件なしで必ず選べる唯一の正答や一律に危険・無関係な三誤答の構図を認めなかったという編集判断。**', '',
    '反実仮想は本文に実在する一つの条件ブロックを置き換え、選択肢を変えず、元の正答と異なる既存選択肢を正答にする。観測・入力の変更に加え、承認範囲・変更可能な箇所・測定目的を変える例も含む。全文はJSONのcounterfactual.questionで再現できる。', '',
    '## 追加と既存の分量比較', '',
    '文字数はUnicodeの文字単位で数え、句読点・記号も含む。読み量は本文＋4選択肢で、解説は除く。', '',
    '| 時点・区分 | 問数 | 本文中央値 | 選択肢中央値（1択） | 読み量中央値 | 読み量平均 | 読み量範囲 |',
    '| --- | ---: | ---: | ---: | ---: | ---: | --- |',
    ...[['変更前・既存',before.existing],['変更前・追加',before.added],['修正後・既存',after.existing],['修正後・追加',after.added]].map(([name,m]) => `| ${name} | ${m.count} | ${m.stemCharacters.median} | ${m.choiceCharacters.median} | ${m.totalReadingCharacters.median} | ${m.totalReadingCharacters.mean} | ${m.totalReadingCharacters.min}〜${m.totalReadingCharacters.max} |`), '',
    `追加の修正前読み量平均は既存の${(before.added.totalReadingCharacters.mean/before.existing.totalReadingCharacters.mean).toFixed(2)}倍だったが、修正後は${(after.added.totalReadingCharacters.mean/after.existing.totalReadingCharacters.mean).toFixed(2)}倍。分量の範囲も重なる。長い一般論を圧縮し、ログ・数値・権限表など判定に必要な材料を残した。`, '',
    '両区分とも同じ三段階推論・同じ4択・実際に回答が変わる反実仮想を要求した。ただし読み量の近さは実測難易度の等価性を証明しない。標準的な分析から複合制約の比較までを含み、全問を極端な難問にしてはいない。', '',
    '## 追加問題と既存の内容比較', '',
    '概念の反復学習は残すが、同じ話の名詞置換にはしない。類似テーマの既存問題と、追加した観測・制約の違いは以下のとおり。', '',
    '| 追加問題 | 類似する既存問題 | 出題する判断の違い |', '| --- | --- | --- |',
    ...overlap.map(([id,other,note]) => `| ${id} | ${other} | ${note} |`), '',
    '## 形式・文字長・位置', '',
    ...Object.entries(s.formats).map(([f,n]) => `- ${f}：${n}問`), '',
    `正答表示位置はA:${positions.A}／B:${positions.B}／C:${positions.C}／D:${positions.D}。A/B/C/Dはアプリの表示位置を表し、保存用choice IDと混同しない。`, '',
    `現在の${s.reviewed}問で正答文字長÷誤答3択の中央値は0.5〜1.5の範囲。これは補助的な警戒基準であり、比率だけで合否を決めない。Domainごとの9問では3/9=33.3%が出るが、4位置への整数配分のため全てを30%以下にはできない。`, '',
    '## 公式情報の修正', '',
    '- [GitHub App型Extensionsの廃止](https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps/)：旧Chat連携と存続する通常GitHub Appを分け、現行MCPへ置換する。privateなら廃止を回避できるという説明は削除。',
    '- [Copilot Spaces](https://docs.github.com/en/copilot/concepts/context/spaces)：旧Knowledge Basesと同一の現行名として記述しない。Space共有と参照repoへの閲覧アクセスは別に判断する。',
    '- [指示のスコープ](https://docs.github.com/en/copilot/concepts/prompting/response-customization)：組織指示を強制セキュリティポリシーと混同しない。Prompt Fileで上書きを宣言すれば確実に優先するという保証はしない。',
    '- [除外の対応範囲](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)、[CLIの管理Docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise)：CLIの対応情報を維持し、IDE Agentの限界、リンク、MCP返却という別の経路を区別する。全Copilot機能が一律に遮断されるという説明は削除。',
    '- [Autofixの提案の検証](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/triage-alerts-in-pull-requests)：対象DBの構文と実行契約へ照合し、提案をそのまま承認済みとしない。', '',
    '固定の隣接タブ優先順位、10往復で必ず制約脱落、否定語のアテンションが漏洩原因という断定、JSON指定で静的フィルターが作動する保証は削除。観測から支持される比較・次の実験に結論を限定した。', '',
    '## 全問のレビュー', ''];
  for (const row of report.questions) {
    const q = row.after, cf = row.counterfactual;
    lines.push(`### ${q.id}: ${row.title}`, '',
      `- **出題形式**: ${row.format}`, `- **問題文要約**: ${row.summary}`, '',
      `問題文：${q.question}`, '', '**選択肢構成**（アプリの表示順）', '',
      ...q.choices.map(c => `- ${label(q,c.id)}：${c.text}${q.answer.includes(c.id)?'【正答】':''}`), '',
      '**【レビュー① ブラインドチェック】**', '',
      `変更前：${row.blindBefore.verdict}。${row.blindBefore.rationale}`, '',
      `修正後：${row.blindAfter.verdict}。${row.blindAfter.rationale}`, '',
      '**【レビュー② 多段階推論】**', '',
      `1. ステップ1（分析）：${row.reasoningSteps[0]}`, `2. ステップ2（照合）：${row.reasoningSteps[1]}`, `3. ステップ3（結論）：${row.reasoningSteps[2]}`, '',
      '**【レビュー③ 反実仮想（Counterfactual）】**', '',
      `「${cf.from}」が「${cf.to}」なら、正答は **${label(q,q.answer[0])} → ${label(q,cf.answerId)}** へ変わる。`, '',
      `変更後の正答：${q.choices.find(c=>c.id===cf.answerId).text}`, '', `検証：${cf.rationale}`, '',
      '<details><summary>条件変更後の問題文</summary>', '', cf.question, '', '</details>', '',
      '**【レビュー④ 客観的手がかり（Clues）】**', '',
      ...row.clues.map(c => `- 「${c}」`), '',
      '**【レビュー⑤ 誤答の罠（Distractor Analysis）】**', '',
      ...row.distractors.map(c => `- **${label(q,c.id)}**：誘惑・見落としは「${c.temptation}」／今回不適合な理由：${c.whyWrong}`), '',
      '**【レビュー⑥ 文字長・位置】**', '',
      `正答${row.lengths.correct}字／誤答（短い順）${row.lengths.wrong.join('・')}字／誤答中央値${row.lengths.medianWrong}字／中央値比 **${row.lengths.ratio.toFixed(2)}**／正答表示位置 **${row.lengths.position}**。`, '',
      `難易度判定：${row.difficultyAssessment}`, '',
      `出典：${q.sourceIds.map(id => { const source=sources.find(s=>s.id===id); return `[${source.title}](${source.url})`; }).join('、')}`, '');
  }
  lines.push('## 検証と限界', '',
    ...(report.verification ? [`テスト${report.verification.testsPassed}件成功。型チェック・ビルド・本番相当網羅検査・品質／難易度監査・選択肢監査が成功。追加／重点出典${report.verification.sourcesChecked}件のリンクを確認した。`, ''] : []),
    '反実仮想の正答判定と誤答のもっともらしさは編集者が全文を読んで評価した。自動検査が保証するのは内容指紋・Cluesの文字列一致・条件置換・別の正答ID・文字長・全件網羅・記録の整合性であり、設問の意味的正しさではない。', '',
    '実際の受験者の正答率・回答時間・識別力、独立したブラインド正答率、実試験との等価性は未測定。架空の数値、ログ、社内基準、保持契約は公式試験やGitHub共通仕様の引用ではない。', '',
    '保存済み問題IDと正答IDは維持したが、改稿前の成績は新しい文面の実測難易度を示さない。exam:syncは既存IDの編集結果を保持し、新規インポートにはneeds-reviewを付け、編集レビューのPASSや確認日を自動付与しない。', '');
  return lines.join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bank = read('content/gh300/2026-08-07/questions/seed.json');
  const report = read('reports/exam-question-quality-review.json');
  const errors = validateExamReview(bank,report);
  if (errors.length) throw Error(errors.join('\n'));
  if (!process.argv.includes('--check')) fs.writeFileSync(new URL('reports/exam-question-quality-review.md',root),render(report,read('content/gh300/2026-08-07/sources.json')));
  console.log(JSON.stringify({historicalInitialReview:report.summary,currentSelection:report.selectionSummary,reviewedAssets:report.questions.length}));
}
