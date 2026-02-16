/**
 * MIDI Engine
 *
 * Manages Web MIDI API connections, device discovery, and note event handling.
 * Provides real-time MIDI input for practice mode.
 */

import type { MIDIDevice, MIDIInputEvent, PlayedNote } from '../types/midi';
import { isWebMIDISupported, getMIDIErrorMessage } from './midiCompat';

// MIDI message status bytes
const MIDI_NOTE_ON = 0x90;
const MIDI_NOTE_OFF = 0x80;
// CC messages (e.g. sustain pedal) intentionally not handled

// Engine state
let midiAccess: MIDIAccess | null = null;
let currentInput: MIDIInput | null = null;
let noteOnCallback: ((event: MIDIInputEvent) => void) | null = null;
let noteOffCallback: ((event: MIDIInputEvent) => void) | null = null;
let deviceChangeCallback: ((devices: MIDIDevice[]) => void) | null = null;

// CRITICAL: Direct audio callback for ultra-low latency
// Bypasses React state updates for immediate audio response
let directAudioCallback: ((noteName: string, velocity: number) => void) | null = null;
let directAudioReleaseCallback: ((noteName: string) => void) | null = null;

/**
 * Initialize the MIDI engine and request access
 */
export async function initMIDIEngine(): Promise<MIDIDevice[]> {
  if (!isWebMIDISupported()) {
    throw new Error('Web MIDI API is not supported in this browser');
  }

  try {
    midiAccess = await navigator.requestMIDIAccess({ sysex: false });

    // Listen for device changes
    midiAccess.onstatechange = handleStateChange;

    return getAvailableDevices();
  } catch (error) {
    throw new Error(getMIDIErrorMessage(error));
  }
}

/**
 * Check if MIDI engine is initialized
 */
export function isMIDIInitialized(): boolean {
  return midiAccess !== null;
}

/**
 * Get list of available MIDI input devices
 */
export function getAvailableDevices(): MIDIDevice[] {
  if (!midiAccess) return [];

  const devices: MIDIDevice[] = [];

  midiAccess.inputs.forEach((input) => {
    devices.push({
      id: input.id,
      name: input.name || 'Unknown Device',
      manufacturer: input.manufacturer || 'Unknown',
      state: input.state,
      type: 'input',
    });
  });

  return devices;
}

/**
 * Connect to a specific MIDI input device
 */
export function connectToDevice(deviceId: string): boolean {
  if (!midiAccess) {
    console.warn('MIDI engine not initialized');
    return false;
  }

  // Disconnect from current device
  if (currentInput) {
    disconnectFromDevice();
  }

  const input = midiAccess.inputs.get(deviceId);
  if (!input) {
    console.warn(`MIDI device ${deviceId} not found`);
    return false;
  }

  currentInput = input;
  currentInput.onmidimessage = handleMIDIMessage;

  console.log(`Connected to MIDI device: ${input.name}`);
  return true;
}

/**
 * Disconnect from the current MIDI device
 */
export function disconnectFromDevice(): void {
  if (currentInput) {
    currentInput.onmidimessage = null;
    console.log(`Disconnected from MIDI device: ${currentInput.name}`);
    currentInput = null;
  }
}

/**
 * Get the currently connected device
 */
export function getCurrentDevice(): MIDIDevice | null {
  if (!currentInput) return null;

  return {
    id: currentInput.id,
    name: currentInput.name || 'Unknown Device',
    manufacturer: currentInput.manufacturer || 'Unknown',
    state: currentInput.state,
    type: 'input',
  };
}

/**
 * Register callback for note on events
 */
export function onNoteOn(callback: (event: MIDIInputEvent) => void): void {
  noteOnCallback = callback;
}

/**
 * Register callback for note off events
 */
export function onNoteOff(callback: (event: MIDIInputEvent) => void): void {
  noteOffCallback = callback;
}

/**
 * Register callback for device change events
 */
export function onDeviceChange(callback: (devices: MIDIDevice[]) => void): void {
  deviceChangeCallback = callback;
}

/**
 * Register direct audio callback for ultra-low latency
 * This bypasses React state updates and triggers audio immediately
 */
export function onDirectAudio(callback: (noteName: string, velocity: number) => void): void {
  directAudioCallback = callback;
}

/**
 * Register direct audio release callback for low latency
 * This releases notes immediately when key is released
 */
export function onDirectAudioRelease(callback: (noteName: string) => void): void {
  directAudioReleaseCallback = callback;
}

/**
 * Remove all callbacks
 */
export function removeAllCallbacks(): void {
  noteOnCallback = null;
  noteOffCallback = null;
  deviceChangeCallback = null;
  directAudioCallback = null;
  directAudioReleaseCallback = null;
}

/**
 * Handle incoming MIDI messages
 */
