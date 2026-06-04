export interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  sparkline: number[];
  history: { date: string; price: number }[];
  category: "indices" | "currencies" | "commodities" | "adr";
  lastUpdated: string;
}

export interface MarketSentiment {
  score: number;
  label: "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed";
  advances: number;
  declines: number;
  unchanged: number;
  niftyPcr: number;
  vix: number;
  vixChangePercent: number;
}

export interface FoAnalysis {
  tradeType: "Intraday" | "Positional (1-2 Days)" | "Both";
  bias: "Bullish" | "Bearish" | "Neutral / High Volatility" | "Neutral / Sideways";
  suggestedStrategy: string;
  riskLevel: "High" | "Medium" | "Low";
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: "india" | "global" | "commodities" | "currency" | "adr";
  urgency: "low" | "medium" | "high";
  summary: string;
  impactScore: number;
  link?: string;
  affectedSectors?: string[];
  affectedAssets?: string[];
  foAnalysis?: FoAnalysis;
}

export interface PreMarketSignal {
  signal: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: number;
  score: number;
  rationale: string[];
  components: {
    giftNifty: { status: string; value: number; impact: "positive" | "negative" | "neutral" };
    adrAverage: { status: string; value: number; impact: "positive" | "negative" | "neutral" };
    rupeeUsd: { status: string; value: number; impact: "positive" | "negative" | "neutral" };
    crudeOil: { status: string; value: number; impact: "positive" | "negative" | "neutral" };
    niftyBank: { status: string; value: number; impact: "positive" | "negative" | "neutral" };
  };
}

// ---------------------------------------------------------
// INITIAL DATA & FALLBACK SIMULATOR SETUP
// ---------------------------------------------------------

