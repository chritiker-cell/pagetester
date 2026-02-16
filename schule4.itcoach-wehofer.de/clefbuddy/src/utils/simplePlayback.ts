/**
 * Simple Playback System
 *
 * Uses performance.now() as unified time base for both audio and cursor.
 * No Tone.Transport dependency - all scheduling via setTimeout.
 */

import type { ScheduledNote } from '../types/playback';
import { playNotesImmediate, playMetronomeClick, ensureAudioContext, releaseAllVoices } from './audioEngine';

/**
 * Playback session state
 */
export interface PlaybackSession {
  startTime: number;           // performance.now() when playback started
  countInDuration: number;     // milliseconds of count-in (initial, for reference)
  currentCountIn: number;      // milliseconds of count-in for current cycle (0 on loop)
  totalDuration: number;       // milliseconds (exercise duration, without count-in)
  isPlaying: boolean;
  loop: boolean;
  isFirstCycle: boolean;       // true for initial playback, false after loop restart
  timeoutIds: number[];        // All setTimeout IDs for cleanup
  onNotePlay?: (noteId: string, noteIndex: number) => void;
  onPlaybackEnd?: () => void;
}

export interface PlaybackConfig {
  tempo: number;
  beatsPerMeasure: number;
  metronomeEnabled: boolean;
  loop: boolean;
}

/**
 * Schedule count-in clicks
 */
function scheduleCountIn(
  session: PlaybackSession,
  beatsPerMeasure: number,
  beatDurationMs: number
): void {
  for (let beat = 0; beat < beatsPerMeasure; beat++) {
    const timeMs = beat * beatDurationMs;
    const isDownbeat = beat === 0;

    const id = window.setTimeout(() => {
      if (!session.isPlaying) return;
      playMetronomeClick(isDownbeat);
    }, timeMs);

    session.timeoutIds.push(id);
  }
}

/**
 * Schedule all notes for playback
 */
function scheduleNotes(
  session: PlaybackSession,
  notes: ScheduledNote[]
): void {
  notes.forEach((note, index) => {
    // Skip rests
    if (note.toneNotes.length === 0) return;

    // Note startTime is in seconds, convert to ms and add current count-in offset
    const timeMs = session.currentCountIn + (note.startTime * 1000);

    const id = window.setTimeout(() => {
      if (!session.isPlaying) return;
      // Play the note(s)
      playNotesImmediate(note.toneNotes, note.durationSeconds * 0.98);
      // Trigger callback
      if (session.onNotePlay) {
        session.onNotePlay(note.id, index);
      }
    }, timeMs);

    session.timeoutIds.push(id);
  });
}

/**
 * Schedule metronome clicks during exercise (after count-in)
 */
function scheduleMetronome(
  session: PlaybackSession,
  beatsPerMeasure: number,
  beatDurationMs: number,
  totalDurationMs: number
): void {
  const startOffset = session.currentCountIn;
  let beatCount = 0;

  for (let timeMs = 0; timeMs < totalDurationMs; timeMs += beatDurationMs) {
    const currentBeat = beatCount % beatsPerMeasure;
    const isDownbeat = currentBeat === 0;
    const scheduleTime = startOffset + timeMs;

    const id = window.setTimeout(() => {
      if (!session.isPlaying) return;
      playMetronomeClick(isDownbeat);
    }, scheduleTime);

    session.timeoutIds.push(id);
    beatCount++;
  }
}

/**
 * Schedule loop restart (seamless, no count-in on repeat)
 */
function scheduleLoopRestart(
  session: PlaybackSession,
  notes: ScheduledNote[],
  config: PlaybackConfig,
  beatDurationMs: number
): void {
  const cycleTime = session.currentCountIn + session.totalDuration;

  const id = window.setTimeout(() => {
    // Check isPlaying FIRST before doing anything
    if (!session.isPlaying || !session.loop) return;

    // Clear existing timeouts (except this one, which has already fired)
    session.timeoutIds.forEach(clearTimeout);
    session.timeoutIds = [];

    // Double-check still playing (user might have stopped during timeout.forEach)
    if (!session.isPlaying || !session.loop) return;

    // Update for seamless loop (no count-in)
    session.startTime = performance.now();
    session.currentCountIn = 0;
    session.isFirstCycle = false;

    // Re-schedule without count-in
    scheduleLoopEvents(session, notes, config, beatDurationMs);
  }, cycleTime);

  session.timeoutIds.push(id);
}

/**
 * Schedule events for loop cycles (no count-in)
 */
