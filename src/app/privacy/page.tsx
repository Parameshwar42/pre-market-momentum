import React from "react";
import { Shield, Eye, Lock, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 flex-1 flex flex-col justify-start leading-relaxed text-sm text-muted-foreground">
      <div className="text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 mb-2">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-indigo-500">
          Last Updated: June 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p>
          At <strong>Pre-Market Momentum</strong>, accessible from <code>premarketmomentum.com</code>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Pre-Market Momentum and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
        </p>

        <hr className="border-border/60" />

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-500" />
            1. Consent
          </h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-500" />
            2. Information We Collect
          </h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            3. How We Use Your Information
          </h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide, operate, and maintain our website and market metrics.</li>
            <li>Improve, personalize, and expand our website (specifically using Vercel Web Analytics).</li>
            <li>Understand and analyze how you use our website (e.g., page duration and interaction frequency).</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Find and prevent fraud.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            4. Log Files & Analytics
          </h2>
          <p>
            Pre-Market Momentum follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            5. Cookies and Web Beacons
          </h2>
          <p>
            Like any other website, Pre-Market Momentum uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            6. Google DoubleClick DART Cookie & Third-Party Advertising
          </h2>
          <p>
            Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">https://policies.google.com/technologies/ads</a>.
          </p>
          <p>
            You may consult this list to find the Privacy Policy for each of the advertising partners of Pre-Market Momentum.
          </p>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Pre-Market Momentum, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that Pre-Market Momentum has no access to or control over these cookies that are used by third-party advertisers.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            7. GDPR Data Protection Rights & CCPA Compliance
          </h2>
          <p>We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
