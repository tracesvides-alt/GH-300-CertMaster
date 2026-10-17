# 正解解説253問の詳細化

確認日：2026-10-17

編集者が各問の本文・正答・選択肢解説を照合し、機能の意味、条件への当てはめ、結論を個別に執筆。文字数や定型句の自動追加による品質認定ではない。仕様依存事項を公式Docsで確認。学習者による理解度の実測は未実施。

## 対象と変更

基礎162問・応用48問・高難度43問。先行6問は各難易度の単一選択・複数選択から選定。

Why this is correctは、機能の仕組み、今回の条件の意味、結論を説明する。選択肢別の短い解説は維持し、Key Cluesは復活させない。

## 文字数の変化

| 難易度 | 問題数 | 修正前の中央値 | 修正後の中央値 |
|---|---:|---:|---:|
| 基礎 | 162 | 45 | 135 |
| 応用 | 48 | 49 | 190 |
| 高難度 | 43 | 59 | 232 |

文字数は結果の記録であり、品質の合否基準ではない。

## 問題自体の見直しが必要な項目

- **q-d5-e08-feature-20261016-ms-20261017**：現行公式Docsでは、PRで過去に使用したreview effortがrepo既定値より優先する。またDeepという深度名は現行の設定と一致しない。既存の正答と現行仕様に不整合がある。 問題文・正解は今回の範囲外として変更せず、詳細解説には不整合と現行の優先規則を明記。問題自体の修正が必要。全253問を仕様検証済みとは認定しない。
  - [公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

## 保存・適用方法

過去の採点・品質台帳を保持するため、詳細解説を別の版付き教材として保存。画面のWhy this is correctだけで利用し、設問内容と選択肢が一致する場合に適用する。旧スナップショットへ異なる設問の解説を付けない。

## 公式資料での照合

詳細化で使う仕様依存事項の主な照合記録。登録された全URLの到達性・更新日を独立監査する処理ではなく、全253問の事実認定でもない。既存のsourceIdsや最終検証日は変更しない。

- 生成結果には誤りや危険なコードがあり得る。人による評価・検証と採用判断を説明する。
  - [公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
  - [公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- 目的・具体例・関連コード・制約を示す。無関係な履歴を避け、結果を見て依頼を改善する。
  - [公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- 生成したテストは対象と期待結果を確認し、実行・修正して利用する。
  - [公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)
- 選んだ資料を共有文脈として整理する。GitHubの資料は更新に追従する。Spaceと元資料の権限を混同しない。
  - [公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)
- MCPのデータ源・ツール連携と、参照資料のResources、引数付き操作のToolsを区別する。
  - [公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
  - [公式資料](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
  - [公式資料](https://modelcontextprotocol.io/specification/2025-06-18/server/resources)
- stdioのcommandとargs、入力変数、password指定、envへの参照を確認。クライアントごとの設定形式にも注意する。
  - [公式資料](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
- 通常補完とcode reviewの除外、Agent/Edit非対応、symlinkと間接的な型情報の制約を区別する。repo管理と組織の管理Seat向けの範囲も異なる。
  - [公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
- リポジトリURLの照合、ユーザー・ポートの正規化、大文字小文字を区別しないパターン、Git内外の全階層の.env指定を確認。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- 採用した提案の一致参照を確認する。参照は安全性や権利処理全般の証明ではない。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)
- cloud agentの変更先repoとMCP参照範囲は別。公開コード索引の反映時点と対象範囲にも限界がある。
  - [公式資料](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)
- rulesetと個人設定は独立した起動元。draft、追加push、Approveの生成と要件への算入は別の項目。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)
- review effortは明示依頼、前回PRで使った値、依頼者、repo、組織等の順。既存のDeep問題は名称と優先関係が不整合。
  - [公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- 再レビューとFix with Copilotを区別。カスタム指示はhead branchから取得。レビュー専用workflowで環境準備を分けられる。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)
- 書込権限のある依頼者と、PR承認の制約を区別。ワークフロー実行承認と依頼者によるPR承認は同じではない。
  - [公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations)
- 専用job名とdefault branch配置が必要。途中失敗で後続stepが飛ばされ、準備途中でもAgentが作業開始する場合がある。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- 組み込みfirewallの対象経路を確認し、setupやMCPの成功をAgentのBash通信へ外挿しない。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)
- 共通指示とパス別指示、applyTo、excludeAgentを確認。参照表示と実際の遵守を分ける。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
  - [公式資料](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- name、agent、tools、model、argument-hintと本文の入力指定を区別。個人用ファイルと同期カテゴリの関係も確認。
  - [公式資料](https://code.visualstudio.com/docs/agent-customization/prompt-files)
- 個人の共通の好みと、repoごとに異なる規約を整理する。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-personal-instructions)
- toolsの省略・空配列・明示一覧、呼出し制御、同名Agentの階層優先、開始時の版と新規タスクの版を区別。
  - [公式資料](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- 候補一覧と実行権限は別層。available-toolsとexcluded-tools同時指定の優先、deny優先、場所別の承認とURL恒久許可の保存先を確認。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)
  - [公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- npmの@github/copilot、Node.js条件、copilotでの起動、/login、非対話実行と回答のみの出力を確認。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)
  - [公式資料](https://docs.github.com/en/copilot/get-started/cli-quickstart)
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview)
- 自律的な複数ターン継続と、ツールの実行許可を区別する。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/use-autopilot-mode)
- 会話履歴とツール定義が占める文脈を分け、/compactによる会話の要約をツール定義の削減と混同しない。
  - [公式資料](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management)
  - [公式資料](https://code.visualstudio.com/docs/agents/concepts/context)
- 資料添付と実行先workspace、Symbols、明示ツール選択を確認。Web取得のキャッシュはVS Code再起動で更新を試せる。
  - [公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)
  - [公式資料](https://code.visualstudio.com/docs/agents/run/tools)
- 実行前・結果取込前の承認、URLのrequest/response、ターミナルfalse規則、承認とsandboxの独立性を確認。
  - [公式資料](https://code.visualstudio.com/docs/agents/run/approvals)
- checkpointによるファイル復元と、外部システムへの操作の取り消しを分ける。
  - [公式資料](https://code.visualstudio.com/docs/agents/run/review-code-edits)
  - [公式資料](https://code.visualstudio.com/docs/agents/concepts/trust-and-safety)
- 外部repoの意味索引はGitHub.com向け。Business/Enterpriseは該当ポリシーEnabledが必要で、Unconfiguredは許可にならない。
  - [公式資料](https://docs.github.com/en/copilot/concepts/context/repository-indexing)
  - [公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)
- 割当一覧と活動情報を区別。IDE活動の収集条件にテレメトリーが関係し、活動なしだけで資格なしと判断しない。
  - [公式資料](https://docs.github.com/en/rest/copilot/copilot-user-management)
  - [公式資料](https://docs.github.com/en/copilot/reference/metrics-data)
- 上位強制と下位保存値、利用資格と機能可否、学習利用と保持条件を分ける。モデル・機能を超えて一律の保持方針を断定しない。
  - [公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)
  - [公式資料](https://docs.github.com/en/copilot/get-started/plans)
  - [公式資料](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)
- 補完の採用・部分採用・候補比較、NESとghost text、従量接続での自動要求停止と明示要求、補完モデルとChatモデルの設定先を確認。
  - [公式資料](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)
- 環境別の機能対応、資格を持つアカウントでのサインイン、Planからの実装引継ぎ、Mobileのファイル画面からの質問を確認。
  - [公式資料](https://docs.github.com/en/copilot/reference/copilot-feature-matrix)
  - [公式資料](https://code.visualstudio.com/docs/setup/copilot)
  - [公式資料](https://code.visualstudio.com/docs/agents/run/planning)
  - [公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile)
- 責任ある利用、機能、データフロー、文脈、テスト・品質、除外・保護という学習範囲に照らして解説を整理。試験難度の等価性は主張しない。
  - [公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- 旧機能の終了告知を参照。Knowledge BasesはSpacesへ移行し、旧拡張の名称を現行の操作として説明しない。
  - [公式資料](https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/)
  - [公式資料](https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps/)
  - [公式資料](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)
  - [公式資料](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/)
- テスト内の準備・実行・検証と、具体的な例外への安全な対処という概念を確認。
  - [公式資料](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices)
  - [公式資料](https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions)

## 検証結果

[検証記録](answer-explanation-verification-2026-10-17.json)に単体・画面テストと型チェックの結果を記録。自動チェックは表示・採点・データ不変条件の検証であり、解説内容の正確性を自動認定するものではない。

## 全件の確認記録

各問の修正前後・全選択肢・正解・元データの指紋は同名JSONにも保存。以下は個別に執筆した修正後の解説。

### q02（基礎）

請求額計算の月末日や丸め規則が仕様どおりに実装されているかを検証したいと考えています。この検証において、直接確認すべき根拠として最も適切なものはどれですか？

正解：D

計算処理が仕様どおりかは、仕様から独立に求めた期待値と、実際に実行した結果を比較して判断します。今回確かめたいのは月末日や丸め規則なので、それらが結果に影響する入力を使い、値が一致するかを確認する必要があります。型検査や性能測定が成功していても、計算結果が業務上の仕様を満たす証拠にはなりません。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q03（基礎）

エディタでのコード入力中に、現在のカーソル位置に未確定のコード補完候補を薄い文字（ゴーストテキスト）で重ねて提示するCopilotの機能として、最も適切なものはどれですか？

正解：B

Inline Suggestionsは、入力中のコードに続く候補を、カーソル位置のゴーストテキストとして表示する機能です。まだ採用していない候補がその場に重なって見えるという問題文の動作に対応します。会話で説明を求めるChatや、既存コードの変更を依頼する操作とは区別します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q04（基礎）

未経験の言語で記述された関数の目的を、既存コードを変更することなく確認したいと考えています。具体的な入力例を用いてCopilotの説明が正しいかも検証する場合の進め方として、最も適切なものはどれですか？

正解：C

Copilot Chatは、渡したコードについて自然言語で説明を求める用途に使えます。今回は変更を加えず理解したいので、まず対象関数を文脈として渡して説明を求めます。説明が正しいかは別の確認が必要なため、具体的な入力例で元の関数を実行し、説明された動作と結果を照合します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q05（基礎）

VS CodeのCopilot Chatで送料計算関数のロジックを解説させようとしています。プロジェクト内には計算処理（shipping.ts）、料金表（rates.ts）、期待結果（shipping.test.ts）、配送先の型（types.ts）が存在します。関数から参照される料金表の具体的な値を解説に反映させるため、明示的に指定すべき文脈（コンテキスト）として最も適切なものはどれですか？

正解：B

Copilotへ説明させたい具体的な値が、どのファイルに存在するかを判断します。料金表の値はrates.tsにあるため、そのファイルを明示添付すると、shipping.tsだけでは不足する情報を文脈へ補えます。ただし、添付は正しい解釈を保証するものではないので、回答に料金表が適切に反映されたかも確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q06（基礎）

Copilotが新しいSDKメソッドを提案しました。使用しているライブラリの対象バージョンにおいて、そのメソッド名や引数の仕様が実在するかを最初に照合すべき公式資料として、最も適切なものはどれですか？

正解：B

Copilotの回答は、もっともらしくても存在しないAPIや別バージョンの仕様を含むことがあります。メソッド名と引数が対象バージョンで実在するかを知りたいので、まずそのバージョンの公式APIリファレンスを照合します。生成した説明の言い回しや、別バージョンでの動作だけでは実在の根拠になりません。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)

### q08（基礎）

認証機能のバグについて長くChatで相談した後、別の無関係な商品一覧機能の実装をChatで開始します。過去のタスク履歴や古い文脈が回答に混ざるのを防ぐための操作として、最も適切なものはどれですか？

正解：B

Copilot Chatは会話履歴も文脈として利用するため、古いタスクの前提が新しい回答へ影響する場合があります。無関係な商品一覧の作業へ移る今回は、新しい会話を開いて認証バグの履歴を切り離します。そのうえで現在の要件と関連ファイルを渡せば、新しいタスクに必要な情報を明示できます。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q09（基礎）

日付処理の単体テストをCopilotに生成させようとしています。通常の日付ケースは既にパスしていますが、月末日や不正な入力に対する境界値の検証がまだ行われていません。プロンプトに追加すべき指示として最も適切なものはどれですか？

正解：A

テスト生成の依頼では、未確認の入力と、その入力で期待する結果を具体的に伝えることが大切です。今回は通常ケースが通っていても月末と不正入力が未確認なので、その期待値や例外をプロンプトへ追加します。単にテスト数を増やす指示より、埋めたい境界・異常系を直接指定できます。

- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)

### q12（基礎）

管理者によってコンテンツ除外ルールの対象パスが正しく設定されていることを確認しました。しかし、特定の開発者の古いIDEセッションでのみ補完が表示されるように見える場合、次に実施すべき切り分けとして最も適切なものはどれですか？

正解：C

コンテンツ除外は、管理設定が正しいことと、クライアントが新しい設定を受け取って動作していることを分けて確認します。古いIDEセッションだけで現象が出るため、まず再読込して古い状態の影響を切り分けます。再読込後の除外表示と補完の実際の動作を確認することで、設定を書き換える前に反映の問題を調べられます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d1-f01（基礎）

Copilotの提案を採用して本番へ出したコードに仕様違反が見つかりました。採用判断と修正の説明責任を負うのは誰ですか？

正解：A

Copilotはコードを提案する支援機能であり、提案を製品へ取り込む判断を代行して責任を引き受けるものではありません。開発チームが内容を確認し、採用して公開したため、その判断と修正の説明責任を負います。AIが生成したという理由で、レビューや検証の責任がなくなるわけではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d1-f02（基礎）

Copilotが存在しないSDKメソッドを、もっともらしく断定的な説明とともに提案しました。このような現象を指す用語として、最も適切なものはどれですか？

正解：D

ハルシネーションは、事実に反する内容を、正しそうな形で生成する現象です。実在しないSDKメソッドを断定的に説明することは、その典型例に当たります。文章の自然さや自信のある表現は、APIの実在を裏付ける証拠にはなりません。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d1-f04（基礎）

人名分割処理において、特定地域の人名だけ誤分割が多発していました。調査したところ、プロンプトの例示データが一つの地域の形式に偏っていたことが判明しました。この問題の根本原因の分類として、最も適切なものはどれですか？

正解：C

AI Biasは、特定の集団や形式へ系統的に偏った結果が出ることに関係する概念です。今回の誤りは特定地域の人名に集中しており、例示データも一地域へ偏っています。単発の生成ミスではなく、代表性の不足と結果の偏りが対応している点が分類の判断材料です。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d1-f05（基礎）

Copilotがパスワード保存処理にMD5ハッシュ関数を使用するコードを提案しました。この提案を本番コードに採用する前に、直接的に修正すべき点として最も適切なものはどれですか？

正解：B

生成されたコードでも、セキュリティ上の適切さを採用前に確認する必要があります。今回はパスワード保存に適さないMD5を使っていることが問題なので、保存用の適切なハッシュ方式へ処理そのものを変更します。コードの見た目やコメントだけを直しても、この弱点は解消しないため、変更後の動作も検証します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/govern-at-scale/resources-for-approval)

### q-d1-a05（基礎）

GitHub Copilotのコード提案に、公開リポジトリのコードと一致したことを示す参照情報（Public Code Match通知）が付加されました。このコード断片を製品（プロプライエタリな自社商用プロダクト）に取り込んでよいかを法務・ライセンスの観点から判断するための次の確認ステップとして、最も適切なものはどれですか？

正解：B

公開コード一致の通知は、採用を自動的に許可する表示ではなく、出所を確認する手掛かりです。参照先のコードとライセンス条件を調べ、自社製品の配布形態や社内の採用基準に合うかを照合します。通知が付いていることだけでは利用条件の確認を済ませたことにならないため、必要に応じて担当部門へ判断をつなぎます。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d1-a06（基礎）

GitHub Copilotが生成したアクセス認可処理のコードは型検査（TypeScript等）をエラーなくパスしました。このコードについて、開発チームのピアレビュー（人間のコードレビュー）において「ユーザーの権限に応じた正しいビジネスロジックになっているか」という観点から確認する際、最も重点を置くべき検証ポイントはどれですか？

正解：D

型検査が通ることと、権限に応じてアクセスを正しく許可・拒否することは別です。今回は認可の業務ルールを確かめたいので、権限不足のユーザーが拒否される条件や境界ケースを重点的に確認します。正常なユーザーが使えるだけでなく、許してはいけない操作を防ぐことが採用判断の根拠になります。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)

### q-d2-f01（基礎）

VS Codeで選択した特定の関数のみを会話形式で対話的に修正し、差分プレビューを確認しながら採否を判断したい場合、使用すべき機能として最も適切なものはどれですか？

正解：B

Inline Chatは、エディタで選んだコードの近くで、対話しながら編集を依頼する機能です。今回のように一つの関数を対象にして、その場で差分を確認して採否を決める用途に合います。提案を得た後も、適用する変更は利用者が差分を読んで判断します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-f02（基礎）

Copilot Chatにおいて、ファイル全体ではなく「現在エディタ上で選択している行」のみを明示的に参照させるために使用するチャット変数として、最も適切なものはどれですか？

正解：C

#selectionは、現在選択しているコードをChatの文脈として明示する指定です。対象がファイル全体ではなく選択行なので、今回の参照範囲に対応します。選択範囲が意図したコードかを確認したうえで指定することが、別の箇所を説明させないための基本です。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-f03（基礎）

エディタで選択した既存の関数について、Copilot Chatに単体テストのコード生成を依頼する場合、対応環境で入力するスラッシュコマンドとして最も適切なものはどれですか？

正解：B

/testsは、対応する環境で対象コードのテスト生成を依頼するスラッシュコマンドです。選択した関数を文脈にして使うと、その関数に対するテストを求められます。生成されたテストが必要な入力や期待結果を検証しているかは、実行結果とともに確認する必要があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)

### q-d2-f04（基礎）

複数ファイルにまたがるコードを変更し、テストを実行して失敗ログから自律的に再修正を行わせたいと考えています。この作業に最も適したCopilotの利用形態はどれですか？

正解：A

Agentは、複数ファイルの編集と、テストなどのツール実行を組み合わせて作業を進める利用形態です。実行結果の失敗ログを受けて再修正するという、今回必要な反復に対応します。ただし、実行するツールの権限や承認は別に管理し、最終的な差分も確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-f06（基礎）

Copilotから社内チケットシステムの現在の状態を取得し、必要に応じてチケット作成などの操作も実行できる共通連携方式として、最も適切なものはどれですか？

正解：A

MCPは、AIアプリケーションと外部のデータ源・ツールをつなぐための共通プロトコルです。チケットの現在の状態の取得や、チケット作成の操作をツールとして公開すると、Copilotから連携できます。単に過去のチケット情報を文章で渡す方法と異なり、接続先の機能を呼び出す仕組みになります。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-f07（基礎）

MCP（Model Context Protocol）サーバーにおいて、「引数を受け取って外部チケットを新規作成する」操作をCopilot向けに公開したい場合、該当するMCPの機能区分（プリミティブ）として最も適切なものはどれですか？

正解：D

MCPのToolsは、モデルが引数を指定して呼び出す処理を公開する区分です。チケットの新規作成は参照資料を渡すだけではなく、外部システムへ操作を実行するため、Toolsに当たります。実際の呼び出しには、入力の定義や認証・認可も適切に用意する必要があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)

### q-d2-f08（基礎）

リポジトリ全体に対して常時適用されるCopilotのコーディング共通規約を、単一のMarkdownファイルとしてGit管理する場合の標準的な配置パスとして、最も適切なものはどれですか？

正解：B

.github/copilot-instructions.mdは、リポジトリ全体で共有するCopilotのカスタム指示を置く標準ファイルです。命名規約など継続して参照させるルールをMarkdownで管理し、Gitでチームへ共有できます。必要なときだけ呼び出すPrompt Fileとは役割が異なります。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-f09（基礎）

チーム内で共有し、必要なタイミングでのみ手動で呼び出して使用するコードレビュー用プロンプトをVS Code向けに保存する場合、最も適切なファイル配置の例はどれですか？

正解：B

Prompt Fileは、決まったタスクの指示を保存し、必要なときに呼び出すためのものです。.github/prompts/review.prompt.mdは、リポジトリで共有する配置先と.prompt.mdの拡張子を満たします。常時参照する共通規約ではなく、任意のレビュー手順を再利用する今回の用途に合います。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-f10（基礎）

チームで複数のリポジトリ、Issue、設計資料をひとまとめに整理し、Copilotへの質問において共有コンテキストとして横断的に活用するためのGitHub公式機能として、最も適切なものはどれですか？

正解：A

Copilot Spacesは、選んだコードやIssue、資料などをまとめ、質問の共有コンテキストとして使う機能です。チームが同じ資料を参照して相談したいという目的に合います。Spaceの共有は元リポジトリの権限を自動で広げるものではないため、参照元のアクセス権も別に必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)

### q-d2-f11（基礎）

GUIのないターミナル環境において、自然言語でGit操作やシェルコマンドの提案を受け、内容を確認してから実行するためのGitHub公式ツールとして、最も適切なものはどれですか？

正解：A

GitHub Copilot CLIは、ターミナルで自然言語の依頼やツールを使った作業を行うためのツールです。GUIを使わずにコマンドの相談をし、内容を確認してから実行するという利用場面に対応します。コマンドの提案と実行許可は区別し、必要な範囲で承認して使います。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli)

### q-d2-a08（基礎）

VS CodeのCopilotは、MCP接続でサーバーからツール一覧を受け取り、ツールを呼び出して結果を受信します。この接続でサーバーの機能を利用する側の構成要素を、MCPでは何と呼びますか。

正解：C

MCP Clientは、サーバーとの接続を通じてツールなどの機能を利用する側の構成要素です。今回はVS Code側が一覧を受け取り、呼び出しを送り、結果を受信しているためClientに当たります。機能を公開して呼び出しに応答するMCP Serverとは役割が逆です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-a14（基礎）

開発者が複雑な既存関数のロジックをリファクタリングしようとしています。コードを即座に変更するのではなく、まずはエディタ上で関数の処理内容の解説や改善ポイントの選択肢を対話形式で相談したいと考えています。最も適したモードはどれですか？

正解：D

Askの対話は、コードの説明や設計上の選択肢を相談する用途に向いています。今回はリファクタリングを即実行せず、先に関数の意味と改善案を理解したいので、この対話を選びます。対象関数を文脈にして質問すれば、編集の適用を伴わず検討を進められます。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)

### q-d2-e17（基礎）

TypeScriptプロジェクトでリファクタリングを行った後、エディタの「問題（Problems）」パネルに複数の型エラーが表示されています。特定のエラー箇所にカーソルを合わせ、その診断情報（Diagnostic）を直接Copilotに解釈させて修正案を適用するための最も素早い操作はどれですか？

正解：B

Inline Chatでは、選択箇所のコードと診断情報を踏まえて、その場の修正を依頼できます。今回は型エラーの位置が分かっているため、対象を選んで依頼し、差分を確認して適用する流れが合います。エラー表示が消えることだけでなく、修正内容が意図に合うかも確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)

### q-d3-f01（基礎）

関数の先頭と末尾のコードを残し、その中間の実装コードのみをCopilotに補完させようとしています。このようにカーソル前後のコードを同時にコンテキストとして活用する仕組みを表す概念として、最も適切なものはどれですか？

正解：A

Fill-in-the-middleは、カーソルより前だけでなく後ろのコードも使い、中間部分を生成する考え方です。今回は関数の先頭と末尾を残して間を補うため、この仕組みに対応します。後ろのコードも制約として利用できる点が、単に末尾へ続きを生成する場合との違いです。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://github.blog/ai-and-ml/github-copilot/how-github-copilot-is-getting-better-at-understanding-your-code/)

### q-d3-f02（基礎）

現在編集中のTypeScriptファイルでコード補完を行ったところ、エディタで同時に開いていた別タブの型定義がコンテキストとして参照されました。この動作を実現している仕組みとして、最も適切なものはどれですか？

正解：D

Neighboring Tabsは、開いている関連タブの内容を補完の手掛かりにする仕組みです。別タブの型定義が現在のTypeScriptの補完へ使われたという観測に対応します。開いたすべてのファイルが必ず全文使われるという保証ではなく、関連する文脈を補うものとして理解します。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### q-d3-f05（基礎）

長いソースコードをCopilot Chatに添付したところ、コンテキストウィンドウの上限に達しました。LLMが文脈長（コンテキストウィンドウ）や利用量を計測する際の基本単位として、最も適切なものはどれですか？

正解：D

トークンは、モデルが文字列を扱い、入力や出力の容量を数えるための基本単位です。文字数やファイル数とは同じではなく、分割方法によって対応する量も変わります。長いコードを渡して文脈上限に達した今回は、入力が占めるトークン量を意識する必要があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d4-f01（基礎）

Copilotへのプロンプトにおいて、目的と対象コードを提示したところ、新規外部ライブラリを導入するコードと長大な説明文が返信されました。既存の依存関係のみで実装させ、説明なしでコード差分のみを出力させたい場合、プロンプトに追加すべき指示要素として最も適切なものはどれですか？

正解：C

目的と対象コードだけでは、使ってよい依存関係や、回答の形式までは確定しません。既存ライブラリだけを使う条件と、説明なしでコード差分だけを返す条件を追加すると、今回の二つの不足を直接補えます。達成したい目的と、守るべき制約を区別して書くことが要点です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d4-f02（基礎）

プロンプト内で期待する入力と出力の具体例を2組提示した上で、同様の規則に従う新しいデータの生成をCopilotに依頼しました。このプロンプティング手法を表す用語として、最も適切なものはどれですか？

正解：D

Few-shot promptingは、少数の具体例をプロンプトに含め、期待する規則や出力形式を示す方法です。入力と出力を二組示して新しいデータにも同じ規則を求めるため、この手法に当たります。例を示すことは、その場の文脈による誘導であり、モデル自体を再学習させる操作ではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d4-f04（基礎）

複数のビジネスルールを含む複雑な判定ロジックについて、「各条件を段階的に順を追って検討した上で最終的な結論を出力してください」とCopilotに指示しました。このプロンプティング手法に最も近いものはどれですか？

正解：B

Step-by-step reasoningに近い依頼は、複雑な条件を一度に結論だけへまとめず、判断の段階を整理して説明させるものです。今回は各ビジネスルールを順に検討してから結論を求めている点が対応します。段階を示した回答でも誤りはあり得るため、各条件の当てはめは利用者が検証します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d5-f01（基礎）

エディタ上で選択した関数に対して、JSDoc形式のドキュメントコメントをCopilot Chatに生成させたい場合、対応環境で使用するスラッシュコマンドとして最も適切なものはどれですか？

正解：C

/docは、対応する環境で対象コードのドキュメントコメントを生成するコマンドです。今回は選択した関数へJSDocを付けたいので、対象を選択してこの用途を依頼します。生成した説明が引数や戻り値の実際の振る舞いと一致するか、採用前に確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d5-f02（基礎）

通常入力の正常系テストは既に通っています。空文字、上限値、例外発生時の境界値や異常系の振る舞いを追加検証するためのプロンプト指示として、最も適切なものはどれですか？

正解：D

通常入力が通っても、境界や例外時の動作を確認したことにはなりません。空文字、上限値、例外条件を挙げ、それぞれの期待結果もプロンプトへ指定すると、未確認部分を直接テストする依頼になります。期待値を生成結果だけに任せず、仕様に照らして確認することも必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d5-f04（基礎）

GitHub.com上で作成中のPull Requestにおいて、変更概要を箇条書きでCopilotに下書き生成させる機能として、最も適切なものはどれですか？

正解：D

CopilotのPull Request Summariesは、PRの変更内容から説明文の下書きを作る機能です。今回の目的はコードの修正やレビュー判定ではなく、変更概要を箇条書きにまとめることなので、この機能が合います。下書きが意図や影響を正しく表しているかは、投稿前に人が確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d5-f05（基礎）

単体テストにおいて外部HTTP通信をモックに置き換えて固定レスポンスを返させ、同時にリクエストの宛先URLや送信本文が正しいかを検証したいと考えています。最も適切なテスト実装の組み合わせはどれですか？

正解：B

モックでHTTP通信を置き換えると、外部サービスへ依存せず固定した応答でテストできます。一方、宛先URLや送信本文が正しいかは、呼び出しに渡した引数をアサートして確認します。応答の固定と送信内容の検証は役割が異なるため、二つを組み合わせる必要があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d6-f01（基礎）

Copilotのコード提案がGitHub上の公開コードと一致した場合の動作（許可またはブロック）を制御するための管理ポリシー設定として、最も適切なものはどれですか？

正解：D

公開コード一致の提案設定は、公開コードと一致する候補を許可するか、ブロックするかを制御します。生成された出力に対する設定なので、今回の管理目的に直接対応します。入力ファイルを参照対象から外すContent Exclusionとは、制御する段階が異なります。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/govern-at-scale/resources-for-approval)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d6-f02（基礎）

機密ファイルが含まれる特定のパスやファイルを、Copilotの機能がコンテキストとして参照しないよう組織レベルまたはリポジトリレベルで管理するための設定として、最も適切なものはどれですか？

正解：B

Content Exclusionは、指定したファイルやパスを、対応するCopilot機能の入力文脈から外す設定です。機密ファイルを参照させないという管理目的に対応します。すべてのAgentや手動貼り付けまで一律に遮断するものではないため、利用する機能の対応範囲も確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d6-f03（基礎）

GitHub Copilot BusinessおよびEnterpriseにおいて、ユーザーのコードスニペットやプロンプトが基盤モデルの再学習に使用されるかに関する公式プライバシー方針として、最も適切なものはどれですか？

正解：B

Copilot BusinessとEnterpriseでは、顧客のコードやプロンプトを基盤モデルの学習に使用しない方針が示されています。今回問われているのは、その学習用途の扱いです。学習に使わないことと、各機能でデータがどれだけ保持されるかは別の論点なので、即時破棄や無送信まで意味すると解釈しません。

- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/govern-at-scale/resources-for-approval)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d6-f04（基礎）

Copilotのシート割り当て変更や組織ポリシーの変更履歴について、操作を実行した管理者アカウントと日時を追跡するために参照すべき情報源として、最も適切なものはどれですか？

正解：C

GitHub Audit Logは、組織で行われた管理操作をイベントとして追跡するための情報源です。今回必要な操作の実行者と日時は、Seat割当やポリシー変更に対応するイベントで確認します。利用率の統計を見るだけでは、誰が設定を変更したかを特定する目的を満たせません。

- [登録されている公式資料](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d6-f05（基礎）

組織全体のCopilot利用状況について、コード提案の受容率や言語別の統計データをプログラムから集計・取得するために使用するAPIとして、最も適切なものはどれですか？

正解：D

CopilotのMetrics APIは、利用状況の集計指標をプログラムから取得するためのAPIです。受容率や言語別の傾向を集計したい今回は、その用途に対応します。管理操作の監査やSeatの現在の割当とは別のデータなので、利用するAPIで提供される項目と期間も確認します。

- [登録されている公式資料](https://docs.github.com/en/rest/copilot)
- [登録されている公式資料](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)

### q-d6-a01（応用）

Copilotの組織除外で、repo-Aのsecrets/を設定しました。同じEnterpriseのrepo-Bへコードを複製すると、Bでは通常補完が使えます。AとBのhostは同じですがrepo pathは異なります。Bでもsecrets/だけを除外し、Bの他のファイルは残します。追加する組織ルールはどれですか。

正解：A

組織のコンテンツ除外は、リポジトリを表すキーと、その中で除外するパスの組み合わせで指定します。AからBへソースを複製しても、リポジトリパスの異なるBにAのルールがそのまま適用されるわけではありません。

Bをキーにしてsecrets/**を追加すれば、Bのsecrets配下を対象にできます。Bの他のファイルは除外しないため、必要な補完を残す条件にも合います。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d6-a04（基礎）

GitHub Copilotの「Code Referencing（コード参照通知）」機能の役割および活用方法として、最も適切なものはどれですか？

正解：A

Code Referencingは、提案と一致する公開コードの出所やライセンスの手掛かりを示す機能です。開発者は参照情報を使って利用条件を調べ、自社製品への採用可否を判断します。一致通知があること自体で、すべての利用条件を満たしたり、コードの安全性が保証されたりするわけではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d6-a05（基礎）

組織内の特定の開発者1名のみCopilotの利用資格を回収し、他のメンバーの利用は継続させたいと考えています。管理者がGitHub組織の管理画面で直接変更すべき操作対象として、最も適切なものはどれですか？

正解：A

Seat Assignmentは、組織が特定の利用者へCopilotの利用資格を割り当てる管理対象です。一人だけの資格を回収する今回は、その利用者のSeat割り当てを解除するのが直接の操作です。組織全体の機能を無効にする必要はなく、他のメンバーの割り当てを維持できます。

- [登録されている公式資料](https://docs.github.com/en/rest/copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d6-a06（基礎）

Enterprise（企業アカウント）レベルでCopilotポリシーが強制的に「Block」に設定されています。配下のOrganization（組織）側の管理画面で表示が「Allow」になっていた場合、実際の開発者の環境で適用される実効値（有効な設定）はどれですか？

正解：A

Enterpriseで強制されたポリシーは、下位のOrganizationや個人が保存した値だけでは緩和できません。今回は上位がBlockを強制しているので、組織画面のAllowをそのまま実効値と考えるのは誤りです。実際に適用されるBlockと、下位へ保存された表示値を区別します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d6-e01（高難度）

同じContent Exclusionを三つの経路で検証しました。①実パスを使う通常補完は除外表示、②別workspaceのsymlink経由の通常補完は読取あり、③実パスを使うVS CodeのAgentも読取ありでした。登録パスと反映は①で確認済みです。②と③を追加パターンだけで解決できると考える前に、区別すべき適用上の制約はどれですか。

正解：A

Content Exclusionは、すべての読取経路を一括して遮断する仕組みではありません。公式の制約としてsymlink経由には適用されず、VS CodeのAgentモードも対応範囲が異なります。

①では実パスを使う通常補完が除外されているため、登録や反映の失敗を共通原因とする根拠はありません。②はsymlink経由の制約、③はAgentの非対応という別々の理由で読み取りが起きています。除外パターンを追加するだけでは、この二つの適用限界は解消できません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

### q-sc01-1（基礎）

【AnyCompany Tech事例】機密コードを通常のコード補完やChatのコンテキストから確実に除外する方針を定めています。既存の.gitignore設定とは別に、Copilot環境で設定すべき機能として、最も適切なものはどれですか？

正解：D

Copilotの入力文脈から対象パスを外すには、対応機能のContent Exclusionを明示的に設定します。.gitignoreはGitの追跡に関する設定なので、同じ保護を自動的に与えるとは考えません。利用するChatやモードの対応範囲も確認し、非対応の経路には別の対策を用意します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
- [登録されている公式資料](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-sc01-2（応用）

同じEnterpriseのrepoでsecret.keyの機密解除が承認されました。repo管理者は個別除外を削除しましたが、AからSeatを受ける利用者Xだけ除外が残り、BからSeatを受けるYは通常補完を使えます。両者のファイル、クライアント、反映時刻は同じです。次に確認する設定の範囲はどれですか。

正解：C

リポジトリの除外と、Seat提供元の組織が管理する除外は、別々に設定できます。リポジトリ共通の条件が同じなのにXだけ除外されるため、全員共通のパス設定より、XとYで異なる管理範囲を調べます。

今回の違いはSeatの提供元なので、組織AのSeat利用者へ適用するルールが次の確認先です。リポジトリ側の削除が完了していても、組織Aのルールが残っている可能性があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

### q-sc04-1（基礎）

【Nordic Retail事例】IDE上で複数ファイルにまたがるコード修正と、テスト失敗ログに基づく自動的な再修正を進めたいと考えています。必要なツール承認設定を別途確認する前提において、手動でのモード切り替えを最小化できるCopilotの利用形態として、最も適切なものはどれですか？

正解：A

IDEのAgentは、複数ファイルを変更し、ツールでテストを実行し、その結果を使って再修正する作業に対応します。今回必要な編集と検証のループを同じ依頼で進められる点が選択理由です。ただし、ツールを実行してよいかの承認と、最終的な差分の採否は別に確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)

### q-sc06-3（応用）

GitHub.comの個人指示に「日本語で回答」「全関数へJSDoc」を書いています。repo-Rは公開APIだけ、repo-Sは全関数がJSDoc規約で、各repoに設定済みです。日本語は両repoに共通する個人の希望ですが、RでJSDoc規約が競合します。repo規約を変えず、二つの個人指示をどう整理しますか。

正解：B

個人指示には、その人が複数のリポジトリで共通して使いたい希望を書くのが適切です。日本語で回答する希望はRとSで共通なので、そのまま残せます。

一方、JSDocの対象範囲はリポジトリごとに違うため、全関数を対象にする個人指示がRの規約と競合しています。この項目を個人指示から外して各リポジトリの指示に委ねれば、両方の既存規約を保てます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-personal-instructions)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-sc07-3（基礎）

【CyberShield Systems事例】組織のCopilotポリシーが変更された際、変更操作を実行したアカウントと日時を特定して調査したいと考えています。参照すべき監査ログの記録として、最も適切なものはどれですか？

正解：D

Audit Logの管理イベントでは、組織の設定変更に対応する実行者や時刻を追跡できます。今回は利用傾向の分析ではなく、ポリシーを誰がいつ変えたかを調べるため、そのイベントを参照します。調査対象の期間や操作種別で絞り込むことで、該当する変更を探せます。

- [登録されている公式資料](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)
- [登録されている公式資料](https://docs.github.com/en/rest/copilot)

### q-sc08-3（基礎）

【DataFlow Analytics事例】IDEのCopilot Chatにおいて、DataPipeline.tsとSchemaValidator.tsの現行実装を確実に参照させた上で質問したいと考えています。参照対象ファイルが事前に特定できている場合の基本操作として、最も適切なものはどれですか？

正解：D

参照してほしいファイルが分かっている場合は、対象を明示添付してから質問する方法が基本です。DataPipeline.tsとSchemaValidator.tsを直接指定すれば、名前を挙げるだけより参照対象を明確にできます。ただし、添付は他の文脈をすべて除外する保証でも、正確な回答の保証でもないため、回答内容は確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-sc09-2（基礎）

【Nexis Games事例】組織内におけるCopilot提案の受容率や言語別の利用傾向を継続的に集計・可視化したいと考えています。この用途で参照すべきGitHub REST APIの種類として、最も適切なものはどれですか？

正解：B

Copilotの利用指標を取得するAPIは、受容率や言語別の活動を集計する目的に対応します。継続的な可視化では、利用できる指標、対象期間、収集条件を確認して取得します。Seat割当一覧や管理操作の監査ログだけでは、同じ利用傾向の分析にはなりません。

- [登録されている公式資料](https://docs.github.com/en/rest/copilot)

### q-sc10-1（基礎）

【SecureBank Online事例】コード補完機能において、公開リポジトリのコードと一致する提案の提示を抑制したいと考えています。同時に、社内既存コードを通常の補完コンテキストとして活用することは維持したい場合、最も直接的な設定として、最も適切なものはどれですか？

正解：B

公開コード一致のBlockは、生成される候補のうち一致する提案を抑える出力側の制御です。社内コードを入力文脈として利用することとは別なので、社内ファイルを除外する必要はありません。公開コード一致だけをBlockへ変えれば、入力の文脈を維持しながら出力の抑制を行えます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
- [登録されている公式資料](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)

### q-sc10-2（基礎）

【SecureBank Online事例】「Allow」設定の環境下で採用したコード提案に対し、公開コードとの一致通知が表示されました。今後のポリシー設定変更とは別に、今回の採用可否を法務・ライセンス観点から判断するための対応として、最も適切なものはどれですか？

正解：A

今回の採用判断には、その候補と一致した参照先と利用条件の確認が必要です。Code Referencingから出所とライセンスを調べ、自社での使い方に合うかを確認します。将来の提案をBlockへ変えても、採用済みスニペットの出所や条件を調べたことにはならないため、二つを分けて対応します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)
- [登録されている公式資料](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning)

### q-d1-g01（基礎）

Copilotは、プロンプトや周辺コードの文脈から、これまで存在しなかった新しい提案を作り出します。この種のAI技術の総称として、最も適切なものはどれですか？

正解：A

生成AIは、入力された指示や文脈からコード、文章などの内容を生成する技術の総称です。Copilotが周辺コードやプロンプトから新しい候補を作る動作は、この分類に当たります。生成されたことは、その内容の新規性や正しさが保証されたことを意味しません。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d1-g02（基礎）

AIの提案を採用する前に、正確性・セキュリティ・ライセンス・バイアスを評価し、最終的な説明責任は開発者が負うという原則と実践の名称として、最も適切なものはどれですか？

正解：B

Responsible AIは、AIの能力だけでなくリスクや限界も踏まえ、人が責任を持って利用するための原則と実践です。問題文では正確性、セキュリティ、ライセンス、バイアスを評価し、採用の説明責任を人が負っています。このように評価と責任を組み込む姿勢が、責任あるAIの利用に対応します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d1-g03（基礎）

Copilot Chatが回答の生成時にどのファイルや文脈を参照したかを確認し、提案の妥当性を判断できるようにする性質として、最も適切なものはどれですか？

正解：C

透明性と説明可能性は、利用した情報や判断の根拠を理解し、妥当性を評価できることに関係します。今回は参照されたファイルや文脈を確認して、提案が何に基づくかを調べています。ただし、参照表示だけでモデル内部のすべての判断や回答の正確性まで証明できるわけではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)

### q-d1-g04（基礎）

同一のプロンプトと同じコードを渡した場合でも、Copilotの提案が毎回少しずつ異なることがあります。この確率的な性質を表す用語として、最も適切なものはどれですか？

正解：D

LLMによる生成には確率的な性質があり、同じ指示とコードでも候補が変わる場合があります。このように入力をそろえても同じ出力が必ず再現されるとは限らない性質を非決定性と呼びます。動作が違ったという観測だけで、利用者が別の指示をしたと決めつけないことが要点です。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)

### q-d1-g05（基礎）

Copilotの提案が一見正しく整って見えるため、内容を精査せずにTabキーで安易に受け入れ続けてしまう心理的な傾向を表す用語として、最も適切なものはどれですか？

正解：A

自動化バイアスは、自動化された出力を過信し、自分で確かめる姿勢が弱くなる傾向です。今回も提案の整った見た目を根拠に、内容を精査せず採用している点が当てはまります。表示の自然さと、要件や安全性を満たすことを区別して確認する必要があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d1-g06（基礎）

Copilotの最初の候補をそのまま鵜呑みにせず、要件への適合性・副作用・エラー処理を自ら点検しながら比較・検証する姿勢を表すプラクティスとして、最も適切なものはどれですか？

正解：B

提案の批判的評価は、出力をそのまま受け入れず、要件や副作用、失敗時の動作を自分で調べる実践です。最初の候補を比較・検証し、必要なら修正や別案を求めるという行動が対応します。AIを使わないことではなく、採用の判断を人が根拠に基づいて行う姿勢です。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d2-g01（基礎）

エディタ内でコードを入力中に、カーソルの直後に薄い灰色でインライン表示される未確定の補完候補テキストを表す用語として、最も適切なものはどれですか？

正解：C

Ghost Textは、エディタ上に薄く表示される未確定のコード補完候補です。入力済みのコードへ確定的に書き込まれた文字ではなく、採用するかを選ぶ前の提案を示します。カーソル付近の表示形式を尋ねているため、この用語が適切です。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### q-d2-g02（基礎）

VS Codeにおいて、通常のインライン候補に加えて別タブを開き、最大10個の追加補完候補をまとめて生成・比較検討できる機能として、最も適切なものはどれですか？

正解：D

CopilotのCompletions Panelは、別タブで追加の補完候補をまとめて比較するための機能です。対応するVS Codeの操作では最大10個の候補を確認でき、通常のインライン表示だけで比較する場合とは異なります。複数の候補から内容を見て採用したいという問題文の用途に対応します。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### q-d2-g03（基礎）

Copilot Chatにおいて、`@workspace` や `@vscode` のように `@` 記号を付けて指定し、特定のコンテキストや機能へ質問をルーティングする仕組みとして、最も適切なものはどれですか？

正解：A

Chat Participantsは、@を使って質問を担当する機能や領域を指定する仕組みです。@workspaceや@vscodeは、質問に合う文脈や機能へ案内する例です。動作を依頼する/コマンドや、資料を文脈へ加える#の指定とは役割を区別します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g04（基礎）

VS Codeのステータスバーに常駐し、Copilotの全体的な有効化/無効化や、現在の言語に対する補完設定の切り替え、ログ確認ができるUI要素として、最も適切なものはどれですか？

正解：B

Copilot Status Menuは、エディタのステータスバーにあるCopilotの状態や設定の入口です。全体や言語ごとの補完の有効・無効を確認するという、問題文の操作に対応します。具体的に表示される項目は環境によりますが、Chatの回答内容ではなくクライアントの状態を扱うUIです。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g05（基礎）

2025年10月に提供終了した旧gh-copilot拡張の資料を確認しています。既存のシェルコマンドの意味を自然言語で説明するために使用されていた旧サブコマンドとして、最も適切なものはどれですか？

正解：C

gh copilot explainは、旧gh-copilot拡張でコマンドの意味を説明させるために使われたサブコマンドです。今回の問いは旧資料における名称なので、この履歴上の操作を選びます。旧拡張は提供終了しており、現行の利用手順はcopilotで起動するCLIと分けて覚えます。

- [登録されている公式資料](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/cli-quickstart)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g06（基礎）

旧gh-copilot拡張の履歴資料において、自然言語からGitやシェルのコマンド候補を提案させる操作として使用されていた旧サブコマンドとして、最も適切なものはどれですか？

正解：D

旧gh-copilotのsuggestは、自然言語からシェルやGitのコマンド候補を求める操作でした。explainが既存コマンドの説明を求めるのに対し、こちらは候補の生成を目的にしています。提供終了した旧拡張の履歴の問いであり、現行CLIの必須サブコマンドとは扱いません。

- [登録されている公式資料](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/cli-quickstart)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g07（基礎）

旧gh-copilot資料に記載されているghcs / ghceというシェルエイリアスについて、現行Copilot CLIへの移行説明として、最も適切なものはどれですか？

正解：A

ghcsとghceは、旧gh-copilot拡張の操作を短く呼び出すためのシェルエイリアスでした。現行Copilot CLIの起動はcopilotであり、これらの旧エイリアスの設定が必須になるわけではありません。移行時には、古い補助設定と現在の製品の起動方法を区別します。

- [登録されている公式資料](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/cli-quickstart)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g08（基礎）

現行Copilot CLIの変更系ツールにおいて、個別の実行確認を省略できる場合があります。この承認頻度に直接影響を与える仕組みとして、最も適切なものはどれですか？

正解：B

CLIでツールを実行する際の確認は、許可・拒否の指定や保存された承認の範囲に影響されます。そのため、変更系の操作で確認が出ない理由を調べるには、そのツールの権限設定を確認します。候補としてツールが見えることと、確認なしで実行できることは同じではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g09（基礎）

現行Copilot CLIでローカルのプロジェクトファイルを調査し、回答の文脈に加えたいと考えています。CLIが取得できる情報範囲に直接関係する条件として、最も適切なものはどれですか？

正解：C

CLIがファイルを参照できるかは、作業場所と、ファイル・ツールに与えたアクセス範囲に依存します。プロジェクト名をプロンプトに書くだけで、どのディレクトリでも読み取れるようになるわけではありません。実行場所と許可を確認することが、実際に得られる文脈の範囲を判断する基本です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g10（基礎）

VS Codeにおいて、作業対象（Working Set）に指定した複数ファイルに対して、セッション内で同時にコード修正を生成・差分プレビューできる機能として、最も適切なものはどれですか？

正解：D

Copilot Editsは、作業対象のファイルを指定して複数ファイルへの編集提案を確認する機能です。Working Setを使い、変更の差分を見て採否を判断するという問題文の操作に対応します。コードについて説明するだけの対話と、編集対象を持つセッションの違いに注目します。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/reference/workspace-context)

### q-d2-g11（基礎）

Model Context Protocol（MCP）において、社内DBやAPIツール、リソースなどの外部データと操作を公開し、Copilotからの呼び出しに応答する構成要素として、最も適切なものはどれですか？

正解：A

MCP Serverは、ツールやリソースを公開し、クライアントからの要求へ応答する側です。社内DBやAPIとの連携機能をCopilotへ提供する今回の構成に当たります。接続してそれらを利用するMCP Clientと、機能を提供するServerを区別します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)

### q-d2-g12（基礎）

Agent Modeにおいて、一連のタスク指示、ツールの実行履歴、コード編集、作業コンテキストをひとまとめに保持し、中断や再開の単位となる作業空間として、最も適切なものはどれですか？

正解：B

Agent Sessionは、タスクの指示や会話、ツールの履歴、作業文脈をまとめて扱う単位です。作業を中断した後に同じ流れを再開するという説明が、このセッションに対応します。単一のツール呼び出しやファイルだけを指す言葉ではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions)

### q-d2-g13（基礎）

メインのエージェントが大規模なタスクを実行する際、独立したコンテキストで下位タスク（調査やサブコンポーネント作成など）を並行して引き受け、結果をメインへ返す仕組みとして、最も適切なものはどれですか？

正解：C

Subagentは、主Agentから下位タスクを引き受け、別の文脈で調査などを進めて結果を返す仕組みです。中間の詳細を主会話へすべて入れずに作業を分担できる点が、問題文の説明に合います。文脈の分離は、作業ファイルやOS環境の隔離を自動的に保証するものではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-subagents)

### q-d2-g14（基礎）

GitHubのプルリクエストにおいて、変更差分をAIが自動分析し、潜在的なバグ・セキュリティ上の懸念・改善提案をインラインコメントとして投稿する機能として、最も適切なものはどれですか？

正解：D

Copilot Code Reviewは、コード変更を分析してバグや改善点などのレビューを行う機能です。PR差分に対してインラインコメントを出すという用途に対応します。レビューが終わったことは、コードの正確性や安全性がすべて保証されたこととは異なり、人による確認も必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d2-g15（基礎）

リポジトリ全体の共通規約（`copilot-instructions.md`）とは別に、特定のサブディレクトリやファイル種別（フロントエンド、バックエンド等）に限定して指示を適用する設定手法として、最も適切なものはどれですか？

正解：A

Scoped Instructionsは、対象パスやファイル種別に合わせて適用する指示を分ける構成です。対応する環境では、パス別の指示ファイルにapplyToなどで対象を記載します。全体共通の規約と、フロントエンドなど特定範囲だけの規約を分けたい今回の用途に合います。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)

### q-d2-g16（基礎）

自然言語の指示から直接マイクロWebアプリケーションを構築・反復改善する実験的ツールとして公開され、github.com上で2026年8月に新規作成が終了したサービスとして、最も適切なものはどれですか？

正解：B

GitHub Sparkは、自然言語からマイクロアプリを構築し、反復して調整するサービスとして提供されました。今回の問いは、新規作成が終了したサービスを履歴として識別するものです。現在利用できる標準的な機能として覚えず、終了の告知と現行サービスの状態を区別します。

- [登録されている公式資料](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g17（基礎）

サードパーティのSaaSや社内サービスと連携してCopilot Chatを拡張する仕組みとして提供され、2025年11月に終了して現行のMCP等へ移行した旧連携方式として、最も適切なものはどれですか？

正解：C

GitHub App型Copilot Extensionsは、外部サービスをCopilot Chatへ統合する旧方式です。この方式の終了と、現在のMCPなどによる接続を区別するのが問題の意図です。通常のGitHub App全体が廃止されたという意味ではなく、Copilot向けの旧拡張方式の話です。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps/)

### q-d2-g18（基礎）

GitHub Organizationの管理者が、所属メンバーに対して「公開コード一致提案のブロック」や「特定機能の有効化」を一括適用する管理設定として、最も適切なものはどれですか？

正解：D

Organization Policiesは、組織が管理するCopilotの機能や利用条件を設定する範囲です。所属メンバーへの機能提供や公開コード一致ポリシーをまとめて管理する今回の目的に対応します。ただし、上位のEnterpriseで強制された設定があれば、組織だけで緩和はできません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-g19（基礎）

GitHub Enterprise管理者が設定し、傘下のすべてのOrganizationに対して強制（Enforce）され、下位組織での緩和や無効化ができない最上位のポリシーとして、最も適切なものはどれですか？

正解：A

Enterprise Policiesは、Enterprise配下の組織に対するCopilotの管理方針を設定する範囲です。上位で強制した設定を下位組織が緩められないという問題文の性質に当たります。各組織が独立して変更できる項目と、上位が決めた実効制約を区別します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d2-g20（基礎）

個人向けのFree・Pro、組織向けのBusiness・Enterpriseなど、利用可能な機能や顧客コードのプライバシーポリシー（モデル学習利用の有無）を規定するライセンス・プラン体系として、最も適切なものはどれですか？

正解：B

Subscription Plansは、個人向け・組織向けのCopilotの利用条件や管理機能などを定める契約上の区分です。機能の利用可否やデータの扱いを確認する際の前提になります。プラン名だけからすべての機能の保持期間まで推測せず、対象のプランと機能の公式条件を確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/govern-at-scale/resources-for-approval)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/plans)

### q-d2-g21（基礎）

組織の管理者が、Pull RequestにおけるCopilotによる自動コードレビューの動作（自動トリガーの有無や利用可否）を制御する管理ポリシーとして、最も適切なものはどれですか？

正解：C

Code Review Policiesは、Copilotのレビュー機能を利用できる範囲や、その動作を管理するための設定です。自動レビューの起動などを制御したいという今回の用途に合います。コードの修正を生成する依頼文ではなく、レビューの管理設定を問う問題です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d2-g22（基礎）

旧教材にCopilot Knowledge Basesの設定手順があります。現在の共有コンテキスト機能との関係・位置づけとして、最も適切なものはどれですか？

正解：D

Copilot Knowledge Basesは2025年11月1日に終了した旧機能です。現在の共有コンテキストの教材では、資料をまとめて共有するCopilot Spacesを使います。旧教材の設定手順を現行の操作として再現するのではなく、旧機能からSpacesへ移行した関係として理解します。

- [登録されている公式資料](https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-g01（基礎）

開発者のIDEから送信されたプロンプトやコンテキストが、GitHubのプロキシ基盤を経由してLLMに到達し、生成結果が後処理を経てエディタへ返却されるまでの一連のエンドツーエンドの通信・処理経路を表す概念として、最も適切なものはどれですか？

正解：A

Copilot Data Flowは、入力がクライアントからサービスへ渡り、モデルで処理され、結果が返るまでの流れを捉える概念です。問題文は送信、プロキシ、生成、後処理、表示という複数の段階を含むため、この全体の流れに当たります。個別のモデルやフィルターだけを指しているわけではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-g02（基礎）

エディタ上でカーソル前後のコード、開いているタブ、隣接ファイルの関連スニペットなどを収集・優先度付けし、LLMに送信可能な形式へと合成・整形する内部処理の仕組みとして、最も適切なものはどれですか？

正解：B

Prompt Construction Pipelineは、関連するコードや指示を収集し、モデルへ渡す入力を組み立てる段階です。周辺コードや開いたタブを優先度や文脈量に合わせて整理するという説明が対応します。回答を生成した後の出力フィルタリングとは、処理する時点が異なります。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-g03（基礎）

Copilotの通信において、IDEとモデル提供側の間にあるGitHub側の中継基盤を指す用語として、最も適切なものはどれですか？

正解：C

Copilot ProxyまたはGatewayは、クライアントとモデル側の間にあるGitHub側の中継基盤を指します。問題文が尋ねているのは、利用者のIDEでもLLMそのものでもなく、その間の通信を扱う部分です。具体的なデータ経路やホスティングは、利用機能やモデルの公式条件で確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-g04（基礎）

Copilotの利用において、ソースコードそのもの（Code Snippets）とは厳格に区別され、提案の受入・却下イベント、レイテンシ、エラーログなどサービスの監視・改善目的で収集される利用統計データとして、最も適切なものはどれですか？

正解：D

Telemetryは、受容・却下のイベントや遅延、エラーなど、サービスの利用・動作を把握する情報です。問題文のデータはコードを生成するためのソース本体ではなく、稼働状況や利用傾向を測るものなので、この分類に当たります。ただし、個々のログに何が含まれるかは収集項目を確認し、機密情報がないと一律に決めつけません。

- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/govern-at-scale/resources-for-approval)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)

### q-d3-g05（基礎）

Copilot Business/Enterpriseにおける「モデル学習に使わない」という規定と並び、「入力プロンプトや出力提案をサーバー側でどれだけ保持するか」を規定する概念として、最も適切なものはどれですか？

正解：A

Data Retention Policyは、データをどの条件でどれだけ保持するかという方針です。モデルの学習へ使うかどうかとは別の軸なので、学習利用しないという説明だけでは保持期間は分かりません。対象のモデルや機能ごとの条件を確認し、全機能で即時破棄されるという理解を避けます。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/govern-at-scale/resources-for-approval)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-g06（基礎）

LLMが生成した出力結果がエディタに表示される直前に実行され、公開コードとの一致検知（Public Code Matching）や有害コンテンツの検出・遮断を行う処理ステージとして、最も適切なものはどれですか？

正解：B

Post-processingは、モデルが生成した後に出力を検査・整形する処理段階です。公開コードとの一致や有害内容を評価して、表示する出力を扱うという説明が当てはまります。入力文脈を収集する処理とは別であり、フィルターの存在も誤りが一切ない保証ではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d3-g07（基礎）

コードがIDEからCopilotバックエンドサービスへ送信される際、通信経路上の盗聴・改ざんを防ぐ暗号化保護を表す概念として、最も適切なものはどれですか？

正解：C

Encryption in Transitは、送信中のデータをTLSなどで保護することです。IDEからサービスへ渡す通信の盗聴や改ざんを抑えるという目的に対応します。通信経路の保護と、受信後の保存期間やモデル学習への利用可否は別の事項です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)

### q-d3-g08（基礎）

開発者のタイピング休止（デバウンス）によるトリガーから、周辺文脈の送信、ゴーストテキストの提示、そしてTabキーによる採択や追加入力による破棄・再計算に至る一連の状態遷移を表すライフサイクル概念として、最も適切なものはどれですか？

正解：D

Code Suggestion Lifecycleは、補完の要求から生成、表示、採用または破棄までの流れを指します。問題文はタイピングに応じた要求とゴーストテキストの表示、その後の利用者の操作まで含んでいます。そのため、一つの画面機能ではなく補完の状態が移る一連のライフサイクルに当たります。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### q-d3-g09（基礎）

LLMが1回のプロンプトと応答で同時に保持・処理できる情報量（トークン数）の物理的な上限枠であり、超過時には優先度の低い文脈が切り捨てられる境界を表す用語として、最も適切なものはどれですか？

正解：A

Context Windowは、モデルが一度に扱える入力や出力のトークン量の上限に関係する枠です。大量の資料を追加しても、すべてを無制限に同時処理できるわけではありません。上限への対応では、不要な履歴や資料を減らして必要な文脈を残す判断が重要になります。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d3-g10（基礎）

タイピングの快適さを保つインライン補完では超低遅延（レスポンス速度）が最優先される一方、チャットやエージェントでは推論の正確性や深い文脈理解が重視されるという、AI機能設計上のトレードオフとして最も適切なものはどれですか？

正解：B

Latency vs Qualityは、応答までの時間と、必要な品質や分析量の両立を考える観点です。入力を妨げない補完と、深い分析を行うChat・Agentでは、求める応答の性質が異なります。どの機能でも最速や最も大きなモデルだけを選べばよい、という単純な判断ではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-g11（基礎）

LLMの候補トークンの確率分布を制御し、出力のばらつきや多様性に影響を与えるパラメータ設定として、最も適切なものはどれですか（※低い値に設定しても正確性や完全な再現性が保証されるわけではありません）？

正解：C

Temperatureは、生成候補の確率分布へ影響し、出力のばらつきや多様性を調整するパラメータです。一般に低くすると選択が集中しやすくなりますが、事実の正確さや完全な再現性を保証するものではありません。この問は概念の識別であり、Copilotのすべての利用面で利用者が直接変更できるという意味ではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d3-g12（基礎）

基盤LLMが事前学習を完了した特定の日付境界であり、それ以降にリリースされた最新フレームワークの仕様変更や新機能について外部コンテキストを与えない限りモデルが知らないという制約を表す用語として、最も適切なものはどれですか？

正解：D

Knowledge Cutoffは、モデルの事前学習に含まれる知識の時点を考える概念です。それ以降の仕様変更を、学習済み知識だけから正確に答えられるとは限りません。最新の公式資料や検索結果を文脈として渡すことで補える場合はありますが、回答の照合は必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-g13（基礎）

Copilotが利用できる文脈は、利用する機能面、添付資料、接続ツールおよび付与された権限によって異なります。この「何を参照できるか」という制約境界を表す概念として、最も適切なものはどれですか？

正解：A

Context Scope Limitationsは、Copilotが何を参照できるかに境界があることを表します。添付した資料、接続済みのツール、機能の対応範囲やアクセス権によって、得られる情報は変わります。質問文に情報源の名前を書くだけで、その情報へアクセスする権限や接続が付くわけではありません。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/reference/workspace-context)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/repository-indexing)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-g14（基礎）

Public Code MatchingやContent Exclusionとは異なり、差別・ヘイトスピーチ、自傷、悪意あるエクスプロイトコードなど、出力内容そのものの危険性や有害性を評価してブロックするセーフガードとして、最も適切なものはどれですか？

正解：B

Harmful Output Filteringは、出力内容そのものの有害性や危険性を検出・抑制する安全機構です。公開コードとの類似を調べる仕組みとは、評価する目的が異なります。フィルターがあってもすべての危険を排除できるとは限らないため、出力のレビューは引き続き必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)

### q-d4-g01（基礎）

LLMから期待する品質のコードや回答を引き出すために、目的・文脈・制約条件・出力形式などを体系的に設計・反復改善する技術体系として、最も適切なものはどれですか？

正解：C

Prompt Engineeringは、目的、文脈、制約、出力形式などを整理し、結果を見ながら指示を改善する技術です。問題文は一つの定型文ではなく、指示を体系的に設計して反復する活動を説明しています。長いプロンプトを書くこと自体ではなく、必要な情報を明確に伝えることが中心です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d4-g02（基礎）

プロンプト内に入出力の具体例（Examples）を事前に提示せず、指示文や要件のみを直接与えてタスクの実行やコード生成を依頼するプロンプティング手法として、最も適切なものはどれですか？

正解：D

Zero-shot Promptingは、入出力の具体例を示さず、指示や要件でタスクを依頼する方法です。問題文では事前のExamplesがないため、この分類に当たります。文脈や条件を一切与えないという意味ではなく、具体例を含むFew-shotとの違いに注目します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d4-g03（基礎）

チャット画面のユーザー入力よりも前段でモデルに注入され、AI全体の役割定義やコーディング規約、安全基準などの大前提の振る舞いを拘束する指示コンテキストとして、最も適切なものはどれですか？

正解：A

System Promptは、ユーザーとの通常の対話より上位で、役割や基本方針などを定める指示です。問題文のように、回答の前提となる安全基準や振る舞いを規定する文脈に対応します。リポジトリのカスタム指示を編集することと、サービス側のシステム指示を直接変更することは同じではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)

### q-d4-g04（基礎）

「あなたは経験豊富なセキュリティアーキテクトです」のように、AIに特定の役割や専門家のペルソナを指定することで、回答の視点や評価基準を専門領域へ方向付ける手法として、最も適切なものはどれですか？

正解：B

Role Promptingは、専門家などの立場を指定して、回答の視点や確認項目を方向付ける方法です。セキュリティアーキテクトとして評価するよう求める例が、この手法に当たります。役割を与えても専門性や正しさが自動的に保証されるわけではないため、根拠の確認は必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d4-g05（基礎）

Copilotから返された初回の提案に対し、一度に完璧を求めるのではなく、対話を継続しながら不足した要件や修正点を追加指示して段階的に品質を高めていくアプローチとして、最も適切なものはどれですか？

正解：C

Iterative Refinementは、最初の回答を確認し、不足する条件や修正点を伝えて改善する進め方です。一度で完璧を求めず、対話の結果を次の依頼へ反映するという問題文の行動が対応します。同じ指示をただ繰り返すのではなく、何が不足したかを具体的に伝えることが要点です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)

### q-d4-g06（基礎）

複雑で巨大な開発要件を一度のプロンプトで依頼するのではなく、設計、実装、テストなど管理可能な小さな単位に切り分けて順次AIに指示する手法として、最も適切なものはどれですか？

正解：D

Task Decompositionは、大きなタスクを扱いやすい小さな作業へ分ける方法です。設計、実装、テストを順に依頼するという問題文の進め方が対応します。各段階の結果を確認して次へ進めるため、一度の曖昧な依頼より、不足や誤りを特定しやすくなります。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d4-g07（基礎）

不要なファイルや過去の古い会話ログが混入して重要な指示が埋もれる現象（コンテキスト希釈）を防ぐため、プロンプトに含める文脈を必要最小限に絞り込む最適化手法として、最も適切なものはどれですか？

正解：A

Context Pruningは、無関係な文脈を減らし、必要な情報を残す整理です。古い会話や不要なファイルで重要な条件が埋もれるのを避けたい今回の目的に合います。短くすることだけを優先せず、正しい判断に必要な仕様や制約を残すことが大切です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)

### q-d4-g08（基礎）

「新規の外部ライブラリを追加しない」「非推奨のAPIを使用しない」のように、AIに対して禁止事項や制約条件を明示的に指定して出力を制御するプロンプティング手法として、最も適切なものはどれですか？

正解：B

Negative Promptingは、避けたい出力や禁止する事項を明示して方向付ける依頼です。外部ライブラリを増やさない、非推奨APIを使わないという例は、今回守るべき制約を表しています。禁止事項だけで意図が曖昧になる場合は、使える手段も併せて示すと判断しやすくなります。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d4-g09（基礎）

AIの回答に前置きや余計な会話文を含めず、「TypeScriptの型定義のみを出力する」や「指定のJSONスキーマに従う」のように、返却形式を厳格に制限する指示手法として、最も適切なものはどれですか？

正解：C

Output Format Specificationは、回答の構造や形式を明示する指示です。型定義だけ、指定スキーマのJSONだけという条件は、内容の目的とは別に出力の形を定めています。形式を指定しても構文や値の正しさが保証されるわけではないため、必要ならパースや検証を行います。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d5-g01（基礎）

自然言語による仕様コメントや関数の型定義を入力として、Copilotが動作可能な関数本体や新しいコードブロックを自動生成する機能・プロセスとして、最も適切なものはどれですか？

正解：D

AI-Assisted Code Generationは、仕様や型などの入力からコードの候補を生成する作業です。コメントや関数シグネチャを基に本体を作るという問題文の動作に対応します。生成できたことと仕様を満たすことは別なので、採用前のレビューと実行確認が必要です。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d5-g02（基礎）

プログラムの外部的な振る舞いや仕様を変更することなく、内部構造を整理して可読性・保守性・拡張性を向上させる作業をCopilotで支援するプラクティスとして、最も適切なものはどれですか？

正解：A

Refactoringは、外部から見た振る舞いを保ちながら、コードの内部構造を改善する作業です。読みやすさや保守性を高めても仕様を変えないという条件が、この用語の判断材料です。Copilotの提案を使う場合も、既存テストなどで振る舞いを保てているか確認します。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d5-g03（基礎）

古いフレームワークや旧言語バージョンで書かれた既存コードを、テストによる動作保証を維持しながら現行の標準仕様や最新アーキテクチャへと段階的に刷新する作業として、最も適切なものはどれですか？

正解：B

Legacy Modernizationは、古い技術や非推奨の仕組みから現行の構成へ移行する作業です。単なる整形ではなく、フレームワークやAPIなどの更新を伴う点が問題文に合います。移行前後の動作をテストで比較し、段階ごとに確認しながら進めます。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)

### q-d5-g04（基礎）

Pythonで記述された既存の関数やクラスを、目的の言語の慣習や型システムに適合させながらTypeScriptやGoなどの別言語へ移植・変換する作業として、最も適切なものはどれですか？

正解：C

Code Translationは、既存コードを別のプログラミング言語へ移植する作業です。PythonからTypeScriptやGoへ、処理の意味を保ちながら移す今回の例に当たります。構文だけを置き換えず、移植先の型や例外処理、言語の慣習も検証する必要があります。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d5-g05（基礎）

時間計算量や空間計算量（Big-O）を改善するために、二重ループの解消や適切なデータ構造の選択を行い、処理効率を引き上げる実装改善手法として、最も適切なものはどれですか？

正解：D

Algorithm Optimizationは、アルゴリズムやデータ構造を変えて計算量や資源効率を改善することです。二重ループの見直しや適切な構造の選択という条件が、この分類に対応します。短いコードへ書き換えただけでは改善の証拠にならないため、計算量や実測で確認します。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d5-g06（基礎）

データモデルの定義、CRUD操作、シリアライズ処理など、構文上記述が必要な反復的・定型的なコードの入力負担をCopilotで自動補完・短縮する効果として、最も適切なものはどれですか？

正解：A

Boilerplate Reductionは、繰り返し必要になる定型コードの記述負担を減らす効果です。CRUDやシリアライズなどの似た構造をCopilotで補完する例が当てはまります。入力が楽になっても、生成された各項目や変換処理の正しさを確認する必要は残ります。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### q-d5-g07（基礎）

関数単体の独立した論理を検証する単体テストとは異なり、APIとデータベース、または複数モジュール間の連携動作を検証するテストコードを生成するタスクとして、最も適切なものはどれですか？

正解：B

Integration Test Generationは、複数の構成要素をつないだ動作を確認するテストの生成です。APIとDBやモジュール間の連携を対象にする今回の例に合います。一つの関数の内部だけを独立して調べる単体テストとは、検証の範囲が異なります。

- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d5-g08（基礎）

静的解析やCodeQLで検出されたSQLインジェクションや安全でない依存関係などの脆弱性に対し、安全な実装パターンへ修正・治療するセキュリティタスクとして、最も適切なものはどれですか？

正解：C

Vulnerability Remediationは、見つかった脆弱性の原因を修正し、安全な処理へ変える作業です。今回の目的はSQLインジェクションなどの欠陥を直すことなので、この分類になります。Copilotに修正を提案させた後も、解析やテストを再実行し、元の欠陥が解消したかを確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d5-g09（基礎）

CodeQLやリンターなどの決定的な静的解析ツールの警告メッセージをCopilotに入力として渡し、規格に準拠した的確な修正コードを提案させる連携プラクティスとして、最も適切なものはどれですか？

正解：D

Static Analysis Integrationは、静的解析の警告をAIによる修正支援へつなぐ使い方です。CodeQLやリンターが示す対象と理由をCopilotへ渡すことで、警告に沿った修正を依頼できます。AIが問題なしと答えたことだけで解析結果を置き換えず、修正後も同じ解析で確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning)

### q-d5-g10（基礎）

プロファイリング結果や負荷条件を提示し、メモリリーク、不要な同期I/O、非効率な反復処理などシステムの性能低下を引き起こしている原因箇所を特定する作業として、最も適切なものはどれですか？

正解：A

Performance Profilingは、時間や負荷、資源利用の観測から性能上の問題箇所を調べることです。メモリやI/O、反復処理の観測を使って原因を特定するという問題文の作業に合います。推測だけでコードを速そうな形へ変えることとは区別します。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d5-g11（基礎）

APIキーやDBパスワード、アクセストークンなどの機密資格情報をプロンプトやコードに直接記述せず、環境変数や安全な保管庫で管理して流出を防ぐセキュリティ原則として、最も適切なものはどれですか？

正解：B

Secret Leak Preventionは、資格情報をコードやプロンプトへ露出させないための対策です。安全な保管先から必要時に渡せば、共有ファイルへAPIキーを直接書くことを避けられます。ただし、環境変数を使うだけで漏洩が不可能になるわけではなく、ログや送信先の扱いも確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)

### q-d5-g12（基礎）

Copilotが生成した単体テストや統合テストをVS Code内で自動検出し、GUI上で個別に実行・デバッグ・合否ステータスを確認できる公式エディタUI機能として、最も適切なものはどれですか？

正解：C

Test Explorerは、対応するテスト拡張と連携して、テストの検出・実行・デバッグ・結果確認を行うVS CodeのUIです。Copilotが生成したテストを画面から動かすという今回の目的に対応します。テストを生成するAI機能そのものではなく、生成後のテストを扱う入口です。

- [登録されている公式資料](https://code.visualstudio.com/docs/debugtest/testing)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d5-g13（基礎）

生成テストの入力とモックを用意し、対象関数を呼び、その戻り値を期待値と比較している。コードをこの三段階に整理するテスト構造パターンとして、最も適切なものはどれですか？

正解：D

Arrange–Act–Assertは、テストを準備、対象操作、結果検証の三段階へ整理する構造です。入力とモックの用意がArrange、対象関数の呼び出しがAct、期待値との比較がAssertに当たります。テストが何を実行し、何を根拠に合否を決めるかを読み取りやすくできます。

- [登録されている公式資料](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d5-g14（基礎）

単に動作するだけでなく、信頼性、保守性、セキュリティ、処理効率、可読性など、ソフトウェアの価値を多面的に評価する非機能・品質特性の総称として、最も適切なものはどれですか？

正解：A

Code Quality Attributesは、信頼性や保守性、セキュリティ、性能、可読性などの品質上の観点です。問題文は単に動作するか以外の多面的な評価を挙げているため、この総称に当たります。一つの検査が成功しただけで、すべての品質特性を満たしたとは判断できません。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d5-g15（基礎）

システムや関数が、想定される運用環境と指定された時間枠において、障害や異常停止を起こさず継続的に正しく動作し続ける能力を表す品質特性として、最も適切なものはどれですか？

正解：B

Reliabilityは、規定された条件や期間のもとで、必要な機能を継続して果たす能力です。障害や異常停止を起こさず動くという問題文の焦点に対応します。応答が速いことを表す性能や、修正しやすさを表す保守性とは異なる評価軸です。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/write-tests)

### q-d5-g16（基礎）

例外を包括的に握り潰したり内部スタックトレースを露出させたりせず、具体的な例外型を捕捉して安全に回復・フォールバックさせる実装パターンとして、最も適切なものはどれですか？

正解：C

Safe Exception Handlingは、失敗を適切に扱い、安全に回復や通知を行うための実装です。具体的な例外に対応し、握り潰しや内部情報の露出を避けるという条件が当てはまります。例外を捕捉すること自体が目的ではなく、障害を隠さず安全な結果にすることが重要です。

- [登録されている公式資料](https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions)
- [登録されている公式資料](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/exceptions/creating-and-throwing-exceptions)

### q-d5-g17（基礎）

テストの期待値検証（Assertion）とは異なり、関数やAPIの境界で引数や外部データが前提条件（型・範囲・フォーマット）を満たしているかを検証する本番コードの実装プラクティスとして、最も適切なものはどれですか？

正解：D

Input Validationは、本番コードの入口で、外部データが必要な型や範囲などを満たすか調べる処理です。不正なリクエストをその先のロジックへ渡さないという役割があります。テスト内で結果の期待値を比較するAssertionとは、実行される場所と目的が異なります。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d5-g18（基礎）

コードコメントや関数のJSDocとは異なり、システム全体の目的、アーキテクチャ設計、前提要件、セットアップ手順などを開発者向けに体系化した設計文書群として、最も適切なものはどれですか？

正解：A

Project Documentationは、システム全体の目的や構成、導入条件、運用手順などをまとめる文書です。一つの関数の使い方だけではなく、プロジェクトの理解や利用に必要な情報を扱うという条件が当てはまります。Copilotの下書きを使う場合も、実際の構成や手順との照合が必要です。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d6-g01（基礎）

個々のリポジトリ管理者に設定を委ねず、OrganizationまたはEnterpriseの管理者が一括して定義し、傘下のリポジトリ管理者が解除・上書きできないよう強制適用するコンテンツ除外の設定レベルとして、最も適切なものはどれですか？

正解：B

組織レベルのContent Exclusionは、管理者が組織の管理対象へまとめて適用する除外です。リポジトリごとに任せず、上位の管理方針として扱う今回の意図に対応します。ただし、組織が割り当てたSeat向けの範囲とリポジトリ単位の範囲は異なるため、対象者も確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d6-g02（基礎）

Content Exclusion設定において、secretsディレクトリ配下の任意の深さにあるすべてのファイルを対象にするための再帰的なパス指定の記述例として、最も適切なものはどれですか？

正解：C

secrets/**の**は、secretsの下の複数階層を含めて対象にする指定です。直下だけでなく任意の深さにあるファイルを除外したい今回の条件に対応します。対象リポジトリの設定と組み合わせ、想定した階層へ実際に一致するか確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d6-g03（基礎）

生成コードについてGitHubは所有権を主張しませんが、他者の権利を侵害しないことが自動的に保証されるわけではありません。この確認で取り扱う法的・ライセンス上の論点として、最も適切なものはどれですか？

正解：D

Output Ownershipは、生成物の所有権や利用に関する権利を扱う論点です。GitHubが所有権を主張しないことと、第三者の権利を侵害しないことは同じ意味ではありません。出所やライセンスの条件は別に確認し、生成物という理由だけで無条件に利用できると解釈しません。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)

### q-d6-g04（基礎）

管理者がGitHub上でContent Exclusionのパス設定を変更してから、各開発者のIDEクライアントへ設定が完全に同期・反映されるまでに最大30分程度要することがある時間的遅延を表す用語として、最も適切なものはどれですか？

正解：A

Exclusion Propagation Delayは、管理側の除外設定がクライアントへ反映されるまでの遅れを指します。設定変更の直後に古いIDEで見える状態だけでは、新しいルールが無効だと断定できません。公式手順で案内される反映時間や再読込を確認し、反映後の除外表示と動作で判断します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d6-g05（基礎）

Enterprise管理者がGitHub Audit Log（監査ログ）の追跡やポリシー強制を通じて、Copilotの利用実態やセキュリティ設定が企業コンプライアンスに適合していることを証明・検証可能にする性質として、最も適切なものはどれですか？

正解：B

Compliance / Auditabilityは、設定や操作を追跡し、規則に従っていることを検証できる性質です。ポリシーを定めるだけでなく、変更履歴や監査ログを根拠として確認できる点が問題文に対応します。利用統計だけで、すべてのセキュリティ要件への適合が自動的に証明されるわけではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)
- [登録されている公式資料](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)

### q-d6-a11（応用）

Copilotの通常補完で、secrets/**/*.keyをコンテンツ除外に登録しました。secrets/readme.mdは参照させます。別途.gitignoreへsecrets/を追加した担当者が「これでCopilot除外も同じ範囲になった」と説明しています。設定の範囲を正しく評価するものはどれですか。

正解：C

Content Exclusionと.gitignoreは、目的も適用対象も異なる設定です。今回Copilotへ登録したsecrets/**/*.keyは、secrets配下の任意の階層にある.keyファイルを対象にします。

secrets/readme.mdはそのパターンに一致しないため、このルールでは除外されません。.gitignoreへsecrets/を追加しただけで、Copilotの明示的な除外範囲まで同じになるとは判断できません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-e24（高難度）

旧GitHub App型Copilot ExtensionをMCPへ移行中です。旧Extension経路は廃止済みなので使用しません。通常のGitHub AppによるIssue連携は正常です。MCPのツール一覧には社内検索が現れますが、呼出しは認可待ちで止まります。同じサーバーの公開検索は成功します。次に直す対象と、そのまま維持する経路はどれですか。

正解：A

MCPでは、サーバーへの接続、ツールの発見、各ツールを利用するための認可を分けて確認します。今回はツールが一覧に現れ、同じサーバーの公開検索も成功しているため、接続先そのものの変更を最優先にする状況ではありません。

社内検索だけが認可待ちなので、その検索を利用するための認可を完了させます。廃止されたCopilot Extensionと、通常のGitHub AppによるIssue連携は別の機能です。正常に動作しているIssue連携は維持すれば、必要な箇所だけを修正できます。

- [登録されている公式資料](https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps/)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-a19-feature-20261016（応用）

VS CodeのCopilot Chatだけ接続が不安定です。Chat DiagnosticsのReachabilityでは接続先が全て成功でしたが、同じ操作を繰り返すと失敗します。サポートは「次の再現時の詳細イベントが必要」と依頼しました。依頼内容に合う次の操作はどれですか。

正解：B

Chat DiagnosticsのReachabilityは、診断した時点で接続先へ到達できるかを調べるものです。到達性の確認が成功していても、繰り返す操作の途中で起きる失敗の詳細まで記録できたことにはなりません。

今回は次の再現時の詳細イベントが求められているので、Set Log Levelで対象のログレベルをTraceへ上げてから再現し、新しいログを採取します。採取後は通常のログレベルへ戻すことで、不要な詳細記録を続けずに済みます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/view-logs)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)

### q-d6-e03-feature-20261016（高難度）

Copilot code reviewでlegacy.tsだけがレビューされません。同じ利用者はファイルを閲覧でき、他ファイルのレビューは成功します。通常補完にはlegacy.tsの除外表示が出ています。機密解除済みのlegacy.tsをレビューへ戻しつつ、通常補完の公開コード一致は引き続き抑えます。管理すべき二つの設定と、その変更方向はどれですか。

正解：D

Content ExclusionはCopilotへ渡す入力を制御し、GitHub.comのcode reviewでも対象ファイルのレビューを制限します。公開コード一致のBlockは、通常補完で生成する候補の出力を制御する別の設定です。

legacy.tsは閲覧できても除外対象なので、レビューへ戻すにはそのファイルのContent Exclusionを解除します。一方、通常補完の公開コード一致は引き続き抑えたいので、Blockを維持します。二つの設定を同時に緩める必要はありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q01-feature-20261016（応用）

VS CodeのLocal harnessを既定の承認レベルで使います。chat.tools.terminal.autoApproveにはnpmをtrueにする規則があります。npm testは自動実行させ、npm publishだけは毎回確認したいと考えています。編集・検索の承認とsandboxは維持します。実行禁止と確認要求を区別した設定はどれですか。

正解：A

ターミナルのautoApproveのfalseは、自動承認をせず利用者へ確認する指定であり、コマンドの実行を一律に禁止する指定ではありません。広いnpmのtrue規則があっても、npm publishに一致するfalse規則があれば、その操作には確認を残せます。

npm testは既存の許可を使えるため、目的に合う差分はpublishのfalse規則の追加です。ターミナル全体の承認レベルやsandboxを変更する必要はありません。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d1-a04-feature-20261016（応用）

VS CodeのCopilotで外部MCPツールを使います。通信開始は自動承認してよい一方、取得データには外部の指示文が混ざる可能性があるため、結果をChatの文脈へ追加する前には確認したいと考えています。Chat: Manage Tool Approvalで分けて設定すべき項目はどれですか。

正解：C

MCPツールのPre-approvalは実行前、Post-approvalは実行結果を会話へ取り込む前の確認です。通信開始を自動承認してよいという条件にはPre-approvalの許可が対応します。

外部データを確認してから文脈へ入れたいという条件には、Post-approvalの自動化を外す設定が対応します。取得前と取得後を分けて設定することで、通信は進めつつ結果の確認を残せます。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d1-a07-feature-20261016（応用）

Copilot cloud agentのBashから社内仕様サイトを取得すると、Copilot firewallの拒否ログが出ます。ローカルIDEとsetup stepsでは同じサイトへ到達できます。repoの許可ドメインには社内サイトがありません。既存サイトへのアクセスとfirewallを保ったまま直す設定はどれですか。

正解：D

cloud agentのBashに対するfirewallは、ローカルIDEやsetup stepsとは別の通信境界です。今回はAgentの拒否ログがあり、許可先にも社内ドメインがないため、その境界で通信が止まっていると判断できます。

リポジトリのCopilot Internet accessへ必要な社内ドメインを追加します。既存の許可先を消したりfirewall全体を無効にしたりせず、必要な通信だけを補えます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)

### q-d1-a10-feature-20261016（応用）

GitHub Copilot CLIで既に必要なツールを許可しました。依頼した最初の作業は実行されますが、次のサブタスクへ進む前に利用者の入力を待ちます。追加のディレクトリアクセスは不要です。ツールの承認と、複数ターンの自律的な継続を分けて考えると、次に試す変更はどれですか。

正解：A

ツールの実行許可は、その操作を行ってよいかを決める設定です。一方、Autopilotは、利用者の入力を待たずに次のターンへ進み、作業を継続する動作を扱います。

今回は最初の作業を実行できており、新しいアクセス許可も不要なので、許可不足より継続モードを見直す状況です。Autopilotへ切り替え、必要に応じて継続ターン数を制限すれば、既存の権限範囲で自律的に進められます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/use-autopilot-mode)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-d2-a04-feature-20261016（応用）

Copilot CLIの設定ディレクトリにはpermissions-config.jsonとsettings.jsonがあります。repo-AとBでは同じMCPツールを個別にrepo限定で承認し、仕様サイトのURLは恒久承認しました。今後はAのツールだけ再確認させ、Bの承認は保ちます。一方、URLの恒久許可は全セッションから外します。中央の設定ファイルで変更する項目はどれですか。

正解：C

CLIが保存するツールの承認と、URLへの恒久的な許可は、同じ項目ではありません。ツール承認はpermissions-config.jsonで場所ごとの範囲を持つため、Aの承認だけを外せばBの承認を保てます。

URLの恒久許可はsettings.jsonのallowedUrlsを見直す対象です。対象URLをその共通の許可元から外すことで、Aだけでなく全セッションでの恒久許可を取り消せます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-sc05-1-feature-20261016（応用）

VS CodeのAgents windowでAを実行ワークスペースにして開始しました。添付したプロジェクトBのコードも回答に現れますが、変更はAに入ります。今回はBにある同名ファイルを変更し、Aには触れません。参照元と主な変更先を今回の方針へそろえるには、セッションをどう扱いますか。

正解：D

Agents windowで文脈として添付するプロジェクトと、変更を保存する実行ワークスペースは別の指定です。Bのコードを回答に使えていても、Aを実行先にしたセッションでは変更先はAのままです。

今回はBだけを変更したいので、Bを実行ワークスペースにしたセッションを使います。参照する資料もBへそろえることで、同名ファイルのあるAへ誤って変更する構成を避けられます。

- [登録されている公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-d2-a26-feature-20261016（応用）

VS CodeでMCPの更新ツールについてセッション中の自動承認が保存されています。現在の呼出しと次回の呼出しは、入力を見て一回ずつ承認する方針へ変えます。他ツールの保存済み承認は保ちます。どの手順を組み合わせますか。

正解：B

保存済みの自動承認を外す操作と、現在の呼び出しを一回だけ承認する操作は役割が違います。まず対象ツールのPre-approvalの自動化を外し、次回以降も入力確認が出る状態に戻します。

そのうえで現在の呼び出しは一回だけ承認します。全ツールの確認をリセットしないため、他のツールの保存済み承認は維持できます。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d1-a16-feature-20261016（応用）

VS CodeのLocal harnessでターミナルをAllow allにしましたが、作業フォルダ外の生成物へのアクセスが拒否されます。sandboxログにファイルシステム境界の拒否があり、ネットワーク拒否はありません。sandboxは維持し、必要な生成物ディレクトリだけを使わせます。変更すべき範囲はどれですか。

正解：A

Allow allは実行前の承認を扱うもので、sandboxによるファイルアクセスの境界まで解除するものではありません。今回はログがファイルシステムの拒否を示し、通信の拒否はありません。

そのため、必要な生成物ディレクトリをsandboxのファイルシステム許可先へ追加します。ネットワーク設定やsandbox全体を変更せず、拒否されたパスだけへ対応する判断です。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d1-a17-feature-20261016（応用）

VS CodeのCopilot Chatで、別フォルダにある同名のparse関数を比較します。ファイル全体やフォルダ全体ではなく、二つの関数を文脈として明示したいと考えています。片方のファイルしか開いていないとき、どの操作が合いますか。

正解：B

Add ContextのSymbolsは、ファイル全体ではなく関数などのシンボルを指定するための入口です。別フォルダの同名関数を区別するには、両方の対象ファイルを開いて、それぞれの関数を選べる状態にします。

そのうえで二つのparse関数を明示的な文脈へ加えます。フォルダ全体を渡す方法より、比較対象の二つを関数単位で指定する要件に合います。

- [登録されている公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-d1-a18-feature-20261016（応用）

CopilotがPRをレビューした後で、人が指摘へ対応してpushしました。repoのReview new pushesは無効で、今後も自動レビューは増やしません。変更済みコードへの指摘が解消したかをCopilotにもう一度確認させます。コード修正の追加依頼と区別して選ぶ操作はどれですか。

正解：C

レビュー後にコードを変更しても、Review new pushesが無効なら、そのpushだけを理由に自動再レビューは始まりません。今回は人が修正を終えており、求めているのはその変更の再評価です。

PRのレビュー担当からCopilotへ一回の再レビューを依頼すれば、更新後の差分を確認させられます。自動レビューの設定を増やさず、追加のコード修正タスクも作らないため、問題文の二つの条件を満たします。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d1-a19-feature-20261016（応用）

VS CodeのCopilotへ接続したMCPサーバーはsearchとupdateを提供します。updateの自動承認を外したところ、Agentはupdateを選び続けて確認待ちになります。今はsearchを使い続け、updateを選ぶ試行自体を止めます。他のChatへ影響を広げない変更はどれですか。

正解：D

自動承認を外しても、ツールが候補一覧に残っていればAgentはそのツールを選択できます。今回は実行前確認を増やしたいのではなく、updateを選ぶ試行自体を止めたいので、提供する候補を変えます。

現在のChatのツール選択でupdateだけを無効にすれば、そのChatでは選択されなくなります。同じサーバーのsearchと他のChatの設定を保てる点も要件に合います。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/tools)

### q-d1-a21-feature-20261016（応用）

組織所有のCopilot Spaceに、非公開repoの資料とアップロード資料があります。一般メンバーXにはSpaceの名前も見せず、管理担当Yには使わせます。Yは既にrepoを閲覧できますが、Spaceの共有には登録されていません。repo権限を変えずに行うSpace側の設定はどれですか。

正解：B

組織所有のSpaceでは、組織メンバーへの既定のアクセスと、特定の利用者への共有を分けて設定できます。Xには名前も見せたくないため、既定をNo accessにしてSpaceを隠します。

そのうえでYへviewerを付与すれば、Yだけに必要な利用権を補えます。Yの元リポジトリの閲覧権はすでにあるので、変更するのはSpace側の共有設定です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)

### q-d1-e01-feature-20261016（高難度）

Copilot cloud agentへ依頼したAが、生成されたPRの確認を担当しています。既定の設定でワークフローが承認待ちです。AもBも書込権限を持ち、Bはタスクの依頼者ではありません。このPRには人による必須承認も必要です。変更内容の確認後、ワークフロー実行と必須レビューを進める担当の組合せはどれですか。Aが行える承認はAが担当する方針です。

正解：B

ワークフローの実行承認と、PRの必須レビューの承認は、目的も権限制約も異なります。既定のcloud agentのPRでは、書込権限を持つ人が内容を確認してワークフローの実行を承認できます。

一方、そのタスクを依頼した人は、生成されたPRの承認者にはなれません。したがって、Aが実行を承認し、依頼者ではないBが人のレビューを承認する組み合わせになります。これは、Aが行える承認はAが担当するという問題文の方針にも一致します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations)

### q-d1-e02-feature-20261016（高難度）

VS CodeでCopilotの公開コード一致を許可しています。候補Pは表示後に破棄し、候補Qは編集せず採用しました。監査担当は、採用履歴の参照情報からPとQそれぞれの公開コード一致と、コードの安全性を証明しようとしています。この履歴の取得範囲と、証明できる内容の組合せはどれですか。

正解：C

コード参照は、採用した候補と公開コードとの一致を確認するための情報であり、候補すべての安全性を認定する記録ではありません。Qは編集せず採用したため、採用時の一致参照を調べる対象になります。

Pは破棄した候補なので、採用履歴からPの一致を判定できるとはいえません。また、Qに参照があっても、脆弱性がないことや権利処理がすべて済んでいることは証明されません。記録の対象範囲と、その記録が裏付ける内容を分けて判断します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d1-e07-feature-20261016（高難度）

VS CodeのLocal harnessで、URL取得と外部MCP検索を比較します。URLはapproveRequest: false、approveResponse: true、MCP検索はPre-approvalなし・Post-approvalなしです。通信開始の確認方針は維持し、外部データをChatへ入れる前には両経路で毎回確認します。変更対象の組合せはどれですか。

正解：A

外部データの取得では、通信・実行を始める前の確認と、返された内容を会話へ取り込む前の確認が別段階です。URLのapproveResponseがtrueである状態は応答の取り込みを自動承認するため、毎回確認するにはfalseへ変えます。

MCP検索ではPost-approvalの自動化を外し、結果を取り込む前の確認を有効にします。通信開始の方針を保つ条件があるため、URLのapproveRequestとMCPのPre-approvalは変えません。応答側の二つだけを変更することで、必要な境界に確認を戻せます。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d1-e08-feature-20261016（高難度）

Copilot approvalsのpublic previewを利用できるrepoで、CopilotがApproveを出しました。しかし必須承認数は減りません。上位の設定は利用を許可し、人による必須承認の設定は維持します。自動レビューは既に動きます。この観測から不足する設定と、変更後も別に満たす要件はどれですか。

正解：C

CopilotがApproveを出せることと、その承認がマージ要件へ数えられることは別の設定です。今回はApproveが実際に出ているので、承認の生成を許可する設定だけを見直しても不足は解消しません。

上位設定が許可しているという条件のもとで、Copilotの承認をマージ要件へ数える設定を有効にします。ただし、人による必須承認も維持すると明示されています。その要件まで削除せず、人のレビューは別途受ける必要があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)

### q-d5-e02-feature-20261016（高難度）

VS CodeのCopilotでread_reportは確認なしで実行できます。update_recordも実行前確認が出ず、実行後の結果だけ確認を求められます。今後はupdate_recordの入力を毎回確認し、結果取込前の確認とread_reportの設定は維持します。候補ツールを減らさずに直す操作はどれですか。

正解：B

Pre-approvalはツールを実行する前の入力・操作の確認、Post-approvalは実行結果を取り込む前の確認です。update_recordは結果の確認がすでに出ているため、足りないのは実行前のPre-approvalです。

Manage Tool Approvalでupdate_recordのPre-approvalの自動化だけを外せば、今後は入力を確認してから実行できます。Post-approvalとread_reportの設定には触れないため、維持する条件も満たします。ツール自体を無効にする方法では、必要な操作を確認付きで使うという目的を果たせません。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/approvals)

### q-sc02-2-feature-20261016（高難度）

Copilot cloud agentのタスクはrepo-Aを変更先にして始めました。repo-Bのコードを読むMCPは接続済みで、Bを含む説明は得られますがBのPRは作られていません。今回はAのAPI変更とBの呼出側変更をそれぞれPRにし、双方で相手repoの仕様を参照させます。参照権限と変更先を分けた進め方はどれですか。

正解：D

MCPで別リポジトリのコードを参照できても、cloud agentのタスクの変更先が増えるわけではありません。Aを変更先にしたタスクへBの情報を渡すだけでは、Bを変更するPRの作成まで行う構成にはなりません。

今回は両方にPRが必要なので、AとBをそれぞれ変更先とする別タスクを用意します。そのうえで相手側の仕様を読むための文脈を両方へ提供します。変更を行う範囲と、判断のために参照する範囲を分けることが要点です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)

### q-d1-e09-feature-20261016（高難度）

Copilotのコード参照で、昨日初めて公開したrepo-Pのコードと、非公開のままのrepo-Qのコードを照合しました。どちらも参照は表示されませんでした。担当者は「参照なしなので独自実装として扱える」と判断しています。公開コード索引の範囲と反映時点から、PとQの結果をどう扱いますか。

正解：A

公開コード参照の検索対象と、索引に反映される時点には限界があります。Pは公開されたばかりで、参照が出ないという結果だけでは索引への反映が済んだと判断できません。

Qは非公開のままなので、公開コード索引を使う照合の対象外です。二つの結果は理由が異なり、どちらも独自実装である証明にはなりません。参照が表示されないことを過大評価せず、出所や利用条件は別途確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d2-e02-feature-20261016（高難度）

Copilotの個人設定では自動レビューと追加pushのレビューを無効にしています。一方、PRに一致するrepo rulesetは両方を有効にしています。このPRだけでなく今後も、初回の自動レビューは続け、追加pushでは自動起動しない運用へ変えます。他の起動源はありません。変更すべき設定元と項目はどれですか。

正解：B

Copilotの自動レビューは、個人設定とリポジトリのrulesetなど、複数の起動元からそれぞれ要求されます。個人設定を無効にしても、一致するrulesetが有効にしているレビューを止めることはできません。

今回は個人側がすでに無効で、追加pushを起動対象にしているのはリポジトリのrulesetです。そこで、そのrulesetのReview new pushesだけを無効にします。自動レビュー全体は有効のままなので、初回のレビューを継続する条件も満たせます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-d2-e15-feature-20261016（応用）

CopilotのカスタムAgent「文章整理」で、接続済みのMCP検索を使えません。一般のAgentでは同じMCP検索が使え、認証も成功します。「文章整理」のプロファイルにはtools: []があります。検索だけを利用可能にし、編集・実行は使わせない変更はどれですか。

正解：C

カスタムAgentのtools: []は、利用可能なツールを空にする指定です。他のAgentから同じMCP検索を使えているので、今回はサーバー接続や認証の不足を示す状況ではありません。

「文章整理」のtoolsへ必要な検索ツールを明記すれば、そのAgentへ検索を提供できます。toolsを丸ごと省略して範囲を広げるより、編集・実行を含めない条件に合います。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

### q-d2-e19-feature-20261016（高難度）

Copilot Spaceに、GitHub上の仕様ファイルへのリンクと、同じ仕様のPDFをアップロードしています。GitHubの同じパスは改訂済みです。Spaceの回答はリンク側の新版を引用する一方、PDFの旧要件も引用します。リンクの継続追従は保ち、旧要件の混入だけを直します。資料の種類を踏まえた更新はどれですか。

正解：C

Spaceに追加したGitHub上の資料と、アップロードしたファイルでは、更新の仕組みが異なります。GitHubへのリンクは元資料の変更に追従しますが、アップロードしたPDFの内容は元資料の更新だけでは置き換わりません。

今回、リンク側は新版を引用できているため、そのリンクを外す必要はありません。旧要件の出所となっているアップロードPDFを現行版へ差し替えます。これにより、リンクの継続追従を保ちながら、旧版が文脈に混ざる原因を取り除けます。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)

