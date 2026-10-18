# Security maintenance

Use Node.js 24.22.0 or a newer maintained 24.x release. `.node-version` records the
tested version; it does not replace an older system installation automatically.
Install dependencies from the committed lockfile with `npm ci`.

Run both `npm audit --omit=dev` and `npm audit`, followed by `npm run check`,
`npm test`, and `npm run test:e2e` after dependency or security-policy changes.
CI records a dependency audit and fails on high/critical findings or audit errors.
Dependabot proposes weekly npm and GitHub Actions updates without auto-merging.

All workflows pin external actions to full commit SHAs verified against their
official repositories. Version comments let Dependabot track future updates.
Checkout disables persisted Git credentials before repository scripts run, and
workflow tokens retain read-only contents access. CI uses `.node-version` for the
tested runtime and bounds job execution time. Artifact uploads list only the
intended reports; do not expand them to whole working or environment directories.

Production responses deny framing, disable MIME sniffing, set a referrer policy,
and restrict camera, microphone and location access. CSP limits resource loading,
connections and workers to this origin. Static Next.js bootstrap scripts and
progress styles currently require `unsafe-inline`; the policy does not provide
complete protection against injected inline scripts. `unsafe-eval` is not allowed.
Zod runs with `jitless: true` so content validation does not generate code.

`CERTMASTER_CSP_REPORT_ONLY=1` is for verification only. Production acceptance must
check the enforced `Content-Security-Policy` response, not only Report-Only logs.
Development omits this CSP so HMR and local developer tools keep working.

Service workers revalidate `/sw.js` without the HTTP cache. Bump the application
cache generation when releasing security-sensitive client changes. A waiting
worker does not force a page reload: finish the current answer, then close all
application tabs and reopen online to activate the update. Test old-to-new updates,
failed bundle downloads, offline operation and rollback before release.
Downloads are fully drained before the cache is changed, so large uncached bodies
cannot occupy every HTTP connection while other downloads wait for headers.
CI runs browser security and cold-install download regressions on desktop/mobile.

Learning history stays in IndexedDB in each browser profile. It is shared by people
using the same profile and origin. Updates must preserve it; clearing site data
removes history and should not be a routine update/rollback step. This practice
application ships its questions and answers to the browser and does not provide
tamper-proof examination records.

The public production URL is readable without login. If access must be limited,
configure hosting access controls and account for already downloaded offline
content. Never commit credentials, environment files or browser authentication
state. Verify hosting administrator access and MFA through the account owner.
