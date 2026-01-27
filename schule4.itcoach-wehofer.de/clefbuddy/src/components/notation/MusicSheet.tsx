/**
 * MusicSheet Component
 * Renders musical notation using VexFlow
 * Supports note highlighting during playback
 */

import { useEffect, useRef } from 'react';
import type { Exercise } from '../../types/music';
import {
  renderExercise,
  calculateOptimalDimensions,
  highlightNote,
  clearNoteHighlights,
} from '../../utils/vexflowRenderer';

interface MusicSheetProps {
  /** Exercise data to render */
  exercise: Exercise;

  /** Width in pixels */
  width?: number;

  /** Number of bars per line */
  barsPerLine?: number;

  /** ID of the currently highlighted note */
  highlightedNoteId?: string | null;

  /** Additional CSS classes */
  className?: string;
}

/**
 * MusicSheet component renders musical notation from exercise data
 */
export function MusicSheet({
  exercise,
  width = 900,
  barsPerLine = 4,
  highlightedNoteId = null,
  className = '',
}: MusicSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Render the exercise
  useEffect(() => {
    if (!containerRef.current) return;

    const dimensions = calculateOptimalDimensions(
      exercise.bars.length,
      barsPerLine,
      width,
      exercise.grandStaff
    );

    try {
      renderExercise(containerRef.current, exercise, {
        width: dimensions.width,
        height: dimensions.height,
        barsPerLine,
      });
    } catch (error) {
      console.error('Error rendering music notation:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="color: red; padding: 20px; text-align: center;">
            Fehler beim Rendern: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}
          </div>
        `;
      }
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [exercise, width, barsPerLine]);

  // Handle note highlighting
  useEffect(() => {
    if (highlightedNoteId) {
      highlightNote(highlightedNoteId);
    } else {
      clearNoteHighlights();
    }
  }, [highlightedNoteId]);

  // Clear highlights on unmount
  useEffect(() => {
    return () => {
      clearNoteHighlights();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`music-sheet-container ${className}`}
      style={{
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
