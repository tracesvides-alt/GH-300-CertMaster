# 応用・本番相当の再点検（push後・2026-10-16）

**全91問を再読した結果、全問合格とは評価しない。** Copilotの実機能を題材にする点は改善しているが、選択肢の手掛かり、本文による答えの先出し、難度の逆転、レビュー用の反実仮想の矛盾が残る。前回の完了・採用判定は、問題品質が十分であることの保証にはできなかった。

対象は応用48・本番相当43問。基礎163問を個別に再レビューした結果ではない。アプリの問題・数・分類・除外設定を今回は変更していない。commit・pushも実施していない。

## 集計（項目間の重複あり）

- 選択肢だけで推測する手掛かりの懸念：16問。別に誤答の弱さ等の注意11問。「本文なしで必ず正答できる」と実測した件数ではない。
- 通常の問題自体の優先修正：2問。単一正答の条件不足とCLI実ツール名の不整合。
- 一般論へ寄る判断：4問。機能名が実在することと、その知識を知らないと解けないことを分けた。
- 反実仮想の意味上の破綻：14問。これは通常の問題が同じ件数だけ誤答という意味ではない。

| 現在の難度 | 概ね適合 | 入口・境界 | 現ラベルより軽い | 前提要修正 |
| --- | ---: | ---: | ---: | ---: |
| 応用48問 | 15 | 15 | 18 | 0 |
| 本番相当43問 | 5 | 8 | 29 | 1 |

これは編集上の難度判定であり、受験者の正答率や実試験と等価な難度を測った結果ではない。「三段階推論」の欄を三行埋めることを、本番相当の難度の証明にしない。応用側の88（別組織ownerとrepo Maintainの照合）等を比較基準にすると、現行の本番相当にそれより軽い操作識別が多い。

## 優先して直す内容

1. **通常問題の一意性・設定例。** q-sc03-3-feature-20261016は自動同期が必須と書かれていないため、手動コピーも可能。q-d5-e07-feature-20261016はCLIのtool availabilityにカスタムAgent別名／権限種別に似たread,searchを使う。CLIの標準ツール名と分ける必要がある。具体的なCLI実行結果までは確認していない。

   [CLI公式リファレンス](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)ではavailabilityの値とpermission patternsは別の節で定義される。[Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files)の同期手順は、問題文で自動同期を必須とする条件の代わりにはならない。

2. **誤答と答えの先出し。** q-d2-e01-feature-20261016は正答だけが正式job名とdefault branchの両方を満たし、誤答は常に壊れた構成を残す。q-d1-e02-feature-20261016は「参照が出たのはQだけ」と先に教えてQを選ばせる。q-d4-e04-feature-20261016はツール優先と利用不能時の規則を本文で全部教えている。

3. **本番相当のラベル。** q-d3-e07-feature-20261016は失敗URLを同じURLの選択肢へ写すだけで、診断情報の入口を選ぶ応用q-d3-a19-feature-20261016より軽い。q-sc03-2-feature-20261016やq-sc02-1-feature-20261016も基本の起動・成果物の選択が中心。問題数を増減する前に、今の枠内で機能判断を強化するかラベルを見直す。

4. **レビュー記録の再作成。** q-d2-e01-feature-20261016の条件変更後はjob名が既に正式なのに、変更後の正答がprepareを維持する案。q-d3-e07-feature-20261016ではChatが成功へ変わった後も、末尾がChat復旧の問いのまま。文字列置換成功とanswerId変更だけでは意味は検証できない。

## 判定の限界と前回の工程上の問題

本文・ID・難度・正答を外した選択肢一覧を先に再読し、その後で本文とキーを照合。過去の文脈を知る著者による再読であり、独立したブラインド試験ではない。

前回のpublisherはanswerWithoutReading:false・difficultyConsistent:trueや本番相当のplausibilityを一律に付与する。整合チェッカーは文字列置換・キー変更・記録の存在を検証するが、残存条件の矛盾や別解は検証しない。機械的PASSを意味上の合格へ読み替えない。

原稿と台帳のハッシュ整合テスト、画面の採点・保存テストは、設問の難度や反実仮想の論理まで証明しない。今回も他の評価者による実験ではないため、懸念なしの問題へ「推測不可能」といった保証を付けない。出題形式・クライアント・プランの違いで表面的に条件数を増やすことも難化とは扱わない。

## 出題在庫と網羅性

| Domain | 全在庫 | 全在庫比率 | 応用・本番相当 | 同91問内比率 | シラバス範囲 |
| --- | ---: | ---: | ---: | ---: | --- |
| D1 | 24 | 9.4% | 11 | 12.1% | 15–20% |
| D2 | 98 | 38.6% | 28 | 30.8% | 25–30% |
| D3 | 33 | 13.0% | 10 | 11.0% | 10–15% |
| D4 | 35 | 13.8% | 13 | 14.3% | 10–15% |
| D5 | 32 | 12.6% | 11 | 12.1% | 10–15% |
| D6 | 32 | 12.6% | 18 | 19.8% | 10–15% |

D1不足・全在庫でのD2過多が残る。応用・本番相当だけならD6への集中も見える。模試抽選がDomain範囲を満たすことと、在庫・Objective・難度が満遍なく揃うことは別。今回、問題数と分類は動かしていない。

| Objective | Verified基礎 | 応用 | 本番相当 |
| --- | ---: | ---: | ---: |
| d1o1: Understand responsible AI principles | 7 | 0 | 0 |
| d1o2: Validate and operate AI tools | 6 | 6 | 5 |
| d2o1: Use GitHub Copilot in the IDE | 20 | 0 | 1 |
| d2o2: Use GitHub Copilot CLI | 8 | 6 | 2 |
| d2o3: Use GitHub Copilot features and capabilities | 31 | 7 | 8 |
| d2o4: Manage organization-wide settings and policies | 11 | 2 | 2 |
| d3o1: Describe data handling and flow | 15 | 6 | 4 |
| d3o2: Understand lifecycle and limitations | 8 | 0 | 0 |
| d4o1: Craft effective prompts | 15 | 2 | 0 |
| d4o2: Engineer prompts for performance | 7 | 5 | 6 |
| d5o1: Enhance productivity and code quality | 8 | 2 | 1 |
| d5o2: Support testing and security | 13 | 2 | 6 |
| d6o1: Manage privacy settings and exclusions | 6 | 7 | 2 |
| d6o2: Apply safeguards and troubleshoot | 7 | 3 | 6 |

現行ではd1o1・d3o2に応用／本番相当がなく、d4o1も本番相当がない。FoundationのSparkやzero/few-shotが存在することだけで、高難度の対応を網羅したとはしない。機能限定というユーザー条件と、[Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)の責任ある利用・prompt crafting等の範囲との緊張も明示する。preview・細かな最新UIの仕様が公式Docsにあることだけで、試験での出題頻度は断定しない。

## 近接・重複の再検討

- q-d3-a03-feature-20261016 / q-d3-a16-feature-20261016 / q-d4-a02-feature-20261016：同じ「対象ファイルを明示添付」へ収束。remote/localと暗黙文脈の境界は別なので、同一問題と断定せず、40の独立性を優先再検討。
- q-d2-e07-feature-20261016 / q-d2-e15-feature-20261016 / q-d1-a19-feature-20261016 / q-sc03-2-feature-20261016：候補ツールと実行承認の区別に集中。特に3と82は編集・実行ツール追加という同じ結論で、難度差を説明しにくい。
- q-d3-e07-feature-20261016 / q-d3-a19-feature-20261016：到達性診断という近接テーマ。URLが直接示される本番相当8の方が、診断入口を選ぶ応用59より軽い。
- q-d5-e03-feature-20261016 / q-sc08-2-feature-20261016 / q-d5-e05-feature-20261016 / q-d2-e01-feature-20261016：セットアップの題材自体は異なるが、35は一般のcloud/local切り分けに留まり、機能判断の追加価値が弱い。
- q-d5-a14-feature-20261016 / q-sc02-1-feature-20261016：Fix with Copilotの起動と成果物の選択という別操作だが、89は本文の別PRをそのまま選ぶだけで本番相当になっていない。
- q-d6-a11 / q-d6-a13-feature-20261016 / q-sc05-3-feature-20261016：除外パターンの近接題材。repo内外の設定範囲は別の判断だが、23は完全パスの再掲で基礎との差が弱い。

## 公式情報で再確認した重要点

