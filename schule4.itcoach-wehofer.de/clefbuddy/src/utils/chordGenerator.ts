/**
 * Chord Exercise Generator — mode-based chord exercise generation
 */
import type { Exercise, Bar, Note } from '../types/music';
import type { ChordConfig, ChordMode } from '../types/chords';
import { KEY_GROUPS, MODE_CONFIGS, getProgression } from '../data/chordData';
import {
  FLAT_KEYS,
  SEMITONE_MAP,
  parseKey,
  semitoneToVexflow,
} from './harmonyCommon';

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];

function getScaleNotes(key: string): number[] {
  const { root, isMinor } = parseKey(key);
  const rootSemi = SEMITONE_MAP[root] ?? 0;
  const intervals = isMinor ? MINOR_SCALE : MAJOR_SCALE;
  return intervals.map(i => (rootSemi + i) % 12);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function assignOctaves(pitches: number[], baseOctave: number, useFlats: boolean): string[] {
  const result: string[] = [];
  let currentOctave = baseOctave;
  let prevSemi = -1;
  for (const semi of pitches) {
    if (prevSemi >= 0 && semi <= prevSemi) currentOctave++;
    result.push(semitoneToVexflow(semi, currentOctave, useFlats));
    prevSemi = semi;
  }
  return result;
}

function invertPitches(pitches: number[], inversion: number): number[] {
  const p = [...pitches];
  for (let i = 0; i < inversion; i++) {
    if (p.length >= 2) p.push(p.shift()!);
  }
  return p;
}

/**
 * Get best inversion for voice-leading: choose the inversion with the most common tones
 * compared to the previous chord. If no previous chord, return root position (0).
 */
function getBestInversion(
  currentChordPitches: number[],
  previousChordPitches: number[] | null,
  availableInversions: number[],
): number {
  if (!previousChordPitches || previousChordPitches.length === 0) {
    return 0; // No previous chord, use root position
  }

  let bestInversion = 0;
  let maxCommonTones = -1;

  for (const inv of availableInversions) {
    const inverted = invertPitches(currentChordPitches, inv);
    // Count common tones (mod 12 for pitch class comparison)
    let commonCount = 0;
    for (const p1 of inverted) {
      const pc1 = p1 % 12;
      for (const p2 of previousChordPitches) {
        const pc2 = p2 % 12;
        if (pc1 === pc2) {
          commonCount++;
          break;
        }
      }
    }
    if (commonCount > maxCommonTones) {
      maxCommonTones = commonCount;
      bestInversion = inv;
    }
  }

  return bestInversion;
}

/**
 * Get chord pitches for a scale degree
 *
 * Note: Diatonic stacking automatically produces correct chord qualities:
 * - In Major: I = maj7, ii = min7, iii = min7, IV = maj7, V = dom7, vi = min7, vii° = hdim7
 * - In Minor: i = min7, ii° = hdim7, III = maj7, iv = min7, v = min7, VI = maj7, VII = dom7
 * This is music-theoretically correct for scale-degree-based progressions.
 */
function getChordPitches(
  degree: number,
  scaleNotes: number[],
  octave: number,
  inversion: number,
  useFlats: boolean,
  fourVoice: boolean,
): string[] {
  const idx = degree - 1;
  const root = scaleNotes[idx % 7];
  const third = scaleNotes[(idx + 2) % 7];
  const fifth = scaleNotes[(idx + 4) % 7];
  let pitches = [root, third, fifth];
  if (fourVoice) {
    const seventh = scaleNotes[(idx + 6) % 7];
    pitches = [root, third, fifth, seventh];
  }
  pitches = invertPitches(pitches, inversion);
  return assignOctaves(pitches, octave, useFlats);
}

function beatsFor(ts: string): number {
  if (ts === '6/8') return 6;
  if (ts === '3/4') return 3;
  return 4;
}

// ===== Treble generators per mode =====

function trebleBlocked(pitches: string[], ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 4) return [{ keys: pitches, duration: 'w' }];
  if (beats === 3) return [{ keys: pitches, duration: 'hd' }];
  // 6/8 — one dotted half (6 eighth notes)
  return [{ keys: pitches, duration: 'hd' }];
}

