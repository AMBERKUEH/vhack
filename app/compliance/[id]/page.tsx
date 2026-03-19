"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ComplianceDetailPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const business = localStorage.getItem("cc_business");
    if (!business) return;
    const businessId = (JSON.parse(business) as { id: string }).id;
    fetch(`/api/compliance?businessId=${businessId}&id=${params.id}`)
      .then((r) => r.json())
      .then((d) => setItem((d.items ?? [])[0] ?? null));
  }, [params.id]);

  if (!item) return <main className="p-8 text-neutral-300">Loading item...</main>;

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader><CardTitle className="text-white">{String(item.name)}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-neutral-300">Authority: {String(item.authority ?? "-")}</p>
          <p className="text-neutral-300">Deadline: {String(item.deadline ?? "-")}</p>
          <Badge variant="secondary" className="bg-neutral-800 text-neutral-200">Status: {String(item.status ?? "pending")}</Badge>
          <p className="text-sm text-neutral-500">AI guide: Upload latest doc, verify expiry, and set alerts for 90/30/7 days.</p>
        </CardContent>
      </Card>
    </main>
  );
}