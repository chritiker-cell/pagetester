import React from 'react';

interface DynamicLevelsProps {
  className?: string;
}

export const DynamicLevels: React.FC<DynamicLevelsProps> = ({ className = '' }) => {
  const levels = [
    { label: 'pp', name: 'pianissimo', height: 15 },
    { label: 'p', name: 'piano', height: 25 },
    { label: 'mp', name: 'mezzopiano', height: 35 },
    { label: 'mf', name: 'mezzoforte', height: 45 },
    { label: 'f', name: 'forte', height: 55 },
    { label: 'ff', name: 'fortissimo', height: 65 },
  ];

  const barWidth = 50;
  const spacing = 80;
  const startX = 40;

  return (
    <svg
      viewBox="0 0 480 130"
      width="100%"
      className={`${className}`}
      role="img"
      aria-label="Dynamikstufen von pianissimo bis fortissimo"
    >
      {/* Bars */}
      {levels.map((level, i) => (
        <g key={i}>
          {/* Bar */}
          <rect
            x={startX + i * spacing}
            y={80 - level.height}
            width={barWidth}
            height={level.height}
            fill="var(--svg-notation-primary)"
            rx="2"
          />
          {/* Dynamic label */}
          <text
            x={startX + i * spacing + barWidth / 2}
            y="95"
            textAnchor="middle"
            fill="var(--svg-notation-primary)"
            fontWeight="700"
            fontSize="18"
          >
            {level.label}
          </text>
          {/* Full name */}
          <text
            x={startX + i * spacing + barWidth / 2}
            y="110"
            textAnchor="middle"
            fill="var(--svg-notation-secondary)"
            fontSize="11"
          >
            {level.name}
          </text>
        </g>
      ))}

      {/* Arrow at bottom */}
      <defs>
        <marker
          id="arrowhead-dynamic"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--svg-notation-primary)"
          />
        </marker>
      </defs>
      <line
        x1="30"
        y1="122"
        x2="450"
        y2="122"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-dynamic)"
      />
      <text
        x="240"
        y="118"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontStyle="italic"
        fontSize="12"
      >
        leise → laut
      </text>
    </svg>
  );
};
