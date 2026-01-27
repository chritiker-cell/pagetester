/**
 * Timing Calculations for Music Playback
 *
 * Converts VexFlow note durations to absolute timing values
 * based on tempo and time signature.
 */

/**
 * Duration values relative to a whole note (1 = whole note)
 * VexFlow uses these suffixes:
 * - w = whole (1)
 * - h = half (0.5)
 * - q = quarter (0.25)
 * - 8 = eighth (0.125)
 * - 16 = sixteenth (0.0625)
 * - 32 = thirty-second (0.03125)
 * - d suffix = dotted (1.5x)
 * - r suffix = rest
 */
const DURATION_MAP: Record<string, number> = {
  // Whole notes
  w: 1,
  wd: 1.5,
  // Half notes
  h: 0.5,
  hd: 0.75,
  // Quarter notes
  q: 0.25,
  qd: 0.375,
  // Eighth notes
  '8': 0.125,
  '8d': 0.1875,
  // Sixteenth notes
  '16': 0.0625,
  '16d': 0.09375,
  // Thirty-second notes
  '32': 0.03125,
  '32d': 0.046875,
};

/**
 * Parse a VexFlow duration string into base duration and modifiers
 * @param duration VexFlow duration string (e.g., "qd", "8r", "hdr")
 * @returns Parsed duration info
 */
export function parseDuration(duration: string): {
  baseDuration: string;
  isDotted: boolean;
  isRest: boolean;
} {
  let baseDuration = duration;
  let isDotted = false;
  let isRest = false;

  // Check for rest suffix
  if (baseDuration.endsWith('r')) {
    isRest = true;
    baseDuration = baseDuration.slice(0, -1);
  }

  // Check for dotted suffix
  if (baseDuration.endsWith('d')) {
    isDotted = true;
    baseDuration = baseDuration.slice(0, -1);
  }

  // Re-add dotted suffix for lookup if it was present
  if (isDotted) {
    baseDuration = baseDuration + 'd';
  }

  return { baseDuration, isDotted, isRest };
}

/**
 * Convert VexFlow duration to fraction of a whole note
 * @param duration VexFlow duration string
 * @returns Duration as fraction of whole note
 */
export function durationToFraction(duration: string): number {
  const { baseDuration } = parseDuration(duration);

  // Rests have same duration as notes
  const lookupKey = baseDuration.replace('r', '');

  const fraction = DURATION_MAP[lookupKey];
  if (fraction === undefined) {
    console.warn(`Unknown duration: ${duration}, defaulting to quarter note`);
    return 0.25;
  }

  return fraction;
}

/**
 * Convert VexFlow duration to seconds based on tempo
 * @param duration VexFlow duration string (e.g., "q", "8", "hd")
 * @param tempo BPM (beats per minute, where beat = quarter note)
 * @param beatUnit Time signature denominator (4 = quarter note beat)
 * @returns Duration in seconds
 */
export function durationToSeconds(
  duration: string,
  tempo: number,
  beatUnit: number = 4
): number {
  const fraction = durationToFraction(duration);

  // Calculate seconds per whole note
  // At tempo T BPM with quarter note beat: 1 quarter = 60/T seconds
  // 1 whole note = 4 quarters = 4 * 60/T = 240/T seconds
  const secondsPerWholeNote = (240 / tempo) * (4 / beatUnit);

  return fraction * secondsPerWholeNote;
}

/**
 * Calculate total duration of a bar in seconds
 * @param beatsPerMeasure Time signature numerator
 * @param beatUnit Time signature denominator
 * @param tempo BPM
 * @returns Duration of one bar in seconds
 */
export function barDurationSeconds(
  beatsPerMeasure: number,
  beatUnit: number,
  tempo: number
): number {
  // One beat = 60/tempo seconds (adjusted for beat unit)
  const secondsPerBeat = 60 / tempo;

  // Adjust for beat unit (if beat unit is 8, each beat is half as long as quarter)
  const beatAdjustment = 4 / beatUnit;

  return beatsPerMeasure * secondsPerBeat * beatAdjustment;
}

/**
 * Parse a time signature string
 * @param timeSignature String like "4/4" or "3/4" or "6/8"
 * @returns Object with numerator and denominator
 */
export function parseTimeSignature(timeSignature: string): {
  beatsPerMeasure: number;
  beatUnit: number;
} {
  const [numerator, denominator] = timeSignature.split('/').map(Number);
  return {
    beatsPerMeasure: numerator || 4,
    beatUnit: denominator || 4,
  };
}

/**
 * Calculate which beat a given time falls on within a measure
 * @param currentTime Time in seconds from start
 * @param tempo BPM
 * @param beatsPerMeasure Beats per measure
 * @param beatUnit Beat unit (4 = quarter)
 * @returns Current beat (0-indexed)
 */
export function getCurrentBeat(
  currentTime: number,
  tempo: number,
  beatsPerMeasure: number,
  beatUnit: number = 4
): number {
  const secondsPerBeat = (60 / tempo) * (4 / beatUnit);
  const totalBeats = currentTime / secondsPerBeat;
  return Math.floor(totalBeats % beatsPerMeasure);
}

/**
 * Calculate which measure a given time falls in
 * @param currentTime Time in seconds from start
 * @param tempo BPM
 * @param beatsPerMeasure Beats per measure
 * @param beatUnit Beat unit
 * @returns Current measure (1-indexed)
 */
export function getCurrentMeasure(
  currentTime: number,
  tempo: number,
  beatsPerMeasure: number,
  beatUnit: number = 4
): number {
  const barDuration = barDurationSeconds(beatsPerMeasure, beatUnit, tempo);
  return Math.floor(currentTime / barDuration) + 1;
}

/**
 * Convert seconds to a formatted time string (MM:SS)
 * @param seconds Time in seconds
 * @returns Formatted string
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate the interval between metronome clicks
 * @param tempo BPM
 * @param beatUnit Beat unit (4 = quarter)
 * @returns Interval in seconds
 */
export function getMetronomeInterval(tempo: number, beatUnit: number = 4): number {
  return (60 / tempo) * (4 / beatUnit);
}
