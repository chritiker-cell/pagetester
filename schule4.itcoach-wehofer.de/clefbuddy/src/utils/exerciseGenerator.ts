import type { Exercise, Bar, Note } from '../types/music';

export type Difficulty = 1 | 2 | 3;
export type TimeSignatureOption = '4/4' | '3/4' | '2/4' | '6/8' | 'random';
export type KeyStage = 1 | 2 | 3;

interface GeneratorConfig {
  difficulty: Difficulty;
  timeSignature: TimeSignatureOption;
  keyStage: KeyStage;
}

const KEY_STAGES: Record<KeyStage, string[]> = {
  1: ['C', 'G', 'F'],
  2: ['D', 'Bb', 'A', 'Eb'],
  3: ['E', 'Ab', 'B', 'Db', 'F#'],
};

const TIME_SIGNATURES = ['4/4', '3/4', '2/4', '6/8'] as const;

// Map key signature to scale degree notes (simplified - diatonic notes)
function getScaleNotes(key: string): string[] {
  const keyMap: Record<string, string[]> = {
    'C':  ['c', 'd', 'e', 'f', 'g', 'a', 'b'],
    'G':  ['g', 'a', 'b', 'c', 'd', 'e', 'f#'],
    'F':  ['f', 'g', 'a', 'bb', 'c', 'd', 'e'],
    'D':  ['d', 'e', 'f#', 'g', 'a', 'b', 'c#'],
    'Bb': ['bb', 'c', 'd', 'eb', 'f', 'g', 'a'],
    'A':  ['a', 'b', 'c#', 'd', 'e', 'f#', 'g#'],
    'Eb': ['eb', 'f', 'g', 'ab', 'bb', 'c', 'd'],
    'E':  ['e', 'f#', 'g#', 'a', 'b', 'c#', 'd#'],
    'Ab': ['ab', 'bb', 'c', 'db', 'eb', 'f', 'g'],
    'B':  ['b', 'c#', 'd#', 'e', 'f#', 'g#', 'a#'],
    'Db': ['db', 'eb', 'f', 'gb', 'ab', 'bb', 'c'],
    'F#': ['f#', 'g#', 'a#', 'b', 'c#', 'd#', 'e#'],
  };
  return keyMap[key] || keyMap['C'];
}

// Difficulty-dependent parameters
interface DifficultyParams {
  trebleRange: { minOctave: number; maxOctave: number; minDegree: number; maxDegree: number };
  bassRange: { minOctave: number; maxOctave: number; minDegree: number; maxDegree: number };
  durations: string[];
  durationBeats: Record<string, number>;
  barCount: { min: number; max: number };
  maxInterval: number; // max scale degrees to jump
  intervalWeights: number[]; // weights for [unison, second, third, fourth, fifth, sixth, seventh]
}

