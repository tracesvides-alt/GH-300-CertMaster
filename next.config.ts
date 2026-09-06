import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  // Test builds must never replace assets used by the user's running application.
  distDir: process.env.CERTMASTER_E2E === '1' ? '.next-e2e' : '.next',
};
export default config;
