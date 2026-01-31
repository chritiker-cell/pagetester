import { useEffect, useRef } from 'react';
import type { Exercise } from '../../types/music';
import {
  renderExercise,
  calculateOptimalDimensions,
  highlightNotes,
  clearNoteHighlights,
  removePlaybackCursor,
} from '../../utils/vexflowRenderer';

interface MusicSheetProps {
  exercise: Exercise;
  width?: number;
  barsPerLine?: number;
  highlightedNoteIds?: string[];
  className?: string;
  fullscreen?: boolean;
}

export function MusicSheet({
  exercise,
  width,
  barsPerLine = 4,
  highlightedNoteIds = [],
  className = '',
  fullscreen = false,
}: MusicSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure + render in a single effect so we always use the actual container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const doRender = () => {
      const renderWidth = fullscreen
        ? (el.clientWidth || 900)
        : (width ?? 900);

      const dimensions = calculateOptimalDimensions(
        exercise.bars.length,
        barsPerLine,
        renderWidth,
        exercise.grandStaff
      );

      try {
        renderExercise(el, exercise, {
          width: dimensions.width,
          height: dimensions.height,
          barsPerLine,
        });
      } catch (error) {
        console.error('Error rendering music notation:', error);
        el.innerHTML = `
          <div style="color: red; padding: 20px; text-align: center;">
            Fehler beim Rendern: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}
          </div>
        `;
      }
    };

    doRender();

    // Re-render on resize in fullscreen mode
    let ro: ResizeObserver | null = null;
    if (fullscreen) {
      ro = new ResizeObserver(() => doRender());
      ro.observe(el);
    }

    return () => {
      ro?.disconnect();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [exercise, fullscreen, width, barsPerLine]);

  // Note highlighting (practice mode)
  useEffect(() => {
    if (highlightedNoteIds.length > 0) {
      highlightNotes(highlightedNoteIds);
    } else {
      clearNoteHighlights();
    }
  }, [highlightedNoteIds]);

  useEffect(() => {
    return () => {
      clearNoteHighlights();
      removePlaybackCursor();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`music-sheet-container ${className}`}
      style={fullscreen ? {
        width: '100%',
        height: '100%',
      } : {
        overflow: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: 'white',
        padding: '8px',
      }}
    />
  );
}

export default MusicSheet;
