import React from 'react';

export const BlockedVsBroken: React.FC = () => {
  return (
    <svg viewBox="0 0 520 140" width="100%">
      {/* Title */}
      <text x="260" y="20" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="16" fontWeight="600">
        Vom Akkord zum Arpeggio
      </text>

      {/* Staff lines */}
      <g stroke="var(--svg-staff-line)" strokeWidth="1">
        <line x1="40" y1="30" x2="480" y2="30" />
        <line x1="40" y1="45" x2="480" y2="45" />
        <line x1="40" y1="60" x2="480" y2="60" />
        <line x1="40" y1="75" x2="480" y2="75" />
        <line x1="40" y1="90" x2="480" y2="90" />
      </g>

      {/* Treble clef (simplified) */}
      <g fill="var(--svg-notation-primary)">
        <circle cx="60" cy="60" r="8" />
        <path d="M 60 52 Q 68 45 68 60 Q 68 75 60 68" strokeWidth="2" stroke="var(--svg-notation-primary)" fill="none" />
      </g>

      {/* Block chord - C-E-G */}
      <g fill="var(--svg-notation-primary)">
        {/* C note (space below first line) */}
        <ellipse cx="110" cy="97.5" rx="9.5" ry="6.5" transform="rotate(-20 110 97.5)" />
        {/* E note (first line) */}
        <ellipse cx="110" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 110 90)" />
        {/* G note (second space) */}
        <ellipse cx="110" cy="82.5" rx="9.5" ry="6.5" transform="rotate(-20 110 82.5)" />
        {/* Stem */}
        <line x1="119" y1="82.5" x2="119" y2="45" strokeWidth="2" stroke="var(--svg-notation-primary)" />
      </g>

      {/* Label */}
      <text x="110" y="120" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14">
        Block-Akkord
      </text>

      {/* Arrow */}
      <g fill="var(--svg-notation-primary)">
        <line x1="180" y1="70" x2="240" y2="70" strokeWidth="2" stroke="var(--svg-notation-primary)" />
        <polygon points="240,70 230,65 230,75" />
      </g>

      {/* Arpeggio - C, E, G, E as quarter notes */}
      <g fill="var(--svg-notation-primary)">
        {/* C note */}
        <ellipse cx="290" cy="97.5" rx="9.5" ry="6.5" transform="rotate(-20 290 97.5)" />
        <line x1="299" y1="97.5" x2="299" y2="65" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* E note */}
        <ellipse cx="340" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 340 90)" />
        <line x1="349" y1="90" x2="349" y2="58" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* G note */}
        <ellipse cx="390" cy="82.5" rx="9.5" ry="6.5" transform="rotate(-20 390 82.5)" />
        <line x1="399" y1="82.5" x2="399" y2="50" strokeWidth="2" stroke="var(--svg-notation-primary)" />

        {/* E note */}
        <ellipse cx="440" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 440 90)" />
        <line x1="449" y1="90" x2="449" y2="58" strokeWidth="2" stroke="var(--svg-notation-primary)" />
      </g>

      {/* Label */}
      <text x="365" y="120" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14">
        Arpeggio
      </text>
    </svg>
  );
};
