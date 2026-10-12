import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { buildLearningAudit } from '../scripts/audit-learning-content.mjs';

const audit = buildLearningAudit('2026-10-12');
const syllabus = JSON.parse(fs.readFileSync(new URL('../content/gh300/2026-08-07/syllabus.json', import.meta.url), 'utf8'));
const lessons = JSON.parse(fs.readFileSync(new URL('../content/gh300/2026-08-07/lessons/seed.json', import.meta.url), 'utf8'));
const glossary = JSON.parse(fs.readFileSync(new URL('../content/gh300/2026-08-07/glossary/terms.json', import.meta.url), 'utf8'));

describe('GH-300 learning-content audit', () => {
  it('has one active syllabus version with no mixed-version content', () => {
    expect(syllabus.version).toBe(audit.currentBlueprint);
    expect(audit.activeVersionMismatch).toEqual([]);
    expect(new Set(Object.values(audit.inventory).flat().filter((entry) => !entry.url).map((entry) => entry.syllabusVersion))).toEqual(new Set([syllabus.version]));
  });

  it('covers every objective with a lesson and glossary and all essential terms are mapped', () => {
    expect(audit.coverage).toHaveLength(14);
    for (const objective of audit.coverage) {
      expect(objective.lessonIds.length).toBeGreaterThan(0);
      expect(objective.glossaryIds.length).toBeGreaterThan(0);
    }
    for (const term of glossary.filter((entry) => entry.importance === 'essential')) {
      expect(term.objectiveIds.length).toBeGreaterThan(0);
      expect(term.lessonIds.length).toBeGreaterThan(0);
    }
  });

  it('has official evidence for verified content and no broken references', () => {
    expect(audit.verifiedWithoutOfficialSource).toEqual([]);
    expect(audit.brokenReferences).toEqual([]);
  });

  it('keeps retired App-based Extensions out of current-use recommendations', () => {
    const extension = glossary.find((entry) => entry.id === 'g-copilot-extensions');
    expect(extension.status).toBe('needs-review');
    expect(extension.detailedDefinition).toContain('終了');
    const mcpLesson = lessons.find((entry) => entry.id === 'lesson-d2-mcp');
    expect(mcpLesson.summary).toContain('終了');
    expect(mcpLesson.sections.find((section) => section.heading.includes('Limitations')).content).toContain('新規の外部ツール連携ではMCP');
  });

  it('lists needs-review and stale candidates without marking age as error', () => {
    expect(audit.needsReview).toContain('g-exclusion-limitations');
    expect(audit.needsReview).toContain('cmp-mcp-vs-extensions');
    expect(audit.questionImpact).toContain('q11');
    const laterAudit = buildLearningAudit('2027-02-01');
    expect(laterAudit.staleCandidates.length).toBeGreaterThan(0);
    expect(laterAudit.inventory.lessons.find((entry) => entry.id === 'lesson-d1-principles').status).toBe('verified');
  });
});
