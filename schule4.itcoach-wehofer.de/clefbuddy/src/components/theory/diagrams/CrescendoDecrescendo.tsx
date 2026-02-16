import React from 'react';

interface CrescendoDecrescendoProps {
  className?: string;
}

export const CrescendoDecrescendo: React.FC<CrescendoDecrescendoProps> = ({ className = '' }) => {
  const staffY = 30;
  const staffHeight = 40;
  const noteSpacing = 60;
  const startX = 40;

  // Staff lines
  const staffLines = [0, 10, 20, 30, 40];

  // 8 quarter notes on middle line
  const notes = Array.from({ length: 8 }, (_, i) => ({
    x: startX + i * noteSpacing,
    y: staffY + 20, // middle line
    color: i < 4 ? (i === 0 ? '#86efac' : i === 3 ? '#dc2626' : '#16a34a') :
                   (i === 4 ? '#dc2626' : i === 7 ? '#86efac' : '#16a34a'),
  }));

  return (
    <svg
      viewBox="0 0 500 140"
      width="100%"
      className={`${className}`}
      role="img"
      aria-label="Crescendo und Decrescendo Hairpins"
    >
      {/* Staff lines */}
      {staffLines.map((offset, i) => (
        <line
          key={i}
          x1="20"
          y1={staffY + offset}
          x2="480"
          y2={staffY + offset}
          stroke="var(--svg-staff-line)"
          strokeWidth="1"
        />
      ))}

      {/* Quarter notes */}
      {notes.map((note, i) => (
        <g key={i}>
          {/* Note head */}
          <ellipse
            cx={note.x}
            cy={note.y}
            rx="5"
            ry="4"
            fill={note.color}
            transform={`rotate(-20 ${note.x} ${note.y})`}
          />
          {/* Stem */}
          <line
            x1={note.x + 4.5}
            y1={note.y}
            x2={note.x + 4.5}
            y2={note.y - 25}
            stroke={note.color}
            strokeWidth="1.5"
          />
        </g>
      ))}

      {/* Dynamic markings */}
      <text
        x={startX - 15}
        y={staffY + staffHeight + 30}
        fill="var(--svg-notation-primary)" fontFamily="serif" fontStyle="italic"
        fontSize="16"
      >
        p
      </text>
      <text
        x={startX + 3.5 * noteSpacing}
        y={staffY + staffHeight + 30}
        fill="var(--svg-notation-primary)" fontFamily="serif" fontStyle="italic"
        fontSize="16"
      >
        f
      </text>
      <text
        x={startX + 7 * noteSpacing + 10}
        y={staffY + staffHeight + 30}
        fill="var(--svg-notation-primary)" fontFamily="serif" fontStyle="italic"
        fontSize="16"
      >
        p
      </text>

      {/* Crescendo hairpin (first 4 notes) */}
      <path
        d={`M ${startX} ${staffY + staffHeight + 15} L ${startX + 3 * noteSpacing} ${staffY + staffHeight + 10}`}
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d={`M ${startX} ${staffY + staffHeight + 15} L ${startX + 3 * noteSpacing} ${staffY + staffHeight + 20}`}
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
        fill="none"
      />

      {/* Decrescendo hairpin (last 4 notes) */}
      <path
        d={`M ${startX + 4 * noteSpacing} ${staffY + staffHeight + 10} L ${startX + 7 * noteSpacing} ${staffY + staffHeight + 15}`}
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d={`M ${startX + 4 * noteSpacing} ${staffY + staffHeight + 20} L ${startX + 7 * noteSpacing} ${staffY + staffHeight + 15}`}
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
        fill="none"
      />

      {/* Labels */}
      <text
        x={startX + 1.5 * noteSpacing}
        y={staffY + staffHeight + 50}
        textAnchor="middle"
        fill="var(--svg-notation-primary)" fontWeight="500"
        fontSize="13"
      >
        crescendo (lauter)
      </text>
      <text
        x={startX + 5.5 * noteSpacing}
        y={staffY + staffHeight + 50}
        textAnchor="middle"
        fill="var(--svg-notation-primary)" fontWeight="500"
        fontSize="13"
      >
        decrescendo (leiser)
      </text>
    </svg>
  );
};
