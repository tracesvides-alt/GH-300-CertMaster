import { z } from 'zod';
import { domains, type Question } from './content';
import type { Attempt } from './learning';
export const questionCounts = [5, 10, 20, 30, 50] as const;
export const selectionOptionsSchema = z
  .object({
    count: z
      .union([z.literal(5), z.literal(10), z.literal(20), z.literal(30), z.literal(50)])
      .default(10),
    mode: z.enum(['Random', 'Syllabus Weighted', 'Weak Points']).default('Random'),
    preferUnanswered: z.boolean().default(true),
    avoidRecent: z.boolean().default(true),
    verifiedOnly: z.boolean().default(true),
    includeAI: z.boolean().default(false),
    domainId: z.string().default('all'),
    objectiveId: z.string().default('all'),
    scope: z.enum(['all', 'incorrect', 'bookmarked']).default('all'),
  })
  .refine(
    (o) => !(o.verifiedOnly && o.includeAI),
    'Verified only and include AI are mutually exclusive',
  );
export type SelectionOptions = z.infer<typeof selectionOptionsSchema>;
export const defaultSelectionOptions = selectionOptionsSchema.parse({});
export type QuestionHistory = {
  lastAnsweredAt: number | null;
  answerCount: number;
  latestCorrect: boolean;
};
export type ObjectiveStats = {
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  recentAccuracy: number;
  lastAnsweredAt: number | null;
  masteryScore: number;
  confidence: number;
};
export type SelectionContext = {
  attempts: Attempt[];
  bookmarkIds?: string[];
  now?: number;
  rng?: () => number;
};
export type SelectionResult = {
  questions: Question[];
  requestedCount: number;
  actualCount: number;
  counts: number[];
  method: 'random' | 'weighted-random' | 'integer' | 'weak-points';
  meetsRanges: boolean;
  notices: string[];
};
export const domainWeights = domains.map((d) => (d.min + d.max) / 2);
export function buildQuestionHistory(attempts: Attempt[]): Record<string, QuestionHistory> {
  const result: Record<string, QuestionHistory> = {};
  for (const a of [...attempts].sort((a, b) => a.at - b.at)) {
    const old = result[a.questionId];
    result[a.questionId] = {
      lastAnsweredAt: a.at,
      answerCount: (old?.answerCount ?? 0) + 1,
      latestCorrect: a.correct,
    };
  }
  return result;
}
// Beta(2,2) prior; recent ten answers have 60% of the score. AI answers do not determine mastery.
export function calculateObjectiveStats(
  attempts: Attempt[],
  objectiveIds: string[] = [],
): Record<string, ObjectiveStats> {
  const verified = attempts.filter((a) => a.status === 'verified');
  const ids = new Set([...objectiveIds, ...verified.map((a) => a.objectiveId)]);
  return Object.fromEntries(
    [...ids].map((id) => {
      const rows = verified.filter((a) => a.objectiveId === id).sort((a, b) => b.at - a.at);
      const recent = rows.slice(0, 10),
        correct = rows.filter((a) => a.correct).length,
        recentCorrect = recent.filter((a) => a.correct).length;
      return [
        id,
        {
          attempts: rows.length,
          correctCount: correct,
          incorrectCount: rows.length - correct,
          recentAccuracy: recent.length ? recentCorrect / recent.length : 0,
          lastAnsweredAt: rows[0]?.at ?? null,
          masteryScore:
            100 *
            ((0.4 * (correct + 2)) / (rows.length + 4) +
              (0.6 * (recentCorrect + 2)) / (recent.length + 4)),
          confidence: rows.length / (rows.length + 4),
        },
      ];
    }),
  );
}
export function preventDuplicateQuestions(bank: Question[]) {
  return [...new Map(bank.map((q) => [q.id, q])).values()];
}
export function filterEligibleQuestions(
  bank: Question[],
  options: SelectionOptions,
  context: SelectionContext,
) {
  const history = buildQuestionHistory(context.attempts);
  return preventDuplicateQuestions(bank).filter(
    (q) =>
      domains.some((d) => d.id === q.domainId) &&
      (q.status === 'verified' || (!options.verifiedOnly && options.includeAI)) &&
      (options.domainId === 'all' || q.domainId === options.domainId) &&
      (options.objectiveId === 'all' || q.objectiveId === options.objectiveId) &&
      (options.scope !== 'incorrect' || history[q.id]?.latestCorrect === false) &&
      (options.scope !== 'bookmarked' || context.bookmarkIds?.includes(q.id)),
  );
}
export function applyRecentQuestionPenalty(
  lastAnsweredAt: number | null | undefined,
  now: number,
  enabled = true,
) {
  if (!enabled || lastAnsweredAt == null) return 1;
  const elapsed = now - lastAnsweredAt;
  return elapsed < 86400000 ? 0.08 : elapsed < 7 * 86400000 ? 0.4 : 1;
}
export function applyUnansweredBonus(answerCount: number, enabled = true) {
  return enabled && answerCount === 0 ? 3 : 1;
}
// Equal-score objectives remain in the same tier; one failed answer cannot create a weakest tier.
export function weaknessWeights(stats: Record<string, ObjectiveStats>) {
  const measured = Object.values(stats)
    .filter((s) => s.attempts >= 3)
    .map((s) => s.masteryScore)
    .sort((a, b) => a - b);
  if (measured.length < 2) return Object.fromEntries(Object.keys(stats).map((id) => [id, 1]));
  const low = measured[Math.floor((measured.length - 1) / 3)],
    middle = measured[Math.floor(((measured.length - 1) * 2) / 3)];
  const tiers = Object.fromEntries(
    Object.entries(stats).map(([id, s]) => [
      id,
      s.attempts < 3 ? 2 : s.masteryScore <= low ? 0 : s.masteryScore <= middle ? 1 : 2,
    ]),
  );
  const sizes = [0, 0, 0];
  Object.values(tiers).forEach((tier) => sizes[tier]++);
  return Object.fromEntries(
    Object.entries(tiers).map(([id, tier]) => [id, [0.5, 0.3, 0.2][tier] / sizes[tier]]),
  );
}
export function calculateQuestionWeights(
  bank: Question[],
  options: SelectionOptions,
  context: SelectionContext,
  weak = false,
) {
  const history = buildQuestionHistory(context.attempts),
    now = context.now ?? Date.now();
  const allStats = calculateObjectiveStats(
    context.attempts,
    bank.map((q) => q.objectiveId),
  );
  const stats = Object.fromEntries(
    [...new Set(bank.map((q) => q.objectiveId))].map((id) => [id, allStats[id]]),
  );
  const weakness = weaknessWeights(stats);
  const sizes = Object.fromEntries(
    [...new Set(bank.map((q) => q.objectiveId))].map((id) => [
      id,
      bank.filter((q) => q.objectiveId === id).length,
    ]),
  );
  return new Map(
    bank.map((q) => {
      const h = history[q.id],
        count = h?.answerCount ?? 0;
      const base = q.status === 'verified' ? 1 : 0.25;
      const repetition = 1 / Math.sqrt(1 + count * 0.15);
      return [
        q.id,
        (base *
          applyUnansweredBonus(count, options.preferUnanswered) *
          applyRecentQuestionPenalty(h?.lastAnsweredAt, now, options.avoidRecent) *
          repetition *
          (weak ? (weakness[q.objectiveId] ?? 1) : 1)) /
          sizes[q.objectiveId],
      ];
    }),
  );
}
function draw<T>(items: T[], weight: (item: T) => number, rng: () => number): T {
  const weights = items.map(weight),
    sum = weights.reduce((a, b) => a + b, 0);
  let roll = Math.max(0, Math.min(1 - Number.EPSILON, rng())) * sum;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll < 0) return items[i];
  }
  return items[items.length - 1];
}
function pick(
  bank: Question[],
  count: number,
  weights: Map<string, number>,
  rng: () => number,
  chosen: Question[] = [],
) {
  const remaining = [...bank],
    selected = [...chosen],
    answer: Question[] = [];
  while (answer.length < count && remaining.length) {
    const q = draw(
      remaining,
      (q) =>
        (weights.get(q.id) ?? 1) /
        Math.pow(1 + selected.filter((s) => s.objectiveId === q.objectiveId).length, 0.75),
      rng,
    );
    answer.push(q);
    selected.push(q);
    remaining.splice(
      remaining.findIndex((item) => item.id === q.id),
      1,
    );
  }
  return answer;
}
export function selectRandomQuestions(
  bank: Question[],
  options: SelectionOptions,
  context: SelectionContext,
) {
  return pick(
    bank,
    options.count,
    calculateQuestionWeights(bank, options, context),
    context.rng ?? Math.random,
  );
}
// Randomized feasible allocations, with capacity-aware relaxation only when necessary.
export function allocateQuestionsByDomain(
  total: number,
  capacities = domains.map(() => Infinity),
  rng = Math.random,
) {
  if (!Number.isInteger(total) || total < 1 || total > 200) throw Error('問題数は1〜200の整数です');
  if (
    capacities.length !== domains.length ||
    capacities.some((c) => c < 0 || (!Number.isInteger(c) && c !== Infinity))
  )
    throw Error('Invalid capacities');
  const actual = Math.min(
    total,
    capacities.reduce((a, b) => a + b, 0),
  );
  const lower = domains.map((d) => Math.ceil((actual * d.min) / 100)),
    upper = domains.map((d) => Math.floor((actual * d.max) / 100));
  const feasible =
    lower.every((n, i) => n <= Math.min(upper[i], capacities[i])) &&
    lower.reduce((a, b) => a + b, 0) <= actual &&
    upper.reduce((s, v, i) => s + Math.min(v, capacities[i]), 0) >= actual;
  const counts = feasible ? [...lower] : domains.map(() => 0);
  while (counts.reduce((a, b) => a + b, 0) < actual) {
    let candidates = domains
      .map((_, i) => i)
      .filter((i) => counts[i] < capacities[i] && counts[i] < upper[i]);
    if (!candidates.length)
      candidates = domains.map((_, i) => i).filter((i) => counts[i] < capacities[i]);
    // Fill lower-bound deficits first in a constrained fallback.
    const deficit = candidates.filter((i) => counts[i] < lower[i]);
    const i = draw(
      deficit.length ? deficit : candidates,
      (i) => domainWeights[i] / (counts[i] + 1),
      rng,
    );
    counts[i]++;
  }
  return { counts, feasible, actual };
}
export function selectSyllabusWeightedQuestions(
  bank: Question[],
  options: SelectionOptions,
  context: SelectionContext,
) {
  const rng = context.rng ?? Math.random,
    weights = calculateQuestionWeights(bank, options, context),
    selected: Question[] = [];
  if (options.count <= 10) {
    const remaining = [...bank];
    while (selected.length < options.count && remaining.length) {
      const eligible = domains
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => remaining.some((q) => q.domainId === d.id));
      const { d } = draw(
        eligible,
        ({ d, i }) =>
          domainWeights[i] *
          (selected.filter((q) => q.domainId === d.id).length >=
          Math.ceil((options.count * d.max) / 100) + 1
            ? 0.4
            : 1),
        rng,
      );
      const q = pick(
        remaining.filter((q) => q.domainId === d.id),
        1,
        weights,
        rng,
        selected,
      )[0];
      selected.push(q);
      remaining.splice(
        remaining.findIndex((item) => item.id === q.id),
        1,
      );
    }
    return selected;
  }
  const capacities = domains.map((d) => bank.filter((q) => q.domainId === d.id).length);
  const allocation = allocateQuestionsByDomain(options.count, capacities, rng);
  domains.forEach((d, i) =>
    selected.push(
      ...pick(
        bank.filter((q) => q.domainId === d.id),
        allocation.counts[i],
        weights,
        rng,
      ),
    ),
  );
  // Interleave domains in random order without changing the allocation.
  return pick(selected, selected.length, new Map(selected.map((q) => [q.id, 1])), rng);
}
export function selectWeakPointQuestions(
  bank: Question[],
  options: SelectionOptions,
  context: SelectionContext,
) {
  return pick(
    bank,
    options.count,
    calculateQuestionWeights(bank, options, context, true),
    context.rng ?? Math.random,
  );
}
export function selectQuestions(
  bank: Question[],
  rawOptions: SelectionOptions,
  context: SelectionContext,
): SelectionResult {
  const options = selectionOptionsSchema.parse(rawOptions),
    eligible = filterEligibleQuestions(bank, options, context),
    notices: string[] = [];
  const stats = calculateObjectiveStats(
    context.attempts,
    eligible.map((q) => q.objectiveId),
  );
  const enoughHistory =
    Object.entries(stats).filter(
      ([id, s]) => eligible.some((q) => q.objectiveId === id) && s.attempts >= 3,
    ).length >= 2;
  let method: SelectionResult['method'] =
    options.mode === 'Syllabus Weighted'
      ? options.count <= 10
        ? 'weighted-random'
        : 'integer'
      : options.mode === 'Weak Points'
        ? 'weak-points'
        : 'random';
  if (method === 'weak-points' && !enoughHistory) {
    method = 'random';
    notices.push('弱点を判断する回答履歴がまだ少ないため、ランダムで出題します。');
  }
  const selected =
    method === 'random'
      ? selectRandomQuestions(eligible, options, context)
      : method === 'weak-points'
        ? selectWeakPointQuestions(eligible, options, context)
        : selectSyllabusWeightedQuestions(eligible, options, context);
  const counts = domains.map((d) => selected.filter((q) => q.domainId === d.id).length);
  const meetsRanges =
    selected.length > 0 &&
    counts.every(
      (n, i) =>
        n >= Math.ceil((selected.length * domains[i].min) / 100) &&
        n <= Math.floor((selected.length * domains[i].max) / 100),
    );
  if (selected.length < options.count)
    notices.push(
      `候補は${selected.length}問です。指定${options.count}問から${selected.length}問に調整しました（同一セッション内の重複なし）。`,
    );
  const history = buildQuestionHistory(context.attempts);
  if (
    options.avoidRecent &&
    selected.some((q) => {
      const at = history[q.id]?.lastAnsweredAt;
      return at != null && (context.now ?? Date.now()) - at < 86400000;
    })
  )
    notices.push('候補数と出題比率を考慮し、最近回答した問題も一部含めています。');
  if (method === 'weighted-random')
    notices.push('短時間学習向けの重み付きランダム出題です。1回ごとの固定配分ではありません。');
  if (method === 'integer' && !meetsRanges)
    notices.push(
      '候補の不足によりDomain配分を調整しました。公式レンジを満たす配分ではありません。',
    );
  return {
    questions: selected,
    requestedCount: options.count,
    actualCount: selected.length,
    counts,
    method,
    meetsRanges,
    notices,
  };
}
export function selectMockQuestions(
  bank: Question[],
  count: SelectionOptions['count'],
  context: SelectionContext,
) {
  return selectQuestions(
    bank,
    { ...defaultSelectionOptions, count, mode: 'Syllabus Weighted' },
    context,
  );
}
