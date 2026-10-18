// Individually authored corrections. Re-running uses the recorded before editions.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='content/gh300/2026-08-07/';
const reportPath='reports/admin-content-correction-2026-10-18.json';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const date='2026-10-18',revision='admin-content-correction-2026-10-18';
const paths={lessons:root+'lessons/seed.json',glossary:root+'glossary/terms.json',comparisons:root+'comparisons/guides.json',sources:root+'sources.json'};
const previous=fs.existsSync(reportPath)?read(reportPath):null;
const assets=Object.fromEntries(Object.entries(paths).map(([k,p])=>[k,read(p)]));
if(previous)for(const row of previous.changes){
  const list=assets[row.kind],i=list.findIndex(x=>x.id===row.id);
  assert(i>=0);assert.deepEqual(list[i],row.after,'Unreviewed edit: '+row.id);
  if(row.before)list[i]=row.before;else list.splice(i,1);
}
const originals=structuredClone(assets);
const changes=[];
function edit(kind,id,patch,reason,evidenceIds){
 const target=assets[kind].find(x=>x.id===id);assert(target,id);
 const before=structuredClone(target);Object.assign(target,patch);
 if(kind!=='sources')target.lastVerifiedAt=date;
 changes.push({kind,id,reason,evidenceIds,before,after:structuredClone(target)});
}
const section=(heading,content)=>({heading,content});
const governance=assets.lessons.find(x=>x.id==='lesson-d2-org-governance');
edit('lessons',governance.id,{
 summary:'Copilotの契約・利用資格・管理ロールを分け、組織ポリシー、シート管理、利用状況レポート、監査ログの役割を学びます。',
 estimatedMinutes:12,
 sections:[
  section('1. このLessonで分かること','「契約しているプラン」「利用資格を持つアカウント」「変更する人の権限」「機能の利用許可」は別の条件です。これらを分けて、シートの割り当て、ポリシー設定、活動の確認に適した操作を判断します。'),
  section('2. 契約・認証・組織のシートを分ける','Business/Enterpriseを組織から利用する場合は、その利用者にシートなどのアクセス付与が必要です。GitHubへサインインできることだけでは、その組織からCopilotの利用資格を得たことになりません。一方、組織のシートがない人にも、個人向けFreeや有料の個人プランという別の利用方法があります。「組織のシートがない＝Copilotを一切使えない」とは判断しません。'),
  section('3. 誰が、どの範囲を管理するか','Organization ownerは自組織のCopilotアクセスやポリシーを管理します。Enterprise ownerは企業内の組織への提供や企業ポリシーを管理します。Repository adminが設定できるリポジトリのContent Exclusionは、組織のシート管理とは別です。Copilot Enterpriseはプラン名、Enterprise ownerはロール名であり、契約しただけで利用者に管理権限が付くわけではありません。委任された権限やAPIの認証権限は、操作ごとの公式条件を確認します。'),
  section('4. ポリシーの強制と委任','対象の機能ポリシーをEnterprise側で有効・無効などに決定した場合、Organization側から上書きできません。組織へ判断を委任した場合は、その組織で選択できます。ただし、すべての設定が同じ三段階の階層や同じ選択肢を持つわけではありません。多くのポリシーはライセンスの提供元に従い、複数の提供元や機能固有の例外もあるため、対象の機能と適用先を確認します。'),
  section('5. 購読・シートを確認するAPI','GET /orgs/{org}/copilot/billing は、組織の購読、シート内訳、機能ポリシー等を確認する例です。取得できることから、同じAPIで機能ポリシーを書き換えられるとは考えません。GET /orgs/{org}/copilot/billing/seats は、現在の割り当て一覧の取得に使います。シートの活動時刻にはIDEテレメトリー等の収集条件が関係するため、活動が見えないことを未割り当ての証拠にはしません。'),
  section('6. シートを変更するAPIと必要権限','選択した利用者への付与には POST /orgs/{org}/copilot/billing/selected_users、解除の予約には同じパスへのDELETEを使います。対象はselected_usernamesで指定します。解除は即時停止と決めつけず、請求期間末やチーム経由の資格が残る条件を確認します。公式のuser management APIはPublic previewです。OAuth等のスコープとfine-grained権限は別の認証方式の条件なので、利用する方式に合わせます。例えばシート一覧ではread:org等、付与・解除ではmanage_billing:copilotまたはadmin:orgが挙げられています。fine-grained方式ではGitHub Copilot BusinessまたはAdministrationのread/writeなど、各エンドポイントが要求する組織権限を確認します。'),
  section('7. 利用状況はレポートから確認する','利用状況の取得例は GET /orgs/{org}/copilot/metrics/reports/organization-1-day?day=YYYY-MM-DD です。応答のdownload_linksからレポートを取得し、対象日の活動や導入状況を調べます。最初の応答そのものに採用率などの集計値が入るとは説明しません。Organization ownerやView Organization Copilot Metricsを持つ利用者等が対象となり、トークンの権限も必要です。組織集計だけでなく利用者別のレポートもあるので、取得できる粒度と収集条件を確認します。'),
  section('8. 監査ログと活動データの違い','監査ログでは、設定変更やライセンス付与などのイベントのaction、actor、日時を確認します。例はcopilot.cfb_org_settings_changedとcopilot.cfb_seat_assignment_createdです。チーム経由の付与では、シート追加イベントのactorをメンバー変更者と即断せず、関連イベントを照合します。Enterprise監査ログの閲覧はEnterprise ownerやRead enterprise audit logsのカスタムロール等が対象です。クライアントへ入力したプロンプト全文を読む仕組みとは異なり、別途設定された監視・hooksの内容収集とは区別します。'),
  section('9. 試験向けシナリオと確認順序','入社者に資格を付与したいならシート管理、実際の利用を知りたいなら利用状況レポート、設定を変えた人を調べたいなら監査ログを使います。利用できない場合は、対象アカウントの資格、上位・組織のポリシー、対象環境の対応、クライアント設定を分けて調べます。自動レビューでは、レビュー機能の利用許可と、ruleset等の自動起動設定も別に確認します。'),
  section('10. 30秒チェック（Mini Review）','Q1: 組織のシートがない人はCopilotを一切使えないか？ → No。個人プランの資格とは別です。\nQ2: 現在のシート割り当てと実際の活動は同じ情報か？ → No。割り当て一覧と活動レポートを区別します。\nQ3: 日次レポートAPIの最初の応答から何を得るか？ → レポートのダウンロードリンク等です。\nQ4: ポリシーを変更したアカウントを調べる情報源は？ → 監査ログです。'),
 ],
 keyPoints:['認証、利用資格、管理ロール、機能の利用許可を分ける。','シートの割り当て一覧、活動レポート、監査イベントは目的が異なる。','Enterpriseで決定した対象ポリシーはOrgで上書きできない。全設定が同じ継承方式とは限らない。','APIはHTTPメソッド、対象パス、返却内容、認証方式ごとの権限を確認する。'],
 commonMistakes:['組織のシートがない人は個人プランでも利用できないと思うこと。','利用統計がないことからシート未割り当てと判断すること。','購読設定を取得するAPIで、すべての機能設定も変更できると思うこと。'],
 examTips:['操作の目的が資格の変更、活動の確認、変更履歴の追跡のどれかを先に判断します。','プラン名と管理ロールを区別し、誰がどの範囲を変更する問題かを読み取ります。'],
 sourceIds:[...new Set([...governance.sourceIds,'copilot-seat-api','admin-usage-metrics','admin-policy-model','feature-refresh-policies','admin-copilot-audit','admin-audit-events'])],
},'利用資格・ロール・API・監査の一般化と古いusage例を訂正',['plans','copilot-seat-api','admin-usage-metrics','admin-policy-model','admin-copilot-audit','admin-audit-events']);
const review=assets.lessons.find(x=>x.id==='lesson-d2-pr-code-review');
const reviewSections=structuredClone(review.sections);
reviewSections[2]=section('3. 利用許可と自動レビューの起動を分ける','組織のCopilotポリシーでレビュー機能を利用できるかを管理することと、PRを自動レビューする条件を設定することは別です。リポジトリや組織のrulesetではAutomatically request Copilot code reviewを使い、対象リポジトリ・ブランチや新しいpush、draftの扱いを設定します。個人設定による自動レビューもあり、各起動元は独立して評価されます。設定を変更するには、そのrepoや組織のrulesetを管理する権限が必要です。レビュー指摘や修正提案は、内容を検証してから適用します。');
reviewSections[4]=section('5. Limitations & Considerations','Copilotの指摘は誤る場合があります。人間が内容を検証し、組織が定めたレビュー・マージ要件を満たします。Copilotによる承認は2026年9月1日追加のPublic previewで、承認を出す設定とマージ要件へ数える設定は別です。「Copilotは承認できない」とも「承認が出れば人の必須レビューは不要」とも一般化しません。');
reviewSections[5]=section('6. 30秒チェック（Mini Review）','Q1: PR本文の概要を生成する機能は？ → Pull Request Summaries。\nQ2: レビューの利用許可だけで全PRの自動レビューは設定できるか？ → No。ruleset等の起動条件も設定します。\nQ3: Copilotの承認が出れば、人の必須レビューを省略できるか？ → No。別途定めた要件を満たします。');
edit('lessons',review.id,{sections:reviewSections,keyPoints:['PR Summariesは概要作成、Code Reviewは変更差分の分析を支援する。','レビュー機能の利用許可と、ruleset・個人設定による自動起動を分ける。','Copilotの指摘は人間が検証し、承認の算入と人の必須要件も区別する。'],examTips:['「変更の概要」と「差分の指摘」の目的を区別します。','自動レビューの問題は、利用許可・起動元・対象範囲を確認します。'],sourceIds:[...review.sourceIds,'feature-refresh-review-config','alignment-approvals-release']},'利用ポリシーとrulesetを分離し、承認を常に人間だけとする記述も整合',['policies','feature-refresh-review-config','alignment-approvals-release']);
const exclusion=assets.lessons.find(x=>x.id==='lesson-d6-content-exclusion-setup');
edit('lessons',exclusion.id,{
 summary:'Content Exclusionの対応範囲、設定する人、資格の提供元による適用先、repo・組織・Enterpriseの設定構文を区別して学びます。',
 sections:[
  section('1. このLessonで分かること','Content ExclusionはBusiness/Enterprise向けの設定です。どの利用者に、どのファイルの除外を適用するかを確認します。設定の変更権限と、実際に利用するCopilot機能の対応範囲を分けて考えます。'),
  section('2. 対応機能と参照経路','指定したファイルを、対応するCopilot機能の入力文脈から除外します。VS Codeでは通常補完やChatのAskでの直接参照と、非対応のEdit・Agentモードを区別します。IDEが間接的に渡す型情報等やsymlinkにも制約があり、全経路を遮断する保証ではありません。CLIには公式ページ間の説明差があるため、別の制限を当てにせず、使用環境と対象経路を確認します。'),
  section('3. 設定する人と適用される利用者','Repository adminはrepo内の除外を設定できます。Maintainは閲覧できますが編集できません。repo単位の設定は、その企業内のCopilot利用者が対象repoで作業する範囲へ適用されます。Organization ownerの設定は、その組織からシートを得た利用者が対象です。Enterprise ownerの除外設定は、その企業のCopilot利用者全体へ適用されます。組織の設定だけで、他組織から資格を得た利用者まで同じように除外されるとは判断しません。'),
  section('4. 除外の追加と解除を区別する','repoの画面に継承された組織等の除外が表示されても、Repository adminはその除外を編集・解除できません。一方で、repo固有の除外パスを追加できます。上位の設定があることを、repo設定の追加自体が禁止される意味に取り違えないでください。'),
  section('5. パス指定の例','組織からシートを得る利用者について、Git管理内外の.envや.env.productionを通常補完から除外したい場合、Organization ownerは組織のContent exclusionで "*": ["**/.env*"] と指定できます。特定repoだけを対象とする場合は、repo参照をキーにして除外パスの配列を記載します。repo設定では - "/private/**" のようにパスを列挙します。組織用のrepoキーとrepo内のパス指定を混同しません。'),
  section('6. 設定後の確認','パターンは大文字小文字を区別しません。先頭の/やワイルドカードの範囲を確認し、除外対象と対象外のファイルで動作を比べます。既に読み込まれたIDEへの反映には最大30分かかる場合があり、VS CodeではDeveloper: Reload Windowで再読み込みできます。'),
  section('7. 30秒チェック（Mini Review）','Q1: Maintainロールでrepoの除外を編集できるか？ → No。閲覧のみです。\nQ2: 組織の除外があると、repo固有の除外も追加できないか？ → No。継承ルールを解除できないこととは別です。\nQ3: 組織設定の対象利用者は？ → その組織からシートを得る利用者です。\nQ4: 設定すればAgentにも必ず効くか？ → No。対応機能と参照経路を確認します。'),
 ],
 keyPoints:['設定する人の権限と、除外が適用される利用者・repoの範囲を分ける。','継承された除外はrepo側で解除できないが、repo固有の除外は追加できる。','組織設定はその組織の管理対象Seat、Enterprise設定は企業のCopilot利用者を対象とする。','対応機能の制約、パターン、反映を確認し、すべての参照経路の遮断と一般化しない。'],
 commonMistakes:['Organization ownerなら別の組織のrepoでも除外を変更できると思うこと。','組織が所有するrepoだけを見て、シート提供元の違いを見落とすこと。','上位の除外を解除できないことと、repoで追加できないことを混同すること。'],
 examTips:['「設定できる人」「資格の提供元」「対象repo」「使用機能」を順に整理します。','Content Exclusionは入力側の除外であり、公開コード一致の出力制御とは別です。'],
 sourceIds:[...exclusion.sourceIds,'exclusion-concept','cli-exclusion-admin'],
},'権限・利用者・対象repo・対応機能の範囲と構文を訂正',['exclusion','exclusion-concept','cli-exclusion-admin']);

