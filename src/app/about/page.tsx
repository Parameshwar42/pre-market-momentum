"use client";

import React from "react";
import { Info, HelpCircle, ShieldAlert, Award, Compass, Calculator, BarChart3 } from "lucide-react";

export default function AboutPanel() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10 flex-1 flex flex-col justify-start leading-relaxed">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
          About Antigravity Finance
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          An advanced analytics dashboard calculating domestic opening momentum from global asset cues.
        </p>
      </div>

      {/* Platform Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
          <Calculator className="h-6 w-6 text-indigo-500" />
          <h3 className="font-extrabold text-sm text-foreground">Quantitative Modeling</h3>
          <p className="text-xs text-muted-foreground leading-normal">
            Calculates opening predictions using arbitrage indices instead of simple sentiment surveys.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
          <BarChart3 className="h-6 w-6 text-indigo-500" />
          <h3 className="font-extrabold text-sm text-foreground">Arbitrage Evaluation</h3>
          <p className="text-xs text-muted-foreground leading-normal">
            Converts US-listed ADRs in real time using the live exchange rates to spot premium spreads.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
          <Compass className="h-6 w-6 text-indigo-500" />
          <h3 className="font-extrabold text-sm text-foreground">Macro Cues</h3>
          <p className="text-xs text-muted-foreground leading-normal">
            Integrates volatile commodities like Crude Oil Brent to evaluate domestic inflationary stress.
          </p>
        </div>
      </div>

      {/* Signal Explanation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <HelpCircle className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-black text-foreground tracking-tight">Understanding the Pre-Market India Signal</h2>
        </div>
        <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>
            The <strong>Pre-Market India Signal</strong> is a mathematical indicator designed to predict the opening tone of the Indian equity markets (specifically the Nifty 50 and BSE Sensex indices). The signal categorizes the expected open into <strong>Bullish</strong>, <strong>Bearish</strong>, or <strong>Neutral</strong>, backed by a 0-100% confidence index.
          </p>
          
          <div className="rounded-2xl bg-muted/40 border border-border/40 p-5 space-y-3">
            <h4 className="font-extrabold text-foreground uppercase tracking-wider text-[10px]">Weighted Formula Variables:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-foreground block">1. GIFT Nifty (45% weight)</span>
                <span>Direct proxy trading in Gujarat International Finance Tec-City (GIFT City). It is the single strongest indicator of domestic open.</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-foreground block">2. US ADR Average (30% weight)</span>
                <span>Average overnight performance of major Indian conglomerates listed in New York (HDFC Bank, ICICI Bank, Infosys, Wipro).</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-foreground block">3. USD/INR exchange rate (10% weight)</span>
                <span>Flipped impact. A weaker Dollar (appreciating Rupee) is bullish as it signals institutional fund (FII) inflows.</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-foreground block">4. Brent Crude Oil (10% weight)</span>
                <span>Flipped impact. As India imports over 80% of its oil, falling oil prices reduce inflation and are highly bullish for corporate margins.</span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="font-bold text-foreground block">5. Nifty Bank Index (5% weight)</span>
                <span>Tracks local financial sector strength. Banking counters hold substantial systemic weight in domestic index openings.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Macro Cues Matter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Award className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-black text-foreground tracking-tight">Macroeconomic Indicator Correlation</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-muted-foreground leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-foreground">Why does Brent Crude impact Indian Equities?</h4>
            <p>
              India is highly sensitive to crude price fluctuations. A spike in oil drains foreign reserves, inflates fuel transportation expenses, and depreciates the domestic currency. Thus, drop in oil is structurally positive.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-foreground">What is Option PCR and VIX?</h4>
            <p>
              Put-Call Ratio (PCR) measures derivative volumes. A PCR &gt; 1.0 indicates traders are writing support puts, which is bullish. India VIX measures options implied volatility; a low VIX indicates stable, low-stress market environments.
            </p>
          </div>
        </div>
      </div>

      {/* Required Disclaimer */}
      <div id="disclaimer" className="rounded-3xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 p-6 space-y-3 scroll-mt-24">
        <div className="flex items-center gap-2 text-rose-500">
          <ShieldAlert className="h-6 w-6 text-rose-500" />
          <h3 className="font-extrabold text-sm text-rose-500 uppercase tracking-wider">Regulatory Disclaimer</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Market data is for informational purposes only. This website does not provide investment advice.</strong>
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The indicators, calculators, pre-market signals, and arbitrage analysis tools presented on Antigravity Finance are powered by mock calculations and simulated data feeds, and are meant for educational demonstration purposes only. Trading in equity markets, derivatives, currencies, and commodities involves high risk. We strongly recommend consult a certified financial planner and doing independent due diligence before committing any capital. Under no circumstances shall Antigravity Finance be held liable for any financial losses or damages resulting from trading activities based on the content of this platform.
        </p>
      </div>
    </div>
  );
}
