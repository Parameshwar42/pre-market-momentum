"use client";

import React from "react";

interface MiniChartProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export default function MiniChart({
  data,
  isPositive,
  width = 120,
  height = 40,
}: MiniChartProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  // Add 10% padding to top and bottom so chart lines aren't cut off
  const padding = height * 0.1;
  const usableHeight = height - padding * 2;

  // Build the SVG path points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // Build the closed area path for the gradient fill
  const areaD = `${pathD} L ${width.toFixed(1)} ${height.toFixed(1)} L 0 ${height.toFixed(1)} Z`;

  const colorClass = isPositive ? "stroke-positive" : "stroke-negative";
  const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={isPositive ? "var(--positive)" : "var(--negative)"}
            stopOpacity="0.25"
          />
          <stop
            offset="100%"
            stopColor={isPositive ? "var(--positive)" : "var(--negative)"}
            stopOpacity="0.0"
          />
        </linearGradient>
      </defs>

      {/* Closed area gradient fill */}
      <path d={areaD} fill={`url(#${gradientId})`} />

      {/* Line path */}
      <path
        d={pathD}
        fill="none"
        strokeWidth="2"
        className={`${colorClass} transition-all duration-300`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pulsing end dot */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="2.5"
          className={isPositive ? "fill-positive" : "fill-negative"}
        />
      )}
    </svg>
  );
}
