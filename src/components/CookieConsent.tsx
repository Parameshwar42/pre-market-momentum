"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent-choice");
    if (!consent) {
      // Delay display slightly for smooth entry transition
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent-choice", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent-choice", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-500 ease-out">
      <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card/90 backdrop-blur-md p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 transition-all duration-300">
        
        {/* Banner Text */}
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-foreground tracking-tight">
              Cookie Consent & Analytics
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              We use cookies to analyze web traffic, optimize loading speeds, and serve relevant contextual ads. By clicking "Accept All", you agree to our storage of tracking cookies. Read our detailed{" "}
              <Link href="/privacy" className="text-indigo-500 hover:underline font-semibold">
                Privacy Policy
              </Link>{" "}
              for more information.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-initial rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-initial rounded-xl bg-primary text-white hover:bg-primary/95 px-5 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-primary/10 hover:shadow-primary/20 cursor-pointer"
          >
            Accept All
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors hidden md:block"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
