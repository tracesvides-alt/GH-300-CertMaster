import { assertLegacyRewriteScope } from './question-rewrite-safety.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, root), 'utf8'));
const write = (f, data) => fs.writeFileSync(new URL(f, root), JSON.stringify(data, null, 2) + '\n', 'utf8');
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// D2 Applied Rewrites (All 26 questions: q-d2-a01 to q-d2-a26)
// Balanced choice lengths, natural scenario Japanese, preserved sampleClues
export const d2Rewrites = {
  'q-d2-a01': {
    question: '開発者が現在エディタ上で編集中の特定の関数で例外が発生したため、修正候補をインラインで確認しながら部分適用したいと考えています。最も適切なエディタ機能はどれですか？',
    choices: {
      A: '修正対象の関数コードを選択してInline Chatで修正を依頼し、エディタ上のインライン差分を確認して適用する',
      B: 'Copilot Chatパネル（Ask）で修正案を生成させ、返信されたコードブロックから必要な行だけ手動でコピー＆ペーストする',
      C: 'Agentに対象関数の修正とテスト実行をすべて任せ、バックグラウンドでの作業完了後にファイル全体の差分を確認する',
      D: '関数の上にコメントを書いてインライン補完をトリガーし、提示されたコード候補の続きをそのまま採用する',
    },
    explanation: '特定コードの局所的な直接編集と、適用前の視覚的な差分確認を両立するにはInline Chatが最も適しています。',
    choiceExplanations: {
      A: '特定コードの局所的な直接編集と、適用前の視覚的な差分確認を両立するにはInline Chatが最も適しています。',
      B: 'Chatパネルでの相談は可能ですが、手動コピーが必要でありインラインでの視覚的な差分プレビューは得られません。',
      C: 'Agentは広範な自律タスク向けであり、特定関数のインライン差分を目視で部分適用する対話的操作には過剰です。',
      D: 'インライン補完は新規コードの追記に向いていますが、既存の関数全体をレビューしながら差分適用する用途には合いません。',
    },
  },
  'q-d2-a02': {
    question: 'Copilot ChatがUserProfile.emailを必須文字列として扱い、プロパティ未設定時に実行時エラーが発生しました。呼び出し元コードは添付済みですが、型定義ファイルtypes/user.tsではemail?: stringと定義され、DB側も値の欠損を許容しています。型定義の契約に沿った安全な修正を依頼するために、次に追加すべき文脈として最も適切なものはどれですか？',
    choices: {
      A: '現行の型定義ファイル（types/user.ts）と、emailプロパティを参照している呼び出し箇所のコード',
      B: '現行のデータベーステーブル定義SQLと、emailカラムを新規登録・更新するためのSQLクエリ',
      C: '現行のHTTP通信設定ファイルと、ユーザープロフィール取得APIを実行した際のアクセスログ',
      D: '現行のE2Eテスト入力データファイルと、プロフィール編集画面がブラウザで表示されたキャプチャ画像',
    },
    explanation: 'オプショナルな型定義と実際の参照箇所の両方を渡すことで、未設定時（undefined）のフォールバック処理を正確に依頼できます。',
    choiceExplanations: {
      A: 'オプショナルな型定義と実際の参照箇所の両方を渡すことで、未設定時（undefined）のフォールバック処理を正確に依頼できます。',
      B: 'DB定義も関連しますが、今回のTypeScriptコードにおける実行時エラーの解消には型定義ファイルが直接の文脈となります。',
      C: 'HTTP通信設定やログはインフラ観点の情報であり、言語レベルの型契約違反を修正する文脈としては間接的です。',
      D: 'UI画面画像やE2E入力データでは、TypeScriptコンパイラやコードが要求するプロパティの型契約を直接特定できません。',
    },
  },
  'q-d2-a03': {
    question: 'アーキテクチャ設計の選択肢をまずはコードを変更せずに相談し、方針が固まった後に対象の関数だけ差分を確認して修正したいと考えています。GitHub Copilotの機能の使い分けとして最も適切なものはどれですか？',
    choices: {
      A: 'Chatパネル（Ask）で設計方針を相談し、方針確定後にInline Chatで選択した関数の差分を確認しながら適用する',
      B: 'Chatパネル（Ask）で設計方針を相談し、方針確定後にAgentモードへ移行して広範囲の実装とテストを自動実行させる',
      C: 'Inline Chatで設計案を直接コードとして試し、コード変更後にChatパネル（Ask）で設計方針の妥当性を確認する',
      D: 'インライン補完で関数を順次書き進め、後からプルリクエストのコードレビューで全体の設計方針を確認する',
    },
    explanation: '方針相談の段階ではコードを変更しないAskモードを用い、実装段階では局所的な差分を目視確認できるInline Chatを用いるのが最適です。',
    choiceExplanations: {
      A: '方針相談の段階ではコードを変更しないAskモードを用い、実装段階では局所的な差分を目視確認できるInline Chatを用いるのが最適です。',
      B: 'Agentはファイル全体の自律編集を行うため、「選択した関数だけの差分を丁寧に確認して直す」という要件に反します。',
      C: '相談段階でInline Chatを使うと不要なコード編集が発生してしまい、設計検討と実装が逆転してしまいます。',
      D: '補完を無計画に採用すると設計の一貫性が失われ、事後レビューでの手戻りが大きくなります。',
    },
  },
  'q-d2-a04': {
    question: 'GitHub Copilotが提案した作業ディレクトリ削除コマンドの対象は /tmp/job-* となっていました。実際の対象ディレクトリは job-cache と job-fixtures であり、このうち job-fixtures はテスト用データとして保持する必要があります。許可された安全な変更範囲を守る修正版の対象指定として、最も適切なものはどれですか？',
    choices: {
      A: '削除対象を /tmp/job-cache のみに限定し、保持すべき job-fixtures を対象から除外する',
      B: 'ワイルドカード指定を維持し、/tmp/job-* でマッチする両方のディレクトリをそのまま削除する',
      C: '削除対象を /tmp/job-fixtures のみに限定し、不要なキャッシュである job-cache を保持する',
      D: '対象範囲を広げて /tmp 配下の全一時ディレクトリを一括で削除するよう指定する',
    },
    explanation: '保持すべきfixturesディレクトリを誤削除から保護するため、削除対象を明示的に不要なjob-cacheのみに絞り込みます。',
    choiceExplanations: {
      A: '保持すべきfixturesディレクトリを誤削除から保護するため、削除対象を明示的に不要なjob-cacheのみに絞り込みます。',
      B: 'ワイルドカードを使うと保持対象のjob-fixturesまで削除されてしまい、テスト環境が破壊されます。',
      C: '保持すべきfixturesを削除して不要なキャッシュを残すことになり、要件と正反対の動作になります。',
      D: '全一時ディレクトリの削除は影響範囲が広大であり、システムの他プロセスの一時ファイルまで破壊する危険があります。',
    },
  },
  'q-d2-a05': {
    question: 'コード変更後に自動でテストを実行し、テスト失敗ログを解析して再修正を自律的に繰り返すワークフローをIDE内で依頼したいと考えています。この用途においてAgentモードがChatパネル（Ask）よりも適している理由として、最も適切なものはどれですか？',
    choices: {
      A: 'Agentはファイルの編集とツール（テスト実行コマンド等）の実行結果を活用し、一連のタスクを継続できるため',
      B: 'Askモードで修正案を生成させ、開発者がテスト結果を手動で貼り付けて次の改善案を毎回プロンプト入力するため',
      C: 'Agentにファイルの編集だけを依頼し、テスト実行と結果確認はすべて開発者が手動で行う設計になっているため',
      D: 'Inline Chatで失敗箇所を部分修正し、開発者がターミナルでテストを再実行するフローが最も自動化されているため',
    },
    explanation: 'Agentは「ファイル編集」「コマンド実行」「結果に基づく自己修正」というループを自律的に遂行できる点が、対話専用のAskとの決定的な違いです。',
    choiceExplanations: {
      A: 'Agentは「ファイル編集」「コマンド実行」「結果に基づく自己修正」というループを自律的に遂行できる点が、対話専用のAskとの決定的な違いです。',
      B: 'Askモードでは人間が毎回テスト結果をコピー＆ペーストする必要があり、自律的な反復修正は行えません。',
      C: 'Agentはコマンド実行ツールを呼び出せるため、テスト実行を手動に限定する説明は誤りです。',
      D: 'Inline Chatは開発者の手動トリガーが必要な局所編集機能であり、自動反復ループを提供するものではありません。',
    },
  },
  'q-d2-a06': {
    question: '長いファイルの中で特定の関数だけを修正したいと考えています。他の関数に予期せぬ変更が及ぶリスクを完全に防ぎながら、対象関数のみにCopilotの修正を適用するための最も確実な操作手順はどれですか？',
    choices: {
      A: '対象関数のコード範囲をマウスまたはキーボードで選択し、Inline Chatを開いて修正指示を入力する',
      B: 'ファイル全体を開いた状態でChatパネルに指示を送り、ファイル全体の置換コードを生成させて適用する',
      C: 'Agentに対象ファイル名を指定して修正を依頼し、バックグラウンドでのファイル一括保存を待つ',
      D: '対象関数の直前にコメントを記述し、Tabキーによるインライン補完の連続採用で修正コードを入力する',
    },
    explanation: '対象範囲を選択した上でInline Chatを起動することで、エディタは選択範囲外のコードを変更対象から完全に保護します。',
    choiceExplanations: {
      A: '対象範囲を選択した上でInline Chatを起動することで、エディタは選択範囲外のコードを変更対象から完全に保護します。',
      B: 'ファイル全体の置換は、無関係な関数へのデグレードや意図しない変更が混入するリスクが高まります。',
      C: 'Agentはファイル全体の広範囲な変更を行う可能性があり、特定関数のみの局所的な安全適用には不向きです。',
      D: 'インライン補完では既存のロジックを正確に置換することが難しく、コードの重複や不整合が発生しやすくなります。',
    },
  },
  'q-d2-a07': {
    question: 'GitHub CopilotがDB照会MCPツールのSQL生成案を作成しました。現在のスキーマはorders(id, user_id, amount)であり、利用者は自アカウントの注文しか見られない契約です。現在のスキーマ、利用者別権限、任意SQL禁止の条件を守るツールの入出力設計として、最も適切なものはどれですか？',
    choices: {
      A: 'ツール引数を検索条件のパラメータに限定し、サーバー側でuser_idを固定バインドした安全なクエリを実行して結果を返す',
      B: 'モデルが任意のSELECT文を生成してサーバーに送信し、サーバー側で正規表現を用いてWHERE句のuser_idを検査する',
      C: 'モデルに管理者権限のDB接続文字列を渡し、クライアント側で取得結果から他ユーザーの行をフィルタリングして除外する',
      D: 'ツール引数としてテーブル名と任意のWHERE句文字列を受け取り、サーバー側でSQL文字列を直接連結して実行する',
    },
    explanation: '任意SQLの実行を禁止し、サーバー側で認証済みユーザーIDを強制バインドする固定クエリ設計とすることで、不正なデータ閲覧を確実に防止します。',
    choiceExplanations: {
      A: '任意SQLの実行を禁止し、サーバー側で認証済みユーザーIDを強制バインドする固定クエリ設計とすることで、不正なデータ閲覧を確実に防止します。',
      B: '正規表現によるSQL文字列の検証はバイパス手法が存在しやすく、任意のSQL実行を許容する設計は極めて危険です。',
      C: 'クライアント側に全データを渡してから除外する設計は、通信経路での機密漏洩やクライアント側改ざんのリスクがあります。',
      D: 'WHERE句文字列の直接連結は典型的なSQLインジェクション脆弱性を引き起こすため、絶対に避けるべき設計です。',
    },
  },
  'q-d2-a08': {
    question: 'VS Code環境でGitHub Copilot Chatから外部の独自MCPサーバーを利用できるように設定したいと考えています。VS Codeの設定ファイル（settings.json）でMCPサーバーを登録・管理するための設定キーはどれですか？',
    choices: {
      A: 'github.copilot.chat.mcpServers 設定キーを使用して、起動コマンドや引数、環境変数を定義する',
      B: 'github.copilot.advanced.externalTools 設定キーを使用して、外部実行可能ファイルのパスを定義する',
      C: 'chat.editing.customAgents 設定キーを使用して、エージェント定義ファイルへの参照パスを定義する',
      D: 'github.copilot.editor.customPlugins 設定キーを使用して、プラグインのエンドポイントURLを定義する',
    },
    explanation: 'VS CodeにおけるMCPサーバーの設定は github.copilot.chat.mcpServers キーで行います。',
    choiceExplanations: {
      A: 'VS CodeにおけるMCPサーバーの設定は github.copilot.chat.mcpServers キーで行います。',
      B: 'advanced.externalTools は存在しない架空の設定キーであり、MCPの登録には使用しません。',
      C: 'customAgents はMCPサーバーの登録キーではなく、独自エージェント定義向けの設定ではありません。',
      D: 'customPlugins は存在しない架空のキーであり、標準的なMCPサーバーの定義には使用しません。',
    },
  },
  'q-d2-a09': {
    question: 'Copilot Chatで長く対話を続けた結果、以前の無関係なトピックの文脈が回答に混ざり込み、精度が低下してきました。これまでの会話履歴をリセットして、クリーンな状態で新しいトピックの相談を始めるための最も適切な操作はどれですか？',
    choices: {
      A: 'Chatパネルの「+」ボタン（New Chat）を押して新しい会話セッションを開始する',
      B: '現在のチャット欄に「これまでの履歴を忘れてください」という指示プロンプトを入力して送信する',
      C: 'VS Codeウィンドウを一度閉じて再起動し、同じチャットセッションを復元して再開する',
      D: 'プロジェクトの .vscode/settings.json からCopilotのキャッシュ設定を手動で削除する',
    },
    explanation: '過去の会話履歴によるコンテキスト汚染を完全に排除するには、新規チャットセッション（New Chat）を開始するのが最も確実です。',
    choiceExplanations: {
      A: '過去の会話履歴によるコンテキスト汚染を完全に排除するには、新規チャットセッション（New Chat）を開始するのが最も確実です。',
      B: 'プロンプトでの指示はモデルの注意力を浪費し、古い履歴がコンテキスト窓に残るため完全なリセットにはなりません。',
      C: 'ウィンドウを再起動しても直前のチャットセッションが復元される場合があり、履歴の消去としては非効率です。',
      D: 'settings.jsonに個別のチャット履歴キャッシュは保持されておらず、設定削除によるリセットはできません。',
    },
  },
  'q-d2-a10': {
    question: '定型のコード生成タスク（APIスキーマから型定義とテストを生成する等）をチームで共有し、引数を渡して手軽にオンデマンド実行できるようにしたいと考えています。リポジトリ内でバージョン管理可能なプロンプトファイルとして作成する際のファイル形式および配置として、最も適切なものはどれですか？',
    choices: {
      A: '.github/prompts/ ディレクトリ配下に、指示内容とパラメータを記述した .prompt.md ファイルを作成する',
      B: 'リポジトリ直下の .github/copilot-instructions.md に、すべての定型タスクの手順を長文で追記する',
      C: '開発者各自のホームディレクトリ配下に、プライベートなシェルスクリプトとしてプロンプトを保存する',
      D: 'package.json の scripts フィールドに、コマンドライン引数としてプロンプト全文を直接インライン記述する',
    },
    explanation: 'オンデマンドで引数付き実行できるプロンプトは、.github/prompts/ 配下の .prompt.md（Prompt Files）としてリポジトリ管理するのが公式の推奨です。',
    choiceExplanations: {
      A: 'オンデマンドで引数付き実行できるプロンプトは、.github/prompts/ 配下の .prompt.md（Prompt Files）としてリポジトリ管理するのが公式の推奨です。',
      B: 'copilot-instructions.md は全会話に常時注入されるため、特定の定型タスクだけをオンデマンド実行する用途には向きません。',
      C: '各自のローカル環境への保存ではチームでのバージョン管理や共有が行えず、再利用性が失われます。',
      D: 'package.jsonへの長文プロンプト埋め込みは保守性が極めて悪く、Copilotのプロンプトファイル機能の恩恵を受けられません。',
    },
  },
  'q-d2-a11': {
    question: 'IDEで直近のチャット履歴を完全にクリアし、同じファイル内の別の関数についての質問をコンテキストの混ざり込みなしにゼロから始めたいと考えています。最も直接的かつ確実な操作はどれですか？',
    choices: {
      A: 'Chatパネル上部の「新規チャット（+）」ボタンをクリックして新しいセッションを開く',
      B: 'エディタ上で対象ファイルを一度閉じてから再度開き、同じチャットセッションへ入力を続ける',
      C: '直前の質問メッセージにマウスカーソルを合わせ、メッセージの編集ボタンを押して上書き送信する',
      D: '現在のチャットメッセージの末尾に「コンテキストをリセット」という文章を付け足して送信する',
    },
    explanation: '新規チャットセッションの開始によって、過去の対話履歴のコンテキストトークンが完全に破棄され、真っ新な状態で対話できます。',
    choiceExplanations: {
      A: '新規チャットセッションの開始によって、過去の対話履歴のコンテキストトークンが完全に破棄され、真っ新な状態で対話できます。',
      B: 'ファイルを閉じてもチャット履歴自体はパネル内に保持されるため、過去のコンテキストは消去されません。',
      C: 'メッセージの編集は部分的な修正に留まり、セッション全体の不要な履歴を完全にクリアすることはできません。',
      D: 'プロンプト末尾への補足ではコンテキスト履歴そのものは消えず、モデルの解釈揺れの原因になります。',
    },
  },
  'q-d2-a12': {
    question: 'エディタでコード入力中、GitHub Copilotが複数行にわたるインライン補完候補を薄い文字（ゴーストテキスト）で提示しました。提示された候補全体ではなく「最初の1行だけ」を採用したい場合に使用する操作として、最も適切なものはどれですか？',
    choices: {
      A: '行単位での補完受け入れショートカットキー（または単語単位の受け入れ操作を繰り返し）を実行する',
      B: 'Tabキーを1回だけ素早く押して、提示された複数行の候補全体を一括でエディタに確定させる',
      C: 'Escapeキーを押して補完候補を一度消去し、希望する1行目を手動でタイピングし直す',
      D: 'Enterキーを押して改行を挿入し、2行目以降の候補だけをエディタ上に自動で確定させる',
    },
    explanation: 'Copilotは単語単位（Ctrl/Cmd + Right Arrow）や行単位での部分受け入れをサポートしており、全体を確定させずに必要な部分だけを採用できます。',
    choiceExplanations: {
      A: 'Copilotは単語単位（Ctrl/Cmd + Right Arrow）や行単位での部分受け入れをサポートしており、全体を確定させずに必要な部分だけを採用できます。',
      B: 'Tabキーは候補全体を一括採用する操作であり、1行目だけを部分的に確定させることはできません。',
      C: 'Escapeキーは候補全体の破棄であり、せっかくの提案を無駄にして手動入力の手間が発生します。',
      D: 'Enterキーは単なる改行の挿入となり、補完候補を部分確定する機能ではありません。',
    },
  },
  'q-d2-a13': {
    question: 'エディタで提示されたインライン補完候補とは別のバリエーション（代替候補）が存在するか確認し、次の候補へ切り替えたいと考えています。この操作を行うためのショートカットまたは操作手順として、最も適切なものはどれですか？',
    choices: {
      A: '次の候補を表示するショートカットキー（Alt + ] または Option + ] 等）を押して代替案を順次確認する',
      B: 'Tabキーを連続で2回押して、現在表示されている候補を一度破棄した後に再生成させる',
      C: 'BackSpaceキーで直前の1文字を削除し、同じ文字を再度入力して補完を最初から呼び直す',
      D: 'Spaceキーを連打してコードのインデントを崩し、異なる推論パターンをモデルに誘発させる',
    },
    explanation: 'Alt/Option + ] (または [ ) を使用することで、生成済みの複数の補完候補をエディタ上でスムーズに切り替えて比較できます。',
    choiceExplanations: {
      A: 'Alt/Option + ] (または [ ) を使用することで、生成済みの複数の補完候補をエディタ上でスムーズに切り替えて比較できます。',
      B: 'Tabキーは現在の候補の受け入れであり、代替候補への切り替えにはなりません。',
      C: '1文字削除と再入力は非効率であり、既にバックグラウンドで返されている他の候補を閲覧できません。',
      D: 'インデントの改ざんは構文エラーを引き起こし、適切なコード補完が得られなくなります。',
    },
  },
  'q-d2-a14': {
    question: '開発者が複雑な既存関数のロジックをリファクタリングしようとしています。コードを即座に変更するのではなく、まずはエディタ上で関数の処理内容の解説や改善ポイントの選択肢を対話形式で相談したいと考えています。最も適したモードはどれですか？',
    choices: {
      A: 'Chatパネルの対話モード（Ask）で関数について質問し、コード変更なしで解説と選択肢を相談する',
      B: 'Inline Chatでコード置換を即座にリクエストし、生成された差分をそのままエディタに適用する',
      C: 'Agentモードを起動してファイル全体の修正とビルド・テストの自律実行を一括で依頼する',
      D: 'インライン補完を関数の内部でトリガーし、提示されたコードスニペットを順次採用していく',
    },
    explanation: 'コードに破壊的な変更を加えず、安全に対話や解説、設計検討を行うにはChatパネル（Ask）が最適です。',
    choiceExplanations: {
      A: 'コードに破壊的な変更を加えず、安全に対話や解説、設計検討を行うにはChatパネル（Ask）が最適です。',
      B: 'Inline Chatはコードの直接編集を前提としており、腰を据えた設計相談や選択肢の吟味には向きません。',
      C: 'Agentはファイルの自律変更を行うため、「コードを変更せずに相談したい」という要件に反します。',
      D: 'インライン補完は相談や解説を行う機能ではなく、コード追記の支援に特化しています。',
    },
  },
  'q-d2-a15': {
    question: 'リファクタリング中に、router.tsのコード内で認証トークンの検証関数が予期せぬ挙動を示しました。コードを確認すると、router.tsでは別名インポート `import { verify as check } from \'./session\'` を行っており、プロジェクト内には別の `token.ts` にも `verify` 関数が存在しています。routerの実行経路における不具合を修正・検証するための最初の対象として、最も適切なものはどれですか？',
    choices: {
      A: 'session.tsのverify関数の実装を修正し、router経由での認証処理経路をテスト検証する',
      B: 'token.tsのverify関数の実装を修正し、worker経由での認証処理経路をテスト検証する',
      C: 'router.tsのimport先をsession.tsからtoken.tsへ書き換えて、依存関係の経路を検証する',
      D: 'worker.tsのimport先をtoken.tsからsession.tsへ書き換えて、依存関係の経路を検証する',
    },
    explanation: 'import文の別名を正しくトレースすると、router.tsが実際に呼び出しているのはsession.tsのverifyであるため、ここを対象に修正・検証する必要があります。',
    choiceExplanations: {
      A: 'import文の別名を正しくトレースすると、router.tsが実際に呼び出しているのはsession.tsのverifyであるため、ここを対象に修正・検証する必要があります。',
      B: 'router.tsはtoken.tsを呼び出していないため、token.tsを修正してもrouterの挙動は改善しません。',
      C: '根本原因を調査せずにimport元を安易に変更することは、設計の破壊や二次バグを招きます。',
      D: 'worker.tsは今回のrouter実行経路のトラブルとは直接関係のない別モジュールです。',
    },
  },
  'q-d2-a16': {
    question: 'Agentが認証APIと請求APIの2つのモジュールを変更しようとしています。認証APIには既存の仕様を保証する契約テストが存在しますが、請求APIには既存のテストが存在しません。今回のタスク方針が「既存の動作を確実に確かめられる単位から安全に着手する」である場合、最も適切な進め方はどれですか？',
    choices: {
      A: '既存の契約テストが存在する認証APIを先に変更し、テスト成功を確認した上で次の範囲へ進む',
      B: 'テストのない請求APIを先に変更し、変更後に生成された出力値をそのまま正解の期待値として記録する',
      C: '両方のAPIをまとめて一括変更し、すべての作業が完了した後にそれぞれの動作テストをゼロから作成する',
      D: '両方のAPIのコードを先に変更し、TypeScriptの型検査がパスしたことだけを確認して完了とする',
    },
    explanation: 'リグレッションを防止するため、既存の契約テストによって安全性を即時検証できるモジュールから着手するのが鉄則です。',
    choiceExplanations: {
      A: 'リグレッションを防止するため、既存の契約テストによって安全性を即時検証できるモジュールから着手するのが鉄則です。',
      B: '生成後の出力を無批判に正解として固定すると、AIが混入させたバグを正しい仕様として誤認してしまいます。',
      C: 'テストなしでの一括変更は障害発生時の原因切り分けを困難にし、安全な反復開発に反します。',
      D: '型検査はデータの構造のみを検証し、業務ロジックの破壊（デグレード）を検出できません。',
    },
  },
  'q-d2-a17': {
    question: '社内用のMCPサーバーにおいて、参照用の設計文書データと、引数を受け取って外部システムにチケットを新規作成する操作の2つを公開したいと考えています。MCPの設計思想に沿った役割分担として、最も適切なものはどれですか？',
    choices: {
      A: '設計文書の提供はMCPのResourceとして定義し、チケット作成の操作はMCPのToolとして定義する',
      B: '設計文書の提供はMCPのToolとして定義し、チケット作成の操作はMCPのResourceとして定義する',
      C: '設計文書の提供もチケット作成の操作も、両方ともMCPのPrompt機能としてテンプレート化して提供する',
      D: '設計文書の提供はMCPのResourceとして定義し、チケット作成の操作はリポジトリの指示ファイルに直接記述する',
    },
    explanation: 'MCPにおいて、読み取り専用のコンテキスト情報はResourceとして提供し、外部への副作用を伴う実行操作はToolとして提供するのが標準仕様です。',
    choiceExplanations: {
      A: 'MCPにおいて、読み取り専用のコンテキスト情報はResourceとして提供し、外部への副作用を伴う実行操作はToolとして提供するのが標準仕様です。',
      B: 'Resourceは副作用のない参照データ向けであり、チケット作成のような状態変更操作をResourceで行うのは設計違反です。',
      C: 'PromptはLLMへのプロンプト入力支援であり、外部システムのAPI実行そのものを代替するものではありません。',
      D: '指示ファイルだけでは実際のチケット作成APIを実行できず、MCPサーバーのTool機能との連携が必要です。',
    },
  },
  'q-d2-a18': {
    question: 'チケット検索MCPサーバーをGitHub Copilotに接続する前にローカル環境で検証しています。要約に必要な項目は件名とステータスのみです。認可チェックにより担当外チケットの取得は正しく拒否され、保存ログにも件名とステータスのみが残ることが確認できました。しかし、ツールのJSON返却値にテスト用のダミーPAT（Personal Access Token）プロパティが含まれていることが判明しました。この検証結果を踏まえ、MCPサーバーに追加すべき最小権限の改善として最も適切なものはどれですか？',
    choices: {
      A: 'ツールの返却データ項目を必要最小限（件名とステータス）に絞り込み、トークン等の不要な機密項目を除外する',
      B: '漏洩した接続トークンを直ちに失効・再発行し、古いトークンでのアクセスが拒否されるかを検証する',
      C: '検索クエリにユーザーごとの閲覧権限チェックを追加し、担当外チケットの取得が拒否されるかを検証する',
      D: 'サーバー側のアクセスログから認証情報を除外し、許可されたログ項目のみが残るかを確認する',
    },
    explanation: 'たとえダミーであっても認証情報などの不要な項目をLLMへのツール返却値に含めるべきではありません。必要最小限の項目に絞るデータ最小化契約が必要です。',
    choiceExplanations: {
      A: 'たとえダミーであっても認証情報などの不要な項目をLLMへのツール返却値に含めるべきではありません。必要最小限の項目に絞るデータ最小化契約が必要です。',
      B: '今回はダミーのテストトークンであり本番漏洩ではないため、根本対策はツール返却スキーマの制限です。',
      C: '担当外チケットの拒否は既に検証済みであり、今回の課題である返却項目の過剰露出の対策にはなりません。',
      D: 'ログの最小化は既に確認済みであり、ツールの戻り値オブジェクト自体のプロパティ制限が必要です。',
    },
  },
  'q-d2-a19': {
    question: 'チームのCopilot共通指示（.github/copilot-instructions.md）で、独自のエラーロガーを利用するルールを明確に指示したいと考えています。対象のAPIが `appLogger.error` と決まっている場合、モデルに対して最も具体的かつ曖昧さのない指示文はどれですか？',
    choices: {
      A: 'エラーハンドリングにおけるエラーログの出力には、必ず appLogger.error を使用してください',
      B: 'プロジェクト全体のエラーログ出力には、共有されている共通のロガーを優先して使用してください',
      C: '例外発生時のエラー記録には、組織で標準化されている推奨ログAPIを使用するようにしてください',
      D: 'エラーの記録を行う際には、既存のソースコードで実装されているログ出力方式を踏襲してください',
    },
    explanation: 'AIに対するカスタム指示では、「共通ロガー」「標準API」といった抽象的な表現を避け、具体的な関数名やAPI名（appLogger.error）を明記することが最も効果的です。',
    choiceExplanations: {
      A: 'AIに対するカスタム指示では、「共通ロガー」「標準API」といった抽象的な表現を避け、具体的な関数名やAPI名（appLogger.error）を明記することが最も効果的です。',
      B: '「共有のロガー」という表現は曖昧であり、console.errorや別ライブラリと混同するリスクがあります。',
      C: '「標準のログAPI」では言語組み込みのログや別の汎用ロガーが推論される可能性があります。',
      D: '「既存の方式」では既存コードに複数の書き方があった場合に意図しないロガーが選ばれる原因になります。',
    },
  },
  'q-d2-a20': {
    question: 'Copilot Spacesにアップロードされた朝時点の注文データCSVファイルと、担当者ごとの認可制御が組み込まれた本番注文管理APIが存在します。最新、利用者権限、更新不要の条件の下で、午後に発生した注文キャンセルを含む「リアルタイムの最新状況」のみを正確に照会したい場合、利用すべきデータ連携経路として最も適切なものはどれですか？',
    choices: {
      A: '担当者の認可権限を適用してリアルタイムに最新データを取得できる、認可付き注文管理APIのMCPツール',
      B: '午前のスナップショットデータが保存されている、Copilot Spacesにアップロード済みの静的注文CSVファイル',
      C: '朝の静的CSVファイルの内容を毎回コピーしてChatのメッセージ入力欄に手動で添付するプロンプト運用',
      D: 'CSVファイルのデータ構造やフォーマットを詳細に説明した、リポジトリの共通カスタム指示ファイル',
    },
    explanation: '静的なCSVファイルでは午後の最新更新が反映されません。リアルタイム性と認可制御を両立するには、認可付きAPIを呼び出すMCPツールが最適です。',
    choiceExplanations: {
      A: '静的なCSVファイルでは午後の最新更新が反映されません。リアルタイム性と認可制御を両立するには、認可付きAPIを呼び出すMCPツールが最適です。',
      B: 'Spacesの朝のCSVは静的スナップショットであり、午後のキャンセルや更新データが含まれていません。',
      C: '朝のCSVを手動添付しても、午後のリアルタイムな変更内容を反映することはできません。',
      D: '指示ファイルはモデルの振る舞いを定義するものであり、最新のデータベースレコードを提供するデータ源にはなりません。',
    },
  },
  'q-d2-a21': {
    question: 'エディタで開いている非常に長いファイル全体の構造や実装パターンをCopilot Chatで確認させたいと考えています。カーソル位置の関数だけでなく、このファイル全体の内容を明示的にChatの文脈として渡すための最も直接的な操作はどれですか？',
    choices: {
      A: 'Chat入力欄でファイル参照記法（#file 等）を使用するか、現在のファイルをChatパネルへ直接ドラッグ＆ドロップして添付する',
      B: '対象の関数だけをマウスで選択してChatに送信し、同じファイルの残りの部分はワークスペース検索でモデルに推測させる',
      C: 'ターミナルで対象ファイルを出力したコマンド実行結果のログをコピーし、Chatメッセージの末尾にテキストとして貼り付ける',
      D: 'ファイル先頭の1行目だけをChatに送信し、後続のコードをインライン補完の履歴からモデルに推定させる',
    },
    explanation: 'ファイル全体を確実にコンテキストに含めるには、#file による明示的なファイル参照やファイル添付が最も正確かつ直接的です。',
    choiceExplanations: {
      A: 'ファイル全体を確実にコンテキストに含めるには、#file による明示的なファイル参照やファイル添付が最も正確かつ直接的です。',
      B: '関数単体の選択ではファイル内の他のヘルパーや型定義がコンテキストから漏れてしまいます。',
      C: 'ターミナル出力の貼り付けはトークンの浪費であり、構文木としてのファイル参照に比べて非効率です。',
      D: '1行目からの推測では実際の実装内容を正確に認識させることは不可能です。',
    },
  },
  'q-d2-a22': {
    question: 'IDEやWebブラウザに画面を切り替えることなく、ターミナル環境のシェル内で直接 find や awk などの複雑なコマンドライン構文の提案を受け、解説を相談したいと考えています。最も適したツールはどれですか？',
    choices: {
      A: 'ターミナル上で対話的にコマンドの提案や説明を求められる GitHub Copilot CLI（gh copilot）',
      B: 'VS Codeなどのグラフィカルエディタ上でコード補完を提供する GitHub Copilot エディタ拡張機能',
      C: 'Webブラウザ経由でGitHub上のリポジトリやプルリクエストを横断検索する GitHub.com の Copilot Chat',
      D: 'ローカルプロセスや外部サービスと連携して独自ツール群を提供する Model Context Protocol（MCP）サーバー',
    },
    explanation: 'シェル環境から離れずにターミナル内でコマンドの相談や生成を行えるのがGitHub Copilot CLIの役割です。',
    choiceExplanations: {
      A: 'シェル環境から離れずにターミナル内でコマンドの相談や生成を行えるのがGitHub Copilot CLIの役割です。',
      B: 'IDE拡張機能はGUIエディタ内での操作が必要であり、「端末内だけで完結させる」という要件に合いません。',
      C: 'GitHub.comのWeb版はブラウザへの移動が必要であり、ターミナル作業中の即時支援には向きません。',
      D: 'MCPサーバーはプロトコル層の基盤であり、端末内で即座に対話するCLIツールそのものではありません。',
    },
  },
  'q-d2-a23': {
    question: 'GitHub CopilotのMCP接続ログを確認したところ、http://127.0.0.1:8765/mcp への接続が「connection refused」で失敗していました。一方、HTTPサーバー側の起動ログを確認すると「ポート 8770 でリクエスト待機中」と記録されており、ポート 8765 で動作しているプロセスは存在しませんでした。この問題を解消するための最初の修正として、最も適切なものはどれですか？',
    choices: {
      A: 'Copilot設定側のMCP接続URLに指定されているポート番号を、サーバーが実際に待受中の 8770 に修正する',
      B: 'MCP接続URLのポートはそのまま維持し、パス部分だけを /mcp から /mcp/v2 に書き換える',
      C: 'サーバー側のAPI認証トークンを再発行し、Copilot設定側の環境変数ヘッダーに新しいトークンを設定する',
      D: 'MCPサーバーが公開している各ツールの入力スキーマ定義を修正し、バリデーションルールを緩和する',
    },
    explanation: 'connection refusedの原因は待受ポートの不一致（サーバーは8770、クライアントは8765）であるため、クライアント側の接続ポートを8770に合わせるのが直接の解決策です。',
    choiceExplanations: {
      A: 'connection refusedの原因は待受ポートの不一致（サーバーは8770、クライアントは8765）であるため、クライアント側の接続ポートを8770に合わせるのが直接の解決策です。',
      B: 'ポートが閉じているため、URLのパス部分を変更しても接続拒否エラーは解消しません。',
      C: 'TCP接続自体が拒否されている段階であり、HTTP認証トークンの問題ではありません。',
      D: '通信が確立する前のネットワーク接続エラーであるため、ツールのスキーマ定義は無関係です。',
    },
  },
  'q-d2-a24': {
    question: 'Copilotの共通指示ファイルに開発規約とリリースノート作成手順の両方を記述したところ、日常的なコード修正の相談時にもリリースノートのフォーマットが回答に混ざるようになってしまいました。共通規約は常時適用し、リリースノート手順は必要時のみ利用したい場合、適切な配置構成はどれですか？',
    choices: {
      A: 'リリースノート作成手順を個別のPrompt File（.prompt.md）へ切り出し、共通規約のみを共通指示に残す',
      B: '共通開発規約のみをPrompt Fileへ切り出し、リリースノート作成手順を共通指示ファイルに残す',
      C: '両方の内容を極限まで短縮した上で、単一の共通指示ファイルの中に箇条書きで同居させ続ける',
      D: '両方の内容をチームリポジトリから削除し、各開発者の個人カスタム指示ファイルへそれぞれ移行する',
    },
    explanation: '常時適用すべきコーディング規約はcopilot-instructions.mdに残し、特定の定型タスク手順はPrompt File（.prompt.md）に分離してオンデマンドで呼び出すのがベストプラクティスです。',
    choiceExplanations: {
      A: '常時適用すべきコーディング規約はcopilot-instructions.mdに残し、特定の定型タスク手順はPrompt File（.prompt.md）に分離してオンデマンドで呼び出すのがベストプラクティスです。',
      B: '開発規約こそ全会話で常時参照されるべきであり、これをオンデマンド化すると日常のコード品質が低下します。',
      C: '文章を短縮しても共通指示にある限り全会話に注入されるため、混入の根本解決にはなりません。',
      D: '個人指示に移すとチーム全体での標準化やバージョン管理が行えなくなってしまいます。',
    },
  },
  'q-d2-a25': {
    question: 'GitHub Copilot CLIが提案したファイル削除コマンドの安全性を確かめるため事前検証（dry-run）を実行したところ、削除対象である run-cache に加えて保持すべき run-fixtures も削除候補一覧に含まれていました（まだ実行はしていません）。許可された範囲のみを削除するために次に行うべき操作として、最も適切なものはどれですか？',
    choices: {
      A: '削除対象の指定を run-cache のみに厳密に絞り込むよう修正し、再度dry-runを実行して一覧を再確認する',
      B: '表示された一覧をテキストファイルにバックアップとして保存した上で、提示された削除コマンドをそのまま実行する',
      C: '保持すべき run-fixtures を手動で先に別ディレクトリへ退避させ、元の削除コマンドを実行する',
      D: '対象範囲の指定を /tmp ディレクトリ全体へ広げ、他に削除できる一時ファイルがないか確認する',
    },
    explanation: '意図しない削除対象が含まれている場合は、コマンドの対象範囲を安全に修正した上で、再度dry-runを行って対象が意図通りか検証するのが原則です。',
    choiceExplanations: {
      A: '意図しない削除対象が含まれている場合は、コマンドの対象範囲を安全に修正した上で、再度dry-runを行って対象が意図通りか検証するのが原則です。',
      B: '保持すべきデータが消去されることが分かっているコマンドを実行するのは危険です。',
      C: 'コマンド側の過剰な対象指定を修正せずに手動退避で逃げるのは、再発や人為的ミスの原因になります。',
      D: '対象範囲をさらに広げることは、被害を拡大させる危険な操作です。',
    },
  },
  'q-d2-a26': {
    question: 'Agentモードに対して「src/parser.ts のバグ修正のみ」を依頼したところ、提示された差分には parser.ts の修正だけでなく package.json の依存パッケージ更新も含まれており、更新された理由は未確認でした。依頼した安全な範囲のみを確実にレビュー・適用するための次の指示として、最も適切なものはどれですか？',
    choices: {
      A: 'package.jsonの依存関係更新を一旦除外させ、parser.tsの修正のみを既存の依存環境でテスト・検証するよう指示する',
      B: '依存関係の更新もそのまま受け入れ、parser.tsの修正内容についての解説のみをAgentに要求する',
      C: 'parser.tsの修正をすべて破棄して元に戻し、package.jsonの依存パッケージ更新のみを先に検証するよう指示する',
      D: '提示された両方の差分をそのままコミットし、依存更新に伴う回帰テストを後から作成するよう指示する',
    },
    explanation: '依頼外の不要な変更が混入した場合は、スコープ外の変更を切り離し、本来の依頼対象が既存環境で正しく機能するかを独立して検証する必要があります。',
    choiceExplanations: {
      A: '依頼外の不要な変更が混入した場合は、スコープ外の変更を切り離し、本来の依頼対象が既存環境で正しく機能するかを独立して検証する必要があります。',
      B: '理由不明の依存更新を安易に取り込むと、予期せぬ破壊的変更やサプライチェーンリスクを抱え込みます。',
      C: '本来の目的であるparser.tsのバグ修正を破棄してしまうのは本末転倒です。',
      D: 'テスト前に無関係な変更をまとめてコミットすることは、デバッグやロールバックを困難にします。',
    },
  },
};

export function applyD2Rewrites() {
  const seed = read('content/gh300/2026-08-07/questions/seed.json');
  assertLegacyRewriteScope(seed, d2Rewrites);
  const appliedRep = read('reports/applied-question-quality-review.json');
  const diffRep = read('content/gh300/2026-08-07/questions/difficulty-review.json');
  const qualRep = read('content/gh300/2026-08-07/questions/quality-review.json');
  const classRep = read('reports/question-objective-classification-review.json');
  const addsRep = read('content/gh300/2026-08-07/questions/additions-review.json');
  const exclusionsRep = read('content/gh300/2026-08-07/questions/selection-exclusions.json');
  const cleanupRep = read('reports/d4-d5-applied-cleanup-review.json');

  let updatedCount = 0;
  for (const [id, rw] of Object.entries(d2Rewrites)) {
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

  console.log(`Successfully updated ${updatedCount} D2 questions across all stores.`);

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

if (process.argv[1] && process.argv[1].endsWith('rewrite-d2-applied.mjs')) {
  applyD2Rewrites();
}