function getDifficultyParams(difficulty: Difficulty, beatsPerBar: number): DifficultyParams {
  const baseDurationBeats: Record<string, number> = {
    'w': 4, 'hd': 3, 'h': 2, 'qd': 1.5, 'q': 1, '8': 0.5, '16': 0.25,
  };

  switch (difficulty) {
    case 1:
      return {
        trebleRange: { minOctave: 4, maxOctave: 4, minDegree: 0, maxDegree: 4 },
        bassRange: { minOctave: 3, maxOctave: 3, minDegree: 0, maxDegree: 4 },
        durations: ['w', 'h', 'q'].filter(d => baseDurationBeats[d] <= beatsPerBar),
        durationBeats: baseDurationBeats,
        barCount: { min: 4, max: 6 },
        maxInterval: 2,
        intervalWeights: [5, 80, 20, 0, 0, 0, 0], // mostly seconds
      };
    case 2:
      return {
        trebleRange: { minOctave: 4, maxOctave: 5, minDegree: 0, maxDegree: 6 },
        bassRange: { minOctave: 2, maxOctave: 3, minDegree: 3, maxDegree: 6 },
        durations: ['w', 'hd', 'h', 'q', '8'].filter(d => baseDurationBeats[d] <= beatsPerBar),
        durationBeats: baseDurationBeats,
        barCount: { min: 4, max: 8 },
        maxInterval: 4,
        intervalWeights: [5, 60, 25, 10, 5, 0, 0],
      };
    case 3:
      return {
        trebleRange: { minOctave: 4, maxOctave: 5, minDegree: 0, maxDegree: 6 },
        bassRange: { minOctave: 2, maxOctave: 4, minDegree: 3, maxDegree: 6 },
        durations: ['w', 'hd', 'h', 'qd', 'q', '8', '16'].filter(d => baseDurationBeats[d] <= beatsPerBar),
        durationBeats: baseDurationBeats,
        barCount: { min: 6, max: 8 },
        maxInterval: 7,
        intervalWeights: [3, 25, 25, 15, 15, 10, 7],
      };
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Convert a scale degree + octave to a linear pitch index for interval math.
 * degree 0-6 within octave => linearIndex = octave * 7 + degree
 */
function toLinear(degree: number, octave: number): number {
  return octave * 7 + degree;
}

function fromLinear(linear: number): { degree: number; octave: number } {
  const octave = Math.floor(linear / 7);
  const degree = linear - octave * 7;
  return { degree, octave };
}

/**
 * Weighted random selection: pick an interval size based on weights
 */
function weightedRandomInterval(weights: number[], maxInterval: number): number {
  const capped = weights.slice(0, maxInterval + 1);
  const total = capped.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < capped.length; i++) {
    r -= capped[i];
    if (r <= 0) return i;
  }
  return 1; // fallback: second
}

interface NoteState {
  degree: number;
  octave: number;
  lastJumpSize: number; // abs interval of previous move
  lastDirection: number; // +1 up, -1 down, 0 none
}

function generateNoteWithVoiceLeading(
  scaleNotes: string[],
  range: DifficultyParams['trebleRange'],
  params: DifficultyParams,
  prev: NoteState | null,
): { key: string; state: NoteState } {
  const minLinear = toLinear(range.minDegree, range.minOctave);
  const maxLinear = toLinear(range.maxDegree, range.maxOctave);

  if (!prev) {
    // First note: pick from middle of range
    const mid = Math.floor((minLinear + maxLinear) / 2);
    const startLinear = Math.max(minLinear, Math.min(maxLinear, mid + randInt(-1, 1)));
    const { degree, octave } = fromLinear(startLinear);
    const note = scaleNotes[degree % scaleNotes.length];
    return {
      key: `${note}/${octave}`,
      state: { degree, octave, lastJumpSize: 0, lastDirection: 0 },
    };
  }

  const prevLinear = toLinear(prev.degree, prev.octave);

  // After a large jump (>=4 steps), force stepwise motion in opposite direction
  if (prev.lastJumpSize >= 4 && prev.lastDirection !== 0) {
    const recoveryDir = -prev.lastDirection;
    const targetLinear = Math.max(minLinear, Math.min(maxLinear, prevLinear + recoveryDir));
    const { degree, octave } = fromLinear(targetLinear);
    const note = scaleNotes[degree % scaleNotes.length];
    return {
      key: `${note}/${octave}`,
      state: { degree, octave, lastJumpSize: 1, lastDirection: recoveryDir },
    };
  }

  // Pick interval size via weighted random
  const intervalSize = weightedRandomInterval(params.intervalWeights, params.maxInterval);

  // Pick direction
  const direction = Math.random() < 0.5 ? 1 : -1;
  let targetLinear = prevLinear + direction * intervalSize;

  // Clamp to range
  targetLinear = Math.max(minLinear, Math.min(maxLinear, targetLinear));

  // If clamped caused unison and we wanted movement, try other direction
  if (targetLinear === prevLinear && intervalSize > 0) {
    targetLinear = prevLinear - direction * intervalSize;
    targetLinear = Math.max(minLinear, Math.min(maxLinear, targetLinear));
  }

  const actualInterval = Math.abs(targetLinear - prevLinear);
  const actualDir = targetLinear > prevLinear ? 1 : targetLinear < prevLinear ? -1 : 0;

  const { degree, octave } = fromLinear(targetLinear);
  const note = scaleNotes[degree % scaleNotes.length];
  return {
    key: `${note}/${octave}`,
    state: { degree, octave, lastJumpSize: actualInterval, lastDirection: actualDir },
  };
}

// Fingering lookup for C-position (both hands)
const TREBLE_FINGERING: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 };
const BASS_FINGERING: Record<number, number> = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1 };

