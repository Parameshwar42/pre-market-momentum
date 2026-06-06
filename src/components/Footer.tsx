"use client";

import React from "react";
import Link from "next/link";
import { LineChart, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
              <div className="flex h-8 w-8 items-center justify-between rounded-lg bg-primary p-1.5 text-white">
                <LineChart className="h-5 w-5" />
              </div>
              <span className="text-base font-extrabold tracking-wider uppercase text-foreground">
                Pre-Market Momentum
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Live updates and predictive metrics for the Indian markets. Powered by state-of-the-art indicators including the Pre-Market India Signal and real-time global arbitrage watchlists.
            </p>
            {/* API Status Light */}
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-muted-foreground">System Status: Connected (Simulated Feed)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-foreground uppercase">Markets</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/live" className="text-muted-foreground hover:text-foreground transition-colors">
                  Live Market Feed
                </Link>
              </li>
              <li>
                <Link href="/commodities" className="text-muted-foreground hover:text-foreground transition-colors">
                  Commodities Panel
                </Link>
              </li>
              <li>
                <Link href="/adr" className="text-muted-foreground hover:text-foreground transition-colors">
                  ADR Watchlist
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  Market News & Cues
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Daily Market Notes
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-foreground uppercase">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Indicator Math
                </Link>
              </li>
              <li>
                <Link href="/about#disclaimer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-warning" />
                  Full Disclaimer
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">Version 1.4.2-stable</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-8 pt-8 border-t border-border/60">
          <div className="rounded-xl bg-muted p-4 border border-border/80 text-center">
            <p className="text-xs text-muted-foreground leading-normal max-w-4xl mx-auto">
              <strong>Disclaimer:</strong> Market data is for informational purposes only. This website does not provide investment advice. Trading in financial instruments involves risk, and you should consult a licensed financial advisor before making any investment decisions. Pre-Market Momentum is not responsible for any trading losses incurred.
            </p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
            <span>
              &copy; {currentYear} Pre-Market Momentum. All rights reserved.
            </span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
