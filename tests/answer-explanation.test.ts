import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { allQuestions, questions } from '../lib/content';
import { answerExplanation } from '../lib/answer-explanation';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import details from '../content/gh300/2026-08-07/questions/answer-explanations.json';
import report from '../reports/answer-explanation-review-2026-10-17.json';
import revisions from '../content/gh300/2026-08-07/questions/official-alignment-revisions.json';
import adminRevisions from '../content/gh300/2026-08-07/questions/admin-content-revisions.json';
import foundationRevisions from '../content/gh300/2026-08-07/questions/foundation-cli-admin-revisions.json';

describe('versioned answer explanations', () => {
  it('covers every eligible question and preserves the question bank and short analyses', () => {
    const eligible=questions.filter(q=>q.status==='verified');
    expect(new Set(details.questions.map(q=>q.id))).toEqual(new Set(eligible.map(q=>q.id)));
    expect(createHash('sha256').update(JSON.stringify(seed)).digest('hex')).toBe(report.baselineSeedFingerprint);
    for (const q of eligible) {
      const row=report.questions.find(row=>row.id===q.id)!;
      const revision=[...revisions.questions,...adminRevisions.questions,...foundationRevisions.questions].find(row=>row.id===q.id);
      if(revision){
        expect(answerExplanation(q)).toBe(revision.displayedExplanation);
        expect(q.question).toBe(revision.after.question);
        expect(q.answer).toEqual(revision.after.answer);
        expect(q.choiceExplanations).toEqual(revision.after.choiceExplanations);
        continue;
      }
      expect(answerExplanation(q)).toBe(row.after);
      expect(row.before).toBe(q.explanation);
      expect(row.choices).toEqual(q.choices);
      expect(row.answer).toEqual(q.answer);
      expect(row.choiceExplanations).toEqual(q.choiceExplanations);
    }
  });

  it('does not attach a current explanation to an old or changed saved question', () => {
    const q=questions.find(q=>q.id==='q-d2-e02-feature-20261016')!;
    for (const changed of [
      {...q,question:q.question+'別の条件'},
      {...q,choices:[...q.choices].reverse()},
      {...q,answer:[q.choices.find(c=>!q.answer.includes(c.id))!.id]},
      {...q,status:'needs-review'},
      {...q,sourceIds:['guide']},
    ]) expect(answerExplanation(changed)).toBe(q.explanation);
    expect(answerExplanation({...q,explanation:'以前の短い解説'})).toBe(answerExplanation(q));
  });

  it('preserves archived and unreviewed historical explanations', () => {
    const current=new Set(questions.filter(q=>q.status==='verified').map(q=>q.id));
    for (const q of allQuestions.filter(q=>!current.has(q.id))) expect(answerExplanation(q)).toBe(q.explanation);
  });

  it('preserves the historical warning while serving the corrected review-effort question', () => {
    const issue=report.issues[0];
    expect(issue.id).toBe('q-d5-e08-feature-20261016-ms-20261017');
    expect(issue.status).toBe('QUESTION_REVISION_REQUIRED');
    expect(answerExplanation(seed.find(q=>q.id===issue.id)!)).toContain('要レビュー');
    const current=questions.find(q=>q.id===issue.id)!;
    expect(current.answer).toEqual(['C','D']);
    expect(answerExplanation(current)).not.toContain('要レビュー');
    expect(answerExplanation(current)).toContain('Pには今回の明示指定がなく');
  });
});
