'use client';
import { RotateCcw, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface SpacedRepetitionCardProps {
  dueCount: number;
  totalTracked: number;
  onStartDueReview: (count: 5 | 10 | 20) => void;
  className?: string;
}

export default function SpacedRepetitionCard({
  dueCount,
  totalTracked,
  onStartDueReview,
  className = '',
}: SpacedRepetitionCardProps) {
  return (
    <article className={`panel spaced-repetition-card ${className}`}>
      <div className="card-top-row">
        <div className="badge-wrapper">
          <span className="eyebrow">SPACED REPETITION</span>
          <span className="sub-badge">忘却曲線対策</span>
        </div>
        <span className="icon-wrap">
          <Clock size={18} />
        </span>
      </div>

      <div className="card-main-content">
        <div className="count-display">
          {dueCount > 0 ? (
            <>
              <div className="due-number">
                <span className="big-num amber">{dueCount}</span>
                <span className="unit">questions</span>
              </div>
              <h3>復習待ちの問題があります</h3>
              <p className="description">
                一度正解した問題も、適切な間隔（3日→7日→14日→30日）で復習することで長期記憶に定着します。
              </p>
            </>
          ) : (
            <>
              <div className="due-number">
                <CheckCircle2 size={36} className="green" />
              </div>
              <h3>復習待ちの問題はありません</h3>
              <p className="description">
                {totalTracked > 0
                  ? `現在 ${totalTracked} 問の学習間隔を追跡中。次回復習の期日が到来するとここでお知らせします。`
                  : '問題を解くと、忘却曲線を考慮した復習スケジュールが自動管理されます。'}
              </p>
            </>
          )}
        </div>

        <div className="card-actions">
          {dueCount > 0 ? (
            <div className="btn-group">
              <button className="primary" onClick={() => onStartDueReview(5)}>
                <RotateCcw size={16} /> 復習{Math.min(5, dueCount)}問 (Quick)
              </button>
              {dueCount >= 10 && (
                <button className="secondary" onClick={() => onStartDueReview(10)}>
                  10問復習
                </button>
              )}
            </div>
          ) : (
            <button
              className="textbutton"
              onClick={() => onStartDueReview(5)}
              title="期日前の問題も含めて確認"
            >
              先行復習 5問 <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