function trebleBlockedInversions(pitches: string[], ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 4) {
    return [
      { keys: pitches, duration: 'h' },
      { keys: pitches, duration: 'h' },
    ];
  }
  if (beats === 3) {
    if (Math.random() < 0.5) return [{ keys: pitches, duration: 'hd' }];
    return [
      { keys: pitches, duration: 'h' },
      { keys: pitches, duration: 'q' },
    ];
  }
  return [{ keys: pitches, duration: 'hd' }];
}

function trebleBroken(pitches: string[], ts: string): Note[] {
  const beats = beatsFor(ts);
  const notes: Note[] = [];
  const len = pitches.length;
  const patterns = ['up', 'down', '1-3-5-3'];
  const pattern = pick(patterns);

  if (beats === 3) {
    // 6 eighths
    if (pattern === 'up') {
      for (let i = 0; i < 6; i++) notes.push({ keys: [pitches[i % len]], duration: '8' });
    } else if (pattern === 'down') {
      for (let i = 5; i >= 0; i--) notes.push({ keys: [pitches[i % len]], duration: '8' });
    } else {
      // 1-3-5-3-1-3
      const seq = [0, 1, 2, 1, 0, 1];
      for (const idx of seq) notes.push({ keys: [pitches[idx % len]], duration: '8' });
    }
  } else {
    // 4/4: 8 eighths with organic patterns
    if (pattern === 'up') {
      // Organic ascending pattern: 0-1-2-1-0-1-2-1
      const upSeq = len === 3 ? [0, 1, 2, 1, 0, 1, 2, 1] : [0, 1, 2, 3, 2, 1, 0, 1];
      for (let i = 0; i < 8; i++) notes.push({ keys: [pitches[upSeq[i] % len]], duration: '8' });
    } else if (pattern === 'down') {
      // Organic descending pattern: 2-1-0-1-2-1-0-1
      const downSeq = len === 3 ? [2, 1, 0, 1, 2, 1, 0, 1] : [3, 2, 1, 0, 1, 2, 3, 2];
      for (let i = 0; i < 8; i++) notes.push({ keys: [pitches[downSeq[i] % len]], duration: '8' });
    } else {
      // 1-3-5-3 repeated
      const seq = [0, Math.min(1, len - 1), Math.min(2, len - 1), Math.min(1, len - 1)];
      for (let i = 0; i < 8; i++) notes.push({ keys: [pitches[seq[i % seq.length]]], duration: '8' });
    }
  }
  return notes;
}

function trebleBlockedWaltz(pitches: string[], ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 3) return [{ keys: pitches, duration: 'hd' }];
  // 6/8 — one dotted half (6 eighth notes)
  if (beats === 6) return [{ keys: pitches, duration: 'hd' }];
  return [{ keys: pitches, duration: 'h' }, { keys: pitches, duration: 'h' }];
}

function trebleArpeggio(pitches: string[], ts: string): Note[] {
  const beats = beatsFor(ts);
  const notes: Note[] = [];
  const len = pitches.length;
  const patterns = ['up', 'up-down', 'pendel'];
  const pattern = pick(patterns);

  const totalEighths = beats * 2;

  if (pattern === 'up') {
    for (let i = 0; i < totalEighths; i++) notes.push({ keys: [pitches[i % len]], duration: '8' });
  } else if (pattern === 'up-down') {
    // up then down
    for (let i = 0; i < len; i++) notes.push({ keys: [pitches[i]], duration: '8' });
    for (let i = len - 2; i >= 0; i--) notes.push({ keys: [pitches[i]], duration: '8' });
    while (notes.length < totalEighths) notes.push({ keys: [pitches[0]], duration: '8' });
    return notes.slice(0, totalEighths);
  } else {
    // pendel: 1-3-5-8-5-3 repeating
    const seq = len >= 4
      ? [0, 1, 2, 3, 2, 1]
      : [0, 1, 2, 1, 0, 1];
    for (let i = 0; i < totalEighths; i++) notes.push({ keys: [pitches[seq[i % seq.length] % len]], duration: '8' });
  }
  return notes;
}

