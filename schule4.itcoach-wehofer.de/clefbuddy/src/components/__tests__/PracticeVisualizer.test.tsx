/**
 * PracticeVisualizer Component Tests
 *
 * Tests real-time visual feedback during practice mode.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PracticeVisualizer from '../PracticeVisualizer';
import type { PracticeModeState } from '../../utils/practiceMode';
import type { NoteComparison } from '../../types/comparison';

// Mock note comparisons for testing
const correctComparison: NoteComparison = {
  id: 'comp-1',
  result: 'correct',
  pitchCorrect: true,
  pitchDifference: 0,
  timingAccuracy: 'perfect',
  timingOffsetMs: 20,
  durationRatio: 1.0,
  expectedNoteIndex: 0,
  expectedNote: {
    id: 'note-1',
    note: {
      keys: ['c/4'],
      duration: 'q',
      clef: 'treble',
    },
    barNumber: 1,
    noteIndex: 0,
    startTime: 0,
    durationSeconds: 0.5,
    midiPitches: [60],
    toneNotes: ['C4'],
    voice: 'treble',
  },
  playedNote: {
    id: 'played-1',
    midiNote: 60,
    noteName: 'C4',
    vexflowKey: 'c/4',
    velocity: 100,
    startTime: 0.02,
    endTime: 0.52,
    duration: 0.5,
  },
};

const incorrectComparison: NoteComparison = {
  id: 'comp-2',
  result: 'incorrect',
  pitchCorrect: false,
  pitchDifference: 2,
  timingAccuracy: 'late',
  timingOffsetMs: 100,
  durationRatio: 1.0,
  expectedNoteIndex: 0,
  expectedNote: {
    id: 'note-1',
    note: {
      keys: ['c/4'],
      duration: 'q',
      clef: 'treble',
    },
    barNumber: 1,
    noteIndex: 0,
    startTime: 0,
    durationSeconds: 0.5,
    midiPitches: [60],
    toneNotes: ['C4'],
    voice: 'treble',
  },
  playedNote: {
    id: 'played-2',
    midiNote: 62,
    noteName: 'D4',
    vexflowKey: 'd/4',
    velocity: 100,
    startTime: 0.1,
    endTime: 0.6,
    duration: 0.5,
  },
};

describe('PracticeVisualizer', () => {
  it('shows initial countdown state with progress bar at 0%', () => {
    render(
      <PracticeVisualizer
        practiceState="countdown"
        correctCount={0}
        incorrectCount={0}
        totalNotes={10}
        currentNoteIndex={0}
      />
    );

    // Should show 0/totalNotes
    expect(screen.getByText('0/10')).toBeInTheDocument();

    // Progress bar should be at 0%
    const progressBar = screen.getByText('0/10').nextElementSibling?.querySelector('div[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '0%' });

    // Correct and incorrect counts should be 0
    const allZeros = screen.getAllByText('0');
    expect(allZeros.length).toBeGreaterThanOrEqual(2); // At least 2 zeros (correct + incorrect)

    // Accuracy should be 0%
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('shows idle state with "Bereit zum Üben" message', () => {
    render(
      <PracticeVisualizer
        practiceState="idle"
        correctCount={0}
        incorrectCount={0}
        totalNotes={10}
        currentNoteIndex={0}
      />
    );

    expect(screen.getByText('Bereit zum Üben')).toBeInTheDocument();
    expect(screen.getByText('Drücke Start um zu beginnen')).toBeInTheDocument();
  });

  it('shows correct progress calculation in playing state', () => {
    render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={3}
        incorrectCount={2}
        totalNotes={10}
        currentNoteIndex={4}
      />
    );

    // Should show current progress
    expect(screen.getByText('5/10')).toBeInTheDocument();

    // Progress bar should be at 50% (5/10)
    const progressBar = screen.getByText('5/10').nextElementSibling?.querySelector('div[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '50%' });

    // Should show correct and incorrect counts
    expect(screen.getByText('3')).toBeInTheDocument(); // correct
    expect(screen.getByText('2')).toBeInTheDocument(); // incorrect
  });

  it('shows green accuracy color when >= 80%', () => {
    render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={9}
        incorrectCount={1}
        totalNotes={10}
        currentNoteIndex={9}
      />
    );

    // 9/(9+1) = 90%
    const accuracyElement = screen.getByText('90%');
    expect(accuracyElement).toBeInTheDocument();
    expect(accuracyElement).toHaveClass('text-success');
  });

  it('shows yellow accuracy color when 60-79%', () => {
    render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={7}
        incorrectCount={3}
        totalNotes={10}
        currentNoteIndex={9}
      />
    );

    // 7/(7+3) = 70%
    const accuracyElement = screen.getByText('70%');
    expect(accuracyElement).toBeInTheDocument();
    expect(accuracyElement).toHaveClass('text-warning');
  });

  it('shows red accuracy color when < 60%', () => {
    render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={3}
        incorrectCount={7}
        totalNotes={10}
        currentNoteIndex={9}
      />
    );

    // 3/(3+7) = 30%
    const accuracyElement = screen.getByText('30%');
    expect(accuracyElement).toBeInTheDocument();
    expect(accuracyElement).toHaveClass('text-error');
  });

  it('shows correct icon for last comparison when correct', () => {
    const { container } = render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={5}
        incorrectCount={0}
        totalNotes={10}
        currentNoteIndex={4}
        lastComparison={correctComparison}
      />
    );

    // Check for the check icon (SVG with specific path)
    const checkIcon = container.querySelector('svg path[d*="L4.83 12"]');
    expect(checkIcon).toBeInTheDocument();
  });

  it('shows incorrect icon for last comparison when incorrect', () => {
    const { container } = render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={3}
        incorrectCount={2}
        totalNotes={10}
        currentNoteIndex={4}
        lastComparison={incorrectComparison}
      />
    );

    // Check for the X icon (SVG with specific path)
    const xIcon = container.querySelector('svg path[d*="L17.59 5"]');
    expect(xIcon).toBeInTheDocument();
  });

  it('does not show last feedback icon when lastComparison is null', () => {
    const { container } = render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={5}
        incorrectCount={0}
        totalNotes={10}
        currentNoteIndex={4}
        lastComparison={null}
      />
    );

    // No feedback icon should be present
    const checkIcon = container.querySelector('svg path[d*="L4.83 12"]');
    const xIcon = container.querySelector('svg path[d*="L17.59 5"]');

    // There are icons for correct/incorrect counts, but not for last feedback
    // We can check that the text-xs span doesn't exist
    const textXsSpans = container.querySelectorAll('.text-xs');
    const hasFeedbackIcon = Array.from(textXsSpans).some(
      span => span.querySelector('svg')
    );
    expect(hasFeedbackIcon).toBe(false);
  });

  it('does not show last feedback icon when lastComparison is undefined', () => {
    const { container } = render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={5}
        incorrectCount={0}
        totalNotes={10}
        currentNoteIndex={4}
      />
    );

    // No feedback icon should be present
    const textXsSpans = container.querySelectorAll('.text-xs');
    const hasFeedbackIcon = Array.from(textXsSpans).some(
      span => span.querySelector('svg')
    );
    expect(hasFeedbackIcon).toBe(false);
  });

  it('handles 0 totalNotes gracefully', () => {
    render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={0}
        incorrectCount={0}
        totalNotes={0}
        currentNoteIndex={0}
      />
    );

    expect(screen.getByText('0/0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('shows finished state (same as playing)', () => {
    render(
      <PracticeVisualizer
        practiceState="finished"
        correctCount={8}
        incorrectCount={2}
        totalNotes={10}
        currentNoteIndex={9}
      />
    );

    expect(screen.getByText('10/10')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('caps displayed note index at totalNotes', () => {
    render(
      <PracticeVisualizer
        practiceState="playing"
        correctCount={10}
        incorrectCount={0}
        totalNotes={10}
        currentNoteIndex={15} // Intentionally higher
      />
    );

    // Should show 10/10, not 16/10
    expect(screen.getByText('10/10')).toBeInTheDocument();
  });
});
