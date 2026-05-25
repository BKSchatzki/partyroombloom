import { type NextRequest } from 'next/server';

import { jsonNoStore, validateSameOriginRequest } from '@/lib/api';
import { deleteSessionCookie, invalidateSession, toClientUser, validateRequest } from '@/lib/auth';
import type { SessionPayload } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 5;

export const GET = async () => {
  const { user } = await validateRequest();

  return jsonNoStore<SessionPayload>({
    user: user ? toClientUser(user) : null,
  });
};

export const DELETE = async (request: NextRequest) => {
  const originResponse = validateSameOriginRequest(request);
  if (originResponse) {
    return originResponse;
  }

  const { session } = await validateRequest();
  if (session) {
    await invalidateSession(session.id);
  }

  await deleteSessionCookie();

  return jsonNoStore<SessionPayload>({ user: null });
};
