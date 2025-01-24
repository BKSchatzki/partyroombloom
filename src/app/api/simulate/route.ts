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

// Create type for only id field in Outline
type ExistingOutline = Omit<Outline, 'id'> & {
  id: number;
};

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
    // Return id of created conversation
    return NextResponse.json({ id: createdConversation.id }, { status: 200 });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json({ message: 'Error saving conversation' }, { status: 500 });
  }
};
