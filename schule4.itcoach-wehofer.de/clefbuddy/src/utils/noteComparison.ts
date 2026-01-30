/**
 * Note Comparison Engine
 *
 * Compares played notes against expected notes from an exercise.
 * Calculates accuracy for pitch, timing, and rhythm.
 */

import type { PlayedNote } from '../types/midi';
import type { ScheduledNote } from '../types/playback';
import type {
  NoteComparison,
  ComparisonSummary,
  TimingAccuracy,
  NoteComparisonResult,
  ComparisonConfig,
  NoteMatchState,
  PracticeComparisonState,
} from '../types/comparison';
import { DEFAULT_COMPARISON_CONFIG, DEFAULT_TIMING_TOLERANCE } from '../types/comparison';

/**
 * Get timing accuracy classification based on offset
 */
function getTimingAccuracy(
  offsetMs: number,
  tolerance = DEFAULT_TIMING_TOLERANCE
): TimingAccuracy {
  const absOffset = Math.abs(offsetMs);

  if (absOffset <= tolerance.perfect) return 'perfect';
  if (absOffset <= tolerance.good) return 'good';
  if (absOffset <= tolerance.acceptable) return 'acceptable';

  return offsetMs < 0 ? 'early' : 'late';
}

/**
 * Calculate timing score (0-1) based on offset
 */
function calculateTimingScore(offsetMs: number, tolerance = DEFAULT_TIMING_TOLERANCE): number {
  const absOffset = Math.abs(offsetMs);

  if (absOffset <= tolerance.perfect) return 1.0;
  if (absOffset <= tolerance.good) return 0.9;
  if (absOffset <= tolerance.acceptable) return 0.7;

  // Gradual falloff beyond acceptable
  const maxOffset = tolerance.acceptable * 3;
  if (absOffset >= maxOffset) return 0;

  return 0.7 * (1 - (absOffset - tolerance.acceptable) / (maxOffset - tolerance.acceptable));
}

/**
 * Calculate rhythm score (0-1) based on duration ratio
 */
function calculateRhythmScore(durationRatio: number | null): number {
  if (durationRatio === null) return 0.5; // No duration info, give partial credit

  // Perfect ratio is 1.0
  const deviation = Math.abs(1 - durationRatio);

  if (deviation <= 0.1) return 1.0;    // Within 10%
  if (deviation <= 0.25) return 0.85;  // Within 25%
  if (deviation <= 0.5) return 0.6;    // Within 50%
  if (deviation <= 1.0) return 0.3;    // Within 100%

  return 0;
}

/**
 * Compare a single played note to an expected note
 */
