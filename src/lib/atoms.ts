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
  conversations: [],
};

export const tutorialOutlineInit: Outline = {
  id: null,
  title: 'Secret Treasure Room',
  description:
    'A round room of stone brick on all sides, about twenty feet in diameter, with a flat ceiling ten feet above you. The air is musty and cold, but your footsteps are strangely muted as you enter. Dust motes hang in the shaft of light emanating from the single opening at the center of the room. Save for a single pedestal in the center of the room, it is nearly featureless.',
  goal: 'Direct the players to the loot, but allow them to choose between caution and greed. Foolhardy players should be slightly punished, but with good rolls, judgment, and intuition, the characters should be able to both score some good loot.',
  comments:
    'This is a simple side treasure room. Perhaps if the players are especially curious you may reward them with further worldbuilding clues. Particularly inspired play should prompt impromptu extra rewards of loot or information.',
  elements: [
    {
      id: '01948208-c67d-774b-90d6-3ea6d4e7e8b8',
      parentId: null,
      type: 'landmark',
      name: 'Lone Chest',
      description:
        'In the center of the room on a raised pedestal, gleaming in the shaft of light, a chest with the dimensions of a small writing desk.',
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.795Z',
    },
    {
      id: '01948208-c67d-774b-90d6-43a3781ca026',
      parentId: '01948208-c67d-774b-90d6-3ea6d4e7e8b8',
      type: 'interactable',
      name: 'Big Lock',
      description: 'The chest has a comically-large padlock holding it shut.',
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.796Z',
    },
    {
      id: '01948208-c67d-774b-90d6-478e80e09763',
      parentId: '01948208-c67d-774b-90d6-43a3781ca026',
      type: 'secret',
      name: 'Gold Bars',
      description:
        'If the players are able to open the chest, they will find gold bars neatly stacked to the brim of this large chest. This is a lot of money.',
      rollableSuccess:
        "On a successful slightly difficult Thieves' Tools check, the player character is able to open the padlock and open the chest to see what is inside. Alternatively, the player may choose to make a much more difficult attack roll to bash the lock, or spend a spell slot to cast Knock.",
      rollableFailure:
        'The characters either fail to finesse the tumblers of the lock, or are not able to hit the lock with enough force to open it. The degree of failure can play a part in the narration of how the lock reacts.',
      userCreatedAt: '2025-01-20T04:49:02.797Z',
    },
  ],
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

export const tutorialOutlineAtom = atomWithStorage<Outline>('tutorialOutline', tutorialOutlineInit);
export const newOutlineAtom = atomWithStorage<Outline>('newOutline', outlineInit);
export const existingOutlineAtom = atomWithStorage<Outline>('existingOutline', outlineInit);
export const outlinesListAtom = atomWithStorage<Outline[]>('outlinesList', outlinesListInit);
export const conversationAtom = atomWithStorage<Conversation>('conversation', []);
export const userMessageAtom = atomWithStorage<UserMessage>('userMessage', userMessageInit);
