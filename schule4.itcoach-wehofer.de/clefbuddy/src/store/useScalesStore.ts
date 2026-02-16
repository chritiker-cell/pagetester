/**
 * Scales Store — state management for the scales module
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScaleType, ScaleMode, ScaleMastery, PolyrhythmVariant, ThirdsVariant } from '../types/scales';
import { type KeyGroup, getKeysForGroup } from '../data/scaleData';

interface ScalesState {
  // Configuration
  selectedKey: string;
  scaleType: ScaleType;
  mode: ScaleMode;
  octaves: 1 | 2;
  tempo: number;
  showFingering: boolean;
  showKeyOnSheet: boolean;
  level: number;

  // Mode-specific variants
  polyrhythmVariant: PolyrhythmVariant;
  thirdsVariant: ThirdsVariant;

  // Playback defaults
  metronomeDefaultOn: boolean;
  loopDefaultOn: boolean;

  // Key group navigation
  selectedKeyGroup: KeyGroup;
  keyGroupIndex: number;

  // Progress (persisted)
  mastery: Record<string, ScaleMastery>;

  // Actions
  setSelectedKey: (key: string) => void;
  setScaleType: (type: ScaleType) => void;
  setMode: (mode: ScaleMode) => void;
  setOctaves: (octaves: 1 | 2) => void;
  setTempo: (tempo: number) => void;
  setShowFingering: (show: boolean) => void;
  setShowKeyOnSheet: (show: boolean) => void;
  setLevel: (level: number) => void;
  setPolyrhythmVariant: (variant: PolyrhythmVariant) => void;
  setThirdsVariant: (variant: ThirdsVariant) => void;
  setMetronomeDefaultOn: (v: boolean) => void;
  setLoopDefaultOn: (v: boolean) => void;
  setSelectedKeyGroup: (group: KeyGroup) => void;
  setKeyGroupIndex: (index: number) => void;
  recordMastery: (key: string, scaleType: ScaleType, bpm: number, stars: number, mode: ScaleMode) => void;
  getMastery: (key: string, scaleType: ScaleType) => ScaleMastery | null;
}

function masteryKey(key: string, scaleType: ScaleType): string {
  return `${key}_${scaleType}`;
}

export const useScalesStore = create<ScalesState>()(
  persist(
    (set, get) => ({
      selectedKey: 'C',
      scaleType: 'major',
      mode: 'parallel',
      octaves: 1,
      tempo: 60,
      showFingering: true,
      showKeyOnSheet: true,
      level: 3,
      polyrhythmVariant: '2:1-rh',
      thirdsVariant: 'harmonic',
      metronomeDefaultOn: true,
      loopDefaultOn: false,
      selectedKeyGroup: 1 as KeyGroup,
      keyGroupIndex: 0,
      mastery: {},

      setSelectedKey: (key) => set({ selectedKey: key }),
      setScaleType: (type) => {
        // When scale type changes, reset key group index and select first key of new type
        const keys = getKeysForGroup(type, get().selectedKeyGroup);
        set({
          scaleType: type,
          keyGroupIndex: 0,
          selectedKey: keys[0] || 'C',
        });
      },
      setMode: (mode) => set({ mode }),
      setOctaves: (octaves) => set({ octaves }),
      setTempo: (tempo) => set({ tempo }),
      setShowFingering: (show) => set({ showFingering: show }),
      setShowKeyOnSheet: (show) => set({ showKeyOnSheet: show }),
      setLevel: (level) => set({ level }),
      setPolyrhythmVariant: (variant) => set({ polyrhythmVariant: variant }),
      setThirdsVariant: (variant) => set({ thirdsVariant: variant }),
      setMetronomeDefaultOn: (v) => set({ metronomeDefaultOn: v }),
      setLoopDefaultOn: (v) => set({ loopDefaultOn: v }),
      setSelectedKeyGroup: (group) => {
        // When group changes, reset index and select first key
        const keys = getKeysForGroup(get().scaleType, group);
        set({
          selectedKeyGroup: group,
          keyGroupIndex: 0,
          selectedKey: keys[0] || 'C',
        });
      },
      setKeyGroupIndex: (index) => set({ keyGroupIndex: index }),

      recordMastery: (key, scaleType, bpm, stars, mode) => {
        const mk = masteryKey(key, scaleType);
        const existing = get().mastery[mk];
        const updated: ScaleMastery = existing
          ? {
              bestBpm: Math.max(existing.bestBpm, bpm),
              stars: Math.max(existing.stars, stars),
              modes: existing.modes.includes(mode) ? existing.modes : [...existing.modes, mode],
            }
          : { bestBpm: bpm, stars, modes: [mode] };

        set((state) => ({
          mastery: { ...state.mastery, [mk]: updated },
        }));
      },

      getMastery: (key, scaleType) => {
        const mk = masteryKey(key, scaleType);
        return get().mastery[mk] || null;
      },
    }),
    {
      name: 'clefbuddy-scales',
      version: 1,
      partialize: (state) => ({ mastery: state.mastery }),
      migrate: (persisted, version) => {
        if (version === 0) {
          // Migrate 'articulation' → 'thirds' in mastery modes
          const state = persisted as { mastery: Record<string, { modes?: string[] }> };
          if (state.mastery) {
            for (const key of Object.keys(state.mastery)) {
              const m = state.mastery[key];
              if (m.modes) {
                m.modes = m.modes.map(mode =>
                  mode === 'articulation' ? 'thirds' : mode
                );
              }
            }
          }
        }
        return persisted;
      },
    }
  )
);
