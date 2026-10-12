'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  List,
  ChevronDown,
  ArrowUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export interface TOCItem {
  id: string;
  title: string;
  badge?: string;
}

interface ItemReadingCompanionProps {
  title: string;
  items: TOCItem[];
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function ItemReadingCompanion({
  title,
  items,
  containerRef,
}: ItemReadingCompanionProps) {
  const [progress, setProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);
  const [showStickyCompanion, setShowStickyCompanion] = useState(false);
  const companionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef?.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      // コンテナ先頭が画面外（上部120px以上）にスクロールアウトしたらスティッキーバーを表示
      const shouldShow = containerTop < -80;
      setShowStickyCompanion(shouldShow);

      // プログレス計算 (0 - 100%)
      const totalScrollable = containerHeight - windowHeight + 160;
      if (totalScrollable > 0) {
        const scrolled = -containerTop;
        const pct = Math.min(100, Math.max(0, Math.round((scrolled / totalScrollable) * 100)));
        setProgress(pct);
      } else {
        setProgress(100);
      }

      // 現在閲覧中のセクションを判定
      const scrollThreshold = 140;
      let currentActive = '';

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const el = document.getElementById(item.id);
        if (el) {
          const elRect = el.getBoundingClientRect();
          if (elRect.top <= scrollThreshold) {
            currentActive = item.id;
            break;
          }
        }
      }

      if (!currentActive && items.length > 0) {
        currentActive = items[0].id;
      }
      setActiveSectionId(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, items]);

  // 目次アイテムへのスムーズスクロール
  const scrollToSection = (id: string) => {
    setIsQuickNavOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // トップへ戻る
  const scrollToTop = () => {
    setIsQuickNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSection = items.find((item) => item.id === activeSectionId);

  return (
    <div
      ref={companionRef}
      className={`lesson-sticky-companion ${showStickyCompanion ? 'is-visible' : ''}`}
      aria-label="読了進捗ナビゲーション"
      inert={!showStickyCompanion}
    >
      {/* 最上部プログレスバー (3px) */}
      <div className="reading-progress-track">
        <div
          className="reading-progress-bar"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-label="読了進捗"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* コンパクトヘッダーバー */}
      <div className="sticky-companion-content">
        <div className="sticky-left">
          <span className="reading-pct-pill">
            {progress >= 95 ? (
              <CheckCircle2 size={13} className="text-emerald-400" />
            ) : (
              <Clock size={13} className="text-cyan-400" />
            )}
            <span>{progress}%</span>
          </span>
          <span className="current-section-title" title={currentSection?.title ?? title}>
            {currentSection ? currentSection.title : title}
          </span>
        </div>

        <div className="sticky-actions">
          {/* 目次クイックジャンプボタン */}
          {items.length > 0 && (
            <button
              type="button"
              className={`toc-quick-btn ${isQuickNavOpen ? 'is-active' : ''}`}
              onClick={() => setIsQuickNavOpen(!isQuickNavOpen)}
              aria-label="目次を開く"
              aria-expanded={isQuickNavOpen}
            >
              <List size={15} />
              <span>目次</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${isQuickNavOpen ? 'rotate-180' : ''}`}
              />
            </button>
          )}

          {/* トップへスクロールボタン [↑] */}
          <button
            type="button"
            className="scroll-top-btn"
            onClick={scrollToTop}
            aria-label="先頭へ戻る"
            title="先頭へ戻る"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>

      {/* ドロップダウン目次パネル */}
      {isQuickNavOpen && items.length > 0 && (
        <nav className="toc-dropdown-menu" aria-label="目次クイックジャンプ">
          <div className="toc-dropdown-header">
            <span className="eyebrow">SECTIONS</span>
            <span className="toc-lesson-name">{title}</span>
          </div>
          <div className="toc-dropdown-list">
            {items.map((item, idx) => {
              const isActive = item.id === activeSectionId;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`toc-dropdown-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span className="toc-item-num">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  <span className="toc-item-text">{item.title}</span>
                  {item.badge && <span className="toc-item-badge">{item.badge}</span>}
                  {isActive && <span className="toc-active-dot" />}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
