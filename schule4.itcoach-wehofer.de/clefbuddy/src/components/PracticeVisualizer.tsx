/**
 * Practice Visualizer Component
 *
 * Shows real-time visual feedback during practice mode.
 * Displays accuracy stats and note feedback.
 * Note: Visual countdown was removed - audio countdown (metronome clicks) still works.
 */

import React, { useEffect, useRef } from 'react';
import type { PracticeModeState } from '../utils/practiceMode';
import type { NoteComparison } from '../types/comparison';

interface PracticeVisualizerProps {
  practiceState: PracticeModeState;
  correctCount: number;
  incorrectCount: number;
  totalNotes: number;
  currentNoteIndex: number;
  lastComparison?: NoteComparison | null;
  className?: string;
}

// Icons
const CheckIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const PracticeVisualizer: React.FC<PracticeVisualizerProps> = ({
  practiceState,
  correctCount,
  incorrectCount,
  totalNotes,
  currentNoteIndex,
  lastComparison,
  className = '',
}) => {
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Animate feedback on new comparison
  useEffect(() => {
    if (lastComparison && feedbackRef.current) {
      feedbackRef.current.classList.add('scale-110');
      setTimeout(() => {
        feedbackRef.current?.classList.remove('scale-110');
      }, 150);
    }
  }, [lastComparison]);

  const accuracy =
    correctCount + incorrectCount > 0
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
      : 0;

  const progress =
    totalNotes > 0
      ? Math.round(((correctCount + incorrectCount) / totalNotes) * 100)
      : 0;

  // Countdown: Zeige Fortschrittsleiste bei 0% (verhindert späteren Re-Render)
  if (practiceState === 'countdown') {
    return (
      <div className={`bg-white rounded-lg border border-neutral-200 px-4 py-2 ${className}`}>
        <div className="flex items-center gap-4">
          {/* Progress */}
          <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">
            0/{totalNotes}
          </span>

          {/* Progress bar at 0% */}
          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: '0%' }}
            />
          </div>

          {/* Stats at 0 */}
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-success font-medium">
              <CheckIcon className="w-3.5 h-3.5" />
              0
            </span>
            <span className="flex items-center gap-1 text-error font-medium">
              <XIcon className="w-3.5 h-3.5" />
              0
            </span>
          </div>

          {/* Accuracy at 0% */}
          <span className="text-sm font-bold text-neutral-400">
            0%
          </span>
        </div>
      </div>
    );
  }

  // Idle state
  if (practiceState === 'idle') {
    return (
      <div
        className={`flex items-center justify-center p-6 bg-neutral-100 rounded-xl ${className}`}
      >
        <div className="text-center text-neutral-500">
          <p className="text-lg font-medium">Bereit zum Üben</p>
          <p className="text-sm mt-1">Drücke Start um zu beginnen</p>
        </div>
      </div>
    );
  }

  // Playing state - compact single-line feedback
  return (
    <div className={`bg-white rounded-lg border border-neutral-200 px-4 py-2 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Progress */}
        <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">
          {Math.min(currentNoteIndex + 1, totalNotes)}/{totalNotes}
        </span>

        {/* Progress bar */}
        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-success font-medium">
            <CheckIcon className="w-3.5 h-3.5" />
            {correctCount}
          </span>
          <span className="flex items-center gap-1 text-error font-medium">
            <XIcon className="w-3.5 h-3.5" />
            {incorrectCount}
          </span>
        </div>

        {/* Accuracy */}
        <span
          ref={feedbackRef}
          className={`text-sm font-bold transition-transform duration-150 ${
            accuracy >= 80
              ? 'text-success'
              : accuracy >= 60
              ? 'text-warning'
              : 'text-error'
          }`}
        >
          {accuracy}%
        </span>

        {/* Last feedback */}
        {lastComparison && (
          <span className="text-xs">
            {lastComparison.result === 'correct' ? (
              <CheckIcon className="w-4 h-4 text-success" />
            ) : (
              <XIcon className="w-4 h-4 text-error" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default PracticeVisualizer;