### q-d6-e02-feature-20261016（高難度）

組織はCopilot code reviewと、Only allow Copilot code review to be triggered by authorized usersを有効にしています。Xは外部で取得した対応ライセンスだけを持ち、この組織が認める利用者ではありません。Xからの個別依頼と、このPRに一致する有効な組織rulesetからの自動レビューについて、起動できる経路の組合せはどれですか。

正解：D

authorized usersの制限では、個人からのレビュー依頼と、組織が設定したrulesetによる自動レビューを区別します。Xは外部ライセンスを持っていても、この組織が認める利用者ではないため、個別の依頼は制限されます。

一方、条件に一致する有効な組織rulesetは自動レビューを起動できます。個人への制限を、そのまま組織の自動起動へ広げて解釈してはいけません。したがって、Xの依頼は止まり、rulesetのレビューは動く組み合わせです。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-sc03-1-feature-20261016（応用）

スクリプトからGitHub Copilot CLIへ一つのプロンプトを渡します。回答後にプロセスを終了し、標準出力には利用統計を付けず回答だけを受け取りたい場合、どの起動オプションの組合せが合いますか。

正解：D

CLIの-pはプロンプトを渡して非対話で実行し、回答後に終了するための指定です。それだけでは出力へ利用統計などが含まれる場合があるので、回答だけを標準出力で受け取る条件には--silentも組み合わせます。

