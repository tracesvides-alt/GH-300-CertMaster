import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import seed from '../content/gh300/2026-08-07/questions/seed.json';
import revisions from '../content/gh300/2026-08-07/questions/official-alignment-revisions.json';
import adminRevisions from '../content/gh300/2026-08-07/questions/admin-content-revisions.json';
import foundationRevisions from '../content/gh300/2026-08-07/questions/foundation-cli-admin-revisions.json';
import report from '../reports/official-alignment-remediation-2026-10-18.json';
import audit from '../reports/official-alignment-audit-2026-10-18.json';
import {allQuestions,questions,questionSchema,questionForHistoricalAttempt} from '../lib/content';
import {applyQuestionRevision,questionRevisionContract,revisedAnswerExplanation} from '../lib/question-revision';
import {answerExplanation} from '../lib/answer-explanation';
import {isQuestionActive,withoutDeletedSessionQuestions} from '../lib/question-availability';
import {selectQuestions,defaultSelectionOptions} from '../lib/selection';
import {questionIssues} from '../lib/question-quality';
import {score} from '../lib/learning';

const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const correctedId='q-d5-e08-feature-20261016-ms-20261017';
const tally=(rows:typeof questions,key:'difficulty'|'domainId'|'objectiveId'|'type')=>rows.reduce((a,q)=>(a[q[key]]=(a[q[key]]??0)+1,a),{} as Record<string,number>);

describe('official specification corrections and history boundary',()=>{
  it('publishes exactly ten reviewed editions and preserves every other current and archived item',()=>{
    expect(hash(seed)).toBe(audit.fingerprints.seed);
    expect(revisions.questions).toHaveLength(10);
    expect(new Set(revisions.questions.map(q=>q.id)).size).toBe(10);
    expect(revisions.quarantinedQuestionIds).toEqual([]);
    for(const original of seed){
      const row=[...revisions.questions,...adminRevisions.questions,...foundationRevisions.questions].find(row=>row.id===original.id);
      const current=allQuestions.find(q=>q.id===original.id)!;
      if(!row){expect(current).toEqual(questionSchema.parse(original));continue;}
      expect(row.beforeContract).toBe(questionRevisionContract(original));
      expect(row.beforeFingerprint).toBe(hash(original));
      expect(row.afterFingerprint).toBe(hash(row.after));
      expect(row.afterContract).toBe(questionRevisionContract(current));
      expect(current).toEqual(questionSchema.parse(row.after));
      expect(answerExplanation(current)).toBe(row.displayedExplanation);
      expect(questionIssues(current)).toEqual([]);
    }
    const baseline=audit.questions.filter(q=>q.eligibleForNewExercise).map(q=>questionSchema.parse({...seed.find(s=>s.id===q.id)!}));
    const eligible=questions.filter(q=>q.status==='verified');
    expect(eligible).toHaveLength(253);
    for(const key of ['difficulty','domainId','objectiveId','type'] as const)expect(tally(eligible,key)).toEqual(tally(baseline,key));
    expect(questions.find(q=>q.id==='q11')?.status).toBe('needs-review');
  });

  it('grades all six answer pairs using the corrected C/D key',()=>{
    const q=questions.find(q=>q.id===correctedId)!;
    expect(q.answer).toEqual(['C','D']);expect(q.correctChoiceIds).toEqual(['C','D']);
    expect(q.question).not.toContain('Deep');
    for(const pair of [['A','B'],['A','C'],['A','D'],['B','C'],['B','D'],['C','D']])expect(score(q,pair)).toBe(pair.join(',')==='C,D');
    expect(score(q,['D','C'])).toBe(true);
    expect(score(q,['C'])).toBe(false);
    expect(answerExplanation(q)).not.toContain('要レビュー');
    expect(isQuestionActive(q)).toBe(true);
    expect(isQuestionActive({id:q.id})).toBe(true);
  });

  it('excludes unsafe old editions from new selections and unfinished mocks without regrading completed history',()=>{
    const old=questionSchema.parse(seed.find(q=>q.id===correctedId)!);
    const current=questions.find(q=>q.id===correctedId)!;
    const other=questions.find(q=>q.id==='q02')!;
    expect(isQuestionActive(old)).toBe(false);
    expect(selectQuestions([old],defaultSelectionOptions,{attempts:[]}).actualCount).toBe(0);
    expect(selectQuestions([current],defaultSelectionOptions,{attempts:[]}).questions).toEqual([current]);
    const saved={questions:[old,other,current],answers:{[old.id]:['A','B'],[other.id]:other.answer},index:1,completed:false};
    const adjusted=withoutDeletedSessionQuestions(saved);
    expect(adjusted.questions).toEqual([other,current]);expect(adjusted.index).toBe(0);
    // A stale answer for the same ID must not be inherited by a later edition.
    expect(adjusted.answers).not.toHaveProperty(old.id);
    expect(saved.questions).toHaveLength(3);
    const done={...saved,completed:true};expect(withoutDeletedSessionQuestions(done)).toBe(done);
    expect(score(done.questions[0],['A','B'])).toBe(true);
    expect(answerExplanation(old)).toContain('要レビュー');
  });

  it('requires exact new wording and short analyses before attaching a revised explanation',()=>{
    for(const row of revisions.questions){
      const current=questions.find(q=>q.id===row.id)!;
      for(const changed of [
        {...current,answer:[current.choices.find(c=>!current.answer.includes(c.id))!.id]},
        {...current,question:current.question+'別の条件'},
        {...current,choiceExplanations:{...current.choiceExplanations,A:'旧版の解説'}},
      ])expect(revisedAnswerExplanation(changed)).toBeUndefined();
      const before=seed.find(q=>q.id===row.id)!;
      expect(revisedAnswerExplanation(before)).toBeUndefined();
      expect(applyQuestionRevision({...before,question:'未レビューの異なる問題'}).question).toBe('未レビューの異なる問題');
    }
  });

  it('opens old incorrect answers with their historical question and new answers with the revised question',()=>{
    const current=questions.find(q=>q.id===correctedId)!;
    const historical=questionForHistoricalAttempt(current,{correctChoiceIds:['A','B']});
    expect(historical.question).toContain('Deep');
    expect(historical.answer).toEqual(['A','B']);
    expect(answerExplanation(historical)).toContain('要レビュー');
    expect(score(historical,['C','D'])).toBe(false);
    expect(questionForHistoricalAttempt(current,{correctChoiceIds:['D','C']})).toBe(current);
    expect(questionForHistoricalAttempt(current,{}).question).toBe(historical.question);
  });

  it('records direct official evidence, concise analyses and the two dated notes',()=>{
    for(const row of report.questions){
      expect(row.officialEvidence.length).toBeGreaterThan(0);
      expect(row.review.blindCheck).toBeTruthy();expect(row.review.difficulty).toBeTruthy();
      expect(Object.keys(row.after.choiceExplanations)).toHaveLength(4);
    }
    const effort=report.questions.find(q=>q.id===correctedId)!;
    expect(effort.review.reasoningSteps).toHaveLength(3);
    expect(effort.review.counterfactuals).toHaveLength(2);
    expect(Math.max(...effort.review.choiceLengths.map(c=>c.medianRatio))).toBeLessThan(1.2);
    expect(questions.find(q=>q.id==='q-d3-g14')!.choiceExplanations.A).toContain('一致の最低文字数ではない');
    expect(answerExplanation(questions.find(q=>q.id==='q-d1-e08-feature-20261016')!)).toContain('2026年9月1日');
    expect(answerExplanation(questions.find(q=>q.id==='q-d6-e02-feature-20261016')!)).toContain('2026年10月8日');
  });
});
