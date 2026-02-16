export function IntervalOverview() {
  return (
    <svg viewBox="0 0 560 165" width="100%" className="max-w-3xl mx-auto">
      <title>Intervall-Übersicht</title>

      {/* Staff lines */}
      <line x1="20" y1="30" x2="540" y2="30" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="45" x2="540" y2="45" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="60" x2="540" y2="60" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="75" x2="540" y2="75" stroke="var(--svg-staff-line)" strokeWidth="1" />
      <line x1="20" y1="90" x2="540" y2="90" stroke="var(--svg-staff-line)" strokeWidth="1" />

      {/* Ledger lines for middle C (repeated for each interval) */}
      {[60, 120, 180, 240, 300, 360, 420, 480].map((x, i) => (
        <line key={i} x1={x - 15} y1="105" x2={x + 15} y2="105" stroke="var(--svg-staff-line)" strokeWidth="1" />
      ))}

      {/* Treble clef */}
      <text x="25" y="70" fontSize="48" fill="var(--svg-notation-primary)">𝄞</text>

      {/* Prime (C-C) */}
      <ellipse cx="60" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 60 105)" fill="var(--svg-notation-primary)"  />
      <ellipse cx="75" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 75 105)" fill="var(--svg-notation-primary)"  />
      <text x="67.5" y="125" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--svg-notation-primary)" >1</text>
      <text x="67.5" y="140" textAnchor="middle" fontSize="11" fill="var(--svg-notation-secondary)">Prime</text>

      {/* Sekunde (C-D) */}
      <ellipse cx="120" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 120 105)" fill="var(--svg-notation-primary)"  />
      <ellipse cx="135" cy="97.5" rx="9.5" ry="6.5" transform="rotate(-20 135 97.5)" fill="var(--svg-notation-primary)"  />
      <text x="127.5" y="125" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--svg-notation-primary)" >2</text>
      <text x="127.5" y="140" textAnchor="middle" fontSize="11" fill="var(--svg-notation-secondary)">Sek.</text>

      {/* Terz (C-E) */}
      <ellipse cx="180" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 180 105)" fill="var(--svg-notation-primary)"  />
      <ellipse cx="195" cy="90" rx="9.5" ry="6.5" transform="rotate(-20 195 90)" fill="var(--svg-notation-primary)"  />
      <text x="187.5" y="125" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--svg-notation-primary)" >3</text>
      <text x="187.5" y="140" textAnchor="middle" fontSize="11" fill="var(--svg-notation-secondary)">Terz</text>

      {/* Quarte (C-F) */}
      <ellipse cx="240" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 240 105)" fill="var(--svg-notation-primary)"  />
      <ellipse cx="255" cy="82.5" rx="9.5" ry="6.5" transform="rotate(-20 255 82.5)" fill="var(--svg-notation-primary)"  />
      <text x="247.5" y="125" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--svg-notation-primary)" >4</text>
      <text x="247.5" y="140" textAnchor="middle" fontSize="11" fill="var(--svg-notation-secondary)">Quarte</text>

      {/* Quinte (C-G) */}
      <ellipse cx="300" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 300 105)" fill="var(--svg-notation-primary)"  />
      <ellipse cx="315" cy="75" rx="9.5" ry="6.5" transform="rotate(-20 315 75)" fill="var(--svg-notation-primary)"  />
      <text x="307.5" y="125" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--svg-notation-primary)" >5</text>
      <text x="307.5" y="140" textAnchor="middle" fontSize="11" fill="var(--svg-notation-secondary)">Quinte</text>

      {/* Sexte (C-A) */}
      <ellipse cx="360" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 360 105)" fill="var(--svg-notation-primary)"  />
      <ellipse cx="375" cy="67.5" rx="9.5" ry="6.5" transform="rotate(-20 375 67.5)" fill="var(--svg-notation-primary)"  />
      <text x="367.5" y="125" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--svg-notation-primary)" >6</text>
      <text x="367.5" y="140" textAnchor="middle" fontSize="11" fill="var(--svg-notation-secondary)">Sexte</text>

      {/* Septime (C-H) */}
      <ellipse cx="420" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 420 105)" fill="var(--svg-notation-primary)"  />
      <ellipse cx="435" cy="60" rx="9.5" ry="6.5" transform="rotate(-20 435 60)" fill="var(--svg-notation-primary)"  />
      <text x="427.5" y="125" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--svg-notation-primary)" >7</text>
      <text x="427.5" y="140" textAnchor="middle" fontSize="11" fill="var(--svg-notation-secondary)">Sept.</text>

      {/* Oktave (C-C') */}
      <ellipse cx="480" cy="105" rx="9.5" ry="6.5" transform="rotate(-20 480 105)" fill="var(--svg-notation-primary)"  />
      <ellipse cx="495" cy="52.5" rx="9.5" ry="6.5" transform="rotate(-20 495 52.5)" fill="var(--svg-notation-primary)"  />
      {/* Note labels for Oktave */}
      <text x="480" y="118" textAnchor="middle" fontSize="10" fill="var(--svg-notation-primary)" fontWeight="500">C</text>
      <text x="495" y="45" textAnchor="middle" fontSize="10" fill="var(--svg-notation-primary)" fontWeight="500">C'</text>
      <text x="487.5" y="130" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--svg-notation-primary)" >8</text>
      <text x="487.5" y="145" textAnchor="middle" fontSize="11" fill="var(--svg-notation-secondary)">Okt.</text>
    </svg>
  );
}
