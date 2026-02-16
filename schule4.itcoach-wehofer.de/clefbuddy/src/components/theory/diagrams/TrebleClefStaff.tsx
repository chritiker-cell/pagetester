export default function TrebleClefStaff() {
  // Lines bottom to top: E4, G4, H4, D5, F5
  const lineNotes = [
    { y: 120, name: 'E' },
    { y: 95,  name: 'G' },
    { y: 70,  name: 'H' },
    { y: 45,  name: 'D' },
    { y: 20,  name: 'F' },
  ];
  // Spaces bottom to top: F4, A4, C5, E5
  const spaceNotes = [
    { y: 107.5,  name: 'F' },
    { y: 82.5,  name: 'A' },
    { y: 57.5,  name: 'C' },
    { y: 32.5,  name: 'E' },
  ];

  return (
    <svg viewBox="0 0 560 170" width="100%" className="max-w-2xl">
      {/* Title */}
      <text x="280" y="18" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--svg-notation-primary)">
        Violinschluessel (G-Schluessel)
      </text>

      {/* Staff lines */}
      {[120, 95, 70, 45, 20].map((y, i) => (
        <line key={i} x1="60" y1={y + 20} x2="520" y2={y + 20}
          stroke="var(--svg-staff-line)" strokeWidth="2" />
      ))}

      {/* Treble clef symbol - positioned so spiral wraps around 2nd line (G) */}
      <text x="70" y="120" fontSize="72" fill="var(--svg-notation-primary)"
        fontFamily="serif" style={{ fontStyle: 'italic' }}>
        𝄞
      </text>

      {/* Line notes with improved note heads */}
      {lineNotes.map((n, i) => {
        const cx = 170 + i * 48;
        const cy = n.y + 20;
        return (
          <g key={`ln${i}`}>
            <ellipse cx={cx} cy={cy} rx="9.5" ry="6.5"
              fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
              transform={`rotate(-20 ${cx} ${cy})`} />
            <text x={cx} y={cy + 22} textAnchor="middle"
              fontSize="13" fontWeight="700" fill="var(--svg-notation-primary)">
              {n.name}
            </text>
          </g>
        );
      })}

      {/* Space notes with improved note heads */}
      {spaceNotes.map((n, i) => {
        const cx = 390 + i * 35;
        const cy = n.y + 20;
        return (
          <g key={`sn${i}`}>
            <ellipse cx={cx} cy={cy} rx="9.5" ry="6.5"
              fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
              transform={`rotate(-20 ${cx} ${cy})`} />
            <text x={cx} y={cy + 22} textAnchor="middle"
              fontSize="13" fontWeight="700" fill="var(--svg-notation-primary)">
              {n.name}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(160, 158)">
        <ellipse cx="0" cy="-4" rx="5.5" ry="3.5" fill="var(--svg-notation-primary)"
          transform="rotate(-20 0 -4)" />
        <text x="10" y="0" fontSize="11" fontWeight="600"
          fill="var(--svg-notation-secondary)">
          Linien
        </text>
        <ellipse cx="90" cy="-4" rx="5.5" ry="3.5" fill="var(--svg-notation-primary)"
          transform="rotate(-20 90 -4)" />
        <text x="100" y="0" fontSize="11" fontWeight="600"
          fill="var(--svg-notation-secondary)">
          Zwischenraeume
        </text>
      </g>
    </svg>
  );
}
