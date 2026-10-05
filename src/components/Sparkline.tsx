import React from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
  showFill?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isPositive,
  width = 100,
  height = 40,
  showFill = true,
  className = '',
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Compute SVG coordinates
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;
  const stepX = width / (data.length - 1);

  const points = data.map((val, idx) => {
    const x = idx * stepX;
    // in SVG, y=0 is top, y=height is bottom
    const y = paddingY + ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Construct smooth quadratic bezier curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const strokeColor = isPositive ? '#089981' : '#F23645';
  const fillColor = isPositive ? 'rgba(8, 153, 129, 0.08)' : 'rgba(242, 54, 69, 0.08)';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`shrink-0 overflow-visible ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      {showFill && <path d={fillD} fill={fillColor} />}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
