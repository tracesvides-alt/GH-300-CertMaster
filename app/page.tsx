'use client';
import { answerExplanation } from '@/lib/answer-explanation';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowLeft,
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
  AlertTriangle,
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
  allQuestions,
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
import { db, markLessonCompleted, toggleLessonCompleted, recordAttemptAdaptive, getCurrentConfusionPairs } from '@/lib/db';
import { getLessonNav } from '@/lib/lesson-nav';
import { LessonFooterNav } from './components/lesson-footer-nav';
import { StudyItemNav } from './components/study-item-nav';
import { ScrollToTopBtn } from './components/scroll-to-top-btn';
import { LessonReadingCompanion } from './components/lesson-reading-companion';
import { ItemReadingCompanion } from './components/item-reading-companion';
import { ResumeLearningCard } from './components/resume-learning-card';
import { choiceLabel, answerLabels } from '@/lib/choice-labels';
import { withTimeout } from '@/lib/with-timeout';
import { mastery, score, streak,attemptFormat,formatAccuracy, type Attempt } from '@/lib/learning';
import {isMultiSelect,requiredSelectionCount,validSelection,toggleSelection} from '@/lib/question-format';
import { withCurrentAttemptClassification, withCurrentQuestionClassification } from '@/lib/question-classification';
import { isQuestionActive, withoutDeletedSessionQuestions, getQuestionRetirement } from '@/lib/question-availability';
import PracticeSetup, { CountPicker } from './components/practice-setup';
import PracticeResult from './components/practice-result';
import FormatAnalytics from './components/format-analytics';
import WrongAnswerNotebook from './components/wrong-answer-notebook';
import ConceptConfusionMap from './components/concept-confusion-map';
import SpacedRepetitionCard from './components/spaced-repetition-card';
import {
  defaultSelectionOptions,
  selectionOptionsSchema,
  selectQuestions,
  selectMockQuestions,
  calculateObjectiveStats,
  type SelectionOptions,
} from '@/lib/selection';
import {
  getQuestionsForLesson,
  getQuestionsForComparison,
  getQuestionsForGlossary,
  getQuestionsForConfusionPair,
  getRecommendedNextAction,
  analyzeMistake,
} from '@/lib/adaptive-learning';
import { isDueForReview } from '@/lib/spaced-repetition';
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
const difficulty = { beginner: '基礎', intermediate: '応用', advanced: '高難度' };
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
  function scrollToTop() {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 40);
  }
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
  const [practiceOptions, setPracticeOptions] = useState<SelectionOptions>(defaultSelectionOptions);
  const [settingsReady, setSettingsReady] = useState(false);
  const [practiceRun, setPracticeRun] = useState<PracticeRun | null>(null);
  const [practiceSummary, setPracticeSummary] = useState<PracticeRun | null>(null);
  const completedPractice =
    useLiveQuery(() => db.practiceRuns.filter((r) => r.completedAt !== null).toArray(), []) ?? [];
  useEffect(() => {
    let mounted = true;
    withTimeout(db.settings.get('practice'))
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
  const attempts = useLiveQuery(async () =>
    (await db.attempts.orderBy('at').reverse().toArray()).map(withCurrentAttemptClassification), []) ?? [];
  const bookmarks = useLiveQuery(() => db.bookmarks.toArray(), []) ?? [];
  const legacyGenerated = useLiveQuery(() => db.generated.toArray(), []) ?? [];
  const sessions = useLiveQuery(async () => (await db.sessions.toArray()).map(s =>
    s.completed ? s : withoutDeletedSessionQuestions({ ...s, questions: s.questions.map(withCurrentQuestionClassification) })), []) ?? [];
  const lessonCompletions = useLiveQuery(() => db.lessonCompletions.toArray(), []) ?? [];
  const completedLessonIds = lessonCompletions.map((c) => c.id);

  // Adaptive Learning live queries & state
  const wrongAnswers = useLiveQuery(async () =>
    (await db.wrongAnswers.toArray()).map(withCurrentAttemptClassification), []) ?? [];
  const questionReviews = useLiveQuery(() => db.questionReviews.toArray(), []) ?? [];
  const confusionPairs = useLiveQuery(getCurrentConfusionPairs, []) ?? [];
  const [reviewSubTab, setReviewSubTab] = useState<'notebook' | 'confusion' | 'history'>('notebook');

  const footerNavRef = useRef<HTMLDivElement>(null);
  const lessonArticleRef = useRef<HTMLElement>(null);
  const glossaryArticleRef = useRef<HTMLElement>(null);
  const comparisonArticleRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!lessonId || !footerNavRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          void markLessonCompleted(lessonId);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(footerNavRef.current);
    return () => observer.disconnect();
  }, [lessonId]);

  useEffect(() => {
    if (!lessonId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        const nav = getLessonNav(lessonId);
        if (nav?.next) {
          void markLessonCompleted(lessonId);
          setLessonId(nav.next.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        const nav = getLessonNav(lessonId);
        if (nav?.prev) {
          setLessonId(nav.prev.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lessonId]);

  const m = mastery(attempts),
    bank = questions,
    q = session && !session.completed ? session.questions[session.index] : queue[index];
  const activeMock = !!session && !session.completed;
  const isStudyDetail = tab === 'Study' && (lessonId !== null || glossaryTermId !== null || comparisonId !== null);

  // Escキーで詳細から一覧に戻る
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName || '')) {
        return;
      }
      if (e.key === 'Escape' && isStudyDetail) {
        e.preventDefault();
        setLessonId(null);
        setGlossaryTermId(null);
        setComparisonId(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStudyDetail]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    document.querySelector<HTMLElement>('#main h1, #main h2')?.focus({ preventScroll: true });
  }, [tab, q?.id, practiceSummary?.id, lessonId, glossaryTermId, comparisonId, studyTab]);
  const answered = attempts.length,
    correct = attempts.filter((a) => a.correct).length;
  const weak = objectives
    .filter((o) => m.byObjective[o.id] < 60)
    .sort((a, b) => m.byObjective[a.id] - m.byObjective[b.id]);

  // 復習期日が到来している問題 (Spaced Repetition)
  const dueQuestions = useMemo(() => {
    const questionById = new Map(questions.map((item) => [item.id, item]));
    return questionReviews
      .filter((state) => isDueForReview(state, now))
      .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
      .flatMap((state) => {
        const item = questionById.get(state.questionId);
        return item ? [item] : [];
      });
  }, [questions, questionReviews, now]);

  // Practice完了時の Recommended Next Action (要件6)
  const practiceNextActions = useMemo(() => {
    if (!practiceSummary) return null;
    return getRecommendedNextAction(practiceSummary.answers, confusionPairs, dueQuestions.length);
  }, [practiceSummary, attempts, confusionPairs, questionReviews, now]);

  // 復習期限問題の出題ハンドラ
  function startDueReview(requestedCount: 5 | 10 | 20 = 5) {
    let list = dueQuestions;
    if (list.length === 0) {
      const reviewedQIds = questionReviews
        .filter((r) => r.totalIncorrect > 0 || r.lapseCount > 0)
        .sort((a, b) => b.reviewPriority - a.reviewPriority)
        .map((r) => r.questionId);
      list = questions.filter((item) => reviewedQIds.includes(item.id));
    }
    if (list.length === 0) {
      list = questions.slice(0, requestedCount);
    }
    const chosen = list.slice(0, requestedCount);
    start(chosen);
    setTab('Practice');
    scrollToTop();
  }

  // 教材末尾の「理解度チェック3問」ハンドラ
  function startCheckQuestions(checkQuestions: Question[]) {
    if (!checkQuestions || checkQuestions.length === 0) {
      setNotice('出題可能な確認問題が見つかりませんでした。');
      return;
    }
    start(checkQuestions);
    setTab('Practice');
    scrollToTop();
  }

  const lock = useRef(false);
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
  function start(requested: Question[], options = practiceOptions, history = attempts) {
    const list = requested.filter(q=>isQuestionActive(q)&&q.status==='verified');
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
  function showHistoricalAnswer(question: Question, answer: string[]) {
    setPracticeSummary(null);
    setPracticeRun(null);
    setQueue([question]);
    setIndex(0);
    setSelected(answer);
    setRevealed(true);
    setSession(null);
    setNotice('');
    setTab('Practice');
  }
  async function practice(options = practiceOptions) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setNotice('');
    try {
      const [history, marks, reviews, pairs] = await withTimeout(Promise.all([
        db.attempts.toArray(), db.bookmarks.toArray(),
        db.questionReviews.toArray(), getCurrentConfusionPairs(),
      ]));
      const result = selectQuestions(questions, options, {
        attempts: history,
        bookmarkIds: marks.map((b) => b.id),
        reviewStates: Object.fromEntries(reviews.map((review) => [review.questionId, review])),
        confusionQuestionIds: pairs
          .filter((pair) => pair.status !== 'Recovered')
          .flatMap((pair) => pair.relatedQuestionIds),
        recoveredQuestionIds: pairs
          .filter((pair) => pair.status === 'Recovered')
          .flatMap((pair) => pair.relatedQuestionIds),
      });
      start(result.questions, options, history);
      setNotice(
        result.questions.length
          ? result.notices.join(' ')
          : '指定した条件に合う問題がありません。復習対象やDomainの絞り込みを変更してください。',
      );
    } catch (error) {
      setNotice(error instanceof Error && error.message.includes('時間')
        ? error.message
        : '問題を読み込めませんでした。再試行してください。続く場合はアプリを再読み込みしてください。');
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
    if (!q || !validSelection(q,selected) || lock.current || revealed) return;
    lock.current = true;
    setBusy(true);
    try {
      const isCorrect = score(q, selected);
      const nowTimestamp = Date.now();
      const response: Attempt = {
        id: crypto.randomUUID(),
        questionId: q.id,
        domainId: q.domainId,
        objectiveId: q.objectiveId,
        answer: selected,
        correct: isCorrect,
        at: nowTimestamp,
        status: q.status,
        sessionId: practiceRun?.id,
        ...attemptFormat(q,selected),
      };
      const updated = practiceRun
        ? { ...practiceRun, answers: [...practiceRun.answers, response] }
        : null;

      // Adaptive Learning (Spaced Repetition, Wrong Notebook, Confusion Map)
      await recordAttemptAdaptive(q, selected, isCorrect, practiceRun?.id, nowTimestamp);
      if (updated) await db.practiceRuns.put(updated);

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
    const target = lessons.find((l) => l.domainId === d) ?? lessons.find((l) => l.id === `lesson-${d}`);
    setLessonId(target?.id ?? `lesson-${d}`);
    setTab('Study');
    setStudyTab('Learn');
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
    if(selected.length&&!validSelection(q,selected))return;
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
      const nowTimestamp = Date.now();
      await db.sessions.put(s);
      for (const question of s.questions) {
        const userAns = answers[question.id] ?? [];
        const isCorrect = score(question, userAns);
        await recordAttemptAdaptive(question, userAns, isCorrect, s.id, nowTimestamp);
      }
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
      <div className={`workspace ${isStudyDetail ? 'study-detail-active' : ''}`}>
        <header className="topbar">
          <div>
            <span className="muted">Workspace</span>
            <ChevronRight size={14} />
            <span>{tab}</span>
            {isStudyDetail && (
              <>
                <ChevronRight size={14} />
                <span className="text-cyan-400 font-medium">
                  {studyTab === 'Learn' ? '教材詳細' : studyTab === 'Glossary' ? '用語詳細' : '比較詳細'}
                </span>
              </>
            )}
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
          {notice && !(tab === 'Practice' && !q && !practiceSummary) && (
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
                    {q!.status === 'verified' ? 'Verified · 公式準拠' : q!.status==='needs-review' ? '要レビュー' : '旧生成問題 · 未検証'}
                  </span>
                  <span className="tag">{domains.find((d) => d.id === q!.domainId)?.name}</span>
                  <span className="tag">
                    {objectives.find((o) => o.id === q!.objectiveId)?.title}
                  </span>
                  <span className="tag">{difficulty[q!.difficulty]}</span>
                  {q!.examLike && <span className="tag exam-badge">シナリオ型</span>}
                  <span className="tag">
                    {isMultiSelect(q!) ? `${requiredSelectionCount(q!)}つ選択` : '単一選択'}
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
                {getQuestionRetirement(q!.id) && (
                  <aside className="notice" aria-label="旧問題について">
                    <p>この問題は旧版で、新規出題の対象外です。過去の回答と解説はそのまま確認できます。</p>
                    {!activeMock && <button className="secondary" onClick={() => {
                      const ids=getQuestionRetirement(q!.id)!.replacementIds;
                      const current=questions.filter(item=>ids.includes(item.id));
                      if(current.length){start(current);setTab('Practice');}
                    }}>関連する現行問題を解く</button>}
                  </aside>
                )}
                {isMultiSelect(q!)&&<p id="selection-counter" role="status" className="selection-counter">選択中 {selected.length} / {requiredSelectionCount(q!)} · 最大{requiredSelectionCount(q!)}つまで選択</p>}
                <fieldset disabled={revealed || busy} aria-describedby={isMultiSelect(q!)?'selection-counter':undefined}>
                  <legend className="sr-only">回答を選択</legend>
                  {q!.choices.map((c) => (
                    <label
                      key={c.id}
                      className={`choice ${selected.includes(c.id) ? 'selected' : ''} ${revealed && q!.answer.includes(c.id) ? 'correct' : ''}`}
                    >
                      <input
                        type={isMultiSelect(q!) ? 'checkbox' : 'radio'}
                        name="answer"
                        checked={selected.includes(c.id)}
                        disabled={isMultiSelect(q!)&&!selected.includes(c.id)&&selected.length>=requiredSelectionCount(q!)}
                        onChange={() => setSelected(current=>toggleSelection(q!,current,c.id))}
                      />
                      <span className="choice-letter">{choiceLabel(q!, c.id)}</span>
                      <span>{c.text}</span>
                      {revealed && q!.answer.includes(c.id) && <Check size={20} />}
                    </label>
                  ))}
                </fieldset>
                {activeMock ? (
                  <div className="actions">
                    <button disabled={session!.index === 0 || busy||(selected.length>0&&!validSelection(q!,selected))} onClick={() => moveMock(-1)}>
                      前の問題
                    </button>
                    {session!.index < session!.questions.length - 1 ? (
                      <button className="primary" disabled={busy||(selected.length>0&&!validSelection(q!,selected))} onClick={() => moveMock(1)}>
                        回答を保存して次へ <ArrowRight size={17} />
                      </button>
                    ) : (
                      <button
                        className="primary"
                        disabled={busy||(selected.length>0&&!validSelection(q!,selected))}
                        onClick={() => finishMock(session!)}
                      >
                        模試を終了する
                      </button>
                    )}
                  </div>
                ) : !revealed ? (
                  <button
                    className="primary answerbutton"
                    disabled={!validSelection(q!,selected) || busy}
                    onClick={answer}
                  >
                    回答を確認する <ArrowRight size={17} />
                  </button>
                ) : (
                  <>
                    <div className="explanation" aria-live="polite">
                      <div className="explanation-header">
                        <span className="ai-insight-badge">
                          <Sparkles size={14} /> 回答解説
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
                          <strong className="green">{answerLabels(q!, q!.answer)}</strong>
                        </div>
                        <div>
                          <span className="sublabel">あなたの回答</span>
                          <strong className={score(q!, selected) ? 'green' : 'amber'}>
                            {selected.length ? answerLabels(q!, selected) : '未選択'}
                          </strong>
                        </div>
                      </div>
                      <div className="explanation-body">
                        {isMultiSelect(q!)&&<p>選び忘れ: {answerLabels(q!,q!.answer.filter(id=>!selected.includes(id)))||'なし'} ／ 誤って選んだ項目: {answerLabels(q!,selected.filter(id=>!q!.answer.includes(id)))||'なし'}</p>}
                        <h4>Why this is correct</h4>
                        {answerExplanation(q!).split('\n\n').map((paragraph, index) => (
                          <p className="answer-reason" key={index}>{paragraph}</p>
                        ))}
                      </div>
                      <div className="choice-explanations">
                        <h4>選択肢ごとの詳細分析</h4>
                        {q!.choices.map((c) => (
                          <div
                            key={c.id}
                            className={`choice-analysis ${q!.answer.includes(c.id) ? 'is-correct' : 'is-wrong'}`}
                          >
                            <span className="choice-pill">{choiceLabel(q!, c.id)}</span>
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

                      {/* 双方向リンク: 関連教材ショートカット & 誤答時Primary Action (要件4) */}
                      {(() => {
                        const isWrong = !score(q!, selected);
                        const mistakeAnalysis = isWrong ? analyzeMistake(q!, selected) : null;
                        const relLesson =
                          lessons.find((l) => l.domainId === q!.domainId || l.relatedObjectives.includes(q!.objectiveId));
                        const relComparisons = comparisonGuides.filter((c) =>
                          c.objectiveIds.includes(q!.objectiveId) ||
                          c.lessonIds?.includes(relLesson?.id ?? '') ||
                          (mistakeAnalysis?.confusionPairIds &&
                            mistakeAnalysis.confusionPairIds.some((cpid: string) => {
                              const pair = confusionPairs.find((p) => p.id === cpid);
                              return pair && (c.comparedTermIds.includes(pair.conceptAId) || c.comparedTermIds.includes(pair.conceptBId));
                            }))
                        );
                        const relGlossaries = glossaryTerms.filter(
                          (g) =>
                            g.lessonIds?.includes(relLesson?.id ?? '') ||
                            (q!.testedConcepts && q!.testedConcepts.includes(g.id)),
                        );

                        return (
                          <div className="bidirectional-learning-box">
                            {isWrong && (
                              <div className="wrong-review-primary-card">
                                <div className="r-head">
                                  <span className="ai-insight-badge">
                                    <Sparkles size={13} /> ADAPTIVE RECOMMENDATION
                                  </span>
                                  <h4>この内容を復習（理解の抜け漏れを解消）</h4>
                                </div>
                                <p className="caption">
                                  {mistakeAnalysis && mistakeAnalysis.confusionPairIds.length > 0
                                    ? '概念の混同が検出されました。違いを比較ガイドで整理することをお勧めします。'
                                    : '解説を確認後、関連教材で基礎要件とスコープを再確認しましょう。'}
                                </p>
                                <div className="primary-actions-row">
                                  {mistakeAnalysis &&
                                  mistakeAnalysis.confusionPairIds.length > 0 &&
                                  relComparisons.length > 0 ? (
                                    <button
                                      className="primary review-now-btn"
                                      onClick={() => {
                                        setTab('Study');
                                        setStudyTab('Compare');
                                        setComparisonId(relComparisons[0].id);
                                        scrollToTop();
                                      }}
                                    >
                                      <GitCompareArrows size={16} />
                                      この内容を復習: 比較ガイドを見る
                                    </button>
                                  ) : relLesson ? (
                                    <button
                                      className="primary review-now-btn"
                                      onClick={() => {
                                        setTab('Study');
                                        setStudyTab('Learn');
                                        setLessonId(relLesson.id);
                                        scrollToTop();
                                      }}
                                    >
                                      <BookOpen size={16} />
                                      この内容を復習: 教材を読む
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            )}

                            <div className="related-study-chips">
                              <span className="chips-label">関連教材リンク:</span>
                              {relLesson && (
                                <button
                                  className="study-chip"
                                  onClick={() => {
                                    setTab('Study');
                                    setStudyTab('Learn');
                                    setLessonId(relLesson.id);
                                    scrollToTop();
                                  }}
                                >
                                  <BookOpen size={13} /> {relLesson.title}
                                </button>
                              )}
                              {relComparisons.slice(0, 2).map((c) => (
                                <button
                                  key={c.id}
                                  className="study-chip compare"
                                  onClick={() => {
                                    setTab('Study');
                                    setStudyTab('Compare');
                                    setComparisonId(c.id);
                                    scrollToTop();
                                  }}
                                >
                                  <GitCompareArrows size={13} /> {c.title}
                                </button>
                              ))}
                              {relGlossaries.slice(0, 2).map((g) => (
                                <button
                                  key={g.id}
                                  className="study-chip glossary"
                                  onClick={() => {
                                    setTab('Study');
                                    setStudyTab('Glossary');
                                    setGlossaryTermId(g.id);
                                    scrollToTop();
                                  }}
                                >
                                  <Library size={13} /> {g.term}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
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
                  <ResumeLearningCard
                    completedLessonIds={completedLessonIds}
                    onSelectLesson={(lid) => {
                      setTab('Study');
                      setStudyTab('Learn');
                      setLessonId(lid);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mb-5"
                  />
                  <SpacedRepetitionCard
                    dueCount={dueQuestions.length}
                    totalTracked={questionReviews.length}
                    onStartDueReview={startDueReview}
                    className="mb-5"
                  />
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
                                  title: '高難度チャレンジ 20問',
                                  mode: 'exam' as const,
                                  count: 20 as const,
                                  desc: '複数の条件や証拠を照らし合わせて判断する、高難度の問題に挑戦します。',
                                  tag: '高難度',
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
                  {/* Global Search (詳細表示中ではない時のみ表示) */}
                  {!isStudyDetail && (
                    <div className="global-search">
                      <Search size={18} className="search-icon" />
                      <input
                        type="search"
                        placeholder="教材・用語・比較ガイドを検索…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  )}
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
                      {!isStudyDetail && (
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
                      )}

                      {/* ─── Learn Tab ─── */}
                      {studyTab === 'Learn' && (
                        <>
                          {lesson ? (
                            <article className="panel lesson" ref={lessonArticleRef}>
                              <button
                                className="study-detail-back-btn"
                                onClick={() => {
                                  setLessonId(null);
                                  window.scrollTo({ top: 0, behavior: 'instant' });
                                }}
                              >
                                <ArrowLeft size={16} />
                                <span>教材一覧へ戻る</span>
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
                              <p className="lesson-summary">{lesson.summary}</p>
                              {/* 読了プログレスバー & 目次 (TOC) */}
                              <LessonReadingCompanion lesson={lesson} containerRef={lessonArticleRef} />
                              {lesson.sections && lesson.sections.length > 0 && (
                                <div className="lesson-sections">
                                  {lesson.sections.map((s, i) => (
                                    <div className="detail-section detail-section--learn-section lesson-section" key={i} id={`lesson-sec-${i}`}>
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><BookOpen size={15} /></span>
                                        <h3>{s.heading}</h3>
                                      </div>
                                      <p>{s.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {lesson.keyPoints.length > 0 && (
                                <section className="detail-section detail-section--keypoints" id="lesson-key-points">
                                  <div className="detail-section-header">
                                    <span className="detail-section-icon"><CheckCircle2 size={15} /></span>
                                    <h3>重要ポイント</h3>
                                  </div>
                                  <ul className="detail-section-list">
                                    {lesson.keyPoints.map((text) => (
                                      <li key={text} className="detail-section-item">
                                        <span className="item-bullet"><Check size={13} /></span>
                                        <span className="item-text">{text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </section>
                              )}

                              {lesson.commonMistakes.length > 0 && (
                                <section className="detail-section detail-section--confusions" id="lesson-common-mistakes">
                                  <div className="detail-section-header">
                                    <span className="detail-section-icon"><AlertTriangle size={15} /></span>
                                    <h3>よくある間違い・落とし穴</h3>
                                  </div>
                                  <ul className="detail-section-list">
                                    {lesson.commonMistakes.map((text) => (
                                      <li key={text} className="detail-section-item">
                                        <span className="item-bullet"><AlertTriangle size={13} /></span>
                                        <span className="item-text">{text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </section>
                              )}

                              {lesson.examTips.length > 0 && (
                                <section className="detail-section detail-section--exampoints" id="lesson-exam-tips">
                                  <div className="detail-section-header">
                                    <span className="detail-section-icon"><Lightbulb size={15} /></span>
                                    <h3>試験対策のヒント</h3>
                                  </div>
                                  <ul className="detail-section-list">
                                    {lesson.examTips.map((text) => (
                                      <li key={text} className="detail-section-item">
                                        <span className="item-bullet"><Sparkles size={13} /></span>
                                        <span className="item-text">{text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </section>
                              )}

                              {lesson.glossaryIds && lesson.glossaryIds.length > 0 && (
                                <div className="detail-section detail-section--related lesson-glossary-links" id="lesson-related-glossary">
                                  <div className="detail-section-header">
                                    <span className="detail-section-icon"><Library size={15} /></span>
                                    <h3>関連用語</h3>
                                  </div>
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
                                <div className="detail-section detail-section--related lesson-glossary-links" id="lesson-related-comparisons">
                                  <div className="detail-section-header">
                                    <span className="detail-section-icon"><GitCompareArrows size={15} /></span>
                                    <h3>関連比較ガイド</h3>
                                  </div>
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

                              {lesson.relatedObjectives && lesson.relatedObjectives.length > 0 && (
                                <div className="detail-section detail-section--related" id="lesson-related-objectives">
                                  <div className="detail-section-header">
                                    <span className="detail-section-icon"><Target size={15} /></span>
                                    <h3>関連Objective</h3>
                                  </div>
                                  <div className="objective-list">
                                    {lesson.relatedObjectives.map((id) => (
                                      <div className="objective-item" key={id}>
                                        <span className="item-bullet"><Check size={13} /></span>
                                        <span className="item-text">{objectives.find((o) => o.id === id)?.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="detail-section detail-section--related" id="lesson-official-sources">
                                <div className="detail-section-header">
                                  <span className="detail-section-icon"><FileText size={15} /></span>
                                  <h3>Official Sources</h3>
                                </div>
                                {sourceLinks(lesson.officialSources)}
                              </div>
                              <p className="caption">
                                確認日 {lesson.lastVerifiedAt} · 初期教材は分野の一部を扱います。
                              </p>
                              <div className="flex flex-wrap gap-3 my-4">
                                {/* 双方向リンク: 理解度チェック 3問 (要件4) */}
                               <div className="bidirectional-check-card my-4" id="lesson-comprehension-check">
                                 <div className="b-check-header">
                                   <Sparkles size={16} />
                                   <h4>教材の理解度チェック</h4>
                                 </div>
                                 <p className="caption">
                                   このLessonで扱った概念・用語に関する問題（未回答・要復習優先）で定着度を確認できます。
                                 </p>
                                 <div className="flex flex-wrap gap-3 mt-3">
                                   <button
                                     className="primary"
                                     onClick={() => {
                                       const checkQuestions = getQuestionsForLesson(lesson.id, 3, attempts.map((a) => a.questionId));
                                       startCheckQuestions(checkQuestions);
                                     }}
                                   >
                                     <ListChecks size={16} />
                                     理解度チェック 3問 <ArrowRight size={16} />
                                   </button>
                                   <button
                                     className="secondary"
                                     onClick={() =>
                                       start(questions.filter((q) => q.domainId === lesson.domainId))
                                     }
                                   >
                                     この分野全体を演習
                                   </button>
                                 </div>
                               </div>
                              </div>

                              {/* Lesson Navigation Footer */}
                              <div ref={footerNavRef} id="lesson-footer-nav-container">
                                <LessonFooterNav
                                  currentLessonId={lesson.id}
                                  isCompleted={completedLessonIds.includes(lesson.id)}
                                  onToggleCompleted={() => void toggleLessonCompleted(lesson.id)}
                                  onBackToList={() => {
                                    setLessonId(null);
                                    window.scrollTo({ top: 0, behavior: 'instant' });
                                  }}
                                  onSelectLesson={(nextId) => {
                                    void markLessonCompleted(lesson.id);
                                    setLessonId(nextId);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  onNavigateNext={() => {
                                    const nav = getLessonNav(lesson.id);
                                    if (nav?.next) {
                                      void markLessonCompleted(lesson.id);
                                      setLessonId(nav.next.id);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                  }}
                                  onNavigatePrev={() => {
                                    const nav = getLessonNav(lesson.id);
                                    if (nav?.prev) {
                                      setLessonId(nav.prev.id);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                  }}
                                  onStartPractice={() => {
                                    void markLessonCompleted(lesson.id);
                                    setTab('Practice');
                                    setLessonId(null);
                                    window.scrollTo({ top: 0, behavior: 'instant' });
                                  }}
                                />
                              </div>
                            </article>
                          ) : (
                            <>
                              <ResumeLearningCard
                                completedLessonIds={completedLessonIds}
                                onSelectLesson={(lid) => {
                                  setLessonId(lid);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="mb-5"
                              />
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
                                  全目標完全網羅
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
                                            .map((l) => {
                                              const isDone = completedLessonIds.includes(l.id);
                                              return (
                                                <button
                                                  className={`lesson-link ${isDone ? 'is-completed' : ''}`}
                                                  key={l.id}
                                                  onClick={() => setLessonId(l.id)}
                                                >
                                                  {isDone ? (
                                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                                  ) : (
                                                    <BookOpen size={16} className="shrink-0" />
                                                  )}
                                                  <span className="flex-1 text-left">{l.title}</span>
                                                  {isDone && (
                                                    <span className="text-[10px] bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-full font-medium shrink-0 mr-1">
                                                      読了
                                                    </span>
                                                  )}
                                                  <ChevronRight size={16} className="shrink-0 opacity-50" />
                                                </button>
                                              );
                                            })}
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
                              const glossaryTocItems = [
                                { id: 'glossary-sec-definition', title: '定義' },
                                { id: 'glossary-sec-why', title: 'GH-300で重要な理由' },
                                ...(term.useCases.length > 0 ? [{ id: 'glossary-sec-usecases', title: '利用場面' }] : []),
                                ...(term.examPoints.length > 0 ? [{ id: 'glossary-sec-exampoints', title: '試験ポイント' }] : []),
                                ...(term.commonConfusions.length > 0 ? [{ id: 'glossary-sec-confusions', title: '混同しやすい用語' }] : []),
                                ...(term.relatedTermIds.length > 0 ? [{ id: 'glossary-sec-related', title: '関連用語' }] : []),
                                ...(term.lessonIds.length > 0 ? [{ id: 'glossary-sec-lessons', title: '関連教材' }] : []),
                                ...(term.comparisonIds.length > 0 ? [{ id: 'glossary-sec-comparisons', title: '関連比較ガイド' }] : []),
                                ...(term.sourceIds.length > 0 ? [{ id: 'glossary-sec-sources', title: 'Official Sources' }] : []),
                                { id: 'glossary-sec-check', title: '確認問題 3問' },
                              ];
                              return (
                                <article className="panel glossary-detail" ref={glossaryArticleRef}>
                                  <button
                                    className="study-detail-back-btn"
                                    onClick={() => {
                                      setGlossaryTermId(null);
                                      window.scrollTo({ top: 0, behavior: 'instant' });
                                    }}
                                  >
                                    <ArrowLeft size={16} />
                                    <span>用語一覧へ戻る</span>
                                  </button>
                                  <div className="term-header" style={{ marginBottom: '8px' }}>
                                    <h2>{term.term}</h2>
                                    <span className={`importance-badge ${term.importance}`}>
                                      {importanceLabels[term.importance]}
                                    </span>
                                  </div>
                                  <div className="full-name">{term.fullName}</div>

                                  {/* 読了プログレスバー ＆ [目次] ＆ [↑] ボタン */}
                                  <ItemReadingCompanion
                                    title={term.term}
                                    items={glossaryTocItems}
                                    containerRef={glossaryArticleRef}
                                  />

                                  <div className="detail-section detail-section--definition" id="glossary-sec-definition">
                                    <div className="detail-section-header">
                                      <span className="detail-section-icon"><BookOpen size={15} /></span>
                                      <h3>定義</h3>
                                    </div>
                                    <p>{term.detailedDefinition}</p>
                                  </div>
                                  <div className="detail-section detail-section--why" id="glossary-sec-why">
                                    <div className="detail-section-header">
                                      <span className="detail-section-icon"><ShieldCheck size={15} /></span>
                                      <h3>GH-300で重要な理由</h3>
                                    </div>
                                    <p>{term.whyItMatters}</p>
                                  </div>
                                  {term.useCases.length > 0 && (
                                    <div className="detail-section detail-section--usecases" id="glossary-sec-usecases">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><Target size={15} /></span>
                                        <h3>利用場面</h3>
                                      </div>
                                      <ul className="detail-section-list">
                                        {term.useCases.map((u) => (
                                          <li key={u} className="detail-section-item">
                                            <span className="item-bullet"><ArrowRight size={13} /></span>
                                            <span className="item-text">{u}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {term.examPoints.length > 0 && (
                                    <div className="detail-section detail-section--exampoints" id="glossary-sec-exampoints">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><Lightbulb size={15} /></span>
                                        <h3>試験ポイント</h3>
                                      </div>
                                      <ul className="detail-section-list">
                                        {term.examPoints.map((e) => (
                                          <li key={e} className="detail-section-item">
                                            <span className="item-bullet"><Check size={13} /></span>
                                            <span className="item-text">{e}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {term.commonConfusions.length > 0 && (
                                    <div className="detail-section detail-section--confusions" id="glossary-sec-confusions">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><AlertTriangle size={15} /></span>
                                        <h3>混同しやすい用語・注意点</h3>
                                      </div>
                                      <ul className="detail-section-list">
                                        {term.commonConfusions.map((c) => (
                                          <li key={c} className="detail-section-item">
                                            <span className="item-bullet"><AlertTriangle size={13} /></span>
                                            <span className="item-text">{c}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {term.relatedTermIds.length > 0 && (
                                    <div className="detail-section detail-section--related" id="glossary-sec-related">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><Library size={15} /></span>
                                        <h3>関連用語</h3>
                                      </div>
                                      <div className="related-links">
                                        {term.relatedTermIds.map((rid) => {
                                          const rt = glossaryTerms.find((g) => g.id === rid);
                                          return rt ? (
                                            <button
                                              className="related-link"
                                              key={rid}
                                              onClick={() => {
                                                setGlossaryTermId(rid);
                                                window.scrollTo({ top: 0, behavior: 'instant' });
                                              }}
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
                                    <div className="detail-section detail-section--related" id="glossary-sec-lessons">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><BookOpen size={15} /></span>
                                        <h3>関連教材</h3>
                                      </div>
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
                                    <div className="detail-section detail-section--related" id="glossary-sec-comparisons">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><GitCompareArrows size={15} /></span>
                                        <h3>関連比較ガイド</h3>
                                      </div>
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
                                    <div className="detail-section detail-section--related" id="glossary-sec-sources">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><FileText size={15} /></span>
                                        <h3>Official Sources</h3>
                                      </div>
                                      {sourceLinks(term.sourceIds)}
                                    </div>
                                  )}
                                  {/* 双方向リンク: 用語の関連問題3問 (要件4) */}
                                  <div className="glossary-check-box mt-4" id="glossary-sec-check">
                                    <button
                                      className="primary"
                                      onClick={() => {
                                        const checkQuestions = getQuestionsForGlossary(term.id, 3, attempts.map((a) => a.questionId));
                                        startCheckQuestions(checkQuestions);
                                      }}
                                    >
                                      <ListChecks size={16} /> この用語の関連問題を3問解く <ArrowRight size={16} />
                                    </button>
                                  </div>

                                  {/* 用語集の前後の項目ナビゲーション */}
                                  {(() => {
                                    const termIndex = glossaryTerms.findIndex((g) => g.id === term.id);
                                    const prevTerm = termIndex > 0 ? glossaryTerms[termIndex - 1] : null;
                                    const nextTerm = termIndex >= 0 && termIndex < glossaryTerms.length - 1 ? glossaryTerms[termIndex + 1] : null;
                                    return (
                                      <StudyItemNav
                                        itemTypeLabel="用語"
                                        currentIndex={termIndex + 1}
                                        totalCount={glossaryTerms.length}
                                        badgeLabel={term.category}
                                        prev={prevTerm ? { id: prevTerm.id, title: prevTerm.term } : null}
                                        next={nextTerm ? { id: nextTerm.id, title: nextTerm.term } : null}
                                        onSelect={(id) => {
                                          setGlossaryTermId(id);
                                          window.scrollTo({ top: 0, behavior: 'instant' });
                                        }}
                                        onBackToList={() => {
                                          setGlossaryTermId(null);
                                          window.scrollTo({ top: 0, behavior: 'instant' });
                                        }}
                                      />
                                    );
                                  })()}
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
                                    onClick={() => {
                                      setGlossaryTermId(g.id);
                                      window.scrollTo({ top: 0, behavior: 'instant' });
                                    }}
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
                              const cmpTocItems = [
                                { id: 'compare-sec-summary', title: '比較概要' },
                                { id: 'compare-sec-table', title: '比較表' },
                                ...(cmp.decisionGuide && cmp.decisionGuide.length > 0 ? [{ id: 'compare-sec-decision', title: '判断ガイド' }] : []),
                                ...(cmp.examTips.length > 0 ? [{ id: 'compare-sec-tips', title: '試験対策ヒント' }] : []),
                                ...(cmp.comparedTermIds.length > 0 ? [{ id: 'compare-sec-terms', title: '関連用語' }] : []),
                                ...(cmp.lessonIds.length > 0 ? [{ id: 'compare-sec-lessons', title: '関連教材' }] : []),
                                ...(cmp.sourceIds.length > 0 ? [{ id: 'compare-sec-sources', title: 'Official Sources' }] : []),
                                { id: 'compare-sec-check', title: '確認問題 3問' },
                              ];
                              return (
                                <article className="panel comparison-detail" ref={comparisonArticleRef}>
                                  <button
                                    className="study-detail-back-btn"
                                    onClick={() => {
                                      setComparisonId(null);
                                      window.scrollTo({ top: 0, behavior: 'instant' });
                                    }}
                                  >
                                    <ArrowLeft size={16} />
                                    <span>比較ガイド一覧へ戻る</span>
                                  </button>
                                  <div className="eyebrow">COMPARISON GUIDE</div>
                                  <h2 className="comparison-title">{cmp.title}</h2>

                                  {/* 読了プログレスバー ＆ [目次] ＆ [↑] ボタン */}
                                  <ItemReadingCompanion
                                    title={cmp.title}
                                    items={cmpTocItems}
                                    containerRef={comparisonArticleRef}
                                  />

                                  <p className="comparison-summary" id="compare-sec-summary">{cmp.summary}</p>

                                  <div className="detail-section detail-section--table" id="compare-sec-table">
                                    <div className="detail-section-header">
                                      <span className="detail-section-icon"><GitCompareArrows size={15} /></span>
                                      <h3>比較表</h3>
                                    </div>
                                    <div className="comparison-table-wrapper">
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
                                              <td className="axis-label">
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
                                    </div>
                                  </div>

                                  <div className="detail-section detail-section--decision" id="compare-sec-decision">
                                    <div className="detail-section-header">
                                      <span className="detail-section-icon"><CheckCircle2 size={15} /></span>
                                      <h3>判断ガイド（どちらを選ぶべきか）</h3>
                                    </div>
                                    <div className="decision-guide-list">
                                      {cmp.decisionGuide.map((d) => (
                                        <div className="decision-guide-item" key={d}>
                                          <span className="item-bullet"><Check size={13} /></span>
                                          <span className="item-text">{d}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {cmp.commonTraps.length > 0 && (
                                    <div className="detail-section detail-section--confusions">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><AlertTriangle size={15} /></span>
                                        <h3>よくある落とし穴・混同の罠</h3>
                                      </div>
                                      <ul className="detail-section-list">
                                        {cmp.commonTraps.map((t) => (
                                          <li key={t} className="detail-section-item">
                                            <span className="item-bullet"><AlertTriangle size={13} /></span>
                                            <span className="item-text">{t}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {cmp.examTips.length > 0 && (
                                    <div className="detail-section detail-section--exampoints" id="compare-sec-tips">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><Lightbulb size={15} /></span>
                                        <h3>試験対策のヒント</h3>
                                      </div>
                                      <ul className="detail-section-list">
                                        {cmp.examTips.map((t) => (
                                          <li key={t} className="detail-section-item">
                                            <span className="item-bullet"><Sparkles size={13} /></span>
                                            <span className="item-text">{t}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {cmp.comparedTermIds.length > 0 && (
                                    <div className="detail-section detail-section--related" id="compare-sec-terms">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><Library size={15} /></span>
                                        <h3>関連用語</h3>
                                      </div>
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
                                    <div className="detail-section detail-section--related" id="compare-sec-lessons">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><BookOpen size={15} /></span>
                                        <h3>関連教材</h3>
                                      </div>
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

                                  {cmp.sourceIds.length > 0 && (
                                    <div className="detail-section detail-section--related" id="compare-sec-sources">
                                      <div className="detail-section-header">
                                        <span className="detail-section-icon"><FileText size={15} /></span>
                                        <h3>Official Sources</h3>
                                      </div>
                                      {sourceLinks(cmp.sourceIds)}
                                    </div>
                                  )}
                                  {/* 双方向リンク: 比較の関連問題3問 (要件4) */}
                                  <div className="comparison-check-box mt-4" id="compare-sec-check">
                                    <button
                                      className="primary"
                                      onClick={() => {
                                        const checkQuestions = getQuestionsForComparison(cmp.id, 3, attempts.map((a) => a.questionId));
                                        startCheckQuestions(checkQuestions);
                                      }}
                                    >
                                      <ListChecks size={16} /> この違いを3問で確認 <ArrowRight size={16} />
                                    </button>
                                  </div>

                                  {/* 比較ガイドの前後の項目ナビゲーション */}
                                  {(() => {
                                    const cmpIndex = comparisonGuides.findIndex((c) => c.id === cmp.id);
                                    const prevCmp = cmpIndex > 0 ? comparisonGuides[cmpIndex - 1] : null;
                                    const nextCmp = cmpIndex >= 0 && cmpIndex < comparisonGuides.length - 1 ? comparisonGuides[cmpIndex + 1] : null;
                                    return (
                                      <StudyItemNav
                                        itemTypeLabel="比較ガイド"
                                        currentIndex={cmpIndex + 1}
                                        totalCount={comparisonGuides.length}
                                        badgeLabel="比較ガイド"
                                        prev={prevCmp ? { id: prevCmp.id, title: prevCmp.title } : null}
                                        next={nextCmp ? { id: nextCmp.id, title: nextCmp.title } : null}
                                        onSelect={(id) => {
                                          setComparisonId(id);
                                          window.scrollTo({ top: 0, behavior: 'instant' });
                                        }}
                                        onBackToList={() => {
                                          setComparisonId(null);
                                          window.scrollTo({ top: 0, behavior: 'instant' });
                                        }}
                                      />
                                    );
                                  })()}
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
                                    onClick={() => {
                                      setComparisonId(c.id);
                                      window.scrollTo({ top: 0, behavior: 'instant' });
                                    }}
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
                  nextActions={practiceNextActions}
                  onExecuteAction={(action) => {
                    if (action.type === 'review_due') {
                      startDueReview(5);
                    } else if (action.type === 'read_comparison' && action.targetId) {
                      setTab('Study');
                      setStudyTab('Compare');
                      setComparisonId(action.targetId);
                      scrollToTop();
                    } else if (action.type === 'read_lesson' && action.targetId) {
                      setTab('Study');
                      setStudyTab('Learn');
                      setLessonId(action.targetId);
                      scrollToTop();
                    } else if (action.type === 'review_confusion' && action.targetId) {
                      const pair = confusionPairs.find((p) => p.id === action.targetId);
                      if (pair) {
                        const pairQs = getQuestionsForConfusionPair(pair, 5, attempts.map((a) => a.questionId));
                        start(pairQs);
                        setTab('Practice');
                        scrollToTop();
                      } else {
                        startDueReview(5);
                      }
                    } else if (action.type === 'strengthen_weakness') {
                      quickWeak();
                    }
                  }}
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
                    loading={busy ? '演習を準備しています…' : !settingsReady ? '設定を読み込んでいます…' : undefined}
                    notice={notice}
                    verifiedCount={questions.filter(q => q.status === 'verified').length}
                  />
                </>
              )}
              {tab === 'Mock' && !activeMock && (
                <>
                  {session?.completed ? (
                    <article className="panel">
                      <span className="eyebrow">MOCK RESULTS</span>
                      <FormatAnalytics rows={formatAccuracy(attempts.filter(a=>a.sessionId===session.id),session.questions)}/>
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
                          Verified問題は現在{questions.filter(q => q.status === 'verified').length}
                          問です。候補不足時は実施問題数と配分を調整して表示します。収録目標は約200問です。
                        </div>
                        {sessions
                          .filter((s) => !s.completed && s.questions.length > 0)
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
                        {Number.isInteger(count) && count > 0 && count <= questions.length && (
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
                  <FormatAnalytics rows={formatAccuracy(attempts,[...allQuestions,...legacyGenerated])}/>
                  <div className="review-subnav-bar">
                    <button
                      className={`subnav-tab-btn ${reviewSubTab === 'notebook' ? 'active' : ''}`}
                      onClick={() => setReviewSubTab('notebook')}
                    >
                      <RotateCcw size={16} /> 間違いノート (Notebook)
                    </button>
                    <button
                      className={`subnav-tab-btn ${reviewSubTab === 'confusion' ? 'active' : ''}`}
                      onClick={() => setReviewSubTab('confusion')}
                    >
                      <GitCompareArrows size={16} /> 概念混同マップ (Confusion Map)
                    </button>
                    <button
                      className={`subnav-tab-btn ${reviewSubTab === 'history' ? 'active' : ''}`}
                      onClick={() => setReviewSubTab('history')}
                    >
                      <ListChecks size={16} /> 回答履歴 ({attempts.length})
                    </button>
                  </div>

                  {reviewSubTab === 'notebook' && (
                    <WrongAnswerNotebook
                      wrongAnswers={wrongAnswers.filter(a=>isQuestionActive({id:a.questionId}))}
                      confusionPairs={confusionPairs}
                      allQuestions={questions}
                      attempts={attempts.filter(a=>isQuestionActive({id:a.questionId}))}
                      onStartQuickReview={(qs) => {
                        start(qs);
                        setTab('Practice');
                        scrollToTop();
                      }}
                      onSelectQuestion={(question, answer) => {
                        start([question]);
                        setSelected(answer);
                        setRevealed(true);
                        setTab('Practice');
                        scrollToTop();
                      }}
                      onNavigateToStudy={(type, id) => {
                        setTab('Study');
                        setStudyTab(type);
                        if (type === 'Learn') setLessonId(id);
                        if (type === 'Glossary') setGlossaryTermId(id);
                        if (type === 'Compare') setComparisonId(id);
                        scrollToTop();
                      }}
                    />
                  )}

                  {reviewSubTab === 'confusion' && (
                    <ConceptConfusionMap
                      confusionPairs={confusionPairs}
                      allQuestions={questions}
                      onStartQuickReview={(qs) => {
                        start(qs);
                        setTab('Practice');
                        scrollToTop();
                      }}
                      onNavigateToStudy={(type, id) => {
                        setTab('Study');
                        setStudyTab(type);
                        if (type === 'Learn') setLessonId(id);
                        if (type === 'Glossary') setGlossaryTermId(id);
                        if (type === 'Compare') setComparisonId(id);
                        scrollToTop();
                      }}
                    />
                  )}

                  {reviewSubTab === 'history' && (
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
                                  {a.status === 'verified' ? 'Verified' : a.status==='needs-review' ? '要レビュー' : '旧生成問題'}
                                </span>
                                <span className="caption">
                                  {new Date(a.at).toLocaleString('ja-JP')}
                                </span>
                              </div>
                              <p>{[...allQuestions, ...legacyGenerated].find((q) => q.id === a.questionId)?.question ?? a.questionId}</p>
                              <button
                                className="textbutton"
                                onClick={() => {
                                  const item = [...allQuestions, ...legacyGenerated].find((q) => q.id === a.questionId);
                                  if (item) {
                                    showHistoricalAnswer(item, a.answer);
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
                    </>
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
        <ScrollToTopBtn />
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
