import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { edits } from './question-quality-edits.mjs';

const root = new URL('../content/gh300/2026-08-07/', import.meta.url);
const questionFile = new URL('questions/seed.json', root);
const bank = JSON.parse(fs.readFileSync(questionFile, 'utf8'));
const sourcesFile = new URL('sources.json', root);
const sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
const additions = {
  'mcp-config': ['MCP configuration reference', 'https://code.visualstudio.com/docs/agents/reference/mcp-configuration', 'VS Code Docs'],
  'mcp-spec': ['MCP server tools specification', 'https://modelcontextprotocol.io/specification/2025-06-18/server/tools', 'Model Context Protocol'],
  'inline-usage': ['Getting code suggestions in your IDE', 'https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions', 'GitHub Docs'],
  'cli-current': ['Use GitHub Copilot CLI', 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli', 'GitHub Docs'],
  'network': ['Troubleshooting network errors for GitHub Copilot', 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-network-errors', 'GitHub Docs'],
  'exclusion-concept': ['Content exclusion: supported surfaces and limitations', 'https://docs.github.com/en/copilot/concepts/context/content-exclusion', 'GitHub Docs'],
  'public-code': ['GitHub Copilot code referencing', 'https://docs.github.com/en/copilot/concepts/completions/code-referencing', 'GitHub Docs'],
  'workspace-context': ['Workspace context in VS Code', 'https://code.visualstudio.com/docs/agents/reference/workspace-context', 'VS Code Docs'],
  'streaming': ['Server-sent events', 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events', 'MDN'],
  'timer-testing': ['Vitest fake timers', 'https://vitest.dev/guide/mocking/timers', 'Vitest'],
  'property-testing': ['fast-check property based testing', 'https://fast-check.dev/docs/introduction/', 'fast-check'],
  'secret-scanning': ['About push protection', 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection', 'GitHub Docs'],
  'codeql': ['About code scanning with CodeQL', 'https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql', 'GitHub Docs'],
  'space-framework': ['Measuring enterprise developer productivity', 'https://github.blog/enterprise-software/devops/measuring-enterprise-developer-productivity/', 'GitHub Blog'],
};
for (const [id, [title, url, publisher]] of Object.entries(additions)) {
  if (!sources.some(s => s.id === id)) sources.push({ id, title, url, publisher,
    sourceType: 'official-docs', lastCheckedAt: '2026-09-07', syllabusVersion: '2026-08-07',
    relatedObjectiveIds: [...new Set(bank.filter(q => edits[q.id]?.sources.includes(id)).map(q => q.objectiveId))] });
}
const correctedUrls = {
  'workspace-context': 'https://code.visualstudio.com/docs/agents/reference/workspace-context',
  privacy: 'https://docs.github.com/en/enterprise-cloud%40latest/copilot/reference/ai-models/model-hosting',
  instructions: 'https://docs.github.com/en/copilot/reference/customization-cheat-sheet',
  'prompt-files': 'https://docs.github.com/en/copilot/reference/customization-cheat-sheet',
  spaces: 'https://docs.github.com/en/copilot/how-tos/provide-context/use-copilot-spaces/use-copilot-spaces',
  mcp: 'https://docs.github.com/en/copilot/reference/customization-cheat-sheet',
};
for (const s of sources) if (correctedUrls[s.id]) {
  s.url = correctedUrls[s.id];
  s.lastCheckedAt = '2026-09-07';
}
for (const q of bank) {
  if (q.difficulty === 'beginner') continue;
  const e = edits[q.id];
  if (!e || e.options.length !== 4 || e.reasons.length !== 4) throw Error(`Missing editorial revision ${q.id}`);
  if (q.answer.length !== 1) throw Error(`Multiple answer revision needs explicit mapping: ${q.id}`);
  const ids = [q.answer[0], ...q.choices.map(c => c.id).filter(id => !q.answer.includes(id)).sort()];
  q.question = e.question ?? q.question;
  q.choices = e.options.map((text, i) => ({ id: ids[i], text }));
  q.choiceExplanations = Object.fromEntries(ids.map((id, i) => [id, e.reasons[i]]));
  q.explanation = e.reasons[0] + ' ' + e.reasons[1];
  q.sourceIds = [...e.sources];
  q.trustedSourceFacts = [...e.reasons];
  q.cognitiveLevel = q.difficulty === 'advanced' ? 'analyze' : 'apply';
  q.examLike = q.difficulty === 'advanced';
  q.distractorQuality = 'scenario-contrast';
  q.choiceQuality = Object.fromEntries(ids.map((id, i) => [id, {
    plausibility: i === 0 ? 3 : 2,
    distractorType: i === 0 ? 'correct' : /個人|範囲|対象.*広|下位|全体/.test(e.reasons[i]) ? 'wrong-scope' : /機能|仕組み|別の|役割/.test(e.reasons[i]) ? 'wrong-mechanism' : 'partial-match',
    sourceIds: [...e.sources],
    rationale: e.reasons[i],
  }]));
  q.requirementMapping = [{ requirement: q.question, correctReason: e.reasons[0],
    distractorFailures: Object.fromEntries(ids.slice(1).map((id, i) => [id, e.reasons[i + 1]])) }];
  // The stage-2 report is separate and bound to the full content fingerprint.
  delete q.qualityReview;
  q.contentRevision = '2026-09-07-quality';
  q.lastVerifiedAt = '2026-09-07';
  q.clues = [q.question.split('。').filter(s => s && !/[？?]$/.test(s)).at(-1) ?? q.question];
  q.testedConcepts = [q.objectiveId, 'scenario-requirement-matching'];
}

// Balance actual display positions, preserving stable choice IDs used in saved answers.
// Hash order decorrelates question order from positions; per-domain minima prevent clusters.
const hash = value => createHash('sha256').update(value).digest('hex');
const groups = [...new Set(bank.map(q => `${q.difficulty}/${q.domainId}`))].sort();
const difficultyTotals = {};
for (const group of groups) {
  const qs = bank.filter(q => `${q.difficulty}/${q.domainId}` === group)
    .sort((a, b) => hash(a.id).localeCompare(hash(b.id)));
  const counts = [0, 0, 0, 0];
  const global = difficultyTotals[qs[0].difficulty] ??= [0, 0, 0, 0];
  for (const q of qs) {
    const target = [0, 1, 2, 3].sort((a, b) => counts[a] - counts[b] || global[a] - global[b] || hash(q.id + a).localeCompare(hash(q.id + b)))[0];
    const right = q.choices.filter(c => q.answer.includes(c.id));
    const wrong = q.choices.filter(c => !q.answer.includes(c.id)).sort((a, b) => hash(q.id + a.id).localeCompare(hash(q.id + b.id)));
    const arranged = Array(4);
    arranged[target] = right.shift();
    for (let i = 0; i < 4; i++) if (!arranged[i]) arranged[i] = right.shift() ?? wrong.shift();
    q.choices = arranged;
    q.choices.forEach((c, i) => { if (q.answer.includes(c.id)) { counts[i]++; global[i]++; } });
  }
}
fs.writeFileSync(questionFile, JSON.stringify(bank, null, 2) + '\n');
fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 2) + '\n');
const setFile = new URL('scenario-sets/seed.json', root);
const sets = JSON.parse(fs.readFileSync(setFile, 'utf8'));
const extensionSet = sets.find(s => s.id === 'sc07');
extensionSet.scenario = 'セキュリティ製品ベンダーのCyberShield Systemsは、社内の脆弱性情報をCopilotから検索するMCP連携を設計しています。承認済みの接続先だけを利用し、同じサーバーへ接続する利用者でも文書ごとの閲覧権限を守る必要があります。管理者は接続ポリシーとサーバーの認可を分けて確認し、変更操作を監査ログで追跡する運用を求めています。';
extensionSet.sourceIds = ['mcp', 'policies', 'audit-log'];
fs.writeFileSync(setFile, JSON.stringify(sets, null, 2) + '\n');
console.log(`Migrated ${Object.keys(edits).length} Applied/Exam questions; ${bank.length} positions rebalanced. Stage 2 review required.`);
