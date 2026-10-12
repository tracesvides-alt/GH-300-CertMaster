# GH-300公式演習50問と学習コンテンツの対応監査

監査対象: 添付 `GH300問題.xlsx` の50問、選択肢、解答・解説画像。比較対象: アプリで有効な `content/gh300/2026-08-07` の6 Domain / 14 Objectiveのシラバス、28 Lesson、110 Glossary、13 Comparison Guide、44 Official Sources。監査日: 2026-10-12。

> 注意: Excelは画像主体です。問題・選択肢は検索用OCR転記で誤字が残り得ます。正解番号は解答画像を目視確認し、解説は逐語引用ではなく要旨を記しました。原文を確認する際は各行の `Sheet1!A…` と `Sheet1!I…` を参照してください。50問は学習資料であり、現行GH-300試験の出題範囲や正誤を保証するものではありません。

## 結果

- **COVERED 30問 / PARTIAL 10問 / MISSING 6問 / UNCERTAIN 4問。**
- 完全対応率は **60%**（COVEREDのみを数える）。
- 編集上の対応度スコア平均は **74.4/100**。これは教材の記述深度と選択肢を判断できる程度の主観的評価で、受験者の正答確率ではありません。
- P0は現行公式資料と添付解答の食い違いを明示して誤学習を防ぐこと。P1はFIM、Test Explorer、Arrange–Act–Assert、品質属性・信頼性、安全な例外処理の教材化。
- 既存教材の強みはChatの用途、プロンプト構成、コード補完の基本、単体テスト生成、リファクタリングです。

評価基準: **COVERED** はLessonに判断の根拠があり、用語・比較も必要な範囲で揃う。**PARTIAL** は正答の概念には触れるが、設問の誤答や意思決定との対比が不足。**MISSING** は判断の核となる説明・例がない。**UNCERTAIN** は添付の正解と現行GitHub資料の整合に疑義があり、教材の不足点と問題そのものの鮮度を分ける必要がある。

## 50問一覧

| No. / 原本 | Domain / Objective | 主題・正解 | 判定 | 点 | 不足・留保 |
| --- | --- | --- | --- | ---: | --- |
| 01 / Sheet1!A568, Sheet1!I1 | d2 / d2o4 | Copilotの料金と利用資格 / 位置2 | UNCERTAIN | 50 | SOURCE-PLANS |
| 02 / Sheet1!A585, Sheet1!I1 | d2 / d2o1 | 対応IDEの選別 / 位置3 | PARTIAL | 65 | G-IDE |
| 03 / Sheet1!A601, Sheet1!I1 | d2 / d2o4 | BusinessとEnterpriseの違い / 位置3 | UNCERTAIN | 45 | SOURCE-TRAINING |
| 04 / Sheet1!A619, Sheet1!I21 | d2 / d2o4 | 組織へのCopilot有効化 / 位置2 | PARTIAL | 60 | G-ORG-STEPS |
| 05 / Sheet1!A636, Sheet1!I21 | d2 / d2o3 | PR要約の役割 / 位置2 | COVERED | 95 | - |
| 06 / Sheet1!A653, Sheet1!I21 | d2 / d2o3 | 旧ドキュメントセットと共有コンテキスト / 位置1 | UNCERTAIN | 40 | SOURCE-KB |
| 07 / Sheet1!A670, Sheet1!I42 | d5 / d5o1 | Chatによるモジュール性改善 / 位置1 | COVERED | 90 | - |
| 08 / Sheet1!A687, Sheet1!I42 | d2 / d2o1 | Chat参加者・コマンド・変数 / 位置3 | COVERED | 95 | - |
| 09 / Sheet1!A703, Sheet1!I42 | d5 / d5o1 | 未知コードの自然言語説明 / 位置2 | COVERED | 90 | - |
| 10 / Sheet1!A720, Sheet1!I62 | d2 / d2o3 | エラー原因の説明と修正提案 / 位置1 | COVERED | 90 | - |
| 11 / Sheet1!A737, Sheet1!I62 | d2 / d2o1 | コメントとコード行からの補完 / 位置2 | COVERED | 90 | - |
| 12 / Sheet1!A753, Sheet1!I62 | d2 / d2o1 | Slash Commandsの用途 / 位置3 | COVERED | 95 | - |
| 13 / Sheet1!A770, Sheet1!I81 | d2 / d2o1 | Inline Chatの暗黙文脈 / 位置2 | PARTIAL | 65 | G-IMPLICIT |
| 14 / Sheet1!A789, Sheet1!I81 | d3 / d3o1 | プロキシと証明書の対応 / 位置1 | UNCERTAIN | 40 | SOURCE-PROXY |
| 15 / Sheet1!A806, Sheet1!I81 | d2 / d2o1 | 提案の受け入れ操作 / 位置1 | COVERED | 95 | - |
| 16 / Sheet1!A822, Sheet1!I99 | d2 / d2o1 | Copilotの基本定義 / 位置1 | COVERED | 95 | - |
| 17 / Sheet1!A1, Sheet1!I99 | d3 / d3o1 | 補完に使うエディタ文脈 / 位置1 | COVERED | 90 | - |
| 18 / Sheet1!A17, Sheet1!I99 | d2 / d2o3 | 組織知識による支援 / 位置2 | PARTIAL | 70 | G-ORG-CONTEXT |
| 19 / Sheet1!A33, Sheet1!I118 | d3 / d3o1 | 自然言語入力と提案 / 位置1 | COVERED | 90 | - |
| 20 / Sheet1!A49, Sheet1!I118 | d4 / d4o1 | Zero-shot・One-shot・Few-shot / 位置2 | PARTIAL | 65 | G-INCONTEXT |
| 21 / Sheet1!A65, Sheet1!I118 | d3 / d3o1 | 提案生成パイプライン / 位置1 | PARTIAL | 70 | G-PIPELINE |
| 22 / Sheet1!A81, Sheet1!I137 | d3 / d3o1 | Fill-in-the-Middle / 位置3 | MISSING | 25 | G-FIM |
| 23 / Sheet1!A97, Sheet1!I137 | d3 / d3o1 | 生成後の提案提示 / 位置2 | COVERED | 90 | - |
| 24 / Sheet1!A114, Sheet1!I137 | d2 / d2o1 | 複数候補の確認 / 位置3 | COVERED | 90 | - |
| 25 / Sheet1!A131, Sheet1!I157 | d1 / d1o2 | 生成文書のレビュー / 位置2 | COVERED | 95 | - |
| 26 / Sheet1!A148, Sheet1!I157 | d4 / d4o1 | Promptの定義 / 位置2 | COVERED | 95 | - |
| 27 / Sheet1!A165, Sheet1!I157 | d4 / d4o1 | プロンプト品質と出力 / 位置3 | COVERED | 90 | - |
| 28 / Sheet1!A182, Sheet1!I176 | d3 / d3o1 | LLMの役割 / 位置3 | COVERED | 90 | - |
| 29 / Sheet1!A199, Sheet1!I176 | d4 / d4o1 | ContextとIntent / 位置3 | COVERED | 95 | - |
| 30 / Sheet1!A216, Sheet1!I176 | d4 / d4o2 | 質問の焦点化 / 位置1 | COVERED | 90 | - |
| 31 / Sheet1!A233, Sheet1!I196 | d4 / d4o1 | 意味のある名称と関連ファイル / 位置3 | COVERED | 95 | - |
| 32 / Sheet1!A250, Sheet1!I196 | d2 / d2o1 | Chat入力の具体化 / 位置2 | COVERED | 95 | - |
| 33 / Sheet1!A268, Sheet1!I196 | d4 / d4o1 | 明瞭さ・具体性・冗長さ / 位置2 | COVERED | 90 | - |
| 34 / Sheet1!A502, Sheet1!I216 | d5 / d5o1 | リファクタリングの定義 / 位置2 | COVERED | 95 | - |
| 35 / Sheet1!A518, Sheet1!I216 | d5 / d5o1 | プロジェクト文書の目的 / 位置3 | PARTIAL | 60 | G-DOC-TYPES |
| 36 / Sheet1!A535, Sheet1!I216 | d5 / d5o1 | インライン文書の目的 / 位置2 | COVERED | 90 | - |
| 37 / Sheet1!A551, Sheet1!I236 | d5 / d5o1 | コードの言語変換 / 位置2 | COVERED | 90 | - |
| 38 / Sheet1!A285, Sheet1!I236 | d5 / d5o2 | 単体テストの生成支援 / 位置3 | COVERED | 95 | - |
| 39 / Sheet1!A302, Sheet1!I236 | d5 / d5o2 | VS Code Test Explorer / 位置2 | MISSING | 20 | G-TEST-EXPLORER |
| 40 / Sheet1!A319, Sheet1!I255 | d5 / d5o2 | Arrange-Act-Assert / 位置2 | MISSING | 25 | G-AAA |
| 41 / Sheet1!A336, Sheet1!I255 | d5 / d5o2 | 条件に沿うテスト提案 / 位置3 | COVERED | 90 | - |
| 42 / Sheet1!A352, Sheet1!I255 | d5 / d5o2 | テスト作成時間の短縮 / 位置2 | COVERED | 90 | - |
| 43 / Sheet1!A369, Sheet1!I274 | d5 / d5o2 | 入力検証アサーション / 位置2 | PARTIAL | 60 | G-INPUT-ASSERT |
| 44 / Sheet1!A385, Sheet1!I274 | d5 / d5o1 | コード品質属性 / 位置3 | MISSING | 25 | G-QUALITY-ATTR |
| 45 / Sheet1!A402, Sheet1!I274 | d5 / d5o1 | 信頼性の定義 / 位置2 | MISSING | 25 | G-RELIABILITY |
| 46 / Sheet1!A418, Sheet1!I294 | d5 / d5o2 | 潜在不具合の特定と信頼性 / 位置2 | PARTIAL | 60 | G-RELIABILITY |
| 47 / Sheet1!A434, Sheet1!I294 | d5 / d5o1 | 良い既存コードと提案品質 / 位置1 | COVERED | 90 | - |
| 48 / Sheet1!A451, Sheet1!I294 | d5 / d5o2 | 安全な例外処理 / 位置2 | MISSING | 25 | G-EXCEPTION |
| 49 / Sheet1!A468, Sheet1!I314 | d3 / d3o1 | 生成物のコンテンツフィルター / 位置4 | COVERED | 90 | - |
| 50 / Sheet1!A485, Sheet1!I314 | d3 / d3o1 | 有害性フィルターの目的 / 位置3 | PARTIAL | 65 | G-FILTER-TYPES |

