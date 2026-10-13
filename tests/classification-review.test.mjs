import {describe,expect,it} from 'vitest';
import fs from 'node:fs';
import {validateQuestionClassification} from '../scripts/audit-question-classification.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const bank=read('content/gh300/2026-08-07/questions/seed.json'),syllabus=read('content/gh300/2026-08-07/syllabus.json');
const report=read('reports/question-objective-classification-review.json');
describe('classification editorial record',()=>{
 it('rejects a valid objective assigned to the wrong domain',()=>{
  const changed=structuredClone(bank);changed[0].domainId='d5';
  expect(validateQuestionClassification(changed,syllabus,report)).toContain('Invalid objective/domain: q01');
 });
 it('rejects stale mapping after the measured content changes and records actual gaps',()=>{
  expect(validateQuestionClassification(bank,syllabus,report)).toEqual([]);
  const changed=structuredClone(bank);changed[0].question='変更された別の技能を測る問題';
  expect(validateQuestionClassification(changed,syllabus,report)).toContain('Stale classification: q01');
  expect(report.coverage.find(r=>r.id==='d2o1').intermediate).toBe(0);
 });
});
