import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { buildPracticeCoverageAudit } from '../scripts/audit-official-practice-coverage.mjs';
import { buildLearningAudit } from '../scripts/audit-learning-content.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const lessons = read('content/gh300/2026-08-07/lessons/seed.json');
const glossary = read('content/gh300/2026-08-07/glossary/terms.json');
const comparisons = read('content/gh300/2026-08-07/comparisons/guides.json');
const sources = read('content/gh300/2026-08-07/sources.json');
const practice = read('reports/official-practice-question-inventory.json');
const byId = (items, id) => items.find((item) => item.id === id);

describe('official practice remediation', () => {
  it('separates retired or disputed practice from current knowledge coverage', () => {
    const audit = buildPracticeCoverageAudit();
    expect(audit.errors).toEqual([]);
    expect(audit.baseline).toEqual({ COVERED: 30, PARTIAL: 10, MISSING: 6, UNCERTAIN: 4 });
    expect(audit.practiceIssues.PRACTICE_OUTDATED).toEqual(['PRACTICE-001', 'PRACTICE-006']);
    expect(audit.practiceIssues.PRACTICE_INCORRECT).toEqual(['PRACTICE-003']);
    expect(audit.practiceIssues.NEEDS_REVIEW).toEqual(['PRACTICE-014', 'PRACTICE-043']);
    expect(audit.currentPracticeCount).toBe(45);
    expect(audit.currentCoverage).toEqual({ COVERED: 45, PARTIAL: 0, MISSING: 0 });
  });

  it('keeps Free and Spaces as current knowledge while labeling Knowledge Bases as retired', () => {
    const plans = byId(glossary, 'g-subscription-plans');
    const spaces = byId(glossary, 'g-spaces');
    const legacy = byId(glossary, 'g-legacy-knowledge-bases');
    expect(plans.shortDefinition).toContain('Free');
    expect(plans.detailedDefinition).toContain('Copilot Free');
    expect(spaces.detailedDefinition).toContain('2025年11月1日');
    expect(legacy.category).toMatch(/retired.*legacy/);
    expect(legacy.shortDefinition).toContain('終了');
    expect(practice[5].coverage).toBe('PRACTICE_OUTDATED');
    expect(comparisons.some((item) => item.title.includes('Knowledge Bases vs'))).toBe(false);
  });

  it('links new concepts to lessons, comparisons, and existing official sources', () => {
    const addedTerms = [
      'g-fill-in-the-middle', 'g-test-explorer', 'g-arrange-act-assert', 'g-code-quality-attributes',
      'g-reliability', 'g-safe-exception-handling', 'g-input-validation', 'g-project-documentation',
      'g-safety-filtering', 'g-legacy-knowledge-bases',
    ];
    const addedComparisons = [
      'cmp-test-generation-vs-explorer', 'cmp-quality-attributes',
      'cmp-input-validation-vs-assertion', 'cmp-safety-filter-types',
    ];
    for (const id of addedTerms) {
      const term = byId(glossary, id);
      expect(term).toBeDefined();
      expect(term.lessonIds.length).toBeGreaterThan(0);
      expect(term.sourceIds.length).toBeGreaterThan(0);
      for (const lid of term.lessonIds) expect(byId(lessons, lid).glossaryIds).toContain(id);
      for (const sid of term.sourceIds) expect(byId(sources, sid)).toBeDefined();
    }
    for (const id of addedComparisons) {
      const guide = byId(comparisons, id);
      expect(guide).toBeDefined();
      for (const lid of guide.lessonIds) expect(byId(lessons, lid).comparisonIds).toContain(id);
      for (const gid of guide.comparedTermIds) expect(byId(glossary, gid).comparisonIds).toContain(id);
      for (const sid of guide.sourceIds) expect(byId(sources, sid)).toBeDefined();
    }
    const learningAudit = buildLearningAudit('2026-10-12');
    expect(learningAudit.brokenReferences).toEqual([]);
    expect(learningAudit.verifiedWithoutOfficialSource).toEqual([]);
    expect(learningAudit.coverage).toHaveLength(14);
    expect(learningAudit.coverage.every((objective) => objective.lessonIds.length && objective.glossaryIds.length)).toBe(true);
  });
});
