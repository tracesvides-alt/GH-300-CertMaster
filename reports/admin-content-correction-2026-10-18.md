# 管理教材の訂正結果

実施日：2026-10-18（日本時間）

[承認された計画](admin-content-correction-plan-2026-10-18.md)の第1段階として、利用資格・管理権限・API・ポリシー・監査に関する説明を訂正した。Lesson 3件、Glossary 11件、Comparison 2件を変更し、関連する基礎4問の条件と解説も明確にした。

通常出題は253問（基礎162・応用48・高難度43）のまま。D1=24、D2=98、D3=33、D4=35、D5=32、D6=31。設問の増減、正解・選択肢の変更、難易度・ドメインの付け替えは行っていない。

## 主な訂正

| 分野 | 変更前の懸念 | 訂正した内容 |
|---|---|---|
| 利用資格 | 組織のシートがなければIDE等でも利用不可と一般化 | 組織からの資格、個人Free等の資格、GitHubへの認証、機能許可を区別 |
| 管理権限 | 「管理者」でまとめ、契約プランとロールが区別しにくい | Organization owner・Enterprise owner・Repository admin等を対象操作に対応させる。Maintainはrepo除外の閲覧のみ |
| シート・購読API | 古いusage例と統計・割り当ての説明が混在 | billing・billing/seats・selected_usersと、利用レポートの役割を分離。HTTPメソッド・返却内容・認証方式別の権限を説明 |
| 利用レポート | APIが集計値を直接返し、個人の活動情報はないように読める | download_linksからレポートを取得する流れ、組織集計と利用者別の粒度を説明 |
| ポリシー | 全設定にEnterprise→Org→Repoの一律の継承を適用 | 対象機能の企業側での決定と組織への委任を区別。提供元・使用面・機能固有の例外を確認 |
| 自動レビュー | 機能ポリシーだけで全PRの自動起動も設定できる | レビューの利用許可、ruleset・個人設定による起動、対象repo・ブランチを分離 |
| Content Exclusion | 組織所有repoの全利用者へ一律適用するように読める | 資格の提供元、repoの対象範囲、企業全体の対象を区別。継承除外の解除とrepo独自の追加も分離 |
| 監査 | 古いイベント名の例や、監査を管理変更だけに限定する表現 | 確認した現行イベント名へ訂正。Enterpriseの閲覧ロール、ストリーミングの範囲、チーム付与時のactorの注意を追加 |

レビュー教材をそろえる際に、「最終承認は常に人間だけ」と読める記載も、現行のCopilot承認のPublic previewと人の必須要件を区別する説明へ整えた。追加日の注記を保ち、8月7日以前の機能として扱っていない。

## 変更した教材

- Lesson：lesson-d2-org-governance、lesson-d2-pr-code-review、lesson-d6-content-exclusion-setup。
- Glossary：g-seat-management、g-usage-metrics-api、g-org-policies、g-enterprise-policies、g-policy-inheritance、g-code-review-policies、g-audit-logs、g-repo-content-exclusion、g-org-content-exclusion、g-copilot-code-review、g-content-exclusion。
- Comparison：cmp-org-vs-enterprise-policies、cmp-review-vs-summary。

g-policy-inheritanceは「Copilot Policy Enforcement and Delegation（強制と委任）」へ表示名を変更した。IDと関連リンクは維持し、旧名を検索用の別名へ残した。

g-subscription-plansは個人プランの存在を既に説明しており、今回の訂正と整合するため維持した。CLIのコマンド表や、プラン・ロール別の総合比較表の拡張は含めていない。

## 関連問題の確認

関連用語のリンクと、利用資格・ポリシー・監査等を扱う本文から現行36問を抽出し、今回の訂正との整合性を確認した。4問を明確化し、残り32問は維持した。全問の難易度や選択肢品質を再評価したという意味ではない。

