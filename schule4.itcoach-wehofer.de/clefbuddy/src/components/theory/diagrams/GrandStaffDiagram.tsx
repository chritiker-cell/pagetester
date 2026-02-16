export default function GrandStaffDiagram() {
  return (
    <svg viewBox="0 0 480 310" width="100%" className="max-w-lg">
      {/* Brace / Akkolade - improved rendering */}
      <path
        d="M 38 40 Q 30 80 32 155 Q 30 230 38 270"
        stroke="var(--svg-notation-primary)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 38 155 Q 26 155 26 155 Q 26 155 38 155"
        stroke="var(--svg-notation-primary)"
        strokeWidth="3"
        fill="none"
      />

      {/* Treble staff */}
      {[120, 100, 80, 60, 40].map((y, i) => (
        <line key={`t${i}`} x1="50" y1={y} x2="450" y2={y}
          stroke="var(--svg-staff-line)" strokeWidth="2" />
      ))}
      {/* Treble clef - positioned correctly */}
      <text x="60" y="98" fontSize="62" fill="var(--svg-notation-primary)" fontFamily="serif"
        style={{ fontStyle: 'italic' }}>
        𝄞
      </text>
      {/* "Rechte Hand" label */}
      <text x="460" y="82" fontSize="11" fontWeight="600" fill="var(--svg-notation-secondary)">
        Rechte
      </text>
      <text x="460" y="95" fontSize="11" fontWeight="600" fill="var(--svg-notation-secondary)">
        Hand
      </text>

      {/* Bass staff */}
      {[260, 240, 220, 200, 180].map((y, i) => (
        <line key={`b${i}`} x1="50" y1={y} x2="450" y2={y}
          stroke="var(--svg-staff-line)" strokeWidth="2" />
      ))}
      {/* Bass clef - positioned correctly */}
      <text x="60" y="226" fontSize="52" fill="var(--svg-notation-primary)" fontFamily="serif">
        𝄢
      </text>
      {/* "Linke Hand" label */}
      <text x="460" y="222" fontSize="11" fontWeight="600" fill="var(--svg-notation-secondary)">
        Linke
      </text>
      <text x="460" y="235" fontSize="11" fontWeight="600" fill="var(--svg-notation-secondary)">
        Hand
      </text>

      {/* Barlines at start and end */}
      <line x1="50" y1="40" x2="50" y2="260" stroke="var(--svg-staff-line)" strokeWidth="2.5" />
      <line x1="450" y1="40" x2="450" y2="260" stroke="var(--svg-staff-line)" strokeWidth="2.5" />

      {/* Middle C with improved note head and ledger line */}
      <line x1="228" y1="145" x2="272" y2="145"
        stroke="var(--svg-notation-primary)" strokeWidth="2.5" />
      <ellipse cx="250" cy="145" rx="11" ry="7.5"
        fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
        transform="rotate(-20 250 145)" />
      <text x="250" y="169" textAnchor="middle"
        fontSize="13" fontWeight="700" fill="var(--svg-notation-primary)">
        Mittleres C
      </text>

      {/* Bottom label */}
      <text x="250" y="296" textAnchor="middle" fontSize="12" fontWeight="500"
        fill="var(--svg-notation-secondary)">
        Klaviersystem (Grand Staff)
      </text>
    </svg>
  );
}
