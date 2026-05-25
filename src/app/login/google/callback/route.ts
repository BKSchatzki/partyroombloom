import { OAuth2RequestError } from 'arctic';
import { cookies } from 'next/headers';

import { createSession, getGoogleClient, setSessionCookie } from '@/lib/auth';
import { prisma as db } from '@/lib/prisma';
import { GoogleUserInfoSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

const GOOGLE_OAUTH_STATE_COOKIE = 'google_oauth_state';
const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE = 'code_verifier';

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

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieStore = await cookies();
  const storedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value ?? null;
  const storedCodeVerifier = cookieStore.get(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE)?.value ?? null;
  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    expireGoogleOAuthCookies(cookieStore);
    return new Response('Invalid state or missing code', { status: 400 });
  }

  expireGoogleOAuthCookies(cookieStore);

  try {
    const tokens = await getGoogleClient().validateAuthorizationCode(code, storedCodeVerifier);
    const accessToken = tokens.accessToken();
    const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!googleUserResponse.ok) {
      throw new Error(`Google user info fetch failed with status ${googleUserResponse.status}.`);
    }

    const parsedGoogleUser = GoogleUserInfoSchema.safeParse(await googleUserResponse.json());
    if (!parsedGoogleUser.success) {
      console.error(
        'Google user info response failed validation:',
        parsedGoogleUser.error.flatten()
      );
      return new Response('Invalid Google user profile', { status: 502 });
    }
    const googleUser = parsedGoogleUser.data;
    const existingUser = await db.user.findUnique({
      where: { googleId: googleUser.sub },
    });

    if (existingUser) {
      const session = await createSession(existingUser.id);
      await setSessionCookie(session.id, session.expiresAt);
      return new Response(null, {
        status: 302,
        headers: { Location: '/overview' },
      });
    }

    const newUser = await db.user.create({
      data: {
        googleId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name ?? null,
        picture: googleUser.picture ?? null,
        chatTokens: 50,
      },
    });

    const session = await createSession(newUser.id);
    await setSessionCookie(session.id, session.expiresAt);

    return new Response(null, {
      status: 302,
      headers: { Location: '/outline/tutorial' },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response('Invalid code or request', { status: 400 });
    }
    console.error('Google OAuth callback failed:', e);
    return new Response('Internal server error', { status: 500 });
  }
}
