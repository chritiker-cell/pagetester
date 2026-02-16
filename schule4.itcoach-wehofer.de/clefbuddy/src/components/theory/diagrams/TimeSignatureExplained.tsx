import React from 'react';

interface TimeSignatureExplainedProps {
  className?: string;
}

export const TimeSignatureExplained: React.FC<TimeSignatureExplainedProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 480 120"
      width="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Large time signature numbers */}
      <text
        x="100"
        y="55"
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
      >
        3
      </text>
      <text
        x="100"
        y="95"
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
      >
        4
      </text>

      {/* Arrow from top number (3) */}
      <line
        x1="130"
        y1="45"
        x2="200"
        y2="45"
        stroke="var(--svg-notation-secondary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-top)"
      />
      <text
        x="210"
        y="50"
        fontSize="16"
        fill="var(--svg-notation-primary)"
      >
        3 Schläge pro Takt
      </text>

      {/* Arrow from bottom number (4) */}
      <line
        x1="130"
        y1="85"
        x2="200"
        y2="85"
        stroke="var(--svg-notation-secondary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-bottom)"
      />
      <text
        x="210"
        y="90"
        fontSize="16"
        fill="var(--svg-notation-primary)"
      >
        Viertel bekommt einen Schlag
      </text>

      {/* Arrow markers */}
      <defs>
        <marker
          id="arrowhead-top"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="var(--svg-notation-secondary)" />
        </marker>
        <marker
          id="arrowhead-bottom"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="var(--svg-notation-secondary)" />
        </marker>
      </defs>
    </svg>
  );
};