const termEdits={
 'g-seat-management':{
  shortDefinition:'組織が提供するCopilotの利用資格を、利用者やチームへのシート割り当てとして管理すること。',
  detailedDefinition:'Business/Enterpriseを組織から利用する場合、Organization owner等の必要な権限を持つ担当者が、ユーザーやチームへのアクセスを管理します。組織シートがないことは、個人Free等の別の資格でもCopilotを使えないという意味ではありません。APIでの付与・解除には、エンドポイントの条件と認証方式ごとの権限が必要です。解除予約の時点と実際に資格を失う時点、チーム経由で残る資格も区別します。',
  examPoints:['組織提供の資格と、GitHubへのサインイン・個人プランの資格は別である。','シートの割り当てと実際の利用状況は別のデータで確認する。','APIでシートを変更するには対象組織と認証方式に合う書込権限等が必要である。'],
  commonConfusions:['組織に所属するだけでCopilotの資格も付与されると思うこと。','組織のシート解除だけで、その人のあらゆるCopilot利用が直ちに停止すると考えること。'],
  sourceIds:['copilot-seat-api','plans'],
 },
 'g-usage-metrics-api':{
  shortDefinition:'Copilotの活動・導入状況を、組織集計や利用者別レポートとして取得するREST API。',
  detailedDefinition:'GET /orgs/{org}/copilot/metrics/reports/organization-1-day?day=YYYY-MM-DD は日次レポートの取得例です。応答のdownload_linksから実際のレポートを取得します。組織集計のほか利用者別のレポートもあります。シートの割り当て一覧とは目的が異なり、活動の欠落だけで利用資格を判断しません。Organization ownerやView Organization Copilot Metricsを持つ利用者等と、必要なトークン権限を確認します。',
  examPoints:['購読・シート管理、活動レポート、監査イベントを区別する。','日次レポートAPIはダウンロードリンク等を返す。','組織集計か利用者別か、対象期間・権限・収集条件を確認する。'],
  useCases:['活動や機能別の利用状況をレポートから分析する。','利用者別の活動傾向とシート割り当てを別々に確認する。'],
  commonConfusions:['活動データがない利用者をシート未割り当てと判断すること。','利用者別レポートがあることから、プロンプト全文も取得できると思うこと。'],
  sourceIds:['admin-usage-metrics','copilot-metrics-data','copilot-seat-api'],
 },
 'g-org-policies':{
  shortDefinition:'Organization ownerが、組織からCopilotの資格を得る利用者の機能・モデル等を管理する設定。',
  detailedDefinition:'Organization ownerはBusiness/Enterpriseの組織ポリシーを管理します。Enterpriseで対象ポリシーを決定している場合は上書きできず、組織へ判断を委任されている場合に選択できます。通常はライセンスの提供元が適用先を決めますが、全利用者を対象とする設定等の例外もあります。機能の利用許可と、自動レビューを起動するrulesetは別の設定です。',
  examPoints:['対象ポリシーをEnterprise側で決定していればOrgから上書きできない。','通常の適用先は、その組織から資格を得る利用者である。','機能の利用許可だけで、個別の自動起動条件まで決まるわけではない。'],
  sourceIds:['policies','admin-policy-model'],
 },
 'g-enterprise-policies':{
  shortDefinition:'Enterprise ownerが、企業内のCopilotの機能やモデル等の利用方針を管理する設定。',
  detailedDefinition:'Enterprise ownerは対象機能の利用方針を企業側で決めるか、Organizationへ判断を委任できます。企業側で決定した対象ポリシーをOrg側で上書きすることはできません。Copilot Enterpriseというプラン名とEnterprise ownerという管理ロールは別です。利用できる選択肢や適用先はポリシーごとに確認し、全設定に同じ三段階の継承を当てはめません。',
  examPoints:['企業側で決定した対象ポリシーはOrg側で上書きできない。','組織への委任と、企業で方針を決めることを区別する。','Copilot Businessでも企業ポリシーの対象となり得る。プラン名とロールを混同しない。'],
  sourceIds:['feature-refresh-policies','admin-policy-model'],
 },
 'g-policy-inheritance':{
  term:'Copilot Policy Enforcement and Delegation',fullName:'Copilotポリシーの強制と委任',
  aliases:['ポリシー継承','階層的ガバナンス','Policy Inheritance (Enterprise -> Org -> Repo)'],
  shortDefinition:'対象ポリシーを上位のEnterpriseで決定するか、Organizationへ判断を委任するかを分ける仕組み。',
  detailedDefinition:'Enterpriseで決定された機能ポリシーをOrganization側で上書きすることはできません。組織へ委任されていれば、その組織で判断します。ただし、すべての機能にrepoを含む同一の階層があるわけではありません。複数のライセンス提供元や設定の種類によっても適用規則が異なります。Content Exclusionの追加・解除やレビュー起動元の評価は、それぞれの公式規則に従います。',
  examPoints:['上位で決定された対象ポリシーと、組織へ委任されたポリシーを区別する。','全設定がEnterprise→Org→Repoという同じ継承方式とは限らない。','ライセンスの提供元と使用機能を特定して実効設定を確認する。'],
  whyItMatters:'上位の制限、組織への委任、機能固有の設定規則を分けて、変更できない原因を判断するために重要。',
  useCases:['Orgで選択できない機能のEnterprise設定を確認する。','repoの除外追加と、継承された除外の解除を区別する。'],
  sourceIds:['admin-policy-model','policies','feature-refresh-policies','exclusion'],
 },
 'g-code-review-policies':{
  shortDefinition:'Copilot code reviewの利用許可を管理する設定。自動レビューの起動条件とは区別する。',
  detailedDefinition:'Organization ownerは組織ポリシーでCopilot code reviewの利用可否を管理します。特定のrepoやブランチで自動レビューを起動する条件は、ruleset等で別に設定します。個人の自動レビュー設定もあり、rulesetと独立して評価されます。利用許可を有効にしただけで、全PRの自動レビューが設定済みになるわけではありません。',
  whyItMatters:'レビュー機能の利用許可、自動起動、対象repo・ブランチを分けて判断するために重要。',
  useCases:['組織でレビュー機能を利用できるようにする。','repoや組織のrulesetで自動レビューの対象を設定する。'],
  examPoints:['利用許可とrulesetによる自動起動は別の設定である。','個人設定で、rulesetが有効にしたpush・draftのレビューを無効化することはできない。'],
  commonConfusions:['機能ポリシーを有効にすれば、すべてのPRが自動レビューされると思うこと。'],
  sourceIds:['policies','feature-refresh-review-config','code-review'],
 },
 'g-audit-logs':{
  detailedDefinition:'設定やライセンス等の変更をaction、actor、日時から追跡する記録です。例はcopilot.cfb_org_settings_changedとcopilot.cfb_seat_assignment_createdです。チーム経由の付与では関連イベントも照合します。Enterprise監査ログはEnterprise ownerやRead enterprise audit logsのカスタムロール等が閲覧します。クライアントのプロンプト全文は通常の監査ログに含まれず、別の監視設定とは区別します。',
  examPoints:['設定・ライセンスの変更イベントと実行者・日時を確認する。','Enterpriseの長期保存には、Enterprise ownerが設定する監査ログのストリーミング等を利用できる。全プラン共通とは考えない。','活動レポートやクライアントの内容収集とは別の仕組みである。'],
  sourceIds:['audit-log','admin-copilot-audit','admin-audit-events','admin-audit-stream','admin-seat-assignment'],
 },
 'g-repo-content-exclusion':{
  detailedDefinition:'Repository adminはrepo内の除外パスを追加・変更できます。Maintainロールは閲覧のみです。repo単位の設定は、その企業内のCopilot利用者が対象repoで作業する範囲へ適用されます。継承された組織等の除外をrepo側で解除することはできませんが、repo固有の除外を追加することはできます。',
  examPoints:['Repository adminは設定を変更でき、Maintainは閲覧のみである。','継承された除外の解除と、repo固有の除外の追加を区別する。','対応する機能と対象利用者の範囲を確認する。'],
  sourceIds:['exclusion','exclusion-concept'],
 },
 'g-org-content-exclusion':{
  shortDefinition:'Organization ownerが、その組織からCopilotシートを得る利用者へ設定するファイル・repoの除外ルール。',
  detailedDefinition:'組織のContent exclusionで、repoの参照をキーにしたパス配列や、"*": ["**/.env*"]のような指定を使います。適用先はその組織の管理対象Seatの利用者であり、他組織が資格を提供する人にも一律に効くとは判断しません。Enterprise ownerが企業側で設定した除外は、その企業のCopilot利用者全体が対象です。repo側で継承ルールを解除することと、独自の除外を追加することは別です。',
  useCases:['組織の管理対象Seatの利用者について、Git管理内外の.envを通常補完から除外する。','指定repoの機密パスを、組織の管理対象利用者の入力文脈から除外する。'],
  examPoints:['組織設定の適用先は、その組織からシートを得る利用者である。','repoの参照とパス配列を分けて指定する。','企業全体と組織の管理対象Seat、repoの範囲を区別する。'],
  sourceIds:['exclusion','exclusion-concept'],
 },
 'g-copilot-code-review':{
  detailedDefinition:'PRの変更差分などを分析し、問題の指摘や修正案を提示する機能です。利用許可を管理するポリシーと、repo・組織のrulesetや個人設定で自動起動する条件は別です。Copilotによる承認は2026年9月1日追加のPublic previewで、承認の生成とマージ要件への算入も別の設定です。出力を検証し、組織が維持する人のレビュー要件も満たします。',
  examPoints:['PRの差分に対して指摘や修正案を提示できる。','利用許可、自動レビューの起動、承認の算入は別の設定である。','Copilotの承認が出ても、人の必須レビューが不要とは判断しない。'],
  sourceIds:['code-review','policies','feature-refresh-review-config','alignment-approvals-release'],
 },
 'g-content-exclusion':{
  shortDefinition:'指定ファイルやパスを、対応するCopilot機能の入力文脈から除外するBusiness/Enterprise向け設定。',
  detailedDefinition:'Repository admin、Organization owner、Enterprise ownerが各範囲で設定します。通常補完や対応するChatからの直接参照と、非対応のEdit・AgentモードやIDEが間接的に渡す型情報を分けます。CLIは公式ページ間に説明差があるため、利用環境と参照経路を確認します。組織の設定はその組織から資格を得る利用者、企業の設定は企業のCopilot利用者が対象です。全機能・全経路の遮断を保証する設定ではありません。',
  examPoints:['設定権限、利用資格の提供元、対象repo、使用機能を確認する。','対応する通常補完では、除外対象ファイルで補完が無効になる。','CLIやAgentへの適用を通常補完と同じと推測しない。','IDEへ読み込まれた設定の変更反映には最大30分かかる場合がある。'],
  sourceIds:['exclusion','exclusion-concept','cli-exclusion-admin'],
 },
};
for(const [id,patch] of Object.entries(termEdits))edit('glossary',id,patch,'Lessonと同じ適用条件・権限・取得目的に統一',patch.sourceIds);
const cmp=assets.comparisons.find(x=>x.id==='cmp-org-vs-enterprise-policies');
edit('comparisons',cmp.id,{
 summary:'企業側で決定するCopilotポリシーと、組織へ委任して決めるポリシーを比較します。プラン名、管理ロール、設定の適用先を分けて理解します。',
 comparisonAxes:[
  {axis:'設定を管理する人と対象',values:['Enterprise: Enterprise ownerが企業側の対象ポリシーを管理する。','Organization: Organization ownerが自組織の対象ポリシーを管理する。']},
  {axis:'決定と委任',values:['Enterprise: 対象ポリシーを企業で決めるか、組織へ判断を委任する。','Organization: 企業で決定済みの対象ポリシーは上書きできず、委任されたものを選択する。']},
  {axis:'適用先の確認',values:['Enterprise: 通常は企業から資格を得る利用者が対象。機能固有の例外も確認する。','Organization: 通常は組織から資格を得る利用者が対象。repoの所有関係だけで判断しない。']},
  {axis:'別に扱う設定',values:['Enterprise: プラン名や企業アカウントがあることだけで、利用者へowner権限は付かない。','Organization: レビューの利用許可とrulesetによる自動起動、除外の追加と解除はそれぞれ区別する。']},
 ],
 decisionGuide:['Orgで対象機能を変更できない → Enterprise側で方針が決定済みか、組織へ委任されているかを確認する。','自動レビューを全対象PRへ設定したい → 利用許可に加え、対象repo・ブランチのruleset等を確認する。'],
 commonTraps:['すべての設定がEnterprise→Org→Repoという同じ継承方式だと思うこと。','Copilot Enterpriseを契約すれば、全利用者がEnterprise ownerになると思うこと。'],
 examTips:['対象機能、管理ロール、資格の提供元、上位での決定か委任かを順に確認します。'],
 sourceIds:['policies','feature-refresh-policies','admin-policy-model','feature-refresh-review-config'],
},'単一の階層図による一般化を除き、決定・委任・適用先を比較',['policies','feature-refresh-policies','admin-policy-model','feature-refresh-review-config']);