一回の実行と出力の形式を、別々のオプションで指定するのが要点です。セッションの選択や再開のオプションは、この出力要件を満たすためのものではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-sc03-2-feature-20261016（高難度）

VS CodeのLocal harnessで、同じ未コミット変更を持つローカルAgentのPとQを比較します。Pはsandboxのパス許可が足りていますが、npm testの実行前に毎回確認が出ます。QはAllow allでも外部テストデータのパスがsandboxで拒否されます。npm testだけは自動実行を認め、両方のsandboxと他コマンドの確認は保ちます。セッション別の変更はどれですか。

正解：A

実行前の承認とsandboxのファイルアクセス制限は、独立した制御です。Pはパスの許可が足りており、止まっているのはnpm testの確認なので、そのコマンドに一致するautoApproveのtrue規則で対応します。

QはAllow allでも対象パスを読めないため、承認の追加ではなくsandboxのパス許可を見直します。必要なテストデータのパスだけを許可すれば、sandbox自体を解除する必要はありません。このように原因となった段階だけを変えると、他のコマンドの確認や既存の保護を維持できます。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/tools)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/approvals)

### q-sc07-1-feature-20261016（応用）

Copilot CLIの復旧スクリプトで、値なしの--resumeを使うと選択画面へ進めず失敗しました。TTYはなく、直近セッションは別タスクです。再開するIDは記録されており、会話履歴を保ったままその作業を続けます。置き換える指定はどれですか。

