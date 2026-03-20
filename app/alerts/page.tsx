"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

export default function AlertsPage(): JSX.Element {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [businessId, setBusinessId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState<"en" | "bm">("bm");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("compliance_copilot_business_id") ?? "";
    setBusinessId(id);
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, [supabase]);

  const saveAlerts = async (): Promise<void> => {
    if (!businessId || !email) return;
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessId, email, language }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "Failed to save alerts");
      return;
    }
    setMessage("Email alerts saved.");
  };

  const sendTest = async (): Promise<void> => {
    if (!businessId || !email) return;
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/alerts/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessId, test: true }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(res.ok ? "Test email sent." : data.error ?? "Failed to send test email");
  };

  return (
    <main className="mx-auto max-w-xl p-4 md:p-8">
      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-white">Email Alert Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            className="border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-500"
          />
          <Tabs value={language} onValueChange={(v) => setLanguage(v as "en" | "bm")}>
            <TabsList className="bg-neutral-800">
              <TabsTrigger value="bm" className="data-[state=active]:bg-neutral-700">BM</TabsTrigger>
              <TabsTrigger value="en" className="data-[state=active]:bg-neutral-700">English</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <Button onClick={saveAlerts} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Saving..." : "Save Alerts"}
            </Button>
            <Button onClick={sendTest} disabled={loading} variant="outline" className="border-neutral-700 text-neutral-200">
              Send Test Email
            </Button>
          </div>
          {message ? <p className="text-sm text-neutral-300">{message}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}

