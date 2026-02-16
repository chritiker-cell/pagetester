/**
 * Scale formulas, fingering database, and key progressions
 */
import type { ScaleType, ScaleKeyData, ScaleMode, PolyrhythmVariant, ThirdsVariant } from '../types/scales';

// Semitone intervals from root
export const SCALE_FORMULAS: Record<ScaleType, number[]> = {
  major:         [0, 2, 4, 5, 7, 9, 11, 12],
  naturalMinor:  [0, 2, 3, 5, 7, 8, 10, 12],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11, 12],
  melodicMinor:  [0, 2, 3, 5, 7, 9, 11, 12], // ascending; descending = natural minor
};

// Keys available per level
export const KEY_PROGRESSION: Record<number, { key: string; scaleType: ScaleType }[]> = {
  3: [
    { key: 'C', scaleType: 'major' },
    { key: 'G', scaleType: 'major' },
    { key: 'F', scaleType: 'major' },
    { key: 'A', scaleType: 'naturalMinor' },
    { key: 'E', scaleType: 'naturalMinor' },
  ],
  4: [
    { key: 'D', scaleType: 'major' },
    { key: 'Bb', scaleType: 'major' },
    { key: 'A', scaleType: 'major' },
    { key: 'D', scaleType: 'naturalMinor' },
    { key: 'A', scaleType: 'harmonicMinor' },
  ],
  5: [
    { key: 'Eb', scaleType: 'major' },
    { key: 'E', scaleType: 'major' },
    { key: 'Ab', scaleType: 'major' },
    { key: 'E', scaleType: 'melodicMinor' },
    { key: 'D', scaleType: 'melodicMinor' },
  ],
  6: [
    { key: 'B', scaleType: 'major' },
    { key: 'Db', scaleType: 'major' },
    { key: 'Gb', scaleType: 'major' },
    { key: 'G', scaleType: 'melodicMinor' },
    { key: 'C', scaleType: 'melodicMinor' },
  ],
};

// All keys across all levels (nothing locked)
export function getAvailableScales(_level: number): { key: string; scaleType: ScaleType }[] {
  const result: { key: string; scaleType: ScaleType }[] = [];
  for (const l of [3, 4, 5, 6]) {
    if (KEY_PROGRESSION[l]) {
      result.push(...KEY_PROGRESSION[l]);
    }
  }
  return result;
}

// All modes available at every level (user decides)
export const AVAILABLE_MODES: Record<number, ScaleMode[]> = {
  3: ['parallel', 'contraryMotion', 'rhythmicVariance', 'thirds'],
  4: ['parallel', 'contraryMotion', 'rhythmicVariance', 'thirds'],
  5: ['parallel', 'contraryMotion', 'rhythmicVariance', 'thirds'],
  6: ['parallel', 'contraryMotion', 'rhythmicVariance', 'thirds'],
};

// Max octaves per level (all levels allow 2)
export const MAX_OCTAVES: Record<number, 1 | 2> = {
  3: 2, 4: 2, 5: 2, 6: 2,
};

// Tempo ranges per level
export const TEMPO_RANGE: Record<number, { min: number; max: number; default: number }> = {
  3: { min: 60, max: 84, default: 60 },
  4: { min: 66, max: 100, default: 72 },
  5: { min: 72, max: 120, default: 80 },
  6: { min: 80, max: 132, default: 88 },
};

// Standard fingering for RH: 1=thumb ... 5=pinky
const STD_RH: ScaleKeyData = {
  rh: { ascending: [1, 2, 3, 1, 2, 3, 4, 5], descending: [5, 4, 3, 2, 1, 3, 2, 1] },
  lh: { ascending: [5, 4, 3, 2, 1, 3, 2, 1], descending: [1, 2, 3, 1, 2, 3, 4, 5] },
};

// F major RH special case
const F_MAJOR: ScaleKeyData = {
  rh: { ascending: [1, 2, 3, 4, 1, 2, 3, 4], descending: [4, 3, 2, 1, 4, 3, 2, 1] },
  lh: { ascending: [5, 4, 3, 2, 1, 3, 2, 1], descending: [1, 2, 3, 1, 2, 3, 4, 5] },
};

// Bb major
const BB_MAJOR: ScaleKeyData = {
  rh: { ascending: [2, 1, 2, 3, 4, 1, 2, 3], descending: [3, 2, 1, 4, 3, 2, 1, 2] },
  lh: { ascending: [3, 2, 1, 4, 3, 2, 1, 3], descending: [3, 1, 2, 3, 4, 1, 2, 3] },
};

// Eb major
const EB_MAJOR: ScaleKeyData = {
  rh: { ascending: [3, 1, 2, 3, 4, 1, 2, 3], descending: [3, 2, 1, 4, 3, 2, 1, 3] },
  lh: { ascending: [3, 2, 1, 4, 3, 2, 1, 3], descending: [3, 1, 2, 3, 4, 1, 2, 3] },
};

// Ab major
const AB_MAJOR: ScaleKeyData = {
  rh: { ascending: [3, 4, 1, 2, 3, 1, 2, 3], descending: [3, 2, 1, 3, 2, 1, 4, 3] },
  lh: { ascending: [3, 2, 1, 4, 3, 2, 1, 3], descending: [3, 1, 2, 3, 4, 1, 2, 3] },
};

