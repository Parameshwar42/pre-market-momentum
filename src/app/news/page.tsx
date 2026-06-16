"use client";

import React, { useEffect, useState } from "react";
import { getNewsAlerts, NewsItem, getStaticNews } from "@/services/api";
import { 
  Newspaper, 
  Search, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  RefreshCw
} from "lucide-react";

export default function NewsMarketAlerts() {
  const [news, setNews] = useState<NewsItem[]>(getStaticNews());
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSource, setActiveSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [foOnly, setFoOnly] = useState(false);

  const categories = [
    { label: "All News", value: "all" },
    { label: "India opening", value: "india" },
    { label: "Global Cues", value: "global" },
    { label: "Commodities", value: "commodities" },
    { label: "Currency (Rupee)", value: "currency" },
    { label: "ADR Watchlist", value: "adr" },
  ];

  const sources = [
    { label: "All Sources", value: "all" },
    { label: "Economic Times", value: "Economic Times Markets" },
    { label: "Yahoo Finance", value: "Yahoo Finance" },
    { label: "Livemint", value: "Livemint Markets" },
    { label: "Moneycontrol", value: "Moneycontrol" },
  ];

  const getSourceBadgeStyles = (source: string) => {
    switch (source) {
      case "Economic Times Markets":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Yahoo Finance":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Livemint Markets":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
      case "Moneycontrol":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const getSectorEmoji = (sector: string) => {
    switch (sector) {
      case "Banking & Finance": return "🏦";
      case "Information Technology": return "💻";
      case "Automobile": return "🚗";
      case "Metals & Mining": return "🔩";
      case "Energy & Power": return "⚡";
      case "FMCG": return "🛒";
      case "Pharmaceuticals": return "💊";
      case "Telecom": return "📞";
      case "Infrastructure": return "🏗️";
      case "Macroeconomy": return "🌐";
      default: return "📊";
    }
  };

  useEffect(() => {
    setLoading(true);
    getNewsAlerts(activeCategory).then((data) => {
      setNews(data);
      setLoading(false);
    });
  }, [activeCategory]);

  const filteredNews = news.filter((item) => {
    // 1. Search Query Filter
    const matchesSearch = !searchQuery.trim() || (() => {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      );
    })();

    // 2. Source Filter
    const matchesSource = activeSource === "all" || item.source === activeSource;

    // 3. F&O Filter (hides sideways news when active)
    const matchesFo = !foOnly || (item.foAnalysis && item.foAnalysis.bias !== "Neutral / Sideways");

    return matchesSearch && matchesSource && matchesFo;
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

        {/* F&O Toggle & Counter */}
        <div className="flex items-center gap-4 self-end sm:self-auto flex-wrap">
          <button
            onClick={() => setFoOnly(!foOnly)}
            className={`rounded-xl px-3 py-1.5 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all border ${
              foOnly
                ? "bg-indigo-600 border-indigo-600 text-white shadow-sm glow-indigo"
                : "bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>⚡ F&O Actionable Only</span>
            {foOnly && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />}
          </button>

          <div className="text-xs text-muted-foreground font-mono font-bold">
            Found {filteredNews.length} articles
          </div>
        </div>
      </div>

      {/* Category selector pills */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Filter by Topic:</span>
        <div className="flex w-full max-w-full overflow-x-auto pb-2 scrollbar-none gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-extrabold tracking-tight whitespace-nowrap cursor-pointer transition-all ${
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
      </div>

      {/* Source selector pills */}
      <div className="space-y-1.5 border-b border-border/30 pb-3">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Filter by Publisher Source:</span>
        <div className="flex w-full max-w-full overflow-x-auto pb-2 scrollbar-none gap-2">
          {sources.map((src) => {
            const isActive = activeSource === src.value;
            return (
              <button
                key={src.value}
                onClick={() => setActiveSource(src.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-extrabold tracking-tight whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm"
                    : "bg-muted/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/30"
                }`}
              >
                {src.label}
              </button>
            );
          })}
        </div>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded bg-muted px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider font-mono">
                        {article.category}
                      </span>
                      <span className={`rounded border px-2 py-0.5 text-[9px] font-extrabold font-mono uppercase tracking-wider ${getSourceBadgeStyles(article.source)}`}>
                        {article.source.replace(" Markets", "")}
                      </span>
                      {article.foAnalysis && article.foAnalysis.bias !== "Neutral / Sideways" && (
                        <span className="rounded bg-indigo-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 font-mono flex items-center gap-0.5 glow-indigo/40 animate-pulse">
                          ⚡ F&O ACTIVE
                        </span>
                      )}
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

                {/* Target Impact Analysis Area */}
                {((article.affectedSectors && article.affectedSectors.length > 0) || (article.affectedAssets && article.affectedAssets.length > 0)) && (
                  <div className="mt-3 pt-3 border-t border-border/20 space-y-2 bg-muted/20 dark:bg-muted/10 rounded-xl p-3">
                    <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                      🎯 Target Impact Analysis
                    </div>
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-6 flex-wrap">
                      {article.affectedSectors && article.affectedSectors.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Sectors:</span>
                          <div className="flex flex-wrap gap-1">
                            {article.affectedSectors.map((sector) => (
                              <span 
                                key={sector} 
                                className="inline-flex items-center gap-1 rounded bg-background dark:bg-card border border-border/40 px-2 py-0.5 text-[9px] font-extrabold text-foreground"
                              >
                                {getSectorEmoji(sector)} {sector}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {article.affectedAssets && article.affectedAssets.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Assets:</span>
                          <div className="flex flex-wrap gap-1">
                            {article.affectedAssets.map((asset) => (
                              <span 
                                key={asset} 
                                className="inline-flex items-center gap-1 rounded bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400"
                              >
                                📈 {asset}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* F&O Insight Box */}
                {article.foAnalysis && (
                  <div className="mt-3 pt-3 border-t border-border/20 space-y-2 bg-slate-500/5 dark:bg-slate-500/10 rounded-xl p-3.5">
                    <div className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      ⚡ F&O Actionable Insight (Intraday & Swing)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px]">
                      <div className="bg-card border border-border/40 rounded-xl p-2.5 space-y-0.5">
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-tight">Trading Bias</span>
                        <span className={`font-black tracking-tight ${
                          article.foAnalysis.bias === "Bullish" ? "text-emerald-500" :
                          article.foAnalysis.bias === "Bearish" ? "text-rose-500" :
                          article.foAnalysis.bias === "Neutral / High Volatility" ? "text-amber-500" : "text-slate-400"
                        }`}>
                          {article.foAnalysis.bias}
                        </span>
                      </div>
                      <div className="bg-card border border-border/40 rounded-xl p-2.5 space-y-0.5">
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-tight">Horizon</span>
                        <span className="font-extrabold text-foreground tracking-tight">{article.foAnalysis.tradeType}</span>
                      </div>
                      <div className="bg-card border border-border/40 rounded-xl p-2.5 space-y-0.5">
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-tight">Risk Level</span>
                        <span className={`font-extrabold tracking-tight ${
                          article.foAnalysis.riskLevel === "High" ? "text-rose-500" :
                          article.foAnalysis.riskLevel === "Medium" ? "text-amber-500" : "text-emerald-500"
                        }`}>
                          {article.foAnalysis.riskLevel} Risk
                        </span>
                      </div>
                      <div className="bg-card border border-border/40 rounded-xl p-2.5 space-y-0.5">
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-tight">F&O Strategy</span>
                        <span className="font-extrabold text-indigo-500 dark:text-indigo-400 tracking-tight">{article.foAnalysis.suggestedStrategy}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                  <span>Source: {article.source}</span>
                  <a 
                    href="https://www.effectivecpmnetwork.com/aqsjhqbx?key=08538700f7b4c3d019ee7c708955b104" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-0.5 text-indigo-500 hover:text-indigo-400 hover:underline font-bold transition-all"
                  >
                    Read full article ↗
                  </a>
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
