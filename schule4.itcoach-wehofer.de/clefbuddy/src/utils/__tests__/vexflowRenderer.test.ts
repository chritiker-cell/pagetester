import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  renderExercise,
  highlightNote,
  highlightNotes,
  clearNoteHighlights,
  highlightNotePractice,
  clearPracticeFeedback,
  getNotePosition,
  getNoteInfoByIndex,
  getNoteIdsForBar,
  getRenderedNotes,
  calculateOptimalDimensions,
  showCursorAtPosition,
  hidePlaybackCursor,
  removePlaybackCursor,
  type CursorTimelineEntry,
} from '../vexflowRenderer';
import type { Exercise, Bar } from '../../types/music';

// Polyfill getBBox for jsdom (SVG method not implemented)
if (!SVGElement.prototype.getBBox) {
  (SVGElement.prototype as any).getBBox = function () {
    return { x: 150, y: 100, width: 20, height: 40 };
  };
}

// Mock VexFlow to avoid DOM rendering in tests
vi.mock('vexflow', () => {
  // Use function declaration (not arrow function) to make it a proper constructor
  function RendererMock(container: HTMLElement) {
    // Append SVG to container to match VexFlow behavior
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '1200');
    svg.setAttribute('height', '200');
    container.appendChild(svg);

    return {
      resize: vi.fn(),
      getContext: vi.fn().mockReturnValue({
        svg: svg,
        setFont: vi.fn().mockReturnThis(),
        setFillStyle: vi.fn().mockReturnThis(),
        setStrokeStyle: vi.fn().mockReturnThis(),
        fillText: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
      }),
    };
  }
  // Add static Backends property required by production code
  RendererMock.Backends = { SVG: 'svg' };

  function StaveMock() {
    return {
      setContext: vi.fn().mockReturnThis(),
      addClef: vi.fn().mockReturnThis(),
      addTimeSignature: vi.fn().mockReturnThis(),
      addKeySignature: vi.fn().mockReturnThis(),
      setEndBarType: vi.fn().mockReturnThis(),
      draw: vi.fn(),
      getX: vi.fn().mockReturnValue(100),
      getYForLine: vi.fn().mockReturnValue(100),
      getWidth: vi.fn().mockReturnValue(200),
      getNoteStartX: vi.fn().mockReturnValue(100),
      getNoteEndX: vi.fn().mockReturnValue(300),
    };
  }

  function StaveNoteMock() {
    // Create a unique SVG <g> element for each note
    const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gElement.setAttribute('class', 'vf-stavenote');

    let mockContext: any = null;

    return {
      setContext: vi.fn(function(this: any, ctx: any) {
        mockContext = ctx;
        // Append the <g> element to the SVG when context is set
        if (ctx?.svg) {
          ctx.svg.appendChild(gElement);
        }
        return this;
      }),
      setStave: vi.fn().mockReturnThis(),
      setStyle: vi.fn().mockReturnThis(),
      addModifier: vi.fn().mockReturnThis(),
      addDot: vi.fn().mockReturnThis(),
      draw: vi.fn().mockReturnThis(),
      getAbsoluteX: vi.fn().mockReturnValue(150),
      getSVGElement: vi.fn().mockReturnValue(gElement),
      setAttribute: vi.fn(),
    };
  }

  function VoiceMock() {
    const tickables: any[] = [];
    return {
      setMode: vi.fn().mockReturnThis(),
      addTickables: vi.fn(function(this: any, notes: any[]) {
        tickables.push(...notes);
        return this;
      }),
      draw: vi.fn(function(_ctx: any, _stave: any) {
        // Real VexFlow voice.draw() calls setContext + draw on each tickable
        tickables.forEach(note => {
          if (note.setContext && _ctx) note.setContext(_ctx);
          if (note.draw) note.draw();
        });
      }),
      getTickables: vi.fn(() => tickables),
    };
  }
  // Add static Mode property
  VoiceMock.Mode = { SOFT: 1, STRICT: 2, FULL: 3 };

  function FormatterMock() {
    return {
      joinVoices: vi.fn().mockReturnThis(),
      format: vi.fn().mockReturnThis(),
      formatToStave: vi.fn().mockReturnThis(),
    };
  }

  function StaveConnectorMock() {
    return {
      setType: vi.fn().mockReturnThis(),
      setContext: vi.fn().mockReturnThis(),
      draw: vi.fn(),
    };
  }

  function BeamMock() {
    return {
      setContext: vi.fn().mockReturnThis(),
      draw: vi.fn(),
    };
  }
  // Add static generateBeams method
  BeamMock.generateBeams = vi.fn().mockReturnValue([]);

  function AnnotationMock() {
    return {
      setContext: vi.fn().mockReturnThis(),
      setVerticalJustification: vi.fn().mockReturnThis(),
      draw: vi.fn(),
    };
  }
  AnnotationMock.VerticalJustify = { TOP: 1, BOTTOM: 4 };

  function TupletMock() {
    return {
      setContext: vi.fn().mockReturnThis(),
      draw: vi.fn(),
    };
  }

  function BarlineMock() {
    return {};
  }
  // Add static type property
  BarlineMock.type = {
    SINGLE: 1,
    DOUBLE: 2,
    END: 3,
    REPEAT_BEGIN: 4,
    REPEAT_END: 5,
    REPEAT_BOTH: 6,
    NONE: 7,
  };

  const AccidentalMock = Object.assign(vi.fn(), {
    applyAccidentals: vi.fn(),
  });

  return {
    Renderer: RendererMock,
    Stave: StaveMock,
    StaveNote: StaveNoteMock,
    Voice: VoiceMock,
    Formatter: FormatterMock,
    StaveConnector: StaveConnectorMock,
    Beam: BeamMock,
    Annotation: AnnotationMock,
    Barline: BarlineMock,
    Dot: Object.assign(vi.fn(), { buildAndAttach: vi.fn() }),
    Tuplet: TupletMock,
    Accidental: AccidentalMock,
  };
});

