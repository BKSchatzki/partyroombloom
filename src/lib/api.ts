import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type JsonBodyResult =
  | {
      data: unknown;
      response?: never;
    }
  | {
      data?: never;
      response: NextResponse;
    };

const MAX_JSON_BODY_BYTES = 4 * 1024 * 1024;

const hasJsonContentType = (contentType: string | null) => {
  const mimeType = contentType?.split(';')[0].trim().toLowerCase();
  return mimeType === 'application/json' || mimeType?.endsWith('+json') === true;
};

const parseContentLength = (contentLength: string | null) => {
  if (!contentLength) {
    return null;
  }

  const parsedValue = Number(contentLength);
  return Number.isSafeInteger(parsedValue) && parsedValue >= 0 ? parsedValue : null;
};

export const readJsonBody = async (request: NextRequest): Promise<JsonBodyResult> => {
  if (!hasJsonContentType(request.headers.get('content-type'))) {
    return {
      response: NextResponse.json(
        { message: 'Content-Type must be application/json' },
        { status: 415 }
      ),
    };
  }

  const contentLength = parseContentLength(request.headers.get('content-length'));
  if (contentLength !== null && contentLength > MAX_JSON_BODY_BYTES) {
    return {
      response: NextResponse.json({ message: 'JSON body is too large' }, { status: 413 }),
    };
  }

  if (!request.body) {
    return {
      response: NextResponse.json({ message: 'Missing JSON body' }, { status: 400 }),
    };
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let receivedBytes = 0;
  let rawBody = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      receivedBytes += value.byteLength;
      if (receivedBytes > MAX_JSON_BODY_BYTES) {
        await reader.cancel();
        return {
          response: NextResponse.json({ message: 'JSON body is too large' }, { status: 413 }),
        };
      }

      rawBody += decoder.decode(value, { stream: true });
    }

    rawBody += decoder.decode();

    return { data: JSON.parse(rawBody) };
  } catch {
    return {
      response: NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 }),
    };
  } finally {
    reader.releaseLock();
  }
};

export const parsePositiveInteger = (value: string): number | null => {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
};

export const isPrismaRecordNotFoundError = (error: unknown) => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
};
