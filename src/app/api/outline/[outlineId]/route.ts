import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Element, Outline } from '@/lib/types';

/* Service for:
  - Getting outline from URL param and its associated user
  - Formatting outline to match frontend types
*/
export const GET = async (req: NextRequest, { params }: { params: { outlineId: string } }) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Convert outlineId string from params into number
    const outlineId = parseInt(params.outlineId);
    if (isNaN(outlineId)) {
      return NextResponse.json({ message: 'Invalid outline ID' }, { status: 400 });
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
      return NextResponse.json({ message: 'Outline not found' }, { status: 404 });
    }
    // Format outline to match frontend types, adding empty array for conversation not included in above query
    const formattedOutline: Outline = {
      id: outline.id,
      title: outline.title ?? '',
      description: outline.description ?? '',
      goal: outline.goal ?? '',
      comments: outline.comments ?? '',
      elements: outline.elements.map((element) => ({
        id: element.id,
        parentId: element.parentId,
        type: element.type as 'landmark' | 'interactable' | 'secret',
        name: element.name ?? '',
        description: element.description ?? '',
        rollableSuccess: element.rollableSuccess ?? '',
        rollableFailure: element.rollableFailure ?? '',
        userCreatedAt: element.userCreatedAt.toISOString(),
      })),
      conversations: [],
    };
    // Return formatted outline
    return NextResponse.json(formattedOutline, { status: 200 });
  } catch (error) {
    console.error('Error fetching outline:', error);
    return NextResponse.json({ message: 'Error fetching outline' }, { status: 500 });
  }
};

/* Service for:
  - Updating outline of id matching URL param and matching current user with data from body
*/
export const PUT = async (req: NextRequest, { params }: { params: { outlineId: string } }) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Convert outlineId string from params into number
    const outlineId = parseInt(params.outlineId);
    if (isNaN(outlineId)) {
      return NextResponse.json({ message: 'Invalid outline ID' }, { status: 400 });
    }
    // Update existing outline matching current user with data from body
    const body = await req.json();
    const outline: Outline = body.payload;
    const updatedOutline = await prisma.outline.update({
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
    // Delete elements in database for this outline not included in elements from request body
    const databaseElements = await prisma.element.findMany({
      where: {
        outlineId: outlineId,
        userId: user.id,
      },
    });
    const outlineElementIds = outline.elements.map((element) => element.id);
    const idsOfElementsToDelete = databaseElements
      .filter((element) => !outlineElementIds.includes(element.id))
      .map((element) => element.id);
    await prisma.element.deleteMany({
      where: {
        id: {
          in: idsOfElementsToDelete,
        },
      },
    });
    // Declare three element types from body and filter each into own variables
    const landmarks = outline.elements.filter((element) => element.type === 'landmark');
    const interactables = outline.elements.filter((element) => element.type === 'interactable');
    const secrets = outline.elements.filter((element) => element.type === 'secret');
    // Declare helper for asynchronously mapping over element arrays, updating element entries if found and creating new entries if not
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
            userCreatedAt: element.userCreatedAt ? new Date(element.userCreatedAt) : undefined,
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
            userCreatedAt: element.userCreatedAt ? new Date(element.userCreatedAt) : undefined,
          },
        })
      );
      // Ensure map runs asynchronously, resolving only if every item is successfully resolved
      return Promise.all(elementPromises);
    };
    // Invoke helper in order of element hierarchy to ensure relations are updated or inserted correctly
    await upsertElements(landmarks);
    await upsertElements(interactables);
    await upsertElements(secrets);
    // Return id of updated outline
    return NextResponse.json({ id: updatedOutline.id }, { status: 200 });
  } catch (error) {
    console.error('Error updating outline:', error);
    return NextResponse.json({ message: 'Error updating outline' }, { status: 500 });
  }
};

/* Service for:
  - Deleting outline of id matching URL param matching current user
*/
export const DELETE = async (req: NextRequest, { params }: { params: { outlineId: string } }) => {
  // Get user and abort if no user found
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Convert outlineId string from params into number
    const outlineId = parseInt(params.outlineId);
    if (isNaN(outlineId)) {
      return NextResponse.json({ message: 'Invalid outline ID' }, { status: 400 });
    }
    // Delete outline matching current user
    const deletedOutline = await prisma.outline.delete({
      where: {
        id: outlineId,
        userId: user.id,
      },
    });
    // Return id of deleted outline
    return NextResponse.json({ id: deletedOutline.id }, { status: 200 });
  } catch (error) {
    console.error('Error deleting outline:', error);
    return NextResponse.json({ message: 'Error deleting outline' }, { status: 500 });
  }
};
