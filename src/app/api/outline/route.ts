import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
    const outline: Outline = body.payload;
    const createdOutline = await prisma.outline.create({
      data: {
        userId: user.id,
        title: outline.title ?? '',
        description: outline.description ?? '',
        goal: outline.goal ?? '',
        comments: outline.comments ?? '',
      },
    });
    // Declare three element types from body and filter each into own variables
    const landmarks = outline.elements.filter((element) => element.type === 'landmark');
    const interactables = outline.elements.filter((element) => element.type === 'interactable');
    const secrets = outline.elements.filter((element) => element.type === 'secret');
    // Declare helper for creating element entries by asynchronously mapping over element arrays
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
      // Ensure map runs asynchronously, resolving only if every item is successfully resolved
      return Promise.all(elementPromises);
    };
    // Invoke helper in order of element hierarchy to ensure relations are inserted correctly
    await createElements(landmarks);
    await createElements(interactables);
    await createElements(secrets);
    // Return id of created outline
    return NextResponse.json({ id: createdOutline.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving outline:', error);
    return NextResponse.json({ message: 'Error saving outline' }, { status: 500 });
  }
};
