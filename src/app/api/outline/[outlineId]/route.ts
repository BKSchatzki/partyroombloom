import { NextRequest } from 'next/server';

import {
  isPrismaRecordNotFoundError,
  jsonNoStore,
  parsePositiveInteger,
  readJsonBody,
  validateSameOriginRequest,
} from '@/lib/api';
import { validateRequest } from '@/lib/auth';
import { buildTreeFromFlat, flattenTreeForPersistence } from '@/lib/outlineTransformers';
import { toElementWriteData, toFlatOutlineElement } from '@/lib/outlinePersistence';
import { prisma } from '@/lib/prisma';
import { OutlinePayloadSchema } from '@/lib/schemas';
import type { Outline } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Service for:
  - Getting outline from URL param and its associated user
  - Formatting outline to match frontend types
*/
type RouteContext = {
  params: Promise<{ outlineId: string }>;
};

export const GET = async (req: NextRequest, { params }: RouteContext) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return jsonNoStore({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Convert outlineId string from params into number
    const { outlineId: outlineIdParam } = await params;
    const outlineId = parsePositiveInteger(outlineIdParam);
    if (outlineId === null) {
      return jsonNoStore({ message: 'Invalid outline ID' }, { status: 400 });
    }
    // Find specific outline matching param and userId, ordering elements by creation time, aborting if no outline found
    const outline = await prisma.outline.findUnique({
      where: {
        id: outlineId,
        userId: user.id,
      },
      include: {
        elements: {
          orderBy: {
            userCreatedAt: 'asc',
          },
        },
      },
    });
    if (!outline) {
      return jsonNoStore({ message: 'Outline not found' }, { status: 404 });
    }
    // Format outline to match frontend types, adding empty array for conversation not included in above query
    const formattedOutline: Outline = {
      id: outline.id,
      title: outline.title ?? '',
      description: outline.description ?? '',
      goal: outline.goal ?? '',
      comments: outline.comments ?? '',
      elements: buildTreeFromFlat(outline.elements.map((element) => toFlatOutlineElement(element))),
      conversations: [],
    };
    // Return formatted outline
    return jsonNoStore(formattedOutline, { status: 200 });
  } catch (error) {
    console.error('Error fetching outline:', error);
    return jsonNoStore({ message: 'Error fetching outline' }, { status: 500 });
  }
};

/* Service for:
  - Updating outline of id matching URL param and matching current user with data from body
*/
export const PUT = async (req: NextRequest, { params }: RouteContext) => {
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
    // Convert outlineId string from params into number
    const { outlineId: outlineIdParam } = await params;
    const outlineId = parsePositiveInteger(outlineIdParam);
    if (outlineId === null) {
      return jsonNoStore({ message: 'Invalid outline ID' }, { status: 400 });
    }
    // Update existing outline matching current user with data from body
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

    const updatedOutline = await prisma.$transaction(async (tx) => {
      const outlineRecord = await tx.outline.update({
        where: {
          id: outlineId,
          userId: user.id,
        },
        data: {
          title: outline.title ?? '',
          description: outline.description ?? '',
          goal: outline.goal ?? '',
          comments: outline.comments ?? '',
        },
      });

      // Delete elements in database for this outline not included in elements from request body.
      const databaseElements = await tx.element.findMany({
        where: {
          outlineId: outlineId,
          userId: user.id,
        },
        select: {
          id: true,
        },
      });
      const existingElementIds = new Set(databaseElements.map((element) => element.id));
      const outlineElementIds = new Set(flattenedElements.map((element) => element.id));
      const idsOfElementsToDelete = databaseElements
        .filter((element) => !outlineElementIds.has(element.id))
        .map((element) => element.id);

      for (const element of flattenedElements) {
        const data = toElementWriteData(element);

        if (existingElementIds.has(element.id)) {
          await tx.element.update({
            where: {
              id: element.id,
              outlineId: outlineId,
              userId: user.id,
            },
            data,
          });
          continue;
        }

        await tx.element.create({
          data: {
            id: element.id,
            outlineId: outlineId,
            userId: user.id,
            ...data,
          },
        });
      }

      if (idsOfElementsToDelete.length > 0) {
        await tx.element.deleteMany({
          where: {
            outlineId: outlineId,
            userId: user.id,
            id: {
              in: idsOfElementsToDelete,
            },
          },
        });
      }

      return outlineRecord;
    });
    // Return id of updated outline
    return jsonNoStore({ id: updatedOutline.id }, { status: 200 });
  } catch (error) {
    if (isPrismaRecordNotFoundError(error)) {
      return jsonNoStore({ message: 'Outline not found' }, { status: 404 });
    }

    console.error('Error updating outline:', error);
    return jsonNoStore({ message: 'Error updating outline' }, { status: 500 });
  }
};

/* Service for:
  - Deleting outline of id matching URL param matching current user
*/
export const DELETE = async (req: NextRequest, { params }: RouteContext) => {
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
    // Convert outlineId string from params into number
    const { outlineId: outlineIdParam } = await params;
    const outlineId = parsePositiveInteger(outlineIdParam);
    if (outlineId === null) {
      return jsonNoStore({ message: 'Invalid outline ID' }, { status: 400 });
    }
    // Delete outline matching current user
    const deletedOutline = await prisma.outline.delete({
      where: {
        id: outlineId,
        userId: user.id,
      },
    });
    // Return id of deleted outline
    return jsonNoStore({ id: deletedOutline.id }, { status: 200 });
  } catch (error) {
    if (isPrismaRecordNotFoundError(error)) {
      return jsonNoStore({ message: 'Outline not found' }, { status: 404 });
    }

    console.error('Error deleting outline:', error);
    return jsonNoStore({ message: 'Error deleting outline' }, { status: 500 });
  }
};
