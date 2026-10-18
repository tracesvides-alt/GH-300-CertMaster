# 管理教材の断定表現・API例の訂正計画

計画日：2026-10-18（日本時間）

## 目的と今回の範囲

管理教材を読んだことで、利用資格、操作できる人、設定の適用先、APIの役割を誤って覚えてしまう箇所を訂正する。前回提案の「1. 管理教材の断定表現と古いAPI例を訂正する」に対応する計画であり、まだ教材・設問を変更した実施記録ではない。

主対象はLesson・Glossary・Comparison。CLIのコマンド表、プラン・ロール別の総合比較表、新規問題・既存問題の置き換えは後続段階とする。ただし、訂正対象と関連する既存問題が矛盾する場合は見逃さず、IDと必要な訂正を記録する。

通常出題253問（基礎162・応用48・高難度43）の問題数・ドメイン・難易度を変える計画ではない。前工程で修正済みの10問と、作業ツリー内にある未コミット変更を着手時の現状として保存・尊重する。

## 優先順位と修正内容

| 順序 | 対象 | 現状の問題 | 修正方針 |
|---|---|---|---|
| 1 | 組織管理Lesson、g-seat-management | 「シートを持つユーザーのみIDE認証可能」「シートを持たないユーザーは利用不可」と一般化している | 組織から提供されるBusiness/Enterpriseの利用資格として範囲を限定する。個人Free等の利用資格、GitHubへの認証、組織の機能許可を分ける |
| 2 | 組織管理Lesson、g-usage-metrics-api | GET /orgs/{org}/copilot/usageを現行の利用統計取得例としている | 現行の用途に合うAPI例へ訂正する。購読・シート管理と利用統計を区別し、メソッド・パス・返却内容をそろえる |
| 3 | 組織管理Lesson、組織・企業・シートの用語 | 「管理者」という呼び方が広すぎる | 操作を説明する箇所でOrganization owner、Enterprise owner、Repository admin等の必要なロールと対象範囲を明記する。委任・カスタムロール・API権限の有無を確認せず「ownerだけが常に可能」と一般化しない |
| 4 | 組織管理Lesson、g-org-policies、g-enterprise-policies、g-policy-inheritance、比較教材 | すべての設定がEnterprise→Org→Repoという同じ階層を持つように読める | 該当するポリシーで上位が強制した場合と、下位へ委任した場合を説明する。全機能が同じ設定値や継承方式を持つとは教えない |
| 5 | PRレビューLesson、g-code-review-policies | Settings > Copilot > Policiesで自動レビューのトリガーまで一括設定できると説明している | 機能の利用許可と、自動起動を設定するruleset・個人設定を分ける。設定権限と対象範囲をそれぞれ明記する |
| 6 | Content ExclusionのLessonと用語 | 組織設定を全リポジトリ・全利用者へ一律適用できるように読める箇所や、組織設定があるとrepo設定を追加できないように読める箇所がある | 組織がシートを付与した利用者への適用と、repo単位の適用を分ける。上位の除外を解除できないことと、repo固有の除外を追加できることを区別する。対応プラン・機能・参照経路を確認する |
| 7 | 組織管理Lesson、g-usage-metrics-api、g-audit-logs | APIと監査ログを一括して「集計データのみ」と説明している | 割り当て情報、利用統計・利用者別レポート、監査イベントを区別する。「個別の活動情報がない」と「プロンプト全文を取得するものではない」を混同しない |
| 8 | g-audit-logs等の具体例 | イベント名、ストリーミング可否、利用条件を現行資料と照合する必要がある | 現行のイベント一覧・必要なロール・契約条件を照合する。確認できた名称だけを例示し、全プラン共通の機能とは断定しない |

1・2・5は現状の具体的な訂正候補。3・4・6・7は断定の範囲を見直す対象。8は追加確認の対象であり、すべての記載を誤りと確定したものではない。

## API例の訂正設計

APIの名称を置き換えるだけでなく、「何のために使い、何が返るか」まで合わせる。実装時に公式資料で再確認し、プレビュー表記や必要な権限も記録する。

| 学ぶ目的 | 使用候補 | 説明する内容 |
|---|---|---|
| 組織の購読・シート内訳・機能ポリシーを確認する | GET /orgs/{org}/copilot/billing | 購読や設定の確認。設定の取得から、同じAPIで機能ポリシーを書き換えられるとは推測しない |
| 現在のシート割り当てを確認する | GET /orgs/{org}/copilot/billing/seats | 誰に割り当てられているか。活動情報の収集条件と利用資格を混同しない |
| 選択した利用者へのシート付与・解除を管理する | POST / DELETE /orgs/{org}/copilot/billing/selected_users | 対象ユーザー、必要権限、チーム経由の付与・解除時点等の条件。全文をLessonへ詰め込まず、詳細は公式出典へ誘導する |
| 組織の利用状況レポートを取得する | GET /orgs/{org}/copilot/metrics/reports/organization-1-day?day=YYYY-MM-DD | 返却されるダウンロードリンクから対象レポートを取得する。最初の応答を、そのまま採用率などの集計値と説明しない |