正解：A

値なしの--resumeは再開するセッションの選択に使いますが、TTYのないスクリプトでは選択画面へ依存できません。今回は再開すべきIDが記録されているため、--resume=IDで対象を直接指定します。

これなら対象の会話履歴を保ったまま作業を再開できます。--continueは直近のセッションを選ぶため、直近が別タスクという条件には合いません。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-d3-a03-feature-20261016（応用）

VS CodeのCopilot Chatで設計書を比較します。現行版spec-v2.mdは開いていますが、検索ではspec-v1.mdも候補になります。今回は現行版のファイル全体を必ず文脈に指定し、旧版は検索で必要なら参照させます。対象を確定する添付方法はどれですか。

正解：C

索引や自動検索は、関連するファイルを探す仕組みであり、特定ファイルを明示添付する操作とは異なります。今回は現行版spec-v2.mdの全体を指定する必要があるので、Add ContextのFilesからそのファイルを選びます。

旧版を検索可能なままにしても、今回の対象を現行版として明示できます。ただし、添付した内容が回答で正しく使われたかは、回答と資料を照合して確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/repository-indexing)
- [登録されている公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-d3-e02-feature-20261016（高難度）

Copilot Businessを使う二つの環境で、VS CodeからGitLabの作業repoを意味索引化しようとしています。一方はGitHub.com、もう一方はGHE.comに接続します。クライアントは対応版で、Semantic indexing for non-GitHub repositoriesの組織ポリシーはUnconfiguredです。GitHub.com側で必要な管理操作と、GHE.com側の対応可否について、正しい組合せはどれですか。

正解：B

外部リポジトリの意味索引には、クライアントの対応だけでなく、管理ポリシーと接続先の対応範囲という条件があります。Copilot Businessの管理対象では、該当ポリシーのUnconfiguredを利用許可と解釈せず、GitHub.com側で有効化する必要があります。

一方、GHE.com側はこの外部リポジトリ索引の対象外なので、同じポリシー変更だけでは利用できません。GitHub.com側の管理操作とGHE.com側の対応可否を別々に判断します。また、索引化は検索のためのデータをGitHubへ送る処理であり、ローカルだけで完結するという理解も適切ではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/repository-indexing)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)