## 設問別の根拠

以下の「解説要旨」は添付画像の趣旨を短くまとめたものです。正解位置は各問の選択肢の先頭から1～4で数えます。

### 01. Copilotの料金と利用資格

- 原本: 問題 `Sheet1!A568` / 解答 `Sheet1!I1`。正解は選択肢 **2**。
- 解説要旨: 学生向けの無料利用と一般向けの月額料金を対比している。現行プランとの相違は別途確認が必要。
- 知識分解: Terms = Copilot Free、Copilot Pro、Student。Concepts = 無料枠と有料枠、利用資格。Feature/Behavior = 各プランの条件。Decision = 「学生だけ無料・一般は月額10ドル」という添付解答と現行Freeを区別。
- 対応: Lesson `lesson-d2-org-governance`、Glossary `g-subscription-plans`、Comparison `-`。
- **UNCERTAIN (50/100)**: 用語集には現行Freeがあるが、添付の正解は一般向け無料プランを否定する。教材だけで添付解答を再現すると現在の事実と衝突する。

### 02. 対応IDEの選別

- 原本: 問題 `Sheet1!A585` / 解答 `Sheet1!I1`。正解は選択肢 **3**。
- 解説要旨: VS Code、Visual Studio、Neovim、JetBrainsを対応IDEとして挙げる。
- 知識分解: Terms = VS Code、Visual Studio、Neovim、JetBrains。Concepts = エディター別機能対応。Feature/Behavior = IDE拡張と機能マトリクス。Decision = 対応製品と未対応製品を区別し、機能ごとの差も確認。
- 対応: Lesson `lesson-d2-inline-suggestions`、Glossary `g-inline-suggestions`、Comparison `-`。
- **PARTIAL (65/100)**: インライン補完は説明するが、4製品の対応一覧と機能ごとの差を教材から判定しにくい。

### 03. BusinessとEnterpriseの違い

- 原本: 問題 `Sheet1!A601` / 解答 `Sheet1!I1`。正解は選択肢 **3**。
- 解説要旨: Enterpriseでは組織コードベースによるパーソナライズを強調する。モデル訓練という表現は現行資料と照合が必要。
- 知識分解: Terms = Copilot Business、Copilot Enterprise、コードベース。Concepts = プラン差、リポジトリ索引とモデル学習の違い。Feature/Behavior = 組織向けプランとコンテキスト。Decision = 「組織コードでモデルを訓練する」という添付正解を現行の索引・Spacesと区別。
- 対応: Lesson `lesson-d2-org-governance;lesson-d2-chat-essentials`、Glossary `g-subscription-plans;g-spaces`、Comparison `cmp-spaces-vs-chat`。
- **UNCERTAIN (45/100)**: 現在の教材はプラン表の変動を注意するが、添付解答の「訓練」を支持しない。現行GitHubはリポジトリ索引を説明し、モデル学習とは分ける。

### 04. 組織へのCopilot有効化

- 原本: 問題 `Sheet1!A619` / 解答 `Sheet1!I21`。正解は選択肢 **2**。
- 解説要旨: プロフィールのドロップダウンから「Your organizations」へ進み、Businessを有効にする。
- 知識分解: Terms = Business、Organization、ポリシー、シート。Concepts = ポリシーと利用権限の別。Feature/Behavior = 組織設定と席割当。Decision = 管理画面でポリシー設定後にどこで組織向け有効化を行うか。
- 対応: Lesson `lesson-d2-org-governance`、Glossary `g-org-policies;g-seat-management`、Comparison `cmp-org-vs-enterprise-policies`。
- **PARTIAL (60/100)**: ポリシーとシートの概念はあるが、添付が問う画面遷移と現在の設定経路は教材にない。

### 05. PR要約の役割

- 原本: 問題 `Sheet1!A636` / 解答 `Sheet1!I21`。正解は選択肢 **2**。
- 解説要旨: PRのコード変更を短く要約し、レビュアーの理解を助ける。
- 知識分解: Terms = Pull Request Summaries、Copilot Code Review。Concepts = 要約とレビューの用途差。Feature/Behavior = PR変更の簡潔な要約。Decision = 変更の要約を選び、自動マージや活動監視を退ける。
- 対応: Lesson `lesson-d2-pr-code-review`、Glossary `g-pr-summaries;g-copilot-code-review`、Comparison `cmp-review-vs-summary`。
- **COVERED (95/100)**: Lessonと比較ガイドに要約とコードレビューの目的・境界・誤解がある。

### 06. 旧ドキュメントセットと共有コンテキスト

- 原本: 問題 `Sheet1!A653` / 解答 `Sheet1!I21`。正解は選択肢 **1**。
- 解説要旨: ドキュメントセットに内部コード・文書を集めて関連する提案に使うと説明する。
- 知識分解: Terms = ドキュメントセット、Copilot Spaces。Concepts = 共有資料による回答の根拠付け、廃止機能。Feature/Behavior = 旧Knowledge Baseと現行Spaces。Decision = 古い設問の資料集合を現行Spacesへ対応付け、モデル訓練と混同しない。
- 対応: Lesson `lesson-d2-chat-essentials`、Glossary `g-spaces`、Comparison `cmp-spaces-vs-chat`。
- **UNCERTAIN (40/100)**: 現行教材のSpacesは強いが、添付のドキュメントセットという旧用語への対応がなく、GitHubは旧Knowledge Baseの廃止を公表している。

### 07. Chatによるモジュール性改善

- 原本: 問題 `Sheet1!A670` / 解答 `Sheet1!I42`。正解は選択肢 **1**。
- 解説要旨: Chatでモジュール性を改善するリファクタリング案を得る。
- 知識分解: Terms = Copilot Chat、リファクタリング。Concepts = 既存コードの構造改善。Feature/Behavior = 改善案の提案。Decision = 依存関係の観察から改善案を選び、全自動書き換えを退ける。
- 対応: Lesson `lesson-d5-generation-refactoring`、Glossary `g-code-refactoring;g-copilot-chat`、Comparison `cmp-agent-vs-chat`。
- **COVERED (90/100)**: リファクタリングの目的と人間による検証を学べる。

### 08. Chat参加者・コマンド・変数

- 原本: 問題 `Sheet1!A687` / 解答 `Sheet1!I42`。正解は選択肢 **3**。
- 解説要旨: 参加者・コマンド・変数が質問の文脈と意図を明確にする。
- 知識分解: Terms = Chat Participants、Slash Commands、Chat Variables。Concepts = 質問の文脈と意図。Feature/Behavior = Chat入力の補助機能。Decision = 回答の文脈指定をUI装飾や応答制限と区別。
- 対応: Lesson `lesson-d2-chat-essentials`、Glossary `g-chat-participants;g-slash-commands;g-chat-variables`、Comparison `-`。
- **COVERED (95/100)**: Lessonが3種類の役割を分けて説明し、用途を示す。

### 09. 未知コードの自然言語説明

- 原本: 問題 `Sheet1!A703` / 解答 `Sheet1!I42`。正解は選択肢 **2**。
- 解説要旨: Chatがコードの機能や目的を自然言語で説明する。
- 知識分解: Terms = Copilot Chat、Code Explanation。Concepts = コード理解と要約。Feature/Behavior = コード説明。Decision = 自然言語による目的説明を、書換え・削除と区別。
- 対応: Lesson `lesson-d2-chat-essentials`、Glossary `g-code-explanation;g-copilot-chat`、Comparison `cmp-chat-vs-inline`。
- **COVERED (90/100)**: Chatの説明用途と、生成説明を検証する注意点がある。

### 10. エラー原因の説明と修正提案

- 原本: 問題 `Sheet1!A720` / 解答 `Sheet1!I62`。正解は選択肢 **1**。
- 解説要旨: Chatがエラーの理由を説明し、修正を考える支援をする。
- 知識分解: Terms = Copilot Chat、Slash Commands。Concepts = 診断と提案、自動修正の限界。Feature/Behavior = Chatの修正支援。Decision = 原因説明を選び、無条件の自動修正・自動テスト実行を退ける。
- 対応: Lesson `lesson-d2-chat-essentials;lesson-d5-security-remediation`、Glossary `g-copilot-chat;g-slash-commands`、Comparison `-`。
- **COVERED (90/100)**: Chatと修正支援の範囲、開発者の確認責任を学べる。

