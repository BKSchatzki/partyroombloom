import { z } from 'zod';

export const DungeonMasterResponseSchema = z.object({
  headline: z.string(),
  narration: z.array(z.string()),
  prompt: z.string(),
  options: z.array(z.object({ description: z.string(), roll: z.boolean() })),
});

const TreeNodeBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional().default(''),
  description: z.string().optional().default(''),
  rollableSuccess: z.string().optional().default(''),
  rollableFailure: z.string().optional().default(''),
  userCreatedAt: z.string().min(1),
});

export const SecretNodeSchema = TreeNodeBaseSchema.extend({
  parentId: z.string().min(1),
  type: z.literal('secret'),
  children: z.array(z.never()),
});

export const InteractableNodeSchema = TreeNodeBaseSchema.extend({
  parentId: z.string().min(1),
  type: z.literal('interactable'),
  children: z.array(SecretNodeSchema),
});

export const LandmarkNodeSchema = TreeNodeBaseSchema.extend({
  parentId: z.null(),
  type: z.literal('landmark'),
  children: z.array(InteractableNodeSchema),
});

const ensureParentReferences = <T extends { id: string; parentId: string | null }>(
  nodes: T[],
  rootParentId: string | null
) => {
  const stack: Array<{ node: any; expectedParentId: string | null }> = nodes.map((node) => ({
    node,
    expectedParentId: rootParentId,
  }));

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      continue;
    }

    if (item.node.parentId !== item.expectedParentId) {
      return false;
    }

    if (Array.isArray(item.node.children)) {
      item.node.children.forEach((child: any) =>
        stack.push({ node: child, expectedParentId: item.node.id })
      );
    }
  }

  return true;
};

const ensureUniqueIds = (nodes: Array<{ id: string; children?: any[] }>) => {
  const seen = new Set<string>();
  const stack = [...nodes];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) {
      continue;
    }
    if (seen.has(node.id)) {
      return false;
    }
    seen.add(node.id);
    if (Array.isArray(node.children)) {
      stack.push(...node.children);
    }
  }
  return true;
};

export const OutlineTreeSchema = z
  .object({
    id: z.number().nullable(),
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    goal: z.string().optional().default(''),
    comments: z.string().optional().default(''),
    elements: z.array(LandmarkNodeSchema),
    conversations: z
      .array(
        z.object({
          id: z.number(),
          createdAt: z.string(),
        })
      )
      .optional()
      .default([]),
  })
  .superRefine((outline, ctx) => {
    if (!ensureParentReferences(outline.elements, null)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each node parentId must match its parent node id.',
        path: ['elements'],
      });
    }
    if (!ensureUniqueIds(outline.elements)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each node id must be unique.',
        path: ['elements'],
      });
    }
  });
