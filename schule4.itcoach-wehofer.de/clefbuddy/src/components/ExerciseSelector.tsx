/**
 * ExerciseSelector Component
 *
 * Sidebar component for selecting exercises.
 * Contains level dropdown and scrollable exercise list.
 */

import React from 'react';
import { useExerciseStore } from '../store/useExerciseStore';
import Select from './ui/Select';
import Card from './ui/Card';
import Badge from './ui/Badge';
import type { BadgeVariant } from './ui/Badge';

const ExerciseSelector: React.FC = () => {
  const {
    levels,
    selectedLevel,
    filteredExercises,
    selectedExerciseId,
    setLevel,
    setExercise,
  } = useExerciseStore();

  // Map difficulty to badge variant
  const getDifficultyBadge = (difficulty: string): { variant: BadgeVariant; label: string } => {
    switch (difficulty) {
      case 'beginner':
        return { variant: 'success', label: 'Anfänger' };
      case 'easy':
        return { variant: 'primary', label: 'Leicht' };
      case 'intermediate':
        return { variant: 'warning', label: 'Mittel' };
      default:
        return { variant: 'default', label: difficulty };
    }
  };

  // Create level options for select
  const levelOptions = levels.map((level) => ({
    value: String(level.id),
    label: `Level ${level.id}: ${level.name}`,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      {/* Level Selector */}
      <div className="mb-4">
        <Select
          label="Schwierigkeitsstufe"
          options={levelOptions}
          value={String(selectedLevel)}
          onChange={(value) => setLevel(Number(value))}
          fullWidth
        />
      </div>

      {/* Level Description */}
      {levels.find((l) => l.id === selectedLevel) && (
        <div className="mb-4 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600">
          {levels.find((l) => l.id === selectedLevel)?.description}
        </div>
      )}

      {/* Exercise List Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-900">Übungen</h3>
        <span className="text-sm text-neutral-500">
          {filteredExercises.length} verfügbar
        </span>
      </div>

      {/* Scrollable Exercise List */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {filteredExercises.map((exercise) => {
          const isSelected = exercise.id === selectedExerciseId;
          const badge = getDifficultyBadge(exercise.difficulty);

          return (
            <Card
              key={exercise.id}
              variant="outlined"
              padding="sm"
              onClick={() => setExercise(exercise.id)}
              className={`
                cursor-pointer transition-all
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'hover:border-neutral-300 hover:bg-neutral-50'
                }
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-neutral-900 truncate">
                    {exercise.name}
                  </div>
                  <div className="text-sm text-neutral-500 line-clamp-2 mt-0.5">
                    {exercise.description}
                  </div>
                </div>
                <Badge variant={badge.variant} size="sm">
                  {badge.label}
                </Badge>
              </div>

              {/* Exercise metadata */}
              <div className="flex gap-3 mt-2 text-xs text-neutral-400">
                <span>{exercise.timeSignature}</span>
                <span>{exercise.keySignature}-Dur</span>
                <span>{exercise.bars.length} Takte</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExerciseSelector;
