import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { getStructuredResponse } from '@/lib/openaiClient';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const response = await getStructuredResponse(input);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
