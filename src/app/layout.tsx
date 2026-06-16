import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeContext";
import { WatchlistProvider } from "@/components/WatchlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://premarketmomentum.com"),
  title: "Pre-Market Momentum | Real-Time Market Updates & Opening Signals",
  description: "Live trackers for GIFT NIFTY, INR/USD currency, Crude Oil, Indian ADRs, and Commodities. Proprietary Pre-Market India opening signal with confidence score calculations.",
  keywords: ["GIFT Nifty", "USD INR", "Crude Oil Brent", "Indian ADRs", "Market Sentiment", "Pre-Market Opening Signal", "NSE Nifty 50"],
  other: {
    "google-adsense-account": "ca-pub-4399943882344598",
  },
  openGraph: {
    title: "Pre-Market Momentum | Live Indian Open Signals",
    description: "Get real-time market updates, GIFT NIFTY predictions, live Indian ADR premiums, and MCX commodities arbitrage tracking.",
    url: "https://premarketmomentum.com",
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
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4399943882344598"
          crossOrigin="anonymous"
        />
        {/* Adsterra Popunder */}
        <script
          async
          src="https://pl29761109.effectivecpmnetwork.com/81/16/b1/8116b19108347c0f29020a460482d266.js"
        />
        {/* Adsterra Script */}
        <script
          async
          src="https://pl29761112.effectivecpmnetwork.com/9d/19/00/9d1900fe787a3c4878bf76e9f5d6c48b.js"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200 pb-[60px] md:pb-0">
        <ThemeProvider>
          <WatchlistProvider>
            <MarketTicker />
            <Header />
            
            {/* Adsterra 468x60 Banner */}
            <div className="w-full flex justify-center py-2 bg-card border-b border-border/50 overflow-hidden">
              <div className="flex items-center justify-center max-w-full overflow-x-auto scrollbar-none">
                <div className="w-[468px] h-[60px] shrink-0 relative">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>
                            body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
                          </style>
                        </head>
                        <body>
                          <script type="text/javascript">
                            atOptions = {
                              'key' : 'da564d73770000dec96e582f91d165e2',
                              'format' : 'iframe',
                              'height' : 60,
                              'width' : 468,
                              'params' : {}
                            };
                          </script>
                          <script type="text/javascript" src="https://www.highperformanceformat.com/da564d73770000dec96e582f91d165e2/invoke.js"></script>
                        </body>
                      </html>
                    `}
                    width="468"
                    height="60"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                  />
                </div>
              </div>
            </div>

            <main className="flex-1 flex flex-col max-w-full overflow-x-hidden">
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

            {/* Adsterra Social Bar / Widget */}
            <div id="container-90b7bb4deb894696f1631cdb992d166f" />
            <script
              async
              data-cfasync="false"
              src="https://pl29761110.effectivecpmnetwork.com/90b7bb4deb894696f1631cdb992d166f/invoke.js"
            />

            {/* Adsterra 160x600 Wide Skyscraper Banner - Right Gutter */}
            <div className="hidden min-[1620px]:block fixed right-4 top-[150px] z-30 w-[160px] h-[600px]">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
                      </style>
                    </head>
                    <body>
                      <script type="text/javascript">
                        atOptions = {
                          'key' : '59a2f33c485cd1729c34188ac2010c3e',
                          'format' : 'iframe',
                          'height' : 600,
                          'width' : 160,
                          'params' : {}
                        };
                      </script>
                      <script type="text/javascript" src="https://www.highperformanceformat.com/59a2f33c485cd1729c34188ac2010c3e/invoke.js"></script>
                    </body>
                  </html>
                `}
                width="160"
                height="600"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
              />
            </div>

            {/* Sticky Mobile Footer Banner (320x50) - Visible only on screens smaller than 768px */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/60 py-1 flex justify-center shadow-lg">
              <div className="w-[320px] h-[50px] shrink-0 relative">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>
                          body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
                        </style>
                      </head>
                      <body>
                        <script type="text/javascript">
                          atOptions = {
                            'key' : '051da1b93fbac39590ccf417fa6540dd',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                          };
                        </script>
                        <script type="text/javascript" src="https://www.highperformanceformat.com/051da1b93fbac39590ccf417fa6540dd/invoke.js"></script>
                      </body>
                    </html>
                  `}
                  width="320"
                  height="50"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                />
              </div>
            </div>
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
