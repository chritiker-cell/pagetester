/**
 * VexFlow Renderer Utility
 * Renders music notation from Exercise data using VexFlow 5.x
 * Supports single staff and grand staff (piano) notation
 * Includes note highlighting for playback visualization
 */

import { Renderer, Stave, StaveNote, Voice, Formatter, StaveConnector, Beam, Annotation, Barline, Dot, Tuplet, Accidental } from 'vexflow';
import type { Exercise, Bar } from '../types/music';
import type { PlaybackSession } from './simplePlayback';

// Cursor vertical extension beyond stave lines (in pixels)
const CURSOR_EXTENSION_GRAND_STAFF = 105;
const CURSOR_EXTENSION_SINGLE_STAFF = 80;

/**
 * Convert chord degree to chord name based on key signature
 * @param chordDegree - Chord degree (1-7)
 * @param keySignature - Key signature (e.g., 'C', 'G', 'F', 'D')
 * @returns Chord name (e.g., 'C', 'Dm', 'G7', 'Bdim')
 */
function getChordName(chordDegree: number, keySignature: string, originalKey?: string): string {
  // Minor key scale roots and qualities
  const minorKeyMap: Record<string, string[]> = {
    'Am':  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    'Em':  ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
    'Bm':  ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
    'F#m': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
    'C#m': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
    'G#m': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'],
    'Dm':  ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
    'Gm':  ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
    'Cm':  ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
    'Fm':  ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
    'Bbm': ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
    'Ebm': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'],
  };
  // Natural minor: i, ii°, III, iv, v, VI, VII
  const minorQualities = ['m', 'dim', '', 'm', 'm', '', ''];

  if (originalKey && minorKeyMap[originalKey]) {
    const scale = minorKeyMap[originalKey];
    const rootIndex = (chordDegree - 1) % 7;
    return `${scale[rootIndex]}${minorQualities[rootIndex]}`;
  }

  // Map key signatures to major scale roots
  const keyMap: Record<string, string[]> = {
    'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
    'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
    'C#': ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
  };

  const scale = keyMap[keySignature] || keyMap['C'];
  const rootIndex = (chordDegree - 1) % 7;
  const root = scale[rootIndex];

  // Chord qualities in major scale: I, ii, iii, IV, V, vi, vii°
  const qualities = ['', 'm', 'm', '', '', 'm', 'dim'];
  const quality = qualities[rootIndex];

  return `${root}${quality}`;
}

interface RenderConfig {
  width: number;
  height: number;
  barsPerLine: number;
  padding: { top: number; left: number; right: number; bottom: number };
  showChordSymbols?: boolean;
}

/**
 * Metadata for rendered notes, used for highlighting during playback
 */
export interface RenderedNoteInfo {
  noteId: string;
  barNumber: number;
  noteIndex: number;
  voice: 'treble' | 'bass';
  svgElement: SVGElement | null;
}

// Store rendered note metadata for highlighting
let renderedNotes: RenderedNoteInfo[] = [];

// Cursor animation state
interface NotePosition {
  x: number;
  lineTop: number;
  lineBottom: number;
  lineIndex: number;
}

let notePositionMap = new Map<string, NotePosition>();
let cursorElement: SVGLineElement | null = null;
let cursorAnimationId: number | null = null;

// Store active cursor animation state for restoration after re-render
interface CursorAnimationState {
  entries: CursorTimelineEntry[];
  session: PlaybackSession;
  totalDurationMs: number;
}
let activeCursorAnimation: CursorAnimationState | null = null;

const DEFAULT_CONFIG: RenderConfig = {
  width: 1200,
  height: 400,
  barsPerLine: 4,
  padding: { top: 40, left: 20, right: 20, bottom: 20 },
};

function parseTimeSignature(timeSignature: string): { beats: number; beatValue: number } {
  const [beats, beatValue] = timeSignature.split('/').map(Number);
  return { beats, beatValue };
}

function durationToVexFlow(duration: string): string {
  // VexFlow 5.x handles dotted durations natively (e.g. 'hd', 'qd', '8d')
  // Pass the duration string as-is, VexFlow will render the dot and count ticks correctly
  return duration;
}

