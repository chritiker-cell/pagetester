/**
 * Test Utilities — custom render, store helpers, common mocks
 */
import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Custom render that wraps with any providers if needed
function customRender(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return {
    user: userEvent.setup(),
    ...render(ui, options),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render, userEvent };

// Store reset helpers — call in beforeEach/afterEach
export function resetAllStores() {
  // Clear localStorage to reset persisted stores
  localStorage.clear();

  // Reset Zustand stores by importing and calling their reset/initial state
  // Each test file should import the specific stores it needs to reset
}

// Mock exercise factory
export function createMockExercise(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-exercise-1',
    name: 'Test Exercise',
    difficulty: 1,
    timeSignature: '4/4',
    tempo: 120,
    bars: [
      {
        treble: [
          { keys: ['C/4'], duration: 'q', id: 'n1' },
          { keys: ['D/4'], duration: 'q', id: 'n2' },
          { keys: ['E/4'], duration: 'q', id: 'n3' },
          { keys: ['F/4'], duration: 'q', id: 'n4' },
        ],
        bass: [
          { keys: ['C/3'], duration: 'w', id: 'b1' },
        ],
      },
    ],
    keySignature: 'C',
    ...overrides,
  };
}

// Mock SessionSummary for ResultsModal
export function createMockSessionSummary(overrides: Record<string, unknown> = {}) {
  return {
    score: {
      exerciseId: 'test-exercise-1',
      exerciseName: 'Test Exercise',
      stars: 4 as const,
      breakdown: {
        overall: 85,
        pitch: 90,
        timing: 80,
        completeness: 85,
      },
      stats: {
        totalNotes: 10,
        correctNotes: 8,
        incorrectNotes: 1,
        missedNotes: 1,
        averageTimingOffset: 25,
      },
      tempo: 120,
      metronomeEnabled: true,
      durationSeconds: 30,
      completedAt: new Date(),
    },
    improvement: {
      isNewBest: false,
      previousBest: null,
      improvement: 0,
    },
    message: 'Gut gemacht!',
    ...overrides,
  };
}

// Mock playback controller
export function createMockPlaybackController() {
  return {
    initialize: vi.fn().mockResolvedValue(true),
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    stop: vi.fn(),
    isReady: vi.fn().mockReturnValue(true),
    loadExercise: vi.fn(),
    getScheduledNotes: vi.fn().mockReturnValue([]),
    getSession: vi.fn().mockReturnValue(null),
    getTotalDuration: vi.fn().mockReturnValue(10),
    updateConfig: vi.fn(),
  };
}