function trebleAlberti(pitches: string[], ts: string): Note[] {
  // 1-5-3-5 pattern in eighths
  const beats = beatsFor(ts);
  const totalEighths = beats * 2;
  const len = pitches.length;
  const root = pitches[0];
  const third = pitches[Math.min(1, len - 1)];
  const fifth = pitches[Math.min(2, len - 1)];
  const pattern = [root, fifth, third, fifth];
  const notes: Note[] = [];
  for (let i = 0; i < totalEighths; i++) {
    notes.push({ keys: [pattern[i % pattern.length]], duration: '8' });
  }
  return notes;
}

function trebleBlockedSeventh(pitches: string[], ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 4) {
    return [
      { keys: pitches, duration: 'h' },
      { keys: pitches, duration: 'h' },
    ];
  }
  return [{ keys: pitches, duration: 'hd' }];
}

function trebleMixed(pitches: string[], ts: string): Note[] {
  const r = Math.random();
  if (r < 0.33) return trebleBlocked(pitches, ts);
  if (r < 0.66) return trebleBroken(pitches, ts);
  return trebleArpeggio(pitches, ts);
}

// ===== Bass generators per mode =====

function bassRoot(rootKey: string, ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 4) return [{ keys: [rootKey], duration: 'w' }];
  if (beats === 3) return [{ keys: [rootKey], duration: 'hd' }];
  // 6/8 — one dotted half (6 eighth notes = 1 bar)
  return [{ keys: [rootKey], duration: 'hd' }];
}

function bassRootFifth(rootKey: string, fifthKey: string, ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 4) {
    return [
      { keys: [rootKey], duration: 'h' },
      { keys: [fifthKey], duration: 'h' },
    ];
  }
  if (beats === 3) {
    return [
      { keys: [rootKey], duration: 'h' },
      { keys: [fifthKey], duration: 'q' },
    ];
  }
  return [
    { keys: [rootKey], duration: 'hd' },
    { keys: [fifthKey], duration: 'hd' },
  ];
}

function bassAlbertiLight(rootKey: string, fifthKey: string, ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 4) {
    // 4 quarters: Root-Fifth-Root-Fifth (synced with 8 eighths in treble)
    return [
      { keys: [rootKey], duration: 'q' },
      { keys: [fifthKey], duration: 'q' },
      { keys: [rootKey], duration: 'q' },
      { keys: [fifthKey], duration: 'q' },
    ];
  }
  if (beats === 3) {
    return [
      { keys: [rootKey], duration: 'q' },
      { keys: [fifthKey], duration: 'q' },
      { keys: [rootKey], duration: 'q' },
    ];
  }
  return [{ keys: [rootKey], duration: 'hd' }];
}

function bassWaltz(rootKey: string, fifthKey: string, ts: string): Note[] {
  const beats = beatsFor(ts);
  if (beats === 3) {
    return [
      { keys: [rootKey], duration: 'q' },
      { keys: [fifthKey], duration: 'q' },
      { keys: [fifthKey], duration: 'q' },
    ];
  }
  if (beats === 6) {
    // 6/8 idiomatic waltz: two dotted quarters (Bass-Chord pattern)
    return [
      { keys: [rootKey], duration: 'qd' },
      { keys: [fifthKey], duration: 'qd' },
    ];
  }
  return [
    { keys: [rootKey], duration: 'q' },
    { keys: [fifthKey], duration: 'q' },
    { keys: [rootKey], duration: 'q' },
    { keys: [fifthKey], duration: 'q' },
  ];
}

