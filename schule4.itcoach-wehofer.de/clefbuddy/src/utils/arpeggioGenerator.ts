/**
 * Arpeggio Generator — produces standard Exercise objects for arpeggio practice
 */
import type { Exercise, Bar, Note } from '../types/music';
import type { ArpeggioConfig } from '../types/arpeggio';
import {
  ARPEGGIO_FORMULAS,
  getArpeggioFingering,
  isSeventh,
  ARPEGGIO_TYPE_LABELS,
  ARPEGGIO_PATTERN_LABELS,
  ARPEGGIO_INVERSION_LABELS,
} from '../data/arpeggioData';
import {
  FLAT_KEYS,
  rootSemitone,
  semitoneToVexflow,
} from './harmonyCommon';

/**
 * Get the note duration based on level.
 * Stufe 3: Viertel (q) - langsam, Grundlagen
 * Stufe 4: Achtel (8) - Standard
 * Stufe 5: Achtel (8) - Standard
 * Stufe 6: 16tel (16) - schnell, fortgeschritten
 */
function getDurationForLevel(level: number): string {
  if (level <= 3) return 'q';   // Viertel
  if (level <= 5) return '8';   // Achtel
  return '16';                   // 16tel
}

/**
 * Get notes per bar based on duration.
 * 4/4 time: 4 quarter notes, 8 eighth notes, 16 sixteenth notes
 */
function getNotesPerBar(duration: string): number {
  switch (duration) {
    case 'q': return 4;
    case '8': return 8;
    case '16': return 16;
    default: return 8;
  }
}

/**
 * Get rest duration based on note duration.
 */
function getRestDuration(duration: string): string {
  return duration + 'r';
}

/**
 * Apply inversion to the arpeggio formula.
 * Inversion 0: root position (e.g., C-E-G)
 * Inversion 1: first inversion (e.g., E-G-C)
 * Inversion 2: second inversion (e.g., G-C-E)
 * Inversion 3: third inversion for 7th chords (e.g., B-C-E-G)
 */
function applyInversion(formula: number[], inversion: number): number[] {
  if (inversion === 0) return formula;

  const result = [...formula];
  for (let i = 0; i < inversion; i++) {
    const first = result.shift()!;
    result.push(first + 12); // Move to next octave
  }

  // Normalize so the first note is 0
  const offset = result[0];
  return result.map(n => n - offset);
}

/**
 * Generate arpeggio pitches for one or two octaves.
 * Returns array of {semitone, octave} objects.
 */
function generateArpeggioPitches(
  key: string,
  chordType: ArpeggioConfig['chordType'],
  inversion: ArpeggioConfig['inversion'],
  octaves: 1 | 2,
  startOctave: number,
): { semi: number; octave: number }[] {
  const baseFormula = ARPEGGIO_FORMULAS[chordType];
  const invertedFormula = applyInversion(baseFormula, inversion);
  const root = rootSemitone(key);

  const pitches: { semi: number; octave: number }[] = [];

  for (let oct = 0; oct < octaves; oct++) {
    const baseOctave = startOctave + oct;

    for (let i = 0; i < invertedFormula.length; i++) {
      // Skip the top note of the first octave for 2-octave arpeggios
      // The top note of first octave = first note of second octave
      if (octaves === 2 && oct === 0 && i === invertedFormula.length - 1) continue;

      const semitones = invertedFormula[i];
      const extraOctave = Math.floor(semitones / 12);
      const semitoneInOctave = semitones % 12;
      const absoluteSemitone = root + semitoneInOctave;
      const octaveCorrection = Math.floor(absoluteSemitone / 12);
      const noteOctave = baseOctave + extraOctave + octaveCorrection;

      pitches.push({ semi: absoluteSemitone % 12, octave: noteOctave });
    }
  }

  // Add the final octave note for completion
  if (octaves === 2) {
    const topFormulaSemi = invertedFormula[0] + 24; // Two octaves up
    const absoluteSemitone = root + (topFormulaSemi % 12);
    const noteOctave = startOctave + 2 + Math.floor(absoluteSemitone / 12);
    pitches.push({ semi: absoluteSemitone % 12, octave: noteOctave });
  } else {
    // For 1 octave, add the octave note
    const absoluteSemitone = root + invertedFormula[0];
    const noteOctave = startOctave + 1 + Math.floor(absoluteSemitone / 12);
    pitches.push({ semi: absoluteSemitone % 12, octave: noteOctave });
  }

  return pitches;
}

/**
 * Build fingering sequence for the arpeggio.
 */
