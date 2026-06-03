"use client";

import React, { useState } from "react";
import { MarketItem } from "@/services/api";
import { useWatchlist } from "./WatchlistContext";
import MiniChart from "./MiniChart";
import InteractiveChart from "./InteractiveChart";
import { Star, ArrowUpRight, ArrowDownRight, Activity, RefreshCw } from "lucide-react";

interface MarketCardProps {
  item: MarketItem;
  onRefresh?: () => void;
}

export default function MarketCard({ item, onRefresh }: MarketCardProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const watched = isInWatchlist(item.symbol);

  const isPositive = item.change >= 0;
  const pricePrecision = item.category === "currencies" ? 3 : 2;

  // Helper to check if Indian market is open (9:15 AM - 3:30 PM IST, Monday - Friday)
  const isIndianMarketOpen = () => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        weekday: "short"
      });
      const parts = formatter.formatToParts(new Date());
      const partMap: Record<string, string> = {};
      parts.forEach(p => partMap[p.type] = p.value);
      
      const weekday = partMap.weekday; // 'Mon', 'Tue', etc.
      const hour = parseInt(partMap.hour, 10);
      const minute = parseInt(partMap.minute, 10);
      
      if (weekday === "Sat" || weekday === "Sun") return false;
      
      const timeInMinutes = hour * 60 + minute;
      const startMinutes = 9 * 60 + 15; // 9:15 AM
      const endMinutes = 15 * 60 + 30; // 3:30 PM
      
      return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
    } catch (e) {
      return true; // Fallback to open if timezone check fails
    }
  };

  const isInd = item.category === "indices";
  const marketOpen = !isInd || isIndianMarketOpen();

  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering expand/collapse
    if (watched) {
      removeFromWatchlist(item.symbol);
    } else {
      addToWatchlist(item.symbol);
    }
  };

  const handleSyncClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSyncing || !onRefresh) return;
    setIsSyncing(true);
    try {
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`relative rounded-2xl bg-card border border-border/80 hover:border-indigo-500/50 p-4 transition-all duration-200 cursor-pointer shadow-sm ${
        isExpanded ? "ring-1 ring-primary/30 glow-primary" : "hover:shadow-md"
      } ${
        isPositive ? "glow-positive/5" : "glow-negative/5"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Symbol & Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-foreground tracking-tight truncate">
              {item.symbol === "GIFTNIFTY" ? "GIFT NIFTY" : item.name}
            </h3>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground font-mono">
              {item.symbol}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1 block">
            {item.category}
          </span>
        </div>

        {/* Watchlist & Refresh Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {onRefresh && (
            <button
              onClick={handleSyncClick}
              className="p-1.5 rounded-lg border border-border/40 hover:bg-secondary cursor-pointer transition-colors"
              title="Refresh LTP"
              disabled={isSyncing}
            >
              <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isSyncing ? "animate-spin text-indigo-500" : ""}`} />
            </button>
          )}
          <button
            onClick={handleWatchClick}
            className={`p-1.5 rounded-lg border border-border/40 hover:bg-secondary cursor-pointer transition-colors`}
            title={watched ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Star className={`h-3.5 w-3.5 ${watched ? "fill-warning text-warning" : "text-muted-foreground"}`} />
          </button>
        </div>
      </div>

      {/* Pricing and sparkline area */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xl font-black font-mono text-foreground tracking-tight flex items-baseline">
            {item.price.toLocaleString("en-IN", {
              minimumFractionDigits: pricePrecision,
              maximumFractionDigits: pricePrecision,
            })}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold font-mono ${
                isPositive 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {item.changePercent}%
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {isPositive ? "+" : ""}
              {item.change.toFixed(pricePrecision)}
            </span>
          </div>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="shrink-0 flex items-center">
          <MiniChart data={item.sparkline} isPositive={isPositive} width={100} height={35} />
        </div>
      </div>

      {/* Last Updated Timestamp & Sparkline Activity Icon */}
      <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[9px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1">
          {marketOpen ? (
            <>
              <Activity className={`h-2.5 w-2.5 ${isPositive ? "text-emerald-500" : "text-rose-500"} animate-pulse`} />
              Live Fluctuations
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              Market Closed (LTP Frozen)
            </>
          )}
        </span>
        <span>
          Updated {new Date(item.lastUpdated).toLocaleTimeString()}
        </span>
      </div>

      {/* Expandable historical chart pane */}
      {isExpanded && (
        <div 
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking within the chart
          className="mt-4 pt-4 border-t border-border/60 animate-in fade-in zoom-in-95 duration-200 space-y-4"
        >
          {item.symbol === "GIFTNIFTY" && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] leading-relaxed text-amber-600 dark:text-amber-400">
              <strong>Notice:</strong> GIFT Nifty is computed here as a proxy from Nifty 50. Since the domestic spot market is closed after-hours, this ticker remains frozen. For real-time 21-hour futures trading activity, please click the <strong>Analyze Live on TradingView</strong> link below to view the official NSE IX contract.
            </div>
          )}

          <InteractiveChart data={item.history} symbol={item.symbol} height={240} />
          
          <div className="flex justify-end px-2">
            <a
              href={
                item.symbol === "USDINR" 
                  ? "https://www.tradingview.com/symbols/USDINR/"
                  : ["GOLD", "WTI_CRUDE", "CRUDEOIL", "GOLD_MCX", "CRUDE_MCX", "COPPER_MCX", "NATGAS_MCX"].includes(item.symbol)
                  ? `https://www.tradingview.com/symbols/${
                      item.symbol === "GOLD" ? "COMEX-GC1!" :
                      item.symbol === "WTI_CRUDE" ? "NYMEX-CL1!" :
                      item.symbol === "CRUDEOIL" ? "ICE-BRN1!" :
                      item.symbol === "GOLD_MCX" ? "MCX-GOLD1!" :
                      item.symbol === "CRUDE_MCX" ? "MCX-CRUDEOIL1!" :
                      item.symbol === "COPPER_MCX" ? "MCX-COPPER1!" :
                      item.symbol === "NATGAS_MCX" ? "MCX-NATURALGAS1!" : ""
                    }/`
                  : `https://www.tradingview.com/symbols/${
                      item.symbol === "GIFTNIFTY" ? "NSEIX-NIFTY1!" :
                      item.symbol === "NIFTY50" ? "NSE-NIFTY" :
                      item.symbol === "BANKNIFTY" ? "NSE-BANKNIFTY" :
                      item.symbol === "FINNIFTY" ? "NSE-FINNIFTY" :
                      item.symbol === "SENSEX" ? "BSE-SENSEX" :
                      item.symbol === "NIFTY_MID_SELECT" ? "NSE-MIDCPNIFTY" :
                      item.symbol === "BSE_BANKEX" ? "BSE-BANKEX" :
                      item.symbol === "NIFTY_100" ? "NSE-CNX100" :
                      item.symbol === "NIFTY_MIDCAP_100" ? "NSE-MIDCAP100" :
                      item.symbol === "NIFTY_500" ? "NSE-NIFTY500" :
                      item.symbol === "NIFTY_TOTAL_MARKET" ? "NSE-NIFTY" :
                      item.symbol === "NIFTY_NEXT_50" ? "NSE-NIFTY_NEXT_50" :
                      item.symbol === "BSE_100" ? "BSE-BSE100" :
                      item.symbol === "NIFTY_AUTO" ? "NSE-NIFTY_AUTO" :
                      item.symbol === "NIFTY_SMALLCAP_100" ? "NSE-NIFTY_SMALLCAP_100" :
                      item.symbol === "NIFTY_FMCG" ? "NSE-NIFTY_FMCG" :
                      item.symbol === "NIFTY_METAL" ? "NSE-NIFTY_METAL" :
                      item.symbol === "NIFTY_PHARMA" ? "NSE-NIFTY_PHARMA" :
                      item.symbol === "NIFTY_PSU_BANK" ? "NSE-NIFTY_PSU_BANK" :
                      item.symbol === "NIFTY_IT" ? "NSE-NIFTY_IT" :
                      item.symbol === "BSE_SMALLCAP" ? "BSE-BSE_SMALLCAP" :
                      item.symbol
                    }/`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-400 hover:underline font-mono"
            >
              Analyze Live on TradingView ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
