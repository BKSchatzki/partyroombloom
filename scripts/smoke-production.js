const { spawn } = require('node:child_process');

const DEFAULT_REQUIRED_HEADERS = [
  'X-DNS-Prefetch-Control',
  'Strict-Transport-Security',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
];

const DEFAULT_FORBIDDEN_HEADERS = ['X-Powered-By'];
const DEFAULT_TIMEOUT_MS = 30000;

const parseList = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const parsePositiveInteger = (value, fallback) => {
  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const appendOutput = (buffer, chunk) => {
  const output = buffer + chunk.toString();
  return output.length > 12000 ? output.slice(-12000) : output;
};

const stopServer = async (server) => {
  if (!server.pid || server.exitCode !== null || server.signalCode !== null) {
    return;
  }

  server.kill('SIGTERM');

  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      if (server.exitCode === null && server.signalCode === null) {
        server.kill('SIGKILL');
      }
      resolve();
    }, 5000);

    server.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
};

const assertHeaders = (response, requiredHeaders, forbiddenHeaders) => {
  const missingHeaders = requiredHeaders.filter((header) => !response.headers.has(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing expected response headers: ${missingHeaders.join(', ')}`);
  }

  const presentForbiddenHeaders = forbiddenHeaders.filter((header) => response.headers.has(header));
  if (presentForbiddenHeaders.length > 0) {
    throw new Error(`Unexpected response headers present: ${presentForbiddenHeaders.join(', ')}`);
  }
};

const main = async () => {
  const port = process.env.PORT || '3000';
  const hostname = process.env.HOSTNAME || '127.0.0.1';
  const smokePath = process.env.SMOKE_PATH || '/api/health';
  const timeoutMs = parsePositiveInteger(process.env.SMOKE_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  const requiredHeaders = parseList(process.env.SMOKE_REQUIRED_HEADERS, DEFAULT_REQUIRED_HEADERS);
  const forbiddenHeaders = parseList(
    process.env.SMOKE_FORBIDDEN_HEADERS,
    DEFAULT_FORBIDDEN_HEADERS
  );
  const url = new URL(smokePath, `http://${hostname}:${port}`);
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const startedAt = Date.now();
  let serverOutput = '';
  let exitDescription = null;
  let lastError = null;

  const server = spawn(npmCommand, ['start'], {
    env: {
      ...process.env,
      HOSTNAME: hostname,
      PORT: port,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', (chunk) => {
    serverOutput = appendOutput(serverOutput, chunk);
  });
  server.stderr.on('data', (chunk) => {
    serverOutput = appendOutput(serverOutput, chunk);
  });
  server.on('exit', (code, signal) => {
    exitDescription = `server exited with code ${code ?? 'null'} and signal ${signal ?? 'null'}`;
  });
  server.on('error', (error) => {
    exitDescription = `server failed to start: ${error.message}`;
  });

  try {
    while (Date.now() - startedAt < timeoutMs) {
      if (exitDescription) {
        throw new Error(exitDescription);
      }

      try {
        const response = await fetch(url, { redirect: 'manual' });
        if (response.ok) {
          assertHeaders(response, requiredHeaders, forbiddenHeaders);
          console.log(`Production smoke passed: ${url.href} returned ${response.status}`);
          return;
        }

        lastError = new Error(`${url.href} returned ${response.status}`);
      } catch (error) {
        lastError = error;
      }

      await delay(1000);
    }

    throw lastError ?? new Error(`Timed out waiting for ${url.href}`);
  } catch (error) {
    console.error('Production smoke failed:', error);
    if (serverOutput.trim().length > 0) {
      console.error('Server output:');
      console.error(serverOutput.trim());
    }
    process.exitCode = 1;
  } finally {
    await stopServer(server);
  }
};

main().catch((error) => {
  console.error('Production smoke failed:', error);
  process.exitCode = 1;
});