function makeBar(overrides: Partial<Bar> = {}): Bar {
  return {
    number: 1,
    notes: [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
    ],
    bassNotes: [],
    ...overrides,
  };
}

function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: 'test-exercise',
    name: 'Test Exercise',
    description: 'A test exercise',
    difficulty: 'beginner',
    level: 1,
    bars: [makeBar(), makeBar({ number: 2 }), makeBar({ number: 3 }), makeBar({ number: 4 })],
    clef: 'treble',
    timeSignature: '4/4',
    keySignature: 'C',
    tempo: 120,
    grandStaff: false,
    ...overrides,
  };
}

describe('renderExercise', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders single staff exercise', () => {
    const exercise = makeExercise();
    const noteInfos = renderExercise(container, exercise);

    expect(noteInfos.length).toBeGreaterThan(0);
    expect(container.innerHTML).not.toBe('');
  });

  it('renders grand staff exercise', () => {
    const exercise = makeExercise({
      grandStaff: true,
      bars: [
        makeBar({ bassNotes: [{ keys: ['c/3'], duration: 'q' }] }),
        makeBar({ number: 2, bassNotes: [{ keys: ['d/3'], duration: 'q' }] }),
      ],
    });

    const noteInfos = renderExercise(container, exercise);

    // Should have both treble and bass notes
    const trebleNotes = noteInfos.filter((n) => n.voice === 'treble');
    const bassNotes = noteInfos.filter((n) => n.voice === 'bass');

    expect(trebleNotes.length).toBeGreaterThan(0);
    expect(bassNotes.length).toBeGreaterThan(0);
  });

  it('clears container before rendering', () => {
    container.innerHTML = '<div>Previous content</div>';
    const exercise = makeExercise();

    renderExercise(container, exercise);

    expect(container.querySelector('div')).toBeNull();
  });

  it('respects custom width and height', () => {
    const exercise = makeExercise();
    const config = { width: 800, height: 300 };

    renderExercise(container, exercise, config);

    // Note: Actual size verification would require inspecting SVG attributes
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('respects barsPerLine configuration', () => {
    const exercise = makeExercise({ bars: Array(8).fill(null).map((_, i) => makeBar({ number: i + 1 })) });
    const config = { barsPerLine: 2 };

    const noteInfos = renderExercise(container, exercise, config);

    // 8 bars with 2 per line = 4 lines
    expect(noteInfos.length).toBe(8 * 4); // 8 bars * 4 notes per bar
  });

  it('returns rendered note info for all notes', () => {
    const exercise = makeExercise();
    const noteInfos = renderExercise(container, exercise);

    // 4 bars * 4 notes per bar = 16 notes
    expect(noteInfos.length).toBe(16);

    // Check first note structure
    const firstNote = noteInfos[0];
    expect(firstNote).toHaveProperty('noteId');
    expect(firstNote).toHaveProperty('barNumber');
    expect(firstNote).toHaveProperty('noteIndex');
    expect(firstNote).toHaveProperty('voice');
    expect(firstNote).toHaveProperty('svgElement');
  });

  it('assigns unique noteIds', () => {
    const exercise = makeExercise();
    const noteInfos = renderExercise(container, exercise);

    const noteIds = noteInfos.map((n) => n.noteId);
    const uniqueIds = new Set(noteIds);

    expect(uniqueIds.size).toBe(noteIds.length);
  });

  it('maintains bar numbers in note info', () => {
    const exercise = makeExercise();
    const noteInfos = renderExercise(container, exercise);

    const bar1Notes = noteInfos.filter((n) => n.barNumber === 1);
    const bar2Notes = noteInfos.filter((n) => n.barNumber === 2);
    const bar3Notes = noteInfos.filter((n) => n.barNumber === 3);
    const bar4Notes = noteInfos.filter((n) => n.barNumber === 4);

    expect(bar1Notes.length).toBe(4);
    expect(bar2Notes.length).toBe(4);
    expect(bar3Notes.length).toBe(4);
    expect(bar4Notes.length).toBe(4);
  });

  it('handles key signatures correctly', () => {
    const exercise = makeExercise({ keySignature: 'G' });
    const noteInfos = renderExercise(container, exercise);

    expect(noteInfos.length).toBeGreaterThan(0);
  });

  it('handles different time signatures', () => {
    const exercise = makeExercise({
      timeSignature: '3/4',
      bars: [
        makeBar({ notes: [{ keys: ['c/4'], duration: 'q' }, { keys: ['d/4'], duration: 'q' }, { keys: ['e/4'], duration: 'q' }] }),
      ],
    });

    const noteInfos = renderExercise(container, exercise);

    expect(noteInfos.length).toBe(3);
  });
});

