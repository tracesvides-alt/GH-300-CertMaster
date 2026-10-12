'use client';
import { useState, useMemo } from 'react';
import {
  GitCompareArrows,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Library,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  X,
  FileQuestion,
} from 'lucide-react';
import {
  type Question,
  type GlossaryTerm,
  type ComparisonGuide,
  glossaryTerms,
  comparisonGuides,
  lessons,
} from '@/lib/content';
type LessonItem = typeof lessons[number];
import type { ConceptConfusionPair } from '@/lib/adaptive-learning';

interface ConceptConfusionMapProps {
  confusionPairs: ConceptConfusionPair[];
  allQuestions: Question[];
  onStartQuickReview: (questions: Question[]) => void;
  onNavigateToStudy: (type: 'Learn' | 'Glossary' | 'Compare', id: string) => void;
}

export default function ConceptConfusionMap({
  confusionPairs,
  allQuestions,
  onStartQuickReview,
  onNavigateToStudy,
}: ConceptConfusionMapProps) {
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);

  const selectedPair = useMemo(() => {
    return confusionPairs.find((p) => p.id === selectedPairId) ?? null;
  }, [confusionPairs, selectedPairId]);

  // Glossary Termの解決
  const termA: GlossaryTerm | undefined = useMemo(() => {
    if (!selectedPair) return undefined;
    return glossaryTerms.find(
      (g) => g.id === selectedPair.conceptAId || g.term.toLowerCase() === selectedPair.conceptAName.toLowerCase(),
    );
  }, [selectedPair]);

  const termB: GlossaryTerm | undefined = useMemo(() => {
    if (!selectedPair) return undefined;
    return glossaryTerms.find(
      (g) => g.id === selectedPair.conceptBId || g.term.toLowerCase() === selectedPair.conceptBName.toLowerCase(),
    );
  }, [selectedPair]);

  // 関連Comparison Guide
  const relatedComparisons: ComparisonGuide[] = useMemo(() => {
    if (!selectedPair) return [];
    if (selectedPair.relatedComparisonIds && selectedPair.relatedComparisonIds.length > 0) {
      return comparisonGuides.filter((c) => selectedPair.relatedComparisonIds!.includes(c.id));
    }
    // 比較対象用語から逆引き
    const ids = [termA?.id, termB?.id].filter(Boolean) as string[];
    return comparisonGuides.filter((c) =>
      c.comparedTermIds.some((tid) => ids.includes(tid)),
    );
  }, [selectedPair, termA, termB]);

  // 関連Lesson
  const relatedLessons: LessonItem[] = useMemo(() => {
    if (!selectedPair) return [];
    const lessonIds = new Set<string>();
    relatedComparisons.forEach((c) => c.lessonIds?.forEach((lid) => lessonIds.add(lid)));
    if (termA?.lessonIds) termA.lessonIds.forEach((lid) => lessonIds.add(lid));
    if (termB?.lessonIds) termB.lessonIds.forEach((lid) => lessonIds.add(lid));
    return lessons.filter((l) => lessonIds.has(l.id));
  }, [selectedPair, relatedComparisons, termA, termB]);

  // 間違えたQuestion
  const mistakeQuestions: Question[] = useMemo(() => {
    if (!selectedPair || !selectedPair.relatedQuestionIds) return [];
    return allQuestions.filter((q) => selectedPair.relatedQuestionIds!.includes(q.id));
  }, [selectedPair, allQuestions]);

  // 5問復習開始
  const handleReview5 = (pair: ConceptConfusionPair) => {
    const candidates = allQuestions.filter((q) => {
      const inPair = pair.relatedQuestionIds?.includes(q.id);
      const hasA = q.testedConcepts?.includes(pair.conceptAId);
      const hasB = q.testedConcepts?.includes(pair.conceptBId);
      return inPair || hasA || hasB;
    });

    const sorted = [...candidates].sort((a, b) => {
      const aInPair = pair.relatedQuestionIds?.includes(a.id) ? 1 : 0;
      const bInPair = pair.relatedQuestionIds?.includes(b.id) ? 1 : 0;
      return bInPair - aInPair;
    });

    const chosen = sorted.slice(0, 5);
    if (chosen.length > 0) {
      onStartQuickReview(chosen);
    }
  };

  if (confusionPairs.length === 0) {
    return (
      <article className="panel concept-confusion-empty">
        <div className="empty-state-content">
          <div className="empty-icon-wrapper">
            <CheckCircle2 size={40} className="green" />
          </div>
          <h3>混同している概念はありません</h3>
          <p>
            演習での回答選択肢と正解概念を突き合わせ、混同しやすい概念ペア（例: MCP ↔ Prompt Filesなど）を自動検出し、視覚化します。
          </p>
        </div>
      </article>
    );
  }

  return (
    <div className="concept-confusion-map">
      <div className="confusion-map-header">
        <span className="eyebrow">CONCEPT CONFUSION MAP</span>
        <h2>概念混同マップ (Concept Confusions)</h2>
        <p className="caption">
          単なる苦手分野ではなく、どの概念同士を混同しているかを可視化しています。
        </p>
      </div>

      {/* 混同ペア一覧カード */}
      <div className="confusion-pairs-list">
        {confusionPairs.map((pair) => (
          <button
            type="button"
            key={pair.id}
            className={`confusion-card ${pair.severity.toLowerCase()} ${
              selectedPairId === pair.id ? 'selected' : ''
            }`}
            onClick={() => setSelectedPairId(pair.id)}
          >
            <div className="confusion-card-head">
              <span className={`severity-badge ${pair.severity.toLowerCase()}`}>
                {pair.severity} Severity
              </span>
              <span className={`status-badge ${pair.status.toLowerCase()}`}>
                {pair.status === 'Recovered'
                  ? '✓ 克服'
                  : pair.status === 'Recovering'
                    ? '↻ 回復傾向'
                    : 'アクティブ'}
              </span>
            </div>

            <div className="confusion-pair-body">
              <div className="concept-node a">{pair.conceptAName}</div>
              <div className="confusion-bridge">
                <GitCompareArrows size={18} />
                <span className="mistake-tag">{pair.mistakeCount} mistakes</span>
              </div>
              <div className="concept-node b">{pair.conceptBName}</div>
            </div>

            <div className="confusion-card-footer">
              <span className="detail-hint">詳細・復習を見る →</span>
            </div>
          </button>
        ))}
      </div>

      {/* 詳細モーダル / 展開パネル */}
      {selectedPair && (
        <div className="confusion-detail-modal-overlay" onClick={() => setSelectedPairId(null)}>
          <div
            className="confusion-detail-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="eyebrow">CONFUSION DETAIL & RECOVERY</span>
                <h3>
                  {selectedPair.conceptAName} ↔ {selectedPair.conceptBName}
                </h3>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedPairId(null)}
                aria-label="閉じる"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-scroll-body">
              {/* ステータスバー */}
              <div className="detail-status-bar">
                <div>
                  <span className="sublabel">Severity</span>
                  <strong className={`badge ${selectedPair.severity.toLowerCase()}`}>
                    {selectedPair.severity}
                  </strong>
                </div>
                <div>
                  <span className="sublabel">誤答回数</span>
                  <strong>{selectedPair.mistakeCount} 回</strong>
                </div>
                <div>
                  <span className="sublabel">直近連続正解</span>
                  <strong className="green">{selectedPair.recoveryCount} 回</strong>
                </div>
                <div>
                  <span className="sublabel">ステータス</span>
                  <strong className={selectedPair.status === 'Recovered' ? 'green' : 'amber'}>
                    {selectedPair.status}
                  </strong>
                </div>
              </div>

              {/* 概念の定義・相違点 */}
              <div className="comparison-definitions-grid">
                <div className="def-box">
                  <h4>{selectedPair.conceptAName}</h4>
                  <p>{termA?.shortDefinition ?? termA?.detailedDefinition ?? '概念の定義が登録されています。'}</p>
                </div>
                <div className="def-box">
                  <h4>{selectedPair.conceptBName}</h4>
                  <p>{termB?.shortDefinition ?? termB?.detailedDefinition ?? '概念の定義が登録されています。'}</p>
                </div>
              </div>

              {/* Key Difference & なぜ混同したか */}
              <div className="why-confused-card">
                <div className="why-head">
                  <Sparkles size={16} />
                  <h4>主な相違点と混同しやすいポイント</h4>
                </div>
                {relatedComparisons.length > 0 ? (
                  <p>{relatedComparisons[0].summary}</p>
                ) : (
                  <p>
                    両者はGH-300試験で問われる重要な機能ですが、対象とするレイヤーやユースケース（自動化スコープや適用範囲など）に明確な違いがあります。
                  </p>
                )}
              </div>

              {/* 関連教材リンク */}
              {(relatedComparisons.length > 0 || relatedLessons.length > 0) && (
                <div className="related-learning-resources">
                  <h4>学習教材へのショートカット</h4>
                  <div className="resource-buttons-row">
                    {relatedComparisons.map((c) => (
                      <button
                        key={c.id}
                        className="resource-link-btn compare-link"
                        onClick={() => {
                          setSelectedPairId(null);
                          onNavigateToStudy('Compare', c.id);
                        }}
                      >
                        <GitCompareArrows size={15} />
                        比較ガイド: {c.title}
                      </button>
                    ))}
                    {relatedLessons.map((l) => (
                      <button
                        key={l.id}
                        className="resource-link-btn lesson-link"
                        onClick={() => {
                          setSelectedPairId(null);
                          onNavigateToStudy('Learn', l.id);
                        }}
                      >
                        <BookOpen size={15} />
                        Lesson: {l.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 間違えた問題一覧 */}
              {mistakeQuestions.length > 0 && (
                <div className="mistake-questions-list">
                  <h4>この混同で間違えた問題 ({mistakeQuestions.length}問)</h4>
                  <ul>
                    {mistakeQuestions.map((q) => (
                      <li key={q.id}>
                        <FileQuestion size={14} />
                        <span>{q.question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="primary start-5-review-btn"
                onClick={() => {
                  setSelectedPairId(null);
                  handleReview5(selectedPair);
                }}
              >
                <RotateCcw size={16} />
                この混同を5問復習する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
