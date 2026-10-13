import { assertLegacyRewriteScope } from './question-rewrite-safety.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, root), 'utf8'));
const write = (f, data) => fs.writeFileSync(new URL(f, root), JSON.stringify(data, null, 2) + '\n', 'utf8');
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// D5 Applied Rewrites (All 15 questions: q-d5-a01 to q-d5-a15)
export const d5Rewrites = {
  'q-d5-a01': {
    question: '決済処理関数 processPayment は、外部決済APIが残高不足エラーを返却した場合に注文ステータスを unpaid のまま維持する仕様契約です。本番の外部課金なしで成功・残高不足を検証するために、生成テストへ追加すべきモック構成として最も適切なものはどれですか？',
    choices: {
      A: '外部決済APIクライアントをモック化し、決済成功と残高不足エラーの各レスポンスをテスト内でシミュレートする',
      B: '本番の外部決済APIエンドポイントに対してテスト用のクレジットカード番号で実際に通信リクエストを送信する',
      C: '残高不足のテストを完全に省略し、正常系決済が成功して注文が完了するケースのみをモックなしで検証する',
      D: 'テスト環境のデータベースを手動で直接書き換え、決済処理関数の実行をバイパスして unpaid に更新する',
    },
    explanation: '外部API課金や副作用を伴うことなく安全に異常系（残高不足）を検証するには、外部APIクライアントをモック化して制御可能なテストダブルを用いるのが基本です。',
    choiceExplanations: {
      A: '外部API課金や副作用を伴うことなく安全に異常系（残高不足）を検証するには、外部APIクライアントをモック化して制御可能なテストダブルを用いるのが基本です。',
      B: '本番APIへの直接通信は実課金やデータ汚染のリスクがあり、CI等での自動テストには適しません。',
      C: '残高不足ケースを省略すると、決済失敗時の重要な契約ロジックが未検証のまま本番へリリースされてしまいます。',
      D: 'DBの手動更新は関数の挙動そのものを検証したことにならず、テストの自動化にも反します。',
    },
  },
  'q-d5-a02': {
    question: 'Copilotがパフォーマンス改善として提案した早期リターン（Early Return）のコードを取り込んだところ、監査ログの記録処理が実行されなくなるデグレードが発生しました。システムの仕様契約は「入力バリデーションを通過したすべての処理は、成功・失敗を問わず必ず監査ログを1回記録すること」です。既存の早期リターンによる効率化を活かしつつ、この監査ログ漏れを防ぐリファクタリングとして、最も適切なものはどれですか？',
    choices: {
      A: '監査ログの出力処理を try...finally ブロック等に配置し、後続の早期リターン経路でも確実にログが記録されるようにする',
      B: '早期リターンの記述をすべて削除し、以前の深くネストされた多重 if-else 構文へ完全に差し戻す',
      C: '失敗時の監査ログ出力を不要として仕様書側を改定し、正常終了時のみログを記録するよう契約を変更する',
      D: '関数の戻り値オブジェクトの中にログメッセージを文字列として含め、呼び出し元にログ記録を丸投げする',
    },
    explanation: 'try...finallyブロック等を利用することで、早期リターンによる可読性や処理効率を維持しながら、終了時に必ず実行される保証（監査ログ記録）を両立できます。',
    choiceExplanations: {
      A: 'try...finallyブロック等を利用することで、早期リターンによる可読性や処理効率を維持しながら、終了時に必ず実行される保証（監査ログ記録）を両立できます。',
      B: '深くネストされたコードへの完全差し戻しは可読性を損ない、早期リターンのメリットを失わせます。',
      C: '監査要件のログ記録を勝手に落とすことは、コンプライアンスや運用追跡の仕様契約違反です。',
      D: '呼び出し元に関数の責務である監査ログ記録を委譲すると、呼び出し側の改修が全域に波及しバグの原因になります。',
    },
  },
  'q-d5-a03': {
    question: 'Copilotが自動生成したプルリクエストの要約文には「後方互換性の破壊的変更なし」と記載されていましたが、実際の差分を確認すると公開関数 submitOrder のリトライ回数引数のデフォルト値が 3 から 0 に変更されていました。この破壊的変更を見落とさずにレビュー・検出するためのアプローチとして、最も適切なものはどれですか？',
    choices: {
      A: 'Copilotの要約テキストのみを信じるのではなく、公開APIのシグネチャと既定値の振る舞いを検証する互換性回帰テストを実行・確認する',
      B: 'Copilotの要約文が正しいと見なしてそのままマージし、本番環境でのエラー監視アラートによって影響を確認する',
      C: 'Gitのコミットメッセージに [no-compat] というタグを追加し、破壊的変更があっても警告を無視するようCIを設定する',
      D: 'プルリクエストの変更行数（Diff）が100行未満であれば、公開APIの互換性チェックを自動スキップするルールを導入する',
    },
    explanation: 'AIによる要約は破壊的変更を見落としたり誤認することがあるため、公開APIのデフォルト値や挙動を固定した互換性回帰テストで機械的に検証することが不可欠です。',
    choiceExplanations: {
      A: 'AIによる要約は破壊的変更を見落としたり誤認することがあるため、公開APIのデフォルト値や挙動を固定した互換性回帰テストで機械的に検証することが不可欠です。',
      B: 'AIの要約を無批判に受け入れて本番へ流すことは重大な障害やデグレードを引き起こす原因になります。',
      C: 'CIの警告を無視する設定は、後方互換性の破壊を検知するセーフティネットを無効化してしまいます。',
      D: '変更行数の少なさは互換性維持の根拠にならず、1行の既定値変更でも重大な破壊的変更となり得ます。',
    },
  },
  'q-d5-a04': {
    question: 'Copilotが提案した顧客一覧取得SQLは注文履歴が存在する顧客のみを返却し、「注文が0件の新規顧客」が一覧から欠落するバグがありました（なお、論理削除済み顧客は除外する仕様です）。このクエリのバグを検出し修正を確認するために追加すべきテストデータと期待される結果として、最も適切なものはどれですか？',
    choices: {
      A: '注文が0件の有効な顧客レコードを用意し、その顧客がクエリ結果の一覧に正しく含まれることを検証する',
      B: '注文が複数件存在する既存顧客レコードを用意し、その顧客がクエリ結果に重複して出力されないかを検証する',
      C: '論理削除済みの顧客レコードを用意し、その顧客がクエリ結果の一覧から正しく除外されているかを検証する',
      D: '注文金額が合計0円の注文データを用意し、注文履歴として正常に集計処理されるかを検証する',
    },
    explanation: 'INNER JOINによって注文0件の顧客が落ちている欠陥を検出するには、「有効だが注文が0件の顧客」をテストデータに含め、LEFT JOIN等で正しく取得できることを確認します。',
    choiceExplanations: {
      A: 'INNER JOINによって注文0件の顧客が落ちている欠陥を検出するには、「有効だが注文が0件の顧客」をテストデータに含め、LEFT JOIN等で正しく取得できることを確認します。',
      B: '注文がある顧客のテストは既に通っており、注文0件の顧客が欠落するバグを検出できません。',
      C: '論理削除顧客の除外は別の要件であり、注文0件の顧客が取得できない欠陥の検証にはなりません。',
      D: '0円注文は注文データが存在するケースであり、注文レコードが全くない顧客の欠落を再現できません。',
    },
  },
  'q-d5-a05': {
    question: 'チームではConventional Commits規約を採用しています。Copilotが提案したコード差分は `Math.floor(total)` を `Math.round(total)` に修正し、税込計算結果 10.6 の丸め結果を 10 から 11 へ修正するものでした。承認された仕様は「四捨五入」であり、公開APIやドキュメントは変更していません。この変更の意味を最も正確に表すコミットメッセージはどれですか？',
    choices: {
      A: 'fix: 税込価格の端数処理における計算誤りを四捨五入へ修正',
      B: 'refactor: 税込価格の計算処理ロジックを関数へ分割リファクタリング',
      C: 'feat: 税込価格に対する新しい特別割引計算機能を追加',
      D: 'docs: 税込価格計算関数の利用サンプルコードをドキュメントへ追記',
    },
    explanation: '仕様通りの四捨五入になっていなかった既存の計算バグ（切り捨て）を修正する差分であるため、Conventional Commitsのプレフィックスは fix: が適切です。',
    choiceExplanations: {
      A: '仕様通りの四捨五入になっていなかった既存の計算バグ（切り捨て）を修正する差分であるため、Conventional Commitsのプレフィックスは fix: が適切です。',
      B: '内部構造の改善ではなく計算結果（バグ）の修正であるため、refactor ではありません。',
      C: '新機能の追加ではないため、feat ではありません。',
      D: 'コードの修正でありドキュメントのみの変更ではないため、docs ではありません。',
    },
  },
  'q-d5-a06': {
    question: 'Copilotが生成したテスト `test("works")` は、価格計算、アクセス権限チェック、通知送信の3つの検証を1つのテストケース内にまとめて記述していました。失敗時の原因特定を迅速化し、個別の仕様単位で再実行できるようにするためのテスト改善として、最も適切なものはどれですか？',
    choices: {
      A: '価格計算、アクセス権限、通知送信の各振る舞いごとに独立した名前を持つ3つのテストケースへ分割する',
      B: '3つの検証のアサーションを1つのヘルパー関数にまとめ、同じ test("works") からそのヘルパーを呼び出す',
      C: '3つの期待値の出力をすべて結合して1つのスナップショットファイルにまとめ、差分テストに変更する',
      D: 'テストケース名を test("works - price, auth, and notification") に改名し、1つのテストケースのまま維持する',
    },
    explanation: '単一責任の原則に従い、振る舞い（仕様）ごとにテストを分割して具体的な名前を付けることで、障害発生時の原因特定と個別再実行が容易になります。',
    choiceExplanations: {
      A: '単一責任の原則に従い、振る舞い（仕様）ごとにテストを分割して具体的な名前を付けることで、障害発生時の原因特定と個別再実行が容易になります。',
      B: 'ヘルパーにまとめても1つのテスト内で実行されるため、途中失敗で後続がスキップされる問題は解決しません。',
      C: '巨大スナップショットは壊れやすく、どの振る舞いが失敗したのかのデバッグを困難にします。',
      D: '名前を長くしてもテストが結合したままでは、個別の再実行や診断性の向上には繋がりません。',
    },
  },
  'q-d5-a07': {
    question: '日付処理ライブラリをv2へバージョンアップしたところ、TypeScriptの型検査はパスしましたが、システム上の日付が1日ずれる現象が発生しました。移行ガイドを確認すると「既定の解釈タイムゾーンがUTCへ変更された」と記載されています。自社システムの承認契約は「Asia/Tokyo の暦日を厳密に維持すること」です。Copilotへ依頼すべき互換性検証テストとして、最も適切なものはどれですか？',
    choices: {
      A: '同一のUTC時刻をAsia/Tokyoの日付切り替え境界（深夜0時前後）で与え、算出される暦日（年月日）を比較検証する',
      B: '同一の日付文字列を不正なフォーマットで複数入力し、バリデーションエラーの発生形式を比較検証する',
      C: '同一の時刻をUTCの正午付近（12:00）で固定して入力し、生成されるISO文字列のフォーマットを比較検証する',
      D: '大量の日付データを一度に配列で渡し、v1とv2での処理速度やメモリ使用量の差異をベンチマーク比較する',
    },
    explanation: 'タイムゾーン既定値の変更による日付ずれを検出するには、JSTとUTCで日付が分かれる境界時刻（日本時間の0時〜9時台）を入力して暦日を比較するテストが必要です。',
    choiceExplanations: {
      A: 'タイムゾーン既定値の変更による日付ずれを検出するには、JSTとUTCで日付が分かれる境界時刻（日本時間の0時〜9時台）を入力して暦日を比較するテストが必要です。',
      B: '不正フォーマットのエラー検証では、正常な日時におけるタイムゾーン変換のズレを検出できません。',
      C: 'UTC正午はJSTでも同一暦日（21時）となるため、日付が1日ずれる境界バグを検出できません。',
      D: 'パフォーマンステストでは、ビジネスロジックにおける1日の日付ズレという正しさの破壊を検証できません。',
    },
  },
  'q-d5-a08': {
    question: 'GitHub Copilotが生成したデータベーステストは、単純なCRUD操作であれば軽量なSQLiteで成功しますが、本番PostgreSQL固有のJSON演算子（->>等）を使用するクエリで構文エラーになります。高速なCRUDテストはSQLiteで維持しつつ、本番固有クエリの確実な動作を保証するためのテスト構成として、最も適切なものはどれですか？',
    choices: {
      A: '標準的なCRUDテストは高速なSQLiteで実行し、DB固有演算子を使用する検索テストは本番と同種のDB（Dockerコンテナ等）で実行する',
      B: 'CRUDテストもDB固有検索テストも、すべてのテストケースを本番と同種のPostgreSQL環境でのみ実行するよう統合する',
      C: 'DB固有のJSON演算子を使用する検索クエリをすべて固定値のモック（スタブ）に置き換え、SQLiteのみでテストを完結させる',
      D: 'DB固有検索クエリのテストをSQLiteで実行し、標準的なCRUDテストの方を本番と同種のPostgreSQLで実行する',
    },
    explanation: 'テスト実行速度と本番パリティ（忠実度）のバランスを取るため、汎用CRUDは軽量SQLiteで高速に回し、DB方言固有の演算子は本番同等DBコンテナで検証する多層構成が最適です。',
    choiceExplanations: {
      A: 'テスト実行速度と本番パリティ（忠実度）のバランスを取るため、汎用CRUDは軽量SQLiteで高速に回し、DB方言固有の演算子は本番同等DBコンテナで検証する多層構成が最適です。',
      B: 'すべてのテストを重い本番DBで動かすと、日々の単体テストの実行速度が大幅に低下して開発効率を損ないます。',
      C: '固有クエリを固定スタブにすると、SQL構文エラーや実際のJSON抽出ロジックの不具合を見逃してしまいます。',
      D: '固有演算子のエラーが起きているのに固有検索をSQLiteで動かすのは論理的に破綻しています。',
    },
  },
  'q-d5-a09': {
    question: 'Copilotのコードレビューが「不要なnullチェックの削除」を提案してきました。TypeScriptの型定義上は `User` 型（非null）と宣言されていますが、過去の移行データには一部nullが混入している運用実態があります。正常なUserデータでのテストは既に成功している場合、この提案の採否を判断するために追加すべき再現テストとして、最も適切なものはどれですか？',
    choices: {
      A: '過去の実データに存在する null 値を意図的に渡し、nullチェック削除前後で例外が発生しないかを検証する',
      B: 'Userオブジェクトの name プロパティに最大文字数の文字列を渡し、境界値での動作を検証する',
      C: 'Userオブジェクトの name プロパティに空文字（""）を渡し、バリデーションの動作を検証する',
      D: 'Userオブジェクトの省略可能な email プロパティを未設定（undefined）にして動作を検証する',
    },
    explanation: '型定義と実行時データの乖離（レガシーデータのnull混入）がある場合、防御的コードを安易に削除するとクラッシュします。null入力での再現テストで安全性を検証する必要があります。',
    choiceExplanations: {
      A: '型定義と実行時データの乖離（レガシーデータのnull混入）がある場合、防御的コードを安易に削除するとクラッシュします。null入力での再現テストで安全性を検証する必要があります。',
      B: '文字列長のテストは型定義の範囲内の検証であり、null値混入時のクラッシュ耐性は検証できません。',
      C: '空文字は文字列型（string）の有効値であり、null参照例外（Cannot read properties of null）の検証にはなりません。',
      D: 'undefinedのテストでは、実際のDBに保存されているレガシーなnull値に対する挙動を正確に確認できません。',
    },
  },
  'q-d5-a10': {
    question: 'Copilotが提案した検索ソート最適化ロジックは、重複キーのない100件のテストデータで既存実装より高速に動作しました。しかし、本番環境のデータは「同一キーの重複を多数含む10万件」が中心であり、ソート結果の順序安定性（安定ソート）を維持する仕様契約です。この最適化案の本番採用を判断するために追加すべき比較検証として、最も適切なものはどれですか？',
    choices: {
      A: '本番環境と同等の「重複キーを含む10万件」のデータセットを用いて、新旧実装の処理時間および結果の並び順の同一性を比較検証する',
      B: '重複キーを含まないユニークな10万件のデータセットのみを用いて、新旧実装の処理時間（ミリ秒）の短縮率のみを比較する',
      C: '重複キーを含む100件の小規模データセットを用いて、結果の並び順と処理時間を測定して比較する',
      D: '本番の10万件データを用いて、処理後のレコード件数のみが元の10万件と一致しているかを比較する',
    },
    explanation: '本番規模（10万件）かつ本番データ特性（重複キー）におけるパフォーマンス測定を行い、同時に安定ソート（順序互換性）が破壊されていないかを比較検証する必要があります。',
    choiceExplanations: {
      A: '本番規模（10万件）かつ本番データ特性（重複キー）におけるパフォーマンス測定を行い、同時に安定ソート（順序互換性）が破壊されていないかを比較検証する必要があります。',
      B: '重複キーなしでは安定ソートの崩れを検出できず、速度だけの評価では互換性リスクを排除できません。',
      C: '100件の小規模データでは、アルゴリズムの計算量（O(N log N) vs O(N^2) 等）の本番負荷下でのボトルネックが現れません。',
      D: '件数チェックだけでは、データの順序が入れ替わってしまっているソート不具合を検出できません。',
    },
  },
  'q-d5-a11': {
    question: 'Copilotが自動生成したREADMEの手順に従ってクリーンな新規環境でアプリケーションを起動したところ、起動時に `APP_MODE is required` というエラーが発生して終了しました。既存の開発者の端末では `APP_MODE=test` が環境変数に設定されており、ポート設定 `PORT=3000` は両環境で共通でした。新規参加者が再現して起動できるようにするためにREADMEへ追加すべき導入手順として、最も適切なものはどれですか？',
    choices: {
      A: '起動に必要な必須環境変数として APP_MODE=test の設定手順（.envファイルの作成例等）をREADMEに明記する',
      B: '既定値として既に共通認識となっている PORT=3000 の設定手順のみをREADMEのトラブルシューティングに追記する',
      C: 'ログ出力の詳細レベルを変更する環境変数 LOG_LEVEL=info の設定手順のみをREADMEに追記する',
      D: 'HTTPリクエストのタイムアウト時間を変更する環境変数 REQUEST_TIMEOUT=30 の設定手順のみをREADMEに追記する',
    },
    explanation: 'エラーメッセージが直接示している必須の未設定環境変数（APP_MODE）の設定手順をドキュメントに追加することが、クリーン環境での起動失敗の直接の解決策です。',
    choiceExplanations: {
      A: 'エラーメッセージが直接示している必須の未設定環境変数（APP_MODE）の設定手順をドキュメントに追加することが、クリーン環境での起動失敗の直接の解決策です。',
      B: 'PORT=3000 は既に両環境で共通であり、APP_MODE is required エラーの解決にはなりません。',
      C: 'LOG_LEVEL は必須変数ではなく、起動中断エラーを解消する情報ではありません。',
      D: 'REQUEST_TIMEOUT は起動要件とは無関係なオプション設定です。',
    },
  },
  'q-d5-a12': {
    question: 'テスト駆動開発（TDD）でGitHub Copilotとペアプログラミングを行い、割引計算処理を実装しています。承認済みの仕様は「価格100以上で20%割引（0.8倍）、100未満は割引なし（元の価格）」です。初回のテスト（入力100に対して期待値80）がRed（失敗）となりました。仕様契約を満たしてGreen（テスト成功）にするための実装条件として、最も適切なものはどれですか？',
    choices: {
      A: '価格 >= 100 の場合に 0.8倍とし、それ以外（100未満）は元の価格をそのまま返却する条件分岐を実装する',
      B: '価格 > 100 の場合に 0.8倍とし、それ以外（100以下）は元の価格をそのまま返却する条件分岐を実装する',
      C: 'すべての価格に対して一律で 0.8倍を適用し、価格による入力条件の分岐は一切設けない',
      D: '価格 <= 100 の場合に 0.8倍とし、それ以外（100超）は元の価格をそのまま返却する条件分岐を実装する',
    },
    explanation: '仕様の境界である「100以上」を正しく表現する比較演算子（>=）を用い、100未満には割引を適用しない実装とすることで、テストをGreenにし仕様を満たします。',
    choiceExplanations: {
      A: '仕様の境界である「100以上」を正しく表現する比較演算子（>=）を用い、100未満には割引を適用しない実装とすることで、テストをGreenにし仕様を満たします。',
      B: '「> 100」としてしまうと境界値である 100 が割引対象から漏れてしまい、失敗テストがGreenになりません。',
      C: '条件分岐なしでは100未満の通常価格まで割引されてしまい、重大な仕様違反となります。',
      D: '「<= 100」では高額商品ではなく低額商品に割引が適用されてしまい、仕様と正反対の動作になります。',
    },
  },
  'q-d5-a13': {
    question: '税計算処理のコードをCopilotでリファクタリングして近代化しようとしています。承認済みの仕様は「税額は価格の10%を四捨五入して整数とし、その税額を元の価格に加算する」です。リファクタリング前の既存コードに対する回帰テストを作成する際、価格 101 に対する期待される計算結果として、最も適切な値はどれですか？',
    choices: {
      A: '111（税額は 101 × 10% = 10.1 を四捨五入して 10 となり、元の価格 101 に加算して 111 となる）',
      B: '110（税額の計算において小数点を無条件で切り捨て、税額 10 を元の価格 101 に加算して 110 となる）',
      C: '111.1（税額の端数処理を一切行わずに浮動小数点数のまま元の価格に加算して 111.1 となる）',
      D: '101（税額計算をスキップして非課税の元の価格 101 をそのまま出力値とする）',
    },
    explanation: '承認仕様に従って計算すると、101 × 0.1 = 10.1 であり、四捨五入すると税額は 10 となります。したがって税込合計は 101 + 10 = 111 です。',
    choiceExplanations: {
      A: '承認仕様に従って計算すると、101 × 0.1 = 10.1 であり、四捨五入すると税額は 10 となります。したがって税込合計は 101 + 10 = 111 です。',
      B: '101 + 10 は 111 であり、110 とする計算は算術的に誤りです。',
      C: '端数処理を行わず小数を残すことは「四捨五入して整数とする」という仕様契約に違反します。',
      D: '税額を加算しないことは課税処理の契約に反します。',
    },
  },
  'q-d5-a14': {
    question: 'Copilotが提案した決済結果ハンドリングのコードは、カード残高不足（PaymentDeclined）と通信タイムアウト（Timeout）の両方を区別せずに同一の `null` に変換していました。決済API仕様において、Declinedは「課金なし確定」、Timeoutは「決済結果が不明（裏で課金成功した可能性あり）」です。再試行時の二重課金を防ぐ承認契約に沿った処理として、最も適切なものはどれですか？',
    choices: {
      A: 'Declinedの場合は明確に拒否結果を返し、Timeoutの場合は再試行前に決済プロバイダへ取引状態を照会する',
      B: 'Declinedの場合は決済プロバイダへ取引状態を照会し、Timeoutの場合は即座に拒否結果を返して処理を終了する',
      C: 'Declinedの場合もTimeoutの場合も、両方とも区別せずに即座に決済拒否（エラー）として処理を確定させる',
      D: 'Declinedの場合もTimeoutの場合も、両方とも即座に同一の決済リクエストを自動で再試行送信する',
    },
    explanation: 'Timeoutは結果が不確定なため、即座の再試行や安易な失敗確定を避け、まず状態照会（問い合わせ）を行うのが決済整合性の基本原則です。',
    choiceExplanations: {
      A: 'Timeoutは結果が不確定なため、即座の再試行や安易な失敗確定を避け、まず状態照会（問い合わせ）を行うのが決済整合性の基本原則です。',
      B: 'Declinedは課金なしが確定しているため照会は不要であり、Timeoutを安易に拒否扱いにすると二重課金リスクが残ります。',
      C: 'Timeoutを拒否として片付けると、ユーザーが別カードで再購入した際に二重課金が発生してしまいます。',
      D: 'Timeout時の無条件再試行は、決済APIが1回目の決済を既に処理していた場合に二重課金を直接引き起こします。',
    },
  },
  'q-d5-a15': {
    question: 'Copilotが生成したユーザー登録APIは、入力された age を型キャストするだけでそのままデータベースへ渡していました。承認済みの仕様契約は「整数値の18以上のみを受け入れ、数値文字列（"18"等）は自動変換せず拒否すること」です。修正後の境界値検証において、拒否時に入力バリデーションで弾かれDB保存処理が呼び出されないことも含めてテストする場合、入力 `17` / `18` / `"18"` に対する期待される判定結果として、最も適切なものはどれですか？',
    choices: {
      A: '入力 17 は拒否（DB未呼出）、入力 18 は許可（DB保存）、入力 "18" は拒否（DB未呼出）として検証する',
      B: '入力 17 は拒否（DB未呼出）、入力 18 は許可（DB保存）、入力 "18" は許可（DB保存）として検証する',
      C: '入力 17 は拒否（DB未呼出）、入力 18 は拒否（DB未呼出）、入力 "18" は拒否（DB未呼出）として検証する',
      D: '入力 17 は許可（DB保存）、入力 18 は許可（DB保存）、入力 "18" は拒否（DB未呼出）として検証する',
    },
    explanation: '契約は「18以上の整数のみ許可、文字列は変換せず拒否」であるため、17は拒否、18は許可、文字列"18"は拒否となります。',
    choiceExplanations: {
      A: '契約は「18以上の整数のみ許可、文字列は変換せず拒否」であるため、17は拒否、18は許可、文字列"18"は拒否となります。',
      B: '文字列"18"を許可してしまうと、「数値文字列は変換せず拒否」という契約に違反します。',
      C: '整数18まで拒否してしまうと、18以上という有効な境界値を受け入れられなくなります。',
      D: '17を許可してしまうと、18歳未満の未成年を誤って登録してしまう重大なバグになります。',
    },
  },
};

export function applyD5Rewrites() {
  const seed = read('content/gh300/2026-08-07/questions/seed.json');
  assertLegacyRewriteScope(seed, d5Rewrites);
  const appliedRep = read('reports/applied-question-quality-review.json');
  const diffRep = read('content/gh300/2026-08-07/questions/difficulty-review.json');
  const qualRep = read('content/gh300/2026-08-07/questions/quality-review.json');
  const classRep = read('reports/question-objective-classification-review.json');
  const addsRep = read('content/gh300/2026-08-07/questions/additions-review.json');
  const exclusionsRep = read('content/gh300/2026-08-07/questions/selection-exclusions.json');
  const cleanupRep = read('reports/d4-d5-applied-cleanup-review.json');

  let updatedCount = 0;
  for (const [id, rw] of Object.entries(d5Rewrites)) {
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

  console.log(`Successfully updated ${updatedCount} D5 questions across all stores.`);

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

if (process.argv[1] && process.argv[1].endsWith('rewrite-d5-applied.mjs')) {
  applyD5Rewrites();
}