基本説明では「シートの割り当て一覧」「利用状況」「誰が設定を変えたか」の違いを先に示し、必要な箇所だけに具体的なパスを添える。読みやすさを保ち、HTTPメソッドや権限の用語を省略して意味を曖昧にしない。

## 直接確認する資産

相対パスはリポジトリ直下を基準とする。

- content/gh300/2026-08-07/lessons/seed.json
  - lesson-d2-org-governance：利用資格、ロール、継承、API、監査ログ、Mini Review、要点・誤解の項目。
  - lesson-d2-pr-code-review：利用許可と自動起動の設定。
  - lesson-d6-content-exclusion-setup：組織設定とrepo設定の範囲。
- content/gh300/2026-08-07/glossary/terms.json
  - g-seat-management、g-usage-metrics-api、g-org-policies、g-enterprise-policies、g-policy-inheritance、g-code-review-policies、g-audit-logs、g-repo-content-exclusion、g-org-content-exclusion。
  - g-subscription-plansは個人利用資格との整合を確認する。総合的なプラン比較の拡張は後続段階。
- content/gh300/2026-08-07/comparisons/guides.json
  - cmp-org-vs-enterprise-policies：適用範囲と優先順位の断定をLessonにそろえる。
- content/gh300/2026-08-07/sources.json
  - 修正内容を直接支える出典・対応ID・確認日を整える。確認日だけを一括更新しない。

これらは確認対象の一覧であり、全項目を必ず書き換える意味ではない。内容が成立している項目は維持する。

## 作業手順と成果物

1. 対象資産の修正前データと通常出題件数を記録する。前工程の未コミット変更とは今回の差分を区別する。
2. 対象文ごとに、現状、問題点、公式根拠、修正案を台帳に保存する。事実誤りと、条件の不足を分ける。
3. シート・APIの説明を先に訂正する。続いてロール、継承、自動レビュー、除外、監査・活動データの順に整える。
4. 同じ概念を扱うGlossary・Comparison・Mini Review・要点の説明もそろえる。
5. 関連する現行の設問と解説を確認する。例：q-d6-a05、q-d2-g18〜g21、q-fnd-seat-api-20261017、q-d6-a09-ms-20261017、q-d3-a13-ms-20261017、q-d1-e04-feature-20261016、q-d6-e04-feature-20261016-ms-20261017。関連IDはこれらに限定せず抽出し、直接矛盾だけを記録・判定する。
6. 教材表示、検索、内部リンク、出典、データ整合性を確認し、変更前後と未解消点を日本語で報告する。

実施時の成果物は、訂正した教材一式、変更前後と出典の台帳、関連問題への影響一覧、検証結果とする。問題の正解訂正まで必要と分かった場合は根拠を明記し、通常出題数を増減させず最小の訂正として扱う。新しい出題テーマへの置き換えや高難度の増問は混ぜない。

## 完了条件

- 組織のシートを持たないことから、個人Free等も利用できないと誤解させない。認証・利用資格・機能許可が区別される。
- 購読プラン名、Enterpriseアカウント、管理ロールを同じ概念として説明しない。
- 現行のAPI例で、HTTPメソッド・パス・取得目的・返却内容・必要権限が対応する。古いusage例を現行推奨として残さない。
- ポリシーの許可とruleset等による自動レビュー起動を分ける。
- Content Exclusionは、誰の利用へ適用する設定か、どのrepoを対象にする設定かが分かる。
- 管理データの種類を区別し、利用者別の活動情報まで一律に取得不可と説明しない。
- Lesson、用語集、比較、関連する現行問題の間で訂正内容が矛盾しない。
- 通常出題件数・難易度・ドメイン配分と過去の回答履歴を維持する。
- 型チェック、関連するデータ・教材のテストを通す。意味を確認するレビューは、文字列一致テストの成功だけで代用しない。
- PC・スマートフォン幅で訂正したLesson・Glossary・Comparisonの表示を確認する。

## 公式根拠

2026-10-18に現行ページを確認。資料の現行仕様を8月7日当日の固定仕様として説明しない。実施時にも使用する節を再確認する。

- [組織のCopilot管理](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization)
- [EnterpriseのCopilot管理](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise)
- [組織のポリシー管理](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)
- [Enterpriseのポリシー管理](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)
- [Copilot user management REST API](https://docs.github.com/en/rest/copilot/copilot-user-management)
- [Copilot usage metrics REST API](https://docs.github.com/en/rest/copilot/copilot-usage-metrics)
- [Copilotのプラン](https://docs.github.com/en/copilot/get-started/plans)
- [Copilot code reviewの設定](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)
- [Content Exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

監査イベント名や除外の詳細手順など、この計画で確認対象に挙げた項目は、実施時に上記ページから該当の公式参照先まで確認して確定する。未確認の項目を検証済みの修正文として公開しない。
