import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Conversation } from '@/lib/types';

export const GET = async (req: NextRequest, { params }: { params: { simulateId: string } }) => {
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const simulateId = parseInt(params.simulateId);

    if (isNaN(simulateId)) {
      return Response.json({ message: 'Invalid simulate ID' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: simulateId,
        userId: user.id,
      },
    });

    if (!conversation) {
      return Response.json({ message: 'Conversation not found' }, { status: 404 });
    }

    return Response.json(conversation.thread, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return Response.json({ message: 'Error fetching conversation' }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { simulateId: string } }) => {
  //
};

export const DELETE = async (req: NextRequest, { params }: { params: { outlineId: string } }) => {
  //
};