function handleMIDIMessage(event: MIDIMessageEvent): void {
  const data = event.data;
  if (!data || data.length < 2) return;

  const statusByte = data[0];
  const channel = statusByte & 0x0f;
  const messageType = statusByte & 0xf0;
  const data1 = data[1];
  const data2 = data.length > 2 ? data[2] : 0;

  // Note On (velocity > 0) or Note Off (velocity = 0 or explicit Note Off)
  const note = data1;
  const velocity = data2;

  if (messageType === MIDI_NOTE_ON && velocity > 0) {
    // CRITICAL: Trigger audio FIRST for minimal latency (before callbacks)
    if (directAudioCallback) {
      const noteName = midiNoteToName(note);
      directAudioCallback(noteName, velocity);
    }

    // Then notify callbacks (for practice mode, UI updates, etc.)
    const inputEvent: MIDIInputEvent = {
      type: 'noteon',
      note,
      velocity,
      timestamp: event.timeStamp,
      channel,
    };

    noteOnCallback?.(inputEvent);
  } else if (
    messageType === MIDI_NOTE_OFF ||
    (messageType === MIDI_NOTE_ON && velocity === 0)
  ) {
    // Trigger audio release immediately
    if (directAudioReleaseCallback) {
      const noteName = midiNoteToName(note);
      directAudioReleaseCallback(noteName);
    }

    const inputEvent: MIDIInputEvent = {
      type: 'noteoff',
      note,
      velocity,
      timestamp: event.timeStamp,
      channel,
    };

    noteOffCallback?.(inputEvent);
  }

  // Control Change messages — CC64 (sustain pedal) intentionally ignored
}

/**
 * Handle device state changes (connect/disconnect)
 */
function handleStateChange(event: MIDIConnectionEvent): void {
  console.log(
    `MIDI device state change: ${event.port?.name} - ${event.port?.state}`
  );

  // If our connected device was disconnected
  if (
    currentInput &&
    event.port?.id === currentInput.id &&
    event.port?.state === 'disconnected'
  ) {
    disconnectFromDevice();
  }

  // Notify listeners of device list change
  deviceChangeCallback?.(getAvailableDevices());
}

/**
 * Convert MIDI note number to scientific pitch notation
 * @param midiNote MIDI note number (0-127)
 * @returns Note name like "C4"
 */
export function midiNoteToName(midiNote: number): string {
  const noteNames = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = noteNames[midiNote % 12];
  return `${noteName}${octave}`;
}

/**
 * Convert MIDI note number to VexFlow key format
 * @param midiNote MIDI note number (0-127)
 * @returns VexFlow key like "c/4"
 */
export function midiNoteToVexFlow(midiNote: number): string {
  const noteNames = [
    'c',
    'c#',
    'd',
    'd#',
    'e',
    'f',
    'f#',
    'g',
    'g#',
    'a',
    'a#',
    'b',
  ];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = noteNames[midiNote % 12];
  return `${noteName}/${octave}`;
}

/**
 * Convert scientific pitch notation to MIDI note number
 * @param noteName Note name like "C4" or "C#4"
 * @returns MIDI note number (0-127)
 */
export function noteNameToMidi(noteName: string): number {
  const noteMap: Record<string, number> = {
    C: 0,
    'C#': 1,
    Db: 1,
    D: 2,
    'D#': 3,
    Eb: 3,
    E: 4,
    F: 5,
    'F#': 6,
    Gb: 6,
    G: 7,
    'G#': 8,
    Ab: 8,
    A: 9,
    'A#': 10,
    Bb: 10,
    B: 11,
  };

  const match = noteName.match(/^([A-Ga-g][#b]?)(-?\d+)$/);
  if (!match) return -1;

  const note = match[1].toUpperCase();
  const octave = parseInt(match[2], 10);

  if (!(note in noteMap)) return -1;

  return (octave + 1) * 12 + noteMap[note];
}

/**
 * Convert VexFlow key format to MIDI note number
 * @param vexflowKey VexFlow key like "c/4" or "c#/4"
 * @returns MIDI note number (0-127)
 */
export function vexflowKeyToMidi(vexflowKey: string): number {
  const parts = vexflowKey.split('/');
  if (parts.length !== 2) return -1;

  const noteName = parts[0].toUpperCase();
  const octave = parseInt(parts[1], 10);

  const noteMap: Record<string, number> = {
    C: 0,
    'C#': 1,
    D: 2,
    'D#': 3,
    E: 4,
    F: 5,
    'F#': 6,
    G: 7,
    'G#': 8,
    A: 9,
    'A#': 10,
    B: 11,
  };

  if (!(noteName in noteMap)) return -1;

  return (octave + 1) * 12 + noteMap[noteName];
}

/**
 * Create a PlayedNote from a MIDI event
 */
export function createPlayedNote(
  event: MIDIInputEvent,
  practiceStartTime: number
): PlayedNote {
  const id = `played_${event.timestamp}_${event.note}`;
  const noteName = midiNoteToName(event.note);
  const vexflowKey = midiNoteToVexFlow(event.note);
  const relativeStartTime = (event.timestamp - practiceStartTime) / 1000;

  return {
    id,
    midiNote: event.note,
    noteName,
    vexflowKey,
    velocity: event.velocity,
    startTime: relativeStartTime,
    endTime: null,
    duration: null,
  };
}

/**
 * Dispose of MIDI resources
 */
export function disposeMIDI(): void {
  disconnectFromDevice();
  removeAllCallbacks();

  if (midiAccess) {
    midiAccess.onstatechange = null;
    midiAccess = null;
  }
}