function scheduleLoopEvents(
  session: PlaybackSession,
  notes: ScheduledNote[],
  config: PlaybackConfig,
  beatDurationMs: number
): void {
  // 1. Notes (immediately, no count-in offset)
  scheduleNotes(session, notes);

  // 2. Metronome during exercise (if enabled)
  if (config.metronomeEnabled) {
    scheduleMetronome(session, config.beatsPerMeasure, beatDurationMs, session.totalDuration);
  }

  // 3. Schedule next loop restart
  scheduleLoopRestart(session, notes, config, beatDurationMs);
}

/**
 * Schedule all playback events (count-in, notes, metronome, loop)
 * Used for initial playback (with count-in)
 */
function scheduleAllEvents(
  session: PlaybackSession,
  notes: ScheduledNote[],
  config: PlaybackConfig,
  beatDurationMs: number
): void {
  // Check isPlaying IMMEDIATELY before scheduling anything
  // This prevents scheduling when stop was called during async initialization
  if (!session.isPlaying) return;

  // 1. Count-in clicks (only on first cycle)
  if (session.isFirstCycle) {
    scheduleCountIn(session, config.beatsPerMeasure, beatDurationMs);
  }

  // 2. Notes
  scheduleNotes(session, notes);

  // 3. Metronome during exercise (if enabled)
  if (config.metronomeEnabled) {
    scheduleMetronome(session, config.beatsPerMeasure, beatDurationMs, session.totalDuration);
  }

  // 4. Loop restart or end callback
  if (session.loop) {
    scheduleLoopRestart(session, notes, config, beatDurationMs);
  } else {
    // Schedule end callback (non-loop mode)
    const endTime = session.currentCountIn + session.totalDuration;
    const id = window.setTimeout(() => {
      if (!session.isPlaying) return;
      // Mark as stopped FIRST to prevent callback from restarting
      session.isPlaying = false;
      // Then trigger callback (which may update state)
      if (session.onPlaybackEnd) {
        session.onPlaybackEnd();
      }
    }, endTime);
    session.timeoutIds.push(id);
  }
}

/**
 * Start simple playback
 * Returns a PlaybackSession that can be used for cursor animation sync
 */
export async function startSimplePlayback(
  notes: ScheduledNote[],
  config: PlaybackConfig,
  totalDurationSeconds: number,
  callbacks?: {
    onNotePlay?: (noteId: string, noteIndex: number) => void;
    onPlaybackEnd?: () => void;
  }
): Promise<PlaybackSession> {
  // Ensure audio context is running
  await ensureAudioContext();

  // Calculate timing
  const beatDurationMs = (60 / config.tempo) * 1000;
  const countInDuration = config.beatsPerMeasure * beatDurationMs;
  const totalDuration = totalDurationSeconds * 1000;

  // Create session
  const session: PlaybackSession = {
    startTime: performance.now(),
    countInDuration,
    currentCountIn: countInDuration, // Same as countInDuration for first cycle
    totalDuration,
    isPlaying: true,
    loop: config.loop,
    isFirstCycle: true,
    timeoutIds: [],
    onNotePlay: callbacks?.onNotePlay,
    onPlaybackEnd: callbacks?.onPlaybackEnd,
  };

  // Schedule all events
  scheduleAllEvents(session, notes, config, beatDurationMs);

  return session;
}

/**
 * Stop playback and clear all scheduled events
 */
export function stopSimplePlayback(session: PlaybackSession | null): void {
  if (!session) return;

  // Mark as stopped FIRST to prevent callbacks from firing
  session.isPlaying = false;

  // Clear all scheduled timeouts
  session.timeoutIds.forEach(id => clearTimeout(id));
  session.timeoutIds = [];

  // Stop all currently playing audio
  releaseAllVoices();
}

/**
 * Get elapsed time in milliseconds since playback start
 * Accounts for loop cycling
 */
export function getElapsedTime(session: PlaybackSession): number {
  if (!session.isPlaying) return 0;

  const elapsed = performance.now() - session.startTime;
  const cycleTime = session.currentCountIn + session.totalDuration;

  if (session.loop && elapsed >= cycleTime) {
    return elapsed % cycleTime;
  }

  return elapsed;
}

/**
 * Get elapsed music time (after count-in) in milliseconds
 * Returns negative during count-in
 */
export function getMusicElapsedTime(session: PlaybackSession): number {
  const elapsed = getElapsedTime(session);
  return elapsed - session.currentCountIn;
}
