import { NextRequest } from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Element,
  Outline,
} from '@/lib/types';

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
        title: outline.info.title ?? '',
        description: outline.info.description ?? '',
        goal: outline.info.goal ?? '',
        comments: outline.info.comments ?? '',
      },
    });
    const elementPromises = outline.elements.map((element: Element) =>
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
        },
      })
    );
    await Promise.all(elementPromises);
    return Response.json({ id: createdOutline.id }, { status: 200 });
  } catch (error) {
    console.error('Error saving outline:', error);
    return Response.json({ message: 'Error saving outline' }, { status: 500 });
  }
};
