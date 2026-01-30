/**
 * Results Modal Component
 *
 * Displays practice session results with star rating, score breakdown,
 * and options to retry or continue.
 */

import React, { useEffect, useState } from 'react';
import type { SessionSummary, StarRating } from '../types/scoring';
import { STAR_LABELS } from '../types/scoring';
import ScoreBreakdown from './ScoreBreakdown';
import Button from './ui/Button';

interface ResultsModalProps {
  summary: SessionSummary;
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onNextExercise?: () => void;
  className?: string;
}

// Star component
const Star: React.FC<{ filled: boolean; delay: number }> = ({
  filled,
  delay,
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (filled) {
      const timer = setTimeout(() => setAnimated(true), delay);
      return () => clearTimeout(timer);
    }
  }, [filled, delay]);

  return (
    <svg
      className={`w-10 h-10 transition-all duration-300 ${
        animated ? 'scale-110' : 'scale-100'
      }`}
      viewBox="0 0 24 24"
      fill={filled && animated ? '#fbbf24' : 'none'}
      stroke={filled ? '#fbbf24' : '#d1d5db'}
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
};

// Star rating display
const StarRatingDisplay: React.FC<{ stars: StarRating }> = ({ stars }) => {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= stars} delay={i * 150} />
      ))}
    </div>
  );
};

const ResultsModal: React.FC<ResultsModalProps> = ({
  summary,
  isOpen,
  onClose,
  onRetry,
  onNextExercise,
  className = '',
}) => {
  const { score, improvement, message } = summary;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70">
      <div
        className={`bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-400 to-primary-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-xl font-bold text-center mb-1">Übung beendet!</h2>
          <p className="text-primary-100 text-center text-sm">
            {score.exerciseName}
          </p>
        </div>

        {/* Stars */}
        <div className="py-6 text-center">
          <StarRatingDisplay stars={score.stars} />
          <p className="text-lg font-semibold text-neutral-700 mt-3">
            {STAR_LABELS[score.stars]}
          </p>
          <p className="text-neutral-500 mt-1">{message}</p>

          {/* Improvement indicator */}
          {improvement.isNewBest && improvement.previousBest !== null && (
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14l5-5 5 5H7z" />
              </svg>
              Neuer Rekord! +{improvement.improvement}%
            </div>
          )}
        </div>

        {/* Score breakdown */}
        <div className="px-6">
          <ScoreBreakdown breakdown={score.breakdown} />
        </div>

        {/* Stats */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">
                {score.stats.correctNotes}
              </div>
              <div className="text-xs text-neutral-500">Richtig</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-error">
                {score.stats.incorrectNotes}
              </div>
              <div className="text-xs text-neutral-500">Falsch</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {score.stats.missedNotes}
              </div>
              <div className="text-xs text-neutral-500">Verpasst</div>
            </div>
          </div>
        </div>

        {/* Timing feedback */}
        {score.stats.averageTimingOffset !== 0 && (
          <div className="px-6 pb-4">
            <div className="text-center text-sm text-neutral-500">
              Durchschnittliches Timing:{' '}
              <span className="font-medium">
                {score.stats.averageTimingOffset > 0 ? '+' : ''}
                {score.stats.averageTimingOffset}ms
              </span>
              {score.stats.averageTimingOffset > 50 && ' (etwas spät)'}
              {score.stats.averageTimingOffset < -50 && ' (etwas früh)'}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-t border-neutral-100">
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={onRetry}>
              Nochmal üben
            </Button>
            {onNextExercise && score.stars >= 3 && (
              <Button variant="primary" fullWidth onClick={onNextExercise}>
                Nächste Übung
              </Button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-full mt-3 text-sm text-neutral-500 hover:text-neutral-700"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
