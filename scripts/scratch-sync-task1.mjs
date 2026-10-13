import fs from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

const root = "content/gh300/2026-08-07/questions/";
const seedPath = `${root}seed.json`;
const qualPath = `${root}quality-review.json`;
const diffPath = `${root}difficulty-review.json`;
const clsPath = "reports/question-objective-classification-review.json";
const remPath = "reports/applied-remediation-review.json";

const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const qual = JSON.parse(fs.readFileSync(qualPath, "utf8"));
const diff = JSON.parse(fs.readFileSync(diffPath, "utf8"));
const cls = JSON.parse(fs.readFileSync(clsPath, "utf8"));
const rem = JSON.parse(fs.readFileSync(remPath, "utf8"));

const fingerprint = (q) => createHash("sha256").update(JSON.stringify(q)).digest("hex");

// 1. Update q-d2-a09
const q09Index = seed.findIndex((q) => q.id === "q-d2-a09");
const q09 = {
  ...seed[q09Index],
  domainId: "d2",
  objectiveId: "d2o3",
  sourceIds: ["chat", "prompt"],
  trustedSourceFacts: [
    "新規チャットを開始すると以前の会話履歴を使わずに対話できる。",
    "ウィンドウ再起動では直前のチャットセッションが復元される場合がある。",
    "プロンプト指示だけではコンテキスト窓内の古い履歴を物理的にリセットできない。",
    "settings.jsonの編集・削除ではセッション固有の会話履歴をクリアできない。"
  ],
  choiceQuality: {
    A: {
      plausibility: 3,
      distractorType: "correct",
      sourceIds: ["chat", "prompt"],
      rationale: "新規チャットを開始すると、以前の会話履歴を使わずに対話できます。現在のファイルや指示など、会話履歴以外の文脈までなくなるとは限りません。"
    },
    C: {
      plausibility: 3,
      distractorType: "common-confusion",
      sourceIds: ["chat", "prompt"],
      rationale: "ウィンドウを再起動しても直前のチャットセッションが復元される場合があり、履歴の消去としては非効率です。"
    },
    B: {
      plausibility: 3,
      distractorType: "common-confusion",
      sourceIds: ["chat", "prompt"],
      rationale: "プロンプトでの指示はモデルの注意力を浪費し、古い履歴がコンテキスト窓に残るため完全なリセットにはなりません。"
    },
    D: {
      plausibility: 3,
      distractorType: "common-confusion",
      sourceIds: ["chat", "prompt"],
      rationale: "settings.jsonに個別のチャット履歴キャッシュは保持されておらず、設定削除によるリセットはできません。"
    }
  }
};
seed[q09Index] = q09;

// 2. Update q-d2-a11
const q11Index = seed.findIndex((q) => q.id === "q-d2-a11");
const q11 = {
  id: "q-d2-a11",
  syllabusVersion: "2026-08-07",
  domainId: "d2",
  objectiveId: "d2o3",
  difficulty: "beginner",
  type: "single-select",
  status: "verified",
  cognitiveLevel: "understand",
  examLike: false,
  question: "GitHub上で複数のコミットを含むPull Request（PR）を作成する際、Copilotによる自動サマリー生成機能（Copilot Pull Request Summaries）を活用するワークフローとして、最も適切なものはどれですか？",
  choices: [
    {
      id: "A",
      text: "PRの変更差分から説明文の下書きを生成させ、作成者自身が背景や意図を確認・補足してレビュアーに共有する"
    },
    {
      id: "B",
      text: "生成されたサマリーが正確である前提でそのままマージを承認し、レビュアーによるコード差分の目視確認を省略する"
    },
    {
      id: "C",
      text: "各コミットのメッセージをそのまま機械的に連結してPR本文に転記させ、変更内容の要約や構成の整理は行わない"
    },
    {
      id: "D",
      text: "CodeQLによる静的解析の脆弱性スキャン結果を要約してPR本文に埋め込み、機能変更の説明文作成は行わない"
    }
  ],
  answer: ["A"],
  explanation: "Copilot Pull Request Summariesは、変更されたコード差分（diff）を解析してPRの概要や箇条書きの変更点を下書きとして提示する機能です。作成者は生成された内容を検証・補足してPR説明を完成させる責任があり、レビュアーによるコードレビューを省略するものではありません。",
  choiceExplanations: {
    A: "変更差分に基づく下書きを生成し、作成者が内容の正確性を確認・補足してレビュアーへ渡す運用が公式に推奨される活用法です。",
    B: "Copilotが生成した要約を盲信して人間のコードレビューや目視確認を省略してはならず、責任ある利用原則に反します。",
    C: "コミットメッセージの単純連結ではなく、実際のコード差分（diff）全体を解析して意味的な要約を生成する機能です。",
    D: "CodeQLなどのセキュリティスキャン結果を出力する機能ではなく、コード変更の概要と影響範囲を文章化する機能です。"
  },
  sourceIds: ["code-review", "responsible"],
  createdAt: "2026-09-07",
  lastVerifiedAt: "2026-10-13",
  trustedSourceFacts: [
    "変更差分からサマリーの下書きを生成し、人間が確認・補足して活用する。",
    "要約生成は人間のコードレビューや目視確認を代替・省略するものではない。",
    "コミットログの単純連結ではなく変更差分全体の意味的要約を行う。",
    "セキュリティ静的スキャン結果の出力ではなくPR説明文の下書きを行う。"
  ],
  distractorQuality: "scenario-contrast",
  choiceQuality: {
    A: {
      plausibility: 3,
      distractorType: "correct",
      sourceIds: ["code-review", "responsible"],
      rationale: "変更差分に基づく下書きを生成し、作成者が内容の正確性を確認・補足してレビュアーへ渡す運用が公式に推奨される活用法です。"
    },
    B: {
      plausibility: 3,
      distractorType: "common-confusion",
      sourceIds: ["code-review", "responsible"],
      rationale: "Copilotが生成した要約を盲信して人間のコードレビューや目視確認を省略してはならず、責任ある利用原則に反します。"
    },
    C: {
      plausibility: 3,
      distractorType: "common-confusion",
      sourceIds: ["code-review", "responsible"],
      rationale: "コミットメッセージの単純連結ではなく、実際のコード差分（diff）全体を解析して意味的な要約を生成する機能です。"
    },
    D: {
      plausibility: 2,
      distractorType: "wrong-mechanism",
      sourceIds: ["code-review", "responsible"],
      rationale: "CodeQLなどのセキュリティスキャン結果を出力する機能ではなく、コード変更の概要と影響範囲を文章化する機能です。"
    }
  },
  requirementMapping: [
    {
      requirement: "GitHub上で複数のコミットを含むPull Request（PR）を作成する際、Copilotによる自動サマリー生成機能（Copilot Pull Request Summaries）を活用するワークフローとして、最も適切なものはどれですか？",
      correctReason: "変更差分に基づく下書きを生成し、作成者が内容の正確性を確認・補足してレビュアーへ渡す運用が公式に推奨される活用法です。",
      distractorFailures: {
        B: "Copilotが生成した要約を盲信して人間のコードレビューや目視確認を省略してはならず、責任ある利用原則に反します。",
        C: "コミットメッセージの単純連結ではなく、実際のコード差分（diff）全体を解析して意味的な要約を生成する機能です。",
        D: "CodeQLなどのセキュリティスキャン結果を出力する機能ではなく、コード変更の概要と影響範囲を文章化する機能です。"
      }
    }
  ],
  contentRevision: "applied-readable-semantic-hotfix-2026-10-13",
  clues: [],
  testedConcepts: [
    "d2o3",
    "scenario-requirement-matching"
  ]
};
seed[q11Index] = q11;

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");

