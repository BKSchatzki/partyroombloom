import { NextRequest } from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Element,
  Outline,
} from '@/lib/types';

export async function GET(req: NextRequest, { params }: { params: { outlineId: string } }) {
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
}
