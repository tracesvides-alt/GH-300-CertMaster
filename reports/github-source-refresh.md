# GitHub Official Sources Full Refresh

監査日: 2026-10-12。基準: Microsoft Learn GH-300 Study Guide「Skills measured as of August 7, 2026」。

## Summary

| 指標 | 件数 |
| --- | ---: |
| Total GitHub Sources（更新後） | 30 |
| Current（最終URLで200） | 30 |
| Updated（既存IDのURL変更） | 18 |
| Added（新規ID） | 4 |
| Redirected（更新後 / 更新前） | 0 / 9 |
| Deprecated（GitHub Spark） | 1 |
| Needs Review（Source） | 2 |
| Broken（更新後） | 0 |

全リポジトリを検索し、sources.jsonのほかREADME.mdのGitHub Docs直リンク2件、過去の移行スクリプト内の直リンク、教材内のgithub.com形式の例を確認した。READMEの2リンクは200かつ転送なし。教材の github.com/my-org/my-repo は実在ページへの出典リンクではなく記法例である。初回のGitHub出典25件の機械検査では404が5件、転送が9件。さらにVS CodeのAgent Mode出典に古いURLと消失した #_agent-mode アンカーがあった。

## Study Guideとの対応

- プラン: [GitHub Copilot plans](https://docs.github.com/en/copilot/get-started/plans) を plans として追加し、feature-matrix とともにプラン用語へ関連付けた。Study Guideの旧リンクは現行URLへ転送された。
- プロンプト: Study Guideが案内する旧Prompt Engineering URLは prompt の現行Conceptへ転送される。保存URLはすでに現行だった。
- コンテンツ除外: Study Guideの旧リンクは現行How-toへ転送される。設定手順の exclusion と適用範囲の exclusion-concept を分けて維持した。
- データとプライバシー: Study GuideはGitHub Trust Centerへ案内する。privacy を企業導入資料案内へ移し、モデルホスティングと学習利用の個別出典を追加した。Trust Centerトップは汎用入口であり、特定の保持条件の唯一の根拠にはしなかった。

## Updated Sources

| Source ID | Old URL | New URL | Reason |
| --- | --- | --- | --- |
| chat | https://docs.github.com/copilot/responsible-use/chat-in-github | https://docs.github.com/en/copilot/responsible-use/chat | 旧パスから責任ある利用の現行ページへ |
| cli | https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-the-cli | https://docs.github.com/en/copilot/get-started/cli-quickstart | 旧 gh copilot 拡張から現行CLIの導入手順へ |
| agent-mode | https://code.visualstudio.com/docs/copilot/copilot-chat#_agent-mode | https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode | VS Code旧パスと消失アンカーからGitHub DocsのAgent mode手順へ |
| mcp | https://docs.github.com/en/copilot/reference/customization-cheat-sheet | https://docs.github.com/en/copilot/concepts/context/mcp | MCPの概念ページへ分離 |
| instructions | https://docs.github.com/en/copilot/reference/customization-cheat-sheet | https://docs.github.com/en/copilot/concepts/prompting/response-customization | カスタム指示の概念ページへ分離 |
| prompt-files | https://docs.github.com/en/copilot/reference/customization-cheat-sheet | https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide | プロンプトファイル作成手順を含む現行How-toへ分離 |
| spaces | https://docs.github.com/en/copilot/how-tos/provide-context/use-copilot-spaces/use-copilot-spaces | https://docs.github.com/en/copilot/concepts/context/spaces | Spacesの概念ページへ |
| spark | https://github.blog/news-insights/product-news/introducing-github-spark/ | https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/ | 旧製品紹介の404から公式廃止告知へ |
| code-review | https://docs.github.com/en/copilot/using-github-copilot/code-review-with-copilot | https://docs.github.com/en/copilot/concepts/agents/code-review | 旧404からCode Reviewの概念ページへ |
| policies | https://docs.github.com/en/copilot/managing-copilot/managing-policies-for-copilot-in-your-organization | https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies | 旧404から組織ポリシーの現行How-toへ |
| audit-log | https://docs.github.com/en/copilot/managing-copilot/reviewing-audit-logs-for-copilot | https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization | 旧404から組織監査ログの現行ページへ |
| privacy | https://docs.github.com/en/enterprise-cloud%40latest/copilot/reference/ai-models/model-hosting | https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/govern-at-scale/resources-for-approval | モデルホスティング単独のページから企業導入のプライバシー資料案内へ |
| architecture | https://docs.github.com/en/copilot/about-github-copilot/how-github-copilot-works | https://docs.github.com/en/copilot/get-started/about-github-copilot | 旧404からCopilot全体像の現行ページへ。詳細な経路は再確認対象 |
| inline-usage | https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions | https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/get-ide-code-suggestions | IDE補完How-toの移転先へ |
| exclusion-concept | https://docs.github.com/en/copilot/concepts/context/content-exclusion | https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion | Content Exclusion概念ページの移転先へ |
| public-code | https://docs.github.com/en/copilot/concepts/completions/code-referencing | https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code | 旧URLが別主題へ転送。公開コード一致の専用How-toへ |
| secret-scanning | https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection | https://docs.github.com/en/code-security/concepts/secret-security/push-protection | Push Protection概念ページの移転先へ |
| codeql | https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql | https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning | CodeQLコードスキャン概念ページの移転先へ |

## Added Sources

| Source ID | URL | 用途 |
| --- | --- | --- |
| plans | https://docs.github.com/en/copilot/get-started/plans | Plans for GitHub Copilot |
| feature-matrix | https://docs.github.com/en/copilot/reference/copilot-feature-matrix | Copilot feature matrix |
| model-hosting | https://docs.github.com/en/copilot/reference/ai-models/model-hosting | Hosting of models for GitHub Copilot |
| privacy-training | https://docs.github.com/en/copilot/how-tos/manage-your-account/manage-policies | Managing GitHub Copilot policies as an individual subscriber |

## Content Impact

Source Registryの relatedLessonIds / relatedGlossaryIds / relatedQuestionIds / relatedComparisonIds に全参照IDを保存した。下表は各変更Sourceへの直接参照数で、同一教材が複数Sourceに現れる。

| Source | Lessons | Glossary | Questions | Comparisons |
| --- | ---: | ---: | ---: | ---: |
| chat | 6 | 18 | 14 | 5 |
| cli | 2 | 7 | 1 | 0 |
| agent-mode | 2 | 5 | 21 | 3 |
| mcp | 1 | 4 | 9 | 1 |
| instructions | 1 | 4 | 20 | 1 |
| prompt-files | 1 | 1 | 20 | 1 |
| spaces | 0 | 1 | 14 | 1 |
| spark | 0 | 1 | 0 | 0 |
| code-review | 2 | 4 | 10 | 1 |
| policies | 4 | 14 | 12 | 2 |
| audit-log | 1 | 1 | 4 | 0 |
| privacy | 4 | 15 | 7 | 1 |
| architecture | 2 | 18 | 6 | 0 |
| inline-usage | 0 | 0 | 3 | 0 |
| exclusion-concept | 1 | 1 | 11 | 0 |
| public-code | 1 | 1 | 7 | 0 |
| secret-scanning | 0 | 0 | 6 | 0 |
| codeql | 0 | 0 | 2 | 0 |
| plans | 0 | 1 | 0 | 0 |
| feature-matrix | 0 | 1 | 0 | 0 |
| model-hosting | 3 | 4 | 0 | 0 |
| privacy-training | 2 | 2 | 0 | 0 |

### 内容変更への対応

- **GitHub Spark:** 公式告知は2026年8月4日以降の新規利用・新規作成停止、既存アプリの継続動作を明記。g-sparkの定義・試験ポイントを更新した。直接依存する問題は0件。
- **CLI:** 現行CLIは copilot コマンドと対話型セッションが中心。lesson-d2-cli と g-copilot-cli を更新し、旧 gh copilot explain/suggest/ghcs/ghce は歴史的用語と明示した。旧拡張を正解欄に含む q-d2-f11 は needs-review。
- **Content Exclusion:** 設定How-toとConceptを照合。Copilot CLIとIDE Chat Agent modeの非対応を明記し、Cloud agentまで一括して非対応とする文を修正した。q11の説明も修正。
- **Public Code Matching:** 「提案が150文字以上なら検出」は誤り。公式説明は候補とその周辺約150文字の照合。lesson-d6-public-code-matching、g-public-code-matching、q-d6-f01 を更新し、Blockは完全なライセンス保証ではないと明示。
- **データ利用:** Business/Enterprise顧客データのモデル学習不使用と、機能・モデル別の保持条件を区別。lesson-d3-retention-privacy と関連用語を更新した。単一モデルホストを前提とする lesson-d3-data-flow も改訂。
- **プラン:** Free/Student/Pro/Pro+/Max/Business/Enterpriseの現行体系と機能マトリクスに合わせ、g-subscription-plansの断定的な旧機能説明を修正。

## Needs Review

- Source privacy: 企業向け資料への入口だが、権利・保持・認証を1ページで根拠づけることはできない。追加した privacy-training / model-hosting とともに各機能の契約条件を確認する必要がある。
- Source architecture: 現行のCopilot全体像へ移行したが、旧教材の詳細なプロキシ構成・FIM/Neighboring Tabsまでは裏付けられない。
- Lesson lesson-d6-ownership-privacy: 権利帰属と知財補償、コンプライアンス保証の細部は契約文書との照合待ち。
- Glossary g-gh-copilot-explain, g-gh-copilot-suggest, g-cli-shell-aliases: 旧拡張の歴史的用語。試験での扱いは人間確認待ち。
- Glossary g-data-flow, g-copilot-proxy, g-code-retention-policy, g-enterprise-data-privacy: モデル/製品面ごとの技術経路・保持条件を再確認する。
- Questions q-d2-f11, q-d3-f01, q-d3-f02: 旧CLI名または現行資料で裏付けできない実装固有の前提がある。正解は自動変更せず needs-review とし、演習選択から除外した。

## Verification

- scripts/check-official-sources.mjs はHTTP、転送、最終URL、HTML title、canonical（存在時）、publisherドメイン、重複URL、fragment、主題を検査する。404/410、DNS/ネットワーク失敗、外部転送、別主題のtitle/canonicalは失敗。一時的な5xx/timeoutと転送は警告。
- GitHub Docsの多くのHTMLは rel=canonical を出さない。この場合は「最終200 URL」をcanonical候補として記録し、canonicalEvidence=final-200-url として区別する。HTML canonicalを直接確認したという意味ではない。
- 週次の .github/workflows/github-official-source-check.yml は監査JSONをartifactに残す。教材は自動更新しない。
- 2026-10-12の最終ネットワーク検査: GitHub公式出典30件、404/410=0、転送=0、重複=0。登録URLのfragment=0。READMEの2件も200/転送なし。
- ローカル検査: TypeScript、Vitest（142件）、問題品質監査、Next.js本番ビルド、およびKnowledge Baseの参照整合性を実行した。PracticeのデスクトップE2E 6件も通過し、演習開始・復習導線・模試開始を確認した。

## Limits

HTTPとtitle照合では、ページ本文の将来の変更を完全に判定できない。意味的な出典と正解の検証が残る対象は上記の needs-review に明示した。GitHub Docsのページ構成・機能提供状況は引き続き定期監査する。
