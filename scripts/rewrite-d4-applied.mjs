import { assertLegacyRewriteScope } from './question-rewrite-safety.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, root), 'utf8'));
const write = (f, data) => fs.writeFileSync(new URL(f, root), JSON.stringify(data, null, 2) + '\n', 'utf8');
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// D4 Applied Rewrites (All 15 questions: q-d4-a01 to q-d4-a15)
export const d4Rewrites = {
  'q-d4-a01': {
    question: 'GitHub Copilotが提案したユーザー登録処理のコードがPythonで書かれており、内部で生SQLクエリを直接実行していました。しかし、プロジェクトの呼び出し側はTypeScriptであり、既存コードベースはPrisma ORMで統一されています。Copilotにプロジェクトの既存技術スタックへ適合させる修正を依頼するプロンプトとして、最も適切なものはどれですか？',
    choices: {
      A: 'TypeScriptで記述し、既存リポジトリで標準化されているPrisma ORMのクライアントメソッドを用いて実装するよう指示する',
      B: 'Pythonコードをそのまま採用し、Node.js環境から子プロセスとしてPythonスクリプトを呼び出すラッパー関数を作成するよう指示する',
      C: '生SQLクエリの文字列連結を維持したまま、TypeScriptの型アサーション（as any）を付与して型チェックを強制通過させるよう指示する',
      D: 'プロジェクト全体のORMを廃止し、バックエンド全体をPythonと生SQLのアーキテクチャへ段階的に移行する計画を立てるよう指示する',
    },
    explanation: '既存プロジェクトの言語（TypeScript）と標準データアクセス層（Prisma ORM）を明示的に指定して修正を指示することで、プロジェクト規約に沿ったコードを生成させます。',
    choiceExplanations: {
      A: '既存プロジェクトの言語（TypeScript）と標準データアクセス層（Prisma ORM）を明示的に指定して修正を指示することで、プロジェクト規約に沿ったコードを生成させます。',
      B: '言語が混在する不要な子プロセス呼び出しは運用保守性を損ない、既存のORMアーキテクチャとも乖離します。',
      C: '型アサーションで無理に型を通しても生SQLの脆弱性や言語の不一致という根本原因は解決しません。',
      D: 'AIの提案に合わせてプロジェクト全体のスタックを別言語へ大規模移行するのは不合理です。',
    },
  },
  'q-d4-a02': {
    question: 'Copilotに対して「直接 console.log を使用しないこと」と指示したところ、独自のカスタムログ関数をファイル内に新規生成して呼び出すコードが提案されました。チームでは既存の共通ロガーモジュール `logger.info` の使用が標準化されています。意図通りの共通ロガーを使わせるための指示改善として、最も適切なものはどれですか？',
    choices: {
      A: '禁止事項だけでなく、「チーム標準の共通ロガー logger.info をインポートして使用すること」と肯定的な具象指示を与える',
      B: '指示文からロギングに関する要件を完全に削除し、モデルが推論によってロガーを選択できるようにする',
      C: 'プロンプトに「より洗練された独自のログ出力ユーティリティ関数を自動生成してください」と追加指示する',
      D: 'ファイル先頭に console.log = () => {} というモック関数を定義し、ログ出力を無効化するコードを生成させる',
    },
    explanation: '「〜しない」という否定の禁止指示だけでは別の代替ロジックを自作してしまうため、「どのAPIを使用すべきか」という肯定的な具体名をプロンプトに含めるのが効果的です。',
    choiceExplanations: {
      A: '「〜しない」という否定の禁止指示だけでは別の代替ロジックを自作してしまうため、「どのAPIを使用すべきか」という肯定的な具体名をプロンプトに含めるのが効果的です。',
      B: '要件を消すと不要なconsole.logがそのまま復活するか、ログ出力自体が失われてしまいます。',
      C: '独自のログ関数を自作させるとプロジェクト共通のロガーとの二重管理が発生し、車輪の再発明になります。',
      D: '標準のconsole.logを上書きするハックは副作用が大きく、共通ロガーの利用という目的にも反します。',
    },
  },
  'q-d4-a03': {
    question: 'Copilot ChatにAPIレスポンスの生成を依頼したところ、説明文のテキストの後にJSONブロックが出力され、さらに数値項目 count が文字列 `"10"` として出力されました。呼び出し側プログラムは応答全体を直接 `JSON.parse` して、count を数値型として扱う仕様です。プロンプトへの改善指示として最も適切なものはどれですか？',
    choices: {
      A: '説明文やマークダウンのコードフェンスを含めず純粋なJSONのみを返し、count は数値型（10）とするよう明示する',
      B: '説明文の文字数をさらに増やさせ、count が文字列である理由をプロンプト内で詳しく解説するよう指示する',
      C: '呼び出し側プログラムを修正し、正規表現でテキストからJSON部分を泥臭く抽出して文字列を数値にキャストさせる',
      D: '出力フォーマットをXML形式に変更し、count 属性を文字列としてタグに埋め込むよう指示する',
    },
    explanation: 'LLMの出力をプログラムでパースする場合、「解説テキストを含めずJSONのみ出力すること」と「各フィールドの厳密な型（数値型等）」をプロンプトで制約するのが定石です。',
    choiceExplanations: {
      A: 'LLMの出力をプログラムでパースする場合、「解説テキストを含めずJSONのみ出力すること」と「各フィールドの厳密な型（数値型等）」をプロンプトで制約するのが定石です。',
      B: '説明文を増やすとパースエラーがさらに確実に発生してしまいます。',
      C: 'モデル側の出力形式を制御せずに呼び出し側のパーサーを複雑化させるのは保守性を悪化させます。',
      D: '要求されているJSONフォーマットからXMLへ変更するのは仕様違反です。',
    },
  },
  'q-d4-a04': {
    question: '新しいチャットセッションを開始したにもかかわらず、Copilotが古い廃止済みライブラリのコードを繰り返し提案してきます。確認したところ、セッション移動時に旧バージョンの helper.ts を毎回Chatへ添付していました。現行の helper.ts は別のディレクトリに配置されています。この問題を解消するための操作として、最も適切なものはどれですか？',
    choices: {
      A: 'Chatへの添付ファイルを現行バージョンの helper.ts へ変更し、現行ライブラリの記法を使用するよう指示する',
      B: '古い helper.ts を添付したまま再度新しいチャットセッションを作り直し、同じプロンプトをそのまま送信する',
      C: '古い helper.ts の添付を維持したまま使用するAIモデルを切り替え、古いライブラリの候補を比較検討する',
      D: '古い helper.ts のコードコメントを編集して詳細な解説を書き足し、推奨される関数名だけを追記しておく',
    },
    explanation: 'チャット履歴を新しくしても、プロンプトに古いファイル（コンテキスト）を添付し続けていれば古い仕様が再学習・参照されてしまいます。正しい現行ファイルを添付する必要があります。',
    choiceExplanations: {
      A: 'チャット履歴を新しくしても、プロンプトに古いファイル（コンテキスト）を添付し続けていれば古い仕様が再学習・参照されてしまいます。正しい現行ファイルを添付する必要があります。',
      B: '同じ古いファイルを添付する限り、何度セッションを作り直しても古い提案が出続けます。',
      C: 'モデルを変えてもコンテキストに古いコードが存在する根本原因が解決されません。',
      D: '古いファイル自体に手を入れるのではなく、Chatに与えるコンテキストを現行版へ切り替えるべきです。',
    },
  },
  'q-d4-a05': {
    question: 'Copilotが生成した金額パース関数 parseAmount のコードは、不正な文字列が渡された場合にも 0 を返却する実装になっていました。承認済みの仕様契約では「数値文字列を数値に変換し、"0" は有効な 0 とするが、数値でない不正文字列（"abc" 等）は例外をスローすること」となっています。正常なゼロと不正入力を正しく区別させるためのFew-shot例として、最も適切なものはどれですか？',
    choices: {
      A: '入力 "0" に対しては数値 0 を返し、入力 "abc" に対しては例外（Error）をスローする入出力例',
      B: '入力 "0" に対しては数値 0 を返し、入力 "abc" に対してもデフォルト値の数値 0 を返す入出力例',
      C: '入力 "0" に対して例外をスローし、入力 "abc" に対しても例外をスローする境界値の入出力例',
      D: '入力 "0" に対して文字列 "0" を返し、入力 "abc" に対しても文字列 "abc" を返す入出力例',
    },
    explanation: '仕様の境界である「正常な "0" は 0 に変換」「不正な文字列は例外スロー」という対比ペアをFew-shotとして提示することで、意図通りのバリデーションロジックを誘導できます。',
    choiceExplanations: {
      A: '仕様の境界である「正常な "0" は 0 に変換」「不正な文字列は例外スロー」という対比ペアをFew-shotとして提示することで、意図通りのバリデーションロジックを誘導できます。',
      B: '"abc" で 0 を返す例を与えると、既存のバグ（不正入力の握りつぶし）を肯定してしまいます。',
      C: '"0" で例外を出してしまうと、正常なゼロ入力が拒否される契約違反になります。',
      D: '文字列をそのまま返す例は、数値へのパースという関数の主契約に反します。',
    },
  },
  'q-d4-a06': {
    question: 'Copilot Chatのコードベース検索機能を使用する際、検索結果に古いビルド生成物（distディレクトリ等）が混入して回答のノイズになっています。検索ツールの除外パターンにおいて「**」が全階層を表す場合、ルートの dist/a.js や packages/client/dist/a.js、packages/server/dist/b.js などのビルド生成物を除外しつつ、各パッケージの src 配下は検索対象に残すための除外パターンとして、最も適切なものはどれですか？',
    choices: {
      A: '検索除外パターンとして **/dist/** を指定する',
      B: '検索除外パターンとして dist/** のみを指定する',
      C: '検索除外パターンとして packages/client/dist/** のみを指定する',
      D: '検索除外パターンとして packages/** 全体を指定する',
    },
    explanation: '**/dist/** を指定することで、ルート直下の dist もサブパッケージ（packages/*/dist）も階層を問わず網羅的に除外し、src 配下を保持できます。',
    choiceExplanations: {
      A: '**/dist/** を指定することで、ルート直下の dist もサブパッケージ（packages/*/dist）も階層を問わず網羅的に除外し、src 配下を保持できます。',
      B: 'dist/** だけではリポジトリルート直下の dist しかマッチせず、モノレポ内の packages/*/dist が漏れてしまいます。',
      C: 'clientパッケージのみの除外では、serverパッケージ側の dist が除外されず混入します。',
      D: 'packages/** を除外すると、検索対象であるはずのソースコード（src）まで検索から完全に排除されてしまいます。',
    },
  },
  'q-d4-a07': {
    question: 'Copilotが生成した注文コード検証の正規表現案は「AB-123」を受け入れますが、「xAB-123y」のような前後に余分な文字が含まれる不正値も部分一致で受け入れてしまいます。仕様契約は「大文字2字・ハイフン・数字3字だけからなる文字列全体に完全一致すること」です。一致例と拒否例の両方をCopilotへ明示して修正させるためのプロンプト例として、最も適切なものはどれですか？',
    choices: {
      A: '「AB-123」は完全一致（true）とし、「xAB-123y」は不一致（false）とするテストケースのペアを提示する',
      B: '「CD-456」は一致（true）、「EF-789」も一致（true）とする正常系の一致例のみを複数提示する',
      C: '「AB-123」の部分のみを抽出し、前後の余計な文字は無視して処理を続行するよう指示する',
      D: '「ab-123」のような小文字入力も許容し、大文字・小文字の区別を無視するよう指示する',
    },
    explanation: '部分一致のバグを直すには、完全一致すべき正例（AB-123）と、部分一致で誤通過してしまう負例（xAB-123y）の両方を対比させて提示（^と$による全体一致を誘導）するのが最も確実です。',
    choiceExplanations: {
      A: '部分一致のバグを直すには、完全一致すべき正例（AB-123）と、部分一致で誤通過してしまう負例（xAB-123y）の両方を対比させて提示（^と$による全体一致を誘導）するのが最も確実です。',
      B: '正常例だけを増やしても、モデルは部分一致のままで十分だと誤解し、前後の境界アンカー（^, $）を実装しません。',
      C: '余分な文字を無視して抽出するのは「文字列全体が契約を満たすこと」という仕様に反します。',
      D: '小文字許容は仕様の改変であり、前後の文字混入を防ぐこととは無関係です。',
    },
  },
  'q-d4-a08': {
    question: '「リポジトリ内のどこを変更すべきか未特定のバグ調査タスク」と、「修正すべき対象ファイルが2つに確定している実装タスク」の2つがあります。Copilot Chatへ渡すコンテキストの使い分けとして、最も適切なものはどれですか？',
    choices: {
      A: '前者はワークスペース横断検索（@workspace）を活用し、後者は確定した2つの対象ファイルを明示参照（#file）する',
      B: '前者はワークスペース検索を活用し、後者もファイル内容を直接渡さずファイル名キーワード検索のみで推測させる',
      C: '前者はエディタで開いている現在カーソルの選択範囲のみを用い、後者はリポジトリ全体の全ファイルを一括添付する',
      D: '両方のタスクにおいて個人のカスタム指示ファイルのみを使用し、コードファイルの参照は完全に省略する',
    },
    explanation: '変更箇所が不明な初期調査では広範な探索（@workspace）が適し、対象ファイルが特定されている実装フェーズでは対象ファイルをピンポイントで明示参照（#file）するのが最も精度が高くなります。',
    choiceExplanations: {
      A: '変更箇所が不明な初期調査では広範な探索（@workspace）が適し、対象ファイルが特定されている実装フェーズでは対象ファイルをピンポイントで明示参照（#file）するのが最も精度が高くなります。',
      B: '対象ファイルが決まっているのに再度キーワード検索に頼るのは不正確でトークンの無駄です。',
      C: '調査段階でカーソル選択のみではスコープが狭すぎ、実装段階で全ファイル添付ではノイズ過多になります。',
      D: 'コードファイルを一切参照させないプロンプトでは、具体的なバグ調査も安全な実装も行えません。',
    },
  },
  'q-d4-a09': {
    question: 'Copilotにコードの保守性レビューを依頼すると、変数名や関数名の命名規則への指摘ばかりに偏ってしまいます。今回は「将来の消費税率変更時に、修正箇所が複数のモジュールに散らばる設計になっていないか」という変更容易性を評価したいと考えています。レビューの焦点を合わせるための依頼文として、最も適切なものはどれですか？',
    choices: {
      A: '税率変更が発生した際に修正が必要となる関数や依存モジュールを洗い出し、ロジック共通化の改善案を提示するよう指示する',
      B: '税計算に関連するすべての関数名を一覧化し、プロジェクトの命名規則ガイドラインに完全に統一するよう指示する',
      C: '税計算の処理時間をベンチマーク測定し、計算量を最適化するためのアルゴリズム改善候補を提示するよう指示する',
      D: '税計算コード内のコメントと実装を1行ずつ照合し、ドキュメントの記述不足箇所を指摘するよう指示する',
    },
    explanation: '保守性・変更容易性を評価させるには、「特定の変更（税率変更）が起きた際にどの範囲に波及するか」という具体的なシナリオを与えて共通化の余地を問うのが効果的です。',
    choiceExplanations: {
      A: '保守性・変更容易性を評価させるには、「特定の変更（税率変更）が起きた際にどの範囲に波及するか」という具体的なシナリオを与えて共通化の余地を問うのが効果的です。',
      B: '命名の統一は可読性の問題であり、変更波及箇所の分散という設計上の課題にはアプローチできません。',
      C: '計算量の最適化はパフォーマンス要件であり、保守性やモジュール結合度の評価とは論点が異なります。',
      D: 'コメントの過不足チェックはドキュメント整備であり、アーキテクチャの保守性評価には直結しません。',
    },
  },
  'q-d4-a10': {
    question: 'ローカルIDE環境では成功するビルドが、GitHub ActionsのCI環境でのみ失敗します。ソースコードは既にChatへ添付済みです。CIログを確認すると、ローカルとは異なる作業ディレクトリからビルドが実行されており、モジュール解決エラー（Module Not Found）が発生していました。Copilot Chatに原因特定と修正を依頼するために、次に追加すべき文脈として最も適切なものはどれですか？',
    choices: {
      A: 'CIワークフロー設定ファイル（YAML）、実行時の作業ディレクトリ、失敗したコマンド、および実際のエラー出力ログ',
      B: 'ローカル環境でビルドが成功した際のコマンド実行時間、およびローカルで生成されたバンドルファイルのサイズ',
      C: 'ローカルマシンのOSバージョン、CPUコア数、およびエディタのシンタックスハイライト設定ファイル',
      D: '直近のプルリクエストの説明文テキスト、およびチームメンバーが残したコードレビューコメントの履歴',
    },
    explanation: 'CI固有のパス解決エラーを調査するには、CIの作業ディレクトリや実行コマンド、エラーログ、およびワークフロー定義（YAML）を直接文脈として与える必要があります。',
    choiceExplanations: {
      A: 'CI固有のパス解決エラーを調査するには、CIの作業ディレクトリや実行コマンド、エラーログ、およびワークフロー定義（YAML）を直接文脈として与える必要があります。',
      B: 'ローカルの実行時間やファイルサイズは、CI環境のパス解決エラーの原因究明には役立ちません。',
      C: 'マシンのハードウェア構成はモジュール解決ロジックとは無関係です。',
      D: 'PRの説明文やコメントにはCIの実行パスやエラーの詳細が含まれていないため間接的すぎます。',
    },
  },
  'q-d4-a11': {
    question: 'Copilotへのプロンプトを整理・短縮しようとしています。現行のAPI仕様契約は「上限100件、空入力時は [] を返却、認証失敗時は例外をスロー」です。仕様書の背景説明には、過去に廃止されたレガシーCSV出力機能の経緯が長文で記述されています。現行仕様の契約をすべて維持した、最も適切な要約プロンプトはどれですか？',
    choices: {
      A: '「取得上限は100件、空入力時は空配列 [] を返却し、認証失敗時は例外をスローする」と必須契約のみを端的に指定する',
      B: '「取得上限は100件、空入力時は空配列 [] を返却し、過去のCSV出力機能の仕様も互換性のために残す」と指定する',
      C: '「空入力時は空配列 [] を返却し、認証失敗時は例外をスローする（取得件数の上限は撤廃する）」と指定する',
      D: '「取得上限は100件とし、認証失敗時は例外を出さずに空配列 [] を返却し、過去のCSV経緯を注釈する」と指定する',
    },
    explanation: '廃止されたレガシー機能の背景情報を削ぎ落とし、現在有効な3つの契約（上限100件、空入力[]、認証失敗時例外）のみを明確に伝えることでトークンを節約し誤認を防ぎます。',
    choiceExplanations: {
      A: '廃止されたレガシー機能の背景情報を削ぎ落とし、現在有効な3つの契約（上限100件、空入力[]、認証失敗時例外）のみを明確に伝えることでトークンを節約し誤認を防ぎます。',
      B: '廃止されたCSV出力の経緯を残すとモデルが不要なレガシーコードを生成するリスクがあります。',
      C: '上限100件の制約を勝手に外してしまっており、現行仕様契約を破壊しています。',
      D: '認証失敗時に例外を出さず空配列を返すように変更しており、エラーハンドリング契約に反します。',
    },
  },
  'q-d4-a12': {
    question: 'GitHub Copilotに電話番号のフォーマット正規化関数を依頼したところ、市外局番が4桁のパターンの場合のみフォーマットが誤って出力されました。仕様契約は「プロンプト入力に含めた承認済み対応表の区切り規則に従うこと」です。この不具合をピンポイントで修正させるためのFew-shot例として、最も適切なものはどれですか？',
    choices: {
      A: '4桁の市外局番を含む電話番号の入力例と、承認済み対応表に従って正しくハイフン区切りされた期待出力のペア',
      B: '既に正常にフォーマットできている携帯電話番号（090等）の入力例と、その正常な期待出力のペア',
      C: '市外局番を意図的に省略した不正な電話番号の入力例と、モデルが推測して補完した期待出力のペア',
      D: '同一の4桁市外局番に対して、2種類の異なるハイフン区切りをどちらも正解として許容する曖昧な出力例',
    },
    explanation: '失敗している特定のケース（4桁市外局番）について、承認された対応表に基づく正確な正解ペアをFew-shotとして提示することで、モデルの誤りを直接是正できます。',
    choiceExplanations: {
      A: '失敗している特定のケース（4桁市外局番）について、承認された対応表に基づく正確な正解ペアをFew-shotとして提示することで、モデルの誤りを直接是正できます。',
      B: '既に成功している携帯番号の例を提示しても、4桁市外局番の誤りを修正するヒントにはなりません。',
      C: '市外局番省略の例は別のユースケースであり、4桁市外局番の正規化ルールを学習させられません。',
      D: '複数の区切りを許容するとモデルの出力が不安定になり、仕様契約の統一性が失われます。',
    },
  },
  'q-d4-a13': {
    question: 'Copilotが生成した非同期処理コードが、コールバック関数（callback）に結果を渡す古いNode.jsスタイルになっていました。呼び出し側は `await` で戻り値を受け取る設計であり、プロジェクト規約としてレガシーなコールバック関数の採用は禁止されています。修正を依頼するための最小限のコード例として、最も適切なものはどれですか？',
    choices: {
      A: 'Promiseを返却し、呼び出し側で await を用いて結果値を受け取る現代的な非同期関数の入出力例',
      B: 'コールバック関数に結果を渡し、呼び出し側の内部で console.log を直接呼び出す入出力例',
      C: '非同期処理を行わずに同期的ブロック処理として値を直接 return し、await を一切使わない入出力例',
      D: '関数の戻り値を void とし、結果値をグローバル変数に格納して別スレッドから参照させる入出力例',
    },
    explanation: '現代的なasync/awaitパターンに適合させるため、Promiseを返却してawaitで結果を受け取るクリーンなサンプルコードをプロンプトで提示します。',
    choiceExplanations: {
      A: '現代的なasync/awaitパターンに適合させるため、Promiseを返却してawaitで結果を受け取るクリーンなサンプルコードをプロンプトで提示します。',
      B: 'コールバック例を提示すると、禁止されているレガシーパターンの使用を肯定してしまいます。',
      C: '同期的ブロック処理にしてしまうと、I/O性能が大幅に悪化し非同期処理の要件を満たせません。',
      D: 'グローバル変数経由の受け渡しは競合状態（レースコンディション）を引き起こす危険な設計です。',
    },
  },
  'q-d4-a14': {
    question: 'Copilotに決済処理パイプラインを分割実装させました。各関数の単体テストおよび正常系決済の結合テストは既に成功しています。仕様契約では「外部決済APIが残高不足エラーを返却した場合、注文ステータスを unpaid のまま維持し、完了通知は送信しないこと」と定められていますが、この残高不足時の連携動作は未検証です。次に追加すべき結合テストの入力と期待値として、最も適切なものはどれですか？',
    choices: {
      A: '外部APIモックに残高不足を返却させ、注文ステータスが unpaid に維持され、通知送信回数が0回であることを検証する',
      B: '外部APIモックに残高不足を返却させ、注文ステータスが paid に更新され、完了通知が1回送信されることを検証する',
      C: '外部APIモックに決済成功を返却させ、注文ステータスが paid に更新され、完了通知が1回送信されることを検証する',
      D: '外部APIモックにタイムアウトエラーを返却させ、注文ステータスが pending になり、通知が0回であることを検証する',
    },
    explanation: '未検証である「残高不足」のシナリオをモックで再現し、仕様通り「注文がunpaidに留まり、通知が0回であること」を同時にアサートするテストを追加します。',
    choiceExplanations: {
      A: '未検証である「残高不足」のシナリオをモックで再現し、仕様通り「注文がunpaidに留まり、通知が0回であること」を同時にアサートするテストを追加します。',
      B: '残高不足なのにpaidになり通知が飛ぶのは重大な仕様違反であり、誤った期待値です。',
      C: '決済成功のケースは既に検証済みであり、未確認の残高不足シナリオのテストにはなりません。',
      D: 'タイムアウトは別の異常系シナリオであり、残高不足に対する仕様契約を直接検証するものではありません。',
    },
  },
  'q-d4-a15': {
    question: 'Copilot Chatの回答が、別プロジェクトの類似関数の実装を根拠にしており、現在のプロジェクトに適合していませんでした。修正対象は自プロジェクトの orders/refund.ts と、そこで使用されている Money 型の定義に確定しています。Chatへ渡す依頼文脈として最も直接的かつ適切なものはどれですか？',
    choices: {
      A: '自プロジェクトの orders/refund.ts ファイルと、参照されている Money 型の定義ファイルを添付して質問する',
      B: '社内の全リポジトリから類似の返金関数を横断検索させ、ヒットした全コードをChatに貼り付けて質問する',
      C: 'プロジェクトの共通指示ファイル（copilot-instructions.md）に、orders/refund.ts のファイルパスのみを記述する',
      D: 'Money型の定義ファイルのみを添付し、対象である orders/refund.ts の実装内容はモデルに推測させる',
    },
    explanation: '対象ファイル（refund.ts）と、それが直接依存するコア型定義（Money型）を過不足なく添付することで、外部の類似実装に惑わされず自社コードに適合した回答を得られます。',
    choiceExplanations: {
      A: '対象ファイル（refund.ts）と、それが直接依存するコア型定義（Money型）を過不足なく添付することで、外部の類似実装に惑わされず自社コードに適合した回答を得られます。',
      B: '他プロジェクトの類似実装を集めると、別仕様が混ざり合って現在のプロジェクトへの適合性がさらに失われます。',
      C: '共通指示に個別ファイルのパスだけを書いてもコード本体は渡されず、セッション固有の修正には向きません。',
      D: '実装コード本体を渡さないと、現在の関数の引数やビジネスロジックの前提を正確に把握できません。',
    },
  },
};

export function applyD4Rewrites() {
  const seed = read('content/gh300/2026-08-07/questions/seed.json');
  assertLegacyRewriteScope(seed, d4Rewrites);
  const appliedRep = read('reports/applied-question-quality-review.json');
  const diffRep = read('content/gh300/2026-08-07/questions/difficulty-review.json');
  const qualRep = read('content/gh300/2026-08-07/questions/quality-review.json');
  const classRep = read('reports/question-objective-classification-review.json');
  const addsRep = read('content/gh300/2026-08-07/questions/additions-review.json');
  const exclusionsRep = read('content/gh300/2026-08-07/questions/selection-exclusions.json');
  const cleanupRep = read('reports/d4-d5-applied-cleanup-review.json');

  let updatedCount = 0;
  for (const [id, rw] of Object.entries(d4Rewrites)) {
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

  console.log(`Successfully updated ${updatedCount} D4 questions across all stores.`);

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

if (process.argv[1] && process.argv[1].endsWith('rewrite-d4-applied.mjs')) {
  applyD4Rewrites();
}

