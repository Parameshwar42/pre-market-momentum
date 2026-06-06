"use client";

import React, { useEffect, useState } from "react";
import { getMarketData, MarketItem } from "@/services/api";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

export default function MarketTicker() {
  const [tickerItems, setTickerItems] = useState<MarketItem[]>([]);

  useEffect(() => {
    // Initial load
    getMarketData().then(setTickerItems);

    // Refresh ticker data every 4 seconds to show live ticking fluctuations
    const interval = setInterval(() => {
      getMarketData(true).then(setTickerItems);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (tickerItems.length === 0) return null;

  // We filter main indices for the ticker
  const targetSymbols = ["GIFTNIFTY", "NIFTY50", "BANKNIFTY", "USDINR", "CRUDEOIL", "GOLD"];
  const displayItems = tickerItems.filter((item) => targetSymbols.includes(item.symbol));
  
  // Double the list to create a seamless looping effect
  const loopingItems = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="w-full h-9 bg-slate-900 border-b border-slate-800 text-white text-xs flex items-center overflow-hidden z-40 select-none">
      <div className="flex h-full items-center bg-indigo-600 px-3 font-semibold text-[10px] uppercase tracking-wider text-white shrink-0 gap-1 select-none z-10">
        <TrendingUp className="h-3 w-3 animate-bounce" />
        <span>Live Ticker</span>
      </div>
      <div className="ticker-wrap relative w-full h-full flex items-center overflow-hidden whitespace-nowrap">
        <div className="ticker-content flex items-center gap-12 pl-6">
          {loopingItems.map((item, idx) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={`${item.symbol}-${idx}`}
                className="inline-flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-800/80 px-2 rounded transition-colors"
              >
                <span className="font-semibold text-slate-300">
                  {item.symbol === "GIFTNIFTY" 
                    ? "GIFT NIFTY" 
                    : item.symbol === "NIFTY50" 
                    ? "Nifty 50" 
                    : item.symbol === "BANKNIFTY" 
                    ? "Nifty Bank" 
                    : item.name.split(" ")[0]}
                </span>
                <span className="font-mono text-white font-medium">
                  {item.price.toLocaleString("en-IN", {
                    minimumFractionDigits: item.category === "currencies" ? 3 : 2,
                    maximumFractionDigits: item.category === "currencies" ? 3 : 2,
                  })}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold font-mono ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {isPositive ? "+" : ""}
                  {item.changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
