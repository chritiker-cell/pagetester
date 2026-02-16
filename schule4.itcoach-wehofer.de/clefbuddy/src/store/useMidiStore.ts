/**
 * MIDI Store
 *
 * Zustand store for managing MIDI input state.
 * Coordinates between UI and MIDI engine.
 */

import { create } from 'zustand';
import type {
  MIDIState,
  MIDIInputEvent,
} from '../types/midi';
import {
  initMIDIEngine,
  connectToDevice,
  disconnectFromDevice,
  getAvailableDevices,
  onNoteOn,
  onNoteOff,
  onDeviceChange,
  onDirectAudio,
  onDirectAudioRelease,
  createPlayedNote,
  disposeMIDI,
  isMIDIInitialized,
} from '../utils/midiEngine';
import { isWebMIDISupported, getMIDIErrorMessage } from '../utils/midiCompat';
import {
  isAudioReady,
  initAudioEngine,
  triggerNoteAttack,
  triggerNoteRelease,
  releaseAllLiveInput,
} from '../utils/audioEngine';
import * as Tone from 'tone';

interface MIDIStore extends MIDIState {
  // Actions - Connection
  requestAccess: () => Promise<boolean>;
  selectDevice: (deviceId: string) => boolean;
  disconnect: () => void;
  refreshDevices: () => void;

  // Actions - Practice session
  startListening: () => void;
  stopListening: () => void;
  clearPlayedNotes: () => void;

  // Actions - Note handling
  handleNoteOn: (event: MIDIInputEvent) => void;
  handleNoteOff: (event: MIDIInputEvent) => void;

  // Actions - Reset
  reset: () => void;
  dispose: () => void;
}

const initialState: MIDIState = {
  connectionStatus: 'disconnected',
  availableDevices: [],
  selectedDeviceId: null,
  activeNotes: new Map(),
  playedNotes: [],
  isListening: false,
  error: null,
  practiceStartTime: null,
};

export const useMidiStore = create<MIDIStore>((set, get) => ({
  ...initialState,

  // Request MIDI access and get available devices
  requestAccess: async () => {
    if (!isWebMIDISupported()) {
      set({
        connectionStatus: 'unsupported',
        error:
          'Web MIDI wird in diesem Browser nicht unterstützt. Verwende Chrome, Edge oder Opera.',
      });
      return false;
    }

    set({ connectionStatus: 'requesting', error: null });

    try {
      const devices = await initMIDIEngine();

      // Set up device change listener
      onDeviceChange((newDevices) => {
        set({ availableDevices: newDevices });
      });

      set({
        connectionStatus: devices.length > 0 ? 'connected' : 'disconnected',
        availableDevices: devices,
        error:
          devices.length === 0
            ? 'Keine MIDI-Geräte gefunden. Bitte schließe ein MIDI-Keyboard an.'
            : null,
      });

      // Auto-select first device if available
      if (devices.length > 0) {
        const { selectDevice } = get();
        selectDevice(devices[0].id);
      }

      return true;
    } catch (error) {
      set({
        connectionStatus: 'error',
        error: getMIDIErrorMessage(error),
      });
      return false;
    }
  },

  // Select and connect to a MIDI device
  selectDevice: (deviceId: string) => {
    const success = connectToDevice(deviceId);

    if (success) {
      set({
        selectedDeviceId: deviceId,
        connectionStatus: 'connected',
        error: null,
      });

      // Initialize audio engine for MIDI sound playback
      if (!isAudioReady()) {
        initAudioEngine().catch(console.error);
      }

      // CRITICAL: Set up DIRECT audio callback for ultra-low latency
      // This triggers audio IMMEDIATELY in the MIDI event handler
      // Bypasses React state updates for minimal latency
      onDirectAudio((noteName: string, velocity: number) => {
        if (Tone.context.state === 'running') {
          triggerNoteAttack(noteName, velocity);
        }
      });

      // CRITICAL: Set up DIRECT audio release callback for low latency
      onDirectAudioRelease((noteName: string) => {
        if (Tone.context.state === 'running') {
          triggerNoteRelease(noteName);
        }
      });

      // Sustain pedal: CC64 ignored (no sustain support)

      // Set up note handlers (for practice mode and UI updates)
      const { handleNoteOn, handleNoteOff } = get();
      onNoteOn(handleNoteOn);
      onNoteOff(handleNoteOff);
    } else {
      set({
        error: 'Konnte keine Verbindung zum MIDI-Gerät herstellen.',
      });
    }

    return success;
  },

  // Disconnect from current device
  disconnect: () => {
    releaseAllLiveInput();
    disconnectFromDevice();
    set({
      selectedDeviceId: null,
      connectionStatus: isMIDIInitialized() ? 'connected' : 'disconnected',
      activeNotes: new Map(),
    });
  },

  // Refresh device list
  refreshDevices: () => {
    const devices = getAvailableDevices();
    set({
      availableDevices: devices,
      error:
        devices.length === 0
          ? 'Keine MIDI-Geräte gefunden. Bitte schließe ein MIDI-Keyboard an.'
          : null,
    });
  },

  // Start listening for MIDI input
  startListening: () => {
    const now = performance.now();
    set({
      isListening: true,
      practiceStartTime: now,
      playedNotes: [],
      activeNotes: new Map(),
    });
  },

  // Stop listening for MIDI input
  stopListening: () => {
    releaseAllLiveInput();
    set({
      isListening: false,
    });
  },

  // Clear recorded notes
  clearPlayedNotes: () => {
    set({
      playedNotes: [],
      activeNotes: new Map(),
    });
  },

  // Handle note on event
  handleNoteOn: (event: MIDIInputEvent) => {
    const { isListening, practiceStartTime, activeNotes, playedNotes } = get();

    // NOTE: Audio is now triggered DIRECTLY in midiEngine via directAudioCallback
    // This happens BEFORE this callback is called, resulting in ultra-low latency
    // No need to call playNotesImmediate here anymore

    if (!isListening || practiceStartTime === null) return;

    const playedNote = createPlayedNote(event, practiceStartTime);

    // Add to active notes
    const newActiveNotes = new Map(activeNotes);
    newActiveNotes.set(event.note, playedNote);

    // Add to played notes list
    const newPlayedNotes = [...playedNotes, playedNote];

    set({
      activeNotes: newActiveNotes,
      playedNotes: newPlayedNotes,
    });
  },

  // Handle note off event
  handleNoteOff: (event: MIDIInputEvent) => {
    const { isListening, practiceStartTime, activeNotes, playedNotes } = get();

    if (!isListening || practiceStartTime === null) return;

    const activeNote = activeNotes.get(event.note);
    if (!activeNote) return;

    const endTime = (event.timestamp - practiceStartTime) / 1000;
    const duration = endTime - activeNote.startTime;

    // Update the played note with end time and duration
    const updatedPlayedNotes = playedNotes.map((note) =>
      note.id === activeNote.id ? { ...note, endTime, duration } : note
    );

    // Remove from active notes
    const newActiveNotes = new Map(activeNotes);
    newActiveNotes.delete(event.note);

    set({
      activeNotes: newActiveNotes,
      playedNotes: updatedPlayedNotes,
    });
  },

  // Reset state
  reset: () => {
    set({
      ...initialState,
      availableDevices: get().availableDevices,
      connectionStatus: get().connectionStatus,
    });
  },

  // Dispose and cleanup
  dispose: () => {
    disposeMIDI();
    set(initialState);
  },
}));
