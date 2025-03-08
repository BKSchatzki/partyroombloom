import { cache } from 'react';

import { Google } from 'arctic';
import type { Session, User } from 'lucia';
import { Lucia } from 'lucia';
import { cookies } from 'next/headers';

import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';

export const google = new Google(
  process.env.AUTH_GOOGLE_ID!,
  process.env.AUTH_GOOGLE_SECRET!,
  process.env.AUTH_GOOGLE_REDIRECT_URI!
);

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      googleId: attributes.google_id,
      email: attributes.email,
      name: attributes.name,
      picture: attributes.picture,
      chatTokens: attributes.chatTokens,
    };
  },
});

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  google_id: string;
  email: string;
  name?: string;
  picture?: string;
  chatTokens: number;
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

export const validateRequest = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await retryOperation(
      () => lucia.validateSession(sessionId),
      'Lucia Validate Session',
      3,
      1000
    );
    // Next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch {}
    return result;
  }
);
