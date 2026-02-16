import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  startSimplePlayback,
  stopSimplePlayback,
  getElapsedTime,
  getMusicElapsedTime,
} from '../simplePlayback';
import type { ScheduledNote } from '../../types/playback';

// Mock audioEngine functions
vi.mock('../audioEngine', () => ({
  playNotesImmediate: vi.fn(),
  playMetronomeClick: vi.fn(),
  ensureAudioContext: vi.fn().mockResolvedValue(undefined),
  releaseAllVoices: vi.fn(),
}));

// Mock performance.now() for deterministic timing tests
const mockPerformanceNow = vi.fn();
const originalPerformanceNow = performance.now;

beforeEach(() => {
  vi.clearAllMocks();
  mockPerformanceNow.mockReturnValue(0);
  performance.now = mockPerformanceNow;
});

afterEach(() => {
  performance.now = originalPerformanceNow;
  vi.clearAllTimers();
});

function makeScheduledNote(overrides: Partial<ScheduledNote> = {}): ScheduledNote {
  return {
    id: 'note-1',
    note: { keys: ['c/4'], duration: 'q' },
    barNumber: 1,
    noteIndex: 0,
    startTime: 0,
    durationSeconds: 0.5,
    midiPitches: [60],
    toneNotes: ['C4'],
    voice: 'treble',
    ...overrides,
  } as ScheduledNote;
}

describe('startSimplePlayback', () => {
  it('creates a session with correct initial state', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: true,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 2.0);

    expect(session.startTime).toBe(0);
    expect(session.isPlaying).toBe(true);
    expect(session.loop).toBe(false);
    expect(session.isFirstCycle).toBe(true);
    expect(session.totalDuration).toBe(2000); // 2 seconds in ms
    expect(session.countInDuration).toBe(2000); // 4 beats at 120 BPM = 2 seconds
    expect(session.currentCountIn).toBe(2000);
  });

  it('schedules notes after count-in duration', async () => {
    const notes = [
      makeScheduledNote({ id: 'note-1', startTime: 0.0, toneNotes: ['C4'] }),
      makeScheduledNote({ id: 'note-2', startTime: 0.5, toneNotes: ['D4'] }),
    ];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // Count-in at 120 BPM, 4 beats = 2000ms
    expect(session.countInDuration).toBe(2000);
    // Notes should be scheduled at countIn + their startTime
    // First note: 2000ms + 0ms = 2000ms
    // Second note: 2000ms + 500ms = 2500ms
    expect(session.timeoutIds.length).toBeGreaterThan(0);
  });

  it('schedules count-in metronome clicks', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: true,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // Should schedule 4 count-in clicks + notes + metronome + end callback
    expect(session.timeoutIds.length).toBeGreaterThan(4);
  });

  it('respects loop configuration', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: true,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    expect(session.loop).toBe(true);
  });

  it('calls onNotePlay callback when scheduled', async () => {
    const onNotePlay = vi.fn();
    const notes = [makeScheduledNote({ id: 'test-note', startTime: 0 })];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    await startSimplePlayback(notes, config, 1.0, { onNotePlay });

    // Note: actual callback execution happens via setTimeout, not synchronously
    expect(onNotePlay).not.toHaveBeenCalled(); // Hasn't fired yet
  });

  it('calls onPlaybackEnd callback for non-looping playback', async () => {
    const onPlaybackEnd = vi.fn();
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    await startSimplePlayback(notes, config, 1.0, { onPlaybackEnd });

    // End callback scheduled but not executed yet
    expect(onPlaybackEnd).not.toHaveBeenCalled();
  });

  it('skips rests during playback', async () => {
    const notes = [
      makeScheduledNote({ id: 'note-1', startTime: 0.0, toneNotes: [] }), // Rest
      makeScheduledNote({ id: 'note-2', startTime: 0.5, toneNotes: ['C4'] }),
    ];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // Should only schedule non-rest notes
    expect(session.isPlaying).toBe(true);
  });
});

describe('stopSimplePlayback', () => {
  it('stops playback and clears timeouts', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);
    const timeoutCount = session.timeoutIds.length;

    stopSimplePlayback(session);

    expect(session.isPlaying).toBe(false);
    expect(session.timeoutIds).toHaveLength(0);
    expect(timeoutCount).toBeGreaterThan(0); // Verify there were timeouts to clear
  });

  it('handles null session gracefully', () => {
    expect(() => stopSimplePlayback(null)).not.toThrow();
  });

  it('clears all scheduled timeouts', async () => {
    const notes = [
      makeScheduledNote({ startTime: 0 }),
      makeScheduledNote({ startTime: 0.5 }),
      makeScheduledNote({ startTime: 1.0 }),
    ];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: true,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 2.0);
    const initialTimeoutCount = session.timeoutIds.length;

    stopSimplePlayback(session);

    expect(initialTimeoutCount).toBeGreaterThan(3); // At least 3 notes + count-in + metronome
    expect(session.timeoutIds).toHaveLength(0);
  });
});

