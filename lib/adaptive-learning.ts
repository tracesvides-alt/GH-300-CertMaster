import {
  questions,
  glossaryTerms,
  comparisonGuides,
  lessons,
  type Question,
  type GlossaryTerm,
  type ComparisonGuide,
  type LegacyLesson,
} from './content';
import type { Attempt } from './learning';

export type MistakeType =
  | 'concept-confusion'
  | 'knowledge-gap'
  | 'scenario-misread'
  | 'scope-mistake'
  | 'feature-selection'
  | 'prompt-engineering-mistake'
  | 'privacy-policy-mistake'
  | 'careless-error'
  | 'unknown';

export interface WrongAnswerRecord {
  id: string; // Unique record ID: `${questionId}_${answeredAt}`
  questionId: string;
  answeredAt: number;
  selectedChoiceIds: string[];
  correctChoiceIds: string[];
  domainId: string;
  objectiveId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  testedConcepts: string[];
  selectedConcepts: string[];
  correctConcepts: string[];
  mistakeType: MistakeType;
  confusionPairIds: string[]; // e.g. ["g-mcp__g-prompt-files"]
  reviewCount: number;
  recovered: boolean;
  lastReviewedAt: number | null;
}

export interface ConceptConfusionPair {
  id: string; // `${conceptAId}__${conceptBId}` (lexicographically ordered)
  conceptAId: string;
  conceptBId: string;
  conceptAName: string;
  conceptBName: string;
  mistakeCount: number;
  recentMistakeCount: number;
  lastMistakeAt: number;
  recoveryCount: number;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Recovering' | 'Recovered';
  relatedQuestionIds: string[];
  relatedObjectiveIds: string[];
  relatedComparisonIds: string[];
}

export interface RecommendedAction {
  id: string;
  type: 'review_confusion' | 'read_comparison' | 'read_lesson' | 'review_due' | 'strengthen_weakness';
  priority: 'primary' | 'secondary';
  title: string;
  description: string;
  targetId?: string; // comparisonId, lessonId, confusionPairId, etc.
  domainId?: string;
  questionIds?: string[];
  badge: string;
}

/**
 * Normalize pair ID so conceptAId < conceptBId alphabetically
 */
export function getPairId(conceptA: string, conceptB: string): string {
  return [conceptA, conceptB].sort().join('__');
}

/**
 * Detect matching glossary or concept identifiers from text or question metadata
 */
export function extractConceptsForChoice(
  choiceText: string,
  question: Question,
  choiceId: string
): string[] {
  const matched = new Set<string>();

  // Only the choice text and its own rationale can identify a choice-specific concept.
  // testedConcepts describes the whole question, so assigning it to every choice
  // would manufacture confusion pairs from unrelated tags and objectives.
  const rationale = question.choiceQuality?.[choiceId]?.rationale ?? '';
  const searchCorpus = `${choiceText} ${rationale}`.toLowerCase();

  for (const term of glossaryTerms) {
    const termLower = term.term.toLowerCase();
    if (termLower.length >= 3 && searchCorpus.includes(termLower)) {
      matched.add(term.id);
    } else {
      // Check aliases
      for (const alias of term.aliases) {
        if (alias.length >= 3 && searchCorpus.includes(alias.toLowerCase())) {
          matched.add(term.id);
          break;
        }
      }
    }
  }

  return Array.from(matched);
}

/**
 * Analyze a mistake when answering a question incorrectly
 */
