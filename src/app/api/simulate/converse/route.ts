import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { validateRequest } from '@/lib/auth';
import { getStructuredResponse } from '@/lib/openaiClient';
import { prisma } from '@/lib/prisma';

/* Service for:
  - Passing user inputs to completions API
  - Decrementing user chatToken column upon use of completions API
*/
export const POST = async (req: NextRequest) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user || user.chatTokens <= 0) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Get user response and existing conversation, throwing error if input not found
    const { input, conversation } = await req.json();
    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }
    // Calculate tokenCost as 1 per 10 exchanges
    const tokenCost = Math.ceil(conversation.length / 20);
    // Call completions helper function, decrementing user chat token count by tokenCost
    const updatedConversation = await getStructuredResponse(input, conversation);
    const updatedTokenCount = user.chatTokens - tokenCost;
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        chatTokens: updatedTokenCount,
      },
    });
    // Return updated conversation and user with new token count
    const response = { conversation: updatedConversation, user: updatedUser };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
