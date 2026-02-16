import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty, TimeSignatureOption, KeyStage } from '../utils/exerciseGenerator';

export interface LastExerciseConfig {
  difficulty: Difficulty;
  keyStage: KeyStage;
  timeSignature: TimeSignatureOption;
  barCount: number;
  tempo: number;
}

interface LastExerciseStore {
  configs: LastExerciseConfig[];
  continueDifficulty: Difficulty | null;
  /** Compat getter — returns newest config */
  config: LastExerciseConfig | null;
  saveConfig: (config: LastExerciseConfig) => void;
  removeConfig: (difficulty: Difficulty) => void;
  setShouldContinue: (difficulty: Difficulty) => void;
  clearContinue: () => void;
  getConfigForContinue: () => LastExerciseConfig | undefined;
}

export const useLastExerciseStore = create<LastExerciseStore>()(
  persist(
    (set, get) => ({
      configs: [],
      continueDifficulty: null,
      get config() {
        return get().configs[0] || null;
      },
      saveConfig: (config) => set((state) => {
        const filtered = state.configs.filter(c => c.difficulty !== config.difficulty);
        return { configs: [config, ...filtered] };
      }),
      removeConfig: (difficulty) => set((state) => ({
        configs: state.configs.filter(c => c.difficulty !== difficulty),
      })),
      setShouldContinue: (difficulty) => set({ continueDifficulty: difficulty }),
      clearContinue: () => set({ continueDifficulty: null }),
      getConfigForContinue: () => {
        const state = get();
        return state.configs.find(c => c.difficulty === state.continueDifficulty);
      },
    }),
    {
      name: 'clefbuddy-last-exercise',
      partialize: (state) => ({ configs: state.configs }) as unknown as LastExerciseStore,
    }
  )
);
