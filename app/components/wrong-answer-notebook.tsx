'use client';
import { useState, useMemo } from 'react';
import {
  RotateCcw,
  GitCompareArrows,
  Target,
  FileQuestion,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import {
  type Question,
  objectives,
  domains,
  glossaryTerms,
  comparisonGuides,
} from '@/lib/content';
import type { WrongAnswerRecord, ConceptConfusionPair } from '@/lib/adaptive-learning';
import type { Attempt } from '@/lib/learning';

interface WrongAnswerNotebookProps {
  wrongAnswers: WrongAnswerRecord[];
  confusionPairs: ConceptConfusionPair[];
  allQuestions: Question[];
  attempts: Attempt[];
  onStartQuickReview: (questions: Question[]) => void;
  onSelectQuestion: (question: Question, answer: string[]) => void;
  onNavigateToStudy: (type: 'Learn' | 'Glossary' | 'Compare', id: string) => void;
}

type NotebookTab = 'pattern' | 'objective' | 'question';

export default function WrongAnswerNotebook({
  wrongAnswers,
  confusionPairs,
  allQuestions,
  attempts,
  onStartQuickReview,
  onSelectQuestion,
  onNavigateToStudy,
}: WrongAnswerNotebookProps) {
  const [activeTab, setActiveTab] = useState<NotebookTab>('pattern');

  // By Pattern (混同ペア単位の集約)
  const patternList = useMemo(() => {
    return confusionPairs
      .filter((p) => p.mistakeCount > 0)
      .sort((a, b) => {
        // High > Medium > Low, その後 mistakeCount
        const sevOrder = { High: 3, Medium: 2, Low: 1 };
        const sDiff = sevOrder[b.severity] - sevOrder[a.severity];
        if (sDiff !== 0) return sDiff;
        return b.mistakeCount - a.mistakeCount;
      });
  }, [confusionPairs]);

  // By Objective (Objective単位の正答率・間違い集計)
  const objectiveList = useMemo(() => {
    const stats: Record<
      string,
      { objectiveId: string; total: number; correct: number; mistakes: number }
    > = {};

    attempts.forEach((a) => {
      const objId = a.objectiveId;
      if (!stats[objId]) {
        stats[objId] = { objectiveId: objId, total: 0, correct: 0, mistakes: 0 };
      }
      stats[objId].total++;
      if (a.correct) stats[objId].correct++;
      else stats[objId].mistakes++;
    });

    return Object.values(stats)
      .filter((s) => s.mistakes > 0)
      .map((s) => ({
        ...s,
        accuracy: Math.round((s.correct / s.total) * 100),
        objective: objectives.find((o) => o.id === s.objectiveId),
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [attempts]);

  // By Question (間違い問題一覧)
  const wrongQuestionList = useMemo(() => {
    const latestAttemptByQ: Record<string, Attempt> = {};
    attempts.forEach((a) => {
      if (!latestAttemptByQ[a.questionId] || latestAttemptByQ[a.questionId].at < a.at) {
        latestAttemptByQ[a.questionId] = a;
      }
    });

    // 最新の回答が不正解のもの、または過去に間違えたことがある問題
    const wrongQIds = Object.keys(latestAttemptByQ).filter(
      (qid) => !latestAttemptByQ[qid].correct,
    );

    interface WrongItem {
      question: Question;
      attempt: Attempt;
      record?: WrongAnswerRecord;
    }
    const list: WrongItem[] = [];
    wrongQIds.forEach((qid) => {
      const q = allQuestions.find((item) => item.id === qid);
      if (!q) return;
      const lastA = latestAttemptByQ[qid];
      const record = wrongAnswers.find((w) => w.questionId === qid);
      list.push({ question: q, attempt: lastA, record });
    });
    return list.sort((a, b) => b.attempt.at - a.attempt.at);
  }, [attempts, allQuestions, wrongAnswers]);

  // 混同ペアに対する5問クイック復習
  const handleReviewPair = (pair: ConceptConfusionPair) => {
    // 該当Concept Pair、関連Objective、Difficulty 2/3中心、最近出題した問題を避ける
    const now = Date.now();
    const oneDayAgo = now - 24 * 3600 * 1000;

    // 候補問題
    const candidates = allQuestions.filter((q) => {
      const isRelatedPair =
        (pair.relatedQuestionIds && pair.relatedQuestionIds.includes(q.id)) ||
        (q.testedConcepts && (q.testedConcepts.includes(pair.conceptAId) || q.testedConcepts.includes(pair.conceptBId)));
      const isRelatedObj = pair.relatedObjectiveIds && pair.relatedObjectiveIds.includes(q.objectiveId);
      return isRelatedPair || isRelatedObj;
    });

    // ソート: 該当Pair直接問題優先、Difficulty 3/2優先、最近ミス優先
    const sorted = [...candidates].sort((a, b) => {
      const aInPair = pair.relatedQuestionIds?.includes(a.id) ? 1 : 0;
      const bInPair = pair.relatedQuestionIds?.includes(b.id) ? 1 : 0;
      if (bInPair !== aInPair) return bInPair - aInPair;

      const diffScore = { advanced: 3, intermediate: 2, beginner: 1 };
      const dDiff = diffScore[b.difficulty] - diffScore[a.difficulty];
      if (dDiff !== 0) return dDiff;

      const aAttempt = attempts.filter((att) => att.questionId === a.id).sort((x, y) => y.at - x.at)[0];
      const bAttempt = attempts.filter((att) => att.questionId === b.id).sort((x, y) => y.at - x.at)[0];
      const aRecentlyAsked = aAttempt && aAttempt.at > oneDayAgo ? 1 : 0;
      const bRecentlyAsked = bAttempt && bAttempt.at > oneDayAgo ? 1 : 0;
      return aRecentlyAsked - bRecentlyAsked;
    });

    const chosen = sorted.slice(0, 5);
    if (chosen.length > 0) {
      onStartQuickReview(chosen);
    }
  };

  // Objectiveに対する5問クイック復習
  const handleReviewObjective = (objId: string) => {
    const candidates = allQuestions.filter((q) => q.objectiveId === objId);
    const sorted = [...candidates].sort((a, b) => {
      const aAtt = attempts.filter((att) => att.questionId === a.id).sort((x, y) => y.at - x.at)[0];
      const bAtt = attempts.filter((att) => att.questionId === b.id).sort((x, y) => y.at - x.at)[0];
      const aCorrect = aAtt?.correct ? 1 : 0;
      const bCorrect = bAtt?.correct ? 1 : 0;
      return aCorrect - bCorrect; // 不正解または未回答優先
    });
    const chosen = sorted.slice(0, 5);
    if (chosen.length > 0) {
      onStartQuickReview(chosen);
    }
  };

  const hasMistakes = wrongAnswers.length > 0 || patternList.length > 0 || objectiveList.length > 0;

  if (!hasMistakes) {
    return (
      <article className="panel wrong-notebook-empty">
        <div className="empty-state-content">
          <div className="empty-icon-wrapper">
            <CheckCircle2 size={40} className="green" />
          </div>
          <h3>まだ混同パターンはありません</h3>
          <p>
            演習で間違えた問題から、混同している概念や誤答パターンを自動分析してここにまとめます。
            まずは問題演習を進めてみましょう！
          </p>
        </div>
      </article>
    );
  }

  return (
    <div className="wrong-answer-notebook">
      <div className="notebook-header">
        <div className="notebook-title-group">
          <span className="eyebrow">ADAPTIVE LEARNING NOTEBOOK</span>
          <h2>間違いノート（弱点・混同の自動整理）</h2>
          <p className="caption">
            単なる誤答の羅列ではなく、どの概念を混同し、どこに理解のギャップがあるかを体系化しています。
          </p>
        </div>
        <div className="notebook-tab-pills" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'pattern'}
            className={`notebook-tab-pill ${activeTab === 'pattern' ? 'active' : ''}`}
            onClick={() => setActiveTab('pattern')}
          >
            <GitCompareArrows size={16} />
            By Pattern ({patternList.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'objective'}
            className={`notebook-tab-pill ${activeTab === 'objective' ? 'active' : ''}`}
            onClick={() => setActiveTab('objective')}
          >
            <Target size={16} />
            By Objective ({objectiveList.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'question'}
            className={`notebook-tab-pill ${activeTab === 'question' ? 'active' : ''}`}
            onClick={() => setActiveTab('question')}
          >
            <FileQuestion size={16} />
            By Question ({wrongQuestionList.length})
          </button>
        </div>
      </div>

      {/* Tab: By Pattern */}
      {activeTab === 'pattern' && (
        <div className="notebook-content-pattern">
          {patternList.length === 0 ? (
            <p className="muted-notice">現在検出されている混同パターンはありません。</p>
          ) : (
            <div className="pattern-cards-grid">
              {patternList.map((pair) => (
                <div key={pair.id} className={`pattern-card severity-${pair.severity.toLowerCase()}`}>
                  <div className="pattern-card-header">
                    <span className={`severity-badge ${pair.severity.toLowerCase()}`}>
                      {pair.severity} Severity
                    </span>
                    <span className={`status-badge ${pair.status.toLowerCase()}`}>
                      {pair.status === 'Recovered'
                        ? '✓ 克服済み (Recovered)'
                        : pair.status === 'Recovering'
                          ? '↻ 回復中 (Recovering)'
                          : '要注意 (Active)'}
                    </span>
                  </div>
                  <h3 className="pattern-pair-title">
                    <span>{pair.conceptAName}</span>
                    <span className="vs-symbol">↔</span>
                    <span>{pair.conceptBName}</span>
                  </h3>
                  <div className="pattern-stats-row">
                    <span className="mistake-count">
                      <strong>{pair.mistakeCount}</strong> mistakes
                    </span>
                    {pair.recoveryCount > 0 && (
                      <span className="recovery-count green">
                        {pair.recoveryCount} 回連続正解中
                      </span>
                    )}
                  </div>
                  <div className="pattern-card-actions">
                    <button
                      className="primary quick-review-btn"
                      onClick={() => handleReviewPair(pair)}
                    >
                      <RotateCcw size={15} />
                      この混同を5問復習
                    </button>
                    {pair.relatedComparisonIds && pair.relatedComparisonIds.length > 0 && (
                      <button
                        className="textbutton"
                        onClick={() =>
                          onNavigateToStudy('Compare', pair.relatedComparisonIds![0])
                        }
                      >
                        <GitCompareArrows size={14} />
                        比較ガイドを読む
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: By Objective */}
      {activeTab === 'objective' && (
        <div className="notebook-content-objective">
          <div className="objective-cards-grid">
            {objectiveList.map((item) => (
              <div key={item.objectiveId} className="objective-notebook-card">
                <div className="obj-card-top">
                  <span className="domain-name">
                    {domains.find((d) => d.id === item.objective?.domainId)?.name ?? 'Domain'}
                  </span>
                  <span className={`accuracy-pill ${item.accuracy < 60 ? 'low' : 'mid'}`}>
                    Accuracy {item.accuracy}%
                  </span>
                </div>
                <h4>{item.objective?.title ?? item.objectiveId}</h4>
                <p className="caption">
                  {item.total} 回中 {item.mistakes} 回の誤答
                </p>
                <button
                  className="primary quick-review-btn"
                  onClick={() => handleReviewObjective(item.objectiveId)}
                >
                  <RotateCcw size={15} />
                  このObjectiveを5問復習
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: By Question */}
      {activeTab === 'question' && (
        <div className="notebook-content-question">
          <div className="review-list">
            {wrongQuestionList.map(({ question, attempt, record }) => (
              <div className="review-row" key={question.id}>
                <div className="row">
                  <span className={attempt.correct ? 'green' : 'amber'}>
                    {attempt.correct ? '✓ 直近正解' : '↻ 要復習'}
                  </span>
                  {record && record.mistakeType && record.mistakeType !== 'unknown' && (
                    <span className="mistake-type-pill">
                      タイプ: {record.mistakeType}
                    </span>
                  )}
                  <span className="caption">
                    最終回答: {new Date(attempt.at).toLocaleString('ja-JP')}
                  </span>
                </div>
                <p>{question.question}</p>
                {question.answer.length===2&&<div className="multi-answer-analysis">
                  <p>選択した回答：{attempt.answer.map(id=>question.choices.findIndex(c=>c.id===id)).map(i=>'ABCD'[i]).join('・')||'未回答'}</p>
                  <p>選び忘れ：{question.answer.filter(id=>!attempt.answer.includes(id)).map(id=>'ABCD'[question.choices.findIndex(c=>c.id===id)]).join('・')||'なし'}</p>
                  <p>誤って選択：{attempt.answer.filter(id=>!question.answer.includes(id)).map(id=>'ABCD'[question.choices.findIndex(c=>c.id===id)]).join('・')||'なし'}</p>
                </div>}
                <div className="question-row-actions">
                  <button
                    className="textbutton"
                    onClick={() => onSelectQuestion(question, attempt.answer)}
                  >
                    回答と解説を見る <ArrowRight size={15} />
                  </button>
                  <button
                    className="small-action-btn"
                    onClick={() => onStartQuickReview([question])}
                  >
                    <RotateCcw size={14} /> もう一度解く
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