### q-sc08-2-feature-20261016（高難度）

Copilot cloud agentの新規タスクで依存取得が失敗します。session logではcopilot-setup-steps jobの資格情報読込stepが失敗し、それ以降の取得stepは実行されていません。ローカルIDEでは成功し、cloud側のMCP検索も成功します。同じcloud環境で準備を再現可能にするには、最初に何を直して検証しますか。

正解：C

cloud agentのsetup stepsは、Agentが本作業を始める前に環境を準備するための処理です。途中のstepが失敗すると後続のstepは省略され、Agentはその時点の環境で作業を始める場合があります。

今回は資格情報の読込で失敗しており、依存取得はまだ実行されていません。そこでcopilot-setup-stepsの資格情報設定を直し、新規タスクのログで後続の取得まで進んだことを確認します。ローカルIDEや別経路のMCP検索が成功していても、このsetupの資格情報が正しい証拠にはなりません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)

### q-d3-e07-feature-20261016（高難度）

同じ社内端末でCopilotの通常補完は動きますがChatだけ接続できません。認証とSeatは正常です。ネットワーク担当はgithub.comへのブラウザ接続を確認済みです。次にCopilot固有の診断を取得し、失敗した経路だけを調べます。診断の入口と、障害側で確認するping先の組合せはどれですか。

正解：D

通常のGitHub画面、コード補完、Chatは、同じ接続経路だけを使うわけではありません。github.comをブラウザで開けても、Chat用APIへの通信が成功するとは限りません。

まずChat DiagnosticsのReachabilityでCopilot固有の到達性を確認します。今回は通常補完が動いてChatだけが失敗するので、Chat側のapi.githubcopilot.com/_pingへの経路を調べます。認証やSeatを変更する前に、失敗しているサービスの経路を絞り込む判断です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/view-logs)

### q-d3-a16-feature-20261016（応用）

ローカルVS CodeでAPIの型を変更しました。GitHubの同じbranchは旧型で、まだcommitもpushもしていません。GitHub.comのCopilot Chatは旧型を使って回答しました。修正を公開せず、型定義全体を読み取った説明が必要です。次に指定する文脈と実行場所はどれですか。

正解：B

GitHub.comから参照するリポジトリには、まだcommit・pushしていない手元の変更は含まれません。同じブランチ名でも、GitHub上の旧型とローカルの修正済み型は内容が異なります。

公開せずに修正済み型の全体を説明させるには、ローカルIDEのChatからその型定義ファイルを明示添付します。参照場所を手元へ合わせることで、必要な情報を渡しながら未共有の状態を保てます。

- [登録されている公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/repository-indexing)

### q-d3-a06-feature-20261016（応用）

VS CodeのLocal harnessでPrompt Fileを作りました。argument-hint: moduleを指定しても、入力を待たずに一般的な回答になります。今回は未入力なら対象モジュールを尋ねるようモデルへ指示し、再利用する本文内でその値を使います。入力UIの強制機能とみなさず、どこを直しますか。

正解：D

argument-hintはプロンプトを呼ぶときの引数の案内で、本文へ対象値を渡す指示の代わりではありません。本文に${input:module:対象モジュールを入力}を置き、未入力なら対象を尋ねてその値を使う意図を伝えます。

これにより、再利用する本文のどこで対象モジュールを扱うかを明示できます。ただし、モデルへの指示としての振る舞いなので、必ず入力画面を強制する仕組みと解釈しないことが大切です。

- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/prompt-files)

### q-d3-a07-feature-20261016（応用）

VS CodeのLocal harnessにreview.prompt.mdを保存しました。frontmatterはname: inspect、tools: [read]で、agentは省略しています。このプロンプトを使う際、呼び出すコマンド名と既定の実行Agentの組合せはどれですか。

正解：A

Prompt Fileにnameを指定すると、呼び出し名はファイル名よりその値が優先されます。そのためreview.prompt.mdでも、今回のコマンド名は/inspectです。

