import React from 'react';

export const ThreeChords: React.FC = () => {
  return (
    <svg viewBox="0 0 520 230" width="100%" className="mx-auto">
      <title>Die drei wichtigsten Akkorde: I-IV-V</title>

      {/* Treble staff lines */}
      <line x1="80" y1="30" x2="480" y2="30" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="80" y1="45" x2="480" y2="45" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="80" y1="60" x2="480" y2="60" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="80" y1="75" x2="480" y2="75" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="80" y1="90" x2="480" y2="90" stroke="var(--svg-staff-line)" strokeWidth="1" />

      {/* Bass staff lines */}
      <line x1="80" y1="120" x2="480" y2="120" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="80" y1="135" x2="480" y2="135" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="80" y1="150" x2="480" y2="150" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="80" y1="165" x2="480" y2="165" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="80" y1="180" x2="480" y2="180" stroke="var(--svg-staff-line)" strokeWidth="1" />

      {/* Brace connecting staffs */}
      <path d="M 60 30 Q 50 60 60 90 Q 50 105 60 120 Q 50 150 60 180" stroke="var(--svg-staff-line)" strokeWidth="2" fill="none" />

      {/* Treble clef */}
      <text x="90" y="70" fill="var(--svg-notation-primary)" fontSize="48" fontFamily="serif">𝄞</text>

      {/* Bass clef */}
      <text x="90" y="160" fill="var(--svg-notation-primary)" fontSize="48" fontFamily="serif">𝄢</text>

      {/* Chord I - C-Dur (x=130) */}
      <g id="chord-i">
        {/* Treble: C-E-G */}
        {/* Ledger line for low C */}
        <line x1="115" y1="105" x2="155" y2="105" stroke="var(--svg-staff-line)" strokeWidth="1" />

        {/* C note */}
        <ellipse cx="130" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 130 105)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* E note (first space) */}
        <ellipse cx="130" cy="67.5" rx="9.5" ry="6.5" transform="rotate(-20 130 67.5)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* G note (second line) */}
        <ellipse cx="130" cy="60" rx="9.5" ry="6.5" transform="rotate(-20 130 60)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Stem */}
        <line x1="139" y1="60" x2="139" y2="105" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Bass: C */}
        <ellipse cx="130" cy="150" rx="9.5" ry="6.5" transform="rotate(-20 130 150)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />
        <line x1="139" y1="150" x2="139" y2="120" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Labels */}
        <text x="130" y="20" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          C-Dur
        </text>
        <text x="130" y="210" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="16" fontWeight="700">
          I
        </text>
      </g>

      {/* Chord IV - F-Dur (x=260) */}
      <g id="chord-iv">
        {/* Treble: F-A-C */}
        {/* F note (first space) */}
        <ellipse cx="260" cy="67.5" rx="9.5" ry="6.5" transform="rotate(-20 260 67.5)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* A note (second space) */}
        <ellipse cx="260" cy="52.5" rx="9.5" ry="6.5" transform="rotate(-20 260 52.5)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* C note (third space) */}
        <ellipse cx="260" cy="37.5" rx="9.5" ry="6.5" transform="rotate(-20 260 37.5)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Stem */}
        <line x1="269" y1="37.5" x2="269" y2="67.5" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Bass: F */}
        <ellipse cx="260" cy="165" rx="9.5" ry="6.5" transform="rotate(-20 260 165)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />
        <line x1="269" y1="165" x2="269" y2="135" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Labels */}
        <text x="260" y="20" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          F-Dur
        </text>
        <text x="260" y="210" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="16" fontWeight="700">
          IV
        </text>
      </g>

      {/* Chord V - G-Dur (x=390) */}
      <g id="chord-v">
        {/* Treble: G-H-D */}
        {/* G note (second line) */}
        <ellipse cx="390" cy="60" rx="9.5" ry="6.5" transform="rotate(-20 390 60)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* B note (third line) */}
        <ellipse cx="390" cy="45" rx="9.5" ry="6.5" transform="rotate(-20 390 45)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* D note (fourth line) */}
        <ellipse cx="390" cy="30" rx="9.5" ry="6.5" transform="rotate(-20 390 30)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Stem */}
        <line x1="399" y1="30" x2="399" y2="60" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Bass: G */}
        <ellipse cx="390" cy="180" rx="9.5" ry="6.5" transform="rotate(-20 390 180)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />
        <line x1="399" y1="180" x2="399" y2="150" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Labels */}
        <text x="390" y="20" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          G-Dur
        </text>
        <text x="390" y="210" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="16" fontWeight="700">
          V
        </text>
      </g>
    </svg>
  );
};
