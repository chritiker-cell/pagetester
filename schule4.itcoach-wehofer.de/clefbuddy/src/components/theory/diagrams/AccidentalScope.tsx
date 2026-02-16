export default function AccidentalScope() {
  // Staff lines at y: 30, 45, 60, 75, 90 (spacing: 15px)
  const staffLines = [30, 45, 60, 75, 90];

  return (
    <svg viewBox="0 0 520 140" width="100%" className="max-w-3xl">
      {/* Title */}
      <text x="260" y="18" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--svg-notation-primary)">
        Geltungsbereich von Vorzeichen
      </text>

      {/* Staff lines */}
      {staffLines.map((y, i) => (
        <line key={i} x1="40" y1={y} x2="480" y2={y}
          stroke="var(--svg-staff-line)" strokeWidth="2" />
      ))}

      {/* Treble clef */}
      <text x="45" y="75" fontSize="52" fill="var(--svg-notation-primary)"
        fontFamily="serif" style={{ fontStyle: 'italic' }}>
        𝄞
      </text>

      {/* Bar lines */}
      <line x1="100" y1="30" x2="100" y2="90" stroke="var(--svg-staff-line)" strokeWidth="2.5" />
      <line x1="270" y1="30" x2="270" y2="90" stroke="var(--svg-staff-line)" strokeWidth="1.5" />
      <line x1="480" y1="30" x2="480" y2="90" stroke="var(--svg-staff-line)" strokeWidth="2.5" />

      {/* Key signature area (sharp on F line) */}
      <text x="115" y="35" textAnchor="middle" fontSize="20" fontWeight="700"
        fill="var(--svg-notation-primary)">
        ♯
      </text>

      {/* Arrow/bracket showing scope for key signature */}
      <path d="M 115 100 L 115 110 L 350 110" stroke="var(--svg-notation-primary)" strokeWidth="2"
        fill="none" markerEnd="url(#arrowBlue)" />
      <text x="230" y="128" textAnchor="middle" fontSize="11" fontWeight="600"
        fill="var(--svg-notation-primary)">
        gilt fuer ganzes Stueck
      </text>

      {/* Accidental before note in measure */}
      <text x="300" y="65" textAnchor="middle" fontSize="20" fontWeight="700"
        fill="var(--svg-notation-primary)">
        ♯
      </text>
      {/* Note */}
      <ellipse cx="325" cy="60" rx="9.5" ry="6.5"
        fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
        transform="rotate(-20 325 60)" />

      {/* Bracket showing scope for single accidental */}
      <path d="M 300 18 L 300 8 L 470 8 L 470 18" stroke="var(--svg-notation-primary)" strokeWidth="2"
        fill="none" />
      <text x="385" y="5" textAnchor="middle" fontSize="11" fontWeight="600"
        fill="var(--svg-notation-primary)">
        gilt nur fuer diesen Takt
      </text>

      {/* Arrow marker definition */}
      <defs>
        <marker id="arrowBlue" markerWidth="10" markerHeight="10"
          refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="var(--svg-notation-primary)" />
        </marker>
      </defs>
    </svg>
  );
}
