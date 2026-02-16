/**
 * Arpeggio Store — state management for the arpeggio module
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ArpeggioType,
  ArpeggioPattern,
  ArpeggioInversion,
  ArpeggioMastery,
  ArpeggioHand,
} from '../types/arpeggio';

interface ArpeggioState {
  // Configuration
  selectedKey: string;
  chordType: ArpeggioType;
  pattern: ArpeggioPattern;
  inversion: ArpeggioInversion;
  octaves: 1 | 2;
  bars: 2 | 4 | 8;
  tempo: number;
  showFingering: boolean;
  level: number;
  hand: ArpeggioHand;

  // Progress (persisted)
  mastery: Record<string, ArpeggioMastery>;

  // Actions
  setSelectedKey: (key: string) => void;
  setChordType: (type: ArpeggioType) => void;
  setPattern: (pattern: ArpeggioPattern) => void;
  setInversion: (inversion: ArpeggioInversion) => void;
  setOctaves: (octaves: 1 | 2) => void;
  setBars: (bars: 2 | 4 | 8) => void;
  setTempo: (tempo: number) => void;
  setShowFingering: (show: boolean) => void;
  setLevel: (level: number) => void;
  setHand: (hand: ArpeggioHand) => void;
  recordMastery: (
    key: string,
    chordType: ArpeggioType,
    bpm: number,
    stars: number,
    pattern: ArpeggioPattern,
    inversion: ArpeggioInversion
  ) => void;
  getMastery: (key: string, chordType: ArpeggioType) => ArpeggioMastery | null;
}

function masteryKey(key: string, chordType: ArpeggioType): string {
  return `${key}_${chordType}`;
}

export const useArpeggioStore = create<ArpeggioState>()(
  persist(
    (set, get) => ({
      selectedKey: 'C',
      chordType: 'major',
      pattern: 'up',
      inversion: 0,
      octaves: 1,
      bars: 4,
      tempo: 60,
      showFingering: true,
      level: 3,
      hand: 'both',
      mastery: {},

      setSelectedKey: (key) => set({ selectedKey: key }),
      setChordType: (type) => set({ chordType: type }),
      setPattern: (pattern) => set({ pattern }),
      setInversion: (inversion) => set({ inversion }),
      setOctaves: (octaves) => set({ octaves }),
      setBars: (bars) => set({ bars }),
      setTempo: (tempo) => set({ tempo }),
      setShowFingering: (show) => set({ showFingering: show }),
      setLevel: (level) => set({ level }),
      setHand: (hand) => set({ hand }),

      recordMastery: (key, chordType, bpm, stars, pattern, inversion) => {
        const mk = masteryKey(key, chordType);
        const existing = get().mastery[mk];
        const updated: ArpeggioMastery = existing
          ? {
              bestBpm: Math.max(existing.bestBpm, bpm),
              stars: Math.max(existing.stars, stars),
              patterns: existing.patterns.includes(pattern)
                ? existing.patterns
                : [...existing.patterns, pattern],
              inversions: existing.inversions.includes(inversion)
                ? existing.inversions
                : [...existing.inversions, inversion],
            }
          : { bestBpm: bpm, stars, patterns: [pattern], inversions: [inversion] };

        set((state) => ({
          mastery: { ...state.mastery, [mk]: updated },
        }));
      },

      getMastery: (key, chordType) => {
        const mk = masteryKey(key, chordType);
        return get().mastery[mk] || null;
      },
    }),
    {
      name: 'clefbuddy-arpeggio',
      partialize: (state) => ({ mastery: state.mastery }),
    }
  )
);
