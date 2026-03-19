"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatRM,
  getRiskColour,
  getRiskLevel,
  getStatusFromRisk,
  type ComplianceItem,
  type RiskData,
} from "@/lib/risk";

type Grant = {
  grant_name: string;
  grant_body: string;
  value_rm: number;
  eligibility_pct: number;
  apply_url: string;
};

const MOCK_RISK: RiskData = {
  overall_score: 72,
  risk_level: "HIGH",
  penalty_exposure: 72000,
  items_at_risk: 4,
  next_deadline: {
    name: "Premises Business Licence",
    days_away: 45,
    deadline: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
  },
  items: [],
  forecast: [
    {
      item_id: "forecast-1",
      item_name: "JAKIM Halal Certification",
      authority: "JAKIM",
      days_until_flip: 34,
      current_risk: 50,
      projected_risk: 95,
      flip_date: new Date(Date.now() + 34 * 86400000).toISOString(),
      priority: "HIGH",
    },
  ],
};

const MOCK_GRANTS: Grant[] = [
  {
    grant_name: "SME Digitalisation Grant",
    grant_body: "MDEC",
    value_rm: 5000,
    eligibility_pct: 92,
    apply_url: "https://mdec.my/",
  },
];

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

function daysAway(deadline: string | null): number | null {
  if (!deadline) return null;
  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((parsed.getTime() - Date.now()) / 86400000);
}

