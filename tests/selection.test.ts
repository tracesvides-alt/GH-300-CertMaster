import { describe, it, expect } from 'vitest';
import Dexie from 'dexie';
import { questions, domains, type Question } from '../lib/content';
import { type Attempt } from '../lib/learning';
import { LearningDB } from '../lib/db';
import {
  defaultSelectionOptions as defaults,
  questionCounts,
  selectQuestions,
  selectMockQuestions,
  allocateQuestionsByDomain,
  calculateQuestionWeights,
  calculateObjectiveStats,
  applyRecentQuestionPenalty,
  applyUnansweredBonus,
  buildQuestionHistory,
  selectionOptionsSchema,
  type SelectionOptions,
} from '../lib/selection';
import { practiceResult, improvedObjectives, type PracticeRun } from '../lib/practice-session';
const now = 1700000000000;
function rng(seed = 1) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
// Algorithm fixtures only: these synthetic IDs never enter the production Question Bank.
const largeBank: Question[] = domains.flatMap((d) =>
  Array.from({ length: 40 }, (_, i) => ({
    ...questions.find((q) => q.domainId === d.id)!,
    id: `fixture-${d.id}-${i}`,
    objectiveId: d.objectives[i % d.objectives.length].id,
  })),
);
const answer = (q: Question, correct = true, at = now - 1000): Attempt => ({
  id: crypto.randomUUID(),
  questionId: q.id,
  objectiveId: q.objectiveId,
  domainId: q.domainId,
  answer: correct ? q.answer : [],
  correct,
  at,
  status: q.status,
});
const options = (patch: Partial<SelectionOptions> = {}): SelectionOptions => ({
  ...defaults,
  ...patch,
});
describe('selection contract', () => {
  for (const mode of ['Random', 'Syllabus Weighted', 'Weak Points'] as const)
    it.each(questionCounts)(`${mode} returns %i distinct questions when available`, (count) => {
      const result = selectQuestions(largeBank, options({ count, mode }), {
        attempts: [],
        rng: rng(),
      });
      expect(result.questions).toHaveLength(count);
      expect(new Set(result.questions.map((q) => q.id)).size).toBe(count);
    });
  it('has requested first-use defaults and rejects invalid/contradictory settings', () => {
    expect(selectionOptionsSchema.parse({})).toEqual(defaults);
    expect(defaults.count).toBe(10);
    expect(() => selectionOptionsSchema.parse({ ...defaults, count: 6 })).toThrow();
    expect(() => selectionOptionsSchema.parse({ ...defaults, includeAI: true })).toThrow();
  });
  it('deduplicates the input bank', () => {
    const result = selectQuestions([...largeBank, ...largeBank], options({ count: 50 }), {
      attempts: [],
      rng: rng(),
    });
    expect(new Set(result.questions.map((q) => q.id)).size).toBe(50);
  });
  it('supports legacy domain/objective/bookmark and latest-incorrect filters', () => {
    const q = questions[0];
    const result = selectQuestions(
      questions,
      options({ domainId: q.domainId, objectiveId: q.objectiveId, scope: 'bookmarked' }),
      { attempts: [], bookmarkIds: [q.id] },
    );
    expect(result.questions.map((q) => q.id)).toEqual([q.id]);
    const corrected = selectQuestions(questions, options({ scope: 'incorrect' }), {
      attempts: [answer(q, false, 1), answer(q, true, 2)],
    });
    expect(corrected.actualCount).toBe(0);
  });
});
describe('syllabus distributions', () => {
  it.each([20, 30, 50] as const)('%i satisfies all min/max ranges over varying draws', (count) => {
    const allocations = new Set<string>();
    for (let seed = 1; seed <= 100; seed++) {
      const result = selectQuestions(largeBank, options({ count, mode: 'Syllabus Weighted' }), {
        attempts: [],
        rng: rng(seed),
      });
      expect(result.actualCount).toBe(count);
      expect(result.meetsRanges).toBe(true);
      allocations.add(result.counts.join(','));
      result.counts.forEach((n, i) => {
        expect((n / count) * 100).toBeGreaterThanOrEqual(domains[i].min);
        expect((n / count) * 100).toBeLessThanOrEqual(domains[i].max);
      });
      expect(result.counts[1]).toBe(Math.max(...result.counts));
    }
    if (count !== 20) expect(allocations.size).toBeGreaterThan(1);
  });
  it.each([5, 10] as const)(
    '%i weighted random approaches normalized midpoint weights over 2500 sessions',
    (count) => {
      const random = rng(123),
        totals = domains.map(() => 0);
      for (let i = 0; i < 2500; i++) {
        const result = selectQuestions(largeBank, options({ count, mode: 'Syllabus Weighted' }), {
          attempts: [],
          rng: random,
        });
        expect(result.method).toBe('weighted-random');
        result.counts.forEach((n, j) => (totals[j] += n));
      }
      totals.forEach((n, i) =>
        expect(
          Math.abs(n / (2500 * count) - (domains[i].min + domains[i].max) / 2 / 95),
        ).toBeLessThan(0.027),
      );
    },
    20000,
  );
  it('redistributes safely when a domain is missing but total supply is enough', () => {
    const bank = largeBank.filter((q) => q.domainId !== 'd2');
    const result = selectQuestions(bank, options({ count: 50, mode: 'Syllabus Weighted' }), {
      attempts: [],
      rng: rng(),
    });
    expect(result.actualCount).toBe(50);
    expect(result.meetsRanges).toBe(false);
    expect(result.notices.join(' ')).toContain('配分を調整');
    expect(result.counts[1]).toBe(0);
  });
  it('handles all capacities, including empty, without duplicates or infinite loops', () => {
    expect(allocateQuestionsByDomain(50, [0, 0, 0, 0, 0, 0]).actual).toBe(0);
    expect(
      allocateQuestionsByDomain(50, [1, 2, 3, 4, 5, 6], rng()).counts.reduce((a, b) => a + b),
    ).toBe(21);
    expect(() => allocateQuestionsByDomain(10, [-1, 0, 0, 0, 0, 0])).toThrow();
  });
});
describe('history and question weighting', () => {
  it('exposes answer count and last answer independent of input ordering', () => {
    const q = questions[0],
      h = buildQuestionHistory([answer(q, true, now), answer(q, false, 1)])[q.id];
    expect(h.answerCount).toBe(2);
    expect(h.lastAnsweredAt).toBe(now);
    expect(h.latestCorrect).toBe(true);
  });
  it('uses nonzero recent penalties and optional unanswered bonus', () => {
    expect(applyRecentQuestionPenalty(now, now)).toBe(0.08);
    expect(applyRecentQuestionPenalty(now - 2 * 86400000, now)).toBe(0.4);
    expect(applyRecentQuestionPenalty(now, now, false)).toBe(1);
    expect(applyRecentQuestionPenalty(null, now)).toBe(1);
    expect(applyUnansweredBonus(0)).toBe(3);
    expect(applyUnansweredBonus(0, false)).toBe(1);
  });
  it('recent-answer and unanswered settings measurably change draw probabilities', () => {
    const bank = largeBank.slice(0, 40);
    const recent = bank.slice(0, 20).map((q) => answer(q, true, now));
    function hits(patch: Partial<SelectionOptions>) {
      const random = rng(42);
      let hits = 0;
      for (let n = 0; n < 600; n++)
        hits += selectQuestions(bank, options({ count: 5, ...patch }), {
          attempts: recent,
          now,
          rng: random,
        }).questions.filter((q) => bank.slice(0, 20).some((old) => old.id === q.id)).length;
      return hits;
    }
    const neutral = hits({ preferUnanswered: false, avoidRecent: false });
    expect(hits({ preferUnanswered: false, avoidRecent: true })).toBeLessThan(neutral * 0.4);
    expect(hits({ preferUnanswered: true, avoidRecent: false })).toBeLessThan(neutral * 0.7);
  }, 15000);
  it('penalizes overrepresented objectives within a session', () => {
    const bank = largeBank.filter((q) => q.domainId === 'd1');
    const result = selectQuestions(bank, options({ count: 20 }), { attempts: [], rng: rng(72) });
    const counts = domains[0].objectives.map(
      (o) => result.questions.filter((q) => q.objectiveId === o.id).length,
    );
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(5);
  });
  it('continues with entirely recent small banks, reports actual count, never reuses an ID', () => {
    const result = selectQuestions(questions, options({ count: 50 }), {
      attempts: questions.map((q) => answer(q)),
      now,
      rng: rng(),
    });
    expect(result.actualCount).toBe(questions.length);
    expect(result.questions.every((q) => q.status === 'verified')).toBe(true);
    expect(result.notices.join(' ')).toContain('最近回答');
    expect(result.notices.join(' ')).toContain('指定50問');
  });
});
describe('objective weakness', () => {
  const qs = [questions[0], questions[1], questions[2]];
  const history = qs.flatMap((q, i) =>
    Array.from({ length: 10 }, (_, j) =>
      answer({ ...q, id: `history-${i}-${j}` }, i === 2 || (i === 1 && j < 4), now - j * 1000),
    ),
  );
  const bank = qs.flatMap((q) =>
    Array.from({ length: 30 }, (_, i) => ({ ...q, id: `weak-fixture-${q.objectiveId}-${i}` })),
  );
  it('smooths low sample objectives instead of ranking a single failure as weakest', () => {
    const stats = calculateObjectiveStats([
      ...history,
      answer({ ...questions[6], id: 'one' }, false),
    ]);
    expect(stats[questions[6].objectiveId].masteryScore).toBeGreaterThan(
      stats[qs[0].objectiveId].masteryScore,
    );
    expect(stats[questions[6].objectiveId].confidence).toBeLessThan(0.3);
    expect(stats[qs[0].objectiveId].incorrectCount).toBe(10);
  });
  it('recent accuracy can reflect improvement despite lifetime mistakes', () => {
    const q = qs[0];
    const improving = Array.from({ length: 30 }, (_, i) => answer(q, i >= 20, i));
    const declining = Array.from({ length: 30 }, (_, i) => answer(q, i < 10, i));
    expect(calculateObjectiveStats(improving)[q.objectiveId].masteryScore).toBeGreaterThan(
      calculateObjectiveStats(declining)[q.objectiveId].masteryScore,
    );
  });
  it('weakest objectives have greater weights and appear more often without monopolizing draws', () => {
    const opts = options({ mode: 'Weak Points', count: 10 });
    const weights = calculateQuestionWeights(bank, opts, { attempts: history, now }, true);
    expect(weights.get(bank[0].id)!).toBeGreaterThan(weights.get(bank[60].id)!);
    const random = rng(33),
      totals = [0, 0, 0];
    for (let i = 0; i < 500; i++) {
      const r = selectQuestions(bank, opts, { attempts: history, now, rng: random });
      expect(r.method).toBe('weak-points');
      qs.forEach(
        (q, j) =>
          (totals[j] += r.questions.filter((item) => item.objectiveId === q.objectiveId).length),
      );
    }
    expect(totals[0]).toBeGreaterThan(totals[1]);
    expect(totals[1]).toBeGreaterThan(totals[2]);
    expect(totals[0] / 5000).toBeLessThan(0.65);
  }, 15000);
  it('uses random fallback with insufficient samples', () => {
    const r = selectQuestions(bank, options({ mode: 'Weak Points' }), {
      attempts: [answer(qs[0], false)],
      rng: rng(),
    });
    expect(r.actualCount).toBe(10);
    expect(r.method).toBe('random');
    expect(r.notices.join(' ')).toContain('履歴がまだ少ない');
  });
});
describe('AI eligibility', () => {
  const ai = largeBank.map((q) => ({
    ...q,
    id: `ai-${q.id}`,
    status: 'ai-generated' as const,
    lastVerifiedAt: null,
  }));
  it('never includes AI by default, including mock', () => {
    const bank = [...ai, ...largeBank];
    expect(
      selectQuestions(bank, defaults, { attempts: [] }).questions.every(
        (q) => q.status === 'verified',
      ),
    ).toBe(true);
    expect(
      selectMockQuestions(bank, 50, { attempts: [] }).questions.every(
        (q) => q.status === 'verified',
      ),
    ).toBe(true);
    expect(selectQuestions(ai, defaults, { attempts: [] }).actualCount).toBe(0);
  });
  it('includes AI only on opt-in and gives verified questions higher base weight', () => {
    const opts = options({ verifiedOnly: false, includeAI: true, count: 50 });
    const bank = [largeBank[0], ai[0]];
    const weights = calculateQuestionWeights(bank, opts, { attempts: [] });
    expect(weights.get(bank[0].id)!).toBeGreaterThan(weights.get(bank[1].id)!);
    expect(selectQuestions(bank, opts, { attempts: [] }).questions.map((q) => q.status)).toContain(
      'ai-generated',
    );
  });
});
describe('practice results and DB migration', () => {
  it('reports exact session scores, wrong objectives, lessons and smoothed improvement', () => {
    const chosen = questions.slice(0, 5),
      attempts = chosen.map((q, i) => answer(q, i !== 0));
    const run: PracticeRun = {
      id: 'session',
      questions: chosen,
      options: options({ count: 5 }),
      beforeStats: calculateObjectiveStats(
        [],
        chosen.map((q) => q.objectiveId),
      ),
      answers: attempts,
      startedAt: now - 10000,
      completedAt: now,
    };
    const result = practiceResult(run);
    expect(result.correct).toBe(4);
    expect(result.total).toBe(5);
    expect(result.accuracy).toBe(80);
    expect(result.wrongObjectiveIds).toEqual([chosen[0].objectiveId]);
    expect(result.recommendedLessons.length).toBeGreaterThan(0);
    expect(improvedObjectives(run, attempts).map((o) => o.id)).toContain(chosen[1].objectiveId);
  });
  it('upgrades v1 without losing history and persists settings/results after reopen', async () => {
    const name = 'migration-' + crypto.randomUUID(),
      old = new Dexie(name);
    old
      .version(1)
      .stores({
        attempts: 'id, questionId, objectiveId, at, sessionId',
        bookmarks: 'id',
        generated: 'id, objectiveId',
        sessions: 'id',
      });
    await old.table('attempts').add(answer(questions[0]));
    old.close();
    const db = new LearningDB(name);
    await db.settings.put({
      id: 'practice',
      value: options({ count: 30, mode: 'Syllabus Weighted' }),
    });
    const run: PracticeRun = {
      id: 'saved',
      questions: questions.slice(0, 5),
      options: options({ count: 5 }),
      beforeStats: {},
      answers: [],
      startedAt: now,
      completedAt: now,
    };
    await db.practiceRuns.put(run);
    db.close();
    const reopened = new LearningDB(name);
    expect(await reopened.attempts.count()).toBe(1);
    expect((await reopened.settings.get('practice'))?.value.count).toBe(30);
    expect((await reopened.practiceRuns.get('saved'))?.questions.length).toBe(5);
    await reopened.delete();
  });
});
