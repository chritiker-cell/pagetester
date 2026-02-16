import type { Exercise, Bar, Note } from '../types/music';

export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6;
export type TimeSignatureOption = '4/4' | '3/4' | '2/4' | '6/8' | 'random';
export type KeyStage = 1 | 2 | 3 | 4 | 5;

export interface GeneratorConfig {
  difficulty: Difficulty;
  timeSignature: TimeSignatureOption;
  keyStage: KeyStage;
  barCount?: number;
  progressionStep?: number;
}

// ============================================================
// Chord Degree Type (1=I, 4=IV, 5=V, 6=vi, etc.)
// ============================================================
type ChordDegree = number;

// ============================================================
// Chord Progressions for harmonic structure
// ============================================================
// ITERATION 26: Extended chord progressions
// Stufe 3: Simple progressions (mostly tonic, slow changes)
const CHORD_PROGRESSIONS_3_SHORT: number[][] = [
  [1, 1, 1, 1],  // Nur Tonika
  [1, 1, 5, 1],  // I-I-V-I (einfache Kadenz)
  [1, 4, 1, 1],  // I-IV-I-I
  [1, 5, 1, 5],  // I-V-I-V
];
const CHORD_PROGRESSIONS_3_LONG: number[][] = [
  [1, 1, 1, 1, 5, 5, 1, 1],
  [1, 1, 4, 4, 5, 5, 1, 1],
  [1, 1, 1, 1, 4, 4, 5, 1],
];

// Moll-Progressionen Stufe 3: kein V (kein harmonisches Moll)
const CHORD_PROGRESSIONS_MINOR_3_SHORT: number[][] = [
  [1, 1, 1, 1],     // i-i-i-i
  [1, 4, 1, 1],     // i-iv-i-i
  [1, 6, 1, 1],     // i-VI-i-i
  [1, 7, 1, 1],     // i-VII-i-i
];
const CHORD_PROGRESSIONS_MINOR_3_LONG: number[][] = [
  [1, 1, 1, 1, 4, 4, 1, 1],
  [1, 1, 6, 6, 7, 7, 1, 1],
];

// Moll-Progressionen Stufe 4+: mit V-Akkord (harmonisches Moll)
const CHORD_PROGRESSIONS_MINOR_4: number[][] = [
  [1, 4, 5, 1],  // i-iv-V-i
  [1, 5, 1, 1],  // i-V-i-i
  [1, 6, 4, 5],  // i-VI-iv-V
  [1, 4, 1, 5],  // i-iv-i-V
];
const CHORD_PROGRESSIONS_MINOR_8: number[][] = [
  [1, 1, 4, 4, 5, 4, 5, 1],  // i-i-iv-iv-V-iv-V-i
  [1, 4, 1, 5, 1, 6, 5, 1],  // i-iv-i-V-i-VI-V-i
  [1, 1, 6, 6, 4, 4, 5, 1],  // i-i-VI-VI-iv-iv-V-i
];

// Stufe 4+: Standard progressions (Dur)
const CHORD_PROGRESSIONS_4: number[][] = [
  [1, 4, 5, 1],  // I-IV-V-I (Standard Kadenz)
  [1, 5, 4, 1],  // I-V-IV-I (Variante)
  [1, 6, 4, 5],  // I-vi-IV-V (Pop-Progression)
  [1, 4, 1, 5],  // I-IV-I-V (Blues-artig)
  [2, 5, 1, 1],  // ii-V-I-I (Jazz Kadenz)
  [1, 6, 2, 5],  // I-vi-ii-V (Turnaround)
  [6, 4, 1, 5],  // vi-IV-I-V (Modern Pop)
];

// ITERATION 26: Extended 8-bar progressions
const CHORD_PROGRESSIONS_8: number[][] = [
  [1, 1, 4, 4, 5, 4, 5, 1],  // Erweiterte Kadenz
  [1, 4, 1, 5, 4, 5, 4, 1],  // Variante mit Wiederholungen
  [1, 6, 4, 1, 2, 5, 4, 1],  // Mit ii (Subdominante)
  [1, 1, 6, 6, 4, 4, 5, 1],  // Langsame Progression
  [1, 6, 2, 5, 1, 4, 5, 1],  // Jazz-inspiriert mit ii-V
  [1, 4, 6, 5, 1, 2, 5, 1],  // Erweitert mit vi und ii
];

export const KEY_STAGES: Record<KeyStage, string[]> = {
  1: ['C', 'G', 'F', 'Am', 'Em', 'Dm'],
  2: ['D', 'Bb', 'A', 'Eb', 'Bm', 'Gm', 'F#m', 'Cm'],
  3: ['E', 'Ab', 'B', 'Db', 'C#m', 'Fm', 'G#m', 'Bbm'],
  4: ['F#', 'Gb', 'C#', 'Ebm'],
  5: ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab', 'B', 'Db', 'F#', 'Gb', 'C#',
      'Am', 'Em', 'Dm', 'Bm', 'Gm', 'F#m', 'Cm', 'C#m', 'Fm', 'G#m', 'Bbm', 'Ebm'],
};

// Available key stages per difficulty
// Anfaenger: Stufe 1-2, Elementar: Stufe 1-4, Ab Fortgeschritten I: alle 5
export const AVAILABLE_KEY_STAGES: Record<Difficulty, KeyStage[]> = {
  1: [1, 2],             // Anfaenger: bis 3 Vorzeichen
  2: [1, 2, 3, 4],       // Elementar: bis 6-7 Vorzeichen
  3: [1, 2, 3, 4, 5],    // Fortgeschritten I: alle
  4: [1, 2, 3, 4, 5],    // Fortgeschritten II: alle
  5: [1, 2],             // Experte I: max 3 Vorzeichen (Spec-konform)
  6: [1, 2, 3, 4, 5],    // Experte II: alle
};

// Keys allowed per difficulty (explicit lists per SIGHT_READING_LEVELS_SPEC.md)
// Stufe 1: Nur C-Dur
// Stufe 2: C-Dur, G-Dur (max 1 Vorzeichen, KEIN MOLL)
// Stufe 3: C, G, F-Dur + a, e, d-Moll (Natural Minor)
// Stufe 4: Bis 2 Vorzeichen Dur + Moll (Harmonic Minor ab hier)
// Stufe 5: Bis 3 Vorzeichen
// Stufe 6: Alle Tonarten
export const ALLOWED_KEYS: Record<Difficulty, string[] | null> = {
  1: ['C'],                                           // Nur C-Dur
  2: ['C', 'G'],                                      // C, G-Dur (KEIN MOLL)
  3: ['C', 'G', 'F', 'Am', 'Em', 'Dm'],               // + F-Dur, a/e/d-Moll (Natural)
  4: ['C', 'G', 'D', 'F', 'Bb', 'Am', 'Em', 'Dm', 'Gm', 'Cm'],  // Bis 2 Vorzeichen
  5: ['C', 'G', 'D', 'A', 'F', 'Bb', 'Eb', 'Am', 'Em', 'Bm', 'Dm', 'Gm', 'Cm', 'Fm'],  // Bis 3 Vorzeichen
  6: null,                                            // Alle (verwendet KEY_STAGES)
};

// Weighted key selection for more natural distribution (null = use KEY_STAGES directly)
const ALLOWED_KEYS_WEIGHTED: Record<Difficulty, { key: string; weight: number }[] | null> = {
  1: null,  // Verwende KEY_STAGES
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
};

function pickWeightedKey(difficulty: Difficulty): string | null {
  const weighted = ALLOWED_KEYS_WEIGHTED[difficulty];
  if (!weighted) return null;
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * totalWeight;
  for (const entry of weighted) {
    r -= entry.weight;
    if (r <= 0) return entry.key;
  }
  return weighted[weighted.length - 1].key;
}

export const DEFAULT_TEMPO: Record<Difficulty, number> = {
  1: 72, 2: 76, 3: 80, 4: 84, 5: 92, 6: 104,
};

export const DIFFICULTY_LABELS: { value: Difficulty; label: string; name: string }[] = [
  { value: 1, label: '1', name: 'Anfaenger' },
  { value: 2, label: '2', name: 'Elementar' },
  { value: 3, label: '3', name: 'Fortgeschritten I' },
  { value: 4, label: '4', name: 'Fortgeschritten II' },
  { value: 5, label: '5', name: 'Experte I' },
  { value: 6, label: '6', name: 'Experte II' },
];

export const DIFFICULTY_INFO: Record<Difficulty, { name: string; bullets: string[] }> = {
  1: {
    name: 'Anfaenger',
    bullets: [
      'Ganze, Halbe und Viertelnoten',
      'Haende abwechselnd (eine spielt, andere pausiert)',
      '5-Finger-Position fest (C4-G4 / C3-G3)',
      'Max. Intervall: Terz',
      'Nur C-Dur / Nur 4/4',
      'Tempo: 72 BPM',
    ],
  },
  2: {
    name: 'Elementar',
    bullets: [
      'Zusaetzlich: punktierte Halbe (keine Achtel)',
      'Beide Haende gleichzeitig',
      '5-Finger-Position fest (kein Lagenwechsel)',
      'Max. Intervall: Terz',
      'C, G-Dur / 4/4 und 3/4',
      'Tempo: 76 BPM',
    ],
  },
  3: {
    name: 'Fortgeschritten I',
    bullets: [
      'Melodie-Fokus mit vereinzelten Akkorden',
      'Dur und Moll (Am, Em, Dm)',
      'Bass: einfach + unterstuetzend (Root, Walzer, Oom-Pah)',
      'Max. Intervall: Quarte',
      'C, G, F, D, Bb-Dur + Am, Em, Dm',
    ],
  },
  4: {
    name: 'Fortgeschritten II',
    bullets: [
      'Akkorde fluessig wechseln (mehrmals pro Takt)',
      'Mehr Triolen (15-25% der Takte)',
      'Bass: Arpeggien, Alberti-Bass, gebrochene Oktaven',
      'Grosse Spruenge erlaubt aber dosiert',
      'Alle Tonarten bis 2 Vorzeichen / + 6/8',
      'Tempo: 84 BPM',
    ],
  },
  5: {
    name: 'Experte I',
    bullets: [
      '16tel-Laeufe, Dreiklaenge',
      'Treble: A3-C6, Bass: C2-E4',
      'Max. Intervall: Oktave',
      'Alle Tonarten bis 3 Vorzeichen',
      'Tempo: 92 BPM',
    ],
  },
  6: {
    name: 'Experte II',
    bullets: [
      '32tel, Vierklang, Cluster',
      'Voller Klavierumfang',
      'Unbegrenzte Intervalle',
      'Alle Tonarten',
      'Tempo: 104 BPM',
    ],
  },
};

export const KEY_STAGE_INFO: Record<KeyStage, { name: string; bullets: string[] }> = {
  1: { name: 'Tonart-Stufe 1', bullets: ['C, G, F-Dur', 'Maximal 1 Vorzeichen'] },
  2: { name: 'Tonart-Stufe 2', bullets: ['D, Bb, A, Eb-Dur', '2-3 Vorzeichen'] },
  3: { name: 'Tonart-Stufe 3', bullets: ['E, Ab, B, Db-Dur', '4-5 Vorzeichen'] },
  4: { name: 'Tonart-Stufe 4', bullets: ['F#, Gb, C#-Dur', '5-7 Vorzeichen'] },
  5: { name: 'Tonart-Stufe 5', bullets: ['Alle Tonarten + enharmonisch', 'Alle Vorzeichen'] },
};

// Helper function to display effective keys for a key stage
export function getEffectiveKeysLabel(keyStage: KeyStage): string {
  const keys = KEY_STAGES[keyStage];
  const majorKeys = keys.filter(k => !k.endsWith('m'));
  const minorKeys = keys.filter(k => k.endsWith('m'));

  if (keyStage === 5) {
    return 'Alle Tonarten';
  }

  let label = majorKeys.join(', ');
  if (minorKeys.length > 0) {
    label += ' / ' + minorKeys.join(', ');
  }
  return label;
}

// Helper: Display the allowed keys for a given difficulty
export function getAllowedKeysLabel(difficulty: Difficulty): string {
  const keys = ALLOWED_KEYS[difficulty];
  if (!keys) return 'Alle Tonarten (via Tonart-Stufe)';
  const majorKeys = keys.filter(k => !k.endsWith('m'));
  const minorKeys = keys.filter(k => k.endsWith('m'));
  let label = majorKeys.join(', ');
  if (majorKeys.length > 0) label += '-Dur';
  if (minorKeys.length > 0) {
    label += ' + ' + minorKeys.join(', ');
  }
  return label;
}

// Available time signatures per difficulty
const AVAILABLE_TIME_SIGS: Record<Difficulty, string[]> = {
  1: ['4/4'],
  2: ['4/4', '3/4'],
  3: ['4/4', '3/4', '2/4'],
  4: ['4/4', '3/4', '2/4', '6/8'],
  5: ['4/4', '3/4', '2/4', '6/8'],
  6: ['4/4', '3/4', '2/4', '6/8'],
};

// ============================================================
// Interval weights per difficulty: [unison, 2nd, 3rd, 4th, 5th, 6th, 7th+]
// Stufe 1-2: max Terz!
// ============================================================
const INTERVAL_WEIGHTS: Record<Difficulty, number[]> = {
  1: [0, 90, 10, 0,  0,  0,  0],     // max Terz
  2: [0, 85, 15, 0,  0,  0,  0],     // max Terz
  // REWORK: Stufe 3 = Akkorde kennenlernen, max Quarte, keine grossen Spruenge
  3: [5, 60, 25, 10, 0,  0,  0],     // STUFE 3: max Quarte, 60% Sekunden, 25% Terzen, 10% Quarten
  // REWORK: Stufe 4 = fluessige Akkordwechsel, Sexte erlaubt aber dosiert
  4: [3, 35, 25, 18, 12, 7,  0],     // max Sexte, mehr Quarten fuer Akkordwechsel
  5: [0, 25, 20, 15, 13, 12, 15],    // max Oktave, slightly smoother
  6: [0, 18, 16, 15, 14, 13, 24],    // unbegrenzt, slightly smoother
};

