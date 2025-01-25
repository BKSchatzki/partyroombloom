import { Outline } from './types';

export const tutorialOutlineFinal: Outline = {
  id: null,
  title: 'Secret Treasure Room',
  description:
    'A round room of stone brick on all sides, about twenty feet in diameter, with a flat ceiling ten feet above you. The air is musty and cold, but your footsteps are strangely muted as you enter. Dust motes hang in the shaft of light emanating from the single opening at the center of the room. Save for a single raised platform in the center of the room, it is nearly featureless.',
  goal: 'Direct the players to the loot, but allow them to choose between caution and greed. Foolhardy players should be slightly punished, but with good rolls, judgment, and intuition, the characters should be able to score some good loot.',
  comments:
    'This is a simple side treasure room. Perhaps if the players are especially curious you may reward them with further world-building clues. Particularly inspired play should prompt impromptu extra rewards of loot or information.',
  elements: [
    {
      id: 'landmark0',
      parentId: null,
      type: 'landmark',
      name: 'Lone Chest',
      description:
        'In the center of the room on a raised pedestal, gleaming in the shaft of light, a stone chest with the dimensions of a small writing desk.',
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.795Z',
    },
    {
      id: 'interactable0',
      parentId: 'landmark0',
      type: 'interactable',
      name: 'Big Lock',
      description: 'The chest has a comically-large padlock holding it shut.',
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.796Z',
    },
    {
      id: 'secret0',
      parentId: 'interactable0',
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
    {
      id: 'secret1',
      parentId: 'interactable0',
      type: 'secret',
      name: 'Modern Lock',
      description:
        "Observant players or characters who inspect the lock might be able to glean that the lock is of modern make. This wouldn't line up the the age of these ruins.",
      rollableSuccess:
        "Player characters, with a successful Investigation or History check, will realize that this lock is not of these ruins. Indeed, with strong successes they might recall that there are no archeological finds supporting the Ancient Orentosi use of padlocks to secure their valuables. With a critical success, they'd notice that there is an embossment on the base of the padlock that resembles the trade seal of the Locksmith's Guild back in Hothenhaus.",
      rollableFailure:
        '"Whoa. I guess a bunch of adventurers who came before us polished this lock real good trying to get it open." Okay, but actually, the characters don\'t notice anything particularly remarkable about the lock. On a close failure, they might still find it slightly odd but not be able to place why.',
      userCreatedAt: '2025-01-20T04:49:02.798Z',
    },
    {
      id: 'interactable1',
      parentId: 'landmark0',
      type: 'interactable',
      name: 'Ornate Stone Filigree Design',
      description:
        "Judging from the filigree on the chest's stonework, it is almost certainly a chest that dates back to Ancient Orentos.",
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.798Z',
    },
    {
      id: 'landmark1',
      parentId: '',
      type: 'landmark',
      name: 'Ornate Stone Filigree Design',
      description:
        "Judging from the filigree on the chest's stonework, it is almost certainly a chest that dates back to Ancient Orentos.",
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.798Z',
    },
  ],
  conversations: [],
};