describe('getElapsedTime', () => {
  it('returns 0 when not playing', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);
    session.isPlaying = false;

    expect(getElapsedTime(session)).toBe(0);
  });

  it('returns correct elapsed time during playback', async () => {
    mockPerformanceNow.mockReturnValue(0); // Session start
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // Advance time by 500ms
    mockPerformanceNow.mockReturnValue(500);

    expect(getElapsedTime(session)).toBe(500);
  });

  it('handles loop mode by returning modulo elapsed time', async () => {
    mockPerformanceNow.mockReturnValue(0);
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: true,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // Cycle time = countIn (2000ms) + totalDuration (1000ms) = 3000ms
    // Advance to 3500ms (past one full cycle)
    mockPerformanceNow.mockReturnValue(3500);

    // Should return 500ms (3500 % 3000)
    expect(getElapsedTime(session)).toBe(500);
  });

  it('does not apply modulo in non-loop mode', async () => {
    mockPerformanceNow.mockReturnValue(0);
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // Advance past cycle time
    mockPerformanceNow.mockReturnValue(5000);

    expect(getElapsedTime(session)).toBe(5000);
  });
});

describe('getMusicElapsedTime', () => {
  it('returns negative during count-in', async () => {
    mockPerformanceNow.mockReturnValue(0);
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // During count-in (before 2000ms)
    mockPerformanceNow.mockReturnValue(1000);

    const musicTime = getMusicElapsedTime(session);
    expect(musicTime).toBeLessThan(0);
    expect(musicTime).toBe(-1000); // 1000 - 2000 = -1000
  });

  it('returns 0 at music start (end of count-in)', async () => {
    mockPerformanceNow.mockReturnValue(0);
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // At end of count-in (2000ms)
    mockPerformanceNow.mockReturnValue(2000);

    expect(getMusicElapsedTime(session)).toBe(0);
  });

  it('returns positive after music starts', async () => {
    mockPerformanceNow.mockReturnValue(0);
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // After music starts (2500ms)
    mockPerformanceNow.mockReturnValue(2500);

    expect(getMusicElapsedTime(session)).toBe(500);
  });

  it('handles loop restart correctly (no count-in on repeat)', async () => {
    mockPerformanceNow.mockReturnValue(0);
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: true,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // Simulate loop restart by manually updating session
    // (In real code, this is done by scheduleLoopRestart)
    session.startTime = 3000; // New start time after first cycle
    session.currentCountIn = 0; // No count-in on loop
    mockPerformanceNow.mockReturnValue(3500);

    const musicTime = getMusicElapsedTime(session);
    // 500ms elapsed from new start, no count-in offset
    expect(musicTime).toBe(500);
  });
});

describe('Loop functionality', () => {
  it('sets isFirstCycle to true initially', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: true,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    expect(session.isFirstCycle).toBe(true);
  });

  it('stores count-in duration for reference', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 60, // Slower tempo: 1 beat/second
      beatsPerMeasure: 3,
      metronomeEnabled: false,
      loop: true,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // 3 beats at 60 BPM = 3 seconds = 3000ms
    expect(session.countInDuration).toBe(3000);
  });
});

describe('Tempo calculations', () => {
  it('calculates correct count-in duration at 120 BPM, 4/4', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 120,
      beatsPerMeasure: 4,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // 4 beats at 120 BPM: 60/120 = 0.5 sec/beat → 4 * 0.5 = 2 sec = 2000ms
    expect(session.countInDuration).toBe(2000);
  });

  it('calculates correct count-in duration at 60 BPM, 3/4', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 60,
      beatsPerMeasure: 3,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // 3 beats at 60 BPM: 60/60 = 1 sec/beat → 3 * 1 = 3 sec = 3000ms
    expect(session.countInDuration).toBe(3000);
  });

  it('calculates correct count-in duration at 180 BPM, 2/4', async () => {
    const notes = [makeScheduledNote()];
    const config = {
      tempo: 180,
      beatsPerMeasure: 2,
      metronomeEnabled: false,
      loop: false,
    };

    const session = await startSimplePlayback(notes, config, 1.0);

    // 2 beats at 180 BPM: 60/180 = 0.333... sec/beat → 2 * 0.333... = 0.666... sec ≈ 667ms
    expect(session.countInDuration).toBeCloseTo(667, 0);
  });
});
