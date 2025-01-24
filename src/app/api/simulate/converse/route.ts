import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { validateRequest } from '@/lib/auth';
import { getStructuredResponse } from '@/lib/openaiClient';
import { prisma } from '@/lib/prisma';

export const POST = async (req: NextRequest) => {
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { input, conversation } = await req.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const updatedConversation = await getStructuredResponse(input, conversation);
    const updatedTokenCount = user.chatTokens - 1;
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        chatTokens: updatedTokenCount,
      },
    });
    const response = { conversation: updatedConversation, user: updatedUser };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
