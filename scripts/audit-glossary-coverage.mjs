// Audits "1 glossary term = 1 Foundation question": every term should have a basicQuestionId that points to a
// verified-or-reviewable beginner question listed in the term's questionIds, and no question serves two terms.
//   node scripts/audit-glossary-coverage.mjs           integrity must hold; writes the coverage report
//   node scripts/audit-glossary-coverage.mjs --strict  additionally fails while any term lacks a question
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, root), 'utf8'));
const dir = 'content/gh300/2026-08-07/';
const terms = read(dir + 'glossary/terms.json');
const bank = read(dir + 'questions/seed.json');
const byId = new Map(bank.map((q) => [q.id, q]));
const strict = process.argv.includes('--strict');

const problems = [];
const owner = new Map();
const rows = terms.map((t) => {
  const id = t.basicQuestionId;
  if (!id) return { term: t, state: 'missing' };
  const q = byId.get(id);
  if (!q) problems.push(`${t.id}: basicQuestionId "${id}" does not exist`);
  else if (q.difficulty !== 'beginner') problems.push(`${t.id}: "${id}" is not a Foundation question`);
  else if (q.type !== 'single-select') problems.push(`${t.id}: "${id}" is not single-select`);
  if (!t.questionIds.includes(id)) problems.push(`${t.id}: "${id}" is missing from questionIds`);
  if (owner.has(id)) problems.push(`${id} is the basic question of both ${owner.get(id)} and ${t.id}`);
  owner.set(id, t.id);
  return { term: t, state: q?.status === 'verified' ? 'covered' : 'needs-review', question: q };
});
const count = (state) => rows.filter((r) => r.state === state).length;
const summary = { terms: terms.length, covered: count('covered'), needsReview: count('needs-review'), missing: count('missing') };

const lines = ['# 用語集 × 基礎問題 カバレッジ', '',
  `用語 ${summary.terms} 件 / 基礎問題あり ${summary.covered + summary.needsReview} 件（うちneeds-review ${summary.needsReview}）/ 未対応 ${summary.missing} 件`, ''];
const domainOf = (t) => t.domainIds[0];
for (const state of ['missing', 'needs-review']) {
  const list = rows.filter((r) => r.state === state);
  if (!list.length) continue;
  lines.push(state === 'missing' ? '## 基礎問題がない用語' : '## 基礎問題がneeds-reviewの用語', '', '| Domain | 用語ID | 用語 | 基礎問題 |', '| --- | --- | --- | --- |');
  for (const r of list.sort((a, b) => domainOf(a.term).localeCompare(domainOf(b.term))))
    lines.push(`| ${domainOf(r.term)} | ${r.term.id} | ${r.term.term.replaceAll('|', '／')} | ${r.question?.id ?? '—'} |`);
  lines.push('');
}
fs.writeFileSync(new URL('reports/glossary-basic-coverage.md', root), lines.join('\n').trimEnd() + '\n');
console.log(JSON.stringify(summary));
for (const p of problems) console.error(`FAIL ${p}`);
if (problems.length || (strict && summary.missing)) process.exit(1);
