'use client';

import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Layers, Sparkles, LayoutList } from 'lucide-react';

export interface StudyNavItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface StudyItemNavProps {
  itemTypeLabel: string; // 例: "用語", "比較ガイド"
  currentIndex: number;  // 1-indexed (例: 1)
  totalCount: number;    // 全体件数 (例: 120)
  badgeLabel?: string;   // 例: カテゴリ名やDomain
  prev?: StudyNavItem | null;
  next?: StudyNavItem | null;
  onSelect: (id: string) => void;
  onBackToList?: () => void;
}

export function StudyItemNav({
  itemTypeLabel,
  currentIndex,
  totalCount,
  badgeLabel,
  prev,
  next,
  onSelect,
  onBackToList,
}: StudyItemNavProps) {
  // キーボードショートカット (Alt + ←, Alt + →)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // フォーム入力中は無視
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement)?.tagName || ''
        )
      ) {
        return;
      }

      if (e.altKey && e.key === 'ArrowLeft' && prev) {
        e.preventDefault();
        onSelect(prev.id);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (e.altKey && e.key === 'ArrowRight' && next) {
        e.preventDefault();
        onSelect(next.id);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, onSelect]);

  const handlePrevClick = () => {
    if (prev) {
      onSelect(prev.id);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleNextClick = () => {
    if (next) {
      onSelect(next.id);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <nav className="lesson-footer-nav" aria-label={`${itemTypeLabel}ナビゲーション`} style={{ marginTop: '28px' }}>
      {/* 1. プログレスバー & カウンター */}
      <div className="lesson-footer-progress-bar">
        <div className="lesson-footer-meta">
          {badgeLabel && (
            <span className="lesson-footer-domain-badge">
              <Layers size={13} className="inline mr-1 opacity-70" />
              {badgeLabel}
            </span>
          )}
          <span className="lesson-footer-counts">
            <span className="font-semibold text-slate-200">
              {itemTypeLabel} {currentIndex} / {totalCount}
            </span>
            <span className="text-slate-500 text-xs ml-1.5 hidden sm:inline">
              (全 {totalCount} {itemTypeLabel})
            </span>
          </span>
        </div>

        {onBackToList && (
          <button
            type="button"
            onClick={() => {
              onBackToList();
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="lesson-back-to-list-btn"
            aria-label={`${itemTypeLabel}一覧へ戻る`}
          >
            <LayoutList size={14} />
            <span>一覧へ戻る</span>
          </button>
        )}
      </div>

      {/* 2. 前後アクションボタン */}
      <div className={`lesson-footer-actions ${!prev ? 'no-prev' : ''} ${!next ? 'no-next' : ''}`}>
        {/* 前へボタン */}
        {prev ? (
          <button
            type="button"
            onClick={handlePrevClick}
            className="lesson-nav-btn lesson-nav-btn-prev"
            aria-label={`前の${itemTypeLabel}へ戻る: ${prev.title}`}
          >
            <div className="lesson-nav-btn-icon">
              <ArrowLeft size={18} />
            </div>
            <div className="lesson-nav-btn-text">
              <div className="lesson-nav-btn-sub">
                <span>← 前の{itemTypeLabel}</span>
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

        {/* 次へボタン */}
        {next ? (
          <button
            type="button"
            onClick={handleNextClick}
            className="lesson-nav-btn lesson-nav-btn-next"
            aria-label={`次の${itemTypeLabel}へ進む: ${next.title}`}
          >
            <div className="lesson-nav-btn-text text-right sm:text-left">
              <div className="lesson-nav-btn-sub justify-end sm:justify-start">
                <span className="font-semibold text-cyan-300">次の{itemTypeLabel} →</span>
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
          <div className="lesson-nav-final-card">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <Sparkles size={18} />
              <span>全{totalCount}件の{itemTypeLabel}の閲覧完了！</span>
            </div>
            <p className="text-xs text-slate-400">
              すべての{itemTypeLabel}を確認しました。一覧に戻って学習を続けましょう。
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}