### 11. コメントとコード行からの補完

- 原本: 問題 `Sheet1!A737` / 解答 `Sheet1!I62`。正解は選択肢 **2**。
- 解説要旨: コメントと既存コード行が補完候補の文脈になる。
- 知識分解: Terms = Inline Suggestions、コードコメント。Concepts = 入力文脈と補完。Feature/Behavior = インライン提案。Decision = 自然言語コメントまたは部分コードが補完の手掛かりになる。
- 対応: Lesson `lesson-d2-inline-suggestions`、Glossary `g-inline-suggestions;g-context-gathering`、Comparison `cmp-chat-vs-inline`。
- **COVERED (90/100)**: コードとコメントの文脈を補完に使う説明がある。

### 12. Slash Commandsの用途

- 原本: 問題 `Sheet1!A753` / 解答 `Sheet1!I62`。正解は選択肢 **3**。
- 解説要旨: スラッシュコマンドは一般的な開発タスクへのショートカットである。
- 知識分解: Terms = Slash Commands、Inline Chat。Concepts = 一般的作業のショートカット。Feature/Behavior = Chatコマンド。Decision = タスク呼出しを、言語切替や万能フォーマッタと区別。
- 対応: Lesson `lesson-d2-chat-essentials`、Glossary `g-slash-commands;g-inline-chat`、Comparison `-`。
- **COVERED (95/100)**: コマンドの役割と具体的な利用例が揃う。

### 13. Inline Chatの暗黙文脈

- 原本: 問題 `Sheet1!A770` / 解答 `Sheet1!I81`。正解は選択肢 **2**。
- 解説要旨: 暗黙の文脈とコマンドにより長い説明なしに意図を伝えられる。
- 知識分解: Terms = Inline Chat、Slash Commands。Concepts = 選択コード・現在ファイルの文脈、短い依頼。Feature/Behavior = Inline Chatとコマンド。Decision = 長文依頼なしの修正支援を、命名強制・脆弱性自動検出と区別。
- 対応: Lesson `lesson-d2-chat-essentials`、Glossary `g-inline-chat;g-slash-commands`、Comparison `cmp-chat-vs-inline`。
- **PARTIAL (65/100)**: Inline Chatとコマンドはあるが、添付の「暗黙的プロンプト」という語と、選択文脈が何を補うかの対比が弱い。

### 14. プロキシと証明書の対応

- 原本: 問題 `Sheet1!A789` / 解答 `Sheet1!I81`。正解は選択肢 **1**。
- 解説要旨: 自己署名証明書を使うVPNプロキシをBusiness向けと説明する。現行資料との整合確認が必要。
- 知識分解: Terms = Individuals、VPNプロキシ、自己署名証明書。Concepts = ネットワーク設定とプラン境界。Feature/Behavior = HTTPプロキシとカスタム証明書。Decision = 「個人プランでは非対応」という添付正解と現在の一般設定を区別。
- 対応: Lesson `lesson-d3-data-flow`、Glossary `g-copilot-proxy;g-transit-encryption`、Comparison `-`。
- **UNCERTAIN (40/100)**: 現行GitHub Docsはプラン限定を付けずプロキシとカスタム証明書を説明する。添付正解の限定は要確認。

### 15. 提案の受け入れ操作

- 原本: 問題 `Sheet1!A806` / 解答 `Sheet1!I81`。正解は選択肢 **1**。
- 解説要旨: 表示されたインライン候補をTabキーで受け入れる。
- 知識分解: Terms = Tab、Inline Suggestions。Concepts = 提案の表示と採用。Feature/Behavior = IDEのキーボード操作。Decision = 提案表示と受け入れのキーを区別。
- 対応: Lesson `lesson-d2-inline-suggestions`、Glossary `g-inline-suggestions;g-ghost-text`、Comparison `-`。
- **COVERED (95/100)**: インライン提案の採用フローでTabの操作を確認できる。

### 16. Copilotの基本定義

- 原本: 問題 `Sheet1!A822` / 解答 `Sheet1!I99`。正解は選択肢 **1**。
- 解説要旨: Copilotは開発者のコード作成を支援するAIツールである。
- 知識分解: Terms = GitHub Copilot、AIコーディング支援。Concepts = 提案生成と人間による採用。Feature/Behavior = コード支援。Decision = 提案ツールをコードレビュー専用製品やリポジトリと区別。
- 対応: Lesson `lesson-d2-inline-suggestions`、Glossary `g-generative-ai;g-inline-suggestions`、Comparison `cmp-chat-vs-inline`。
- **COVERED (95/100)**: 基礎Lessonと用語集で役割を学べる。

### 17. 補完に使うエディタ文脈

- 原本: 問題 `Sheet1!A1` / 解答 `Sheet1!I99`。正解は選択肢 **1**。
- 解説要旨: エディター内の周辺コードやコメントを基に補完を提案する。
- 知識分解: Terms = Inline Suggestions、Context。Concepts = 周辺コードの収集。Feature/Behavior = 補完コンテキスト。Decision = 周辺コードから提案を作ることをランダム選択と区別。
- 対応: Lesson `lesson-d2-inline-suggestions;lesson-d3-prompt-pipeline`、Glossary `g-context-gathering;g-inline-suggestions`、Comparison `-`。
- **COVERED (90/100)**: 周辺コードと開いているファイルの影響が説明される。

### 18. 組織知識による支援

- 原本: 問題 `Sheet1!A17` / 解答 `Sheet1!I99`。正解は選択肢 **2**。
- 解説要旨: 組織コードや内部知識を参照して関連性の高い支援を行う。
- 知識分解: Terms = 組織コードベース、Copilot Spaces、内部知識。Concepts = 権限に従った資料参照、共有コンテキスト。Feature/Behavior = Spacesとリポジトリ文脈。Decision = 組織資料に基づく回答を、無関係な公開コードやランダム生成と区別。
- 対応: Lesson `lesson-d2-chat-essentials`、Glossary `g-spaces;g-context-scope-limits`、Comparison `cmp-spaces-vs-chat`。
- **PARTIAL (70/100)**: Spacesの用途はあるが、組織コードの索引・権限・共有資料がどの画面で効くかをまとめて判断する教材が薄い。

### 19. 自然言語入力と提案

- 原本: 問題 `Sheet1!A33` / 解答 `Sheet1!I118`。正解は選択肢 **1**。
- 解説要旨: 自然言語の入力やコード文脈から提案を生成する。
- 知識分解: Terms = Prompt、Copilot。Concepts = 入力文脈と生成。Feature/Behavior = コード提案。Decision = 自然言語とコード文脈を、バイナリ入力などと区別。
- 対応: Lesson `lesson-d3-prompt-pipeline`、Glossary `g-generative-ai;g-prompt-construction`、Comparison `-`。
- **COVERED (90/100)**: 入力から提案に至る流れを説明している。

### 20. Zero-shot・One-shot・Few-shot

- 原本: 問題 `Sheet1!A49` / 解答 `Sheet1!I118`。正解は選択肢 **2**。
- 解説要旨: ゼロ・ワン・少数ショットの例示に応じて出力を調整する。
- 知識分解: Terms = Zero-shot、One-shot、Few-shot。Concepts = 例示による文脈内適応、恒久的な学習との差。Feature/Behavior = 例示プロンプト。Decision = 例を加える手法を、学習済みモデル自体の再訓練と混同しない。
- 対応: Lesson `lesson-d4-zero-few-shot`、Glossary `g-zero-shot;g-few-shot`、Comparison `cmp-zero-vs-few-shot`。
- **PARTIAL (65/100)**: 手法の使い分けはあるが、添付の「プロンプトから学習」という表現をモデル学習と区別する明示的な説明が弱い。

### 21. 提案生成パイプライン

- 原本: 問題 `Sheet1!A65` / 解答 `Sheet1!I118`。正解は選択肢 **1**。
- 解説要旨: 文脈収集、生成、安全性の確認という流れから除外される要素を問う。
- 知識分解: Terms = Context、安全性フィルター、統計分析。Concepts = 入力処理と出力検査の段階。Feature/Behavior = 文脈収集・モデル・後処理。Decision = 通常の処理段階と、設問が除外する「統計分析とパターン認識」を比較。
- 対応: Lesson `lesson-d3-prompt-pipeline;lesson-d3-data-flow`、Glossary `g-prompt-construction;g-post-processing`、Comparison `-`。
- **PARTIAL (70/100)**: 文脈収集とフィルタリングはあるが、設問の選択肢と各段階を対比した図がなく、統計的推論との位置付けが曖昧。

### 22. Fill-in-the-Middle

- 原本: 問題 `Sheet1!A81` / 解答 `Sheet1!I137`。正解は選択肢 **3**。
- 解説要旨: カーソル前後のコードを使うFill-in-the-Middleの仕組みを問う。
- 知識分解: Terms = FIM、カーソル前後のコード。Concepts = 前方と後方を使う補完。Feature/Behavior = FIM型の補完。Decision = カーソル後方も参照することを、大きなファイル処理や追加訓練と区別。
- 対応: Lesson `lesson-d3-prompt-pipeline`、Glossary `g-context-gathering;g-inline-suggestions`、Comparison `-`。
- **MISSING (25/100)**: 周辺文脈はあるがFIMの名称、前後の入力構造、誤答との差を説明する教材がない。

