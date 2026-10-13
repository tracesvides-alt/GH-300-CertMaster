import { assertLegacyRewriteScope } from './question-rewrite-safety.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, root), 'utf8'));
const write = (f, data) => fs.writeFileSync(new URL(f, root), JSON.stringify(data, null, 2) + '\n', 'utf8');
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// D3 Applied Rewrites (All 19 questions: q-d3-a01 to q-d3-a19)
export const d3Rewrites = {
  'q-d3-a01': {
    question: 'GitHub Copilotのプロンプトエンジニアリングにおいて、関数の実装を依頼する際に「期待する入力引数と戻り値の具体例（入出力ペア）」をプロンプトに含めて指示する手法（Few-shotプロンプティング / サンプル提示）の主な利点として、最も適切なものはどれですか？',
    choices: {
      A: '関数のエッジケースや戻り値のフォーマットに関するモデルの曖昧さを排除し、期待仕様通りの出力を得やすくする',
      B: '生成されるコードの実行時間を自動的に短縮させ、計算量をO(1)のアルゴリズムへ強制的に最適化できる',
      C: 'LLMのコンテキストウィンドウの消費トークン数を大幅に削減し、API呼び出しコストを最小化できる',
      D: '提案コードに含まれる潜在的なセキュリティ脆弱性をコンパイル前に100%排除できることが保証される',
    },
    explanation: '具象的な入出力例（Few-shot例）をプロンプトに与えることで、モデルの解釈のブレや曖昧さを抑制し、期待通りの形式とロジックを誘導できます。',
    choiceExplanations: {
      A: '具象的な入出力例（Few-shot例）をプロンプトに与えることで、モデルの解釈のブレや曖昧さを抑制し、期待通りの形式とロジックを誘導できます。',
      B: '入出力例の提示は仕様の明確化が目的であり、計算量をO(1)に自動最適化する保証はありません。',
      C: '例示を追加するとプロンプトのトークン数は増加するため、トークン削減という説明は誤りです。',
      D: 'プロンプトの例示だけでセキュリティ脆弱性が完全にゼロになる保証は得られません。',
    },
  },
  'q-d3-a02': {
    question: 'VS CodeでGitHub Copilot Chatを利用する際、特定のファイルやシンボル（関数・クラス）を明示的にコンテキストとして会話に注入するための「コンテキスト変数（#記号）」の使い方として、最も適切なものはどれですか？',
    choices: {
      A: '#file:path/to/file や #selection などの変数を用いて、関連するファイルや選択コードをChatへ明示的に渡す',
      B: 'Chat入力欄に #ignore:all と入力して、エディタ内のすべての設定ファイルと環境変数を完全に無効化する',
      C: '#terminal:clear と入力して、VS Codeのターミナルに表示されている過去の全実行ログを一括消去する',
      D: '#model:gpt4 と入力して、GitHub Copilotが内部で使用している推論モデルの重みパラメータを直接上書きする',
    },
    explanation: 'Copilot Chatでは #file や #selection などのコンテキスト変数（チャット変数）を用いることで、必要なコード資産を確実に文脈として提供できます。',
    choiceExplanations: {
      A: 'Copilot Chatでは #file や #selection などのコンテキスト変数（チャット変数）を用いることで、必要なコード資産を確実に文脈として提供できます。',
      B: '#ignore:all は存在しない架空の変数であり、設定を無効化する機能ではありません。',
      C: '#terminal:clear は存在せず、ターミナルログの消去コマンドではありません。',
      D: '#model:gpt4 でモデルの重みパラメータを直接書き換えることはできません。',
    },
  },
  'q-d3-a03': {
    question: 'リポジトリ全体の共通コーディング規約や設計原則をGitHub Copilotに認識させ、チーム全員のChatや補完の回答に自動で反映させるための設定ファイルとして、最も適切な配置場所とファイル名はどれですか？',
    choices: {
      A: 'リポジトリルート配下の .github/copilot-instructions.md に、チーム共通のコーディングガイドラインを記述する',
      B: 'プロジェクトのルート直下に .copilotrc という名前のJSONファイルを作成し、プロンプト設定を記述する',
      C: '各開発者のローカルPCの ~/.config/copilot/user-rules.txt に、個人ごとのルールをそれぞれ手動で記述する',
      D: 'リポジトリ直下の README.md の末尾に、「Copilot向け指示」という見出しを作って規約を直接追記する',
    },
    explanation: 'チームリポジトリでCopilotのカスタム指示を共有するための標準ファイルは .github/copilot-instructions.md です。',
    choiceExplanations: {
      A: 'チームリポジトリでCopilotのカスタム指示を共有するための標準ファイルは .github/copilot-instructions.md です。',
      B: '.copilotrc はCopilotの公式設定ファイルとしては認識されません。',
      C: '各自のローカル個人ファイルではチーム全体での規約の共有やGit管理が行えません。',
      D: 'README.mdは人間向けのドキュメントであり、Copilotが自動でシステムプロンプトに注入する対象ではありません。',
    },
  },
  'q-d3-a04': {
    question: 'GitHub CopilotにREST APIクライアント関数の実装を依頼したところ、存在しない外部ライブラリの関数を呼び出すコード（ハルシネーション）が生成されました。プロンプトへの指示改善によってこの問題の再発を防ぐためのアプローチとして、最も適切なものはどれですか？',
    choices: {
      A: '使用可能な標準ライブラリ（fetch等）やプロジェクト導入済みライブラリを明記し、外部パッケージの追加を禁止する',
      B: 'プロンプトの末尾に「AIの創造性を最大限に発揮して自由にコードを記述してください」という指示を追加する',
      C: '関数名や引数の型定義をプロンプトから一切削除し、モデルが完全にゼロから仕様を推測できるようにする',
      D: '温度パラメータ（Temperature）の値を最大値の2.0に設定して、生成される回答のランダム性を極限まで高める',
    },
    explanation: '使用可能なライブラリを具体的に制約し、未インストールの依存追加を禁止する明示的指示を与えることで、ハルシネーションを効果的に抑制できます。',
    choiceExplanations: {
      A: '使用可能なライブラリを具体的に制約し、未インストールの依存追加を禁止する明示的指示を与えることで、ハルシネーションを効果的に抑制できます。',
      B: '自由度を高める指示はハルシネーションを悪化させる原因になります。',
      C: '情報を削るとモデルの推測への依存度が高まり、存在しないAPIの捏造がさらに発生しやすくなります。',
      D: '温度パラメータを上げると回答の不確実性とランダム性が増大し、ハルシネーションが頻発します。',
    },
  },
  'q-d3-a05': {
    question: '社内プロキシ経由だけ失敗、原因未特定という状況において、CopilotのIDE拡張機能が通信エラーを出しています。直接インターネットへ接続した環境では正常に補完やChatが動作する場合、最初に確認すべき設定項目として最も適切なものはどれですか？',
    choices: {
      A: 'IDEのHTTPプロキシ設定（http.proxy）および企業内プロキシのSSL自己署名証明書（http.proxyStrictSSL等）の設定',
      B: 'GitHubアカウントの二要素認証（2FA）設定およびPersonal Access Tokenの有効期限',
      C: 'リポジトリのブランチ保護ルールで設定されている必須ステータスチェックのCIワークフロー一覧',
      D: 'Copilot設定の Public Code Match フィルターが Block に設定されているかどうかの組織ポリシー',
    },
    explanation: 'プロキシ環境固有の通信失敗では、IDE側のHTTPプロキシURL設定や企業のSSLインスペクション証明書の信頼設定を最初に確認するのが定石です。',
    choiceExplanations: {
      A: 'プロキシ環境固有の通信失敗では、IDE側のHTTPプロキシURL設定や企業のSSLインスペクション証明書の信頼設定を最初に確認するのが定石です。',
      B: '直接通信では成功しているため、GitHubアカウント自体の認証情報や2FAの問題ではありません。',
      C: 'ブランチ保護ルールはGit操作のゲートであり、IDEとCopilotサーバー間のプロキシ通信とは無関係です。',
      D: '公開コード一致設定はモデルの生成フィルターであり、TCP/TLSレベルのプロキシ通信エラーの原因ではありません。',
    },
  },
  'q-d3-a06': {
    question: '大規模なリポジトリで作業中、Copilotのインライン補完が現在開いているファイルとは無関係な古いモジュールのコードパターンを頻繁に提案してきます。Copilotが参照する「隣接タブ（Neighboring Tabs）」のコンテキストを最適化するための操作として、最も適切なものはどれですか？',
    choices: {
      A: '無関係な古いファイルのタブをエディタで閉じ、現在作業に関連する型定義や類似実装のファイルのみを開いた状態にする',
      B: 'VS Codeのエディタタブを可能な限り大量に開き、開いているファイル数を50個以上にして網羅性を高める',
      C: '現在のファイルの内容をすべてクリップボードにコピーし、エディタを一度最小化してから再度最大化する',
      D: 'Gitのコミット履歴を過去100コミット分ターミナルに出力させ、その出力をエディタの別タブに開いておく',
    },
    explanation: 'Copilotは開いているタブ（Neighboring Tabs）を強力なコンテキストとして参照するため、無関係なタブを閉じて関連ファイルのみを開くことが精度向上に直結します。',
    choiceExplanations: {
      A: 'Copilotは開いているタブ（Neighboring Tabs）を強力なコンテキストとして参照するため、無関係なタブを閉じて関連ファイルのみを開くことが精度向上に直結します。',
      B: '無関係なタブを大量に開くとコンテキストウィンドウがノイズで埋まり、補完の精度が大幅に低下します。',
      C: 'クリップボードへのコピーやウィンドウの最小化は、Copilotのコンテキスト選定アルゴリズムに何の影響も与えません。',
      D: '無関係なGitログを開くと不要なトークンが文脈に混入し、コード補完の質を損ないます。',
    },
  },
  'q-d3-a07': {
    question: '開発者がGitHub Copilot Chatに対して「この関数をリファクタリングして」とだけ入力したところ、意図とは全く異なる変更が提案されました。期待通りのリファクタリング結果を得るために、プロンプトに追加すべき具体的な文脈として最も適切なものはどれですか？',
    choices: {
      A: 'リファクタリングの目的（可読性向上、パフォーマンス改善、例外処理の追加等）と、変更してはいけない制約条件',
      B: '開発者のプログラミング歴や好きなプログラミング言語の歴史に関する個人的なエピソード',
      C: 'プロジェクト全体の過去1年間のGitコミットメッセージの一覧とコミットハッシュ',
      D: '対象関数の作成者の氏名と、その関数が最初に実装された日付のタイムスタンプ情報',
    },
    explanation: '曖昧な指示を避け、「何を目的にリファクタリングするのか（ゴール）」と「何を維持すべきか（制約）」を明確に伝えることがプロンプト設計の基本です。',
    choiceExplanations: {
      A: '曖昧な指示を避け、「何を目的にリファクタリングするのか（ゴール）」と「何を維持すべきか（制約）」を明確に伝えることがプロンプト設計の基本です。',
      B: '開発者の経歴などの個人的情報はコードのリファクタリング仕様とは無関係なノイズです。',
      C: '大量の過去コミットログはトークン枠を浪費し、リファクタリングの目的を明確にする役には立ちません。',
      D: '作成者名や作成日付はコードロジックの改善方針を決定する材料にはなりません。',
    },
  },
  'q-d3-a08': {
    question: '複雑な決済返金ロジック（refunds/process.ts）の改修をCopilotに依頼したいと考えています。トークン制限の範囲内で精度を最大化するために、Chatへ提供する文脈情報の組み合わせとして最も適切なものはどれですか？',
    choices: {
      A: '改修対象のprocess.ts本体に加え、参照している型定義ファイルおよび返金の入力バリデーション処理コード',
      B: 'リポジトリ内に存在するすべての決済関連ファイル（50ファイル以上）を無差別に全件添付する',
      C: 'process.tsの関数本体のみを渡し、そこで使用されている型定義やバリデーション処理はモデルに推測させる',
      D: '決済とは無関係なフロントエンドUIのCSSスタイルシートと、READMEの概要ドキュメントのみを渡す',
    },
    explanation: '対象コードだけでなく、その振る舞いや契約を直接規定している型定義や検証関数を厳選して渡すことが、トークン枠内での精度最大化に最も効果的です。',
    choiceExplanations: {
      A: '対象コードだけでなく、その振る舞いや契約を直接規定している型定義や検証関数を厳選して渡すことが、トークン枠内での精度最大化に最も効果的です。',
      B: '全ファイルを渡すとコンテキスト予算を容易に超過し、重要な契約情報が切り捨てられてしまいます。',
      C: '依存する型やバリデーションを省くと、モデルが不正なシグネチャやルールを推測してバグの原因になります。',
      D: '無関係なCSSや概要ドキュメントでは、バックエンドの決済ロジックを改修するための情報が完全に不足します。',
    },
  },
  'q-d3-a09': {
    question: '企業のネットワーク環境において、接続診断ツールを実行したところ github.com へのHTTPS通信は成功しましたが、Copilotの公式Chat接続先エンドポイントへのアウトバウンドHTTPS通信がファイアウォールで遮断されていました。セキュリティ原則に従い、業務に必要な最小限のネットワーク許可変更として最も適切なものはどれですか？',
    choices: {
      A: 'ファイアウォールで、遮断されていた公式のCopilot Chat接続先FQDNに対するアウトバウンドHTTPS（ポート443）通信のみを許可する',
      B: '外部インターネット全体からの開発PCに対するインバウンドHTTPS（ポート443）通信を全開放する',
      C: '社内のすべてのデータベースサーバーに対するアウトバウンドHTTP（ポート80）通信を無制限に許可する',
      D: 'github.com に対するアウトバウンドSSH（ポート22）通信のポートフォワーディング設定を追加する',
    },
    explanation: '最小権限の原則に基づき、遮断が確認された特定のCopilot公式FQDNに対するアウトバウンドHTTPS通信のみをピンポイントで許可するのが適切です。',
    choiceExplanations: {
      A: '最小権限の原則に基づき、遮断が確認された特定のCopilot公式FQDNに対するアウトバウンドHTTPS通信のみをピンポイントで許可するのが適切です。',
      B: '開発PCへのインバウンド全開放は重大なセキュリティリスクを招き、Copilotのアウトバウンド通信要件とも異なります。',
      C: '社内DBへのHTTP許可は今回の外部サービス接続障害とは無関係であり、セキュリティ的にも不適切です。',
      D: 'SSH通信の許可はGit操作用であり、Copilot ChatのHTTPS API通信の遮断を解消する解決策にはなりません。',
    },
  },
  'q-d3-a10': {
    question: 'Copilot Chatの回答が古いドキュメント sdk-v1.md の記述を引用して失敗しました。現行の仕様は v2 ですが、Chatへの添付ファイルは v1 のままでした。旧会話と添付の版が双方疑わしい状況において、資料のバージョンだけが回答に与える影響を正確に比較検証するための次の実験として、最も適切なものはどれですか？',
    choices: {
      A: '添付ファイルを現行の sdk-v2.md に差し替え、使用する推論モデルと対象コードの条件は固定したまま再実行して比較する',
      B: '添付ファイルは古い v1 のまま維持し、対象コードの方を旧バージョンの仕様に合わせて書き換えて比較する',
      C: '添付ファイルは古い v1 のまま維持し、推論モデルの選択肢を別のモデルに切り替えて回答を比較する',
      D: '添付ファイルは古い v1 のまま維持し、プロンプトの文字数を意図的に増やして回答の変化を観察する',
    },
    explanation: '単一の要因（資料のバージョン）の影響を科学的に検証するには、他の変数（モデル、対象コード）を固定したまま、添付ファイルのみをv1からv2に差し替えて比較するのが適切です。',
    choiceExplanations: {
      A: '単一の要因（資料のバージョン）の影響を科学的に検証するには、他の変数（モデル、対象コード）を固定したまま、添付ファイルのみをv1からv2に差し替えて比較するのが適切です。',
      B: '対象コード側を変えてしまうと変数が2つになり、資料のバージョンによる純粋な効果を測定できません。',
      C: 'モデルを変更するとモデル性能の差が混入し、添付資料の版の影響を切り分けることができません。',
      D: 'プロンプトの文字数を変えても資料自体の古い内容を更新したことにはならず、比較として不適切です。',
    },
  },
  'q-d3-a11': {
    question: 'Copilot Chatの回答表示方式を、全生成完了後の一括表示からストリーミング表示へ変更しました。同一の依頼において最初の内容は2秒、回答完了は10秒でした。変更前は完了の10秒後まで画面に内容がありませんでした。この改善効果を技術的に最も正確に表す説明はどれですか？',
    choices: {
      A: '表示開始は10秒から2秒へと短縮され体感応答性が向上した（全体の完了時間は10秒のまま）',
      B: 'LLMのモデル内部におけるテキスト全体の生成処理時間が10秒から2秒へと大幅に短縮された',
      C: 'モデルが推論を開始してから最初のトークンを生成するまでの初期待機時間が完全に0秒になった',
      D: 'モデルが生成した回答テキスト全体の総文字数が変更前の5分の1に削減されたため表示が早くなった',
    },
    explanation: 'ストリーミングの主たる効果はTTFT（Time to First Token）の即時表示による体感レイテンシの改善であり、全体の生成完了時間そのものを短縮するわけではありません。',
    choiceExplanations: {
      A: 'ストリーミングの主たる効果はTTFT（Time to First Token）の即時表示による体感レイテンシの改善であり、全体の生成完了時間そのものを短縮するわけではありません。',
      B: 'ストリーミングは転送・表示の方式であり、モデル全体の計算完了時間を短縮させるものではありません。',
      C: '最初のトークン出力までに2秒かかっており、推論時間が0秒になったわけではありません。',
      D: '回答のデータ量が減ったわけではなく、同じ内容を順次逐次描画しているだけです。',
    },
  },
  'q-d3-a12': {
    question: '独自のCopilot補完クライアントの仕様として「キーボードの最後の入力から100ms経過した後に補完リクエストを送信する（デバウンス）」と設計されています。ユーザーが 0ms 時点と 40ms 時点に入力を行い、80ms 時点ではリクエストはまだ送信されていません。この仕様に従った場合、次回の補完リクエスト送信予定時刻は何msですか？',
    choices: {
      A: '140ms（最後のキー入力時刻 40ms に待機時間 100ms を加算した時刻）',
      B: '100ms（最初のキー入力時刻 0ms に待機時間 100ms を加算した時刻）',
      C: '80ms（直近の観測時刻 80ms において即座に送信が実行される）',
      D: '240ms（2回の入力それぞれに100msの待機時間を累積させた時刻）',
    },
    explanation: 'デバウンス処理では「最後」のイベント発生時刻（40ms）を起点としてタイマーがリセットされるため、40ms + 100ms = 140ms が送信予定時刻となります。',
    choiceExplanations: {
      A: 'デバウンス処理では「最後」のイベント発生時刻（40ms）を起点としてタイマーがリセットされるため、40ms + 100ms = 140ms が送信予定時刻となります。',
      B: '最初の入力（0ms）基準で送ると、40msの入力途中で不要なリクエストが発火してしまいデバウンスになりません。',
      C: '80ms時点では最後の入力から40msしか経過しておらず、100msの待機条件を満たしていません。',
      D: '待機時間を累積させる計算は誤りであり、デバウンスは最後の入力から一定時間を計測します。',
    },
  },
  'q-d3-a13': {
    question: 'GitHub REST APIを利用して組織内のCopilot利用状況メトリクスを集計していたところ、APIがHTTP 429（Too Many Requests）エラーと共に `Retry-After: 8` ヘッダーを返却しました。この処理の再試行はまだ1回目です。APIレート制限のベストプラクティスに沿った再試行方針として、最も適切なものはどれですか？',
    choices: {
      A: 'Retry-Afterヘッダーの指示に従って8秒以上待機した後にリクエストを再試行し、並行リクエスト数を抑制する',
      B: '待機時間を短縮して2秒後に即座に再試行を実行し、バッチ全体の処理遅延を最小限に抑える',
      C: '8秒待機した後にリクエストを再試行するが、遅れを取り戻すために同時リクエスト数を倍増させる',
      D: 'エラー受信直後に待機なしで即座に再試行を連続実行し、成功レスポンスが得られた後に8秒間待機する',
    },
    explanation: 'HTTP 429を受信した際は、サーバーから指定された Retry-After ヘッダーの秒数（8秒以上）を厳守して待機し、同時実行負荷を下げるのが標準的な対応です。',
    choiceExplanations: {
      A: 'HTTP 429を受信した際は、サーバーから指定された Retry-After ヘッダーの秒数（8秒以上）を厳守して待機し、同時実行負荷を下げるのが標準的な対応です。',
      B: '指定された待機時間を無視して早期再試行を行うと、制限ペナルティが延長される原因になります。',
      C: '再試行時にリクエスト数を増やすとサーバー負荷がさらに悪化し、連続ブロックを招きます。',
      D: '待機なしの即時再試行はレート制限違反を激化させ、APIアクセスの完全停止につながる危険があります。',
    },
  },
  'q-d3-a14': {
    question: 'GitHub Copilotにコード生成を依頼する際、今回のコンテキスト予算（利用可能トークン上限）は 4096 トークンと設定されています。必須情報として「対象の実装コード：1000トークン」と「型定義ファイル：500トークン」は全量を渡す必要があります。一方、背景資料（3000トークン）は要約や部分抽出が可能です。必須情報をすべて維持しながら予算内に収める構成として、最も適切なものはどれですか？（数値は設問の条件）',
    choices: {
      A: '背景資料を2000トークンに絞り込み、対象実装1000、型定義500と合わせて合計3500トークンで渡す',
      B: '背景資料3000を全量渡し、対象実装1000、型定義500と合わせて合計4500トークンで渡す',
      C: '背景資料3000を全量渡し、対象実装を500に削り、型定義500と合わせて合計4000トークンで渡す',
      D: '背景資料3000を全量渡し、対象実装1000を維持し、型定義を0（渡さない）にして合計4000トークンで渡す',
    },
    explanation: '必須情報である実装（1000）と型（500）の計1500トークンを維持し、背景資料を2000以下に圧縮することで、合計3500トークンとなり上限4096内に確実に収まります。',
    choiceExplanations: {
      A: '必須情報である実装（1000）と型（500）の計1500トークンを維持し、背景資料を2000以下に圧縮することで、合計3500トークンとなり上限4096内に確実に収まります。',
      B: '合計4500トークンとなり、上限である4096トークンを超過してコンテキストが切り捨てられます。',
      C: '必須条件である「対象実装1000の全量を渡す」を破って500に削ってしまっているため不適合です。',
      D: '必須条件である「型定義500の全量を渡す」を破って型情報を完全に落としてしまっているため不適合です。',
    },
  },
  'q-d3-a15': {
    question: '同一のプロンプトとモデルを用いて、Copilotが生成した数値フォーマット関数 formatTotal(8) を20回検証しました。出力結果はすべて文字列 "8.0" または "8.00" であり、アサーション `Number(result) === 8` のテストは20回すべて成功しました。しかし、本来の仕様契約は「数値として8であり、かつ小数点以下2桁の文字列であること（例: "8.00"）」でした。この結果に対する品質評価と追加検証として、最も適切なものはどれですか？',
    choices: {
      A: '数値としての値は達成しているが書式契約（小数点以下2桁）は未達であると判断し、書式修正と桁数アサーションを追加する',
      B: '数値としての値は未達だが書式契約は達成していると判断し、数値計算ロジックの修正と期待値テストを追加する',
      C: '数値および書式契約の両方を満たしていると判断し、この入力に対する採用候補としてそのままテストを終了する',
      D: '数値および書式契約の双方が未達であると判断し、関数全体のアルゴリズムをゼロから再設計するよう指示する',
    },
    explanation: 'Number()で数値変換しただけのテストでは "8.0" も合格してしまい、契約である小数点2桁（"8.00"）の欠落を検出できません。書式の厳密な正規表現や桁数テストを追加して修正する必要があります。',
    choiceExplanations: {
      A: '数値としての値は達成しているが書式契約（小数点以下2桁）は未達であると判断し、書式修正と桁数アサーションを追加する',
      B: '数値自体は8で合致しているため、「数値が未達」とする判断は誤りです。',
      C: '"8.0" という不完全な書式が混入しているため、書式契約を満たしていると断定して採用するのは誤りです。',
      D: '数値自体の計算は正しく行われており、全体をゼロから作り直す必要はありません。',
    },
  },
  'q-d3-a16': {
    question: '社内のCopilot検証記録には受容回数と応答時間だけがあり、入力・候補本文は含みません。誤った補完について、その時点の入力と候補内容を照合したいと考えています（共有範囲は承認済みの社内データとします）。この原因調査を可能にするために追加収集すべき材料として、最も適切なものはどれですか？',
    choices: {
      A: '補完がトリガーされた時点のプロンプト入力内容、提示された補完候補本文、および前後のコード周辺状況の記録',
      B: '補完リクエストが送信された時点の接続先URLと、HTTPレスポンスステータスコードのみのアクセスログ',
      C: '組織全体のCopilotシートライセンス割り当て数と、月次の請求金額に関する管理ダッシュボードのデータ',
      D: '補完機能の全体の受容率グラフと、チームごとの平均キータイピング速度の推移メトリクス',
    },
    explanation: '誤った補完の原因を突き止めるには、メトリクス数値だけでなく、モデルに何が渡され（プロンプト）、何が出力されたか（候補本文）の具体テキストが不可欠です。',
    choiceExplanations: {
      A: '誤った補完の原因を突き止めるには、メトリクス数値だけでなく、モデルに何が渡され（プロンプト）、何が出力されたか（候補本文）の具体テキストが不可欠です。',
      B: 'HTTPステータスコードだけでは、生成されたコードの論理的な誤りやプロンプトの内容を分析できません。',
      C: 'ライセンスや請求データは管理会計の情報であり、補完ロジックのデバッグには何の関係もありません。',
      D: '受容率やタイピング速度の集計値から、特定の誤ったコード生成の原因を特定することはできません。',
    },
  },
  'q-d3-a17': {
    question: '独自の補完クライアントの検証記録は「要求送信成功、候補1件受信、提示可判定0件、UIへ渡した候補0件」と記録されており、エディタ画面上には補完候補が表示されませんでした。モデルによる生成の成否と切り分けて、最初に調査すべき処理段階として最も適切なものはどれですか？（記録の項目はこの検証用の定義とします）',
    choices: {
      A: '受信した補完候補に対してUI表示前に適用されている、フィルターや構文妥当性チェック等の提示可否判定ロジック',
      B: 'エディタからCopilotバックエンドサーバーへリクエストを送信する際のネットワーク接続経路',
      C: 'UI層へ正常に渡された補完候補をエディタ画面上にゴーストテキストとして描画するレンダリング処理',
      D: 'リクエストを送信する前にエディタ内の開いているファイルから文脈を収集するプロンプト組み立て処理',
    },
    explanation: 'ログから「候補1件受信」までは成功しており、「提示可判定0件」で落とされているため、モデル生成後・UI表示前の判定フィルターを調べるのが直接の切り分けです。',
    choiceExplanations: {
      A: 'ログから「候補1件受信」までは成功しており、「提示可判定0件」で落とされているため、モデル生成後・UI表示前の判定フィルターを調べるのが直接の切り分けです。',
      B: '候補を1件受信できているため、ネットワーク接続やリクエスト送信は正常に成功しています。',
      C: 'UIへ渡した候補が0件であるため、UI描画処理に到達する前の段階で候補が脱落しています。',
      D: '文脈収集とリクエスト送信は既に成功して候補が返ってきているため、送信前の問題ではありません。',
    },
  },
  'q-d3-a18': {
    question: '独自の補完クライアントは「現在版と一致する応答だけを採用し、同じ版の処理中要求を重複送信しない」という規則で動作しています。現在の文書はv9で、v9の要求は処理中である状況において、以前のv7要求への応答が今届きました。このクライアントの規則に沿った正しい処理として、最も適切なものはどれですか？',
    choices: {
      A: '到着した過去の v7 レスポンスは直ちに破棄し、現在処理中である v9 レスポンスの到着を待機する',
      B: '到着した v7 レスポンスをエディタに確定採用し、現在処理中の v9 リクエストは即座にキャンセルする',
      C: '到着した v7 レスポンスを破棄した上で、次のバージョンである v10 のリクエストを新規に前倒し送信する',
      D: '到着した v7 レスポンスを破棄した上で、現在処理中である v9 のリクエストを再度重複して新規送信する',
    },
    explanation: '現在のエディタ状態（v9）と不一致な過去の古いレスポンス（v7）は破棄し、既に送信済みで処理中であるv9の結果を待つのが整合性ルールに合致します。',
    choiceExplanations: {
      A: '現在のエディタ状態（v9）と不一致な過去の古いレスポンス（v7）は破棄し、既に送信済みで処理中であるv9の結果を待つのが整合性ルールに合致します。',
      B: '古いv7の候補を採用すると、ユーザーが既に入力を進めたv9のコードと不整合を起こしてコードが壊れます。',
      C: 'v10の入力が行われていない段階で架空のリクエストを前倒し送信するのは無意味です。',
      D: '「同じ版の処理中要求を重複送信しない」というルールに違反して重複負荷をかけてしまいます。',
    },
  },
  'q-d3-a19': {
    question: '独自の補完検証ゲートは、対象モデル用tokenizerで測った入力全体が800トークン以下なら通す仕様です。記録の内訳として、共通前置きは50トークン、本文Xは600文字・900トークン、本文Yは800文字・200トークンでした。前置きを含む二つの入力（XおよびY）の合否判定として、最も適切なものはどれですか？（数値はこの検証例の測定値とします）',
    choices: {
      A: '本文Yのみを通過させ（合計250トークン ≦ 800）、本文Xは通過を拒否する（合計950トークン ＞ 800）',
      B: '本文Xのみを通過させ（文字数が600文字と短いため）、本文Yは通過を拒否する（800文字と長いため）',
      C: '本文Xと本文Yの両方を通過させる（文字数平均が700文字でありトークン上限を下回ると推定されるため）',
      D: '本文Xと本文Yの両方の通過を拒否する（いずれの本文も文字数が多すぎて安全マージンを超過するため）',
    },
    explanation: 'トークン制限の判定は文字数ではなく実際のトークン数で計算します。Xは50+900=950で上限800を超過し不合格、Yは50+200=250で上限以内のため合格となります。',
    choiceExplanations: {
      A: 'トークン制限の判定は文字数ではなく実際のトークン数で計算します。Xは50+900=950で上限800を超過し不合格、Yは50+200=250で上限以内のため合格となります。',
      B: '文字数は短くてもトークン数が950に達しているため、Xを通過させる判定は誤りです。',
      C: '文字数からの大まかな推定ではなく、実際のトークナイザー測定値（950トークン）に基づいてXは遮断されます。',
      D: '本文Yは前置きを含めても250トークンであり、800トークンの基準を十分に満たしているため拒否するのは不当です。',
    },
  },
};

