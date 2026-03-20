"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const comparisonRows = [
  ["Covers all 7 regulatory bodies", "Partial", "Full"],
  ["Understands Bahasa + Rojak", "No", "Yes"],
  ["Live risk score that updates", "No", "Yes"],
  ["Penalty exposure in RM", "No", "Yes"],
  ["AI reads your documents", "No", "Yes"],
  ["Pre-fills government forms", "No", "Yes"],
  ["Grant eligibility matching", "No", "Yes"],
  ["Email reminders 90/30/7 days", "No", "Yes"],
  ["No MSIC codes needed", "Required", "Just describe it"],
];

const features = [
  {
    icon: "🛡️",
    title: "Live Compliance Risk Score",
    desc:
      "Your dashboard shows a single number - your compliance health score from 0 to 100. It updates the moment you upload a document. Go from red (high risk) to green (compliant) in real time. See exactly how much penalty exposure in Ringgit you carry right now.",
    tag: "PREDICTIVE",
    tagClass: "bg-teal-600/30 text-teal-300 border-teal-500/40",
  },
  {
    icon: "📄",
    title: "AI Document Scanner",
    desc:
      "Upload any cert, licence, or tax form - PDF, JPG, or PNG. Our Gemini-powered scanner reads it in seconds, extracts the expiry date, checks for anomalies like name mismatches, and automatically links it to the right compliance item. No manual entry.",
    tag: "POWERED BY GEMINI",
    tagClass: "bg-blue-600/30 text-blue-300 border-blue-500/40",
  },
  {
    icon: "✍️",
    title: "Auto-fill Government Forms",
    desc:
      "Stop filling SSM Borang A and LHDN CP204 by hand. We extract your business data and pre-fill the forms for you. Download the draft PDF, review it, and bring it to the counter. Saves hours of manual work.",
    tag: "SSM + LHDN",
    tagClass: "bg-cyan-600/30 text-cyan-300 border-cyan-500/40",
  },
  {
    icon: "📧",
    title: "Deadline Email Alerts",
    desc:
      "Register your email once and never miss a deadline again. We send you reminders at 90 days, 30 days, and 7 days before every compliance deadline - in English or Bahasa Malaysia based on your preference.",
    tag: "90 / 30 / 7 DAYS",
    tagClass: "bg-emerald-600/30 text-emerald-300 border-emerald-500/40",
  },
  {
    icon: "🎁",
    title: "Government Grant Matcher",
    desc:
      "Most SMEs don't know they qualify for government grants. LULUS AI automatically matches your business profile against available grants - SME Digitalisation Grant (RM5,000), HRDF, JAKIM Halal Fund and more - and shows you how to apply.",
    tag: "UP TO RM10,000",
    tagClass: "bg-indigo-600/30 text-indigo-300 border-indigo-500/40",
  },
  {
    icon: "📊",
    title: "Downloadable Compliance Report",
    desc:
      "Generate a one-page Compliance Health Report anytime. Shows your risk score, all compliance items with status, upcoming deadlines, penalty exposure, and grant opportunities. Share it with your accountant, bank, or investor to prove you are compliant.",
    tag: "PDF DOWNLOAD",
    tagClass: "bg-sky-600/30 text-sky-300 border-sky-500/40",
  },
];

