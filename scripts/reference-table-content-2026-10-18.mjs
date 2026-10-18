// Authored learning rows, with separate evidence of what the existing questions test.
const ref='feature-refresh-cli-reference';
const row=(id,cells,sourceIds,example,coverage={})=>({id,cells,sourceIds,...(example?{example}:{}),coverage});
const correct=(...ids)=>({correctChoiceQuestionIds:ids});
const scenario=(...ids)=>({scenarioQuestionIds:ids});
const distractor=(...ids)=>({distractorOnlyQuestionIds:ids});
const table=(id,caption,rows,columns=['目的','コマンド・指定','入力する場所','条件・注意'])=>({id,caption,columns,rows,lastVerifiedAt:'2026-10-18'});
export const cliSections=[
 {heading:'1. 導入・起動・認証',content:'シェルからcopilotを起動すると、CLI内の対話画面へ入ります。先頭が/のコマンドは、この対話画面へ入力します。認証、作業フォルダーの信頼、ツールの実行許可は別の確認です。',table:table('cli-start','導入・起動・認証のコマンド',[
  row('cli-install',['CLIを導入する','npm install -g @github/copilot','OSのシェル','npmを使う例です。Node.js 22以降など、導入方法ごとの前提を確認します。IDEの拡張機能を入れる操作とは別です。'],['cli-install'],'Linuxでnpmを使うと指定されたら、このパッケージを選びます。',correct('q-fnd-cli-install-20261017')),
  row('cli-start',['対話を開始する','copilot','OSのシェル','作業したいフォルダーで起動します。GitHub CLIのghや、旧拡張のgh copilotとは別のコマンドです。'],[ref],'リポジトリのフォルダーへ移動してから対話画面を開きます。',correct('q-d2-g07')),
  row('cli-login-shell',['シェルから認証を始める','copilot login','OSのシェル','CLIをまだ開いていない状態からOAuth認証を始める方法です。トークン等による別の認証方法もあります。'],[ref],'起動前にGitHubアカウントで認証します。'),
  row('cli-login-interactive',['CLI内から認証を始める','/login','Copilot CLIの対話画面','既に対話画面を開いている場合に使います。ログイン成功だけで、組織の資格や機能許可が付与されるわけではありません。'],[ref],'未ログインの表示が出た対話画面から認証を始めます。',correct('q-fnd-cli-login-20261017')),
 ])},
 {heading:'2. ヘルプとモデルを選ぶ',content:'使い方を調べる操作と、回答を生成するモデルを選ぶ操作を分けます。コマンドをどの画面へ入力するかも確認してください。',table:table('cli-help-model','ヘルプ・モデル選択のコマンド',[
  row('cli-help-shell',['シェルから使い方を調べる','copilot help','OSのシェル','コマンドやオプションの説明を確認します。copilot help permissionsのように話題を指定することもできます。'],[ref],'起動オプションの使い方を確認してからCLIを開始します。'),
  row('cli-help-interactive',['対話中にコマンドを調べる','/help','Copilot CLIの対話画面','その対話画面で使えるスラッシュコマンド等を確認します。認証を始める/loginとは目的が異なります。'],[ref],'対話を開いたまま、使用できる操作を調べます。',distractor('q-fnd-cli-login-20261017')),
  row('cli-model',['使用するモデルを選ぶ','/model','Copilot CLIの対話画面','利用可能なモデルから選びます。対象プランや管理ポリシーの条件もあり、モデル変更は認証やセッション再開の操作ではありません。'],[ref],'同じ作業を続けながら、使用モデルを選び直します。',distractor('q-fnd-cli-login-20261017')),
 ])},
 {heading:'3. 対話実行と非対話実行',content:'一回の質問を処理して終了したい場合と、その後も対話を続けたい場合では、起動時の指定を使い分けます。出力形式の指定は、ツールの実行許可を与えるものではありません。',table:table('cli-run','実行方法と出力の指定',[
  row('cli-prompt',['回答後に終了する','copilot -p "質問"','OSのシェル','非対話でプロンプトを処理します。ファイル操作等を依頼する場合は、使用するツール・パス等の許可条件も別に確認します。'],[ref],'スクリプトから一つの質問を渡し、応答後にプロセスを終えます。',correct('q-sc03-1-feature-20261016')),
  row('cli-interactive',['最初の依頼の後も対話する','copilot -i "最初の依頼"','OSのシェル','最初のプロンプトを渡して対話モードを開始します。一回で終了する-pとは異なります。'],[ref],'最初に調査を依頼し、その後は対話で追加の質問をします。',distractor('q-sc03-1-feature-20261016','q-sc07-1-feature-20261016')),
  row('cli-silent',['統計を付けず応答を受け取る','copilot -p "質問" --silent','OSのシェル','--silentは利用統計等を省いて応答を出力します。非対話実行と組み合わせる指定で、確認を省略するための権限設定ではありません。'],[ref],'後続の処理へ、回答のみの標準出力を渡します。',correct('q-sc03-1-feature-20261016')),
 ])},
 {heading:'4. 作業の再開先を選ぶ',content:'別の作業を誤って再開しないよう、選択画面、特定のID、直近のセッションを区別します。TTYは対話入力できる端末のことです。',table:table('cli-resume','セッション再開のコマンド',[
  row('cli-resume-inside',['対話中に別のセッションを選ぶ','/resume','Copilot CLIの対話画面','保存されたセッションを選び直します。新しい作業を開始する/clearと区別します。'],[ref],'CLIを開いたまま、昨日の作業へ切り替えます。',distractor('q-fnd-cli-login-20261017')),
  row('cli-resume-picker',['起動時に一覧から選ぶ','copilot --resume','OSのシェル','値を省略した指定は対話的な選択画面を使います。TTYのないスクリプトでは、明示したID等を使います。'],[ref],'複数の保存セッションから、人が対象を選んで再開します。',distractor('q-sc03-1-feature-20261016','q-sc07-1-feature-20261016')),
  row('cli-resume-id',['指定した作業を再開する','copilot --resume=SESSION-ID','OSのシェル','SESSION-IDを記録した対象のIDへ置き換えます。直近の作業が別タスクでも、再開先を指定できます。'],[ref],'選択画面のない復旧スクリプトで、記録したIDを再開します。',correct('q-sc07-1-feature-20261016')),
  row('cli-continue',['直近の作業を再開する','copilot --continue','OSのシェル','現在の作業フォルダーの直近セッションを優先し、なければ全体の直近へ進みます。--resumeと同時には指定しません。'],[ref],'再開したい作業が直近のセッションだと確認できている場合に使います。',distractor('q-sc07-1-feature-20261016')),
 ])},
 {heading:'5. ツールの候補と実行許可',content:'モデルが選べるツールを絞る設定と、選んだツールを実行してよいかを決める設定は別です。許可だけを追加しても、候補から外れたツールは利用できません。',table:table('cli-tools','利用可能なツールと実行許可',[
  row('cli-allow',['特定の操作を許可する','--allow-tool="shell(git:*)"','copilotに付ける起動オプション','Git操作に範囲を絞る例です。該当する操作の実行前確認を省けますが、Git以外の操作や候補外のツールを許可する指定ではありません。'],['cli-tool-permissions',ref],'Gitの操作だけを許可し、他の操作まで広げないようにします。',correct('q-d2-a25-ms-20261017')),
  row('cli-deny',['特定の操作を拒否する','--deny-tool="shell(git push)"','copilotに付ける起動オプション','該当する操作を拒否します。同じ操作が広い許可にも一致する場合、拒否が優先します。'],['cli-tool-permissions',ref],'Gitの操作は許可しつつ、git pushを実行させない設定を加えます。',correct('q-d2-a25-ms-20261017','q-d2-e06-ms-20261017')),
  row('cli-permissions',['現在の権限モードを確認する','/permissions show','Copilot CLIの対話画面','権限モードを確認する操作です。/permissionsはモード変更等も扱いますが、確認と広い権限の付与を混同しません。'],[ref],'事前の許可がどのモードで扱われているかを確認します。'),
  row('cli-available',['提供する候補だけを指定する','--available-tools=view,grep','copilotに付ける起動オプション','読み取りと検索のツール名を指定する例です。シェルを候補へ入れていない場合、実行許可だけではシェル操作はできません。'],['cli-tool-permissions',ref],'調査に必要なツールだけをモデルへ提示します。',scenario('q-d2-e07-feature-20261016','q-d5-e07-feature-20261016-ms-20261017','q-d2-e06-ms-20261017')),
  row('cli-excluded',['提供する候補から外す','--excluded-tools=grep','copilotに付ける起動オプション','指定したツールを候補から外す設定です。available-toolsと両方を指定した場合はavailable側の一覧が使われるため、単純な差集合と考えません。'],['cli-tool-permissions',ref],'grepを提供しない方針なら、同時に使う候補指定との関係も確認します。',scenario('q-d5-e07-feature-20261016-ms-20261017')),
 ])},
 {heading:'6. 文脈の使用量と会話を管理する',content:'使用量を調べる操作、会話を要約する操作、新しい会話へ切り替える操作は異なります。会話を短くするだけで、接続したMCPのツール定義まで減るとは限りません。',table:table('cli-context','文脈と会話を扱うコマンド',[
  row('cli-context-usage',['文脈の使用量を調べる','/context','Copilot CLIの対話画面','会話やツール等が文脈を占める状況を確認します。確認しただけでは、会話やツールの候補は変更されません。'],[ref],'MessagesよりMCP Toolsが大きいなら、不要なツール定義も調べます。',scenario('q-d4-e09-feature-20261016-ms-20261017')),
  row('cli-compact',['会話を要約して使用量を減らす','/compact','Copilot CLIの対話画面','会話履歴を要約して文脈使用量を減らします。ツール定義もまとめて消す操作や、新しい会話を開始する操作ではありません。'],[ref],'長い会話の要点を引き継ぎながら作業を続けたい場合に使います。',distractor('q-d4-e09-feature-20261016-ms-20261017')),
  row('cli-clear',['新しい会話を始める','/clear','Copilot CLIの対話画面','会話を切り替える操作です。ファイル変更の取り消しや、MCP構成を削除する操作ではありません。'],[ref],'これまでの会話を新しい相談へ持ち越したくないときに使います。',distractor('q-d4-e09-feature-20261016-ms-20261017')),
 ])},
 {heading:'7. 応用操作と旧拡張の位置付け',content:'Autopilotによる継続と、個々のツールの実行許可は別です。追加フォルダーへのアクセスには--add-dir等、MCP接続にはCLIのMCP構成を確認します。設定したツールや参照先に応じて、差分と実行結果を検証します。旧gh copilot explain/suggestとghcs/ghceは旧拡張の操作・短縮名です。現行のcopilotコマンド、GitHub CLIのgh、Gitやシェルのコマンドを混同しないでください。CLIへのContent Exclusionの適用は公式ページ間に説明差があるため、全経路の保護として当てにせず、利用環境と参照経路を確認します。'},
 {heading:'8. 30秒チェック',content:'Q1: 起動前に使い方を確認するには？ → シェルでcopilot help。対話中なら/helpです。\nQ2: 一回の応答だけを受け取って終了するには？ → -pを使い、統計が不要なら--silentを組み合わせます。\nQ3: 特定の保存作業を再開するには？ → IDを指定した--resumeを使います。\nQ4: /compactと/clearの違いは？ → 会話の要約と、新しい会話の開始です。\nQ5: ツールへ実行許可を与えれば、候補外のツールも使えるか？ → No。候補設定は別に確認します。'},
];