また、toolsを指定してagentを省略した場合の既定はagentになります。ファイル名から/reviewと推測したり、tools指定がない場合の既定と混同したりせず、frontmatterの二つの条件を照合します。

- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/prompt-files)

### q-d4-a01-feature-20261016（応用）

VS CodeのLocal harnessで、現在のmodel pickerは利用可能なモデルMを選択しています。使うPrompt Fileにはmodel指定がありません。このプロンプトだけは別の利用可能なモデルNで実行し、通常の選択Mは維持したい場合、必要な設定だけを変える案はどれですか。

正解：C

Prompt Fileのmodelは、そのプロンプトで使用するモデルを指定するための項目です。指定がない場合はmodel pickerの選択を使いますが、今回はそのプロンプトだけNへ切り替えたいのでmodel: Nを追加します。

通常のmodel pickerはMのままにできるため、他の依頼の既定を変える必要はありません。どちらも利用可能なモデルであるという問題文の条件のもとで、この限定した変更が成立します。

- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/prompt-files)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/ai-models/supported-models)

### q-d4-a02-feature-20261016（応用）

VS CodeのCopilot Chatで#fetchから仕様URLを読みました。直後にサイトが更新され、ブラウザでは新版ですが、同じURLを再取得したChatは旧版を引用します。URLと質問、モデルは同じです。内容の手動コピーはせず、CopilotのWeb参照を更新するために試す操作はどれですか。

正解：D

VS CodeのWeb取得にはキャッシュがあるため、ブラウザで新版が見えてもCopilot側が同じ時点の内容を使うとは限りません。今回はURLなどを変えていないのに旧版を引用しており、取得側のキャッシュを切り分ける状況です。

VS Codeを再起動して同じURLを取り直す操作が、Copilot側の再取得を試す方法になります。質問やモデルを変えるだけでは、参照元の取得内容が更新されたか確認できません。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/concepts/context)
- [登録されている公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-d4-e05-feature-20261016（高難度）

VS CodeのLocal harnessで、主AgentからSubagentへ調査を委任したところ主会話の文脈は短くなりました。しかし両者のツールは同じ作業ディレクトリへアクセスします。今回は中間文脈の分離を保ち、調査中はファイル編集も実行も許可せず、読取・検索だけを認めます。追加worktreeは作りません。Agent定義の変更はどれですか。

正解：A

Subagentは中間の調査内容を主会話から分けられますが、それだけでファイルシステムが別になるわけではありません。今回は同じ作業ディレクトリにアクセスするため、ツールが許せば調査中にもコードを変更できてしまいます。

Subagentのtoolsをreadとsearchへ限定すれば、必要な読取・検索を残し、編集・実行のツールを提供しない構成にできます。委任を続けるので文脈の分離も維持できます。ただし、これはAgentへ提供するツールの制限であり、OSレベルの隔離保証とは分けて扱います。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/concepts/context)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

### q-sc02-3-feature-20261016（応用）

VS CodeのLocal harnessで、パス別指示がAgent Customizationsには表示されます。ファイルの存在と発見は確認できましたが、回答が規約と違います。指示の未読込と、読込後に指示へ従わなかった場合を分けたいと考えています。遵守は回答内容と別途照合するとして、今回の回答への読込を調べる表示はどれですか。

正解：B

Agent Customizationsに表示されることは、指示ファイルの存在と発見の確認になります。それだけでは、今回の回答にその指示が読み込まれたかまでは区別できません。

回答のReferencesで対象指示の参照を調べると、今回の文脈へ入ったかを確認する手掛かりになります。ただし、参照されたことと内容に従ったことは別なので、規約への遵守は回答を読んで照合する必要があります。

- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/custom-instructions)

### q-d3-a14-feature-20261016（応用）

VS CodeのCopilotで、社内仕様はMCPのsearch_catalog、作業repoは通常のコード検索へ分かれています。両方とも有効で接続済みですが、同名APIについて質問するとrepo内の旧説明だけが使われます。今回は社内カタログの検索結果を明示的に使います。入力時の指定はどれですか。

正解：C

MCPが接続済みでも、Agentが毎回その検索を自動的に選ぶとは限りません。今回の回答はリポジトリ内の旧説明を使っているため、必要な検索経路を明示するのが適切です。

#のツール候補からsearch_catalogを選び、対象API名を渡せば、社内カタログを調べる意図を指定できます。モデルの変更や通常検索の繰り返しより、参照したい情報源へ直接対応する操作です。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/tools)

### q-d4-e07-feature-20261016（高難度）

cloud agentのカスタムAgentをVS Codeへ移しました。定義にはmcp-serversとtools: [read, catalog/search]があります。VS Code側のMCP一覧にはcatalogがなく、同じAgentで内蔵読取だけは使えます。今後はcatalog/searchだけを追加し、既存のツール制限は保ちます。接続定義とツール定義をどの順で扱いますか。

正解：D

カスタムAgentに書いたツール名と、実行するクライアントのMCP接続設定は別の役割を持ちます。GitHub用のAgent定義にmcp-serversがあっても、それだけでVS Codeに同じサーバー接続が作られるわけではありません。

内蔵読取だけが動き、VS Codeの一覧にcatalogがないため、まずVS Code側へcatalogを登録します。そのうえでtoolsのreadとcatalog/searchは維持します。必要な接続を補うだけなら、利用可能なツールの範囲まで広げる必要はありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)

### q-d4-e08-feature-20261016（高難度）

GitHub.comでEnterprise、Organization、repoに同名のカスタムAgentがあります。repo版を選んで作ったPR-Pの後で、repo版だけを更新しました。その後P内で追加依頼し、同じbranchから新規タスクQも開始します。追加依頼と新規タスクで使われる定義を、階層と版の二点から判定するとどれですか。

正解：C

同名のカスタムAgentがある場合は、より近い階層であるリポジトリの定義が組織・Enterpriseの定義に優先します。さらに、Agentが作ったPR内の追加対話では、開始時のAgentの版を使って一貫性を保ちます。

そのためPへの追加依頼は、更新前の開始時のrepo版を使います。新規タスクQは開始時点で対象ブランチの最新定義を使うため、更新後のrepo版です。定義の優先階層と、いつの版が選ばれるかを別々に照合します。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

### q-d2-e01-feature-20261016（高難度）

Copilot cloud agentのsetupを比較します。repo-Pはdefault branchの正しいworkflowパスにjob prepareがあり、repo-Qはjob copilot-setup-stepsを持ちますがfeature branchにしかありません。両方とも通常Actionsとしては成功します。新規Agentタスクで準備を使えるようにする、repo別の最小修正はどれですか。

正解：B

Copilot専用のセットアップは、通常のActionsとして成功するだけで読み込まれるわけではありません。指定されたworkflowのパスに加えて、copilot-setup-stepsというjob名とdefault branchへの配置が必要です。

Pはdefault branchの正しい場所にあるので、prepareというjob名を修正します。Qはjob名が正しいため、workflowをdefault branchへ反映します。各リポジトリで不足している読込条件だけを補うのが最小の変更です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)

### q-d2-e07-feature-20261016（高難度）

GitHub Copilot CLIでカスタムAgentを使います。プロファイルはtools: [read, search, edit, execute]です。起動オプションは--available-tools=view,grepで、テスト実行用に--allow-tool=shellも指定しました。通常の読取は成功しますが、編集とテストができません。観測に合う原因と、直すべき設定層はどれですか。必要な編集・実行は承認して行います。

正解：C

カスタムAgentのtoolsと、CLIのavailable-tools、実行を許可するallow-toolは異なる段階の設定です。Agentのプロファイルがeditとexecuteを認めていても、CLIからモデルへ渡される実ツールがviewとgrepだけなら、編集やコマンド実行の手段がありません。

shellへの実行許可も、候補から外れたツールを追加する設定ではありません。CLIの利用可能ツールへ、環境に合う編集・実行の実ツール名を追加する必要があります。その後に必要な操作を承認することで、機能の提供と実行権限の両方を満たせます。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/tools)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-d4-e01-feature-20261016（高難度）

Copilot cloud agentが作った既存PRへ、閲覧権限のAが@copilotで追加修正を依頼しましたが作業が始まりません。書込権限のBも参加でき、Agent機能とライセンスは有効です。変更対象とbranchはそのPRのままで、新しいPRは増やしません。最小の依頼し直し方はどれですか。

正解：D

cloud agentへの追加作業の依頼には、対象リポジトリへの書込権限が必要です。閲覧権限でPRを読めることと、AgentにそのPRのブランチを変更させられることは同じではありません。

Aの依頼が始まらない一方、機能とライセンスは有効なので、依頼者の権限が判断材料になります。書込権限を持つBから既存PRへ@copilotで依頼し直せば、同じ変更先で作業を続けられます。新しいIssueやPRへ移す必要はありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d5-a09-feature-20261016（応用）

VS Codeのgithub.copilot.enableは{"*": true, "markdown": true}です。Markdownの自動インライン提案だけを止め、TypeScriptを含む他言語の提案とChatは維持します。個人の言語別設定を変更する場合、必要な差分はどれですか。

正解：B

github.copilot.enableでは、*の既定値と、個別言語の有効・無効を分けて指定できます。markdownをfalseへ変え、*のtrueを残すと、Markdownだけ自動インライン提案を止められます。

TypeScriptなど、個別に無効化していない他言語は既定のtrueを使えます。この設定はインライン提案の有効範囲なので、Chatを維持するためにChatモデルなどを変更する必要はありません。

- [登録されている公式資料](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)

### q-d5-e01-feature-20261016（高難度）

VS CodeのAgents windowでrepo-Aを実行先にして、repo-Bを資料添付しました。Bの未コミット変更を含む説明は得られますが、修正はAへ保存されます。GitHub上のBにはその変更がありません。今回はBの手元の変更を公開せず、Copilotに編集・実行を反復させます。実行先、文脈、役割をそろえる構成はどれですか。

正解：A

添付ファイルは回答のための文脈であり、Agentがコードを保存・実行するワークスペースを切り替える指定ではありません。Bを添付しただけでは、実行先がAのままなので修正もAへ保存されます。

また、Bの未コミット変更はGitHub上にないため、それを使って反復するには手元のBの作業環境が必要です。Bを実行ワークスペースにしたローカルAgentを選ぶと、手元の変更を文脈に使いながら、同じ場所で編集と実行を行えます。公開せずに進める条件にも合います。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/tools)
- [登録されている公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-sc02-1-feature-20261016（高難度）

Copilot code reviewがfeature/authからmainへのPRに指摘を出しました。Fix with Copilotで修正を委任します。元PRへの直接コミットを避け、修正だけを別PRで確認してから元の変更へ取り込みます。修正の成果物と、元の変更への取り込み方として合うものはどれですか。

正解：D

元PRの変更元はfeature/auth、取り込み先はmainです。Fix with Copilotで修正を別PRにする場合、修正だけを元PRの変更へ加えるには、その修正PRの宛先をfeature/authにします。

そこで修正内容を確認して取り込めば、元PRに修正が反映されます。その後、更新された元PR全体を評価してmainへ進めます。修正PRを先にmainへ送る方法では、元PRの変更元へ修正を取り込んで確認するという順序を満たせません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d4-a14-feature-20261016（応用）

CopilotのカスタムAgentを専門タスク用に用意しました。利用者が選択して呼ぶことは認めますが、Copilotが文脈から自動的にそのAgentへ委任するのは止めたい場合、どの定義が合いますか。

正解：B

モデルが文脈からAgentを呼び出してよいかと、利用者が手動で選べるかは別の設定です。disable-model-invocationをtrueにすると、モデル側の自動的な呼び出しを止める意図になります。

user-invocableをtrueにすれば、利用者による選択は認められます。二つを組み合わせることで、専門Agentを手動専用にする今回の方針を表せます。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

### q-d5-a14-feature-20261016（応用）

GitHub.comでCopilotのレビュー指摘へ返信しましたが、コードは変わりません。指摘はまだ妥当で、人による修正コミットもありません。次はCopilotに修正を委任し、作られた差分を確認してから採用したいと考えています。利用可能なcloud agentへ作業を渡す操作はどれですか。

正解：A

Copilotのレビューコメントへ普通に返信することと、Agentへコードの修正作業を委任することは別です。今回は指摘が妥当なままで、修正コミットもないため、再レビューだけを頼んでも修正を作る目的は満たせません。

指摘のFix with Copilotから依頼を作ると、その指摘をcloud agentの修正作業へ渡せます。作成された差分を人が確認してから採用する、という手順につなげられます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d3-e08-feature-20261016（高難度）

Copilot cloud agentで同一サイトへの要求を比較します。setup stepsとMCPサーバープロセスは成功し、AgentのBashだけが失敗します。session logにはCopilot firewallによる拒否が記録されています。経路ごとに通信制御の範囲を分けると、次に直す設定はどれですか。

正解：A

Copilotの組み込みfirewallは、cloud agentが使う通信経路のすべてに同じ形で適用されるわけではありません。setup stepsやMCPサーバーの通信が成功していても、AgentのBashからの通信が許可されている証拠にはなりません。

今回はBashの失敗に対応するfirewall拒否ログがあり、直すべき境界を特定できています。リポジトリのInternet accessへ必要なドメインを追加するのが適切です。成功しているsetupやMCPを変更するより、拒否された経路の許可先を修正します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)

### q-d5-e06-feature-20261016（高難度）

GitHub.comでCopilotの自動レビューをrulesetだけから起動します。通常PRでは初回に動き、draft作成時にも動きますが、レビュー後のpushでは動きません。通常PRの初回と追加pushを対象にし、draft作成時は対象から外す方針です。既存PRへの個別依頼は増やしません。rulesetのどの変更を組み合わせますか。

正解：B

自動レビュー全体の起動、draft時のレビュー、追加pushのレビューは分けて設定できます。今回はrulesetだけが起動元で、通常PRの初回はすでに動いています。

draft作成時のレビューを止めるにはReview draft pull requestsを無効にし、追加pushも対象にするにはReview new pushesを有効にします。自動レビュー全体の設定は維持するので、通常PRの初回は引き続き対象です。個別依頼を増やさず、二つのイベントの扱いだけを変えられます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-d1-e04-feature-20261016（応用）

Copilot Businessを運用する同一Enterprise内に組織AとBがあります。担当者はAのOrganization ownerですが、Bのrepo-RではMaintainロールです。Aで配布するSeat向けのContent Exclusionと、Bのrepo-R内のContent Exclusionをそれぞれ変更したいと考えています。追加の権限を得る前の、この担当者による設定変更の可否はどれですか。

正解：A

Content Exclusionを変更できるかは、設定する場所での権限を確認します。担当者はAのOrganization ownerなので、Aが配布するSeat向けの組織設定を変更できます。

一方、Bのrepo-Rで持つMaintainは、除外設定を閲覧できても変更するための管理権限には足りません。Aでのowner権限をBのリポジトリへ持ち越して解釈しないことが判断の要点です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-sc05-3-feature-20261016（応用）

組織のCopilot Seat利用者について、Git repo内とGit管理外の作業フォルダの両方の任意の階層で.envファイルを通常補完の対象から外したいと考えています。どの組織設定の書き方が対象範囲に合いますか。

正解：D

組織の除外設定でキーに*を使うと、特定のGitリポジトリだけでなくGit管理外のファイルも含む範囲を指定できます。対象パターン**/.envは、任意の階層にある.envという名前のファイルへ一致します。

今回はGit内外と全階層の両方が必要なので、このキーとパターンの組み合わせが合います。リポジトリ名やルート直下だけのパスを指定すると、必要な範囲を取りこぼします。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-sc10-3-feature-20261016（高難度）

