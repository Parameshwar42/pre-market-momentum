"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

// Initial watchlist items for a premium onboarding experience
const DEFAULT_WATCHLIST = ["GIFTNIFTY", "USDINR", "INFY", "CRUDEOIL"];

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        setWatchlist(DEFAULT_WATCHLIST);
      }
    } else {
      setWatchlist(DEFAULT_WATCHLIST);
      localStorage.setItem("watchlist", JSON.stringify(DEFAULT_WATCHLIST));
    }
    setLoaded(true);
  }, []);

  const addToWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      if (prev.includes(symbol)) return prev;
      const updated = [...prev, symbol];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const updated = prev.filter((item) => item !== symbol);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist: loaded ? watchlist : DEFAULT_WATCHLIST, // fallback to defaults during loading/hydration
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
