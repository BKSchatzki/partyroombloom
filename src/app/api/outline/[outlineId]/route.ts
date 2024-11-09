import { NextRequest } from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Element,
  Outline,
} from '@/lib/types';

export const GET = async (req: NextRequest, { params }: { params: { outlineId: string } }) => {
  const { user } = await validateRequest();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const outlineId = parseInt(params.outlineId);
    if (isNaN(outlineId)) {
      return Response.json({ message: 'Invalid outline ID' }, { status: 400 });
    }
    const outline = await prisma.outline.findUnique({
      where: {
        id: outlineId,
        userId: user.id,
      },
      include: {
        elements: true,
      },
    });
    if (!outline) {
      return Response.json({ message: 'Outline not found' }, { status: 404 });
    }
    const formattedOutline: Outline = {
      id: outline.id,
      info: {
        title: outline.title ?? '',
        description: outline.description ?? '',
        goal: outline.goal ?? '',
        comments: outline.comments ?? '',
      },
      elements: outline.elements.map((element) => ({
        id: element.id,
        outlineId: element.outlineId,
        parentId: element.parentId,
        type: element.type as 'landmark' | 'interactable' | 'secret',
        name: element.name ?? '',
        description: element.description ?? '',
        rollableSuccess: element.rollableSuccess ?? '',
        rollableFailure: element.rollableFailure ?? '',
      })),
    };
    return Response.json(formattedOutline, { status: 200 });
  } catch (error) {
    console.error('Error fetching outline:', error);
    return Response.json({ message: 'Error fetching outline' }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { outlineId: string } }) => {
  const { user } = await validateRequest();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const outlineId = parseInt(params.outlineId);
    if (isNaN(outlineId)) {
      return Response.json({ message: 'Invalid outline ID' }, { status: 400 });
    }
    const body = await req.json();
    const outline: Outline = body.outline;
    const updatedOutline = await prisma.outline.update({
      where: {
        id: outlineId,
        userId: user.id,
      },
      data: {
        title: outline.info.title ?? '',
        description: outline.info.description ?? '',
        goal: outline.info.goal ?? '',
        comments: outline.info.comments ?? '',
      },
    });
    const landmarks = outline.elements.filter((element) => element.type === 'landmark');
    const interactables = outline.elements.filter((element) => element.type === 'interactable');
    const secrets = outline.elements.filter((element) => element.type === 'secret');
    const upsertElements = async (elements: Element[]) => {
      const elementPromises = elements.map((element: Element) =>
        prisma.element.upsert({
          where: {
            id: element.id,
          },
          update: {
            outlineId: outlineId,
            userId: user.id,
            parentId: element.parentId,
            type: element.type,
            name: element.name ?? '',
            description: element.description ?? '',
            rollableSuccess: element.rollableSuccess ?? '',
            rollableFailure: element.rollableFailure ?? '',
          },
          create: {
            id: element.id,
            outlineId: outlineId,
            userId: user.id,
            parentId: element.parentId,
            type: element.type,
            name: element.name ?? '',
            description: element.description ?? '',
            rollableSuccess: element.rollableSuccess ?? '',
            rollableFailure: element.rollableFailure ?? '',
          },
        })
      );
      return Promise.all(elementPromises);
    };
    await upsertElements(landmarks);
    await upsertElements(interactables);
    await upsertElements(secrets);
    return Response.json(updatedOutline, { status: 200 });
  } catch (error) {
    console.error('Error updating outline:', error);
    return Response.json({ message: 'Error updating outline' }, { status: 500 });
  }
};
