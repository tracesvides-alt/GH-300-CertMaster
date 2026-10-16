# 優先概念を補うオリジナル基礎問題の反映（2026-10-17）

比較レポートで優先した7概念群を、10問のオリジナル基礎問題で補った。CLIは導入・認証・生成と保存の3問、IDEは対応確認・サインインの2問に分けた。残りは購読管理API、cloud agent、Plan、NES、Mobileである。外部サイトの問題文・選択肢は使用していない。

**重複した基礎10問を新規演習から外し、新IDの10問へ置き換えた。演習対象の基礎162問、応用48問、本番相当43問、各Domainの出題在庫数は維持した。** 旧IDの問題文・正答・分類を上書きせず、履歴は旧概念として残す。用語集のbasicQuestionIdを持つ問題は置き換えていない。

## 反映内容

| 新問題ID | テーマ | 置き換えた旧ID | Objective |
| --- | --- | --- | --- |
| q-fnd-cli-install-20261017 | 現行CLIのnpm導入 | q-d2-a10 | d2o2 |
| q-fnd-cli-login-20261017 | CLIの初回認証 | q-d2-e03 | d2o2 |
| q-fnd-cli-create-file-20261017 | CLIへのスクリプト作成・保存の依頼 | q-d2-a22 | d2o2 |
| q-fnd-seat-api-20261017 | 購読管理APIと利用統計APIの違い | q-d2-e12 | d2o4 |
| q-fnd-cloud-issue-20261017 | Issueからcloud agentへ実装を委任 | q-d2-a05 | d2o3 |
| q-fnd-plan-20261017 | Planから実装への引き継ぎ | q-d2-e18 | d2o3 |
| q-fnd-nes-20261017 | ghost textとNESの違い | q-d2-a01 | d2o1 |
| q-fnd-ide-matrix-20261017 | IDE別の機能対応を確認する資料 | q-d2-e05 | d2o1 |
| q-fnd-ide-signin-20261017 | 利用資格があるアカウントでの有効化 | q-d2-a06 | d2o1 |
| q-fnd-mobile-file-20261017 | Mobileでファイルを文脈に質問する | q-d2-e13 | d2o3 |

高優先のCLI・購読管理・cloud agentと、中優先のPlan・NES・対応環境、低優先のMobileまで今回の対象に含めた。サンプルデータ生成、責任あるAI原則の補足、/fix等の追加改稿、要レビューq11の承認は今回の優先項目への反映と分け、変更していない。

## 問題数と履歴

| 項目 | 変更前 | 変更後 |
| --- | ---: | ---: |
| 保存問題数（旧問題を含む） | 395 | 405 |
| 新規演習用資産（要レビューを含む） | 254 | 254 |
| 実際の演習対象（verified） | 253 | 253 |
| 基礎資産（要レビューを含む） | 163 | 163 |
| 実際の基礎演習対象 | 162 | 162 |
| 退役保存資産 | 141 | 151 |

保存数が増えるのは旧10問を履歴用に残したためで、出題対象の純増ではない。既存395問の指紋はすべて一致する。q11はneeds-reviewのため、新規演習には引き続き出さない。

| Domain | 変更前の現行資産 | 変更後 |
| --- | ---: | ---: |
| D1 | 24 | 24 |
| D2 | 98 | 98 |
| D3 | 33 | 33 |
| D4 | 35 | 35 |
| D5 | 32 | 32 |
| D6 | 32 | 32 |

D2内でのObjective配分は、重複したPrompt Files・局所編集・IDE Agentの識別から、未充足だったCLI・購読管理等へ移った。Domain全体の配分は変えていない。

## 品質レビューの意味

- サイトと同じ学習段階の、単一機能・操作・用途を識別する基礎にした。応用の多段階切り分けは要求しない。
- 選択肢は現行の機能・操作・資料を中心にそろえ、無関係な課金・GPU等を誤答に置かない。正答だけを長文・安全・包括的にする構成を避けた。
- 各誤答の不適合理由と、同じ選択肢で別の答えになる条件変更を再読して記録した。Askでも計画を相談できる点、コード補完が使えても他のIDE機能まで同じではない点を明記した。
- 正答の表示位置は置換前の各問題と一致させ、基礎全体の位置分布を維持した。10問だけを切り出した表示位置はA3・B1・C4・D2で、これを均等分布の保証とは呼ばない。
- これは同じ著者による編集レビュー。本文を隠した受験者による実験、正答率での難度校正、実試験との等価性検証はしていない。名称の識別問題は、機能を既に知る人なら短時間で解けることが基礎として適切である。

