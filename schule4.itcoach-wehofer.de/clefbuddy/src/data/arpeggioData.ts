/**
 * Arpeggio data: formulas, fingerings, level configurations
 */
import type { ArpeggioType, ArpeggioPattern, ArpeggioInversion, ArpeggioKeyFingering } from '../types/arpeggio';

// Semitone intervals from root for each arpeggio type
export const ARPEGGIO_FORMULAS: Record<ArpeggioType, number[]> = {
  major: [0, 4, 7],           // C-E-G
  minor: [0, 3, 7],           // C-Eb-G
  dominant7: [0, 4, 7, 10],   // C-E-G-Bb
  diminished: [0, 3, 6],      // C-Eb-Gb
  augmented: [0, 4, 8],       // C-E-G#
  major7: [0, 4, 7, 11],      // C-E-G-B
  minor7: [0, 3, 7, 10],      // C-Eb-G-Bb
};

// Number of notes in each arpeggio type (before octave extension)
export function getArpeggioNoteCount(type: ArpeggioType): number {
  return ARPEGGIO_FORMULAS[type].length;
}

// Check if type is a 7th chord
export function isSeventh(type: ArpeggioType): boolean {
  return type === 'dominant7' || type === 'major7' || type === 'minor7';
}

// --- Level Configuration ---
export interface ArpeggioLevelConfig {
  chordTypes: ArpeggioType[];
  keys: string[];
  inversions: ArpeggioInversion[];
  tempoRange: { min: number; max: number; default: number };
  maxOctaves: 1 | 2;
}

export const ARPEGGIO_LEVEL_CONFIGS: Record<number, ArpeggioLevelConfig> = {
  // Stufe 3: Nur Grundstellung, 1 Oktave - Fokus auf Grundlagen
  3: {
    chordTypes: ['major'],
    keys: ['C', 'G', 'F'],  // Nur weiße Tasten (C, G) + leichtes F
    inversions: [0],       // NUR Grundstellung
    tempoRange: { min: 50, max: 72, default: 60 },
    maxOctaves: 1,         // NUR 1 Oktave
  },
  // Stufe 4: + 1. Umkehrung, noch 1 Oktave - Umkehrungen lernen
  4: {
    chordTypes: ['major', 'minor'],
    keys: ['C', 'G', 'F', 'D', 'Am', 'Em', 'Dm'],
    inversions: [0, 1],    // Grundstellung + 1. Umkehrung
    tempoRange: { min: 60, max: 88, default: 72 },
    maxOctaves: 1,         // NOCH 1 Oktave
  },
  // Stufe 5: + 2. Umkehrung, 2 Oktaven - erweiterte Technik
  5: {
    chordTypes: ['major', 'minor', 'dominant7'],
    keys: ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'Am', 'Em', 'Dm', 'Gm'],
    inversions: [0, 1, 2], // Alle Triad-Umkehrungen
    tempoRange: { min: 72, max: 108, default: 84 },
    maxOctaves: 2,         // Jetzt 2 Oktaven
  },
  // Stufe 6: Alle Features - fortgeschritten
  6: {
    chordTypes: ['major', 'minor', 'dominant7', 'diminished', 'augmented', 'major7', 'minor7'],
    keys: ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab', 'B', 'Db',
           'Am', 'Em', 'Dm', 'Gm', 'Bm', 'F#m', 'Cm', 'Fm'],
    inversions: [0, 1, 2, 3], // Inkl. 3. Umkehrung für 7th-Akkorde
    tempoRange: { min: 88, max: 144, default: 100 },
    maxOctaves: 2,
  },
};

// Get all available keys across all levels (no locking)
export function getAvailableArpeggios(_level: number): { key: string; chordType: ArpeggioType }[] {
  const result: { key: string; chordType: ArpeggioType }[] = [];
  for (const l of [3, 4, 5, 6]) {
    const cfg = ARPEGGIO_LEVEL_CONFIGS[l];
    if (cfg) {
      for (const key of cfg.keys) {
        for (const type of cfg.chordTypes) {
          const exists = result.some(r => r.key === key && r.chordType === type);
          if (!exists) {
            result.push({ key, chordType: type });
          }
        }
      }
    }
  }
  return result;
}

// --- Fingerings ---
// Pedagogically correct fingerings for each inversion
// Based on traditional piano pedagogy (Hanon, Czerny, etc.)

// ============ TRIAD FINGERINGS (3 notes per octave) ============

// Root position triads (C-E-G): standard fingering
const TRIAD_ROOT_POS: ArpeggioKeyFingering = {
  rh: { ascending: [1, 2, 3, 1, 2, 3, 1, 2], descending: [3, 2, 1, 3, 2, 1, 3, 2] },
  lh: { ascending: [5, 4, 2, 1, 4, 2, 1, 4], descending: [1, 2, 4, 1, 2, 4, 5, 4] },
};

// 1st inversion triads (E-G-C): thumb crosses under after 2nd finger
const TRIAD_INV1: ArpeggioKeyFingering = {
  rh: { ascending: [1, 2, 4, 1, 2, 4, 1, 2], descending: [4, 2, 1, 4, 2, 1, 4, 2] },
  lh: { ascending: [5, 3, 2, 1, 3, 2, 1, 3], descending: [1, 2, 3, 1, 2, 3, 5, 3] },
};

// 2nd inversion triads (G-C-E): starts with thumb, 4th finger on top
const TRIAD_INV2: ArpeggioKeyFingering = {
  rh: { ascending: [1, 2, 4, 1, 2, 4, 1, 2], descending: [4, 2, 1, 4, 2, 1, 4, 2] },
  lh: { ascending: [5, 3, 1, 5, 3, 1, 5, 3], descending: [1, 3, 5, 1, 3, 5, 1, 3] },
};

