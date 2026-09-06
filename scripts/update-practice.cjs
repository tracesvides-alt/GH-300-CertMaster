const fs=require('fs');let p=fs.readFileSync('app/page.tsx','utf8');
p=p.replace("  selectWeak,\n  shuffled,\n  mockQuestions,\n  allocate,\n",'');
p=p.replace("type Tab =",`import PracticeSetup, { CountPicker } from './components/practice-setup';
import PracticeResult from './components/practice-result';
import { defaultSelectionOptions, selectionOptionsSchema, selectQuestions, selectMockQuestions, calculateObjectiveStats, type SelectionOptions } from '@/lib/selection';
import type { PracticeRun } from '@/lib/practice-session';
type Tab =`);
p=p.replace("    [objective, setObjective] = useState('all'),\n    [mode, setMode] = useState('Random');", "    [objective, setObjective] = useState('all');");
p=p.replace('    [count, setCount] = useState(50),','    [count, setCount] = useState<SelectionOptions[\'count\']>(50),');
p=p.replace("  const attempts = useLiveQuery",`  const [practiceOptions,setPracticeOptions] = useState<SelectionOptions>(defaultSelectionOptions);
  const [settingsReady,setSettingsReady] = useState(false);
  const [practiceRun,setPracticeRun] = useState<PracticeRun|null>(null);
  const [practiceSummary,setPracticeSummary] = useState<PracticeRun|null>(null);
  const completedPractice=useLiveQuery(()=>db.practiceRuns.filter(r=>r.completedAt!==null).toArray(),[])??[];
  useEffect(()=>{let mounted=true;db.settings.get('practice').then(saved=>{if(!mounted)return;const result=selectionOptionsSchema.safeParse(saved?.value??{});setPracticeOptions(result.success?result.data:defaultSelectionOptions);}).catch(()=>setNotice('前回設定を読み込めませんでした。初期設定で開始します。')).finally(()=>{if(mounted)setSettingsReady(true)});return()=>{mounted=false}},[]);
  function changePracticeOptions(value:SelectionOptions){setPracticeOptions(value);void db.settings.put({id:'practice',value}).catch(()=>setNotice('設定を保存できませんでした。今回の設定はそのまま利用できます。'));}
  const attempts = useLiveQuery`);
p=p.replace("  completed: boolean;\n};","  completed: boolean;\n  requestedCount?: number;\n  notices?: string[];\n};");
p=p.replace("    setTab(t);\n    setQueue", "    setTab(t);\n    setPracticeRun(null);setPracticeSummary(null);\n    setQueue");
p=p.replace('  function start(list: Question[]) {',`  function start(list: Question[], options=practiceOptions, history=attempts) {
    setPracticeSummary(null);
    setPracticeRun(list.length?{id:crypto.randomUUID(),questions:list,options:{...options},beforeStats:calculateObjectiveStats(history,list.map(q=>q.objectiveId)),answers:[],startedAt:Date.now(),completedAt:null}:null);`);
const a=p.indexOf('  function practice() {'),b=p.indexOf('  async function answer()',a);
p=p.slice(0,a)+`  async function practice(options=practiceOptions) {
    if(lock.current)return;
    lock.current=true;setBusy(true);
    try {
      const history=await db.attempts.toArray(), saved=await db.generated.toArray(),marks=await db.bookmarks.toArray();
      const result=selectQuestions([...questions,...saved],options,{attempts:history,bookmarkIds:marks.map(b=>b.id)});
      start(result.questions,options,history);
      setNotice(result.questions.length?result.notices.join(' '):'指定した条件に合う問題がありません。復習対象やDomainの絞り込みを変更してください。');
    } catch {setNotice('問題を読み込めませんでした。ストレージ設定を確認してください。');}
    finally{lock.current=false;setBusy(false)}
  }
  function quickWeak(){void practice({...defaultSelectionOptions,count:5,mode:'Weak Points'});}
  async function finishPractice(){
    if(!practiceRun||!practiceRun.answers.length){navigate('Home');return;}
    setBusy(true);
    try{const complete={...practiceRun,completedAt:Date.now()};await db.practiceRuns.put(complete);setPracticeSummary(complete);setPracticeRun(null);setQueue([]);setRevealed(false);setNotice('');}
    catch{setNotice('結果を保存できませんでした。もう一度終了してください。');}
    finally{setBusy(false)}
  }
`+p.slice(b);
p=p.replace('      await db.attempts.add({','      const response: Attempt = {');
p=p.replace("        status: q.status,\n      });\n      setRevealed(true);",`        status: q.status,
        sessionId: practiceRun?.id,
      };
      const updated=practiceRun?{...practiceRun,answers:[...practiceRun.answers,response]}:null;
      await db.transaction('rw',db.attempts,db.practiceRuns,async()=>{await db.attempts.add(response);if(updated)await db.practiceRuns.put(updated)});
      setPracticeRun(updated);
      setRevealed(true);`);