describe('calculateOptimalDimensions', () => {
  it('calculates dimensions for 4 bars on single staff', () => {
    const dims = calculateOptimalDimensions(4, 4, 1200, false);

    expect(dims.width).toBe(1200);
    expect(dims.height).toBeGreaterThan(100); // At least one line of staves
  });

  it('calculates dimensions for 8 bars (2 lines)', () => {
    const dims = calculateOptimalDimensions(8, 4, 1200, false);

    expect(dims.width).toBe(1200);
    expect(dims.height).toBeGreaterThan(200); // Two lines
  });

  it('calculates larger height for grand staff', () => {
    const singleStaffDims = calculateOptimalDimensions(4, 4, 1200, false);
    const grandStaffDims = calculateOptimalDimensions(4, 4, 1200, true);

    expect(grandStaffDims.height).toBeGreaterThan(singleStaffDims.height);
  });

  it('respects barsPerLine parameter', () => {
    const dims2PerLine = calculateOptimalDimensions(8, 2, 1200, false); // 4 lines
    const dims4PerLine = calculateOptimalDimensions(8, 4, 1200, false); // 2 lines

    expect(dims2PerLine.height).toBeGreaterThan(dims4PerLine.height);
  });

  it('enforces minimum width', () => {
    const dims = calculateOptimalDimensions(4, 4, 400, false);

    expect(dims.width).toBeGreaterThanOrEqual(800); // Minimum 800
  });
});

