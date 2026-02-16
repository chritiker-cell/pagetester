export default function KeySignatures() {
  // Each mini-staff: 5 lines, spacing 10px
  const staffLineOffsets = [0, 10, 20, 30, 40];
  const staffY = 35; // Base Y position for all staffs

  return (
    <svg viewBox="0 0 560 130" width="100%" className="max-w-3xl">
      {/* Title */}
      <text x="280" y="18" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--svg-notation-primary)">
        Generalvorzeichen (Tonarten)
      </text>

      {/* Staff 1: C-Dur (no accidentals) */}
      <g>
        {/* Staff lines */}
        {staffLineOffsets.map((offset, i) => (
          <line key={i} x1="10" y1={staffY + offset} x2="100" y2={staffY + offset}
            stroke="var(--svg-staff-line)" strokeWidth="1" />
        ))}
        {/* Treble clef */}
        <text x="15" y={staffY + 35} fontSize="40" fill="var(--svg-notation-primary)"
          fontFamily="serif" style={{ fontStyle: 'italic' }}>
          𝄞
        </text>
        {/* Label */}
        <text x="55" y="108" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="var(--svg-notation-primary)">
          C-Dur
        </text>
      </g>

      {/* Staff 2: G-Dur (1 sharp on F line) */}
      <g>
        {/* Staff lines */}
        {staffLineOffsets.map((offset, i) => (
          <line key={i} x1="115" y1={staffY + offset} x2="205" y2={staffY + offset}
            stroke="var(--svg-staff-line)" strokeWidth="1" />
        ))}
        {/* Treble clef */}
        <text x="120" y={staffY + 35} fontSize="40" fill="var(--svg-notation-primary)"
          fontFamily="serif" style={{ fontStyle: 'italic' }}>
          𝄞
        </text>
        {/* Sharp on F line (top line, y=0) */}
        <text x="158" y={staffY + 5} textAnchor="middle" fontSize="18" fontWeight="700"
          fill="var(--svg-notation-primary)">
          ♯
        </text>
        {/* Label */}
        <text x="160" y="108" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="var(--svg-notation-primary)">
          G-Dur (1♯)
        </text>
      </g>

      {/* Staff 3: D-Dur (2 sharps: F and C) */}
      <g>
        {/* Staff lines */}
        {staffLineOffsets.map((offset, i) => (
          <line key={i} x1="220" y1={staffY + offset} x2="310" y2={staffY + offset}
            stroke="var(--svg-staff-line)" strokeWidth="1" />
        ))}
        {/* Treble clef */}
        <text x="225" y={staffY + 35} fontSize="40" fill="var(--svg-notation-primary)"
          fontFamily="serif" style={{ fontStyle: 'italic' }}>
          𝄞
        </text>
        {/* Sharp on F line (top line, y=0) */}
        <text x="263" y={staffY + 5} textAnchor="middle" fontSize="18" fontWeight="700"
          fill="var(--svg-notation-primary)">
          ♯
        </text>
        {/* Sharp on C (third space, y=15) */}
        <text x="278" y={staffY + 20} textAnchor="middle" fontSize="18" fontWeight="700"
          fill="var(--svg-notation-primary)">
          ♯
        </text>
        {/* Label */}
        <text x="265" y="108" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="var(--svg-notation-primary)">
          D-Dur (2♯)
        </text>
      </g>

      {/* Staff 4: F-Dur (1 flat on B line) */}
      <g>
        {/* Staff lines */}
        {staffLineOffsets.map((offset, i) => (
          <line key={i} x1="325" y1={staffY + offset} x2="415" y2={staffY + offset}
            stroke="var(--svg-staff-line)" strokeWidth="1" />
        ))}
        {/* Treble clef */}
        <text x="330" y={staffY + 35} fontSize="40" fill="var(--svg-notation-primary)"
          fontFamily="serif" style={{ fontStyle: 'italic' }}>
          𝄞
        </text>
        {/* Flat on B line (3rd line, y=20) */}
        <text x="370" y={staffY + 25} textAnchor="middle" fontSize="18" fontWeight="700"
          fill="var(--svg-notation-primary)">
          ♭
        </text>
        {/* Label */}
        <text x="370" y="108" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="var(--svg-notation-primary)">
          F-Dur (1♭)
        </text>
      </g>

      {/* Staff 5: B-Dur (2 flats: B and E) */}
      <g>
        {/* Staff lines */}
        {staffLineOffsets.map((offset, i) => (
          <line key={i} x1="430" y1={staffY + offset} x2="520" y2={staffY + offset}
            stroke="var(--svg-staff-line)" strokeWidth="1" />
        ))}
        {/* Treble clef */}
        <text x="435" y={staffY + 35} fontSize="40" fill="var(--svg-notation-primary)"
          fontFamily="serif" style={{ fontStyle: 'italic' }}>
          𝄞
        </text>
        {/* Flat on B line (3rd line, y=20) */}
        <text x="473" y={staffY + 25} textAnchor="middle" fontSize="18" fontWeight="700"
          fill="var(--svg-notation-primary)">
          ♭
        </text>
        {/* Flat on E (4th space, y=5) */}
        <text x="488" y={staffY + 10} textAnchor="middle" fontSize="18" fontWeight="700"
          fill="var(--svg-notation-primary)">
          ♭
        </text>
        {/* Label */}
        <text x="475" y="108" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="var(--svg-notation-primary)">
          B-Dur (2♭)
        </text>
      </g>
    </svg>
  );
}
