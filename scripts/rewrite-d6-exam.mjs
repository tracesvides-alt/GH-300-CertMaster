import fs from 'fs';
import { createHash } from 'crypto';
import { examLengths } from './audit-exam-question-review.mjs';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

const seedPath = 'content/gh300/2026-08-07/questions/seed.json';
const examRepPath = 'reports/exam-question-quality-review.json';
const diffRepPath = 'content/gh300/2026-08-07/questions/difficulty-review.json';
const qualRepPath = 'content/gh300/2026-08-07/questions/quality-review.json';
const classRepPath = 'reports/question-objective-classification-review.json';
const addsRepPath = 'content/gh300/2026-08-07/questions/additions-review.json';

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const examRep = JSON.parse(fs.readFileSync(examRepPath, 'utf8'));
const diffRep = JSON.parse(fs.readFileSync(diffRepPath, 'utf8'));
const qualRep = JSON.parse(fs.readFileSync(qualRepPath, 'utf8'));
const classRep = JSON.parse(fs.readFileSync(classRepPath, 'utf8'));
const addsRep = JSON.parse(fs.readFileSync(addsRepPath, 'utf8'));

// D6のリライト定義 (6問)
const d6Rewrites = {
  'q-d3-e04': {
    question: '機密ファイルに対するコンテンツ除外ポリシー（Content Exclusion）の保護範囲を検証しました。同じ機密パスにContent Exclusionを設定しました。通常補完では除外表示が出て提案が止まりますが、IDEのAgentではファイル読取ツールが成功します。パス一致と反映は確認済みで、この環境のAgentは除外非対応です。この観測を踏まえ、機密漏洩を防ぐ最小の境界対策として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '補完除外を保ち、Agentから機密へのアクセスを分離する' },
      { id: 'B', text: '実際の対象に一致する除外パスを登録し、表示を再確認する' },
      { id: 'C', text: 'セッションを再読込し、除外の設定反映を再確認する' },
      { id: 'D', text: '通常補完の対象外タブを閉じ、入力文脈を縮小する' }
    ],
    explanation: 'Content Exclusionの設定やパス一致、反映は確認済みであり通常補完では正しく除外が機能しています。しかし実行環境のAgentモードが除外ポリシーに未対応である場合、Agentのファイルアクセスツール経由で機密が読み取られてしまいます。設定の再登録やセッション再読込ではなく、通常補完の除外を維持した上で、Agentがアクセスできるファイルシステムの権限や実行環境をOS/コンテナ層で物理的に分離・制限することが必要な境界対策です。',
    choiceExplanations: {
      A: '正解です。通常補完での除外を維持しつつ、非対応のAgentに対してはOSやコンテナ環境のファイル権限を制限してアクセスを遮断します。',
      B: '除外パスはすでに正しく一致しており通常補完で機能しているため、パスの再登録を行ってもAgentの非対応問題は解決しません。',
      C: '反映はすでに確認済みであり、セッションを再読み込みしても非対応のAgentツールが対応するわけではありません。',
      D: 'エディタタブを閉じても、Agentがファイルシステムから直接ファイルを読み出す動作を制限することはできません。'
    }
  },
  'q-d6-e01': {
    question: '機密リポジトリに対するContent Exclusionの適用をテストしました。同一ファイルに対し、通常補完①は再読込済みで除外表示が出ます。②は別workspaceのシンボリックリンク経由で読取あり、③はこの環境で除外非対応のIDE Agentで読取あり。設定の実パス一致と反映は確認済みです。②および③の漏洩リスクが、Content Exclusionの追加パス登録だけでは解決しない根本的な理由として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '②はリンク経由、③は非対応モードという別の限界' },
      { id: 'B', text: '②③とも実パスの登録漏れという同じ設定不足' },
      { id: 'C', text: '②③とも旧セッションの伝播待ちという同じ遅れ' },
      { id: 'D', text: '②③とも公開コード一致の出力検出という同じ現象' }
    ],
    explanation: '②はシンボリックリンク経由で別ワークスペースから参照されているため、リポジトリルートを基準としたパス評価境界をすり抜けています。③は使用しているIDE Agentモード自体がContent Exclusionに対応していない機能的な限界です。どちらも設定パスの不一致や登録漏れではなく、Content Exclusionが前提とする評価境界の外側にある異なる限界であるため、パスの追加登録だけでは解決しません。',
    choiceExplanations: {
      A: '正解です。②はリンクによる境界のすり抜け、③は実行モード自体の非対応という、Content Exclusionの別々の限界を正確に捉えています。',
      B: '実パスの一致と設定反映はすでに確認されており、単なるパス登録漏れではありません。',
      C: '通常補完①で除外が機能していることから設定はすでに反映されており、伝播遅延ではありません。',
      D: '公開コード一致ポリシー（Public Code Filter）とは全く異なる、入力側のContent Exclusionの保護境界の問題です。'
    }
  },
  'q-d6-e03': {
    question: 'Block設定前に採用したPの参照通知はcommit 7aのGPLを示し、現HEADだけMITへ変わった。Qは設定後の提案で通知がなく出所未確認。架空の社内基準は審査済みMITだけ採用し、出所不明は保留。現在の証拠に基づく審査として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'Pは基準外として保留、Qは出所審査まで保留' },
      { id: 'B', text: 'Pは採用候補、Qは出所審査まで保留' },
      { id: 'C', text: 'Pは基準外として保留、Qは採用候補' },
      { id: 'D', text: 'PもQも採用候補として次の性能審査へ進む' }
    ],
    explanation: 'コードPの参照通知が示したのはcommit 7a時点のコードであり、その時点のライセンスはGPLでした。最新のHEADがMITに変更されていても、通知された版（7a）がGPLである以上、社内基準（審査済みMITのみ承認）を満たさず保留となります。一方、コードQはBlock設定後の提案ですが、通知がないことは「出所が確認された」ことを意味するわけではなく出所不明であるため、同様に出所審査まで保留となります。',
    choiceExplanations: {
      A: '正解です。コードPは通知されたコミット時点のGPLに基づき保留とし、コードQは出所未確認のため保留とする、社内基準に厳格に沿った審査です。',
      B: 'コードPについて最新HEADのMITを過去のコミット7aへ遡及適用してしまっており、ライセンス判定として不適切です。',
      C: '参照通知がないことを出所確認済み・安全と誤認してしまっており、出所不明のコードを誤って承認しています。',
      D: 'ライセンス審査および出所確認の基準を完全に無視して採用候補にしてしまっています。'
    }
  },
  'q-d6-e04': {
    question: 'Businessの審査で根拠を照合する。S1は基盤モデル学習に不使用。対象機能の現行契約S2（架空）は保持30日、古い版は即時削除。社内S3は顧客ログを識別子除去後だけ入力可。三欄「学習利用／保持／入力許可」に記入する組合せとして最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '不使用／30日／識別子除去後に入力可' },
      { id: 'B', text: '不使用／30日／原文のまま入力可' },
      { id: 'C', text: '不使用／即時削除／識別子除去後に入力可' },
      { id: 'D', text: '不使用／即時削除／原文のまま入力可' }
    ],
    explanation: 'それぞれの根拠資料を個別に照合します。S1より「学習利用は不使用」、現行契約S2より「保持期間は30日（古い版の即時削除ではなく現行版の規定）」、社内基準S3より「顧客ログは識別子を除去した後に限り入力可」となります。これら3つの条件を正しく組み合わせた記述が必要です。',
    choiceExplanations: {
      A: '正解です。現行契約S2の保持30日、S1の学習不使用、社内基準S3の識別子除去後許可の3つを正確に反映しています。',
      B: '社内基準S3に反し、個人識別情報を含む顧客ログを原文のまま入力することを許容してしまっています。',
      C: '現行契約S2の規定（保持30日）ではなく、古い版の規定（即時削除）を誤って記入しています。',
      D: '保持期間の版を誤認し、かつ顧客データの入力許可条件も無視しています。'
    }
  },
  'q-sc10-3': {
    question: '【SecureBank Online事例】承認記録はBusiness IDE ChatとMCP-P、仮名化データ、MCPの要求ログ24h・検索結果は保存なし、利用者Devだけ。新版は送信先PとDevを維持し、顧客ID付きデータを送り、要求ログ24h・検索結果30日保存に変更します。GitHub側条件は不変。社内規則は変更項目を追加審査し、不変項目の証跡を再利用します。今回の審査範囲として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '送信データの分類とMCP検索結果の保存を審査し、既存の利用者範囲承認を再利用する' },
      { id: 'B', text: 'MCPの送信先と利用者範囲を審査し、既存のデータ分類承認を再利用する' },
      { id: 'C', text: 'GitHub側の保持と利用者範囲を審査し、既存のMCP取扱い承認を再利用する' },
      { id: 'D', text: '送信データの分類と利用者範囲を審査し、既存のMCP保存条件承認を再利用する' }
    ],
    explanation: '新版申請において変更された項目は「仮名化データ → 顧客ID付きデータへの分類変更」と「検索結果の非保存 → 30日保存への条件変更」の2点です。送信先MCP-P、利用者Dev、要求ログ24h、GitHub側条件は一切変更されていません。社内規則「変更項目のみを追加審査し、不変項目は再利用する」に従い、送信データの分類とMCP検索結果の保存条件の2点のみを審査し、不変の利用者範囲や送信先承認は再利用します。',
    choiceExplanations: {
      A: '正解です。実際に変更された送信データ分類と検索結果保存条件のみを審査対象とし、変更のない利用者範囲の既存承認を再利用します。',
      B: '送信先や利用者範囲は変更されておらず再利用可能であり、逆に変更されたデータ分類を再利用としてスキップしてしまっています。',
      C: 'GitHub側の条件は不変であり審査不要です。MCP側の変更点を審査から落としてしまっています。',
      D: '利用者範囲は変更されていないため再審査不要であり、逆に変更されたMCP保存条件の承認証跡を誤って再利用しようとしています。'
    }
  },
  'q-d6-e07': {
    question: '対象版Copilot CLIの管理Docsは内容除外の適用を示す。通常のファイル取得ではcrypto.tsにexcludedが出て本文は取得されない。一方、外部MCPのログ応答には同じ暗号鍵があり、利用者はそれをChatへ投入しようとしている。入力経路をまたぐ保護として足りない対策として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'MCP返却を保ち、正しい適用先へcrypto.tsの除外を登録' },
      { id: 'B', text: 'MCP返却を保ち、公開コード一致をBlockにする' },
      { id: 'C', text: 'MCP返却を保ち、crypto.tsのGit追跡を外す' },
      { id: 'D', text: 'CLIの除外を保ち、MCPの返却前に暗号鍵を除去' }
    ],
    explanation: 'ローカルファイルシステムからのファイル取得においてはcrypto.tsに対するContent Exclusionが機能して保護されていますが、外部MCPサーバーのツール応答に含まれる機密情報は別の入力経路であり、ファイル除外ポリシーの適用対象外です。異なる入力経路をまたぐ総合的な情報漏洩対策として不足しているのは、MCPサーバー側でレスポンスを返却する前に暗号鍵などの機密情報をサニタイズ（マスキング・除去）するフィルター対策です。',
    choiceExplanations: {
      A: 'crypto.tsの除外はすでに正常に機能しており、除外設定を再登録しても外部MCPからの鍵返却は防げません。',
      B: '公開コード一致ポリシー（Public Code Filter）はGitHub上の公開リポジトリとの一致判定であり、社内暗号鍵の漏洩防止とは無関係です。',
      C: 'Git追跡を外しても、MCPツールが直接ログファイル等を読み取って返却する経路は塞げません。',
      D: '正解です。ファイル除外を維持しつつ、保護の隙間となっている外部MCPツールの返却前サニタイズを実施して機密鍵の流入を遮断します。'
    }
  }
};