// ============================================================
// Rhythmic patterns per difficulty (beats must sum to beatsPerBar)
// Stufe 1: nur w, h, q (mit Pausen!)
// Stufe 2: w, hd, h, q + einfache Achtelpaare (mit Pausen)
// Stufe 3: Akkord-fokussiert + Achtelpaare + Einzel-Achtel (8+8r) (mit Pausen)
// Stufe 4: + 8d (+ 16 in Muster)
// ============================================================
const RHYTHMIC_PATTERNS_4_4: Record<Difficulty, string[][]> = {
  1: [
    ['q', 'q', 'q', 'q'],
    ['h', 'h'],
    ['h', 'q', 'q'],
    ['q', 'q', 'h'],
    ['q', 'h', 'q'],
    // Mit Pausen (15-20%)
    ['q', 'q', 'qr', 'q'],
    ['h', 'qr', 'q'],
    ['q', 'qr', 'q', 'q'],
  ],
  2: [
    // Nur Ganze, Halbe, punktierte Halbe, Viertel (KEINE Achtel laut Spec)
    ['q', 'q', 'q', 'q'],
    ['h', 'h'],
    ['hd', 'q'],
    ['q', 'hd'],
    ['q', 'h', 'q'],
    ['h', 'q', 'q'],
    ['q', 'q', 'h'],
    // Mit Pausen
    ['h', 'qr', 'q'],
    ['q', 'q', 'qr', 'q'],
    ['hd', 'qr'],
  ],
  // REWORK Stufe 3: Melodie-Fokus — einfache Patterns, max 1 Achtelpaar pro Takt
  3: [
    // Basis (5)
    ['h', 'h'],
    ['h', 'q', 'q'],
    ['hd', 'q'],
    ['q', 'q', 'q', 'q'],
    ['q', 'q', 'h'],
    // Achtelpaare — max 1 Paar pro Takt (4)
    ['h', '8', '8', 'q'],
    ['q', '8', '8', 'q', 'q'],
    ['h', 'q', '8', '8'],
    ['q', 'q', '8', '8', 'q'],
    // Pausen (2)
    ['h', 'qr', 'q'],
    ['q', 'q', 'qr', 'q'],
    // Punktiert (1)
    ['qd', '8', 'h'],
  ],
  // ITERATION 17: Extended Stufe 4 patterns with dotted eighths
  4: [
    ['8', '8', '8', '8', 'q', 'q'],
    ['qd', '8', 'qd', '8'],
    ['q', '8', '8', 'q', '8', '8'],
    ['8', '8', 'q', 'qd', '8'],
    ['8d', '16', 'q', 'h'],
    ['8d', '16', '8d', '16', 'h'],       // ITERATION 17: Scotch snap pairs
    ['q', '8d', '16', 'q', 'q'],         // Dotted eighth after quarter
    ['8', '8', '8d', '16', 'h'],         // Mixed eighths + dotted
    ['h', '8d', '16', 'q'],              // Half + dotted-eighth figure
  ],
  5: [
    ['16', '16', '16', '16', '8', '8', 'q', 'q'],
    ['8', '8', '16', '16', '16', '16', 'h'],
    ['qd', '8', '8', '8', 'q'],
    ['16', '16', '8', '8', '8', 'q', 'q'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['8d', '16', '16', '16', '8', 'q', 'q'],   // Dotted eighth + 16th run
    ['q', '16', '16', '16', '16', 'q', 'q'],    // Quarter then 16th group
    ['16', '16', '16', '16', '16', '16', '16', '16', 'h'], // 16th run + half
  ],
  6: [
    ['16', '16', '16', '16', '8', '8', 'q', 'q'],
    ['32', '32', '32', '32', '8', '8', '8', 'q', 'q'],
    ['8', '8', '16', '16', '16', '16', 'h'],
    ['16', '16', '8', 'qd', '8', 'q'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
  ],
};

const RHYTHMIC_PATTERNS_3_4: Record<Difficulty, string[][]> = {
  1: [
    ['q', 'q', 'q'],
    ['h', 'q'],
    ['q', 'h'],
    ['hd'],
    // Mit Pausen
    ['q', 'qr', 'q'],
    ['h', 'qr'],
  ],
  2: [
    // Nur Ganze, Halbe, punktierte Halbe, Viertel (KEINE Achtel laut Spec)
    ['q', 'q', 'q'],
    ['h', 'q'],
    ['q', 'h'],
    ['hd'],
    // Mit Pausen
    ['q', 'qr', 'q'],
    ['h', 'qr'],
  ],
  // REWORK Stufe 3: Akkord auf Beat 1
  3: [
    // Basis (4)
    ['h', 'q'],
    ['q', 'q', 'q'],
    ['hd'],
    ['q', 'h'],
    // Achtelpaare (4)
    ['8', '8', 'q', 'q'],
    ['q', '8', '8', 'q'],
    ['8', '8', 'h'],
    ['h', '8', '8'],
    // Achtel+Pause (2)
    ['q', '8', '8r', 'q'],
    ['h', '8', '8r'],
    // Punktierte Viertel (2)
    ['qd', '8', 'q'],
    ['q', 'qd', '8'],
    // Pausen (1)
    ['q', 'qr', 'q'],
  ],
  4: [
    ['8', '8', '8', '8', 'q'],
    ['qd', '8', 'q'],
    ['q', '8', '8', '8', '8'],
    ['8', '8', 'qd', '8'],
  ],
  5: [
    ['16', '16', '16', '16', '8', '8', 'q'],
    ['8', '8', '16', '16', '16', '16', 'q'],
    ['qd', '8', '8', '8'],
  ],
  6: [
    ['16', '16', '16', '16', '8', '8', 'q'],
    ['32', '32', '32', '32', '8', 'q', 'q'],
    ['8', '8', '16', '16', '16', '16', 'q'],
  ],
};

const RHYTHMIC_PATTERNS_2_4: Record<Difficulty, string[][]> = {
  1: [
    ['q', 'q'],
    ['h'],
  ],
  2: [
    ['q', 'q'],
    ['h'],
  ],
  // REWORK Stufe 3
  3: [
    ['q', 'q'],
    ['h'],
    ['q', '8', '8'],
    ['qd', '8'],
    ['8', 'qd'],
  ],
  4: [
    ['8', '8', '8', '8'],
    ['qd', '8'],
    ['16', '16', '8', 'q'],
  ],
  5: [
    ['16', '16', '16', '16', 'q'],
    ['8', '8', '16', '16', '16', '16'],
    ['16', '16', '8', '8', '8'],
  ],
  6: [
    ['16', '16', '16', '16', 'q'],
    ['32', '32', '32', '32', '8', 'q'],
    ['16', '16', '8', '8', '8'],
  ],
};

// 6/8 = 2 dotted quarter beats = 6 eighth-note subdivisions
const RHYTHMIC_PATTERNS_6_8: Record<Difficulty, string[][]> = {
  1: [
    ['qd', 'qd'],
  ],
  2: [
    ['qd', 'qd'],
  ],
  3: [
    ['qd', 'qd'],
    ['8', '8', '8', 'qd'],
    ['qd', '8', '8', '8'],
  ],
  // ITERATION 20-25: Expanded 6/8 patterns for Stufe 4
  4: [
    ['8', '8', '8', '8', '8', '8'],     // Gleichmaessig
    ['qd', '8', '8', '8'],               // Long-short-short-short
    ['q', '8', 'qd'],                     // Synkopiert
    ['8', '8', '8', 'qd'],               // Short-short-short-long
    ['q', '8', 'q', '8'],                 // Dotted feel alternating
    ['qd', 'q', '8'],                     // Long-medium-short
    ['8', 'q', '8', 'q'],                 // Pickup feel
    ['8', '8', '8', 'q', '8'],           // Mixed subdivision (3+2+1)
  ],
  // ITERATION 21: Expanded 6/8 patterns for Stufe 5
  5: [
    ['16', '16', '8', '8', '8', '8', '8'],
    ['8', '8', '8', '16', '16', '8', '8'],
    ['8', '8', '16', '16', '16', '16', 'q', '8'],
    ['16', '16', '16', '16', '8', 'qd'],           // Run into long note
    ['8', '8', '8', '16', '16', '16', '16', '8'],  // Mixed subdivisions
  ],
  // ITERATION 22: Expanded 6/8 patterns for Stufe 6
  6: [
    ['16', '16', '8', '8', '8', '8', '8'],
    ['16', '16', '16', '16', '8', '8', '8', '8'],
    ['8', '8', '8', '16', '16', '8', '8'],
    ['16', '16', '16', '16', '16', '16', 'qd'],    // Full 16th run
    ['32', '32', '32', '32', '8', '8', '8', 'q'],   // 32nd burst
  ],
};

function getRhythmicPatterns(timeSignature: string, difficulty: Difficulty): string[][] {
  switch (timeSignature) {
    case '3/4': return RHYTHMIC_PATTERNS_3_4[difficulty];
    case '2/4': return RHYTHMIC_PATTERNS_2_4[difficulty];
    case '6/8': return RHYTHMIC_PATTERNS_6_8[difficulty];
    default: return RHYTHMIC_PATTERNS_4_4[difficulty];
  }
}

// ============================================================
// Phrase structure: how many bars per phrase per difficulty
// ============================================================
const PHRASE_LENGTHS: Record<Difficulty, number[]> = {
  1: [2],
  2: [2],
  3: [2, 4],
  4: [4],
  5: [4, 8],
  6: [4, 8],
};

// ============================================================
// Range definitions with comfort zones
// Stufe 1+2: strikt 5-Finger (C4-G4 / C3-G3)
// Stufe 3+: erweitert
// ============================================================
interface RangeConfig {
  minOctave: number; maxOctave: number; minDegree: number; maxDegree: number;
  comfortMinOctave: number; comfortMaxOctave: number; comfortMinDegree: number; comfortMaxDegree: number;
  comfortPct: number;
}

const TREBLE_RANGES: Record<Difficulty, RangeConfig> = {
  // Stufe 1: C4-G4 (5 Finger fest)
  1: { minOctave: 4, maxOctave: 4, minDegree: 0, maxDegree: 4,
       comfortMinOctave: 4, comfortMaxOctave: 4, comfortMinDegree: 0, comfortMaxDegree: 4, comfortPct: 100 },
  // Stufe 2: C4-G4 (5 Finger fest, kein Lagenwechsel)
  2: { minOctave: 4, maxOctave: 4, minDegree: 0, maxDegree: 4,
       comfortMinOctave: 4, comfortMaxOctave: 4, comfortMinDegree: 0, comfortMaxDegree: 4, comfortPct: 100 },
  // Stufe 3: C4-G4 (5 Finger fest, wie Stufe 1-2)
  3: { minOctave: 4, maxOctave: 4, minDegree: 0, maxDegree: 4,
       comfortMinOctave: 4, comfortMaxOctave: 4, comfortMinDegree: 0, comfortMaxDegree: 4, comfortPct: 100 },
  // Stufe 4: C4-G5
  4: { minOctave: 4, maxOctave: 5, minDegree: 0, maxDegree: 4,
       comfortMinOctave: 4, comfortMaxOctave: 5, comfortMinDegree: 0, comfortMaxDegree: 4, comfortPct: 65 },
  // Stufe 5: A3-C6
  5: { minOctave: 3, maxOctave: 6, minDegree: 5, maxDegree: 0,
       comfortMinOctave: 4, comfortMaxOctave: 5, comfortMinDegree: 0, comfortMaxDegree: 6, comfortPct: 60 },
  // Stufe 6: voller Umfang
  6: { minOctave: 2, maxOctave: 6, minDegree: 0, maxDegree: 6,
       comfortMinOctave: 3, comfortMaxOctave: 5, comfortMinDegree: 0, comfortMaxDegree: 6, comfortPct: 55 },
};

const BASS_RANGES: Record<Difficulty, RangeConfig> = {
  // Stufe 1: C3-G3 (5 Finger fest)
  1: { minOctave: 3, maxOctave: 3, minDegree: 0, maxDegree: 4,
       comfortMinOctave: 3, comfortMaxOctave: 3, comfortMinDegree: 0, comfortMaxDegree: 4, comfortPct: 100 },
  // Stufe 2: C3-G3 (5 Finger fest)
  2: { minOctave: 3, maxOctave: 3, minDegree: 0, maxDegree: 4,
       comfortMinOctave: 3, comfortMaxOctave: 3, comfortMinDegree: 0, comfortMaxDegree: 4, comfortPct: 100 },
  // Stufe 3: C3-G3 (5 Finger fest, wie Stufe 1-2)
  3: { minOctave: 3, maxOctave: 3, minDegree: 0, maxDegree: 4,
       comfortMinOctave: 3, comfortMaxOctave: 3, comfortMinDegree: 0, comfortMaxDegree: 4, comfortPct: 100 },
  // Stufe 4: C2-C4
  4: { minOctave: 2, maxOctave: 4, minDegree: 0, maxDegree: 0,
       comfortMinOctave: 2, comfortMaxOctave: 3, comfortMinDegree: 0, comfortMaxDegree: 6, comfortPct: 65 },
  // Stufe 5: C2-E4
  5: { minOctave: 2, maxOctave: 4, minDegree: 0, maxDegree: 2,
       comfortMinOctave: 2, comfortMaxOctave: 3, comfortMinDegree: 0, comfortMaxDegree: 6, comfortPct: 60 },
  // Stufe 6: voller Umfang
  6: { minOctave: 1, maxOctave: 4, minDegree: 0, maxDegree: 6,
       comfortMinOctave: 2, comfortMaxOctave: 4, comfortMinDegree: 0, comfortMaxDegree: 6, comfortPct: 55 },
};

// ============================================================
// Scale notes helper
// ============================================================
function getScaleNotes(key: string): string[] {
  const keyMap: Record<string, string[]> = {
    'C':  ['c', 'd', 'e', 'f', 'g', 'a', 'b'],
    'G':  ['g', 'a', 'b', 'c', 'd', 'e', 'f#'],
    'F':  ['f', 'g', 'a', 'bb', 'c', 'd', 'e'],
    'D':  ['d', 'e', 'f#', 'g', 'a', 'b', 'c#'],
    'Bb': ['bb', 'c', 'd', 'eb', 'f', 'g', 'a'],
    'A':  ['a', 'b', 'c#', 'd', 'e', 'f#', 'g#'],
    'Eb': ['eb', 'f', 'g', 'ab', 'bb', 'c', 'd'],
    'E':  ['e', 'f#', 'g#', 'a', 'b', 'c#', 'd#'],
    'Ab': ['ab', 'bb', 'c', 'db', 'eb', 'f', 'g'],
    'B':  ['b', 'c#', 'd#', 'e', 'f#', 'g#', 'a#'],
    'Db': ['db', 'eb', 'f', 'gb', 'ab', 'bb', 'c'],
    'F#': ['f#', 'g#', 'a#', 'b', 'c#', 'd#', 'e#'],
    'Gb': ['gb', 'ab', 'bb', 'cb', 'db', 'eb', 'f'],
    'C#': ['c#', 'd#', 'e#', 'f#', 'g#', 'a#', 'b#'],
    // Natural minor scales
    'Am':  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    'Em':  ['e', 'f#', 'g', 'a', 'b', 'c', 'd'],
    'Bm':  ['b', 'c#', 'd', 'e', 'f#', 'g', 'a'],
    'F#m': ['f#', 'g#', 'a', 'b', 'c#', 'd', 'e'],
    'C#m': ['c#', 'd#', 'e', 'f#', 'g#', 'a', 'b'],
    'G#m': ['g#', 'a#', 'b', 'c#', 'd#', 'e', 'f#'],
    'Dm':  ['d', 'e', 'f', 'g', 'a', 'bb', 'c'],
    'Gm':  ['g', 'a', 'bb', 'c', 'd', 'eb', 'f'],
    'Cm':  ['c', 'd', 'eb', 'f', 'g', 'ab', 'bb'],
    'Fm':  ['f', 'g', 'ab', 'bb', 'c', 'db', 'eb'],
    'Bbm': ['bb', 'c', 'db', 'eb', 'f', 'gb', 'ab'],
    'Ebm': ['eb', 'f', 'gb', 'ab', 'bb', 'cb', 'db'],
  };
  return keyMap[key] || keyMap['C'];
}

/**
 * Returns harmonic minor scale (raised 7th degree) for a minor key.
 * For major keys, returns the normal scale unchanged.
 */
function getHarmonicMinorNotes(key: string): string[] {
  const natural = getScaleNotes(key);
  if (!key.endsWith('m')) return natural;

  // Raise the 7th degree by a half step
  const raiseMap: Record<string, string> = {
    'g': 'g#', 'd': 'd#', 'c': 'c#', 'f': 'f#',
    'bb': 'b', 'eb': 'e', 'ab': 'a', 'db': 'd',
    'gb': 'g', 'cb': 'c', 'a': 'a#', 'e': 'e#',
    'b': 'b#', 'f#': 'f##',
  };
  const seventh = natural[6];
  const raised = raiseMap[seventh];
  if (raised) {
    const result = [...natural];
    result[6] = raised;
    return result;
  }
  return natural;
}

/**
 * Returns scale notes appropriate for the difficulty level.
 * Stufe <=3 + minor: natural minor (no raised 7th)
 * Stufe >=4 + minor: harmonic minor (raised 7th)
 * Major: always unchanged
 */
function getScaleNotesForDifficulty(key: string, difficulty: Difficulty): string[] {
  if (key.endsWith('m') && difficulty >= 4) {
    return getHarmonicMinorNotes(key);
  }
  return getScaleNotes(key);
}

// ============================================================
// Harmonic functions
// ============================================================

/**
 * Returns chord tones (scale degrees) for a chord degree in the scale
 * @param degree - Chord degree (1=I, 4=IV, 5=V, 6=vi, etc.)
 * @param _scaleNotes - The scale notes array (unused, kept for API consistency)
 * @returns Array of [root, third, fifth] scale degrees (0-indexed)
 */
function getChordTones(degree: ChordDegree, _scaleNotes?: string[]): number[] {
  const rootDegree = (degree - 1) % 7;  // Convert 1-based to 0-indexed
  const thirdDegree = (rootDegree + 2) % 7;
  const fifthDegree = (rootDegree + 4) % 7;
  return [rootDegree, thirdDegree, fifthDegree];
}

/**
 * Generates a harmonic progression for a given bar count
 */
function generateHarmonicProgression(barCount: number, difficulty: Difficulty = 4, key: string = 'C'): ChordDegree[] {
  const isMinor = key.endsWith('m');
  if (barCount <= 2) {
    return [1, 1];  // Just tonic
  } else if (barCount <= 4) {
    const progressions = difficulty <= 3
      ? (isMinor ? CHORD_PROGRESSIONS_MINOR_3_SHORT : CHORD_PROGRESSIONS_3_SHORT)
      : (isMinor ? CHORD_PROGRESSIONS_MINOR_4 : CHORD_PROGRESSIONS_4);
    const base = pick(progressions);
    return base.slice(0, barCount);
  } else {
    const progressions = difficulty <= 3
      ? (isMinor ? CHORD_PROGRESSIONS_MINOR_3_LONG : CHORD_PROGRESSIONS_3_LONG)
      : (isMinor ? CHORD_PROGRESSIONS_MINOR_8 : CHORD_PROGRESSIONS_8);
    const base = pick(progressions);
    // Repeat/extend if needed
    const result: ChordDegree[] = [];
    for (let i = 0; i < barCount; i++) {
      result.push(base[i % base.length]);
    }
    return result;
  }
}

/**
 * Checks if a note degree is a chord tone for the given chord
 * (Currently unused but kept for future validation features)
 */
// @ts-ignore: unused function kept for future validation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _isChordToneValidator = (noteDegree: number, chordDegree: ChordDegree): boolean => {
  const chordTones = getChordTones(chordDegree);
  return chordTones.includes(noteDegree % 7);
};

/**
 * Gets the root note key for a chord degree in a given octave
 */
function getChordRootKey(chordDegree: ChordDegree, scaleNotes: string[], octave: number): string {
  const rootDegree = (chordDegree - 1) % 7;
  return degreeToKey(scaleNotes, rootDegree, octave);
}

// ============================================================
// Duration beats map
// ============================================================
export const DURATION_BEATS: Record<string, number> = {
  'w': 4, 'hd': 3, 'h': 2, 'qd': 1.5, 'q': 1, '8d': 0.75, '8': 0.5, '16': 0.25, '32': 0.125,
};

// ============================================================
// Utility functions
// ============================================================
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toLinear(degree: number, octave: number): number {
  return octave * 7 + degree;
}

function fromLinear(linear: number): { degree: number; octave: number } {
  const octave = Math.floor(linear / 7);
  const degree = linear - octave * 7;
  return { degree, octave };
}

// Chromatic pitch values for note letters
const CHROMATIC_PITCH: Record<string, number> = {
  'c': 0, 'c#': 1, 'db': 1, 'd': 2, 'd#': 3, 'eb': 3, 'e': 4, 'e#': 5, 'fb': 4,
  'f': 5, 'f#': 6, 'gb': 6, 'f##': 7, 'g': 7, 'g#': 8, 'ab': 8, 'a': 9, 'a#': 10, 'bb': 10, 'b': 11, 'b#': 0, 'cb': 11,
};

/** Convert a VexFlow key to MIDI pitch number */
function keyToMidi(key: string): number {
  const [n, o] = key.split('/');
  let s = CHROMATIC_PITCH[n] ?? 0;
  return (parseInt(o) + 1) * 12 + s;
}

/**
 * Post-process bars to fix large intervals caused by octave boundary issues.
 * For notes where the MIDI interval exceeds maxSemitones, adjust the octave
 * of the second note to minimize the interval.
 */
function fixLargeIntervals(bars: Bar[], maxSemitones: number): void {
  bars.forEach(bar => {
    // Fix treble notes — for chords, shift ALL keys by the same octave amount
    // Treble notes should stay in octave 3-6
    for (let j = 1; j < bar.notes.length; j++) {
      const prev = bar.notes[j - 1];
      const curr = bar.notes[j];
      if (curr.duration.endsWith('r') || prev.duration.endsWith('r')) continue;
      const prevMidi = keyToMidi(prev.keys[0]);
      const currMidi = keyToMidi(curr.keys[0]);
      const interval = Math.abs(currMidi - prevMidi);
      if (interval > maxSemitones) {
        const [noteName] = curr.keys[0].split('/');
        const currOct = parseInt(curr.keys[0].split('/')[1]);
        const downInterval = Math.abs(keyToMidi(`${noteName}/${currOct - 1}`) - prevMidi);
        const upInterval = Math.abs(keyToMidi(`${noteName}/${currOct + 1}`) - prevMidi);
        let shift = 0;
        if (downInterval < upInterval && downInterval < interval && currOct - 1 >= 3) shift = -1;
        else if (upInterval < interval && upInterval <= maxSemitones && currOct + 1 <= 5) shift = 1;
        else if (downInterval < interval && currOct - 1 >= 3) shift = -1;
        if (shift !== 0) {
          for (let k = 0; k < curr.keys.length; k++) {
            const [n, o] = curr.keys[k].split('/');
            curr.keys[k] = `${n}/${parseInt(o) + shift}`;
          }
        }
      }
    }
    // Fix bass notes similarly (single notes only)
    if (bar.bassNotes) {
      for (let j = 1; j < bar.bassNotes.length; j++) {
        const prev = bar.bassNotes[j - 1];
        const curr = bar.bassNotes[j];
        if (curr.duration.endsWith('r') || prev.duration.endsWith('r')) continue;
        if (curr.keys.length > 1) continue;
        const prevMidi = keyToMidi(prev.keys[0]);
        const currMidi = keyToMidi(curr.keys[0]);
        const interval = Math.abs(currMidi - prevMidi);
        if (interval > maxSemitones) {
          const [noteName] = curr.keys[0].split('/');
          const currOct = parseInt(curr.keys[0].split('/')[1]);
          const downInterval = Math.abs(keyToMidi(`${noteName}/${currOct - 1}`) - prevMidi);
          if (downInterval < interval) {
            curr.keys[0] = `${noteName}/${currOct - 1}`;
          }
        }
      }
    }
  });

  // Second pass: fix cross-bar transitions
  for (let i = 1; i < bars.length; i++) {
    const prevBar = bars[i - 1];
    const currBar = bars[i];

    // Fix treble cross-bar
    const prevTreble = findLastNonRest(prevBar.notes);
    if (prevTreble && currBar.notes.length > 0 && !currBar.notes[0].duration.endsWith('r')) {
      const shift = fixCrossBarNote(prevTreble, currBar.notes[0], maxSemitones);
      if (shift !== 0) propagateShift(currBar.notes, 1, shift, maxSemitones);
    }

    // Fix bass cross-bar
    if (prevBar.bassNotes && currBar.bassNotes) {
      const prevBass = findLastNonRest(prevBar.bassNotes);
      if (prevBass && currBar.bassNotes.length > 0 && !currBar.bassNotes[0].duration.endsWith('r')) {
        const shift = fixCrossBarNote(prevBass, currBar.bassNotes[0], maxSemitones);
        if (shift !== 0) propagateShift(currBar.bassNotes, 1, shift, maxSemitones);
      }
    }
  }

  // Final pass: clamp all treble notes to octave 3-5
  bars.forEach(bar => {
    for (const note of bar.notes) {
      if (note.duration.endsWith('r')) continue;
      for (let k = 0; k < note.keys.length; k++) {
        const [n, o] = note.keys[k].split('/');
        const oct = parseInt(o);
        if (oct > 5) note.keys[k] = `${n}/5`;
        else if (oct < 3) note.keys[k] = `${n}/3`;
      }
    }
  });
}

/**
 * Wrapper that runs fixLargeIntervals multiple passes until stable
 */
/**
 * Wrapper that runs fixLargeIntervals multiple passes and clamps to range
 */
function fixLargeIntervalsMultiPass(bars: Bar[], maxSemitones: number, scaleNotes: string[], trebleRange: RangeConfig, bassRange: RangeConfig): void {
  // Compute MIDI bounds for treble and bass from their range configs
  const trebleMinKey = degreeToKey(scaleNotes, trebleRange.minDegree, trebleRange.minOctave);
  const trebleMaxKey = degreeToKey(scaleNotes, trebleRange.maxDegree, trebleRange.maxOctave);
  const trebleMinMidi = keyToMidi(trebleMinKey);
  const trebleMaxMidi = keyToMidi(trebleMaxKey);
  const bassMinKey = degreeToKey(scaleNotes, bassRange.minDegree, bassRange.minOctave);
  const bassMaxKey = degreeToKey(scaleNotes, bassRange.maxDegree, bassRange.maxOctave);
  const bassMinMidi = keyToMidi(bassMinKey);
  const bassMaxMidi = keyToMidi(bassMaxKey);

  // First pass: fix intervals
  fixLargeIntervals(bars, maxSemitones);
  // Clamp treble and bass to their respective MIDI ranges
  const clampAll = () => {
    bars.forEach(bar => {
      for (const note of bar.notes) {
        if (note.duration.endsWith('r')) continue;
        for (let k = 0; k < note.keys.length; k++) {
          const midi = keyToMidi(note.keys[k]);
          const [n] = note.keys[k].split('/');
          if (midi > trebleMaxMidi) {
            // Find the correct octave to bring it within range
            const chroma = CHROMATIC_PITCH[n] ?? 0;
            for (let oct = 6; oct >= 1; oct--) {
              if ((oct + 1) * 12 + chroma <= trebleMaxMidi) {
                note.keys[k] = `${n}/${oct}`;
                break;
              }
            }
          } else if (midi < trebleMinMidi) {
            const chroma = CHROMATIC_PITCH[n] ?? 0;
            for (let oct = 1; oct <= 6; oct++) {
              if ((oct + 1) * 12 + chroma >= trebleMinMidi) {
                note.keys[k] = `${n}/${oct}`;
                break;
              }
            }
          }
        }
      }
      if (bar.bassNotes) {
        for (const note of bar.bassNotes) {
          if (note.duration.endsWith('r')) continue;
          for (let k = 0; k < note.keys.length; k++) {
            const midi = keyToMidi(note.keys[k]);
            const [n] = note.keys[k].split('/');
            if (midi > bassMaxMidi) {
              const chroma = CHROMATIC_PITCH[n] ?? 0;
              for (let oct = 6; oct >= 1; oct--) {
                if ((oct + 1) * 12 + chroma <= bassMaxMidi) {
                  note.keys[k] = `${n}/${oct}`;
                  break;
                }
              }
            } else if (midi < bassMinMidi) {
              const chroma = CHROMATIC_PITCH[n] ?? 0;
              for (let oct = 1; oct <= 6; oct++) {
                if ((oct + 1) * 12 + chroma >= bassMinMidi) {
                  note.keys[k] = `${n}/${oct}`;
                  break;
                }
              }
            }
          }
        }
      }
    });
  };
  clampAll();
  // Second pass: fix intervals created by clamping
  fixLargeIntervals(bars, maxSemitones);
  // Re-clamp (in case second pass re-introduced out-of-range)
  clampAll();
}

function findLastNonRest(notes: Note[]): Note | null {
  for (let i = notes.length - 1; i >= 0; i--) {
    if (!notes[i].duration.endsWith('r')) return notes[i];
  }
  return null;
}

function fixCrossBarNote(prev: Note, curr: Note, maxSemitones: number): number {
  const prevMidi = keyToMidi(prev.keys[0]);
  const currMidi = keyToMidi(curr.keys[0]);
  const interval = Math.abs(currMidi - prevMidi);
  if (interval > maxSemitones) {
    const [noteName] = curr.keys[0].split('/');
    const currOct = parseInt(curr.keys[0].split('/')[1]);
    const downInterval = Math.abs(keyToMidi(`${noteName}/${currOct - 1}`) - prevMidi);
    const upInterval = Math.abs(keyToMidi(`${noteName}/${currOct + 1}`) - prevMidi);
    let shift = 0;
    if (downInterval < upInterval && downInterval < interval && currOct - 1 >= 3) shift = -1;
    else if (upInterval < interval && upInterval <= maxSemitones && currOct + 1 <= 5) shift = 1;
    else if (downInterval < interval && currOct - 1 >= 3) shift = -1;
    if (shift !== 0) {
      for (let k = 0; k < curr.keys.length; k++) {
        const [n, o] = curr.keys[k].split('/');
        curr.keys[k] = `${n}/${parseInt(o) + shift}`;
      }
      return shift;
    }
  }
  return 0;
}

function propagateShift(notes: Note[], startIdx: number, shift: number, maxSemitones: number): void {
  for (let j = startIdx; j < notes.length; j++) {
    if (notes[j].duration.endsWith('r')) continue;
    const currOct = parseInt(notes[j].keys[0].split('/')[1]);
    const prev = notes[j - 1];
    if (prev.duration.endsWith('r')) {
      // Apply same shift but clamp to octave 2-5
      const newOct = currOct + shift;
      if (newOct >= 3 && newOct <= 5) {
        for (let k = 0; k < notes[j].keys.length; k++) {
          const [n, o] = notes[j].keys[k].split('/');
          notes[j].keys[k] = `${n}/${parseInt(o) + shift}`;
        }
      }
      continue;
    }
    const prevMidi = keyToMidi(prev.keys[0]);
    const currMidi = keyToMidi(notes[j].keys[0]);
    const interval = Math.abs(currMidi - prevMidi);
    if (interval > maxSemitones) {
      const [noteName] = notes[j].keys[0].split('/');
      const downInterval = Math.abs(keyToMidi(`${noteName}/${currOct - 1}`) - prevMidi);
      const upInterval = Math.abs(keyToMidi(`${noteName}/${currOct + 1}`) - prevMidi);
      let s = 0;
      if (downInterval < upInterval && downInterval < interval && currOct - 1 >= 3) s = -1;
      else if (upInterval < interval && upInterval <= maxSemitones && currOct + 1 <= 6) s = 1;
      else if (downInterval < interval && currOct - 1 >= 3) s = -1;
      if (s !== 0) {
        for (let k = 0; k < notes[j].keys.length; k++) {
          const [n, o] = notes[j].keys[k].split('/');
          notes[j].keys[k] = `${n}/${parseInt(o) + s}`;
        }
      }
    }
  }
}

/**
 * Convert (degree, octave) in the linear system to a correct VexFlow key string.
 * Simply maps degree to note name and uses the linear octave directly.
 * The linear system octave corresponds to VexFlow octave for the tonic note.
 * Notes that cross the C boundary (e.g., in F major: f,g,a,bb are below c,d,e)
 * naturally get handled because VexFlow octaves reset at C.
 */
function pitchClassToChroma(note: string): number {
  const base: Record<string, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  let chroma = base[note[0]] ?? 0;
  if (note.includes('#')) chroma++;
  // flat: note has 'b' after first char (e.g., 'eb', 'bb', 'db')
  if (note.length > 1 && note.slice(1).includes('b')) chroma--;
  return ((chroma % 12) + 12) % 12;
}

function octaveAdjustForScale(scaleNotes: string[], degree: number): number {
  const note = scaleNotes[degree % scaleNotes.length];
  const rootChroma = pitchClassToChroma(scaleNotes[0]);
  const noteChroma = pitchClassToChroma(note);
  return noteChroma < rootChroma ? 1 : 0;
}

function degreeToKey(scaleNotes: string[], degree: number, linearOctave: number): string {
  const note = scaleNotes[degree % scaleNotes.length];
  return `${note}/${linearOctave + octaveAdjustForScale(scaleNotes, degree)}`;
}

/** Reverse the octave adjustment: given a VexFlow octave from a key string, return the linear octave */
function keyToLinearOctave(scaleNotes: string[], noteName: string, vexflowOctave: number): number {
  const degree = scaleNotes.indexOf(noteName);
  if (degree < 0) return vexflowOctave;
  return vexflowOctave - octaveAdjustForScale(scaleNotes, degree);
}

function weightedRandomInterval(weights: number[], maxInterval: number): number {
  const capped = weights.slice(0, maxInterval + 1);
  const total = capped.reduce((a, b) => a + b, 0);
  if (total === 0) return 1;
  let r = Math.random() * total;
  for (let i = 0; i < capped.length; i++) {
    r -= capped[i];
    if (r <= 0) return i;
  }
  return 1;
}

// ============================================================
// REWORK: Triplet patterns — 3 eighth notes in the time of 1 quarter note
// Each triplet group gets a unique tupletId and tuplet=3 marker
// ============================================================
const TRIPLET_CHANCE: Record<Difficulty, number> = {
  1: 0, 2: 0,
  3: 0.01,   // quasi keine Triolen in Stufe 3
  4: 0.20,   // 15-25% of bars
  5: 0.15,
  6: 0.15,
};

/**
 * Generate a triplet group (3 notes) based on chord tones or scale steps
 */
function generateTripletGroup(
  scaleNotes: string[],
  startDegree: number,
  startOctave: number,
  range: RangeConfig,
  chordDegree: ChordDegree | undefined,
  difficulty: Difficulty,
): Note[] {
  const tupletId = `trip_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
  const notes: Note[] = [];

  // For Stufe 3: simple scale fragment triplet (stepwise up or down)
  // For Stufe 4+: arpeggio or scale triplet
  let keys: string[];
  if (difficulty <= 3) {
    // Stufe 3: nur Scale-Fragment Triolen (kein Arpeggio)
    const dir = Math.random() < 0.5 ? 1 : -1;
    keys = generateScaleFragment(scaleNotes, startDegree, startOctave, 3, dir, range);
  } else {
    // Stufe 4+: varied triplet patterns
    const tripletType = Math.random();
    if (tripletType < 0.30 && chordDegree !== undefined) {
      // Arpeggio triplet (root-third-fifth)
      keys = generateArpeggio(chordDegree, scaleNotes, startOctave, 3, pick(['up', 'down'] as const), range);
    } else if (tripletType < 0.55) {
      // Scale fragment triplet
      const dir = Math.random() < 0.5 ? 1 : -1;
      keys = generateScaleFragment(scaleNotes, startDegree, startOctave, 3, dir, range);
    } else if (tripletType < 0.75) {
      // Neighbor-tone triplet (note, upper neighbor, back)
      const center = degreeToKey(scaleNotes, startDegree % 7, startOctave);
      const upper = degreeToKey(scaleNotes, (startDegree + 1) % 7, startOctave);
      keys = [center, upper, center];
    } else {
      // Chromatic approach triplet (half step below, note, half step above)
      const dir = Math.random() < 0.5 ? 1 : -1;
      keys = generateScaleFragment(scaleNotes, startDegree, startOctave, 3, dir, range);
    }
  }

  if (keys.length < 3) {
    // Fallback: repeat the start note
    const startNote = degreeToKey(scaleNotes, startDegree % 7, startOctave);
    keys = [startNote, startNote, startNote];
  }

  for (let i = 0; i < 3; i++) {
    notes.push({
      keys: [keys[i]],
      duration: '8',  // Three eighths in the time of two
      tuplet: 3,
      tupletId,
    });
  }

  return notes;
}

// ============================================================
// ITERATION 4: Idiomatic eighth-note patterns for Stufe 3
// Each pattern is a sequence of relative scale-degree offsets from the starting note
// Positive = up, negative = down, 0 = repeat
// ============================================================
const EIGHTH_PATTERNS_3: number[][] = [
  [0, 1, 2, 1],       // Neighbor tone: up-up-back (c d e d)
  [0, -1, -2, -1],    // Neighbor tone: down-down-back
  [0, 1, 2, 3],       // Scale run up (c d e f)
  [0, -1, -2, -3],    // Scale run down
  [0, 1, 0, -1],      // Oscillation (c d c b)
  [0, 2, 1, 0],       // Turn figure (c e d c)
  [0, -1, 0, 1],      // Lower neighbor (c b c d)
  [0, 1, -1, 0],      // Upper+lower neighbor (c d b c)
  [0, 0, 1, 2],       // Repeated note then scale (c c d e)
  [0, 1, 2, 0],       // Scale fragment + return (c d e c)
];

// ITERATION 4: Idiomatic patterns for Stufe 4 (allow thirds)
const EIGHTH_PATTERNS_4: number[][] = [
  [0, 2, 1, 0],       // Turn with third (c e d c)
  [0, -2, -1, 0],     // Inverted turn
  [0, 2, 4, 2],       // Arpeggio fragment (c e g e)
  [0, 1, 2, 3],       // Scale run
  [0, -1, -2, -3],    // Scale run down
  [0, 2, 1, -1],      // Third + step down
  [0, 1, 3, 2],       // Step + skip + step
  [0, -1, 1, 2],      // Approach from below
];

/**
 * ITERATION 5: Apply an idiomatic pattern starting from current state
 */
function applyEighthPattern(
  patternOffsets: number[],
  scaleNotes: string[],
  startDegree: number,
  startOctave: number,
  range: RangeConfig,
): string[] {
  const result: string[] = [];
  const minLinear = toLinear(range.minDegree, range.minOctave);
  const maxLinear = toLinear(range.maxDegree, range.maxOctave);

  for (const offset of patternOffsets) {
    let deg = startDegree + offset;
    let oct = startOctave;
    while (deg < 0) { deg += 7; oct--; }
    while (deg >= 7) { deg -= 7; oct++; }
    const linear = toLinear(deg, oct);
    if (linear < minLinear || linear > maxLinear) break;
    result.push(degreeToKey(scaleNotes, deg, oct));
  }
  return result;
}

// ============================================================
// Musical pattern generation (scales, arpeggios)
// ============================================================

/**
 * Generates a scale fragment (stepwise motion)
 * @param scaleNotes - Scale notes array
 * @param startDegree - Starting scale degree (0-indexed)
 * @param startOctave - Starting octave
 * @param length - Number of notes
 * @param direction - 1 for ascending, -1 for descending
 * @param range - Range constraints
 * @returns Array of note keys
 */
function generateScaleFragment(
  scaleNotes: string[],
  startDegree: number,
  startOctave: number,
  length: number,
  direction: number,
  range: RangeConfig,
): string[] {
  const result: string[] = [];
  let degree = startDegree;
  let octave = startOctave;
  const minLinear = toLinear(range.minDegree, range.minOctave);
  const maxLinear = toLinear(range.maxDegree, range.maxOctave);

  for (let i = 0; i < length; i++) {
    const linear = toLinear(degree % 7, octave);
    if (linear < minLinear || linear > maxLinear) break;

    result.push(degreeToKey(scaleNotes, degree % 7, octave));

    degree += direction;
    if (degree < 0) {
      degree += 7;
      octave--;
    } else if (degree >= 7) {
      degree -= 7;
      octave++;
    }
  }

  return result;
}

// ITERATION 42-45: Scale fragment with optional chromatic passing tones for Stufe 5+
function generateChromaticScaleFragment(
  scaleNotes: string[],
  startDegree: number,
  startOctave: number,
  length: number,
  direction: number,
  range: RangeConfig,
  chromaticPct: number,
): string[] {
  const result: string[] = [];
  let degree = startDegree;
  let octave = startOctave;
  const minLinear = toLinear(range.minDegree, range.minOctave);
  const maxLinear = toLinear(range.maxDegree, range.maxOctave);

  for (let i = 0; i < length; i++) {
    const linear = toLinear(degree % 7, octave);
    if (linear < minLinear || linear > maxLinear) break;

    // ITERATION 43: Insert chromatic passing tone with given probability
    if (direction === 1 && Math.random() < chromaticPct && i > 0 && i < length - 1) {
      const chr = getChromaticPassing(scaleNotes, (degree - 1 + 7) % 7, octave);
      if (chr) {
        result.push(chr);
        i++; // Count as extra note
        if (i >= length) break;
      }
    }

    result.push(degreeToKey(scaleNotes, degree % 7, octave));

    degree += direction;
    if (degree < 0) { degree += 7; octave--; }
    else if (degree >= 7) { degree -= 7; octave++; }
  }

  return result;
}

/**
 * Generates an arpeggio pattern (chord tones)
 * @param chordDegree - Chord degree
 * @param scaleNotes - Scale notes array
 * @param startOctave - Starting octave
 * @param length - Number of notes
 * @param pattern - 'up', 'down', or 'updown'
 * @param range - Range constraints
 * @returns Array of note keys
 */
function generateArpeggio(
  chordDegree: ChordDegree,
  scaleNotes: string[],
  startOctave: number,
  length: number,
  pattern: 'up' | 'down' | 'updown',
  range: RangeConfig,
): string[] {
  const chordTones = getChordTones(chordDegree, scaleNotes);
  const result: string[] = [];
  const minLinear = toLinear(range.minDegree, range.minOctave);
  const maxLinear = toLinear(range.maxDegree, range.maxOctave);

  let idx = 0;
  let octave = startOctave;
  let direction = pattern === 'down' ? -1 : 1;

  for (let i = 0; i < length; i++) {
    const degree = chordTones[idx % chordTones.length];
    const linear = toLinear(degree, octave);

    if (linear < minLinear || linear > maxLinear) break;

    result.push(degreeToKey(scaleNotes, degree, octave));

    idx += direction;

    // Handle octave changes
    if (idx < 0) {
      idx = chordTones.length - 1;
      octave--;
    } else if (idx >= chordTones.length) {
      idx = 0;
      octave++;
    }

    // Handle updown pattern
    if (pattern === 'updown' && i === Math.floor(length / 2)) {
      direction = -1;
    }
  }

  return result;
}

// ============================================================
// Melodic state for voice leading + recovery
// ============================================================
interface NoteState {
  degree: number;
  octave: number;
  lastJumpSize: number;
  lastDirection: number;
  recoveryRemaining: number;
  recoveryDirection: number;
}

// ============================================================
// Phrase contour
// ============================================================
type ContourPhase = 'rise' | 'climax' | 'descent' | 'rest';

function getContourPhase(noteIndex: number, totalNotes: number): ContourPhase {
  const pct = noteIndex / totalNotes;
  if (pct < 0.35) return 'rise';
  if (pct < 0.5) return 'climax';
  if (pct < 0.8) return 'descent';
  return 'rest';
}

function getContourDirectionBias(phase: ContourPhase, difficulty?: Difficulty): number {
  // Stufe 3: softer contour bias to avoid extreme up/down movements
  if (difficulty !== undefined && difficulty <= 3) {
    switch (phase) {
      case 'rise': return 0.60;
      case 'climax': return 0.50;
      case 'descent': return 0.40;
      case 'rest': return 0.45;
    }
  }
  switch (phase) {
    case 'rise': return 0.75;
    case 'climax': return 0.5;
    case 'descent': return 0.25;
    case 'rest': return 0.35;
  }
}

// ============================================================
// ITERATION 41-45: Chromatic passing tone support for Stufe 5+
// ============================================================
const CHROMATIC_NOTES: Record<string, string> = {
  'c': 'c#', 'd': 'd#', 'e': 'e#', 'f': 'f#', 'g': 'g#', 'a': 'a#', 'b': 'b#',
};

/**
 * Returns a chromatic passing tone between two scale degrees (ascending only)
 * Returns null if no chromatic note fits naturally
 */
function getChromaticPassing(scaleNotes: string[], degree: number, octave: number): string | null {
  const note = scaleNotes[degree % 7];
  // Only add chromatic if the next scale step is a whole tone (not already a half step)
  const nextDegree = (degree + 1) % 7;
  const nextNote = scaleNotes[nextDegree];
  // Simple heuristic: if both notes don't have accidentals, there's room for a chromatic
  if (!note.includes('#') && !note.includes('b') && !nextNote.includes('#') && !nextNote.includes('b')) {
    const chrNote = CHROMATIC_NOTES[note];
    if (chrNote) return `${chrNote}/${octave}`;
  }
  return null;
}

// ============================================================
// Note generation with voice leading, recovery, contour, harmonic awareness
// ============================================================
function generateNote(
  scaleNotes: string[],
  range: RangeConfig,
  difficulty: Difficulty,
  prev: NoteState | null,
  contourPhase: ContourPhase,
  chordDegree?: ChordDegree,
  duration?: string,
  strongBeat?: boolean,
): { key: string; state: NoteState } {
  const minLinear = toLinear(range.minDegree, range.minOctave);
  const maxLinear = toLinear(range.maxDegree, range.maxOctave);
  const comfortMin = toLinear(range.comfortMinDegree, range.comfortMinOctave);
  const comfortMax = toLinear(range.comfortMaxDegree, range.comfortMaxOctave);

  if (!prev) {
    // Vary start across full comfort range for better finger coverage (incl. Finger 5)
    const range = comfortMax - comfortMin;
    const startLinear = comfortMin + randInt(0, range);
    const { degree, octave } = fromLinear(startLinear);
    return {
      key: degreeToKey(scaleNotes, degree, octave),
      state: { degree, octave, lastJumpSize: 0, lastDirection: 0, recoveryRemaining: 0, recoveryDirection: 0 },
    };
  }

  const prevLinear = toLinear(prev.degree, prev.octave);
  const weights = INTERVAL_WEIGHTS[difficulty];
  let maxInterval = weights.length - 1;

  // CRITICAL: Fast notes MUST stay close together
  // ITERATION 1: Tighten eighth-note intervals for Stufe 3
  if (duration === '32' || duration === '16') {
    maxInterval = 1;  // Only seconds (stepwise)
  } else if (duration === '8') {
    if (difficulty <= 3) {
      maxInterval = 1;  // ITERATION 1: Stufe 3 eighths = stepwise only (seconds)
    } else if (difficulty === 4) {
      maxInterval = 2;  // Max third for Stufe 4 eighths
    } else {
      maxInterval = Math.min(maxInterval, 2);  // Max third for Stufe 5-6 eighths
    }
  }

  // Recovery mode: mandatory stepwise motion after large jumps
  if (prev.recoveryRemaining > 0) {
    const dir = prev.recoveryDirection;
    const targetLinear = Math.max(minLinear, Math.min(maxLinear, prevLinear + dir));
    const { degree, octave } = fromLinear(targetLinear);
    return {
      key: degreeToKey(scaleNotes, degree, octave),
      state: {
        degree, octave,
        lastJumpSize: 1,
        lastDirection: dir,
        recoveryRemaining: prev.recoveryRemaining - 1,
        recoveryDirection: dir,
      },
    };
  }

  let intervalSize = weightedRandomInterval(weights, maxInterval);

  // STUFE 3: Aggressive jump reduction — 95% stepwise, 5% thirds max
  if (difficulty === 3 && intervalSize >= 3) {
    intervalSize = Math.random() < 0.95 ? 1 : 2;
  }

  // ITERATION 46: Restrict octave jumps (interval >= 6) to phrase boundaries
  // Only allow large jumps at the start of a phrase or near climax
  if (intervalSize >= 6 && difficulty <= 5) {
    // Only keep the large jump if contour is at climax phase
    if (contourPhase !== 'climax') {
      intervalSize = randInt(2, 4); // Reduce to moderate jump
    }
  }

  // On strong beats, prefer chord tones (50% for Stufe 3, 70% otherwise)
  // ITERATION 1: Respect maxInterval when searching for chord tones
  const chordToneChance = difficulty <= 3 ? 0.50 : 0.70;
  if (strongBeat && chordDegree !== undefined && Math.random() < chordToneChance) {
    const chordTones = getChordTones(chordDegree, scaleNotes);
    // Try to find a nearby chord tone — but never exceed maxInterval
    const chordSearchRadius = Math.min(maxInterval, 4);
    for (let offset = 0; offset <= chordSearchRadius; offset++) {
      for (const dir of [1, -1]) {
        const testLinear = prevLinear + dir * offset;
        if (testLinear < minLinear || testLinear > maxLinear) continue;
        const { degree } = fromLinear(testLinear);
        if (chordTones.includes(degree % 7)) {
          const { octave } = fromLinear(testLinear);
          const actualInterval = Math.abs(testLinear - prevLinear);
          const actualDir = testLinear > prevLinear ? 1 : testLinear < prevLinear ? -1 : 0;

          let recoveryRemaining = 0;
          let recoveryDirection = 0;
          if (actualInterval >= 4) {
            recoveryRemaining = randInt(1, 2);
            recoveryDirection = actualDir === 0 ? (Math.random() < 0.5 ? 1 : -1) : -actualDir;
          }

          return {
            key: degreeToKey(scaleNotes, degree, octave),
            state: { degree, octave, lastJumpSize: actualInterval, lastDirection: actualDir, recoveryRemaining, recoveryDirection },
          };
        }
      }
    }
  }

  // ITERATION 11: Prevent consecutive large jumps more aggressively
  if (intervalSize >= 3 && prev.lastJumpSize >= 3 && difficulty <= 4) {
    intervalSize = randInt(1, 2);
  }
  if (intervalSize >= 4 && prev.lastJumpSize >= 4) {
    intervalSize = 1;
  }
  if (intervalSize >= 6 && prev.lastJumpSize >= 3) {
    intervalSize = randInt(1, 2);
  }

  const upBias = getContourDirectionBias(contourPhase, difficulty);
  let direction = Math.random() < upBias ? 1 : -1;

  if (prevLinear < comfortMin) direction = 1;
  else if (prevLinear > comfortMax) direction = -1;

  let targetLinear = prevLinear + direction * intervalSize;
  targetLinear = Math.max(minLinear, Math.min(maxLinear, targetLinear));

  if (targetLinear === prevLinear && intervalSize > 0) {
    targetLinear = prevLinear - direction * intervalSize;
    targetLinear = Math.max(minLinear, Math.min(maxLinear, targetLinear));
  }

  const actualInterval = Math.abs(targetLinear - prevLinear);
  const actualDir = targetLinear > prevLinear ? 1 : targetLinear < prevLinear ? -1 : 0;

  // Recovery system: start recovery earlier (from 4th/5th instead of 6th)
  // ITERATION 3: For eighths, trigger recovery after any jump >= 2 (third) to prevent zigzag
  let recoveryRemaining = 0;
  let recoveryDirection = 0;
  if (actualInterval >= 5) {
    recoveryRemaining = randInt(2, 3);
    recoveryDirection = actualDir === 0 ? (Math.random() < 0.5 ? 1 : -1) : -actualDir;
  } else if (actualInterval >= 4) {
    recoveryRemaining = randInt(1, 2);
    recoveryDirection = actualDir === 0 ? (Math.random() < 0.5 ? 1 : -1) : -actualDir;
  } else if (actualInterval >= 2 && (duration === '8' || duration === '16' || duration === '32')) {
    // ITERATION 3: After a third in fast notes, next note must step back
    recoveryRemaining = 1;
    recoveryDirection = actualDir === 0 ? (Math.random() < 0.5 ? 1 : -1) : -actualDir;
  }

  const { degree, octave } = fromLinear(targetLinear);
  return {
    key: degreeToKey(scaleNotes, degree, octave),
    state: { degree, octave, lastJumpSize: actualInterval, lastDirection: actualDir, recoveryRemaining, recoveryDirection },
  };
}

// ============================================================
// Chord generation (ab Stufe 4)
// ============================================================
function generateChord(
  baseKey: string,
  scaleNotes: string[],
  difficulty: Difficulty,
): string[] {
  // baseKey format: "note/octave" e.g. "c/4"
  const [noteName, octStr] = baseKey.split('/');
  const octave = parseInt(octStr, 10);
  const degreeIndex = scaleNotes.findIndex(n => n === noteName);
  if (degreeIndex < 0) return [baseKey]; // fallback

  // Helper: get chord tone key ensuring close position (within octave of root)
  // Uses MIDI pitch to guarantee span ≤ 12 semitones from root
  const noteToMidi = (key: string): number => {
    const [n, o] = key.split('/');
    const map: Record<string, number> = {c:0,d:2,e:4,f:5,g:7,a:9,b:11};
    let s = map[n.charAt(0).toLowerCase()] ?? 0;
    if (n.includes('#')) s += 1;
    if (n.length > 1 && n.includes('b') && n !== 'b') s -= 1;
    return (parseInt(o) + 1) * 12 + s;
  };
  const rootMidi = noteToMidi(baseKey);
  const chordTone = (degOffset: number): string => {
    const deg = (degreeIndex + degOffset) % 7;
    let oct = (degreeIndex + degOffset) >= 7 ? octave + 1 : octave;
    const key = `${scaleNotes[deg]}/${oct}`;
    const midi = noteToMidi(key);
    // If more than 12 semitones above root, bring down an octave
    if (midi - rootMidi > 12) oct -= 1;
    // If below root, bring up
    if (noteToMidi(`${scaleNotes[deg]}/${oct}`) < rootMidi) oct += 1;
    return `${scaleNotes[deg]}/${oct}`;
  };

  // REWORK: Stufe 3 = Akkorde kennenlernen
  // 60% geblockt (Triads/Dyads), 40% gebrochen (Einzelton fuer Arpeggio)
  if (difficulty === 3) {
    const useBlockedChord = Math.random() < 0.60;
    if (useBlockedChord) {
      const r = Math.random();
      if (r < 0.55) {
        // Full triad (root + third + fifth)
        return [baseKey, chordTone(2), chordTone(4)];
      } else if (r < 0.80) {
        // Dyad: root + third
        return [baseKey, chordTone(2)];
      } else {
        // Dyad: root + fifth
        return [baseKey, chordTone(4)];
      }
    }
    return [baseKey]; // 40% single note for broken/arpeggio patterns
  }

  if (difficulty === 4) {
    // REWORK: Stufe 4 = fluessige Akkordwechsel, full triads + dyads
    const r = Math.random();
    if (r < 0.45) {
      return [baseKey, chordTone(2), chordTone(4)];
    } else if (r < 0.75) {
      return [baseKey, chordTone(2)];
    } else {
      return [baseKey, chordTone(4)];
    }
  }

  if (difficulty >= 5) {
    // ITERATION 36-40: Triads with inversions and voice leading
    const invRand = Math.random();
    if (invRand < 0.7) {
      return [baseKey, chordTone(2), chordTone(4)];
    } else if (invRand < 0.9) {
      // First inversion (third on bottom)
      const thirdDeg = (degreeIndex + 2) % 7;
      const fifthDeg = (degreeIndex + 4) % 7;
      return [`${scaleNotes[thirdDeg]}/${octave}`, `${scaleNotes[fifthDeg]}/${octave}`, `${noteName}/${octave + 1}`];
    } else {
      // Second inversion (fifth on bottom)
      const fifthDeg = (degreeIndex + 4) % 7;
      const thirdDeg = (degreeIndex + 2) % 7;
      return [`${scaleNotes[fifthDeg]}/${octave}`, `${noteName}/${octave}`, `${scaleNotes[thirdDeg]}/${octave}`];
    }
  }

  // ITERATION 49: Seventh chords for Stufe 6 (30% chance)
  if (difficulty >= 6 && Math.random() < 0.30) {
    const thirdDeg = (degreeIndex + 2) % 7;
    const thirdOct = (degreeIndex + 2) >= 7 ? octave + 1 : octave;
    const fifthDeg = (degreeIndex + 4) % 7;
    const fifthOct = (degreeIndex + 4) >= 7 ? octave + 1 : octave;
    const seventhDeg = (degreeIndex + 6) % 7;
    const seventhOct = (degreeIndex + 6) >= 7 ? octave + 1 : octave;
    return [baseKey, `${scaleNotes[thirdDeg]}/${thirdOct}`, `${scaleNotes[fifthDeg]}/${fifthOct}`, `${scaleNotes[seventhDeg]}/${seventhOct}`];
  }

  return [baseKey];
}

// ============================================================
// Fingering helpers
// ============================================================
const TREBLE_FINGERING: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 };
const BASS_FINGERING: Record<number, number> = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1 };

function getFingering(
  degree: number,
  isBass: boolean,
  difficulty: Difficulty,
  noteIndex: number,
): number | undefined {
  if (difficulty <= 2) {
    if (degree > 4) return undefined;
    if (noteIndex === 0 || noteIndex % 4 === 0) {
      return isBass ? BASS_FINGERING[degree] : TREBLE_FINGERING[degree];
    }
    return undefined;
  }
  if (noteIndex === 0 && degree <= 4) {
    return isBass ? BASS_FINGERING[degree] : TREBLE_FINGERING[degree];
  }
  return undefined;
}

// ============================================================
// Bar filling with rhythmic patterns + melodic contour + chords + patterns
// ============================================================
function fillBar(
  timeSignature: string,
  beatsPerBar: number,
  scaleNotes: string[],
  range: RangeConfig,
  difficulty: Difficulty,
  prevState: NoteState | null,
  isBass: boolean,
  _barIndexInPhrase: number,
  phraseLengthBars: number,
  noteCountEstimate: number,
  currentNoteInPhrase: number,
  chordDegree?: ChordDegree,
): { notes: Note[]; lastState: NoteState | null; notesGenerated: number } {
  const patterns = getRhythmicPatterns(timeSignature, difficulty);
  const pattern = pick(patterns);

  const notes: Note[] = [];
  let state = prevState;
  let noteIndex = prevState ? 999 : 0;
  let noteCount = 0;

  // ITERATION 7: Increased pattern usage for Stufe 3 to reduce random note-by-note generation
  const useScaleFragment = !isBass && Math.random() < (difficulty === 1 ? 0.4 : difficulty === 2 ? 0.35 : difficulty === 3 ? 0.45 : 0.3);
  const useArpeggio = !isBass && !useScaleFragment && difficulty >= 2 && chordDegree !== undefined &&
                      Math.random() < (difficulty === 2 ? 0.15 : difficulty === 3 ? 0.40 : 0.30);

  // If using scale fragment or arpeggio, generate it
  if (useScaleFragment && state) {
    const direction = Math.random() < 0.5 ? 1 : -1;
    const length = Math.min(pattern.length, difficulty === 1 ? 4 : difficulty <= 3 ? 5 : 7);
    const scaleKeys = generateScaleFragment(scaleNotes, state.degree, state.octave, length, direction, range);

    if (scaleKeys.length >= pattern.length) {
      // Use scale fragment
      for (let i = 0; i < pattern.length; i++) {
        const key = scaleKeys[i] || scaleKeys[scaleKeys.length - 1];
        const [noteName, octStr] = key.split('/');
        const degree = scaleNotes.indexOf(noteName);
        const octave = keyToLinearOctave(scaleNotes, noteName, parseInt(octStr, 10));

        const fingering = getFingering(degree, isBass, difficulty, noteIndex);
        const note: Note = { keys: [key], duration: pattern[i] };
        if (fingering !== undefined) note.fingering = fingering;

        notes.push(note);
        state = { degree, octave, lastJumpSize: 1, lastDirection: direction, recoveryRemaining: 0, recoveryDirection: 0 };
        noteIndex++;
        noteCount++;
      }
      return { notes, lastState: state, notesGenerated: noteCount };
    }
  }

  if (useArpeggio && state && chordDegree !== undefined) {
    const arpeggioPattern = pick(['up', 'down', 'updown'] as const);
    const length = Math.min(pattern.length, difficulty <= 3 ? 4 : 6);
    const arpeggioKeys = generateArpeggio(chordDegree, scaleNotes, state.octave, length, arpeggioPattern, range);

    if (arpeggioKeys.length >= pattern.length) {
      // Use arpeggio
      for (let i = 0; i < pattern.length; i++) {
        const key = arpeggioKeys[i] || arpeggioKeys[arpeggioKeys.length - 1];
        const [noteName, octStr] = key.split('/');
        const degree = scaleNotes.indexOf(noteName);
        const octave = keyToLinearOctave(scaleNotes, noteName, parseInt(octStr, 10));

        const fingering = getFingering(degree, isBass, difficulty, noteIndex);
        const note: Note = { keys: [key], duration: pattern[i] };
        if (fingering !== undefined) note.fingering = fingering;

        notes.push(note);
        state = { degree, octave, lastJumpSize: 2, lastDirection: 0, recoveryRemaining: 0, recoveryDirection: 0 };
        noteIndex++;
        noteCount++;
      }
      return { notes, lastState: state, notesGenerated: noteCount };
    }
  }

  // ITERATION 2: Detect consecutive fast-note runs and force scale/arpeggio patterns
  // Find runs of 4+ consecutive eighths/16ths in the pattern
  const fastRunIndices: { start: number; length: number }[] = [];
  {
    let runStart = -1;
    let runLen = 0;
    for (let pi = 0; pi < pattern.length; pi++) {
      const dur = pattern[pi];
      if (dur === '8' || dur === '16' || dur === '32') {
        if (runStart < 0) runStart = pi;
        runLen++;
      } else {
        if (runLen >= 4) fastRunIndices.push({ start: runStart, length: runLen });
        runStart = -1;
        runLen = 0;
      }
    }
    if (runLen >= 4) fastRunIndices.push({ start: runStart, length: runLen });
  }

  // Pre-generate scale fragments for fast runs
  const fastRunKeys: Map<number, string[]> = new Map();
  if (state) {
    for (const run of fastRunIndices) {
      const dir = Math.random() < 0.5 ? 1 : -1;
      // ITERATION 2+5: Use idiomatic patterns, scale fragments, or arpeggios for fast note groups
      let keys: string[];
      const rand = Math.random();
      // ITERATION 5: 70% chance to use idiomatic eighth pattern for Stufe 3-4
      if (difficulty <= 4 && run.length === 4 && rand < 0.7) {
        const patterns = difficulty <= 3 ? EIGHTH_PATTERNS_3 : EIGHTH_PATTERNS_4;
        const patternOffsets = pick(patterns);
        keys = applyEighthPattern(patternOffsets, scaleNotes, state.degree, state.octave, range);
      } else if (chordDegree !== undefined && rand < 0.6) {
        keys = generateArpeggio(chordDegree, scaleNotes, state.octave, run.length, pick(['up', 'down'] as const), range);
      } else if (difficulty >= 5 && Math.random() < 0.25) {
        // ITERATION 44: Chromatic scale fragments for Stufe 5+ (increased from 15% to 25%)
        keys = generateChromaticScaleFragment(scaleNotes, state.degree, state.octave, run.length, dir, range, 0.3);
      } else {
        keys = generateScaleFragment(scaleNotes, state.degree, state.octave, run.length, dir, range);
      }
      if (keys.length >= run.length) {
        fastRunKeys.set(run.start, keys);
        // Update state to end of fragment
        const lastKey = keys[keys.length - 1];
        const [ln, lo] = lastKey.split('/');
        state = {
          degree: scaleNotes.indexOf(ln),
          octave: keyToLinearOctave(scaleNotes, ln, parseInt(lo, 10)),
          lastJumpSize: 1,
          lastDirection: dir,
          recoveryRemaining: 0,
          recoveryDirection: 0,
        };
      }
    }
  }

  // Normal note-by-note generation
  // REWORK: Chord placement logic
  // Stufe 3: Akkord auf Beat 1 jedes Takts (60% geblockt, 40% gebrochen handled separately)
  // Stufe 4: Akkorde auch auf anderen Beats moeglich (schnellere Wechsel)
  let shouldPlaceChord = false;
  let chordNoteIndex = -1;
  if (difficulty === 3 && !isBass) {
    shouldPlaceChord = Math.random() < 0.40;  // 40% chord on beat 1 (Akkorde kennenlernen)
    chordNoteIndex = shouldPlaceChord ? 0 : -1;
    // Fix #1: Ensure pattern starts with a chord-suitable duration (h, hd, q, w)
    if (shouldPlaceChord) {
      const firstDur = pattern[0];
      if (!['h', 'hd', 'q', 'w'].includes(firstDur)) {
        const fallbacks = [['h', 'q', 'q'], ['h', 'h'], ['hd', 'q'], ['q', 'q', 'q', 'q']];
        const newPat = pick(fallbacks);
        pattern.length = 0;
        pattern.push(...newPat);
      }
    }
  } else if (difficulty === 4 && !isBass) {
    // Stufe 4: chord on beat 1 (50%) + possible chord on beat 3 (25%)
    shouldPlaceChord = Math.random() < 0.50;
    chordNoteIndex = shouldPlaceChord ? 0 : -1;
  } else if (difficulty >= 5 && !isBass) {
    shouldPlaceChord = Math.random() < 0.25;
    chordNoteIndex = shouldPlaceChord ? 0 : -1;
  }

  // Track dotted notes to limit them
  let dottedCount = 0;
  const maxDottedPct = difficulty === 2 ? 0.15 : difficulty === 3 ? 0.2 : 0.25;

  for (let pi = 0; pi < pattern.length; pi++) {
    const duration = pattern[pi];
    const totalNotesInPhrase = noteCountEstimate > 0 ? noteCountEstimate : phraseLengthBars * 4;
    const phase = getContourPhase(currentNoteInPhrase + noteCount, totalNotesInPhrase);

    // Determine if this is a strong beat (beat 1 or 3 in 4/4)
    let beatsElapsed = 0;
    for (let i = 0; i < pi; i++) {
      beatsElapsed += DURATION_BEATS[pattern[i]] || 0;
    }
    const strongBeat = beatsElapsed % 2 === 0 && beatsPerBar >= 3;

    // ITERATION 2: Check if this note is part of a pre-generated fast run
    let usedFastRun = false;
    for (const run of fastRunIndices) {
      const runKeys = fastRunKeys.get(run.start);
      if (runKeys && pi >= run.start && pi < run.start + run.length) {
        const keyIdx = pi - run.start;
        const key = runKeys[keyIdx];
        const [noteName, octStr] = key.split('/');
        const degree = scaleNotes.indexOf(noteName);
        const octave = keyToLinearOctave(scaleNotes, noteName, parseInt(octStr, 10));

        const fingering = getFingering(degree >= 0 ? degree : 0, isBass, difficulty, noteIndex);
        const note: Note = { keys: [key], duration };
        if (fingering !== undefined) note.fingering = fingering;

        notes.push(note);
        state = { degree: degree >= 0 ? degree : 0, octave, lastJumpSize: 1, lastDirection: 0, recoveryRemaining: 0, recoveryDirection: 0 };
        noteIndex++;
        noteCount++;
        usedFastRun = true;
        break;
      }
    }
    if (usedFastRun) continue;

    const result = generateNote(scaleNotes, range, difficulty, state, phase, chordDegree, duration, strongBeat);
    state = result.state;

    const fingering = getFingering(state.degree, isBass, difficulty, noteIndex);

    // Fix: No chords/dyads on fast notes (8th, 16th, 32nd) — pedagogically incorrect
    const isFastNote = duration === '8' || duration === '8d' || duration === '16' || duration === '32';

    let keys: string[];
    if (isFastNote) {
      keys = [result.key];
    } else if (pi === chordNoteIndex && difficulty >= 3) {
      keys = generateChord(result.key, scaleNotes, difficulty);
    } else if (difficulty === 3 && !isBass && pi > 0) {
      // Stufe 3: KEINE Akkorde auf Non-Beat-1 — Melodie-Fokus
      keys = [result.key];
    } else if (difficulty === 4 && !isBass && pi > 0 && Math.random() < 0.50) {
      // REWORK Stufe 4: chords on various beats (~40% total target)
      keys = generateChord(result.key, scaleNotes, difficulty);
    } else {
      keys = [result.key];
    }

    // Limit dotted notes
    if (duration.includes('d')) {
      dottedCount++;
    }

    const note: Note = { keys, duration };
    if (fingering !== undefined) {
      note.fingering = fingering;
    }

    notes.push(note);
    noteIndex++;
    noteCount++;
  }

  // Validate: if too many dotted notes, regenerate (simple heuristic)
  if (dottedCount / notes.length > maxDottedPct && notes.length > 2) {
    // Just accept it for now (full regeneration is complex)
  }

  return { notes, lastState: state, notesGenerated: noteCount };
}

// ============================================================
// Harmonic bass generation (plays chord root and fifth on strong beats)
// ============================================================
function generateHarmonicBass(
  timeSignature: string,
  _beatsPerBar: number,
  scaleNotes: string[],
  bassRange: RangeConfig,
  difficulty: Difficulty,
  chordDegree: ChordDegree,
  prevState: NoteState | null,
  _barIndex: number = 0,
  isFirstBar: boolean = false,
): { notes: Note[]; lastState: NoteState | null } {
  const notes: Note[] = [];
  let bassNoteIndex = 0;

  // Helper: Add bass note with optional fingering (only first note of first bar)
  function pushBassNote(keys: string[], duration: string, degree?: number) {
    const note: Note = { keys, duration };
    // Fingering only for the very first single note of the exercise
    if (isFirstBar && bassNoteIndex === 0 && keys.length === 1 && degree !== undefined && degree <= 4) {
      const fingering = getFingering(degree, true, difficulty, 0);
      if (fingering !== undefined) note.fingering = fingering;
    }
    notes.push(note);
    bassNoteIndex++;
  }

  // Bass octave preference
  const bassOctave = difficulty <= 2 ? 3 : difficulty <= 4 ? 2 : 2;

  if (difficulty === 1) {
    // Stufe 1: Not used (alternating hands)
    return { notes: [], lastState: prevState };
  } else if (difficulty === 2) {
    // Stufe 2: 75% whole/dotted-half on root, 25% simple melodic bass
    const rootKey = getChordRootKey(chordDegree, scaleNotes, bassOctave);
    const [noteName, octStr] = rootKey.split('/');
    const degree = scaleNotes.indexOf(noteName);
    const octave = keyToLinearOctave(scaleNotes, noteName, parseInt(octStr, 10));
    const rootState: NoteState = { degree, octave, lastJumpSize: 0, lastDirection: 0, recoveryRemaining: 0, recoveryDirection: 0 };

    const useMelodicBass = Math.random() < 0.50;  // 50% melodisch (war 25%)

    if (!useMelodicBass) {
      // Static bass: halbe Noten statt ganze (mehr Fingeraktivitaet)
      if (timeSignature === '3/4') {
        pushBassNote([rootKey], 'hd', degree);
      } else {
        // 30% Root-Quinte fuer harmonische Farbe
        const fifthDegree = (degree + 4) % 7;
        const fifthOct = (degree + 4) >= 7 ? octave + 1 : octave;
        const fifthKey = degreeToKey(scaleNotes, fifthDegree, fifthOct);
        if (Math.random() < 0.30) {
          pushBassNote([rootKey], 'h', degree);
          pushBassNote([fifthKey], 'h', fifthDegree);
        } else {
          pushBassNote([rootKey], 'h', degree);
          pushBassNote([rootKey], 'h', degree);
        }
      }
      return { notes, lastState: rootState };
    }

    // Melodic bass: mit Achtelpaaren fuer Duolen-Training
    if (timeSignature === '3/4') {
      const patterns3: string[][] = [
        ['h', 'q'], ['q', 'h'], ['q', 'q', 'q'],
        ['8', '8', 'q', 'q'],  // Achtelpaar am Anfang
        ['q', '8', '8', 'q'],  // Achtel in der Mitte
        ['8', '8', 'h'],       // Achtel + Halbe
      ];
      const pat = pick(patterns3);
      let st = rootState;
      for (const dur of pat) {
        const res = generateNote(scaleNotes, bassRange, 2, st, 'rest', chordDegree, dur, false);
        pushBassNote([res.key], dur, scaleNotes.indexOf(res.key.split('/')[0]));
        st = res.state;
      }
      return { notes, lastState: st };
    } else {
      const patterns4: string[][] = [
        ['h', 'h'],
        ['h', 'q', 'q'],
        ['q', 'q', 'h'],
        ['q', 'q', 'q', 'q'],
        ['8', '8', 'q', 'q', 'q'],  // Achtelpaar am Anfang
        ['q', 'q', '8', '8', 'q'],  // Achtelpaar in der Mitte
        ['h', '8', '8', 'q'],       // Achtelpaar nach Halber
        ['8', '8', 'h', 'q'],       // Achtel + Halbe + Viertel
        ['q', 'q', 'q', '8', '8'],  // Achtel am Ende
      ];
      const pat = pick(patterns4);
      let st = rootState;
      for (const dur of pat) {
        const res = generateNote(scaleNotes, bassRange, 2, st, 'rest', chordDegree, dur, false);
        pushBassNote([res.key], dur, scaleNotes.indexOf(res.key.split('/')[0]));
        st = res.state;
      }
      return { notes, lastState: st };
    }
  } else if (difficulty === 3) {
    // REWORK Stufe 3: Bass mit Achtel-Abwechslung (jeder 3. Takt)
    const chordTones = getChordTones(chordDegree, scaleNotes);
    const rootDegree = chordTones[0];
    const thirdDegree = chordTones[1];
    const fifthDegree = chordTones[2];

    const rootKey = degreeToKey(scaleNotes, rootDegree, bassOctave);
    const thirdKey = degreeToKey(scaleNotes, thirdDegree, bassOctave);
    const fifthOct = (rootDegree + 4) >= 7 ? bassOctave + 1 : bassOctave;
    const fifthKey = degreeToKey(scaleNotes, fifthDegree, fifthOct);

    // 20% Achtel-Takte (Bass soll einfach + unterstützend bleiben)
    const useEighthBass = Math.random() < 0.2;

    if (!useEighthBass) {
      // 8 einfache Patterns (mehr Akkord-Vielfalt, Walzer/Oom-Pah)
      const simplePattern = randInt(0, 7);
      if (timeSignature === '4/4') {
        switch (simplePattern) {
          case 0: // Geblockter Dreiklang (ganze Note)
            pushBassNote([rootKey, thirdKey, fifthKey], 'w');
            break;
          case 1: // Geblockter Dreiklang (h) + Root (h)
            pushBassNote([rootKey, thirdKey, fifthKey], 'h');
            pushBassNote([rootKey], 'h', rootDegree);
            break;
          case 2: // Oom-Pah klassisch: r + [3,5] + r + [3,5]
            pushBassNote([rootKey], 'q', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            pushBassNote([rootKey], 'q', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            break;
          case 3: // Oom-Pah Variation: r + [3,5] (halbe Noten)
            pushBassNote([rootKey], 'h', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'h');
            break;
          case 4: // Root + Fifth (halbe Noten)
            pushBassNote([rootKey], 'h', rootDegree);
            pushBassNote([fifthKey], 'h');
            break;
          case 5: // Root+Fifth chord (h) + Root (h)
            pushBassNote([rootKey, fifthKey], 'h');
            pushBassNote([rootKey], 'h', rootDegree);
            break;
          case 6: // Ganze Note Root
            pushBassNote([rootKey], 'w', rootDegree);
            break;
          case 7: // Gebrochener Dreiklang aufwaerts (Viertel)
            pushBassNote([rootKey], 'q', rootDegree);
            pushBassNote([thirdKey], 'q');
            pushBassNote([fifthKey], 'q');
            pushBassNote([rootKey], 'q', rootDegree);
            break;
        }
      } else if (timeSignature === '3/4') {
        switch (simplePattern % 6) {
          case 0: // Walzer-Bass: r + [3,5] + [3,5]
            pushBassNote([rootKey], 'q', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            pushBassNote([thirdKey, fifthKey], 'q');
            break;
          case 1: // Geblockter Dreiklang (hd)
            pushBassNote([rootKey, thirdKey, fifthKey], 'hd');
            break;
          case 2: // Geblockter Dreiklang (h) + Root (q)
            pushBassNote([rootKey, thirdKey, fifthKey], 'h');
            pushBassNote([rootKey], 'q', rootDegree);
            break;
          case 3: // Root (h) + Fifth (q)
            pushBassNote([rootKey], 'h', rootDegree);
            pushBassNote([fifthKey], 'q');
            break;
          case 4: // Gebrochener Dreiklang
            pushBassNote([rootKey], 'q', rootDegree);
            pushBassNote([thirdKey], 'q');
            pushBassNote([fifthKey], 'q');
            break;
          case 5: // Root (hd)
            pushBassNote([rootKey], 'hd', rootDegree);
            break;
        }
      } else if (timeSignature === '2/4') {
        switch (simplePattern % 4) {
          case 0: // Oom-Pah: r + [3,5]
            pushBassNote([rootKey], 'q', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            break;
          case 1: // Geblockter Akkord
            pushBassNote([rootKey, thirdKey, fifthKey], 'h');
            break;
          case 2: // Root + Fifth
            pushBassNote([rootKey], 'q', rootDegree);
            pushBassNote([fifthKey], 'q');
            break;
          case 3: // Root+Fifth Akkord
            pushBassNote([rootKey, fifthKey], 'h');
            break;
        }
      } else if (timeSignature === '6/8') {
        // 6/8: Achtel-Patterns
        const eighthPattern = randInt(0, 3);
        switch (eighthPattern) {
          case 0: // qd + qd (klassisch)
            pushBassNote([rootKey], 'qd', rootDegree);
            pushBassNote([fifthKey], 'qd');
            break;
          case 1: // 8+8+8 + qd
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], 'qd');
            break;
          case 2: // qd + 8+8+8
            pushBassNote([rootKey], 'qd', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            break;
          case 3: // 6 Achtel (rocking bass)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            break;
        }
      }
    } else {
      // Achtel-Patterns (kein Alberti in Stufe 3 — verschoben zu Stufe 4)
      if (timeSignature === '4/4') {
        const eighthPattern = randInt(0, 4);
        switch (eighthPattern) {
          case 0: // Gebrochener Dreiklang aufwaerts+abwaerts: r-3-5-r | 5-3-r-5
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            break;
          case 1: // Gebrochener Dreiklang: r-3-5 (Achtel) + r(q) + [3,5](q)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([rootKey], 'q', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            break;
          case 2: // Oom-Pah mit Achtel: r(8)+r(8) + [3,5](q) + r(8)+r(8) + [3,5](q)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            break;
          case 3: // Welle: r-3-5-3-r-3-5-3
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            break;
          case 4: // Pendel mit Dreiklang-Schluss: r-5-r-5 + [r,3,5](h)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey, thirdKey, fifthKey], 'h');
            break;
        }
      } else if (timeSignature === '3/4') {
        const eighthPattern = randInt(0, 3);
        switch (eighthPattern) {
          case 0: // Gebrochener Dreiklang: r-3-5-3-r-5
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            break;
          case 1: // Walzer-Achtel: r(8)+r(8) + [3,5](q) + [3,5](q)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            pushBassNote([thirdKey, fifthKey], 'q');
            break;
          case 2: // Aufwaerts: r-3-5 (Achtel) + [r,3,5](qd)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey, thirdKey, fifthKey], 'qd');
            break;
          case 3: // r-5-3-5-r-5
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            break;
        }
      } else if (timeSignature === '2/4') {
        const eighthPattern = randInt(0, 3);
        switch (eighthPattern) {
          case 0: // Gebrochener Dreiklang: r-3-5-r
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            break;
          case 1: // Oom-Pah Achtel: r(8)+r(8) + [3,5](q)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey, fifthKey], 'q');
            break;
          case 2: // Welle: r-3-5-3
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            break;
          case 3: // Root + Akkord: r(8)+5(8) + [r,3,5](q)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey, thirdKey, fifthKey], 'q');
            break;
        }
      } else if (timeSignature === '6/8') {
        // 6/8: Achtel-Patterns
        const eighthPattern = randInt(0, 3);
        switch (eighthPattern) {
          case 0: // qd + qd (klassisch)
            pushBassNote([rootKey], 'qd', rootDegree);
            pushBassNote([fifthKey], 'qd');
            break;
          case 1: // 8+8+8 + qd
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], 'qd');
            break;
          case 2: // qd + 8+8+8
            pushBassNote([rootKey], 'qd', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            break;
          case 3: // 6 Achtel (rocking bass)
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            pushBassNote([thirdKey], '8');
            pushBassNote([fifthKey], '8');
            pushBassNote([rootKey], '8', rootDegree);
            pushBassNote([fifthKey], '8');
            break;
        }
      }
    }

    const lastNote = notes[notes.length - 1];
    const lastKey = lastNote.keys[0];
    const [noteName, octStr] = lastKey.split('/');
    const degree = scaleNotes.indexOf(noteName);
    const octave = keyToLinearOctave(scaleNotes, noteName, parseInt(octStr, 10));
    const state: NoteState = { degree, octave, lastJumpSize: 4, lastDirection: 1, recoveryRemaining: 0, recoveryDirection: 0 };
    return { notes, lastState: state };
  } else {
    // ITERATION 27-30: Multiple bass patterns for Stufe 4+
    const chordTones = getChordTones(chordDegree, scaleNotes);
    const rootDegree = chordTones[0];
    const thirdDegree = chordTones[1];
    const fifthDegree = chordTones[2];

    const rootKey = degreeToKey(scaleNotes, rootDegree, bassOctave);
    const thirdKey = degreeToKey(scaleNotes, thirdDegree, bassOctave);
    const fifthOct = (rootDegree + 4) >= 7 ? bassOctave + 1 : bassOctave;
    const fifthKey = degreeToKey(scaleNotes, fifthDegree, fifthOct);
    const rootHighKey = degreeToKey(scaleNotes, rootDegree, bassOctave + 1);

    // Choose bass pattern with weighted selection (Alberti dominant for Stufe 4)
    const bassWeights = difficulty <= 4 ? [50, 18, 12, 8, 12] : [25, 15, 15, 10, 15, 10, 10];
    let bassPattern = 0;
    { let r = Math.random() * bassWeights.reduce((a,b) => a+b, 0);
      for (let bp = 0; bp < bassWeights.length; bp++) { r -= bassWeights[bp]; if (r <= 0) { bassPattern = bp; break; } } }

    if (timeSignature === '4/4') {
      switch (bassPattern) {
        case 0: // Alberti: root-fifth-third-fifth
          pushBassNote([rootKey], 'q', rootDegree);
          pushBassNote([fifthKey], 'q');
          pushBassNote([thirdKey], 'q');
          pushBassNote([fifthKey], 'q');
          break;
        case 1: // ITERATION 27: Oom-pah: root, chord-chord
          pushBassNote([rootKey], 'q', rootDegree);
          pushBassNote([thirdKey, fifthKey], 'q');
          pushBassNote([rootKey], 'q', rootDegree);
          pushBassNote([thirdKey, fifthKey], 'q');
          break;
        case 2: // ITERATION 28: Broken chord ascending
          pushBassNote([rootKey], 'q', rootDegree);
          pushBassNote([thirdKey], 'q');
          pushBassNote([fifthKey], 'q');
          pushBassNote([rootHighKey], 'q');
          break;
        case 3: // ITERATION 29: Broken octaves (root-high alternating eighths for Stufe 4+)
          if (difficulty >= 4) {
            for (let bo = 0; bo < 4; bo++) {
              pushBassNote([rootKey], '8', rootDegree);
              pushBassNote([rootHighKey], '8');
            }
          } else {
            pushBassNote([rootKey], 'h', rootDegree);
            pushBassNote([rootHighKey], 'h');
          }
          break;
        case 4: // ITERATION 30: Walking bass (stepwise)
        {
          const walkDeg1 = (rootDegree + 1) % 7;
          const walkDeg2 = (rootDegree + 2) % 7;
          const walkDeg3 = (rootDegree + 3) % 7;
          pushBassNote([rootKey], 'q', rootDegree);
          pushBassNote([degreeToKey(scaleNotes, walkDeg1, bassOctave)], 'q');
          pushBassNote([degreeToKey(scaleNotes, walkDeg2, bassOctave)], 'q');
          pushBassNote([degreeToKey(scaleNotes, walkDeg3, bassOctave)], 'q');
          break;
        }
        case 5: // ITERATION 30: Syncopated bass (real off-beat emphasis)
          pushBassNote([rootKey], '8', rootDegree);
          pushBassNote([fifthKey], 'q');
          pushBassNote([rootKey], '8', rootDegree);
          pushBassNote([fifthKey], 'q');
          pushBassNote([rootKey], '8', rootDegree);
          pushBassNote([thirdKey], '8');
          break;
      }
    } else if (timeSignature === '3/4') {
      switch (bassPattern % 3) {
        case 0: // Root-fifth-third
          pushBassNote([rootKey], 'q', rootDegree);
          pushBassNote([fifthKey], 'q');
          pushBassNote([thirdKey], 'q');
          break;
        case 1: // ITERATION 27: Waltz: root, chord-chord
          pushBassNote([rootKey], 'q', rootDegree);
          pushBassNote([thirdKey, fifthKey], 'q');
          pushBassNote([thirdKey, fifthKey], 'q');
          break;
        case 2: // ITERATION 28: Broken ascending
          pushBassNote([rootKey], 'q', rootDegree);
          pushBassNote([thirdKey], 'q');
          pushBassNote([fifthKey], 'q');
          break;
      }
    } else if (timeSignature === '2/4') {
      pushBassNote([rootKey], 'q', rootDegree);
      pushBassNote([bassPattern % 2 === 0 ? fifthKey : thirdKey], 'q');
    } else {
      // 6/8
      switch (bassPattern % 3) {
        case 0:
          pushBassNote([rootKey], 'qd', rootDegree);
          pushBassNote([fifthKey], 'qd');
          break;
        case 1: // ITERATION 28: Broken chord 6/8
          pushBassNote([rootKey], '8', rootDegree);
          pushBassNote([thirdKey], '8');
          pushBassNote([fifthKey], '8');
          pushBassNote([rootHighKey], 'qd');
          break;
        case 2: // ITERATION 29: Pedal point
          pushBassNote([rootKey], 'qd', rootDegree);
          pushBassNote([rootKey], 'qd', rootDegree);
          break;
      }
    }

    const [noteName, octStr] = fifthKey.split('/');
    const degree = scaleNotes.indexOf(noteName);
    const octave = keyToLinearOctave(scaleNotes, noteName, parseInt(octStr, 10));
    const state: NoteState = { degree, octave, lastJumpSize: 2, lastDirection: 1, recoveryRemaining: 0, recoveryDirection: 0 };
    return { notes, lastState: state };
  }
}

// ============================================================
// Progression
// ============================================================
export function applyProgression(
  config: GeneratorConfig,
  baseTempo: number,
): { barCount: number; tempo: number } {
  const step = config.progressionStep ?? 0;
  const baseBarCount = config.barCount ?? 4;
  const barCount = Math.min(24, baseBarCount + step * 2);
  const tempo = baseTempo + step * 2;
  return { barCount, tempo };
}

// ============================================================
// Main generator
// ============================================================
export function generateExercise(config: GeneratorConfig): Exercise {
  // Determine key based on difficulty restrictions
  const weightedKey = pickWeightedKey(config.difficulty);
  const allowedKeys = ALLOWED_KEYS[config.difficulty];
  let key: string;
  if (weightedKey) {
    key = weightedKey;
  } else if (allowedKeys) {
    key = pick(allowedKeys);
  } else {
    const keyOptions = KEY_STAGES[config.keyStage];
    key = pick(keyOptions);
  }
  const scaleNotes = getScaleNotesForDifficulty(key, config.difficulty);

  // Determine time signature based on difficulty restrictions
  const availableTimeSigs = AVAILABLE_TIME_SIGS[config.difficulty];
  let timeSignature: string;
  if (config.timeSignature === 'random') {
    timeSignature = pick(availableTimeSigs);
  } else {
    // If selected time sig not available for this difficulty, fall back
    timeSignature = availableTimeSigs.includes(config.timeSignature)
      ? config.timeSignature
      : pick(availableTimeSigs);
  }

  const [beatsNum] = timeSignature.split('/').map(Number);
  const beatsPerBar = timeSignature === '6/8' ? 3 : beatsNum;

  const barCountRange: Record<Difficulty, { min: number; max: number }> = {
    1: { min: 4, max: 6 },
    2: { min: 4, max: 8 },
    3: { min: 6, max: 10 },
    4: { min: 8, max: 12 },
    5: { min: 8, max: 16 },
    6: { min: 12, max: 24 },
  };

  const baseTempo = DEFAULT_TEMPO[config.difficulty];
  const progression = applyProgression(config, baseTempo);

  // Use config.barCount directly if specified (don't apply progression to bar count)
  const barCount = config.barCount
    ? config.barCount
    : randInt(barCountRange[config.difficulty].min, barCountRange[config.difficulty].max);

  const trebleRange = TREBLE_RANGES[config.difficulty];
  const bassRange = BASS_RANGES[config.difficulty];

  const bars: Bar[] = [];
  let trebleState: NoteState | null = null;
  let bassState: NoteState | null = null;

  // Generate harmonic progression for the entire exercise
  const harmonicProgression = generateHarmonicProgression(barCount, config.difficulty, key);

  // Phrase structure
  const phraseLengths = PHRASE_LENGTHS[config.difficulty];
  let currentPhraseLength = pick(phraseLengths);
  let barInPhrase = 0;
  let trebleNoteInPhrase = 0;
  let bassNoteInPhrase = 0;
  // ITERATION 12: Better note-count estimate based on difficulty (fixes contour phase calculation)
  const estimatedNotesPerBar = config.difficulty <= 2 ? 3 : config.difficulty <= 4 ? 5 : 7;

  // For phrase repetition (AABA pattern)
  const repeatProbability = config.difficulty === 1 ? 0.5 : config.difficulty === 2 ? 0.5 : config.difficulty === 3 ? 0.15 : config.difficulty === 4 ? 0.3 : 0.2;
  const phraseMemory: Bar[] = [];

  // For difficulty 1: alternate hands
  function buildBarRest(isBass: boolean): Note[] {
    const restKey = isBass ? 'd/3' : 'b/4';
    if (beatsPerBar === 4) return [{ keys: [restKey], duration: 'wr' }];
    if (beatsPerBar === 3) return [{ keys: [restKey], duration: 'hr' }, { keys: [restKey], duration: 'qr' }];
    if (beatsPerBar === 2) return [{ keys: [restKey], duration: 'hr' }];
    return [{ keys: [restKey], duration: 'hdr' }];
  }

  let activeHand: 'treble' | 'bass' = 'treble';
  let barsUntilSwitch = config.difficulty === 1 ? randInt(2, 3) : 0;

  // Fix: Pre-calculate triplet bars for consistent distribution instead of per-bar random
  const tripletChance = TRIPLET_CHANCE[config.difficulty] || 0;
  const targetTripletBars = Math.max(0, Math.round(barCount * tripletChance));
  const tripletBarIndices = new Set<number>();
  if (targetTripletBars > 0) {
    const indices = Array.from({ length: barCount }, (_, idx) => idx);
    for (let j = indices.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [indices[j], indices[k]] = [indices[k], indices[j]];
    }
    for (let j = 0; j < targetTripletBars && j < indices.length; j++) {
      tripletBarIndices.add(indices[j]);
    }
  }

  for (let i = 0; i < barCount; i++) {
    // Check for phrase repetition
    const shouldRepeat = i >= 2 && i % 2 === 0 && Math.random() < repeatProbability && phraseMemory.length >= 2;

    if (shouldRepeat) {
      // Repeat the previous 2-bar phrase (or last available phrase)
      const repeatSource = phraseMemory[phraseMemory.length - 2];
      if (repeatSource) {
        bars.push({ number: i + 1, notes: [...repeatSource.notes], bassNotes: repeatSource.bassNotes ? [...repeatSource.bassNotes] : undefined });
        continue;
      }
    }

    if (barInPhrase >= currentPhraseLength) {
      barInPhrase = 0;
      trebleNoteInPhrase = 0;
      bassNoteInPhrase = 0;
      currentPhraseLength = pick(phraseLengths);
    }

    const phraseNoteEstimate = currentPhraseLength * estimatedNotesPerBar;
    // STUFE 3: Chord changes max every 2 bars for simpler progression
    const chordIndex = config.difficulty === 3 ? Math.floor(i / 2) : i;
    const currentChord = harmonicProgression[chordIndex % harmonicProgression.length];

    if (config.difficulty === 1) {
      // Stufe 1: Haende abwechselnd
      if (barsUntilSwitch <= 0) {
        activeHand = activeHand === 'treble' ? 'bass' : 'treble';
        barsUntilSwitch = randInt(2, 3);
      }
      barsUntilSwitch--;

      if (activeHand === 'treble') {
        const result = fillBar(timeSignature, beatsPerBar, scaleNotes, trebleRange, config.difficulty, trebleState, false, barInPhrase, currentPhraseLength, phraseNoteEstimate, trebleNoteInPhrase, currentChord);
        trebleState = result.lastState;
        trebleNoteInPhrase += result.notesGenerated;
        const bar = { number: i + 1, notes: result.notes, bassNotes: buildBarRest(true), chordDegree: currentChord };
        bars.push(bar);
        phraseMemory.push(bar);
      } else {
        const result = fillBar(timeSignature, beatsPerBar, scaleNotes, bassRange, config.difficulty, bassState, true, barInPhrase, currentPhraseLength, phraseNoteEstimate, bassNoteInPhrase, currentChord);
        bassState = result.lastState;
        bassNoteInPhrase += result.notesGenerated;
        const bar = { number: i + 1, notes: buildBarRest(false), bassNotes: result.notes, chordDegree: currentChord };
        bars.push(bar);
        phraseMemory.push(bar);
      }
    } else if (config.difficulty === 2) {
      // Stufe 2: Beide Haende zusammen, Bass mit harmonischer Begleitung
      const trebleResult = fillBar(timeSignature, beatsPerBar, scaleNotes, trebleRange, config.difficulty, trebleState, false, barInPhrase, currentPhraseLength, phraseNoteEstimate, trebleNoteInPhrase, currentChord);
      trebleState = trebleResult.lastState;
      trebleNoteInPhrase += trebleResult.notesGenerated;

      // Bass: harmonic accompaniment
      const bassResult = generateHarmonicBass(timeSignature, beatsPerBar, scaleNotes, bassRange, config.difficulty, currentChord, bassState, i, i === 0);
      bassState = bassResult.lastState;
      bassNoteInPhrase += bassResult.notes.length;

      const bar = { number: i + 1, notes: trebleResult.notes, bassNotes: bassResult.notes, chordDegree: currentChord };
      bars.push(bar);
      phraseMemory.push(bar);
    } else if (config.difficulty === 3) {
      // REWORK Stufe 3: Akkorde kennenlernen — Akkord auf Beat 1, dann Melodie
      const trebleResult = fillBar(timeSignature, beatsPerBar, scaleNotes, trebleRange, config.difficulty, trebleState, false, barInPhrase, currentPhraseLength, phraseNoteEstimate, trebleNoteInPhrase, currentChord);
      trebleState = trebleResult.lastState;
      trebleNoteInPhrase += trebleResult.notesGenerated;

      // REWORK: Inject triplet (5-10% chance) — replace last quarter note with triplet group
      let trebleNotes = trebleResult.notes;
      if (tripletBarIndices.has(i) && trebleState) {
        let qIdx = -1;
        for (let j = trebleNotes.length - 1; j >= 0; j--) {
          if (trebleNotes[j].duration === 'q') { qIdx = j; break; }
        }
        if (qIdx >= 0) {
          const triplet = generateTripletGroup(scaleNotes, trebleState.degree, trebleState.octave, trebleRange, currentChord, 3);
          trebleNotes = [...trebleNotes.slice(0, qIdx), ...triplet, ...trebleNotes.slice(qIdx + 1)];
        }
      }

      // Bass: harmonic accompaniment
      const bassResult = generateHarmonicBass(timeSignature, beatsPerBar, scaleNotes, bassRange, config.difficulty, currentChord, bassState, i, i === 0);
      bassState = bassResult.lastState;
      bassNoteInPhrase += bassResult.notes.length;

      // Bass triplets (~5% of bars, separate from treble triplets)
      let bassNotes = bassResult.notes;
      if (!tripletBarIndices.has(i) && Math.random() < 0.05 && bassState) {
        let qIdx = -1;
        for (let j = bassNotes.length - 1; j >= 0; j--) {
          if (bassNotes[j].duration === 'q') { qIdx = j; break; }
        }
        if (qIdx >= 0) {
          const triplet = generateTripletGroup(scaleNotes, bassState.degree, bassState.octave, bassRange, currentChord, 3);
          bassNotes = [...bassNotes.slice(0, qIdx), ...triplet, ...bassNotes.slice(qIdx + 1)];
        }
      }

      const bar = { number: i + 1, notes: trebleNotes, bassNotes, chordDegree: currentChord };
      bars.push(bar);
      phraseMemory.push(bar);
    } else {
      // Stufe 4+: Treble melodisch/Akkorde, Bass harmonisch
      const trebleResult = fillBar(timeSignature, beatsPerBar, scaleNotes, trebleRange, config.difficulty, trebleState, false, barInPhrase, currentPhraseLength, phraseNoteEstimate, trebleNoteInPhrase, currentChord);
      trebleState = trebleResult.lastState;
      trebleNoteInPhrase += trebleResult.notesGenerated;

      // REWORK: Inject triplet for Stufe 4 (15-25% chance)
      let trebleNotes = trebleResult.notes;
      if (config.difficulty === 4 && tripletBarIndices.has(i) && trebleState) {
        let qIdx = -1;
        for (let j = trebleNotes.length - 1; j >= 0; j--) {
          if (trebleNotes[j].duration === 'q') { qIdx = j; break; }
        }
        if (qIdx >= 0) {
          const triplet = generateTripletGroup(scaleNotes, trebleState.degree, trebleState.octave, trebleRange, currentChord, 4);
          trebleNotes = [...trebleNotes.slice(0, qIdx), ...triplet, ...trebleNotes.slice(qIdx + 1)];
        }
      }

      // Bass: harmonic accompaniment
      const bassResult = generateHarmonicBass(timeSignature, beatsPerBar, scaleNotes, bassRange, config.difficulty, currentChord, bassState, i, i === 0);
      bassState = bassResult.lastState;
      bassNoteInPhrase += bassResult.notes.length;

      const bar = { number: i + 1, notes: trebleNotes, bassNotes: bassResult.notes, chordDegree: currentChord };
      bars.push(bar);
      phraseMemory.push(bar);
    }

    barInPhrase++;
  }

  // Make last bar end on tonic — use nearest octave to avoid big jumps
  const lastBar = bars[bars.length - 1];
  if (lastBar.notes.length > 0) {
    const lastNote = lastBar.notes[lastBar.notes.length - 1];
    if (!lastNote.duration.endsWith('r')) {
      // Find the octave of the previous note to stay close
      const prevKey = lastBar.notes.length > 1 ? lastBar.notes[lastBar.notes.length - 2].keys[0] : lastNote.keys[0];
      const [prevNoteName, prevOctStr] = prevKey.split('/');
      const prevLinearOct = keyToLinearOctave(scaleNotes, prevNoteName, parseInt(prevOctStr, 10));
      lastNote.keys = [degreeToKey(scaleNotes, 0, prevLinearOct)];
    }
  }
  if (lastBar.bassNotes && lastBar.bassNotes.length > 0) {
    const lastBassNote = lastBar.bassNotes[lastBar.bassNotes.length - 1];
    if (!lastBassNote.duration.endsWith('r')) {
      const prevKey = lastBar.bassNotes.length > 1 ? lastBar.bassNotes[lastBar.bassNotes.length - 2].keys[0] : lastBassNote.keys[0];
      const [prevNoteName, prevOctStr] = prevKey.split('/');
      const prevLinearOct = keyToLinearOctave(scaleNotes, prevNoteName, parseInt(prevOctStr, 10));
      lastBassNote.keys = [degreeToKey(scaleNotes, 0, prevLinearOct)];
    }
  }

  // Post-process: fix large intervals caused by octave boundary issues
  const maxSemitonesForDifficulty: Record<Difficulty, number> = {
    1: 4, 2: 4, 3: 7, 4: 12, 5: 14, 6: 16,
  };
  fixLargeIntervalsMultiPass(bars, maxSemitonesForDifficulty[config.difficulty], scaleNotes, trebleRange, bassRange);

  // Fix 20: Voice-crossing validation — ensure bass never goes above treble
  for (const bar of bars) {
    if (bar.bassNotes && bar.notes.length > 0 && bar.bassNotes.length > 0) {
      // Get lowest treble note MIDI
      const trebleNonRest = bar.notes.filter(n => !n.duration.endsWith('r'));
      const bassNonRest = bar.bassNotes.filter(n => !n.duration.endsWith('r'));
      if (trebleNonRest.length > 0 && bassNonRest.length > 0) {
        const lowestTrebleMidi = Math.min(...trebleNonRest.map(n => keyToMidi(n.keys[0])));
        for (const bn of bassNonRest) {
          const bassMidi = keyToMidi(bn.keys[0]);
          if (bassMidi >= lowestTrebleMidi) {
            // Push bass down an octave
            bn.keys = bn.keys.map(k => {
              const [name, oct] = k.split('/');
              return `${name}/${Math.max(2, parseInt(oct, 10) - 1)}`;
            });
          }
        }
      }
    }
  }

  const difficultyLabels: Record<Difficulty, Exercise['difficulty']> = {
    1: 'beginner',
    2: 'elementary',
    3: 'intermediate',
    4: 'intermediate-advanced',
    5: 'advanced',
    6: 'expert',
  };

  const id = `random_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  return {
    id,
    level: config.difficulty,
    name: `Zufallsuebung (${key.endsWith('m') ? `${key.slice(0, -1)}-Moll` : `${key}-Dur`}, ${timeSignature})`,
    description: `Zufaellig generierte Uebung in ${key.endsWith('m') ? `${key.slice(0, -1)}-Moll` : `${key}-Dur`}, ${timeSignature} Takt`,
    difficulty: difficultyLabels[config.difficulty],
    timeSignature,
    keySignature: key.endsWith('m') ? ({
      'Am': 'C', 'Em': 'G', 'Bm': 'D', 'F#m': 'A', 'C#m': 'E', 'G#m': 'B',
      'Dm': 'Bb', 'Gm': 'Eb', 'Cm': 'Ab', 'Fm': 'Db', 'Bbm': 'Gb', 'Ebm': 'Cb',
    } as Record<string, string>)[key] || 'C' : key,
    originalKey: key.endsWith('m') ? key : undefined,
    clef: 'treble',
    grandStaff: true,
    tempo: progression.tempo,
    bars,
  };
}
