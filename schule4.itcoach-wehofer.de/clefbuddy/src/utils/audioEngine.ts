/**
 * Audio Engine
 *
 * Manages Tone.js audio context, synths, and playback.
 * Uses Salamander Grand Piano samples for realistic piano sound.
 */

import * as Tone from 'tone';

// Audio engine state
let isInitialized = false;
let polySynth: Tone.Sampler | null = null;
let metronomePlayer: Tone.Player | null = null;
let metronomeSynth: Tone.MembraneSynth | null = null;

// LOW-LATENCY synth for MIDI live input (bypasses sampler latency)
let liveInputSynth: Tone.PolySynth | null = null;

// Effects for richer piano sound
let reverb: Tone.Reverb | null = null;
let compressor: Tone.Compressor | null = null;

// Active notes tracking for live input
let activeNotes: Set<string> = new Set();

/**
 * Initialize the audio engine
 * Must be called after a user interaction (browser autoplay policy)
 */
export async function initAudioEngine(): Promise<void> {
  if (isInitialized) return;

  try {
    // Configure Tone.js for ULTRA-LOW latency
    // 'interactive' + minimal lookAhead for live MIDI input
    Tone.setContext(
      new Tone.Context({
        latencyHint: 'interactive', // Optimized for low latency (typically ~10ms)
        lookAhead: 0.01, // Reduced from 50ms to 10ms for MIDI responsiveness
        updateInterval: 0.01, // Update interval for scheduling (10ms)
      })
    );

    // Start Tone.js audio context
    await Tone.start();

    // Create Sampler with Salamander Grand Piano samples FIRST
    // Samples every minor 3rd for full keyboard coverage with good interpolation
    polySynth = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      volume: -6, // Reduced from 0 for comfortable listening
    });

    // CRITICAL: Wait for all piano samples to load before connecting effects
    // Sampler.loaded is a getter, not a method. We need to poll or use onload callback.
    // Use a Promise wrapper to wait for samples to load
    if (!polySynth.loaded) {
      await new Promise<void>((resolve) => {
        const checkLoaded = () => {
          if (polySynth && polySynth.loaded) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    // Create compressor for dynamics
    compressor = new Tone.Compressor({
      threshold: -20,
      ratio: 3,
      attack: 0.003,
      release: 0.25,
    }).toDestination();

    // Create subtle reverb for concert hall feel
    reverb = new Tone.Reverb({
      decay: 0.8,   // Short decay for clear articulation
      wet: 0.08,    // Subtle reverb, samples already have room ambience
    }).connect(compressor);

    // Wait for reverb to generate its impulse response
    await reverb.ready;

    // NOW connect the loaded sampler to the effect chain
    polySynth.connect(reverb);

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
      volume: -14,
    }).toDestination();

    // Create LOW-LATENCY PolySynth for MIDI live input
    // Bypasses Sampler loading latency for instant response
    liveInputSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle', // Warm piano-like tone
      },
      envelope: {
        attack: 0.005,  // 5ms attack for instant response
        decay: 0.3,
        sustain: 0.4,
        release: 1.2,   // Piano-like decay
      },
      volume: -9, // Reduced from -3 for comfortable listening
    }).toDestination(); // Direct to destination for minimal latency

    isInitialized = true;
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
 * Ensure audio context is running and ready
 * Call before starting playback to prevent suspended state issues
 */
export async function ensureAudioContext(): Promise<void> {
  if (!isInitialized) {
    throw new Error('Audio engine not initialized');
  }

  if (Tone.context.state !== 'running') {
    await Tone.context.resume();
  }
}

/**
 * Get the Sampler instance
 */
export function getPolySynth(): Tone.Sampler | null {
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

  try {
    polySynth.triggerAttackRelease(notes, duration);
  } catch (error) {
    console.error('[AudioEngine] playNotes error:', error);
  }
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
    Tone.context.resume().catch(err => {
      console.warn('Failed to resume audio context:', err);
    });
  }

  polySynth.triggerAttackRelease(notes, duration, time);
}

