// Individually edited prose and review notes for the ten approved items.
export const edits = [
  {
    id:'q-d5-e08-feature-20261016-ms-20261017', findingId:'F01', invalidatePreviousSnapshots:true,
    question:'GitHub.comのCopilot code reviewで、組織のレビュー深度はBalanced、リポジトリの既定値はLiteです。PR Pは前回Balancedでレビューされました。Pの依頼者の設定はLiteで、今回の依頼時には深度を指定しません。PR Qも前回はBalancedで、Qの依頼者の設定もBalancedですが、今回はレビュー依頼時にLiteを明示指定します。この2回のレビューに適用される深度の説明として、正しいものを2つ選んでください。',
    choices:{A:'PR Pの今回のレビュー深度は、Liteになる',B:'PR Qの今回のレビュー深度は、Balancedになる',C:'PR Pの今回のレビュー深度は、Balancedになる',D:'PR Qの今回のレビュー深度は、Liteになる'},
    answer:['C','D'],
    clues:['Pは前回Balancedでレビューされました','今回はレビュー依頼時にLiteを明示指定します'],
    explanation:'Pは前回使ったBalanced、Qは今回明示指定したLiteを使う。依頼時の指定は前回値より、前回値は依頼者やrepoの既定値より優先する。',
    choiceExplanations:{A:'Pでは前回のBalancedがrepoのLiteより優先する。',B:'Qでは今回指定したLiteが前回のBalancedより優先する。',C:'Pは今回の指定がないため、前回のBalancedが選ばれる。',D:'Qは今回の依頼時にLiteを指定しており、その指定が優先する。'},
    displayedExplanation:'レビュー深度は、今回の依頼時の明示指定、同じPRで前回使った値、依頼者の設定、リポジトリの設定、組織などの設定という順で評価し、最初に当てはまる値を使います。前回の値があっても、今回の依頼時に別の値を指定すれば、その指定が優先します。\n\nPには今回の明示指定がなく、前回のBalancedがあります。そのため、依頼者とリポジトリがLiteでもBalancedになります。Qでは今回Liteを明示しているので、前回と依頼者のBalancedよりLiteが優先します。二つのPRについて、値の名前だけでなく、いつ・どこで設定した値かを照合することが要点です。',
    requirements:['Pの依頼時には指定せず、前回Balanced・依頼者Lite・repo Liteがある','Qの依頼時にはLiteを明示し、前回と依頼者はBalancedである'],
    review:{blindCheck:'選択肢はP/Qそれぞれの結果だけを同じ書式で記載し、設定元や優先する理由をヒントとして書かない。LiteとBalancedは正答・誤答に一つずつあり、本文のPRごとの条件を読まないと正しい二つを選べない。',reasoningSteps:['PRごとに今回の指定、前回値、依頼者設定、repo設定を分ける','今回の指定→前回値→依頼者→repoという順に照合する','PはBalanced、QはLiteと結論づける'],counterfactuals:[{condition:'Pも今回Liteを明示指定する',newCorrectIds:['A','D'],reason:'Pでも今回の指定が前回値に優先する。'},{condition:'Qの今回の明示指定を省く',newCorrectIds:['B','C'],reason:'Qは前回のBalancedを使う。'}],difficulty:'高難度を維持。二つのPRで優先する設定元が異なるため、設定の抽出と優先規則の適用が必要。単なる深度名の暗記にはしない。',distractors:{A:'repoが具体的に設定済みなら前回値より優先すると誤解すると選ぶ。',B:'前回値は次の明示指定でも変えられないと誤解すると選ぶ。'}},
  },
  {
    id:'q-d3-g14',findingId:'F02',additionalSourceIds:['feature-refresh-ide'],
    choiceExplanations:{A:'候補と周辺コードを公開コードと照合する。約150文字は周辺コードの説明で、一致の最低文字数ではない。',B:'有害な出力内容を検出・抑制する仕組みであり、この問いの対象に当たる。',C:'対応機能の入力文脈から指定パスを除外する設定で、有害な出力内容を判定するものではない。',D:'コードに含まれる資格情報を検出する機能で、有害な生成出力全般の評価とは異なる。'},
    review:{blindCheck:'選択肢本文と正解は変更せず、公開コード一致の誤った数値説明を訂正。四つの安全機構のどの役割を尋ねているかは本文が必要。',difficulty:'既存の基礎の役割識別を維持。'},
  },
  {
    id:'q-d2-g15',findingId:'F05',additionalSourceIds:['prompt-files'],
    explanation:'パス別指示は.github/instructions/NAME.instructions.mdに記述し、applyToで対象パスを指定する。',
    choiceExplanations:{A:'NAME.instructions.mdとapplyToで、指示を適用するファイルの範囲を指定する。',B:'ブランチ等のルールを強制する設定で、Copilotへのパス別の指示ではない。',C:'必要時に呼び出すタスク用の依頼文で、パスに応じた常時指示とは異なる。',D:'エディタの拡張やUI設定を切り替える構成で、パス別のCopilot指示ではない。'},
    displayedExplanation:'パス別のカスタム指示は、特定のディレクトリやファイル種別にだけ規約を伝えるためのものです。.github/instructions/NAME.instructions.mdという名前のファイルを用意し、先頭のfrontmatterにapplyToで対象のパスを記載します。\n\nたとえばapplyTo: "**/*.ts"ならTypeScriptファイルが対象です。リポジトリ全体の共通規約へすべての言語のルールを書く代わりに、必要な範囲へ分けられます。任意の名前の.mdを置くだけでは、この指示ファイルの命名要件を満たしません。',
    review:{blindCheck:'選択肢本文を維持し、適用範囲を尋ねる基礎問題として確認。ファイル名の仕様を解説で具体化した。',difficulty:'設定手法の識別を維持し、複合的な設定の計算問題へは変えていない。'},
  },
  {
    id:'q-d3-g04',findingId:'F06',additionalSourceIds:['alignment-telemetry'],
    question:'Copilotの利用状況を確認するため、提案の採用・却下イベントや応答の遅延、エラーの発生件数を集計しています。こうした利用・動作の情報を表す分類として、最も適切なものはどれですか？',
    explanation:'採用イベントや応答の遅延など、利用・動作を把握する情報はTelemetryに当たる。収集内容は機能や設定によって異なる。',
    choiceExplanations:{A:'回答生成に渡す指示文や関連コード等の文脈であり、今回の利用・動作の集計ではない。',B:'管理操作の主体や日時を追跡する記録で、今回の補完イベントや遅延の集計とは目的が異なる。',C:'モデルの学習に使うデータであり、今回の利用・動作の集計ではない。',D:'採用イベントや遅延など、利用状況や稼働状態を把握する情報に当たる。'},
    displayedExplanation:'Telemetryは、サービスやクライアントの利用状況・動作を観測する情報です。今回は採用・却下イベント、応答の遅延、エラー件数を集計しているため、この分類になります。回答のために渡す指示文やコード、管理者の操作を追跡する監査イベントとは、収集の目的が異なります。\n\nTelemetryという名前だけで、コードや機密情報が含まれないと判断してはいけません。たとえば現行のOpenTelemetry監視では、管理者が内容収集を有効にするとプロンプトやツール結果等を含められます。今回の統計の識別と、個々の収集設定の確認は別の判断です。',
    review:{blindCheck:'選択肢の四分類はいずれも実在するデータ区分。採用・遅延・件数という本文の収集対象から分類する。',difficulty:'基本的なデータ区分の理解を維持。高度な監視設定の値を正解選択へ要求しない。'},
  },
  {
    id:'q-d3-g09',findingId:'F07',additionalSourceIds:['feature-refresh-context-model','alignment-cutoff'],
    question:'Copilot Chatへ大量のコードや会話履歴を渡すとき、LLMが1回の要求で扱える情報量には上限があります。この上限をトークン数で表す文脈の枠を何と呼びますか？',
    explanation:'Context Windowは、モデルが1回の要求で扱える文脈量の上限を表す。要約や省略などの対処方法とは区別する。',
    choiceExplanations:{A:'一度に扱える文脈量の上限を表す。超過への対処はクライアント等によって異なる。',B:'学習済み知識の時点を表し、一度に扱える情報量の上限ではない。',C:'要求から応答までの時間を表し、文脈の容量ではない。',D:'生成のばらつきへ影響する値であり、文脈の容量ではない。'},
    displayedExplanation:'Context Windowは、モデルが1回の要求で扱える情報量の上限に関係する枠です。ユーザーの入力だけでなく、会話履歴、指示、関連ファイルやツール結果も、この限られた容量を使います。トークン数で数える文脈の上限を問う今回の説明に対応します。\n\n容量の上限と、上限に近づいたときの対処は別です。現行のVS Codeでは古い会話を要約して空きを作る仕組みがあり、常に古い情報がそのまま切り捨てられると決まっているわけではありません。必要な条件が残っているかを確認して作業を続けます。',
    review:{blindCheck:'四つの用語はそれぞれ容量、知識の時点、時間、生成分布を表す。どれを問うかは本文で決まる。',difficulty:'文脈容量の基本用語を識別する基礎問題を維持。'},
  },
  {
    id:'q-d3-g12',findingId:'F08',additionalSourceIds:['alignment-cutoff','chat'],
    question:'Copilotで使うLLMについて、学習済み知識がカバーする時点を確認しています。その時点より後のフレームワークの仕様変更は、学習済み知識だけでは正確に答えられるとは限りません。この知識の時点を表す用語はどれですか？',
    explanation:'Knowledge Cutoffは、モデルの学習済み知識の時点を表す。学習処理の完了日や、回答が必ず正しい範囲を示すものではない。',
    choiceExplanations:{A:'一度に扱える文脈量の上限であり、学習済み知識の時点ではない。',B:'事実に反する内容をもっともらしく生成する現象であり、知識の時点ではない。',C:'学習時と運用時の条件の変化等に伴う性能変化であり、知識の時点ではない。',D:'学習済み知識の時点を表す。新しい仕様は必要な外部情報と照合する。'},
    displayedExplanation:'Knowledge Cutoffは、モデルの学習済み知識がカバーする時点を考えるための情報です。学習処理そのものが終わった日時や、その日以前の出来事をすべて正確に知っているという保証とは区別します。対象モデルの公式仕様で知識の時点を確認することが基本です。\n\nそれより新しいフレームワークの仕様は、学習済み知識だけで正確に答えられるとは限りません。Copilotが利用できる最新の公式資料や検索結果を文脈に加えると補える場合がありますが、回答を資料と照合する必要は残ります。知識の時点と、その場で取得する情報を分けて理解します。',
    review:{blindCheck:'用語の選択肢は維持し、時点・容量・誤生成・性能変化のどれを問うかを本文から判断する。',difficulty:'知識の時点の概念を識別する基礎問題を維持。'},
  },
  {
    id:'q-sc01-1',findingId:'F09',
    question:'【AnyCompany Tech事例】Copilot Businessを使うチームで、VS Codeの通常のコード補完とChatのAskモードから、指定した機密ファイルを直接の入力文脈として除外する方針です。.gitignoreとは別に、管理者が設定するCopilotの機能として最も適切なものはどれですか？',
    explanation:'指定したファイルの直接参照を、対応する補完やChatの入力文脈から除外する設定を使う。',
    choiceExplanations:{A:'Content Exclusionで対象パスを指定する。適用する機能や参照経路の制約も確認する。',B:'Gitの追跡対象を指定する設定で、Copilotの入力文脈の除外設定とは別である。',C:'公開コード一致は生成後の提案を制御し、今回の入力ファイルを除外する設定ではない。',D:'資格情報の検出だけでは、対象ファイルをCopilotの入力文脈から外せない。'},
    displayedExplanation:'Content Exclusionは、管理者が指定したファイルやパスを、対応するCopilot機能の入力文脈から外す設定です。今回はVS Codeの通常補完とAskモードで、機密ファイルの直接参照を管理するため、この機能を使います。.gitignoreのGit追跡設定とは別に設定する必要があります。\n\nこの設定は、すべての参照経路を遮断する保証ではありません。Agent・Editモードの非対応や、IDE経由の型情報などの間接的な文脈にも注意します。利用する機能と参照経路を特定して、除外表示や動作を確認します。',
    review:{blindCheck:'各選択肢は追跡管理、出力一致、秘密検知、入力除外を扱う。本文で求める入力側の制御に照合する必要がある。',difficulty:'通常補完とAskを明記し、非対応モードの診断を要求する高難度問題にはしない。'},
  },
  {
    id:'q-sc08-3',findingId:'F10',additionalSourceIds:['feature-refresh-context','feature-refresh-context-model'],
    question:'【DataFlow Analytics事例】VS CodeのCopilot Chatで、DataPipeline.tsとSchemaValidator.tsの現行実装について質問します。対象はこの二つと分かっているため、ファイル名だけで自動検索に任せず、両方を文脈として明示したいと考えています。基本操作として最も適切なものはどれですか？',
    explanation:'既知の二ファイルを明示添付して対象を指定する。全内容の利用や正しい解釈まで保証するものではない。',
    choiceExplanations:{A:'二ファイルを直接指定できる。回答でどう使われたかは内容を照合する。',B:'検索へ対象の取得を任せており、二ファイルを直接添付する操作ではない。',C:'命名規約の指示だけでは、今回の二ファイルの実装を文脈へ渡せない。',D:'今回必要な二ファイルのうち、一方が指定されていない。'},
    displayedExplanation:'参照してほしいファイルが分かっている場合は、Add Contextやファイルのドラッグで対象を明示添付できます。今回はDataPipeline.tsとSchemaValidator.tsの両方が必要なので、二つを指定して質問します。ファイル名だけを書いて自動検索へ任せるより、参照してほしい対象を直接伝えられます。\n\n明示添付は、全内容の利用や正しい解釈の保証ではありません。回答が二ファイルの現行実装を適切に踏まえているか、内容と参照表示を確認します。対象を指定する操作と、回答の正確さを確かめる作業を分けることが要点です。',
    review:{blindCheck:'二ファイル、片方だけ、規約、探索という操作の違いを本文の対象指定に当てはめる。正解だけに安全性の保証を付けない。',difficulty:'既知のファイルの明示添付という基礎操作を維持。'},
  },
  {
    id:'q-d1-e08-feature-20261016',findingId:'F03',additionalSourceIds:['alignment-approvals-release'],
    appendExplanation:'このPR承認機能は2026年9月1日にPublic previewとして追加されたもので、8月7日時点の機能と区別して学習します。設定や対応範囲は変更され得るため、利用時は公式資料を確認します。',
    review:{blindCheck:'既存の設問・四択・正解を維持。今回の変更は解説の時点注記と日付付き公式出典のみ。',difficulty:'承認の生成、算入、人の必須要件を分ける既存の高難度を維持。'},
  },
  {
    id:'q-d6-e02-feature-20261016',findingId:'F04',additionalSourceIds:['alignment-authorized-release'],
    appendExplanation:'この外部ライセンス利用者からの依頼を制限する設定は、2026年10月8日に追加された機能です。8月7日時点の仕様と混同せず、現行の追加機能として、個人の依頼と組織rulesetによる起動を分けて理解します。',
    review:{blindCheck:'個人依頼とrulesetの二経路の組合せを問う既存の四択を維持。本文なしでは起動可否の組合せは決まらない。',difficulty:'外部ライセンスの制限と起動元の適用範囲を照合する高難度を維持。'},
  },
];

export const newSources = [
  {id:'alignment-telemetry',title:'OpenTelemetry for agent monitoring',url:'https://docs.github.com/en/copilot/concepts/enterprise/opentelemetry',publisher:'GitHub Docs',sourceType:'documentation'},
  {id:'alignment-cutoff',title:'Model training data knowledge cutoff FAQ',url:'https://learn.microsoft.com/en-us/azure/foundry-classic/openai/faq',publisher:'Microsoft Learn',sourceType:'documentation'},
  {id:'alignment-approvals-release',title:'Copilot code review can now approve pull requests',url:'https://github.blog/changelog/2026-09-01-copilot-code-review-can-now-approve-pull-requests/',publisher:'GitHub Blog',sourceType:'reference'},
  {id:'alignment-authorized-release',title:'Copilot code review: New organization billing options and controls',url:'https://github.blog/changelog/2026-10-08-copilot-code-review-new-organization-billing-options-and-controls/',publisher:'GitHub Blog',sourceType:'reference'},
];
