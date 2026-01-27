/**
 * Playback Scheduler
 *
 * Converts exercise data to scheduled notes with timing information.
 * Handles both single staff and grand staff (piano) exercises.
 */

import type { Exercise, Note } from '../types/music';
import type { ScheduledNote, PlaybackConfig } from '../types/playback';
import { durationToSeconds, parseTimeSignature, barDurationSeconds } from './timing';
import {
  initAudioEngine,
  isAudioReady,
  scheduleNotes,
  scheduleMetronome,
  startPlayback,
  pausePlayback,
  stopPlayback,
  clearScheduledEvents,
  setLoop,
  setTempo,
} from './audioEngine';

/**
 * Convert VexFlow note key to Tone.js note format
 * VexFlow: "c/4" -> Tone.js: "C4"
 * VexFlow: "f#/4" -> Tone.js: "F#4"
 */
function vexflowToTone(key: string): string {
  const [note, octave] = key.split('/');
  // Capitalize and handle accidentals
  const noteName = note.charAt(0).toUpperCase() + note.slice(1);
  return `${noteName}${octave}`;
}

/**
 * Convert VexFlow note key to MIDI pitch number
 * C4 = 60 (middle C)
 */
function vexflowToMidi(key: string): number {
  const [note, octaveStr] = key.split('/');
  const octave = parseInt(octaveStr, 10);

  // Note names to semitones from C
  const noteMap: Record<string, number> = {
    c: 0,
    'd': 2,
    e: 4,
    f: 5,
    g: 7,
    a: 9,
    b: 11,
  };

  const baseNote = note.charAt(0).toLowerCase();
  let semitone = noteMap[baseNote] ?? 0;

  // Handle accidentals
  if (note.includes('#')) semitone += 1;
  if (note.includes('b')) semitone -= 1;

  // MIDI: C4 = 60
  return (octave + 1) * 12 + semitone;
}

/**
 * Check if a duration represents a rest
 */
function isRest(duration: string): boolean {
  return duration.endsWith('r');
}

/**
 * Schedule notes from a single voice (treble or bass)
 */
function scheduleVoiceNotes(
  notes: Note[],
  barNumber: number,
  startTime: number,
  tempo: number,
  beatUnit: number,
  voice: 'treble' | 'bass',
  idPrefix: string
): ScheduledNote[] {
  const scheduledNotes: ScheduledNote[] = [];
  let currentTime = startTime;

  notes.forEach((note, noteIndex) => {
    const durationSeconds = durationToSeconds(note.duration, tempo, beatUnit);

    // Create scheduled note (even for rests, for tracking purposes)
    const scheduledNote: ScheduledNote = {
      id: `${idPrefix}-bar${barNumber}-${voice}-note${noteIndex}`,
      note,
      barNumber,
      noteIndex,
      startTime: currentTime,
      durationSeconds,
      midiPitches: isRest(note.duration)
        ? []
        : note.keys.map((key) => vexflowToMidi(key)),
      toneNotes: isRest(note.duration)
        ? []
        : note.keys.map((key) => vexflowToTone(key)),
      voice,
    };

    scheduledNotes.push(scheduledNote);
    currentTime += durationSeconds;
  });

  return scheduledNotes;
}

/**
 * Convert an exercise to a list of scheduled notes
 */
export function exerciseToScheduledNotes(
  exercise: Exercise,
  config: PlaybackConfig
): ScheduledNote[] {
  const { beatsPerMeasure, beatUnit } = parseTimeSignature(exercise.timeSignature);
  const tempo = config.tempo;
  const barDuration = barDurationSeconds(beatsPerMeasure, beatUnit, tempo);

  const allNotes: ScheduledNote[] = [];
  let currentBarStartTime = 0;

  exercise.bars.forEach((bar) => {
    // Schedule treble/main notes
    const trebleNotes = scheduleVoiceNotes(
      bar.notes,
      bar.number,
      currentBarStartTime,
      tempo,
      beatUnit,
      'treble',
      exercise.id
    );
    allNotes.push(...trebleNotes);

    // Schedule bass notes for grand staff
    if (exercise.grandStaff && bar.bassNotes && bar.bassNotes.length > 0) {
      const bassNotes = scheduleVoiceNotes(
        bar.bassNotes,
        bar.number,
        currentBarStartTime,
        tempo,
        beatUnit,
        'bass',
        exercise.id
      );
      allNotes.push(...bassNotes);
    }

    currentBarStartTime += barDuration;
  });

  // Sort by start time for proper playback order
  allNotes.sort((a, b) => a.startTime - b.startTime);

  return allNotes;
}

/**
 * Calculate total duration of an exercise
 */
