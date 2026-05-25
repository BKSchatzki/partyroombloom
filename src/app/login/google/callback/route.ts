import { OAuth2RequestError } from 'arctic';
import { Prisma } from '@prisma/client';
import { cookies } from 'next/headers';

import { createSession, getGoogleClient, setSessionCookie } from '@/lib/auth';
import { prisma as db } from '@/lib/prisma';
import { redirectNoStore, responseNoStore } from '@/lib/responses';
import { GoogleUserInfoSchema } from '@/lib/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GOOGLE_OAUTH_STATE_COOKIE = 'google_oauth_state';
const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE = 'code_verifier';
const GOOGLE_USERINFO_TIMEOUT_MS = 10_000;

type GoogleUserInfo = ReturnType<(typeof GoogleUserInfoSchema)['parse']>;
type CallbackStage =
  | 'token_exchange'
  | 'user_info_fetch'
  | 'user_info_parse'
  | 'user_persistence'
  | 'session_creation';

const expireGoogleOAuthCookie = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  name: string
) => {
  cookieStore.set(name, '', {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 0,
    sameSite: 'lax',
  });
};

const expireGoogleOAuthCookies = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  expireGoogleOAuthCookie(cookieStore, GOOGLE_OAUTH_STATE_COOKIE);
  expireGoogleOAuthCookie(cookieStore, GOOGLE_OAUTH_CODE_VERIFIER_COOKIE);
};

const getPrismaErrorTargets = (error: Prisma.PrismaClientKnownRequestError) => {
  const target = error.meta?.target;
  return Array.isArray(target)
    ? target.filter((value): value is string => typeof value === 'string')
    : [];
};

const isPrismaUniqueConstraintError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
};

const hasPrismaErrorTarget = (targets: string[], field: string) => {
  return targets.some((target) => target === field || target.includes(field));
};

const logCallbackError = (stage: CallbackStage, error: unknown) => {
  if (error instanceof OAuth2RequestError) {
    console.error('Google OAuth callback failed:', {
      stage,
      code: error.code,
      description: error.description,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Google OAuth callback failed:', {
      stage,
      code: error.code,
      target: getPrismaErrorTargets(error),
    });
    return;
  }

  if (error instanceof Error) {
    console.error('Google OAuth callback failed:', {
      stage,
      name: error.name,
      message: error.message,
    });
    return;
  }

  console.error('Google OAuth callback failed:', { stage, error });
};

const persistGoogleUser = async (googleUser: GoogleUserInfo) => {
  const profileData = {
    email: googleUser.email,
    name: googleUser.name ?? null,
    picture: googleUser.picture ?? null,
  };

  const existingUser = await db.user.findUnique({
    where: { googleId: googleUser.sub },
    select: { id: true },
  });

  if (existingUser) {
    const user = await db.user.update({
      where: { id: existingUser.id },
      data: profileData,
      select: { id: true },
    });

    return { isNewUser: false, user };
  }

  try {
    const user = await db.user.create({
      data: {
        ...profileData,
        googleId: googleUser.sub,
        chatTokens: 50,
      },
      select: { id: true },
    });

    return { isNewUser: true, user };
  } catch (error) {
    if (!isPrismaUniqueConstraintError(error)) {
      throw error;
    }

    const targets = getPrismaErrorTargets(error);
    if (hasPrismaErrorTarget(targets, 'googleId')) {
      const user = await db.user.update({
        where: { googleId: googleUser.sub },
        data: profileData,
        select: { id: true },
      });

      return { isNewUser: false, user };
    }

    if (hasPrismaErrorTarget(targets, 'email') && googleUser.email_verified) {
      const userByEmail = await db.user.findFirst({
        where: { email: googleUser.email },
        select: { id: true },
      });

      if (userByEmail) {
        const user = await db.user.update({
          where: { id: userByEmail.id },
          data: {
            ...profileData,
            googleId: googleUser.sub,
          },
          select: { id: true },
        });

        return { isNewUser: false, user };
      }
    }

    throw error;
  }
};

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieStore = await cookies();
  const storedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value ?? null;
  const storedCodeVerifier = cookieStore.get(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE)?.value ?? null;
  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    expireGoogleOAuthCookies(cookieStore);
    return responseNoStore('Invalid state or missing code', { status: 400 });
  }

  expireGoogleOAuthCookies(cookieStore);

  let stage: CallbackStage = 'token_exchange';
  try {
    const tokens = await getGoogleClient().validateAuthorizationCode(code, storedCodeVerifier);
    const accessToken = tokens.accessToken();
    stage = 'user_info_fetch';
    const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(GOOGLE_USERINFO_TIMEOUT_MS),
    });

    if (!googleUserResponse.ok) {
      console.error('Google user info fetch failed:', { status: googleUserResponse.status });
      return responseNoStore('Google profile service error', { status: 502 });
    }

    stage = 'user_info_parse';
    const parsedGoogleUser = GoogleUserInfoSchema.safeParse(await googleUserResponse.json());
    if (!parsedGoogleUser.success) {
      console.error(
        'Google user info response failed validation:',
        parsedGoogleUser.error.flatten()
      );
      return responseNoStore('Invalid Google user profile', { status: 502 });
    }
    const googleUser = parsedGoogleUser.data;
    stage = 'user_persistence';
    const { isNewUser, user } = await persistGoogleUser(googleUser);

    stage = 'session_creation';
    const session = await createSession(user.id);
    await setSessionCookie(session.id, session.expiresAt);

    return redirectNoStore(isNewUser ? '/outline/tutorial' : '/overview');
  } catch (e) {
    logCallbackError(stage, e);
    if (e instanceof OAuth2RequestError) {
      return responseNoStore('Invalid code or request', { status: 400 });
    }
    if (isPrismaUniqueConstraintError(e)) {
      return responseNoStore('Account conflict', { status: 409 });
    }
    if (stage === 'token_exchange' || stage === 'user_info_fetch' || stage === 'user_info_parse') {
      return responseNoStore('Google OAuth service error', { status: 502 });
    }
    return responseNoStore('Internal server error', { status: 500 });
  }
}
