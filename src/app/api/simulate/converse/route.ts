import { NextRequest, NextResponse } from 'next/server';

import { readJsonBody } from '@/lib/api';
import { validateRequest } from '@/lib/auth';
import { getStructuredResponse } from '@/lib/openaiClient';
import { prisma } from '@/lib/prisma';
import { SimulateConversePayloadSchema } from '@/lib/schemas';

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
    const body = await readJsonBody(req);
    if (body.response) {
      return body.response;
    }

    const parsedPayload = SimulateConversePayloadSchema.safeParse(body.data);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          message: 'Invalid simulation payload',
          errors: parsedPayload.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { input, conversation: validatedConversation } = parsedPayload.data;
    // Calculate tokenCost as 1 per 10 exchanges
    const tokenCost = Math.max(1, Math.ceil(validatedConversation.length / 20));
    if (tokenCost > user.chatTokens) {
      return NextResponse.json({ message: 'Insufficient chat tokens' }, { status: 402 });
    }

    const tokenReservation = await prisma.user.updateMany({
      where: {
        id: user.id,
        chatTokens: {
          gte: tokenCost,
        },
      },
      data: {
        chatTokens: {
          decrement: tokenCost,
        },
      },
    });

    if (tokenReservation.count !== 1) {
      return NextResponse.json({ message: 'Insufficient chat tokens' }, { status: 402 });
    }

    try {
      // Call completions helper function after atomically reserving the token cost.
      const updatedConversation = await getStructuredResponse(input, validatedConversation);
      const updatedUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!updatedUser) {
        throw new Error('Authenticated user could not be found after token update.');
      }

      // Return updated conversation and user with new token count
      const response = { conversation: updatedConversation, user: updatedUser };
      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      await prisma.user
        .update({
          where: {
            id: user.id,
          },
          data: {
            chatTokens: {
              increment: tokenCost,
            },
          },
        })
        .catch((refundError) => {
          console.error('Failed to refund chat tokens after simulation error:', refundError);
        });

      throw error;
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
