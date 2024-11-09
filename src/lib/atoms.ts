import { atomWithStorage } from 'jotai/utils';

import type { Outline } from './types';

const outlineInit: Outline = {
  id: null,
  info: {
    title: '',
    description: '',
    goal: '',
    comments: '',
  },
  elements: [],
};

export const outlineAtom = atomWithStorage('outline', outlineInit);