### 23. 生成後の提案提示

- 原本: 問題 `Sheet1!A97` / 解答 `Sheet1!I137`。正解は選択肢 **2**。
- 解説要旨: 提案は統合前に表示され、開発者が確認・採用する。
- 知識分解: Terms = Outbound Flow、Inline Suggestions。Concepts = 後処理とユーザー承認。Feature/Behavior = 補完結果の提示。Decision = 提案を表示・採用する過程を、自動統合や第三者送信と区別。
- 対応: Lesson `lesson-d2-inline-suggestions;lesson-d3-data-flow`、Glossary `g-post-processing;g-suggestion-lifecycle`、Comparison `-`。
- **COVERED (90/100)**: 提案ライフサイクルと人間による採用を学べる。

### 24. 複数候補の確認

- 原本: 問題 `Sheet1!A114` / 解答 `Sheet1!I137`。正解は選択肢 **3**。
- 解説要旨: 複数の補完候補を切り替え、適切な案を手動で選ぶ。
- 知識分解: Terms = Completions Panel、Inline Suggestions。Concepts = 候補比較と手動選択。Feature/Behavior = 代替補完候補。Decision = 左右操作で候補を見ることを自動全採用と区別。
- 対応: Lesson `lesson-d2-inline-suggestions`、Glossary `g-completions-panel;g-inline-suggestions`、Comparison `-`。
- **COVERED (90/100)**: 候補パネルと採用操作を説明している。

### 25. 生成文書のレビュー

- 原本: 問題 `Sheet1!A131` / 解答 `Sheet1!I157`。正解は選択肢 **2**。
- 解説要旨: 生成された説明や文書の正確性・完全性を人が検証する。
- 知識分解: Terms = Copilot Chat、Verification。Concepts = 出力の正確性・完全性。Feature/Behavior = 生成物の検証。Decision = 説明文を検証する理由を、モデルへの学習フィードバックと区別。
- 対応: Lesson `lesson-d1-validation;lesson-d1-principles`、Glossary `g-verification-validation;g-critical-evaluation`、Comparison `-`。
- **COVERED (95/100)**: 生成物の検証責任とレビュー対象を扱う。

### 26. Promptの定義

- 原本: 問題 `Sheet1!A148` / 解答 `Sheet1!I157`。正解は選択肢 **2**。
- 解説要旨: プロンプトはモデルへ与える入力・指示である。
- 知識分解: Terms = Prompt、Instructions。Concepts = 入力と生成指示。Feature/Behavior = プロンプト。Decision = 人間の依頼文を、出力やバイナリ命令と区別。
- 対応: Lesson `lesson-d4-crafting`、Glossary `g-prompt-engineering;g-prompt-anatomy`、Comparison `-`。
- **COVERED (95/100)**: プロンプトの要素と入力としての位置付けがある。

### 27. プロンプト品質と出力

- 原本: 問題 `Sheet1!A165` / 解答 `Sheet1!I157`。正解は選択肢 **3**。
- 解説要旨: 明確に構成されたプロンプトほど関連する提案を得やすい。
- 知識分解: Terms = Prompt、Output Quality。Concepts = 目的・文脈の明確さ。Feature/Behavior = プロンプト作成。Decision = 提案品質に関わる指示の明瞭さを、時間帯やIDE名と区別。
- 対応: Lesson `lesson-d4-crafting`、Glossary `g-prompt-engineering;g-prompt-anatomy`、Comparison `-`。
- **COVERED (90/100)**: Goal・Context・Constraintsを教材で実践できる。

### 28. LLMの役割

- 原本: 問題 `Sheet1!A182` / 解答 `Sheet1!I176`。正解は選択肢 **3**。
- 解説要旨: LLMは与えられたプロンプトと文脈に応じた応答を生成する。
- 知識分解: Terms = LLM、Prompt、Context。Concepts = 文脈に応じた生成。Feature/Behavior = モデルによる応答。Decision = 生成を請求処理やIDE内コンパイルと区別。
- 対応: Lesson `lesson-d3-prompt-pipeline`、Glossary `g-generative-ai;g-tokenization`、Comparison `-`。
- **COVERED (90/100)**: LLMと入力処理の役割が説明される。

### 29. ContextとIntent

- 原本: 問題 `Sheet1!A199` / 解答 `Sheet1!I176`。正解は選択肢 **3**。
- 解説要旨: 文脈と意図を示すと適切な提案に近づく。
- 知識分解: Terms = Context、Intent、Prompt。Concepts = 対象範囲と達成目標。Feature/Behavior = Chatのプロンプト。Decision = 範囲と目標を伝えることを配色や音声設定と区別。
- 対応: Lesson `lesson-d4-crafting`、Glossary `g-prompt-anatomy;g-context-priming`、Comparison `-`。
- **COVERED (95/100)**: Goal・Contextの判断基準と例がある。

### 30. 質問の焦点化

- 原本: 問題 `Sheet1!A216` / 解答 `Sheet1!I176`。正解は選択肢 **1**。
- 解説要旨: 具体的なコーディング課題に絞った質問が回答を改善する。
- 知識分解: Terms = Task Scope、Prompt。Concepts = 対象の限定と結果確認。Feature/Behavior = Chatの使い方。Decision = 具体的なタスクに絞ることを丸投げや安全確認省略と区別。
- 対応: Lesson `lesson-d4-decomposition-pruning;lesson-d4-refinement`、Glossary `g-task-decomposition;g-context-pruning`、Comparison `-`。
- **COVERED (90/100)**: タスク分解と文脈整理のシナリオがある。

### 31. 意味のある名称と関連ファイル

- 原本: 問題 `Sheet1!A233` / 解答 `Sheet1!I196`。正解は選択肢 **3**。
- 解説要旨: 意味のある名称、コメント、関連ファイルが有用な文脈を与える。
- 知識分解: Terms = 関数名、コメント、関連ファイル。Concepts = 文脈提示。Feature/Behavior = 隣接ファイルとプロンプト。Decision = 命名・コメント・開いたファイルを閉じる選択肢と比較。
- 対応: Lesson `lesson-d4-crafting;lesson-d3-prompt-pipeline`、Glossary `g-context-priming;g-context-gathering`、Comparison `-`。
- **COVERED (95/100)**: 文脈プライミングと具体的な書き方を説明する。

### 32. Chat入力の具体化

- 原本: 問題 `Sheet1!A250` / 解答 `Sheet1!I196`。正解は選択肢 **2**。
- 解説要旨: Chat参加者・コマンド・変数と具体的なプロンプトを活用する。
- 知識分解: Terms = Chat Participants、Slash Commands、Chat Variables。Concepts = 文脈指定と依頼の具体性。Feature/Behavior = Chat支援機能。Decision = 補助機能と具体的指示を選び、曖昧さや大規模丸投げを退ける。
- 対応: Lesson `lesson-d2-chat-essentials;lesson-d4-crafting`、Glossary `g-chat-participants;g-slash-commands;g-chat-variables`、Comparison `-`。
- **COVERED (95/100)**: 3種の機能と具体的依頼を連結できる。

### 33. 明瞭さ・具体性・冗長さ

- 原本: 問題 `Sheet1!A268` / 解答 `Sheet1!I196`。正解は選択肢 **2**。
- 解説要旨: 過度な冗長さを避け、簡潔で明瞭な指示にする。
- 知識分解: Terms = Prompt、Context。Concepts = 明確な依頼と不要な長文の差。Feature/Behavior = 効果的なプロンプト。Decision = 「冗長で詳細ほどよい」を避け、必要十分な文脈を選ぶ。
- 対応: Lesson `lesson-d4-crafting;lesson-d4-decomposition-pruning`、Glossary `g-prompt-anatomy;g-context-pruning`、Comparison `-`。
- **COVERED (90/100)**: 具体性と文脈整理の教材から冗長さを退けられる。

### 34. リファクタリングの定義

- 原本: 問題 `Sheet1!A502` / 解答 `Sheet1!I216`。正解は選択肢 **2**。
- 解説要旨: 外部から見える動作を保ちながら内部構造を改善する。
- 知識分解: Terms = Refactoring、外部動作。Concepts = 内部構造の改善と回帰検証。Feature/Behavior = コードのリファクタリング。Decision = 振る舞い保持を、機能追加や仕様変更と区別。
- 対応: Lesson `lesson-d5-generation-refactoring`、Glossary `g-code-refactoring`、Comparison `-`。
- **COVERED (95/100)**: 定義・適用例・外部動作維持の注意がある。

### 35. プロジェクト文書の目的

- 原本: 問題 `Sheet1!A518` / 解答 `Sheet1!I216`。正解は選択肢 **3**。
- 解説要旨: プロジェクト文書は範囲・目的・要件を示して理解を助ける。
- 知識分解: Terms = Project Documentation、Requirements。Concepts = 範囲・目的・要件の共有。Feature/Behavior = プロジェクト文書。Decision = プロジェクト文書をエンドユーザー向け概要や変更履歴と区別。
- 対応: Lesson `lesson-d5-generation-refactoring`、Glossary `g-doc-generation`、Comparison `-`。
- **PARTIAL (60/100)**: 文書生成は扱うが、プロジェクト文書が範囲・目的・要件を伝える役割と他文書との差が弱い。

