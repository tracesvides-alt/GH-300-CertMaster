# 用語集と基礎問題の全件品質レビュー

## 結果

用語 120 件すべてに基礎問題が対応。保存済み基礎 173 問（旧問題を含む）の指紋とレビュー記録を検査。現行基礎資産163問のうち演習対象は162問。基礎レビューの累積改稿は46 問。未対応用語 0 件。
基礎問題として名称・役割・単一条件の識別を残しています。本文なしで正答を推測できる懸念があった対象を追加改稿しました。編集判断の記録があることだけで、全問題の推測リスク解消を保証しません。
同義の別解、MCP Clientとの間接的な対応、旧CLIの現行誤認、一律ゼロ保持、完全な決定性、ローカル限定という断定も修正しました。

## 追加レビューの履歴

- 2026-10-13：q05、q-d3-f03、q-d3-f04、q-d4-f01、q-d6-a07、q-d3-e05。[変更前後と判定理由](foundation-six-refinement-review.md)。
- 2026-10-13：q05、q06、q11、q-d1-f03、q-d1-f05、q-d1-a05、q-d2-f04、q-d2-f05、q-d2-f08、q-d2-f09、q-d2-f10、q-d2-f11、q-d2-a05、q-d2-a06、q-d2-a09、q-d2-a10、q-d2-a11、q-d2-a19、q-d2-a22、q-d2-e03、q-d2-e04、q-d2-e12、q-d2-e13、q-d2-e18、q-d3-f03、q-d3-f04、q-d3-f05、q-d3-a02、q-d3-a04、q-d3-e05、q-d4-a08、q-d5-f01、q-d5-f02、q-d5-f02-b、q-d5-f04、q-d5-f05、q-d6-f01、q-d6-f03、q-d6-f04、q-d6-f05、q-d6-a02、q-d6-a04、q-d6-a05、q-d6-a06、q-d6-a07、q-sc04-1、q-sc04-2、q-sc06-1、q-sc09-2、q-sc10-1、q-sc10-2、q-d1-g04、q-d1-g05、q-d2-g12、q-d4-g08、q-d4-g09、q-d5-g05、q-d6-g05。[変更前後と判定理由](question-objective-classification-review.md)。
- 2026-10-13：q-d1-f03、q-d1-f05。[変更前後と判定理由](d1-d5-classification-correction.md)。
- 2026-10-13：q-d2-a06、q-d2-a08、q-d2-a09、q-d2-a11、q-d2-a21、q-d2-a22。[変更前後と判定理由](applied-remediation-review.md)。
- 2026-10-17：q-fnd-cli-install-20261017、q-fnd-cli-login-20261017、q-fnd-cli-create-file-20261017、q-fnd-seat-api-20261017、q-fnd-cloud-issue-20261017、q-fnd-plan-20261017、q-fnd-nes-20261017、q-fnd-ide-matrix-20261017、q-fnd-ide-signin-20261017、q-fnd-mobile-file-20261017。[変更前後と判定理由](foundation-priority-2026-10-17.md)。

追加時点で新たに再読したのは上記の対象です。現在の基礎全問を同時に新たに再評価したという意味ではありません。

## 留保

g-exclusion-limitations → q11はneeds-reviewを維持。IDE Agentでの除外対応の確認を問う内容として整えましたが、教材の関連する利用面の公式資料間の相違を未解決のままverifiedへ変更していません。
本文なし判別・唯一正解性は編集判断です。受験者へ問題文を隠して回答させる実測や正答率による難易度校正は行っていません。

## 用語と基礎問題の対応（全件）

