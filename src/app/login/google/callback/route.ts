import { OAuth2RequestError } from 'arctic';
import { cookies } from 'next/headers';

import {
  google,
  lucia,
} from '@/lib/auth';
import { prisma as db } from '@/lib/prisma';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('google_oauth_state')?.value ?? null;
  const storedCodeVerifier = cookies().get('code_verifier')?.value ?? null;

  // Validate state and code
  if (!code || !state || !storedState || state !== storedState) {
    return new Response('Invalid state or missing code', { status: 400 });
  }

  try {
    // Validate authorization code and get tokens
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier!);

    // Fetch Google user info
    const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Check if the response was successful
    if (!googleUserResponse.ok) {
      const errorDetails = await googleUserResponse.json();
      throw new Error(`Google user info fetch failed: ${errorDetails.error}`);
    }

    const googleUser: GoogleUser = await googleUserResponse.json();

    // Check if the user already exists
    const existingUser = await db.user.findUnique({
      where: { googleId: googleUser.sub },
    });

    if (existingUser) {
      // Create session for existing user
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    }

    // Create a new user
    await db.user.create({
      data: {
        googleId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
    });

    const newUser = await db.user.findUnique({
      where: { googleId: googleUser.sub },
    });

    // Create session for the new user
    const session = await lucia.createSession(newUser!.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (e) {
    // The specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // Invalid code
      return new Response('Invalid code or request', { status: 400 });
    }
    return new Response('Internal server error', { status: 500 });
  }
}

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
}
