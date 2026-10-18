# GH-300 問題・解説と公式資料の整合性総点検

点検日：2026-10-18（日本時間）／対象シラバス：2026年8月7日適用

正解・採点を見直すべき問題が1問、選択肢別解説の誤記が1問あります。加えて、8月7日以降に追加された機能を扱う2問と、条件・断定表現を整える6問を確認しました。これらは重複しない10問です。別に既存の要レビュー1問を確認しました。残る243問では今回の照合で追加の不整合を特定していませんが、8月7日時点の全詳細仕様が証明済みという意味ではありません。

今回は監査のみです。問題文・正解・解説・status・出題比率・アプリ表示は変更していません。コミット・push・デプロイも行っていません。

## 基準と対象

基準は[Microsoft Learn GH-300 Study Guide — Skills measured as of August 7, 2026](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)です。「8月7日版のシラバスへの関連性」「現在の機能仕様との整合」「8月7日以前に存在したことの日時付き根拠」を別々に扱いました。現在のDocsを当日の固定版とみなしていません。

| 対象 | 件数 | 扱い |
|---|---:|---|
| 保存されている問題 | 459 | 全IDの現行／除外状態を確認 |
| 通常の新規演習対象 | 253 | 基礎162・応用48・高難度43を内容照合 |
| 現行だが既存の要レビュー | 1 | q11。通常出題から除外済み |
| 除外・削除済み | 205 | 状態確認のみ。本文の再監査はしていない |

現行254問の問題文、選択肢1016件、正解、保存されている短い解説、画面で使う詳細解説、全選択肢の短い正誤解説、statusと出典を確認しました。詳細解説は別ファイルの上書きを含み、元のseed.jsonだけを読んだ評価ではありません。

## 判定内訳

| 判定 | 件数 |
|---|---:|
| 追加不整合を特定せず | 243 |
| 正解・採点の不整合 | 1 |
| 解説の誤記 | 1 |
| 8月7日以降の機能 | 2 |
| 表現・条件の明確化 | 6 |
| 既存要レビュー | 1 |

## F01：レビュー深度の名称・優先順位が不整合で、採点も誤ったまま

- 分類：正解・採点の不整合／優先度：最優先
- 対象：`q-d5-e08-feature-20261016-ms-20261017`
- 対象箇所：`question`、`choices`、`answer`、`explanation`、`choiceExplanations`、`status`

Deepを有効な深度として出題し、前回LiteだったPR Pへrepoの新既定値が適用されるAを正解としている。現行仕様は前回のPR値をrepoより優先する。詳細解説は既に要レビューと警告するが、statusはverifiedで、新規演習の対象かつ「Verified · 公式準拠」と表示される。

推奨対応：採点対象から一時除外して設問から再設計する。Lite/Balancedを使い、依頼時指定・前回値・依頼者設定を明記して再採点する。問題文、正解、短い正誤解説、詳細解説、statusを同時に整合させる。

時点の注意：Deepという値は8月7日の告知とも不整合。優先順位の厳密な8月7日版は未復元であり、現在の順序を当日仕様として断定しない。

