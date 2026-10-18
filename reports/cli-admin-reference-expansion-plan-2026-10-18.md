# 第2段階：CLI・プラン・管理権限の参照教材拡充計画

計画日：2026-10-18（日本時間）

[第1段階の訂正結果](admin-content-correction-2026-10-18.md)を前提に、「目的に合うコマンドはどれか」「その操作を誰が、どの契約・範囲で行えるか」を教材で学べるようにする。これは次の作業計画であり、教材への実装記録ではない。

## 到達目標と範囲

- CLI：シェルでの起動コマンド、対話中のスラッシュコマンド、起動オプションを区別し、短い利用場面から操作を選べる。
- 管理：Copilotのプラン、GitHubのアカウント・契約、管理ロール、対象機能の許可を区別し、操作できる範囲を説明できる。
- 各項目に既存問題との対応を付け、「教材に記載済み」と「演習で確認できる」を別々に管理する。

通常出題253問（基礎162・応用48・高難度43）とドメイン配分を維持する。今回の実装対象は教材・参照表・関連リンク。問題追加、基礎問題の置き換え、高難度の増問は含めない。既存のMini Reviewは教材内の復習として更新し、問題バンクへ自動的に追加しない。

## 1. CLI教材を目的別に組み直す

対象：lesson-d2-cli、既存のCLI関連用語、公式出典と関連問題リンク。

1. 導入・起動・認証。
2. ヘルプ・モデル選択・会話の操作。
3. 対話実行と非対話実行。
4. 新しい作業とセッションの再開。
5. ツールを利用可能にする設定と、実行を許可する設定。
6. 文脈量の確認と、履歴を減らす操作の違い。

参照表は「目的／入力するコマンド・指定／入力する場所／使う条件・注意」の4列を基本とする。利用例を短い自然な日本語で添え、コマンド名の羅列だけにしない。

| 区分 | 主に扱う候補 | 覚える判断 |
|---|---|---|
| 導入・起動 | npm install -g @github/copilot、copilot | CLIの導入と起動は別。利用環境の前提も確認する |
| 認証・ヘルプ | copilot login、/login、copilot help、/help | シェルで入力するものと、CLI対話中に入力するものの違い |
| モデル選択 | /model | ログインやセッション再開の操作と区別する |
| プロンプト実行 | -p、-i、--silent | 回答後に終了するか、対話を継続するか、標準出力に何を含めるか |
| 再開 | /resume、--resume、--resume=SESSION-ID、--continue | 選択画面、特定の作業、直近の作業を区別する。TTYがない場合の条件も説明する |
| 文脈の管理 | /context、/compact、/clear | 使用量を確認すること、会話を圧縮すること、会話を消すことを区別する |
| 実行許可 | --allow-tool、--deny-tool、/permissions | 許可・拒否や確認の扱いを説明する。広い権限の付与を一律に推奨しない |
| 利用可能なツール | --available-tools、--excluded-tools | モデルへ提示する候補と、提示されたツールの実行許可を区別する |

候補の構文・意味・対応版は実装時に公式リファレンスで再確認する。Autopilot、MCP、追加ディレクトリ等は、既存問題の解説に必要な補足へ位置付け、基本操作の表を巨大にしない。

旧gh copilot explain/suggestやghcs/ghceは、旧拡張であることを短い注記で明示する。現行コマンドの一覧へ混在させない。一般のGit・シェルコマンド、GitHub CLIのgh、現行のcopilotも区別する。

## 2. プランと管理ロールを別の表で整理する

対象：lesson-d2-org-governance、g-subscription-plans、必要な関連用語、cmp-org-vs-enterprise-policiesからの参照。

「プランを選べば、その利用者が管理者になる」という誤解を防ぐため、一枚の巨大な三次元表にまとめない。以下の二つを隣接する教材として示す。

### A. プラン別の管理の前提

列は「Copilotプラン／主な契約・管理主体／組織のシート・ポリシー管理／別途必要な前提」。

- 個人向けのFree・Student・Pro・Pro+・Maxは、共通の管理主体と、今回の学習目的に必要な差分を説明する。
- BusinessとEnterpriseは、それぞれの管理条件を確認する。GitHub Enterprise Cloudとの契約上の関係もCopilotのプラン名と分ける。
- CLIの提供、Content Exclusion、組織ポリシー、監査・利用レポート等の条件を、根拠を確認できた範囲で示す。
- 価格、全モデル一覧、全上限値の暗記表にはしない。確認日と公式出典を付け、現行仕様を8月7日当日の固定仕様とは表示しない。

### B. 操作別の権限・範囲

列は「したい操作／主なロール・必要権限／対象範囲／追加条件・できないこと」。可否を○×だけで示さず、条件付きの理由を一文で示す。

| 操作 | 特に区別するもの |
|---|---|
| 組織へのCopilot提供・プラン管理 | Enterprise ownerとOrganization owner、企業管理下かどうか |
| ユーザー・チームのシート付与や解除 | 資格の変更と機能ポリシー、直接割り当てとチーム経由、解除予約と資格喪失の時点 |
| 機能・モデルの利用許可 | 企業側の決定と組織への委任、資格の提供元 |
| Content Exclusionの変更 | Repository adminとMaintain、組織Seat対象と企業全体・repo対象、追加と解除 |
| 自動レビューの起動設定 | 機能の利用許可とruleset管理権限、対象repo・ブランチ、個人設定 |
| 利用状況レポートの閲覧 | Organization/Enterprise ownerと、該当する閲覧権限を委任された利用者 |
| Enterprise監査ログの閲覧・ストリーミング | 閲覧ロールと、ストリームを設定する権限・契約条件 |

