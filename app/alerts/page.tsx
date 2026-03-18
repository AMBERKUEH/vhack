"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AlertsPage(): JSX.Element {
  const router = useRouter();
  const [phone, setPhone] = useState("+60123456789");
  const [language, setLanguage] = useState<"en" | "bm">("bm");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (): Promise<void> => {
    const business = localStorage.getItem("cc_business");
    if (!business) return;
    const businessId = (JSON.parse(business) as { id: string }).id;

    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessId, phone, language }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`Success: ${data.alerts_scheduled} alerts scheduled.`);
      setTimeout(() => router.push("/dashboard"), 1200);
    } else {
      setMessage(data.error ?? "Failed to save alerts");
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-xl p-4 md:p-8">
      <Card>
        <CardHeader><CardTitle>WhatsApp Alert Setup</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+60123456789" />
          <Tabs value={language} onValueChange={(v) => setLanguage(v as "en" | "bm")}>
            <TabsList>
              <TabsTrigger value="bm">BM</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={submit} disabled={loading}>{loading ? "Saving..." : "Save Alerts"}</Button>
          {message ? <p className="text-sm">{message}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}