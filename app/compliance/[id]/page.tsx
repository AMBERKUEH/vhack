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

  if (!item) return <main className="p-8">Loading item...</main>;

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader><CardTitle>{String(item.name)}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p>Authority: {String(item.authority ?? "-")}</p>
          <p>Deadline: {String(item.deadline ?? "-")}</p>
          <Badge variant="secondary">Status: {String(item.status ?? "pending")}</Badge>
          <p className="text-sm text-muted-foreground">AI guide: Upload latest doc, verify expiry, and set alerts for 90/30/7 days.</p>
        </CardContent>
      </Card>
    </main>
  );
}