function createNotesFromBar(
  bar: Bar,
  useBassNotes: boolean = false,
  exerciseId: string = ''
): { staveNotes: StaveNote[]; noteInfos: RenderedNoteInfo[]; tupletGroups: StaveNote[][] } {
  const notesArray = useBassNotes && bar.bassNotes ? bar.bassNotes : bar.notes;
  const voice = useBassNotes ? 'bass' : 'treble';
  const staveNotes: StaveNote[] = [];
  const noteInfos: RenderedNoteInfo[] = [];

  // Track tuplet groups by tupletId
  const tupletMap = new Map<string, StaveNote[]>();

  notesArray.forEach((note, index) => {
    const staveNote = new StaveNote({
      keys: note.keys,
      duration: durationToVexFlow(note.duration),
      clef: useBassNotes ? 'bass' : 'treble',
      autoStem: true,
    });

    // VexFlow 5.x uses 'd' suffix for tick counting but does NOT render the dot visually.
    // Dot.buildAndAttach() adds the visual dot without changing ticks.
    if (note.duration.replace(/r$/, '').endsWith('d')) {
      Dot.buildAndAttach([staveNote]);
    }

    const noteId = `${exerciseId}-bar${bar.number}-${voice}-note${index}`;

    // Add fingering annotation if present
    if (note.fingering) {
      const annotation = new Annotation(String(note.fingering));
      annotation.setVerticalJustification(
        useBassNotes ? Annotation.VerticalJustify.BOTTOM : Annotation.VerticalJustify.TOP
      );
      staveNote.addModifier(annotation);
    }

    // Track tuplet groups
    if (note.tupletId) {
      if (!tupletMap.has(note.tupletId)) {
        tupletMap.set(note.tupletId, []);
      }
      tupletMap.get(note.tupletId)!.push(staveNote);
    }

    // Add custom attribute for identification (VexFlow 5.x)
    staveNote.setStyle({ fillStyle: '#0f172a', strokeStyle: '#0f172a' });
    (staveNote as any).noteId = noteId;

    staveNotes.push(staveNote);
    noteInfos.push({
      noteId,
      barNumber: bar.number,
      noteIndex: index,
      voice,
      svgElement: null, // Will be set after rendering
    });
  });

  // Collect tuplet groups as arrays
  const tupletGroups: StaveNote[][] = [];
  for (const group of tupletMap.values()) {
    if (group.length >= 2) {
      tupletGroups.push(group);
    }
  }

  return { staveNotes, noteInfos, tupletGroups };
}

/**
 * Render a single staff exercise
 */
function renderSingleStaff(
  context: any,
  exercise: Exercise,
  config: RenderConfig
): RenderedNoteInfo[] {
  const { beats, beatValue } = parseTimeSignature(exercise.timeSignature);
  const totalBars = exercise.bars.length;
  const linesNeeded = Math.ceil(totalBars / config.barsPerLine);
  const staveWidth = (config.width - config.padding.left - config.padding.right) / config.barsPerLine;
  const staveHeight = 120;

  const allNoteInfos: RenderedNoteInfo[] = [];
  const chordPositions: { x: number; y: number; chord: string }[] = [];

  let barIndex = 0;
  let prevChordDegree: number | undefined = undefined;

  for (let line = 0; line < linesNeeded; line++) {
    const barsInThisLine = Math.min(config.barsPerLine, totalBars - barIndex);

    for (let barInLine = 0; barInLine < barsInThisLine; barInLine++) {
      const bar = exercise.bars[barIndex];
      const isFirstBar = barIndex === 0;
      const isFirstInLine = barInLine === 0;
      const isLastBar = barIndex === totalBars - 1;

      const x = config.padding.left + (barInLine * staveWidth);
      const y = config.padding.top + (line * staveHeight);

      const stave = new Stave(x, y, staveWidth);

      if (isFirstInLine) {
        stave.addClef(exercise.clef);
        if (exercise.keySignature && exercise.keySignature !== 'C') {
          stave.addKeySignature(exercise.keySignature);
        }
      }
      if (isFirstBar) {
        stave.addTimeSignature(exercise.timeSignature);
      }

      // Add repeat barline at the end of the last bar
      if (isLastBar) {
        stave.setEndBarType(Barline.type.REPEAT_END);
      }

      stave.setContext(context).draw();

      // Store chord position if chord changed
      if (config.showChordSymbols && bar.chordDegree !== undefined && bar.chordDegree !== prevChordDegree) {
        const chordName = getChordName(bar.chordDegree, exercise.keySignature, exercise.originalKey);
        chordPositions.push({ x: x + 10, y: y - 10, chord: chordName });
        prevChordDegree = bar.chordDegree;
      }

      const { staveNotes, noteInfos, tupletGroups } = createNotesFromBar(bar, false, exercise.id);

      // Create tuplets BEFORE adding to voice so VexFlow adjusts tick counts
      const tupletObjects: Tuplet[] = [];
      tupletGroups.forEach(group => {
        tupletObjects.push(new Tuplet(group, { numNotes: group.length, notesOccupied: 2 }));
      });

      const voice = new Voice({ numBeats: beats, beatValue: beatValue }).setMode(Voice.Mode.SOFT);
      voice.addTickables(staveNotes);

      // Auto-add accidentals based on key signature (handles sharps/flats outside key sig)
      Accidental.applyAccidentals([voice], exercise.keySignature || 'C');

      const noteStartX = stave.getNoteStartX();
      const noteEndX = stave.getNoteEndX();
      const availableWidth = noteEndX - noteStartX;

      // Generate beams BEFORE drawing so flags are suppressed on beamed notes
      const beams = Beam.generateBeams(staveNotes);

      const formatter = new Formatter();
      formatter.joinVoices([voice]).format([voice], Math.max(availableWidth - 10, 50));
      voice.draw(context, stave);

      // Draw beams after voice
      beams.forEach(b => b.setContext(context).draw());

      // Draw tuplet brackets
      tupletObjects.forEach(t => t.setContext(context).draw());

      // Store SVG elements for highlighting
      staveNotes.forEach((note, idx) => {
        const svgElem = (note as any).getSVGElement?.() || null;
        if (noteInfos[idx]) {
          noteInfos[idx].svgElement = svgElem;
        }
      });

      allNoteInfos.push(...noteInfos);
      barIndex++;
    }
  }

  // Render chord symbols as SVG text
  if (config.showChordSymbols && chordPositions.length > 0) {
    const svg = context.svg;
    chordPositions.forEach(({ x, y, chord }) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x.toString());
      text.setAttribute('y', y.toString());
      text.setAttribute('font-family', 'Arial, sans-serif');
      text.setAttribute('font-size', '16');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#374151');
      text.textContent = chord;
      svg.appendChild(text);
    });
  }

  return allNoteInfos;
}

