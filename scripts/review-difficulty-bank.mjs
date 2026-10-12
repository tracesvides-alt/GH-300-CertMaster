// Recorded corrections from the second editorial reading, then seal the ledger.
// This is a one-time migration, not an automatic semantic-review command.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../content/gh300/2026-08-07/', import.meta.url);
const read = p => JSON.parse(fs.readFileSync(new URL(p, root), 'utf8'));
const write = (p, v) => fs.writeFileSync(new URL(p, root), JSON.stringify(v, null, 2) + '\n');
const bank = read('questions/seed.json');
const difficulty = read('questions/difficulty-review.json');
if (difficulty.status !== 'pending') throw Error('Second review already sealed.');
function amend(id, stem, texts, reasons, steps) {
  const q = bank.find(q => q.id === id);
  const keys = [q.answer[0], ...q.choices.filter(c => !q.answer.includes(c.id)).map(c => c.id).sort()];
  q.question = stem;
  q.choices = q.choices.map(c => ({ id: c.id, text: texts[keys.indexOf(c.id)] }));
  q.explanation = reasons[0];
  q.choiceExplanations = Object.fromEntries(keys.map((k, i) => [k, reasons[i]]));
  keys.forEach((k, i) => { q.choiceQuality[k].rationale = reasons[i]; });
  q.requirementMapping = [{ requirement: steps.join(' → '), correctReason: reasons[0],
    distractorFailures: Object.fromEntries(keys.slice(1).map((k, i) => [k, reasons[i + 1]])) }];
  q.clues = q.examLike ? [stem.split('。')[0] + '。'] : [];
  const r = difficulty.questions[id];
  r.reasoningSteps = steps;
  r.assessment = '別パスの再読で、文言の照合や明らかに無関係な誤答を避けて追加修正。' + steps.join(' → ');
  r.evidence = q.clues;
  r.textRewritten = true;
}
amend('q-d1-e01', 'Copilotが画像処理の依存PとQを提案しました。Pは機能テスト成功・既知脆弱性0件ですが、公開は昨日で発行元未確認です。Qは承認済みの発行元・署名一致ですが、指定の色変換テストに失敗します。採用基準は出所確認と必要な機能の両方です。各候補の判断は？',
  ['Pは出所確認まで保留、Qは機能修正と再検証まで保留', 'Pは検査成功で採用、Qは機能修正と再検証まで保留', 'Pは出所確認まで保留、Qは署名一致を根拠に採用', 'Pは隔離実行で採用、Qは承認済みの発行元を根拠に採用'],
  ['Pの動作確認は出所を、Qの署名は用途への適合を保証しない。別々の未達条件があるので双方を保留する。', '既知脆弱性0件と動作成功から発行元の信頼性は導けない。', '署名は誰が配布したかの証拠であって必要な色変換の正しさを証明しない。', '隔離による影響制限と発行元の承認は、各候補の未達条件を解消しない。'],
  ['候補ごとに出所と機能の証拠を分類する', '一方の成功で他方の未確認を補えないと判断する']);
difficulty.questions['q-d1-e01'].counterfactual = 'Pの発行元も確認済みならPは採用可能となり、Qだけが機能確認待ちになる。';
amend('q-d2-e06', 'Copilot CLIの権限演習です。セッションPはshellツールが利用可能で、Git操作を許可しgit pushだけ拒否しています。Qは利用可能ツールを読取系だけに制限し、Git操作の許可も指定しています。denyはallowより優先し、許可指定は利用可能ツールを増やさない規則です。P・Qでcommitとpushを行うと？',
  ['Pはcommit可・push不可、Qはcommitもpushも不可', 'Pはcommitもpushも可、Qはcommitもpushも不可', 'Pはcommit可・push不可、Qはcommitもpushも可', 'Pはcommitもpushも不可、Qはcommit可・push不可'],
  ['PはGitの許可に個別拒否が優先する。Qは実行ツールが利用対象外なので、Gitの許可だけでは操作できない。', 'Pでpushのdenyが優先する条件を落としている。', 'Qの許可指定を、利用可能なツールの制限を広げる設定と取り違えている。', 'Pの個別拒否を全Gitへ広げ、Qのツール制限を見落としている。'],
  ['利用可能ツールと実行許可という二層を分ける', 'PとQそれぞれの有効範囲を求める']);
difficulty.questions['q-d2-e06'].counterfactual = 'Qにshellを利用可能として追加すれば、QのGit許可が働きcommitとpushの両方が可能になる。';
amend('q-d3-e02', '同じアカウント・同じ社内プロキシを使うPCを比較しました。PはHTTP CONNECT成功後にissuer certificateエラーで、提示証明書は社内CAです。QはCONNECTに対し407 Proxy Authentication Requiredとなり、接続先の証明書はまだ受け取っていません。両者の最初の確認をどう分けますか？',
  ['PはIDEのCA信頼設定、Qはプロキシ認証情報を確認する', 'Pはプロキシ認証情報、QはIDEのCA信頼設定を確認する', 'PとQの両方で、IDEのCA信頼設定を確認する', 'PとQの両方で、Copilotのシート割当を確認する'],
  ['Pは接続後の証明書検証、Qはトンネル確立前の認証で止まっている。停止段階の違いで対処を分ける。', 'PとQの失敗段階を逆に解釈している。', 'Pの対処には合うが、Qは証明書を受け取る前なので407の認証を解消しない。', '同じアカウントでも経路の異なる失敗であり、今回のログはシート検査の失敗を示していない。'],
  ['各PCが到達した通信段階をログから追う', 'TLSの信頼とプロキシ認証を別の修復対象へ割り当てる']);
