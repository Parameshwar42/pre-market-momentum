"use client";

import React, { useEffect, useState } from "react";
import { getMarketData, MarketItem } from "@/services/api";
import { useWatchlist } from "@/components/WatchlistContext";
import MarketCard from "@/components/MarketCard";
import { 
  FileSpreadsheet, 
  RefreshCw, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Scale, 
  Info
} from "lucide-react";

interface ADRDetails {
  symbol: string;
  name: string;
  adrPrice: number;
  changePercent: number;
  conversionRatio: number; // 1 ADR = X Equity Shares
  impliedINR: number;
  domesticClose: number;
  premiumPercent: number;
  openingImpact: "High (Bullish)" | "Medium (Bullish)" | "Low (Bullish)" | "High (Bearish)" | "Medium (Bearish)" | "Low (Bearish)" | "Neutral";
}

export default function ADRWatchlist() {
  const { watchlist } = useWatchlist();
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  const adrs = marketItems.filter((item) => item.category === "adr");
  const usdInr = marketItems.find((item) => item.symbol === "USDINR")?.price || 83.425;

  // Compile detailed arbitrage list
  // conversionRatio: e.g. HDFC 1 ADR = 3 Shares, ICICI 1 ADR = 2 Shares, Infosys 1 ADR = 1 Share
  const getDomesticClose = (symbol: string): number => {
    switch (symbol) {
      case "HDB": return 1675.00;
      case "IBN": return 1145.00;
      case "INFY": return 1533.00;
      case "WIT": return 454.50;
      case "RDY": return 6120.00;
      case "AXBKY": return 1180.00;
      default: return 1000.00;
    }
  };

  const getRatio = (symbol: string): number => {
    switch (symbol) {
      case "HDB": return 3; // 1 ADR = 3 domestic shares
      case "IBN": return 2; // 1 ADR = 2 domestic shares
      case "AXBKY": return 5; // 1 ADR = 5 domestic shares
      default: return 1;    // 1 ADR = 1 domestic share
    }
  };

  const adrAnalysisList: ADRDetails[] = adrs.map((item) => {
    const ratio = getRatio(item.symbol);
    const implied = (item.price * usdInr) / ratio;
    const domestic = getDomesticClose(item.symbol);
    
    // Implied premium/discount
    const premium = ((implied - domestic) / domestic) * 100;
    
    // Calculate opening impact weights
    let impact: ADRDetails["openingImpact"] = "Neutral";
    if (premium > 0.8) {
      impact = item.symbol === "HDB" || item.symbol === "INFY" ? "High (Bullish)" : "Medium (Bullish)";
    } else if (premium > 0.1) {
      impact = "Low (Bullish)";
    } else if (premium < -0.8) {
      impact = item.symbol === "RDY" ? "Medium (Bearish)" : "High (Bearish)";
    } else if (premium < -0.1) {
      impact = "Low (Bearish)";
    }

    return {
      symbol: item.symbol,
      name: item.name.replace(" ADR", ""),
      adrPrice: item.price,
      changePercent: item.changePercent,
      conversionRatio: ratio,
      impliedINR: implied,
      domesticClose: domestic,
      premiumPercent: premium,
      openingImpact: impact,
    };
  });

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-2">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground">Loading ADR metrics...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-start">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">ADR Arbitrage Desk</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Analyze pricing spreads between US-listed ADRs and domestic NSE counterparts converted at live USD/INR rates.
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

      {/* Info card */}
      <div className="rounded-2xl bg-muted/50 border border-border/40 p-4 flex gap-3 items-start max-w-4xl">
        <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">How to read ADR Arbitrage</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            US ADR stocks trade overnight while Indian markets are closed. If an ADR stock closes at a premium (implied Rupee price is higher than the last domestic close on the NSE), it usually triggers buying pressure at the Indian market open. Conversion ratio indicates how many Indian equity shares correspond to one US-listed ADR.
          </p>
        </div>
      </div>

      {/* Arbitrage Analysis Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border/60 flex items-center gap-2">
          <Scale className="h-5 w-5 text-indigo-500" />
          <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Arbitrage & Premium Spread Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/60 text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                <th className="p-4">Stock Name (ADR Symbol)</th>
                <th className="p-4 text-right">ADR Price (USD)</th>
                <th className="p-4 text-center">Conversion Ratio</th>
                <th className="p-4 text-right">Implied INR Price</th>
                <th className="p-4 text-right">NSE Prev Close (INR)</th>
                <th className="p-4 text-right">Arbitrage Premium</th>
                <th className="p-4 text-center">NSE Opening Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {adrAnalysisList.map((row) => {
                const isPremium = row.premiumPercent >= 0;
                return (
                  <tr key={row.symbol} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">
                      <div className="flex flex-col">
                        <span>{row.name}</span>
                        <span className="text-[10px] font-bold text-muted-foreground font-mono mt-0.5">{row.symbol}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-foreground">
                      ${row.adrPrice.toFixed(2)}
                      <span className={`text-[10px] block mt-0.5 font-bold ${
                        row.changePercent >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {row.changePercent >= 0 ? "+" : ""}{row.changePercent}%
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-muted-foreground">
                      1 ADR = {row.conversionRatio} Share{row.conversionRatio > 1 ? "s" : ""}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-foreground">
                      ₹{row.impliedINR.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-muted-foreground">
                      ₹{row.domesticClose.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`p-4 text-right font-mono font-black ${
                      isPremium ? "text-emerald-500" : "text-rose-500"
                    }`}>
                      {isPremium ? "+" : ""}
                      {row.premiumPercent.toFixed(2)}%
                    </td>
                    <td className="p-4 text-center">
                      <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border ${
                        row.openingImpact.includes("Bullish")
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : row.openingImpact.includes("Bearish")
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                          : "bg-slate-500/10 border-slate-500/20 text-slate-500"
                      }`}>
                        {row.openingImpact}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of basic ADR cards for sparkline views */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-black uppercase text-foreground tracking-wider">ADR Live Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adrs.map((item) => (
            <MarketCard key={item.symbol} item={item} onRefresh={() => fetchData(true)} />
          ))}
        </div>
      </div>
    </div>
  );
}
