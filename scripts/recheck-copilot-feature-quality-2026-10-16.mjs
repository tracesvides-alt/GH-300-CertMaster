import fs from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const base='content/gh300/2026-08-07/';
const bank=read(base+'questions/seed.json');
const expected='b080f17c2f3ceef4a77badc799d66c2c4c9b66fafca51d662e72c17975ace175';
if(hash(bank)!==expected)throw Error('The reviewed bank changed. Do not reuse these editorial judgments.');
const retired=new Set(read(base+'questions/selection-exclusions.json').questions.map(q=>q.id));
const active=bank.filter(q=>!retired.has(q.id));
const questions=active.filter(q=>q.difficulty!=='beginner').sort((a,b)=>hash('recheck2/'+a.id).localeCompare(hash('recheck2/'+b.id)));
if(questions.length!==91)throw Error('Unexpected review scope');
const refresh=read('reports/copilot-feature-refresh-2026-10-16.json');
const applied=read('reports/applied-question-quality-review.json');
const exam=read('reports/exam-question-quality-review.json');
const syllabus=read(base+'syllabus.json');
// These sets and notes are explicit editorial decisions, not text classifiers or test results.
const blindRisk=new Set([9,21,25,29,34,39,40,62,64,65,69,70,71,72,85,91]);
const blindCaution=new Set([3,5,10,26,28,41,46,58,63,77,78]);
const appliedBelow=new Set([1,2,15,17,23,25,29,30,39,40,45,48,66,71,74,76,84,85]);
const appliedEntry=new Set([4,5,10,16,24,53,55,59,60,64,68,73,78,80,90]);
const examBelow=new Set([8,9,18,19,20,26,27,31,32,34,35,37,43,47,49,50,51,52,56,57,58,62,65,67,69,72,82,89,91]);
const examEntry=new Set([3,6,7,14,28,41,70,87]);
const generalReasoning=new Set([10,35,46,69]);
const suppliedRules=new Set([18,20,45,48,49,51,52,58,65,89]);
const notes={
1:'座席一覧と利用集計の区別は機能に沿うが、「個別割当を把握→割当一覧」の一対一の識別。応用の判断材料が少ない。',
2:'No access／viewer／editor／adminは同じ粒度で比較できる。一方、非表示という目的からNo accessを選ぶ定義照合が中心。',
3:'ツール提供と承認の区別は妥当。ただし本文が編集・実行の両方の不足を明示し、正答だけが両方を追加する。高度な原因切り分けには届かない。',
4:'再レビュー・指摘解決・要約・修正依頼は実在の操作。通常返信に返答しない境界は必要だが、Fix with Copilotの起動識別として応用の入口。',
5:'参照資料と実行workspaceの違いを問う。ただし三案がAを維持し、一案だけBを実行先にする構造が目立つ。',
6:'applyToの一致とexcludeAgentの対象を照合する点は有効。ただし設定値code-reviewの語義を読むだけに近く、本番相当としては境界域。',
7:'Spaceと参照repoの権限を分ける題材は妥当。ただし403の対象がすべて明示され、実質は二人分の権限対応表の読み取り。',
8:'失敗した接続先URLが本文にそのままあり、選択肢の同じURLを選べる。応用の診断情報取得問題よりも軽い。',
9:'正答だけが廃止済み経路を離れ、誤答二案が廃止APIの復活を試す。移行先も準備済みと明示され、本番相当の比較が成立しにくい。',
10:'未収集を未利用とみなさないという観測一般論で解ける。Copilot固有の収集対象・API項目・条件を照合する問いへ寄せる必要がある。',
11:'head/baseの指示差、共通指示、パス適用を組み合わせる。表示順や語調だけで一案に決まらず、Copilot review固有の参照元が必要。',
12:'認可利用者の個別依頼制限とrulesetの例外を別経路として評価する。独立した仕様を照合する本番相当の候補として残せる。',
13:'手動起動の許可とモデルによる自動委任の禁止を二つの実在設定へ対応させる。四案の設定粒度が揃っている。',
14:'setup失敗後の二つの挙動を知る必要はあるが、三段階の調査ではなく既定動作の想起。応用との境界にある。',
15:'全階層と拡張子をglobへ置き換えるだけ。Copilot固有の適用条件との照合が薄く、基礎寄り。',
16:'接続方式・認証・ツール入力という層を区別する題材は妥当。ただしstdioだけと明示され、応用の入口に留まる。',
17:'自動同期という条件がなく、Settings Syncとユーザー領域への手動コピーの両方が目的を満たす。単一正答の条件を補う必要がある。',
18:'強制Blockと解除できない規則が本文で与えられ、両方Blockを選ぶだけ。Copilotの仕様を知らなくても規則の代入で解ける。',
19:'draftは対象外・追加pushも対象外という要望を二つの真偽値へ直訳している。本番相当の分析負荷がない。',
20:'Qだけに参照が出たと本文が先に示し、正答はQの記録。採用時だけ記録する仕様を推論する前に結論が分かる。',
21:'正答だけが各repoの規約を保持し、他案はR/Sの規約を変えるか競合を残す。正答の配慮のよさが手掛かりになる。',
22:'一般Agentでは使えるのに特定Agentではtools: []という差を捉え、最小の検索ツールだけを供給する判断は応用として成立する。',
23:'大文字小文字を区別しない仕様が与えられ、正答は本文の完全パスそのもの。case-insensitiveの知識を測れていない。',
24:'入力・接続・出力フィルタを同条件比較から分ける構成は妥当。ただし変えた設定名が直接正答を示し、応用の入口。',
25:'Bのrepo識別とパスを含む案だけが目的に沿い、gitignore・公開一致・Aの細分化が誤答。応用としても推測と消去が容易。',
26:'今回の明示指定がそのまま正答で、組織・repo・前回値が結論に寄与しない。今回値と直近値が食い違う二案も不自然。',
27:'除外を外す・Blockを維持するという要望を四択の真偽表へ移すだけ。入力除外と出力フィルタの区別は応用には使える。',
28:'cloudのAgent定義とVS CodeのMCP接続の差はよい題材。ただしtoolsは既に正しく、空にする誤答二件が弱い。',
29:'正答だけがAutopilotという実行方式を挙げ、既存許可と別という解説まで含む。他三案は通常モードの許可変更なので正答が目立つ。',
30:'常時指示と任意実行のPrompt Fileの分類が中心。さらにクライアントとLocal harnessの前提がない。',
31:'同じrepoと明示したうえでURL表記差を問う。プロトコル正規化の一仕様の適用で、本番相当より応用寄り。',
32:'両設定が無効、両方を有効にしたいという要望の直訳。承認機能のpreview条件は明示されているが、それ自体で難度は上がらない。',
33:'共通指示の残留とパス別適用、全階層のglobという競合を切り分ける。正答の特定に実在の指示適用方法が必要。',
34:'本文がruleset起動とその維持方針を明示する。誤答に「今回のレビューを無効扱い」「個人設定でrulesetも止める」があり、正答が目立つ。',
35:'クラウドで失敗したのでクラウドの準備・外部接続を確認するだけ。Copilot固有のsetupファイル・ログ段階・設定境界を問えていない。',
36:'実行前と結果取込前の承認を分ける。正解・誤答の四つの組合せが同じ粒度で、外部データの扱いから設定を選べる。',
37:'既存PRへ@copilotで依頼する経路の識別。branchと書込権限は題材になるが、失敗の競合仮説を判別する本番相当には足りない。',
38:'nameがファイル名を上書きする点とtools指定時の既定Agentを組み合わせる。応用として必要な二つの仕様がある。',
39:'入力を求める構文だけが正しい用途で、applyToやtoolsを変数扱いする誤答が弱い。入力変数構文は毎回の対話UIを保証する機能とは区別すべき。',
40:'必ず含めたい特定ファイルを明示添付するだけ。他案が添付省略・Block解除・モデル再選択で、本文以前に正答が目立つ。',
41:'公開索引の対象と反映時点を分ける実在の境界。ただし二件の分類に留まり、公開直後に反映完了を断定する二案も弱い。',
42:'Git repoの内外と全階層を別々の設定要素へ対応させる。四つのスコープの違いがあり、応用として成立する。',
43:'Bashの要求がfirewall拒否と既に特定されており、必要なドメインを許可する一操作。複数の成功観測は正答にほぼ影響しない。',
44:'CLIのavailable-toolsへread,searchを渡すが、公式の標準ツール名はview,grep等。権限パターンのread/shellやcustom agent別名との混同がある。現状の正答を正式なCLI例として支持できない。',
45:'IDEの型情報が伝わる可能性を本文が明記し、正答でも同じ型・hover情報を選ぶ。知識の適用より本文の言い換え。',
46:'認可済みの現在APIと朝のCSVの選択は、一般のデータ鮮度判断だけでも解ける。Copilotのツール接続や権限伝播の実効条件が必要。',
47:'リンク先は更新済み・PDFは旧版と明示され、PDFだけ差し替える答えを本文からそのまま取れる。',
48:'Markdown停止・TypeScript維持を四択が同じ語で繰り返す。実際の設定キー・設定範囲を確認させず、基礎の定義照合に近い。',
49:'deny優先と候補制限の二規則を本文が全部与える。規則の二ケースへの代入にはなるが、製品仕様を適用する本番相当としては軽い。',
50:'一ツールのPre-approvalだけを変更する実在操作。Reset全体・提供候補・Post承認との区別は応用として妥当だが本番相当には弱い。',
51:'checkpointで戻せるもの・戻せないものを本文で全部教え、両方戻す対処を選ぶだけ。三段階推論欄があっても推論課題がない。',
52:'現在の要求・応答設定と、そのまま保つ方針がすべて本文にある。正答は変更なしで、仕様照合をほぼ要しない。',
53:'meteredでの自動要求抑制と明示要求の違いは実仕様。コマンド識別が中心で応用の入口。',
54:'二つのシンボルを指定する操作と、シンボル候補に開いたファイルが必要な条件を組み合わせる。応用として成立する。',
55:'非TTY・複数候補・既知IDという条件でresume/continue/新規を区別する。コマンド識別中心だが実務上の条件はある。',
56:'レビュー専用準備という要望と専用ファイル名を対応させる一仕様。応用には使えるが本番相当の多段階判断ではない。',
57:'現在PRには開始時版・新規taskで新版という結論を本文が要望として提示し、正答がそのまま繰り返す。階層の設定差を推論する課題になっていない。',
58:'Prompt Fileが優先・未接続ツールは無視という二規則を本文が教える。残るreadを選ぶ集合の演算で、Copilot知識を測れていない。',
59:'到達性診断・詳細ログ・保存ログ・Electron Consoleの用途を区別する。語義対応が強いが、応用の入口として使える。',
60:'承認を残す範囲は具体的。ただし「拒否ルール」は実行禁止と誤読され、falseで確認を要求する意味が選択肢から伝わらない。正式キーの接頭辞も省略されている。',
61:'非対話の終了と回答のみ出力という二条件を、-pと--silentへ対応させる。実在の近接起動方法を比較できる。',
62:'正答だけが正式job名とdefault branchを満たす。他案は常に壊れた構成を残すので、本文を隠しても正規構成だけを選べる。',
63:'未pushのローカル変更とGitHub上の版を分ける題材は妥当。ただし正答一件だけがローカル最新版を扱い、他三案がGitHub側に寄る。',
64:'秘密入力としてmasked input参照だけが妥当。非表示・実値の受け渡しを同時に満たす正答に対し、パスやダミー値の誤答が弱い。',
65:'CLI非対応という仕様まで本文が与え、正答だけが両方の機密取得経路を閉じる。製品知識より安全な包括策を選ぶ作り。',
66:'既知のsearch_catalogを使いたいので同名ツールを明示する、という起動操作の識別に留まる。',
67:'未pushをローカルで編集・実行したいという条件がローカルAgentへ直結する。Agentの選択として応用には使えるが、本番相当には軽い。',
68:'Chatとインラインの設定経路の差は製品機能。どのコントロールを開くかが中心で応用の入口。',
69:'詳細を失ったら元資料を再取得する、という一般のLLM会話の対処で解ける。compact固有の操作・参照状態との照合がない。',
70:'Agentは除外非対応という根拠を本文が明示し、正答だけが機密へのアクセス境界を守る。未知の対応範囲を診断する課題になっていない。',
71:'一致するOrganizationルールが残ると本文が示し、同じルールを正答として選ぶ。削除済みルール・Git追跡・公開一致が弱い誤答。',
72:'repoごとのtask/PRという実仕様の題材。ただし三案がAのtaskを維持し、一案だけA/Bを分けるため形で推測しやすい。',
73:'ツールを候補から外すことと実行承認を要求することを分ける。必要なsearchを保つ制約もあるが、応用の入口。',
74:'sandboxで必要なディレクトリを許可したいので許可先を追加する、という要望の直訳。実在の設定範囲の比較が薄い。',
75:'GitHub.com/GHE.comの対応差とUnconfigured時の管理許可を照合する。二つの独立した製品条件が必要。',
76:'今回だけ許可したい→今回だけ許可という直接照合。承認の機能は関連するが応用としては軽い。',
77:'repo利用者と管理Seat対象の範囲を交差して判断する。一方、全ての無関係repoを除外する誤答は弱く、残すなら近接スコープへ変えたい。',
78:'cloudとlocal proxy、firewall全停止とドメイン許可の区別は必要。ただし正答だけが限定許可で、安全さも手掛かりになる。',
79:'Prompt Fileのmodelとpickerの二つの優先関係・変更範囲を比較する。四択は同じ設定の組合せで、応用として成立する。',
80:'Askの暗黙文脈とAgentの添付候補の差は題材になるが、実際に問う操作は「ファイル全体を明示添付」の識別。',
81:'ツール承認とURL承認の保存範囲を比較する実仕様。場所ごとの別ファイルではなく、一つのpermissions-config.json内で場所へスコープされる点は表現を明確にしたい。',
82:'AskからAgentへ移り、必要な実行ツールを有効にするという基本的な使い分け。現在の応用より難しいとは評価できない。',
83:'ツール提供・実行拒否・保存範囲を区別し、必要なGit操作を残す。具体的な制約のある応用として成立する。',
84:'loaded configurationを確認する/envというコマンド名の想起。他の作業を本文で除外し、応用の判断材料が少ない。',
85:'発見と使用の区別はよいが、正答だけが適用の直接証拠。誤答は存在だけ・モデルだけ・承認履歴を適用とみなす、という明らかな不足。',
86:'依頼者のワークフロー承認と、人の必須レビューの担当可否を分ける。A優先の運用条件もあり、二つの承認を一括判断できない。',
87:'文脈とファイルの分離は実在の境界。ただしクライアント・Subagentを別worktreeへ割り当てる実行方法が不明で、本番相当維持は条件付き。',
88:'別組織ownerと対象repo Maintainを混同せず、二つのContent Exclusionの編集権限を判定する。応用の比較基準として適切。',
89:'元branch宛の別PRという成果物が本文と正答で同じ語になっている。ボタン選択の応用の入口で、本番相当の推論はない。',
90:'一回の再レビューと追加push自動化を区別する実操作。目的に沿う近接操作の比較として応用の入口。',
91:'正答だけが二つの限界を分け、他三案は同じ原因だと一括する。さらにAgent非対応は本文で示され、二つの高度な診断にはなっていない。',
};
const cfBad={
8:'観測を「Chatは動く・通常補完だけ失敗」へ変えたのに、問いは「Chatの復旧」のまま。補完経路を正答とする目的が食い違う。',
9:'Issue用資格情報の失効へ変えても、冒頭の廃止Extension停止は残る。指定した誤答Bには廃止済みExtension APIの再疎通も含まれる。',
23:'冒頭のprivate内のsecrets.env「だけ」と、後半の別ディレクトリも含む同名全ファイルの除外が矛盾する。',
28:'環境をcloudへ変えた後も、末尾が「VS CodeでもそのMCPを使うため」。cloud用mcp-serversを維持する案へ正答を変えられない。',
35:'冒頭ではlocal成功・cloud失敗、変更部分ではcloud正常・local proxyだけ失敗。相反する観測が同居する。',
43:'Bashは成功する観測へ変えたのに「Bashからの必要な通信を通す変更」を尋ねる。MCP接続先変更を正答とする問いになっていない。',
45:'未反映へ条件を変えたのに、指定した正答は別の上位除外ルール。未反映を述べる選択肢と取り違えている。',
48:'目標を全言語の停止に変えたが、指定案はMarkdownとTypeScriptの二言語だけ。他の言語がないという前提がない。',
50:'全保存済み承認を消すという変更の後に、結果取込設定は変えないという制約が残る。全承認Resetとの整合を取れていない。',
62:'jobは既にcopilot-setup-stepsへ直した条件なのに、指定した正答は「job名prepareは維持する」。正答を切り替える検証が成立しない。',
65:'ローカルの機密読取が成功しない状態へ変えても、問いは両経路を候補から外すまま。指定案はローカル読取を候補に残すので要件違反。',
81:'URLの恒久承認を別の書込ツールへ変えたのに、そのURLには確認が出ないという観測が残る。二つとも場所別という結論を支えない。',
84:'ログ原因解析をしたいという変更と、ログのエラー解析はまだ行わないという制約が同居する。',
87:'ファイル分離は不要としただけでは、別worktreeを使う案を禁止していない。文脈だけ分離する案と両方分離する案の一意性がない。',
};
const cfLanguage={3:'「Agent自身にファイル変更は自分で行い」と主語・係り受けが崩れる。',6:'applyToとexcludeAgentの並列を置換で壊し、どの指定がないのか曖昧。',12:'「組織はCopilot code reviewと、…は…無効です」となり、code review全体も無効なのか読み分けにくい。',13:'「Copilotが文脈から自動的な委任も認めたい」と主語が崩れる。',19:'「…されますが、…も対象にしますが」と接続が重複する。',39:'入力要求が実装済みという変更と、元の入力が未記載という条件との関係を明記したい。',44:'「ありますしました」「この三指定」が一つの候補制限へ変えた説明に残る。',47:'リンク先更新済みという説明を残して「PDFは差替済みですがリンクは別の旧仕様」と続け、変更対象の区別が読みにくい。',55:'特定IDを選ばない条件へ変えたのに、問いが「そのIDを再開する」のまま。',91:'文末が「除外表示が出たです」となっている。'};
const cfMulti=new Set([14,26,67,77]);
const mainIssues={17:['ANSWER_AMBIGUITY','自動同期を必須と明記し、手動コピーも条件を満たす余地を解消する。'],44:['OFFICIAL_TOOL_NAME_MISMATCH','CLI標準のview/grep/bash等で候補制限を書き直す。permission kindとtool nameを分け、実行環境も指定する。']};
const qualifications={30:'Prompt Fileが使えるVS CodeのLocal harness等の対象面を明記する。',39:'入力変数構文はモデルへの依頼方法であり、毎回の対話保証と断定しない。',60:'正式なchat.tools.terminal.autoApproveとfalseの確認要求を明記し、実行禁止のdenyと区別する。',81:'場所別とは物理的にrepoごとにファイルがある意味ではないと明確にする。',87:'VS Code等のクライアントと、別worktreeを使う具体的な実行単位を指定する。'};
const extraBlind={3:'正答だけが編集と実行の両方を備える。',5:'三案がA維持、一案だけBへ移る対比。',10:'収集条件と実利用を両方調べる案だけが包括的。',26:'今回と直近が不自然に異なる二案が弱い。',28:'toolsを空にする二案は必要なMCP実行を満たさない。',41:'公開直後の反映完了を断定する二案が弱い。',46:'一案だけが認可と鮮度を同時に明示する。',58:'未接続ツールも使えるとする二案が弱い。',63:'一案だけローカル最新版で、他三案はGitHub側。',77:'全ての無関係repoを含める案が過剰。',78:'正答だけが全停止でなく限定的な許可。'};
const rows=questions.map((q,i)=>{
 const n=i+1;if(!notes[n])throw Error('Missing editorial row '+n);
 const prior=refresh.questions.find(r=>r.id===q.id)?.review??[...applied.questions,...exam.questions].find(r=>r.id===q.id);
 const cf=prior?.counterfactual;
 const difficulty=q.difficulty==='intermediate'?(appliedBelow.has(n)?'BELOW_LABEL':appliedEntry.has(n)?'ENTRY_LEVEL':'MATCH'):(n===44?'UNASSESSABLE':examBelow.has(n)?'BELOW_LABEL':examEntry.has(n)?'BOUNDARY':'MATCH');
 const correct=q.choices.find(c=>q.answer.includes(c.id));
 const lengths=q.choices.map(c=>Array.from(c.text).length).sort((a,b)=>a-b),median=(lengths[1]+lengths[2])/2;
 return {n,id:q.id,fingerprint:hash(q),difficulty:q.difficulty,domainId:q.domainId,objectiveId:q.objectiveId,
  question:q.question,choices:q.choices,answerIds:q.answer,explanation:q.explanation,
  featureNecessity:generalReasoning.has(n)?'FEATURE_RELATED_BUT_GENERAL_REASONING':suppliedRules.has(n)?'DECISIVE_RULE_OR_RESULT_GIVEN':'FEATURE_KNOWLEDGE_RELEVANT',
  optionOnly:{verdict:blindRisk.has(n)?'GUESSING_CUE_RISK':blindCaution.has(n)?'DISTRACTOR_CAUTION':'NO_SPECIFIC_CUE_FOUND',reason:blindRisk.has(n)?notes[n]:extraBlind[n]??'本文の対象・設定・目的がなければ、四案から一案を選ぶ明確な手掛かりは今回見つけなかった。独立したブラインド試験の合格を意味しない。'},
  difficultyAssessment:{verdict:difficulty,reason:notes[n]},
  mainIssue:mainIssues[n]?{type:mainIssues[n][0],remedy:mainIssues[n][1]}:null,
  qualification:qualifications[n]??null,
  counterfactualReview:{status:typeof cf==='string'?'LEGACY_NOTE_ONLY':cfBad[n]?'SEMANTIC_REVIEW_FAILURE':cfLanguage[n]?'LANGUAGE_OR_SCOPE_REWRITE':cfMulti.has(n)?'MULTI_CHANGE_REPLAY':cf?'NO_SPECIFIC_FAILURE_FOUND':'MISSING',reason:cfBad[n]??cfLanguage[n]??(cfMulti.has(n)?'問題文の大部分や複数の状態を置き換えた別ケース。単一条件を変える反実仮想としての証拠は弱い。':typeof cf==='string'?'別条件の短い説明はあるが、変更後の全文・全選択肢の一意性を追試できる形式ではない。':'今回の再読では特定の破綻を見つけなかった。意味検証を自動化できたという意味ではない。'),stored:cf,claimedAnswer:typeof cf==='object'?q.choices.find(c=>c.id===cf.answerId)?.text:null},
  measurements:{correctPosition:'ABCD'[q.choices.findIndex(c=>q.answer.includes(c.id))],correctCharacters:Array.from(correct.text).length,allChoicesMedian:median,correctToMedian:Array.from(correct.text).length/median},
  disposition:mainIssues[n]?'FIX_MAIN_QUESTION':blindRisk.has(n)||difficulty==='BELOW_LABEL'||generalReasoning.has(n)?'REWRITE_OR_RECLASSIFY':cfBad[n]||qualifications[n]?'FIX_REVIEW_OR_QUALIFICATION':difficulty==='BOUNDARY'||difficulty==='ENTRY_LEVEL'||blindCaution.has(n)?'RETAIN_WITH_LIMITATIONS':'RETAIN_CANDIDATE'};
});
const counts=(xs,f)=>xs.reduce((a,x)=>(a[f(x)]=(a[f(x)]??0)+1,a),{});
const domains=syllabus.domains.map(d=>({id:d.id,syllabusRange:[d.min,d.max],allActive:active.filter(q=>q.domainId===d.id).length,allShare:100*active.filter(q=>q.domainId===d.id).length/active.length,reviewed:questions.filter(q=>q.domainId===d.id).length,reviewedShare:100*questions.filter(q=>q.domainId===d.id).length/questions.length}));
const objectives=syllabus.domains.flatMap(d=>d.objectives.map(o=>({id:o.id,title:o.title,...Object.fromEntries(['beginner','intermediate','advanced'].map(l=>[l,active.filter(q=>q.objectiveId===o.id&&q.difficulty===l&&q.status==='verified').length]))})));
const overlaps=[{numbers:[40,63,80],finding:'同じ「対象ファイルを明示添付」へ収束。remote/localと暗黙文脈の境界は別なので、同一問題と断定せず、40の独立性を優先再検討。'},{numbers:[3,22,73,82],finding:'候補ツールと実行承認の区別に集中。特に3と82は編集・実行ツール追加という同じ結論で、難度差を説明しにくい。'},{numbers:[8,59],finding:'到達性診断という近接テーマ。URLが直接示される本番相当8の方が、診断入口を選ぶ応用59より軽い。'},{numbers:[14,35,56,62],finding:'セットアップの題材自体は異なるが、35は一般のcloud/local切り分けに留まり、機能判断の追加価値が弱い。'},{numbers:[4,89],finding:'Fix with Copilotの起動と成果物の選択という別操作だが、89は本文の別PRをそのまま選ぶだけで本番相当になっていない。'},{numbers:[15,23,42],finding:'除外パターンの近接題材。repo内外の設定範囲は別の判断だが、23は完全パスの再掲で基礎との差が弱い。'}].map(g=>({...g,ids:g.numbers.map(n=>rows[n-1].id)}));
const report={reviewedAt:'2026-10-16',review:'POST_PUSH_SECOND_RECHECK',basedOnCommit:'2527747ee421feb8f485ddca40c93482acd3cc7d',bankFingerprint:expected,scope:{total:91,intermediate:48,advanced:43,foundationNotIndividuallyReviewed:163},
 method:{independentReviewer:false,learnerExperiment:false,optionOnly:'本文・ID・難度・正答を外した選択肢一覧を先に再読し、その後で本文とキーを照合。過去の文脈を知る著者による再読であり、独立したブラインド試験ではない。',difficulty:'基礎は定義・操作名・与えた規則の直訳、応用は観測と実仕様の照合、本番相当は競合する根拠・適用境界の分析。前回の三行の推論欄やPASSラベルは証拠としない。',noAppChanges:true},
 summary:{optionOnly:counts(rows,x=>x.optionOnly.verdict),difficultyByLevel:Object.fromEntries(['intermediate','advanced'].map(l=>[l,counts(rows.filter(r=>r.difficulty===l),x=>x.difficultyAssessment.verdict)])),featureNecessity:counts(rows,x=>x.featureNecessity),mainQuestionIssues:rows.filter(r=>r.mainIssue).map(r=>r.id),counterfactual:counts(rows,x=>x.counterfactualReview.status),dispositions:counts(rows,x=>x.disposition)},
 processFinding:'前回のpublisherはanswerWithoutReading:false・difficultyConsistent:trueや本番相当のplausibilityを一律に付与する。整合チェッカーは文字列置換・キー変更・記録の存在を検証するが、残存条件の矛盾や別解は検証しない。機械的PASSを意味上の合格へ読み替えない。',
 sources:[{title:'GH-300 Study Guide',url:'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300',section:'Skills measured as of August 7, 2026 / six domains',supports:'分類範囲、GA中心・一般的なpreviewの扱い、出題比率。'},{title:'CLI command reference',url:'https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference',section:'Tool availability values / Tool permission patterns',supports:'CLIの実ツール名と権限種別を別に扱う。44の設定例に不整合。'},{title:'Allowing and denying tool use',url:'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools',section:'Layers of tool controls / Persisted permissions',supports:'候補制限と実行許可は別層。承認保存は場所スコープとURLスコープが異なる。'},{title:'Prompt files',url:'https://code.visualstudio.com/docs/agent-customization/prompt-files',section:'Introduction / Prompt file format / Sync user prompt files',supports:'Local harness限定、input構文の保証範囲、個人プロンプトの同期。'},{title:'Custom agents configuration',url:'https://docs.github.com/en/copilot/reference/custom-agents-configuration',section:'Tools / Tool aliases',supports:'カスタムAgentのread/search等の別名をCLI availabilityへそのまま移植しない。'},{title:'Manage approvals and permissions',url:'https://code.visualstudio.com/docs/agents/run/approvals',section:'Manage tool approvals / Automatically approve terminal commands',supports:'実行前と結果取込の承認、falseは確認要求であり実行拒否ではない。'},{title:'Using Copilot code review',url:'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review',section:'Customizing reviews with custom instructions / Customizing environment',supports:'head branchの指示、レビュー専用workflow。'},{title:'Configure the development environment',url:'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment',section:'Copilot setup steps',supports:'正式job名・default branch・途中失敗後の挙動。'},{title:'Context in AI agents',url:'https://code.visualstudio.com/docs/agents/concepts/context',section:'Context isolation with subagents',supports:'文脈分離だけではworktreeやsandboxを作らない。'}],domains,objectives,overlapReview:overlaps,questions:rows};