function bassWalking(scaleNotes: number[], degree: number, octave: number, useFlats: boolean, ts: string): Note[] {
  const beats = beatsFor(ts);
  const notes: Note[] = [];
  const startIdx = degree - 1;
  for (let b = 0; b < beats; b++) {
    const scaleIdx = (startIdx + b) % 7;
    const semi = scaleNotes[scaleIdx];
    notes.push({ keys: [semitoneToVexflow(semi, octave, useFlats)], duration: ts === '6/8' ? '8' : 'q' });
  }
  return notes;
}

function bassMixed(
  scaleNotes: number[], degree: number, rootKey: string, fifthKey: string,
  octave: number, useFlats: boolean, ts: string
): Note[] {
  const r = Math.random();
  if (r < 0.33) return bassWalking(scaleNotes, degree, octave, useFlats, ts);
  if (r < 0.66) return bassWaltz(rootKey, fifthKey, ts);
  return bassRoot(rootKey, ts);
}

// ===== Treble dispatch =====

function generateTreble(mode: ChordMode, pitches: string[], ts: string): Note[] {
  switch (mode) {
    case 'block-chords': return trebleBlocked(pitches, ts);
    case 'inversions': return trebleBlockedInversions(pitches, ts);
    case 'broken-chords': return trebleBroken(pitches, ts);
    case 'waltz': return trebleBlockedWaltz(pitches, ts);
    case 'arpeggio': return trebleArpeggio(pitches, ts);
    case 'alberti': return trebleAlberti(pitches, ts);
    case 'seventh-chords': return trebleBlockedSeventh(pitches, ts);
    case 'mixed-patterns': return trebleMixed(pitches, ts);
    default: return trebleBlocked(pitches, ts);
  }
}

// ===== Bass dispatch =====

interface BassResult {
  notes: Note[];
  style: BassStyle;
}

function generateBass(
  mode: ChordMode, scaleNotes: number[], degree: number,
  rootKey: string, fifthKey: string,
  octave: number, useFlats: boolean, ts: string
): BassResult {
  const beats = beatsFor(ts);
  switch (mode) {
    case 'block-chords':
      return { notes: bassRoot(rootKey, ts), style: 'root' };
    case 'inversions':
      return { notes: bassRootFifth(rootKey, fifthKey, ts), style: 'rootFifth' };
    case 'broken-chords': {
      const style: BassStyle = beats === 3 ? 'albertiLight3' : 'albertiLight';
      return { notes: bassAlbertiLight(rootKey, fifthKey, ts), style };
    }
    case 'waltz': {
      const style: BassStyle = beats === 6 ? 'waltz68' : 'waltz';
      return { notes: bassWaltz(rootKey, fifthKey, ts), style };
    }
    case 'arpeggio': {
      const style: BassStyle = beats === 6 ? 'walking6' : beats === 3 ? 'walking3' : 'walking';
      return { notes: bassWalking(scaleNotes, degree, octave, useFlats, ts), style };
    }
    case 'alberti':
      return { notes: bassRoot(rootKey, ts), style: 'root' };
    case 'seventh-chords': {
      const style: BassStyle = beats === 6 ? 'walking6' : beats === 3 ? 'walking3' : 'walking';
      return { notes: bassWalking(scaleNotes, degree, octave, useFlats, ts), style };
    }
    case 'mixed-patterns': {
      const mixedResult = bassMixed(scaleNotes, degree, rootKey, fifthKey, octave, useFlats, ts);
      // bassMixed randomly picks between walking/waltz/root, we'll use a generic style
      return { notes: mixedResult, style: 'walking' };
    }
    default:
      return { notes: bassRoot(rootKey, ts), style: 'root' };
  }
}

// ===== Main generator =====

function getKeySignature(key: string): string {
  const { root, isMinor } = parseKey(key);
  if (!isMinor) return root;
  const minorRoot = SEMITONE_MAP[root] ?? 0;
  const relMajorSemi = (minorRoot + 3) % 12;
  const names: Record<number, string> = {
    0: 'C', 1: 'Db', 2: 'D', 3: 'Eb', 4: 'E', 5: 'F',
    6: 'Gb', 7: 'G', 8: 'Ab', 9: 'A', 10: 'Bb', 11: 'B',
  };
  return names[relMajorSemi] ?? 'C';
}