function buildFingering(
  chordType: ArpeggioConfig['chordType'],
  inversion: ArpeggioConfig['inversion'],
  octaves: 1 | 2,
  hand: 'rh' | 'lh',
  direction: 'ascending' | 'descending',
  noteCount: number,
): number[] {
  const fingering = getArpeggioFingering(chordType, inversion);
  const fingerData = hand === 'rh' ? fingering.rh : fingering.lh;
  const fingerArr = direction === 'ascending' ? fingerData.ascending : fingerData.descending;

  const result: number[] = [];

  // For single octave, just use the pattern directly
  if (octaves === 1) {
    for (let i = 0; i < noteCount && i < fingerArr.length; i++) {
      result.push(fingerArr[i]);
    }
    return result;
  }

  // For 2 octaves, extend the pattern
  // The pattern repeats with thumb (1) on the octave crossing
  const notesPerOctave = isSeventh(chordType) ? 4 : 3;

  // First octave (without top note)
  for (let i = 0; i < notesPerOctave && i < fingerArr.length; i++) {
    result.push(fingerArr[i]);
  }

  // Thumb on octave crossing
  result.push(1);

  // Second octave: continue from finger after thumb
  for (let i = 1; i < fingerArr.length && result.length < noteCount; i++) {
    result.push(fingerArr[i]);
  }

  // Pad if needed
  while (result.length < noteCount) {
    result.push(fingerArr[result.length % fingerArr.length]);
  }

  return result;
}

/**
 * Apply pattern to pitches (up, down, up-down, alternating, contrary).
 * Note: 'alternating' and 'contrary' only affect both-hands mode
 * For single hand, 'alternating' behaves like 'up-down'
 */
function applyPattern(
  pitches: { semi: number; octave: number }[],
  pattern: ArpeggioConfig['pattern'],
  hand?: 'rh' | 'lh',  // For contrary motion
): { semi: number; octave: number }[] {
  switch (pattern) {
    case 'up':
      return pitches;
    case 'down':
      return [...pitches].reverse();
    case 'up-down': {
      // Ascending + descending (skip duplicate at the top)
      const descending = [...pitches].reverse().slice(1);
      return [...pitches, ...descending];
    }
    case 'alternating': {
      // For both-hands mode: each hand does up-down
      const altDescending = [...pitches].reverse().slice(1);
      return [...pitches, ...altDescending];
    }
    case 'contrary': {
      // Contrary motion: RH goes up while LH goes down (and vice versa)
      if (hand === 'lh') {
        // LH starts descending, then ascending
        const descending = [...pitches].reverse();
        const ascending = pitches.slice(1);
        return [...descending, ...ascending];
      }
      // RH starts ascending, then descending (default/same as up-down)
      const desc = [...pitches].reverse().slice(1);
      return [...pitches, ...desc];
    }
    default:
      return pitches;
  }
}

/**
 * Generate notes for one hand.
 */
function generateArpeggioNotes(
  key: string,
  config: ArpeggioConfig,
  startOctave: number,
  hand: 'rh' | 'lh',
): Note[] {
  const { chordType, pattern, inversion, octaves, showFingering, level } = config;
  const useFlats = FLAT_KEYS.includes(key);
  const duration = getDurationForLevel(level);

  // Generate base pitches (ascending)
  const basePitches = generateArpeggioPitches(key, chordType, inversion, octaves, startOctave);

  // Apply pattern (pass hand for contrary motion)
  const patternedPitches = applyPattern(basePitches, pattern, hand);

  // Build fingering
  const fingeringAsc = buildFingering(chordType, inversion, octaves, hand, 'ascending', basePitches.length);
  const fingeringDesc = buildFingering(chordType, inversion, octaves, hand, 'descending', basePitches.length);

  let fullFingering: number[];
  if (pattern === 'up') {
    fullFingering = fingeringAsc;
  } else if (pattern === 'down') {
    fullFingering = fingeringDesc;
  } else if (pattern === 'contrary' && hand === 'lh') {
    // LH starts descending in contrary motion
    fullFingering = [...fingeringDesc, ...fingeringAsc.slice(1)];
  } else {
    // up-down, alternating, or contrary (RH): ascending + descending (without duplicate)
    fullFingering = [...fingeringAsc, ...fingeringDesc.slice(1)];
  }

  const notes: Note[] = [];

  for (let i = 0; i < patternedPitches.length; i++) {
    const p = patternedPitches[i];
    const vexKey = semitoneToVexflow(p.semi, p.octave, useFlats);

    const note: Note = {
      keys: [vexKey],
      duration, // Level-appropriate duration
    };

    if (showFingering && i < fullFingering.length) {
      note.fingering = fullFingering[i];
    }

    notes.push(note);
  }

  return notes;
}

/**
 * Main generator function.
 */
