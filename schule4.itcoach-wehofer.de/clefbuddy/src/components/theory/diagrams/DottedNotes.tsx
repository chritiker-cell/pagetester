export default function DottedNotes() {
  return (
    <svg
      viewBox="0 0 480 130"
      width="100%"
      className="mx-auto"
      role="img"
      aria-label="Punktierte Noten"
    >
      <title>Punktierte Noten</title>

      {/* Left side - Normal half note */}
      <g>
        {/* Staff lines */}
        {[40, 52, 64, 76, 88].map((y) => (
          <line
            key={`left-${y}`}
            x1="50"
            y1={y}
            x2="150"
            y2={y}
            stroke="var(--svg-staff-line)"
            strokeWidth="1"
          />
        ))}

        {/* Half note */}
        <ellipse
          cx="100"
          cy="64"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 100 64)"
          fill="none"
          stroke="var(--svg-notation-primary)"
          strokeWidth="2"
        />
        <line
          x1="108"
          y1="64"
          x2="108"
          y2="32"
          stroke="var(--svg-notation-primary)"
          strokeWidth="2"
        />

        <text
          x="100"
          y="110"
          textAnchor="middle"
          fill="var(--svg-notation-primary)"
          fontSize="12"
          fontWeight="500"
        >
          = 2 Schlaege
        </text>
      </g>

      {/* Middle - Plus/Arrow indicator */}
      <text
        x="240"
        y="50"
        textAnchor="middle"
        fill="var(--svg-notation-secondary)"
        fontSize="14"
        fontWeight="600"
      >
        Punkt =
      </text>
      <text
        x="240"
        y="68"
        textAnchor="middle"
        fill="var(--svg-notation-secondary)"
        fontSize="14"
        fontWeight="600"
      >
        +50%
      </text>
      <path
        d="M 170 64 L 210 64"
        fill="none"
        stroke="var(--svg-notation-secondary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--svg-notation-secondary)"
          />
        </marker>
      </defs>

      {/* Right side - Dotted half note */}
      <g>
        {/* Staff lines */}
        {[40, 52, 64, 76, 88].map((y) => (
          <line
            key={`right-${y}`}
            x1="270"
            y1={y}
            x2="430"
            y2={y}
            stroke="var(--svg-staff-line)"
            strokeWidth="1"
          />
        ))}

        {/* Dotted half note */}
        <ellipse
          cx="340"
          cy="64"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 340 64)"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="2"
        />
        <line
          x1="348"
          y1="64"
          x2="348"
          y2="32"
          stroke="#7c3aed"
          strokeWidth="2"
        />
        {/* Dot */}
        <circle
          cx="358"
          cy="64"
          r="3"
          fill="var(--svg-notation-primary)"
        />

        <text
          x="340"
          y="110"
          textAnchor="middle"
          fill="var(--svg-notation-primary)"
          fontSize="12"
          fontWeight="500"
        >
          = 3 Schlaege
        </text>
      </g>
    </svg>
  );
}
