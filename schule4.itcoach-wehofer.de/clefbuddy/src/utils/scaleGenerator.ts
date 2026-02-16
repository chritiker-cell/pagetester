/**
 * Scale Generator — produces standard Exercise objects for scale practice
 */
import type { Exercise, Bar, Note } from '../types/music';
import type { ScaleConfig } from '../types/scales';
import { SCALE_FORMULAS, getFingering } from '../data/scaleData';

// Note names by semitone offset from C
const NOTE_NAMES_SHARP = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
const NOTE_NAMES_FLAT = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];

// Keys that use flats
const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];

/**
 * Convert a note name (e.g. 'c', 'c#', 'db') to a semitone (0-11).
 */
function noteNameToSemitone(noteName: string): number {
  const map: Record<string, number> = {
    'c': 0, 'c#': 1, 'db': 1, 'd': 2, 'd#': 3, 'eb': 3,
    'e': 4, 'f': 5, 'f#': 6, 'gb': 6, 'g': 7, 'g#': 8,
    'ab': 8, 'a': 9, 'a#': 10, 'bb': 10, 'b': 11,
  };
  return map[noteName.toLowerCase()] ?? 0;
}

/**
 * Convert a semitone (0-11) to a note name using sharps or flats.
 */
function semitoneToNoteName(semitone: number, useFlats: boolean): string {
  const names = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  return names[((semitone % 12) + 12) % 12];
}

function rootSemitone(key: string): number {
  const map: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
  };
  return map[key] ?? 0;
}

/**
 * Convert a semitone offset (relative to the root within one octave, 0-11)
 * plus an explicit octave number into a VexFlow key string.
 */
function semitoneToVexflow(semitoneInOctave: number, octave: number, useFlats: boolean): string {
  const noteIndex = ((semitoneInOctave % 12) + 12) % 12;
  const names = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  return `${names[noteIndex]}/${octave}`;
}

/**
 * Generate scale notes as a flat array.
 * For ascending: startOctave is the bottom (e.g. RH=4, LH=3).
 * For descending: startOctave is the TOP octave (e.g. RH=5 for 2-oct starting from 4).
 */