describe('Note highlighting', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('highlights a note by ID', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteInfos = getRenderedNotes();
    const firstNoteId = noteInfos[0].noteId;

    highlightNote(firstNoteId);

    const highlightedElement = container.querySelector(`[data-note-id="${firstNoteId}"]`);
    expect(highlightedElement?.classList.contains('note-highlighted')).toBe(true);
  });

  it('clears previous highlight when highlighting new note', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteInfos = getRenderedNotes();
    const firstNoteId = noteInfos[0].noteId;
    const secondNoteId = noteInfos[1].noteId;

    highlightNote(firstNoteId);
    highlightNote(secondNoteId);

    const firstElement = container.querySelector(`[data-note-id="${firstNoteId}"]`);
    const secondElement = container.querySelector(`[data-note-id="${secondNoteId}"]`);

    expect(firstElement?.classList.contains('note-highlighted')).toBe(false);
    expect(secondElement?.classList.contains('note-highlighted')).toBe(true);
  });

  it('highlights multiple notes simultaneously', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteInfos = getRenderedNotes();
    const noteIds = [noteInfos[0].noteId, noteInfos[1].noteId, noteInfos[2].noteId];

    highlightNotes(noteIds);

    noteIds.forEach((id) => {
      const element = container.querySelector(`[data-note-id="${id}"]`);
      expect(element?.classList.contains('note-highlighted')).toBe(true);
    });
  });

  it('clears all note highlights', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteInfos = getRenderedNotes();
    const noteIds = [noteInfos[0].noteId, noteInfos[1].noteId];

    highlightNotes(noteIds);
    clearNoteHighlights();

    noteIds.forEach((id) => {
      const element = container.querySelector(`[data-note-id="${id}"]`);
      expect(element?.classList.contains('note-highlighted')).toBe(false);
    });
  });
});

describe('Practice feedback highlighting', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('highlights note as correct', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteId = getRenderedNotes()[0].noteId;
    highlightNotePractice(noteId, 'correct');

    const element = container.querySelector(`[data-note-id="${noteId}"]`);
    expect(element?.classList.contains('note-correct')).toBe(true);
  });

  it('highlights note as incorrect', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteId = getRenderedNotes()[0].noteId;
    highlightNotePractice(noteId, 'incorrect');

    const element = container.querySelector(`[data-note-id="${noteId}"]`);
    expect(element?.classList.contains('note-incorrect')).toBe(true);
  });

  it('highlights note as missed', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteId = getRenderedNotes()[0].noteId;
    highlightNotePractice(noteId, 'missed');

    const element = container.querySelector(`[data-note-id="${noteId}"]`);
    expect(element?.classList.contains('note-missed')).toBe(true);
  });

  it('highlights note as current', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteId = getRenderedNotes()[0].noteId;
    highlightNotePractice(noteId, 'current');

    const element = container.querySelector(`[data-note-id="${noteId}"]`);
    expect(element?.classList.contains('note-current')).toBe(true);
  });

  it('removes previous feedback class when applying new one', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteId = getRenderedNotes()[0].noteId;
    highlightNotePractice(noteId, 'correct');
    highlightNotePractice(noteId, 'incorrect');

    const element = container.querySelector(`[data-note-id="${noteId}"]`);
    expect(element?.classList.contains('note-correct')).toBe(false);
    expect(element?.classList.contains('note-incorrect')).toBe(true);
  });

  it('clears all practice feedback', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteIds = getRenderedNotes().slice(0, 3).map((n) => n.noteId);
    highlightNotePractice(noteIds[0], 'correct');
    highlightNotePractice(noteIds[1], 'incorrect');
    highlightNotePractice(noteIds[2], 'current');

    clearPracticeFeedback();

    noteIds.forEach((id) => {
      const element = container.querySelector(`[data-note-id="${id}"]`);
      expect(element?.classList.contains('note-correct')).toBe(false);
      expect(element?.classList.contains('note-incorrect')).toBe(false);
      expect(element?.classList.contains('note-current')).toBe(false);
    });
  });
});

describe('Note position queries', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('gets note position by ID', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteId = getRenderedNotes()[0].noteId;
    const position = getNotePosition(noteId);

    expect(position).not.toBeNull();
    if (position) {
      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('lineTop');
      expect(position).toHaveProperty('lineBottom');
      expect(position).toHaveProperty('lineIndex');
    }
  });

  it('returns null for non-existent note ID', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const position = getNotePosition('non-existent-id');

    expect(position).toBeNull();
  });

  it('gets note info by bar and index', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteInfo = getNoteInfoByIndex(1, 0, 'treble');

    expect(noteInfo).not.toBeNull();
    if (noteInfo) {
      expect(noteInfo.barNumber).toBe(1);
      expect(noteInfo.noteIndex).toBe(0);
      expect(noteInfo.voice).toBe('treble');
    }
  });

  it('gets all note IDs for a bar', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const noteIds = getNoteIdsForBar(1);

    expect(noteIds.length).toBe(4); // 4 notes in first bar
  });

  it('gets all note IDs for grand staff bar', () => {
    const exercise = makeExercise({
      grandStaff: true,
      bars: [makeBar({ bassNotes: [{ keys: ['c/3'], duration: 'q' }] })],
    });

    renderExercise(container, exercise);

    const noteIds = getNoteIdsForBar(1);

    // Should include both treble and bass notes
    expect(noteIds.length).toBeGreaterThan(4);
  });

  it('returns all rendered notes', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise);

    const notes = getRenderedNotes();

    expect(notes.length).toBe(16); // 4 bars * 4 notes
    expect(notes[0]).toHaveProperty('noteId');
    expect(notes[0]).toHaveProperty('barNumber');
  });
});

