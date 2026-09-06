'use client';
import { useEffect, useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Flame,
  GitCompareArrows,
  GraduationCap,
  Home,
  Layers,
  Library,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Timer,
  FileText,
  X,
  Zap,
} from 'lucide-react';
import {
  domains,
  objectives,
  questions,
  lessons,
  sources,
  version,
  glossaryTerms,
  comparisonGuides,
  scenarioSets,
  buildKnowledgeBase,
  searchGlossary,
  globalSearch,
  type Question,
  type ScenarioSet,
  type GlossaryTerm,
  type ComparisonGuide,
  type GlossaryFilter,
  type SearchResult,
} from '@/lib/content';
import { db, saveGenerated } from '@/lib/db';
import { mastery, score, streak, type Attempt } from '@/lib/learning';
import PracticeSetup, { CountPicker } from './components/practice-setup';
import PracticeResult from './components/practice-result';
import {
  defaultSelectionOptions,
  selectionOptionsSchema,
  selectQuestions,
  selectMockQuestions,
  calculateObjectiveStats,
  type SelectionOptions,
} from '@/lib/selection';
import type { PracticeRun } from '@/lib/practice-session';
type Tab = 'Home' | 'Study' | 'Practice' | 'Mock' | 'Review';
const nav = [
  { id: 'Home', icon: Home },
  { id: 'Study', icon: BookOpen },
  { id: 'Practice', icon: Zap },
  { id: 'Mock', icon: Timer },
  { id: 'Review', icon: RotateCcw },
] as const;
const labels = ['学習ダッシュボード', '教材を読む', '問題演習', '模擬試験', '復習ノート'];
type StudyTab = 'Learn' | 'Glossary' | 'Compare';
const kb = buildKnowledgeBase();
const importanceLabels = { essential: '必須', important: '重要', supplementary: '補助' };
const difficulty = { beginner: '基礎', intermediate: '標準', advanced: '応用' };
type Session = {
  id: string;
  questions: Question[];
  answers: Record<string, string[]>;
  index: number;
  deadline: number;
  completed: boolean;
  requestedCount?: number;
  notices?: string[];
};
export default function App() {
  const [tab, setTab] = useState<Tab>('Home'),
    [domain, setDomain] = useState('all'),
    [objective, setObjective] = useState('all');
  const [queue, setQueue] = useState<Question[]>([]),
    [index, setIndex] = useState(0),
    [selected, setSelected] = useState<string[]>([]),
    [revealed, setRevealed] = useState(false),
    [lessonId, setLessonId] = useState<string | null>(null);
  const [studyTab, setStudyTab] = useState<StudyTab>('Learn');
  const [glossaryTermId, setGlossaryTermId] = useState<string | null>(null);
  const [comparisonId, setComparisonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [glossaryFilter, setGlossaryFilter] = useState<GlossaryFilter>({});
  const [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false),
    [count, setCount] = useState<SelectionOptions['count']>(50),
    [session, setSession] = useState<Session | null>(null),
    [now, setNow] = useState(Date.now()),
    [online, setOnline] = useState(true);
  const [aiOpen, setAiOpen] = useState(false),
    [aiText, setAiText] = useState(''),
    [aiAnswer, setAiAnswer] = useState(''),
    [aiMode, setAiMode] = useState('explain');
  const [practiceOptions, setPracticeOptions] = useState<SelectionOptions>(defaultSelectionOptions);
  const [settingsReady, setSettingsReady] = useState(false);
  const [practiceRun, setPracticeRun] = useState<PracticeRun | null>(null);
  const [practiceSummary, setPracticeSummary] = useState<PracticeRun | null>(null);
  const completedPractice =
    useLiveQuery(() => db.practiceRuns.filter((r) => r.completedAt !== null).toArray(), []) ?? [];
  useEffect(() => {
    let mounted = true;
    db.settings
      .get('practice')
      .then((saved) => {
        if (!mounted) return;
        const result = selectionOptionsSchema.safeParse(saved?.value ?? {});
        setPracticeOptions(result.success ? result.data : defaultSelectionOptions);
      })
      .catch(() => setNotice('前回設定を読み込めませんでした。初期設定で開始します。'))
      .finally(() => {
        if (mounted) setSettingsReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);
  function changePracticeOptions(value: SelectionOptions) {
    setPracticeOptions(value);
    void db.settings
      .put({ id: 'practice', value })
      .catch(() => setNotice('設定を保存できませんでした。今回の設定はそのまま利用できます。'));
  }
  const attempts = useLiveQuery(() => db.attempts.orderBy('at').reverse().toArray(), []) ?? [];
  const bookmarks = useLiveQuery(() => db.bookmarks.toArray(), []) ?? [];
  const generated = useLiveQuery(() => db.generated.toArray(), []) ?? [];
  const sessions = useLiveQuery(() => db.sessions.toArray(), []) ?? [];
  const m = mastery(attempts),
    bank = [...questions, ...generated],
    q = session && !session.completed ? session.questions[session.index] : queue[index];
  const activeMock = !!session && !session.completed;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector<HTMLElement>('#main h1')?.focus({ preventScroll: true });
  }, [tab, q?.id, practiceSummary?.id]);
  const answered = attempts.length,
    correct = attempts.filter((a) => a.correct).length;
  const weak = objectives
    .filter((o) => m.byObjective[o.id] < 60)
    .sort((a, b) => m.byObjective[a.id] - m.byObjective[b.id]);
  const lock = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (aiOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [aiOpen]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'production') {
      // A worker from a previous production run must not cache mutable dev chunks.
      void navigator.serviceWorker
        .getRegistrations()
        .then(async (registrations) => {
          for (const registration of registrations) {
            const url = registration.active?.scriptURL ?? registration.waiting?.scriptURL;
            if (url === new URL('/sw.js', location.origin).href) await registration.unregister();
          }
          for (const name of await caches.keys()) {
            if (name.startsWith('certmaster-')) await caches.delete(name);
          }
        })
        .catch(() =>
          setNotice('開発用キャッシュを更新できませんでした。ページを再読み込みしてください。'),
        );
    }
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production')
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() =>
          setNotice('オフライン準備に失敗しました。オンラインで再読み込みしてください。'),
        );
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(t);
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  useEffect(() => {
    if (activeMock && session && now >= session.deadline && !lock.current) void finishMock(session);
  }, [now, activeMock]);
  function navigate(t: Tab) {
    setTab(t);
    setPracticeRun(null);
    setPracticeSummary(null);
    setQueue([]);
    setSession(null);
    setLessonId(null);
    setGlossaryTermId(null);
    setComparisonId(null);
    setSearchQuery('');
    setRevealed(false);
    setSelected([]);
    setNotice('');
  }
  function start(list: Question[], options = practiceOptions, history = attempts) {
    setPracticeSummary(null);
    setPracticeRun(
      list.length
        ? {
            id: crypto.randomUUID(),
            questions: list,
            options: { ...options },
            beforeStats: calculateObjectiveStats(
              history,
              list.map((q) => q.objectiveId),
            ),
            answers: [],
            startedAt: Date.now(),
            completedAt: null,
          }
        : null,
    );
    setNotice('');
    setQueue(list);
    setIndex(0);
    setSelected([]);
    setRevealed(false);
    setSession(null);
    setTab('Practice');
    if (!list.length)
      setNotice('対象の問題がありません。条件を変えるか、少し時間をおいてください。');
  }
  async function practice(options = practiceOptions) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const history = await db.attempts.toArray(),
        saved = await db.generated.toArray(),
        marks = await db.bookmarks.toArray();
      const result = selectQuestions([...questions, ...saved], options, {
        attempts: history,
        bookmarkIds: marks.map((b) => b.id),
      });
      start(result.questions, options, history);
      setNotice(
        result.questions.length
          ? result.notices.join(' ')
          : '指定した条件に合う問題がありません。復習対象やDomainの絞り込みを変更してください。',
      );
    } catch {
      setNotice('問題を読み込めませんでした。ストレージ設定を確認してください。');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function quickWeak() {
    void practice({ ...defaultSelectionOptions, count: 5, mode: 'Weak Points' });
  }
  async function finishPractice() {
    if (!practiceRun || !practiceRun.answers.length) {
      navigate('Home');
      return;
    }
    setBusy(true);
    try {
      const complete = { ...practiceRun, completedAt: Date.now() };
      await db.practiceRuns.put(complete);
      setPracticeSummary(complete);
      setPracticeRun(null);
      setQueue([]);
      setRevealed(false);
      setNotice('');
    } catch {
      setNotice('結果を保存できませんでした。もう一度終了してください。');
    } finally {
      setBusy(false);
    }
  }
  async function answer() {
    if (!q || !selected.length || lock.current || revealed) return;
    lock.current = true;
    setBusy(true);
    try {
      const response: Attempt = {
        id: crypto.randomUUID(),
        questionId: q.id,
        domainId: q.domainId,
        objectiveId: q.objectiveId,
        answer: selected,
        correct: score(q, selected),
        at: Date.now(),
        status: q.status,
        sessionId: practiceRun?.id,
      };
      const updated = practiceRun
        ? { ...practiceRun, answers: [...practiceRun.answers, response] }
        : null;
      await db.transaction('rw', db.attempts, db.practiceRuns, async () => {
        await db.attempts.add(response);
        if (updated) await db.practiceRuns.put(updated);
      });
      setPracticeRun(updated);
      setRevealed(true);
    } catch {
      setNotice('回答を保存できませんでした。ストレージ設定を確認して再試行してください。');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function bookmark(id: string) {
    try {
      if (bookmarks.some((b) => b.id === id)) await db.bookmarks.delete(id);
      else await db.bookmarks.put({ id });
    } catch {
      setNotice('ブックマークを保存できませんでした。');
    }
  }
  function readLesson(d: string) {
    setLessonId(`lesson-${d}`);
    setTab('Study');
    setQueue([]);
    setSession(null);
  }
  async function beginMock(n = count) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const result = selectMockQuestions(questions, n, { attempts: await db.attempts.toArray() });
      if (!result.questions.length) {
        setNotice('利用できるVerified問題がありません。');
        return;
      }
      const s: Session = {
        id: crypto.randomUUID(),
        questions: result.questions,
        answers: {},
        index: 0,
        deadline: Date.now() + result.actualCount * 90000,
        requestedCount: n,
        notices: result.notices,
        completed: false,
      };
      await db.sessions.put(s);
      setSession(s);
      setSelected([]);
      setQueue([]);
      setNotice(result.notices.join(' '));
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function moveMock(delta: number) {
    if (!session || !q) return;
    try {
      const s = {
        ...session,
        answers: { ...session.answers, [q.id]: selected },
        index: session.index + delta,
      };
      await db.sessions.put(s);
      setSession(s);
      setSelected(s.answers[s.questions[s.index].id] ?? []);
    } catch {
      setNotice('模試の進捗を保存できませんでした。');
    }
  }
  async function finishMock(current: Session) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const answers = { ...current.answers };
      if (q) answers[q.id] = selected;
      const s = { ...current, answers, completed: true };
      await db.transaction('rw', db.sessions, db.attempts, async () => {
        await db.sessions.put(s);
        await db.attempts.bulkPut(
          s.questions.map((question) => ({
            id: `${s.id}:${question.id}`,
            sessionId: s.id,
            questionId: question.id,
            domainId: question.domainId,
            objectiveId: question.objectiveId,
            answer: answers[question.id] ?? [],
            correct: score(question, answers[question.id] ?? []),
            at: Date.now(),
            status: question.status,
          })),
        );
      });
      setSession(s);
      setQueue([]);
      setSelected([]);
      setTab('Mock');
    } catch {
      setNotice('模試結果を保存できませんでした。もう一度終了してください。');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function tutor(action = aiMode) {
    setBusy(true);
    setAiAnswer('');
    try {
      const target =
        (action === 'weakness'
          ? attempts.find((a) => !a.correct && a.status === 'verified')?.objectiveId
          : undefined) ||
        q?.objectiveId ||
        (objective !== 'all' ? objective : weak[0]?.id) ||
        objectives[0].id;
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          objectiveId: target,
          questionId: q?.id,
          message: aiText,
          wrongQuestionIds: attempts
            .filter((a) => !a.correct)
            .slice(0, 10)
            .map((a) => a.questionId),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'AIの応答に失敗しました');
      if (data.question) {
        const newQ = await saveGenerated(data.question);
        setAiOpen(false);
        start([newQ]);
      } else setAiAnswer(data.text);
    } catch (e) {
      setAiAnswer((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function sourceLinks(ids: string[]) {
    return (
      <div className="sources">
        {ids.map((id) => {
          const s = sources.find((s) => s.id === id);
          return s ? (
            <a key={id} href={s.url} target="_blank" rel="noreferrer">
              <ShieldCheck size={14} />
              {s.title} ↗
            </a>
          ) : null;
        })}
      </div>
    );
  }
  const lesson = lessons.find((l) => l.id === lessonId);
  return (
    <div className="shell">
      <a className="skip" href="#main">
        本文へ移動
      </a>
      <aside className="sidebar">
        <a href="/" className="brand">
          <span className="brandmark">
            <Code2 />
          </span>
          <span>
            CertMaster<small>GITHUB COPILOT · GH-300</small>
          </span>
        </a>
        <div className="workspace-label">YOUR LEARNING SPACE</div>
        <nav aria-label="メインナビゲーション">
          {nav.map(({ id, icon: Icon }, i) => (
            <button
              key={id}
              className={tab === id ? 'navitem active' : 'navitem'}
              aria-current={tab === id ? 'page' : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={20} />
              <span>
                {id}
                <small>{labels[i]}</small>
              </span>
              {tab === id && <span className="navdot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <ShieldCheck size={20} />
          <strong>Learn with confidence</strong>
          <p>
            公式資料に基づく固定教材。
            <br />
            学習の主導権は、あなたに。
          </p>
          <span className="tag">SYLLABUS {version}</span>
        </div>
        <div className="local-user">
          <span className="avatar">Y</span>
          <div>
            Personal workspace<small>登録不要・この端末に保存</small>
          </div>
          <span className="statusdot" />
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="muted">Workspace</span>
            <ChevronRight size={14} />
            <span>{tab}</span>
          </div>
          <span className="connection">
            <span className={online ? 'statusdot' : 'statusdot offline'} />
            {online ? 'Local-first learning' : 'オフライン'}
          </span>
        </header>
        <main id="main">
          <div className="pageheading">
            <div>
              <div className="eyebrow">GH-300 / YOUR NEXT CHAPTER</div>
              <h1 tabIndex={-1}>
                {activeMock
                  ? '模試に集中しよう'
                  : q && tab === 'Practice'
                    ? '一問ずつ、理解を深める'
                    : labels[nav.findIndex((n) => n.id === tab)]}
              </h1>
              <p>
                {tab === 'Home'
                  ? '今日の一歩を、確かな理解につなげよう。'
                  : '公式の根拠を確かめながら、自分のペースで。'}
              </p>
            </div>
            <span className="version">
              <span className="statusdot" />
              2026.08.07 シラバス
            </span>
          </div>
          {notice && (
            <div className="notice" role="status">
              {notice}
            </div>
          )}
          {(activeMock && q) || (tab === 'Practice' && q) ? (
            <section className="question-layout">
              <article className="panel question">
                <div className="row">
                  <span className="tag">
                    {activeMock ? 'MOCK EXAM' : 'PRACTICE'} ·{' '}
                    {activeMock ? session!.index + 1 : index + 1} /{' '}
                    {activeMock ? session!.questions.length : queue.length}
                  </span>
                  {activeMock ? (
                    <span className="timer">
                      <Timer size={17} />
                      {Math.max(0, Math.ceil((session!.deadline - now) / 60000))} 分
                    </span>
                  ) : (
                    <button
                      className="iconbutton"
                      aria-label="ブックマーク"
                      aria-pressed={bookmarks.some((b) => b.id === q!.id)}
                      onClick={() => bookmark(q!.id)}
                    >
                      <Star
                        fill={bookmarks.some((b) => b.id === q!.id) ? 'currentColor' : 'none'}
                        size={21}
                      />
                    </button>
                  )}
                </div>
                <div className="question-meta">
                  <span className={q!.status === 'verified' ? 'verified' : 'ai-badge'}>
                    {q!.status === 'verified' ? <ShieldCheck size={14} /> : <Sparkles size={14} />}{' '}
                    {q!.status === 'verified' ? 'Verified · 公式準拠' : 'AI Generated'}
                  </span>
                  <span className="tag">{domains.find((d) => d.id === q!.domainId)?.name}</span>
                  <span className="tag">
                    {objectives.find((o) => o.id === q!.objectiveId)?.title}
                  </span>
                  <span className="tag">{difficulty[q!.difficulty]}</span>
                  {q!.examLike && <span className="tag exam-badge">本番シナリオ型</span>}
                  <span className="tag">
                    {q!.type === 'single-select' ? '単一選択' : '複数選択'}
                  </span>
                </div>
                {(() => {
                  if (!q!.scenarioSetId) return null;
                  const currentSet = scenarioSets.find((s) => s.id === q!.scenarioSetId);
                  if (!currentSet) return null;
                  const qNumInSet = currentSet.questionIds.indexOf(q!.id) + 1;
                  return (
                    <details className="scenario-panel" open>
                      <summary className="scenario-summary">
                        <span className="scenario-title">
                          <FileText size={16} />
                          <strong>共通実務シナリオ: {currentSet.title}</strong>
                        </span>
                        <span className="scenario-step">
                          Question {qNumInSet > 0 ? qNumInSet : 1} / {currentSet.questionIds.length}
                        </span>
                      </summary>
                      <div className="scenario-body">
                        <p>{currentSet.scenario}</p>
                      </div>
                    </details>
                  );
                })()}
                <h2>{q!.question}</h2>
                <fieldset disabled={revealed || busy}>
                  <legend className="sr-only">回答を選択</legend>
                  {q!.choices.map((c) => (
                    <label
                      key={c.id}
                      className={`choice ${selected.includes(c.id) ? 'selected' : ''} ${revealed && q!.answer.includes(c.id) ? 'correct' : ''}`}
                    >
                      <input
                        type={q!.type === 'single-select' ? 'radio' : 'checkbox'}
                        name="answer"
                        checked={selected.includes(c.id)}
                        onChange={() =>
                          setSelected(
                            q!.type === 'single-select'
                              ? [c.id]
                              : selected.includes(c.id)
                                ? selected.filter((a) => a !== c.id)
                                : [...selected, c.id],
                          )
                        }
                      />
                      <span className="choice-letter">{c.id}</span>
                      <span>{c.text}</span>
                      {revealed && q!.answer.includes(c.id) && <Check size={20} />}
                    </label>
                  ))}
                </fieldset>
                {activeMock ? (
                  <div className="actions">
                    <button disabled={session!.index === 0 || busy} onClick={() => moveMock(-1)}>
                      前の問題
                    </button>
                    {session!.index < session!.questions.length - 1 ? (
                      <button className="primary" disabled={busy} onClick={() => moveMock(1)}>
                        回答を保存して次へ <ArrowRight size={17} />
                      </button>
                    ) : (
                      <button
                        className="primary"
                        disabled={busy}
                        onClick={() => finishMock(session!)}
                      >
                        模試を終了する
                      </button>
                    )}
                  </div>
                ) : !revealed ? (
                  <button
                    className="primary answerbutton"
                    disabled={!selected.length || busy}
                    onClick={answer}
                  >
                    回答を確認する <ArrowRight size={17} />
                  </button>
                ) : (
                  <>
                    <div className="explanation" aria-live="polite">
                      <div className="explanation-header">
                        <span className="ai-insight-badge">
                          <Sparkles size={14} /> AI INSIGHT
                        </span>
                        <h3
                          className={score(q!, selected) ? 'correct-heading' : 'incorrect-heading'}
                        >
                          {score(q!, selected) ? '正解です！' : 'ここが学びのポイント'}
                        </h3>
                      </div>
                      <div className="answer-comparison">
                        <div>
                          <span className="sublabel">正解</span>
                          <strong className="green">{q!.answer.join(', ')}</strong>
                        </div>
                        <div>
                          <span className="sublabel">あなたの回答</span>
                          <strong className={score(q!, selected) ? 'green' : 'amber'}>
                            {selected.length ? selected.join(', ') : '未選択'}
                          </strong>
                        </div>
                      </div>
                      <div className="explanation-body">
                        <h4>Why this is correct</h4>
                        <p>{q!.explanation}</p>
                      </div>
                      {q!.clues && q!.clues.length > 0 && (
                        <div className="key-clues-section">
                          <h4>
                            <Lightbulb size={16} /> Key Clues（問題文中の判断材料）
                          </h4>
                          <div className="clues-list">
                            {q!.clues.map((clue, ci) => (
                              <span key={ci} className="clue-tag">
                                &ldquo;{clue}&rdquo;
                              </span>
                            ))}
                          </div>
                          <p className="caption">
                            実務要件と制約から上記の条件を抽出し、最適なアプローチを判断します。
                          </p>
                        </div>
                      )}
                      <div className="choice-explanations">
                        <h4>選択肢ごとの詳細分析</h4>
                        {q!.choices.map((c) => (
                          <div
                            key={c.id}
                            className={`choice-analysis ${q!.answer.includes(c.id) ? 'is-correct' : 'is-wrong'}`}
                          >
                            <span className="choice-pill">{c.id}</span>
                            <p>
                              <strong>{c.text}</strong> — {q!.choiceExplanations[c.id]}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="metadata">
                        Domain: {domains.find((d) => d.id === q!.domainId)?.name}
                        <br />
                        Objective: {objectives.find((o) => o.id === q!.objectiveId)?.title}
                        <br />
                        難易度: {difficulty[q!.difficulty]}
                      </div>
                      <h4>Official Source</h4>
                      {sourceLinks(q!.sourceIds)}
                    </div>
                    <div className="actions">
                      <button
                        onClick={() => {
                          const related = questions.filter(
                            (item) => item.domainId === q!.domainId && item.id !== q!.id,
                          );
                          start(related);
                        }}
                      >
                        類題を解く
                      </button>
                      <button onClick={() => readLesson(q!.domainId)}>教材を読む</button>
                      <button
                        onClick={() => {
                          setAiOpen(true);
                          setAiMode('explain');
                        }}
                      >
                        <Sparkles size={16} />
                        AIに質問
                      </button>
                    </div>
                    <button
                      className="primary answerbutton"
                      onClick={() => {
                        if (index + 1 < queue.length) {
                          setIndex(index + 1);
                          setSelected([]);
                          setRevealed(false);
                        } else {
                          void finishPractice();
                        }
                      }}
                    >
                      {index + 1 < queue.length ? '次の問題へ' : '演習を終了する'}{' '}
                      <ArrowRight size={17} />
                    </button>
                  </>
                )}
              </article>
              <aside className="panel context">
                <span className="eyebrow">LEARNING CONTEXT</span>
                <h3>{domains.find((d) => d.id === q!.domainId)?.title}</h3>
                <p>{objectives.find((o) => o.id === q!.objectiveId)?.title}</p>
                <hr />
                <ShieldCheck className="green" />
                <p>
                  {activeMock
                    ? '解説は模試終了後にまとめて確認できます。進捗はこの端末に保存されます。'
                    : '正解だけでなく、「なぜ他の選択肢ではないのか」まで確認しましょう。'}
                </p>
              </aside>
            </section>
          ) : (
            <>
              {tab === 'Home' && (
                <>
                  <section className="dashboard-top">
                    <article className="panel readiness">
                      <div>
                        <div className="eyebrow">
                          EXAM READINESS <span className="tag">内部指標</span>
                        </div>
                        <h2>{m.readiness >= 70 ? '合格目標ライン到達' : '理解を積み上げよう。'}</h2>
                        <p>
                          {answered
                            ? `合格目安ライン70%に対して現在 ${Math.round(m.readiness)}% です。`
                            : '最初の一問から、あなたの学習記録が始まります。'}
                        </p>
                        <div className="readiness-action-bar">
                          <button className="primary" onClick={quickWeak}>
                            今日の学習をはじめる <ArrowRight size={17} />
                          </button>
                          <span className="target-pill">Target: 70% (700/1000)</span>
                        </div>
                      </div>
                      <div
                        className="readiness-ring"
                        style={{ '--progress': `${m.readiness * 3.6}deg` } as React.CSSProperties}
                      >
                        <div>
                          <strong>
                            {Math.round(m.readiness)}
                            <small>%</small>
                          </strong>
                          <span>STUDY READINESS</span>
                        </div>
                      </div>
                      <p className="disclaimer">
                        アプリ内の学習習熟度です。公式GH-300試験のスコアや合格確率ではありません。
                      </p>
                    </article>
                    <article className="panel daily">
                      <div className="row">
                        <span className="eyebrow">RECOMMENDED PRACTICE</span>
                        <span className="spark-icon">
                          <Sparkles size={20} />
                        </span>
                      </div>
                      {(() => {
                        const rec =
                          m.readiness < 40
                            ? {
                                title: '基礎固め 10問',
                                mode: 'foundation' as const,
                                count: 10 as const,
                                desc: 'まずは用語・基本概念（Foundation問題中心）を固めましょう。',
                                tag: '基礎中心',
                              }
                            : m.readiness < 70
                              ? {
                                  title: 'バランス実践 10問',
                                  mode: 'balanced' as const,
                                  count: 10 as const,
                                  desc: '基礎・応用・実務シナリオをバランスよく解き、合格ラインを目指しましょう。',
                                  tag: 'バランス',
                                }
                              : {
                                  title: '本番レベル実戦 20問',
                                  mode: 'exam' as const,
                                  count: 20 as const,
                                  desc: '複数要件の抽出と高度な判断を問う本番相当シナリオで総仕上げを行います。',
                                  tag: '本番レベル',
                                };
                        return (
                          <>
                            <span className="tag">
                              {rec.tag} · {rec.count}問
                            </span>
                            <h2>{rec.title}</h2>
                            <p>{rec.desc}</p>
                            <button
                              className="textbutton"
                              onClick={() => {
                                setPracticeOptions((prev) => ({
                                  ...prev,
                                  count: rec.count,
                                  difficultyMode: rec.mode,
                                }));
                                void practice({
                                  ...defaultSelectionOptions,
                                  count: rec.count,
                                  difficultyMode: rec.mode,
                                });
                              }}
                            >
                              この難易度で演習を開始 <ArrowRight size={17} />
                            </button>
                          </>
                        );
                      })()}
                    </article>
                  </section>
                  <section className="stats">
                    <Stat
                      icon={<ListChecks />}
                      value={answered.toString()}
                      label="回答問題数"
                      detail={`${new Set(attempts.map((a) => a.questionId)).size}問の問題に挑戦`}
                    />
                    <Stat
                      icon={<Target />}
                      value={answered ? `${Math.round((correct / answered) * 100)}%` : '—'}
                      label="正答率"
                      detail="これまでのすべての回答"
                    />
                    <Stat
                      icon={<Flame />}
                      value={`${streak(attempts)} 日`}
                      label="Learning Streak"
                      detail="毎日の小さな積み重ね"
                    />
                  </section>
                  <section className="dashboard-bottom">
                    <article className="panel">
                      <div className="section-title">
                        <h2>Domain別の習熟度</h2>
                        <button className="textbutton" onClick={() => navigate('Study')}>
                          教材を見る <ArrowRight size={15} />
                        </button>
                      </div>
                      <p className="caption">6 DOMAINS · 未学習Objectiveは0%で計算</p>
                      <div className="domain-list">
                        {domains.map((d, i) => (
                          <button
                            key={d.id}
                            className="domain-row"
                            onClick={() => {
                              navigate('Study');
                              setDomain(d.id);
                            }}
                          >
                            <span className="domain-number">0{i + 1}</span>
                            <div>
                              <div className="row">
                                <span>{d.name}</span>
                                <span className="muted">{Math.round(m.byDomain[d.id])}%</span>
                              </div>
                              <div className="meter">
                                <span style={{ width: `${m.byDomain[d.id]}%` }} />
                              </div>
                            </div>
                            <span className="domain-range">
                              {d.min}–{d.max}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </article>
                    <div className="stack">
                      <article className="panel">
                        <div className="section-title">
                          <h2>次に学ぶObjective</h2>
                          <Target size={18} />
                        </div>
                        {weak.slice(0, 3).map((o) => (
                          <button
                            className="objective-row"
                            key={o.id}
                            onClick={() => {
                              navigate('Study');
                              setDomain(o.domainId);
                            }}
                          >
                            <span className="tiny-dot" />
                            <span>
                              {o.title}
                              <small>{domains.find((d) => d.id === o.domainId)?.name}</small>
                            </span>
                            <ChevronRight size={17} />
                          </button>
                        ))}
                      </article>
                      <article className="panel history">
                        <div className="section-title">
                          <h2>最近の回答</h2>
                          <button className="textbutton" onClick={() => navigate('Review')}>
                            すべて <ArrowRight size={15} />
                          </button>
                        </div>
                        {attempts.length ? (
                          attempts.slice(0, 3).map((a) => (
                            <div className="history-row" key={a.id}>
                              {a.correct ? (
                                <CheckCircle2 size={18} className="green" />
                              ) : (
                                <RotateCcw size={18} className="amber" />
                              )}
                              <span>
                                {bank.find((q) => q.id === a.questionId)?.question ?? a.questionId}
                                <small>
                                  {new Date(a.at).toLocaleDateString('ja-JP')} ·{' '}
                                  {a.correct ? '正解' : '要復習'}
                                </small>
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="empty">
                            <Layers size={25} />
                            <p>
                              学習記録はここに。
                              <br />
                              まずは一問、解いてみましょう。
                            </p>
                          </div>
                        )}
                      </article>
                    </div>
                  </section>
                </>
              )}
              {tab === 'Study' && (
                <>
                  {/* Global Search */}
                  <div className="global-search">
                    <Search size={18} className="search-icon" />
                    <input
                      type="search"
                      placeholder="教材・用語・比較ガイドを検索…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {searchQuery.trim() &&
                    (() => {
                      const results = globalSearch(kb, searchQuery);
                      return results.length ? (
                        <div className="search-results">
                          {results.slice(0, 10).map((r) => (
                            <button
                              className="search-result-item"
                              key={`${r.type}-${r.id}`}
                              onClick={() => {
                                setSearchQuery('');
                                if (r.type === 'Lesson') {
                                  setStudyTab('Learn');
                                  setLessonId(r.id);
                                } else if (r.type === 'Glossary') {
                                  setStudyTab('Glossary');
                                  setGlossaryTermId(r.id);
                                } else {
                                  setStudyTab('Compare');
                                  setComparisonId(r.id);
                                }
                              }}
                            >
                              <span className={`search-result-type ${r.type.toLowerCase()}`}>
                                {r.type}
                              </span>
                              <div className="search-result-info">
                                <strong>{r.title}</strong>
                                <small>{r.detail}</small>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="panel" style={{ padding: '16px', marginBottom: '16px' }}>
                          <p>「{searchQuery}」に一致する教材はありません。</p>
                        </div>
                      );
                    })()}

                  {/* Study Sub-Tabs */}
                  {!searchQuery.trim() && (
                    <>
                      <div className="study-subtabs">
                        {(
                          [
                            ['Learn', BookOpen, 'Learn'],
                            ['Glossary', Library, '用語集'],
                            ['Compare', GitCompareArrows, '比較'],
                          ] as const
                        ).map(([id, Icon, label]) => (
                          <button
                            key={id}
                            className={studyTab === id ? 'active' : ''}
                            onClick={() => {
                              setStudyTab(id as StudyTab);
                              setLessonId(null);
                              setGlossaryTermId(null);
                              setComparisonId(null);
                            }}
                          >
                            <Icon size={17} />
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* ─── Learn Tab ─── */}
                      {studyTab === 'Learn' && (
                        <>
                          {lesson ? (
                            <article className="panel lesson">
                              <button className="textbutton" onClick={() => setLessonId(null)}>
                                ← 教材一覧
                              </button>
                              <div className="eyebrow">
                                FOUNDATION LESSON · {lesson.syllabusVersion}
                              </div>
                              <h2>{lesson.title}</h2>
                              <div className="lesson-meta">
                                {lesson.estimatedMinutes && (
                                  <span className="tag">
                                    <Timer size={13} /> {lesson.estimatedMinutes}分
                                  </span>
                                )}
                                {lesson.difficulty && (
                                  <span className="tag">
                                    {difficulty[lesson.difficulty as keyof typeof difficulty] ??
                                      lesson.difficulty}
                                  </span>
                                )}
                                {lesson.status && <span className="tag">{lesson.status}</span>}
                              </div>
                              <p>{lesson.summary}</p>
                              {lesson.sections && lesson.sections.length > 0 && (
                                <div className="lesson-sections">
                                  {lesson.sections.map((s, i) => (
                                    <div className="lesson-section" key={i}>
                                      <h3>{s.heading}</h3>
                                      <p>{s.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {[
                                ['重要ポイント', lesson.keyPoints],
                                ['よくある間違い', lesson.commonMistakes],
                                ['試験対策のヒント', lesson.examTips],
                              ].map(([title, items]) => (
                                <section key={title as string}>
                                  <h3>{title as string}</h3>
                                  <ul>
                                    {(items as string[]).map((text) => (
                                      <li key={text}>{text}</li>
                                    ))}
                                  </ul>
                                </section>
                              ))}
                              {lesson.glossaryIds && lesson.glossaryIds.length > 0 && (
                                <div className="lesson-glossary-links">
                                  <h3>関連用語</h3>
                                  <div className="related-links">
                                    {lesson.glossaryIds.map((gid) => {
                                      const term = glossaryTerms.find((g) => g.id === gid);
                                      return term ? (
                                        <button
                                          className="related-link"
                                          key={gid}
                                          onClick={() => {
                                            setStudyTab('Glossary');
                                            setGlossaryTermId(gid);
                                            setLessonId(null);
                                          }}
                                        >
                                          <Library size={14} />
                                          {term.term}
                                        </button>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                              {lesson.comparisonIds && lesson.comparisonIds.length > 0 && (
                                <div className="lesson-glossary-links">
                                  <h3>関連比較ガイド</h3>
                                  <div className="related-links">
                                    {lesson.comparisonIds.map((cid) => {
                                      const cmp = comparisonGuides.find((c) => c.id === cid);
                                      return cmp ? (
                                        <button
                                          className="related-link"
                                          key={cid}
                                          onClick={() => {
                                            setStudyTab('Compare');
                                            setComparisonId(cid);
                                            setLessonId(null);
                                          }}
                                        >
                                          <GitCompareArrows size={14} />
                                          {cmp.title}
                                        </button>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                              <h3>関連Objective</h3>
                              {lesson.relatedObjectives.map((id) => (
                                <p key={id}>{objectives.find((o) => o.id === id)?.title}</p>
                              ))}
                              <h3>Official Sources</h3>
                              {sourceLinks(lesson.officialSources)}
                              <p className="caption">
                                確認日 {lesson.lastVerifiedAt} · 初期教材は分野の一部を扱います。
                              </p>
                              <button
                                className="primary"
                                onClick={() =>
                                  start(questions.filter((q) => q.domainId === lesson.domainId))
                                }
                              >
                                この分野を演習する <ArrowRight size={17} />
                              </button>
                            </article>
                          ) : (
                            <>
                              <div className="filterline">
                                <label>
                                  Domain
                                  <select
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                  >
                                    <option value="all">すべての分野</option>
                                    {domains.map((d) => (
                                      <option value={d.id} key={d.id}>
                                        {d.name}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <span className="muted">
                                  {lessons.length}教材 / {objectives.length} Objectives ·
                                  収録範囲を順次拡充
                                </span>
                              </div>
                              <div className="study-grid">
                                {domains
                                  .filter((d) => domain === 'all' || d.id === domain)
                                  .map((d) => (
                                    <article className="panel" key={d.id}>
                                      <div className="row">
                                        <span className="domain-number">0{d.id.slice(1)}</span>
                                        <span className="tag">
                                          {d.min}–{d.max}%
                                        </span>
                                      </div>
                                      <h2>{d.title}</h2>
                                      <p className="caption">{d.name}</p>
                                      {d.objectives.map((o) => (
                                        <div className="syllabus-objective" key={o.id}>
                                          <h3>{o.title}</h3>
                                          {lessons
                                            .filter((l) => l.relatedObjectives.includes(o.id))
                                            .map((l) => (
                                              <button
                                                className="lesson-link"
                                                key={l.id}
                                                onClick={() => setLessonId(l.id)}
                                              >
                                                <BookOpen size={16} />
                                                {l.title}
                                                <ChevronRight size={16} />
                                              </button>
                                            ))}
                                          {!lessons.some((l) =>
                                            l.relatedObjectives.includes(o.id),
                                          ) && (
                                            <span className="caption">
                                              教材未収録 ·{' '}
                                              <a
                                                href={sources[0].url}
                                                target="_blank"
                                                rel="noreferrer"
                                              >
                                                公式範囲を確認 ↗
                                              </a>
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                      <details>
                                        <summary>シラバスの対象トピック</summary>
                                        <div className="chips">
                                          {d.topics.map((t) => (
                                            <span className="tag" key={t}>
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      </details>
                                    </article>
                                  ))}
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* ─── Glossary Tab ─── */}
                      {studyTab === 'Glossary' && (
                        <>
                          {glossaryTermId ? (
                            (() => {
                              const term = glossaryTerms.find((g) => g.id === glossaryTermId);
                              if (!term) return null;
                              return (
                                <article className="panel glossary-detail">
                                  <button
                                    className="textbutton"
                                    onClick={() => setGlossaryTermId(null)}
                                  >
                                    ← 用語一覧
                                  </button>
                                  <div className="term-header" style={{ marginBottom: '8px' }}>
                                    <h2>{term.term}</h2>
                                    <span className={`importance-badge ${term.importance}`}>
                                      {importanceLabels[term.importance]}
                                    </span>
                                  </div>
                                  <div className="full-name">{term.fullName}</div>
                                  <div className="detail-section">
                                    <h3>定義</h3>
                                    <p>{term.detailedDefinition}</p>
                                  </div>
                                  <div className="detail-section">
                                    <h3>GH-300で重要な理由</h3>
                                    <p>{term.whyItMatters}</p>
                                  </div>
                                  {term.useCases.length > 0 && (
                                    <div className="detail-section">
                                      <h3>利用場面</h3>
                                      <ul>
                                        {term.useCases.map((u) => (
                                          <li key={u}>{u}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {term.examPoints.length > 0 && (
                                    <div className="detail-section">
                                      <h3>試験ポイント</h3>
                                      <ul>
                                        {term.examPoints.map((e) => (
                                          <li key={e}>{e}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {term.commonConfusions.length > 0 && (
                                    <div className="detail-section">
                                      <h3>混同しやすい用語</h3>
                                      <ul>
                                        {term.commonConfusions.map((c) => (
                                          <li key={c}>{c}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {term.relatedTermIds.length > 0 && (
                                    <div className="detail-section">
                                      <h3>関連用語</h3>
                                      <div className="related-links">
                                        {term.relatedTermIds.map((rid) => {
                                          const rt = glossaryTerms.find((g) => g.id === rid);
                                          return rt ? (
                                            <button
                                              className="related-link"
                                              key={rid}
                                              onClick={() => setGlossaryTermId(rid)}
                                            >
                                              <Library size={14} />
                                              {rt.term}
                                            </button>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  {term.lessonIds.length > 0 && (
                                    <div className="detail-section">
                                      <h3>関連教材</h3>
                                      <div className="related-links">
                                        {term.lessonIds.map((lid) => {
                                          const l = lessons.find((les) => les.id === lid);
                                          return l ? (
                                            <button
                                              className="related-link"
                                              key={lid}
                                              onClick={() => {
                                                setStudyTab('Learn');
                                                setLessonId(lid);
                                                setGlossaryTermId(null);
                                              }}
                                            >
                                              <BookOpen size={14} />
                                              {l.title}
                                            </button>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  {term.comparisonIds.length > 0 && (
                                    <div className="detail-section">
                                      <h3>関連比較ガイド</h3>
                                      <div className="related-links">
                                        {term.comparisonIds.map((cid) => {
                                          const c = comparisonGuides.find((cmp) => cmp.id === cid);
                                          return c ? (
                                            <button
                                              className="related-link"
                                              key={cid}
                                              onClick={() => {
                                                setStudyTab('Compare');
                                                setComparisonId(cid);
                                                setGlossaryTermId(null);
                                              }}
                                            >
                                              <GitCompareArrows size={14} />
                                              {c.title}
                                            </button>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  {term.sourceIds.length > 0 && (
                                    <div className="detail-section">
                                      <h3>Official Sources</h3>
                                      {sourceLinks(term.sourceIds)}
                                    </div>
                                  )}
                                </article>
                              );
                            })()
                          ) : (
                            <>
                              <div className="glossary-filters">
                                <input
                                  type="search"
                                  placeholder="用語を検索…"
                                  value={glossaryFilter.keyword ?? ''}
                                  onChange={(e) =>
                                    setGlossaryFilter({
                                      ...glossaryFilter,
                                      keyword: e.target.value,
                                    })
                                  }
                                  style={{
                                    padding: '8px 12px',
                                    background: '#202833',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'var(--text)',
                                    fontSize: '14px',
                                    flex: 1,
                                    minWidth: '150px',
                                  }}
                                />
                                <select
                                  value={glossaryFilter.domainId ?? 'all'}
                                  onChange={(e) =>
                                    setGlossaryFilter({
                                      ...glossaryFilter,
                                      domainId: e.target.value,
                                    })
                                  }
                                >
                                  <option value="all">全Domain</option>
                                  {domains.map((d) => (
                                    <option key={d.id} value={d.id}>
                                      {d.name}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={glossaryFilter.importance ?? ''}
                                  onChange={(e) =>
                                    setGlossaryFilter({
                                      ...glossaryFilter,
                                      importance: (e.target.value ||
                                        undefined) as GlossaryFilter['importance'],
                                    })
                                  }
                                >
                                  <option value="">全重要度</option>
                                  <option value="essential">必須</option>
                                  <option value="important">重要</option>
                                  <option value="supplementary">補助</option>
                                </select>
                              </div>
                              <p className="caption" style={{ marginBottom: '12px' }}>
                                {searchGlossary(glossaryTerms, glossaryFilter).length} /{' '}
                                {glossaryTerms.length} 用語
                              </p>
                              <div className="glossary-grid">
                                {searchGlossary(glossaryTerms, glossaryFilter).map((g) => (
                                  <button
                                    className="glossary-card"
                                    key={g.id}
                                    onClick={() => setGlossaryTermId(g.id)}
                                  >
                                    <div className="term-header">
                                      <h3>{g.term}</h3>
                                      <span className={`importance-badge ${g.importance}`}>
                                        {importanceLabels[g.importance]}
                                      </span>
                                    </div>
                                    <p>{g.shortDefinition}</p>
                                    <span className="caption">{g.category}</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* ─── Compare Tab ─── */}
                      {studyTab === 'Compare' && (
                        <>
                          {comparisonId ? (
                            (() => {
                              const cmp = comparisonGuides.find((c) => c.id === comparisonId);
                              if (!cmp) return null;
                              return (
                                <article className="panel comparison-detail">
                                  <button
                                    className="textbutton"
                                    onClick={() => setComparisonId(null)}
                                  >
                                    ← 比較一覧
                                  </button>
                                  <div className="eyebrow">COMPARISON GUIDE</div>
                                  <h2>{cmp.title}</h2>
                                  <p>{cmp.summary}</p>
                                  <h3>比較表</h3>
                                  <table className="comparison-table">
                                    <thead>
                                      <tr>
                                        <th>観点</th>
                                        {cmp.comparedTermIds.map((tid) => {
                                          const t = glossaryTerms.find((g) => g.id === tid);
                                          return <th key={tid}>{t?.term ?? tid}</th>;
                                        })}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {cmp.comparisonAxes.map((axis) => (
                                        <tr key={axis.axis}>
                                          <td style={{ fontWeight: 600, color: 'var(--text)' }}>
                                            {axis.axis}
                                          </td>
                                          {axis.values.map((v, i) => {
                                            const parts = v.split(': ');
                                            return (
                                              <td key={i}>
                                                {parts.length > 1 ? parts.slice(1).join(': ') : v}
                                              </td>
                                            );
                                          })}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  <h3>判断ガイド</h3>
                                  {cmp.decisionGuide.map((d) => (
                                    <div className="decision-guide-item" key={d}>
                                      {d}
                                    </div>
                                  ))}
                                  {cmp.commonTraps.length > 0 && (
                                    <>
                                      <h3>よくある落とし穴</h3>
                                      <ul>
                                        {cmp.commonTraps.map((t) => (
                                          <li key={t}>{t}</li>
                                        ))}
                                      </ul>
                                    </>
                                  )}
                                  {cmp.examTips.length > 0 && (
                                    <>
                                      <h3>試験対策のヒント</h3>
                                      <ul>
                                        {cmp.examTips.map((t) => (
                                          <li key={t}>{t}</li>
                                        ))}
                                      </ul>
                                    </>
                                  )}
                                  {cmp.comparedTermIds.length > 0 && (
                                    <div style={{ marginTop: '16px' }}>
                                      <h3>関連用語</h3>
                                      <div className="related-links">
                                        {cmp.comparedTermIds.map((tid) => {
                                          const t = glossaryTerms.find((g) => g.id === tid);
                                          return t ? (
                                            <button
                                              className="related-link"
                                              key={tid}
                                              onClick={() => {
                                                setStudyTab('Glossary');
                                                setGlossaryTermId(tid);
                                                setComparisonId(null);
                                              }}
                                            >
                                              <Library size={14} />
                                              {t.term}
                                            </button>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  {cmp.lessonIds.length > 0 && (
                                    <div style={{ marginTop: '16px' }}>
                                      <h3>関連教材</h3>
                                      <div className="related-links">
                                        {cmp.lessonIds.map((lid) => {
                                          const l = lessons.find((les) => les.id === lid);
                                          return l ? (
                                            <button
                                              className="related-link"
                                              key={lid}
                                              onClick={() => {
                                                setStudyTab('Learn');
                                                setLessonId(lid);
                                                setComparisonId(null);
                                              }}
                                            >
                                              <BookOpen size={14} />
                                              {l.title}
                                            </button>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  <h3>Official Sources</h3>
                                  {sourceLinks(cmp.sourceIds)}
                                </article>
                              );
                            })()
                          ) : (
                            <>
                              <p className="caption" style={{ marginBottom: '12px' }}>
                                {comparisonGuides.length} Comparison Guides ·
                                似た機能の使い分けを学ぶ
                              </p>
                              <div className="comparison-grid">
                                {comparisonGuides.map((c) => (
                                  <button
                                    className="comparison-card"
                                    key={c.id}
                                    onClick={() => setComparisonId(c.id)}
                                  >
                                    <span className="vs-badge">
                                      <GitCompareArrows size={15} /> COMPARISON
                                    </span>
                                    <h3>{c.title}</h3>
                                    <p
                                      style={{ color: 'var(--muted)', margin: 0, fontSize: '14px' }}
                                    >
                                      {c.summary}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
              {tab === 'Practice' && !q && practiceSummary && (
                <PracticeResult
                  run={practiceSummary}
                  attempts={attempts}
                  onRetry={() => practice(practiceSummary.options)}
                  onWeak={quickWeak}
                  onWrong={() => {
                    const wrongIds = new Set(
                      practiceSummary.answers.filter((a) => !a.correct).map((a) => a.questionId),
                    );
                    start(
                      practiceSummary.questions.filter((q) => wrongIds.has(q.id)),
                      practiceSummary.options,
                    );
                  }}
                  onHome={() => navigate('Home')}
                  onLesson={readLesson}
                />
              )}
              {tab === 'Practice' && !q && !practiceSummary && (
                <>
                  <PracticeSetup
                    options={practiceOptions}
                    onChange={changePracticeOptions}
                    onStart={() => practice()}
                    ready={settingsReady && !busy}
                    verifiedCount={questions.length}
                  />
                  <button
                    className="textbutton"
                    onClick={() => {
                      setAiOpen(true);
                      setAiMode('generate');
                    }}
                  >
                    <Sparkles size={17} />
                    AIでObjectiveの問題を生成する
                  </button>
                </>
              )}
              {tab === 'Mock' && !activeMock && (
                <>
                  {session?.completed ? (
                    <article className="panel">
                      <span className="eyebrow">MOCK RESULTS</span>
                      <h2>模試、おつかれさまでした。</h2>
                      <p className="caption">
                        指定{session.requestedCount ?? session.questions.length}問 / 実施
                        {session.questions.length}問
                      </p>
                      {session.notices?.length ? (
                        <p className="notice">{session.notices.join(' ')}</p>
                      ) : null}
                      <div className="result-score">
                        {Math.round(
                          (session.questions.filter((q) => score(q, session.answers[q.id] ?? []))
                            .length /
                            session.questions.length) *
                            100,
                        )}
                        <small>% 正答率</small>
                      </div>
                      <p>未回答は不正解として集計しています。</p>
                      {[...domains.map((d) => ({ id: d.id, title: d.name })), ...objectives].map(
                        (group) => {
                          const qs = session.questions.filter(
                            (q) => q.domainId === group.id || q.objectiveId === group.id,
                          );
                          return qs.length ? (
                            <div className="result-row" key={group.id}>
                              <span>{'title' in group ? group.title : ''}</span>
                              <strong>
                                {Math.round(
                                  (qs.filter((q) => score(q, session.answers[q.id] ?? [])).length /
                                    qs.length) *
                                    100,
                                )}
                                %
                              </strong>
                            </div>
                          ) : null;
                        },
                      )}
                      <h3>苦手領域・間違えた問題と推奨教材</h3>
                      {session.questions
                        .filter((q) => !score(q, session.answers[q.id] ?? []))
                        .map((q) => (
                          <div className="review-row" key={q.id}>
                            <p>{q.question}</p>
                            <div className="actions">
                              <button
                                onClick={() => {
                                  const a = session.answers[q.id] ?? [];
                                  start([q]);
                                  setSelected(a);
                                  setRevealed(true);
                                }}
                              >
                                回答と解説
                              </button>
                              <button onClick={() => readLesson(q.domainId)}>復習Lesson</button>
                            </div>
                          </div>
                        ))}
                      <button className="primary" onClick={() => setSession(null)}>
                        模試一覧へ
                      </button>
                    </article>
                  ) : (
                    <div className="mock-grid">
                      <article className="panel">
                        <span className="eyebrow">PUT YOUR KNOWLEDGE TO WORK</span>
                        <h2>本番を意識して、力試し。</h2>
                        <p>
                          終了まで正解を表示しない、時間制限付きの模試。中断しても、この端末で再開できます。
                        </p>
                        <CountPicker value={count} onChange={setCount} />
                        <p className="caption">
                          アプリ独自の制限時間: 1問90秒。公式試験の時間ではありません。
                        </p>
                        <div className="actions">
                          <button className="primary" disabled={busy} onClick={() => beginMock()}>
                            模試を開始する <ArrowRight size={17} />
                          </button>
                          <button onClick={() => beginMock(5)}>5問のミニ模試</button>
                        </div>
                        <div className="notice">
                          Verified問題は現在{questions.length}
                          問です。候補不足時は実施問題数と配分を調整して表示します。収録目標は約200問です。
                        </div>
                        {sessions
                          .filter((s) => !s.completed)
                          .map((s) => (
                            <button
                              className="resume"
                              key={s.id}
                              onClick={() => {
                                setSession(s);
                                setNotice(s.notices?.join(' ') ?? '');
                                setSelected(s.answers[s.questions[s.index].id] ?? []);
                              }}
                            >
                              中断した模試を再開 · {s.index + 1}/{s.questions.length}{' '}
                              <ArrowRight size={17} />
                            </button>
                          ))}
                        {sessions
                          .filter((s) => s.completed)
                          .map((s) => (
                            <button className="resume" key={s.id} onClick={() => setSession(s)}>
                              過去の結果 ·{' '}
                              {new Date(s.deadline - s.questions.length * 90000).toLocaleDateString(
                                'ja-JP',
                              )}{' '}
                              <ChevronRight size={17} />
                            </button>
                          ))}
                      </article>
                      <article className="panel">
                        <h2>出題配分</h2>
                        <p className="caption">
                          {count <= 10
                            ? '5・10問は比率を重みにしたランダム出題'
                            : '20・30・50問は、開始時にレンジ内の整数配分を抽選'}
                        </p>
                        {Number.isInteger(count) && count > 0 && count <= 200 && (
                          <>
                            {domains.map((d, i) => (
                              <div className="allocation" key={d.id}>
                                <span>
                                  {d.name}
                                  <small>
                                    {d.min}–{d.max}%
                                  </small>
                                </span>
                                <strong>
                                  {Math.round(((d.min + d.max) / 2 / 95) * 1000) / 10}% weight
                                </strong>
                              </div>
                            ))}
                          </>
                        )}
                      </article>
                    </div>
                  )}
                </>
              )}
              {tab === 'Review' && (
                <>
                  {completedPractice.length > 0 && (
                    <article className="panel">
                      <h2>Practiceの結果</h2>
                      {[...completedPractice]
                        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
                        .slice(0, 10)
                        .map((run) => (
                          <button
                            key={run.id}
                            className="resume"
                            onClick={() => {
                              navigate('Practice');
                              setPracticeSummary(run);
                            }}
                          >
                            {new Date(run.startedAt).toLocaleString('ja-JP')} ·{' '}
                            {run.answers.filter((a) => a.correct).length}/{run.questions.length}{' '}
                            正解
                            <ArrowRight size={16} />
                          </button>
                        ))}
                    </article>
                  )}
                  <div className="section-title">
                    <h2>学びを、定着させる。</h2>
                    <button
                      className="textbutton"
                      onClick={() => {
                        setAiOpen(true);
                        setAiMode('weakness');
                      }}
                    >
                      <Sparkles size={17} />
                      AIで間違い傾向を振り返る
                    </button>
                  </div>
                  <div className="actions">
                    <button
                      onClick={() =>
                        start(
                          questions.filter(
                            (q) => attempts.find((a) => a.questionId === q.id)?.correct === false,
                          ),
                        )
                      }
                    >
                      間違えた問題を解く
                    </button>
                    <button
                      onClick={() =>
                        start(bank.filter((q) => bookmarks.some((b) => b.id === q.id)))
                      }
                    >
                      ブックマークを解く ({bookmarks.length})
                    </button>
                  </div>
                  <article className="panel review-list">
                    {attempts.length ? (
                      attempts.map((a) => (
                        <div className="review-row" key={a.id}>
                          <div className="row">
                            <span className={a.correct ? 'green' : 'amber'}>
                              {a.correct ? '✓ 正解' : '↻ 要復習'} ·{' '}
                              {a.status === 'verified' ? 'Verified' : 'AI生成'}
                            </span>
                            <span className="caption">
                              {new Date(a.at).toLocaleString('ja-JP')}
                            </span>
                          </div>
                          <p>{bank.find((q) => q.id === a.questionId)?.question ?? a.questionId}</p>
                          <button
                            className="textbutton"
                            onClick={() => {
                              const item = bank.find((q) => q.id === a.questionId);
                              if (item) {
                                start([item]);
                                setSelected(a.answer);
                                setRevealed(true);
                              }
                            }}
                          >
                            回答と解説を見る <ArrowRight size={15} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty">
                        <BookOpen />
                        <h3>まだ回答履歴がありません</h3>
                        <p>演習をはじめると、正解も間違いも学びの記録になります。</p>
                        <button className="primary" onClick={() => navigate('Practice')}>
                          問題を解く
                        </button>
                      </div>
                    )}
                  </article>
                  {generated.length > 0 && (
                    <article className="panel">
                      <h2>保存済みのAI生成問題 · 未検証</h2>
                      {generated.map((q) => (
                        <button className="resume" key={q.id} onClick={() => start([q])}>
                          {q.question}
                          <ArrowRight size={16} />
                        </button>
                      ))}
                    </article>
                  )}
                </>
              )}
            </>
          )}
          <footer>
            <span>
              <Code2 size={15} /> CertMaster <span className="muted">/</span> Built for your next
              step.
            </span>
            <span>非公式の学習アプリ · GitHub / Microsoftとは無関係です</span>
          </footer>
        </main>
      </div>
      <nav className="bottomnav" aria-label="モバイルナビゲーション">
        {nav.map(({ id, icon: Icon }) => (
          <button
            key={id}
            aria-current={tab === id ? 'page' : undefined}
            className={tab === id ? 'active' : ''}
            onClick={() => navigate(id)}
          >
            <Icon size={20} />
            {id}
          </button>
        ))}
      </nav>
      {aiOpen && (
        <dialog
          ref={dialogRef}
          onCancel={() => setAiOpen(false)}
          className="ai-dialog"
          aria-labelledby="ai-title"
        >
          <div className="row">
            <h2 id="ai-title">
              <Sparkles size={22} /> AI Tutor
            </h2>
            <button className="iconbutton" aria-label="AIを閉じる" onClick={() => setAiOpen(false)}>
              <X />
            </button>
          </div>
          <p>公式資料に基づく学習補助です。AI生成の回答・問題は未検証です。</p>
          <label>
            サポート内容
            <select value={aiMode} onChange={(e) => setAiMode(e.target.value)}>
              <option value="explain">問題の追加解説</option>
              <option value="term">用語を質問</option>
              <option value="similar">類題を生成</option>
              <option value="generate">Objectiveの問題を生成</option>
              <option value="weakness">間違い傾向の解説</option>
            </select>
          </label>
          <label>
            質問・補足
            <textarea
              maxLength={2000}
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              placeholder="どの部分を詳しく知りたいですか？"
            />
          </label>
          <button className="primary" disabled={busy || !online} onClick={() => tutor()}>
            {busy ? '確認しています…' : 'AIに送信する'}
            <ArrowRight size={17} />
          </button>
          <div className="ai-output" role="status">
            {aiAnswer}
          </div>
          <p className="caption">
            オンライン接続とサーバー側のAI設定が必要です。送信した質問はAI提供元で処理されます。
          </p>
        </dialog>
      )}
    </div>
  );
}
function Stat({
  icon,
  value,
  label,
  detail,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <article className="panel stat">
      <span className="stat-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}
