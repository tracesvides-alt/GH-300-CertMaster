# Copilot機能に限定した121問の変更計画

作成日：2026-10-15。**計画のみ。問題本文・出題データ・学習履歴はまだ変更していない。121件は変更テーマ案の件数であり、121問の原稿・重複・難易度が合格したという意味ではない。**

## 変更方針

対象は前回の機能限定レビューで対象外候補となった応用72問・本番相当49問。既存の121枠を一対一で全面改稿する。業務シナリオをそのまま残してCopilotという語を足す改稿は行わない。正答は、Copilotの機能選択、実行操作、設定、適用範囲、機能の限界についての判断にする。

対象コードに何を実装するか、どんなテストデータを作るか、どの期待値が正しいかを答えさせる問題は再採用しない。MCPサーバーの実装や一般的なTLSの知識だけで決まる問題も同じ扱いにする。Copilotを利用していても、単なる開発一般の問題なら不採用。

画像のq-d1-a15は「日本語・アラビア語の氏名を追加」という正解を廃止し、対象関数を明示してCopilotのテスト生成を起動する操作へ変更する。ただしGenerate Testsの名称を知っているだけの基礎問題にはせず、対象範囲・既存テスト・起動機能の条件を使う。新問の主分類はD5またはD2を検討し、旧D1のまま自動確定しない。

## 問題数とドメイン

有効問題数の目標は基礎163・応用90・本番相当57、計310問。新規の出題枠は増やさず、削除済み6問・既存の対象外12問は復帰させない。維持候補25問は比較対象であり、品質合格済みという扱いではない。q-d6-e07の機能前提の是正1問は121問とは別管理とする。

| 旧登録Domain | 置換する応用 | 置換する本番相当 | 合計 |
| --- | ---: | ---: | ---: |
| D1：責任あるAIの利用 | 24 | 11 | 35 |
| D2：Copilotの機能を使いこなす | 5 | 9 | 14 |
| D3：データとアーキテクチャ | 5 | 5 | 10 |
| D4：プロンプトとコンテキスト | 16 | 8 | 24 |
| D5：開発生産性を高める | 17 | 13 | 30 |
| D6：プライバシーと保護 | 5 | 3 | 8 |

**上表は旧問題の所在であり、新問の確定分類ではない。** 機能操作を問うだけで全問D2にすることも、元の比率を守るためにD1へ置くことも避ける。責任ある運用が主ならD1、機能操作そのものならD2、Copilotの入力・文脈・フィルタの経路ならD3、文脈構築と再利用ならD4、Copilotを使った開発作業の進め方ならD5、除外や公開一致の保護境界ならD6として、主たる判断根拠で分類する。

D1の35枠、D4の24枠、D5の30枠には特に分類移動・重複のリスクがある。今回の機能限定条件の下では、元と同じドメイン比率を保証できない。最初に全121案の分類仮置きと、全310問・応用90問・本番相当57問の比率の前後差分を作る。その後、同じ学習目標の範囲で未出の機能判断へ差替え、無理な分類や同じ問題の水増しで数を合わせない。出題在庫比率と模試の抽選ウェイトは別々に報告する。

## 応用と本番相当の作り分け

| 観点 | 応用72問 | 本番相当49問 |
| --- | --- | --- |
| 判断 | 観測された状態→機能・操作を選ぶ2段階 | 2種類以上の機能・適用条件→実効状態→操作の3段階 |
| 条件 | 主たる制約1件＋補助条件 | 対応モード・設定範囲・実行状態など独立した制約2件以上 |
| 誤答 | 実在する近接機能や別の適用範囲 | 一部条件なら正しいが全条件を満たさない操作 |
| 難しさ | 用語名の暗記だけにしない | 長文・一般テスト知識・複雑な日本語で難しくしない |

本番相当は「実験対照比較／インシデント切り分け／複合制約トレードオフ」のうち、機能判断に適切な形式を選ぶ。全問を同じ設定表の読み取り問題にしない。文字数を満たすための情報は追加しない。

## 実施順と各段階の成果物

1. **分類・仕様・重複の事前確認。** 下記121案に主DomainとObjectiveを仮置きし、現行Study Guideと対象クライアントの公式Docsを突き合わせる。25維持候補と基礎163問も比較し、同じ判断を繰り返す案は原稿作成前に差し替える。
2. **6問で書き方を確定。** q-d1-a15、q-d2-e11、q-d3-a19、q-d4-e04、q-d5-a12、q-d6-e03を先行。旧登録Domainごとに1問、応用3・本番相当3で、対象機能・操作・制約が答えを決める構成を検証する。分類を確定するサンプルでもある。ここで通らないパターンは残りへ展開しない。
3. **残りの応用69問。** 23／23／23問の3単位で原稿とレビューを完結させる。各単位で既存問・同時作成問・前の単位と比較する。後から本番相当に流用するためだけの浅い問題は作らない。
4. **残りの本番相当46問。** 16／15／15問の3単位で作成する。応用で使った機能も、主たる判断が同じで条件を増やしただけなら重複として差し替える。
5. **全147問の横断再レビュー。** 121新問＋維持候補25問＋別管理の前提修正1問について、機能適合・重複・段階差・正答の一意性を点検。25問を無条件PASSとして逃がさない。
6. **履歴保護と資産反映。** 下記の版管理を実装・検証してから採用原稿を有効化。分類比率、問題数、出題対象、実際の演習開始・解答・採点・復習を確認する。

先行6問＋残り応用69問＋残り本番相当46問＝121問。各案は仕様確認・重複照合で差替え可能とし、121という数に達するためだけの類題は採用しない。十分に独立した題材が見つからない場合は、その不足枠と理由を明示し、品質未達のまま完了扱いにしない。

## 各問の採用条件

- **機能限定**：正答を導く根拠に実在するCopilotの機能・設定・対応範囲が必要。一般の開発知識だけで解けるなら不採用。
- **ブラインドチェック**：問題文を隠して四択だけを読み、常識・善悪・具体性・長さ・製品名の有無で正答が目立たないことを人手で確認する。自動的な合格ラベルは付けない。
- **正答と誤答**：すべて実在する機能・操作を同じ粒度で記述。誤答3件は、それぞれ有効になる別条件と、今回満たさない条件を記録する。架空機能や危険行為を並べない。
- **推論と反実仮想**：応用は2段階、本番相当は分析・照合・結論の3段階を実際に書き出す。本番相当は条件を一つ変えると正解が別選択肢になることを具体的に検証する。
- **根拠**：正答・誤答の判定を支える公式ページの該当節、確認日、クライアント、モード、プラン、preview条件を記録。単に公式URLが付いているだけでは合格にしない。
- **日本語**：誰が・どのクライアントで・何をしたいかを明示。圧縮した名詞列、複雑な否定、不要な業務ルールを避ける。
- **文字長・位置**：正答長／全選択肢長の中央値を記録し、1.5倍超・0.67倍未満は再点検対象にする。長さを揃えるだけで合格にしない。四択単一正答なら応用72問は各位置18問、本番相当49問は12～13問を配分目安とし、表示時シャッフルと保存時位置を区別する。
- **重複**：機能名だけでなく「症状・判断する境界・必要操作」の組で比較する。同じ操作を別業種へ置き換えた問題は重複。難度を変えたから別問題とはしない。