### 36. インライン文書の目的

- 原本: 問題 `Sheet1!A535` / 解答 `Sheet1!I216`。正解は選択肢 **2**。
- 解説要旨: インライン文書はコードの可読性と保守性を高める。
- 知識分解: Terms = Inline Documentation、Comments。Concepts = 理解しやすさ・保守性。Feature/Behavior = コード内ドキュメント。Decision = 可読性と保守性の改善を、規模拡大や技能誇示と区別。
- 対応: Lesson `lesson-d5-generation-refactoring`、Glossary `g-doc-generation`、Comparison `-`。
- **COVERED (90/100)**: Docstring・コメント生成と保守性の目的を学べる。

### 37. コードの言語変換

- 原本: 問題 `Sheet1!A551` / 解答 `Sheet1!I236`。正解は選択肢 **2**。
- 解説要旨: コードを別の言語へ変換する用途を示す。
- 知識分解: Terms = Code Translation、Legacy Modernization。Concepts = 言語間移植と挙動保持。Feature/Behavior = コード変換。Decision = 別言語への変換を、画像化や逆コンパイルと区別。
- 対応: Lesson `lesson-d5-legacy-modernization`、Glossary `g-code-translation;g-legacy-modernization`、Comparison `-`。
- **COVERED (90/100)**: 言語変換の用途と検証を説明している。

### 38. 単体テストの生成支援

- 原本: 問題 `Sheet1!A285` / 解答 `Sheet1!I236`。正解は選択肢 **3**。
- 解説要旨: テストコード、入力・期待値・アサーション、境界例の提案を支援する。
- 知識分解: Terms = Unit Test、Edge Case、Assertions。Concepts = 入力・期待値・境界条件。Feature/Behavior = Chatによるテスト提案。Decision = コード片と条件の提案を、自動実行や完全網羅保証と区別。
- 対応: Lesson `lesson-d5-testing`、Glossary `g-unit-test-generation;g-edge-case-discovery;g-test-assertions-mocking`、Comparison `cmp-unit-vs-integration-tests`。
- **COVERED (95/100)**: テスト生成、異常系、期待値の検証まで説明される。

### 39. VS Code Test Explorer

- 原本: 問題 `Sheet1!A302` / 解答 `Sheet1!I236`。正解は選択肢 **2**。
- 解説要旨: VS CodeのTest Explorerはテストの実行・デバッグ・管理に使う。
- 知識分解: Terms = Test Explorer、VS Code。Concepts = テストの実行・デバッグ・結果管理。Feature/Behavior = IDEのテストUI。Decision = テスト管理UIを、テスト生成や自動修正機能と区別。
- 対応: Lesson `lesson-d5-testing`、Glossary `g-unit-test-generation`、Comparison `-`。
- **MISSING (20/100)**: 教材はCopilotによるテスト生成を扱うが、Test Explorerの実行・デバッグ・管理用途がない。

### 40. Arrange-Act-Assert

- 原本: 問題 `Sheet1!A319` / 解答 `Sheet1!I255`。正解は選択肢 **2**。
- 解説要旨: 単体テストをArrange、Act、Assertの三段階に分ける。
- 知識分解: Terms = Arrange、Act、Assert。Concepts = 単体テストの三段階構造。Feature/Behavior = テスト設計パターン。Decision = 準備・実行・検証を、コンパイルや文書作成と区別。
- 対応: Lesson `lesson-d5-testing`、Glossary `g-test-assertions-mocking`、Comparison `-`。
- **MISSING (25/100)**: アサーション品質は扱うが、Arrange-Act-Assertの段階と例がない。

### 41. 条件に沿うテスト提案

- 原本: 問題 `Sheet1!A336` / 解答 `Sheet1!I255`。正解は選択肢 **3**。
- 解説要旨: コードの文脈に沿ったテスト候補を生成する。
- 知識分解: Terms = Unit Test、Code Context。Concepts = コードからのテスト候補。Feature/Behavior = Copilotによるテスト作成。Decision = 文脈依存の生成を、自動実行や無指示の完全スイートと区別。
- 対応: Lesson `lesson-d5-testing`、Glossary `g-unit-test-generation;g-edge-case-discovery`、Comparison `-`。
- **COVERED (90/100)**: 生成と実行の責任分界、条件指定を説明できる。

### 42. テスト作成時間の短縮

- 原本: 問題 `Sheet1!A352` / 解答 `Sheet1!I255`。正解は選択肢 **2**。
- 解説要旨: 関連する単体テストの提案により作成時間を短縮する。
- 知識分解: Terms = Unit Test、Productivity。Concepts = テスト案の作成支援と限界。Feature/Behavior = 複数テストの提案。Decision = 効率化を100%網羅やバグ自動修正の保証と区別。
- 対応: Lesson `lesson-d5-testing`、Glossary `g-unit-test-generation;g-verification-validation`、Comparison `-`。
- **COVERED (90/100)**: 効率と人間による期待値検証の両面を扱う。

### 43. 入力検証アサーション

- 原本: 問題 `Sheet1!A369` / 解答 `Sheet1!I274`。正解は選択肢 **2**。
- 解説要旨: 有効な入力だけを処理する検証を目的と説明する。アサーションとの関係は要注意。
- 知識分解: Terms = Assertion、Input Validation。Concepts = 不正入力の検査と期待出力の確認の差。Feature/Behavior = 単体テストの検証。Decision = 無効値を拒否する条件を、単なる出力確認や性能改善と区別。
- 対応: Lesson `lesson-d5-testing`、Glossary `g-test-assertions-mocking;g-edge-case-discovery`、Comparison `-`。
- **PARTIAL (60/100)**: アサーション一般と境界条件はあるが、無効入力を扱う検証例と出力アサーションとの差が明示されない。

### 44. コード品質属性

- 原本: 問題 `Sheet1!A385` / 解答 `Sheet1!I274`。正解は選択肢 **3**。
- 解説要旨: 信頼性・保守性などの特性でコード品質を評価する。
- 知識分解: Terms = Reliability、Maintainability、Security、Usability。Concepts = 複数の品質特性。Feature/Behavior = 品質評価。Decision = 品質属性の集合を、行数・作業時間・人数と区別。
- 対応: Lesson `lesson-d5-generation-refactoring;lesson-d1-validation`、Glossary `g-critical-evaluation;g-code-correctness`、Comparison `-`。
- **MISSING (25/100)**: 用語集に効率・保守性・安全性は点在するが、選択肢の品質属性を体系として学べない。

### 45. 信頼性の定義

- 原本: 問題 `Sheet1!A402` / 解答 `Sheet1!I274`。正解は選択肢 **2**。
- 解説要旨: 指定条件下で長期に正しく機能することを信頼性と説明する。
- 知識分解: Terms = Reliability、Correctness。Concepts = 条件と期間に対する正しい動作。Feature/Behavior = 品質属性。Decision = 信頼性を性能・効率・処理量と区別。
- 対応: Lesson `lesson-d1-validation`、Glossary `g-code-correctness`、Comparison `-`。
- **MISSING (25/100)**: 現行教材に信頼性を期間と条件で定義し、効率性と対比する説明がない。

### 46. 潜在不具合の特定と信頼性

- 原本: 問題 `Sheet1!A418` / 解答 `Sheet1!I294`。正解は選択肢 **2**。
- 解説要旨: 潜在する欠陥を見つけてバグ・エラーを防ぐ。
- 知識分解: Terms = Static Analysis、Reliability。Concepts = 欠陥予防と性能最適化の差。Feature/Behavior = コードレビュー・解析。Decision = バグの発見を、I/O最適化や新構文採用と区別。
- 対応: Lesson `lesson-d1-validation;lesson-d5-security-remediation`、Glossary `g-critical-evaluation;g-static-analysis-copilot`、Comparison `-`。
- **PARTIAL (60/100)**: 欠陥発見は扱うが信頼性と性能・速度の明確な比較がない。

### 47. 良い既存コードと提案品質

- 原本: 問題 `Sheet1!A434` / 解答 `Sheet1!I294`。正解は選択肢 **1**。
- 解説要旨: 既存の良いコードパターンに沿った提案を得やすくなる。
- 知識分解: Terms = Inline Suggestions、Code Quality。Concepts = 既存パターンの影響。Feature/Behavior = 文脈に沿うコード補完。Decision = 品質基準の維持が一貫した提案につながることを選ぶ。
- 対応: Lesson `lesson-d2-inline-suggestions;lesson-d5-generation-refactoring`、Glossary `g-context-gathering;g-code-refactoring`、Comparison `-`。
- **COVERED (90/100)**: 既存コードのパターンと補完の関係を学べる。

### 48. 安全な例外処理

- 原本: 問題 `Sheet1!A451` / 解答 `Sheet1!I294`。正解は選択肢 **2**。
- 解説要旨: 具体的な例外を捕捉し、機密を漏らさず、例外を握り潰さない。
- 知識分解: Terms = Exception Handling、Sensitive Data。Concepts = 具体的な例外捕捉、秘密の非開示、握り潰し回避。Feature/Behavior = 生成コードの安全性。Decision = 具体的捕捉を選び、機密露出や全例外の握り潰しを退ける。
- 対応: Lesson `lesson-d5-security-remediation;lesson-d1-validation`、Glossary `g-code-correctness;g-security-vulnerability-scan`、Comparison `-`。
- **MISSING (25/100)**: 検証・脆弱性の一般論はあるが、例外粒度、ログへの機密流出、再送出の使い分けを学べない。

