import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';

import { simulateOutlinePrompt } from './prompts';
import { DungeonMasterResponseSchema } from './schemas';
import {
  Conversation,
  Outline,
  SystemMessage,
  UserMessage,
} from './types';

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getStructuredResponse = async (
  input: Outline | UserMessage['content'],
  conversation: Conversation
) => {
  const initialSystemPrompt: SystemMessage = {
    role: 'system',
    content: simulateOutlinePrompt,
  };

  const userMessage = {
    role: 'user',
    content: typeof input === 'string' ? input : JSON.stringify(input),
  };

  const formattedConversation = conversation.map((message) => ({
    role: message.role,
    content:
      typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
  }));

  const messages = conversation.length
    ? [...formattedConversation, userMessage]
    : [initialSystemPrompt, userMessage];

  const completion = await openaiClient.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: messages as ChatCompletionMessageParam[],
    response_format: zodResponseFormat(DungeonMasterResponseSchema, 'assistant_response'),
  });

  const parsedMessages = messages.map((msg) => ({
    ...msg,
    content:
      (msg.role === 'user' || msg.role === 'assistant') &&
      msg.content &&
      typeof msg.content === 'string'
        ? JSON.parse(msg.content)
        : msg.content,
  }));

  const assistantMessage = completion.choices[0].message.parsed;

  return [...parsedMessages, { role: 'assistant', content: assistantMessage }];
};