function generateScaleNotes(
  key: string,
  scaleType: ScaleConfig['scaleType'],
  startOctave: number,
  octaves: 1 | 2,
  hand: 'rh' | 'lh',
  direction: 'ascending' | 'descending',
  showFingering: boolean,
): Note[] {
  const formula = SCALE_FORMULAS[scaleType]; // e.g. [0,2,4,5,7,9,11,12]
  const root = rootSemitone(key);
  const useFlats = FLAT_KEYS.includes(key);
  const fingering = getFingering(key, scaleType);
  const fingerData = hand === 'rh' ? fingering.rh : fingering.lh;

  const notes: Note[] = [];

  // Build all pitches as ascending first, then reverse for descending.
  // This avoids complex octave math for the descending case.
  const ascPitches: { semi: number; octave: number }[] = [];

  for (let oct = 0; oct < octaves; oct++) {
    const baseOctave = startOctave + oct;

    for (let i = 0; i < formula.length; i++) {
      // Skip the top note of non-last octave to avoid duplicates
      if (octaves === 2 && oct === 0 && i === formula.length - 1) continue;

      const semitones = formula[i]; // 0..12
      const extraOctave = Math.floor(semitones / 12);
      const semitoneInOctave = semitones % 12;
      const absoluteSemitone = root + semitoneInOctave;
      const octaveCorrection = Math.floor(absoluteSemitone / 12);
      const noteOctave = baseOctave + extraOctave + octaveCorrection;

      ascPitches.push({ semi: absoluteSemitone % 12, octave: noteOctave });
    }
  }

  const allPitches = direction === 'ascending' ? ascPitches : [...ascPitches].reverse();

  // Build full fingering sequence.
  // 1 octave ascending/descending = 8 notes = 8 fingers (the full pattern).
  // 2 octaves: 15 notes. The join note (octave boundary) gets the LAST finger
  // of the pattern (e.g. RH asc: finger 5 on c/5? No — standard practice is
  // finger 1 (thumb) on the join note for RH ascending).
  //
  // The ascending pattern already encodes this: RH [1,2,3,1,2,3,4,5].
  // For 2 octaves, the first 7 notes use pattern[0..6], then the join note
  // + second octave uses the full pattern[0..7] again.
  //
  // ascPitches layout: [oct0: 7 notes (top skipped)] [oct1: 8 notes (incl. top)]
  // So the join note = first note of oct1 = should get pattern[0].
  //
  // For descending (reversed ascPitches):
  // [oct1-reversed: 8 notes (top first)] [oct0-reversed: 7 notes (bottom = root)]
  // The join note = last of oct1 = first of oct0 = pattern[last].
  // Build fingering for the full note sequence.
  // 1-octave pattern is 8 notes (e.g. RH asc: [1,2,3,1,2,3,4,5]).
  // For 2 octaves the join note (octave boundary) gets the LAST finger of
  // the first octave's pattern, then the second octave continues from pattern[1].
  //
  // ascPitches layout: [7 notes (oct0, top skipped)] [8 notes (oct1, incl. top)]
  // Fingering: pattern[0..6] + [pattern[7]] + pattern[1..7]
  //          = 7 + 1 + 7 = 15 fingers for 15 notes
  //
  // For descending (reversed): [8 notes (top oct)] [7 notes (bottom oct)]
  // desc pattern e.g. RH: [5,4,3,2,1,3,2,1]
  // Fingering: pattern[0..7] + pattern[1..7]
  //          = 8 + 7 = 15 (but we only have 14... the join note got pattern[7])
  // Actually for descending reversed: first 8 = top octave full, join note = pattern[7],
  // remaining 7 from bottom octave = pattern[1..7].
  // Wait: reversed ascPitches gives 8+7=15. First note = top, last = root.
  // Fingering: pattern[0..7] for first 8, then pattern[1..7] for remaining 7.
  // BUT the 8th note (join) should get pattern[7] AND the 9th should get pattern[1].
  // Since pattern[7]=1 for RH desc, and pattern[1]=4 for RH desc, that gives:
  // ...1, 4, 3, 2, 1, 3, 2, 1 — which is correct!
  // Build the full fingering for all notes.
  // The 8-note pattern covers one octave. For 2 octaves (15 notes), the join
  // note (octave boundary) always gets finger 1 (thumb), then the pattern
  // continues from the position AFTER the first thumb occurrence.
  //
  // RH ascending [1,2,3,1,2,3,4,5]: thumb at index 0.
  //   2-oct: pattern[0..6] + 1 + pattern[1..7] = 1,2,3,1,2,3,4, 1, 2,3,1,2,3,4,5
  // LH ascending [5,4,3,2,1,3,2,1]: thumb at index 4.
  //   2-oct: pattern[0..6] + 1 + pattern[5..7]+pattern[0..4] ... no, simpler:
  //
  // Actually the standard approach: the join note gets the LAST finger of the
  // first-octave pattern. For 2 octaves the second octave uses the same pattern
  // but starting from index 1 (skipping the root finger since the join = root).
  //
  // ascPitches: 7 notes (oct0 without top) + 8 notes (oct1 with top)
  // join note = index 7 = first note of oct1
  //
  // Strategy: pattern[0..6] for first 7, then [pattern[7]] for join, then
  // pattern[1..7] for remaining 7. Total = 7+1+7 = 15.
  //
  // RH asc: [1,2,3,1,2,3,4] + [5] + [2,3,1,2,3,4,5]
  //   → 1-2-3-1-2-3-4-5-2-3-1-2-3-4-5 (c/5 = 5, WRONG: should be 1)
  //
  // The problem: RH pattern puts 5 on the top note, but for 2 octaves the join
  // is NOT the top — it needs thumb. The 1-octave pattern doesn't encode this.
  //
  // Solution: For 2-octave scales, build fingering explicitly.
  // The join note ALWAYS gets finger 1 (thumb crossing).
  // After the thumb, the pattern resumes from the finger that follows the thumb
  // in the original pattern.
  const fingerArr = direction === 'ascending' ? fingerData.ascending : fingerData.descending;
  const fullFingers: number[] = [];

  if (octaves === 1) {
    fullFingers.push(...fingerArr);
  } else {
    // Build: first 7 notes get pattern[0..6]
    for (let i = 0; i < 7; i++) fullFingers.push(fingerArr[i]);
    // Join note: thumb
    fullFingers.push(1);
    // Remaining 7 notes: find where "1" appears in pattern, take the sequence after it
    const afterThumb = [];
    let started = false;
    for (let i = 0; i < fingerArr.length; i++) {
      if (fingerArr[i] === 1 && !started) { started = true; continue; }
      if (started) afterThumb.push(fingerArr[i]);
    }
    // afterThumb for RH asc [1,2,3,1,2,3,4,5] → [2,3,1,2,3,4,5] (7 elements) ✓
    // afterThumb for LH asc [5,4,3,2,1,3,2,1] → [3,2,1] (3 elements) — need to pad
    // For LH we need: after thumb at join, continue 4,3,2,1,3,2,1 (= 7 notes)
    // That's the pattern starting from the note after root: pattern without first element.
    // Actually for LH asc the correct 2-oct is: 5,4,3,2,1,3,2,  1,  4,3,2,1,3,2,1
    // After the join thumb (1), the continuation is [4,3,2,1,3,2,1] = pattern[1..7]
    // For RH asc: 1,2,3,1,2,3,4,  1,  2,3,1,2,3,4,5 → after join = pattern[1..7]
    //
    // So: after the join, ALWAYS use pattern[1..7]!
    fullFingers.length = 8; // keep first 7 + thumb
    for (let i = 1; i < fingerArr.length; i++) fullFingers.push(fingerArr[i]);
  }

  for (let n = 0; n < allPitches.length; n++) {
    const p = allPitches[n];
    const vexKey = semitoneToVexflow(p.semi, p.octave, useFlats);

    const note: Note = {
      keys: [vexKey],
      duration: 'q',
    };

    if (showFingering && n < fullFingers.length) {
      note.fingering = fullFingers[n];
    }

    notes.push(note);
  }

  return notes;
}