const output='reports/copilot-feature-recheck-2026-10-16';
fs.writeFileSync(output+'.json',JSON.stringify(report,null,2)+'\n');
const escape=s=>String(s??'').replaceAll('|','／').replaceAll('\n',' ');
const label={MATCH:'概ね適合',ENTRY_LEVEL:'入口程度',BOUNDARY:'境界・要強化',BELOW_LABEL:'現ラベルより軽い',UNASSESSABLE:'正答の前提を修正して再判定'};
const md=['# 応用・本番相当の再点検（push後・2026-10-16）','',
'**全91問を再読した結果、全問合格とは評価しない。** Copilotの実機能を題材にする点は改善しているが、選択肢の手掛かり、本文による答えの先出し、難度の逆転、レビュー用の反実仮想の矛盾が残る。前回の完了・採用判定は、問題品質が十分であることの保証にはできなかった。','',
'対象は応用48・本番相当43問。基礎163問を個別に再レビューした結果ではない。アプリの問題・数・分類・除外設定を今回は変更していない。commit・pushも実施していない。','',
'## 集計（項目間の重複あり）','',
`- 選択肢だけで推測する手掛かりの懸念：${report.summary.optionOnly.GUESSING_CUE_RISK}問。別に誤答の弱さ等の注意${report.summary.optionOnly.DISTRACTOR_CAUTION}問。「本文なしで必ず正答できる」と実測した件数ではない。`,
`- 通常の問題自体の優先修正：${report.summary.mainQuestionIssues.length}問。単一正答の条件不足とCLI実ツール名の不整合。`,
`- 一般論へ寄る判断：${report.summary.featureNecessity.FEATURE_RELATED_BUT_GENERAL_REASONING}問。機能名が実在することと、その知識を知らないと解けないことを分けた。`,
`- 反実仮想の意味上の破綻：${report.summary.counterfactual.SEMANTIC_REVIEW_FAILURE}問。これは通常の問題が同じ件数だけ誤答という意味ではない。`,'',
'| 現在の難度 | 概ね適合 | 入口・境界 | 現ラベルより軽い | 前提要修正 |','| --- | ---: | ---: | ---: | ---: |',
...['intermediate','advanced'].map(l=>{const c=report.summary.difficultyByLevel[l];return `| ${l==='intermediate'?'応用48問':'本番相当43問'} | ${c.MATCH??0} | ${(c.ENTRY_LEVEL??0)+(c.BOUNDARY??0)} | ${c.BELOW_LABEL??0} | ${c.UNASSESSABLE??0} |`;}),'',
'これは編集上の難度判定であり、受験者の正答率や実試験と等価な難度を測った結果ではない。「三段階推論」の欄を三行埋めることを、本番相当の難度の証明にしない。応用側の88（別組織ownerとrepo Maintainの照合）等を比較基準にすると、現行の本番相当にそれより軽い操作識別が多い。','',
'## 優先して直す内容','',
'1. **通常問題の一意性・設定例。** q-sc03-3-feature-20261016は自動同期が必須と書かれていないため、手動コピーも可能。q-d5-e07-feature-20261016はCLIのtool availabilityにカスタムAgent別名／権限種別に似たread,searchを使う。CLIの標準ツール名と分ける必要がある。具体的なCLI実行結果までは確認していない。','',
'   [CLI公式リファレンス](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)ではavailabilityの値とpermission patternsは別の節で定義される。[Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files)の同期手順は、問題文で自動同期を必須とする条件の代わりにはならない。','',
'2. **誤答と答えの先出し。** q-d2-e01-feature-20261016は正答だけが正式job名とdefault branchの両方を満たし、誤答は常に壊れた構成を残す。q-d1-e02-feature-20261016は「参照が出たのはQだけ」と先に教えてQを選ばせる。q-d4-e04-feature-20261016はツール優先と利用不能時の規則を本文で全部教えている。','',
'3. **本番相当のラベル。** q-d3-e07-feature-20261016は失敗URLを同じURLの選択肢へ写すだけで、診断情報の入口を選ぶ応用q-d3-a19-feature-20261016より軽い。q-sc03-2-feature-20261016やq-sc02-1-feature-20261016も基本の起動・成果物の選択が中心。問題数を増減する前に、今の枠内で機能判断を強化するかラベルを見直す。','',
'4. **レビュー記録の再作成。** q-d2-e01-feature-20261016の条件変更後はjob名が既に正式なのに、変更後の正答がprepareを維持する案。q-d3-e07-feature-20261016ではChatが成功へ変わった後も、末尾がChat復旧の問いのまま。文字列置換成功とanswerId変更だけでは意味は検証できない。','',
'## 判定の限界と前回の工程上の問題','',report.method.optionOnly,'',report.processFinding,'',
'原稿と台帳のハッシュ整合テスト、画面の採点・保存テストは、設問の難度や反実仮想の論理まで証明しない。今回も他の評価者による実験ではないため、懸念なしの問題へ「推測不可能」といった保証を付けない。出題形式・クライアント・プランの違いで表面的に条件数を増やすことも難化とは扱わない。','',
'## 出題在庫と網羅性','',
'| Domain | 全在庫 | 全在庫比率 | 応用・本番相当 | 同91問内比率 | シラバス範囲 |','| --- | ---: | ---: | ---: | ---: | --- |',
...domains.map(d=>`| ${d.id.toUpperCase()} | ${d.allActive} | ${d.allShare.toFixed(1)}% | ${d.reviewed} | ${d.reviewedShare.toFixed(1)}% | ${d.syllabusRange.join('–')}% |`),'',
'D1不足・全在庫でのD2過多が残る。応用・本番相当だけならD6への集中も見える。模試抽選がDomain範囲を満たすことと、在庫・Objective・難度が満遍なく揃うことは別。今回、問題数と分類は動かしていない。','',
'| Objective | Verified基礎 | 応用 | 本番相当 |','| --- | ---: | ---: | ---: |',
...objectives.map(o=>`| ${o.id}: ${escape(o.title)} | ${o.beginner} | ${o.intermediate} | ${o.advanced} |`),'',
'現行ではd1o1・d3o2に応用／本番相当がなく、d4o1も本番相当がない。FoundationのSparkやzero/few-shotが存在することだけで、高難度の対応を網羅したとはしない。機能限定というユーザー条件と、[Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)の責任ある利用・prompt crafting等の範囲との緊張も明示する。preview・細かな最新UIの仕様が公式Docsにあることだけで、試験での出題頻度は断定しない。','',
'## 近接・重複の再検討','',...overlaps.map(g=>`- ${g.ids.join(' / ')}：${g.finding}`),'',
'## 公式情報で再確認した重要点','',...report.sources.map(s=>`- [${s.title}](${s.url}) — ${s.section}：${s.supports}`),'',
'## 全91問の一覧','',
'| ID | 現難度 | 選択肢単体 | 難度再判定 | 本文の優先問題 | 反実仮想台帳 |','| --- | --- | --- | --- | --- | --- |',
...rows.map(x=>`| ${x.id} | ${x.difficulty==='advanced'?'本番':'応用'} | ${x.optionOnly.verdict} | ${label[x.difficultyAssessment.verdict]} | ${x.mainIssue?.type??'—'} | ${x.counterfactualReview.status} |`),'',
'## 個別の根拠',''];
for(const x of rows){
 md.push(`### ${x.id}`,'',`- **本文**: ${x.question}`,`- **判定**: ${notes[x.n]}`,`- **機能知識の必要性**: ${x.featureNecessity}`,`- **選択肢単体**: ${x.optionOnly.verdict} — ${x.optionOnly.reason}`,`- **難度**: ${label[x.difficultyAssessment.verdict]}`,'',
 '| 位置 | 選択肢 | 判定 |','| --- | --- | --- |',...x.choices.map((c,i)=>`| ${'ABCD'[i]} | ${escape(c.text)} | ${x.answerIds.includes(c.id)?'保存されている正答':'誤答'} |`),'',
 `- **文字長・位置**: 正答${x.measurements.correctCharacters}文字／全四択中央値${x.measurements.allChoicesMedian}文字＝${x.measurements.correctToMedian.toFixed(2)}倍。保存時表示位置${x.measurements.correctPosition}。`,
 `- **反実仮想**: ${x.counterfactualReview.status} — ${x.counterfactualReview.reason}`);
 if(typeof x.counterfactualReview.stored==='object')md.push(`- **台帳の変更後本文**: ${x.counterfactualReview.stored.question}`,`- **台帳が指定した変更後の正答**: ${x.counterfactualReview.claimedAnswer}`);
 if(x.mainIssue)md.push(`- **本文の修正要件**: ${x.mainIssue.remedy}`);
 if(x.qualification)md.push(`- **仕様・日本語の留意点**: ${x.qualification}`);
 md.push('');
}
fs.writeFileSync(output+'.md',md.join('\n').trimEnd()+'\n');
console.log(JSON.stringify(report.summary,null,2));
