import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { examLengths } from './audit-exam-question-review.mjs';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

const seedPath = 'content/gh300/2026-08-07/questions/seed.json';
const examRepPath = 'reports/exam-question-quality-review.json';
const diffRepPath = 'content/gh300/2026-08-07/questions/difficulty-review.json';
const qualRepPath = 'content/gh300/2026-08-07/questions/quality-review.json';

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const examRep = JSON.parse(fs.readFileSync(examRepPath, 'utf8'));
const diffRep = JSON.parse(fs.readFileSync(diffRepPath, 'utf8'));
const qualRep = JSON.parse(fs.readFileSync(qualRepPath, 'utf8'));

// D1のリライト定義 (11問)
const d1Rewrites = {
  'q-d1-e01': {
    question: 'GitHub Copilotが提案した外部依存パッケージPおよびQの採用審査を実施しています。社内基準では、導入予定の配布物と一致する出所証跡の確認と、同一配布物に対するLinux環境での機能検査合格が義務付けられています。現状の検証結果は、Pは予定hash p2、確認済み出所はp1、機能成功はp2/Linux。Qは予定hash q2、確認済み出所はq2、機能成功はq2/Windowsです。各記録の日付は最新でパッケージ名も一致します。この状況において、社内基準を満たすために不足している証跡のみを的確に補完する対応として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'パッケージPについて予定配布物の出所照合を実施し、パッケージQについて予定配布物のLinux機能検査を補完する' },
      { id: 'B', text: 'パッケージPについて予定配布物のLinux機能検査を実施し、パッケージQについて予定配布物の出所照合を補完する' },
      { id: 'C', text: 'パッケージPとQの両方について、予定配布物の出所照合のみを追加で実施して採用を承認する' },
      { id: 'D', text: 'パッケージPとQの両方について、予定配布物のLinux機能検査のみを追加で実施して採用を承認する' }
    ],
    explanation: 'パッケージPは機能検査のハッシュ（p2）とLinux環境が一致していますが、出所証跡のハッシュがp1となっており予定配布物（p2）の出所が未確認です。一方、パッケージQは出所のハッシュ（q2）は一致しているものの、機能検査がWindows環境のみで実施されておりLinux環境の動作証拠がありません。パッケージ名や最新日付だけで代替せず、不足している証跡のみを正確に補完する必要があります。',
    choiceExplanations: {
      A: '正解です。Pで欠落している予定配布物（p2）の出所照合と、Qで欠落しているLinux環境での機能検査という、それぞれの不足証跡のみを的確に補う対応です。',
      B: 'パッケージPとQで不足している検証対象を取り違えています。Pに必要なのは出所照合であり、Qに必要なのはLinux環境での機能検査です。',
      C: 'パッケージPの出所照合不足をQにまで拡大し、QにおいてLinux環境での機能検査が不足している事実を見落としています。',
      D: '機能検査を増やす安全策を優先していますが、パッケージPにおいて未確認なのは出所照合（ハッシュp2の証明）である点を見落としています。'
    }
  },
  'q-d1-e02': {
    question: 'GitHub Copilot Workspace（Agent）が作成したPull Requestにおいて、サービスYがPOSTの応答契約を変更しました。提出された証跡Tは「Yのテスト成功」、証跡Rは「Yのファイル承認済み」となっています。しかし、Tの明細ではGETが実ルート、POSTは成功スタブです。Rの許可範囲は同じファイルの書式変更だけです。社内基準では、変更された実ルートに対する契約検証と変更種別に応じた正式な承認が要求されており、有効な証跡は再利用可能です。基準を満たすために不足している証跡のみを補う対応として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'POST契約の実ルートに対する検証を追加実施し、POSTの応答契約変更に対する正式な承認を取得する' },
      { id: 'B', text: '既存のテスト証跡Tと承認証跡Rをそのまま再利用し、追加の検証や承認を行わずにマージを承認する' },
      { id: 'C', text: '既存の承認証跡Rを再利用し、不足しているPOST契約の実ルート検証のみを追加で実施する' },
      { id: 'D', text: '既存のテスト証跡Tを再利用し、不足しているPOSTの応答契約変更に対する承認のみを追加で取得する' }
    ],
    explanation: '対象コンポーネントYや変更ファイル名が一致しているだけでは十分な証跡とは言えません。テスト証跡TはGETのみが実ルートでPOSTはスタブ検証にとどまっており、実ルートの契約検証が不足しています。また承認証跡Rの承認範囲は書式変更のみであり、公開APIの挙動変更は承認されていません。したがって、両方の不足分を補う必要があります。',
    choiceExplanations: {
      A: '正解です。スタブで済まされていたPOST実ルートの契約検証と、書式変更にとどまっていた承認範囲に対するAPI挙動変更の正式承認という、双方の不足を正確に補完しています。',
      B: '対象ファイルやコンポーネントが同一で「成功」「承認」のラベルがあるからといって、その詳細な対象範囲を確認せずに流用することは重大な見落としにつながります。',
      C: '既存の承認証跡Rを再利用しようとしていますが、Rの許可範囲は同一ファイルの書式変更のみであり、POSTの応答契約変更という挙動変更の承認証跡としては使えません。',
      D: '既存のテスト証跡Tを再利用しようとしていますが、Tのテスト明細ではPOSTが成功スタブとなっており、変更された実ルートの契約検証の証拠にはなりません。'
    }
  },
  'q-d1-e03': {
    question: 'GitHub Copilotが生成したキュー処理の並行性テストは単体実行で1万回連続して成功しました。しかし、処理が停止した際の実行ダンプを確認したところ、処理PがロックLを保持してMを待ち、処理QがMを保持してLを待っています。Copilotによる説明は「各ロックの取得は安全」というものでした。このデッドロックを根本解決するために指示すべき修正と検証の組み合わせとして最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '複数ロックの取得順序をグローバルに統一し、記録された交差順序を再現する並行テストで検証する' },
      { id: 'B', text: '各ロックの待機タイムアウト期限を延長し、長時間処理が完了するまで待機するテストで検証する' },
      { id: 'C', text: 'キューのバッファ容量を拡張し、受付拒否の発生頻度と処理時間の短縮をベンチマークで計測する' },
      { id: 'D', text: 'ロックの取得順序は維持したまま、入力データの境界値ケースを追加して単体テストで検証する' }
    ],
    explanation: 'ダンプ記録は典型的な循環待ち（デッドロック）を示しています。Copilotが「個々のロック取得は安全」と説明しても並行処理の全体的な安全性は担保されません。根本解決には、すべての処理でロック取得順序を統一（階層化）した上で、ダンプで観測された交差タイミングを意図的に再現する並行テストを実施して再発防止を検証する必要があります。',
    choiceExplanations: {
      A: '正解です。循環待ちを解消するためにロック取得順序の統一を指示し、問題となった交差実行順序を再現テストで確実に検証するアプローチです。',
      B: 'タイムアウトの延長は一般的な遅延対策にすぎず、相互に解放待ちをしている循環待ちデッドロックでは時間を延ばしても解決しません。',
      C: '「キュー」という用語から安易に容量不足と判断していますが、ダンプ記録が示しているのはロックの循環待ちでありバッファ容量とは無関係です。',
      D: '単体テストの試行回数を増やしたり境界値を検証したりしても、競合や循環待ちが発生する特定の並行交差タイミングを意図的に再現しなければデッドロックは検出できません。'
    }
  },
  'q-d1-e05': {
    question: 'GitHub Copilotが実装したドロップダウンメニューのアクセシビリティ（a11y）を検証しました。Tabで開閉ボタンへ移動でき、Enterで開けます。Escapeで閉じるとフォーカスがページ先頭へ飛びます。読み上げでは項目名は分かりますが、開閉後も「折りたたみ」と聞こえます。これら2つの観測された問題（不適切なフォーカス移動およびARIA状態の不整合）を解消する修正として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '閉じた後のフォーカス復帰先を元のボタンに修正し、開閉状態（aria-expanded）の支援技術への通知を正しく更新する' },
      { id: 'B', text: 'ドロップダウンを開くためのキー割り当てを修正し、各メニュー項目名が正しく読み上げられるようにラベルを設定する' },
      { id: 'C', text: 'ページ全体のTab順序を再定義し、展開されたメニュー項目と背景色のコントラスト比をガイドラインに合わせて修正する' },
      { id: 'D', text: 'メニュー項目名のラベルを修正した上で、ドロップダウンを閉じた際にページ先頭へフォーカスが移動する挙動を維持する' }
    ],
    explanation: 'キーボード操作でメニューを開く動作と項目名の読み上げはすでに正常に機能しています。未解決の問題は「Escapeで閉じた際に開閉トリガーボタンへフォーカスが戻らずページ先頭へ消失すること」と「開閉操作を行ってもaria-expandedなどの状態が更新されず閉じた状態のまま読み上げられること」の2点です。これら2つの観測事象に対応した修正を行う必要があります。',
    choiceExplanations: {
      A: '正解です。Escapeキー押下後のフォーカス復帰先をトリガーボタンへ戻し、開閉状態を表すARIA属性（aria-expanded）をUIの状態変化と同期させて支援技術へ正しく通知する修正です。',
      B: '開くキー操作（Enter）や項目名自体の読み上げはすでに成功が確認されており、修正対象として的を射ていません。',
      C: 'Tab順序や色コントラストは一般的なアクセシビリティ施策ですが、今回観測されているフォーカス消失とARIA開閉状態の不整合という具体的な2障害に対処していません。',
      D: 'フォーカスがページ先頭へ飛んでしまう障害をそのまま維持しており、フォーカス管理の不備を解決していません。'
    }
  },
  'q-d1-e07': {
    question: 'GitHub Copilotが提案したメッセージキューの処理改善コードに対して負荷および耐障害性試験を実施しました。受け入れ基準はp95遅延200ms以下と受付済み注文の欠落0件です。試験結果は、通常負荷は90ms・欠落0、ピーク負荷は170ms・欠落0、ピーク中のノード停止は180ms・欠落3件でした。限られた追加検証時間を最も有効に活用し、未達基準の原因を特定するための調査対象として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '注文の受付応答と永続化処理の順序関係を調査し、ノード停止時の再処理フローで欠落を再現・特定する' },
      { id: 'B', text: 'ピーク負荷時のワーカープロセス数を増設し、p95遅延を目標値よりさらに短縮できるかを測定する' },
      { id: 'C', text: '通常負荷試験における入力データのバリエーションを増やし、型変換と戻り値の契約整合性を再確認する' },
      { id: 'D', text: 'ノード停止時におけるクライアント側の待機期限を延長し、エンドツーエンド遅延の最大値を計測する' }
    ],
    explanation: '遅延目標（p95 200ms以下）は通常負荷（90ms）、ピーク負荷（170ms）、ノード停止時（180ms）のすべての条件下で達成されています。しかし、ノード停止時においてのみ「注文の欠落3件」が発生し、受け入れ基準を満たしていません。したがって、すでに達成されている遅延の短縮ではなく、受付応答を返した後の永続化や障害リカバリの境界に焦点を絞って調査することが最も直接的で効果的です。',
    choiceExplanations: {
      A: '正解です。遅延基準はクリアしているため、ノード停止時にのみ発生した注文欠落の原因である受付応答と永続化・再処理の境界を特定する調査が未達条件の解決に直結します。',
      B: 'ピーク負荷時の遅延は170msですでに目標（200ms以下）を達成しており、ワーカー数を増やしてさらなる短縮を図ることは未達基準（欠落0件）の解決に寄与しません。',
      C: '正常系の入力バリエーション拡充は一般的な品質確認としては有用ですが、ノード停止時の永続化境界や欠落再現という未達基準の原因調査にはつながりません。',
      D: '待機期限を延長しても永続化前に消失した注文データが復旧するわけではなく、欠落の根本原因を究明・解消することはできません。'
    }
  },
  'q-d1-e08': {
    question: '開発チームでGitHub Copilot研修を実施した後の実績データを評価しました。コード提案の採用率は30%から50%へ向上したものの、研修期間中に担当した案件難易度は低下、レビュー時間は不変、流出不具合は少数で傾向不明でした。今回の測定目的は「品質とレビュー負担への研修効果」の検証です。案件難易度の変化という交絡因子を適切にコントロールし、目的を正しく測定するための比較設計として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '過去と同種・同難易度の案件を抽出し、コード品質指標とレビュー時間を研修前後で比較する' },
      { id: 'B', text: '過去と同種・同難易度の案件を抽出し、提案採用率と研修参加者数を研修前後で比較する' },
      { id: 'C', text: '過去と同種・同難易度の案件を抽出し、生成コード行数と変更ファイル数を研修前後で比較する' },
      { id: 'D', text: '全案件を対象として、難易度を考慮せずに不具合発生総数の推移のみを研修前後で比較する' }
    ],
    explanation: '案件難易度の低下という交絡因子が存在するため、単純な前後比較ではCopilotの効果なのか案件が易しかったからなのかを識別できません。同種・同難易度の案件に対象を限定して案件差を統制した上で、今回の測定目的である「品質」と「レビュー負担（レビュー時間）」を直接比較することが不可欠です。提案採用率の向上だけから品質改善や負担軽減の因果関係を断定してはなりません。',
    choiceExplanations: {
      A: '正解です。案件難易度を同種案件に揃えることで交絡を排除し、本来の測定目的であるコード品質指標とレビュー負担（時間）の前後変化を正確に評価する設計です。',
      B: '案件難易度を揃える点は適切ですが、比較対象が採用率と参加者数となっており、本来の測定目的である「品質」と「レビュー負担」を測定していません。',
      C: '生成行数やファイル数は客観的に計測可能ですが、コード量が増減したこと自体は成果物の品質やレビュー負担の増減を表す指標にはなりません。',
      D: '案件の難易度差という重大な交絡因子を無視して全案件の不具合総数のみを比較しており、不具合が少数で傾向不明な状況下では信頼できる示唆を得られません。'
    }
  },
  'q-d5-e02': {
    question: 'GitHub Copilotが生成したPull Requestの要約には「API互換性変更なし」と記載されていました。しかし実際の差分を確認すると、未認証時401→200へのステータスコード変更と、実顧客の識別子が含まれるサンプルログの追加が含まれていました。現在の証跡は型検査成功だけで、応答変更の承認はない状態です。また社内規則では顧客識別子を公開サンプルへ載せないことが義務付けられています。不足している審査手続きを補完し、PR要約を是正するための最小限かつ適切な対応はどれですか？',
    choices: [
      { id: 'A', text: '未認証時ステータスコード変更に対する正式な承認を確認・取得し、顧客識別子をマスキングしてPR要約を修正する' },
      { id: 'B', text: 'サンプルログ内の顧客識別子と誤ったPR要約はそのまま維持し、未認証時のステータスコード変更に対する承認のみを確認する' },
      { id: 'C', text: 'ステータスコード変更に関する既存の承認証跡を流用し、ログ内の顧客識別子のマスキングとPR要約の修正のみを実施する' },
      { id: 'D', text: 'PR要約の記述のみを実態に合わせて修正し、未認証時のステータスコード変更と顧客識別子を含むサンプルログはそのまま維持する' }
    ],
    explanation: '型検査の成功は公開APIの動作契約変更を承認した証拠にはならず、未認証時401から200への変更は重大な互換性破壊をもたらす可能性があるため正式な契約変更承認が必要です。また社内規則違反となる顧客識別子は速やかにマスキング・除去しなければなりません。そしてPR要約も「互換性変更なし」という虚偽の記述を正す必要があります。これら不足している審査と是正を漏れなく実施することが求められます。',
    choiceExplanations: {
      A: '正解です。公開API応答の契約変更承認を取得し、顧客情報漏洩を防ぐためのログ修正を行い、PR要約を実際の差分に合わせて是正する、必要最小限かつ不可欠な対応です。',
      B: '応答変更の承認を確認する点は合っていますが、顧客識別子が公開ログに含まれる規則違反と、誤ったPR要約を放置してしまう重大な見落としがあります。',
      C: '既存の証跡には型検査成功しかなく、応答変更に対する承認証跡は存在しないため、既存証跡を流用して承認確認を省略することはできません。',
      D: 'PR要約の文面だけを直しても、未承認の互換性破壊変更がそのままマージされ、顧客識別子の漏洩も防止できないため不適切です。'
    }
  },
  'q-sc02-2': {
    question: '【Apex Financial事例】金融計算システムにおいて、正数の金額を整数へ偶数丸めする契約（JIS丸め / 銀行丸め）が定義されています。旧実装の挙動は2.5→2、3.5→4であり、Copilot案と同時生成テストは2.5→3、3.5→4でした。なお、端数処理のない通常値2.4→2はどちらも通ります。AIが生成した新コードおよびテストを採用する前の判断として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '仕様契約に基づき2.5の期待値を2と定め、実装とテストの両方に共通する丸め処理の誤りを修正する' },
      { id: 'B', text: '3.5に対する期待値を3に変更して実装を合わせ、新案の境界値処理を一律に統一する' },
      { id: 'C', text: '2.5→3および3.5→4を新仕様の期待値として受け入れ、旧実装との動作差分のみを記録する' },
      { id: 'D', text: '2.4のような成功する通常値ケースのテストを拡充し、新旧コードの一致率に基づいて採否を決める' }
    ],
    explanation: '偶数丸め（Round half to even）では、端数が0.5ちょうどのときは最も近い偶数に丸めるため、2.5は偶数である2へ、3.5は偶数である4へ丸められます。Copilotが同時に生成した実装とテストは、四捨五入（2.5→3）という共通の誤解を共有しているため、テストが通っていても仕様に違反しています。同時生成されたテストを盲信せず、独立した仕様契約を客観的基準として修正を判断する必要があります。',
    choiceExplanations: {
      A: '正解です。偶数丸めの仕様契約を独立した判定基準とし、同時生成された実装とテストが共有している2.5の誤った期待値（3）を正しく2へ修正する判断です。',
      B: '3.5を3に丸めることは偶数丸めの定義（4が最も近い偶数）に反しており、誤った方向へ境界値を統一してしまいます。',
      C: 'AIが生成した実装とテストが一致しているからといって仕様変更として受け入れると、金融計算における重大な仕様違反を見逃すことになります。',
      D: '通常値での一致率が高くても境界値（2.5）における仕様違反を覆い隠すことはできず、品質保証の判断基準として不適切です。'
    }
  },
  'q-sc09-3': {
    question: '【Nexis Games事例】新人エンジニア研修においてGitHub Copilotを導入したところ、Chat利用は週10回から40回、先輩への質問は週8回から2回になりました。設計の説明課題は80点から55点、レビューでの手戻りは週2件から6件です。この状況において、育成担当チームが最優先で検証すべき問題の仮説と、それに対応する改善施策の組み合わせとして最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '提案内容を深く理解せずに採用する習慣がついたという仮説を立て、生成コードの動作原理を自力で説明・検証させる演習を導入する' },
      { id: 'B', text: '先輩社員への質問窓口が不足しているという仮説を立て、Chat利用可能枠をさらに拡大してAIによる自己解決を促す' },
      { id: 'C', text: '新人エンジニアの補完操作速度が遅いという仮説を立て、エディタのショートカット練習を実施して編集時間を短縮させる' },
      { id: 'D', text: '割り当てられた案件の開発規模が減少したという仮説を立て、月次の生成コード行数集計を通じて業務負荷の推移を調査する' }
    ],
    explanation: '質問の激減とAIチャット利用の急増に伴い、設計の説明力低下とレビューでの手戻り増加が同時に発生しています。これは、AIの提案コードを自力で理解・咀嚼しないまま安易にコミットしている可能性を強く示唆しています。因果関係を一方的に決めつけるのではなく、提案内容を自力で説明・検証できるかをテストする演習を通じてこの仮説を検証し、学習プロセスを是正することが適切です。',
    choiceExplanations: {
      A: '正解です。質問減少と理解度悪化・手戻り増加の相関から「理解なきコピペ」という妥当な仮説を導き、提案コードを自力で説明・検証させる具体的な改善演習を紐付けています。',
      B: 'Chat利用はすでに4倍に急増しており、質問減少は窓口不足ではなくAIへの依存によるものです。利用枠を拡大しても理解度の低下や手戻りの増加は改善しません。',
      C: 'エディタ操作やショートカットの習熟は一般的な生産性向上策ですが、今回深刻化している設計理解度の低下やレビュー手戻りという本質的課題に対処していません。',
      D: '案件規模の減少という仮説は、説明課題の点数低下やレビュー手戻りの増加という定性・定量的品質劣化の直接的な説明になりません。'
    }
  },
  'q-d1-e09': {
    question: '融資審査モデルの改善において、GitHub Copilotが生成した審査判定ロジック案を評価しました。モデル入力から性別の入力は除去済みです。しかし対照実験において、業務属性をそろえて郵便番号だけ変えると、承認率が80%から50%へ変わったことが確認されました。そこで郵便番号を除く実験では両群80%、正答率は承認基準を満たしました。基準は「地域を判定に使わず、正答率も維持」することです。実験結果の証拠が強く支持する、次の採用候補モデルおよび検証方針として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '郵便番号を含めた元のモデル案を採用候補とし、審査処理にかかる推論時間を短縮するための性能チューニングを再検証する' },
      { id: 'B', text: '性別データのみを再度除外した元の郵便番号ありモデル案を維持し、現行データセットでの単体テストを継続して検証する' },
      { id: 'C', text: '郵便番号を除外したモデル案を採用候補とし、独立した別データセットを用いて地域非依存性と判定精度の両基準を再検証する' },
      { id: 'D', text: '郵便番号あり案となし案の審査判定を単純平均するアンサンブル案を作成し、組織全体の承認率指標のみを再検証する' }
    ],
    explanation: '業務属性を同一に保ったまま郵便番号のみを変更した対照実験で承認率に大きな乖離が生じたことは、郵便番号が地域判定の代理変数として機能してしまっている決定的な証拠です。郵便番号を除外した実験では承認率が揃い正答率基準も満たしたため、郵便番号なし案が採用候補となります。ただし特定標本での適合にとどまるリスクを排除するため、独立した別標本を用いて両基準を客観的に再検証することが求められます。',
    choiceExplanations: {
      A: '郵便番号が不当な地域格差（代理変数）を生んでいる証拠が確認されているにもかかわらず、郵便番号あり案を採用して処理時間のみを検証することは基準に反します。',
      B: '性別はすでに除外済みであり、直接属性を再除去しても郵便番号による代理変数経路を温存してしまうため根本解決になりません。',
      C: '正解です。地域非依存性と精度維持の両方を満たした郵便番号なし案を候補に選定し、過学習や標本バイアスを防ぐため独立した別標本で再検証する適切なアプローチです。',
      D: '異なる特性を持つ2案の判定を単純平均してもグループ間の不当な格差を隠蔽してしまうだけであり、地域非依存性の証明にはなりません。'
    }
  },
  'q-d2-e20': {
    question: 'Copilot AgentがMCPツールの実行エラーに伴う再試行を行っている最中に、ワークスペース内の.envとparser.tsが意図せず変更されました。事後調査の結果、開始前の保存差分はparser.tsだけで、変更後もその差分は同一。.envの変更はAgentの実行記録と一致し、承認はありませんでした。セッションは停止済みです。ユーザーが元々行っていた作業差分を確実に維持しつつ、Agentによる未承認の変更のみを安全に取り消す対象として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '.envのみをAgent開始前の状態へロールバックし、ユーザー自身が作成したparser.tsの作業差分はそのまま保持する' },
      { id: 'B', text: 'parser.tsのみを開始前の状態へロールバックし、Agentが書き換えた.envの変更差分をそのまま保持する' },
      { id: 'C', text: '両ファイルを直前のGitコミット（HEAD）へ一括で戻し、Agent開始前にユーザーが作成した差分も破棄する' },
      { id: 'D', text: '両ファイルの変更差分をそのまま保持した上で、MCP設定の最大再試行回数のみを減らしてセッションを再開する' }
    ],
    explanation: 'Agent開始前の状態と実行ダンプログを照合することで、変更の帰属を正しく切り分けることができます。parser.tsはユーザー自身の開始前作業と完全に同一であるため保護すべき正当な作業差分です。一方、.envはAgentが未承認で書き換えたものであるため、これのみを開始前状態へ安全に戻す必要があります。Gitで一括リセットするとユーザーの正当な作業成果まで消失してしまいます。',
    choiceExplanations: {
      A: '正解です。開始前の差分記録とAgentの実行履歴から変更の帰属を明確に識別し、Agentによる未承認の.env変更のみを戻してユーザーのparser.ts差分を確実に保護しています。',
      B: '変更された2つのファイルに対する帰属の判定を完全に逆にしてしまっており、保護すべきユーザー作業を破壊して未承認変更を残してしまいます。',
      C: 'GitのHEADへ一括で戻すと、Agent開始前にユーザー自身が行っていたparser.tsの正当な作業成果まで消去してしまうため不適切です。',
      D: '未承認で変更された機密情報を含む可能性のある.envをそのまま放置して再試行回数だけを調整しても、発生した変更の復旧にはなりません。'
    }
  }
};

