import { describe, it, expect } from 'vitest';
import { generateExercise } from '../exerciseGenerator';
import type { GeneratorConfig } from '../exerciseGenerator';
import { durationToFraction } from '../timing';

const VALID_KEY_REGEX = /^[a-g][b#]?\/[0-9]$/;

function totalBarFraction(notes: { duration: string; tuplet?: number }[]): number {
  let total = 0;
  for (const n of notes) {
    let frac = durationToFraction(n.duration);
    if (n.tuplet === 3) frac *= 2 / 3;
    total += frac;
  }
  return total;
}

describe('generateExercise', () => {
  const difficulties = [1, 2, 3, 4, 5, 6] as const;

  for (const difficulty of difficulties) {
    it(`generates valid exercise for difficulty ${difficulty}`, () => {
      const config: GeneratorConfig = {
        difficulty,
        timeSignature: '4/4',
        keyStage: 1,
        barCount: 4,
      };
      const exercise = generateExercise(config);

      expect(exercise.id).toBeTruthy();
      expect(exercise.bars.length).toBe(4);
      expect(exercise.timeSignature).toBe('4/4');
      expect(exercise.keySignature).toBeTruthy();
      expect(exercise.tempo).toBeGreaterThan(0);
    });
  }

  it('produces bars whose note durations sum to the time signature', () => {
    const exercise = generateExercise({
      difficulty: 3,
      timeSignature: '4/4',
      keyStage: 1,
      barCount: 4,
    });

    for (const bar of exercise.bars) {
      const trebleFrac = totalBarFraction(bar.notes);
      expect(trebleFrac).toBeCloseTo(1.0, 2);

      if (bar.bassNotes && bar.bassNotes.length > 0) {
        const bassFrac = totalBarFraction(bar.bassNotes);
        expect(bassFrac).toBeCloseTo(1.0, 2);
      }
    }
  });

  it('produces bars whose note durations sum correctly in 3/4', () => {
    const exercise = generateExercise({
      difficulty: 3,
      timeSignature: '3/4',
      keyStage: 1,
      barCount: 4,
    });

    for (const bar of exercise.bars) {
      const trebleFrac = totalBarFraction(bar.notes);
      expect(trebleFrac).toBeCloseTo(0.75, 2);
    }
  });

  it('uses valid VexFlow note keys', () => {
    const exercise = generateExercise({
      difficulty: 4,
      timeSignature: '4/4',
      keyStage: 2,
      barCount: 4,
    });

    for (const bar of exercise.bars) {
      for (const note of bar.notes) {
        for (const key of note.keys) {
          expect(key).toMatch(VALID_KEY_REGEX);
        }
      }
      if (bar.bassNotes) {
        for (const note of bar.bassNotes) {
          for (const key of note.keys) {
            expect(key).toMatch(VALID_KEY_REGEX);
          }
        }
      }
    }
  });

  it('generates grand staff with bassNotes for difficulty >= 3', () => {
    const exercise = generateExercise({
      difficulty: 3,
      timeSignature: '4/4',
      keyStage: 1,
      barCount: 4,
    });

    expect(exercise.grandStaff).toBe(true);
    for (const bar of exercise.bars) {
      expect(bar.bassNotes).toBeDefined();
      expect(bar.bassNotes!.length).toBeGreaterThan(0);
    }
  });

  it('has valid keySignature', () => {
    const validKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'F#', 'Gb', 'Cb'];
    for (let i = 0; i < 5; i++) {
      const exercise = generateExercise({
        difficulty: 4,
        timeSignature: 'random',
        keyStage: 2,
        barCount: 4,
      });
      expect(validKeys).toContain(exercise.keySignature);
    }
  });
});
