/**
 * Unit tests for useNoteReaderSettingsStore
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useNoteReaderSettingsStore } from '../useNoteReaderSettingsStore';

describe('useNoteReaderSettingsStore', () => {
  beforeEach(() => {
    // Reset store to default values
    useNoteReaderSettingsStore.getState().resetDefaults();
    // Clear localStorage
    localStorage.clear();
  });

  describe('default values', () => {
    it('should have barCount default of 4', () => {
      const store = useNoteReaderSettingsStore;
      expect(store.getState().barCount).toBe(4);
    });

    it('should have timeSignature default of random', () => {
      const store = useNoteReaderSettingsStore;
      expect(store.getState().timeSignature).toBe('random');
    });

    it('should have showChordSymbols default of false', () => {
      const store = useNoteReaderSettingsStore;
      expect(store.getState().showChordSymbols).toBe(false);
    });

    it('should have showFingeringFirstNote default of true', () => {
      const store = useNoteReaderSettingsStore;
      expect(store.getState().showFingeringFirstNote).toBe(true);
    });

    it('should have showFingeringOnPositionChange default of true', () => {
      const store = useNoteReaderSettingsStore;
      expect(store.getState().showFingeringOnPositionChange).toBe(true);
    });

    it('should have metronomeDefaultOn default of true', () => {
      const store = useNoteReaderSettingsStore;
      expect(store.getState().metronomeDefaultOn).toBe(true);
    });

    it('should have loopDefaultOn default of true', () => {
      const store = useNoteReaderSettingsStore;
      expect(store.getState().loopDefaultOn).toBe(true);
    });

    it('should have countdownBeats default of 4', () => {
      const store = useNoteReaderSettingsStore;
      expect(store.getState().countdownBeats).toBe(4);
    });
  });

  describe('setSetting', () => {
    it('should update barCount', () => {
      const store = useNoteReaderSettingsStore;
      store.getState().setSetting('barCount', 8);
      expect(store.getState().barCount).toBe(8);
    });

    it('should update timeSignature', () => {
      const store = useNoteReaderSettingsStore;
      store.getState().setSetting('timeSignature', '3/4');
      expect(store.getState().timeSignature).toBe('3/4');
    });

    it('should update showChordSymbols', () => {
      const store = useNoteReaderSettingsStore;
      store.getState().setSetting('showChordSymbols', true);
      expect(store.getState().showChordSymbols).toBe(true);
    });

    it('should update showFingeringFirstNote', () => {
      const store = useNoteReaderSettingsStore;
      store.getState().setSetting('showFingeringFirstNote', false);
      expect(store.getState().showFingeringFirstNote).toBe(false);
    });

    it('should update showFingeringOnPositionChange', () => {
      const store = useNoteReaderSettingsStore;
      store.getState().setSetting('showFingeringOnPositionChange', false);
      expect(store.getState().showFingeringOnPositionChange).toBe(false);
    });

    it('should update metronomeDefaultOn', () => {
      const store = useNoteReaderSettingsStore;
      store.getState().setSetting('metronomeDefaultOn', false);
      expect(store.getState().metronomeDefaultOn).toBe(false);
    });

    it('should update loopDefaultOn', () => {
      const store = useNoteReaderSettingsStore;
      store.getState().setSetting('loopDefaultOn', false);
      expect(store.getState().loopDefaultOn).toBe(false);
    });

    it('should update countdownBeats', () => {
      const store = useNoteReaderSettingsStore;
      store.getState().setSetting('countdownBeats', 8);
      expect(store.getState().countdownBeats).toBe(8);
    });

    it('should only update specified setting', () => {
      const store = useNoteReaderSettingsStore;
      const initialBarCount = store.getState().barCount;
      const initialTimeSignature = store.getState().timeSignature;

      store.getState().setSetting('showChordSymbols', true);

      expect(store.getState().showChordSymbols).toBe(true);
      expect(store.getState().barCount).toBe(initialBarCount);
      expect(store.getState().timeSignature).toBe(initialTimeSignature);
    });

    it('should allow multiple settings updates', () => {
      const store = useNoteReaderSettingsStore;

      store.getState().setSetting('barCount', 6);
      store.getState().setSetting('timeSignature', '2/4');
      store.getState().setSetting('showChordSymbols', true);

      expect(store.getState().barCount).toBe(6);
      expect(store.getState().timeSignature).toBe('2/4');
      expect(store.getState().showChordSymbols).toBe(true);
    });
  });

  describe('resetDefaults', () => {
    it('should restore all default values', () => {
      const store = useNoteReaderSettingsStore;

      // Change all settings
      store.getState().setSetting('barCount', 16);
      store.getState().setSetting('timeSignature', '6/8');
      store.getState().setSetting('showChordSymbols', true);
      store.getState().setSetting('showFingeringFirstNote', false);
      store.getState().setSetting('showFingeringOnPositionChange', false);
      store.getState().setSetting('metronomeDefaultOn', false);
      store.getState().setSetting('loopDefaultOn', false);
      store.getState().setSetting('countdownBeats', 2);

      // Verify changes
      expect(store.getState().barCount).toBe(16);
      expect(store.getState().timeSignature).toBe('6/8');

      // Reset to defaults
      store.getState().resetDefaults();

      // Verify all defaults restored
      expect(store.getState().barCount).toBe(4);
      expect(store.getState().timeSignature).toBe('random');
      expect(store.getState().showChordSymbols).toBe(false);
      expect(store.getState().showFingeringFirstNote).toBe(true);
      expect(store.getState().showFingeringOnPositionChange).toBe(true);
      expect(store.getState().metronomeDefaultOn).toBe(true);
      expect(store.getState().loopDefaultOn).toBe(true);
      expect(store.getState().countdownBeats).toBe(4);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist all settings to localStorage', () => {
      const store = useNoteReaderSettingsStore;

      store.getState().setSetting('barCount', 8);
      store.getState().setSetting('timeSignature', '3/4');
      store.getState().setSetting('showChordSymbols', true);

      const stored = localStorage.getItem('clefbuddy-notereader-settings');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.barCount).toBe(8);
      expect(parsed.state.timeSignature).toBe('3/4');
      expect(parsed.state.showChordSymbols).toBe(true);
    });

    it('should persist boolean settings correctly', () => {
      const store = useNoteReaderSettingsStore;

      store.getState().setSetting('showFingeringFirstNote', false);
      store.getState().setSetting('metronomeDefaultOn', false);
      store.getState().setSetting('loopDefaultOn', false);

      const stored = localStorage.getItem('clefbuddy-notereader-settings');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.showFingeringFirstNote).toBe(false);
      expect(parsed.state.metronomeDefaultOn).toBe(false);
      expect(parsed.state.loopDefaultOn).toBe(false);
    });

    it('should restore settings from localStorage on new store instance', () => {
      const store = useNoteReaderSettingsStore;

      // Set custom values
      store.getState().setSetting('barCount', 12);
      store.getState().setSetting('timeSignature', '6/8');
      store.getState().setSetting('showChordSymbols', true);
      store.getState().setSetting('countdownBeats', 8);

      // Get stored value
      const stored = localStorage.getItem('clefbuddy-notereader-settings');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);

      // Reset to defaults
      store.getState().resetDefaults();

      expect(store.getState().barCount).toBe(4);
      expect(store.getState().timeSignature).toBe('random');

      // Manually restore (simulating persist rehydration)
      store.setState(parsed.state);

      expect(store.getState().barCount).toBe(12);
      expect(store.getState().timeSignature).toBe('6/8');
      expect(store.getState().showChordSymbols).toBe(true);
      expect(store.getState().countdownBeats).toBe(8);
    });

    it('should persist all eight settings', () => {
      const store = useNoteReaderSettingsStore;

      // Update all settings
      store.getState().setSetting('barCount', 10);
      store.getState().setSetting('timeSignature', '2/4');
      store.getState().setSetting('showChordSymbols', true);
      store.getState().setSetting('showFingeringFirstNote', false);
      store.getState().setSetting('showFingeringOnPositionChange', false);
      store.getState().setSetting('metronomeDefaultOn', false);
      store.getState().setSetting('loopDefaultOn', false);
      store.getState().setSetting('countdownBeats', 2);

      const stored = localStorage.getItem('clefbuddy-notereader-settings');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);

      // Verify all settings are persisted
      expect(parsed.state.barCount).toBe(10);
      expect(parsed.state.timeSignature).toBe('2/4');
      expect(parsed.state.showChordSymbols).toBe(true);
      expect(parsed.state.showFingeringFirstNote).toBe(false);
      expect(parsed.state.showFingeringOnPositionChange).toBe(false);
      expect(parsed.state.metronomeDefaultOn).toBe(false);
      expect(parsed.state.loopDefaultOn).toBe(false);
      expect(parsed.state.countdownBeats).toBe(2);
    });
  });

  describe('type safety', () => {
    it('should accept valid timeSignature values', () => {
      const store = useNoteReaderSettingsStore;

      store.getState().setSetting('timeSignature', '4/4');
      expect(store.getState().timeSignature).toBe('4/4');

      store.getState().setSetting('timeSignature', '3/4');
      expect(store.getState().timeSignature).toBe('3/4');

      store.getState().setSetting('timeSignature', '2/4');
      expect(store.getState().timeSignature).toBe('2/4');

      store.getState().setSetting('timeSignature', '6/8');
      expect(store.getState().timeSignature).toBe('6/8');

      store.getState().setSetting('timeSignature', 'random');
      expect(store.getState().timeSignature).toBe('random');
    });

    it('should accept valid countdownBeats values', () => {
      const store = useNoteReaderSettingsStore;

      store.getState().setSetting('countdownBeats', 2);
      expect(store.getState().countdownBeats).toBe(2);

      store.getState().setSetting('countdownBeats', 4);
      expect(store.getState().countdownBeats).toBe(4);

      store.getState().setSetting('countdownBeats', 8);
      expect(store.getState().countdownBeats).toBe(8);
    });
  });
});