- [GH-300 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300) — Skills measured as of August 7, 2026 / six domains：分類範囲、GA中心・一般的なpreviewの扱い、出題比率。
- [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) — Tool availability values / Tool permission patterns：CLIの実ツール名と権限種別を別に扱う。44の設定例に不整合。
- [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) — Layers of tool controls / Persisted permissions：候補制限と実行許可は別層。承認保存は場所スコープとURLスコープが異なる。
- [Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files) — Introduction / Prompt file format / Sync user prompt files：Local harness限定、input構文の保証範囲、個人プロンプトの同期。
- [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration) — Tools / Tool aliases：カスタムAgentのread/search等の別名をCLI availabilityへそのまま移植しない。
- [Manage approvals and permissions](https://code.visualstudio.com/docs/agents/run/approvals) — Manage tool approvals / Automatically approve terminal commands：実行前と結果取込の承認、falseは確認要求であり実行拒否ではない。
- [Using Copilot code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review) — Customizing reviews with custom instructions / Customizing environment：head branchの指示、レビュー専用workflow。
- [Configure the development environment](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment) — Copilot setup steps：正式job名・default branch・途中失敗後の挙動。
- [Context in AI agents](https://code.visualstudio.com/docs/agents/concepts/context) — Context isolation with subagents：文脈分離だけではworktreeやsandboxを作らない。

## 全91問の一覧

| ID | 現難度 | 選択肢単体 | 難度再判定 | 本文の優先問題 | 反実仮想台帳 |
| --- | --- | --- | --- | --- | --- |
| q-d3-a13 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | LEGACY_NOTE_ONLY |
| q-d1-a21-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d2-e07-feature-20261016 | 本番 | DISTRACTOR_CAUTION | 境界・要強化 | — | LANGUAGE_OR_SCOPE_REWRITE |
| q-d5-a14-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-sc05-1-feature-20261016 | 応用 | DISTRACTOR_CAUTION | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-e06-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 境界・要強化 | — | LANGUAGE_OR_SCOPE_REWRITE |
| q-d2-e21 | 本番 | NO_SPECIFIC_CUE_FOUND | 境界・要強化 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d3-e07-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d2-e24 | 本番 | GUESSING_CUE_RISK | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d6-a09 | 応用 | DISTRACTOR_CAUTION | 入口程度 | — | LEGACY_NOTE_ONLY |
| q-d2-e11-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d6-e02-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | LANGUAGE_OR_SCOPE_REWRITE |
| q-d4-a14-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | LANGUAGE_OR_SCOPE_REWRITE |
| q-d5-e03-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 境界・要強化 | — | MULTI_CHANGE_REPLAY |
| q-d6-a11 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | LEGACY_NOTE_ONLY |
| q-d2-a23 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | LEGACY_NOTE_ONLY |
| q-sc03-3-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | ANSWER_AMBIGUITY | NO_SPECIFIC_FAILURE_FOUND |
| q-d6-e06 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d5-e06-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | LANGUAGE_OR_SCOPE_REWRITE |
| q-d1-e02-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-sc06-3 | 応用 | GUESSING_CUE_RISK | 概ね適合 | — | LEGACY_NOTE_ONLY |
| q-d2-e15-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d6-a13-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d3-a17 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | LEGACY_NOTE_ONLY |
| q-d6-a01 | 応用 | GUESSING_CUE_RISK | 現ラベルより軽い | — | LEGACY_NOTE_ONLY |
| q-d5-e08-feature-20261016 | 本番 | DISTRACTOR_CAUTION | 現ラベルより軽い | — | MULTI_CHANGE_REPLAY |
| q-d6-e03-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-e07-feature-20261016 | 本番 | DISTRACTOR_CAUTION | 境界・要強化 | — | SEMANTIC_REVIEW_FAILURE |
| q-d1-a10-feature-20261016 | 応用 | GUESSING_CUE_RISK | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d2-a24 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | LEGACY_NOTE_ONLY |
| q-sc10-3-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-e08-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d2-e08 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | LEGACY_NOTE_ONLY |
| q-d2-e02-feature-20261016 | 本番 | GUESSING_CUE_RISK | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-sc08-2-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d1-a04-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-e01-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d3-a07-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d3-a06-feature-20261016 | 応用 | GUESSING_CUE_RISK | 現ラベルより軽い | — | LANGUAGE_OR_SCOPE_REWRITE |
| q-d3-a03-feature-20261016 | 応用 | GUESSING_CUE_RISK | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-e09-feature-20261016 | 本番 | DISTRACTOR_CAUTION | 境界・要強化 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-sc05-3-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d3-e08-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d5-e07-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 正答の前提を修正して再判定 | OFFICIAL_TOOL_NAME_MISMATCH | LANGUAGE_OR_SCOPE_REWRITE |
| q-d6-a03-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d2-a20 | 応用 | DISTRACTOR_CAUTION | 概ね適合 | — | LEGACY_NOTE_ONLY |
| q-d2-e19-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | LANGUAGE_OR_SCOPE_REWRITE |
| q-d5-a09-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d2-e06 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d5-e02-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d1-e03-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-e07-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-a11-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-a17-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-sc07-1-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | LANGUAGE_OR_SCOPE_REWRITE |
| q-d5-e05-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-e08-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-e04-feature-20261016 | 本番 | DISTRACTOR_CAUTION | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d3-a19-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q01-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-sc03-1-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d2-e01-feature-20261016 | 本番 | GUESSING_CUE_RISK | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d3-a16-feature-20261016 | 応用 | DISTRACTOR_CAUTION | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d5-a15-feature-20261016 | 応用 | GUESSING_CUE_RISK | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d6-e07-feature-20261016 | 本番 | GUESSING_CUE_RISK | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-d3-a14-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d5-e01-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | MULTI_CHANGE_REPLAY |
| q-d5-e04-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-e09-feature-20261016 | 本番 | GUESSING_CUE_RISK | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d3-e04 | 本番 | GUESSING_CUE_RISK | 境界・要強化 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-sc01-2 | 応用 | GUESSING_CUE_RISK | 現ラベルより軽い | — | LEGACY_NOTE_ONLY |
| q-sc02-2-feature-20261016 | 本番 | GUESSING_CUE_RISK | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-a19-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-a16-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d3-e02-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d2-a26-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d6-e04-feature-20261016 | 本番 | DISTRACTOR_CAUTION | 概ね適合 | — | MULTI_CHANGE_REPLAY |
| q-d1-a07-feature-20261016 | 応用 | DISTRACTOR_CAUTION | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-a01-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-a02-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d2-a04-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | SEMANTIC_REVIEW_FAILURE |
| q-sc03-2-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d2-a25 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | LEGACY_NOTE_ONLY |
| q-d2-a18-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | SEMANTIC_REVIEW_FAILURE |
| q-sc02-3-feature-20261016 | 応用 | GUESSING_CUE_RISK | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-e01-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d4-e05-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 境界・要強化 | — | SEMANTIC_REVIEW_FAILURE |
| q-d1-e04-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 概ね適合 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-sc02-1-feature-20261016 | 本番 | NO_SPECIFIC_CUE_FOUND | 現ラベルより軽い | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d1-a18-feature-20261016 | 応用 | NO_SPECIFIC_CUE_FOUND | 入口程度 | — | NO_SPECIFIC_FAILURE_FOUND |
| q-d6-e01 | 本番 | GUESSING_CUE_RISK | 現ラベルより軽い | — | LANGUAGE_OR_SCOPE_REWRITE |

## 個別の根拠

### q-d3-a13

- **本文**: Copilot Businessの組織オーナーが、新しい対象者への座席割当を準備します。管理APIの読取権限は確認済みで、承認済みの対象者一覧もあります。利用状況の集計だけでは現在の個別割当が分からないため、すでに割り当てた人を把握したいと考えています。次にどの情報をAPIから取得して照合すべきですか。
- **判定**: 座席一覧と利用集計の区別は機能に沿うが、「個別割当を把握→割当一覧」の一対一の識別。応用の判断材料が少ない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 組織のCopilot利用状況データを取得し、対象者の活動の集計へ照合する | 誤答 |
| B | 組織のCopilot機能ポリシーを取得し、対象機能の有効設定へ照合する | 誤答 |
| C | 組織のポリシー変更に関する監査記録を取得し、承認した変更履歴へ照合する | 誤答 |
| D | 組織のCopilot座席割当一覧を取得し、承認済みの対象者一覧へ照合する | 保存されている正答 |

- **文字長・位置**: 正答36文字／全四択中央値35.5文字＝1.01倍。保存時表示位置D。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d1-a21-feature-20261016

- **本文**: 組織所有のCopilot Spaceを作成しました。少数の管理担当者だけに共有し、一般の組織メンバーにはSpaceを表示しない方針です。参照元リポジトリの既存の権限は維持します。Spaceの組織メンバーへの既定アクセスはどうしますか。
- **判定**: No access／viewer／editor／adminは同じ粒度で比較できる。一方、非表示という目的からNo accessを選ぶ定義照合が中心。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 既定アクセスをviewerにし、必要な担当者へ個別アクセスを与える | 誤答 |
| B | 既定アクセスをNo accessにし、必要な担当者へ個別アクセスを与える | 保存されている正答 |
| C | 既定アクセスをeditorにし、必要な担当者へ個別アクセスを与える | 誤答 |
| D | 既定アクセスをadminにし、必要な担当者へ個別アクセスを与える | 誤答 |

- **文字長・位置**: 正答36文字／全四択中央値33文字＝1.09倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: 組織所有のCopilot Spaceを作成しました。少数の管理担当者だけに共有し、一般の組織メンバーにも表示して質問を認めるが、編集は認めない方針です。参照元リポジトリの既存の権限は維持します。Spaceの組織メンバーへの既定アクセスはどうしますか。
- **台帳が指定した変更後の正答**: 既定アクセスをviewerにし、必要な担当者へ個別アクセスを与える

### q-d2-e07-feature-20261016

- **本文**: CopilotのカスタムAgentで修正案を得ました。プロファイルはtools: [read, search]で、必要なテストコマンドの実行は承認済みですが、編集・実行ツールが候補にありません。既存の読取能力を保ち、Agent自身に変更と実行検証を任せる最小の変更はどれですか。
- **判定**: ツール提供と承認の区別は妥当。ただし本文が編集・実行の両方の不足を明示し、正答だけが両方を追加する。高度な原因切り分けには届かない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: DISTRACTOR_CAUTION — 正答だけが編集と実行の両方を備える。
- **難度**: 境界・要強化

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | ツール一覧を保ち、テストコマンドの承認だけを再度与える | 誤答 |
| B | editだけを追加し、executeは候補から外したままにする | 誤答 |
| C | プロファイルへeditとexecuteを追加し、必要な実行承認を維持する | 保存されている正答 |
| D | executeだけを追加し、editは候補から外したままにする | 誤答 |

- **文字長・位置**: 正答36文字／全四択中央値31文字＝1.16倍。保存時表示位置C。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — 「Agent自身にファイル変更は自分で行い」と主語・係り受けが崩れる。
- **台帳の変更後本文**: CopilotのカスタムAgentで修正案を得ました。プロファイルはtools: [read, search]で、必要なテストコマンドの実行は承認済みですが、編集・実行ツールが候補にありません。既存の読取能力を保ち、Agent自身にファイル変更は自分で行い、Agentには実行検証だけを任せる最小の変更はどれですか。
- **台帳が指定した変更後の正答**: executeだけを追加し、editは候補から外したままにする

### q-d5-a14-feature-20261016

- **本文**: Copilot code reviewのコメントへ通常の返信を書きましたが、Copilotから返答はありません。指摘に沿って実装も修正させたいと考えており、cloud agentは有効です。今回の目的に合う操作はどれですか。
- **判定**: 再レビュー・指摘解決・要約・修正依頼は実在の操作。通常返信に返答しない境界は必要だが、Fix with Copilotの起動識別として応用の入口。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Fix with CopilotからAgentへ修正指示を作る | 保存されている正答 |
| B | Copilotへコードの再レビューを依頼する | 誤答 |
| C | Resolve conversationで指摘を解決表示にする | 誤答 |
| D | CopilotでPR summaryを生成し、変更内容を説明する | 誤答 |

- **文字長・位置**: 正答31文字／全四択中央値31文字＝1.00倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot code reviewのコメントへ通常の返信を書きましたが、Copilotから返答はありません。人向けに確認済みの指摘を解決表示へ変えたいと考えており、cloud agentは有効です。今回の目的に合う操作はどれですか。
- **台帳が指定した変更後の正答**: Resolve conversationで指摘を解決表示にする

### q-sc05-1-feature-20261016

- **本文**: VS CodeのAgents windowで、リポジトリAを最初の実行ワークスペースとしてCopilotセッションを開始し、プロジェクトBを資料として添付しました。Bも読めますが、編集結果はAに保存されます。今回は、AではなくBを主な変更先にしたいと考えています。どの進め方が合いますか。
- **判定**: 参照資料と実行workspaceの違いを問う。ただし三案がAを維持し、一案だけBを実行先にする構造が目立つ。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: DISTRACTOR_CAUTION — 三案がA維持、一案だけBへ移る対比。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Aのセッションを維持し、Bは参照資料として添付したまま使う | 誤答 |
| B | Bの説明をAのInstructionsへ書き、実行ワークスペースは維持する | 誤答 |
| C | BをSpaceのソースに追加し、Aのセッションへ資料を渡す | 誤答 |
| D | Bを実行ワークスペースに選んでセッションを開始する | 保存されている正答 |

- **文字長・位置**: 正答25文字／全四択中央値29文字＝0.86倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのAgents windowで、リポジトリAを最初の実行ワークスペースとしてCopilotセッションを開始し、プロジェクトBを資料として添付しました。Bも読めますが、編集結果はAに保存されます。今回は、Aだけを変更し、Bは参照資料として使いたいと考えています。どの進め方が合いますか。
- **台帳が指定した変更後の正答**: Aのセッションを維持し、Bは参照資料として添付したまま使う

### q-d4-e06-feature-20261016

- **本文**: GitHub.comで、パス別InstructionsにapplyTo: "src/**"とexcludeAgent: "code-review"を設定しました。同じhead branchのsrc/api.tsを、Copilot cloud agentの実装とCopilot code reviewのレビューで扱います。指示を実装側だけに使う目的は変えません。現状の読み込み対象として合う説明はどれですか。
- **判定**: applyToの一致とexcludeAgentの対象を照合する点は有効。ただし設定値code-reviewの語義を読むだけに近く、本番相当としては境界域。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 境界・要強化

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | cloud agentでもcode reviewでも読む | 誤答 |
| B | cloud agentでは読み、code reviewでは除外する | 保存されている正答 |
| C | cloud agentを除外し、code reviewだけで読む | 誤答 |
| D | どちらでも読まず、パス条件だけでは有効にならない | 誤答 |

- **文字長・位置**: 正答33文字／全四択中央値30文字＝1.10倍。保存時表示位置B。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — applyToとexcludeAgentの並列を置換で壊し、どの指定がないのか曖昧。
- **台帳の変更後本文**: GitHub.comで、パス別InstructionsにapplyTo: "src/**"とexcludeAgentは設定していません。同じhead branchのsrc/api.tsを、Copilot cloud agentの実装とCopilot code reviewのレビューで扱います。指示を実装側だけに使う目的は変えません。現状の読み込み対象として合う説明はどれですか。
- **台帳が指定した変更後の正答**: cloud agentでもcode reviewでも読む

### q-d2-e21

- **本文**: GitHub Copilot Spaceにリポジトリrepo-Rとアップロード資料Uが登録されています。ユーザーAは全て閲覧可能です。しかし、BはSpaceとUを閲覧でき、Rを直接開くと403で回答にもRがない状態です。一方、CはSpaceが403だがRを直接閲覧できる状態です。全員同じSpaceリンクを使用し、403は対象への閲覧拒否とログで確認済みです。BとCが正常に利用できるようにするための修正対象の組み合わせとして最も適切なものはどれですか？
- **判定**: Spaceと参照repoの権限を分ける題材は妥当。ただし403の対象がすべて明示され、実質は二人分の権限対応表の読み取り。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 境界・要強化

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | ユーザーBにはSpace自体の共有権限を付与し、ユーザーCにはリポジトリrepo-Rの閲覧権限を付与する | 誤答 |
| B | ユーザーBにはリポジトリrepo-Rの閲覧権限を付与し、ユーザーCにはSpace自体の共有権限を付与する | 保存されている正答 |
| C | ユーザーBとCの両名に対して、リポジトリrepo-Rの閲覧権限を付与してアクセスを許可する | 誤答 |
| D | ユーザーBとCの両名に対して、Space自体の共有アクセス権限を付与して参加を許可する | 誤答 |

- **文字長・位置**: 正答52文字／全四択中央値48.5文字＝1.07倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: GitHub Copilot Spaceにリポジトリrepo-Rとアップロード資料Uが登録されています。ユーザーAは全て閲覧可能です。しかし、BはSpaceとUを閲覧でき、Rを直接開くと403で回答にもRがない状態です。一方、CもSpaceとUを閲覧できるが、Rを直接開くと403状態です。全員同じSpaceリンクを使用し、403は対象への閲覧拒否とログで確認済みです。BとCが正常に利用できるようにするための修正対象の組み合わせとして最も適切なものはどれですか？
- **台帳が指定した変更後の正答**: ユーザーBとCの両名に対して、リポジトリrepo-Rの閲覧権限を付与してアクセスを許可する

### q-d3-e07-feature-20261016

- **本文**: 社内ネットワークでCopilotを使います。公式診断用のcopilot-proxy.githubusercontent.com/_pingは200ですが、api.githubcopilot.com/_pingは到達できません。通常補完は動き、Chatだけが接続エラーです。認証とSeatは確認済みです。Chatの復旧に向け、管理者へどの経路の確認を依頼しますか。
- **判定**: 失敗した接続先URLが本文にそのままあり、選択肢の同じURLを選べる。応用の診断情報取得問題よりも軽い。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 補完用copilot-proxy.githubusercontent.comへの経路を確認する | 誤答 |
| B | GitHub画面のgithub.comへの経路を確認する | 誤答 |
| C | GitHub REST APIのapi.github.comへの経路を確認する | 誤答 |
| D | Chat用api.githubcopilot.comへの経路を確認する | 保存されている正答 |

- **文字長・位置**: 正答35文字／全四択中央値37文字＝0.95倍。保存時表示位置D。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — 観測を「Chatは動く・通常補完だけ失敗」へ変えたのに、問いは「Chatの復旧」のまま。補完経路を正答とする目的が食い違う。
- **台帳の変更後本文**: 社内ネットワークでCopilotを使います。公式診断用のapi.githubcopilot.com/_pingは200ですが、copilot-proxy.githubusercontent.com/_pingは到達できません。Chatは動き、通常補完だけが接続エラーです。認証とSeatは確認済みです。Chatの復旧に向け、管理者へどの経路の確認を依頼しますか。
- **台帳が指定した変更後の正答**: 補完用copilot-proxy.githubusercontent.comへの経路を確認する

### q-d2-e24

- **本文**: 社内で運用していたGitHub App型の社内Copilot Extensionが2025年11月10日の廃止後に停止しました。同じGitHub AppのIssue連携は動作する。接続ログは廃止を示し、新しい認証失敗はない状態です。移行先として認可付きMCP検索を準備済みですが接続承認は未完了です。今回のログおよび廃止事象に対応した機能復旧・サービス再開の手順として最も適切なものはどれですか？
- **判定**: 正答だけが廃止済み経路を離れ、誤答二案が廃止APIの復活を試す。移行先も準備済みと明示され、本番相当の比較が成立しにくい。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 正答だけが廃止済み経路を離れ、誤答二案が廃止APIの復活を試す。移行先も準備済みと明示され、本番相当の比較が成立しにくい。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 準備済みMCPサーバーの接続承認および検索認可手続きを完了させ、Chat機能の連携経路をMCPへ置換する | 保存されている正答 |
| B | 存続している通常GitHub AppのIssue連携用資格情報を更新し、Extension APIの再疎通を検証する | 誤答 |
| C | MCPサーバーの検索引数スキーマを修正し、廃止されたExtension形式との後方互換性を再検証する | 誤答 |
| D | CLIのシート割り当てと利用権限ポリシーを再確認し、ローカル端末からの直接接続を検証する | 誤答 |

- **文字長・位置**: 正答52文字／全四択中央値51文字＝1.02倍。保存時表示位置A。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — Issue用資格情報の失効へ変えても、冒頭の廃止Extension停止は残る。指定した誤答Bには廃止済みExtension APIの再疎通も含まれる。
- **台帳の変更後本文**: 社内で運用していたGitHub App型の社内Copilot Extensionが2025年11月10日の廃止後に停止しました。今回停止したのは存続するGitHub AppのIssue連携で、接続ログはIssue用資格情報の失効だけを示す状態です。移行先として認可付きMCP検索を準備済みですが接続承認は未完了です。今回のログおよび廃止事象に対応した機能復旧・サービス再開の手順として最も適切なものはどれですか？
- **台帳が指定した変更後の正答**: 存続している通常GitHub AppのIssue連携用資格情報を更新し、Extension APIの再疎通を検証する

### q-d6-a09

- **本文**: Copilot Businessの組織で、割当済み利用者のIDE活動を評価します。座席とIDE機能の有効設定、対象期間は確認済みですが、IDEテレメトリーを無効にしている利用者が含まれ、その人の活動は記録されていません。活動記録がない人を全員「IDE未利用」と分類する前に、どの照合を行うべきですか。
- **判定**: 未収集を未利用とみなさないという観測一般論で解ける。Copilot固有の収集対象・API項目・条件を照合する問いへ寄せる必要がある。
- **機能知識の必要性**: FEATURE_RELATED_BUT_GENERAL_REASONING
- **選択肢単体**: DISTRACTOR_CAUTION — 収集条件と実利用を両方調べる案だけが包括的。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 組織のIDEポリシーを確認し、利用者に適用される機能の有効設定を照合する | 誤答 |
| B | 開発成果の指標を比較し、対象者の変更前後の作業結果と品質を照合する | 誤答 |
| C | 承認した対象者と座席一覧を比較し、利用者の個別割当の過不足を照合する | 誤答 |
| D | IDEの収集条件を確認し、記録のない利用者の実際の利用状況を別途照合する | 保存されている正答 |

- **文字長・位置**: 正答36文字／全四択中央値35文字＝1.03倍。保存時表示位置D。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d2-e11-feature-20261016

- **本文**: GitHub.comでCopilot code reviewを使います。mainの共通指示は「日本語」、PRのhead branchでは「英語」へ変更しています。head branchのパス別指示にはapplyTo: "src/**/*.ts"と「セキュリティ観点を重視」があります。変更ファイルはsrc/auth/login.tsとdocs/auth.mdです。個人・組織の追加指示はありません。今回のレビューが読む指示の組合せはどれですか。
- **判定**: head/baseの指示差、共通指示、パス適用を組み合わせる。表示順や語調だけで一案に決まらず、Copilot review固有の参照元が必要。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 両ファイルで日本語の共通指示を読み、セキュリティ指示はlogin.tsで読む | 誤答 |
| B | 両ファイルで英語の共通指示を読み、セキュリティ指示も両ファイルで読む | 誤答 |
| C | 両ファイルで日本語の共通指示を読み、セキュリティ指示はどちらも読まない | 誤答 |
| D | 両ファイルで英語の共通指示を読み、セキュリティ指示はlogin.tsで読む | 保存されている正答 |

- **文字長・位置**: 正答37文字／全四択中央値36文字＝1.03倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: GitHub.comでCopilot code reviewを使います。mainの共通指示は「日本語」、PRのhead branchでは「英語」へ変更しています。head branchのパス別指示にはapplyTo: "**"と「セキュリティ観点を重視」があります。変更ファイルはsrc/auth/login.tsとdocs/auth.mdです。個人・組織の追加指示はありません。今回のレビューが読む指示の組合せはどれですか。
- **台帳が指定した変更後の正答**: 両ファイルで英語の共通指示を読み、セキュリティ指示も両ファイルで読む

### q-d6-e02-feature-20261016

- **本文**: 組織はCopilot code reviewと、Only allow Copilot code review to be triggered by authorized usersを有効にしています。Xは外部で取得した対応ライセンスだけを持ち、この組織が認める利用者ではありません。Xからの個別依頼と、このPRに一致する有効な組織rulesetからの自動レビューについて、起動できる経路の組合せはどれですか。
- **判定**: 認可利用者の個別依頼制限とrulesetの例外を別経路として評価する。独立した仕様を照合する本番相当の候補として残せる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Xの個人依頼もrulesetの自動レビューも動く | 誤答 |
| B | Xの個人依頼は動き、rulesetの自動レビューは止まる | 誤答 |
| C | Xの個人依頼もrulesetの自動レビューも止まる | 誤答 |
| D | Xの個人依頼は止まり、rulesetの自動レビューは動く | 保存されている正答 |

- **文字長・位置**: 正答28文字／全四択中央値26.5文字＝1.06倍。保存時表示位置D。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — 「組織はCopilot code reviewと、…は…無効です」となり、code review全体も無効なのか読み分けにくい。
- **台帳の変更後本文**: 組織はCopilot code reviewと、Only allow Copilot code review to be triggered by authorized usersは組織とrepoの両方で無効です。Xは外部で取得した対応ライセンスだけを持ち、この組織が認める利用者ではありません。Xからの個別依頼と、このPRに一致する有効な組織rulesetからの自動レビューについて、起動できる経路の組合せはどれですか。
- **台帳が指定した変更後の正答**: Xの個人依頼もrulesetの自動レビューも動く

### q-d4-a14-feature-20261016

- **本文**: CopilotのカスタムAgentを専門タスク用に用意しました。利用者が選択して呼ぶことは認めますが、Copilotが文脈から自動的にそのAgentへ委任するのは止めたい場合、どの定義が合いますか。
- **判定**: 手動起動の許可とモデルによる自動委任の禁止を二つの実在設定へ対応させる。四案の設定粒度が揃っている。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | disable-model-invocation: false、user-invocable: trueにする | 誤答 |
| B | disable-model-invocation: true、user-invocable: trueにする | 保存されている正答 |
| C | disable-model-invocation: true、user-invocable: falseにする | 誤答 |
| D | disable-model-invocation: false、user-invocable: falseにする | 誤答 |

- **文字長・位置**: 正答54文字／全四択中央値55文字＝0.98倍。保存時表示位置B。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — 「Copilotが文脈から自動的な委任も認めたい」と主語が崩れる。
- **台帳の変更後本文**: CopilotのカスタムAgentを専門タスク用に用意しました。利用者が選択して呼ぶことは認めますが、Copilotが文脈から自動的な委任も認めたい場合、どの定義が合いますか。
- **台帳が指定した変更後の正答**: disable-model-invocation: false、user-invocable: trueにする

### q-d5-e03-feature-20261016

- **本文**: Copilot cloud agentのセットアップjobに、手順1で依存導入、手順2で補助ツール導入、手順3で構成確認を設定しました。手順2が非ゼロで失敗しました。現在の準備状態でAgentが動くかと、残りの手順3が動くかについて、既定の挙動はどれですか。
- **判定**: setup失敗後の二つの挙動を知る必要はあるが、三段階の調査ではなく既定動作の想起。応用との境界にある。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 境界・要強化

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Agentは作業を始めず、残りのsetup手順3も省略される | 誤答 |
| B | Agentは作業を始め、残りのsetup手順3は省略される | 保存されている正答 |
| C | 残りのsetup手順3を実行し、その成功後にAgentが作業を始める | 誤答 |
| D | 残りのsetup手順3を実行するが、Agentは作業を始めない | 誤答 |

- **文字長・位置**: 正答29文字／全四択中央値30.5文字＝0.95倍。保存時表示位置B。
- **反実仮想**: MULTI_CHANGE_REPLAY — 問題文の大部分や複数の状態を置き換えた別ケース。単一条件を変える反実仮想としての証拠は弱い。
- **台帳の変更後本文**: Copilot cloud agentのsetup stepsで、手順1と2が成功しました。手順3もこれから正常に実行され、成功する前提です。残りのsetupとAgentの開始の関係はどれですか。
- **台帳が指定した変更後の正答**: 残りのsetup手順3を実行し、その成功後にAgentが作業を始める

### q-d6-a11

- **本文**: コンテンツ除外に対応する通常補完で、secretsディレクトリの直下とすべての下位階層にある.keyファイルだけを除外します。secrets/readme.mdと、secrets以外の.keyファイルは参照対象に残します。どのパスパターンが条件を満たしますか。
- **判定**: 全階層と拡張子をglobへ置き換えるだけ。Copilot固有の適用条件との照合が薄く、基礎寄り。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | secrets/*.keyを除外する | 誤答 |
| B | secrets/**を除外する | 誤答 |
| C | secrets/**/*.keyを除外する | 保存されている正答 |
| D | **/*.keyを除外する | 誤答 |

- **文字長・位置**: 正答21文字／全四択中央値16.5文字＝1.27倍。保存時表示位置C。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d2-a23

- **本文**: VS CodeのCopilotへローカルMCPサーバーを接続します。サーバー資料では、起動コマンドと引数を使うstdio接続だけを提供しています。そのコマンドでの起動は成功しましたが、MCP設定にはHTTP URLが指定され、接続できません。外部サービスの認証情報は不要です。資料と照合して、どの設定を修正すべきですか。
- **判定**: 接続方式・認証・ツール入力という層を区別する題材は妥当。ただしstdioだけと明示され、応用の入口に留まる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | MCP設定のHTTP URLを更新し、サーバーが実際に待ち受ける宛先へ合わせる | 誤答 |
| B | MCP接続の認証設定を更新し、サーバーが求める資格情報を指定する | 誤答 |
| C | MCP設定をstdio方式へ合わせ、サーバーの起動コマンドと引数を指定する | 保存されている正答 |
| D | MCPツールの入力定義を更新し、呼び出す引数をサーバーの仕様へ合わせる | 誤答 |

- **文字長・位置**: 正答37文字／全四択中央値36文字＝1.03倍。保存時表示位置C。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-sc03-3-feature-20261016

- **本文**: VS CodeのLocal harnessで個人用のPrompt Fileを作りました。別のPCでも同じ個人用プロンプトを使いたいですが、作業repoへコミットしてチーム共有する予定はありません。Settings Sync自体は有効です。どの保存・共有方法が合いますか。
- **判定**: 自動同期という条件がなく、Settings Syncとユーザー領域への手動コピーの両方が目的を満たす。単一正答の条件を補う必要がある。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Settings SyncのPrompts and Instructionsを有効にする | 保存されている正答 |
| B | repoの.github/promptsへ移し、チームへコミットする | 誤答 |
| C | repoの.github/instructionsへ移し、自動適用へ変える | 誤答 |
| D | 各PCのユーザー領域へファイルを手動でコピーする | 誤答 |

- **文字長・位置**: 正答44文字／全四択中央値35.5文字＝1.24倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのLocal harnessで個人用のPrompt Fileを作りました。別のPCでも同じ個人用プロンプトを使いたいですが、同じrepoを使うチーム全体へ配布する予定です。Settings Sync自体は有効です。どの保存・共有方法が合いますか。
- **台帳が指定した変更後の正答**: repoの.github/promptsへ移し、チームへコミットする
- **本文の修正要件**: 自動同期を必須と明記し、手動コピーも条件を満たす余地を解消する。

### q-d6-e06

- **本文**: 公開コード一致ポリシー（Suggestions matching public code）の設定演習です。Enterpriseの実効設定は強制Blockで、Org-Aの保存値はAllow、Org-BはBlock。反映は確認済みです。ポリシーがEnterpriseで強制された場合は個人設定で解除できません。社内セキュリティ委員会はOrg-AについてのみAllowとする例外を承認しましたが、Enterprise設定の変更承認はまだない状態です。この時点におけるOrganization AおよびBの実効ポリシー状態として最も適切なものはどれですか？
- **判定**: 強制Blockと解除できない規則が本文で与えられ、両方Blockを選ぶだけ。Copilotの仕様を知らなくても規則の代入で解ける。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Organization Aの実効設定はAllowであり、Organization Bの実効設定はBlockである | 誤答 |
| B | Organization Aの実効設定はAllowであり、Organization Bの実効設定もAllowである | 誤答 |
| C | Organization Aの実効設定はBlockであり、Organization Bの実効設定もBlockである | 保存されている正答 |
| D | Organization Aの実効設定はBlockであり、Organization Bの実効設定はAllowである | 誤答 |

- **文字長・位置**: 正答57文字／全四択中央値57文字＝1.00倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: 公開コード一致ポリシー（Suggestions matching public code）の設定演習です。EnterpriseはNo policyでOrgに委任し、Org-Aの保存値はAllow、Org-BはBlock。反映は確認済みです。ポリシーがEnterpriseで強制された場合は個人設定で解除できません。社内セキュリティ委員会はOrg-AについてのみAllowとする例外を承認しましたが、Enterprise設定の変更承認はまだない状態です。この時点におけるOrganization AおよびBの実効ポリシー状態として最も適切なものはどれですか？
- **台帳が指定した変更後の正答**: Organization Aの実効設定はAllowであり、Organization Bの実効設定はBlockである

### q-d5-e06-feature-20261016

- **本文**: Copilotの自動レビューをrepo rulesetで有効にしました。他の起動元はありません。新規の通常PRはレビューされますが、draft PRと、レビュー後の追加pushは対象にしたくありません。現在のReview draft pull requestsは無効、Review new pushesは有効です。方針に合わせる変更はどれですか。
- **判定**: draftは対象外・追加pushも対象外という要望を二つの真偽値へ直訳している。本番相当の分析負荷がない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | draftを有効にし、Review new pushesも有効のままにする | 誤答 |
| B | draftの無効を保ち、Review new pushesを無効にする | 保存されている正答 |
| C | draftを無効のまま、自動レビュー全体を無効にする | 誤答 |
| D | draftを有効にし、Review new pushesを無効にする | 誤答 |

- **文字長・位置**: 正答35文字／全四択中央値34.5文字＝1.01倍。保存時表示位置B。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — 「…されますが、…も対象にしますが」と接続が重複する。
- **台帳の変更後本文**: Copilotの自動レビューをrepo rulesetで有効にしました。他の起動元はありません。新規の通常PRはレビューされますが、draft PRも対象にしますが、レビュー後の追加pushは対象にしたくありません。現在のReview draft pull requestsは無効、Review new pushesは有効です。方針に合わせる変更はどれですか。
- **台帳が指定した変更後の正答**: draftを有効にし、Review new pushesを無効にする

### q-d1-e02-feature-20261016

- **本文**: VS CodeのCopilotで、候補Pはインライン提案として表示した後に破棄し、候補Qはそのまま採用しました。公開コードに一致して参照が出たのはQだけです。後で両候補の採用時の一致参照を監査したいと考えています。機能の記録対象に沿う説明はどれですか。
- **判定**: Qだけに参照が出たと本文が先に示し、正答はQの記録。採用時だけ記録する仕様を推論する前に結論が分かる。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | PとQの採用記録を確認する | 誤答 |
| B | Pの採用記録を確認する | 誤答 |
| C | Qの採用記録を確認する | 保存されている正答 |
| D | PもQも採用記録は確認しない | 誤答 |

- **文字長・位置**: 正答11文字／全四択中央値12文字＝0.92倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotで、候補PもQもインライン提案のまま採用し、両方について公開コード一致の参照が記録されました。後で両候補の採用時の一致参照を監査したいと考えています。機能の記録対象に沿う説明はどれですか。
- **台帳が指定した変更後の正答**: PとQの採用記録を確認する

### q-sc06-3

- **本文**: 【Global Logistics事例】GitHub.comの個人指示では、すべての関数にJSDocを付けるよう求めています。一方、リポジトリRの規約は公開APIだけ、リポジトリSの規約はすべての関数が対象です。各リポジトリの規約を変更せず、個人指示との競合を減らすには、どのように整理すべきですか。
- **判定**: 正答だけが各repoの規約を保持し、他案はR/Sの規約を変えるか競合を残す。正答の配慮のよさが手掛かりになる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 正答だけが各repoの規約を保持し、他案はR/Sの規約を変えるか競合を残す。正答の配慮のよさが手掛かりになる。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 個人指示を残し、Rの規約を全関数へ合わせる | 誤答 |
| B | 個人のJSDoc規約を外し、RとSの各repoに規約を置く | 保存されている正答 |
| C | 個人指示を公開APIだけへ変え、Sも同じにする | 誤答 |
| D | 個人指示を残し、Rの規約だけを毎回再送する | 誤答 |

- **文字長・位置**: 正答29文字／全四択中央値22文字＝1.32倍。保存時表示位置B。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d2-e15-feature-20261016

- **本文**: CopilotのカスタムAgent「文章整理」で、接続済みのMCP検索を使えません。一般のAgentでは同じMCP検索が使え、認証も成功します。「文章整理」のプロファイルにはtools: []があります。検索だけを利用可能にし、編集・実行は使わせない変更はどれですか。
- **判定**: 一般Agentでは使えるのに特定Agentではtools: []という差を捉え、最小の検索ツールだけを供給する判断は応用として成立する。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | tools自体を省略し、既定の全ツールを利用可能にする | 誤答 |
| B | toolsを空配列にして、ツールを利用不可にする | 誤答 |
| C | toolsへ必要な検索ツールだけを明示する | 保存されている正答 |
| D | toolsへreadだけを明示し、ファイル読取に限定する | 誤答 |

- **文字長・位置**: 正答21文字／全四択中央値25.5文字＝0.82倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: CopilotのカスタムAgent「文章整理」で、接続済みのMCP検索を使えません。一般のAgentでは同じMCP検索が使え、認証も成功します。「文章整理」のプロファイルにはtools: []があります。接続済みの全ツールを既定どおり利用可能にする変更はどれですか。
- **台帳が指定した変更後の正答**: tools自体を省略し、既定の全ツールを利用可能にする

### q-d6-a13-feature-20261016

- **本文**: Copilotの通常補完で、repo直下のprivateディレクトリにあるsecrets.envだけを除外します。同じ場所のSECRETS.ENVも対象とし、private/readme.mdと別ディレクトリのsecrets.envは残します。Copilotの除外パターンが大文字小文字を区別しない点を踏まえ、最も範囲の狭い指定はどれですか。
- **判定**: 大文字小文字を区別しない仕様が与えられ、正答は本文の完全パスそのもの。case-insensitiveの知識を測れていない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | /private/secrets.envを除外する | 保存されている正答 |
| B | 同名の全ファイル：secrets.env | 誤答 |
| C | ディレクトリ全体：/private/** | 誤答 |
| D | すべてのenv：**/*.env | 誤答 |

- **文字長・位置**: 正答25文字／全四択中央値20文字＝1.25倍。保存時表示位置A。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — 冒頭のprivate内のsecrets.env「だけ」と、後半の別ディレクトリも含む同名全ファイルの除外が矛盾する。
- **台帳の変更後本文**: Copilotの通常補完で、repo直下のprivateディレクトリにあるsecrets.envだけを除外します。同じ場所のSECRETS.ENVも対象とし、別ディレクトリも含め、secrets.envという同名ファイルはすべて除外します。Copilotの除外パターンが大文字小文字を区別しない点を踏まえ、最も範囲の狭い指定はどれですか。
- **台帳が指定した変更後の正答**: 同名の全ファイル：secrets.env

### q-d3-a17

- **本文**: 承認済みの検証環境で、架空のコード例を使いCopilotの通常補完を比較します。同じ入力・モデル・接続で、公開コードとの一致を許す設定では参照情報付きの候補が表示され、一致をBlockにした試行ではその候補が表示されません。ファイルの除外表示はなく、接続診断も成功しています。この比較から最も直接的に支持される説明はどれですか。
- **判定**: 入力・接続・出力フィルタを同条件比較から分ける構成は妥当。ただし変えた設定名が直接正答を示し、応用の入口。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 生成後の公開コード一致の扱いが変わり、候補の表示が抑えられたと考える | 保存されている正答 |
| B | サービス接続に失敗したため、生成を依頼する要求が届かなかったと考える | 誤答 |
| C | 入力ファイルの除外が適用され、対象コードが文脈へ使われなかったと考える | 誤答 |
| D | IDEの通常補完が無効になり、候補の表示を依頼しなくなったと考える | 誤答 |

- **文字長・位置**: 正答34文字／全四択中央値34文字＝1.00倍。保存時表示位置A。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d6-a01

- **本文**: リポジトリAでは、Copilotのコンテンツ除外によりsecrets/を参照対象から外しています。コードを複製したリポジトリBには除外ルールがなく、通常補完で同じパスが参照されています。Bでもsecrets/を除外するには、どの設定を追加すべきですか。
- **判定**: Bのrepo識別とパスを含む案だけが目的に沿い、gitignore・公開一致・Aの細分化が誤答。応用としても推測と消去が容易。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — Bのrepo識別とパスを含む案だけが目的に沿い、gitignore・公開一致・Aの細分化が誤答。応用としても推測と消去が容易。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | repo-Bの識別とsecrets/のパスを含む除外設定 | 保存されている正答 |
| B | repo-Bの公開コード一致をBlockにする設定 | 誤答 |
| C | repo-BのGit追跡を無視する.gitignore設定 | 誤答 |
| D | repo-Aのsecrets/をさらに細かく分割した除外設定 | 誤答 |

- **文字長・位置**: 正答28文字／全四択中央値28.5文字＝0.98倍。保存時表示位置A。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d5-e08-feature-20261016

- **本文**: Copilot code reviewの深度設定で、組織の既定はLite、repoはBalancedです。このPRの前回レビューはLiteでした。今回はレビュー依頼時にBalancedを明示します。自動レビューの有効・無効は変えません。今回の深度と、次回も明示しなければ参照されるこのPRの前回値として合うのはどれですか。
- **判定**: 今回の明示指定がそのまま正答で、組織・repo・前回値が結論に寄与しない。今回値と直近値が食い違う二案も不自然。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: DISTRACTOR_CAUTION — 今回と直近が不自然に異なる二案が弱い。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 今回Liteで、PRの直近の深度もLiteとなる | 誤答 |
| B | 今回Balancedで、PRの直近の深度は前回のLiteを保つ | 誤答 |
| C | 今回Liteで、PRの直近の深度は指定したBalancedとなる | 誤答 |
| D | 今回Balancedで、PRの直近の深度もBalancedとなる | 保存されている正答 |

- **文字長・位置**: 正答32文字／全四択中央値31.5文字＝1.02倍。保存時表示位置D。
- **反実仮想**: MULTI_CHANGE_REPLAY — 問題文の大部分や複数の状態を置き換えた別ケース。単一条件を変える反実仮想としての証拠は弱い。
- **台帳の変更後本文**: Copilot code reviewの深度は、今回の明示指定もPRの前回値も依頼者の値もrepo既定もありません。組織の既定だけがLiteです。この実効深度はどれですか。
- **台帳が指定した変更後の正答**: 今回Liteで、PRの直近の深度もLiteとなる

### q-d6-e03-feature-20261016

- **本文**: Copilot BusinessのPRレビューで、src/legacy.tsだけ指摘がありません。他の変更ファイルはレビュー済みで、利用者はlegacy.tsを閲覧できます。管理者はlegacy.tsに一致するContent Exclusionを確認しました。機密解除が承認されたため、このファイルもCopilotのレビュー対象へ戻します。一方、通常補完での公開コード一致は引き続き抑制する方針です。別の除外ルールはなく、上位ポリシーは変更を禁止していません。必要な設定変更の組合せはどれですか。
- **判定**: 除外を外す・Blockを維持するという要望を四択の真偽表へ移すだけ。入力除外と出力フィルタの区別は応用には使える。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | legacy.tsのContent Exclusionを残し、公開コード一致をAllowへ変更する | 誤答 |
| B | legacy.tsのContent Exclusionを外し、公開コード一致をAllowへ変更する | 誤答 |
| C | legacy.tsのContent Exclusionを残し、公開コード一致はBlockを維持する | 誤答 |
| D | legacy.tsのContent Exclusionを外し、公開コード一致はBlockを維持する | 保存されている正答 |

- **文字長・位置**: 正答49文字／全四択中央値49文字＝1.00倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot BusinessのPRレビューで、src/legacy.tsだけ指摘がありません。他の変更ファイルはレビュー済みで、利用者はlegacy.tsを閲覧できます。管理者はlegacy.tsに一致するContent Exclusionを確認しました。機密解除が承認されたため、このファイルもCopilotのレビュー対象へ戻します。一方、通常補完での公開コードと一致する提案も参照情報付きで提示できるようにする方針です。別の除外ルールはなく、上位ポリシーは変更を禁止していません。必要な設定変更の組合せはどれですか。
- **台帳が指定した変更後の正答**: legacy.tsのContent Exclusionを外し、公開コード一致をAllowへ変更する

### q-d4-e07-feature-20261016

- **本文**: Copilot cloud agentで使ったカスタムAgentをVS Codeへ移しました。定義中のmcp-serversだけを移し、VS CodeのMCP設定はまだ作っていません。toolsにはそのサーバーの検索ツール名が残っていますが利用できません。VS CodeでもそのMCPを使うために直す対象はどれですか。
- **判定**: cloudのAgent定義とVS CodeのMCP接続の差はよい題材。ただしtoolsは既に正しく、空にする誤答二件が弱い。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: DISTRACTOR_CAUTION — toolsを空にする二案は必要なMCP実行を満たさない。
- **難度**: 境界・要強化

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Agent定義のmcp-serversを維持し、toolsへ実ツール名を列挙する | 誤答 |
| B | VS CodeのMCP接続を設定し、Agentのtoolsは空にする | 誤答 |
| C | Agent定義のmcp-serversを維持し、Agentのtoolsは空にする | 誤答 |
| D | VS CodeのMCP接続を設定し、toolsへ実ツール名を列挙する | 保存されている正答 |

- **文字長・位置**: 正答34文字／全四択中央値37文字＝0.92倍。保存時表示位置D。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — 環境をcloudへ変えた後も、末尾が「VS CodeでもそのMCPを使うため」。cloud用mcp-serversを維持する案へ正答を変えられない。
- **台帳の変更後本文**: Copilot cloud agentで使ったカスタムAgentを同じGitHubのcloud agent環境内で別branchへ移しました。定義中のmcp-serversだけを移し、VS CodeのMCP設定はまだ作っていません。toolsにはそのサーバーの検索ツール名が残っていますが利用できません。VS CodeでもそのMCPを使うために直す対象はどれですか。
- **台帳が指定した変更後の正答**: Agent定義のmcp-serversを維持し、toolsへ実ツール名を列挙する

### q-d1-a10-feature-20261016

- **本文**: GitHub Copilot CLIで、必要なツールの承認は設定済みです。通常モードでは一段階の作業後に次の入力を待ちます。個々のツールの許可設定だけを増やすのではなく、完了まで次の作業へ自律的に進める実行方式へ切り替えたい場合、どれを使いますか。
- **判定**: 正答だけがAutopilotという実行方式を挙げ、既存許可と別という解説まで含む。他三案は通常モードの許可変更なので正答が目立つ。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 正答だけがAutopilotという実行方式を挙げ、既存許可と別という解説まで含む。他三案は通常モードの許可変更なので正答が目立つ。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Autopilotへ切り替え、既存のツール許可とは別に継続実行を有効にする | 保存されている正答 |
| B | 通常モードのままallow-allを指定し、ツール承認の確認を省略する | 誤答 |
| C | 通常モードのままavailable-toolsを追加し、候補ツールを増やす | 誤答 |
| D | 通常モードのまま追加ディレクトリを許可し、読取範囲を増やす | 誤答 |

- **文字長・位置**: 正答37文字／全四択中央値36文字＝1.03倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: GitHub Copilot CLIで、必要なツールの承認は設定済みです。通常モードでは一段階の作業後に次の入力を待ちます。個々のツールの許可設定だけを増やすのではなく、通常モードは維持し、すべてのツール承認だけを省略したい場合、どれを使いますか。
- **台帳が指定した変更後の正答**: 通常モードのままallow-allを指定し、ツール承認の確認を省略する

### q-d2-a24

- **本文**: Copilotの共通指示へ開発規約とリリースノート作成手順を一緒に書いたところ、通常のコード修正でもリリースノートが生成されるようになりました。開発規約は常時使い、リリースノートの手順は必要なタスクでだけ呼び出したいと考えています。どの内容をどこへ移すべきですか。
- **判定**: 常時指示と任意実行のPrompt Fileの分類が中心。さらにクライアントとLocal harnessの前提がない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 共通規約だけをPrompt Fileへ移す | 誤答 |
| B | 両方を同じ共通指示へ短縮して残す | 誤答 |
| C | 両方を個人の共通指示へ移す | 誤答 |
| D | ノート手順だけをPrompt Fileへ移す | 保存されている正答 |

- **文字長・位置**: 正答22文字／全四択中央値18.5文字＝1.19倍。保存時表示位置D。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。
- **仕様・日本語の留意点**: Prompt Fileが使えるVS CodeのLocal harness等の対象面を明記する。

### q-sc10-3-feature-20261016

- **本文**: 組織のCopilot除外では、同じhostとrepo pathを持つrepoをSSH形式で登録しています。利用者PはHTTPS、QはSSHで同じrepoをcloneしました。Qのユーザー名とポートは登録表記と異なります。除外するパス自体は一致しています。通常補完でのrepo識別について、適切な判断はどれですか。
- **判定**: 同じrepoと明示したうえでURL表記差を問う。プロトコル正規化の一仕様の適用で、本番相当より応用寄り。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Pだけ同じrepoとして照合する | 誤答 |
| B | Qだけ同じrepoとして照合する | 誤答 |
| C | PもQも同じrepoとして照合する | 保存されている正答 |
| D | PもQも別repoとして照合する | 誤答 |

- **文字長・位置**: 正答17文字／全四択中央値16文字＝1.06倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot除外の登録repoはhost Hのpath Rです。PはH/RをHTTPSでcloneし、Qは別host Jの別path SをSSHでcloneしました。パス除外の内容は同じです。登録したrepoへの照合結果はどれですか。
- **台帳が指定した変更後の正答**: Pだけ同じrepoとして照合する

### q-d1-e08-feature-20261016

- **本文**: Copilot approvalsのpublic previewを利用できる環境です。上位の設定では許可されていますが、このリポジトリは「Copilotによる承認」と「その承認をマージ要件へ数える」の両方が無効です。レビューコメントは届いています。人の必須承認数は変えず、Copilotの承認も要件へ数えたい場合、必要な変更はどれですか。
- **判定**: 両設定が無効、両方を有効にしたいという要望の直訳。承認機能のpreview条件は明示されているが、それ自体で難度は上がらない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Copilotによる承認だけを許可し、要件への算入は無効のままにする | 誤答 |
| B | repoの自動レビューだけを有効にし、承認関連の設定は維持する | 誤答 |
| C | Copilotによる承認を許可し、マージ要件への算入も有効にする | 保存されている正答 |
| D | 個人の自動レビューだけを有効にし、承認関連の設定は維持する | 誤答 |

- **文字長・位置**: 正答32文字／全四択中央値31.5文字＝1.02倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot approvalsのpublic previewを利用できる環境です。上位の設定では許可されていますが、このリポジトリは「Copilotによる承認」と「その承認をマージ要件へ数える」の両方が無効です。レビューコメントは届いています。人の必須承認数は変えず、Copilotの承認を表示したいが、要件へは数えない場合、必要な変更はどれですか。
- **台帳が指定した変更後の正答**: Copilotによる承認だけを許可し、要件への算入は無効のままにする

### q-d2-e08

- **本文**: VS Codeで、テストコードを準備・実行・検証の三段階（AAA形式）にする規約を共有しています。対象は、どの階層にあるものも含め、末尾が.test.tsのファイルだけです。規約を共通指示へ書いたところ、通常の実装コードにも混ざりました。共通規約の共有を保ち、AAA規約だけをテストへ限定する配置はどれですか。
- **判定**: 共通指示の残留とパス別適用、全階層のglobという競合を切り分ける。正答の特定に実在の指示適用方法が必要。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 共通指示のAAA規約を残し、applyTo: **/*.test.tsのパス別指示にも加える | 誤答 |
| B | 共通指示のAAA規約を外し、applyTo: **/*.test.tsのパス別指示へ移す | 保存されている正答 |
| C | 共通指示のAAA規約を外し、各対話で使う個人指示へ移す | 誤答 |
| D | 共通指示のAAA規約を外し、applyTo: *.test.tsのパス別指示へ移す | 誤答 |

- **文字長・位置**: 正答44文字／全四択中央値42.5文字＝1.04倍。保存時表示位置B。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d2-e02-feature-20261016

- **本文**: Copilot code reviewで、利用者の個人設定は自動レビューとReview new pushesを無効にしています。しかしリポジトリの有効なrulesetは自動レビューと新規pushのレビューを有効にしています。対象ブランチのPRへpushするとレビューが動きました。このPRだけでなく、以後もそのrulesetに沿って起動させる方針です。どの対応が合いますか。
- **判定**: 本文がruleset起動とその維持方針を明示する。誤答に「今回のレビューを無効扱い」「個人設定でrulesetも止める」があり、正答が目立つ。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 本文がruleset起動とその維持方針を明示する。誤答に「今回のレビューを無効扱い」「個人設定でrulesetも止める」があり、正答が目立つ。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 個人の自動レビューを有効にしない限り、今回のレビューを無効扱いにする | 誤答 |
| B | 個人設定を変えず、独立して適用されるrulesetによる起動を維持する | 保存されている正答 |
| C | 個人のReview new pushesだけを再度無効にし、rulesetの起動も止める | 誤答 |
| D | リポジトリのrulesetから自動レビューを外し、個別依頼だけにする | 誤答 |

- **文字長・位置**: 正答35文字／全四択中央値34.5文字＝1.01倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot code reviewで、利用者の個人設定は自動レビューとReview new pushesを無効にしています。しかしリポジトリの有効なrulesetは自動レビューと新規pushのレビューを有効にしています。対象ブランチのPRへpushするとレビューが動きました。このPRだけでなく、以後の自動起動をやめ、必要時の個別依頼だけにする方針です。どの対応が合いますか。
- **台帳が指定した変更後の正答**: リポジトリのrulesetから自動レビューを外し、個別依頼だけにする

### q-sc08-2-feature-20261016

- **本文**: ローカルVS CodeではCopilot Agentが依存を取得できますが、GitHubのCopilot cloud agentではセットアップ中に取得が失敗します。ローカルのproxy設定は確認済みです。クラウド側のセッションログにはセットアップ失敗があり、同じ作業をクラウドで続けたい場合、まず確認する対象はどれですか。
- **判定**: クラウドで失敗したのでクラウドの準備・外部接続を確認するだけ。Copilot固有のsetupファイル・ログ段階・設定境界を問えていない。
- **機能知識の必要性**: FEATURE_RELATED_BUT_GENERAL_REASONING
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | ローカルIDEのproxy設定を確認する | 誤答 |
| B | cloud agentに接続するMCPサーバー設定を確認する | 誤答 |
| C | cloud agentの準備と外部接続を確認する | 保存されている正答 |
| D | cloud agentで選ぶモデルの利用可否を確認する | 誤答 |

- **文字長・位置**: 正答24文字／全四択中央値25.5文字＝0.94倍。保存時表示位置C。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — 冒頭ではlocal成功・cloud失敗、変更部分ではcloud正常・local proxyだけ失敗。相反する観測が同居する。
- **台帳の変更後本文**: ローカルVS CodeではCopilot Agentが依存を取得できますが、GitHubのCopilot cloud agentではセットアップ中に取得が失敗します。ローカルのproxy設定は確認済みです。クラウド側は正常で、失敗が出るのはローカルIDEのproxy接続だけがあり、同じ作業をクラウドで続けたい場合、まず確認する対象はどれですか。
- **台帳が指定した変更後の正答**: ローカルIDEのproxy設定を確認する

### q-d1-a04-feature-20261016

- **本文**: VS CodeのCopilotで外部MCPツールを使います。通信開始は自動承認してよい一方、取得データには外部の指示文が混ざる可能性があるため、結果をChatの文脈へ追加する前には確認したいと考えています。Chat: Manage Tool Approvalで分けて設定すべき項目はどれですか。
- **判定**: 実行前と結果取込前の承認を分ける。正解・誤答の四つの組合せが同じ粒度で、外部データの扱いから設定を選べる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Pre-approvalの自動化を外し、Post-approvalは許可する | 誤答 |
| B | Pre-approvalとPost-approvalを両方許可する | 誤答 |
| C | Pre-approvalは許可し、Post-approvalの自動化は外す | 保存されている正答 |
| D | Pre-approvalとPost-approvalの自動化を両方外す | 誤答 |

- **文字長・位置**: 正答37文字／全四択中央値36文字＝1.03倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotで外部MCPツールを使います。通信開始だけを毎回確認し、承認した取得結果は確認なしでChatの文脈へ追加したいと考えています。Chat: Manage Tool Approvalで分けて設定すべき項目はどれですか。
- **台帳が指定した変更後の正答**: Pre-approvalの自動化を外し、Post-approvalは許可する

### q-d4-e01-feature-20261016

- **本文**: Copilot cloud agentが作成したcopilot/branchの既存PRを追加修正します。PRの作成者とは別の担当者が書込権限を持っています。新しいPRへ分割するのではなく、現在のPRのbranchへ修正を積みたい場合、どの依頼経路が合いますか。
- **判定**: 既存PRへ@copilotで依頼する経路の識別。branchと書込権限は題材になるが、失敗の競合仮説を判別する本番相当には足りない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 閲覧者が同じPRで@copilotへ追加修正を依頼する | 誤答 |
| B | 別のIssueを作成してCopilotへ割り当て、別タスクのPRを作る | 誤答 |
| C | Copilot ChatのAskで差分の説明だけを依頼する | 誤答 |
| D | 書込権限者が既存PRで@copilotへ追加修正を依頼する | 保存されている正答 |

- **文字長・位置**: 正答29文字／全四択中央値29文字＝1.00倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot cloud agentが作成したcopilot/branchの既存PRを追加修正します。PRの作成者とは別の担当者が書込権限を持っています。現在のPRへの追加修正をやめ、独立したIssueの別タスクとして新しいPRを作りたい場合、どの依頼経路が合いますか。
- **台帳が指定した変更後の正答**: 別のIssueを作成してCopilotへ割り当て、別タスクのPRを作る

### q-d3-a07-feature-20261016

- **本文**: VS CodeのLocal harnessにreview.prompt.mdを保存しました。frontmatterはname: inspect、tools: [read]で、agentは省略しています。このプロンプトを使う際、呼び出すコマンド名と既定の実行Agentの組合せはどれですか。
- **判定**: nameがファイル名を上書きする点とtools指定時の既定Agentを組み合わせる。応用として必要な二つの仕様がある。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | /inspectで呼び、tools指定によりagentを既定とする | 保存されている正答 |
| B | /reviewで呼び、tools指定によりagentを既定とする | 誤答 |
| C | /inspectで呼び、tools指定でも必ずaskを既定とする | 誤答 |
| D | /reviewで呼び、tools指定でも必ずaskを既定とする | 誤答 |

- **文字長・位置**: 正答33文字／全四択中央値32文字＝1.03倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのLocal harnessにreview.prompt.mdを保存しました。frontmatterはtools: [read]で、agentは省略しています。このプロンプトを使う際、呼び出すコマンド名と既定の実行Agentの組合せはどれですか。
- **台帳が指定した変更後の正答**: /reviewで呼び、tools指定によりagentを既定とする

### q-d3-a06-feature-20261016

- **本文**: VS CodeのLocal harnessで再利用プロンプトを作ります。argument-hintには対象モジュール名の説明を書きましたが、本文にはその入力を求める記載がありません。毎回利用者へ対象を尋ね、本文でその対象を使いたい場合、どの変更が合いますか。
- **判定**: 入力を求める構文だけが正しい用途で、applyToやtoolsを変数扱いする誤答が弱い。入力変数構文は毎回の対話UIを保証する機能とは区別すべき。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 入力を求める構文だけが正しい用途で、applyToやtoolsを変数扱いする誤答が弱い。入力変数構文は毎回の対話UIを保証する機能とは区別すべき。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | argument-hintだけ長くし、本文には対象を加えない | 誤答 |
| B | applyToへ対象名を書き、利用者の入力値として使う | 誤答 |
| C | toolsへ対象名を書き、入力変数として解決する | 誤答 |
| D | 本文へ入力変数の構文を加え、対象の入力を求める | 保存されている正答 |

- **文字長・位置**: 正答23文字／全四択中央値25.5文字＝0.90倍。保存時表示位置D。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — 入力要求が実装済みという変更と、元の入力が未記載という条件との関係を明記したい。
- **台帳の変更後本文**: VS CodeのLocal harnessで再利用プロンプトを作ります。argument-hintには対象モジュール名の説明を書きましたが、本文にはその入力を求める記載がありません。入力の要求方法は実装済みで、入力欄に表示する対象名の説明だけ改善したい場合、どの変更が合いますか。
- **台帳が指定した変更後の正答**: argument-hintだけ長くし、本文には対象を加えない
- **仕様・日本語の留意点**: 入力変数構文はモデルへの依頼方法であり、毎回の対話保証と断定しない。

### q-d3-a03-feature-20261016

- **本文**: Copilot Chatでリポジトリの意味索引は利用可能です。自動検索では旧版の仕様も候補になります。今回は手元で開いた現行仕様の特定ファイルを必ず質問へ含めたい場合、どの操作が最も直接的ですか。
- **判定**: 必ず含めたい特定ファイルを明示添付するだけ。他案が添付省略・Block解除・モデル再選択で、本文以前に正答が目立つ。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 必ず含めたい特定ファイルを明示添付するだけ。他案が添付省略・Block解除・モデル再選択で、本文以前に正答が目立つ。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 既存の索引をそのまま使い、対象ファイルの指定を省く | 誤答 |
| B | 公開コード一致のBlockを解除して質問する | 誤答 |
| C | 現行仕様のファイルをAdd Contextで明示して質問する | 保存されている正答 |
| D | モデルを再選択し、添付をせず同じ質問を送る | 誤答 |

- **文字長・位置**: 正答30文字／全四択中央値23.5文字＝1.28倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot Chatでリポジトリの意味索引は利用可能です。自動検索では旧版の仕様も候補になります。今回はどのファイルが関連するかまだ分からず、索引で関連箇所を探索したい場合、どの操作が最も直接的ですか。
- **台帳が指定した変更後の正答**: 既存の索引をそのまま使い、対象ファイルの指定を省く

### q-d1-e09-feature-20261016

- **本文**: Copilotのコード参照で、Pは昨日公開したばかりのrepo、Qは一度も公開していないrepoの実装と一致するかを調べました。どちらも参照が出ません。公開コード索引の対象範囲と反映時点から、参照が出なかった二件をどう評価しますか。
- **判定**: 公開索引の対象と反映時点を分ける実在の境界。ただし二件の分類に留まり、公開直後に反映完了を断定する二案も弱い。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: DISTRACTOR_CAUTION — 公開直後の反映完了を断定する二案が弱い。
- **難度**: 境界・要強化

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Pは索引反映待ちの可能性があり、Qは公開コード索引の対象外となる | 保存されている正答 |
| B | Pは索引反映待ちの可能性があり、Qは公開コード索引の対象となる | 誤答 |
| C | Pは公開直後に索引反映が完了しており、Qは公開コード索引の対象外となる | 誤答 |
| D | Pは公開直後に索引反映が完了しており、Qは公開コード索引の対象となる | 誤答 |

- **文字長・位置**: 正答32文字／全四択中央値33文字＝0.97倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilotのコード参照で、Pは昨日公開したばかりのrepo、Qは以前から公開され、索引への反映も確認済みのrepoの実装と一致するかを調べました。どちらも参照が出ません。公開コード索引の対象範囲と反映時点から、参照が出なかった二件をどう評価しますか。
- **台帳が指定した変更後の正答**: Pは索引反映待ちの可能性があり、Qは公開コード索引の対象となる

### q-sc05-3-feature-20261016

- **本文**: 組織のCopilot Seat利用者について、Git repo内とGit管理外の作業フォルダの両方の任意の階層で.envファイルを通常補完の対象から外したいと考えています。どの組織設定の書き方が対象範囲に合いますか。
- **判定**: Git repoの内外と全階層を別々の設定要素へ対応させる。四つのスコープの違いがあり、応用として成立する。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 対象repo: ["**/.env"] | 誤答 |
| B | "*": ["/.env"] | 誤答 |
| C | 対象repo: ["/.env"] | 誤答 |
| D | "*": ["**/.env"] | 保存されている正答 |

- **文字長・位置**: 正答16文字／全四択中央値16.5文字＝0.97倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: 組織のCopilot Seat利用者について、指定する一つのGit repo内だけの任意の階層で.envファイルを通常補完の対象から外したいと考えています。どの組織設定の書き方が対象範囲に合いますか。
- **台帳が指定した変更後の正答**: 対象repo: ["**/.env"]

### q-d3-e08-feature-20261016

- **本文**: Copilot cloud agentで、同じドメインへの要求を比較しました。setup stepsからの取得とMCPサーバープロセスの取得は成功し、AgentのBashツールからの取得だけfirewallで拒否されます。CopilotのAgent firewallの対象と観測に沿って、Bashからの必要な通信を通す変更はどれですか。
- **判定**: Bashの要求がfirewall拒否と既に特定されており、必要なドメインを許可する一操作。複数の成功観測は正答にほぼ影響しない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Internet accessで対象ドメインを許可する | 保存されている正答 |
| B | setup stepsの資格情報だけを再設定する | 誤答 |
| C | MCPサーバーの接続先だけを再設定する | 誤答 |
| D | ローカルIDEのproxyだけを更新する | 誤答 |

- **文字長・位置**: 正答27文字／全四択中央値22文字＝1.23倍。保存時表示位置A。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — Bashは成功する観測へ変えたのに「Bashからの必要な通信を通す変更」を尋ねる。MCP接続先変更を正答とする問いになっていない。
- **台帳の変更後本文**: Copilot cloud agentで、同じドメインへの要求を比較しました。setup stepsとAgentのBashツールからの取得は成功し、MCPサーバーの接続先だけが誤っていて取得に失敗されます。CopilotのAgent firewallの対象と観測に沿って、Bashからの必要な通信を通す変更はどれですか。
- **台帳が指定した変更後の正答**: MCPサーバーの接続先だけを再設定する

### q-d5-e07-feature-20261016

- **本文**: Copilot CLIで--available-tools=read,searchと--excluded-tools=searchを同時に指定しました。さらに--allow-tool=shellを指定しています。実行に必要な環境は正常です。この三指定を、候補の絞り込みと実行許可の二段階へ分けると、モデルが選べるツールはどれですか。
- **判定**: CLIのavailable-toolsへread,searchを渡すが、公式の標準ツール名はview,grep等。権限パターンのread/shellやcustom agent別名との混同がある。現状の正答を正式なCLI例として支持できない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 正答の前提を修正して再判定

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | readだけで、searchとshellは候補にならない | 誤答 |
| B | readとsearchとshellで、三つとも候補になる | 誤答 |
| C | readとsearchで、shellは候補にならない | 保存されている正答 |
| D | readとshellで、searchだけは候補にならない | 誤答 |

- **文字長・位置**: 正答26文字／全四択中央値28文字＝0.93倍。保存時表示位置C。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — 「ありますしました」「この三指定」が一つの候補制限へ変えた説明に残る。
- **台帳の変更後本文**: Copilot CLIで--excluded-tools=searchだけで候補を制限し、既定の候補にはreadとshellがありますしました。さらに--allow-tool=shellを指定しています。実行に必要な環境は正常です。この三指定を、候補の絞り込みと実行許可の二段階へ分けると、モデルが選べるツールはどれですか。
- **台帳が指定した変更後の正答**: readとshellで、searchだけは候補にならない
- **本文の修正要件**: CLI標準のview/grep/bash等で候補制限を書き直す。permission kindとtool nameを分け、実行環境も指定する。

### q-d6-a03-feature-20261016

- **本文**: Content Exclusionを設定したファイルから通常補完は出なくなりました。ただし別ファイルで参照する型の情報が、IDEの型情報としてCopilotへ伝わる可能性は残ります。設定反映とパス一致は確認済みです。保護範囲を正しく説明するのはどれですか。
- **判定**: IDEの型情報が伝わる可能性を本文が明記し、正答でも同じ型・hover情報を選ぶ。知識の適用より本文の言い換え。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 同じファイルに残っている別の上位除外ルール | 誤答 |
| B | IDEが別経路で与える型・hoverなどの間接的な意味情報 | 保存されている正答 |
| C | 同じファイルへの除外設定の未反映 | 誤答 |
| D | 生成候補の公開コード一致による出力側の抑制 | 誤答 |

- **文字長・位置**: 正答29文字／全四択中央値21文字＝1.38倍。保存時表示位置B。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — 未反映へ条件を変えたのに、指定した正答は別の上位除外ルール。未反映を述べる選択肢と取り違えている。
- **台帳の変更後本文**: Content Exclusionを設定したファイルから通常補完は出なくなりました。ただし別ファイルで参照する型の情報が、IDEの型情報としてCopilotへ伝わる可能性は残ります。設定が未反映で、実際のファイル内容も通常補完へ使われていることを確認しました。保護範囲を正しく説明するのはどれですか。
- **台帳が指定した変更後の正答**: 同じファイルに残っている別の上位除外ルール

### q-d2-a20

- **本文**: 注文の参照先として、朝のCSVをアップロードしたCopilot Spacesと、利用者の担当範囲を認可する注文管理APIがあります。午後に発生したキャンセルを含む現在の状態を、担当者の閲覧権限を守って照会します。データの更新操作は必要ありません。どのデータ取得経路を使うべきですか。
- **判定**: 認可済みの現在APIと朝のCSVの選択は、一般のデータ鮮度判断だけでも解ける。Copilotのツール接続や権限伝播の実効条件が必要。
- **機能知識の必要性**: FEATURE_RELATED_BUT_GENERAL_REASONING
- **選択肢単体**: DISTRACTOR_CAUTION — 一案だけが認可と鮮度を同時に明示する。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 朝のCSVを読むSpaces | 誤答 |
| B | 認可付きAPIを読むMCPツール | 保存されている正答 |
| C | CSVの形式を説明する共通指示 | 誤答 |
| D | 朝のCSVを添付するPrompt File | 誤答 |

- **文字長・位置**: 正答16文字／全四択中央値15.5文字＝1.03倍。保存時表示位置B。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d2-e19-feature-20261016

- **本文**: Copilot SpaceにGitHubの仕様ファイルをリンクし、別の設計書はPDFとしてアップロードしました。両方の原本が改訂されました。GitHub側のリンク先は更新済みですが、アップロードしたPDFはまだ旧版です。両方の現行版をSpaceで使い、今後もGitHub側はリンクで追従させたい場合、必要最小の更新はどれですか。
- **判定**: リンク先は更新済み・PDFは旧版と明示され、PDFだけ差し替える答えを本文からそのまま取れる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | GitHubリンクもPDFも維持する | 誤答 |
| B | GitHubリンクを現行ファイルへ付け直し、PDFも差し替える | 誤答 |
| C | GitHubリンクを維持し、PDFを現行版に差し替える | 保存されている正答 |
| D | PDFを維持し、GitHubリンクを現行ファイルへ付け直す | 誤答 |

- **文字長・位置**: 正答27文字／全四択中央値28文字＝0.96倍。保存時表示位置C。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — リンク先更新済みという説明を残して「PDFは差替済みですがリンクは別の旧仕様」と続け、変更対象の区別が読みにくい。
- **台帳の変更後本文**: Copilot SpaceにGitHubの仕様ファイルをリンクし、別の設計書はPDFとしてアップロードしました。両方の原本が改訂されました。GitHub側のリンク先は更新済みですが、PDFは現行版へ差し替え済みですが、GitHubリンクは別の旧仕様ファイルを指しています。両方の現行版をSpaceで使い、今後もGitHub側はリンクで追従させたい場合、必要最小の更新はどれですか。
- **台帳が指定した変更後の正答**: PDFを維持し、GitHubリンクを現行ファイルへ付け直す

### q-d5-a09-feature-20261016

- **本文**: VS CodeのCopilotで、Markdownでは自動インライン提案を止め、TypeScriptでは使い続けたいと考えています。CopilotのアカウントやChatは維持します。この条件を満たす言語別設定はどれですか。
- **判定**: Markdown停止・TypeScript維持を四択が同じ語で繰り返す。実際の設定キー・設定範囲を確認させず、基礎の定義照合に近い。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Copilotの言語別設定で、MarkdownもTypeScriptも無効にする | 誤答 |
| B | Copilotの言語別設定で、Markdownを無効・TypeScriptを有効にする | 保存されている正答 |
| C | Copilotの言語別設定で、Markdownを有効・TypeScriptを無効にする | 誤答 |
| D | Copilotの言語別設定で、MarkdownもTypeScriptも有効にする | 誤答 |

- **文字長・位置**: 正答43文字／全四択中央値41.5文字＝1.04倍。保存時表示位置B。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — 目標を全言語の停止に変えたが、指定案はMarkdownとTypeScriptの二言語だけ。他の言語がないという前提がない。
- **台帳の変更後本文**: VS CodeのCopilotで、すべての言語でインライン補完を止めたいと考えています。CopilotのアカウントやChatは維持します。この条件を満たす言語別設定はどれですか。
- **台帳が指定した変更後の正答**: Copilotの言語別設定で、MarkdownもTypeScriptも無効にする

### q-d2-e06

- **本文**: GitHub Copilot CLIの権限管理ポリシーの演習です。セッションPはshellツールが利用可能で、Git操作を許可しgit pushだけ拒否しています。セッションQは利用可能ツールを読取系だけに制限し、Git操作の許可も指定しています。システム規則では、denyはallowより優先し、許可指定は利用可能ツールを増やさない規則です。この設定において、セッションPおよびQでgit commitとgit pushの実行を試みた場合の結果として最も適切なものはどれですか？
- **判定**: deny優先と候補制限の二規則を本文が全部与える。規則の二ケースへの代入にはなるが、製品仕様を適用する本番相当としては軽い。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Pではcommitが許可されpushは拒否されるが、Qでは実行ツール制限によりcommitもpushも拒否される | 保存されている正答 |
| B | Pではcommitもpushも両方許可され、Qでは実行ツールの制限によりcommitもpushも拒否される | 誤答 |
| C | Pではcommitが許可されpushは拒否され、QではGit操作許可によりcommitもpushも許可される | 誤答 |
| D | Pでは個別拒否によりcommitもpushも拒否され、QではGit許可によりcommit可・push不可となる | 誤答 |

- **文字長・位置**: 正答56文字／全四択中央値54.5文字＝1.03倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: GitHub Copilot CLIの権限管理ポリシーの演習です。セッションPはshellツールが利用可能で、Git操作を許可しgit pushだけ拒否しています。セッションQはshellツールも利用可能にし、個別拒否はなく、Git操作の許可も指定しています。システム規則では、denyはallowより優先し、許可指定は利用可能ツールを増やさない規則です。この設定において、セッションPおよびQでgit commitとgit pushの実行を試みた場合の結果として最も適切なものはどれですか？
- **台帳が指定した変更後の正答**: Pではcommitが許可されpushは拒否され、QではGit操作許可によりcommitもpushも許可される

### q-d5-e02-feature-20261016

- **本文**: VS CodeのCopilotで複数MCPツールの承認を保存しています。read_reportの承認は維持しますが、update_recordだけは以後の実行前確認を復活させたいと考えています。update_recordは候補として残し、結果取込の設定も変えません。どの操作が最小ですか。
- **判定**: 一ツールのPre-approvalだけを変更する実在操作。Reset全体・提供候補・Post承認との区別は応用として妥当だが本番相当には弱い。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Reset Tool Confirmationsで保存済み承認をすべてリセットする | 誤答 |
| B | Manage Tool Approvalでupdate_recordのPre-approvalだけを変更する | 保存されている正答 |
| C | ツール選択でupdate_recordだけを候補から外す | 誤答 |
| D | Manage Tool Approvalでupdate_recordのPost-approvalだけを変更する | 誤答 |

- **文字長・位置**: 正答54文字／全四択中央値47.5文字＝1.14倍。保存時表示位置B。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — 全保存済み承認を消すという変更の後に、結果取込設定は変えないという制約が残る。全承認Resetとの整合を取れていない。
- **台帳の変更後本文**: VS CodeのCopilotで複数MCPツールの承認を保存しています。すべてのツールの保存済み承認を消し、既定の確認を復活させたいと考えています。update_recordは候補として残し、結果取込の設定も変えません。どの操作が最小ですか。
- **台帳が指定した変更後の正答**: Reset Tool Confirmationsで保存済み承認をすべてリセットする

### q-d1-e03-feature-20261016

- **本文**: Copilot Agentがワークスペースのコードを変更し、MCPで外部のチケットも更新しました。現在のクライアントはコード変更を以前のcheckpointへ復元できますが、外部サービスの更新をcheckpointで巻き戻す機能はありません。コードと外部チケットの両方を作業前へ戻す必要があります。機能の範囲に合う対処はどれですか。
- **判定**: checkpointで戻せるもの・戻せないものを本文で全部教え、両方戻す対処を選ぶだけ。三段階推論欄があっても推論課題がない。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | コードをcheckpointで復元し、外部チケットは現在の状態を残す | 誤答 |
| B | コードは現在の状態を残し、外部チケットだけ更新を戻す | 誤答 |
| C | コードと外部チケットを現在の状態に残し、セッションだけ停止する | 誤答 |
| D | コードはcheckpointで復元し、外部チケットは別途更新を戻す | 保存されている正答 |

- **文字長・位置**: 正答33文字／全四択中央値32文字＝1.03倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot Agentがワークスペースのコードを変更し、MCPで外部のチケットも更新しました。現在のクライアントはコード変更を以前のcheckpointへ復元できますが、外部サービスの更新をcheckpointで巻き戻す機能はありません。コードだけを作業前へ戻し、外部チケットの更新は残す必要があります。機能の範囲に合う対処はどれですか。
- **台帳が指定した変更後の正答**: コードをcheckpointで復元し、外部チケットは現在の状態を残す

### q-d1-e07-feature-20261016

- **本文**: VS CodeのCopilotで、URL取得の設定をapproveRequest: true、approveResponse: falseにしています。要求の送信は確認なしで成功しますが、得られたページを文脈に加える前には確認が出ます。対象ドメインへの通信は引き続き自動にし、応答内容は毎回確認する方針です。どの変更が必要ですか。
- **判定**: 現在の要求・応答設定と、そのまま保つ方針がすべて本文にある。正答は変更なしで、仕様照合をほぼ要しない。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 設定を維持し、応答を文脈へ入れる際の確認を続ける | 保存されている正答 |
| B | approveResponseもtrueにして、応答の確認を省く | 誤答 |
| C | approveRequestをfalseにし、送信前にも確認を追加する | 誤答 |
| D | approveRequestをfalse、approveResponseをtrueへ反転する | 誤答 |

- **文字長・位置**: 正答24文字／全四択中央値33.5文字＝0.72倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotで、URL取得の設定をapproveRequest: true、approveResponse: falseにしています。要求の送信は確認なしで成功しますが、得られたページを文脈に加える前には確認が出ます。対象ドメインへの通信は引き続き自動にし、応答内容も確認なしで文脈へ加える方針です。どの変更が必要ですか。
- **台帳が指定した変更後の正答**: approveResponseもtrueにして、応答の確認を省く

### q-d1-a11-feature-20261016

- **本文**: VS Codeが接続をmeteredとして扱うネットワークで、built-in Copilot providerを使います。Copilotは有効で、認証とサービスの疎通も正常ですが、新しいghost textやNESが自動では出ません。ネットワークや継続的な有効設定を変えず、今回必要な一回のインライン提案を得る操作はどれですか。
- **判定**: meteredでの自動要求抑制と明示要求の違いは実仕様。コマンド識別が中心で応用の入口。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Copilotのインライン補完を全言語で無効にする | 誤答 |
| B | Next Edit Suggestionsだけを無効にする | 誤答 |
| C | Trigger Inline Suggestionで明示的に提案を要求する | 保存されている正答 |
| D | Chatのmodel pickerで利用モデルを選び直す | 誤答 |

- **文字長・位置**: 正答37文字／全四択中央値28.5文字＝1.30倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS Codeが接続をmeteredとして扱うネットワークで、built-in Copilot providerを使います。Copilotは有効で、認証とサービスの疎通も正常ですが、新しいghost textやNESが自動では出ません。ネットワークは変えず、今後は全言語でインライン補完を継続的に止める操作はどれですか。
- **台帳が指定した変更後の正答**: Copilotのインライン補完を全言語で無効にする

### q-d1-a17-feature-20261016

- **本文**: VS CodeのCopilot Chatで、別フォルダにある同名のparse関数を比較します。ファイル全体やフォルダ全体ではなく、二つの関数を文脈として明示したいと考えています。片方のファイルしか開いていないとき、どの操作が合いますか。
- **判定**: 二つのシンボルを指定する操作と、シンボル候補に開いたファイルが必要な条件を組み合わせる。応用として成立する。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Add ContextのFiles & Foldersで、対象の二ファイルを選ぶ | 誤答 |
| B | 両ファイルを開き、Add ContextのSymbolsで対象の関数を選ぶ | 保存されている正答 |
| C | Add ContextのFiles & Foldersで、二つのフォルダを選ぶ | 誤答 |
| D | Chatに#codebaseを指定し、コードベース全体の検索を使う | 誤答 |

- **文字長・位置**: 正答37文字／全四択中央値38文字＝0.97倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilot Chatで、別フォルダにある同名のparse関数を比較します。二つの関数だけでなく、それらを含む二ファイル全体を文脈として明示したいと考えています。片方のファイルしか開いていないとき、どの操作が合いますか。
- **台帳が指定した変更後の正答**: Add ContextのFiles & Foldersで、対象の二ファイルを選ぶ

### q-sc07-1-feature-20261016

- **本文**: Copilot CLIの過去セッションが複数あります。自動実行の環境にはTTYがなく、再開したいセッションIDは分かっています。意図しない新規セッションを始めず、そのIDを再開する指定はどれですか。
- **判定**: 非TTY・複数候補・既知IDという条件でresume/continue/新規を区別する。コマンド識別中心だが実務上の条件はある。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | --resume=SESSION-IDを明示して起動する | 保存されている正答 |
| B | 値なしの--resumeだけを指定して選択画面を出す | 誤答 |
| C | --continueで常に直近のセッションを選ぶ | 誤答 |
| D | -pだけで同じプロンプトを新規実行する | 誤答 |

- **文字長・位置**: 正答28文字／全四択中央値25文字＝1.12倍。保存時表示位置A。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — 特定IDを選ばない条件へ変えたのに、問いが「そのIDを再開する」のまま。
- **台帳の変更後本文**: Copilot CLIの過去セッションが複数あります。自動実行の環境にはTTYがなく、直近のセッションを再開したく、特定のIDを選ぶ必要はありません。意図しない新規セッションを始めず、そのIDを再開する指定はどれですか。
- **台帳が指定した変更後の正答**: --continueで常に直近のセッションを選ぶ

### q-d5-e05-feature-20261016

- **本文**: Copilot cloud agentとCopilot code reviewが同じcopilot-setup-steps.ymlを使っています。実装Agentの準備は保ち、レビュー側だけ追加の解析ツールを事前導入したいと考えています。レビュー専用の環境設定を分けられる現行の構成では、どの変更が合いますか。
- **判定**: レビュー専用準備という要望と専用ファイル名を対応させる一仕様。応用には使えるが本番相当の多段階判断ではない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 共通copilot-setup-steps.ymlへ解析ツールを追加する | 誤答 |
| B | レビュー用Instructionsへ解析ツールの使い方を追加する | 誤答 |
| C | copilot-code-review.ymlでレビューの準備を分離する | 保存されている正答 |
| D | 依頼者のローカルIDEへ解析ツールを追加する | 誤答 |

- **文字長・位置**: 正答36文字／全四択中央値34文字＝1.06倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot cloud agentとCopilot code reviewが同じcopilot-setup-steps.ymlを使っています。実装Agentとレビューの両方で共通に追加の解析ツールを事前導入したいと考えています。レビュー専用の環境設定を分けられる現行の構成では、どの変更が合いますか。
- **台帳が指定した変更後の正答**: 共通copilot-setup-steps.ymlへ解析ツールを追加する

### q-d4-e08-feature-20261016

- **本文**: GitHub.comのCopilot cloud agentで、EnterpriseとOrganizationとrepoに同じファイル名のカスタムAgentがあります。repo版を使って開始したタスクがPRを作りました。その後repo版の定義を更新しました。現在のPR内での追加対話には開始時と同じ版を使い、新しい版は別の新規タスクで試したい場合、どの扱いが合いますか。
- **判定**: 現在PRには開始時版・新規taskで新版という結論を本文が要望として提示し、正答がそのまま繰り返す。階層の設定差を推論する課題になっていない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 現在PRをOrganization版へ切替え、新規タスクはEnterprise版を使う | 誤答 |
| B | 現在PRも即時に更新後のrepo版へ切替え、新規タスクも同じ版を使う | 誤答 |
| C | 現在PRは開始時のrepo版を使い、新規タスクで更新後のrepo版を使う | 保存されている正答 |
| D | 現在PRは開始時のrepo版を使い、新規タスクではOrganization版を使う | 誤答 |

- **文字長・位置**: 正答36文字／全四択中央値38.5文字＝0.94倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: GitHub.comのCopilot cloud agentで、EnterpriseとOrganizationとrepoに同じファイル名のカスタムAgentがあります。repo版を使って開始したタスクがPRを作りました。その後repo版を削除し、Organizationの同名定義だけが残りました。現在のPR内での追加対話には開始時と同じ版を使い、新しい版は別の新規タスクで試したい場合、どの扱いが合いますか。
- **台帳が指定した変更後の正答**: 現在PRは開始時のrepo版を使い、新規タスクではOrganization版を使う

### q-d4-e04-feature-20261016

- **本文**: Prompt Fileに対応するVS CodeのLocal harnessを使います。VS CodeでCopilotのカスタムAgent「調査」を使います。そのAgentはreadとsearchを許可しています。起動したPrompt Fileにはagent: 調査、tools: [read, metrics/get]が指定されています。readとsearchは利用可能ですが、metrics/getを提供するMCPサーバーは未接続です。Prompt Fileに指定したツール一覧が優先され、利用不能なツールは無視される仕様で、今回提供されるツールはどれですか。
- **判定**: Prompt Fileが優先・未接続ツールは無視という二規則を本文が教える。残るreadを選ぶ集合の演算で、Copilot知識を測れていない。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: DISTRACTOR_CAUTION — 未接続ツールも使えるとする二案が弱い。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | readとsearchが提供され、Agentの一覧が維持される | 誤答 |
| B | readとmetrics/getが提供され、未接続ツールも利用できる | 誤答 |
| C | readだけが提供され、searchは引き継がれない | 保存されている正答 |
| D | readとsearchとmetrics/getが提供され、二つの一覧が合成される | 誤答 |

- **文字長・位置**: 正答26文字／全四択中央値32.5文字＝0.80倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Prompt Fileに対応するVS CodeのLocal harnessを使います。VS CodeでCopilotのカスタムAgent「調査」を使います。そのAgentはreadとsearchを許可しています。起動したPrompt Fileにはagent: 調査、toolsの指定はありません。readとsearchは利用可能ですが、metrics/getを提供するMCPサーバーは未接続です。Prompt Fileに指定したツール一覧が優先され、利用不能なツールは無視される仕様で、今回提供されるツールはどれですか。
- **台帳が指定した変更後の正答**: readとsearchが提供され、Agentの一覧が維持される

### q-d3-a19-feature-20261016

- **本文**: VS CodeでCopilot Chatの接続だけが失敗します。補完は利用でき、通常のログにはタイムアウトしか出ていません。社内サポートから「Copilotの接続先ごとの到達性を確認できる診断情報」を求められました。最初に取得する情報はどれですか。
- **判定**: 到達性診断・詳細ログ・保存ログ・Electron Consoleの用途を区別する。語義対応が強いが、応用の入口として使える。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Developer: Set Log LevelでTraceにし、以後の詳細イベントを収集する | 誤答 |
| B | Developer: Chat Diagnosticsを実行し、Reachabilityの結果を確認する | 保存されている正答 |
| C | Developer: Open Extension Logs Folderから、保存済みのログを収集する | 誤答 |
| D | Developer: Toggle Developer Toolsを開き、ElectronのConsoleを確認する | 誤答 |

- **文字長・位置**: 正答52文字／全四択中央値52文字＝1.00倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeでCopilot Chatの接続だけが失敗します。補完は利用でき、通常のログにはタイムアウトしか出ていません。接続先への到達性診断は取得済みで、社内サポートから「再現操作中の詳細イベントを新たに記録してほしい」と求められました。最初に取得する情報はどれですか。
- **台帳が指定した変更後の正答**: Developer: Set Log LevelでTraceにし、以後の詳細イベントを収集する

### q01-feature-20261016

- **本文**: VS CodeのCopilotをManual permissionsで使います。検索や通常のファイル編集に関する既存の承認は保ちますが、ターミナルのnpm publishだけは毎回確認したい方針です。現在はnpmコマンドを自動承認するルールがあります。どの設定を見直しますか。
- **判定**: 承認を残す範囲は具体的。ただし「拒否ルール」は実行禁止と誤読され、falseで確認を要求する意味が選択肢から伝わらない。正式キーの接頭辞も省略されている。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | terminal.autoApproveでnpm publishに対する拒否ルールを設ける | 保存されている正答 |
| B | eligibleForAutoApprovalで全ツールを自動承認不可にする | 誤答 |
| C | permissions.defaultをAllow allへ変更する | 誤答 |
| D | urls.autoApproveでnpmのレジストリを拒否する | 誤答 |

- **文字長・位置**: 正答45文字／全四択中央値36文字＝1.25倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotをManual permissionsで使います。検索や通常のファイル編集に関する既存の承認は保ちますが、URL取得ツールでnpmレジストリの応答を取り込む際だけ毎回確認したい方針です。現在はnpmコマンドを自動承認するルールがあります。どの設定を見直しますか。
- **台帳が指定した変更後の正答**: urls.autoApproveでnpmのレジストリを拒否する
- **仕様・日本語の留意点**: 正式なchat.tools.terminal.autoApproveとfalseの確認要求を明記し、実行禁止のdenyと区別する。

### q-sc03-1-feature-20261016

- **本文**: スクリプトからGitHub Copilot CLIへ一つのプロンプトを渡します。回答後にプロセスを終了し、標準出力には利用統計を付けず回答だけを受け取りたい場合、どの起動オプションの組合せが合いますか。
- **判定**: 非対話の終了と回答のみ出力という二条件を、-pと--silentへ対応させる。実在の近接起動方法を比較できる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | -iでプロンプトを渡し、対話セッションを開いたままにする | 誤答 |
| B | -pでプロンプトを渡し、--silentは付けず通常出力を受け取る | 誤答 |
| C | --resumeだけを指定し、選択画面から過去セッションを選ぶ | 誤答 |
| D | -pでプロンプトを渡し、--silentで回答のみを出す | 保存されている正答 |

- **文字長・位置**: 正答28文字／全四択中央値29.5文字＝0.95倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: スクリプトからGitHub Copilot CLIへ一つのプロンプトを渡します。最初の回答後も同じプロセスで対話を続けたい場合、どの起動オプションの組合せが合いますか。
- **台帳が指定した変更後の正答**: -iでプロンプトを渡し、対話セッションを開いたままにする

### q-d2-e01-feature-20261016

- **本文**: Copilot cloud agentのために.github/workflows/copilot-setup-steps.ymlを作りました。job名はprepareで、ファイルはfeature branchだけにあります。通常Actionsとしての手動実行は成功しますが、Agentの新規タスクでは準備が使われません。Copilotのセットアップとして認識させる修正はどれですか。
- **判定**: 正答だけが正式job名とdefault branchを満たす。他案は常に壊れた構成を残すので、本文を隠しても正規構成だけを選べる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 正答だけが正式job名とdefault branchを満たす。他案は常に壊れた構成を残すので、本文を隠しても正規構成だけを選べる。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | job名だけcopilot-setup-stepsにし、feature branchだけに残す | 誤答 |
| B | copilot-setup-stepsへjob名を直し、default branchへ反映する | 保存されている正答 |
| C | default branchへ反映し、job名prepareは維持する | 誤答 |
| D | 通常Actionsの手動実行だけを繰り返し、ファイルとjob名は維持する | 誤答 |

- **文字長・位置**: 正答47文字／全四択中央値41.5文字＝1.13倍。保存時表示位置B。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — jobは既にcopilot-setup-stepsへ直した条件なのに、指定した正答は「job名prepareは維持する」。正答を切り替える検証が成立しない。
- **台帳の変更後本文**: Copilot cloud agentのために.github/workflows/copilot-setup-steps.ymlを作りました。job名はすでにcopilot-setup-stepsで、ファイルはfeature branchだけにあります。通常Actionsとしての手動実行は成功しますが、Agentの新規タスクでは準備が使われません。Copilotのセットアップとして認識させる修正はどれですか。
- **台帳が指定した変更後の正答**: default branchへ反映し、job名prepareは維持する

### q-d3-a16-feature-20261016

- **本文**: ローカルVS CodeでAPIの型を修正しましたが、まだコミットもpushもしていません。GitHub.comのrepoを文脈にしたCopilot Chatは、GitHub上の旧型を参照しています。手元の修正版について説明を求めたい場合、どの操作が最も直接的ですか。
- **判定**: 未pushのローカル変更とGitHub上の版を分ける題材は妥当。ただし正答一件だけがローカル最新版を扱い、他三案がGitHub側に寄る。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: DISTRACTOR_CAUTION — 一案だけローカル最新版で、他三案はGitHub側。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | GitHub.comの同じrepo文脈で、同じ質問を続ける | 誤答 |
| B | ローカルIDEのChatで、手元の修正済みファイルを明示添付する | 保存されている正答 |
| C | GitHub上の版を対象に、cloud agentへ説明の作成を委任する | 誤答 |
| D | GitHub上の同じファイルをSpaceにリンクして質問する | 誤答 |

- **文字長・位置**: 正答32文字／全四択中央値31文字＝1.03倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: ローカルVS CodeでAPIの型を修正しましたが、まだコミットもpushもしていません。GitHub.comのrepoを文脈にしたCopilot Chatは、GitHub上の旧型を参照しています。GitHub上の旧型のままについて説明を求めたい場合、どの操作が最も直接的ですか。
- **台帳が指定した変更後の正答**: GitHub.comの同じrepo文脈で、同じ質問を続ける

### q-d5-a15-feature-20261016

- **本文**: VS CodeのCopilotへstdioのMCPを追加します。サーバーのAPI_KEY環境変数へ、接続時に利用者が入力した秘密値を渡します。共有mcp.jsonには値を保存せず、入力欄でも値を隠したい場合、どの構成が合いますか。
- **判定**: 秘密入力としてmasked input参照だけが妥当。非表示・実値の受け渡しを同時に満たす正答に対し、パスやダミー値の誤答が弱い。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 秘密入力としてmasked input参照だけが妥当。非表示・実値の受け渡しを同時に満たす正答に対し、パスやダミー値の誤答が弱い。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | password: falseのpromptString入力を定義し、env.API_KEYで${input:apiKey}を参照する | 誤答 |
| B | password: trueのpromptString入力を定義し、env.API_KEYで${workspaceFolder}を参照する | 誤答 |
| C | password: trueのpromptString入力を定義し、env.API_KEYには固定ダミー値を指定する | 誤答 |
| D | password: trueのpromptString入力を定義し、env.API_KEYで${input:apiKey}を参照する | 保存されている正答 |

- **文字長・位置**: 正答66文字／全四択中央値66.5文字＝0.99倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotへstdioのMCPを追加します。サーバーのAPI_KEY環境変数へ、接続時に利用者が入力した非秘密の演習用ラベルを渡します。共有mcp.jsonには値を保存せず、入力欄では値を隠さず表示したい場合、どの構成が合いますか。
- **台帳が指定した変更後の正答**: password: falseのpromptString入力を定義し、env.API_KEYで${input:apiKey}を参照する

### q-d6-e07-feature-20261016

- **本文**: 機密ファイルをCopilotのContent Exclusionへ登録しています。通常補完での除外は確認済みですが、Copilot CLIではローカル読取ツールからも、社内MCPの検索ツールからも同じ内容を取得できます。今回のCLIでは機密への両経路を候補から外し、通常補完の除外は維持したいと考えています。CLIがContent Exclusion非対応という前提で、必要な対処はどれですか。
- **判定**: CLI非対応という仕様まで本文が与え、正答だけが両方の機密取得経路を閉じる。製品知識より安全な包括策を選ぶ作り。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: GUESSING_CUE_RISK — CLI非対応という仕様まで本文が与え、正答だけが両方の機密取得経路を閉じる。製品知識より安全な包括策を選ぶ作り。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 通常補完の除外だけを維持し、CLIの二つの取得経路は変更しない | 誤答 |
| B | CLIからローカル読取だけを外し、機密を返すMCP検索は候補に残す | 誤答 |
| C | MCP検索だけを外し、CLIのローカル読取は候補に残す | 誤答 |
| D | CLIで利用可能なツールを必要な非機密のものへ絞り、機密を返すMCPも外す | 保存されている正答 |

- **文字長・位置**: 正答37文字／全四択中央値32文字＝1.16倍。保存時表示位置D。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — ローカルの機密読取が成功しない状態へ変えても、問いは両経路を候補から外すまま。指定案はローカル読取を候補に残すので要件違反。
- **台帳の変更後本文**: 機密ファイルをCopilotのContent Exclusionへ登録しています。通常補完での除外は確認済みですが、Copilot CLIではローカル読取はすでに機密へアクセスできず、社内MCPの検索だけから同じ内容を取得できます。今回のCLIでは機密への両経路を候補から外し、通常補完の除外は維持したいと考えています。CLIがContent Exclusion非対応という前提で、必要な対処はどれですか。
- **台帳が指定した変更後の正答**: MCP検索だけを外し、CLIのローカル読取は候補に残す

### q-d3-a14-feature-20261016

- **本文**: VS CodeのCopilotで、社内検索のMCPツールsearch_catalogは接続・認証・有効化が済んでいます。しかしAgentが通常のコード検索を使うため、今回は社内検索を明示的に使わせたいと考えています。どの入力が合いますか。
- **判定**: 既知のsearch_catalogを使いたいので同名ツールを明示する、という起動操作の識別に留まる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | #codebaseを指定してワークスペース検索を依頼する | 誤答 |
| B | 既知の仕様ファイルを添付して内容の説明を依頼する | 誤答 |
| C | #のツール候補からsearch_catalogを選び、対象を指定する | 保存されている正答 |
| D | Web取得ツールへ既知の資料URLを指定する | 誤答 |

- **文字長・位置**: 正答34文字／全四択中央値26文字＝1.31倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotで、社内MCPを使わずローカルの未知の関連実装を探したいと考えています。ワークスペース全体の検索を明示する操作はどれですか。
- **台帳が指定した変更後の正答**: #codebaseを指定してワークスペース検索を依頼する

### q-d5-e01-feature-20261016

- **本文**: GitHub上のテストは成功しますが、手元の未コミット修正を含めると失敗します。修正版はまだ共有せず、今のローカル環境でCopilotに調査・編集・テスト実行を任せたいと考えています。GitHubのcloud agentはGitHub上の内容で開始します。どの構成が合いますか。
- **判定**: 未pushをローカルで編集・実行したいという条件がローカルAgentへ直結する。Agentの選択として応用には使えるが、本番相当には軽い。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | ローカルAgentで手元の作業を編集・実行する | 保存されている正答 |
| B | GitHubに共有済みの版をcloud agentで編集・実行する | 誤答 |
| C | ローカルAskで案を受け取り、自分で実行する | 誤答 |
| D | GitHubのCopilot code reviewへ共有済み差分を渡す | 誤答 |

- **文字長・位置**: 正答23文字／全四択中央値28文字＝0.82倍。保存時表示位置A。
- **反実仮想**: MULTI_CHANGE_REPLAY — 問題文の大部分や複数の状態を置き換えた別ケース。単一条件を変える反実仮想としての証拠は弱い。
- **台帳の変更後本文**: 修正版をすでにGitHubへ共有しました。手元の環境を使わずGitHubの一時環境でCopilotに編集とテスト実行を委任します。どの構成が合いますか。
- **台帳が指定した変更後の正答**: GitHubに共有済みの版をcloud agentで編集・実行する

### q-d5-e04-feature-20261016

- **本文**: VS CodeでCopilot ChatはモデルNへ変更しましたが、ghost textの提案モデルはMのままです。両方とも利用可能なモデルです。ChatはNを保ち、インライン提案のモデルだけを切り替えたい場合、どの操作が合いますか。
- **判定**: Chatとインラインの設定経路の差は製品機能。どのコントロールを開くかが中心で応用の入口。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Chatのmodel pickerから会話用モデルを選ぶ | 誤答 |
| B | Copilotの設定でNext Edit Suggestionsの有効・無効を切り替える | 誤答 |
| C | Copilotのステータスメニューで言語別の提案を有効・無効にする | 誤答 |
| D | Configure Inline Suggestionsから提案モデルを選ぶ | 保存されている正答 |

- **文字長・位置**: 正答38文字／全四択中央値35.5文字＝1.07倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeでCopilot ChatはモデルNへ変更しましたが、ghost textの提案モデルはMのままです。両方とも利用可能なモデルです。インライン提案はMを保ち、Chatのモデルだけを切り替えたい場合、どの操作が合いますか。
- **台帳が指定した変更後の正答**: Chatのmodel pickerから会話用モデルを選ぶ

### q-d4-e09-feature-20261016

- **本文**: 長いCopilot会話がcompactされた後、以前に参照したAPIの細かい定義が要約にありません。会話の大きな方針は正しく残っています。今は同じタスクを続け、特定APIの定義だけを正確に確認したい場合、どの対処が最も直接的ですか。
- **判定**: 詳細を失ったら元資料を再取得する、という一般のLLM会話の対処で解ける。compact固有の操作・参照状態との照合がない。
- **機能知識の必要性**: FEATURE_RELATED_BUT_GENERAL_REASONING
- **選択肢単体**: GUESSING_CUE_RISK — 詳細を失ったら元資料を再取得する、という一般のLLM会話の対処で解ける。compact固有の操作・参照状態との照合がない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 必要な元資料を明示して再取得し、同じ会話を続ける | 保存されている正答 |
| B | 同じ会話を再びcompactして要約する | 誤答 |
| C | 新しい会話を始め、過去の方針を引き継がない | 誤答 |
| D | モデルを変え、現在の会話と添付を維持する | 誤答 |

- **文字長・位置**: 正答24文字／全四択中央値20.5文字＝1.17倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: 長いCopilot会話がcompactされた後、以前に参照したAPIの細かい定義が要約にありません。会話の大きな方針は正しく残っています。今は別タスクへ移り、これまでの方針と資料を引き継がず新しく始めたい場合、どの対処が最も直接的ですか。
- **台帳が指定した変更後の正答**: 新しい会話を始め、過去の方針を引き継がない

### q-d3-e04

- **本文**: 機密ファイルに対するコンテンツ除外ポリシー（Content Exclusion）の保護範囲を検証しました。同じ機密パスにContent Exclusionを設定しました。通常補完では除外表示が出て提案が止まりますが、IDEのAgentではファイル読取ツールが成功します。パス一致と反映は確認済みで、この環境のAgentは除外非対応です。この観測を踏まえ、機密漏洩を防ぐ最小の境界対策として最も適切なものはどれですか？
- **判定**: Agentは除外非対応という根拠を本文が明示し、正答だけが機密へのアクセス境界を守る。未知の対応範囲を診断する課題になっていない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — Agentは除外非対応という根拠を本文が明示し、正答だけが機密へのアクセス境界を守る。未知の対応範囲を診断する課題になっていない。
- **難度**: 境界・要強化

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 通常補完の対象外タブを閉じ、入力文脈を縮小する | 誤答 |
| B | 補完除外を保ち、Agentから機密へのアクセスを分離する | 保存されている正答 |
| C | 実際の対象に一致する除外パスを登録し、表示を再確認する | 誤答 |
| D | セッションを再読込し、除外の設定反映を再確認する | 誤答 |

- **文字長・位置**: 正答28文字／全四択中央値25.5文字＝1.10倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: 機密ファイルに対するコンテンツ除外ポリシー（Content Exclusion）の保護範囲を検証しました。別の機密パスにだけContent Exclusionを設定しました。そのパスでは除外表示が出ますが、今回の通常補完は未登録のパスを取得しています。使用モードは対応しており、設定に今回の実パスがありません。この観測を踏まえ、機密漏洩を防ぐ最小の境界対策として最も適切なものはどれですか？
- **台帳が指定した変更後の正答**: 実際の対象に一致する除外パスを登録し、表示を再確認する

### q-sc01-2

- **本文**: 【AnyCompany Tech事例】secret.keyの機密解除は承認済みです。リポジトリ側の個別除外ルールを削除しましたが、通常補完ではまだ除外されています。除外一覧には、同じファイルに一致する組織側の**/*.keyが残っています。次にどの設定元を見直すべきですか。
- **判定**: 一致するOrganizationルールが残ると本文が示し、同じルールを正答として選ぶ。削除済みルール・Git追跡・公開一致が弱い誤答。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 一致するOrganizationルールが残ると本文が示し、同じルールを正答として選ぶ。削除済みルール・Git追跡・公開一致が弱い誤答。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 削除済みRepositoryルールの反映だけ | 誤答 |
| B | 公開コード一致のAllow／Block | 誤答 |
| C | Organizationの**/*.keyの対象範囲 | 保存されている正答 |
| D | secret.keyのGit追跡状態 | 誤答 |

- **文字長・位置**: 正答26文字／全四択中央値20.5文字＝1.27倍。保存時表示位置C。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-sc02-2-feature-20261016

- **本文**: GitHub.comでCopilot cloud agentへ、リポジトリAのAPI変更とリポジトリBの呼出側変更を一度に依頼しました。Bのコードを読むMCPアクセスは設定済みですが、変更先はAとしてセッションを開始しています。両repoに別々のPRを作りたい場合、どの進め方が機能の範囲に合いますか。
- **判定**: repoごとのtask/PRという実仕様の題材。ただし三案がAのtaskを維持し、一案だけA/Bを分けるため形で推測しやすい。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — repoごとのtask/PRという実仕様の題材。ただし三案がAのtaskを維持し、一案だけA/Bを分けるため形で推測しやすい。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Aのタスクのまま、BのMCP読取権限だけを広げる | 誤答 |
| B | Aのタスクのまま、BをCopilot Spaceへ追加する | 誤答 |
| C | Aのタスクのまま、モデルだけ変更して二つのPRを依頼する | 誤答 |
| D | AとBをそれぞれ変更先にした別タスクとして依頼する | 保存されている正答 |

- **文字長・位置**: 正答25文字／全四択中央値26.5文字＝0.94倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: GitHub.comでCopilot cloud agentへ、リポジトリAのAPI変更とリポジトリBの呼出側変更を一度に依頼しました。Bのコードを読むMCPアクセスは設定済みですが、変更先はAとしてセッションを開始しています。Bの追加資料がまだ読めないので、Aだけを変えたPRを作るためBの読取アクセスを追加したい場合、どの進め方が機能の範囲に合いますか。
- **台帳が指定した変更後の正答**: Aのタスクのまま、BのMCP読取権限だけを広げる

### q-d1-a19-feature-20261016

- **本文**: VS CodeのCopilotで一つのMCPサーバーがsearchとupdateを提供しています。接続は正常で、searchは使い続けます。updateは承認を待たせるのではなく、今回のChatでAgentが選ぶ候補から外したい場合、どの操作が合いますか。
- **判定**: ツールを候補から外すことと実行承認を要求することを分ける。必要なsearchを保つ制約もあるが、応用の入口。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | updateの自動承認を外し、毎回の確認を必要にする | 誤答 |
| B | MCPサーバー全体を停止し、接続を無効にする | 誤答 |
| C | MCPサーバーを再起動し、同じツール構成を読み直す | 誤答 |
| D | Chatのツール選択でupdateを無効にし、searchは有効にする | 保存されている正答 |

- **文字長・位置**: 正答35文字／全四択中央値25.5文字＝1.37倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotで一つのMCPサーバーがsearchとupdateを提供しています。接続は正常で、searchは使い続けます。updateは候補には残し、呼び出すたびに入力を承認したい場合、どの操作が合いますか。
- **台帳が指定した変更後の正答**: updateの自動承認を外し、毎回の確認を必要にする

### q-d1-a16-feature-20261016

- **本文**: VS CodeのCopilotでsandboxを有効にしています。ターミナル操作を承認した後、作業に必要な外部ディレクトリへのアクセスがsandbox境界で拒否されました。sandboxは維持し、必要なディレクトリだけを操作対象に加えたい場合、どの設定を見直しますか。
- **判定**: sandboxで必要なディレクトリを許可したいので許可先を追加する、という要望の直訳。実在の設定範囲の比較が薄い。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 必要なディレクトリをsandboxの許可先へ追加する | 保存されている正答 |
| B | Allow allへ切り替え、ツールの確認を省略する | 誤答 |
| C | URLの応答の自動承認を有効にする | 誤答 |
| D | MCPのツール一覧へ読取ツールを追加する | 誤答 |

- **文字長・位置**: 正答26文字／全四択中央値23文字＝1.13倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotでsandboxを有効にしています。sandboxで許可された範囲内の操作ですが、ツールの実行確認だけが毎回出ます。今回のセッションでは全ツールの確認を省きたい場合、どの設定を見直しますか。
- **台帳が指定した変更後の正答**: Allow allへ切り替え、ツールの確認を省略する

### q-d3-e02-feature-20261016

- **本文**: Copilot Businessを使う二つの環境で、VS CodeからGitLabの作業repoを意味索引化しようとしています。一方はGitHub.com、もう一方はGHE.comに接続します。クライアントは対応版で、Semantic indexing for non-GitHub repositoriesの組織ポリシーはUnconfiguredです。GitHub.com側で必要な管理操作と、GHE.com側の対応可否について、正しい組合せはどれですか。
- **判定**: GitHub.com/GHE.comの対応差とUnconfigured時の管理許可を照合する。二つの独立した製品条件が必要。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | GitHub.com側は追加のポリシー変更が不要で、GHE.com側はこの機能の対象外となる | 誤答 |
| B | GitHub.com側はポリシーの有効化が必要で、GHE.com側はこの機能の対象外となる | 保存されている正答 |
| C | GitHub.com側はポリシーの有効化が必要で、GHE.com側も同じ変更で利用できる | 誤答 |
| D | GitHub.com側は追加のポリシー変更が不要で、GHE.com側も変更なしで利用できる | 誤答 |

- **文字長・位置**: 正答45文字／全四択中央値45文字＝1.00倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot Businessを使う二つの環境で、VS CodeからGitLabの作業repoを意味索引化しようとしています。一方はGitHub.com、もう一方はGHE.comに接続します。クライアントは対応版で、Semantic indexing for non-GitHub repositoriesの組織ポリシーはEnabledです。GitHub.com側で必要な管理操作と、GHE.com側の対応可否について、正しい組合せはどれですか。
- **台帳が指定した変更後の正答**: GitHub.com側は追加のポリシー変更が不要で、GHE.com側はこの機能の対象外となる

### q-d2-a26-feature-20261016

- **本文**: VS CodeでCopilotがMCPの更新ツールを呼び出そうとしています。今回は入力値を確認できたため実行を認めますが、次回の同じツールの呼出しでも入力を確認したいと考えています。ほかの既存承認は変えません。今回選ぶ承認範囲はどれですか。
- **判定**: 今回だけ許可したい→今回だけ許可という直接照合。承認の機能は関連するが応用としては軽い。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 現在のセッション中は許可し、同じツールを自動承認する | 誤答 |
| B | 今回の一回だけ許可し、ツールの自動承認は保存しない | 保存されている正答 |
| C | 現在のワークスペースでは許可し、同じツールを自動承認する | 誤答 |
| D | Reset Tool Confirmationsで、保存済みの承認をすべて消す | 誤答 |

- **文字長・位置**: 正答25文字／全四択中央値27文字＝0.93倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeでCopilotがMCPの更新ツールを呼び出そうとしています。今回は入力値を確認できたため実行を認めますが、現在のセッション中は同じツールの入力確認を省略したいと考えています。ほかの既存承認は変えません。今回選ぶ承認範囲はどれですか。
- **台帳が指定した変更後の正答**: 現在のセッション中は許可し、同じツールを自動承認する

### q-d6-e04-feature-20261016

- **本文**: 同じEnterpriseのrepoを、組織AとBからCopilot Seatを受ける利用者が編集します。repo管理者が設定するrepo内除外と、組織Aオーナーが設定する管理Seat向け除外を比較します。どちらも対応する通常補完を使います。AのSeat利用者だけでなく、同Enterpriseの対象repoを使う利用者へ当該repoだけに適用したい場合、最も直接的な設定元はどれですか。
- **判定**: repo利用者と管理Seat対象の範囲を交差して判断する。一方、全ての無関係repoを除外する誤答は弱く、残すなら近接スコープへ変えたい。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: DISTRACTOR_CAUTION — 全ての無関係repoを含める案が過剰。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 組織Aが、AからSeatを受ける利用者だけへ除外を設定する | 誤答 |
| B | repo管理者が、そのrepoだけのContent Exclusionを設定する | 保存されている正答 |
| C | 組織Bが、BからSeatを受ける利用者だけへ除外を設定する | 誤答 |
| D | Enterpriseが、無関係なrepoも含めすべてを除外する | 誤答 |

- **文字長・位置**: 正答40文字／全四択中央値30文字＝1.33倍。保存時表示位置B。
- **反実仮想**: MULTI_CHANGE_REPLAY — 問題文の大部分や複数の状態を置き換えた別ケース。単一条件を変える反実仮想としての証拠は弱い。
- **台帳の変更後本文**: 同じEnterpriseの複数repoに、組織AからSeatを受ける利用者だけのContent Exclusionを適用します。BのSeat利用者と無関係なrepoへは適用を増やしません。最も範囲に合う設定元はどれですか。
- **台帳が指定した変更後の正答**: 組織Aが、AからSeatを受ける利用者だけへ除外を設定する

### q-d1-a07-feature-20261016

- **本文**: Copilot cloud agentの作業中、社内の仕様サイトへの取得がfirewallで拒否されたとセッションログに出ています。許可済みの他サイトは取得でき、ローカルIDEから仕様サイトへは到達できます。管理者はこの仕様サイトだけを追加で許可したいと考えています。どこを変更しますか。
- **判定**: cloudとlocal proxy、firewall全停止とドメイン許可の区別は必要。ただし正答だけが限定許可で、安全さも手掛かりになる。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: DISTRACTOR_CAUTION — 正答だけが全停止でなく限定的な許可。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | ローカルIDEのCopilot用プロキシで、対象ドメインを許可する | 誤答 |
| B | MCPクライアントのツール一覧で、検索ツールを追加する | 誤答 |
| C | CopilotのInternet accessで、firewall自体を無効にする | 誤答 |
| D | リポジトリのCopilotのInternet accessで、対象ドメインを許可する | 保存されている正答 |

- **文字長・位置**: 正答42文字／全四択中央値37文字＝1.14倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: ローカルIDEのCopilotで社内プロキシを使った作業中、社内の仕様サイトへの取得がfirewallで拒否されたとセッションログに出ています。許可済みの他サイトは取得でき、ローカルIDEから仕様サイトへは到達できます。管理者はこの仕様サイトだけを追加で許可したいと考えています。どこを変更しますか。
- **台帳が指定した変更後の正答**: ローカルIDEのCopilot用プロキシで、対象ドメインを許可する

### q-d4-a01-feature-20261016

- **本文**: VS CodeのLocal harnessで、現在のmodel pickerは利用可能なモデルMを選択しています。使うPrompt Fileにはmodel指定がありません。このプロンプトだけは別の利用可能なモデルNで実行し、通常の選択Mは維持したい場合、必要な設定だけを変える案はどれですか。
- **判定**: Prompt Fileのmodelとpickerの二つの優先関係・変更範囲を比較する。四択は同じ設定の組合せで、応用として成立する。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | model pickerをNへ変え、Prompt Fileのmodelは省略する | 誤答 |
| B | Prompt Fileにmodel: Mを指定し、model pickerだけNへ変える | 誤答 |
| C | Prompt Fileにmodel: Nを指定し、model pickerのMは維持する | 保存されている正答 |
| D | Prompt Fileにmodel: Nを指定し、model pickerもNへ変える | 誤答 |

- **文字長・位置**: 正答44文字／全四択中央値43.5文字＝1.01倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのLocal harnessで、現在のmodel pickerは利用可能なモデルMを選択しています。使うPrompt Fileにはmodel指定がありません。このプロンプトを含む現在のChat全体を利用可能なモデルNで進めたい場合、必要な設定だけを変える案はどれですか。
- **台帳が指定した変更後の正答**: model pickerをNへ変え、Prompt Fileのmodelは省略する

### q-d4-a02-feature-20261016

- **本文**: VS CodeのCopilotで、Askでは開いているファイルが文脈に使われました。Agentへ移った後も同じファイルが必ず入力されると考えていましたが、Agentでは添付候補として示されています。今回その一ファイル全体を確実に指定するには、どの操作が合いますか。
- **判定**: Askの暗黙文脈とAgentの添付候補の差は題材になるが、実際に問う操作は「ファイル全体を明示添付」の識別。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 現在のファイル名だけを書いて送る | 誤答 |
| B | 対象のシンボルだけを明示添付して送る | 誤答 |
| C | 対象フォルダを文脈として添付して送る | 誤答 |
| D | 候補のファイルを明示添付して送る | 保存されている正答 |

- **文字長・位置**: 正答16文字／全四択中央値17文字＝0.94倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotで、開いているファイル全体ではなく、その中の特定関数だけを明示的に文脈へ添付して送ります。どの操作が合いますか。
- **台帳が指定した変更後の正答**: 対象のシンボルだけを明示添付して送る

### q-d2-a04-feature-20261016

- **本文**: GitHub Copilot CLIで、リポジトリAとBに同じMCPツールを登録しています。Aでツールを「このrepoでは次回から確認しない」と承認しました。別のURLは「今後も許可」と承認しました。Bで使うとMCPツールには再び確認が出ますが、そのURLには確認が出ません。この違いに合う保存先の組合せはどれですか。
- **判定**: ツール承認とURL承認の保存範囲を比較する実仕様。場所ごとの別ファイルではなく、一つのpermissions-config.json内で場所へスコープされる点は表現を明確にしたい。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 両方とも場所別permissions-config.jsonへ保存する | 誤答 |
| B | 両方ともsettings.jsonのallowedUrlsへ保存する | 誤答 |
| C | ツールは場所別permissions-config.json、URLはsettings.json | 保存されている正答 |
| D | ツールは起動オプションのみ、URLは現在のセッションのみ | 誤答 |

- **文字長・位置**: 正答48文字／全四択中央値34.5文字＝1.39倍。保存時表示位置C。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — URLの恒久承認を別の書込ツールへ変えたのに、そのURLには確認が出ないという観測が残る。二つとも場所別という結論を支えない。
- **台帳の変更後本文**: GitHub Copilot CLIで、リポジトリAとBに同じMCPツールを登録しています。Aでツールを「このrepoでは次回から確認しない」と承認しました。別の書込ツールも「このrepoでは次回から確認しない」と承認しました。Bで使うとMCPツールには再び確認が出ますが、そのURLには確認が出ません。この違いに合う保存先の組合せはどれですか。
- **台帳が指定した変更後の正答**: 両方とも場所別permissions-config.jsonへ保存する
- **仕様・日本語の留意点**: 場所別とは物理的にrepoごとにファイルがある意味ではないと明確にする。

### q-sc03-2-feature-20261016

- **本文**: VS CodeのCopilotでAskを使い、関連ファイルと修正案を得ました。次は同じローカル環境でファイルを編集し、実際のコマンド結果を使って修正を繰り返したいと考えています。現在はターミナルツールが無効です。必要な切替と設定の組合せはどれですか。
- **判定**: AskからAgentへ移り、必要な実行ツールを有効にするという基本的な使い分け。現在の応用より難しいとは評価できない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Agentへ切り替え、必要な編集・実行ツールを有効にする | 保存されている正答 |
| B | Askを維持し、案をコードブロックで受け取る | 誤答 |
| C | Agentへ切り替え、ターミナルツールは無効のままにする | 誤答 |
| D | Planで実装計画を作り、編集・実行は自分で行う | 誤答 |

- **文字長・位置**: 正答28文字／全四択中央値26文字＝1.08倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotでAskを使い、関連ファイルと修正案を得ました。次は同じローカル環境でファイルを編集し、案をコードブロックで受け取り、編集と実行は自分だけで行いたいと考えています。現在はターミナルツールが無効です。必要な切替と設定の組合せはどれですか。
- **台帳が指定した変更後の正答**: Askを維持し、案をコードブロックで受け取る

### q-d2-a25

- **本文**: Copilot CLIの今回のセッションでは、シェルを使ったGitの調査やコミットは必要ですが、git pushは実行させません。ほかのセッションの設定や、場所ごとの保存済み承認は変えない方針です。ツールをモデルへ提供する範囲と実行権限を区別し、この条件へ合わせる操作はどれですか。
- **判定**: ツール提供・実行拒否・保存範囲を区別し、必要なGit操作を残す。具体的な制約のある応用として成立する。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 今回のセッションでGit操作を許可し、git pushには拒否の実行権限を指定する | 保存されている正答 |
| B | 今回のセッションでシェルをツール候補から外し、モデルへ提供しないようにする | 誤答 |
| C | 現在の場所に保存した承認をリセットし、各操作を実行する際の確認へ戻す | 誤答 |
| D | 追加ディレクトリのアクセス許可を見直し、CLIへ提供するパスの範囲を限定する | 誤答 |

- **文字長・位置**: 正答41文字／全四択中央値37.5文字＝1.09倍。保存時表示位置A。
- **反実仮想**: LEGACY_NOTE_ONLY — 別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。

### q-d2-a18-feature-20261016

- **本文**: Copilot CLIの作業ディレクトリへMCP設定とAgentプロファイルを追加しました。ファイルはありますが、今回のセッションが実際に読み込んだ構成をまとめて確認したいと考えています。ログのエラー解析やモデルの変更はまだ行いません。どのコマンドが合いますか。
- **判定**: loaded configurationを確認する/envというコマンド名の想起。他の作業を本文で除外し、応用の判断材料が少ない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | /envで読み込まれた構成を一覧表示する | 保存されている正答 |
| B | /diagnoseで現在のセッションログの問題を解析する | 誤答 |
| C | /modelで現在使うモデルを選択し直す | 誤答 |
| D | /usageでセッションの利用統計を確認する | 誤答 |

- **文字長・位置**: 正答20文字／全四択中央値21文字＝0.95倍。保存時表示位置A。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — ログ原因解析をしたいという変更と、ログのエラー解析はまだ行わないという制約が同居する。
- **台帳の変更後本文**: Copilot CLIの作業ディレクトリへMCP設定とAgentプロファイルを追加しました。ファイルはありますが、今回のセッションがログ中の予期しない挙動の原因を解析したいと考えています。ログのエラー解析やモデルの変更はまだ行いません。どのコマンドが合いますか。
- **台帳が指定した変更後の正答**: /diagnoseで現在のセッションログの問題を解析する

### q-sc02-3-feature-20261016

- **本文**: VS CodeのCopilotで、Agent Customizationsには指示ファイルが表示されています。しかし、今回の回答に使われたかはまだ確認していません。ファイルの発見と回答への適用を分けて確認したい場合、次にどの表示を調べますか。
- **判定**: 発見と使用の区別はよいが、正答だけが適用の直接証拠。誤答は存在だけ・モデルだけ・承認履歴を適用とみなす、という明らかな不足。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 発見と使用の区別はよいが、正答だけが適用の直接証拠。誤答は存在だけ・モデルだけ・承認履歴を適用とみなす、という明らかな不足。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Customizationsの一覧をもう一度開き、存在だけを確認する | 誤答 |
| B | 回答のReferencesを開き、対象の指示ファイルが含まれるか確認する | 保存されている正答 |
| C | model pickerを開き、同じモデルかだけを確認する | 誤答 |
| D | ツールの承認履歴を開き、指示ファイルの適用とみなす | 誤答 |

- **文字長・位置**: 正答36文字／全四択中央値31.5文字＝1.14倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: VS CodeのCopilotで、Agent Customizationsには指示ファイルが表示されています。しかし、今回の使用はReferencesで確認済みですが、ファイルが検出される場所だけを調べたい。ファイルの発見と回答への適用を分けて確認したい場合、次にどの表示を調べますか。
- **台帳が指定した変更後の正答**: Customizationsの一覧をもう一度開き、存在だけを確認する

### q-d1-e01-feature-20261016

- **本文**: Copilot cloud agentへ依頼したAが、生成されたPRの確認を担当しています。既定の設定でワークフローが承認待ちです。AもBも書込権限を持ち、Bはタスクの依頼者ではありません。このPRには人による必須承認も必要です。変更内容の確認後、ワークフロー実行と必須レビューを進める担当の組合せはどれですか。Aが行える承認はAが担当する方針です。
- **判定**: 依頼者のワークフロー承認と、人の必須レビューの担当可否を分ける。A優先の運用条件もあり、二つの承認を一括判断できない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Aが実行と人のレビューの両方を承認する | 誤答 |
| B | Aが実行を承認し、Bが人のレビューを承認する | 保存されている正答 |
| C | Bが実行を承認し、Aが人のレビューを承認する | 誤答 |
| D | Bが実行と人のレビューの両方を承認する | 誤答 |

- **文字長・位置**: 正答22文字／全四択中央値20.5文字＝1.07倍。保存時表示位置B。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: 別の担当者CがCopilot cloud agentへ依頼し、依頼者ではないAが、生成されたPRの確認を担当しています。既定の設定でワークフローが承認待ちです。AもBも書込権限を持ち、Bはタスクの依頼者ではありません。このPRには人による必須承認も必要です。変更内容の確認後、ワークフロー実行と必須レビューを進める担当の組合せはどれですか。Aが行える承認はAが担当する方針です。
- **台帳が指定した変更後の正答**: Aが実行と人のレビューの両方を承認する

### q-d4-e05-feature-20261016

- **本文**: Copilotで調査をSubagentへ分け、主会話の文脈量は減りました。しかしSubagentと主Agentは同じ作業ディレクトリを使い、同じファイルを変更し得ます。今回、調査の中間文脈だけでなく変更ファイルも分離したい場合、どの構成が合いますか。
- **判定**: 文脈とファイルの分離は実在の境界。ただしクライアント・Subagentを別worktreeへ割り当てる実行方法が不明で、本番相当維持は条件付き。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 境界・要強化

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 調査をSubagentへ委任し、別worktreeで作業する | 保存されている正答 |
| B | 調査をSubagentへ委任し、同じディレクトリで作業する | 誤答 |
| C | 一つの主会話に調査を残し、別worktreeで作業する | 誤答 |
| D | 一つの主会話に調査を残し、同じディレクトリで作業する | 誤答 |

- **文字長・位置**: 正答30文字／全四択中央値28文字＝1.07倍。保存時表示位置A。
- **反実仮想**: SEMANTIC_REVIEW_FAILURE — ファイル分離は不要としただけでは、別worktreeを使う案を禁止していない。文脈だけ分離する案と両方分離する案の一意性がない。
- **台帳の変更後本文**: Copilotで調査をSubagentへ分け、主会話の文脈量は減りました。しかしSubagentと主Agentは同じ作業ディレクトリを使い、同じファイルを変更し得ます。今回、調査は読取だけでファイルの分離は不要、主会話の文脈量だけを減らしたい場合、どの構成が合いますか。
- **台帳が指定した変更後の正答**: 調査をSubagentへ委任し、同じディレクトリで作業する
- **仕様・日本語の留意点**: VS Code等のクライアントと、別worktreeを使う具体的な実行単位を指定する。

### q-d1-e04-feature-20261016

- **本文**: Copilot Businessを運用する同一Enterprise内に組織AとBがあります。担当者はAのOrganization ownerですが、Bのrepo-RではMaintainロールです。Aで配布するSeat向けのContent Exclusionと、Bのrepo-R内のContent Exclusionをそれぞれ変更したいと考えています。追加の権限を得る前の、この担当者による設定変更の可否はどれですか。
- **判定**: 別組織ownerと対象repo Maintainを混同せず、二つのContent Exclusionの編集権限を判定する。応用の比較基準として適切。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 概ね適合

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Aの組織側は変更でき、Bのrepo側は閲覧できるが変更できない | 保存されている正答 |
| B | Aの組織側も、Bのrepo側も設定を変更できる | 誤答 |
| C | Aの組織側も、Bのrepo側も設定は閲覧のみで変更できない | 誤答 |
| D | Bのrepo側は変更でき、Aの組織側は閲覧できるが変更できない | 誤答 |

- **文字長・位置**: 正答31文字／全四択中央値30文字＝1.03倍。保存時表示位置A。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot Businessを運用する同一Enterprise内に組織AとBがあります。担当者はAのOrganization ownerですが、Bのrepo-RではAdminロールです。Aで配布するSeat向けのContent Exclusionと、Bのrepo-R内のContent Exclusionをそれぞれ変更したいと考えています。追加の権限を得る前の、この担当者による設定変更の可否はどれですか。
- **台帳が指定した変更後の正答**: Aの組織側も、Bのrepo側も設定を変更できる

### q-sc02-1-feature-20261016

- **本文**: Copilot code reviewの指摘からFix with Copilotを起動します。元PRのbranchへすぐコミットするのではなく、元branchを宛先にする別PRで修正を確認したい方針です。cloud agentも利用可能です。修正依頼の下書きで選ぶ成果物はどれですか。
- **判定**: 元branch宛の別PRという成果物が本文と正答で同じ語になっている。ボタン選択の応用の入口で、本番相当の推論はない。
- **機能知識の必要性**: DECISIVE_RULE_OR_RESULT_GIVEN
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | 同じPRへ修正コミットを追加する選択をする | 誤答 |
| B | 単一suggestionだけを受け入れて元PRへコミットする | 誤答 |
| C | 再レビューだけを依頼し、修正の成果物は作らない | 誤答 |
| D | 現在のbranchを宛先にする新しいPRを選ぶ | 保存されている正答 |

- **文字長・位置**: 正答23文字／全四択中央値23文字＝1.00倍。保存時表示位置D。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot code reviewの指摘からFix with Copilotを起動します。元PRのbranchへ直接修正コミットを追加したい方針です。cloud agentも利用可能です。修正依頼の下書きで選ぶ成果物はどれですか。
- **台帳が指定した変更後の正答**: 同じPRへ修正コミットを追加する選択をする

### q-d1-a18-feature-20261016

- **本文**: Copilot code reviewがPRを一度レビューした後、新しいコミットをpushしました。自動レビューのReview new pushesは無効です。今回だけ新しい差分のレビューを依頼し、以後の自動実行設定は変えない場合、どの操作が合いますか。
- **判定**: 一回の再レビューと追加push自動化を区別する実操作。目的に沿う近接操作の比較として応用の入口。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: NO_SPECIFIC_CUE_FOUND — 本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。
- **難度**: 入口程度

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | Review new pushesを有効にし、以後のpushも自動レビューする | 誤答 |
| B | PR summaryを再生成し、新しい差分の説明を更新する | 誤答 |
| C | PRでCopilotへ再レビューを依頼する | 保存されている正答 |
| D | 以後のCopilot code reviewの既定の深度をBalancedへ変更する | 誤答 |

- **文字長・位置**: 正答21文字／全四択中央値34文字＝0.62倍。保存時表示位置C。
- **反実仮想**: NO_SPECIFIC_FAILURE_FOUND — 今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。
- **台帳の変更後本文**: Copilot code reviewがPRを一度レビューした後、新しいコミットをpushしました。自動レビューのReview new pushesは無効です。今後も追加pushのたびに自動レビューを依頼する設定へ変える場合、どの操作が合いますか。
- **台帳が指定した変更後の正答**: Review new pushesを有効にし、以後のpushも自動レビューする

### q-d6-e01

- **本文**: 機密リポジトリに対するContent Exclusionの適用をテストしました。同一ファイルに対し、通常補完①は再読込済みで除外表示が出ます。②は別workspaceのシンボリックリンク経由で読取あり、③はこの環境で除外非対応のIDE Agentで読取あり。設定の実パス一致と反映は確認済みです。②および③の漏洩リスクが、Content Exclusionの追加パス登録だけでは解決しない根本的な理由として最も適切なものはどれですか？
- **判定**: 正答だけが二つの限界を分け、他三案は同じ原因だと一括する。さらにAgent非対応は本文で示され、二つの高度な診断にはなっていない。
- **機能知識の必要性**: FEATURE_KNOWLEDGE_RELEVANT
- **選択肢単体**: GUESSING_CUE_RISK — 正答だけが二つの限界を分け、他三案は同じ原因だと一括する。さらにAgent非対応は本文で示され、二つの高度な診断にはなっていない。
- **難度**: 現ラベルより軽い

| 位置 | 選択肢 | 判定 |
| --- | --- | --- |
| A | ②はリンク経由、③は非対応モードという別の限界 | 保存されている正答 |
| B | ②③とも公開コード一致の出力検出という同じ現象 | 誤答 |
| C | ②③とも旧セッションの伝播待ちという同じ遅れ | 誤答 |
| D | ②③とも実パスの登録漏れという同じ設定不足 | 誤答 |

- **文字長・位置**: 正答23文字／全四択中央値22.5文字＝1.02倍。保存時表示位置A。
- **反実仮想**: LANGUAGE_OR_SCOPE_REWRITE — 文末が「除外表示が出たです」となっている。
- **台帳の変更後本文**: 機密リポジトリに対するContent Exclusionの適用をテストしました。同一ファイルに対し、通常補完①は再読込済みで除外表示が出ます。②③は対応する通常補完で実ファイルを参照し、設定更新直後の旧セッションでは読取あり、再読込後は両方に除外表示が出たです。②および③の漏洩リスクが、Content Exclusionの追加パス登録だけでは解決しない根本的な理由として最も適切なものはどれですか？
- **台帳が指定した変更後の正答**: ②③とも旧セッションの伝播待ちという同じ遅れ
