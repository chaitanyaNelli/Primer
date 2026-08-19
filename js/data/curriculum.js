/**
 * THE PRIMER — ENHANCED MULTI-REALM CURRICULUM DATABASE
 * Rich multi-level curriculum across Reading, Phonics, Writing, and Mathematics.
 */

export const CURRICULUM = {
  // ==========================================
  // 1. READING & PHONICS REALM
  // ==========================================
  reading: {
    levels: [
      {
        id: 'read_cvc_1',
        title: 'Level 1: Short Vowel Alchemy (CVC)',
        sublevel: 'Foundation Phonics',
        description: 'Blend initial consonant, short vowel, and final sound.',
        words: [
          { word: 'SUN', phonemes: ['S', 'U', 'N'], emoji: '☀️', hint: 'The bright star that lights our day', syllables: ['SUN'] },
          { word: 'CAT', phonemes: ['C', 'A', 'T'], emoji: '🐱', hint: 'A soft furry friend that purrs', syllables: ['CAT'] },
          { word: 'FOX', phonemes: ['F', 'O', 'X'], emoji: '🦊', hint: 'A clever forest animal with a bushy tail', syllables: ['FOX'] },
          { word: 'BUG', phonemes: ['B', 'U', 'G'], emoji: '🐞', hint: 'A tiny spotted crawler on a leaf', syllables: ['BUG'] },
          { word: 'MAP', phonemes: ['M', 'A', 'P'], emoji: '🗺️', hint: 'Shows secret paths of the world', syllables: ['MAP'] },
          { word: 'GEM', phonemes: ['G', 'E', 'M'], emoji: '💎', hint: 'A sparkling crystal from the mountain', syllables: ['GEM'] },
          { word: 'BAT', phonemes: ['B', 'A', 'T'], emoji: '🦇', hint: 'A night-flying creature with velvet wings', syllables: ['BAT'] },
          { word: 'PIG', phonemes: ['P', 'I', 'G'], emoji: '🐷', hint: 'A cheerful pink farm friend with a curly tail', syllables: ['PIG'] }
        ]
      },
      {
        id: 'read_blends_2',
        title: 'Level 2: Elemental Blends & Digraphs',
        sublevel: 'Consonant Harmony',
        description: 'Master combined sounds like ST, SH, CH, CL, and FR.',
        words: [
          { word: 'STAR', phonemes: ['ST', 'A', 'R'], emoji: '⭐', hint: 'A shining diamond in the night sky', syllables: ['STAR'] },
          { word: 'SHIP', phonemes: ['SH', 'I', 'P'], emoji: '⛵', hint: 'Sails across the ocean waves', syllables: ['SHIP'] },
          { word: 'FROG', phonemes: ['FR', 'O', 'G'], emoji: '🐸', hint: 'Hops from lily pad to lily pad', syllables: ['FROG'] },
          { word: 'DRUM', phonemes: ['DR', 'U', 'M'], emoji: '🥁', hint: 'Beats a rhythm in the royal hall', syllables: ['DRUM'] },
          { word: 'CRAB', phonemes: ['CR', 'A', 'B'], emoji: '🦀', hint: 'Scuttles across the sandy beach', syllables: ['CRAB'] },
          { word: 'MOON', phonemes: ['M', 'OO', 'N'], emoji: '🌙', hint: 'Glows softly in the midnight sky', syllables: ['MOON'] }
        ]
      },
      {
        id: 'read_magic_e_3',
        title: 'Level 3: Magic E & Long Vowels',
        sublevel: 'Vowel Enchantments',
        description: 'Silent E transforms short vowels into their strong names.',
        words: [
          { word: 'CAKE', phonemes: ['C', 'A_E', 'K'], emoji: '🎂', hint: 'A sweet dessert baked for celebrations', syllables: ['CAKE'] },
          { word: 'KITE', phonemes: ['K', 'I_E', 'T'], emoji: '🪁', hint: 'Soars high dancing on the wind', syllables: ['KITE'] },
          { word: 'ROSE', phonemes: ['R', 'O_E', 'S'], emoji: '🌹', hint: 'A fragrant crimson garden flower', syllables: ['ROSE'] },
          { word: 'CUBE', phonemes: ['C', 'U_E', 'B'], emoji: '🧊', hint: 'A 3D block with six equal square faces', syllables: ['CUBE'] }
        ]
      }
    ],
    stories: [
      {
        id: 'story_star_dragon',
        title: 'The Starlight Dragon',
        theme: 'Dragons & Space',
        illustration: '🐉✨',
        caption: 'Pip the dragon watching celestial stars tumble into the silver lake.',
        pages: [
          {
            text: 'High upon the velvet mountain, little Pip the dragon saw a bright golden star fall into the lake.',
            words: ['High', 'upon', 'the', 'velvet', 'mountain,', 'little', 'Pip', 'the', 'dragon', 'saw', 'a', 'bright', 'golden', 'star', 'fall', 'into', 'the', 'lake.'],
            focusWords: ['dragon', 'star', 'bright', 'golden'],
            question: 'Where did the golden star fall?',
            options: ['Into the lake', 'On a treetop', 'Behind a castle'],
            correctIndex: 0
          },
          {
            text: 'Pip leaped into the cool blue water with a gentle splash and found the glowing star resting on a silver rock.',
            words: ['Pip', 'leaped', 'into', 'the', 'cool', 'blue', 'water', 'with', 'a', 'gentle', 'splash', 'and', 'found', 'the', 'glowing', 'star', 'resting', 'on', 'a', 'silver', 'rock.'],
            focusWords: ['water', 'splash', 'glowing', 'silver'],
            question: 'What was the star resting on?',
            options: ['A silver rock', 'A green shell', 'A pirate ship'],
            correctIndex: 0
          },
          {
            text: 'The star gently spoke: "Thank you, Pip! Whenever you look up at night, I will shine a beacon just for you."',
            words: ['The', 'star', 'gently', 'spoke:', '"Thank', 'you,', 'Pip!', 'Whenever', 'you', 'look', 'up', 'at', 'night,', 'I', 'will', 'shine', 'a', 'beacon', 'just', 'for', 'you."'],
            focusWords: ['gently', 'beacon', 'shine', 'night'],
            question: 'What did the star promise to shine?',
            options: ['A beacon just for Pip', 'A flashlight', 'A rainbow beam'],
            correctIndex: 0
          }
        ]
      },
      {
        id: 'story_space_rover',
        title: 'Rover Pip on the Moon',
        theme: 'Space & Robots',
        illustration: '🚀🌕',
        caption: 'Rover Pip rolling across the gleaming lunar craters.',
        pages: [
          {
            text: 'Rover Pip landed on the silver moon and sent a cheerful beep across the starry cosmos.',
            words: ['Rover', 'Pip', 'landed', 'on', 'the', 'silver', 'moon', 'and', 'sent', 'a', 'cheerful', 'beep', 'across', 'the', 'starry', 'cosmos.'],
            focusWords: ['moon', 'silver', 'landed', 'cheerful'],
            question: 'Who did Rover Pip send a beep to?',
            options: ['Across the starry cosmos', 'To Mars', 'To the sun'],
            correctIndex: 0
          },
          {
            text: 'Deep inside a crystal crater, Rover Pip discovered glowing space geodes that sparkled with warm purple light.',
            words: ['Deep', 'inside', 'a', 'crystal', 'crater,', 'Rover', 'Pip', 'discovered', 'glowing', 'space', 'geodes', 'that', 'sparkled', 'with', 'warm', 'purple', 'light.'],
            focusWords: ['crystal', 'crater', 'discovered', 'sparkled'],
            question: 'What did Rover Pip find in the crater?',
            options: ['Glowing space geodes', 'A sand castle', 'A space apple'],
            correctIndex: 0
          }
        ]
      },
      {
        id: 'story_deep_sea',
        title: 'The Deep Sea Pearl of Lumina',
        theme: 'Deep Ocean',
        illustration: '🐬🌊',
        caption: 'Lumina the playful dolphin gliding through the radiant coral gardens.',
        pages: [
          {
            text: 'Lumina the dolphin dove down into the coral gardens where bioluminescent jellyfish floated like gentle lanterns.',
            words: ['Lumina', 'the', 'dolphin', 'dove', 'down', 'into', 'the', 'coral', 'gardens', 'where', 'bioluminescent', 'jellyfish', 'floated', 'like', 'gentle', 'lanterns.'],
            focusWords: ['dolphin', 'coral', 'gardens', 'lanterns'],
            question: 'What floated like gentle lanterns?',
            options: ['Bioluminescent jellyfish', 'Gold coins', 'Sea anemones'],
            correctIndex: 0
          },
          {
            text: 'At the bottom of the reef, a giant clam opened slowly to share the singing Pearl of Lumina.',
            words: ['At', 'the', 'bottom', 'of', 'the', 'reef,', 'a', 'giant', 'clam', 'opened', 'slowly', 'to', 'share', 'the', 'singing', 'Pearl', 'of', 'Lumina.'],
            focusWords: ['bottom', 'giant', 'clam', 'singing'],
            question: 'What was inside the giant clam?',
            options: ['The singing Pearl', 'A treasure chest', 'A magic key'],
            correctIndex: 0
          }
        ]
      },
      {
        id: 'story_cosmic_bakery',
        title: 'The Gravity Muffin Bakery',
        theme: 'Magic & Food',
        illustration: '🧁✨',
        caption: 'Master Baker Oliver whisking zero-gravity batter into floating clouds.',
        pages: [
          {
            text: 'In the celestial clouds, Baker Oliver whipped starlight sugar into floating zero-gravity muffin cups.',
            words: ['In', 'the', 'celestial', 'clouds,', 'Baker', 'Oliver', 'whipped', 'starlight', 'sugar', 'into', 'floating', 'zero-gravity', 'muffin', 'cups.'],
            focusWords: ['celestial', 'whipped', 'starlight', 'floating'],
            question: 'What kind of sugar did Oliver whip?',
            options: ['Starlight sugar', 'Brown sugar', 'Maple syrup'],
            correctIndex: 0
          },
          {
            text: 'Each muffin that came out of the oven gently hovered in the air like a tiny edible hot-air balloon!',
            words: ['Each', 'muffin', 'that', 'came', 'out', 'of', 'the', 'oven', 'gently', 'hovered', 'in', 'the', 'air', 'like', 'a', 'tiny', 'edible', 'hot-air', 'balloon!'],
            focusWords: ['hovered', 'edible', 'balloon', 'oven'],
            question: 'How did the muffins behave?',
            options: ['Hovered like hot-air balloons', 'Fell to the floor', 'Turned into stones'],
            correctIndex: 0
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. WRITING & HANDWRITING REALM
  // ==========================================
  writing: {
    runes: [
      {
        char: 'A',
        type: 'uppercase',
        hint: 'Start at the top star, slide down left, slide down right, bridge the middle!',
        guidePoints: [
          { x: 180, y: 40 },
          { x: 70, y: 250 },
          { x: 180, y: 40 },
          { x: 290, y: 250 },
          { x: 120, y: 160 },
          { x: 240, y: 160 }
        ]
      },
      {
        char: 'B',
        type: 'uppercase',
        hint: 'Line straight down, go back to top, round the upper belly, round the lower belly!',
        guidePoints: [
          { x: 100, y: 40 },
          { x: 100, y: 250 },
          { x: 100, y: 40 },
          { x: 220, y: 90 },
          { x: 100, y: 140 },
          { x: 230, y: 195 },
          { x: 100, y: 250 }
        ]
      },
      {
        char: 'S',
        type: 'uppercase',
        hint: 'Curve left like the crescent moon, swoop across, curve forward!',
        guidePoints: [
          { x: 250, y: 70 },
          { x: 180, y: 40 },
          { x: 100, y: 90 },
          { x: 180, y: 140 },
          { x: 260, y: 200 },
          { x: 180, y: 255 },
          { x: 90, y: 220 }
        ]
      },
      {
        char: '8',
        type: 'number',
        hint: 'Make an S and do not wait, climb back up to close the eight!',
        guidePoints: [
          { x: 180, y: 40 },
          { x: 110, y: 90 },
          { x: 180, y: 140 },
          { x: 250, y: 200 },
          { x: 180, y: 260 },
          { x: 110, y: 200 },
          { x: 180, y: 140 },
          { x: 250, y: 90 },
          { x: 180, y: 40 }
        ]
      },
      {
        char: '⭐',
        type: 'celestial_rune',
        hint: 'Draw the 5-point cosmic star without lifting your stylus!',
        guidePoints: [
          { x: 180, y: 40 },
          { x: 220, y: 250 },
          { x: 80, y: 120 },
          { x: 280, y: 120 },
          { x: 140, y: 250 },
          { x: 180, y: 40 }
        ]
      }
    ],
    storyPrompts: [
      {
        id: 'prompt_forest_secret',
        starter: 'Deep inside the whispering crystal forest, you find a tiny golden key wrapped in glowing ivy...',
        question: 'What door or chest does this magical key unlock?',
        suggestedWords: ['crystal chest', 'secret tree door', 'music box', 'dragon vault', 'star portal']
      },
      {
        id: 'prompt_submarine',
        starter: 'Your submarine turns on its floodlights in the deep ocean trench, illuminating a castle made entirely of pearls...',
        question: 'Who comes out of the pearl castle to greet you?',
        suggestedWords: ['mermaid queen', 'glowing octopus', 'sea turtle elder', 'dolphin knight', 'coral sprite']
      },
      {
        id: 'prompt_space_station',
        starter: 'You step out of the lunar airlock and see footprints made of sparkling stardust leading over the crater ridge...',
        question: 'What friendly alien or secret machine is waiting over the hill?',
        suggestedWords: ['starlight puppy', 'telescope rover', 'friendly robot', 'galaxy gardener', 'crystal beacon']
      }
    ]
  },

  // ==========================================
  // 3. MATHEMATICS REALM
  // ==========================================
  math: {
    tenFrameChallenges: [
      {
        id: 'tf_1',
        title: 'Level 1: Making 10 with Starlight Orbs',
        instruction: 'We have 6 amber orbs. Place enough crystals to fill the ten-frame (10 in total)!',
        initialCount: 6,
        targetSum: 10,
        correctAnswer: 4,
        hintMetaphor: 'Imagine a carton that holds 10 crystals. 6 are inside — how many empty spots?'
      },
      {
        id: 'tf_2',
        title: 'Level 2: Summoning 7 Crystals',
        instruction: 'There are 3 blue gems. Add more gems until there are exactly 7 on the board!',
        initialCount: 3,
        targetSum: 7,
        correctAnswer: 4,
        hintMetaphor: 'Start from 3, and count up: 4, 5, 6, 7!'
      },
      {
        id: 'tf_3',
        title: 'Level 3: Double Five Symmetry',
        instruction: 'Place 9 orbs to charge the celestial beacon. (Notice only 1 empty slot remains!)',
        initialCount: 5,
        targetSum: 9,
        correctAnswer: 4,
        hintMetaphor: '5 on top row + 4 on bottom row = 9!'
      }
    ],
    balanceScaleChallenges: [
      {
        id: 'scale_1',
        title: 'Level 1: Single Weight Balance',
        leftWeights: [5, 3], // Total 8
        rightWeights: [4],   // Needs 4
        targetMissingWeight: 4,
        options: [2, 4, 6, 8],
        instruction: 'Left pan: 5 + 3 = 8. Right pan has 4. What weight makes the beam perfectly level?'
      },
      {
        id: 'scale_2',
        title: 'Level 2: Celestial Gem Equivalence',
        leftWeights: [6, 4], // Total 10
        rightWeights: [7],   // Needs 3
        targetMissingWeight: 3,
        options: [1, 2, 3, 5],
        instruction: 'Left pan: 6 + 4 = 10. Right pan has 7. What gem completes 10?'
      },
      {
        id: 'scale_3',
        title: 'Level 3: Dual Gem Sum',
        leftWeights: [9],    // Total 9
        rightWeights: [3, 2], // Total 5, needs 4
        targetMissingWeight: 4,
        options: [2, 4, 5, 6],
        instruction: 'Left side: 9. Right side has 3 + 2 = 5. What weight restores perfect balance?'
      }
    ],
    fractionChallenges: [
      {
        id: 'frac_1',
        title: 'Level 1: Lunar Pizza Halves (2/4)',
        instruction: 'The pizza is sliced into 4 equal pieces. 2 slices are golden cheese. What fraction is that?',
        totalSlices: 4,
        selectedSlices: 2,
        fractionName: '2/4 or 1/2',
        options: ['1/4', '2/4 (Half)', '3/4', '4/4'],
        correctIndex: 1
      },
      {
        id: 'frac_2',
        title: 'Level 2: The Solar Gem Thirds (1/3)',
        instruction: 'The crystal is divided into 3 equal parts. 1 part is glowing emerald. What fraction is shaded?',
        totalSlices: 3,
        selectedSlices: 1,
        fractionName: '1/3',
        options: ['1/3', '2/3', '3/3', '1/2'],
        correctIndex: 0
      },
      {
        id: 'frac_3',
        title: 'Level 3: Three Quarters (3/4)',
        instruction: '3 out of 4 potion flasks are filled with purple stardust. What fraction is filled?',
        totalSlices: 4,
        selectedSlices: 3,
        fractionName: '3/4',
        options: ['1/4', '2/4', '3/4', '4/4'],
        correctIndex: 2
      }
    ],
    numberLineChallenges: [
      {
        id: 'nl_1',
        title: 'Level 1: Starlight Rover Addition',
        startPos: 3,
        hopDistance: 5,
        operation: '+',
        targetPos: 8,
        instruction: 'Start at number 3 and jump forward 5 spaces (+5). Where does your rover land?'
      },
      {
        id: 'nl_2',
        title: 'Level 2: Froggy River Subtraction',
        startPos: 9,
        hopDistance: 4,
        operation: '-',
        targetPos: 5,
        instruction: 'Froggy starts at lily pad 9 and hops backward 4 spaces (-4). Where is Froggy now?'
      },
      {
        id: 'nl_3',
        title: 'Level 3: Double Hop Challenge',
        startPos: 2,
        hopDistance: 6,
        operation: '+',
        targetPos: 8,
        instruction: 'Start at 2 and leap 6 numbers forward (+6). Land your rover on the target!'
      }
    ]
  },

  // ==========================================
  // 4. PERSONALIZATION THEMES
  // ==========================================
  themes: [
    { id: 'dragons', name: 'Mystic Dragons & Mountain Castles', icon: '🐉', companionGreet: 'Welcome, brave Dragon Rider!' },
    { id: 'space', name: 'Cosmic Space & Lunar Explorers', icon: '🚀', companionGreet: 'Greetings, Star Explorer!' },
    { id: 'ocean', name: 'Deep Ocean & Coral Kingdoms', icon: '🐬', companionGreet: 'Ahoy, Marine Adventurer!' },
    { id: 'forest', name: 'Whispering Forest & Clockwork Fox', icon: '🦊', companionGreet: 'Hello, Woodland Guardian!' }
  ]
};
