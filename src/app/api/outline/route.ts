import { NextRequest } from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Element,
  Outline,
} from '@/lib/types';

export const GET = async (req: NextRequest) => {
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
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
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const formattedOutlinesList = outlines.map((outline) => ({
      id: outline.id,
      title: outline.title ?? '',
      description: outline.description ?? '',
      goal: outline.goal ?? '',
      comments: outline.comments ?? '',
      elements: outline.elements.map((element) => ({
        id: element.id,
        parentId: element.parentId,
        type: element.type,
        name: element.name ?? '',
        description: element.description ?? '',
        rollableSuccess: element.rollableSuccess ?? '',
        rollableFailure: element.rollableFailure ?? '',
        userCreatedAt: element.userCreatedAt.toISOString(),
      })),
    }));

    return Response.json(formattedOutlinesList, { status: 200 });
  } catch (error) {
    return Response.json({ message: 'Error fetching outlines' }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const { user } = await validateRequest();

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const outline: Outline = body.outline;
    const createdOutline = await prisma.outline.create({
      data: {
        userId: user.id,
        title: outline.title ?? '',
        description: outline.description ?? '',
        goal: outline.goal ?? '',
        comments: outline.comments ?? '',
      },
    });

    const landmarks = outline.elements.filter((element) => element.type === 'landmark');
    const interactables = outline.elements.filter((element) => element.type === 'interactable');
    const secrets = outline.elements.filter((element) => element.type === 'secret');

    const createElements = async (elements: Element[]) => {
      const elementPromises = elements.map((element: Element) =>
        prisma.element.create({
          data: {
            id: element.id,
            outlineId: createdOutline.id,
            userId: user.id,
            parentId: element.parentId,
            type: element.type,
            name: element.name ?? '',
            description: element.description ?? '',
            rollableSuccess: element.rollableSuccess ?? '',
            rollableFailure: element.rollableFailure ?? '',
            userCreatedAt: element.userCreatedAt ? new Date(element.userCreatedAt) : undefined,
          },
        })
      );

      return Promise.all(elementPromises);
    };

    await createElements(landmarks);
    await createElements(interactables);
    await createElements(secrets);

    return Response.json({ id: createdOutline.id }, { status: 200 });
  } catch (error) {
    console.error('Error saving outline:', error);
    return Response.json({ message: 'Error saving outline' }, { status: 500 });
  }
};
