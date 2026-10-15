# Copilot機能問題の修正・再レビュー（2026-10-16）

応用48問・本番相当43問、計91問を対象に、76問の本文・選択肢・個別解説を改稿した。残る15問は本文を維持した。全91問の推論・根拠・条件変更例を再確認した。

## 今回直した点

- **単一正答**：個人Prompt Fileの設問に自動同期・手動配布禁止を明記し、手動コピーが別解にならないようにした。
- **公式設定例**：CLIの候補ツールはview・grep・bash等の実名で書き、実行権限のshellと分けた。利用環境も明記した。
- **選択肢**：前回、本文なし推測の懸念を挙げた16問をすべて改稿。機能・設定・対象の粒度をそろえ、正答だけが包括的・慎重という構成を減らした。
- **難度**：本文による仕様・結論の先出しを削り、観測と適用範囲を照合させた。本番相当では複数repo、実行環境、承認段階、設定階層等の独立した条件を組み合わせた。単に文章を長くしたことは難化の根拠にしていない。
- **Copilot固有性**：IDE利用データの収集条件、cloud agentのsetup失敗後の挙動、MCPの発見と認証、CLIの/contextに表示されるMCP定義と会話履歴の違いへ焦点を移した。
- **近接テーマ**：ファイル添付・シンボル指定の反復を避け、Web参照キャッシュや主な実行ワークスペースの違いを扱った。
- **反実仮想**：変更後の全文を保存し、選択肢を保ったまま別の正答になるかを再読した。観測を変える際は依存する説明もそろえ、古い目的や制約が残らないようにした。

- **モバイル表示**：長いURLが問題カードの最小幅を広げ、390pxの画面でページが520pxになり、回答操作もずれる例を再現した。カードを縮められるようにし、長い文字列を折り返すCSSへ修正。E2Eも拡張され得るinnerWidthではなく実際のclientWidthと比較するようにした。強制クリックによる回避はしていない。

## 変更しなかった出題枠

| 項目 | 修正前 | 修正後 |
| --- | ---: | ---: |
| 基礎 | 163 | 163 |
| 応用 | 48 | 48 |
| 本番相当 | 43 | 43 |
| D1 | 24 | 24 |
| D2 | 98 | 98 |
| D3 | 33 | 33 |
| D4 | 35 | 35 |
| D5 | 32 | 32 |
| D6 | 32 | 32 |

問題ID、正答ID、表示位置、難度・Domain・Objectiveの分類、出題除外設定は維持した。基礎と出題対象外の旧問題本文は変更していない。保存済み演習の問題スナップショットを置き換える処理は加えていない。今回の修正で在庫のDomain比率や未充足Objectiveまで解消したという評価はしない。

## 検証の意味と限界

これは同じ著者による編集レビューで、初見の受験者を使ったブラインド実験ではない。本文なし推測の確率がゼロ、実試験と難度が等価、といった保証はしない。正答率による難度校正も未実施である。

機械検査の役割は、改稿後のデータ・採点・記録が一致していることの検証。誤答へ3点を付けることや、推論欄が三行あることだけでは品質を証明しない。応用は実際の二段階以上、本番相当は三段階の判断を記録し、各誤答の不適合理由と条件変更例も併記した。

過去の23問・追加問題等のレビューは、当時の文面を残した。旧台帳が通るように昔の根拠を現在の文面へ機械的に移すのではなく、今回のbefore/afterの両指紋が一致するときだけ旧スナップショットへ解決する。未レビューの追加変更では検査が失敗する。

標準Turbopackビルドはこの環境でworker起動エラーになったため、公式CLIの--webpackで検証した。テスト用一時領域と生成フォルダへの書込制限にも対処した。

## 実行済み検証

- 単体テスト：244件成功（23ファイル）。
- 型チェック：成功。
- 本番ビルド：npm run build -- --webpackで成功。
- E2E：16件成功。デスクトップとモバイルで、各91問の表示・横幅・通常クリックによる採点・個別解説・IndexedDBへの保存を検証。演習開始、再演習、模試の遅延解説等も確認。
- 指紋と台帳：現在の問題・解説・条件変更例との整合検査に成功。
- HEADとの差分：問題本文等の変更は76問。基礎163問と出題除外済み141問、Domain・Objective・難度、正答ID、表示順は維持。

## 全91問の個別記録

### q-d3-a13：Seat割当と利用データ

- 難度：応用／D2・d2o4。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：座席一覧と利用集計の区別は機能に沿うが、「個別割当を把握→割当一覧」の一対一の識別。応用の判断材料が少ない。

Copilot Businessの管理担当者が、承認済みの対象者へSeatを追加します。前日の利用レポートには対象者XのIDE活動がありませんが、Xは既に割当済みかもしれません。現在の割当を重複なく確認する処理と、照合キーの組合せはどれですか。APIの読取権限はあります。

- A：Copilot利用レポートを取得し、対象者の最終活動日と照合する
- B：Copilotポリシーを取得し、対象者の利用機能と照合する
- C：Copilot変更の監査記録を取得し、対象者の申請日と照合する
- D：Copilot Seat一覧を取得し、対象者のGitHubアカウントと照合する **【正答】**

**① 選択肢単体の再読**

本文の条件「既に割当済みかもしれません」「現在の割当を重複なく」を外して四案を再読し、各案の操作・範囲・時点を比較した。利用データは活動評価に使う。無活動でもSeatを持つ利用者はいる。 機能ポリシーの有効化と個人へのSeat割当は別である。 変更理由や実施時点の調査には使えるが、申請日だけでは現在の割当を確定できない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 活動なしとSeatなしを区別する。
2. 割当一覧のアカウントを承認対象と照合する。

**③ 条件変更例（同じ4択）**

Copilot Businessの管理担当者が、承認済みの対象者へSeatを追加します。前日の利用レポートには対象者XのIDE活動がありませんが、Xは既に割当済みかもしれません。前日に実際に使ったかを評価する処理と、照合キーの組合せはどれですか。APIの読取権限はあります。

変更後の正答：A。目的が活動評価なら利用レポートを選ぶ。Seat一覧では活動を判定できない。

**④ 決定材料**

「既に割当済みかもしれません」／「現在の割当を重複なく」

**⑤ 誤答の理由**

- A：利用データは活動評価に使う。無活動でもSeatを持つ利用者はいる。
- B：機能ポリシーの有効化と個人へのSeat割当は別である。
- C：変更理由や実施時点の調査には使えるが、申請日だけでは現在の割当を確定できない。

**⑥ 文字長・位置**：正答39文字／誤答中央値31文字＝1.26倍。正答の表示位置D。

