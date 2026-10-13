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

// D3のリライト定義 (5問)
const d3Rewrites = {
  'q-d3-e01': {
    question: '同一の大規模言語モデル（LLM）に対して送信した2つのプロンプト依頼を比較検証しました。依頼Pではコンテキストが入力上限内と表示され、指定した全関数名が回答に登場しますが、最後のコードブロックが途中で終了します。依頼Qは入力超過の警告があり、後半の関数名自体が回答に登場しません。それぞれの原因仮説に基づき、出力を改善するために最初に実施すべき対照実験として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '依頼Pは出力させる関数単位を分割して依頼し、依頼Qは入力に含める対象を必要な関数と依存型定義のみに絞り込む' },
      { id: 'B', text: '依頼Pは入力に含める型定義や関数を絞り込み、依頼Qは出力させる関数単位を複数回に分割して依頼する' },
      { id: 'C', text: '依頼PとQの両方について、入力コンテキストはそのまま維持した上で、出力させる関数単位のみを複数回に分割する' },
      { id: 'D', text: '依頼PとQの両方について、入力コンテキストを必要最小限の関数と依存型定義のみに絞り込んで再実行する' }
    ],
    explanation: '依頼Pは入力は収まっており全関数を認識していますが、出力トークンの上限により最後のコードブロックが切れています。一方、依頼Qは入力超過の警告があり、モデルが文脈の後半を読めていません。したがって、Pには「出力分割」、Qには「入力圧縮・絞り込み」という、異なる障害段階に応じた対策を一変数ずつ適用して検証します。',
    choiceExplanations: {
      A: '正解です。出力打ち切りのPには出力単位の分割を、入力容量不足のQには入力トークンの絞り込みを適用する、それぞれの観測に適合した実験です。',
      B: 'PとQに適用すべき対策を完全に取り違えており、入力不足でないPを削り、出力打ち切りでないQを分割しようとしています。',
      C: '入力超過の警告が出ている依頼Qに対して出力分割のみを適用しても、入力コンテキストの欠落は解消されません。',
      D: '出力トークン上限で切れている依頼Pに対して入力を絞り込んでも、出力ブロックの途切れは解決しません。'
    }
  },
  'q-d3-e02': {
    question: '同一のGitHubアカウントおよび同一の社内フォワードプロキシ環境を利用している2台の開発端末（PC-PとPC-Q）の接続状況を比較しました。PはHTTP CONNECT成功後にissuer certificateエラーで、提示証明書は社内CAです。QはCONNECTに対し407 Proxy Authentication Requiredとなり、接続先の証明書はまだ受け取っていません。両端末の停止段階の違いに基づき、最初に実施すべき切り分け対応として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'PはIDEのCA信頼設定を確認し、Qはプロキシ認証用の資格情報設定を確認する' },
      { id: 'B', text: 'Pはプロキシ認証用の資格情報設定を確認し、QはIDEのCA信頼設定を確認する' },
      { id: 'C', text: 'PとQの両端末について、IDE側の社内CA証明書信頼設定およびバンドル設定を確認する' },
      { id: 'D', text: 'PとQの両端末について、プロキシ認証用のユーザー名およびパスワード資格情報を確認する' }
    ],
    explanation: 'PC-PはプロキシのCONNECTトンネル確立には成功しており、その後のTLSハンドシェイクで社内CAの検証エラー（issuer certificate）が発生しています。一方、PC-Qはトンネル確立前の段階でプロキシサーバーから407（Proxy Authentication Required）で拒否されており、接続先証明書を受け取る前段階で停止しています。停止しているプロトコル階層が異なるため、PはCA証明書設定、Qはプロキシ認証資格情報を確認します。',
    choiceExplanations: {
      A: '正解です。TLSハンドシェイク段階で止まっているPにはCA信頼設定を、トンネル確立前のHTTP認証で止まっているQにはプロキシ認証情報を確認します。',
      B: '2台の端末の障害レイヤーを完全に取り違えて調査しようとしています。',
      C: 'PC-Qはプロキシ認証（407）で遮断されており証明書すら受信していないため、CA設定の確認は無意味です。',
      D: 'PC-Pはプロキシ認証を通過してCONNECTに成功しているため、プロキシ認証情報を確認してもissuerエラーは解決しません。'
    }
  },
  'q-sc08-2': {
    question: '【DataFlow Analytics事例】検索で得た説明は旧版のparseOldを引用します。引用先はmainのコミットX、作業ブランチは新しいコミットYです。Yのファイルを明示添付するとparseNewで回答します。同じモデルで比較済みです。現時点で最も支持される診断は？',
    choices: [
      { id: 'A', text: '取得した参照版が違うため、検索範囲と引用元を確認する' },
      { id: 'B', text: '共通指示の旧API指定を確認し、版を固定して比較する' },
      { id: 'C', text: '出力コードの長さを分割し、生成途中の打切りを比較する' },
      { id: 'D', text: '対象APIの実装契約をテストし、実行エラーを比較する' }
    ],
    explanation: '引用先が古いmainブランチ（コミットX）であり、最新の作業ブランチ（コミットY）のファイルを明示添付した場合には正しい新API（parseNew）が回答されたことから、モデルの能力不足や共通指示の問題ではなく、Copilotのコンテキスト検索が古いコミットを参照していることが根本原因です。検索範囲と引用元リビジョンを調査するのが最も妥当な診断です。',
    choiceExplanations: {
      A: '正解です。引用先が古いコミットXであることと明示添付時の成功から、取得した参照リビジョンの差異が原因であると判断します。',
      B: 'Yを明示添付した際には正常に新API（parseNew）が使われているため、共通指示に旧APIの強制記述があるという仮説は否定されます。',
      C: '出力の打ち切りではなく特定メソッド名（parseOld vs parseNew）の選択の問題であり、トークン長とは無関係です。',
      D: 'AIがどの版のコードを参照したかというコンテキスト取得の課題であり、API自体のランタイム実行テストではありません。'
    }
  },
  'q-d3-e06': {
    question: '同じ社内CAをOSへ登録したPC-AとBを比較する。AのIDE要求は成功。Bの診断はCONNECT成功後にissuerエラー。BではNodeプロセスが追加CA設定を読まず、同じプロセスへCAファイルを渡す一変数実験だけで成功した。検証を保つ最小の恒久対策は？',
    choices: [
      { id: 'A', text: 'Bのプロキシ認証情報を更新し、CONNECTを再確認する' },
      { id: 'B', text: 'BのOS信頼ストアへ社内CAを再登録し、IDE通信を再確認する' },
      { id: 'C', text: 'BのDNS解決先とプロキシURLを変更し、到達性を再確認する' },
      { id: 'D', text: 'Bの対象プロセスへCAファイル設定を適用し、再起動して確認する' }
    ],
    explanation: 'PC-BではOSストアにCAを登録済みであるにもかかわらずNode.jsプロセスがそれを読み込まず失敗し、Nodeプロセスへ明示的にCAファイルを指定する一変数実験で成功しました。したがって、証明書検証のセキュリティを無効化（NODE_TLS_REJECT_UNAUTHORIZED=0等）することなく安全な検証を保つ恒久対策は、Nodeプロセスが参照するCA環境変数（NODE_EXTRA_CA_CERTS等）を設定することです。',
    choiceExplanations: {
      A: 'CONNECTはすでに成功しており、プロキシ認証情報は正常に機能しているため無関係です。',
      B: 'OS信頼ストアにはすでに登録済みですがNodeプロセスがそれを参照しないことが判明しているため、再登録しても解決しません。',
      C: 'プロキシへの到達性やDNS名前解決はすでに成功（CONNECT成功）しているため、変更の必要はありません。',
      D: '正解です。一変数実験の結果に基づき、Nodeプロセスが確実に社内CAを信頼するようにCAファイル設定を恒久適用します。'
    }
  },
  'q-d3-e07': {
    question: '決済APIの提案を比較した。M1＋引用v1は旧API、M1＋明示添付v2は新API、M2＋引用v1は旧APIだった。作業版はv2。モデル・コード・指示を固定して取得文脈の影響を次に確かめたい。厳密な対照実験を行うための対照群と変更群の組み合わせとして最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'M1＋引用v1を対照、M2＋引用v1を変更群とする' },
      { id: 'B', text: 'M1＋引用v1を対照、M1＋同じ版v2の参照を変更群とする' },
      { id: 'C', text: 'M1＋引用v1を対照、M2＋添付v2を変更群とする' },
      { id: 'D', text: 'M1＋引用v1を対照、旧コードv1と別指示を変更群とする' }
    ],
    explanation: '科学的な対照実験において「取得文脈の影響」のみを検証するためには、モデル（M1）、プロンプト指示、コード条件をすべて固定し、変化させる変数を「取得文脈の参照版（v1 vs v2）」の1点のみに限定する必要があります。したがって、対照群を「M1＋引用v1」、変更群を「M1＋同一モデルで参照版をv2にしたもの」とする組み合わせが唯一の正しい一変数実験です。',
    choiceExplanations: {
      A: 'モデルをM1からM2へ変えてしまっており、取得文脈ではなく「モデル差」を比較する実験になってしまいます。',
      B: '正解です。モデルM1やプロンプトを固定し、参照するコンテキストのバージョン（v1 vs v2）のみを変化させる厳密な対照実験です。',
      C: 'モデル（M1→M2）と文脈版（v1→v2）の2つの変数を同時に変更してしまっており、結果の要因を切り分けられません。',
      D: '指示文やコードを変更してしまっており、文脈の影響を単独で測定できません。'
    }
  }
};

const originalChoiceOrder = {
  'q-d3-e01': ['B', 'D', 'C', 'A'],
  'q-d3-e02': ['A', 'C', 'B', 'D'],
  'q-sc08-2': ['A', 'D', 'B', 'C'],
  'q-d3-e06': ['A', 'B', 'C', 'D'],
  'q-d3-e07': ['A', 'B', 'C', 'D']
};

// 実行処理
let modifiedCount = 0;
for (const [id, rw] of Object.entries(d3Rewrites)) {
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

console.log(`\nSuccessfully rewritten and synced ${modifiedCount} questions in D3!`);
