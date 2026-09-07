import { describe, expect, it, vi, afterEach } from 'vitest';
import { questions, questionSchema } from '../lib/content';
import { distributionIssues, positionDistribution, questionIssues } from '../lib/question-quality';
import { choiceLabel, answerLabels } from '../lib/choice-labels';
import { score } from '../lib/learning';
import { withTimeout } from '../lib/with-timeout';
import { runTutor } from '../lib/ai';
const exam = questions.find(q => q.difficulty === 'advanced')!;
afterEach(() => vi.useRealTimers());
describe('quality gates', () => {
  it('audits every Applied/Exam question and difficulty position independently', () => {
    expect(questions.flatMap(q => questionIssues(q))).toEqual([]);
    expect(distributionIssues(questions).filter(i => i.severity === 'failure')).toEqual([]);
    for (const d of ['intermediate', 'advanced']) {
      const distribution = positionDistribution(questions.filter(q => q.difficulty === d)).single;
      expect(distribution.percentages.every(p => p >= 20 && p <= 30)).toBe(true);
    }
  });
  it('detects 30% warnings and over-35% failures without rounding the boundary', () => {
    const bank = (aCount: number) => Array.from({ length: 100 }, (_, i) => ({ ...exam, id: `test-${i}`, domainId: `small-${i}`,
      choices: ['A', 'B', 'C', 'D'].map(id => ({ id, text: id })),
      answer: [i < aCount ? 'A' : ['B', 'C', 'D'][(i - aCount) % 3]] }));
    expect(distributionIssues(bank(30))).toEqual([]);
    expect(distributionIssues(bank(35)).some(i => i.severity === 'warning')).toBe(true);
    expect(distributionIssues(bank(35)).some(i => i.severity === 'failure')).toBe(false);
    expect(distributionIssues(bank(36)).some(i => i.severity === 'failure')).toBe(true);
  });
  it('rejects weak distractors, missing explanations and missing requirement mappings', () => {
    const q = structuredClone(exam);
    q.choices.filter(c => !q.answer.includes(c.id)).forEach(c => q.choiceQuality![c.id].plausibility = 1);
    q.choiceExplanations = {};
    q.requirementMapping = [];
    expect(questionIssues(q).map(i => i.rule)).toEqual(expect.arrayContaining(['distractors', 'explanation', 'requirements']));
  });
  it('rejects unresolved alternative answers and option-only clues reported by review', () => {
    expect(questionIssues(exam, { multipleAnswerRisk: true, answerWithoutReading: true,
      difficultyConsistent: true, requirementCoverage: true, rationale: '別解を解消する条件がない' }).map(i => i.rule))
      .toEqual(expect.arrayContaining(['multiple-answer', 'obvious-answer']));
  });
  it('reports length clues instead of treating assigned scores as proof of quality', () => {
    const q = structuredClone(exam);
    q.choices.find(c => q.answer.includes(c.id))!.text = '具体的な長い正解'.repeat(50);
    expect(questionIssues(q).some(i => i.rule === 'length-bias')).toBe(true);
  });
  it('rejects metadata detached from its answer or official references', () => {
    const q = structuredClone(exam);
    q.choiceQuality![q.answer[0]].distractorType = 'wrong-scope';
    expect(questionSchema.safeParse(q).success).toBe(false);
  });
  it('uses display positions for labels and preserves semantic IDs for scoring', () => {
    const q = { ...exam, choices: [...exam.choices].reverse() };
    expect(score(q, exam.answer)).toBe(true);
    expect(choiceLabel(q, q.choices[0].id)).toBe('A');
    expect(answerLabels(q, [q.choices[3].id, q.choices[1].id])).toBe('B, D');
    const multi = { ...q, type: 'multiple-select', answer: [q.choices[0].id, q.choices[3].id] };
    expect(positionDistribution([multi]).multiple.percentages).toEqual([50, 0, 0, 50]);
    expect(positionDistribution([multi]).single.questions).toBe(0);
  });
  it('does not accept a generated Exam question before the second review', async () => {
    const complete = vi.fn().mockResolvedValueOnce(JSON.stringify({ question: { ...exam, status: 'ai-generated', lastVerifiedAt: null } }))
      .mockResolvedValueOnce(JSON.stringify({ multipleAnswerRisk: true, answerWithoutReading: false,
        difficultyConsistent: true, requirementCoverage: true, rationale: '条件を一つ変えなくても不正解の案が要件を満たす可能性が残っている。',
        choiceScores: { A: 3, B: 2, C: 2, D: 2 } }));
    await expect(runTutor({ action: 'generate', objectiveId: exam.objectiveId }, { complete })).rejects.toThrow('品質レビュー');
    expect(complete).toHaveBeenCalledTimes(2);
  });
});
describe('practice storage responsiveness', () => {
  it('times out a pending read, ignores late resolution, and permits a retry', async () => {
    vi.useFakeTimers();
    let resolve!: (value: number) => void;
    const pending = new Promise<number>(r => { resolve = r; });
    const result = withTimeout(pending, 100);
    const rejection = expect(result).rejects.toThrow('もう一度');
    await vi.advanceTimersByTimeAsync(100);
    await rejection;
    resolve(1);
    expect(await withTimeout(Promise.resolve(2))).toBe(2);
    expect(vi.getTimerCount()).toBe(0);
  });
});
