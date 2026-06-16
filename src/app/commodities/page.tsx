"use client";

import React, { useEffect, useState } from "react";
import { getMarketData, MarketItem, getStaticMarketData } from "@/services/api";
import { useWatchlist } from "@/components/WatchlistContext";
import InteractiveChart from "@/components/InteractiveChart";
import { 
  Coins, 
  RefreshCw, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  Volume2
} from "lucide-react";

export default function CommoditiesPanel() {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [marketItems, setMarketItems] = useState<MarketItem[]>(getStaticMarketData());
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("GOLD");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Load and refresh data
  const fetchData = async (forceTick = false) => {
    setIsRefreshing(true);
    try {
      const data = await getMarketData(forceTick);
      setMarketItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 30s
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    fetchData(true);
    setCountdown(30);
  };

  const commodities = marketItems.filter((item) => item.category === "commodities");
  const activeCommodity = commodities.find((c) => c.symbol === selectedSymbol) || commodities[0];

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-2">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground">Loading commodity listings...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-start">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Commodity Trading Desk</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor real-time energy, base metal, and precious metal futures and their global trend charts.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3 bg-muted/40 p-2 border border-border/60 rounded-xl">
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            Next refresh in <strong className="text-foreground">{countdown}s</strong>
          </span>
          <button
            onClick={handleManualRefresh}
            className={`p-1.5 rounded-lg bg-card hover:bg-secondary text-foreground border border-border/80 cursor-pointer ${
              isRefreshing ? "animate-spin" : ""
            }`}
            disabled={isRefreshing}
            title="Refresh feed"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Grid: Selected Commodity Interactive Hero Chart */}
        <div className="lg:col-span-8 space-y-6">
          {activeCommodity && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-muted/30 border border-border/50 rounded-3xl p-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-foreground">{activeCommodity.name}</h2>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground font-mono">
                      {activeCommodity.symbol}
                    </span>
                    {!activeCommodity.symbol.includes("MCX") && (
                      <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-black text-indigo-500 font-sans tracking-wide">
                        CFD
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono leading-none">
                    Session high: {activeCommodity.symbol.includes("MCX") ? "₹" : "$"}{activeCommodity.high.toLocaleString("en-IN", { minimumFractionDigits: 2 })} | Session low: {activeCommodity.symbol.includes("MCX") ? "₹" : "$"}{activeCommodity.low.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Watchlist Star Toggle */}
                  <button
                    onClick={() => {
                      const watched = isInWatchlist(activeCommodity.symbol);
                      if (watched) removeFromWatchlist(activeCommodity.symbol);
                      else addToWatchlist(activeCommodity.symbol);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <Star className={`h-4 w-4 ${isInWatchlist(activeCommodity.symbol) ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                    <span>Watchlist</span>
                  </button>
                </div>
              </div>

              {/* Large Real-Time Interactive Chart */}
              <div className="space-y-4">
                <InteractiveChart data={activeCommodity.history} symbol={activeCommodity.symbol} height={380} />
                <div className="flex justify-end px-2">
                  <a
                    href={
                      activeCommodity.symbol === "USDINR" 
                        ? "https://www.tradingview.com/symbols/USDINR/"
                        : `https://www.tradingview.com/symbols/${
                            activeCommodity.symbol === "GOLD" ? "COMEX-GC1!" :
                            activeCommodity.symbol === "WTI_CRUDE" ? "NYMEX-CL1!" :
                            activeCommodity.symbol === "CRUDEOIL" ? "ICE-BRN1!" :
                            activeCommodity.symbol === "GOLD_MCX" ? "MCX-GOLD1!" :
                            activeCommodity.symbol === "CRUDE_MCX" ? "MCX-CRUDEOIL1!" :
                            activeCommodity.symbol === "COPPER_MCX" ? "MCX-COPPER1!" :
                            activeCommodity.symbol === "NATGAS_MCX" ? "MCX-NATURALGAS1!" : ""
                          }/`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-500 hover:text-indigo-400 hover:underline font-mono"
                  >
                    Analyze Live on TradingView ↗
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right List: Small Selector cards for each commodity */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-black uppercase text-foreground tracking-wider">Select Commodity</h3>
          
          <div className="space-y-3">
            {commodities.map((item) => {
              const isSelected = item.symbol === selectedSymbol;
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "border-border/80 bg-card hover:border-border hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-muted p-1.5 text-foreground shrink-0">
                        <Coins className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-foreground leading-none">{item.name}</h4>
                          {!item.symbol.includes("MCX") && (
                            <span className="rounded bg-indigo-500/10 px-1 py-0.5 text-[8px] font-extrabold text-indigo-500 leading-none">
                              CFD
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground font-mono block mt-1 leading-none">{item.symbol}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-sm font-black text-foreground">
                        {item.symbol.includes("MCX") ? "₹" : "$"}{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold font-mono mt-0.5 ${
                        isPositive ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {isPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                        {isPositive ? "+" : ""}{item.changePercent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
