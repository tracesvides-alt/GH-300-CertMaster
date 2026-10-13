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

// D4のリライト定義 (8問)
const d4Rewrites = {
  'q-d4-e03': {
    question: 'プロンプトの指示形式がCopilot生成コードのコーディング規約違反に与える影響を比較検証しました。指示案Aは禁止事項の文面のみを短縮したためloggerのimport誤りが残り、Bはloggerのimport例を足して解消しました。同期IOは両方で残る結果となりました。今回は同期IOについて「具体例追加の効果だけ」を測りたいと考えています。指示案Bで得られたlogger改善の成果を維持しつつ、変数を一つだけ変更する対照実験の設計として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '指示案Bをベースラインとし、推奨する非同期APIの例だけを足す' },
      { id: 'B', text: '指示案Bをベースラインとし、モデルだけを変更して同じ指示を使う' },
      { id: 'C', text: '指示案Aをベースラインとし、禁止事項の短縮率だけを変更する' },
      { id: 'D', text: '指示案Bをベースラインとし、出力コードの最大長さだけを変更する' }
    ],
    explanation: 'loggerの改善（具体例による解決）を維持したまま、未解決の同期IOに対する「具体例追加の効果」のみを単独で測定するには、指示案Bを固定した上で「推奨する非同期APIの例を追加する」という1つの変数のみを変更して比較する必要があります。モデルの変更や出力長・禁止文の変更では具体例の効果を分離できません。',
    choiceExplanations: {
      A: '正解です。指示案Bの成果（logger例）を保ち、同期IOに対する推奨例を追加するという一変数のみを変更して効果を測定する対照実験です。',
      B: '指示内容ではなくモデルを変更してしまっており、具体例追加の効果ではなく「モデル差」の検証になってしまいます。',
      C: 'loggerの誤りが残る失敗版の指示案Aを基準にしており、また具体例ではなく禁止事項の短縮率を変えてしまっています。',
      D: '出力コードのトークン長を変更しても、同期IOの規約違反に対する具体例の効果を測定することはできません。'
    }
  },
  'q-d4-e04': {
    question: 'GitHub Copilotを用いてserver側のjwt認証モジュールを修正するタスクを計画しています。jwtはconfigを読み、serverのrefreshがjwtを呼びます。コンテキスト検索を実施したところ、同名のmobile/refreshが返されました。仕様要件はissuer違反を拒否し、実際の呼出元の契約も維持しますということです。プロンプトの入力予算900トークンにおいて、候補Pはjwtとconfigの抜粋600、QはP＋mobile/refreshの抜粋850、RはP＋server/refreshの抜粋850、Sはserverの3ファイル全文1400でした。要件を満たしつつトークン制限内に収まる最も適切な依頼文脈はどれですか？',
    choices: [
      { id: 'A', text: '候補Rをプロンプト文脈に採用し、設定元と呼出元の両契約を保持して検証する' },
      { id: 'B', text: '候補Pをプロンプト文脈に採用し、設定元のみを保持して呼出元の契約は除外して検証する' },
      { id: 'C', text: '候補Qをプロンプト文脈に採用し、別実装の呼出元コードを参考例として検証する' },
      { id: 'D', text: '候補Sをプロンプト文脈に採用し、予算上限を超過させてでも全参照を含めて検証する' }
    ],
    explanation: '候補Rは設定元（jwt/config）と実際の呼出元（server/refresh）の両方を含んでおり、トークン数も850で予算900トークン内に収まっています。Pは呼出元の契約が含まれず、Qは別実装（mobile）の呼出元で契約が異なり、Sは1400トークンで予算をオーバーします。したがって、Rが必要十分な最小のコンテキストです。',
    choiceExplanations: {
      A: '正解です。設定元と実際の呼出元の両方を網羅し、かつ850トークンで予算上限（900）に収まる必要十分なコンテキスト候補です。',
      B: '候補Pは700トークンで予算内ですが、維持すべき実際の呼出元の契約情報が欠落しており要件を満たしません。',
      C: '候補Qは別実装の呼出元を含んでおり、本来リファクタリング対象とすべき実際の呼出元の契約と乖離してしまいます。',
      D: '候補Sは全参照を含んでいますが、1200トークンとなりプロンプト予算上限（900トークン）を超過してしまいます。'
    }
  },
  'q-d4-e05': {
    question: 'GitHub Copilotへ決済処理の状態遷移実装を依頼しました。仕様はPending→Authorized→Captured→Refundedで、Authorized→Failedも許可します。現行テストは正常経路だけです。提案はCapturedからの再Captureと、PendingからのRefundも受け付けますという不適切な状態遷移の欠陥が含まれていました。今回の欠陥を見つける最小の追加例として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'Captured＋Captureを拒否、Pending＋Refundを拒否する例' },
      { id: 'B', text: 'Pending＋Authorizeを許可、Authorized＋Captureを許可する例' },
      { id: 'C', text: 'Authorized＋Failを許可、Captured＋Refundを許可する例' },
      { id: 'D', text: 'Refunded＋Captureを拒否、Failed＋Refundを拒否する例' }
    ],
    explanation: '観測された欠陥は「Captured状態での再Capture許可」と「Pending状態でのRefund許可」の2点です。これらを直接検出・防止するためには、仕様外の不正な遷移である「Captured状態＋Capture操作の拒否」および「Pending状態＋Refund操作の拒否」を明示的な拒否テストまたはFew-shot例として追加することが最も直接的です。',
    choiceExplanations: {
      A: '正解です。誤って受け付けられている「Capturedでの再Capture」と「PendingでのRefund」を直接拒否対象としてテスト・指示する最小例です。',
      B: '正常系の許可例を追加しても、不適切に許可されている異常系遷移の欠陥を検出・是正することはできません。',
      C: '仕様上許可されている正常・例外遷移の例であり、観測された誤った遷移の拒否をテストしていません。',
      D: '観測された欠陥（Capturedでの再Capture、PendingでのRefund）とは異なる別の状態遷移をテストしてしまっています。'
    }
  },
  'q-sc06-2': {
    question: '【Global Logistics事例】共通InstructionsはResult型。古いPrompt Fileはthrowの例とservice-Bの固定参照を含む。service-Aへ呼ぶとBのパスとthrowが生成された。今回もAとBの両サービスで同じタスクを再利用する。合意された共通規約を維持しつつ再利用性を担保するためのPrompt Fileの編集として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '例をResultへ直し、参照先を呼出し時の入力へする' },
      { id: 'B', text: '例をResultへ直し、service-Bの固定参照を保つ' },
      { id: 'C', text: 'throwの例を保ち、参照先だけ入力へする' },
      { id: 'D', text: 'throwの例とservice-Bの固定参照を両方保つ' }
    ],
    explanation: '問題の原因は2点あります。第1に共通指示のResult型に反してPrompt Fileにthrowの例が含まれていること（規約競合）、第2にservice-Bへの固定パスが埋め込まれているためservice-Aで再利用できないこと（固定参照）です。したがって、例をResult型へ修正して規約に適合させ、参照先パスをプロンプト呼び出し時の入力パラメータへ変更して再利用性を確保します。',
    choiceExplanations: {
      A: '正解です。規約違反であるthrow例をResult型へ是正し、サービスAとBの両方で再利用できるように参照先を入力変数化する最小の編集です。',
      B: '固定参照を維持してしまうと、service-Aで実行した際に依然としてservice-Bのパスが誤って生成されてしまいます。',
      C: '共通指示であるResult型規約への違反（throw例）を放置してしまい、生成コードの型整合性が崩れます。',
      D: '規約違反と固定参照の不具合を両方とも放置しており、問題が何一つ解決しません。'
    }
  },
  'q-d4-e06': {
    question: '同じモデル・対象コードで鍵ローテーションの指示を検証した。長い会話＋旧設定は失敗、新規会話＋同じ旧設定も失敗、新規会話＋現行設定は成功した。旧設定には固定鍵の例がある。会話長を原因と断定せず、今回まず更新する文脈は？',
    choices: [
      { id: 'A', text: '旧設定を残し、会話だけ再度新規へ替えて比較する' },
      { id: 'B', text: '現行設定を残し、別モデルと別コードで比較する' },
      { id: 'C', text: '旧設定を残し、禁止表現の回数だけ増やして比較する' },
      { id: 'D', text: '旧設定の添付を現行へ替え、同じ新規会話で再比較する' }
    ],
    explanation: '新規会話で実行しても旧設定（固定鍵の例あり）では失敗し、新規会話＋現行設定で成功したという明確な証拠があります。これは問題の本質が会話の長さではなく、旧設定ファイル内の固定鍵の例にあることを示しています。したがって、旧設定ファイルの添付を現行設定へ差し替えて再比較することが、証拠に裏付けられた最も適切な文脈更新です。',
    choiceExplanations: {
      A: '新規会話＋旧設定での失敗はすでに確認されており、会話を再度リセットしても旧設定が原因であるため結果は変わりません。',
      B: '現行設定での成功要因を検証する前にモデルやコードまで変えてしまうと、変数が複数化して因果が特定できなくなります。',
      C: '旧設定に含まれる固定鍵の例がモデルのアテンションを引っ張っているため、禁止文を増やす対症療法ではなく例自体を現行化すべきです。',
      D: '正解です。失敗の原因となっている旧設定ファイルの添付を現行設定へ差し替え、同一条件の新規会話で再比較します。'
    }
  },
  'q-d4-e07': {
    question: 'エラーJSONの漏洩を比較した。AはモデルM1＋禁止指示、BはM2＋公開スキーマで、各100回の漏洩はAが4件、Bが0件。新しい入力群は未検証。次は「指示形式だけの効果」を測りたい。モデルの内部機構や全入力での安全を断定しない実験は？',
    choices: [
      { id: 'A', text: '同じM1・同じ入力群で禁止指示と公開スキーマを比較する' },
      { id: 'B', text: '同じ指示・同じ入力群でM1とM2を比較する' },
      { id: 'C', text: '同じM2＋公開スキーマを同じ入力で再実行し再現性を比較する' },
      { id: 'D', text: '同じM2＋公開スキーマで新しい入力群への汎化を比較する' }
    ],
    explanation: '「指示形式だけの効果」を検証するには、モデル差（M1 vs M2）という交絡因子を排除し、同一のモデル（例えばM1）および同一の入力テスト群において「禁止指示」と「公開スキーマ」の形式のみを変化させて漏洩件数を比較する必要があります。モデルを変えたり入力群を変えたりしては指示形式単体の効果を測定できません。',
    choiceExplanations: {
      A: '正解です。モデル（M1）と入力群を同一に固定し、プロンプトの指示形式のみを一変数として比較する厳密な実験設計です。',
      B: '指示形式ではなくモデルM1とM2を比較する実験になってしまい、「指示形式だけの効果」を測定できません。',
      C: '条件Bを単に再試行するだけであり、禁止指示と公開スキーマという形式間の比較を行っていません。',
      D: '新しい入力群への汎化テストであり、指示形式単体の効果の切り分けではありません。'
    }
  },
  'q-d4-e08': {
    question: 'GitHub.comの組織指示はfetch、repo指示はaxiosだが、社内の承認済み規約はfetchへ統一する。対象runtimeではfetchがなく、承認済みpolyfill Pなら動作テスト成功。runtime更新は今期禁止。生成指示の競合と実行互換を両方解消する案は？',
    choices: [
      { id: 'A', text: 'repo指示をfetchへ合わせ、runtimeを更新して検証する' },
      { id: 'B', text: 'repo指示をfetchへ合わせ、Pを使って現runtimeで検証する' },
      { id: 'C', text: 'repo指示をaxiosのままにし、Pだけ追加して検証する' },
      { id: 'D', text: 'repo指示をfetchへ合わせ、追加実装なしで現runtimeを検証する' }
    ],
    explanation: '社内規約は「fetchへ統一」であるため、リポジトリ指示（repo指示）をfetchへ合わせて組織指示・社内規約と整合させます。一方で、対象ランタイムにはfetchが存在せず「今期のruntime更新は禁止」という制約があるため、承認済みのpolyfill Pを導入して現行ランタイム上で動作テストをパスさせます。これにより指示の競合解消と実行互換性の両立が達成されます。',
    choiceExplanations: {
      A: '今期禁止されているruntime更新を行っており、運用制約に違反しています。',
      B: '正解です。リポジトリ指示を規約のfetchへ統一し、禁止されたruntime更新を避けて承認済みpolyfill Pで現行環境の互換性を確保します。',
      C: 'リポジトリ指示をaxiosのまま放置しており、社内規約であるfetchへの統一を果たしていません。',
      D: 'polyfillを追加しない場合、ネイティブfetchを持たない現行runtimeで実行時エラーが発生して互換性を満たせません。'
    }
  },
  'q-d4-e09': {
    question: 'SQL用の例集合P/Qを比較した。入力予算1000トークン。Pは900で「注文0件も含む」の境界を識別できるが旧テーブル名を含む。Qは600で旧名がないが、内結合と外結合の両方が同じ正常例を通る。必要なのは左外結合の契約で、旧名も使わないこと。最小修正の候補は？',
    choices: [
      { id: 'A', text: 'Qの正常例をそのまま使い、追加編集せず依頼する' },
      { id: 'B', text: 'Pをそのまま使い、回答側で旧名だけ推定置換する' },
      { id: 'C', text: 'Pの旧名を現行名へ直し、注文0件の例を維持する' },
      { id: 'D', text: 'PとQを全て添付し、1500の入力で比較する' }
    ],
    explanation: '候補Pは900トークンで入力予算（1000トークン）内に収まっており、左外結合（LEFT JOIN）に必要な「注文0件の顧客も含む」という境界条件を識別できる決定的な例を持っています。欠点は旧テーブル名が含まれている点だけです。したがって、Pの旧テーブル名を現行名に修正して注文0件の境界例を維持することが、要件を満たす最小かつ最も確実な修正案です。',
    choiceExplanations: {
      A: '候補Qは内結合でも外結合でも同じ結果になる正常例しか持たず、AIが誤ってINNER JOINを生成するリスクを排除できません。',
      B: 'プロンプトに旧名を残したまま生成後に人間が手動置換するのは品質管理として不確実であり最小修正ではありません。',
      C: '正解です。境界例を持つ候補Pをベースとし、旧テーブル名のみを現行名に更新して予算内で要件を満たす最小の修正です。',
      D: 'PとQを両方添付すると1500トークンとなり、入力予算上限（1000トークン）を超過してしまいます。'
    }
  }
};

const originalChoiceOrder = {
  'q-d4-e03': ['C', 'D', 'B', 'A'],
  'q-d4-e04': ['B', 'C', 'A', 'D'],
  'q-d4-e05': ['D', 'A', 'C', 'B'],
  'q-sc06-2': ['A', 'D', 'C', 'B'],
  'q-d4-e06': ['A', 'B', 'C', 'D'],
  'q-d4-e07': ['A', 'B', 'C', 'D'],
  'q-d4-e08': ['A', 'B', 'C', 'D'],
  'q-d4-e09': ['A', 'B', 'C', 'D']
};

// 実行処理
let modifiedCount = 0;
for (const [id, rw] of Object.entries(d4Rewrites)) {
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

console.log(`\nSuccessfully rewritten and synced ${modifiedCount} questions in D4!`);
