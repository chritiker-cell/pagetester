/**
 * Harmony Common Utilities
 * Shared functions and constants for chord and arpeggio generators
 */

/**
 * Note names by semitone offset from C (using sharps)
 */
export const NOTE_NAMES_SHARP = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

/**
 * Note names by semitone offset from C (using flats)
 */
export const NOTE_NAMES_FLAT = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];

/**
 * Keys that use flat notation (major and minor)
 */
export const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm'];

/**
 * Semitone map for all note names
 */
export const SEMITONE_MAP: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
};

/**
 * Parse a key string into root and mode.
 * Examples: "C" -> {root: "C", isMinor: false}, "Am" -> {root: "A", isMinor: true}
 */
export function parseKey(key: string): { root: string; isMinor: boolean } {
  if (key === 'F#m') return { root: 'F#', isMinor: true };
  if (key.endsWith('m')) return { root: key.slice(0, -1), isMinor: true };
  return { root: key, isMinor: false };
}

/**
 * Get the semitone offset (0-11) for a given root note.
 * Handles both major and minor keys (strips trailing 'm').
 */
export function rootSemitone(key: string): number {
  const baseKey = key.endsWith('m') ? key.slice(0, -1) : key;
  return SEMITONE_MAP[baseKey] ?? 0;
}

/**
 * Convert a semitone offset plus an octave number into a VexFlow key string.
 * @param semitone - Semitone offset (0-11 or any integer, will be normalized)
 * @param octave - Octave number (e.g., 4 for middle octave)
 * @param useFlats - Whether to use flat notation instead of sharps
 * @returns VexFlow key string (e.g., "c/4", "eb/3")
 */
export function semitoneToVexflow(semitone: number, octave: number, useFlats: boolean): string {
  const idx = ((semitone % 12) + 12) % 12;
  const names = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  return `${names[idx]}/${octave}`;
}
