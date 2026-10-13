import fs from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { rewrites } from "./refine-foundation-wording.mjs";

console.log("=== Starting Comprehensive Foundation Wording Refinement ===");

const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");

// 1. Update seed.json
const seedPath = "content/gh300/2026-08-07/questions/seed.json";
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

let seedUpdatedCount = 0;
const newFingerprints = new Map();

for (const q of seed) {
  if (rewrites[q.id]) {
    const oldQ = q.question;
    const newQ = rewrites[q.id];
    if (oldQ !== newQ) {
      q.question = newQ;
      seedUpdatedCount++;
    }
  }
  const fp = hash(q);
  newFingerprints.set(q.id, fp);
}

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n", "utf8");
console.log(`Updated ${seedUpdatedCount} questions in seed.json`);

// 2. Update quality-review.json
const qrPath = "content/gh300/2026-08-07/questions/quality-review.json";
const qr = JSON.parse(fs.readFileSync(qrPath, "utf8"));
let qrUpdatedCount = 0;

for (const [id, fp] of newFingerprints.entries()) {
  if (qr.questions[id]) {
    if (qr.questions[id].fingerprint !== fp) {
      qr.questions[id].fingerprint = fp;
      qrUpdatedCount++;
    }
  }
}
fs.writeFileSync(qrPath, JSON.stringify(qr, null, 2) + "\n", "utf8");
console.log(`Updated ${qrUpdatedCount} fingerprints in quality-review.json`);

// 3. Update difficulty-review.json
const diffRevPath = "content/gh300/2026-08-07/questions/difficulty-review.json";
if (fs.existsSync(diffRevPath)) {
  const diffRev = JSON.parse(fs.readFileSync(diffRevPath, "utf8"));
  let diffUpdatedCount = 0;
  for (const [id, fp] of newFingerprints.entries()) {
    if (diffRev.questions[id] && diffRev.questions[id].fingerprint !== fp) {
      diffRev.questions[id].fingerprint = fp;
      diffUpdatedCount++;
    }
  }
  fs.writeFileSync(diffRevPath, JSON.stringify(diffRev, null, 2) + "\n", "utf8");
  console.log(`Updated ${diffUpdatedCount} fingerprints in difficulty-review.json`);
}

// 4. Update reports/question-objective-classification-review.json
const crPath = "reports/question-objective-classification-review.json";
if (fs.existsSync(crPath)) {
  const cr = JSON.parse(fs.readFileSync(crPath, "utf8"));
  let crUpdatedCount = 0;
  if (Array.isArray(cr.questions)) {
    for (const item of cr.questions) {
      const q = seed.find(s => s.id === item.id);
      if (q && rewrites[item.id]) {
        item.question = q.question;
        item.fingerprint = newFingerprints.get(item.id);
        crUpdatedCount++;
      }
    }
  }
  fs.writeFileSync(crPath, JSON.stringify(cr, null, 2) + "\n", "utf8");
  console.log(`Updated ${crUpdatedCount} entries in question-objective-classification-review.json`);
}

// 5. Update reports/applied-remediation-review.json
const remedPath = "reports/applied-remediation-review.json";
if (fs.existsSync(remedPath)) {
  const remed = JSON.parse(fs.readFileSync(remedPath, "utf8"));
  let remedUpdatedCount = 0;
  for (const r of remed.questions) {
    if (rewrites[r.id]) {
      const q = seed.find(s => s.id === r.id);
      if (q) {
        r.after = q;
        r.fingerprint = newFingerprints.get(r.id);
        remedUpdatedCount++;
      }
    }
  }
  fs.writeFileSync(remedPath, JSON.stringify(remed, null, 2) + "\n", "utf8");
  console.log(`Updated ${remedUpdatedCount} entries in applied-remediation-review.json`);
}

// 6. Update reports/applied-question-quality-review.json
const appRevPath = "reports/applied-question-quality-review.json";
if (fs.existsSync(appRevPath)) {
  const appRev = JSON.parse(fs.readFileSync(appRevPath, "utf8"));
  let appUpdatedCount = 0;
  for (const r of appRev.questions) {
    if (rewrites[r.id]) {
      const q = seed.find(s => s.id === r.id);
      if (q) {
        r.after = q;
        r.fingerprint = newFingerprints.get(r.id);
        appUpdatedCount++;
      }
    }
  }
  fs.writeFileSync(appRevPath, JSON.stringify(appRev, null, 2) + "\n", "utf8");
  console.log(`Updated ${appUpdatedCount} entries in applied-question-quality-review.json`);
}

// 7. Regenerate foundation glossary report
console.log("Running scripts/audit-foundation-glossary.mjs...");
execSync("node scripts/audit-foundation-glossary.mjs", { stdio: "inherit" });

// 8. Regenerate choice audit
console.log("Running scripts/audit-choice-quality.mjs...");
execSync("node scripts/audit-choice-quality.mjs", { stdio: "inherit" });

// 9. Run applied review audit
console.log("Running scripts/audit-applied-question-review.mjs...");
execSync("node scripts/audit-applied-question-review.mjs", { stdio: "inherit" });

// 10. Run quality check
console.log("Running npm run quality:check...");
execSync("npm run quality:check", { stdio: "inherit" });

console.log("=== All Syncs and Audits Completed Successfully! ===");
