import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

import { simulateOutlinePrompt } from './prompts';
import { DungeonMasterResponseSchema } from './schemas';
import {
  Conversation,
  Outline,
} from './types';

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const convertToOpenAIMessages = (messages: Conversation) => {
  return messages.map((message) => {
    if (message.role === 'user' || message.role === 'system') {
      return {
        role: message.role,
        content:
          typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
      };
    }
    return {
      role: 'assistant',
      content: JSON.stringify(message.content),
    };
  });
};

export const getStructuredResponse = async (input: Outline, conversation: Conversation) => {
  const initialSystemPrompt = {
    role: 'system',
    content: simulateOutlinePrompt,
  };
  const userMessage = {
    role: 'user',
    content: JSON.stringify(input),
  };
  const messages = conversation.length
    ? convertToOpenAIMessages(conversation)
    : convertToOpenAIMessages([initialSystemPrompt, userMessage]);
  const completion = await openaiClient.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages,
    response_format: zodResponseFormat(DungeonMasterResponseSchema, 'assistant_response'),
  });
  const responseMessage = completion.choices[0].message.parsed;
  return responseMessage;
};
