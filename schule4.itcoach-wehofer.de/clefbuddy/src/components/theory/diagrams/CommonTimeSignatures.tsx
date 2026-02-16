import React from 'react';

interface CommonTimeSignaturesProps {
  className?: string;
}

export const CommonTimeSignatures: React.FC<CommonTimeSignaturesProps> = ({ className = '' }) => {
  // Use CSS variables for dark mode support
  const staffStroke = "var(--svg-staff-line)";
  const noteFill = "var(--svg-notation-primary)";
  const accentFill = "#dc2626";
  const blueFill = "#2563eb";

  return (
    <svg
      viewBox="0 0 500 200"
      width="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 4/4 Time - Marsch */}
      <g id="four-four">
        {/* Staff lines */}
        {[0, 15, 30, 45, 60].map((y, i) => (
          <line
            key={`staff-44-${i}`}
            x1="20"
            y1={10 + y}
            x2="480"
            y2={10 + y}
            stroke={staffStroke}
            strokeWidth="1"
          />
        ))}

        {/* Time signature */}
        <text x="35" y="30" fontSize="20" fontWeight="bold" fill={noteFill}>4</text>
        <text x="35" y="55" fontSize="20" fontWeight="bold" fill={noteFill}>4</text>

        {/* 4 quarter notes */}
        {[0, 1, 2, 3].map((i) => {
          const x = 80 + i * 80;
          return (
            <g key={`quarter-${i}`}>
              {/* Note head */}
              <ellipse
                cx={x}
                cy="40"
                rx="9.5"
                ry="6.5"
                transform={`rotate(-20 ${x} 40)`}
                fill={noteFill}
              />
              {/* Stem */}
              <line x1={x + 8} y1="40" x2={x + 8} y2="5" stroke={staffStroke} strokeWidth="1.5" />
              {/* Accent mark on beat 1 */}
              {i === 0 && (
                <text x={x - 5} y="0" fontSize="18" fontWeight="bold" fill={accentFill}>
                  &gt;
                </text>
              )}
            </g>
          );
        })}

        {/* Labels */}
        <text x="30" y="95" fontSize="14" fontWeight="bold" fill={blueFill}>
          4/4 - Marsch
        </text>
        <text x="80" y="95" fontSize="13" fontWeight="bold" fill={noteFill}>EINS</text>
        <text x="150" y="95" fontSize="13" fill={noteFill}>zwei</text>
        <text x="225" y="95" fontSize="13" fill={noteFill}>drei</text>
        <text x="305" y="95" fontSize="13" fill={noteFill}>vier</text>
      </g>

      {/* 3/4 Time - Walzer */}
      <g id="three-four" transform="translate(0, 65)">
        {/* Staff lines */}
        {[0, 15, 30, 45, 60].map((y, i) => (
          <line
            key={`staff-34-${i}`}
            x1="20"
            y1={10 + y}
            x2="480"
            y2={10 + y}
            stroke={staffStroke}
            strokeWidth="1"
          />
        ))}

        {/* Time signature */}
        <text x="35" y="30" fontSize="20" fontWeight="bold" fill={noteFill}>3</text>
        <text x="35" y="55" fontSize="20" fontWeight="bold" fill={noteFill}>4</text>

        {/* 3 quarter notes */}
        {[0, 1, 2].map((i) => {
          const x = 80 + i * 80;
          return (
            <g key={`quarter-3-${i}`}>
              {/* Note head */}
              <ellipse
                cx={x}
                cy="40"
                rx="9.5"
                ry="6.5"
                transform={`rotate(-20 ${x} 40)`}
                fill={noteFill}
              />
              {/* Stem */}
              <line x1={x + 8} y1="40" x2={x + 8} y2="5" stroke={staffStroke} strokeWidth="1.5" />
              {/* Accent mark on beat 1 */}
              {i === 0 && (
                <text x={x - 5} y="0" fontSize="18" fontWeight="bold" fill={accentFill}>
                  &gt;
                </text>
              )}
            </g>
          );
        })}

        {/* Labels */}
        <text x="30" y="95" fontSize="14" fontWeight="bold" fill={blueFill}>
          3/4 - Walzer
        </text>
        <text x="80" y="95" fontSize="13" fontWeight="bold" fill={noteFill}>EINS</text>
        <text x="150" y="95" fontSize="13" fill={noteFill}>zwei</text>
        <text x="225" y="95" fontSize="13" fill={noteFill}>drei</text>
      </g>

      {/* 6/8 Time - Wiegend */}
      <g id="six-eight" transform="translate(0, 130)">
        {/* Staff lines */}
        {[0, 15, 30, 45, 60].map((y, i) => (
          <line
            key={`staff-68-${i}`}
            x1="20"
            y1={10 + y}
            x2="480"
            y2={10 + y}
            stroke={staffStroke}
            strokeWidth="1"
          />
        ))}

        {/* Time signature */}
        <text x="35" y="30" fontSize="20" fontWeight="bold" fill={noteFill}>6</text>
        <text x="35" y="55" fontSize="20" fontWeight="bold" fill={noteFill}>8</text>

        {/* 6 eighth notes in two groups of 3 */}
        {[0, 1, 2].map((i) => {
          const x = 80 + i * 40;
          return (
            <g key={`eighth-1-${i}`}>
              {/* Note head */}
              <ellipse
                cx={x}
                cy="40"
                rx="9.5"
                ry="6.5"
                transform={`rotate(-20 ${x} 40)`}
                fill={noteFill}
              />
              {/* Stem */}
              <line x1={x + 8} y1="40" x2={x + 8} y2="5" stroke={staffStroke} strokeWidth="1.5" />
              {/* Accent on first note */}
              {i === 0 && (
                <text x={x - 5} y="0" fontSize="18" fontWeight="bold" fill={accentFill}>
                  &gt;
                </text>
              )}
            </g>
          );
        })}
        {/* Beam for first group */}
        <rect x="88" y="5" width="72" height="3" fill={noteFill} />

        {[3, 4, 5].map((i) => {
          const x = 80 + i * 40;
          return (
            <g key={`eighth-2-${i}`}>
              {/* Note head */}
              <ellipse
                cx={x}
                cy="40"
                rx="9.5"
                ry="6.5"
                transform={`rotate(-20 ${x} 40)`}
                fill={noteFill}
              />
              {/* Stem */}
              <line x1={x + 8} y1="40" x2={x + 8} y2="5" stroke={staffStroke} strokeWidth="1.5" />
              {/* Accent on fourth note */}
              {i === 3 && (
                <text x={x - 5} y="0" fontSize="18" fontWeight="bold" fill={accentFill}>
                  &gt;
                </text>
              )}
            </g>
          );
        })}
        {/* Beam for second group */}
        <rect x="208" y="5" width="72" height="3" fill={noteFill} />

        {/* Labels */}
        <text x="30" y="95" fontSize="14" fontWeight="bold" fill={blueFill}>
          6/8 - Wiegend
        </text>
        <text x="75" y="95" fontSize="13" fontWeight="bold" fill={noteFill}>EINS</text>
        <text x="110" y="95" fontSize="13" fill={noteFill}>zwei</text>
        <text x="148" y="95" fontSize="13" fill={noteFill}>drei</text>
        <text x="195" y="95" fontSize="13" fontWeight="bold" fill={noteFill}>VIER</text>
        <text x="230" y="95" fontSize="13" fill={noteFill}>fünf</text>
        <text x="270" y="95" fontSize="13" fill={noteFill}>sechs</text>
      </g>
    </svg>
  );
};
