import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BellRing,
  Bot,
  BrainCircuit,
  Building2,
  CalendarClock,
  ChartLine,
  CheckCircle2,
  Database,
  FileSearch,
  Gauge,
  Gift,
  HandCoins,
  LayoutDashboard,
  MessageSquareText,
  Scale,
  ScanSearch,
  ShieldCheck,
  Siren,
  TrendingDown,
  Workflow,
} from "lucide-react";
import Demo from "@/demo";

const pillars = [
  {
    icon: Gauge,
    title: "Live Compliance Health Score",
    detail: "Sensor-like risk score across seven regulatory domains with trend and confidence.",
  },
  {
    icon: Siren,
    title: "Penalty Exposure Estimator",
    detail: "Converts missed actions into projected MYR penalty so owners can prioritize by cost.",
  },
  {
    icon: BrainCircuit,
    title: "90-Day Predictive Forecast",
    detail: "Prevents deadline failure with upcoming risk hotspots and remediation suggestions.",
  },
  {
    icon: MessageSquareText,
    title: "RAG Copilot (BM + English)",
    detail: "Answers in Bahasa Rojak with citations from official guidance documents.",
  },
];

const domains = [
  ["LHDN", "E-invoice format delays", "Up to RM20,000"],
  ["SSM", "Annual return missed", "Compound + late filing fees"],
  ["EPF", "Contribution mismatch", "Dividends + fines"],
  ["PERKESO", "Late SOCSO remittance", "Penalty interest"],
  ["JAKIM", "Halal cert renewal overdue", "Suspension risk"],
  ["MOH", "Food labeling gaps", "Notice + enforcement"],
  ["Local Council", "License expiry", "Summons / closure risk"],
];

const demoFlow = [
  ["01", "Prompt-first onboarding", "Owner describes business in campur language; AI auto-classifies obligations."],
  ["02", "Risk score initializes", "Dashboard starts at 74 (amber) with RM72,000 total exposure."],
  ["03", "Upload SSM cert", "Document parser extracts fields and lowers SSM risk instantly."],
  ["04", "Anomaly warning", "Name mismatch flagged before audit issue appears."],
  ["05", "Grant match found", "SME Digitalisation Grant shown with estimated eligibility."],
  ["06", "Alert automation", "WhatsApp reminders scheduled for next 30/14/7 day deadlines."],
  ["07", "Healthy state", "Score lands at 28 (green), projected penalty moves to RM0."],
];

