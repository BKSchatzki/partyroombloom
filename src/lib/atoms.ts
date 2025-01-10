import { atomWithStorage } from 'jotai/utils';

import type {
  Conversation,
  Outline,
  UserMessage,
} from './types';

const outlinesListInit: Outline[] = [];

export const outlineInit: Outline = {
  id: null,
  title: '',
  description: '',
  goal: '',
  comments: '',
  elements: [],
};

export const userMessageInit: UserMessage = {
  role: 'user',
  content: {
    choice: '',
    comments: '',
    rollResult: null,
  },
};

export const outlineAtom = atomWithStorage<Outline>('outline', outlineInit);
export const outlinesListAtom = atomWithStorage<Outline[]>('outlinesList', outlinesListInit);
export const conversationAtom = atomWithStorage<Conversation>('conversation', []);
export const userMessageAtom = atomWithStorage<UserMessage>('userMessage', userMessageInit);