/**
 * Render a grand staff (piano) exercise with treble and bass clef
 */
function renderGrandStaff(
  context: any,
  exercise: Exercise,
  config: RenderConfig
): RenderedNoteInfo[] {
  const { beats, beatValue } = parseTimeSignature(exercise.timeSignature);
  const totalBars = exercise.bars.length;
  const linesNeeded = Math.ceil(totalBars / config.barsPerLine);
  const staveWidth = (config.width - config.padding.left - config.padding.right) / config.barsPerLine;

  // Grand staff needs more vertical space
  const trebleStaveHeight = 80;
  const bassStaveOffset = 90; // Distance between treble and bass stave
  const systemHeight = trebleStaveHeight + bassStaveOffset + 50; // Total height per system

  const allNoteInfos: RenderedNoteInfo[] = [];
  const chordPositions: { x: number; y: number; chord: string }[] = [];

  let barIndex = 0;
  let prevChordDegree: number | undefined = undefined;

  for (let line = 0; line < linesNeeded; line++) {
    const barsInThisLine = Math.min(config.barsPerLine, totalBars - barIndex);

    for (let barInLine = 0; barInLine < barsInThisLine; barInLine++) {
      const bar = exercise.bars[barIndex];
      const isFirstBar = barIndex === 0;
      const isFirstInLine = barInLine === 0;
      const isLastBar = barIndex === totalBars - 1;

      const x = config.padding.left + (barInLine * staveWidth);
      const yTreble = config.padding.top + (line * systemHeight);
      const yBass = yTreble + bassStaveOffset;

      // Store chord position if chord changed
      if (config.showChordSymbols && bar.chordDegree !== undefined && bar.chordDegree !== prevChordDegree) {
        const chordName = getChordName(bar.chordDegree, exercise.keySignature, exercise.originalKey);
        chordPositions.push({ x: x + 10, y: yTreble - 15, chord: chordName });
        prevChordDegree = bar.chordDegree;
      }

      // Create treble stave
      const trebleStave = new Stave(x, yTreble, staveWidth);
      if (isFirstInLine) {
        trebleStave.addClef('treble');
        if (exercise.keySignature && exercise.keySignature !== 'C') {
          trebleStave.addKeySignature(exercise.keySignature);
        }
      }
      if (isFirstBar) {
        trebleStave.addTimeSignature(exercise.timeSignature);
      }
      // Add repeat barline at the end of the last bar
      if (isLastBar) {
        trebleStave.setEndBarType(Barline.type.REPEAT_END);
      }
      trebleStave.setContext(context).draw();

      // Create bass stave
      const bassStave = new Stave(x, yBass, staveWidth);
      if (isFirstInLine) {
        bassStave.addClef('bass');
        if (exercise.keySignature && exercise.keySignature !== 'C') {
          bassStave.addKeySignature(exercise.keySignature);
        }
      }
      if (isFirstBar) {
        bassStave.addTimeSignature(exercise.timeSignature);
      }
      // Add repeat barline at the end of the last bar
      if (isLastBar) {
        bassStave.setEndBarType(Barline.type.REPEAT_END);
      }
      bassStave.setContext(context).draw();

      // Add brace connector at start of each line
      if (isFirstInLine) {
        const brace = new StaveConnector(trebleStave, bassStave);
        brace.setType('brace');
        brace.setContext(context).draw();

        const lineLeft = new StaveConnector(trebleStave, bassStave);
        lineLeft.setType('singleLeft');
        lineLeft.setContext(context).draw();
      }

      // Add right bar line connector
      const lineRight = new StaveConnector(trebleStave, bassStave);
      lineRight.setType('singleRight');
      lineRight.setContext(context).draw();

      // Create treble notes and voice
      const { staveNotes: trebleNotes, noteInfos: trebleNoteInfos, tupletGroups: trebleTuplets } = createNotesFromBar(bar, false, exercise.id);

      // Create tuplets BEFORE adding to voice so VexFlow adjusts tick counts
      const trebleTupletObjects: Tuplet[] = [];
      trebleTuplets.forEach(group => {
        trebleTupletObjects.push(new Tuplet(group, { numNotes: group.length, notesOccupied: 2 }));
      });

      const trebleVoice = new Voice({ numBeats: beats, beatValue: beatValue }).setMode(Voice.Mode.SOFT);
      trebleVoice.addTickables(trebleNotes);

      // Generate beams BEFORE drawing so flags are suppressed on beamed notes
      const trebleBeams = Beam.generateBeams(trebleNotes);

      // Use available width from treble stave (both staves have same width)
      const noteStartX = trebleStave.getNoteStartX();
      const noteEndX = trebleStave.getNoteEndX();
      const availableWidth = Math.max(noteEndX - noteStartX - 10, 50);

      // Create bass notes and voice if they exist
      const hasBass = bar.bassNotes && bar.bassNotes.length > 0;
      let bassNotes: StaveNote[] = [];
      let bassNoteInfos: RenderedNoteInfo[] = [];
      let bassVoice: Voice | null = null;
      let bassBeams: any[] = [];
      const bassTupletObjects: Tuplet[] = [];

      if (hasBass) {
        const bassResult = createNotesFromBar(bar, true, exercise.id);
        bassNotes = bassResult.staveNotes;
        bassNoteInfos = bassResult.noteInfos;
        // Create bass tuplets BEFORE adding to voice
        bassResult.tupletGroups.forEach(group => {
          bassTupletObjects.push(new Tuplet(group, { numNotes: group.length, notesOccupied: 2 }));
        });
        bassVoice = new Voice({ numBeats: beats, beatValue: beatValue }).setMode(Voice.Mode.SOFT);
        bassVoice.addTickables(bassNotes);
        bassBeams = Beam.generateBeams(bassNotes);
      }

      // Auto-add accidentals based on key signature
      const accVoices = [trebleVoice];
      if (bassVoice) accVoices.push(bassVoice);
      Accidental.applyAccidentals(accVoices, exercise.keySignature || 'C');

      // Use a single Formatter for both voices so notes align horizontally
      const formatter = new Formatter();
      formatter.joinVoices([trebleVoice]);
      if (bassVoice) {
        formatter.joinVoices([bassVoice]);
        formatter.format([trebleVoice, bassVoice], availableWidth);
      } else {
        formatter.format([trebleVoice], availableWidth);
      }

      trebleVoice.draw(context, trebleStave);
      trebleBeams.forEach(b => b.setContext(context).draw());

      // Draw treble tuplets
      trebleTupletObjects.forEach(t => t.setContext(context).draw());

      // Store SVG elements for treble notes
      trebleNotes.forEach((note, idx) => {
        const svgElem = (note as any).getSVGElement?.() || null;
        if (trebleNoteInfos[idx]) {
          trebleNoteInfos[idx].svgElement = svgElem;
        }
      });
      allNoteInfos.push(...trebleNoteInfos);

      if (bassVoice) {
        bassVoice.draw(context, bassStave);
        bassBeams.forEach(b => b.setContext(context).draw());

        // Draw bass tuplets
        bassTupletObjects.forEach(t => t.setContext(context).draw());

        // Store SVG elements for bass notes
        bassNotes.forEach((note, idx) => {
          const svgElem = (note as any).getSVGElement?.() || null;
          if (bassNoteInfos[idx]) {
            bassNoteInfos[idx].svgElement = svgElem;
          }
        });
        allNoteInfos.push(...bassNoteInfos);
      }

      barIndex++;
    }
  }

  // Render chord symbols as SVG text
  if (config.showChordSymbols && chordPositions.length > 0) {
    const svg = context.svg;
    chordPositions.forEach(({ x, y, chord }) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x.toString());
      text.setAttribute('y', y.toString());
      text.setAttribute('font-family', 'Arial, sans-serif');
      text.setAttribute('font-size', '16');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#374151');
      text.textContent = chord;
      svg.appendChild(text);
    });
  }

  return allNoteInfos;
}