export function calculateExerciseDuration(
  exercise: Exercise,
  tempo: number
): number {
  const { beatsPerMeasure, beatUnit } = parseTimeSignature(exercise.timeSignature);
  const barDuration = barDurationSeconds(beatsPerMeasure, beatUnit, tempo);
  return exercise.bars.length * barDuration;
}

/**
 * Playback controller for managing exercise playback
 */
export class PlaybackController {
  private exercise: Exercise | null = null;
  private config: PlaybackConfig;
  private scheduledNotes: ScheduledNote[] = [];
  private onNoteChange: ((noteId: string, noteIndex: number) => void) | null = null;
  private onBeatChange: ((beat: number, isDownbeat: boolean) => void) | null = null;

  constructor(config: PlaybackConfig) {
    this.config = config;
  }

  /**
   * Initialize audio engine (must be called after user interaction)
   */
  async initialize(): Promise<boolean> {
    try {
      await initAudioEngine();
      return true;
    } catch (error) {
      console.error('Failed to initialize playback controller:', error);
      return false;
    }
  }

  /**
   * Check if ready to play
   */
  isReady(): boolean {
    return isAudioReady();
  }

  /**
   * Load an exercise for playback
   */
  loadExercise(
    exercise: Exercise,
    onNoteChange?: (noteId: string, noteIndex: number) => void,
    onBeatChange?: (beat: number, isDownbeat: boolean) => void,
    _onPlaybackEnd?: () => void
  ): void {
    this.stop();
    this.exercise = exercise;
    this.onNoteChange = onNoteChange ?? null;
    this.onBeatChange = onBeatChange ?? null;
    // Note: onPlaybackEnd is kept for API compatibility but not yet implemented

    // Use exercise tempo if not overridden
    if (this.config.tempo === 80) {
      // 80 is default, use exercise tempo
      this.config.tempo = exercise.tempo;
    }

    // Parse time signature for config
    const { beatsPerMeasure, beatUnit } = parseTimeSignature(exercise.timeSignature);
    this.config.beatsPerMeasure = beatsPerMeasure;
    this.config.beatUnit = beatUnit;

    // Schedule the notes
    this.scheduledNotes = exerciseToScheduledNotes(exercise, this.config);
  }

  /**
   * Get scheduled notes
   */
  getScheduledNotes(): ScheduledNote[] {
    return this.scheduledNotes;
  }

  /**
   * Get total duration
   */
  getTotalDuration(): number {
    if (!this.exercise) return 0;
    return calculateExerciseDuration(this.exercise, this.config.tempo);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PlaybackConfig>): void {
    this.config = { ...this.config, ...config };

    // Update tempo in transport
    if (config.tempo !== undefined) {
      setTempo(config.tempo);
    }

    // Re-schedule if exercise is loaded and tempo changed
    if (this.exercise && config.tempo !== undefined) {
      this.scheduledNotes = exerciseToScheduledNotes(this.exercise, this.config);
    }
  }

  /**
   * Start or resume playback
   */
  play(): void {
    if (!this.exercise || !isAudioReady()) return;

    // Clear any existing scheduled events
    this.clearEvents();

    // Set tempo
    setTempo(this.config.tempo);

    // Calculate total duration
    const totalDuration = this.getTotalDuration();

    // Set loop if enabled
    setLoop(this.config.loop, totalDuration);

    // Schedule all notes
    scheduleNotes(
      this.scheduledNotes,
      this.onNoteChange ?? undefined
    );

    // Schedule metronome if enabled
    if (this.config.metronomeEnabled) {
      scheduleMetronome(
        this.config.beatsPerMeasure,
        this.config.tempo,
        totalDuration,
        this.onBeatChange ?? undefined
      );
    }

    // Start transport
    startPlayback();
  }

  /**
   * Pause playback
   */
  pause(): void {
    pausePlayback();
  }

  /**
   * Stop and reset playback
   */
  stop(): void {
    this.clearEvents();
    stopPlayback();
  }

  /**
   * Clear all scheduled events
   */
  private clearEvents(): void {
    clearScheduledEvents();
  }

  /**
   * Get current config
   */
  getConfig(): PlaybackConfig {
    return { ...this.config };
  }
}

// Singleton instance
let playbackControllerInstance: PlaybackController | null = null;

/**
 * Get or create the playback controller singleton
 */
export function getPlaybackController(config?: PlaybackConfig): PlaybackController {
  if (!playbackControllerInstance) {
    playbackControllerInstance = new PlaybackController(
      config ?? {
        tempo: 80,
        beatsPerMeasure: 4,
        beatUnit: 4,
        loop: false,
        metronomeEnabled: false,
        countIn: 0,
      }
    );
  }
  return playbackControllerInstance;
}
