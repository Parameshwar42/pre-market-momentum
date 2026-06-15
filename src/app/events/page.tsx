"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  AlertTriangle, 
  Star, 
  Trash2, 
  Plus, 
  Copy, 
  Check, 
  Globe, 
  Activity, 
  Info, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Filter,
  CheckCircle,
  FileText,
  Edit,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import initialEvents from "@/data/calendar.json";

interface MarketEvent {
  id: string;
  title: string;
  date: string;
  country: "IN" | "US";
  priority: number; // 1 to 5 stars
  source: string;
  sourceUrl?: string;
  description: string;
  impact: string;
  result?: string;
}

interface PlaybookMonth {
  name: string;
  indiaEvents: string[];
  globalEvents: string[];
  sectorsImpacted: string[];
  watch: string[];
  opportunities: string[];
}

export default function MarketCalendar() {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"calendar" | "checklist" | "playbook">("calendar");
  const [selectedMonth, setSelectedMonth] = useState<string>("JUNE");

  // Admin form state
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formCountry, setFormCountry] = useState<"IN" | "US">("IN");
  const [formPriority, setFormPriority] = useState(3);
  const [formSource, setFormSource] = useState("");
  const [formSourceUrl, setFormSourceUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImpact, setFormImpact] = useState("");
  const [formResult, setFormResult] = useState("");

  // Load events
  useEffect(() => {
    const savedEvents = localStorage.getItem("premarket_calendar_events_v4");
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        setEvents(initialEvents as MarketEvent[]);
      }
    } else {
      setEvents(initialEvents as MarketEvent[]);
      localStorage.setItem("premarket_calendar_events_v4", JSON.stringify(initialEvents));
    }

    // Check if admin mode is active in URL
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("admin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  // Helper: calculate date difference
  const getDaysDiff = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    eventDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper: format countdown text
  const getCountdownText = (diffDays: number) => {
    if (diffDays === 0) return "Happening Today";
    if (diffDays === 1) return "Happening Tomorrow";
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays === -1) return "Passed 1 day ago";
    return `Passed ${Math.abs(diffDays)} days ago`;
  };

  // Admin handlers
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate || !formDescription) return;

    if (editingEventId) {
      // Edit mode
      const updated = events.map(evt => {
        if (evt.id === editingEventId) {
          return {
            ...evt,
            title: formTitle,
            date: formDate,
            country: formCountry,
            priority: Number(formPriority),
            source: formSource || "Manual Update",
            sourceUrl: formSourceUrl || undefined,
            description: formDescription,
            impact: formImpact || "Market volatility expected.",
            result: formResult || undefined
          };
        }
        return evt;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEvents(updated);
      localStorage.setItem("premarket_calendar_events_v4", JSON.stringify(updated));
      setEditingEventId(null);
    } else {
      // Add mode
      const id = `${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      const newEvent: MarketEvent = {
        id,
        title: formTitle,
        date: formDate,
        country: formCountry,
        priority: Number(formPriority),
        source: formSource || "Manual Update",
        sourceUrl: formSourceUrl || undefined,
        description: formDescription,
        impact: formImpact || "Market volatility expected.",
        result: formResult || undefined
      };

      const updated = [...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(updated);
      localStorage.setItem("premarket_calendar_events_v4", JSON.stringify(updated));
    }

    // Reset Form
    resetForm();
    setIsAddingEvent(false);
  };

  const resetForm = () => {
    setEditingEventId(null);
    setFormTitle("");
    setFormDate("");
    setFormCountry("IN");
    setFormPriority(3);
    setFormSource("");
    setFormSourceUrl("");
    setFormDescription("");
    setFormImpact("");
    setFormResult("");
  };

  const handleEditClick = (event: MarketEvent) => {
    setEditingEventId(event.id);
    setFormTitle(event.title);
    setFormDate(event.date);
    setFormCountry(event.country);
    setFormPriority(event.priority);
    setFormSource(event.source);
    setFormSourceUrl(event.sourceUrl || "");
    setFormDescription(event.description);
    setFormImpact(event.impact);
    setFormResult(event.result || "");
    setIsAddingEvent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event from local storage?")) {
      const updated = events.filter(e => e.id !== id);
      setEvents(updated);
      localStorage.setItem("premarket_calendar_events_v4", JSON.stringify(updated));
      if (editingEventId === id) {
        resetForm();
      }
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(events, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Playbook Static Data
  const playbookMonths: PlaybookMonth[] = [
    {
      name: "JANUARY",
      indiaEvents: [
        "Union Budget expectations begin building",
        "Q3 Earnings Season starts",
        "Auto Sales Data release",
        "Monthly GST Collections announcement"
      ],
      globalEvents: [
        "US Non-Farm Payroll (NFP)",
        "US CPI Inflation print",
        "Federal Reserve Meeting"
      ],
      sectorsImpacted: ["Banking", "Capital Goods", "Infrastructure", "Auto"],
      watch: ["Budget pre-discussions", "Margin compression in exports"],
      opportunities: ["Accumulate infrastructure & capital goods on budget hopes"]
    },
    {
      name: "FEBRUARY",
      indiaEvents: [
        "Union Budget announcement (Most critical fiscal event)",
        "Q3 Results continue"
      ],
      globalEvents: [
        "US CPI Inflation Data",
        "FOMC Fed Minutes release"
      ],
      sectorsImpacted: ["Railways", "Defence", "Capital Goods", "PSUs", "Infrastructure", "Consumption"],
      watch: ["Taxes, Custom duties changes", "Capital expenditure expansion size"],
      opportunities: ["Capitalize on railway and defence budget allocations"]
    },
    {
      name: "MARCH",
      indiaEvents: [
        "Financial Year End settlements",
        "Mutual Fund Window Dressing",
        "Tax Saving Investment flows peak",
        "Corporate Guidance updates"
      ],
      globalEvents: [
        "Federal Reserve Policy Meeting",
        "US GDP Growth Data"
      ],
      sectorsImpacted: ["Banking", "Financials", "Asset Management", "Tax-saving options"],
      watch: ["Systemic banking liquidity", "Bond yields and interest rates"],
      opportunities: ["Invest in tax-saving ELSS schemes, pick up high dividend stocks ahead of FY end"]
    },
    {
      name: "APRIL",
      indiaEvents: [
        "Q4 Corporate Earnings season begins",
        "Start of new Financial Year (FY)",
        "Auto Sales",
        "GST Collections"
      ],
      globalEvents: [
        "US Earnings Season kick-off"
      ],
      sectorsImpacted: ["IT Sector", "Auto Sector", "Banking"],
      watch: ["IT management guidance for the year", "Early consumption trends"],
      opportunities: ["Rebalance portfolio based on new FY allocations and Q4 guidance"]
    },
    {
      name: "MAY",
      indiaEvents: [
        "Q4 Corporate Earnings season peaks",
        "Dividend payout announcements",
        "Bonus issues & Stock Split updates"
      ],
      globalEvents: [
        "US CPI inflation print",
        "FOMC Federal Reserve Policy Meeting"
      ],
      sectorsImpacted: ["High Dividend Yield Stocks", "PSUs", "Large Caps"],
      watch: ["Global interest rate signals", "FII flows trends"],
      opportunities: ["Pick up quality dividend-paying stocks to lock in yields"]
    },
    {
      name: "JUNE",
      indiaEvents: [
        "RBI Monetary Policy Meeting Statement (Repo rate updates)",
        "Southwest Monsoon arrival & propagation tracker"
      ],
      globalEvents: [
        "US CPI Inflation Data",
        "Federal Reserve FOMC statement"
      ],
      sectorsImpacted: ["Banking & NBFCs", "Real Estate", "Automobiles", "Agriculture & FMCG"],
      watch: ["Monsoon coverage speed", "RBI rate outlook guidance"],
      opportunities: ["Track fertilizer and seed companies for monsoon momentum play"]
    },
    {
      name: "JULY",
      indiaEvents: [
        "Q1 Corporate Earnings season begins",
        "Monsoon distribution updates across Central & North India"
      ],
      globalEvents: [
        "US Federal Reserve Policy Meeting",
        "US CPI inflation release"
      ],
      sectorsImpacted: ["Agriculture", "Fertilizers", "Rural Consumption", "FMCG"],
      watch: ["Sowing patterns of key crops", "FII flows response to US Fed"],
      opportunities: ["Accumulate rural-facing stocks if monsoon is normal/above normal"]
    },
    {
      name: "AUGUST",
      indiaEvents: [
        "Q1 Corporate Earnings season peaks",
        "Independence Day policy announcements by PM"
      ],
      globalEvents: [
        "Jackson Hole Economic Symposium (Fed guidance)"
      ],
      sectorsImpacted: ["PSUs", "Defence", "Infrastructure", "Renewable Energy"],
      watch: ["Government execution policy updates", "Global central banks coordination"],
      opportunities: ["Play policy-beneficiary sectors post-August 15 government address"]
    },
    {
      name: "SEPTEMBER",
      indiaEvents: [
        "RBI Monetary Policy Meeting",
        "Quarterly Index Rebalancing (Nifty index inclusions)"
      ],
      globalEvents: [
        "FOMC Federal Reserve Policy Meeting",
        "US GDP final print"
      ],
      sectorsImpacted: ["Banking", "Index constituents", "IT"],
      watch: ["Inflation trajectory post-monsoon", "US Fed rate actions"],
      opportunities: ["Short-term trade index rebalancing changes, buy stocks added to benchmark indices"]
    },
    {
      name: "OCTOBER",
      indiaEvents: [
        "Q2 Corporate Earnings season starts",
        "Festive season demand metrics (Dussehra/Diwali expectations)",
        "Auto Sales Data",
        "GST Collections"
      ],
      globalEvents: [
        "US NFP job data",
        "US CPI Inflation",
        "US Earnings Season starts"
      ],
      sectorsImpacted: ["FMCG", "Retail & E-commerce", "Auto & Consumer Discretionary"],
      watch: ["Rural discretionary demand growth", "Consumer credit growth"],
      opportunities: ["Position in consumer durables and retail chains for festive sales push"]
    },
    {
      name: "NOVEMBER",
      indiaEvents: [
        "Q2 Corporate Earnings season peaks",
        "Muhurat Trading (Special 1-hour Diwali session)",
        "Post-festive sales metrics check"
      ],
      globalEvents: [
        "Federal Reserve Policy Meeting",
        "US Inflation Data"
      ],
      sectorsImpacted: ["Jewelry & Retail", "Auto", "Consumer Goods", "FII Flows"],
      watch: ["FII activity post-US election/policy updates", "Bond yields dynamics"],
      opportunities: ["Muhurat trading investments, buying structural growers for long-term compound gains"]
    },
    {
      name: "DECEMBER",
      indiaEvents: [
        "RBI Monetary Policy Meeting",
        "Advance Tax payments (Q3 install)",
        "Year-end institutional volume dip"
      ],
      globalEvents: [
        "Federal Reserve FOMC Meeting",
        "US CPI inflation"
      ],
      sectorsImpacted: ["Banking", "Blue-chips", "Defensives (Pharma/FMCG)"],
      watch: ["FII holiday season volumes", "Banking system credit growth"],
      opportunities: ["Santa Claus rally plays in blue-chips, accumulation during tax tax tax-planning periods"]
    }
  ];

  // Calculate Alerts: events occurring in <= 3 days (and >= 0)
  const activeAlerts = events.filter(e => {
    const diff = getDaysDiff(e.date);
    return diff >= 0 && diff <= 3;
  });

  // Split events: upcoming vs passed (completed)
  // Completed events (date difference < 0) are ordered descending (most recent first)
  const passedEvents = events
    .filter(e => getDaysDiff(e.date) < 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Upcoming events (date difference >= 0) are ordered ascending (closest first)
  const upcomingEvents = events
    .filter(e => getDaysDiff(e.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-1 flex flex-col justify-start">
      {/* Dynamic Event Schema Markup for Google SEO */}
      {events.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EventSeries",
              "name": "Pre-Market Momentum Macro Economic Calendar",
              "description": "High impact macroeconomic schedule for Indian and US financial markets.",
              "event": events.map(e => ({
                "@type": "Event",
                "name": e.title,
                "startDate": e.date,
                "endDate": e.date,
                "eventStatus": "https://schema.org/EventScheduled",
                "image": [
                  "https://premarketmomentum.com/og_preview.png"
                ],
                "location": {
                  "@type": "Place",
                  "name": e.country === "IN" ? "Reserve Bank of India" : "Federal Reserve Board",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": e.country === "IN" ? "Mumbai" : "Washington D.C.",
                    "addressRegion": e.country === "IN" ? "MH" : "DC",
                    "addressCountry": e.country === "IN" ? "IN" : "US"
                  }
                },
                "description": e.description,
                "performer": {
                  "@type": "Organization",
                  "name": e.source || (e.country === "IN" ? "Government of India" : "US Government")
                },
                "organizer": {
                  "@type": "Organization",
                  "name": e.source || (e.country === "IN" ? "Government of India" : "US Government"),
                  "url": e.sourceUrl || "https://premarketmomentum.com/events"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": e.country === "IN" ? "INR" : "USD",
                  "availability": "https://schema.org/InStock",
                  "url": "https://premarketmomentum.com/events"
                }
              }))
            })
          }}
        />
      )}

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Calendar className="h-3.5 w-3.5" />
            Macro Cues Hub
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
            Market Events & Economic Calendar
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Track upcoming high-impact economic dates (Indian & Global), view month-by-month market playbooks, and monitor volatility countdowns.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              if (isAddingEvent) {
                resetForm();
              }
              setIsAddingEvent(!isAddingEvent);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold shadow transition-all cursor-pointer select-none"
          >
            <Plus className="h-4 w-4" />
            {isAddingEvent ? "Close Publisher" : "Add Calendar Date"}
          </button>
        )}
      </div>

      {/* Admin Panel (Publish Form) */}
      {isAddingEvent && isAdmin && (
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <h3 className="text-sm font-black text-foreground">
                {editingEventId ? "Edit Economic Event" : "Add New Economic Event"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {editingEventId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary text-[10px] font-bold text-foreground border border-border cursor-pointer hover:bg-secondary/80"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Form
                </button>
              )}
              <button
                onClick={handleCopyJSON}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-[10px] font-bold text-foreground cursor-pointer transition-colors"
                title="Copy JSON to paste in src/data/calendar.json"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy code JSON"}
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 border border-border/70 text-[11px] text-muted-foreground flex gap-2">
            <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <p>
              Saving an event here writes to <code>localStorage</code> so you can test alerts on desktop or mobile. Click <strong>"Copy code JSON"</strong> to copy the full array configuration to paste into <code>src/data/calendar.json</code> for permanent deployment.
            </p>
          </div>

          <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Event Title</label>
              <input
                type="text"
                placeholder="e.g., RBI Interest Rate Decision"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Scheduled Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Country</label>
                <select
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value as "IN" | "US")}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                >
                  <option value="IN">IN (India)</option>
                  <option value="US">US (United States)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Priority Stars</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                >
                  <option value="1">1 Star (*)</option>
                  <option value="2">2 Star (**)</option>
                  <option value="3">3 Star (***)</option>
                  <option value="4">4 Star (****)</option>
                  <option value="5">5 Star (*****)</option>
                </select>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Primary Source / Publisher</label>
              <input
                type="text"
                placeholder="e.g., Reserve Bank of India / Economic Times"
                value={formSource}
                onChange={(e) => setFormSource(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Source URL (Outbound Link)</label>
              <input
                type="url"
                placeholder="https://example.com/source-report"
                value={formSourceUrl}
                onChange={(e) => setFormSourceUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Event Description (SEO Rich Context)</label>
              <textarea
                placeholder="Detail what this event evaluates, who publishes it, and why it is being tracked."
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none font-sans"
                required
              />
            </div>

            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Expected Market Impact & Volatility Advice</label>
              <textarea
                placeholder="Detail the expected sector impact. e.g. Volatility expected in Banking and Autos. Potential Rupee pressure."
                rows={2}
                value={formImpact}
                onChange={(e) => setFormImpact(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none font-sans"
              />
            </div>

            <div className="col-span-1 md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Announced Result / Outcome (For Completed Events - Optional)</label>
              <textarea
                placeholder="Specify the actual numbers or rate decision announced. e.g. Repo rate kept unchanged at 5.25%. GDP growth printed at 7.8%."
                rows={2}
                value={formResult}
                onChange={(e) => setFormResult(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none font-sans"
              />
            </div>

            <div className="col-span-1 md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsAddingEvent(false);
                }}
                className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold hover:bg-secondary/80 border border-border cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                {editingEventId ? "Update Event" : "Publish Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pulsing Alert Board */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          Live Volatility Alerts (Events occurring in &le; 3 days)
        </h3>

        {activeAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAlerts.map(event => {
              const diffDays = getDaysDiff(event.date);
              return (
                <div 
                  key={event.id}
                  className="relative group rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-5 space-y-3 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Pulsing Background Light */}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-amber-500/5 animate-pulse pointer-events-none" />
                  
                  <div className="relative flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest font-mono">
                        CRITICAL WARNING
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-[10px] font-black font-mono text-rose-500 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                      <Clock className="h-3 w-3" />
                      {diffDays === 0 ? "TODAY" : diffDays === 1 ? "TOMORROW" : `IN ${diffDays} DAYS`}
                    </div>
                  </div>

                  <div className="relative space-y-1.5">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-1.5">
                      {event.country === "IN" ? "🇮🇳" : "🇺🇸"} {event.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="relative rounded-xl bg-rose-500/10 border border-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 font-medium">
                    <strong>Expected Impact:</strong> {event.impact}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 text-center flex flex-col items-center justify-center space-y-2 py-8 bg-emerald-500/[0.02] border-emerald-500/20">
            <CheckCircle className="h-8 w-8 text-emerald-500 animate-pulse" />
            <h4 className="font-extrabold text-sm text-foreground">No Immediate Volatility Alerts</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              All scheduled economic indicators are &gt; 3 days away. System indicates standard pre-market opening signal computations.
            </p>
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border/60 gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
            activeTab === "calendar"
              ? "border-primary text-primary dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Economic Events Feed
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
            activeTab === "checklist"
              ? "border-primary text-primary dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Professional Checklist
        </button>
        <button
          onClick={() => setActiveTab("playbook")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
            activeTab === "playbook"
              ? "border-primary text-primary dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          12-Month Playbook
        </button>
      </div>

      {/* Tab Contents: Calendar Feed (Completed Top, Upcoming Bottom) */}
      {activeTab === "calendar" && (
        <div className="space-y-10">
          
          {/* Subsection 1: Completed Events (Outcomes Displayed Inside) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest pl-1 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Completed Macro Events & Results
            </h3>

            {passedEvents.length > 0 ? (
              <div className="space-y-4">
                {passedEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="group relative rounded-2xl border border-emerald-500/10 bg-card/75 p-5 space-y-4 hover:border-emerald-500/30 transition-all duration-200"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{event.country === "IN" ? "🇮🇳" : "🇺🇸"}</span>
                        <span className="text-xs font-bold text-muted-foreground">
                          {event.country === "IN" ? "India" : "United States"}
                        </span>
                        <span className="text-muted-foreground/30">•</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Completed: {event.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-500" title={`Priority: ${event.priority}/5`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < event.priority ? "fill-amber-500" : "text-muted-foreground/30"}`} 
                            />
                          ))}
                        </div>
                        
                        {isAdmin && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => handleEditClick(event)}
                              className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                              title="Edit Event"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-extrabold text-foreground tracking-tight group-hover:text-emerald-500 transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Announced Result Block */}
                    <div className="rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/25 p-4 space-y-2 shadow-inner">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        ANNOUNCED ECONOMIC RESULT
                      </div>
                      <p className="text-xs text-foreground font-semibold leading-relaxed">
                        {event.result || "Official result announcement released. Click edit in admin mode to supply the precise outcome."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground pt-1">
                      <span><strong>Historical Impacted Area:</strong> {event.impact}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        <strong>Source:</strong>{" "}
                        {event.sourceUrl ? (
                          <a 
                            href={event.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary dark:text-indigo-400 hover:underline font-bold inline-flex items-center gap-0.5"
                          >
                            {event.source} ↗
                          </a>
                        ) : (
                          event.source
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/20 text-xs text-muted-foreground">
                No completed economic events logged.
              </div>
            )}
          </div>

          {/* Subsection 2: Upcoming Events (Downside of the List) */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest pl-1 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Upcoming Volatility Events
            </h3>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => {
                  const diff = getDaysDiff(event.date);
                  return (
                    <div 
                      key={event.id}
                      className="group relative rounded-2xl border border-border bg-card p-5 space-y-3 hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{event.country === "IN" ? "🇮🇳" : "🇺🇸"}</span>
                          <span className="text-xs font-bold text-muted-foreground">
                            {event.country === "IN" ? "India" : "United States"}
                          </span>
                          <span className="text-muted-foreground/30">•</span>
                          <span className="text-[10px] font-mono font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border/40">
                            Scheduled: {event.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-500" title={`Priority: ${event.priority}/5`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < event.priority ? "fill-amber-500" : "text-muted-foreground/30"}`} 
                              />
                            ))}
                          </div>
                          
                          {isAdmin && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                onClick={() => handleEditClick(event)}
                                className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                                title="Edit Event"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                title="Delete Event"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-base font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                            {event.title}
                          </h4>
                          <span className="shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10">
                            {getCountdownText(diff)}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
                        <div className="rounded-xl bg-muted/50 p-2.5 border border-border/40 space-y-0.5">
                          <span className="font-bold text-muted-foreground block uppercase text-[8px] tracking-wider">Expected Volatility Sector</span>
                          <span className="text-foreground font-medium">{event.impact}</span>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-2.5 border border-border/40 space-y-0.5">
                          <span className="font-bold text-muted-foreground block uppercase text-[8px] tracking-wider">Official Data Source</span>
                          <span className="text-foreground font-medium truncate block">
                            {event.sourceUrl ? (
                              <a 
                                href={event.sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary dark:text-indigo-400 hover:underline font-bold inline-flex items-center gap-0.5"
                              >
                                {event.source} ↗
                              </a>
                            ) : (
                              event.source
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/20 text-xs text-muted-foreground">
                No upcoming economic calendar dates available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Contents: Checklist */}
      {activeTab === "checklist" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-lg font-black text-foreground tracking-tight border-b border-border pb-3">
                Professional Investor's Monthly Checklist
              </h3>
              <p className="text-xs text-muted-foreground leading-normal">
                Experienced market makers do not trade in isolation. They align their trading calendars with critical monthly recurring events. Check off indicators as they print to evaluate systemic market bias.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { name: "RBI Policy Announcement", desc: "Monitored bi-monthly. Dictates sector weight for Nifty Bank." },
                  { name: "US FOMC Fed Meeting Decision", desc: "Dictates global capital cost. Key driver of emerging market FII flows." },
                  { name: "US CPI Inflation Print", desc: "Governs US Fed's rate trajectory." },
                  { name: "US Non-Farm Payrolls (NFP)", desc: "Determines strength of the US labor market." },
                  { name: "India GST Collection Summary", desc: "Monthly indicator of domestic consumption and GDP tax efficiency." },
                  { name: "India PMI Data (Mfg & Services)", desc: "Indicates industrial expansion rate (> 50 is bullish)." },
                  { name: "India IIP Data", desc: "Tracks core industrial production growth." },
                  { name: "Crude Oil Brent Prices", desc: "OPEC meetings & spot price actions. Impacts domestic inflation." },
                  { name: "US Dollar Index (DXY) Level", desc: "Inverse correlation with emerging market equity inflows." },
                  { name: "FII / DII net flows reports", desc: "Aggregated monthly buying/selling by institutions." },
                  { name: "Monsoon Tracking (Jun - Sep)", desc: "Tracks agricultural output forecasts and rural demand indicators." },
                  { name: "Q1 / Q2 / Q3 / Q4 Earnings", desc: "Quarterly margin updates and company corporate guides." }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-border/80 bg-card p-4 hover:bg-secondary/40 transition-colors"
                  >
                    <input 
                      type="checkbox" 
                      id={`check-${index}`}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:outline-none cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <label htmlFor={`check-${index}`} className="text-xs font-extrabold text-foreground cursor-pointer select-none">
                        {item.name}
                      </label>
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            {/* Impact Scale Card */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-border/60 pb-2">
                Elite Impact Priorities
              </h4>
              
              <div className="space-y-3">
                {[
                  { name: "Union Budget", stars: 5, impact: "Massive (Tax & Fiscal changes)" },
                  { name: "RBI Rate Policy", stars: 5, impact: "Massive (Repo rate / liquidity)" },
                  { name: "US Fed FOMC", stars: 5, impact: "Massive (Global currency flows)" },
                  { name: "Corporate Earnings", stars: 5, impact: "Massive (EPS revisions)" },
                  { name: "US CPI Inflation", stars: 4, impact: "Very High (Yield trajectory)" },
                  { name: "Monsoon Progress", stars: 4, impact: "Very High (Rural consumption)" },
                  { name: "Crude Oil (Brent)", stars: 4, impact: "Very High (CAD & inflation)" },
                  { name: "General Elections", stars: 4, impact: "Very High (Policy shifts)" },
                  { name: "GST Collections", stars: 3, impact: "High (Consumer demand)" },
                  { name: "PMI / IIP Data", stars: 3, impact: "High (Industrial health)" }
                ].map((scale, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-foreground">{scale.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star 
                            key={starIndex} 
                            className={`h-2.5 w-2.5 ${starIndex < scale.stars ? "fill-amber-500" : "text-muted-foreground/25"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-muted-foreground font-semibold">{scale.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: Playbook */}
      {activeTab === "playbook" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Months Sidebar */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {playbookMonths.map(month => (
              <button
                key={month.name}
                onClick={() => setSelectedMonth(month.name)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedMonth === month.name
                    ? "bg-primary text-white shadow-sm glow-primary"
                    : "bg-card border border-border/70 hover:border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {month.name}
              </button>
            ))}
          </div>

          {/* Month Details */}
          <div className="lg:col-span-6">
            {(() => {
              const currentMonthData = playbookMonths.find(m => m.name === selectedMonth);
              if (!currentMonthData) return null;

              return (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center border-b border-border/60 pb-4">
                    <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      {currentMonthData.name} Market Playbook
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/10 uppercase tracking-widest">
                      Historical Guide
                    </span>
                  </div>

                  {/* India Calendar events */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      🇮🇳 India Market Factors
                    </h4>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1.5">
                      {currentMonthData.indiaEvents.map((e, idx) => (
                        <li key={idx}><span className="text-foreground font-semibold">{e}</span></li>
                      ))}
                    </ul>
                  </div>

                  {/* Global factors */}
                  {currentMonthData.globalEvents.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        🇺🇸 Global Market Cues
                      </h4>
                      <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1.5">
                        {currentMonthData.globalEvents.map((e, idx) => (
                          <li key={idx}><span className="text-foreground font-semibold">{e}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Impact & Watches */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Sectors Impacted</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentMonthData.sectorsImpacted.map((s, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 rounded bg-secondary text-[10px] font-bold text-foreground border border-border/50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Macro Watchlist</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentMonthData.watch.map((w, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 rounded bg-secondary/80 text-[10px] font-bold text-muted-foreground border border-border/30"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Specific Strategic Opportunity */}
                  {currentMonthData.opportunities.length > 0 && (
                    <div className="rounded-xl bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08] border border-indigo-500/20 p-4 space-y-1.5">
                      <h5 className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4" />
                        Tactical Market Opportunity
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {currentMonthData.opportunities[0]}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Macro Forces Guide sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-border/60 pb-2">
                Constant Macro Forces
              </h4>

              <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                <div className="space-y-1">
                  <span className="font-extrabold text-foreground flex items-center gap-1">
                    🛢️ Crude Oil Brent
                  </span>
                  <p className="text-[11px]">
                    India imports ~85% of crude. When oil rises sharply, import bills surge, inflating the Current Account Deficit (CAD), weakening the INR, and building systemic pressure on stocks.
                  </p>
                </div>

                <div className="space-y-1 pt-1.5 border-t border-border/40">
                  <span className="font-extrabold text-foreground flex items-center gap-1">
                    💵 Dollar Index (DXY)
                  </span>
                  <p className="text-[11px]">
                    A strong US Dollar index forces capital outflows from Emerging Markets (like India) back to US Treasuries. A weakening Dollar increases FII risk appetite, boosting Nifty inflows.
                  </p>
                </div>

                <div className="space-y-1 pt-1.5 border-t border-border/40">
                  <span className="font-extrabold text-rose-500 flex items-center gap-1">
                    ⚠️ Rare Volatility Events
                  </span>
                  <p className="text-[11px]">
                    Unexpected events like international conflicts (Wars), sudden epidemics (Pandemics), international bank failures, or general election shocks cause high systemic drops and expand VIX levels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
