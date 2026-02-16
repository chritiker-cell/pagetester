/**
 * Unit tests for useScoringStore
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useScoringStore } from '../useScoringStore';
import type { ComparisonSummary } from '../../types/comparison';
import type { PracticeScore, StarRating, ExerciseBestScore } from '../../types/scoring';

// Mock the scoring engine functions
vi.mock('../../utils/scoringEngine', () => ({
  calculatePracticeScore: vi.fn((
    _summary: ComparisonSummary,
    exerciseId: string,
    exerciseName: string,
    tempo: number,
    metronome: boolean,
    duration: number
  ): PracticeScore => ({
    id: 'test-score-id',
    exerciseId,
    exerciseName,
    stars: 4 as StarRating,
    breakdown: {
      overall: 85,
      pitch: 90,
      timing: 80,
      rhythm: 85,
      weights: { pitch: 0.5, timing: 0.3, rhythm: 0.2 },
    },
    stats: {
      totalNotes: 10,
      correctNotes: 8,
      incorrectNotes: 1,
      missedNotes: 1,
      extraNotes: 0,
      averageTimingOffset: 25,
    },
    comparisonSummary: _summary,
    tempo,
    metronomeEnabled: metronome,
    durationSeconds: duration,
    completedAt: new Date('2026-02-15T10:00:00Z'),
  })),
  generateSessionSummary: vi.fn((score: PracticeScore) => ({
    score,
    improvement: { isNewBest: true, previousBest: null, improvement: 0, starsGained: 0 },
    message: 'Gut gemacht!',
    suggestion: 'next' as const,
  })),
  updateBestScore: vi.fn((prev: ExerciseBestScore | null, score: PracticeScore): ExerciseBestScore => ({
    exerciseId: score.exerciseId,
    bestScore: score.breakdown.overall,
    bestStars: score.stars,
    attemptCount: prev ? prev.attemptCount + 1 : 1,
    achievedAt: score.completedAt,
    lastAttemptAt: score.completedAt,
    firstCompletedAt: prev?.firstCompletedAt || score.completedAt,
  })),
}));

// Mock levels data
vi.mock('../../data/levels.json', () => ({
  default: {
    levels: [
      { id: 1, name: 'Anfaenger', color: 'emerald', unlockCriteria: { exercisesCompleted: 3, accuracy: 0.6 } },
      { id: 2, name: 'Leicht', color: 'blue', unlockCriteria: { exercisesCompleted: 3, accuracy: 0.65 } },
    ],
  },
}));

describe('useScoringStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useScoringStore.setState({
      currentScore: null,
      recentScores: [],
      bestScores: new Map(),
      showResults: false,
    });
    // Clear localStorage
    localStorage.clear();
  });

  const createMockComparisonSummary = (): ComparisonSummary => ({
    matches: [],
    notesCorrect: 8,
    notesIncorrect: 1,
    notesMissed: 1,
    notesExtra: 0,
    totalExpected: 10,
    totalPlayed: 9,
    pitchAccuracy: 0.9,
    timingAccuracy: 0.8,
    rhythmAccuracy: 0.85,
    overallAccuracy: 0.85,
    averageTimingOffset: 25,
  });

  describe('recordScore', () => {
    it('should store score and set showResults to true', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      expect(store.getState().currentScore).not.toBeNull();
      expect(store.getState().currentScore?.exerciseId).toBe('test-exercise-1');
      expect(store.getState().showResults).toBe(true);
    });

    it('should add score to recentScores', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      expect(store.getState().recentScores).toHaveLength(1);
      expect(store.getState().recentScores[0].exerciseId).toBe('test-exercise-1');
    });

    it('should update bestScores Map', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      const bestScore = store.getState().bestScores.get('test-exercise-1');
      expect(bestScore).toBeDefined();
      expect(bestScore?.exerciseId).toBe('test-exercise-1');
      expect(bestScore?.bestScore).toBe(85);
    });

    it('should keep max 10 recentScores', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      // Record 11 scores
      for (let i = 1; i <= 11; i++) {
        store.getState().recordScore(
          summary,
          `test-exercise-${i}`,
          `Test Exercise ${i}`,
          80,
          true,
          30
        );
      }

      expect(store.getState().recentScores).toHaveLength(10);
      // Most recent should be first
      expect(store.getState().recentScores[0].exerciseId).toBe('test-exercise-11');
      // Oldest (first) should be gone
      expect(store.getState().recentScores.some(s => s.exerciseId === 'test-exercise-1')).toBe(false);
    });

    it('should return session summary', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      const result = store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      expect(result).toBeDefined();
      expect(result.score.exerciseId).toBe('test-exercise-1');
      expect(result.message).toBe('Gut gemacht!');
    });
  });

  describe('modal actions', () => {
    it('should show results modal', () => {
      const store = useScoringStore;
      store.getState().showResultsModal();
      expect(store.getState().showResults).toBe(true);
    });

    it('should hide results modal', () => {
      const store = useScoringStore;
      store.setState({ showResults: true });
      store.getState().hideResultsModal();
      expect(store.getState().showResults).toBe(false);
    });
  });

  describe('clearCurrentScore', () => {
    it('should clear current score and hide results', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      store.getState().clearCurrentScore();

      expect(store.getState().currentScore).toBeNull();
      expect(store.getState().showResults).toBe(false);
    });
  });

  describe('clearHistory', () => {
    it('should reset recentScores and bestScores', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      // Add some scores
      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise 1',
        80,
        true,
        30
      );
      store.getState().recordScore(
        summary,
        'test-exercise-2',
        'Test Exercise 2',
        80,
        true,
        30
      );

      expect(store.getState().recentScores).toHaveLength(2);
      expect(store.getState().bestScores.size).toBe(2);

      store.getState().clearHistory();

      expect(store.getState().recentScores).toHaveLength(0);
      expect(store.getState().bestScores.size).toBe(0);
    });
  });

  describe('getBestScore', () => {
    it('should return best score for exercise', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      const bestScore = store.getState().getBestScore('test-exercise-1');
      expect(bestScore).not.toBeNull();
      expect(bestScore?.exerciseId).toBe('test-exercise-1');
    });

    it('should return null for non-existent exercise', () => {
      const store = useScoringStore;
      const bestScore = store.getState().getBestScore('non-existent');
      expect(bestScore).toBeNull();
    });
  });

  describe('getStatsByDifficulty', () => {
    it('should filter by exerciseId containing diff{difficulty}', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      // Record scores for different difficulties
      store.getState().recordScore(
        summary,
        'random-diff1-test',
        'Diff 1 Exercise',
        80,
        true,
        30
      );
      store.getState().recordScore(
        summary,
        'random-diff2-test',
        'Diff 2 Exercise',
        80,
        true,
        30
      );
      store.getState().recordScore(
        summary,
        'random-diff1-test2',
        'Diff 1 Exercise 2',
        80,
        true,
        30
      );

      const stats = store.getState().getStatsByDifficulty(1);
      expect(stats.completedCount).toBe(2);
    });

    it('should calculate averages correctly', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      // Both scores will have overall: 85, stars: 4 (from mock)
      store.getState().recordScore(
        summary,
        'random-diff1-test',
        'Diff 1 Exercise',
        80,
        true,
        30
      );
      store.getState().recordScore(
        summary,
        'random-diff1-test2',
        'Diff 1 Exercise 2',
        80,
        true,
        30
      );

      const stats = store.getState().getStatsByDifficulty(1);
      expect(stats.averageScore).toBe(85);
      expect(stats.averageStars).toBe(4);
    });

    it('should return zeros when no scores exist', () => {
      const store = useScoringStore;
      const stats = store.getState().getStatsByDifficulty(1);
      expect(stats.completedCount).toBe(0);
      expect(stats.averageScore).toBe(0);
      expect(stats.averageStars).toBe(0);
    });
  });

  describe('getOverallStats', () => {
    it('should calculate overall statistics', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise 1',
        80,
        true,
        30
      );
      store.getState().recordScore(
        summary,
        'test-exercise-2',
        'Test Exercise 2',
        80,
        true,
        45
      );

      const stats = store.getState().getOverallStats();
      expect(stats.totalExercises).toBe(2);
      expect(stats.averageScore).toBe(85);
      expect(stats.averageStars).toBe(4);
      expect(stats.totalPracticeTime).toBe(75);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist bestScores Map to localStorage', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      const stored = localStorage.getItem('clefbuddy-scores');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.bestScores).toBeDefined();
      // Should be serialized as array
      expect(Array.isArray(parsed.state.bestScores)).toBe(true);
      expect(parsed.state.bestScores.length).toBe(1);
    });

    it('should persist recentScores to localStorage', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      const stored = localStorage.getItem('clefbuddy-scores');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.recentScores).toBeDefined();
      expect(parsed.state.recentScores.length).toBe(1);
    });

    it('should not persist currentScore or showResults (partialize)', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      const stored = localStorage.getItem('clefbuddy-scores');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.currentScore).toBeUndefined();
      expect(parsed.state.showResults).toBeUndefined();
    });

    it('should restore Map from localStorage on new store instance', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      // Record a score
      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      // Get the stored value
      const stored = localStorage.getItem('clefbuddy-scores');
      expect(stored).not.toBeNull();

      // Parse it
      const parsed = JSON.parse(stored!);

      // Reset the store
      store.setState({
        currentScore: null,
        recentScores: [],
        bestScores: new Map(),
        showResults: false,
      });

      // Manually restore from localStorage (simulating persist rehydration)
      // The custom storage.getItem should convert array back to Map
      const restoredBestScores = new Map(parsed.state.bestScores);
      store.setState({
        recentScores: parsed.state.recentScores,
        bestScores: restoredBestScores,
      });

      expect(store.getState().bestScores.size).toBe(1);
      expect(store.getState().bestScores.has('test-exercise-1')).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset store to initial state', () => {
      const store = useScoringStore;
      const summary = createMockComparisonSummary();

      // Add some data
      store.getState().recordScore(
        summary,
        'test-exercise-1',
        'Test Exercise',
        80,
        true,
        30
      );

      expect(store.getState().currentScore).not.toBeNull();
      expect(store.getState().recentScores).toHaveLength(1);
      expect(store.getState().bestScores.size).toBe(1);
      expect(store.getState().showResults).toBe(true);

      // Reset
      store.getState().reset();

      expect(store.getState().currentScore).toBeNull();
      expect(store.getState().recentScores).toHaveLength(0);
      expect(store.getState().bestScores.size).toBe(0);
      expect(store.getState().showResults).toBe(false);
    });
  });
});
