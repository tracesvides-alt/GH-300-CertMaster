import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const syllabusPath = path.join(__dirname, '../content/gh300/2026-08-07/syllabus.json');
const sourcesPath = path.join(__dirname, '../content/gh300/2026-08-07/sources.json');
const questionsPath = path.join(__dirname, '../content/gh300/2026-08-07/questions/seed.json');
const scenarioSetsPath = path.join(__dirname, '../content/gh300/2026-08-07/scenario-sets/seed.json');

const syllabus = JSON.parse(fs.readFileSync(syllabusPath, 'utf8'));
const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
const scenarioSets = JSON.parse(fs.readFileSync(scenarioSetsPath, 'utf8'));

console.log('====================================================');
console.log('GH-300 CertMaster - Question Bank Quality Audit');
console.log('====================================================\n');

const total = questions.length;
console.log(`Total Questions: ${total}`);
console.log(`Scenario Sets: ${scenarioSets.length}\n`);

// 1. Difficulty distribution
const diffCounts = {
  beginner: questions.filter(q => q.difficulty === 'beginner').length,
  intermediate: questions.filter(q => q.difficulty === 'intermediate').length,
  advanced: questions.filter(q => q.difficulty === 'advanced').length,
};

console.log('--- Difficulty Distribution ---');
console.log(`D1 (Foundation):   ${diffCounts.beginner.toString().padStart(3)} (${((diffCounts.beginner / total) * 100).toFixed(1)}%)  [Target: ~20%]`);
console.log(`D2 (Applied):      ${diffCounts.intermediate.toString().padStart(3)} (${((diffCounts.intermediate / total) * 100).toFixed(1)}%)  [Target: ~40%]`);
console.log(`D3 (Exam-level):   ${diffCounts.advanced.toString().padStart(3)} (${((diffCounts.advanced / total) * 100).toFixed(1)}%)  [Target: ~40%]\n`);

const examLikeCount = questions.filter(q => q.examLike).length;
console.log(`Exam-like Questions: ${examLikeCount}\n`);

// 2. Domain & Objective coverage
console.log('--- Domain & Objective Difficulty 3 (Exam) Coverage ---');
const allObjectives = [];
syllabus.domains.forEach(d => {
  d.objectives.forEach(o => {
    allObjectives.push({ domainId: d.id, objectiveId: o.id, title: o.title });
  });
});

const missingExamObjectives = [];
allObjectives.forEach(obj => {
  const d3Count = questions.filter(q => q.objectiveId === obj.objectiveId && q.difficulty === 'advanced').length;
  if (d3Count === 0) {
    missingExamObjectives.push(obj);
  }
});

syllabus.domains.forEach(d => {
  const dQ = questions.filter(q => q.domainId === d.id);
  const dD3 = dQ.filter(q => q.difficulty === 'advanced').length;
  console.log(`Domain ${d.id.toUpperCase()} (${d.name}): Total ${dQ.length} (D1: ${dQ.filter(q => q.difficulty === 'beginner').length}, D2: ${dQ.filter(q => q.difficulty === 'intermediate').length}, D3: ${dD3})`);
});
console.log('');

// 3. Issue scanning
const issues = [];

// Rule A: Difficulty 3 with too short text (< 30 chars)
questions.forEach(q => {
  if (q.difficulty === 'advanced' && q.question.length < 30) {
    issues.push(`[Short Question] ID ${q.id}: Advanced question is too short (${q.question.length} chars)`);
  }
});

// Rule B: Missing or incomplete distractor explanations
questions.forEach(q => {
  const choiceKeys = Object.keys(q.choiceExplanations || {});
  if (choiceKeys.length < 4) {
    issues.push(`[Incomplete Distractor Explanations] ID ${q.id}: only has ${choiceKeys.length}/4 choice explanations`);
  } else {
    for (const k of choiceKeys) {
      if (!q.choiceExplanations[k] || q.choiceExplanations[k].trim().length < 5) {
        issues.push(`[Trivial Explanation] ID ${q.id} choice ${k} has empty/trivial explanation`);
      }
    }
  }
});

// Rule C: Missing sourceIds
const validSourceIds = new Set(sources.map(s => s.id));
questions.forEach(q => {
  if (!q.sourceIds || q.sourceIds.length === 0) {
    issues.push(`[Missing Sources] ID ${q.id} has no sourceIds`);
  } else {
    for (const sId of q.sourceIds) {
      if (!validSourceIds.has(sId)) {
        issues.push(`[Invalid Source ID] ID ${q.id} references non-existent source "${sId}"`);
      }
    }
  }
});

// Rule D: examLike=true with cognitiveLevel=recall
questions.forEach(q => {
  if (q.examLike && q.cognitiveLevel === 'recall') {
    issues.push(`[Cognitive Level Mismatch] ID ${q.id} has examLike=true but cognitiveLevel=recall`);
  }
});

// Rule E: Objectives without any Difficulty 3 question
if (missingExamObjectives.length > 0) {
  missingExamObjectives.forEach(obj => {
    issues.push(`[Missing Exam Question] Objective ${obj.objectiveId} (${obj.title}) has 0 Difficulty 3 questions`);
  });
}

// Rule F: Scenario Sets validation
scenarioSets.forEach(set => {
  if (!set.questionIds || set.questionIds.length < 2) {
    issues.push(`[Invalid Scenario Set] Set ${set.id} has fewer than 2 questions`);
  }
  set.questionIds.forEach(qId => {
    const q = questions.find(item => item.id === qId);
    if (!q) {
      issues.push(`[Broken Link] Set ${set.id} points to missing question "${qId}"`);
    } else if (q.scenarioSetId !== set.id) {
      issues.push(`[Unlinked Question] Question "${qId}" does not have scenarioSetId="${set.id}"`);
    }
  });
});

console.log('--- Audit Issues ---');
if (issues.length === 0) {
  console.log('✓ No critical issues found! All 200 questions passed audit checks.');
} else {
  console.log(`Found ${issues.length} potential issues:`);
  issues.slice(0, 20).forEach(iss => console.log(` - ${iss}`));
  if (issues.length > 20) {
    console.log(` ... and ${issues.length - 20} more`);
  }
}

console.log('\n====================================================');
console.log('Audit Summary: ' + (issues.length === 0 ? 'PASSED (Clean)' : 'ATTENTION NEEDED'));
console.log('====================================================\n');
