import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { validateAppliedReview } from '../scripts/audit-applied-question-review.mjs';

const root = new URL('../', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, root), 'utf8'));
const bank = read('content/gh300/2026-08-07/questions/seed.json');
const report = read('reports/applied-question-quality-review.json');

describe('Applied editorial review maintenance', () => {
  it('binds every Applied decision to the current text', () => {
    expect(validateAppliedReview(bank, report)).toEqual([]);
    const changed = structuredClone(bank);
    changed.find(q => q.difficulty === 'intermediate').choices[0].text += '未レビューの変更';
    expect(validateAppliedReview(changed, report).some(e => e.includes('Stale'))).toBe(true);
  });

  it('rejects a newly added Applied item without editorial sign-off', () => {
    const extra = structuredClone(bank.find(q => q.difficulty === 'intermediate'));
    extra.id = 'unreviewed-applied';
    expect(validateAppliedReview([...bank, extra], report)).toContain('Unreviewed Applied question: unreviewed-applied');
  });

  it('does not treat a context paragraph alone as application evidence', () => {
    const missing = structuredClone(report);
    missing.questions.find(row => row.difficulty === 'intermediate').counterfactual = null;
    expect(validateAppliedReview(bank, missing).some(e => e.includes('Missing application analysis'))).toBe(true);
  });

  it('preserves edited questions on sync and imports new drafts without fabricated PASS', () => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'gh300-applied-review-'));
    const write = (name, value) => {
      const target = path.join(fixture, name);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n');
    };
    try {
      const id = 'q-d1-a11';
      const files = ['content/gh300/2026-08-07/questions/seed.json',
        'content/gh300/2026-08-07/questions/difficulty-review.json',
        'content/gh300/2026-08-07/questions/quality-review.json',
        'content/gh300/2026-08-07/sources.json', 'content/gh300/2026-08-07/syllabus.json',
        'reports/question-difficulty-baseline.json','reports/question-choice-content-baseline.json'];
      for (const file of files) write(file, read(file));
      fs.mkdirSync(path.join(fixture, 'scripts/applied-question-drafts'), { recursive: true });
      fs.copyFileSync(new URL('scripts/sync-applied-questions.mjs', root), path.join(fixture, 'scripts/sync-applied-questions.mjs'));
      const drafts = read('scripts/applied-question-drafts/d1.json');
      // The old importer would overwrite a reviewed question with this stale draft.
      drafts.questions.find(q => q.id === id).question = '古い未レビュー文面';
      write('scripts/applied-question-drafts/d1.json', drafts);
      const run = () => execFileSync(process.execPath, ['scripts/sync-applied-questions.mjs'], { cwd: fixture });
      run();
      expect(JSON.parse(fs.readFileSync(path.join(fixture, files[0])))).toEqual(bank);
      expect(JSON.parse(fs.readFileSync(path.join(fixture, files[2])))).toEqual(read(files[2]));
      const seed = bank.filter(q => q.id !== id);
      write(files[0], seed);
      for (const file of [files[1], files[2], files[6]]) {
        const value = read(file); delete value.questions[id]; write(file, value);
      }
      const baseline = read(files[5]); baseline.questions = baseline.questions.filter(q => q.id !== id); write(files[5], baseline);
      run();
      const imported = JSON.parse(fs.readFileSync(path.join(fixture, files[0]))).find(q => q.id === id);
      expect(imported.status).toBe('needs-review');
      expect(JSON.parse(fs.readFileSync(path.join(fixture, files[2]))).questions[id]).toBeUndefined();
      expect(JSON.parse(fs.readFileSync(path.join(fixture, files[1]))).questions[id].reviewRequired).toBe(true);
    } finally {
      const parent = path.resolve(os.tmpdir()) + path.sep;
      if (!path.resolve(fixture).startsWith(parent) || !path.basename(fixture).startsWith('gh300-applied-review-')) throw Error('Invalid cleanup target');
      fs.rmSync(fixture, { recursive: true, force: true });
    }
  });
});