function getFingering(
  degree: number,
  isBass: boolean,
  difficulty: Difficulty,
  noteIndex: number,
): number | undefined {
  // Only show fingering for level 1 (fixed position) on first note or degrees 0-4
  if (difficulty === 1) {
    if (degree > 4) return undefined;
    // Show on first note, then every 4th note
    if (noteIndex === 0 || noteIndex % 4 === 0) {
      return isBass ? BASS_FINGERING[degree] : TREBLE_FINGERING[degree];
    }
    return undefined;
  }
  // Level 2+: only on first note
  if (noteIndex === 0 && degree <= 4) {
    return isBass ? BASS_FINGERING[degree] : TREBLE_FINGERING[degree];
  }
  return undefined;
}

function fillBar(
  beatsPerBar: number,
  scaleNotes: string[],
  range: DifficultyParams['trebleRange'],
  params: DifficultyParams,
  prevState: NoteState | null,
  isBass: boolean,
  difficulty: Difficulty,
): { notes: Note[]; lastState: NoteState | null } {
  const notes: Note[] = [];
  let remaining = beatsPerBar;
  let state = prevState;
  let noteIndex = prevState ? 999 : 0; // only track index for fingering from bar start if no prev

  while (remaining > 0.001) {
    const available = params.durations.filter(d => params.durationBeats[d] <= remaining + 0.001);
    if (available.length === 0) break;

    const duration = pick(available);
    const beats = params.durationBeats[duration];
    const result = generateNoteWithVoiceLeading(scaleNotes, range, params, state);
    state = result.state;

    const fingering = getFingering(state.degree, isBass, difficulty, noteIndex);
    const note: Note = { keys: [result.key], duration };
    if (fingering !== undefined) {
      note.fingering = fingering;
    }

    notes.push(note);
    remaining -= beats;
    noteIndex++;
  }

  // Fallback: if bar is empty, fill with quarters
  if (notes.length === 0) {
    for (let i = 0; i < beatsPerBar; i++) {
      const result = generateNoteWithVoiceLeading(scaleNotes, range, params, state);
      state = result.state;
      notes.push({ keys: [result.key], duration: 'q' });
    }
  }

  return { notes, lastState: state };
}

export function generateExercise(config: GeneratorConfig): Exercise {
  // Pick key
  const keyOptions = KEY_STAGES[config.keyStage];
  const key = pick(keyOptions);
  const scaleNotes = getScaleNotes(key);

  // Pick time signature
  const timeSignature = config.timeSignature === 'random'
    ? pick([...TIME_SIGNATURES])
    : config.timeSignature;

  // Parse time signature
  const [beatsNum] = timeSignature.split('/').map(Number);
  const beatsPerBar = timeSignature === '6/8' ? 3 : beatsNum; // 6/8 = 6 eighths = 3 quarter-note beats

  const params = getDifficultyParams(config.difficulty, beatsPerBar);
  const barCount = randInt(params.barCount.min, params.barCount.max);

  const bars: Bar[] = [];
  let trebleState: NoteState | null = null;
  let bassState: NoteState | null = null;

  for (let i = 0; i < barCount; i++) {
    const trebleResult = fillBar(beatsPerBar, scaleNotes, params.trebleRange, params, trebleState, false, config.difficulty);
    const bassResult = fillBar(beatsPerBar, scaleNotes, params.bassRange, params, bassState, true, config.difficulty);
    trebleState = trebleResult.lastState;
    bassState = bassResult.lastState;
    bars.push({
      number: i + 1,
      notes: trebleResult.notes,
      bassNotes: bassResult.notes,
    });
  }

  // Make last bar end on tonic
  const lastBar = bars[bars.length - 1];
  if (lastBar.notes.length > 0) {
    lastBar.notes[lastBar.notes.length - 1].keys = [`${scaleNotes[0]}/4`];
  }
  if (lastBar.bassNotes && lastBar.bassNotes.length > 0) {
    lastBar.bassNotes[lastBar.bassNotes.length - 1].keys = [`${scaleNotes[0]}/3`];
  }

  const difficultyLabels: Record<Difficulty, Exercise['difficulty']> = {
    1: 'beginner',
    2: 'easy',
    3: 'intermediate',
  };

  const id = `random_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  return {
    id,
    level: config.difficulty,
    name: `Zufallsuebung (${key}-Dur, ${timeSignature})`,
    description: `Zufaellig generierte Uebung in ${key}-Dur, ${timeSignature} Takt`,
    difficulty: difficultyLabels[config.difficulty],
    timeSignature,
    keySignature: key,
    clef: 'treble',
    grandStaff: true,
    tempo: config.difficulty === 1 ? 60 : config.difficulty === 2 ? 72 : 84,
    bars,
  };
}