// ===== Fingering assignment =====

/** Standard RH fingerings for block/broken chords (Czerny, Hanon, Alfred's) */
const RH_TRIAD_FINGERINGS: Record<number, number[]> = {
  0: [1, 3, 5],       // root position
  1: [1, 2, 4],       // 1st inversion — [1,2,4] avoids unnecessary stretch
  2: [1, 3, 5],       // 2nd inversion
};
const RH_SEVENTH_FINGERINGS: Record<number, number[]> = {
  0: [1, 2, 3, 5],
  1: [1, 2, 4, 5],
  2: [1, 2, 3, 5],    // 2nd inversion — [1,2,3,5] for tertian interval
  3: [1, 2, 3, 5],
};
const LH_TRIAD_FINGERINGS: Record<number, number[]> = {
  0: [5, 3, 1],
  1: [5, 3, 1],
  2: [5, 2, 1],
};
const LH_SEVENTH_FINGERINGS: Record<number, number[]> = {
  0: [5, 3, 2, 1],
  1: [5, 4, 2, 1],
  2: [5, 3, 2, 1],
  3: [5, 3, 2, 1],
};

/** LH bass pattern fingerings by style */
const LH_BASS_FINGERINGS = {
  root: [5],                    // Single bass note
  rootFifth: [5, 3],            // Root-Fifth pattern
  waltz: [5, 1, 1],             // 3/4 Oom-Pah-Pah
  waltz68: [5, 3],              // 6/8 Bass-Chord
  walking: [5, 4, 3, 2],        // Walking bass (4 notes)
  walking3: [5, 4, 3],          // Walking bass (3 notes)
  walking6: [5, 4, 3, 2, 3, 4], // Walking bass (6/8)
  albertiLight: [5, 3, 5, 3],   // R-5-R-5 pattern
  albertiLight3: [5, 3, 5],     // 3/4 variant
};

function assignFingering(notes: Note[], pitchCount: number, inversion: number, isLeft: boolean): void {
  const fourVoice = pitchCount >= 4;
  const table = isLeft
    ? (fourVoice ? LH_SEVENTH_FINGERINGS : LH_TRIAD_FINGERINGS)
    : (fourVoice ? RH_SEVENTH_FINGERINGS : RH_TRIAD_FINGERINGS);
  const fingers = table[inversion] ?? table[0];

  for (const note of notes) {
    if (note.keys.length > 1) {
      // Block chord: assign fingering of lowest note (convention: show root finger)
      note.fingering = fingers[0];
    }
  }

  // For single-note patterns, assign fingers sequentially with octave-awareness
  let fingerIdx = 0;
  let prevOctave: number | null = null;

  for (const note of notes) {
    if (note.keys.length === 1) {
      // Parse octave from note.keys[0] (format: 'notename/octave')
      const keyStr = note.keys[0];
      const parts = keyStr.split('/');
      const currentOctave = parts.length === 2 ? parseInt(parts[1], 10) : null;

      // Reset finger index if octave changed
      if (prevOctave !== null && currentOctave !== null && currentOctave !== prevOctave) {
        fingerIdx = 0; // Thumb reset for octave change
      }

      note.fingering = fingers[fingerIdx % fingers.length];
      fingerIdx++;
      prevOctave = currentOctave;
    }
  }
}

type BassStyle = 'root' | 'rootFifth' | 'waltz' | 'waltz68' | 'walking' | 'walking3' | 'walking6' | 'albertiLight' | 'albertiLight3';

function assignBassFingering(notes: Note[], style: BassStyle): void {
  const fingers = LH_BASS_FINGERINGS[style];
  if (!fingers) return;

  let fingerIdx = 0;
  for (const note of notes) {
    if (note.keys.length === 1) {
      note.fingering = fingers[fingerIdx % fingers.length];
      fingerIdx++;
    }
  }
}

