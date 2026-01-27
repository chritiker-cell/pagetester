/**
 * Playback Store
 *
 * Zustand store for managing audio playback state.
 * Coordinates between UI and audio engine.
 */

import { create } from 'zustand';
import type {
  PlaybackState,
  PlaybackStatus,
  PlaybackConfig,
  ScheduledNote,
  MetronomeState,
} from '../types/playback';
import { DEFAULT_PLAYBACK_CONFIG } from '../types/playback';

interface PlaybackStore extends PlaybackState {
  // Metronome state
  metronome: MetronomeState;

  // Actions - Status
  setStatus: (status: PlaybackStatus) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlayPause: () => void;

  // Actions - Configuration
  setConfig: (config: Partial<PlaybackConfig>) => void;
  setTempo: (tempo: number) => void;
  toggleLoop: () => void;
  toggleMetronome: () => void;
  setCountIn: (measures: number) => void;

  // Actions - Playback position
  setCurrentTime: (time: number) => void;
  setCurrentNoteIndex: (index: number) => void;
  setCurrentBeat: (beat: number, measure: number) => void;

  // Actions - Exercise scheduling
  setScheduledNotes: (notes: ScheduledNote[]) => void;
  setTotalDuration: (duration: number) => void;
  clearSchedule: () => void;

  // Actions - Metronome
  setMetronomeBeat: (beat: number, isDownbeat: boolean) => void;

  // Actions - Initialization
  setReady: (ready: boolean) => void;
  setError: (error: string | null) => void;

  // Actions - Reset
  reset: () => void;
}

const initialState: PlaybackState = {
  status: 'stopped',
  currentTime: 0,
  totalDuration: 0,
  currentNoteIndex: -1,
  scheduledNotes: [],
  config: DEFAULT_PLAYBACK_CONFIG,
  currentBeat: 0,
  currentMeasure: 1,
  isReady: false,
  error: null,
};

const initialMetronome: MetronomeState = {
  isActive: false,
  currentBeat: 1,
  beatType: 'downbeat',
  beatsPerMeasure: 4,
};

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  ...initialState,
  metronome: initialMetronome,

  // Status actions
  setStatus: (status) => set({ status }),

  play: () => set({ status: 'playing' }),

  pause: () => set({ status: 'paused' }),

  stop: () =>
    set({
      status: 'stopped',
      currentTime: 0,
      currentNoteIndex: -1,
      currentBeat: 0,
      currentMeasure: 1,
      metronome: {
        ...get().metronome,
        currentBeat: 1,
        beatType: 'downbeat',
      },
    }),

  togglePlayPause: () => {
    const { status } = get();
    if (status === 'playing') {
      set({ status: 'paused' });
    } else {
      set({ status: 'playing' });
    }
  },

  // Configuration actions
  setConfig: (config) =>
    set((state) => ({
      config: { ...state.config, ...config },
    })),

  setTempo: (tempo) =>
    set((state) => ({
      config: { ...state.config, tempo },
    })),

  toggleLoop: () =>
    set((state) => ({
      config: { ...state.config, loop: !state.config.loop },
    })),

  toggleMetronome: () =>
    set((state) => ({
      config: {
        ...state.config,
        metronomeEnabled: !state.config.metronomeEnabled,
      },
      metronome: {
        ...state.metronome,
        isActive: !state.config.metronomeEnabled,
      },
    })),

  setCountIn: (measures) =>
    set((state) => ({
      config: { ...state.config, countIn: measures },
    })),

  // Playback position actions
  setCurrentTime: (currentTime) => set({ currentTime }),

  setCurrentNoteIndex: (currentNoteIndex) => set({ currentNoteIndex }),

  setCurrentBeat: (currentBeat, currentMeasure) =>
    set({ currentBeat, currentMeasure }),

  // Scheduling actions
  setScheduledNotes: (scheduledNotes) => set({ scheduledNotes }),

  setTotalDuration: (totalDuration) => set({ totalDuration }),

  clearSchedule: () =>
    set({
      scheduledNotes: [],
      totalDuration: 0,
      currentNoteIndex: -1,
    }),

  // Metronome actions
  setMetronomeBeat: (beat, isDownbeat) =>
    set((state) => ({
      metronome: {
        ...state.metronome,
        currentBeat: beat,
        beatType: isDownbeat ? 'downbeat' : 'upbeat',
      },
    })),

  // Initialization actions
  setReady: (isReady) => set({ isReady }),

  setError: (error) => set({ error }),

  // Reset
  reset: () =>
    set({
      ...initialState,
      metronome: initialMetronome,
    }),
}));
