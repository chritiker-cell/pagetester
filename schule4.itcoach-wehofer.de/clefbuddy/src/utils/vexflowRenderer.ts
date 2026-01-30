/**
 * VexFlow Renderer Utility
 * Renders music notation from Exercise data using VexFlow 5.x
 * Supports single staff and grand staff (piano) notation
 * Includes note highlighting for playback visualization
 */

import { Renderer, Stave, StaveNote, Voice, Formatter, StaveConnector, Beam, Annotation } from 'vexflow';
import type { Exercise, Bar } from '../types/music';

interface RenderConfig {
  width: number;
  height: number;
  barsPerLine: number;
  padding: { top: number; left: number; right: number; bottom: number };
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

const DEFAULT_CONFIG: RenderConfig = {
  width: 800,
  height: 400,
  barsPerLine: 4,
  padding: { top: 40, left: 10, right: 10, bottom: 20 },
};

function parseTimeSignature(timeSignature: string): { beats: number; beatValue: number } {
  const [beats, beatValue] = timeSignature.split('/').map(Number);
  return { beats, beatValue };
}

function durationToVexFlow(duration: string): string {
  if (duration.includes('d')) {
    return duration.replace('d', '') + 'd';
  }
  return duration;
}

function createNotesFromBar(
  bar: Bar,
  useBassNotes: boolean = false,
  exerciseId: string = ''
): { staveNotes: StaveNote[]; noteInfos: RenderedNoteInfo[] } {
  const notesArray = useBassNotes && bar.bassNotes ? bar.bassNotes : bar.notes;
  const voice = useBassNotes ? 'bass' : 'treble';
  const staveNotes: StaveNote[] = [];
  const noteInfos: RenderedNoteInfo[] = [];

  notesArray.forEach((note, index) => {
    const staveNote = new StaveNote({
      keys: note.keys,
      duration: durationToVexFlow(note.duration),
      clef: useBassNotes ? 'bass' : 'treble',
      autoStem: true,
    });

    const noteId = `${exerciseId}-bar${bar.number}-${voice}-note${index}`;

    // Add fingering annotation if present
    if (note.fingering) {
      const annotation = new Annotation(String(note.fingering));
      annotation.setVerticalJustification(
        useBassNotes ? Annotation.VerticalJustify.BOTTOM : Annotation.VerticalJustify.TOP
      );
      staveNote.addModifier(annotation);
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

  return { staveNotes, noteInfos };
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

  let barIndex = 0;
  for (let line = 0; line < linesNeeded; line++) {
    const barsInThisLine = Math.min(config.barsPerLine, totalBars - barIndex);

    for (let barInLine = 0; barInLine < barsInThisLine; barInLine++) {
      const bar = exercise.bars[barIndex];
      const isFirstBar = barIndex === 0;
      const isFirstInLine = barInLine === 0;

      const x = config.padding.left + (barInLine * staveWidth);
      const y = config.padding.top + (line * staveHeight);

      const stave = new Stave(x, y, staveWidth);

      if (isFirstInLine) {
        stave.addClef(exercise.clef);
      }
      if (isFirstBar) {
        if (exercise.keySignature && exercise.keySignature !== 'C') {
          stave.addKeySignature(exercise.keySignature);
        }
        stave.addTimeSignature(exercise.timeSignature);
      }

      stave.setContext(context).draw();

      const { staveNotes, noteInfos } = createNotesFromBar(bar, false, exercise.id);
      const voice = new Voice({ numBeats: beats, beatValue: beatValue });
      voice.addTickables(staveNotes);

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

  let barIndex = 0;
  for (let line = 0; line < linesNeeded; line++) {
    const barsInThisLine = Math.min(config.barsPerLine, totalBars - barIndex);

    for (let barInLine = 0; barInLine < barsInThisLine; barInLine++) {
      const bar = exercise.bars[barIndex];
      const isFirstBar = barIndex === 0;
      const isFirstInLine = barInLine === 0;

      const x = config.padding.left + (barInLine * staveWidth);
      const yTreble = config.padding.top + (line * systemHeight);
      const yBass = yTreble + bassStaveOffset;

      // Create treble stave
      const trebleStave = new Stave(x, yTreble, staveWidth);
      if (isFirstInLine) {
        trebleStave.addClef('treble');
      }
      if (isFirstBar) {
        if (exercise.keySignature && exercise.keySignature !== 'C') {
          trebleStave.addKeySignature(exercise.keySignature);
        }
        trebleStave.addTimeSignature(exercise.timeSignature);
      }
      trebleStave.setContext(context).draw();

      // Create bass stave
      const bassStave = new Stave(x, yBass, staveWidth);
      if (isFirstInLine) {
        bassStave.addClef('bass');
      }
      if (isFirstBar) {
        if (exercise.keySignature && exercise.keySignature !== 'C') {
          bassStave.addKeySignature(exercise.keySignature);
        }
        bassStave.addTimeSignature(exercise.timeSignature);
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
      const { staveNotes: trebleNotes, noteInfos: trebleNoteInfos } = createNotesFromBar(bar, false, exercise.id);
      const trebleVoice = new Voice({ numBeats: beats, beatValue: beatValue });
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

      if (hasBass) {
        const bassResult = createNotesFromBar(bar, true, exercise.id);
        bassNotes = bassResult.staveNotes;
        bassNoteInfos = bassResult.noteInfos;
        bassVoice = new Voice({ numBeats: beats, beatValue: beatValue });
        bassVoice.addTickables(bassNotes);
        bassBeams = Beam.generateBeams(bassNotes);
      }

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
  const width = Math.max(finalConfig.width, 600);

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

  return noteInfos;
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
  containerWidth: number = 800,
  isGrandStaff: boolean = false
): { width: number; height: number } {
  const linesNeeded = Math.ceil(barCount / barsPerLine);
  const padding = { top: 40, bottom: 20 };

  const heightPerLine = isGrandStaff ? 230 : 120;

  return {
    width: Math.max(containerWidth, 600),
    height: padding.top + (linesNeeded * heightPerLine) + padding.bottom,
  };
}
