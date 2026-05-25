import { z } from 'zod';

export const GoogleUserInfoSchema = z.object({
  sub: z.string().min(1),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  picture: z.string().url().nullable().optional(),
});

export const DungeonMasterResponseSchema = z.object({
  headline: z.string(),
  narration: z.array(z.string()),
  prompt: z.string(),
  options: z.array(z.object({ description: z.string(), roll: z.boolean() })),
});

export const RollResultSchema = z.enum([
  'Critical Success',
  'Normal Success',
  'Close Success',
  'Close Failure',
  'Normal Failure',
  'Critical Failure',
]);

export const UserMessageContentSchema = z.object({
  choice: z.string(),
  comments: z.string().optional().default(''),
  rollResult: RollResultSchema.nullable(),
});

export const SystemMessageSchema = z.object({
  role: z.literal('system'),
  content: z.string(),
});

export const UserMessageSchema = z.object({
  role: z.literal('user'),
  content: UserMessageContentSchema,
});

export const AssistantMessageSchema = z.object({
  role: z.literal('assistant'),
  content: DungeonMasterResponseSchema,
});

const TreeNodeBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional().default(''),
  description: z.string().optional().default(''),
  rollableSuccess: z.string().optional().default(''),
  rollableFailure: z.string().optional().default(''),
  userCreatedAt: z.string().datetime(),
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

type TreeNodeWithChildren = {
  id: string;
  parentId: string | null;
  children?: TreeNodeWithChildren[];
};

const ensureParentReferences = (nodes: TreeNodeWithChildren[], rootParentId: string | null) => {
  const stack: Array<{ node: TreeNodeWithChildren; expectedParentId: string | null }> = nodes.map(
    (node) => ({
      node,
      expectedParentId: rootParentId,
    })
  );

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      continue;
    }

    if (item.node.parentId !== item.expectedParentId) {
      return false;
    }

    if (item.node.children) {
      item.node.children.forEach((child) =>
        stack.push({ node: child, expectedParentId: item.node.id })
      );
    }
  }

  return true;
};

const ensureUniqueIds = (nodes: TreeNodeWithChildren[]) => {
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

export const OutlineUserMessageSchema = z.object({
  role: z.literal('user'),
  content: OutlineTreeSchema,
});

export const ConversationSchema = z.array(
  z.union([
    SystemMessageSchema,
    UserMessageSchema,
    OutlineUserMessageSchema,
    AssistantMessageSchema,
  ])
);

export const OutlinePayloadSchema = z.object({
  payload: OutlineTreeSchema,
});

export const CreateConversationPayloadSchema = z.object({
  conversation: ConversationSchema.optional().default([]),
  outline: OutlineTreeSchema,
});

export const SimulateInputSchema = OutlineTreeSchema.or(UserMessageContentSchema);

export const SimulateConversePayloadSchema = z.object({
  input: SimulateInputSchema,
  conversation: ConversationSchema,
});

export const UpdateConversationPayloadSchema = z.object({
  conversation: ConversationSchema,
});