const BASE_MARKET_DATA: MarketItem[] = [
  // 1. GIFT NIFTY
  {
    symbol: "GIFTNIFTY",
    name: "GIFT NIFTY Index",
    price: 23415.50,
    change: 142.20,
    changePercent: 0.61,
    high: 23480.00,
    low: 23290.00,
    open: 23295.00,
    sparkline: [23290, 23310, 23305, 23325, 23315, 23330, 23350, 23340, 23365, 23380, 23370, 23395, 23410, 23385, 23400, 23420, 23415, 23430, 23425, 23450, 23440, 23460, 23445, 23415.50],
    history: generateMockHistory(23415.50, 30, 0.004),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 2. NIFTY 50
  {
    symbol: "NIFTY50",
    name: "NIFTY 50",
    price: 23319.90,
    change: -163.65,
    changePercent: -0.70,
    high: 23490.00,
    low: 23280.00,
    open: 23483.55,
    sparkline: [23480, 23460, 23420, 23390, 23350, 23319.90],
    history: generateMockHistory(23319.90, 30, 0.004),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 3. BANK NIFTY
  {
    symbol: "BANKNIFTY",
    name: "BANK NIFTY",
    price: 53696.50,
    change: -18.15,
    changePercent: -0.03,
    high: 53820.00,
    low: 53500.00,
    open: 53714.65,
    sparkline: [53710, 53680, 53750, 53720, 53696.50],
    history: generateMockHistory(53696.50, 30, 0.006),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 4. FINNIFTY
  {
    symbol: "FINNIFTY",
    name: "FINNIFTY",
    price: 24805.85,
    change: -55.40,
    changePercent: -0.22,
    high: 24900.00,
    low: 24750.00,
    open: 24861.25,
    sparkline: [24860, 24840, 24820, 24805.85],
    history: generateMockHistory(24805.85, 30, 0.005),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 5. SENSEX
  {
    symbol: "SENSEX",
    name: "SENSEX",
    price: 74068.89,
    change: -580.95,
    changePercent: -0.78,
    high: 74650.00,
    low: 73980.00,
    open: 74649.84,
    sparkline: [74650, 74500, 74320, 74200, 74068.89],
    history: generateMockHistory(74068.89, 30, 0.004),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 6. Nifty Midcap Select
  {
    symbol: "NIFTY_MID_SELECT",
    name: "Nifty Midcap Select",
    price: 14079.65,
    change: -160.80,
    changePercent: -1.13,
    high: 14240.00,
    low: 14050.00,
    open: 14240.45,
    sparkline: [14240, 14200, 14150, 14100, 14079.65],
    history: generateMockHistory(14079.65, 30, 0.007),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 7. BANKEX
  {
    symbol: "BSE_BANKEX",
    name: "BANKEX",
    price: 60533.15,
    change: -10.33,
    changePercent: -0.02,
    high: 60650.00,
    low: 60320.00,
    open: 60543.48,
    sparkline: [60540, 60510, 60533.15],
    history: generateMockHistory(60533.15, 30, 0.005),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 8. India Vix
  {
    symbol: "INDIA_VIX",
    name: "India Vix",
    price: 16.34,
    change: 0.98,
    changePercent: 6.38,
    high: 16.80,
    low: 15.10,
    open: 15.36,
    sparkline: [15.36, 15.70, 16.00, 16.20, 16.34],
    history: generateMockHistory(16.34, 30, 0.025),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 9. Nifty Total Market
  {
    symbol: "NIFTY_TOTAL_MARKET",
    name: "Nifty Total Market",
    price: 12607.30,
    change: -81.35,
    changePercent: -0.64,
    high: 12690.00,
    low: 12580.00,
    open: 12688.65,
    sparkline: [12688, 12650, 12607.30],
    history: generateMockHistory(12607.30, 30, 0.004),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 10. NIFTY NEXT 50
  {
    symbol: "NIFTY_NEXT_50",
    name: "NIFTY NEXT 50",
    price: 69745.90,
    change: -369.90,
    changePercent: -0.53,
    high: 70120.00,
    low: 69580.00,
    open: 70115.80,
    sparkline: [70115, 69950, 69745.90],
    history: generateMockHistory(69745.90, 30, 0.005),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 11. NIFTY 100
  {
    symbol: "NIFTY_100",
    name: "NIFTY 100",
    price: 24328.85,
    change: -162.45,
    changePercent: -0.66,
    high: 24490.00,
    low: 24290.00,
    open: 24491.30,
    sparkline: [24491, 24410, 24328.85],
    history: generateMockHistory(24328.85, 30, 0.004),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 12. NIFTY Midcap 100
  {
    symbol: "NIFTY_MIDCAP_100",
    name: "NIFTY Midcap 100",
    price: 60424.60,
    change: -517.40,
    changePercent: -0.85,
    high: 60950.00,
    low: 60300.00,
    open: 60942.00,
    sparkline: [60942, 60700, 60424.60],
    history: generateMockHistory(60424.60, 30, 0.006),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 13. Bse 100
  {
    symbol: "BSE_100",
    name: "Bse 100",
    price: 24778.30,
    change: -189.26,
    changePercent: -0.76,
    high: 24960.00,
    low: 24720.00,
    open: 24967.56,
    sparkline: [24967, 24880, 24778.30],
    history: generateMockHistory(24778.30, 30, 0.004),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 14. NIFTY 500
  {
    symbol: "NIFTY_500",
    name: "NIFTY 500",
    price: 22372.65,
    change: -148.45,
    changePercent: -0.66,
    high: 22520.00,
    low: 22320.00,
    open: 22521.10,
    sparkline: [22521, 22440, 22372.65],
    history: generateMockHistory(22372.65, 30, 0.004),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 15. NIFTY Auto
  {
    symbol: "NIFTY_AUTO",
    name: "NIFTY Auto",
    price: 26082.35,
    change: 2.90,
    changePercent: 0.01,
    high: 26180.00,
    low: 25950.00,
    open: 26079.45,
    sparkline: [26079, 26040, 26082.35],
    history: generateMockHistory(26082.35, 30, 0.006),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 16. NIFTY Smallcap 100
  {
    symbol: "NIFTY_SMALLCAP_100",
    name: "NIFTY Smallcap 100",
    price: 17945.20,
    change: -107.10,
    changePercent: -0.59,
    high: 18050.00,
    low: 17890.00,
    open: 18052.30,
    sparkline: [18052, 17990, 17945.20],
    history: generateMockHistory(17945.20, 30, 0.007),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 17. NIFTY FMCG
  {
    symbol: "NIFTY_FMCG",
    name: "NIFTY FMCG",
    price: 48096.40,
    change: -516.40,
    changePercent: -1.06,
    high: 48612.00,
    low: 47980.00,
    open: 48612.80,
    sparkline: [48612, 48350, 48096.40],
    history: generateMockHistory(48096.40, 30, 0.005),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 18. NIFTY Metal
  {
    symbol: "NIFTY_METAL",
    name: "NIFTY Metal",
    price: 13486.95,
    change: -70.70,
    changePercent: -0.52,
    high: 13560.00,
    low: 13430.00,
    open: 13557.65,
    sparkline: [13557, 13510, 13486.95],
    history: generateMockHistory(13486.95, 30, 0.006),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 19. NIFTY Pharma
  {
    symbol: "NIFTY_PHARMA",
    name: "NIFTY Pharma",
    price: 23973.85,
    change: -32.45,
    changePercent: -0.14,
    high: 24050.00,
    low: 23910.00,
    open: 24006.30,
    sparkline: [24006, 23960, 23973.85],
    history: generateMockHistory(23973.85, 30, 0.005),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 20. NIFTY PSU Bank
  {
    symbol: "NIFTY_PSU_BANK",
    name: "NIFTY PSU Bank",
    price: 8073.00,
    change: 23.85,
    changePercent: 0.30,
    high: 8120.00,
    low: 8020.00,
    open: 8049.15,
    sparkline: [8049, 8060, 8073.00],
    history: generateMockHistory(8073.00, 30, 0.008),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 21. NIFTY IT
  {
    symbol: "NIFTY_IT",
    name: "NIFTY IT",
    price: 29396.80,
    change: -1719.75,
    changePercent: -5.53,
    high: 31120.00,
    low: 29250.00,
    open: 31116.55,
    sparkline: [31116, 30500, 29900, 29396.80],
    history: generateMockHistory(29396.80, 30, 0.009),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },
  // 22. Bse Smallcap
  {
    symbol: "BSE_SMALLCAP",
    name: "Bse Smallcap",
    price: 46825.31,
    change: 0.00,
    changePercent: 0.00,
    high: 46980.00,
    low: 46750.00,
    open: 46825.31,
    sparkline: [46825, 46825, 46825.31],
    history: generateMockHistory(46825.31, 30, 0.005),
    category: "indices",
    lastUpdated: new Date().toISOString(),
  },

  // CURRENCIES
  {
    symbol: "USDINR",
    name: "USD / INR Currency Rate",
    price: 83.425,
    change: -0.095,
    changePercent: -0.11,
    high: 83.560,
    low: 83.390,
    open: 83.520,
    sparkline: [83.52, 83.54, 83.51, 83.50, 83.49, 83.52, 83.51, 83.48, 83.47, 83.49, 83.48, 83.46, 83.45, 83.47, 83.46, 83.44, 83.43, 83.45, 83.44, 83.43, 83.42, 83.44, 83.43, 83.425],
    history: generateMockHistory(83.425, 30, 0.001),
    category: "currencies",
    lastUpdated: new Date().toISOString(),
  },

  // COMMODITIES
  {
    symbol: "GOLD",
    name: "Gold USD",
    price: 4445.84,
    change: -44.21,
    changePercent: -0.98,
    high: 4495.00,
    low: 4430.00,
    open: 4490.05,
    sparkline: [4490, 4480, 4470, 4465, 4455, 4445.84],
    history: generateMockHistory(4445.84, 30, 0.005),
    category: "commodities",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "WTI_CRUDE",
    name: "Crude USD",
    price: 96.47,
    change: 2.71,
    changePercent: 2.89,
    high: 97.20,
    low: 93.50,
    open: 93.76,
    sparkline: [93.8, 94.2, 94.8, 95.5, 96.0, 96.47],
    history: generateMockHistory(96.47, 30, 0.008),
    category: "commodities",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "CRUDEOIL",
    name: "Brent Crude USD",
    price: 98.60,
    change: 2.60,
    changePercent: 2.71,
    high: 99.30,
    low: 95.80,
    open: 96.00,
    sparkline: [96.0, 96.5, 97.0, 97.8, 98.2, 98.60],
    history: generateMockHistory(98.60, 30, 0.008),
    category: "commodities",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "GOLD_MCX",
    name: "GOLD MCX",
    price: 154600.00,
    change: -949.00,
    changePercent: -0.61,
    high: 156200.00,
    low: 154100.00,
    open: 155549.00,
    sparkline: [155549, 155200, 154900, 154600.00],
    history: generateMockHistory(154600.00, 30, 0.006),
    category: "commodities",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "CRUDE_MCX",
    name: "CRUDE MCX",
    price: 9232.00,
    change: 282.00,
    changePercent: 3.15,
    high: 9310.00,
    low: 8940.00,
    open: 8950.00,
    sparkline: [8950, 9020, 9150, 9232.00],
    history: generateMockHistory(9232.00, 30, 0.008),
    category: "commodities",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "COPPER_MCX",
    name: "COPPER MCX",
    price: 1377.40,
    change: -1.90,
    changePercent: -0.14,
    high: 1388.00,
    low: 1372.00,
    open: 1379.30,
    sparkline: [1379, 1381, 1376, 1377.40],
    history: generateMockHistory(1377.40, 30, 0.005),
    category: "commodities",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "NATGAS_MCX",
    name: "NATURAL GAS MCX",
    price: 309.60,
    change: 7.20,
    changePercent: 2.38,
    high: 312.00,
    low: 301.00,
    open: 302.40,
    sparkline: [302.4, 305.1, 307.2, 309.60],
    history: generateMockHistory(309.60, 30, 0.015),
    category: "commodities",
    lastUpdated: new Date().toISOString(),
  },

  // ADRs
  {
    symbol: "HDB",
    name: "HDFC Bank Ltd ADR",
    price: 61.20,
    change: 1.02,
    changePercent: 1.69,
    high: 61.50,
    low: 60.10,
    open: 60.18,
    sparkline: [60.18, 60.30, 60.25, 60.45, 60.35, 60.60, 60.75, 60.55, 60.80, 60.95, 60.85, 61.05, 61.15, 60.90, 61.00, 61.20, 61.10, 61.35, 61.25, 61.40, 61.30, 61.45, 61.32, 61.20],
    history: generateMockHistory(61.20, 30, 0.012),
    category: "adr",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "IBN",
    name: "ICICI Bank Ltd ADR",
    price: 27.84,
    change: 0.38,
    changePercent: 1.38,
    high: 28.02,
    low: 27.42,
    open: 27.46,
    sparkline: [27.46, 27.52, 27.50, 27.61, 27.58, 27.69, 27.73, 27.65, 27.78, 27.82, 27.79, 27.88, 27.91, 27.83, 27.86, 27.94, 27.90, 27.99, 27.93, 28.01, 27.96, 28.00, 27.89, 27.84],
    history: generateMockHistory(27.84, 30, 0.011),
    category: "adr",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd ADR",
    price: 18.52,
    change: 0.15,
    changePercent: 0.82,
    high: 18.68,
    low: 18.35,
    open: 18.37,
    sparkline: [18.37, 18.42, 18.39, 18.48, 18.45, 18.51, 18.55, 18.49, 18.54, 18.59, 18.56, 18.62, 18.65, 18.58, 18.60, 18.66, 18.63, 18.67, 18.64, 18.68, 18.61, 18.60, 18.55, 18.52],
    history: generateMockHistory(18.52, 30, 0.009),
    category: "adr",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "WIT",
    name: "Wipro Ltd ADR",
    price: 5.48,
    change: 0.03,
    changePercent: 0.55,
    high: 5.54,
    low: 5.42,
    open: 5.45,
    sparkline: [5.45, 5.47, 5.44, 5.48, 5.46, 5.49, 5.51, 5.48, 5.50, 5.52, 5.50, 5.53, 5.54, 5.51, 5.52, 5.53, 5.51, 5.54, 5.52, 5.53, 5.51, 5.50, 5.49, 5.48],
    history: generateMockHistory(5.48, 30, 0.01),
    category: "adr",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "RDY",
    name: "Dr. Reddy's Laboratories ADR",
    price: 72.90,
    change: -0.45,
    changePercent: -0.61,
    high: 73.65,
    low: 72.50,
    open: 73.35,
    sparkline: [73.35, 73.42, 73.20, 73.10, 72.90, 73.05, 72.85, 72.70, 72.95, 72.80, 72.65, 72.88, 72.75, 72.90, 72.82, 73.10, 72.95, 73.22, 73.08, 73.15, 72.98, 73.12, 73.02, 72.90],
    history: generateMockHistory(72.90, 30, 0.007),
    category: "adr",
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "AXBKY",
    name: "Axis Bank Ltd ADR",
    price: 70.80,
    change: 0.82,
    changePercent: 1.17,
    high: 71.50,
    low: 69.80,
    open: 69.98,
    sparkline: [69.98, 70.20, 70.10, 70.40, 70.30, 70.80],
    history: generateMockHistory(70.80, 30, 0.013),
    category: "adr",
    lastUpdated: new Date().toISOString(),
  }
];

function generateMockHistory(currentPrice: number, days: number, volatility: number) {
  const points = [];
  let price = currentPrice - currentPrice * volatility * days * 0.2;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dayVol = (Math.random() - 0.48) * volatility * price;
    price += dayVol;
    points.push({
      date: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      price: Number(price.toFixed(2)),
    });
  }
  points[points.length - 1].price = currentPrice;
  return points;
}

let activeMarketData: MarketItem[] = [...BASE_MARKET_DATA];

export function tickMarketData() {
  activeMarketData = activeMarketData.map((item) => {
    let volatility = 0.0005;
    if (item.category === "commodities") volatility = 0.001;
    if (item.category === "adr") volatility = 0.0015;
    
    // Maintain stable vix or special symbols if needed
    if (item.symbol === "INDIA_VIX") volatility = 0.01;

    const tick = (Math.random() - 0.47) * volatility * item.price;
    const newPrice = Number((item.price + tick).toFixed(item.category === "currencies" ? 3 : 2));
    const newChange = Number((item.change + tick).toFixed(2));
    const newChangePercent = Number(((newChange / item.open) * 100).toFixed(2));
    
    const newHigh = newPrice > item.high ? newPrice : item.high;
    const newLow = newPrice < item.low ? newPrice : item.low;
    const newSparkline = [...item.sparkline.slice(1), newPrice];
    
    const newHistory = [...item.history];
    if (newHistory.length > 0) {
      newHistory[newHistory.length - 1] = {
        ...newHistory[newHistory.length - 1],
        price: newPrice
      };
    }

    return {
      ...item,
      price: newPrice,
      change: newChange,
      changePercent: newChangePercent,
      high: newHigh,
      low: newLow,
      sparkline: newSparkline,
      history: newHistory,
      lastUpdated: new Date().toISOString()
    };
  });
  return activeMarketData;
}

// ---------------------------------------------------------
// SERVICE API METHODS
// ---------------------------------------------------------

export async function getMarketData(forceRefresh = false): Promise<MarketItem[]> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/market?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data && result.data.length > 0) {
          const apiData = result.data as MarketItem[];
          
          activeMarketData = activeMarketData.map((fallbackItem) => {
            const apiItem = apiData.find((a) => a.symbol === fallbackItem.symbol);
            if (!apiItem) return fallbackItem;
            
            return {
              ...fallbackItem,
              price: apiItem.price,
              change: apiItem.change,
              changePercent: apiItem.changePercent,
              high: apiItem.high,
              low: apiItem.low,
              open: apiItem.open,
              sparkline: apiItem.sparkline && apiItem.sparkline.length > 0 ? apiItem.sparkline : fallbackItem.sparkline,
              history: apiItem.history && apiItem.history.length > 0 ? apiItem.history : fallbackItem.history,
              lastUpdated: new Date().toISOString(),
            };
          });
          return activeMarketData;
        }
      }
    } catch (e) {
      console.warn("Real-time fetch failed. Utilizing simulated data feed.", e);
    }
  }

  if (forceRefresh) {
    tickMarketData();
  }
  return activeMarketData;
}

export function calculatePreMarketSignal(data: MarketItem[]): PreMarketSignal {
  const giftNifty = data.find((d) => d.symbol === "GIFTNIFTY")!;
  const rupee = data.find((d) => d.symbol === "USDINR")!;
  const crude = data.find((d) => d.symbol === "CRUDEOIL")!;
  const bankNifty = data.find((d) => d.symbol === "BANKNIFTY")!;
  
  const adrs = data.filter((d) => d.category === "adr");
  const adrAvgChange = adrs.reduce((sum, item) => sum + item.changePercent, 0) / adrs.length;
  
  const score = (0.45 * giftNifty.changePercent) +
                (0.30 * adrAvgChange) +
                (-0.10 * rupee.changePercent) +
                (-0.10 * crude.changePercent) +
                (0.05 * bankNifty.changePercent);

  let signal: "BULLISH" | "BEARISH" | "NEUTRAL" = "NEUTRAL";
  if (score > 0.15) {
    signal = "BULLISH";
  } else if (score < -0.15) {
    signal = "BEARISH";
  }

  let confidence = Math.min(95, Math.max(15, Math.round(Math.abs(score) * 150 + 40)));
  const rationale: string[] = [];
  
  if (giftNifty.changePercent > 0.3) {
    rationale.push(`GIFT NIFTY is trading up by ${giftNifty.changePercent}%, indicating positive local momentum.`);
  } else if (giftNifty.changePercent < -0.3) {
    rationale.push(`GIFT NIFTY displays pressure, down ${Math.abs(giftNifty.changePercent)}%, pointing to a weak opening.`);
  } else {
    rationale.push(`GIFT NIFTY is relatively flat (${giftNifty.changePercent}%), signaling a range-bound start.`);
  }

  if (adrAvgChange > 0.4) {
    rationale.push(`Indian ADRs in the US closed strong with a ${adrAvgChange.toFixed(2)}% average premium, which will pull up domestic large caps.`);
  } else if (adrAvgChange < -0.4) {
    rationale.push(`Weakness in ADR listings (${adrAvgChange.toFixed(2)}%) is expected to weigh down domestic tech and financial indices.`);
  }

  if (rupee.changePercent < -0.05) {
    rationale.push(`Indian Rupee strengthened against the Greenback (USD/INR down ${Math.abs(rupee.changePercent).toFixed(2)}%), prompting foreign fund (FII) inflows.`);
  } else if (rupee.changePercent > 0.05) {
    rationale.push(`Rupee depreciation (USD/INR up ${rupee.changePercent.toFixed(2)}%) could trigger capital outflows.`);
  }

  if (crude.changePercent < -0.5) {
    rationale.push(`Crude Oil prices dropped by ${Math.abs(crude.changePercent).toFixed(2)}% (trading at $${crude.price}/bbl), reducing import cost stress for the Indian economy.`);
  } else if (crude.changePercent > 0.5) {
    rationale.push(`Elevated Crude Oil prices (+${crude.changePercent.toFixed(2)}%) fuel domestic inflation worries.`);
  }

  if (bankNifty.changePercent > 0.3) {
    rationale.push(`Nifty Bank index closed strong at ${bankNifty.price} (+${bankNifty.changePercent}%), supporting positive banking sector sentiment.`);
  } else if (bankNifty.changePercent < -0.3) {
    rationale.push(`Banking sector indicators display profit booking, dragging the index down ${Math.abs(bankNifty.changePercent)}%.`);
  }

  const positiveSignalsCount = [
    giftNifty.changePercent > 0,
    adrAvgChange > 0,
    rupee.changePercent < 0,
    crude.changePercent < 0,
    bankNifty.changePercent > 0
  ].filter(Boolean).length;
  
  if (positiveSignalsCount === 2 || positiveSignalsCount === 3) {
    confidence = Math.max(15, confidence - 20);
  }

  const getImpact = (val: number, flip = false): "positive" | "negative" | "neutral" => {
    const adjusted = flip ? -val : val;
    if (adjusted > 0.1) return "positive";
    if (adjusted < -0.1) return "negative";
    return "neutral";
  };

  return {
    signal,
    confidence,
    score,
    rationale,
    components: {
      giftNifty: {
        status: `${giftNifty.changePercent >= 0 ? "+" : ""}${giftNifty.changePercent}%`,
        value: giftNifty.price,
        impact: getImpact(giftNifty.changePercent),
      },
      adrAverage: {
        status: `${adrAvgChange >= 0 ? "+" : ""}${adrAvgChange.toFixed(2)}%`,
        value: Number(adrs[0].price.toFixed(2)),
        impact: getImpact(adrAvgChange),
      },
      rupeeUsd: {
        status: `${rupee.changePercent >= 0 ? "+" : ""}${rupee.changePercent}%`,
        value: rupee.price,
        impact: getImpact(rupee.changePercent, true),
      },
      crudeOil: {
        status: `${crude.changePercent >= 0 ? "+" : ""}${crude.changePercent}%`,
        value: crude.price,
        impact: getImpact(crude.changePercent, true),
      },
      niftyBank: {
        status: `${bankNifty.changePercent >= 0 ? "+" : ""}${bankNifty.changePercent}%`,
        value: bankNifty.price,
        impact: getImpact(bankNifty.changePercent),
      },
    },
  };
}

export function getMarketSentiment(marketItems?: MarketItem[]): MarketSentiment {
  if (!marketItems || marketItems.length === 0) {
    return {
      score: 64,
      label: "Greed",
      advances: 1240,
      declines: 812,
      unchanged: 104,
      niftyPcr: 1.12,
      vix: 13.45,
      vixChangePercent: -2.35
    };
  }

  const nifty = marketItems.find((m) => m.symbol === "NIFTY50");
  const vixItem = marketItems.find((m) => m.symbol === "INDIA_VIX");
  
  const niftyChange = nifty ? nifty.changePercent : 0.0;
  const vixValue = vixItem ? vixItem.price : 14.5;
  const vixChange = vixItem ? vixItem.changePercent : 0.0;

  // 1. Advances / Declines simulation based on actual breadth
  const totalTracked = marketItems.length;
  const positiveTracked = marketItems.filter(item => item.change >= 0).length;
  const positiveRatio = totalTracked > 0 ? positiveTracked / totalTracked : 0.5;

  const unchanged = 104;
  const advances = Math.max(150, Math.min(1850, Math.round(positiveRatio * 2000)));
  const declines = Math.max(150, 2100 - advances - unchanged);

  // 2. Put-Call Ratio (PCR) based on Nifty performance
  let niftyPcr = 1.0 + (niftyChange / 100) * 15.0; // scale up percentage
  niftyPcr = Math.max(0.65, Math.min(1.55, niftyPcr));

  // 3. Fear & Greed Index Score
  // VIX baseline is 15. Below 15 indicates greed, above indicates fear.
  const vixFactor = (15 - vixValue) * 2.5; 
  const niftyFactor = (niftyChange / 100) * 180.0; // scale up percentage
  const breadthFactor = (positiveRatio - 0.5) * 30;

  let score = Math.round(50 + niftyFactor + vixFactor + breadthFactor);
  score = Math.max(5, Math.min(95, score));

  let label: "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed" = "Neutral";
  if (score < 25) label = "Extreme Fear";
  else if (score < 45) label = "Fear";
  else if (score < 55) label = "Neutral";
  else if (score < 75) label = "Greed";
  else label = "Extreme Greed";

  return {
    score,
    label,
    advances,
    declines,
    unchanged,
    niftyPcr,
    vix: vixValue,
    vixChangePercent: vixChange
  };
}

// ---------------------------------------------------------
// NEWS & ALERTS REPOSITORY
// ---------------------------------------------------------

const MOCK_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "GIFT Nifty surges over 150 points as local banking sectors prepare for opening",
    source: "Bloomberg Quint",
    time: "10 mins ago",
    category: "india",
    urgency: "high",
    summary: "Indian equities are poised for a gap-up opening as GIFT Nifty trades near 23,480. Strong domestic macroeconomic parameters and supportive index flows bolster indices.",
    impactScore: 8,
    affectedSectors: ["Banking & Finance", "Macroeconomy"],
    affectedAssets: ["Nifty 50", "Nifty Bank"],
    foAnalysis: {
      tradeType: "Intraday",
      bias: "Bullish",
      suggestedStrategy: "Long Calls / Bull Call Spreads",
      riskLevel: "High"
    }
  },
  {
    id: "news-2",
    title: "Brent crude falls to $81.34/bbl; oil slides on rising US inventories",
    source: "Reuters",
    time: "25 mins ago",
    category: "commodities",
    urgency: "medium",
    summary: "Crude futures dropped by more than 1% following API inventory numbers showing higher crude storage builds. Lower crude import expenses are structurally bullish for Indian corporate margins.",
    impactScore: 5,
    affectedSectors: ["Energy & Power", "Macroeconomy"],
    affectedAssets: ["Crude Oil"],
    foAnalysis: {
      tradeType: "Positional (1-2 Days)",
      bias: "Bullish",
      suggestedStrategy: "Bull Call Spreads",
      riskLevel: "Medium"
    }
  },
  {
    id: "news-3",
    title: "Infosys & HDFC Bank ADR premiums rise in New York trade",
    source: "Financial Express",
    time: "45 mins ago",
    category: "adr",
    urgency: "medium",
    summary: "Indian ADR counters closed higher, with HDFC Bank gaining 1.69% and ICICI Bank rising 1.38%. Technology major Infosys also added 0.82%, indicating interest in domestic large-caps.",
    impactScore: 7,
    affectedSectors: ["Banking & Finance", "Information Technology"],
    affectedAssets: ["HDFC Bank", "Infosys", "ICICI Bank"],
    foAnalysis: {
      tradeType: "Both",
      bias: "Bullish",
      suggestedStrategy: "Long Calls / Bull Call Spreads",
      riskLevel: "Medium"
    }
  },
  {
    id: "news-4",
    title: "Rupee trades higher at 83.42 against USD amid foreign inflows",
    source: "Economic Times",
    time: "1 hour ago",
    category: "currency",
    urgency: "low",
    summary: "The Indian Rupee edged up 9 paise in early trade to 83.42, tracking positive domestic equities and weak US dollar index, supporting overall banking liquidity.",
    impactScore: 4,
    affectedSectors: ["Banking & Finance", "Macroeconomy"],
    affectedAssets: ["USD/INR"],
    foAnalysis: {
      tradeType: "Intraday",
      bias: "Bullish",
      suggestedStrategy: "Bull Put Spreads (Short Puts)",
      riskLevel: "Low"
    }
  },
  {
    id: "news-6",
    title: "SEBI proposes tightening derivatives rules to curb speculative retail trading",
    source: "Moneycontrol",
    time: "3 hours ago",
    category: "india",
    urgency: "high",
    summary: "The market regulator is considering higher contract sizes and stricter margin norms for index options, potentially reducing speculative volumes in Nifty and Bank Nifty contracts.",
    impactScore: -6,
    affectedSectors: ["Banking & Finance", "Macroeconomy"],
    affectedAssets: ["Nifty 50", "Nifty Bank"],
    foAnalysis: {
      tradeType: "Positional (1-2 Days)",
      bias: "Neutral / High Volatility",
      suggestedStrategy: "Long Straddle / Strangle (Vol Spike)",
      riskLevel: "High"
    }
  },
  {
    id: "news-7",
    title: "Gold reaches 2-week high at $2,327 as bond yields cool down",
    source: "CNBC",
    time: "4 hours ago",
    category: "commodities",
    urgency: "medium",
    summary: "Safe-haven gold gained 0.81% as the US 10-year Treasury yield slipped below 4.3% following cooling inflation data, renewing interest in non-yielding yellow metals.",
    impactScore: 3,
    affectedSectors: ["Metals & Mining", "Macroeconomy"],
    affectedAssets: ["Bullion"],
    foAnalysis: {
      tradeType: "Positional (1-2 Days)",
      bias: "Bullish",
      suggestedStrategy: "Bull Call Spreads",
      riskLevel: "Medium"
    }
  }
];

export async function getNewsAlerts(category?: string): Promise<NewsItem[]> {
  if (typeof window !== "undefined") {
    try {
      const catParam = category ? `?category=${category}` : "";
      const res = await fetch(`/api/news${catParam}`, { cache: "no-store" });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          return result.data as NewsItem[];
        }
      }
    } catch (e) {
      console.warn("Failed to fetch live news alerts, falling back to mock data.", e);
    }
  }

  if (!category || category === "all") {
    return MOCK_NEWS;
  }
  return MOCK_NEWS.filter((n) => n.category === category);
}
