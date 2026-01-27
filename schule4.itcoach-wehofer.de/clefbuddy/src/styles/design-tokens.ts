/**
 * ClefBuddy Design System - Design Tokens
 *
 * Music-first design tokens optimized for note-reading practice.
 * Dark mode ready with accessible color contrasts.
 */

export const colors = {
  // Primary colors - Indigo for professional, focused aesthetic
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',   // Main brand color
    600: '#4f46e5',   // Interactive elements
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Neutral colors - Clean slate palette
  neutral: {
    0: '#ffffff',     // Pure white for notation area
    50: '#f8fafc',    // Background
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',   // Primary text
    900: '#0f172a',   // Headers
  },

  // Feedback colors - For MIDI input and practice feedback
  success: {
    light: '#86efac',
    DEFAULT: '#22c55e',  // Correct note
    dark: '#16a34a',
  },

  error: {
    light: '#fca5a5',
    DEFAULT: '#ef4444',  // Wrong note
    dark: '#dc2626',
  },

  warning: {
    light: '#fcd34d',
    DEFAULT: '#f59e0b',  // Nearly correct (for future pitch detection)
    dark: '#d97706',
  },

  info: {
    light: '#93c5fd',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },

  // Notation-specific colors
  notation: {
    staffLine: '#475569',        // Staff lines in light mode
    noteFill: '#0f172a',         // Note heads
    noteStroke: '#0f172a',       // Note outlines
    accidental: '#0f172a',       // Sharps, flats, naturals
    ledgerLine: '#475569',       // Ledger lines
    barline: '#334155',          // Bar lines
    beamStem: '#0f172a',         // Beams and stems

    // Dark mode variants (for future dark mode)
    dark: {
      staffLine: '#94a3b8',
      noteFill: '#f1f5f9',
      noteStroke: '#f1f5f9',
      accidental: '#f1f5f9',
      ledgerLine: '#94a3b8',
      barline: '#cbd5e1',
      beamStem: '#f1f5f9',
    },
  },

  // Metronome/Beat indicator colors
  metronome: {
    beat1: '#ef4444',      // Downbeat (red)
    beatStrong: '#f59e0b', // Strong beats (orange)
    beatWeak: '#6366f1',   // Weak beats (primary)
    inactive: '#cbd5e1',   // Inactive beats
  },
};

export const typography = {
  // Font families
  fontFamily: {
    sans: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif'
    ].join(', '),
    mono: [
      'JetBrains Mono',
      'Fira Code',
      'Monaco',
      'Courier New',
      'monospace'
    ].join(', '),
    musical: [
      'Bravura',         // SMuFL font for musical symbols (if available)
      'serif'
    ].join(', '),
  },

  // Font sizes - Musical hierarchy
  fontSize: {
    xs: '0.75rem',      // 12px - Helper text
    sm: '0.875rem',     // 14px - Labels
    base: '1rem',       // 16px - Body text
    lg: '1.125rem',     // 18px - Emphasized text
    xl: '1.25rem',      // 20px - Subheadings
    '2xl': '1.5rem',    // 24px - Section titles
    '3xl': '1.875rem',  // 30px - Page titles
    '4xl': '2.25rem',   // 36px - Hero text
    '5xl': '3rem',      // 48px - Display (ClefBuddy logo)
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights - Optimized for readability
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

export const spacing = {
  // Base spacing unit: 4px
  // Following 8-point grid system
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px - Tight elements
  DEFAULT: '0.5rem', // 8px - Standard cards
  md: '0.75rem',    // 12px - Elevated cards
  lg: '1rem',       // 16px - Hero elements
  xl: '1.5rem',     // 24px - Large cards
  '2xl': '2rem',    // 32px - Extra large
  full: '9999px',   // Pills/rounded buttons
};

export const shadows = {
  // Subtle shadows for clean interface
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Colored shadows for feedback
  success: '0 4px 12px rgba(34, 197, 94, 0.3)',
  error: '0 4px 12px rgba(239, 68, 68, 0.3)',
  primary: '0 4px 12px rgba(99, 102, 241, 0.3)',
};

export const transitions = {
  // Smooth, musical timing functions
  duration: {
    fast: '150ms',
    DEFAULT: '250ms',
    slow: '350ms',
  },

  timing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',      // Standard easing
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',      // Accelerate
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',     // Decelerate
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth both ends
    musical: 'cubic-bezier(0.65, 0, 0.35, 1)', // Musical feel (like a note)
  },
};

export const breakpoints = {
  // Responsive breakpoints
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Small desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
};

export const zIndex = {
  // Z-index scale
  background: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
};

// Layout-specific tokens
export const layout = {
  // Content area sizing
  maxWidth: {
    notation: '1400px',  // Max width for notation display
    content: '1200px',   // Max width for regular content
    text: '800px',       // Max width for readable text
  },

  // Touch targets - Minimum 44x44px for accessibility
  touchTarget: {
    min: '44px',
    comfortable: '52px',
  },

  // Notation area
  notationArea: {
    minHeight: '240px',     // Minimum height for staff display
    idealHeight: '320px',   // Comfortable reading height
    padding: spacing[8],    // Space around notation
  },
};

// Export a combined theme object for convenience
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  layout,
};

export default theme;
