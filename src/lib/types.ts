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
};

type BaseMessage = {
  role: 'system' | 'user' | 'assistant';
};

type SystemMessage = BaseMessage & {
  role: 'system';
  content: string;
};

export type UserMessage = BaseMessage & {
  role: 'user';
  content: {
    choice: string;
    comments?: string;
    rollResult:
      | 'Critical Failure'
      | 'Normal Failure'
      | 'Close Failure'
      | 'Close Success'
      | 'Normal Success'
      | 'Critical Success'
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
      roll: boolean | null;
    }>;
  };
};

export type Message = SystemMessage | UserMessage | AssistantMessage;

export type Conversation = Message[];