export function generateScale(config: ScaleConfig): Exercise {
  const { key, scaleType, mode, octaves, tempo, showFingering } = config;

  // Start octaves depend on number of octaves to keep notes centered on staff
  // 1 octave: RH=4 (e.g. c/4→c/5), LH=2 (e.g. c/2→c/3)
  // 2 octaves: RH=3 (e.g. c/3→c/5), LH=2 (e.g. c/2→c/4)
  const rhStartOctave = octaves === 2 ? 3 : 4;
  const lhStartOctave = 2;

  // Generate ascending + descending for RH
  let rhNotes: Note[];
  let bassNotes: Note[];

  // Both ascending and descending use the same bottom startOctave;
  // descending internally builds ascending then reverses.
  const rhAsc = generateScaleNotes(key, scaleType, rhStartOctave, octaves, 'rh', 'ascending', showFingering);
  const rhDesc = generateScaleNotes(key, scaleType, rhStartOctave, octaves, 'rh', 'descending', showFingering);

  // Skip first note of descending (= top note, already last note of ascending)
  const rhDescTrimmed = rhDesc.slice(1);

  if (mode === 'contraryMotion') {
    // RH ascending from c/4, LH descending from top simultaneously
    rhNotes = [...rhAsc, ...rhDescTrimmed];
    const lhDesc = generateScaleNotes(key, scaleType, lhStartOctave, octaves, 'lh', 'descending', showFingering);
    const lhAsc = generateScaleNotes(key, scaleType, lhStartOctave, octaves, 'lh', 'ascending', showFingering);
    bassNotes = [...lhDesc.slice(0, -1), ...lhAsc]; // trim last of desc (= bottom, same as first of asc)
  } else if (mode === 'rhythmicVariance') {
    // Polyrhythm: 2:1 ratio with symmetrical length
    const polyVariant = config.polyrhythmVariant || '2:1-rh';
    const lhAsc = generateScaleNotes(key, scaleType, lhStartOctave, octaves, 'lh', 'ascending', showFingering);
    const lhDesc = generateScaleNotes(key, scaleType, lhStartOctave, octaves, 'lh', 'descending', showFingering);
    const rhFull = [...rhAsc, ...rhDescTrimmed];
    const lhFull = [...lhAsc, ...lhDesc.slice(1)];

    // For auto mode, alternate hands on repeat
    const rhFast = polyVariant === '2:1-rh' || polyVariant === '2:1-auto';

    if (rhFast) {
      // RH plays eighth notes (fast), LH plays quarter notes but skips every 2nd note
      rhNotes = rhFull.map(n => ({ ...n, duration: '8' }));
      // LH: every 2nd note for equal length (15 notes -> 8 notes)
      bassNotes = lhFull.filter((_, i) => i % 2 === 0);
    } else {
      // LH plays eighth notes (fast), RH plays quarter notes but skips every 2nd note
      rhNotes = rhFull.filter((_, i) => i % 2 === 0);
      bassNotes = lhFull.map(n => ({ ...n, duration: '8' }));
    }
  } else if (mode === 'thirds') {
    // Terzen: Diatonische Terzen basierend auf der Skala
    const useFlats = FLAT_KEYS.includes(key);
    const formula = SCALE_FORMULAS[scaleType]; // e.g. [0,2,4,5,7,9,11,12]
    const root = rootSemitone(key);

    // Build full scale pitches for calculating diatonic thirds
    // This creates a lookup: scale degree -> semitone offset from root
    const scaleIntervals = formula.slice(0, 7); // [0,2,4,5,7,9,11] without the octave repeat

    /**
     * Calculate diatonic third: scale position + 2 (wrapping)
     * E.g., C-Dur: C(0)->E(2), D(1)->F(3), E(2)->G(4), F(3)->A(5), G(4)->B(6), A(5)->C(0+7), B(6)->D(1+7)
     */
    const addDiatonicThird = (notes: Note[]): Note[] => {
      return notes.map((note) => {
        // Skip rests
        if (note.keys[0].includes('r')) return note;

        const [noteName, octaveStr] = note.keys[0].split('/');
        const noteOctave = parseInt(octaveStr);

        // Find this note's scale degree
        const baseSemitone = noteNameToSemitone(noteName);
        const relativeToRoot = ((baseSemitone - root) % 12 + 12) % 12;

        // Find which scale degree this note is
        let scaleDegree = scaleIntervals.indexOf(relativeToRoot);
        if (scaleDegree === -1) {
          // Note not in scale - shouldn't happen, but fallback to major third
          const thirdSemitone = baseSemitone + 4;
          const thirdOctave = thirdSemitone >= 12 ? noteOctave + 1 : noteOctave;
          const thirdKey = semitoneToNoteName(thirdSemitone % 12, useFlats) + '/' + thirdOctave;
          return { ...note, keys: [note.keys[0], thirdKey] };
        }

        // Calculate the third: scale degree + 2 (wrapping to next octave if needed)
        const thirdDegree = (scaleDegree + 2) % 7;
        const thirdSemitoneFromRoot = scaleIntervals[thirdDegree];

        // Calculate the absolute semitone of the third note (0-11)
        const thirdSemitone = (root + thirdSemitoneFromRoot) % 12;

        // Calculate octave: the third must be ABOVE the base note
        // If the third's semitone is <= the base semitone, it's in the next octave
        const needsOctaveUp = thirdSemitone <= baseSemitone;
        const thirdOctave = noteOctave + (needsOctaveUp ? 1 : 0);
        const thirdKey = semitoneToNoteName(thirdSemitone, useFlats) + '/' + thirdOctave;

        return {
          ...note,
          keys: [note.keys[0], thirdKey], // Both notes together (chord)
        };
      });
    };

    // Generate parallel diatonic thirds for both hands
    rhNotes = addDiatonicThird([...rhAsc, ...rhDescTrimmed]);
    const lhAsc = generateScaleNotes(key, scaleType, lhStartOctave, octaves, 'lh', 'ascending', showFingering);
    const lhDesc = generateScaleNotes(key, scaleType, lhStartOctave, octaves, 'lh', 'descending', showFingering);
    bassNotes = addDiatonicThird([...lhAsc, ...lhDesc.slice(1)]);
  } else {
    // Parallel: both hands same direction
    rhNotes = [...rhAsc, ...rhDescTrimmed];
    const lhAsc = generateScaleNotes(key, scaleType, lhStartOctave, octaves, 'lh', 'ascending', showFingering);
    const lhDesc = generateScaleNotes(key, scaleType, lhStartOctave, octaves, 'lh', 'descending', showFingering);
    bassNotes = [...lhAsc, ...lhDesc.slice(1)];
  }

  // Distribute notes into bars (4/4 time)
  const beatsPerBar = 4;

  // Determine notes per bar based on duration (8 eighth notes or 4 quarter notes)
  const rhIsEighths = rhNotes.length > 0 && rhNotes[0].duration === '8';
  const bassIsEighths = bassNotes.length > 0 && bassNotes[0].duration === '8';
  const notesPerBar = rhIsEighths ? 8 : beatsPerBar;
  const bassNotesPerBar = bassIsEighths ? 8 : beatsPerBar;

  const bars: Bar[] = [];
  const totalRhNotes = rhNotes.length;
  const totalBassNotes = bassNotes.length;
  const totalBars = Math.max(
    Math.ceil(totalRhNotes / notesPerBar),
    Math.ceil(totalBassNotes / bassNotesPerBar)
  );

  for (let i = 0; i < totalBars; i++) {
    const barRhNotes = rhNotes.slice(i * notesPerBar, (i + 1) * notesPerBar);
    const barBassNotes = bassNotes.slice(i * bassNotesPerBar, (i + 1) * bassNotesPerBar);

    // Pad incomplete bars with rests
    while (barRhNotes.length < notesPerBar) {
      barRhNotes.push({ keys: ['b/4'], duration: rhIsEighths ? '8r' : 'qr' });
    }
    while (barBassNotes.length < bassNotesPerBar) {
      barBassNotes.push({ keys: ['d/3'], duration: bassIsEighths ? '8r' : 'qr' });
    }

    bars.push({
      number: i + 1,
      notes: barRhNotes,
      bassNotes: barBassNotes,
    });
  }

  // Build exercise ID
  const typeShort = scaleType === 'major' ? 'maj' :
    scaleType === 'naturalMinor' ? 'nmin' :
    scaleType === 'harmonicMinor' ? 'hmin' : 'mmin';
  const id = `scale_${key}_${typeShort}_${mode}_${octaves}oct_${Date.now()}`;

  const typeName = scaleType === 'major' ? 'Dur' :
    scaleType === 'naturalMinor' ? 'Natuerliches Moll' :
    scaleType === 'harmonicMinor' ? 'Harmonisches Moll' : 'Melodisches Moll';

  return {
    id,
    level: config.level,
    name: `${key}-${typeName} Skala`,
    description: `${key}-${typeName}, ${mode}, ${octaves} Oktave(n)`,
    difficulty: 'intermediate',
    timeSignature: '4/4',
    keySignature: key,
    clef: 'treble',
    grandStaff: true,
    tempo,
    bars,
  };
}
