import { atomWithStorage } from 'jotai/utils';

import type { Conversation, Outline, UserMessage } from './types';

const outlinesListInit: Outline[] = [];

export const outlineInit: Outline = {
  id: null,
  title: '',
  description: '',
  goal: '',
  comments: '',
  elements: [],
  conversations: [],
};

export const userMessageInit: UserMessage = {
  role: 'user',
  content: {
    choice: '',
    comments: '',
    rollResult: null,
  },
};

export const tutorialStepAtom = atomWithStorage('tutorialStep', 0);
export const tutorialOutlineAtom = atomWithStorage<Outline>('tutorialOutline', outlineInit);
export const newOutlineAtom = atomWithStorage<Outline>('newOutline', outlineInit);
export const existingOutlineAtom = atomWithStorage<Outline>('existingOutline', outlineInit);
export const outlinesListAtom = atomWithStorage<Outline[]>('outlinesList', outlinesListInit);
export const conversationAtom = atomWithStorage<Conversation>('conversation', []);
export const userMessageAtom = atomWithStorage<UserMessage>('userMessage', userMessageInit);
