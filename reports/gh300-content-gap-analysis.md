# GH-300 教材ギャップ分析

監査日：2026年10月12日。試験範囲の基準：[Microsoft LearnのGH-300試験ガイド（2026年8月7日版）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)。

## 補完前の教材一覧

| 分野 | Objective | 教材 | 用語 | 比較ガイド | 公式出典 | 検証済み問題 |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 6 | 14 | 28 | 110 | 12 | 40 | 196 |

各項目のID、関連付け、状態、確認日は[全件一覧（JSON）](./gh300-content-gap-inventory.json)に記録した。以下のObjective対応表は、既存教材の題名から要件を推測せず、現行の試験ガイドを基準に作成した。

## 補完前の判定

| 判定 | Objective | 理由 |
| --- | --- | --- |
| 十分 | 11件 | 教材、重要用語、検証済み問題がある。個別の正確性レビューは従来の監査で別途管理している。 |
| 薄い | d2o2、d3o1 | CLIのセッション・ファイル操作と、データフローの具体例が不足していた。 |
| 一部不足 | d2o3 | Spacesは用語集と比較ガイドにあったが教材本文に登場せず、Agent SessionsとSub-Agentsの説明も浅かった。Sparkは製品終了後も試験ガイドに残る歴史的な用語である。 |
| 未対応 | なし | 全14 Objectiveに少なくとも1件の教材があった。 |

## 実装前に確定した補完計画

| 優先度 | 種類 | 対象 | 補う内容 |
| --- | --- | --- | --- |
| P0 | 既存教材の拡張 | `lesson-d2-cli` | 導入、作業ディレクトリの信頼、ファイル操作、承認、セッション再開。CLIのコンテンツ除外に関する公式資料間の矛盾は引き続き「要レビュー」とする。 |
| P1 | 既存教材の拡張 | `lesson-d2-agent-edits` | 実際の作業例を使い、Agent SessionとSub-Agentを区別する。機能選択に関する未確認の主張は「要レビュー」のままにする。 |
| P1 | 既存教材の拡張 | `lesson-d2-chat-essentials` | Spacesを共有・再利用できるChatの文脈として説明し、既存の用語と比較ガイドにつなぐ。 |
| P1 | 既存教材の拡張 | `lesson-d3-data-flow`、`lesson-d3-retention-privacy` | 入出力、およびモデル学習とデータ保持の違いを具体例で補う。根拠のない固定的な内部処理手順は作らない。 |
| P1 | 比較ガイドの追加 | MCPとAgent Mode | 外部ツールへの接続方式と、エージェントの作業モードの違いを示す。 |
| P1 | 既存用語の改善 | Agent Sessions、Sub-Agents、Spaces | 広すぎる説明と教材への関連付けを修正する。新しい用語は増やさない。 |
| P2 | 将来の比較候補 | CLIとIDEのAgent Mode | 今後の問題レビューで混同が繰り返し見つかった場合に追加を検討する。 |

新規教材・新規用語は計画しなかった。現行の試験ガイドにはSparkが残る一方、[GitHubの終了告知](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/)では新規利用が停止している。現行機能として使うための教材を増やすと受験者を誤解させるため、歴史的な用語として扱う。

## Objective・必須知識・教材の対応

現行ガイドの14 Objectiveと下位項目を、重複を除く57の必須用語に対応付けた。各Objectiveに紐付く教材・用語・比較ガイド・検証済み問題のIDは[全件一覧](./gh300-content-gap-inventory.json)に収録している。下表は補完後の件数である。比較ガイドは、似た機能の使い分けが必要なObjectiveに配置する。

| Objective | 主な下位項目 | 教材 | 用語 | 比較 | 検証済み問題 | 判定 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| d1o1 | 生成AIのリスク、倫理、軽減策 | 2 | 8 | 0 | 16 | 十分 |
| d1o2 | 出力の検証、責任ある利用 | 2 | 9 | 0 | 14 | 十分 |
| d2o1 | IDEでの有効化、提案、Chat、Agent Mode | 2 | 11 | 3 | 19 | 十分 |
| d2o2 | CLIの導入、コマンド、セッション、ファイル・スクリプト操作 | 1 | 7 | 0 | 13 | 問題の内容が薄い |
| d2o3 | Edits、Agent Mode、MCP、Sessions、Sub-Agents、Spaces、Spark、レビュー、指示ファイル | 5 | 19 | 8 | 14 | 一部の概念を問う問題が薄い |
| d2o4 | 組織ポリシー、監査ログ、サブスクリプションAPI | 1 | 9 | 1 | 15 | 十分 |
| d3o1 | データ利用・フロー、文脈、プロンプト構築、応答処理 | 3 | 10 | 0 | 12 | 十分※ |
| d3o2 | 提案のライフサイクル、モデルの限界 | 1 | 7 | 0 | 12 | 十分※ |
| d4o1 | プロンプトの文脈、ゼロショット・少数例提示 | 2 | 16 | 2 | 15 | 十分 |
| d4o2 | プロンプト設計、対話の改善 | 2 | 7 | 0 | 11 | 十分 |
| d5o1 | 生成、リファクタリング、文書化、既存システムの改修 | 2 | 12 | 1 | 15 | 十分 |
| d5o2 | テスト、境界条件、セキュリティ・性能 | 2 | 10 | 1 | 13 | 十分 |
| d6o1 | コンテンツ除外、エディタ設定、所有権・プライバシー | 2 | 16 | 2 | 13 | 十分※ |
| d6o2 | 公開コードとの一致、除外設定のトラブル対応 | 2 | 9 | 1 | 14 | 十分※ |

