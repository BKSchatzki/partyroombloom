import 'server-only';

import { NextResponse } from 'next/server';

const NO_STORE_CACHE_CONTROL = 'no-store';
type RedirectStatus = 301 | 302 | 303 | 307 | 308;

const withNoStoreHeaders = (init: ResponseInit = {}) => {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', NO_STORE_CACHE_CONTROL);

  return {
    ...init,
    headers,
  };
};

export const responseNoStore = (body: BodyInit | null = null, init: ResponseInit = {}) => {
  return new Response(body, withNoStoreHeaders(init));
};

export const redirectNoStore = (url: string | URL, status: RedirectStatus = 302) => {
  return responseNoStore(null, {
    status,
    headers: {
      Location: url.toString(),
    },
  });
};

export const jsonNoStore = <T>(body: T, init: ResponseInit = {}) => {
  return NextResponse.json(body, {
    ...withNoStoreHeaders(init),
  });
};
