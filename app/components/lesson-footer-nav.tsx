'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, BookOpen, Layers, Sparkles } from 'lucide-react';
import { getLessonNav, type LessonNavInfo } from '@/lib/lesson-nav';

interface LessonFooterNavProps {
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  isCompleted?: boolean;
  onToggleCompleted?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  onStartPractice?: () => void;
}

export function LessonFooterNav({
  currentLessonId,
  onSelectLesson,
  isCompleted = false,
  onToggleCompleted,
  onNavigateNext,
  onNavigatePrev,
  onStartPractice,
}: LessonFooterNavProps) {
  const nav = React.useMemo<LessonNavInfo | null>(() => {
    return getLessonNav(currentLessonId);
  }, [currentLessonId]);

  if (!nav) return null;

  const { current, prev, next, isNextDifferentDomain, currentOverallIndex, totalLessonsCount, currentDomainIndex, domainLessonsCount } = nav;

  const handleNextClick = () => {
    if (onNavigateNext) {
      onNavigateNext();
    } else if (next) {
      onSelectLesson(next.id);
    }
  };

  const handlePrevClick = () => {
    if (onNavigatePrev) {
      onNavigatePrev();
    } else if (prev) {
      onSelectLesson(prev.id);
    }
  };

  return (
    <nav className="lesson-footer-nav" aria-label="教材ナビゲーション">
      {/* 1. Progress Context & Completion Bar */}
      <div className="lesson-footer-progress-bar">
        <div className="lesson-footer-meta">
          <span className="lesson-footer-domain-badge">
            <Layers size={13} className="inline mr-1 opacity-70" />
            {current.domainName}
          </span>
          <span className="lesson-footer-counts">
            <span className="font-semibold text-slate-200">
              Lesson {currentDomainIndex} / {domainLessonsCount}
            </span>
            <span className="text-slate-500 text-xs ml-1.5 hidden sm:inline">
              (全 {currentOverallIndex} / {totalLessonsCount} 教材)
            </span>
          </span>
        </div>

        {/* Completion Toggle Button */}
        {onToggleCompleted && (
          <button
            type="button"
            onClick={onToggleCompleted}
            className={`lesson-completion-toggle ${isCompleted ? 'is-completed' : ''}`}
            aria-label={isCompleted ? '読了済み（クリックで解除）' : '読了にする'}
            aria-pressed={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-emerald-300 font-medium">読了済み</span>
              </>
            ) : (
              <>
                <Circle size={16} className="text-slate-400" />
                <span className="text-slate-300">読了にする</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. Navigation Actions */}
      <div className={`lesson-footer-actions ${!prev ? 'no-prev' : ''} ${!next ? 'no-next' : ''}`}>
        {/* Previous Button (Only if previous exists) */}
        {prev ? (
          <button
            type="button"
            onClick={handlePrevClick}
            className="lesson-nav-btn lesson-nav-btn-prev"
            aria-label={`前の教材へ戻る: ${prev.title}`}
          >
            <div className="lesson-nav-btn-icon">
              <ArrowLeft size={18} />
            </div>
            <div className="lesson-nav-btn-text">
              <div className="lesson-nav-btn-sub">
                <span>← 前の教材</span>
                <span className="lesson-nav-key-hint hidden md:inline">Alt + ←</span>
              </div>
              <div className="lesson-nav-btn-title" title={prev.title}>
                {prev.title}
              </div>
            </div>
          </button>
        ) : (
          <div className="lesson-nav-placeholder hidden md:block" />
        )}

        {/* Next Button (Primary Action - Maximum Prominence) */}
        {next ? (
          <button
            type="button"
            onClick={handleNextClick}
            className="lesson-nav-btn lesson-nav-btn-next"
            aria-label={`次の教材へ進む: ${next.title}`}
          >
            <div className="lesson-nav-btn-text text-right sm:text-left">
              <div className="lesson-nav-btn-sub justify-end sm:justify-start">
                <span className="font-semibold text-cyan-300">次の教材 →</span>
                {isNextDifferentDomain && (
                  <span className="lesson-next-domain-badge">
                    次のDomain ({next.domainName})
                  </span>
                )}
                <span className="lesson-nav-key-hint hidden md:inline">Alt + →</span>
              </div>
              <div className="lesson-nav-btn-title font-semibold text-white" title={next.title}>
                {next.title}
              </div>
            </div>
            <div className="lesson-nav-btn-icon next-icon">
              <ArrowRight size={20} />
            </div>
          </button>
        ) : (
          /* When reached the last lesson of entire curriculum */
          <div className="lesson-nav-final-card">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <Sparkles size={18} />
              <span>全教材（全28件）の学習完了！</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              全Domainの基礎を網羅しました。本番レベルの問題演習で理解度をチェックしましょう。
            </p>
            {onStartPractice && (
              <button
                type="button"
                onClick={onStartPractice}
                className="lesson-finish-practice-btn"
                aria-label="問題演習へ進む"
              >
                <span>問題演習へ進む</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