| 問題ID | 明確にした条件 | 維持した正解ID |
|---|---|---|
| q-d6-a05 | Organization ownerによるユーザー単位の直接割り当ての解除。チーム経由の資格はない | A |
| q-d2-g18 | 組織から資格を得る利用者への設定で、企業側から対象機能の判断が委任されている | D |
| q-d2-g21 | レビュー機能の利用可否を尋ね、自動起動条件は別に設定する | C |
| q-d6-g01 | 組織がシートを提供する利用者への、通常補完の組織レベルの除外 | B |

四択は維持し、本文で機能・対象者・操作を判断する基礎問題として確認した。各問の短い正誤理由と詳細な正解解説も、同じ条件に対応させた。

修正前後、出典、変更対象外の指紋、36問の判断一覧は[変更台帳](admin-content-correction-2026-10-18.json)に保存した。

## 検証結果

| 確認 | 結果 |
|---|---|
| 単体テスト | 29ファイル・271件成功。対象外の教材保持、件数・正解の維持、旧版と新版の解説、検索を含む |
| TypeScript | npm run check成功 |
| 詳細解説の既存整合性確認 | npm run explanations:check成功。今回の4問の紐付けは上記単体テストでも確認 |
| 公式出典の接続・タイトル等 | GitHub公式80件、失敗0・警告0 |
| 本番ビルド | Next.js build --webpack成功。Playwright起動時に実施 |
| 今回のブラウザー検証 | PC・スマートフォン幅の4ケース成功。16教材の検索・表示・出典リンク、関連用語と教材の往復、基礎4問の正解・詳細解説・保存を確認 |
| 前工程の回帰確認 | 公式整合性の8ケース成功。前工程の10問と、F01旧版履歴・模試再開・解き直しの保護を確認 |
| 差分 | git diff --check成功 |

利用経路は「教材検索→固定教材データの読込→詳細表示・公式出典」と「演習開始→ローカル採点→IndexedDB保存→回答履歴」。これらに採点APIや外部DBはない。

スマートフォン幅では、長いAPIパスが折り返されず本文をはみ出す問題を検出した。教材のセクション本文にoverflow-wrapを追加し、再実行で16教材すべてに横方向のはみ出しがないことを確認した。PC側ではテストが似た名前の用語を選んでいたため、完全一致で検索結果を選ぶ手順へ訂正した。テスト条件を緩和せず再検証している。

以下の画面画像で、APIパスの折り返しも目視確認した。

- [スマートフォン幅](../artifacts/admin-content-api-mobile.png)
- [PC幅](../artifacts/admin-content-api-desktop.png)

## 履歴・対象外の保存

元の問題seed、2026-10-17の詳細解説集、前工程の公式整合性改訂台帳は維持した。今回の4問は別の改訂台帳に保存し、修正前の設問への完全一致で現在版へ適用する。保存済み模試の旧版に、新しい詳細解説を混ぜない。正解は変わらず、過去の記録を再採点する処理も追加していない。

変更対象外のLesson・Glossary・Comparison・既存Sourceは、着手時のレコード指紋と比較した。前工程の未コミット変更は維持している。

## 残る範囲と公式根拠

CLIへのContent Exclusion適用には公式ページ間の説明差があるため、全機能共通の保証として説明していない。今回の訂正は現行資料を基準とし、すべての仕様が8月7日時点と同一であることや、実試験の出題頻度を証明するものではない。

- [Copilotのプラン](https://docs.github.com/en/copilot/get-started/plans)
- [Copilot user management REST API](https://docs.github.com/en/rest/copilot/copilot-user-management)
- [Copilot usage metrics REST API](https://docs.github.com/en/rest/copilot/copilot-usage-metrics)
- [企業・組織のポリシー](https://docs.github.com/en/copilot/concepts/enterprise/policies)
- [Copilot code reviewの設定](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)
- [Content Exclusionの設定](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [Copilot監査ログ](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/review-audit-logs)
- [組織の監査イベント一覧](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/audit-log-events-for-your-organization)
- [Enterpriseの監査ログストリーミング](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise)

出典のURL接続確認と、記載内容を読んだ意味の確認は別に行った。文字列・指紋・自動テストの成功だけで教材の正確さを認定していない。
