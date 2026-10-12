'use client';
import { ArrowRight, Target, Sparkles, CheckCircle2, RotateCcw, BookOpen, GitCompareArrows, Clock } from 'lucide-react';
import { objectives } from '@/lib/content';
import type { Attempt } from '@/lib/learning';
import { practiceResult, improvedObjectives, type PracticeRun } from '@/lib/practice-session';
import type { RecommendedAction } from '@/lib/adaptive-learning';

export default function PracticeResult({
  run,
  attempts,
  nextActions,
  onExecuteAction,
  onRetry,
  onWeak,
  onWrong,
  onHome,
  onLesson,
}: {
  run: PracticeRun;
  attempts: Attempt[];
  nextActions?: { primary: RecommendedAction; secondary: RecommendedAction[] } | null;
  onExecuteAction?: (action: RecommendedAction) => void;
  onRetry: () => void;
  onWeak: () => void;
  onWrong: () => void;
  onHome: () => void;
  onLesson: (domainId: string) => void;
}) {
  const result = practiceResult(run),
    improved = improvedObjectives(run, attempts);
  return (
    <article className="panel practice-result">
      <div className="row">
        <span className="eyebrow">PRACTICE COMPLETE</span>
        <span className="ai-insight-badge">
          <Sparkles size={14} /> AI INSIGHT
        </span>
      </div>
      <h2>今回の学習結果</h2>
      <div className="result-score">
        {result.correct} / {result.total}
        <small>Correct</small>
      </div>
      <p className="result-accuracy">正答率 {Math.round(result.accuracy)}%</p>
      <p className="caption">
        {run.options.mode} · 指定{run.options.count}問 / 実施{result.total}問
        {run.options.count === 50 ? ' · 本番想定のPractice（即時解説）' : ''}
      </p>

      {/* Recommended Next Action (要件6) */}
      {nextActions && (
        <div className="recommended-next-action-card">
          <div className="r-action-header">
            <span className="eyebrow">RECOMMENDED NEXT ACTION</span>
            <span className="r-badge-primary">推奨アクション</span>
          </div>
          <div className="primary-action-box">
            <h4>{nextActions.primary.title}</h4>
            <p>{nextActions.primary.description}</p>
            <button
              className="primary r-action-btn"
              onClick={() => onExecuteAction && onExecuteAction(nextActions.primary)}
            >
              {nextActions.primary.type === 'review_due' && <Clock size={16} />}
              {nextActions.primary.type === 'review_confusion' && <RotateCcw size={16} />}
              {nextActions.primary.type === 'read_comparison' && <GitCompareArrows size={16} />}
              {nextActions.primary.type === 'read_lesson' && <BookOpen size={16} />}
              {nextActions.primary.type === 'strengthen_weakness' && <Target size={16} />}
              <span>{nextActions.primary.badge ? `${nextActions.primary.badge}: 開始` : 'このアクションを実行'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {nextActions.secondary.length > 0 && (
            <div className="secondary-actions-list">
              <span className="sublabel">その他の推奨候補</span>
              {nextActions.secondary.map((sec) => (
                <button
                  key={sec.id}
                  className="secondary-action-item"
                  onClick={() => onExecuteAction && onExecuteAction(sec)}
                >
                  <div className="sec-text">
                    <strong>{sec.title}</strong>
                    <small>{sec.description}</small>
                  </div>
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <h3>難易度別結果 (Difficulty Analytics)</h3>
      <div className="difficulty-results-grid">
        {result.byDifficulty.map((d) => (
          <div key={d.difficulty} className={`diff-card diff-${d.difficulty}`}>
            <span className="diff-label">{d.label}</span>
            <strong className="diff-score">
              {d.correct} / {d.total}
            </strong>
            <span className="diff-pct">{Math.round((d.correct / d.total) * 100)}%</span>
          </div>
        ))}
      </div>
      <h3>Domain別結果</h3>
      {result.byDomain.map((d) => (
        <div key={d.id} className="result-row">
          <span>{d.title}</span>
          <strong>
            {d.correct} / {d.total} · {Math.round((d.correct / d.total) * 100)}%
          </strong>
        </div>
      ))}
      <h3>今回改善したObjective</h3>
      <p className="caption">
        回答履歴の平滑化スコアの変化です。能力の向上を断定するものではありません。
      </p>
      {improved.length ? (
        improved.map((o) => (
          <div className="result-row" key={o.id}>
            <span>{o.title}</span>
            <strong className="green">
              {o.before.toFixed(1)} → {o.after.toFixed(1)}
            </strong>
          </div>
        ))
      ) : (
        <p>今回、スコアの上昇が確認されたObjectiveはありません。</p>
      )}
      <h3>間違えたObjective</h3>
      {result.wrongObjectiveIds.length ? (
        result.wrongObjectiveIds.map((id) => (
          <p key={id}>{objectives.find((o) => o.id === id)?.title ?? id}</p>
        ))
      ) : (
        <p>今回はすべて正解しました。</p>
      )}
      <h3>復習推奨項目</h3>
      {result.recommendedLessons.length ? (
        result.recommendedLessons.map((l) => (
          <button className="resume" key={l.id} onClick={() => onLesson(l.domainId)}>
            {l.title}
            <ArrowRight size={17} />
          </button>
        ))
      ) : (
        <p>次の5問で、別のObjectiveも確認しましょう。</p>
      )}
      <div className="quick-retry">
        <button className="primary" onClick={onWeak}>
          <Target size={18} />
          苦手分野を5問
        </button>
        <button onClick={onRetry}>同じ条件でもう一度</button>
        <button onClick={onWrong} disabled={!result.wrongObjectiveIds.length}>
          間違えた問題だけ復習
        </button>
        <button onClick={onHome}>Homeへ戻る</button>
      </div>
    </article>
  );
}
