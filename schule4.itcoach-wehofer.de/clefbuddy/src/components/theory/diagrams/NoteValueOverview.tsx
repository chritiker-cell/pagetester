export default function NoteValueOverview() {
  return (
    <svg
      viewBox="0 0 520 160"
      width="100%"
      className="mx-auto"
      role="img"
      aria-label="Notenwerte im Ueberblick"
    >
      <title>Notenwerte im Ueberblick</title>

      {/* Title */}
      <text
        x="260"
        y="20"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="14"
        fontWeight="600"
      >
        Notenwerte im Ueberblick
      </text>

      {/* Staff lines */}
      {[40, 55, 70, 85, 100].map((y) => (
        <line
          key={y}
          x1="20"
          y1={y}
          x2="500"
          y2={y}
          stroke="var(--svg-staff-line)"
          strokeWidth="1"
        />
      ))}

      {/* Whole Note (x=100, y=70) */}
      <ellipse
        cx="100"
        cy="70"
        rx="9.5"
        ry="6.5"
        transform="rotate(-20 100 70)"
        fill="none"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
      />
      <text
        x="100"
        y="130"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="12"
        fontWeight="500"
      >
        4 Schlaege
      </text>

      {/* Half Note (x=200, y=70) */}
      <ellipse
        cx="200"
        cy="70"
        rx="9.5"
        ry="6.5"
        transform="rotate(-20 200 70)"
        fill="none"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
      />
      {/* Stem up from right side */}
      <line
        x1="208"
        y1="70"
        x2="208"
        y2="35"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
      />
      <text
        x="200"
        y="130"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="12"
        fontWeight="500"
      >
        2 Schlaege
      </text>

      {/* Quarter Note (x=300, y=70) */}
      <ellipse
        cx="300"
        cy="70"
        rx="9.5"
        ry="6.5"
        transform="rotate(-20 300 70)"
        fill="var(--svg-notation-primary)"
        stroke="var(--svg-notation-primary)"
        strokeWidth="1"
      />
      {/* Stem up */}
      <line
        x1="308"
        y1="70"
        x2="308"
        y2="35"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
      />
      <text
        x="300"
        y="130"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="12"
        fontWeight="500"
      >
        1 Schlag
      </text>

      {/* Eighth Note (x=400, y=70) */}
      <ellipse
        cx="400"
        cy="70"
        rx="9.5"
        ry="6.5"
        transform="rotate(-20 400 70)"
        fill="var(--svg-notation-primary)"
        stroke="var(--svg-notation-primary)"
        strokeWidth="1"
      />
      {/* Stem up */}
      <line
        x1="408"
        y1="70"
        x2="408"
        y2="35"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
      />
      {/* Flag */}
      <path
        d="M 408 35 Q 420 38 418 45"
        fill="none"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="400"
        y="130"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="12"
        fontWeight="500"
      >
        ½ Schlag
      </text>
    </svg>
  );
}
