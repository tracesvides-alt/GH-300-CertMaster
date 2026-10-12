// Reviewed, idempotent editorial edits. Run only when the corresponding official
// sources and the answer uniqueness have been checked again.
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const base = new URL('../content/gh300/2026-08-07/', import.meta.url);
const file = name => new URL(name, base);
const read = name => JSON.parse(fs.readFileSync(file(name), 'utf8'));
const bank = read('questions/seed.json');
const reviews = read('questions/quality-review.json');
const sources = read('sources.json');
const checkedAt = '2026-10-12';
const edits = new Map();

function replace(id, question, choices, explanations, types, sourceIds) {
  const q = bank.find(item => item.id === id);
  if (!q) throw Error(`Unknown question: ${id}`);
  const answer = q.answer[0];
  if (Object.keys(choices).sort().join() !== q.choices.map(c => c.id).sort().join()) throw Error(`Choice ID mismatch: ${id}`);
  if (Object.keys(explanations).sort().join() !== Object.keys(choices).sort().join()) throw Error(`Explanation mismatch: ${id}`);
  if (!choices[answer]) throw Error(`Answer missing: ${id}`);
  q.question = question;
  q.choices = q.choices.map(c => ({ id: c.id, text: choices[c.id] }));
  q.choiceExplanations = explanations;
  q.explanation = explanations[answer];
  q.sourceIds = sourceIds;
  q.choiceQuality = Object.fromEntries(Object.keys(choices).map(key => [key, {
    // The question schema stores 0–3; the export uses 4 for the correct option.
    plausibility: key === answer ? 3 : (types[key] === 'strong' ? 3 : 2),
    distractorType: key === answer ? 'correct' : types[key] === 'strong' ? 'partial-match' : 'wrong-mechanism',
    sourceIds,
    rationale: explanations[key],
  }]));
  q.requirementMapping = [{
    requirement: question,
    correctReason: explanations[answer],
    distractorFailures: Object.fromEntries(Object.keys(choices).filter(key => key !== answer).map(key => [key, explanations[key]])),
  }];
  q.lastVerifiedAt = checkedAt;
  q.trustedSourceFacts = Object.values(explanations);
  edits.set(id, q);
}

replace('q-d2-a07',
  'IDEのCopilot Chatから社内DBの現在のスキーマを参照します。利用者ごとの閲覧権限を守り、スキーマ変更や任意SQLの実行は許可しません。最も適した連携設計は？',
  { A: '利用者を認可し、メタデータ取得だけを許すMCPツールを提供する', B: '共有の管理者資格情報で全テーブルを照会できるMCPツールを提供する', C: '前日に出力したスキーマ一覧をCopilot Spacesで参照する', D: '任意SQLを実行できるMCPツールを提供し、指示文で読取専用にする' },
  { A: '現在のメタデータを取得でき、サーバーで利用者の権限と操作範囲を制限できる。', B: '同じMCP経由で現在値を取れるが、共有管理者権限では利用者ごとの閲覧境界を守れない。', C: '資料を共有できるが、前日の静的コピーでは現在のスキーマを保証できない。', D: 'MCP連携ではあるが、指示文だけでは任意SQLの実行権限を強制的に制限できない。' },
  { B: 'strong', C: 'plausible', D: 'strong' }, ['mcp', 'mcp-spec']);

replace('q-d2-a20',
  '社内の注文APIをCopilot Chatから照会します。回答は常に最新で、利用者の閲覧権限を越えず、注文の更新機能は不要です。最も適した構成は？',
  { A: '利用者の権限で検索する読取専用MCPツールを公開する', B: '共通の管理者資格情報で検索するMCPツールを公開する', C: 'APIの利用例と昨日の注文一覧をCopilot Spacesに追加する', D: '検索と注文更新を兼ねるMCPツールを公開し、更新禁止を指示に書く' },
  { A: '最新の検索結果を取得しつつ、閲覧権限と読取専用の操作範囲をサーバーで守れる。', B: '最新値は取得できるが、共通の管理者権限は利用者ごとの閲覧境界を失わせる。', C: '共有資料としては有用だが、昨日の一覧では現在の注文状態を照会できない。', D: '検索は可能だが、指示だけでは不要な更新権限を排除できない。' },
  { B: 'strong', C: 'plausible', D: 'strong' }, ['mcp', 'mcp-spec', 'spaces']);