const stack = [
  { icon: LayoutDashboard, title: "Next.js / React UI", value: "Operator-friendly dashboard" },
  { icon: Database, title: "Supabase + pgvector", value: "Regulation KB + semantic search" },
  { icon: Bot, title: "OpenAI + Gemini", value: "Reasoning, OCR parsing, Q&A" },
  { icon: Workflow, title: "Automation Layer", value: "Alerts, tasks, and deadline runbooks" },
];

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
        <ShieldCheck className="h-3.5 w-3.5" />
        Compliance Copilot v2
      </p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
      <p className="mt-3 text-pretty text-sm text-slate-600 md:text-base">{subtitle}</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Compliance Copilot v2
          </div>
          <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#overview" className="hover:text-slate-900">Overview</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#demo" className="hover:text-slate-900">Demo Flow</a>
            <a href="#architecture" className="hover:text-slate-900">Architecture</a>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500">
            View Pitch Deck
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main>
        <section id="overview" className="relative overflow-hidden px-4 pb-20 pt-16 md:px-8 md:pt-24">
          <div className="hero-gradient pointer-events-none absolute inset-0 opacity-90" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 shadow-sm">
                Hackathon Theme
                <span className="text-slate-400">Predictive Maintenance for SME Resilience</span>
              </p>
              <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
                AI compliance health system for Malaysian SMEs, not just a checklist.
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base text-slate-600 md:text-lg">
                Compliance Copilot v2 models regulatory risk like machine telemetry: monitor signals, forecast failure,
                and intervene before penalties hit.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current Score</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-600">74 / 100</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Penalty Exposure</p>
                  <p className="mt-1 text-2xl font-semibold text-rose-600">RM72,000</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Target State</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-600">RM0 + Score 28</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <img
                src="https://images.unsplash.com/photo-1551281044-8b5bd3f4f79f?auto=format&fit=crop&w=1200&q=80"
                alt="Analytics dashboard on laptop for risk monitoring"
                className="h-64 w-full rounded-2xl object-cover md:h-80"
              />
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <p className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Prompt-first onboarding in BM, English, or mixed language
                </p>
                <p className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  RAG coverage across LHDN, SSM, EPF, PERKESO, JAKIM
                </p>
                <p className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  WhatsApp deadline alerts + anomaly checks on uploads
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Core Product Capabilities"
              subtitle="Every module maps to predictive maintenance: sense, predict, act, and prove with citations."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {pillars.map(({ icon: Icon, title, detail }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <Icon className="h-5 w-5 text-violet-600" />
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Regulatory Surface and Penalty Reality"
              subtitle="The problem is fragmented obligations. Missing one deadline can trigger real financial damage."
            />
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Body</th>
                    <th className="px-4 py-3 font-medium">Common Violation</th>
                    <th className="px-4 py-3 font-medium">Estimated Penalty</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map(([body, violation, penalty]) => (
                    <tr key={body} className="border-t border-slate-200 odd:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">{body}</td>
                      <td className="px-4 py-3 text-slate-600">{violation}</td>
                      <td className="px-4 py-3 text-rose-700">{penalty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="demo" className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="10-Minute Judge Demo Storyline"
              subtitle="A clear narrative arc from high exposure to healthy compliance state."
            />
            <div className="grid gap-4 lg:grid-cols-2">
              {demoFlow.map(([step, label, detail]) => (
                <article key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-violet-100 text-center text-sm font-semibold leading-10 text-violet-700">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{label}</h3>
                    <p className="mt-1 text-sm text-slate-600">{detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="architecture" className="bg-slate-900 px-4 py-20 text-slate-100 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="System Architecture"
              subtitle="Production-oriented stack from the PRD: Next.js + Supabase + pgvector + OpenAI + Gemini."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stack.map(({ icon: Icon, title, value }) => (
                <article key={title} className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                  <Icon className="h-5 w-5 text-emerald-400" />
                  <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{value}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-amber-300">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Signal
                </p>
                <p className="mt-2 text-sm text-slate-300">74 score, three red deadlines, RM72,000 projected impact.</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-sky-300">
                  <FileSearch className="h-4 w-4" />
                  AI Actions
                </p>
                <p className="mt-2 text-sm text-slate-300">OCR parsing, anomaly flags, risk recalc, and source-cited Q&A.</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
                  <TrendingDown className="h-4 w-4" />
                  Outcome
                </p>
                <p className="mt-2 text-sm text-slate-300">Score to 28 and projected penalties to RM0 with actionable timeline.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Differentiators vs Single-Use Compliance Tools"
              subtitle="Beyond invoicing: full lifecycle intelligence, forecasted risk, and government grant opportunities."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Scale className="h-5 w-5 text-violet-600" />
                <h3 className="mt-3 font-semibold">Penalty Estimator</h3>
                <p className="mt-2 text-sm text-slate-600">Monetizes compliance risk instead of showing generic task status.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Gift className="h-5 w-5 text-violet-600" />
                <h3 className="mt-3 font-semibold">Grant Matcher</h3>
                <p className="mt-2 text-sm text-slate-600">Reframes compliance as upside by surfacing relevant government grants.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <ScanSearch className="h-5 w-5 text-violet-600" />
                <h3 className="mt-3 font-semibold">Anomaly Detection</h3>
                <p className="mt-2 text-sm text-slate-600">Catches mismatches in uploaded docs before formal enforcement events.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <BellRing className="h-5 w-5 text-violet-600" />
                <h3 className="mt-3 font-semibold">WhatsApp Alerts</h3>
                <p className="mt-2 text-sm text-slate-600">Pushes reminders in the channel owners already use daily.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <ChartLine className="h-5 w-5 text-violet-600" />
                <h3 className="mt-3 font-semibold">Compliance Health Report</h3>
                <p className="mt-2 text-sm text-slate-600">Executive snapshot for owners, operators, and investors in one view.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <HandCoins className="h-5 w-5 text-violet-600" />
                <h3 className="mt-3 font-semibold">ROI Narrative</h3>
                <p className="mt-2 text-sm text-slate-600">Direct story: reduce fines, unlock grants, and save operator time.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Integration Component Preview</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-600">
                Your provided shadcn-style template has been copied into <code>@/components/ui/saa-s-template</code>
                and wired through <code>src/demo.tsx</code>. This card shows where that component can sit in the app.
              </p>
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <p className="text-sm text-slate-600">
                  Recommended placement: marketing route (<code>/landing</code>) while this page acts as the judge-ready
                  PRD walkthrough.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarClock className="h-4 w-4" />
                Expected Responsive Behavior
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Desktop: split hero and 4-column capability cards.</li>
                <li>Tablet: 2-column cards and compressed nav links.</li>
                <li>Mobile: stacked sections with fixed sticky CTA.</li>
                <li>Demo flow: sequential cards optimized for narration.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-20 text-slate-100 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-semibold tracking-tight">Copied Component (Live)</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Embedded below as delivered so you can validate styling and integration quickly.
            </p>
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-700">
              <Demo />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-xs text-slate-500 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            Compliance Copilot v2 Frontend Prototype
          </p>
          <p>Built for hackathon judging narrative and product walkthrough.</p>
        </div>
      </footer>
    </div>
  );
}