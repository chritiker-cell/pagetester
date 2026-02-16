import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatic cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Mock Web MIDI API (not available in jsdom)
if (!navigator.requestMIDIAccess) {
  Object.defineProperty(navigator, 'requestMIDIAccess', {
    value: vi.fn().mockResolvedValue({
      inputs: new Map(),
      outputs: new Map(),
      onstatechange: null,
    }),
    writable: true,
    configurable: true,
  });
}

// Mock requestAnimationFrame (not available in jsdom)
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now()), 0) as unknown as number;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    clearTimeout(id);
  });
}

// Mock AudioContext (not available in jsdom)
if (typeof globalThis.AudioContext === 'undefined') {
  const MockAudioContext = vi.fn().mockImplementation(() => ({
    state: 'running',
    sampleRate: 44100,
    currentTime: 0,
    destination: {},
    createOscillator: vi.fn(() => ({
      connect: vi.fn(), start: vi.fn(), stop: vi.fn(),
      frequency: { value: 440 },
    })),
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      gain: { value: 1, setValueAtTime: vi.fn() },
    })),
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  }));
  vi.stubGlobal('AudioContext', MockAudioContext);
  vi.stubGlobal('webkitAudioContext', MockAudioContext);
}
