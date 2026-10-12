# GH-300公式演習 Coverage Gap 改善結果

2026-10-12。対象は添付 `GH300問題.xlsx` の50問と、アプリのactive syllabus `2026-08-07`（6 Domain / 14 Objective）です。問題の旧仕様に教材を合わせず、[Microsoft Learn GH-300 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)と現行GitHub公式情報を優先しました。

## Before（初回監査）

| COVERED | PARTIAL | MISSING | UNCERTAIN |
| ---: | ---: | ---: | ---: |
| 30 | 10 | 6 | 4 |

## Practice Issues

| 問題 | 分類 | 現行資料による判断 | 対応 |
| --- | --- | --- | --- |
| Q1 | PRACTICE_OUTDATED | [Copilot plans](https://docs.github.com/en/copilot/get-started/plans)にCopilot Freeがある。 | Freeを現行プランとして維持。旧解答を教材へ転記しない。 |
| Q3 | PRACTICE_INCORRECT | [repository indexing](https://docs.github.com/en/copilot/concepts/context/repository-indexing)は索引とモデル訓練を分ける。 | 組織コードによる再訓練と教えず、権限ある索引・Spacesを説明。 |
| Q6 | PRACTICE_OUTDATED | [GitHub Changelog](https://github.blog/changelog/2025-08-20-sunset-notice-copilot-knowledge-bases/)はKnowledge Basesを2025-11-01に終了しSpacesへ置換した。 | [Copilot Spaces](https://docs.github.com/en/copilot/concepts/context/spaces)を現行の共有コンテキストとして維持。旧語は歴史注記のみ。 |
| Q14 | NEEDS_REVIEW | [Network settings](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/network-settings)はHTTPプロキシとカスタム証明書を説明するが、添付のBusiness専用条件は確認できない。 | プラン・クライアント・証明書条件を追加確認するまで断定しない。 |
| Q43 | NEEDS_REVIEW | 添付解説が入力検証とテストのassertionを混同しやすい。 | 教材では実装とテストを分け、設問意図を確認する。 |

Q6は**UNCERTAINではなくPRACTICE_OUTDATED**です。旧Knowledge Basesを現行機能として扱わず、Knowledge Bases vs Spacesの新規比較教材も作っていません。

## Content Added / Expanded

- **New Lessons: 0。** 既存の11 Lessonを深め、Lessonの乱立を避けました。
- **Expanded Lessons:** インライン補完、Chat、組織ガバナンス、データフロー、プロンプト構築、Zero/Few-shot、コード改善、品質検証、テスト、セキュリティ修正、公開コード一致。
- **New Glossary: 10。** FIM、Test Explorer、AAA、品質属性、Reliability、安全な例外処理、入力検証、プロジェクト文書、有害性フィルター、retired Knowledge Bases。最後の項目は歴史注記であり、現行の主要TermはSpacesです。
- **New Comparison: 4。** テスト生成 vs Test Explorer、Reliability vs Performance vs Maintainability、入力検証 vs テストAssertion、有害性 vs 公開コード一致 vs Content Exclusion。
- **New Official Sources: 8。** FIMのGitHub Blog、VS Code Testing、Knowledge Bases sunset Changelog、GitHub repository indexing、GitHub network settings、Microsoft LearnのAAA・例外処理・機密情報に関する資料。
- **Verified Questions added: 0。** 既存問題の関連リンクを再利用し、問題数を水増ししていません。

教材では定義に加え、使用場面、具体例、誤解しやすい選択肢、試験での判断点を記載しました。Source IDはLesson/Glossary/Comparisonからたどれます。

## After（現行知識のみ）

| CURRENT_PRACTICE | COVERED | PARTIAL | MISSING | 完全対応率 |
| ---: | ---: | ---: | ---: | ---: |
| 45 | 45 | 0 | 0 | 100% |

別集計: PRACTICE_OUTDATED 2問、PRACTICE_INCORRECT 1問、NEEDS_REVIEW 2問。編集上の平均スコアは現行45問で 91.3/100。

この対応率は**教材から設問の判断根拠を学べるか**という編集評価です。試験の正答率や、各新概念のVerified Question数を意味しません。

## 50問の再評価

| 問題 | 初回 | Practice分類 | 改善後Coverage | 主な教材への対応 |
| --- | --- | --- | --- | --- |
| Q01 | UNCERTAIN | PRACTICE_OUTDATED | PRACTICE_OUTDATED | `lesson-d2-org-governance`, `g-subscription-plans` |
| Q02 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d2-inline-suggestions`, `g-inline-suggestions` |
| Q03 | UNCERTAIN | PRACTICE_INCORRECT | PRACTICE_INCORRECT | `lesson-d2-org-governance`, `lesson-d2-chat-essentials`, `g-subscription-plans`, `g-spaces`, `cmp-spaces-vs-chat` |
| Q04 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d2-org-governance`, `g-org-policies`, `g-seat-management`, `cmp-org-vs-enterprise-policies` |
| Q05 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-pr-code-review`, `g-pr-summaries`, `g-copilot-code-review`, `cmp-review-vs-summary` |
| Q06 | UNCERTAIN | PRACTICE_OUTDATED | PRACTICE_OUTDATED | `lesson-d2-chat-essentials`, `g-spaces`, `cmp-spaces-vs-chat` |
| Q07 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d5-generation-refactoring`, `g-code-refactoring`, `g-copilot-chat`, `cmp-agent-vs-chat` |
| Q08 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-chat-essentials`, `g-chat-participants`, `g-slash-commands`, `g-chat-variables` |
| Q09 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-chat-essentials`, `g-code-explanation`, `g-copilot-chat`, `cmp-chat-vs-inline` |
| Q10 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-chat-essentials`, `lesson-d5-security-remediation`, `g-copilot-chat`, `g-slash-commands` |
| Q11 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-inline-suggestions`, `g-inline-suggestions`, `g-context-gathering`, `cmp-chat-vs-inline` |
| Q12 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-chat-essentials`, `g-slash-commands`, `g-inline-chat` |
| Q13 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d2-chat-essentials`, `g-inline-chat`, `g-slash-commands`, `cmp-chat-vs-inline` |
| Q14 | UNCERTAIN | NEEDS_REVIEW | NEEDS_REVIEW | `lesson-d3-data-flow`, `g-copilot-proxy`, `g-transit-encryption` |
| Q15 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-inline-suggestions`, `g-inline-suggestions`, `g-ghost-text` |
| Q16 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-inline-suggestions`, `g-generative-ai`, `g-inline-suggestions`, `cmp-chat-vs-inline` |
| Q17 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-inline-suggestions`, `lesson-d3-prompt-pipeline`, `g-context-gathering`, `g-inline-suggestions` |
| Q18 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d2-chat-essentials`, `g-spaces`, `g-context-scope-limits`, `cmp-spaces-vs-chat` |
| Q19 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d3-prompt-pipeline`, `g-generative-ai`, `g-prompt-construction` |
| Q20 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d4-zero-few-shot`, `g-zero-shot`, `g-few-shot`, `cmp-zero-vs-few-shot` |
| Q21 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d3-prompt-pipeline`, `lesson-d3-data-flow`, `g-prompt-construction`, `g-post-processing`, `g-safety-filtering`, `cmp-safety-filter-types` |
| Q22 | MISSING | CURRENT_PRACTICE | COVERED | `lesson-d3-prompt-pipeline`, `g-context-gathering`, `g-inline-suggestions`, `g-fill-in-the-middle` |
| Q23 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-inline-suggestions`, `lesson-d3-data-flow`, `g-post-processing`, `g-suggestion-lifecycle` |
| Q24 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-inline-suggestions`, `g-completions-panel`, `g-inline-suggestions` |
| Q25 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d1-validation`, `lesson-d1-principles`, `g-verification-validation`, `g-critical-evaluation` |
| Q26 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d4-crafting`, `g-prompt-engineering`, `g-prompt-anatomy` |
| Q27 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d4-crafting`, `g-prompt-engineering`, `g-prompt-anatomy` |
| Q28 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d3-prompt-pipeline`, `g-generative-ai`, `g-tokenization` |
| Q29 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d4-crafting`, `g-prompt-anatomy`, `g-context-priming` |
| Q30 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d4-decomposition-pruning`, `lesson-d4-refinement`, `g-task-decomposition`, `g-context-pruning` |
| Q31 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d4-crafting`, `lesson-d3-prompt-pipeline`, `g-context-priming`, `g-context-gathering` |
| Q32 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-chat-essentials`, `lesson-d4-crafting`, `g-chat-participants`, `g-slash-commands`, `g-chat-variables` |
| Q33 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d4-crafting`, `lesson-d4-decomposition-pruning`, `g-prompt-anatomy`, `g-context-pruning` |
| Q34 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d5-generation-refactoring`, `g-code-refactoring` |
| Q35 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d5-generation-refactoring`, `g-doc-generation`, `g-project-documentation` |
| Q36 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d5-generation-refactoring`, `g-doc-generation` |
| Q37 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d5-legacy-modernization`, `g-code-translation`, `g-legacy-modernization` |
| Q38 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d5-testing`, `g-unit-test-generation`, `g-edge-case-discovery`, `g-test-assertions-mocking`, `cmp-unit-vs-integration-tests` |
| Q39 | MISSING | CURRENT_PRACTICE | COVERED | `lesson-d5-testing`, `g-unit-test-generation`, `g-test-explorer`, `cmp-test-generation-vs-explorer` |
| Q40 | MISSING | CURRENT_PRACTICE | COVERED | `lesson-d5-testing`, `g-test-assertions-mocking`, `g-arrange-act-assert` |
| Q41 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d5-testing`, `g-unit-test-generation`, `g-edge-case-discovery` |
| Q42 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d5-testing`, `g-unit-test-generation`, `g-verification-validation` |
| Q43 | PARTIAL | NEEDS_REVIEW | NEEDS_REVIEW | `lesson-d5-testing`, `g-test-assertions-mocking`, `g-edge-case-discovery`, `g-input-validation`, `cmp-input-validation-vs-assertion` |
| Q44 | MISSING | CURRENT_PRACTICE | COVERED | `lesson-d5-generation-refactoring`, `lesson-d1-validation`, `g-critical-evaluation`, `g-code-correctness`, `g-code-quality-attributes`, `cmp-quality-attributes` |
| Q45 | MISSING | CURRENT_PRACTICE | COVERED | `lesson-d1-validation`, `lesson-d5-generation-refactoring`, `g-code-correctness`, `g-reliability`, `cmp-quality-attributes` |
| Q46 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d1-validation`, `lesson-d5-security-remediation`, `g-critical-evaluation`, `g-static-analysis-copilot`, `g-reliability`, `cmp-quality-attributes` |
| Q47 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d2-inline-suggestions`, `lesson-d5-generation-refactoring`, `g-context-gathering`, `g-code-refactoring` |
| Q48 | MISSING | CURRENT_PRACTICE | COVERED | `lesson-d5-security-remediation`, `lesson-d1-validation`, `g-code-correctness`, `g-security-vulnerability-scan`, `g-safe-exception-handling` |
| Q49 | COVERED | CURRENT_PRACTICE | COVERED | `lesson-d3-prompt-pipeline`, `lesson-d3-data-flow`, `g-post-processing`, `g-knowledge-cutoff`, `g-safety-filtering`, `cmp-safety-filter-types` |
| Q50 | PARTIAL | CURRENT_PRACTICE | COVERED | `lesson-d3-prompt-pipeline`, `lesson-d6-public-code-matching`, `lesson-d3-data-flow`, `g-post-processing`, `g-public-code-matching`, `g-safety-filtering`, `cmp-exclusion-vs-publicmatch`, `cmp-safety-filter-types` |

## Cross-link と検証

- 追加したGlossaryはLessonとSource、比較が必要なものはComparisonへ接続しました。Comparison側もTermとLessonへ逆リンクしています。新しい出典8件も対象教材から参照できます。
- `npm run content:audit` は6 Domain / 14 ObjectiveのLesson・Glossary対応、公式Source参照、broken reference 0を確認します。
- `npm run practice:coverage` は50問、分類、ID参照と現行知識の45/45件を再計算します。
- Lesson末尾の「理解度チェック3問」は対象Lessonで3問取得できることをテストしました。ただし下記の新概念については既存Question Bankの直接出題が不足します。
- 検証結果: 全157件のユニットテスト、TypeScript、問題品質チェック、本番ビルドが通過。独立したテスト用サーバーで復習・教材・3問チェックのブラウザー2シナリオも正常終了しました。

## Verified Question Gap（追加候補）

| 概念 | 既存Bankの直接出題 | 次段階の小規模追加候補 |
| --- | ---: | --- |
| FIM | 3問（前後文脈を問う既存問題） | 現状維持。後続コードとの単位整合を問う問題は任意。 |
| VS Code Test Explorer | 0問 | Copilotによる生成とTest Explorerでの発見・デバッグを区別する1問。 |
| Arrange–Act–Assert | 0問 | 生成テストの三段階と誤った期待値を見つける1問。 |
| Reliability vs Performance | 0問（直接の定義比較） | 高速だが異常系で故障する案を評価する1問。 |
| 安全な例外処理 | 0問（具体的捕捉・ログ・再送出の組合せ） | 機密の非開示と例外の握り潰しを比較する1問。 |
| 3種類のフィルター | 0問（3者を同時比較） | 出力有害性、公開コード一致、参照元除外の目的を選ぶ1問。 |

## Remaining Review

- Q14のBusiness専用という旧解答は、GitHub Docsのプラン・クライアント別記述を追加調査するまで採用しません。
- Q43の設問意図と解説は、人による原本確認が必要です。教材ではInput ValidationとTest Assertionを明確に分けました。
- Q4の旧UIの画面位置は変わり得るため、現行教材はプラン→seat→policy→enablementという概念と公式管理資料の参照を優先します。
- 直接問題がない新概念の5候補は、この段階では大量生成せず、次のQuestion品質レビューで必要性を判断してください。
