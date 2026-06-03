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

    const nifty = market.data.find((item: any) => item.symbol === "NIFTY50");
    if (!nifty) return NextResponse.json({ success: false, message: "NIFTY 50 not found in data feeds." });

    const pointsChange = nifty.price - nifty.open;
    const thresholds = [100, 150, 200, 250, 300, 350];

    let crossedThreshold = 0;
    for (const t of thresholds) {
      if (pointsChange >= t) {
        crossedThreshold = t;
      }
    }

    if (crossedThreshold > 0) {
      const today = new Date().toISOString().split("T")[0];
      const cacheKey = `${today}:${crossedThreshold}`;

      if (!triggeredThresholds.has(cacheKey)) {
        const bodyText = `🚨 *NIFTY 50 MILESTONE ALERT* 🚨\n\nNifty 50 has crossed a milestone! It is up by *${pointsChange.toFixed(2)} points* today.\n\n• Current Price: *₹${nifty.price.toLocaleString("en-IN")}*\n• Change: *${nifty.changePercent >= 0 ? "+" : ""}${nifty.changePercent}%* (${nifty.change.toFixed(2)} pts)\n• Today's Open: ₹${nifty.open.toLocaleString("en-IN")}\n• Milestone Crossed: *+${crossedThreshold} points*`;

        await client.messages.create({
          body: bodyText,
          from: fromNumber,
          to: toNumber,
        });

        triggeredThresholds.add(cacheKey);

        return NextResponse.json({
          success: true,
          alertSent: true,
          threshold: crossedThreshold,
          pointsChange: pointsChange.toFixed(2),
        });
      }
    }

    return NextResponse.json({
      success: true,
      alertSent: false,
      pointsChange: pointsChange.toFixed(2),
      message: `Checked. Nifty is up by ${pointsChange.toFixed(2)} points. No milestone crossed.`,
    });
  } catch (err: any) {
    console.error("Alert trigger error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
