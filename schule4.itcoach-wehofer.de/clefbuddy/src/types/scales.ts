/**
 * TypeScript types for the Scales module
 */

export type ScaleType = 'major' | 'naturalMinor' | 'harmonicMinor' | 'melodicMinor';

export type ScaleMode = 'parallel' | 'contraryMotion' | 'rhythmicVariance' | 'thirds';

/** Polyrhythm variants: which hand plays the fast notes */
export type PolyrhythmVariant = '2:1-rh' | '2:1-lh' | '2:1-auto';

/** Thirds variants: harmonic (blocked) or melodic (broken) */
export type ThirdsVariant = 'harmonic' | 'melodic';

export interface ScaleConfig {
  key: string;
  scaleType: ScaleType;
  mode: ScaleMode;
  octaves: 1 | 2;
  tempo: number;
  showFingering: boolean;
  level: number;
  polyrhythmVariant?: PolyrhythmVariant;
  thirdsVariant?: ThirdsVariant;
}

export interface FingeringPattern {
  ascending: number[];
  descending: number[];
}

export interface ScaleKeyData {
  rh: FingeringPattern;
  lh: FingeringPattern;
}

export interface ScaleMastery {
  bestBpm: number;
  stars: number;
  modes: ScaleMode[];
}