## 公式情報の照合

GitHub Docs、VS Code公式Docsを2026-10-17に確認した。問題ごとのSource IDとURLは下記へ併記した。旧gh-copilotの導入を現行の正答にしない。Mobile Docsに残る旧Extensionsの段落は根拠に使わない。PlanやNES、Mobileという固有名詞が必ず実試験へ出るとは断定しない。

## 全10問の個別レビュー

### 現行CLIのnpm導入（q-fnd-cli-install-20261017）

Linuxの端末に現行のGitHub Copilot CLIを導入します。Node.js 22とnpmは利用でき、HomebrewとWinGetは導入していません。今回はnpmを使ってCLIをインストールします。実行するコマンドはどれですか。

- A：npm install -g @github/copilot **【正答】**
- B：winget install GitHub.Copilot
- C：brew install --cask copilot-cli
- D：code --install-extension GitHub.copilot

**選択肢単体**：npm・WinGet・HomebrewによるCLI導入とVS Code拡張の導入を並べた。いずれも用途のあるコマンドであり、OS・導入対象・使用する管理ツールの指定なしには一つに決まらない。

**難度**：npmでの現行CLI導入を一つ識別する基礎。依存障害の原因分析や複数設定の推論は要求しない。

**決定条件**：「今回はnpmを使ってCLIをインストール」

**誤答の分析**：

- B：WindowsのWinGetを使う導入手順です。今回指定されたnpmの手順ではありません。
- C：Homebrewを使う導入手順です。今回の端末にはHomebrewがなく、npmを使う条件にも合いません。
- D：VS Code向けのCopilot拡張を導入するコマンドであり、独立したCopilot CLIのnpm導入ではありません。

**条件変更**：WindowsでWinGetを使って現行CLIを導入する場合はBへ変わる。WinGetによる導入先はGitHub.Copilotである。

**文字長**：正答30文字／誤答中央値31文字＝0.97倍。正答表示位置A。

**重複整理**：Prompt Fileの配置と再利用はq-d2-f09で維持し、重複した配置問題をCLI導入へ置き換える。 維持した基礎：q-d2-f09。