const planColumns=['Copilotプラン','主な契約・管理主体','組織の資格・ポリシー管理','別途必要な前提'];
export const planSection={heading:'プラン別の管理の前提',content:'プランは利用条件、ロールは操作権限です。個人プランでCLIを利用できることと、組織のシート・ポリシーを管理できることは別です。価格や全モデルの暗記より、誰の資格をどの範囲で管理するかを確認します。',table:table('copilot-plan-management','Copilotプランと管理の前提',[
 row('plan-free',['Free','本人が個人の利用設定を管理する。','個人Freeの資格は、組織が付与するBusiness/Enterpriseのシートとは別です。','利用できる機能には制限があります。組織・企業から資格を得ていない個人向けの条件を確認します。'],['plans'],'個人でCLIを試せることから、組織の管理権限があるとは判断しません。'),
 row('plan-student',['Student','認証された学生本人の資格・設定として扱う。','学生の個人資格だけで、組織へのシート付与やポリシー変更はできません。','学生認証などの対象条件を確認します。組織向け管理の前提とは区別します。'],['plans']),
 row('plan-pro',['Pro','個人の契約・設定を本人が管理する。','個人の有料契約と、組織のシートや管理権限は別です。','利用できる機能・モデル等は公式プラン表で確認します。'],['plans']),
 row('plan-pro-plus',['Pro+','個人の契約・設定を本人が管理する。','Proより利用枠等が広がっても、組織の管理ロールが付くわけではありません。','提供枠や機能差を確認し、組織向けのBusiness/Enterpriseと混同しません。'],['plans']),
 row('plan-max',['Max','個人の契約・設定を本人が管理する。','大きい利用枠を持つ個人プランであり、Enterprise ownerの権限とは別です。','組織の設定を変えるには、その操作に必要なロール・権限を別に確認します。'],['plans']),
 row('plan-business',['Business','組織・企業が利用者への提供を管理する。','シートや組織ポリシーを管理します。企業の管理下ではEnterpriseの決定も確認します。','組織向けの契約と、操作する人のロールが必要です。Content Exclusion等も対応条件を確認します。'],['plans','reference-enterprise-plan'],'プランがBusinessでも、企業側のポリシーが適用される場合があります。'),
 row('plan-enterprise',['Enterprise','GitHub Enterprise Cloudを利用する企業向け。','Businessの管理機能を含みます。企業のownerは組織ごとのプラン選択等を管理します。','GitHub Enterprise Cloudとの関係を確認します。プランを契約しただけで、全利用者がownerにはなりません。'],['plans','reference-enterprise-plan'],'Copilot Enterpriseというプラン名と、Enterprise ownerというロール名を分けます。'),
],planColumns)};
const adminColumns=['したい操作','主なロール・必要権限','対象範囲','追加条件・できないこと'];
export const adminSection={heading:'操作から必要な管理権限を選ぶ',content:'同じ人でも、企業・組織・リポジトリで持つ権限は異なります。APIを使う場合は人のロールだけでなく、トークンやGitHub Appの権限も確認します。閲覧権限があることから、変更権限もあるとは推測しません。',table:table('copilot-admin-operations','操作別の管理権限と適用範囲',[
 row('admin-plan',['組織へCopilotを提供しプランを選ぶ','組織のプラン管理はOrganization owner。企業管理下の組織のプラン選択はEnterprise owner。','その組織、または企業内の対象組織。','企業の管理下かを確認します。個人Pro等の契約者であることは、組織の管理権限を意味しません。'],['plans','reference-enterprise-plan','reference-org-management']),
 row('admin-seat',['シートを付与・解除する','Organization owner等の必要な管理権限。APIには対象操作の認証権限も必要。','指定した組織の利用者・チーム。','組織所属、直接付与かチーム経由か、解除の反映時点を確認します。機能ポリシーの無効化とは別です。'],['copilot-seat-api','admin-seat-assignment'],'一人の直接割り当てを解除するときに、組織全体の機能は無効にしません。',correct('q-d6-a05','q-fnd-seat-api-20261017')),
 row('admin-policy',['機能やモデルの利用可否を設定する','Enterprise owner、または判断を委任された組織のOrganization owner。','企業・組織の対象ポリシーと、資格の提供先。','上位で決定済みの対象ポリシーはOrgで上書きできません。すべての機能が同じ継承方式とは限りません。'],['feature-refresh-policies','policies','admin-policy-model'],'Orgの画面で選択できない場合は、企業側の決定と委任を確認します。',correct('q-d2-g18','q-d2-g19','q-d6-e06-ms-20261017')),
 row('admin-repo-exclusion',['repoのContent Exclusionを変更する','Repository admin。Maintainは閲覧のみ。','同じ企業内で、そのrepoを使うCopilot利用者の対応機能。','継承された除外は解除できませんが、repo固有の除外を追加できます。'],['exclusion','exclusion-concept'],'別組織のownerでも、対象repoでMaintainしか持たなければ編集できません。',correct('q-d1-e04-feature-20261016','q-d6-e04-feature-20261016-ms-20261017')),
 row('admin-org-exclusion',['組織・企業のContent Exclusionを変更する','Organization owner、Enterprise owner。','組織設定はその組織からシートを得る利用者。企業設定は企業のCopilot利用者全体。','repo所有者だけで適用先を判断しません。Agent等の非対応経路を、通常補完と同じに扱いません。'],['exclusion','exclusion-concept'],'シートの提供元が違う二人には、組織設定だけでは同じ除外が適用されない場合があります。',correct('q-d6-g01','q-sc01-2')),
 row('admin-auto-review',['対象PRの自動レビューを設定する','対象repo・組織のrulesetを管理できる権限。個人設定は本人。','指定するrepo・ブランチや、自分のPRなど、起動元ごとの範囲。','レビュー機能の利用許可とは別です。個人設定で、rulesetが有効にしたpush・draftレビューは無効化できません。'],['feature-refresh-review-config','policies'],'利用許可は有効なのに自動起動しない場合、ruleset等の対象条件を確認します。',scenario('q-d2-g21')),
 row('admin-org-metrics',['組織の利用レポートを閲覧する','Organization owner、View Organization Copilot Metricsを持つ利用者等。','対象組織のレポート。','API認証方式に合う権限も必要です。レポートの欠落だけで、シート未割り当てとは判断しません。'],['admin-usage-metrics','copilot-seat-api'],'活動を確認したいときは、資格一覧や監査イベントと区別します。',scenario('q-d6-a09-ms-20261017','q-d3-a13-ms-20261017')),
 row('admin-enterprise-metrics',['企業の利用レポートを閲覧する','Enterprise owner、billing manager、View Enterprise Copilot Metricsを持つ利用者等。','対象企業のレポート。','APIのトークン権限等も確認します。レポートを読めることから、シートや機能ポリシーも変更できるとは推測しません。'],['admin-usage-metrics']),
 row('admin-audit-read',['Enterprise監査ログを読む','Enterprise owner、Read enterprise audit logsのカスタムロール等。','対象企業の設定・資格変更や対応する活動イベント。','通常の監査ログと、利用レポートやクライアントの内容収集は別です。'],['admin-copilot-audit'],'ポリシーを変えた人と日時を調べる場合は、該当する監査イベントを照合します。',scenario('q-sc07-3','q-d6-f04')),
 row('admin-audit-stream',['Enterprise監査ログのストリームを設定する','Enterprise owner。','Enterpriseの監査ログを外部の対応先へ送る設定。','GitHub Enterprise Cloudの機能・利用条件を確認します。Copilotの全プランの利用者が設定できるわけではありません。'],['admin-audit-stream']),
],adminColumns)};

export const nextCandidates=[
 {id:'q-d2-g07',retainConcept:'旧エイリアスと現行CLIの識別',proposal:'旧ghcs/ghceを現行標準とせず、現行CLIの使い方を調べる入口まで問う案を検討する。',caution:'旧用語の基礎対応を維持できるか確認してから置換する。'},
 {id:'q-d2-g08',retainConcept:'CLIの実行許可・拒否',proposal:'一般的な仕組み名の識別から、特定操作だけを許可・拒否するコマンドの選択へ見直す。',caution:'既存の応用のGit許可・push拒否と同じ問題にせず、基礎の単一判断にする。'},
 {id:'q-d2-g09',retainConcept:'CLIのファイル参照範囲',proposal:'参照範囲を決める条件から、必要なディレクトリアクセスを指定する基本操作の判断へ見直す案を検討する。',caution:'追加フォルダーが扱えることと、全ファイルを保証して使うことを混同しない。'},
];