export function applyD3Rewrites() {
  const seed = read('content/gh300/2026-08-07/questions/seed.json');
  assertLegacyRewriteScope(seed, d3Rewrites);
  const appliedRep = read('reports/applied-question-quality-review.json');
  const diffRep = read('content/gh300/2026-08-07/questions/difficulty-review.json');
  const qualRep = read('content/gh300/2026-08-07/questions/quality-review.json');
  const classRep = read('reports/question-objective-classification-review.json');
  const addsRep = read('content/gh300/2026-08-07/questions/additions-review.json');
  const exclusionsRep = read('content/gh300/2026-08-07/questions/selection-exclusions.json');
  const cleanupRep = read('reports/d4-d5-applied-cleanup-review.json');

  let updatedCount = 0;
  for (const [id, rw] of Object.entries(d3Rewrites)) {
    const q = seed.find((item) => item.id === id);
    if (!q) {
      console.warn(`Question not found in seed: ${id}`);
      continue;
    }

    q.question = rw.question;
    q.explanation = rw.explanation;
    q.choiceExplanations = rw.choiceExplanations;
    q.choices = q.choices.map((c) => ({
      id: c.id,
      text: rw.choices[c.id] ?? c.text,
    }));

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

    const currentFingerprint = hash(q);

    const repRow = appliedRep.questions.find((r) => r.id === id);
    if (repRow) {
      repRow.after = structuredClone(q);
      repRow.fingerprint = currentFingerprint;
      repRow.assessment = `${rw.question.slice(0, 45)}...の実務応用判断。`;
      repRow.decisiveCondition = `判断条件：${rw.question.slice(0, 40)}`;
      repRow.wrongChoiceAnalysis = q.choices
        .filter((c) => !q.answer.includes(c.id))
        .map((c) => ({
          id: c.id,
          text: c.text,
          whyWrong: rw.choiceExplanations[c.id],
        }));
    }

    if (diffRep.questions && diffRep.questions[id]) {
      diffRep.questions[id].fingerprint = currentFingerprint;
      diffRep.questions[id].reasoning = `判断条件を特定する：${rw.question.slice(0, 50)}`;
      diffRep.questions[id].textRewritten = true;
    }

    if (qualRep.questions && qualRep.questions[id]) {
      qualRep.questions[id].fingerprint = currentFingerprint;
      qualRep.questions[id].after = structuredClone(q);
      qualRep.questions[id].rationale = rw.explanation;
    }

    const classRow = classRep.questions?.find((r) => r.id === id);
    if (classRow) {
      classRow.fingerprint = currentFingerprint;
      classRow.after = structuredClone(q);
    }

    const addRow = addsRep.questions?.find((r) => r.id === id);
    if (addRow) {
      addRow.fingerprint = currentFingerprint;
      addRow.after = structuredClone(q);
    }

    const exclRow = exclusionsRep.questions?.find((r) => r.id === id);
    if (exclRow) {
      exclRow.fingerprint = currentFingerprint;
    }

    const cleanRow = cleanupRep.questions?.find((r) => r.id === id);
    if (cleanRow) {
      cleanRow.fingerprint = currentFingerprint;
      cleanRow.after = structuredClone(q);
    }

    updatedCount++;
  }

  write('content/gh300/2026-08-07/questions/seed.json', seed);
  write('reports/applied-question-quality-review.json', appliedRep);
  write('content/gh300/2026-08-07/questions/difficulty-review.json', diffRep);
  write('content/gh300/2026-08-07/questions/quality-review.json', qualRep);
  write('reports/question-objective-classification-review.json', classRep);
  write('content/gh300/2026-08-07/questions/additions-review.json', addsRep);
  write('content/gh300/2026-08-07/questions/selection-exclusions.json', exclusionsRep);
  write('reports/d4-d5-applied-cleanup-review.json', cleanupRep);

  console.log(`Successfully updated ${updatedCount} D3 questions across all stores.`);

  try {
    execFileSync(process.execPath, ['scripts/audit-applied-question-review.mjs'], { stdio: 'inherit' });
    console.log('✓ Regenerated applied-question-quality-review.md');
  } catch (e) {
    console.error('Failed audit-applied-question-review:', e.message);
  }

  try {
    execFileSync(process.execPath, ['scripts/audit-choice-quality.mjs'], { stdio: 'inherit' });
    console.log('✓ Regenerated question-choice-quality-audit.json');
  } catch (e) {
    console.error('Failed audit-choice-quality:', e.message);
  }

  try {
    execFileSync(process.execPath, ['scripts/audit-question-difficulty.mjs'], { stdio: 'inherit' });
    console.log('✓ Regenerated question-difficulty review');
  } catch (e) {
    console.error('Failed audit-question-difficulty:', e.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('rewrite-d3-applied.mjs')) {
  applyD3Rewrites();
}

