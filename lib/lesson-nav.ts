import { domains, objectives, lessons as defaultLessons, type LegacyLesson } from './content';

export interface NavLessonItem {
  id: string;
  title: string;
  domainId: string;
  domainName: string;
  domainTitle: string;
  order?: number;
  objectiveId?: string;
  estimatedMinutes?: number;
  difficulty?: string;
  index: number; // 0-indexed across all lessons
  domainIndex: number; // 0-indexed within domain
  domainTotal: number; // total in this domain
}

export interface LessonNavInfo {
  current: NavLessonItem;
  prev: NavLessonItem | null;
  next: NavLessonItem | null;
  isNextDifferentDomain: boolean;
  isPrevDifferentDomain: boolean;
  currentOverallIndex: number; // 1-indexed for display (e.g., 12)
  totalLessonsCount: number; // total count (e.g., 28)
  currentDomainIndex: number; // 1-indexed for display (e.g., 4)
  domainLessonsCount: number; // total count in domain (e.g., 9)
}

/**
 * Sort lessons strictly by:
 * 1. Domain order (syllabus domain sequence)
 * 2. Objective order (syllabus objective sequence)
 * 3. Explicit lesson.order (if defined) or natural seed order
 */
export function getSortedLessons(lessonsList: LegacyLesson[] = defaultLessons): NavLessonItem[] {
  const domainOrderMap = new Map<string, number>();
  const domainMetaMap = new Map<string, { name: string; title: string }>();
  domains.forEach((d, i) => {
    domainOrderMap.set(d.id, i);
    domainMetaMap.set(d.id, { name: d.name, title: d.title ?? d.name });
  });

  const objectiveOrderMap = new Map<string, number>();
  objectives.forEach((o, i) => {
    objectiveOrderMap.set(o.id, i);
  });

  // Preserve original index for stable fallback sorting
  const indexed = lessonsList.map((l, originalIdx) => ({ l, originalIdx }));

  indexed.sort((a, b) => {
    // 1. Domain order
    const dOrderA = domainOrderMap.get(a.l.domainId) ?? 999;
    const dOrderB = domainOrderMap.get(b.l.domainId) ?? 999;
    if (dOrderA !== dOrderB) return dOrderA - dOrderB;

    // 2. Objective order (use first related objective if available)
    const objA = a.l.relatedObjectives?.[0] || a.l.objectiveIds?.[0];
    const objB = b.l.relatedObjectives?.[0] || b.l.objectiveIds?.[0];
    const oOrderA = objA ? (objectiveOrderMap.get(objA) ?? 999) : 999;
    const oOrderB = objB ? (objectiveOrderMap.get(objB) ?? 999) : 999;
    if (oOrderA !== oOrderB) return oOrderA - oOrderB;

    // 3. Explicit lesson order if present
    const explicitOrderA = (a.l as Record<string, unknown>).order as number | undefined;
    const explicitOrderB = (b.l as Record<string, unknown>).order as number | undefined;
    if (explicitOrderA !== undefined && explicitOrderB !== undefined) {
      if (explicitOrderA !== explicitOrderB) return explicitOrderA - explicitOrderB;
    } else if (explicitOrderA !== undefined) {
      return -1;
    } else if (explicitOrderB !== undefined) {
      return 1;
    }

    // 4. Stable original seed order
    return a.originalIdx - b.originalIdx;
  });

  // Count lessons per domain
  const domainCounts = new Map<string, number>();
  indexed.forEach(({ l }) => {
    domainCounts.set(l.domainId, (domainCounts.get(l.domainId) ?? 0) + 1);
  });

  // Build NavLessonItem list
  const currentDomainIdxTracker = new Map<string, number>();
  return indexed.map(({ l }, overallIndex) => {
    const dMeta = domainMetaMap.get(l.domainId) ?? { name: l.domainId, title: l.domainId };
    const domainIdx = currentDomainIdxTracker.get(l.domainId) ?? 0;
    currentDomainIdxTracker.set(l.domainId, domainIdx + 1);
    const domainTotal = domainCounts.get(l.domainId) ?? 1;

    return {
      id: l.id,
      title: l.title,
      domainId: l.domainId,
      domainName: dMeta.name,
      domainTitle: dMeta.title,
      order: (l as Record<string, unknown>).order as number | undefined,
      objectiveId: l.relatedObjectives?.[0] || l.objectiveIds?.[0],
      estimatedMinutes: l.estimatedMinutes,
      difficulty: l.difficulty,
      index: overallIndex,
      domainIndex: domainIdx,
      domainTotal,
    };
  });
}

/**
 * Get navigation info (previous, next, progress context) for a specific lesson
 */
export function getLessonNav(
  currentLessonId: string,
  lessonsList: LegacyLesson[] = defaultLessons
): LessonNavInfo | null {
  const sorted = getSortedLessons(lessonsList);
  const currentIndex = sorted.findIndex((l) => l.id === currentLessonId);
  if (currentIndex === -1) return null;

  const current = sorted[currentIndex];
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return {
    current,
    prev,
    next,
    isNextDifferentDomain: Boolean(next && next.domainId !== current.domainId),
    isPrevDifferentDomain: Boolean(prev && prev.domainId !== current.domainId),
    currentOverallIndex: currentIndex + 1,
    totalLessonsCount: sorted.length,
    currentDomainIndex: current.domainIndex + 1,
    domainLessonsCount: current.domainTotal,
  };
}

/**
 * Determine the next lesson to resume learning based on completed lessons
 */
export function getResumeLesson(
  completedLessonIds: string[],
  lessonsList: LegacyLesson[] = defaultLessons
): {
  lesson: NavLessonItem;
  reason: 'next_after_last_completed' | 'first_uncompleted' | 'all_completed';
  completedCount: number;
  totalCount: number;
} {
  const sorted = getSortedLessons(lessonsList);
  const completedSet = new Set(completedLessonIds);

  if (sorted.length === 0) {
    throw new Error('No lessons available');
  }

  // If none completed, start from the very first lesson
  if (completedSet.size === 0) {
    return {
      lesson: sorted[0],
      reason: 'first_uncompleted',
      completedCount: 0,
      totalCount: sorted.length,
    };
  }

  // Find the highest index among completed lessons
  let highestCompletedIdx = -1;
  sorted.forEach((item, idx) => {
    if (completedSet.has(item.id)) {
      if (idx > highestCompletedIdx) {
        highestCompletedIdx = idx;
      }
    }
  });

  // Look for the next uncompleted lesson right after the highest completed one
  if (highestCompletedIdx >= 0 && highestCompletedIdx + 1 < sorted.length) {
    const candidate = sorted[highestCompletedIdx + 1];
    if (!completedSet.has(candidate.id)) {
      return {
        lesson: candidate,
        reason: 'next_after_last_completed',
        completedCount: completedSet.size,
        totalCount: sorted.length,
      };
    }
  }

  // Otherwise, look for the first uncompleted lesson from the beginning
  const firstUncompleted = sorted.find((item) => !completedSet.has(item.id));
  if (firstUncompleted) {
    return {
      lesson: firstUncompleted,
      reason: 'first_uncompleted',
      completedCount: completedSet.size,
      totalCount: sorted.length,
    };
  }

  // If all are completed, return the last lesson (or first for review)
  return {
    lesson: sorted[0],
    reason: 'all_completed',
    completedCount: sorted.length,
    totalCount: sorted.length,
  };
}
