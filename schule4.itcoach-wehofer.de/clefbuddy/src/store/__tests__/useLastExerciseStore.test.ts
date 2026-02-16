/**
 * Unit tests for useLastExerciseStore
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useLastExerciseStore } from '../useLastExerciseStore';
import type { LastExerciseConfig } from '../useLastExerciseStore';

describe('useLastExerciseStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useLastExerciseStore.setState({
      configs: [],
      continueDifficulty: null,
    });
    // Clear localStorage
    localStorage.clear();
  });

  describe('saveConfig', () => {
    it('should add config to front of list', () => {
      const store = useLastExerciseStore;
      const config: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };

      store.getState().saveConfig(config);

      expect(store.getState().configs).toHaveLength(1);
      expect(store.getState().configs[0]).toEqual(config);
    });

    it('should prepend new config and keep older configs', () => {
      const store = useLastExerciseStore;
      const config1: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };
      const config2: LastExerciseConfig = {
        difficulty: 2,
        keyStage: 2,
        timeSignature: '3/4',
        barCount: 8,
        tempo: 100,
      };

      store.getState().saveConfig(config1);
      store.getState().saveConfig(config2);

      expect(store.getState().configs).toHaveLength(2);
      expect(store.getState().configs[0]).toEqual(config2);
      expect(store.getState().configs[1]).toEqual(config1);
    });

    it('should deduplicate by difficulty (replaces existing)', () => {
      const store = useLastExerciseStore;
      const config1: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };
      const config2: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 2,
        timeSignature: '3/4',
        barCount: 8,
        tempo: 100,
      };

      store.getState().saveConfig(config1);
      store.getState().saveConfig(config2);

      expect(store.getState().configs).toHaveLength(1);
      expect(store.getState().configs[0]).toEqual(config2);
    });

    it('should replace existing config with same difficulty', () => {
      const store = useLastExerciseStore;
      const config1: LastExerciseConfig = {
        difficulty: 2,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };
      const config2: LastExerciseConfig = {
        difficulty: 3,
        keyStage: 2,
        timeSignature: '3/4',
        barCount: 6,
        tempo: 90,
      };
      const config3: LastExerciseConfig = {
        difficulty: 2,
        keyStage: 3,
        timeSignature: '2/4',
        barCount: 8,
        tempo: 120,
      };

      store.getState().saveConfig(config1);
      store.getState().saveConfig(config2);
      store.getState().saveConfig(config3);

      expect(store.getState().configs).toHaveLength(2);
      expect(store.getState().configs[0]).toEqual(config3);
      expect(store.getState().configs[1]).toEqual(config2);
    });
  });

  describe('removeConfig', () => {
    it('should remove config by difficulty', () => {
      const store = useLastExerciseStore;
      const config1: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };
      const config2: LastExerciseConfig = {
        difficulty: 2,
        keyStage: 2,
        timeSignature: '3/4',
        barCount: 8,
        tempo: 100,
      };

      store.getState().saveConfig(config1);
      store.getState().saveConfig(config2);
      store.getState().removeConfig(1);

      expect(store.getState().configs).toHaveLength(1);
      expect(store.getState().configs[0].difficulty).toBe(2);
    });

    it('should do nothing if config does not exist', () => {
      const store = useLastExerciseStore;
      const config: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };

      store.getState().saveConfig(config);
      store.getState().removeConfig(2);

      expect(store.getState().configs).toHaveLength(1);
      expect(store.getState().configs[0]).toEqual(config);
    });
  });

  describe('config getter (via configs[0])', () => {
    it('should have no configs when array is empty', () => {
      const store = useLastExerciseStore;
      expect(store.getState().configs).toHaveLength(0);
    });

    it('should have most recent config at index 0', () => {
      const store = useLastExerciseStore;
      const config1: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };
      const config2: LastExerciseConfig = {
        difficulty: 2,
        keyStage: 2,
        timeSignature: '3/4',
        barCount: 8,
        tempo: 100,
      };

      store.getState().saveConfig(config1);
      store.getState().saveConfig(config2);

      // configs[0] is the most recently saved config
      expect(store.getState().configs[0]).toEqual(config2);
    });
  });

  describe('continue difficulty management', () => {
    it('should set continue difficulty', () => {
      const store = useLastExerciseStore;
      store.getState().setShouldContinue(3);

      expect(store.getState().continueDifficulty).toBe(3);
    });

    it('should clear continue difficulty', () => {
      const store = useLastExerciseStore;
      store.getState().setShouldContinue(3);
      store.getState().clearContinue();

      expect(store.getState().continueDifficulty).toBeNull();
    });
  });

  describe('getConfigForContinue', () => {
    it('should return matching config when continueDifficulty is set', () => {
      const store = useLastExerciseStore;
      const config1: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };
      const config2: LastExerciseConfig = {
        difficulty: 2,
        keyStage: 2,
        timeSignature: '3/4',
        barCount: 8,
        tempo: 100,
      };

      store.getState().saveConfig(config1);
      store.getState().saveConfig(config2);
      store.getState().setShouldContinue(1);

      const result = store.getState().getConfigForContinue();
      expect(result).toEqual(config1);
    });

    it('should return undefined when continueDifficulty is null', () => {
      const store = useLastExerciseStore;
      const config: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };

      store.getState().saveConfig(config);

      const result = store.getState().getConfigForContinue();
      expect(result).toBeUndefined();
    });

    it('should return undefined when no matching config exists', () => {
      const store = useLastExerciseStore;
      const config: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };

      store.getState().saveConfig(config);
      store.getState().setShouldContinue(2);

      const result = store.getState().getConfigForContinue();
      expect(result).toBeUndefined();
    });
  });

  describe('localStorage persistence', () => {
    it('should persist configs to localStorage', () => {
      const store = useLastExerciseStore;
      const config: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };

      store.getState().saveConfig(config);

      const stored = localStorage.getItem('clefbuddy-last-exercise');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.configs).toHaveLength(1);
      expect(parsed.state.configs[0]).toEqual(config);
    });

    it('should not persist continueDifficulty (partialize)', () => {
      const store = useLastExerciseStore;
      const config: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };

      store.getState().saveConfig(config);
      store.getState().setShouldContinue(1);

      const stored = localStorage.getItem('clefbuddy-last-exercise');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.continueDifficulty).toBeUndefined();
      expect(parsed.state.configs).toBeDefined();
    });

    it('should restore configs from localStorage on new store instance', () => {
      // Save config
      const config: LastExerciseConfig = {
        difficulty: 1,
        keyStage: 1,
        timeSignature: '4/4',
        barCount: 4,
        tempo: 80,
      };
      useLastExerciseStore.getState().saveConfig(config);

      // Simulate new store instance by manually reading localStorage
      const stored = localStorage.getItem('clefbuddy-last-exercise');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.configs).toHaveLength(1);
      expect(parsed.state.configs[0]).toEqual(config);

      // Reset store state and trigger rehydration
      useLastExerciseStore.setState({
        configs: [],
        continueDifficulty: null,
      });

      // Manually restore from localStorage (simulating persist rehydration)
      useLastExerciseStore.setState({
        configs: parsed.state.configs,
      });

      expect(useLastExerciseStore.getState().configs).toHaveLength(1);
      expect(useLastExerciseStore.getState().configs[0]).toEqual(config);
    });
  });
});
