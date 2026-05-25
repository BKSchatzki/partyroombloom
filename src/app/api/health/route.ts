import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

export const GET = async () => {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'ok',
        checks: {
          database: 'ok',
        },
        uptimeSeconds: Math.round(process.uptime()),
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: noStoreHeaders,
      }
    );
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        checks: {
          database: 'error',
        },
        uptimeSeconds: Math.round(process.uptime()),
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: noStoreHeaders,
      }
    );
  }
};
