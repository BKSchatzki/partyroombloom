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
      userCreatedAt: '2025-01-20T04:49:02.700Z',
    },
    {
      id: 'interactable0',
      parentId: 'landmark0',
      type: 'interactable',
      name: 'Big Lock',
      description: 'The chest has a comically-large padlock holding it shut.',
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.701Z',
    },
    {
      id: 'secret0',
      parentId: 'interactable0',
      type: 'secret',
      name: 'Gold Bars',
      description:
        'If the players are able to open the chest, they will find gold bars neatly stacked to the brim of this large chest. This is a lot of money.',
      rollableSuccess:
        'On a successful slightly difficult check to finesse the lock, the player character is able to open the padlock and open the chest to see what is inside. Alternatively, the player may choose to make a much more difficult attack roll to bash the lock, or open the lock with a spell.',
      rollableFailure:
        'The characters either fail to finesse the tumblers of the lock, or are not able to hit the lock with enough force to open it. The degree of failure can play a part in the narration of how the lock reacts.',
      userCreatedAt: '2025-01-20T04:49:02.702Z',
    },
    {
      id: 'secret1',
      parentId: 'interactable0',
      type: 'secret',
      name: 'Modern Lock',
      description:
        "Observant players or characters who inspect the lock might be able to glean that the lock is of modern make. This wouldn't line up the the age of these ruins.",
      rollableSuccess:
        "Player characters, should they successfully investigate or recall their history, will realize that this lock is not of these ruins. Indeed, with strong successes they might recall that there are no archeological finds supporting the Ancient Orentosi use of padlocks to secure their valuables. With a critical success, they'd notice that there is an embossment on the base of the padlock that resembles the trade seal of the Locksmith's Guild back in Hothenhaus.",
      rollableFailure:
        '"Whoa. I guess a bunch of adventurers who came before us polished this lock real good trying to get it open." Okay, but actually, the characters don\'t notice anything particularly remarkable about the lock. On a close failure, they might still find it slightly odd but not be able to place why.',
      userCreatedAt: '2025-01-20T04:49:02.703Z',
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
      userCreatedAt: '2025-01-20T04:49:02.704Z',
    },
    {
      id: 'landmark1',
      parentId: '',
      type: 'landmark',
      name: 'Ring of Light',
      description:
        'The edge of the base of the platform has a pulsing ring of light. It is a thin, solid, disc, otherwise its brightness would render the room difficult to see in contrast.',
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.705Z',
    },
    {
      id: 'interactable2',
      parentId: 'landmark1',
      type: 'interactable',
      name: 'Getting Brighter',
      description:
        "As you approach the platform, the ring of light starts to pulse, a bright spot on the ring rotating around the base of the platform, speeding up as you get nearer. Once you're right in front of the platform, the rotation is extremely rapid, and the light from the ceiling shining on the platform becomes incredibly bright as well.",
      rollableSuccess: '',
      rollableFailure: '',
      userCreatedAt: '2025-01-20T04:49:02.706Z',
    },
    {
      id: 'secret2',
      parentId: 'interactable2',
      type: 'secret',
      name: 'Solar Hammer',
      description:
        "Assuming players understand the danger, they will attempt to 'turn off' this beam of light somehow. Valid approaches for getting inside are: stepping in while holding an Orentosi Sun Priest Scepter (located elsewhere in the ruins), dispelling the magic with a prayer or spell, and using a reflective object like a shield or mirror as an umbrella while within the circle (the most unhinged solution).",
      rollableSuccess:
        'Should the characters successfully recall religious, arcane, or survival knowledge, they will be able to infer the described solutions. The certainty with which they infer those solutions depends on the degree of success.',
      rollableFailure:
        'As long as the players do not enter the circle without a solution, nothing catastrophic will occur. Should they do so, the entire ring of light focuses and deals a lot of damage to everything inside and blinds everyone in the room for several seconds, though they are able to roll a save to take half. The chest and its contents do remain intact, and the lock melts off.',
      userCreatedAt: '2025-01-20T04:49:02.707Z',
    },
  ],
  conversations: [],
};