/**
 * Play a metronome click immediately
 * @param isDownbeat Whether this is the first beat of a measure
 */
export function playMetronomeClick(isDownbeat: boolean): void {
  if (!metronomeSynth) return;

  // Higher pitch for downbeat
  const pitch = isDownbeat ? 'G5' : 'C5';
  const duration = '32n';

  try {
    metronomeSynth.triggerAttackRelease(pitch, duration, Tone.now());
  } catch (e) {
    // Ignore timing errors - click will just be skipped
  }
}

/**
 * Release all synth voices (use when stopping playback)
 */
export function releaseAllVoices(): void {
  if (polySynth) {
    polySynth.releaseAll();
  }
}

/**
 * Dispose of audio resources
 */
export function disposeAudio(): void {
  // Kill all live voices before disposing
  releaseAllLiveInput();

  if (polySynth) {
    polySynth.dispose();
    polySynth = null;
  }
  if (liveInputSynth) {
    liveInputSynth.dispose();
    liveInputSynth = null;
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
 * Uses LOW-LATENCY PolySynth for instant response
 */
export function playNotesImmediate(notes: string[], duration: number): void {
  // Use liveInputSynth for ULTRA-LOW latency (no sample loading)
  if (!liveInputSynth) {
    console.warn('[AudioEngine] playNotesImmediate: Low-latency synth not initialized');
    return;
  }

  // Ensure audio context is running
  if (Tone.context.state !== 'running') {
    Tone.context.resume().catch(err => {
      console.error('[AudioEngine] Failed to resume context:', err);
    });
  }

  try {
    // CRITICAL: Use immediate() for absolute minimal latency
    // Bypasses Tone.js scheduling queue entirely
    const now = Tone.immediate();
    liveInputSynth.triggerAttackRelease(notes, duration, now);
  } catch (error) {
    console.error('[AudioEngine] playNotesImmediate error:', error);
  }
}

/**
 * Get the live input synth (for direct MIDI triggering)
 */
export function getLiveInputSynth(): Tone.PolySynth | null {
  return liveInputSynth;
}

/**
 * Trigger note attack (for low-latency MIDI input)
 * @param noteName Note name (e.g., "C4")
 * @param velocity Velocity (0-127)
 */
export function triggerNoteAttack(noteName: string, velocity: number): void {
  if (!liveInputSynth) {
    console.warn('[AudioEngine] triggerNoteAttack: Low-latency synth not initialized');
    return;
  }

  // Ensure audio context is running
  if (Tone.context.state !== 'running') {
    Tone.context.resume().catch(err => {
      console.error('[AudioEngine] Failed to resume context:', err);
    });
  }

  try {
    const now = Tone.immediate();
    // Release any existing voice for this note BEFORE creating a new one.
    // Prevents zombie voices from duplicate MIDI noteOn messages.
    liveInputSynth.triggerRelease([noteName], now);
    const normalizedVelocity = velocity / 127;
    liveInputSynth.triggerAttack([noteName], now, normalizedVelocity);
    activeNotes.add(noteName);
  } catch (error) {
    console.error('[AudioEngine] triggerNoteAttack error:', error);
  }
}

/**
 * Trigger note release (for low-latency MIDI input)
 * @param noteName Note name (e.g., "C4")
 */
export function triggerNoteRelease(noteName: string): void {
  if (!liveInputSynth) {
    console.warn('[AudioEngine] triggerNoteRelease: Low-latency synth not initialized');
    return;
  }

  try {
    const now = Tone.immediate();
    liveInputSynth.triggerRelease([noteName], now);
    activeNotes.delete(noteName);
  } catch (error) {
    console.error('[AudioEngine] triggerNoteRelease error:', error);
  }
}

/**
 * Release all live input voices (panic/cleanup)
 * Use when stopping practice, disconnecting MIDI, etc.
 */
export function releaseAllLiveInput(): void {
  if (liveInputSynth) {
    liveInputSynth.releaseAll(Tone.immediate());
  }
  activeNotes.clear();
}
