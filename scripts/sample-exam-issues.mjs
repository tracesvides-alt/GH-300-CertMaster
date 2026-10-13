import fs from "fs";

const seed = JSON.parse(fs.readFileSync("content/gh300/2026-08-07/questions/seed.json", "utf8"));
const exam = seed.filter(q => /q-d\d-e\d+/.test(q.id));

console.log("Exam questions count:", exam.length);
console.log("\n--- Sample Exam Questions (First 15) ---");
exam.slice(0, 15).forEach(q => {
  console.log(`\nID: ${q.id}`);
  console.log(`Q: ${q.question}`);
  q.choices.forEach(c => console.log(`  [${c.id}] ${c.text}`));
  console.log(`Exp: ${q.explanation}`);
});
