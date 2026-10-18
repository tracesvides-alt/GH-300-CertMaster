import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='content/gh300/2026-08-07/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const report=read('reports/cli-admin-foundation-revision-2026-10-18.json');
const revisions=read(root+'questions/foundation-cli-admin-revisions.json');
const seed=read(root+'questions/seed.json');
const prior=['official-alignment-revisions.json','admin-content-revisions.json'].flatMap(f=>read(root+'questions/'+f).questions);
const rows=[...prior,...revisions.questions];assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
assert.equal(revisions.questions.length,6);
for(const [f,fingerprint] of Object.entries(report.questionFingerprints))assert.equal(hash(read(root+'questions/'+f)),fingerprint,f);
for(const original of seed){
 const before=prior.find(r=>r.id===original.id)?.after??original;
 assert.equal(hash(before),report.beforeQuestionFingerprints[original.id]);
 const row=revisions.questions.find(r=>r.id===original.id);if(!row)continue;
 const record=report.questions.find(r=>r.id===row.id);assert(record);
 assert.deepEqual(record.after,row.after);assert.equal(row.beforeFingerprint,hash(before));assert.equal(row.afterFingerprint,hash(row.after));
 assert.equal(row.displayedExplanation,record.displayedExplanation);assert(row.invalidatePreviousSnapshots&&row.requiresAttemptRevision);
 for(const field of ['id','difficulty','type','domainId','objectiveId','status'])assert.equal(row.after[field],before[field]);
 assert.equal(row.after.type,'single-select');assert.equal(row.after.answer.length,1);
 assert(row.after.choices.every(c=>row.after.choiceExplanations[c.id]===row.after.choiceQuality[c.id].rationale));
}
const excluded=new Set(['selection-exclusions.json','removals.json'].flatMap(f=>read(root+'questions/'+f).questions).map(q=>q.id));
const current=seed.map(q=>rows.find(r=>r.id===q.id)?.after??q).filter(q=>q.status==='verified'&&!excluded.has(q.id));
assert.equal(current.length,253);
for(const [field,key] of [['difficulty','byDifficulty'],['domainId','byDomain']])assert.deepEqual(current.reduce((a,q)=>(a[q[field]]=(a[q[field]]??0)+1,a),{}),report.counts[key]);
const terms=read(root+'glossary/terms.json');
for(const row of report.questions){const term=terms.find(t=>t.id===row.termId);assert.equal(term?.basicQuestionId,row.id);assert(term.questionIds.includes(row.id));}
console.log('PASS: 6 current Foundation editions and explanations; 253 eligible questions, unchanged difficulty/domain counts and historical assets. Editorial review is recorded separately.');