組織のCopilot除外でgit@host.example:team/repo.gitのsecrets/**を登録しました。Pのremoteはhttps://host.example/team/repo、Qはssh://user@host.example:2222/team/repo.git、Rはhttps://host.example/team/forkです。対応する通常補完を使い、全員のファイルパスと設定反映は同じです。除外が適用されるcloneの組合せはどれですか。

正解：C

組織の除外ルールでは、まずリポジトリの識別を照合し、その中のファイルパターンを適用します。リポジトリURLのプロトコルやユーザー名、ポートなどの表記差は正規化されるため、PとQは登録したteam/repoに対応します。

Rは同じhostでもteam/forkという別のリポジトリパスです。コードの複製やforkであっても、このrepoルールの対象には自動的になりません。したがってPとQが対象になり、Rへは別途適切なルールが必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d6-a13-feature-20261016（応用）

Copilot通常補完で、private/SECRETS.ENVが除外されています。管理者の設定はrepo直下の/private/secrets.envだけです。別フォルダのsecrets.envは参照でき、private/readme.mdも参照できます。この結果を設定エラーと判断する前に確認すべき、パターンの性質はどれですか。

正解：A

Copilotのコンテンツ除外パターンは、大文字と小文字を区別せずに照合されます。そのため/private/secrets.envという指定は、同じ場所のprivate/SECRETS.ENVにも一致します。

ただし、完全なパスの指定が、別フォルダの同名ファイルや同じフォルダの全ファイルへ広がるわけではありません。観測された他ファイルの参照可否とも一致するため、大文字のファイルが除外されたことだけで設定エラーとは判断できません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d6-e07-feature-20261016（高難度）

Copilot CLIで機密ファイルを扱います。通常補完ではContent Exclusionが効きますが、CLIでviewと社内MCP検索から内容を取得できました。非機密の検索は残したまま、次回CLIではviewと機密MCPをモデルに提供しない方針です。起動時の候補制限とサーバー制御をどのように組み合わせますか。

正解：D

Content Exclusionの通常補完での成功を、Copilot CLIのすべての読取に対する保証として扱うことはできません。今回の取得経路は、ローカルのviewと機密情報を検索するMCPの二つです。

viewだけを外してもMCPから取得でき、MCPだけを外してもviewが残ります。次回はどちらも候補として提供しない方針なので、ローカル読取の候補制限と機密MCPの提供停止を組み合わせます。非機密検索まで一括で止めず、必要な経路を残すことも要件です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-fnd-cli-install-20261017（基礎）

Linuxの端末に現行のGitHub Copilot CLIを導入します。Node.js 22とnpmは利用でき、HomebrewとWinGetは導入していません。今回はnpmを使ってCLIをインストールします。実行するコマンドはどれですか。

正解：A

npmで配布される現行Copilot CLIのパッケージ名は@github/copilotです。問題文では必要なNode.jsとnpmが用意されているため、npm install -g @github/copilotで導入する条件を満たします。導入後の起動はcopilotで行い、旧gh-copilot拡張のインストール手順とは分けて扱います。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/cli-quickstart)
- [登録されている公式資料](https://code.visualstudio.com/docs/configure/command-line)

### q-fnd-cli-login-20261017（基礎）

現行Copilot CLIをインストールし、作業フォルダーでcopilotを起動しました。フォルダーの信頼確認は済んでいますが、未ログインと表示されます。トークンによる認証は設定していません。対話画面からGitHubアカウントの認証を始めるコマンドはどれですか。

正解：A

/loginは、CLIの対話画面からGitHubアカウントの認証を始めるコマンドです。CLIの導入、作業フォルダーの信頼確認、アカウントへのログインは別の手順です。今回は前の二つが済み、トークン認証もないため、/loginから案内に従って認証を進めます。

- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/cli-quickstart)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-fnd-cli-create-file-20261017（基礎）

認証済みのCopilot CLIで、作業フォルダー内のログを整理するためのスクリプトを用意します。整理の手順は決まっていますが、スクリプトファイルはまだありません。まず実行せずにスクリプトを作って保存したい場合、CLIへの依頼として目的に合うものはどれですか。

正解：B

Copilot CLIは、コマンドの説明だけでなく、スクリプトやファイルの作成も支援します。今回はまだ実行せず保存したいので、整理用スクリプトの作成と保存を明示して依頼します。必要なファイル変更の許可を確認し、保存した内容のレビューと実際の実行は別の段階として扱います。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-fnd-seat-api-20261017（基礎）

組織の入社手続きに、対象者へのCopilotシート付与を組み込みます。対象者の組織への所属は確認済みで、管理者権限と認証も用意しています。管理画面で手作業をせず、プログラムからシート割り当てを変更するために使うAPIはどれですか。

正解：C

Copilotの購読・ユーザー管理REST APIは、組織のSeat割り当てをプログラムから変更するために使えます。今回は入社手続きへの組み込みなので、利用統計を取得するAPIではなく割当を管理するAPIを選びます。実行時には対象アカウントと組織の条件、必要な管理権限も確認します。

- [登録されている公式資料](https://docs.github.com/en/rest/copilot/copilot-user-management)
- [登録されている公式資料](https://docs.github.com/en/rest/copilot)
- [登録されている公式資料](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)

### q-fnd-cloud-issue-20261017（基礎）

GitHub.comのIssueに書いた修正作業をCopilotへ割り当て、開発者のIDEとは別の環境で実装を進めさせます。開発者は作業後に作成されたPull Requestの変更をレビューします。このIssueからの委任を担当する機能はどれですか。

正解：D

Copilot cloud agentは、GitHub上でタスクを受け、開発者のIDEとは別の環境で実装を進める機能です。Issueから作業を割り当て、生成されたPRを開発者がレビューする今回の流れに合います。既存差分を評価するcode reviewや、手元のワークスペースで動くIDEのAgentとは利用形態が異なります。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)

### q-fnd-plan-20261017（基礎）

対応するVS CodeのCopilotで、関連コードを調べて実装案をまとめ、内容を確認してから実装用のAgentへ引き継ぐ専用ワークフローを使います。この用途のために用意されているモードはどれですか。

正解：D

Planモードは、関連コードや要件を調べて実装案を整理し、確認後に実装へ引き継ぐためのワークフローです。今回はすぐに編集せず、先に案を確認したいという条件が対応します。調査・計画と実装を分けることで、方針を確認してからコード変更へ進めます。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/planning)

### q-fnd-nes-20261017（基礎）

対応するVS Codeで変数名を修正すると、現在のカーソルから離れた関連箇所にも変更候補が示されました。矢印から次の編集位置へ移動し、その箇所の提案を採用できます。この位置の予測も行うCopilotの機能はどれですか。

正解：C

Next Edit Suggestionsは、直前の編集を踏まえ、次に編集する位置と変更内容を予測する機能です。カーソルから離れた関連箇所へ移動して候補を採用するという動作に対応します。現在の入力位置に続きだけを示す通常のghost textとの違いは、次の編集位置も提案する点です。

- [登録されている公式資料](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### q-fnd-ide-matrix-20261017（基礎）

チームではVS CodeとNeovimを併用しています。どちらでもCopilotのコード補完を使っていますが、ChatやAgentも同じように使えるとは限りません。導入前にIDEごとの機能対応を直接比較するために確認する公式資料はどれですか。

正解：A

Copilot Feature Matrixは、IDEやそのバージョンごとの機能対応を確認する公式資料です。コード補完が使えることだけで、ChatやAgentも同じように利用できるとは推測できません。VS CodeとNeovimの対象機能を表で照合してから、導入する環境を判断します。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-feature-matrix)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/plans)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/ai-models/model-comparison)

### q-fnd-ide-signin-20261017（基礎）

仕事用のGitHubアカウントには組織からCopilotのシートが割り当てられています。一方、VS CodeのCopilotは個人用アカウントでサインインしています。通信には問題がありません。仕事用の利用資格でCopilotを使い始めるため、最初に行う操作はどれですか。

正解：C

Copilotの利用資格は、CopilotへサインインしているGitHubアカウントに対応します。仕事用にSeatがあっても、個人用アカウントで使っている環境へ自動的に適用されるわけではありません。通信は正常なので、まずCopilotの認証先を仕事用アカウントへ合わせるのが直接の対応です。

- [登録されている公式資料](https://code.visualstudio.com/docs/setup/copilot)

### q-fnd-mobile-file-20261017（基礎）

外出先でGitHub Mobileを使い、リポジトリ内のファイルを確認しています。ファイルの内容を手動でコピーせず、そのファイル全体を文脈としてCopilotへ質問するには、どの操作から始めますか。

正解：C

GitHub Mobileでは、ファイル画面からCopilotを開き、そのファイルを文脈にして質問できます。対象を開いてCopilotアイコンを使う操作が、手動コピーをせずファイルについて尋ねる今回の条件に合います。利用にはアカウントの資格や組織のポリシーなどの条件も確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-mobile)

### q-d1-f03-ms-20261017（基礎）

VS CodeのCopilot Agentが、ファイルを削除するツールの実行許可を求めています。今後の操作をまとめて許可するのではなく、今回の操作について対象パスと実行内容を確認し、実行してよいか判断したいと考えています。利用者が行う対応として適切なものを2つ選んでください。

正解：A・B

実行前承認は、ツールが何をどこへ行うかを確認して判断する機会です。今回は削除なので、対象パスと引数を読んで依頼した範囲かを照合する必要があります。

対象が違う場合は実行を拒否し、指示を見直せます。確認と拒否による修正の二つが、今回の操作を個別に管理する対応になります。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)

### q-d2-f05-ms-20261017（基礎）

IDEでCopilot Agentを使い、ファイルの変更などを行うツールの実行前に、利用者が承認する運用にしています。この承認の仕組みによって得られる利点を2つ選んでください。

正解：A・C

ツールの実行前に承認を求める仕組みでは、操作が行われる前に利用者が内容を確認できます。予定外の操作であれば拒否し、別の対象や手順を指示できます。この二つが今回の利点であり、承認画面があるだけで操作の安全性が自動的に保証されるわけではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d2-a03-ms-20261017（基礎）

VS CodeのInline Chatを使って、選択したコードについてその場で相談したり、修正を依頼したりします。この機能の特徴として適切なものを2つ選んでください。

正解：A・D

Inline Chatは、エディタ上の選択コードについて、その場で相談や編集依頼をするための機能です。対象を選択した範囲へ絞り、提案された編集を見て採否を判断できます。対象指定と編集案の確認という二つが特徴であり、生成された変更を無条件で採用する必要はありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task)
- [登録されている公式資料](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)

### q-d2-a09-ms-20261017（基礎）

Copilot Chatで新しい作業を始めると、前に相談した別の作業の要件が回答へ混ざってしまいます。今回の作業に必要な情報を伝えつつ、無関係な会話履歴の影響を減らすには、どのように対応すべきですか。適切な対応を2つ選んでください。

正解：B・C

Copilot Chatでは会話履歴が後の回答にも影響します。新しいChatで旧タスクの履歴を分けると、無関係な要件が混ざるのを抑えられます。

ただし、新しいChatには今回の要件や関連ファイルを改めて与える必要があります。履歴を切り離すことと、必要な文脈を補うことを組み合わせる二つの対応です。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d2-a11-ms-20261017（基礎）

CopilotのPull Request summariesを使い、プルリクエスト（PR）の説明文の下書きを作成します。この機能を使う利点として適切なものを2つ選んでください。

正解：B・D

Pull Request summariesは、PRの差分から変更概要の下書きを作る支援です。作成者はその文章を確認し、差分だけでは分からない背景や意図を補足して共有できます。下書きの取得と人による仕上げの両方が利点であり、変更の正しさをレビューしたことにはなりません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task)

### q-d2-a12-ms-20261017（基礎）

VS Codeに表示されたCopilotのインライン補完候補を、コードへ取り込もうとしています。候補を採用する操作の説明として正しいものを2つ選んでください。

正解：C・D

インライン補完は、候補全体をTabで採用する操作に加え、対応環境で単語や行ごとに部分採用する操作もあります。候補の一部だけが必要なら、全体を一度取り込む必要はありません。二つはどちらも採用の操作で、別候補への切替や候補を破棄する操作とは役割が異なります。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### q-d2-a13-ms-20261017（基礎）

Copilotのインライン補完に表示された候補を、まだコードへ取り込まずに、別の候補と比較したいと考えています。この目的に合う操作を2つ選んでください。

正解：A・B

補完候補は、取り込む前に別の候補へ切り替えて比較できます。さらに補完パネルを開けば、複数の候補を一覧で検討できます。どちらも未採用のまま候補を比較する目的に合い、現在の候補をTabで確定する操作とは異なります。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)

### q-d2-a17-ms-20261017（基礎）

Copilotから利用するMCPサーバーを設計しています。設計資料を参照する機能と、指定された引数に基づいてチケットを作成する機能を提供したいと考えています。この2つの用途に合うMCPの構成要素の使い方を、2つ選んでください。

正解：A・C

MCPでは、アプリケーションへ参照用の情報を提供するResourcesと、引数を受けて処理を実行するToolsを区別します。設計資料を参照する用途にはResourceが対応し、チケットを作成する用途にはToolが対応します。今回は情報の参照と外部システムへの操作の両方が必要なため、それぞれに合う構成要素を選ぶ二つの説明が正解です。

- [登録されている公式資料](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)

### q-d2-a19-ms-20261017（基礎）

Copilotにログ出力の処理を実装させます。新しいログの仕組みを選ぶのではなく、プロジェクトですでに使っているロガーと実装方法に合わせたいと考えています。プロンプトに含める情報として適切なものを2つ選んでください。

正解：A・D

既存ロガーへ合わせるには、何を使うかと、どう使っているかの両方を伝えます。API名を明示すると実装に使う手段を限定でき、既存の同種処理を示すと引数や書式などの慣習を文脈として渡せます。新しい仕組みを選ばせず既存実装へそろえるため、この二つの情報が役立ちます。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d2-a21-ms-20261017（基礎）

VS CodeでCopilot Chatを使っています。特定のファイルの内容を参考にして回答してほしいとき、そのファイルを明示的に渡す方法を2つ選んでください。

正解：B・C

VS Codeでは、ファイル参照機能からの指定や、Chat入力欄へのドラッグで対象ファイルを明示添付できます。どちらも参照してほしいファイルを直接渡す操作です。ただ開いていることやファイル名を文章で述べることと、明示的な添付は区別します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d2-e04-ms-20261017（基礎）

チームの関連資料をCopilot Spacesにまとめ、メンバーが共通の資料を使って質問できるようにします。この使い方によって得られる利点を2つ選んでください。

正解：B・D

Copilot Spacesは、選んだ資料を会話の外に整理し、チームの共有文脈として使える機能です。同じ背景資料に基づいて質問しやすくなり、オンボーディングでも資料を再利用できます。この二つの利点は、回答が常に同じ・正しいという保証や、元資料の権限を自動付与することとは別です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)

### q-d3-f03-ms-20261017（基礎）

Copilotがクラウド上でコードの補完候補を生成し、利用者のIDEへ返すときのデータの流れについて考えます。この処理の説明として正しいものを2つ選んでください。

正解：C・D

クラウドで補完を生成する場合、必要な文脈を含む要求が生成サービスへ送られます。モデルの生成後は、適用されるフィルターなどの後処理を経て結果が端末へ返ります。入力の送信と生成後の処理という二つの段階があるため、すべてがローカルだけで完結するとは考えません。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/network-settings)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)

### q-d3-f04-ms-20261017（基礎）

社内ネットワークからCopilotを利用できるように、開発端末から外部への通信を確認しています。必要な接続を許可するために確認すべき事項を2つ選んでください。

正解：A・B

Copilotで必要な通信先は、使う機能や環境によって異なります。まず公式の接続先一覧を確認し、次に端末からその宛先までの社内プロキシやfirewallの許可と照合します。一般のGitHub画面を開けることだけでは、すべてのCopilot機能への到達性を確認したことにはなりません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/network-settings)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)

### q-d3-a02-ms-20261017（基礎）

Copilot Chatでコードについて質問するときに、関連するファイルやコードの選択範囲を、回答の参考情報として明示的に渡します。この操作の利点を2つ選んでください。

正解：A・C

関連コードを明示すると、どの実装を対象に答えてほしいかを伝えられます。そのコードの型やAPIの使い方も、その場の生成で参照する情報として渡せます。対象の特定と実装上の情報の提供が二つの利点ですが、添付内容の正しい解釈まで保証されるわけではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)
- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/custom-instructions)

### q-d3-a04-ms-20261017（基礎）

Copilotに実装を依頼します。プロジェクトで現在利用しているライブラリだけを使い、新しい依存パッケージは追加したくありません。この条件を伝えるために、プロンプトへ含める内容を2つ選んでください。

正解：A・D

使えるライブラリを具体的に示すと、既存の実装手段をCopilotへ伝えられます。さらに新しい依存を追加しないと明記すれば、既存ライブラリ以外を提案しないという制約も伝わります。利用可能な手段と禁止する変更の両方を示すことで、今回の依頼を明確にできます。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d3-e05-ms-20261017（基礎）

Copilotのインライン補完を使って画面を実装しています。エディタには、今回の画面で使う型定義や規則のファイルと、前の別の作業で開いた無関係なファイルが混在しています。今回の作業に合う情報をCopilotへ伝えやすくするために、タブをどう整理すべきですか。適切な対応を2つ選んでください。

正解：B・C

開いている関連ファイルは、補完が現在のコードを理解する手掛かりになります。今回の画面の型や規則を残し、前タスクの無関係なタブを閉じることで、必要な文脈を渡しやすくできます。すべてのタブを閉じるのではなく、関連情報の保持と不要情報の削減を組み合わせます。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://github.blog/ai-and-ml/github-copilot/how-github-copilot-is-getting-better-at-understanding-your-code/)

### q-d4-f03-ms-20261017（基礎）

Copilot Chatで、これまでの相談とは関係のない新しい作業を始めます。前の作業の要件を混ぜずに、今回の作業内容を伝えるための対応を2つ選んでください。

正解：B・D

新しいChatへ分けると、旧タスクの対話履歴の影響を減らせます。ただし、分けた後に現在の目的や対象コードが自動的にすべて伝わるわけではありません。今回の要件とコードを改めて渡すことも必要なので、履歴の分離と現在の入力の提供の両方を選びます。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### q-d4-f05-ms-20261017（基礎）

Copilot Chatの同じ会話で、複数のやり取りを続けています。過去のやり取りが、その後の回答へ与える影響について、正しい説明を2つ選んでください。

正解：C・D

同じChatでの過去のやり取りは、その後の回答を作る文脈になります。関連する相談を続けるときには便利ですが、古い要件が現在の条件と混ざる原因にもなります。履歴を利用できることと、無関係な履歴が混入する可能性の両方を理解する問題です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)

### q-d4-a08-ms-20261017（基礎）

Copilot Chatに、プロジェクト内の実装を参考にして回答してほしいと考えています。関連するコードを探したり、参考にするファイルを指定したりする方法の説明として、正しいものを2つ選んでください。

正解：A・B

対象がまだ分からない場合は、ワークスペース検索で質問に関連する実装を探せます。対象ファイルが分かっている場合は、明示参照して文脈として渡せます。検索による発見と、既知の対象の指定は異なる役割なので、どちらも適切な方法です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/reference/workspace-context)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d4-e02-ms-20261017（基礎）

前の相談とは別の機能についてCopilotに質問するため、新しいChatを開き、今回の作業に必要な要件を伝え直します。この進め方の利点を2つ選んでください。

正解：A・C

別タスクのChatを新しくすると、前の会話で伝えた条件の混入を抑えられます。また、現在の目的に必要な資料や要件を整理して渡し直す機会になります。履歴を分ける利点と文脈を選び直す利点がある一方、正確な回答には新しい対象情報の提供も必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)

### q-d5-f02-b-ms-20261017（基礎）

VS CodeでCopilotのコミットメッセージ生成機能を使います。この機能の説明として正しいものを2つ選んでください。

正解：A・D

コミットメッセージ生成は、ステージ済みの変更などを基に、その内容を説明する文章の下書きを得る機能です。利用者は文章を確認し、必要な背景や意図を補ってから採用できます。差分に基づく下書きと人による編集が二つの特徴で、コードの正確性を検証する機能とは別です。

- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d6-a02-ms-20261017（基礎）

Copilotの補完候補が公開コードと一致する場合の仕組みについて確認しています。機密ファイルを入力情報から除外する設定と混同せず、公開コードとの一致に関する説明として正しいものを2つ選んでください。

正解：B・C

公開コード一致では、一致する候補をBlockで抑制する設定と、一致元を確認するコード参照を区別します。前者は出力への制御、後者は出所やライセンスを人が確認するための情報です。どちらも公開コードとの一致に関係しますが、機密ファイルを入力から除外する設定の代わりにはなりません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
- [登録されている公式資料](https://docs.github.com/en/code-security/concepts/secret-security/push-protection)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d6-a07-ms-20261017（基礎）

Copilot Businessで扱われるデータについて、公式資料を確認しています。「モデルの学習に使われない」ことだけで、データの保持や契約上の扱いまで判断しないようにしたいと考えています。別途確認すべき事項を2つ選んでください。

正解：B・D

モデルの学習へ使わないという説明だけでは、入力や出力の保持条件までは分かりません。利用する機能・モデルの保持方針と、適用されるデータ保護の契約条件をそれぞれ確認します。学習用途、保持、契約を別の論点として照合する二つの対応が必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)
- [登録されている公式資料](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/govern-at-scale/resources-for-approval)

### q-sc04-2-ms-20261017（基礎）

プルリクエスト（PR）を作成するときに、Copilotへ変更内容を説明する文章の下書きを依頼します。この使い方の利点として適切なものを2つ選んでください。

正解：C・D

Copilotは、PRの差分から変更内容を説明する文章の下書きを作れます。複数コミットにまたがる変更の説明を支援し、作成者が背景や意図を補うための土台になります。文章を生成しただけでコードが正しいと証明されたり、必要な背景がすべて含まれたりするわけではありません。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/chat)

### q-sc06-1-ms-20261017（基礎）

リポジトリにCopilotのカスタム指示ファイルを置き、チームで利用します。この指示ファイルの管理や、回答時の参照について、正しい説明を2つ選んでください。

正解：A・B

リポジトリのカスタム指示ファイルは、共通規約をGitで管理してチームへ共有する手段です。対応するReferencesなどの表示では、今回の応答が指示を参照したかも確認できます。共有できることと参照を調べられることが二つの特徴であり、実際に規約へ従ったかは回答内容を別に確認します。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)
- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/custom-instructions)

### q-sc08-1-ms-20261017（基礎）

Copilotがコード検索の索引（インデックス）を使い、質問に関連する実装を探して、回答の参考情報として利用します。この仕組みの利点を2つ選んでください。

正解：A・C

索引を使った検索は、質問に関連する実装を探し、その場の回答材料へ加える仕組みです。全コードを一度に文脈へ入れずに、必要な箇所を選んで取得できる点も利点です。取得した情報による回答支援であり、モデル自体をそのコードで再学習させることとは異なります。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/reference/workspace-context)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/repository-indexing)
- [登録されている公式資料](https://docs.github.com/en/copilot/get-started/about-github-copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)

### q-d2-a24-ms-20261017（応用）

VS Codeで使うCopilotの指示を、チームで共有します。命名規約は通常の開発でも常に参照させたい一方、リリースノートの作成手順は利用者が必要なときだけ呼び出したいと考えています。それぞれの指示の配置先として適切なものを2つ選んでください。

正解：A・D

カスタム指示は、通常の作業で継続して参照させる規約を置くためのものです。命名規約は常に共有したいので、リポジトリの共通カスタム指示が適します。

一方、Prompt Fileは必要なときに呼び出す作業手順の再利用に向いており、リリースノート作成を置く先に合います。常時参照する規約と任意に実行するタスクを分ける二つの配置が正解です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)

### q-d3-a17-ms-20261017（応用）

Copilotの通常のコード補完を、ファイルAとファイルBで確認しています。ファイルAでは、公開コードとの一致を許可する設定（Allow）にしたときだけ補完候補が表示されます。ファイルBはContent Exclusionの対象で、同じ設定をAllowに変えても、入力情報から除外されていることを示す表示が残ります。認証と通信に問題はありません。それぞれの現象の説明として適切なものを2つ選んでください。

正解：B・C

公開コード一致ポリシーは、生成された候補が公開コードと一致する場合の出力を制御します。一方、Content Exclusionは、対象ファイルの内容をCopilotへ入力情報として使わせないための設定です。

ファイルAではAllowへの変更と候補の表示が連動しているため、出力側の一致ポリシーが関係すると判断できます。ファイルBには除外表示が残っており、公開コード一致を許可しても入力側の除外は解除されません。この二つの現象を、別々の制御として説明する選択肢が正解です。

- [登録されている公式資料](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d6-a09-ms-20261017（応用）

利用者XにはCopilotのライセンス（Seat）が割り当てられており、IDEからCopilotを利用できています。ただし、IDEの利用情報を送信するテレメトリーは無効です。管理者が確認すると、XはSeatの割り当て一覧には載っていますが、IDEの活動レポートには載っていません。この違いについて、適切な説明を2つ選んでください。

正解：B・D

Seat一覧は利用資格の割り当てを示し、IDEの活動レポートは収集できた利用活動を示します。二つはデータ源も収集条件も異なるため、一覧に差があっても直ちに矛盾とはいえません。

今回はXのIDEテレメトリーが無効なので、活動情報を収集できる条件を確認する必要があります。活動レポートに載らないことだけを理由に、Seatが未割り当て、あるいは利用していないと断定しないことが大切です。

- [登録されている公式資料](https://docs.github.com/en/rest/copilot/copilot-user-management)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/metrics-data)
- [登録されている公式資料](https://docs.github.com/en/rest/copilot)
- [登録されている公式資料](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)

### q-d3-a13-ms-20261017（応用）

Copilotの管理者が、社内で利用を承認された人へライセンス（Seat）を割り当てようとしています。その人は前日の利用統計には載っていませんが、Seatがすでに割り当てられている可能性があります。現在の割り当て状況と対象アカウントを確認するために、行うべきことを2つ選んでください。

正解：C・D

現在のSeatの割り当てを確認するには、利用統計ではなく現在の割当一覧を調べます。利用統計は活動の記録であり、活動がなかった人や収集されなかった人の資格までは否定できません。

割当一覧を取得し、対象者のGitHubアカウントを照合すれば、同名の別人との取り違えも避けて状態を確認できます。現在の状態を示すデータ源の取得と、正しいアカウントへの照合の二つが必要です。

- [登録されている公式資料](https://docs.github.com/en/rest/copilot/copilot-user-management)
- [登録されている公式資料](https://docs.github.com/en/rest/copilot)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/metrics-data)

### q-d6-a03-feature-20261016-ms-20261017（応用）

型定義ファイルをContent Exclusionの対象に設定し、Copilotでも除外を示す表示を確認しました。しかし、その型を使うコードでは、IDEがホバー表示などで提供する型の説明に沿った補完候補が出ます。除外するパスが正しく、設定も反映済みであることは確認しています。この現象を解釈するうえで適切な説明を2つ選んでください。

正解：A・B

Content Exclusionは、IDEが間接的に提供するすべての意味情報まで遮断する保証ではありません。公式の制約として、ホバーの型情報などが補完へ使われる場合があります。

今回、除外表示と設定反映を確認済みであっても、型を使う場所へIDE経由で説明が渡る可能性は残ります。ファイル本体の直接参照と、型情報の間接的な提供を区別する二つの説明が適切です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d1-a11-feature-20261016-ms-20261017（応用）

VS Codeに組み込まれたCopilotの機能を使っています。ネットワークが従量制課金接続（metered connection）として扱われるようになってから、インライン補完（ghost text）と次の編集候補（NES）の自動表示が止まりました。認証に問題はなく、Copilot Chatは利用できます。従量制課金接続の設定を変えずに原因を調べるため、適切な確認や操作を2つ選んでください。

正解：A・C

VS Codeでは、従量制課金接続でインライン提案の自動要求が抑制される場合があります。Chatが動くことだけでは、ghost textやNESの自動要求も同じ動作をするとは判断できません。

接続設定を変えない条件のもとでは、この仕様を確認したうえでTrigger Inline Suggestionから明示的に候補を要求します。自動要求の停止と、手動で要求できるかを分けて確かめる二つの対応です。

- [登録されている公式資料](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)

### q-d5-e04-feature-20261016-ms-20261017（応用）

VS CodeでCopilot Chatの使用モデルをモデルNへ変更しましたが、インライン補完（ghost text）ではモデルMが使われたままです。ChatではモデルNを使い続け、言語ごとの補完の有効・無効も変更せずに、インライン補完のモデルだけを切り替えたいと考えています。設定の扱いや確認先として適切なものを2つ選んでください。

正解：A・D

Chatとインライン補完は、使用モデルを別々に設定できる利用面です。Chatのmodel pickerをNにしても、ghost textのモデルMが自動的に切り替わるとは限りません。

ChatをNのまま保つには、その設定へ触れず、Configure Inline Suggestionsから補完用モデルの設定を確認します。言語別の有効・無効も今回の変更対象ではありません。利用面の区別と、補完側の設定先を選ぶ二つが正解です。

- [登録されている公式資料](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/ai-models/supported-models)

### q-d2-a20-ms-20261017（応用）

午後に更新された注文の状況を、Copilotで調べたいと考えています。Copilot Spaceには、朝の時点の注文データを保存したCSVファイルがあります。また、注文検索用のMCPサーバーのツールは一覧に表示されていますが、呼び出しに必要な利用者の認証が完了していません。利用者に閲覧権限のある注文の最新情報を調べるために、必要な対応を2つ選んでください。

正解：B・C

Spaceに保存した朝のCSVは、その時点の情報であり、午後の注文状況を直接確認する情報源にはなりません。最新情報を取得できるMCPツールが一覧にあっても、呼び出すための認証は別に必要です。

利用者のアカウントで認証を完了し、認可された注文検索から現在の状態を取得します。認証の準備と実際の最新データの取得の両方を行うことで、閲覧権限の範囲内で目的を満たせます。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)

### q-d2-e08-ms-20261017（応用）

VS Codeで使うCopilotのリポジトリ共通指示に、テストを「準備・実行・検証」の順で書くAAA形式の規約を記載しています。そのため、テスト以外の実装ファイルを編集するときにも、この規約が参照されます。規約の内容は変えず、リポジトリ内のどの階層にあるファイルでも、名前が.test.tsで終わるテストファイルだけへ適用したいと考えています。必要な変更を2つ選んでください。

正解：B・D

共通カスタム指示に書いた規約は、テストファイルだけへ自動的に限定されるものではありません。適用対象を変えるには、まずAAA規約を共通指示から外す必要があります。

そのうえでapplyTo: **/*.test.tsのパス別指示へ移すと、任意の階層で.test.tsに終わるファイルを対象にできます。パス別指示を追加するだけで共通側にも残すと、実装ファイルへ参照される問題が続くため、二つの変更が必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/prompting/response-customization)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)
- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/custom-instructions)