// ============ SEVENTH CHORD FINGERINGS (4 notes per octave) ============

// Root position 7th (C-E-G-B): 1-2-3-4 pattern
const SEVENTH_ROOT_POS: ArpeggioKeyFingering = {
  rh: { ascending: [1, 2, 3, 4, 1, 2, 3, 4], descending: [4, 3, 2, 1, 4, 3, 2, 1] },
  lh: { ascending: [5, 4, 3, 2, 1, 4, 3, 2], descending: [2, 3, 4, 1, 2, 3, 4, 5] },
};

// 1st inversion 7th (E-G-B-C): starts on 3rd, thumb crosses after 3 notes
const SEVENTH_INV1: ArpeggioKeyFingering = {
  rh: { ascending: [1, 2, 3, 4, 1, 2, 3, 4], descending: [4, 3, 2, 1, 4, 3, 2, 1] },
  lh: { ascending: [5, 4, 3, 1, 5, 4, 3, 1], descending: [1, 3, 4, 5, 1, 3, 4, 5] },
};

// 2nd inversion 7th (G-B-C-E): 5th as bass note
const SEVENTH_INV2: ArpeggioKeyFingering = {
  rh: { ascending: [1, 2, 4, 5, 1, 2, 4, 5], descending: [5, 4, 2, 1, 5, 4, 2, 1] },
  lh: { ascending: [5, 4, 2, 1, 5, 4, 2, 1], descending: [1, 2, 4, 5, 1, 2, 4, 5] },
};

// 3rd inversion 7th (B-C-E-G): 7th as bass note
const SEVENTH_INV3: ArpeggioKeyFingering = {
  rh: { ascending: [1, 2, 3, 5, 1, 2, 3, 5], descending: [5, 3, 2, 1, 5, 3, 2, 1] },
  lh: { ascending: [4, 3, 2, 1, 4, 3, 2, 1], descending: [1, 2, 3, 4, 1, 2, 3, 4] },
};

// Fingering database by chord type and inversion
export const ARPEGGIO_FINGERINGS: Record<string, ArpeggioKeyFingering> = {
  // Major triads
  'major_0': TRIAD_ROOT_POS,
  'major_1': TRIAD_INV1,
  'major_2': TRIAD_INV2,
  // Minor triads
  'minor_0': TRIAD_ROOT_POS,
  'minor_1': TRIAD_INV1,
  'minor_2': TRIAD_INV2,
  // Diminished triads (same hand positions as minor)
  'diminished_0': TRIAD_ROOT_POS,
  'diminished_1': TRIAD_INV1,
  'diminished_2': TRIAD_INV2,
  // Augmented triads (same hand positions as major)
  'augmented_0': TRIAD_ROOT_POS,
  'augmented_1': TRIAD_INV1,
  'augmented_2': TRIAD_INV2,
  // Dominant 7th chords
  'dominant7_0': SEVENTH_ROOT_POS,
  'dominant7_1': SEVENTH_INV1,
  'dominant7_2': SEVENTH_INV2,
  'dominant7_3': SEVENTH_INV3,
  // Major 7th chords
  'major7_0': SEVENTH_ROOT_POS,
  'major7_1': SEVENTH_INV1,
  'major7_2': SEVENTH_INV2,
  'major7_3': SEVENTH_INV3,
  // Minor 7th chords
  'minor7_0': SEVENTH_ROOT_POS,
  'minor7_1': SEVENTH_INV1,
  'minor7_2': SEVENTH_INV2,
  'minor7_3': SEVENTH_INV3,
};

export function getArpeggioFingering(
  chordType: ArpeggioType,
  inversion: ArpeggioInversion
): ArpeggioKeyFingering {
  const lookup = `${chordType}_${inversion}`;
  return ARPEGGIO_FINGERINGS[lookup] || TRIAD_ROOT_POS;
}

// --- Labels ---
export const ARPEGGIO_TYPE_LABELS: Record<ArpeggioType, string> = {
  major: 'Dur',
  minor: 'Moll',
  dominant7: 'Dominant-7',
  diminished: 'Vermindert',
  augmented: 'Uebermaeßig',
  major7: 'Major-7',
  minor7: 'Moll-7',
};

export const ARPEGGIO_PATTERN_LABELS: Record<ArpeggioPattern, string> = {
  up: 'Aufwaerts',
  down: 'Abwaerts',
  'up-down': 'Auf-Ab',
  alternating: 'Abwechselnd',
  contrary: 'Gegenbewegung',
};

export const ARPEGGIO_INVERSION_LABELS: Record<ArpeggioInversion, string> = {
  0: 'Grundstellung',
  1: '1. Umkehrung',
  2: '2. Umkehrung',
  3: '3. Umkehrung',
};

// --- Pattern Icons (for UI) ---
export const ARPEGGIO_PATTERN_ICONS: Record<ArpeggioPattern, string> = {
  up: '↑',
  down: '↓',
  'up-down': '↑↓',
  alternating: '↔',
  contrary: '↗↙',  // Gegenläufige Bewegung
};

// --- Key Groups by Difficulty ---
export const KEY_GROUPS: Record<string, string[]> = {
  'Anfaenger': ['C', 'G', 'F', 'D', 'Am', 'Em', 'Dm'],
  'Fortgeschritten 1': ['Bb', 'A', 'Eb', 'Gm', 'Bm'],
  'Fortgeschritten 2': ['E', 'Ab', 'B', 'Db', 'F#m', 'Cm', 'Fm'],
};

export const KEY_GROUP_ORDER = ['Anfaenger', 'Fortgeschritten 1', 'Fortgeschritten 2'];
