import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const toNumber = process.env.TWILIO_TO_NUMBER;

const triggeredThresholds = new Set<string>();

function formatWhatsAppNumber(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith("whatsapp:")) {
    return trimmed;
  }
  // Remove spaces, hyphens, and parentheses
  const cleanNumber = trimmed.replace(/[\s\-()]/g, "");
  // Ensure country code prefix begins with +
  const baseNumber = cleanNumber.startsWith("+") ? cleanNumber : `+${cleanNumber}`;
  return `whatsapp:${baseNumber}`;
}

function maskNumber(num: string): string {
  return num.replace(/^(whatsapp:\+?\d{2,4})\d+(\d{4})$/, "$1*****$2");
}

async function sendWhatsAppMessage(
  client: any,
  body: string,
  from: string,
  to: string
) {
  const formattedFrom = formatWhatsAppNumber(from);
  const formattedTo = formatWhatsAppNumber(to);

  console.log(`[Twilio] Attempting to send WhatsApp from ${maskNumber(formattedFrom)} to ${maskNumber(formattedTo)}`);

  try {
    const message = await client.messages.create({
      body,
      from: formattedFrom,
      to: formattedTo,
    });
    console.log(`[Twilio] Message sent successfully. SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (err: any) {
    console.error(`[Twilio] Error sending message: Code ${err.code} | ${err.message}`);
    
    let helperMessage = "Twilio failed to send the WhatsApp message.";
    if (err.code === 63012) {
      helperMessage += " Error 63012: Outside 24-hour window or template violation. If using a Twilio Sandbox, the recipient number must first opt-in by sending a message (e.g. 'join <sandbox-keyword>') to your Twilio number via WhatsApp.";
    } else if (err.code === 21608) {
      helperMessage += " Error 21608: The recipient number is not verified. If using a Twilio Trial Account, you must verify the 'To' number in your Twilio Console under 'Verified Caller IDs' first.";
    } else if (err.code === 21211) {
      helperMessage += " Error 21211: Invalid 'To' phone number. Please check if TWILIO_TO_NUMBER is correct and contains the country code prefix (e.g., +91 for India).";
    } else if (err.code === 21610) {
      helperMessage += " Error 21610: Recipient is blacklisted or unsubscribed. Send 'START' to the Twilio number via WhatsApp to opt-in again.";
    } else {
      helperMessage += ` Twilio Error Code ${err.code || "unknown"}: ${err.message}`;
    }

    throw new Error(helperMessage);
  }
}

function extractFiiDiiCues(articles: any[]): string {
  const cues: string[] = [];
  for (const art of articles) {
    const text = (art.title + " " + art.summary).toLowerCase();
    if (text.includes("fii") || text.includes("dii") || text.includes("foreign institutional") || text.includes("domestic institutional") || text.includes("net buyers") || text.includes("net sellers")) {
      let title = art.title.trim();
      if (title.length > 85) {
        title = title.substring(0, 82) + "...";
      }
      cues.push(`• ${title}`);
      if (cues.length >= 1) break;
    }
  }
  
  if (cues.length > 0) {
    return cues.join("\n");
  }
  return "• Institutional flows remain selective. Watch for exchange tables at open.";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isTest = searchParams.get("test") === "true";
    const cronType = searchParams.get("cron");
    const isCron = request.headers.get("x-vercel-cron") === "1";

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      return NextResponse.json({
        success: false,
        message: "Twilio configuration is incomplete. Please ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, and TWILIO_TO_NUMBER are set in your environment variables.",
      });
    }

    const client = twilio(accountSid, authToken);

    // 1. Handle Scheduled Crons / Briefings
    if (cronType === "9am") {
      if (!isCron && !isTest) {
        return NextResponse.json({
          success: false,
          message: "Unauthorized. Cron trigger requires Vercel execution or manual test query parameter.",
        }, { status: 401 });
      }

      const { origin } = new URL(request.url);
      
      // Fetch live market data
      const marketRes = await fetch(`${origin}/api/market?t=${Date.now()}`, { cache: "no-store" });
      if (!marketRes.ok) throw new Error(`Market API returned status ${marketRes.status}`);
      const marketData = await marketRes.json();
      if (!marketData.success) throw new Error(marketData.error || "Failed to fetch market data");

      // Fetch live news data
      const newsRes = await fetch(`${origin}/api/news?t=${Date.now()}`, { cache: "no-store" });
      if (!newsRes.ok) throw new Error(`News API returned status ${newsRes.status}`);
      const newsData = await newsRes.json();
      if (!newsData.success) throw new Error(newsData.error || "Failed to fetch news data");

      const giftNifty = marketData.data.find((item: any) => item.symbol === "GIFTNIFTY");
      const vix = marketData.data.find((item: any) => item.symbol === "INDIA_VIX");
      const usdinr = marketData.data.find((item: any) => item.symbol === "USDINR");
      const gold = marketData.data.find((item: any) => item.symbol === "GOLD");
      const brent = marketData.data.find((item: any) => item.symbol === "CRUDEOIL");
      const hdb = marketData.data.find((item: any) => item.symbol === "HDB");
      const ibn = marketData.data.find((item: any) => item.symbol === "IBN");
      const infy = marketData.data.find((item: any) => item.symbol === "INFY");

      const giftPrice = giftNifty ? `₹${giftNifty.price.toLocaleString("en-IN")}` : "N/A";
      const giftChange = giftNifty ? `${giftNifty.changePercent >= 0 ? "+" : ""}${giftNifty.changePercent}%` : "N/A";
      
      const vixPrice = vix ? `${vix.price}` : "N/A";
      const vixChange = vix ? `${vix.changePercent >= 0 ? "+" : ""}${vix.changePercent}%` : "N/A";
      
      const usdPrice = usdinr ? `₹${usdinr.price.toFixed(2)}` : "N/A";
      
      const goldPrice = gold ? `$${gold.price.toLocaleString()}` : "N/A";
      const goldChange = gold ? `${gold.changePercent >= 0 ? "+" : ""}${gold.changePercent}%` : "N/A";
      
      const brentPrice = brent ? `$${brent.price.toLocaleString()}` : "N/A";
      const brentChange = brent ? `${brent.changePercent >= 0 ? "+" : ""}${brent.changePercent}%` : "N/A";

      const hdbChange = hdb ? `${hdb.changePercent >= 0 ? "+" : ""}${hdb.changePercent}%` : "N/A";
      const ibnChange = ibn ? `${ibn.changePercent >= 0 ? "+" : ""}${ibn.changePercent}%` : "N/A";
      const infyChange = infy ? `${infy.changePercent >= 0 ? "+" : ""}${infy.changePercent}%` : "N/A";

      const newsArticles = newsData.data || [];
      const fiiDiiCues = extractFiiDiiCues(newsArticles);

      const sectors = [
        { name: "Financial Services", keywords: /\b(bank|banks|nbfc|financial|lending|rbi|hdfc|icici|sbi|axis|pnb|kotak|indusind|repo|nifty bank|bank nifty|bajaj finance)\b/i },
        { name: "Information Technology", keywords: /\b(tcs|infosys|wipro|hcl|tech mahindra|nasdaq|software|semiconductor|it sector|it services|accenture|cognizant)\b/i },
        { name: "Capital Goods & Infrastructure", keywords: /\b(infra|infrastructure|construction|cement|l&t|larsen|dlf|godrej|real estate|realty|housing|capital goods|engineering|abb|siemens|thermax|bhel|cummins|railway|railways|rvnl|ircon)\b/i },
        { name: "Power & Energy", keywords: /\b(power|energy|solar|reliance|ntpc|coal|ongc|bpcl|hpcl|powergrid|green energy|wind power|petro|crude|refinery)\b/i },
        { name: "Defence", keywords: /\b(defence|defense|hal|bel|mazagon|cochin shipyard|military|navy|army|missile|missiles|arms contract|drdo|hindustan aeronautics|bharat electronics|paras defence|data patterns|mtar)\b/i }
      ];

      const sectorBriefs: string[] = [];
      for (const sec of sectors) {
        const matches = newsArticles.filter((art: any) => {
          const text = (art.title + " " + art.summary).toLowerCase();
          return sec.keywords.test(text);
        });
        
        if (matches.length > 0) {
          let title = matches[0].title.trim();
          if (title.length > 85) {
            title = title.substring(0, 82) + "...";
          }
          sectorBriefs.push(`📁 *${sec.name}*: ${title}`);
        } else {
          sectorBriefs.push(`📁 *${sec.name}*: Steady. No major updates.`);
        }
      }
      const sectorUpdatesText = sectorBriefs.join("\n");

      let dailyBias = "Neutral ⚖️";
      let strategyAdvice = "";
      
      const giftVal = giftNifty ? giftNifty.changePercent : 0;
      const vixVal = vix ? vix.price : 13;
      
      if (giftVal >= 0.25) {
        dailyBias = "Bullish 🚀";
        strategyAdvice = "Strong global cues indicate a positive gap-up opening. Focus on long setups in Financials and Power sectors. Watch Bank Nifty resistance levels closely.";
      } else if (giftVal <= -0.25) {
        dailyBias = "Bearish 📉";
        strategyAdvice = "Weak global indicators point to a negative opening. Consider defensive rotation into IT and Gold. Keep tight stop-losses on longs.";
      } else {
        dailyBias = "Neutral / Stock-Specific ⚖️";
        strategyAdvice = "Flat opening expected. Focus on stock-specific setups showing relative strength, especially in Defence and Capital Goods/Infra.";
      }

      if (vixVal > 16) {
        strategyAdvice += " India VIX is elevated; trade with light positioning and prioritize intraday trades.";
      }

      const reportBody = `*SENIOR GENERALIST PRE-MARKET BRIEF* ☕📈\n_Generated Daily at 9:00 AM IST_\n\n📊 *OVERNIGHT MARKET CUES*\n• *GIFT Nifty*: ${giftPrice} (${giftChange})\n• *India VIX*: ${vixPrice} (${vixChange})\n• *USD/INR*: ${usdPrice}\n• *Gold (USD)*: ${goldPrice} (${goldChange})\n• *Brent Crude*: ${brentPrice} (${brentChange})\n• *US ADR Cues*: HDFC (${hdbChange}) | ICICI (${ibnChange}) | Infosys (${infyChange})\n\n📊 *FIIs & DIIs MOMENTUM*\n${fiiDiiCues}\n\n📁 *KEY SECTOR UPDATES*\n${sectorUpdatesText}\n\n🧠 *TRADING STRATEGY & COMMENTARY*\n• *Daily Bias*: ${dailyBias}\n• *Advice*: ${strategyAdvice}`;

      await sendWhatsAppMessage(client, reportBody, fromNumber, toNumber);

      return NextResponse.json({
        success: true,
        message: "9:00 AM Pre-Market Alert sent successfully!",
        cron: "9am"
      });
    }

    // 2. Handle Instant Test Message Trigger
    if (isTest) {
      const testBody = `🚨 *MARKET ALERTS - TEST* 🚨\n\nCongratulation! Your automated WhatsApp market alerts from *Pre-Market Pulse* are now successfully connected and active!`;
      
      const sendResult = await sendWhatsAppMessage(client, testBody, fromNumber, toNumber);

      return NextResponse.json({
        success: true,
        message: "Test WhatsApp message sent successfully to your phone number!",
        debug: {
          version: "1.0.2",
          from: maskNumber(formatWhatsAppNumber(fromNumber)),
          to: maskNumber(formatWhatsAppNumber(toNumber)),
          sid: sendResult.sid
        }
      });
    }

    // 3. Regular price milestone check logic
    const { origin } = new URL(request.url);
    const res = await fetch(`${origin}/api/market?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Market API returned status ${res.status}`);
    
    const market = await res.json();
    if (!market.success) throw new Error(market.error || "Failed to fetch market data");

    const INDEX_CONFIGS = [
      { symbol: "BANKNIFTY", name: "BANK NIFTY", thresholds: [150, 300, 450, 600, 750, 900, 1050, 1200] },
      { symbol: "SENSEX", name: "SENSEX", thresholds: [150, 300, 450, 600, 750, 900, 1050, 1200] }
    ];

    let alertsSentList = [];

    for (const cfg of INDEX_CONFIGS) {
      const indexData = market.data.find((item: any) => item.symbol === cfg.symbol);
      if (!indexData) continue;

      const pointsChange = indexData.change;
      const isUp = pointsChange >= 0;
      const absChange = Math.abs(pointsChange);

      let crossedThreshold = 0;
      for (const t of cfg.thresholds) {
        if (absChange >= t) {
          crossedThreshold = t;
        }
      }

      if (crossedThreshold > 0) {
        const direction = isUp ? "UP" : "DOWN";
        const today = new Date().toISOString().split("T")[0];
        const cacheKey = `${today}:${cfg.symbol}:${direction}:${crossedThreshold}`;

        if (!triggeredThresholds.has(cacheKey)) {
          const sign = isUp ? "+" : "-";
          const icon = isUp ? "🚀" : "📉";
          const trendWord = isUp ? "surged" : "dropped";
          
          const bodyText = `🚨 *${cfg.name} MILESTONE ALERT* 🚨\n\n${cfg.name} has ${trendWord} today! It is ${isUp ? "up" : "down"} by *${sign}${absChange.toFixed(2)} points*.\n\n• Current Price: *₹${indexData.price.toLocaleString("en-IN")}*\n• Change: *${indexData.changePercent >= 0 ? "+" : ""}${indexData.changePercent}%* (${indexData.change.toFixed(2)} pts)\n• Today's Open: ₹${indexData.open.toLocaleString("en-IN")}\n• Milestone Crossed: *${sign}${crossedThreshold} points* ${icon}`;

          await sendWhatsAppMessage(client, bodyText, fromNumber, toNumber);

          triggeredThresholds.add(cacheKey);
          alertsSentList.push({
            symbol: cfg.symbol,
            direction,
            threshold: crossedThreshold,
            change: pointsChange.toFixed(2)
          });
        }
      }
    }

    if (alertsSentList.length > 0) {
      return NextResponse.json({
        success: true,
        alertSent: true,
        alerts: alertsSentList
      });
    }

    return NextResponse.json({
      success: true,
      alertSent: false,
      message: "Checked BANK NIFTY and SENSEX. No new milestones crossed.",
    });
  } catch (err: any) {
    console.error("Alert trigger error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

