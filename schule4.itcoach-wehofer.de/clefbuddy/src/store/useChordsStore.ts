/**
 * Chords Store — mode-based state management
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChordMode, KeyGroup, ChordMastery } from '../types/chords';

interface ChordsState {
  // Config
  mode: ChordMode;
  keyGroup: KeyGroup;
  timeSignature: '4/4' | '3/4' | '6/8' | 'random';
  barCount: number;
  showFingering: boolean;
  showChordNames: boolean;

  // Progress
  mastery: Record<string, ChordMastery>;

  // Actions
  setMode: (m: ChordMode) => void;
  setKeyGroup: (g: KeyGroup) => void;
  setTimeSignature: (ts: '4/4' | '3/4' | '6/8' | 'random') => void;
  setBarCount: (c: number) => void;
  setShowFingering: (v: boolean) => void;
  setShowChordNames: (v: boolean) => void;
  recordMastery: (key: string, mode: ChordMode, bpm: number, stars: number) => void;
}

export const useChordsStore = create<ChordsState>()(
  persist(
    (set, get) => ({
      mode: 'block-chords',
      keyGroup: 1,
      timeSignature: '4/4',
      barCount: 4,
      showFingering: false,
      showChordNames: false,
      mastery: {},

      setMode: (mode) => set({ mode }),
      setKeyGroup: (keyGroup) => set({ keyGroup }),
      setTimeSignature: (timeSignature) => set({ timeSignature }),
      setBarCount: (barCount) => set({ barCount }),
      setShowFingering: (showFingering) => set({ showFingering }),
      setShowChordNames: (showChordNames) => set({ showChordNames }),

      recordMastery: (key, mode, bpm, stars) => {
        const id = `${key}_${mode}`;
        const existing = get().mastery[id];
        const updated: ChordMastery = existing
          ? { bestBpm: Math.max(existing.bestBpm, bpm), stars: Math.max(existing.stars, stars), mode }
          : { bestBpm: bpm, stars, mode };
        set(state => ({ mastery: { ...state.mastery, [id]: updated } }));
      },
    }),
    {
      name: 'clefbuddy-chords',
      partialize: (state) => ({
        mastery: state.mastery,
        mode: state.mode,
        keyGroup: state.keyGroup,
        showFingering: state.showFingering,
        showChordNames: state.showChordNames,
      }),
    }
  )
);
