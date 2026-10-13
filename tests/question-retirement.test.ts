import {describe,expect,it} from 'vitest';
import {allQuestions,questions,buildKnowledgeBase} from '../lib/content';
import {isQuestionActive} from '../lib/question-availability';
import {selectQuestions,selectMockQuestions,defaultSelectionOptions} from '../lib/selection';
import {withCurrentAttemptClassification,withCurrentQuestionClassification} from '../lib/question-classification';
import exclusions from '../content/gh300/2026-08-07/questions/selection-exclusions.json';
import report from '../reports/d4-d5-applied-cleanup-review.json';
import rawQuestions from '../content/gh300/2026-08-07/questions/seed.json';
import additions from '../content/gh300/2026-08-07/questions/additions-review.json';
import removals from '../content/gh300/2026-08-07/questions/removals.json';
import {createHash} from 'node:crypto';

const retired = allQuestions.filter(q=>!isQuestionActive(q));
const hash=(q:unknown)=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
const rngFor=(seed:number)=>()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};

describe('retired questions and historical compatibility',()=>{
  it('preserves archived assets and references while removing them from the new practice pool',()=>{
    const removedExisting=removals.questions.length-(additions.removedAdditions?.length??0);
    expect(allQuestions).toHaveLength(additions.baseline.stored + additions.questions.length-removedExisting);
    expect(questions).toHaveLength(additions.baseline.active + additions.questions.length-removedExisting);
    expect(retired).toHaveLength(12);
    expect(questions.filter(q=>q.difficulty==='intermediate')).toHaveLength(additions.baseline.applied + additions.questions.length-removedExisting);
    const knownIds=buildKnowledgeBase().questionIds;
    for(const row of exclusions.questions){
      expect(retired.some(q=>q.id===row.id)).toBe(true);
      expect(knownIds).toContain(row.id);
      expect(row.replacementIds.every(id=>questions.some(q=>q.id===id&&q.difficulty==='intermediate'))).toBe(true);
      expect(hash(rawQuestions.find(q=>q.id===row.id))).toBe(row.fingerprint);
    }
  });
  it('does not reintroduce retired items through bookmark, wrong-answer, or due-review selection',()=>{
    const q=retired[0],now=Date.now();
    const attempt={id:'archive-attempt',questionId:q.id,domainId:q.domainId,objectiveId:q.objectiveId,
      answer:q.answer,correct:false,at:now,status:'verified' as const};
    const context={attempts:[attempt],bookmarkIds:[q.id],now,rng:rngFor(1),reviewStates:{[q.id]:{nextReviewAt:0}}};
    expect(selectQuestions(allQuestions,{...defaultSelectionOptions,scope:'bookmarked'},context).actualCount).toBe(0);
    expect(selectQuestions(allQuestions,{...defaultSelectionOptions,scope:'incorrect'},context).actualCount).toBe(0);
    for(const mode of ['Random','Syllabus Weighted','Weak Points','Due for Review'] as const){
      const result=selectQuestions(allQuestions,{...defaultSelectionOptions,mode,count:50},context);
      expect(result.questions.every(isQuestionActive)).toBe(true);
      expect(result.actualCount).toBe(50);
    }
  });
  it('keeps saved archived questions and attempts usable with current labels and original answer identity',()=>{
    const q=retired[0],saved={...q,question:'保存時の問題文',domainId:'d3',objectiveId:'d3o1'};
    const resumed=withCurrentQuestionClassification(saved);
    expect(resumed.question).toBe('保存時の問題文');
    expect(resumed.answer).toEqual(q.answer);
    expect(resumed.objectiveId).toBe(q.objectiveId);
    expect(saved.objectiveId).toBe('d3o1');
    const attempt={questionId:q.id,domainId:'d3',objectiveId:'d3o1',status:'verified',answer:q.answer};
    expect(withCurrentAttemptClassification(attempt).objectiveId).toBe(q.objectiveId);
    expect(attempt.objectiveId).toBe('d3o1');
  });
  it('keeps 50-question mock allocation valid over 100 seeds even if supplied the whole archive',()=>{
    for(let seed=1;seed<=100;seed++){
      const result=selectMockQuestions(allQuestions,50,{attempts:[],rng:rngFor(seed)});
      expect(result.actualCount).toBe(50);
      expect(result.meetsRanges).toBe(true);
      expect(new Set(result.questions.map(q=>q.id)).size).toBe(50);
      expect(result.questions.every(q=>isQuestionActive(q)&&q.status==='verified')).toBe(true);
    }
  });
  it('binds the remaining editorial records to current assets and keeps at least two concrete alternatives for every rewrite',()=>{
    expect(report.questions).toHaveLength(45);
    expect(report.questions.filter(r=>r.decision==='REWRITTEN')).toHaveLength(21);
    expect(report.questions.filter(r=>r.decision==='RETIRED')).toHaveLength(12);
    for(const row of report.questions){
      expect(row.fingerprint).toBe(hash(rawQuestions.find(q=>q.id===row.id)));
      expect(row.after.answer).toEqual(row.before.answer);
      if(row.decision==='REWRITTEN'){
        expect(row.counterfactuals.length).toBeGreaterThanOrEqual(2);
        expect(new Set(row.counterfactuals.map(c=>'choiceId' in c ? c.choiceId : '')).size).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
