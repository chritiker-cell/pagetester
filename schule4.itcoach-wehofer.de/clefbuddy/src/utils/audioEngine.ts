/**
 * Audio Engine
 *
 * Manages Tone.js audio context, synths, and playback.
 * Uses PolySynth with concert piano-like sound and low latency.
 */

import * as Tone from 'tone';
import type { ScheduledNote } from '../types/playback';

// Audio engine state
let isInitialized = false;
let polySynth: Tone.PolySynth | null = null;
let metronomePlayer: Tone.Player | null = null;
let metronomeSynth: Tone.MembraneSynth | null = null;

// Effects for richer piano sound
let reverb: Tone.Reverb | null = null;
let compressor: Tone.Compressor | null = null;

/**
 * Initialize the audio engine
 * Must be called after a user interaction (browser autoplay policy)
 */
export async function initAudioEngine(): Promise<void> {
  if (isInitialized) return;

  try {
    // Configure Tone.js for low latency
    Tone.setContext(
      new Tone.Context({
        latencyHint: 'interactive',
        lookAhead: 0.01, // 10ms lookAhead for lower latency
      })
    );

    // Start Tone.js audio context
    await Tone.start();

    // Create compressor for dynamics
    compressor = new Tone.Compressor({
      threshold: -20,
      ratio: 3,
      attack: 0.003,
      release: 0.25,
    }).toDestination();

    // Create subtle reverb for concert hall feel
    reverb = new Tone.Reverb({
      decay: 1.5,
      wet: 0.15,
    }).connect(compressor);

    // Wait for reverb to generate its impulse response
    await reverb.ready;

    // Create a PolySynth with realistic concert piano sound
    // Using FMSynth for richer harmonics like a real piano
    polySynth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3,
      modulationIndex: 1.5,
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.001,   // Very fast attack like hammer hitting string
        decay: 0.5,      // Natural decay
        sustain: 0.3,    // Sustain level
        release: 1.2,    // Long release like piano strings
      },
      modulation: {
        type: 'square',
      },
      modulationEnvelope: {
        attack: 0.002,
        decay: 0.2,
        sustain: 0.2,
        release: 0.5,
      },
      volume: -8,
    }).connect(reverb);

    // Set max polyphony for piano playing
    polySynth.maxPolyphony = 32;

    // Create metronome synth (short click sound)
    metronomeSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 4,
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.001,
        decay: 0.08,
        sustain: 0,
        release: 0.03,
      },
      volume: -8,
    }).toDestination();

    isInitialized = true;
    console.log('Audio engine initialized with low latency');
  } catch (error) {
    console.error('Failed to initialize audio engine:', error);
    throw error;
  }
}

/**
 * Check if audio engine is ready
 */
export function isAudioReady(): boolean {
  return isInitialized && polySynth !== null;
}

/**
 * Get the PolySynth instance
 */
export function getPolySynth(): Tone.PolySynth | null {
  return polySynth;
}

/**
 * Get the metronome synth
 */
export function getMetronomeSynth(): Tone.MembraneSynth | null {
  return metronomeSynth;
}

/**
 * Play a single note or chord immediately
 * @param notes Array of note names (e.g., ["C4", "E4", "G4"])
 * @param duration Duration in seconds
 */
export function playNotes(notes: string[], duration: number): void {
  if (!polySynth) {
    console.warn('Audio engine not initialized');
    return;
  }

  polySynth.triggerAttackRelease(notes, duration);
}

/**
 * Play a single note at a specific time
 * @param notes Array of note names
 * @param duration Duration in seconds
 * @param time Time to trigger (Tone.js time format)
 */
export function playNotesAtTime(
  notes: string[],
  duration: number,
  time: Tone.Unit.Time
): void {
  if (!polySynth) {
    console.warn('Audio engine not initialized');
    return;
  }

  // Ensure audio context is running (may be suspended after practice mode)
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }

  polySynth.triggerAttackRelease(notes, duration, time);
}

/**
 * Play a metronome click
 * @param isDownbeat Whether this is the first beat of a measure
 */
export function playMetronomeClick(isDownbeat: boolean): void {
  if (!metronomeSynth) return;

  // Higher pitch for downbeat
  const pitch = isDownbeat ? 'G5' : 'C5';
  const duration = '32n';

  // Play immediately - scheduling is handled by Transport.schedule()
  metronomeSynth.triggerAttackRelease(pitch, duration);
}

/**
 * Schedule notes for playback using Tone.Transport
 * @param scheduledNotes Array of scheduled notes
 * @param onNoteStart Callback when a note starts playing
 * @returns Array of event IDs for cleanup
 */
