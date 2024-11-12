import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type {
  Conversation,
  Outline,
} from './types';

const outlinesListInit: Outline[] = [];

const outlineInit: Outline = {
  id: null,
  title: '',
  description: '',
  goal: '',
  comments: '',
  elements: [],
};

export const outlineAtom = atomWithStorage<Outline>('outline', outlineInit);
export const outlinesListAtom = atomWithStorage('outlinesList', outlinesListInit);
export const conversationAtom = atom<Conversation>([]);