export function analyzeMistake(
  question: Question,
  selectedChoiceIds: string[],
  now = Date.now()
): WrongAnswerRecord {
  const correctChoiceIds = question.answer;
  const testedConcepts = question.testedConcepts ?? [];

  // Extract concepts from selected wrong choices
  const selectedConceptsSet = new Set<string>();
  for (const cid of selectedChoiceIds) {
    const choice = question.choices.find((c) => c.id === cid);
    if (choice) {
      extractConceptsForChoice(choice.text, question, cid).forEach((c) => selectedConceptsSet.add(c));
    }
  }

  // Extract concepts from correct choices
  const correctConceptsSet = new Set<string>();
  for (const cid of correctChoiceIds) {
    const choice = question.choices.find((c) => c.id === cid);
    if (choice) {
      extractConceptsForChoice(choice.text, question, cid).forEach((c) => correctConceptsSet.add(c));
    }
  }

  const selectedConcepts = Array.from(selectedConceptsSet);
  const correctConcepts = Array.from(correctConceptsSet);

  // Identify confusion pairs
  const confusionPairIds = new Set<string>();
  for (const c1 of correctConcepts) {
    for (const c2 of selectedConcepts) {
      if (c1 !== c2) {
        confusionPairIds.add(getPairId(c1, c2));
      }
    }
  }

  // Determine Mistake Type
  let mistakeType: MistakeType = 'unknown';

  // Primary check: choice quality metadata distractor type
  const firstWrongId = selectedChoiceIds.find((id) => !correctChoiceIds.includes(id));
  const quality = firstWrongId ? question.choiceQuality?.[firstWrongId] : undefined;

  if (quality) {
    if (quality.distractorType === 'common-confusion' || confusionPairIds.size > 0) {
      mistakeType = 'concept-confusion';
    } else if (quality.distractorType === 'wrong-use-case') {
      mistakeType = 'feature-selection';
    } else if (quality.distractorType === 'wrong-scope') {
      mistakeType = 'scope-mistake';
    } else if (quality.distractorType === 'partial-match') {
      mistakeType = 'scenario-misread';
    }
  }

  if (mistakeType === 'unknown') {
    if (confusionPairIds.size > 0) {
      mistakeType = 'concept-confusion';
    } else if (question.difficulty === 'beginner') {
      mistakeType = 'knowledge-gap';
    } else {
      mistakeType = 'unknown';
    }
  }

  return {
    id: `${question.id}_${now}`,
    questionId: question.id,
    answeredAt: now,
    selectedChoiceIds,
    correctChoiceIds,
    domainId: question.domainId,
    objectiveId: question.objectiveId,
    difficulty: question.difficulty,
    testedConcepts,
    selectedConcepts,
    correctConcepts,
    mistakeType,
    confusionPairIds: [...confusionPairIds],
    reviewCount: 0,
    recovered: false,
    lastReviewedAt: null,
  };
}

/**
 * Update or create ConceptConfusionPairs based on wrong answer record and recent attempts
 */
export function updateConfusionPairs(
  existingPairs: ConceptConfusionPair[],
  record: WrongAnswerRecord,
  allAttempts: Attempt[],
  now = Date.now()
): ConceptConfusionPair[] {
  const result = [...existingPairs];
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  for (const pairId of record.confusionPairIds) {
    const [idA, idB] = pairId.split('__');
    if (!idA || !idB) continue;

    const termA = glossaryTerms.find((g) => g.id === idA);
    const termB = glossaryTerms.find((g) => g.id === idB);
    const nameA = termA?.term ?? idA;
    const nameB = termB?.term ?? idB;

    // Find related comparisons
    const relatedComparisons = comparisonGuides
      .filter((cmp) => cmp.comparedTermIds.includes(idA) && cmp.comparedTermIds.includes(idB))
      .map((c) => c.id);

    const existingIdx = result.findIndex((p) => p.id === pairId);

    if (existingIdx >= 0) {
      const existing = result[existingIdx];
      const newMistakeCount = existing.mistakeCount + 1;
      const recentCount = existing.lastMistakeAt >= now - SEVEN_DAYS_MS
        ? existing.recentMistakeCount + 1
        : 1;

      // Severity calculation:
      // High: recentMistakeCount >= 3 or total >= 5
      // Medium: recentMistakeCount >= 2 or total >= 3
      // Low: otherwise
      let severity: 'Low' | 'Medium' | 'High' = 'Low';
      if (recentCount >= 3 || newMistakeCount >= 5) severity = 'High';
      else if (recentCount >= 2 || newMistakeCount >= 3) severity = 'Medium';

      result[existingIdx] = {
        ...existing,
        mistakeCount: newMistakeCount,
        recentMistakeCount: recentCount,
        lastMistakeAt: now,
        status: 'Active', // new mistake activates it
        severity,
        relatedQuestionIds: Array.from(new Set([...existing.relatedQuestionIds, record.questionId])),
        relatedObjectiveIds: Array.from(new Set([...existing.relatedObjectiveIds, record.objectiveId])),
        relatedComparisonIds: Array.from(new Set([...existing.relatedComparisonIds, ...relatedComparisons])),
      };
    } else {
      result.push({
        id: pairId,
        conceptAId: idA,
        conceptBId: idB,
        conceptAName: nameA,
        conceptBName: nameB,
        mistakeCount: 1,
        recentMistakeCount: 1,
        lastMistakeAt: now,
        recoveryCount: 0,
        severity: 'Low',
        status: 'Active',
        relatedQuestionIds: [record.questionId],
        relatedObjectiveIds: [record.objectiveId],
        relatedComparisonIds: relatedComparisons,
      });
    }
  }

  return result;
}

