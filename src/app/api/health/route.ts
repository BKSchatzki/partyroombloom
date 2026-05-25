import { NextResponse } from 'next/server';

import { getRequiredEnvStatus } from '@/lib/env';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

export const GET = async () => {
  const startedAt = Date.now();
  const environmentCheck = getRequiredEnvStatus();
  let databaseCheck: 'ok' | 'error' = 'ok';

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    databaseCheck = 'error';
  }

  const isReady = databaseCheck === 'ok' && environmentCheck.configured;

  return NextResponse.json(
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
      headers: noStoreHeaders,
    }
  );
};
