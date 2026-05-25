import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';

import { getGoogleClient } from '@/lib/auth';

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  let url: URL;

  try {
    url = getGoogleClient().createAuthorizationURL(state, codeVerifier, [
      'openid',
      'email',
      'profile',
    ]);
  } catch (error) {
    console.error('Google OAuth configuration error:', error);
    return new Response('Google OAuth is not configured', { status: 500 });
  }

  const cookieStore = await cookies();
  cookieStore.set('google_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });
  cookieStore.set('code_verifier', codeVerifier, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return Response.redirect(url);
}
