/**
 * Song database — hand-written Exercise objects for well-known melodies.
 * All songs: Public Domain, grand staff with simple bass accompaniment.
 *
 * Bass design: Pedagogical approach — simple root notes (whole/dotted-half)
 * to provide harmonic foundation without overwhelming beginners.
 * Fingerings: 5 for root notes, 1 for fifths (where root-fifth pattern).
 */
import type { Song, SongCategory } from '../types/songs';

export const CATEGORY_LABELS: Record<SongCategory, string> = {
  kinderlieder: 'Kinderlieder',
  klassiker: 'Klassiker',
  internationale: 'Internationale',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Anfaenger',
  easy: 'Leicht',
  elementary: 'Elementar',
};

// ─── 1. Alle meine Entchen ──────────────────────────────────────
// C D E F | G G | A A A A | G - |
// A A A A | G - | F F F F | E E |
// D D D D | C - - - ||
// Bass: I I IV V | I I IV I | V I
const alleMeineEntchen: Song = {
  id: 'song_alle_meine_entchen',
  level: 1,
  name: 'Alle meine Entchen',
  description: 'Bekanntes deutsches Kinderlied',
  difficulty: 'beginner',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 100,
  songMeta: {
    category: 'kinderlieder',
    composer: 'Traditional',
    lyrics: 'Alle meine Entchen schwimmen auf dem See...',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['g/4'], duration: 'h' },
      { keys: ['g/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['g/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['g/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['e/4'], duration: 'h' },
      { keys: ['e/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 9, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 10, notes: [
      { keys: ['c/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
  ],
};

// ─── 2. Haenschen klein ─────────────────────────────────────────
// G E E - | F D D - | C D E F | G G G - |
// G E E - | F D D - | C E G G | C - - - ||
// Bass: I V | IV V | I IV | V I
const haenschenKlein: Song = {
  id: 'song_haenschen_klein',
  level: 1,
  name: 'Haenschen klein',
  description: 'Beliebtes deutsches Kinderlied',
  difficulty: 'beginner',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 108,
  songMeta: {
    category: 'kinderlieder',
    composer: 'Traditional',
    lyrics: 'Haenschen klein ging allein in die weite Welt hinein...',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['c/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
  ],
};

// ─── 3. Bruder Jakob (Frere Jacques) ────────────────────────────
// C D E C | C D E C | E F G - | E F G - |
// G A G F E C | G A G F E C | C G3 C - | C G3 C - ||
// Bass: I I | I I | I V | I V | I I | I V | I V | I I
const bruderJakob: Song = {
  id: 'song_bruder_jakob',
  level: 1,
  name: 'Bruder Jakob',
  description: 'Internationaler Kanon (Frere Jacques)',
  difficulty: 'beginner',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 112,
  songMeta: {
    category: 'kinderlieder',
    composer: 'Traditional',
    lyrics: 'Bruder Jakob, Bruder Jakob, schlaefst du noch?',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['g/4'], duration: '8' },
      { keys: ['a/4'], duration: '8' },
      { keys: ['g/4'], duration: '8' },
      { keys: ['f/4'], duration: '8' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['g/4'], duration: '8' },
      { keys: ['a/4'], duration: '8' },
      { keys: ['g/4'], duration: '8' },
      { keys: ['f/4'], duration: '8' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['g/3'], duration: 'q' },
      { keys: ['c/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    { number: 8, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['g/3'], duration: 'q' },
      { keys: ['c/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
  ],
};

// ─── 4. Summ Summ Summ ─────────────────────────────────────────
// G E. E | F D. D | C D E F | G G G - |
// A A A A | G - - - | F F F F | E E |
// D D D D | C - - - ||
// Bass: I V | IV V | I IV | V I | IV I
const summSummSumm: Song = {
  id: 'song_summ_summ_summ',
  level: 1,
  name: 'Summ Summ Summ',
  description: 'Bienchen summ herum',
  difficulty: 'beginner',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 100,
  songMeta: {
    category: 'kinderlieder',
    composer: 'Traditional',
    lyrics: 'Summ, summ, summ, Bienchen summ herum...',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'qd' },
      { keys: ['e/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'qd' },
      { keys: ['d/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['g/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['e/4'], duration: 'h' },
      { keys: ['e/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 9, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 10, notes: [
      { keys: ['c/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
  ],
};

// ─── 5. Kuckuck, Kuckuck (3/4) ─────────────────────────────────
// In F major, 3/4 time
// A F - | A F - | G G E | C D E |
// F - F | E - E | D E D | C - - ||
// Bass: I I | V IV | I V | IV I (dotted halves)
const kuckuckKuckuck: Song = {
  id: 'song_kuckuck',
  level: 1,
  name: 'Kuckuck, Kuckuck',
  description: 'Kuckuck, Kuckuck, rufts aus dem Wald',
  difficulty: 'easy',
  timeSignature: '3/4',
  keySignature: 'F',
  clef: 'treble',
  grandStaff: true,
  tempo: 120,
  songMeta: {
    category: 'kinderlieder',
    composer: 'Traditional',
    lyrics: 'Kuckuck, Kuckuck, rufts aus dem Wald...',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['f/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['f/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['f/4'], duration: 'h' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['e/4'], duration: 'h' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['bb/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['c/4'], duration: 'hd' },
    ], bassNotes: [
      { keys: ['f/2'], duration: 'hd', fingering: 5 },
    ]},
  ],
};

// ─── 6. Alle Voegel sind schon da ───────────────────────────────
// C E G G | A G F E | D E F F | E - - - |
// C E G G | A G F E | D F E D | C - - - |
// F F F F | F E D - | G G G G | G F E - ||
// Bass: I V | IV I | II V | I I | IV IV | V I
const alleVoegel: Song = {
  id: 'song_alle_voegel',
  level: 1,
  name: 'Alle Voegel sind schon da',
  description: 'Fruehlingslied',
  difficulty: 'easy',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 108,
  songMeta: {
    category: 'kinderlieder',
    composer: 'Traditional',
    lyrics: 'Alle Voegel sind schon da, alle Voegel, alle...',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['e/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['c/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 9, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 10, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 11, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 12, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
  ],
};

// ─── 7. Twinkle Twinkle Little Star ─────────────────────────────
// C C G G | A A G - | F F E E | D D C - |
// G G F F | E E D - | G G F F | E E D - |
// C C G G | A A G - | F F E E | D D C - ||
// Bass: I-V alternation pattern for I-V-IV-I harmonic movement
const twinkleTwinkle: Song = {
  id: 'song_twinkle_twinkle',
  level: 1,
  name: 'Twinkle Twinkle Little Star',
  description: 'Bekannte Kindermelodie (auch: Morgen kommt der Weihnachtsmann)',
  difficulty: 'beginner',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 96,
  songMeta: {
    category: 'internationale',
    composer: 'Traditional',
    lyrics: 'Twinkle, twinkle, little star, how I wonder what you are...',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 9, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 10, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 11, notes: [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 12, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
  ],
};

// ─── 8. Mary Had a Little Lamb ──────────────────────────────────
// E D C D | E E E - | D D D - | E G G - |
// E D C D | E E E E | D D E D | C - - - ||
// Bass: I V | I V | V V | I I | V I
const maryHadALittleLamb: Song = {
  id: 'song_mary_had_a_little_lamb',
  level: 1,
  name: 'Mary Had a Little Lamb',
  description: 'Klassisches englisches Kinderlied',
  difficulty: 'beginner',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 104,
  songMeta: {
    category: 'internationale',
    composer: 'Traditional',
    lyrics: 'Mary had a little lamb, little lamb, little lamb...',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['c/4'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
  ],
};

// ─── 9. Ode an die Freude (Beethoven, simplified) ───────────────
// E E F G | G F E D | C C D E | E D D - |
// E E F G | G F E D | C C D E | D C C - |
// D D E C | D EF E C | D EF E D | C D G3 - |
// E E F G | G F E D | C C D E | D C C - ||
// Bass: Root-Fifth halves for slightly more active accompaniment
const odeAnDieFreude: Song = {
  id: 'song_ode_an_die_freude',
  level: 1,
  name: 'Ode an die Freude',
  description: 'Beethovens beruhmte Melodie aus der 9. Sinfonie',
  difficulty: 'elementary',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 100,
  songMeta: {
    category: 'klassiker',
    composer: 'Ludwig van Beethoven',
    lyrics: 'Freude, schoener Goetterfunken, Tochter aus Elysium...',
  },
  bars: [
    // A section
    { number: 1, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    { number: 2, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    { number: 3, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['e/4'], duration: 'qd' },
      { keys: ['d/4'], duration: '8' },
      { keys: ['d/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 5 },
    ]},
    // A' section
    { number: 5, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    { number: 6, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    { number: 7, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['d/4'], duration: 'qd' },
      { keys: ['c/4'], duration: '8' },
      { keys: ['c/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    // B section
    { number: 9, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 10, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: '8' },
      { keys: ['f/4'], duration: '8' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 11, notes: [
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: '8' },
      { keys: ['f/4'], duration: '8' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 12, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['g/3'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    // A'' section (recap)
    { number: 13, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    { number: 14, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    { number: 15, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 16, notes: [
      { keys: ['d/4'], duration: 'qd' },
      { keys: ['c/4'], duration: '8' },
      { keys: ['c/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
  ],
};

// ─── 10. Happy Birthday (3/4) ───────────────────────────────────
// Auftakt: G G |
// A G C | B - G | G A G | D C - |
// G G G5 | E C B | A F F | E C D | C - - ||
// Bass: Dotted halves (pickup bar = rest), I-V-I-IV-I-IV-V-I
const happyBirthday: Song = {
  id: 'song_happy_birthday',
  level: 1,
  name: 'Happy Birthday',
  description: 'Das bekannteste Geburtstagslied der Welt',
  difficulty: 'elementary',
  timeSignature: '3/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 108,
  songMeta: {
    category: 'internationale',
    composer: 'Traditional',
    lyrics: 'Happy birthday to you, happy birthday to you...',
  },
  bars: [
    // Anacrusis (pickup) — 2 eighth notes, bass rests
    { number: 1, notes: [
      { keys: ['b/4'], duration: 'qr' },
      { keys: ['g/4'], duration: '8' },
      { keys: ['g/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hdr' },
    ]},
    { number: 2, notes: [
      { keys: ['a/4'], duration: 'h' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['c/5'], duration: 'h' },
      { keys: ['b/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'hd', fingering: 5 },
    ]},
    // "happy birthday to you" (2nd)
    { number: 4, notes: [
      { keys: ['b/4'], duration: 'qr' },
      { keys: ['g/4'], duration: '8' },
      { keys: ['g/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hdr' },
    ]},
    { number: 5, notes: [
      { keys: ['a/4'], duration: 'h' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['d/5'], duration: 'h' },
      { keys: ['c/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'hd', fingering: 5 },
    ]},
    // "happy birthday dear [name]"
    { number: 7, notes: [
      { keys: ['b/4'], duration: 'qr' },
      { keys: ['g/4'], duration: '8' },
      { keys: ['g/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hdr' },
    ]},
    { number: 8, notes: [
      { keys: ['g/5'], duration: 'h' },
      { keys: ['e/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 9, notes: [
      { keys: ['c/5'], duration: 'q' },
      { keys: ['b/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'hd', fingering: 5 },
    ]},
    // "happy birthday to you" (final)
    { number: 10, notes: [
      { keys: ['b/4'], duration: 'qr' },
      { keys: ['f/5'], duration: '8' },
      { keys: ['f/5'], duration: '8' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hdr' },
    ]},
    { number: 11, notes: [
      { keys: ['e/5'], duration: 'h' },
      { keys: ['c/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 12, notes: [
      { keys: ['d/5'], duration: 'h' },
      { keys: ['c/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'q', fingering: 5 },
    ]},
  ],
};

// ─── 11. Fuer Elise — Hauptthema (Beethoven, simplified) ────────
// Original: 3/8, 16th notes. Simplified: 3/4, 8th notes.
// The iconic tremolo opening E-D#-E-D#-E-B-D-C → A resolution,
// followed by Am and E arpeggios, then repeat with ascending ending.
// Key: Am (no sharps/flats in key sig, D# and G# are accidentals)
const fuerElise: Song = {
  id: 'song_fuer_elise',
  level: 1,
  name: 'Fuer Elise (Hauptthema)',
  description: 'Beethovens beruehmtestes Klavierstueck',
  difficulty: 'elementary',
  timeSignature: '3/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 80,
  songMeta: {
    category: 'klassiker',
    composer: 'Ludwig van Beethoven',
  },
  bars: [
    // Iconic tremolo opening
    { number: 1, notes: [
      { keys: ['e/5'], duration: '8' },
      { keys: ['d#/5'], duration: '8' },
      { keys: ['e/5'], duration: '8' },
      { keys: ['d#/5'], duration: '8' },
      { keys: ['e/5'], duration: '8' },
      { keys: ['b/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'hd', fingering: 5 },
    ]},
    // Descending to A
    { number: 2, notes: [
      { keys: ['d/5'], duration: 'q' },
      { keys: ['c/5'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'hd', fingering: 5 },
    ]},
    // Am arpeggio (C-E-A)
    { number: 3, notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'hd', fingering: 5 },
    ]},
    // E major arpeggio (E-G#-B)
    { number: 4, notes: [
      { keys: ['e/4'], duration: 'q' },
      { keys: ['g#/4'], duration: 'q' },
      { keys: ['b/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['e/2'], duration: 'hd', fingering: 5 },
    ]},
    // Repeat tremolo opening
    { number: 5, notes: [
      { keys: ['e/5'], duration: '8' },
      { keys: ['d#/5'], duration: '8' },
      { keys: ['e/5'], duration: '8' },
      { keys: ['d#/5'], duration: '8' },
      { keys: ['e/5'], duration: '8' },
      { keys: ['b/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'hd', fingering: 5 },
    ]},
    // Descending to A again
    { number: 6, notes: [
      { keys: ['d/5'], duration: 'q' },
      { keys: ['c/5'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'hd', fingering: 5 },
    ]},
    // Ascending close: C-E-A-B-C
    { number: 7, notes: [
      { keys: ['c/4'], duration: '8' },
      { keys: ['e/4'], duration: '8' },
      { keys: ['a/4'], duration: '8' },
      { keys: ['b/4'], duration: '8' },
      { keys: ['c/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'hd', fingering: 5 },
    ]},
    // Final resolution
    { number: 8, notes: [
      { keys: ['a/4'], duration: 'hd' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'hd', fingering: 5 },
    ]},
  ],
};

// ─── 12. Menuett in G-Dur (Petzold, attr. Bach) ────────────────
// BWV Anh. 114 from the Notebook for Anna Magdalena Bach.
// One of the most performed beginner classical pieces.
// Original is already beginner-friendly (quarters + eighths in 3/4).
const menuettGDur: Song = {
  id: 'song_menuett_g_dur',
  level: 1,
  name: 'Menuett in G-Dur',
  description: 'Beruehmt aus dem Notenbuch der Anna Magdalena Bach',
  difficulty: 'elementary',
  timeSignature: '3/4',
  keySignature: 'G',
  clef: 'treble',
  grandStaff: true,
  tempo: 108,
  songMeta: {
    category: 'klassiker',
    composer: 'Christian Petzold',
  },
  bars: [
    { number: 1, notes: [
      { keys: ['d/5'], duration: 'q' },
      { keys: ['g/4'], duration: '8' },
      { keys: ['a/4'], duration: '8' },
      { keys: ['b/4'], duration: '8' },
      { keys: ['c/5'], duration: '8' },
    ], bassNotes: [
      { keys: ['g/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['d/5'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['b/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['e/5'], duration: 'q' },
      { keys: ['c/5'], duration: '8' },
      { keys: ['d/5'], duration: '8' },
      { keys: ['e/5'], duration: '8' },
      { keys: ['f#/5'], duration: '8' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['g/5'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 5, notes: [
      { keys: ['c/5'], duration: 'q' },
      { keys: ['d/5'], duration: '8' },
      { keys: ['c/5'], duration: '8' },
      { keys: ['b/4'], duration: '8' },
      { keys: ['a/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['b/4'], duration: 'q' },
      { keys: ['c/5'], duration: '8' },
      { keys: ['b/4'], duration: '8' },
      { keys: ['a/4'], duration: '8' },
      { keys: ['g/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['g/2'], duration: 'hd', fingering: 5 },
    ]},
    { number: 7, notes: [
      { keys: ['a/4'], duration: 'q' },
      { keys: ['b/4'], duration: '8' },
      { keys: ['a/4'], duration: '8' },
      { keys: ['g/4'], duration: '8' },
      { keys: ['f#/4'], duration: '8' },
    ], bassNotes: [
      { keys: ['d/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['g/4'], duration: 'hd' },
    ], bassNotes: [
      { keys: ['g/2'], duration: 'hd', fingering: 5 },
    ]},
  ],
};

// ─── 13. Canon in D (Pachelbel, simplified) ─────────────────────
// The universally recognized chord progression: D-A-Bm-F#m-G-D-G-A
// Simplified to a gentle descending melody in half notes over
// the famous bass ostinato in whole notes.
const canonInD: Song = {
  id: 'song_canon_in_d',
  level: 1,
  name: 'Canon in D (vereinfacht)',
  description: 'Pachelbels beruehmte Harmoniefolge',
  difficulty: 'easy',
  timeSignature: '4/4',
  keySignature: 'D',
  clef: 'treble',
  grandStaff: true,
  tempo: 72,
  songMeta: {
    category: 'klassiker',
    composer: 'Johann Pachelbel',
  },
  bars: [
    // D major — descending from F#5
    { number: 1, notes: [
      { keys: ['f#/5'], duration: 'h' },
      { keys: ['e/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['d/3'], duration: 'w', fingering: 5 },
    ]},
    // A major
    { number: 2, notes: [
      { keys: ['d/5'], duration: 'h' },
      { keys: ['c#/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'w', fingering: 5 },
    ]},
    // B minor
    { number: 3, notes: [
      { keys: ['b/4'], duration: 'h' },
      { keys: ['a/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['b/2'], duration: 'w', fingering: 5 },
    ]},
    // F# minor — rising back up
    { number: 4, notes: [
      { keys: ['b/4'], duration: 'h' },
      { keys: ['c#/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['f#/3'], duration: 'w', fingering: 5 },
    ]},
    // G major — second descent
    { number: 5, notes: [
      { keys: ['d/5'], duration: 'h' },
      { keys: ['c#/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    // D major
    { number: 6, notes: [
      { keys: ['b/4'], duration: 'h' },
      { keys: ['a/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['d/3'], duration: 'w', fingering: 5 },
    ]},
    // G major — ascending
    { number: 7, notes: [
      { keys: ['g/4'], duration: 'h' },
      { keys: ['f#/4'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'w', fingering: 5 },
    ]},
    // A → D cadence
    { number: 8, notes: [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['d/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['a/2'], duration: 'h', fingering: 5 },
      { keys: ['d/3'], duration: 'h', fingering: 5 },
    ]},
  ],
};

// ─── 14. Gymnopedie No. 1 (Erik Satie, simplified) ──────────────
// The dreamy, meditative piano piece. Slow 3/4 with sparse melody
// over sustained bass notes. Simplified to gentle descending phrases
// with dotted-half and half-note values.
const gymnopedieNo1: Song = {
  id: 'song_gymnopedie_no1',
  level: 1,
  name: 'Gymnopedie No. 1',
  description: 'Erik Saties meditativer Klavierklassiker',
  difficulty: 'easy',
  timeSignature: '3/4',
  keySignature: 'D',
  clef: 'treble',
  grandStaff: true,
  tempo: 66,
  songMeta: {
    category: 'klassiker',
    composer: 'Erik Satie',
  },
  bars: [
    // Gentle descending melody
    { number: 1, notes: [
      { keys: ['f#/5'], duration: 'h' },
      { keys: ['e/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 2, notes: [
      { keys: ['d/5'], duration: 'hd' },
    ], bassNotes: [
      { keys: ['d/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 3, notes: [
      { keys: ['e/5'], duration: 'h' },
      { keys: ['d/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 4, notes: [
      { keys: ['b/4'], duration: 'hd' },
    ], bassNotes: [
      { keys: ['d/3'], duration: 'hd', fingering: 5 },
    ]},
    // Second phrase — continues descent
    { number: 5, notes: [
      { keys: ['c#/5'], duration: 'h' },
      { keys: ['b/4'], duration: 'q' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['a/4'], duration: 'hd' },
    ], bassNotes: [
      { keys: ['d/3'], duration: 'hd', fingering: 5 },
    ]},
    // Ascending resolution
    { number: 7, notes: [
      { keys: ['b/4'], duration: 'q' },
      { keys: ['c#/5'], duration: 'q' },
      { keys: ['d/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['a/3'], duration: 'hd', fingering: 5 },
    ]},
    { number: 8, notes: [
      { keys: ['d/5'], duration: 'hd' },
    ], bassNotes: [
      { keys: ['d/3'], duration: 'hd', fingering: 5 },
    ]},
  ],
};

// ─── 15. The Entertainer — Hauptthema (Scott Joplin, simplified) ─
// Original: 2/4 with 16th notes. Simplified: 4/4 with 8th notes.
// The iconic chromatic D-D#-E pickup into the syncopated C5 theme.
// Ragtime bass simplified to root-fifth half notes.
const theEntertainer: Song = {
  id: 'song_the_entertainer',
  level: 1,
  name: 'The Entertainer (Hauptthema)',
  description: 'Scott Joplins beruemtester Ragtime',
  difficulty: 'elementary',
  timeSignature: '4/4',
  keySignature: 'C',
  clef: 'treble',
  grandStaff: true,
  tempo: 96,
  songMeta: {
    category: 'klassiker',
    composer: 'Scott Joplin',
  },
  bars: [
    // Chromatic pickup D-D#-E → C5
    { number: 1, notes: [
      { keys: ['d/4'], duration: '8' },
      { keys: ['d#/4'], duration: '8' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['c/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    // Ascending from C5
    { number: 2, notes: [
      { keys: ['c/5'], duration: '8' },
      { keys: ['d/5'], duration: '8' },
      { keys: ['e/5'], duration: 'q' },
      { keys: ['c/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    // Chromatic pickup again
    { number: 3, notes: [
      { keys: ['d/4'], duration: '8' },
      { keys: ['d#/4'], duration: '8' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['c/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['g/3'], duration: 'h', fingering: 1 },
    ]},
    // Ascending close
    { number: 4, notes: [
      { keys: ['c/5'], duration: 'q' },
      { keys: ['d/5'], duration: 'q' },
      { keys: ['e/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    // B phrase — stepwise
    { number: 5, notes: [
      { keys: ['e/5'], duration: 'q' },
      { keys: ['d/5'], duration: 'q' },
      { keys: ['c/5'], duration: 'q' },
      { keys: ['d/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['f/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    { number: 6, notes: [
      { keys: ['e/5'], duration: 'q' },
      { keys: ['c/5'], duration: 'q' },
      { keys: ['d/5'], duration: 'h' },
    ], bassNotes: [
      { keys: ['g/3'], duration: 'h', fingering: 5 },
      { keys: ['c/3'], duration: 'h', fingering: 5 },
    ]},
    // Return to tonic
    { number: 7, notes: [
      { keys: ['c/5'], duration: 'q' },
      { keys: ['d/5'], duration: 'q' },
      { keys: ['e/5'], duration: 'q' },
      { keys: ['c/5'], duration: 'q' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'h', fingering: 5 },
      { keys: ['e/3'], duration: 'h', fingering: 1 },
    ]},
    // Final resolution
    { number: 8, notes: [
      { keys: ['c/5'], duration: 'w' },
    ], bassNotes: [
      { keys: ['c/3'], duration: 'w', fingering: 5 },
    ]},
  ],
};

/** All available songs */
export const SONGS: Song[] = [
  alleMeineEntchen,
  haenschenKlein,
  bruderJakob,
  summSummSumm,
  kuckuckKuckuck,
  alleVoegel,
  twinkleTwinkle,
  maryHadALittleLamb,
  odeAnDieFreude,
  happyBirthday,
  fuerElise,
  menuettGDur,
  canonInD,
  gymnopedieNo1,
  theEntertainer,
];

export function getSongsByCategory(category: SongCategory): Song[] {
  return SONGS.filter(s => s.songMeta.category === category);
}

export function getSongsByDifficulty(difficulty: string): Song[] {
  return SONGS.filter(s => s.difficulty === difficulty);
}
