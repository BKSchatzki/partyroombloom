import { NextRequest } from 'next/server';

import { jsonNoStore, readJsonBody, validateSameOriginRequest } from '@/lib/api';
import { validateRequest } from '@/lib/auth';
import { buildTreeFromFlat, flattenTreeForPersistence } from '@/lib/outlineTransformers';
import { toElementWriteData, toFlatOutlineElement } from '@/lib/outlinePersistence';
import { prisma } from '@/lib/prisma';
import { OutlinePayloadSchema } from '@/lib/schemas';
import type { Outline } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Service for:
  - Getting all outlines associated with current user
  - Formatting outlines to match frontend types
*/
export const GET = async (req: NextRequest) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return jsonNoStore({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Find all outlines matching current user ordered by update time, ordering each's elements and conversations by creation time
    const outlines = await prisma.outline.findMany({
      where: {
        userId: user.id,
      },
      include: {
        elements: {
          orderBy: {
            userCreatedAt: 'asc',
          },
        },
        conversations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    // Format outlines to match frontend types
    const formattedOutlinesList = outlines.map((outline) => ({
      id: outline.id,
      title: outline.title ?? '',
      description: outline.description ?? '',
      goal: outline.goal ?? '',
      comments: outline.comments ?? '',
      elements: buildTreeFromFlat(outline.elements.map((element) => toFlatOutlineElement(element))),
      conversations: outline.conversations.map((conversation) => ({
        id: conversation.id,
        createdAt: conversation.createdAt.toISOString(),
      })),
    }));
    // Return formatted outlines
    return jsonNoStore(formattedOutlinesList, { status: 200 });
  } catch (error) {
    return jsonNoStore({ message: 'Error fetching outlines' }, { status: 500 });
  }
};

/* Service for:
  - Creating new outline entries
  - Creating new element entries
  - Ensuring that element relations are preserved in database by inserting in hierarchical order
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
  try {
    // Insert outline info from body into table and associate with user
    const body = await readJsonBody(req);
    if (body.response) {
      return body.response;
    }

    const parsedPayload = OutlinePayloadSchema.safeParse(body.data);
    if (!parsedPayload.success) {
      return jsonNoStore(
        { message: 'Invalid outline payload', errors: parsedPayload.error.flatten() },
        { status: 400 }
      );
    }
    const outline: Outline = parsedPayload.data.payload;
    const flattenedElements = flattenTreeForPersistence(outline.elements);

    const createdOutline = await prisma.$transaction(async (tx) => {
      const outlineRecord = await tx.outline.create({
        data: {
          userId: user.id,
          title: outline.title ?? '',
          description: outline.description ?? '',
          goal: outline.goal ?? '',
          comments: outline.comments ?? '',
        },
      });

      for (const element of flattenedElements) {
        await tx.element.create({
          data: {
            id: element.id,
            outlineId: outlineRecord.id,
            userId: user.id,
            ...toElementWriteData(element),
          },
        });
      }

      return outlineRecord;
    });
    // Return id of created outline
    return jsonNoStore({ id: createdOutline.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving outline:', error);
    return jsonNoStore({ message: 'Error saving outline' }, { status: 500 });
  }
};
