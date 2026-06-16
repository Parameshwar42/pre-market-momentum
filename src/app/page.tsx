"use client";

import React, { useEffect, useState } from "react";
import { getMarketData, calculatePreMarketSignal, MarketItem, getStaticMarketData } from "@/services/api";
import { useWatchlist } from "@/components/WatchlistContext";
import PreMarketSignal from "@/components/PreMarketSignal";
import SentimentIndicator from "@/components/SentimentIndicator";
import MarketCard from "@/components/MarketCard";
import { 
  TrendingUp, 
  RefreshCw, 
  Clock, 
  Star, 
  HelpCircle,
  Activity,
  ChevronRight,
  TrendingDown,
  Info,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function HomeDashboard() {
  const { watchlist } = useWatchlist();
  const [marketItems, setMarketItems] = useState<MarketItem[]>(getStaticMarketData());
  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // in seconds
  const [countdown, setCountdown] = useState<number>(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load initial data
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
  }, []);

  // Countdown timer for auto-refresh
  useEffect(() => {
    if (refreshInterval === 0) return; // paused

    setCountdown(refreshInterval);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData(true); // force a data tick update
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  const handleManualRefresh = () => {
    fetchData(true);
    setCountdown(refreshInterval);
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Loading dashboard feeds...</span>
      </div>
    );
  }

  // Calculate pre-market signals based on loaded items
  const signalData = calculatePreMarketSignal(marketItems);

  // Group market items for layout
  const coreSymbols = ["GIFTNIFTY", "USDINR", "CRUDEOIL"];
  const coreItems = marketItems.filter((item) => coreSymbols.includes(item.symbol));
  
  const watchlistItems = marketItems.filter((item) => watchlist.includes(item.symbol));

  const totalMarketsCount = marketItems.length;
  const positiveMarketsCount = marketItems.filter(item => item.change >= 0).length;
  const negativeMarketsCount = totalMarketsCount - positiveMarketsCount;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-1 flex flex-col justify-start">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border/70 rounded-3xl p-6 glow-primary/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Indian Pre-Market Open
            </span>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 font-mono">
              <Clock className="h-3.5 w-3.5" />
              {new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} | {new Date().toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
            Finance Market Intelligence
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Real-time arbitrage tracking across global indices, commodities, and currency feeds. Opening indicators computed using live GIFT NIFTY premiums.
          </p>
        </div>

        {/* Refresh controls */}
        <div className="flex items-center gap-3 shrink-0 bg-muted/50 p-2.5 rounded-2xl border border-border/40">
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">Auto Refresh</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-foreground focus:outline-none mt-1 cursor-pointer"
            >
              <option value={10} className="bg-card">Every 10s</option>
              <option value={30} className="bg-card">Every 30s</option>
              <option value={60} className="bg-card">Every 60s</option>
              <option value={0} className="bg-card">Paused</option>
            </select>
          </div>

          {/* Countdown indicator ring or label */}
          {refreshInterval > 0 ? (
            <div className="h-9 w-9 relative flex items-center justify-center rounded-full bg-secondary border border-border/80 text-xs font-mono font-bold text-foreground">
              {countdown}s
            </div>
          ) : (
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary text-xs text-muted-foreground" title="Paused">
              ⏸
            </div>
          )}

          <button
            onClick={handleManualRefresh}
            className={`p-2.5 rounded-xl bg-primary text-white hover:bg-primary/95 transition-all shadow cursor-pointer ${
              isRefreshing ? "animate-spin" : ""
            }`}
            title="Force refresh data"
            disabled={isRefreshing}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Access CTAs (Millennial/Gen-Z Focused Psychology) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CTA 1: Live Market Terminal */}
        <Link 
          href="/live"
          className="group relative rounded-3xl border border-border bg-gradient-to-br from-emerald-500/5 to-secondary/30 p-6 overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 active:scale-98 cursor-pointer"
        >
          {/* Glowing background blur effect */}
          <div className="absolute right-0 bottom-0 h-32 w-32 -mr-8 -mb-8 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all duration-500" />
          
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Live Terminal
              </div>
              <h3 className="text-xl font-extrabold text-foreground tracking-tight group-hover:text-emerald-500 transition-colors duration-200">
                Live Market Desk
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Monitor live Indian stock indices, US arbitrage spreads, and domestic MCX commodities with dynamic charting.
              </p>
            </div>
            
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-1 text-xs font-bold text-emerald-500 group-hover:underline relative z-10">
            <span>Explore Live Dashboard</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* CTA 2: News & F&O Bulletins */}
        <Link 
          href="/news"
          className="group relative rounded-3xl border border-border bg-gradient-to-br from-indigo-500/5 to-secondary/30 p-6 overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 active:scale-98 cursor-pointer"
        >
          {/* Glowing background blur effect */}
          <div className="absolute right-0 bottom-0 h-32 w-32 -mr-8 -mb-8 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all duration-500" />
          
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">
                🔔 F&O Signal Active
              </div>
              <h3 className="text-xl font-extrabold text-foreground tracking-tight group-hover:text-indigo-500 transition-colors duration-200">
                News & F&O Bulletins
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Get real-time news bulletins, target impact analysis, and actionable intraday & swing options trade biases.
              </p>
            </div>
            
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-500 group-hover:underline relative z-10">
            <span>View Actionable Insights</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* CTA 3: Events Calendar */}
        <Link 
          href="/events"
          className="group relative rounded-3xl border border-border bg-gradient-to-br from-amber-500/5 to-secondary/30 p-6 overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5 active:scale-98 cursor-pointer"
        >
          {/* Glowing background blur effect */}
          <div className="absolute right-0 bottom-0 h-32 w-32 -mr-8 -mb-8 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all duration-500" />
          
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none">
                📅 Volatility Calendar
              </div>
              <h3 className="text-xl font-extrabold text-foreground tracking-tight group-hover:text-amber-500 transition-colors duration-200">
                Events Calendar
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Track high-impact macroeconomic dates, rate announcements, and monthly playbooks with countdown warnings.
              </p>
            </div>
            
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-1 text-xs font-bold text-amber-500 group-hover:underline relative z-10">
            <span>Explore Events Hub</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Global cue counts ticker row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/70 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Market Breadth</span>
          <span className="text-xl font-mono font-black text-foreground mt-1.5 flex items-baseline gap-1">
            {positiveMarketsCount} / {totalMarketsCount}
            <span className="text-xs text-muted-foreground font-medium">green</span>
          </span>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-2 flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${(positiveMarketsCount/totalMarketsCount)*100}%` }} />
            <div className="bg-rose-500 h-full" style={{ width: `${(negativeMarketsCount/totalMarketsCount)*100}%` }} />
          </div>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">GIFT Nifty Gap</span>
          <span className={`text-xl font-mono font-black mt-1.5 flex items-baseline gap-1 ${
            marketItems[0].change >= 0 ? "text-emerald-500" : "text-rose-500"
          }`}>
            {marketItems[0].change >= 0 ? "+" : ""}{marketItems[0].changePercent}%
          </span>
          <span className="text-[9px] text-muted-foreground leading-none mt-1">Opening prediction base proxy.</span>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">US ADR Average</span>
          <span className="text-xl font-mono font-black text-foreground mt-1.5">
            +1.28%
          </span>
          <span className="text-[9px] text-emerald-500 font-bold leading-none mt-1">Bullish arbitrage gap</span>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Crude Oil Pressure</span>
          <span className="text-xl font-mono font-black text-emerald-500 mt-1.5">
            -1.36%
          </span>
          <span className="text-[9px] text-muted-foreground leading-none mt-1">Easing inflation tailwind.</span>
        </div>
      </div>

      {/* Signal and Sentiment Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <PreMarketSignal signalData={signalData} />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <SentimentIndicator marketItems={marketItems} />
          
          {/* Adsterra 160x300 Skyscraper Banner */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden shadow-sm">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Sponsored Link</span>
            <div className="w-[160px] h-[300px] shrink-0 relative">
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    atOptions = {
                      'key' : 'cbe27a7676cac475c0ee7254fc828972',
                      'format' : 'iframe',
                      'height' : 300,
                      'width' : 160,
                      'params' : {}
                    };
                  `
                }}
              />
              <script
                async
                src="https://www.highperformanceformat.com/cbe27a7676cac475c0ee7254fc828972/invoke.js"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Core Market Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Core Market Indicators
          </h2>
          <Link href="/live" className="text-xs font-bold text-primary dark:text-indigo-400 hover:underline flex items-center gap-0.5">
            See all live feeds
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreItems.map((item) => (
            <MarketCard key={item.symbol} item={item} onRefresh={() => fetchData(true)} />
          ))}
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="space-y-4 bg-muted/30 border border-border/50 rounded-3xl p-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h2 className="text-base font-black text-foreground tracking-tight flex items-center gap-2">
            <Star className="h-5 w-5 text-warning fill-warning" />
            Personal Watchlist Panel
          </h2>
          <span className="text-xs font-bold text-muted-foreground font-mono bg-secondary px-2.5 py-1 rounded-lg">
            {watchlistItems.length} Saved Symbols
          </span>
        </div>

        {watchlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistItems.map((item) => (
              <MarketCard key={item.symbol} item={item} onRefresh={() => fetchData(true)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-2xl border border-border/80 border-dashed">
            <Star className="h-8 w-8 text-muted-foreground/50 stroke-dasharray mb-3" />
            <h3 className="font-bold text-sm text-foreground">Your watchlist is empty</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Add indices, ADR stocks, or commodities to this panel by clicking the star icons on any of the market cards.
            </p>
            <Link 
              href="/live" 
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/95 transition-all shadow"
            >
              Browse Live Feeds
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
