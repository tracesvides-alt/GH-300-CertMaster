import { describe, expect, it } from 'vitest';
import { questions, allQuestions } from '../lib/content';
import { type Attempt } from '../lib/learning';
import { calculateObjectiveStats, defaultSelectionOptions } from '../lib/selection';
import { improvedObjectives, practiceResult, type PracticeRun } from '../lib/practice-session';
import { withCurrentAttemptClassification, withCurrentQuestionClassification } from '../lib/question-classification';

const question = allQuestions.find(q => q.id === 'q01')!;
const oldAttempt: Attempt = {
  id: 'historical-q01', questionId: question.id, domainId: 'd1', objectiveId: 'd1o1',
  answer: ['A'], correct: false, at: 1000, status: 'verified', sessionId: 'saved-run',
};
describe('current question classification and historical records', () => {
  it('keeps AI output validation in D1 and separates Agent sessions and administrative operations', () => {
    expect(question.objectiveId).toBe('d1o2');
    expect(questions.find(q => q.id === 'q-d2-g12')?.objectiveId).toBe('d2o3');
    expect(questions.find(q => q.id === 'q-d6-a05')?.objectiveId).toBe('d2o4');
    expect(questions.find(q => q.id === 'q-sc03-2-feature-20261016')?.objectiveId).toBe('d2o1');
  });
  it('projects labels without mutating the answer, timestamp, correctness, or stored record', () => {
    const result = withCurrentAttemptClassification(oldAttempt);
    expect(result).toEqual({ ...oldAttempt, domainId: 'd1', objectiveId: 'd1o2' });
    expect(oldAttempt.domainId).toBe('d1');
    expect(result.answer).toBe(oldAttempt.answer);
  });
  it('does not use an archived question mistake for current weakness selection', () => {
    const stats = calculateObjectiveStats([oldAttempt], ['d1o1', 'd1o2']);
    expect(stats.d1o2.incorrectCount).toBe(0);
    expect(stats.d1o1.attempts).toBe(0);
  });
  it('still groups a current question mistake under its corrected objective',()=>{
    const stats=calculateObjectiveStats([{...oldAttempt,questionId:'q-d6-a05',domainId:'d6',objectiveId:'d6o2'}],['d2o4','d6o2']);
    expect(stats.d2o4.incorrectCount).toBe(1);
    expect(stats.d6o2.attempts).toBe(0);
  });
  it('keeps unknown questions and AI-generated records under their own labels', () => {
    const unknown = { ...oldAttempt, questionId: 'external-question' };
    expect(withCurrentAttemptClassification(unknown)).toBe(unknown);
    const ai = { ...oldAttempt, status: 'ai-generated' as const };
    expect(withCurrentAttemptClassification(ai)).toBe(ai);
  });
  it('still projects a clear cross-domain correction from seat administration', () => {
    const stored = { ...oldAttempt, questionId: 'q-d6-a05', domainId: 'd6', objectiveId: 'd6o2' };
    expect(withCurrentAttemptClassification(stored)).toEqual({ ...stored, domainId: 'd2', objectiveId: 'd2o4' });
    expect(stored.domainId).toBe('d6');
  });
  it('preserves an unfinished session question text and answer while updating its labels', () => {
    const saved = { ...question, domainId: 'd1', objectiveId: 'd1o1', question: '保存時の本文' };
    const projected = withCurrentQuestionClassification(saved);
    expect(projected.question).toBe('保存時の本文');
    expect(projected.answer).toBe(saved.answer);
    expect(projected.objectiveId).toBe('d1o2');
    expect(saved.objectiveId).toBe('d1o1');
  });
  it('does not report an improvement by comparing baselines from different classifications', () => {
    const run: PracticeRun = { id: 'old-run', questions: [{ ...question, domainId: 'd1', objectiveId: 'd1o1' }],
      answers: [oldAttempt], options: defaultSelectionOptions, beforeStats: {}, startedAt: 0, completedAt: 1001 };
    expect(improvedObjectives(run, [oldAttempt])).toEqual([]);
    // Completed historical results retain the classification used during that run.
    expect(practiceResult(run).byDomain.map(d => d.id)).toEqual(['d1']);
  });
});
