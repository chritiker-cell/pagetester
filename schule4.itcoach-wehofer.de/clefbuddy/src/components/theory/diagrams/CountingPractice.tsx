import React from 'react';

interface CountingPracticeProps {
  className?: string;
}

export const CountingPractice: React.FC<CountingPracticeProps> = ({ className = '' }) => {
  // Use CSS variables for dark mode support
  const staffStroke = "var(--svg-staff-line)";
  const noteFill = "var(--svg-notation-primary)";
  const countFill = "#16a34a";

  return (
    <svg
      viewBox="0 0 520 140"
      width="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Staff lines */}
      {[0, 15, 30, 45, 60].map((y, i) => (
        <line
          key={`staff-${i}`}
          x1="20"
          y1={20 + y}
          x2="500"
          y2={20 + y}
          stroke={staffStroke}
          strokeWidth="1"
        />
      ))}

      {/* Treble clef */}
      <text x="30" y="65" fontSize="60" fontFamily="serif" fill="var(--svg-notation-primary)">
        𝄞
      </text>

      {/* Time signature 4/4 */}
      <text x="75" y="40" fontSize="20" fontWeight="bold" fill={noteFill}>4</text>
      <text x="75" y="65" fontSize="20" fontWeight="bold" fill={noteFill}>4</text>

      {/* Bar 1: half note + 2 quarter notes */}
      <g id="bar1">
        {/* Half note (on line 2 = B) */}
        <ellipse
          cx="120"
          cy="50"
          rx="10"
          ry="7"
          transform="rotate(-20 120 50)"
          fill="none"
          stroke={noteFill}
          strokeWidth="2"
        />
        <line x1="130" y1="50" x2="130" y2="15" stroke={staffStroke} strokeWidth="1.5" />

        {/* Quarter note 1 (on space 2 = C) */}
        <ellipse
          cx="200"
          cy="57.5"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 200 57.5)"
          fill={noteFill}
        />
        <line x1="209" y1="57.5" x2="209" y2="22.5" stroke={staffStroke} strokeWidth="1.5" />

        {/* Quarter note 2 (on line 1 = D) */}
        <ellipse
          cx="250"
          cy="42.5"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 250 42.5)"
          fill={noteFill}
        />
        <line x1="259" y1="42.5" x2="259" y2="7.5" stroke={staffStroke} strokeWidth="1.5" />

        {/* Bar line */}
        <line x1="290" y1="20" x2="290" y2="80" stroke={staffStroke} strokeWidth="2" />
      </g>

      {/* Bar 2: quarter + 2 eighths + quarter + quarter */}
      <g id="bar2">
        {/* Quarter note (on space 1 = E) */}
        <ellipse
          cx="320"
          cy="35"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 320 35)"
          fill={noteFill}
        />
        <line x1="329" y1="35" x2="329" y2="0" stroke={staffStroke} strokeWidth="1.5" />

        {/* Eighth note 1 (on line 3 = F) */}
        <ellipse
          cx="360"
          cy="27.5"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 360 27.5)"
          fill={noteFill}
        />
        <line x1="369" y1="27.5" x2="369" y2="-7.5" stroke={staffStroke} strokeWidth="1.5" />

        {/* Eighth note 2 (on space 3 = G) */}
        <ellipse
          cx="390"
          cy="20"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 390 20)"
          fill={noteFill}
        />
        <line x1="399" y1="20" x2="399" y2="-15" stroke={staffStroke} strokeWidth="1.5" />

        {/* Beam for eighths */}
        <rect x="369" y="-7.5" width="30" height="3" fill={noteFill} />

        {/* Quarter note (on line 2 = A) */}
        <ellipse
          cx="420"
          cy="27.5"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 420 27.5)"
          fill={noteFill}
        />
        <line x1="429" y1="27.5" x2="429" y2="-7.5" stroke={staffStroke} strokeWidth="1.5" />

        {/* Quarter note (on space 2 = B) */}
        <ellipse
          cx="460"
          cy="20"
          rx="9.5"
          ry="6.5"
          transform="rotate(-20 460 20)"
          fill={noteFill}
        />
        <line x1="469" y1="20" x2="469" y2="-15" stroke={staffStroke} strokeWidth="1.5" />

        {/* Double bar line */}
        <line x1="490" y1="20" x2="490" y2="80" stroke={staffStroke} strokeWidth="2" />
        <line x1="495" y1="20" x2="495" y2="80" stroke={staffStroke} strokeWidth="3" />
      </g>

      {/* Counting numbers below staff */}
      <g id="counting">
        {/* Bar 1 counting */}
        <text x="115" y="110" fontSize="16" fontWeight="bold" fill={countFill}>1</text>
        <text x="145" y="110" fontSize="16" fill={countFill}>—</text>
        <text x="175" y="110" fontSize="16" fill={countFill}>—</text>
        <text x="195" y="110" fontSize="16" fontWeight="bold" fill={countFill}>2</text>
        <text x="215" y="110" fontSize="16" fill={countFill}>—</text>
        <text x="245" y="110" fontSize="16" fontWeight="bold" fill={countFill}>3</text>
        <text x="265" y="110" fontSize="16" fontWeight="bold" fill={countFill}>4</text>

        {/* Bar 2 counting */}
        <text x="315" y="110" fontSize="16" fontWeight="bold" fill={countFill}>1</text>
        <text x="355" y="110" fontSize="16" fontWeight="bold" fill={countFill}>2</text>
        <text x="385" y="110" fontSize="16" fill={countFill}>+</text>
        <text x="415" y="110" fontSize="16" fontWeight="bold" fill={countFill}>3</text>
        <text x="455" y="110" fontSize="16" fontWeight="bold" fill={countFill}>4</text>
      </g>
    </svg>
  );
};
