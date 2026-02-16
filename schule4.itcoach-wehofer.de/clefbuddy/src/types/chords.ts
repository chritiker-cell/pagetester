/**
 * TypeScript types for the Chords module (mode-based redesign)
 */

export type ChordMode =
  | 'block-chords'
  | 'inversions'
  | 'broken-chords'
  | 'waltz'
  | 'arpeggio'
  | 'alberti'
  | 'seventh-chords'
  | 'mixed-patterns';

export type KeyGroup = 1 | 2 | 3 | 4;

export interface ChordConfig {
  mode: ChordMode;
  keyGroup: KeyGroup;
  timeSignature: '4/4' | '3/4' | '6/8' | 'random';
  barCount: number;
  showFingering: boolean;
  showChordNames: boolean;
}

export interface ChordMastery {
  bestBpm: number;
  stars: number;
  mode: ChordMode;
}
