import React from 'react';

export const ArpeggioDirections: React.FC = () => {
  return (
    <svg viewBox="0 0 500 130" width="100%">
      {/* Title */}
      <text x="250" y="20" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="16" fontWeight="600">
        Arpeggio-Richtungen
      </text>

      {/* Aufwaerts (Ascending) */}
      <g>
        <text x="80" y="45" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          Aufwärts
        </text>

        {/* Notes */}
        <circle cx="50" cy="90" r="12" fill="var(--svg-notation-primary)" />
        <text x="50" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">C</text>

        <circle cx="80" cy="75" r="12" fill="var(--svg-notation-primary)" />
        <text x="80" y="80" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">E</text>

        <circle cx="110" cy="60" r="12" fill="var(--svg-notation-primary)" />
        <text x="110" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">G</text>

        <circle cx="140" cy="45" r="12" fill="var(--svg-notation-primary)" />
        <text x="140" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">C'</text>

        {/* Arrow */}
        <line x1="62" y1="85" x2="128" y2="50" strokeWidth="2" stroke="var(--svg-notation-primary)" markerEnd="url(#arrowGreen)" />

        {/* Label */}
        <text x="95" y="120" textAnchor="middle" fill="var(--svg-notation-secondary)" fontSize="12">
          C → E → G → C'
        </text>
      </g>

      {/* Abwaerts (Descending) */}
      <g>
        <text x="250" y="45" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          Abwärts
        </text>

        {/* Notes */}
        <circle cx="220" cy="45" r="12" fill="var(--svg-notation-primary)" />
        <text x="220" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">C'</text>

        <circle cx="250" cy="60" r="12" fill="var(--svg-notation-primary)" />
        <text x="250" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">G</text>

        <circle cx="280" cy="75" r="12" fill="var(--svg-notation-primary)" />
        <text x="280" y="80" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">E</text>

        <circle cx="310" cy="90" r="12" fill="var(--svg-notation-primary)" />
        <text x="310" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">C</text>

        {/* Arrow */}
        <line x1="232" y1="50" x2="298" y2="85" strokeWidth="2" stroke="var(--svg-notation-primary)" markerEnd="url(#arrowBlue)" />

        {/* Label */}
        <text x="265" y="120" textAnchor="middle" fill="var(--svg-notation-secondary)" fontSize="12">
          C' → G → E → C
        </text>
      </g>

      {/* Alberti */}
      <g>
        <text x="415" y="45" textAnchor="middle" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="600">
          Alberti-Bass
        </text>

        {/* Notes */}
        <circle cx="370" cy="90" r="12" fill="var(--svg-notation-primary)" />
        <text x="370" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">C</text>

        <circle cx="410" cy="60" r="12" fill="var(--svg-notation-primary)" />
        <text x="410" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">G</text>

        <circle cx="450" cy="75" r="12" fill="var(--svg-notation-primary)" />
        <text x="450" y="80" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">E</text>

        <circle cx="420" cy="85" r="12" fill="var(--svg-notation-primary)" />
        <text x="420" y="90" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">G</text>

        {/* Looping arrow path */}
        <path d="M 382 85 Q 410 50 448 70" strokeWidth="2" stroke="var(--svg-notation-primary)" fill="none" markerEnd="url(#arrowBlue2)" />
        <path d="M 445 80 Q 425 95 382 92" strokeWidth="2" stroke="var(--svg-notation-primary)" fill="none" />

        {/* Label */}
        <text x="410" y="120" textAnchor="middle" fill="var(--svg-notation-secondary)" fontSize="12">
          C → G → E → G
        </text>
      </g>

      {/* Arrow markers */}
      <defs>
        <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="var(--svg-notation-primary)" />
        </marker>
        <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="var(--svg-notation-primary)" />
        </marker>
        <marker id="arrowBlue2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="var(--svg-notation-primary)" />
        </marker>
      </defs>
    </svg>
  );
};
