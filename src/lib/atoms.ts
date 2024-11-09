import { atomWithStorage } from 'jotai/utils';

import type { Outline } from './types';

const outlinesListInit: Outline[] = [];

const outlineInit: Outline = {
  id: null,
  title: '',
  description: '',
  goal: '',
  comments: '',
  elements: [],
};

export const outlineAtom = atomWithStorage('outline', outlineInit);
export const outlinesListAtom = atomWithStorage('outlinesList', outlinesListInit);
