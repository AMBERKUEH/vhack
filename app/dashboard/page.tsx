"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RiskPayload {
  overall_score: number;
  penalty_exposure: number;
  items: Array<{
    id: string;
    name: string;
    authority: string;
    deadline: string;
    status: string;
    risk_score: number;
    penalty_rm_min: number;
  }>;
  forecast: Array<{ name: string; days_until_flip: number; projected_risk: number }>;
}

function gaugeColor(score: number): string {
  if (score <= 30) return "text-emerald-600";
  if (score <= 60) return "text-amber-500";
  return "text-rose-600";
}

export default function DashboardPage(): JSX.Element {
  const [payload, setPayload] = useState<RiskPayload | null>(null);
  const [grants, setGrants] = useState<Array<{ grant_name: string; value_rm: number; apply_url: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const business = localStorage.getItem("cc_business");
    if (!business) return;

    const parsed = JSON.parse(business) as { id: string };

    Promise.all([
      fetch(`/api/risk?businessId=${parsed.id}`).then((r) => r.json()),
      fetch(`/api/grants?businessId=${parsed.id}`).then((r) => r.json()),
    ])
      .then(([riskData, grantData]) => {
        setPayload(riskData as RiskPayload);
        setGrants((grantData.grants ?? []) as Array<{ grant_name: string; value_rm: number; apply_url: string }>);
      })
      .finally(() => setLoading(false));
  }, []);

  const atRisk = useMemo(
    () => (payload?.items ?? []).filter((it) => it.risk_score >= 80).length,
    [payload],
  );

  if (loading || !payload) {
    return <main className="p-8">Loading dashboard...</main>;
  }

  const nextDeadline = [...payload.items].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
  const nextDays = Math.ceil((new Date(nextDeadline.deadline).getTime() - Date.now()) / 86400000);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <Card>
        <CardContent className="flex flex-col items-center py-8">
          <div className={`text-7xl font-bold transition-all ${gaugeColor(payload.overall_score)}`}>{payload.overall_score}</div>
          <p className="mt-2 text-sm text-muted-foreground">Overall Compliance Risk</p>
          <div className="mt-4 w-full max-w-lg">
            <Progress value={payload.overall_score} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><p className="text-sm">Penalty Exposure</p><p className="text-2xl font-bold text-rose-600">RM {payload.penalty_exposure.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm">Items at Risk</p><p className="text-2xl font-bold">{atRisk} of {payload.items.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm">Next Deadline</p><p className="text-2xl font-bold">{nextDays} days - {nextDeadline.name}</p></CardContent></Card>
      </div>

      {grants[0] ? (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex flex-col items-start justify-between gap-3 py-5 md:flex-row md:items-center">
            <p className="font-medium">You qualify for {grants[0].grant_name} - RM {grants[0].value_rm.toLocaleString()}</p>
            <Button asChild><a href={grants[0].apply_url} target="_blank">Apply Now {">"}</a></Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader><CardTitle>Compliance Items</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {payload.items.map((item) => (
            <Link href={`/compliance/${item.id}`} key={item.id} className="rounded-lg border p-4 hover:bg-slate-50">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{item.name}</h3>
                <Badge
                  variant={item.risk_score >= 90 ? "danger" : item.risk_score >= 80 ? "warning" : item.risk_score <= 30 ? "success" : "secondary"}
                >
                  {item.risk_score >= 90 ? "MISSING" : item.risk_score >= 80 ? "EXPIRING SOON" : item.risk_score <= 30 ? "COMPLIANT" : "PENDING"}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.authority}</p>
              <p className="mt-2 text-sm">Risk: {item.risk_score}</p>
              <p className="text-sm text-rose-600">Penalty: RM {item.penalty_rm_min.toLocaleString()}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>90-Day Forecast</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {payload.forecast.map((f) => (
            <Badge key={`${f.name}-${f.days_until_flip}`} variant="warning">In {f.days_until_flip} days: {f.name} to HIGH risk</Badge>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild variant="outline"><Link href="/upload">Upload Document</Link></Button>
        <Button asChild variant="outline"><Link href="/chat">Ask AI</Link></Button>
        <Button asChild variant="outline"><Link href="/alerts">Set Alerts</Link></Button>
        <Button asChild variant="outline"><Link href="/report">View Report</Link></Button>
      </div>
    </main>
  );
}