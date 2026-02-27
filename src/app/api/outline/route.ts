import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { validateRequest } from '@/lib/auth';
import { buildTreeFromFlat, flattenTreeForPersistence } from '@/lib/outlineTransformers';
import { prisma } from '@/lib/prisma';
import { OutlineTreeSchema } from '@/lib/schemas';
import { Element, Outline } from '@/lib/types';

/* Service for:
  - Getting all outlines associated with current user
  - Formatting outlines to match frontend types
*/
export const GET = async (req: NextRequest) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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
      elements: buildTreeFromFlat(
        outline.elements.map((element) => ({
          id: element.id,
          parentId: element.parentId,
          type: element.type as Element['type'],
          name: element.name ?? '',
          description: element.description ?? '',
          rollableSuccess: element.rollableSuccess ?? '',
          rollableFailure: element.rollableFailure ?? '',
          userCreatedAt: element.userCreatedAt.toISOString(),
        }))
      ),
      conversations: outline.conversations.map((conversation) => ({
        id: conversation.id,
        createdAt: conversation.createdAt.toISOString(),
      })),
    }));
    // Return formatted outlines
    return NextResponse.json(formattedOutlinesList, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching outlines' }, { status: 500 });
  }
};

/* Service for:
  - Creating new outline entries
  - Creating new element entries
  - Ensuring that element relations are preserved in database by inserting in hierarchical order
*/
export const POST = async (req: NextRequest) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Insert outline info from body into table and associate with user
    const body = await req.json();
    const parsedOutline = OutlineTreeSchema.safeParse(body.payload);
    if (!parsedOutline.success) {
      return NextResponse.json(
        { message: 'Invalid outline payload', errors: parsedOutline.error.flatten() },
        { status: 400 }
      );
    }
    const outline: Outline = parsedOutline.data;
    const createdOutline = await prisma.outline.create({
      data: {
        userId: user.id,
        title: outline.title ?? '',
        description: outline.description ?? '',
        goal: outline.goal ?? '',
        comments: outline.comments ?? '',
      },
    });
    const flattenedElements = flattenTreeForPersistence(outline.elements);

    for (const element of flattenedElements) {
      await prisma.element.create({
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
      });
    }
    // Return id of created outline
    return NextResponse.json({ id: createdOutline.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving outline:', error);
    return NextResponse.json({ message: 'Error saving outline' }, { status: 500 });
  }
};
