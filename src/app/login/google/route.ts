import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';

import { google } from '@/lib/auth';

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const googleAuthScopes = ['openid', 'email', 'profile'];
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: googleAuthScopes,
  });

  cookies().set('google_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });
  cookies().set('code_verifier', codeVerifier, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return Response.redirect(url);
}
