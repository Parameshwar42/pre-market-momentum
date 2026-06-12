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

    // 2. Regular price milestone check logic
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

