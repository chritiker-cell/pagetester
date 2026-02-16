import React from 'react';

export const HandDiagram: React.FC = () => {
  return (
    <svg
      viewBox="0 0 300 280"
      width="100%"
      className="max-w-md mx-auto"
      role="img"
      aria-label="Fingerbezeichnungen an der Hand"
    >
      {/* Hand outline */}
      <g fill="#e5e5e5" stroke="var(--svg-notation-primary)" strokeWidth="2">
        {/* Palm */}
        <rect x="80" y="140" width="140" height="120" rx="15" />

        {/* Thumb (1) */}
        <path d="M 80 180 Q 50 180 40 150 Q 35 130 45 110 Q 55 90 70 95 Q 80 100 80 120 Z" />

        {/* Index finger (2) */}
        <rect x="95" y="60" width="28" height="85" rx="14" />

        {/* Middle finger (3) */}
        <rect x="135" y="40" width="28" height="105" rx="14" />

        {/* Ring finger (4) */}
        <rect x="175" y="55" width="28" height="90" rx="14" />

        {/* Pinky (5) */}
        <rect x="210" y="85" width="24" height="65" rx="12" />
      </g>

      {/* Finger number circles and labels */}

      {/* Thumb (1) - Red */}
      <circle cx="50" cy="120" r="18" fill="var(--svg-notation-primary)" />
      <text x="50" y="127" fill="white" fontWeight="700" fontSize="24" textAnchor="middle">1</text>
      <text x="25" y="95" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="500" textAnchor="middle">Daumen</text>

      {/* Index (2) - Orange */}
      <circle cx="109" cy="35" r="18" fill="var(--svg-notation-primary)" />
      <text x="109" y="42" fill="white" fontWeight="700" fontSize="24" textAnchor="middle">2</text>
      <text x="109" y="20" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="500" textAnchor="middle">Zeige</text>

      {/* Middle (3) - Amber */}
      <circle cx="149" cy="20" r="18" fill="var(--svg-notation-secondary)" />
      <text x="149" y="27" fill="white" fontWeight="700" fontSize="24" textAnchor="middle">3</text>
      <text x="149" y="5" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="500" textAnchor="middle">Mittel</text>

      {/* Ring (4) - Green */}
      <circle cx="189" cy="30" r="18" fill="var(--svg-notation-primary)" />
      <text x="189" y="37" fill="white" fontWeight="700" fontSize="24" textAnchor="middle">4</text>
      <text x="189" y="15" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="500" textAnchor="middle">Ring</text>

      {/* Pinky (5) - Blue */}
      <circle cx="222" cy="65" r="18" fill="var(--svg-notation-primary)" />
      <text x="222" y="72" fill="white" fontWeight="700" fontSize="24" textAnchor="middle">5</text>
      <text x="222" y="50" fill="var(--svg-notation-primary)" fontSize="14" fontWeight="500" textAnchor="middle">Kleiner</text>
    </svg>
  );
};
