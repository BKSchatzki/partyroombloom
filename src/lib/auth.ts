import 'server-only';

import { Google } from 'arctic';
import { cookies } from 'next/headers';

import { getRequiredEnv } from '@/lib/env';
import { prisma } from '@/lib/prisma';

let googleClient: Google | null = null;

export const getGoogleClient = () => {
  googleClient ??= new Google(
    getRequiredEnv('AUTH_GOOGLE_ID'),
    getRequiredEnv('AUTH_GOOGLE_SECRET'),
    getRequiredEnv('AUTH_GOOGLE_REDIRECT_URI')
  );

  return googleClient;
};

const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
  fresh: boolean;
}

export interface User {
  id: number;
  googleId: string;
  email: string;
  name: string | null;
  picture: string | null;
  chatTokens: number;
}

export type ClientUser = Pick<User, 'chatTokens'>;

export const toClientUser = (user: User): ClientUser => ({
  chatTokens: user.chatTokens,
});

const encodeBase32LowerCaseNoPadding = (bytes: Uint8Array): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
  let result = '';
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < bytes.length; i++) {
    buffer = (buffer << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += alphabet[(buffer >> bits) & 0x1f];
    }
  }
  if (bits > 0) {
    result += alphabet[(buffer << (5 - bits)) & 0x1f];
  }
  return result;
};

function generateSessionId(): string {
  const bytes = new Uint8Array(25);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(userId: number): Promise<Session> {
  const id = generateSessionId();
  const expiresAt = new Date(Date.now() + 1000 * SESSION_EXPIRY_SECONDS);
  await prisma.session.create({
    data: { id, userId, expiresAt },
  });
  return { id, userId, expiresAt, fresh: true };
}

async function validateSessionFromDb(
  sessionId: string
): Promise<{ user: User; session: Session } | null> {
  const row = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  if (!row) return null;

  const now = Date.now();
  if (now >= row.expiresAt.getTime()) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
    return null;
  }

  let fresh = false;
  const halflife = (1000 * SESSION_EXPIRY_SECONDS) / 2;
  if (now >= row.expiresAt.getTime() - halflife) {
    const newExpiresAt = new Date(Date.now() + 1000 * SESSION_EXPIRY_SECONDS);
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: newExpiresAt },
    });
    row.expiresAt = newExpiresAt;
    fresh = true;
  }

  const user: User = {
    id: row.user.id,
    googleId: row.user.googleId,
    email: row.user.email,
    name: row.user.name,
    picture: row.user.picture,
    chatTokens: row.user.chatTokens,
  };

  const session: Session = {
    id: row.id,
    userId: row.userId,
    expiresAt: row.expiresAt,
    fresh,
  };

  return { user, session };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id: sessionId } });
}

export async function setSessionCookie(sessionId: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
}

const retryOperation = async <T>(
  operation: () => Promise<T>,
  key: string,
  retryLimit = 3,
  retryInterval = 1000
) => {
  let lastError;
  for (let i = 0; i < retryLimit; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Retry ${key} operation: Attempt ${i + 1} of ${retryLimit}`);
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
  throw lastError;
};

export const validateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await retryOperation(
    () => validateSessionFromDb(sessionId),
    'Validate Session',
    3,
    1000
  );

  if (!result) {
    try {
      await deleteSessionCookie();
    } catch {}
    return { user: null, session: null };
  }

  try {
    if (result.session.fresh) {
      await setSessionCookie(result.session.id, result.session.expiresAt);
    }
  } catch {}

  return result;
};
