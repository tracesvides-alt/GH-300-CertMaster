import fs from "fs";

const seed = JSON.parse(fs.readFileSync("content/gh300/2026-08-07/questions/seed.json", "utf8"));

// 不自然・電報調の特徴をリストアップ
const telegraphicPatterns = [
  {
    name: "体言止め・疑問文省略（〜は？、〜か？、〜観測は？、〜重点は？）",
    test: q => /[、。][^\n。]{1,20}[はか]？$/.test(q.question) && !q.question.endsWith("どれですか？") && !q.question.endsWith("どれですか。") && !q.question.endsWith("でしょうか？")
  },
  {
    name: "不自然な直訳用語（観測、不正実装、〜削っても）",
    test: q => q.question.includes("観測") || q.question.includes("削っても") || q.choices.some(c => c.text.includes("不正実装"))
  },
  {
    name: "箇条書き風の短い文連打（句点2つ以上かつ1文あたり平均30文字未満）",
    test: q => {
      const sentences = q.question.split("。").filter(s => s.trim().length > 0);
      return sentences.length >= 3 && q.question.length / sentences.length < 32;
    }
  }
];

let totalFlagged = new Set();
telegraphicPatterns.forEach(p => {
  const matches = seed.filter(p.test);
  matches.forEach(q => totalFlagged.add(q.id));
  console.log(`[${p.name}]: ${matches.length}問`);
});

console.log(`\n合計で不自然・電報調と判定された問題数: ${totalFlagged.size} / ${seed.length} 問`);

// サンプルをいくつか表示
console.log("\n代表的な電報調・不自然な問題リスト:");
Array.from(totalFlagged).slice(0, 10).forEach(id => {
  const q = seed.find(item => item.id === id);
  console.log(`- [${q.id}] ${q.question}`);
});
