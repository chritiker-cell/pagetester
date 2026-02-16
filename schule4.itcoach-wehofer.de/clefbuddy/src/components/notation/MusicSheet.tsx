import { useEffect, useRef } from 'react';
import type { Exercise } from '../../types/music';
import {
  renderExercise,
  calculateOptimalDimensions,
  highlightNotes,
  clearNoteHighlights,
  removePlaybackCursor,
} from '../../utils/vexflowRenderer';
import { useNoteReaderSettingsStore } from '../../store/useNoteReaderSettingsStore';

interface MusicSheetProps {
  exercise: Exercise;
  width?: number;
  barsPerLine?: number;
  highlightedNoteIds?: string[];
  className?: string;
  fullscreen?: boolean;
  showChordSymbols?: boolean;
}

export function MusicSheet({
  exercise,
  width,
  barsPerLine = 4,
  highlightedNoteIds = [],
  className = '',
  fullscreen = false,
  showChordSymbols: showChordSymbolsProp,
}: MusicSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const noteReaderShowChordSymbols = useNoteReaderSettingsStore(state => state.showChordSymbols);
  const showChordSymbols = showChordSymbolsProp ?? noteReaderShowChordSymbols;
  const resizeTimeoutRef = useRef<number | null>(null);

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
          showChordSymbols,
        });
      } catch (error) {
        console.error('Error rendering music notation:', error);
        el.textContent = '';
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'color: red; padding: 20px; text-align: center;';
        errorDiv.textContent = `Fehler beim Rendern: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`;
        el.appendChild(errorDiv);
      }
    };

    doRender();

    // Re-render on resize in fullscreen mode (debounced, only on WIDTH change)
    let ro: ResizeObserver | null = null;
    let lastWidth = el.clientWidth;
    if (fullscreen) {
      ro = new ResizeObserver((entries) => {
        const newWidth = entries[0]?.contentRect.width ?? el.clientWidth;
        // Only re-render if width changed significantly (> 10px)
        // This prevents re-render when toolbar height changes (play/pause)
        if (Math.abs(newWidth - lastWidth) > 10) {
          lastWidth = newWidth;
          // Clear any pending timeout
          if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
          }
          // Debounce re-render by 150ms
          resizeTimeoutRef.current = setTimeout(() => {
            doRender();
          }, 150);
        }
      });
      ro.observe(el);
    }

    return () => {
      ro?.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [exercise, fullscreen, width, barsPerLine, showChordSymbols, showChordSymbolsProp]);

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
      className={`music-sheet-container ${className} ${!fullscreen ? 'border border-neutral-200 dark:border-neutral-700 bg-white' : ''}`}
      style={fullscreen ? {
        width: '100%',
        height: '100%',
      } : {
        overflow: 'auto',
        borderRadius: '8px',
        padding: '8px',
      }}
    />
  );
}

export default MusicSheet;
