"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, type User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

type Business = {
  id: string;
  name: string;
  type: string;
  location: string;
  employees: number;
  channels?: string[];
  product_type?: string;
};

function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export default function CopilotPage(): JSX.Element {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);

  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState("Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      if (!sessionUser) router.replace("/");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (!sessionUser) router.replace("/");
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const onSemak = async (): Promise<void> => {
    if (!user?.email) {
      setError("Please login first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Onboarding failed");

      setBusiness(data.business as Business);
      localStorage.setItem("cc_business", JSON.stringify(data.business));
      localStorage.setItem("cc_profile", JSON.stringify(data.business));
      localStorage.setItem("cc_grants", JSON.stringify(data.grant_matches));
      localStorage.setItem("cc_items", JSON.stringify(data.compliance_items));
      localStorage.setItem("compliance_copilot_business_id", data.business.id);
      localStorage.setItem("compliance_copilot_business_name", data.business.name);
      setShowConfirm(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const confirmProfile = (): void => {
    if (!business) return;
    localStorage.setItem("cc_profile", JSON.stringify(business));
    setShowConfirm(false);
    router.push("/dashboard");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-36 pt-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="space-y-3 text-center">
          <h1 className="text-5xl font-semibold leading-tight text-white md:text-6xl">Compliance Copilot</h1>
          <p className="text-lg text-neutral-300 md:text-xl">Ceritakan tentang perniagaan anda / Tell us about your business</p>
        </header>

        <Card className="border-neutral-800 bg-neutral-900/90">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Ask like ChatGPT style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-[220px] resize-none rounded-2xl border-neutral-700 bg-neutral-950 text-lg text-white placeholder:text-neutral-500"
              placeholder="Contoh: Saya jual nasi lemak kat Subang, ada 3 pekerja, jual online jugak..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <LiquidGlassButton className="h-12 w-full text-base" onClick={onSemak} disabled={loading || !user}>
              {loading ? "Memproses..." : "Semak Compliance Saya >"}
            </LiquidGlassButton>

            {!user ? <p className="text-sm text-neutral-400">Please login on the first page first.</p> : null}
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          </CardContent>
        </Card>
      </div>

      {showConfirm && business ? (
        <section className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-700 bg-neutral-900/95 backdrop-blur-md">
          <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-4">
            <p className="text-lg font-semibold text-white">Is this correct?</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-600 text-white">{business.name}</Badge>
              <Badge variant="secondary" className="bg-neutral-800 text-neutral-200">{business.type}</Badge>
              <Badge variant="outline" className="border-neutral-600 text-neutral-300">{business.location}</Badge>
              <Badge variant="outline" className="border-neutral-600 text-neutral-300">{business.employees} employees</Badge>
              {business.product_type ? <Badge className="bg-emerald-700 text-white">{business.product_type}</Badge> : null}
              {(business.channels ?? []).map((channel) => (
                <Badge key={channel} variant="secondary" className="bg-neutral-800 text-neutral-200">
                  {channel}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <LiquidGlassButton className="w-full md:w-auto" onClick={confirmProfile}>
                Yes, looks right {" >"}
              </LiquidGlassButton>
              <LiquidGlassButton variant="outline" className="w-full md:w-auto" onClick={() => setShowConfirm(false)}>
                Edit
              </LiquidGlassButton>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
