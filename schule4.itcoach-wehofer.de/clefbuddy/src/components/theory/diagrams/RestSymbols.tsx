export default function RestSymbols() {
  return (
    <svg
      viewBox="0 0 480 120"
      width="100%"
      className="mx-auto"
      role="img"
      aria-label="Pausenzeichen"
    >
      <title>Pausenzeichen</title>

      {/* Title */}
      <text
        x="240"
        y="20"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="14"
        fontWeight="600"
      >
        Pausenzeichen
      </text>

      {/* Whole Rest (x=80) - hanging below line */}
      <line
        x1="70"
        y1="50"
        x2="110"
        y2="50"
        stroke="var(--svg-staff-line)"
        strokeWidth="1"
      />
      <rect
        x="80"
        y="50"
        width="20"
        height="10"
        fill="var(--svg-notation-primary)"
      />
      <text
        x="90"
        y="90"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="12"
        fontWeight="500"
      >
        Ganze Pause
      </text>
      <text
        x="90"
        y="102"
        textAnchor="middle"
        fill="var(--svg-notation-secondary)"
        fontSize="12"
      >
        (4)
      </text>

      {/* Half Rest (x=180) - sitting on line */}
      <line
        x1="170"
        y1="60"
        x2="210"
        y2="60"
        stroke="var(--svg-staff-line)"
        strokeWidth="1"
      />
      <rect
        x="180"
        y="50"
        width="20"
        height="10"
        fill="var(--svg-notation-primary)"
      />
      <text
        x="190"
        y="90"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="12"
        fontWeight="500"
      >
        Halbe Pause
      </text>
      <text
        x="190"
        y="102"
        textAnchor="middle"
        fill="var(--svg-notation-secondary)"
        fontSize="12"
      >
        (2)
      </text>

      {/* Quarter Rest (x=280) - zigzag */}
      <path
        d="M 275 45 L 280 50 L 275 55 L 285 60 L 280 65"
        fill="none"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="280"
        y="90"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="12"
        fontWeight="500"
      >
        Viertelpause
      </text>
      <text
        x="280"
        y="102"
        textAnchor="middle"
        fill="var(--svg-notation-secondary)"
        fontSize="12"
      >
        (1)
      </text>

      {/* Eighth Rest (x=380) - dot with flag */}
      <circle
        cx="378"
        cy="55"
        r="2.5"
        fill="var(--svg-notation-primary)"
      />
      <path
        d="M 380 53 Q 388 50 386 58"
        fill="none"
        stroke="var(--svg-notation-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="380"
        y="90"
        textAnchor="middle"
        fill="var(--svg-notation-primary)"
        fontSize="12"
        fontWeight="500"
      >
        Achtelpause
      </text>
      <text
        x="380"
        y="102"
        textAnchor="middle"
        fill="var(--svg-notation-secondary)"
        fontSize="12"
      >
        (½)
      </text>
    </svg>
  );
}
