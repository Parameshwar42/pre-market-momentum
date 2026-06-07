"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Search, 
  TrendingUp,
  LineChart,
  Star
} from "lucide-react";
import { useWatchlist } from "./WatchlistContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { watchlist } = useWatchlist();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Live Markets", path: "/live" },
    { label: "News & Alerts", path: "/news" },
    { label: "Commodities", path: "/commodities" },
    { label: "ADR Watchlist", path: "/adr" },
    { label: "Daily Notes", path: "/notes" },
    { label: "Events Calendar", path: "/events" },
    { label: "About", path: "/about" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/live?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-between rounded-xl bg-gradient-to-tr from-primary to-indigo-400 p-2 text-white glow-primary">
              <LineChart className="h-6 w-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-indigo-400 dark:from-indigo-400 dark:to-emerald-400">
                Pre-Market
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase leading-none mt-1">
                Momentum
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                    isActive
                      ? "text-primary dark:text-indigo-400 bg-secondary/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Search, Watchlist Indicator, Dark mode, Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:relative md:flex items-center">
              <input
                type="text"
                placeholder="Search market / symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-60 rounded-lg border border-border bg-background px-3 py-1.5 pl-9 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              />
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
            </form>

            {/* Watchlist Counter */}
            <Link 
              href="/live?filter=watchlist"
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="View Watchlist"
            >
              <Star className={`h-5 w-5 ${watchlist.length > 0 ? "fill-warning text-warning" : ""}`} />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white leading-none">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 transition-transform hover:rotate-12" />
              ) : (
                <Sun className="h-5 w-5 transition-transform hover:rotate-45" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 lg:hidden transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card transition-all animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 px-4 py-3 pb-4">
            {/* Search Input for Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-4">
              <input
                type="text"
                placeholder="Search market / symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 pl-9 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            </form>

            {/* Navigation links */}
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-3 py-2 rounded-lg text-base font-semibold transition-all ${
                    isActive
                      ? "text-primary dark:text-indigo-400 bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
