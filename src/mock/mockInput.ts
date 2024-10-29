export const mockInput = {
  info: {
    title: 'Luxurious and Cozy Bedroom',
    description:
      'In this luxurious and cozy bedroom, soft sunlight dots the ground. Sheer silky curtains waft in the breeze coming through the slightly ajar windows. There is a faint smell of lavender, and there is nearly no sound, as if the room existed outside of time and space. Even the sound of footsteps is softer in here, as if the walls completely absorb any reverberation.',
    goal: '',
    comments: '',
  },
  elements: [
    {
      id: 1,
      parentId: null,
      type: 'landmark',
      name: 'Bedside Table',
      description: "Simple bedside table with drawers on the bed's east side.",
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 2,
      parentId: null,
      type: 'landmark',
      name: 'Wall Mirror',
      description: 'Large, ornate mirror dominating the west wall of the room.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 3,
      parentId: null,
      type: 'landmark',
      name: 'Footlocker',
      description: 'Average-looking footlocker at the foot of the bed.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 4,
      parentId: null,
      type: 'landmark',
      name: 'Portrait of Young Woman',
      description: 'Portrait of a young woman hanging on the north wall.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 5,
      parentId: null,
      type: 'landmark',
      name: 'Bookshelves',
      description: 'Floor-to-ceiling bookshelves on the east wall.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 6,
      parentId: 1,
      type: 'interactable',
      name: 'Bedside Table Design',
      description:
        'Design of this bedside table much less ornamented than everything else in room.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 7,
      parentId: 1,
      type: 'interactable',
      name: 'Lavender-Scented Candle',
      description:
        'Lavender-scented candle on a silver plate in the middle of the table, freshly put out.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 8,
      parentId: 2,
      type: 'interactable',
      name: 'Mirror Frame',
      description:
        'Frame remarkably ornate, golden filgree juxtaposed with blockish reliefs around the frame.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 9,
      parentId: 3,
      type: 'interactable',
      name: 'Combination Lock',
      description:
        'Combination lock holding the footlocker shut. Heavy in the hand and substantial.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 10,
      parentId: 4,
      type: 'interactable',
      name: 'Faded In Sunlight',
      description: 'Portrait in direct light from windows, paint faded from prolonged exposure.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 11,
      parentId: 5,
      type: 'interactable',
      name: 'Color Coding',
      description:
        'Bookshelves filled with books of several colors, including red, gold, and white.',
      rollable: {
        success: '',
        failure: '',
      },
    },
    {
      id: 12,
      parentId: 7,
      type: 'secret',
      name: 'Silver Plate Underside',
      description:
        'Separate piece of the table in the exact shape of the silver plate on it. Turn to unlock the hidden latch on the mirror frame.',
      rollable: {
        success:
          'On a successful INT/WIS-based roll, the character notices the peculiarity of the construction under the plate, with particularly high rolls allowing them to suspect the presence of a mechanism.',
        failure:
          'On a failed roll, the character might notice an odd shape, or nothing at all if the roll is particularly low.',
      },
    },
    {
      id: 13,
      parentId: 8,
      type: 'secret',
      name: 'Hidden Hinges',
      description:
        'Among the blocky reliefs surrounding the frame are three heavy hinges, designed to perfectly blend into the overall mirror design.',
      rollable: {
        success:
          "On a successful INT/WIS-based roll, the character realizes it's no ordinary mirror, with particularly high rolls allowing them to see the hinges and surmise the presence of a secret door.",
        failure:
          "On a failed roll, the character surmises it's a pretty mirror. Some of the designs look familiar.",
      },
    },
    {
      id: 14,
      parentId: 9,
      type: 'secret',
      name: 'Three-Dot Design',
      description: 'Back of padlock has three-dot design: red, gold, white.',
      rollable: {
        success:
          'On a successful INT-based roll, the character realizes the design is the colors of the crest of the local noble family, and that the lock is painted on, not part of the original design.',
        failure: 'On a failed roll, the character does not notice or recognize three-dot design.',
      },
    },
    {
      id: 15,
      parentId: 9,
      type: 'secret',
      name: 'Loot Inside',
      description:
        'Footlocker likely has loot inside, in a room and house like this, likely keepsakes and jewelry.',
      rollable: {
        success:
          'On a successful DEX/WIS-based roll, the character successfully find gems worth 200GP, with particularly high rolls allowing them to see hidden panel find exotic dagger with same three-dot design',
        failure:
          'On a failed roll, the character fails to open chest, or fails to notice hidden panel',
      },
    },
    {
      id: 16,
      parentId: 11,
      type: 'secret',
      name: 'Color Count',
      description: 'Several books of the same red, gold, and white as the noble colors.',
      rollable: {
        success:
          'On a successful INT/WIS-based roll, the character notices that one volume of each color looks more prominent than the others, with particularly high rolls allowing them to have a hunch that the books are mechanically-keyed in some manner.',
        failure:
          'On a failed roll, the character does not notice anything particularly unusual about the books.',
      },
    },
  ],
};
