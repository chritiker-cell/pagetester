/**
 * Exercise Store
 *
 * Zustand store for managing exercise selection state.
 * Handles level filtering and exercise selection.
 */

import { create } from 'zustand';
import type { Exercise, Level } from '../types/music';
import exercisesData from '../data/exercises.json';
import levelsData from '../data/levels.json';

interface ExerciseState {
  // Data
  exercises: Exercise[];
  levels: Level[];

  // Selection state
  selectedLevel: number;
  selectedExerciseId: string | null;

  // Computed
  filteredExercises: Exercise[];

  // Actions
  setLevel: (level: number) => void;
  setExercise: (exerciseId: string) => void;
  getExerciseById: (id: string) => Exercise | undefined;
  getSelectedExercise: () => Exercise | undefined;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  // Initialize data from JSON files
  exercises: exercisesData.exercises as Exercise[],
  levels: levelsData.levels as Level[],

  // Default to level 1
  selectedLevel: 1,
  selectedExerciseId: null,

  // Filter exercises by selected level
  filteredExercises: (exercisesData.exercises as Exercise[]).filter(
    (ex) => ex.level === 1
  ),

  // Set level and update filtered exercises
  setLevel: (level: number) => {
    const exercises = get().exercises;
    const filteredExercises = exercises.filter((ex) => ex.level === level);

    set({
      selectedLevel: level,
      filteredExercises,
      // Reset selection when changing levels, select first exercise of new level
      selectedExerciseId: filteredExercises.length > 0 ? filteredExercises[0].id : null,
    });
  },

  // Set selected exercise
  setExercise: (exerciseId: string) => {
    set({ selectedExerciseId: exerciseId });
  },

  // Get exercise by ID
  getExerciseById: (id: string) => {
    return get().exercises.find((ex) => ex.id === id);
  },

  // Get currently selected exercise
  getSelectedExercise: () => {
    const { selectedExerciseId, exercises } = get();
    if (!selectedExerciseId) return undefined;
    return exercises.find((ex) => ex.id === selectedExerciseId);
  },
}));
