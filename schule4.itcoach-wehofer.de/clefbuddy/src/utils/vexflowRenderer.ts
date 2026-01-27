/**
 * VexFlow Renderer Utility
 * Renders music notation from Exercise data using VexFlow 5.x
 * Supports single staff and grand staff (piano) notation
 * Includes note highlighting for playback visualization
 */

import { Renderer, Stave, StaveNote, Voice, Formatter, StaveConnector } from 'vexflow';
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
    });

    const noteId = `${exerciseId}-bar${bar.number}-${voice}-note${index}`;

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
        stave.addTimeSignature(exercise.timeSignature);
      }

      stave.setContext(context).draw();

      const { staveNotes, noteInfos } = createNotesFromBar(bar, false, exercise.id);
      const voice = new Voice({ numBeats: beats, beatValue: beatValue });
      voice.addTickables(staveNotes);

      const noteStartX = stave.getNoteStartX();
      const noteEndX = stave.getNoteEndX();
      const availableWidth = noteEndX - noteStartX;

      const formatter = new Formatter();
      formatter.joinVoices([voice]).format([voice], Math.max(availableWidth - 10, 50));
      voice.draw(context, stave);

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
  const bassStaveOffset = 70; // Distance between treble and bass stave
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
        trebleStave.addTimeSignature(exercise.timeSignature);
      }
      trebleStave.setContext(context).draw();

      // Create bass stave
      const bassStave = new Stave(x, yBass, staveWidth);
      if (isFirstInLine) {
        bassStave.addClef('bass');
      }
      if (isFirstBar) {
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

      // Render treble notes
      const { staveNotes: trebleNotes, noteInfos: trebleNoteInfos } = createNotesFromBar(bar, false, exercise.id);
      const trebleVoice = new Voice({ numBeats: beats, beatValue: beatValue });
      trebleVoice.addTickables(trebleNotes);

      const trebleNoteStartX = trebleStave.getNoteStartX();
      const trebleNoteEndX = trebleStave.getNoteEndX();
      const trebleAvailableWidth = trebleNoteEndX - trebleNoteStartX;

      const trebleFormatter = new Formatter();
      trebleFormatter.joinVoices([trebleVoice]).format([trebleVoice], Math.max(trebleAvailableWidth - 10, 50));
      trebleVoice.draw(context, trebleStave);

      // Store SVG elements for treble notes
      trebleNotes.forEach((note, idx) => {
        const svgElem = (note as any).getSVGElement?.() || null;
        if (trebleNoteInfos[idx]) {
          trebleNoteInfos[idx].svgElement = svgElem;
        }
      });
      allNoteInfos.push(...trebleNoteInfos);

      // Render bass notes if they exist
      if (bar.bassNotes && bar.bassNotes.length > 0) {
        const { staveNotes: bassNotes, noteInfos: bassNoteInfos } = createNotesFromBar(bar, true, exercise.id);
        const bassVoice = new Voice({ numBeats: beats, beatValue: beatValue });
        bassVoice.addTickables(bassNotes);

        const bassNoteStartX = bassStave.getNoteStartX();
        const bassNoteEndX = bassStave.getNoteEndX();
        const bassAvailableWidth = bassNoteEndX - bassNoteStartX;

        const bassFormatter = new Formatter();
        bassFormatter.joinVoices([bassVoice]).format([bassVoice], Math.max(bassAvailableWidth - 10, 50));
        bassVoice.draw(context, bassStave);

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
    const systemHeight = 200; // Height for grand staff system
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
 * Clear all note highlights
 */
export function clearNoteHighlights(): void {
  const highlightedNotes = document.querySelectorAll('.note-highlighted');
  highlightedNotes.forEach((note) => {
    note.classList.remove('note-highlighted');
  });
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

  const heightPerLine = isGrandStaff ? 200 : 120;

  return {
    width: Math.max(containerWidth, 600),
    height: padding.top + (linesNeeded * heightPerLine) + padding.bottom,
  };
}
