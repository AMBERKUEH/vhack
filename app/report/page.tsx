"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReportPayload = {
  business: { id: string; name: string };
  generated_at: string;
  overall_score: number;
  penalty_exposure: number;
  items: Array<{ id: string; name: string; status: string; risk_score: number; deadline: string }>;
  grants: Array<{ grant_name: string; value_rm: number; eligibility_pct: number }>;
};

export default function ReportPage(): JSX.Element {
  const [report, setReport] = useState<ReportPayload | null>(null);
  const shareUrl = useMemo(() => `${typeof window !== "undefined" ? window.location.origin : ""}/report?share=demo`, []);

  useEffect(() => {
    const business = localStorage.getItem("cc_business");
    if (!business) return;
    const businessId = (JSON.parse(business) as { id: string }).id;

    fetch(`/api/report?businessId=${businessId}`)
      .then((r) => r.json())
      .then((d) => setReport(d as ReportPayload));
  }, []);

  if (!report) return <main className="p-8">Loading report...</main>;

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 md:p-8 print:p-0">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Health Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Business: {report.business.name}</p>
          <p>Overall Score: {report.overall_score}</p>
          <p>Date: {new Date(report.generated_at).toLocaleString()}</p>
          <p className="text-rose-600">Penalty Exposure: RM {report.penalty_exposure.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Compliance Items</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Risk</th>
                  <th className="p-2 text-left">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {report.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2">{item.risk_score}</td>
                    <td className="p-2">{item.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Eligible Grants</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {report.grants.map((g) => (
            <p key={g.grant_name}>{g.grant_name} - RM {g.value_rm.toLocaleString()} ({g.eligibility_pct}%)</p>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button onClick={() => navigator.clipboard.writeText(shareUrl)}>Share Report</Button>
        <Button variant="outline" onClick={() => window.print()}>Download PDF</Button>
      </div>
    </main>
  );
}