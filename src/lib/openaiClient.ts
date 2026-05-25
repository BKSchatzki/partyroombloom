import 'server-only';

import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';

import { getOptionalEnv, getRequiredEnv } from './env';
import { simulateOutlinePrompt } from './prompts';
import { StoredDungeonMasterResponseSchema } from './schemas';
import { Conversation, Outline, OutlineUserMessage, SystemMessage, UserMessage } from './types';

let openaiClient: OpenAI | null = null;

const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

const getOpenAIClient = () => {
  openaiClient ??= new OpenAI({
    apiKey: getRequiredEnv('OPENAI_API_KEY'),
  });

  return openaiClient;
};

const isOutlineInput = (input: Outline | UserMessage['content']): input is Outline => {
  return 'elements' in input;
};

export const getStructuredResponse = async (
  input: Outline | UserMessage['content'],
  conversation: Conversation
): Promise<Conversation> => {
  const initialSystemPrompt: SystemMessage = {
    role: 'system',
    content: simulateOutlinePrompt,
  };

  const userMessage: UserMessage | OutlineUserMessage = isOutlineInput(input)
    ? {
        role: 'user',
        content: input,
      }
    : {
        role: 'user',
        content: input,
      };

  const formattedConversation: ChatCompletionMessageParam[] = conversation.map((message) => ({
    role: message.role,
    content:
      typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
  }));

  const formattedUserMessage: ChatCompletionMessageParam = {
    role: 'user',
    content: JSON.stringify(input),
  };

  const messages: ChatCompletionMessageParam[] = conversation.length
    ? [...formattedConversation, formattedUserMessage]
    : [
        {
          role: initialSystemPrompt.role,
          content: initialSystemPrompt.content,
        },
        formattedUserMessage,
      ];

  const completion = await getOpenAIClient().beta.chat.completions.parse({
    model: getOptionalEnv('OPENAI_MODEL') ?? DEFAULT_OPENAI_MODEL,
    messages,
    response_format: zodResponseFormat(StoredDungeonMasterResponseSchema, 'assistant_response'),
  });

  const assistantMessage = completion.choices[0].message.parsed;
  if (!assistantMessage) {
    throw new Error('OpenAI response did not match the expected assistant schema.');
  }
  const storedAssistantMessage = StoredDungeonMasterResponseSchema.safeParse(assistantMessage);
  if (!storedAssistantMessage.success) {
    throw new Error('OpenAI response exceeded the stored assistant message limits.');
  }

  const nextConversation = conversation.length
    ? [...conversation, userMessage]
    : [initialSystemPrompt, userMessage];

  return [...nextConversation, { role: 'assistant', content: storedAssistantMessage.data }];
};
