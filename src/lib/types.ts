// ---------------
// Outline Types
// ---------------

export type TutorialStep = {
  id: number;
  page: 'info' | 'landmarks' | 'interactables' | 'secrets' | 'review';
  title: string;
  content: React.ReactNode;
  setStateToStep: () => void;
};

export const OUTLINE_NODE_TYPES = ['landmark', 'interactable', 'secret'] as const;

export type OutlineNodeType = (typeof OUTLINE_NODE_TYPES)[number];

type OutlineNodeBase<TType extends OutlineNodeType, TParentId extends string | null> = {
  id: string;
  parentId: TParentId;
  type: TType;
  name?: string;
  description?: string;
  rollableSuccess?: string;
  rollableFailure?: string;
  userCreatedAt: string;
};

export type FlatOutlineElement = OutlineNodeBase<OutlineNodeType, string | null>;
export type Element = FlatOutlineElement;

export type SecretNode = OutlineNodeBase<'secret', string> & {
  children: never[];
};

export type InteractableNode = OutlineNodeBase<'interactable', string> & {
  children: SecretNode[];
};

export type LandmarkNode = OutlineNodeBase<'landmark', null> & {
  children: InteractableNode[];
};

export type OutlineTreeNode = LandmarkNode | InteractableNode | SecretNode;

export type Outline = {
  id: number | null;
  title?: string;
  description?: string;
  goal?: string;
  comments?: string;
  elements: LandmarkNode[];
  conversations: Array<ConversationRel>;
};

export type ConversationRel = {
  id: number;
  createdAt: string;
};

// ------------------
// Conversation Types
// ------------------

type BaseMessage = {
  role: 'system' | 'user' | 'assistant';
};

export type SystemMessage = BaseMessage & {
  role: 'system';
  content: string;
};

export type UserMessage = BaseMessage & {
  role: 'user';
  content: UserMessageContent;
};

export type UserMessageContent = {
  choice: string;
  comments?: string;
  rollResult:
    | 'Critical Success'
    | 'Normal Success'
    | 'Close Success'
    | 'Close Failure'
    | 'Normal Failure'
    | 'Critical Failure'
    | null;
};

export type OutlineUserMessage = BaseMessage & {
  role: 'user';
  content: Outline;
};

export type AssistantMessage = BaseMessage & {
  role: 'assistant';
  content: {
    headline?: string;
    narration?: string[];
    prompt?: string;
    options: Array<{
      description: string;
      roll: boolean;
    }>;
  };
};

export type Message = SystemMessage | UserMessage | OutlineUserMessage | AssistantMessage;

export type Conversation = Message[];

// Type Guards
export const isSystemMessage = (message: Message): message is SystemMessage => {
  return message.role === 'system';
};
export const isUserMessage = (message: Message): message is UserMessage => {
  return (
    message.role === 'user' &&
    typeof message.content === 'object' &&
    message.content !== null &&
    'choice' in message.content
  );
};
export const isAssistantMessage = (message: Message): message is AssistantMessage => {
  return message.role === 'assistant';
};