p=p.replace('      const result = mockQuestions(n);',`      const result = selectMockQuestions(questions,n,{attempts:await db.attempts.toArray()});
      if(!result.questions.length){setNotice('利用できるVerified問題がありません。');return;}`);
p=p.replace('deadline: Date.now() + n * 90000,','deadline: Date.now() + result.actualCount * 90000,\n        requestedCount:n,\n        notices:result.notices,');
p=p.replace("setNotice(result.feasible ? '' : '少数問のため公式比率の整数制約を満たせないミニ模試です。');","setNotice(result.notices.join(' '));");
p=p.replace("                          navigate('Home');\n                          setNotice('今回の演習が完了しました。おつかれさまでした。');","                          void finishPractice();");
p=p.replaceAll('onClick={() => start(selectWeak(questions, attempts, 5))}','onClick={quickWeak}');
p=p.replace(": 'AI生成 · 未検証'", ": 'AI Generated · 未検証'");
p=p.replaceAll("50%", "50%");
const s=p.indexOf("              {tab === 'Practice' && !q && ("),e=p.indexOf("              {tab === 'Mock'",s);
if(s<0||e<0)throw Error('Practice boundary missing');
p=p.slice(0,s)+`              {tab === 'Practice' && !q && practiceSummary && <PracticeResult run={practiceSummary} attempts={attempts} onRetry={()=>practice(practiceSummary.options)} onWeak={quickWeak} onWrong={()=>{const wrongIds=new Set(practiceSummary.answers.filter(a=>!a.correct).map(a=>a.questionId));start(practiceSummary.questions.filter(q=>wrongIds.has(q.id)),practiceSummary.options)}} onHome={()=>navigate('Home')} onLesson={readLesson}/>}
              {tab === 'Practice' && !q && !practiceSummary && <>
                <PracticeSetup options={practiceOptions} onChange={changePracticeOptions} onStart={()=>practice()} ready={settingsReady&&!busy} verifiedCount={questions.length}/>
                <button className="textbutton" onClick={()=>{setAiOpen(true);setAiMode('generate')}}><Sparkles size={17}/>AIでObjectiveの問題を生成する</button>
              </>}
`+p.slice(e);
const cs=p.indexOf('                        <label>\n                          問題数'),ce=p.indexOf('                        <p className="caption">',cs);
if(cs<0||ce<0)throw Error('count boundary');
p=p.slice(0,cs)+'                        <CountPicker value={count} onChange={setCount}/>\n'+p.slice(ce);
p=p.replace('disabled={!Number.isInteger(count) || count < 1 || count > 200}', 'disabled={busy}');
p=p.replace('<button onClick={() => beginMock(6)}>6問のミニ模試</button>', '<button onClick={() => beginMock(5)}>5問のミニ模試</button>');
p=p.replace('初期版は12問収録。50問模試には問題の追加が必要です。重複で水増ししません。','Verified問題は現在{questions.length}問です。候補不足時は実施問題数と配分を調整して表示します。収録目標は約200問です。');
p=p.replace('setSession(s);\n                                setSelected','setSession(s);\n                                setNotice(s.notices?.join(\' \')??\'\');\n                                setSelected');
p=p.replace('<p className="caption">公式レンジから整数配分を算出</p>','<p className="caption">{count<=10?\'5・10問は比率を重みにしたランダム出題\':\'20・30・50問は、開始時にレンジ内の整数配分を抽選\'}</p>');
p=p.replace('<strong>{allocate(count).counts[i]}問</strong>','<strong>{Math.round((d.min+d.max)/2/95*1000)/10}% weight</strong>');
p=p.replace(/\s*\{!allocate\(count\)\.feasible && \([\s\S]*?\n                            \)\}/,'');
p=p.replace("                      <h2>模試、おつかれさまでした。</h2>","                      <h2>模試、おつかれさまでした。</h2><p className=\"caption\">指定{session.requestedCount??session.questions.length}問 / 実施{session.questions.length}問</p>{session.notices?.length?<p className=\"notice\">{session.notices.join(' ')}</p>:null}");
p=p.replace("              {tab === 'Review' && (\n                <>",`              {tab === 'Review' && (
                <>
                {completedPractice.length>0&&<article className="panel"><h2>Practiceの結果</h2>{[...completedPractice].sort((a,b)=>(b.completedAt??0)-(a.completedAt??0)).slice(0,10).map(run=><button key={run.id} className="resume" onClick={()=>{navigate('Practice');setPracticeSummary(run)}}>{new Date(run.startedAt).toLocaleString('ja-JP')} · {run.answers.filter(a=>a.correct).length}/{run.questions.length} 正解<ArrowRight size={16}/></button>)}</article>}`);
fs.writeFileSync('app/page.tsx',p);
