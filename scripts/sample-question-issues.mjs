import fs from "fs";

const seed = JSON.parse(fs.readFileSync("content/gh300/2026-08-07/questions/seed.json", "utf8"));

// 応用問題 (a) と模試問題 (e) を抽出
const applied = seed.filter(q => /q-d\d-a\d+/.test(q.id));
const exam = seed.filter(q => /q-d\d-e\d+/.test(q.id));
const foundation = seed.filter(q => /^q\d+/.test(q.id));
const scenario = seed.filter(q => /^q-sc\d+/.test(q.id));

console.log(`Foundation: ${foundation.length}, Scenario: ${scenario.length}, Applied: ${applied.length}, Exam: ${exam.length}`);

// 日本語として不自然・違和感があるものの基準
// 1. 体言止め・電報調（「〜は？」「〜観測は？」「〜の変更は？」「〜操作は？」など助詞や述語が省略された疑問文）
// 2. 接続詞や文のつながりが不自然（「〜だが、〜。〜。〜は？」）
// 3. 専門用語や不自然な訳語（「観測」「不正実装」「直接必要な根拠は？」）
// 4. 問題の前提状況が省略されすぎていて状況が想像できない

console.log("\n--- Sample Applied Questions (First 15) ---");
applied.slice(0, 15).forEach(q => {
  console.log(`\nID: ${q.id}`);
  console.log(`Q: ${q.question}`);
  q.choices.forEach(c => console.log(`  [${c.id}] ${c.text}`));
  console.log(`Exp: ${q.explanation}`);
});
