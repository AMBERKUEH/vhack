"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
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
      <Card className="h-full bg-neutral-900 border-neutral-800 transition hover:shadow-md hover:border-neutral-700">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">{item.name}</h3>
            <Badge className={`border ${badge.className}`}>{badge.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-neutral-700 text-neutral-300">{item.authority}</Badge>
            <Badge className={`${scoreColours.bg} ${scoreColours.text} ${scoreColours.border} border`}>
              Risk: {item.risk_score}
            </Badge>
          </div>

          <p className="text-sm text-neutral-400">
            {due === null ? "No deadline set" : due <= 0 ? "EXPIRED" : `${due} days remaining`}
          </p>

          {item.penalty_rm_min > 0 ? <p className="text-xs text-neutral-500">Penalty: {formatRM(item.penalty_rm_min)}</p> : null}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage(): JSX.Element {
  const router = useRouter();
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return null;
    return createClient(url, anon);
  }, []);

  const resolveBusinessIdFromLocal = (): string | null => {
    const explicit = localStorage.getItem("compliance_copilot_business_id");
    if (explicit) return explicit;
    const raw = localStorage.getItem("cc_business");
    if (!raw) return null;
    try {
      return (JSON.parse(raw) as { id?: string }).id ?? null;
    } catch {
      return null;
    }
  };

  const resolveBusinessId = async (): Promise<string | null> => {
    if (!supabase) return resolveBusinessIdFromLocal();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user?.email) return resolveBusinessIdFromLocal();

    const byUserId = await supabase
      .from("businesses")
      .select("id, name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let business = byUserId.data;
    if (!business) {
      const byEmail = await supabase
        .from("businesses")
        .select("id, name")
        .eq("owner_email", user.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      business = byEmail.data;
    }

    if (business?.id) {
      localStorage.setItem("compliance_copilot_business_id", business.id);
      localStorage.setItem("compliance_copilot_business_name", business.name ?? "-");
      return business.id;
    }

    return resolveBusinessIdFromLocal();
  };

  const fetchDashboardData = async (businessId: string): Promise<void> => {
    const [risk, grantData] = await Promise.all([
      fetch(`/api/risk?businessId=${businessId}`).then(async (r) => {
        if (!r.ok) throw new Error("Failed to fetch risk data");
        return (await r.json()) as RiskData;
      }),
      fetch(`/api/grants?businessId=${businessId}`).then(async (r) => {
        if (!r.ok) throw new Error("Failed to fetch grant data");
        const data = await r.json();
        return Array.isArray(data) ? (data as Grant[]) : ((data as { grants?: Grant[] }).grants ?? []);
      }),
    ]);

    setRiskData(risk);
    setGrants(grantData);
    setError(null);
  };

  useEffect(() => {
    let mounted = true;
    resolveBusinessId()
      .then((businessId) => {
        if (!businessId) {
          throw new Error("No business found. Please complete onboarding first.");
        }
        return fetchDashboardData(businessId);
      })
      .catch((err) => {
        console.error("Dashboard fetch failed:", err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onRiskUpdated = (): void => {
      resolveBusinessId()
        .then((businessId) => {
          if (!businessId) return;
          return fetchDashboardData(businessId);
        })
        .catch((err) => {
          console.error("Realtime refresh failed:", err);
        });
    };

    window.addEventListener("compliance-risk-updated", onRiskUpdated);
    window.addEventListener("storage", onRiskUpdated);
    return () => {
      window.removeEventListener("compliance-risk-updated", onRiskUpdated);
      window.removeEventListener("storage", onRiskUpdated);
    };
  }, []);

  const topGrant = useMemo(() => grants[0], [grants]);
  const businessName = useMemo(() => {
    if (typeof window === "undefined") return "-";
    return localStorage.getItem("compliance_copilot_business_name") ?? "-";
  }, []);

  const handleLogout = async (): Promise<void> => {
    if (!supabase) {
      document.cookie = "cc_auth=; Path=/; Max-Age=0; SameSite=Lax";
      router.push("/auth");
      return;
    }
    await supabase.auth.signOut();
    document.cookie = "cc_auth=; Path=/; Max-Age=0; SameSite=Lax";
    router.push("/auth");
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 pb-28 pt-6 md:px-8 md:pb-10">
      <header className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Compliance Dashboard</h1>
          <p className="text-sm text-neutral-400">{businessName}</p>
        </div>
        <LiquidGlassButton variant="outline" onClick={handleLogout}>
          Logout
        </LiquidGlassButton>
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
      ) : error || !riskData ? (
        <Card className="border-neutral-800 bg-neutral-900">
          <CardContent className="p-4 text-sm text-rose-300">{error ?? "Failed to load dashboard data."}</CardContent>
        </Card>
      ) : (
        <>
          <RiskGauge score={riskData.overall_score} animated />

          <section className="grid gap-4 md:grid-cols-3">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Penalty Exposure</p>
                <p className={`text-2xl font-bold ${riskData.penalty_exposure > 0 ? "text-red-400" : "text-green-400"}`}>
                  {formatRM(riskData.penalty_exposure)}
                </p>
                <p className="text-xs text-neutral-500">if all overdue items enforced today</p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Items at Risk</p>
                <p className={`text-2xl font-bold ${riskData.items_at_risk > 0 ? "text-red-400" : "text-green-400"}`}>
                  {riskData.items_at_risk} of {riskData.items.length}
                </p>
                <p className="text-xs text-neutral-500">Compliance items at risk</p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Next Deadline</p>
                <p
                  className={`text-2xl font-bold ${
                    riskData.next_deadline
                      ? riskData.next_deadline.days_away < 30
                        ? "text-red-400"
                        : riskData.next_deadline.days_away < 90
                          ? "text-amber-400"
                          : "text-green-400"
                      : "text-neutral-400"
                  }`}
                >
                  {riskData.next_deadline ? `${riskData.next_deadline.days_away} days` : "No upcoming deadlines"}
                </p>
                <p className="text-xs text-neutral-500">{riskData.next_deadline?.name ?? ""}</p>
              </CardContent>
            </Card>
          </section>

          {topGrant ? (
            <section className="rounded-lg border border-blue-900/50 bg-blue-950/30 p-4">
              <p className="text-blue-200">
                You qualify for <strong>{topGrant.grant_name}</strong>
              </p>
              <p className="text-sm text-blue-300">
                {formatRM(topGrant.value_rm)} available - {topGrant.eligibility_pct}% eligible
              </p>
              <a href={topGrant.apply_url} target="_blank" className="mt-1 inline-block text-sm font-medium text-blue-400 underline">
                Apply Now {">"}
              </a>
            </section>
          ) : null}

          {riskData.forecast.length > 0 ? (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">90-Day Risk Forecast</h2>
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-1">
                  {riskData.forecast.map((forecast) => (
                    <div key={forecast.item_id} className="min-w-[280px] rounded-md border-l-4 border-amber-500 bg-amber-950/30 p-3 text-sm text-amber-200">
                      <p>
                        In {forecast.days_until_flip} days - {forecast.item_name} to HIGH risk
                      </p>
                      <p className="text-xs text-amber-400">
                        {forecast.authority} | {new Date(forecast.flip_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Your Compliance Items</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {riskData.items.map((item) => (
                <ComplianceItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-900/95 p-3 backdrop-blur md:static md:border-none md:bg-transparent md:p-0">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-4">
          <LiquidGlassButton variant="primary" className="w-full">
            <Link href="/upload" className="flex items-center justify-center w-full">Upload Document</Link>
          </LiquidGlassButton>
          <LiquidGlassButton variant="outline" className="w-full">
            <Link href="/chat" className="flex items-center justify-center w-full">Ask AI</Link>
          </LiquidGlassButton>
          <LiquidGlassButton variant="outline" className="w-full">
            <Link href="/alerts" className="flex items-center justify-center w-full">Set Alerts</Link>
          </LiquidGlassButton>
          <LiquidGlassButton variant="outline" className="w-full">
            <Link href="/report" className="flex items-center justify-center w-full">View Report</Link>
          </LiquidGlassButton>
        </div>
      </nav>
    </main>
  );
}
