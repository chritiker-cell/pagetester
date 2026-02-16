import React from 'react';

interface PedalOverviewProps {
  className?: string;
}

export const PedalOverview: React.FC<PedalOverviewProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 460 160"
      width="100%"
      className={className}
      role="img"
      aria-label="Übersicht der drei Klavierpedale"
    >
      {/* Background */}
      <rect x="0" y="0" width="460" height="160" fill="transparent" />

      {/* Pedal base/floor */}
      <rect x="40" y="95" width="380" height="4" fill="var(--svg-notation-primary)" opacity="0.2" />

      {/* Left Pedal - Una Corda */}
      <g>
        <rect
          x="60"
          y="50"
          width="80"
          height="40"
          rx="8"
          fill="var(--svg-notation-primary)"
          opacity="0.3"
          stroke="var(--svg-notation-primary)"
          strokeWidth="2"
        />
        <text
          x="100"
          y="68"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--svg-notation-primary)"
        >
          Una Corda
        </text>
        <text
          x="100"
          y="82"
          textAnchor="middle"
          fontSize="10"
          fill="var(--svg-notation-primary)"
          opacity="0.7"
        >
          (leiser)
        </text>
      </g>

      {/* Middle Pedal - Sostenuto */}
      <g>
        <rect
          x="190"
          y="50"
          width="80"
          height="40"
          rx="8"
          fill="var(--svg-notation-primary)"
          opacity="0.3"
          stroke="var(--svg-notation-primary)"
          strokeWidth="2"
        />
        <text
          x="230"
          y="68"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--svg-notation-primary)"
        >
          Sostenuto
        </text>
        <text
          x="230"
          y="82"
          textAnchor="middle"
          fontSize="10"
          fill="var(--svg-notation-primary)"
          opacity="0.7"
        >
          (selten)
        </text>
      </g>

      {/* Right Pedal - Haltepedal (highlighted) */}
      <g>
        {/* Glow effect */}
        <rect
          x="315"
          y="45"
          width="90"
          height="50"
          rx="10"
          fill="var(--svg-notation-primary)"
          opacity="0.15"
        />
        <rect
          x="320"
          y="50"
          width="80"
          height="40"
          rx="8"
          fill="var(--svg-notation-primary)"
          opacity="0.2"
          stroke="var(--svg-notation-primary)"
          strokeWidth="3"
        />
        <text
          x="360"
          y="66"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="var(--svg-notation-primary)"
        >
          Haltepedal
        </text>
        <text
          x="360"
          y="80"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--svg-notation-primary)"
        >
          (wichtigstes!)
        </text>
      </g>

      {/* Foot outline pointing to right pedal */}
      <g opacity="0.6">
        {/* Arrow */}
        <path
          d="M 360 105 L 360 95"
          stroke="var(--svg-notation-primary)"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M 360 95 L 355 100 L 365 100 Z"
          fill="var(--svg-notation-primary)"
        />

        {/* Simplified foot outline */}
        <ellipse
          cx="360"
          cy="118"
          rx="22"
          ry="12"
          fill="var(--svg-notation-primary)"
          opacity="0.25"
          stroke="var(--svg-notation-primary)"
          strokeWidth="1.5"
        />
      </g>

      {/* Bottom text */}
      <text
        x="230"
        y="145"
        textAnchor="middle"
        fontSize="13"
        fontWeight="500"
        fill="var(--svg-notation-primary)"
      >
        Das rechte Pedal wird am haeufigsten benutzt
      </text>
    </svg>
  );
};
