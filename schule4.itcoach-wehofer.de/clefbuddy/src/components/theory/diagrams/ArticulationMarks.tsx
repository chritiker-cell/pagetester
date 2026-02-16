import React from 'react';

interface ArticulationMarksProps {
  className?: string;
}

export const ArticulationMarks: React.FC<ArticulationMarksProps> = ({ className = '' }) => {
  const staffY1 = 20; // Top staff (staccato)
  const staffY2 = 110; // Bottom staff (legato)
  const staffHeight = 40;
  const noteSpacing = 80;
  const startX = 60;

  // Staff lines
  const staffLines = [0, 10, 20, 30, 40];

  // 4 notes for each example
  const notePositions = [
    { x: startX, lineOffset: 20 }, // C (middle line)
    { x: startX + noteSpacing, lineOffset: 10 }, // E (second space)
    { x: startX + 2 * noteSpacing, lineOffset: 0 }, // G (top line)
    { x: startX + 3 * noteSpacing, lineOffset: 10 }, // E (second space)
  ];

  return (
    <svg
      viewBox="0 0 480 200"
      width="100%"
      className={`${className}`}
      role="img"
      aria-label="Staccato und Legato Artikulation"
    >
      {/* Top staff - Staccato */}
      {staffLines.map((offset, i) => (
        <line
          key={`staff1-${i}`}
          x1="20"
          y1={staffY1 + offset}
          x2="420"
          y2={staffY1 + offset}
          stroke="var(--svg-staff-line)"
          strokeWidth="1"
        />
      ))}

      {/* Staccato notes with dots */}
      {notePositions.map((note, i) => (
        <g key={`staccato-${i}`}>
          {/* Note head */}
          <ellipse
            cx={note.x}
            cy={staffY1 + note.lineOffset}
            rx="5"
            ry="4"
            fill="var(--svg-notation-primary)"
            transform={`rotate(-20 ${note.x} ${staffY1 + note.lineOffset})`}
          />
          {/* Stem */}
          <line
            x1={note.x + 4.5}
            y1={staffY1 + note.lineOffset}
            x2={note.x + 4.5}
            y2={staffY1 + note.lineOffset - 25}
            stroke="#f97316"
            strokeWidth="1.5"
          />
          {/* Staccato dot */}
          <circle
            cx={note.x}
            cy={staffY1 + note.lineOffset - 32}
            r="2"
            fill="var(--svg-notation-primary)"
          />
        </g>
      ))}

      {/* Staccato label */}
      <text
        x="240"
        y={staffY1 + staffHeight + 25}
        textAnchor="middle"
        fill="var(--svg-notation-primary)" fontWeight="600"
        fontSize="14"
      >
        Staccato (kurz, getrennt)
      </text>

      {/* Bottom staff - Legato */}
      {staffLines.map((offset, i) => (
        <line
          key={`staff2-${i}`}
          x1="20"
          y1={staffY2 + offset}
          x2="420"
          y2={staffY2 + offset}
          stroke="var(--svg-staff-line)"
          strokeWidth="1"
        />
      ))}

      {/* Legato notes */}
      {notePositions.map((note, i) => (
        <g key={`legato-${i}`}>
          {/* Note head */}
          <ellipse
            cx={note.x}
            cy={staffY2 + note.lineOffset}
            rx="5"
            ry="4"
            fill="var(--svg-notation-primary)"
            transform={`rotate(-20 ${note.x} ${staffY2 + note.lineOffset})`}
          />
          {/* Stem */}
          <line
            x1={note.x + 4.5}
            y1={staffY2 + note.lineOffset}
            x2={note.x + 4.5}
            y2={staffY2 + note.lineOffset - 25}
            stroke="var(--svg-notation-secondary)"
            strokeWidth="1.5"
          />
        </g>
      ))}

      {/* Slur/arc for legato */}
      <path
        d={`M ${startX} ${staffY2 - 15} Q ${startX + 1.5 * noteSpacing} ${staffY2 - 30}, ${startX + 3 * noteSpacing} ${staffY2 - 15}`}
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
        fill="none"
      />

      {/* Legato label */}
      <text
        x="240"
        y={staffY2 + staffHeight + 25}
        textAnchor="middle"
        fill="var(--svg-notation-primary)" fontWeight="600"
        fontSize="14"
      >
        Legato (weich verbunden)
      </text>
    </svg>
  );
};