根拠：[Copilot code review — Review effort level](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review#review-effort-level)、[Copilot code review effort levels are generally available](https://github.blog/changelog/2026-08-07-copilot-code-review-effort-levels-are-generally-available/)

## F02：約150文字の周辺コードを「150文字以上の一致閾値」と誤説明

- 分類：解説の誤記／優先度：高
- 対象：`q-d3-g14`
- 対象箇所：`choiceExplanations.A`

誤答Aの解説に「GitHub上の公開コードと150文字以上一致する提案を検知・抑止」とある。公式の約150文字は候補周辺の照合文脈であり、150文字未満なら一致しないという固定閾値ではない。正解Bと詳細解説の主旨自体は維持できる。

推奨対応：「候補と周辺コードを公開コードと照合し、ポリシーに応じて一致・近似一致の提案を抑制する」へ訂正する。数値を一致の最低文字数として暗記させない。

根拠：[Managing GitHub Copilot policies as an individual subscriber](https://docs.github.com/en/copilot/how-tos/manage-your-account/manage-policies)

## F03：CopilotによるPR承認は9月1日追加

- 分類：8月7日以降の機能／優先度：中
- 対象：`q-d1-e08-feature-20261016`
- 対象箇所：`question`、`explanation`、`displayExplanation`

Copilotが承認を生成できる設定とマージ要件への算入を分ける現行の機能を扱っている。8月7日時点の機能としては扱えない。

推奨対応：8月7日の時点教材を厳密に作るなら通常枠から分ける。現行仕様も学ぶ教材なら「9月1日追加・Preview」と時点を明記する。シラバスの8月7日という日付だけを根拠に、実試験に絶対出ないとは判断しない。

根拠：[Copilot code review can now approve pull requests](https://github.blog/changelog/2026-09-01-copilot-code-review-can-now-approve-pull-requests/)、[Configuring code review by GitHub Copilot — Auto-approval](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

## F04：外部ライセンスからのレビュー依頼制限は10月8日追加

- 分類：8月7日以降の機能／優先度：中
- 対象：`q-d6-e02-feature-20261016`
- 対象箇所：`question`、`explanation`、`displayExplanation`

authorized usersの制限とruleset自動レビューの例外という現在の仕様を扱う。日付付きChangelogでは8月7日より後に追加された設定である。

推奨対応：現行の追加機能として時点を表示するか、8月7日時点の厳密な問題群から分ける。現在の正解を誤りとして反転しない。

根拠：[Copilot code review: New organization billing options and controls](https://github.blog/changelog/2026-10-08-copilot-code-review-new-organization-billing-options-and-controls/)、[Reviews requested with an external Copilot license](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review#reviews-requested-with-an-external-copilot-license)

## F05：パス別指示のファイル名要件が短い解説で省略

- 分類：表現・条件の明確化／優先度：中
- 対象：`q-d2-g15`
- 対象箇所：`explanation`、`choiceExplanations.A`

例が.github/instructions/*.mdとなっており、任意のMarkdownファイルで自動認識されるように読める。詳細解説はapplyToに触れるが、必要な.instructions.md拡張子を補っていない。

推奨対応：例を.github/instructions/NAME.instructions.mdへ具体化し、applyToを併記する。正解であるパス別指示という概念は変えない。

根拠：[Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)

## F06：Telemetry全般についてコードとの厳格な分離を一般化

- 分類：表現・条件の明確化／優先度：中
- 対象：`q-d3-g04`
- 対象箇所：`question`、`explanation`、`choiceExplanations.A`、`choiceExplanations.D`

利用イベントの統計という正解分類は妥当だが、「ソースコードとは厳格に区別」「顧客コード本体とは明確に分離」と広く断定する。現行のOpenTelemetryでは設定により内容も収集できる。詳細解説の注意書きだけでは前段の一般化が残る。Prompt Contentをコードそのものだけとする誤答解説も狭すぎる。

推奨対応：「この問題で扱う受容率・遅延等の統計」と対象を限定する。テレメトリーという名前だけで機密情報の不在を判断しない。Prompt Contentは指示文や文脈も含むとする。

時点の注意：現在の監視機能を8月7日時点にも存在したと断定する指摘ではない。現行教材の普遍的な定義を限定する必要がある。

根拠：[OpenTelemetry for agent monitoring](https://docs.github.com/en/copilot/concepts/enterprise/opentelemetry)

## F07：文脈上限と製品の圧縮・切捨て動作を同一視

- 分類：表現・条件の明確化／優先度：中
- 対象：`q-d3-g09`
- 対象箇所：`question`、`explanation`、`choiceExplanations.A`

Context Windowという正解は妥当。超過すれば古い／優先度の低い文脈が必ず切り捨てられるという説明は、モデルの容量とアプリの対処方法を混ぜている。現行VS Codeは要約による圧縮も行う。

推奨対応：「一度に処理できる情報量の上限」と定義し、要約・省略・エラー等はクライアントや設定による別の動作と説明する。

根拠：[Understand context in AI agents](https://code.visualstudio.com/docs/agents/concepts/context)

## F08：知識の時点を事前学習の終了日・完全な未知と断定

- 分類：表現・条件の明確化／優先度：低
- 対象：`q-d3-g12`
- 対象箇所：`question`、`explanation`、`choiceExplanations.D`

Knowledge Cutoffという正解は妥当だが、学習ジョブの終了日と知識範囲の時点を同一視し、それ以降の知識を持たないと一律に説明する。現在の詳細解説は正確に答えられるとは限らないという適切な表現になっており、短い解説と強さが違う。

推奨対応：「学習済み知識がカバーする時点の目安」「以降の変更は学習済み知識だけでは確実に答えられない」へ統一する。モデル別の公式条件や必要な外部文脈を確認する。

根拠：[Responsible use of GitHub Copilot Chat](https://docs.github.com/en/copilot/responsible-use/chat)、[Microsoft Learn — Model training data knowledge cutoff FAQ](https://learn.microsoft.com/en-us/azure/foundry-classic/openai/faq)

## F09：Content Exclusionで「確実に除外」とする問題文

- 分類：表現・条件の明確化／優先度：中
- 対象：`q-sc01-1`
- 対象箇所：`question`

除外機能を選ぶ正解自体は妥当。ただしChatの種類・モード・参照経路を特定しないまま確実な除外を要求しており、詳細解説にある対応範囲の制約を問題文から読み取れない。

推奨対応：対応する通常補完やChat、直接の入力文脈という対象を明記する。「確実に」を全経路の遮断保証として使わない。

根拠：[About content exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

## F10：明示添付を「確実に参照」の保証として読ませる

- 分類：表現・条件の明確化／優先度：中
- 対象：`q-sc08-3`
- 対象箇所：`question`

既知の二ファイルを添付する正解自体は妥当。問題文の「現行実装を確実に参照させた上で」は、全内容の利用や正しい理解まで保証する印象がある。詳細解説には保証でない旨があるが、問題文は断定が残る。

推奨対応：「対象二ファイルを文脈として明示的に指定する」へ改め、回答での利用状況と内容の照合は別に必要とする。

根拠：[Add context to your prompts](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[Understand context in AI agents](https://code.visualstudio.com/docs/agents/concepts/context)

## F11：既存の要レビュー問題は通常出題から外れている

- 分類：既存要レビュー／優先度：低
- 対象：`q11`
- 対象箇所：`status`

利用モードごとのContent Exclusion対応を調べる正解に、新たな仕様矛盾は確認しなかった。既存statusはneeds-reviewで、通常のverified選択対象から外れている。F01の詳細解説内の要レビュー警告とは異なる状態。

推奨対応：対象IDEとモードを特定して最終確認するまで既存の除外を維持する。今回の監査だけでstatusを自動更新しない。

根拠：[About content exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

## 時点を取り違えていないかの追加確認

- `q-d2-e11-feature-20261016-ms-20261017`、`q-d5-e05-feature-20261016-ms-20261017`：head branchの指示参照とレビュー専用workflowは8月7日以前に告知済み。 [Copilot code review customization and configurability improvements](https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/)
- `q-sc02-1-feature-20261016`、`q-d5-a14-feature-20261016`：Fix with Copilotと別PRによる修正確認は8月7日以前に告知済み。 [Easily apply Copilot code review feedback with Copilot cloud agent](https://github.blog/changelog/2026-05-19-easily-apply-copilot-code-review-feedback-with-copilot-cloud-agent/)
- `q-d1-a10-feature-20261016`：CLI Autopilotの存在は8月7日以前に確認。全フラグの履歴同一性は未証明。 [GitHub Copilot CLI is now generally available](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)
- `q-sc05-1-feature-20261016`、`q-d5-e01-feature-20261016`：Agents windowの存在は8月7日以前に確認。現在のUI細部の履歴同一性は未証明。 [Visual Studio Code 1.120 release notes](https://code.visualstudio.com/updates/v1_120)
- `q-fnd-plan-20261017`、`q-d1-a04-feature-20261016`、`q-d1-e07-feature-20261016`、`q-d5-e02-feature-20261016`、`q-d2-a26-feature-20261016`：Planと承認段階を分ける仕組みは8月7日以前のリリースに記述がある。現行の設定名全体の履歴同一性は未証明。 [Visual Studio Code 1.106 release notes](https://code.visualstudio.com/updates/v1_106)

レビューの組み込み既定値は9月28日に変更されています。現在のBalancedを8月7日の既定値として説明しないよう注意が必要です。ただし、問題で明示されたrepo設定のBalancedまで誤りになるわけではありません。[Upcoming changes to GitHub Copilot policies and billing](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/)

次の2問は現行Docsと整合しますが、細かな挙動を8月7日以前の資料で確定できていません。誤りと断定した件数には含めません。ほかの設問についても、日付付き根拠のない詳細を当日仕様として保証していません。

- `q-d1-a11-feature-20261016-ms-20261017`：従量制接続で自動ghost text/NESを抑止し、明示要求を許す現行Docsは確認。8月7日以前にこの挙動があったと示す日付付き資料は未確認。
- `q-d3-e02-feature-20261016`：外部repo索引の対応hostとUnconfigured時の動作は現行Docsと一致。8月7日版の同じポリシーを日付付き資料で確定できていない。

## 旧機能についての確認

Knowledge Bases、旧gh-copilot、GitHub App型Copilot Extensions、Sparkを扱う現行6問は、旧機能・終了・移行の注記として出題されています。旧機能を現在の標準操作として復活させる必要はありません。Knowledge BasesはSpacesへの移行として維持します。Sparkはシラバスに名前が残っていても、終了告知を無視して現行の新規作成機能として説明しません。

- `q-d2-g05`：[Upcoming deprecation of gh-copilot CLI extension](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)
- `q-d2-g06`：[Upcoming deprecation of gh-copilot CLI extension](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)
- `q-d2-g07`：[Upcoming deprecation of gh-copilot CLI extension](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)
- `q-d2-g16`：[Upcoming deprecation of GitHub Spark on github.com](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/)
- `q-d2-g17`：[Sunset notice: GitHub App-based Copilot Extensions](https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps/)
- `q-d2-g22`：[Sunset notice: Copilot knowledge bases](https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/)

## シラバスとの関係と問題の配分

6ドメイン・14学習目標すべてに現行の出題があります。ただし、目標IDがあることは各小項目の十分な出題や実試験と同じ構成を証明しません。問題バンクの比率はD1が少なくD2が多い状態です。重み付き出題で調整する構成と、バンク自体の配分は分けて評価します。今回、増問・削除・分類変更は行っていません。

| ドメイン | 通常出題対象 | バンク内の割合 | 公式の目安 |
|---|---:|---:|---:|
| D1 責任あるAIの利用 | 24 | 9.49% | 15〜20% |
| D2 Copilotの機能を使いこなす | 98 | 38.74% | 25〜30% |
| D3 データとアーキテクチャ | 33 | 13.04% | 10〜15% |
| D4 プロンプトとコンテキスト | 35 | 13.83% | 10〜15% |
| D5 開発生産性を高める | 32 | 12.65% | 10〜15% |
| D6 プライバシーと保護 | 31 | 12.25% | 10〜15% |

一般のテスト・品質・実装用語を尋ねる問題も残っています。以下10問は関連する補助知識として整理しました。公式ガイドの開発生産性・テスト・品質等には関係しますが、Copilot固有機能の理解を直接測る度合いは低めです。「公式仕様に反する問題」の件数とは分けています。Copilot機能だけを問う方針を厳格に適用するなら、次の編集対象です。

- `q02`：請求額計算の月末日や丸め規則が仕様どおりに実装されているかを検証したいと考えています。この検証において、直接確認すべき根拠として最も適切なものはどれですか？
- `q-d5-f05`：単体テストにおいて外部HTTP通信をモックに置き換えて固定レスポンスを返させ、同時にリクエストの宛先URLや送信本文が正しいかを検証したいと考えています。最も適切なテスト実装の組み合わせはどれですか？
- `q-d5-g05`：時間計算量や空間計算量（Big-O）を改善するために、二重ループの解消や適切なデータ構造の選択を行い、処理効率を引き上げる実装改善手法として、最も適切なものはどれですか？
- `q-d5-g10`：プロファイリング結果や負荷条件を提示し、メモリリーク、不要な同期I/O、非効率な反復処理などシステムの性能低下を引き起こしている原因箇所を特定する作業として、最も適切なものはどれですか？
- `q-d5-g13`：生成テストの入力とモックを用意し、対象関数を呼び、その戻り値を期待値と比較している。コードをこの三段階に整理するテスト構造パターンとして、最も適切なものはどれですか？
- `q-d5-g14`：単に動作するだけでなく、信頼性、保守性、セキュリティ、処理効率、可読性など、ソフトウェアの価値を多面的に評価する非機能・品質特性の総称として、最も適切なものはどれですか？
- `q-d5-g15`：システムや関数が、想定される運用環境と指定された時間枠において、障害や異常停止を起こさず継続的に正しく動作し続ける能力を表す品質特性として、最も適切なものはどれですか？
- `q-d5-g16`：例外を包括的に握り潰したり内部スタックトレースを露出させたりせず、具体的な例外型を捕捉して安全に回復・フォールバックさせる実装パターンとして、最も適切なものはどれですか？
- `q-d5-g17`：テストの期待値検証（Assertion）とは異なり、関数やAPIの境界で引数や外部データが前提条件（型・範囲・フォーマット）を満たしているかを検証する本番コードの実装プラクティスとして、最も適切なものはどれですか？
- `q-d5-g18`：コードコメントや関数のJSDocとは異なり、システム全体の目的、アーキテクチャ設計、前提要件、セットアップ手順などを開発者向けに体系化した設計文書群として、最も適切なものはどれですか？

## 出典と検証の限界

- 8月7日はシラバス適用日であり、公式Docsのすべての機能詳細をその日に固定した版ではない。
- 日付付き証拠を付けた機能以外の8月7日時点の全仕様は復元していない。未証明を合格と扱わない。
- 通常出題253問と既存needs-review 1問を内容照合。除外・削除済み205問は新規出題対象外であることの確認のみで、本文の再監査は対象外。保存済み履歴のスナップショットはこの点検とは別。
- 教材本文・用語集全体の改訂、難易度・ブラインドチェックの再評価、実試験と同一であることの証明は行っていない。
- 83件のHTTP 200は取得できたことだけを意味する。元の広い出典が個々の主張をすべて直接証明するという意味ではない。
- 追加された現行機能を、8月7日以降というだけで実試験の範囲外・出題されないと断言しない。

既存の83出典は取得できました。取得時のURL・HTTP結果・HTMLハッシュをJSONに記録し、出典ごとの内容確認メモも紐づけています。個別の指摘には追加の直接資料と日付付き告知を付けています。HTTP取得の成功を、全設問の内容や歴史的正確性の自動合格に置き換えてはいません。

## 修正の順番

1. F01を通常出題から外し、正解と設問から見直す。詳細解説だけの警告では誤採点が残る。
2. F02の150文字の誤記を直す。
3. F05〜F10の6問で、問題文・短い解説・詳細解説の断定の強さをそろえる。
4. F03・F04は、8月7日時点のみの教材にするか、現行追加機能も含む教材にするかに応じて分離・時点注記する。誤答として反転しない。
5. 修正後に変更された全項目の根拠、採点、通常出題可否、画面表示を再確認する。

## 現行254問の点検台帳

以下の「追加不整合を特定せず」は、今回の内容照合で新しい問題を見つけなかったという結果です。8月7日時点の詳細仕様をすべて復元できたという合格表示ではありません。全選択肢・各解説・ハッシュ・出典別メモ・日時付き根拠の有無は同名JSONに保存しています。

| 問題ID | 難易度 | 登録目標 | 判定／指摘 |
|---|---|---|---|
| q02 | 基礎 | d1o2 | 追加不整合を特定せず |
| q03 | 基礎 | d2o1 | 追加不整合を特定せず |
| q04 | 基礎 | d2o3 | 追加不整合を特定せず |
| q05 | 基礎 | d4o1 | 追加不整合を特定せず |
| q06 | 基礎 | d1o2 | 追加不整合を特定せず |
| q08 | 基礎 | d4o2 | 追加不整合を特定せず |
| q09 | 基礎 | d5o2 | 追加不整合を特定せず |
| q11 | 基礎 | d6o2 | 既存要レビュー（F11） |
| q12 | 基礎 | d6o2 | 追加不整合を特定せず |
| q-d1-f01 | 基礎 | d1o1 | 追加不整合を特定せず |
| q-d1-f02 | 基礎 | d1o1 | 追加不整合を特定せず |
| q-d1-f04 | 基礎 | d1o1 | 追加不整合を特定せず |
| q-d1-f05 | 基礎 | d1o2 | 追加不整合を特定せず |
| q-d1-a05 | 基礎 | d6o1 | 追加不整合を特定せず |
| q-d1-a06 | 基礎 | d1o2 | 追加不整合を特定せず |
| q-d2-f01 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-f02 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-f03 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-f04 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-f06 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-f07 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-f08 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-f09 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-f10 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-f11 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-d2-a08 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-a14 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-e17 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d3-f01 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-f02 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-f05 | 基礎 | d3o2 | 追加不整合を特定せず |
| q-d4-f01 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-f02 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-f04 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d5-f01 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d5-f02 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-f04 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d5-f05 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d6-f01 | 基礎 | d6o2 | 追加不整合を特定せず |
| q-d6-f02 | 基礎 | d6o1 | 追加不整合を特定せず |
| q-d6-f03 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d6-f04 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d6-f05 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d6-a01 | 応用 | d6o1 | 追加不整合を特定せず |
| q-d6-a04 | 基礎 | d6o2 | 追加不整合を特定せず |
| q-d6-a05 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d6-a06 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d6-e01 | 高難度 | d6o2 | 追加不整合を特定せず |
| q-sc01-1 | 基礎 | d6o1 | 表現・条件の明確化（F09） |
| q-sc01-2 | 応用 | d6o2 | 追加不整合を特定せず |
| q-sc04-1 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-sc06-3 | 応用 | d2o3 | 追加不整合を特定せず |
| q-sc07-3 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-sc08-3 | 基礎 | d2o1 | 表現・条件の明確化（F10） |
| q-sc09-2 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-sc10-1 | 基礎 | d6o2 | 追加不整合を特定せず |
| q-sc10-2 | 基礎 | d6o2 | 追加不整合を特定せず |
| q-d1-g01 | 基礎 | d1o1 | 追加不整合を特定せず |
| q-d1-g02 | 基礎 | d1o1 | 追加不整合を特定せず |
| q-d1-g03 | 基礎 | d1o1 | 追加不整合を特定せず |
| q-d1-g04 | 基礎 | d3o2 | 追加不整合を特定せず |
| q-d1-g05 | 基礎 | d1o1 | 追加不整合を特定せず |
| q-d1-g06 | 基礎 | d1o2 | 追加不整合を特定せず |
| q-d2-g01 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-g02 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-g03 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-g04 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-g05 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-d2-g06 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-d2-g07 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-d2-g08 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-d2-g09 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-d2-g10 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-g11 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-g12 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-g13 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-g14 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-g15 | 基礎 | d2o3 | 表現・条件の明確化（F05） |
| q-d2-g16 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-g17 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-g18 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d2-g19 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d2-g20 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d2-g21 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d2-g22 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d3-g01 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-g02 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-g03 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-g04 | 基礎 | d3o1 | 表現・条件の明確化（F06） |
| q-d3-g05 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-g06 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-g07 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-g08 | 基礎 | d3o2 | 追加不整合を特定せず |
| q-d3-g09 | 基礎 | d3o2 | 表現・条件の明確化（F07） |
| q-d3-g10 | 基礎 | d3o2 | 追加不整合を特定せず |
| q-d3-g11 | 基礎 | d3o2 | 追加不整合を特定せず |
| q-d3-g12 | 基礎 | d3o2 | 表現・条件の明確化（F08） |
| q-d3-g13 | 基礎 | d3o2 | 追加不整合を特定せず |
| q-d3-g14 | 基礎 | d3o1 | 解説の誤記（F02） |
| q-d4-g01 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-g02 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-g03 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-g04 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-g05 | 基礎 | d4o2 | 追加不整合を特定せず |
| q-d4-g06 | 基礎 | d4o2 | 追加不整合を特定せず |
| q-d4-g07 | 基礎 | d4o2 | 追加不整合を特定せず |
| q-d4-g08 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-g09 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d5-g01 | 基礎 | d5o1 | 追加不整合を特定せず |
| q-d5-g02 | 基礎 | d5o1 | 追加不整合を特定せず |
| q-d5-g03 | 基礎 | d5o1 | 追加不整合を特定せず |
| q-d5-g04 | 基礎 | d5o1 | 追加不整合を特定せず |
| q-d5-g05 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g06 | 基礎 | d5o1 | 追加不整合を特定せず |
| q-d5-g07 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g08 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g09 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g10 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g11 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g12 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g13 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g14 | 基礎 | d5o1 | 追加不整合を特定せず |
| q-d5-g15 | 基礎 | d5o1 | 追加不整合を特定せず |
| q-d5-g16 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g17 | 基礎 | d5o2 | 追加不整合を特定せず |
| q-d5-g18 | 基礎 | d5o1 | 追加不整合を特定せず |
| q-d6-g01 | 基礎 | d6o1 | 追加不整合を特定せず |
| q-d6-g02 | 基礎 | d6o1 | 追加不整合を特定せず |
| q-d6-g03 | 基礎 | d6o1 | 追加不整合を特定せず |
| q-d6-g04 | 基礎 | d6o2 | 追加不整合を特定せず |
| q-d6-g05 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-d6-a11 | 応用 | d6o1 | 追加不整合を特定せず |
| q-d2-e24 | 高難度 | d2o3 | 追加不整合を特定せず |
| q-d3-a19-feature-20261016 | 応用 | d3o1 | 追加不整合を特定せず |
| q-d6-e03-feature-20261016 | 高難度 | d6o2 | 追加不整合を特定せず |
| q01-feature-20261016 | 応用 | d1o2 | 追加不整合を特定せず |
| q-d1-a04-feature-20261016 | 応用 | d1o2 | 追加不整合を特定せず |
| q-d1-a07-feature-20261016 | 応用 | d1o2 | 追加不整合を特定せず |
| q-d1-a10-feature-20261016 | 応用 | d2o2 | 追加不整合を特定せず |
| q-d2-a04-feature-20261016 | 応用 | d2o2 | 追加不整合を特定せず |
| q-sc05-1-feature-20261016 | 応用 | d3o1 | 追加不整合を特定せず |
| q-d2-a26-feature-20261016 | 応用 | d1o2 | 追加不整合を特定せず |
| q-d1-a16-feature-20261016 | 応用 | d1o2 | 追加不整合を特定せず |
| q-d1-a17-feature-20261016 | 応用 | d4o1 | 追加不整合を特定せず |
| q-d1-a18-feature-20261016 | 応用 | d5o2 | 追加不整合を特定せず |
| q-d1-a19-feature-20261016 | 応用 | d1o2 | 追加不整合を特定せず |
| q-d1-a21-feature-20261016 | 応用 | d6o1 | 追加不整合を特定せず |
| q-d1-e01-feature-20261016 | 高難度 | d1o2 | 追加不整合を特定せず |
| q-d1-e02-feature-20261016 | 高難度 | d6o2 | 追加不整合を特定せず |
| q-d1-e07-feature-20261016 | 高難度 | d1o2 | 追加不整合を特定せず |
| q-d1-e08-feature-20261016 | 高難度 | d1o2 | 8月7日以降の機能（F03） |
| q-d5-e02-feature-20261016 | 高難度 | d1o2 | 追加不整合を特定せず |
| q-sc02-2-feature-20261016 | 高難度 | d2o3 | 追加不整合を特定せず |
| q-d1-e09-feature-20261016 | 高難度 | d6o2 | 追加不整合を特定せず |
| q-d2-e02-feature-20261016 | 高難度 | d2o3 | 追加不整合を特定せず |
| q-d2-e15-feature-20261016 | 応用 | d2o3 | 追加不整合を特定せず |
| q-d2-e19-feature-20261016 | 高難度 | d2o3 | 追加不整合を特定せず |
| q-d6-e02-feature-20261016 | 高難度 | d2o4 | 8月7日以降の機能（F04） |
| q-sc03-1-feature-20261016 | 応用 | d2o2 | 追加不整合を特定せず |
| q-sc03-2-feature-20261016 | 高難度 | d2o1 | 追加不整合を特定せず |
| q-sc07-1-feature-20261016 | 応用 | d2o2 | 追加不整合を特定せず |
| q-d3-a03-feature-20261016 | 応用 | d3o1 | 追加不整合を特定せず |
| q-d3-e02-feature-20261016 | 高難度 | d3o1 | 追加不整合を特定せず |
| q-sc08-2-feature-20261016 | 高難度 | d3o1 | 追加不整合を特定せず |
| q-d3-e07-feature-20261016 | 高難度 | d3o1 | 追加不整合を特定せず |
| q-d3-a16-feature-20261016 | 応用 | d3o1 | 追加不整合を特定せず |
| q-d3-a06-feature-20261016 | 応用 | d4o2 | 追加不整合を特定せず |
| q-d3-a07-feature-20261016 | 応用 | d4o2 | 追加不整合を特定せず |
| q-d4-a01-feature-20261016 | 応用 | d4o2 | 追加不整合を特定せず |
| q-d4-a02-feature-20261016 | 応用 | d3o1 | 追加不整合を特定せず |
| q-d4-e05-feature-20261016 | 高難度 | d4o2 | 追加不整合を特定せず |
| q-sc02-3-feature-20261016 | 応用 | d4o2 | 追加不整合を特定せず |
| q-d3-a14-feature-20261016 | 応用 | d4o1 | 追加不整合を特定せず |
| q-d4-e07-feature-20261016 | 高難度 | d4o2 | 追加不整合を特定せず |
| q-d4-e08-feature-20261016 | 高難度 | d4o2 | 追加不整合を特定せず |
| q-d2-e01-feature-20261016 | 高難度 | d5o2 | 追加不整合を特定せず |
| q-d2-e07-feature-20261016 | 高難度 | d5o2 | 追加不整合を特定せず |
| q-d4-e01-feature-20261016 | 高難度 | d5o1 | 追加不整合を特定せず |
| q-d5-a09-feature-20261016 | 応用 | d5o1 | 追加不整合を特定せず |
| q-d5-e01-feature-20261016 | 高難度 | d5o2 | 追加不整合を特定せず |
| q-sc02-1-feature-20261016 | 高難度 | d5o2 | 追加不整合を特定せず |
| q-d4-a14-feature-20261016 | 応用 | d2o3 | 追加不整合を特定せず |
| q-d5-a14-feature-20261016 | 応用 | d5o2 | 追加不整合を特定せず |
| q-d3-e08-feature-20261016 | 高難度 | d3o1 | 追加不整合を特定せず |
| q-d5-e06-feature-20261016 | 高難度 | d2o3 | 追加不整合を特定せず |
| q-d1-e04-feature-20261016 | 応用 | d6o1 | 追加不整合を特定せず |
| q-sc05-3-feature-20261016 | 応用 | d6o1 | 追加不整合を特定せず |
| q-sc10-3-feature-20261016 | 高難度 | d6o1 | 追加不整合を特定せず |
| q-d6-a13-feature-20261016 | 応用 | d6o1 | 追加不整合を特定せず |
| q-d6-e07-feature-20261016 | 高難度 | d6o2 | 追加不整合を特定せず |
| q-fnd-cli-install-20261017 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-fnd-cli-login-20261017 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-fnd-cli-create-file-20261017 | 基礎 | d2o2 | 追加不整合を特定せず |
| q-fnd-seat-api-20261017 | 基礎 | d2o4 | 追加不整合を特定せず |
| q-fnd-cloud-issue-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-fnd-plan-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-fnd-nes-20261017 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-fnd-ide-matrix-20261017 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-fnd-ide-signin-20261017 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-fnd-mobile-file-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d1-f03-ms-20261017 | 基礎 | d1o2 | 追加不整合を特定せず |
| q-d2-f05-ms-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-a03-ms-20261017 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-a09-ms-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-a11-ms-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-a12-ms-20261017 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-a13-ms-20261017 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-a17-ms-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d2-a19-ms-20261017 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d2-a21-ms-20261017 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d2-e04-ms-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-d3-f03-ms-20261017 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-f04-ms-20261017 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d3-a02-ms-20261017 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d3-a04-ms-20261017 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d3-e05-ms-20261017 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-f03-ms-20261017 | 基礎 | d4o2 | 追加不整合を特定せず |
| q-d4-f05-ms-20261017 | 基礎 | d4o2 | 追加不整合を特定せず |
| q-d4-a08-ms-20261017 | 基礎 | d4o1 | 追加不整合を特定せず |
| q-d4-e02-ms-20261017 | 基礎 | d4o2 | 追加不整合を特定せず |
| q-d5-f02-b-ms-20261017 | 基礎 | d2o1 | 追加不整合を特定せず |
| q-d6-a02-ms-20261017 | 基礎 | d6o2 | 追加不整合を特定せず |
| q-d6-a07-ms-20261017 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-sc04-2-ms-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-sc06-1-ms-20261017 | 基礎 | d2o3 | 追加不整合を特定せず |
| q-sc08-1-ms-20261017 | 基礎 | d3o1 | 追加不整合を特定せず |
| q-d2-a24-ms-20261017 | 応用 | d2o3 | 追加不整合を特定せず |
| q-d3-a17-ms-20261017 | 応用 | d3o1 | 追加不整合を特定せず |
| q-d6-a09-ms-20261017 | 応用 | d2o4 | 追加不整合を特定せず |
| q-d3-a13-ms-20261017 | 応用 | d2o4 | 追加不整合を特定せず |
| q-d6-a03-feature-20261016-ms-20261017 | 応用 | d6o2 | 追加不整合を特定せず |
| q-d1-a11-feature-20261016-ms-20261017 | 応用 | d6o2 | 追加不整合を特定せず |
| q-d5-e04-feature-20261016-ms-20261017 | 応用 | d5o1 | 追加不整合を特定せず |
| q-d2-a20-ms-20261017 | 応用 | d2o3 | 追加不整合を特定せず |
| q-d2-e08-ms-20261017 | 応用 | d2o3 | 追加不整合を特定せず |
| q-d2-a23-ms-20261017 | 応用 | d2o3 | 追加不整合を特定せず |
| q-d2-a25-ms-20261017 | 応用 | d2o2 | 追加不整合を特定せず |
| q-d5-a15-feature-20261016-ms-20261017 | 応用 | d6o1 | 追加不整合を特定せず |
| q-sc03-3-feature-20261016-ms-20261017 | 応用 | d4o2 | 追加不整合を特定せず |
| q-d2-a18-feature-20261016-ms-20261017 | 応用 | d2o2 | 追加不整合を特定せず |
| q-d5-e08-feature-20261016-ms-20261017 | 高難度 | d2o3 | 正解・採点の不整合（F01） |
| q-d3-e04-ms-20261017 | 高難度 | d6o2 | 追加不整合を特定せず |
| q-d2-e21-ms-20261017 | 高難度 | d2o3 | 追加不整合を特定せず |
| q-d6-e06-ms-20261017 | 高難度 | d2o4 | 追加不整合を特定せず |
| q-d2-e11-feature-20261016-ms-20261017 | 高難度 | d2o3 | 追加不整合を特定せず |
| q-d1-e03-feature-20261016-ms-20261017 | 高難度 | d1o2 | 追加不整合を特定せず |
| q-d5-e07-feature-20261016-ms-20261017 | 高難度 | d2o2 | 追加不整合を特定せず |
| q-d2-e06-ms-20261017 | 高難度 | d2o2 | 追加不整合を特定せず |
| q-d4-e04-feature-20261016-ms-20261017 | 高難度 | d4o2 | 追加不整合を特定せず |
| q-d4-e09-feature-20261016-ms-20261017 | 高難度 | d4o2 | 追加不整合を特定せず |
| q-d4-e06-feature-20261016-ms-20261017 | 高難度 | d4o2 | 追加不整合を特定せず |
| q-d5-e03-feature-20261016-ms-20261017 | 高難度 | d5o2 | 追加不整合を特定せず |
| q-d5-e05-feature-20261016-ms-20261017 | 高難度 | d5o2 | 追加不整合を特定せず |
| q-d6-e04-feature-20261016-ms-20261017 | 高難度 | d6o1 | 追加不整合を特定せず |
