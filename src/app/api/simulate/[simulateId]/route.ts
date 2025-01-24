import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Conversation } from '@/lib/types';

/* Service for:
  - Getting conversation from URL param and its associated user
*/
export const GET = async (req: NextRequest, { params }: { params: { simulateId: string } }) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Convert simulateId string from params into number
    const simulateId = parseInt(params.simulateId);
    if (isNaN(simulateId)) {
      return NextResponse.json({ message: 'Invalid simulate ID' }, { status: 400 });
    }
    // Find specific simulation matching param and userId, aborting if no conversation found
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: simulateId,
        userId: user.id,
      },
    });
    if (!conversation) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }
    // Return found conversation and its owner
    const response = { conversation: conversation.thread, user: user };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ message: 'Error fetching conversation' }, { status: 500 });
  }
};

/* Service for:
  - Updating conversation of id matching URL param and matching current user with data from body
*/
export const PUT = async (req: NextRequest, { params }: { params: { simulateId: string } }) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Find specific simulation matching param and userId, aborting if no conversation found
    const simulateId = parseInt(params.simulateId);
    if (isNaN(simulateId)) {
      return NextResponse.json({ message: 'Invalid simulate ID' }, { status: 400 });
    }
    // Update existing conversation matching current user with data from body
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
    // Return id of updated conversation
    return NextResponse.json({ id: updatedConversation.id }, { status: 200 });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ message: 'Error updating conversation' }, { status: 500 });
  }
};

/* Service for:
  - Deleting conversation of id matching URL param matching current user
*/
export const DELETE = async (req: NextRequest, { params }: { params: { simulateId: string } }) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Find specific simulation matching param and userId, aborting if no conversation found
    const simulateId = parseInt(params.simulateId);
    if (isNaN(simulateId)) {
      return NextResponse.json({ message: 'Invalid simulate ID' }, { status: 400 });
    }
    // Delete conversation matching current user
    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: simulateId,
        userId: user.id,
      },
    });
    // Return id of deleted conversation
    return NextResponse.json({ id: deletedConversation.id }, { status: 200 });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ message: 'Error deleting conversation' }, { status: 500 });
  }
};
