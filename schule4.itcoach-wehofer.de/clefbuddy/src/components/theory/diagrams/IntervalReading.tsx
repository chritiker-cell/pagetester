export function IntervalReading() {
  return (
    <svg viewBox="0 0 480 150" width="100%" className="max-w-2xl mx-auto">
      <title>Intervalle beim Blattspiel</title>

      {/* Staff lines */}
      <line x1="20" y1="50" x2="460" y2="50" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="65" x2="460" y2="65" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="80" x2="460" y2="80" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="95" x2="460" y2="95" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="110" x2="460" y2="110" stroke="var(--svg-staff-line)" strokeWidth="1" />

      {/* Ledger line for middle C */}
      <line x1="70" y1="125" x2="90" y2="125" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="375" y1="125" x2="395" y2="125" stroke="var(--svg-staff-line)" strokeWidth="1" />

      {/* Treble clef */}
      <text x="25" y="90" fontSize="48" fill="var(--svg-notation-primary)">𝄞</text>

      {/* Notes: C - D - F - G - C' */}
      {/* C note (middle C) */}
      <ellipse cx="80" cy="125" rx="9.5" ry="6.5" transform="rotate(-20 80 125)" fill="var(--svg-notation-primary)"  />
      <line x1="89.5" y1="125" x2="89.5" y2="85" stroke="var(--svg-notation-primary)" strokeWidth="2"  />

      {/* D note */}
      <ellipse cx="140" cy="117.5" rx="9.5" ry="6.5" transform="rotate(-20 140 117.5)" fill="var(--svg-notation-primary)"  />
      <line x1="149.5" y1="117.5" x2="149.5" y2="77.5" stroke="var(--svg-notation-primary)" strokeWidth="2"  />

      {/* F note */}
      <ellipse cx="220" cy="102.5" rx="9.5" ry="6.5" transform="rotate(-20 220 102.5)" fill="var(--svg-notation-primary)"  />
      <line x1="229.5" y1="102.5" x2="229.5" y2="62.5" stroke="var(--svg-notation-primary)" strokeWidth="2"  />

      {/* G note */}
      <ellipse cx="290" cy="95" rx="9.5" ry="6.5" transform="rotate(-20 290 95)" fill="var(--svg-notation-primary)"  />
      <line x1="299.5" y1="95" x2="299.5" y2="55" stroke="var(--svg-notation-primary)" strokeWidth="2"  />

      {/* C' note (higher C) */}
      <ellipse cx="385" cy="125" rx="9.5" ry="6.5" transform="rotate(-20 385 125)" fill="var(--svg-notation-primary)"  />
      <line x1="394.5" y1="125" x2="394.5" y2="85" stroke="var(--svg-notation-primary)" strokeWidth="2"  />

      {/* Arrow C→D: Schritt (small green) */}
      <defs>
        <marker id="arrowhead-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="var(--svg-notation-secondary)"  />
        </marker>
        <marker id="arrowhead-amber" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill="var(--svg-notation-secondary)"  />
        </marker>
        <marker id="arrowhead-red" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="var(--svg-notation-primary)"  />
        </marker>
      </defs>

      <line x1="95" y1="35" x2="125" y2="35" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowhead-green)"  />
      <text x="110" y="28" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--svg-notation-secondary)" >
        Schritt
      </text>

      {/* Arrow D→F: Sprung (medium amber) */}
      <line x1="155" y1="35" x2="205" y2="35" stroke="var(--svg-notation-secondary)" strokeWidth="2" markerEnd="url(#arrowhead-amber)"  />
      <text x="180" y="28" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--svg-notation-secondary)" >
        Sprung
      </text>

      {/* Arrow F→G: Schritt (small green) */}
      <line x1="235" y1="35" x2="275" y2="35" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowhead-green)"  />
      <text x="255" y="28" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--svg-notation-secondary)" >
        Schritt
      </text>

      {/* Arrow G→C': großer Sprung (large red) */}
      <line x1="305" y1="35" x2="370" y2="35" stroke="var(--svg-notation-secondary)" strokeWidth="2.5" markerEnd="url(#arrowhead-red)"  />
      <text x="337.5" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--svg-notation-primary)" >
        großer
      </text>
      <text x="337.5" y="37" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--svg-notation-primary)" >
        Sprung
      </text>
    </svg>
  );
}