## 優先して統合・差替え判定する案

| 近接する案 | 区別して残せる条件 |
| --- | --- |
| q-d1-a15 / q-d5-a06 / q-d5-a15 | 起動対象・既存テストの文脈・生成先という違いが実際に別の機能判断を要求する場合だけ残す |
| q10 / q-d5-a10 | 起動操作の違いだけなら統合対象。テスト選択の粒度だけで水増ししない |
| q-d2-e02 / q-d5-e06 | 単一トリガーの診断と複合起動条件に独立した判断がなければ差替え |
| q-d4-e04 / q-d4-e07 / q-d5-e07 | tool有効化・mode対応・実行承認の違いを根拠付きで分離できる場合だけ残す |
| q-d1-e03 / q-sc04-3 / q-d1-a03 | 外部副作用の限界・部分取消・部分採用が同じ差分操作の問題なら統合対象 |
| q-d4-a05 / q-d4-e09 / q-d3-e06 | 会話分離・文脈量・参照元診断が同じ「新規会話」一択にならないこと |
| q-d1-a02 / q-d2-a04 / q-d1-e02 / q-d6-a13 | 表示経路・資料参照との区別・記録対象・検索対象の境界を問う独立性を確認 |
| D6の新8案 / 維持候補の除外問題群 | パス・端末・repo名だけ変わった除外問題は採用しない |

この表は重複解消済みの証明ではなく、原稿作成前の優先審査リスト。独立性が弱い案は削除して別テーマへ差し替える。

## 学習履歴・問題版の移行

現状はattempts等がquestionId中心に紐づき、内容を全面変更して同じIDを使うと旧問題の正答が新問の習熟と誤認される。そのため、ID維持の場合はcontentRevisionを導入し、問題と解答記録を版で結び付ける。候補JSONのfingerprintは移行元の版を識別する証跡として使う。

- 旧解答は旧版の履歴として保持し、新版の習熟・弱点・適応出題・誤答復習へ混在させない。版情報のない既存記録は移行時点の旧版へ結び付ける。
- 進行中セッションは保存済み問題スナップショットと旧版の正答で採点し、新版へ途中で差し替えない。
- wrongAnswers、questionReviews、confusionPairs等も版を照合。改稿された問題の旧復習状態を新版に自動継承しない。
- bookmarkは関心の記録として扱うが、旧問題を保存したことが分かる表示・新版への明示導線を用意する。旧記録を黙って新内容へ置き換えない。
- 基礎や改稿対象外の履歴は維持。テストでは旧正答の不正継承がないこと、旧セッションの採点結果が変わらないことを確認する。既存の版を保存する方法もここで具体化する。

実装上の対象はlib/learning.ts、lib/db.ts、lib/question-classification.ts、lib/selection.tsと、それらを使う集計・復習処理。計画段階では未編集。版管理が過大になる場合は新IDと旧版アーカイブによる移行を比較するが、いずれも有効問題数を増やす目的には使わない。

## 仕様確認で古い前提を再導入しない

Knowledge Basesは旧機能として扱い、現行の共有文脈はSpaces。Q6のPRACTICE_OUTDATED方針は維持する。Sparkなど現行性の確認が必要な題材や、試験範囲と関係の薄いSDK実装で不足枠を埋めない。

Code reviewの承認は「常に必須承認へ数えない」と断定しない。現行DocsにはCopilot approvalsのpublic previewがあるため、該当案ではその有効・無効を明記する。除外もクライアント・モードに依存するため、CLIで機能する前提を再使用しない。

## 121枠の変更案

以下の分類はすべて旧登録Domain。テーマは変更案であり、下書き前に仕様と分類を確定する。選択肢欄は「誤答候補となる近接機能」であり、正答や不正答を確定した四択ではない。JSONには元問題の指紋、対象難度、比較する維持候補ID、参照先を記録した。

### 旧D1：責任あるAIの利用

