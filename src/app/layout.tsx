import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeContext";
import { WatchlistProvider } from "@/components/WatchlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pre-Market Momentum | Real-Time Market Updates & Opening Signals",
  description: "Live trackers for GIFT NIFTY, INR/USD currency, Crude Oil, Indian ADRs, and Commodities. Proprietary Pre-Market India opening signal with confidence score calculations.",
  keywords: ["GIFT Nifty", "USD INR", "Crude Oil Brent", "Indian ADRs", "Market Sentiment", "Pre-Market Opening Signal", "NSE Nifty 50"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <WatchlistProvider>
            <MarketTicker />
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <Analytics />
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
