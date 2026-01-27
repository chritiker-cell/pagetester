/**
 * TypeScript types for audio playback functionality
 * Used with Tone.js for note scheduling and playback
 */

import type { Note } from './music';

/**
 * Current playback state
 */
export type PlaybackStatus = 'stopped' | 'playing' | 'paused';

/**
 * A note scheduled for playback with timing information
 */
export interface ScheduledNote {
  /** Unique identifier for this scheduled note */
  id: string;

  /** The original note data */
  note: Note;

  /** Bar number this note belongs to (1-indexed) */
  barNumber: number;

  /** Index within the bar */
  noteIndex: number;

  /** Start time in seconds from the beginning */
  startTime: number;

  /** Duration in seconds */
  durationSeconds: number;

  /** MIDI pitch for each key (for audio playback) */
  midiPitches: number[];

  /** Note names for Tone.js (e.g., "C4", "E4") */
  toneNotes: string[];

  /** Voice: 'treble' for single staff/upper, 'bass' for lower staff */
  voice: 'treble' | 'bass';
}

/**
 * Playback configuration for an exercise
 */
export interface PlaybackConfig {
  /** Tempo in BPM */
  tempo: number;

  /** Time signature numerator (beats per measure) */
  beatsPerMeasure: number;

  /** Time signature denominator (beat unit: 4 = quarter, 8 = eighth) */
  beatUnit: number;

  /** Whether loop mode is enabled */
  loop: boolean;

  /** Whether metronome is enabled */
  metronomeEnabled: boolean;

  /** Count-in measures before playback starts */
  countIn: number;
}

/**
 * Complete playback state managed by the store
 */
export interface PlaybackState {
  /** Current playback status */
  status: PlaybackStatus;

  /** Current playback position in seconds */
  currentTime: number;

  /** Total duration of the current exercise in seconds */
  totalDuration: number;

  /** Index of the currently playing/highlighted note (-1 if none) */
  currentNoteIndex: number;

  /** All scheduled notes for the current exercise */
  scheduledNotes: ScheduledNote[];

  /** Playback configuration */
  config: PlaybackConfig;

  /** Current beat within the measure (0-indexed) */
  currentBeat: number;

  /** Current measure number (1-indexed) */
  currentMeasure: number;

  /** Whether audio engine is initialized and ready */
  isReady: boolean;

  /** Error message if audio initialization failed */
  error: string | null;
}

/**
 * Default playback configuration
 */
export const DEFAULT_PLAYBACK_CONFIG: PlaybackConfig = {
  tempo: 80,
  beatsPerMeasure: 4,
  beatUnit: 4,
  loop: false,
  metronomeEnabled: false,
  countIn: 0,
};

/**
 * Metronome beat type
 */
export type MetronomeBeatType = 'downbeat' | 'upbeat';

/**
 * Metronome state for visual feedback
 */
export interface MetronomeState {
  /** Whether metronome is currently active */
  isActive: boolean;

  /** Current beat number (1-indexed within measure) */
  currentBeat: number;

  /** Type of the current beat */
  beatType: MetronomeBeatType;

  /** Beats per measure */
  beatsPerMeasure: number;
}
