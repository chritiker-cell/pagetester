/**
 * Practice Mode Controller
 *
 * Manages practice sessions with MIDI input, playback, and scoring.
 * Coordinates between audio playback, MIDI input, and comparison engine.
 */

import * as Tone from 'tone';
import type { ScheduledNote } from '../types/playback';
import type { PlayedNote, MIDIInputEvent } from '../types/midi';
import type { ComparisonSummary, PracticeComparisonState, ComparisonConfig } from '../types/comparison';
import {
  initPracticeComparisonState,
  processPlayedNote,
  finalizePractice,
} from './noteComparison';
import { DEFAULT_COMPARISON_CONFIG } from '../types/comparison';
import { createPlayedNote } from './midiEngine';
import { playMetronomeClick, initAudioEngine, isAudioReady } from './audioEngine';

/**
 * Practice mode states
 */
export type PracticeModeState =
  | 'idle'
  | 'countdown'
  | 'playing'
  | 'recording'
  | 'paused'
  | 'finished';

/**
 * Practice mode configuration
 */
export interface PracticeModeConfig {
  /** Countdown beats before starting */
  countdownBeats: number;

  /** Whether to play reference audio */
  playReference: boolean;

  /** Whether metronome is enabled */
  metronomeEnabled: boolean;

  /** Tempo in BPM */
  tempo: number;

  /** Time signature beats per measure */
  beatsPerMeasure: number;

  /** Comparison configuration */
  comparisonConfig: ComparisonConfig;
}

/**
 * Default practice mode configuration
 */
export const DEFAULT_PRACTICE_CONFIG: PracticeModeConfig = {
  countdownBeats: 4,
  playReference: true,
  metronomeEnabled: true,
  tempo: 80,
  beatsPerMeasure: 4,
  comparisonConfig: DEFAULT_COMPARISON_CONFIG,
};

/**
 * Practice session callbacks
 */
export interface PracticeCallbacks {
  /** Called when state changes */
  onStateChange?: (state: PracticeModeState) => void;

  /** Called on each countdown beat */
  onCountdownBeat?: (beat: number, total: number) => void;

  /** Called when a note is expected to be played */
  onExpectedNote?: (noteIndex: number, note: ScheduledNote) => void;

  /** Called when user plays a note */
  onUserNote?: (playedNote: PlayedNote, comparison: PracticeComparisonState) => void;

  /** Called when playback position updates */
  onPositionUpdate?: (time: number, noteIndex: number) => void;

  /** Called on each metronome beat */
  onMetronomeBeat?: (beat: number, isDownbeat: boolean) => void;

  /** Called when practice session ends */
  onComplete?: (summary: ComparisonSummary) => void;

  /** Called on error */
  onError?: (error: Error) => void;
}

// Practice controller instance state
let currentState: PracticeModeState = 'idle';
let scheduledNotes: ScheduledNote[] = [];
let comparisonState: PracticeComparisonState | null = null;
let practiceStartTime: number = 0;
let config: PracticeModeConfig = DEFAULT_PRACTICE_CONFIG;
let callbacks: PracticeCallbacks = {};
let eventIds: number[] = [];
let positionInterval: number | null = null;
let countdownInterval: number | null = null;

/**
 * Initialize practice mode
 */
export function initPracticeMode(
  notes: ScheduledNote[],
  practiceConfig: Partial<PracticeModeConfig> = {},
  practiceCallbacks: PracticeCallbacks = {}
): void {
  // Cleanup any previous session
  cleanupPractice();

  scheduledNotes = notes;
  config = { ...DEFAULT_PRACTICE_CONFIG, ...practiceConfig };
  callbacks = practiceCallbacks;
  comparisonState = initPracticeComparisonState(notes);

  setState('idle');
}

/**
 * Start practice session
 */
