import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { inspectSource, checkSources, getMetadata } from '../scripts/check-official-sources.mjs';
import { officialSourceSchema, validateKnowledgeBase } from '../lib/knowledge.ts';
import { buildKnowledgeBase, questions } from '../lib/content.ts';
import { filterEligibleQuestions, selectionOptionsSchema } from '../lib/selection.ts';

const sources = JSON.parse(fs.readFileSync(new URL('../content/gh300/2026-08-07/sources.json', import.meta.url), 'utf8'));
const page = (title, extra = '') => `<html><head><title>${title} - GitHub Docs</title>${extra}</head><body><h1>${title}</h1><h2 id="usage">Usage</h2></body></html>`;
const response = (body, status = 200, headers = {}) => new Response(body, { status, headers });

describe('GitHub official source registry', () => {
  it('stores unique, valid English URLs with complete reverse references', () => {
    const ids = new Set(sources.map((s) => s.id));
    const github = sources.filter((s) => ['GitHub Docs', 'GitHub Blog'].includes(s.publisher));
    expect(ids.size).toBe(sources.length);
    expect(new Set(github.map((s) => s.url)).size).toBe(github.length);
    for (const source of github) {
      expect(officialSourceSchema.safeParse(source).success).toBe(true);
      const url = new URL(source.url);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe(source.publisher === 'GitHub Docs' ? 'docs.github.com' : 'github.blog');
      if (url.hostname === 'docs.github.com') expect(url.pathname).toMatch(/^\/en\//);
      expect(source.lastCheckedAt).toBe('2026-10-12');
      for (const field of ['relatedDomainIds', 'relatedObjectiveIds', 'relatedLessonIds', 'relatedGlossaryIds', 'relatedComparisonIds', 'relatedQuestionIds'])
        expect(Array.isArray(source[field])).toBe(true);
    }
  });

  it('preserves lesson, glossary, comparison, question, and scenario references', () => {
    const kb = buildKnowledgeBase();
    expect(validateKnowledgeBase(kb)).toEqual([]);
    const valid = new Set(sources.map((s) => s.id));
    for (const item of [...kb.lessons, ...kb.glossaryTerms, ...kb.comparisonGuides, ...questions, ...(kb.scenarioSets ?? [])]) {
      expect(item.sourceIds.every((id) => valid.has(id))).toBe(true);
    }
  });

  it('keeps needs-review questions out of practice even when AI questions are allowed', () => {
    const pending = questions.filter((q) => q.status === 'needs-review');
    expect(pending.length).toBeGreaterThan(0);
    const options = selectionOptionsSchema.parse({ verifiedOnly: false, includeAI: true });
    expect(filterEligibleQuestions(pending, options, { attempts: [] })).toEqual([]);
  });
});

describe('official source checker', () => {
  it('checks contract document headings behind a shared browser title', async () => {
    const source = { id: 'terms', title: 'GitHub Generative AI Services Terms', publisher: 'GitHub Terms', url: 'https://github.com/customer-terms/github-generative-ai-services-terms' };
    const html = heading => `<title>Customer agreements · GitHub</title><h1><span>${heading}</span></h1>`;
    const matching = await inspectSource(source, async () => response(html(source.title)));
    expect(matching.errors).toEqual([]);
    const wrong = await inspectSource(source, async () => response(html('Different document')));
    expect(wrong.errors.some(e => e.includes('expected topic'))).toBe(true);
    const wrongHost = await inspectSource({ ...source, url: 'https://docs.github.com/en/copilot' }, async () => response(html(source.title)));
    expect(wrongHost.errors.some(e => e.includes('publisher domain mismatch'))).toBe(true);
  });

  it('reads title, canonical, and fragment ids', () => {
    const metadata = getMetadata(page('MCP', '<link href="https://docs.github.com/en/copilot/mcp" rel="canonical">'));
    expect(metadata.title).toContain('MCP');
    expect(metadata.canonical).toBe('https://docs.github.com/en/copilot/mcp');
    expect(metadata.anchors.has('usage')).toBe(true);
  });

  it('warns on redirect and fails on broken links or fragments', async () => {
    const fetcher = async (url) => url.pathname === '/en/old'
      ? response('', 301, { location: '/en/new' })
      : response(page('New'));
    const moved = await inspectSource({ id: 'moved', title: 'New', publisher: 'GitHub Docs', url: 'https://docs.github.com/en/old' }, fetcher);
    expect(moved.warnings).toContain('saved URL redirects');
    expect(moved.finalUrl).toBe('https://docs.github.com/en/new');
    const missing = await inspectSource({ id: 'missing', title: 'Missing', publisher: 'GitHub Docs', url: 'https://docs.github.com/en/missing' }, async () => response('', 404));
    expect(missing.errors).toContain('HTTP 404');
    const anchor = await inspectSource({ id: 'anchor', title: 'New', publisher: 'GitHub Docs', url: 'https://docs.github.com/en/new#removed' }, fetcher);
    expect(anchor.errors).toContain('missing fragment #removed');
  });

  it('fails on wrong topic, canonical mismatch, and duplicate canonical pages', async () => {
    const source = (id, url) => ({ id, title: 'Expected', publisher: 'GitHub Docs', url });
    const wrong = await inspectSource(source('wrong', 'https://docs.github.com/en/wrong'), async () => response(page('Different')));
    expect(wrong.errors.some((e) => e.includes('page title differs'))).toBe(true);
    const canonical = await inspectSource(source('canonical', 'https://docs.github.com/en/a'), async () => response(page('Expected', '<link rel="canonical" href="https://docs.github.com/en/b">')));
    expect(canonical.errors.some((e) => e.includes('canonical topic mismatch'))).toBe(true);
    const duplicates = await checkSources([source('one', 'https://docs.github.com/en/a'), source('two', 'https://docs.github.com/en/a')], async () => response(page('Expected')));
    expect(duplicates.every((r) => r.errors.some((e) => e.includes('duplicate canonical')))).toBe(true);
  });
});
