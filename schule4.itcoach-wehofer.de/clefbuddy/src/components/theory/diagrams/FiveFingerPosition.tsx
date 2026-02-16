import React from 'react';

export const FiveFingerPosition: React.FC = () => {
  return (
    <svg
      viewBox="0 0 400 155"
      width="100%"
      className="max-w-2xl mx-auto"
      role="img"
      aria-label="5-Finger-Position in C"
    >
      {/* Title */}
      <text
        x="200"
        y="20"
        fill="var(--svg-notation-primary)" fontWeight="700" fontSize="18"
        textAnchor="middle"
      >
        5-Finger-Position in C
      </text>

      {/* Staff lines */}
      <line x1="30" y1="75" x2="370" y2="75" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="30" y1="82.5" x2="370" y2="82.5" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="30" y1="90" x2="370" y2="90" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="30" y1="97.5" x2="370" y2="97.5" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="30" y1="105" x2="370" y2="105" stroke="var(--svg-staff-line)" strokeWidth="1.5" />

      {/* Treble clef */}
      <text x="40" y="100" fill="var(--svg-notation-primary)" fontFamily="serif" fontSize="48">𝄞</text>

      {/* Ledger line for C */}
      <line x1="75" y1="112.5" x2="95" y2="112.5" stroke="var(--svg-staff-line)" strokeWidth="1.5" />

      {/* C - ledger line below (y=112.5) */}
      <ellipse cx="85" cy="112.5" rx="9.5" ry="6.5" transform="rotate(-20 85 112.5)" fill="var(--svg-notation-primary)" />
      <line x1="85" y1="112.5" x2="85" y2="67.5" stroke="var(--svg-staff-line)" strokeWidth="2" />

      {/* Finger number 1 (red) */}
      <circle cx="85" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="85" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">1</text>

      {/* Letter name */}
      <text x="85" y="140" fill="var(--svg-notation-primary)" fontWeight="700" fontSize="18" textAnchor="middle">C</text>

      {/* D - first space (y=101.25) */}
      <ellipse cx="135" cy="101.25" rx="9.5" ry="6.5" transform="rotate(-20 135 101.25)" fill="var(--svg-notation-primary)" />
      <line x1="135" y1="101.25" x2="135" y2="56.25" stroke="var(--svg-staff-line)" strokeWidth="2" />

      {/* Finger number 2 (orange) */}
      <circle cx="135" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="135" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">2</text>

      {/* Letter name */}
      <text x="135" y="140" fill="var(--svg-notation-primary)" fontWeight="700" fontSize="18" textAnchor="middle">D</text>

      {/* E - first line (y=90) */}
      <ellipse cx="185" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 185 90)" fill="var(--svg-notation-primary)" />
      <line x1="185" y1="90" x2="185" y2="45" stroke="var(--svg-staff-line)" strokeWidth="2" />

      {/* Finger number 3 (amber) */}
      <circle cx="185" cy="48" r="12" fill="var(--svg-notation-secondary)" />
      <text x="185" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">3</text>

      {/* Letter name */}
      <text x="185" y="140" fill="var(--svg-notation-primary)" fontWeight="700" fontSize="18" textAnchor="middle">E</text>

      {/* F - second space (y=86.25) */}
      <ellipse cx="235" cy="86.25" rx="9.5" ry="6.5" transform="rotate(-20 235 86.25)" fill="var(--svg-notation-primary)" />
      <line x1="235" y1="86.25" x2="235" y2="41.25" stroke="var(--svg-staff-line)" strokeWidth="2" />

      {/* Finger number 4 (green) */}
      <circle cx="235" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="235" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">4</text>

      {/* Letter name */}
      <text x="235" y="140" fill="var(--svg-notation-primary)" fontWeight="700" fontSize="18" textAnchor="middle">F</text>

      {/* G - second line (y=75) */}
      <ellipse cx="285" cy="75" rx="9.5" ry="6.5" transform="rotate(-20 285 75)" fill="var(--svg-notation-primary)" />
      <line x1="285" y1="75" x2="285" y2="30" stroke="var(--svg-staff-line)" strokeWidth="2" />

      {/* Finger number 5 (blue) */}
      <circle cx="285" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="285" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">5</text>

      {/* Letter name */}
      <text x="285" y="140" fill="var(--svg-notation-primary)" fontWeight="700" fontSize="18" textAnchor="middle">G</text>
    </svg>
  );
};
