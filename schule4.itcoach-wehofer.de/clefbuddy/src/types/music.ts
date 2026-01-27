/**
 * TypeScript types for music notation data
 * Compatible with VexFlow 5.x notation system
 */

/**
 * Represents a single note in VexFlow format
 * @example { keys: ["c/4"], duration: "q" }
 */
export interface Note {
  /** Array of note keys in VexFlow format (e.g., ["c/4", "e/4"] for a chord) */
  keys: string[];

  /** Duration in VexFlow notation:
   * - "w" = whole note
   * - "h" = half note
   * - "hd" = dotted half note
   * - "q" = quarter note
   * - "qd" = dotted quarter note
   * - "8" = eighth note
   * - "16" = sixteenth note
   */
  duration: string;
}

/**
 * Represents a single bar/measure of music
 */
export interface Bar {
  /** Bar number (1-indexed) */
  number: number;

  /** Array of notes in this bar (for single staff or treble in grand staff) */
  notes: Note[];

  /** Array of notes for bass clef (only used in grand staff mode) */
  bassNotes?: Note[];
}

/**
 * Complete exercise definition with all metadata and notation data
 */
export interface Exercise {
  /** Unique exercise identifier (e.g., "l1_ex1") */
  id: string;

  /** Level number (1-3) */
  level: number;

  /** Display name of the exercise */
  name: string;

  /** Detailed description */
  description: string;

  /** Difficulty category */
  difficulty: 'beginner' | 'easy' | 'intermediate';

  /** Time signature (e.g., "4/4", "3/4", "6/8") */
  timeSignature: string;

  /** Key signature (e.g., "C", "G", "F") */
  keySignature: string;

  /** Clef type for single staff exercises */
  clef: 'treble' | 'bass';

  /** Whether to render as grand staff (piano system with treble + bass) */
  grandStaff?: boolean;

  /** Tempo in BPM (beats per minute) */
  tempo: number;

  /** Array of bars containing the musical notation */
  bars: Bar[];

  /** Optional pedagogical notes about the exercise */
  pedagogicalNotes?: string;
}

/**
 * Level definition with learning parameters
 */
export interface Level {
  id: number;
  name: string;
  description: string;
  clef: 'treble' | 'bass';
  keySignature: string;
  timeSignature: string;
  parameters: {
    noteRange: {
      min: string;
      max: string;
      description: string;
    };
    allowedDurations: string[];
    allowedIntervals: {
      melodic: string[];
      maxJump: string;
      description: string;
    };
    barCount: number;
    allowedNotes: string[];
    rhythmicPatterns: string[];
  };
  pedagogicalFocus: string;
  unlockCriteria: {
    accuracy: number;
    exercisesCompleted: number;
  };
}