| 用語ID | 用語 | 基礎問題 | 状態 |
| --- | --- | --- | --- |
| g-generative-ai | Generative AI | q-d1-g01 | verified |
| g-hallucination | Hallucination | q-d1-f02 | verified |
| g-responsible-ai | Responsible AI | q-d1-g02 | verified |
| g-ai-bias | AI Bias & Fairness | q-d1-f04 | verified |
| g-ip-copyright | Intellectual Property & Copyright | q-d1-a05 | verified |
| g-transparency | Transparency and Explainability | q-d1-g03 | verified |
| g-code-accountability | Code Accountability & Human-in-the-Loop | q-d1-f01 | verified |
| g-nondeterminism | Nondeterminism in LLMs | q-d1-g04 | verified |
| g-verification-validation | Verification & Validation | q02 | verified |
| g-automation-bias | Over-reliance / Automation Bias | q-d1-g05 | verified |
| g-critical-evaluation | Critical Evaluation of Suggestions | q-d1-g06 | verified |
| g-code-correctness | Code Correctness Verification | q06 | verified |
| g-security-vulnerability-scan | Security Vulnerability Scanning in AI Output | q-d1-f05 | verified |
| g-peer-review-ai | Peer Review for AI-Generated Code | q-d1-a06 | verified |
| g-inline-suggestions | Inline Suggestions | q03 | verified |
| g-ghost-text | Ghost Text | q-d2-g01 | verified |
| g-completions-panel | Copilot Completions Panel | q-d2-g02 | verified |
| g-copilot-chat | Copilot Chat | q04 | verified |
| g-inline-chat | Inline Chat | q-d2-f01 | verified |
| g-chat-participants | Chat Participants | q-d2-g03 | verified |
| g-slash-commands | Slash Commands | q-d2-f03 | verified |
| g-chat-variables | Chat Variables | q-d2-f02 | verified |
| g-status-menu | Copilot Status Menu & Icon | q-d2-g04 | verified |
| g-copilot-cli | GitHub Copilot in the CLI | q-d2-f11 | verified |
| g-gh-copilot-explain | gh copilot explain | q-d2-g05 | verified |
| g-gh-copilot-suggest | gh copilot suggest | q-d2-g06 | verified |
| g-cli-shell-aliases | Terminal Shell Aliases (ghcs / ghce) | q-d2-g07 | verified |
| g-cli-execution-confirm | CLI Execution Confirmation & Safeguards | q-d2-g08 | verified |
| g-cli-context-limits | CLI Context Limitations | q-d2-g09 | verified |
| g-agent-mode | Agent Mode | q-d2-f04 | verified |
| g-copilot-edits | Copilot Edits | q-d2-g10 | verified |
| g-mcp | Model Context Protocol (MCP) | q-d2-f06 | verified |
| g-mcp-server | MCP Server | q-d2-g11 | verified |
| g-mcp-client | MCP Client | q-d2-a08 | verified |
| g-mcp-tools | MCP Tools & Resources | q-d2-f07 | verified |
| g-agent-sessions | Agent Sessions | q-d2-g12 | verified |
| g-sub-agents | Sub-Agents | q-d2-g13 | verified |
| g-copilot-code-review | Copilot Code Review | q-d2-g14 | verified |
| g-pr-summaries | Pull Request Summaries | q-d5-f04 | verified |
| g-custom-instructions | Custom Instructions (`copilot-instructions.md`) | q-d2-f08 | verified |
| g-scoped-instructions | Scoped Instructions | q-d2-g15 | verified |
| g-prompt-files | Prompt Files (`.github/prompts/*.prompt.md`) | q-d2-f09 | verified |
| g-spaces | GitHub Copilot Spaces | q-d2-f10 | verified |
| g-spark | GitHub Spark | q-d2-g16 | verified |
| g-copilot-extensions | Copilot Extensions | q-d2-g17 | verified |
| g-org-policies | Organization Copilot Policies | q-d2-g18 | verified |
| g-enterprise-policies | Enterprise Copilot Policies | q-d2-g19 | verified |
| g-seat-management | Seat Assignment and Management | q-d6-a05 | verified |
| g-subscription-plans | Copilot Subscription Plans (Business vs Enterprise vs Pro) | q-d2-g20 | verified |
| g-audit-logs | Copilot Audit Logs | q-d6-f04 | verified |
| g-usage-metrics-api | Copilot Metrics API / REST API | q-d6-f05 | verified |
| g-code-review-policies | Copilot Code Review Policies | q-d2-g21 | verified |
| g-policy-inheritance | Policy Inheritance (Enterprise -> Org -> Repo) | q-d6-a06 | verified |
| g-data-flow | Copilot Data Flow | q-d3-g01 | verified |
| g-context-gathering | Context Gathering & Determination | q05 | verified |
| g-prompt-construction | Prompt Construction Pipeline | q-d3-g02 | verified |
| g-copilot-proxy | Copilot Proxy & Gateway | q-d3-g03 | verified |
| g-telemetry-data | Engagement and Telemetry Data | q-d3-g04 | verified |
| g-code-retention-policy | Code Snippet Retention Policy (Zero Retention) | q-d3-g05 | verified |
| g-tokenization | Tokenization and Input Processing | q-d3-f05 | verified |
| g-post-processing | Post-processing & Content Filtering | q-d3-g06 | verified |
| g-transit-encryption | Encryption in Transit & TLS | q-d3-g07 | verified |
| g-suggestion-lifecycle | Code Suggestion Lifecycle | q-d3-g08 | verified |
| g-context-window | Context Window & Token Budget | q-d3-g09 | verified |
| g-latency-tradeoff | Latency vs Quality Tradeoff in Completions | q-d3-g10 | verified |
| g-temperature-determinism | Temperature & LLM Determinism | q-d3-g11 | verified |
| g-knowledge-cutoff | Knowledge Cutoff & Recency Limitations | q-d3-g12 | verified |
| g-context-scope-limits | Context Scope Limitations (Local vs Remote) | q-d3-g13 | verified |
| g-prompt-engineering | Prompt Engineering | q-d4-g01 | verified |
| g-zero-shot | Zero-shot Prompting | q-d4-g02 | verified |
| g-few-shot | Few-shot Prompting | q-d4-f02 | verified |
| g-system-prompt | System Prompt & Instructions Context | q-d4-g03 | verified |
| g-prompt-anatomy | Prompt Anatomy (Goal, Context, Constraints, Examples) | q-d4-f01 | verified |
| g-role-prompting | Role Prompting & Personas | q-d4-g04 | verified |
| g-step-by-step | Step-by-Step / Chain-of-Thought Prompting | q-d4-f04 | verified |
| g-context-priming | Context Priming via Neighboring Tabs | q-d3-f02 | verified |
| g-iterative-refinement | Iterative Prompt Refinement | q-d4-g05 | verified |
| g-thread-reset | Chat Thread Reset & History Management | q08 | verified |
| g-task-decomposition | Task Decomposition (breaking complex tasks) | q-d4-g06 | verified |
| g-context-pruning | Context Pruning & Dilution Avoidance | q-d4-g07 | verified |
| g-negative-prompting | Specifying Constraints & Negative Prompting | q-d4-g08 | verified |
| g-output-specification | Output Format Specification | q-d4-g09 | verified |
| g-code-generation | AI-Assisted Code Generation | q-d5-g01 | verified |
| g-code-refactoring | Code Refactoring with Copilot | q-d5-g02 | verified |
| g-doc-generation | Documentation Generation (JSDoc, Docstrings) | q-d5-f01 | verified |
| g-legacy-modernization | Legacy Code Modernization | q-d5-g03 | verified |
| g-code-translation | Code Translation across Languages | q-d5-g04 | verified |
| g-code-explanation | Code Explanation and Developer Onboarding | q-d2-a14 | verified |
| g-algorithm-optimization | Algorithm Implementation and Optimization | q-d5-g05 | verified |
| g-boilerplate-reduction | Boilerplate Code Reduction | q-d5-g06 | verified |
| g-unit-test-generation | Unit Test Generation with Copilot | q09 | verified |
| g-integration-test-generation | Integration Test Generation | q-d5-g07 | verified |
| g-edge-case-discovery | Edge Case Discovery via Copilot | q-d5-f02 | verified |
| g-test-assertions-mocking | Test Assertions and Mock Generation | q-d5-f05 | verified |
| g-vulnerability-remediation | Security Vulnerability Remediation (`/fix`) | q-d5-g08 | verified |
| g-static-analysis-copilot | Static Analysis Integration with Copilot | q-d5-g09 | verified |
| g-perf-bottlenecks | Performance Bottleneck Identification | q-d5-g10 | verified |
| g-secret-leak-prevention | Secret & Credential Leak Prevention | q-d5-g11 | verified |
| g-content-exclusion | Content Exclusion | q-d6-f02 | verified |
| g-repo-content-exclusion | Repository-Level Content Exclusion | q-sc01-1 | verified |
| g-org-content-exclusion | Organization-Level Content Exclusion | q-d6-g01 | verified |
| g-exclusion-syntax | Content Exclusion Syntax & Wildcards | q-d6-g02 | verified |
| g-output-ownership | Code Output Ownership & Intellectual Property | q-d6-g03 | verified |
| g-enterprise-data-privacy | Data Privacy in Copilot Business and Enterprise | q-d6-f03 | verified |
| g-public-code-matching | Public Code Matching / Filtering | q-d6-f01 | verified |
| g-public-code-log | Public Code Match Reference Log & Code Search | q-d6-a04 | verified |
| g-exclusion-propagation | Content Exclusion Propagation Delay & Troubleshooting | q-d6-g04 | verified |
| g-client-exclusion-check | Client-side Exclusion Verification & Status | q12 | verified |
| g-exclusion-limitations | Content Exclusion Support Limitations (CLI / Agent Mode) | q11 | needs-review |
| g-compliance-auditability | Enterprise Compliance and Auditability | q-d6-g05 | verified |
| g-fill-in-the-middle | Fill-in-the-Middle (FIM) | q-d3-f01 | verified |
| g-test-explorer | VS Code Test Explorer | q-d5-g12 | verified |
| g-arrange-act-assert | Arrange–Act–Assert (AAA) | q-d5-g13 | verified |
| g-code-quality-attributes | Code Quality Attributes | q-d5-g14 | verified |
| g-reliability | Reliability | q-d5-g15 | verified |
| g-safe-exception-handling | Safe Exception Handling | q-d5-g16 | verified |
| g-input-validation | Input Validation | q-d5-g17 | verified |
| g-project-documentation | Project Documentation | q-d5-g18 | verified |
| g-safety-filtering | Harmful Output Filtering | q-d3-g14 | verified |
| g-legacy-knowledge-bases | Copilot Knowledge Bases (retired) | q-d2-g22 | verified |

