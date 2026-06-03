"use client";

import React, { useState, useRef, useEffect } from "react";

interface DataPoint {
  date: string;
  price: number;
}

interface InteractiveChartProps {
  data: DataPoint[];
  symbol: string;
  height?: number;
}

export default function InteractiveChart({
  data,
  symbol,
  height = 240,
}: InteractiveChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-xl border border-border" style={{ height }}>
        <span className="text-xs text-muted-foreground">No historical data available</span>
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice;

  // Constants for chart geometry in viewbox coordinates
  const viewWidth = 600;
  const viewHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = viewWidth - paddingLeft - paddingRight;
  const chartHeight = viewHeight - paddingTop - paddingBottom;

  // Calculate SVG coordinate for a data index & price
  const getX = (idx: number) => {
    return paddingLeft + (idx / (data.length - 1)) * chartWidth;
  };

  const getY = (price: number) => {
    return viewHeight - paddingBottom - ((price - minPrice) / priceRange) * chartHeight;
  };

  // Build the path definition
  const points = data.map((d, idx) => ({
    x: getX(idx),
    y: getY(d.price),
  }));

  const pathD = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // Closed area under the curve
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(viewHeight - paddingBottom).toFixed(1)} L ${points[0].x.toFixed(1)} ${(viewHeight - paddingBottom).toFixed(1)} Z`;

  const isPositive = data[data.length - 1].price >= data[0].price;
  const colorClass = isPositive ? "stroke-positive" : "stroke-negative";
  const gradId = `chart-grad-${symbol}`;

  // Handle Mouse Hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    // Map mouse X to SVG viewBox coordinates
    const mouseXInSvg = ((e.clientX - rect.left) / rect.width) * viewWidth;
    
    // Find closest index
    const relativeX = mouseXInSvg - paddingLeft;
    const indexPercent = relativeX / chartWidth;
    let closestIndex = Math.round(indexPercent * (data.length - 1));
    closestIndex = Math.max(0, Math.min(data.length - 1, closestIndex));

    const pt = data[closestIndex];
    setHoveredPoint(pt);
    setHoverIndex(closestIndex);

    // Position of marker
    const markerX = getX(closestIndex);
    const markerY = getY(pt.price);

    // Calculate tooltip position (keep within boundaries)
    let tooltipX = markerX;
    if (markerX > viewWidth - 110) {
      tooltipX = markerX - 110;
    } else if (markerX < paddingLeft + 10) {
      tooltipX = markerX + 10;
    } else {
      tooltipX = markerX - 50;
    }

    setTooltipPos({
      x: tooltipX,
      y: Math.max(paddingTop, markerY - 45),
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoverIndex(null);
  };

  // Helper values for Grid Lines
  const gridLinesCount = 4;
  const gridValues = Array.from({ length: gridLinesCount }, (_, i) => {
    const ratio = i / (gridLinesCount - 1);
    return minPrice + ratio * priceRange;
  });

  const isUSD = ["GOLD", "WTI_CRUDE", "CRUDEOIL", "HDB", "IBN", "INFY", "WIT", "RDY", "AXBKY"].includes(symbol);
  const currencySymbol = isUSD ? "$" : "₹";

  return (
    <div className="relative w-full bg-card rounded-xl border border-border p-4 shadow-sm transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Historical Trend (30D)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">
              {currencySymbol}{data[data.length - 1].price.toLocaleString("en-IN", {
                minimumFractionDigits: symbol === "USDINR" ? 3 : 2,
                maximumFractionDigits: symbol === "USDINR" ? 3 : 2,
              })}
            </span>
            <span className={`text-xs font-semibold font-mono ${isPositive ? "text-positive" : "text-negative"}`}>
              {isPositive ? "▲" : "▼"} {(((data[data.length - 1].price - data[0].price) / data[0].price) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>30-Day Span</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair overflow-visible"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isPositive ? "var(--positive)" : "var(--negative)"}
                stopOpacity="0.18"
              />
              <stop
                offset="100%"
                stopColor={isPositive ? "var(--positive)" : "var(--negative)"}
                stopOpacity="0.0"
              />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {gridValues.map((val, idx) => {
            const y = getY(val);
            return (
              <g key={`grid-${idx}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={viewWidth - paddingRight}
                  y2={y}
                  className="stroke-border/40"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground font-mono text-[9px] font-medium"
                >
                  {val.toLocaleString("en-IN", {
                    maximumFractionDigits: symbol === "USDINR" ? 3 : 0,
                  })}
                </text>
              </g>
            );
          })}

          {/* X-Axis Labels (First, Middle, Last dates) */}
          {[0, Math.floor(data.length / 2), data.length - 1].map((idx) => {
            if (idx >= data.length) return null;
            return (
              <text
                key={`x-label-${idx}`}
                x={getX(idx)}
                y={viewHeight - 12}
                textAnchor={idx === 0 ? "start" : idx === data.length - 1 ? "end" : "middle"}
                className="fill-muted-foreground font-medium text-[9px]"
              >
                {data[idx].date}
              </text>
            );
          })}

          {/* Area under the curve */}
          <path d={areaD} fill={`url(#${gradId})`} />

          {/* Main Chart Line */}
          <path
            d={pathD}
            fill="none"
            strokeWidth="2.5"
            className={`${colorClass} transition-all duration-300`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover Crosshairs & Points */}
          {hoverIndex !== null && hoveredPoint && (
            <g>
              {/* Vertical guideline */}
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={viewHeight - paddingBottom}
                className="stroke-muted-foreground/35"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Hover highlight circle */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(hoveredPoint.price)}
                r="5"
                className={`${isPositive ? "fill-positive" : "fill-negative"} stroke-background`}
                strokeWidth="1.5"
              />

              <circle
                cx={getX(hoverIndex)}
                cy={getY(hoveredPoint.price)}
                r="10"
                className={isPositive ? "fill-positive/20" : "fill-negative/20"}
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip in HTML for crisp rendering */}
        {hoveredPoint && (
          <div
            className="absolute z-30 pointer-events-none rounded-lg bg-slate-900 border border-slate-800 p-2 shadow-lg text-[10px] font-mono text-white flex flex-col gap-0.5 leading-none transition-transform"
            style={{
              left: `${(tooltipPos.x / viewWidth) * 100}%`,
              top: `${(tooltipPos.y / viewHeight) * 100}%`,
              minWidth: "90px",
            }}
          >
            <span className="text-slate-400 font-bold">{hoveredPoint.date}</span>
            <span className="text-white font-bold text-xs mt-0.5">
              {currencySymbol}{hoveredPoint.price.toLocaleString("en-IN", {
                minimumFractionDigits: symbol === "USDINR" ? 3 : 2,
                maximumFractionDigits: symbol === "USDINR" ? 3 : 2,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
