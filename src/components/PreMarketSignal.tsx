"use client";

import React from "react";
import { PreMarketSignal as SignalType } from "@/services/api";
import { 
  TrendingUp, 
  TrendingDown, 
  Minimize2, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp as TrendIcon,
  Zap
} from "lucide-react";

interface PreMarketSignalProps {
  signalData: SignalType;
}

export default function PreMarketSignal({ signalData }: PreMarketSignalProps) {
  const { signal, confidence, rationale, components } = signalData;

  const isBullish = signal === "BULLISH";
  const isBearish = signal === "BEARISH";
  const isNeutral = signal === "NEUTRAL";

  // SVG circular progress parameters
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // ~314.16
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  let signalColorClass = "text-amber-500 bg-amber-500/10 border-amber-500/30";
  let signalGlowClass = "border-amber-500/20";
  let dialColor = "stroke-amber-500";
  
  if (isBullish) {
    signalColorClass = "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    signalGlowClass = "border-emerald-500/20 glow-positive";
    dialColor = "stroke-emerald-500";
  } else if (isBearish) {
    signalColorClass = "text-rose-500 bg-rose-500/10 border-rose-500/30";
    signalGlowClass = "border-rose-500/20 glow-negative";
    dialColor = "stroke-rose-500";
  }

  return (
    <div className={`rounded-3xl border bg-card p-6 shadow-sm transition-all duration-200 ${signalGlowClass}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Zap className="h-4.5 w-4.5 text-indigo-500" />
            <span>Proprietary Market Intelligence</span>
          </div>
          <h2 className="text-xl font-black text-foreground mt-1 tracking-tight">Pre-Market India Signal</h2>
        </div>
        
        {/* Signal Badge */}
        <div className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 border text-sm font-extrabold tracking-wider ${signalColorClass}`}>
          {isBullish && <TrendingUp className="h-5 w-5" />}
          {isBearish && <TrendingDown className="h-5 w-5" />}
          {isNeutral && <Minimize2 className="h-5 w-5" />}
          <span>{signal} OPENING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Column: Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-border/60 pb-6 lg:pb-0 lg:pr-8">
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-muted/40 fill-none"
                strokeWidth={strokeWidth}
              />
              {/* Foreground progress circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className={`${dialColor} fill-none transition-all duration-1000 ease-out`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-3xl font-black font-mono text-foreground">{confidence}%</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1.5">Confidence</span>
            </div>
          </div>
          
          <div className="mt-4 max-w-[180px]">
            <span className="text-xs text-muted-foreground leading-normal block">
              Calculated dynamically using real-time global arbitrage weights.
            </span>
          </div>
        </div>

        {/* Right Column: Contributions & Rationales */}
        <div className="lg:col-span-8 space-y-6">
          {/* Component Factors */}
          <div>
            <h3 className="text-xs font-black uppercase text-foreground tracking-wider mb-3">Signal Composition Factors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* GIFT NIFTY */}
              <div className="rounded-xl bg-muted/50 border border-border/40 p-2.5 flex flex-col">
                <span className="text-[10px] font-medium text-muted-foreground truncate">GIFT Nifty (45%)</span>
                <span className="text-xs font-extrabold text-foreground font-mono mt-1">₹{components.giftNifty.value.toLocaleString("en-IN")}</span>
                <span className={`text-[10px] font-bold mt-0.5 inline-flex items-center gap-0.5 ${
                  components.giftNifty.impact === "positive" ? "text-emerald-500" : components.giftNifty.impact === "negative" ? "text-rose-500" : "text-slate-400"
                }`}>
                  {components.giftNifty.status}
                </span>
              </div>

              {/* ADRs */}
              <div className="rounded-xl bg-muted/50 border border-border/40 p-2.5 flex flex-col">
                <span className="text-[10px] font-medium text-muted-foreground truncate">ADR Stocks (30%)</span>
                <span className="text-xs font-extrabold text-foreground font-mono mt-1">Weighted</span>
                <span className={`text-[10px] font-bold mt-0.5 inline-flex items-center gap-0.5 ${
                  components.adrAverage.impact === "positive" ? "text-emerald-500" : components.adrAverage.impact === "negative" ? "text-rose-500" : "text-slate-400"
                }`}>
                  {components.adrAverage.status}
                </span>
              </div>

              {/* USDINR */}
              <div className="rounded-xl bg-muted/50 border border-border/40 p-2.5 flex flex-col">
                <span className="text-[10px] font-medium text-muted-foreground truncate">USD/INR (10%)</span>
                <span className="text-xs font-extrabold text-foreground font-mono mt-1">₹{components.rupeeUsd.value.toFixed(3)}</span>
                <span className={`text-[10px] font-bold mt-0.5 inline-flex items-center gap-0.5 ${
                  components.rupeeUsd.impact === "positive" ? "text-emerald-500" : components.rupeeUsd.impact === "negative" ? "text-rose-500" : "text-slate-400"
                }`}>
                  {components.rupeeUsd.status}
                </span>
              </div>

              {/* Crude Oil */}
              <div className="rounded-xl bg-muted/50 border border-border/40 p-2.5 flex flex-col">
                <span className="text-[10px] font-medium text-muted-foreground truncate">Crude Oil (10%)</span>
                <span className="text-xs font-extrabold text-foreground font-mono mt-1">${components.crudeOil.value.toFixed(2)}</span>
                <span className={`text-[10px] font-bold mt-0.5 inline-flex items-center gap-0.5 ${
                  components.crudeOil.impact === "positive" ? "text-emerald-500" : components.crudeOil.impact === "negative" ? "text-rose-500" : "text-slate-400"
                }`}>
                  {components.crudeOil.status}
                </span>
              </div>

              {/* Nifty Bank */}
              <div className="rounded-xl bg-muted/50 border border-border/40 p-2.5 flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[10px] font-medium text-muted-foreground truncate">Nifty Bank (5%)</span>
                <span className="text-xs font-extrabold text-foreground font-mono mt-1">₹{components.niftyBank.value.toLocaleString("en-IN")}</span>
                <span className={`text-[10px] font-bold mt-0.5 inline-flex items-center gap-0.5 ${
                  components.niftyBank.impact === "positive" ? "text-emerald-500" : components.niftyBank.impact === "negative" ? "text-rose-500" : "text-slate-400"
                }`}>
                  {components.niftyBank.status}
                </span>
              </div>
            </div>
          </div>

          {/* Rationale Bulletins */}
          <div>
            <h3 className="text-xs font-black uppercase text-foreground tracking-wider mb-2.5">Analysis & Market Rationale</h3>
            <ul className="space-y-2">
              {rationale.map((reason, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