export function generateChordExercise(config: ChordConfig): Exercise {
  const { mode, keyGroup, barCount, showFingering, showChordNames: _sc } = config;
  const modeCfg = MODE_CONFIGS[mode];
  const groupKeys = KEY_GROUPS[keyGroup].keys;
  const key = pick(groupKeys);
  const { root, isMinor } = parseKey(key);
  const useFlats = FLAT_KEYS.includes(key) || FLAT_KEYS.includes(root);
  const scaleNotes = getScaleNotes(key);

  // Resolve time signature
  let timeSignature: '4/4' | '3/4' | '6/8';
  if (config.timeSignature === 'random') {
    timeSignature = pick(modeCfg.timeSignatures);
  } else if (modeCfg.timeSignatures.includes(config.timeSignature as '4/4' | '3/4' | '6/8')) {
    timeSignature = config.timeSignature as '4/4' | '3/4' | '6/8';
  } else {
    timeSignature = modeCfg.timeSignatures[0];
  }

  const useJazz = mode === 'seventh-chords' || mode === 'mixed-patterns';
  const progression = getProgression(isMinor, barCount, useJazz);
  const keySignature = getKeySignature(key);
  const fourVoice = modeCfg.voiceCount === 4;
  const trebleOctave = 4;
  const bassOctave = 3;

  const bars: Bar[] = [];
  let previousChordPitches: number[] | null = null;

  for (let i = 0; i < barCount; i++) {
    const degree = progression[i];

    // Determine inversion: use voice-leading for 'inversions' mode, random otherwise
    let inversion: number;
    const idx = degree - 1;
    const currentRoot = scaleNotes[idx % 7];
    const currentThird = scaleNotes[(idx + 2) % 7];
    const currentFifth = scaleNotes[(idx + 4) % 7];
    let currentChordPitches = [currentRoot, currentThird, currentFifth];
    if (fourVoice) {
      const currentSeventh = scaleNotes[(idx + 6) % 7];
      currentChordPitches = [currentRoot, currentThird, currentFifth, currentSeventh];
    }

    if (mode === 'inversions') {
      inversion = getBestInversion(currentChordPitches, previousChordPitches, modeCfg.inversions);
    } else {
      inversion = pick(modeCfg.inversions);
    }

    previousChordPitches = currentChordPitches;

    const pitches = getChordPitches(degree, scaleNotes, trebleOctave, inversion, useFlats, fourVoice);

    const trebleNotes = generateTreble(mode, pitches, timeSignature);

    const rootSemi = scaleNotes[(degree - 1) % 7];
    const fifthSemi = scaleNotes[(degree + 3) % 7];
    const rootKey = semitoneToVexflow(rootSemi, bassOctave, useFlats);
    const fifthOct = fifthSemi <= rootSemi ? bassOctave + 1 : bassOctave;
    const fifthKey = semitoneToVexflow(fifthSemi, fifthOct, useFlats);

    const bassResult = generateBass(mode, scaleNotes, degree, rootKey, fifthKey, bassOctave, useFlats, timeSignature);

    if (showFingering) {
      assignFingering(trebleNotes, pitches.length, inversion, false);
      assignBassFingering(bassResult.notes, bassResult.style);
    }

    bars.push({ number: i + 1, notes: trebleNotes, bassNotes: bassResult.notes, chordDegree: degree });
  }

  const qualityLabel = isMinor ? 'Moll' : 'Dur';
  const id = `chord_${mode}_${key}_${barCount}bars_${Date.now()}`;

  return {
    id,
    level: 1, // Not used in mode-based system but required by Exercise type
    name: `${key}-${qualityLabel} — ${modeCfg.name}`,
    description: `${modeCfg.name} — ${key}-${qualityLabel}, ${barCount} Takte, ${timeSignature}`,
    difficulty: modeCfg.difficulty.includes('Advanced') ? 'advanced' : modeCfg.difficulty.includes('Intermediate') ? 'intermediate' : 'beginner',
    timeSignature,
    keySignature,
    originalKey: isMinor ? key : undefined,
    clef: 'treble',
    grandStaff: true,
    tempo: 72,
    bars,
  };
}