export function generateArpeggio(config: ArpeggioConfig): Exercise {
  const { key, chordType, pattern, inversion, octaves, bars: targetBars, tempo, hand } = config;

  // Determine start octaves
  // RH: octave 4 for 1 octave, 3 for 2 octaves
  // LH: octave 2 for 1 octave, 2 for 2 octaves
  const rhStartOctave = octaves === 2 ? 3 : 4;
  const lhStartOctave = 2;

  let rhNotes: Note[] = [];
  let bassNotes: Note[] = [];

  if (hand === 'rh' || hand === 'both') {
    rhNotes = generateArpeggioNotes(key, config, rhStartOctave, 'rh');
  }

  if (hand === 'lh' || hand === 'both') {
    bassNotes = generateArpeggioNotes(key, config, lhStartOctave, 'lh');
  }

  // If only one hand, put rests in the other
  if (hand === 'rh' && bassNotes.length === 0) {
    // Create rests for bass matching the length of treble
    const restCount = Math.ceil(rhNotes.length / 2); // Quarter rests for eighth notes
    for (let i = 0; i < restCount; i++) {
      bassNotes.push({ keys: ['d/3'], duration: 'qr' });
    }
  }

  if (hand === 'lh' && rhNotes.length === 0) {
    // Create rests for treble matching the length of bass
    const restCount = Math.ceil(bassNotes.length / 2);
    for (let i = 0; i < restCount; i++) {
      rhNotes.push({ keys: ['b/4'], duration: 'qr' });
    }
  }

  // Distribute notes into bars (4/4 time)
  // Notes per bar depends on level-appropriate duration
  const duration = getDurationForLevel(config.level);
  const notesPerBar = getNotesPerBar(duration);
  const restDuration = getRestDuration(duration);

  const bars: Bar[] = [];
  const totalRhNotes = rhNotes.length;
  const totalBassNotes = bassNotes.length;

  // For 'both' hands, they play together
  // For single hand, the other hand rests
  const naturalBars = Math.max(
    Math.ceil(totalRhNotes / notesPerBar),
    Math.ceil(totalBassNotes / notesPerBar)
  );

  // Use targetBars from config, but ensure we have at least naturalBars
  // If targetBars > natural, we repeat the arpeggio pattern
  const totalBars = Math.max(naturalBars, targetBars);

  // Extend notes by repeating if needed
  const extendNotes = (notes: Note[], targetLength: number): Note[] => {
    if (notes.length === 0) return notes;
    const result = [...notes];
    while (result.length < targetLength) {
      result.push(...notes);
    }
    return result.slice(0, targetLength);
  };

  const totalNotesNeeded = totalBars * notesPerBar;
  const extendedRhNotes = extendNotes(rhNotes, totalNotesNeeded);
  const extendedBassNotes = hand === 'rh' ? bassNotes : extendNotes(bassNotes, totalNotesNeeded);

  for (let i = 0; i < totalBars; i++) {
    const barRhNotes = extendedRhNotes.slice(i * notesPerBar, (i + 1) * notesPerBar);
    const barBassNotes = extendedBassNotes.slice(i * notesPerBar, (i + 1) * notesPerBar);

    // Pad incomplete bars with rests
    while (barRhNotes.length < notesPerBar) {
      barRhNotes.push({ keys: ['b/4'], duration: restDuration });
    }

    // Bass: if using rests, use quarter rests for simplicity
    // If using notes, pad with appropriate duration rests
    if (hand === 'rh') {
      // Bass has quarter rests (4 per bar regardless of treble duration)
      while (barBassNotes.length < 4) {
        barBassNotes.push({ keys: ['d/3'], duration: 'qr' });
      }
    } else {
      while (barBassNotes.length < notesPerBar) {
        barBassNotes.push({ keys: ['d/3'], duration: restDuration });
      }
    }

    bars.push({
      number: i + 1,
      notes: barRhNotes,
      bassNotes: barBassNotes,
    });
  }

  // Build exercise ID
  const isMinor = key.endsWith('m');
  const typeShort = chordType === 'major' ? 'maj' :
    chordType === 'minor' ? 'min' :
    chordType === 'dominant7' ? 'dom7' :
    chordType === 'diminished' ? 'dim' :
    chordType === 'augmented' ? 'aug' :
    chordType === 'major7' ? 'maj7' : 'min7';

  const id = `arp_${key}_${typeShort}_${pattern}_inv${inversion}_${octaves}oct_${Date.now()}`;

  // Determine key signature for VexFlow (always major)
  // For minor keys like "Am", use "C" (relative major)
  // For now, just use the base key
  const keySignature = isMinor ? key.slice(0, -1) : key;

  const typeName = ARPEGGIO_TYPE_LABELS[chordType];
  const patternName = ARPEGGIO_PATTERN_LABELS[pattern];
  const inversionName = ARPEGGIO_INVERSION_LABELS[inversion];

  return {
    id,
    level: config.level,
    name: `${key} ${typeName} Arpeggio`,
    description: `${key} ${typeName}, ${inversionName}, ${patternName}, ${octaves} Oktave(n)`,
    difficulty: 'intermediate',
    timeSignature: '4/4',
    keySignature,
    originalKey: key,
    clef: 'treble',
    grandStaff: true,
    tempo,
    bars,
  };
}