export default function LandingPage(): JSX.Element {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-6">
        <nav
          className={`sticky top-0 z-40 -mx-6 mb-10 border-b px-6 py-4 transition ${
            scrolled ? "border-white/10 bg-[#070707]/95 backdrop-blur-md" : "border-transparent bg-transparent"
          }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <p className="text-xl font-bold tracking-wide text-white">LULUS AI</p>
            <div className="flex items-center gap-2">
              <Link href="/auth" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40">
                Log In
              </Link>
              <Link href="/auth" className="rounded-full bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
                Get Started Free
              </Link>
            </div>
          </div>
        </nav>

        <section className="py-20 text-center md:py-24">
          <div className="mx-auto mb-6 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-gray-200">
            🇲🇾 Built for Malaysian SMEs
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Stop Paying Fines.
            <br />
            Start Staying Compliant.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base text-gray-400 md:text-lg">
            LULUS AI monitors every compliance deadline your business faces - SSM, LHDN, JAKIM, EPF, SOCSO and more.
            Get alerted before deadlines hit. Upload documents and watch your risk score drop in real time.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth" className="rounded-full bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white hover:brightness-110">
              Check My Business Free →
            </Link>
            <a href="#how-it-works" className="rounded-full border border-white/20 px-6 py-3 text-sm text-white hover:border-white/40">
              See How It Works ↓
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card. No forms. Just describe your business in plain language.</p>
        </section>

        <section className="py-20 md:py-24">
          <h2 className="text-3xl font-semibold md:text-4xl">Malaysian SMEs lose millions every year to compliance failures</h2>
          <p className="mt-3 text-gray-400">Not because their business is bad - because they missed a deadline.</p>
          <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
            {[
              ["RM 50,000", "SSM late annual return fine", "+ director personal liability"],
              ["RM 10,000–50,000", "LHDN late SST filing penalty", "per filing period missed"],
              ["Immediate", "JAKIM halal cert suspension", "when cert expires unrenewed"],
              ["6% / month", "EPF late contribution penalty", "compounding every month"],
              ["Forced closure", "Expired premises licence", "local council enforcement"],
            ].map(([num, label, sub]) => (
              <div key={label} className="min-w-[240px] rounded-xl border border-white/10 bg-[#111111] p-4">
                <p className="text-2xl font-bold text-white">{num}</p>
                <p className="mt-2 text-sm text-gray-200">{label}</p>
                <p className="mt-1 text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-4xl leading-7 text-gray-400">
            Most SME owners manage compliance manually - spreadsheets, reminders in their phone, or worse, nothing at all.
            They find out about a missed deadline when the fine letter arrives.
            <br />
            <br />
            LULUS AI changes that. We monitor everything, alert you early, and show you exactly what to fix - before it costs you.
          </p>
        </section>

        <section className="py-20 md:py-24">
          <h2 className="text-3xl font-semibold md:text-4xl">Why LULUS AI is different from every other tool</h2>
          <p className="mt-3 max-w-3xl text-gray-400">
            There are generic compliance tools. Then there is LULUS AI - built specifically for how Malaysian SMEs actually work.
          </p>
          <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-[#111111]">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-white/10 text-left text-gray-300">
                <tr>
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Other tools</th>
                  <th className="border-l border-blue-500/40 bg-blue-500/10 px-4 py-3 text-blue-300">LULUS AI</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, other, ours]) => (
                  <tr key={feature} className="border-b border-white/5 last:border-b-0">
                    <td className="px-4 py-3 text-gray-200">{feature}</td>
                    <td className="px-4 py-3 text-red-300">❌ {other}</td>
                    <td className="border-l border-blue-500/30 bg-blue-500/5 px-4 py-3 text-green-300">✅ {ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-gray-400">
            No other Malaysian compliance tool combines risk scoring, document intelligence, grant matching, and plain-language onboarding in one place.
          </p>
        </section>

        <section className="py-20 md:py-24">
          <h2 className="text-3xl font-semibold md:text-4xl">Everything you need. Nothing you don't.</h2>
          <p className="mt-3 max-w-3xl text-gray-400">
            Six powerful features working together to keep your business fully compliant - automatically.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-white/10 bg-[#111111] p-5 transition hover:border-white/20 hover:brightness-110"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${feature.tagClass}`}>{feature.tag}</span>
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-24">
          <h2 className="text-3xl font-semibold md:text-4xl">From zero to fully compliant in 3 steps</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
              <p className="text-3xl font-bold text-blue-400">01</p>
              <p className="mt-2 text-lg font-semibold">Describe your business</p>
              <p className="text-sm text-gray-400">Just talk to us</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Type what you do in plain language - Bahasa Malaysia, English, or Rojak. No MSIC codes. No dropdowns. No registration forms. Our AI understands you.
              </p>
              <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-gray-300">
                Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
              <p className="text-3xl font-bold text-blue-400">02</p>
              <p className="mt-2 text-lg font-semibold">Get your compliance map</p>
              <p className="text-sm text-gray-400">AI builds your picture</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                In seconds, our AI maps every regulatory requirement for your exact business - based on your type, location, employee count, and sales channels.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 rounded-lg border border-white/10 bg-black/30 p-3 text-xs">
                <span className="rounded-full bg-white/10 px-2 py-1">fnb</span>
                <span className="rounded-full bg-blue-600 px-2 py-1">Subang Jaya</span>
                <span className="rounded-full bg-white/10 px-2 py-1">3 employees</span>
                <span className="rounded-full bg-white/10 px-2 py-1">online</span>
                <span className="rounded-full bg-blue-600 px-2 py-1">halal food</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
              <p className="text-3xl font-bold text-blue-400">03</p>
              <p className="mt-2 text-lg font-semibold">Stay compliant automatically</p>
              <p className="text-sm text-gray-400">We handle the monitoring</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Upload your certs and licences. Get email reminders before deadlines. Ask our AI compliance questions in BM or English. Download your health report.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <h2 className="text-3xl font-semibold md:text-4xl">Built for every Malaysian SME</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <article className="rounded-xl border border-white/10 bg-[#111111] p-4">
              <p className="text-lg font-semibold">🍜 F&B Owners</p>
              <p className="mt-2 text-sm text-gray-400">Warung, restaurant, cafe, food truck owners who need to track SSM, JAKIM halal cert, premises licence, EPF and SST.</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#111111] p-4">
              <p className="text-lg font-semibold">🛍️ Retailers</p>
              <p className="mt-2 text-sm text-gray-400">Kedai runcit, boutique, hardware shop owners managing SSM, business licence, signboard permit and staff contributions.</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#111111] p-4">
              <p className="text-lg font-semibold">💻 E-commerce Sellers</p>
              <p className="mt-2 text-sm text-gray-400">Shopee, Lazada, TikTok sellers who need to track SSM, SST, MDEC registration and consumer protection requirements.</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#111111] p-4">
              <p className="text-lg font-semibold">🏭 Small Manufacturers</p>
              <p className="mt-2 text-sm text-gray-400">Factory and workshop owners handling SSM, DOSH, CIDB, environmental compliance, EPF, HRDF and export requirements.</p>
            </article>
          </div>
        </section>
      </div>

      <section className="border-y border-white/10 bg-[#0f0f0f] py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Ready to know your compliance status?</h2>
          <p className="mx-auto mt-3 max-w-3xl text-gray-400">
            Join Malaysian SME owners who use LULUS AI to stay compliant, avoid fines, and find grants they didn't know existed.
          </p>
          <Link href="/auth" className="mt-8 inline-block rounded-full bg-[#3B82F6] px-7 py-3 text-sm font-semibold text-white hover:brightness-110">
            Check My Business Now - It's Free →
          </Link>
          <p className="mt-3 text-sm text-gray-500">Takes less than 30 seconds. No credit card required.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-300">
            <span className="rounded-full border border-white/10 bg-[#111111] px-3 py-1">🔒 Your data is secure</span>
            <span className="rounded-full border border-white/10 bg-[#111111] px-3 py-1">🇲🇾 Built for Malaysia</span>
            <span className="rounded-full border border-white/10 bg-[#111111] px-3 py-1">⚡ Results in seconds</span>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-xl font-bold">LULUS AI</p>
            <p className="mt-2 text-sm text-gray-400">AI Compliance Intelligence for Malaysian SMEs</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-300">Covering:</p>
            <p className="mt-2 text-sm text-gray-400">SSM · LHDN · JAKIM · EPF · SOCSO · HRDF · Local Council · MDEC</p>
          </div>
          <div className="space-y-2 text-sm">
            <Link href="/auth" className="block text-gray-300 hover:text-white">Get Started</Link>
            <Link href="/auth" className="block text-gray-300 hover:text-white">Log In</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-4 text-xs text-gray-500">
          <p>© 2025 LULUS AI. Built for Malaysian SMEs.</p>
          <p className="mt-1">This platform provides compliance guidance only. Always verify with the relevant government authority.</p>
        </div>
      </footer>
    </main>
  );
}

