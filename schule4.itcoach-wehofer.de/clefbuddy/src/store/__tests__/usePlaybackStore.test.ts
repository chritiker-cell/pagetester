/**
 * Unit tests for usePlaybackStore
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { usePlaybackStore } from '../usePlaybackStore';
import { DEFAULT_PLAYBACK_CONFIG } from '../../types/playback';

describe('usePlaybackStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    usePlaybackStore.getState().reset();
    // Clear localStorage
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should have status stopped', () => {
      const store = usePlaybackStore;
      expect(store.getState().status).toBe('stopped');
    });

    it('should have tempo from DEFAULT_PLAYBACK_CONFIG', () => {
      const store = usePlaybackStore;
      expect(store.getState().config.tempo).toBe(DEFAULT_PLAYBACK_CONFIG.tempo);
    });

    it('should have default config values', () => {
      const store = usePlaybackStore;
      expect(store.getState().config.loop).toBe(true);
      expect(store.getState().config.metronomeEnabled).toBe(true);
      expect(store.getState().config.beatsPerMeasure).toBe(4);
      expect(store.getState().config.beatUnit).toBe(4);
    });

    it('should have initial metronome state', () => {
      const store = usePlaybackStore;
      expect(store.getState().metronome.isActive).toBe(false);
      expect(store.getState().metronome.currentBeat).toBe(1);
      expect(store.getState().metronome.beatType).toBe('downbeat');
    });
  });

  describe('play()', () => {
    it('should set status to playing', () => {
      const store = usePlaybackStore;
      store.getState().play();
      expect(store.getState().status).toBe('playing');
    });

    it('should ignore if already playing', () => {
      const store = usePlaybackStore;
      store.getState().play();
      expect(store.getState().status).toBe('playing');

      // Try to play again
      store.getState().play();
      expect(store.getState().status).toBe('playing');
    });

    it('should allow play from paused state', () => {
      const store = usePlaybackStore;
      store.setState({ status: 'paused' });
      store.getState().play();
      expect(store.getState().status).toBe('playing');
    });

    it('should allow play from stopped state', () => {
      const store = usePlaybackStore;
      expect(store.getState().status).toBe('stopped');
      store.getState().play();
      expect(store.getState().status).toBe('playing');
    });
  });

  describe('pause()', () => {
    it('should set status to paused', () => {
      const store = usePlaybackStore;
      store.getState().play();
      store.getState().pause();
      expect(store.getState().status).toBe('paused');
    });
  });

  describe('stop()', () => {
    it('should reset status to stopped', () => {
      const store = usePlaybackStore;
      store.getState().play();
      store.getState().stop();
      expect(store.getState().status).toBe('stopped');
    });

    it('should reset currentTime', () => {
      const store = usePlaybackStore;
      store.setState({ currentTime: 10.5 });
      store.getState().stop();
      expect(store.getState().currentTime).toBe(0);
    });

    it('should reset currentNoteIndex', () => {
      const store = usePlaybackStore;
      store.setState({ currentNoteIndex: 5 });
      store.getState().stop();
      expect(store.getState().currentNoteIndex).toBe(-1);
    });

    it('should reset currentBeat and currentMeasure', () => {
      const store = usePlaybackStore;
      store.setState({ currentBeat: 3, currentMeasure: 4 });
      store.getState().stop();
      expect(store.getState().currentBeat).toBe(0);
      expect(store.getState().currentMeasure).toBe(1);
    });

    it('should reset metronome to initial state', () => {
      const store = usePlaybackStore;
      store.setState({
        metronome: {
          isActive: true,
          currentBeat: 3,
          beatType: 'upbeat',
          beatsPerMeasure: 4,
        },
      });
      store.getState().stop();
      expect(store.getState().metronome.currentBeat).toBe(1);
      expect(store.getState().metronome.beatType).toBe('downbeat');
    });
  });

  describe('togglePlayPause()', () => {
    it('should pause when playing', () => {
      const store = usePlaybackStore;
      store.setState({ status: 'playing' });
      store.getState().togglePlayPause();
      expect(store.getState().status).toBe('paused');
    });

    it('should play when paused', () => {
      const store = usePlaybackStore;
      store.setState({ status: 'paused' });
      store.getState().togglePlayPause();
      expect(store.getState().status).toBe('playing');
    });

    it('should play when stopped', () => {
      const store = usePlaybackStore;
      expect(store.getState().status).toBe('stopped');
      store.getState().togglePlayPause();
      expect(store.getState().status).toBe('playing');
    });
  });

  describe('toggleLoop()', () => {
    it('should flip config.loop', () => {
      const store = usePlaybackStore;
      const initialLoop = store.getState().config.loop;
      store.getState().toggleLoop();
      expect(store.getState().config.loop).toBe(!initialLoop);
    });

    it('should toggle loop multiple times', () => {
      const store = usePlaybackStore;
      expect(store.getState().config.loop).toBe(true);
      store.getState().toggleLoop();
      expect(store.getState().config.loop).toBe(false);
      store.getState().toggleLoop();
      expect(store.getState().config.loop).toBe(true);
    });
  });

  describe('toggleMetronome()', () => {
    it('should flip config.metronomeEnabled', () => {
      const store = usePlaybackStore;
      const initialMetronome = store.getState().config.metronomeEnabled;
      store.getState().toggleMetronome();
      expect(store.getState().config.metronomeEnabled).toBe(!initialMetronome);
    });

    it('should update metronome.isActive to match', () => {
      const store = usePlaybackStore;
      expect(store.getState().config.metronomeEnabled).toBe(true);
      expect(store.getState().metronome.isActive).toBe(false);

      store.getState().toggleMetronome();
      expect(store.getState().config.metronomeEnabled).toBe(false);
      expect(store.getState().metronome.isActive).toBe(false);

      store.getState().toggleMetronome();
      expect(store.getState().config.metronomeEnabled).toBe(true);
      expect(store.getState().metronome.isActive).toBe(true);
    });
  });

  describe('setTempo()', () => {
    it('should update config.tempo', () => {
      const store = usePlaybackStore;
      store.getState().setTempo(120);
      expect(store.getState().config.tempo).toBe(120);
    });

    it('should allow different tempo values', () => {
      const store = usePlaybackStore;
      store.getState().setTempo(60);
      expect(store.getState().config.tempo).toBe(60);
      store.getState().setTempo(180);
      expect(store.getState().config.tempo).toBe(180);
    });
  });

  describe('setConfig()', () => {
    it('should merge partial config', () => {
      const store = usePlaybackStore;
      store.getState().setConfig({ tempo: 100, loop: false });
      expect(store.getState().config.tempo).toBe(100);
      expect(store.getState().config.loop).toBe(false);
      expect(store.getState().config.metronomeEnabled).toBe(true); // unchanged
    });

    it('should preserve unspecified config values', () => {
      const store = usePlaybackStore;
      const initialMetronome = store.getState().config.metronomeEnabled;
      store.getState().setConfig({ tempo: 90 });
      expect(store.getState().config.tempo).toBe(90);
      expect(store.getState().config.metronomeEnabled).toBe(initialMetronome);
    });
  });

  describe('setCurrentTime()', () => {
    it('should update currentTime', () => {
      const store = usePlaybackStore;
      store.getState().setCurrentTime(5.5);
      expect(store.getState().currentTime).toBe(5.5);
    });
  });

  describe('setCurrentNoteIndex()', () => {
    it('should update currentNoteIndex', () => {
      const store = usePlaybackStore;
      store.getState().setCurrentNoteIndex(3);
      expect(store.getState().currentNoteIndex).toBe(3);
    });
  });

  describe('setCurrentBeat()', () => {
    it('should update currentBeat and currentMeasure', () => {
      const store = usePlaybackStore;
      store.getState().setCurrentBeat(2, 3);
      expect(store.getState().currentBeat).toBe(2);
      expect(store.getState().currentMeasure).toBe(3);
    });
  });

  describe('setMetronomeBeat()', () => {
    it('should update metronome currentBeat and beatType for downbeat', () => {
      const store = usePlaybackStore;
      store.getState().setMetronomeBeat(1, true);
      expect(store.getState().metronome.currentBeat).toBe(1);
      expect(store.getState().metronome.beatType).toBe('downbeat');
    });

    it('should update metronome currentBeat and beatType for upbeat', () => {
      const store = usePlaybackStore;
      store.getState().setMetronomeBeat(3, false);
      expect(store.getState().metronome.currentBeat).toBe(3);
      expect(store.getState().metronome.beatType).toBe('upbeat');
    });
  });

  describe('setScheduledNotes()', () => {
    it('should update scheduledNotes', () => {
      const store = usePlaybackStore;
      const mockNotes = [
        {
          id: 'note-1',
          note: { keys: ['C/4'], duration: 'q', clef: 'treble' as const },
          barNumber: 1,
          noteIndex: 0,
          startTime: 0,
          durationSeconds: 0.5,
          midiPitches: [60],
          toneNotes: ['C4'],
          voice: 'treble' as const,
        },
      ];
      store.getState().setScheduledNotes(mockNotes);
      expect(store.getState().scheduledNotes).toEqual(mockNotes);
    });
  });

  describe('clearSchedule()', () => {
    it('should reset scheduledNotes, totalDuration, and currentNoteIndex', () => {
      const store = usePlaybackStore;
      const mockNotes = [
        {
          id: 'note-1',
          note: { keys: ['C/4'], duration: 'q', clef: 'treble' as const },
          barNumber: 1,
          noteIndex: 0,
          startTime: 0,
          durationSeconds: 0.5,
          midiPitches: [60],
          toneNotes: ['C4'],
          voice: 'treble' as const,
        },
      ];

      store.setState({
        scheduledNotes: mockNotes,
        totalDuration: 10,
        currentNoteIndex: 5,
      });

      store.getState().clearSchedule();

      expect(store.getState().scheduledNotes).toHaveLength(0);
      expect(store.getState().totalDuration).toBe(0);
      expect(store.getState().currentNoteIndex).toBe(-1);
    });
  });

  describe('setReady()', () => {
    it('should update isReady', () => {
      const store = usePlaybackStore;
      store.getState().setReady(true);
      expect(store.getState().isReady).toBe(true);
    });
  });

  describe('setError()', () => {
    it('should update error', () => {
      const store = usePlaybackStore;
      store.getState().setError('Test error');
      expect(store.getState().error).toBe('Test error');
    });

    it('should allow clearing error', () => {
      const store = usePlaybackStore;
      store.getState().setError('Test error');
      store.getState().setError(null);
      expect(store.getState().error).toBeNull();
    });
  });

  describe('reset()', () => {
    it('should reset all state to initial values', () => {
      const store = usePlaybackStore;

      // Change state
      store.setState({
        status: 'playing',
        currentTime: 5,
        currentNoteIndex: 3,
        currentBeat: 2,
        currentMeasure: 4,
      });

      // Reset
      store.getState().reset();

      expect(store.getState().status).toBe('stopped');
      expect(store.getState().currentTime).toBe(0);
      expect(store.getState().currentNoteIndex).toBe(-1);
      expect(store.getState().currentBeat).toBe(0);
      expect(store.getState().currentMeasure).toBe(1);
      expect(store.getState().metronome.currentBeat).toBe(1);
      expect(store.getState().metronome.beatType).toBe('downbeat');
    });
  });

  describe('localStorage persistence', () => {
    it('should persist only tempo (partialize)', () => {
      const store = usePlaybackStore;
      store.getState().setTempo(120);
      store.getState().toggleLoop();
      store.getState().toggleMetronome();

      const stored = localStorage.getItem('clefbuddy-playback');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      // Only tempo should be persisted
      expect(parsed.state.config.tempo).toBe(120);
      // Loop and metronomeEnabled should NOT be in persisted state
      expect(parsed.state.config.loop).toBeUndefined();
      expect(parsed.state.config.metronomeEnabled).toBeUndefined();
    });

    it('should restore tempo from localStorage on new store instance', () => {
      const store = usePlaybackStore;

      // Set tempo
      store.getState().setTempo(150);

      // Get stored value
      const stored = localStorage.getItem('clefbuddy-playback');
      expect(stored).not.toBeNull();

      // Reset store
      store.getState().reset();
      expect(store.getState().config.tempo).toBe(DEFAULT_PLAYBACK_CONFIG.tempo);

      // Manually restore (simulating persist rehydration with merge function)
      const parsed = JSON.parse(stored!);
      if (parsed.state?.config?.tempo) {
        store.setState({
          config: { ...store.getState().config, tempo: parsed.state.config.tempo },
        });
      }

      expect(store.getState().config.tempo).toBe(150);
    });

    it('should not persist status, currentTime, or other playback state', () => {
      const store = usePlaybackStore;

      store.setState({
        status: 'playing',
        currentTime: 5,
        currentNoteIndex: 3,
      });

      const stored = localStorage.getItem('clefbuddy-playback');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.status).toBeUndefined();
      expect(parsed.state.currentTime).toBeUndefined();
      expect(parsed.state.currentNoteIndex).toBeUndefined();
    });
  });
});
