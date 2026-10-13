import fs from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

const root = "content/gh300/2026-08-07/questions/";
const seedPath = `${root}seed.json`;
const qualPath = `${root}quality-review.json`;
const diffPath = `${root}difficulty-review.json`;
const clsPath = "reports/question-objective-classification-review.json";
const examRevPath = "reports/exam-question-quality-review.json";

const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const qual = JSON.parse(fs.readFileSync(qualPath, "utf8"));
const diff = JSON.parse(fs.readFileSync(diffPath, "utf8"));
const cls = JSON.parse(fs.readFileSync(clsPath, "utf8"));
const examRev = JSON.parse(fs.readFileSync(examRevPath, "utf8"));

const hash = (v) => createHash("sha256").update(JSON.stringify(v)).digest("hex");

// 1. Update q-d1-e02 in seed.json
const qIndex = seed.findIndex((q) => q.id === "q-d1-e02");
if (qIndex === -1) {
  throw new Error("Question q-d1-e02 not found in seed.json");
}

const targetQ = seed[qIndex];
const oldQuestionText = targetQ.question;
const newQuestionText = oldQuestionText.replace(
  "GitHub Copilot Workspace（Agent）",
  "GitHub Copilot Agent（コーディングエージェント）"
);

const updatedQ = {
  ...targetQ,
  question: newQuestionText,
  requirementMapping: targetQ.requirementMapping.map((rm) => ({
    ...rm,
    requirement: rm.requirement.replace(
      "GitHub Copilot Workspace（Agent）",
      "GitHub Copilot Agent（コーディングエージェント）"
    )
  }))
};

seed[qIndex] = updatedQ;
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
console.log("Updated q-d1-e02 in seed.json.");

// 2. Compute new fingerprint
const fp = hash(updatedQ);

// 3. Update exam-question-quality-review.json
const examRow = examRev.questions.find((x) => x.id === "q-d1-e02");
if (examRow) {
  examRow.after = updatedQ;
  examRow.fingerprint = fp;
  examRow.counterfactual.question = examRow.counterfactual.question.replace(
    "GitHub Copilot Workspace（Agent）",
    "GitHub Copilot Agent（コーディングエージェント）"
  );
}
fs.writeFileSync(examRevPath, JSON.stringify(examRev, null, 2) + "\n");
console.log("Updated q-d1-e02 in exam-question-quality-review.json.");

// 4. Update quality-review.json
if (qual.questions["q-d1-e02"]) {
  qual.questions["q-d1-e02"].fingerprint = fp;
  fs.writeFileSync(qualPath, JSON.stringify(qual, null, 2) + "\n");
  console.log("Updated q-d1-e02 fingerprint in quality-review.json.");
}

// 5. Update difficulty-review.json
if (diff.questions["q-d1-e02"]) {
  diff.questions["q-d1-e02"].fingerprint = fp;
  fs.writeFileSync(diffPath, JSON.stringify(diff, null, 2) + "\n");
  console.log("Updated q-d1-e02 fingerprint in difficulty-review.json.");
}

// 6. Update question-objective-classification-review.json
const clsRow = cls.questions.find((x) => x.id === "q-d1-e02");
if (clsRow) {
  clsRow.after = updatedQ;
  clsRow.fingerprint = fp;
  fs.writeFileSync(clsPath, JSON.stringify(cls, null, 2) + "\n");
  console.log("Updated q-d1-e02 in question-objective-classification-review.json.");
}

// 7. Audit choice quality
execSync("node scripts/audit-choice-quality.mjs", { stdio: "inherit" });
console.log("Re-generated choice quality audit.");