// Db major
const DB_MAJOR: ScaleKeyData = {
  rh: { ascending: [2, 3, 1, 2, 3, 4, 1, 2], descending: [2, 1, 4, 3, 2, 1, 3, 2] },
  lh: { ascending: [3, 2, 1, 4, 3, 2, 1, 3], descending: [3, 1, 2, 3, 4, 1, 2, 3] },
};

// Gb major — Daumen nur auf Cb(=B) und F (weisse Tasten)
const GB_MAJOR: ScaleKeyData = {
  rh: { ascending: [2, 3, 4, 1, 2, 3, 1, 2], descending: [2, 1, 3, 2, 1, 4, 3, 2] },
  lh: { ascending: [4, 3, 2, 1, 3, 2, 1, 4], descending: [4, 1, 2, 3, 1, 2, 3, 4] },
};

export const FINGERING_DB: Record<string, ScaleKeyData> = {
  // Major keys
  'C_major': STD_RH,
  'G_major': STD_RH,
  'D_major': STD_RH,
  'A_major': STD_RH,
  'E_major': STD_RH,
  'B_major': STD_RH,
  'F_major': F_MAJOR,
  'Bb_major': BB_MAJOR,
  'Eb_major': EB_MAJOR,
  'Ab_major': AB_MAJOR,
  'Db_major': DB_MAJOR,
  'Gb_major': GB_MAJOR,
  // Minor keys (use same patterns as relative major in most cases)
  'A_naturalMinor': STD_RH,
  'E_naturalMinor': STD_RH,
  'D_naturalMinor': STD_RH,
  'A_harmonicMinor': STD_RH,
  'E_melodicMinor': STD_RH,
  'D_melodicMinor': STD_RH,
  'G_melodicMinor': STD_RH,
  'C_melodicMinor': STD_RH,
};

export function getFingering(key: string, scaleType: ScaleType): ScaleKeyData {
  const lookup = `${key}_${scaleType}`;
  return FINGERING_DB[lookup] || STD_RH;
}

export const SCALE_TYPE_LABELS: Record<ScaleType, string> = {
  major: 'Dur',
  naturalMinor: 'Natuerliches Moll',
  harmonicMinor: 'Harmonisches Moll',
  melodicMinor: 'Melodisches Moll',
};

export const MODE_LABELS: Record<ScaleMode, string> = {
  parallel: 'Parallelbewegung',
  contraryMotion: 'Gegenbewegung',
  rhythmicVariance: 'Polyrhythmik (2:1)',
  thirds: 'Terzen',
};

export const POLYRHYTHM_VARIANT_LABELS: Record<PolyrhythmVariant, string> = {
  '2:1-rh': 'RH schnell',
  '2:1-lh': 'LH schnell',
  '2:1-auto': 'Wechsel',
};

export const THIRDS_VARIANT_LABELS: Record<ThirdsVariant, string> = {
  harmonic: 'Harmonisch (geblockt)',
  melodic: 'Melodisch (gebrochen)',
};

// ============================================================================
// KEY GROUPS (by difficulty, separate for major and minor)
// ============================================================================

export type KeyGroup = 1 | 2 | 3 | 'all';

// Major keys (for scaleType === 'major')
export const MAJOR_KEY_GROUPS: Record<Exclude<KeyGroup, 'all'>, string[]> = {
  1: ['C', 'G', 'F'],                     // 0-1 accidentals (beginner)
  2: ['D', 'Bb', 'A', 'Eb'],              // 2-3 accidentals (intermediate)
  3: ['E', 'Ab', 'B', 'Db', 'Gb'],        // 4-6 accidentals (advanced)
};

// Minor keys (for all minor scale types)
export const MINOR_KEY_GROUPS: Record<Exclude<KeyGroup, 'all'>, string[]> = {
  1: ['A', 'E', 'D'],                     // 0-1 accidentals (beginner)
  2: ['B', 'G', 'F#', 'C'],               // 2-3 accidentals (intermediate)
  3: ['C#', 'G#', 'Eb'],                  // 4-6 accidentals (advanced)
};

export const KEY_GROUP_LABELS: Record<KeyGroup, string> = {
  1: 'Stufe 1',
  2: 'Stufe 2',
  3: 'Stufe 3',
  'all': 'Alle',
};

/**
 * Returns the list of keys for a given scale type and key group.
 * For major scales, uses MAJOR_KEY_GROUPS.
 * For minor scales (naturalMinor, harmonicMinor, melodicMinor), uses MINOR_KEY_GROUPS.
 */
export function getKeysForGroup(scaleType: ScaleType, group: KeyGroup): string[] {
  const groups = scaleType === 'major' ? MAJOR_KEY_GROUPS : MINOR_KEY_GROUPS;
  if (group === 'all') {
    return [...groups[1], ...groups[2], ...groups[3]];
  }
  return groups[group];
}

/**
 * Returns the next key in the group (wrapping around to the beginning).
 * Used for the "Next Exercise" button to cycle through keys sequentially.
 */
export function getNextKeyInGroup(
  scaleType: ScaleType,
  group: KeyGroup,
  currentIndex: number
): { key: string; nextIndex: number } {
  const keys = getKeysForGroup(scaleType, group);
  const nextIndex = (currentIndex + 1) % keys.length;
  return { key: keys[nextIndex], nextIndex };
}
