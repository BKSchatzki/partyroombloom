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

type RouteContext = {
  params: Promise<{ outlineId: string }>;
};

export const GET = async (req: NextRequest, { params }: RouteContext) => {
  const { user } = await validateRequest();
  if (!user) {
    return jsonNoStore({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { outlineId: outlineIdParam } = await params;
    const outlineId = parsePositiveInteger(outlineIdParam);
    if (outlineId === null) {
      return jsonNoStore({ message: 'Invalid outline ID' }, { status: 400 });
    }

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

    const formattedOutline: Outline = {
      id: outline.id,
      title: outline.title ?? '',
      description: outline.description ?? '',
      goal: outline.goal ?? '',
      comments: outline.comments ?? '',
      elements: buildTreeFromFlat(outline.elements.map((element) => toFlatOutlineElement(element))),
      conversations: [],
    };

    return jsonNoStore(formattedOutline, { status: 200 });
  } catch (error) {
    console.error('Error fetching outline:', error);
    return jsonNoStore({ message: 'Error fetching outline' }, { status: 500 });
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
    const { outlineId: outlineIdParam } = await params;
    const outlineId = parsePositiveInteger(outlineIdParam);
    if (outlineId === null) {
      return jsonNoStore({ message: 'Invalid outline ID' }, { status: 400 });
    }

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

    return jsonNoStore({ id: updatedOutline.id }, { status: 200 });
  } catch (error) {
    if (isPrismaRecordNotFoundError(error)) {
      return jsonNoStore({ message: 'Outline not found' }, { status: 404 });
    }

    console.error('Error updating outline:', error);
    return jsonNoStore({ message: 'Error updating outline' }, { status: 500 });
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
    const { outlineId: outlineIdParam } = await params;
    const outlineId = parsePositiveInteger(outlineIdParam);
    if (outlineId === null) {
      return jsonNoStore({ message: 'Invalid outline ID' }, { status: 400 });
    }

    const deletedOutline = await prisma.outline.delete({
      where: {
        id: outlineId,
        userId: user.id,
      },
    });

    return jsonNoStore({ id: deletedOutline.id }, { status: 200 });
  } catch (error) {
    if (isPrismaRecordNotFoundError(error)) {
      return jsonNoStore({ message: 'Outline not found' }, { status: 404 });
    }

    console.error('Error deleting outline:', error);
    return jsonNoStore({ message: 'Error deleting outline' }, { status: 500 });
  }
};
