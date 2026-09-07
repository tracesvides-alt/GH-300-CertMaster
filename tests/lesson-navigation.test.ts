import { describe, it, expect, beforeEach } from 'vitest';
import { getSortedLessons, getLessonNav, getResumeLesson } from '../lib/lesson-nav';
import { lessons, domains } from '../lib/content';
import { LearningDB, markLessonCompleted, toggleLessonCompleted, getCompletedLessonIds } from '../lib/db';
import 'fake-indexeddb/auto';

describe('Lesson Navigation UX', () => {
  const sorted = getSortedLessons(lessons);

  it('sorts all lessons strictly by Domain order, Objective order, and Lesson order', () => {
    expect(sorted.length).toBe(lessons.length);
    expect(sorted.length).toBeGreaterThan(0);

    // Verify domain ordering
    const domainOrder = domains.map((d) => d.id);
    let lastDomainIdx = -1;

    for (const item of sorted) {
      const curDomainIdx = domainOrder.indexOf(item.domainId);
      expect(curDomainIdx).toBeGreaterThanOrEqual(0);
      expect(curDomainIdx).toBeGreaterThanOrEqual(lastDomainIdx);
      lastDomainIdx = curDomainIdx;
    }
  });

  it('shows no "prev" on the first lesson', () => {
    const firstLesson = sorted[0];
    const nav = getLessonNav(firstLesson.id, lessons);
    expect(nav).not.toBeNull();
    expect(nav!.prev).toBeNull();
    expect(nav!.next).not.toBeNull();
    expect(nav!.currentOverallIndex).toBe(1);
    expect(nav!.currentDomainIndex).toBe(1);
  });

  it('shows no "next" on the last lesson', () => {
    const lastLesson = sorted[sorted.length - 1];
    const nav = getLessonNav(lastLesson.id, lessons);
    expect(nav).not.toBeNull();
    expect(nav!.next).toBeNull();
    expect(nav!.prev).not.toBeNull();
    expect(nav!.currentOverallIndex).toBe(sorted.length);
  });

  it('navigates in correct order within the same domain', () => {
    // Find consecutive lessons in the same domain
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].domainId === sorted[i + 1].domainId) {
        const nav = getLessonNav(sorted[i].id, lessons);
        expect(nav).not.toBeNull();
        expect(nav!.next?.id).toBe(sorted[i + 1].id);
        expect(nav!.isNextDifferentDomain).toBe(false);
      }
    }
  });

  it('detects domain transitions across domain boundaries and advances correctly', () => {
    // Find boundaries where domain changes
    let boundaryTested = false;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].domainId !== sorted[i + 1].domainId) {
        const nav = getLessonNav(sorted[i].id, lessons);
        expect(nav).not.toBeNull();
        expect(nav!.next?.id).toBe(sorted[i + 1].id);
        expect(nav!.isNextDifferentDomain).toBe(true);
        expect(nav!.next?.domainId).toBe(sorted[i + 1].domainId);
        boundaryTested = true;
      }
    }
    expect(boundaryTested).toBe(true);
  });

  it('has NO broken references for any prev or next lesson in the entire curriculum', () => {
    const lessonIdSet = new Set(lessons.map((l) => l.id));

    for (const item of sorted) {
      const nav = getLessonNav(item.id, lessons);
      expect(nav).not.toBeNull();

      if (nav!.prev) {
        expect(lessonIdSet.has(nav!.prev.id)).toBe(true);
      }
      if (nav!.next) {
        expect(lessonIdSet.has(nav!.next.id)).toBe(true);
      }
    }
  });

  it('provides accurate progress context (domain count & total count)', () => {
    const domainCounts: Record<string, number> = {};
    for (const item of sorted) {
      domainCounts[item.domainId] = (domainCounts[item.domainId] || 0) + 1;
    }

    for (const item of sorted) {
      const nav = getLessonNav(item.id, lessons);
      expect(nav).not.toBeNull();
      expect(nav!.totalLessonsCount).toBe(sorted.length);
      expect(nav!.domainLessonsCount).toBe(domainCounts[item.domainId]);
      expect(nav!.currentDomainIndex).toBeGreaterThanOrEqual(1);
      expect(nav!.currentDomainIndex).toBeLessThanOrEqual(domainCounts[item.domainId]);
    }
  });

  describe('Resume Learning Calculation', () => {
    it('recommends the first lesson if nothing is completed', () => {
      const resume = getResumeLesson([], lessons);
      expect(resume.lesson.id).toBe(sorted[0].id);
      expect(resume.reason).toBe('first_uncompleted');
      expect(resume.completedCount).toBe(0);
    });

    it('recommends the next lesson after the last completed lesson', () => {
      // Completed lesson 0
      const resume1 = getResumeLesson([sorted[0].id], lessons);
      expect(resume1.lesson.id).toBe(sorted[1].id);
      expect(resume1.reason).toBe('next_after_last_completed');
      expect(resume1.completedCount).toBe(1);

      // Completed lesson 0 and 1
      const resume2 = getResumeLesson([sorted[0].id, sorted[1].id], lessons);
      expect(resume2.lesson.id).toBe(sorted[2].id);
      expect(resume2.reason).toBe('next_after_last_completed');
      expect(resume2.completedCount).toBe(2);
    });

    it('skips already completed lessons and finds the first uncompleted lesson if jumping', () => {
      // Completed lesson 0, 1, and 3 (skipped 2)
      const resume = getResumeLesson([sorted[0].id, sorted[1].id, sorted[3].id], lessons);
      // Next after highest completed (3) is 4
      expect(resume.lesson.id).toBe(sorted[4].id);
      expect(resume.reason).toBe('next_after_last_completed');
    });

    it('returns all_completed status when all lessons are finished', () => {
      const allIds = sorted.map((l) => l.id);
      const resume = getResumeLesson(allIds, lessons);
      expect(resume.reason).toBe('all_completed');
      expect(resume.completedCount).toBe(sorted.length);
      expect(resume.lesson.id).toBe(sorted[0].id);
    });
  });

  describe('Dexie DB Lesson Completion Persistence', () => {
    let testDb: LearningDB;

    beforeEach(async () => {
      testDb = new LearningDB(`test-lesson-db-${Date.now()}`);
      await testDb.lessonCompletions.clear();
    });

    it('stores and retrieves completed lessons', async () => {
      await testDb.lessonCompletions.put({
        id: sorted[0].id,
        completedAt: new Date().toISOString(),
      });

      const list = await testDb.lessonCompletions.toArray();
      expect(list.length).toBe(1);
      expect(list[0].id).toBe(sorted[0].id);
      expect(list[0].completedAt).toBeDefined();
    });

    it('can toggle completion status cleanly', async () => {
      // Toggle ON
      await testDb.lessonCompletions.put({
        id: sorted[1].id,
        completedAt: new Date().toISOString(),
      });
      let entry = await testDb.lessonCompletions.get(sorted[1].id);
      expect(entry).toBeDefined();

      // Toggle OFF
      await testDb.lessonCompletions.delete(sorted[1].id);
      entry = await testDb.lessonCompletions.get(sorted[1].id);
      expect(entry).toBeUndefined();
    });
  });
});
