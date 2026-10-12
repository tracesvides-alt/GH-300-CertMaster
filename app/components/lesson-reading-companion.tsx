'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  List,
  ChevronDown,
  ChevronUp,
  Compass,
  ArrowUp,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Library,
  GitCompareArrows,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import type { LegacyLesson } from '@/lib/content';

export interface TOCItem {
  id: string;
  title: string;
  category: 'core' | 'points' | 'reference' | 'check';
  badge?: string;
}

interface Props {
  lesson: LegacyLesson;
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function LessonReadingCompanion({ lesson, containerRef, className = '' }: Props) {
  const [progress, setProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isInlineExpanded, setIsInlineExpanded] = useState(false);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);
  const [showStickyCompanion, setShowStickyCompanion] = useState(false);
  const companionRef = useRef<HTMLDivElement>(null);

  // 目次アイテム一覧の生成
  const tocItems: TOCItem[] = useMemo(() => {
    const items: TOCItem[] = [];

    // 1. 各コアセクション
    if (lesson.sections && lesson.sections.length > 0) {
      lesson.sections.forEach((sec, idx) => {
        items.push({
          id: `lesson-sec-${idx}`,
          title: sec.heading,
          category: 'core',
          badge: `Sec ${idx + 1}`,
        });
      });
    }

    // 2. 重要ポイント
    if (lesson.keyPoints && lesson.keyPoints.length > 0) {
      items.push({
        id: 'lesson-key-points',
        title: '重要ポイント',
        category: 'points',
      });
    }

    // 3. よくある間違い
    if (lesson.commonMistakes && lesson.commonMistakes.length > 0) {
      items.push({
        id: 'lesson-common-mistakes',
        title: 'よくある間違い',
        category: 'points',
      });
    }

    // 4. 試験対策のヒント
    if (lesson.examTips && lesson.examTips.length > 0) {
      items.push({
        id: 'lesson-exam-tips',
        title: '試験対策のヒント',
        category: 'points',
      });
    }

    // 5. 関連用語
    if (lesson.glossaryIds && lesson.glossaryIds.length > 0) {
      items.push({
        id: 'lesson-related-glossary',
        title: '関連用語',
        category: 'reference',
      });
    }

    // 6. 関連比較ガイド
    if (lesson.comparisonIds && lesson.comparisonIds.length > 0) {
      items.push({
        id: 'lesson-related-comparisons',
        title: '関連比較ガイド',
        category: 'reference',
      });
    }

    // 7. 理解度チェック
    items.push({
      id: 'lesson-comprehension-check',
      title: '理解度チェック',
      category: 'check',
      badge: '演習',
    });

    // 8. ナビゲーションフッター
    items.push({
      id: 'lesson-footer-nav-container',
      title: '次の教材 / 完了',
      category: 'check',
    });

    return items;
  }, [lesson]);

  // スクロール進捗とアクティブセクション（Scrollspy）の監視
  useEffect(() => {
    const handleScroll = () => {
      // 1. スクロール進捗率の計算
      const article = containerRef?.current || document.querySelector('article.panel.lesson');
      if (article) {
        const rect = article.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) {
          setProgress(100);
        } else {
          const currentScrolled = -rect.top;
          const pct = Math.min(100, Math.max(0, (currentScrolled / totalScrollable) * 100));
          setProgress(Math.round(pct));
        }

        // スティッキーコンパニオンの表示判定（記事先頭が画面外に出始めたら表示）
        setShowStickyCompanion(rect.top < -80);
      } else {
        // フォールバック: ドキュメント全体
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          setProgress(Math.min(100, Math.max(0, Math.round((window.scrollY / docHeight) * 100))));
        }
        setShowStickyCompanion(window.scrollY > 200);
      }

      // 2. 現在読んでいるアクティブセクションの検出
      const scrollThreshold = 180; // ビューポート上部からの検出オフセット
      let currentActive = '';

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        const el = document.getElementById(item.id);
        if (el) {
          const elRect = el.getBoundingClientRect();
          if (elRect.top <= scrollThreshold) {
            currentActive = item.id;
            break;
          }
        }
      }

      if (!currentActive && tocItems.length > 0) {
        currentActive = tocItems[0].id;
      }
      setActiveSectionId(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初期実行

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, tocItems]);

  // 目次アイテムへのスムーズスクロール
  const scrollToSection = (id: string) => {
    setIsQuickNavOpen(false);
    const target = document.getElementById(id);
    if (target) {
      // スティッキーヘッダーの高さを考慮してオフセット
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

  const currentSection = tocItems.find((item) => item.id === activeSectionId);

  return (
    <>
      {/* ─── 1. スティッキー読了プログレスバー ＆ ミニTOCヘッダー ─── */}
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
            aria-label="教材の読了進捗"
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
            <span className="current-section-title" title={currentSection?.title ?? lesson.title}>
              {currentSection ? currentSection.title : lesson.title}
            </span>
          </div>

          <div className="sticky-actions">
            {/* 目次クイックジャンプボタン */}
            <button
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

            {/* トップへスクロールボタン */}
            <button
              className="scroll-top-btn"
              onClick={scrollToTop}
              aria-label="教材の先頭へ戻る"
              title="先頭へ戻る"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>

        {/* ドロップダウン目次パネル */}
        {isQuickNavOpen && (
          <nav className="toc-dropdown-menu" aria-label="目次クイックジャンプ">
            <div className="toc-dropdown-header">
              <span className="eyebrow">TABLE OF CONTENTS</span>
              <span className="toc-lesson-name">{lesson.title}</span>
            </div>
            <div className="toc-dropdown-list">
              {tocItems.map((item, idx) => {
                const isActive = item.id === activeSectionId;
                return (
                  <button
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

      {/* ─── 2. 本文内インライン目次（In-Article Table of Contents） ─── */}
      <div className={`lesson-inline-toc-card ${className}`}>
        <div className="inline-toc-header" onClick={() => setIsInlineExpanded(!isInlineExpanded)}>
          <div className="inline-toc-title-wrap">
            <div className="inline-toc-icon">
              <Compass size={18} />
            </div>
            <div>
              <span className="inline-toc-title">目次（Table of Contents）</span>
              <span className="inline-toc-meta">
                {tocItems.length} セクション · ⏱ 約{lesson.estimatedMinutes ?? 8}分で読了
              </span>
            </div>
          </div>
          <button
            className="inline-toc-toggle-btn"
            aria-label={isInlineExpanded ? '目次を折りたたむ' : '目次を展開する'}
            aria-expanded={isInlineExpanded}
          >
            {isInlineExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {isInlineExpanded && (
          <nav className="inline-toc-body" aria-label="教材の目次">
            <ul className="inline-toc-grid">
              {tocItems.map((item, idx) => {
                const isActive = item.id === activeSectionId;
                return (
                  <li key={item.id} className="inline-toc-item-wrapper">
                    <button
                      className={`inline-toc-link ${isActive ? 'is-active' : ''} ${item.category}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span className="inline-toc-num">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="inline-toc-link-text">{item.title}</span>
                      {item.badge && <span className="inline-toc-badge">{item.badge}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
