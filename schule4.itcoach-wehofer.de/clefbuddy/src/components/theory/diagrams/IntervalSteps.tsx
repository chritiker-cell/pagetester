export function IntervalSteps() {
  return (
    <svg viewBox="0 0 520 150" width="100%" className="max-w-2xl mx-auto">
      <title>Intervalle erkennen</title>

      {/* Title */}
      <text x="260" y="20" textAnchor="middle" fontSize="16" fontWeight="bold" fill="var(--svg-notation-primary)">
        Intervalle erkennen
      </text>

      {/* Staff lines */}
      <line x1="20" y1="30" x2="500" y2="30" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="45" x2="500" y2="45" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="60" x2="500" y2="60" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="75" x2="500" y2="75" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="90" x2="500" y2="90" stroke="var(--svg-staff-line)" strokeWidth="1" />

      {/* Ledger line for middle C */}
      <line x1="50" y1="105" x2="190" y2="105" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="210" y1="105" x2="350" y2="105" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="370" y1="105" x2="510" y2="105" stroke="var(--svg-staff-line)" strokeWidth="1" />

      {/* Treble clef */}
      <text x="25" y="70" fontSize="48" fill="var(--svg-notation-primary)">𝄞</text>

      {/* Sekunde (C→D) */}
      {/* C note */}
      <ellipse cx="80" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 80 105)" fill="var(--svg-notation-primary)"  />
      {/* D note */}
      <ellipse cx="140" cy="97.5" rx="9.5" ry="6.5" transform="rotate(-20 140 97.5)" fill="var(--svg-notation-primary)"  />
      {/* Steps */}
      <circle cx="110" cy="101.25" r="2" fill="var(--svg-notation-secondary)" opacity="0.5"  />
      {/* Bracket */}
      <path d="M 75 120 L 75 125 L 145 125 L 145 120" stroke="var(--svg-notation-secondary)" strokeWidth="1.5" fill="none"  />
      <text x="110" y="140" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--svg-notation-primary)" >
        Sekunde (2)
      </text>

      {/* Terz (C→E) */}
      {/* C note */}
      <ellipse cx="240" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 240 105)" fill="var(--svg-notation-primary)"  />
      {/* E note */}
      <ellipse cx="300" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 300 90)" fill="var(--svg-notation-primary)"  />
      {/* Steps */}
      <circle cx="255" cy="101.25" r="2" fill="var(--svg-notation-secondary)" opacity="0.5"  />
      <circle cx="270" cy="97.5" r="2" fill="var(--svg-notation-secondary)" opacity="0.5"  />
      <circle cx="285" cy="93.75" r="2" fill="var(--svg-notation-secondary)" opacity="0.5"  />
      {/* Bracket */}
      <path d="M 235 120 L 235 125 L 305 125 L 305 120" stroke="var(--svg-notation-secondary)" strokeWidth="1.5" fill="none"  />
      <text x="270" y="140" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--svg-notation-primary)" >
        Terz (3)
      </text>

      {/* Quinte (C→G) */}
      {/* C note */}
      <ellipse cx="400" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 400 105)" fill="var(--svg-notation-primary)"  />
      {/* G note */}
      <ellipse cx="460" cy="75" rx="9.5" ry="6.5" transform="rotate(-20 460 75)" fill="var(--svg-notation-primary)"  />
      {/* Steps */}
      <circle cx="412" cy="99.375" r="2" fill="var(--svg-notation-secondary)" opacity="0.5"  />
      <circle cx="424" cy="93.75" r="2" fill="var(--svg-notation-secondary)" opacity="0.5"  />
      <circle cx="436" cy="88.125" r="2" fill="var(--svg-notation-secondary)" opacity="0.5"  />
      <circle cx="448" cy="82.5" r="2" fill="var(--svg-notation-secondary)" opacity="0.5"  />
      {/* Bracket */}
      <path d="M 395 120 L 395 125 L 465 125 L 465 120" stroke="var(--svg-notation-secondary)" strokeWidth="1.5" fill="none"  />
      <text x="430" y="140" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--svg-notation-primary)" >
        Quinte (5)
      </text>
    </svg>
  );
}
