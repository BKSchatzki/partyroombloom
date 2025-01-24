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
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const simulateId = parseInt(params.simulateId);

    if (isNaN(simulateId)) {
      return NextResponse.json({ message: 'Invalid simulate ID' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: simulateId,
        userId: user.id,
      },
    });

    if (!conversation) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    const response = { conversation: conversation.thread, user: user };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ message: 'Error fetching conversation' }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { simulateId: string } }) => {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const simulateId = parseInt(params.simulateId);

    if (isNaN(simulateId)) {
      return NextResponse.json({ message: 'Invalid simulate ID' }, { status: 400 });
    }

    const body = await req.json();
    const conversation: Conversation = body.conversation;
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: simulateId,
        userId: user.id,
      },
      data: {
        thread: conversation,
      },
    });

    return NextResponse.json(updatedConversation, { status: 200 });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ message: 'Error updating conversation' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { simulateId: string } }) => {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const simulateId = parseInt(params.simulateId);

    if (isNaN(simulateId)) {
      return NextResponse.json({ message: 'Invalid simulate ID' }, { status: 400 });
    }

    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: simulateId,
        userId: user.id,
      },
    });

    return NextResponse.json(deletedConversation, { status: 200 });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ message: 'Error deleting conversation' }, { status: 500 });
  }
};
