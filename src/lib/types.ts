// ---------------
// Outline Types
// ---------------

export type TutorialStep = {
  id: number;
  target: string;
  content: string;
  action?: () => void;
};

export type Element = {
  id: string;
  parentId: string | null;
  type: 'landmark' | 'interactable' | 'secret';
  name?: string;
  description?: string;
  rollableSuccess?: string;
  rollableFailure?: string;
  userCreatedAt: string;
};

export type Outline = {
  id: number | null;
  title?: string;
  description?: string;
  goal?: string;
  comments?: string;
  elements: Array<Element>;
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
  content: {
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
};

export type AssistantMessage = BaseMessage & {
  role: 'assistant';
  content: {
    headline?: string;
    narration?: string[];
    prompt?: string;
    options: Array<{
      description?: string;
      roll: boolean;
    }>;
  };
};

export type Message = SystemMessage | UserMessage | AssistantMessage;

export type Conversation = Message[];

// Type Guards
export const isSystemMessage = (message: Message): message is SystemMessage => {
  return message.role === 'system';
};
export const isUserMessage = (message: Message): message is UserMessage => {
  return message.role === 'user';
};
export const isAssistantMessage = (message: Message): message is AssistantMessage => {
  return message.role === 'assistant';
};
