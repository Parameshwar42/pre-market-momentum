import React from "react";
import { FileText, Compass, Scale, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 flex-1 flex flex-col justify-start leading-relaxed text-sm text-muted-foreground">
      <div className="text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 mb-2">
          <FileText className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-indigo-500">
          Last Updated: June 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p>
          Welcome to <strong>Pre-Market Momentum</strong>. These terms and conditions outline the rules and regulations for the use of Pre-Market Momentum's Website, located at <code>premarketmomentum.com</code>.
        </p>
        <p>
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use Pre-Market Momentum if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <hr className="border-border/60" />

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-500" />
            1. Description of Service & Disclaimers
          </h2>
          <p>
            Pre-Market Momentum is an educational dashboard designed to evaluate global market spreads, commodities futures indicators, and index arbitrage dynamics. 
          </p>
          <p>
            All opening signals, option PCR summaries, trade biases, and simulated indices are generated for educational and analytical purposes. We do not offer financial advisory or trading execution services. Trading derivatives (F&O) and equities in India carries substantial capital risk.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-500" />
            2. Intellectual Property & Site Usage
          </h2>
          <p>
            Unless otherwise stated, Pre-Market Momentum and/or its licensors own the intellectual property rights for all material on Pre-Market Momentum. All intellectual property rights are reserved. You may access this from Pre-Market Momentum for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Republish material from Pre-Market Momentum.</li>
            <li>Sell, rent or sub-license material from Pre-Market Momentum.</li>
            <li>Reproduce, duplicate or copy material from Pre-Market Momentum.</li>
            <li>Redistribute content from Pre-Market Momentum.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-500" />
            3. Disclaimer & Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Limit or exclude our or your liability for death or personal injury resulting from negligence;</li>
            <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>Limit any of our or your liabilities in any way that is not permitted under applicable law.</li>
          </ul>
          <p>
            As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature. We do not guarantee the completeness or accuracy of any financial charts or third-party index tickers fetched from Yahoo Finance.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            4. Hyperlinking to our Content
          </h2>
          <p>
            Traders, brokers, and news organizations may link to our home page, to publications or to other website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            5. Governing Law
          </h2>
          <p>
            These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </div>
      </div>
    </div>
  );
}