export async function startPractice(): Promise<void> {
  if (currentState !== 'idle' && currentState !== 'finished') {
    console.warn('Practice already in progress');
    return;
  }

  // Ensure Tone.js is started
  await Tone.start();

  // Initialize audio engine if needed (for metronome sounds)
  if (!isAudioReady()) {
    await initAudioEngine();
  }

  // Reset comparison state
  comparisonState = initPracticeComparisonState(scheduledNotes);

  // Set tempo
  Tone.Transport.bpm.value = config.tempo;

  // Start countdown (with metronome clicks)
  if (config.countdownBeats > 0) {
    await runCountdown();
  }

  // Start practice
  setState('playing');
  practiceStartTime = performance.now();

  // Schedule notes and events
  schedulePlayback();

  // Schedule metronome if enabled
  if (config.metronomeEnabled) {
    scheduleMetronome();
  }

  // Start position tracking
  startPositionTracking();

  // Start transport
  Tone.Transport.start();
}

/**
 * Run countdown before practice starts
 */
async function runCountdown(): Promise<void> {
  setState('countdown');

  return new Promise<void>((resolve) => {
    let beat = 0;
    const beatDuration = (60 / config.tempo) * 1000; // ms per beat

    // Play first beat immediately
    const playBeat = () => {
      beat++;
      const isDownbeat = beat === 1 || beat % config.beatsPerMeasure === 1;

      // Play metronome click sound
      playMetronomeClick(isDownbeat);

      // Notify callback
      callbacks.onCountdownBeat?.(beat, config.countdownBeats);
      callbacks.onMetronomeBeat?.(beat, isDownbeat);

      if (beat >= config.countdownBeats) {
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
        resolve();
      }
    };

    // Play first beat immediately
    playBeat();

    // Schedule remaining beats
    if (config.countdownBeats > 1) {
      countdownInterval = window.setInterval(playBeat, beatDuration);
    } else {
      resolve();
    }
  });
}

/**
 * Schedule playback events
 */
function schedulePlayback(): void {
  const totalDuration = calculateTotalDuration();

  // Schedule note highlighting
  scheduledNotes.forEach((note, index) => {
    const eventId = Tone.Transport.schedule((time) => {
      Tone.Draw.schedule(() => {
        callbacks.onExpectedNote?.(index, note);
      }, time);
    }, note.startTime);
    eventIds.push(eventId);
  });

  // Schedule end of practice
  const endEventId = Tone.Transport.schedule(() => {
    Tone.Draw.schedule(() => {
      finishPractice();
    }, Tone.Transport.seconds);
  }, totalDuration + 0.5);
  eventIds.push(endEventId);
}

/**
 * Calculate total duration of exercise
 */
function calculateTotalDuration(): number {
  if (scheduledNotes.length === 0) return 0;

  const lastNote = scheduledNotes[scheduledNotes.length - 1];
  return lastNote.startTime + lastNote.durationSeconds;
}

/**
 * Schedule metronome clicks during practice
 */
function scheduleMetronome(): void {
  const totalDuration = calculateTotalDuration();
  const beatInterval = 60 / config.tempo; // seconds per beat
  let beatCount = 0;

  for (let time = 0; time < totalDuration + beatInterval; time += beatInterval) {
    const currentBeat = beatCount % config.beatsPerMeasure;
    const isDownbeat = currentBeat === 0;
    const beatNumber = currentBeat + 1; // 1-indexed for display

    const eventId = Tone.Transport.schedule((t) => {
      // Play metronome click immediately when callback fires
      playMetronomeClick(isDownbeat);

      // Notify callback for visual update
      Tone.Draw.schedule(() => {
        callbacks.onMetronomeBeat?.(beatNumber, isDownbeat);
      }, t);
    }, time);

    eventIds.push(eventId);
    beatCount++;
  }
}

/**
 * Start position tracking
 */