const summaryComparison=assets.comparisons.find(x=>x.id==='cmp-review-vs-summary');
const summaryAxes=structuredClone(summaryComparison.comparisonAxes);
summaryAxes[1].values[0]='Code Review: 潜在的な問題の発見や改善を支援する。指摘の正確性は人間が検証する。';
summaryAxes[2].values[0]='Code Review: 利用許可を確認し、rulesetや個人設定で自動レビューの起動条件を設定する。';
edit('comparisons',summaryComparison.id,{comparisonAxes:summaryAxes,sourceIds:[...summaryComparison.sourceIds,'feature-refresh-review-config']},'関連比較にも残っていたポリシーだけで自動起動できる説明を訂正',['feature-refresh-review-config','code-review']);
const newSources=[
 ['admin-usage-metrics','REST API endpoints for Copilot usage metrics','https://docs.github.com/en/rest/copilot/copilot-usage-metrics'],
 ['admin-policy-model','GitHub Copilot policies for enterprises and organizations','https://docs.github.com/en/copilot/concepts/enterprise/policies'],
 ['admin-copilot-audit','Reviewing audit logs for GitHub Copilot','https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/review-audit-logs'],
 ['admin-audit-events','Audit log events for your organization','https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/audit-log-events-for-your-organization'],
 ['admin-audit-stream','Streaming the audit log for your enterprise','https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise'],
 ['admin-seat-assignment','GitHub Copilot seat assignment','https://docs.github.com/en/copilot/reference/copilot-billing/seat-assignment'],
];
for(const [id,title,url] of newSources){assert(!assets.sources.some(s=>s.id===id));assets.sources.push({id,title,url,publisher:'GitHub Docs',sourceType:'reference',syllabusVersion:'2026-08-07',status:'verified'});}
const seed=read(root+'questions/seed.json'),oldDetails=read(root+'questions/answer-explanations.json');
const questionEdits=[
 {id:'q-d2-g21',question:'組織からCopilotの利用資格を得ているメンバーについて、PRの差分をAIが調べて改善点を指摘する機能の利用可否を設定します。自動レビューの起動条件は別に設定するとき、対象となる管理ポリシーはどれですか？',explanation:'レビュー機能の利用許可を管理する。自動起動の条件はruleset等で別に設定する。',why:'今回は、PRの差分を分析して改善点を指摘するレビュー機能を、組織の利用者に許可するかを尋ねています。そのため、対象はCode Review Policiesです。変更要約、入力ファイルの除外、公開コード一致の制御とは目的が異なります。\n\n機能を利用できることと、自動でレビューを依頼することは別です。自動起動には対象repoやブランチのruleset、個人設定などを確認します。利用許可だけを有効にしても、全PRの自動レビューを設定したことにはなりません。',sources:['policies','feature-refresh-review-config']},
 {id:'q-d6-g01',question:'あるOrganizationからCopilotシートを得る利用者について、複数の作業リポジトリ内の機密ファイルを通常のコード補完の入力から除外します。その組織のownerが一元設定し、リポジトリ側ではそのルールを解除できないようにする場合、使う設定レベルはどれですか？',explanation:'その組織からシートを得る利用者へ、組織レベルの除外を設定する。',why:'この設問では、対象利用者のシート提供元と、設定する人のOrganizationをそろえています。複数の作業repoで対象パスを除外するため、Organization Content Exclusionを使います。repoごとに設定する方法や、生成指示を書く方法とは異なります。\n\n組織の設定があるからといって、その組織が所有するrepoの全利用者に一律で同じ条件が適用されるとは判断しません。また、repo側で組織の除外を解除できないことと、repo固有の除外を追加できることは別です。通常補完以外へも同じように効くとは推測せず、使用機能を確認します。',sources:['exclusion','exclusion-concept']},
 {id:'q-d6-a05',question:'Organization ownerが、ユーザー単位で直接Copilotシートを割り当てた開発者1名について、その割り当てを解除します。チーム経由の割り当てはなく、他のメンバーの利用は継続させます。組織の管理画面で直接変更すべき操作対象はどれですか？',explanation:'対象者への直接のシート割り当てを解除する。組織全体の機能やrepoの権限は変えない。',why:'変更する対象は、その利用者へのCopilotシート割り当てです。ユーザー単位で直接付与され、チーム経由の資格もないと条件を明示しているため、その割り当てを解除します。組織全体の機能ポリシーを無効にすると、他のメンバーにも影響します。\n\nContent Exclusionは入力ファイルの除外、repoのロール変更はGitHub上のアクセス管理であり、Copilotのシート解除とは別です。解除の操作と利用資格を失う時点も分け、実際の反映や請求条件を確認します。この組織の割り当てを解除することから、他の資格による利用まで停止すると一般化しません。',sources:['copilot-seat-api','admin-seat-assignment']},
 {id:'q-d2-g18',question:'Organization ownerが、その組織からCopilotの利用資格を得るメンバーに対して、公開コード一致提案の扱いや機能の利用可否を設定します。対象機能の判断はEnterpriseから組織へ委任されています。この範囲の管理設定はどれですか？',explanation:'組織へ委任された対象機能を、組織の管理対象利用者について設定する。',why:'対象は、同じ組織からCopilotの資格を得る利用者で、対象機能の判断も企業側から組織へ委任されています。Organization ownerがこの範囲を管理するので、Organization Policiesが適切です。repo内の指示ファイルや個人設定では、この組織の機能許可を管理できません。\n\nもしEnterprise側が対象ポリシーを決定済みなら、組織側で上書きすることはできません。今回のように委任されている条件と区別します。また、組織のポリシーを、その組織が所有するrepoの全利用者へ無条件に適用するものとは考えません。',sources:['policies','admin-policy-model']},
];
const contract=q=>JSON.stringify({id:q.id,question:q.question,choices:q.choices,answer:q.answer,difficulty:q.difficulty,type:q.type,status:q.status,domainId:q.domainId,objectiveId:q.objectiveId,explanation:q.explanation,choiceExplanations:q.choiceExplanations,sourceIds:q.sourceIds,contentRevision:q.contentRevision});
const questionRows=questionEdits.map(edit=>{
 const before=seed.find(q=>q.id===edit.id);assert(before);
 const after=structuredClone(before);after.question=edit.question;after.explanation=edit.explanation;after.choiceExplanations[before.answer[0]]=edit.explanation;
 after.sourceIds=[...new Set([...after.sourceIds,...edit.sources])];after.contentRevision=revision;after.lastVerifiedAt=date;
 after.trustedSourceFacts=Object.values(after.choiceExplanations);after.clues=[];
 for(const c of after.choices)after.choiceQuality[c.id]={...after.choiceQuality[c.id],sourceIds:after.sourceIds,rationale:after.choiceExplanations[c.id]};
 after.requirementMapping=[{requirement:after.question,correctReason:after.explanation,distractorFailures:Object.fromEntries(after.choices.filter(c=>!after.answer.includes(c.id)).map(c=>[c.id,after.choiceExplanations[c.id]]))}];
 return {id:edit.id,revision,beforeContract:contract(before),afterContract:contract(after),beforeFingerprint:hash(before),afterFingerprint:hash(after),invalidatePreviousSnapshots:false,after,displayedExplanation:edit.why,
  before,previousDisplayedExplanation:oldDetails.questions.find(q=>q.id===edit.id)?.text??before.explanation,
  review:{reason:'教材訂正に伴う適用条件の明確化。正解・四択・分類は維持。',blindCheck:'四択は既存の管理対象を並列に記載したまま。本文の対象機能・利用資格・設定主体から判断する。',difficulty:'基本的な管理対象の識別を問う基礎を維持。API構文や複数ロールの複合判断は追加しない。'},evidenceIds:edit.sources};
});
for(const source of assets.sources){
 const refs=changes.filter(c=>c.kind!=='sources'&&c.after.sourceIds?.includes(source.id));
 const qrefs=questionRows.filter(q=>q.after.sourceIds.includes(source.id));
 if(!refs.length&&!qrefs.length)continue;
 const before=originals.sources.find(s=>s.id===source.id)??null;
 source.lastCheckedAt=date;source.lastVerifiedAt=date;
 const unique=values=>[...new Set(values.filter(Boolean))];
 for(const [kind,key] of [['lessons','relatedLessonIds'],['glossary','relatedGlossaryIds'],['comparisons','relatedComparisonIds']])source[key]=unique([...(source[key]??[]),...refs.filter(c=>c.kind===kind).map(c=>c.id)]);
 source.relatedQuestionIds=unique([...(source.relatedQuestionIds??[]),...qrefs.map(q=>q.id)]);
 source.relatedDomainIds=unique([...(source.relatedDomainIds??[]),...refs.flatMap(c=>c.after.domainIds??[c.after.domainId]),...qrefs.map(q=>q.after.domainId)]);
 source.relatedObjectiveIds=unique([...(source.relatedObjectiveIds??[]),...refs.flatMap(c=>c.after.objectiveIds??[]),...qrefs.map(q=>q.after.objectiveId)]);
 changes.push({kind:'sources',id:source.id,reason:before?'今回の訂正に用いた出典・逆参照・確認日を更新':'訂正を直接支える公式資料を追加',evidenceIds:[source.id],before,after:structuredClone(source)});
}
const officialRevisions=read(root+'questions/official-alignment-revisions.json');
const excluded=new Set([...read(root+'questions/selection-exclusions.json').questions,...read(root+'questions/removals.json').questions].map(q=>q.id));
const current=seed.map(q=>officialRevisions.questions.find(r=>r.id===q.id)?.after??q).filter(q=>!excluded.has(q.id)&&q.status==='verified');
const tally=key=>current.reduce((a,q)=>(a[q[key]]=(a[q[key]]??0)+1,a),{});
const beforeFingerprints=Object.fromEntries(Object.entries(originals).map(([k,v])=>[k,Object.fromEntries(v.map(x=>[x.id,hash(x)]))]));
if(previous)assert.deepEqual(beforeFingerprints,previous.beforeFingerprints);
const changedQuestionIds=new Set(questionRows.map(q=>q.id));
const linkedQuestionIds=new Set(changes.filter(c=>c.kind==='glossary').flatMap(c=>c.after.questionIds??[]));
const relatedQuestionReview=current.filter(q=>linkedQuestionIds.has(q.id)||/シート|管理者|owner|ポリシー|REST API|監査|除外ルール|Copilot Business|Enterprise/.test(q.question)).map(q=>({
 id:q.id,decision:changedQuestionIds.has(q.id)?'CLARIFIED_WITH_SAME_KEY':'RETAINED',
 reason:changedQuestionIds.has(q.id)?'利用資格・設定主体・利用許可と自動起動の条件を明記。正解と四択は維持。':'今回の利用資格・管理範囲・API・監査の訂正と直接矛盾する説明は確認されず。難易度の再認定ではない。',
}));
const report={reviewedAt:date,revision,scope:'管理教材の訂正。新規増問・総合コマンド表の拡張は含まない。',
 baselineSeedFingerprint:hash(seed),baselineDetailsFingerprint:hash(oldDetails),baselineOfficialRevisionFingerprint:hash(officialRevisions),beforeFingerprints,
 counts:{eligible:current.length,byDifficulty:tally('difficulty'),byDomain:tally('domainId')},changes,questions:questionRows,relatedQuestionReview,
 reviewedUnchanged:['g-subscription-plans'],
 limitations:['全問の再評価や実試験の出題頻度の証明ではない。','CLIの除外についての公式資料間の差は断定せずに維持する。','プラン・ロールの総合比較とCLIコマンド表は後続段階。'],
};
write(reportPath,report);
write(root+'questions/admin-content-revisions.json',{revision,questions:questionRows.map(({before,previousDisplayedExplanation,...r})=>r)});
for(const [kind,path] of Object.entries(paths))write(path,assets[kind]);
console.log(`Published ${changes.filter(c=>c.kind!=='sources').length} learning items, ${questionRows.length} existing question editions; ${current.length} eligible questions retained.`);