| ID / 難度 | 新テーマと判断させる内容 | 四択を構成する近接機能 | 仕様確認先 |
| --- | --- | --- | --- |
| q01 / 応用 | **ローカルAgentの承認範囲**：ファイル編集は許可し、外部コマンドの実行は都度確認したい。Copilotの承認設定で分離する操作を問う | 編集承認 / ターミナル承認 / 全許可 / Chat指示 | [approval](https://code.visualstudio.com/docs/agents/run/approvals) |
| q-d1-a01 / 応用 | **クラウドAgentの実行確認**：PRは作成されたがActionsが未実行。既定の承認待ち表示から、利用者が行うCopilot PRの操作を選ぶ | Approve and run / 再割当 / MCP許可 / IDE承認 | [risk](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations) |
| q-d1-a02 / 応用 | **コード参照の表示経路**：IDEのインライン提案を採用した後、公開コードとの一致元を確認したい。該当クライアントの参照表示を選ぶ | コード参照ログ / Used references / PR summary / Agent実行ログ | [reference](https://docs.github.com/en/copilot/concepts/completions/code-referencing) |
| q-d1-a03 / 応用 | **変更の部分採用**：Copilotが複数ファイルを変更し、一部だけ採用したい。対象クライアントの差分レビュー操作を選ぶ | 変更単位の採否 / ファイル単位の取消 / checkpoint復元 / レビュー後の追加依頼 | [edits](https://code.visualstudio.com/docs/agents/run/review-code-edits) |
| q-d1-a04 / 応用 | **外部コンテキストの取得承認**：CopilotにMCPを追加した後、ツール結果を取り込む前に確認したい。ツール承認と結果確認の区別を問う | 実行前承認 / 結果の確認 / サーバー信頼 / Instructions | [approval](https://code.visualstudio.com/docs/agents/run/approvals)、[mcp-tools](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) |
| q-d1-a07 / 応用 | **Agentのネットワーク接続制限**：クラウドAgentだけが指定ドメインへ接続できない。外部接続の制御箇所を選ぶ | Agent firewall / ローカルプロキシ / モデル選択 / コード参照設定 | [firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) |
| q-d1-a08 / 応用 | **提案の根拠の確認**：Chat回答と実際に参照したファイルを照合したい。回答の参照情報を開く操作を問う | Used references / コード参照 / モデル選択 / 利用状況集計 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d1-a09 / 応用 | **非破壊の調査と実装の分離**：同じCopilot環境でまず読み取り調査だけを行い、後から編集したい。利用可能なモード・ツール設定を選ぶ | 調査用ツール制限 / 全実行許可 / 常設Instructions / モデル変更 | [tools](https://code.visualstudio.com/docs/agents/run/tools) |
| q-d1-a10 / 応用 | **継続実行と権限の違い**：CLIで自律的な継続を有効にしたが、危険な操作の許可範囲は変えたくない。継続モードと許可設定の関係を問う | Autopilot / allow-all / 個別ツール許可 / 確認応答設定 | [autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)、[cli](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) |
| q-d1-e01 / 本番相当 | **クラウドPRの承認者と実行者**：Copilotへ依頼した人、別の書込権限者、必須承認を示し、Agent PRの実行承認とマージ承認を区別する | ワークフロー承認 / 依頼者のレビュー / 別担当レビュー / Agentへの再依頼 | [risk](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations) |
| q-d1-e02 / 本番相当 | **参照ログの証跡の限界**：インライン採用・手修正・Chat出力の記録を比較し、Copilotコード参照で確認できる範囲を特定する | 採用提案ログ / 手修正コード / チャット参照 / Git差分 | [reference](https://docs.github.com/en/copilot/concepts/completions/code-referencing) |
| q-d1-e03 / 本番相当 | **ローカル変更の復元範囲**：Agentのファイル変更と外部ツール操作が混在。クライアントの復元機能が扱う範囲を前提に回復操作を選ぶ | checkpoint復元 / 差分取り消し / 外部操作の別処理 / 会話削除 | [edits](https://code.visualstudio.com/docs/agents/run/review-code-edits)、[trust](https://code.visualstudio.com/docs/agents/concepts/trust-and-safety) |
| q-d1-e05 / 本番相当 | **公開Spaceへ移す前の共有設定**：個人Spaceから共有を広げたいが、元データの公開範囲と所有者設定が異なる。Spacesで変更可能な共有範囲を問う | 個人公開共有 / 組織内共有 / 元リポジトリ公開 / 閲覧ロール | [spaces](https://docs.github.com/en/copilot/concepts/context/spaces) |
| q-d1-e07 / 本番相当 | **複数の承認レイヤー**：MCPサーバーは信頼済みだが、個別の書込ツールに承認が出る。サーバー信頼とツール実行承認を分けて最小変更を選ぶ | サーバー再信頼 / ツール承認 / 接続設定 / 全ツール自動承認 | [approval](https://code.visualstudio.com/docs/agents/run/approvals)、[mcp-tools](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) |
| q-d1-e08 / 本番相当 | **Copilotレビューと必須承認**：Copilotのレビュー所見はあるが必須承認が満たされない。preview承認を無効と明記し、レビュー機能の役割を判定する | 所見 / 承認カウント / 再レビュー / 人間レビュー | [review](https://docs.github.com/en/copilot/concepts/agents/code-review) |
| q-d2-a04 / 応用 | **公開コード参照と入力参照**：同じChat画面の資料参照とコード一致参照を見分け、生成コードの一致元を確認する表示を選ぶ | 回答の資料参照 / public code reference / プロンプト添付 / 利用ログ | [reference](https://docs.github.com/en/copilot/concepts/completions/code-referencing)、[context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d5-e02 / 本番相当 | **Agentへの過剰許可の戻し方**：IDEの広い自動承認を戻し、一部の読取操作だけ許可を維持したい。Copilotクライアントの承認ルールを調整する | 個別許可 / 全許可解除 / ツール非表示 / Chatによる禁止 | [approval](https://code.visualstudio.com/docs/agents/run/approvals) |
| q-sc02-2 / 本番相当 | **リポジトリ境界のある委任**：クラウドAgentの一つのタスクで二つのリポジトリを変更しようとしている。作業対象の機能上の境界に合う分割を選ぶ | 別タスク化 / 追加コンテキスト / MCP読取 / 権限拡大 | [cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github) |
| q-sc05-1 / 応用 | **ローカルとクラウドの作業場所**：Copilotの実行ログは進んでいるが手元ファイルは変わらない。委任先とローカルAgentの実行場所を区別する | クラウドセッション / ローカルAgent / インラインChat / PR summary | [cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github) |
| q-sc05-2 / 応用 | **Agent実行の追跡**：Copilotがどのツールを実行したかを確認したい。セッションの実行記録を選ぶ | セッションログ / 回答本文 / PR summary / 利用集計 | [sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) |
| q-sc09-3 / 本番相当 | **共有されたセッションの閲覧**：チームへAgentの作業を共有したいが、リポジトリアクセスは広げない。セッション共有の閲覧条件を問う | セッション共有 / リポジトリ権限 / Space共有 / 公開リンク | [sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents)、[cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github) |
| q-d1-a12 / 応用 | **Spaceの編集権限**：共有資料を読むだけのメンバーに、ソース変更権限は与えたくない。Spacesのロールを選ぶ | viewer / editor / admin / 所有者変更 | [spaces](https://docs.github.com/en/copilot/concepts/context/spaces) |
| q-d1-a13 / 応用 | **Copilot提案のフィードバック**：誤ったChat回答を報告したいが組織ポリシーは変えない。回答へのフィードバックと管理操作を区別する | 回答評価 / サポート診断 / 管理ポリシー / Instructions | [chat](https://code.visualstudio.com/docs/agents/run/chat-view) |
| q-d1-a14 / 応用 | **実行中のAgentへの指示**：Copilotの実装途中で制約が変わった。現在のセッションを確認し、追加指示で作業を修正する操作を選ぶ | 実行中セッションへの指示 / 別セッション / モデル設定 / PR summary | [sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) |
| q-d2-a26 / 応用 | **一回限りのターミナル承認**：一つの操作だけ実行を認め、以後のコマンドを自動許可しない。IDEの承認UIの適用範囲を選ぶ | 今回許可 / セッション許可 / 永続ルール / 全許可 | [approval](https://code.visualstudio.com/docs/agents/run/approvals) |
| q-d1-e09 / 本番相当 | **参照のない回答の解釈**：コード一致参照が出ないケースを、非公開コード・編集済み提案・通常の不一致で比較する。検出対象の境界を問う | 公開索引との一致 / 全コードの出所証明 / 入力参照 / 許可設定 | [reference](https://docs.github.com/en/copilot/concepts/completions/code-referencing) |
| q-d2-e20 / 本番相当 | **実行権限と利用ポリシーの切分け**：組織ではAgent利用可だがIDEで特定ツールだけ承認待ち。組織の利用可否とクライアントの実行権限を区別する | 組織ポリシー / IDE承認 / ツール有効化 / モデル設定 | [policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)、[approval](https://code.visualstudio.com/docs/agents/run/approvals) |
| q-d1-a15 / 応用 | **テスト生成の対象指定**：画像の氏名テスト問題を廃止。対象関数だけ選択済みで、既存のテスト先を踏まえてCopilotのGenerate Testsを起動する方法を問う | 選択コードのGenerate Tests / Fix Test Failure / setupTests / リポジトリ全体へのAgent依頼 | [testing](https://code.visualstudio.com/docs/debugtest/testing) |
| q-d1-a16 / 応用 | **資料に埋め込まれた指示とツール権限**：外部資料を読ませても利用可能なツール範囲は広げない。Copilotで設定するツール制限を選ぶ | ツール構成 / 資料への注意書き / モデル切替 / Instructions削除 | [tools](https://code.visualstudio.com/docs/agents/run/tools)、[trust](https://code.visualstudio.com/docs/agents/concepts/trust-and-safety) |
| q-d1-a17 / 応用 | **チャットへの添付内容の確認**：送信前に意図しないファイル添付を外し、必要なファイルだけ明示したい。Copilot Chatのコンテキスト操作を問う | 添付の削除・追加 / モデル変更 / 公開コードBlock / 回答評価 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d1-a18 / 応用 | **Copilot変更への再レビュー**：Copilotが作成したPRへ追加コミットした。対象差分についてレビューを依頼する機能操作を問う | 再レビュー依頼 / PR summary再生成 / Agent新規割当 / ローカルテスト起動 | [review](https://docs.github.com/en/copilot/concepts/agents/code-review) |
| q-d1-a19 / 応用 | **認可済みMCPツールの無効化**：接続を維持したまま不要な書込ツールをCopilotに使わせない。クライアント側の有効ツール選択を問う | ツール選択 / サーバー削除 / Instructions / Spaceロール | [tools](https://code.visualstudio.com/docs/agents/run/tools)、[mcp-tools](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) |
| q-d1-a20 / 応用 | **説明と実行結果の見分け**：Copilotが「実行した」と説明したが、実際のツール結果を確認したい。UI上で調べる対象を選ぶ | ツール呼出し結果 / 生成されたコマンド文 / 回答評価 / モデル一覧 | [sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents)、[tools](https://code.visualstudio.com/docs/agents/run/tools) |
| q-d1-a21 / 応用 | **共有Spaceの閲覧者の変更**：組織所有Spaceでメンバーの既定アクセスを絞りたい。Space共有設定とリポジトリ権限を区別する | Space既定アクセス / ファイル公開 / Seat削除 / MCP許可 | [spaces](https://docs.github.com/en/copilot/concepts/context/spaces) |
| q-d1-a22 / 応用 | **Agentの停止と履歴保持**：実行中の変更を止めたいが、調査用のセッション記録は残したい。停止と履歴削除を区別する | 実行停止 / 会話削除 / 差分復元 / PRクローズ | [sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) |

### 旧D2：Copilotの機能を使いこなす

| ID / 難度 | 新テーマと判断させる内容 | 四択を構成する近接機能 | 仕様確認先 |
| --- | --- | --- | --- |
| q-d2-a07 / 応用 | **PR summaryとCode review**：差分の説明文はできたが欠陥の指摘はない。目的に合うCopilot機能へ切り替える | PR summary / Code review / Agent実装 / Chat説明 | [summary](https://docs.github.com/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/create-a-pr-summary)、[review](https://docs.github.com/en/copilot/concepts/agents/code-review) |
| q-d2-a18 / 応用 | **CLIのディレクトリ信頼**：CLI開始時に作業ディレクトリの信頼を求められる。コマンド許可やMCP認可と区別して設定を選ぶ | ディレクトリ信頼 / ツール許可 / MCPログイン / モデル選択 | [cli-start](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli)、[cli](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) |
| q-d2-e02 / 本番相当 | **自動レビューの起動条件**：PR作成時と追加push時でレビュー有無が違う。Copilot自動レビューのトリガー設定から説明・変更を選ぶ | 新規PR / 新規push / draft / 個別レビュー依頼 | [review-config](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review) |
| q-d2-e11 / 本番相当 | **Code reviewのInstructions参照版**：同じPRでレビュー指示を変更した。現行のhead branch参照を踏まえ、再レビューに使われる指示を選ぶ | head版 / base版 / 個人指示 / PR本文 | [review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) |
| q-d2-e15 / 応用 | **カスタムAgentのツール範囲**：汎用Agentでは使えるツールが特定プロファイルで使えない。プロファイルのtools定義を読み原因を選ぶ | プロファイル定義 / MCP接続 / ツール承認 / モデル選択 | [custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration) |
| q-d2-e19 / 本番相当 | **Spaceのソース更新**：GitHubのリンク元は更新されたがアップロード資料は旧版。ソースの種類ごとにCopilot Spacesでの更新方法を選ぶ | リンク元更新 / アップロード差替 / 共有ロール / 再インデックス | [spaces](https://docs.github.com/en/copilot/concepts/context/spaces) |
| q-d6-e02 / 本番相当 | **レビュー機能の組織設定**：一部メンバーだけCopilotレビューを使えない。ライセンスの有無と組織のレビュー許可条件を表から特定する | レビュー利用許可 / Seat割当 / PR書込権限 / 自動レビュー設定 | [review](https://docs.github.com/en/copilot/concepts/agents/code-review)、[policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies) |
| q-d6-e05 / 本番相当 | **管理APIの用途の区別**：退職者のCopilotアクセスを停止する作業と使用量監査がある。必要なCopilot管理API操作と参照APIを選ぶ | Seat取消 / Seat一覧 / 利用集計 / 監査ログ | [seats](https://docs.github.com/en/rest/copilot/copilot-user-management) |
| q-sc03-1 / 応用 | **CLIの非対話実行**：CI用途で単発プロンプトを実行したい。CLIの非対話実行方式と対話セッションの違いを問う | 単発プロンプト / 対話開始 / セッション再開 / Agentプロファイル | [cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| q-sc03-2 / 本番相当 | **IDEの部分編集と自律実装**：対象ファイルは決まっているが、変更後のコマンド実行は不要。編集支援とAgentを作業範囲から選ぶ | 対象指定の編集 / Agent実装 / 説明用Chat / インライン補完 | [ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides) |
| q-sc07-1 / 応用 | **CLIのセッション再開**：別日にCLI作業を続けたい。シェル履歴ではなくCopilotの既存セッションを再開する機能を選ぶ | resume / 新規prompt / プロファイル変更 / ディレクトリ移動 | [cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| q-sc07-2 / 本番相当 | **SubagentとカスタムAgent**：独立した調査を並行委任する必要と、毎回同じ役割・ツールを使う必要を比較し、Copilotの機能の組合せを選ぶ | Subagent / カスタムAgent / Instructions / Prompt File | [cli-compare](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)、[custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration) |
| q-d2-e22 / 本番相当 | **CLIの作業場所と追加アクセス**：作業ルートは変えず別の資料フォルダを読ませたい。CLIのディレクトリアクセス設定と移動・コマンド許可を区別する | 追加ディレクトリ許可 / cd / shell許可 / MCP設定 | [cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| q-d2-e23 / 本番相当 | **モデル利用可否の判定**：同一IDEでユーザーごとにモデル一覧が違う。プラン・組織ポリシー・クライアント対応を照合して適切な確認先を選ぶ | モデルポリシー / クライアント対応 / MCP設定 / Spaceロール | [models](https://docs.github.com/en/copilot/reference/ai-models/supported-models)、[policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies) |

### 旧D3：データとアーキテクチャ

| ID / 難度 | 新テーマと判断させる内容 | 四択を構成する近接機能 | 仕様確認先 |
| --- | --- | --- | --- |
| q-d3-a03 / 応用 | **索引と会話コンテキスト**：リポジトリ全体を索引化済みでも、回答が特定仕様を参照しない。索引と今回の明示添付の役割を区別する | 索引 / 明示ファイル添付 / モデル学習 / 履歴削除 | [index](https://docs.github.com/en/copilot/concepts/context/repository-indexing)、[context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d3-a05 / 応用 | **リモート索引の利用**：大規模リポジトリについてCopilotが関連コードを探す経路を、意味検索とモデル学習から区別する | semantic index / モデル再学習 / 全ファイル固定送信 / 公開コード索引 | [index](https://docs.github.com/en/copilot/concepts/context/repository-indexing) |
| q-d3-a09 / 応用 | **除外とプロンプト構築の関係**：索引には対象があっても管理除外ルールに一致する。Chatへ渡す文脈のフィルタ段階を選ぶ | 索引利用時のフィルタ / 公開一致フィルタ / モデル再学習 / アクセス権削除 | [index](https://docs.github.com/en/copilot/concepts/context/repository-indexing)、[exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion) |
| q-d3-e01 / 本番相当 | **公開コード索引と文脈索引**：同じ「検索」でもリポジトリの意味検索と公開コード一致検出で対象が違う。観察ログから該当する経路を判定する | semantic index / public match index / 添付ファイル / モデル学習 | [index](https://docs.github.com/en/copilot/concepts/context/repository-indexing)、[reference](https://docs.github.com/en/copilot/concepts/completions/code-referencing) |
| q-d3-e02 / 本番相当 | **GitHub外の索引利用条件**：GitHub外の作業リポジトリでVS Codeの意味索引を使いたい。対応ホストと管理ポリシーを明記して利用条件を照合する | 外部repo索引ポリシー / 公開コードBlock / Space共有 / MCP許可 | [index](https://docs.github.com/en/copilot/concepts/context/repository-indexing)、[policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies) |
| q-sc08-2 / 本番相当 | **ChatとAgentの実行場所の境界**：GitHubのAgentはクラウド、IDEはローカルという実行経路を示し、ローカル設定を変えてもクラウドの障害が解消しない理由を選ぶ | 実行環境 / 共有索引 / 利用Seat / モデル選択 | [cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)、[network](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors) |
| q-d3-e06 / 本番相当 | **添付・検索・履歴の優先確認**：旧APIの回答が続き、添付版・参照ファイル・会話履歴を提示。Copilotが実際に参照した文脈を確認する操作順を選ぶ | 添付一覧 / 参照表示 / 新規会話 / モデル切替 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d3-e07 / 本番相当 | **ネットワーク経路の切分け**：Copilot補完とChatの疎通結果が異なる。公式の診断対象を使い、失敗しているCopilot接続経路を特定する | 補完endpoint / Chat endpoint / MCP endpoint / Agent firewall | [network](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors) |
| q-d3-a16 / 応用 | **未コミット内容とリモート文脈**：ローカルの未コミット変更を前提に質問したい。GitHub上のコード参照では足りない条件からIDE側のコンテキストを選ぶ | ローカルファイル文脈 / GitHubリポジトリ文脈 / 公開索引 / Spaceリンク | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[index](https://docs.github.com/en/copilot/concepts/context/repository-indexing) |
| q-d3-a19 / 応用 | **診断ログと会話履歴**：Copilotだけ接続エラーが続く。会話削除ではなく環境診断ログを取得する操作を問う | Copilot診断ログ / Chat履歴 / Git履歴 / PR summary | [logs](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/view-logs)、[network](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors) |

### 旧D4：プロンプトとコンテキスト

| ID / 難度 | 新テーマと判断させる内容 | 四択を構成する近接機能 | 仕様確認先 |
| --- | --- | --- | --- |
| q07 / 応用 | **シンボルを明示したChat**：同名関数が複数ある。Copilot Chatへ対象シンボルを明示し、参照先を確認する操作を問う | symbol添付 / folder添付 / 会話再開 / モデル変更 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d2-a02 / 応用 | **ターミナル出力の明示文脈**：エラーがターミナルにだけある。Copilot Chatにその出力を文脈として渡す操作を問う | terminal context / file添付 / PR summary / Space作成 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d3-a01 / 応用 | **Prompt Fileの相対参照**：共通プロンプトから別の仕様ファイルを参照したい。クライアントのPrompt Fileの参照方法と基準位置を問う | Markdown参照 / パス別applyTo / ツール設定 / 個人Instructions | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files) |
| q-d3-a06 / 応用 | **Prompt Fileの引数**：同じ処理を対象名だけ変えて繰り返す。Prompt Fileの入力変数・引数の使い方を選ぶ | 入力変数 / applyTo / 常設指示 / モデル設定 | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files) |
| q-d3-a07 / 応用 | **Prompt Fileの実行環境**：保存済みPrompt Fileが意図しないAgent・ツールで動く。frontmatterの対応項目を確認し修正する | agent指定 / tools指定 / description / Instructions | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files) |
| q-d4-a01 / 応用 | **選択範囲の文脈**：選択した関数への質問なのに別範囲が使われる。Copilotの選択範囲添付と参照確認を問う | selection添付 / ファイル添付 / フォルダ添付 / 履歴 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d4-a02 / 応用 | **フォルダ単位の文脈**：実装が複数ファイルにまたがり、対象フォルダだけを質問に含めたい。Copilotのフォルダ添付とcodebase検索を区別する | folder添付 / codebase検索 / symbol添付 / Instructions | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d4-a03 / 応用 | **Web資料を添付する機能**：コードにない現行API資料を参照させたい。Web取得ツールとローカルファイル添付を区別する | Web取得 / workspace検索 / MCP任意ツール / 会話履歴 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[tools](https://code.visualstudio.com/docs/agents/run/tools) |
| q-d4-a05 / 応用 | **汚れた会話の切替**：前の作業の前提が残っている。必要な文脈を指定し直してCopilotの会話を分離する機能操作を問う | 新規会話 / 既存履歴継続 / モデル変更 / Prompt File編集 | [chat](https://code.visualstudio.com/docs/agents/run/chat-view)、[context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d4-a06 / 応用 | **Prompt Fileの発見条件**：プロンプトがコマンドとして見つからない。対応する保存場所・拡張子とクライアントの検出設定を確認する | prompt配置 / instructions配置 / agent配置 / MCP配置 | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files) |
| q-d4-a09 / 応用 | **変更差分の文脈**：ファイル全体ではなく現在の未コミット差分について質問したい。ソース管理の変更をChatへ渡す機能を選ぶ | changes文脈 / file添付 / symbol添付 / PR summary | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d4-a10 / 応用 | **参照資料と指示ファイル**：資料本文を参照したいだけなのに常設指示へ入れてしまった。資料添付とInstructionsの役割に合う構成を選ぶ | 資料添付 / Instructions / Prompt File / MCP | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) |
| q-d4-e03 / 本番相当 | **複数Prompt Fileの参照解決**：同名の仕様ファイルが別フォルダにある。Prompt Fileの位置と明示参照から実際に使う資料を照合する | 相対参照 / 絶対参照 / 添付済み資料 / 作業root | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files) |
| q-d4-e04 / 本番相当 | **Prompt Fileとツールの二重制約**：プロンプトが指定するツールとセッションで有効なツールが異なる。利用可否を照合して必要な修正を選ぶ | prompt tools / セッションtools / MCP接続 / 実行許可 | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)、[tools](https://code.visualstudio.com/docs/agents/run/tools) |
| q-d4-e05 / 本番相当 | **別セッションへ渡す文脈**：調査は別セッションへ分けたいが、元会話の全履歴を前提にしたくない。委任時の文脈・結果の受渡し方法を問う | Subagent委任 / 新規会話 / Prompt File / 常設指示 | [cli-compare](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)、[custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration) |
| q-d5-a04 / 応用 | **画像を添付したChat**：画面の見た目を参照させたいが、コードだけが添付されている。対応クライアントで画像を文脈へ加える操作を選ぶ | 画像添付 / コード検索 / PR summary / MCP構成 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-sc02-3 / 応用 | **Instructionsの適用確認**：指示を書いたのに回答に反映されない。文言の良し悪しでなく、クライアントが読んだInstructionsを確認する経路を選ぶ | 指示参照表示 / 回答評価 / モデル変更 / Space共有 | [instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)、[context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-sc03-3 / 応用 | **特定タスクだけのモデル指定**：保存プロンプトの実行時だけ利用可能モデルを指定したい。クライアント対応を明記してPrompt File設定を問う | prompt model / default model / Instructions / Space設定 | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)、[models](https://docs.github.com/en/copilot/reference/ai-models/supported-models) |
| q-sc06-2 / 本番相当 | **GitHubからAgentへ会話を渡す**：Chatで合意した調査内容を同じ文脈でクラウド実装へ委任したい。会話とAgentセッションの引継ぎ機能を選ぶ | 会話から委任 / 独立issue割当 / Space / モデル変更 | [cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)、[sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) |
| q-d3-a14 / 応用 | **ツールの明示指定**：検索用MCPツールは有効だがCopilotが使わない。Chatで対象ツールを明示する方法を選ぶ | tool mention / サーバー再登録 / Instructions / モデル設定 | [tools](https://code.visualstudio.com/docs/agents/run/tools) |
| q-d4-e06 / 本番相当 | **Instructionsの使用対象の制限**：Chat用の指示をCode reviewには適用したくない。対応する除外指定とパス条件を照合して設定を選ぶ | excludeAgent / applyTo / Prompt File / 別branch | [instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)、[review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) |
| q-d4-e07 / 本番相当 | **Prompt Fileのモード依存**：同じプロンプトでも別の実行モードではツールが使えない。frontmatterとクライアントの対応を照合する | agent指定 / tool利用可否 / ファイル参照 / モデル対応 | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)、[tools](https://code.visualstudio.com/docs/agents/run/tools) |
| q-d4-e08 / 本番相当 | **サブ調査のツール範囲**：親Agentと調査用Agentに異なるツール一覧を与える。プロファイルと委任先を照合して過剰なツールを減らす | 委任先tools / 親tools / 全MCP切断 / Instructions | [custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration)、[cli-compare](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features) |
| q-d4-e09 / 本番相当 | **コンテキストの欠落の診断**：大量の会話と添付があるのに対象資料が使われない。参照情報とクライアントのコンテキスト管理表示を基に再構成する | コンテキスト確認 / 対象の明示添付 / モデル選択 / 会話要約 | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[chat](https://code.visualstudio.com/docs/agents/run/chat-view) |

### 旧D5：開発生産性を高める

| ID / 難度 | 新テーマと判断させる内容 | 四択を構成する近接機能 | 仕様確認先 |
| --- | --- | --- | --- |
| q10 / 応用 | **失敗テストからの起動**：失敗したテストとエラー出力をCopilotへ渡したい。Test ExplorerのFix Test Failureから開始する操作を問う | Fix Test Failure / Generate Tests / setupTests / PR summary | [testing](https://code.visualstudio.com/docs/debugtest/testing) |
| q-d2-e01 / 本番相当 | **クラウドのセットアップ未実行**：Copilotの作業環境だけ依存がない。セットアップworkflowの場所・job・実行記録を照合して有効化する | setup steps workflow / 本番CI / ローカル設定 / MCP | [setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment) |
| q-d2-e07 / 本番相当 | **テスト実装と実行の経路**：Chatにはテスト案があるがファイル変更も実行結果もない。Agentの編集・実行ツールを使う流れへ切替える | Agent編集実行 / Chat回答 / Generate Tests / PR review | [ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides)、[tools](https://code.visualstudio.com/docs/agents/run/tools) |
| q-d2-e10 / 本番相当 | **外部サービスを使うAgent環境**：クラウドAgentのセットアップに認証が必要。Copilot用環境のsecretとローカルenv・MCP認証を区別する | Copilot environment secret / ローカルenv / MCP認証 / Instructions | [setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment) |
| q-d2-e14 / 応用 | **関数だけの変更提案**：同じファイルの他領域を変えず、選択関数のリファクタ差分を確認したい。Inline Chatの適用範囲を選ぶ | Inline Chat / 全体Agent / 補完 / PR review | [ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides) |
| q-d3-e03 / 応用 | **テスト基盤の初期設定支援**：テスト用の設定と拡張がまだない。CopilotのsetupTestsと既存テスト修正の起動方法を区別する | setupTests / Generate Tests / Fix Test Failure / Code review | [testing](https://code.visualstudio.com/docs/debugtest/testing) |
| q-d4-e01 / 本番相当 | **PR修正の継続委任**：Copilot作成PRの特定コメントを踏まえて追加修正させたい。既存PR・Agentセッションへの指示先を選ぶ | 既存PRへのCopilot指示 / 新規issue / PR summary / 自動レビュー | [cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)、[sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) |
| q-d5-a03 / 応用 | **補完の候補比較**：インライン提案が目的に合わず、ファイル編集を広げずに別候補を検討したい。補完の候補操作を問う | 次の候補 / ChatでAgent起動 / Code review / Prompt File | [completion](https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions) |
| q-d5-a06 / 応用 | **既存テストを文脈へ渡す**：生成テストのフレームワークが既存と違う。テスト内容の正誤ではなく、Copilotへ既存テストと対象コードを渡す操作を選ぶ | テストと実装の添付 / モデル変更 / setupTests / PR review | [testing](https://code.visualstudio.com/docs/debugtest/testing)、[context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d5-a07 / 応用 | **テスト生成の常設規約**：毎回のGenerate Testsで既存の規約を参照させたい。実行機能とInstructionsを組み合わせる構成を問う | Instructions＋生成 / Prompt Fileだけ / Spaceロール / 実行許可 | [testing](https://code.visualstudio.com/docs/debugtest/testing)、[instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) |
| q-d5-a08 / 応用 | **テスト修正時の承認待ち**：Agentが修正を提案した後、テストコマンドだけ待機している。Copilotのツール実行承認を調べる操作を選ぶ | コマンド承認 / テスト再生成 / モデル変更 / Instructions | [approval](https://code.visualstudio.com/docs/agents/run/approvals)、[testing](https://code.visualstudio.com/docs/debugtest/testing) |
| q-d5-a09 / 応用 | **テスト結果の追加文脈**：IDE外で実行したテストの出力をCopilotに扱わせたい。出力添付と自動実行を区別する | 結果添付 / Agent再実行 / Generate Tests / PR summary | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[testing](https://code.visualstudio.com/docs/debugtest/testing) |
| q-d5-a10 / 応用 | **失敗箇所を限定した再依頼**：複数テストのうち一件の失敗だけをCopilotに調査させたい。Test ExplorerとChatの対象指定を選ぶ | 単一失敗のFix / 全体Generate / setupTests / リポジトリ検索 | [testing](https://code.visualstudio.com/docs/debugtest/testing) |
| q-d5-a11 / 応用 | **説明だけを得るChat**：レガシーコードの読解で変更を作りたくない。対象ファイルを文脈にした説明と編集機能を区別する | 説明Chat / Inline編集 / Agent実装 / Code review | [ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides)、[context](https://code.visualstudio.com/docs/chat/copilot-chat-context) |
| q-d5-e01 / 本番相当 | **手元だけで再現する失敗**：未コミットのテスト設定が原因でクラウドでは再現しない。Copilotの実行場所と渡された文脈を比較して作業先を選ぶ | ローカルAgent / クラウドAgent / PR review / Space | [cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)、[ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides) |
| q-d5-e03 / 本番相当 | **セットアップとタスク実行の区別**：環境準備のログは成功だがAgentのテスト実行は失敗。Copilot setup stepsとタスク中のツールログを区別する | セットアップjob / Agent実行 / PRのCI / IDE出力 | [setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)、[sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) |
| q-d5-e04 / 応用 | **複数ファイルの意図した編集**：実装とテストの対象ファイルは指定済み。Copilot Editsで編集対象を調整し、差分を確認する操作を問う | 編集対象指定 / 対象無制限Agent / Inline Chat / Code review | [ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides)、[edits](https://code.visualstudio.com/docs/agents/run/review-code-edits) |
| q-d5-e05 / 本番相当 | **テスト規約のレビューへの適用**：生成時の規約とPRレビュー基準を同じリポジトリで使いたい。対応するInstructionsの範囲とレビュー参照版を照合する | repo instructions / prompt / 個人設定 / base branch | [review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review)、[instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) |
| q-sc02-1 / 本番相当 | **レビュー指摘から修正へ**：Copilotのレビュー指摘を一件だけ修正したい。提案の適用とAgentへの修正委任を、変更範囲から選ぶ | 提案適用 / Agent委任 / PR summary / 再レビュー | [review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review)、[cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github) |
| q-sc04-3 / 応用 | **差分の一部を戻して再依頼**：Agentが作成したテストの一部を戻し、残りは保持したい。対応クライアントで差分採否と追加依頼を選ぶ | 部分取消 / 全checkpoint / 新規会話 / PR close | [edits](https://code.visualstudio.com/docs/agents/run/review-code-edits) |
| q-sc09-1 / 本番相当 | **PR説明の更新**：追加コミットでPR説明が古くなった。Copilotのsummary機能で差分説明を更新する操作を、レビュー再実行と区別する | summary再生成 / Code review / Agent実装 / commit説明 | [summary](https://docs.github.com/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/create-a-pr-summary) |
| q-d3-a15 / 応用 | **診断情報付きの修正依頼**：IDEのProblemsにだけエラーがある。Copilotへ診断情報を渡して対象修正を依頼する操作を問う | Problems文脈 / ファイル全体 / Web検索 / PR summary | [context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides) |
| q-d4-a14 / 応用 | **テスト生成の再利用プロンプト**：担当者ごとに同じ生成タスクを手動起動したい。常設規約とは別に、再利用するPrompt Fileを設計する | Prompt File起動 / Instructions自動適用 / MCP / Code review | [prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)、[testing](https://code.visualstudio.com/docs/debugtest/testing) |
| q-d5-a12 / 応用 | **複数ファイル実装の委任**：関連する実装とテストをCopilotが探索して変更・実行する必要がある。既知ファイルだけの編集との違いから選ぶ | Agent探索実行 / Edits対象指定 / Inline Chat / 補完 | [ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides)、[tools](https://code.visualstudio.com/docs/agents/run/tools) |
| q-d5-a14 / 応用 | **PR内のコードレビュー依頼**：テストを含むPRについてCopilotの指摘が欲しい。説明文生成ではなくレビューを起動する場所を選ぶ | reviewer依頼 / summary / issue割当 / Inline補完 | [review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review)、[summary](https://docs.github.com/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/create-a-pr-summary) |
| q-d5-a15 / 応用 | **テスト生成先の文脈**：別モジュールのテストへ生成される。Copilotに対象実装・既存テスト・編集対象を明示する操作を選ぶ | 添付と編集対象 / 生成内容の業務修正 / モデル変更 / 索引削除 | [testing](https://code.visualstudio.com/docs/debugtest/testing)、[context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides) |
| q-d3-e08 / 本番相当 | **Agentの外部依存取得**：クラウドAgentの依存取得失敗とMCP通信成功を示し、セットアップとAgent firewallのどこを調べるか選ぶ | setupログ / firewall / MCP設定 / IDEプロキシ | [setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)、[firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) |
| q-d5-e06 / 本番相当 | **自動レビューのdraftとpush**：draft作成・ready化・追加コミットの各時点でレビューを行いたい。Copilotのトリガー設定を組み合わせる | draft設定 / push設定 / ready化 / 個別依頼 | [review-config](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review) |
| q-d5-e07 / 本番相当 | **ツール実行が必要なテスト改善**：同じ対象でChat生成は可能だが実行環境依存の確認が必要。Agentのツール有効化・実行承認・結果取得を照合する | 生成機能 / tool有効化 / 実行承認 / モデル選択 | [tools](https://code.visualstudio.com/docs/agents/run/tools)、[approval](https://code.visualstudio.com/docs/agents/run/approvals)、[testing](https://code.visualstudio.com/docs/debugtest/testing) |
| q-d5-e08 / 本番相当 | **レビュー基準の継承元**：リポジトリに共通・パス別の指示があり、変更ファイルごとにCopilotレビューの対象規約が違う。実際の適用範囲を照合する | 共通指示 / パス別指示 / 個人Chat指示 / Prompt File | [review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review)、[instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) |

### 旧D6：プライバシーと保護

| ID / 難度 | 新テーマと判断させる内容 | 四択を構成する近接機能 | 仕様確認先 |
| --- | --- | --- | --- |
| q-d1-e04 / 応用 | **組織と個人の除外設定**：個人側で除外設定を探しているが管理Seatのリポジトリ除外が必要。Content Exclusionの管理場所と管理主体を選ぶ | org / repository / 個人Chat / IDE添付 | [exclusion-howto](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot) |
| q-d6-a03 / 応用 | **除外ルールの対象モード**：同じパスで通常補完と非対応モードを比較する。Content Exclusionの対応表から保護対象の違いを選ぶ | 対応モード / パス変更 / 再認証 / public code Block | [exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion) |
| q-d6-e03 / 本番相当 | **除外・アクセス・公開一致の分離**：ファイルは読めるが補完文脈から外れ、公開一致出力も制限される。三つの仕組みの効果を分ける | アクセス権 / Content Exclusion / public match / 索引 | [exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)、[reference](https://docs.github.com/en/copilot/concepts/completions/code-referencing)、[index](https://docs.github.com/en/copilot/concepts/context/repository-indexing) |
| q-d6-e04 / 本番相当 | **ホストとプランの対応範囲**：複数のCopilot利用環境に同じ除外を展開したい。現行のホスト・プラン・クライアント対応表を照合する | 管理プラン / ホスト / client mode / ローカルパス | [exclusion-howto](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)、[exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion) |
| q-sc05-3 / 応用 | **除外されたファイルと手入力**：管理除外された元ファイルと、利用者がChatに手入力する内容の扱いを区別する。除外が制御する対象を問う | 自動文脈 / 明示入力 / repo権限 / 公開一致検出 | [exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion) |
| q-sc10-3 / 本番相当 | **除外対象の派生情報**：除外元と別ファイルに複製された内容を示し、Content Exclusionのファイル単位の境界から必要なルールを判断する | 元ファイルルール / 派生ファイルルール / 公開Block / Space設定 | [exclusion-howto](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)、[exclusion](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion) |
| q-d1-a11 / 応用 | **公開一致Blockの設定主体**：管理Seatと個人設定で表示が異なる。公開一致フィルタの実効設定を確認する場所を選ぶ | 管理ポリシー / 個人設定 / コード参照ログ / Content Exclusion | [policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)、[reference](https://docs.github.com/en/copilot/concepts/completions/code-referencing) |
| q-d6-a13 / 応用 | **public matchの索引範囲**：非公開コードとの一致を調べたい要望に対し、Copilotコード参照の検索対象と利用可能な表示を判断する | public index / private repo文脈 / 手修正コード / Agentログ | [reference](https://docs.github.com/en/copilot/concepts/completions/code-referencing) |

## 維持候補25問との比較台帳

下記の全件と比較する。121案のJSONに列挙したcompareWithKeptIdsは優先比較先であり、それ以外と重複しない保証ではない。

| ID | 今回比較すべき既存の判断 |
| --- | --- |
| q-d1-e06 | 公開コード一致Blockの役割と、ライセンス適合を保証する機能ではないという限界を問う。 |
| q-d2-a20 | Spacesのアップロード資料、MCPでのAPI照会、Instructions、Prompt Fileの使い分けを選ぶ機能選択。 |
| q-d2-e06 | CLIの利用可能ツール集合、allow、denyの優先関係を二つのセッションへ適用する。 |
| q-d2-e08 | VS Codeのパス別指示とapplyTo、共通指示からの除去という適用範囲の設定。AAAのテスト内容は答えではない。 |
| q-d2-e16 | 共通規約とパス別規約というCopilot Instructionsの適用範囲を整理する。 |
| q-d3-e04 | 通常補完と非対応のAgentでContent Exclusionの保護範囲が違う機能制約。 |
| q-d6-a01 | 複製先repoの識別と対象パスへCopilot Content Exclusionを適用する設定。 |
| q-d6-a08 | Content excluded表示と他ファイルの通常補完を使う、Copilot除外機能の診断。 |
| q-d6-a09 | CopilotのIDE活動記録にテレメトリーの収集条件があることを区別する管理機能の問題。PR数の計算問題とは分ける。 |
| q-d6-a10 | Privateという公開範囲とCopilot除外の適用先を区別して設定する。 |
| q-d6-e01 | Content Exclusionのsymlink経路と非対応Agentの制約を区別する。 |
| q-sc01-2 | repoルールを削除しても組織の除外ルールが残るという適用範囲と設定元。 |
| q-sc01-3 | CopilotのEnterprise強制設定とOrganizationへ委任したポリシーの実効範囲・変更権限。 |
| q-sc06-3 | GitHub.comの個人指示とrepo指示の適用範囲・競合の整理。JSDocの正しい書き方を答えない。 |
| q-d2-a23 | VS CodeでstdioのMCPをHTTPとして設定した方式不一致。実際のクライアント接続設定を問う。 |
| q-d2-a24 | 常時適用する共通指示と必要なときに使うPrompt Fileという機能・起動の使い分け。 |
| q-d2-a25 | Copilot CLIの提供ツールと実行権限、sessionのallow/denyと保存済み承認の区別。 |
| q-d3-a13 | Copilot座席割当API、利用集計、機能ポリシー、監査という管理機能の使い分け。 |
| q-d6-a11 | Copilot Content Exclusionへ実際に指定するパス範囲と再帰パターン。 |
| q-d6-a12 | Copilot除外の設定反映、IDE再読込、除外表示の確認という機能の検証操作。 |
| q-d6-a14 | 組織由来とrepo由来の除外設定を区別して変更する。 |
| q-d2-e21 | Spaceへの共有権限と参照元repo権限が別である、Copilot Spacesの実際のアクセス範囲。 |
| q-d2-e24 | 廃止されたGitHub App型Copilot Extensionsと、存続する通常App機能、MCP移行の区別。旧機能の現行扱いではない。 |
| q-d6-e06 | Suggestions matching public codeのEnterprise強制BlockとOrg保存値・承認記録の違い。 |
| q-d3-a17 | Copilotの公開コード一致Allow/Blockと候補表示の変化を、入力除外・接続・補完設定と区別する。 |

## 確認結果と未完了事項

- 121件のIDを候補台帳と照合し、漏れ・余分・重複がないことを確認。応用72件・本番相当49件。
- 元問題の各指紋と問題バンク全体の指紋を照合。候補抽出時点の内容と一致する。
- 問題データ・出題除外・削除記録は未変更。この計画を生成しただけではアプリの出題は変わらない。
- 新問の四択・解説・反実仮想・分類・参照節・難易度の最終レビューはこれから。計画案を自動合格にしていない。
- 候補テーマに対する一次資料は確認したが、すべての操作名・保存場所・preview・クライアント対応を確定した原稿ではない。リンクの現行URL・該当節も執筆時に再確認する。
- レポートのみのためビルド・アプリの動作試験は今回行っていない。実装時には既存の品質・難易度・分類チェックを新基準に対応させ、過去のレビュー記録は書き換えて合格にしない。
