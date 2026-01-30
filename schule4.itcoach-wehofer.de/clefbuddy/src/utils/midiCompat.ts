/**
 * MIDI Compatibility Utilities
 *
 * Checks browser support for Web MIDI API and provides
 * graceful degradation for unsupported environments.
 */

/**
 * Check if Web MIDI API is supported in this browser
 */
export function isWebMIDISupported(): boolean {
  return typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;
}

/**
 * Check if the browser requires secure context for MIDI
 * (Most modern browsers do)
 */
export function requiresSecureContext(): boolean {
  return typeof window !== 'undefined' && !window.isSecureContext;
}

/**
 * Get user-friendly error message for MIDI issues
 */
export function getMIDIErrorMessage(error: unknown): string {
  if (!isWebMIDISupported()) {
    return 'Dein Browser unterstützt kein Web MIDI. Bitte verwende Chrome, Edge oder Opera für MIDI-Unterstützung.';
  }

  if (requiresSecureContext()) {
    return 'MIDI benötigt eine sichere Verbindung (HTTPS). Bitte greife über HTTPS auf die Seite zu.';
  }

  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
        return 'MIDI-Zugriff wurde verweigert. Bitte erlaube MIDI in deinen Browser-Einstellungen.';
      case 'AbortError':
        return 'MIDI-Anfrage wurde abgebrochen. Bitte versuche es erneut.';
      case 'SecurityError':
        return 'MIDI-Zugriff aus Sicherheitsgründen blockiert. Bitte überprüfe deine Browser-Einstellungen.';
      case 'NotFoundError':
        return 'Kein MIDI-Gerät gefunden. Bitte schließe ein MIDI-Keyboard an.';
      default:
        return `MIDI-Fehler: ${error.message}`;
    }
  }

  if (error instanceof Error) {
    return `MIDI-Fehler: ${error.message}`;
  }

  return 'Ein unbekannter MIDI-Fehler ist aufgetreten. Bitte lade die Seite neu und versuche es erneut.';
}

/**
 * Browser info for MIDI debugging
 */
export function getMIDIBrowserInfo(): {
  browser: string;
  supportsWebMIDI: boolean;
  isSecureContext: boolean;
  recommendation: string;
} {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  let browser = 'Unknown';
  let recommendation = '';

  if (ua.includes('Chrome')) {
    browser = 'Chrome';
    recommendation = 'Chrome unterstützt Web MIDI vollständig.';
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
    recommendation =
      'Firefox unterstützt Web MIDI nicht nativ. Verwende Chrome oder Edge für MIDI-Funktionen.';
  } else if (ua.includes('Safari')) {
    browser = 'Safari';
    recommendation =
      'Safari unterstützt Web MIDI nicht. Verwende Chrome oder Edge für MIDI-Funktionen.';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
    recommendation = 'Edge unterstützt Web MIDI vollständig.';
  } else if (ua.includes('Opera')) {
    browser = 'Opera';
    recommendation = 'Opera unterstützt Web MIDI vollständig.';
  }

  const supportsWebMIDI = isWebMIDISupported();
  const isSecureContext =
    typeof window !== 'undefined' ? window.isSecureContext : false;

  if (!supportsWebMIDI && !recommendation) {
    recommendation =
      'Verwende Chrome, Edge oder Opera für Web MIDI-Unterstützung.';
  }

  return {
    browser,
    supportsWebMIDI,
    isSecureContext,
    recommendation,
  };
}

/**
 * Check if a MIDI device is likely a keyboard (not a controller)
 */
export function isLikelyKeyboard(deviceName: string): boolean {
  const keyboardKeywords = [
    'piano',
    'keyboard',
    'keys',
    'synth',
    'midi',
    'controller',
    'digital piano',
    'key',
  ];

  const excludeKeywords = ['drum', 'pad', 'pedal', 'control surface', 'mixer'];

  const lowerName = deviceName.toLowerCase();

  // Check if excluded
  if (excludeKeywords.some((keyword) => lowerName.includes(keyword))) {
    return false;
  }

  // Check if likely keyboard
  return keyboardKeywords.some((keyword) => lowerName.includes(keyword));
}

/**
 * Feature detection result
 */
export interface MIDIFeatureDetection {
  supported: boolean;
  secureContext: boolean;
  browserSupported: boolean;
  errorMessage: string | null;
}

/**
 * Perform comprehensive MIDI feature detection
 */
export async function detectMIDISupport(): Promise<MIDIFeatureDetection> {
  const supported = isWebMIDISupported();
  const secureContext =
    typeof window !== 'undefined' ? window.isSecureContext : false;
  const browserInfo = getMIDIBrowserInfo();

  if (!supported) {
    return {
      supported: false,
      secureContext,
      browserSupported: browserInfo.supportsWebMIDI,
      errorMessage: browserInfo.recommendation,
    };
  }

  if (!secureContext) {
    return {
      supported: false,
      secureContext: false,
      browserSupported: true,
      errorMessage:
        'Web MIDI benötigt eine sichere Verbindung (HTTPS oder localhost).',
    };
  }

  // Try to request access to confirm permissions
  try {
    await navigator.requestMIDIAccess();
    return {
      supported: true,
      secureContext: true,
      browserSupported: true,
      errorMessage: null,
    };
  } catch (error) {
    return {
      supported: true,
      secureContext: true,
      browserSupported: true,
      errorMessage: getMIDIErrorMessage(error),
    };
  }
}