/**
 * Main render function
 */
export function renderExercise(
  container: HTMLDivElement,
  exercise: Exercise,
  config: Partial<RenderConfig> = {}
): RenderedNoteInfo[] {
  const finalConfig: RenderConfig = { ...DEFAULT_CONFIG, ...config };
  const width = Math.max(finalConfig.width, 400);

  notePositionMap.clear();
  container.innerHTML = '';

  const totalBars = exercise.bars.length;
  const linesNeeded = Math.ceil(totalBars / finalConfig.barsPerLine);

  // Calculate height based on staff type
  let totalHeight: number;
  if (exercise.grandStaff) {
    const systemHeight = 230; // Height for grand staff system
    totalHeight = finalConfig.padding.top + (linesNeeded * systemHeight) + finalConfig.padding.bottom;
  } else {
    const staveHeight = 120;
    totalHeight = finalConfig.padding.top + (linesNeeded * staveHeight) + finalConfig.padding.bottom;
  }

  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(width, totalHeight);
  const context = renderer.getContext();

  let noteInfos: RenderedNoteInfo[];
  if (exercise.grandStaff) {
    noteInfos = renderGrandStaff(context, exercise, { ...finalConfig, width });
  } else {
    noteInfos = renderSingleStaff(context, exercise, { ...finalConfig, width });
  }

  // Store globally for highlighting access
  renderedNotes = noteInfos;

  // Add data attributes to SVG groups for CSS-based highlighting
  addNoteDataAttributes(container, exercise.id);

  // Build note position map from actual SVG bounding boxes (reliable for cursor)
  buildNotePositionMap(container, exercise, finalConfig);

  // Restore cursor animation if it was active before re-render
  restoreCursorIfActive();

  return noteInfos;
}

