/**
 * Chord data: key groups, mode configs, progressions
 */
import type { ChordMode, KeyGroup } from '../types/chords';

// --- Key Groups ---
export interface KeyGroupDef {
  label: string;
  keys: string[];       // e.g. 'C', 'Am' — minor keys end with 'm'
}

export const KEY_GROUPS: Record<KeyGroup, KeyGroupDef> = {
  1: { label: 'C, G, F, Am, Em', keys: ['C', 'G', 'F', 'Am', 'Em'] },
  2: { label: 'D, Bb, Dm, Gm', keys: ['D', 'Bb', 'Dm', 'Gm'] },
  3: { label: 'A, Eb, Bm, Cm', keys: ['A', 'Eb', 'Bm', 'Cm'] },
  4: { label: 'E, Ab, C#m, F#m, Fm', keys: ['E', 'Ab', 'C#m', 'F#m', 'Fm'] },
};

// --- Mode Configs ---
export type DifficultyTag = 'Beginner' | 'Beginner→Intermediate' | 'Intermediate' | 'Intermediate→Advanced' | 'Advanced';

export interface ModeConfig {
  name: string;
  description: string;
  difficulty: DifficultyTag;
  timeSignatures: ('4/4' | '3/4' | '6/8')[];
  chordQualities: string[];
  inversions: number[];           // 0=root, 1=first, 2=second
  trebleStyle: string;
  bassStyle: string;
  voiceCount: 3 | 4;
}

export const MODE_CONFIGS: Record<ChordMode, ModeConfig> = {
  'block-chords': {
    name: 'Block Chords',
    description: 'Blockakkorde kennenlernen — Dreiklaenge in Grundstellung',
    difficulty: 'Beginner',
    timeSignatures: ['4/4', '3/4'],
    chordQualities: ['major', 'minor'],
    inversions: [0],
    trebleStyle: 'blocked',
    bassStyle: 'root',
    voiceCount: 3,
  },
  'inversions': {
    name: 'Inversions',
    description: 'Umkehrungen fliessend — Voice-Leading, gemeinsame Toene liegen lassen',
    difficulty: 'Beginner→Intermediate',
    timeSignatures: ['4/4', '3/4'],
    chordQualities: ['major', 'minor'],
    inversions: [0, 1, 2],
    trebleStyle: 'blocked-inversions',
    bassStyle: 'root-fifth',
    voiceCount: 3,
  },
  'broken-chords': {
    name: 'Broken Chords',
    description: 'Gebrochene Akkorde — aufwaerts, abwaerts, 1-3-5-3',
    difficulty: 'Intermediate',
    timeSignatures: ['4/4', '3/4'],
    chordQualities: ['major', 'minor'],
    inversions: [0, 1],
    trebleStyle: 'broken',
    bassStyle: 'alberti-light',
    voiceCount: 3,
  },
  'waltz': {
    name: 'Waltz Accompaniment',
    description: 'Walzer-Begleitung — Oom-Pah-Pah',
    difficulty: 'Intermediate',
    timeSignatures: ['3/4', '6/8'],
    chordQualities: ['major', 'minor', 'dom7'],
    inversions: [0, 1, 2],
    trebleStyle: 'blocked-waltz',
    bassStyle: 'waltz',
    voiceCount: 3,
  },
  'arpeggio': {
    name: 'Fließende Arpeggios',
    description: 'Arpeggios als Begleitung — musikalischer Kontext',
    difficulty: 'Intermediate→Advanced',
    timeSignatures: ['4/4', '6/8'],
    chordQualities: ['major', 'minor', 'dom7'],
    inversions: [0, 1, 2],
    trebleStyle: 'arpeggio',
    bassStyle: 'walking',
    voiceCount: 3,
  },
  'alberti': {
    name: 'Alberti & Classical',
    description: 'Klassischer Begleitstil — 1-5-3-5 Pattern',
    difficulty: 'Intermediate→Advanced',
    timeSignatures: ['4/4'],
    chordQualities: ['major', 'minor', 'dom7', 'dim'],
    inversions: [0, 1, 2],
    trebleStyle: 'alberti',
    bassStyle: 'root',
    voiceCount: 3,
  },
  'seventh-chords': {
    name: 'Seventh Chords',
    description: 'Septakkorde — 4-stimmig, enge + weite Lage',
    difficulty: 'Advanced',
    timeSignatures: ['4/4', '3/4'],
    chordQualities: ['maj7', 'dom7', 'min7', 'hdim7'],
    inversions: [0, 1, 2, 3],
    trebleStyle: 'blocked-seventh',
    bassStyle: 'walking',
    voiceCount: 4,
  },
  'mixed-patterns': {
    name: 'Mixed Patterns',
    description: 'Gemischte Begleitfiguren — Wechsel blocked/broken/arpeggio',
    difficulty: 'Advanced',
    timeSignatures: ['4/4', '3/4', '6/8'],
    chordQualities: ['major', 'minor', 'dom7', 'maj7', 'min7', 'hdim7', 'dim'],
    inversions: [0, 1, 2],
    trebleStyle: 'mixed',
    bassStyle: 'mixed',
    voiceCount: 4,
  },
};

