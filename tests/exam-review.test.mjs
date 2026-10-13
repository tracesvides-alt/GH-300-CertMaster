import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { validateExamReview } from '../scripts/audit-exam-question-review.mjs';

const root = new URL('../',import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name,root),'utf8'));
const bank = read('content/gh300/2026-08-07/questions/seed.json');
const report = read('reports/exam-question-quality-review.json');

describe('six-point Exam review freshness', () => {
  it('keeps a current fingerprint for a question moved out of Exam', () => {
    const edited = structuredClone(bank);
    const archived = report.reclassifiedQuestions[0];
    edited.find(q => q.id === archived.id).choices[0].text += '未レビューの変更';
    expect(validateExamReview(edited, report)).toContain(`Stale reclassified Exam review: ${archived.id}`);
  });

  it('does not silently lose the history when an Exam question is reclassified', () => {
    const missing = structuredClone(report);
    const archived = missing.reclassifiedQuestions.shift();
    expect(validateExamReview(bank, missing)).toContain(`Lost historical Exam review: ${archived.id}`);
  });
  it('covers the actual advanced inventory and rejects edited options', () => {
    expect(validateExamReview(bank,report)).toEqual([]);
    const edited = structuredClone(bank);
    edited.find(q=>q.difficulty==='advanced').choices[0].text += '未レビューの改稿';
    expect(validateExamReview(edited,report).some(e=>e.includes('Stale Exam review'))).toBe(true);
  });

  it('rejects additions which have not had the editorial six-point review', () => {
    const extra = structuredClone(bank.find(q=>q.difficulty==='advanced'));
    extra.id='unreviewed-exam';
    expect(validateExamReview([...bank,extra],report)).toContain('Unreviewed Exam question: unreviewed-exam');
  });

  it('requires the same four choices to yield a different counterfactual answer', () => {
    const sameAnswer = structuredClone(report);
    sameAnswer.questions[0].counterfactual.answerId = sameAnswer.questions[0].after.answer[0];
    expect(validateExamReview(bank,sameAnswer).some(e=>e.includes('Invalid counterfactual replay'))).toBe(true);
    const inventedCondition = structuredClone(report);
    inventedCondition.questions[0].counterfactual.from = '本文にない条件';
    expect(validateExamReview(bank,inventedCondition).some(e=>e.includes('Invalid counterfactual replay'))).toBe(true);
  });

  it('rejects stale clues and an incorrect displayed answer position', () => {
    const staleClue=structuredClone(report);
    staleClue.questions[0].clues[0]='本文にないClue';
    expect(validateExamReview(bank,staleClue).some(e=>e.includes('Non-literal'))).toBe(true);
    const stalePosition=structuredClone(report);
    const row=stalePosition.questions[0];
    row.lengths.position=row.lengths.position==='A'?'B':'A';
    expect(validateExamReview(bank,stalePosition).some(e=>e.includes('Stale length/position'))).toBe(true);
  });

  it('keeps reviewed content on sync and never grants a draft automatic PASS', () => {
    const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'gh300-exam-review-'));
    const write=(name,value)=>{
      const target=path.join(fixture,name);
      fs.mkdirSync(path.dirname(target),{recursive:true});
      fs.writeFileSync(target,JSON.stringify(value,null,2)+'\n');
    };
    try {
      const files=['content/gh300/2026-08-07/questions/seed.json',
        'content/gh300/2026-08-07/questions/difficulty-review.json',
        'content/gh300/2026-08-07/questions/quality-review.json',
        'content/gh300/2026-08-07/sources.json','content/gh300/2026-08-07/syllabus.json',
        'reports/question-difficulty-baseline.json','reports/question-choice-content-baseline.json'];
      for(const file of files)write(file,read(file));
      const script=path.join(fixture,'scripts/sync-exam-questions.mjs');
      fs.mkdirSync(path.dirname(script),{recursive:true});
      fs.copyFileSync(new URL('scripts/sync-exam-questions.mjs',root),script);
      const drafts=read('scripts/exam-question-drafts/d2.json');
      drafts.questions[0].question='古い未レビューのドラフト';
      write('scripts/exam-question-drafts/d2.json',drafts);
      const run=()=>execFileSync(process.execPath,['scripts/sync-exam-questions.mjs'],{cwd:fixture,stdio:'pipe'});
      run();
      expect(JSON.parse(fs.readFileSync(path.join(fixture,files[0]),'utf8'))).toEqual(bank);
      expect(JSON.parse(fs.readFileSync(path.join(fixture,files[2]),'utf8')).questions).toEqual(read(files[2]).questions);
      const extra=structuredClone(read('scripts/exam-question-drafts/d2.json').questions[0]);
      extra.id='new-exam-without-review';extra.preferredPosition=4;
      write('scripts/exam-question-drafts/d2.json',{questions:[extra]});
      expect(run).toThrow(/invalid preferredPosition/);
      extra.preferredPosition=0;
      write('scripts/exam-question-drafts/d2.json',{questions:[extra]});
      run();
      const imported=JSON.parse(fs.readFileSync(path.join(fixture,files[0]),'utf8')).find(q=>q.id===extra.id);
      expect(imported.status).toBe('needs-review');
      expect(imported.lastVerifiedAt).toBeUndefined();
      expect(JSON.parse(fs.readFileSync(path.join(fixture,files[2]),'utf8')).questions[extra.id]).toBeUndefined();
      expect(JSON.parse(fs.readFileSync(path.join(fixture,files[1]),'utf8')).questions[extra.id].reviewRequired).toBe(true);
    } finally {
      if(!path.resolve(fixture).startsWith(path.resolve(os.tmpdir())+path.sep)||!path.basename(fixture).startsWith('gh300-exam-review-'))throw Error('Invalid cleanup target');
      fs.rmSync(fixture,{recursive:true,force:true});
    }
  });
});