/**
 * Build note position map from rendered SVG elements.
 * Uses getBBox() on SVG note groups for reliable x-positions,
 * and computes system line extents from bar numbers + layout params.
 * Also stores bar end positions for cursor animation.
 */
interface BarEndPosition {
  barNumber: number;
  lineIndex: number;
  xEnd: number;
  lineTop: number;
  lineBottom: number;
}

let barEndPositions: BarEndPosition[] = [];

function buildNotePositionMap(
  container: HTMLDivElement,
  exercise: Exercise,
  config: RenderConfig
): void {
  notePositionMap.clear();
  barEndPositions = [];

  const svg = container.querySelector('svg');
  if (!svg) return;

  const isGrandStaff = exercise.grandStaff;
  const barsPerLine = config.barsPerLine;
  const staveWidth = (config.width - config.padding.left - config.padding.right) / config.barsPerLine;

  // Layout constants matching render functions
  const singleStaveHeight = 120;
  const grandSystemHeight = 80 + 90 + 50; // trebleStaveHeight + bassStaveOffset + 50
  const bassStaveOffset = 90;

  for (const noteInfo of renderedNotes) {
    const el = svg.querySelector(`[data-note-id="${noteInfo.noteId}"]`) as SVGGraphicsElement | null;
    if (!el) continue;

    const bbox = el.getBBox();
    const x = bbox.x + bbox.width / 2;

    const lineIndex = Math.floor((noteInfo.barNumber - 1) / barsPerLine);

    let lineTop: number;
    let lineBottom: number;

    if (isGrandStaff) {
      const yTreble = config.padding.top + lineIndex * grandSystemHeight;
      const yBass = yTreble + bassStaveOffset;
      lineTop = yTreble;
      lineBottom = yBass + CURSOR_EXTENSION_GRAND_STAFF;
    } else {
      const y = config.padding.top + lineIndex * singleStaveHeight;
      lineTop = y;
      lineBottom = y + CURSOR_EXTENSION_SINGLE_STAFF;
    }

    notePositionMap.set(noteInfo.noteId, { x, lineTop, lineBottom, lineIndex });
  }

  // Store bar end positions (right edge of each bar)
  for (let barNumber = 1; barNumber <= exercise.bars.length; barNumber++) {
    const lineIndex = Math.floor((barNumber - 1) / barsPerLine);
    const barInLine = (barNumber - 1) % barsPerLine;
    const xEnd = config.padding.left + (barInLine + 1) * staveWidth - 5; // -5 to stay inside bar line

    let lineTop: number;
    let lineBottom: number;

    if (isGrandStaff) {
      const yTreble = config.padding.top + lineIndex * grandSystemHeight;
      const yBass = yTreble + bassStaveOffset;
      lineTop = yTreble;
      lineBottom = yBass + CURSOR_EXTENSION_GRAND_STAFF;
    } else {
      const y = config.padding.top + lineIndex * singleStaveHeight;
      lineTop = y;
      lineBottom = y + CURSOR_EXTENSION_SINGLE_STAFF;
    }

    barEndPositions.push({ barNumber, lineIndex, xEnd, lineTop, lineBottom });
  }
}

/**
 * Add data-note-id attributes to SVG groups for CSS highlighting
 */
function addNoteDataAttributes(container: HTMLDivElement, _exerciseId: string): void {
  // VexFlow renders notes as SVG groups. We need to identify them.
  // Each note group typically has vf-stavenote class
  const svg = container.querySelector('svg');
  if (!svg) return;

  // Get all note groups
  const noteGroups = svg.querySelectorAll('.vf-stavenote');

  // Map to our rendered notes by order
  noteGroups.forEach((group, index) => {
    if (renderedNotes[index]) {
      group.setAttribute('data-note-id', renderedNotes[index].noteId);
      // Update svgElement reference
      renderedNotes[index].svgElement = group as SVGElement;
    }
  });
}