/**
 * Check and update recovery status of confusion pairs after successful reviews
 */
export function checkPairRecovery(
  pair: ConceptConfusionPair,
  recentAttemptsOnRelatedQuestions: Attempt[]
): { status: 'Active' | 'Recovering' | 'Recovered'; recoveryCount: number } {
  // Sort attempts chronological descending
  const sorted = [...recentAttemptsOnRelatedQuestions]
    .filter((a) => pair.relatedQuestionIds.includes(a.questionId))
    .sort((a, b) => b.at - a.at);

  let consecutiveCorrect = 0;
  for (const att of sorted) {
    if (att.correct) consecutiveCorrect++;
    else break;
  }

  if (consecutiveCorrect >= 3) {
    return { status: 'Recovered', recoveryCount: consecutiveCorrect };
  } else if (consecutiveCorrect >= 1) {
    return { status: 'Recovering', recoveryCount: consecutiveCorrect };
  }

  return { status: 'Active', recoveryCount: consecutiveCorrect };
}

// ────────────────────────────────────────────
// Bidirectional Question Extractors (3-Question / 5-Question checks)
// ────────────────────────────────────────────

/**
 * Extract 3 comprehension check questions for a Lesson
 */
export function getQuestionsForLesson(
  lessonId: string,
  count = 3,
  recentAttemptedQuestionIds: string[] = []
): Question[] {
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return [];

  const candidatePool = questions.filter((q) => {
    // Matches lesson objective or domain
    const matchObj = lesson.relatedObjectives.includes(q.objectiveId);
    const matchDomain = q.domainId === lesson.domainId;
    return matchObj || matchDomain;
  });

  // Prioritize: 1. Unattempted, 2. Matches objective, 3. Difficulty intermediate/advanced
  const attemptedSet = new Set(recentAttemptedQuestionIds);

  const scored = candidatePool.map((q) => {
    let score = 10;
    if (!attemptedSet.has(q.id)) score += 50; // Unanswered bonus
    if (lesson.relatedObjectives.includes(q.objectiveId)) score += 30;
    if (q.difficulty === 'intermediate' || q.difficulty === 'advanced') score += 15;
    return { q, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.q);
}

/**
 * Extract 3 comparison check questions for a Comparison Guide
 */
export function getQuestionsForComparison(
  comparisonId: string,
  count = 3,
  recentAttemptedQuestionIds: string[] = []
): Question[] {
  const cmp = comparisonGuides.find((c) => c.id === comparisonId);
  if (!cmp) return [];

  const attemptedSet = new Set(recentAttemptedQuestionIds);
  const comparedTerms = cmp.comparedTermIds.map((t) => t.toLowerCase());

  const candidatePool = questions.filter((q) => {
    // Direct objective match
    if (cmp.objectiveIds.includes(q.objectiveId)) return true;

    // Check if question choices or text mention compared terms
    const qText = `${q.question} ${q.choices.map((c) => c.text).join(' ')}`.toLowerCase();
    return comparedTerms.some((t) => qText.includes(t));
  });

  const scored = candidatePool.map((q) => {
    let score = 10;
    if (!attemptedSet.has(q.id)) score += 40;
    if (cmp.objectiveIds.includes(q.objectiveId)) score += 30;
    if (q.difficulty === 'intermediate' || q.difficulty === 'advanced') score += 20;
    return { q, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.q);
}

/**
 * Extract 3 questions for a Glossary Term
 */
export function getQuestionsForGlossary(
  termId: string,
  count = 3,
  recentAttemptedQuestionIds: string[] = []
): Question[] {
  const term = glossaryTerms.find((g) => g.id === termId);
  if (!term) return [];

  const attemptedSet = new Set(recentAttemptedQuestionIds);
  const termKeyword = term.term.toLowerCase();

  const candidatePool = questions.filter((q) => {
    if (term.objectiveIds.includes(q.objectiveId)) return true;
    const qText = `${q.question} ${q.choices.map((c) => c.text).join(' ')}`.toLowerCase();
    return qText.includes(termKeyword);
  });

  const scored = candidatePool.map((q) => {
    let score = 10;
    if (!attemptedSet.has(q.id)) score += 40;
    if (term.objectiveIds.includes(q.objectiveId)) score += 30;
    return { q, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.q);
}

/**
 * Extract 5 targeted review questions for a Concept Confusion Pair
 */
export function getQuestionsForConfusionPair(
  pair: ConceptConfusionPair,
  count = 5,
  recentAttemptedQuestionIds: string[] = []
): Question[] {
  const attemptedSet = new Set(recentAttemptedQuestionIds);
  const candidatePool = questions.filter((q) => {
    // 1. Check if directly in pair.relatedQuestionIds
    if (pair.relatedQuestionIds.includes(q.id)) return true;
    // 2. Check if in pair objectives
    if (pair.relatedObjectiveIds.includes(q.objectiveId)) return true;
    // 3. Check if choices mention concept names
    const text = `${q.question} ${q.choices.map((c) => c.text).join(' ')}`.toLowerCase();
    return text.includes(pair.conceptAName.toLowerCase()) || text.includes(pair.conceptBName.toLowerCase());
  });

  const scored = candidatePool.map((q) => {
    let score = 10;
    // Prioritize Difficulty 2 / 3
    if (q.difficulty === 'advanced') score += 30;
    else if (q.difficulty === 'intermediate') score += 20;

    // Direct related question bonus
    if (pair.relatedQuestionIds.includes(q.id)) score += 25;

    // Avoid questions answered very recently
    if (attemptedSet.has(q.id)) score -= 20;

    return { q, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.q);
}

/**
 * Determine Recommended Next Action after a practice session
 */
export function getRecommendedNextAction(
  recentAttempts: Attempt[],
  activeConfusionPairs: ConceptConfusionPair[],
  dueReviewQuestionsCount: number
): { primary: RecommendedAction; secondary: RecommendedAction[] } {
  // 1. If high severity confusion exists -> Recommend reviewing that confusion pair or its comparison guide
  const highConfusion = activeConfusionPairs.find((p) => p.severity === 'High' && p.status !== 'Recovered');
  if (highConfusion) {
    const cmp = comparisonGuides.find((c) => highConfusion.relatedComparisonIds.includes(c.id));
    const primary: RecommendedAction = cmp
      ? {
          id: `cmp_${cmp.id}`,
          type: 'read_comparison',
          priority: 'primary',
          title: `比較ガイド: ${cmp.title}`,
          description: `混同が検出された「${highConfusion.conceptAName} ↔ ${highConfusion.conceptBName}」の違いを比較表で整理しましょう。`,
          targetId: cmp.id,
          badge: '混同克服',
        }
      : {
          id: `pair_${highConfusion.id}`,
          type: 'review_confusion',
          priority: 'primary',
          title: `混同復習: ${highConfusion.conceptAName} ↔ ${highConfusion.conceptBName}`,
          description: `間違えやすいポイントを5問で集中的にチェックします。`,
          targetId: highConfusion.id,
          badge: '集中復習 5問',
        };

    const secondary: RecommendedAction[] = [];
    if (dueReviewQuestionsCount > 0) {
      secondary.push({
        id: 'rec_due',
        type: 'review_due',
        priority: 'secondary',
        title: `復習期限の問題を解く (${dueReviewQuestionsCount}問)`,
        description: '忘却対策として設定された復習期限の問題を解きましょう。',
        badge: '復習期限',
      });
    }

    return { primary, secondary };
  }

  // 2. If questions are due for review -> Recommend Spaced Repetition review
  if (dueReviewQuestionsCount > 0) {
    const primary: RecommendedAction = {
      id: 'rec_due_primary',
      type: 'review_due',
      priority: 'primary',
      title: `復習期限の確認 (${Math.min(dueReviewQuestionsCount, 10)}問)`,
      description: '一度解いた問題の記憶を定着させるため、復習期限の問題を演習しましょう。',
      badge: '忘却防止',
    };

    const secondary: RecommendedAction[] = [];
    const mediumConfusion = activeConfusionPairs.find((p) => p.status !== 'Recovered');
    if (mediumConfusion) {
      secondary.push({
        id: `pair_${mediumConfusion.id}`,
        type: 'review_confusion',
        priority: 'secondary',
        title: `${mediumConfusion.conceptAName} ↔ ${mediumConfusion.conceptBName} 復習`,
        description: '5問の類似・応用問題で概念の使い分けを確認します。',
        targetId: mediumConfusion.id,
        badge: '混同復習',
      });
    }

    return { primary, secondary };
  }

  // 3. Default: Recommend continuing with weak or next lesson
  const primary: RecommendedAction = {
    id: 'rec_weak',
    type: 'strengthen_weakness',
    priority: 'primary',
    title: '弱点分野の補強演習 (10問)',
    description: '苦手なObjectiveから優先的にバランス良く出題します。',
    badge: '弱点補強',
  };

  return { primary, secondary: [] };
}
