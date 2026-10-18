import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {cliSections,planSection,adminSection,nextCandidates} from './reference-table-content-2026-10-18.mjs';
const root='content/gh300/2026-08-07/',path='reports/cli-admin-reference-expansion-2026-10-18.json';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const paths={lessons:root+'lessons/seed.json',glossary:root+'glossary/terms.json',comparisons:root+'comparisons/guides.json',sources:root+'sources.json'};
const assets=Object.fromEntries(Object.entries(paths).map(([k,p])=>[k,read(p)]));
const previous=fs.existsSync(path)?read(path):null;
if(previous)for(const row of previous.changes){
 const list=assets[row.kind],index=list.findIndex(x=>x.id===row.id);assert(index>=0,row.id);
 assert.deepEqual(list[index],row.after,'Unreviewed edits to '+row.id);
 if(row.before)list[index]=row.before;else list.splice(index,1);
}
const originals=structuredClone(assets),changes=[];
const edit=(kind,id,patch,reason)=>{
 const target=assets[kind].find(x=>x.id===id);assert(target,id);
 const before=structuredClone(target);Object.assign(target,patch);target.lastVerifiedAt='2026-10-18';
 changes.push({kind,id,reason,before,after:structuredClone(target)});
};
const coverage=[];
function sectionData(section,lessonId){
 if(!section.table)return section;
 return {...section,table:{...section.table,rows:section.table.rows.map(({coverage:links,...row})=>{
  const correctChoiceQuestionIds=links.correctChoiceQuestionIds??[],scenarioQuestionIds=links.scenarioQuestionIds??[],distractorOnlyQuestionIds=links.distractorOnlyQuestionIds??[];
  coverage.push({lessonId,tableId:section.table.id,rowId:row.id,topic:row.cells[0],taught:true,correctChoiceQuestionIds,scenarioQuestionIds,distractorOnlyQuestionIds,
    classification:correctChoiceQuestionIds.length?'CORRECT_CHOICE':scenarioQuestionIds.length?'SCENARIO_ONLY':distractorOnlyQuestionIds.length?'DISTRACTOR_ONLY':'NOT_TESTED',sourceIds:row.sourceIds,
    note:scenarioQuestionIds.length&&!correctChoiceQuestionIds.length?'関連シナリオはあるが、この操作・権限そのものを正解として選ぶ確認とは区別する。':undefined});
  return row;
 })}};
}
const cliId='lesson-d2-cli',adminId='lesson-d2-org-governance';
const cli=assets.lessons.find(l=>l.id===cliId),admin=assets.lessons.find(l=>l.id===adminId);
const builtCli=cliSections.map(s=>sectionData(s,cliId));
const currentRevisions=[...read(root+'questions/official-alignment-revisions.json').questions,...read(root+'questions/admin-content-revisions.json').questions];
const seed=read(root+'questions/seed.json');
const excluded=new Set([...read(root+'questions/selection-exclusions.json').questions,...read(root+'questions/removals.json').questions].map(q=>q.id));
const current=seed.map(q=>currentRevisions.find(r=>r.id===q.id)?.after??q).filter(q=>!excluded.has(q.id)&&q.status==='verified');
const activeIds=new Set(current.map(q=>q.id));
const unique=items=>[...new Set(items)];
const cliSources=unique([...cli.sourceIds,...builtCli.flatMap(s=>s.table?.rows.flatMap(row=>row.sourceIds)??[])]);
edit('lessons',cliId,{
 summary:'シェルとCLI内の対話を分け、導入、認証、ヘルプ、モデル選択、実行、再開、ツール権限、会話管理のコマンドを目的から選びます。',
 sections:builtCli,estimatedMinutes:18,
 keyPoints:['シェルへ入力するcopilotのコマンドと、CLI内のスラッシュコマンドを区別する。','-pは回答後に終了し、-iは対話を開始する。--silentは出力形式の指定である。','特定IDの再開、選択画面、直近の作業の再開を使い分ける。','ツールの候補、実行許可、Autopilotによる継続は別の条件である。','/contextは確認、/compactは会話の要約、/clearは新しい会話の開始である。'],
 commonMistakes:['OSのシェルへ/loginを入力したり、CLI内へcopilot helpをスラッシュコマンドとして入力したりすること。','--continueで必ず指定した過去の作業へ戻れると思うこと。','ツールへ許可を与えれば候補外のツールも追加されると思うこと。','/compactをファイル変更の取り消しやMCP定義の削除として使おうとすること。'],
 examTips:['何をしたいか、どこへ入力するか、回答後も対話を続けるかを先に整理します。','旧gh copilot拡張と現行CLIを区別します。現行コマンドの細部は公式資料と確認日を見ます。'],
 questionIds:unique([...cli.questionIds,...current.filter(q=>/Copilot CLI|旧gh/.test(q.question)).map(q=>q.id)]).filter(id=>activeIds.has(id)),
 sourceIds:cliSources,
},'目的別の6参照表と使用例を追加。既存のneeds-review状態は保持。');
const plan=sectionData(planSection,adminId),operations=sectionData(adminSection,adminId);
const adminSections=structuredClone(admin.sections);adminSections.splice(adminSections.length-1,0,plan,operations);
edit('lessons',adminId,{sections:adminSections,estimatedMinutes:18,
 questionIds:unique([...admin.questionIds,...coverage.filter(r=>r.lessonId===adminId).flatMap(r=>[...r.correctChoiceQuestionIds,...r.scenarioQuestionIds])]).filter(id=>activeIds.has(id)),
 sourceIds:unique([...admin.sourceIds,...[plan,operations].flatMap(s=>s.table.rows.flatMap(r=>r.sourceIds))]),
},'訂正済み本文を保持し、プラン7行と管理操作10行の表を追加。');
const terms={
 'g-copilot-cli':{detailedDefinition:'現行CLIはcopilotで起動し、対話内では/login、/help、/model等を使います。シェルでのcopilot loginやcopilot helpとは入力場所を区別します。ファイルの調査・編集やコマンド実行も支援するため、対象フォルダーの信頼とツール権限、変更結果を確認します。旧gh copilot拡張のexplain/suggestは現行の標準サブコマンドではありません。目的別の操作と使用例はCLI教材の参照表で確認できます。',commonConfusions:['現行のcopilot、旧拡張のgh copilot、GitHub CLIのgh、一般のシェルコマンドを混同すること。'],examPoints:['シェルのコマンドと、CLI対話中のスラッシュコマンドを区別する。','導入・認証、実行方法、再開先、文脈管理を目的に応じて選ぶ。','CLIへのContent Exclusionの適用には公式資料間の説明差があるため確認する。']},
 'g-cli-execution-confirm':{detailedDefinition:'CLIではモデルへ提示するツールの候補と、実行を許可・拒否する条件を分けます。--allow-toolで範囲を絞って許可し、--deny-toolで拒否します。重なる操作では拒否が優先します。/permissions showでは現在の権限モードを確認できます。事前許可によって毎回の確認が省かれる場合がありますが、Autopilotによる次ターンへの継続とは別の仕組みです。',examPoints:['候補として提供されていることと、その実行が許可されることは別である。','許可と拒否が重なる操作では拒否が優先する。','権限モードの確認と、広い権限の付与を区別する。']},
 'g-cli-context-limits':{detailedDefinition:'ファイルを取得できる範囲は、実行場所、アクセスを許可したフォルダー、利用可能なツール等に依存します。取得できることと、文脈へ保持できる量も別です。/contextで使用量を確認し、/compactで会話を要約し、/clearで新しい会話を開始します。これらはアクセス権の追加や、MCPのツール定義を削除する操作ではありません。',examPoints:['CLIは権限内のファイルを調査・変更できる。','/context、/compact、/clearを目的で区別する。','会話の圧縮だけで、すべてのツール定義まで減るとは判断しない。']},
 'g-subscription-plans':{detailedDefinition:'Copilot Freeは現行の個人プランです。個人向けにはFree・Student・Pro・Pro+・Max、組織向けにはBusiness・Enterpriseがあります。プランは利用条件であり、管理ロールではありません。個人の有料プランでも、組織のシートやポリシーを変更する権限は付与されません。Copilot EnterpriseはGitHub Enterprise Cloudを利用する企業向けで、企業のownerが組織ごとのプラン選択を管理します。詳細は組織管理教材のプラン表と、別に用意した操作別権限表を照合します。',examPoints:['プラン名、GitHubの契約・アカウント、管理ロールを区別する。','CLIを利用できることと、組織管理を行えることは別である。','Business/Enterpriseでも対象機能の許可・シート・操作権限等を確認する。']},
};
for(const [id,patch] of Object.entries(terms)){
 const t=assets.glossary.find(t=>t.id===id);
 edit('glossary',id,{...patch,sourceIds:unique([...t.sourceIds,...(id==='g-subscription-plans'?['plans','reference-enterprise-plan']:['feature-refresh-cli-reference','cli-tool-permissions'])])},'参照表の基本説明と入力場所・プランとロールの違いをそろえる。');
}
for(const [id,title,url] of [
 ['reference-enterprise-plan',"Choosing your enterprise's plan for GitHub Copilot",'https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/assign-licenses/choose-enterprise-plan'],
 ['reference-org-management','Managing GitHub Copilot in your organization','https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization'],
]){
 assert(!assets.sources.some(s=>s.id===id));assets.sources.push({id,title,url,publisher:'GitHub Docs',sourceType:'documentation',syllabusVersion:'2026-08-07',status:'verified'});
}
for(const s of assets.sources){
 const refs=changes.filter(c=>c.kind!=='sources'&&c.after.sourceIds?.includes(s.id));if(!refs.length)continue;
 const before=originals.sources.find(x=>x.id===s.id)??null;
 for(const [kind,key] of [['lessons','relatedLessonIds'],['glossary','relatedGlossaryIds']])s[key]=unique([...(s[key]??[]),...refs.filter(c=>c.kind===kind).map(c=>c.id)]);
 s.relatedComparisonIds??=[];s.relatedQuestionIds??=[];
 s.relatedDomainIds=unique([...(s.relatedDomainIds??[]),...refs.flatMap(c=>c.after.domainIds??[c.after.domainId])]);
 s.relatedObjectiveIds=unique([...(s.relatedObjectiveIds??[]),...refs.flatMap(c=>c.after.objectiveIds??[])]);
 s.lastCheckedAt='2026-10-18';s.lastVerifiedAt='2026-10-18';
 changes.push({kind:'sources',id:s.id,reason:'参照表・用語との出典対応と確認日',before,after:structuredClone(s)});
}
for(const item of coverage)for(const id of [...item.correctChoiceQuestionIds,...item.scenarioQuestionIds,...item.distractorOnlyQuestionIds])assert(activeIds.has(id),'Inactive mapping '+id);
const fingerprints=Object.fromEntries(Object.entries(originals).map(([kind,rows])=>[kind,Object.fromEntries(rows.map(x=>[x.id,hash(x)]))]));
if(previous)assert.deepEqual(fingerprints,previous.beforeFingerprints);
const counts={eligible:current.length,byDifficulty:{},byDomain:{}};
for(const q of current){counts.byDifficulty[q.difficulty]=(counts.byDifficulty[q.difficulty]??0)+1;counts.byDomain[q.domainId]=(counts.byDomain[q.domainId]??0)+1;}
const questionFingerprints=Object.fromEntries(['seed.json','answer-explanations.json','official-alignment-revisions.json','admin-content-revisions.json','selection-exclusions.json','removals.json'].map(p=>[p,hash(read(root+'questions/'+p))]));
const report={reviewedAt:'2026-10-18',beforeFingerprints:fingerprints,questionFingerprints,changes,coverage,counts,nextCandidates,
 unresolved:['/model、会話管理、プラン別の管理範囲、委任された閲覧ロール等には、直接の正解選択問題が不足する。候補3件だけで全て解消したとは扱わない。','CLIへのContent Exclusionの公式資料間の説明差は維持。'],
};
write(path,report);for(const [k,p] of Object.entries(paths))write(p,assets[k]);
console.log(`Published ${coverage.length} reference rows in ${coverage.length?8:0} tables; ${counts.eligible} exercise questions unchanged.`);
