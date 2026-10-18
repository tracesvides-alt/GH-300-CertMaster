# GH-300 公式整合性の修正記録

修正日：2026-10-18（日本時間）

10問を個別に編集して公式根拠と照合。8問の内容訂正と2問の時点注記。元データ・過去監査・旧版の解説を保存し、改訂内容への完全一致で現在の出題と詳細解説へ適用する。

通常出題253問（基礎162・応用48・高難度43）、ドメイン・Objective・出題形式の件数を維持。q11は要レビューとして通常出題から除外したまま。旧監査レポートは修正前の記録として保持する。

## 改訂内容

F01はC・Dへ採点を訂正し、Lite/Balancedのみで再設計。旧版F01は未完了模試・新規出題から外す。完了済み履歴の設問や点数は変更しない。新しい詳細解説は改訂版の問題と完全一致した場合だけ表示する。

## 個別レビュー

### q-d5-e08-feature-20261016-ms-20261017（F01）

GitHub.comのCopilot code reviewで、組織のレビュー深度はBalanced、リポジトリの既定値はLiteです。PR Pは前回Balancedでレビューされました。Pの依頼者の設定はLiteで、今回の依頼時には深度を指定しません。PR Qも前回はBalancedで、Qの依頼者の設定もBalancedですが、今回はレビュー依頼時にLiteを明示指定します。この2回のレビューに適用される深度の説明として、正しいものを2つ選んでください。

- A / ID C［正解］：PR Pの今回のレビュー深度は、Balancedになる — Pは今回の指定がないため、前回のBalancedが選ばれる。
- B / ID A：PR Pの今回のレビュー深度は、Liteになる — Pでは前回のBalancedがrepoのLiteより優先する。
- C / ID D［正解］：PR Qの今回のレビュー深度は、Liteになる — Qは今回の依頼時にLiteを指定しており、その指定が優先する。
- D / ID B：PR Qの今回のレビュー深度は、Balancedになる — Qでは今回指定したLiteが前回のBalancedより優先する。

レビュー深度は、今回の依頼時の明示指定、同じPRで前回使った値、依頼者の設定、リポジトリの設定、組織などの設定という順で評価し、最初に当てはまる値を使います。前回の値があっても、今回の依頼時に別の値を指定すれば、その指定が優先します。

Pには今回の明示指定がなく、前回のBalancedがあります。そのため、依頼者とリポジトリがLiteでもBalancedになります。Qでは今回Liteを明示しているので、前回と依頼者のBalancedよりLiteが優先します。二つのPRについて、値の名前だけでなく、いつ・どこで設定した値かを照合することが要点です。

選択肢単体の確認：選択肢はP/Qそれぞれの結果だけを同じ書式で記載し、設定元や優先する理由をヒントとして書かない。LiteとBalancedは正答・誤答に一つずつあり、本文のPRごとの条件を読まないと正しい二つを選べない。
難易度：高難度を維持。二つのPRで優先する設定元が異なるため、設定の抽出と優先規則の適用が必要。単なる深度名の暗記にはしない。
推論1：PRごとに今回の指定、前回値、依頼者設定、repo設定を分ける
推論2：今回の指定→前回値→依頼者→repoという順に照合する
推論3：PはBalanced、QはLiteと結論づける
条件変更：Pも今回Liteを明示指定する → 正解ID A・D。Pでも今回の指定が前回値に優先する。
条件変更：Qの今回の明示指定を省く → 正解ID B・C。Qは前回のBalancedを使う。
文字長：A=27字（中央値比1.08）、B=23字（中央値比0.92）、C=23字（中央値比0.92）、D=27字（中央値比1.08）