function startPositionTracking(): void {
  positionInterval = window.setInterval(() => {
    if (currentState !== 'playing') return;

    const currentTime = Tone.Transport.seconds;

    // Find current note index
    let currentNoteIndex = -1;
    for (let i = 0; i < scheduledNotes.length; i++) {
      const note = scheduledNotes[i];
      if (currentTime >= note.startTime && currentTime < note.startTime + note.durationSeconds) {
        currentNoteIndex = i;
        break;
      }
    }

    callbacks.onPositionUpdate?.(currentTime, currentNoteIndex);
  }, 50);
}

/**
 * Handle MIDI note input
 */
export function handleMidiInput(event: MIDIInputEvent): void {
  if (currentState !== 'playing' || !comparisonState) return;

  // Create played note
  const playedNote = createPlayedNote(event, practiceStartTime);

  // Process the note
  comparisonState = processPlayedNote(
    comparisonState,
    playedNote,
    config.comparisonConfig
  );

  // Notify callback
  callbacks.onUserNote?.(playedNote, comparisonState);
}

/**
 * Handle MIDI note off (for duration tracking)
 */
export function handleMidiNoteOff(_event: MIDIInputEvent): void {
  // Duration tracking is handled in the MIDI store
}

/**
 * Pause practice
 */
export function pausePractice(): void {
  if (currentState !== 'playing') return;

  Tone.Transport.pause();
  setState('paused');
}

/**
 * Resume practice
 */
export function resumePractice(): void {
  if (currentState !== 'paused') return;

  Tone.Transport.start();
  setState('playing');
}

/**
 * Stop and finish practice
 */
export function stopPractice(): void {
  finishPractice();
}

/**
 * Finish practice and generate results
 */
function finishPractice(): void {
  if (currentState === 'finished' || currentState === 'idle') return;

  // Stop transport
  Tone.Transport.stop();
  Tone.Transport.position = 0;

  // Clear events
  for (const eventId of eventIds) {
    Tone.Transport.clear(eventId);
  }
  eventIds = [];

  // Stop position tracking
  if (positionInterval) {
    clearInterval(positionInterval);
    positionInterval = null;
  }

  setState('finished');

  // Generate summary
  if (comparisonState) {
    const summary = finalizePractice(comparisonState, config.comparisonConfig);
    callbacks.onComplete?.(summary);
  }
}

/**
 * Reset practice to beginning
 */
export function resetPractice(): void {
  cleanupPractice();
  comparisonState = initPracticeComparisonState(scheduledNotes);
  setState('idle');
}

/**
 * Cleanup practice resources
 */
function cleanupPractice(): void {
  // Stop transport
  Tone.Transport.stop();
  Tone.Transport.position = 0;

  // Clear scheduled events
  for (const eventId of eventIds) {
    Tone.Transport.clear(eventId);
  }
  eventIds = [];

  // Clear intervals
  if (positionInterval) {
    clearInterval(positionInterval);
    positionInterval = null;
  }

  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

/**
 * Set state and notify callback
 */
function setState(newState: PracticeModeState): void {
  currentState = newState;
  callbacks.onStateChange?.(newState);
}

/**
 * Get current practice state
 */
export function getPracticeState(): PracticeModeState {
  return currentState;
}

/**
 * Get current comparison state
 */
export function getComparisonState(): PracticeComparisonState | null {
  return comparisonState;
}

/**
 * Get running accuracy during practice
 */
export function getRunningAccuracy(): {
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
} {
  if (!comparisonState) {
    return { correct: 0, incorrect: 0, total: 0, percentage: 0 };
  }

  const { correctCount, incorrectCount, noteStates } = comparisonState;
  const total = noteStates.length;
  const played = correctCount + incorrectCount;
  const percentage = played > 0 ? (correctCount / played) * 100 : 0;

  return {
    correct: correctCount,
    incorrect: incorrectCount,
    total,
    percentage,
  };
}

/**
 * Dispose of practice mode
 */
export function disposePracticeMode(): void {
  cleanupPractice();
  scheduledNotes = [];
  comparisonState = null;
  callbacks = {};
  setState('idle');
}
