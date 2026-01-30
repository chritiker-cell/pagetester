/**
 * TypeScript types for note comparison and practice evaluation
 * Used to compare played notes against expected notes
 */

import type { PlayedNote } from './midi';
import type { ScheduledNote } from './playback';

/**
 * Result of comparing a single played note to expected note
 */
export type NoteComparisonResult = 'correct' | 'incorrect' | 'missed' | 'extra';

/**
 * Timing accuracy classification
 */
export type TimingAccuracy = 'perfect' | 'good' | 'acceptable' | 'early' | 'late' | 'missed';

/**
 * Detailed comparison result for a single note
 */
export interface NoteComparison {
  /** Unique identifier */
  id: string;

  /** The expected note (from exercise) */
  expectedNote: ScheduledNote | null;

  /** The note played by user (from MIDI) */
  playedNote: PlayedNote | null;

  /** Overall result of comparison */
  result: NoteComparisonResult;

  /** Pitch comparison result */
  pitchCorrect: boolean;

  /** MIDI note difference (0 = correct, positive = too high, negative = too low) */
  pitchDifference: number;

  /** Timing accuracy classification */
  timingAccuracy: TimingAccuracy;

  /** Timing offset in milliseconds (negative = early, positive = late) */
  timingOffsetMs: number;

  /** Duration comparison (ratio of played to expected) */
  durationRatio: number | null;

  /** Index of expected note in exercise */
  expectedNoteIndex: number;
}

/**
 * Summary of comparison results for an entire exercise
 */
export interface ComparisonSummary {
  /** Total number of expected notes */
  totalExpectedNotes: number;

  /** Number of correctly played notes */
  correctNotes: number;

  /** Number of incorrectly played notes (wrong pitch) */
  incorrectNotes: number;

  /** Number of missed notes (not played) */
  missedNotes: number;

  /** Number of extra notes (not in exercise) */
  extraNotes: number;

  /** Pitch accuracy percentage (0-100) */
  pitchAccuracy: number;

  /** Timing accuracy percentage (0-100) */
  timingAccuracy: number;

  /** Rhythm accuracy percentage (0-100) */
  rhythmAccuracy: number;

  /** Overall accuracy percentage (0-100) */
  overallAccuracy: number;

  /** Average timing offset in ms */
  averageTimingOffset: number;

  /** All individual note comparisons */
  comparisons: NoteComparison[];
}

/**
 * Timing tolerance configuration
 */
export interface TimingTolerance {
  /** Perfect timing window in ms */
  perfect: number;

  /** Good timing window in ms */
  good: number;

  /** Acceptable timing window in ms */
  acceptable: number;
}

/**
 * Default timing tolerance values
 */
export const DEFAULT_TIMING_TOLERANCE: TimingTolerance = {
  perfect: 50,    // ±50ms = perfect
  good: 100,      // ±100ms = good
  acceptable: 200, // ±200ms = acceptable
};

/**
 * Configuration for comparison algorithm
 */
export interface ComparisonConfig {
  /** Timing tolerance settings */
  timingTolerance: TimingTolerance;

  /** Allow enharmonic equivalents (e.g., C# = Db) */
  allowEnharmonics: boolean;

  /** Octave tolerance (0 = exact, 1 = ±1 octave allowed) */
  octaveTolerance: number;

  /** Weighting for final score calculation */
  scoreWeights: {
    pitch: number;
    timing: number;
    rhythm: number;
  };
}

/**
 * Default comparison configuration
 */
export const DEFAULT_COMPARISON_CONFIG: ComparisonConfig = {
  timingTolerance: DEFAULT_TIMING_TOLERANCE,
  allowEnharmonics: true,
  octaveTolerance: 0,
  scoreWeights: {
    pitch: 0.5,    // 50%
    timing: 0.3,   // 30%
    rhythm: 0.2,   // 20%
  },
};

/**
 * Match state for a single expected note during practice
 */
export interface NoteMatchState {
  /** Expected note info */
  expectedNote: ScheduledNote;

  /** Index in the scheduled notes array */
  index: number;

  /** Whether this note has been matched to a played note */
  matched: boolean;

  /** The matching played note if found */
  matchedPlayedNote: PlayedNote | null;

  /** The comparison result */
  comparison: NoteComparison | null;
}

/**
 * Real-time comparison state during practice
 */
export interface PracticeComparisonState {
  /** Match states for all expected notes */
  noteStates: NoteMatchState[];

  /** Played notes that haven't been matched to expected notes */
  unmatchedPlayedNotes: PlayedNote[];

  /** Current note index the user should be playing */
  currentExpectedIndex: number;

  /** Running count of correct notes */
  correctCount: number;

  /** Running count of incorrect notes */
  incorrectCount: number;
}