- [Copilot code review — Review effort level](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review#review-effort-level)
- [Copilot code review effort levels are generally available](https://github.blog/changelog/2026-08-07-copilot-code-review-effort-levels-are-generally-available/)

### q-d3-g14（F02）

Public Code MatchingやContent Exclusionとは異なり、差別・ヘイトスピーチ、自傷、悪意あるエクスプロイトコードなど、出力内容そのものの危険性や有害性を評価してブロックするセーフガードとして、最も適切なものはどれですか？

- A / ID A：パブリックコード一致フィルター（Public Code Matching Filter） — 候補と周辺コードを公開コードと照合する。約150文字は周辺コードの説明で、一致の最低文字数ではない。
- B / ID B［正解］：有害コンテンツフィルタリング（Harmful Output Filtering） — 有害な出力内容を検出・抑制する仕組みであり、この問いの対象に当たる。
- C / ID C：コンテンツ除外ゲートウェイ（Content Exclusion Gateway） — 対応機能の入力文脈から指定パスを除外する設定で、有害な出力内容を判定するものではない。
- D / ID D：シークレットスキャニング（Secret Scanning） — コードに含まれる資格情報を検出する機能で、有害な生成出力全般の評価とは異なる。

Harmful Output Filteringは、出力内容そのものの有害性や危険性を検出・抑制する安全機構です。公開コードとの類似を調べる仕組みとは、評価する目的が異なります。フィルターがあってもすべての危険を排除できるとは限らないため、出力のレビューは引き続き必要です。

選択肢単体の確認：選択肢本文と正解は変更せず、公開コード一致の誤った数値説明を訂正。四つの安全機構のどの役割を尋ねているかは本文が必要。
難易度：既存の基礎の役割識別を維持。
文字長：A=44字（中央値比1.1）、B=40字（中央値比1）、C=40字（中央値比1）、D=29字（中央値比0.725）

- [Managing GitHub Copilot policies as an individual subscriber](https://docs.github.com/en/copilot/how-tos/manage-your-account/manage-policies)

### q-d2-g15（F05）

リポジトリ全体の共通規約（`copilot-instructions.md`）とは別に、特定のサブディレクトリやファイル種別（フロントエンド、バックエンド等）に限定して指示を適用する設定手法として、最も適切なものはどれですか？

- A / ID A［正解］：スコープ付きインストラクション（Scoped Instructions） — NAME.instructions.mdとapplyToで、指示を適用するファイルの範囲を指定する。
- B / ID B：リポジトリルールセット（Repository Rulesets） — ブランチ等のルールを強制する設定で、Copilotへのパス別の指示ではない。
- C / ID C：プロンプトファイル（Prompt Files） — 必要時に呼び出すタスク用の依頼文で、パスに応じた常時指示とは異なる。
- D / ID D：ワークスペースプロファイル（Workspace Profiles） — エディタの拡張やUI設定を切り替える構成で、パス別のCopilot指示ではない。

パス別のカスタム指示は、特定のディレクトリやファイル種別にだけ規約を伝えるためのものです。.github/instructions/NAME.instructions.mdという名前のファイルを用意し、先頭のfrontmatterにapplyToで対象のパスを記載します。

たとえばapplyTo: "**/*.ts"ならTypeScriptファイルが対象です。リポジトリ全体の共通規約へすべての言語のルールを書く代わりに、必要な範囲へ分けられます。任意の名前の.mdを置くだけでは、この指示ファイルの命名要件を満たしません。

選択肢単体の確認：選択肢本文を維持し、適用範囲を尋ねる基礎問題として確認。ファイル名の仕様を解説で具体化した。
難易度：設定手法の識別を維持し、複合的な設定の計算問題へは変えていない。
文字長：A=36字（中央値比1.108）、B=32字（中央値比0.985）、C=23字（中央値比0.708）、D=33字（中央値比1.015）

- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)

### q-d3-g04（F06）

Copilotの利用状況を確認するため、提案の採用・却下イベントや応答の遅延、エラーの発生件数を集計しています。こうした利用・動作の情報を表す分類として、最も適切なものはどれですか？

- A / ID A：Prompt Content — 回答生成に渡す指示文や関連コード等の文脈であり、今回の利用・動作の集計ではない。
- B / ID B：Audit Events — 管理操作の主体や日時を追跡する記録で、今回の補完イベントや遅延の集計とは目的が異なる。
- C / ID C：Training Dataset — モデルの学習に使うデータであり、今回の利用・動作の集計ではない。
- D / ID D［正解］：Engagement / Telemetry — 採用イベントや遅延など、利用状況や稼働状態を把握する情報に当たる。

Telemetryは、サービスやクライアントの利用状況・動作を観測する情報です。今回は採用・却下イベント、応答の遅延、エラー件数を集計しているため、この分類になります。回答のために渡す指示文やコード、管理者の操作を追跡する監査イベントとは、収集の目的が異なります。

Telemetryという名前だけで、コードや機密情報が含まれないと判断してはいけません。たとえば現行のOpenTelemetry監視では、管理者が内容収集を有効にするとプロンプトやツール結果等を含められます。今回の統計の識別と、個々の収集設定の確認は別の判断です。

選択肢単体の確認：選択肢の四分類はいずれも実在するデータ区分。採用・遅延・件数という本文の収集対象から分類する。
難易度：基本的なデータ区分の理解を維持。高度な監視設定の値を正解選択へ要求しない。
文字長：A=14字（中央値比0.933）、B=12字（中央値比0.8）、C=16字（中央値比1.067）、D=22字（中央値比1.467）

- [OpenTelemetry for agent monitoring](https://docs.github.com/en/copilot/concepts/enterprise/opentelemetry)

### q-d3-g09（F07）

Copilot Chatへ大量のコードや会話履歴を渡すとき、LLMが1回の要求で扱える情報量には上限があります。この上限をトークン数で表す文脈の枠を何と呼びますか？

- A / ID A［正解］：コンテキストウィンドウ（Context Window） — 一度に扱える文脈量の上限を表す。超過への対処はクライアント等によって異なる。
- B / ID B：ナレッジカットオフ（Knowledge Cutoff） — 学習済み知識の時点を表し、一度に扱える情報量の上限ではない。
- C / ID C：推論レイテンシ（Inference Latency） — 要求から応答までの時間を表し、文脈の容量ではない。
- D / ID D：サンプリング温度（Sampling Temperature） — 生成のばらつきへ影響する値であり、文脈の容量ではない。

Context Windowは、モデルが1回の要求で扱える情報量の上限に関係する枠です。ユーザーの入力だけでなく、会話履歴、指示、関連ファイルやツール結果も、この限られた容量を使います。トークン数で数える文脈の上限を問う今回の説明に対応します。

容量の上限と、上限に近づいたときの対処は別です。現行のVS Codeでは古い会話を要約して空きを作る仕組みがあり、常に古い情報がそのまま切り捨てられると決まっているわけではありません。必要な条件が残っているかを確認して作業を続けます。

選択肢単体の確認：四つの用語はそれぞれ容量、知識の時点、時間、生成分布を表す。どれを問うかは本文で決まる。
難易度：文脈容量の基本用語を識別する基礎問題を維持。
文字長：A=27字（中央値比1）、B=27字（中央値比1）、C=26字（中央値比0.963）、D=30字（中央値比1.111）

- [Understand context in AI agents](https://code.visualstudio.com/docs/agents/concepts/context)

### q-d3-g12（F08）

Copilotで使うLLMについて、学習済み知識がカバーする時点を確認しています。その時点より後のフレームワークの仕様変更は、学習済み知識だけでは正確に答えられるとは限りません。この知識の時点を表す用語はどれですか？

- A / ID A：コンテキストウィンドウ上限（Context Window Limit） — 一度に扱える文脈量の上限であり、学習済み知識の時点ではない。
- B / ID B：ハルシネーション（Hallucination） — 事実に反する内容をもっともらしく生成する現象であり、知識の時点ではない。
- C / ID C：モデルドリフト（Model Drift） — 学習時と運用時の条件の変化等に伴う性能変化であり、知識の時点ではない。
- D / ID D［正解］：ナレッジカットオフ（Knowledge Cutoff） — 学習済み知識の時点を表す。新しい仕様は必要な外部情報と照合する。

Knowledge Cutoffは、モデルの学習済み知識がカバーする時点を考えるための情報です。学習処理そのものが終わった日時や、その日以前の出来事をすべて正確に知っているという保証とは区別します。対象モデルの公式仕様で知識の時点を確認することが基本です。

それより新しいフレームワークの仕様は、学習済み知識だけで正確に答えられるとは限りません。Copilotが利用できる最新の公式資料や検索結果を文脈に加えると補える場合がありますが、回答を資料と照合する必要は残ります。知識の時点と、その場で取得する情報を分けて理解します。

選択肢単体の確認：用語の選択肢は維持し、時点・容量・誤生成・性能変化のどれを問うかを本文から判断する。
難易度：知識の時点の概念を識別する基礎問題を維持。
文字長：A=35字（中央値比1.4）、B=23字（中央値比0.92）、C=20字（中央値比0.8）、D=27字（中央値比1.08）

- [Responsible use of GitHub Copilot Chat](https://docs.github.com/en/copilot/responsible-use/chat)
- [Microsoft Learn — Model training data knowledge cutoff FAQ](https://learn.microsoft.com/en-us/azure/foundry-classic/openai/faq)

### q-sc01-1（F09）

【AnyCompany Tech事例】Copilot Businessを使うチームで、VS Codeの通常のコード補完とChatのAskモードから、指定した機密ファイルを直接の入力文脈として除外する方針です。.gitignoreとは別に、管理者が設定するCopilotの機能として最も適切なものはどれですか？

- A / ID B：.gitignoreへ機密パスを指定し、通常補完の動作を検証する — Gitの追跡対象を指定する設定で、Copilotの入力文脈の除外設定とは別である。
- B / ID C：公開コード一致をBlockにし、Chatでの参照は手動で避ける — 公開コード一致は生成後の提案を制御し、今回の入力ファイルを除外する設定ではない。
- C / ID D：Secret Scanningで機密パスを検査し、Copilotの設定は変えない — 資格情報の検出だけでは、対象ファイルをCopilotの入力文脈から外せない。
- D / ID A［正解］：対象リポジトリとパスにContent Exclusionを設定する — Content Exclusionで対象パスを指定する。適用する機能や参照経路の制約も確認する。

Content Exclusionは、管理者が指定したファイルやパスを、対応するCopilot機能の入力文脈から外す設定です。今回はVS Codeの通常補完とAskモードで、機密ファイルの直接参照を管理するため、この機能を使います。.gitignoreのGit追跡設定とは別に設定する必要があります。

この設定は、すべての参照経路を遮断する保証ではありません。Agent・Editモードの非対応や、IDE経由の型情報などの間接的な文脈にも注意します。利用する機能と参照経路を特定して、除外表示や動作を確認します。

選択肢単体の確認：各選択肢は追跡管理、出力一致、秘密検知、入力除外を扱う。本文で求める入力側の制御に照合する必要がある。
難易度：通常補完とAskを明記し、非対応モードの診断を要求する高難度問題にはしない。
文字長：A=32字（中央値比0.985）、B=31字（中央値比0.954）、C=40字（中央値比1.231）、D=33字（中央値比1.015）

- [About content exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

### q-sc08-3（F10）

【DataFlow Analytics事例】VS CodeのCopilot Chatで、DataPipeline.tsとSchemaValidator.tsの現行実装について質問します。対象はこの二つと分かっているため、ファイル名だけで自動検索に任せず、両方を文脈として明示したいと考えています。基本操作として最も適切なものはどれですか？

- A / ID B：名前だけを書き、検索結果に取得範囲を任せる — 検索へ対象の取得を任せており、二ファイルを直接添付する操作ではない。
- B / ID D：DataPipeline.tsだけを添付して質問 — 今回必要な二ファイルのうち、一方が指定されていない。
- C / ID C：二ファイルの命名規約だけを共通指示へ追加 — 命名規約の指示だけでは、今回の二ファイルの実装を文脈へ渡せない。
- D / ID A［正解］：対象二ファイルを明示的に添付して質問 — 二ファイルを直接指定できる。回答でどう使われたかは内容を照合する。

参照してほしいファイルが分かっている場合は、Add Contextやファイルのドラッグで対象を明示添付できます。今回はDataPipeline.tsとSchemaValidator.tsの両方が必要なので、二つを指定して質問します。ファイル名だけを書いて自動検索へ任せるより、参照してほしい対象を直接伝えられます。

明示添付は、全内容の利用や正しい解釈の保証ではありません。回答が二ファイルの現行実装を適切に踏まえているか、内容と参照表示を確認します。対象を指定する操作と、回答の正確さを確かめる作業を分けることが要点です。

選択肢単体の確認：二ファイル、片方だけ、規約、探索という操作の違いを本文の対象指定に当てはめる。正解だけに安全性の保証を付けない。
難易度：既知のファイルの明示添付という基礎操作を維持。
文字長：A=21字（中央値比1.024）、B=24字（中央値比1.171）、C=20字（中央値比0.976）、D=18字（中央値比0.878）

- [Add context to your prompts](https://code.visualstudio.com/docs/chat/copilot-chat-context)
- [Understand context in AI agents](https://code.visualstudio.com/docs/agents/concepts/context)

### q-d1-e08-feature-20261016（F03）

Copilot approvalsのpublic previewを利用できるrepoで、CopilotがApproveを出しました。しかし必須承認数は減りません。上位の設定は利用を許可し、人による必須承認の設定は維持します。自動レビューは既に動きます。この観測から不足する設定と、変更後も別に満たす要件はどれですか。

- A / ID B：CopilotがApproveを出せる設定だけを有効にし、人の必須承認も得る — Approveは既に出ているためその許可だけでは算入不足を直せない。
- B / ID C：Review new pushesだけを有効にし、人の必須承認も得る — レビュー起動の設定は承認の算入可否を変えない。
- C / ID A［正解］：Copilot承認を要件へ数える設定を有効にし、人の必須承認も得る — Approveの生成と承認要件への算入は別の設定である。算入を有効にしても維持するとした人の必須要件を削除しない。
- D / ID D：Copilot承認を要件へ数える設定を有効にし、人の必須承認を外す — 算入とは別に維持する人の要件を外している。

CopilotがApproveを出せることと、その承認がマージ要件へ数えられることは別の設定です。今回はApproveが実際に出ているので、承認の生成を許可する設定だけを見直しても不足は解消しません。

上位設定が許可しているという条件のもとで、Copilotの承認をマージ要件へ数える設定を有効にします。ただし、人による必須承認も維持すると明示されています。その要件まで削除せず、人のレビューは別途受ける必要があります。

このPR承認機能は2026年9月1日にPublic previewとして追加されたもので、8月7日時点の機能と区別して学習します。設定や対応範囲は変更され得るため、利用時は公式資料を確認します。

選択肢単体の確認：既存の設問・四択・正解を維持。今回の変更は解説の時点注記と日付付き公式出典のみ。
難易度：承認の生成、算入、人の必須要件を分ける既存の高難度を維持。
文字長：A=38字（中央値比1.134）、B=34字（中央値比1.015）、C=33字（中央値比0.985）、D=33字（中央値比0.985）

- [Copilot code review can now approve pull requests](https://github.blog/changelog/2026-09-01-copilot-code-review-can-now-approve-pull-requests/)
- [Configuring code review by GitHub Copilot — Auto-approval](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-d6-e02-feature-20261016（F04）

組織はCopilot code reviewと、Only allow Copilot code review to be triggered by authorized usersを有効にしています。Xは外部で取得した対応ライセンスだけを持ち、この組織が認める利用者ではありません。Xからの個別依頼と、このPRに一致する有効な組織rulesetからの自動レビューについて、起動できる経路の組合せはどれですか。

- A / ID B：Xの個人依頼もrulesetの自動レビューも動く — 外部ライセンスだけの未認可利用者の個人依頼は制限される。
- B / ID C：Xの個人依頼は動き、rulesetの自動レビューは止まる — 個人側とruleset側の適用結果を逆に扱っている。
- C / ID D：Xの個人依頼もrulesetの自動レビューも止まる — 個人側の制限をrulesetの自動レビューにも及ぼしている。
- D / ID A［正解］：Xの個人依頼は止まり、rulesetの自動レビューは動く — authorized users制限は未認可の個人依頼を止めるが、rulesetによる自動レビューは実行される。

authorized usersの制限では、個人からのレビュー依頼と、組織が設定したrulesetによる自動レビューを区別します。Xは外部ライセンスを持っていても、この組織が認める利用者ではないため、個別の依頼は制限されます。

一方、条件に一致する有効な組織rulesetは自動レビューを起動できます。個人への制限を、そのまま組織の自動起動へ広げて解釈してはいけません。したがって、Xの依頼は止まり、rulesetのレビューは動く組み合わせです。

この外部ライセンス利用者からの依頼を制限する設定は、2026年10月8日に追加された機能です。8月7日時点の仕様と混同せず、現行の追加機能として、個人の依頼と組織rulesetによる起動を分けて理解します。

選択肢単体の確認：個人依頼とrulesetの二経路の組合せを問う既存の四択を維持。本文なしでは起動可否の組合せは決まらない。
難易度：外部ライセンスの制限と起動元の適用範囲を照合する高難度を維持。
文字長：A=24字（中央値比0.906）、B=28字（中央値比1.057）、C=25字（中央値比0.943）、D=28字（中央値比1.057）

- [Copilot code review: New organization billing options and controls](https://github.blog/changelog/2026-10-08-copilot-code-review-new-organization-billing-options-and-controls/)
- [Reviews requested with an external Copilot license](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review#reviews-requested-with-an-external-copilot-license)

## 検証記録

自動テスト・画面確認の実行結果は [検証記録](official-alignment-verification-2026-10-18.md) を参照。文字数と指紋の一致だけでは、内容・難易度の正しさを認定しない。
