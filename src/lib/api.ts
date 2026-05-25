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

export const readJsonBody = async (request: NextRequest): Promise<JsonBodyResult> => {
  try {
    return { data: await request.json() };
  } catch {
    return {
      response: NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 }),
    };
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
