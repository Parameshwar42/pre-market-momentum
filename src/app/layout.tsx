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
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pre-market-momentum.vercel.app"),
  title: "Pre-Market Momentum | Real-Time Market Updates & Opening Signals",
  description: "Live trackers for GIFT NIFTY, INR/USD currency, Crude Oil, Indian ADRs, and Commodities. Proprietary Pre-Market India opening signal with confidence score calculations.",
  keywords: ["GIFT Nifty", "USD INR", "Crude Oil Brent", "Indian ADRs", "Market Sentiment", "Pre-Market Opening Signal", "NSE Nifty 50"],
  other: {
    "google-adsense-account": "ca-pub-4399943882344598",
  },
  openGraph: {
    title: "Pre-Market Momentum | Live Indian Open Signals",
    description: "Get real-time market updates, GIFT NIFTY predictions, live Indian ADR premiums, and MCX commodities arbitrage tracking.",
    url: "https://pre-market-momentum.vercel.app",
    siteName: "Pre-Market Momentum",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og_preview.png",
        width: 1200,
        height: 630,
        alt: "Pre-Market Momentum | Live Indian Open Signals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pre-Market Momentum | Live Indian Open Signals",
    description: "Get real-time market updates, GIFT NIFTY predictions, live Indian ADR premiums, and MCX commodities arbitrage tracking.",
    images: ["/og_preview.png"],
  },
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
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4399943882344598"
          crossOrigin="anonymous"
        />
      </head>
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
            <CookieConsent />
            

            
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
