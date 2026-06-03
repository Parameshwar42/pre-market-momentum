import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
}

const FEEDS = [
  { url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", defaultSource: "Economic Times Markets" },
  { url: "https://finance.yahoo.com/news/rss", defaultSource: "Yahoo Finance" }
];

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
        });

        // Limit per feed source to avoid bloated response
        if (idCounter > 25) break;
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
      data: filteredArticles.slice(0, 15) // Limit total items in feed to 15
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message
    });
  }
}
