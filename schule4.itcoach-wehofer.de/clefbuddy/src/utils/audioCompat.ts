/**
 * Audio Compatibility Utilities
 *
 * Checks browser support for Web Audio API and provides
 * graceful degradation for unsupported environments.
 */

/**
 * Check if Web Audio API is supported
 */
export function isWebAudioSupported(): boolean {
  return typeof window !== 'undefined' && 'AudioContext' in window;
}

/**
 * Check if the browser can autoplay audio
 * (Most browsers require user interaction first)
 */
export async function canAutoplay(): Promise<boolean> {
  try {
    const audioContext = new AudioContext();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    const canPlay = audioContext.state === 'running';
    await audioContext.close();
    return canPlay;
  } catch {
    return false;
  }
}

/**
 * Get user-friendly error message for audio issues
 */
export function getAudioErrorMessage(error: unknown): string {
  if (!isWebAudioSupported()) {
    return 'Dein Browser unterstützt keine Audio-Wiedergabe. Bitte verwende einen modernen Browser wie Chrome, Firefox oder Safari.';
  }

  if (error instanceof Error) {
    if (error.message.includes('user gesture')) {
      return 'Klicke auf "Play", um die Audio-Wiedergabe zu starten. Browser erfordern eine Benutzeraktion vor der Audio-Wiedergabe.';
    }
    if (error.message.includes('NotAllowedError')) {
      return 'Audio-Wiedergabe wurde blockiert. Bitte erlaube Audio in deinen Browser-Einstellungen.';
    }
    if (error.message.includes('NotSupportedError')) {
      return 'Dieser Audio-Typ wird nicht unterstützt. Bitte versuche einen anderen Browser.';
    }
  }

  return 'Ein Fehler bei der Audio-Wiedergabe ist aufgetreten. Bitte lade die Seite neu und versuche es erneut.';
}

/**
 * Browser info for debugging
 */
export function getBrowserInfo(): {
  name: string;
  version: string;
  supportsWebAudio: boolean;
  isMobile: boolean;
} {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  let name = 'Unknown';
  let version = 'Unknown';

  if (ua.includes('Chrome')) {
    name = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.includes('Firefox')) {
    name = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.includes('Safari')) {
    name = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.includes('Edge')) {
    name = 'Edge';
    const match = ua.match(/Edge\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

  return {
    name,
    version,
    supportsWebAudio: isWebAudioSupported(),
    isMobile,
  };
}

/**
 * Recommended audio settings based on device
 */
export function getRecommendedAudioSettings(): {
  lookAhead: number;
  updateInterval: number;
  latencyHint: 'interactive' | 'balanced' | 'playback';
} {
  const { isMobile } = getBrowserInfo();

  if (isMobile) {
    // Mobile devices need more buffer to prevent glitches
    return {
      lookAhead: 0.2, // 200ms
      updateInterval: 0.05, // 50ms
      latencyHint: 'balanced',
    };
  }

  // Desktop can use tighter timing
  return {
    lookAhead: 0.1, // 100ms
    updateInterval: 0.025, // 25ms
    latencyHint: 'interactive',
  };
}