export function compareNote(
  playedNote: PlayedNote | null,
  expectedNote: ScheduledNote | null,
  expectedIndex: number,
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): NoteComparison {
  const id = `comparison_${expectedIndex}_${Date.now()}`;

  // Missed note (expected but not played)
  if (playedNote === null && expectedNote !== null) {
    return {
      id,
      expectedNote,
      playedNote: null,
      result: 'missed',
      pitchCorrect: false,
      pitchDifference: 0,
      timingAccuracy: 'missed',
      timingOffsetMs: 0,
      durationRatio: null,
      expectedNoteIndex: expectedIndex,
    };
  }

  // Extra note (played but not expected)
  if (playedNote !== null && expectedNote === null) {
    return {
      id,
      expectedNote: null,
      playedNote,
      result: 'extra',
      pitchCorrect: false,
      pitchDifference: 0,
      timingAccuracy: 'acceptable',
      timingOffsetMs: 0,
      durationRatio: null,
      expectedNoteIndex: expectedIndex,
    };
  }

  // Both notes exist - compare them
  if (playedNote && expectedNote) {
    // Get expected MIDI pitches
    const expectedMidiPitches = expectedNote.midiPitches;

    // Check pitch
    const playedMidi = playedNote.midiNote;
    let pitchCorrect = false;
    let pitchDifference = 0;

    // Check if played pitch matches any expected pitch
    for (const expectedMidi of expectedMidiPitches) {
      if (playedMidi === expectedMidi) {
        pitchCorrect = true;
        pitchDifference = 0;
        break;
      }

      // Check octave tolerance
      if (config.octaveTolerance > 0) {
        const octaveDiff = Math.abs(Math.floor((playedMidi - expectedMidi) / 12));
        if (octaveDiff <= config.octaveTolerance && playedMidi % 12 === expectedMidi % 12) {
          pitchCorrect = true;
          pitchDifference = playedMidi - expectedMidi;
          break;
        }
      }

      // Track closest pitch difference
      const diff = playedMidi - expectedMidi;
      if (Math.abs(diff) < Math.abs(pitchDifference) || pitchDifference === 0) {
        pitchDifference = diff;
      }
    }

    // Check enharmonic equivalents if enabled
    if (!pitchCorrect && config.allowEnharmonics) {
      // Enharmonics have the same MIDI number, so this is already handled
    }

    // Calculate timing offset
    const timingOffsetMs = (playedNote.startTime - expectedNote.startTime) * 1000;
    const timingAccuracy = getTimingAccuracy(timingOffsetMs, config.timingTolerance);

    // Calculate duration ratio
    let durationRatio: number | null = null;
    if (playedNote.duration !== null && expectedNote.durationSeconds > 0) {
      durationRatio = playedNote.duration / expectedNote.durationSeconds;
    }

    // Determine overall result
    const result: NoteComparisonResult = pitchCorrect ? 'correct' : 'incorrect';

    return {
      id,
      expectedNote,
      playedNote,
      result,
      pitchCorrect,
      pitchDifference,
      timingAccuracy,
      timingOffsetMs,
      durationRatio,
      expectedNoteIndex: expectedIndex,
    };
  }

  // Fallback (shouldn't reach here)
  return {
    id,
    expectedNote: null,
    playedNote: null,
    result: 'missed',
    pitchCorrect: false,
    pitchDifference: 0,
    timingAccuracy: 'missed',
    timingOffsetMs: 0,
    durationRatio: null,
    expectedNoteIndex: expectedIndex,
  };
}

/**
 * Find the best matching expected note for a played note
 */
export function findBestMatch(
  playedNote: PlayedNote,
  noteStates: NoteMatchState[],
  currentTime: number,
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): NoteMatchState | null {
  const tolerance = config.timingTolerance.acceptable / 1000; // Convert to seconds

  let bestMatch: NoteMatchState | null = null;
  let bestScore = -1;

  for (const state of noteStates) {
    // Skip already matched notes
    if (state.matched) continue;

    const { expectedNote } = state;

    // Check time window
    const timeDiff = Math.abs(playedNote.startTime - expectedNote.startTime);
    if (timeDiff > tolerance * 2) continue;

    // Calculate match score
    let score = 0;

    // Pitch match is most important
    const playedMidi = playedNote.midiNote;
    for (const expectedMidi of expectedNote.midiPitches) {
      if (playedMidi === expectedMidi) {
        score += 100;
        break;
      }
      // Same pitch class (different octave)
      if (playedMidi % 12 === expectedMidi % 12) {
        score += 50;
        break;
      }
    }

    // Timing score
    const timingScore = calculateTimingScore(timeDiff * 1000, config.timingTolerance);
    score += timingScore * 30;

    // Prefer notes closer to current expected position
    const positionDiff = Math.abs(state.index - Math.floor(currentTime));
    score -= positionDiff * 5;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = state;
    }
  }

  return bestMatch;
}

/**
 * Compare all played notes to expected notes and generate summary
 */