出典：[cli-install](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)、[cli](https://docs.github.com/en/copilot/get-started/cli-quickstart)、[foundation-vscode-cli](https://code.visualstudio.com/docs/configure/command-line)

### CLIの初回認証（q-fnd-cli-login-20261017）

現行Copilot CLIをインストールし、作業フォルダーでcopilotを起動しました。フォルダーの信頼確認は済んでいますが、未ログインと表示されます。トークンによる認証は設定していません。対話画面からGitHubアカウントの認証を始めるコマンドはどれですか。

- A：/login **【正答】**
- B：/model
- C：/resume
- D：/help

**選択肢単体**：四つとも現行CLIの操作で、認証・モデル選択・再開・ヘルプのどれが目的かは本文に依存する。正答だけを詳しく説明しない。

**難度**：未ログインという一つの状態を認証操作へ対応付ける基礎。トークン優先順位や認証障害の分析は求めない。

**決定条件**：「対話画面からGitHubアカウントの認証を始める」

**誤答の分析**：

- B：/modelは使用するモデルの選択に使います。GitHubアカウントの認証を始めるコマンドではありません。
- C：/resumeは以前のセッションを再開するために使います。未ログイン状態を解消する認証手順ではありません。
- D：/helpは使えるコマンド等の案内を表示します。認証そのものを始める操作ではありません。

**条件変更**：認証済みで、使用するモデルを選び直したい場合はBへ変わる。モデル選択には/modelを使う。

**文字長**：正答6文字／誤答中央値6文字＝1.00倍。正答表示位置A。

**重複整理**：定型プロンプトの保存・共有は他の基礎で維持し、長いリリースノート事例の同概念問題を初回認証へ置き換える。 維持した基礎：q-d2-f09。

出典：[cli](https://docs.github.com/en/copilot/get-started/cli-quickstart)、[feature-refresh-cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### CLIへのスクリプト作成・保存の依頼（q-fnd-cli-create-file-20261017）

認証済みのCopilot CLIで、作業フォルダー内のログを整理するためのスクリプトを用意します。整理の手順は決まっていますが、スクリプトファイルはまだありません。まず実行せずにスクリプトを作って保存したい場合、CLIへの依頼として目的に合うものはどれですか。

- A：既存スクリプトの動作と注意点の説明を依頼する
- B：整理用スクリプトの作成と保存を依頼する **【正答】**
- C：整理対象ファイルの一覧と件数の集計を依頼する
- D：整理方法の候補と作業計画の比較を依頼する

**選択肢単体**：生成・既存コードの説明・対象調査・計画というCLIの有用な依頼を並べた。最も慎重な文章や最も包括的な文章を一つだけ置かず、必要な成果物によって選択が変わる。

**難度**：CLIに依頼できる作業の基本範囲を識別する。ログ整理アルゴリズムやシェル構文そのものは問わない。

**決定条件**：「まず実行せずにスクリプトを作って保存」

**誤答の分析**：

- A：既存のスクリプトを理解する依頼です。今回はファイルがまだなく、新規作成と保存が必要です。
- C：整理対象を調査する依頼です。一覧・件数の集計だけでは、求めるスクリプトファイルを用意できません。
- D：整理方針を決める段階の依頼です。今回は方針が決まっており、次はスクリプトの作成と保存です。

**条件変更**：整理用スクリプトが既にあり、実行前に内容を理解したい場合はAへ変わる。既存スクリプトの説明が必要な成果物になる。

**文字長**：正答19文字／誤答中央値22文字＝0.86倍。正答表示位置B。

**重複整理**：端末で相談するツールの識別はq-d2-f11に残し、同じツール名を答える類題を生成・保存の利用判断へ置き換える。 維持した基礎：q-d2-f11、q-d2-g08、q-d2-g09。

出典：[cli-usage](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview)、[cli-tool-permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### 購読管理APIと利用統計APIの違い（q-fnd-seat-api-20261017）

組織の入社手続きに、対象者へのCopilotシート付与を組み込みます。対象者の組織への所属は確認済みで、管理者権限と認証も用意しています。管理画面で手作業をせず、プログラムからシート割り当てを変更するために使うAPIはどれですか。

- A：Copilotの利用統計と活動量を取得するREST API
- B：GitHubの監査イベントと操作履歴を取得するREST API
- C：Copilotの購読とシート割り当てを管理するREST API **【正答】**
- D：GitHubの組織メンバーと所属状態を管理するREST API

**選択肢単体**：四つの正規の管理APIを、操作対象をそろえた表現で並べた。割当・統計・監査・所属のどれを変更または取得するかが示されないと正答は決まらない。

**難度**：要求する管理対象とAPIの役割を一つ対応付ける基礎。ページネーション、HTTPエラーや課金周期の複合判断は要求しない。

**決定条件**：「プログラムからシート割り当てを変更」

**誤答の分析**：

- A：利用統計は活動状況を集計するための情報です。統計の取得で対象者のCopilotシートを付与することはできません。
- B：監査ログは管理操作の主体や履歴を追跡する情報です。履歴の取得はシート付与の操作ではありません。
- D：組織への所属とCopilotのシート割り当ては別の管理対象です。対象者は既に所属しており、今回はCopilotの利用資格を付与します。

**条件変更**：Copilotの割当は変更せず、利用状況や活動量を集計したい場合はAへ変わる。利用統計の取得APIを選ぶ。

**文字長**：正答31文字／誤答中央値31文字＝1.00倍。正答表示位置C。

**重複整理**：Prompt Filesの同概念反復を減らし、購読管理APIという未出題の基礎へ置き換える。 維持した基礎：q-d2-f09。

出典：[copilot-seat-api](https://docs.github.com/en/rest/copilot/copilot-user-management)、[rest-api](https://docs.github.com/en/rest/copilot)、[audit-log](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)

### Issueからcloud agentへ実装を委任（q-fnd-cloud-issue-20261017）

GitHub.comのIssueに書いた修正作業をCopilotへ割り当て、開発者のIDEとは別の環境で実装を進めさせます。開発者は作業後に作成されたPull Requestの変更をレビューします。このIssueからの委任を担当する機能はどれですか。

- A：Copilot code review（変更差分のAIレビュー）
- B：IDEのAgentモード（作業環境内での編集と実行）
- C：Copilot CLI（ターミナルでの対話と作業支援）
- D：Copilot cloud agent（GitHub上の実装エージェント） **【正答】**

**選択肢単体**：四つとも編集・実装・レビューに関係する現行のCopilot機能であり、正答だけに品質保証や人の確認を付けていない。実行場所と開始方法がないと一つに決まらない。

**難度**：Issue割当とPR作成という機能の入口を識別する基礎。cloud agentのsetup、firewallや権限の切り分けは要求しない。

**決定条件**：「GitHub.comのIssueに書いた修正作業をCopilotへ割り当て」

**誤答の分析**：

- A：Code reviewは変更差分を評価して指摘を返す機能です。今回のIssueを受けて実装とPR作成を進める担当はcloud agentです。
- B：IDEのAgentはIDE側の作業環境で編集やツール実行を進めます。GitHubのIssue割当を起点に別環境へ実装を委任する機能ではありません。
- C：CLIは端末で作業を依頼する利用形態です。GitHub上のIssue割当からPRを作る今回の入口とは異なります。

**条件変更**：実装済みPRの差分に対するAIのレビュー指摘を求める場合はAへ変わる。コード差分への指摘を担当するCopilot code reviewを選ぶ。

**文字長**：正答37文字／誤答中央値27文字＝1.37倍。正答表示位置D。

**重複整理**：IDE Agentの編集・実行ループはq-d2-f04とq-sc04-1に残し、同じ優位性を答える類題をcloud agentの基礎へ置き換える。 維持した基礎：q-d2-f04、q-sc04-1。

出典：[foundation-cloud-task](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task)、[agent-mode](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)、[code-review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)

### Planから実装への引き継ぎ（q-fnd-plan-20261017）

対応するVS CodeのCopilotで、関連コードを調べて実装案をまとめ、内容を確認してから実装用のAgentへ引き継ぐ専用ワークフローを使います。この用途のために用意されているモードはどれですか。

- A：Askモード
- B：Editモード
- C：Agentモード
- D：Planモード **【正答】**

**選択肢単体**：四つのモード名のみを並べ、正答だけに説明を追加していない。相談・計画・対象編集・実行のどれが目的かを本文で確認する必要がある。

**難度**：専用モードの用途を識別する基礎。Askでも計画を相談できることと、専用Planの存在を混同しない表現にした。

**決定条件**：「実装用のAgentへ引き継ぐ専用ワークフロー」

**誤答の分析**：

- A：Askでも方針を相談できますが、設問は実装への引き継ぎを備えた専用のPlanワークフローを尋ねています。相談ができることだけでは同じ機能とはいえません。
- B：Editは対象ファイルの編集提案を進める用途です。今回選ぶのは実装前に調査と計画を行う専用ワークフローです。
- C：Agentは編集やツール実行を伴う作業を進める用途です。今回は実装を始める前の専用ワークフローを選びます。

**条件変更**：編集とテスト実行を繰り返しながら実装を進めるモードを選ぶ場合はCへ変わる。作業を実行するAgentを選ぶ。

**文字長**：正答7文字／誤答中央値7文字＝1.00倍。正答表示位置D。

**重複整理**：Agentの複数ファイル編集と実行は既存問題に残し、長いUI実装事例の同概念問題をPlanの基礎へ置き換える。 維持した基礎：q-d2-f04、q-sc04-1。

出典：[foundation-vscode-plan](https://code.visualstudio.com/docs/agents/run/planning)

### ghost textとNESの違い（q-fnd-nes-20261017）

対応するVS Codeで変数名を修正すると、現在のカーソルから離れた関連箇所にも変更候補が示されました。矢印から次の編集位置へ移動し、その箇所の提案を採用できます。この位置の予測も行うCopilotの機能はどれですか。

- A：Ghost Text Suggestions（入力位置の補完候補）
- B：Inline Chat（選択範囲での対話編集）
- C：Next Edit Suggestions（次の編集候補） **【正答】**
- D：Completions Panel（補完候補の一覧）

**選択肢単体**：いずれもエディタ内の提案・編集機能で、同じ粒度の名前と短い説明を付けた。補完位置、対話、候補一覧、次位置のどれを求めるかで選択が変わる。

**難度**：表示された挙動を機能名へ対応付ける基礎。モデル選択やネットワーク制御等の複合条件は含めない。

**決定条件**：「矢印から次の編集位置へ移動」

**誤答の分析**：

- A：Ghost textは主に現在のカーソル位置に未確定のコード補完を示します。設問は次に編集する位置の予測も行う機能です。
- B：Inline Chatは選択コード等について利用者が指示して対話編集する機能です。編集履歴から次の位置を予測して示すNESとは異なります。
- D：Completions Panelは補完候補を一覧で比べるものです。関連する別の編集位置を予測して誘導する機能ではありません。

**条件変更**：現在の入力位置に薄い文字でコードの続きだけが示される場合はAへ変わる。現在位置の補完はghost textである。

**文字長**：正答29文字／誤答中央値26文字＝1.11倍。正答表示位置C。

**重複整理**：Inline Chatによる局所編集は他の基礎に残し、同じ操作を尋ねる問題をNESの識別へ置き換える。 維持した基礎：q-d2-f01。

出典：[feature-refresh-inline](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)、[inline-usage](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### IDE別の機能対応を確認する資料（q-fnd-ide-matrix-20261017）

チームではVS CodeとNeovimを併用しています。どちらでもCopilotのコード補完を使っていますが、ChatやAgentも同じように使えるとは限りません。導入前にIDEごとの機能対応を直接比較するために確認する公式資料はどれですか。

- A：Copilot Feature Matrix（IDE別の機能対応表） **【正答】**
- B：Copilot Plans（契約プラン別の利用条件）
- C：Copilot CLI Reference（端末コマンドの参照資料）
- D：Copilot Model Comparison（モデル別の比較資料）

**選択肢単体**：公式資料の対象をそろえた選択肢で、プラン・IDE・端末コマンド・モデルのどれを比較するかは本文に依存する。正答だけを現行・安全などの価値語で飾らない。

**難度**：対象環境に適した資料を選ぶ基礎。個別バージョンの対応表の丸暗記は求めない。

**決定条件**：「IDEごとの機能対応を直接比較」

**誤答の分析**：

- B：プランは利用資格や契約上の機能差の確認に必要ですが、今回の主題であるIDEごとの実装・対応状況を直接比較する資料ではありません。
- C：CLIのコマンドや引数を調べる資料です。VS CodeとNeovimの機能対応表ではありません。
- D：モデルの特徴や用途を比べる資料です。IDEごとのUIやAgent機能の対応表ではありません。

**条件変更**：利用するAIモデルの特徴や適した用途を比べたい場合はDへ変わる。モデル比較の資料を選ぶ。

**文字長**：正答34文字／誤答中央値34文字＝1.00倍。正答表示位置A。

**重複整理**：Inline Chatの局所編集はq-d2-f01、診断の利用はq-d2-e17に残し、同じ局所編集の類題を対応環境の確認へ置き換える。 維持した基礎：q-d2-f01、q-d2-e17。

出典：[feature-matrix](https://docs.github.com/en/copilot/reference/copilot-feature-matrix)、[plans](https://docs.github.com/en/copilot/get-started/plans)、[feature-refresh-cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)、[foundation-model-comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison)

### 利用資格があるアカウントでの有効化（q-fnd-ide-signin-20261017）

仕事用のGitHubアカウントには組織からCopilotのシートが割り当てられています。一方、VS CodeのCopilotは個人用アカウントでサインインしています。通信には問題がありません。仕事用の利用資格でCopilotを使い始めるため、最初に行う操作はどれですか。

- A：Copilot Chatで使用するモデルを別のモデルへ切り替える
- B：現在のChatを閉じ、新しい会話セッションへ切り替える
- C：Copilotのサインイン先を仕事用アカウントへ切り替える **【正答】**
- D：エディタの補完設定を、その言語で有効へ切り替える

**選択肢単体**：アカウント・モデル・会話・補完設定の切替を同じ形式で並べた。すべて通常の操作であり、症状と目的が示されないと優先すべき操作は決まらない。

**難度**：利用資格とサインイン先の対応を確認する基礎。接続障害やポリシー階層の分析へ広げない。

**決定条件**：「VS CodeのCopilotは個人用アカウントでサインイン」

**誤答の分析**：

- A：モデルを切り替えてもCopilotのサインイン先は変わりません。仕事用アカウントの利用資格を使う操作ではありません。
- B：新規Chatは会話履歴を切り替える操作です。利用資格に結びつくGitHubアカウントは変わりません。
- D：言語別の補完設定は提案表示の制御です。サインイン先の利用資格を切り替える操作ではありません。

**条件変更**：同じアカウントのまま、以前の会話履歴を引き継がず別の相談を始めたい場合はBへ変わる。New Chatで新しい会話を始める。

**文字長**：正答29文字／誤答中央値27文字＝1.07倍。正答表示位置C。

**重複整理**：実行結果を使うAgentループはq-d2-f04等で維持し、同じループ名の類題を初期アカウント設定へ置き換える。 維持した基礎：q-d2-f04、q-sc04-1。

出典：[foundation-vscode-setup](https://code.visualstudio.com/docs/setup/copilot)

### Mobileでファイルを文脈に質問する（q-fnd-mobile-file-20261017）

外出先でGitHub Mobileを使い、リポジトリ内のファイルを確認しています。ファイルの内容を手動でコピーせず、そのファイル全体を文脈としてCopilotへ質問するには、どの操作から始めますか。

- A：対象行をコピーし、Copilotの入力欄へ貼って質問する
- B：リポジトリを開き、Copilotへ全体構成について質問する
- C：対象ファイルを開き、Copilotアイコンから質問する **【正答】**
- D：リポジトリを開かず、Copilotへ言語の使い方を質問する

**選択肢単体**：四択ともMobileでCopilotへ相談する使い方で、ローカルコンパイルや課金のような無関係な誤答を置かない。ファイル全体・選択行・repo全体・一般質問という文脈の違いを本文で選ぶ。

**難度**：Mobileで特定ファイルを文脈にする基本操作の識別。IDEと同等の編集・実行ができるとは教えない。

**決定条件**：「ファイルの内容を手動でコピーせず」

**誤答の分析**：

- A：選択した数行を文脈として渡す場合の操作です。今回は手動コピーをせずにファイル全体を対象にします。
- B：リポジトリ全体について探索的な質問をする入口です。今回求める特定ファイルの画面からの質問操作とは異なります。
- D：一般的な開発や言語の質問をする使い方です。特定のリポジトリのファイルを文脈とする今回の操作ではありません。

**条件変更**：ファイル全体ではなく、選んだ数行をコピーして文脈として渡したい場合はAへ変わる。選択した行をCopilotの入力欄に貼り付ける。

**文字長**：正答27文字／誤答中央値29文字＝0.93倍。正答表示位置C。

**重複整理**：CLIの選択と実行前の許可確認は他の基礎で維持し、同じCLI選択の類題をMobileの文脈指定へ置き換える。 維持した基礎：q-d2-f11、q-d2-g08。

出典：[foundation-mobile-chat](https://docs.github.com/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile)

## 検証

過去のベースラインを今回の完成品で上書きせず、新規の初期状態とレビュー台帳を追加した。旧台帳の検査は新しい履歴境界の整合性を検証したうえで、当時の在庫へ戻して行う。未レビューの改変や旧問題の書き換えでは失敗する。

- 単体テスト：247件（24ファイル）成功。
- 型チェック：成功。
- 本番ビルド：CERTMASTER_E2E_WEBPACK=1 next build --webpack (Playwright webServer)で成功。
- E2E：14件成功。デスクトップ・モバイルの各環境で10問すべてを通常クリックで回答し、誤答を含む採点、個別解説、再読込後の保存、横幅、旧問題のブックマーク除外を確認。既存の演習・模試フローも確認。
- 台帳・用語対応・分類・品質の整合検査に成功。
- 問題バンクの正規化SHA-256：`2d6c1049a97ea70c4882916773f7a6103d6688bb57f6ea6634aad5712a72e2df`。

今回の変更はローカルへの反映。Gitへのcommit・pushやデプロイは行っていない。