### 49. 生成物のコンテンツフィルター

- 原本: 問題 `Sheet1!A468` / 解答 `Sheet1!I314`。正解は選択肢 **4**。
- 解説要旨: 悪意ある、または有害なコードの生成を抑える。
- 知識分解: Terms = Content Filtering、Post-processing。Concepts = 有害コードの抑制と生成後検査。Feature/Behavior = 出力フィルタリング。Decision = 有害コード対策を、最新性や生成速度の改善と区別。
- 対応: Lesson `lesson-d3-prompt-pipeline;lesson-d3-data-flow`、Glossary `g-post-processing;g-knowledge-cutoff`、Comparison `-`。
- **COVERED (90/100)**: 後処理と有害性チェック、最新性限界の別を学べる。

### 50. 有害性フィルターの目的

- 原本: 問題 `Sheet1!A485` / 解答 `Sheet1!I314`。正解は選択肢 **3**。
- 解説要旨: 有害または不快な提案内容を除外する。
- 知識分解: Terms = Toxicity Filter、Public Code Matching。Concepts = 有害・不快な内容と公開コード類似の別。Feature/Behavior = 出力安全フィルター。Decision = 有害性の除外を著作権照合や構文検査と区別。
- 対応: Lesson `lesson-d3-prompt-pipeline;lesson-d6-public-code-matching`、Glossary `g-post-processing;g-public-code-matching`、Comparison `cmp-exclusion-vs-publicmatch`。
- **PARTIAL (65/100)**: 用語はあるが、有害性・公開コード一致・内容除外を一つの判断表で比較する教材がない。

## Terms Coverage / Official Practice Knowledge Map

88個の表記をそのまま列挙します（日本語訳・略語・近縁語を含む）。同じ概念を使う問はまとめました。Glossary欄の「関連」は対応候補で、用語の直接見出しを意味しません。Qualityは各問で必要な深さまで説明できるかの保守的な評価です。

| Term | Practice Questions | Glossary | Quality | Status |
| --- | --- | --- | --- | --- |
| Act | 40 | 関連: `g-test-assertions-mocking` | 判断に必要な説明がない | MISSING |
| AIコーディング支援 | 16 | 関連: `g-generative-ai`, `g-inline-suggestions` | 該当問題の判断に十分 | COVERED |
| Arrange | 40 | 関連: `g-test-assertions-mocking` | 判断に必要な説明がない | MISSING |
| Assert | 40 | 関連: `g-test-assertions-mocking` | 判断に必要な説明がない | MISSING |
| Assertion | 43 | 関連: `g-edge-case-discovery`, `g-test-assertions-mocking` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Assertions | 38 | 関連: `g-edge-case-discovery`, `g-test-assertions-mocking`, `g-unit-test-generation` | 該当問題の判断に十分 | COVERED |
| Business | 04 | 関連: `g-org-policies`, `g-seat-management` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Chat Participants | 08, 32 | 直接: `g-chat-participants` | 該当問題の判断に十分 | COVERED |
| Chat Variables | 08, 32 | 直接: `g-chat-variables` | 該当問題の判断に十分 | COVERED |
| Code Context | 41 | 関連: `g-edge-case-discovery`, `g-unit-test-generation` | 該当問題の判断に十分 | COVERED |
| Code Explanation | 09 | 関連: `g-code-explanation`, `g-copilot-chat` | 該当問題の判断に十分 | COVERED |
| Code Quality | 47 | 関連: `g-code-refactoring`, `g-context-gathering` | 該当問題の判断に十分 | COVERED |
| Code Translation | 37 | 関連: `g-code-translation`, `g-legacy-modernization` | 該当問題の判断に十分 | COVERED |
| Comments | 36 | 関連: `g-doc-generation` | 該当問題の判断に十分 | COVERED |
| Completions Panel | 24 | 直接: `g-completions-panel` | 該当問題の判断に十分 | COVERED |
| Content Filtering | 49 | 関連: `g-knowledge-cutoff`, `g-post-processing` | 該当問題の判断に十分 | COVERED |
| Context | 17, 21, 28, 29, 33 | 関連: `g-context-gathering`, `g-context-priming`, `g-context-pruning`, `g-generative-ai`, `g-inline-suggestions`, `g-post-processing`, `g-prompt-anatomy`, `g-prompt-construction`, `g-tokenization` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Copilot | 19 | 関連: `g-generative-ai`, `g-prompt-construction` | 該当問題の判断に十分 | COVERED |
| Copilot Business | 03 | 関連: `g-spaces`, `g-subscription-plans` | 現行仕様との照合が必要 | UNCERTAIN |
| Copilot Chat | 07, 09, 10, 25 | 直接: `g-copilot-chat` | 該当問題の判断に十分 | COVERED |
| Copilot Code Review | 05 | 直接: `g-copilot-code-review` | 該当問題の判断に十分 | COVERED |
| Copilot Enterprise | 03 | 関連: `g-spaces`, `g-subscription-plans` | 現行仕様との照合が必要 | UNCERTAIN |
| Copilot Free | 01 | 関連: `g-subscription-plans` | 現行仕様との照合が必要 | UNCERTAIN |
| Copilot Pro | 01 | 関連: `g-subscription-plans` | 現行仕様との照合が必要 | UNCERTAIN |
| Copilot Spaces | 06, 18 | 直接: `g-spaces` | 現行仕様との照合が必要 | UNCERTAIN |
| Correctness | 45 | 関連: `g-code-correctness` | 判断に必要な説明がない | MISSING |
| Edge Case | 38 | 関連: `g-edge-case-discovery`, `g-test-assertions-mocking`, `g-unit-test-generation` | 該当問題の判断に十分 | COVERED |
| Exception Handling | 48 | 関連: `g-code-correctness`, `g-security-vulnerability-scan` | 判断に必要な説明がない | MISSING |
| Few-shot | 20 | 直接: `g-few-shot` | 関連説明はあるが使い分けが薄い | PARTIAL |
| FIM | 22 | 関連: `g-context-gathering`, `g-inline-suggestions` | 判断に必要な説明がない | MISSING |
| GitHub Copilot | 16 | 関連: `g-generative-ai`, `g-inline-suggestions` | 該当問題の判断に十分 | COVERED |
| Individuals | 14 | 関連: `g-copilot-proxy`, `g-transit-encryption` | 現行仕様との照合が必要 | UNCERTAIN |
| Inline Chat | 12, 13 | 直接: `g-inline-chat` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Inline Documentation | 36 | 関連: `g-doc-generation` | 該当問題の判断に十分 | COVERED |
| Inline Suggestions | 11, 15, 17, 23, 24, 47 | 直接: `g-inline-suggestions` | 該当問題の判断に十分 | COVERED |
| Input Validation | 43 | 関連: `g-edge-case-discovery`, `g-test-assertions-mocking` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Instructions | 26 | 関連: `g-prompt-anatomy`, `g-prompt-engineering` | 該当問題の判断に十分 | COVERED |
| Intent | 29 | 関連: `g-context-priming`, `g-prompt-anatomy` | 該当問題の判断に十分 | COVERED |
| JetBrains | 02 | 関連: `g-inline-suggestions` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Legacy Modernization | 37 | 関連: `g-code-translation`, `g-legacy-modernization` | 該当問題の判断に十分 | COVERED |
| LLM | 28 | 関連: `g-generative-ai`, `g-tokenization` | 該当問題の判断に十分 | COVERED |
| Maintainability | 44 | 関連: `g-code-correctness`, `g-critical-evaluation` | 判断に必要な説明がない | MISSING |
| Neovim | 02 | 関連: `g-inline-suggestions` | 関連説明はあるが使い分けが薄い | PARTIAL |
| One-shot | 20 | 関連: `g-few-shot`, `g-zero-shot` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Organization | 04 | 関連: `g-org-policies`, `g-seat-management` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Outbound Flow | 23 | 関連: `g-post-processing`, `g-suggestion-lifecycle` | 該当問題の判断に十分 | COVERED |
| Output Quality | 27 | 関連: `g-prompt-anatomy`, `g-prompt-engineering` | 該当問題の判断に十分 | COVERED |
| Post-processing | 49 | 関連: `g-knowledge-cutoff`, `g-post-processing` | 該当問題の判断に十分 | COVERED |
| Productivity | 42 | 関連: `g-unit-test-generation`, `g-verification-validation` | 該当問題の判断に十分 | COVERED |
| Project Documentation | 35 | 関連: `g-doc-generation` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Prompt | 19, 26, 27, 28, 29, 30, 33 | 関連: `g-context-priming`, `g-context-pruning`, `g-generative-ai`, `g-prompt-anatomy`, `g-prompt-construction`, `g-prompt-engineering`, `g-task-decomposition`, `g-tokenization` | 該当問題の判断に十分 | COVERED |
| Public Code Matching | 50 | 関連: `g-post-processing`, `g-public-code-matching` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Pull Request Summaries | 05 | 直接: `g-pr-summaries` | 該当問題の判断に十分 | COVERED |
| Refactoring | 34 | 関連: `g-code-refactoring` | 該当問題の判断に十分 | COVERED |
| Reliability | 44, 45, 46 | 関連: `g-code-correctness`, `g-critical-evaluation`, `g-static-analysis-copilot` | 判断に必要な説明がない | MISSING |
| Requirements | 35 | 関連: `g-doc-generation` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Security | 44 | 関連: `g-code-correctness`, `g-critical-evaluation` | 判断に必要な説明がない | MISSING |
| Sensitive Data | 48 | 関連: `g-code-correctness`, `g-security-vulnerability-scan` | 判断に必要な説明がない | MISSING |
| Slash Commands | 08, 10, 12, 13, 32 | 直接: `g-slash-commands` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Static Analysis | 46 | 関連: `g-critical-evaluation`, `g-static-analysis-copilot` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Student | 01 | 関連: `g-subscription-plans` | 現行仕様との照合が必要 | UNCERTAIN |
| Tab | 15 | 関連: `g-ghost-text`, `g-inline-suggestions` | 該当問題の判断に十分 | COVERED |
| Task Scope | 30 | 関連: `g-context-pruning`, `g-task-decomposition` | 該当問題の判断に十分 | COVERED |
| Test Explorer | 39 | 関連: `g-unit-test-generation` | 判断に必要な説明がない | MISSING |
| Toxicity Filter | 50 | 関連: `g-post-processing`, `g-public-code-matching` | 関連説明はあるが使い分けが薄い | PARTIAL |
| Unit Test | 38, 41, 42 | 関連: `g-edge-case-discovery`, `g-test-assertions-mocking`, `g-unit-test-generation`, `g-verification-validation` | 該当問題の判断に十分 | COVERED |
| Usability | 44 | 関連: `g-code-correctness`, `g-critical-evaluation` | 判断に必要な説明がない | MISSING |
| Verification | 25 | 関連: `g-critical-evaluation`, `g-verification-validation` | 該当問題の判断に十分 | COVERED |
| Visual Studio | 02 | 関連: `g-inline-suggestions` | 関連説明はあるが使い分けが薄い | PARTIAL |
| VPNプロキシ | 14 | 関連: `g-copilot-proxy`, `g-transit-encryption` | 現行仕様との照合が必要 | UNCERTAIN |
| VS Code | 02, 39 | 関連: `g-inline-suggestions`, `g-unit-test-generation` | 判断に必要な説明がない | MISSING |
| Zero-shot | 20 | 直接: `g-zero-shot` | 関連説明はあるが使い分けが薄い | PARTIAL |
| カーソル前後のコード | 22 | 関連: `g-context-gathering`, `g-inline-suggestions` | 判断に必要な説明がない | MISSING |
| コメント | 31 | 関連: `g-context-gathering`, `g-context-priming` | 該当問題の判断に十分 | COVERED |
| コードコメント | 11 | 関連: `g-context-gathering`, `g-inline-suggestions` | 該当問題の判断に十分 | COVERED |
| コードベース | 03 | 関連: `g-spaces`, `g-subscription-plans` | 現行仕様との照合が必要 | UNCERTAIN |
| シート | 04 | 関連: `g-org-policies`, `g-seat-management` | 関連説明はあるが使い分けが薄い | PARTIAL |
| ドキュメントセット | 06 | 関連: `g-spaces` | 現行仕様との照合が必要 | UNCERTAIN |
| ポリシー | 04 | 関連: `g-org-policies`, `g-seat-management` | 関連説明はあるが使い分けが薄い | PARTIAL |
| リファクタリング | 07 | 直接: `g-code-refactoring` | 該当問題の判断に十分 | COVERED |
| 内部知識 | 18 | 関連: `g-context-scope-limits`, `g-spaces` | 関連説明はあるが使い分けが薄い | PARTIAL |
| 外部動作 | 34 | 関連: `g-code-refactoring` | 該当問題の判断に十分 | COVERED |
| 安全性フィルター | 21 | 関連: `g-post-processing`, `g-prompt-construction` | 関連説明はあるが使い分けが薄い | PARTIAL |
| 組織コードベース | 18 | 関連: `g-context-scope-limits`, `g-spaces` | 関連説明はあるが使い分けが薄い | PARTIAL |
| 統計分析 | 21 | 関連: `g-post-processing`, `g-prompt-construction` | 関連説明はあるが使い分けが薄い | PARTIAL |
| 自己署名証明書 | 14 | 関連: `g-copilot-proxy`, `g-transit-encryption` | 現行仕様との照合が必要 | UNCERTAIN |
| 関数名 | 31 | 関連: `g-context-gathering`, `g-context-priming` | 該当問題の判断に十分 | COVERED |
| 関連ファイル | 31 | 関連: `g-context-gathering`, `g-context-priming` | 該当問題の判断に十分 | COVERED |