const fp09 = fingerprint(q09);
const fp11 = fingerprint(q11);

// Update quality-review.json
qual.questions["q-d2-a09"] = {
  ...qual.questions["q-d2-a09"],
  fingerprint: fp09,
  rationale: `第2段階で本文の条件と各案の反例を照合。${q09.requirementMapping[0].correctReason}`
};
qual.questions["q-d2-a11"] = {
  ...qual.questions["q-d2-a11"],
  fingerprint: fp11,
  rationale: `第2段階で本文の条件と各案の反例を照合。${q11.requirementMapping[0].correctReason}`
};
fs.writeFileSync(qualPath, JSON.stringify(qual, null, 2) + "\n");

// Update difficulty-review.json
diff.questions["q-d2-a09"] = {
  ...diff.questions["q-d2-a09"],
  fingerprint: fp09,
  reasoning: `正答IDAと説明が一致することを再読。${q09.explanation} 誤答はC：${q09.choiceExplanations.C}／B：${q09.choiceExplanations.B}／D：${q09.choiceExplanations.D}`
};
diff.questions["q-d2-a11"] = {
  ...diff.questions["q-d2-a11"],
  fingerprint: fp11,
  reasoningSteps: [
    "出題する機能と対話・接続の役割を区別する。",
    q11.explanation
  ],
  reasoning: `正答IDAと説明が一致することを再読。${q11.explanation} 誤答はB：${q11.choiceExplanations.B}／C：${q11.choiceExplanations.C}／D：${q11.choiceExplanations.D}`
};
fs.writeFileSync(diffPath, JSON.stringify(diff, null, 2) + "\n");

// Update question-objective-classification-review.json
const cls09 = cls.questions.find((q) => q.id === "q-d2-a09");
if (cls09) {
  cls09.after = q09;
  cls09.fingerprint = fp09;
}
const cls11 = cls.questions.find((q) => q.id === "q-d2-a11");
if (cls11) {
  cls11.after = q11;
  cls11.fingerprint = fp11;
}
fs.writeFileSync(clsPath, JSON.stringify(cls, null, 2) + "\n");

// Update applied-remediation-review.json
const rem09 = rem.questions.find((q) => q.id === "q-d2-a09");
if (rem09) {
  rem09.after = q09;
  rem09.fingerprint = fp09;
}
const rem11 = rem.questions.find((q) => q.id === "q-d2-a11");
if (rem11) {
  rem11.after = q11;
  rem11.fingerprint = fp11;
}
fs.writeFileSync(remPath, JSON.stringify(rem, null, 2) + "\n");

console.log("Updated seed, quality-review, difficulty-review, classification-review, remediation-review.");

// Re-run choice audit script to keep reports in sync
execSync("node scripts/audit-choice-quality.mjs", { stdio: "inherit" });
