/**
 * Score Breakdown Component
 *
 * Displays detailed score breakdown with progress bars for each category.
 */

import React from 'react';
import type { ScoreBreakdown as ScoreBreakdownType } from '../types/scoring';
import { CATEGORY_LABELS } from '../types/scoring';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
  className?: string;
}

interface CategoryBarProps {
  label: string;
  score: number;
  weight: number;
  color: string;
}

const CategoryBar: React.FC<CategoryBarProps> = ({
  label,
  score,
  weight,
  color,
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">
            ({Math.round(weight * 100)}%)
          </span>
          <span className="text-sm font-bold" style={{ color }}>
            {score}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  breakdown,
  className = '',
}) => {
  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#22c55e'; // green
    if (score >= 70) return '#eab308'; // yellow
    if (score >= 50) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const categories = [
    {
      key: 'pitch',
      label: CATEGORY_LABELS.pitch,
      score: breakdown.pitch,
      weight: breakdown.weights.pitch,
    },
    {
      key: 'timing',
      label: CATEGORY_LABELS.timing,
      score: breakdown.timing,
      weight: breakdown.weights.timing,
    },
    {
      key: 'rhythm',
      label: CATEGORY_LABELS.rhythm,
      score: breakdown.rhythm,
      weight: breakdown.weights.rhythm,
    },
  ];

  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
        Auswertung
      </h4>

      {categories.map((cat) => (
        <CategoryBar
          key={cat.key}
          label={cat.label}
          score={cat.score}
          weight={cat.weight}
          color={getScoreColor(cat.score)}
        />
      ))}

      {/* Overall score */}
      <div className="mt-6 pt-4 border-t border-neutral-100">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-neutral-900">Gesamtergebnis</span>
          <span
            className="text-2xl font-bold"
            style={{ color: getScoreColor(breakdown.overall) }}
          >
            {breakdown.overall}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdown;
