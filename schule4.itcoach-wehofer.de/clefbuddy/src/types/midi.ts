/**
 * TypeScript types for MIDI input functionality
 * Used with Web MIDI API for keyboard input detection
 */

/**
 * MIDI message types we care about
 */
export type MIDIMessageType = 'noteon' | 'noteoff' | 'controlchange';

/**
 * A single MIDI input event
 */
export interface MIDIInputEvent {
  /** MIDI message type */
  type: MIDIMessageType;

  /** MIDI note number (0-127) or CC number for control change */
  note: number;

  /** Velocity (0-127, 0 = note off) or CC value for control change */
  velocity: number;

  /** Timestamp when the event was received */
  timestamp: number;

  /** MIDI channel (0-15) */
  channel: number;
}

/**
 * MIDI Control Change event
 */
export interface MIDIControlChangeEvent {
  /** Control change number (0-127) */
  cc: number;

  /** Control value (0-127) */
  value: number;

  /** Timestamp when the event was received */
  timestamp: number;

  /** MIDI channel (0-15) */
  channel: number;
}

/**
 * MIDI CC numbers
 */
export const MIDI_CC = {
  /** Sustain Pedal (Damper Pedal) */
  SUSTAIN_PEDAL: 64,
  /** Sostenuto Pedal */
  SOSTENUTO: 66,
  /** Soft Pedal (Una Corda) */
  SOFT_PEDAL: 67,
} as const;

/**
 * A played note with timing information
 */
export interface PlayedNote {
  /** Unique identifier */
  id: string;

  /** MIDI note number */
  midiNote: number;

  /** Scientific pitch notation (e.g., "C4") */
  noteName: string;

  /** VexFlow format key (e.g., "c/4") */
  vexflowKey: string;

  /** Velocity when played */
  velocity: number;

  /** Time when note was pressed (relative to practice start) */
  startTime: number;

  /** Time when note was released (null if still held) */
  endTime: number | null;

  /** Duration in seconds (calculated when released) */
  duration: number | null;
}

/**
 * MIDI device information
 */
export interface MIDIDevice {
  /** Unique device ID */
  id: string;

  /** Device name */
  name: string;

  /** Device manufacturer */
  manufacturer: string;

  /** Connection state */
  state: 'connected' | 'disconnected';

  /** Device type */
  type: 'input' | 'output';
}

/**
 * MIDI connection status
 */
export type MIDIConnectionStatus =
  | 'disconnected'
  | 'requesting'
  | 'connected'
  | 'error'
  | 'unsupported';

/**
 * MIDI state managed by the store
 */
export interface MIDIState {
  /** Current connection status */
  connectionStatus: MIDIConnectionStatus;

  /** Available MIDI input devices */
  availableDevices: MIDIDevice[];

  /** Currently selected device ID */
  selectedDeviceId: string | null;

  /** Notes currently being held down */
  activeNotes: Map<number, PlayedNote>;

  /** All notes played during current practice session */
  playedNotes: PlayedNote[];

  /** Whether MIDI input is actively listening */
  isListening: boolean;

  /** Error message if connection failed */
  error: string | null;

  /** Timestamp when practice session started */
  practiceStartTime: number | null;
}

/**
 * MIDI note range for validation
 */
export interface MIDINoteRange {
  /** Lowest valid MIDI note */
  min: number;

  /** Highest valid MIDI note */
  max: number;
}

/**
 * Standard piano range
 */
export const PIANO_NOTE_RANGE: MIDINoteRange = {
  min: 21, // A0
  max: 108, // C8
};

/**
 * Default note range for exercises (middle C range)
 */
export const DEFAULT_NOTE_RANGE: MIDINoteRange = {
  min: 48, // C3
  max: 84, // C6
};
