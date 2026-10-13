import fs from 'fs';

const seed = JSON.parse(fs.readFileSync('content/gh300/2026-08-07/questions/seed.json', 'utf8'));

['d3', 'd4', 'd5', 'd6'].forEach(d => {
  const qs = seed.filter(q => q.id.startsWith(`q-${d}-a`));
  console.log(`\n=== Domain ${d.toUpperCase()} Applied: ${qs.length} questions ===`);
  qs.forEach(q => {
    console.log(`[${q.id}] (${q.difficulty}) ans: ${q.answer.join(',')} | ${q.question.slice(0, 50)}...`);
  });
});
