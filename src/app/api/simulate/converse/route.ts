import { NextRequest, NextResponse } from 'next/server';

import { validateRequest } from '@/lib/auth';
import { getStructuredResponse } from '@/lib/openaiClient';
import { prisma } from '@/lib/prisma';
import { ConversationSchema, OutlineTreeSchema, UserMessageContentSchema } from '@/lib/schemas';

const SimulateInputSchema = OutlineTreeSchema.or(UserMessageContentSchema);

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
    const parsedInput = SimulateInputSchema.safeParse(input);
    const parsedConversation = ConversationSchema.safeParse(conversation);

    if (!parsedInput.success || !parsedConversation.success) {
      return NextResponse.json(
        {
          message: 'Invalid simulation payload',
          errors: {
            input: parsedInput.success ? null : parsedInput.error.flatten(),
            conversation: parsedConversation.success ? null : parsedConversation.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const validatedConversation = parsedConversation.data;
    // Calculate tokenCost as 1 per 10 exchanges
    const tokenCost = Math.max(1, Math.ceil(validatedConversation.length / 20));
    if (tokenCost > user.chatTokens) {
      return NextResponse.json({ message: 'Insufficient chat tokens' }, { status: 402 });
    }

    // Call completions helper function, decrementing user chat token count by tokenCost
    const updatedConversation = await getStructuredResponse(
      parsedInput.data,
      validatedConversation
    );
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        chatTokens: {
          decrement: tokenCost,
        },
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