## 問題レビュー（全件）

| 問題 | 対応用語 | 改稿 | 本文で必要な判断 |
| --- | --- | --- | --- |
| q02 | g-verification-validation | 修正 | 値の仕様適合を直接比較する。 |
| q03 | g-inline-suggestions | 修正 | タイピング位置への未確定補完を表示する機能。 |
| q04 | g-copilot-chat | 維持 | 説明と実行結果を照合し、元のコードを変更しない条件を満たす。 |
| q05 | g-context-gathering | 修正 | 説明したい料金表の値はrates.tsにある。そのコードを明示的な文脈として渡す。添付は回答の正確性や全コードの利用を保証しない。 |
| q06 | g-code-correctness | 修正 | APIの名称と契約を対象バージョンの公式資料で確認する。 |
| q08 | g-thread-reset | 維持 | 無関係な履歴を切り、現在の要件だけを提供できる。 |
| q09 | g-unit-test-generation | 維持 | 不足している境界と異常系を直接テストできる。 |
| q11 | g-exclusion-limitations | 修正 | 条件が一致していても、そのモードで除外が機能するかの確認が必要。 |
| q12 | g-client-exclusion-check | 維持 | クライアントの古い状態を切り分け、実際の除外表示と動作を確かめる。 |
| q-d1-f01 | g-code-accountability | 維持 | 生成結果を確認して製品へ取り込む判断は開発チームが行う。 |
| q-d1-f02 | g-hallucination | 維持 | 実在しないAPIをもっともらしく生成する例である。 |
| q-d1-f03 | 補助問題 | 修正 | 認証と権限の境界を分け、対象操作の拒否を検証する。 |
| q-d1-f04 | g-ai-bias | 修正 | 特定集団への系統的な誤りと代表性不足を示す。 |
| q-d1-f05 | g-security-vulnerability-scan | 維持 | MD5はパスワード保存用の方式ではないため、保存処理そのものを直す。 |
| q-d1-a05 | g-ip-copyright | 修正 | 公開コードと一致したスニペットを製品に採用する際は、その元コードのオープンソースライセンス（GPL、MIT等）が自社の製品配布形態や知財ポリシーと適合するかを直接照合して判断する必要があります。 |
| q-d1-a06 | g-peer-review-ai | 修正 | 型システムはデータの形式を保証しますが、「権限不足のユーザーを確実に拒否する」といった業務上の認可ルールや境界条件の意味的正しさは、人間のレビューやテストによって検証する必要があります。 |
| q-d2-f01 | g-inline-chat | 維持 | 選択範囲の編集提案をその場で確認する用途に合う。 |
| q-d2-f02 | g-chat-variables | 維持 | 選択中のコードを明示して参照できる。 |
| q-d2-f03 | g-slash-commands | 維持 | 選択したコードのテスト生成を依頼するコマンドである。 |
| q-d2-f04 | g-agent-mode | 維持 | 横断的な編集と実行結果を使った継続作業に対応する。 |
| q-d2-f05 | 補助問題 | 修正 | ツール実行の可否を操作前に管理する。 |
| q-d2-f06 | g-mcp | 維持 | 外部システムとの標準化されたデータ・ツール連携を提供する。 |
| q-d2-f07 | g-mcp-tools | 維持 | モデルが引数を付けて呼び出す操作を公開する区分である。 |
| q-d2-f08 | g-custom-instructions | 維持 | リポジトリ全体向けのCopilotカスタム指示の標準ファイルである。 |
| q-d2-f09 | g-prompt-files | 維持 | 再利用可能なPrompt Fileとして保存する配置と拡張子である。 |
| q-d2-f10 | g-spaces | 維持 | 選んだ資料を整理して共有し、質問の文脈として利用できる。 |
| q-d2-f11 | g-copilot-cli | 維持 | 端末で自然言語の相談とツール利用を行う現行のCopilot CLIである。 |
| q-d2-a01 | 補助問題 | 維持 | 特定コードの局所的な直接編集と、適用前の視覚的な差分確認を両立するにはInline Chatが最も適しています。 |
| q-d2-a03 | 補助問題 | 維持 | 方針相談の段階ではコードを変更しないAskモードを用い、実装段階では局所的な差分を目視確認できるInline Chatを用いるのが最適です。 |
| q-d2-a05 | 補助問題 | 維持 | Agentは「ファイル編集」「コマンド実行」「結果に基づく自己修正」というループを自律的に遂行できる点が、対話専用のAskとの決定的な違いです。 |
| q-d2-a06 | 補助問題 | 維持 | 実行結果を観測するループによって失敗原因へ対応し、再実行で確認する。 |
| q-d2-a08 | g-mcp-client | 維持 | サーバーと接続して機能を利用するクライアント。 |
| q-d2-a09 | 補助問題 | 維持 | 新規チャットを開始すると、以前の会話履歴を使わずに対話できます。現在のファイルや指示など、会話履歴以外の文脈までなくなるとは限りません。 |
| q-d2-a10 | 補助問題 | 維持 | オンデマンドで引数付き実行できるプロンプトは、.github/prompts/ 配下の .prompt.md（Prompt Files）としてリポジトリ管理するのが公式の推奨です。 |
| q-d2-a11 | 補助問題 | 維持 | 変更差分に基づく下書きを生成し、作成者が内容の正確性を確認・補足してレビュアーへ渡す運用が公式に推奨される活用法です。 |
| q-d2-a12 | 補助問題 | 維持 | Copilotは単語単位（Ctrl/Cmd + Right Arrow）や行単位での部分受け入れをサポートしており、全体を確定させずに必要な部分だけを採用できます。 |
| q-d2-a13 | 補助問題 | 維持 | Alt/Option + ] (または [ ) を使用することで、生成済みの複数の補完候補をエディタ上でスムーズに切り替えて比較できます。 |
| q-d2-a14 | g-code-explanation | 維持 | コードに破壊的な変更を加えず、安全に対話や解説、設計検討を行うにはChatパネル（Ask）が最適です。 |
| q-d2-a17 | 補助問題 | 維持 | MCPにおいて、読み取り専用のコンテキスト情報はResourceとして提供し、外部への副作用を伴う実行操作はToolとして提供するのが標準仕様です。 |
| q-d2-a19 | 補助問題 | 修正 | AIに対するカスタム指示では、「共通ロガー」「標準API」といった抽象的な表現を避け、具体的な関数名やAPI名（appLogger.error）を明記することが最も効果的です。 |
| q-d2-a21 | 補助問題 | 維持 | 対象ファイルを明示参照または添付すると、現在の選択範囲だけでなく、そのファイルを参照対象にできます。実際に使われる内容は入力上限や機能の処理によるため、添付だけで全文の利用が保証されるわけではありません。 |
| q-d2-a22 | 補助問題 | 維持 | 現在のGitHub Copilot CLIは、端末内でコマンド案や説明を相談できます。旧GitHub CLI拡張のgh copilotとは別の製品です。提案したコマンドは実行前に確認します。 |
| q-d2-e03 | 補助問題 | 維持 | 必要時だけ呼び出す定型タスクの再利用とリポジトリでの共有に適する。 |
| q-d2-e04 | 補助問題 | 維持 | 共通の資料を集めた文脈の共有という目的に合う。 |
| q-d2-e05 | 補助問題 | 維持 | 選択箇所の直接編集と適用前の差分確認という操作要件に合う。 |
| q-d2-e12 | 補助問題 | 維持 | 必要時だけ呼び出す定型タスクの再利用とリポジトリでの共有に適する。 |
| q-d2-e13 | 補助問題 | 維持 | 端末で利用でき、構文の確認と実行判断を分けられる。 |
| q-d2-e17 | 補助問題 | 維持 | 選択箇所の直接編集と適用前の差分確認という操作要件に合う。 |
| q-d2-e18 | 補助問題 | 維持 | 複数ファイルの変更とツール実行・失敗への対応を同じ作業ループで進められる。 |
| q-d3-f01 | g-fill-in-the-middle | 維持 | カーソル前後のコードを手掛かりに中間部分を生成する。 |
| q-d3-f02 | g-context-priming | 維持 | 開いている関連タブの内容を補完の文脈として利用する説明に合う。 |
| q-d3-f03 | 補助問題 | 修正 | 生成の入力を渡す段階では、端末側で集めた文脈を含む要求が生成サービスへ送られる。外向きのHTTPS接続である。 |
| q-d3-f04 | 補助問題 | 修正 | 拒否されたCopilot接続先を公式一覧と照合し、外向き通信のルールを確認する。github.comが表示できても別の接続先が許可されているとは限らない。 |
| q-d3-f05 | g-tokenization | 維持 | 入力と出力の容量を管理する基本単位である。 |
| q-d3-a02 | 補助問題 | 維持 | Copilot Chatでは #file や #selection などのコンテキスト変数（チャット変数）を用いることで、必要なコード資産を確実に文脈として提供できます。 |
| q-d3-a04 | 補助問題 | 維持 | 使用可能なライブラリを具体的に制約し、未インストールの依存追加を禁止する明示的指示を与えることで、ハルシネーションを効果的に抑制できます。 |
| q-d3-e05 | 補助問題 | 修正 | 今回使うmodel.tsとrules.tsを残し、別案件のutils.tsとstate.tsを閉じる。関連ファイルを開き無関係なファイルを閉じる文脈整理の基本であり、提案精度や内部順位を保証する操作ではない。 |
| q-d4-f01 | g-prompt-anatomy | 修正 | 利用できる依存関係と出力形式は、守ってほしい制約にあたる。目的やコードを増やすだけではこの制約は伝わらない。 |
| q-d4-f02 | g-few-shot | 維持 | 少数の具体例を入力に含めて出力を誘導する。 |
| q-d4-f03 | 補助問題 | 維持 | 旧タスクの文脈を切り、現在の情報で始められる。 |
| q-d4-f04 | g-step-by-step | 維持 | 判断の段階を明示して説明を求める手法に当たる。 |
| q-d4-f05 | 補助問題 | 維持 | 会話の蓄積によって扱う前提がずれていく状況である。 |
| q-d4-a08 | 補助問題 | 維持 | 変更箇所が不明な初期調査では広範な探索（@workspace）が適し、対象ファイルが特定されている実装フェーズでは対象ファイルをピンポイントで明示参照（#file）するのが最も精度が高くなります。 |
| q-d4-e02 | 補助問題 | 維持 | 新しい課題に不要な履歴を減らし、現在の文脈を明示する。 |
| q-d5-f01 | g-doc-generation | 維持 | 選択コードのドキュメントコメントを生成する。 |
| q-d5-f02 | g-edge-case-discovery | 維持 | 未確認の境界・異常系と期待結果を直接指定できる。 |
| q-d5-f02-b | 補助問題 | 維持 | ステージ済み差分に基づくコミットメッセージ提案の操作である。 |
| q-d5-f04 | g-pr-summaries | 維持 | PRの変更内容から概要の下書きを生成する。 |
| q-d5-f05 | g-test-assertions-mocking | 修正 | 外部依存の置換と呼出し引数の検証の二役を満たす。 |
| q-d6-f01 | g-public-code-matching | 維持 | 公開コード一致の提案を許可・ブロックする設定である。 |
| q-d6-f02 | g-content-exclusion | 維持 | 指定したリポジトリやパスの内容を対応機能の文脈から除外する。 |
| q-d6-f03 | g-enterprise-data-privacy | 維持 | Business/Enterpriseの顧客データについて示された方針である。 |
| q-d6-f04 | g-audit-logs | 維持 | 管理操作のイベントと実行者・時刻の追跡に使う。 |
| q-d6-f05 | g-usage-metrics-api | 維持 | 利用指標の集計をAPIで取得する。 |
| q-d6-a02 | 補助問題 | 維持 | Suggestions matching public code の Block 設定は、公開コードと一致するコードスニペットの提案そのものをユーザーに提示させずブロックする機能です。 |
| q-d6-a04 | g-public-code-log | 維持 | Code Referencingは一致元の公開コードとライセンス情報（MIT、GPL等）を開発者に提示し、人間が法的な適合性や採用可否を適切に判断できるようにする機能です。 |
| q-d6-a05 | g-seat-management | 修正 | 特定個人の利用資格のみを解除するには、組織のCopilot管理画面で該当ユーザーの「シート割り当て（Seat）」を解除するのが直接の管理操作です。 |
| q-d6-a06 | g-policy-inheritance | 修正 | GitHubのガバナンス階層において、上位のEnterpriseレベルで強制（Enforced）されたポリシーは下位のOrganizationや個人設定によって緩和（オーバーライド）することはできません。 |
| q-d6-a07 | 補助問題 | 修正 | 学習利用の非対象を確認した後は、ログやプロンプトの「データ保持条件（Data Retention Policy）」および契約条項（DPA等）を確認するのが監査の正しいステップです。 |
| q-sc01-1 | g-repo-content-exclusion | 維持 | 対応するCopilot機能に対する入力文脈の除外である。非対応モードや手動入力には別の対策が必要。 |
| q-sc04-1 | 補助問題 | 維持 | 複数ファイルの変更とツール実行・失敗への対応を同じ作業ループで進められる。 |
| q-sc04-2 | 補助問題 | 維持 | レビュアー向けに今回の変更を要約する目的へ直接対応する。 |
| q-sc06-1 | 補助問題 | 維持 | 対応するChatでリポジトリの共通指示を自動的に提供できる。指示遵守自体の保証ではない。 |
| q-sc07-3 | 補助問題 | 修正 | 管理操作の実行者・時刻を監査イベントで追跡する。 |
| q-sc08-1 | 補助問題 | 維持 | 検索による関連情報の取得と、モデル重みの学習を区別している。 |
| q-sc08-3 | 補助問題 | 維持 | 既知の参照対象を直接渡す。システム指示など他の文脈が完全に排除される保証ではない。 |
| q-sc09-2 | 補助問題 | 修正 | 利用状況の集計を提供する。提供項目と期間を確認する。 |
| q-sc10-1 | 補助問題 | 維持 | 出力一致を抑えつつ社内の入力文脈を維持する二条件を満たす。 |
| q-sc10-2 | 補助問題 | 維持 | 今回通知されたスニペットの出所と条件の確認に直接対応する。 将来の抑制には有用だが採用済みスニペットの根拠を示さない。 |
| q-d1-g01 | g-generative-ai | 維持 | プロンプトや文脈を入力に、コードや文章など新しい内容を生成する技術が生成AIである。 |
| q-d1-g02 | g-responsible-ai | 維持 | AI出力の評価と検証を行い、最終責任を人が負う原則と実践がResponsible AIである。 |
| q-d1-g03 | g-transparency | 維持 | どの文脈を使い、なぜその出力になったかを理解・説明できる性質が透明性と説明可能性である。 |
| q-d1-g04 | g-nondeterminism | 維持 | LLMは確率的に次のトークンを選ぶため、同じ入力でも出力が変わり得る。この性質が非決定性である。 |
| q-d1-g05 | g-automation-bias | 維持 | AIの出力が洗練されているために批判的な確認を怠る傾向が、自動化バイアス（過度の依存）である。 |
| q-d1-g06 | g-critical-evaluation | 維持 | 要件への適合や副作用を自分で分析し、必要なら別の解を求める姿勢が提案の批判的評価である。 |
| q-d2-g01 | g-ghost-text | 維持 | エディタ内に薄い灰色文字で提案される未確定の補完表示がGhost Textである。 |
| q-d2-g02 | g-completions-panel | 維持 | 別タブを開き最大10個の補完候補を並べて確認・採用できる機能がCopilot Completions Panelである。 |
| q-d2-g03 | g-chat-participants | 維持 | `@` で指定し特定のドメインやツールに質問を割り振る仕組みがChat Participantsである。 |
| q-d2-g04 | g-status-menu | 修正 | ステータスバー上のCopilotアイコンから全体または言語単位の有効・無効を切り替えるのがステータスメニューである。 |
| q-d2-g05 | g-gh-copilot-explain | 修正 | 旧拡張でコマンド説明を依頼した名称。現行はcopilot CLIで質問する。 |
| q-d2-g06 | g-gh-copilot-suggest | 修正 | 旧suggestは候補生成用。現行のcopilotとは起動形式が異なる。 |
| q-d2-g07 | g-cli-shell-aliases | 修正 | 旧短縮名を現行の必須設定と混同しない。 |
| q-d2-g08 | g-cli-execution-confirm | 修正 | 保存済み許可や広い事前許可によって個別確認の扱いが変わる。 |
| q-d2-g09 | g-cli-context-limits | 修正 | 実際の参照元へのアクセス範囲を決める。 |
| q-d2-g10 | g-copilot-edits | 維持 | 作業対象ファイルを指定して複数ファイルへの変更を一括提案・プレビューできる専用UIがCopilot Editsである。 |
| q-d2-g11 | g-mcp-server | 維持 | ツールやリソースを定義してクライアントに機能を提供する側がMCP Serverである。 |
| q-d2-g12 | g-agent-sessions | 維持 | エージェントが実行したタスクやツール履歴、作業文脈を保持する単位がAgent Sessionである。 |
| q-d2-g13 | g-sub-agents | 維持 | 主セッションとは分離された独立コンテキストで下位タスクを実行し、結果を報告する下位エージェントがSub-Agentsである。 |
| q-d2-g14 | g-copilot-code-review | 維持 | PR差分に対してコードレビューコメントや改善提案を自動投稿する機能がCopilot Code Reviewである。 |
| q-d2-g15 | g-scoped-instructions | 維持 | 特定パスや対象スコープごとに個別の指示ファイル（`.github/instructions/*.md`など）を適用する構成がScoped Instructionsである。 |
| q-d2-g16 | g-spark | 維持 | アイデアから自然言語でマイクロアプリを生成するツールで、2026年8月に新規作成受付が終了したのがGitHub Sparkである。 |
| q-d2-g17 | g-copilot-extensions | 維持 | サードパーティ統合として提供され2025年11月に終了した旧機能がGitHub App型Copilot Extensionsである。 |
| q-d2-g18 | g-org-policies | 修正 | 組織内のメンバーへの機能管理という範囲。 |
| q-d2-g19 | g-enterprise-policies | 修正 | 傘下の組織へ強制するEnterpriseの範囲。 |
| q-d2-g20 | g-subscription-plans | 修正 | 利用条件、管理機能、プライバシー方針（学習利用の除外など）を定める契約区分がCopilot Subscription Plansである。 |
| q-d2-g21 | g-code-review-policies | 修正 | レビューの利用可否・自動動作を管理する。 |
| q-d2-g22 | g-legacy-knowledge-bases | 修正 | 2025-11-01終了。現在の共有コンテキストはSpaces。 |
| q-d3-g01 | g-data-flow | 維持 | IDEからプロキシ、LLM、後処理を経てエディタに戻る一連の通信・データ処理の流れをCopilot Data Flowと呼ぶ。 |
| q-d3-g02 | g-prompt-construction | 維持 | 周辺コードや開いているファイルを収集し、トークン枠に合わせて合成・整形する内部機構がPrompt Construction Pipelineである。 |
| q-d3-g03 | g-copilot-proxy | 修正 | サービス間の通信を中継するGitHub側の基盤。 |
| q-d3-g04 | g-telemetry-data | 修正 | 顧客のコード本体とは明確に分離され、製品稼働状況や受入率などを測定・改善するために収集されるメトリクスがTelemetry Dataである。 |
| q-d3-g05 | g-code-retention-policy | 修正 | 保持期間・条件はモデルや機能別に確認する。全機能の即時破棄とは断定しない。 |
| q-d3-g06 | g-post-processing | 維持 | LLMが出力した直後に介在し、公開コード一致検査や安全フィルタリングを適用して最終出力を決定する段階がPost-processingである。 |
| q-d3-g07 | g-transit-encryption | 修正 | 転送中の通信をTLS等で保護する。 |
| q-d3-g08 | g-suggestion-lifecycle | 維持 | 打鍵休止から提案生成、ゴーストテキスト表示、確定・破棄に至る一連のクライアント側状態遷移をSuggestion Lifecycleと呼ぶ。 |
| q-d3-g09 | g-context-window | 維持 | モデルが一度に処理できる最大トークン容量の枠組みであり、これを超えると古い文脈が溢れるのがContext Windowである。 |
| q-d3-g10 | g-latency-tradeoff | 修正 | 応答時間と推論品質の設計上の両立を扱う。 |
| q-d3-g11 | g-temperature-determinism | 修正 | 温度は候補選択の分布へ影響する。低くても無誤りや完全再現を保証しない。 |
| q-d3-g12 | g-knowledge-cutoff | 維持 | モデルの事前学習が終了した時点の境界日であり、それ以降の知識を持たない制約がKnowledge Cutoffである。 |
| q-d3-g13 | g-context-scope-limits | 修正 | 参照元へのアクセス範囲を表す。常にローカルだけとは限らない。 |
| q-d3-g14 | g-safety-filtering | 維持 | 出力内容そのものの有害性・倫理的リスク・攻撃性を検知してブロックするセーフガードがHarmful Output Filteringである。 |
| q-d4-g01 | g-prompt-engineering | 維持 | 目的、文脈、制約、具体例を体系的に整理し、LLMから最適な出力を引き出す指示設計技術がPrompt Engineeringである。 |
| q-d4-g02 | g-zero-shot | 維持 | 具体例（入出力ペア）を一切含めず、指示文と文脈のみでモデルにタスクを実行させる手法がZero-shot Promptingである。 |
| q-d4-g03 | g-system-prompt | 維持 | ユーザーの対話入力に先立ち、モデルの基本挙動や役割・ルールを規定する上位指示文がSystem Promptである。 |
| q-d4-g04 | g-role-prompting | 維持 | AIに専門家のペルソナや立場を指定し、より高度で専門的な観点から回答を引き出す手法がRole Promptingである。 |
| q-d4-g05 | g-iterative-refinement | 維持 | 初回の出力結果を踏まえ、追加の指示や制約を与えながら段階的にコードを完成させる手法がIterative Refinementである。 |
| q-d4-g06 | g-task-decomposition | 維持 | 大きなタスクを扱いやすい小単位のステップに分解して順次解決させる手法がTask Decompositionである。 |
| q-d4-g07 | g-context-pruning | 維持 | 無関係なファイルや過去ログを切り捨て、重要な指示への集中度と精度を高める手法がContext Pruningである。 |
| q-d4-g08 | g-negative-prompting | 維持 | やってはいけない禁止事項や制約を明示的に指定して不要な出力を抑止する手法がNegative Promptingである。 |
| q-d4-g09 | g-output-specification | 維持 | 出力の構文構造やデータフォーマットを明示的に制限し、後処理の手間を省く指示手法がOutput Format Specificationである。 |
| q-d5-g01 | g-code-generation | 維持 | 仕様コメントやシグネチャから、AIが新しい動作コードブロックや関数本体を合成・生成する機能がCode Generationである。 |
| q-d5-g02 | g-code-refactoring | 維持 | 外部仕様や振る舞いを維持したまま、コードの可読性や構造を改善する作業がCode Refactoringである。 |
| q-d5-g03 | g-legacy-modernization | 維持 | 旧式環境や非推奨APIのコードをテストで保証しつつ、現代的な構文や最新スタックへ移行する作業がLegacy Modernizationである。 |
| q-d5-g04 | g-code-translation | 維持 | ある言語で書かれたコードを別のプログラミング言語へ移植・翻訳する作業がCode Translationである。 |
| q-d5-g05 | g-algorithm-optimization | 維持 | 計算量やデータ構造を見直して処理速度やメモリ効率を向上させる手法がAlgorithm Optimizationである。 |
| q-d5-g06 | g-boilerplate-reduction | 維持 | 構文上不可欠だが定型的なコード記述を自動化し、本質的なロジックに集中させる効果がBoilerplate Reductionである。 |
| q-d5-g07 | g-integration-test-generation | 維持 | 複数コンポーネントや外部リソースとの連携が正常に機能するかを検証するテスト生成がIntegration Test Generationである。 |
| q-d5-g08 | g-vulnerability-remediation | 維持 | セキュリティ上の欠陥やリスクに対し、`/fix` 等を活用して安全なコードへ修正・治療するタスクがVulnerability Remediationである。 |
| q-d5-g09 | g-static-analysis-copilot | 維持 | 決定的な解析ツールでルール違反を検出し、その出力をCopilotに渡して修正コードを生成させる連携がStatic Analysis Integrationである。 |
| q-d5-g10 | g-perf-bottlenecks | 修正 | 時間・負荷・資源の観測から遅延原因を特定する。 |
| q-d5-g11 | g-secret-leak-prevention | 維持 | 認証トークンやパスワードのハードコードを禁止し、環境変数やSecret Scanningで漏洩を防ぐ原則がSecret Leak Preventionである。 |
| q-d5-g12 | g-test-explorer | 維持 | エディタ内のテストを自動発見し、GUIから実行・デバッグ・結果確認を一元管理する機能がTest Explorerである。 |
| q-d5-g13 | g-arrange-act-assert | 修正 | 準備・対象操作・期待値確認というテスト内の構造。 |
| q-d5-g14 | g-code-quality-attributes | 修正 | 信頼性・保守性・安全性・性能・可読性などソフトウェアの非機能的価値を規定する指標群がCode Quality Attributesである。 |
| q-d5-g15 | g-reliability | 維持 | 規定の条件下で機能が障害なく継続的に正しく動作し続ける品質属性がReliability（信頼性）である。 |
| q-d5-g16 | g-safe-exception-handling | 維持 | 例外の握り潰しや機密スタックトレース漏洩を避け、具象例外を適切に捕捉して安全に対処する実装がSafe Exception Handlingである。 |
| q-d5-g17 | g-input-validation | 維持 | 関数やAPIの入口で引数やリクエストデータの妥当性を検証し、不正入力を未然に弾く実装がInput Validationである。 |
| q-d5-g18 | g-project-documentation | 維持 | システムの目的、要件、アーキテクチャ、手順などを全体視点で包括的にまとめた文書がProject Documentationである。 |
| q-d6-g01 | g-org-content-exclusion | 修正 | 複数リポジトリへの組織単位の除外設定。 |
| q-d6-g02 | g-exclusion-syntax | 修正 | **は下位の複数階層を含む指定に使う。 |
| q-d6-g03 | g-output-ownership | 修正 | 生成物についての所有権・権利関係を扱う。第三者の権利や利用条件は別途確認する。 |
| q-d6-g04 | g-exclusion-propagation | 維持 | サーバー上のContent Exclusion設定が世界中の各IDEクライアントへ伝播・同期されるまでに生じる最大30分程度の遅れがPropagation Delayである。 |
| q-d6-g05 | g-compliance-auditability | 修正 | 監査ログの記録やポリシー適用履歴を追跡・提出し、組織の規則遵守を証明できる体制がCompliance and Auditabilityである。 |
| q-fnd-cli-install-20261017 | 補助問題 | 維持 | 現行Copilot CLIのnpmパッケージは@github/copilotです。npmでの導入にはNode.js 22以降が必要です。導入後はcopilotで起動します。 |
| q-fnd-cli-login-20261017 | 補助問題 | 維持 | /loginを入力し、画面の案内に従ってGitHubアカウントで認証します。CLIの導入やフォルダーの信頼確認とは別の手順です。 |
| q-fnd-cli-create-file-20261017 | 補助問題 | 維持 | Copilot CLIはコマンドの説明だけでなく、スクリプトの生成やファイル操作も支援します。作成・保存を依頼し、必要なファイル変更の許可を確認します。保存後の内容確認と実行は別の段階です。 |
| q-fnd-seat-api-20261017 | 補助問題 | 維持 | Copilotの購読管理REST APIには、対象ユーザーへのシート追加等の操作があります。利用統計の取得とは異なり、利用資格の割り当てを管理します。実際の実行には組織の条件と書込権限の確認が必要です。 |
| q-fnd-cloud-issue-20261017 | 補助問題 | 維持 | IssueをCopilotへ割り当てるとcloud agentが実装を進め、Pull Requestを作成します。開発者は生成された変更をレビューします。IDE内のAgentや既存差分へのAIレビューとは別の利用形態です。 |
| q-fnd-plan-20261017 | 補助問題 | 維持 | Planは、関連コードの調査や要件の確認を通じて実装案をまとめ、確認後に実装へ引き継ぐための専用ワークフローです。 |
| q-fnd-nes-20261017 | 補助問題 | 維持 | NESは直前の編集に基づき、次に編集する場所と変更内容を予測します。現在の入力位置へ続きを示すghost textとは異なります。 |
| q-fnd-ide-matrix-20261017 | 補助問題 | 維持 | Feature MatrixはIDEやそのバージョンごとのCopilot機能対応を比較する公式資料です。補完が使えることからChatやAgentの対応まで推測せず、対象環境を確認します。 |
| q-fnd-ide-signin-20261017 | 補助問題 | 維持 | Copilotはサインインしているアカウントの利用資格を使います。仕事用のシートを使うには、その資格を持つアカウントでCopilotへサインインします。 |
| q-fnd-mobile-file-20261017 | 補助問題 | 維持 | GitHub Mobileでは対象ファイルを開き、ファイル画面のCopilotアイコンからその内容について質問できます。ファイル全体を手動で貼り付ける必要はありません。利用可否は組織のポリシー等も確認します。 |

各選択肢の誤りの理由とレビュー根拠は同名JSONに記載しています。

## 再検査

`npm run glossary:coverage:strict`、`node scripts/audit-foundation-glossary.mjs`、`npm run quality:check` で対応、レビュー指紋、選択肢根拠を検査します。基礎問題も品質ゲートの対象へ追加しました。同期スクリプトは既存のレビュー済み問題を保持し、新規生成はneeds-reviewのまま登録します。

## 公式情報の確認

- [旧gh-copilot終了告知](https://github.blog/changelog/2025-09-25-upcoming-deprecation-of-gh-copilot-cli-extension/)と[現行CLI](https://docs.github.com/en/copilot/get-started/cli-quickstart)を分けて確認。旧コマンドは歴史問題として明示。
- [ツール許可](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)と[モデルホスティング](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)から、実行承認・保持条件の無条件断定を修正。