※は教材の構造上の網羅を意味する。個々の主張には、[正確性監査](./gh300-learning-content-audit.md)で引き続き`needs-review`（要レビュー）としたものがある。試験範囲には試験ガイドを、製品の現在の挙動には公式製品資料を用いた。Objectiveに問題が何件あるかだけでは、すべての概念が正しいObjectiveに紐付いた問題で評価されているとは言えない。

## 今回の追加・修正

| 変更 | 件数 | 内容 |
| --- | ---: | --- |
| 新規教材 | 0 | 既存の学習経路で対応できた。 |
| 拡張した教材 | 5 | `lesson-d2-cli`、`lesson-d2-agent-edits`、`lesson-d2-chat-essentials`、`lesson-d3-data-flow`、`lesson-d3-retention-privacy`。 |
| 新規用語 | 0 | 必須概念は既存の用語と別名で表現できた。 |
| 定義を修正した用語 | 3 | Sessions、Sub-Agents、Spacesの説明と関連付けを修正した。Sparkの教材リンクも修正した。 |
| 新規比較ガイド | 1 | `cmp-mcp-vs-agent-mode`。役割、利用場面、併用例を示す。 |
| 修正した比較ガイド | 1 | `cmp-spaces-vs-chat`。「通常のChatはローカルの単一リポジトリに限られる」「Spacesは全チャット履歴を共有する」という過大な説明を改めた。 |
| 新規公式出典 | 4 | GitHub DocsのCLI導入、CLI利用、CLIセッション、IDEのSub-Agent。 |

