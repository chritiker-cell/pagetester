/**
 * TypeScript types for the Arpeggio module
 */

export type ArpeggioType = 'major' | 'minor' | 'dominant7' | 'diminished' | 'augmented' | 'major7' | 'minor7';

export type ArpeggioPattern = 'up' | 'down' | 'up-down' | 'alternating' | 'contrary';

export type ArpeggioInversion = 0 | 1 | 2 | 3; // 3 only for 7th chords

export type ArpeggioHand = 'rh' | 'lh' | 'both';

export interface ArpeggioConfig {
  chordType: ArpeggioType;
  key: string;
  pattern: ArpeggioPattern;
  inversion: ArpeggioInversion;
  octaves: 1 | 2;
  bars: 2 | 4 | 8;
  tempo: number;
  showFingering: boolean;
  level: number;
  hand: ArpeggioHand;
}

export interface ArpeggioFingeringPattern {
  ascending: number[];
  descending: number[];
}

export interface ArpeggioKeyFingering {
  rh: ArpeggioFingeringPattern;
  lh: ArpeggioFingeringPattern;
}

export interface ArpeggioMastery {
  bestBpm: number;
  stars: number;
  patterns: ArpeggioPattern[];
  inversions: ArpeggioInversion[];
}