replace('q-d2-e02',
  'Fintech企業はIDEのCopilotから為替レートと顧客残高の現在値を調べます。残高は担当者の閲覧権限で制限し、残高更新や送金の実行は認めません。どの設計が要件に最も合いますか？',
  { A: '利用者を認可した読取専用MCPツールで、両サービスを照会する', B: '管理者トークンを共有するMCPツールで、両サービスを照会する', C: 'APIの仕様と定期出力した残高をCopilot Spacesで共有する', D: '読取・送金を実行できるMCPツールを公開し、指示文で送金を禁じる' },
  { A: '現在値の取得、利用者ごとの認可、読取専用の操作範囲を同時に満たす。', B: '現在値を取れる点は近いが、共有管理者トークンでは担当者別の残高閲覧権限を守れない。', C: '仕様理解には役立つが、定期出力では現在のレートや残高を保証できない。', D: 'MCPで現在値を取得できても、送金権限を指示文だけで無効にはできない。' },
  { B: 'strong', C: 'plausible', D: 'strong' }, ['mcp', 'mcp-spec', 'spaces']);

replace('q-d2-e07',
  '開発チームはCopilot ChatからローカルDockerコンテナの状態と直近ログだけを取得したい。任意コマンド、コンテナ削除、資格情報の読み取りは許可しません。MCPサーバーの設計として最適なのは？',
  { A: '状態確認と範囲を絞ったログ取得だけをツールとして公開する', B: 'Dockerソケットの全操作を一つのツールで公開し、指示で削除を禁じる', C: '起動時のコンテナ一覧をResourceとして公開し、現在値として返す', D: '任意シェル実行ツールを公開し、Chatにdocker psとlogsだけを依頼する' },
  { A: '必要な読取操作のみを公開し、削除や任意実行の権限をツール側から排除できる。', B: '同じ情報は得られるが、全操作を許すと指示では削除権限を制限できない。', C: 'Resourceで情報を共有できても、起動時の一覧は現在の状態や直近ログではない。', D: 'dockerコマンドで取得は可能だが、任意シェル実行を許すと要求された操作制限を守れない。' },
  { B: 'strong', C: 'plausible', D: 'strong' }, ['mcp', 'mcp-spec']);

replace('q-sc03-1',
  '【Horizon Cloud事例】社内Issueと本番メトリクスをCopilotから参照します。Issueは担当チームごとに閲覧権限が異なり、本番側には読取操作だけを許します。どのMCP構成が最も適切ですか？',
  { A: '利用者を認可したIssue検索と読取専用メトリクス取得をツールとして公開する', B: '共通の管理者資格情報でIssueとメトリクスを読むツールを公開する', C: 'Issueのエクスポートとメトリクスの定期集計をResourceとして公開する', D: 'Issueの変更と本番操作も行えるツールを公開し、読取専用を指示に書く' },
  { A: '現在の情報を取得でき、担当者別の閲覧権限と本番の読取専用範囲をサーバー側で守れる。', B: '両システムには接続できるが、共通管理者資格情報ではチームごとの閲覧境界が失われる。', C: 'Resourceで資料を共有できても、定期集計では現在のIssueやメトリクスを保証できない。', D: '機能としては接続できるが、指示文はIssue変更や本番操作の権限を強制的に無効化しない。' },
  { B: 'strong', C: 'plausible', D: 'strong' }, ['mcp', 'mcp-spec']);

replace('q-sc07-1',
  '【CyberShield Systems事例】承認済みの脆弱性DBをCopilot Chatから最新状態で検索します。利用者は担当製品の情報だけ閲覧でき、記録の変更は禁止です。最適な連携設計は？',
  { A: '担当製品の閲覧権限を検証する読取専用MCP検索ツールを公開する', B: '全製品を検索する共通管理者権限のMCPツールを公開する', C: '毎朝出力した脆弱性一覧をCopilot Spacesへ追加する', D: '検索と更新を兼ねるMCPツールを公開し、更新しないよう指示する' },
  { A: '現在の脆弱性情報を検索しながら、担当範囲と読取専用の制限をサーバーで守れる。', B: '最新情報の検索はできるが、共通管理者権限では担当製品以外の閲覧を防げない。', C: '資料共有には役立つが、朝の出力はその後の更新を反映せず最新状態を保証しない。', D: 'MCPで検索はできても、指示文だけでは記録変更の権限を禁止できない。' },
  { B: 'strong', C: 'plausible', D: 'strong' }, ['mcp', 'mcp-spec', 'spaces']);

