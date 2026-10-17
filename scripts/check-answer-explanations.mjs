import fs from 'node:fs';
import { createHash } from 'node:crypto';
const read = path => JSON.parse(fs.readFileSync(path,'utf8'));
const dir = 'content/gh300/2026-08-07/questions/';
const bank = read(dir + 'seed.json'), details = read(dir + 'answer-explanations.json');
const report = read('reports/answer-explanation-review-2026-10-17.json');
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const excluded = new Set([...read(dir+'selection-exclusions.json').questions,...read(dir+'removals.json').questions].map(q=>q.id));
const eligible = bank.filter(q=>q.status==='verified'&&!excluded.has(q.id));
if (hash(bank)!==report.baselineSeedFingerprint) throw Error('Question assets changed outside explanation-only scope');
if (new Set(details.questions.map(q=>q.id)).size!==253 || eligible.length!==253 || report.questions.length!==253) throw Error('Incomplete explanation scope');
for (const q of eligible) {
  const row=details.questions.find(row=>row.id===q.id),review=report.questions.find(row=>row.id===q.id);
  if (!row || !review || review.baselineFingerprint!==hash(q) || row.text!==review.after || review.before!==q.explanation) throw Error('Stale explanation: '+q.id);
  const contract=JSON.stringify({question:q.question,choices:q.choices,answer:q.answer,difficulty:q.difficulty,sourceIds:q.sourceIds,status:q.status});
  if (row.contract!==contract || !row.text.trim() || row.text===q.explanation) throw Error('Unbound explanation: '+q.id);
  if (JSON.stringify(review.choices)!==JSON.stringify(q.choices) || JSON.stringify(review.answer)!==JSON.stringify(q.answer) || JSON.stringify(review.choiceExplanations)!==JSON.stringify(q.choiceExplanations)) throw Error('Changed answer or short analysis: '+q.id);
}
console.log('PASS: 253 bound explanations, unchanged question bank, answers, choices and short analyses; 1 documented question-level inconsistency. Editorial quality is not measured by this check.');