export function compareExercise(
  playedNotes: PlayedNote[],
  scheduledNotes: ScheduledNote[],
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): ComparisonSummary {
  // Create match states for all expected notes
  const noteStates: NoteMatchState[] = scheduledNotes.map((note, index) => ({
    expectedNote: note,
    index,
    matched: false,
    matchedPlayedNote: null,
    comparison: null,
  }));

  const unmatchedPlayedNotes: PlayedNote[] = [];

  // Sort played notes by time
  const sortedPlayedNotes = [...playedNotes].sort((a, b) => a.startTime - b.startTime);

  // Match played notes to expected notes
  for (const playedNote of sortedPlayedNotes) {
    const bestMatch = findBestMatch(playedNote, noteStates, playedNote.startTime, config);

    if (bestMatch) {
      bestMatch.matched = true;
      bestMatch.matchedPlayedNote = playedNote;
      bestMatch.comparison = compareNote(
        playedNote,
        bestMatch.expectedNote,
        bestMatch.index,
        config
      );
    } else {
      unmatchedPlayedNotes.push(playedNote);
    }
  }

  // Create comparisons for all notes (including missed ones)
  const comparisons: NoteComparison[] = [];

  for (const state of noteStates) {
    if (state.comparison) {
      comparisons.push(state.comparison);
    } else {
      // Missed note
      comparisons.push(
        compareNote(null, state.expectedNote, state.index, config)
      );
    }
  }

  // Add extra notes
  for (const extraNote of unmatchedPlayedNotes) {
    comparisons.push(
      compareNote(extraNote, null, -1, config)
    );
  }

  // Calculate statistics
  const totalExpectedNotes = scheduledNotes.length;
  let correctNotes = 0;
  let incorrectNotes = 0;
  let missedNotes = 0;
  let extraNotes = 0;
  let totalTimingOffset = 0;
  let timingCount = 0;
  let totalTimingScore = 0;
  let totalRhythmScore = 0;
  let rhythmCount = 0;

  for (const comparison of comparisons) {
    switch (comparison.result) {
      case 'correct':
        correctNotes++;
        break;
      case 'incorrect':
        incorrectNotes++;
        break;
      case 'missed':
        missedNotes++;
        break;
      case 'extra':
        extraNotes++;
        break;
    }

    // Timing stats (only for matched notes)
    if (comparison.result !== 'missed' && comparison.result !== 'extra') {
      totalTimingOffset += comparison.timingOffsetMs;
      totalTimingScore += calculateTimingScore(comparison.timingOffsetMs, config.timingTolerance);
      timingCount++;

      if (comparison.durationRatio !== null) {
        totalRhythmScore += calculateRhythmScore(comparison.durationRatio);
        rhythmCount++;
      }
    }
  }

  // Calculate accuracy percentages
  const pitchAccuracy =
    totalExpectedNotes > 0 ? (correctNotes / totalExpectedNotes) * 100 : 0;

  const timingAccuracy =
    timingCount > 0 ? (totalTimingScore / timingCount) * 100 : 0;

  const rhythmAccuracy =
    rhythmCount > 0 ? (totalRhythmScore / rhythmCount) * 100 : pitchAccuracy * 0.7;

  // Calculate overall accuracy with weights
  const overallAccuracy =
    pitchAccuracy * config.scoreWeights.pitch +
    timingAccuracy * config.scoreWeights.timing +
    rhythmAccuracy * config.scoreWeights.rhythm;

  const averageTimingOffset = timingCount > 0 ? totalTimingOffset / timingCount : 0;

  return {
    totalExpectedNotes,
    correctNotes,
    incorrectNotes,
    missedNotes,
    extraNotes,
    pitchAccuracy,
    timingAccuracy,
    rhythmAccuracy,
    overallAccuracy,
    averageTimingOffset,
    comparisons,
  };
}

/**
 * Initialize practice comparison state
 */
export function initPracticeComparisonState(
  scheduledNotes: ScheduledNote[]
): PracticeComparisonState {
  return {
    noteStates: scheduledNotes.map((note, index) => ({
      expectedNote: note,
      index,
      matched: false,
      matchedPlayedNote: null,
      comparison: null,
    })),
    unmatchedPlayedNotes: [],
    currentExpectedIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
  };
}

/**
 * Process a newly played note during practice
 */
