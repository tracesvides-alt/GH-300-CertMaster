import fs from 'fs';

const seed = JSON.parse(fs.readFileSync('content/gh300/2026-08-07/questions/seed.json', 'utf8'));
const d4Applied = seed.filter(q => q.id.startsWith('q-d4-a'));

d4Applied.forEach((q, idx) => {
  console.log(`\n========================================`);
  console.log(`[#${idx + 1}] ID: ${q.id} | Diff: ${q.difficulty} | Answer: ${q.answer.join(',')}`);
  console.log(`Q: ${q.question}`);
  console.log(`Choices:`);
  q.choices.forEach(c => {
    const isCorrect = q.answer.includes(c.id);
    console.log(`  ${isCorrect ? '(*) ' : '    '}[${c.id}] ${c.text}`);
  });
  console.log(`Exp: ${q.explanation}`);
});