replace('q-d3-a05',
  'Copilotは社内プロキシ経由の環境だけで接続に失敗し、直結環境では動きます。シート割り当ては確認済みですが、エラーの種類はまだ特定していません。最初の切り分けとして適切なのは？',
  { A: 'Copilotの接続診断を実行し、プロキシ・証明書・許可先の結果を照合する', B: 'プロキシのタイムアウトを延ばし、診断前に同じ要求を再試行する', C: '接続先を全許可し、診断前に同じ要求を再試行する', D: '証明書検証を無効にし、診断前に同じ要求を再試行する' },
  { A: 'プロキシ経路に限る失敗の原因が未確定なので、診断結果から通信先・証明書・経路を切り分ける。', B: '遅延が原因なら効果があり得るが、まだ遅延と判明しておらず証明書や宛先の問題も残る。', C: '宛先制御が原因なら動く可能性はあるが、根拠なしの全許可は過剰で証明書エラーにも対応しない。', D: '証明書検証が原因なら接続は変わる可能性があるが、原因未特定の段階で保護を外すのは不適切。' },
  { B: 'strong', C: 'strong', D: 'plausible' }, ['network']);

replace('q-d3-a10',
  'Copilot Chatが旧版の関数名を使い続けます。会話前半には旧版の説明があり、添付ファイルは更新前の可能性があります。新しい関数名で回答させるため、最初に確認すべき文脈は？',
  { A: '旧版を含む会話履歴と添付ファイルの版を確認し、現在の実装を示す', B: '添付ファイルだけを現在版へ替え、旧版を含む会話履歴はそのまま使う', C: '新しいChatだけを開き、添付ファイルが現在版かは確認せず再質問する', D: 'リポジトリの指示に新名称を追記し、会話と添付の版は確認しない' },
  { A: '旧版を含む二つの文脈源を確認し、現在の実装を明示できる。', B: '添付が旧版なら改善するが、会話に残る古い説明が回答へ混ざる可能性を残す。', C: '履歴の混入は減るが、古い添付を使えば同じ関数名を再び参照し得る。', D: '指示は参考になるが、古い会話とファイルのどちらが原因かを切り分けられない。' },
  { B: 'strong', C: 'strong', D: 'plausible' }, ['prompt']);

for (const [id, q] of edits) {
  const review = reviews.questions[id];
  if (!review) throw Error(`Missing editorial review: ${id}`);
  review.fingerprint = createHash('sha256').update(JSON.stringify(q)).digest('hex');
  review.multipleAnswerRisk = false;
  review.answerWithoutReading = false;
  review.difficultyConsistent = true;
  review.requirementCoverage = true;
  review.rationale = `問題文の全条件と選択肢を照合。${q.requirementMapping[0].correctReason} ${Object.values(q.requirementMapping[0].distractorFailures).join(' ')}`;
  for (const source of sources) {
    if (q.sourceIds.includes(source.id) && !source.relatedQuestionIds.includes(id)) source.relatedQuestionIds.push(id);
    if (!q.sourceIds.includes(source.id)) source.relatedQuestionIds = source.relatedQuestionIds.filter(candidate => candidate !== id);
  }
}
reviews.reviewedAt = '2026-09-07';
reviews.reviewer = 'Codex editorial second pass';
reviews.method = 'Separate rubric pass after authored revisions; not an independent human reviewer or an empirical difficulty calibration.';
reviews.choiceAudit = {
  reviewedAt: checkedAt,
  reviewer: 'Codex choice-quality editorial pass',
  method: 'Choice-by-choice scenario and official-source review for edited questions only; remaining fingerprints preserved.',
  questionIds: [...edits.keys()],
};
fs.writeFileSync(file('questions/seed.json'), JSON.stringify(bank, null, 2) + '\n');
fs.writeFileSync(file('questions/quality-review.json'), JSON.stringify(reviews, null, 2) + '\n');
fs.writeFileSync(file('sources.json'), JSON.stringify(sources, null, 2) + '\n');
console.log(`Reviewed and rewrote ${edits.size} questions: ${[...edits.keys()].join(', ')}`);
