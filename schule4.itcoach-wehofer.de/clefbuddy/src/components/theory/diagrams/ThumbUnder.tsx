import React from 'react';

export const ThumbUnder: React.FC = () => {
  return (
    <svg
      viewBox="0 0 520 160"
      width="100%"
      className="max-w-3xl mx-auto"
      role="img"
      aria-label="Untersetzen des Daumens in C-Dur Tonleiter"
    >
      {/* Title */}
      <text
        x="260"
        y="20"
        fill="var(--svg-notation-primary)" fontWeight="700" fontSize="18"
        textAnchor="middle"
      >
        Untersetzen des Daumens
      </text>

      {/* Staff lines */}
      <line x1="30" y1="75" x2="490" y2="75" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="30" y1="82.5" x2="490" y2="82.5" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="30" y1="90" x2="490" y2="90" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="30" y1="97.5" x2="490" y2="97.5" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="30" y1="105" x2="490" y2="105" stroke="var(--svg-staff-line)" strokeWidth="1.5" />

      {/* Treble clef */}
      <text x="35" y="100" fill="var(--svg-notation-primary)" fontFamily="serif" fontSize="48">𝄞</text>

      {/* Ledger line for low C */}
      <line x1="70" y1="112.5" x2="90" y2="112.5" stroke="var(--svg-staff-line)" strokeWidth="1.5" />

      {/* C - ledger line below (y=112.5) - Finger 1 */}
      <ellipse cx="80" cy="112.5" rx="9.5" ry="6.5" transform="rotate(-20 80 112.5)" fill="var(--svg-notation-primary)" />
      <line x1="80" y1="112.5" x2="80" y2="67.5" stroke="var(--svg-staff-line)" strokeWidth="2" />
      <circle cx="80" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="80" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">1</text>

      {/* D - first space (y=101.25) - Finger 2 */}
      <ellipse cx="125" cy="101.25" rx="9.5" ry="6.5" transform="rotate(-20 125 101.25)" fill="var(--svg-notation-primary)" />
      <line x1="125" y1="101.25" x2="125" y2="56.25" stroke="var(--svg-staff-line)" strokeWidth="2" />
      <circle cx="125" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="125" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">2</text>

      {/* E - first line (y=90) - Finger 3 */}
      <ellipse cx="170" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 170 90)" fill="var(--svg-notation-primary)" />
      <line x1="170" y1="90" x2="170" y2="45" stroke="var(--svg-staff-line)" strokeWidth="2" />
      <circle cx="170" cy="48" r="12" fill="var(--svg-notation-secondary)" />
      <text x="170" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">3</text>

      {/* F - second space (y=86.25) - Finger 1 (thumb under) */}
      <ellipse cx="240" cy="86.25" rx="9.5" ry="6.5" transform="rotate(-20 240 86.25)" fill="var(--svg-notation-primary)" />
      <line x1="240" y1="86.25" x2="240" y2="41.25" stroke="var(--svg-staff-line)" strokeWidth="2" />
      <circle cx="240" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="240" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">1</text>

      {/* G - second line (y=75) - Finger 2 */}
      <ellipse cx="285" cy="75" rx="9.5" ry="6.5" transform="rotate(-20 285 75)" fill="var(--svg-notation-primary)" />
      <line x1="285" y1="75" x2="285" y2="30" stroke="var(--svg-staff-line)" strokeWidth="2" />
      <circle cx="285" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="285" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">2</text>

      {/* A - second space (y=78.75) */}
      <ellipse cx="330" cy="78.75" rx="9.5" ry="6.5" transform="rotate(-20 330 78.75)" fill="var(--svg-notation-primary)" />
      <line x1="330" y1="78.75" x2="330" y2="33.75" stroke="var(--svg-staff-line)" strokeWidth="2" />
      <circle cx="330" cy="48" r="12" fill="var(--svg-notation-secondary)" />
      <text x="330" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">3</text>

      {/* H/B - third line (y=67.5) - Finger 4 */}
      <ellipse cx="375" cy="67.5" rx="9.5" ry="6.5" transform="rotate(-20 375 67.5)" fill="var(--svg-notation-primary)" />
      <line x1="375" y1="67.5" x2="375" y2="22.5" stroke="var(--svg-staff-line)" strokeWidth="2" />
      <circle cx="375" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="375" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">4</text>

      {/* C' - third space (y=71.25) - Finger 5 */}
      <ellipse cx="420" cy="71.25" rx="9.5" ry="6.5" transform="rotate(-20 420 71.25)" fill="var(--svg-notation-primary)" />
      <line x1="420" y1="71.25" x2="420" y2="26.25" stroke="var(--svg-staff-line)" strokeWidth="2" />
      <circle cx="420" cy="48" r="12" fill="var(--svg-notation-primary)" />
      <text x="420" y="53" fill="white" fontWeight="700" fontSize="16" textAnchor="middle">5</text>

      {/* Curved arrow showing thumb under movement (from E to F) */}
      <defs>
        <marker
          id="arrowhead-orange"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="var(--svg-notation-primary)" />
        </marker>
      </defs>

      {/* Curved path from E to F below staff */}
      <path
        d="M 175 120 Q 205 135 235 120"
        stroke="#ea580c" fill="none"
        strokeWidth="2.5"
        markerEnd="url(#arrowhead-orange)"
      />

      {/* "Untersetzen" label */}
      <text
        x="205"
        y="152"
        fill="var(--svg-notation-primary)" fontWeight="700" fontSize="14"
        textAnchor="middle"
      >
        Untersetzen
      </text>
    </svg>
  );
};