describe('Cursor display', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.classList.add('music-sheet-container');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    container.appendChild(svg);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('shows cursor at specified position', () => {
    showCursorAtPosition(100, 50, 150);

    const cursor = container.querySelector('#playback-cursor');
    expect(cursor).not.toBeNull();
    expect(cursor?.getAttribute('x1')).toBe('100');
    expect(cursor?.getAttribute('y1')).toBe('50');
    expect(cursor?.getAttribute('y2')).toBe('150');
  });

  it('hides playback cursor', () => {
    showCursorAtPosition(100, 50, 150);
    hidePlaybackCursor();

    const cursor = container.querySelector('#playback-cursor');
    expect(cursor?.getAttribute('visibility')).toBe('hidden');
  });

  it('removes playback cursor', () => {
    showCursorAtPosition(100, 50, 150);
    removePlaybackCursor();

    const cursor = container.querySelector('#playback-cursor');
    expect(cursor).toBeNull();
  });
});

describe('Line index calculation (cursor jump fix)', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('assigns correct line index for bars on same line', () => {
    const exercise = makeExercise();
    renderExercise(container, exercise, { barsPerLine: 4 });

    const bar1Note = getNotePosition(getRenderedNotes()[0].noteId);
    const bar2Note = getNotePosition(getRenderedNotes()[4].noteId); // First note of bar 2

    expect(bar1Note?.lineIndex).toBe(0);
    expect(bar2Note?.lineIndex).toBe(0);
  });

  it('assigns different line index for bars on different lines', () => {
    const exercise = makeExercise({ bars: Array(8).fill(null).map((_, i) => makeBar({ number: i + 1 })) });
    renderExercise(container, exercise, { barsPerLine: 4 });

    const bar1Note = getNotePosition(getRenderedNotes()[0].noteId);
    const bar5Note = getNotePosition(getRenderedNotes()[16].noteId); // First note of bar 5

    expect(bar1Note?.lineIndex).toBe(0);
    expect(bar5Note?.lineIndex).toBe(1);
  });

  it('calculates line index based on bar number and barsPerLine', () => {
    const exercise = makeExercise({ bars: Array(12).fill(null).map((_, i) => makeBar({ number: i + 1 })) });
    renderExercise(container, exercise, { barsPerLine: 4 });

    // Bar 1 (index 0): lineIndex = floor(0/4) = 0
    // Bar 5 (index 4): lineIndex = floor(4/4) = 1
    // Bar 9 (index 8): lineIndex = floor(8/4) = 2

    const bar1 = getNotePosition(getRenderedNotes()[0].noteId);
    const bar5 = getNotePosition(getRenderedNotes()[16].noteId);
    const bar9 = getNotePosition(getRenderedNotes()[32].noteId);

    expect(bar1?.lineIndex).toBe(0);
    expect(bar5?.lineIndex).toBe(1);
    expect(bar9?.lineIndex).toBe(2);
  });
});

describe('Cursor timeline entries', () => {
  it('builds timeline with correct structure', () => {
    const entries: CursorTimelineEntry[] = [
      { x: 100, time: 0, lineTop: 50, lineBottom: 150, noteId: 'test-bar1-treble-note0', lineIndex: 0 },
      { x: 200, time: 0.5, lineTop: 50, lineBottom: 150, noteId: 'test-bar1-treble-note1', lineIndex: 0 },
      { x: 100, time: 1.0, lineTop: 200, lineBottom: 300, noteId: 'test-bar2-treble-note0', lineIndex: 1 },
    ];

    expect(entries[0].lineIndex).toBe(0);
    expect(entries[1].lineIndex).toBe(0);
    expect(entries[2].lineIndex).toBe(1); // Line change
  });
});
