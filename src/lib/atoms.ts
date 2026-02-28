import type { SetStateAction } from 'react';

import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';

import {
  OutlineGraph,
  OutlineMetaField,
  OutlineMode,
  OutlineNodeField,
  addChildNode,
  addLandmarkNode,
  deleteNode,
  denormalizeOutline,
  getAllInteractableIds,
  getChildIds,
  getNodeById,
  isOutlineGraphLike,
  isOutlineLike,
  normalizeOutline,
  setOutlineMetaField,
  updateNodeField,
} from './outlineState';
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

const outlineGraphInit = normalizeOutline(outlineInit);

const parseStoredOutlineGraph = (value: string | null, fallback: OutlineGraph): OutlineGraph => {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    if (isOutlineGraphLike(parsed)) {
      return parsed;
    }
    if (isOutlineLike(parsed)) {
      return normalizeOutline(parsed);
    }
  } catch {
    return fallback;
  }

  return fallback;
};

const createOutlineGraphStorage = () => {
  return {
    getItem: (key: string, initialValue: OutlineGraph) => {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      return parseStoredOutlineGraph(window.localStorage.getItem(key), initialValue);
    },
    setItem: (key: string, value: OutlineGraph) => {
      if (typeof window === 'undefined') {
        return;
      }
      // Persist the tree payload shape to preserve external behavior.
      window.localStorage.setItem(key, JSON.stringify(denormalizeOutline(value)));
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') {
        return;
      }
      window.localStorage.removeItem(key);
    },
    subscribe: (key: string, callback: (value: OutlineGraph) => void, initialValue: OutlineGraph) => {
      if (typeof window === 'undefined') {
        return () => {
          return;
        };
      }
      const handler = (event: StorageEvent) => {
        if (event.key !== key) {
          return;
        }
        callback(parseStoredOutlineGraph(event.newValue, initialValue));
      };
      window.addEventListener('storage', handler);
      return () => {
        window.removeEventListener('storage', handler);
      };
    },
  };
};

const outlineGraphStorage = createOutlineGraphStorage();

export const tutorialOutlineGraphAtom = atomWithStorage<OutlineGraph>(
  'tutorialOutline',
  outlineGraphInit,
  outlineGraphStorage
);
export const newOutlineGraphAtom = atomWithStorage<OutlineGraph>(
  'newOutline',
  outlineGraphInit,
  outlineGraphStorage
);
export const existingOutlineGraphAtom = atomWithStorage<OutlineGraph>(
  'existingOutline',
  outlineGraphInit,
  outlineGraphStorage
);

const outlineGraphAtomByMode: Record<OutlineMode, typeof tutorialOutlineGraphAtom> = {
  tutorial: tutorialOutlineGraphAtom,
  new: newOutlineGraphAtom,
  existing: existingOutlineGraphAtom,
};

const createOutlineTreeAtom = (mode: OutlineMode) =>
  atom(
    (get) => denormalizeOutline(get(outlineGraphAtomByMode[mode])),
    (get, set, update: SetStateAction<Outline>) => {
      const currentTree = denormalizeOutline(get(outlineGraphAtomByMode[mode]));
      const nextTree = typeof update === 'function' ? update(currentTree) : update;
      set(outlineGraphAtomByMode[mode], normalizeOutline(nextTree));
    }
  );

export const tutorialOutlineAtom = createOutlineTreeAtom('tutorial');
export const newOutlineAtom = createOutlineTreeAtom('new');
export const existingOutlineAtom = createOutlineTreeAtom('existing');

export const outlineTreeAtomFamily = atomFamily((mode: OutlineMode) => createOutlineTreeAtom(mode));

export const outlineMetaAtomFamily = atomFamily((mode: OutlineMode) =>
  atom((get) => {
    const graph = get(outlineGraphAtomByMode[mode]);
    return {
      id: graph.id,
      title: graph.title,
      description: graph.description,
      goal: graph.goal,
      comments: graph.comments,
      conversations: graph.conversations,
    };
  })
);

const getModeAndId = (scopedId: string): { mode: OutlineMode; id: string } => {
  const [mode, ...idParts] = scopedId.split(':');
  return {
    mode: mode as OutlineMode,
    id: idParts.join(':'),
  };
};

export const outlineNodeAtomFamily = atomFamily((scopedNodeId: string) =>
  atom((get) => {
    const { mode, id } = getModeAndId(scopedNodeId);
    return getNodeById(get(outlineGraphAtomByMode[mode]), id);
  })
);

export const outlineChildIdsAtomFamily = atomFamily((scopedParentId: string) =>
  atom((get) => {
    const { mode, id } = getModeAndId(scopedParentId);
    return getChildIds(get(outlineGraphAtomByMode[mode]), id);
  })
);

export const rootLandmarkIdsAtomFamily = atomFamily((mode: OutlineMode) =>
  atom((get) => get(outlineGraphAtomByMode[mode]).rootIds)
);

export const allInteractableIdsAtomFamily = atomFamily((mode: OutlineMode) =>
  atom((get) => getAllInteractableIds(get(outlineGraphAtomByMode[mode])))
);

export const updateOutlineMetaFieldAtomFamily = atomFamily((mode: OutlineMode) =>
  atom(null, (_get, set, payload: { field: OutlineMetaField; value: string }) => {
    set(outlineGraphAtomByMode[mode], (prev) => setOutlineMetaField(prev, payload.field, payload.value));
  })
);

export const addLandmarkAtomFamily = atomFamily((mode: OutlineMode) =>
  atom(null, (_get, set) => {
    set(outlineGraphAtomByMode[mode], (prev) => addLandmarkNode(prev));
  })
);

export const addChildNodeAtomFamily = atomFamily((mode: OutlineMode) =>
  atom(
    null,
    (_get, set, payload: { parentId: string; childType: 'interactable' | 'secret' }) => {
      set(outlineGraphAtomByMode[mode], (prev) =>
        addChildNode(prev, payload.parentId, payload.childType)
      );
    }
  )
);

export const updateOutlineNodeFieldAtomFamily = atomFamily((mode: OutlineMode) =>
  atom(
    null,
    (_get, set, payload: { nodeId: string; field: OutlineNodeField; value: string }) => {
      set(outlineGraphAtomByMode[mode], (prev) =>
        updateNodeField(prev, payload.nodeId, payload.field, payload.value)
      );
    }
  )
);

export const deleteOutlineNodeAtomFamily = atomFamily((mode: OutlineMode) =>
  atom(null, (_get, set, nodeId: string) => {
    set(outlineGraphAtomByMode[mode], (prev) => deleteNode(prev, nodeId));
  })
);

export const tutorialStepAtom = atomWithStorage('tutorialStep', 0);
export const outlinesListAtom = atomWithStorage<Outline[]>('outlinesList', outlinesListInit);
export const conversationAtom = atomWithStorage<Conversation>('conversation', []);
export const userMessageAtom = atomWithStorage<UserMessage>('userMessage', userMessageInit);
