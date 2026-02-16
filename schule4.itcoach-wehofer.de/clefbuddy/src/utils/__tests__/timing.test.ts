import { describe, it, expect } from 'vitest';
import {
  parseDuration,
  durationToFraction,
  durationToSeconds,
  parseTimeSignature,
  formatTime,
  barDurationSeconds,
  getMetronomeInterval,
} from '../timing';

describe('parseDuration', () => {
  it('parses simple durations', () => {
    expect(parseDuration('q')).toEqual({ baseDuration: 'q', isDotted: false, isRest: false });
    expect(parseDuration('h')).toEqual({ baseDuration: 'h', isDotted: false, isRest: false });
  });

  it('parses dotted durations', () => {
    expect(parseDuration('qd')).toEqual({ baseDuration: 'qd', isDotted: true, isRest: false });
    expect(parseDuration('hd')).toEqual({ baseDuration: 'hd', isDotted: true, isRest: false });
  });

  it('parses rests', () => {
    expect(parseDuration('8r')).toEqual({ baseDuration: '8', isDotted: false, isRest: true });
    expect(parseDuration('qr')).toEqual({ baseDuration: 'q', isDotted: false, isRest: true });
  });

  it('parses dotted rests', () => {
    expect(parseDuration('hdr')).toEqual({ baseDuration: 'hd', isDotted: true, isRest: true });
  });
});

describe('durationToFraction', () => {
  it('returns correct fractions for basic durations', () => {
    expect(durationToFraction('w')).toBe(1);
    expect(durationToFraction('h')).toBe(0.5);
    expect(durationToFraction('q')).toBe(0.25);
    expect(durationToFraction('8')).toBe(0.125);
    expect(durationToFraction('16')).toBe(0.0625);
    expect(durationToFraction('32')).toBe(0.03125);
  });

  it('returns correct fractions for dotted durations', () => {
    expect(durationToFraction('hd')).toBe(0.75);
    expect(durationToFraction('qd')).toBe(0.375);
    expect(durationToFraction('8d')).toBe(0.1875);
  });

  it('treats rests same as notes', () => {
    expect(durationToFraction('qr')).toBe(0.25);
    expect(durationToFraction('8r')).toBe(0.125);
  });
});

describe('durationToSeconds', () => {
  it('calculates correctly at 120 BPM', () => {
    expect(durationToSeconds('q', 120)).toBe(0.5);
    expect(durationToSeconds('h', 120)).toBe(1);
    expect(durationToSeconds('w', 120)).toBe(2);
    expect(durationToSeconds('8', 120)).toBe(0.25);
  });

  it('calculates correctly at 60 BPM', () => {
    expect(durationToSeconds('q', 60)).toBe(1);
    expect(durationToSeconds('h', 60)).toBe(2);
  });
});

describe('parseTimeSignature', () => {
  it('parses common time signatures', () => {
    expect(parseTimeSignature('4/4')).toEqual({ beatsPerMeasure: 4, beatUnit: 4 });
    expect(parseTimeSignature('3/4')).toEqual({ beatsPerMeasure: 3, beatUnit: 4 });
    expect(parseTimeSignature('6/8')).toEqual({ beatsPerMeasure: 6, beatUnit: 8 });
    expect(parseTimeSignature('2/4')).toEqual({ beatsPerMeasure: 2, beatUnit: 4 });
  });
});

describe('formatTime', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(5)).toBe('0:05');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(125)).toBe('2:05');
  });
});

describe('barDurationSeconds', () => {
  it('calculates bar duration at 120 BPM in 4/4', () => {
    expect(barDurationSeconds(4, 4, 120)).toBe(2);
  });

  it('calculates bar duration at 120 BPM in 3/4', () => {
    expect(barDurationSeconds(3, 4, 120)).toBe(1.5);
  });
});

describe('getMetronomeInterval', () => {
  it('returns correct interval', () => {
    expect(getMetronomeInterval(120)).toBe(0.5);
    expect(getMetronomeInterval(60)).toBe(1);
  });
});
