import { NextRequest } from 'next/server';
import type { NextResponse } from 'next/server';

import { jsonNoStore, readJsonBody, validateSameOriginRequest } from '@/lib/api';
import { validateRequest } from '@/lib/auth';
import { getStructuredResponse } from '@/lib/openaiClient';
import { prisma } from '@/lib/prisma';
import { SimulateConversePayloadSchema } from '@/lib/schemas';
import type { Outline } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Service for:
  - Passing user inputs to completions API
  - Decrementing user chatToken column upon use of completions API
  - Persisting the updated conversation thread after a successful AI response
*/
export const POST = async (req: NextRequest) => {
  const originResponse = validateSameOriginRequest(req);
  if (originResponse) {
    return originResponse;
  }

  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return jsonNoStore({ message: 'Unauthorized' }, { status: 401 });
  }
  if (user.chatTokens <= 0) {
    return jsonNoStore({ message: 'Insufficient chat tokens' }, { status: 402 });
  }
  try {
    // Get user response and existing conversation, throwing error if input not found
    const body = await readJsonBody(req);
    if (body.response) {
      return body.response;
    }

    const parsedPayload = SimulateConversePayloadSchema.safeParse(body.data);
    if (!parsedPayload.success) {
      return jsonNoStore(
        {
          message: 'Invalid simulation payload',
          errors: parsedPayload.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { simulateId, input, conversation: validatedConversation } = parsedPayload.data;
    const outlineId = getOutlineId(input);
    const persistenceTarget = await resolvePersistenceTarget({
      simulateId,
      outlineId,
      userId: user.id,
    });
    if (!persistenceTarget.ok) {
      return persistenceTarget.response;
    }

    // Calculate tokenCost as 1 per 10 exchanges
    const tokenCost = Math.max(1, Math.ceil(validatedConversation.length / 20));
    if (tokenCost > user.chatTokens) {
      return jsonNoStore({ message: 'Insufficient chat tokens' }, { status: 402 });
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
      return jsonNoStore({ message: 'Insufficient chat tokens' }, { status: 402 });
    }

    try {
      // Call completions helper function after atomically reserving the token cost.
      const updatedConversation = await getStructuredResponse(input, validatedConversation);
      const { conversationId, updatedUser } = await prisma.$transaction(async (tx) => {
        const persistedConversation =
          persistenceTarget.kind === 'conversation'
            ? await tx.conversation.update({
                where: {
                  id: persistenceTarget.conversationId,
                  userId: user.id,
                },
                data: {
                  thread: updatedConversation,
                },
                select: {
                  id: true,
                },
              })
            : await tx.conversation.create({
                data: {
                  outlineId: persistenceTarget.outlineId,
                  userId: user.id,
                  thread: updatedConversation,
                },
                select: {
                  id: true,
                },
              });

        const updatedUser = await tx.user.findUnique({
          where: {
            id: user.id,
          },
          select: {
            chatTokens: true,
          },
        });

        return {
          conversationId: persistedConversation.id,
          updatedUser,
        };
      });

      if (!updatedUser) {
        throw new Error('Authenticated user could not be found after token update.');
      }

      // Return updated conversation and user with new token count
      const response = { id: conversationId, conversation: updatedConversation, user: updatedUser };
      return jsonNoStore(response, { status: 200 });
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
    return jsonNoStore({ error: 'Internal Server Error' }, { status: 500 });
  }
};

const getOutlineId = (input: unknown) => {
  if (!isOutlineInput(input)) {
    return null;
  }

  return input.id;
};

const isOutlineInput = (input: unknown): input is Outline => {
  return typeof input === 'object' && input !== null && 'elements' in input;
};

type PersistenceTargetResult =
  | {
      ok: true;
      kind: 'conversation';
      conversationId: number;
    }
  | {
      ok: true;
      kind: 'outline';
      outlineId: number;
    }
  | {
      ok: false;
      response: NextResponse;
    };

const resolvePersistenceTarget = async ({
  simulateId,
  outlineId,
  userId,
}: {
  simulateId: number | undefined;
  outlineId: number | null;
  userId: number;
}): Promise<PersistenceTargetResult> => {
  if (simulateId !== undefined) {
    const ownedConversation = await prisma.conversation.findUnique({
      where: {
        id: simulateId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!ownedConversation) {
      return {
        ok: false,
        response: jsonNoStore({ message: 'Conversation not found' }, { status: 404 }),
      };
    }

    return {
      ok: true,
      kind: 'conversation',
      conversationId: ownedConversation.id,
    };
  }

  if (outlineId === null) {
    return {
      ok: false,
      response: jsonNoStore({ message: 'Outline ID is required' }, { status: 400 }),
    };
  }

  const ownedOutline = await prisma.outline.findUnique({
    where: {
      id: outlineId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!ownedOutline) {
    return {
      ok: false,
      response: jsonNoStore({ message: 'Outline not found' }, { status: 404 }),
    };
  }

  return {
    ok: true,
    kind: 'outline',
    outlineId: ownedOutline.id,
  };
};
