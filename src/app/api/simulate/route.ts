import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type {
  Conversation,
  Outline,
} from '@/lib/types';

type ExistingOutline = Omit<Outline, 'id'> & {
  id: number;
};

export const POST = async (req: NextRequest) => {
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const conversation: Conversation = body.conversation;
    const outline: ExistingOutline = body.outline;
    const createdConversation = await prisma.conversation.create({
      data: {
        outlineId: outline.id ?? null,
        userId: user.id,
        thread: conversation ?? '',
      },
    });

    return Response.json({ id: createdConversation.id }, { status: 200 });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return Response.json({ message: 'Error saving conversation' }, { status: 500 });
  }
};
