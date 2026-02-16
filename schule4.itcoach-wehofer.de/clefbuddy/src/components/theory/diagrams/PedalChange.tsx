import React from 'react';

interface PedalChangeProps {
  className?: string;
}

export const PedalChange: React.FC<PedalChangeProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 480 200"
      width="100%"
      className={className}
      role="img"
      aria-label="Richtige und falsche Pedalwechsel"
    >
      {/* Background */}
      <rect x="0" y="0" width="480" height="200" fill="transparent" />

      {/* Example 1: Too much pedal (wrong) */}
      <g>
        <rect x="20" y="10" width="440" height="50" fill="var(--svg-notation-primary)" opacity="0.08" rx="4" />

        {/* Staff */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`staff1-${i}`}
            x1="40"
            y1={18 + i * 6}
            x2="200"
            y2={18 + i * 6}
            stroke="var(--svg-notation-primary)"
            strokeWidth="0.8"
          />
        ))}

        {/* Treble clef */}
        <text x="43" y="33" fontSize="18" fill="var(--svg-notation-primary)">𝄞</text>

        {/* Chord 1 (C major) */}
        <g>
          <ellipse cx="75" cy="24" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 75 24)" />
          <ellipse cx="75" cy="30" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 75 30)" />
          <ellipse cx="75" cy="36" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 75 36)" />
          <line x1="79" y1="24" x2="79" y2="36" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        </g>

        {/* Chord 2 (different - G major) */}
        <g>
          <ellipse cx="145" cy="20" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 145 20)" />
          <ellipse cx="145" cy="26" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 145 26)" />
          <ellipse cx="145" cy="32" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 145 32)" />
          <line x1="149" y1="20" x2="149" y2="32" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        </g>

        {/* Long pedal (wrong) */}
        <text x="75" y="52" fontSize="10" fontStyle="italic" fill="var(--svg-notation-primary)">Ped.</text>
        <line x1="90" y1="50" x2="170" y2="50" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        <text x="170" y="55" fontSize="13" fill="var(--svg-notation-primary)">✱</text>

        {/* Muddy sound indicator (wavy lines) */}
        <path
          d="M 110 27 Q 115 23 120 27 Q 125 31 130 27"
          stroke="var(--svg-notation-secondary)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Label */}
        <text x="215" y="30" fontSize="13" fontWeight="600" fill="var(--svg-notation-primary)">✗</text>
        <text x="230" y="32" fontSize="12" fontWeight="500" fill="var(--svg-notation-primary)">Zu viel Pedal</text>
        <text x="230" y="46" fontSize="10" fill="var(--svg-notation-primary)" opacity="0.6">(matschig)</text>
      </g>

      {/* Example 2: No pedal (wrong) */}
      <g transform="translate(0, 65)">
        <rect x="20" y="10" width="440" height="50" fill="var(--svg-notation-primary)" opacity="0.08" rx="4" />

        {/* Staff */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`staff2-${i}`}
            x1="40"
            y1={18 + i * 6}
            x2="200"
            y2={18 + i * 6}
            stroke="var(--svg-notation-primary)"
            strokeWidth="0.8"
          />
        ))}

        {/* Treble clef */}
        <text x="43" y="33" fontSize="18" fill="var(--svg-notation-primary)">𝄞</text>

        {/* Short separated notes */}
        <g>
          <ellipse cx="75" cy="30" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 75 30)" />
          <line x1="79" y1="30" x2="79" y2="10" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        </g>

        <g>
          <ellipse cx="105" cy="26" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 105 26)" />
          <line x1="109" y1="26" x2="109" y2="10" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        </g>

        <g>
          <ellipse cx="135" cy="30" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 135 30)" />
          <line x1="139" y1="30" x2="139" y2="10" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        </g>

        <g>
          <ellipse cx="165" cy="34" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 165 34)" />
          <line x1="169" y1="34" x2="169" y2="14" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        </g>

        {/* No pedal marking - just empty space below */}

        {/* Dry sound indicator (disconnected) */}
        <line x1="75" y1="45" x2="85" y2="45" stroke="var(--svg-notation-secondary)" strokeWidth="1.5" opacity="0.4" />
        <line x1="95" y1="45" x2="115" y2="45" stroke="var(--svg-notation-secondary)" strokeWidth="1.5" opacity="0.4" />
        <line x1="125" y1="45" x2="145" y2="45" stroke="var(--svg-notation-secondary)" strokeWidth="1.5" opacity="0.4" />

        {/* Label */}
        <text x="215" y="30" fontSize="13" fontWeight="600" fill="var(--svg-notation-primary)">✗</text>
        <text x="230" y="32" fontSize="12" fontWeight="500" fill="var(--svg-notation-primary)">Kein Pedal</text>
        <text x="230" y="46" fontSize="10" fill="var(--svg-notation-primary)" opacity="0.6">(trocken)</text>
      </g>

      {/* Example 3: Correct pedal change */}
      <g transform="translate(0, 130)">
        <rect x="20" y="10" width="440" height="50" fill="var(--svg-notation-primary)" opacity="0.08" rx="4" />

        {/* Staff */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`staff3-${i}`}
            x1="40"
            y1={18 + i * 6}
            x2="200"
            y2={18 + i * 6}
            stroke="var(--svg-notation-primary)"
            strokeWidth="0.8"
          />
        ))}

        {/* Treble clef */}
        <text x="43" y="33" fontSize="18" fill="var(--svg-notation-primary)">𝄞</text>

        {/* Chord 1 */}
        <g>
          <ellipse cx="75" cy="24" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 75 24)" />
          <ellipse cx="75" cy="30" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 75 30)" />
          <ellipse cx="75" cy="36" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 75 36)" />
          <line x1="79" y1="24" x2="79" y2="36" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        </g>

        {/* Chord 2 */}
        <g>
          <ellipse cx="145" cy="20" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 145 20)" />
          <ellipse cx="145" cy="26" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 145 26)" />
          <ellipse cx="145" cy="32" rx="4" ry="3" fill="var(--svg-notation-primary)" transform="rotate(-20 145 32)" />
          <line x1="149" y1="20" x2="149" y2="32" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        </g>

        {/* Pedal change at chord change */}
        <text x="75" y="52" fontSize="10" fontStyle="italic" fill="var(--svg-notation-primary)">Ped.</text>
        <line x1="90" y1="50" x2="135" y2="50" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />
        <text x="135" y="55" fontSize="13" fill="var(--svg-notation-primary)">✱</text>

        <text x="145" y="52" fontSize="10" fontStyle="italic" fill="var(--svg-notation-primary)">Ped.</text>
        <line x1="160" y1="50" x2="170" y2="50" stroke="var(--svg-notation-primary)" strokeWidth="1.2" />

        {/* Clean connection indicator */}
        <path
          d="M 110 28 L 110 23 L 145 23 L 145 26"
          stroke="var(--svg-notation-secondary)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
          strokeDasharray="2,2"
        />

        {/* Label */}
        <text x="215" y="30" fontSize="13" fontWeight="600" fill="var(--svg-notation-primary)">✓</text>
        <text x="230" y="32" fontSize="12" fontWeight="500" fill="var(--svg-notation-primary)">Richtig gewechselt</text>
        <text x="230" y="46" fontSize="10" fill="var(--svg-notation-primary)" opacity="0.6">(sauber)</text>
      </g>
    </svg>
  );
};
