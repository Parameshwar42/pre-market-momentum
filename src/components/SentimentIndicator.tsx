"use client";

import React from "react";
import { getMarketSentiment, MarketItem } from "@/services/api";
import { Gauge, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface SentimentIndicatorProps {
  marketItems: MarketItem[];
}

export default function SentimentIndicator({ marketItems }: SentimentIndicatorProps) {
  const sentiment = getMarketSentiment(marketItems);
  
  const total = sentiment.advances + sentiment.declines + sentiment.unchanged;
  const advancePercent = (sentiment.advances / total) * 100;
  const declinePercent = (sentiment.declines / total) * 100;
  const unchangedPercent = (sentiment.unchanged / total) * 100;

  // Determine sentiment gradient colors
  let sentimentColor = "text-emerald-500";
  let sentimentProgressBg = "bg-emerald-500";
  if (sentiment.score < 30) {
    sentimentColor = "text-rose-600";
    sentimentProgressBg = "bg-rose-600";
  } else if (sentiment.score < 45) {
    sentimentColor = "text-rose-400";
    sentimentProgressBg = "bg-rose-400";
  } else if (sentiment.score < 55) {
    sentimentColor = "text-amber-500";
    sentimentProgressBg = "bg-amber-500";
  } else if (sentiment.score < 70) {
    sentimentColor = "text-emerald-400";
    sentimentProgressBg = "bg-emerald-400";
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-1.5 border-b border-border/60 pb-4">
        <Gauge className="h-5 w-5 text-indigo-500" />
        <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Indian Market Sentiment</h2>
      </div>

      <div className="space-y-6 pt-5">
        {/* Fear & Greed Gauge */}
        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-muted-foreground uppercase">Fear & Greed Index</span>
            <span className={`text-base font-extrabold ${sentimentColor}`}>{sentiment.label} ({sentiment.score})</span>
          </div>
          
          {/* Custom Slider Indicator */}
          <div className="relative mt-2.5">
            <div className="h-2 w-full rounded-full bg-secondary flex overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 w-full" />
            </div>
            {/* Pointer circle indicator */}
            <div 
              className="absolute -top-1 h-4 w-4 rounded-full bg-white border-[3px] border-slate-900 shadow-md transition-all duration-500"
              style={{ left: `calc(${sentiment.score}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">
            <span>Extreme Fear</span>
            <span>Neutral</span>
            <span>Extreme Greed</span>
          </div>
        </div>

        {/* Advance Decline ratio */}
        <div>
          <div className="flex justify-between text-xs font-bold text-foreground">
            <span className="text-emerald-500">Advances: {sentiment.advances}</span>
            <span className="text-rose-500">Declines: {sentiment.declines}</span>
          </div>
          
          {/* Stacked Progress Bar */}
          <div className="h-2.5 w-full rounded-lg bg-secondary overflow-hidden flex mt-2">
            <div className="h-full bg-emerald-500" style={{ width: `${advancePercent}%` }} title={`Advances: ${sentiment.advances}`} />
            <div className="h-full bg-slate-300 dark:bg-slate-700" style={{ width: `${unchangedPercent}%` }} title={`Unchanged: ${sentiment.unchanged}`} />
            <div className="h-full bg-rose-500" style={{ width: `${declinePercent}%` }} title={`Declines: ${sentiment.declines}`} />
          </div>
          
          <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-1">
            <span>AD Ratio: {(sentiment.advances / sentiment.declines).toFixed(2)}x</span>
            <span>Unchanged: {sentiment.unchanged}</span>
          </div>
        </div>

        {/* Technical Derivative Indicators */}
        <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
          <div className="rounded-xl bg-muted/40 border border-border/40 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">India VIX</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-black font-mono text-foreground leading-none">{sentiment.vix.toFixed(2)}</span>
              <span className={`text-[10px] font-bold font-mono inline-flex items-center gap-0.5 ${
                sentiment.vixChangePercent <= 0 ? "text-emerald-500" : "text-rose-500"
              }`}>
                {sentiment.vixChangePercent <= 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                {sentiment.vixChangePercent >= 0 ? "+" : ""}{sentiment.vixChangePercent.toFixed(2)}%
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground leading-normal mt-1 block">
              {sentiment.vix > 18 ? "Volatility is elevated, exercise caution." : "Volatility remains low, supportive for bulls."}
            </span>
          </div>

          <div className="rounded-xl bg-muted/40 border border-border/40 p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">NIFTY Option PCR</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-black font-mono text-foreground leading-none">{sentiment.niftyPcr.toFixed(2)}</span>
              <span className={`text-[10px] font-bold leading-none ${
                sentiment.niftyPcr >= 1.15 ? "text-emerald-500" :
                sentiment.niftyPcr >= 0.95 ? "text-indigo-500 dark:text-indigo-400" : "text-rose-500"
              }`}>
                {sentiment.niftyPcr >= 1.15 ? "Bullish" :
                 sentiment.niftyPcr >= 0.95 ? "Neutral" : "Bearish"}
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground leading-normal mt-1 block">
              {sentiment.niftyPcr >= 1.15 ? "Heavy Put writing indicates a strong floor." :
               sentiment.niftyPcr >= 0.95 ? "Put-Call ratio reflects balanced neutral positioning." :
               "Call writing resistance capping Nifty upside."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