### q-d2-a23-ms-20261017（応用）

VS Codeから、チケット管理用のMCPサーバーをローカルプロセスとして起動します。サーバーとの通信には標準入出力（stdio）を使い、起動する実行ファイルと引数が指定されています。HTTP接続用のURLは提供されていません。VS CodeのMCP接続設定へ記載する内容として適切なものを2つ選んでください。

正解：C・D

stdio接続では、クライアントがローカルのMCPサーバープロセスを起動し、その標準入出力で通信します。そのためVS Codeの設定には、接続種別stdioと起動する実行ファイルのcommandを記載します。

指定された起動引数はargsの配列へ渡します。今回はHTTP用URLがないため、HTTP接続先を作る設定ではなく、プロセスの起動情報をそろえる二つの指定が適切です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/mcp)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)

### q-d2-a25-ms-20261017（応用）

Copilot CLIで、Gitの調査やコミットなどの操作を行いたいと考えています。CLIが利用できるツールの一覧にはbashが含まれています。今回のセッションでは、Git以外の操作へ実行許可を広げず、git pushだけは拒否する必要があります。追加すべき権限設定を2つ選んでください。

正解：A・B

bashが候補にあるため、今回調整するのは実行権限の範囲です。allow-toolのshell(git:*)を使うと、Git操作の範囲へ許可を限定できます。

その中でもpushは拒否する必要があるので、deny-toolのshell(git push)を重ねます。denyは一致するallowより優先するため、Git以外へ権限を広げず、Gitの中のpushだけを禁止する二つの設定になります。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli)

### q-d5-a15-feature-20261016-ms-20261017（応用）

VS Codeのチーム共有用mcp.jsonで、MCPサーバーに渡すAPIキーを利用者に入力してもらいます。入力定義のidはapiKey、typeはpromptStringです。APIキーの実際の値を共有ファイルへ書き込まず、入力中の文字も画面に表示されないようにしたいと考えています。この入力値を環境変数API_KEYへ渡すために、必要な設定を2つ選んでください。

正解：A・C

promptStringの入力定義では、password: trueを指定すると入力中の値をマスクできます。入力として受け取った値は、${input:apiKey}という参照でサーバー起動用の環境変数へ渡します。

そこでenv.API_KEYへこの参照を設定すれば、実際のAPIキーを共有ファイルへ書かずに済みます。入力の表示方法と、入力値を使う先の指定は別なので、両方の設定が必要です。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)

### q-sc03-3-feature-20261016-ms-20261017（応用）

VS Codeの個人用Prompt Fileを、別のPCでも自動的に利用できるようにしたいと考えています。リポジトリへのコミットや手動でのコピーは行いません。Settings Syncは有効ですが、Prompt Fileが別のPCへ同期されていません。ファイルを置く場所と、Settings Syncで同期する項目について、確認すべき内容を2つ選んでください。

正解：A・D

個人用Prompt FileをSettings Syncで扱うには、ユーザー領域に置き、該当する同期カテゴリも有効にします。Settings Sync全体が有効でも、Prompts and Instructionsが対象外ならそのファイルは同期されません。

ユーザー領域で保持することと、このカテゴリを同期対象へ含めることを確認します。リポジトリへのコミットや手動コピーに頼らず、個人の複数PCへ自動同期する条件に合う組み合わせです。

- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/prompt-files)

### q-d2-a18-feature-20261016-ms-20261017（応用）

Copilot CLIで、自分用のMCPサーバー設定とカスタムAgentの定義を追加します。リポジトリ内のファイルは変更せず、CLIの既定のユーザー設定フォルダーを使います。MCPサーバーの接続情報をIDE用のmcp.jsonへ書きましたが、Copilot CLIでは読み込まれませんでした。CLIに読み込ませるための配置先を2つ選んでください。

正解：B・C

IDEとCopilot CLIでは、ユーザー設定の配置先が同じとは限りません。CLIの既定のユーザー設定では、MCP接続は~/.copilot/mcp-config.json、Agent定義は~/.copilot/agentsへ置きます。

IDE用のmcp.jsonへ記載しただけでは、CLIの既定の設定として読み込ませたことにはなりません。二つの配置先を使い分けることで、リポジトリを変更せず個人用の接続とAgentを追加できます。

- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-d5-e08-feature-20261016-ms-20261017（高難度）

Copilot code reviewのレビュー深度は、組織の既定値がLite、リポジトリの既定値がBalancedです。プルリクエストPは以前Liteでレビューされましたが、PRごとの深度は指定していません。プルリクエストQでは、Deepを個別に指定しています。この状態でリポジトリの既定値をDeepへ変更し、両方のPRで改めてレビューを実行します。それぞれに適用される設定の説明として正しいものを2つ選んでください。

正解：B・D

要レビュー：この問題の正解は、現行公式資料の設定名と優先規則に整合していません。現在は、レビュー依頼時の明示指定、当該PRで前回使用した深度、依頼者の設定、リポジトリの設定などの順に評価されます。

Pには前回のLiteがあるため、個別指定がないことだけでリポジトリの新しい既定値が優先するとはいえません。また、設問のDeepは現行資料の深度名と一致しません。既存の正解を仕様として覚えず、問題自体の修正が必要な項目として扱ってください。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-d3-e04-ms-20261017（高難度）

Copilot Businessの通常のコード補完では、機密ファイルにContent Exclusionの除外表示が出ています。しかし、VS CodeのCopilot Agentはローカルのファイル読み取りツールで、そのファイルを読めました。除外設定のパスが正しく、設定も反映済みで、ファイルはシンボリックリンクではないことを確認しています。通常のコード補完に対する除外を維持しながら、Agentにも内容を読ませないための判断や対応を2つ選んでください。

正解：C・D

Content Exclusionの適用可否は、通常補完とAgentのローカルツールで同じとは限りません。パス、反映、symlinkの問題が除外されており、通常補完では除外表示も出ているので、単に設定を書き足す診断は合いません。

Agent側の読取は別の適用範囲として扱う必要があります。さらに機密ファイルを実行環境から分離すれば、非対応の読取経路からその内容を取得すること自体を防げます。機能の適用限界の理解と、環境側での対処の両方を選ぶ問題です。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

### q-d2-e21-ms-20261017（高難度）

Copilot Spaceに、リポジトリRへのリンクと、アップロードした資料Uがあります。利用者BはSpaceと資料Uを開けますが、リポジトリRを直接開くと403（アクセス拒否）になります。利用者CはリポジトリRを開けますが、SpaceのURLへアクセスすると403になります。資料Uの公開範囲を広げずに、2人が同じSpaceでリポジトリRの情報を使えるようにするには、どのような権限の対応が必要ですか。適切なものを2つ選んでください。

正解：A・B

Copilot Spaceへのアクセス権と、Spaceにリンクされた元リポジトリへのアクセス権は別々に必要です。Spaceを共有しただけで、元リポジトリの閲覧権限まで付与されるわけではありません。

BはSpaceには入れますがRを開けないため、Rへの閲覧権限を補う必要があります。CはRを読めますがSpaceに入れないため、そのSpaceへのアクセス権を補います。資料Uを広く公開する必要はなく、それぞれに不足している権限だけを付与すれば要件を満たせます。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/context/spaces)
- [登録されている公式資料](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d6-e06-ms-20261017（高難度）

Copilotの公開コード一致ポリシーについて、Enterpriseの管理者がBlockを強制しています。一方、組織Aに保存されている設定値はAllow、組織Bの設定値はBlockです。対象アカウントが正しく、Enterpriseの設定も反映済みであることを確認しています。両組織で実際に有効になる設定と、組織Aだけに例外を設けるために見直すべき設定の説明として、正しいものを2つ選んでください。

正解：A・C

Enterpriseがポリシーを強制している場合、下位に保存した設定だけでその制約を緩めることはできません。Aの保存値はAllowでも、実際に適用されるのは上位のBlockです。

BもBlockなので、両組織の実効設定は同じになります。Aだけ例外にしたい場合は、Enterprise側の強制をどう扱うか管理者と見直す必要があります。個人のAllowへ切り替えるだけでは上位の制約を超えられません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d2-e11-feature-20261016-ms-20261017（高難度）

GitHub.comでCopilot code reviewを実行します。mainブランチの共通カスタム指示は「日本語で回答する」ですが、PRの変更元ブランチ（head branch）では「英語で回答する」に変更されています。変更元ブランチには、applyTo: src/**/*.tsを指定したセキュリティ確認用のパス別指示もあります。PRの変更ファイルはsrc/auth.tsとdocs/auth.mdで、ほかの指示はありません。今回読み込まれる指示について、正しい説明を2つ選んでください。

正解：A・D

GitHub.comのcode reviewでは、PRの変更元であるhead branchのカスタム指示を参照します。したがって共通指示の取得元はmainではなく、今回の変更元ブランチです。

パス別指示は取得元に存在するだけで全ファイルへ適用されるわけではなく、applyToと変更ファイルを照合します。src/auth.tsはsrc/**/*.tsに一致し、docs/auth.mdは一致しません。指示の取得元と対象パスを区別した二つの説明が正解であり、実際に指示へ従ったかの確認は別に必要です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)

### q-d1-e03-feature-20261016-ms-20261017（高難度）

VS CodeのCopilot Agentへ作業を依頼する直前に、自分の未コミットの変更を含むチェックポイント（checkpoint）を作成しました。その後、Agentがコードを編集し、MCPツールで外部のチケットの状態も更新しました。チケットを更新する前の状態は記録してあります。自分の未コミットの変更を残したまま、コードとチケットの両方を依頼直前の状態へ戻すには、どのように対応すべきですか。適切な対応を2つ選んでください。

正解：B・C

checkpointは、指定した時点のワークスペースの状態へ戻すためのものです。今回は依頼直前のcheckpointに利用者自身の未コミット変更が含まれているため、そこへ戻すことで保持したい変更を残せます。

ただし、ワークスペースの復元はMCPツールが外部チケットへ行った更新まで巻き戻しません。記録してある更新前の状態を使い、チケット側でも別に戻す必要があります。コードの復元と外部システムの変更の取り消しを組み合わせて、両方の状態をそろえます。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/review-code-edits)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/concepts/trust-and-safety)

### q-d5-e07-feature-20261016-ms-20261017（高難度）

LinuxでCopilot CLIを起動し、--available-tools=view,grep、--excluded-tools=grep、--allow-tool=shellを同時に指定しました。この環境にはview、grep、bashの各ツールがインストールされています。Copilotへファイルの検索とgit statusの実行を依頼するとき、モデルに提示されるツールの一覧はどうなりますか。正しい説明を2つ選んでください。

正解：B・D

available-toolsはモデルへ提示する実ツールの一覧を制限する指定で、excluded-toolsと同時指定した場合はavailable-tools側が優先されます。そのため今回の候補にはviewとgrepが残ります。

allow-toolは提示済みツールの実行権限を扱うもので、利用可能な候補を追加する指定ではありません。shellを許可しても、available-toolsにないbashは候補へ入りません。候補一覧の決定と実行許可を順に分けて判断する必要があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-d2-e06-ms-20261017（高難度）

LinuxでCopilot CLIを使っています。起動時には--available-tools=view,grepと--allow-tool="shell(git:*)"を指定しています。bashはインストールされていますが、現在モデルへ提示するツールの一覧には含まれていません。このセッションでgit commitを実行できるようにしつつ、git pushは拒否したいと考えています。追加すべき設定変更を2つ選んでください。

正解：C・D

git commitを実行するには、まずコマンドを動かすbashがモデルへ提供されている必要があります。allow-toolでGit操作が許可されていても、候補がviewとgrepだけでは実行手段が足りません。

available-toolsへbashを追加すれば、その実行手段を提供できます。次に、既存のshell(git:*)という広い許可より優先するdeny-toolのshell(git push)でpushを拒否します。ツールの利用可能性と、Gitの中で許可する操作範囲の両方を調整する二つの対応です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-d4-e04-feature-20261016-ms-20261017（高難度）

VS Codeのローカル実行環境（Local harness）で、カスタムAgentとPrompt Fileを使います。Agent側のtoolsは[read, search]で、Prompt FileはそのAgentを指定し、独自のtoolsとして[read, metrics/get]を記載しています。readとsearchは利用できますが、metrics/getを提供するMCPサーバーにはまだ接続していません。Prompt Fileの指定を変えずにmetrics/getを使うため、ツール一覧の扱いと必要な接続について、適切なものを2つ選んでください。

正解：A・B

Prompt Fileにtoolsを明記した場合は、その一覧が使用するAgent側のツール一覧に優先します。今回使う一覧はreadとmetrics/getであり、Agent側のsearchを単純に併合するものではありません。

ただし、ツール名を一覧へ書いても、そのツールを提供する接続が自動的に用意されるわけではありません。metrics/getのMCPサーバーを接続し、必要な認証を完了させる必要があります。明示一覧の優先関係を確認することと、実際にツールを提供できる状態にすることの二つが正解です。

- [登録されている公式資料](https://code.visualstudio.com/docs/agent-customization/prompt-files)
- [登録されている公式資料](https://code.visualstudio.com/docs/agents/run/tools)

### q-d4-e09-feature-20261016-ms-20261017（高難度）

Copilot CLIで/contextを確認すると、コンテキストの使用量のうちMCP Toolsが65%、Messagesが10%を占めていました。複数のMCPサーバーを接続していますが、今回の作業に必要なのは社内検索のツールだけです。これまでの会話で伝えた方針と社内検索の機能を残しながら、使用量の大きい部分を減らすには、どのように対応すべきですか。適切な対応を2つ選んでください。

正解：A・C

コンテキストには会話履歴だけでなく、モデルへ提供するMCPツールの定義も入ります。今回はMCP Toolsが65%を占めており、Messagesの10%より大きいため、主因を減らすにはツール側の見直しが必要です。

使わないサーバーからのツール提供を止め、必要な社内検索ツールを残して一覧を絞ります。これなら会話で伝えた方針も検索機能も保持できます。会話の要約や削除だけでは、MCPツール定義が占める部分を同じように減らせるとはいえません。

- [登録されている公式資料](https://code.visualstudio.com/docs/agents/concepts/context)
- [登録されている公式資料](https://code.visualstudio.com/docs/chat/copilot-chat-context)
- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management)
- [登録されている公式資料](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-d4-e06-feature-20261016-ms-20261017（高難度）

PRの変更元ブランチに、パス別のCopilotカスタム指示が2つあります。指示IはapplyTo: src/**とexcludeAgent: code-reviewを指定しています。指示JはapplyTo: src/**/*.tsを指定し、Agentを除外する設定はありません。cloud agentとcode reviewのそれぞれで、src/api.tsとdocs/api.mdを扱います。各ファイルを処理するときに読み込まれる指示の説明として、正しいものを2つ選んでください。

正解：A・D

パス別指示は、対象ファイルの一致と、そのAgentを除外する設定の両方で適用を判断します。src/api.tsはIとJの両方のapplyToに一致します。

cloud agentはIのexcludeAgentの対象ではないため、IとJの両方を読み込みます。code reviewはIから除外されるため、同じファイルでもJだけが残ります。docs/api.mdは両方のsrc配下の条件に一致しないので、ファイル名だけが似ていても対象にはなりません。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)

### q-d5-e03-feature-20261016-ms-20261017（高難度）

Copilot cloud agentのセットアップには、依存パッケージのインストール、補助CLIのインストール、構成ファイルの作成という3つのステップを、この順番で定義しています。補助CLIのインストールがエラーを示す終了コードで失敗した後も、Agentは実装を始めましたが、構成ファイルは作成されていません。構成ファイルを作るステップ自体は正しく定義済みです。毎回のセットアップを最後まで完了させるために、行うべき対応を2つ選んでください。

正解：B・C

cloud agentのセットアップは、途中のstepが非ゼロの終了コードで失敗すると、残りのstepを省略して作業を始める場合があります。したがってAgentが実装を開始したことは、構成ファイルまで準備できた証拠ではありません。

今回は補助CLIの導入失敗で、その後の構成ファイル作成まで到達していません。まずその失敗原因を修正し、再実行後のログで後続stepまで完了したかを確認します。毎回の準備をsetupで完結させるには、依頼文へ作業を付け足すだけでは不十分です。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents)

### q-d5-e05-feature-20261016-ms-20261017（高難度）

リポジトリには、Copilotの共通セットアップ用copilot-setup-steps.ymlと、code review専用のcopilot-code-review.ymlがあります。解析ツールのインストールを共通セットアップだけへ追加したところ、code reviewの実行環境ではそのツールが見つかりませんでした。解析ツールはcode reviewだけで使い、cloud agentの実行環境には追加したくありません。この要件を満たすようにセットアップを整理する変更を2つ選んでください。

正解：B・D

code reviewは、専用のcopilot-code-review.ymlを設けることでcloud agentと別の環境準備を行えます。今回は専用定義が存在するので、レビューで必要な解析ツールの導入はそのworkflowへ置きます。

共通setupへの追加だけを繰り返しても、レビュー専用環境の不足には合いません。また、cloud agentには導入したくないため、今回共通側へ追加したstepは外します。導入先の移動と共通側からの除去を組み合わせることで、必要な環境だけへツールを用意できます。

- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)
- [登録されている公式資料](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d6-e04-feature-20261016-ms-20261017（高難度）

同じEnterpriseに属する組織Aと組織Bが、リポジトリRを利用しています。利用者XのCopilotライセンス（Seat）は組織Aから、利用者YのSeatは組織Bから割り当てられています。2人が通常のコード補完を使うときに、リポジトリRのprivate/**だけを入力情報から除外し、ほかのリポジトリには影響させたくありません。リポジトリRの管理者と組織Aのownerは、必要な設定を変更できます。組織の管理対象Seat向け設定とリポジトリ単位の設定の範囲を踏まえて、適切な対応を2つ選んでください。

正解：C・D

組織ownerによる除外は、その組織からSeatを割り当てられた利用者が対象です。一方、リポジトリ管理者による除外は、同じEnterprise内でそのリポジトリを使うCopilot利用者へ適用できます。

XとYのSeat提供元が異なり、対象をRだけにしたいので、RのContent Exclusionへprivate/**を設定するのが適切です。その後、XとYの両方で対象パスの除外を確認し、他のリポジトリに影響しないことも確かめます。対象利用者と対象リポジトリの二つの範囲を検証する必要があります。

- [登録されている公式資料](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
