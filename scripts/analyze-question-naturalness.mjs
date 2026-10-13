import fs from "fs";

const seed = JSON.parse(fs.readFileSync("content/gh300/2026-08-07/questions/seed.json", "utf8"));
console.log("Total questions:", seed.length);

// ID patterns
const idPrefixes = {};
seed.forEach(q => {
  const prefix = q.id.split("-").slice(0, 2).join("-");
  idPrefixes[prefix] = (idPrefixes[prefix] || 0) + 1;
});
console.log("ID prefixes:", idPrefixes);

// Check question characteristics
const patterns = [
  { name: "Ends with 'は？' / 'か？' without natural context", filter: q => /[^。？！]{2,15}[はか]？$/.test(q.question) },
  { name: "Very short question (< 60 chars)", filter: q => q.question.length < 60 },
  { name: "Contains '観測' or '削っても'", filter: q => q.question.includes("観測") || q.question.includes("削っても") },
  { name: "Very short explanation (< 30 chars)", filter: q => q.explanation.length < 30 },
  { name: "Unnatural choices (any choice < 15 chars and end with か)", filter: q => q.choices.some(c => c.text.endsWith("か") && c.text.length < 18) },
  { name: "Applied / exam drafts style (e.g. q-d*-a*)", filter: q => /^q-d\d-a\d+/.test(q.id) }
];

patterns.forEach(p => {
  const matched = seed.filter(p.filter);
  console.log(`\n=== Pattern: ${p.name} (Count: ${matched.length}) ===`);
  matched.slice(0, 5).forEach(q => console.log(`  [${q.id}] (${q.question.length} chars) ${q.question}`));
});
