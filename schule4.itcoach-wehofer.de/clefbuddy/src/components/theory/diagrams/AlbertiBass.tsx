import React from 'react';

export const AlbertiBass: React.FC = () => {
  return (
    <svg viewBox="0 0 520 210" width="100%" >
      {/* Title */}
      <text x="260" y="20" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="16" fontWeight="600">
        Alberti-Bass Begleitung
      </text>

      {/* Brace */}
      <path d="M 35 30 Q 30 55 35 80 Q 30 105 35 130 Q 30 155 35 180" strokeWidth="2" stroke="var(--svg-notation-primary)" fill="none" />

      {/* Treble clef staff */}
      <g stroke="var(--svg-staff-line)" strokeWidth="1">
        <line x1="50" y1="35" x2="500" y2="35" />
        <line x1="50" y1="50" x2="500" y2="50" />
        <line x1="50" y1="65" x2="500" y2="65" />
        <line x1="50" y1="80" x2="500" y2="80" />
        <line x1="50" y1="95" x2="500" y2="95" />
      </g>

      {/* Treble clef (simplified) */}
      <g fill="var(--svg-notation-primary)">
        <circle cx="70" cy="65" r="8" />
        <path d="M 70 57 Q 78 50 78 65 Q 78 80 70 73" strokeWidth="2" stroke="var(--svg-notation-primary)" fill="none" />
      </g>

      {/* Bass clef staff */}
      <g stroke="var(--svg-staff-line)" strokeWidth="1">
        <line x1="50" y1="125" x2="500" y2="125" />
        <line x1="50" y1="140" x2="500" y2="140" />
        <line x1="50" y1="155" x2="500" y2="155" />
        <line x1="50" y1="170" x2="500" y2="170" />
        <line x1="50" y1="185" x2="500" y2="185" />
      </g>

      {/* Bass clef (simplified) */}
      <g fill="var(--svg-notation-primary)">
        <circle cx="70" cy="155" r="8" />
        <circle cx="82" cy="147.5" r="2" />
        <circle cx="82" cy="162.5" r="2" />
      </g>

      {/* Treble melody - simple half notes */}
      <g fill="var(--svg-notation-primary)">
        {/* C note (middle space) */}
        <ellipse cx="120" cy="72.5" rx="9.5" ry="6.5" transform="rotate(-20 120 72.5)" />
        <line x1="129" y1="72.5" x2="129" y2="42.5" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* E note (first line) */}
        <ellipse cx="280" cy="95" rx="9.5" ry="6.5" transform="rotate(-20 280 95)" />
        <line x1="289" y1="95" x2="289" y2="65" strokeWidth="2" stroke="var(--svg-notation-primary)" />
      </g>

      {/* Alberti bass pattern - 8 eighth notes */}
      <g fill="var(--svg-notation-primary)">
        {/* First pair: C - G (beamed) */}
        {/* C note (2nd space) */}
        <ellipse cx="120" cy="170" rx="9.5" ry="6.5" transform="rotate(-20 120 170)" />
        <line x1="129" y1="170" x2="129" y2="140" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* G note (4th line) */}
        <ellipse cx="160" cy="140" rx="9.5" ry="6.5" transform="rotate(-20 160 140)" />
        <line x1="169" y1="140" x2="169" y2="110" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* Beam for first pair */}
        <rect x="129" y="110" width="40" height="3" fill="var(--svg-notation-primary)" />

        {/* Second pair: E - G (beamed) */}
        {/* E note (3rd line) */}
        <ellipse cx="200" cy="155" rx="9.5" ry="6.5" transform="rotate(-20 200 155)" />
        <line x1="209" y1="155" x2="209" y2="125" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* G note (4th line) */}
        <ellipse cx="240" cy="140" rx="9.5" ry="6.5" transform="rotate(-20 240 140)" />
        <line x1="249" y1="140" x2="249" y2="110" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* Beam for second pair */}
        <rect x="209" y="110" width="40" height="3" fill="var(--svg-notation-primary)" />

        {/* Third pair: C - G (beamed) */}
        {/* C note (2nd space) */}
        <ellipse cx="280" cy="170" rx="9.5" ry="6.5" transform="rotate(-20 280 170)" />
        <line x1="289" y1="170" x2="289" y2="140" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* G note (4th line) */}
        <ellipse cx="320" cy="140" rx="9.5" ry="6.5" transform="rotate(-20 320 140)" />
        <line x1="329" y1="140" x2="329" y2="110" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* Beam for third pair */}
        <rect x="289" y="110" width="40" height="3" fill="var(--svg-notation-primary)" />

        {/* Fourth pair: E - G (beamed) */}
        {/* E note (3rd line) */}
        <ellipse cx="360" cy="155" rx="9.5" ry="6.5" transform="rotate(-20 360 155)" />
        <line x1="369" y1="155" x2="369" y2="125" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* G note (4th line) */}
        <ellipse cx="400" cy="140" rx="9.5" ry="6.5" transform="rotate(-20 400 140)" />
        <line x1="409" y1="140" x2="409" y2="110" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* Beam for fourth pair */}
        <rect x="369" y="110" width="40" height="3" fill="var(--svg-notation-primary)" />
      </g>

      {/* Labels below bass pattern */}
      <text x="120" y="205" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="12" fontWeight="600">
        tief
      </text>
      <text x="160" y="205" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="12" fontWeight="600">
        hoch
      </text>
      <text x="200" y="205" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="12" fontWeight="600">
        mittel
      </text>
      <text x="240" y="205" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="12" fontWeight="600">
        hoch
      </text>
    </svg>
  );
};
