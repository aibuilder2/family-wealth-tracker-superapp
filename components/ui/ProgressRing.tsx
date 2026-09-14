import React from 'react';

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  textColor?: string;
}

export function ProgressRing({
  percent = 0,
  size = 88,
  strokeWidth = 7,
  color = '#B98B2A',
  bgColor = '#E9E2D0',
  textColor = '#1B2A33',
}: ProgressRingProps) {
  const boundedPercent = Math.min(100, Math.max(0, percent));
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const strokeDashoffset = c - (boundedPercent / 100) * c;
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 transition-all duration-500">
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      {/* Progress fill */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={c}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        className="transition-all duration-700 ease-out"
      />
      <text
        x={center}
        y={center + size * 0.08}
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={size * 0.2}
        fontWeight="600"
        fill={textColor}
      >
        {boundedPercent}%
      </text>
    </svg>
  );
}
