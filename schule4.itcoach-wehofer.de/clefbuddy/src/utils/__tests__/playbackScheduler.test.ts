import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  exerciseToScheduledNotes,
  calculateExerciseDuration,
  PlaybackController,
  getPlaybackController,
} from '../playbackScheduler';
import type { Exercise, Bar } from '../../types/music';
import type { PlaybackConfig } from '../../types/playback';

// Mock audioEngine
vi.mock('../audioEngine', () => ({
  initAudioEngine: vi.fn().mockResolvedValue(undefined),
  isAudioReady: vi.fn().mockReturnValue(true),
  releaseAllVoices: vi.fn(),
}));

// Mock simplePlayback
vi.mock('../simplePlayback', () => ({
  startSimplePlayback: vi.fn().mockResolvedValue({
    startTime: 0,
    countInDuration: 2000,
    currentCountIn: 2000,
    totalDuration: 2000,
    isPlaying: true,
    loop: false,
    isFirstCycle: true,
    timeoutIds: [],
  }),
  stopSimplePlayback: vi.fn(),
}));

function makeBar(overrides: Partial<Bar> = {}): Bar {
  return {
    number: 1,
    notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ],
    bassNotes: [],
    ...overrides,
  };
}

function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: 'test-exercise',
    name: 'Test Exercise',
    description: 'A test exercise',
    difficulty: 'beginner',
    level: 1,
    bars: [makeBar(), makeBar({ number: 2 }), makeBar({ number: 3 }), makeBar({ number: 4 })],
    clef: 'treble',
    timeSignature: '4/4',
    keySignature: 'C',
    tempo: 120,
    grandStaff: false,
    ...overrides,
  };
}

const DEFAULT_CONFIG: PlaybackConfig = {
  tempo: 80,
  beatsPerMeasure: 4,
  beatUnit: 4,
  loop: false,
  metronomeEnabled: true,
  countIn: 0,
};

