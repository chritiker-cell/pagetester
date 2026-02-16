import { describe, it, expect } from 'vitest';
import {
  calculateStarRating,
  calculateScoreBreakdown,
  getPerformanceLevel,
  formatScore,
  formatDuration,
  calculateStreak,
  getTimingFeedback,
} from '../scoringEngine';
import type { ComparisonSummary } from '../../types/comparison';

function makeSummary(overrides: Partial<ComparisonSummary> = {}): ComparisonSummary {
  return {
    totalExpectedNotes: 10,
    correctNotes: 10,
    incorrectNotes: 0,
    missedNotes: 0,
    extraNotes: 0,
    pitchAccuracy: 100,
    timingAccuracy: 100,
    rhythmAccuracy: 100,
    overallAccuracy: 100,
    averageTimingOffset: 0,
    comparisons: [],
    ...overrides,
  };
}

describe('calculateStarRating', () => {
  it('returns 5 stars for >= 95', () => {
    expect(calculateStarRating(95)).toBe(5);
    expect(calculateStarRating(100)).toBe(5);
  });

  it('returns 4 stars for >= 85', () => {
    expect(calculateStarRating(85)).toBe(4);
    expect(calculateStarRating(94)).toBe(4);
  });

  it('returns 3 stars for >= 70', () => {
    expect(calculateStarRating(70)).toBe(3);
  });

  it('returns 2 stars for >= 50', () => {
    expect(calculateStarRating(50)).toBe(2);
  });

  it('returns 1 star for < 50', () => {
    expect(calculateStarRating(49)).toBe(1);
    expect(calculateStarRating(0)).toBe(1);
  });
});

describe('calculateScoreBreakdown', () => {
  it('calculates weighted overall score', () => {
    const summary = makeSummary({
      pitchAccuracy: 100,
      timingAccuracy: 80,
      rhythmAccuracy: 60,
    });
    const breakdown = calculateScoreBreakdown(summary);
    expect(breakdown.overall).toBe(86);
    expect(breakdown.pitch).toBe(100);
    expect(breakdown.timing).toBe(80);
    expect(breakdown.rhythm).toBe(60);
  });
});

describe('getPerformanceLevel', () => {
  it('returns correct German labels', () => {
    expect(getPerformanceLevel(95)).toBe('Meisterhaft');
    expect(getPerformanceLevel(85)).toBe('Ausgezeichnet');
    expect(getPerformanceLevel(70)).toBe('Gut');
    expect(getPerformanceLevel(50)).toBe('Befriedigend');
    expect(getPerformanceLevel(30)).toBe('Übung nötig');
  });
});

describe('formatScore', () => {
  it('formats as percentage', () => {
    expect(formatScore(85)).toBe('85%');
    expect(formatScore(99.7)).toBe('100%');
  });
});

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(30)).toBe('30s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(120)).toBe('2:00');
  });
});

describe('calculateStreak', () => {
  it('returns 0 for empty comparisons', () => {
    const summary = makeSummary({ comparisons: [] });
    expect(calculateStreak(summary)).toEqual({ maxStreak: 0, currentStreak: 0 });
  });

  it('counts consecutive correct notes', () => {
    const summary = makeSummary({
      comparisons: [
        { result: 'correct' },
        { result: 'correct' },
        { result: 'incorrect' },
        { result: 'correct' },
      ] as any,
    });
    const { maxStreak, currentStreak } = calculateStreak(summary);
    expect(maxStreak).toBe(2);
    expect(currentStreak).toBe(1);
  });
});

describe('getTimingFeedback', () => {
  it('returns perfect for small offsets', () => {
    expect(getTimingFeedback(10)).toBe('Perfektes Timing!');
  });

  it('returns early/late for large offsets', () => {
    expect(getTimingFeedback(-150)).toBe('Tendenz: etwas zu früh');
    expect(getTimingFeedback(150)).toBe('Tendenz: etwas zu spät');
  });
});