export function scheduleNotes(
  scheduledNotes: ScheduledNote[],
  onNoteStart?: (noteId: string, noteIndex: number) => void
): number[] {
  const eventIds: number[] = [];

  scheduledNotes.forEach((note, index) => {
    // Skip rests (no toneNotes)
    if (note.toneNotes.length === 0) return;

    const eventId = Tone.Transport.schedule((time) => {
      // Play the note(s)
      playNotesAtTime(note.toneNotes, note.durationSeconds * 0.9, time);

      // Trigger callback for visual highlighting
      if (onNoteStart) {
        // Use Tone.Draw to sync with animation frame
        Tone.Draw.schedule(() => {
          onNoteStart(note.id, index);
        }, time);
      }
    }, note.startTime);

    eventIds.push(eventId);
  });

  return eventIds;
}

/**
 * Schedule metronome clicks
 * @param beatsPerMeasure Number of beats per measure
 * @param tempo BPM
 * @param totalDuration Total duration in seconds
 * @param onBeat Callback for visual beat indicator
 * @returns Array of event IDs for cleanup
 */
export function scheduleMetronome(
  beatsPerMeasure: number,
  tempo: number,
  totalDuration: number,
  onBeat?: (beat: number, isDownbeat: boolean) => void
): number[] {
  const eventIds: number[] = [];
  const beatInterval = 60 / tempo; // seconds per beat
  let beatCount = 0;

  for (let time = 0; time < totalDuration; time += beatInterval) {
    const currentBeat = beatCount % beatsPerMeasure;
    const isDownbeat = currentBeat === 0;

    const eventId = Tone.Transport.schedule((t) => {
      // Play immediately when callback fires
      playMetronomeClick(isDownbeat);

      if (onBeat) {
        Tone.Draw.schedule(() => {
          onBeat(currentBeat + 1, isDownbeat); // 1-indexed for display
        }, t);
      }
    }, time);

    eventIds.push(eventId);
    beatCount++;
  }

  return eventIds;
}

/**
 * Start playback
 */
export function startPlayback(): void {
  Tone.Transport.start();
}

/**
 * Pause playback
 */
export function pausePlayback(): void {
  Tone.Transport.pause();
}

/**
 * Stop playback and reset to beginning
 */
export function stopPlayback(): void {
  Tone.Transport.stop();
  Tone.Transport.position = 0;
}

/**
 * Set playback tempo
 * @param bpm Beats per minute
 */
export function setTempo(bpm: number): void {
  Tone.Transport.bpm.value = bpm;
}

/**
 * Get current playback time in seconds
 */
export function getCurrentTime(): number {
  return Tone.Transport.seconds;
}

/**
 * Set the current playback position
 * @param seconds Position in seconds
 */
export function setPosition(seconds: number): void {
  Tone.Transport.seconds = seconds;
}

/**
 * Enable or disable loop mode
 * @param enabled Whether loop is enabled
 * @param loopEnd End time in seconds
 */
export function setLoop(enabled: boolean, loopEnd?: number): void {
  Tone.Transport.loop = enabled;
  if (enabled && loopEnd !== undefined) {
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = loopEnd;
  }
}

/**
 * Clear all scheduled events
 */
export function clearScheduledEvents(): void {
  Tone.Transport.cancel();
}

/**
 * Get the Transport state
 */
export function getTransportState(): 'started' | 'stopped' | 'paused' {
  return Tone.Transport.state;
}

/**
 * Dispose of audio resources
 */
export function disposeAudio(): void {
  if (polySynth) {
    polySynth.dispose();
    polySynth = null;
  }
  if (metronomeSynth) {
    metronomeSynth.dispose();
    metronomeSynth = null;
  }
  if (metronomePlayer) {
    metronomePlayer.dispose();
    metronomePlayer = null;
  }
  if (reverb) {
    reverb.dispose();
    reverb = null;
  }
  if (compressor) {
    compressor.dispose();
    compressor = null;
  }
  Tone.Transport.cancel();
  isInitialized = false;
}

/**
 * Play notes immediately (for MIDI input with minimal latency)
 * Uses Tone.now() for immediate playback
 */
export function playNotesImmediate(notes: string[], duration: number): void {
  if (!polySynth) {
    console.warn('Audio engine not initialized');
    return;
  }

  // Use Tone.now() for immediate playback with minimal latency
  polySynth.triggerAttackRelease(notes, duration, Tone.now());
}
