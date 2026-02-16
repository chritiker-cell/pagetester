export default function AccidentalSymbols() {
  // Staff lines at y: 30, 45, 60, 75, 90 (spacing: 15px)
  const staffLines = [30, 45, 60, 75, 90];

  // Three notes on middle line (y=60), each with different accidental
  const notes = [
    { x: 150, accidental: '♯', label: 'Kreuz (♯) erhoeht' },
    { x: 280, accidental: '♭', label: 'Be (♭) erniedrigt' },
    { x: 410, accidental: '♮', label: 'Aufloesung (♮) stellt her' },
  ];

  return (
    <svg viewBox="0 0 520 140" width="100%" className="max-w-3xl">
      {/* Title */}
      <text x="260" y="18" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--svg-notation-primary)">
        Die drei Vorzeichen
      </text>

      {/* Staff lines */}
      {staffLines.map((y, i) => (
        <line key={i} x1="80" y1={y} x2="480" y2={y}
          stroke="var(--svg-staff-line)" strokeWidth="2" />
      ))}

      {/* Notes with accidentals */}
      {notes.map((note, i) => {
        const accidentalX = note.x - 25;
        const noteY = 60;
        return (
          <g key={i}>
            {/* Accidental symbol */}
            <text x={accidentalX} y={noteY + 6} textAnchor="middle"
              fontSize="24" fontWeight="700" fill="var(--svg-notation-primary)">
              {note.accidental}
            </text>
            {/* Note head */}
            <ellipse cx={note.x} cy={noteY} rx="9.5" ry="6.5"
              fill="var(--svg-notation-primary)" stroke="var(--svg-notation-primary)" strokeWidth="1.5"
              transform={`rotate(-20 ${note.x} ${noteY})`} />
            {/* Label below */}
            <text x={note.x} y="120" textAnchor="middle"
              fontSize="11" fontWeight="600" fill="var(--svg-notation-primary)">
              {note.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
