import React from 'react';

interface PedalNotationProps {
  className?: string;
}

export const PedalNotation: React.FC<PedalNotationProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 480 140"
      width="100%"
      className={className}
      role="img"
      aria-label="Notation des Haltepedals"
    >
      {/* Background */}
      <rect x="0" y="0" width="480" height="140" fill="transparent" />

      {/* Example 1: Ped. with line and asterisk */}
      <g>
        {/* Staff lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`staff1-${i}`}
            x1="40"
            y1={20 + i * 8}
            x2="240"
            y2={20 + i * 8}
            stroke="var(--svg-notation-primary)"
            strokeWidth="1"
          />
        ))}

        {/* Treble clef (simplified) */}
        <text x="45" y="40" fontSize="24" fill="var(--svg-notation-primary)">𝄞</text>

        {/* Notes - chord 1 */}
        <g>
          <ellipse cx="90" cy="28" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 90 28)" />
          <ellipse cx="90" cy="36" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 90 36)" />
          <ellipse cx="90" cy="44" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 90 44)" />
          <line x1="95" y1="28" x2="95" y2="44" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />
        </g>

        {/* Notes - chord 2 */}
        <g>
          <ellipse cx="170" cy="24" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 170 24)" />
          <ellipse cx="170" cy="32" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 170 32)" />
          <ellipse cx="170" cy="40" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 170 40)" />
          <line x1="175" y1="24" x2="175" y2="40" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />
        </g>

        {/* Pedal marking: Ped. */}
        <text x="90" y="68" fontSize="14" fontStyle="italic" fontWeight="600" fill="var(--svg-notation-primary)">
          Ped.
        </text>

        {/* Pedal line */}
        <line x1="115" y1="65" x2="200" y2="65" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />

        {/* Asterisk (release) */}
        <text x="200" y="70" fontSize="18" fontWeight="600" fill="var(--svg-notation-primary)">
          ✱
        </text>
      </g>

      {/* Labels for example 1 */}
      <g>
        <text x="90" y="88" fontSize="11" fill="var(--svg-notation-primary)" opacity="0.7">
          Ped. = Pedal druecken
        </text>
        <line x1="85" y1="75" x2="85" y2="82" stroke="var(--svg-notation-primary)" strokeWidth="0.8" opacity="0.5" />

        <text x="165" y="88" fontSize="11" fill="var(--svg-notation-primary)" opacity="0.7">
          ✱ = Pedal loslassen
        </text>
        <line x1="205" y1="72" x2="205" y2="82" stroke="var(--svg-notation-primary)" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* Example 2: Bracket notation */}
      <g transform="translate(0, 45)">
        {/* Staff lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`staff2-${i}`}
            x1="280"
            y1={20 + i * 8}
            x2="460"
            y2={20 + i * 8}
            stroke="var(--svg-notation-primary)"
            strokeWidth="1"
          />
        ))}

        {/* Treble clef */}
        <text x="285" y="40" fontSize="24" fill="var(--svg-notation-primary)">𝄞</text>

        {/* Notes - chord 1 */}
        <g>
          <ellipse cx="330" cy="28" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 330 28)" />
          <ellipse cx="330" cy="36" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 330 36)" />
          <line x1="335" y1="28" x2="335" y2="36" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />
        </g>

        {/* Notes - chord 2 */}
        <g>
          <ellipse cx="410" cy="24" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 410 24)" />
          <ellipse cx="410" cy="32" rx="5" ry="4" fill="var(--svg-notation-primary)" transform="rotate(-20 410 32)" />
          <line x1="415" y1="24" x2="415" y2="32" stroke="var(--svg-notation-primary)" strokeWidth="1.5" />
        </g>

        {/* Bracket notation */}
        <path
          d="M 330 60 L 330 65 L 410 65 L 410 60"
          stroke="var(--svg-notation-primary)"
          strokeWidth="1.5"
          fill="none"
        />
      </g>

      {/* Label for bracket notation */}
      <text x="360" y="128" fontSize="11" fill="var(--svg-notation-primary)" opacity="0.7" textAnchor="middle">
        Alternative Schreibweise
      </text>
    </svg>
  );
};