### Official Practice Knowledge Map（同義概念の統合）

| 知識テーマ | Appears in | Required Knowledge | Importance |
| --- | --- | --- | --- |
| Copilotプラン・組織管理 | 01, 03, 04, 06, 14, 18 | Free/有料/組織プラン、資格、ポリシー、シート、索引・Spaces・旧KB、ネットワーク条件 | HIGH |
| IDE・インライン補完 | 02, 11, 13, 15–17, 24 | IDE別機能、Tabによる採用、候補切替、現在ファイルと選択範囲の文脈 | HIGH |
| Copilot ChatとPR支援 | 05, 07–10, 12–13, 32 | Chatの説明・修正提案、参加者/変数/コマンド、PR要約とレビューの境界 | HIGH |
| 文脈収集と生成処理 | 17, 19, 21–23, 47, 49–50 | 入力→FIM/生成→後処理→提示・採用、品質・安全フィルターとの関係 | HIGH |
| プロンプトと例示 | 20, 25–33 | Goal/Context/Constraints、Zero/One/Few-shot、文脈内適応、焦点化と冗長さ | HIGH |
| コード改善と文書 | 07, 34–37, 47 | 外部動作を保つリファクタリング、文書の種類、言語変換と検証 | MEDIUM |
| テスト作成・運用 | 38–43 | 境界例、期待値、AAA、入力検証とアサーション、Test Explorerとの役割差 | HIGH |
| 品質と安全な例外処理 | 44–46, 48 | 信頼性/性能/保守性/安全性の違い、欠陥発見、具体的捕捉と機密保護 | HIGH |
| 出力フィルター | 49–50 | 有害性、公開コード一致、内容除外がそれぞれ何を判定するか | MEDIUM |


## Concept Coverage

問題ごとの概念を統合した一覧です。詳細な判断の根拠は上の設問別節にあります。

| Concept | Practice Questions | 対応状況 |
| --- | --- | --- |
| エディター別機能対応 | 02 | PARTIAL |
| コードからのテスト候補 | 41 | COVERED |
| コード理解と要約 | 09 | COVERED |
| テストの実行・デバッグ・結果管理 | 39 | MISSING |
| テスト案の作成支援と限界 | 42 | COVERED |
| ネットワーク設定とプラン境界 | 14 | UNCERTAIN |
| プラン差 | 03 | UNCERTAIN |
| ポリシーと利用権限の別 | 04 | PARTIAL |
| リポジトリ索引とモデル学習の違い | 03 | UNCERTAIN |
| 一般的作業のショートカット | 12 | COVERED |
| 不正入力の検査と期待出力の確認の差 | 43 | PARTIAL |
| 例示による文脈内適応 | 20 | PARTIAL |
| 候補比較と手動選択 | 24 | COVERED |
| 入力と生成指示 | 26 | COVERED |
| 入力・期待値・境界条件 | 38 | COVERED |
| 入力処理と出力検査の段階 | 21 | PARTIAL |
| 入力文脈と生成 | 19 | COVERED |
| 入力文脈と補完 | 11 | COVERED |
| 共有コンテキスト | 18 | PARTIAL |
| 共有資料による回答の根拠付け | 06 | UNCERTAIN |
| 具体的な例外捕捉 | 48 | MISSING |
| 内部構造の改善と回帰検証 | 34 | COVERED |
| 出力の正確性・完全性 | 25 | COVERED |
| 利用資格 | 01 | UNCERTAIN |
| 前方と後方を使う補完 | 22 | MISSING |
| 単体テストの三段階構造 | 40 | MISSING |
| 周辺コードの収集 | 17 | COVERED |
| 対象の限定と結果確認 | 30 | COVERED |
| 対象範囲と達成目標 | 29 | COVERED |
| 廃止機能 | 06 | UNCERTAIN |
| 後処理とユーザー承認 | 23 | COVERED |
| 恒久的な学習との差 | 20 | PARTIAL |
| 提案の表示と採用 | 15 | COVERED |
| 提案生成と人間による採用 | 16 | COVERED |
| 握り潰し回避 | 48 | MISSING |
| 文脈に応じた生成 | 28 | COVERED |
| 文脈指定と依頼の具体性 | 32 | COVERED |
| 文脈提示 | 31 | COVERED |
| 既存コードの構造改善 | 07 | COVERED |
| 既存パターンの影響 | 47 | COVERED |
| 明確な依頼と不要な長文の差 | 33 | COVERED |
| 有害コードの抑制と生成後検査 | 49 | COVERED |
| 有害・不快な内容と公開コード類似の別 | 50 | PARTIAL |
| 条件と期間に対する正しい動作 | 45 | MISSING |
| 権限に従った資料参照 | 18 | PARTIAL |
| 欠陥予防と性能最適化の差 | 46 | PARTIAL |
| 無料枠と有料枠 | 01 | UNCERTAIN |
| 理解しやすさ・保守性 | 36 | COVERED |
| 目的・文脈の明確さ | 27 | COVERED |
| 短い依頼 | 13 | PARTIAL |
| 秘密の非開示 | 48 | MISSING |
| 範囲・目的・要件の共有 | 35 | PARTIAL |
| 自動修正の限界 | 10 | COVERED |
| 複数の品質特性 | 44 | MISSING |
| 要約とレビューの用途差 | 05 | COVERED |
| 言語間移植と挙動保持 | 37 | COVERED |
| 診断と提案 | 10 | COVERED |
| 質問の文脈と意図 | 08 | COVERED |
| 選択コード・現在ファイルの文脈 | 13 | PARTIAL |
## 用語・概念の全体像