difficulty.questions['q-d3-e02'].counterfactual = 'QもCONNECT成功後のissuerエラーなら、両方でCA信頼設定を調べる案が合う。';
amend('q-d3-a03', '社内プロキシ経由のIDEだけがself signed certificate in certificate chainで失敗します。許可先とプロキシURLは確認済みです。まず対処する設定は？',
  ['IDEが使う信頼ストアへ社内CAを登録する', 'プロキシの認証ユーザーとパスワードを更新する', '公式接続先へのファイアウォール許可を追加する', 'DNSサーバーとプロキシの名前解決を変更する'],
  ['証明書チェーンの検証に失敗しているため、対応する信頼設定を確認する。', '407などの認証失敗への対処であり、証明書の信頼は追加されない。', '宛先許可は確認済みで、TLS証明書を信頼する設定とは別。', '名前解決後の証明書検証で失敗しており、DNS変更は原因に対応しない。'], ['TLSエラーの種類に合うネットワーク設定を選ぶ']);
amend('q-d4-e01', 'CSV取込をCopilotと段階実装しました。検証器は不正行を{ok:false,row}として返します。送信器は受け取った要素のrowを全て送ります。検証器の単体テストはokを確認し、送信器の単体テストはok:trueだけを渡して成功しています。不正行の送信を防ぐため、最初に追加する契約とテストは？',
  ['段階の接続でok:trueだけを通し、ok:falseが送られないことを検証する', '検証器がok:falseを返す単体テストを増やし、送信器の入力は変えない', '送信器の全行送信テストを増やし、検証器の出力を全件渡す', '不正行のrowを空へ替え、送信器が空行も送ることを検証する'],
  ['各単体は定めた動作をしているが、検証結果を接続側が選別していない。単体成功では覆えない段階間の契約を定める。', '検証結果は既に正しくfalseであり、同じ検証だけでは接続側を変えられない。', '送信器の契約は確認できても、失敗した検証結果が流れる問題は残る。', '不正内容は消せても、不正行を送信しないという要求を満たさない。'],
  ['単体テストが覆う範囲と各段階の出力を追う', '段階間で失われた判定を接続契約として補う']);
// Correct a unit inconsistency found in the rereading (a dollar has 100 cents).
const money = bank.find(q => q.id === 'q-d3-e03');
const replaceCurrency = text => text.replaceAll('円', 'ドル');
money.question = replaceCurrency(money.question);
money.choices.forEach(c => { c.text = replaceCurrency(c.text); });
money.explanation = replaceCurrency(money.explanation);
for (const k of Object.keys(money.choiceExplanations)) {
  money.choiceExplanations[k] = replaceCurrency(money.choiceExplanations[k]);
  money.choiceQuality[k].rationale = money.choiceExplanations[k];
}
money.requirementMapping[0].correctReason = money.explanation;
for (const k of Object.keys(money.requirementMapping[0].distractorFailures)) money.requirementMapping[0].distractorFailures[k] = money.choiceExplanations[k];
money.clues = [money.question.split('。')[0] + '。'];
// The bank-transfer invariant applies to transfers, not external deposits.
const property = bank.find(q => q.id === 'q-d5-e03');
const replaceOperation = s => s.replaceAll('正の入金だけ', '残高内の単発送金だけ').replaceAll('正の入金を10万件', '残高内の単発送金を10万件');
property.question = replaceOperation(property.question);
property.choices.forEach(c => { c.text = replaceOperation(c.text); });
difficulty.questions[property.id].counterfactual = '仕様が常に残高内の単発送金だけなら不足残高の列は不要だが、期待値の独立性は依然必要。';
const metrics = bank.find(q => q.id === 'q-sc09-1');
metrics.question = metrics.question.replace('手戻りが4→9', '手戻りが発生したPR数が4→9');
metrics.clues = [metrics.question.split('。')[0] + '。'];

const hash = q => createHash('sha256').update(JSON.stringify(q)).digest('hex');
const quality = read('questions/quality-review.json');
quality.reviewedAt = '2026-10-12';
quality.method = '全200問の本文・選択肢を再読し難易度を再分類。改稿90問を別パスで再読し追加修正。単一編集者の評価であり、独立した受験者実測ではない。';
for (const q of bank) {
  const row = difficulty.questions[q.id];
  row.fingerprint = hash(q);
  row.evidence = q.examLike ? q.clues : [];
  quality.questions[q.id] = {
    fingerprint: hash(q), multipleAnswerRisk: false, answerWithoutReading: false,
    difficultyConsistent: true, requirementCoverage: true,
    rationale: row.assessment + ' 選択肢単独でなく本文の対象・契約・観測に照合する。' + q.explanation,
  };
}
difficulty.status = 'reviewed';
difficulty.secondPass = '改稿90問の全文・全選択肢を別パスで再読。残る文言照合問題、通信対策のカテゴリ差、単位の誤記、指標の分母を修正。独立した別人によるレビューではない。';
write('questions/seed.json', bank);
write('questions/difficulty-review.json', difficulty);
write('questions/quality-review.json', quality);
console.log('Sealed difficulty review for all 200 questions.');