export function processPlayedNote(
  state: PracticeComparisonState,
  playedNote: PlayedNote,
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): PracticeComparisonState {
  const bestMatch = findBestMatch(
    playedNote,
    state.noteStates,
    playedNote.startTime,
    config
  );

  const newState = { ...state };

  if (bestMatch) {
    // Update the match state
    const newNoteStates = state.noteStates.map((s) =>
      s.index === bestMatch.index
        ? {
            ...s,
            matched: true,
            matchedPlayedNote: playedNote,
            comparison: compareNote(
              playedNote,
              s.expectedNote,
              s.index,
              config
            ),
          }
        : s
    );

    newState.noteStates = newNoteStates;

    // Update counts
    const comparison = newNoteStates[bestMatch.index].comparison;
    if (comparison?.result === 'correct') {
      newState.correctCount++;
    } else if (comparison?.result === 'incorrect') {
      newState.incorrectCount++;
    }

    // Update current expected index
    while (
      newState.currentExpectedIndex < newState.noteStates.length &&
      newState.noteStates[newState.currentExpectedIndex].matched
    ) {
      newState.currentExpectedIndex++;
    }
  } else {
    // Extra note
    newState.unmatchedPlayedNotes = [...state.unmatchedPlayedNotes, playedNote];
  }

  return newState;
}

/**
 * Finalize practice and generate summary
 */
export function finalizePractice(
  state: PracticeComparisonState,
  config: ComparisonConfig = DEFAULT_COMPARISON_CONFIG
): ComparisonSummary {
  const comparisons: NoteComparison[] = [];

  // Add all matched and missed notes
  for (const noteState of state.noteStates) {
    if (noteState.comparison) {
      comparisons.push(noteState.comparison);
    } else {
      // Missed note
      comparisons.push(
        compareNote(null, noteState.expectedNote, noteState.index, config)
      );
    }
  }

  // Add extra notes
  for (const extraNote of state.unmatchedPlayedNotes) {
    comparisons.push(compareNote(extraNote, null, -1, config));
  }

  // Calculate stats
  const totalExpectedNotes = state.noteStates.length;
  let correctNotes = 0;
  let incorrectNotes = 0;
  let missedNotes = 0;
  let extraNotes = 0;
  let totalTimingOffset = 0;
  let timingCount = 0;
  let totalTimingScore = 0;
  let totalRhythmScore = 0;
  let rhythmCount = 0;

  for (const comparison of comparisons) {
    switch (comparison.result) {
      case 'correct':
        correctNotes++;
        break;
      case 'incorrect':
        incorrectNotes++;
        break;
      case 'missed':
        missedNotes++;
        break;
      case 'extra':
        extraNotes++;
        break;
    }

    if (comparison.result !== 'missed' && comparison.result !== 'extra') {
      totalTimingOffset += comparison.timingOffsetMs;
      totalTimingScore += calculateTimingScore(comparison.timingOffsetMs, config.timingTolerance);
      timingCount++;

      if (comparison.durationRatio !== null) {
        totalRhythmScore += calculateRhythmScore(comparison.durationRatio);
        rhythmCount++;
      }
    }
  }

  const pitchAccuracy =
    totalExpectedNotes > 0 ? (correctNotes / totalExpectedNotes) * 100 : 0;
  const timingAccuracy =
    timingCount > 0 ? (totalTimingScore / timingCount) * 100 : 0;
  const rhythmAccuracy =
    rhythmCount > 0 ? (totalRhythmScore / rhythmCount) * 100 : pitchAccuracy * 0.7;
  const overallAccuracy =
    pitchAccuracy * config.scoreWeights.pitch +
    timingAccuracy * config.scoreWeights.timing +
    rhythmAccuracy * config.scoreWeights.rhythm;

  return {
    totalExpectedNotes,
    correctNotes,
    incorrectNotes,
    missedNotes,
    extraNotes,
    pitchAccuracy,
    timingAccuracy,
    rhythmAccuracy,
    overallAccuracy,
    averageTimingOffset: timingCount > 0 ? totalTimingOffset / timingCount : 0,
    comparisons,
  };
}
