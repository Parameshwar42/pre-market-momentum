import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface FoAnalysis {
  tradeType: "Intraday" | "Positional (1-2 Days)" | "Both";
  bias: "Bullish" | "Bearish" | "Neutral / High Volatility" | "Neutral / Sideways";
  suggestedStrategy: string;
  riskLevel: "High" | "Medium" | "Low";
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  urgency: "high" | "medium" | "low";
  summary: string;
  impactScore: number;
  link?: string;
  affectedSectors?: string[];
  affectedAssets?: string[];
  foAnalysis?: FoAnalysis;
}

const FEEDS = [
  { url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", defaultSource: "Economic Times Markets" },
  { url: "https://finance.yahoo.com/news/rss", defaultSource: "Yahoo Finance" },
  { url: "https://www.livemint.com/rss/markets", defaultSource: "Livemint Markets" },
  { url: "https://news.google.com/rss/search?q=site:moneycontrol.com&hl=en-IN&gl=IN&ceid=IN:en", defaultSource: "Moneycontrol" }
];

function analyzeImpact(title: string, summary: string): { affectedSectors: string[]; affectedAssets: string[] } {
  const lowerText = (title + " " + summary).toLowerCase();
  const affectedSectors: string[] = [];
  const affectedAssets: string[] = [];

  // Banking & Finance
  if (lowerText.match(/\b(bank|banks|hdfc|icici|sbi|axis|pnb|kotak|indusind|rbi|rate hike|repo|interest rate|nbfc|financial|lending|fintech)\b/i)) {
    affectedSectors.push("Banking & Finance");
  }

  // Information Technology (IT) - avoid pronoun 'it' collision by looking at capital or specific keywords
  if (lowerText.includes("it sector") || lowerText.includes("it services") || lowerText.includes("it companies") || 
      lowerText.match(/\b(tcs|infosys|wipro|hcl|tech mahindra|techm|software|semiconductor|nasdaq|digital services|accenture|cognizant)\b/i) ||
      (title.match(/\bIT\b/) || summary.match(/\bIT\b/))) {
    affectedSectors.push("Information Technology");
  }

  // Automobile
  if (lowerText.match(/\b(auto|cars|auto sales|automotive|vehicle|ev|electric vehicle|tata motors|maruti|mahindra|bajaj|hero|tvs)\b/i)) {
    affectedSectors.push("Automobile");
  }

  // Metals & Mining
  if (lowerText.match(/\b(metal|metals|steel|iron|copper|aluminum|zinc|gold|silver|mining|tata steel|jsw|hindalco|vedanta|coal)\b/i)) {
    affectedSectors.push("Metals & Mining");
  }

  // Energy & Power
  if (lowerText.match(/\b(oil|crude|gas|petro|refinery|reliance|ongc|bpcl|hpcl|ntpc|power|energy|solar|hydrogen|wind power|coal india)\b/i)) {
    affectedSectors.push("Energy & Power");
  }

  // FMCG
  if (lowerText.match(/\b(fmcg|consumer goods|retail|supermarket|hul|itc|nestle|britannia|dabur|marico|colgate)\b/i)) {
    affectedSectors.push("FMCG");
  }

  // Pharmaceuticals & Healthcare
  if (lowerText.match(/\b(pharma|pharmaceuticals|drug|medicine|healthcare|hospital|vaccine|biotech|sun pharma|dr reddy|cipla|lupin)\b/i)) {
    affectedSectors.push("Pharmaceuticals");
  }

  // Telecom
  if (lowerText.match(/\b(telecom|telecommunication|jio|reliance jio|airtel|bharti airtel|vodafone|idea|5g|broadband)\b/i)) {
    affectedSectors.push("Telecom");
  }

  // Infrastructure & Real Estate
  if (lowerText.match(/\b(infra|infrastructure|construction|cement|l&t|larsen|dlf|godrej properties|real estate|realty|housing)\b/i)) {
    affectedSectors.push("Infrastructure");
  }

  // Assets and Indices mapping
  if (lowerText.includes("nifty 50") || lowerText.includes("nifty")) {
    affectedAssets.push("Nifty 50");
  }
  if (lowerText.includes("bank nifty") || lowerText.includes("nifty bank") || (lowerText.includes("nifty") && lowerText.includes("bank"))) {
    affectedAssets.push("Nifty Bank");
  }
  if (lowerText.includes("sensex")) {
    affectedAssets.push("Sensex");
  }
  if (lowerText.includes("gold") || lowerText.includes("silver") || lowerText.includes("bullion")) {
    affectedAssets.push("Bullion");
  }
  if (lowerText.includes("crude") || lowerText.includes("oil") || lowerText.includes("brent")) {
    affectedAssets.push("Crude Oil");
  }
  if (lowerText.includes("rupee") || lowerText.includes("inr") || lowerText.includes("usd")) {
    affectedAssets.push("USD/INR");
  }

  // Individual Ticker mappings
  if (lowerText.includes("hdfc bank") || lowerText.includes("hdfcbank")) {
    affectedAssets.push("HDFC Bank");
  }
  if (lowerText.includes("icici bank") || lowerText.includes("icicibank")) {
    affectedAssets.push("ICICI Bank");
  }
  if (lowerText.includes("reliance")) {
    affectedAssets.push("Reliance Industries");
  }
  if (lowerText.includes("tcs")) {
    affectedAssets.push("TCS");
  }
  if (lowerText.includes("infosys")) {
    affectedAssets.push("Infosys");
  }
  if (lowerText.includes("tata motors")) {
    affectedAssets.push("Tata Motors");
  }
  if (lowerText.includes("itc")) {
    affectedAssets.push("ITC");
  }

  // Fallbacks
  if (affectedSectors.length === 0) {
    affectedSectors.push("Macroeconomy");
  }
  if (affectedAssets.length === 0) {
    affectedAssets.push("General Markets");
  }

  return { affectedSectors, affectedAssets };
}

function analyzeFoImpact(title: string, summary: string, impactScore: number, category: string): FoAnalysis {
  const lowerText = (title + " " + summary).toLowerCase();
  
  // 1. Determine Bias & Option Strategy
  let bias: "Bullish" | "Bearish" | "Neutral / High Volatility" | "Neutral / Sideways" = "Neutral / Sideways";
  let suggestedStrategy = "Short Strangle / Iron Condor";

  // Check for high volatility events
  if (lowerText.match(/\b(sebi|rbi|fed|rate hike|repo|interest rate|regulatory|vix|margin|breakout|policy decision|inflation|cpi|crude price surge|sudden drop)\b/i)) {
    bias = "Neutral / High Volatility";
    suggestedStrategy = "Long Straddle / Strangle";
  } else if (impactScore >= 5) {
    bias = "Bullish";
    suggestedStrategy = "Long Calls / Bull Call Spreads";
  } else if (impactScore <= -3) {
    bias = "Bearish";
    suggestedStrategy = "Long Puts / Bear Put Spreads";
  }

  // 2. Determine Trade Horizon (tradeType)
  let tradeType: "Intraday" | "Positional (1-2 Days)" | "Both" = "Both";
  
  // Intraday keywords: fast moves, opening cues, block deals, current session, intraday
  const isIntraday = lowerText.match(/\b(gap up|gap down|opening cues|opening|block deal|results today|earnings today|intraday|session open|spikes|plunges|sudden|surge today)\b/i);
  // Positional keywords: structural trends, policy changes, fed, inventory, multi-day, weekly
  const isPositional = lowerText.match(/\b(fed rate|rbi decision|monetary policy|weekly trend|inventory data|crude breakout|possession|holding|positional|quarterly outlook|guidance|forecast|1-2 days|swing)\b/i);

  if (isIntraday && isPositional) {
    tradeType = "Both";
  } else if (isIntraday) {
    tradeType = "Intraday";
  } else if (isPositional) {
    tradeType = "Positional (1-2 Days)";
  } else {
    // Default by category: India/Global are often both, Commodities/Currency are often positional
    if (category === "commodities" || category === "currency") {
      tradeType = "Positional (1-2 Days)";
    } else {
      tradeType = "Intraday";
    }
  }

  // 3. Determine Risk Level
  let riskLevel: "High" | "Medium" | "Low" = "Low";
  if (bias === "Neutral / High Volatility" || lowerText.match(/\b(critical|sebi|regulatory|fed|rbi|earnings|block deal|collapse|rally)\b/i)) {
    riskLevel = "High";
  } else if (impactScore !== 2) {
    riskLevel = "Medium";
  }

  return { tradeType, bias, suggestedStrategy, riskLevel };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterCategory = searchParams.get("category") || "all";

    const fetchPromises = FEEDS.map(async (feed) => {
      try {
        const response = await fetch(feed.url, {
          cache: "no-store",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        if (!response.ok) return "";
        return await response.text();
      } catch (e) {
        return "";
      }
    });

    const xmlResults = await Promise.all(fetchPromises);
    const allArticles: NewsItem[] = [];
    let idCounter = 1;

    xmlResults.forEach((xmlText, feedIndex) => {
      if (!xmlText) return;
      const defaultSource = FEEDS[feedIndex].defaultSource;

      // Simple, robust regex-based XML item parser
      const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
      let match;
      let sourceArticleCount = 0;

      while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemContent = match[1];

        // CDATA or standard tag matches
        const titleMatch = itemContent.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) || itemContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const descMatch = itemContent.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemContent.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
        const linkMatch = itemContent.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
        const pubDateMatch = itemContent.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);

        const titleRaw = titleMatch ? titleMatch[1].trim() : "";
        const title = titleRaw.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
        
        const summaryRaw = descMatch ? descMatch[1].trim() : "";
        let summary = summaryRaw.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
        
        // Remove HTML tags from summary
        summary = summary.replace(/<[^>]*>/g, "").trim();

        const link = linkMatch ? linkMatch[1].trim() : "";
        const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";

        if (!title) continue;

        // Relative time calculation
        let timeStr = "Just now";
        if (pubDate) {
          try {
            const diffMs = Date.now() - new Date(pubDate).getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHrs = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHrs / 24);

            if (diffDays > 0) timeStr = `${diffDays}d ago`;
            else if (diffHrs > 0) timeStr = `${diffHrs}h ago`;
            else if (diffMins > 0) timeStr = `${diffMins}m ago`;
          } catch (e) {}
        }

        // Categorization logic based on title/summary keywords
        const lowerText = (title + " " + summary).toLowerCase();
        let category = "global";

        if (lowerText.includes("nifty") || lowerText.includes("sensex") || lowerText.includes("sebi") || lowerText.includes("rbi") || lowerText.includes("india") || lowerText.includes("bse") || lowerText.includes("nse")) {
          category = "india";
        } else if (lowerText.includes("gold") || lowerText.includes("crude") || lowerText.includes("oil") || lowerText.includes("commodity") || lowerText.includes("brent") || lowerText.includes("gas") || lowerText.includes("copper") || lowerText.includes("silver")) {
          category = "commodities";
        } else if (lowerText.includes("rupee") || lowerText.includes("usd") || lowerText.includes("inr") || lowerText.includes("currency") || lowerText.includes("forex")) {
          category = "currency";
        } else if (lowerText.includes("adr") || lowerText.includes("nyse") || lowerText.includes("nasdaq") || lowerText.includes("hdfc bank") || lowerText.includes("infosys") || lowerText.includes("icici bank")) {
          category = "adr";
        }

        // Dynamic impact score assessment
        let impactScore = 2; // neutral-bullish default
        if (lowerText.includes("fall") || lowerText.includes("drop") || lowerText.includes("slump") || lowerText.includes("decline") || lowerText.includes("losses") || lowerText.includes("down") || lowerText.includes("bearish") || lowerText.includes("plunge") || lowerText.includes("fell")) {
          impactScore = -4;
        } else if (lowerText.includes("rise") || lowerText.includes("surge") || lowerText.includes("growth") || lowerText.includes("gains") || lowerText.includes("up") || lowerText.includes("bullish") || lowerText.includes("higher") || lowerText.includes("jump")) {
          impactScore = 6;
        }

        // Urgency
        const urgency = Math.abs(impactScore) > 5 ? "high" : Math.abs(impactScore) > 3 ? "medium" : "low";

        const { affectedSectors, affectedAssets } = analyzeImpact(title, summary);
        const foAnalysis = analyzeFoImpact(title, summary, impactScore, category);

        allArticles.push({
          id: `live-${idCounter++}`,
          title,
          source: defaultSource,
          time: timeStr,
          category,
          urgency,
          summary: summary.substring(0, 200) + (summary.length > 200 ? "..." : ""),
          impactScore,
          link,
          affectedSectors,
          affectedAssets,
          foAnalysis,
        });

        sourceArticleCount++;
        // Limit per feed source to avoid bloated response
        if (sourceArticleCount >= 10) break;
      }
    });

    // Filter by requested category if not "all"
    let filteredArticles = allArticles;
    if (filterCategory !== "all") {
      filteredArticles = allArticles.filter(item => item.category === filterCategory);
    }

    // Sort by relative urgency and time (high urgency first)
    filteredArticles.sort((a, b) => {
      const urgencyVal = (u: string) => u === "high" ? 3 : u === "medium" ? 2 : 1;
      return urgencyVal(b.urgency) - urgencyVal(a.urgency);
    });

    return NextResponse.json({
      success: true,
      data: filteredArticles.slice(0, 30) // Limit total items in feed to 30
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message
    });
  }
}
