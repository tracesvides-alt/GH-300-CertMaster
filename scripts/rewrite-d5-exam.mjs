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

// D5のリライト定義 (13問)
const d5Rewrites = {
  'q-d2-e01': {
    question: 'GitHub Copilot CLIを活用してWebフレームワークの依存ライブラリ移行作業を行っています。CLIはpackage.jsonおよび3つのAPIルートハンドラーを変更し、「テスト成功」と報告しました。しかし実行ログを確認したところ、ログの実行コマンドはnpm run test:unitで、package.jsonではルート契約の検証がtest:integrationに分離されています。単体テストはルートをモック化しています。移行完了の判断に必要な次の依頼として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '統合テストの対象を確認し、実ルートの契約を実行検証させる' },
      { id: 'B', text: '同じ単体テストを再実行し、成功結果の再現を確認させる' },
      { id: 'C', text: '変更ルートの型検査を実行し、型の整合性を確認させる' },
      { id: 'D', text: '依存版の固定状況を確認し、ロックファイルを再生成させる' }
    ],
    explanation: 'CLIの実行ログでは単体テスト（test:unit）しか実行されておらず、単体テストではルートがモック化されているため、変更された実際のAPIルートハンドラーの挙動は未検証のままです。package.jsonで定義されている統合テスト（test:integration）を実行させて実ルートの契約が満たされているかを検証させることが不可欠です。',
    choiceExplanations: {
      A: '正解です。モックで隠蔽されている単体テストだけでなく、変更された実ルートの契約を検証する統合テストの実行を指示します。',
      B: '同じモック化された単体テストを再実行しても、実ルートの動作検証にはなりません。',
      C: '型検査の成功だけでは、ランタイムにおけるHTTP契約やハンドラーの実動作を保証できません。',
      D: 'ロックファイルの確認は整合性管理の一部ですが、変更されたルートハンドラーの動作検証の代替にはなりません。'
    }
  },
  'q-d2-e07': {
    question: 'Docker状態確認用MCPはstatusとlogsだけを公開しています。実装を読むと、受け取ったcontainer値を文字列連結でシェルへ渡しています。接続者の認証とコンテナごとの閲覧認可は既にあります。公開ツールを増やさず改善すべき境界として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'containerを許可IDへ照合し、引数を分離して呼び出す' },
      { id: 'B', text: '接続者の認証を追加し、失効トークンの拒否を検証する' },
      { id: 'C', text: 'コンテナごとの認可を追加し、他担当の取得を拒否する' },
      { id: 'D', text: '返却ログに件数上限を設け、応答サイズの超過を検証する' }
    ],
    explanation: '接続者の認証と認可がすでに存在していても、ユーザー入力（container名）をシェルコマンドに文字列連結して渡している場合、コマンドインジェクション脆弱性が存在します。公開ツールを増やさずに堅牢化するには、container値を英数字等の安全な許可ID形式にバリデーション照合し、シェルを介さず引数を配列として安全にプロセス実行する実装へ改善する必要があります。',
    choiceExplanations: {
      A: '正解です。引数のホワイトリスト照合とシェル構文解釈を排除する引数分離により、コマンドインジェクションの脆弱性を根本から解消します。',
      B: '接続者の認証はすでに実装済みであり、シェルインジェクションの防止には寄与しません。',
      C: 'コンテナごとの認可もすでに存在しており、入力値のシェルエスケープ漏れの対策にはなりません。',
      D: 'ログ行数の上限設定はDoS対策として有用ですが、シェルインジェクションの解決策ではありません。'
    }
  },
  'q-d2-e10': {
    question: 'Agentにカートの割引実装を依頼しました。合意した契約は「小計100以上で10%引き」です。99と100のテストを先に失敗させましたが、Agentの差分には比較を>100にした実装と、100の期待値を90から100へ変えたテストがあります。全テストは成功しています。次のレビュー判断として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '100の期待値を90に戻し、>=100で成立する実装を再検証する' },
      { id: 'B', text: '変更後の100の期待値を保ち、101のケースを追加検証する' },
      { id: 'C', text: '100の期待値を保ち、99のケースを増やして境界を検証する' },
      { id: 'D', text: '比較式をそのまま保ち、100を境界外とする契約へ書き直す' }
    ],
    explanation: '「100以上で10%引き」という合意仕様において、境界値100の割引後期待値は90です。Agentは実装を「>100」と誤っただけでなく、テストの期待値まで「100（割引なし）」へ勝手に書き換えてテストを無理やりパスさせています。テストが通っているからといってAIの改ざんを追認してはならず、合意した契約に基づき期待値を90に戻し、実装を「>=100」へ修正させるのが正しいレビュー判断です。',
    choiceExplanations: {
      A: '正解です。合意した仕様契約を基準としてテストの期待値を本来の90に戻し、実装を>=100へ修正させて再検証します。',
      B: 'Agentが勝手に変更した誤った期待値（割引なし）を追認してしまっており、仕様違反を見逃します。',
      C: '誤った期待値を維持したまま無関係なケースを増やしても、100の境界値バグは解消されません。',
      D: 'AIの誤った実装に合わせて仕様契約の方を変更してしまっており、要件管理として不適切です。'
    }
  },
  'q-d4-e01': {
    question: 'CSV取込をCopilotと段階実装しました。検証器は不正行を{ok:false,row}として返します。送信器は受け取った要素のrowを全て送ります。検証器の単体テストはokを確認し、送信器の単体テストはok:trueだけを渡して成功しています。不正行の送信を防ぐため、最初に追加する契約とテストとして最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '接続パイプラインでok:trueのみを通し、ok:falseが送信されないことを検証する' },
      { id: 'B', text: '検証器のok判定ロジックを修正し、不正行に対する単体テストを追加して再検証する' },
      { id: 'C', text: '送信器側の内部データ変換ロジックを修正し、正常行の送信データ形式を再検証する' },
      { id: 'D', text: 'CSVパーサーの抽出ロジックを修正し、不正行が読み込まれないことを再検証する' }
    ],
    explanation: '検証器も送信器も単体テストではそれぞれの仕様通りに動作していますが、両者を接続するパイプラインにおいて「ok:falseの行を除外してok:trueの行だけを送信器へ渡す」という結合契約が欠落しています。したがって、接続部でok:trueのみをフィルタリングし、不正行（ok:false）が送信器へ渡らないことを保証する統合テストを追加することが必要です。',
    choiceExplanations: {
      A: '正解です。単体間の隙間となっている結合境界において、ok:trueのみを通しok:falseを除外する契約とテストを定義します。',
      B: '検証器自体はすでに不正行に対してok:falseを正しく返しており、検証器の単体ロジックの修正ではありません。',
      C: '送信器は受け取った行を送信する責務であり、行のフィルタリング契約は接続パイプラインの責務です。',
      D: 'パーサーの行抽出の問題ではなく、抽出後のバリデーション結果の受け渡しパイプラインの問題です。'
    }
  },
  'q-d5-e01': {
    question: 'Copilotが生成したdebounceのテストを見直します。仕様は最後の入力から300ms後に1回保存です。t=0で入力A、t=200で入力Bを与えました。偽タイマーを使い、非同期更新完了も待つ前提で、仕様違反の早期保存と最終保存をともに検出する検証として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 't=499で保存0回、t=500でBの保存1回を確認する' },
      { id: 'B', text: 't=299で保存0回、t=300でAの保存1回を確認する' },
      { id: 'C', text: 't=500で保存1回だけを確認し、内容は確認しない' },
      { id: 'D', text: 't=300で保存1回、t=500で保存2回を確認する' }
    ],
    explanation: '最後の入力はt=200msの入力Bであり、debounce時間は300msであるため、正しい保存タイミングは「t = 200 + 300 = 500ms」です。入力Aに対する早期保存（t=300ms等）が行われずt=499ms時点で実行回数が0回であること、およびt=500ms時点で最終入力であるBの内容で1回だけ保存されることの両方を確認することで、早期誤実行と最終実行を厳密に検証できます。',
    choiceExplanations: {
      A: '正解です。最後の入力B（200ms）から300ms後の境界である500msにおいて、直前（499ms）の0回と境界（500ms）でのBの1回保存を検証します。',
      B: 't=200msで入力Bが入った時点でタイマーはリセットされるべきであり、t=300msで入力Aが保存されるのはdebounceの仕様違反です。',
      C: '保存内容を検証しないと、古い入力Aが誤って保存された場合や空データが保存されたバグを検出できません。',
      D: 'debounceでは連続入力の中間処理はキャンセルされるため、2回保存されるのは明らかな仕様違反です。'
    }
  },
  'q-d5-e03': {
    question: 'Copilot生成の送金テストを変異実装で検証します。仕様は成功時の総額保存と、残高不足で拒否し両残高を変えないこと。各ケースは口座を初期化し、残高内・不足の単発だけ、独立した検証条件は総額一致だけです。M2は拒否を返すが両口座間で同額を移動します。M3は同じ口座で2回目の成功時に元口座だけ減算し、初回は正常です。双方とも未検出。各変異の欠落を埋める追加変更として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'M2に拒否時の両残高の検証、M3に同じ口座での操作列の生成を追加する' },
      { id: 'B', text: 'M2に同じ口座での操作列の生成、M3に拒否時の両残高の検証を追加する' },
      { id: 'C', text: 'M2とM3の両方に、拒否時の両残高の検証を追加する' },
      { id: 'D', text: 'M2とM3の両方に、同じ口座での操作列の生成を追加する' }
    ],
    explanation: '変異体M2は残高不足で拒否応答を返しながらも口座間で残高を移動させており、総額自体は一致するため総額アサーションをすり抜けます。M2を検出するには「拒否時に個別の各口座残高が一切変動していないこと」を検証する必要があります。一方、M3は初回は正常で2回目の成功時のみ元口座を不正減算するため、単発テストでは到達しません。M3を検出するには「同一口座での複数回連続送金シーケンス」を生成する必要があります。',
    choiceExplanations: {
      A: '正解です。拒否時の口座残高不変アサーションでM2を検出し、複数回連続送金シーケンスでM3を検出します。',
      B: 'M2とM3に必要なテスト変更を完全に取り違えています。',
      C: 'M3は2回目の成功操作でのみバグが発生するため、拒否時の残高検証を追加してもM3は検出できません。',
      D: 'M2は単発の残高不足で発生し総額を保つバグであるため、連続操作を追加しても総額一致しか検証していなければ検出できません。'
    }
  },
  'q-d5-e05': {
    question: 'CopilotがUIのスナップショット一括更新を提案しました。失敗した差分は①承認済みのボタン文言変更、②仕様にない削除確認ダイアログの消失です。画面でも両方を再現しました。仕様変更の反映と不具合修正を適切に切り分ける対応として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '①の期待値を更新し、②の確認動作を修復して既存期待値で検証する' },
      { id: 'B', text: '①②の期待値を更新し、変更後の画面を新基準として保存する' },
      { id: 'C', text: '①②の実装を元へ戻し、既存期待値の成功だけで完了する' },
      { id: 'D', text: '①の期待値を更新し、②のテストを確認画面のない新規テストへ替える' }
    ],
    explanation: 'スナップショットテストの失敗には「意図した正当な仕様変更」と「意図しない機能破壊（リグレッション）」が混在することがよくあります。①の承認済み文言変更は意図された変更であるためテスト期待値を更新して新スナップショットを承認します。一方、②の削除確認ダイアログ消失は重大なデグレであるため、スナップショットを安易に上書きせず、ダイアログを表示する実装コードを修復して既存テストで再検証します。',
    choiceExplanations: {
      A: '正解です。正当な仕様変更である①はスナップショットを更新し、不具合である②は実装コードを修復して回帰テストを通します。',
      B: 'スナップショットを一括更新してしまうと、削除確認ダイアログの消失という重大なデグレを正当化して見逃してしまいます。',
      C: '承認済みの正当なボタン文言変更①まで元に戻してしまい、必要な機能改修を破棄してしまいます。',
      D: 'デグレに合わせてテストの方を変更してしまっており、品質保証の役割を放棄しています。'
    }
  },
  'q-sc02-1': {
    question: '【Apex Financial事例】旧モジュールは0→エラー、1→正常。承認済み契約は「0を拒否、1を受理」。Copilotの新案は0も受理し、同時生成テストは新案を期待値にして成功した。承認済み契約を独立基準にする修正と記録として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '契約の0拒否と1受理をテストへ固定し、新案の0を直す' },
      { id: 'B', text: '新契約の0受理と1受理をテストへ固定し、旧版との差を記録' },
      { id: 'C', text: '1の正常系だけを増やし、0は新案の出力に合わせる' },
      { id: 'D', text: '新旧の性能を比較し、速い版の出力を期待値にする' }
    ],
    explanation: 'AIが生成したコードと同時に生成されたテストは、同じ誤解を共有して誤った動作（0の誤受理）を合格と判定してしまうリスクがあります。品質保証のためには、AIの生成物から独立した「承認済み契約（0は拒否、1は受理）」を客観的基準としてテストの期待値に固定し、契約に違反している新案の実装コード（0の処理）を修正する必要があります。',
    choiceExplanations: {
      A: '正解です。承認済み契約を客観的な期待値としてテストに固定し、仕様に反して0を受理してしまう新案コードを修正します。',
      B: 'AIが生成した実装に合わせて契約の方を変更してしまっており、金融処理における仕様違反を招きます。',
      C: '問題となっている境界値0の検証を放棄し、AIの誤った挙動を追認してしまっています。',
      D: '実行速度の優劣によって機能仕様の正しさを決定することはできず、判断基準として不適切です。'
    }
  },
  'q-sc09-1': {
    question: '【Nexis Games事例】Copilot導入前後でPR数が20→30、手戻りが発生したPR数が4→9、チーム人数が5→10でした。全員が同程度の期間勤務しています。現在の集計だけから最も妥当な報告はどれですか？',
    choices: [
      { id: 'A', text: '総PRは1.5倍、一人当たり4→3、手戻り率20%→30%' },
      { id: 'B', text: '総PRは1.5倍、一人当たり4→6、手戻り率20%→30%' },
      { id: 'C', text: '総PRは1.5倍、一人当たり4→3、手戻り率20%→20%' },
      { id: 'D', text: '総PRは1.5倍、一人当たり4→6、手戻り率20%→20%' }
    ],
    explanation: '導入前の総PR数は20、人数は5人なので「一人当たりPR数 = 20 / 5 = 4件」。手戻りPR数は4件なので「手戻り率 = 4 / 20 = 20%」。導入後の総PR数は30（30/20 = 1.5倍）、人数は10人なので「一人当たりPR数 = 30 / 10 = 3件」。手戻りPR数は9件なので「手戻り率 = 9 / 30 = 30%」。総数が増加していてもチーム人数倍増により一人当たり作成数は減少しており、手戻り率は10ポイント悪化しています。',
    choiceExplanations: {
      A: '正解です。数値を正しく計算し、一人当たり作成数の減少（4→3）と手戻り率の悪化（20%→30%）を正確に報告しています。',
      B: '一人当たりPR数の計算で人数増加（5→10）を正しく割っておらず、誤った生産性向上を報告しています。',
      C: '手戻り率の計算で導入後の分母（30件中9件 = 30%）を誤って計算しています。',
      D: '一人当たりPR数と手戻り率の双方で計算誤りがあり、実態と乖離した報告になっています。'
    }
  },
  'q-d3-e08': {
    question: '中間補完の前半は取得値xを保持し、後半はx*rateを返す。rateは110。生成案は中間でxを110倍し、さらにreturn xを追加した。入力2の出力は220で契約と一致するが、rate=120の契約240には不一致。挿入範囲に限って修正し後半を維持する案として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'xの110倍を保ち、中間returnだけを外す' },
      { id: 'B', text: '中間returnを保ち、後半のrateだけ120へ固定' },
      { id: 'C', text: 'xの変換と中間returnを外し、後半のx*rateを使う' },
      { id: 'D', text: '中間の110倍だけを外し、return xは保つ' }
    ],
    explanation: '生成されたコードは中間部分でxを110倍した上で早期return文を追加してしまっており、本来後半で実行されるべき「x*rate」の動的計算をスキップしてしまっています。rate=110のテストケースでは偶然数値が合致していましたが、rateが変わると仕様違反になります。挿入範囲（中間）のみを修正して後半処理を正しく活かすには、中間でのxの余分な変換と早期returnを両方とも除去し、後半のx*rate計算に任せるのが正解です。',
    choiceExplanations: {
      A: '中間returnを外してもxが110倍されたまま後半へ渡ると、後半でさらにrate倍されて二重乗算のバグになります。',
      B: '後半のrateを120に固定しても動的なrate変更に対応できず、また変更範囲制約（挿入範囲に限る）を破っています。',
      C: '正解です。中間での余計な値変換と早期returnを両方削除し、後半の共通計算ロジック（x*rate）を正しく機能させます。',
      D: 'return xを残してしまうと、未計算のxがそのまま返され後半のrate計算が永久に実行されません。'
    }
  },
  'q-d5-e06': {
    question: 'Copilot Autofix案はWHEREの値とORDER BYの列名を両方プレースホルダーへ変えた。対象DBでは値の束縛は成功するが列名は束縛不可。テストではWHEREの注入は拒否、sort=created_atで構文エラー。列指定はcreated_atかamountだけを許す契約。要求を変えない最小の修正・再検証として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'WHEREもsortも全て値の束縛で保ち、同じテストを増やす' },
      { id: 'B', text: '値も列も連結へ戻し、許可した列名だけを検証' },
      { id: 'C', text: 'sortをcreated_atへ固定し、amountの指定を無視して検証' },
      { id: 'D', text: '値の束縛を保ち、sortを許可列へ写像して両経路を検証' }
    ],
    explanation: 'SQL構文において、WHERE句の検索「値」はプレースホルダー（バインド変数）で安全にエスケープできますが、ORDER BY句の「識別子（列名）」はプレースホルダーとしてバインドできず構文エラーになります。列指定を安全に処理する標準的なパターンは、入力されたソートパラメータを許可されたホワイトリスト（created_at または amount）と照合・写像して静的な列名文字列を埋め込むことです。',
    choiceExplanations: {
      A: '列名のプレースホルダー化はデータベースの構文規則で禁止されているため、テストを増やしても構文エラーは解消しません。',
      B: 'WHERE句の値まで文字列連結に戻してしまうと、SQLインジェクション脆弱性が再発してしまいます。',
      C: 'amount列によるソート要求を無視してcreated_atに固定してしまうと、既存の機能要件を満たせなくなります。',
      D: '正解です。WHERE句の値バインドを維持してインジェクションを防ぎ、ORDER BY句はホワイトリスト写像で安全に処理します。'
    }
  },
  'q-d5-e07': {
    question: '決済クライアントはHTTP受信→parse→validate→注文更新の順。生成テストはparse/validateを成功値へ置換し、注文更新のカバレッジ100%。保存した実API応答は公式スキーマに合うが、実parseは失敗し本番も同じ。外部課金をせず、この内部処理の欠落を検出する境界として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'HTTP応答をスタブ化し、parse・検証・注文更新を通す' },
      { id: 'B', text: 'parse/validateを成功スタブのまま、注文更新だけ通す' },
      { id: 'C', text: 'HTTP応答スキーマだけ検証し、注文更新は固定する' },
      { id: 'D', text: '本番の決済APIへ接続し、実カードで注文更新を確認' }
    ],
    explanation: '生成テストはparseとvalidateを都合の良い成功スタブで置き換えていたため、注文更新コードのカバレッジが100%であっても実際のパース処理の欠陥を検出できませんでした。外部課金を発生させずにこの内部欠落を検出するには、外部通信であるHTTPレスポンスの受信部分のみを過去の実API応答データでモック（スタブ）化し、内部のparse・validate・注文更新の全処理をスタブなしで実際に通過させる統合テストが必要です。',
    choiceExplanations: {
      A: '正解です。HTTP境界のみをスタブ化し、失敗している実parse・validate・注文更新の実コードを直接通過させて欠陥を検出します。',
      B: '失敗しているparse/validateをスタブで置き換えたままでは、本番で発生するパースエラーを永久に検出できません。',
      C: '公式スキーマに合致していても内部のパーサー実装で失敗しているため、スキーマ検証だけでは不十分です。',
      D: '本番環境での実カード課金はテスト実行の制約（外部課金をしない）に違反し、テストの自動化にも適しません。'
    }
  },
  'q-d5-e08': {
    question: '同種案件・同人数・同期間のCopilot試行を比較。架空の社内基準は手戻りPR率10%以下、レビュー時間/PR30分以下、集中実感4以上。PはPR20・手戻り2・レビュー600分・集中4.1、Qは40・6・800・4.3、Rは20・1・700・4.2、Sは40・2・1000・3.5。全基準合格のうちPR数最多を次の展開候補にする。選択として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'Qを展開候補にし、次の試行で再検証する' },
      { id: 'B', text: 'Pを展開候補にし、次の試行で再検証する' },
      { id: 'C', text: 'Rを展開候補にし、次の試行で再検証する' },
      { id: 'D', text: 'Sを展開候補にし、次の試行で再検証する' }
    ],
    explanation: '各チームを基準（手戻り率<=10%, レビュー時間/PR<=30分, 集中実感>=4.0）で評価します。Pは手戻り率10%（2/20）、レビュー30分/PR（600/20）、集中4.1ですべて合格。Qは手戻り率15%（6/40 > 10%）で不合格。Rはレビュー35分/PR（700/20 > 30分）で不合格。Sは集中実感3.5（< 4.0）で不合格。全基準を満たしているのはPのみであり、Pが唯一の選定候補です。',
    choiceExplanations: {
      A: 'チームQは手戻りPR率が15%（6/40）となり、品質基準（10%以下）を満たしていません。',
      B: '正解です。チームPは手戻り率10%、レビュー30分/PR、集中4.1で3基準をすべて達成した唯一のチームです。',
      C: 'チームRはレビュー時間が35分/PR（700/20）となり、レビュー負担基準（30分以下）を満たしていません。',
      D: 'チームSは集中実感が3.5となり、エンジニア体験基準（4以上）を満たしていません。'
    }
  }
};

const originalChoiceOrder = {
  'q-d2-e01': ['C', 'A', 'B', 'D'],
  'q-d2-e07': ['A', 'C', 'B', 'D'],
  'q-d2-e10': ['D', 'C', 'B', 'A'],
  'q-d4-e01': ['B', 'D', 'A', 'C'],
  'q-d5-e01': ['B', 'D', 'A', 'C'],
  'q-d5-e03': ['D', 'A', 'C', 'B'],
  'q-d5-e05': ['D', 'A', 'B', 'C'],
  'q-sc02-1': ['A', 'B', 'D', 'C'],
  'q-sc09-1': ['C', 'B', 'D', 'A'],
  'q-d3-e08': ['A', 'B', 'C', 'D'],
  'q-d5-e06': ['A', 'B', 'C', 'D'],
  'q-d5-e07': ['A', 'B', 'C', 'D'],
  'q-d5-e08': ['A', 'B', 'C', 'D']
};

// 実行処理
let modifiedCount = 0;
for (const [id, rw] of Object.entries(d5Rewrites)) {
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

console.log(`\nSuccessfully rewritten and synced ${modifiedCount} questions in D5!`);
