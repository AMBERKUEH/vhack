"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRM, getRiskColour, getStatusFromRisk, type ComplianceItem, type ForecastItem, type RiskData } from "@/lib/risk";

type Grant = {
  grant_name: string;
  grant_body: string;
  value_rm: number;
  eligibility_pct: number;
};

type ReportResponse = RiskData & {
  business: {
    id: string;
    name: string;
    type?: string;
    location?: string;
  };
  grants: Grant[];
  generated_at: string;
};

const MOCK_RISK: RiskData = {
  overall_score: 72,
  risk_level: "HIGH",
  penalty_exposure: 72000,
  items_at_risk: 4,
  next_deadline: null,
  items: [],
  forecast: [] as ForecastItem[],
};

const MOCK_REPORT: ReportResponse = {
  business: {
    id: "mock-business-1",
    name: "Warung Mak Jah",
    type: "fnb",
    location: "Subang Jaya",
  },
  ...MOCK_RISK,
  grants: [
    {
      grant_name: "SME Digitalisation Grant",
      grant_body: "MDEC",
      value_rm: 5000,
      eligibility_pct: 92,
    },
  ],
  generated_at: new Date().toISOString(),
};

function SkeletonCard(): JSX.Element {
  return <div className="h-24 animate-pulse rounded-lg bg-gray-200" />;
}

export default function ReportPage(): JSX.Element {
  const [report, setReport] = useState<ReportResponse>(MOCK_REPORT);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const businessId = localStorage.getItem("compliance_copilot_business_id") ?? "mock-business-1";

    fetch(`/api/report?businessId=${businessId}`)
      .then((r) => r.json())
      .then((data) => {
        setReport((data as ReportResponse) ?? MOCK_REPORT);
      })
      .catch((err) => {
        console.warn("Report fetch failed, using mock data:", err);
        setReport(MOCK_REPORT);
      })
      .finally(() => setLoading(false));
  }, []);

  const scoreColour = useMemo(() => getRiskColour(report.overall_score), [report.overall_score]);

  const copyLink = async (): Promise<void> => {
    await navigator.clipboard.writeText(window.location.href);
    setToast("Link copied to clipboard!");
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-6 md:px-8">
      <style>{`@media print { .no-print { display: none; } }`}</style>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-neutral-500">Compliance Copilot - Health Report</p>
                <CardTitle className="mt-2 text-3xl font-semibold text-white">{report.business.name}</CardTitle>
                <p className="text-sm text-neutral-400">
                  {report.business.type ?? "-"} | {report.business.location ?? "-"}
                </p>
                <p className="text-xs text-neutral-500">
                  Generated: {new Date(report.generated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>

              <div className="no-print flex gap-2">
                <Button variant="outline" onClick={() => window.print()} className="border-neutral-700 text-neutral-200 hover:bg-neutral-800">
                  Download PDF
                </Button>
                <Button onClick={copyLink} className="bg-blue-600 hover:bg-blue-700">Share Report</Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-5xl font-bold ${scoreColour.text}`}>{report.overall_score}</p>
                  <p className={`text-sm font-semibold ${scoreColour.text}`}>{report.risk_level}</p>
                </div>
                <p className={`text-lg font-semibold ${report.penalty_exposure > 0 ? "text-red-400" : "text-green-400"}`}>
                  {formatRM(report.penalty_exposure)}
                </p>
              </div>

              <div className="mt-3 h-3 w-full rounded-full bg-neutral-800">
                <div
                  className={`h-3 rounded-full ${scoreColour.bg.replace("100", "500").replace("200", "600")}`}
                  style={{ width: `${Math.min(100, Math.max(0, report.overall_score))}%` }}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">Compliance Items</h2>
              <div className="overflow-x-auto rounded-lg border border-neutral-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-950">
                    <tr>
                      <th className="px-3 py-2 text-neutral-300">Item Name</th>
                      <th className="px-3 py-2 text-neutral-300">Authority</th>
                      <th className="px-3 py-2 text-neutral-300">Deadline</th>
                      <th className="px-3 py-2 text-neutral-300">Status</th>
                      <th className="px-3 py-2 text-neutral-300">Risk</th>
                      <th className="px-3 py-2 text-neutral-300">Penalty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.map((item: ComplianceItem, idx) => {
                      const status = getStatusFromRisk(item);
                      const statusClass =
                        status === "compliant"
                          ? "text-green-400"
                          : status === "expiring" || status === "uploaded"
                            ? "text-orange-400"
                            : "font-semibold text-red-400";

                      return (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-neutral-900" : "bg-neutral-950"}>
                          <td className="px-3 py-2 text-neutral-200">{item.name}</td>
                          <td className="px-3 py-2 text-neutral-400">{item.authority}</td>
                          <td className="px-3 py-2 text-neutral-400">{item.deadline ?? "-"}</td>
                          <td className={`px-3 py-2 uppercase ${statusClass}`}>{status === "expiring" ? "EXPIRING SOON" : status}</td>
                          <td className="px-3 py-2 text-neutral-400">{item.risk_score}</td>
                          <td className="px-3 py-2 text-neutral-400">{formatRM(item.penalty_rm_min)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {report.forecast.length > 0 ? (
              <section>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">90-Day Forecast</h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  {report.forecast.map((f) => (
                    <li key={f.item_id}>In {f.days_until_flip} days - {f.item_name} will reach HIGH risk</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {report.grants.length > 0 ? (
              <section>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Eligible Grants</h2>
                <div className="space-y-1 text-sm">
                  {report.grants.map((grant) => (
                    <p key={`${grant.grant_name}-${grant.grant_body}`}>
                      {grant.grant_name} - {formatRM(grant.value_rm)} ({grant.grant_body})
                    </p>
                  ))}
                </div>
              </section>
            ) : null}

            <footer className="border-t pt-3 text-xs text-slate-500">
              <p>This report was generated by Compliance Copilot v2.</p>
              <p>For official compliance advice, consult a qualified advisor.</p>
              <p>{new Date(report.generated_at).toISOString()}</p>
            </footer>
          </CardContent>
        </Card>
      )}

      {toast ? (
        <div className="no-print fixed bottom-4 right-4 rounded-md bg-slate-900 px-3 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </main>
  );
}