import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
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
            
            {/* OneSignal Web Push Notifications */}
            <Script
              src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
              strategy="afterInteractive"
            />
            <Script id="onesignal-init" strategy="afterInteractive">
              {`
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                OneSignalDeferred.push(async function(OneSignal) {
                  await OneSignal.init({
                    appId: "bf32e443-f648-4c4b-b1d6-b521e02b79c4",
                  });
                });
              `}
            </Script>
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
