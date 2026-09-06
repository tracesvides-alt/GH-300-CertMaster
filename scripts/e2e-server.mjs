import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const env = { ...process.env, CERTMASTER_E2E: '1' };
const built = spawnSync(process.execPath, [require.resolve('next/dist/bin/next'), 'build'], {
  env,
  stdio: 'inherit',
});
if (built.status !== 0) process.exit(built.status ?? 1);
// Keep the server in this process so Playwright can terminate it on Windows as well.
process.env.CERTMASTER_E2E = '1';
const { startServer } = require('next/dist/server/lib/start-server');
await startServer({
  dir: process.cwd(),
  isDev: false,
  hostname: '127.0.0.1',
  port: 3100,
  allowRetry: false,
});
