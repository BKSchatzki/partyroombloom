import { NextRequest } from 'next/server';

import {
  isPrismaRecordNotFoundError,
  jsonNoStore,
  parsePositiveInteger,
  readJsonBody,
  validateSameOriginRequest,
} from '@/lib/api';
import { toClientUser, validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateConversationPayloadSchema } from '@/lib/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ simulateId: string }>;
};

export const GET = async (req: NextRequest, { params }: RouteContext) => {
  const { user } = await validateRequest();
  if (!user) {
    return jsonNoStore({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { simulateId: simulateIdParam } = await params;
    const simulateId = parsePositiveInteger(simulateIdParam);
    if (simulateId === null) {
      return jsonNoStore({ message: 'Invalid simulate ID' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: simulateId,
        userId: user.id,
      },
    });
    if (!conversation) {
      return jsonNoStore({ message: 'Conversation not found' }, { status: 404 });
    }

    const response = {
      id: conversation.id,
      conversation: conversation.thread,
      user: toClientUser(user),
    };
    return jsonNoStore(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return jsonNoStore({ message: 'Error fetching conversation' }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: RouteContext) => {
  const originResponse = validateSameOriginRequest(req);
  if (originResponse) {
    return originResponse;
  }

  const { user } = await validateRequest();
  if (!user) {
    return jsonNoStore({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { simulateId: simulateIdParam } = await params;
    const simulateId = parsePositiveInteger(simulateIdParam);
    if (simulateId === null) {
      return jsonNoStore({ message: 'Invalid simulate ID' }, { status: 400 });
    }

    const body = await readJsonBody(req);
    if (body.response) {
      return body.response;
    }

    const parsedPayload = UpdateConversationPayloadSchema.safeParse(body.data);
    if (!parsedPayload.success) {
      return jsonNoStore(
        { message: 'Invalid conversation payload', errors: parsedPayload.error.flatten() },
        { status: 400 }
      );
    }
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: simulateId,
        userId: user.id,
      },
      data: {
        thread: parsedPayload.data.conversation,
      },
    });

    return jsonNoStore({ id: updatedConversation.id }, { status: 200 });
  } catch (error) {
    if (isPrismaRecordNotFoundError(error)) {
      return jsonNoStore({ message: 'Conversation not found' }, { status: 404 });
    }

    console.error('Error updating conversation:', error);
    return jsonNoStore({ message: 'Error updating conversation' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: RouteContext) => {
  const originResponse = validateSameOriginRequest(req);
  if (originResponse) {
    return originResponse;
  }

  const { user } = await validateRequest();
  if (!user) {
    return jsonNoStore({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { simulateId: simulateIdParam } = await params;
    const simulateId = parsePositiveInteger(simulateIdParam);
    if (simulateId === null) {
      return jsonNoStore({ message: 'Invalid simulate ID' }, { status: 400 });
    }

    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: simulateId,
        userId: user.id,
      },
    });

    return jsonNoStore({ id: deletedConversation.id }, { status: 200 });
  } catch (error) {
    if (isPrismaRecordNotFoundError(error)) {
      return jsonNoStore({ message: 'Conversation not found' }, { status: 404 });
    }

    console.error('Error deleting conversation:', error);
    return jsonNoStore({ message: 'Error deleting conversation' }, { status: 500 });
  }
};