出典：[copilot-seat-api](https://docs.github.com/en/rest/copilot/copilot-user-management)、[rest-api](https://docs.github.com/en/rest/copilot)

### q-d1-a21-feature-20261016：組織Spaceの既定アクセス

- 難度：応用／D6・d6o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：No access／viewer／editor／adminは同じ粒度で比較できる。一方、非表示という目的からNo accessを選ぶ定義照合が中心。

組織所有のCopilot Spaceに、非公開repoの資料とアップロード資料があります。一般メンバーXにはSpaceの名前も見せず、管理担当Yには使わせます。Yは既にrepoを閲覧できますが、Spaceの共有には登録されていません。repo権限を変えずに行うSpace側の設定はどれですか。

- A：組織の既定をviewerにし、Yへviewerを付与する
- B：組織の既定をNo accessにし、Yへviewerを付与する **【正答】**
- C：組織の既定をNo accessにし、Yも個別登録しない
- D：組織の既定をeditorにし、Yへviewerを付与する

**① 選択肢単体の再読**

本文の条件「名前も見せず」「共有には登録されていません」を外して四案を再読し、各案の操作・範囲・時点を比較した。全メンバーへのSpace閲覧を認めるためXの条件に合わない。 repo閲覧権限があってもSpaceへの共有が必要である。 全メンバーへの編集アクセスはXの非表示条件に合わない。 独立した受験者の実験ではない。

**② 必要な判断**

1. repoとSpaceのアクセスを分ける。
2. 既定アクセスとYの個別共有を設定する。

**③ 条件変更例（同じ4択）**

組織所有のCopilot Spaceに、非公開repoの資料とアップロード資料があります。一般メンバーXにもSpaceの閲覧だけを認め、管理担当Yには使わせます。Yは既にrepoを閲覧できますが、Spaceの共有には登録されていません。repo権限を変えずに行うSpace側の設定はどれですか。

変更後の正答：A。組織全体への閲覧を認めるなら既定viewerを利用できる。

**④ 決定材料**

「名前も見せず」／「共有には登録されていません」

**⑤ 誤答の理由**

- A：全メンバーへのSpace閲覧を認めるためXの条件に合わない。
- C：repo閲覧権限があってもSpaceへの共有が必要である。
- D：全メンバーへの編集アクセスはXの非表示条件に合わない。

**⑥ 文字長・位置**：正答31文字／誤答中央値28文字＝1.11倍。正答の表示位置B。

出典：[spaces](https://docs.github.com/en/copilot/concepts/context/spaces)

### q-d2-e07-feature-20261016：修正案から実行検証へ進む権限

- 難度：本番相当／D5・d5o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：ツール提供と承認の区別は妥当。ただし本文が編集・実行の両方の不足を明示し、正答だけが両方を追加する。高度な原因切り分けには届かない。

GitHub Copilot CLIでカスタムAgentを使います。プロファイルはtools: [read, search, edit, execute]です。起動オプションは--available-tools=view,grepで、テスト実行用に--allow-tool=shellも指定しました。通常の読取は成功しますが、編集とテストができません。観測に合う原因と、直すべき設定層はどれですか。必要な編集・実行は承認して行います。

- A：Agentのtoolsを省略し、プロファイルの制限を解除する
- B：shellの実行許可を追加し、CLIのツール一覧は維持する
- C：CLIの利用可能ツールへ編集・実行の実ツール名を追加する **【正答】**
- D：Agentのtoolsをreadとsearchへ絞り、許可は維持する

**① 選択肢単体の再読**

本文の条件「tools: [read, search, edit, execute]」「--available-tools=view,grep」を外して四案を再読し、各案の操作・範囲・時点を比較した。プロファイルを広げてもCLI側で利用不能なツールは増えない。 allow-toolは利用可能ツールの一覧を増やさない。 読取専用への縮小では求める編集と実行を行えない。 独立した受験者の実験ではない。

**② 必要な判断**

1. Agent定義とCLIの候補制限を別に読む。
2. 編集・実行が候補から落ちる層を特定する。
3. 候補を修正し、実行許可は別途扱う。

**③ 条件変更例（同じ4択）**

GitHub Copilot CLIでカスタムAgentを使います。プロファイルはtools: [read, search]です。起動時の利用可能ツール制限はなく、テスト実行用に--allow-tool=shellも指定しました。通常の読取は成功しますが、編集とテストができません。観測に合う原因と、直すべき設定層はどれですか。必要な編集・実行は承認して行います。

変更後の正答：A。CLI制限がなくAgentが読取専用なら、Agentのツール制限を外す案で編集・実行を提供できる。

**④ 決定材料**

「tools: [read, search, edit, execute]」／「--available-tools=view,grep」

**⑤ 誤答の理由**

- A：プロファイルを広げてもCLI側で利用不能なツールは増えない。
- B：allow-toolは利用可能ツールの一覧を増やさない。
- D：読取専用への縮小では求める編集と実行を行えない。

**⑥ 文字長・位置**：正答28文字／誤答中央値30文字＝0.93倍。正答の表示位置C。

出典：[feature-refresh-custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration)、[feature-refresh-tools](https://code.visualstudio.com/docs/agents/run/tools)、[feature-refresh-cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)、[cli-tool-permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-d5-a14-feature-20261016：レビューコメントの返信先

- 難度：応用／D5・d5o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：再レビュー・指摘解決・要約・修正依頼は実在の操作。通常返信に返答しない境界は必要だが、Fix with Copilotの起動識別として応用の入口。

GitHub.comでCopilotのレビュー指摘へ返信しましたが、コードは変わりません。指摘はまだ妥当で、人による修正コミットもありません。次はCopilotに修正を委任し、作られた差分を確認してから採用したいと考えています。利用可能なcloud agentへ作業を渡す操作はどれですか。

- A：指摘のFix with Copilotから修正依頼を作る **【正答】**
- B：PRのレビュー担当からCopilotへ再レビューを依頼する
- C：指摘のResolve conversationで対話を解決済みにする
- D：PRのCopilot summaryを更新して変更要約を作る

**① 選択肢単体の再読**

本文の条件「修正コミットもありません」「修正を委任」を外して四案を再読し、各案の操作・範囲・時点を比較した。再レビューは変更を再評価する操作であり、未修正のコードを編集する依頼ではない。 解決済み表示にしてもコードは変更されない。 要約は説明用で、指摘への修正タスクを作らない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 返信とAgentへの修正依頼を区別する。
2. 未修正の指摘をFix with Copilotへ渡す。

**③ 条件変更例（同じ4択）**

GitHub.comでCopilotのレビュー指摘へ通常返信してもコードは変わりませんでした。その後、人が修正コミットをpushしました。今回はその差分をCopilotに再評価してほしく、追加編集は依頼しません。次に使う操作はどれですか。

変更後の正答：B。人が修正した後の評価へ目的を変えたケース。cloud agentの修正依頼という元の問いは残さない。

**④ 決定材料**

「修正コミットもありません」／「修正を委任」

**⑤ 誤答の理由**

- B：再レビューは変更を再評価する操作であり、未修正のコードを編集する依頼ではない。
- C：解決済み表示にしてもコードは変更されない。
- D：要約は説明用で、指摘への修正タスクを作らない。

**⑥ 文字長・位置**：正答28文字／誤答中央値30文字＝0.93倍。正答の表示位置A。

出典：[feature-refresh-review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-sc05-1-feature-20261016：文脈を追加しても実行先は変わらない

- 難度：応用／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：参照資料と実行workspaceの違いを問う。ただし三案がAを維持し、一案だけBを実行先にする構造が目立つ。

VS CodeのAgents windowでAを実行ワークスペースにして開始しました。添付したプロジェクトBのコードも回答に現れますが、変更はAに入ります。今回はBにある同名ファイルを変更し、Aには触れません。参照元と主な変更先を今回の方針へそろえるには、セッションをどう扱いますか。

- A：AのセッションでBを添付し直し、Aの実行先は維持する
- B：AのセッションでBのファイル名を指示し、添付は外す
- C：BのセッションでAを実行先に切り替え、Bを添付する
- D：Bを実行ワークスペースにしたセッションで、Bの資料を使う **【正答】**

**① 選択肢単体の再読**

本文の条件「変更はAに入ります」「Aには触れません」を外して四案を再読し、各案の操作・範囲・時点を比較した。添付をし直しても最初の実行ワークスペースがBにはならない。 ファイル名だけではAの同名ファイルとの区別も実行先の変更も保証しない。 最終的な実行先をAへ戻すと要件と逆になる。 独立した受験者の実験ではない。

**② 必要な判断**

1. 回答に含まれる資料と実行先を区別する。
2. 変更先Bを実行ワークスペースとして選ぶ。

**③ 条件変更例（同じ4択）**

VS CodeのAgents windowでAを実行ワークスペースにして開始しました。添付したプロジェクトBのコードも回答に現れますが、変更はAに入ります。今回はAの実装を変更し、Bは参照するだけです。参照元と主な変更先を今回の方針へそろえるには、セッションをどう扱いますか。

変更後の正答：A。Aを変更するなら既存セッションとBの資料添付を使える。

**④ 決定材料**

「変更はAに入ります」／「Aには触れません」

**⑤ 誤答の理由**

- A：添付をし直しても最初の実行ワークスペースがBにはならない。
- B：ファイル名だけではAの同名ファイルとの区別も実行先の変更も保証しない。
- C：最終的な実行先をAへ戻すと要件と逆になる。

**⑥ 文字長・位置**：正答28文字／誤答中央値25文字＝1.12倍。正答の表示位置D。

出典：[feature-refresh-context](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-d4-e06-feature-20261016：指示のパス条件とAgent除外

- 難度：本番相当／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：applyToの一致とexcludeAgentの対象を照合する点は有効。ただし設定値code-reviewの語義を読むだけに近く、本番相当としては境界域。

Copilotの同じhead branchに二つのパス別指示があります。IはapplyTo: "src/**"、excludeAgent: "code-review"、JはapplyTo: "src/**/*.ts"でexcludeAgent指定なしです。src/api.tsとdocs/api.mdをcloud agentとcode reviewで扱います。指示ファイル自体の読込対象を比較した結果はどれですか。

- A：src/api.tsは実装でJ、レビューでIとJを読み、docsは両方で対象外
- B：src/api.tsは実装でIとJ、レビューでJを読み、docsは両方で対象外 **【正答】**
- C：src/api.tsは実装でIとJ、レビューでIとJを読み、docsは両方で対象外
- D：src/api.tsは実装でIとJ、レビューでJを読み、docsも両方でJを読む

**① 選択肢単体の再読**

本文の条件「excludeAgent: "code-review"」「src/api.tsとdocs/api.md」を外して四案を再読し、各案の操作・範囲・時点を比較した。excludeAgentのcode-reviewをcloud agentへの除外と逆に扱っている。 IのexcludeAgentを無視している。 docs/api.mdはどちらのsrcパターンにも一致しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 二ファイルとapplyToを照合する。
2. IのexcludeAgentをレビューだけへ適用する。
3. 実装とレビューの読込集合を比較する。

**③ 条件変更例（同じ4択）**

Copilotの同じhead branchに二つのパス別指示があります。IはapplyTo: "src/**"、excludeAgent: "cloud-agent"、JはapplyTo: "src/**/*.ts"でexcludeAgent指定なしです。src/api.tsとdocs/api.mdをcloud agentとcode reviewで扱います。指示ファイル自体の読込対象を比較した結果はどれですか。

変更後の正答：A。除外先がcloud-agentならIは実装側から外れ、レビュー側には残る。

**④ 決定材料**

「excludeAgent: "code-review"」／「src/api.tsとdocs/api.md」

**⑤ 誤答の理由**

- A：excludeAgentのcode-reviewをcloud agentへの除外と逆に扱っている。
- C：IのexcludeAgentを無視している。
- D：docs/api.mdはどちらのsrcパターンにも一致しない。

**⑥ 文字長・位置**：正答39文字／誤答中央値40文字＝0.97倍。正答の表示位置B。

出典：[feature-refresh-instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)

### q-d2-e21：Space共有と参照repoの権限

- 難度：本番相当／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：Spaceと参照repoの権限を分ける題材は妥当。ただし403の対象がすべて明示され、実質は二人分の権限対応表の読み取り。

Copilot Spaceにrepo-Rのリンクとアップロード資料Uがあります。BはSpaceでUを読めますがRの内容を使った回答を得られず、Rを直接開いても403です。CはRを直接読めますがSpaceのURLは403です。管理者はUだけを追加公開する案と、Spaceを共有する案を比較しています。必要な権限と、既存資料の共有への影響をどう扱いますか。

- A：BとCはSpace権限を付与し、Rのrepo権限は維持する
- B：BはRのrepo権限、CはSpace権限を付与し、Uの共有は維持する **【正答】**
- C：BとCはRのrepo権限を付与し、Space権限は維持する
- D：BはUを公開し、CはRのrepo権限を付与する

**① 選択肢単体の再読**

本文の条件「Rを直接開いても403」「SpaceのURLは403」を外して四案を再読し、各案の操作・範囲・時点を比較した。Bは既にSpaceを利用できるため元repoの権限不足が残る。 CにはSpaceへの共有不足が残る。 Uの公開はBのrepoアクセスを直さず、CのSpace共有も直さない。 独立した受験者の実験ではない。

**② 必要な判断**

1. Space共有と参照repoの権限を分ける。
2. BとCの403対象を各層へ対応させる。
3. Uの公開範囲を広げず不足する権限だけを補う。

**③ 条件変更例（同じ4択）**

Copilot Spaceにrepo-Rのリンクとアップロード資料Uがあります。BはRを直接読めますがSpaceのURLは403です。CはRを直接読めますがSpaceのURLは403です。管理者はUだけを追加公開する案と、Spaceを共有する案を比較しています。必要な権限と、既存資料の共有への影響をどう扱いますか。

変更後の正答：A。両者がrepoを読めてSpaceだけ開けないなら、両者へのSpace共有が必要になる。

**④ 決定材料**

「Rを直接開いても403」／「SpaceのURLは403」

**⑤ 誤答の理由**

- A：Bは既にSpaceを利用できるため元repoの権限不足が残る。
- C：CにはSpaceへの共有不足が残る。
- D：Uの公開はBのrepoアクセスを直さず、CのSpace共有も直さない。

**⑥ 文字長・位置**：正答34文字／誤答中央値29文字＝1.17倍。正答の表示位置B。

出典：[spaces](https://docs.github.com/en/copilot/concepts/context/spaces)、[guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d3-e07-feature-20261016：Copilotの補完とChatの疎通先

- 難度：本番相当／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：実験対照比較
- 修正前の指摘：失敗した接続先URLが本文にそのままあり、選択肢の同じURLを選べる。応用の診断情報取得問題よりも軽い。

同じ社内端末でCopilotの通常補完は動きますがChatだけ接続できません。認証とSeatは正常です。ネットワーク担当はgithub.comへのブラウザ接続を確認済みです。次にCopilot固有の診断を取得し、失敗した経路だけを調べます。診断の入口と、障害側で確認するping先の組合せはどれですか。

- A：Chat DiagnosticsのReachabilityを取得し、copilot-proxy.githubusercontent.com/_pingを調べる
- B：Extension Logs Folderだけを開き、api.github.comへの接続を調べる
- C：Toggle Developer Toolsだけを開き、github.comへの接続を調べる
- D：Chat DiagnosticsのReachabilityを取得し、api.githubcopilot.com/_pingを調べる **【正答】**

**① 選択肢単体の再読**

本文の条件「通常補完は動きますがChatだけ」「失敗した経路だけ」を外して四案を再読し、各案の操作・範囲・時点を比較した。診断の入口は合うが、通常補完の経路をChat側と取り違えている。 保存ログの取得とGitHub REST APIの確認だけでは目的のChat経路診断にならない。 ブラウザのGitHub疎通は確認済みで、Copilot Chat APIの到達性を代替しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 認証問題と通常のGitHub疎通を除く。
2. Copilot固有の到達性診断を選ぶ。
3. Chat側の接続先を補完側と区別する。

**③ 条件変更例（同じ4択）**

同じ社内端末でCopilotのChatは動きますが通常補完だけ接続できません。認証とSeatは正常です。ネットワーク担当はgithub.comへのブラウザ接続を確認済みです。次にCopilot固有の診断を取得し、失敗した経路だけを調べます。診断の入口と、障害側で確認するping先の組合せはどれですか。

変更後の正答：A。失敗が補完だけなら補完側のping先を調べる。末尾の目的は失敗した経路の調査のままで矛盾しない。

**④ 決定材料**

「通常補完は動きますがChatだけ」／「失敗した経路だけ」

**⑤ 誤答の理由**

- A：診断の入口は合うが、通常補完の経路をChat側と取り違えている。
- B：保存ログの取得とGitHub REST APIの確認だけでは目的のChat経路診断にならない。
- C：ブラウザのGitHub疎通は確認済みで、Copilot Chat APIの到達性を代替しない。

**⑥ 文字長・位置**：正答65文字／誤答中央値49文字＝1.33倍。正答の表示位置D。

出典：[network](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)、[feature-refresh-logs](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/view-logs)

### q-d2-e24：旧ExtensionからMCPへの移行と認可

- 難度：本番相当／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：正答だけが廃止済み経路を離れ、誤答二案が廃止APIの復活を試す。移行先も準備済みと明示され、本番相当の比較が成立しにくい。

旧GitHub App型Copilot ExtensionをMCPへ移行中です。旧Extension経路は廃止済みなので使用しません。通常のGitHub AppによるIssue連携は正常です。MCPのツール一覧には社内検索が現れますが、呼出しは認可待ちで止まります。同じサーバーの公開検索は成功します。次に直す対象と、そのまま維持する経路はどれですか。

- A：MCP社内検索の認可を完了し、GitHub AppのIssue連携は維持する **【正答】**
- B：MCP接続先を変更し、GitHub AppのIssue連携は維持する
- C：MCP検索の入力スキーマを直し、GitHub AppのIssue連携は維持する
- D：GitHub AppのIssue資格情報を更新し、MCP検索の認可は維持する

**① 選択肢単体の再読**

本文の条件「呼出しは認可待ち」「公開検索は成功」を外して四案を再読し、各案の操作・範囲・時点を比較した。同じサーバーで公開検索が成功するため接続先変更を支持しない。 引数不一致ではなく認可待ちという観測に合わない。 正常なIssue連携を修正してもMCPの認可不足は解消しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 廃止経路へ戻さずMCPの障害を診断する。
2. 接続・スキーマ・認可の段階を分ける。
3. 社内検索の認可だけを直しIssue連携を保つ。

**③ 条件変更例（同じ4択）**

旧GitHub App型Copilot ExtensionをMCPへ移行中です。旧Extension経路は廃止済みなので使用しません。通常のGitHub AppによるIssue連携は正常です。MCPのツール一覧には社内検索が現れますが、呼出しは入力スキーマの必須引数不足で止まります。同じサーバーの公開検索は成功します。次に直す対象と、そのまま維持する経路はどれですか。

変更後の正答：C。同じ接続で必須引数不足ならMCPツールの入力定義・呼出引数を直す。

**④ 決定材料**

「呼出しは認可待ち」／「公開検索は成功」

**⑤ 誤答の理由**

- B：同じサーバーで公開検索が成功するため接続先変更を支持しない。
- C：引数不一致ではなく認可待ちという観測に合わない。
- D：正常なIssue連携を修正してもMCPの認可不足は解消しない。

**⑥ 文字長・位置**：正答38文字／誤答中央値38文字＝1.00倍。正答の表示位置A。

出典：[extensions-sunset](https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps/)、[mcp](https://docs.github.com/en/copilot/concepts/context/mcp)、[policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)、[guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d6-a09：IDE収集とSeat管理の違い

- 難度：応用／D2・d2o4。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：未収集を未利用とみなさないという観測一般論で解ける。Copilot固有の収集対象・API項目・条件を照合する問いへ寄せる必要がある。

Copilot Businessの管理者がIDE利用レポートを照合しています。利用者XのSeatは有効で、IDEでもCopilotを使えますが、IDEテレメトリーは無効です。クラウドの割当一覧にはXがいて、IDE活動のレポートにはXがいません。この差を説明するCopilotのデータ源と、利用者単位で追加確認すべき設定はどれですか。

- A：機能利用の許可条件を確認し、Xの組織ポリシーを調べる
- B：Seatの利用資格を確認し、Xの割当状態を調べる
- C：集計対象の期間を確認し、レポートの取得日を調べる
- D：IDE活動の収集条件を確認し、XのIDEテレメトリー設定を調べる **【正答】**

**① 選択肢単体の再読**

本文の条件「IDEテレメトリーは無効」「Seatは有効」を外して四案を再読し、各案の操作・範囲・時点を比較した。機能の利用可否は確認済みであり、IDE収集が無効という原因に対応しない。 Seatが有効なことは確認済みである。 収集しなかったIDEイベントは取得日を変えても得られない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 割当管理とIDEの活動収集を別データ源として読む。
2. IDEの収集設定と活動記録の欠落を照合する。

**③ 条件変更例（同じ4択）**

Copilot Businessの管理者がIDE利用レポートを照合しています。利用者XのSeatは有効で、IDEでもCopilotを使えますが、IDEテレメトリーは無効です。クラウドの割当一覧にはXがいて、IDE活動のレポートにはXがいません。活動欠落とは別に、Xで特定のIDE機能が管理により無効と表示される理由と、その設定元はどれですか。

変更後の正答：A。問いを活動収集ではなく管理による機能制限へ変えれば組織ポリシーの確認が合う。

**④ 決定材料**

「IDEテレメトリーは無効」／「Seatは有効」

**⑤ 誤答の理由**

- A：機能の利用可否は確認済みであり、IDE収集が無効という原因に対応しない。
- B：Seatが有効なことは確認済みである。
- C：収集しなかったIDEイベントは取得日を変えても得られない。

**⑥ 文字長・位置**：正答32文字／誤答中央値24文字＝1.33倍。正答の表示位置D。

出典：[copilot-seat-api](https://docs.github.com/en/rest/copilot/copilot-user-management)、[copilot-metrics-data](https://docs.github.com/en/copilot/reference/metrics-data)、[rest-api](https://docs.github.com/en/rest/copilot)

### q-d2-e11-feature-20261016：レビュー指示のブランチとパス

- 難度：本番相当／D2・d2o3。本文を維持しレビューを更新。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：head/baseの指示差、共通指示、パス適用を組み合わせる。表示順や語調だけで一案に決まらず、Copilot review固有の参照元が必要。

GitHub.comでCopilot code reviewを使います。mainの共通指示は「日本語」、PRのhead branchでは「英語」へ変更しています。head branchのパス別指示にはapplyTo: "src/**/*.ts"と「セキュリティ観点を重視」があります。変更ファイルはsrc/auth/login.tsとdocs/auth.mdです。個人・組織の追加指示はありません。今回のレビューが読む指示の組合せはどれですか。

- A：両ファイルで日本語の共通指示を読み、セキュリティ指示はlogin.tsで読む
- B：両ファイルで英語の共通指示を読み、セキュリティ指示も両ファイルで読む
- C：両ファイルで日本語の共通指示を読み、セキュリティ指示はどちらも読まない
- D：両ファイルで英語の共通指示を読み、セキュリティ指示はlogin.tsで読む **【正答】**

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「PRのhead branchでは「英語」」「src/**/*.ts」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。維持候補の通常Chatでの言語規約分割と異なり、レビューのhead参照と変更ファイル別の適用を同時に判定する。

**② 必要な判断**

1. Copilot code reviewの指示参照元をhead branchと特定する。
2. 共通指示とパス別指示を分け、変更した二ファイルへ照合する。
3. 共通は両方で英語、セキュリティ指示はTypeScriptファイルだけと結論する。

**③ 条件変更例（同じ4択）**

GitHub.comでCopilot code reviewを使います。mainの共通指示は「日本語」、PRのhead branchでは「英語」へ変更しています。head branchのパス別指示にはapplyTo: "**"と「セキュリティ観点を重視」があります。変更ファイルはsrc/auth/login.tsとdocs/auth.mdです。個人・組織の追加指示はありません。今回のレビューが読む指示の組合せはどれですか。

変更後の正答：B。適用パスを全体へ広げれば、英語の共通指示に加えて両ファイルでセキュリティ指示を読む。

**④ 決定材料**

「PRのhead branchでは「英語」」／「src/**/*.ts」

**⑤ 誤答の理由**

- A：パス照合は合っているが、レビュー指示をbase branchのmainから取るという取り違えがある。
- B：headの選択は合っているが、docs/auth.mdはsrc/**/*.tsに一致しない。パス別指示を共通指示として扱っている。
- C：baseの共通指示を選ぶ点も、headにある適合パスの指示を無視する点も誤り。

**⑥ 文字長・位置**：正答37文字／誤答中央値35文字＝1.06倍。正答の表示位置D。

出典：[feature-refresh-review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)、[feature-refresh-instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)

### q-d6-e02-feature-20261016：外部ライセンスによるレビューの制限

- 難度：本番相当／D2・d2o4。本文を維持しレビューを更新。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：認可利用者の個別依頼制限とrulesetの例外を別経路として評価する。独立した仕様を照合する本番相当の候補として残せる。

組織はCopilot code reviewと、Only allow Copilot code review to be triggered by authorized usersを有効にしています。Xは外部で取得した対応ライセンスだけを持ち、この組織が認める利用者ではありません。Xからの個別依頼と、このPRに一致する有効な組織rulesetからの自動レビューについて、起動できる経路の組合せはどれですか。

- A：Xの個人依頼もrulesetの自動レビューも動く
- B：Xの個人依頼は動き、rulesetの自動レビューは止まる
- C：Xの個人依頼もrulesetの自動レビューも止まる
- D：Xの個人依頼は止まり、rulesetの自動レビューは動く **【正答】**

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「外部で取得した対応ライセンスだけ」「有効な組織ruleset」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。Seat有無だけでなく、個人依頼とrulesetの起動経路に対する機能制限を照合する。

**② 必要な判断**

1. Xのライセンス由来と個人依頼、組織rulesetの自動起動を分ける。
2. authorized users制限の対象とrulesetの例外を照合する。
3. 現在の二つの経路の結果は整合しており維持すると結論する。

**③ 条件変更例（同じ4択）**

組織のCopilot code reviewは有効です。Only allow Copilot code review to be triggered by authorized usersは無効です。Xは外部で取得した対応ライセンスを持ちます。PRは有効な組織rulesetの対象です。Xの個別依頼とruleset自動レビューの起動可否はどれですか。

変更後の正答：A。許可利用者限定の設定だけを無効にすると、対応ライセンスのXも個別依頼できる。ruleset起動は引き続き有効である。

**④ 決定材料**

「外部で取得した対応ライセンスだけ」／「有効な組織ruleset」

**⑤ 誤答の理由**

- A：外部ライセンスだけの未認可利用者の個人依頼は制限される。
- B：個人側とruleset側の適用結果を逆に扱っている。
- C：個人側の制限をrulesetの自動レビューにも及ぼしている。

**⑥ 文字長・位置**：正答28文字／誤答中央値25文字＝1.12倍。正答の表示位置D。

出典：[code-review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)、[feature-refresh-review-config](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-d4-a14-feature-20261016：Agentの手動選択だけを認める

- 難度：応用／D2・d2o3。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：手動起動の許可とモデルによる自動委任の禁止を二つの実在設定へ対応させる。四案の設定粒度が揃っている。

CopilotのカスタムAgentを専門タスク用に用意しました。利用者が選択して呼ぶことは認めますが、Copilotが文脈から自動的にそのAgentへ委任するのは止めたい場合、どの定義が合いますか。

- A：disable-model-invocation: false、user-invocable: trueにする
- B：disable-model-invocation: true、user-invocable: trueにする **【正答】**
- C：disable-model-invocation: true、user-invocable: falseにする
- D：disable-model-invocation: false、user-invocable: falseにする

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「利用者が選択して呼ぶことは認め」「自動的にそのAgentへ委任するのは止め」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。Prompt Fileの再利用案の重複を避け、現行のカスタムAgentの起動可否設定へ変更。

**② 必要な判断**

1. 手動起動とモデルからの自動呼出しを分ける。
2. それぞれのbooleanを独立に設定する。
3. 自動のモデル呼出しを止め、利用者の手動選択は認める二つの設定。

**③ 条件変更例（同じ4択）**

CopilotのカスタムAgentを専門タスク用に用意しました。利用者が選択して呼ぶことも、Copilotが文脈から自動委任することも認めます。定義として合うものはどれですか。

変更後の正答：A。手動選択はtrue、自動委任の禁止はfalseへ変わる。

**④ 決定材料**

「利用者が選択して呼ぶことは認め」／「自動的にそのAgentへ委任するのは止め」

**⑤ 誤答の理由**

- A：手動選択は残るが、自動委任も認めるため要件に合わない。
- C：自動委任も手動選択も止まり、手動利用を残す条件に合わない。
- D：手動選択を止め、自動委任を認める逆の構成。

**⑥ 文字長・位置**：正答54文字／誤答中央値55文字＝0.98倍。正答の表示位置B。

出典：[feature-refresh-custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

### q-d5-e03-feature-20261016：セットアップ失敗後のAgent開始

- 難度：本番相当／D5・d5o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：setup失敗後の二つの挙動を知る必要はあるが、三段階の調査ではなく既定動作の想起。応用との境界にある。

Copilot cloud agentのsetupに、依存導入、補助CLI導入、構成ファイル作成の順で三つのstepを置きました。補助CLI導入が非ゼロで終了した後、Agentが実装を始めましたが構成ファイルがありません。チームはAgentのプロンプトに構成作成を追加する案と、setupを直す案を比較しています。既定の実行規則に沿う診断と恒久対処はどれですか。

- A：構成作成stepを新設し、新規タスクのsetupログでその実行を検証する
- B：補助CLIの導入stepを直し、新規タスクのsetupログで後続stepを検証する **【正答】**
- C：依存導入の保存先を直し、新規タスクのsetupログで依存の場所を検証する
- D：Agentの参照パスを直し、新規タスクで作成済み構成の読込先を検証する

**① 選択肢単体の再読**

本文の条件「補助CLI導入が非ゼロ」「構成ファイルがありません」を外して四案を再読し、各案の操作・範囲・時点を比較した。構成作成stepは既に存在し、その前の失敗が原因である。 依存導入の成功後に別stepが失敗しており、保存先誤りの証拠はない。 構成は未作成であり、作成済み構成の参照先だけの問題ではない。 独立した受験者の実験ではない。

**② 必要な判断**

1. setup途中失敗とAgent開始の両観測を照合する。
2. 後続stepの省略を説明する。
3. 環境準備としてsetupを修正し新規タスクで検証する。

**③ 条件変更例（同じ4択）**

Copilot cloud agentのsetupに、依存導入、補助CLI導入、構成ファイル作成の順で三つのstepを置きました。全stepが成功し構成も作成済みですが、Agentは作成先とは異なるパスを参照しています。チームはAgentのプロンプトに構成作成を追加する案と、setupを直す案を比較しています。既定の実行規則に沿う診断と恒久対処はどれですか。

変更後の正答：D。作成済みで参照先だけ違うなら、Agentの参照パスを直す。

**④ 決定材料**

「補助CLI導入が非ゼロ」／「構成ファイルがありません」

**⑤ 誤答の理由**

- A：構成作成stepは既に存在し、その前の失敗が原因である。
- C：依存導入の成功後に別stepが失敗しており、保存先誤りの証拠はない。
- D：構成は未作成であり、作成済み構成の参照先だけの問題ではない。

**⑥ 文字長・位置**：正答41文字／誤答中央値36文字＝1.14倍。正答の表示位置B。

出典：[feature-refresh-setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)、[feature-refresh-sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents)

### q-d6-a11：Git追跡とCopilot除外パターン

- 難度：応用／D6・d6o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：全階層と拡張子をglobへ置き換えるだけ。Copilot固有の適用条件との照合が薄く、基礎寄り。

Copilotの通常補完で、secrets/**/*.keyをコンテンツ除外に登録しました。secrets/readme.mdは参照させます。別途.gitignoreへsecrets/を追加した担当者が「これでCopilot除外も同じ範囲になった」と説明しています。設定の範囲を正しく評価するものはどれですか。

- A：Copilotの除外対象はsecrets配下の全ファイルになる
- B：Copilotの除外対象はsecrets直下の.keyだけになる
- C：Copilotの除外対象はsecrets配下の全階層の.keyになる **【正答】**
- D：Copilotの除外対象はrepo全体の.keyになる

**① 選択肢単体の再読**

本文の条件「secrets/**/*.key」「.gitignore」を外して四案を再読し、各案の操作・範囲・時点を比較した。Git追跡から外すことがそのままCopilot除外にはならない。 **は下位階層も対象にする。 secretsという先頭ディレクトリ条件を無視している。 独立した受験者の実験ではない。

**② 必要な判断**

1. Git追跡とCopilot除外の設定元を分ける。
2. パターンのディレクトリと拡張子の範囲を照合する。

**③ 条件変更例（同じ4択）**

Copilotの通常補完で、secrets/*.keyをコンテンツ除外に登録しました。secrets/readme.mdは参照させます。別途.gitignoreへsecrets/を追加した担当者が「これでCopilot除外も同じ範囲になった」と説明しています。設定の範囲を正しく評価するものはどれですか。

変更後の正答：B。Copilot側のパターンが直下だけになれば下位階層は除外しない。readmeを参照させる条件も保たれる。

**④ 決定材料**

「secrets/**/*.key」／「.gitignore」

**⑤ 誤答の理由**

- A：Git追跡から外すことがそのままCopilot除外にはならない。
- B：**は下位階層も対象にする。
- D：secretsという先頭ディレクトリ条件を無視している。

**⑥ 文字長・位置**：正答34文字／誤答中央値31文字＝1.10倍。正答の表示位置C。

出典：[exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)、[guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-a23：stdio MCPの接続設定

- 難度：応用／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：接続方式・認証・ツール入力という層を区別する題材は妥当。ただしstdioだけと明示され、応用の入口に留まる。

VS CodeでMCPサーバーを登録しました。ツール一覧が空で、出力ログはツール発見前の接続エラーです。サーバーはローカルコマンドで起動でき、HTTPの待受けはありません。mcp.jsonにはurlがありcommandはありません。ツール発見へ進む前に行う修正はどれですか。

- A：HTTP接続としてurlを修正し、サーバーへ接続し直す
- B：接続方式を維持し、呼出時の入力引数だけを修正する
- C：stdio接続としてcommandとargsを登録し、サーバーを起動し直す **【正答】**
- D：接続方式を維持し、ツールのPre-approvalだけを変更する

**① 選択肢単体の再読**

本文の条件「HTTPの待受けはありません」「commandはありません」を外して四案を再読し、各案の操作・範囲・時点を比較した。HTTP待受けがないためURLだけの修正では接続できない。 ツール発見前の失敗をツール呼出引数では直せない。 承認は接続成功後のツール使用に関する設定である。 独立した受験者の実験ではない。

**② 必要な判断**

1. ツール実行前の接続失敗と読む。
2. サーバーの提供するstdio方式へ設定を合わせる。

**③ 条件変更例（同じ4択）**

VS CodeでMCPサーバーを登録しました。ツール一覧が空で、出力ログはツール発見前の接続エラーです。サーバーはHTTPだけを提供し、接続ログに設定URLのポート誤りが出ています。mcp.jsonにはurlがありcommandはありません。ツール発見へ進む前に行う修正はどれですか。

変更後の正答：A。HTTPサーバーでURLが誤っているならURLを直す。

**④ 決定材料**

「HTTPの待受けはありません」／「commandはありません」

**⑤ 誤答の理由**

- A：HTTP待受けがないためURLだけの修正では接続できない。
- B：ツール発見前の失敗をツール呼出引数では直せない。
- D：承認は接続成功後のツール使用に関する設定である。

**⑥ 文字長・位置**：正答37文字／誤答中央値27文字＝1.37倍。正答の表示位置C。

出典：[mcp](https://docs.github.com/en/copilot/concepts/context/mcp)、[mcp-config](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)

### q-sc03-3-feature-20261016：ユーザーPrompt Fileの同期

- 難度：応用／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：自動同期という条件がなく、Settings Syncとユーザー領域への手動コピーの両方が目的を満たす。単一正答の条件を補う必要がある。

VS CodeのLocal harnessで、ユーザー領域に個人用のrelease.prompt.mdを作りました。別PCでも変更を自動同期したい一方、repoへのコミットやファイルの手動配布は行いません。Settings Syncは有効ですが、別PCにはこのプロンプトが現れません。次に確認する設定と保存範囲はどれですか。

- A：Prompts and Instructionsの同期を有効にし、ユーザー領域のまま使う **【正答】**
- B：Filesの同期だけを有効にし、repoの.github/promptsへ移す
- C：Prompts and Instructionsの同期を外し、各PCへ手動コピーする
- D：Settingsの同期だけを有効にし、repoの共通指示へ統合する

**① 選択肢単体の再読**

本文の条件「変更を自動同期」「手動配布は行いません」を外して四案を再読し、各案の操作・範囲・時点を比較した。repo内Prompt Fileの配布はrepoの共有であり個人用同期の代替ではない。 手動配布は禁止され、自動同期の目的も満たさない。 共通指示へ変えると任意実行のPrompt Fileではなくなる。 独立した受験者の実験ではない。

**② 必要な判断**

1. 個人用ファイルの保存範囲を維持する。
2. Sync全体とPrompts and Instructions対象の有効化を分ける。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessでユーザー領域にある個人用Prompt Fileを別PCへ配布します。同期は使わず各PCへ手動コピーする方針で、repoへのコミットはしません。Settings Syncの対象設定と配布方法の組合せはどれですか。

変更後の正答：C。個人用の保存場所を保ち、同期を外して手動コピーする方針へ変更したケースである。

**④ 決定材料**

「変更を自動同期」／「手動配布は行いません」

**⑤ 誤答の理由**

- B：repo内Prompt Fileの配布はrepoの共有であり個人用同期の代替ではない。
- C：手動配布は禁止され、自動同期の目的も満たさない。
- D：共通指示へ変えると任意実行のPrompt Fileではなくなる。

**⑥ 文字長・位置**：正答44文字／誤答中央値39文字＝1.13倍。正答の表示位置A。

出典：[feature-refresh-prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)

### q-d6-e06：公開コード一致のポリシー階層

- 難度：本番相当／D2・d2o4。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：強制Blockと解除できない規則が本文で与えられ、両方Blockを選ぶだけ。Copilotの仕様を知らなくても規則の代入で解ける。

Copilotの公開コード一致ポリシーで、EnterpriseはBlockを強制しています。Org-Aの保存値はAllow、Org-BはBlockです。Aの利用者だけ一致候補が出ないため、担当者はAの保存値の再保存を提案しました。反映と対象アカウントは確認済みです。両組織の実効値と、Aに例外を設ける際の変更先はどれですか。

- A：AはAllow・BはBlockで、Aの値はOrganization側で管理する
- B：AもBもBlockで、Aの例外には個人側のAllow指定が必要
- C：AもBもBlockで、Aの例外にはEnterprise側の制約変更が必要 **【正答】**
- D：AはBlock・BはAllowで、Aの例外にはOrganization側の変更が必要

**① 選択肢単体の再読**

本文の条件「EnterpriseはBlockを強制」「Org-Aの保存値はAllow」を外して四案を再読し、各案の操作・範囲・時点を比較した。組織の保存値をそのまま実効値にしており上位強制を見落としている。 個人設定でも上位強制を解除できない。 BをAllowにする根拠がなく、Aの下位設定変更だけでも例外を作れない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 保存値と強制される実効値を区別する。
2. 両組織へ上位ポリシーを適用する。
3. 下位設定では例外を作れないと判定する。

**③ 条件変更例（同じ4択）**

Copilotの公開コード一致ポリシーでEnterpriseはOrganizationへ選択を委任しています。Org-AはAllow、Org-BはBlockで、反映は確認済みです。両組織の実効値と、Aの値を管理する階層はどれですか。

変更後の正答：A。上位が選択を委任した場合は組織の値を使う。Aで候補が出ないという元の障害観測を残していない。

**④ 決定材料**

「EnterpriseはBlockを強制」／「Org-Aの保存値はAllow」

**⑤ 誤答の理由**

- A：組織の保存値をそのまま実効値にしており上位強制を見落としている。
- B：個人設定でも上位強制を解除できない。
- D：BをAllowにする根拠がなく、Aの下位設定変更だけでも例外を作れない。

**⑥ 文字長・位置**：正答36文字／誤答中央値39文字＝0.92倍。正答の表示位置C。

出典：[policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies)、[public-code](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d5-e06-feature-20261016：draftと追加pushの自動レビュー

- 難度：本番相当／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：draftは対象外・追加pushも対象外という要望を二つの真偽値へ直訳している。本番相当の分析負荷がない。

GitHub.comでCopilotの自動レビューをrulesetだけから起動します。通常PRでは初回に動き、draft作成時にも動きますが、レビュー後のpushでは動きません。通常PRの初回と追加pushを対象にし、draft作成時は対象から外す方針です。既存PRへの個別依頼は増やしません。rulesetのどの変更を組み合わせますか。

- A：Review draft pull requestsを有効、Review new pushesを無効にする
- B：Review draft pull requestsを無効、Review new pushesを有効にする **【正答】**
- C：Review draft pull requestsを無効、Review new pushesも無効にする
- D：Review draft pull requestsを有効、Review new pushesも有効にする

**① 選択肢単体の再読**

本文の条件「rulesetだけ」「初回と追加pushを対象」を外して四案を再読し、各案の操作・範囲・時点を比較した。現状に近い設定で、変更したい二つの動作を直せない。 draftは除けるが追加pushのレビューが始まらない。 追加pushは直るがdraft作成時の起動が残る。 独立した受験者の実験ではない。

**② 必要な判断**

1. 観測から初回・draft・pushのイベントを分ける。
2. 二つのオプションと方針を照合する。
3. 起動源を増やさずrulesetを修正する。

**③ 条件変更例（同じ4択）**

GitHub.comでCopilotの自動レビューをrulesetだけから起動します。通常PRでは初回に動き、draft作成時にも動きますが、レビュー後のpushでは動きません。通常PRの初回だけを対象にし、draft作成時と追加pushは対象から外す方針です。既存PRへの個別依頼は増やしません。rulesetのどの変更を組み合わせますか。

変更後の正答：C。追加pushも不要なら両オプションを無効にする。

**④ 決定材料**

「rulesetだけ」／「初回と追加pushを対象」

**⑤ 誤答の理由**

- A：現状に近い設定で、変更したい二つの動作を直せない。
- C：draftは除けるが追加pushのレビューが始まらない。
- D：追加pushは直るがdraft作成時の起動が残る。

**⑥ 文字長・位置**：正答53文字／誤答中央値53文字＝1.00倍。正答の表示位置B。

出典：[feature-refresh-review-config](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-d1-e02-feature-20261016：コード参照を取るタイミング

- 難度：本番相当／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：実験対照比較
- 修正前の指摘：Qだけに参照が出たと本文が先に示し、正答はQの記録。採用時だけ記録する仕様を推論する前に結論が分かる。

VS CodeでCopilotの公開コード一致を許可しています。候補Pは表示後に破棄し、候補Qは編集せず採用しました。監査担当は、採用履歴の参照情報からPとQそれぞれの公開コード一致と、コードの安全性を証明しようとしています。この履歴の取得範囲と、証明できる内容の組合せはどれですか。

- A：PとQの採用時の一致参照を確認できるが、安全性全般は証明しない
- B：Qの採用時の一致参照を確認でき、その参照でPも安全だと証明する
- C：Qの採用時の一致参照を確認できるが、Pの判定や安全性全般は証明しない **【正答】**
- D：PとQの採用時の一致参照を確認でき、両者の安全性も証明する

**① 選択肢単体の再読**

本文の条件「Pは表示後に破棄」「Qは編集せず採用」を外して四案を再読し、各案の操作・範囲・時点を比較した。採用していない候補も採用時の参照履歴から調べられるという取り違えがある。 Qの一致情報はPにも安全性全般にも外挿できない。 非採用Pの記録と安全性保証の両方を過大評価している。 独立した受験者の実験ではない。

**② 必要な判断**

1. 表示と採用を区別する。
2. コード参照の記録対象をQに限定する。
3. 一致参照と安全性の保証を区別する。

**③ 条件変更例（同じ4択）**

VS CodeでCopilotの公開コード一致を許可しています。候補Pも編集せず採用し、候補Qは編集せず採用しました。監査担当は、採用履歴の参照情報からPとQそれぞれの公開コード一致と、コードの安全性を証明しようとしています。この履歴の取得範囲と、証明できる内容の組合せはどれですか。

変更後の正答：A。Pも採用した場合は両候補の採用時の一致参照を確認できる。安全性保証は依然できない。

**④ 決定材料**

「Pは表示後に破棄」／「Qは編集せず採用」

**⑤ 誤答の理由**

- A：採用していない候補も採用時の参照履歴から調べられるという取り違えがある。
- B：Qの一致情報はPにも安全性全般にも外挿できない。
- D：非採用Pの記録と安全性保証の両方を過大評価している。

**⑥ 文字長・位置**：正答34文字／誤答中央値31文字＝1.10倍。正答の表示位置C。

出典：[public-code](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-sc06-3：個人指示とrepo規約の競合分離

- 難度：応用／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：正答だけが各repoの規約を保持し、他案はR/Sの規約を変えるか競合を残す。正答の配慮のよさが手掛かりになる。

GitHub.comの個人指示に「日本語で回答」「全関数へJSDoc」を書いています。repo-Rは公開APIだけ、repo-Sは全関数がJSDoc規約で、各repoに設定済みです。日本語は両repoに共通する個人の希望ですが、RでJSDoc規約が競合します。repo規約を変えず、二つの個人指示をどう整理しますか。

- A：個人はJSDocだけ残し、日本語はRとSのrepo指示へ委ねる
- B：個人は日本語だけ残し、JSDocはRとSのrepo指示へ委ねる **【正答】**
- C：個人は両方残し、RとSのrepo指示からJSDocを外す
- D：個人は両方外し、RとSのrepo指示のJSDocだけを使う

**① 選択肢単体の再読**

本文の条件「日本語は両repoに共通」「RでJSDoc規約が競合」「repo規約を変えず」を外して四案を再読し、各案の操作・範囲・時点を比較した。日本語の個人希望を失い、Rで競合するJSDoc条件も残る。 Rを全関数へ変えることになりrepo規約を維持できない。 JSDocは整うが個人の日本語希望が失われる。 独立した受験者の実験ではない。

**② 必要な判断**

1. 二つの指示のうち共通化できるものを分ける。
2. repoごとに異なる規約だけを個人指示から外す。

**③ 条件変更例（同じ4択）**

GitHub.comの個人指示に「日本語で回答」「全関数へJSDoc」を書いています。repo-Rは公開APIだけ、repo-Sは全関数がJSDoc規約で、各repoに設定済みです。今後は回答言語を個人指示で指定しない方針です。RではJSDoc規約が競合します。repo規約を変えず、二つの個人指示をどう整理しますか。

変更後の正答：D。個人側に日本語を残す要件を外し、言語は指定しない方針へ変えたため、個人の二条件を外してrepoのJSDocだけを使う。

**④ 決定材料**

「日本語は両repoに共通」／「RでJSDoc規約が競合」／「repo規約を変えず」

**⑤ 誤答の理由**

- A：日本語の個人希望を失い、Rで競合するJSDoc条件も残る。
- C：Rを全関数へ変えることになりrepo規約を維持できない。
- D：JSDocは整うが個人の日本語希望が失われる。

**⑥ 文字長・位置**：正答31文字／誤答中央値29文字＝1.07倍。正答の表示位置B。

出典：[personal-instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-personal-instructions)、[instructions](https://docs.github.com/en/copilot/concepts/prompting/response-customization)、[guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

### q-d2-e15-feature-20261016：カスタムAgentの空のツール一覧

- 難度：応用／D2・d2o3。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：一般Agentでは使えるのに特定Agentではtools: []という差を捉え、最小の検索ツールだけを供給する判断は応用として成立する。

CopilotのカスタムAgent「文章整理」で、接続済みのMCP検索を使えません。一般のAgentでは同じMCP検索が使え、認証も成功します。「文章整理」のプロファイルにはtools: []があります。検索だけを利用可能にし、編集・実行は使わせない変更はどれですか。

- A：tools自体を省略し、既定の全ツールを利用可能にする
- B：toolsを空配列にして、ツールを利用不可にする
- C：toolsへ必要な検索ツールだけを明示する **【正答】**
- D：toolsへreadだけを明示し、ファイル読取に限定する

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「tools: []」「検索だけ」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。読取専用の新規構成ではなく、特定Agentだけ使えない状態の切分けを扱う。

**② 必要な判断**

1. 接続や認証でなくAgent固有のツール制限と特定する。
2. 空配列を必要な検索の列挙へ変更する。
3. 検索だけを利用可能にするには対象ツールを明示する。

**③ 条件変更例（同じ4択）**

CopilotのカスタムAgent「文章整理」で、接続済みのMCP検索を使えません。一般のAgentでは同じMCP検索が使え、認証も成功します。「文章整理」のプロファイルにはtools: []があります。接続済みの全ツールを既定どおり利用可能にする変更はどれですか。

変更後の正答：A。全ツールを利用可能にしてよいならtools省略が合う。

**④ 決定材料**

「tools: []」／「検索だけ」

**⑤ 誤答の理由**

- A：省略時は全ツールになり、必要な検索だけの最小構成ではない。
- B：空配列はツールなしを表し、必要な検索も使えない。
- D：ファイルを読むツールだけでは、必要な検索ツールを提供しない。

**⑥ 文字長・位置**：正答21文字／誤答中央値27文字＝0.78倍。正答の表示位置C。

出典：[feature-refresh-custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

### q-d6-a13-feature-20261016：ファイルを限定した除外と大小文字

- 難度：応用／D6・d6o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：大文字小文字を区別しない仕様が与えられ、正答は本文の完全パスそのもの。case-insensitiveの知識を測れていない。

Copilot通常補完で、private/SECRETS.ENVが除外されています。管理者の設定はrepo直下の/private/secrets.envだけです。別フォルダのsecrets.envは参照でき、private/readme.mdも参照できます。この結果を設定エラーと判断する前に確認すべき、パターンの性質はどれですか。

- A：大文字小文字を区別しないため、指定した一つのパスに一致する **【正答】**
- B：ファイル名だけで照合するため、すべてのsecrets.envに一致する
- C：拡張子だけで照合するため、すべての.envファイルに一致する
- D：ディレクトリだけで照合するため、private配下全体に一致する

**① 選択肢単体の再読**

本文の条件「private/SECRETS.ENV」「/private/secrets.envだけ」を外して四案を再読し、各案の操作・範囲・時点を比較した。別フォルダが参照可能という観測とも、指定パスのスコープとも合わない。 拡張子だけのパターンではない。 readmeは参照でき、ディレクトリ全体の除外ではない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 表記の大小差とパスの場所を別に照合する。
2. 大小非区別による一致を設定エラーと区別する。

**③ 条件変更例（同じ4択）**

Copilot通常補完で、private/SECRETS.ENVが除外されています。管理者の設定はファイル名secrets.envです。別フォルダのsecrets.envも除外され、private/readme.mdも参照できます。この結果を設定エラーと判断する前に確認すべき、パターンの性質はどれですか。

変更後の正答：B。場所を限定しないファイル名パターンなら同名ファイルを別フォルダでも除外する。

**④ 決定材料**

「private/SECRETS.ENV」／「/private/secrets.envだけ」

**⑤ 誤答の理由**

- B：別フォルダが参照可能という観測とも、指定パスのスコープとも合わない。
- C：拡張子だけのパターンではない。
- D：readmeは参照でき、ディレクトリ全体の除外ではない。

**⑥ 文字長・位置**：正答29文字／誤答中央値32文字＝0.91倍。正答の表示位置A。

出典：[exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d3-a17：入力除外と公開コード一致の出力制御

- 難度：応用／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：入力・接続・出力フィルタを同条件比較から分ける構成は妥当。ただし変えた設定名が直接正答を示し、応用の入口。

Copilot通常補完の候補が出なくなりました。通常のファイルAと除外登録済みファイルBを使って同じモデルで確認すると、Aは公開コード一致をAllowにしたときだけ候補が出ます。Bは設定を切り替えても除外表示のままです。認証と到達性は正常です。AとBの現象をどの層へ分けますか。

- A：Aは公開コード一致の出力制御、BはContent Exclusionの入力制御 **【正答】**
- B：AもBも公開コード一致の出力制御
- C：AもBもContent Exclusionの入力制御
- D：AはContent Exclusionの入力制御、Bは公開コード一致の出力制御

**① 選択肢単体の再読**

本文の条件「Aは公開コード一致をAllowにしたときだけ」「Bは設定を切り替えても除外表示」を外して四案を再読し、各案の操作・範囲・時点を比較した。公開コード一致の設定でBの除外表示は解除されない。 Aには一致設定による差があり、入力除外だけでは説明できない。 入力・出力それぞれの観測を逆に対応させている。 独立した受験者の実験ではない。

**② 必要な判断**

1. 対照試行で変化したものと固定されたものを分ける。
2. 出力の一致制御と入力除外へ対応させる。

**③ 条件変更例（同じ4択）**

Copilot通常補完を同じモデルで比較します。Aは除外未登録、Bは以前の除外を解除済みです。どちらも公開コード一致をAllowにしたときだけ同じ候補が出ます。認証と到達性は正常です。AとBの現象をどの層へ分けますか。

変更後の正答：B。Bの入力除外が解除済みという状態へそろえたため、両方が出力の一致制御による差になる。

**④ 決定材料**

「Aは公開コード一致をAllowにしたときだけ」／「Bは設定を切り替えても除外表示」

**⑤ 誤答の理由**

- B：公開コード一致の設定でBの除外表示は解除されない。
- C：Aには一致設定による差があり、入力除外だけでは説明できない。
- D：入力・出力それぞれの観測を逆に対応させている。

**⑥ 文字長・位置**：正答39文字／誤答中央値26文字＝1.50倍。正答の表示位置A。

出典：[responsible](https://docs.github.com/en/copilot/responsible-use/inline-suggestions)、[public-code](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d6-a01：複製先repoの除外範囲

- 難度：応用／D6・d6o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：Bのrepo識別とパスを含む案だけが目的に沿い、gitignore・公開一致・Aの細分化が誤答。応用としても推測と消去が容易。

Copilotの組織除外で、repo-Aのsecrets/を設定しました。同じEnterpriseのrepo-Bへコードを複製すると、Bでは通常補完が使えます。AとBのhostは同じですがrepo pathは異なります。Bでもsecrets/だけを除外し、Bの他のファイルは残します。追加する組織ルールはどれですか。

- A：repo-Bをキーにし、secrets/**を対象にする **【正答】**
- B：repo-Bをキーにし、secrets/*.keyを対象にする
- C：repo-Aをキーにし、secrets/**を対象にする
- D：repo-Aをキーにし、secrets/*.keyを対象にする

**① 選択肢単体の再読**

本文の条件「repo pathは異なります」「secrets/だけ」を外して四案を再読し、各案の操作・範囲・時点を比較した。Bは識別できるが直下の.keyだけとなりsecrets配下全体を除外できない。 Aのルールを再設定しても異なるrepo pathのBへは適用されない。 repoの場所も対象パスの範囲も要件に合わない。 独立した受験者の実験ではない。

**② 必要な判断**

1. コード内容の一致とrepo識別を分ける。
2. Bのrepoキーと限定パスを組み合わせる。

**③ 条件変更例（同じ4択）**

Copilotの組織除外で、repo-Aのsecrets/を設定しました。同じEnterpriseのrepo-Bへコードを複製すると、Bでは通常補完が使えます。AとBのhostは同じですがrepo pathは異なります。Bではsecrets直下の.keyだけを除外し、下位階層と他のファイルは残します。追加する組織ルールはどれですか。

変更後の正答：B。Bの直下.keyだけならBキーのsecrets/*.keyが合う。

**④ 決定材料**

「repo pathは異なります」／「secrets/だけ」

**⑤ 誤答の理由**

- B：Bは識別できるが直下の.keyだけとなりsecrets配下全体を除外できない。
- C：Aのルールを再設定しても異なるrepo pathのBへは適用されない。
- D：repoの場所も対象パスの範囲も要件に合わない。

**⑥ 文字長・位置**：正答28文字／誤答中央値31文字＝0.90倍。正答の表示位置A。

出典：[exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d5-e08-feature-20261016：レビュー深度の実効設定

- 難度：本番相当／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：今回の明示指定がそのまま正答で、組織・repo・前回値が結論に寄与しない。今回値と直近値が食い違う二案も不自然。

Copilot code reviewの深度は組織既定Lite、repo既定Balancedです。PR-Pは以前Liteでレビュー済み、PR-Qは未レビューです。今回はどちらも深度を明示せずレビューを依頼します。利用できる深度は確認済みです。PとQで選ばれる値と、PをBalancedでレビューするための操作の組合せはどれですか。

- A：PもQもBalancedで、今回の依頼では深度を指定しない
- B：PもQもLiteで、Pの依頼時にBalancedを指定する
- C：PはBalanced、QはLiteで、今回の依頼では深度を指定しない
- D：PはLite、QはBalancedで、Pの依頼時にBalancedを指定する **【正答】**

**① 選択肢単体の再読**

本文の条件「PR-Pは以前Lite」「PR-Qは未レビュー」を外して四案を再読し、各案の操作・範囲・時点を比較した。既存PRの直近値を飛ばしてrepo既定を優先している。 未レビューQでもrepo既定より組織既定が優先するわけではない。 PとQの既定選択を逆にしておりP変更の目的にも合わない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 既存PRと初回PRの既定参照先を分ける。
2. 直近値とrepo既定をそれぞれ照合する。
3. 単一依頼の明示指定でPだけを変更する。

**③ 条件変更例（同じ4択）**

Copilot code reviewの深度は組織既定Lite、repo既定Balancedです。PR-PもPR-Qも未レビューです。今回はどちらも深度を明示せずレビューを依頼します。利用できる深度は確認済みです。PとQで選ばれる値と、PをBalancedでレビューするための操作の組合せはどれですか。

変更後の正答：A。両方が初回ならrepo既定Balancedを使う。Pも既に目的のBalancedになるため今回の明示指定は不要。

**④ 決定材料**

「PR-Pは以前Lite」／「PR-Qは未レビュー」

**⑤ 誤答の理由**

- A：既存PRの直近値を飛ばしてrepo既定を優先している。
- B：未レビューQでもrepo既定より組織既定が優先するわけではない。
- C：PとQの既定選択を逆にしておりP変更の目的にも合わない。

**⑥ 文字長・位置**：正答38文字／誤答中央値29文字＝1.31倍。正答の表示位置D。

出典：[code-review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)、[feature-refresh-review-config](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-d6-e03-feature-20261016：レビュー対象除外と公開一致フィルタ

- 難度：本番相当／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：実験対照比較
- 修正前の指摘：除外を外す・Blockを維持するという要望を四択の真偽表へ移すだけ。入力除外と出力フィルタの区別は応用には使える。

Copilot code reviewでlegacy.tsだけがレビューされません。同じ利用者はファイルを閲覧でき、他ファイルのレビューは成功します。通常補完にはlegacy.tsの除外表示が出ています。機密解除済みのlegacy.tsをレビューへ戻しつつ、通常補完の公開コード一致は引き続き抑えます。管理すべき二つの設定と、その変更方向はどれですか。

- A：legacy.tsのContent Exclusionを保ち、公開コード一致をAllowへ変える
- B：legacy.tsのContent Exclusionを解除し、公開コード一致もAllowへ変える
- C：legacy.tsのContent Exclusionを保ち、公開コード一致のBlockも保つ
- D：legacy.tsのContent Exclusionを解除し、公開コード一致のBlockを保つ **【正答】**

**① 選択肢単体の再読**

本文の条件「通常補完にはlegacy.tsの除外表示」「公開コード一致は引き続き抑えます」を外して四案を再読し、各案の操作・範囲・時点を比較した。入力除外が残るためレビュー復帰せず、抑制したい出力まで緩める。 レビュー復帰はできるが公開コード一致を抑える要件に合わない。 公開コード一致は保てるがレビュー対象へ戻らない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 閲覧権限とCopilotの入力除外を分ける。
2. レビュー失敗をContent Exclusionへ対応させる。
3. 出力のBlockを維持して入力だけ戻す。

**③ 条件変更例（同じ4択）**

Copilot code reviewでlegacy.tsだけがレビューされません。同じ利用者はファイルを閲覧でき、他ファイルのレビューは成功します。通常補完にはlegacy.tsの除外表示が出ています。legacy.tsは機密のため除外を保ち、通常補完では公開コード一致を許す方針です。管理すべき二つの設定と、その変更方向はどれですか。

変更後の正答：A。機密の入力除外を維持し、一致出力だけ許可するなら別の組合せになる。

**④ 決定材料**

「通常補完にはlegacy.tsの除外表示」／「公開コード一致は引き続き抑えます」

**⑤ 誤答の理由**

- A：入力除外が残るためレビュー復帰せず、抑制したい出力まで緩める。
- B：レビュー復帰はできるが公開コード一致を抑える要件に合わない。
- C：公開コード一致は保てるがレビュー対象へ戻らない。

**⑥ 文字長・位置**：正答48文字／誤答中央値48文字＝1.00倍。正答の表示位置D。

出典：[exclusion-concept](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)、[public-code](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-d4-e07-feature-20261016：Agent定義のクライアント依存項目

- 難度：本番相当／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：cloudのAgent定義とVS CodeのMCP接続の差はよい題材。ただしtoolsは既に正しく、空にする誤答二件が弱い。

cloud agentのカスタムAgentをVS Codeへ移しました。定義にはmcp-serversとtools: [read, catalog/search]があります。VS Code側のMCP一覧にはcatalogがなく、同じAgentで内蔵読取だけは使えます。今後はcatalog/searchだけを追加し、既存のツール制限は保ちます。接続定義とツール定義をどの順で扱いますか。

- A：Agentのmcp-serversだけを再保存し、Agentのtools指定を維持する
- B：VS CodeのMCP設定へcatalogを登録し、Agentのtoolsを空配列にする
- C：Agentのmcp-serversだけを再保存し、Agentのtools指定を省略する
- D：VS CodeのMCP設定へcatalogを登録し、Agentのtools指定を維持する **【正答】**

**① 選択肢単体の再読**

本文の条件「MCP一覧にはcatalogがなく」「既存のツール制限は保ちます」を外して四案を再読し、各案の操作・範囲・時点を比較した。VS Code側に接続がないままである。 tools: []はツールを使わせないため検索も提供できない。 接続がないうえ、ツール制限の維持にも合わない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 接続設定とツール提供の失敗を分ける。
2. クライアントごとのMCP定義場所を照合する。
3. VS Code接続を作りAgent側の最小ツール指定を保つ。

**③ 条件変更例（同じ4択）**

cloud agentのカスタムAgentをVS Codeへ移しました。定義にはmcp-serversとtools: [read, catalog/search]があります。VS Code側のMCP一覧にはcatalogがなく、同じAgentで内蔵読取だけは使えます。今回はMCP接続の登録だけを行い、このAgentには全ツールを提供しない方針です。接続定義とツール定義をどの順で扱いますか。

変更後の正答：B。接続を登録しつつAgentの全ツールを止める目的ならtools: []が合う。元の検索利用要件は明示的に置き換えている。

**④ 決定材料**

「MCP一覧にはcatalogがなく」／「既存のツール制限は保ちます」

**⑤ 誤答の理由**

- A：VS Code側に接続がないままである。
- B：tools: []はツールを使わせないため検索も提供できない。
- C：接続がないうえ、ツール制限の維持にも合わない。

**⑥ 文字長・位置**：正答44文字／誤答中央値43文字＝1.02倍。正答の表示位置D。

出典：[feature-refresh-custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration)、[mcp-config](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)

### q-d1-a10-feature-20261016：CLIの継続実行と権限

- 難度：応用／D2・d2o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：正答だけがAutopilotという実行方式を挙げ、既存許可と別という解説まで含む。他三案は通常モードの許可変更なので正答が目立つ。

GitHub Copilot CLIで既に必要なツールを許可しました。依頼した最初の作業は実行されますが、次のサブタスクへ進む前に利用者の入力を待ちます。追加のディレクトリアクセスは不要です。ツールの承認と、複数ターンの自律的な継続を分けて考えると、次に試す変更はどれですか。

- A：Autopilotへ切り替え、継続するターン数も必要に応じて制限する **【正答】**
- B：allow-all-toolsを追加し、実行前のツール確認だけを省略する
- C：available-toolsを追加し、モデルが選べるツールだけを増やす
- D：add-dirを追加し、読み書きできるディレクトリだけを増やす

**① 選択肢単体の再読**

本文の条件「次のサブタスクへ進む前」「必要なツールを許可」を外して四案を再読し、各案の操作・範囲・時点を比較した。ツール確認を省いても通常モードの継続方式は変わらない。 必要なツールは既にあり、候補追加で次ターンの待機を直さない。 ディレクトリアクセスは今回の不足ではない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 停止がツール承認待ちかターン継続待ちかを区別する。
2. CLIのAutopilotを選び継続範囲を管理する。

**③ 条件変更例（同じ4択）**

GitHub Copilot CLIのAutopilotでサブタスク間の継続は成功しますが、各ツールの実行承認だけが毎回必要です。隔離した環境で利用可能な全ツールの自動承認を許可する方針です。候補ツールとアクセス先は足りています。次に変える設定はどれですか。

変更後の正答：B。継続ではなく実行承認が不足するケースである。利用可能な全ツールの確認抑制にはallow-all-toolsを使う。

**④ 決定材料**

「次のサブタスクへ進む前」／「必要なツールを許可」

**⑤ 誤答の理由**

- B：ツール確認を省いても通常モードの継続方式は変わらない。
- C：必要なツールは既にあり、候補追加で次ターンの待機を直さない。
- D：ディレクトリアクセスは今回の不足ではない。

**⑥ 文字長・位置**：正答34文字／誤答中央値36文字＝0.94倍。正答の表示位置A。

出典：[feature-refresh-autopilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/use-autopilot-mode)、[cli-tool-permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-d2-a24：共通指示と任意実行Prompt File

- 難度：応用／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：常時指示と任意実行のPrompt Fileの分類が中心。さらにクライアントとLocal harnessの前提がない。

VS CodeのLocal harnessで、repoの共通指示に開発規約とリリースノート作成手順を置いています。コードだけを修正する依頼でもノート生成が始まります。開発規約は常時読み、ノート作成は利用者が選んだときだけ実行し、手順はチームで共有します。配置の変更はどれですか。

- A：規約は共通指示に残し、ノート手順をapplyTo: "**"の指示へ移す
- B：規約をPrompt Fileへ移し、ノート手順を共通指示に残す
- C：規約は共通指示に残し、ノート手順をユーザー領域だけへ移す
- D：規約は共通指示、ノート手順は.github/promptsへ分ける **【正答】**

**① 選択肢単体の再読**

本文の条件「Local harness」「利用者が選んだときだけ」「チームで共有」を外して四案を再読し、各案の操作・範囲・時点を比較した。全パスに適用する指示は任意実行への分離にならない。 常時使う対象と任意実行する対象が逆である。 個人用保存だけではrepoを通じたチーム共有がなくなる。 独立した受験者の実験ではない。

**② 必要な判断**

1. 自動適用と任意実行の違いを整理する。
2. 共有範囲に合うrepoのPrompt Fileへ移す。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessで、repoの共通指示に開発規約とリリースノート作成手順を置いています。コードだけを修正する依頼でもノート生成が始まります。開発規約は常時読み、ノート作成は利用者が選んだときだけ実行し、手順は自分だけが使いチームには配布しません。配置の変更はどれですか。

変更後の正答：C。個人専用ならユーザー領域のPrompt Fileへ分離できる。

**④ 決定材料**

「Local harness」／「利用者が選んだときだけ」／「チームで共有」

**⑤ 誤答の理由**

- A：全パスに適用する指示は任意実行への分離にならない。
- B：常時使う対象と任意実行する対象が逆である。
- C：個人用保存だけではrepoを通じたチーム共有がなくなる。

**⑥ 文字長・位置**：正答33文字／誤答中央値31文字＝1.06倍。正答の表示位置D。

出典：[instructions](https://docs.github.com/en/copilot/concepts/prompting/response-customization)、[prompt-files](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)

### q-sc10-3-feature-20261016：repo参照のプロトコルとポート

- 難度：本番相当／D6・d6o1。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：同じrepoと明示したうえでURL表記差を問う。プロトコル正規化の一仕様の適用で、本番相当より応用寄り。

組織のCopilot除外でgit@host.example:team/repo.gitのsecrets/**を登録しました。Pのremoteはhttps://host.example/team/repo、Qはssh://user@host.example:2222/team/repo.git、Rはhttps://host.example/team/forkです。対応する通常補完を使い、全員のファイルパスと設定反映は同じです。除外が適用されるcloneの組合せはどれですか。

- A：Qだけに適用され、PとRにはこのrepoルールは適用されない
- B：PとRに適用され、Qにはこのrepoルールは適用されない
- C：PとQに適用され、Rにはこのrepoルールは適用されない **【正答】**
- D：PとQとRに適用され、この三つは同じrepoとして扱われる

**① 選択肢単体の再読**

本文の条件「team/repo.git」「team/fork」を外して四案を再読し、各案の操作・範囲・時点を比較した。HTTPSという表記差だけでPを別repoとする誤りである。 Qの表記差とRの異なるrepo pathを逆に評価している。 同じhostだけでは異なるrepoへ同一ルールは適用されない。 独立した受験者の実験ではない。

**② 必要な判断**

1. remoteのhostとrepo pathを比較する。
2. 正規化される表記差と実際の別repoを分ける。
3. パス一致とrepo一致の両方で対象を決める。

**③ 条件変更例（同じ4択）**

組織のCopilot除外でgit@host.example:team/repo.gitのsecrets/**を登録しました。Pのremoteはhttps://host.example/team/repo、Qはssh://user@host.example:2222/team/repo.git、Rはhttps://host.example/team/repo.gitです。対応する通常補完を使い、全員のファイルパスと設定反映は同じです。除外が適用されるcloneの組合せはどれですか。

変更後の正答：D。Rも同じrepo pathなら三者へ適用される。

**④ 決定材料**

「team/repo.git」／「team/fork」

**⑤ 誤答の理由**

- A：HTTPSという表記差だけでPを別repoとする誤りである。
- B：Qの表記差とRの異なるrepo pathを逆に評価している。
- D：同じhostだけでは異なるrepoへ同一ルールは適用されない。

**⑥ 文字長・位置**：正答28文字／誤答中央値29文字＝0.97倍。正答の表示位置C。

出典：[exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d1-e08-feature-20261016：Copilotレビューの承認カウント

- 難度：本番相当／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：両設定が無効、両方を有効にしたいという要望の直訳。承認機能のpreview条件は明示されているが、それ自体で難度は上がらない。

Copilot approvalsのpublic previewを利用できるrepoで、CopilotがApproveを出しました。しかし必須承認数は減りません。上位の設定は利用を許可し、人による必須承認の設定は維持します。自動レビューは既に動きます。この観測から不足する設定と、変更後も別に満たす要件はどれですか。

- A：CopilotがApproveを出せる設定だけを有効にし、人の必須承認も得る
- B：Review new pushesだけを有効にし、人の必須承認も得る
- C：Copilot承認を要件へ数える設定を有効にし、人の必須承認も得る **【正答】**
- D：Copilot承認を要件へ数える設定を有効にし、人の必須承認を外す

**① 選択肢単体の再読**

本文の条件「Approveを出しました」「必須承認数は減りません」「人による必須承認」を外して四案を再読し、各案の操作・範囲・時点を比較した。Approveは既に出ているためその許可だけでは算入不足を直せない。 レビュー起動の設定は承認の算入可否を変えない。 算入とは別に維持する人の要件を外している。 独立した受験者の実験ではない。

**② 必要な判断**

1. レビュー起動・Approve生成・要件算入を分ける。
2. 成功している段階を変更対象から外す。
3. 算入を直しても人の承認要件を維持する。

**③ 条件変更例（同じ4択）**

Copilot approvalsのpublic previewを利用できるrepoで、算入は有効ですがCopilotの承認自体が無効で、コメントしか出ません。上位の設定は利用を許可し、人による必須承認の設定は維持します。自動レビューは既に動きます。この観測から不足する設定と、変更後も別に満たす要件はどれですか。

変更後の正答：A。算入済みでApprove生成が無効なら承認機能の有効化が不足している。

**④ 決定材料**

「Approveを出しました」／「必須承認数は減りません」／「人による必須承認」

**⑤ 誤答の理由**

- A：Approveは既に出ているためその許可だけでは算入不足を直せない。
- B：レビュー起動の設定は承認の算入可否を変えない。
- D：算入とは別に維持する人の要件を外している。

**⑥ 文字長・位置**：正答33文字／誤答中央値34文字＝0.97倍。正答の表示位置C。

出典：[feature-refresh-review-config](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)、[code-review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review)

### q-d2-e08：全階層へ適用するパス別指示

- 難度：応用／D2・d2o3。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：共通指示の残留とパス別適用、全階層のglobという競合を切り分ける。正答の特定に実在の指示適用方法が必要。

VS Codeで、テストコードを準備・実行・検証の三段階（AAA形式）にする規約を共有しています。対象は、どの階層にあるものも含め、末尾が.test.tsのファイルだけです。規約を共通指示へ書いたところ、通常の実装コードにも混ざりました。共通規約の共有を保ち、AAA規約だけをテストへ限定する配置はどれですか。

- A：共通指示のAAA規約を残し、applyTo: **/*.test.tsのパス別指示にも加える
- B：共通指示のAAA規約を外し、applyTo: **/*.test.tsのパス別指示へ移す **【正答】**
- C：共通指示のAAA規約を外し、各対話で使う個人指示へ移す
- D：共通指示のAAA規約を外し、applyTo: *.test.tsのパス別指示へ移す

**① 選択肢単体の再読**

共通指示の維持・削除、個人指示への移動、全階層と直下だけのパターンを同じ粒度で比較した。本文の共有範囲と対象階層がなければ必要な案を確定しない。独立した受験者による実験ではない。

**② 必要な判断**

1. 状況と制約を整理する：VS Codeで、テストコードを準備・実行・検証の三段階（AAA形式）にする規約を共有しています。対象は、どの階層にあるものも含め、末尾が.test.tsのファイルだけです。規約を共通指示へ書いたところ、通常の実装コードにも混ざりました
2. パス指定の指示で全階層のテストに対象を限定する。共通指示側のAAA指定は取り除く。

**③ 条件変更例（同じ4択）**

VS CodeでAAA規約を共通指示から外しました。今回はrepo直下の.test.tsだけへ適用し、サブディレクトリのテストには別規約を使います。共通規約の共有を保ち、AAA規約の配置とapplyToをどうしますか。

変更後の正答：D。対象をrepo直下だけへ変えたため、共通から外して*.test.tsを使う。

**④ 決定材料**

「末尾が.test.ts」／「共通規約の共有」

**⑤ 誤答の理由**

- A：共通指示の適用範囲が変わらない。
- C：適用範囲をさらに広げる。
- D：*.test.tsだけでは、この設問で求めるすべての下位階層のテストを指定できません。

**⑥ 文字長・位置**：正答44文字／誤答中央値41文字＝1.07倍。正答の表示位置B。

出典：[instructions](https://docs.github.com/en/copilot/concepts/prompting/response-customization)、[prompt-files](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)

### q-d2-e02-feature-20261016：個人設定とrulesetの自動レビュー

- 難度：本番相当／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：本文がruleset起動とその維持方針を明示する。誤答に「今回のレビューを無効扱い」「個人設定でrulesetも止める」があり、正答が目立つ。

Copilotの個人設定では自動レビューと追加pushのレビューを無効にしています。一方、PRに一致するrepo rulesetは両方を有効にしています。このPRだけでなく今後も、初回の自動レビューは続け、追加pushでは自動起動しない運用へ変えます。他の起動源はありません。変更すべき設定元と項目はどれですか。

- A：個人設定のReview new pushesだけを無効にし直す
- B：repo rulesetのReview new pushesだけを無効にする **【正答】**
- C：repo rulesetの自動レビュー全体を無効にする
- D：個人設定の自動レビューを有効にし直す

**① 選択肢単体の再読**

本文の条件「repo rulesetは両方を有効」「初回の自動レビューは続け」を外して四案を再読し、各案の操作・範囲・時点を比較した。既に無効であり独立したrulesetの起動は止まらない。 追加pushは止まるが初回の自動レビューもなくなる。 個人側を有効化することは追加push抑制の対処ではない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 個人設定とrulesetの独立した起動を区別する。
2. 初回と追加pushを別のイベントとして扱う。
3. 有効な起動源の追加pushだけ止める。

**③ 条件変更例（同じ4択）**

Copilotの個人設定では自動レビューと追加pushのレビューを無効にしています。一方、PRに一致するrepo rulesetは両方を有効にしています。このPRだけでなく今後も、初回も追加pushも自動起動しない運用へ変えます。他の起動源はありません。変更すべき設定元と項目はどれですか。

変更後の正答：C。全ての自動起動をやめるならrulesetの自動レビュー全体を外す。

**④ 決定材料**

「repo rulesetは両方を有効」／「初回の自動レビューは続け」

**⑤ 誤答の理由**

- A：既に無効であり独立したrulesetの起動は止まらない。
- C：追加pushは止まるが初回の自動レビューもなくなる。
- D：個人側を有効化することは追加push抑制の対処ではない。

**⑥ 文字長・位置**：正答38文字／誤答中央値27文字＝1.41倍。正答の表示位置B。

出典：[feature-refresh-review-config](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

### q-sc08-2-feature-20261016：クラウドとローカルの設定経路

- 難度：本番相当／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：実験対照比較
- 修正前の指摘：クラウドで失敗したのでクラウドの準備・外部接続を確認するだけ。Copilot固有のsetupファイル・ログ段階・設定境界を問えていない。

Copilot cloud agentの新規タスクで依存取得が失敗します。session logではcopilot-setup-steps jobの資格情報読込stepが失敗し、それ以降の取得stepは実行されていません。ローカルIDEでは成功し、cloud側のMCP検索も成功します。同じcloud環境で準備を再現可能にするには、最初に何を直して検証しますか。

- A：repoのInternet accessを直し、AgentのBash通信だけを再確認する
- B：ローカルIDEのproxy設定を直し、同じローカルセッションで再確認する
- C：copilot-setup-stepsの資格情報設定を直し、新規タスクのsetupログを確認する **【正答】**
- D：cloud側のMCP接続設定を直し、検索ツールの入力だけを再確認する

**① 選択肢単体の再読**

本文の条件「資格情報読込stepが失敗」「取得stepは実行されていません」を外して四案を再読し、各案の操作・範囲・時点を比較した。CopilotのAgent firewallはsetup stepsの準備失敗を直す設定ではない。 ローカルIDEのproxyはcloudのsetup設定を変更しない。 MCP検索は成功しており、setupの資格情報とは別の経路である。 独立した受験者の実験ではない。

**② 必要な判断**

1. session logの実行段階を特定する。
2. setup失敗後の省略と依存不足を結ぶ。
3. cloudのsetup資格情報を修正して再検証する。

**③ 条件変更例（同じ4択）**

Copilot cloud agentの新規タスクで依存取得が失敗します。setupは全て成功しましたが、AgentのBashから依存取得先への通信だけがCopilot firewallで拒否されています。ローカルIDEでは成功し、cloud側のMCP検索も成功します。同じcloud環境で準備を再現可能にするには、最初に何を直して検証しますか。

変更後の正答：A。失敗段階がAgentのBash通信ならrepoのInternet accessを確認する。

**④ 決定材料**

「資格情報読込stepが失敗」／「取得stepは実行されていません」

**⑤ 誤答の理由**

- A：CopilotのAgent firewallはsetup stepsの準備失敗を直す設定ではない。
- B：ローカルIDEのproxyはcloudのsetup設定を変更しない。
- D：MCP検索は成功しており、setupの資格情報とは別の経路である。

**⑥ 文字長・位置**：正答48文字／誤答中央値36文字＝1.33倍。正答の表示位置C。

出典：[feature-refresh-cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)、[feature-refresh-setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)、[network](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)

### q-d1-a04-feature-20261016：MCPツール結果の取込承認

- 難度：応用／D1・d1o2。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：実行前と結果取込前の承認を分ける。正解・誤答の四つの組合せが同じ粒度で、外部データの扱いから設定を選べる。

VS CodeのCopilotで外部MCPツールを使います。通信開始は自動承認してよい一方、取得データには外部の指示文が混ざる可能性があるため、結果をChatの文脈へ追加する前には確認したいと考えています。Chat: Manage Tool Approvalで分けて設定すべき項目はどれですか。

- A：Pre-approvalの自動化を外し、Post-approvalは許可する
- B：Pre-approvalとPost-approvalを両方許可する
- C：Pre-approvalは許可し、Post-approvalの自動化は外す **【正答】**
- D：Pre-approvalとPost-approvalの自動化を両方外す

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「通信開始は自動承認」「結果をChatの文脈へ追加する前」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。MCP接続方式ではなく、Copilotの外部結果取込の承認境界を操作する。

**② 必要な判断**

1. 外部ツールの実行と結果取込を異なる確認段階へ分ける。
2. 開始は自動化し、Post-approvalの結果確認だけを残す。
3. 実行前承認と、結果を文脈へ取り込む際の承認は別。今回残すのは結果確認。

**③ 条件変更例（同じ4択）**

VS CodeのCopilotで外部MCPツールを使います。通信開始だけを毎回確認し、承認した取得結果は確認なしでChatの文脈へ追加したいと考えています。Chat: Manage Tool Approvalで分けて設定すべき項目はどれですか。

変更後の正答：A。通信開始前だけ確認するならPreを手動、Postを自動にする。

**④ 決定材料**

「通信開始は自動承認」／「結果をChatの文脈へ追加する前」

**⑤ 誤答の理由**

- A：通信開始を確認する設定で、今回求める結果の取込確認が省略される。
- B：結果も自動で文脈へ入るため、取込前の確認が残らない。
- D：結果確認は残るが、通信開始は自動でよいという運用を余計に制限する。

**⑥ 文字長・位置**：正答37文字／誤答中央値35文字＝1.06倍。正答の表示位置C。

出典：[feature-refresh-approval](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d4-e01-feature-20261016：既存PRへのAgentの追加修正

- 難度：本番相当／D5・d5o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：既存PRへ@copilotで依頼する経路の識別。branchと書込権限は題材になるが、失敗の競合仮説を判別する本番相当には足りない。

Copilot cloud agentが作った既存PRへ、閲覧権限のAが@copilotで追加修正を依頼しましたが作業が始まりません。書込権限のBも参加でき、Agent機能とライセンスは有効です。変更対象とbranchはそのPRのままで、新しいPRは増やしません。最小の依頼し直し方はどれですか。

- A：Aが既存PRのコメントで同じ依頼をもう一度送る
- B：Bが新しいIssueをCopilotへ割り当てて別PRを作る
- C：Aが既存PRのsummaryへ修正手順を追記する
- D：Bが既存PRのコメントで@copilotへ修正を依頼する **【正答】**

**① 選択肢単体の再読**

本文の条件「閲覧権限のA」「書込権限のB」「新しいPRは増やしません」を外して四案を再読し、各案の操作・範囲・時点を比較した。閲覧だけという権限不足は再送で解消しない。 新規タスクは別PRとなり、既存PRを更新する条件に合わない。 summaryへの追記は権限のある追加作業依頼ではない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 失敗を機能無効ではなく依頼者の権限へ絞る。
2. 既存PR更新と新規タスク作成を区別する。
3. 書込権限者から同じPRへ依頼する。

**③ 条件変更例（同じ4択）**

Copilot cloud agentが作った既存PRへ、閲覧権限のAが@copilotで追加修正を依頼しましたが作業が始まりません。書込権限のBも参加でき、Agent機能とライセンスは有効です。変更は既存PRと分離し、新しいIssueを元に別PRとして管理します。最小の依頼し直し方はどれですか。

変更後の正答：B。既存PRと分離した作業なら新規Issueの割当が合う。

**④ 決定材料**

「閲覧権限のA」／「書込権限のB」／「新しいPRは増やしません」

**⑤ 誤答の理由**

- A：閲覧だけという権限不足は再送で解消しない。
- B：新規タスクは別PRとなり、既存PRを更新する条件に合わない。
- C：summaryへの追記は権限のある追加作業依頼ではない。

**⑥ 文字長・位置**：正答28文字／誤答中央値24文字＝1.17倍。正答の表示位置D。

出典：[feature-refresh-risk](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations)、[feature-refresh-review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d3-a07-feature-20261016：Prompt Fileの名前と既定Agent

- 難度：応用／D4・d4o2。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：nameがファイル名を上書きする点とtools指定時の既定Agentを組み合わせる。応用として必要な二つの仕様がある。

VS CodeのLocal harnessにreview.prompt.mdを保存しました。frontmatterはname: inspect、tools: [read]で、agentは省略しています。このプロンプトを使う際、呼び出すコマンド名と既定の実行Agentの組合せはどれですか。

- A：/inspectで呼び、tools指定によりagentを既定とする **【正答】**
- B：/reviewで呼び、tools指定によりagentを既定とする
- C：/inspectで呼び、tools指定でも必ずaskを既定とする
- D：/reviewで呼び、tools指定でも必ずaskを既定とする

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「name: inspect」「agentは省略」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。保存場所の識別でなく、frontmatterの省略・上書きによる二つの実効値を問う。

**② 必要な判断**

1. ファイル名とname、agent省略とtools指定を分ける。
2. 明示した呼出名とツール指定時の既定Agentを組み合わせる。
3. nameはファイル名より呼出名として優先される。toolsが指定されAgent省略ならagentが既定。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessにreview.prompt.mdを保存しました。frontmatterはtools: [read]で、agentは省略しています。このプロンプトを使う際、呼び出すコマンド名と既定の実行Agentの組合せはどれですか。

変更後の正答：B。nameがなければファイル名reviewが呼出名になる。

**④ 決定材料**

「name: inspect」／「agentは省略」

**⑤ 誤答の理由**

- B：実行Agentは合うが、nameの明示指定を無視している。
- C：nameは合うが、tools指定時の既定Agentを取り違えている。
- D：呼出名の上書きと、ツール指定時の既定Agentの両方が違う。

**⑥ 文字長・位置**：正答33文字／誤答中央値32文字＝1.03倍。正答の表示位置A。

出典：[feature-refresh-prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)

### q-d3-a06-feature-20261016：入力のヒントと変数の違い

- 難度：応用／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：入力を求める構文だけが正しい用途で、applyToやtoolsを変数扱いする誤答が弱い。入力変数構文は毎回の対話UIを保証する機能とは区別すべき。

VS CodeのLocal harnessでPrompt Fileを作りました。argument-hint: moduleを指定しても、入力を待たずに一般的な回答になります。今回は未入力なら対象モジュールを尋ねるようモデルへ指示し、再利用する本文内でその値を使います。入力UIの強制機能とみなさず、どこを直しますか。

- A：argument-hintだけへ対象モジュールの長い説明を入れる
- B：本文には固定モジュール名を入れ、argument-hintだけを残す
- C：本文には${file}だけを入れ、現在のファイルを対象にする
- D：本文へ${input:module:対象モジュールを入力}を入れて利用を指示する **【正答】**

**① 選択肢単体の再読**

本文の条件「未入力なら対象モジュールを尋ねる」「本文内でその値」を外して四案を再読し、各案の操作・範囲・時点を比較した。案内だけを増やしても本文の入力要求が不足したままである。 固定値では毎回異なる対象を受け取る目的を満たさない。 現在ファイルを対象にする指定で、利用者が入力するmodule値ではない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 入力欄の案内とモデルへ渡る本文を区別する。
2. 本文へ入力要求と利用箇所を明示する。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessでPrompt Fileを作りました。argument-hint: moduleを指定しても、入力を待たずに一般的な回答になります。今回は利用者入力は不要で、常にエディターの現在ファイルを対象にします。入力UIの強制機能とみなさず、どこを直しますか。

変更後の正答：C。現在ファイルが対象ならfile変数を使い、moduleの入力要求を置く必要はない。

**④ 決定材料**

「未入力なら対象モジュールを尋ねる」／「本文内でその値」

**⑤ 誤答の理由**

- A：案内だけを増やしても本文の入力要求が不足したままである。
- B：固定値では毎回異なる対象を受け取る目的を満たさない。
- C：現在ファイルを対象にする指定で、利用者が入力するmodule値ではない。

**⑥ 文字長・位置**：正答40文字／誤答中央値32文字＝1.25倍。正答の表示位置D。

出典：[feature-refresh-prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)

### q-d3-a03-feature-20261016：索引検索と明示した入力資料

- 難度：応用／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：必ず含めたい特定ファイルを明示添付するだけ。他案が添付省略・Block解除・モデル再選択で、本文以前に正答が目立つ。

VS CodeのCopilot Chatで設計書を比較します。現行版spec-v2.mdは開いていますが、検索ではspec-v1.mdも候補になります。今回は現行版のファイル全体を必ず文脈に指定し、旧版は検索で必要なら参照させます。対象を確定する添付方法はどれですか。

- A：Add ContextのFolderで設計書フォルダ全体を指定する
- B：spec-v2.mdの一見出しの選択範囲だけを添付する
- C：Add ContextのFilesでspec-v2.mdを明示する **【正答】**
- D：検索対象のファイル名を本文に書き、添付は自動検索へ任せる

**① 選択肢単体の再読**

本文の条件「現行版のファイル全体」「必ず文脈に指定」を外して四案を再読し、各案の操作・範囲・時点を比較した。フォルダ指定では現行版だけを確定する指定にならず、文脈候補も広がる。 ファイル全体ではなく一見出しの選択範囲だけになる。 名前による指示だけでは明示添付という条件を満たさない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 索引候補と利用者による明示添付を分ける。
2. 目的の粒度に合うファイル単位の指定を選ぶ。

**③ 条件変更例（同じ4択）**

VS CodeのCopilot Chatで設計書を比較します。現行版spec-v2.mdは開いていますが、検索ではspec-v1.mdも候補になります。今回は設計書フォルダ全体を文脈候補として指定し、版の選別は検索へ任せます。対象を確定する添付方法はどれですか。

変更後の正答：A。フォルダ全体を文脈にする目的ならFolder指定が合う。

**④ 決定材料**

「現行版のファイル全体」／「必ず文脈に指定」

**⑤ 誤答の理由**

- A：フォルダ指定では現行版だけを確定する指定にならず、文脈候補も広がる。
- B：ファイル全体ではなく一見出しの選択範囲だけになる。
- D：名前による指示だけでは明示添付という条件を満たさない。

**⑥ 文字長・位置**：正答33文字／誤答中央値28文字＝1.18倍。正答の表示位置C。

出典：[repository-indexing](https://docs.github.com/en/copilot/concepts/context/repository-indexing)、[feature-refresh-context](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-d1-e09-feature-20261016：公開コード索引の範囲と更新

- 難度：本番相当／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：公開索引の対象と反映時点を分ける実在の境界。ただし二件の分類に留まり、公開直後に反映完了を断定する二案も弱い。

Copilotのコード参照で、昨日初めて公開したrepo-Pのコードと、非公開のままのrepo-Qのコードを照合しました。どちらも参照は表示されませんでした。担当者は「参照なしなので独自実装として扱える」と判断しています。公開コード索引の範囲と反映時点から、PとQの結果をどう扱いますか。

- A：Pは反映未確認、Qは公開索引の対象外として、独自性は別に確認する **【正答】**
- B：Pは反映確認済み、Qは公開索引の対象外として、独自性は別に確認する
- C：Pは反映未確認、Qは公開索引の対象内として、独自性は別に確認する
- D：Pは反映確認済み、Qは公開索引の対象内として、独自性は別に確認する

**① 選択肢単体の再読**

本文の条件「昨日初めて公開」「非公開のまま」を外して四案を再読し、各案の操作・範囲・時点を比較した。公開直後という情報だけで索引反映済みとは断定できない。 非公開のままのQは公開コード索引の対象ではない。 Pの反映済みとQの対象内をどちらも根拠なく採用している。 独立した受験者の実験ではない。

**② 必要な判断**

1. コード参照の索引対象を確認する。
2. 反映時点と対象範囲の限界をそれぞれ照合する。
3. 参照なしから独自性を証明しない。

**③ 条件変更例（同じ4択）**

Copilotのコード参照で、公開索引への反映を別途確認したrepo-Pのコードと、非公開のままのrepo-Qのコードを照合しました。どちらも参照は表示されませんでした。担当者は「参照なしなので独自実装として扱える」と判断しています。公開コード索引の範囲と反映時点から、PとQの結果をどう扱いますか。

変更後の正答：B。Pの反映を確認した条件へ変われば、その事実は採用できる。非公開Qの範囲と独自性に関する留保は変わらない。

**④ 決定材料**

「昨日初めて公開」／「非公開のまま」

**⑤ 誤答の理由**

- B：公開直後という情報だけで索引反映済みとは断定できない。
- C：非公開のままのQは公開コード索引の対象ではない。
- D：Pの反映済みとQの対象内をどちらも根拠なく採用している。

**⑥ 文字長・位置**：正答32文字／誤答中央値33文字＝0.97倍。正答の表示位置A。

出典：[public-code](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code)

### q-sc05-3-feature-20261016：repo内外の除外スコープ

- 難度：応用／D6・d6o1。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：Git repoの内外と全階層を別々の設定要素へ対応させる。四つのスコープの違いがあり、応用として成立する。

組織のCopilot Seat利用者について、Git repo内とGit管理外の作業フォルダの両方の任意の階層で.envファイルを通常補完の対象から外したいと考えています。どの組織設定の書き方が対象範囲に合いますか。

- A：対象repo: ["**/.env"]
- B："*": ["/.env"]
- C：対象repo: ["/.env"]
- D："*": ["**/.env"] **【正答】**

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「Git管理外」「.envファイル」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。既存の階層globの問題と分け、Copilot組織設定のrepo境界の外の除外を扱う。

**② 必要な判断**

1. 一つのrepoに閉じないファイル除外が必要と読む。
2. 全ファイルシステム対象の*と.envのパターンを組み合わせる。
3. Git内外の全階層の.envを対象にする。

**③ 条件変更例（同じ4択）**

組織のCopilot Seat利用者について、指定する一つのGit repo内だけの任意の階層で.envファイルを通常補完の対象から外したいと考えています。どの組織設定の書き方が対象範囲に合いますか。

変更後の正答：A。対象が一つのrepoだけならrepo識別子の下の.env指定が合う。

**④ 決定材料**

「Git管理外」／「.envファイル」

**⑤ 誤答の理由**

- A：指定repoの中だけで、Git管理外まで対象にしない。
- B：全階層の.envを対象にする**がなく、深い場所まで同じ範囲にならない。
- C：指定repoと直下へ範囲が狭く、Git管理外や下位階層を含めない。

**⑥ 文字長・位置**：正答16文字／誤答中央値17文字＝0.94倍。正答の表示位置D。

出典：[exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-d3-e08-feature-20261016：Agent firewallの対象プロセス

- 難度：本番相当／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：実験対照比較
- 修正前の指摘：Bashの要求がfirewall拒否と既に特定されており、必要なドメインを許可する一操作。複数の成功観測は正答にほぼ影響しない。

Copilot cloud agentで同一サイトへの要求を比較します。setup stepsとMCPサーバープロセスは成功し、AgentのBashだけが失敗します。session logにはCopilot firewallによる拒否が記録されています。経路ごとに通信制御の範囲を分けると、次に直す設定はどれですか。

- A：repoのInternet accessへ必要なドメインを追加する **【正答】**
- B：ローカルIDEのproxyへ必要なドメインを追加する
- C：cloudのMCP設定でサーバー用の資格情報を更新する
- D：cloudのsetup設定で取得に使うsecretを更新する

**① 選択肢単体の再読**

本文の条件「AgentのBashだけ」「Copilot firewallによる拒否」を外して四案を再読し、各案の操作・範囲・時点を比較した。cloudのBash拒否をローカルIDEのproxyでは解除できない。 MCP経路の成功とBashの通信制御を混同している。 資格情報エラーではなくAgent firewallの拒否という観測に合わない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 三経路の実行主体を分ける。
2. firewallの適用範囲と拒否ログを照合する。
3. Bash経路の許可先をrepoで変更する。

**③ 条件変更例（同じ4択）**

Copilot cloud agentで同一サイトへの要求を比較します。MCPサーバープロセスとAgentのBashは成功し、setup stepsだけが取得用secretの失効で失敗しています。経路ごとに通信制御の範囲を分けると、次に直す設定はどれですか。

変更後の正答：D。失敗経路とログがsetupの失効secretを指すなら、その資格情報を更新する。

**④ 決定材料**

「AgentのBashだけ」／「Copilot firewallによる拒否」

**⑤ 誤答の理由**

- B：cloudのBash拒否をローカルIDEのproxyでは解除できない。
- C：MCP経路の成功とBashの通信制御を混同している。
- D：資格情報エラーではなくAgent firewallの拒否という観測に合わない。

**⑥ 文字長・位置**：正答33文字／誤答中央値27文字＝1.22倍。正答の表示位置A。

出典：[feature-refresh-firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)、[feature-refresh-setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)

### q-d5-e07-feature-20261016：CLIで二つの候補制限を同時指定

- 難度：本番相当／D2・d2o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：CLIのavailable-toolsへread,searchを渡すが、公式の標準ツール名はview,grep等。権限パターンのread/shellやcustom agent別名との混同がある。現状の正答を正式なCLI例として支持できない。

LinuxのCopilot CLIで--available-tools=view,grep、--excluded-tools=grep、--allow-tool=shellを同時に指定しました。この環境にはview、grep、bashが実在します。検索を試みるモデルと、git statusを実行しようとするモデルへ提供される候補を比較します。候補制限を解釈した結果はどれですか。

- A：grepは候補から外れ、bashも候補に入らない
- B：grepは候補に残り、bashも候補に入る
- C：grepは候補に残るが、bashは候補に入らない **【正答】**
- D：grepは候補から外れ、bashは候補に入る

**① 選択肢単体の再読**

本文の条件「--available-tools=view,grep」「--excluded-tools=grep」「--allow-tool=shell」を外して四案を再読し、各案の操作・範囲・時点を比較した。二つの候補制限を差集合として解釈している。 実行許可を候補ツールの追加として扱っている。 候補制限の優先順位と実行許可の層を両方取り違えている。 独立した受験者の実験ではない。

**② 必要な判断**

1. 実ツール名とpermission kindを分ける。
2. 候補制限二指定の優先順位を適用する。
3. 実行許可ではbashが追加されないと判定する。

**③ 条件変更例（同じ4択）**

LinuxのCopilot CLIで--available-tools=view,grep,bash、--excluded-tools=grep、--allow-tool=shellを同時に指定しました。この環境にはview、grep、bashが実在します。検索を試みるモデルと、git statusを実行しようとするモデルへ提供される候補を比較します。候補制限を解釈した結果はどれですか。

変更後の正答：B。bashも候補へ明示した場合はgrepとbashの両方が提供される。

**④ 決定材料**

「--available-tools=view,grep」／「--excluded-tools=grep」／「--allow-tool=shell」

**⑤ 誤答の理由**

- A：二つの候補制限を差集合として解釈している。
- B：実行許可を候補ツールの追加として扱っている。
- D：候補制限の優先順位と実行許可の層を両方取り違えている。

**⑥ 文字長・位置**：正答24文字／誤答中央値22文字＝1.09倍。正答の表示位置C。

出典：[cli-tool-permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)、[feature-refresh-cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-d6-a03-feature-20261016：除外後の間接的な型情報

- 難度：応用／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：IDEの型情報が伝わる可能性を本文が明記し、正答でも同じ型・hover情報を選ぶ。知識の適用より本文の言い換え。

Content Exclusion登録済みの型定義を使う呼出側で、IDEのhoverに機密型の説明が現れ、その型を踏まえた候補が出ました。直接の型定義ファイルには除外表示があり、設定反映とパス一致も確認済みです。通常補完の保護範囲を評価するため、次に調べる経路はどれですか。

- A：除外登録した同一ファイルの直接参照の反映待ち
- B：IDEが呼出側へ渡す型情報などの間接的な意味情報 **【正答】**
- C：生成後の公開コード一致による候補の出力制御
- D：Copilot Seatの未割当によるサービス利用の制限

**① 選択肢単体の再読**

本文の条件「呼出側で」「IDEのhover」「設定反映とパス一致も確認済み」を外して四案を再読し、各案の操作・範囲・時点を比較した。除外表示と反映確認があり、直接参照の未反映だけでは説明しにくい。 公開コード一致は出力側の機能で、IDEからの型情報取得とは違う。 Seat不足なら通常補完全体の利用問題となり型情報の経路を説明しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 直接の除外成功を確認する。
2. 非除外ファイルへIDEが提供する意味情報の経路を分ける。

**③ 条件変更例（同じ4択）**

Content Exclusion登録済みの型定義を使う呼出側で、IDEのhoverに機密型の説明が現れ、その型を踏まえた候補が出ました。直接の型定義ファイルにはまだ除外表示がなく、設定変更の反映待ち通知が出ています。通常補完の保護範囲を評価するため、次に調べる経路はどれですか。

変更後の正答：A。直接除外が未反映という観測なら、間接経路の評価より先に直接ファイルへの反映を確認する。

**④ 決定材料**

「呼出側で」／「IDEのhover」／「設定反映とパス一致も確認済み」

**⑤ 誤答の理由**

- A：除外表示と反映確認があり、直接参照の未反映だけでは説明しにくい。
- C：公開コード一致は出力側の機能で、IDEからの型情報取得とは違う。
- D：Seat不足なら通常補完全体の利用問題となり型情報の経路を説明しない。

**⑥ 文字長・位置**：正答24文字／誤答中央値22文字＝1.09倍。正答の表示位置B。

出典：[exclusion-concept](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

### q-d2-a20：d2o3

- 難度：応用／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：認可済みの現在APIと朝のCSVの選択は、一般のデータ鮮度判断だけでも解ける。Copilotのツール接続や権限伝播の実効条件が必要。

VS CodeのCopilotへ注文検索MCPを接続しました。SpaceのCSVは朝の時点の資料です。MCPのツール一覧は見えますが、担当者の注文を検索すると認証要求で止まります。午後のキャンセルを含む状態を、担当者の閲覧範囲で回答させます。次に選ぶCopilot側の操作はどれですか。

- A：SpaceのCSVを再添付し、MCP接続の認証は保留する
- B：MCP接続の認証を完了し、認可された検索ツールを使う **【正答】**
- C：ツールの入力スキーマだけを直し、認証は保留する
- D：共通Instructionsへ担当範囲を書き、MCPの認証は保留する

**① 選択肢単体の再読**

本文の条件「ツール一覧は見えます」「認証要求で止まります」「午後のキャンセル」を外して四案を再読し、各案の操作・範囲・時点を比較した。朝のCSVでは午後の現在データを取得できない。 引数不整合ではなく認証要求で止まっている。 指示文はデータ取得経路やAPIの認可を提供しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 発見済みと使用可能を区別する。
2. 認証を完了しサーバーの認可範囲で現在データを取得する。

**③ 条件変更例（同じ4択）**

VS CodeのCopilotへ注文検索MCPを接続しました。SpaceのCSVは朝の時点の資料です。MCPのツール一覧は見えますが、担当者の注文を検索すると認証要求で止まります。今回は朝のCSVに記録した時点の状態だけを、既に閲覧を認めた資料として回答させます。次に選ぶCopilot側の操作はどれですか。

変更後の正答：A。朝のスナップショットの説明なら既存CSVを使え、ライブMCP認証はその問いの前提ではない。

**④ 決定材料**

「ツール一覧は見えます」／「認証要求で止まります」／「午後のキャンセル」

**⑤ 誤答の理由**

- A：朝のCSVでは午後の現在データを取得できない。
- C：引数不整合ではなく認証要求で止まっている。
- D：指示文はデータ取得経路やAPIの認可を提供しない。

**⑥ 文字長・位置**：正答26文字／誤答中央値28文字＝0.93倍。正答の表示位置B。

出典：[spaces](https://docs.github.com/en/copilot/concepts/context/spaces)、[mcp](https://docs.github.com/en/copilot/concepts/context/mcp)

### q-d2-e19-feature-20261016：Spaceのリンク元とアップロード版

- 難度：本番相当／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：リンク先は更新済み・PDFは旧版と明示され、PDFだけ差し替える答えを本文からそのまま取れる。

Copilot Spaceに、GitHub上の仕様ファイルへのリンクと、同じ仕様のPDFをアップロードしています。GitHubの同じパスは改訂済みです。Spaceの回答はリンク側の新版を引用する一方、PDFの旧要件も引用します。リンクの継続追従は保ち、旧要件の混入だけを直します。資料の種類を踏まえた更新はどれですか。

- A：GitHubリンクをアップロードへ変え、既存PDFは維持する
- B：GitHubリンクだけを同じパスへ付け直し、既存PDFは維持する
- C：GitHubリンクは維持し、アップロードPDFを現行版へ差し替える **【正答】**
- D：GitHubリンクと既存PDFを維持し、質問文に新版とだけ書く

**① 選択肢単体の再読**

本文の条件「PDFの旧要件も引用」「継続追従は保ち」を外して四案を再読し、各案の操作・範囲・時点を比較した。旧PDFが残り、GitHubリンクの追従性も失う。 同じリンクを付け直してもアップロード済みPDFは更新されない。 新版という指示だけでは旧PDFそのものの内容は変わらない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 回答の引用元を資料単位で分ける。
2. リンクとアップロードの更新方式を照合する。
3. 旧スナップショットだけ差し替える。

**③ 条件変更例（同じ4択）**

Copilot Spaceに、GitHub上の仕様ファイルへのリンクと、同じ仕様のPDFをアップロードしています。GitHubの同じパスは改訂済みです。Spaceの回答はリンク側の新版を引用する一方、PDFの旧要件も引用します。既存PDFの時点を監査用に残し、GitHubの内容も今の版をアップロードして固定します。資料の種類を踏まえた更新はどれですか。

変更後の正答：A。監査用スナップショットへ方針を変えるならリンクをアップロードへ変えて固定する。

**④ 決定材料**

「PDFの旧要件も引用」／「継続追従は保ち」

**⑤ 誤答の理由**

- A：旧PDFが残り、GitHubリンクの追従性も失う。
- B：同じリンクを付け直してもアップロード済みPDFは更新されない。
- D：新版という指示だけでは旧PDFそのものの内容は変わらない。

**⑥ 文字長・位置**：正答33文字／誤答中央値31文字＝1.06倍。正答の表示位置C。

出典：[spaces](https://docs.github.com/en/copilot/concepts/context/spaces)

### q-d5-a09-feature-20261016：補完を言語別に止める

- 難度：応用／D5・d5o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：Markdown停止・TypeScript維持を四択が同じ語で繰り返す。実際の設定キー・設定範囲を確認させず、基礎の定義照合に近い。

VS Codeのgithub.copilot.enableは{"*": true, "markdown": true}です。Markdownの自動インライン提案だけを止め、TypeScriptを含む他言語の提案とChatは維持します。個人の言語別設定を変更する場合、必要な差分はどれですか。

- A：*をfalseにし、markdownのtrueは維持する
- B：markdownをfalseにし、*のtrueは維持する **【正答】**
- C：*とmarkdownを両方falseに変更する
- D：markdownはtrueのまま、Chatのモデルだけ変更する

**① 選択肢単体の再読**

本文の条件「github.copilot.enable」「Markdownの自動インライン提案だけ」「他言語」を外して四案を再読し、各案の操作・範囲・時点を比較した。Markdownを残して他言語を止める逆の設定になる。 他言語まで止まるため要件より広い。 モデル変更ではMarkdownの提案有効化を止めない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 言語別上書きと*の既定値を分ける。
2. 対象言語だけfalseへ変更し他言語を保つ。

**③ 条件変更例（同じ4択）**

VS Codeのgithub.copilot.enableは{"*": true, "markdown": true}です。全言語の自動インライン提案を止め、Chatだけは維持します。個人の言語別設定を変更する場合、必要な差分はどれですか。

変更後の正答：C。全言語を止める場合は*と明示上書きmarkdownを両方falseにする。

**④ 決定材料**

「github.copilot.enable」／「Markdownの自動インライン提案だけ」／「他言語」

**⑤ 誤答の理由**

- A：Markdownを残して他言語を止める逆の設定になる。
- C：他言語まで止まるため要件より広い。
- D：モデル変更ではMarkdownの提案有効化を止めない。

**⑥ 文字長・位置**：正答28文字／誤答中央値28文字＝1.00倍。正答の表示位置B。

出典：[feature-refresh-inline](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)

### q-d2-e06：CLIの候補制限と実行許可

- 難度：本番相当／D2・d2o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：deny優先と候補制限の二規則を本文が全部与える。規則の二ケースへの代入にはなるが、製品仕様を適用する本番相当としては軽い。

LinuxのCopilot CLIで二つの起動構成を比較します。Pはbashを提供し、--allow-tool="shell(git:*)"と--deny-tool="shell(git push)"を指定。Qは--available-tools=view,grepで同じallow指定を使います。どちらも同じrepoで、保存済み承認以外の制約はありません。git commitとgit pushを試す場合の違いはどれですか。

- A：Pはcommit可・push拒否、Qはどちらも実行ツールの候補外 **【正答】**
- B：Pは両方可、Qはどちらも実行ツールの候補外
- C：Pはcommit可・push拒否、Qも同じ実行許可になる
- D：Pは両方拒否、Qはcommit可・push拒否になる

**① 選択肢単体の再読**

本文の条件「--deny-tool="shell(git push)"」「--available-tools=view,grep」を外して四案を再読し、各案の操作・範囲・時点を比較した。広いallowが個別denyを打ち消すと誤解している。 候補ツールの不足を実行許可だけで解消できると誤解している。 PのdenyをGit全体へ広げ、Qでは候補制限を無視している。 独立した受験者の実験ではない。

**② 必要な判断**

1. Pのallowとdenyの優先関係を判定する。
2. Qで実行ツールが提供されるか確認する。
3. 実行拒否と候補外を別の結果として比較する。

**③ 条件変更例（同じ4択）**

LinuxのCopilot CLIで二つの起動構成を比較します。Pはbashを提供し、--allow-tool="shell(git:*)"と--deny-tool="shell(git push)"を指定。Qは--available-tools=view,grep,bashで、Pと同じdenyも指定しており同じallow指定を使います。どちらも同じrepoで、保存済み承認以外の制約はありません。git commitとgit pushを試す場合の違いはどれですか。

変更後の正答：C。Qにもbashと同じdenyがあるならPとQの実行可否がそろう。

**④ 決定材料**

「--deny-tool="shell(git push)"」／「--available-tools=view,grep」

**⑤ 誤答の理由**

- B：広いallowが個別denyを打ち消すと誤解している。
- C：候補ツールの不足を実行許可だけで解消できると誤解している。
- D：PのdenyをGit全体へ広げ、Qでは候補制限を無視している。

**⑥ 文字長・位置**：正答32文字／誤答中央値26文字＝1.23倍。正答の表示位置A。

出典：[cli-tool-permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-d5-e02-feature-20261016：一つのツールの保存済み承認を戻す

- 難度：本番相当／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：一ツールのPre-approvalだけを変更する実在操作。Reset全体・提供候補・Post承認との区別は応用として妥当だが本番相当には弱い。

VS CodeのCopilotでread_reportは確認なしで実行できます。update_recordも実行前確認が出ず、実行後の結果だけ確認を求められます。今後はupdate_recordの入力を毎回確認し、結果取込前の確認とread_reportの設定は維持します。候補ツールを減らさずに直す操作はどれですか。

- A：Manage Tool Approvalでupdate_recordのPost-approvalの自動化だけを外す
- B：Manage Tool Approvalでupdate_recordのPre-approvalの自動化だけを外す **【正答】**
- C：Reset Tool Confirmationsで全ツールの保存済み承認を消す
- D：ツール選択からupdate_recordだけを無効にする

**① 選択肢単体の再読**

本文の条件「実行後の結果だけ」「入力を毎回確認」「read_reportの設定は維持」を外して四案を再読し、各案の操作・範囲・時点を比較した。実行後の確認は残っており、入力を実行前に確認する目的を満たさない。 read_reportの保存済み設定も消える。 実行前確認を復活させる代わりにツールを使用不能にする。 独立した受験者の実験ではない。

**② 必要な判断**

1. 実行前・取込前のどちらが不足か診断する。
2. ツール別管理と全体リセットを区別する。
3. 対象ツールのPre-approvalだけを変更する。

**③ 条件変更例（同じ4択）**

VS CodeのCopilotでread_reportは確認なしで実行できます。update_recordも実行前確認が出ず、実行後の結果だけ確認を求められます。今後はread_reportも含め保存済みの全ツール承認を消して、すべて再承認します。候補ツールを減らさずに直す操作はどれですか。

変更後の正答：C。全ツールの保存済み承認を消す目的ならReset Tool Confirmationsが合う。

**④ 決定材料**

「実行後の結果だけ」／「入力を毎回確認」／「read_reportの設定は維持」

**⑤ 誤答の理由**

- A：実行後の確認は残っており、入力を実行前に確認する目的を満たさない。
- C：read_reportの保存済み設定も消える。
- D：実行前確認を復活させる代わりにツールを使用不能にする。

**⑥ 文字長・位置**：正答56文字／誤答中央値39文字＝1.44倍。正答の表示位置B。

出典：[feature-refresh-approval](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d1-e03-feature-20261016：復元で戻る変更の境界

- 難度：本番相当／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：checkpointで戻せるもの・戻せないものを本文で全部教え、両方戻す対処を選ぶだけ。三段階推論欄があっても推論課題がない。

VS CodeのCopilot Agentへ依頼する前に、未コミットの自分の変更を含むcheckpointが作られました。Agentはコードを編集し、MCPで外部チケットを「対応中」へ更新しました。依頼直前のコードとチケット状態へ戻し、自分の未コミット変更は残します。チケットの更新前の値は記録済みです。どの復旧を組み合わせますか。

- A：Gitの最終commitへコードを戻し、外部チケットは記録した値へ別途戻す
- B：依頼前checkpointでコードを戻し、MCPの同じ更新をもう一度実行する
- C：新しいChatへ切り替えてコードを残し、外部チケットは記録した値へ別途戻す
- D：依頼前checkpointでコードを戻し、外部チケットは記録した値へ別途戻す **【正答】**

**① 選択肢単体の再読**

本文の条件「未コミットの自分の変更」「外部チケット」「依頼直前」を外して四案を再読し、各案の操作・範囲・時点を比較した。最終commitは自分の未コミット変更を含まず、復元する時点が違う。 同じ「対応中」更新の再実行は元の状態への補償にならない。 新規Chatはコード変更を巻き戻さない。 独立した受験者の実験ではない。

**② 必要な判断**

1. commit時点と依頼前checkpointの差を読む。
2. コード復元と外部ツールの副作用を分ける。
3. 依頼前スナップショットと外部の補償更新を組み合わせる。

**③ 条件変更例（同じ4択）**

VS CodeのCopilot Agentがコードと外部チケットを変更しました。依頼前checkpointはなく、未コミット変更もありませんでした。最終commitが作業前のコードです。チケットの元の値は記録されています。両方を作業前へ戻す方法はどれですか。

変更後の正答：A。復元元の利用可能性だけを変えたケース。checkpointがないのでGitの最終commitを使い、外部は別に戻す。

**④ 決定材料**

「未コミットの自分の変更」／「外部チケット」／「依頼直前」

**⑤ 誤答の理由**

- A：最終commitは自分の未コミット変更を含まず、復元する時点が違う。
- B：同じ「対応中」更新の再実行は元の状態への補償にならない。
- C：新規Chatはコード変更を巻き戻さない。

**⑥ 文字長・位置**：正答38文字／誤答中央値37文字＝1.03倍。正答の表示位置D。

出典：[feature-refresh-edits](https://code.visualstudio.com/docs/agents/run/review-code-edits)、[feature-refresh-trust](https://code.visualstudio.com/docs/agents/concepts/trust-and-safety)

### q-d1-e07-feature-20261016：URLの送信承認と応答承認

- 難度：本番相当／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：現在の要求・応答設定と、そのまま保つ方針がすべて本文にある。正答は変更なしで、仕様照合をほぼ要しない。

VS CodeのLocal harnessで、URL取得と外部MCP検索を比較します。URLはapproveRequest: false、approveResponse: true、MCP検索はPre-approvalなし・Post-approvalなしです。通信開始の確認方針は維持し、外部データをChatへ入れる前には両経路で毎回確認します。変更対象の組合せはどれですか。

- A：URLのapproveResponseをfalseにし、MCPのPost-approval自動化を外す **【正答】**
- B：URLのapproveRequestをtrueにし、MCPのPost-approval自動化を外す
- C：URLのapproveResponseをfalseにし、MCPのPre-approval自動化を外す
- D：URLのapproveRequestをtrueにし、MCPのPre-approval自動化を外す

**① 選択肢単体の再読**

本文の条件「通信開始の確認方針は維持」「Chatへ入れる前」「両経路」を外して四案を再読し、各案の操作・範囲・時点を比較した。送信前確認を変えてしまい、URLの応答取込は自動のままである。 MCP側を実行前へ変えても結果取込の自動化が残る。 変更する段階が両経路とも違う。 独立した受験者の実験ではない。

**② 必要な判断**

1. URLの要求・応答とMCPの実行前・取込前を分ける。
2. 不足するのが取込前確認だと特定する。
3. 送信側を変えず各経路の取込設定を変更する。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessで、URL取得と外部MCP検索を比較します。URLはapproveRequest: false、approveResponse: true、MCP検索はPre-approvalなし・Post-approvalなしです。URLは送信前確認を省き応答は自動取込のまま、MCPだけ結果取込前に毎回確認します。変更対象の組合せはどれですか。

変更後の正答：B。URLは要求を自動化する変更、MCPは結果だけ確認する変更となる。

**④ 決定材料**

「通信開始の確認方針は維持」／「Chatへ入れる前」／「両経路」

**⑤ 誤答の理由**

- B：送信前確認を変えてしまい、URLの応答取込は自動のままである。
- C：MCP側を実行前へ変えても結果取込の自動化が残る。
- D：変更する段階が両経路とも違う。

**⑥ 文字長・位置**：正答51文字／誤答中央値49文字＝1.04倍。正答の表示位置A。

出典：[feature-refresh-approval](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d1-a11-feature-20261016：従量課金接続時の自動補完

- 難度：応用／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：meteredでの自動要求抑制と明示要求の違いは実仕様。コマンド識別が中心で応用の入口。

VS Codeのbuilt-in Copilot providerで、接続がmeteredへ変わった後からghost textとNESの自動要求が止まりました。Copilotは有効で、認証・疎通も正常です。Chatは引き続き使えます。ネットワークの従量制設定を保ったまま、一回のコード候補を取得して原因を切り分ける操作はどれですか。

- A：Configure Inline Suggestionsでモデルだけを変更する
- B：Next Edit Suggestionsの自動要求だけを有効にし直す
- C：Trigger Inline Suggestionで候補を明示要求する **【正答】**
- D：Chatのmodel pickerで会話モデルだけを変更する

**① 選択肢単体の再読**

本文の条件「meteredへ変わった後」「一回のコード候補」を外して四案を再読し、各案の操作・範囲・時点を比較した。モデル変更はmeteredによる自動要求抑制を取り除かない。 自動要求を有効にしても接続の従量制条件は残る。 Chatモデルはghost textの自動要求を直接変更しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. サービス障害と自動要求の抑制を分ける。
2. 明示的なインライン要求で取得を試す。

**③ 条件変更例（同じ4択）**

VS Codeのbuilt-in Copilot providerで、接続がmeteredへ変わった後からghost textとNESの自動要求が止まりました。Copilotは有効で、認証・疎通も正常です。Chatは引き続き使えます。ネットワークの従量制設定を保ったまま、インライン提案で使うモデルの選択だけを変更する操作はどれですか。

変更後の正答：A。インラインモデルの変更が目的なら専用の設定操作を選びChatモデルとは分ける。

**④ 決定材料**

「meteredへ変わった後」／「一回のコード候補」

**⑤ 誤答の理由**

- A：モデル変更はmeteredによる自動要求抑制を取り除かない。
- B：自動要求を有効にしても接続の従量制条件は残る。
- D：Chatモデルはghost textの自動要求を直接変更しない。

**⑥ 文字長・位置**：正答35文字／誤答中央値35文字＝1.00倍。正答の表示位置C。

出典：[feature-refresh-inline](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)

### q-d1-a17-feature-20261016：同名シンボルの比較対象を添付する

- 難度：応用／D4・d4o1。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：二つのシンボルを指定する操作と、シンボル候補に開いたファイルが必要な条件を組み合わせる。応用として成立する。

VS CodeのCopilot Chatで、別フォルダにある同名のparse関数を比較します。ファイル全体やフォルダ全体ではなく、二つの関数を文脈として明示したいと考えています。片方のファイルしか開いていないとき、どの操作が合いますか。

- A：Add ContextのFiles & Foldersで、対象の二ファイルを選ぶ
- B：両ファイルを開き、Add ContextのSymbolsで対象の関数を選ぶ **【正答】**
- C：Add ContextのFiles & Foldersで、二つのフォルダを選ぶ
- D：Chatに#codebaseを指定し、コードベース全体の検索を使う

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「二つの関数を文脈として明示」「片方のファイルしか開いていない」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。単なるfile添付の案はこの問題へ統合。シンボル候補の条件と添付の粒度を問う。

**② 必要な判断**

1. 対象は既知の二つの関数で、ファイル全体ではないと整理する。
2. 両ファイルを開き、Symbolsで個別に添付する。
3. シンボルは対象ファイルを開いて候補に出す。二つの関数単位で指定する要件に合う。

**③ 条件変更例（同じ4択）**

VS CodeのCopilot Chatで、別フォルダにある同名のparse関数を比較します。二つの関数だけでなく、それらを含む二ファイル全体を文脈として明示したいと考えています。片方のファイルしか開いていないとき、どの操作が合いますか。

変更後の正答：A。ファイル全体が必要ならFiles & Foldersで二ファイルを添付する。

**④ 決定材料**

「二つの関数を文脈として明示」／「片方のファイルしか開いていない」

**⑤ 誤答の理由**

- A：ファイル全体を指定する場合は適切だが、今回の関数単位という粒度とは違う。
- C：周辺を広く含める場合は使えるが、今回求める二関数の明示より広い。
- D：探索が必要な場合の手段で、既知の二関数だけを明示する操作ではない。

**⑥ 文字長・位置**：正答37文字／誤答中央値39文字＝0.95倍。正答の表示位置B。

出典：[feature-refresh-context](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-sc07-1-feature-20261016：非TTYで指定セッションを再開

- 難度：応用／D2・d2o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：非TTY・複数候補・既知IDという条件でresume/continue/新規を区別する。コマンド識別中心だが実務上の条件はある。

Copilot CLIの復旧スクリプトで、値なしの--resumeを使うと選択画面へ進めず失敗しました。TTYはなく、直近セッションは別タスクです。再開するIDは記録されており、会話履歴を保ったままその作業を続けます。置き換える指定はどれですか。

- A：--resume=記録したIDで対象セッションを直接指定する **【正答】**
- B：--continueで直近セッションをそのまま再開する
- C：--resumeの値を省略し、対話選択へもう一度進める
- D：-iで同じ依頼文を渡し、新しいセッションを開始する

**① 選択肢単体の再読**

本文の条件「TTYはなく」「直近セッションは別タスク」「IDは記録」を外して四案を再読し、各案の操作・範囲・時点を比較した。直近が別タスクという条件に合わない。 TTY不足という失敗原因が残る。 同じ依頼文でも過去の会話を再開することにはならない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 対話選択の失敗と履歴の再開対象を分ける。
2. 既知IDを明示して過去セッションを特定する。

**③ 条件変更例（同じ4択）**

Copilot CLIの復旧スクリプトで、値なしの--resumeを使うと選択画面へ進めず失敗しました。TTYはなく、今回は記録した固定IDではなく実行時の直近セッションを再開します。再開先を固定IDへ限定しない方針です。置き換える指定はどれですか。

変更後の正答：B。再開対象の選択方針が固定IDから実行時の直近へ変わればcontinueを使う。固定IDのresumeはその方針に合わない。

**④ 決定材料**

「TTYはなく」／「直近セッションは別タスク」／「IDは記録」

**⑤ 誤答の理由**

- B：直近が別タスクという条件に合わない。
- C：TTY不足という失敗原因が残る。
- D：同じ依頼文でも過去の会話を再開することにはならない。

**⑥ 文字長・位置**：正答30文字／誤答中央値27文字＝1.11倍。正答の表示位置A。

出典：[feature-refresh-cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-d5-e05-feature-20261016：Code review専用の準備環境

- 難度：本番相当／D5・d5o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：レビュー専用準備という要望と専用ファイル名を対応させる一仕様。応用には使えるが本番相当の多段階判断ではない。

repoのcopilot-setup-steps.ymlはcloud agentとcode reviewの双方で使われています。レビュー専用のcopilot-code-review.ymlも用意したところ、レビューでは共通側だけに追加した解析ツールが見つかりません。実装Agentの準備を増やさず、レビューだけへこのツールを導入するにはどこを直しますか。

- A：copilot-setup-steps.ymlへ解析ツールの導入stepを置く
- B：レビューのパス別Instructionsへ導入コマンドだけを書く
- C：copilot-code-review.ymlへ解析ツールの導入stepを置く **【正答】**
- D：依頼者のローカルIDEへ解析ツールを導入する

**① 選択肢単体の再読**

本文の条件「copilot-code-review.ymlも用意」「実装Agentの準備を増やさず」を外して四案を再読し、各案の操作・範囲・時点を比較した。実装側の準備を増やさない条件に合わず、レビュー専用定義も直さない。 Instructionsは事前に環境を準備するworkflowではない。 GitHub側の一時環境へローカル導入は引き継がれない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 共通setupとレビュー専用環境の参照を分ける。
2. 事前導入と自然言語の指示を区別する。
3. レビュー専用workflowへ導入を置く。

**③ 条件変更例（同じ4択）**

repoのcopilot-setup-steps.ymlはcloud agentとcode reviewの双方で使われています。レビュー専用のcopilot-code-review.ymlも用意したところ、レビューでは共通側だけに追加した解析ツールが見つかりません。レビュー専用workflowは廃止して共通setupへ統一し、両方へこのツールを導入するにはどこを直しますか。

変更後の正答：A。共通化して両方へ導入する方針なら共通setupにstepを置く。

**④ 決定材料**

「copilot-code-review.ymlも用意」／「実装Agentの準備を増やさず」

**⑤ 誤答の理由**

- A：実装側の準備を増やさない条件に合わず、レビュー専用定義も直さない。
- B：Instructionsは事前に環境を準備するworkflowではない。
- D：GitHub側の一時環境へローカル導入は引き継がれない。

**⑥ 文字長・位置**：正答39文字／誤答中央値32文字＝1.22倍。正答の表示位置C。

出典：[feature-refresh-setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)、[feature-refresh-review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d4-e08-feature-20261016：同名Agentの優先順位と固定版

- 難度：本番相当／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：現在PRには開始時版・新規taskで新版という結論を本文が要望として提示し、正答がそのまま繰り返す。階層の設定差を推論する課題になっていない。

GitHub.comでEnterprise、Organization、repoに同名のカスタムAgentがあります。repo版を選んで作ったPR-Pの後で、repo版だけを更新しました。その後P内で追加依頼し、同じbranchから新規タスクQも開始します。追加依頼と新規タスクで使われる定義を、階層と版の二点から判定するとどれですか。

- A：PもQも更新後のrepo版を使う
- B：Pは開始時のrepo版、QはOrganization版を使う
- C：Pは開始時のrepo版、Qは更新後のrepo版を使う **【正答】**
- D：PもQもEnterprise版を使う

**① 選択肢単体の再読**

本文の条件「repo版だけを更新」「P内で追加依頼」「新規タスクQ」を外して四案を再読し、各案の操作・範囲・時点を比較した。PR内でも常に最新へ差し替わると誤解している。 新規タスクでも同名repo版があるためOrganization版へ落ちない。 上位階層が下位を常に上書きするという逆の解釈である。 独立した受験者の実験ではない。

**② 必要な判断**

1. 同名定義の階層優先順位を判定する。
2. 既存PRの版固定と新規タスクの読込を分ける。
3. 各タスクのrepo版と更新時点を組み合わせる。

**③ 条件変更例（同じ4択）**

GitHub.comでEnterprise、Organization、repoに同名のカスタムAgentがあります。repo版を更新した後にPR-Pを作成しました。その後P内で追加依頼し、同じbranchから新規タスクQも開始します。追加依頼と新規タスクで使われる定義を、階層と版の二点から判定するとどれですか。

変更後の正答：A。両タスクが更新後に始まるならどちらも更新後のrepo版になる。

**④ 決定材料**

「repo版だけを更新」／「P内で追加依頼」／「新規タスクQ」

**⑤ 誤答の理由**

- A：PR内でも常に最新へ差し替わると誤解している。
- B：新規タスクでも同名repo版があるためOrganization版へ落ちない。
- D：上位階層が下位を常に上書きするという逆の解釈である。

**⑥ 文字長・位置**：正答26文字／誤答中央値18文字＝1.44倍。正答の表示位置C。

出典：[feature-refresh-custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

### q-d4-e04-feature-20261016：Prompt Fileのツール優先順位

- 難度：本番相当／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：Prompt Fileが優先・未接続ツールは無視という二規則を本文が教える。残るreadを選ぶ集合の演算で、Copilot知識を測れていない。

VS CodeのLocal harnessで、カスタムAgentはtools: [read, search]です。Prompt FileはagentでそのAgentを指し、tools: [read, metrics/get]を持ちます。readとsearchは接続済みで、metricsのMCPは未接続です。ツール提供一覧の決定元と、metricsを使うために足りないものを組み合わせた説明はどれですか。

- A：Agentのtoolsが優先されており、metricsにはMCP接続が必要
- B：二つのtoolsは合成されており、metricsにはPrompt File名の変更が必要
- C：Prompt Fileのtoolsが優先されており、metricsにはMCP接続が必要 **【正答】**
- D：Prompt Fileのtoolsが優先されており、metricsには読取の自動承認だけが必要

**① 選択肢単体の再読**

本文の条件「tools: [read, metrics/get]」「MCPは未接続」を外して四案を再読し、各案の操作・範囲・時点を比較した。Agent優先ならsearchが候補に出るはずで、観測と合わない。 合成という規則ではなく、ファイル名も接続を作らない。 実行承認は未接続サーバーのツールを提供しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. Prompt FileとAgentの優先順位を判定する。
2. 接続状態と実行承認を分ける。
3. 一覧の修正とMCP接続が別の操作だと結論する。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessで、カスタムAgentはtools: [read, search]です。Prompt Fileにはagent指定だけがありtools指定はありません。readとsearchは接続済みで、metricsのMCPは未接続です。ツール提供一覧の決定元と、metricsを使うために足りないものを組み合わせた説明はどれですか。

変更後の正答：A。Prompt Fileでtoolsを省略すればAgentの一覧が使われる。metricsは引き続き未接続なので接続が別に必要である。

**④ 決定材料**

「tools: [read, metrics/get]」／「MCPは未接続」

**⑤ 誤答の理由**

- A：Agent優先ならsearchが候補に出るはずで、観測と合わない。
- B：合成という規則ではなく、ファイル名も接続を作らない。
- D：実行承認は未接続サーバーのツールを提供しない。

**⑥ 文字長・位置**：正答43文字／誤答中央値44文字＝0.98倍。正答の表示位置C。

出典：[feature-refresh-prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)、[feature-refresh-tools](https://code.visualstudio.com/docs/agents/run/tools)

### q-d3-a19-feature-20261016：Copilotの接続診断の取得

- 難度：応用／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：到達性診断・詳細ログ・保存ログ・Electron Consoleの用途を区別する。語義対応が強いが、応用の入口として使える。

VS CodeのCopilot Chatだけ接続が不安定です。Chat DiagnosticsのReachabilityでは接続先が全て成功でしたが、同じ操作を繰り返すと失敗します。サポートは「次の再現時の詳細イベントが必要」と依頼しました。依頼内容に合う次の操作はどれですか。

- A：Chat DiagnosticsのReachabilityだけを再取得して送る
- B：Set Log LevelでTraceへ上げて再現し、新しい詳細ログを取得する **【正答】**
- C：Open Extension Logs Folderで既存ログだけを送る
- D：Toggle Developer ToolsのConsoleだけを既存ログの代わりに送る

**① 選択肢単体の再読**

本文の条件「Reachabilityでは接続先が全て成功」「次の再現時の詳細イベント」を外して四案を再読し、各案の操作・範囲・時点を比較した。要求されているのは接続先一覧だけではなく再現時のイベントである。 現在の不足する粒度の既存ログを送るだけになる。 通常ログの詳細化という要求に対してConsoleだけへ飛ぶ根拠がない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 診断済みの範囲と不足するイベントを分ける。
2. ログレベルを上げて新たに再現記録する。

**③ 条件変更例（同じ4択）**

VS CodeのCopilot Chatだけ接続が不安定です。Chat DiagnosticsのReachabilityでは接続先が全て成功でしたが、同じ操作を繰り返すと失敗します。サポートは「設定変更はせず、既に保存された拡張ログだけ送ってほしい」と依頼しました。依頼内容に合う次の操作はどれですか。

変更後の正答：C。既存ログだけの提出ならログフォルダから収集する。

**④ 決定材料**

「Reachabilityでは接続先が全て成功」／「次の再現時の詳細イベント」

**⑤ 誤答の理由**

- A：要求されているのは接続先一覧だけではなく再現時のイベントである。
- C：現在の不足する粒度の既存ログを送るだけになる。
- D：通常ログの詳細化という要求に対してConsoleだけへ飛ぶ根拠がない。

**⑥ 文字長・位置**：正答39文字／誤答中央値39文字＝1.00倍。正答の表示位置B。

出典：[feature-refresh-logs](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/view-logs)、[network](https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors)

### q01-feature-20261016：コマンド承認と他のツールの承認

- 難度：応用／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：承認を残す範囲は具体的。ただし「拒否ルール」は実行禁止と誤読され、falseで確認を要求する意味が選択肢から伝わらない。正式キーの接頭辞も省略されている。

VS CodeのLocal harnessを既定の承認レベルで使います。chat.tools.terminal.autoApproveにはnpmをtrueにする規則があります。npm testは自動実行させ、npm publishだけは毎回確認したいと考えています。編集・検索の承認とsandboxは維持します。実行禁止と確認要求を区別した設定はどれですか。

- A：同じ設定にnpm publishへ一致するfalse規則を追加する **【正答】**
- B：同じ設定のnpm規則をfalseへ変え、npm全体へ確認を求める
- C：chat.tools.eligibleForAutoApprovalでターミナル全体をfalseにする
- D：PreToolUse hookでnpm publishへpermissionDecision: denyを返す

**① 選択肢単体の再読**

本文の条件「npm testは自動」「npm publishだけ」「実行禁止と確認要求」を外して四案を再読し、各案の操作・範囲・時点を比較した。testまで確認が必要になり自動実行を保てない。 ターミナル全体へ確認が広がりtestも自動実行できない。 denyは実行を止めるため、人が確認して許可する要望とは異なる。 独立した受験者の実験ではない。

**② 必要な判断**

1. 特定コマンドの確認とツール全体の確認を分ける。
2. falseの確認要求とhookのdenyを区別して設定する。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessを既定の承認レベルで使います。chat.tools.terminal.autoApproveにはnpmをtrueにする規則があります。npm testは自動実行させ、npm publishは確認で許可できないよう実行自体を禁止したいと考えています。編集・検索の承認とsandboxは維持します。実行禁止と確認要求を区別した設定はどれですか。

変更後の正答：D。実行の禁止が目的ならPreToolUseのdenyを使い、autoApproveのfalseとは区別する。

**④ 決定材料**

「npm testは自動」／「npm publishだけ」／「実行禁止と確認要求」

**⑤ 誤答の理由**

- B：testまで確認が必要になり自動実行を保てない。
- C：ターミナル全体へ確認が広がりtestも自動実行できない。
- D：denyは実行を止めるため、人が確認して許可する要望とは異なる。

**⑥ 文字長・位置**：正答33文字／誤答中央値51文字＝0.65倍。正答の表示位置A。

出典：[feature-refresh-approval](https://code.visualstudio.com/docs/agents/run/approvals)

### q-sc03-1-feature-20261016：CLIの非対話実行と出力

- 難度：応用／D2・d2o2。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：非対話の終了と回答のみ出力という二条件を、-pと--silentへ対応させる。実在の近接起動方法を比較できる。

スクリプトからGitHub Copilot CLIへ一つのプロンプトを渡します。回答後にプロセスを終了し、標準出力には利用統計を付けず回答だけを受け取りたい場合、どの起動オプションの組合せが合いますか。

- A：-iでプロンプトを渡し、対話セッションを開いたままにする
- B：-pでプロンプトを渡し、--silentは付けず通常出力を受け取る
- C：--resumeだけを指定し、選択画面から過去セッションを選ぶ
- D：-pでプロンプトを渡し、--silentで回答のみを出す **【正答】**

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「回答後にプロセスを終了」「回答だけ」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。単純なCLIの定義でなく、実行寿命と出力形式の二条件を選ぶ。

**② 必要な判断**

1. 終了する実行方式と、統計を付けない出力形式を分ける。
2. 単発の-pと出力を絞る--silentを組み合わせる。
3. -pは回答後に終了する非対話実行で、--silentは統計などを省いて回答のみを出す。

**③ 条件変更例（同じ4択）**

スクリプトからGitHub Copilot CLIへ一つのプロンプトを渡します。最初の回答後も同じプロセスで対話を続けたい場合、どの起動オプションの組合せが合いますか。

変更後の正答：A。対話を続けるなら-iで初期プロンプトを渡す。

**④ 決定材料**

「回答後にプロセスを終了」／「回答だけ」

**⑤ 誤答の理由**

- A：-iは回答後も対話を継続する場合に使う。
- B：-pで終了できるが、回答のみの出力にする指定がない。
- C：過去セッションの対話的な再開であり、一つの新規プロンプトの非対話実行ではない。

**⑥ 文字長・位置**：正答28文字／誤答中央値31文字＝0.90倍。正答の表示位置D。

出典：[feature-refresh-cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-d2-e01-feature-20261016：Agentのセットアップworkflowの検出条件

- 難度：本番相当／D5・d5o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：正答だけが正式job名とdefault branchを満たす。他案は常に壊れた構成を残すので、本文を隠しても正規構成だけを選べる。

Copilot cloud agentのsetupを比較します。repo-Pはdefault branchの正しいworkflowパスにjob prepareがあり、repo-Qはjob copilot-setup-stepsを持ちますがfeature branchにしかありません。両方とも通常Actionsとしては成功します。新規Agentタスクで準備を使えるようにする、repo別の最小修正はどれですか。

- A：Pはworkflowをdefault branchへ反映し、Qはjob名を修正する
- B：Pはjob名を修正し、Qはworkflowをdefault branchへ反映する **【正答】**
- C：PもQもjob名を修正し、branch配置は維持する
- D：PもQもworkflowをdefault branchへ反映し、job名は維持する

**① 選択肢単体の再読**

本文の条件「repo-Pはdefault branch」「repo-Qはjob copilot-setup-steps」「feature branchにしか」を外して四案を再読し、各案の操作・範囲・時点を比較した。それぞれ既に満たす条件を直し、不足を残している。 Qの不足はjob名ではなくbranch配置である。 Pの不足はbranch配置ではなくjob名である。 独立した受験者の実験ではない。

**② 必要な判断**

1. 通常Actionsの成否と専用setupの認識条件を分ける。
2. 正式job名とdefault branchをrepo別に照合する。
3. 既に満たす条件を変えず不足だけ修正する。

**③ 条件変更例（同じ4択）**

Copilot cloud agentのsetupを比較します。repo-Pもworkflowはfeature branchだけにありjob名はcopilot-setup-stepsで、repo-Qはjob copilot-setup-stepsを持ちますがfeature branchにしかありません。両方とも通常Actionsとしては成功します。新規Agentタスクで準備を使えるようにする、repo別の最小修正はどれですか。

変更後の正答：D。両repoでjob名が正しくbranch配置だけ不足するなら、両方をdefault branchへ反映する。

**④ 決定材料**

「repo-Pはdefault branch」／「repo-Qはjob copilot-setup-steps」／「feature branchにしか」

**⑤ 誤答の理由**

- A：それぞれ既に満たす条件を直し、不足を残している。
- C：Qの不足はjob名ではなくbranch配置である。
- D：Pの不足はbranch配置ではなくjob名である。

**⑥ 文字長・位置**：正答41文字／誤答中央値41文字＝1.00倍。正答の表示位置B。

出典：[feature-refresh-setup](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)

### q-d3-a16-feature-20261016：ローカル未コミット変更の入力

- 難度：応用／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：未pushのローカル変更とGitHub上の版を分ける題材は妥当。ただし正答一件だけがローカル最新版を扱い、他三案がGitHub側に寄る。

ローカルVS CodeでAPIの型を変更しました。GitHubの同じbranchは旧型で、まだcommitもpushもしていません。GitHub.comのCopilot Chatは旧型を使って回答しました。修正を公開せず、型定義全体を読み取った説明が必要です。次に指定する文脈と実行場所はどれですか。

- A：ローカルIDEのChatで、型名だけを本文に書いて自動検索へ任せる
- B：ローカルIDEのChatで、修正済み型定義ファイルを明示添付する **【正答】**
- C：GitHub.comのChatで、同じbranchの型定義ファイルを指定する
- D：Copilot Spaceへ、GitHub上の型定義ファイルをリンクする

**① 選択肢単体の再読**

本文の条件「commitもpushもしていません」「修正を公開せず」「型定義全体」を外して四案を再読し、各案の操作・範囲・時点を比較した。全体を読み取る対象の明示という条件に対して、型名だけでは指定が弱い。 GitHub上は旧版であり未pushのローカル変更を取得できない。 GitHubリンクも同じく共有済み旧版を参照する。 独立した受験者の実験ではない。

**② 必要な判断**

1. 共有済みbranchとローカル変更を分ける。
2. 手元のファイル全体を明示添付する。

**③ 条件変更例（同じ4択）**

ローカルVS CodeでAPIの型を変更しました。GitHubの同じbranchは旧型で、まだcommitもpushもしていません。GitHub.comのCopilot Chatは旧型を使って回答しました。今回は手元の修正版ではなくGitHub上の旧型を説明し、IDEを使わずChatを続けます。次に指定する文脈と実行場所はどれですか。

変更後の正答：C。GitHub上の版を説明する目的ならGitHub.comのファイル文脈が適切である。

**④ 決定材料**

「commitもpushもしていません」／「修正を公開せず」／「型定義全体」

**⑤ 誤答の理由**

- A：全体を読み取る対象の明示という条件に対して、型名だけでは指定が弱い。
- C：GitHub上は旧版であり未pushのローカル変更を取得できない。
- D：GitHubリンクも同じく共有済み旧版を参照する。

**⑥ 文字長・位置**：正答32文字／誤答中央値36文字＝0.89倍。正答の表示位置B。

出典：[feature-refresh-context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[repository-indexing](https://docs.github.com/en/copilot/concepts/context/repository-indexing)

### q-d5-a15-feature-20261016：MCP入力IDと環境変数の接続

- 難度：応用／D6・d6o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：秘密入力としてmasked input参照だけが妥当。非表示・実値の受け渡しを同時に満たす正答に対し、パスやダミー値の誤答が弱い。

VS Codeのstdio MCPがAPI_KEY環境変数を要求します。共有mcp.jsonの入力定義はid: apiKey、type: promptString、password: trueですが、env.API_KEYは文字列"apiKey"のままです。入力欄は隠れるのにサーバーでは認証失敗になります。秘密値を共有ファイルへ書かずに直す箇所はどれですか。

- A：env.API_KEYで${input:apiToken}を参照し、マスク入力を維持する
- B：env.API_TOKENで${input:apiKey}を参照し、マスク入力を維持する
- C：env.API_TOKENで${input:apiToken}を参照し、マスク入力を維持する
- D：env.API_KEYで${input:apiKey}を参照し、マスク入力を維持する **【正答】**

**① 選択肢単体の再読**

本文の条件「env.API_KEYは文字列"apiKey"」「入力欄は隠れる」を外して四案を再読し、各案の操作・範囲・時点を比較した。指定する入力IDはapiKeyでありapiTokenではない。 入力IDは合うがサーバーが読む環境変数API_KEYとは異なる。 入力IDと渡す環境変数の両方が違う。 独立した受験者の実験ではない。

**② 必要な判断**

1. マスク入力と環境変数への値の接続を分ける。
2. input参照を正しいenvへ指定する。

**③ 条件変更例（同じ4択）**

VS Codeのstdio MCPがAPI_TOKEN環境変数を要求します。共有mcp.jsonの入力定義はid: apiKey、type: promptString、password: trueですが、env.API_KEYは文字列"apiKey"のままです。入力欄は隠れるのにサーバーでは認証失敗になります。秘密値を共有ファイルへ書かずに直す箇所はどれですか。

変更後の正答：B。サーバーが読む環境変数だけAPI_TOKENに変われば、同じapiKey入力をAPI_TOKENへ渡す。

**④ 決定材料**

「env.API_KEYは文字列"apiKey"」／「入力欄は隠れる」

**⑤ 誤答の理由**

- A：指定する入力IDはapiKeyでありapiTokenではない。
- B：入力IDは合うがサーバーが読む環境変数API_KEYとは異なる。
- C：入力IDと渡す環境変数の両方が違う。

**⑥ 文字長・位置**：正答42文字／誤答中央値44文字＝0.95倍。正答の表示位置D。

出典：[mcp-config](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)

### q-d6-e07-feature-20261016：CLIとMCPの二つの入力経路

- 難度：本番相当／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：CLI非対応という仕様まで本文が与え、正答だけが両方の機密取得経路を閉じる。製品知識より安全な包括策を選ぶ作り。

Copilot CLIで機密ファイルを扱います。通常補完ではContent Exclusionが効きますが、CLIでviewと社内MCP検索から内容を取得できました。非機密の検索は残したまま、次回CLIではviewと機密MCPをモデルに提供しない方針です。起動時の候補制限とサーバー制御をどのように組み合わせますか。

- A：viewは実行時に拒否し、機密MCPは候補から外す
- B：viewは候補から外し、機密MCPは実行時に拒否する
- C：viewと機密MCPを、どちらも候補に残して実行時に拒否する
- D：viewと機密MCPを、どちらも利用可能な候補から外す **【正答】**

**① 選択肢単体の再読**

本文の条件「viewと社内MCP検索」「モデルに提供しない」を外して四案を再読し、各案の操作・範囲・時点を比較した。viewの実行拒否と候補提供停止は違う。 MCPの実行拒否ではモデルの選択試行は残る。 両経路を拒否するが、候補を提供しないという方針に合わない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 通常補完とCLIの保護範囲を区別する。
2. ローカルと外部検索の取得経路を分ける。
3. 提供停止の方針を両経路へ適用する。

**③ 条件変更例（同じ4択）**

Copilot CLIで機密ファイルを扱います。通常補完ではContent Exclusionが効きますが、CLIでviewと社内MCP検索から内容を取得できました。非機密の検索は残したまま、次回CLIではviewは候補に残して実行だけ拒否し、機密MCPは候補から外す方針です。起動時の候補制限とサーバー制御をどのように組み合わせますか。

変更後の正答：A。ローカル側だけ実行時拒否へ変えた方針ならBとなる。元の候補停止要件は残さない。

**④ 決定材料**

「viewと社内MCP検索」／「モデルに提供しない」

**⑤ 誤答の理由**

- A：viewの実行拒否と候補提供停止は違う。
- B：MCPの実行拒否ではモデルの選択試行は残る。
- C：両経路を拒否するが、候補を提供しないという方針に合わない。

**⑥ 文字長・位置**：正答27文字／誤答中央値26文字＝1.04倍。正答の表示位置D。

出典：[exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)、[cli-tool-permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-d3-a14-feature-20261016：有効なツールを明示して使う

- 難度：応用／D4・d4o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：既知のsearch_catalogを使いたいので同名ツールを明示する、という起動操作の識別に留まる。

VS CodeのCopilotで、社内仕様はMCPのsearch_catalog、作業repoは通常のコード検索へ分かれています。両方とも有効で接続済みですが、同名APIについて質問するとrepo内の旧説明だけが使われます。今回は社内カタログの検索結果を明示的に使います。入力時の指定はどれですか。

- A：#codebaseでrepo全体を指定し、API名を検索対象にする
- B：Add Contextでrepoの旧説明ファイルを指定し、API名を質問する
- C：#のツール候補からsearch_catalogを選び、API名を検索対象にする **【正答】**
- D：#の候補から通常のコード検索を選び、API名を検索対象にする

**① 選択肢単体の再読**

本文の条件「search_catalog」「repo内の旧説明だけ」「社内カタログ」を外して四案を再読し、各案の操作・範囲・時点を比較した。repo検索を明示しても社内カタログへ切り替わらない。 旧説明の添付は現在の仕様を取得する目的と逆である。 今回使いたい外部カタログではなく従来の経路を指定している。 独立した受験者の実験ではない。

**② 必要な判断**

1. 接続の可否と今回選ばれた検索経路を分ける。
2. 外部MCPツールを入力で明示する。

**③ 条件変更例（同じ4択）**

VS CodeのCopilotで、社内仕様はMCPのsearch_catalog、作業repoは通常のコード検索へ分かれています。両方とも有効で接続済みですが、同名APIについて質問するとrepo内の旧説明だけが使われます。今回は外部カタログを使わずrepo全体の記述を調べます。入力時の指定はどれですか。

変更後の正答：A。repo全体が対象ならcodebaseの指定が合う。

**④ 決定材料**

「search_catalog」／「repo内の旧説明だけ」／「社内カタログ」

**⑤ 誤答の理由**

- A：repo検索を明示しても社内カタログへ切り替わらない。
- B：旧説明の添付は現在の仕様を取得する目的と逆である。
- D：今回使いたい外部カタログではなく従来の経路を指定している。

**⑥ 文字長・位置**：正答39文字／誤答中央値33文字＝1.18倍。正答の表示位置C。

出典：[feature-refresh-tools](https://code.visualstudio.com/docs/agents/run/tools)

### q-d5-e01-feature-20261016：未pushの修正を実行検証する場所

- 難度：本番相当／D5・d5o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：未pushをローカルで編集・実行したいという条件がローカルAgentへ直結する。Agentの選択として応用には使えるが、本番相当には軽い。

VS CodeのAgents windowでrepo-Aを実行先にして、repo-Bを資料添付しました。Bの未コミット変更を含む説明は得られますが、修正はAへ保存されます。GitHub上のBにはその変更がありません。今回はBの手元の変更を公開せず、Copilotに編集・実行を反復させます。実行先、文脈、役割をそろえる構成はどれですか。

- A：Bを実行ワークスペースにしたローカルAgentで、Bの作業内容を使う **【正答】**
- B：Aを実行ワークスペースにしたローカルAgentで、Bを添付して使う
- C：Bを対象にしたcloud agentで、GitHub上のbranchを使う
- D：Bを実行ワークスペースにしたローカルAskで、Bの作業内容を使う

**① 選択肢単体の再読**

本文の条件「repo-Aを実行先」「Bの未コミット変更」「公開せず」「編集・実行を反復」を外して四案を再読し、各案の操作・範囲・時点を比較した。資料添付は実行ワークスペースをBへ変更しない。 cloud側の共有済みbranchには未コミット変更がない。 文脈と場所は合うがAskでは編集・実行の反復を委任しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 回答の参照元と実際の変更先が異なることを診断する。
2. ローカル変更とGitHub側の版を区別する。
3. Bを実行先にしたローカルAgentへ作業を委任する。

**③ 条件変更例（同じ4択）**

VS CodeのAgents windowでrepo-Aを実行先にして、repo-Bを資料添付しました。Bの未コミット変更を含む説明は得られますが、修正はAへ保存されます。GitHub上のBにはその変更がありません。今回はAを編集・実行し、Bは参照する資料として使います。実行先、文脈、役割をそろえる構成はどれですか。

変更後の正答：B。Bを編集対象から参照専用へ変えた目的なら既存のA実行セッションを維持できる。

**④ 決定材料**

「repo-Aを実行先」／「Bの未コミット変更」／「公開せず」／「編集・実行を反復」

**⑤ 誤答の理由**

- B：資料添付は実行ワークスペースをBへ変更しない。
- C：cloud側の共有済みbranchには未コミット変更がない。
- D：文脈と場所は合うがAskでは編集・実行の反復を委任しない。

**⑥ 文字長・位置**：正答34文字／誤答中央値33文字＝1.03倍。正答の表示位置A。

出典：[feature-refresh-cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)、[feature-refresh-tools](https://code.visualstudio.com/docs/agents/run/tools)、[feature-refresh-context](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-d5-e04-feature-20261016：補完モデルとChatモデルの別設定

- 難度：応用／D5・d5o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：Chatとインラインの設定経路の差は製品機能。どのコントロールを開くかが中心で応用の入口。

VS CodeでChatのモデルをNへ変えても、ghost textにはMが使われています。担当者はNESを切り替える案を出しましたが、今回はghost textのモデルだけをNへ変え、ChatのNと各言語の有効設定は保ちます。調べる設定入口はどれですか。

- A：Chatのmodel pickerのモデル選択
- B：Next Edit Suggestionsの有効設定
- C：Copilotの言語別有効設定
- D：Configure Inline Suggestionsのモデル選択 **【正答】**

**① 選択肢単体の再読**

本文の条件「ghost textにはM」「モデルだけをN」「有効設定は保ち」を外して四案を再読し、各案の操作・範囲・時点を比較した。Chatは既にNでありghost text側を切り替える操作ではない。 NESの有効化はghost textモデルの選択ではない。 提案の有効・無効は選ぶモデルを変更しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. Chatとインライン提案の設定範囲を分ける。
2. 有効化ではなく提案モデルの入口を選ぶ。

**③ 条件変更例（同じ4択）**

VS CodeでChatのモデルをNへ変えても、ghost textにはMが使われています。担当者はNESを切り替える案を出しましたが、今回はghost textのMは保ち、Chatのモデルだけを別の利用可能モデルへ変えます。調べる設定入口はどれですか。

変更後の正答：A。会話だけの変更ならChatのmodel pickerが合う。

**④ 決定材料**

「ghost textにはM」／「モデルだけをN」／「有効設定は保ち」

**⑤ 誤答の理由**

- A：Chatは既にNでありghost text側を切り替える操作ではない。
- B：NESの有効化はghost textモデルの選択ではない。
- C：提案の有効・無効は選ぶモデルを変更しない。

**⑥ 文字長・位置**：正答34文字／誤答中央値23文字＝1.48倍。正答の表示位置D。

出典：[feature-refresh-inline](https://code.visualstudio.com/docs/editing/ai-powered-suggestions)、[feature-refresh-models](https://docs.github.com/en/copilot/reference/ai-models/supported-models)

### q-d4-e09-feature-20261016：CLIの文脈内訳とツール定義の削減

- 難度：本番相当／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：詳細を失ったら元資料を再取得する、という一般のLLM会話の対処で解ける。compact固有の操作・参照状態との照合がない。

Copilot CLIで/contextを見ると、MCP Toolsが65%、Messagesが10%を占めています。複数のMCPを接続していますが、今回必要なのは社内検索一つだけです。会話の方針と必要なツールを保ち、占有の大きい部分を減らします。compactの対象とツール定義の違いを踏まえた次の操作はどれですか。

- A：不要なMCPツールの提供を外し、/contextで内訳を再確認する **【正答】**
- B：/compactへ今回の方針を指定し、会話履歴を要約する
- C：/session checkpointsで過去の要約を開き、引継ぎ内容だけ確認する
- D：大きい出力の保存しきい値を上げ、MCPの結果全文を文脈へ入れる

**① 選択肢単体の再読**

本文の条件「MCP Toolsが65%、Messagesが10%」「必要なのは社内検索一つ」を外して四案を再読し、各案の操作・範囲・時点を比較した。Messagesの占有が主因なら候補だが、今回はMCP定義が主である。 過去の要約を確認しても、大きなMCP定義の占有は減らない。 出力のプレビューを全文へ増やすため、文脈節約の方向とは逆になる。 独立した受験者の実験ではない。

**② 必要な判断**

1. contextの内訳から占有の主因を特定する。
2. 会話要約と固定ツール定義の対象範囲を分ける。
3. 必要な検索を残して不要な定義を減らす。

**③ 条件変更例（同じ4択）**

Copilot CLIで/contextを見ると、MCP Toolsが10%、Messagesが65%を占めています。複数のMCPを接続していますが、今回必要なのは社内検索一つだけです。会話の方針と必要なツールを保ち、占有の大きい部分を減らします。compactの対象とツール定義の違いを踏まえた次の操作はどれですか。

変更後の正答：B。占有の主因が会話履歴へ変われば、方針を指定したcompactで履歴を要約する案が合う。

**④ 決定材料**

「MCP Toolsが65%、Messagesが10%」／「必要なのは社内検索一つ」

**⑤ 誤答の理由**

- B：Messagesの占有が主因なら候補だが、今回はMCP定義が主である。
- C：過去の要約を確認しても、大きなMCP定義の占有は減らない。
- D：出力のプレビューを全文へ増やすため、文脈節約の方向とは逆になる。

**⑥ 文字長・位置**：正答33文字／誤答中央値31文字＝1.06倍。正答の表示位置A。

出典：[feature-refresh-context-model](https://code.visualstudio.com/docs/agents/concepts/context)、[feature-refresh-context](https://code.visualstudio.com/docs/chat/copilot-chat-context)、[feature-repair-cli-context](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management)、[feature-refresh-cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-d3-e04：Agentの取得経路とContent Exclusion

- 難度：本番相当／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：Agentは除外非対応という根拠を本文が明示し、正答だけが機密へのアクセス境界を守る。未知の対応範囲を診断する課題になっていない。

Copilot Businessで機密ファイルをContent Exclusionへ登録しました。対応する通常補完では除外表示が出ますが、VS CodeのAgentではファイル読取が成功します。ファイルはシンボリックリンクではなく、パス一致と設定反映も確認済みです。通常補完の保護を残し、Agentからも内容を取得させない対処はどれですか。

- A：通常補完の除外を保ち、Agentの機密MCPサーバーだけを外す
- B：通常補完の除外を保ち、Agentを機密ファイルのない実行環境へ移す **【正答】**
- C：通常補完の除外を公開コード一致Blockへ替え、Agentを機密のない環境へ移す
- D：通常補完の除外を公開コード一致Blockへ替え、Agentの機密MCPだけを外す

**① 選択肢単体の再読**

本文の条件「通常補完では除外表示」「Agentではファイル読取が成功」「パス一致と設定反映も確認済み」を外して四案を再読し、各案の操作・範囲・時点を比較した。MCPを外すだけではAgentのローカル読取が残る。 Agentの経路は直るが通常補完の入力除外を出力フィルタへ置き換えてしまう。 ローカル読取が残り、通常補完の入力除外も失う。 独立した受験者の実験ではない。

**② 必要な判断**

1. パスと反映の失敗を観測で除く。
2. 通常補完とAgentの対応範囲を照合する。
3. 非対応経路へ独立したアクセス境界を置く。

**③ 条件変更例（同じ4択）**

Copilot Businessで機密ファイルをContent Exclusionへ登録しました。対応する通常補完では除外表示が出ますが、VS CodeのAgentはローカルの機密を読めませんが、機密MCPからだけ内容を取得できます。ファイルはシンボリックリンクではなく、パス一致と設定反映も確認済みです。通常補完の保護を残し、Agentからも内容を取得させない対処はどれですか。

変更後の正答：A。取得経路がMCPだけなら、そのMCPの提供停止が必要になる。ローカルファイルを別環境へ移すだけでは外部MCPの応答を止めない。

**④ 決定材料**

「通常補完では除外表示」／「Agentではファイル読取が成功」／「パス一致と設定反映も確認済み」

**⑤ 誤答の理由**

- A：MCPを外すだけではAgentのローカル読取が残る。
- C：Agentの経路は直るが通常補完の入力除外を出力フィルタへ置き換えてしまう。
- D：ローカル読取が残り、通常補完の入力除外も失う。

**⑥ 文字長・位置**：正答33文字／誤答中央値40文字＝0.82倍。正答の表示位置B。

出典：[exclusion-concept](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

### q-sc01-2：Seat管理元による除外の差

- 難度：応用／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：一致するOrganizationルールが残ると本文が示し、同じルールを正答として選ぶ。削除済みルール・Git追跡・公開一致が弱い誤答。

同じEnterpriseのrepoでsecret.keyの機密解除が承認されました。repo管理者は個別除外を削除しましたが、AからSeatを受ける利用者Xだけ除外が残り、BからSeatを受けるYは通常補完を使えます。両者のファイル、クライアント、反映時刻は同じです。次に確認する設定の範囲はどれですか。

- A：組織BのSeat利用者向けの除外ルール
- B：repo全利用者へ適用する別の除外ルール
- C：組織AのSeat利用者向けの除外ルール **【正答】**
- D：repoで削除済みのsecret.key個別ルール

**① 選択肢単体の再読**

本文の条件「AからSeat」「Xだけ除外」「BからSeat」を外して四案を再読し、各案の操作・範囲・時点を比較した。BのSeatを持つYは利用できており、B側ルールはXだけの除外を説明しない。 同条件でYは参照でき、repo全員の共通設定だけでは差を説明しにくい。 削除と反映を確認した個別ルールだけではSeat提供元による差を説明できない。 独立した受験者の実験ではない。

**② 必要な判断**

1. repo共通とSeat管理元の差を比較する。
2. Xだけに適用される組織側の除外を調べる。

**③ 条件変更例（同じ4択）**

同じEnterpriseのrepoでsecret.keyの機密解除が承認されました。repo管理者は個別除外を削除しましたが、XもYも除外が残り、repo側に別の一致ルールが見つかりました。両者のファイル、クライアント、反映時刻は同じです。次に確認する設定の範囲はどれですか。

変更後の正答：B。全員に共通する残存repoルールが見つかれば、そのrepo設定を確認する。

**④ 決定材料**

「AからSeat」／「Xだけ除外」／「BからSeat」

**⑤ 誤答の理由**

- A：BのSeatを持つYは利用できており、B側ルールはXだけの除外を説明しない。
- B：同条件でYは参照でき、repo全員の共通設定だけでは差を説明しにくい。
- D：削除と反映を確認した個別ルールだけではSeat提供元による差を説明できない。

**⑥ 文字長・位置**：正答19文字／誤答中央値20文字＝0.95倍。正答の表示位置C。

出典：[exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)、[exclusion-concept](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

### q-sc02-2-feature-20261016：クラウドAgentの変更範囲

- 難度：本番相当／D2・d2o3。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：repoごとのtask/PRという実仕様の題材。ただし三案がAのtaskを維持し、一案だけA/Bを分けるため形で推測しやすい。

Copilot cloud agentのタスクはrepo-Aを変更先にして始めました。repo-Bのコードを読むMCPは接続済みで、Bを含む説明は得られますがBのPRは作られていません。今回はAのAPI変更とBの呼出側変更をそれぞれPRにし、双方で相手repoの仕様を参照させます。参照権限と変更先を分けた進め方はどれですか。

- A：Aのタスクだけを使い、BはMCPの読取文脈として与える
- B：Bのタスクだけを使い、AはMCPの読取文脈として与える
- C：AとBで別タスクを作り、相手repoの参照文脈は両方から外す
- D：AとBで別タスクを作り、それぞれに相手repoの読取文脈を与える **【正答】**

**① 選択肢単体の再読**

本文の条件「repo-Aを変更先」「それぞれPR」「相手repoの仕様」を外して四案を再読し、各案の操作・範囲・時点を比較した。Bを読めてもBを変更先とするPR作成にはならない。 逆にAを変更先とする作業がなくなる。 PRは分けられるが両方で相手仕様を参照する条件が失われる。 独立した受験者の実験ではない。

**② 必要な判断**

1. MCP読取とcloudタスクの変更先を分ける。
2. PRを作るrepoごとにタスクが必要と判定する。
3. 相互参照の文脈は各タスクへ保つ。

**③ 条件変更例（同じ4択）**

Copilot cloud agentのタスクはrepo-Aを変更先にして始めました。repo-Bのコードを読むMCPは接続済みで、Bを含む説明は得られますがBのPRは作られていません。今回はAだけを変更してPRを作り、Bは現在の仕様を読む資料として使います。参照権限と変更先を分けた進め方はどれですか。

変更後の正答：A。Bを編集しない方針ならAのタスクとBの読取文脈で足りる。

**④ 決定材料**

「repo-Aを変更先」／「それぞれPR」／「相手repoの仕様」

**⑤ 誤答の理由**

- A：Bを読めてもBを変更先とするPR作成にはならない。
- B：逆にAを変更先とする作業がなくなる。
- C：PRは分けられるが両方で相手仕様を参照する条件が失われる。

**⑥ 文字長・位置**：正答32文字／誤答中央値27文字＝1.19倍。正答の表示位置D。

出典：[feature-refresh-cloud](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github)

### q-d1-a19-feature-20261016：MCPの一部ツールだけ無効化

- 難度：応用／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：ツールを候補から外すことと実行承認を要求することを分ける。必要なsearchを保つ制約もあるが、応用の入口。

VS CodeのCopilotへ接続したMCPサーバーはsearchとupdateを提供します。updateの自動承認を外したところ、Agentはupdateを選び続けて確認待ちになります。今はsearchを使い続け、updateを選ぶ試行自体を止めます。他のChatへ影響を広げない変更はどれですか。

- A：Manage Tool ApprovalでupdateのPre-approvalだけを外す
- B：MCPサーバー全体を停止し、次回の接続まで無効にする
- C：Manage Tool ApprovalでupdateのPost-approvalだけを外す
- D：現在のChatのツール選択でupdateだけを無効にする **【正答】**

**① 選択肢単体の再読**

本文の条件「updateを選び続けて」「試行自体を止め」「他のChat」を外して四案を再読し、各案の操作・範囲・時点を比較した。既に実施した変更であり、選択を試みることは止めない。 searchも失われ他Chatへの影響が広い。 結果取込の設定は実行前の候補選択を止めない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 承認待ちと候補提供を区別する。
2. Chat単位で不要なツールだけ外す。

**③ 条件変更例（同じ4択）**

VS CodeのCopilotへ接続したMCPサーバーはsearchとupdateを提供します。updateの自動承認を外したところ、Agentはupdateを選び続けて確認待ちになります。今はsearchを使い続け、updateは選べるまま、実行前に毎回確認します。他のChatへ影響を広げない変更はどれですか。

変更後の正答：A。候補を保ち実行確認だけ必要ならPre-approvalの自動化を外す。

**④ 決定材料**

「updateを選び続けて」／「試行自体を止め」／「他のChat」

**⑤ 誤答の理由**

- A：既に実施した変更であり、選択を試みることは止めない。
- B：searchも失われ他Chatへの影響が広い。
- C：結果取込の設定は実行前の候補選択を止めない。

**⑥ 文字長・位置**：正答28文字／誤答中央値45文字＝0.62倍。正答の表示位置D。

出典：[feature-refresh-tools](https://code.visualstudio.com/docs/agents/run/tools)

### q-d1-a16-feature-20261016：承認後も残るsandboxのアクセス制限

- 難度：応用／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：sandboxで必要なディレクトリを許可したいので許可先を追加する、という要望の直訳。実在の設定範囲の比較が薄い。

VS CodeのLocal harnessでターミナルをAllow allにしましたが、作業フォルダ外の生成物へのアクセスが拒否されます。sandboxログにファイルシステム境界の拒否があり、ネットワーク拒否はありません。sandboxは維持し、必要な生成物ディレクトリだけを使わせます。変更すべき範囲はどれですか。

- A：sandboxのファイルシステム許可先へ対象ディレクトリを追加する **【正答】**
- B：ターミナルの自動承認へ対象コマンドのtrue規則を追加する
- C：sandboxのネットワーク許可先へ生成物サーバーを追加する
- D：MCPのPre-approvalへファイル読取の自動承認を追加する

**① 選択肢単体の再読**

本文の条件「Allow all」「ファイルシステム境界」「sandboxは維持」を外して四案を再読し、各案の操作・範囲・時点を比較した。Allow allでも残るsandbox拒否を承認追加で解除できない。 ログはネットワークではなくローカルパスの拒否を示す。 ターミナルのsandbox境界をMCP承認で変えられない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 承認済みでも残るsandbox制限を特定する。
2. ネットワークではなく必要なファイルシステム範囲を追加する。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessでターミナルはAllow allですが、外部の生成物サーバーへのアクセスだけがsandboxで拒否されます。ローカルディレクトリへのアクセスは許可済みです。sandboxを保ち、このサーバーへの通信だけを使えるようにします。変更する設定範囲はどれですか。

変更後の正答：C。拒否された境界をローカルパスからネットワークへ変えたケース。ローカル拒否という観測やディレクトリだけを追加する目的は残さない。

**④ 決定材料**

「Allow all」／「ファイルシステム境界」／「sandboxは維持」

**⑤ 誤答の理由**

- B：Allow allでも残るsandbox拒否を承認追加で解除できない。
- C：ログはネットワークではなくローカルパスの拒否を示す。
- D：ターミナルのsandbox境界をMCP承認で変えられない。

**⑥ 文字長・位置**：正答33文字／誤答中央値30文字＝1.10倍。正答の表示位置A。

出典：[feature-refresh-approval](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d3-e02-feature-20261016：GitHub外repoの意味索引の利用条件

- 難度：本番相当／D3・d3o1。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：GitHub.com/GHE.comの対応差とUnconfigured時の管理許可を照合する。二つの独立した製品条件が必要。

Copilot Businessを使う二つの環境で、VS CodeからGitLabの作業repoを意味索引化しようとしています。一方はGitHub.com、もう一方はGHE.comに接続します。クライアントは対応版で、Semantic indexing for non-GitHub repositoriesの組織ポリシーはUnconfiguredです。GitHub.com側で必要な管理操作と、GHE.com側の対応可否について、正しい組合せはどれですか。

- A：GitHub.com側は追加のポリシー変更が不要で、GHE.com側はこの機能の対象外となる
- B：GitHub.com側はポリシーの有効化が必要で、GHE.com側はこの機能の対象外となる **【正答】**
- C：GitHub.com側はポリシーの有効化が必要で、GHE.com側も同じ変更で利用できる
- D：GitHub.com側は追加のポリシー変更が不要で、GHE.com側も変更なしで利用できる

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「もう一方はGHE.com」「組織ポリシーはUnconfigured」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。一般のGitLab接続ではなく、Copilotの外部repo意味索引の明示ポリシーとホスト対応を照合する。

**② 必要な判断**

1. 二環境の対応可否をGitHub.comとGHE.comで分ける。
2. GitHub.comでも管理対象のUnconfiguredは無効で、Enabledが必要と照合する。
3. GitHub.comでは管理者が有効化し、GHE.comは同じ設定だけでは利用できないと結論する。

**③ 条件変更例（同じ4択）**

Copilot Businessを使う二つの環境で、VS CodeからGitLabの作業repoを意味索引化しようとしています。一方はGitHub.com、もう一方はGHE.comに接続します。クライアントは対応版で、Semantic indexing for non-GitHub repositoriesの組織ポリシーはEnabledです。GitHub.com側で必要な管理操作と、GHE.com側の対応可否について、正しい組合せはどれですか。

変更後の正答：A。GitHub.com側の追加の有効化操作は不要になるが、GHE.comの非対応は変わらない。

**④ 決定材料**

「もう一方はGHE.com」／「組織ポリシーはUnconfigured」

**⑤ 誤答の理由**

- A：Unconfiguredのままでは管理対象の利用許可にならない。
- C：GitHub.com側の操作は合うが、GHE.comはこの機能の対応環境ではない。
- D：未設定時の管理許可とGHE.comの対応範囲の両方を取り違えている。

**⑥ 文字長・位置**：正答45文字／誤答中央値45文字＝1.00倍。正答の表示位置B。

出典：[repository-indexing](https://docs.github.com/en/copilot/concepts/context/repository-indexing)、[feature-refresh-policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)

### q-d2-a26-feature-20261016：一回だけのツール承認

- 難度：応用／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：今回だけ許可したい→今回だけ許可という直接照合。承認の機能は関連するが応用としては軽い。

VS CodeでMCPの更新ツールについてセッション中の自動承認が保存されています。現在の呼出しと次回の呼出しは、入力を見て一回ずつ承認する方針へ変えます。他ツールの保存済み承認は保ちます。どの手順を組み合わせますか。

- A：対象ツールのPost-approval自動化を外し、実行前の自動承認は維持する
- B：対象ツールのPre-approval自動化を外し、現在の呼出しを一回だけ承認する **【正答】**
- C：Reset Tool Confirmationsを実行し、現在の呼出しをセッション中許可する
- D：対象ツールを候補から外し、現在の呼出しをワークスペースで許可する

**① 選択肢単体の再読**

本文の条件「セッション中の自動承認」「一回ずつ」「他ツール」を外して四案を再読し、各案の操作・範囲・時点を比較した。結果取込だけ変えても実行前の自動承認は残る。 他ツールも消し、再びセッション許可するので次回の入力確認も失う。 候補除外と継続的な許可はいずれも一回ずつ使う方針に合わない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 残っている保存済み承認を対象ツールだけ外す。
2. 実行前確認と一回の承認範囲を組み合わせる。

**③ 条件変更例（同じ4択）**

VS CodeでMCPの更新ツールについてセッション中の自動承認が保存されています。現在の呼出しと次回の呼出しは、実行前の自動承認は維持し、結果をChatへ入れる前に毎回確認する方針へ変えます。他ツールの保存済み承認は保ちます。どの手順を組み合わせますか。

変更後の正答：A。確認したい段階が結果取込ならPost-approvalを変更し、既存のPre-approvalを維持する。

**④ 決定材料**

「セッション中の自動承認」／「一回ずつ」／「他ツール」

**⑤ 誤答の理由**

- A：結果取込だけ変えても実行前の自動承認は残る。
- C：他ツールも消し、再びセッション許可するので次回の入力確認も失う。
- D：候補除外と継続的な許可はいずれも一回ずつ使う方針に合わない。

**⑥ 文字長・位置**：正答40文字／誤答中央値39文字＝1.03倍。正答の表示位置B。

出典：[feature-refresh-approval](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d6-e04-feature-20261016：除外の設定主体と適用利用者

- 難度：本番相当／D6・d6o1。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：repo利用者と管理Seat対象の範囲を交差して判断する。一方、全ての無関係repoを除外する誤答は弱く、残すなら近接スコープへ変えたい。

同一Enterpriseのrepo-Rを、組織AのSeat利用者Xと組織BのSeat利用者Yが使います。repo管理者とAのownerの双方が設定可能です。Rのprivate/**だけをXとYの通常補完から除外し、他repoは変えません。管理対象Seat向け設定とrepo設定を比較した場合、どちらを使いますか。

- A：組織AのSeat向け除外へrepo-Rのprivate/**を設定する
- B：repo-RのContent Exclusionへprivate/**を設定する **【正答】**
- C：組織BのSeat向け除外へrepo-Rのprivate/**を設定する
- D：組織AのSeat向け除外へ全repoのprivate/**を設定する

**① 選択肢単体の再読**

本文の条件「XとY」「他repoは変えません」「管理対象Seat」を外して四案を再読し、各案の操作・範囲・時点を比較した。Xには適用できるがBのSeat利用者Yの範囲を満たさない。 Y側だけとなりXの条件を満たさない。 Yを含めないうえ他repoまで変わる。 独立した受験者の実験ではない。

**② 必要な判断**

1. 適用対象の利用者集合をSeat管理元で比較する。
2. repo範囲と利用者範囲を別々に絞る。
3. R内の全対象者へ適用するrepo設定を選ぶ。

**③ 条件変更例（同じ4択）**

同一Enterpriseのrepo-Rを、組織AのSeat利用者Xと組織BのSeat利用者Yが使います。repo管理者とAのownerの双方が設定可能です。Rのprivate/**をXだけから除外し、Yと他repoは変えません。管理対象Seat向け設定とrepo設定を比較した場合、どちらを使いますか。

変更後の正答：A。AのSeat利用者だけへRの限定パスを適用するならAの組織設定を使う。

**④ 決定材料**

「XとY」／「他repoは変えません」／「管理対象Seat」

**⑤ 誤答の理由**

- A：Xには適用できるがBのSeat利用者Yの範囲を満たさない。
- C：Y側だけとなりXの条件を満たさない。
- D：Yを含めないうえ他repoまで変わる。

**⑥ 文字長・位置**：正答40文字／誤答中央値35文字＝1.14倍。正答の表示位置B。

出典：[exclusion-concept](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)

### q-d1-a07-feature-20261016：クラウドAgentの外部接続制限

- 難度：応用／D1・d1o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：cloudとlocal proxy、firewall全停止とドメイン許可の区別は必要。ただし正答だけが限定許可で、安全さも手掛かりになる。

Copilot cloud agentのBashから社内仕様サイトを取得すると、Copilot firewallの拒否ログが出ます。ローカルIDEとsetup stepsでは同じサイトへ到達できます。repoの許可ドメインには社内サイトがありません。既存サイトへのアクセスとfirewallを保ったまま直す設定はどれですか。

- A：ローカルIDEのproxy許可先へ社内ドメインを追加する
- B：MCPサーバーのツール一覧へWeb検索ツールを追加する
- C：repoのCopilot Internet accessでfirewallを無効にする
- D：repoのCopilot Internet accessで社内ドメインを追加する **【正答】**

**① 選択肢単体の再読**

本文の条件「Bash」「Copilot firewall」「既存サイトへのアクセスとfirewallを保った」を外して四案を再読し、各案の操作・範囲・時点を比較した。ローカル側は成功しておりcloudの拒否を解除しない。 MCPツールの提供はBash経路の許可先を変更しない。 firewallを維持する要件に反する。 独立した受験者の実験ではない。

**② 必要な判断**

1. ローカル・setupとAgentの通信境界を分ける。
2. repoの許可先だけを追加する。

**③ 条件変更例（同じ4択）**

Copilot cloud agentのBashから社内仕様サイトを取得すると、Copilot firewallの拒否ログが出ます。ローカルIDEとsetup stepsでは同じサイトへ到達できます。repoの許可ドメインには社内サイトがありません。既存サイトへのアクセスは保ち、承認済みの隔離環境でAgent firewallを無効化する設定はどれですか。

変更後の正答：C。firewall無効化そのものが承認された目的なら設定の無効化を選ぶ。通常の推奨策に一般化しない。

**④ 決定材料**

「Bash」／「Copilot firewall」／「既存サイトへのアクセスとfirewallを保った」

**⑤ 誤答の理由**

- A：ローカル側は成功しておりcloudの拒否を解除しない。
- B：MCPツールの提供はBash経路の許可先を変更しない。
- C：firewallを維持する要件に反する。

**⑥ 文字長・位置**：正答40文字／誤答中央値28文字＝1.43倍。正答の表示位置D。

出典：[feature-refresh-firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)

### q-d4-a01-feature-20261016：Prompt Fileのモデル省略

- 難度：応用／D4・d4o2。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：Prompt Fileのmodelとpickerの二つの優先関係・変更範囲を比較する。四択は同じ設定の組合せで、応用として成立する。

VS CodeのLocal harnessで、現在のmodel pickerは利用可能なモデルMを選択しています。使うPrompt Fileにはmodel指定がありません。このプロンプトだけは別の利用可能なモデルNで実行し、通常の選択Mは維持したい場合、必要な設定だけを変える案はどれですか。

- A：model pickerをNへ変え、Prompt Fileのmodelは省略する
- B：Prompt Fileにmodel: Mを指定し、model pickerだけNへ変える
- C：Prompt Fileにmodel: Nを指定し、model pickerのMは維持する **【正答】**
- D：Prompt Fileにmodel: Nを指定し、model pickerもNへ変える

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「model指定がありません」「通常の選択Mは維持」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。管理でモデルを解放する問題ではなく、許可済みモデルの選択範囲を分ける。

**② 必要な判断**

1. 省略時にはmodel pickerのMを使うと整理する。
2. プロンプトだけNにするmodel指定を使う。
3. そのプロンプトのmodelをNに固定し、通常の選択Mを保てる。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessで、現在のmodel pickerは利用可能なモデルMを選択しています。使うPrompt Fileにはmodel指定がありません。このプロンプトを含む現在のChat全体を利用可能なモデルNで進めたい場合、必要な設定だけを変える案はどれですか。

変更後の正答：A。現在Chatのモデル全体を変えるならmodel pickerをNへ変更する。

**④ 決定材料**

「model指定がありません」／「通常の選択Mは維持」

**⑤ 誤答の理由**

- A：model省略時はpickerに従うが、通常の選択もNへ変わる。
- B：Prompt Fileの明示Mが今回に適用され、要求するNにならない。
- D：今回Nは使えるが、通常の選択Mを維持する要件を満たさない。

**⑥ 文字長・位置**：正答44文字／誤答中央値43文字＝1.02倍。正答の表示位置C。

出典：[feature-refresh-prompt](https://code.visualstudio.com/docs/agent-customization/prompt-files)、[feature-refresh-models](https://docs.github.com/en/copilot/reference/ai-models/supported-models)

### q-d4-a02-feature-20261016：CopilotのWeb参照キャッシュ

- 難度：応用／D3・d3o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：Askの暗黙文脈とAgentの添付候補の差は題材になるが、実際に問う操作は「ファイル全体を明示添付」の識別。

VS CodeのCopilot Chatで#fetchから仕様URLを読みました。直後にサイトが更新され、ブラウザでは新版ですが、同じURLを再取得したChatは旧版を引用します。URLと質問、モデルは同じです。内容の手動コピーはせず、CopilotのWeb参照を更新するために試す操作はどれですか。

- A：ブラウザだけを再読み込みし、VS Codeは起動したまま使う
- B：Chatのモデルだけを変更し、同じURLのWeb参照を使う
- C：言語別のインライン提案だけを切り替え、同じChatを使う
- D：VS Codeを再起動し、同じURLのWeb参照を取り直す **【正答】**

**① 選択肢単体の再読**

本文の条件「ブラウザでは新版」「同じURLを再取得したChatは旧版」「手動コピーはせず」を外して四案を再読し、各案の操作・範囲・時点を比較した。ブラウザ側の更新はCopilot側のキャッシュを更新しない。 モデル変更をWeb取得キャッシュの更新操作として当てにしない。 インライン提案の有効化はChatのWeb取得と別の設定である。 独立した受験者の実験ではない。

**② 必要な判断**

1. URL先の更新とCopilotが持つ取得内容を分ける。
2. VS Code側のWeb取得キャッシュを再起動で更新する。

**③ 条件変更例（同じ4択）**

VS CodeのCopilot Chatは仕様URLの新版を引用していますが、外部ブラウザだけが旧版を表示します。今回はCopilotには触れず、外部ブラウザの表示だけを取り直します。どの操作が合いますか。

変更後の正答：A。更新対象を外部ブラウザへ限定した代替ケース。Copilotの旧キャッシュという元の問題は解決済みにそろえる。

**④ 決定材料**

「ブラウザでは新版」／「同じURLを再取得したChatは旧版」／「手動コピーはせず」

**⑤ 誤答の理由**

- A：ブラウザ側の更新はCopilot側のキャッシュを更新しない。
- B：モデル変更をWeb取得キャッシュの更新操作として当てにしない。
- C：インライン提案の有効化はChatのWeb取得と別の設定である。

**⑥ 文字長・位置**：正答29文字／誤答中央値29文字＝1.00倍。正答の表示位置D。

出典：[feature-refresh-context-model](https://code.visualstudio.com/docs/agents/concepts/context)、[feature-refresh-context](https://code.visualstudio.com/docs/chat/copilot-chat-context)

### q-d2-a04-feature-20261016：CLI承認の保存範囲

- 難度：応用／D2・d2o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：ツール承認とURL承認の保存範囲を比較する実仕様。場所ごとの別ファイルではなく、一つのpermissions-config.json内で場所へスコープされる点は表現を明確にしたい。

Copilot CLIの設定ディレクトリにはpermissions-config.jsonとsettings.jsonがあります。repo-AとBでは同じMCPツールを個別にrepo限定で承認し、仕様サイトのURLは恒久承認しました。今後はAのツールだけ再確認させ、Bの承認は保ちます。一方、URLの恒久許可は全セッションから外します。中央の設定ファイルで変更する項目はどれですか。

- A：permissions-config.jsonのAの承認だけを外し、settings.jsonの対象URL許可は保つ
- B：permissions-config.jsonの全場所の承認と、settings.jsonの対象URL許可を外す
- C：permissions-config.jsonのAの承認だけと、settings.jsonの対象URL許可を外す **【正答】**
- D：settings.jsonの対象URL許可だけを外し、permissions-config.jsonの承認は保つ

**① 選択肢単体の再読**

本文の条件「Aのツールだけ」「Bの承認は保ち」「URLの恒久許可は全セッション」を外して四案を再読し、各案の操作・範囲・時点を比較した。Aのツール確認は戻るがURLの恒久許可が残る。 URLは直るがBのツール承認まで消してしまう。 URLは直るがAのツール自動承認が残る。 独立した受験者の実験ではない。

**② 必要な判断**

1. ツールとURLで保存先とスコープを分ける。
2. 場所Aの項目だけと全セッションのURL許可を変更する。

**③ 条件変更例（同じ4択）**

Copilot CLIの設定ディレクトリにはpermissions-config.jsonとsettings.jsonがあります。repo-AとBでは同じMCPツールを個別にrepo限定で承認し、仕様サイトのURLは恒久承認しました。今後はAもBも含め全場所のツール承認を消します。一方、URLの恒久許可は全セッションから外します。中央の設定ファイルで変更する項目はどれですか。

変更後の正答：B。全場所のツール承認を消す方針なら、Aだけでなく全場所の項目とURL許可を外す。

**④ 決定材料**

「Aのツールだけ」／「Bの承認は保ち」／「URLの恒久許可は全セッション」

**⑤ 誤答の理由**

- A：Aのツール確認は戻るがURLの恒久許可が残る。
- B：URLは直るがBのツール承認まで消してしまう。
- D：URLは直るがAのツール自動承認が残る。

**⑥ 文字長・位置**：正答56文字／誤答中央値56文字＝1.00倍。正答の表示位置C。

出典：[cli-tool-permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

### q-sc03-2-feature-20261016：Askの調査から実装へ切り替える

- 難度：本番相当／D2・d2o1。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：AskからAgentへ移り、必要な実行ツールを有効にするという基本的な使い分け。現在の応用より難しいとは評価できない。

VS CodeのLocal harnessで、同じ未コミット変更を持つローカルAgentのPとQを比較します。Pはsandboxのパス許可が足りていますが、npm testの実行前に毎回確認が出ます。QはAllow allでも外部テストデータのパスがsandboxで拒否されます。npm testだけは自動実行を認め、両方のsandboxと他コマンドの確認は保ちます。セッション別の変更はどれですか。

- A：Pはnpm testに一致するautoApproveのtrue規則、Qはsandboxの対象パス許可を追加する **【正答】**
- B：Pはnpm testに一致するautoApproveのfalse規則、Qはsandboxの対象パス許可を追加する
- C：Pはnpm testに一致するautoApproveのtrue規則、Qはsandboxのネットワーク許可を追加する
- D：Pはnpm testに一致するautoApproveのfalse規則、Qはsandboxのネットワーク許可を追加する

**① 選択肢単体の再読**

本文の条件「Pはsandboxのパス許可が足りています」「QはAllow allでも」「他コマンドの確認は保ち」を外して四案を再読し、各案の操作・範囲・時点を比較した。falseは確認を残すのでPの自動実行という目的と逆になる。 Pは直るがQの拒否は通信ではなくパスなので原因に合わない。 Pの確認もQのパス拒否も残る。 独立した受験者の実験ではない。

**② 必要な判断**

1. 確認ダイアログとsandbox拒否の実行段階を分ける。
2. Pのコマンド別承認とQのファイル境界を別の設定へ対応させる。
3. 必要な範囲だけを変更してローカル実行を保つ。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessで、同じ未コミット変更を持つローカルAgentのPとQを比較します。Pはsandboxのパス許可が足りていますが、npm testの実行前に毎回確認が出ます。QはAllow allでローカルパスを読めますが、データサーバーへの通信だけがsandboxで拒否されます。npm testだけは自動実行を認め、両方のsandboxと他コマンドの確認は保ちます。セッション別の変更はどれですか。

変更後の正答：C。Qの拒否だけがネットワーク境界へ変わるなら、Pのtrue規則を保ちQの通信許可を追加する。

**④ 決定材料**

「Pはsandboxのパス許可が足りています」／「QはAllow allでも」／「他コマンドの確認は保ち」

**⑤ 誤答の理由**

- B：falseは確認を残すのでPの自動実行という目的と逆になる。
- C：Pは直るがQの拒否は通信ではなくパスなので原因に合わない。
- D：Pの確認もQのパス拒否も残る。

**⑥ 文字長・位置**：正答55文字／誤答中央値57文字＝0.96倍。正答の表示位置A。

出典：[feature-refresh-ide](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-in-ides)、[feature-refresh-tools](https://code.visualstudio.com/docs/agents/run/tools)、[feature-refresh-approval](https://code.visualstudio.com/docs/agents/run/approvals)

### q-d2-a25：CLIのセッション限定のGit権限

- 難度：応用／D2・d2o2。本文を維持しレビューを更新。
- 出題形式：インシデント切り分け
- 修正前の指摘：ツール提供・実行拒否・保存範囲を区別し、必要なGit操作を残す。具体的な制約のある応用として成立する。

Copilot CLIの今回のセッションでは、シェルを使ったGitの調査やコミットは必要ですが、git pushは実行させません。ほかのセッションの設定や、場所ごとの保存済み承認は変えない方針です。ツールをモデルへ提供する範囲と実行権限を区別し、この条件へ合わせる操作はどれですか。

- A：今回のセッションでGit操作を許可し、git pushには拒否の実行権限を指定する **【正答】**
- B：今回のセッションでシェルをツール候補から外し、モデルへ提供しないようにする
- C：現在の場所に保存した承認をリセットし、各操作を実行する際の確認へ戻す
- D：追加ディレクトリのアクセス許可を見直し、CLIへ提供するパスの範囲を限定する

**① 選択肢単体の再読**

四案は権限と適用範囲の違いで、許可を減らす案が常に正解ではない。必要なツールと今回変更してよい範囲へ照合する。

**② 必要な判断**

1. モデルからシェルを外すと必要な作業も失うため、候補制限と実行権限を分ける。
2. 今回のセッションに必要なGitの許可とPushの拒否を指定し、保存済み承認や追加パスへ変更を広げない。

**③ 条件変更例（同じ4択）**

Copilot CLIの今回のセッションではGitの調査もコミットも不要になりました。シェルを使う操作はモデルの候補から全て外し、ほかのセッションと保存済み承認は変えません。どの操作が合いますか。

変更後の正答：B。今回の利用可能ツールからシェルを外す。git pushだけ拒否する元の方針とは異なる。

**④ 決定材料**

「Gitの調査やコミットは必要」／「git pushは実行させません」／「保存済み承認は変えない」

**⑤ 誤答の理由**

- B：シェルを候補から外すと、必要なGitの調査やコミットもそのツールから行えません。今回は特定操作の実行を拒否する条件です。
- C：保存済み承認は変えない方針です。承認のリセットと特定操作をセッションで拒否する設定は用途が異なります。
- D：追加パスの許可を見直すことは有効な場面もありますが、git pushという操作の実行拒否を指定するものではありません。

**⑥ 文字長・位置**：正答41文字／誤答中央値37文字＝1.11倍。正答の表示位置A。

出典：[cli-tool-permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)、[cli-current](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli)

### q-d2-a18-feature-20261016：CLIで読み込まれた構成を確認

- 難度：応用／D2・d2o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：loaded configurationを確認する/envというコマンド名の想起。他の作業を本文で除外し、応用の判断材料が少ない。

Copilot CLIでMCP設定とAgentプロファイルを追加しましたが、期待するツールが現れません。ファイルの存在は確認済みです。最初は現在のセッションが読み込んだ構成を確認し、未読込なのか実行時エラーなのかを分けます。最初の確認操作はどれですか。

- A：/envで実際に読み込まれた構成を確認する **【正答】**
- B：/diagnoseで現在セッションのログを解析する
- C：/modelで今回のモデル選択を変更する
- D：/usageで今回の利用統計を確認する

**① 選択肢単体の再読**

本文の条件「読み込んだ構成」「未読込なのか実行時エラー」を外して四案を再読し、各案の操作・範囲・時点を比較した。実行ログの診断であり、最初に要求した読込構成の一覧とは異なる。 モデルを変えても設定が読み込まれた証拠にはならない。 利用量の情報は読込構成を示さない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 存在とセッションへの読込を区別する。
2. CLIが提供する構成表示で前提を確認する。

**③ 条件変更例（同じ4択）**

Copilot CLIでMCP設定とAgentプロファイルを追加しましたが、期待するツールが現れません。ファイルの存在は確認済みです。構成は読込済みと確認できました。次は現在セッションで発生した実行時エラーのログを解析します。最初の確認操作はどれですか。

変更後の正答：B。読込を確認済みで実行時ログの解析へ進むならdiagnoseを使う。

**④ 決定材料**

「読み込んだ構成」／「未読込なのか実行時エラー」

**⑤ 誤答の理由**

- B：実行ログの診断であり、最初に要求した読込構成の一覧とは異なる。
- C：モデルを変えても設定が読み込まれた証拠にはならない。
- D：利用量の情報は読込構成を示さない。

**⑥ 文字長・位置**：正答21文字／誤答中央値20文字＝1.05倍。正答の表示位置A。

出典：[feature-refresh-cli-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

### q-sc02-3-feature-20261016：Instructionsの発見と実際の使用

- 難度：応用／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：発見と使用の区別はよいが、正答だけが適用の直接証拠。誤答は存在だけ・モデルだけ・承認履歴を適用とみなす、という明らかな不足。

VS CodeのLocal harnessで、パス別指示がAgent Customizationsには表示されます。ファイルの存在と発見は確認できましたが、回答が規約と違います。指示の未読込と、読込後に指示へ従わなかった場合を分けたいと考えています。遵守は回答内容と別途照合するとして、今回の回答への読込を調べる表示はどれですか。

- A：Agent Customizationsで、発見された指示ファイルを確認する
- B：回答のReferencesで、今回参照された指示ファイルを確認する **【正答】**
- C：model pickerで、今回選ばれたモデルを確認する
- D：Manage Tool Approvalで、今回使える読取の承認を確認する

**① 選択肢単体の再読**

本文の条件「未読込と」「読込後に指示へ従わなかった」「今回の回答」を外して四案を再読し、各案の操作・範囲・時点を比較した。存在・発見と回答への読込を混同している。 モデルの利用可否は特定指示の読込を示さない。 ツール承認の状態は指示への遵守を示さない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 発見・回答への参照・遵守を三段階に分ける。
2. Referencesを調べ、内容との照合も続ける。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessで、パス別指示がAgent Customizationsには表示されます。ファイルの存在と発見は確認できましたが、回答が規約と違います。指示の未読込と、読込後に指示へ従わなかった場合を分けたいと考えています。遵守は回答内容と別途照合するとして、今回の回答への読込ではなく、VS Codeがファイルを発見したかを再確認する表示はどれですか。

変更後の正答：A。発見の再確認にはCustomizationsを使い、回答への適用や遵守の証明とは分ける。

**④ 決定材料**

「未読込と」／「読込後に指示へ従わなかった」／「今回の回答」

**⑤ 誤答の理由**

- A：存在・発見と回答への読込を混同している。
- C：モデルの利用可否は特定指示の読込を示さない。
- D：ツール承認の状態は指示への遵守を示さない。

**⑥ 文字長・位置**：正答33文字／誤答中央値37文字＝0.89倍。正答の表示位置B。

出典：[feature-refresh-vscode-instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)

### q-d1-e01-feature-20261016：Agent PRの実行承認とマージ承認

- 難度：本番相当／D1・d1o2。本文を維持しレビューを更新。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：依頼者のワークフロー承認と、人の必須レビューの担当可否を分ける。A優先の運用条件もあり、二つの承認を一括判断できない。

Copilot cloud agentへ依頼したAが、生成されたPRの確認を担当しています。既定の設定でワークフローが承認待ちです。AもBも書込権限を持ち、Bはタスクの依頼者ではありません。このPRには人による必須承認も必要です。変更内容の確認後、ワークフロー実行と必須レビューを進める担当の組合せはどれですか。Aが行える承認はAが担当する方針です。

- A：Aが実行と人のレビューの両方を承認する
- B：Aが実行を承認し、Bが人のレビューを承認する **【正答】**
- C：Bが実行を承認し、Aが人のレビューを承認する
- D：Bが実行と人のレビューの両方を承認する

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「Bはタスクの依頼者ではありません」「人による必須承認」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。単に承認を推奨する一般論ではなく、Copilot PRでの依頼者制限と実行承認主体の違いを問う。

**② 必要な判断**

1. 実行承認を行える書込権限者と、タスクを依頼したAを整理する。
2. Agent PRの依頼者はそのPRの承認者になれない制限を適用する。
3. Aの実行承認とBのレビューを分離する。

**③ 条件変更例（同じ4択）**

別の担当者CがCopilot cloud agentへ依頼し、依頼者ではないAが、生成されたPRの確認を担当しています。既定の設定でワークフローが承認待ちです。AもBも書込権限を持ち、Bはタスクの依頼者ではありません。このPRには人による必須承認も必要です。変更内容の確認後、ワークフロー実行と必須レビューを進める担当の組合せはどれですか。Aが行える承認はAが担当する方針です。

変更後の正答：A。Aが依頼者でなく必要な権限を持つなら、A優先という方針に従い実行承認とレビューをAが担当できる。

**④ 決定材料**

「Bはタスクの依頼者ではありません」／「人による必須承認」

**⑤ 誤答の理由**

- A：依頼者AはこのAgent PRの人の承認者にはなれない。
- C：実行承認は可能だが、人の承認を依頼者Aへ戻している。
- D：Bでも実行承認はできるが、Aができる承認はAという担当方針より範囲が広い。

**⑥ 文字長・位置**：正答22文字／誤答中央値19文字＝1.16倍。正答の表示位置B。

出典：[feature-refresh-risk](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations)

### q-d4-e05-feature-20261016：Subagentの文脈分離と読取専用ツール

- 難度：本番相当／D4・d4o2。本文・選択肢・解説を改稿。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：文脈とファイルの分離は実在の境界。ただしクライアント・Subagentを別worktreeへ割り当てる実行方法が不明で、本番相当維持は条件付き。

VS CodeのLocal harnessで、主AgentからSubagentへ調査を委任したところ主会話の文脈は短くなりました。しかし両者のツールは同じ作業ディレクトリへアクセスします。今回は中間文脈の分離を保ち、調査中はファイル編集も実行も許可せず、読取・検索だけを認めます。追加worktreeは作りません。Agent定義の変更はどれですか。

- A：Subagentのtoolsをreadとsearchへ限定し、委任は維持する **【正答】**
- B：Subagentのtoolsを省略し、委任は維持する
- C：Subagentのuser-invocableだけをfalseにし、toolsは維持する
- D：主会話でcompactし、Subagentのtoolsは維持する

**① 選択肢単体の再読**

本文の条件「中間文脈の分離を保ち」「読取・検索だけ」「追加worktreeは作りません」を外して四案を再読し、各案の操作・範囲・時点を比較した。省略すると利用可能な全ツールを許すため編集・実行が残り得る。 手動起動可否の設定でありツールの操作能力を制限しない。 compactは主会話の要約で、Subagentの編集・実行能力を制限しない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 文脈分離とファイル操作の権限を分ける。
2. 手動起動設定とtools設定の役割を比較する。
3. 調査委任を保ち提供ツールを読取専用へ絞る。

**③ 条件変更例（同じ4択）**

VS CodeのLocal harnessで、主AgentからSubagentへ調査を委任したところ主会話の文脈は短くなりました。しかし両者のツールは同じ作業ディレクトリへアクセスします。今回は中間文脈の分離を保ち、調査用Agentでは利用可能な全ツールの使用を認め、既存の実行承認は別途扱います。追加worktreeは作りません。Agent定義の変更はどれですか。

変更後の正答：B。全候補を利用させる方針ならtools省略が合う。文脈分離と実行承認はそのまま別の話である。

**④ 決定材料**

「中間文脈の分離を保ち」／「読取・検索だけ」／「追加worktreeは作りません」

**⑤ 誤答の理由**

- B：省略すると利用可能な全ツールを許すため編集・実行が残り得る。
- C：手動起動可否の設定でありツールの操作能力を制限しない。
- D：compactは主会話の要約で、Subagentの編集・実行能力を制限しない。

**⑥ 文字長・位置**：正答38文字／誤答中央値32文字＝1.19倍。正答の表示位置A。

出典：[feature-refresh-context-model](https://code.visualstudio.com/docs/agents/concepts/context)、[feature-refresh-cli-compare](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)、[feature-refresh-custom-agent](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

### q-d1-e04-feature-20261016：除外設定を閲覧できる役割と変更できる役割

- 難度：応用／D6・d6o1。本文を維持しレビューを更新。
- 出題形式：複合制約トレードオフ
- 修正前の指摘：別組織ownerと対象repo Maintainを混同せず、二つのContent Exclusionの編集権限を判定する。応用の比較基準として適切。

Copilot Businessを運用する同一Enterprise内に組織AとBがあります。担当者はAのOrganization ownerですが、Bのrepo-RではMaintainロールです。Aで配布するSeat向けのContent Exclusionと、Bのrepo-R内のContent Exclusionをそれぞれ変更したいと考えています。追加の権限を得る前の、この担当者による設定変更の可否はどれですか。

- A：Aの組織側は変更でき、Bのrepo側は閲覧できるが変更できない **【正答】**
- B：Aの組織側も、Bのrepo側も設定を変更できる
- C：Aの組織側も、Bのrepo側も設定は閲覧のみで変更できない
- D：Bのrepo側は変更でき、Aの組織側は閲覧できるが変更できない

**① 選択肢単体の再読**

四案の判断対象を比較し、本文の「AのOrganization owner」「Bのrepo-RではMaintainロール」がない状態では必要な操作・適用範囲を確定できないことを著者が再読。同じEnterpriseでも別組織のownerとrepoのMaintainを混同しない。単一のロール名の暗記から、二つの設定主体と権限の照合へ変更。

**② 必要な判断**

1. 組織Aの管理Seat向け設定と、別組織Bのrepo内設定を分ける。
2. Aのownerによる組織設定の変更権限と、BのMaintainによる閲覧権限を照合する。
3. Aの組織側だけ変更でき、Bのrepo側にはrepo管理権限が追加で必要と結論する。

**③ 条件変更例（同じ4択）**

Copilot Businessを運用する同一Enterprise内に組織AとBがあります。担当者はAのOrganization ownerですが、Bのrepo-RではAdminロールです。Aで配布するSeat向けのContent Exclusionと、Bのrepo-R内のContent Exclusionをそれぞれ変更したいと考えています。追加の権限を得る前の、この担当者による設定変更の可否はどれですか。

変更後の正答：B。Bのrepo管理者でもあれば、Aの組織設定とBのrepo設定の両方を変更できる。

**④ 決定材料**

「AのOrganization owner」／「Bのrepo-RではMaintainロール」

**⑤ 誤答の理由**

- B：別組織Aのownerであることは、BのrepoでMaintainをAdminへ変えない。
- C：AではOrganization ownerなので、管理Seat向けの除外設定を変更できる。
- D：repo側と組織側の権限を逆に評価している。Maintainとownerは異なる設定主体に対応する。

**⑥ 文字長・位置**：正答31文字／誤答中央値29文字＝1.07倍。正答の表示位置A。

出典：[exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

### q-sc02-1-feature-20261016：指摘修正の成果物を別PRへ分ける

- 難度：本番相当／D5・d5o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：元branch宛の別PRという成果物が本文と正答で同じ語になっている。ボタン選択の応用の入口で、本番相当の推論はない。

Copilot code reviewがfeature/authからmainへのPRに指摘を出しました。Fix with Copilotで修正を委任します。元PRへの直接コミットを避け、修正だけを別PRで確認してから元の変更へ取り込みます。修正の成果物と、元の変更への取り込み方として合うものはどれですか。

- A：宛先をmainにし、修正PRを取り込んでから元PRをmainへ進める
- B：現在のPRへ直接コミットする選択を使い、修正専用PRは作らない
- C：宛先を別の新規branchにし、元PRとの関係を付けずに完了する
- D：宛先をfeature/authにし、修正PRを取り込んでから元PRをmainへ進める **【正答】**

**① 選択肢単体の再読**

本文の条件「feature/authからmain」「元PRへの直接コミットを避け」「元の変更へ取り込み」を外して四案を再読し、各案の操作・範囲・時点を比較した。元の未マージ変更を含む修正をmainへ直接向けると、修正だけを元変更へ取り込む流れと異なる。 先に元PRへ直接コミットすることが分離レビューの条件に反する。 修正を元の変更へ取り込む経路がない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 元PRのheadとbaseを区別する。
2. Fix with Copilotの新PRをhead宛にする。
3. 修正PRの評価・取込と元PRのマージを別段階で進める。

**③ 条件変更例（同じ4択）**

Copilot code reviewがfeature/authからmainへのPRに指摘を出しました。Fix with Copilotで修正を委任します。今回だけは元PRへ直接コミットする方針で、修正専用PRは作りません。修正の成果物と、元の変更への取り込み方として合うものはどれですか。

変更後の正答：B。元PRへの直接変更を許す方針なら直接コミットの選択が合い、修正専用PRの宛先を決める必要はなくなる。

**④ 決定材料**

「feature/authからmain」／「元PRへの直接コミットを避け」／「元の変更へ取り込み」

**⑤ 誤答の理由**

- A：元の未マージ変更を含む修正をmainへ直接向けると、修正だけを元変更へ取り込む流れと異なる。
- B：先に元PRへ直接コミットすることが分離レビューの条件に反する。
- C：修正を元の変更へ取り込む経路がない。

**⑥ 文字長・位置**：正答42文字／誤答中央値32文字＝1.31倍。正答の表示位置D。

出典：[feature-refresh-review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d1-a18-feature-20261016：レビュー後の追加コミット

- 難度：応用／D5・d5o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：一回の再レビューと追加push自動化を区別する実操作。目的に沿う近接操作の比較として応用の入口。

CopilotがPRをレビューした後で、人が指摘へ対応してpushしました。repoのReview new pushesは無効で、今後も自動レビューは増やしません。変更済みコードへの指摘が解消したかをCopilotにもう一度確認させます。コード修正の追加依頼と区別して選ぶ操作はどれですか。

- A：Fix with Copilotで追加の修正タスクを作成する
- B：Review new pushesを有効にし、以後のpushを対象にする
- C：PRのレビュー担当からCopilotへ再レビューを依頼する **【正答】**
- D：PR summaryを再生成し、指摘の状態の代わりに要約を確認する

**① 選択肢単体の再読**

本文の条件「人が指摘へ対応してpush」「今後も自動レビューは増やしません」「もう一度確認」を外して四案を再読し、各案の操作・範囲・時点を比較した。既にある変更の評価ではなく新たな編集作業の依頼になる。 今後の自動レビューを増やさない条件に合わない。 要約生成はレビュー指摘の再評価ではない。 独立した受験者の実験ではない。

**② 必要な判断**

1. 修正作業と変更後のレビューを分ける。
2. 一回の再レビューで自動化方針を保つ。

**③ 条件変更例（同じ4択）**

Copilot code reviewの指摘は未修正で、今回はCopilotに実装変更を委任します。自動レビューのReview new pushesは無効のままとし、作られた修正差分を人が確認します。次にどの操作を使いますか。

変更後の正答：A。修正済みコードの再評価ではなく、未修正の指摘の実装を委任するケースなのでFix with Copilotを使う。

**④ 決定材料**

「人が指摘へ対応してpush」／「今後も自動レビューは増やしません」／「もう一度確認」

**⑤ 誤答の理由**

- A：既にある変更の評価ではなく新たな編集作業の依頼になる。
- B：今後の自動レビューを増やさない条件に合わない。
- D：要約生成はレビュー指摘の再評価ではない。

**⑥ 文字長・位置**：正答29文字／誤答中央値33文字＝0.88倍。正答の表示位置C。

出典：[feature-refresh-review-config](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)、[feature-refresh-review-howto](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)

### q-d6-e01：symlinkとAgentの除外対応範囲

- 難度：本番相当／D6・d6o2。本文・選択肢・解説を改稿。
- 出題形式：インシデント切り分け
- 修正前の指摘：正答だけが二つの限界を分け、他三案は同じ原因だと一括する。さらにAgent非対応は本文で示され、二つの高度な診断にはなっていない。

同じContent Exclusionを三つの経路で検証しました。①実パスを使う通常補完は除外表示、②別workspaceのsymlink経由の通常補完は読取あり、③実パスを使うVS CodeのAgentも読取ありでした。登録パスと反映は①で確認済みです。②と③を追加パターンだけで解決できると考える前に、区別すべき適用上の制約はどれですか。

- A：②はsymlink経由の制約、③はAgentでのContent Exclusion非対応 **【正答】**
- B：②はrepoキーの不一致、③はAgentでのContent Exclusion非対応
- C：②はsymlink経由の制約、③は公開コード一致の出力フィルタ
- D：②はrepoキーの不一致、③は公開コード一致の出力フィルタ

**① 選択肢単体の再読**

本文の条件「symlink経由」「VS CodeのAgent」「①で確認済み」を外して四案を再読し、各案の操作・範囲・時点を比較した。②は同じ対象へのsymlink経由と明示され、repoキー不一致という診断には根拠がない。 ③はローカル読取であり公開コード一致の出力処理ではない。 二つの経路の制約を両方取り違えている。 独立した受験者の実験ではない。

**② 必要な判断**

1. 正常な実パスでパスと反映の不足を除く。
2. symlink経由とAgentの対応範囲を独立に確認する。
3. 異なる制約へ同じパターン追加だけを適用しない。

**③ 条件変更例（同じ4択）**

同じContent Exclusionを三つの経路で検証しました。①実パスを使う通常補完は除外表示、②別repoへコピーしたファイルの通常補完は読取ありで、そのrepoキーは未登録、③実パスを使うVS CodeのAgentも読取ありでした。登録パスと反映は①で確認済みです。②と③を追加パターンだけで解決できると考える前に、区別すべき適用上の制約はどれですか。

変更後の正答：B。②が未登録の別repoならrepo識別の不足であり、③のAgent非対応とは別に直す。

**④ 決定材料**

「symlink経由」／「VS CodeのAgent」／「①で確認済み」

**⑤ 誤答の理由**

- B：②は同じ対象へのsymlink経由と明示され、repoキー不一致という診断には根拠がない。
- C：③はローカル読取であり公開コード一致の出力処理ではない。
- D：二つの経路の制約を両方取り違えている。

**⑥ 文字長・位置**：正答44文字／誤答中央値31文字＝1.42倍。正答の表示位置A。

出典：[exclusion-concept](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion)