export const ALL_MODES: ChordMode[] = [
  'block-chords', 'inversions', 'broken-chords', 'waltz',
  'arpeggio', 'alberti', 'seventh-chords', 'mixed-patterns',
];

// --- Progressions ---
const MAJOR_SHORT = [
  [1, 4, 5, 1],
  [1, 5, 4, 1],
  [1, 4, 1, 5],
];
const MAJOR_MEDIUM = [
  [1, 1, 4, 4, 5, 5, 4, 1],
  [1, 4, 1, 5, 4, 1, 5, 1],
  [1, 5, 4, 1, 4, 5, 5, 1],
];
const MAJOR_LONG = [
  [1, 1, 4, 4, 5, 5, 4, 4, 1, 5, 4, 1],
  [1, 4, 5, 1, 4, 5, 1, 4, 1, 5, 5, 1],
  [1, 1, 4, 1, 5, 4, 1, 5, 4, 1, 5, 1, 4, 5, 5, 1],
];

const MINOR_SHORT = [
  [1, 4, 5, 1],
  [1, 6, 4, 5],
  [1, 4, 1, 5],
];
const MINOR_MEDIUM = [
  [1, 1, 4, 4, 5, 5, 4, 1],
  [1, 6, 4, 1, 4, 5, 5, 1],
  [1, 4, 6, 4, 5, 1, 5, 1],
];
const MINOR_LONG = [
  [1, 1, 4, 4, 5, 5, 6, 6, 4, 5, 4, 1],
  [1, 6, 4, 5, 1, 4, 6, 5, 1, 4, 5, 1, 6, 4, 5, 1],
];

const JAZZ_MEDIUM = [
  [2, 5, 1, 1, 2, 5, 1, 1],
  [1, 6, 2, 5, 1, 4, 2, 5],
  [2, 5, 1, 6, 2, 5, 1, 1],
];

export function getProgression(isMinor: boolean, barCount: number, useJazz: boolean): number[] {
  let pool: number[][];

  if (useJazz && !isMinor) {
    pool = barCount <= 8 ? JAZZ_MEDIUM : MAJOR_LONG;
  } else if (isMinor) {
    pool = barCount <= 4 ? MINOR_SHORT : barCount <= 8 ? MINOR_MEDIUM : MINOR_LONG;
  } else {
    pool = barCount <= 4 ? MAJOR_SHORT : barCount <= 8 ? MAJOR_MEDIUM : MAJOR_LONG;
  }

  const base = pool[Math.floor(Math.random() * pool.length)];

  if (base.length >= barCount) {
    return base.slice(0, barCount);
  }
  const result: number[] = [];
  while (result.length < barCount) {
    result.push(...base);
  }
  return result.slice(0, barCount);
}