/**
 * Highlight a note by its ID
 */
export function highlightNote(noteId: string): void {
  // Remove previous highlights
  clearNoteHighlights();

  // Find and highlight the note
  const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
  if (noteElement) {
    noteElement.classList.add('note-highlighted');
  }
}

/**
 * Highlight multiple notes by their IDs (for grand staff simultaneous notes)
 */
export function highlightNotes(noteIds: string[]): void {
  clearNoteHighlights();
  noteIds.forEach(noteId => {
    const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
    if (noteElement) {
      noteElement.classList.add('note-highlighted');
    }
  });
}

/**
 * Clear all note highlights
 */
export function clearNoteHighlights(): void {
  const highlightedNotes = document.querySelectorAll('.note-highlighted');
  highlightedNotes.forEach((note) => {
    note.classList.remove('note-highlighted');
  });
}

/**
 * Practice feedback highlight types
 */
export type PracticeFeedbackType = 'correct' | 'incorrect' | 'missed' | 'current';

/**
 * Highlight a note with practice feedback styling
 */
export function highlightNotePractice(noteId: string, feedbackType: PracticeFeedbackType): void {
  const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
  if (!noteElement) return;

  // Remove any existing practice feedback classes
  noteElement.classList.remove(
    'note-correct',
    'note-incorrect',
    'note-missed',
    'note-current',
    'note-highlighted'
  );

  // Add the appropriate class
  switch (feedbackType) {
    case 'correct':
      noteElement.classList.add('note-correct');
      break;
    case 'incorrect':
      noteElement.classList.add('note-incorrect');
      break;
    case 'missed':
      noteElement.classList.add('note-missed');
      break;
    case 'current':
      noteElement.classList.add('note-current');
      break;
  }
}

/**
 * Highlight multiple notes with practice feedback
 */
export function highlightNotesPractice(
  noteIds: string[],
  feedbackType: PracticeFeedbackType
): void {
  noteIds.forEach((noteId) => highlightNotePractice(noteId, feedbackType));
}

/**
 * Clear all practice feedback highlights
 */
export function clearPracticeFeedback(): void {
  const feedbackClasses = ['note-correct', 'note-incorrect', 'note-missed', 'note-current'];
  feedbackClasses.forEach((className) => {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((el) => el.classList.remove(className));
  });
}

/**
 * Get note element by its ID
 */
export function getNoteElement(noteId: string): SVGElement | null {
  return document.querySelector(`[data-note-id="${noteId}"]`);
}

/**
 * Get note info by index (for matching with scheduled notes)
 */
export function getNoteInfoByIndex(
  barNumber: number,
  noteIndex: number,
  voice: 'treble' | 'bass' = 'treble'
): RenderedNoteInfo | null {
  return (
    renderedNotes.find(
      (n) =>
        n.barNumber === barNumber &&
        n.noteIndex === noteIndex &&
        n.voice === voice
    ) || null
  );
}

/**
 * Get all note IDs for a specific bar
 */
export function getNoteIdsForBar(barNumber: number): string[] {
  return renderedNotes
    .filter((n) => n.barNumber === barNumber)
    .map((n) => n.noteId);
}

/**
 * Get rendered notes info (for playback synchronization)
 */
export function getRenderedNotes(): RenderedNoteInfo[] {
  return renderedNotes;
}

/**
 * Calculates optimal dimensions based on bar count
 */
export function calculateOptimalDimensions(
  barCount: number,
  barsPerLine: number = 4,
  containerWidth: number = 1200,
  isGrandStaff: boolean = false
): { width: number; height: number } {
  const linesNeeded = Math.ceil(barCount / barsPerLine);
  const padding = { top: 40, bottom: 20 };

  const heightPerLine = isGrandStaff ? 230 : 120;

  return {
    width: Math.max(containerWidth, 800),
    height: padding.top + (linesNeeded * heightPerLine) + padding.bottom,
  };
}

/**
 * Get position of a rendered note by its ID
 */
export function getNotePosition(noteId: string): NotePosition | null {
  return notePositionMap.get(noteId) ?? null;
}

/**
 * Timeline entry for cursor animation
 */
export interface CursorTimelineEntry {
  x: number;
  time: number; // seconds from playback start
  lineTop: number;
  lineBottom: number;
  noteId?: string; // for bar-end position lookup
  duration?: number; // duration of this note in seconds
  lineIndex?: number; // line index for robust line-change detection
}

/**
 * Ensure the cursor SVG element exists and is visible
 */
function ensureCursor(): SVGLineElement | null {
  const svg = document.querySelector('.music-sheet-container svg');
  if (!svg) return null;

  if (!cursorElement || !svg.contains(cursorElement)) {
    cursorElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    cursorElement.setAttribute('id', 'playback-cursor');
    cursorElement.setAttribute('stroke', '#000000');
    cursorElement.setAttribute('stroke-width', '2');
    cursorElement.setAttribute('opacity', '0.7');
    cursorElement.style.pointerEvents = 'none';
    svg.appendChild(cursorElement);
  }

  cursorElement.setAttribute('visibility', 'visible');
  return cursorElement;
}

