import { NextRequest, NextResponse } from 'next/server';

import { readJsonBody } from '@/lib/api';
import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateConversationPayloadSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

/* Service for:
  - Creating new conversation entries
*/
export const POST = async (req: NextRequest) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Insert conversation from body into table and associate with outline and user
    const body = await readJsonBody(req);
    if (body.response) {
      return body.response;
    }

    const parsedPayload = CreateConversationPayloadSchema.safeParse(body.data);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          message: 'Invalid simulation payload',
          errors: parsedPayload.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { conversation, outline } = parsedPayload.data;
    if (outline.id === null) {
      return NextResponse.json({ message: 'Outline ID is required' }, { status: 400 });
    }

    const ownedOutline = await prisma.outline.findUnique({
      where: {
        id: outline.id,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!ownedOutline) {
      return NextResponse.json({ message: 'Outline not found' }, { status: 404 });
    }

    const createdConversation = await prisma.conversation.create({
      data: {
        outlineId: outline.id,
        userId: user.id,
        thread: conversation,
      },
    });
    // Return id of created conversation
    return NextResponse.json({ id: createdConversation.id }, { status: 200 });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json({ message: 'Error saving conversation' }, { status: 500 });
  }
};
