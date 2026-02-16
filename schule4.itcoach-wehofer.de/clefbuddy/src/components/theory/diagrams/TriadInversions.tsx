import React from 'react';

export const TriadInversions: React.FC = () => {
  return (
    <svg viewBox="0 0 520 150" width="100%" className="mx-auto">
      <title>Umkehrungen des C-Dur Dreiklangs</title>

      {/* Staff lines (single staff for all three inversions) */}
      <line x1="20" y1="50" x2="500" y2="50" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="65" x2="500" y2="65" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="80" x2="500" y2="80" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="95" x2="500" y2="95" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="110" x2="500" y2="110" stroke="var(--svg-staff-line)" strokeWidth="1" />

      {/* Treble clef */}
      <text x="30" y="90" fill="var(--svg-notation-primary)" fontSize="48" fontFamily="serif">𝄞</text>

      {/* Grundstellung (Root Position): C-E-G */}
      <g id="root-position">
        {/* Ledger line for low C */}
        <line x1="85" y1="125" x2="125" y2="125" stroke="var(--svg-staff-line)" strokeWidth="1" />

        {/* C note (on ledger line) - ROOT in orange */}
        <ellipse cx="100" cy="125" rx="9.5" ry="6.5" transform="rotate(-20 100 125)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* E note (first space) */}
        <ellipse cx="100" cy="87.5" rx="9.5" ry="6.5" transform="rotate(-20 100 87.5)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* G note (second line) */}
        <ellipse cx="100" cy="80" rx="9.5" ry="6.5" transform="rotate(-20 100 80)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Stem */}
        <line x1="109" y1="80" x2="109" y2="125" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Label */}
        <text x="100" y="142" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          Grundstellung
        </text>
      </g>

      {/* 1. Umkehrung (First Inversion): E-G-C */}
      <g id="first-inversion">
        {/* E note (first space) */}
        <ellipse cx="250" cy="87.5" rx="9.5" ry="6.5" transform="rotate(-20 250 87.5)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* G note (second line) */}
        <ellipse cx="250" cy="80" rx="9.5" ry="6.5" transform="rotate(-20 250 80)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Ledger line for high C */}
        <line x1="235" y1="50" x2="275" y2="50" stroke="var(--svg-staff-line)" strokeWidth="1" />

        {/* C note (on ledger line above staff) - ROOT in orange */}
        <ellipse cx="250" cy="50" rx="9.5" ry="6.5" transform="rotate(-20 250 50)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Stem */}
        <line x1="259" y1="50" x2="259" y2="87.5" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Label */}
        <text x="250" y="142" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          1. Umkehrung
        </text>
      </g>

      {/* 2. Umkehrung (Second Inversion): G-C-E */}
      <g id="second-inversion">
        {/* G note (second line) */}
        <ellipse cx="400" cy="80" rx="9.5" ry="6.5" transform="rotate(-20 400 80)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* C note (third space) - ROOT in orange */}
        <ellipse cx="400" cy="72.5" rx="9.5" ry="6.5" transform="rotate(-20 400 72.5)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* E note (fourth line) */}
        <ellipse cx="400" cy="65" rx="9.5" ry="6.5" transform="rotate(-20 400 65)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Stem */}
        <line x1="409" y1="65" x2="409" y2="80" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Label */}
        <text x="400" y="142" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          2. Umkehrung
        </text>
      </g>
    </svg>
  );
};
