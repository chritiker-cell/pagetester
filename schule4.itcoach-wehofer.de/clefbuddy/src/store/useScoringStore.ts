/**
 * Scoring Store
 *
 * Zustand store for managing practice scores and results.
 * Persists best scores to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ComparisonSummary } from '../types/comparison';
import type {
  ScoringState,
  ExerciseBestScore,
  SessionSummary,
} from '../types/scoring';
import {
  calculatePracticeScore,
  generateSessionSummary,
  updateBestScore,
} from '../utils/scoringEngine';

interface ScoringStore extends ScoringState {
  // Actions - Score management
  recordScore: (
    comparisonSummary: ComparisonSummary,
    exerciseId: string,
    exerciseName: string,
    tempo: number,
    metronomeEnabled: boolean,
    durationSeconds: number
  ) => SessionSummary;

  // Actions - UI
  showResultsModal: () => void;
  hideResultsModal: () => void;

  // Actions - History
  clearCurrentScore: () => void;
  clearHistory: () => void;

  // Getters
  getBestScore: (exerciseId: string) => ExerciseBestScore | null;
  getSessionSummary: () => SessionSummary | null;

  // Actions - Reset
  reset: () => void;
}

const initialState: ScoringState = {
  currentScore: null,
  recentScores: [],
  bestScores: new Map(),
  showResults: false,
};

export const useScoringStore = create<ScoringStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Record a new practice score
      recordScore: (
        comparisonSummary,
        exerciseId,
        exerciseName,
        tempo,
        metronomeEnabled,
        durationSeconds
      ) => {
        // Calculate the score
        const score = calculatePracticeScore(
          comparisonSummary,
          exerciseId,
          exerciseName,
          tempo,
          metronomeEnabled,
          durationSeconds
        );

        // Get previous best
        const previousBest = get().bestScores.get(exerciseId) || null;

        // Generate session summary
        const sessionSummary = generateSessionSummary(score, previousBest);

        // Update best score
        const updatedBest = updateBestScore(previousBest, score);
        const newBestScores = new Map(get().bestScores);
        newBestScores.set(exerciseId, updatedBest);

        // Update recent scores (keep last 10)
        const newRecentScores = [score, ...get().recentScores].slice(0, 10);

        set({
          currentScore: score,
          recentScores: newRecentScores,
          bestScores: newBestScores,
          showResults: true,
        });

        return sessionSummary;
      },

      // Show results modal
      showResultsModal: () => {
        set({ showResults: true });
      },

      // Hide results modal
      hideResultsModal: () => {
        set({ showResults: false });
      },

      // Clear current score
      clearCurrentScore: () => {
        set({ currentScore: null, showResults: false });
      },

      // Clear all history
      clearHistory: () => {
        set({
          recentScores: [],
          bestScores: new Map(),
        });
      },

      // Get best score for an exercise
      getBestScore: (exerciseId) => {
        return get().bestScores.get(exerciseId) || null;
      },

      // Get session summary for current score
      getSessionSummary: () => {
        const { currentScore, bestScores } = get();
        if (!currentScore) return null;

        const previousBest = bestScores.get(currentScore.exerciseId) || null;
        return generateSessionSummary(currentScore, previousBest);
      },

      // Reset store
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'clefbuddy-scores',
      // Custom serialization for Map
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          const data = JSON.parse(str);

          // Convert bestScores array back to Map
          if (data.state?.bestScores) {
            data.state.bestScores = new Map(data.state.bestScores);
          }

          // Convert date strings back to Date objects
          if (data.state?.recentScores) {
            data.state.recentScores = data.state.recentScores.map(
              (score: any) => ({
                ...score,
                completedAt: new Date(score.completedAt),
              })
            );
          }

          if (data.state?.currentScore?.completedAt) {
            data.state.currentScore.completedAt = new Date(
              data.state.currentScore.completedAt
            );
          }

          return data;
        },
        setItem: (name, value) => {
          const data = JSON.parse(JSON.stringify(value));

          // Convert Map to array for JSON serialization
          if (value.state?.bestScores instanceof Map) {
            data.state.bestScores = Array.from(value.state.bestScores.entries());
          }

          localStorage.setItem(name, JSON.stringify(data));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        recentScores: state.recentScores,
        bestScores: state.bestScores,
      }) as unknown as ScoringStore,
    }
  )
);
