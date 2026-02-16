export default function EmptyStaff() {
  const lineY = [110, 85, 60, 35, 10]; // lines 1-5 bottom to top
  const spaceY = [97.5, 72.5, 47.5, 22.5]; // spaces 1-4

  return (
    <svg viewBox="0 0 480 140" width="100%" className="max-w-lg">
      {/* Staff lines */}
      {lineY.map((y, i) => (
        <line key={`l${i}`} x1="60" y1={y} x2="420" y2={y}
          stroke="var(--svg-staff-line)" strokeWidth="2" />
      ))}
      {/* Line numbers */}
      {lineY.map((y, i) => (
        <text key={`ln${i}`} x="42" y={y + 5} textAnchor="end"
          fontSize="13" fontWeight="600" fill="var(--svg-notation-secondary)">
          {i + 1}.
        </text>
      ))}
      {/* Space arrows */}
      {spaceY.map((y, i) => (
        <g key={`s${i}`}>
          <line x1="432" y1={y - 6} x2="432" y2={y + 6}
            stroke="#3b82f6" strokeWidth="2" />
          <line x1="428" y1={y - 2} x2="432" y2={y - 6}
            stroke="#3b82f6" strokeWidth="2" />
          <line x1="436" y1={y - 2} x2="432" y2={y - 6}
            stroke="#3b82f6" strokeWidth="2" />
          <line x1="428" y1={y + 2} x2="432" y2={y + 6}
            stroke="#3b82f6" strokeWidth="2" />
          <line x1="436" y1={y + 2} x2="432" y2={y + 6}
            stroke="#3b82f6" strokeWidth="2" />
          <text x="452" y={y + 5} fontSize="12" fontWeight="600"
            fill="var(--svg-notation-primary)">
            ZR {i + 1}
          </text>
        </g>
      ))}
      {/* Labels */}
      <text x="240" y="132" textAnchor="middle" fontSize="12" fontWeight="500"
        fill="var(--svg-notation-secondary)">
        5 Linien, 4 Zwischenraeume
      </text>
    </svg>
  );
}
