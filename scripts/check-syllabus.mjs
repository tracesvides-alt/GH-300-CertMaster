import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const url =
  'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300';
const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
if (!response.ok) throw Error(`Study Guide fetch failed: ${response.status}`);
const html = await response.text();
const body = (html.match(/<main[\s\S]*?<\/main>/i) || [])[0];
if (!body || !body.includes('Skills measured') || !body.includes('Use GitHub Copilot responsibly'))
  throw Error('Expected syllabus content missing; refusing snapshot');
const normalized = body
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const hash = createHash('sha256').update(normalized).digest('hex');
await mkdir('artifacts', { recursive: true });
let baseline;
try {
  baseline = JSON.parse(await readFile('snapshots/gh300.json', 'utf8'));
} catch {}
await writeFile('artifacts/gh300-current.txt', normalized);
await writeFile(
  'artifacts/gh300-current.json',
  JSON.stringify({ url, checkedAt: new Date().toISOString(), hash }, null, 2),
);
const changed = baseline?.hash !== hash;
await writeFile(
  'artifacts/review.md',
  `# GH-300 source review\n\n${baseline ? (changed ? 'Official page changed. Human review required.' : 'No changes detected.') : 'No baseline exists. Human review required before adopting the first snapshot.'}\n\nSource: ${url}\n\nBaseline hash: ${baseline?.hash ?? 'none'}\nCurrent hash: ${hash}\n\nCompare the attached snapshot with snapshots/gh300.txt. Never update production content automatically. After review, copy the current JSON and text into snapshots/gh300.json and snapshots/gh300.txt via a reviewed PR.\n`,
);
console.log(changed ? 'REVIEW_REQUIRED' : 'UNCHANGED');