CLI教材には[導入](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)、[利用](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview)、[セッション](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions)の公式資料に基づき、ディレクトリの信頼、権限、ファイル、スクリプト、作業再開を補った。[IDEのSub-Agent](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-subagents)は独立した文脈で下位タスクを処理する。[Spaces](https://docs.github.com/en/copilot/concepts/context/spaces)は整理・共有できる文脈を提供し、[MCP](https://docs.github.com/en/copilot/concepts/context/mcp)はツールやデータに接続する。[Agent Mode](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode)はツールを使いながら作業を進めるモードである。データフロー教材の例では、すべてのCopilot機能に共通する未公開の内部処理手順があるかのような説明を避けた。

## 教材の深さ・学習順序・重複

全28教材には、学習対象、説明本文、要点、よくある誤り、復習内容、関連用語、公式出典へのリンクがある。今回の5件は、具体的な利用場面や似た概念との違いを補い、重複する教材は追加しなかった。分野ごとの教材1件あたりの本文量は、d1からd6の順に平均約828／1,060／705／816／754／787文字となり、d3は補完前の約619文字から増えた。文字数は薄い教材を探す目安であり、品質そのものの評価ではない。短めの教材も役割は分かれている。d3の内部処理に関する未確認事項は、出典ごとのレビュー対象として残した。

現在の学習順序は、責任ある利用、IDEの提案とChat、CLI、Agent Mode、MCP、組織管理、データフロー、プロンプト、開発での活用、プライバシーへ進む。d2ではCLIの後にSessions／Sub-AgentsとMCP、d3では入出力とフローの後にライフサイクル上の制限を学べる。順序変更は不要と判断した。教材は場面を説明し、用語集は短い定義を示し、比較ガイドは選択基準を示す。別名だけの新規用語や重複教材は増やしていない。表記を正規化した用語名・正式名称・別名に、異なる用語ID間の重複はなかった。新しいMCP比較は、既存の「MCPとExtensions」とは異なる概念の組を扱う。

## 用語集・検索・必須知識チェック

全110用語に、短い定義、詳しい説明、重要性、利用場面、試験上の要点、混同しやすい点、関連用語、公式出典IDがある。既存の`essential`（必須）55用語を維持し、件数を増やすためだけの格上げは行わなかった。[全件一覧](./gh300-content-gap-inventory.json)には、各必須用語について教材・用語集・公式出典・直接紐付いた検証済み問題の有無を記録した。結果は**教材55/55、用語集55/55、公式出典へのリンク55/55**である。

**55用語のうち31用語には、直接紐付いた検証済み問題がない。**これは問題内容または関連付けを見直す候補であり、問題文にその概念が全く登場しないことまでは意味しない。また、必須用語5件には公式出典へのリンクがあるが、その出典は現時点で`verified`（確認済み）状態ではない。アーキテクチャ、ライフサイクル、文脈の制約、所有権に関係し、正確性レビューの対象として残した。

`lib/knowledge.ts`の用語検索は、`term`（用語名）、`fullName`（正式名称）、`aliases`（別名）、`shortDefinition`（短い定義）を大文字・小文字を区別せずに検索する。たとえばMCPは略称、`Model Context Protocol`、日本語の別名から到達できる。Spacesにも日本語の別名を追加した。検索処理自体の変更は不要だった。

## 残る不足と問題バンクとの照合

d2o2に紐付く13問の問題文には、Copilot CLIへの直接の言及がない。一方、CLIを明示する検証済み問題2問（`q-d2-a22`、`q-d2-e13`）はd2o1に紐付いている。Agent Modeを明示する検証済み問題7問のうち6問はd2o2に紐付くが、試験ガイドではその機能をd2o3で扱う。Copilot Edits、Spaces、Spark、Agent Sessions、Sub-Agentsを明示する検証済み問題は0問。MCPを明示する11問のうち、d2o3に紐付くのは8問である。

これらは問題文の文字列による確認であり、別名や場面描写だけで概念を問う問題を見落とす可能性がある。それでも、Objectiveごとの問題件数がd2o2・d2o3の直接的な出題範囲を過大に見せていることは分かる。新しい「MCPとAgent Mode」の比較にも、直接紐付く問題はまだない。今回の教材補完では、確信の持てない問題のObjectiveを黙って付け替えたり、検証済みに昇格したりしていない。

従来の監査で`needs-review`とした**教材関連23件**（教材8、用語13、比較ガイド2）はそのまま残り、別途4問は検証済みから除外されている。特に[GitHubの一般的なコンテンツ除外の説明](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)と[CLIのEnterprise管理の説明](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise)は、CLIへの除外適用について食い違う。今回の補完では、どちらか一方を試験の確定ルールとして扱わない。また、現行ガイドにSparkの記載がある一方、[GitHubの終了告知](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/)では新規利用・新規アプリ作成が停止している。既存の歴史的用語は残すが、新規作業には勧めない。

## 補完後の網羅状況

| 指標 | 結果 |
| --- | ---: |
| Objectiveに対応する教材 | 14/14＝100% |
| Objectiveに対応する用語 | 14/14＝100% |
| 必須概念IDの用語集収録 | 57/57＝100% |
| 必須用語から公式出典へのリンク | 55/55＝100% |
| 比較ガイドがあるObjective | 8/14＝57%。残る6件には必須の二者択一がない |
| 検証済み問題があるObjective | タグ上は14/14＝100%。内容上の偏りは前節を参照 |
| 参照切れ／現行シラバスとの版不一致 | 0件／0件 |
| 補完後の判定 | 十分12件、問題の内容が薄い2件、一部不足0件、未対応0件 |

機械可読の[全件一覧](./gh300-content-gap-inventory.json)には全IDと必須用語のチェック結果がある。整合性検査では、参照切れは0件で、検証済みコンテンツに公式出典への参照がない項目も0件だった。従来の[正確性監査](./gh300-learning-content-audit.md)は、個別の主張を確認するための作業一覧として維持する。保存済みの`verified`表示だけを根拠に、すべての文章を今回改めて検証したとは扱わない。

## P2：今後の改善候補

- 問題レビューでCLIとIDEのAgent Modeの混同が繰り返し見つかる場合、両者の比較ガイドを追加する。現時点では、教材をさらに増やすよりd2o2・d2o3の問題内容とタグを確認する方が優先度が高い。
- Spaces、Copilot Edits、Agent Sessions／Sub-Agents、MCPとAgent Modeについて、試験ガイドとの対応を確認したうえで、少数の場面判断型問題を追加する。
- `verified`状態の出典がない必須用語5件を昇格させたり、コンテンツ除外に関する回答の食い違いを解決したりする前に、公式のアーキテクチャ資料と所有権の資料を再確認する。
