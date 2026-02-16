import { describe, it, expect } from 'vitest';
import { compareNote, compareExercise } from '../noteComparison';
import type { PlayedNote } from '../../types/midi';
import type { ScheduledNote } from '../../types/playback';

function makeScheduledNote(overrides: Partial<ScheduledNote> = {}): ScheduledNote {
  return {
    id: 'sn_1',
    note: { keys: ['c/4'], duration: 'q' },
    barNumber: 1,
    noteIndex: 0,
    startTime: 1.0,
    durationSeconds: 0.5,
    midiPitches: [60],
    toneNotes: ['C4'],
    isRest: false,
    clef: 'treble',
    ...overrides,
  } as ScheduledNote;
}

function makePlayedNote(overrides: Partial<PlayedNote> = {}): PlayedNote {
  return {
    id: 'pn_1',
    midiNote: 60,
    noteName: 'C4',
    vexflowKey: 'c/4',
    velocity: 80,
    startTime: 1.0,
    endTime: 1.5,
    duration: 0.5,
    ...overrides,
  };
}

describe('compareNote', () => {
  it('returns correct for matching pitch', () => {
    const result = compareNote(makePlayedNote(), makeScheduledNote(), 0);
    expect(result.result).toBe('correct');
    expect(result.pitchCorrect).toBe(true);
  });

  it('returns incorrect for wrong pitch', () => {
    const result = compareNote(
      makePlayedNote({ midiNote: 62 }),
      makeScheduledNote(),
      0,
    );
    expect(result.result).toBe('incorrect');
    expect(result.pitchCorrect).toBe(false);
  });

  it('returns missed when no played note', () => {
    const result = compareNote(null, makeScheduledNote(), 0);
    expect(result.result).toBe('missed');
  });

  it('returns extra when no expected note', () => {
    const result = compareNote(makePlayedNote(), null, 0);
    expect(result.result).toBe('extra');
  });
});

describe('compareExercise', () => {
  it('returns 100% pitch accuracy for perfect play', () => {
    const scheduled = [
      makeScheduledNote({ id: 'sn_1', startTime: 0, midiPitches: [60] }),
      makeScheduledNote({ id: 'sn_2', startTime: 0.5, midiPitches: [62] }),
    ];
    const played = [
      makePlayedNote({ id: 'pn_1', midiNote: 60, startTime: 0 }),
      makePlayedNote({ id: 'pn_2', midiNote: 62, startTime: 0.5 }),
    ];

    const summary = compareExercise(played, scheduled);
    expect(summary.correctNotes).toBe(2);
    expect(summary.missedNotes).toBe(0);
    expect(summary.pitchAccuracy).toBe(100);
  });

  it('returns 0% pitch accuracy when all missed', () => {
    const scheduled = [
      makeScheduledNote({ id: 'sn_1', startTime: 0 }),
      makeScheduledNote({ id: 'sn_2', startTime: 0.5 }),
    ];

    const summary = compareExercise([], scheduled);
    expect(summary.missedNotes).toBe(2);
    expect(summary.pitchAccuracy).toBe(0);
  });

  it('counts extra notes', () => {
    const summary = compareExercise(
      [makePlayedNote({ startTime: 10 })],
      [makeScheduledNote({ startTime: 0 })],
    );
    expect(summary.extraNotes).toBe(1);
  });
});
