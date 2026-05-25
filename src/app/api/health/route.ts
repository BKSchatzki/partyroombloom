import { getRequiredEnvStatus } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { jsonNoStore } from '@/lib/responses';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DATABASE_HEALTHCHECK_TIMEOUT_MS = 2_000;

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Database health check timed out.')), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
};

export const GET = async () => {
  const startedAt = Date.now();
  const environmentCheck = getRequiredEnvStatus();
  let databaseCheck: 'ok' | 'error' = 'ok';

  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, DATABASE_HEALTHCHECK_TIMEOUT_MS);
  } catch {
    databaseCheck = 'error';
  }

  const isReady = databaseCheck === 'ok' && environmentCheck.configured;

  return jsonNoStore(
    {
      status: isReady ? 'ok' : 'error',
      checks: {
        database: databaseCheck,
        environment: environmentCheck.configured ? 'ok' : 'error',
      },
      invalidEnvironmentVariableCount: environmentCheck.invalidCount,
      missingEnvironmentVariableCount: environmentCheck.missingCount,
      uptimeSeconds: Math.round(process.uptime()),
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    },
    {
      status: isReady ? 200 : 503,
    }
  );
};
