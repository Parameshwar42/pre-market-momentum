"use client";

import React from "react";

interface TradingViewChartProps {
  symbol: string;
  theme?: "light" | "dark";
  height?: number;
}

export function getTradingViewSymbol(symbol: string): string {
  switch (symbol) {
    case "GIFTNIFTY": return "NSE:NIFTY"; // GIFT Nifty proxy
    case "NIFTY50": return "NSE:NIFTY";
    case "BANKNIFTY": return "NSE:BANKNIFTY";
    case "FINNIFTY": return "NSE:FINNIFTY";
    case "SENSEX": return "BSE:SENSEX";
    case "NIFTY_MID_SELECT": return "NSE:MIDCPNIFTY";
    case "BSE_BANKEX": return "BSE:BANKEX";
    case "NIFTY_100": return "NSE:CNX100";
    case "NIFTY_MIDCAP_100": return "NSE:MIDCAP100";
    case "NIFTY_500": return "NSE:NIFTY500";
    case "NIFTY_TOTAL_MARKET": return "NSE:NIFTY_TOTAL_MARKET";
    case "NIFTY_NEXT_50": return "NSE:NIFTY_NEXT_50";
    case "BSE_100": return "BSE:BSE100";
    case "NIFTY_AUTO": return "NSE:NIFTY_AUTO";
    case "NIFTY_SMALLCAP_100": return "NSE:NIFTY_SMALLCAP_100";
    case "NIFTY_FMCG": return "NSE:NIFTY_FMCG";
    case "NIFTY_METAL": return "NSE:NIFTY_METAL";
    case "NIFTY_PHARMA": return "NSE:NIFTY_PHARMA";
    case "NIFTY_PSU_BANK": return "NSE:NIFTY_PSU_BANK";
    case "NIFTY_IT": return "NSE:NIFTY_IT";
    case "BSE_SMALLCAP": return "BSE:BSE_SMALLCAP";
    case "USDINR": return "FX_IDC:USDINR";
    case "GOLD": return "TVC:GOLD";
    case "WTI_CRUDE": return "TVC:USOIL";
    case "CRUDEOIL": return "TVC:UKOIL";
    case "GOLD_MCX": return "MCX:GOLD1!";
    case "CRUDE_MCX": return "MCX:CRUDEOIL1!";
    case "COPPER_MCX": return "MCX:COPPER1!";
    case "NATGAS_MCX": return "MCX:NATURALGAS1!";
    case "HDB": return "NYSE:HDB";
    case "IBN": return "NYSE:IBN";
    case "INFY": return "NYSE:INFY";
    case "WIT": return "NYSE:WIT";
    case "RDY": return "NYSE:RDY";
    case "AXBKY": return "NASDAQ:AXBKY";
    default: return symbol;
  }
}

export default function TradingViewChart({ symbol, theme = "dark", height = 400 }: TradingViewChartProps) {
  const tvSymbol = getTradingViewSymbol(symbol);
  
  const config = {
    autosize: true,
    symbol: tvSymbol,
    interval: "5",
    timezone: "Asia/Kolkata",
    theme: theme,
    style: "1",
    locale: "en",
    enable_publishing: false,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    calendar: false,
    support_host: "https://www.tradingview.com"
  };

  const iframeUrl = `https://s.tradingview.com/embed-widget/advanced-chart/?locale=en#${encodeURIComponent(
    JSON.stringify(config)
  )}`;

  return (
    <div 
      className="tradingview-widget-container border border-border/50 rounded-3xl overflow-hidden bg-card" 
      style={{ height: `${height}px`, width: "100%" }}
    >
      <iframe
        src={iframeUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        allowFullScreen
        title={`TradingView Chart for ${symbol}`}
      />
    </div>
  );
}
