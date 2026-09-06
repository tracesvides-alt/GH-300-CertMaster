const fs=require('fs');let p=fs.readFileSync('README.md','utf8');
p=p.replace('- Practice: Random / Domain / Objective / Weak Points / Incorrect Questions / Bookmarked Questions。','- Practice: 5 / 10 / 20 / 30 / 50問。Random / Syllabus Weighted / Weak Points。Domain・Objective・誤答・ブックマークは追加フィルター。終了結果とQuick Retry、設定の復元。');
p=p.replace('- Mock: デフォルト50問、1〜200問を設定。整数レンジ配分、時間制限、途中保存・再開、結果履歴、Domain・Objective別正答率、誤答と推奨教材。','- Mock: デフォルト50問、5 / 10 / 20 / 30 / 50問を設定。Syllabus Weighted、Verifiedのみ。時間制限、途中保存・再開、終了時採点、結果履歴。問題不足時は実施数・配分を明示して継続。');
p=p.replace('  globals.css             ダークUI、レスポンシブスタイル','  globals.css             ダークUI、レスポンシブスタイル\n  components/practice-setup.tsx   出題設定と問題数選択\n  components/practice-result.tsx  セッション結果とQuick Retry');
p=p.replace('  learning.ts             採点、Mastery、整数配分、弱点選択、streak','  learning.ts             採点、Readiness、streak\n  selection.ts            DB/UI非依存のQuestion Selection Engine\n  practice-session.ts     結果とObjective改善の集計');
p=p.replace('tests/core.test.ts        ロジック、schema、IndexedDB、AI','tests/core.test.ts        ロジック、schema、IndexedDB、AI\ntests/selection.test.ts   抽選・分布simulation・DB migration\ntests/e2e/practice.spec.ts 設定・結果・Quick Retry・Mock');
p=p.replace('schema version 1','schema version 2（既存v1データを保持して自動upgrade）');
p=p.replace('| sessions   | 模試の問題snapshot、回答map、現在位置、期限、完了状態                 |', '| sessions   | 模試の問題snapshot、回答map、現在位置、期限、完了状態                 |');
const marker='通常回答は保存成功後に解説を表示。';p=p.replace(marker,'`settings`に前回Practice設定、`practiceRuns`に開始時スコア・問題snapshot・セッション回答・終了時刻を保存します。完了済み結果はReviewから再表示できます。AIの包含設定はPracticeだけに適用し、Mockには引き継ぎません。\n\n'+marker);
const s=p.indexOf('弱点選択は、直近30分'),e=p.indexOf('## AI設定・環境変数',s);
p=p.slice(0,s)+`## Practice設定と結果

初回設定は10問、Random、未回答優先ON、最近の回答を避けるON、VerifiedのみON、AIを含めるOFFです。IndexedDBに前回設定を保存して復元します。二つのAI対象チェックボックスは連動し、矛盾する設定にはなりません。AIの出題重みはVerifiedより低く、画面に **AI Generated · 未検証** と表示します。

5・10問は隙間時間、20・30問は通常学習、50問は「本番想定」。50問が公式試験の固定問題数であるとは説明しません。Practiceは50問でも各問で採点・解説を表示し、Mockは最後まで正解を表示しません。

終了画面では正解数/実施数、正答率、Domain別結果、平滑化スコアが上昇したObjective、誤答Objective、推奨Lessonを表示します。「同じ条件でもう一度」「苦手分野を5問」「間違えた問題だけ復習」「Homeへ戻る」を用意しています。過去の結果の再表示では回答を再保存しません。

## Question Selection Engine

lib/selection.tsはUI・IndexedDBへの依存を持たず、Question Bank、回答履歴、オプション、現在時刻、注入可能な乱数関数を受け取ります。ProductionではMath.randomを乱数源として使いますが、抽選は均等ではなく下記の重みを使います。

- 未回答ボーナス: ONなら3倍。
- 直近回答ペナルティ: 24時間以内は0.08倍、7日以内は0.4倍、それ以外は1倍。OFFなら適用しません。
- 反復ペナルティ: 1 / sqrt(1 + 回答回数 × 0.15)。
- 問題status: Verifiedは1倍、AI Generatedは0.25倍。
- Objectiveの候補数で割り、収録数が多いObjectiveだけが選ばれないよう補正。
- セッション内で同じObjectiveを選ぶたびに、1 / (1 + 選択数)^0.75を乗じて偏りを抑制。

Randomは全eligible問題から重み付き・非復元抽選。未回答問題は優先しますが、確定枠ではありません。最近の回答は**完全除外しません**。在庫が少なくても0ではないweightによって選択可能で、含まれた場合は画面に案内します。同一セッション内のQuestion IDは必ず一意です。

### Weak Points

Objective単位にattempts、correctCount、incorrectCount、recentAccuracy、lastAnsweredAt、masteryScore、confidenceを算出します。AI回答はこの判定に含めません。

平滑化スコア = 100 × [0.4 × (全正解数 + 2)/(全回答数 + 4) + 0.6 × (直近10回答の正解数 + 2)/(直近回答数 + 4)]。Beta(2,2)の事前分布を使い、サンプル1件の誤答でスコアを0にしません。confidenceはn/(n+4)です。

3回答以上ある候補Objectiveをスコアで並べ、最弱群へ約50%、次の群へ約30%、その他へ約20%の重みを割り当てます。同点は同じ群、3回答未満はその他扱い。群の候補不足や同点では比率は変動します。対象範囲に3回答以上のObjectiveが2つ未満なら、Randomへfallbackし理由を表示します。

この出題用スコアは、Homeの「収録問題をどれだけ理解できたか」を示すReadinessとは計算目的が異なります。結果画面では平滑化スコアの変化と明記します。

### Syllabus Weighted / Mock

5・10問は公式レンジ中間値を正規化したDomain重みによるWeighted Randomです。単一セッションの固定整数配分は課しません。極端な連続集中を抑えるため、Domain選択数がceil(N × Domain上限比率)+1に達した後はDomain重みを0.4倍にします。候補が十分にあるとき、多数回のセッション合計は公式weightに概ね近づきます。問題不足・フィルター適用時は収録状況に制約されます。

20・30・50問は、各Domainにceil(N × min/100)〜floor(N × max/100)の整数を割り当てます。下限から始めて残数を重み付きで割り当て、上限と在庫を超えません。許容範囲内で配分は変動します。レンジを満たせない場合は在庫制約を優先し、下限不足を補ってから上限を緩めます。Copilot Featuresの最大weightも反映します。

合計候補数が指定数以上なら**指定数と完全一致**します。合計候補自体が不足する場合は、重複させず候補数まで減らして開始し、指定数と実施数を表示します。AI OFF時にAIで穴埋めしません。フィルターに一致する問題が0件なら、条件の変更を案内します。

Mockはデフォルト50問、Syllabus Weighted、Verifiedのみ固定です。PracticeのAI設定とは独立。制限時間は実際に選ばれた問題数×90秒（アプリ独自）です。5問ミニ模試も1タップで開始できます。問題不足で減数したMockは公式レンジを満たしていると偽って表示しません。

### Question Bankの収録状況

**ProductionのVerified問題は現在12問です。約200問へのコンテンツ拡充は未完了です。** 今回追加した抽選テストの大規模fixtureは合成データであり、Production問題として収録していません。未検証の問題をVerifiedとして水増ししません。現在50問を選択すると、最大12問へ調整されます。

約200問は単一Bankで管理し、固定Mock A/B/Cには分割しません。追加時の分野別目安はResponsible AI 38、Features 58、Data 26、Prompt 26、Productivity 26、Privacy 26（合計200）です。これはコンテンツ整備目標であり、セッションの固定出題配分ではありません。各Objectiveを網羅し、公式出典・正解・全誤答理由を確認してから追加してください。

`+p.slice(e);
p=p.replace('**22件成功**（question schema、採点、Mastery、1〜200問の整数配分、弱点比率、重複回避、streak、IndexedDB再接続、AI検証）','**58件成功**（既存のschema・採点・Mastery・AI検証に加え、5/10/20/30/50問、重複回避、分布simulation、最近/未回答の抽選確率、弱点補正、不足fallback、AI除外、DB v1→v2、結果集計）');
p=p.replace('**8件成功**（主要演習導線と保存、模試不足表示・再開・結果、オフライン教材、横スクロールなし。各PC/モバイル）','**20件成功**（既存導線に加え、初期値・設定復元・AIスイッチ連動・5問結果・再演習・誤答復習・50問fallback・Mock終了前の非表示・キーボード。各PC/モバイル）');
p=p.replace('全Objectiveの十分な教材、50問以上の品質レビュー済み問題。','全Objectiveの十分な教材、約200問の品質レビュー済み問題（現在12問）。');
fs.writeFileSync('README.md',p);
