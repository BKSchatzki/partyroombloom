import { atomWithStorage } from 'jotai/utils';

type Outline = {
  info: {
    title: string;
    description: string;
    goal: string;
    comments: string;
  };
  elements: Element[];
};

type Element = {
  id: string;
  parentId: string | null;
  type: 'landmark' | 'interactable' | 'secret';
  name: string;
  description: string;
  rollable: {
    success: string;
    failure: string;
  };
};

const outlineInit: Outline = {
  info: {
    title: '',
    description: '',
    goal: '',
    comments: '',
  },
  elements: [],
};

export const outlineAtom = atomWithStorage('outline', outlineInit);
