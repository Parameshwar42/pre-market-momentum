"use client";

import React, { useEffect, useState } from "react";
import { getNewsAlerts, NewsItem } from "@/services/api";
import { 
  Newspaper, 
  Search, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

export default function NewsMarketAlerts() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { label: "All News", value: "all" },
    { label: "India opening", value: "india" },
    { label: "Global Cues", value: "global" },
    { label: "Commodities", value: "commodities" },
    { label: "Currency (Rupee)", value: "currency" },
    { label: "ADR Watchlist", value: "adr" },
  ];

  useEffect(() => {
    setLoading(true);
    getNewsAlerts(activeCategory).then((data) => {
      setNews(data);
      setLoading(false);
    });
  }, [activeCategory]);

  const filteredNews = news.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q)
    );
  });

  // Extract high urgency emergency alerts
  const emergencyAlerts = filteredNews.filter(n => n.urgency === "high" && activeCategory === "all");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-start">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Market News & Bulletins</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Stay updated with high-impact global market announcements and opening cues.
        </p>
      </div>

      {/* Emergency Alerts Section */}
      {emergencyAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider">
            <AlertCircle className="h-4 w-4 text-rose-500 animate-bounce" />
            <span>High-Impact Market Alerts</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyAlerts.map((alert) => (
              <div 
                key={`alert-${alert.id}`} 
                className="rounded-2xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 p-4 relative overflow-hidden glow-negative/5"
              >
                <div className="absolute right-0 top-0 h-16 w-16 -mr-4 -mt-4 bg-rose-500/10 rounded-full blur-md" />
                <div className="flex justify-between items-start gap-4">
                  <span className="rounded bg-rose-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 leading-none">
                    CRITICAL
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">{alert.time}</span>
                </div>
                <h3 className="font-extrabold text-sm text-foreground mt-2 leading-snug">
                  {alert.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {alert.summary}
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-muted-foreground">Source: {alert.source}</span>
                  <span className={`font-mono font-bold flex items-center gap-0.5 ${
                    alert.impactScore >= 0 ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {alert.impactScore >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    Impact: {alert.impactScore >= 0 ? "+" : ""}{alert.impactScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:max-w-md flex items-center">
          <input
            type="text"
            placeholder="Search news headlines / transcripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 pl-9 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Counter */}
        <div className="text-xs text-muted-foreground font-mono font-bold">
          Found {filteredNews.length} articles
        </div>
      </div>

      {/* Category selector pills */}
      <div className="flex w-full overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-border/30">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-lg px-3 py-2 text-xs font-extrabold tracking-tight whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/30"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Articles Feed */}
      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center py-20 gap-2">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <span className="text-xs text-muted-foreground">Loading market bulletins...</span>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-4">
          {filteredNews.map((article) => {
            const isBullish = article.impactScore >= 0;
            return (
              <div 
                key={article.id} 
                className="rounded-2xl border border-border bg-card p-5 hover:border-indigo-500/40 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1.5 flex-1">
                    {/* Badges row */}
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider font-mono">
                        {article.category}
                      </span>
                      {article.urgency === "high" && (
                        <span className="rounded bg-rose-500/10 text-rose-500 text-[9px] font-extrabold uppercase px-2 py-0.5 font-mono">
                          URGENT
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {article.time}
                      </span>
                    </div>

                    <h2 className="text-base font-extrabold text-foreground tracking-tight leading-snug">
                      {article.title}
                    </h2>
                  </div>

                  {/* Impact Indicator Badge */}
                  <div className={`rounded-xl px-3 py-1.5 border text-xs font-bold font-mono self-start flex items-center gap-1 leading-none shrink-0 ${
                    isBullish
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                      : "text-rose-500 bg-rose-500/10 border-rose-500/20"
                  }`}>
                    {isBullish ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    <span>{isBullish ? "BULLISH" : "BEARISH"} ({isBullish ? "+" : ""}{article.impactScore})</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/40">
                  {article.summary}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                  <span>Source: {article.source}</span>
                  {article.link ? (
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-0.5 text-indigo-500 hover:text-indigo-400 hover:underline font-bold transition-all"
                    >
                      Read full article ↗
                    </a>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      Verified Feed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border/60 border-dashed rounded-3xl p-6">
          <Newspaper className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="font-extrabold text-sm text-foreground">No matching headlines</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Try adjusting your search query or switching categories.
          </p>
        </div>
      )}
    </div>
  );
}
