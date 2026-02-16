import React from 'react';

export const MajorMinorTriads: React.FC = () => {
  return (
    <svg viewBox="0 0 500 160" width="100%" className="mx-auto">
      <title>Dur und Moll im Vergleich</title>

      {/* Title */}
      <text x="250" y="20" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="16" fontWeight="600">
        Dur und Moll im Vergleich
      </text>

      {/* Left Staff - C-Dur */}
      <g id="c-dur-staff">
        {/* Staff lines */}
        <line x1="40" y1="60" x2="200" y2="60" stroke="var(--svg-staff-line)" strokeWidth="1" />
        <line x1="40" y1="75" x2="200" y2="75" stroke="var(--svg-staff-line)" strokeWidth="1" />
        <line x1="40" y1="90" x2="200" y2="90" stroke="var(--svg-staff-line)" strokeWidth="1" />
        <line x1="40" y1="105" x2="200" y2="105" stroke="var(--svg-staff-line)" strokeWidth="1" />
        <line x1="40" y1="120" x2="200" y2="120" stroke="var(--svg-staff-line)" strokeWidth="1" />

        {/* Treble clef */}
        <text x="50" y="100" fill="var(--svg-notation-primary)" fontSize="48" fontFamily="serif">𝄞</text>

        {/* Ledger line for low C */}
        <line x1="105" y1="135" x2="145" y2="135" stroke="var(--svg-staff-line)" strokeWidth="1" />

        {/* C-Dur chord (C-E-G) */}
        {/* C note (on ledger line) */}
        <ellipse cx="120" cy="135" rx="9.5" ry="6.5" transform="rotate(-20 120 135)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* E note (first space) - highlighted with circle */}
        <circle cx="120" cy="97.5" r="14" fill="none" stroke="var(--svg-notation-secondary)" strokeWidth="2" strokeDasharray="none" />
        <ellipse cx="120" cy="97.5" rx="9.5" ry="6.5" transform="rotate(-20 120 97.5)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* G note (second line) */}
        <ellipse cx="120" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 120 90)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Stem */}
        <line x1="129" y1="90" x2="129" y2="135" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Labels */}
        <text x="120" y="152" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          C-Dur
        </text>
        <text x="120" y="168" textAnchor="middle" fill="var(--svg-notation-secondary)" fontSize="12">
          C - E - G
        </text>
      </g>

      {/* Arrow and labels */}
      <g id="comparison-arrow">
        <line x1="210" y1="97.5" x2="290" y2="97.5" stroke="var(--svg-notation-secondary)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--svg-notation-secondary)" />
          </marker>
        </defs>
        <text x="250" y="88" textAnchor="middle" fill="var(--svg-notation-secondary)" fontSize="12">
          grosse Terz vs kleine Terz
        </text>
      </g>

      {/* Right Staff - C-Moll */}
      <g id="c-moll-staff">
        {/* Staff lines */}
        <line x1="300" y1="60" x2="460" y2="60" stroke="var(--svg-staff-line)" strokeWidth="1" />
        <line x1="300" y1="75" x2="460" y2="75" stroke="var(--svg-staff-line)" strokeWidth="1" />
        <line x1="300" y1="90" x2="460" y2="90" stroke="var(--svg-staff-line)" strokeWidth="1" />
        <line x1="300" y1="105" x2="460" y2="105" stroke="var(--svg-staff-line)" strokeWidth="1" />
        <line x1="300" y1="120" x2="460" y2="120" stroke="var(--svg-staff-line)" strokeWidth="1" />

        {/* Treble clef */}
        <text x="310" y="100" fill="var(--svg-notation-primary)" fontSize="48" fontFamily="serif">𝄞</text>

        {/* Ledger line for low C */}
        <line x1="365" y1="135" x2="405" y2="135" stroke="var(--svg-staff-line)" strokeWidth="1" />

        {/* C-Moll chord (C-Eb-G) */}
        {/* C note (on ledger line) */}
        <ellipse cx="380" cy="135" rx="9.5" ry="6.5" transform="rotate(-20 380 135)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Eb note (slightly lower than E) - highlighted with dashed circle */}
        <circle cx="380" cy="105" r="14" fill="none" stroke="var(--svg-notation-secondary)" strokeWidth="2" strokeDasharray="3,2" />
        <ellipse cx="380" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 380 105)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Flat sign for Eb */}
        <text x="365" y="108" fill="var(--svg-notation-primary)" fontSize="18">♭</text>

        {/* G note (second line) */}
        <ellipse cx="380" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 380 90)" fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Stem */}
        <line x1="389" y1="90" x2="389" y2="135" stroke="var(--svg-notation-primary)" strokeWidth="2" />

        {/* Labels */}
        <text x="380" y="152" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          C-Moll
        </text>
        <text x="380" y="168" textAnchor="middle" fill="var(--svg-notation-secondary)" fontSize="12">
          C - Es - G
        </text>
      </g>
    </svg>
  );
};
