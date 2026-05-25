import { z } from 'zod';

const ID_MAX_LENGTH = 128;
const TITLE_MAX_LENGTH = 200;
const TEXT_MAX_LENGTH = 5000;
const SYSTEM_MESSAGE_MAX_LENGTH = 20000;
const USER_MESSAGE_MAX_LENGTH = 2000;
const ASSISTANT_TEXT_MAX_LENGTH = 2000;
const ASSISTANT_OPTION_LIMIT = 8;
const ASSISTANT_NARRATION_LIMIT = 12;
const OUTLINE_NODE_LIMIT = 500;
const CONVERSATION_MESSAGE_LIMIT = 200;
const CONVERSATION_REL_LIMIT = 100;

const nodeIdSchema = z.string().min(1).max(ID_MAX_LENGTH);
const titleSchema = z.string().max(TITLE_MAX_LENGTH);
const textSchema = z.string().max(TEXT_MAX_LENGTH);

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

export const StoredDungeonMasterResponseSchema = z.object({
  headline: z.string().max(ASSISTANT_TEXT_MAX_LENGTH),
  narration: z.array(z.string().max(ASSISTANT_TEXT_MAX_LENGTH)).max(ASSISTANT_NARRATION_LIMIT),
  prompt: z.string().max(ASSISTANT_TEXT_MAX_LENGTH),
  options: z
    .array(z.object({ description: z.string().max(ASSISTANT_TEXT_MAX_LENGTH), roll: z.boolean() }))
    .max(ASSISTANT_OPTION_LIMIT),
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
  choice: z.string().max(USER_MESSAGE_MAX_LENGTH),
  comments: z.string().max(USER_MESSAGE_MAX_LENGTH).optional().default(''),
  rollResult: RollResultSchema.nullable(),
});

export const SystemMessageSchema = z.object({
  role: z.literal('system'),
  content: z.string().max(SYSTEM_MESSAGE_MAX_LENGTH),
});

export const UserMessageSchema = z.object({
  role: z.literal('user'),
  content: UserMessageContentSchema,
});

export const AssistantMessageSchema = z.object({
  role: z.literal('assistant'),
  content: StoredDungeonMasterResponseSchema,
});

const TreeNodeBaseSchema = z.object({
  id: nodeIdSchema,
  name: titleSchema.optional().default(''),
  description: textSchema.optional().default(''),
  rollableSuccess: textSchema.optional().default(''),
  rollableFailure: textSchema.optional().default(''),
  userCreatedAt: z.string().datetime(),
});

export const SecretNodeSchema = TreeNodeBaseSchema.extend({
  parentId: nodeIdSchema,
  type: z.literal('secret'),
  children: z.array(z.never()),
});

export const InteractableNodeSchema = TreeNodeBaseSchema.extend({
  parentId: nodeIdSchema,
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

const countTreeNodes = (nodes: TreeNodeWithChildren[]) => {
  let count = 0;
  const stack = [...nodes];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) {
      continue;
    }
    count += 1;
    if (Array.isArray(node.children)) {
      stack.push(...node.children);
    }
  }
  return count;
};

export const OutlineTreeSchema = z
  .object({
    id: z.number().nullable(),
    title: titleSchema.optional().default(''),
    description: textSchema.optional().default(''),
    goal: textSchema.optional().default(''),
    comments: textSchema.optional().default(''),
    elements: z.array(LandmarkNodeSchema).max(OUTLINE_NODE_LIMIT),
    conversations: z
      .array(
        z.object({
          id: z.number(),
          createdAt: z.string(),
        })
      )
      .max(CONVERSATION_REL_LIMIT)
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
    if (countTreeNodes(outline.elements) > OUTLINE_NODE_LIMIT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `An outline can contain at most ${OUTLINE_NODE_LIMIT} nodes.`,
        path: ['elements'],
      });
    }
  });

export const OutlineUserMessageSchema = z.object({
  role: z.literal('user'),
  content: OutlineTreeSchema,
});

export const ConversationSchema = z
  .array(
    z.union([
      SystemMessageSchema,
      UserMessageSchema,
      OutlineUserMessageSchema,
      AssistantMessageSchema,
    ])
  )
  .max(CONVERSATION_MESSAGE_LIMIT);

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
