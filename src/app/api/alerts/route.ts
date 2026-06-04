import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const toNumber = process.env.TWILIO_TO_NUMBER;

const triggeredThresholds = new Set<string>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isTest = searchParams.get("test") === "true";

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      return NextResponse.json({
        success: false,
        message: "Twilio configuration is incomplete. Please ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, and TWILIO_TO_NUMBER are set in your environment variables.",
      });
    }

    const client = twilio(accountSid, authToken);

    // 1. Handle Instant Test Message Trigger
    if (isTest) {
      const testBody = `🚨 *NIFTY 50 ALERTS - TEST* 🚨\n\nCongratulation! Your automated WhatsApp market alerts from *Antigravity Finance* are now successfully connected and active!`;
      
      await client.messages.create({
        body: testBody,
        from: fromNumber,
        to: toNumber,
      });

      return NextResponse.json({
        success: true,
        message: "Test WhatsApp message sent successfully to your phone number!",
      });
    }

    // 2. Regular price milestone check logic
    const { origin } = new URL(request.url);
    const res = await fetch(`${origin}/api/market?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Market API returned status ${res.status}`);
    
    const market = await res.json();
    if (!market.success) throw new Error(market.error || "Failed to fetch market data");

    const INDEX_CONFIGS = [
      { symbol: "NIFTY50", name: "NIFTY 50", thresholds: [100, 150, 200, 250, 300, 350] },
      { symbol: "BANKNIFTY", name: "BANK NIFTY", thresholds: [300, 500, 800, 1000, 1200] },
      { symbol: "SENSEX", name: "SENSEX", thresholds: [300, 500, 800, 1000, 1200, 1500] }
    ];

    let alertsSentList = [];

    for (const cfg of INDEX_CONFIGS) {
      const indexData = market.data.find((item: any) => item.symbol === cfg.symbol);
      if (!indexData) continue;

      const pointsChange = indexData.price - indexData.open;
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

          await client.messages.create({
            body: bodyText,
            from: fromNumber,
            to: toNumber,
          });

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
      message: "Checked NIFTY 50, BANK NIFTY, and SENSEX. No new milestones crossed.",
    });
  } catch (err: any) {
    console.error("Alert trigger error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