const originalChoiceOrder = {
  'q-d3-e04': ['D', 'A', 'B', 'C'],
  'q-d6-e01': ['A', 'D', 'C', 'B'],
  'q-d6-e03': ['B', 'A', 'D', 'C'],
  'q-d6-e04': ['B', 'D', 'C', 'A'],
  'q-sc10-3': ['A', 'C', 'B', 'D'],
  'q-d6-e07': ['A', 'B', 'C', 'D']
};

// 実行処理
let modifiedCount = 0;
for (const [id, rw] of Object.entries(d6Rewrites)) {
  const q = seed.find(x => x.id === id);
  if (!q) {
    console.error(`Question ${id} not found in seed`);
    continue;
  }
  
  // 1. seed更新
  q.question = rw.question;
  const order = originalChoiceOrder[id] || ['A', 'B', 'C', 'D'];
  q.choices = order.map(cid => rw.choices.find(c => c.id === cid));
  q.explanation = rw.explanation;
  q.choiceExplanations = rw.choiceExplanations;

  if (q.requirementMapping && q.requirementMapping[0]) {
    q.requirementMapping[0].requirement = rw.question;
    q.requirementMapping[0].correctReason = rw.explanation;
    for (const [cid, exp] of Object.entries(rw.choiceExplanations)) {
      if (!q.answer.includes(cid)) {
        q.requirementMapping[0].distractorFailures[cid] = exp;
      }
    }
  }

  if (q.choiceQuality) {
    for (const [cid, exp] of Object.entries(rw.choiceExplanations)) {
      if (q.choiceQuality[cid]) {
        q.choiceQuality[cid].rationale = exp;
      }
    }
  }
  
  // cluesチェック
  for (const c of q.clues) {
    if (!q.question.includes(c)) {
      throw new Error(`[${id}] Question does not include clue: "${c}"`);
    }
  }

  // 2. examRep更新
  const repRow = examRep.questions.find(r => r.id === id);
  if (!repRow) throw new Error(`[${id}] Not found in exam review repo`);
  
  const cf = repRow.counterfactual;
  if (!q.question.includes(cf.from)) {
    throw new Error(`[${id}] Question does not include cf.from: "${cf.from}"`);
  }
  const splitCount = q.question.split(cf.from).length;
  if (splitCount !== 2) {
    throw new Error(`[${id}] cf.from appeared ${splitCount - 1} times, must be exactly 1`);
  }
  cf.question = q.question.replace(cf.from, cf.to);
  
  const lengths = examLengths(q);
  repRow.lengths = lengths;
  repRow.after = JSON.parse(JSON.stringify(q));
  repRow.fingerprint = hash(repRow.after);
  
  // distractors更新
  const wrongChoices = q.choices.filter(c => !q.answer.includes(c.id));
  repRow.distractors = wrongChoices.map(wc => {
    const prevDist = repRow.distractors.find(d => d.id === wc.id);
    return {
      id: wc.id,
      text: wc.text,
      whyWrong: q.choiceExplanations[wc.id],
      temptation: prevDist?.temptation || '一般的な誤解に基づく選択肢'
    };
  });

  // 3. diffRep更新
  if (diffRep.questions && diffRep.questions[id]) {
    diffRep.questions[id].fingerprint = hash(q);
    diffRep.questions[id].textRewritten = true;
  }

  // 4. qualRep更新
  if (qualRep.questions && qualRep.questions[id]) {
    qualRep.questions[id].fingerprint = hash(q);
    qualRep.questions[id].after = JSON.parse(JSON.stringify(q));
    qualRep.questions[id].rationale = rw.explanation;
  }

  // 5. classRep更新
  const classRow = classRep.questions?.find((r) => r.id === id);
  if (classRow) {
    classRow.fingerprint = hash(q);
    classRow.after = JSON.parse(JSON.stringify(q));
  }

  // 6. addsRep更新
  const addRow = addsRep.questions?.find((r) => r.id === id);
  if (addRow) {
    addRow.fingerprint = hash(q);
    addRow.after = JSON.parse(JSON.stringify(q));
  }

  modifiedCount++;
  console.log(`[PASS] ${id} rewritten. Length ratio: ${lengths.ratio.toFixed(2)} (pos: ${lengths.position})`);
}

// ファイル書き込み
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + '\n');
fs.writeFileSync(examRepPath, JSON.stringify(examRep, null, 2) + '\n');
fs.writeFileSync(diffRepPath, JSON.stringify(diffRep, null, 2) + '\n');
fs.writeFileSync(qualRepPath, JSON.stringify(qualRep, null, 2) + '\n');
fs.writeFileSync(classRepPath, JSON.stringify(classRep, null, 2) + '\n');
fs.writeFileSync(addsRepPath, JSON.stringify(addsRep, null, 2) + '\n');

console.log(`\nSuccessfully rewritten and synced ${modifiedCount} questions in D6!`);
