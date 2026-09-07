/** Shared pure audit: Node CLI, CI and AI acceptance use the same rules. */
export type AuditableQuestion = {
  id: string; domainId: string; difficulty: string; type: string;
  question: string; choices: { id: string; text: string }[]; answer: string[];
  choiceExplanations: Record<string, string>; sourceIds: string[];
  cognitiveLevel?: string;
  choiceQuality?: Record<string, { plausibility: number; distractorType: string; sourceIds: string[]; rationale: string }>;
  requirementMapping?: { requirement: string; correctReason: string; distractorFailures: Record<string, string> }[];
};
export type QualityReview = {
  multipleAnswerRisk: boolean;
  answerWithoutReading: boolean;
  difficultyConsistent: boolean;
  requirementCoverage: boolean;
  rationale: string;
};
export type QualityIssue = { id: string; severity: 'warning' | 'failure'; rule: string; detail: string };
export function questionIssues(q: AuditableQuestion, review?: QualityReview): QualityIssue[] {
  if (q.difficulty === 'beginner') return [];
  const issues: QualityIssue[] = [];
  const fail = (rule: string, detail: string) => issues.push({ id: q.id, severity: 'failure', rule, detail });
  const wrong = q.choices.filter(c => !q.answer.includes(c.id));
  if (q.choices.some(c => !q.choiceExplanations[c.id]?.trim())) fail('explanation', '全選択肢の説明が必要です。');
  if (q.choices.some(c => {
    const v = q.choiceQuality?.[c.id];
    return !v || !v.rationale?.trim() || !v.sourceIds?.length || v.sourceIds.some(s => !q.sourceIds.includes(s));
  })) fail('grounding', '選択肢ごとの根拠と有効な出典が必要です。');
  const strong = wrong.filter(c => {
    const v = q.choiceQuality?.[c.id];
    return v && v.plausibility >= 2 && ['partial-match', 'wrong-scope', 'wrong-mechanism', 'common-confusion', 'wrong-use-case'].includes(v.distractorType);
  }).length;
  if (strong < (q.difficulty === 'advanced' ? 2 : 1)) fail('distractors', '条件を見落とすと選ぶ不正解が不足しています。');
  if (q.difficulty === 'advanced' && (!q.requirementMapping?.length || q.requirementMapping.some(m =>
    !m.requirement?.trim() || !m.correctReason?.trim() || wrong.some(c => !m.distractorFailures[c.id]?.trim()))))
    fail('requirements', '要件・正解理由・各不正解の失敗理由の対応が必要です。');
  if (!['apply', 'analyze'].includes(q.cognitiveLevel ?? '')) fail('difficulty', 'Applied/Examには適用・分析が必要です。');
  const lengths = wrong.map(c => c.text.length).sort((a, b) => a - b);
  const median = lengths[Math.floor(lengths.length / 2)] ?? 1;
  if (q.choices.some(c => q.answer.includes(c.id) && c.text.length > Math.max(30, median * 1.5)))
    issues.push({ id: q.id, severity: 'warning', rule: 'length-bias', detail: '正解が不正解の中央値より1.5倍超長い。' });
  if (review) {
    if (review.multipleAnswerRisk) fail('multiple-answer', '複数正解の可能性が未解消です。');
    if (review.answerWithoutReading) fail('obvious-answer', '本文を読まず解けるとレビューされています。');
    if (!review.difficultyConsistent) fail('difficulty-review', '難易度の再検討が必要です。');
    if (!review.requirementCoverage) fail('coverage-review', '要件の対応が不十分です。');
    if (!review.rationale.trim()) fail('review-rationale', 'レビュー理由が必要です。');
  }
  return issues;
}
export function positionDistribution(bank: AuditableQuestion[]) {
  // Multiple-select is reported separately: count occurrences / all correct occurrences.
  const single = bank.filter(q => q.type === 'single-select');
  const multiple = bank.filter(q => q.type === 'multiple-select');
  const count = (qs: AuditableQuestion[]) => {
    const counts = [0, 0, 0, 0];
    for (const q of qs) q.choices.forEach((c, i) => { if (q.answer.includes(c.id)) counts[i]++; });
    const total = counts.reduce((a, b) => a + b, 0);
    return { questions: qs.length, counts, percentages: counts.map(n => total ? n / total * 100 : 0) };
  };
  return { single: count(single), multiple: count(multiple) };
}
export function distributionIssues(bank: AuditableQuestion[]): QualityIssue[] {
  const issues: QualityIssue[] = [];
  for (const difficulty of ['beginner', 'intermediate', 'advanced']) {
    const qs = bank.filter(q => q.difficulty === difficulty);
    const groups = [['all', qs], ...[...new Set(qs.map(q => q.domainId))].map(d => [d, qs.filter(q => q.domainId === d)])] as [string, AuditableQuestion[]][];
    for (const [domain, group] of groups) {
      const distribution = positionDistribution(group).single;
      if (!distribution.questions || (domain !== 'all' && distribution.questions < 8)) continue;
      distribution.percentages.forEach((p, i) => {
        if (p > 30) issues.push({ id: `${difficulty}/${domain}`, severity: p > 35 && difficulty !== 'beginner' ? 'failure' : 'warning',
          rule: 'answer-distribution', detail: `${'ABCD'[i]}: ${p.toFixed(1)}% (${distribution.counts[i]}/${distribution.questions})` });
      });
    }
  }
  return issues;
}