同義の表記は統合しました。Glossaryに単語が載るだけではCOVEREDにせず、設問で必要な使い分けをLesson・Comparisonで説明できるかを確認しています。

| 領域 | COVEREDの主な語・概念 | PARTIAL / MISSING / UNCERTAINの語・概念 |
| --- | --- | --- |
| プラン・組織 | ポリシー、シート管理、PR要約とレビュー | Free/Pro/Enterpriseの現行差、モデル訓練と索引、旧Knowledge Base、プロキシのプラン差、設定手順 |
| IDE・Chat | インライン提案、Chat参加者、Slash Commands、Chat Variables、候補の採用 | IDE別対応表、Inline Chatの暗黙文脈、Test Explorer |
| データフロー | 文脈収集、生成後の提案表示・採用 | FIM、生成段階の区別、有害性フィルターと公開コード照合 |
| プロンプト | Zero/Few-shot、Goal/Context/Constraints、タスクの焦点化 | 例示による文脈内適応と恒久学習の区別 |
| 生産性・品質 | リファクタリング、言語変換、テスト生成・境界例 | プロジェクト文書の種類、Arrange–Act–Assert、入力検証、品質属性、信頼性、安全な例外処理 |

## 混同しやすい判断・比較の不足

| 比較 | 現状 | 対応が必要な理由 |
| --- | --- | --- |
| Copilot Free / Pro / Business / Enterprise、学生資格 | 要更新・添付解答と矛盾 | Q1, Q3: 時点付きの公式プラン表で確認し、モデル学習とコード索引を分離する。 |
| 旧Knowledge Base / 現行Spaces / 通常のChat | 一部対応 | Q6, Q18: 旧語から現行機能への移行、権限と利用場面を判断できる表が必要。 |
| Zero/One/Few-shot / モデル再訓練 | 一部対応 | Q20: プロンプト中の例示を恒久学習と誤解しやすい。 |
| 文脈収集 / FIM / モデル生成 / 後処理 | 一部対応 | Q21–23: パイプラインのどの段階に属するかを示す。 |
| Copilotによるテスト生成 / VS Code Test Explorer / AAA | 不足 | Q38–42: 生成、テスト構造、実行・デバッグを分ける。 |
| 信頼性 / 性能 / 保守性 / 安全性 | 不足 | Q44–46: 品質属性の定義と対照例が必要。 |
| 有害性フィルター / 公開コード一致 / 内容除外 | 一部対応 | Q49–50: 守る対象と判定の違いを選択肢で見分けられるようにする。 |

## Missing Knowledge / Gap Classification / Priority

G1–G6は依頼文の定義どおり、**不足の種類**を示します。複数種類が同じ知識に関わる場合、重複する教材追加ではなく一つの改善パッケージとして扱います。`SOURCE-*` は設問の鮮度・正誤の別枠です。

| 優先 | 統合した不足 | 分類 | 対象問 | 推奨する最小変更（今回は未実施） |
| --- | --- | --- | --- | --- |
| P0 | 設問ソースの整合 | SOURCE | 1, 3, 6, 14 | 公式資料との差を確認して設問の採用可否を決める。 |
| P0 | FIMと補完パイプライン | G1, G4, G6 | 21, 22 | FIM用語、カーソル前後の例、生成と後処理を追加。 |
| P0 | テストUIとAAA | G1, G3, G6 | 39, 40 | Test ExplorerとArrange–Act–AssertのLesson・Glossaryを追加。 |
| P0 | 品質属性・信頼性 | G1, G3, G5 | 44–46 | 品質特性の体系と信頼性・性能の比較を追加。 |
| P0 | 安全な例外処理 | G1, G3, G6 | 48 | 捕捉、ログ、再送出の安全な例を追加。 |
| P1 | IDE・Chatの使い分け | G2, G4, G6 | 2, 13 | IDE機能表と暗黙文脈の判断例を追加。 |
| P1 | 組織設定と内部知識 | G4, G6 | 4, 18 | 時点付きの管理操作と、Spaces・索引・権限の判断例を追加。 |
| P1 | 例示とモデル学習 | G4, G6 | 20 | 文脈内適応とモデル再訓練の相違を明記。 |
| P1 | 文書・入力検証・フィルター | G2, G4, G5, G6 | 35, 43, 50 | 文書の種類、アサーションと入力検証、各フィルターを対比。 |
| P2 | 既存の強い領域の例の補強 | G4 | 5, 7–12, 15–17, 23–34, 36–38, 41–42, 47, 49 | 現状維持を優先し、必要に応じてシナリオ例を増やす。 |

### Recommended Expansion（提案のみ）

- **Add Glossary:** FIM、Test Explorer、Arrange–Act–Assert、Reliability、安全な例外処理。
- **Expand Glossary:** Inline Chatの暗黙文脈、入力検証とアサーション、フィルターの種類。
- **Add Lesson:** テストUIとAAA、品質属性と安全な例外処理。
- **Expand Lesson:** IDE別機能、補完処理段階、文書の種類、組織コンテキスト。
- **Add Comparison:** 信頼性と性能、テスト生成とTest Explorer、有害性と公開コード一致、Free/Pro/Business/Enterpriseの時点付き比較。

## Already Strong Areas

Chatの説明・修正支援（Q7–12）、プロンプトの構成と焦点化（Q25–33）、補完候補の表示・採用（Q15–17、Q23–24）、リファクタリングと言語変換（Q34、Q37）、テスト生成と境界例（Q38、Q41–42）は、定義だけでなく利用判断に必要な記述があります。

## 添付解答と現行GitHub資料の相違

| PRACTICE_WORDING | CURRENT_OFFICIAL_TERM / 確認事項 | 対象 |
| --- | --- | --- |
| 一般利用者は有料、学生のみ無料 | Copilot Free / Student / Pro（現行プラン） | Q1 |
| Enterpriseが組織コードでモデルを訓練 | Repository indexing / Spaces（検索・参照とモデル訓練の区別） | Q3 |
| ドキュメントセット | 旧Knowledge BasesからCopilot Spacesへの移行（対応関係は推論） | Q6 |
| Business専用のVPNプロキシ・自己署名証明書 | Network settingsのプラン・クライアント条件を再確認 | Q14 |

- **Q1**: 添付は一般利用者に無料プランがない前提で月額10ドルを正解にしています。現行公式の[Copilot plans](https://docs.github.com/en/copilot/get-started/plans)はCopilot Freeを掲載しています。`g-subscription-plans` も現行Freeを扱うため、添付正解をそのまま教材に移さないでください。
- **Q3**: 添付はEnterpriseが組織コードベースを用いてCopilotを「訓練」すると読めます。現行の[repository indexing](https://docs.github.com/en/enterprise-cloud%40latest/copilot/concepts/context/repository-indexing)は索引をモデル訓練と分けています。パーソナライズの現行機能は[Copilot Spaces](https://docs.github.com/en/copilot/concepts/context/spaces)とも照合が必要です。
- **Q6**: 添付の「ドキュメントセット」は旧Knowledge Baseを指す可能性が高いです。[GitHubのsunset告知](https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/)では2025-11-01にKnowledge Basesを終了しSpacesへ移行すると記されています。これは語の対応に関する推論であり、設問原本の作成時期は不明です。
- **Q14**: 添付は自己署名証明書を伴うVPNプロキシをBusiness専用と断定します。[現行Network settings](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/network-settings)はプロキシとカスタム証明書を説明しますが、添付と同じプラン制限を確認できませんでした。版・クライアント条件を追加確認するまでUNCERTAINです。
- **Q43**: 添付解説はアサーションが「有効なデータのみを保証」と記します。テストのアサーションと本番コードの入力検証は役割が異なるため、追加教材ではその違いを明示すべきです。

## 方法と限界

- Excel内の問題画像50枚、重複問題画像1枚、解答画像17枚を照合しました。解答画像はQ1–50をすべて含みます。正解番号は画像で確認し、OCR文字列は検索補助として `official-practice-question-inventory.json` に収録しました。
- 対応度は教材本文の概念・判断材料で判定しました。関連IDの存在だけでは十分としません。アプリ内の既存200問は今回の主な判定対象ではありません。
- 問題群は旧表現を含みます。現行試験の出題仕様、旧設問の正式な出典・正誤、翻訳の正確性までは本資料から確定できません。外部資料との相違は教材ギャップと分離しました。
- Lesson、Glossary、Comparison、Questionのコンテンツは変更していません。次の実装はP0の設問確認後に行うことを推奨します。