function RiskGauge({ score, animated = true }: { score: number; animated?: boolean }): JSX.Element {
  const radius = 80;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const prevScoreRef = useRef(0);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      prevScoreRef.current = score;
      return;
    }

    const start = performance.now();
    const duration = 1200;
    const from = prevScoreRef.current;
    const to = score;

    let raf = 0;
    const tick = (now: number): void => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuad(progress);
      const value = Math.round(from + (to - from) * eased);
      setDisplayScore(value);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevScoreRef.current = to;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, animated]);

  const fillLength = (displayScore / 100) * circumference;
  const ring = getRiskColour(displayScore);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center">
      <svg viewBox="0 0 220 220" className="h-56 w-56">
        <circle cx="110" cy="110" r={radius} strokeWidth={strokeWidth} stroke="#e5e7eb" fill="none" />
        <circle
          cx="110"
          cy="110"
          r={radius}
          strokeWidth={strokeWidth}
          stroke={ring.hex}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${fillLength} ${circumference}`}
          transform="rotate(-90 110 110)"
        />
        <text x="110" y="105" textAnchor="middle" className="fill-slate-900 text-4xl font-bold">
          {displayScore}
        </text>
        <text x="110" y="130" textAnchor="middle" className="fill-slate-500 text-sm font-medium">
          {getRiskLevel(displayScore)}
        </text>
      </svg>
      <p className="-mt-2 text-sm font-medium text-slate-600">Overall Compliance Risk</p>
    </div>
  );
}

function SkeletonCard(): JSX.Element {
  return <div className="h-32 animate-pulse rounded-lg bg-gray-200" />;
}

function statusBadge(status: ReturnType<typeof getStatusFromRisk>): { label: string; className: string } {
  if (status === "missing") return { label: "MISSING", className: "bg-red-100 text-red-800 border-red-300" };
  if (status === "expired") return { label: "EXPIRED", className: "bg-red-100 text-red-900 border-red-400" };
  if (status === "expiring") return { label: "EXPIRING SOON", className: "bg-orange-100 text-orange-800 border-orange-300" };
  if (status === "uploaded") return { label: "PENDING REVIEW", className: "bg-amber-100 text-amber-800 border-amber-300" };
  return { label: "COMPLIANT", className: "bg-green-100 text-green-800 border-green-300" };
}

function ComplianceItemCard({ item }: { item: ComplianceItem }): JSX.Element {
  const status = getStatusFromRisk(item);
  const badge = statusBadge(status);
  const scoreColours = getRiskColour(item.risk_score);
  const due = daysAway(item.deadline);

  return (
    <Link href={`/compliance/${item.id}`}>
      <Card className="h-full border transition hover:shadow-md">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
            <Badge className={`border ${badge.className}`}>{badge.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{item.authority}</Badge>
            <Badge className={`${scoreColours.bg} ${scoreColours.text} ${scoreColours.border} border`}>
              Risk: {item.risk_score}
            </Badge>
          </div>

          <p className="text-sm text-slate-600">
            {due === null ? "No deadline set" : due <= 0 ? "EXPIRED" : `${due} days remaining`}
          </p>

          {item.penalty_rm_min > 0 ? <p className="text-xs text-slate-500">Penalty: {formatRM(item.penalty_rm_min)}</p> : null}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage(): JSX.Element {
  const [riskData, setRiskData] = useState<RiskData>(MOCK_RISK);
  const [grants, setGrants] = useState<Grant[]>(MOCK_GRANTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const businessId = localStorage.getItem("compliance_copilot_business_id") ?? "mock-business-1";

    Promise.all([
      fetch(`/api/risk?businessId=${businessId}`).then((r) => r.json()),
      fetch(`/api/grants?businessId=${businessId}`).then((r) => r.json()),
    ])
      .then(([risk, grantData]) => {
        if (!mounted) return;
        setRiskData((risk as RiskData) ?? MOCK_RISK);

        const list = Array.isArray(grantData)
          ? (grantData as Grant[])
          : ((grantData as { grants?: Grant[] }).grants ?? MOCK_GRANTS);

        setGrants(list.length > 0 ? list : MOCK_GRANTS);
      })
      .catch((err) => {
        console.warn("Dashboard fetch failed, using mock data:", err);
        if (!mounted) return;
        setRiskData(MOCK_RISK);
        setGrants(MOCK_GRANTS);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const topGrant = useMemo(() => grants[0], [grants]);
  const businessName = useMemo(() => {
    if (typeof window === "undefined") return "Warung Mak Jah";
    return localStorage.getItem("compliance_copilot_business_name") ?? "Warung Mak Jah";
  }, []);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 pb-28 pt-6 md:px-8 md:pb-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Compliance Dashboard</h1>
        <p className="text-sm text-slate-600">{businessName}</p>
      </header>

      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : (
        <>
          <RiskGauge score={riskData.overall_score} animated />

          <section className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Penalty Exposure</p>
                <p className={`text-2xl font-bold ${riskData.penalty_exposure > 0 ? "text-red-700" : "text-green-700"}`}>
                  {formatRM(riskData.penalty_exposure)}
                </p>
                <p className="text-xs text-slate-500">if all overdue items enforced today</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Items at Risk</p>
                <p className={`text-2xl font-bold ${riskData.items_at_risk > 0 ? "text-red-700" : "text-green-700"}`}>
                  {riskData.items_at_risk} of {riskData.items.length}
                </p>
                <p className="text-xs text-slate-500">Compliance items at risk</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Next Deadline</p>
                <p
                  className={`text-2xl font-bold ${
                    riskData.next_deadline
                      ? riskData.next_deadline.days_away < 30
                        ? "text-red-700"
                        : riskData.next_deadline.days_away < 90
                          ? "text-amber-700"
                          : "text-green-700"
                      : "text-slate-700"
                  }`}
                >
                  {riskData.next_deadline ? `${riskData.next_deadline.days_away} days` : "No upcoming deadlines"}
                </p>
                <p className="text-xs text-slate-500">{riskData.next_deadline?.name ?? ""}</p>
              </CardContent>
            </Card>
          </section>

          {topGrant ? (
            <section className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p>
                You qualify for <strong>{topGrant.grant_name}</strong>
              </p>
              <p className="text-sm text-blue-900">
                {formatRM(topGrant.value_rm)} available - {topGrant.eligibility_pct}% eligible
              </p>
              <a href={topGrant.apply_url} target="_blank" className="mt-1 inline-block text-sm font-medium text-blue-700 underline">
                Apply Now {">"}
              </a>
            </section>
          ) : null}

          {riskData.forecast.length > 0 ? (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">90-Day Risk Forecast</h2>
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-1">
                  {riskData.forecast.map((forecast) => (
                    <div key={forecast.item_id} className="min-w-[280px] rounded-md border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
                      <p>
                        In {forecast.days_until_flip} days - {forecast.item_name} to HIGH risk
                      </p>
                      <p className="text-xs text-amber-800">
                        {forecast.authority} | {new Date(forecast.flip_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Your Compliance Items</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {riskData.items.map((item) => (
                <ComplianceItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 backdrop-blur md:static md:border-none md:bg-transparent md:p-0">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-4">
          <Button asChild className="bg-violet-600 text-white hover:bg-violet-700">
            <Link href="/upload">Upload Document</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/chat">Ask AI</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/alerts">Set Alerts</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/report">View Report</Link>
          </Button>
        </div>
      </nav>
    </main>
  );
}