const classRepPath = 'reports/question-objective-classification-review.json';
const addsRepPath = 'content/gh300/2026-08-07/questions/additions-review.json';

const classRep = JSON.parse(fs.readFileSync(classRepPath, 'utf8'));
const addsRep = JSON.parse(fs.readFileSync(addsRepPath, 'utf8'));

const originalChoiceOrder = {
  'q-d1-e01': ['D', 'C', 'B', 'A'],
  'q-d1-e02': ['A', 'B', 'D', 'C'],
  'q-d1-e03': ['C', 'A', 'D', 'B'],
  'q-d1-e05': ['B', 'D', 'A', 'C'],
  'q-d1-e07': ['C', 'A', 'B', 'D'],
  'q-d1-e08': ['B', 'A', 'C', 'D'],
  'q-d5-e02': ['D', 'C', 'A', 'B'],
  'q-sc02-2': ['D', 'B', 'C', 'A'],
  'q-sc09-3': ['A', 'D', 'B', 'C'],
  'q-d1-e09': ['A', 'B', 'C', 'D'],
  'q-d2-e20': ['A', 'B', 'C', 'D']
};

// 実行処理
let modifiedCount = 0;
for (const [id, rw] of Object.entries(d1Rewrites)) {
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

console.log(`\nSuccessfully rewritten and synced ${modifiedCount} questions in D1!`);
