import fs from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

const root = "content/gh300/2026-08-07/questions/";
const seedPath = `${root}seed.json`;
const qualPath = `${root}quality-review.json`;
const diffPath = `${root}difficulty-review.json`;
const clsPath = "reports/question-objective-classification-review.json";
const appRevPath = "reports/applied-question-quality-review.json";
const remPath = "reports/applied-remediation-review.json";

const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const qual = JSON.parse(fs.readFileSync(qualPath, "utf8"));
const diff = JSON.parse(fs.readFileSync(diffPath, "utf8"));
const cls = JSON.parse(fs.readFileSync(clsPath, "utf8"));
const appRev = JSON.parse(fs.readFileSync(appRevPath, "utf8"));
const rem = JSON.parse(fs.readFileSync(remPath, "utf8"));

const fingerprint = (q) => createHash("sha256").update(JSON.stringify(q)).digest("hex");

const updatedFactsMap = {
  "q-d2-a10": [
    ".github/prompts/*.prompt.md はオンデマンドで引数付き実行できるプロンプトファイルとしてリポジトリ管理される。",
    "copilot-instructions.mdは全会話へ常時注入される指示でありオンデマンド実行用プロンプトファイルではない。",
    "各自のローカル環境のシェルスクリプトではチーム間でのバージョン管理や共有が行えない。",
    "package.jsonのscriptsへのインライン記述はプロンプトファイル機能の恩恵を受けられず保守性が悪い。"
  ],
  "q-d2-a12": [
    "Copilotは行単位の部分受け入れ（Accept Next Line）に対応しており必要な1行のみを採用できる。",
    "Tabキーは提案全体を一括確定するため後続の不要な行まで挿入されてしまう。",
    "Escapeキーは提案全体を破棄するため手動入力の手間が発生してしまう。",
    "Enterキーは通常の改行挿入であり提案の1行を部分採用する操作ではない。"
  ],
  "q-d2-a13": [
    "Alt+]（Option+]）によりエディタ上で生成済みの代替補完候補を順次切り替えて比較できる。",
    "Tabキーは現在の提案の受け入れであり代替候補への切り替えにはならない。",
    "1文字削除と再入力ではバックグラウンド生成済みの別候補を直接参照できない。",
    "インデントの改ざんは構文エラーを引き起こし適切な候補切り替え操作ではない。"
  ],
  "q-d2-a14": [
    "Chatパネルの対話モード（Ask）はコードを変更せずに解説の取得や設計相談を行うのに適している。",
    "Inline Chatはコードの直接置換を目的としており対話による腰を据えた検討には向かない。",
    "Agentモードは自律的にファイルを変更するためコードを変更しない相談要件に反する。",
    "インライン補完はコードの自動挿入支援であり対話的な解説や相談には使えない。"
  ],
  "q-d3-a02": [
    "#fileや#selectionなどのコンテキスト変数を用いることで特定のファイルやコード範囲を確実に文脈へ注入できる。",
    "#ignore:allは存在しない変数でありエディタ設定を無効化する機能ではない。",
    "#terminal:clearは存在しない変数でありターミナルログの消去コマンドではない。",
    "#model:gpt4などの変数で基盤モデルの重みパラメータを直接上書きすることはできない。"
  ],
  "q-d3-a04": [
    "利用可能なライブラリを具体的に限定し外部追加を禁止することで存在しないAPIの捏造（ハルシネーション）を抑制できる。",
    "創造性を自由に発揮させる指示はハルシネーションのリスクをかえって増大させる。",
    "型定義などの必要な文脈を削除するとモデルの推測への依存度が高まりハルシネーションが悪化する。",
    "温度パラメータの上昇はランダム性を高めハルシネーションを多発させる原因となる。"
  ]
};

const updatedQuestions = {};

for (const [id, facts] of Object.entries(updatedFactsMap)) {
  const index = seed.findIndex((q) => q.id === id);
  if (index === -1) {
    throw new Error(`Question ${id} not found in seed.json`);
  }
  const q = {
    ...seed[index],
    trustedSourceFacts: facts
  };
  seed[index] = q;
  updatedQuestions[id] = q;
}

// 1. Write updated seed.json
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
console.log("Updated seed.json with corrected trustedSourceFacts.");

// 2. Synchronize review ledgers
for (const [id, q] of Object.entries(updatedQuestions)) {
  const fp = fingerprint(q);

  // quality-review.json
  if (qual.questions[id]) {
    qual.questions[id].fingerprint = fp;
  }

  // difficulty-review.json
  if (diff.questions[id]) {
    diff.questions[id].fingerprint = fp;
  }

  // question-objective-classification-review.json
  const clsRow = cls.questions.find((item) => item.id === id);
  if (clsRow) {
    clsRow.after = q;
    clsRow.fingerprint = fp;
  }

  // applied-question-quality-review.json
  const appRow = appRev.questions.find((item) => item.id === id);
  if (appRow) {
    appRow.after = q;
    appRow.fingerprint = fp;
  }

  // applied-remediation-review.json
  const remRow = rem.questions.find((item) => item.id === id);
  if (remRow) {
    remRow.after = q;
    remRow.fingerprint = fp;
  }
}

fs.writeFileSync(qualPath, JSON.stringify(qual, null, 2) + "\n");
fs.writeFileSync(diffPath, JSON.stringify(diff, null, 2) + "\n");
fs.writeFileSync(clsPath, JSON.stringify(cls, null, 2) + "\n");
fs.writeFileSync(appRevPath, JSON.stringify(appRev, null, 2) + "\n");
fs.writeFileSync(remPath, JSON.stringify(rem, null, 2) + "\n");

console.log("Successfully synchronized quality-review, difficulty-review, classification-review, applied-review, and remediation-review.");

// 3. Re-run choice quality audit
execSync("node scripts/audit-choice-quality.mjs", { stdio: "inherit" });
console.log("Re-generated choice quality audit.");
