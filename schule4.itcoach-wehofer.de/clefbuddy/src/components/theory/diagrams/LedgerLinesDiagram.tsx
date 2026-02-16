export default function LedgerLinesDiagram() {
  return (
    <svg viewBox="0 0 420 160" width="100%" className="max-w-md">
      {/* Staff lines */}
      {[100, 80, 60, 40, 20].map((y, i) => (
        <line key={i} x1="50" y1={y + 25} x2="370" y2={y + 25}
          stroke="var(--svg-staff-line)" strokeWidth="2" />
      ))}

      {/* Treble clef */}
      <text x="58" y="82" fontSize="56" fill="var(--svg-notation-primary)" fontFamily="serif"
        style={{ fontStyle: 'italic' }}>
        𝄞
      </text>

      {/* Note below staff: Middle C (ledger line below) */}
      <g>
        <line x1="133" y1="135" x2="167" y2="135"
          stroke="var(--svg-staff-line)" strokeWidth="2" />
        <ellipse cx="150" cy="135" rx="9" ry="6.5"
          fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
          transform="rotate(-20 150 135)" />
        <text x="150" y="153" textAnchor="middle" fontSize="11" fontWeight="700"
          fill="var(--svg-notation-primary)">
          C
        </text>
      </g>

      {/* Note on staff: normal E (line 1) */}
      <g>
        <ellipse cx="210" cy="125" rx="9" ry="6.5"
          fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
          transform="rotate(-20 210 125)" />
        <text x="210" y="143" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="var(--svg-notation-secondary)">
          E
        </text>
      </g>

      {/* Note above staff: G5 (one ledger line above) */}
      <g>
        <line x1="253" y1="15" x2="287" y2="15"
          stroke="var(--svg-staff-line)" strokeWidth="2" />
        <ellipse cx="270" cy="15" rx="9" ry="6.5"
          fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
          transform="rotate(-20 270 15)" />
        <text x="270" y="6" textAnchor="middle" fontSize="11" fontWeight="700"
          fill="var(--svg-notation-primary)">
          G
        </text>
      </g>

      {/* Note: A5 (space above ledger line) */}
      <g>
        <line x1="303" y1="15" x2="337" y2="15"
          stroke="var(--svg-staff-line)" strokeWidth="2" />
        <ellipse cx="320" cy="8" rx="9" ry="6.5"
          fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
          transform="rotate(-20 320 8)" />
        <text x="320" y="-1" textAnchor="middle" fontSize="11" fontWeight="700"
          fill="var(--svg-notation-primary)">
          A
        </text>
      </g>

      {/* Label */}
      <text x="210" y="152" textAnchor="middle" fontSize="11" fontWeight="500"
        fill="var(--svg-notation-secondary)">
        Hilfslinien erweitern das System
      </text>
    </svg>
  );
}
