import {it,expect} from 'vitest';
import {allQuestions} from '../lib/content';
import {score} from '../lib/learning';
import raw from '../content/gh300/2026-08-07/questions/seed.json';
import report from '../reports/applied-23-focus-improvement-review.json';
import plan from '../reports/applied-23-focus-improvement-plan.json';
import {focusDecisions} from './fixtures/applied-focus-decisions';
import {validateAppliedFocus} from '../scripts/check-applied-focus.mjs';
it.each(focusDecisions)('%s scores the scenario-supported Copilot action',(id,action)=>{
 const q=allQuestions.find(q=>q.id===id)!;
 const candidates=q.choices.filter(c=>action.test(c.text));
 expect(candidates).toHaveLength(1);
 expect(score(q,[candidates[0].id])).toBe(true);
 for(const c of q.choices.filter(c=>c.id!==candidates[0].id))expect(score(q,[c.id])).toBe(false);
 expect(q.choiceExplanations[candidates[0].id]).toBe(q.explanation);
});
it('binds all 23 editorial decisions to reviewed content and preserved classification',()=>{
 expect(validateAppliedFocus(raw,report,plan)).toEqual([]);
});
