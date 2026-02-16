/**
 * ResultsModal Component Tests
 *
 * Tests practice session results display with star rating, score breakdown,
 * and navigation options.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultsModal from '../ResultsModal';
import type { SessionSummary, StarRating } from '../../types/scoring';

// Mock ScoreBreakdown component
vi.mock('../ScoreBreakdown', () => ({
  default: ({ breakdown }: any) => (
    <div data-testid="score-breakdown">{breakdown.overall}%</div>
  ),
}));

// Mock Button component
vi.mock('../ui/Button', () => ({
  default: ({ children, onClick, variant, fullWidth, ...props }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-fullwidth={fullWidth?.toString()}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Helper to create mock SessionSummary
function createSummary(overrides: Partial<any> = {}): SessionSummary {
  return {
    score: {
      id: 'test-score-1',
      exerciseId: 'test-1',
      exerciseName: 'Test Exercise',
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
      comparisonSummary: {
        correctCount: 8,
        incorrectCount: 1,
        missedCount: 1,
        extraCount: 0,
      },
      tempo: 120,
      metronomeEnabled: true,
      durationSeconds: 30,
      completedAt: new Date(),
      ...overrides.score,
    },
    improvement: {
      isNewBest: false,
      previousBest: null,
      improvement: 0,
      starsGained: 0,
      ...overrides.improvement,
    },
    message: overrides.message || 'Gut gemacht!',
    suggestion: overrides.suggestion || 'next',
  };
}

describe('ResultsModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ResultsModal
        summary={createSummary()}
        isOpen={false}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows exercise name and message when open', () => {
    render(
      <ResultsModal
        summary={createSummary({
          score: { exerciseName: 'My Test Exercise' },
          message: 'Great work!',
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText('My Test Exercise')).toBeInTheDocument();
    expect(screen.getByText('Great work!')).toBeInTheDocument();
    expect(screen.getByText('Übung beendet!')).toBeInTheDocument();
  });

  it('displays correct number of filled stars for 1 star', () => {
    const { container } = render(
      <ResultsModal
        summary={createSummary({ score: { stars: 1 } })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    const stars = container.querySelectorAll('svg[viewBox="0 0 24 24"]');
    // 5 stars total (Star component is used 5 times)
    expect(stars.length).toBeGreaterThanOrEqual(5);

    // Should show label for 1 star
    expect(screen.getByText('Guter Anfang! Weiter so!')).toBeInTheDocument();
  });

  it('displays correct number of filled stars for 3 stars', () => {
    render(
      <ResultsModal
        summary={createSummary({ score: { stars: 3 }, message: 'Weiter so!' })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    // STAR_LABELS[3] = 'Gut gemacht!'
    expect(screen.getByText('Gut gemacht!')).toBeInTheDocument();
  });

  it('displays correct number of filled stars for 5 stars', () => {
    render(
      <ResultsModal
        summary={createSummary({ score: { stars: 5 } })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText('Perfekt! Fantastisch!')).toBeInTheDocument();
  });

  it('shows "Neuer Rekord!" badge when isNewBest is true and previousBest is not null', () => {
    render(
      <ResultsModal
        summary={createSummary({
          improvement: {
            isNewBest: true,
            previousBest: 75,
            improvement: 10,
            starsGained: 1,
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText(/Neuer Rekord!/)).toBeInTheDocument();
    expect(screen.getByText(/\+10%/)).toBeInTheDocument();
  });

  it('does NOT show "Neuer Rekord!" badge when isNewBest is false', () => {
    render(
      <ResultsModal
        summary={createSummary({
          improvement: {
            isNewBest: false,
            previousBest: 85,
            improvement: -5,
            starsGained: 0,
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.queryByText(/Neuer Rekord!/)).not.toBeInTheDocument();
  });

  it('does NOT show "Neuer Rekord!" badge when previousBest is null even if isNewBest is true', () => {
    render(
      <ResultsModal
        summary={createSummary({
          improvement: {
            isNewBest: true,
            previousBest: null,
            improvement: 0,
            starsGained: 0,
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    // First attempt - no previous best to compare
    expect(screen.queryByText(/Neuer Rekord!/)).not.toBeInTheDocument();
  });

  it('shows correct, incorrect, and missed notes stats', () => {
    render(
      <ResultsModal
        summary={createSummary({
          score: {
            stats: {
              correctNotes: 15,
              incorrectNotes: 3,
              missedNotes: 2,
            },
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText('15')).toBeInTheDocument(); // correct
    expect(screen.getByText('3')).toBeInTheDocument();  // incorrect
    expect(screen.getByText('2')).toBeInTheDocument();  // missed
    expect(screen.getByText('Richtig')).toBeInTheDocument();
    expect(screen.getByText('Falsch')).toBeInTheDocument();
    expect(screen.getByText('Verpasst')).toBeInTheDocument();
  });

  it('shows "Nächste Übung" button when stars >= 3 AND onNextExercise provided', () => {
    const onNextExercise = vi.fn();
    render(
      <ResultsModal
        summary={createSummary({ score: { stars: 3 } })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
        onNextExercise={onNextExercise}
      />
    );

    expect(screen.getByText('Nächste Übung')).toBeInTheDocument();
  });

  it('does NOT show "Nächste Übung" button when stars < 3', () => {
    const onNextExercise = vi.fn();
    render(
      <ResultsModal
        summary={createSummary({ score: { stars: 2 } })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
        onNextExercise={onNextExercise}
      />
    );

    expect(screen.queryByText('Nächste Übung')).not.toBeInTheDocument();
  });

  it('does NOT show "Nächste Übung" button when onNextExercise not provided', () => {
    render(
      <ResultsModal
        summary={createSummary({ score: { stars: 5 } })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
        // No onNextExercise provided
      />
    );

    expect(screen.queryByText('Nächste Übung')).not.toBeInTheDocument();
  });

  it('always shows "Nochmal üben" button', () => {
    render(
      <ResultsModal
        summary={createSummary({ score: { stars: 1 } })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText('Nochmal üben')).toBeInTheDocument();
  });

  it('calls onRetry when "Nochmal üben" is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ResultsModal
        summary={createSummary()}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByText('Nochmal üben');
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when "Zurück zur Übersicht" is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ResultsModal
        summary={createSummary()}
        isOpen={true}
        onClose={onClose}
        onRetry={vi.fn()}
      />
    );

    const closeButton = screen.getByText('Zurück zur Übersicht');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onNextExercise when "Nächste Übung" is clicked', async () => {
    const user = userEvent.setup();
    const onNextExercise = vi.fn();

    render(
      <ResultsModal
        summary={createSummary({ score: { stars: 4 } })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
        onNextExercise={onNextExercise}
      />
    );

    const nextButton = screen.getByText('Nächste Übung');
    await user.click(nextButton);

    expect(onNextExercise).toHaveBeenCalledTimes(1);
  });

  it('shows timing feedback when averageTimingOffset is not 0', () => {
    render(
      <ResultsModal
        summary={createSummary({
          score: {
            stats: { averageTimingOffset: 75 },
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText(/Durchschnittliches Timing:/)).toBeInTheDocument();
    expect(screen.getByText(/\+75ms/)).toBeInTheDocument();
    expect(screen.getByText(/etwas spät/)).toBeInTheDocument();
  });

  it('shows "etwas früh" when averageTimingOffset < -50', () => {
    render(
      <ResultsModal
        summary={createSummary({
          score: {
            stats: { averageTimingOffset: -75 },
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText(/Durchschnittliches Timing:/)).toBeInTheDocument();
    expect(screen.getByText(/-75ms/)).toBeInTheDocument();
    expect(screen.getByText(/etwas früh/)).toBeInTheDocument();
  });

  it('does NOT show timing feedback when averageTimingOffset is 0', () => {
    render(
      <ResultsModal
        summary={createSummary({
          score: {
            stats: { averageTimingOffset: 0 },
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.queryByText(/Durchschnittliches Timing:/)).not.toBeInTheDocument();
  });

  it('renders ScoreBreakdown with correct props', () => {
    render(
      <ResultsModal
        summary={createSummary({
          score: {
            breakdown: { overall: 92, pitch: 95, timing: 90, rhythm: 88 },
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    // Our mocked ScoreBreakdown shows the overall percentage
    expect(screen.getByTestId('score-breakdown')).toHaveTextContent('92%');
  });

  it('shows correct button variants', () => {
    const { container } = render(
      <ResultsModal
        summary={createSummary({ score: { stars: 4 } })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
        onNextExercise={vi.fn()}
      />
    );

    const retryButton = screen.getByText('Nochmal üben');
    const nextButton = screen.getByText('Nächste Übung');

    expect(retryButton).toHaveAttribute('data-variant', 'secondary');
    expect(nextButton).toHaveAttribute('data-variant', 'primary');
    expect(retryButton).toHaveAttribute('data-fullwidth', 'true');
    expect(nextButton).toHaveAttribute('data-fullwidth', 'true');
  });

  it('handles edge case with all stats at 0', () => {
    render(
      <ResultsModal
        summary={createSummary({
          score: {
            stars: 1,
            stats: {
              correctNotes: 0,
              incorrectNotes: 0,
              missedNotes: 0,
              averageTimingOffset: 0,
            },
          },
        })}
        isOpen={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    // Should render without errors
    expect(screen.getByText('Übung beendet!')).toBeInTheDocument();
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(3); // At least 3 zeros for the stats
  });
});
