export default function BassClefStaff() {
  // Lines bottom to top: G2, H2, D3, F3, A3
  const lineNotes = [
    { y: 120, name: 'G' },
    { y: 95,  name: 'H' },
    { y: 70,  name: 'D' },
    { y: 45,  name: 'F' },
    { y: 20,  name: 'A' },
  ];
  // Spaces bottom to top: A2, C3, E3, G3
  const spaceNotes = [
    { y: 107.5,  name: 'A' },
    { y: 82.5,  name: 'C' },
    { y: 57.5,  name: 'E' },
    { y: 32.5,  name: 'G' },
  ];

  return (
    <svg viewBox="0 0 560 170" width="100%" className="max-w-2xl">
      {/* Title */}
      <text x="280" y="18" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--svg-notation-primary)">
        Bassschluessel (F-Schluessel)
      </text>

      {/* Staff lines */}
      {[120, 95, 70, 45, 20].map((y, i) => (
        <line key={i} x1="60" y1={y + 20} x2="520" y2={y + 20}
          stroke="var(--svg-staff-line)" strokeWidth="2" />
      ))}

      {/* Bass clef symbol - positioned so dots straddle 4th line (F) */}
      <text x="68" y="88" fontSize="60" fill="var(--svg-notation-primary)"
        fontFamily="serif">
        𝄢
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