/**
 * Show the cursor at a fixed position (e.g. before playback starts)
 */
export function showCursorAtPosition(x: number, lineTop: number, lineBottom: number): void {
  const el = ensureCursor();
  if (!el) return;
  el.setAttribute('x1', x.toString());
  el.setAttribute('x2', x.toString());
  el.setAttribute('y1', lineTop.toString());
  el.setAttribute('y2', lineBottom.toString());
}

/**
 * Get bar number from timeline entry noteId (format: "exerciseId-bar3-treble-note0")
 */
function getBarNumberFromNoteId(noteId: string): number {
  const match = noteId.match(/-bar(\d+)-/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Animate the cursor using a PlaybackSession (performance.now() based)
 * This is the new synchronous animation method that uses the same time base as audio.
 */
export function animateCursorWithSession(
  entries: CursorTimelineEntry[],
  session: PlaybackSession,
  totalDurationMs: number
): void {
  if (entries.length === 0) return;

  // Store animation state for restoration after re-render
  activeCursorAnimation = { entries, session, totalDurationMs };

  // Cancel any previous animation
  if (cursorAnimationId) {
    cancelAnimationFrame(cursorAnimationId);
    cursorAnimationId = null;
  }

  const el = ensureCursor();
  if (!el) return;

  // Augment timeline with bar numbers for each entry
  const augmentedEntries = entries.map(e => ({
    ...e,
    barNumber: getBarNumberFromNoteId(e.noteId || ''),
    lineIndex: e.lineIndex ?? 0,
  }));

  const endTime = totalDurationMs / 1000; // Convert to seconds for comparison with entry.time

  const animate = () => {
    // Check if playback is still active
    if (!session.isPlaying) {
      return; // Stop animation when playback stops
    }

    // Calculate elapsed time using the session's time base
    const elapsed = performance.now() - session.startTime;
    const cycleTime = session.currentCountIn + session.totalDuration;
    const cycleElapsed = session.loop ? elapsed % cycleTime : elapsed;
    const musicElapsedMs = cycleElapsed - session.currentCountIn;
    const musicElapsed = musicElapsedMs / 1000; // Convert to seconds

    // During count-in (musicElapsed < 0): stay at first note
    if (musicElapsed < 0) {
      const first = augmentedEntries[0];
      el.setAttribute('x1', first.x.toString());
      el.setAttribute('x2', first.x.toString());
      el.setAttribute('y1', first.lineTop.toString());
      el.setAttribute('y2', first.lineBottom.toString());
      cursorAnimationId = requestAnimationFrame(animate);
      return;
    }

    // Find current segment: last entry whose time <= musicElapsed
    let idx = 0;
    while (idx < augmentedEntries.length - 1 && augmentedEntries[idx + 1].time <= musicElapsed) {
      idx++;
    }

    const current = augmentedEntries[idx];
    const next = idx < augmentedEntries.length - 1 ? augmentedEntries[idx + 1] : null;

    // Update vertical extent for current system
    el.setAttribute('y1', current.lineTop.toString());
    el.setAttribute('y2', current.lineBottom.toString());

    if (next) {
      const onSameLine = (current.lineIndex === next.lineIndex);
      const currentBarNumber = current.barNumber || 1;
      const nextBarNumber = next.barNumber || 1;

      if (onSameLine) {
        if (nextBarNumber > currentBarNumber) {
          // Crossing bar boundary: interpolate through bar end
          const barEndInfo = barEndPositions.find(b => b.barNumber === currentBarNumber);
          const barEndX = barEndInfo ? barEndInfo.xEnd : current.x + 60;

          const segDuration = next.time - current.time;
          const segElapsed = musicElapsed - current.time;
          const progress = segDuration > 0 ? Math.min(segElapsed / segDuration, 1) : 0;

          const leg1 = Math.abs(barEndX - current.x);
          const leg2 = Math.abs(next.x - barEndX);
          const totalDistance = leg1 + leg2;

          let x: number;
          if (totalDistance === 0) {
            x = current.x;
          } else {
            const leg1Fraction = leg1 / totalDistance;
            if (progress < leg1Fraction) {
              const leg1Progress = leg1Fraction > 0 ? progress / leg1Fraction : 1;
              x = current.x + (barEndX - current.x) * leg1Progress;
            } else {
              const leg2Progress = leg1Fraction < 1 ? (progress - leg1Fraction) / (1 - leg1Fraction) : 1;
              x = barEndX + (next.x - barEndX) * leg2Progress;
            }
          }

          el.setAttribute('x1', x.toString());
          el.setAttribute('x2', x.toString());
        } else {
          // Same bar: simple interpolation
          const targetX = Math.max(next.x, current.x);
          const segDuration = next.time - current.time;
          const segElapsed = musicElapsed - current.time;
          const progress = segDuration > 0 ? Math.min(segElapsed / segDuration, 1) : 0;
          const x = current.x + (targetX - current.x) * progress;
          el.setAttribute('x1', x.toString());
          el.setAttribute('x2', x.toString());
        }
      } else {
        // Different line: interpolate to end of current bar, then jump
        const barEndInfo = barEndPositions.find(b => b.barNumber === currentBarNumber);
        const barEndX = barEndInfo ? barEndInfo.xEnd : current.x + 60;

        const segDuration = next.time - current.time;
        const segElapsed = musicElapsed - current.time;
        const progress = segDuration > 0 ? Math.min(segElapsed / segDuration, 1) : 0;

        const x = current.x + (barEndX - current.x) * progress;
        el.setAttribute('x1', x.toString());
        el.setAttribute('x2', x.toString());

        if (progress > 0.9) {
          const yTransitionProgress = (progress - 0.9) / 0.1;
          const y1 = current.lineTop + (next.lineTop - current.lineTop) * yTransitionProgress;
          const y2 = current.lineBottom + (next.lineBottom - current.lineBottom) * yTransitionProgress;
          el.setAttribute('y1', y1.toString());
          el.setAttribute('y2', y2.toString());
        }
      }
    } else {
      // Last entry: interpolate to end of last bar
      const currentBarNumber = current.barNumber || 1;
      const barEndInfo = barEndPositions.find(b => b.barNumber === currentBarNumber);
      const barEndX = barEndInfo ? barEndInfo.xEnd : current.x + 60;

      const noteDur = current.duration ?? 0.5;
      const segDuration = Math.max(endTime - current.time, noteDur);
      const segElapsed = musicElapsed - current.time;
      const progress = segDuration > 0 ? Math.min(segElapsed / segDuration, 1) : 0;
      const x = current.x + (barEndX - current.x) * progress;
      el.setAttribute('x1', x.toString());
      el.setAttribute('x2', x.toString());
    }

    cursorAnimationId = requestAnimationFrame(animate);
  };

  cursorAnimationId = requestAnimationFrame(animate);
}

/**
 * @deprecated Use animateCursorWithSession instead for synchronized playback
 * Animate the cursor smoothly along a precomputed timeline.
 * This legacy function uses Tone.Transport for timing (may be out of sync).
 */
export function animateCursorTimeline(entries: CursorTimelineEntry[], totalDuration?: number, loop: boolean = false, _countInOffset: number = 0): void {
  if (entries.length === 0) return;

  // Cancel any previous animation
  if (cursorAnimationId) {
    cancelAnimationFrame(cursorAnimationId);
    cursorAnimationId = null;
  }

  const el = ensureCursor();
  if (!el) return;

  // Augment timeline with bar numbers and line indices for each entry
  const augmentedEntries = entries.map(e => ({
    ...e,
    barNumber: getBarNumberFromNoteId(e.noteId || ''),
    lineIndex: e.lineIndex ?? 0, // Use provided lineIndex or default to 0
  }));

  // Placeholder: this function is deprecated
  void totalDuration; // Unused in deprecated version
  // Just show cursor at first position
  const first = augmentedEntries[0];
  el.setAttribute('x1', first.x.toString());
  el.setAttribute('x2', first.x.toString());
  el.setAttribute('y1', first.lineTop.toString());
  el.setAttribute('y2', first.lineBottom.toString());

  console.warn('animateCursorTimeline is deprecated. Use animateCursorWithSession instead.');

  // In loop mode, keep the cursor visible
  if (loop) {
    el.setAttribute('visibility', 'visible');
  }
}

/**
 * Hide the playback cursor
 */
export function hidePlaybackCursor(): void {
  if (cursorAnimationId) {
    cancelAnimationFrame(cursorAnimationId);
    cursorAnimationId = null;
  }
  if (cursorElement) {
    cursorElement.setAttribute('visibility', 'hidden');
  }
  // Clear animation state
  activeCursorAnimation = null;
}

/**
 * Remove the playback cursor entirely
 */
export function removePlaybackCursor(): void {
  if (cursorAnimationId) {
    cancelAnimationFrame(cursorAnimationId);
    cursorAnimationId = null;
  }
  if (cursorElement) {
    cursorElement.remove();
    cursorElement = null;
  }
  // Clear animation state
  activeCursorAnimation = null;
}

/**
 * Restore cursor animation after re-render (if it was active)
 * This is called internally after renderExercise() to continue playback cursor
 */
export function restoreCursorIfActive(): void {
  if (activeCursorAnimation) {
    const { entries, session, totalDurationMs } = activeCursorAnimation;
    // Only restore if session is still playing
    if (session.isPlaying) {
      // Re-create cursor element and resume animation
      cursorElement = null; // Force recreation
      animateCursorWithSession(entries, session, totalDurationMs);
    }
  }
}
