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
  Zap,
  Share2
} from "lucide-react";

interface PreMarketSignalProps {
  signalData: SignalType;
}

export default function PreMarketSignal({ signalData }: PreMarketSignalProps) {
  const { signal, confidence, rationale, components } = signalData;

  const isBullish = signal === "BULLISH";
  const isBearish = signal === "BEARISH";
  const isNeutral = signal === "NEUTRAL";

  const handleShare = (platform: "whatsapp" | "telegram" | "native") => {
    const giftNiftyVal = components.giftNifty.value.toLocaleString("en-IN");
    const giftNiftyStatus = components.giftNifty.status;
    const shareText = `⚡ Pre-Market India Opening Signal: ${signal} (${confidence}% Confidence)\n📈 GIFT Nifty: ₹${giftNiftyVal} (${giftNiftyStatus})\n\nTrack live opening signals & arbitrage setups:`;
    const shareUrl = "https://pre-market-momentum.vercel.app";

    if (platform === "native") {
      if (navigator.share) {
        navigator.share({
          title: "Pre-Market Momentum Cues",
          text: shareText,
          url: shareUrl,
        }).catch((err) => console.log("Share failed:", err));
      } else {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
          .then(() => {
            alert("Signal summary copied to clipboard! You can paste it in your trading groups.");
          })
          .catch((err) => console.log("Clipboard write failed:", err));
      }
    } else if (platform === "whatsapp") {
      const encodedText = encodeURIComponent(`${shareText}\n${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
    } else if (platform === "telegram") {
      const encodedText = encodeURIComponent(shareText);
      const encodedUrl = encodeURIComponent(shareUrl);
      window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank");
    }
  };

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

      {/* Share Section */}
      <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Share opening signal:
          </span>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Native / Mobile Web Share button */}
          <button
            onClick={() => handleShare("native")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Cues</span>
          </button>
          
          {/* WhatsApp sharing shortcut */}
          <button
            onClick={() => handleShare("whatsapp")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
            </svg>
            <span>WhatsApp</span>
          </button>
          
          {/* Telegram sharing shortcut */}
          <button
            onClick={() => handleShare("telegram")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:border-sky-500/40 px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.961 4.29-1.353 5.86-.165.666-.465.889-.728.913-.57.053-1.002-.375-1.554-.737-.864-.567-1.351-.92-2.19-1.472-.969-.638-.341-.989.211-1.562.144-.15 2.651-2.431 2.7-2.637.006-.025.011-.119-.049-.172-.06-.053-.149-.035-.213-.021-.091.02-1.545.981-4.362 2.879-.413.284-.787.423-1.121.416-.367-.008-1.074-.208-1.599-.379-.645-.21-1.157-.321-1.112-.677.023-.185.278-.376.766-.572 2.997-1.302 4.995-2.161 5.992-2.576 2.853-1.187 3.444-1.393 3.83-1.4c.085-.001.275.02.398.121.103.085.132.2.143.287.011.087.022.259.011.398z"/>
            </svg>
            <span>Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
}