Billing managerやカスタムロールは、公式に確認できる具体的な操作へ対応させる。「請求情報を読めるからシートやポリシーも変更できる」とは推測しない。APIを使う場合は、アカウントのロールとトークン・GitHub App等の権限も別に説明する。

## 3. 表をアプリで読める形にする

現在のLesson本文は、headingとcontentを段落として表示しており、Markdownの表を書き足すだけでは表にならない。

- Lessonへ任意の構造化参照表を持たせ、既存の本文のみの教材もそのまま表示できるようにする。
- 意味のある見出し・行・列として表示し、キーボード操作や支援技術でも列の意味が分かる形にする。
- PCでは見比べられる表、スマートフォンではラベル付きの行カード等を使い、長いコマンドや条件を読めるようにする。
- コマンド表と管理操作表は別の見出しで示し、目次・検索・関連教材・公式出典から辿れるようにする。
- 新しい表の中の用語・コマンドも検索対象へ含める。表示名を変える場合は既存IDと旧名の検索性を維持する。
- 列を増やしすぎず、条件の説明を省略して難解な日本語にしない。未確認のセルは完成扱いにせず、根拠を確定してから公開する。

実装の確認対象はlib/knowledge.ts、lib/content.ts、教材の表示・検索部分と関連CSS。必要な範囲だけ拡張し、演習や学習履歴の保存方式を変更しない。

## 4. 既存問題と対応付け、次段階へ渡す

| 学習内容 | 現在の対応例 | 教材拡充後に確認すること |
|---|---|---|
| CLI導入・認証 | q-fnd-cli-install-20261017、q-fnd-cli-login-20261017 | 教材から操作と入力場所を学べるか |
| 非対話・出力 | q-sc03-1-feature-20261016 | -p・-i・--silentの違いを説明してから演習へ進めるか |
| セッション再開 | q-sc07-1-feature-20261016 | 選択画面、特定ID、直近の違いが教材にあるか |
| ツール候補と権限 | q-d2-a25-ms-20261017、q-d2-e06-ms-20261017 | コマンドの基本を学んでから応用条件を判断できるか |
| 管理の主体と適用先 | q-d2-g18、q-d6-g01、q-d1-e04-feature-20261016 | 直前に訂正した条件と表の説明がそろうか |
| 資格・活動・監査 | q-fnd-seat-api-20261017、q-d6-a09-ms-20261017、q-sc07-3 | データを取得する目的と必要権限を区別できるか |

対応台帳では「教材で説明済み／正解として選ぶ問題がある／誤答選択肢にしか出ない／未出題」を分ける。例えば/modelが選択肢に登場するだけでは、その用途を問う問題を用意した扱いにしない。

この段階では問題を変更せず、次の第3段階へ既存基礎問題の置き換え候補を渡す。対象ID・残す概念・新たに確認する知識・重複の有無を整理し、増問やドメイン変更を避ける。高難度の新規追加は行わない。

## 作業順と完了条件

1. 現行の教材・改訂問題・関連リンクを着手時の基準として記録する。第1段階の修正台帳を過去の記録として保存する。
2. CLI表の内容を先に確定し、目的別の説明・短い使用例・既存問題への対応を整える。
3. プラン表と操作別権限表を確定する。セルごとに裏付けを記録し、閲覧と変更、一般条件と例外を分ける。
4. 参照表のデータ形式・表示・検索を実装し、既存教材にも影響がないことを確認する。
5. PC・スマートフォンで、検索→表の閲覧→公式出典・関連教材→既存の確認問題を操作する。長いコマンドの表示も確認する。
6. 型・データ・検索・既存演習の関連テストを実施し、問題数・配分・履歴が維持されていることを確認する。

完了時には、表の本文と使用例、出典・確認日の台帳、演習との対応表、第3段階の置き換え候補、画面確認結果を日本語で報告する。実試験に出たコマンドや全出題内容を再現したと断定しない。

## 優先する公式資料

- [GH-300 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- [Copilotのプラン](https://docs.github.com/en/copilot/get-started/plans)
- [組織のCopilot管理](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization)
- [企業・組織のポリシー](https://docs.github.com/en/copilot/concepts/enterprise/policies)
- [Copilot user management API](https://docs.github.com/en/rest/copilot/copilot-user-management)
- [Copilot usage metrics API](https://docs.github.com/en/rest/copilot/copilot-usage-metrics)
- [Content Exclusionの設定](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)
- [Copilot code reviewの設定](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)
- [Copilot監査ログ](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/review-audit-logs)

各コマンドの細かな構文、プラン固有の制限、カスタムロールや課金ロールの操作範囲は、実装時に該当する公式節まで確認する。前段階から残るCLIの除外適用の説明差は、未解消のまま検証済みへ変更しない。
