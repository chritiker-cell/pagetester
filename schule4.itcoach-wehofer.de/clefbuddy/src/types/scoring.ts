/**
 * TypeScript types for scoring and results
 * Defines star ratings, score breakdowns, and session history
 */

import type { ComparisonSummary } from './comparison';

/**
 * Star rating (1-5 stars)
 */
export type StarRating = 1 | 2 | 3 | 4 | 5;

/**
 * Score thresholds for star ratings
 */
export interface StarThresholds {
  /** Score needed for 5 stars */
  fiveStars: number;
  /** Score needed for 4 stars */
  fourStars: number;
  /** Score needed for 3 stars */
  threeStars: number;
  /** Score needed for 2 stars */
  twoStars: number;
}

/**
 * Default star thresholds
 */
export const DEFAULT_STAR_THRESHOLDS: StarThresholds = {
  fiveStars: 95,  // ≥95% = 5 stars
  fourStars: 85,  // ≥85% = 4 stars
  threeStars: 70, // ≥70% = 3 stars
  twoStars: 50,   // ≥50% = 2 stars
  // <50% = 1 star
};

/**
 * Score category breakdown
 */
export interface ScoreBreakdown {
  /** Pitch accuracy score (0-100) */
  pitch: number;

  /** Timing accuracy score (0-100) */
  timing: number;

  /** Rhythm/duration accuracy score (0-100) */
  rhythm: number;

  /** Weighted overall score (0-100) */
  overall: number;

  /** Weight used for each category */
  weights: {
    pitch: number;
    timing: number;
    rhythm: number;
  };
}

/**
 * Complete score result for a practice session
 */
export interface PracticeScore {
  /** Unique identifier */
  id: string;

  /** Exercise ID */
  exerciseId: string;

  /** Exercise name */
  exerciseName: string;

  /** Score breakdown */
  breakdown: ScoreBreakdown;

  /** Star rating (1-5) */
  stars: StarRating;

  /** Statistics */
  stats: {
    totalNotes: number;
    correctNotes: number;
    incorrectNotes: number;
    missedNotes: number;
    extraNotes: number;
    averageTimingOffset: number;
  };

  /** Raw comparison summary */
  comparisonSummary: ComparisonSummary;

  /** Timestamp when practice was completed */
  completedAt: Date;

  /** Duration of practice in seconds */
  durationSeconds: number;

  /** Tempo used during practice */
  tempo: number;

  /** Whether metronome was enabled */
  metronomeEnabled: boolean;
}

/**
 * Historical best score for an exercise
 */
export interface ExerciseBestScore {
  exerciseId: string;
  bestScore: number;
  bestStars: StarRating;
  attemptCount: number;
  lastAttemptAt: Date;
  firstCompletedAt: Date;
}

/**
 * Score improvement indicator
 */
export interface ScoreImprovement {
  /** Whether this is a new personal best */
  isNewBest: boolean;

  /** Previous best score (null if first attempt) */
  previousBest: number | null;

  /** Score difference from previous best */
  improvement: number;

  /** Stars gained compared to previous best */
  starsGained: number;
}

/**
 * Session summary for display
 */
export interface SessionSummary {
  /** The practice score */
  score: PracticeScore;

  /** Improvement info */
  improvement: ScoreImprovement;

  /** Encouraging message based on performance */
  message: string;

  /** Suggested next action */
  suggestion: 'retry' | 'next' | 'master';
}

/**
 * Scoring state for the store
 */
export interface ScoringState {
  /** Current session score (null if no active result) */
  currentScore: PracticeScore | null;

  /** Recent practice history (last 10) */
  recentScores: PracticeScore[];

  /** Best scores by exercise ID */
  bestScores: Map<string, ExerciseBestScore>;

  /** Whether results modal is visible */
  showResults: boolean;
}

/**
 * Category rating labels
 */
export const CATEGORY_LABELS: Record<string, string> = {
  pitch: 'Tonhöhe',
  timing: 'Timing',
  rhythm: 'Rhythmus',
};

/**
 * Star rating labels
 */
export const STAR_LABELS: Record<StarRating, string> = {
  1: 'Weiter üben',
  2: 'Guter Anfang',
  3: 'Gut gemacht',
  4: 'Sehr gut',
  5: 'Perfekt!',
};

/**
 * Encouraging messages by star rating
 */
export const STAR_MESSAGES: Record<StarRating, string[]> = {
  1: [
    'Übung macht den Meister!',
    'Jeder fängt mal an.',
    'Bleib dran, du schaffst das!',
  ],
  2: [
    'Du machst Fortschritte!',
    'Weiter so!',
    'Bald hast du es drauf!',
  ],
  3: [
    'Gut gemacht!',
    'Du bist auf dem richtigen Weg!',
    'Noch ein bisschen Feinschliff!',
  ],
  4: [
    'Sehr gut!',
    'Fast perfekt!',
    'Beeindruckend!',
  ],
  5: [
    'Perfekt!',
    'Meisterhaft!',
    'Du bist ein Naturtalent!',
  ],
};
