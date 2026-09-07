'use client';

import React from 'react';
import { BookOpen, ArrowRight, CheckCircle2, Sparkles, Compass } from 'lucide-react';
import { getResumeLesson, type NavLessonItem } from '@/lib/lesson-nav';

interface ResumeLearningCardProps {
  completedLessonIds: string[];
  onSelectLesson: (lessonId: string) => void;
  className?: string;
}

export function ResumeLearningCard({
  completedLessonIds,
  onSelectLesson,
  className = '',
}: ResumeLearningCardProps) {
  const resumeInfo = React.useMemo(() => {
    try {
      return getResumeLesson(completedLessonIds);
    } catch {
      return null;
    }
  }, [completedLessonIds]);

  if (!resumeInfo) return null;

  const { lesson, reason, completedCount, totalCount } = resumeInfo;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getBadgeText = () => {
    if (reason === 'all_completed') return '全教材読了・復習';
    if (completedCount === 0) return '学習スタート';
    return '続きから学習';
  };

  return (
    <div className={`resume-learning-card ${className}`} role="region" aria-label="続きから学習">
      <div className="resume-card-body">
        <div className="resume-card-badge-row">
          <span className="resume-status-badge">
            {reason === 'all_completed' ? (
              <Sparkles size={13} className="text-amber-400" />
            ) : (
              <Compass size={13} className="text-cyan-400" />
            )}
            <span>{getBadgeText()}</span>
          </span>
          <span className="resume-progress-count">
            読了: {completedCount} / {totalCount} ({progressPercent}%)
          </span>
        </div>

        <div className="resume-card-title-row">
          <div className="resume-card-domain">
            <span className="text-slate-400 text-xs">Domain {lesson.domainId.toUpperCase()}: </span>
            <span className="text-slate-300 text-xs font-medium">{lesson.domainName}</span>
            <span className="text-slate-500 text-xs ml-1">
              ({lesson.domainIndex + 1} / {lesson.domainTotal})
            </span>
          </div>
          <h3 className="resume-card-lesson-title" title={lesson.title}>
            {lesson.title}
          </h3>
        </div>

        {/* Mini progress bar */}
        <div className="resume-progress-bar-container">
          <div
            className="resume-progress-bar-fill"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelectLesson(lesson.id)}
        className="resume-card-action-btn"
        aria-label={`教材を開く: ${lesson.title}`}
      >
        <span>{reason === 'all_completed' ? '教材を復習する' : '続きを開く'}</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
