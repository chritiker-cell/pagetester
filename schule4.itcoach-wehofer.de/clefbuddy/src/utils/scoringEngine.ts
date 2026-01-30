/**
 * Scoring Engine
 *
 * Calculates scores, star ratings, and generates result summaries
 * from comparison data.
 */

import type { ComparisonSummary } from '../types/comparison';
import type {
  PracticeScore,
  ScoreBreakdown,
  StarRating,
  StarThresholds,
  ExerciseBestScore,
  ScoreImprovement,
  SessionSummary,
} from '../types/scoring';
import {
  DEFAULT_STAR_THRESHOLDS,
  STAR_MESSAGES,
} from '../types/scoring';

/**
 * Calculate star rating from score
 */
export function calculateStarRating(
  score: number,
  thresholds: StarThresholds = DEFAULT_STAR_THRESHOLDS
): StarRating {
  if (score >= thresholds.fiveStars) return 5;
  if (score >= thresholds.fourStars) return 4;
  if (score >= thresholds.threeStars) return 3;
  if (score >= thresholds.twoStars) return 2;
  return 1;
}

/**
 * Calculate score breakdown from comparison summary
 */
export function calculateScoreBreakdown(
  summary: ComparisonSummary,
  weights = { pitch: 0.5, timing: 0.3, rhythm: 0.2 }
): ScoreBreakdown {
  const pitch = Math.round(summary.pitchAccuracy);
  const timing = Math.round(summary.timingAccuracy);
  const rhythm = Math.round(summary.rhythmAccuracy);

  const overall = Math.round(
    pitch * weights.pitch + timing * weights.timing + rhythm * weights.rhythm
  );

  return {
    pitch,
    timing,
    rhythm,
    overall,
    weights,
  };
}

/**
 * Generate a unique score ID
 */
function generateScoreId(): string {
  return `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate complete practice score from comparison summary
 */
export function calculatePracticeScore(
  comparisonSummary: ComparisonSummary,
  exerciseId: string,
  exerciseName: string,
  tempo: number,
  metronomeEnabled: boolean,
  durationSeconds: number
): PracticeScore {
  const breakdown = calculateScoreBreakdown(comparisonSummary);
  const stars = calculateStarRating(breakdown.overall);

  return {
    id: generateScoreId(),
    exerciseId,
    exerciseName,
    breakdown,
    stars,
    stats: {
      totalNotes: comparisonSummary.totalExpectedNotes,
      correctNotes: comparisonSummary.correctNotes,
      incorrectNotes: comparisonSummary.incorrectNotes,
      missedNotes: comparisonSummary.missedNotes,
      extraNotes: comparisonSummary.extraNotes,
      averageTimingOffset: Math.round(comparisonSummary.averageTimingOffset),
    },
    comparisonSummary,
    completedAt: new Date(),
    durationSeconds,
    tempo,
    metronomeEnabled,
  };
}

/**
 * Calculate improvement from previous best
 */
export function calculateImprovement(
  currentScore: PracticeScore,
  previousBest: ExerciseBestScore | null
): ScoreImprovement {
  if (!previousBest) {
    return {
      isNewBest: true,
      previousBest: null,
      improvement: 0,
      starsGained: 0,
    };
  }

  const isNewBest = currentScore.breakdown.overall > previousBest.bestScore;
  const improvement = currentScore.breakdown.overall - previousBest.bestScore;
  const starsGained = currentScore.stars - previousBest.bestStars;

  return {
    isNewBest,
    previousBest: previousBest.bestScore,
    improvement,
    starsGained,
  };
}

/**
 * Get random encouraging message for star rating
 */
export function getEncouragingMessage(stars: StarRating): string {
  const messages = STAR_MESSAGES[stars];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get suggestion based on score
 */
export function getSuggestion(
  score: PracticeScore,
  improvement: ScoreImprovement
): 'retry' | 'next' | 'master' {
  // Perfect score - suggest moving on
  if (score.stars === 5) {
    return 'next';
  }

  // Good improvement - suggest next exercise
  if (improvement.isNewBest && score.stars >= 4) {
    return 'next';
  }

  // Getting worse or stuck - suggest retry
  if (improvement.improvement < 0 || score.stars < 3) {
    return 'retry';
  }

  // Mastered if consistent 4+ stars
  if (score.stars >= 4) {
    return 'master';
  }

  return 'retry';
}

/**
 * Generate complete session summary
 */
export function generateSessionSummary(
  score: PracticeScore,
  previousBest: ExerciseBestScore | null
): SessionSummary {
  const improvement = calculateImprovement(score, previousBest);
  const message = getEncouragingMessage(score.stars);
  const suggestion = getSuggestion(score, improvement);

  return {
    score,
    improvement,
    message,
    suggestion,
  };
}

/**
 * Update best score record
 */
export function updateBestScore(
  currentBest: ExerciseBestScore | null,
  newScore: PracticeScore
): ExerciseBestScore {
  if (!currentBest) {
    return {
      exerciseId: newScore.exerciseId,
      bestScore: newScore.breakdown.overall,
      bestStars: newScore.stars,
      attemptCount: 1,
      lastAttemptAt: newScore.completedAt,
      firstCompletedAt: newScore.completedAt,
    };
  }

  const isNewBest = newScore.breakdown.overall > currentBest.bestScore;

  return {
    ...currentBest,
    bestScore: isNewBest ? newScore.breakdown.overall : currentBest.bestScore,
    bestStars: isNewBest ? newScore.stars : currentBest.bestStars,
    attemptCount: currentBest.attemptCount + 1,
    lastAttemptAt: newScore.completedAt,
  };
}

/**
 * Get performance level description
 */
export function getPerformanceLevel(score: number): string {
  if (score >= 95) return 'Meisterhaft';
  if (score >= 85) return 'Ausgezeichnet';
  if (score >= 70) return 'Gut';
  if (score >= 50) return 'Befriedigend';
  return 'Übung nötig';
}

/**
 * Get timing feedback based on average offset
 */
export function getTimingFeedback(averageOffsetMs: number): string {
  const absOffset = Math.abs(averageOffsetMs);

  if (absOffset <= 30) return 'Perfektes Timing!';
  if (absOffset <= 60) return 'Sehr gutes Timing';
  if (absOffset <= 100) return 'Gutes Timing';

  if (averageOffsetMs < 0) {
    return 'Tendenz: etwas zu früh';
  }
  return 'Tendenz: etwas zu spät';
}

/**
 * Calculate streak (consecutive correct notes)
 */
export function calculateStreak(comparisonSummary: ComparisonSummary): {
  maxStreak: number;
  currentStreak: number;
} {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const comparison of comparisonSummary.comparisons) {
    if (comparison.result === 'correct') {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return { maxStreak, currentStreak };
}

/**
 * Format score for display
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
}
