export const mockStructuredChat = [
  {
    role: 'assistant',
    content: {
      headline: 'You find yourself in a luxurious and cozy bedroom.',
      narration: [
        'Soft sunlight dots the ground, filtering through sheer, silky curtains that waft gently in the breeze from the slightly ajar windows. The room smells faintly of lavender, and there is an almost eerie silence, as if the space exists outside of time itself.',
        "Your footsteps are muted, absorbed by the walls, and as you look around, several objects catch your attention: a simple bedside table on the bed's east side, a large ornate mirror on the west wall, an average-looking footlocker at the foot of the bed, a portrait of a young woman on the north wall, and floor-to-ceiling bookshelves on the east wall.",
      ],
      prompt: 'What draws your attention in this quiet room?',
      options: [
        { description: 'Examine the bedside table.', roll: null },
        { description: 'Inspect the wall mirror.', roll: null },
        { description: 'Check out the footlocker.', roll: null },
        { description: 'Look at the portrait of the young woman.', roll: null },
        { description: 'Browse the bookshelves.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: 'Look at the portrait of the young woman.',
      comments: '',
      rollResult: null,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You approach the portrait of the young woman.',
      narration: [
        'The portrait, hanging on the north wall, depicts a young woman with delicate features, her eyes seemingly following you as you move closer. The sunlight streaming in through the window casts a warm glow on the painting, though you notice the colors are slightly faded from prolonged exposure to light.',
        'Her expression is one of gentle melancholy, as if she carries a burden unseen by others.',
      ],
      prompt: 'What would you like to do next? Perhaps you wonder who she is?',
      options: [
        { description: 'Examine the portrait more closely.', roll: null },
        {
          description: 'Try to recall if you recognize her.',
          roll: { attribute: 'INT', skill: 'History', difficultyClass: 14 },
        },
        { description: 'Move on to another object in the room.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: 'Try to recall if you recognize her.',
      comments: "Her face looks familiar, but I can't quite place it.",
      rollResult: 17,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You try to recall the identity of the woman in the portrait.',
      narration: [
        'As you focus on her features, a memory stirs within you. You realize this is Lady Seraphina, the daughter of a noble family from the region. Known for her kindness and wisdom, she was deeply loved by those in her household.',
        'However, the story takes a darker turn—Lady Seraphina mysteriously disappeared years ago, and no trace of her was ever found. The room you stand in now might have been hers, preserved in time, a shrine to her memory.',
      ],
      prompt:
        'How does this revelation affect your exploration of the room? Perhaps this knowledge sheds new light on the other objects here.',
      options: [
        { description: 'Examine the bedside table with this new context.', roll: null },
        { description: 'Inspect the wall mirror, wondering if it holds secrets.', roll: null },
        {
          description:
            'Check out the footlocker, wondering if it contains anything related to Lady Seraphina.',
          roll: null,
        },
        {
          description: 'Browse the bookshelves, searching for any records of Lady Seraphina.',
          roll: null,
        },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice:
        'Check out the footlocker, wondering if it contains anything related to Lady Seraphina.',
      comments: 'Perhaps something of hers is kept in there.',
      rollResult: null,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You decide to check out the footlocker.',
      narration: [
        "The footlocker at the foot of the bed is unassuming at first glance, but with Lady Seraphina in mind, you can't help but wonder if it contains anything of hers.",
        "You notice that the footlocker is secured with a heavy combination lock. The lock feels substantial in your hand, and on closer inspection, you see a faint engraving on the back—a design of three dots in red, gold, and white, the colors of Seraphina's family crest.",
      ],
      prompt:
        'What will you do next? Will you try to figure out the combination or search elsewhere?',
      options: [
        {
          description: 'Try to figure out the combination lock.',
          roll: { attribute: 'INT', skill: 'Investigation', difficultyClass: 16 },
        },
        { description: 'Leave the footlocker for now and examine something else.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: 'Try to figure out the combination lock.',
      comments: 'The three-dot design might be a clue.',
      rollResult: 14,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You attempt to figure out the combination lock.',
      narration: [
        'You examine the combination lock closely, focusing on the three-dot design. Although the design is familiar, you struggle to recall the exact meaning behind it. The lock refuses to yield, and after several attempts, it remains firmly shut.',
        'There might be more clues in the room that could help you solve this puzzle.',
      ],
      prompt:
        'Do you want to continue trying the lock, or would you rather explore other parts of the room?',
      options: [
        {
          description: 'Keep trying to solve the lock.',
          roll: { attribute: 'INT', skill: 'History', difficultyClass: 14 },
        },
        { description: 'Explore another object in the room for more clues.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: 'Explore another object in the room for more clues.',
      comments: 'There might be something else that can help.',
      rollResult: null,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You decide to explore another object for more clues.',
      narration: [
        'With the lock proving difficult, you decide to look elsewhere for clues. Perhaps another object in the room holds the key to unlocking the footlocker.',
        "The bedside table catches your eye once more, its simple design contrasting with the rest of the room's ornate decor.",
      ],
      prompt:
        'Do you wish to return to the bedside table, or is there something else that draws your attention?',
      options: [
        { description: 'Examine the bedside table.', roll: null },
        { description: 'Inspect the wall mirror.', roll: null },
        { description: 'Browse the bookshelves.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: 'Examine the bedside table.',
      comments: '',
      rollResult: null,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You turn your attention back to the bedside table.',
      narration: [
        'The bedside table is much simpler in design compared to the rest of the room, making it stand out in its own way. As you approach, you notice a lavender-scented candle resting on a silver plate. The candle appears to have been freshly extinguished, with a faint wisp of smoke still lingering in the air.',
        'The table has a few drawers—perhaps they hold more clues.',
      ],
      prompt: 'What would you like to do with the bedside table?',
      options: [
        { description: 'Inspect the lavender-scented candle.', roll: null },
        { description: 'Open the drawers of the bedside table.', roll: null },
        { description: 'Move on to another object in the room.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: 'Inspect the lavender-scented candle.',
      comments: '',
      rollResult: null,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You focus on the lavender-scented candle.',
      narration: [
        "As you carefully lift the candle, you notice that the silver plate beneath it is intricately designed and seems to be a separate piece that perfectly fits the table's surface.",
        'The underside of the plate catches your eye—its construction is peculiar, as though it might serve a purpose beyond mere decoration.',
      ],
      prompt:
        'Would you like to investigate the plate further or explore something else in the room?',
      options: [
        {
          description: "Investigate the silver plate's underside.",
          roll: { attribute: 'INT', skill: 'Investigation', difficultyClass: 12 },
        },
        { description: 'Examine the drawers of the bedside table.', roll: null },
        { description: 'Move on to another object in the room.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: "Investigate the silver plate's underside.",
      comments: 'There might be something hidden here.',
      rollResult: 19,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: "You investigate the silver plate's underside.",
      narration: [
        "You carefully turn the silver plate over, and as you examine it, you notice a small latch concealed within the design. With a gentle press, the latch clicks open, revealing a hidden compartment beneath the table's surface.",
        "Inside, you find a small key. Could this be the key to the footlocker's combination or something else in the room?",
      ],
      prompt:
        'What will you do with the key? Will you return to the footlocker, or explore other possibilities?',
      options: [
        { description: 'Try the key on the footlocker.', roll: null },
        { description: 'Examine the mirror to see if it has a keyhole.', roll: null },
        { description: 'Look around for any other keyholes in the room.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: 'Try the key on the footlocker.',
      comments: '',
      rollResult: null,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You decide to try the key on the footlocker.',
      narration: [
        'With the small key in hand, you return to the footlocker, your heart racing with anticipation. You insert the key into the combination lock, and with a soft click, the lock disengages.',
        "The footlocker opens to reveal a collection of personal belongings—jewelry, letters, and a small, ornate box. The box is engraved with the same three-dot design in red, gold, and white. Inside the box, you find a delicate locket with Lady Seraphina's portrait and a note addressed to someone close to her.",
      ],
      prompt:
        'What will you do next? Will you read the note or explore the other items in the footlocker?',
      options: [
        { description: 'Read the note.', roll: null },
        { description: 'Examine the jewelry.', roll: null },
        { description: 'Look through the letters.', roll: null },
      ],
    },
  },
  {
    role: 'user',
    content: {
      choice: 'Read the note.',
      comments: 'The note might reveal something important.',
      rollResult: null,
    },
  },
  {
    role: 'assistant',
    content: {
      headline: 'You decide to read the note.',
      narration: [
        'You carefully unfold the note, the paper aged and delicate. The handwriting is elegant, clearly belonging to someone who took great care with their words.',
        "The note is addressed to 'My Dearest,' and speaks of Lady Seraphina's deep love and trust for the recipient. It hints at a secret, something she feared would bring ruin to her family if discovered. She entrusted the locket to this person, hoping it would keep them safe.",
      ],
      prompt:
        'How does this new information affect your understanding of the room and its secrets?',
      options: [
        {
          description: 'Examine the locket more closely.',
          roll: { attribute: 'WIS', skill: 'Insight', difficultyClass: 14 },
        },
        { description: 'Search the room for anything related to this secret.', roll: null },
        { description: 'Explore another item in the footlocker.', roll: null },
      ],
    },
  },
];
