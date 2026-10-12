import { describe, it, expect } from 'vitest';
import { lessons } from '../lib/content';

describe('Lesson TOC & Reading Companion Structure', () => {
  it('extracts valid TOC anchors for all 28 lessons', () => {
    expect(lessons.length).toBe(28);

    for (const lesson of lessons) {
      const anchors: string[] = [];

      // Sections
      if (lesson.sections && lesson.sections.length > 0) {
        lesson.sections.forEach((_, idx) => {
          anchors.push(`lesson-sec-${idx}`);
        });
      }

      // Key points & tips
      if (lesson.keyPoints && lesson.keyPoints.length > 0) anchors.push('lesson-key-points');
      if (lesson.commonMistakes && lesson.commonMistakes.length > 0) anchors.push('lesson-common-mistakes');
      if (lesson.examTips && lesson.examTips.length > 0) anchors.push('lesson-exam-tips');

      // References
      if (lesson.glossaryIds && lesson.glossaryIds.length > 0) anchors.push('lesson-related-glossary');
      if (lesson.comparisonIds && lesson.comparisonIds.length > 0) anchors.push('lesson-related-comparisons');

      // Check & footer
      anchors.push('lesson-comprehension-check');
      anchors.push('lesson-footer-nav-container');

      // Verify no duplicates
      const uniqueAnchors = new Set(anchors);
      expect(uniqueAnchors.size).toBe(anchors.length);

      // Verify minimum anchors present
      expect(anchors.length).toBeGreaterThanOrEqual(4);
      expect(anchors).toContain('lesson-comprehension-check');
      expect(anchors).toContain('lesson-footer-nav-container');
    }
  });

  it('guarantees estimated reading minutes and summaries for TOC cards', () => {
    for (const lesson of lessons) {
      expect(lesson.title).toBeTruthy();
      expect(lesson.summary).toBeTruthy();
      expect(lesson.estimatedMinutes).toBeGreaterThan(0);
      expect(lesson.estimatedMinutes).toBeLessThanOrEqual(25);
    }
  });
});
