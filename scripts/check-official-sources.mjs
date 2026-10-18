import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(root, 'content/gh300/2026-08-07/sources.json');
const allowedHosts = new Set(['docs.github.com', 'github.blog', 'github.com']);

function decodeHtmlText(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, key) => {
    if (!key.startsWith('#')) return named[key.toLowerCase()] ?? entity;
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10);
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : entity;
  });
}

export function getMetadata(html) {
  const title = decodeHtmlText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
    .replace(/\s+/g, ' ').trim();
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonicalTag = links.find((tag) => /\brel\s*=\s*["']?canonical\b/i.test(tag));
  const canonical = canonicalTag?.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
  const anchors = new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map(m => decodeHtmlText(m[1].replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim());
  return { title, canonical, anchors, headings };
}

export async function inspectSource(source, fetcher = fetch) {
  const result = {
    id: source.id, savedUrl: source.url, status: null, finalUrl: null,
    canonicalUrl: null, canonicalEvidence: null, title: null, redirects: [], fragmentValid: null,
    warnings: [], errors: [],
  };
  let current;
  try {
    current = new URL(source.url);
    if (current.protocol !== 'https:' || !allowedHosts.has(current.hostname)) {
      result.errors.push('invalid or non-GitHub official URL');
      return result;
    }
    if ((source.publisher === 'GitHub Docs' && current.hostname !== 'docs.github.com') ||
        (source.publisher === 'GitHub Blog' && current.hostname !== 'github.blog') ||
        (source.publisher === 'GitHub Terms' && current.hostname !== 'github.com')) {
      result.errors.push(`publisher domain mismatch: ${source.publisher} / ${current.hostname}`);
      return result;
    }
  } catch {
    result.errors.push('invalid URL');
    return result;
  }
  const fragment = decodeURIComponent(current.hash.slice(1));
  current.hash = '';

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      for (let hop = 0; hop < 8; hop++) {
        const response = await fetcher(current, {
          redirect: 'manual',
          headers: { 'user-agent': 'GH300-CertMaster-SourceCheck/1.0', accept: 'text/html' },
          signal: AbortSignal.timeout(20000),
        });
        result.status = response.status;
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (!location) {
            result.errors.push(`redirect ${response.status} without Location`);
            return result;
          }
          const target = new URL(location, current);
          result.redirects.push({ status: response.status, from: current.href, to: target.href });
          if (target.protocol !== 'https:' || !allowedHosts.has(target.hostname)) {
            result.errors.push(`redirect outside GitHub official domains: ${target.href}`);
            return result;
          }
          target.hash = '';
          current = target;
          continue;
        }
        result.finalUrl = current.href;
        if (response.status >= 500 || response.status === 429) throw new Error(`temporary HTTP ${response.status}`);
        if (response.status < 200 || response.status >= 300) {
          result.errors.push(`HTTP ${response.status}`);
          return result;
        }
        const { title, canonical, anchors, headings } = getMetadata(await response.text());
        result.title = title;
        result.canonicalUrl = canonical ? new URL(canonical, current).href : current.href;
        result.canonicalEvidence = canonical ? 'html-link' : 'final-200-url';
        result.fragmentValid = fragment ? anchors.has(fragment) : null;
        if (fragment && !result.fragmentValid) result.errors.push(`missing fragment #${fragment}`);
        if (result.redirects.length) result.warnings.push('saved URL redirects');
        if (result.canonicalUrl !== current.href) {
          const declared = new URL(result.canonicalUrl);
          if (declared.origin !== current.origin || declared.pathname !== current.pathname)
            result.errors.push(`canonical topic mismatch: ${result.canonicalUrl}`);
          else result.warnings.push(`canonical differs: ${result.canonicalUrl}`);
        }
        if (!title) result.warnings.push('missing page title');
        const displayedTitle = title.replace(/ - GitHub(?: Enterprise Cloud)? Docs$/, '');
        // Contract pages share the generic browser title "Customer agreements".
        // Accept the exact document H1 only for GitHub's customer-terms pages.
        const contractHeadingMatches = source.publisher === 'GitHub Terms' &&
          current.hostname === 'github.com' && current.pathname.startsWith('/customer-terms/') &&
          headings.some(heading => heading.toLowerCase() === source.title?.toLowerCase());
        if (source.title && !displayedTitle.toLowerCase().includes(source.title.toLowerCase()) && !contractHeadingMatches)
          result.errors.push(`page title differs from expected topic: ${source.title}`);
        return result;
      }
      result.errors.push('too many redirects');
      return result;
    } catch (error) {
      if (attempt === 2) {
        const message = `network unavailable after retries: ${error.message}`;
        if (error.name === 'TimeoutError' || /temporary HTTP (429|5\d\d)/.test(error.message))
          result.warnings.push(message);
        else result.errors.push(message);
        return result;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  return result;
}

export async function checkSources(sources, fetcher = fetch) {
  const githubSources = sources.filter((s) => {
    try { return allowedHosts.has(new URL(s.url).hostname); } catch { return s.publisher?.startsWith('GitHub'); }
  });
  const results = [];
  for (let index = 0; index < githubSources.length; index += 4) {
    results.push(...await Promise.all(githubSources.slice(index, index + 4).map((s) => inspectSource(s, fetcher))));
  }
  const byCanonical = new Map();
  for (const item of results) {
    if (!item.canonicalUrl) continue;
    const existing = byCanonical.get(item.canonicalUrl);
    if (existing) {
      item.errors.push(`duplicate canonical URL with ${existing.id}`);
      existing.errors.push(`duplicate canonical URL with ${item.id}`);
    } else byCanonical.set(item.canonicalUrl, item);
  }
  return results;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sources = JSON.parse(await readFile(registryPath, 'utf8'));
  const results = await checkSources(sources);
  const reportPath = path.join(root, 'artifacts/github-official-source-check.json');
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + '\n');
  for (const item of results) {
    const verdict = item.errors.length ? 'FAIL' : item.warnings.length ? 'WARN' : 'OK';
    console.log(`${verdict} ${item.id} ${item.status ?? '-'} ${item.finalUrl ?? item.savedUrl}`);
    for (const note of [...item.errors, ...item.warnings]) console.log(`  ${note}`);
  }
  console.log(`Checked ${results.length} GitHub official sources; ${results.filter((r) => r.errors.length).length} failures, ${results.filter((r) => r.warnings.length).length} warnings. Report: ${reportPath}`);
  if (results.some((r) => r.errors.length)) process.exitCode = 1;
}