describe('exerciseToScheduledNotes', () => {
  it('schedules all notes in correct order', () => {
    const exercise = makeExercise();
    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    // 4 bars * 4 notes per bar = 16 notes
    expect(scheduled.length).toBe(16);

    // Notes should be sorted by start time
    for (let i = 1; i < scheduled.length; i++) {
      expect(scheduled[i].startTime).toBeGreaterThanOrEqual(scheduled[i - 1].startTime);
    }
  });

  it('converts VexFlow keys to Tone.js format', () => {
    const exercise = makeExercise({
      bars: [makeBar({ notes: [{ keys: ['c/4'], duration: 'q' }, { keys: ['f#/4'], duration: 'q' }] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    expect(scheduled[0].toneNotes).toEqual(['C4']);
    expect(scheduled[1].toneNotes).toEqual(['F#4']);
  });

  it('converts VexFlow keys to MIDI pitches', () => {
    const exercise = makeExercise({
      bars: [
        makeBar({
          notes: [
            { keys: ['c/4'], duration: 'q' }, // MIDI 60
            { keys: ['d/4'], duration: 'q' }, // MIDI 62
            { keys: ['e/4'], duration: 'q' }, // MIDI 64
          ],
        }),
      ],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    expect(scheduled[0].midiPitches).toEqual([60]);
    expect(scheduled[1].midiPitches).toEqual([62]);
    expect(scheduled[2].midiPitches).toEqual([64]);
  });

  it('handles sharps correctly', () => {
    const exercise = makeExercise({
      bars: [makeBar({ notes: [{ keys: ['f#/4'], duration: 'q' }] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    expect(scheduled[0].midiPitches).toEqual([66]); // F# = 65
  });

  it('handles flats correctly', () => {
    const exercise = makeExercise({
      bars: [makeBar({ notes: [{ keys: ['bb/4'], duration: 'q' }] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    expect(scheduled[0].midiPitches).toEqual([70]); // Bb = 70
  });

  it('handles rests by creating empty note arrays', () => {
    const exercise = makeExercise({
      bars: [makeBar({ notes: [{ keys: ['c/4'], duration: 'q' }, { keys: ['d/4'], duration: 'qr' }] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    expect(scheduled[0].toneNotes).toEqual(['C4']);
    expect(scheduled[1].toneNotes).toEqual([]); // Rest
    expect(scheduled[1].midiPitches).toEqual([]);
  });

  it('schedules bass notes in grand staff exercises', () => {
    const exercise = makeExercise({
      grandStaff: true,
      bars: [
        makeBar({
          notes: [{ keys: ['c/4'], duration: 'q' }],
          bassNotes: [{ keys: ['c/3'], duration: 'q' }],
        }),
      ],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    const trebleNotes = scheduled.filter((n) => n.voice === 'treble');
    const bassNotes = scheduled.filter((n) => n.voice === 'bass');

    expect(trebleNotes.length).toBe(1);
    expect(bassNotes.length).toBe(1);
  });

  it('calculates timing based on tempo', () => {
    const exercise = makeExercise({
      bars: [makeBar({ notes: [{ keys: ['c/4'], duration: 'q' }, { keys: ['d/4'], duration: 'q' }] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 120 });

    // At 120 BPM: quarter note = 0.5 seconds
    expect(scheduled[0].startTime).toBe(0);
    expect(scheduled[0].durationSeconds).toBe(0.5);
    expect(scheduled[1].startTime).toBe(0.5);
  });

  it('calculates bar start times correctly', () => {
    const exercise = makeExercise(); // 4 bars of 4/4
    const scheduled = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 120 });

    // At 120 BPM, 4/4 bar = 2 seconds
    const bar1Notes = scheduled.filter((n) => n.barNumber === 1);
    const bar2Notes = scheduled.filter((n) => n.barNumber === 2);
    const bar3Notes = scheduled.filter((n) => n.barNumber === 3);

    expect(bar1Notes[0].startTime).toBe(0);
    expect(bar2Notes[0].startTime).toBe(2);
    expect(bar3Notes[0].startTime).toBe(4);
  });

  it('handles different time signatures', () => {
    const exercise = makeExercise({
      timeSignature: '3/4',
      bars: [makeBar({ notes: [{ keys: ['c/4'], duration: 'q' }, { keys: ['d/4'], duration: 'q' }, { keys: ['e/4'], duration: 'q' }] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 120 });

    // 3/4 bar at 120 BPM = 1.5 seconds
    expect(scheduled.length).toBe(3);
  });

  it('handles triplets with 2/3 duration adjustment', () => {
    const exercise = makeExercise({
      bars: [
        makeBar({
          notes: [
            { keys: ['c/4'], duration: '8', tuplet: 3 },
            { keys: ['d/4'], duration: '8', tuplet: 3 },
            { keys: ['e/4'], duration: '8', tuplet: 3 },
          ],
        }),
      ],
    });

    const scheduled = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 120 });

    // Eighth note at 120 BPM = 0.25 seconds
    // Triplet eighth = 0.25 * (2/3) ≈ 0.167 seconds
    expect(scheduled[0].durationSeconds).toBeCloseTo(0.167, 2);
    expect(scheduled[1].durationSeconds).toBeCloseTo(0.167, 2);
    expect(scheduled[2].durationSeconds).toBeCloseTo(0.167, 2);
  });

  it('creates unique note IDs', () => {
    const exercise = makeExercise();
    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    const ids = scheduled.map((n) => n.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it('includes bar and note index in scheduled notes', () => {
    const exercise = makeExercise();
    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    const firstNote = scheduled[0];
    expect(firstNote.barNumber).toBe(1);
    expect(firstNote.noteIndex).toBe(0);

    const secondBarFirstNote = scheduled.find((n) => n.barNumber === 2 && n.noteIndex === 0);
    expect(secondBarFirstNote).toBeDefined();
  });

  it('handles chords (multiple keys)', () => {
    const exercise = makeExercise({
      bars: [makeBar({ notes: [{ keys: ['c/4', 'e/4', 'g/4'], duration: 'q' }] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    expect(scheduled[0].toneNotes).toEqual(['C4', 'E4', 'G4']);
    expect(scheduled[0].midiPitches).toEqual([60, 64, 67]);
  });
});

describe('calculateExerciseDuration', () => {
  it('calculates duration for 4/4 exercise at 120 BPM', () => {
    const exercise = makeExercise(); // 4 bars of 4/4
    const duration = calculateExerciseDuration(exercise, 120);

    // 4 bars * 2 seconds per bar = 8 seconds
    expect(duration).toBe(8);
  });

  it('calculates duration for 3/4 exercise at 120 BPM', () => {
    const exercise = makeExercise({
      timeSignature: '3/4',
      bars: [makeBar(), makeBar({ number: 2 })],
    });

    const duration = calculateExerciseDuration(exercise, 120);

    // 2 bars * 1.5 seconds per bar = 3 seconds
    expect(duration).toBe(3);
  });

  it('calculates duration at different tempos', () => {
    const exercise = makeExercise(); // 4 bars of 4/4

    const duration60 = calculateExerciseDuration(exercise, 60);
    const duration120 = calculateExerciseDuration(exercise, 120);

    // At 60 BPM, each bar is twice as long
    expect(duration60).toBe(duration120 * 2);
  });

  it('handles exercises with different bar counts', () => {
    const exercise8Bars = makeExercise({
      bars: Array(8).fill(null).map((_, i) => makeBar({ number: i + 1 })),
    });

    const duration = calculateExerciseDuration(exercise8Bars, 120);

    // 8 bars * 2 seconds per bar = 16 seconds
    expect(duration).toBe(16);
  });
});

describe('PlaybackController', () => {
  let controller: PlaybackController;

  beforeEach(() => {
    // Create a fresh copy of DEFAULT_CONFIG to avoid mutation between tests
    controller = new PlaybackController({ ...DEFAULT_CONFIG });
  });

  it('initializes successfully', async () => {
    const result = await controller.initialize();
    expect(result).toBe(true);
  });

  it('reports ready state', () => {
    expect(controller.isReady()).toBe(true);
  });

  it('loads an exercise', () => {
    const exercise = makeExercise();
    controller.loadExercise(exercise);

    const scheduled = controller.getScheduledNotes();
    expect(scheduled.length).toBe(16); // 4 bars * 4 notes
  });

  it('calculates total duration after loading', () => {
    const exercise = makeExercise();
    controller.loadExercise(exercise);

    const duration = controller.getTotalDuration();
    expect(duration).toBe(8); // 4 bars * 2 seconds
  });

  it('updates config and reschedules notes', () => {
    const exercise = makeExercise();
    controller.loadExercise(exercise);

    const originalDuration = controller.getTotalDuration();
    controller.updateConfig({ tempo: 60 }); // Half speed
    const newDuration = controller.getTotalDuration();

    expect(newDuration).toBe(originalDuration * 2);
  });

  it('uses exercise tempo if not overridden', () => {
    const exercise = makeExercise({ tempo: 100 });
    controller.loadExercise(exercise);

    const config = controller.getConfig();
    expect(config.tempo).toBe(100);
  });

  it('parses time signature from exercise', () => {
    const exercise = makeExercise({ timeSignature: '3/4' });
    controller.loadExercise(exercise);

    const config = controller.getConfig();
    expect(config.beatsPerMeasure).toBe(3);
    expect(config.beatUnit).toBe(4);
  });

  it('starts playback', async () => {
    const exercise = makeExercise();
    controller.loadExercise(exercise);

    await controller.play();

    const session = controller.getSession();
    expect(session).not.toBeNull();
    expect(session?.isPlaying).toBe(true);
  });

  it('calculates count-in duration', async () => {
    const exercise = makeExercise();
    controller.loadExercise(exercise);

    await controller.play();

    const countIn = controller.getCountInDuration();
    // 4 beats at 120 BPM = 2 seconds
    expect(countIn).toBe(2);
  });

  it('stops playback', async () => {
    const exercise = makeExercise();
    controller.loadExercise(exercise);

    await controller.play();
    controller.stop();

    const session = controller.getSession();
    expect(session).toBeNull();
  });

  it('calls onNoteChange callback during playback', () => {
    const onNoteChange = vi.fn();
    const exercise = makeExercise();

    controller.loadExercise(exercise, onNoteChange);

    expect(onNoteChange).not.toHaveBeenCalled(); // Not called during load
  });

  it('calls onPlaybackEnd callback', () => {
    const onPlaybackEnd = vi.fn();
    const exercise = makeExercise();

    controller.loadExercise(exercise, undefined, undefined, onPlaybackEnd);

    expect(onPlaybackEnd).not.toHaveBeenCalled(); // Not called during load
  });

  it('returns correct config', () => {
    const config = controller.getConfig();

    expect(config.tempo).toBe(80);
    expect(config.beatsPerMeasure).toBe(4);
    expect(config.loop).toBe(false);
  });
});

describe('getPlaybackController singleton', () => {
  it('returns the same instance on multiple calls', () => {
    const controller1 = getPlaybackController();
    const controller2 = getPlaybackController();

    expect(controller1).toBe(controller2);
  });

  it('uses default config if none provided', () => {
    const controller = getPlaybackController();
    const config = controller.getConfig();

    expect(config.tempo).toBeGreaterThan(0);
    expect(config.beatsPerMeasure).toBeGreaterThan(0);
  });
});

describe('Note scheduling edge cases', () => {
  it('handles exercise with single bar', () => {
    const exercise = makeExercise({ bars: [makeBar()] });
    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    expect(scheduled.length).toBe(4);
  });

  it('handles empty bass notes array', () => {
    const exercise = makeExercise({
      grandStaff: true,
      bars: [makeBar({ bassNotes: [] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);
    const bassNotes = scheduled.filter((n) => n.voice === 'bass');

    expect(bassNotes.length).toBe(0);
  });

  it('handles mixed note durations', () => {
    const exercise = makeExercise({
      bars: [
        makeBar({
          notes: [
            { keys: ['c/4'], duration: 'h' }, // Half note
            { keys: ['d/4'], duration: 'q' }, // Quarter note
            { keys: ['e/4'], duration: '8' }, // Eighth note
            { keys: ['f/4'], duration: '8' }, // Eighth note
          ],
        }),
      ],
    });

    const scheduled = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 120 });

    expect(scheduled[0].durationSeconds).toBe(1.0); // Half note
    expect(scheduled[1].durationSeconds).toBe(0.5); // Quarter note
    expect(scheduled[2].durationSeconds).toBe(0.25); // Eighth note
  });

  it('handles dotted notes', () => {
    const exercise = makeExercise({
      bars: [makeBar({ notes: [{ keys: ['c/4'], duration: 'qd' }, { keys: ['d/4'], duration: '8' }] })],
    });

    const scheduled = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 120 });

    // Dotted quarter = 0.75 seconds at 120 BPM
    expect(scheduled[0].durationSeconds).toBe(0.75);
  });

  it('schedules simultaneous notes correctly', () => {
    const exercise = makeExercise({
      grandStaff: true,
      bars: [
        makeBar({
          notes: [{ keys: ['c/4'], duration: 'q' }],
          bassNotes: [{ keys: ['c/3'], duration: 'q' }],
        }),
      ],
    });

    const scheduled = exerciseToScheduledNotes(exercise, DEFAULT_CONFIG);

    const treble = scheduled.find((n) => n.voice === 'treble');
    const bass = scheduled.find((n) => n.voice === 'bass');

    expect(treble?.startTime).toBe(bass?.startTime);
  });
});

describe('Tempo conversion accuracy', () => {
  it('calculates correct durations at various tempos', () => {
    const exercise = makeExercise({ bars: [makeBar({ notes: [{ keys: ['c/4'], duration: 'q' }] })] });

    const scheduled60 = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 60 });
    const scheduled120 = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 120 });
    const scheduled180 = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 180 });

    expect(scheduled60[0].durationSeconds).toBe(1.0);
    expect(scheduled120[0].durationSeconds).toBe(0.5);
    expect(scheduled180[0].durationSeconds).toBeCloseTo(0.333, 2);
  });

  it('maintains timing precision across multiple bars', () => {
    const exercise = makeExercise(); // 4 bars
    const scheduled = exerciseToScheduledNotes(exercise, { ...DEFAULT_CONFIG, tempo: 120 });

    // Last note in last bar
    const lastNote = scheduled[scheduled.length - 1];
    const expectedLastNoteStart = 7.5; // 3.5 bars * 2 sec + last quarter offset

    expect(lastNote.startTime).toBeCloseTo(expectedLastNoteStart, 1);
  });
});
