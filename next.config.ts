import type { NextConfig } from 'next';

// Static Next.js pages need their inline bootstrap scripts and progress styles.
// This policy limits origins and embedding; it is not a strict inline-XSS policy.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

const config: NextConfig = {
  poweredByHeader: false,
  // Test builds must never replace assets used by the user's running application.
  distDir: process.env.CERTMASTER_E2E === '1' ? '.next-e2e' : '.next',
  async headers() {
    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    // Development needs HMR and developer tooling. Validate the deployed policy
    // with a production build, optionally in Report-Only mode during testing.
    if (process.env.NODE_ENV === 'production') {
      headers.push({
        key: process.env.CERTMASTER_CSP_REPORT_ONLY === '1'
          ? 'Content-Security-Policy-Report-Only'
          : 'Content-Security-Policy',
        value: contentSecurityPolicy,
      });
    }
    return [
      { source: '/:path*', headers },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'" },
        ],
      },
    ];
  },
};
export default config;
