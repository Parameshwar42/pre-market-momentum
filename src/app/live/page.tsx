"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getMarketData, MarketItem } from "@/services/api";
import { useWatchlist } from "@/components/WatchlistContext";
import MarketCard from "@/components/MarketCard";
import { 
  Activity, 
  Search, 
  RefreshCw, 
  Star, 
  Layers, 
  Globe, 
  Coins, 
  DollarSign, 
  FileSpreadsheet
} from "lucide-react";

type CategoryFilter = "all" | "watchlist" | "indices" | "currencies" | "commodities" | "adr" | "global";

function LiveMarketUpdatesContent() {
  const searchParams = useSearchParams();
  const { watchlist } = useWatchlist();

  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [countdown, setCountdown] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync Header search query param
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
    const filter = searchParams.get("filter") as CategoryFilter | null;
    if (filter) {
      setActiveCategory(filter);
    }
  }, [searchParams]);

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

  // Filter items based on category & search query
  const filteredItems = marketItems.filter((item) => {
    // 1. Filter by category tab
    if (activeCategory === "watchlist") {
      if (!watchlist.includes(item.symbol)) return false;
    } else if (activeCategory !== "all") {
      if (item.category !== activeCategory) return false;
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchSymbol = item.symbol.toLowerCase().includes(q);
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      return matchSymbol || matchName || matchCat;
    }

    return true;
  });

  const categories: { label: string; value: CategoryFilter; icon: React.ReactNode }[] = [
    { label: "All Markets", value: "all", icon: <Layers className="h-3.5 w-3.5" /> },
    { label: "Watchlist", value: "watchlist", icon: <Star className="h-3.5 w-3.5 fill-warning text-warning" /> },
    { label: "Indices", value: "indices", icon: <Activity className="h-3.5 w-3.5" /> },
    { label: "Currencies", value: "currencies", icon: <DollarSign className="h-3.5 w-3.5" /> },
    { label: "Commodities", value: "commodities", icon: <Coins className="h-3.5 w-3.5" /> },
    { label: "ADR stocks", value: "adr", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
    { label: "Global Cues", value: "global", icon: <Globe className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-start">
      {/* Header and Sync State */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Live Market Terminal</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse live market listings. Items flash automatically as prices fluctuate in the system.
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

      {/* Navigation Tabs and Search Grid */}
      <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md flex items-center">
          <input
            type="text"
            placeholder="Search by name, symbol, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 pl-9 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Active categories count */}
        <div className="text-xs text-muted-foreground font-mono self-end lg:self-center font-bold">
          Showing {filteredItems.length} of {marketItems.length} symbols
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-border/30">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                window.history.pushState({}, "", `/live?filter=${cat.value}`);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold tracking-tight whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/30"
              }`}
            >
              {cat.icon}
              {cat.label}
              {cat.value === "watchlist" && ` (${watchlist.length})`}
            </button>
          );
        })}
      </div>

      {/* Main Grid display */}
      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center py-20 gap-2">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <span className="text-xs text-muted-foreground">Loading market feeds...</span>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MarketCard key={item.symbol} item={item} onRefresh={() => fetchData(true)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-border/60 border-dashed rounded-3xl p-6">
          <Activity className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="font-extrabold text-sm text-foreground">No matching instruments</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            We couldn&apos;t find any assets matching &ldquo;{searchQuery}&rdquo; in category &ldquo;{activeCategory}&rdquo;. Try clearing filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
              window.history.pushState({}, "", `/live`);
            }}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/95 transition-all shadow cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function LiveMarketUpdates() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <span className="text-xs font-semibold text-muted-foreground">Loading market terminal...</span>
      </div>
    }>
      <LiveMarketUpdatesContent />
    </Suspense>
  );
}
